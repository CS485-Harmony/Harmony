'use client';

import { useState, useEffect, useCallback } from 'react';

const INPUT_KEY = 'harmony_audio_input_device_id';
const OUTPUT_KEY = 'harmony_audio_output_device_id';

export interface AudioDeviceInfo {
  deviceId: string;
  label: string;
  kind: 'audioinput' | 'audiooutput';
}

export interface UseAudioDevicesReturn {
  inputDevices: AudioDeviceInfo[];
  outputDevices: AudioDeviceInfo[];
  selectedInputId: string;
  selectedOutputId: string;
  setSelectedInputId: (id: string) => void;
  setSelectedOutputId: (id: string) => void;
  /** True when the browser supports HTMLMediaElement.setSinkId for output routing. */
  supportsOutputSelection: boolean;
  permissionDenied: boolean;
  requestPermission: () => Promise<void>;
}

function parseDeviceList(devices: MediaDeviceInfo[]): {
  inputs: AudioDeviceInfo[];
  outputs: AudioDeviceInfo[];
} {
  const inputs = devices
    .filter(d => d.kind === 'audioinput')
    .map(d => ({
      deviceId: d.deviceId,
      label: d.label || `Microphone (${d.deviceId.slice(0, 8)})`,
      kind: 'audioinput' as const,
    }));
  const outputs = devices
    .filter(d => d.kind === 'audiooutput')
    .map(d => ({
      deviceId: d.deviceId,
      label: d.label || `Speaker (${d.deviceId.slice(0, 8)})`,
      kind: 'audiooutput' as const,
    }));
  return { inputs, outputs };
}

export function useAudioDevices(): UseAudioDevicesReturn {
  const [inputDevices, setInputDevices] = useState<AudioDeviceInfo[]>([]);
  const [outputDevices, setOutputDevices] = useState<AudioDeviceInfo[]>([]);
  const [selectedInputId, setSelectedInputIdState] = useState<string>(
    () =>
      typeof localStorage !== 'undefined' ? (localStorage.getItem(INPUT_KEY) ?? 'default') : 'default',
  );
  const [selectedOutputId, setSelectedOutputIdState] = useState<string>(
    () =>
      typeof localStorage !== 'undefined'
        ? (localStorage.getItem(OUTPUT_KEY) ?? 'default')
        : 'default',
  );
  const [permissionDenied, setPermissionDenied] = useState(false);

  const supportsOutputSelection =
    typeof HTMLMediaElement !== 'undefined' && 'setSinkId' in HTMLMediaElement.prototype;

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.enumerateDevices) return;

    // setState is called inside .then(), not synchronously — matches the usePushNotifications pattern.
    function handleDevices() {
      navigator.mediaDevices
        .enumerateDevices()
        .then(devices => {
          const { inputs, outputs } = parseDeviceList(devices);
          setInputDevices(inputs);
          setOutputDevices(outputs);
          // If the stored selection is no longer present (device unplugged or permissions
          // revoked), fall back to 'default' so the UI and VoiceContext stay in sync.
          setSelectedInputIdState(prev => {
            if (prev === 'default' || inputs.some(d => d.deviceId === prev)) return prev;
            localStorage.setItem(INPUT_KEY, 'default');
            return 'default';
          });
          setSelectedOutputIdState(prev => {
            if (prev === 'default' || outputs.some(d => d.deviceId === prev)) return prev;
            localStorage.setItem(OUTPUT_KEY, 'default');
            return 'default';
          });
        })
        .catch(() => {});
    }

    handleDevices();
    navigator.mediaDevices.addEventListener('devicechange', handleDevices);
    return () => navigator.mediaDevices.removeEventListener('devicechange', handleDevices);
    // useState setters (setInputDevices, setOutputDevices) are stable — safe to omit from deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setSelectedInputId = useCallback((id: string) => {
    setSelectedInputIdState(id);
    localStorage.setItem(INPUT_KEY, id);
  }, []);

  const setSelectedOutputId = useCallback((id: string) => {
    setSelectedOutputIdState(id);
    localStorage.setItem(OUTPUT_KEY, id);
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      setPermissionDenied(false);
      const devices = await navigator.mediaDevices.enumerateDevices();
      const { inputs, outputs } = parseDeviceList(devices);
      setInputDevices(inputs);
      setOutputDevices(outputs);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setPermissionDenied(true);
      }
    }
  }, []);

  return {
    inputDevices,
    outputDevices,
    selectedInputId,
    selectedOutputId,
    setSelectedInputId,
    setSelectedOutputId,
    supportsOutputSelection,
    permissionDenied,
    requestPermission,
  };
}

/** Read the stored input device ID outside of React (e.g. in VoiceContext). */
export function getStoredAudioInputDeviceId(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(INPUT_KEY);
}

/** Read the stored output device ID outside of React (e.g. in VoiceContext). */
export function getStoredAudioOutputDeviceId(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(OUTPUT_KEY);
}
