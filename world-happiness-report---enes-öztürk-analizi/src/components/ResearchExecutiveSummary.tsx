import React, { useState } from 'react';
import { Award, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, Compass, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';
import { FACTOR_LEADERS, REGIONAL_DATA } from '../data/happinessData';

interface ResearchExecutiveSummaryProps {
  onSelectTab: (tabId: string) => void;
}

export const ResearchExecutiveSummary: React.FC<ResearchExecutiveSummaryProps> = ({ onSelectTab }) => {
  const [activeQuestion, setActiveQuestion] = useState<number>(1);

  return (
    <section className="py-12 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-900 font-semibold mb-1">
              Araştırma Raporu Yönetici Özeti
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Temel Sorular ve Bulgular Matrisi
            </h2>
          </div>
          <p className="text-sm text-stone-600 max-w-md">
            Enes Öztürk tarafından hazırlanan bu çalışma, 155 ülkenin verilerini 3 ana araştırma ekseninde derlemiştir.
          </p>
        </div>

        {/* 3 Question Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setActiveQuestion(1)}
            className={`text-left p-5 rounded-lg border transition-all cursor-pointer ${
              activeQuestion === 1
                ? 'bg-[#FBF9F5] border-amber-900/40 shadow-xs'
                : 'bg-stone-50/70 border-stone-200 hover:bg-stone-100/60'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-amber-950 font-serif">Soru 01</span>
              <Award className="w-4 h-4 text-amber-800" />
            </div>
            <h3 className="font-serif font-bold text-stone-900 text-base leading-snug mb-2">
              Genel ve Faktör Bazlı Liderler
            </h3>
            <p className="text-xs text-stone-600 line-clamp-2">
              Hangi ülkeler ve bölgeler genel mutlulukta ve 6 alt faktörün her birinde zirvede yer alıyor?
            </p>
          </button>

          <button
            onClick={() => setActiveQuestion(2)}
            className={`text-left p-5 rounded-lg border transition-all cursor-pointer ${
              activeQuestion === 2
                ? 'bg-[#FBF9F5] border-amber-900/40 shadow-xs'
                : 'bg-stone-50/70 border-stone-200 hover:bg-stone-100/60'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-amber-950 font-serif">Soru 02</span>
              <TrendingUp className="w-4 h-4 text-emerald-800" />
            </div>
            <h3 className="font-serif font-bold text-stone-900 text-base leading-snug mb-2">
              2015–2017 Tarihsel Değişim
            </h3>
            <p className="text-xs text-stone-600 line-clamp-2">
              2015-2016 ile 2016-2017 raporları arasında ülke sıralamaları ve puanları nasıl evrildi?
            </p>
          </button>

          <button
            onClick={() => setActiveQuestion(3)}
            className={`text-left p-5 rounded-lg border transition-all cursor-pointer ${
              activeQuestion === 3
                ? 'bg-[#FBF9F5] border-amber-900/40 shadow-xs'
                : 'bg-stone-50/70 border-stone-200 hover:bg-stone-100/60'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-amber-950 font-serif">Soru 03</span>
              <AlertTriangle className="w-4 h-4 text-rose-800" />
            </div>
            <h3 className="font-serif font-bold text-stone-900 text-base leading-snug mb-2">
              Büyük Artış ve Azalmalar
            </h3>
            <p className="text-xs text-stone-600 line-clamp-2">
              Hangi ülkeler mutlulukta radikal yükseliş (Togo, Letonya) ya da dramatik çöküş (Venezuela) yaşadı?
            </p>
          </button>
        </div>

        {/* Detailed Answer Panel for Selected Question */}
        <div className="p-6 lg:p-8 bg-[#FBF9F5] border border-stone-300 rounded-xl">
          {activeQuestion === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
                <div>
                  <span className="text-xs text-stone-500 uppercase tracking-widest font-mono">Araştırma Çıktısı #1</span>
                  <h4 className="text-xl font-serif font-bold text-stone-950 mt-1">
                    Genel Mutlulukta İskandinav Hakimiyeti & 6 Faktörün Küresel Şampiyonları
                  </h4>
                </div>
                <button
                  onClick={() => onSelectTab('factors')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 hover:text-amber-950 cursor-pointer"
                >
                  <span>6 Faktör Detaylı Görünümü</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-stone-700 leading-relaxed">
                Raporda genel mutluluk puanında <strong className="text-stone-950">Norveç (7.537)</strong> 1. sırada yer alırken; 
                onu sırasıyla Danimarka, İzlanda, İsviçre ve Finlandiya takip etmektedir. Ancak mutluluğu oluşturan 
                6 faktörün her biri incelendiğinde bambaşka liderlik dinamikleri karşımıza çıkar:
              </p>

              {/* 6 Factors Grid Leaderboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {FACTOR_LEADERS.map((f) => {
                  const leader = f.topCountries[0];
                  return (
                    <div key={f.factorKey} className="p-4 bg-white border border-stone-200 rounded-lg">
                      <div className="text-xs text-stone-500 font-medium">{f.factorNameTr}</div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                          <span>{leader.flag}</span>
                          <span>{leader.country}</span>
                        </span>
                        <span className="text-sm font-mono font-bold text-stone-950 tabular-nums">
                          {leader.value.toFixed(3)}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-2 line-clamp-2">
                        {leader.note}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Regional Overview Strip */}
              <div className="mt-4 p-4 bg-white border border-stone-200 rounded-lg">
                <div className="text-xs font-serif font-bold text-stone-900 mb-2">
                  Bölgesel Liderlik ve Dağılım Özeti:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-stone-500 block">En Mutlu Bölge:</span>
                    <strong className="text-stone-900">Kuzey Amerika & ANZ (7.23)</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Avrupa Ortalaması:</span>
                    <strong className="text-stone-900">Batı Avrupa (6.88)</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Latin Amerika:</span>
                    <strong className="text-stone-900">Kosta Rika Liderliğinde (5.95)</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block">En Çok Destek Gereken:</span>
                    <strong className="text-stone-900">Sahra Altı Afrika (4.28)</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeQuestion === 2 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
                <div>
                  <span className="text-xs text-stone-500 uppercase tracking-widest font-mono">Araştırma Çıktısı #2</span>
                  <h4 className="text-xl font-serif font-bold text-stone-950 mt-1">
                    2015-2016 ile 2016-2017 Raporları Arasındaki Puan ve Sıralama Dalgalanmaları
                  </h4>
                </div>
                <button
                  onClick={() => onSelectTab('evolution')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 hover:text-amber-950 cursor-pointer"
                >
                  <span>Karşılaştırma Tablosuna Git</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-stone-200 rounded-lg">
                  <div className="text-xs text-stone-500">2015 Zirvesi</div>
                  <div className="text-lg font-serif font-bold text-stone-900 mt-1">🇨🇭 İsviçre (7.587)</div>
                  <p className="text-xs text-stone-600 mt-2">
                    2015'te dünyanın en mutlusu İsviçre idi. 2017'de 4. sıraya geriledi (-0.093 puan).
                  </p>
                </div>
                <div className="p-4 bg-white border border-stone-200 rounded-lg">
                  <div className="text-xs text-stone-500">2016 Zirvesi</div>
                  <div className="text-lg font-serif font-bold text-stone-900 mt-1">🇩🇰 Danimarka (7.526)</div>
                  <p className="text-xs text-stone-600 mt-2">
                    2016 raporunda tacı Danimarka aldı. 2017'de küçük bir farkla 2. sıraya indi (-0.004 puan).
                  </p>
                </div>
                <div className="p-4 bg-white border border-stone-200 rounded-lg">
                  <div className="text-xs text-stone-500">2017 Zirvesi</div>
                  <div className="text-lg font-serif font-bold text-emerald-950 mt-1">🇳🇴 Norveç (7.537)</div>
                  <p className="text-xs text-stone-600 mt-2">
                    2015 ve 2016'da 4. olan Norveç, 2017'de +3 basamak atlayarak dünya şampiyonu oldu.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white border border-stone-200 rounded-lg space-y-3">
                <div className="text-xs font-serif font-bold text-stone-900">
                  Dönemsel Trendin Kritik Bulguları (Enes Öztürk Analiz Notu):
                </div>
                <ul className="text-xs text-stone-700 space-y-2 list-disc pl-4">
                  <li>
                    <strong>İskandinav Rotasyonu:</strong> İlk 5 sıradaki İskandinav ülkeleri kendi aralarında yer değiştirmiş, ancak ortalama puanları neredeyse hiç düşmemiştir. Bu durum sosyal güvenlik ve kurumsal güvenin şoklara karşı ne kadar koruyucu olduğunu ispatlar.
                  </li>
                  <li>
                    <strong>Doğu Avrupa'nın Sıçrayışı:</strong> Letonya, Romanya ve Bulgaristan 2015'ten 2017'ye ortalama +0.50 ila +0.75 puan artış kaydederek kıtada en hızlı yükselen bloğu oluşturmuştur.
                  </li>
                  <li>
                    <strong>Büyük Güçlerde Durağanlık:</strong> ABD (14. sıra) ve Birleşik Krallık (19. sıra) yüksek gelirlerine rağmen sosyal kutuplaşma ve sağlık güvensizlikleri sebebiyle ilk 10'a girememiştir.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeQuestion === 3 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
                <div>
                  <span className="text-xs text-stone-500 uppercase tracking-widest font-mono">Araştırma Çıktısı #3</span>
                  <h4 className="text-xl font-serif font-bold text-stone-950 mt-1">
                    Önemli Artış ve Azalma Yaşayan Ülkeler: Zıt Kutuplar
                  </h4>
                </div>
                <button
                  onClick={() => onSelectTab('casestudies')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 hover:text-amber-950 cursor-pointer"
                >
                  <span>Detaylı Vaka İncelemeleri</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Biggest Droppers Box */}
                <div className="p-5 bg-rose-50/50 border border-rose-200 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-900 uppercase tracking-wide">
                      En Büyük Gerilemeler (2015 - 2017)
                    </span>
                    <ArrowDownRight className="w-4 h-4 text-rose-700" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 bg-white border border-rose-200 rounded">
                      <div>
                        <div className="text-sm font-bold text-stone-900">🇻🇪 Venezuela</div>
                        <div className="text-[11px] text-stone-600">23. sıradan 82. sıraya geriledi (-59 sıra)</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono font-bold text-rose-700 tabular-nums">-1.560 Puan</div>
                        <div className="text-[10px] text-stone-500">Hiperenflasyon & Kriz</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-white border border-rose-200 rounded">
                      <div>
                        <div className="text-sm font-bold text-stone-900">🇨🇫 Orta Afrika Cumhuriyeti</div>
                        <div className="text-[11px] text-stone-600">En mutsuz sonuncu ülke konumuna indi</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono font-bold text-rose-700 tabular-nums">-0.985 Puan</div>
                        <div className="text-[10px] text-stone-500">Silahlı Çatışma</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-white border border-rose-200 rounded">
                      <div>
                        <div className="text-sm font-bold text-stone-900">🇺🇦 Ukrayna</div>
                        <div className="text-[11px] text-stone-600">111. sıradan 132. sıraya geriledi (-21 sıra)</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono font-bold text-rose-700 tabular-nums">-0.585 Puan</div>
                        <div className="text-[10px] text-stone-500">Jeopolitik İstikrarsızlık</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Biggest Gainers Box */}
                <div className="p-5 bg-emerald-50/50 border border-emerald-200 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                      En Büyük Yükselişler (2015 - 2017)
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-emerald-700" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 bg-white border border-emerald-200 rounded">
                      <div>
                        <div className="text-sm font-bold text-stone-900">🇱🇻 Letonya</div>
                        <div className="text-[11px] text-stone-600">89. sıradan 54. sıraya tırmandı (+35 sıra)</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono font-bold text-emerald-700 tabular-nums">+0.752 Puan</div>
                        <div className="text-[10px] text-stone-500">Baltık Ekonomik Reformu</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-white border border-emerald-200 rounded">
                      <div>
                        <div className="text-sm font-bold text-stone-900">🇷🇴 Romanya</div>
                        <div className="text-[11px] text-stone-600">86. sıradan 57. sıraya tırmandı (+29 sıra)</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono font-bold text-emerald-700 tabular-nums">+0.701 Puan</div>
                        <div className="text-[10px] text-stone-500">Yolsuzlukla Mücadele</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-white border border-emerald-200 rounded">
                      <div>
                        <div className="text-sm font-bold text-stone-900">🇹🇬 Togo</div>
                        <div className="text-[11px] text-stone-600">2015 sonunculuğundan kurtuldu (+8 sıra)</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono font-bold text-emerald-700 tabular-nums">+0.656 Puan</div>
                        <div className="text-[10px] text-stone-500">Temel Altyapı Kazanımı</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
