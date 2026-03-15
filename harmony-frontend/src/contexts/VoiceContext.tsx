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
 * - leaveChannel is called automatically on unmount so navigating away
 *   cleans up the Twilio room correctly.
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

// ─── Provider ─────────────────────────────────────────────────────────────────

export function VoiceProvider({ children }: { children: ReactNode }) {
  const [connectedChannelId, setConnectedChannelId] = useState<string | null>(null);
  const [connectedChannelName, setConnectedChannelName] = useState<string | null>(null);
  const [participants, setParticipants] = useState<VoiceParticipant[]>([]);
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
  const isMutedRef = useRef(false);
  const isDeafenedRef = useRef(false);

  const resetVoiceState = useCallback(() => {
    connectedChannelIdRef.current = null;
    connectedServerIdRef.current = null;
    roomRef.current = null;
    localAudioTrackRef.current = null;
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

    // Disconnect Twilio room first so no more events fire.
    if (room) {
      room.disconnect();
    }

    resetVoiceState();

    if (channelId && serverId) {
      try {
        await apiClient.trpcMutation('voice.leave', { channelId, serverId });
      } catch (err) {
        console.error('[VoiceContext] leave error:', err);
      }
    }
  }, [resetVoiceState]);

  const joinChannel = useCallback(
    async (channelId: string, serverId: string, channelName: string) => {
      // Already connected to the same channel — no-op.
      if (connectedChannelIdRef.current === channelId) return;

      // Switching channels — leave first.
      if (connectedChannelIdRef.current) {
        await leaveChannel();
      }

      setJoining(true);
      try {
        const { token, participants: initialParticipants } =
          await apiClient.trpcMutation<JoinResponse>('voice.join', { channelId, serverId });

        connectedChannelIdRef.current = channelId;
        connectedServerIdRef.current = serverId;
        setConnectedChannelId(channelId);
        setConnectedChannelName(channelName);
        setParticipants(initialParticipants);

        // Dynamic import keeps the Twilio SDK out of SSR.
        const TwilioVideo = await import('twilio-video');
        const room = await TwilioVideo.connect(token, {
          name: channelId,
          audio: true,
          video: false,
          dominantSpeaker: true,
        });
        roomRef.current = room;

        // Cache local audio track for mute toggling.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        room.localParticipant.audioTracks.forEach((pub: any) => {
          if (pub.track) localAudioTrackRef.current = pub.track;
        });

        // Merge remote participants already in the room.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        room.participants.forEach((participant: any) => {
          setParticipants(prev =>
            prev.some(p => p.userId === participant.identity)
              ? prev
              : [...prev, { userId: participant.identity, muted: false, deafened: false }],
          );
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        room.on('participantConnected', (participant: any) => {
          setParticipants(prev =>
            prev.some(p => p.userId === participant.identity)
              ? prev
              : [...prev, { userId: participant.identity, muted: false, deafened: false }],
          );
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        room.on('participantDisconnected', (participant: any) => {
          setParticipants(prev => prev.filter(p => p.userId !== participant.identity));
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        room.on('dominantSpeakerChanged', (participant: any) => {
          setDominantSpeakerId(participant?.identity ?? null);
        });

        // Handle unexpected disconnects (network drop, room ended, etc.)
        room.on('disconnected', () => {
          resetVoiceState();
        });
      } catch (err) {
        console.error('[VoiceContext] joinChannel error:', err);
        resetVoiceState();
      } finally {
        setJoining(false);
      }
    },
    [leaveChannel, resetVoiceState],
  );

  const setMuted = useCallback(async (muted: boolean) => {
    const track = localAudioTrackRef.current;
    if (track) {
      if (muted) {
        track.disable();
      } else {
        track.enable();
      }
    }

    isMutedRef.current = muted;
    setIsMutedState(muted);

    const channelId = connectedChannelIdRef.current;
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
        console.error('[VoiceContext] updateState (mute) error:', err);
      }
    }
  }, []);

  const setDeafened = useCallback(async (deafened: boolean) => {
    // Mute/unmute remote audio tracks via MediaStreamTrack.enabled.
    const room = roomRef.current;
    if (room) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      room.participants.forEach((participant: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        participant.audioTracks.forEach((pub: any) => {
          if (pub.track?.mediaStreamTrack) {
            pub.track.mediaStreamTrack.enabled = !deafened;
          }
        });
      });
    }

    isDeafenedRef.current = deafened;
    setIsDeafenedState(deafened);

    const channelId = connectedChannelIdRef.current;
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
        console.error('[VoiceContext] updateState (deafen) error:', err);
      }
    }
  }, []);

  // Disconnect on unmount (e.g. navigating away from the server).
  useEffect(() => {
    return () => {
      const room = roomRef.current;
      if (room) {
        room.disconnect();
        roomRef.current = null;
      }
    };
  }, []);

  return (
    <VoiceContext.Provider
      value={{
        connectedChannelId,
        connectedChannelName,
        participants,
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
