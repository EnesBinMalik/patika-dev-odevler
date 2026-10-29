import React, { useState } from 'react';
import { BlogPost } from '../types/blog';
import { HOMEWORK_REQUIREMENTS, RAW_SOURCE_FILES } from '../data/homeworkCode';
import { Check, CheckCircle2, ChevronRight, Copy, Play, Terminal, FileCode2, ArrowRight } from 'lucide-react';

interface HomeworkViewerProps {
  posts: BlogPost[];
  onOpenPost: (post: BlogPost) => void;
}

export const HomeworkViewer: React.FC<HomeworkViewerProps> = ({ posts, onOpenPost }) => {
  const [activeFileTab, setActiveFileTab] = useState<'app_js' | 'index_ejs' | 'post_ejs' | 'model_post_js'>('app_js');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  // Route Simulator State
  const [selectedPostId, setSelectedPostId] = useState<string>(posts[0]?._id || '');
  const [simulatedLog, setSimulatedLog] = useState<{
    status: number;
    matchedRoute: string;
    extractedParam: string;
    queriedPost: BlogPost | null;
    renderedTemplate: string;
  } | null>(null);

  const handleCopyCode = (key: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(key);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleRunSimulation = (idToTest: string) => {
    const found = posts.find((p) => p._id === idToTest) || null;
    setSimulatedLog({
      status: found ? 200 : 404,
      matchedRoute: "app.get('/posts/:id')",
      extractedParam: idToTest,
      queriedPost: found,
      renderedTemplate: found ? 'post.ejs' : '404.ejs',
    });
  };

  const currentFileContent = RAW_SOURCE_FILES[activeFileTab];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Başlık & İntro */}
      <div className="border-b border-stone-200 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded">
              Node.js & Express · Ödev 10 Doğrulama
            </span>
            <h2 className="text-3xl font-serif font-bold text-stone-900 mt-2">
              Clean Blog Projesi 4. Bölüm (Tekil Post)
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              Yazar ve Geliştirici: <strong>Enes Öztürk</strong> | Tüm isterler eksiksiz tamamlandı.
            </p>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>4 / 4 Ödev Maddesi Tamamlandı (%100)</span>
          </div>
        </div>
      </div>

      {/* 4 Ödev Maddesinin Detaylı Analizi */}
      <section className="space-y-4">
        <h3 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
          <span>Ödev Maddeleri ve Kod Çözümleri</span>
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {HOMEWORK_REQUIREMENTS.map((req) => (
            <div
              key={req.id}
              className="p-5 bg-white border border-stone-200 rounded-lg shadow-xs hover:border-stone-300 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-stone-900 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {req.id}
                  </span>
                  <h4 className="text-sm font-semibold text-stone-900 font-mono">
                    {req.task}
                  </h4>
                </div>
                <span className="text-xs font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded border border-stone-200 shrink-0">
                  {req.fileLocation}
                </span>
              </div>

              <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                {req.explanation}
              </p>

              <div className="mt-3 relative rounded-md bg-stone-950 p-3 overflow-x-auto text-xs font-mono text-stone-200">
                <pre>{req.codeSnippet}</pre>
                <button
                  onClick={() => handleCopyCode(`snippet-${req.id}`, req.codeSnippet)}
                  className="absolute top-2 right-2 p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  title="Parçayı Kopyala"
                >
                  {copiedFile === `snippet-${req.id}` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* İNTERAKTİF ROTA VE EXPRESS GET('/posts/:id') SİMÜLATÖRÜ */}
      <section className="p-6 bg-stone-900 text-stone-100 rounded-xl shadow-md border border-stone-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-serif font-bold text-white">
              Canlı Express Rota Simülatörü: GET /posts/:id
            </h3>
          </div>
          <span className="text-xs text-stone-400 font-mono">
            app.js &bull; req.params.id test ortamı
          </span>
        </div>

        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          Aşağıdaki seçim kutusundan mevcut bir postu seçin veya özel bir MongoDB <code className="text-amber-300 font-mono text-xs">_id</code> girin. &quot;İsteği Gönder&quot; butonuna bastığınızda Express router&apos;ın <code className="text-amber-300 font-mono text-xs">app.get('/posts/:id')</code> metodunun nasıl çalıştığını ve <code className="text-amber-300 font-mono text-xs">post.ejs</code> şablonuna nasıl veri gönderildiğini adım adım izleyebilirsiniz.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-mono text-stone-400 mb-1">
              Test Edilecek Post ID (_id):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={selectedPostId}
                onChange={(e) => setSelectedPostId(e.target.value)}
                className="flex-1 bg-stone-950 border border-stone-700 rounded px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-400"
                placeholder="Örn: 65b91a7f34e81a0014a9c101"
              />
              <select
                onChange={(e) => setSelectedPostId(e.target.value)}
                value={selectedPostId}
                className="bg-stone-800 border border-stone-700 rounded px-2.5 py-2 text-xs text-stone-200 focus:outline-none"
              >
                {posts.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title.substring(0, 28)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => handleRunSimulation(selectedPostId)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded font-semibold text-xs transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>İsteği Gönder (GET)</span>
            </button>
          </div>
        </div>

        {/* Simülasyon Çıktısı */}
        {simulatedLog && (
          <div className="p-4 bg-stone-950 border border-stone-800 rounded-lg space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-stone-400 border-b border-stone-800 pb-2">
              <span>HTTP 1.1 / GET /posts/{simulatedLog.extractedParam}</span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  simulatedLog.status === 200 ? 'bg-emerald-900 text-emerald-200' : 'bg-red-900 text-red-200'
                }`}
              >
                {simulatedLog.status} OK
              </span>
            </div>

            <div className="space-y-1.5 text-stone-300">
              <div className="text-amber-400">
                1. Express Route: <span className="text-white">{simulatedLog.matchedRoute}</span>
              </div>
              <div className="text-stone-300">
                2. req.params: <span className="text-emerald-400">&#123; id: &quot;{simulatedLog.extractedParam}&quot; &#125;</span>
              </div>
              <div className="text-stone-300">
                3. Mongoose: <span className="text-cyan-400">await Post.findById(&quot;{simulatedLog.extractedParam}&quot;)</span>
              </div>
              <div className="text-stone-300">
                4. Controller Response: <span className="text-amber-300">res.render(&apos;{simulatedLog.renderedTemplate}&apos;, &#123; post &#125;)</span>
              </div>
            </div>

            {simulatedLog.queriedPost ? (
              <div className="mt-3 p-3 bg-stone-900 rounded border border-stone-800 space-y-1 text-stone-300">
                <div className="text-xs font-bold text-amber-300 mb-1">
                  &lt;%= post.ejs %&gt; Şablonuna Gönderilen Değişkenler:
                </div>
                <div>&bull; <strong>post.title:</strong> &quot;{simulatedLog.queriedPost.title}&quot;</div>
                <div>&bull; <strong>post.dateCreated:</strong> &quot;{simulatedLog.queriedPost.dateCreated}&quot;</div>
                <div>&bull; <strong>post.detail:</strong> &quot;{simulatedLog.queriedPost.detail.substring(0, 90)}...&quot;</div>
                <div>&bull; <strong>Yazar İmzası:</strong> &quot;Enes Öztürk&quot;</div>
                <div className="pt-2">
                  <button
                    onClick={() => onOpenPost(simulatedLog.queriedPost!)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-stone-950 font-sans font-bold text-xs rounded hover:bg-amber-300 transition-colors cursor-pointer"
                  >
                    <span>Bu Postu post.ejs Sayfasında Canlı Aç</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-red-400">
                Hata: Veritabanında belirtilen ID ile eşleşen bir post bulunamadı (404 Not Found).
              </div>
            )}
          </div>
        )}
      </section>

      {/* TÜM PROJE DOSYALARININ KAYNAK KODLARI */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
              <FileCode2 className="w-5 h-5 text-amber-600" />
              <span>Clean Blog Projesi Kaynak Kodları (Ödev 10)</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Tüm dosyaları doğrudan görüntüleyebilir ve tek tıkla kopyalayabilirsiniz.
            </p>
          </div>

          <button
            onClick={() => handleCopyCode(activeFileTab, currentFileContent)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium cursor-pointer transition-colors shadow-xs"
          >
            {copiedFile === activeFileTab ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kopyalandı!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Aktif Dosyayı Kopyala</span>
              </>
            )}
          </button>
        </div>

        {/* Dosya Sekmeleri */}
        <div className="flex flex-wrap gap-1 border-b border-stone-200">
          <button
            onClick={() => setActiveFileTab('app_js')}
            className={`px-4 py-2 text-xs font-mono font-medium rounded-t border-t border-l border-r transition-colors cursor-pointer ${
              activeFileTab === 'app_js'
                ? 'bg-stone-950 text-amber-300 border-stone-950 font-bold'
                : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
            }`}
          >
            app.js
          </button>
          <button
            onClick={() => setActiveFileTab('index_ejs')}
            className={`px-4 py-2 text-xs font-mono font-medium rounded-t border-t border-l border-r transition-colors cursor-pointer ${
              activeFileTab === 'index_ejs'
                ? 'bg-stone-950 text-amber-300 border-stone-950 font-bold'
                : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
            }`}
          >
            views/index.ejs
          </button>
          <button
            onClick={() => setActiveFileTab('post_ejs')}
            className={`px-4 py-2 text-xs font-mono font-medium rounded-t border-t border-l border-r transition-colors cursor-pointer ${
              activeFileTab === 'post_ejs'
                ? 'bg-stone-950 text-amber-300 border-stone-950 font-bold'
                : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
            }`}
          >
            views/post.ejs
          </button>
          <button
            onClick={() => setActiveFileTab('model_post_js')}
            className={`px-4 py-2 text-xs font-mono font-medium rounded-t border-t border-l border-r transition-colors cursor-pointer ${
              activeFileTab === 'model_post_js'
                ? 'bg-stone-950 text-amber-300 border-stone-950 font-bold'
                : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
            }`}
          >
            models/Post.js
          </button>
        </div>

        {/* Kod Görüntüleyici Kutu */}
        <div className="bg-stone-950 rounded-b-lg rounded-tr-lg p-5 font-mono text-xs text-stone-200 overflow-x-auto shadow-inner leading-relaxed border border-stone-900">
          <pre>{currentFileContent}</pre>
        </div>
      </section>
    </div>
  );
};
