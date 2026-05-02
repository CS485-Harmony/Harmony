'use client';

/**
 * Shared audio test sub-components used by both the full AudioSettingsSection
 * (user settings page) and the inline VoiceSettingsPopover (status bar).
 */

import { useState, useRef, useEffect, useCallback } from 'react';

// ─── Mic level meter ──────────────────────────────────────────────────────────

export function MicLevelMeter({ deviceId }: { deviceId: string }) {
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

      // Pin to 48 kHz to match VoiceContext and avoid exclusive-mode conflicts.
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

  // Stop when the component unmounts or the selected device changes.
  useEffect(() => stop, [stop]);

  return (
    <div className='mt-2 flex flex-col gap-1.5'>
      <button
        type='button'
        onClick={active ? stop : start}
        className={`w-fit rounded px-2.5 py-1 text-xs font-medium transition-colors ${
          active
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        }`}
      >
        {active ? 'Stop Test' : 'Test Mic'}
      </button>
      {active && (
        <div className='flex items-center gap-2'>
          <div
            className='h-1.5 w-36 overflow-hidden rounded-full bg-[#111214]'
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
          <span className='text-[11px] text-gray-400'>Input level</span>
        </div>
      )}
      {error && <p className='text-[11px] text-red-400'>{error}</p>}
    </div>
  );
}

// ─── Speaker test ─────────────────────────────────────────────────────────────

/**
 * Plays a 440 Hz tone through the selected output device via
 * MediaStreamDestination → HTMLAudioElement + setSinkId.
 */
export function SpeakerTest({ deviceId }: { deviceId: string }) {
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Refs for cleanup on unmount while tone is playing.
  const ctxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    return () => {
      // If the component unmounts while the tone is still playing, cancel it.
      try { oscillatorRef.current?.stop(); } catch { /* already stopped */ }
      void ctxRef.current?.close();
      ctxRef.current = null;
      oscillatorRef.current = null;
    };
  }, []);

  async function handleTest() {
    if (playing) return;
    setPlaying(true);
    setError(null);

    // Declare ctx outside try so catch can close it if audio.play() rejects.
    let ctx: AudioContext | undefined;
    try {
      ctx = new AudioContext({ sampleRate: 48000 });
      ctxRef.current = ctx;
      const destination = ctx.createMediaStreamDestination();

      const oscillator = ctx.createOscillator();
      oscillatorRef.current = oscillator;
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
        void ctx!.close();
        ctxRef.current = null;
        oscillatorRef.current = null;
        setPlaying(false);
      };
    } catch {
      // Close ctx if audio.play() rejected before oscillator.onended could run.
      void ctx?.close();
      ctxRef.current = null;
      oscillatorRef.current = null;
      setError('Could not play test tone.');
      setPlaying(false);
    }
  }

  return (
    <div className='mt-2 flex flex-col gap-1.5'>
      <button
        type='button'
        onClick={handleTest}
        disabled={playing}
        className='w-fit rounded px-2.5 py-1 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50'
      >
        {playing ? 'Playing…' : 'Test Speaker'}
      </button>
      {error && <p className='text-[11px] text-red-400'>{error}</p>}
    </div>
  );
}
