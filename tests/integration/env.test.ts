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

    await expect(getCloudFixture()).resolves.toEqual({
      serverId: 'server-1',
      serverSlug: 'harmony-hq',
      publicChannel: 'general',
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

    await expect(Promise.all([firstCall, secondCall])).resolves.toEqual([
      {
        serverId: 'server-1',
        serverSlug: 'harmony-hq',
        publicChannel: 'general',
      },
      {
        serverId: 'server-1',
        serverSlug: 'harmony-hq',
        publicChannel: 'general',
      },
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
