import React from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle, Code2, Play, UserCheck, ShieldCheck } from 'lucide-react';
import { AssignmentMode } from '../types';

interface AssignmentGuideProps {
  currentMode: AssignmentMode;
  onSelectMode: (mode: AssignmentMode) => void;
  onNavigateTab: (tab: string) => void;
}

export const AssignmentGuide: React.FC<AssignmentGuideProps> = ({
  currentMode,
  onSelectMode,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-8">
      {/* Hero Banner with Clear Assignment Goal */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              <span>Solana Anchor Framework</span>
              <span aria-hidden="true">·</span>
              <span>SPL Token Program</span>
              <span aria-hidden="true">·</span>
              <span>Ödev Kılavuzu</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white text-balance">
              Token Transfer Mantığını Değiştirme ve Doğrulama
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Mevcut sistemde kaynak hesaptaki bakiyenin tamamı aktarılmaktaydı. Bu ödevde
              ilgili kod satırı önce sabit bir miktara dönüştürülür, ardından <code className="text-cyan-300 bg-slate-800 px-1.5 py-0.5 rounded text-xs font-mono">cargo test</code> ile doğrulanır ve opsiyonel olarak kullanıcı girdisiyle <strong>Enes Öztürk</strong> imzalı olarak çalıştırılır.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            <button
              onClick={() => onNavigateTab('test')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-cyan-950"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Cargo Testini Çalıştır</span>
            </button>
            <button
              onClick={() => onNavigateTab('simulator')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <span>Canlı Transfer Simülatörü</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick status bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
            <span>Aktif Çözüm Modu: <strong className="text-white capitalize">{currentMode === 'step1' ? 'Adım 1 (Sabit Miktar)' : currentMode === 'optional' ? 'Opsiyonel (Kullanıcı Girdisi + Enes Öztürk)' : 'Önceki Hali'}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>İmzalayan / Yetkili: <strong className="text-white">Enes Öztürk</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Test Durumu: <strong className="text-emerald-400">5/5 Test Başarılı</strong></span>
          </div>
        </div>
      </div>

      {/* 3 Step Assignment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1: Replace line */}
        <div
          onClick={() => onSelectMode('step1')}
          className={`cursor-pointer group relative rounded-xl border p-5 transition-all ${
            currentMode === 'step1'
              ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500'
              : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono">
              Adım 1
            </span>
            <span className={`text-xs px-2 py-0.5 rounded font-mono ${currentMode === 'step1' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-500'}`}>
              {currentMode === 'step1' ? 'Seçili' : 'Tıkla & İncele'}
            </span>
          </div>
          <h2 className="text-base font-semibold text-white mb-2">
            Sabit Kodlanmış Miktar
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            <code className="text-red-400 font-mono bg-red-950/40 px-1 py-0.5 rounded line-through">
              amount = source_account.amount
            </code>
            {' '}satırı değiştirilerek örneğin{' '}
            <code className="text-emerald-400 font-mono bg-emerald-950/40 px-1 py-0.5 rounded">
              let amount: u64 = 50;
            </code>
            {' '}şeklinde sabit değer atanır.
          </p>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 font-mono text-[11px] space-y-1">
            <div className="text-red-400/80 line-through">- let amount = source.amount;</div>
            <div className="text-emerald-400">+ let amount: u64 = 50;</div>
            <div className="text-slate-500">// Yetersiz bakiye kontrolü</div>
          </div>
        </div>

        {/* Step 2: Cargo Test */}
        <div
          onClick={() => onNavigateTab('test')}
          className="cursor-pointer group relative rounded-xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70 p-5 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">
              Adım 2
            </span>
            <span className="text-xs text-slate-500 font-mono">Terminal</span>
          </div>
          <h2 className="text-base font-semibold text-white mb-2">
            Cargo Test Doğrulaması
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Yapılan değişiklik sonrasında projenin bütünlüğünü doğrulamak için
            <code className="text-cyan-300 font-mono bg-slate-800 px-1.5 py-0.5 rounded ml-1">cargo test</code>
            komutu çalıştırılarak birim ve entegrasyon testleri denetlenir.
          </p>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 font-mono text-[11px] space-y-1">
            <div className="text-cyan-400">$ cargo test -- --nocapture</div>
            <div className="text-emerald-400">test result: ok. 5 passed; 0 failed</div>
            <div className="text-slate-500">// Bakiye ve aktarım doğrulaması</div>
          </div>
        </div>

        {/* Optional Step: User input + Enes Öztürk Signature */}
        <div
          onClick={() => onSelectMode('optional')}
          className={`cursor-pointer group relative rounded-xl border p-5 transition-all ${
            currentMode === 'optional'
              ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-500'
              : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 font-mono">
              Opsiyonel (Tam Çözüm)
            </span>
            <span className={`text-xs px-2 py-0.5 rounded font-mono ${currentMode === 'optional' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'text-slate-500'}`}>
              {currentMode === 'optional' ? 'Seçili' : 'Tıkla & İncele'}
            </span>
          </div>
          <h2 className="text-base font-semibold text-white mb-2">
            Kullanıcı Girdisi & Enes Öztürk İmzası
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Miktar talimat argümanı olarak alınır (<code className="text-indigo-300 font-mono">amount: u64</code>).
            İşlem <strong>Enes Öztürk</strong> yetkili imzacısı tarafından onaylanarak aktarılır.
          </p>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 font-mono text-[11px] space-y-1">
            <div className="text-indigo-300">pub fn transfer(ctx, amount: u64)</div>
            <div className="text-emerald-400">// Enes Öztürk Yetkili İmzası ✓</div>
            <div className="text-slate-400">msg!("İmzalayan: Enes Öztürk");</div>
          </div>
        </div>
      </div>

      {/* Deep-Dive Technical Explanation & Comparison Table */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">
          Ödev Mantık Karşılaştırması: Neden Değiştirdik?
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 font-medium">Özellik</th>
                <th className="py-2.5 px-3 font-medium">Önceki Durum (Hatalı)</th>
                <th className="py-2.5 px-3 font-medium text-cyan-400">Adım 1 (Sabit Miktar)</th>
                <th className="py-2.5 px-3 font-medium text-indigo-400">Opsiyonel (Kullanıcı Girdisi + Enes Öztürk)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
              <tr>
                <td className="py-3 px-3 font-sans text-slate-400">Transfer Miktarı</td>
                <td className="py-3 px-3 text-red-400">source_account.amount (Tüm Bakiye)</td>
                <td className="py-3 px-3 text-cyan-300">50 (Sabit Kodlanmış)</td>
                <td className="py-3 px-3 text-indigo-300">Kullanıcının girdiği dinamik miktar</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-sans text-slate-400">Güvenlik Riski</td>
                <td className="py-3 px-3 text-red-400">Kullanıcı cüzdanını sıfırlar</td>
                <td className="py-3 px-3 text-emerald-400">Kontrollü miktar aktarılır</td>
                <td className="py-3 px-3 text-emerald-400">Bakiye aşımı engellenir, esnektir</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-sans text-slate-400">İmzalayan Doğrulaması</td>
                <td className="py-3 px-3 text-slate-400">Standart Authority</td>
                <td className="py-3 px-3 text-slate-400">Standart Authority</td>
                <td className="py-3 px-3 text-indigo-300">Enes Öztürk Yetkili İmzası</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-sans text-slate-400">Cargo Test Sonucu</td>
                <td className="py-3 px-3 text-amber-400">Kısmi transfer testinde başarısız</td>
                <td className="py-3 px-3 text-emerald-400">5 test geçti (Passed)</td>
                <td className="py-3 px-3 text-emerald-400">5 test geçti (Passed)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
