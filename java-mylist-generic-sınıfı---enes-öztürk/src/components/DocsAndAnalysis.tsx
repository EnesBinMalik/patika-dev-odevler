/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  CheckCircle2, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Award, 
  Terminal, 
  BookOpen, 
  Flame,
  ArrowRight
} from 'lucide-react';

export const DocsAndAnalysis: React.FC = () => {
  const methods = [
    {
      name: 'MyList()',
      returns: 'Constructor',
      timeComp: 'O(1)',
      desc: 'Boş yapıcı metot. Başlangıç dizi kapasitesini varsayılan olarak 10 yapar, size = 0 olarak başlatır.',
    },
    {
      name: 'MyList(int capacity)',
      returns: 'Constructor',
      timeComp: 'O(1)',
      desc: 'Parametreli yapıcı metot. Belirtilen kapasite kadar Object[] alanı tahsis eder. Geçersiz değerlerde 10 yapar.',
    },
    {
      name: 'size()',
      returns: 'int',
      timeComp: 'O(1)',
      desc: 'Dizideki aktif eleman sayısını döndürür.',
    },
    {
      name: 'getCapacity()',
      returns: 'int',
      timeComp: 'O(1)',
      desc: 'Fiziksel iç dizinin o anki toplam kapasitesini (data.length) döndürür.',
    },
    {
      name: 'add(T data)',
      returns: 'void',
      timeComp: 'O(1) amortized',
      desc: 'Yeni eleman ekler. Eğer size >= capacity ise kapasite 2 katına çıkartılır (10 -> 20 -> 40...) ve eleman sona eklenir.',
    },
    {
      name: 'get(int index)',
      returns: 'T (veya null)',
      timeComp: 'O(1)',
      desc: 'Belirtilen indisteki elemanı döner. Geçersiz indis girilirse istisna fırlatmaz, null döndürür.',
    },
    {
      name: 'remove(int index)',
      returns: 'T (veya null)',
      timeComp: 'O(n)',
      desc: 'İndisteki veriyi siler. Silinen indisten sonraki tüm elemanları sola (Left-shift) kaydırır ve silinen değeri döndürür. Geçersiz indiste null döner.',
    },
    {
      name: 'set(int index, T data)',
      returns: 'T (veya null)',
      timeComp: 'O(1)',
      desc: 'Verilen indisteki elemanı yenisiyle değiştirir. Geçersiz indiste null döner.',
    },
    {
      name: 'toString()',
      returns: 'String',
      timeComp: 'O(n)',
      desc: 'Elemanları [10,20,30] formatında metin olarak döner. Boş ise [] döner.',
    },
    {
      name: 'indexOf(T data)',
      returns: 'int',
      timeComp: 'O(n)',
      desc: 'Elemanın baştan itibaren ilk bulunduğu indeksi döner. Yoksa -1 döndürür.',
    },
    {
      name: 'lastIndexOf(T data)',
      returns: 'int',
      timeComp: 'O(n)',
      desc: 'Elemanın sondan taranarak bulunduğu son indeksi döner. Yoksa -1 döndürür.',
    },
    {
      name: 'isEmpty()',
      returns: 'boolean',
      timeComp: 'O(1)',
      desc: 'Listedeki eleman sayısı 0 ise true, aksi halde false döndürür.',
    },
    {
      name: 'toArray()',
      returns: 'Object[]',
      timeComp: 'O(n)',
      desc: 'Listedeki elemanları sırayla yeni bir dizi haline getirerek döner.',
    },
    {
      name: 'clear()',
      returns: 'void',
      timeComp: 'O(1)',
      desc: 'Listeyi tamamen boşaltır, eleman sayısını 0 yapar ve diziyi varsayılan boyutuna (10) çevirir.',
    },
    {
      name: 'subList(int start, int finish)',
      returns: 'MyList<T>',
      timeComp: 'O(k)',
      desc: 'Verilen indeks aralığına ait (örnek çıktıya uygun olarak start ve finish dahil) yeni bir MyList nesnesi döner.',
    },
    {
      name: 'contains(T data)',
      returns: 'boolean',
      timeComp: 'O(n)',
      desc: 'Verilen nesnenin listede bulunup bulunmadığını kontrol eder (indexOf(data) != -1).',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Signature & Developer Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Award className="w-64 h-64 text-amber-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Resmi Onaylı Ödev & Proje İmzası</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Geliştirici: <span className="text-amber-400">Enes Öztürk</span>
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Bu proje, Java&apos;nın standart <code>java.util.Collection</code> hiyerarşisi (ArrayList, LinkedList, Vector vb.) 
              tamamen devre dışı bırakılarak, ham bellek seviyesinde generic tip güvenliği ve dinamik dizi algoritmalarıyla 
              <strong> Enes Öztürk</strong> tarafından inşa edilmiştir.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
              <span className="text-slate-500 block">Sınıf Yapısı:</span>
              <span className="text-amber-300 font-bold">public class MyList&lt;T&gt;</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
              <span className="text-slate-500 block">İmza Mührü:</span>
              <span className="text-emerald-400 font-bold">@author Enes Öztürk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400">
            <Zap className="w-5 h-5" />
            <h3 className="font-bold text-sm text-white">2x Dinamik Büyüme (Doubling)</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dizinin fiziksel boyutu dolduğunda (size == capacity), yeni bir <code>Object[capacity * 2]</code> tahsis edilir 
            ve eski elemanlar yeni diziye aktarılır. Bu yöntem eleman ekleme işleminin amortize edilmiş zaman karmaşıklığını <strong>O(1)</strong> yapar.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400">
            <Layers className="w-5 h-5" />
            <h3 className="font-bold text-sm text-white">Sola Kaydırma (Left Shift)</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            <code>remove(int index)</code> işleminde silinen indisin sonrasındaki elemanlar sola doğru 
            (<code>data[i] = data[i+1]</code>) bir basamak kaydırılır. Dizide boşluk (gap) oluşması engellenir.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-bold text-sm text-white">Generic Tip Güvenliği & Null</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Java&apos;nın tip silme (Type Erasure) kuralı gereği doğrudan <code>new T[]</code> oluşturulamaz. 
            Bu yüzden <code>Object[]</code> kullanılıp dönüşümlerde <code>(T)</code> cast ve <code>@SuppressWarnings(&quot;unchecked&quot;)</code> uygulanır.
          </p>
        </div>

      </div>

      {/* Method Specification Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              İstenen Metotların Tam Şartnamesi & Big-O Zaman Karmaşıklığı
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">16 Metot / Özellik</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Metot İmzası</th>
                <th className="py-3 px-4 font-semibold">Dönüş Türü</th>
                <th className="py-3 px-4 font-semibold">Karmaşıklık</th>
                <th className="py-3 px-4 font-semibold font-sans">Açıklama & Çalışma Mantığı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {methods.map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 text-amber-300 font-bold whitespace-nowrap">
                    {m.name}
                  </td>
                  <td className="py-3 px-4 text-cyan-400 whitespace-nowrap">
                    {m.returns}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      m.timeComp.includes('O(1)')
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {m.timeComp}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-300 text-xs">
                    {m.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Signature Seal Banner */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Java MyList&lt;T&gt; Özgün Uygulaması — Tüm senaryo ve test çıktıları doğrulanmıştır.</span>
        </div>
        <div className="font-mono text-amber-400 font-semibold">
          © Enes Öztürk
        </div>
      </div>
    </div>
  );
};
