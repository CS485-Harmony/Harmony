'use client';

import { useState, useEffect } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { apiClient } from '@/lib/api-client';

// ─── Types ────────────────────────────────────────────────────────────────────

type NotificationLevel = 'ALL' | 'MENTIONS' | 'NONE';

interface NotificationPreference {
  id: string;
  serverId: string | null;
  channelId: string | null;
  level: NotificationLevel;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LEVEL_LABELS: Record<NotificationLevel, string> = {
  ALL: 'All Messages',
  MENTIONS: 'Mentions Only',
  NONE: 'Muted',
};

const LEVEL_DESC: Record<NotificationLevel, string> = {
  ALL: 'Notify me for every message',
  MENTIONS: 'Only notify when I am @mentioned',
  NONE: 'No notifications',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function LevelSelect({
  value,
  onChange,
  disabled,
}: {
  value: NotificationLevel;
  onChange: (v: NotificationLevel) => void;
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as NotificationLevel)}
      disabled={disabled}
      className='rounded bg-[#1e1f22] px-3 py-1.5 text-sm text-gray-200 border border-[#3d4148] focus:outline-none focus:border-indigo-500 disabled:opacity-50'
    >
      {(Object.keys(LEVEL_LABELS) as NotificationLevel[]).map((level) => (
        <option key={level} value={level}>
          {LEVEL_LABELS[level]}
        </option>
      ))}
    </select>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function NotificationSettingsSection() {
  const { permissionState, isSubscribed, isLoading: pushLoading, error: pushError, enable, disable } =
    usePushNotifications();

  const [globalLevel, setGlobalLevel] = useState<NotificationLevel>('MENTIONS');
  const [prefs, setPrefs] = useState<NotificationPreference[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .trpcQuery<NotificationPreference[]>('notification.getPreferences')
      .then((data) => {
        const global = data.find((p) => p.serverId === null && p.channelId === null);
        if (global) setGlobalLevel(global.level);
        setPrefs(data);
      })
      .catch(() => {});
  }, []);

  async function handleSaveGlobal() {
    setSaving(true);
    setSaveError(null);
    try {
      await apiClient.trpcMutation('notification.setGlobalLevel', { level: globalLevel });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  const isUnsupported = permissionState === 'unsupported';

  return (
    <div className='space-y-8'>
      {/* Push notification toggle */}
      <section>
        <h3 className='text-base font-semibold text-white mb-1'>Browser Push Notifications</h3>
        <p className='text-sm text-gray-400 mb-4'>
          Receive notifications even when Harmony is not open in your browser.
        </p>

        {isUnsupported ? (
          <p className='text-sm text-yellow-400'>
            Push notifications are not supported in this browser.
          </p>
        ) : (
          <div className='flex items-center gap-4'>
            <button
              onClick={isSubscribed ? disable : enable}
              disabled={pushLoading}
              className={`rounded px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
                isSubscribed
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {pushLoading
                ? 'Please wait…'
                : isSubscribed
                  ? 'Disable Push Notifications'
                  : 'Enable Push Notifications'}
            </button>

            {permissionState === 'denied' && (
              <span className='text-sm text-red-400'>
                Notifications blocked. Please allow them in browser settings.
              </span>
            )}
            {permissionState === 'granted' && isSubscribed && (
              <span className='text-sm text-green-400'>Push notifications are active.</span>
            )}
            {pushError && <span className='text-sm text-red-400'>{pushError}</span>}
          </div>
        )}
      </section>

      {/* Global notification level */}
      <section>
        <h3 className='text-base font-semibold text-white mb-1'>Default Notification Level</h3>
        <p className='text-sm text-gray-400 mb-3'>
          Controls which messages trigger a notification. Channel and server overrides take
          priority.
        </p>

        <div className='flex items-center gap-3'>
          <LevelSelect value={globalLevel} onChange={setGlobalLevel} disabled={saving} />
          <button
            onClick={handleSaveGlobal}
            disabled={saving}
            className='rounded px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-50 transition-colors'
          >
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save'}
          </button>
        </div>
        <p className='mt-1.5 text-xs text-gray-500'>{LEVEL_DESC[globalLevel]}</p>
        {saveError && <p className='mt-1 text-xs text-red-400'>{saveError}</p>}
      </section>

      {/* Per-server/channel overrides (read-only list) */}
      {prefs.filter((p) => p.serverId !== null).length > 0 && (
        <section>
          <h3 className='text-base font-semibold text-white mb-3'>Server &amp; Channel Overrides</h3>
          <p className='text-sm text-gray-400 mb-3'>
            Change per-channel levels from the channel settings page.
          </p>
          <ul className='space-y-2'>
            {prefs
              .filter((p) => p.serverId !== null)
              .map((pref) => (
                <li
                  key={pref.id}
                  className='flex items-center justify-between rounded bg-[#1e1f22] px-3 py-2 text-sm text-gray-300'
                >
                  <span className='truncate mr-4'>
                    {pref.channelId ? `Channel override` : `Server override`}
                    <span className='ml-2 text-xs text-gray-500 font-mono'>
                      {pref.channelId ?? pref.serverId}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 font-medium ${
                      pref.level === 'NONE'
                        ? 'text-red-400'
                        : pref.level === 'ALL'
                          ? 'text-green-400'
                          : 'text-yellow-400'
                    }`}
                  >
                    {LEVEL_LABELS[pref.level]}
                  </span>
                </li>
              ))}
          </ul>
        </section>
      )}
    </div>
  );
}
