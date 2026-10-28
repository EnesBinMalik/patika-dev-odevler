import React, { useState, useEffect } from 'react';
import { X, Upload, Check, AlertCircle, Eye, Sparkles } from 'lucide-react';
import { PortfolioItem, PortfolioCategory } from '../types';

interface AddEditProjectModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialData: PortfolioItem | null;
  onClose: () => void;
  onSave: (item: PortfolioItem) => void;
}

const PRESET_IMAGES = [
  {
    label: 'Kurumsal Web Ekranı',
    url: '/assets/images/agency_portfolio_web_1793201690131.jpg',
  },
  {
    label: 'Marka & Ambalaj Mockup',
    url: '/assets/images/agency_portfolio_branding_1793201690346.jpg',
  },
  {
    label: 'Fintech Mobil Arayüz',
    url: '/assets/images/agency_portfolio_mobile_1793201690373.jpg',
  },
  {
    label: 'Ajans Galata Stüdyosu',
    url: '/assets/images/agency_hero_studio_1793201689310.jpg',
  },
];

const CATEGORIES: Exclude<PortfolioCategory, 'Tümü'>[] = [
  'Web Tasarım',
  'Branding',
  'Mobil Uygulama',
  'Grafik Tasarım',
  'Yazılım & API',
];

export const AddEditProjectModal: React.FC<AddEditProjectModalProps> = ({
  isOpen,
  mode,
  initialData,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<Exclude<PortfolioCategory, 'Tümü'>>('Web Tasarım');
  const [imageUrl, setImageUrl] = useState('');
  const [client, setClient] = useState('');
  const [date, setDate] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [description, setDescription] = useState('');
  const [techInput, setTechInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewTab, setPreviewTab] = useState(false);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setTitle(initialData.title);
      setSubtitle(initialData.subtitle);
      setCategory(initialData.category);
      setImageUrl(initialData.imageUrl);
      setClient(initialData.client);
      setDate(initialData.date);
      setProjectUrl(initialData.projectUrl || '');
      setDescription(initialData.description);
      setTechInput(initialData.technologies ? initialData.technologies.join(', ') : '');
    } else {
      // Default initial state for ADD
      setTitle('');
      setSubtitle('');
      setCategory('Web Tasarım');
      setImageUrl(PRESET_IMAGES[0].url);
      setClient('');
      setDate(new Date().toISOString().split('T')[0]);
      setProjectUrl('');
      setDescription('');
      setTechInput('React, Tailwind CSS, Node.js');
    }
    setErrors({});
    setPreviewTab(false);
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: 'Görsel boyutu 5MB altında olmalıdır.' }));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
          setErrors((prev) => {
            const next = { ...prev };
            delete next.image;
            return next;
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Proje başlığı zorunludur.';
    if (!subtitle.trim()) newErrors.subtitle = 'Alt başlık zorunludur.';
    if (!client.trim()) newErrors.client = 'Müşteri adı zorunludur.';
    if (!imageUrl.trim()) newErrors.image = 'Lütfen bir görsel seçin veya URL girin.';
    if (!description.trim() || description.length < 20) {
      newErrors.description = 'Detaylı açıklama en az 20 karakter olmalıdır (PCAT formatı).';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const techs = techInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newItem: PortfolioItem = {
      id: mode === 'edit' && initialData ? initialData.id : `proj-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim(),
      category,
      imageUrl: imageUrl.trim(),
      client: client.trim(),
      date: date || new Date().toISOString().split('T')[0],
      projectUrl: projectUrl.trim() || undefined,
      description: description.trim(),
      technologies: techs.length > 0 ? techs : ['Full-Stack', 'Modern Web'],
      featured: mode === 'edit' && initialData ? initialData.featured : false,
      createdAt:
        mode === 'edit' && initialData
          ? initialData.createdAt
          : new Date().toISOString(),
    };

    onSave(newItem);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl my-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/90 sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <span>{mode === 'add' ? 'ADD Formu' : 'EDIT Formu'}</span>
              <span aria-hidden="true">·</span>
              <span>PCAT Dinamik Portföy CRUD</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              {mode === 'add' ? 'Yeni Portföy Projesi Ekle' : 'Portföy Projesini Düzenle'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewTab(!previewTab)}
              className="px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 rounded-lg flex items-center gap-1.5 border border-neutral-700 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>{previewTab ? 'Forma Dön' : 'Önizleme'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {previewTab ? (
            /* Live Preview View */
            <div className="space-y-4">
              <p className="text-xs text-neutral-400 font-medium">
                Bu proje kaydedildiğinde portföy galerisinde şu şekilde görüntülenecektir:
              </p>
              <div className="max-w-md mx-auto rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 p-4 space-y-3">
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-neutral-900">
                  <img
                    src={imageUrl || PRESET_IMAGES[0].url}
                    alt={title || 'Proje Önizleme'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <span className="text-amber-400 font-semibold">{category}</span>
                    <span>·</span>
                    <span>{client || 'Müşteri Adı'}</span>
                    <span>·</span>
                    <span>{date || '2026'}</span>
                  </div>
                  <h4 className="text-lg font-bold text-white">{title || 'Proje Başlığı'}</h4>
                  <p className="text-xs text-neutral-300">{subtitle || 'Alt başlık ve açıklama...'}</p>
                </div>
                <p className="text-xs text-neutral-400 line-clamp-2">
                  {description || 'Detaylı proje açıklaması burada listelenir.'}
                </p>
              </div>
            </div>
          ) : (
            /* Form view */
            <form id="portfolio-crud-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Presets and Image selection */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Proje Görseli Seçimi (Preset veya Özel URL / Yükleme)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {PRESET_IMAGES.map((img) => (
                    <button
                      type="button"
                      key={img.url}
                      onClick={() => {
                        setImageUrl(img.url);
                        setErrors((prev) => {
                          const n = { ...prev };
                          delete n.image;
                          return n;
                        });
                      }}
                      className={`relative rounded-xl overflow-hidden border p-1 text-left transition-all cursor-pointer ${
                        imageUrl === img.url
                          ? 'border-amber-400 ring-2 ring-amber-400/20 bg-neutral-800'
                          : 'border-neutral-800 hover:border-neutral-700 bg-neutral-950'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.label}
                        className="w-full h-16 object-cover rounded-lg mb-1"
                      />
                      <span className="text-[11px] font-medium text-neutral-300 line-clamp-1">
                        {img.label}
                      </span>
                      {imageUrl === img.url && (
                        <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Custom URL & File upload row */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
                  <div className="sm:col-span-8">
                    <input
                      type="text"
                      placeholder="veya doğrudan görsel URL'si girin (https://...)"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>Bilgisayardan Yükle</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                {errors.image && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.image}
                  </p>
                )}
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Proje Başlığı *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Galata Finans Mobil Arayüzü"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                  {errors.title && (
                    <p className="text-xs text-red-400 mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Alt Başlık / Kısa Tanım *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Yeni Nesil Varlık & Portföy Yönetimi"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                  {errors.subtitle && (
                    <p className="text-xs text-red-400 mt-1">{errors.subtitle}</p>
                  )}
                </div>
              </div>

              {/* Category, Client, Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Kategori *
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as Exclude<PortfolioCategory, 'Tümü'>)
                    }
                    className="w-full px-3 py-2.5 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Müşteri / Kurum *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: FinTech Labs İstanbul"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                  {errors.client && (
                    <p className="text-xs text-red-400 mt-1">{errors.client}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Tamamlanma Tarihi
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Project Live Link & Tech stack */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Canlı Proje Linki (İsteğe bağlı)
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={projectUrl}
                    onChange={(e) => setProjectUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Kullanılan Teknolojiler (Virgülle ayırın)
                  </label>
                  <input
                    type="text"
                    placeholder="React, TypeScript, Tailwind, Node.js"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Detailed Description (PCAT style) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Detaylı Proje Hikayesi & Açıklama (PCAT Kapsamı) *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Projenin amacı, karşılaşılan problemler, uygulanan mimari çözümler ve elde edilen çıktılar..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 resize-y"
                />
                {errors.description && (
                  <p className="text-xs text-red-400 mt-1">{errors.description}</p>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900 flex items-center justify-between">
          <div className="text-xs text-neutral-400">
            <span>Enes Öztürk Ajans · Dinamik CRUD Formu</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
            >
              Vazgeç
            </button>

            <button
              type="submit"
              form="portfolio-crud-form"
              className="px-5 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{mode === 'add' ? 'Projeyi Portföye Ekle' : 'Değişiklikleri Kaydet'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
