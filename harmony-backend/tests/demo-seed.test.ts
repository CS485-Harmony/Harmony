import { assertDemoSeedAllowed } from '../src/dev/demoSeed';

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
