// CL-C2.3 DescriptionGenerator — generates meta descriptions (AC-2: 50-160 chars)
import type { MessageContext, ChannelContext } from './types';

const MAX_LENGTH = 160;
const MIN_LENGTH = 50;

export const DescriptionGenerator = {
  maxLength: MAX_LENGTH,
  minLength: MIN_LENGTH,

  generateFromMessages(messages: MessageContext[], channel: ChannelContext): string {
    const summary = this.summarizeThread(messages, channel);
    return this.enforceLength(summary);
  },

  extractKeyPhrases(messages: MessageContext[]): string[] {
    const combined = messages.map((m) => m.content).join(' ');
    const words = combined
      .toLowerCase()
      .replace(/<[^>]*>/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3);

    const freq = new Map<string, number>();
    for (const word of words) {
      freq.set(word, (freq.get(word) ?? 0) + 1);
    }

    return [...freq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  },

  summarizeThread(messages: MessageContext[], channel: ChannelContext): string {
    if (messages.length === 0) {
      const base = `Discussions in #${channel.name} on ${channel.serverName}.`;
      return this.enforceLength(base);
    }
    const first = messages[0].content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    const prefix = `${channel.serverName} › #${channel.name}: `;
    return this.enforceLength(prefix + first);
  },

  enforceLength(text: string): string {
    if (text.length > MAX_LENGTH) {
      return text.slice(0, MAX_LENGTH - 1).trimEnd() + '…';
    }
    return text;
  },
};
