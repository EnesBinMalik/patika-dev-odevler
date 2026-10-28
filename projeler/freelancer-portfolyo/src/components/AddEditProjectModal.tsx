import React, { useState, useEffect, useRef } from 'react';
import { Project } from '../types';
import { StarDivider } from './StarDivider';
import { PRESET_IMAGES } from '../data/initialProjects';
import { X, Upload, Image as ImageIcon, Link, Sparkles, Check, AlertCircle } from 'lucide-react';

interface AddEditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: Omit<Project, 'id'>, existingId?: string) => void;
  projectToEdit?: Project | null;
}

export const AddEditProjectModal: React.FC<AddEditProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  projectToEdit,
}) => {
  const isEditing = Boolean(projectToEdit);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Project['category']>('Node.js & Express');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [image, setImage] = useState('');
  const [client, setClient] = useState('');
  const [date, setDate] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [technologiesText, setTechnologiesText] = useState('');
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'preset' | 'url'>('preset');
  const [error, setError] = useState<string | null>(null);

  // Sync form state when modal opens or projectToEdit changes
  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title);
      setCategory(projectToEdit.category);
      setDescription(projectToEdit.description);
      setLongDescription(projectToEdit.longDescription || projectToEdit.description);
      setImage(projectToEdit.image);
      setClient(projectToEdit.client);
      setDate(projectToEdit.date);
      setGithubUrl(projectToEdit.githubUrl || '');
      setLiveUrl(projectToEdit.liveUrl || '');
      setTechnologiesText(projectToEdit.technologies.join(', '));
      setImageInputMode('url');
    } else {
      // Default clean values for ADD
      setTitle('');
      setCategory('Node.js & Express');
      setDescription('');
      setLongDescription('');
      setImage(PRESET_IMAGES[0].url);
      setClient('Kişisel Portföy');
      setDate('Ekim 2026');
      setGithubUrl('https://github.com/enesozturk/');
      setLiveUrl('');
      setTechnologiesText('Node.js, Express.js, MongoDB, EJS, Heroku');
      setImageInputMode('preset');
    }
    setError(null);
  }, [projectToEdit, isOpen]);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setError('Görsel boyutu 8MB altında olmalıdır.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
          setError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Lütfen bir proje başlığı giriniz.');
      return;
    }
    if (!description.trim()) {
      setError('Lütfen kısa bir proje açıklaması giriniz.');
      return;
    }
    if (!image.trim()) {
      setError('Lütfen bir proje görseli yükleyiniz veya seçiniz.');
      return;
    }

    const techArray = technologiesText
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const projectData: Omit<Project, 'id'> = {
      title: title.trim(),
      category,
      description: description.trim(),
      longDescription: longDescription.trim() || description.trim(),
      image,
      client: client.trim() || 'Serbest Çalışma',
      date: date.trim() || '2026',
      githubUrl: githubUrl.trim() || undefined,
      liveUrl: liveUrl.trim() || undefined,
      technologies: techArray.length > 0 ? techArray : ['Web Development', 'JavaScript'],
    };

    onSave(projectData, projectToEdit?.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative bg-white rounded-2xl max-w-4xl w-full mx-auto shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#2c3e50] text-white px-6 py-5 flex items-center justify-between border-b border-[#34495e]">
          <div>
            <span className="text-xs font-bold text-[#1abc9c] uppercase tracking-wider block">
              PCAT & SmartEdu CRUD Mimarisi
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight font-heading">
              {isEditing ? 'PROJEYİ DÜZENLE (EDIT SAYFASI)' : 'YENİ PROJE EKLE (ADD SAYFASI)'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Proje Başlığı *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: PCAT Fotoğraf Kataloğu"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#1abc9c] focus:ring-2 focus:ring-[#1abc9c]/20 outline-none text-sm text-slate-800 transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Kategori *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Project['category'])}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#1abc9c] focus:ring-2 focus:ring-[#1abc9c]/20 outline-none text-sm text-slate-800 transition-all bg-white"
              >
                <option value="Node.js & Express">Node.js & Express</option>
                <option value="Full Stack">Full Stack</option>
                <option value="Web Geliştirme">Web Geliştirme</option>
                <option value="Mobil & UI">Mobil & UI</option>
              </select>
            </div>

            {/* Client / Kurum */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Müşteri / Kurum
              </label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Örn: Freelance Müşteri / Eğitim Portalı"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#1abc9c] focus:ring-2 focus:ring-[#1abc9c]/20 outline-none text-sm text-slate-800 transition-all"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Tarih / Dönem
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Örn: Ekim 2026"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#1abc9c] focus:ring-2 focus:ring-[#1abc9c]/20 outline-none text-sm text-slate-800 transition-all"
              />
            </div>
          </div>

          {/* Image Selection Area */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Proje Görseli Yükleme & Seçme (PCAT Tarzı Görsel Yükleyici) *
            </label>

            {/* Mode selection tabs */}
            <div className="flex items-center gap-2 mb-4">
              <button
                type="button"
                onClick={() => setImageInputMode('preset')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors ${
                  imageInputMode === 'preset'
                    ? 'bg-[#1abc9c] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hazır Mockup Seç</span>
              </button>
              <button
                type="button"
                onClick={() => setImageInputMode('upload')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors ${
                  imageInputMode === 'upload'
                    ? 'bg-[#1abc9c] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Bilgisayardan Yükle (Multer Mantığı)</span>
              </button>
              <button
                type="button"
                onClick={() => setImageInputMode('url')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors ${
                  imageInputMode === 'url'
                    ? 'bg-[#1abc9c] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Link className="w-3.5 h-3.5" />
                <span>Görsel URL Gir</span>
              </button>
            </div>

            {/* Mode: Preset Mockups */}
            {imageInputMode === 'preset' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PRESET_IMAGES.map((preset) => (
                  <div
                    key={preset.url}
                    onClick={() => setImage(preset.url)}
                    className={`group relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                      image === preset.url
                        ? 'border-[#1abc9c] shadow-md ring-2 ring-[#1abc9c]/30'
                        : 'border-transparent hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-24 object-cover"
                    />
                    <div className="p-1.5 bg-white text-[11px] font-medium text-slate-700 text-center truncate">
                      {preset.label}
                    </div>
                    {image === preset.url && (
                      <div className="absolute top-1 right-1 bg-[#1abc9c] text-white p-1 rounded-full">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Mode: Upload local file */}
            {imageInputMode === 'upload' && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-[#1abc9c] rounded-xl p-6 text-center cursor-pointer transition-colors bg-white"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-[#1abc9c] mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">
                  Görsel dosyası seçmek için buraya tıklayın
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  JPG, PNG veya WebP (Maks 8MB) - PCAT projesindeki dosya yükleme simülasyonu
                </p>
              </div>
            )}

            {/* Mode: URL input */}
            {imageInputMode === 'url' && (
              <div>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/project-image.jpg"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#1abc9c] focus:ring-2 focus:ring-[#1abc9c]/20 outline-none text-sm text-slate-800 bg-white"
                />
              </div>
            )}

            {/* Active Preview */}
            {image && (
              <div className="mt-4 flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-200">
                <img
                  src={image}
                  alt="Seçili Görsel Önizleme"
                  className="w-14 h-14 object-cover rounded-md bg-slate-100"
                />
                <div className="text-xs text-slate-600 truncate flex-1">
                  <span className="font-semibold text-slate-800 block">Seçili Görsel</span>
                  <span className="truncate block font-mono text-[11px] text-slate-500">{image.slice(0, 50)}...</span>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Kısa Açıklama (Portföy Kartı İçin) *
            </label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Projenin amacını özetleyen 1-2 cümlelik açıklama..."
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#1abc9c] focus:ring-2 focus:ring-[#1abc9c]/20 outline-none text-sm text-slate-800 transition-all resize-none"
            />
          </div>

          {/* Long Description / Modal Details */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Detaylı Açıklama (Modal Penceresi İçin)
            </label>
            <textarea
              rows={4}
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              placeholder="Projede kullanılan mimari, zorluklar, çözümler ve kazanımlar..."
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#1abc9c] focus:ring-2 focus:ring-[#1abc9c]/20 outline-none text-sm text-slate-800 transition-all"
            />
          </div>

          {/* Tech Stack & Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Kullanılan Teknolojiler
              </label>
              <input
                type="text"
                value={technologiesText}
                onChange={(e) => setTechnologiesText(e.target.value)}
                placeholder="Node.js, Express, MongoDB, EJS"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#1abc9c] focus:ring-2 focus:ring-[#1abc9c]/20 outline-none text-sm text-slate-800"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Virgülle ayırarak yazın</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                GitHub Depo Linki
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#1abc9c] focus:ring-2 focus:ring-[#1abc9c]/20 outline-none text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Canlı Demo / Heroku Linki
              </label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://projeniz.herokuapp.com"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#1abc9c] focus:ring-2 focus:ring-[#1abc9c]/20 outline-none text-sm text-slate-800"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1abc9c] hover:bg-[#16a085] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{isEditing ? 'Değişiklikleri Kaydet (EDIT)' : 'Projeyi Yayınla (ADD)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
