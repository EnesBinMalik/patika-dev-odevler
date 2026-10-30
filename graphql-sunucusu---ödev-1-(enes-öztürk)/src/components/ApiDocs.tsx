import React, { useState } from 'react';
import { BookOpen, Copy, Check, Terminal, Code2, Globe, ShieldCheck } from 'lucide-react';

export const ApiDocs: React.FC = () => {
  const [copiedLang, setCopiedLang] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedLang(id);
    setTimeout(() => setCopiedLang(null), 2000);
  };

  const curlCode = `curl -X POST http://localhost:3000/graphql \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "query EventsWithRelations { events { id title user { username } location { name } participants { username } } }"
  }'`;

  const fetchCode = `// Modern JavaScript / TypeScript (fetch)
const response = await fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: \`
      query GetEventsWithRelations {
        events {
          id
          title
          user {
            id
            username
          }
          participants {
            id
            username
          }
          location {
            id
            name
          }
        }
      }
    \`,
  }),
});

const { data, errors } = await response.json();
console.log(data.events);`;

  const pythonCode = `import requests

url = "http://localhost:3000/graphql"
query = """
query {
  events {
    id
    title
    user { username }
    location { name }
    participants { username }
  }
}
"""

response = requests.post(url, json={"query": query})
data = response.json()
print(data)`;

  const apolloCode = `import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

const GET_EVENTS = gql\`
  query GetEvents {
    events {
      id
      title
      user { username }
      location { name }
      participants { username }
    }
  }
\`;

const { data } = await client.query({ query: GET_EVENTS });`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Header */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl font-bold text-white">GraphQL HTTP API Dokümantasyonu</h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Sunucuya harici istemcilerden (Postman, Apollo Studio, cURL, frontend) istek atma kılavuzu.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800 text-zinc-300">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>Endpoint:</span>
          <span className="text-purple-400 font-bold">POST /graphql</span>
        </div>
      </div>

      {/* Code Snippets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* cURL Snippet */}
        <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 overflow-hidden shadow-xl flex flex-col">
          <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-950 border-b border-zinc-800">
            <span className="text-xs font-mono font-semibold text-zinc-300 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              Terminal / cURL
            </span>
            <button
              onClick={() => copyCode(curlCode, 'curl')}
              className="text-xs flex items-center gap-1 text-zinc-400 hover:text-white transition"
            >
              {copiedLang === 'curl' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedLang === 'curl' ? 'Kopyalandı' : 'Kopyala'}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-emerald-400 bg-zinc-950/80 overflow-x-auto flex-1 leading-5">
            {curlCode}
          </pre>
        </div>

        {/* Fetch Snippet */}
        <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 overflow-hidden shadow-xl flex flex-col">
          <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-950 border-b border-zinc-800">
            <span className="text-xs font-mono font-semibold text-zinc-300 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              JavaScript / TypeScript (Fetch API)
            </span>
            <button
              onClick={() => copyCode(fetchCode, 'fetch')}
              className="text-xs flex items-center gap-1 text-zinc-400 hover:text-white transition"
            >
              {copiedLang === 'fetch' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedLang === 'fetch' ? 'Kopyalandı' : 'Kopyala'}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-indigo-300 bg-zinc-950/80 overflow-x-auto flex-1 leading-5">
            {fetchCode}
          </pre>
        </div>

        {/* Apollo Client Snippet */}
        <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 overflow-hidden shadow-xl flex flex-col">
          <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-950 border-b border-zinc-800">
            <span className="text-xs font-mono font-semibold text-zinc-300 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-purple-400" />
              React & Apollo Client
            </span>
            <button
              onClick={() => copyCode(apolloCode, 'apollo')}
              className="text-xs flex items-center gap-1 text-zinc-400 hover:text-white transition"
            >
              {copiedLang === 'apollo' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedLang === 'apollo' ? 'Kopyalandı' : 'Kopyala'}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-purple-300 bg-zinc-950/80 overflow-x-auto flex-1 leading-5">
            {apolloCode}
          </pre>
        </div>

        {/* Python Snippet */}
        <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 overflow-hidden shadow-xl flex flex-col">
          <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-950 border-b border-zinc-800">
            <span className="text-xs font-mono font-semibold text-zinc-300 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-400" />
              Python (Requests)
            </span>
            <button
              onClick={() => copyCode(pythonCode, 'python')}
              className="text-xs flex items-center gap-1 text-zinc-400 hover:text-white transition"
            >
              {copiedLang === 'python' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedLang === 'python' ? 'Kopyalandı' : 'Kopyala'}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-amber-300 bg-zinc-950/80 overflow-x-auto flex-1 leading-5">
            {pythonCode}
          </pre>
        </div>
      </div>

      {/* Signature note */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Bu GraphQL sunucusu Enes Öztürk imzasıyla hazırlanmıştır.</span>
        </div>
        <span className="font-mono text-zinc-500">HTTP Status: 200 OK / 400 GraphQL Errors</span>
      </div>
    </div>
  );
};
