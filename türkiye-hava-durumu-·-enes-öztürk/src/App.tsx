import { useState, useEffect, useCallback } from 'react';
import { TURKEY_CITIES, TurkeyCity, findClosestCity } from './data/cities';
import { DailyForecast, WeatherData } from './types/weather';
import { fetchWeatherData } from './services/weatherService';
import { CitySelector } from './components/CitySelector';
import { DayCard } from './components/DayCard';
import { HeroWeather } from './components/HeroWeather';
import { TurkeyOverviewModal } from './components/TurkeyOverviewModal';
import {
  CloudSun,
  MapPin,
  Compass,
  AlertCircle,
  ExternalLink,
  Layers,
  Calendar,
  CloudRain,
  Sun,
  Wind,
} from 'lucide-react';

export default function App() {
  // Varsayılan olarak İstanbul (34) veya Kayseri (38)
  const [selectedCity, setSelectedCity] = useState<TurkeyCity>(() => {
    return TURKEY_CITIES.find((c) => c.id === '34') || TURKEY_CITIES[0];
  });

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);

  // Hava durumu verilerini getirme
  const loadWeather = useCallback(async (city: TurkeyCity) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await fetchWeatherData(city);
      setWeatherData(data);
      setSelectedDayIndex(0); // Şehir değiştiğinde varsayılan olarak "Bugün" seçilir
    } catch (err) {
      console.error('Weather load error:', err);
      setErrorMsg('Hava durumu verisi alınırken bir sorun oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // İlk açılışta ve şehir değiştikçe hava verilerini yükle
  useEffect(() => {
    loadWeather(selectedCity);
  }, [selectedCity, loadWeather]);

  // Kullanıcının Coğrafi Konumunu İsteme
  const handleRequestGeolocation = () => {
    if (!navigator.geolocation) {
      setLocationNotice('Tarayıcınız konum servisini desteklemiyor.');
      return;
    }

    setIsLocating(true);
    setLocationNotice(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        const closest = findClosestCity(latitude, longitude);
        setSelectedCity(closest);
        setLocationNotice(`Konumunuz tespit edildi: En yakın il ${closest.name} (${closest.id})`);
        setTimeout(() => setLocationNotice(null), 5000);
      },
      (error) => {
        setIsLocating(false);
        console.warn('Geolocation error:', error);
        let msg = 'Konum erişimine izin verilmedi veya tespit edilemedi.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Konum izni verilmedi. Listeden dilediğiniz ili seçebilirsiniz.';
        }
        setLocationNotice(msg);
        setTimeout(() => setLocationNotice(null), 5000);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const selectedDay: DailyForecast | null =
    weatherData && weatherData.daily[selectedDayIndex]
      ? weatherData.daily[selectedDayIndex]
      : null;

  // Dinamik arkaplan teması (seçili hava durumuna göre yumuşak atmosferik renkler)
  const getAtmosphericGlow = () => {
    if (!selectedDay) return 'from-slate-950 via-slate-900 to-slate-950';
    const type = selectedDay.weatherInfo.iconType;
    if (type === 'clear-day') return 'from-amber-950/30 via-slate-950 to-slate-950';
    if (type.includes('rain')) return 'from-sky-950/40 via-slate-950 to-slate-950';
    if (type.includes('snow')) return 'from-cyan-950/30 via-slate-950 to-slate-950';
    if (type === 'thunderstorm') return 'from-purple-950/40 via-slate-950 to-slate-950';
    return 'from-slate-900/60 via-slate-950 to-slate-950';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${getAtmosphericGlow()} text-slate-100 flex flex-col selection:bg-sky-500/30 selection:text-sky-200 transition-colors duration-700`}>
      {/* 1. TOP BAR CONTRACT: Brand — 4 Nav Links — 1 Primary Action */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="/"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
          >
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-sky-500/20">
              <CloudSun className="w-5 h-5 text-slate-950" />
            </span>
            <span>Hava Durumu Türkiye</span>
          </a>

          {/* Zone 2: 4 Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <button
              type="button"
              onClick={() => setSelectedDayIndex(0)}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedDayIndex === 0 ? 'text-sky-400 font-semibold' : ''
              }`}
            >
              Bugünkü Durum
            </button>
            <a
              href="#haftalik-tahmin"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              7 Günlük Rapor
            </a>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              81 İl Rehberi
            </button>
            <a
              href="#meteoroloji-analiz"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Meteorolojik Analiz
            </a>
          </nav>

          {/* Zone 3: 1 Primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span>İl Değiştir</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. ANA İÇERİK ALANI */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 flex flex-col gap-8">
        {/* Bildirim Çubuğu (Konum veya Bilgi) */}
        {locationNotice && (
          <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-200 text-xs sm:text-sm flex items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{locationNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setLocationNotice(null)}
              className="text-xs font-bold text-sky-400 hover:text-sky-100"
            >
              Kapat
            </button>
          </div>
        )}

        {/* Hata Durumu */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Şehir Seçim Çubuğu & Dropdown */}
        <section aria-label="Şehir Seçimi" className="w-full">
          <CitySelector
            currentCity={selectedCity}
            onSelectCity={(city) => setSelectedCity(city)}
            onRequestGeolocation={handleRequestGeolocation}
            isLocating={isLocating}
          />
        </section>

        {/* Seçili Şehir ve Günün Detaylı Spotlight Görünümü (Hero Weather) */}
        {weatherData && selectedDay && (
          <section aria-label="Seçili Gün Raporu" className="w-full">
            <HeroWeather
              city={selectedCity}
              current={weatherData.current}
              selectedDay={selectedDay}
              isToday={selectedDayIndex === 0}
              hourly={weatherData.hourly}
              unit={unit}
              onToggleUnit={() => setUnit(unit === 'C' ? 'F' : 'C')}
              onRefresh={() => loadWeather(selectedCity)}
              isLoading={isLoading}
            />
          </section>
        )}

        {/* Yükleniyor İskeleti */}
        {isLoading && !weatherData && (
          <div className="w-full h-80 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse flex flex-col items-center justify-center gap-3 text-slate-400">
            <CloudSun className="w-10 h-10 text-sky-400 animate-bounce" />
            <span className="text-sm">
              {selectedCity.name} için gerçek zamanlı meteoroloji verileri alınıyor...
            </span>
          </div>
        )}

        {/* 3. 7 GÜNLÜK HAVA TAHMİN KARTLARI (Gereksinim Odaklı) */}
        <section id="haftalik-tahmin" aria-label="7 Günlük Hava Tahmini" className="w-full flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-400" />
                7 Günlük Hava Durumu Tahmini
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Bugünden başlayarak önümüzdeki bir haftalık süreci kapsayan detaylı meteoroloji kartları. İncelemek istediğiniz güne tıklayın.
              </p>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span>Seçili Gün: <strong>{selectedDay?.dayName}</strong></span>
            </div>
          </div>

          {/* 7 Günlük Kart Grubu */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
            {weatherData?.daily.map((day, idx) => (
              <DayCard
                key={day.date}
                day={day}
                isSelected={selectedDayIndex === idx}
                isToday={idx === 0}
                unit={unit}
                onClick={() => setSelectedDayIndex(idx)}
              />
            ))}
          </div>
        </section>

        {/* 4. METEOROLOJİK ANALİZ & YAŞAM İPUÇLARI BÖLÜMÜ */}
        <section
          id="meteoroloji-analiz"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
        >
          {/* Kart 1: Bölgesel İklim Özelliği */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center gap-2.5 text-sky-400 mb-2">
              <Layers className="w-4 h-4" />
              <h3 className="text-sm font-bold text-white">
                {selectedCity.region} İklim Karakteristiği
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedCity.name}, {selectedCity.region} Bölgesi&apos;nde yer almakta olup deniz seviyesinden yüksekliği ve coğrafi konumu sebebiyle mikroklimal faktörler taşır.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
              <span>Koordinatlar:</span>
              <span className="font-mono text-slate-300">
                {selectedCity.latitude.toFixed(2)}° K, {selectedCity.longitude.toFixed(2)}° D
              </span>
            </div>
          </div>

          {/* Kart 2: Yağış & Nem Değerlendirmesi */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center gap-2.5 text-cyan-400 mb-2">
              <CloudRain className="w-4 h-4" />
              <h3 className="text-sm font-bold text-white">
                Haftalık Yağış Dengesi
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Önümüzdeki 7 gün içerisinde beklenen en yüksek yağış ihtimali %
              {Math.max(...(weatherData?.daily.map((d) => d.precipitationProbability) || [0]))} seviyesindedir. Su tasarrufu ve tarımsal verimlilik için takip edilmektedir.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
              <span>Haftalık Yağış Toplamı:</span>
              <span className="font-mono text-slate-300">
                {(weatherData?.daily.reduce((acc, cur) => acc + cur.precipitationSum, 0) || 0).toFixed(1)} mm
              </span>
            </div>
          </div>

          {/* Kart 3: El Emeği Enes Öztürk Özel Teşekkür & İmza */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40 border border-sky-500/30 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center gap-2.5 text-amber-300 mb-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                Enes Öztürk İmzalı Tasarım
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Türkiye&apos;nin 81 ili için hazırlanan bu el emeği meteoroloji paneli, kullanıcı dostu arayüzü, canlı WMO verileri ve akıcı görselleştirmesi ile en üst düzey standartlarda geliştirilmiştir.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="text-sky-300 font-semibold">Özel Sürüm</span>
              <span className="font-mono text-slate-400">81 İl · Tam Kapsam</span>
            </div>
          </div>
        </section>
      </main>

      {/* 5. FOOTER & ENES ÖZTÜRK İMZASI */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950/90 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>Türkiye Meteoroloji ve Hava Durumu Platformu</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300 font-semibold">Enes Öztürk İmzalı</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Gerçek Zamanlı Açık Kaynak API</span>
            <span aria-hidden="true">·</span>
            <span>81 İl Kapsamı</span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>İller Rehberi</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </footer>

      {/* 81 İl Seçim Rehberi Modalı */}
      <TurkeyOverviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentCity={selectedCity}
        onSelectCity={(city) => setSelectedCity(city)}
      />
    </div>
  );
}
