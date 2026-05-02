'use client';

import { useAudioDevices } from '@/hooks/useAudioDevices';
import { MicLevelMeter, SpeakerTest } from './AudioDeviceTests';

// ─── Main component ───────────────────────────────────────────────────────────

export function AudioSettingsSection() {
  const {
    inputDevices,
    outputDevices,
    selectedInputId,
    selectedOutputId,
    setSelectedInputId,
    setSelectedOutputId,
    supportsOutputSelection,
    permissionDenied,
    requestPermission,
  } = useAudioDevices();

  // Device labels are empty strings until microphone permission is granted.
  const hasLabels = inputDevices.some(d => d.label && !d.label.startsWith('Microphone ('));
  const needsPermission = !hasLabels && inputDevices.length <= 1;

  return (
    <div className='space-y-8'>
      <h2 className='text-xl font-semibold text-white'>Voice &amp; Audio</h2>

      {/* Input device */}
      <section>
        <h3 className='mb-1 text-base font-semibold text-white'>Input Device</h3>
        <p className='mb-3 text-sm text-gray-400'>
          The microphone used when you join a voice channel.
        </p>

        {needsPermission ? (
          <div className='space-y-2'>
            <p className='text-sm text-yellow-400'>
              Grant microphone permission to see your available devices.
            </p>
            {permissionDenied ? (
              <p className='text-xs text-red-400'>
                Microphone access was denied. Allow it in your browser settings and reload the page.
              </p>
            ) : (
              <button
                type='button'
                onClick={requestPermission}
                className='rounded px-3 py-1.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors'
              >
                Allow Microphone Access
              </button>
            )}
          </div>
        ) : (
          <>
            <select
              id='audio-input-device'
              value={selectedInputId}
              onChange={e => setSelectedInputId(e.target.value)}
              className='rounded bg-[#1e1f22] px-3 py-1.5 text-sm text-gray-200 border border-[#3d4148] focus:outline-none focus:border-indigo-500'
              aria-label='Input device'
            >
              <option value='default'>Default</option>
              {inputDevices
                .filter(d => d.deviceId !== 'default')
                .map(d => (
                  <option key={d.deviceId} value={d.deviceId}>
                    {d.label}
                  </option>
                ))}
            </select>
            <MicLevelMeter deviceId={selectedInputId} />
          </>
        )}
      </section>

      {/* Output device */}
      <section>
        <h3 className='mb-1 text-base font-semibold text-white'>Output Device</h3>
        <p className='mb-3 text-sm text-gray-400'>
          The speaker or headphones used for incoming voice channel audio.
        </p>

        {!supportsOutputSelection ? (
          <p className='text-sm text-yellow-400'>
            Output device selection is not supported in this browser. Use your OS audio settings
            instead.
          </p>
        ) : outputDevices.length === 0 ? (
          <p className='text-sm text-gray-400'>No output devices found.</p>
        ) : (
          <>
            <select
              id='audio-output-device'
              value={selectedOutputId}
              onChange={e => setSelectedOutputId(e.target.value)}
              className='rounded bg-[#1e1f22] px-3 py-1.5 text-sm text-gray-200 border border-[#3d4148] focus:outline-none focus:border-indigo-500'
              aria-label='Output device'
            >
              <option value='default'>Default</option>
              {outputDevices
                .filter(d => d.deviceId !== 'default')
                .map(d => (
                  <option key={d.deviceId} value={d.deviceId}>
                    {d.label}
                  </option>
                ))}
            </select>
            <SpeakerTest deviceId={selectedOutputId} />
            <p className='mt-1 text-xs text-gray-500'>
              Changes take effect the next time you join a voice channel.
            </p>
          </>
        )}
      </section>
    </div>
  );
}
