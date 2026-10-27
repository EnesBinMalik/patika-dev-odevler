import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Package,
  Terminal,
  Sliders,
  ExternalLink,
  Code2,
  FileText,
  Layers,
  ArrowRight,
  Plus,
  Trash2,
  Search,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Button } from './components/Button';
import { ButtonType, ButtonSize, ButtonShape } from './components/Button/Button.types';

export default function App() {
  // Playground state
  const [pgType, setPgType] = useState<ButtonType>('primary');
  const [pgSize, setPgSize] = useState<ButtonSize>('middle');
  const [pgShape, setPgShape] = useState<ButtonShape>('default');
  const [pgLoading, setPgLoading] = useState(false);
  const [pgDanger, setPgDanger] = useState(false);
  const [pgGhost, setPgGhost] = useState(false);
  const [pgDisabled, setPgDisabled] = useState(false);
  const [pgBlock, setPgBlock] = useState(false);
  const [pgWithIcon, setPgWithIcon] = useState(false);
  const [pgLabel, setPgLabel] = useState('Enes Öztürk Button');
  const [clickCount, setClickCount] = useState(0);

  // Copy states
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Package file viewer tab
  const [activeFileTab, setActiveFileTab] = useState<'package' | 'button' | 'types' | 'readme'>('package');

  // Publish modal state
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [npmToken, setNpmToken] = useState('');
  const [publishStatus, setPublishStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [publishMessage, setPublishMessage] = useState('');
  const [publishOutput, setPublishOutput] = useState('');

  const copyToClipboard = (text: string, setFn: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  };

  const handlePublish = async (dryRun: boolean) => {
    setPublishStatus('loading');
    setPublishMessage(dryRun ? 'NPM paketi kontrol ediliyor...' : 'npmjs.com üzerine yayınlanıyor...');
    setPublishOutput('');

    try {
      const response = await fetch('/api/npm/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: npmToken, dryRun }),
      });
      const data = await response.json();

      if (data.success) {
        setPublishStatus('success');
        setPublishMessage(data.message);
        setPublishOutput(data.output || '');
      } else {
        setPublishStatus('error');
        setPublishMessage(data.error || 'Yayınlama sırasında hata oluştu.');
        setPublishOutput(data.output || '');
      }
    } catch (err: any) {
      setPublishStatus('error');
      setPublishMessage(err.message || 'Bağlantı hatası.');
    }
  };

  // Generate dynamic code snippet
  const generatedCode = `<Button
  type="${pgType}"${pgSize !== 'middle' ? `\n  size="${pgSize}"` : ''}${pgShape !== 'default' ? `\n  shape="${pgShape}"` : ''}${pgDanger ? `\n  danger` : ''}${pgLoading ? `\n  loading` : ''}${pgDisabled ? `\n  disabled` : ''}${pgGhost ? `\n  ghost` : ''}${pgBlock ? `\n  block` : ''}${pgWithIcon ? `\n  icon={<Sparkles className="w-4 h-4" />}` : ''}
  onClick={() => console.log('Tıklandı!')}
>
  ${pgLabel}
</Button>`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* 3-ZONE TOP BAR CONTRACT */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              EÖ
            </div>
            <a href="#" className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap hover:text-blue-600 transition-colors">
              enes-ozturk-button
            </a>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#types-showcase" className="hover:text-slate-900 transition-colors whitespace-nowrap">
              Buton Tipleri
            </a>
            <a href="#playground" className="hover:text-slate-900 transition-colors whitespace-nowrap">
              Canlı Stüdyo
            </a>
            <a href="#npm-package" className="hover:text-slate-900 transition-colors whitespace-nowrap">
              NPM Paketi
            </a>
            <a href="#api-reference" className="hover:text-slate-900 transition-colors whitespace-nowrap">
              API Dökümantasyonu
            </a>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/api/package/download"
              download="enes-ozturk-button-1.0.0.tgz"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>İndir (.tgz)</span>
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 tracking-wide uppercase">
                <span>Geliştirici: Enes Öztürk</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-slate-500">v1.0.0</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-slate-500">React 18 & 19 Uyumlu</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 text-balance leading-tight">
                Modern & Esnek <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  React Button Bileşeni
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl text-balance">
                İstenilen tüm 5 temel tipi (<code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-sm text-blue-700">primary</code>,{' '}
                <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-sm text-slate-700">default</code>,{' '}
                <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-sm text-slate-700">dashed</code>,{' '}
                <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-sm text-slate-700">text</code>,{' '}
                <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-sm text-blue-600">link</code>) eksiksiz
                destekleyen, NPM için paketlenmiş ve imzalanmış bileşen kütüphanesi.
              </p>

              {/* Install Bar */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-sm border border-slate-800 shadow-sm grow sm:grow-0 sm:min-w-[340px]">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="select-all">npm i enes-ozturk-button</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard('npm i enes-ozturk-button', setCopiedInstall)}
                    className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-white"
                    title="Kopyala"
                  >
                    {copiedInstall ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2.5">
                  <a
                    href="#playground"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm"
                  >
                    <Sliders className="w-4 h-4" />
                    <span>Canlı Stüdyoda Dene</span>
                  </a>

                  <button
                    onClick={() => setShowPublishModal(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors shadow-sm"
                  >
                    <Package className="w-4 h-4 text-slate-600" />
                    <span>NPM Yayını</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Interactive Mini Stage */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-blue-50/40 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>HIZLI BAKIŞ (5 BUTON TİPİ)</span>
                <span className="font-mono text-blue-600">type prop</span>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <Button type="primary">Primary</Button>
                <Button type="default">Default</Button>
                <Button type="dashed">Dashed</Button>
                <Button type="text">Text</Button>
                <Button type="link">Link</Button>
              </div>

              <div className="pt-2 border-t border-slate-200/80">
                <div className="text-xs font-medium text-slate-500 mb-2">Durumlar & Animasyonlar</div>
                <div className="flex flex-wrap gap-2.5 items-center">
                  <Button type="primary" loading>Yükleniyor</Button>
                  <Button type="primary" danger>Tehlike</Button>
                  <Button type="dashed" danger>Kaldır</Button>
                  <Button type="default" disabled>Pasif</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: THE 5 REQUIRED BUTTON TYPES SHOWCASE */}
      <section id="types-showcase" className="py-16 max-w-7xl mx-auto px-6 w-full space-y-12">
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            01. Temel Gereksinimler
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            5 Temel Buton Tipi (<code className="text-blue-600 font-mono font-medium">type</code> Prop)
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            Her buton tipi, kullanıcı arayüzünüzün görsel hiyerarşisine ve eylemin önem derecesine göre özel olarak tasarlanmıştır.
          </p>
        </div>

        {/* 5 Types Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Primary */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                  type="primary"
                </span>
                <span className="text-xs text-slate-500">Ana Eylem</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Primary Buton</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ekrandaki en önemli, birincil eylemi temsil eder. Vurgulu mavi arka planı ve tıklama dalga efekti vardır.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button type="primary">Primary Buton</Button>
              <code className="text-[11px] font-mono text-slate-400">&lt;Button type="primary" /&gt;</code>
            </div>
          </div>

          {/* 2. Default */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  type="default"
                </span>
                <span className="text-xs text-slate-500">Standart / İkincil</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Default Buton</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Varsayılan buton tipi. Beyaz zemin, açık gri kenarlık ve hover durumunda marka mavisi çerçeveye bürünür.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button type="default">Default Buton</Button>
              <code className="text-[11px] font-mono text-slate-400">&lt;Button type="default" /&gt;</code>
            </div>
          </div>

          {/* 3. Dashed */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  type="dashed"
                </span>
                <span className="text-xs text-slate-500">Kesikli Çerçeve</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Dashed Buton</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ant Design tarzı kesikli kenarlık. Yeni öğe ekleme, dosya yükleme veya taslak oluşturma alanları için idealdir.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button type="dashed" icon={<Plus className="w-3.5 h-3.5" />}>Yeni Öğe Ekle</Button>
              <code className="text-[11px] font-mono text-slate-400">&lt;Button type="dashed" /&gt;</code>
            </div>
          </div>

          {/* 4. Text */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  type="text"
                </span>
                <span className="text-xs text-slate-500">Düz Metin</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Text Buton</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kenarlıksız ve şeffaf zeminli buton. Hover anında hafif gri dolgu efekti kazanır, minimalist araç çubukları içindir.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button type="text">Text Buton</Button>
              <code className="text-[11px] font-mono text-slate-400">&lt;Button type="text" /&gt;</code>
            </div>
          </div>

          {/* 5. Link */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                  type="link"
                </span>
                <span className="text-xs text-slate-500">Köprü / Bağlantı</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Link Buton</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Köprü formatında buton. Hover durumunda alt çizgi ile eylemi vurgular; yönlendirme ve satır içi eylemlerde kullanılır.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button type="link">Detayları Gör &rarr;</Button>
              <code className="text-[11px] font-mono text-slate-400">&lt;Button type="link" /&gt;</code>
            </div>
          </div>

          {/* 6. Danger & Variations Banner */}
          <div className="bg-red-50/40 p-6 rounded-xl border border-red-200 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">
                  danger=true
                </span>
                <span className="text-xs text-red-600 font-medium">Kritik Eylemler</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Tehlike Modları</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                5 tipin tümü <code className="text-red-700 font-mono">danger</code> prop'u ile kırmızı renk paletine dönüşür.
              </p>
            </div>
            <div className="pt-4 border-t border-red-100 flex flex-wrap gap-2 items-center">
              <Button type="primary" danger size="small">Primary</Button>
              <Button type="default" danger size="small">Default</Button>
              <Button type="dashed" danger size="small">Dashed</Button>
              <Button type="text" danger size="small">Text</Button>
              <Button type="link" danger size="small">Link</Button>
            </div>
          </div>
        </div>

        {/* Additional Matrix: Sizes, Shapes & States */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">Boyutlar ve Şekiller (Sizes & Shapes)</h3>
            <p className="text-xs text-slate-500">small, middle, large boyutları ve round, circle şekilleri</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sizes */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Boyut Matrisi</span>
              <div className="flex items-center gap-3">
                <Button type="primary" size="small">Small</Button>
                <Button type="primary" size="middle">Middle</Button>
                <Button type="primary" size="large">Large</Button>
              </div>
            </div>

            {/* Shapes */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Şekiller (Shapes)</span>
              <div className="flex items-center gap-3">
                <Button type="primary" shape="default">Default</Button>
                <Button type="primary" shape="round">Round</Button>
                <Button type="primary" shape="circle" icon={<Search className="w-4 h-4" />} />
                <Button type="dashed" shape="circle" icon={<Plus className="w-4 h-4" />} />
              </div>
            </div>

            {/* Loading & Disabled */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Yükleme & Pasif Durumlar</span>
              <div className="flex items-center gap-3">
                <Button type="primary" loading>Yükleniyor</Button>
                <Button type="dashed" loading>İşleniyor</Button>
                <Button type="default" disabled>Pasif</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: INTERACTIVE COMPONENT PLAYGROUND (LIVE STUDIO) */}
      <section id="playground" className="py-16 bg-slate-100/70 border-y border-slate-200 w-full">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              02. Canlı Bileşen Stüdyosu
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              İnteraktif Deneme & Kod Üretici
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
              Prop değerlerini değiştirin, butonu anlık olarak test edin ve projenizde kullanmak üzere hazır kodu kopyalayın.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Controls Panel */}
            <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-bold text-slate-900">Prop Kontrol Paneli</span>
                </div>
                <button
                  onClick={() => {
                    setPgType('primary');
                    setPgSize('middle');
                    setPgShape('default');
                    setPgLoading(false);
                    setPgDanger(false);
                    setPgGhost(false);
                    setPgDisabled(false);
                    setPgBlock(false);
                    setPgWithIcon(false);
                    setPgLabel('Enes Öztürk Button');
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Sıfırla
                </button>
              </div>

              {/* 1. Type Prop (Primary Requirement) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Tip (type)</span>
                  <span className="font-mono text-blue-600 text-[11px] font-normal">zorunlu prop</span>
                </label>
                <div className="grid grid-cols-5 gap-1.5 p-1 bg-slate-100 rounded-lg">
                  {(['primary', 'default', 'dashed', 'text', 'link'] as ButtonType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setPgType(t)}
                      className={`py-1.5 text-xs font-medium rounded capitalize transition-all ${
                        pgType === t
                          ? 'bg-white text-blue-600 shadow-sm font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Size Prop */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Boyut (size)</label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg">
                  {[
                    { label: 'Küçük (small)', val: 'small' },
                    { label: 'Standart (middle)', val: 'middle' },
                    { label: 'Büyük (large)', val: 'large' },
                  ].map((s) => (
                    <button
                      key={s.val}
                      onClick={() => setPgSize(s.val as ButtonSize)}
                      className={`py-1.5 text-xs font-medium rounded transition-all ${
                        pgSize === s.val
                          ? 'bg-white text-blue-600 shadow-sm font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Shape Prop */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Şekil (shape)</label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg">
                  {(['default', 'round', 'circle'] as ButtonShape[]).map((sh) => (
                    <button
                      key={sh}
                      onClick={() => setPgShape(sh)}
                      className={`py-1.5 text-xs font-medium rounded capitalize transition-all ${
                        pgShape === sh
                          ? 'bg-white text-blue-600 shadow-sm font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {sh}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Text Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Buton Metni (children)</label>
                <input
                  type="text"
                  value={pgLabel}
                  onChange={(e) => setPgLabel(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* 5. Boolean Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-semibold text-slate-700">Durum Seçenekleri</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pgLoading}
                      onChange={(e) => setPgLoading(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span className="font-medium text-slate-700">loading</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pgDanger}
                      onChange={(e) => setPgDanger(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                    />
                    <span className="font-medium text-slate-700">danger</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pgDisabled}
                      onChange={(e) => setPgDisabled(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span className="font-medium text-slate-700">disabled</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pgWithIcon}
                      onChange={(e) => setPgWithIcon(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span className="font-medium text-slate-700">ikon ile</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pgBlock}
                      onChange={(e) => setPgBlock(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span className="font-medium text-slate-700">block (100% genişlik)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pgGhost}
                      onChange={(e) => setPgGhost(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span className="font-medium text-slate-700">ghost (şeffaf)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Live Preview Stage & Code Output */}
            <div className="lg:col-span-7 space-y-6">
              {/* Canvas Container */}
              <div
                className={`p-10 rounded-xl border transition-colors flex flex-col items-center justify-center min-h-[260px] relative ${
                  pgGhost ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="absolute top-3 left-4 flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <span>CANLI ÖNİZLEME</span>
                  {pgGhost && <span className="text-amber-400">(Ghost Modu Aktif)</span>}
                </div>

                <div className="w-full flex flex-col items-center justify-center py-6">
                  <Button
                    type={pgType}
                    size={pgSize}
                    shape={pgShape}
                    loading={pgLoading}
                    danger={pgDanger}
                    ghost={pgGhost}
                    disabled={pgDisabled}
                    block={pgBlock}
                    icon={pgWithIcon ? <Sparkles className="w-4 h-4" /> : undefined}
                    onClick={() => setClickCount((c) => c + 1)}
                  >
                    {pgShape === 'circle' && !pgWithIcon ? <Search className="w-4 h-4" /> : pgLabel}
                  </Button>
                </div>

                {/* Click counter telemetry */}
                <div className="text-xs text-slate-400 font-mono mt-2">
                  Tıklama Sayacı: <span className="font-bold text-blue-600 tabular-nums">{clickCount}</span>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
                <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-blue-400" />
                    <span className="font-mono text-slate-200">React JSX Kodu</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(generatedCode, setCopiedCode)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Kopyalandı!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Kodu Kopyala</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                  {generatedCode}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: NPM PACKAGE EXPLORER & REGISTRY CARD */}
      <section id="npm-package" className="py-16 max-w-7xl mx-auto px-6 w-full space-y-8">
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            03. NPM Dağıtım & Paketleme
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            npmjs.com Paket Bilgisi & İndirme
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            Bileşen, standart NPM paket kurallarına göre yapılandırılmış, ESM + CommonJS derlemeleri yapılmış ve Enes Öztürk imzasıyla hazırlanmıştır.
          </p>
        </div>

        {/* NPM Card Replica */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Top Bar of Card */}
          <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold font-mono text-slate-900">enes-ozturk-button</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  v1.0.0
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Public
                </span>
              </div>
              <p className="text-sm text-slate-600">
                Ant Design inspired customizable React Button component supporting primary, default, dashed, text, and link types.
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                <span>Yazar: <strong>Enes Öztürk</strong></span>
                <span aria-hidden="true">·</span>
                <span>Lisans: MIT</span>
                <span aria-hidden="true">·</span>
                <span>Paket Boyutu: ~8.7 kB</span>
                <span aria-hidden="true">·</span>
                <span>TypeScript: Dahili (dist/index.d.ts)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href="/api/package/download"
                download="enes-ozturk-button-1.0.0.tgz"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Paketi İndir (.tgz)</span>
              </a>

              <button
                onClick={() => setShowPublishModal(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
              >
                <UploadCloud className="w-4 h-4" />
                <span>NPM'e Gönder</span>
              </button>
            </div>
          </div>

          {/* Code Tabs */}
          <div className="border-b border-slate-100 bg-slate-50/70 px-6 flex items-center gap-2">
            {[
              { id: 'package', label: 'package.json' },
              { id: 'button', label: 'src/Button.tsx' },
              { id: 'types', label: 'src/Button.types.ts' },
              { id: 'readme', label: 'README.md' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFileTab(tab.id as any)}
                className={`py-3 px-3 text-xs font-mono font-medium border-b-2 transition-all ${
                  activeFileTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 bg-slate-950 font-mono text-xs text-slate-200 overflow-x-auto max-h-[380px]">
            {activeFileTab === 'package' && (
              <pre className="leading-relaxed">
{`{
  "name": "enes-ozturk-button",
  "version": "1.0.0",
  "type": "module",
  "description": "Ant Design inspired customizable React Button component supporting primary, default, dashed, text, and link types. Developed by Enes Öztürk.",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "author": "Enes Öztürk <enesbino38@gmail.com>",
  "license": "MIT",
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  }
}`}
              </pre>
            )}

            {activeFileTab === 'button' && (
              <pre className="leading-relaxed">
{`import React, { forwardRef, useState } from 'react';
import { ButtonProps, ButtonType, ButtonSize, ButtonShape } from './Button.types';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    type = 'default',
    size = 'middle',
    shape = 'default',
    loading = false,
    danger = false,
    ghost = false,
    block = false,
    disabled = false,
    htmlType = 'button',
    icon,
    children,
    ...rest
  },
  ref
) {
  // Desteklenen 5 tip: primary, default, dashed, text, link
  // İmzalı geliştirici: Enes Öztürk
  ...
});`}
              </pre>
            )}

            {activeFileTab === 'types' && (
              <pre className="leading-relaxed">
{`export type ButtonType = 'primary' | 'default' | 'dashed' | 'text' | 'link';
export type ButtonSize = 'small' | 'middle' | 'large' | 'sm' | 'md' | 'lg';
export type ButtonShape = 'default' | 'circle' | 'round';
export type ButtonHTMLType = 'button' | 'submit' | 'reset';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  type?: ButtonType;
  size?: ButtonSize;
  shape?: ButtonShape;
  loading?: boolean;
  danger?: boolean;
  ghost?: boolean;
  block?: boolean;
  htmlType?: ButtonHTMLType;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  children?: React.ReactNode;
  className?: string;
  rippleEffect?: boolean;
}`}
              </pre>
            )}

            {activeFileTab === 'readme' && (
              <pre className="leading-relaxed">
{`# enes-ozturk-button 🚀

> Ant Design esintili, modern ve erişilebilir React Button bileşeni.  
> Geliştirici: Enes Öztürk

## 📦 Kurulum (Installation)
\`\`\`bash
npm install enes-ozturk-button
\`\`\`

## 🌟 Buton Tipleri
- primary: Ana eylem butonu
- default: Standart ikincil buton
- dashed: Kesikli kenarlıklı buton
- text: Kenarlıksız düz metin buton
- link: Köprü bağlantı butonu`}
              </pre>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 4: API & PROPS REFERENCE */}
      <section id="api-reference" className="py-16 max-w-7xl mx-auto px-6 w-full space-y-8">
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            04. Dökümantasyon
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            API & Prop Referansı
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            Bileşenin desteklediği tüm prop tanımları ve varsayılan değerleri.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Prop</th>
                  <th className="py-3 px-4">Tip</th>
                  <th className="py-3 px-4">Varsayılan</th>
                  <th className="py-3 px-4">Açıklama</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="bg-blue-50/20">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">type</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-600">
                    'primary' | 'default' | 'dashed' | 'text' | 'link'
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-500">'default'</td>
                  <td className="py-3 px-4 text-xs font-medium text-slate-900">
                    Butonun görsel varyantını belirler (Gereksinim: 5 temel tip)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900">size</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-600">
                    'small' | 'middle' | 'large'
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-500">'middle'</td>
                  <td className="py-3 px-4 text-xs text-slate-600">Butonun yükseklik ve dolgu boyutunu belirler</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900">shape</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-600">
                    'default' | 'circle' | 'round'
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-500">'default'</td>
                  <td className="py-3 px-4 text-xs text-slate-600">Köşe yuvarlaklığı veya tam dairesel form</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900">loading</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-600">boolean</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-500">false</td>
                  <td className="py-3 px-4 text-xs text-slate-600">Dönen animasyonlu spinner gösterir ve tıklamayı kilitler</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900">danger</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-600">boolean</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-500">false</td>
                  <td className="py-3 px-4 text-xs text-slate-600">Kırmızı tehlike temasını (silme, iptal) etkinleştirir</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900">ghost</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-600">boolean</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-500">false</td>
                  <td className="py-3 px-4 text-xs text-slate-600">Koyu veya renkli zeminler için şeffaf arka plan modu</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900">block</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-600">boolean</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-500">false</td>
                  <td className="py-3 px-4 text-xs text-slate-600">Ebeveyn kapsayıcının tüm genişliğini kaplar (w-full)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900">disabled</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-600">boolean</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-500">false</td>
                  <td className="py-3 px-4 text-xs text-slate-600">Butonu etkileşimsiz pasif hale getirir</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900">icon</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-600">React.ReactNode</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-500">-</td>
                  <td className="py-3 px-4 text-xs text-slate-600">Buton içine eklenecek SVG ikon bileşeni</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900">onClick</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-600">(e: MouseEvent) =&gt; void</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-500">-</td>
                  <td className="py-3 px-4 text-xs text-slate-600">Tıklama olayı işleyicisi</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Geliştirici: <strong className="text-slate-800">Enes Öztürk</strong></span>
            <span aria-hidden="true">·</span>
            <span>enesbino38@gmail.com</span>
            <span aria-hidden="true">·</span>
            <span>MIT Lisansı</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/api/package/download"
              download="enes-ozturk-button-1.0.0.tgz"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              enes-ozturk-button-1.0.0.tgz İndir
            </a>
          </div>
        </div>
      </footer>

      {/* NPM PUBLISH MODAL */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs">
                  npm
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">NPM Yayın Asistanı</h3>
                  <p className="text-xs text-slate-500">enes-ozturk-button @ 1.0.0</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPublishModal(false);
                  setPublishStatus('idle');
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Bu paket <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-blue-600">enes-ozturk-button</code> adıyla
                hazırlanmıştır. Eğer npmjs.com hesabınız varsa, aldığınız <strong>Access Token (npm_...)</strong>'i girerek tek tıkla canlıya alabilir veya doğrudan paket doğrulama testini (Dry-Run) çalıştırabilirsiniz.
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  NPMjs Access Token (İsteğe Bağlı)
                </label>
                <input
                  type="password"
                  placeholder="npm_xxxxxxxxxxxxxxxxxxxxxxxx"
                  value={npmToken}
                  onChange={(e) => setNpmToken(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <span className="text-[11px] text-slate-400 block">
                  Token yoksa aşağıdaki "Dry-Run Doğrula" butonuna basarak paketin derlenme ve npm uyumluluk testini yapabilirsiniz.
                </span>
              </div>

              {/* Status Display */}
              {publishStatus !== 'idle' && (
                <div
                  className={`p-3.5 rounded-lg text-xs space-y-2 border ${
                    publishStatus === 'loading'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : publishStatus === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-red-50 text-red-800 border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    {publishStatus === 'loading' && <span className="animate-spin inline-block">⏳</span>}
                    {publishStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {publishStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-600" />}
                    <span>{publishMessage}</span>
                  </div>
                  {publishOutput && (
                    <pre className="text-[11px] font-mono bg-black/10 p-2 rounded overflow-x-auto max-h-32">
                      {publishOutput}
                    </pre>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => handlePublish(true)}
                disabled={publishStatus === 'loading'}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
              >
                Dry-Run Doğrula
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPublishModal(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Kapat
                </button>
                <button
                  onClick={() => handlePublish(false)}
                  disabled={publishStatus === 'loading' || !npmToken.trim()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm"
                >
                  NPM'de Yayınla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
