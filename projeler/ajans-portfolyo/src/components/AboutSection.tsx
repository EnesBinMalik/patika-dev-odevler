import React from 'react';
import { Layers, Code2, Server, Globe2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const milestones = [
    {
      year: 'Adım 01',
      title: 'PCAT Projesi — Fotoğraf & CRUD Temelleri',
      icon: Code2,
      desc: 'Node.js, Express ve veritabanı altyapısıyla fotoğrafların dinamik olarak yüklendiği, listelendiği, güncellendiği ve silindiği RESTful mimari temelleri atıldı.',
    },
    {
      year: 'Adım 02',
      title: 'SmartEdu Projesi — Eğitim Portalı & İletişim',
      icon: Layers,
      desc: 'Kurs yönetim sistemleri, dinamik şablon motoru ve iletişim formundan gelen iletilerin arka uçta işlendiği kurumsal mesajlaşma mimarisi tamamlandı.',
    },
    {
      year: 'Adım 03',
      title: 'Ajans Projesi — Enes Öztürk İmzalı Full-Stack',
      icon: Server,
      desc: 'Portföy galerisinin modern bileşenlerle dinamik hale getirildiği, modal yapıları ve zengin yönetim kontrolleriyle donatılmış profesyonel ajans ekosistemi.',
    },
    {
      year: 'Adım 04',
      title: 'Bulut Dağıtım — Heroku & GitHub Entegrasyonu',
      icon: Globe2,
      desc: 'Kod tabanının sürüm kontrolü altında GitHub depolarına aktarılması ve Heroku / Cloud Run bulut ortamlarında kesintisiz yayına alınma süreci.',
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 border-b border-neutral-800 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <p className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
              03. Hakkımızda & Mühendislik Vizyonu
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Gelişim Süreci & Mimari Altyapımız
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              Enes Öztürk Ajans olarak, dijital ürün geliştirme sürecini yalnızca tasarım olarak değil; sağlam bir arka uç, kesintisiz veri akışı ve esnek bir CRUD mimarisi olarak ele alıyoruz.
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              PCAT ve SmartEdu projelerimizden devraldığımız pratikler doğrultusunda, müşterilerimizin içeriklerini zahmetsizce güncelleyebileceği, yüksek performanslı ve buluta hazır web çözümleri üretiyoruz.
            </p>

            <div className="pt-4 border-t border-neutral-800/80">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-400 text-neutral-950 font-black text-base flex items-center justify-center">
                  EÖ
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Enes Öztürk</h4>
                  <p className="text-xs text-amber-400">Kurucu & Lead Full-Stack Architect</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Milestones Timeline */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              {milestones.map((m, index) => {
                const Icon = m.icon;
                return (
                  <div
                    key={index}
                    className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/80 hover:border-neutral-700 transition-all flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-neutral-800 text-amber-400 flex items-center justify-center shrink-0 border border-neutral-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold tracking-wide">
                        <span>{m.year}</span>
                        <span aria-hidden="true">·</span>
                        <span>Mühendislik Aşaması</span>
                      </div>
                      <h3 className="text-base font-bold text-white">{m.title}</h3>
                      <p className="text-xs text-neutral-300 leading-relaxed pt-1">{m.desc}</p>
                    </div>
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
