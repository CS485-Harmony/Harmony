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
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/hooks/useToast';

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

interface VoiceProviderProps {
  children: ReactNode;
  /** The current server's UUID — used to scope getParticipants fetches. */
  serverId: string;
  /** IDs of all voice channels in the current server. */
  voiceChannelIds: string[];
}

export function VoiceProvider({ children, serverId, voiceChannelIds }: VoiceProviderProps) {
  const { showToast } = useToast();

  const [connectedChannelId, setConnectedChannelId] = useState<string | null>(null);
  const [connectedChannelName, setConnectedChannelName] = useState<string | null>(null);
  const [participants, setParticipants] = useState<VoiceParticipant[]>([]);
  const [channelParticipants, setChannelParticipants] = useState<Record<string, VoiceParticipant[]>>({});
  const [dominantSpeakerId, setDominantSpeakerId] = useState<string | null>(null);
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

  // ── Fetch participant lists for all voice channels on mount / server change ──
  // This populates the sidebar before the user has joined any channel.
  useEffect(() => {
    if (!serverId || voiceChannelIds.length === 0) return;
    void Promise.all(
      voiceChannelIds.map(channelId =>
        apiClient
          .trpcQuery<VoiceParticipant[]>('voice.getParticipants', { serverId, channelId })
          .then(ps => setChannelParticipants(prev => ({ ...prev, [channelId]: ps })))
          .catch((err: unknown) => {
            console.error(
              '[VoiceContext] getParticipants error for', channelId,
              err instanceof Error ? err.message : err,
            );
          }),
      ),
    );
  }, [serverId, voiceChannelIds]);

  const resetVoiceState = useCallback(() => {
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
  }, []);

  const leaveChannel = useCallback(async () => {
    const room = roomRef.current;
    const channelId = connectedChannelIdRef.current;
    const serverId = connectedServerIdRef.current;

    // Remove listeners and disconnect Twilio first so no more events fire.
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
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('[VoiceContext] leave error:', message);
    } finally {
      resetVoiceState();
    }
  }, [resetVoiceState]);

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
        setConnectedChannelId(channelId);
        setConnectedChannelName(channelName);
        setParticipants(initialParticipants);
        // Keep the all-channels map in sync for the newly joined channel.
        setChannelParticipants(prev => ({ ...prev, [channelId]: initialParticipants }));

        // Dynamic import keeps the Twilio SDK out of SSR.
        const TwilioVideo = await import('twilio-video');
        console.log(`[VoiceContext] TwilioVideo.connect — room=${channelId} tokenPrefix=${token.slice(0, 20)}...`);
        const room = await TwilioVideo.connect(token, {
          name: channelId,
          audio: true,
          video: false,
          dominantSpeaker: true,
        });
        roomRef.current = room;

        // Store local identity so setMuted/setDeafened can update the participant entry.
        localParticipantIdentityRef.current = room.localParticipant.identity;

        // Cache local audio track for mute toggling.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        room.localParticipant.audioTracks.forEach((pub: any) => {
          if (pub.track) localAudioTrackRef.current = pub.track;
        });

        // Merge remote participants already in the room.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        room.participants.forEach((participant: any) => {
          const newEntry: VoiceParticipant = { userId: participant.identity, muted: false, deafened: false };
          setParticipants(prev =>
            prev.some(p => p.userId === participant.identity) ? prev : [...prev, newEntry],
          );
          setChannelParticipants(prev => {
            const list = prev[channelId] ?? [];
            return list.some(p => p.userId === participant.identity)
              ? prev
              : { ...prev, [channelId]: [...list, newEntry] };
          });
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        room.on('participantConnected', (participant: any) => {
          const newEntry: VoiceParticipant = { userId: participant.identity, muted: false, deafened: false };
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
          // Also handle tracks subscribed after the participant connected.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          participant.on('trackSubscribed', (track: any) => {
            if (track.kind === 'audio' && track.mediaStreamTrack) {
              track.mediaStreamTrack.enabled = !isDeafenedRef.current;
            }
          });
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        room.on('participantDisconnected', (participant: any) => {
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
          room.removeAllListeners();
          resetVoiceState();
          // Fire-and-forget: keep Redis in sync on unexpected disconnect.
          if (cId && sId) {
            apiClient.trpcMutation('voice.leave', { channelId: cId, serverId: sId }).catch((err: unknown) => {
              console.error('[VoiceContext] disconnect leave error:', err instanceof Error ? err.message : err);
            });
          }
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        // Log full error object so Twilio error codes are visible in the browser console.
        console.error('[VoiceContext] joinChannel error:', message, err);
        console.error('[VoiceContext] joinChannel error detail:', JSON.stringify(err, Object.getOwnPropertyNames(err as object)));
        showToast({ message: 'Could not connect to voice channel. Please try again.', type: 'error' });
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
      setParticipants(prev => prev.map(p => p.userId === localIdentity ? { ...p, muted } : p));
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
          setParticipants(prev => prev.map(p => p.userId === localIdentity ? { ...p, muted: !muted } : p));
          if (channelId) {
            setChannelParticipants(prev => ({
              ...prev,
              [channelId]: (prev[channelId] ?? []).map(p =>
                p.userId === localIdentity ? { ...p, muted: !muted } : p,
              ),
            }));
          }
        }
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('[VoiceContext] updateState (mute) error:', message);
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
      setParticipants(prev => prev.map(p => p.userId === localIdentity ? { ...p, deafened } : p));
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
          setParticipants(prev => prev.map(p => p.userId === localIdentity ? { ...p, deafened: !deafened } : p));
          if (channelId) {
            setChannelParticipants(prev => ({
              ...prev,
              [channelId]: (prev[channelId] ?? []).map(p =>
                p.userId === localIdentity ? { ...p, deafened: !deafened } : p,
              ),
            }));
          }
        }
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('[VoiceContext] updateState (deafen) error:', message);
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
          console.error('[VoiceContext] unmount leave error:', err instanceof Error ? err.message : err);
        });
      }
    };
  }, []);

  return (
    <VoiceContext.Provider
      value={{
        connectedChannelId,
        connectedChannelName,
        participants,
        channelParticipants,
        dominantSpeakerId,
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
