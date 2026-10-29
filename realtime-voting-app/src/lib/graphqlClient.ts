/**
 * GraphQL Client with standard Query, Mutation, and Real-time SSE Subscriptions
 * Built for GraphQL Yoga backend
 * Developer: Enes Öztürk
 */

export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export async function requestGraphQL<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GraphQL HTTP Error (${response.status}): ${errorText}`);
  }

  const json: GraphQLResponse<T> = await response.json();
  if (json.errors && json.errors.length > 0) {
    throw new Error(json.errors[0].message || 'GraphQL Operation Error');
  }

  if (!json.data) {
    throw new Error('GraphQL response missing data field');
  }

  return json.data;
}

/**
 * Real-time GraphQL Subscription using Server-Sent Events (SSE)
 * Compatible with GraphQL Yoga SSE implementation
 */
export function subscribeGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {},
  onNext: (data: T) => void,
  onError?: (err: unknown) => void,
  onStatusChange?: (status: 'connecting' | 'connected' | 'disconnected') => void
): () => void {
  const url = new URL('/graphql', window.location.origin);
  url.searchParams.set('query', query);
  if (variables && Object.keys(variables).length > 0) {
    url.searchParams.set('variables', JSON.stringify(variables));
  }

  onStatusChange?.('connecting');

  let es: EventSource | null = null;
  let isClosed = false;

  try {
    es = new EventSource(url.toString());

    es.onopen = () => {
      if (!isClosed) {
        onStatusChange?.('connected');
      }
    };

    // Yoga emits events with type 'next'
    es.addEventListener('next', (event: MessageEvent) => {
      if (isClosed) return;
      try {
        const payload: GraphQLResponse<T> = JSON.parse(event.data);
        if (payload.data) {
          onNext(payload.data);
        } else if (payload.errors && payload.errors.length > 0) {
          onError?.(new Error(payload.errors[0].message));
        }
      } catch (err) {
        console.error('SSE JSON parse error:', err, event.data);
      }
    });

    // Default message fallback
    es.onmessage = (event: MessageEvent) => {
      if (isClosed) return;
      try {
        const payload: GraphQLResponse<T> = JSON.parse(event.data);
        if (payload.data) {
          onNext(payload.data);
        }
      } catch {
        // ignore comment or ping
      }
    };

    es.onerror = (err) => {
      if (!isClosed) {
        onStatusChange?.('disconnected');
        onError?.(err);
      }
    };
  } catch (err) {
    onStatusChange?.('disconnected');
    onError?.(err);
  }

  return () => {
    isClosed = true;
    if (es) {
      es.close();
      es = null;
    }
  };
}
