import React, { useState } from 'react';
import { Plus, Trash2, RotateCcw, ListFilter, Calculator, Sparkles, RectangleHorizontal, Square, Triangle } from 'lucide-react';
import { Sekil, Dikdortgen, Kare, Ucgen } from '../models/Sekil';

interface ShapeItem {
  id: string;
  instance: Sekil;
}

export const PolymorphismView: React.FC = () => {
  const [shapes, setShapes] = useState<ShapeItem[]>([
    { id: '1', instance: new Dikdortgen(6, 10) },
    { id: '2', instance: new Kare(5) },
    { id: '3', instance: new Ucgen(3, 4, 5) },
    { id: '4', instance: new Kare(8) },
    { id: '5', instance: new Dikdortgen(12, 4) }
  ]);

  // Form states for adding shapes
  const [newType, setNewType] = useState<'dikdortgen' | 'kare' | 'ucgen'>('kare');
  const [w, setW] = useState(6);
  const [h, setH] = useState(8);
  const [side, setSide] = useState(7);
  const [a, setA] = useState(5);
  const [b, setB] = useState(12);
  const [c, setC] = useState(13);

  const handleAdd = () => {
    let instance: Sekil;
    if (newType === 'dikdortgen') {
      instance = new Dikdortgen(w, h);
    } else if (newType === 'kare') {
      instance = new Kare(side);
    } else {
      instance = new Ucgen(a, b, c);
    }

    setShapes((prev) => [...prev, { id: Math.random().toString(36).substring(7), instance }]);
  };

  const handleRemove = (id: string) => {
    setShapes((prev) => prev.filter((item) => item.id !== id));
  };

  const handleReset = () => {
    setShapes([
      { id: '1', instance: new Dikdortgen(6, 10) },
      { id: '2', instance: new Kare(5) },
      { id: '3', instance: new Ucgen(3, 4, 5) },
      { id: '4', instance: new Kare(8) },
      { id: '5', instance: new Dikdortgen(12, 4) }
    ]);
  };

  // Polymorphic calculation in action
  const toplamAlan = shapes.reduce((sum, item) => sum + item.instance.alanHesapla(), 0);
  const toplamCevre = shapes.reduce((sum, item) => sum + item.instance.cevreHesapla(), 0);
  const ortalamaAlan = shapes.length > 0 ? toplamAlan / shapes.length : 0;

  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Polimorfizm (Çok Biçimlilik) Gösterimi</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Heterojen Şekil Koleksiyonu: <code className="text-indigo-300 font-mono">Sekil[]</code>
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Farklı sınıflardan nesneler (Dikdörtgen, Kare, Üçgen) tek bir ortak üst sınıf olan{' '}
              <strong className="text-slate-200">Sekil</strong> tipindeki dizide toplanır ve polimorfik olarak tek bir döngüde hesaplanır.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer self-start md:self-auto shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Varsayılan Listeye Dön</span>
          </button>
        </div>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30">
          <span className="text-[10px] uppercase font-bold text-indigo-400">Toplam Koleksiyon Alanı</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            {toplamAlan.toFixed(2)} <span className="text-xs font-normal text-slate-400">br²</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            sekiller.reduce((acc, s) =&gt; acc + s.alanHesapla(), 0)
          </p>
        </div>

        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
          <span className="text-[10px] uppercase font-bold text-cyan-400">Toplam Koleksiyon Çevresi</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            {toplamCevre.toFixed(2)} <span className="text-xs font-normal text-slate-400">br</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            sekiller.reduce((acc, s) =&gt; acc + s.cevreHesapla(), 0)
          </p>
        </div>

        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
          <span className="text-[10px] uppercase font-bold text-emerald-400">Toplam Şekil Sayısı</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            {shapes.length} <span className="text-xs font-normal text-slate-400">adet</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Ortalama Alan: {ortalamaAlan.toFixed(1)} br²
          </p>
        </div>
      </div>

      {/* Add New Shape Card */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-2 text-sm font-bold text-white mb-3">
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Koleksiyona Yeni Şekil Ekle</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          {/* Type selector */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Şekil Türü</label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="dikdortgen">Dikdörtgen</option>
              <option value="kare">Kare</option>
              <option value="ucgen">Üçgen</option>
            </select>
          </div>

          {/* Conditional inputs */}
          {newType === 'dikdortgen' && (
            <>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Genişlik (br)</label>
                <input
                  type="number"
                  min="1"
                  value={w}
                  onChange={(e) => setW(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Yükseklik (br)</label>
                <input
                  type="number"
                  min="1"
                  value={h}
                  onChange={(e) => setH(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </>
          )}

          {newType === 'kare' && (
            <div className="sm:col-span-2">
              <label className="text-[11px] text-slate-400 block mb-1">Kenar Uzunluğu (br)</label>
              <input
                type="number"
                min="1"
                value={side}
                onChange={(e) => setSide(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
          )}

          {newType === 'ucgen' && (
            <div className="sm:col-span-2 grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">a Kenarı</label>
                <input
                  type="number"
                  min="1"
                  value={a}
                  onChange={(e) => setA(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">b Kenarı</label>
                <input
                  type="number"
                  min="1"
                  value={b}
                  onChange={(e) => setB(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">c Kenarı</label>
                <input
                  type="number"
                  min="1"
                  value={c}
                  onChange={(e) => setC(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-white"
                />
              </div>
            </div>
          )}

          <div>
            <button
              onClick={handleAdd}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Diziye Ekle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Shapes Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-lg">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-indigo-400" />
            <span>Mevcut Şekiller Dizisi (Sekil[])</span>
          </div>
          <span className="text-xs text-slate-400 font-signature text-base">
            Enes Öztürk
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Sıra</th>
                <th className="px-4 py-3">Şekil Adı & Sınıf</th>
                <th className="px-4 py-3">Ölçüler</th>
                <th className="px-4 py-3">Hesaplanan Alan</th>
                <th className="px-4 py-3">Hesaplanan Çevre</th>
                <th className="px-4 py-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {shapes.map((item, index) => {
                const s = item.instance;
                const isKare = s instanceof Kare;
                const isDikdortgen = s instanceof Dikdortgen && !isKare;
                const isUcgen = s instanceof Ucgen;

                return (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-4 py-3 text-slate-500 font-mono">#{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {isDikdortgen && <RectangleHorizontal className="w-4 h-4 text-indigo-400" />}
                        {isKare && <Square className="w-4 h-4 text-emerald-400" />}
                        {isUcgen && <Triangle className="w-4 h-4 text-amber-400" />}
                        <div>
                          <span className="font-bold text-white">{s.isim}</span>
                          <span className="text-[10px] text-slate-500 font-mono block">
                            {isKare ? 'Kare (ext. Dikdortgen)' : isDikdortgen ? 'Dikdortgen (ext. Sekil)' : 'Ucgen (ext. Sekil)'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300">
                      {isDikdortgen && `${(s as Dikdortgen).genislik} × ${(s as Dikdortgen).yukseklik} br`}
                      {isKare && `kenar = ${(s as Kare).kenar} br`}
                      {isUcgen && `a=${(s as Ucgen).a}, b=${(s as Ucgen).b}, c=${(s as Ucgen).c}`}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-400">
                      {s.alanHesapla().toFixed(2)} br²
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-cyan-400">
                      {s.cevreHesapla().toFixed(2)} br
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded transition cursor-pointer"
                        title="Şekli Kaldır"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
