/**
 * @author Enes Öztürk
 * @assignment GraphQL Ödev 2 - Schema Builder & Executor
 */

import { buildSchema, graphql as executeGraphQL, GraphQLSchema } from 'graphql';
import { typeDefs } from './schemaText';
import { rootResolvers } from './resolvers';

export let schema: GraphQLSchema;

try {
  schema = buildSchema(typeDefs);
} catch (err) {
  console.error('Failed to build GraphQL Schema:', err);
}

export interface ExecutionResult {
  data?: any;
  errors?: any[];
  durationMs: number;
  status: 'SUCCESS' | 'ERROR';
}

export async function runQuery(source: string, variableValues?: Record<string, any>): Promise<ExecutionResult> {
  const startTime = performance.now();
  try {
    const result = await executeGraphQL({
      schema,
      source,
      rootValue: rootResolvers,
      variableValues: variableValues || {}
    });

    const durationMs = Math.round((performance.now() - startTime) * 10) / 10;
    return {
      data: result.data,
      errors: result.errors?.map((err) => ({
        message: err.message,
        path: err.path,
        locations: err.locations
      })),
      durationMs,
      status: result.errors && result.errors.length > 0 ? 'ERROR' : 'SUCCESS'
    };
  } catch (error: any) {
    const durationMs = Math.round((performance.now() - startTime) * 10) / 10;
    return {
      errors: [{ message: error?.message || 'Bilinmeyen bir GraphQL yürütme hatası oluştu.' }],
      durationMs,
      status: 'ERROR'
    };
  }
}
