import React, { useState } from 'react';
import { Cpu, Database, GitBranch, ArrowRight, ShieldCheck, CheckCircle2, Layers, BookOpen, Sparkles } from 'lucide-react';

export const TraitMemoryVisualizer: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const executionSteps = [
    {
      step: 1,
      title: "Adım 6: main() Başlangıcı ve Bellek Tahsisi",
      code: `let mut hesap1 = BankAccount::new("TR-1001", "Ahmet Yılmaz", 1500.0);`,
      explanation: "Stack üzerinde 24 byte (account_number) + 24 byte (holder_name) + 8 byte (balance) = 56 byte yer ayrılır. String karakter verileri Heap'e kopyalanır.",
      stackState: [
        { var: "hesap1.account_number", val: "ptr -> Heap (7 bytes)", type: "String", loc: "Stack (24B)" },
        { var: "hesap1.holder_name", val: "ptr -> Heap (12 bytes)", type: "String", loc: "Stack (24B)" },
        { var: "hesap1.balance", val: "1500.00", type: "f64", loc: "Stack (8B)" },
      ],
      heapState: [
        { address: "0x7ffee1", content: "\"TR-1001\"" },
        { address: "0x7ffee8", content: "\"Ahmet Yılmaz\"" },
      ],
      borrowStatus: "Sahip: main() - Mutex / Exclusive erişim açık (mut)"
    },
    {
      step: 2,
      title: "Adım 7: hesap1.para_yatir(750.0) Çağrısı",
      code: `hesap1.para_yatir(750.0); // &mut self geçilir`,
      explanation: "Rust Borrow Checker, hesap1 için tekil ve geçici bir &mut self (değiştirilebilir referans) oluşturur. Başka hiçbir referans bu sırada aynı veriyi okuyamaz veya yazamaz (Data Race önleme).",
      stackState: [
        { var: "&mut self", val: "&mut hesap1", type: "&mut BankAccount", loc: "Stack Ref (8B)" },
        { var: "miktar", val: "750.00", type: "f64", loc: "Stack (8B)" },
        { var: "hesap1.balance", val: "1500.00 + 750.00 = 2250.00", type: "f64", loc: "Güncellendi" },
      ],
      heapState: [
        { address: "0x7ffee1", content: "\"TR-1001\"" },
        { address: "0x7ffee8", content: "\"Ahmet Yılmaz\"" },
      ],
      borrowStatus: "Aktif Ödünç: &mut self (Hesap özelliği metodu bitene kadar münhasır)"
    },
    {
      step: 3,
      title: "Adım 8: hesap2.para_cek(400.0) Çağrısı",
      code: `hesap2.para_cek(400.0); // 2500.0 - 400.0 = 2100.0`,
      explanation: "hesap2 için &mut self referansı oluşturulur. İlk olarak 'if miktar > self.balance' kontrolü yapılır. Koşul sağlanınca 400.0 çıkarılır ve Ok(()) döndürülür.",
      stackState: [
        { var: "hesap2.account_number", val: "ptr -> Heap", type: "String", loc: "Stack (24B)" },
        { var: "hesap2.holder_name", val: "ptr -> Heap (\"Ayşe Kaya\")", type: "String", loc: "Stack (24B)" },
        { var: "hesap2.balance", val: "2500.00 - 400.00 = 2100.00", type: "f64", loc: "Stack (8B)" },
      ],
      heapState: [
        { address: "0x7ffeea", content: "\"TR-1002\"" },
        { address: "0x7fff02", content: "\"Ayşe Kaya\"" },
      ],
      borrowStatus: "Aktif Ödünç: &mut self (Bakiye kontrolü başarılı, çekim yapıldı)"
    },
    {
      step: 4,
      title: "Adım 9: hesap1.bakiye() ve hesap2.bakiye() Çağrısı",
      code: `println!("{:.2} ₺", hesap1.bakiye()); // &self (salt okunur)`,
      explanation: "bakiye() metodu sadece &self (paylaşılan, salt okunur referans) alır. Veri üzerinde herhangi bir değişiklik yapılamaz, bu da yan etkisiz (pure) ve güvenli sorgulamayı garanti eder.",
      stackState: [
        { var: "&self", val: "&hesap1 (Salt okunur)", type: "&BankAccount", loc: "Stack (8B)" },
        { var: "Dönen Değer", val: "2250.00", type: "f64", loc: "Stack (8B)" },
      ],
      heapState: [
        { address: "0x7ffee1", content: "\"TR-1001\"" },
        { address: "0x7ffee8", content: "\"Ahmet Yılmaz\"" },
      ],
      borrowStatus: "Aktif Ödünç: &self (Birden fazla eşzamanlı okuyucuya izin verilir)"
    }
  ];

  const currentStep = executionSteps[activeStep - 1];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-orange-950/20 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-400" />
              <h2 className="text-base font-bold text-white">
                Rust Traits (Özellikler) & Bellek Modeli
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Rust'ta nesne yönelimli dillerdeki <span className="text-orange-400 font-mono">interface</span> yerine{' '}
              <span className="text-orange-400 font-mono">trait</span> kullanılır.{' '}
              <span className="text-amber-300 font-mono">&mut self</span> ile güvenli veri değişimi,{' '}
              <span className="text-emerald-400 font-mono">&self</span> ile salt okunur erişim sağlanır.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">Sıfır Maliyetli Soyutlama (Zero-Cost Abstraction)</span>
          </div>
        </div>
      </div>

      {/* Trait Architecture Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-orange-400" />
          <span>Mimari Haritası: Trait Sözleşmesi ve Struct İlişkisi</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Box 1: Trait Contract */}
          <div className="bg-slate-950 border border-orange-500/30 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-orange-400 mb-2">
                <span className="font-bold">1. Arayüz Sözleşmesi</span>
                <span className="text-[10px] bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                  trait
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Her banka hesabının hangi davranışları sergileyeceğini zorunlu kılan kural kümesi:
              </p>
              <pre className="bg-slate-900 p-2.5 rounded border border-slate-800 text-[11px] font-mono text-slate-200">
                <span className="text-orange-400">pub trait</span> <span className="text-amber-300">Hesap</span> &#123;{'\n'}
                {'  '}<span className="text-slate-400">fn para_yatir(&mut self, miktar: f64);</span>{'\n'}
                {'  '}<span className="text-slate-400">fn para_cek(&mut self, miktar: f64);</span>{'\n'}
                {'  '}<span className="text-slate-400">fn bakiye(&self) -&gt; f64;</span>{'\n'}
                &#125;
              </pre>
            </div>
            <div className="mt-3 text-[11px] text-slate-500 font-mono">
              ✓ Polimorfizm & Davranış Tanımı
            </div>
          </div>

          {/* Box 2: Struct Data */}
          <div className="bg-slate-950 border border-blue-500/30 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-blue-400 mb-2">
                <span className="font-bold">2. Veri Yapısı</span>
                <span className="text-[10px] bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  struct
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Banka hesabının durumunu bellekte tutan alanlar (alanlar / fields):
              </p>
              <pre className="bg-slate-900 p-2.5 rounded border border-slate-800 text-[11px] font-mono text-slate-200">
                <span className="text-orange-400">pub struct</span> <span className="text-blue-300">BankAccount</span> &#123;{'\n'}
                {'  '}<span className="text-slate-300">account_number:</span> <span className="text-emerald-400">String</span>,{'\n'}
                {'  '}<span className="text-slate-300">holder_name:</span> <span className="text-emerald-400">String</span>,{'\n'}
                {'  '}<span className="text-slate-300">balance:</span> <span className="text-emerald-400">f64</span>,{'\n'}
                &#125;
              </pre>
            </div>
            <div className="mt-3 text-[11px] text-slate-500 font-mono">
              ✓ 56 Bayt Stack Veri Alanı
            </div>
          </div>

          {/* Box 3: Impl Connection */}
          <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-2">
                <span className="font-bold">3. Uygulama Köprüsü</span>
                <span className="text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  impl ... for
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                BankAccount yapısına Hesap özelliğinin somut yeteneklerini kazandırır:
              </p>
              <pre className="bg-slate-900 p-2.5 rounded border border-slate-800 text-[11px] font-mono text-slate-200">
                <span className="text-orange-400">impl</span> <span className="text-amber-300">Hesap</span> <span className="text-orange-400">for</span> <span className="text-blue-300">BankAccount</span> &#123;{'\n'}
                {'  '}<span className="text-slate-400">// self.balance += miktar;</span>{'\n'}
                {'  '}<span className="text-slate-400">// self.balance -= miktar;</span>{'\n'}
                {'  '}<span className="text-slate-400">// self.balance</span>{'\n'}
                &#125;
              </pre>
            </div>
            <div className="mt-3 text-[11px] text-slate-500 font-mono">
              ✓ Statik Dağıtım (Monomorphization)
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Execution & Memory Visualizer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-orange-400" />
              <span>Adım Adım Bellek ve Ödünç Alma (Borrow) İzleyicisi</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Rust Borrow Checker'ın çalışma anında değişkenleri ve referansları nasıl denetlediğini görün.
            </p>
          </div>

          {/* Stepper Buttons */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {executionSteps.map((s) => (
              <button
                key={s.step}
                onClick={() => setActiveStep(s.step)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  activeStep === s.step
                    ? 'bg-orange-600 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Aşama {s.step}
              </button>
            ))}
          </div>
        </div>

        {/* Step Info Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-orange-400">{currentStep.title}</span>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              {currentStep.borrowStatus}
            </span>
          </div>

          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs font-mono text-amber-300">
            <code>{currentStep.code}</code>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {currentStep.explanation}
          </p>
        </div>

        {/* Stack vs Heap Visual Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stack Frame */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-3 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 font-bold text-orange-400">
                <Layers className="w-3.5 h-3.5" />
                <span>Stack Belleği (Hızlı & Sabit Boyutlu)</span>
              </span>
              <span className="text-slate-500 text-[10px]">LIFO</span>
            </div>

            <div className="space-y-2">
              {currentStep.stackState.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono"
                >
                  <div>
                    <span className="text-slate-400 block text-[10px]">{item.type} • {item.loc}</span>
                    <span className="text-slate-200 font-bold">{item.var}</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Heap Memory */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-3 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 font-bold text-cyan-400">
                <Database className="w-3.5 h-3.5" />
                <span>Heap Belleği (Dinamik Boyutlu String Verileri)</span>
              </span>
              <span className="text-slate-500 text-[10px]">RAII / Drop</span>
            </div>

            <div className="space-y-2">
              {currentStep.heapState.map((heap, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono"
                >
                  <span className="text-slate-500 text-[11px]">{heap.address}</span>
                  <span className="text-yellow-300 font-semibold">{heap.content}</span>
                  <span className="text-slate-400 text-[10px]">UTF-8 bytes</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
