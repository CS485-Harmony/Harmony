/**
 * VoiceContext — Issue #122
 *
 * Manages Twilio Video room state for voice channels.
 * Provides join/leave/mute/deafen actions and exposes real-time
 * participant state and dominant speaker info to consuming components.
 *
 * Design rationale:
 * - Twilio SDK is imported dynamically (lazy) to prevent SSR errors.
 * - Backend tRPC calls (join/leave/updateState) keep Redis state in sync.
 * - Room events (participantConnected/Disconnected, dominantSpeakerChanged)
 *   provide real-time updates for the connected channel only.
 * - On unmount, the Twilio room is disconnected and a fire-and-forget
 *   voice.leave is sent so Redis presence stays in sync when navigating away.
 * - channelParticipants holds participant lists for ALL voice channels in the
 *   server, fetched on mount, so the sidebar shows presence before joining.
 */

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { apiClient, getAccessToken } from '@/lib/api-client';
import { createFrontendLogger } from '@/lib/frontend-logger';
import { useToast } from '@/hooks/useToast';
import { getApiBaseUrl } from '@/lib/runtime-config';
import {
  getStoredAudioInputDeviceId,
  getStoredAudioOutputDeviceId,
} from '@/hooks/useAudioDevices';

const logger = createFrontendLogger({ component: 'voice-context' });

// ─── Types ───────────────────────────────────────────────────────────────────

export interface VoiceParticipant {
  userId: string;
  muted: boolean;
  deafened: boolean;
}

interface JoinResponse {
  token: string;
  participants: VoiceParticipant[];
}

export interface VoiceContextValue {
  /** Id of the voice channel the user is currently connected to, or null. */
  connectedChannelId: string | null;
  /** Display name of the connected channel (e.g. "General"). */
  connectedChannelName: string | null;
  /** Participants currently in the connected channel. */
  participants: VoiceParticipant[];
  /**
   * Participant lists for every voice channel in the current server.
   * Keyed by channelId. Updated on mount and kept in sync with Twilio
   * room events for the connected channel.
   */
  channelParticipants: Record<string, VoiceParticipant[]>;
  /** Identity (userId) of the current dominant speaker, or null. */
  dominantSpeakerId: string | null;
  /** True when the local user's mic level exceeds the speaking threshold. */
  localSpeaking: boolean;
  isMuted: boolean;
  isDeafened: boolean;
  /** True while the join tRPC call + Twilio connect is in progress. */
  joining: boolean;
  joinChannel: (channelId: string, serverId: string, channelName: string) => Promise<void>;
  leaveChannel: () => Promise<void>;
  setMuted: (muted: boolean) => Promise<void>;
  setDeafened: (deafened: boolean) => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const VoiceContext = createContext<VoiceContextValue | null>(null);

export function useVoice(): VoiceContextValue {
  const ctx = useContext(VoiceContext);
  if (!ctx) throw new Error('useVoice must be used within VoiceProvider');
  return ctx;
}

/**
 * Returns VoiceContextValue when inside a VoiceProvider, or null otherwise.
 * Use this in components that may render outside the voice provider tree
 * (unit tests, Storybook stories, future routes without the full shell).
 */
export function useVoiceOptional(): VoiceContextValue | null {
  return useContext(VoiceContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * Imperative handle populated by VoiceProvider so HarmonyShell can forward
 * voice SSE events (from useServerEvents) into channelParticipants state without
 * prop-drilling callbacks through the entire component tree.
 */
export interface VoiceExternalActions {
  notifyUserJoined: (channelId: string, userId: string) => void;
  notifyUserLeft: (channelId: string, userId: string) => void;
  notifyStateChanged: (channelId: string, userId: string, muted: boolean, deafened: boolean) => void;
}

interface VoiceProviderProps {
  children: ReactNode;
  /** The current server's UUID — used to scope getParticipants fetches. */
  serverId: string;
  /** IDs of all voice channels in the current server. */
  voiceChannelIds: string[];
  /**
   * The authenticated user's ID. Used to clean up channelParticipants when
   * a join fails before a Twilio room is established — at that point
   * room.localParticipant.identity is not yet available.
   */
  currentUserId?: string;
  /**
   * Optional ref populated by the provider with imperative methods that
   * update channelParticipants from SSE voice events (userJoined/Left/stateChanged).
   * Pass a ref created with useRef<VoiceExternalActions | null>(null) from HarmonyShell.
   */
  externalActionsRef?: { current: VoiceExternalActions | null };
}

export function VoiceProvider({ children, serverId, voiceChannelIds, currentUserId, externalActionsRef }: VoiceProviderProps) {
  const { showToast } = useToast();

  const [connectedChannelId, setConnectedChannelId] = useState<string | null>(null);
  const [connectedChannelName, setConnectedChannelName] = useState<string | null>(null);
  const [participants, setParticipants] = useState<VoiceParticipant[]>([]);
  const [channelParticipants, setChannelParticipants] = useState<
    Record<string, VoiceParticipant[]>
  >({});
  const [dominantSpeakerId, setDominantSpeakerId] = useState<string | null>(null);
  const [localSpeaking, setLocalSpeaking] = useState(false);
  const [isMuted, setIsMutedState] = useState(false);
  const [isDeafened, setIsDeafenedState] = useState(false);
  const [joining, setJoining] = useState(false);

  // Refs so async callbacks always see the latest values without re-creating handlers.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const roomRef = useRef<any>(null);
  const connectedChannelIdRef = useRef<string | null>(null);
  const connectedServerIdRef = useRef<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const localAudioTrackRef = useRef<any>(null);
  const localParticipantIdentityRef = useRef<string | null>(null);
  const isMutedRef = useRef(false);
  const isDeafenedRef = useRef(false);

  // Web Audio API refs for local speaking detection.
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const speakingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const speakingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const localSpeakingRef = useRef(false);

  // Tracks attached remote audio elements keyed by participant identity for cleanup.
  // Twilio does not auto-play subscribed tracks; we must attach them to <audio> elements.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const remoteAudioTracksRef = useRef<Map<string, any[]>>(new Map());

  // ── Fetch participant lists for all voice channels on mount / server change ──
  // This populates the sidebar before the user has joined any channel.
  // Stable string key so text-channel mutations don't trigger a re-fetch here.
  // voiceChannelIds itself changes reference on every setLocalChannels call in HarmonyShell,
  // but the IDs only change when a voice channel is actually added or removed.
  const voiceChannelIdsKey = voiceChannelIds.join(',');

  useEffect(() => {
    if (!serverId || !voiceChannelIdsKey) return;
    const ids = voiceChannelIdsKey.split(',');
    void Promise.all(
      ids.map(channelId =>
        apiClient
          .trpcQuery<VoiceParticipant[]>('voice.getParticipants', { serverId, channelId })
          .then(ps => setChannelParticipants(prev => ({ ...prev, [channelId]: ps })))
          .catch((err: unknown) => {
            logger.warn('Voice participants fetch failed', {
              feature: 'voice',
              event: 'participants_fetch_failed',
              operation: 'voice.getParticipants',
              error: err,
            });
          }),
      ),
    );
  }, [serverId, voiceChannelIdsKey]);

  // Populate the external actions ref so HarmonyShell can forward SSE voice events
  // into channelParticipants state without prop-drilling.
  useEffect(() => {
    if (!externalActionsRef) return;
    externalActionsRef.current = {
      notifyUserJoined: (channelId, userId) => {
        setChannelParticipants(prev => {
          const existing = prev[channelId] ?? [];
          if (existing.some(p => p.userId === userId)) return prev;
          return { ...prev, [channelId]: [...existing, { userId, muted: false, deafened: false }] };
        });
      },
      notifyUserLeft: (channelId, userId) => {
        setChannelParticipants(prev => ({
          ...prev,
          [channelId]: (prev[channelId] ?? []).filter(p => p.userId !== userId),
        }));
      },
      notifyStateChanged: (channelId, userId, muted, deafened) => {
        setChannelParticipants(prev => ({
          ...prev,
          [channelId]: (prev[channelId] ?? []).map(p =>
            p.userId === userId ? { ...p, muted, deafened } : p,
          ),
        }));
      },
    };
    return () => {
      externalActionsRef.current = null;
    };
  }, [externalActionsRef]);

  const resetVoiceState = useCallback(() => {
    // Detach all remote audio elements before clearing other state.
    remoteAudioTracksRef.current.forEach(tracks => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tracks.forEach((track: any) => {
        track.detach().forEach((el: HTMLAudioElement) => el.remove());
      });
    });
    remoteAudioTracksRef.current.clear();

    connectedChannelIdRef.current = null;
    connectedServerIdRef.current = null;
    roomRef.current = null;
    localAudioTrackRef.current = null;
    localParticipantIdentityRef.current = null;
    setConnectedChannelId(null);
    setConnectedChannelName(null);
    setParticipants([]);
    setDominantSpeakerId(null);
    setIsMutedState(false);
    setIsDeafenedState(false);
    isMutedRef.current = false;
    isDeafenedRef.current = false;
    // Stop local audio level detection.
    if (speakingIntervalRef.current !== null) {
      clearInterval(speakingIntervalRef.current);
      speakingIntervalRef.current = null;
    }
    if (speakingTimeoutRef.current !== null) {
      clearTimeout(speakingTimeoutRef.current);
      speakingTimeoutRef.current = null;
    }
    if (audioContextRef.current) {
      void audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    localSpeakingRef.current = false;
    setLocalSpeaking(false);
  }, []);

  const leaveChannel = useCallback(async () => {
    const room = roomRef.current;
    const channelId = connectedChannelIdRef.current;
    const serverId = connectedServerIdRef.current;
    // Capture before resetVoiceState nulls the ref.
    const localIdentity = localParticipantIdentityRef.current;

    // Remove listeners and disconnect first so no more events fire.
    if (room) {
      room.removeAllListeners();
      room.disconnect();
    }

    // Notify backend before resetting UI state so Redis stays in sync.
    // resetVoiceState runs in finally so it always clears local state.
    try {
      if (channelId && serverId) {
        await apiClient.trpcMutation('voice.leave', { channelId, serverId });
      }
    } catch (err) {
      logger.warn('Voice leave mutation failed', {
        feature: 'voice',
        event: 'leave_failed',
        operation: 'voice.leave',
        error: err,
      });
    } finally {
      // Remove local user from channelParticipants so the sidebar updates immediately.
      // Must happen before resetVoiceState, which clears localParticipantIdentityRef.
      if (channelId && localIdentity) {
        setChannelParticipants(prev => ({
          ...prev,
          [channelId]: (prev[channelId] ?? []).filter(p => p.userId !== localIdentity),
        }));
      }
      resetVoiceState();
    }
  }, [resetVoiceState]);

  // Applies the user's stored output device to an audio element when the browser supports setSinkId.
  // This is called only at track-attach time (initial join + participant connect events).
  // Already-attached <audio> elements are NOT re-routed if the user changes their output device
  // while already in a call — they need to rejoin the channel for the change to take effect.
  function applySinkId(el: HTMLAudioElement) {
    const outputDeviceId = getStoredAudioOutputDeviceId();
    if (
      outputDeviceId &&
      outputDeviceId !== 'default' &&
      'setSinkId' in el
    ) {
      (el as HTMLAudioElement & { setSinkId: (id: string) => Promise<void> })
        .setSinkId(outputDeviceId)
        .catch((err: unknown) => {
          logger.warn('Failed to set audio output device', {
            feature: 'voice',
            event: 'set_sink_id_failed',
            operation: 'setSinkId',
            error: err,
          });
        });
    }
  }

  const joinChannel = useCallback(
    async (channelId: string, serverId: string, channelName: string) => {
      // Already connected to the same channel — no-op.
      if (connectedChannelIdRef.current === channelId) return;

      // Set joining immediately to prevent concurrent joinChannel calls during the leave.
      setJoining(true);

      // Switching channels — leave first.
      if (connectedChannelIdRef.current) {
        await leaveChannel();
      }
      try {
        const { token, participants: initialParticipants } =
          await apiClient.trpcMutation<JoinResponse>('voice.join', { channelId, serverId });

        // Validate token before writing any state to avoid a brief render with stale channel info.
        if (!token) {
          throw new Error('voice.join returned an empty token');
        }

        connectedChannelIdRef.current = channelId;
        connectedServerIdRef.current = serverId;
        // Set local identity now so leaveChannel() can clean up channelParticipants
        // even if TwilioVideo.connect subsequently fails (room.localParticipant is
        // not available until after a successful connect). The Twilio token uses
        // userId as the identity (voice.service.ts), so this value is authoritative.
        localParticipantIdentityRef.current = currentUserId ?? null;
        setConnectedChannelId(channelId);
        setConnectedChannelName(channelName);
        setParticipants(initialParticipants);
        // Keep the all-channels map in sync for the newly joined channel.
        setChannelParticipants(prev => ({ ...prev, [channelId]: initialParticipants }));

        // Dynamic import keeps the Twilio SDK out of SSR.
        const TwilioVideo = await import('twilio-video');
        const inputDeviceId = getStoredAudioInputDeviceId();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let room: any;
        try {
          room = await TwilioVideo.connect(token, {
            name: channelId,
            audio:
              inputDeviceId && inputDeviceId !== 'default'
                ? { deviceId: { exact: inputDeviceId } }
                : true,
            video: false,
            dominantSpeaker: true,
          });
        } catch (connectErr) {
          // Stale stored device ID — clear it and retry with the system default so the
          // join succeeds rather than aborting (satisfies AC: graceful fallback).
          if (
            connectErr instanceof DOMException &&
            (connectErr.name === 'OverconstrainedError' || connectErr.name === 'NotFoundError') &&
            inputDeviceId &&
            inputDeviceId !== 'default'
          ) {
            localStorage.removeItem('harmony_audio_input_device_id');
            room = await TwilioVideo.connect(token, {
              name: channelId,
              audio: true,
              video: false,
              dominantSpeaker: true,
            });
          } else {
            throw connectErr;
          }
        }
        roomRef.current = room;

        // Store local identity so setMuted/setDeafened can update the participant entry.
        localParticipantIdentityRef.current = room.localParticipant.identity;

        // Cache local audio track for mute toggling.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        room.localParticipant.audioTracks.forEach((pub: any) => {
          if (pub.track) localAudioTrackRef.current = pub.track;
        });

        // Start local audio level detection for the speaking ring.
        // Web Audio API is used instead of relying solely on Twilio's dominantSpeakerChanged,
        // which requires multiple participants and doesn't fire for the local user alone.
        const mediaTrack = (
          localAudioTrackRef.current as { mediaStreamTrack?: MediaStreamTrack } | null
        )?.mediaStreamTrack;
        if (mediaTrack) {
          try {
            // Pin to 48 kHz — WebRTC's native rate — so the OS audio driver does not
            // need to negotiate a different sample rate and risk exclusive-mode conflicts
            // that silence other apps (especially on macOS Core Audio / Windows WASAPI).
            const ctx = new AudioContext({ sampleRate: 48000 });
            const source = ctx.createMediaStreamSource(new MediaStream([mediaTrack]));
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.4;
            source.connect(analyser);
            audioContextRef.current = ctx;
            analyserRef.current = analyser;

            const buffer = new Uint8Array(analyser.frequencyBinCount);
            // Threshold of 15 (0-255 byte frequency data) distinguishes speech from ambient noise.
            const SPEAKING_THRESHOLD = 15;

            speakingIntervalRef.current = setInterval(() => {
              if (!analyserRef.current) return;
              analyserRef.current.getByteFrequencyData(buffer);
              const avg = buffer.reduce((s, v) => s + v, 0) / buffer.length;
              if (avg > SPEAKING_THRESHOLD) {
                if (!localSpeakingRef.current) {
                  localSpeakingRef.current = true;
                  setLocalSpeaking(true);
                }
                // Debounce the stop so the ring doesn't flicker between syllables.
                if (speakingTimeoutRef.current !== null) clearTimeout(speakingTimeoutRef.current);
                speakingTimeoutRef.current = setTimeout(() => {
                  localSpeakingRef.current = false;
                  setLocalSpeaking(false);
                  speakingTimeoutRef.current = null;
                }, 500);
              }
            }, 100);
          } catch (e) {
            logger.warn('Voice speaking detection setup failed', {
              feature: 'voice',
              event: 'speaking_detection_setup_failed',
              operation: 'audio-level-detection',
              error: e,
            });
          }
        }

        // Merge remote participants already in the room and attach their audio.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        room.participants.forEach((participant: any) => {
          const newEntry: VoiceParticipant = {
            userId: participant.identity,
            muted: false,
            deafened: false,
          };
          setParticipants(prev =>
            prev.some(p => p.userId === participant.identity) ? prev : [...prev, newEntry],
          );
          setChannelParticipants(prev => {
            const list = prev[channelId] ?? [];
            return list.some(p => p.userId === participant.identity)
              ? prev
              : { ...prev, [channelId]: [...list, newEntry] };
          });
          // Attach any already-subscribed audio tracks so we hear them immediately.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          participant.audioTracks.forEach((pub: any) => {
            if (pub.track) {
              const el: HTMLAudioElement = pub.track.attach();
              applySinkId(el);
              document.body.appendChild(el);
              const existing = remoteAudioTracksRef.current.get(participant.identity) ?? [];
              remoteAudioTracksRef.current.set(participant.identity, [...existing, pub.track]);
            }
          });
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        room.on('participantConnected', (participant: any) => {
          const newEntry: VoiceParticipant = {
            userId: participant.identity,
            muted: false,
            deafened: false,
          };
          setParticipants(prev =>
            prev.some(p => p.userId === participant.identity) ? prev : [...prev, newEntry],
          );
          setChannelParticipants(prev => {
            const list = prev[channelId] ?? [];
            return list.some(p => p.userId === participant.identity)
              ? prev
              : { ...prev, [channelId]: [...list, newEntry] };
          });
          // Apply current deafen state to already-subscribed tracks on the new participant.
          if (isDeafenedRef.current) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            participant.audioTracks.forEach((pub: any) => {
              if (pub.track?.mediaStreamTrack) {
                pub.track.mediaStreamTrack.enabled = false;
              }
            });
          }
          // Attach tracks subscribed after this participant connected; apply deafen immediately.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          participant.on('trackSubscribed', (track: any) => {
            if (track.kind === 'audio') {
              const el: HTMLAudioElement = track.attach();
              applySinkId(el);
              document.body.appendChild(el);
              const existing = remoteAudioTracksRef.current.get(participant.identity) ?? [];
              remoteAudioTracksRef.current.set(participant.identity, [...existing, track]);
              if (track.mediaStreamTrack) {
                track.mediaStreamTrack.enabled = !isDeafenedRef.current;
              }
            }
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          participant.on('trackUnsubscribed', (track: any) => {
            if (track.kind === 'audio') {
              track.detach().forEach((el: HTMLAudioElement) => el.remove());
              const existing = remoteAudioTracksRef.current.get(participant.identity) ?? [];
              remoteAudioTracksRef.current.set(
                participant.identity,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                existing.filter((t: any) => t !== track),
              );
            }
          });
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        room.on('participantDisconnected', (participant: any) => {
          // Detach audio before removing from state to avoid a brief render with dangling elements.
          const tracks = remoteAudioTracksRef.current.get(participant.identity) ?? [];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tracks.forEach((track: any) => {
            track.detach().forEach((el: HTMLAudioElement) => el.remove());
          });
          remoteAudioTracksRef.current.delete(participant.identity);
          setParticipants(prev => prev.filter(p => p.userId !== participant.identity));
          setChannelParticipants(prev => ({
            ...prev,
            [channelId]: (prev[channelId] ?? []).filter(p => p.userId !== participant.identity),
          }));
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        room.on('dominantSpeakerChanged', (participant: any) => {
          setDominantSpeakerId(participant?.identity ?? null);
        });

        // Handle unexpected disconnects (network drop, room ended, etc.)
        // Capture refs before resetVoiceState clears them.
        room.on('disconnected', () => {
          const cId = connectedChannelIdRef.current;
          const sId = connectedServerIdRef.current;
          const localId = localParticipantIdentityRef.current;
          room.removeAllListeners();
          if (cId && localId) {
            setChannelParticipants(prev => ({
              ...prev,
              [cId]: (prev[cId] ?? []).filter(p => p.userId !== localId),
            }));
          }
          resetVoiceState();
          // Fire-and-forget: keep Redis in sync on unexpected disconnect.
          if (cId && sId) {
            apiClient
              .trpcMutation('voice.leave', { channelId: cId, serverId: sId })
              .catch((err: unknown) => {
                logger.warn('Voice disconnect cleanup failed', {
                  feature: 'voice',
                  event: 'disconnect_leave_failed',
                  operation: 'voice.leave',
                  error: err,
                });
              });
          }
        });
      } catch (err) {
        logger.error('Voice channel join failed', {
          feature: 'voice',
          event: 'join_failed',
          operation: 'voice.join',
          error: err,
        });
        // Distinguish getUserMedia device errors from Twilio server errors for actionable toasts.
        const isPermissionError =
          err instanceof DOMException && err.name === 'NotAllowedError';
        const isDeviceError =
          err instanceof DOMException &&
          (err.name === 'NotFoundError' ||
            err.name === 'NotReadableError' ||
            err.name === 'OverconstrainedError');
        const toastMessage = isPermissionError
          ? 'Microphone access denied. Click the lock icon in your address bar and allow microphone permission, then try again.'
          : isDeviceError
            ? 'Microphone unavailable. Switching to system default — please try joining again.'
            : 'Could not connect to voice channel. Please try again.';
        showToast({ message: toastMessage, type: 'error' });
        // If voice.join succeeded (refs were written) but Twilio connect failed,
        // notify the backend so Redis state is not left stale.
        if (connectedChannelIdRef.current) {
          await leaveChannel();
        } else {
          resetVoiceState();
        }
      } finally {
        setJoining(false);
      }
    },
    [leaveChannel, resetVoiceState, showToast],
  );

  const setMuted = useCallback(async (muted: boolean) => {
    const track = localAudioTrackRef.current;
    // Optimistic update: apply immediately for responsive UI.
    if (track) {
      if (muted) track.disable();
      else track.enable();
    }
    isMutedRef.current = muted;
    setIsMutedState(muted);

    // Optimistically update the local user's entry in both participant lists.
    const localIdentity = localParticipantIdentityRef.current;
    const channelId = connectedChannelIdRef.current;
    if (localIdentity) {
      setParticipants(prev => prev.map(p => (p.userId === localIdentity ? { ...p, muted } : p)));
      if (channelId) {
        setChannelParticipants(prev => ({
          ...prev,
          [channelId]: (prev[channelId] ?? []).map(p =>
            p.userId === localIdentity ? { ...p, muted } : p,
          ),
        }));
      }
    }

    const serverId = connectedServerIdRef.current;
    if (channelId && serverId) {
      try {
        await apiClient.trpcMutation('voice.updateState', {
          channelId,
          serverId,
          muted,
          deafened: isDeafenedRef.current,
        });
      } catch (err) {
        // Revert optimistic updates so UI matches actual state.
        if (track) {
          if (!muted) track.disable();
          else track.enable();
        }
        isMutedRef.current = !muted;
        setIsMutedState(!muted);
        if (localIdentity) {
          setParticipants(prev =>
            prev.map(p => (p.userId === localIdentity ? { ...p, muted: !muted } : p)),
          );
          if (channelId) {
            setChannelParticipants(prev => ({
              ...prev,
              [channelId]: (prev[channelId] ?? []).map(p =>
                p.userId === localIdentity ? { ...p, muted: !muted } : p,
              ),
            }));
          }
        }
        logger.warn('Voice mute update failed', {
          feature: 'voice',
          event: 'mute_update_failed',
          operation: 'voice.updateState',
          error: err,
        });
      }
    }
  }, []);

  const setDeafened = useCallback(async (deafened: boolean) => {
    const room = roomRef.current;
    // Optimistic update: apply track changes immediately for responsive UI.
    const applyDeafenToRoom = (apply: boolean) => {
      if (!room) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      room.participants.forEach((participant: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        participant.audioTracks.forEach((pub: any) => {
          if (pub.track?.mediaStreamTrack) {
            pub.track.mediaStreamTrack.enabled = !apply;
          }
        });
      });
    };
    applyDeafenToRoom(deafened);
    isDeafenedRef.current = deafened;
    setIsDeafenedState(deafened);

    // Optimistically update the local user's entry in both participant lists.
    const localIdentity = localParticipantIdentityRef.current;
    const channelId = connectedChannelIdRef.current;
    if (localIdentity) {
      setParticipants(prev => prev.map(p => (p.userId === localIdentity ? { ...p, deafened } : p)));
      if (channelId) {
        setChannelParticipants(prev => ({
          ...prev,
          [channelId]: (prev[channelId] ?? []).map(p =>
            p.userId === localIdentity ? { ...p, deafened } : p,
          ),
        }));
      }
    }

    const serverId = connectedServerIdRef.current;
    if (channelId && serverId) {
      try {
        await apiClient.trpcMutation('voice.updateState', {
          channelId,
          serverId,
          muted: isMutedRef.current,
          deafened,
        });
      } catch (err) {
        // Revert optimistic updates so audio state matches actual.
        applyDeafenToRoom(!deafened);
        isDeafenedRef.current = !deafened;
        setIsDeafenedState(!deafened);
        if (localIdentity) {
          setParticipants(prev =>
            prev.map(p => (p.userId === localIdentity ? { ...p, deafened: !deafened } : p)),
          );
          if (channelId) {
            setChannelParticipants(prev => ({
              ...prev,
              [channelId]: (prev[channelId] ?? []).map(p =>
                p.userId === localIdentity ? { ...p, deafened: !deafened } : p,
              ),
            }));
          }
        }
        logger.warn('Voice deafen update failed', {
          feature: 'voice',
          event: 'deafen_update_failed',
          operation: 'voice.updateState',
          error: err,
        });
      }
    }
  }, []);

  // Disconnect on unmount (e.g. navigating away from the server).
  useEffect(() => {
    return () => {
      const room = roomRef.current;
      const channelId = connectedChannelIdRef.current;
      const serverId = connectedServerIdRef.current;
      if (room) {
        room.removeAllListeners();
        room.disconnect();
        roomRef.current = null;
      }
      // Fire-and-forget: keep Redis in sync when navigating away.
      // Cannot await in a cleanup function, so errors are logged only.
      if (channelId && serverId) {
        apiClient.trpcMutation('voice.leave', { channelId, serverId }).catch((err: unknown) => {
          logger.warn('Voice unmount cleanup failed', {
            feature: 'voice',
            event: 'unmount_leave_failed',
            operation: 'voice.leave',
            error: err,
          });
        });
      }
    };
  }, []);

  // On tab/browser close, React cleanup functions do not run. Use a keepalive fetch
  // so the browser keeps the voice.leave request alive through unload.
  // fetch with keepalive: true supports custom headers (unlike navigator.sendBeacon).
  useEffect(() => {
    function handleBeforeUnload() {
      const channelId = connectedChannelIdRef.current;
      const serverId = connectedServerIdRef.current;
      const token = getAccessToken();
      if (!channelId || !serverId || !token) return;

      const baseUrl = getApiBaseUrl();
      fetch(`${baseUrl}/trpc/voice.leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ channelId, serverId }),
        keepalive: true,
      }).catch(error => {
        logger.warn('Voice keepalive leave request failed', {
          feature: 'voice',
          event: 'keepalive_leave_failed',
          operation: 'voice.leave',
          source: 'beforeunload',
          target: '/trpc/voice.leave',
          error,
        });
      });
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <VoiceContext.Provider
      value={{
        connectedChannelId,
        connectedChannelName,
        participants,
        channelParticipants,
        dominantSpeakerId,
        localSpeaking,
        isMuted,
        isDeafened,
        joining,
        joinChannel,
        leaveChannel,
        setMuted,
        setDeafened,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
}
