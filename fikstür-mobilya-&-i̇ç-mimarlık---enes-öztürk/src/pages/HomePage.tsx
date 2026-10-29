import React from 'react';
import { useApp } from '../context/AppContext';
import { FurnitureCard } from '../components/FurnitureCard';
import { Category } from '../types';
import { ArrowRight, Compass, ShieldCheck, Sparkles, Award, Box, Users } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { furnitures, setActivePage, setSelectedCategory } = useApp();

  const featuredFurnitures = furnitures.filter(f => f.featured).slice(0, 4);

  const categories: { label: Category; desc: string }[] = [
    { label: 'Salon', desc: 'Heykelsi berjerler ve modüler oturma grupları' },
    { label: 'Yemek Odası', desc: 'Masif ceviz masalar ve el yapımı sandalyeler' },
    { label: 'Aydınlatma', desc: 'Pirinç ve mat opal mimari avizeler' },
    { label: 'Çalışma & Ofis', desc: 'Dingin odak ve ergonomik ahşap masalar' }
  ];

  const handleCategoryClick = (cat: Category) => {
    setSelectedCategory(cat);
    setActivePage('furnitures');
  };

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-stone-100 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Typography & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800">
              <span>SmartEdu & Mimari Koleksiyon</span>
              <span aria-hidden="true">·</span>
              <span>Enes Öztürk İmzasıyla</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight leading-[1.1] font-display text-balance">
              Yaşam Alanları İçin Heykelsi Formlar ve Zamansız Fikstürler.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
              Doğal masif ceviz, fırçalanmış pirinç ve dokuma bouclé kumaşların mimari dengesi. Ziyaretçiler için keşif, üyeler için anında rezervasyon ve yöneticiler için eksiksiz kontrol paneli.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  setSelectedCategory('Tümü');
                  setActivePage('furnitures');
                }}
                className="px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Mobilyaları Keşfet</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActivePage('about')}
                className="px-6 py-3.5 bg-white hover:bg-stone-50 text-stone-800 text-sm font-semibold rounded-xl border border-stone-200 transition-all cursor-pointer"
              >
                Tasarım Hikayesi
              </button>
            </div>

            <div className="pt-6 border-t border-stone-200/80 flex items-center gap-8 text-xs text-stone-500">
              <div>
                <span className="block font-bold text-stone-900 font-mono text-base tabular-nums">400+</span>
                <span>Tamamlanan Mekan</span>
              </div>
              <div className="w-px h-8 bg-stone-300"></div>
              <div>
                <span className="block font-bold text-stone-900 font-mono text-base tabular-nums">1.200+</span>
                <span>Özgün Fikstür</span>
              </div>
              <div className="w-px h-8 bg-stone-300"></div>
              <div>
                <span className="block font-bold text-stone-900 font-mono text-base tabular-nums">14</span>
                <span>Tasarım Ödülü</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-stone-200 aspect-16/10 group">
              <img
                src="/src/assets/images/hero_furniture_showcase_1793204897342.jpg"
                alt="Fikstür Mimarlık Yaşam Alanı Tasarımı"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-stone-900/85 backdrop-blur-md p-4 rounded-xl text-white flex items-center justify-between border border-white/10">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-amber-400 font-medium">
                    2025 Yaşam Alanı Enstalasyonu
                  </span>
                  <p className="text-xs font-semibold text-stone-100">
                    Kobenhavn Berjer & Valen Ahşap Sehpa Kompozisyonu
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory('Salon');
                    setActivePage('furnitures');
                  }}
                  className="px-3 py-1.5 bg-white text-stone-950 text-xs font-semibold rounded-lg hover:bg-stone-200 transition-colors shrink-0 cursor-pointer"
                >
                  İncele
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Koleksiyonlar
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display mt-1">
              Kategorilere Göre Yaşam Hacimleri
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('Tümü');
              setActivePage('furnitures');
            }}
            className="text-xs font-semibold text-stone-700 hover:text-stone-950 flex items-center gap-1 cursor-pointer"
          >
            <span>Tüm Koleksiyonu Gör</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.label}
              onClick={() => handleCategoryClick(cat.label)}
              className="group p-6 bg-white rounded-xl border border-stone-200 hover:border-stone-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <h3 className="text-base font-bold text-stone-900 font-display group-hover:text-amber-800 transition-colors">
                  {cat.label}
                </h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  {cat.desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-medium text-stone-700 group-hover:text-stone-950">
                <span>Ürünleri Listele</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Furnitures Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Seçkiler
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display mt-1">
              Öne Çıkan Fikstür ve Mobilyalar
            </h2>
          </div>
          <p className="text-xs text-stone-500 max-w-sm">
            Atölyemizde sınırlı adetlerde imal edilen, üyelerimizin anında rezerve edebildiği mimari parçalar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredFurnitures.map((f) => (
            <FurnitureCard key={f.id} furniture={f} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => {
              setSelectedCategory('Tümü');
              setActivePage('furnitures');
            }}
            className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Tüm Mobilya Kataloğuna Git ({furnitures.length} Ürün)
          </button>
        </div>
      </section>

      {/* Architectural Philosophy Section (Enes Öztürk) */}
      <section className="bg-stone-100/80 border-y border-stone-200 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Tasarım Felsefesi & İmzası
            </span>
            <h2 className="text-3xl font-bold text-stone-900 font-display">
              "Bir mobilya sadece oturulan nesne değil, mekanın hacmini terbiye eden fikstürdür."
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Fikstür projesinde, SmartEdu mimari disiplinini mobilya dünyasına uyarladık. Ziyaretçilerin özgürce inceleyebildiği, üyelerin projelerine özel olarak rezerve edebildiği ve atölye yöneticimizin her adımı denetleyebildiği şeffaf bir platform kurguladık.
            </p>
            <div className="pt-2">
              <p className="text-sm font-bold text-stone-900">Enes Öztürk</p>
              <p className="text-xs text-stone-500">Kurucu & Baş Mimar, Fikstür Proje</p>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-2">
              <Award className="w-5 h-5 text-amber-800" />
              <h3 className="text-sm font-bold text-stone-900 font-display">Sertifikalı Masif Ağaç</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Kullandığımız ceviz, meşe ve dişbudak ağaçları sürdürülebilir orman yönetim ilkelerine sahip sertifikalı kaynaklardan temin edilir.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-2">
              <Compass className="w-5 h-5 text-amber-800" />
              <h3 className="text-sm font-bold text-stone-900 font-display">Mimari Oran & Denge</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Her fikstür, insan ergonomisi ile mekan akustiği ve ışık kırılımlarını göz önüne alan matematiksel oranlarla çizilir.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-2">
              <Box className="w-5 h-5 text-amber-800" />
              <h3 className="text-sm font-bold text-stone-900 font-display">Zanaatkâr El İşçiliği</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Seri bant üretimi yerine geleneksel geçme yöntemleri ve elle uygulanan doğal organik yağ cilaları tercih edilir.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-2">
              <ShieldCheck className="w-5 h-5 text-amber-800" />
              <h3 className="text-sm font-bold text-stone-900 font-display">Rol Tabanlı Güvence</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Üyelerimiz stoktan anında adlarına rezervasyon oluşturabilir, teslimat gününü kendileri belirleyebilir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            Referanslar & Görüşler
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display mt-1">
            Mekan Sahiplerinin Deneyimleri
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl border border-stone-200 space-y-4">
            <p className="text-xs text-stone-600 leading-relaxed italic">
              "Kobenhavn Berjer modelini Alaçatı'daki butik otelimizin lobisi için rezerve ettik. Kumaş dokusu ve ahşap işçiliği fotoğraflarda göründüğünden bile daha etkileyici."
            </p>
            <div className="pt-2 border-t border-stone-100">
              <p className="text-xs font-bold text-stone-900">Mimar Deniz Çetin</p>
              <p className="text-[11px] text-stone-400">Çetin Mimarlık & İç Mekan, İzmir</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl border border-stone-200 space-y-4">
            <p className="text-xs text-stone-600 leading-relaxed italic">
              "Aras masif ceviz masayı 8 kişilik toplantı ve yemek odamız için seçtik. Enes Bey'in tasarım detaylarındaki titizliği ve rezervasyon takip hızı harikaydı."
            </p>
            <div className="pt-2 border-t border-stone-100">
              <p className="text-xs font-bold text-stone-900">Dr. Tarık Soylu</p>
              <p className="text-[11px] text-stone-400">Özel Klinik Yöneticisi, İstanbul</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl border border-stone-200 space-y-4">
            <p className="text-xs text-stone-600 leading-relaxed italic">
              "Üyelik panelinden rezervasyon oluşturup teslimat tarihini belirlemek çok pratik. Fikstür ekibi teslimatta montajı eksiksiz gerçekleştirdi."
            </p>
            <div className="pt-2 border-t border-stone-100">
              <p className="text-xs font-bold text-stone-900">Zeynep Kaya</p>
              <p className="text-[11px] text-stone-400">Koleksiyoner, Ankara</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 rounded-2xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-bold font-display">
              Özel Mekanınız İçin Bir Fikstür Rezerve Edin
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed">
              Hemen ücretsiz üye olarak beğendiğiniz mobilyaları ayırtabilir veya doğrudan Enes Öztürk ve atölye ekibimizle özel ölçü taleplerinizi paylaşabilirsiniz.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActivePage('register')}
              className="px-5 py-3 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer"
            >
              Hemen Üye Ol
            </button>
            <button
              onClick={() => setActivePage('contact')}
              className="px-5 py-3 text-xs font-medium text-white border border-stone-700 hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
            >
              Bize Ulaşın
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
