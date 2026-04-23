import { eventBus, EventChannels } from '../events/eventBus';
import { createLogger } from '../lib/logger';
import { EventListener } from './eventListener';

type UnsubscribeFn = () => void;

const logger = createLogger({ component: 'meta-tag-update-runtime' });

let unsubscribers: UnsubscribeFn[] = [];
let startPromise: Promise<void> | null = null;

function wrapHandler<T>(eventName: string, handler: (payload: T) => Promise<void>): (payload: T) => void {
  return (payload: T) => {
    handler(payload).catch((err) => {
      logger.error({ err, eventName }, 'Meta tag update handler failed');
    });
  };
}

export function startMetaTagUpdateRuntime(): Promise<void> {
  if (startPromise) return startPromise;

  startPromise = (async () => {
    const listener = new EventListener();

    const subscriptions = [
      eventBus.subscribe(
        EventChannels.MESSAGE_CREATED,
        wrapHandler(EventChannels.MESSAGE_CREATED, (payload) => listener.onMessageCreated(payload)),
      ),
      eventBus.subscribe(
        EventChannels.MESSAGE_EDITED,
        wrapHandler(EventChannels.MESSAGE_EDITED, (payload) => listener.onMessageEdited(payload)),
      ),
      eventBus.subscribe(
        EventChannels.MESSAGE_DELETED,
        wrapHandler(EventChannels.MESSAGE_DELETED, (payload) => listener.onMessageDeleted(payload)),
      ),
      eventBus.subscribe(
        EventChannels.VISIBILITY_CHANGED,
        wrapHandler(EventChannels.VISIBILITY_CHANGED, (payload) => listener.onVisibilityChanged(payload)),
      ),
    ];

    unsubscribers = subscriptions.map((subscription) => subscription.unsubscribe);
    await Promise.all(subscriptions.map((subscription) => subscription.ready));
    logger.info('Meta tag update runtime subscriptions ready');
  })().catch((err) => {
    startPromise = null;
    throw err;
  });

  return startPromise;
}

export async function stopMetaTagUpdateRuntime(): Promise<void> {
  const activeStart = startPromise;
  if (activeStart) {
    await activeStart.catch(() => undefined);
  }

  startPromise = null;
  for (const unsubscribe of unsubscribers) {
    unsubscribe();
  }
  unsubscribers = [];
}
