import React from 'react';
import { Layout, Palette, Smartphone, Terminal } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const services = [
    {
      number: '01',
      title: 'Web Tasarım & Full-Stack Mühendislik',
      icon: Layout,
      description:
        'Yüksek performanslı, SEO dostu ve dönüşüm odaklı web siteleri inşa ediyoruz. Node.js, Express ve modern React altyapısıyla ölçeklenebilir dijital çözümler üretiyoruz.',
      tags: ['React 19', 'Next.js / Vite', 'Node.js', 'REST API', 'Tailwind CSS'],
    },
    {
      number: '02',
      title: 'Kurumsal Kimlik & Marka Tasarımı',
      icon: Palette,
      description:
        'Markanızın özgün hikayesini ve pazar değerini yansıtan zamansız görsel kimlik sistemleri kurguluyoruz. Logo tasarımı, tipografi seçimi ve ambalaj rehberleri hazırlıyoruz.',
      tags: ['Marka Stratejisi', 'Logo Tasarımı', 'Tipografi Rehberi', 'Baskı & Dijital Kimlik'],
    },
    {
      number: '03',
      title: 'Mobil Uygulama & UI/UX Tasarımı',
      icon: Smartphone,
      description:
        'Kullanıcı alışkanlıklarını ve sezgisel gezinmeyi ön plana alan modern mobil arayüzler. iOS ve Android ekosistemine tam uyumlu, akıcı mikro-etkileşimli tasarımlar.',
      tags: ['Figma Prototipleme', 'iOS & Android', 'Design Systems', 'Kullanıcı Testleri'],
    },
    {
      number: '04',
      title: 'Dinamik CMS & Portföy CRUD Altyapısı',
      icon: Terminal,
      description:
        'PCAT ve SmartEdu projelerinde edindiğimiz mimari derinlik ile içeriklerinizi kod yazmadan yönetebileceğiniz dinamik yönetim panelleri ve API servisleri kuruyoruz.',
      tags: ['CRUD İşlemleri', 'Dosya / Görsel Yönetimi', 'MongoDB / SQL', 'Heroku Dağıtım'],
    },
  ];

  return (
    <section id="services" className="py-20 lg:py-28 border-b border-neutral-800 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-xs font-semibold text-amber-400 tracking-wider uppercase mb-2">
            01. Hizmetlerimiz
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Uçtan Uca Dijital Çözümler & Yazılım Mühendisliği
          </h2>
          <p className="mt-4 text-base text-neutral-400 leading-relaxed">
            Stratejik planlamadan arayüz tasarımına, arka uç API servislerinden bulut dağıtımına kadar her aşamada profesyonel standartlar uyguluyoruz.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.number}
                className="group p-8 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/80 hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-mono text-neutral-400 font-bold">
                      {service.number}.
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-neutral-800/80 group-hover:bg-amber-400/10 group-hover:text-amber-400 text-neutral-300 flex items-center justify-center transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                {/* Quiet unboxed metadata */}
                <div className="pt-4 border-t border-neutral-800/80 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-400">
                  {service.tags.map((tag, idx) => (
                    <React.Fragment key={tag}>
                      <span>{tag}</span>
                      {idx < service.tags.length - 1 && <span aria-hidden="true">·</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
