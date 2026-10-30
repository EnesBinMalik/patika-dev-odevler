/**
 * Enes Öztürk - Ödev 3: GraphQL Subscriptions
 * GraphQL Executor & Live Subscription Listener Service
 */

import { execute, ExecutionResult, parse, subscribe } from 'graphql';
import { schema } from './schema.ts';

export interface SubscriptionHandle {
  id: string;
  query: string;
  variables?: Record<string, any>;
  unsubscribe: () => void;
  startTime: number;
}

/**
 * Execute a standard GraphQL Query or Mutation
 */
export async function runGraphQLQuery(
  source: string,
  variableValues?: Record<string, any>
): Promise<ExecutionResult> {
  try {
    const document = parse(source);
    const result = await execute({
      schema,
      document,
      variableValues,
    });
    return result;
  } catch (error: any) {
    return {
      errors: [
        {
          message: error.message || 'Bilinmeyen GraphQL Hatası',
          locations: error.locations,
          nodes: error.nodes,
          source: error.source,
          positions: error.positions,
          path: error.path,
          originalError: error,
          extensions: {},
          name: 'GraphQLError',
          [Symbol.toStringTag]: 'GraphQLError',
        } as any,
      ],
    };
  }
}

/**
 * Open a live GraphQL Subscription stream
 */
export async function runGraphQLSubscription(
  source: string,
  variableValues: Record<string, any> | undefined,
  onData: (result: ExecutionResult) => void,
  onError?: (err: any) => void
): Promise<SubscriptionHandle> {
  const subId = Math.random().toString(36).substring(2, 9);
  let active = true;

  try {
    const document = parse(source);
    const resultOrIterable = await subscribe({
      schema,
      document,
      variableValues,
    });

    // Check if subscribe returned an immediate error or an AsyncIterable
    if (Symbol.asyncIterator in resultOrIterable) {
      const asyncIterator = resultOrIterable as AsyncIterableIterator<ExecutionResult>;

      // Consume the stream in the background
      (async () => {
        try {
          for await (const payload of asyncIterator) {
            if (!active) break;
            onData(payload);
          }
        } catch (streamErr) {
          if (active && onError) {
            onError(streamErr);
          }
        }
      })();

      return {
        id: subId,
        query: source,
        variables: variableValues,
        startTime: Date.now(),
        unsubscribe: () => {
          active = false;
          if (asyncIterator.return) {
            asyncIterator.return();
          }
        },
      };
    } else {
      // Immediate execution result (probably validation error)
      onData(resultOrIterable as ExecutionResult);
      return {
        id: subId,
        query: source,
        variables: variableValues,
        startTime: Date.now(),
        unsubscribe: () => {
          active = false;
        },
      };
    }
  } catch (err: any) {
    if (onError) onError(err);
    return {
      id: subId,
      query: source,
      variables: variableValues,
      startTime: Date.now(),
      unsubscribe: () => {
        active = false;
      },
    };
  }
}
