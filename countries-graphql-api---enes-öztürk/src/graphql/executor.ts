import { graphql as executeSchema } from 'graphql';
import { schema } from './schema.ts';

export interface GraphQLResponse {
  data?: any;
  errors?: any[];
  executionTimeMs: number;
  source: 'http-api' | 'in-memory-engine';
  endpoint: string;
}

export async function runGraphQLQuery(
  query: string,
  variablesStr?: string,
  operationName?: string
): Promise<GraphQLResponse> {
  const startTime = performance.now();
  let variables: Record<string, any> = {};

  if (variablesStr && variablesStr.trim()) {
    try {
      variables = JSON.parse(variablesStr);
    } catch (err: any) {
      return {
        errors: [{ message: `Invalid JSON in variables: ${err.message}` }],
        executionTimeMs: Math.round(performance.now() - startTime),
        source: 'in-memory-engine',
        endpoint: '/graphql',
      };
    }
  }

  // 1. First attempt real HTTP call to /graphql endpoint
  try {
    const res = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: Object.keys(variables).length > 0 ? variables : undefined,
        operationName: operationName || undefined,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      const elapsed = Math.round(performance.now() - startTime);
      return {
        data: json.data,
        errors: json.errors,
        executionTimeMs: elapsed,
        source: 'http-api',
        endpoint: '/graphql',
      };
    }
  } catch (err) {
    // If backend endpoint is not currently running or in preview dev mode, fall back smoothly
  }

  // 2. Direct schema execution fallback
  try {
    const result = await executeSchema({
      schema,
      source: query,
      variableValues: variables,
      operationName,
    });
    const elapsed = Math.round(performance.now() - startTime);

    return {
      data: result.data,
      errors: result.errors?.map(e => ({
        message: e.message,
        locations: e.locations,
        path: e.path,
      })),
      executionTimeMs: elapsed,
      source: 'in-memory-engine',
      endpoint: '/graphql (Engine)',
    };
  } catch (err: any) {
    const elapsed = Math.round(performance.now() - startTime);
    return {
      errors: [{ message: err.message || 'Execution failed' }],
      executionTimeMs: elapsed,
      source: 'in-memory-engine',
      endpoint: '/graphql (Engine)',
    };
  }
}
