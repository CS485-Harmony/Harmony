// CL-C2.2 TitleGenerator — generates SEO-optimized titles (AC-2: ≤60 chars)
import type { ChannelContext, MessageContext } from './types';

const MAX_LENGTH = 60;

const CHANNEL_TEMPLATE = '{channelName} — {serverName}';

export const TitleGenerator = {
  maxLength: MAX_LENGTH,

  generateFromChannel(channel: ChannelContext): string {
    const raw = CHANNEL_TEMPLATE.replace('{channelName}', channel.name).replace(
      '{serverName}',
      channel.serverName,
    );
    return this.truncateWithEllipsis(this.sanitizeForTitle(raw));
  },

  generateFromMessage(message: MessageContext, channel: ChannelContext): string {
    const raw = `${this.sanitizeForTitle(message.content)} — ${channel.serverName}`;
    return this.truncateWithEllipsis(raw);
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
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  },

  applyTemplate(template: string, vars: Record<string, string>): string {
    return Object.entries(vars).reduce(
      (result, [key, value]) => result.replace(`{${key}}`, value),
      template,
    );
  },
};
