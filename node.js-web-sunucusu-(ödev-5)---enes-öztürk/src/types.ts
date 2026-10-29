/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RoutePath = '/' | '/index' | '/hakkimda' | '/iletisim' | '/404' | string;

export interface ServerLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'HEAD';
  url: string;
  statusCode: number;
  statusText: string;
  durationMs: number;
  responseBytes: number;
  clientIp: string;
}

export interface TestCase {
  id: string;
  name: string;
  category: string;
  requirement: string;
  testRoute?: string;
  expectedHeading: string;
  expectedStatus: number;
  status: 'idle' | 'running' | 'passed' | 'failed';
  details?: string;
}
