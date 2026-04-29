import type {
  MessageCreatedPayload,
  MessageDeletedPayload,
  MessageEditedPayload,
  VisibilityChangedPayload,
} from '../events/eventBus';
import { metaTagUpdateQueue } from './metaTagUpdate.queue';

/**
 * EventListener maps domain events to background meta-tag regeneration work.
 * The worker process owns this class so backend-api replicas never subscribe.
 */
export class EventListener {
  async onMessageCreated(event: MessageCreatedPayload): Promise<void> {
    await metaTagUpdateQueue.scheduleUpdate({
      channelId: event.channelId,
      triggeredBy: 'message',
    });
  }

  async onMessageEdited(event: MessageEditedPayload): Promise<void> {
    await metaTagUpdateQueue.scheduleUpdate({
      channelId: event.channelId,
      triggeredBy: 'edit',
    });
  }

  async onMessageDeleted(event: MessageDeletedPayload): Promise<void> {
    await metaTagUpdateQueue.scheduleUpdate({
      channelId: event.channelId,
      triggeredBy: 'message',
    });
  }

  async onVisibilityChanged(event: VisibilityChangedPayload): Promise<void> {
    // Three branches per dev-spec-seo §6 flow F8 / B12–B17:
    // → PRIVATE        (B12): cacheInvalidator already invalidates MetaTagCache and removes
    //                         from sitemap; schedule high-priority job to purge the DB record.
    // → PUBLIC_NO_INDEX (B16): high-priority regen so robots=noindex, follow is served promptly.
    // → PUBLIC_INDEXABLE (B17): high-priority regen so robots=index, follow and canonical URL
    //                           are warmed in cache before the next crawler visit.
    await metaTagUpdateQueue.scheduleUpdate({
      channelId: event.channelId,
      triggeredBy: 'visibility',
      priority: 'high',
    });
  }
}
