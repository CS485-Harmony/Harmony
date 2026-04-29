// CL-C2.3 DescriptionGenerator — generates meta descriptions (AC-2: 50-160 chars)
import type { MessageContext, ChannelContext, MetaTagSet, IMetaTagGenerator } from './types';

const MAX_LENGTH = 160;
const MIN_LENGTH = 50;

export const DescriptionGenerator: IMetaTagGenerator & {
  maxLength: number;
  minLength: number;
  generateFromMessages(messages: MessageContext[], channel: ChannelContext): string;
  extractKeyPhrases(content: string, maxPhrases: number): string[];
  sanitizeText(text: string): string;
  summarizeThread(messages: MessageContext[]): string;
  enforceLength(text: string): string;
} = {
  maxLength: MAX_LENGTH,
  minLength: MIN_LENGTH,

  generateFromMessages(messages: MessageContext[], channel: ChannelContext): string {
    const serverName = this.sanitizeText(channel.serverName);
    const channelName = this.sanitizeText(channel.name);
    const suffix = ` — Join the discussion on ${serverName}.`;

    if (messages.length === 0) {
      const base = `Discussions in #${channelName} on ${serverName}. Join today.`;
      return this.enforceLength(base);
    }

    const summary = this.summarizeThread(messages);
    const prefix = `${serverName} › #${channelName}: `;
    let text = prefix + summary;

    if (text.length < MIN_LENGTH) {
      text = text + suffix;
    }

    return this.enforceLength(text);
  },

  // Spec: extractKeyPhrases(content: string, maxPhrases: number): string[]
  extractKeyPhrases(content: string, maxPhrases: number): string[] {
    const words = content
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
      .slice(0, maxPhrases)
      .map(([word]) => word);
  },

  sanitizeText(text: string): string {
    return text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  },

  // Spec: summarizeThread(messages: Message[]): string — channel context handled by generateFromMessages
  summarizeThread(messages: MessageContext[]): string {
    if (messages.length === 0) return '';
    return this.sanitizeText(messages[0].content);
  },

  enforceLength(text: string): string {
    let result = text;

    if (result.length < MIN_LENGTH) {
      const additions = [
        ' Join the discussion.',
        ' Explore the latest updates.',
        ' Connect with the community.',
      ];
      let i = 0;
      while (result.length < MIN_LENGTH) {
        result += additions[i % additions.length];
        i++;
      }
    }

    if (result.length > MAX_LENGTH) {
      return result.slice(0, MAX_LENGTH - 1).trimEnd() + '…';
    }
    return result;
  },

  // CL-I1 stubs — full generate/validate wired by M4
  generate(): MetaTagSet {
    throw new Error('DescriptionGenerator.generate() not yet implemented — wired by M4');
  },
  validate(): boolean {
    throw new Error('DescriptionGenerator.validate() not yet implemented — wired by M4');
  },
};
