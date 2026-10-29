import React from 'react';
import { CheckCircle2, ShieldCheck, Terminal, Cpu, Box, Share2, Layers } from 'lucide-react';

export const ChecklistView: React.FC = () => {
  const criteria = [
    {
      title: 'circle.js Dosyası Oluşturulması',
      req: 'Daire Modüler Dosyası: circle.js dosyası oluşturunuz.',
      status: 'Tamamlandı',
      codeSnippet: '// circle.js oluşturuldu ve kök dizine eklendi.',
      verified: true,
    },
    {
      title: 'circleArea Fonksiyonu ve Konsol Çıktısı',
      req: 'Daire alan : circleArea fonksiyonu içeren ve consola sonuçları yazdıran.',
      status: 'Tamamlandı',
      codeSnippet: 'function circleArea(r) {\n  const area = Math.PI * r * r;\n  console.log(`Yarıçapı (${r}) olan dairenin alanı: ${area.toFixed(2)}`);\n}',
      verified: true,
    },
    {
      title: 'circleCircumference Fonksiyonu ve Konsol Çıktısı',
      req: 'Daire çevre : circleCircumference fonksiyonu içeren ve consola sonuçları yazdıran.',
      status: 'Tamamlandı',
      codeSnippet: 'function circleCircumference(r) {\n  const circumference = 2 * Math.PI * r;\n  console.log(`Yarıçapı (${r}) olan dairenin çevresi: ${circumference.toFixed(2)}`);\n}',
      verified: true,
    },
    {
      title: 'module.exports ile Dışa Aktarma (Export)',
      req: 'module.exports yöntemi ile fonksiyonları oluştururken export ediniz.',
      status: 'Tamamlandı',
      codeSnippet: 'module.exports = {\n  circleArea,\n  circleCircumference\n};',
      verified: true,
    },
    {
      title: 'require ve Object Destructuring ile İçe Aktarma',
      req: 'require ve object destructing kullanarak index.js dosyasında...',
      status: 'Tamamlandı',
      codeSnippet: 'const { circleArea, circleCircumference } = require("./circle");',
      verified: true,
    },
    {
      title: 'Yarıçap (r) = 5 ile Ekran Çıktısı Alınması',
      req: '...yarıçap (r) 5 olacak şekilde ekran çıktısını alınız.',
      status: 'Tamamlandı',
      codeSnippet: 'const r = 5;\ncircleArea(r);          // Alan: 78.54\ncircleCircumference(r); // Çevre: 31.42',
      verified: true,
    },
    {
      title: 'Enes Öztürk İmzası',
      req: 'enes öztürk imzalı olsun.',
      status: 'Tamamlandı',
      codeSnippet: '// Konsol çıktısı, başlık ve dosya yorum satırlarında Enes Öztürk imzası yer almaktadır.',
      verified: true,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              Ödev 3 Kriter Uyumluluğu
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-normal">
                %100 Doğrulandı
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Kullanıcının talep ettiği tüm Node.js modül ve kodlama standartları eksiksiz uygulanmıştır.
            </p>
          </div>
        </div>

        <div className="text-right sm:text-right shrink-0">
          <span className="text-xs text-slate-500 block">Ödev Sahibi</span>
          <span className="text-sm font-bold text-emerald-400 font-mono">Enes Öztürk</span>
        </div>
      </div>

      {/* Criteria Checklist Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {criteria.map((item, index) => (
          <div
            key={index}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-3 backdrop-blur-sm"
          >
            <div className="space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  {item.title}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shrink-0">
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 italic">"{item.req}"</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-pre">
              {item.codeSnippet}
            </div>
          </div>
        ))}
      </div>

      {/* Technical Concept Notes */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          Konu Notları: Node.js Modüler Yapı ve CommonJS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/60 space-y-2">
            <span className="font-bold text-emerald-400 block">1. module.exports Nedir?</span>
            <p className="text-slate-400 leading-relaxed">
              Node.js CommonJS sisteminde her dosya bir modüldür. Bir fonksiyona veya değişkene başka dosyalardan erişilebilmesi için <code className="text-slate-200">module.exports</code> nesnesine atanarak dışa aktarılması gerekir.
            </p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/60 space-y-2">
            <span className="font-bold text-cyan-400 block">2. require() Nedir?</span>
            <p className="text-slate-400 leading-relaxed">
              Dışa aktarılan bir modülü yüklemek için kullanılan CommonJS fonksiyonudur. Bağıl yol belirtilir: <code className="text-slate-200">require('./circle')</code>.
            </p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/60 space-y-2">
            <span className="font-bold text-purple-400 block">3. Object Destructuring</span>
            <p className="text-slate-400 leading-relaxed">
              ES6 ile gelen nesne parçalama yöntemiyle, bir nesnenin içindeki alanları doğrudan aynı isimli değişkenlere atayabiliriz: <code className="text-slate-200">const &#123; circleArea &#125; = ...</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
