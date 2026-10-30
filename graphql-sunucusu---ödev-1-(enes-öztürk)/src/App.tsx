/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Playground } from './components/Playground';
import { HomeworkVerifier } from './components/HomeworkVerifier';
import { SchemaViewer } from './components/SchemaViewer';
import { DatasetViewer } from './components/DatasetViewer';
import { ApiDocs } from './components/ApiDocs';
import { executeGraphQL, getDatabase, resetDatabase } from './graphql/schema';
import { ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'playground' | 'verifier' | 'schema' | 'dataset' | 'docs'>(
    'playground'
  );
  const [serverStatus, setServerStatus] = useState<'online' | 'connecting' | 'error'>('online');
  const [dbData, setDbData] = useState<any>(getDatabase());

  // Function to execute GraphQL query with timing
  const handleExecuteQuery = async (query: string, variables?: any) => {
    const start = performance.now();

    // First attempt to call the live HTTP endpoint /graphql
    try {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      });

      if (response.ok || response.status === 400) {
        const result = await response.json();
        const duration = Math.round(performance.now() - start);
        setServerStatus('online');
        setDbData(getDatabase());
        return { result, duration: Math.max(duration, 1) };
      }
    } catch (_err) {
      // Fallback seamlessly to direct in-memory GraphQL execution
    }

    const result = await executeGraphQL(query, variables);
    const duration = Math.round(performance.now() - start);
    setServerStatus('online');
    setDbData(getDatabase());
    return { result, duration: Math.max(duration, 1) };
  };

  const handleResetData = async () => {
    try {
      await fetch('/api/reset', { method: 'POST' });
    } catch (_e) {
      // ignore
    }
    resetDatabase();
    setDbData(getDatabase());
  };

  const handleOpenInPlayground = (query: string) => {
    setActiveTab('playground');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-purple-900/50 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        serverStatus={serverStatus}
        resetDb={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'playground' && (
          <Playground onExecute={handleExecuteQuery} />
        )}

        {activeTab === 'verifier' && (
          <HomeworkVerifier
            onExecute={handleExecuteQuery}
            onOpenInPlayground={handleOpenInPlayground}
          />
        )}

        {activeTab === 'schema' && <SchemaViewer />}

        {activeTab === 'dataset' && (
          <DatasetViewer
            data={dbData}
            onReset={handleResetData}
            onRefresh={() => setDbData(getDatabase())}
          />
        )}

        {activeTab === 'docs' && <ApiDocs />}
      </main>

      {/* Footer with Enes Öztürk Signature */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-300">GraphQL Sunucusu • Ödev 1</span>
            <span className="text-zinc-700">|</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Hazırlayan: Enes Öztürk
            </span>
          </div>

          <div className="flex items-center gap-4 text-zinc-500">
            <span>Users • Events • Locations • Participants</span>
            <span>•</span>
            <span className="font-mono">Spec v1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
