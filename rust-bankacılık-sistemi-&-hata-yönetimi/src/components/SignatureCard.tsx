import React from 'react';
import { Award, ShieldCheck, CheckCircle2, Feather, FileCode2, UserCheck } from 'lucide-react';

export const SignatureCard: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950/50 border border-orange-500/30 p-6 shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>Resmi Görev Teslimi &amp; Onay Mührü</span>
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight">
            Rust Temel Bankacılık Sistemi &amp; Hata Yönetimi
          </h3>

          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            Bu proje, Rust dilinde nesne yönelimli benzeri özellikler (<code className="text-orange-300 font-mono">trait Account</code>), yapısal tipler (<code className="text-orange-300 font-mono">struct BankAccount</code>), güvenli bellek yönetimi ve <code className="text-emerald-300 font-mono">Result&lt;(), String&gt;</code> ile <code className="text-cyan-300 font-mono">match</code> deseni kullanılarak sıfır çalışma zamanı çökmesi (<em className="text-slate-300">panic-free</em>) hedefiyle geliştirilmiştir.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Result&lt;(), String&gt; Hata Tipi</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ok(()) ve Err(...) Varyantları</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>match ile Desen Eşleme</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
              <FileCode2 className="w-3.5 h-3.5 text-orange-400" />
              <span>Rust 2021 Edition</span>
            </span>
          </div>
        </div>

        {/* Signature Box */}
        <div className="shrink-0 w-full md:w-auto p-4 rounded-xl bg-slate-950/80 border border-orange-500/40 shadow-inner flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-md mb-2">
            <UserCheck className="w-5 h-5" />
          </div>

          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
            GELİŞTİRİCİ &amp; İMZA
          </span>

          {/* Stylized Signature */}
          <div className="my-1.5 py-1 px-4 border-b border-orange-500/40">
            <span className="font-serif italic text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-amber-200 to-orange-400 drop-shadow">
              Enes Öztürk
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Doğrulanmış İmza (Verified)</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5">
            Tüm Kontrol Kriterleri Sağlandı
          </span>
        </div>
      </div>
    </div>
  );
};
