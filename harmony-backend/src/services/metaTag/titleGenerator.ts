// CL-C2.2 TitleGenerator — generates SEO-optimized titles (AC-2: ≤60 chars)
import type { ChannelContext, MessageContext, MetaTagSet, IMetaTagGenerator } from './types';

const MAX_LENGTH = 60;

const CHANNEL_TEMPLATE = '{channelName} — {serverName}';

export const TitleGenerator: IMetaTagGenerator & {
  maxLength: number;
  generateFromChannel(channel: ChannelContext): string;
  generateFromMessage(message: MessageContext, channel: ChannelContext): string;
  generateFromThread(messages: MessageContext[], channel: ChannelContext): string;
  truncateWithEllipsis(text: string): string;
  sanitizeForTitle(text: string): string;
  applyTemplate(template: string, vars: Record<string, string>): string;
} = {
  maxLength: MAX_LENGTH,

  generateFromChannel(channel: ChannelContext): string {
    const raw = CHANNEL_TEMPLATE.replace('{channelName}', channel.name).replace(
      '{serverName}',
      channel.serverName,
    );
    return this.truncateWithEllipsis(this.sanitizeForTitle(raw));
  },

  generateFromMessage(message: MessageContext, channel: ChannelContext): string {
    const raw = `${message.content} — ${channel.serverName}`;
    return this.truncateWithEllipsis(this.sanitizeForTitle(raw));
  },

  generateFromThread(messages: MessageContext[], channel: ChannelContext): string {
    if (messages.length === 0) {
      return this.generateFromChannel(channel);
    }
    return this.generateFromMessage(messages[0], channel);
  },

  truncateWithEllipsis(text: string): string {
    if (text.length <= MAX_LENGTH) return text;
    return text.slice(0, MAX_LENGTH - 1).trimEnd() + '…';
  },

  sanitizeForTitle(text: string): string {
    return text
      .replace(/<[^>]*>/g, ' ')
      .replace(/\\/g, '/')
      .split('/')
      .map((segment) => segment.trim())
      .filter((segment) => segment.length > 0 && segment !== '.' && segment !== '..')
      .join(' / ')
      .replace(/\s+/g, ' ')
      .trim();
  },

  applyTemplate(template: string, vars: Record<string, string>): string {
    return Object.entries(vars).reduce(
      (result, [key, value]) => result.replaceAll(`{${key}}`, value),
      template,
    );
  },

  // CL-I1 stubs — full generate/validate wired by M4
  generate(): MetaTagSet {
    throw new Error('TitleGenerator.generate() not yet implemented — wired by M4');
  },
  validate(): boolean {
    throw new Error('TitleGenerator.validate() not yet implemented — wired by M4');
  },
};
