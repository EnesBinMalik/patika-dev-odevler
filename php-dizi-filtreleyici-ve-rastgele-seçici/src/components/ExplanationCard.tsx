import React from 'react';
import { BookOpen, Check, Layers, AlertTriangle, Lightbulb } from 'lucide-react';

export const ExplanationCard: React.FC = () => {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <BookOpen className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">
            Fonksiyonun Matematiksel ve Mantıksal Çözümlemesi
          </h3>
          <p className="text-xs text-slate-400">
            3 PHP yerleşik fonksiyonunun birbiriyle uyum içinde çalışmasının detayları.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Function 1 */}
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-indigo-400">1. array_filter()</span>
            <span className="text-[10px] text-slate-500 font-mono">Temizleme</span>
          </div>
          <h4 className="text-sm font-semibold text-slate-200">Boş Elemanların Ayıklanması</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dizide yer alan <code className="text-rose-300 font-mono">""</code> (boş dize) ve{' '}
            <code className="text-amber-300 font-mono">NULL</code> değerlerini callback fonksiyonu ile tespit edip listeden çıkarır.
          </p>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-800/80">
            💡 <strong>Püf Nokta:</strong> PHP'de <code className="text-slate-400 font-mono">array_filter()</code> orijinal dizi anahtarlarını (keys) aynen korur.
          </div>
        </div>

        {/* Function 2 */}
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-indigo-400">2. array_rand()</span>
            <span className="text-[10px] text-slate-500 font-mono">Rastgele Seçim</span>
          </div>
          <h4 className="text-sm font-semibold text-slate-200">Rastgele Anahtar Çekimi</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Filtrelenmiş diziden istenilen <code className="text-indigo-300 font-mono">$count</code> adedi kadar rastgele anahtar seçer.
          </p>
          <div className="text-[11px] text-amber-300/80 pt-1 border-t border-slate-800/80 flex items-start gap-1">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
            <span>
              <strong>Kritik Detay:</strong> Adet 1 verildiğinde PHP tek bir int döndürür. <code className="font-mono">(array)</code> casting ile her zaman dizi tipi garanti edilir.
            </span>
          </div>
        </div>

        {/* Function 3 */}
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-indigo-400">3. array_map()</span>
            <span className="text-[10px] text-slate-500 font-mono">Yeniden Eşleme</span>
          </div>
          <h4 className="text-sm font-semibold text-slate-200">Değer Eşleme &amp; Sıfırlama</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            <code className="text-indigo-300 font-mono">array_rand()</code> tarafından döndürülen anahtarlar, <code className="text-emerald-300 font-mono">array_map()</code> ile dizi elemanına dönüştürülür.
          </p>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-800/80">
            ✨ <strong>Sonuç:</strong> <code className="text-slate-400 font-mono">array_map()</code> çıktısı otomatik olarak 0, 1, 2... indeksli olur ve sorudaki ekran çıktısına %100 uyar.
          </div>
        </div>
      </div>
    </div>
  );
};
