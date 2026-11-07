import React, { useState } from 'react';
import { Sliders, Sparkles, RefreshCw, BookmarkCheck } from 'lucide-react';
import { HAPPINESS_DATASET } from '../data/happinessData';

export const HappinessSimulator: React.FC = () => {
  // Simulator state with realistic default baseline (close to global average)
  const [gdp, setGdp] = useState(1.0);
  const [social, setSocial] = useState(1.2);
  const [health, setHealth] = useState(0.6);
  const [freedom, setFreedom] = useState(0.4);
  const [trust, setTrust] = useState(0.15);
  const [generosity, setGenerosity] = useState(0.25);
  const dystopiaBase = 1.85;

  const totalCalculatedScore = Number((gdp + social + health + freedom + trust + generosity + dystopiaBase).toFixed(3));

  // Find the closest real world country in dataset
  const closestCountry = [...HAPPINESS_DATASET].sort((a, b) => {
    return Math.abs(a.score2017 - totalCalculatedScore) - Math.abs(b.score2017 - totalCalculatedScore);
  })[0];

  // Presets
  const applyPreset = (preset: 'nordic' | 'eastasia' | 'crisis' | 'turkey_target') => {
    if (preset === 'nordic') {
      setGdp(1.55);
      setSocial(1.55);
      setHealth(0.82);
      setFreedom(0.62);
      setTrust(0.38);
      setGenerosity(0.35);
    } else if (preset === 'eastasia') {
      setGdp(1.60);
      setSocial(1.25);
      setHealth(0.92);
      setFreedom(0.48);
      setTrust(0.25);
      setGenerosity(0.18);
    } else if (preset === 'crisis') {
      setGdp(0.45);
      setSocial(0.55);
      setHealth(0.25);
      setFreedom(0.12);
      setTrust(0.03);
      setGenerosity(0.08);
    } else if (preset === 'turkey_target') {
      // If Turkey reaches European average in trust and freedom
      setGdp(1.35);
      setSocial(1.45);
      setHealth(0.75);
      setFreedom(0.50);
      setTrust(0.25);
      setGenerosity(0.20);
    }
  };

  return (
    <div className="bg-white border border-stone-300 rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-amber-900 font-semibold font-mono">
            Politika Simülatörü
          </div>
          <h3 className="text-xl font-serif font-bold text-stone-900 mt-0.5">
            Toplumsal Mutluluk ve Refah Simülatörü
          </h3>
        </div>
        <p className="text-xs text-stone-500 max-w-sm">
          Faktörlerin seviyelerini değiştirerek bir ülkenin teorik mutluluk puanını ve küresel ligdeki eşdeğerini test edin.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-stone-500 font-medium mr-1">Örnek Senaryolar:</span>
        <button
          onClick={() => applyPreset('nordic')}
          className="px-3 py-1 text-xs bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-md text-stone-800 transition-colors cursor-pointer"
        >
          İskandinav Refah Modeli
        </button>
        <button
          onClick={() => applyPreset('eastasia')}
          className="px-3 py-1 text-xs bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-md text-stone-800 transition-colors cursor-pointer"
        >
          Doğu Asya Tekno-Sağlık Modeli
        </button>
        <button
          onClick={() => applyPreset('turkey_target')}
          className="px-3 py-1 text-xs bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-md text-stone-800 transition-colors cursor-pointer"
        >
          Türkiye İçin Kurumsal İlerleme Hedefi
        </button>
        <button
          onClick={() => applyPreset('crisis')}
          className="px-3 py-1 text-xs bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md text-rose-800 transition-colors cursor-pointer"
        >
          Sosyo-Ekonomik Kriz
        </button>
      </div>

      {/* Results Box */}
      <div className="p-5 bg-[#FBF9F5] border border-amber-900/30 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <div className="text-xs text-stone-500 uppercase tracking-widest font-mono">
            Hesaplanan Simülasyon Skoru
          </div>
          <div className="text-3xl sm:text-4xl font-serif font-bold text-stone-950 mt-1 tabular-nums">
            {totalCalculatedScore.toFixed(3)}
            <span className="text-sm font-sans font-normal text-stone-500 ml-1">/ 10</span>
          </div>
          <div className="text-xs text-stone-600 mt-1">
            (6 Faktör Toplamı: {(gdp + social + health + freedom + trust + generosity).toFixed(3)} + Distopya Sabiti: {dystopiaBase})
          </div>
        </div>

        <div className="p-4 bg-white border border-stone-200 rounded-lg">
          <div className="text-xs text-stone-500 font-medium">Bu skor gerçek dünyada kime denk geliyor?</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl">{closestCountry.flag}</span>
            <div>
              <div className="text-base font-serif font-bold text-stone-900">
                {closestCountry.nameTr} ({closestCountry.score2017.toFixed(3)})
              </div>
              <div className="text-[11px] text-stone-500">
                Dünya #{closestCountry.rank2017} · {closestCountry.regionTr}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Factor Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-stone-800">1. Kişi Başına GSYİH (Ekonomi)</span>
            <span className="font-mono font-bold text-stone-950 tabular-nums">{gdp.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1.9"
            step="0.05"
            value={gdp}
            onChange={(e) => setGdp(parseFloat(e.target.value))}
            className="w-full accent-stone-900 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-400">
            <span>0.00 (Temel Yoksulluk)</span>
            <span>1.90 (Katar / Lüksemburg)</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-stone-800">2. Sosyal Destek & Aile Ağı</span>
            <span className="font-mono font-bold text-stone-950 tabular-nums">{social.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1.7"
            step="0.05"
            value={social}
            onChange={(e) => setSocial(parseFloat(e.target.value))}
            className="w-full accent-stone-900 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-400">
            <span>0.00 (Sosyal İzolasyon)</span>
            <span>1.70 (İzlanda / Danimarka)</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-stone-800">3. Sağlıklı Yaşam Beklentisi</span>
            <span className="font-mono font-bold text-stone-950 tabular-nums">{health.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1.0"
            step="0.02"
            value={health}
            onChange={(e) => setHealth(parseFloat(e.target.value))}
            className="w-full accent-stone-900 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-400">
            <span>0.00 (Düşük Yaşam Süresi)</span>
            <span>1.00 (Japonya / Singapur)</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-stone-800">4. Yaşam Tercihi Özgürlüğü</span>
            <span className="font-mono font-bold text-stone-950 tabular-nums">{freedom.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="0.7"
            step="0.02"
            value={freedom}
            onChange={(e) => setFreedom(parseFloat(e.target.value))}
            className="w-full accent-stone-900 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-400">
            <span>0.00 (Kısıtlayıcı Baskı)</span>
            <span>0.70 (Norveç / İsviçre)</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-stone-800">5. Yolsuzluğun Olmaması (Kurumsal Güven)</span>
            <span className="font-mono font-bold text-stone-950 tabular-nums">{trust.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="0.5"
            step="0.01"
            value={trust}
            onChange={(e) => setTrust(parseFloat(e.target.value))}
            className="w-full accent-stone-900 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-400">
            <span>0.00 (Rüşvet & Yozlaşma)</span>
            <span>0.50 (Singapur / İskandinavya)</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-stone-800">6. Cömertlik & Dayanışma</span>
            <span className="font-mono font-bold text-stone-950 tabular-nums">{generosity.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="0.9"
            step="0.02"
            value={generosity}
            onChange={(e) => setGenerosity(parseFloat(e.target.value))}
            className="w-full accent-stone-900 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-400">
            <span>0.00 (Sıfır Bağış)</span>
            <span>0.90 (Myanmar / Endonezya)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
