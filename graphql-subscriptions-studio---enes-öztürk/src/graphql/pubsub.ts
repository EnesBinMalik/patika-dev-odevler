/**
 * Enes Öztürk - Ödev 3: GraphQL Subscriptions
 * In-Memory PubSub Engine and Filter Helpers
 */

export interface BroadcastLogItem {
  id: string;
  trigger: string;
  timestamp: number;
  payload: any;
}

export class PubSubEngine {
  private listeners: Map<string, Set<(payload: any) => void>> = new Map();
  public history: BroadcastLogItem[] = [];
  private historyListeners: Set<(item: BroadcastLogItem) => void> = new Set();

  publish(trigger: string, payload: any) {
    const logItem: BroadcastLogItem = {
      id: Math.random().toString(36).substring(2, 9),
      trigger,
      timestamp: Date.now(),
      payload,
    };

    this.history.unshift(logItem);
    if (this.history.length > 100) {
      this.history.pop();
    }

    this.historyListeners.forEach((fn) => {
      try {
        fn(logItem);
      } catch (err) {
        console.error('History listener error', err);
      }
    });

    const triggerListeners = this.listeners.get(trigger);
    if (triggerListeners) {
      triggerListeners.forEach((listener) => {
        try {
          listener(payload);
        } catch (err) {
          console.error(`Error in PubSub listener for ${trigger}:`, err);
        }
      });
    }
  }

  onHistory(callback: (item: BroadcastLogItem) => void) {
    this.historyListeners.add(callback);
    return () => {
      this.historyListeners.delete(callback);
    };
  }

  asyncIterator<T = any>(triggers: string | string[]): AsyncIterableIterator<T> {
    const triggerList = Array.isArray(triggers) ? triggers : [triggers];
    const pullQueue: Array<{
      resolve: (val: IteratorResult<T>) => void;
      reject: (err: any) => void;
    }> = [];
    const pushQueue: T[] = [];
    let listening = true;

    const listener = (payload: T) => {
      if (pullQueue.length > 0) {
        const pull = pullQueue.shift()!;
        pull.resolve({ value: payload, done: false });
      } else {
        pushQueue.push(payload);
      }
    };

    triggerList.forEach((trigger) => {
      if (!this.listeners.has(trigger)) {
        this.listeners.set(trigger, new Set());
      }
      this.listeners.get(trigger)!.add(listener);
    });

    const cleanup = () => {
      listening = false;
      triggerList.forEach((trigger) => {
        const set = this.listeners.get(trigger);
        if (set) {
          set.delete(listener);
          if (set.size === 0) {
            this.listeners.delete(trigger);
          }
        }
      });
      while (pullQueue.length > 0) {
        pullQueue.shift()!.resolve({ value: undefined as any, done: true });
      }
    };

    return {
      next(): Promise<IteratorResult<T>> {
        if (!listening) {
          return Promise.resolve({ value: undefined as any, done: true });
        }
        if (pushQueue.length > 0) {
          return Promise.resolve({ value: pushQueue.shift()!, done: false });
        }
        return new Promise<IteratorResult<T>>((resolve, reject) => {
          pullQueue.push({ resolve, reject });
        });
      },
      return(): Promise<IteratorResult<T>> {
        cleanup();
        return Promise.resolve({ value: undefined as any, done: true });
      },
      throw(error): Promise<IteratorResult<T>> {
        cleanup();
        return Promise.reject(error);
      },
      [Symbol.asyncIterator]() {
        return this;
      },
    };
  }

  getActiveListenerCount(trigger?: string): number {
    if (trigger) {
      return this.listeners.get(trigger)?.size || 0;
    }
    let total = 0;
    this.listeners.forEach((set) => {
      total += set.size;
    });
    return total;
  }
}

/**
 * Filter wrapper for GraphQL subscriptions (matches Apollo withFilter signature)
 */
export function withFilter<TPayload = any, TArgs = any>(
  asyncIteratorFn: (root: any, args: TArgs, context: any, info: any) => AsyncIterableIterator<TPayload>,
  filterFn: (root: TPayload, args: TArgs, context: any, info: any) => boolean | Promise<boolean>
) {
  return async function* (root: any, args: TArgs, context: any, info: any) {
    const asyncIterator = asyncIteratorFn(root, args, context, info);
    for await (const payload of asyncIterator) {
      if (await filterFn(payload, args, context, info)) {
        yield payload;
      }
    }
  };
}

export const pubsub = new PubSubEngine();
