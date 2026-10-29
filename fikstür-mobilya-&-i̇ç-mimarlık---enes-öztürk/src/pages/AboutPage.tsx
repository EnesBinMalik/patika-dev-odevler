import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, Compass, Heart, ShieldCheck, Terminal, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AboutPageProps {
  onOpenDeployGuide: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenDeployGuide }) => {
  const { setActivePage } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Header Banner */}
      <div className="max-w-3xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800">
          <span>Hakkımızda</span>
          <span aria-hidden="true">·</span>
          <span>Enes Öztürk Mimarlık & Tasarım Stüdyosu</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 font-display tracking-tight leading-tight">
          Mekanın Ruhu, Malzemenin Doğallığı ve Zanaatın Dengesi.
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Fikstür projesi; yaşam alanlarını salt eşyalarla doldurmak yerine, mekana kimlik katan heykelsi ve dayanıklı mimari fikstürler üretmek amacıyla Enes Öztürk tarafından hayata geçirilmiştir.
        </p>
      </div>

      {/* Hero Visual & Manifesto Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7">
          <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-lg aspect-16/10">
            <img
              src="/src/assets/images/hero_furniture_showcase_1793204897342.jpg"
              alt="Fikstür Mimarlık Atölyesi"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-5 bg-white p-8 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
            Kurucu Notu
          </span>
          <h2 className="text-2xl font-bold text-stone-900 font-display">
            "İyi bir tasarım, zamana meydan okuyan sessiz bir varlıktır."
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Fikstür mobilyalarında endüstriyel fabrikasyonun mekanik soğukluğunu reddediyoruz. Her masa tablasının kenarı, her berjer koltuğunun eğimi ve her pirinç avizenin ağırlık noktası atölyemizde mimari hassasiyetle hesaplanır.
          </p>
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-stone-900 font-display">Enes Öztürk</p>
              <p className="text-xs text-stone-500">Mimar & Fikstür Tasarımcısı</p>
            </div>
            <div className="text-xs text-amber-800 font-medium px-2.5 py-1 bg-amber-50 rounded-md border border-amber-200/50">
              İstanbul, Moda
            </div>
          </div>
        </div>
      </div>

      {/* SmartEdu & PCAT Pedagojik Bağlamı */}
      <div className="p-8 bg-stone-100/90 rounded-2xl border border-stone-200 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-700">
          <Terminal className="w-4 h-4 text-stone-900" />
          <span>SmartEdu & PCAT Metodolojisi</span>
        </div>
        <h3 className="text-xl font-bold text-stone-900 font-display">
          Modern Web & Rol Tabanlı Yönetim Mimarisi
        </h3>
        <p className="text-xs text-stone-600 leading-relaxed max-w-3xl">
          Tıpkı <strong>SmartEdu</strong> eğitim projesindeki çok katmanlı yapı (Kullanıcılar, Kurslar/Mobilyalar, Kategoriler, İletişim Formları ve Admin CRUD Paneli) ve <strong>PCAT</strong> projesindeki fotoğraf ve detay işleyişinde olduğu gibi; bu uygulama da temiz modüler mimari, kullanıcı yetki kontrolleri (Misafir / Üye / Admin) ve canlı durum takibi ile inşa edilmiştir.
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={onOpenDeployGuide}
            className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>GitHub & Heroku Kurulum Kılavuzunu Gör</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActivePage('furnitures')}
            className="px-4 py-2 bg-white text-stone-800 border border-stone-300 text-xs font-semibold rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
          >
            Mobilyaları İncele
          </button>
        </div>
      </div>

      {/* 4 Pillars of Craftsmanship */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            İlkelerimiz
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display mt-1">
            Üretim ve Tasarım Standartlarımız
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-xl border border-stone-200 space-y-3">
            <Award className="w-6 h-6 text-stone-900" />
            <h3 className="text-base font-bold text-stone-900 font-display">1. Masif & Hakiki Doku</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              MDF üzeri sentetik kaplama yerine hakiki ceviz, dişbudak ve meşe masif gövdeler kullanılır.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-stone-200 space-y-3">
            <Compass className="w-6 h-6 text-stone-900" />
            <h3 className="text-base font-bold text-stone-900 font-display">2. Mimari Ergonomi</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Konfor ve omurga sağlığını korurken hacim kaplamayan zarif ve akışkan hatlar.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-stone-200 space-y-3">
            <Heart className="w-6 h-6 text-stone-900" />
            <h3 className="text-base font-bold text-stone-900 font-display">3. Sürdürülebilir Ömür</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Kuşaktan kuşağa aktarılacak yapısal dayanıklılık ve yenilenebilir doğal yağ kaplamaları.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-stone-200 space-y-3">
            <ShieldCheck className="w-6 h-6 text-stone-900" />
            <h3 className="text-base font-bold text-stone-900 font-display">4. Şeffaf Rezervasyon</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Üyeler için stok güvencesi, doğrudan atölye randevusu ve kişiselleştirilmiş teslimat süreci.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
