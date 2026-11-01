import React, { useState } from 'react';
import { Copy, Check, FileCode, CheckCircle2 } from 'lucide-react';
import { CODE_SNIPPETS } from '../utils/triangleGenerators';
import { Language } from '../types';

export const MultiLanguageCode: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<Language>('javascript');
  const [variation, setVariation] = useState<'outer-while' | 'outer-for'>('outer-while');
  const [copied, setCopied] = useState<boolean>(false);

  const getCode = () => {
    if (variation === 'outer-while') {
      return CODE_SNIPPETS[selectedLang].code;
    }

    // Variation 2: Outer FOR, Inner WHILE
    if (selectedLang === 'javascript') {
      return `/**
 * Varyasyon 2: Dışta FOR, İçte WHILE döngüsü
 * Her iki döngü türü de kullanılmıştır.
 * Hazırlayan: Enes Öztürk
 */

function ucgen(satirSayisi) {
  // 1. DÖNGÜ (FOR): Satırları yönetir (1'den n'e)
  for (let i = 1; i <= satirSayisi; i++) {
    let satir = "";
    let j = 0; // İç sayaç

    // 2. DÖNGÜ (WHILE): Satırdaki 'O' karakterlerini basar
    while (j < i) {
      satir += (j === 0 ? "O" : " O");
      j++;
    }

    console.log(satir);
  }

  // Ödev İmzası
  console.log("Ödev Hazırlayan: Enes Öztürk");
}

ucgen(15);
`;
    } else if (selectedLang === 'python') {
      return `# Varyasyon 2: Dışta FOR, İçte WHILE
# Hazırlayan: Enes Öztürk

def ucgen(satir_sayisi):
    # FOR döngüsü satırları yönetir
    for i in range(1, satir_sayisi + 1):
        satir_elemanlari = []
        j = 0
        
        # WHILE döngüsü karakterleri ekler
        while j < i:
            satir_elemanlari.append("O")
            j += 1
            
        print(" ".join(satir_elemanlari))
        
    print("Ödev Hazırlayan: Enes Öztürk")

if __name__ == "__main__":
    ucgen(15)
`;
    } else if (selectedLang === 'cpp') {
      return `// Varyasyon 2: Dışta FOR, İçte WHILE
// Hazırlayan: Enes Öztürk

#include <iostream>

void ucgen(int satirSayisi) {
    for (int i = 1; i <= satirSayisi; i++) {
        int j = 0;
        while (j < i) {
            std::cout << (j == 0 ? "O" : " O");
            j++;
        }
        std::cout << "\\n";
    }
    std::cout << "Ödev Hazırlayan: Enes Öztürk\\n";
}

int main() {
    ucgen(15);
    return 0;
}
`;
    } else if (selectedLang === 'java') {
      return `// Varyasyon 2: Dışta FOR, İçte WHILE
// Hazırlayan: Enes Öztürk

public class UcgenOdev {
    public static void ucgen(int satirSayisi) {
        for (int i = 1; i <= satirSayisi; i++) {
            StringBuilder satir = new StringBuilder();
            int j = 0;
            while (j < i) {
                satir.append(j == 0 ? "O" : " O");
                j++;
            }
            System.out.println(satir.toString());
        }
        System.out.println("Ödev Hazırlayan: Enes Öztürk");
    }

    public static void main(String[] args) {
        ucgen(15);
    }
}
`;
    } else {
      return `<?php
// Varyasyon 2: Dışta FOR, İçte WHILE
// Hazırlayan: Enes Öztürk

function ucgen($satirSayisi) {
    for ($i = 1; $i <= $satirSayisi; $i++) {
        $satir = "";
        $j = 0;
        while ($j < $i) {
            $satir .= ($j === 0 ? "O" : " O");
            $j++;
        }
        echo $satir . PHP_EOL;
    }
    echo "Ödev Hazırlayan: Enes Öztürk" . PHP_EOL;
}

ucgen(15);
?>
`;
    }
  };

  const currentCode = getCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Overview */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              <span>Programlama Dilleri Kütüphanesi</span>
              <span aria-hidden="true">·</span>
              <span>Enes Öztürk İmzalı Kaynak Kodlar</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Farklı Dillerde While &amp; For İle Üçgen Çizimi
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-2xl text-balance">
              Öğretmeninizin veya dersinizin istediği dile göre hazır kod blokları. Her kod parçasında hem <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-indigo-600 dark:text-indigo-300">while</code> hem de <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-indigo-600 dark:text-indigo-300">for</code> döngüsü açıkça kullanılmıştır.
            </p>
          </div>

          {/* Variation Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setVariation('outer-while')}
              className={`px-3 py-1.5 font-medium rounded-md transition-all ${
                variation === 'outer-while'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Varyasyon 1 (Dış: While, İç: For)
            </button>
            <button
              onClick={() => setVariation('outer-for')}
              className={`px-3 py-1.5 font-medium rounded-md transition-all ${
                variation === 'outer-for'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Varyasyon 2 (Dış: For, İç: While)
            </button>
          </div>
        </div>
      </div>

      {/* Language Bar & Code Container */}
      <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md">
        {/* Language Tabs Bar */}
        <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {(['javascript', 'python', 'cpp', 'java', 'php'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors whitespace-nowrap ${
                  selectedLang === lang
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {CODE_SNIPPETS[lang].title}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              Dosya: <strong className="text-slate-200">{CODE_SNIPPETS[selectedLang].filename}</strong>
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Kopyalandı!' : 'Kodu Kopyala'}</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 sm:p-6 overflow-x-auto max-h-[580px]">
          <pre className="font-mono text-xs sm:text-sm text-slate-200 leading-relaxed">
            <code>{currentCode}</code>
          </pre>
        </div>

        {/* Code Footer Verification */}
        <div className="bg-slate-900/80 px-4 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Tüm isterler sağlandı: <strong className="text-slate-200">while</strong> + <strong className="text-slate-200">for</strong> döngüleri mevcut.</span>
          </div>
          <span>İmza: <strong className="text-indigo-400">Enes Öztürk</strong></span>
        </div>
      </div>
    </div>
  );
};
