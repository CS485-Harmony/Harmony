/**
 * Audio Settings Section (Issue #603)
 *
 * Lets users pick their preferred microphone (audioinput) and speaker
 * (audiooutput) devices. Selections are persisted to localStorage and
 * consumed by VoiceContext when joining a call.
 *
 * Device labels require microphone permission. If permission has not been
 * granted, a prompt button requests it and re-enumerates afterward.
 *
 * setSinkId for output routing has broad but not universal browser support;
 * a warning is shown when the API is absent.
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  AUDIO_INPUT_DEVICE_KEY,
  AUDIO_OUTPUT_DEVICE_KEY,
  loadStoredDeviceId,
  saveDeviceId,
} from '@/lib/audio-device-settings';

interface AudioDevice {
  deviceId: string;
  label: string;
}

async function enumerateDevices(): Promise<{ inputs: AudioDevice[]; outputs: AudioDevice[] }> {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const inputs = devices
    .filter(d => d.kind === 'audioinput')
    .map(d => ({ deviceId: d.deviceId, label: d.label || `Microphone (${d.deviceId.slice(0, 8)})` }));
  const outputs = devices
    .filter(d => d.kind === 'audiooutput')
    .map(d => ({ deviceId: d.deviceId, label: d.label || `Speaker (${d.deviceId.slice(0, 8)})` }));
  return { inputs, outputs };
}

export function AudioSettingsSection() {
  const [inputs, setInputs] = useState<AudioDevice[]>([]);
  const [outputs, setOutputs] = useState<AudioDevice[]>([]);
  const [selectedInput, setSelectedInput] = useState<string>('default');
  const [selectedOutput, setSelectedOutput] = useState<string>('default');
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);
  const [testingMic, setTestingMic] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [micTestError, setMicTestError] = useState<string | null>(null);
  const sinkIdSupported = typeof HTMLMediaElement !== 'undefined' && 'setSinkId' in HTMLMediaElement.prototype;

  const testStreamRef = useRef<MediaStream | null>(null);
  const testIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const refreshDevices = useCallback(async () => {
    try {
      const { inputs: newInputs, outputs: newOutputs } = await enumerateDevices();
      setInputs(newInputs);
      setOutputs(newOutputs);

      // Labels are empty strings until permission is granted.
      const hasLabels = newInputs.some(d => d.label && !d.label.startsWith('Microphone ('));
      setNeedsPermission(!hasLabels && newInputs.length > 0);

      // If the previously selected device is no longer present, reset to default.
      const inputIds = new Set(newInputs.map(d => d.deviceId));
      setSelectedInput(prev => {
        if (prev !== 'default' && !inputIds.has(prev)) {
          saveDeviceId(AUDIO_INPUT_DEVICE_KEY, 'default');
          return 'default';
        }
        return prev;
      });
      const outputIds = new Set(newOutputs.map(d => d.deviceId));
      setSelectedOutput(prev => {
        if (prev !== 'default' && !outputIds.has(prev)) {
          saveDeviceId(AUDIO_OUTPUT_DEVICE_KEY, 'default');
          return 'default';
        }
        return prev;
      });
    } catch {
      // enumerateDevices is not available (unlikely in modern browsers).
    }
  }, []);

  const stopMicTest = useCallback(() => {
    if (testIntervalRef.current !== null) {
      clearInterval(testIntervalRef.current);
      testIntervalRef.current = null;
    }
    if (testStreamRef.current) {
      testStreamRef.current.getTracks().forEach(t => t.stop());
      testStreamRef.current = null;
    }
    if (audioCtxRef.current) {
      void audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    setMicLevel(0);
    setTestingMic(false);
  }, []);

  useEffect(() => {
    setSelectedInput(loadStoredDeviceId(AUDIO_INPUT_DEVICE_KEY));
    setSelectedOutput(loadStoredDeviceId(AUDIO_OUTPUT_DEVICE_KEY));
    void refreshDevices();

    if (!navigator.mediaDevices) return;
    const handleDeviceChange = () => void refreshDevices();
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
      stopMicTest();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startMicTest = useCallback(async () => {
    if (testingMic) {
      stopMicTest();
      return;
    }
    setMicTestError(null);
    try {
      const constraints: MediaStreamConstraints = {
        audio: selectedInput && selectedInput !== 'default'
          ? { deviceId: { exact: selectedInput } }
          : true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      testStreamRef.current = stream;

      const ctx = new AudioContext({ sampleRate: 48000 });
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.4;
      source.connect(analyser);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;

      setTestingMic(true);
      const buffer = new Uint8Array(analyser.frequencyBinCount);
      testIntervalRef.current = setInterval(() => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(buffer);
        const avg = buffer.reduce((s, v) => s + v, 0) / buffer.length;
        setMicLevel(Math.min(100, Math.round((avg / 255) * 100 * 3)));
      }, 100);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setPermissionDenied(true);
      } else {
        setMicTestError('Could not start mic test — device may be unavailable.');
      }
      stopMicTest();
    }
  }, [testingMic, selectedInput, stopMicTest]);

  const requestPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      setPermissionDenied(false);
      await refreshDevices();
    } catch (err) {
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setPermissionDenied(true);
      }
    }
  }, [refreshDevices]);

  function handleInputChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;
    setSelectedInput(id);
    saveDeviceId(AUDIO_INPUT_DEVICE_KEY, id);
  }

  function handleOutputChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;
    setSelectedOutput(id);
    saveDeviceId(AUDIO_OUTPUT_DEVICE_KEY, id);
  }

  return (
    <div className='flex flex-col gap-6'>
      <h2 className='text-xl font-semibold text-white'>Audio</h2>

      {permissionDenied && (
        <div className='rounded-lg border border-red-500/30 bg-red-950/20 p-3 text-sm text-red-400'>
          Microphone access was denied. Click the lock icon in your browser&apos;s address bar to
          allow microphone permission, then refresh this page.
        </div>
      )}

      {needsPermission && !permissionDenied && (
        <div className='flex items-center justify-between rounded-lg bg-[#2b2d31] p-4'>
          <p className='text-sm text-gray-300'>
            Grant microphone permission to see device names.
          </p>
          <button
            onClick={requestPermission}
            className='rounded bg-[#5865f2] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#4752c4]'
          >
            Allow Microphone
          </button>
        </div>
      )}

      <div className='flex flex-col gap-4 rounded-lg bg-[#2b2d31] p-4'>
        <h3 className='text-xs font-bold uppercase tracking-wide text-gray-400'>Input Device</h3>

        <div>
          <label htmlFor='audioInput' className='mb-1.5 block text-xs font-bold uppercase text-gray-400'>
            Microphone
          </label>
          <select
            id='audioInput'
            value={selectedInput}
            onChange={handleInputChange}
            className='w-full rounded bg-[#1e1f22] px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#5865f2]'
          >
            <option value='default'>Default Microphone</option>
            {inputs.map(d => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Mic level meter */}
        <div>
          <div className='mb-1.5 flex items-center justify-between'>
            <span className='text-xs font-bold uppercase text-gray-400'>Input Level</span>
            <button
              onClick={startMicTest}
              className='rounded bg-[#3d4148] px-3 py-1 text-xs font-medium text-gray-300 transition-colors hover:bg-[#4a4f58] hover:text-white'
            >
              {testingMic ? 'Stop Test' : 'Test Microphone'}
            </button>
          </div>
          <div className='h-2 w-full overflow-hidden rounded-full bg-[#1e1f22]'>
            <div
              className='h-full rounded-full bg-green-500 transition-all duration-100'
              style={{ width: `${micLevel}%` }}
              role='meter'
              aria-label='Microphone input level'
              aria-valuenow={micLevel}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          {testingMic && (
            <p className='mt-1 text-xs text-gray-500'>Speak to test your microphone level.</p>
          )}
          {micTestError && (
            <p className='mt-1 text-xs text-red-400'>{micTestError}</p>
          )}
        </div>
      </div>

      <div className='flex flex-col gap-4 rounded-lg bg-[#2b2d31] p-4'>
        <h3 className='text-xs font-bold uppercase tracking-wide text-gray-400'>Output Device</h3>

        <div>
          <label htmlFor='audioOutput' className='mb-1.5 block text-xs font-bold uppercase text-gray-400'>
            Speaker / Headphones
          </label>
          {sinkIdSupported ? (
            <select
              id='audioOutput'
              value={selectedOutput}
              onChange={handleOutputChange}
              className='w-full rounded bg-[#1e1f22] px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#5865f2]'
            >
              <option value='default'>Default Speaker</option>
              {outputs.map(d => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label}
                </option>
              ))}
            </select>
          ) : (
            <div className='rounded bg-[#1e1f22] p-3'>
              <p className='text-sm text-gray-400'>
                Output device selection is not supported in this browser. Use your operating
                system&apos;s audio settings to change the output device.
              </p>
            </div>
          )}
        </div>
      </div>

      <p className='text-xs text-gray-500'>
        Selected devices are saved locally and applied when you join a voice channel.
      </p>
    </div>
  );
}
