/**
 * Research Pillar 4: Kırsal ve Kentsel Alanlar Nasıl Farklılaştı?
 * The Great Rural-Urban Divergence (2000 - 2016)
 * Author & Analysis: Enes Öztürk
 */
import React, { useState } from 'react';
import { MapPin, AlertTriangle, ShieldCheck, HeartPulse, Gauge, EyeOff, TreePine, Building2, GitCompare } from 'lucide-react';
import { URBAN_VS_RURAL_INSIGHTS, YEARLY_ACCIDENT_DATA } from '../data/accidentData.ts';

export const Pillar4RuralUrban: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<'overview' | 'speed' | 'causes' | 'response'>('overview');

  return (
    <section id="rural-urban" className="py-12 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <span className="w-5 h-5 rounded bg-amber-400/10 border border-amber-400/30 flex items-center justify-center font-bold">4</span>
            <span>ARAŞTIRMA SORUSU 4</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">İmza: Enes Öztürk</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Kırsal ve Kentsel Alanlar Nasıl Farklılaştı?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            1.6 milyonluk verinin en çarpıcı sonucu: 
            <span className="text-amber-300 font-semibold"> "Kırsal Güvenlik Paradoksu"</span>dur. 
            Kazaların <strong className="text-white">%68'i</strong> kentsel sokak ve kavşaklarda gerçekleşmesine rağmen, 
            karayolu ölümlerinin <strong className="text-rose-400">%58'i kırsal yollarda</strong> toplanmaktadır.
          </p>
        </div>

        {/* 1. The Core Divergence Visual Comparison Box */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-amber-400" />
                Büyük Kentsel - Kırsal Asimetrisi (The Great Divergence)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Kentsel alanlarda kaza frekansı yüksek fakat ölüm oranı düşüktür; kırsalda ise kaza seyrek fakat tahrip gücü çok yüksektir.
              </p>
            </div>
            <div className="text-xs font-mono text-slate-400">
              1.64M Kaza / 38.2K Can Kaybı
            </div>
          </div>

          {/* Dual Split Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Urban Profile */}
            <div className="p-5 rounded-xl bg-slate-950/70 border border-blue-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Kentsel Yol Ağı (Urban)</h4>
                    <span className="text-[11px] text-slate-400">Şehir merkezleri, konut alanları, kavşaklar</span>
                  </div>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  %68.2 Kaza Payı
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">Toplam Kaza:</span>
                  <span className="text-lg font-bold text-white">1,118,890</span>
                  <span className="text-[10px] text-slate-500 block">Tüm kazaların üçte ikisi</span>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">Toplam Can Kaybı:</span>
                  <span className="text-lg font-bold text-blue-400">15,984</span>
                  <span className="text-[10px] text-slate-500 block">Ölümlerin %41.8'i</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                  <span className="text-slate-400">Kaza Başı Ölüm Oranı:</span>
                  <span className="text-emerald-400 font-bold">%1.05 (Düşük)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                  <span className="text-slate-400">Ortalama Çarpışma Hızı:</span>
                  <span className="text-white">24.2 mph (39 km/s)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                  <span className="text-slate-400">Yaya ve Bisikletli Payı:</span>
                  <span className="text-amber-400 font-bold">%22.4 (Hassas Yol Kullanıcıları)</span>
                </div>
                <div className="flex justify-between py-1 font-mono">
                  <span className="text-slate-400">Ambulans Ulaşım Süresi:</span>
                  <span className="text-slate-200">7.4 Dakika</span>
                </div>
              </div>
            </div>

            {/* Rural Profile */}
            <div className="p-5 rounded-xl bg-slate-950/70 border border-rose-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <TreePine className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Kırsal Yol Ağı (Rural)</h4>
                    <span className="text-[11px] text-slate-400">A/B Yolları, tek şeritli virajlar, bağ yolları</span>
                  </div>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  %58.2 Ölüm Payı
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">Toplam Kaza:</span>
                  <span className="text-lg font-bold text-white">521,708</span>
                  <span className="text-[10px] text-slate-500 block">Kazaların sadece %31.8'i</span>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">Toplam Can Kaybı:</span>
                  <span className="text-lg font-bold text-rose-400">22,256</span>
                  <span className="text-[10px] text-rose-400/80 block">Ölümlerin %58.2'si!</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                  <span className="text-slate-400">Kaza Başı Ölüm Oranı:</span>
                  <span className="text-rose-400 font-bold">%3.48 (3.3 Kat Daha Ölümcül!)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                  <span className="text-slate-400">Ortalama Çarpışma Hızı:</span>
                  <span className="text-rose-300 font-bold">51.6 mph (83 km/s)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                  <span className="text-slate-400">Kafa Kafaya Çarpışma:</span>
                  <span className="text-rose-400 font-bold">%19.4 (Kentselin 5 Katı)</span>
                </div>
                <div className="flex justify-between py-1 font-mono">
                  <span className="text-slate-400">Ambulans Ulaşım Süresi:</span>
                  <span className="text-amber-400">18.9 Dakika (Gecikmeli Travma)</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 2. Root Cause Explanatory Grid: Why is Rural 3.3x Deadlier? */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Kırsal Yollardaki Ölümcüllüğün 5 Kök Nedeni (Veri Tabanlı İnceleme)
            </h3>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">Enes Öztürk Analiz Raporu</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono">
                <Gauge className="w-4 h-4" />
                1. Kinetik Enerji & Hız (52 mph vs 24 mph)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Fizik kuralları gereği kinetik enerji hızın karesiyle orantılıdır ($E = \frac{1}{2} m v^2$). 52 mph hızda meydana gelen bir kırsal çarpışma, 24 mph hızdaki bir kentsel kazaya göre <strong className="text-white">4.6 kat daha fazla tahrip enerjisi</strong> açığa çıkarır.
              </p>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold font-mono">
                <GitCompare className="w-4 h-4" />
                2. Kafa Kafaya Çarpışma Riski (%19.4)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Kırsal A-yolları çoğunlukla refüjsüz tek şeritlidir. Hatalı sollama, traktör veya yavaş araç geçme teşebbüsleri zıt yönden gelen araçla 100+ mph bağıl hızla kafa kafaya çarpışmayla sonuçlanır.
              </p>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold font-mono">
                <TreePine className="w-4 h-4" />
                3. Affetmeyen Yol Kenarları (%28.5 Sabit Engel)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Kentsel yollarda savrulan araçlar bordür veya park etmiş araçlara çarparak dururken; kırsalda yol kenarında asırlık meşe ağaçları, taş duvarlar ve derin drenaj hendekleri bulunur.
              </p>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold font-mono">
                <EyeOff className="w-4 h-4" />
                4. Zifiri Karanlık & Aydınlatma Yokluğu (%64.2)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Kırsal yolların %64'ünde hiçbir sokak aydınlatması yoktur. Virajlar, yaban hayvanları veya arızalı araçlar son anda fark edildiğinde panik freni savrulmaya neden olur.
              </p>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono">
                <HeartPulse className="w-4 h-4" />
                5. Altın Saat & Acil Müdahale Gecikmesi (18.9 dk)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ağır travma vakalarında ilk 60 dakika (altın saat) hayatta kalmayı belirler. Kırsal kazalarda ambulansın olay yerine varması 18.9 dakikayı bulmakta, uzak bir bölge hastanesine nakil saatler sürebilmektedir.
              </p>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2 flex flex-col justify-between">
              <div>
                <div className="text-amber-400 text-xs font-bold font-mono mb-1">
                  Enes Öztürk Politika Önerisi
                </div>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  "Birleşik Krallık karayolu güvenliğinde asıl can kayıplarını önlemek istiyorsa, bütçeyi sadece şehir içi hız kasislerine değil; kırsal A-yollarındaki sollama yasaklarına, merkez ayırıcı çelik bariyerlere ve viraj aydınlatmalarına yönlendirmelidir."
                </p>
              </div>
              <span className="text-[10px] text-amber-400/70 font-mono mt-2 block">
                Araştırmacı Notu · 2000–2016 STATS19
              </span>
            </div>

          </div>
        </div>

        {/* 3. Historical Divergence Trajectory (2000 - 2016) */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white">
                Tarihsel Değişim: Kentsel ve Kırsal Kazaların Yıllara Göre Seyri
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Kentsel kazalar %43.6 gerilerken, kırsal yollarda düşüş daha sınırlı (%38.0) kalmıştır.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                Kentsel Kazalar
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
                Kırsal Kazalar
              </span>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <div className="min-w-[650px] h-48 flex items-end gap-2 pt-6 pb-2 px-2 bg-slate-950/60 rounded-xl border border-slate-850">
              {YEARLY_ACCIDENT_DATA.filter((_, idx) => idx % 2 === 0 || idx === 16).map((item) => {
                const urbanHeight = (item.urbanAccidents / 170000) * 100;
                const ruralHeight = (item.ruralAccidents / 80000) * 100;

                return (
                  <div key={item.year} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      <div
                        style={{ height: `${urbanHeight}%` }}
                        className="w-1/2 bg-blue-500/80 hover:bg-blue-400 rounded-t transition-all"
                        title={`Kentsel: ${item.urbanAccidents.toLocaleString()}`}
                      />
                      <div
                        style={{ height: `${ruralHeight}%` }}
                        className="w-1/2 bg-rose-500/80 hover:bg-rose-400 rounded-t transition-all"
                        title={`Kırsal: ${item.ruralAccidents.toLocaleString()}`}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 mt-2 block">
                      {item.year}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
