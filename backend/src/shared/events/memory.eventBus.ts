import { EventBus, EventHandler } from './eventBus.interface';
import { logger } from '../utils/logger';

export class InMemoryEventBus implements EventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map();

  async publish<T = any>(event: string, payload: T): Promise<void> {
    logger.info(`[EventBus] Publishing event: ${event}`);
    const eventHandlers = this.handlers.get(event);
    if (!eventHandlers || eventHandlers.size === 0) return;

    for (const handler of eventHandlers) {
      try {
        await handler(payload);
      } catch (err) {
        logger.error(`[EventBus] Error handling event ${event}:`, err);
      }
    }
  }

  subscribe<T = any>(event: string, handler: EventHandler<T>): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  unsubscribe<T = any>(event: string, handler: EventHandler<T>): void {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      eventHandlers.delete(handler);
    }
  }
}

export const eventBus = new InMemoryEventBus();
