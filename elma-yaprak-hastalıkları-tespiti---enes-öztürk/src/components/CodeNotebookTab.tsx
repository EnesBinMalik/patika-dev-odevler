import React, { useState } from 'react';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Download, 
  GitBranch, 
  Terminal, 
  BookOpen, 
  Sparkles, 
  ExternalLink,
  Code2
} from 'lucide-react';
import { PYTHON_NOTEBOOK_CODE, AUTHOR_NAME, KAGGLE_COMPETITION_URL } from '../data/mockData';

export const CodeNotebookTab: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PYTHON_NOTEBOOK_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadIpynb = () => {
    // Generate valid Jupyter Notebook JSON format (.ipynb)
    const notebookData = {
      cells: [
        {
          cell_type: "markdown",
          metadata: {},
          source: [
            "# Elma Ağaçlarındaki Yaprak Hastalıklarının Belirlenmesi\\n",
            "### Kaggle Plant Pathology 2020 - FGVC7 Challenge\\n",
            `**Araştırmacı & Geliştirici:** ${AUTHOR_NAME} (enesbino38@gmail.com)\\n`,
            "**Metrik:** Mean Column-Wise ROC-AUC | **Model:** EfficientNet-B4 & Stratified 5-Fold\\n"
          ]
        },
        {
          cell_type: "code",
          execution_count: null,
          metadata: {},
          outputs: [],
          source: PYTHON_NOTEBOOK_CODE.split('\n').map(line => line + '\n')
        }
      ],
      metadata: {
        language_info: {
          name: "python",
          version: "3.10"
        },
        orig_nbformat: 4
      },
      nbformat: 4,
      nbformat_minor: 2
    };

    const blob = new Blob([JSON.stringify(notebookData, null, 2)], { type: 'application/x-ipynb+json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `elma_yaprak_hastaliklari_${AUTHOR_NAME.toLowerCase().replace(' ', '_')}.ipynb`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
            <FileCode2 className="w-3.5 h-3.5" />
            Adım 6: Tam Kod, Jupyter Notebook & GitHub Deposu
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Çalıştırılabilir Python / PyTorch Pipeline ve Proje Kodu
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Kaggle veya yerel GPU ortamında doğrudan çalıştırılabilen eksiksiz model eğitim ve test tahmin betiği.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Kopyalandı!' : 'Kodu Kopyala'}</span>
          </button>

          <button
            onClick={downloadIpynb}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Jupyter Notebook (.ipynb) İndir</span>
          </button>
        </div>
      </div>

      {/* GitHub Repository Structure & Deliverables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-indigo-400" />
              GitHub Proje Dizin Yapısı
            </h3>
            <p className="text-xs text-slate-400">
              Ders ödevi teslimi için tavsiye edilen modüler repository mimarisi:
            </p>

            <div className="p-3 rounded-xl bg-black/60 border border-slate-800 font-mono text-[11px] text-emerald-400 space-y-1">
              <div>apple-leaf-disease-detection/</div>
              <div className="pl-3 text-slate-400">├── README.md (Enes Öztürk İmzalı Rapor)</div>
              <div className="pl-3 text-slate-400">├── requirements.txt (timm, albumentations, pytorch)</div>
              <div className="pl-3 text-slate-400">├── notebooks/</div>
              <div className="pl-6 text-amber-300">└── plant_pathology_enes_ozturk.ipynb</div>
              <div className="pl-3 text-slate-400">├── src/</div>
              <div className="pl-6 text-slate-400">├── dataset.py (Albumentations + DataLoader)</div>
              <div className="pl-6 text-slate-400">├── models.py (EfficientNet-B4 & ViT)</div>
              <div className="pl-6 text-slate-400">├── train.py (Stratified 5-Fold Loop)</div>
              <div className="pl-6 text-slate-400">└── evaluate.py (Mean ROC-AUC & Confusion Matrix)</div>
              <div className="pl-3 text-slate-400">└── outputs/</div>
              <div className="pl-6 text-indigo-300">└── submission.csv (Kaggle Test Tahminleri)</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Kaggle CLI ile Veri İndirme
            </h4>
            <div className="p-2.5 rounded-lg bg-black/50 font-mono text-[11px] text-amber-300 break-all select-all">
              kaggle competitions download -c plant-pathology-2020-fgvc7
            </div>
            <p className="text-slate-400 text-[11px]">
              Veriler <code>train.csv</code>, <code>test.csv</code> ve <code>images/</code> klasörü olarak açılır.
            </p>
          </div>
        </div>

        {/* Python Code Viewer */}
        <div className="lg:col-span-8 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
          <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-400 ml-2">
                train_plant_pathology_enes_ozturk.py
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">PyTorch 2.x & Albumentations</span>
          </div>

          <div className="p-4 overflow-x-auto max-h-[600px] font-mono text-xs text-slate-300 leading-relaxed bg-black/40">
            <pre>
              <code>{PYTHON_NOTEBOOK_CODE}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
