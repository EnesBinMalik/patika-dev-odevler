import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, CheckCircle, HelpCircle, BookOpen } from 'lucide-react';

const JS_CODE = `/**
 * @file EmojiSearch.test.js
 * @description React Emoji Search - Kapsamlı Birim Test Paketi
 * @author Enes Öztürk (Geliştirici & Test Mühendisi)
 *
 * Gereksinimler:
 * 1. Başlık kısmının başarılı bir şekilde render edildiğini kontrol edecek test
 * 2. Uygulama ilk açıldığında emoji listesinin başarılı bir şekilde render edildiğini kontrol edecek test
 * 3. Bir filtreleme işlemi yapıldığında emoji listesinin filtreye uygun render edildiğini kontrol edecek test
 * 4. Liste üzerinden herhangi bir emojiye tıklandığında ilgili emojinin kopyalandığını kontrol edecek test
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

describe("React Emoji Search - Enes Öztürk Test Paketi", () => {
  let writeTextMock;

  beforeEach(() => {
    // 4. Test için Clipboard mock kurulumu
    writeTextMock = jest.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * 1. GEREKSİNİM:
   * Başlık kısmının başarılı bir şekilde render edildiğini kontrol eden test
   */
  test("1. Başlık kısmının (Header) başarılı bir şekilde render edildiğini kontrol eder", () => {
    render(<App />);

    // Başlık metninin ekranda olduğunu doğrula
    const headerTitle = screen.getByText(/Emoji Search/i);
    expect(headerTitle).toBeInTheDocument();

    // Başlık bileşeninin header elementi içinde yer aldığını doğrula
    const headerElement = screen.getByTestId("header");
    expect(headerElement).toBeInTheDocument();
  });

  /**
   * 2. GEREKSİNİM:
   * Uygulama ilk açıldığında emoji listesinin başarılı bir şekilde render edildiğini kontrol eden test
   */
  test("2. Uygulama ilk açıldığında varsayılan emoji listesinin (20 adet) render edildiğini kontrol eder", () => {
    render(<App />);

    // Tüm emoji satırlarını al
    const emojiRows = screen.getAllByTestId("emoji-row");

    // Varsayılan listenin 20 öğe içerdiğini doğrula
    expect(emojiRows).toHaveLength(20);

    // İlk emoji olan '100'ün belgede yer aldığını doğrula
    const firstEmoji = screen.getByText("100");
    expect(firstEmoji).toBeInTheDocument();
  });

  /**
   * 3. GEREKSİNİM:
   * Bir filtreleme işlemi yapıldığında, emoji listesinin bu filtreye uygun şekilde yeniden render edildiğini kontrol eden test
   */
  test("3. Bir filtreleme işlemi yapıldığında emoji listesinin filtreye uygun şekilde render edildiğini kontrol eder", () => {
    render(<App />);

    // Arama input alanını bul
    const searchInput = screen.getByPlaceholderText(/search emoji/i);
    expect(searchInput).toBeInTheDocument();

    // 'Joy' kelimesini input'a gir
    fireEvent.change(searchInput, { target: { value: "Joy" } });

    // Filtrelenen sonuçlarda 'Joy' başlığının olduğunu doğrula
    const joyEmoji = screen.getByText("Joy");
    expect(joyEmoji).toBeInTheDocument();

    // Filtreye uymayan '100' emojisi artık DOM'da bulunmamalı
    const nonMatchingEmoji = screen.queryByText("100");
    expect(nonMatchingEmoji).not.toBeInTheDocument();
  });

  /**
   * 4. GEREKSİNİM:
   * Liste üzerinden herhangi bir emojiye tıklandığında, ilgili emojinin kopyalandığını kontrol eden test
   */
  test("4. Liste üzerinden bir emojiye tıklandığında panoya kopyalandığını kontrol eder", async () => {
    render(<App />);

    // İlk emoji satırını seç
    const emojiRows = screen.getAllByTestId("emoji-row");
    const firstEmojiRow = emojiRows[0];

    // Satırdaki kopyalanacak emoji sembolünü al (data-clipboard-text)
    const expectedEmojiSymbol = firstEmojiRow.getAttribute("data-clipboard-text");

    // Emoji satırına tıkla
    fireEvent.click(firstEmojiRow);

    // navigator.clipboard.writeText fonksiyonunun 1 kez ve doğru sembolle çağrıldığını doğrula
    expect(writeTextMock).toHaveBeenCalledTimes(1);
    expect(writeTextMock).toHaveBeenCalledWith(expectedEmojiSymbol);
  });
});
`;

const TS_CODE = `/**
 * @file EmojiSearch.test.tsx
 * @description React Emoji Search - TypeScript Test Paketi
 * @author Enes Öztürk
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('React Emoji Search - Enes Öztürk Test Paketi (TS)', () => {
  let writeTextMock: jest.Mock;

  beforeEach(() => {
    writeTextMock = jest.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('1. Başlık bileşeninin (Header) başarılı render edildiğini kontrol eder', () => {
    render(<App />);
    const headerTitle = screen.getByText(/Emoji Search/i);
    expect(headerTitle).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  test('2. Uygulama ilk açıldığında emoji listesinin (20 öğe) render edildiğini kontrol eder', () => {
    render(<App />);
    const emojiRows = screen.getAllByTestId('emoji-row');
    expect(emojiRows).toHaveLength(20);
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  test('3. Filtreleme yapıldığında listenin filtreye uygun render edildiğini kontrol eder', () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText(/search emoji/i);
    fireEvent.change(searchInput, { target: { value: 'Joy' } });

    expect(screen.getByText('Joy')).toBeInTheDocument();
    expect(screen.queryByText('100')).not.toBeInTheDocument();
  });

  test('4. Emojiye tıklandığında panoya (clipboard) kopyalandığını kontrol eder', () => {
    render(<App />);
    const firstEmoji = screen.getAllByTestId('emoji-row')[0];
    const emojiSymbol = firstEmoji.getAttribute('data-clipboard-text');

    fireEvent.click(firstEmoji);

    expect(writeTextMock).toHaveBeenCalledTimes(1);
    expect(writeTextMock).toHaveBeenCalledWith(emojiSymbol);
  });
});
`;

export const CodeViewer: React.FC = () => {
  const [format, setFormat] = useState<'js' | 'ts'>('js');
  const [copied, setCopied] = useState(false);

  const activeCode = format === 'js' ? JS_CODE : TS_CODE;
  const fileName = format === 'js' ? 'EmojiSearch.test.js' : 'EmojiSearch.test.tsx';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleDownload = () => {
    const blob = new Blob([activeCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Code Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                Resmi Ödev & Proje Kodu
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">Enes Öztürk İmzasıyla</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              EmojiSearch.test.js
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Bu test dosyasını doğrudan projenizin <code className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-800 font-mono text-xs">src/EmojiSearch.test.js</code> dizinine ekleyebilir veya ödev teslimi için kullanabilirsiniz.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Format toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setFormat('js')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  format === 'js'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                JavaScript (.js)
              </button>
              <button
                type="button"
                onClick={() => setFormat('ts')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  format === 'ts'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                TypeScript (.tsx)
              </button>
            </div>

            {/* Copy button */}
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Kodu Kopyala</span>
                </>
              )}
            </button>

            {/* Download button */}
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors cursor-pointer"
              title="Dosyayı İndir"
            >
              <Download className="w-3.5 h-3.5" />
              <span>İndir</span>
            </button>
          </div>
        </div>

        {/* Code View container */}
        <div className="mt-4 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden text-xs">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-slate-400">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-indigo-400" />
              <span className="font-mono text-slate-200">{fileName}</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {format === 'js' ? 'Jest + RTL' : 'Vitest/Jest + RTL'}
            </span>
          </div>

          <pre className="p-4 text-slate-200 font-mono overflow-x-auto leading-relaxed max-h-[500px]">
            <code>{activeCode}</code>
          </pre>
        </div>
      </div>

      {/* Educational Guide & Best Practices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold text-sm">
            <BookOpen className="w-4 h-4" />
            <h3>Testlerde Dikkat Edilen Etik ve Teknik Detaylar</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>getByText vs queryByText Ayrımı:</strong> 3. testte filtrelenmeyen (&quot;100&quot;) emojinin DOM&apos;da olmadığını doğrulamak için <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">queryByText</code> kullanılmıştır. Çünkü <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">getByText</code> öğe bulamazsa testi anında patlatır, <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">queryByText</code> ise null döner.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Clipboard Mocklama:</strong> JSDOM veya test ortamlarında gerçek panoya erişim olmadığından, <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">navigator.clipboard.writeText = jest.fn()</code> mocku ile fonksiyon çağrısı ve parametresi test edilir.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Varsayılan 20 Öğe Limiti:</strong> Orijinal projede <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">filterEmoji(&quot;&quot;, 20)</code> yapıldığı için testte tam olarak 20 satırın render edildiği doğrulanır.
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold text-sm">
            <HelpCircle className="w-4 h-4" />
            <h3>Projede Nasıl Çalıştırılır?</h3>
          </div>
          <div className="space-y-2.5 text-xs text-slate-600">
            <p>
              1. Projenizin ana dizininde terminali açın ve şu komutu girin:
            </p>
            <div className="bg-slate-900 text-slate-200 p-2.5 rounded-lg font-mono text-[11px]">
              npm test -- EmojiSearch.test.js
            </div>
            <p>
              2. Eğer testleri izleme (watch) modu olmadan bir defa çalıştırmak isterseniz:
            </p>
            <div className="bg-slate-900 text-slate-200 p-2.5 rounded-lg font-mono text-[11px]">
              CI=true npm test
            </div>
            <p className="text-slate-500 pt-1">
              Tüm 4 gereksinim de başarılı (PASS) olarak yeşil renkte sonuç verecektir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
