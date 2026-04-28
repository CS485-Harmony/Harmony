describe('getCloudFixture cache behavior', () => {
  const originalTestTarget = process.env.TEST_TARGET;
  const originalFetch = global.fetch;

  async function loadCloudEnvModule() {
    process.env.TEST_TARGET = 'cloud';
    jest.resetModules();
    return import('./env');
  }

  afterEach(() => {
    jest.resetModules();
    process.env.TEST_TARGET = originalTestTarget;
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  test('clears a rejected discovery promise so a later call can retry', async () => {
    const fetchMock = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify([{ id: 'server-1', slug: 'harmony-hq' }]), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ channels: [{ slug: 'general' }] }), { status: 200 }),
      );
    global.fetch = fetchMock;

    const { getCloudFixture } = await loadCloudEnvModule();

    await expect(getCloudFixture()).rejects.toThrow(
      'Cloud fixture discovery failed: GET /api/public/servers returned 503',
    );

    const fixture = await getCloudFixture();

    expect(fixture).toEqual({
      serverId: 'server-1',
      serverSlug: 'harmony-hq',
      publicChannel: 'general',
      publicChannels: ['general'],
      publicChannelTargets: [{ serverSlug: 'harmony-hq', channelSlug: 'general' }],
    });

    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  test('reuses an in-flight discovery promise for concurrent callers', async () => {
    let resolveServers!: (value: Response) => void;
    const fetchMock = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockImplementationOnce(
        () =>
          new Promise<Response>((resolve) => {
            resolveServers = resolve;
          }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ channels: [{ slug: 'general' }] }), { status: 200 }),
      );
    global.fetch = fetchMock;

    const { getCloudFixture } = await loadCloudEnvModule();

    const firstCall = getCloudFixture();
    const secondCall = getCloudFixture();

    expect(fetchMock).toHaveBeenCalledTimes(1);

    resolveServers(
      new Response(JSON.stringify([{ id: 'server-1', slug: 'harmony-hq' }]), { status: 200 }),
    );

    const fixtures = await Promise.all([firstCall, secondCall]);

    expect(fixtures).toEqual([
      {
        serverId: 'server-1',
        serverSlug: 'harmony-hq',
        publicChannel: 'general',
        publicChannels: ['general'],
        publicChannelTargets: [{ serverSlug: 'harmony-hq', channelSlug: 'general' }],
      },
      {
        serverId: 'server-1',
        serverSlug: 'harmony-hq',
        publicChannel: 'general',
        publicChannels: ['general'],
        publicChannelTargets: [{ serverSlug: 'harmony-hq', channelSlug: 'general' }],
      },
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test('discovers up to 3 channels and populates publicChannels', async () => {
    const fetchMock = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValueOnce(
        new Response(JSON.stringify([{ id: 'server-1', slug: 'harmony-hq' }]), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            channels: [
              { slug: 'general' },
              { slug: 'announcements' },
              { slug: 'dev-updates' },
              { slug: 'fourth-channel' }, // should be truncated to 3
            ],
          }),
          { status: 200 },
        ),
      );
    global.fetch = fetchMock;

    const { getCloudFixture } = await loadCloudEnvModule();

    const fixture = await getCloudFixture();

    expect(fixture).toEqual({
      serverId: 'server-1',
      serverSlug: 'harmony-hq',
      publicChannel: 'general',
      publicChannels: ['general', 'announcements', 'dev-updates'],
      publicChannelTargets: [
        { serverSlug: 'harmony-hq', channelSlug: 'general' },
        { serverSlug: 'harmony-hq', channelSlug: 'announcements' },
        { serverSlug: 'harmony-hq', channelSlug: 'dev-updates' },
      ],
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test('collects crawler targets across multiple servers while keeping the primary fixture on the richest server', async () => {
    const fetchMock = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify([
            { id: 'server-1', slug: 'small-server' },
            { id: 'server-2', slug: 'larger-server' },
          ]),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            channels: [{ slug: 'one' }],
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            channels: [{ slug: 'two' }, { slug: 'three' }],
          }),
          { status: 200 },
        ),
      );
    global.fetch = fetchMock;

    const { getCloudFixture } = await loadCloudEnvModule();

    const fixture = await getCloudFixture();

    expect(fixture).toEqual({
      serverId: 'server-2',
      serverSlug: 'larger-server',
      publicChannel: 'two',
      publicChannels: ['two', 'three'],
      publicChannelTargets: [
        { serverSlug: 'larger-server', channelSlug: 'two' },
        { serverSlug: 'larger-server', channelSlug: 'three' },
        { serverSlug: 'small-server', channelSlug: 'one' },
      ],
    });
  });
});
