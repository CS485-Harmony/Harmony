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
    await metaTagUpdateQueue.scheduleUpdate({
      channelId: event.channelId,
      triggeredBy: 'visibility',
      priority: 'high',
    });
  }
}
