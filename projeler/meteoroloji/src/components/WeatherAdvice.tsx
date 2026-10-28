import React from 'react';
import { Sparkles, Umbrella, Shirt, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

export const WeatherAdvice: React.FC = () => {
  const { weatherData, loading, selectedCity } = useWeather();

  if (loading || !weatherData) return null;

  const { current, daily } = weatherData;
  const today = daily[0];

  // Dynamic advice generator based on real metrics
  const advices: { icon: React.ReactNode; title: string; desc: string }[] = [];

  // Clothing advice
  if (current.temperature < 5) {
    advices.push({
      icon: <Shirt className="w-4 h-4 text-sky-400" />,
      title: 'Kalın Giyinin',
      desc: 'Hava oldukça soğuk. Mont, atkı, eldiven ve termal giysiler tercih edilmelidir.',
    });
  } else if (current.temperature < 15) {
    advices.push({
      icon: <Shirt className="w-4 h-4 text-blue-400" />,
      title: 'Mevsimlik Ceket',
      desc: 'Serin hava şartları hakim. Hafif bir ceket veya hırka almanız tavsiye edilir.',
    });
  } else if (current.temperature < 25) {
    advices.push({
      icon: <Shirt className="w-4 h-4 text-emerald-400" />,
      title: 'Konforlu Hava',
      desc: 'Ilıman ve keyifli bir gün. Pamuklu ve rahat kıyafetler için ideal.',
    });
  } else {
    advices.push({
      icon: <Shirt className="w-4 h-4 text-amber-400" />,
      title: 'İnce ve Nefes Alan Kumaşlar',
      desc: 'Sıcak hava etkili. Bol sıvı tüketmeli ve doğrudan güneş altında uzun kalmamalısınız.',
    });
  }

  // Precipitation advice
  if (today.precipitationProbability > 40 || current.precipitation > 0) {
    advices.push({
      icon: <Umbrella className="w-4 h-4 text-blue-400" />,
      title: 'Şemsiyenizi Unutmayın',
      desc: `%${today.precipitationProbability} ihtimalle yağış bekleniyor. Yağmurluk veya şemsiye hazır bulundurun.`,
    });
  } else {
    advices.push({
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      title: 'Dış Mekan Uygunluğu',
      desc: 'Önemli bir yağış riski görünmüyor, açık hava yürüyüşleri ve aktiviteler için elverişli.',
    });
  }

  // Wind or UV advice
  if (current.windSpeed > 30) {
    advices.push({
      icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
      title: 'Kuvvetli Rüzgar Uyarısı',
      desc: `Rüzgar hızı ${Math.round(current.windSpeed)} km/s seviyesine ulaşıyor. Dikkatli olunmalıdır.`,
    });
  } else if (today.uvIndexMax >= 6) {
    advices.push({
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      title: 'Güneş Koruması',
      desc: `UV indeksi ${today.uvIndexMax} seviyesinde. Güneş kremi ve gözlük kullanımı önerilir.`,
    });
  }

  return (
    <div className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-sky-400" />
        <h3 className="text-sm font-bold text-white tracking-tight">
          {selectedCity.name} İçin Günün Meteorolojik Tavsiyeleri
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {advices.map((adv, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50"
          >
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 shrink-0">
              {adv.icon}
            </div>
            <div>
              <h4 className="text-xs font-bold text-white tracking-tight">{adv.title}</h4>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{adv.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
