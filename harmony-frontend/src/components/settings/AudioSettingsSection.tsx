'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAudioDevices } from '@/hooks/useAudioDevices';

// ─── Mic level meter ──────────────────────────────────────────────────────────

function MicLevelMeter({ deviceId }: { deviceId: string }) {
  const [level, setLevel] = useState(0);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (contextRef.current) {
      void contextRef.current.close();
      contextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setLevel(0);
    setActive(false);
  }, []);

  const start = useCallback(async () => {
    stop();
    try {
      const audio: MediaStreamConstraints['audio'] =
        deviceId && deviceId !== 'default' ? { deviceId: { exact: deviceId } } : true;
      const stream = await navigator.mediaDevices.getUserMedia({ audio });
      streamRef.current = stream;

      // Pin to 48 kHz to match VoiceContext's audio context and avoid exclusive-mode conflicts.
      const ctx = new AudioContext({ sampleRate: 48000 });
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.4;
      source.connect(analyser);
      contextRef.current = ctx;

      const buffer = new Uint8Array(analyser.frequencyBinCount);
      setActive(true);
      setError(null);

      intervalRef.current = setInterval(() => {
        analyser.getByteFrequencyData(buffer);
        const avg = buffer.reduce((s, v) => s + v, 0) / buffer.length;
        // Scale 0-255 byte average into a 0-100 percentage for the meter bar.
        setLevel(Math.min(100, (avg / 255) * 400));
      }, 100);
    } catch (err) {
      const msg =
        err instanceof DOMException && err.name === 'NotAllowedError'
          ? 'Microphone access denied.'
          : 'Could not access microphone.';
      setError(msg);
    }
  }, [deviceId, stop]);

  // Stop the test stream when the component unmounts or the device changes.
  useEffect(() => stop, [stop]);

  return (
    <div className='mt-3 flex flex-col gap-2'>
      <button
        type='button'
        onClick={active ? stop : start}
        className={`w-fit rounded px-3 py-1.5 text-sm font-medium transition-colors ${
          active
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        }`}
      >
        {active ? 'Stop Test' : 'Test Microphone'}
      </button>
      {active && (
        <div className='flex items-center gap-2'>
          <div
            className='h-2 w-48 overflow-hidden rounded-full bg-[#1e1f22]'
            role='meter'
            aria-label='Microphone input level'
            aria-valuenow={Math.round(level)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className='h-full rounded-full bg-green-500 transition-all duration-100'
              style={{ width: `${level}%` }}
            />
          </div>
          <span className='text-xs text-gray-400'>Input level</span>
        </div>
      )}
      {error && <p className='text-xs text-red-400'>{error}</p>}
    </div>
  );
}

// ─── Speaker test ─────────────────────────────────────────────────────────────

/**
 * Plays a 440 Hz tone for ~1 second through the selected output device.
 * Routes audio via MediaStreamDestination → HTMLAudioElement so setSinkId
 * can target the specific device without affecting other app audio.
 */
function SpeakerTest({ deviceId }: { deviceId: string }) {
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleTest() {
    if (playing) return;
    setPlaying(true);
    setError(null);

    try {
      const ctx = new AudioContext({ sampleRate: 48000 });
      const destination = ctx.createMediaStreamDestination();

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 440;
      // Fade out over 1 s so the tone ends cleanly without a click.
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);
      oscillator.connect(gain);
      gain.connect(destination);

      const audio = new Audio();
      audio.srcObject = destination.stream;

      if (deviceId && deviceId !== 'default' && 'setSinkId' in audio) {
        await (audio as HTMLAudioElement & { setSinkId: (id: string) => Promise<void> }).setSinkId(
          deviceId,
        );
      }

      oscillator.start();
      oscillator.stop(ctx.currentTime + 1.0);
      await audio.play();

      oscillator.onended = () => {
        audio.pause();
        audio.srcObject = null;
        void ctx.close();
        setPlaying(false);
      };
    } catch {
      setError('Could not play test tone. Check your output device.');
      setPlaying(false);
    }
  }

  return (
    <div className='mt-3 flex flex-col gap-2'>
      <button
        type='button'
        onClick={handleTest}
        disabled={playing}
        className='w-fit rounded px-3 py-1.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50'
      >
        {playing ? 'Playing…' : 'Test Speaker'}
      </button>
      {error && <p className='text-xs text-red-400'>{error}</p>}
    </div>
  );
}

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
