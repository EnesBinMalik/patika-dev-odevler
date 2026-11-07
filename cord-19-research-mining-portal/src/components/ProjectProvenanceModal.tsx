import React from 'react';
import { X, ShieldCheck, Award, Database, Cpu, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

interface ProjectProvenanceModalProps {
  onClose: () => void;
}

export const ProjectProvenanceModal: React.FC<ProjectProvenanceModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800 bg-slate-950/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>RESMİ BELGE VE DOĞRULAMA RAPORU</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              COVID-19 Open Research Dataset Challenge (CORD-19)
            </h2>
            <div className="text-xs text-slate-400 font-mono">
              Sistem Mimarı ve Baş Araştırmacı: <strong className="text-white">Enes Öztürk</strong>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          
          {/* Exact Problem Definition Requested by User */}
          <div className="p-5 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>Problem Tanımı ve Amaç</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              "Veri seti Beyaz Saray ve önde gelen araştırma grupları tarafından oluşturulan Covid-19 açık kaynak veri setidir. 
              <strong> CORD-19 veri seti</strong>, mevcut olan en kapsamlı koronavirüs literatür koleksiyonunu temsil ediyor. 
              Koronavirüs literatüründeki hızlı değişimlere bilim insanlarının ayak uydurmaları zorluklara neden olmaktadır. 
              Bu nedenle tıp camiasının yüksek öncelikli bilimsel sorulara yanıtlar geliştirmesine yardımcı olabilecek metin ve veri madenciliği araçları geliştirmesi amaçlanmaktadır."
            </p>
            <div className="pt-2 text-right text-xs font-mono text-cyan-300">
              — Enes Öztürk İmzalı Sistem Belirteci
            </div>
          </div>

          {/* Consortia & Stakeholders */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase text-slate-400 font-semibold">
              Veri Setini Oluşturan Öncü Konsorsiyum Ortakları
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="font-bold text-white text-xs">Beyaz Saray Bilim & Teknoloji Politikası Ofisi (OSTP)</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Kamu sağlığı ve ulusal araştırma koordinasyonunu yönetmiştir.
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="font-bold text-white text-xs">Allen Institute for AI (AI2)</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Semantic Scholar altyapısıyla tam metin JSON parsing ve bibliyometrik eşlemeyi gerçekleştirdi.
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="font-bold text-white text-xs">Ulusal Tıp Kütüphanesi (NLM / NIH)</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  PubMed Central (PMC) ve MeSH medikal ontolojilerini sağladı.
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="font-bold text-white text-xs">Kaggle & Chan Zuckerberg Initiative (CZI)</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Küresel veri bilimcilerini ve ödüllü 10 araştırma görevini bir araya getirdi.
                </div>
              </div>
            </div>
          </div>

          {/* Technical Architecture of this Platform */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase text-slate-400 font-semibold">
              Bu Platformun Sağladığı Madencilik Yetkinlikleri
            </div>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Semantik ve Vektörel Arama:</strong> 200,000+ makale arasından anahtar kelime, MeSH terimi ve araştırma tasarımı bazlı hızlı indeksleme.
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Biyomedikal Varlık Tanıma (NER):</strong> SARS-CoV-2 virüs genleri (Spike, Furin), konak reseptörleri (ACE2, TMPRSS2), ilaçlar ve biyobelirteçlerin taranması.
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">İstatistiksel Odds Ratio Havuzlaması:</strong> Klinik risk faktörleri ve ilaç etkinliği için Forest Plot görünümü ve GRADE kanıt derecelendirmesi.
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Yapay Zeka Sentez Motoru:</strong> Gemini 2.5 Flash entegrasyonu ve tıp camiasına yönelik otomatik karar destek özetleri.
                </div>
              </div>
            </div>
          </div>

          {/* Author Signature Seal */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="text-slate-400 font-mono text-[11px]">PROJE İMZASI VE YETKİLENDİRME:</div>
              <div className="text-sm font-bold text-white mt-0.5">Enes Öztürk</div>
              <div className="text-slate-400 text-[11px]">Biyomedikal Veri Madenciliği ve Yapay Zeka Sistemleri</div>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs self-start sm:self-auto">
              ✓ DOĞRULANMIŞ İMZA
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Anladım, Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
