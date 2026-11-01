import React, { useState } from 'react';
import { Header, TabType } from './components/Header';
import { ShapeVisualizer } from './components/ShapeVisualizer';
import { CalculatorPanel } from './components/CalculatorPanel';
import { ArchitectureView } from './components/ArchitectureView';
import { PlaygroundView } from './components/PlaygroundView';
import { PolymorphismView } from './components/PolymorphismView';
import { CodeView } from './components/CodeView';
import { AssignmentReportModal } from './components/AssignmentReportModal';
import { Dikdortgen, Kare, Ucgen } from './models/Sekil';
import { Award, Sparkles, BookOpen, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('calculator');
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  // Geometry dimensions state
  const [shapeType, setShapeType] = useState<'dikdortgen' | 'kare' | 'ucgen'>('dikdortgen');
  const [rectWidth, setRectWidth] = useState<number>(8);
  const [rectHeight, setRectHeight] = useState<number>(14);
  const [squareSide, setSquareSide] = useState<number>(6);
  const [triA, setTriA] = useState<number>(3);
  const [triB, setTriB] = useState<number>(4);
  const [triC, setTriC] = useState<number>(5);

  // Instantiating the real OOP classes!
  const dikdortgen = new Dikdortgen(rectWidth, rectHeight);
  const kare = new Kare(squareSide);
  const ucgen = new Ucgen(triA, triB, triC);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header with Navigation and Enes Öztürk Badge */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReport={() => setIsReportOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Tab 1: Interactive Calculator & Live SVG Geometry Visualizer */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            {/* Quick Overview Hero */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-indigo-500/20 text-indigo-400">
                  <BookOpen className="w-4 h-4" />
                </span>
                <span className="text-slate-300">
                  <strong className="text-white">Temel Prensip: </strong>
                  Kare sınıfı Dikdörtgen sınıfından türetilerek alan ve çevre hesaplama metotları sıfır kod tekrarı ile miras alınmıştır.
                </span>
              </div>
              <button
                onClick={() => setActiveTab('architecture')}
                className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <span>Mimarisi İncele</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Visualizer & Calculator Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 flex flex-col">
                <ShapeVisualizer
                  shapeType={shapeType}
                  dikdortgen={dikdortgen}
                  kare={kare}
                  ucgen={ucgen}
                />
              </div>
              <div className="lg:col-span-5 flex flex-col">
                <CalculatorPanel
                  shapeType={shapeType}
                  setShapeType={setShapeType}
                  rectWidth={rectWidth}
                  setRectWidth={setRectWidth}
                  rectHeight={rectHeight}
                  setRectHeight={setRectHeight}
                  squareSide={squareSide}
                  setSquareSide={setSquareSide}
                  triA={triA}
                  setTriA={setTriA}
                  triB={triB}
                  setTriB={setTriB}
                  triC={triC}
                  setTriC={setTriC}
                  dikdortgen={dikdortgen}
                  kare={kare}
                  ucgen={ucgen}
                />
              </div>
            </div>

            {/* Step-by-Step Mathematical & OOP Explanation */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Adım Adım Hesaplama ve Formül Analizi</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Area Breakdown */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                  <div className="font-bold text-indigo-300 text-sm">Alan Hesabı (alanHesapla)</div>
                  {shapeType === 'dikdortgen' && (
                    <>
                      <div className="font-mono text-slate-300">
                        Formül: <span className="text-white font-bold">Alan = genislik × yukseklik</span>
                      </div>
                      <div className="font-mono text-emerald-400">
                        Yerine Koyma: {rectWidth} × {rectHeight} = {dikdortgen.alanHesapla().toFixed(2)} br²
                      </div>
                      <p className="text-slate-400 text-[11px] mt-1">
                        Dikdortgen sınıfı içindeki <code className="text-indigo-300 font-mono">alanHesapla()</code> metodundan doğrudan döner.
                      </p>
                    </>
                  )}

                  {shapeType === 'kare' && (
                    <>
                      <div className="font-mono text-slate-300">
                        Formül: <span className="text-white font-bold">Alan = kenar × kenar</span>
                      </div>
                      <div className="font-mono text-emerald-400">
                        Yerine Koyma: {squareSide} × {squareSide} = {kare.alanHesapla().toFixed(2)} br²
                      </div>
                      <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-300 mt-1">
                        ★ Kare sınıfında <code className="font-mono font-bold">alanHesapla()</code> tekrar YAZILMADI! Dikdortgen'in metodu çalıştırıldı.
                      </div>
                    </>
                  )}

                  {shapeType === 'ucgen' && (
                    <>
                      <div className="font-mono text-slate-300">
                        Formül: <span className="text-white font-bold">Heron Formülü: √(u × (u-a) × (u-b) × (u-c))</span>
                      </div>
                      {ucgen.gecerliMi() ? (
                        <>
                          <div className="font-mono text-slate-300">
                            Yarı Çevre (u) = ({triA} + {triB} + {triC}) / 2 = {(ucgen.cevreHesapla() / 2).toFixed(1)}
                          </div>
                          <div className="font-mono text-emerald-400">
                            Alan = √({(ucgen.cevreHesapla() / 2).toFixed(1)} × {((ucgen.cevreHesapla() / 2) - triA).toFixed(1)} × {((ucgen.cevreHesapla() / 2) - triB).toFixed(1)} × {((ucgen.cevreHesapla() / 2) - triC).toFixed(1)}) = {ucgen.alanHesapla().toFixed(2)} br²
                          </div>
                        </>
                      ) : (
                        <div className="text-rose-400 font-semibold">
                          Üçgen eşitsizliği sağlanamadığı için alan hesaplanamaz.
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Perimeter Breakdown */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                  <div className="font-bold text-cyan-300 text-sm">Çevre Hesabı (cevreHesapla)</div>
                  {shapeType === 'dikdortgen' && (
                    <>
                      <div className="font-mono text-slate-300">
                        Formül: <span className="text-white font-bold">Çevre = 2 × (genislik + yukseklik)</span>
                      </div>
                      <div className="font-mono text-cyan-400">
                        Yerine Koyma: 2 × ({rectWidth} + {rectHeight}) = {dikdortgen.cevreHesapla().toFixed(2)} br
                      </div>
                      <p className="text-slate-400 text-[11px] mt-1">
                        Dikdörtgenin karşılıklı 2 çift eşit kenarının toplamıdır.
                      </p>
                    </>
                  )}

                  {shapeType === 'kare' && (
                    <>
                      <div className="font-mono text-slate-300">
                        Formül: <span className="text-white font-bold">Çevre = 2 × (kenar + kenar) = 4 × kenar</span>
                      </div>
                      <div className="font-mono text-cyan-400">
                        Yerine Koyma: 2 × ({squareSide} + {squareSide}) = {kare.cevreHesapla().toFixed(2)} br
                      </div>
                      <div className="p-2 rounded bg-cyan-950/30 border border-cyan-500/30 text-[11px] text-cyan-300 mt-1">
                        ★ Dikdortgen kurucusuna <code className="font-mono font-bold">super(kenar, kenar)</code> iletildiği için çevre otomatik olarak 4 × kenar sonucunu verir!
                      </div>
                    </>
                  )}

                  {shapeType === 'ucgen' && (
                    <>
                      <div className="font-mono text-slate-300">
                        Formül: <span className="text-white font-bold">Çevre = a + b + c</span>
                      </div>
                      <div className="font-mono text-cyan-400">
                        Yerine Koyma: {triA} + {triB} + {triC} = {ucgen.cevreHesapla().toFixed(2)} br
                      </div>
                      <p className="text-slate-400 text-[11px] mt-1">
                        Üçgenin üç kenarının toplam uzunluğudur.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Architecture & DRY Analysis */}
        {activeTab === 'architecture' && <ArchitectureView />}

        {/* Tab 3: Interactive Code Runner & Terminal */}
        {activeTab === 'playground' && <PlaygroundView />}

        {/* Tab 4: Polymorphism Batch Array (Sekil[]) */}
        {activeTab === 'polymorphism' && <PolymorphismView />}

        {/* Tab 5: Multi-language Source Code */}
        {activeTab === 'code' && <CodeView />}
      </main>

      {/* Footer with Signature & Attribution */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs text-slate-400">
                Nesne Yönelimli Programlama (OOP) Ödev Projesi
              </div>
              <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <span>Sekil, Dikdortgen, Kare ve Ucgen Sınıfları</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Geliştiren ve İmzalayan:</span>
            <div className="px-3 py-1 bg-slate-900 border border-indigo-500/30 rounded-xl flex items-center gap-2">
              <span className="font-signature text-2xl text-amber-300 font-bold">
                Enes Öztürk
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        </div>
      </footer>

      {/* Official Homework Report Modal */}
      <AssignmentReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
}
