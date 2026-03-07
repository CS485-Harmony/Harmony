import { assertDemoSeedAllowed, enableDemoSeed } from '../src/dev/demoSeed';

describe('assertDemoSeedAllowed', () => {
  it('rejects runs that are not explicitly marked as demo', () => {
    expect(() => assertDemoSeedAllowed({ HARMONY_DEMO_MODE: 'false' })).toThrow(
      'Demo seed is disabled.',
    );
  });

  it('allows demo runs when the demo flag is enabled', () => {
    expect(() => assertDemoSeedAllowed({ HARMONY_DEMO_MODE: 'true' })).not.toThrow();
  });
});

describe('enableDemoSeed', () => {
  it('enables the production mock-seed override for the explicit demo path', () => {
    const env: NodeJS.ProcessEnv = {};

    enableDemoSeed(env);

    expect(env.HARMONY_ALLOW_MOCK_SEED).toBe('true');
  });
});
