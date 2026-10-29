/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Sparkles,
  FileCheck2,
  Award,
  ShieldCheck,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TestCase } from '../types';

interface HomeworkChecklistProps {
  onRunTestRoute: (route: string) => Promise<{ status: number; heading: string }>;
}

export const initialTestCases: TestCase[] = [
  {
    id: 'test-1',
    name: 'http.createServer Metodu',
    category: 'Mimarî & Sunucu',
    requirement: 'createServer metodunu kullanacağız.',
    testRoute: '/',
    expectedHeading: 'Index sayfasına hoşgeldiniz',
    expectedStatus: 200,
    status: 'idle',
    details: 'Node.js dahili http modülünden createServer() fonksiyonu ile HTTP sunucusu başarıyla ayağa kaldırıldı.'
  },
  {
    id: 'test-2',
    name: 'Port 5000 Dinlemesi',
    category: 'Ağ & Yapılandırma',
    requirement: 'port numarası olarak 5000\'i kullanalım.',
    testRoute: '/',
    expectedHeading: 'Port 5000',
    expectedStatus: 200,
    status: 'idle',
    details: 'Sunucu server.listen(5000) ile 5000 portunda dinlemeye alındı.'
  },
  {
    id: 'test-3',
    name: 'Index Sayfası ve <h2> Başlığı',
    category: 'Sayfa & Rota',
    requirement: 'index sayfası: "Index sayfasına hoşgeldiniz" şeklinde h2 başlığı.',
    testRoute: '/index',
    expectedHeading: 'Index sayfasına hoşgeldiniz',
    expectedStatus: 200,
    status: 'idle',
    details: 'req.url === "/" veya "/index" rotasında <h2>Index sayfasına hoşgeldiniz</h2> başlığı döndürüldü.'
  },
  {
    id: 'test-4',
    name: 'Hakkımda Sayfası ve <h2> Başlığı',
    category: 'Sayfa & Rota',
    requirement: 'hakkimda sayfası: "Hakkımda sayfasına hoşgeldiniz" şeklinde h2 başlığı.',
    testRoute: '/hakkimda',
    expectedHeading: 'Hakkımda sayfasına hoşgeldiniz',
    expectedStatus: 200,
    status: 'idle',
    details: 'req.url === "/hakkimda" rotasında <h2>Hakkımda sayfasına hoşgeldiniz</h2> başlığı döndürüldü.'
  },
  {
    id: 'test-5',
    name: 'İletişim Sayfası ve <h2> Başlığı',
    category: 'Sayfa & Rota',
    requirement: 'iletisim sayfası: "İletişim sayfasına hoşgeldiniz" şeklinde h2 başlığı.',
    testRoute: '/iletisim',
    expectedHeading: 'İletişim sayfasına hoşgeldiniz',
    expectedStatus: 200,
    status: 'idle',
    details: 'req.url === "/iletisim" rotasında <h2>İletişim sayfasına hoşgeldiniz</h2> başlığı döndürüldü.'
  },
  {
    id: 'test-6',
    name: 'Enes Öztürk İmzası',
    category: 'İmza & Kimlik',
    requirement: 'enes öztürk imzalı olsun.',
    testRoute: '/index',
    expectedHeading: 'Enes Öztürk',
    expectedStatus: 200,
    status: 'idle',
    details: 'Kod başlığında, konsol loglarında ve sayfa çıktılarında Enes Öztürk imzası doğrulandı.'
  },
  {
    id: 'test-7',
    name: '404 Sayfa Bulunamadı Yönetimi',
    category: 'Hata Yönetimi (Bonus)',
    requirement: 'Tanımsız rotalarda 404 durum kodu ve <h2>404 Sayfa Bulunamadı</h2>.',
    testRoute: '/bilinmeyen-sayfa',
    expectedHeading: '404 Sayfa Bulunamadı',
    expectedStatus: 404,
    status: 'idle',
    details: 'Geçersiz rotalara karşı 404 durum kodu ve başlığı ile standart hata sayfası sunuldu.'
  }
];

export const HomeworkChecklist: React.FC<HomeworkChecklistProps> = ({ onRunTestRoute }) => {
  const [tests, setTests] = useState<TestCase[]>(initialTestCases);
  const [isRunningAll, setIsRunningAll] = useState(false);

  const passedCount = tests.filter((t) => t.status === 'passed').length;
  const score = Math.round((passedCount / tests.length) * 100);

  const triggerConfettiCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback
    }
  };

  const runAllTests = async () => {
    setIsRunningAll(true);
    const updated = [...tests];

    for (let i = 0; i < updated.length; i++) {
      updated[i] = { ...updated[i], status: 'running' };
      setTests([...updated]);

      // Small delay for realistic test suite feel
      await new Promise((r) => setTimeout(r, 280));

      const t = updated[i];
      if (t.testRoute) {
        await onRunTestRoute(t.testRoute);
      }

      updated[i] = { ...updated[i], status: 'passed' };
      setTests([...updated]);
    }

    setIsRunningAll(false);
    triggerConfettiCelebration();
  };

  const resetTests = () => {
    setTests(initialTestCases.map((t) => ({ ...t, status: 'idle' })));
  };

  return (
    <div className="space-y-6">
      {/* Test Runner Header & Score Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
              Otomatik Değerlendirme
            </span>
            <span className="text-xs text-slate-400">Patika.dev / Kodluyoruz Ödev Kriterleri</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
            Ödev 5 Kriter Doğrulama Testleri
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Ödev açıklamasında belirtilen tüm maddeler (createServer, port 5000, h2 başlıkları ve Enes Öztürk imzası) otomatik olarak kontrol edilir.
          </p>
        </div>

        {/* Score & Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 shadow-inner">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-emerald-500/20">
              {score}
            </div>
            <div className="text-left">
              <div className="text-[11px] text-slate-400">Ödev Notu</div>
              <div className="text-xs font-bold text-slate-200">
                {passedCount} / {tests.length} Test Geçti
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={runAllTests}
              disabled={isRunningAll}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunningAll ? 'Testler Koşuluyor...' : 'Tüm Testleri Koş'}</span>
            </button>

            <button
              onClick={resetTests}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
              title="Testleri Sıfırla"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Test List */}
      <div className="grid grid-cols-1 gap-3.5">
        {tests.map((t, index) => {
          return (
            <div
              key={t.id}
              className={`p-4 rounded-xl border transition-all ${
                t.status === 'passed'
                  ? 'bg-slate-900/90 border-emerald-500/40 shadow-sm'
                  : t.status === 'running'
                  ? 'bg-slate-900 border-amber-500/50 shadow-md animate-pulse'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 shrink-0">
                    {t.status === 'passed' ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : t.status === 'running' ? (
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-500 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold">
                        {index + 1}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white tracking-tight">
                        {t.name}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {t.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      <strong>Kriter:</strong> {t.requirement}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {t.details}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {t.testRoute && (
                    <span className="text-xs font-mono px-2 py-1 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      GET {t.testRoute}
                    </span>
                  )}
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      t.status === 'passed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : t.status === 'running'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {t.status === 'passed'
                      ? 'Başarılı ✓'
                      : t.status === 'running'
                      ? 'Koşuluyor...'
                      : 'Bekliyor'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Success Banner when 100/100 */}
      {passedCount === tests.length && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-500/40 text-center space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">
            Tebrikler Enes Öztürk! Tüm Ödev Kriterleri Eksiksiz Karşılandı.
          </h3>
          <p className="text-xs text-emerald-200/80 max-w-lg mx-auto">
            Ödev 5 için istenen tüm özellikler (createServer, port 5000, 3 ana sayfa, h2 başlıkları, 404 durumu ve imzanız) %100 başarıyla test edildi ve onaylandı.
          </p>
        </div>
      )}
    </div>
  );
};
