import React, { useState } from 'react';
import { Terminal, Copy, Check, Code2, Server, CheckCircle2 } from 'lucide-react';

export const ApiGuide: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const curlAllCountries = `curl -X POST https://${window.location.host}/graphql \\
  -H "Content-Type: application/json" \\
  -d '{"query": "query AllCountries { countries { name emoji continent { name } languages { name native } } }"}'`;

  const curlSingleTR = `curl -X POST https://${window.location.host}/graphql \\
  -H "Content-Type: application/json" \\
  -d '{"query": "query Single { country(code: \\"TR\\") { name emoji continent { name } languages { name native } } }"}'`;

  const jsFetchExample = `// JavaScript / TypeScript (Fetch API)
async function fetchCountryTR() {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: \`
        query Single {
          country(code: "TR") {
            name
            emoji
            continent {
              name
            }
            languages {
              name
              native
            }
          }
        }
      \`,
    }),
  });

  const { data, errors } = await response.json();
  if (errors) {
    console.error('GraphQL Errors:', errors);
    return;
  }
  console.log('Country data:', data.country);
}

fetchCountryTR();`;

  const pythonExample = `# Python (requests)
import requests

url = "http://localhost:3000/graphql"
query = """
query Single {
  country(code: "TR") {
    name
    emoji
    continent {
      name
    }
    languages {
      name
      native
    }
  }
}
"""

response = requests.post(url, json={"query": query})
result = response.json()
print(result["data"]["country"])`;

  return (
    <div className="flex flex-col gap-6">
      {/* Intro Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Code2 className="w-5 h-5 text-pink-400" />
          HTTP & Entegrasyon Kılavuzu (cURL / Fetch / Python)
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Bu GraphQL backend'i standart HTTP POST ve GET istekleriyle her türlü frontend, backend veya script üzerinden doğrudan tüketebilirsiniz.
        </p>
      </div>

      {/* Endpoint Info Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
          <Server className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs text-slate-400">Endpoint URL</div>
            <div className="font-mono text-sm font-bold text-white mt-0.5">/graphql</div>
            <div className="text-[11px] text-slate-500 mt-1">Method: POST veya GET</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs text-slate-400">CORS Desteği</div>
            <div className="font-mono text-sm font-bold text-emerald-400 mt-0.5">Aktif (Origin: *)</div>
            <div className="text-[11px] text-slate-500 mt-1">Tüm domainlerden çağrılabilir</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
          <Terminal className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs text-slate-400">İmza & Sahip</div>
            <div className="text-sm font-bold text-cyan-300 mt-0.5">Enes Öztürk</div>
            <div className="text-[11px] text-slate-500 mt-1">Proje 1 - Countries GraphQL API</div>
          </div>
        </div>
      </div>

      {/* Code Tabs / Sections */}
      <div className="space-y-6">
        {/* cURL Section */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-pink-400" />
              <span className="text-xs font-semibold text-white">1. cURL Terminal Komutları</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Bash</span>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-300">Örnek 1: Tek Bir Ülkeyi Sorgulama (Single TR):</span>
                <button
                  onClick={() => handleCopy(curlSingleTR, 'curl-tr')}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 bg-slate-800 rounded"
                >
                  {copiedId === 'curl-tr' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === 'curl-tr' ? 'Kopyalandı' : 'Kopyala'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto">
                {curlSingleTR}
              </pre>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-300">Örnek 2: Tüm Ülkeleri ve İlişkileri Sorgulama (AllCountries):</span>
                <button
                  onClick={() => handleCopy(curlAllCountries, 'curl-all')}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 bg-slate-800 rounded"
                >
                  {copiedId === 'curl-all' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === 'curl-all' ? 'Kopyalandı' : 'Kopyala'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto">
                {curlAllCountries}
              </pre>
            </div>
          </div>
        </div>

        {/* JavaScript / TypeScript Fetch */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-white">2. JavaScript / TypeScript (Fetch API)</span>
            </div>
            <button
              onClick={() => handleCopy(jsFetchExample, 'js-fetch')}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 bg-slate-800 rounded"
            >
              {copiedId === 'js-fetch' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedId === 'js-fetch' ? 'Kopyalandı' : 'Kopyala'}</span>
            </button>
          </div>
          <pre className="p-4 bg-slate-950 font-mono text-xs text-cyan-200 overflow-x-auto">
            {jsFetchExample}
          </pre>
        </div>

        {/* Python Requests */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-white">3. Python (requests)</span>
            </div>
            <button
              onClick={() => handleCopy(pythonExample, 'py')}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 bg-slate-800 rounded"
            >
              {copiedId === 'py' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedId === 'py' ? 'Kopyalandı' : 'Kopyala'}</span>
            </button>
          </div>
          <pre className="p-4 bg-slate-950 font-mono text-xs text-amber-200 overflow-x-auto">
            {pythonExample}
          </pre>
        </div>
      </div>
    </div>
  );
};
