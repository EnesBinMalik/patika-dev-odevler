import React, { useState } from 'react';
import { BookOpen, ShieldCheck, Binary, AlertTriangle, Check, Copy } from 'lucide-react';

export const TheoryGuideTab: React.FC = () => {
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  const homeworkReport = `# Solana Native Smart Contract Ödevi - Çözüm Raporu
**Öğrenci / Geliştirici:** Enes Öztürk
**Konu:** Solana Counter Programında u32 Parametreli Increment/Decrement ve Underflow Koruması

## 1. Yapılan Değişiklikler Özeti

### Adım 1: CounterInstructions Enum Genişletmesi
src/instruction.rs dosyasında bulunan CounterInstructions enum yapısına Increment ve Decrement varyantları için u32 argümanı eklendi:
\`\`\`rust
pub enum CounterInstructions {
    Increment(u32),
    Decrement(u32),
    Update(u32),
    Reset,
}
\`\`\`

### Adım 2: Unpack Fonksiyonunda Byte Çözümleme (Deserialization)
src/instruction.rs içerisindeki unpack(&[u8]) fonksiyonunda tag 0 (Increment) ve tag 1 (Decrement) için tıpkı Update varyantında olduğu gibi 4 baytlık Little-Endian u32 verisi okundu:
\`\`\`rust
let val = rest
    .get(..4)
    .and_then(|slice| slice.try_into().ok())
    .map(u32::from_le_bytes)
    .ok_or(ProgramError::InvalidInstructionData)?;
\`\`\`

### Adım 3: lib.rs İşleyici Mantığı ve U32 Underflow Koruması
src/lib.rs dosyasında sabit 1 artırma/azaltma yerine gelen u32 parametresi ile işlem yapıldı. Ödev notunda belirtilen kritik kural uygulandı:
"Not: CounterInstructions::Decrement'te değerin negatif olmasına dikkat etmelisiniz. U32 olarak tanımlandığı için 0'dan az olmamalıdır. Parametre gerçek durumdan büyükse, durumu 0 olarak ayarlamalıdır enes öztürk imzalı olsun"

\`\`\`rust
CounterInstructions::Increment(val) => {
    counter_account.counter = counter_account.counter.saturating_add(val);
}
CounterInstructions::Decrement(val) => {
    if val > counter_account.counter {
        counter_account.counter = 0;
    } else {
        counter_account.counter -= val;
    }
}
\`\`\`

---
Hazırlayan: Enes Öztürk`;

  const handleCopyReport = () => {
    navigator.clipboard.writeText(homeworkReport);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Copy Report Button */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white">
            Solana Akıllı Sözleşme Mimari Rehberi & Ödev Raporu
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enes Öztürk imzalı ödev teslim metni, Rust tip güvenliği ve Solana BPF bayt yönetimi.
          </p>
        </div>

        <button
          onClick={handleCopyReport}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors shrink-0"
        >
          {copiedReport ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Rapor Kopyalandı</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Ödev Teslim Metnini Kopyala</span>
            </>
          )}
        </button>
      </div>

      {/* 3 Core Conceptual Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: U32 Underflow Protection */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-5 space-y-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-white">
            1. U32 Underflow Neden Kritiktir?
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Rust'ta <code className="text-amber-400">u32</code> işaretsiz bir tiptir (0 ile 4.294.967.295). Eğer <code className="text-amber-400">5 - 10</code> gibi bir işlem yapılırsa, Rust standart çıkarma operatöründe panikler (<em className="text-slate-400">attempt to subtract with overflow</em>). Solana'da bu tüm işlemi başarısız kılar.
          </p>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-[11px] font-mono text-slate-300">
            if val &gt; counter &#123; counter = 0; &#125;
          </div>
        </div>

        {/* Card 2: Little-Endian Byte Encoding */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-5 space-y-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Binary className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-white">
            2. Neden Little-Endian (u32::from_le_bytes)?
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Solana'nın BPF (Berkley Packet Filter) sanal makinesi ve modern işlemciler Little-Endian bayt sıralamasını kullanır. En küçük anlamlı bayt (least significant byte) ilk sırada gelir: Örneğin <code className="text-sky-400">10</code> sayısı <code className="text-sky-400">[10, 0, 0, 0]</code> şeklinde iletilir.
          </p>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-[11px] font-mono text-slate-300">
            u32::from_le_bytes(slice.try_into()?)
          </div>
        </div>

        {/* Card 3: Data-bearing Enums */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-5 space-y-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-white">
            3. Veri Taşıyan Enum (Algebraic Types)
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Rust enum'ları sadece etiket değil, içlerinde tip güvenli veri taşıyabilen cebirsel veri yapılarıdır (Algebraic Data Types). <code className="text-emerald-400">Increment(u32)</code> tanımı sayesinde işlem çağrıldığında parametre olmadan çağrılamaz.
          </p>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-[11px] font-mono text-slate-300">
            CounterInstructions::Increment(u32)
          </div>
        </div>
      </div>

      {/* Submission Checklist */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white">Ödev Teslim Kontrol Listesi (Checklist)</h3>
        <div className="space-y-2.5 text-xs text-slate-300">
          <div className="flex items-center gap-2.5 bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
            <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3" />
            </div>
            <span><strong>Adım 1:</strong> CounterInstructions enum varyantlarına <code className="text-emerald-400">Increment(u32)</code> ve <code className="text-emerald-400">Decrement(u32)</code> eklendi.</span>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
            <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3" />
            </div>
            <span><strong>Adım 2:</strong> Unpack fonksiyonunda tag 0 ve tag 1 için 4 baytlık <code className="text-emerald-400">u32::from_le_bytes</code> çözümlemesi eklendi.</span>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
            <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3" />
            </div>
            <span><strong>Adım 3:</strong> lib.rs dosyasında 1 artırma/azaltma yerine <code className="text-emerald-400">val</code> kadar artırma ve azaltma uygulandı.</span>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
            <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3" />
            </div>
            <span><strong>Ödev Notu:</strong> U32 underflow koruması uygulandı: Eğer parametre gerçek durumdan büyükse (<code className="text-emerald-400">val &gt; counter</code>), durum <code className="text-emerald-400">0</code> olarak ayarlandı.</span>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
            <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3" />
            </div>
            <span><strong>İmza:</strong> Kodlarda ve ödev belgelerinde <strong>Enes Öztürk</strong> imzası eklendi.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
