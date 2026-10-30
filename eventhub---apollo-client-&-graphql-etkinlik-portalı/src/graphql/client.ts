import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  Observable,
} from '@apollo/client';
import { print } from 'graphql';
import { executeGraphQL } from './schema.ts';

// Track query activity for the built-in GraphQL inspector console
export interface GraphQLActivityLog {
  id: string;
  timestamp: string;
  operationName?: string;
  query: string;
  variables?: Record<string, any>;
  durationMs: number;
  status: 'success' | 'error';
  responsePreview?: string;
}

export const activityLogs: GraphQLActivityLog[] = [];
const logListeners = new Set<() => void>();

export function subscribeToLogs(listener: () => void) {
  logListeners.add(listener);
  return () => {
    logListeners.delete(listener);
  };
}

function notifyLogs() {
  logListeners.forEach((l) => l());
}

export function clearLogs() {
  activityLogs.length = 0;
  notifyLogs();
}

// Check if user specified a remote GraphQL backend endpoint in localStorage
const CUSTOM_ENDPOINT_KEY = 'eventhub_custom_graphql_endpoint';

export function getCustomEndpoint(): string | null {
  try {
    return localStorage.getItem(CUSTOM_ENDPOINT_KEY);
  } catch {
    return null;
  }
}

export function setCustomEndpoint(url: string | null) {
  try {
    if (url && url.trim()) {
      localStorage.setItem(CUSTOM_ENDPOINT_KEY, url.trim());
    } else {
      localStorage.removeItem(CUSTOM_ENDPOINT_KEY);
    }
  } catch {
    // ignore
  }
}

const localSchemaLink = new ApolloLink((operation) => {
  return new Observable((observer) => {
    const source = print(operation.query);
    const variableValues = operation.variables;
    const startTime = performance.now();
    const logId = String(Date.now() + Math.random());

    // 120ms realistic network latency simulation for smooth UI transitions
    const timer = setTimeout(async () => {
      try {
        const result = await executeGraphQL(source, variableValues);
        const duration = Math.round(performance.now() - startTime);

        activityLogs.unshift({
          id: logId,
          timestamp: new Date().toLocaleTimeString('tr-TR'),
          operationName: operation.operationName || 'AnonymousQuery',
          query: source,
          variables: variableValues,
          durationMs: duration,
          status: result.errors ? 'error' : 'success',
          responsePreview: JSON.stringify(result.data || result.errors, null, 2),
        });
        if (activityLogs.length > 50) activityLogs.pop();
        notifyLogs();

        observer.next(result);
        observer.complete();
      } catch (err: any) {
        const duration = Math.round(performance.now() - startTime);
        activityLogs.unshift({
          id: logId,
          timestamp: new Date().toLocaleTimeString('tr-TR'),
          operationName: operation.operationName || 'ErrorQuery',
          query: source,
          variables: variableValues,
          durationMs: duration,
          status: 'error',
          responsePreview: err?.message || 'Bilinmeyen hata',
        });
        notifyLogs();
        observer.error(err);
      }
    }, 120);

    return () => clearTimeout(timer);
  });
});

export function createApolloClient(customUrl?: string | null) {
  const endpoint = customUrl ?? getCustomEndpoint();

  const link = endpoint
    ? ApolloLink.split(
        () => false, // fallback logic if needed
        new HttpLink({ uri: endpoint }),
        localSchemaLink
      )
    : localSchemaLink;

  return new ApolloClient({
    link,
    cache: new InMemoryCache({
      typePolicies: {
        Event: {
          keyFields: ['id'],
        },
        User: {
          keyFields: ['id'],
        },
        Location: {
          keyFields: ['id'],
        },
        Participant: {
          keyFields: ['id'],
        },
      },
    }),
  });
}

export const apolloClient = createApolloClient();
