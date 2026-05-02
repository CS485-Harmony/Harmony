/** localStorage keys for persisted audio device selections. */
export const AUDIO_INPUT_DEVICE_KEY = 'harmony:audioInputDeviceId';
export const AUDIO_OUTPUT_DEVICE_KEY = 'harmony:audioOutputDeviceId';

export function loadStoredDeviceId(key: string): string {
  if (typeof window === 'undefined') return 'default';
  return localStorage.getItem(key) ?? 'default';
}

export function saveDeviceId(key: string, deviceId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, deviceId);
}
