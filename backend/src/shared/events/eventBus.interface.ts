export type EventHandler<T = any> = (payload: T) => Promise<void> | void;

export interface EventBus {
  publish<T = any>(event: string, payload: T): Promise<void>;
  subscribe<T = any>(event: string, handler: EventHandler<T>): void;
  unsubscribe<T = any>(event: string, handler: EventHandler<T>): void;
}
