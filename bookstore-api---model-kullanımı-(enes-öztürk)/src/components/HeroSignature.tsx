import React from 'react';
import { ShieldCheck, UserCheck, CheckCircle2, ArrowRight, Layers, FileCode, PlayCircle } from 'lucide-react';

export const HeroSignature: React.FC = () => {
  return (
    <section id="genel-bakis" className="relative pt-12 pb-14 border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Author / Signature Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-wider">
              EÖ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">Enes Öztürk</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <UserCheck className="w-3 h-3" />
                  İmzalı Ödev Teslimi
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Backend Mimarisi · .NET Core Web API Bootcamp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Tarih: Kasım 2026</span>
            <span aria-hidden="true">·</span>
            <span>Konu: Model (DTO / ViewModel) Kullanımı</span>
          </div>
        </div>

        {/* Main Title & Problem Statement */}
        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            UpdateBook ve GetById Metotları İçin Model Mimarisi
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            RESTful API ve katmanlı mimaride güvenlik ve kapsülleme (encapsulation) ilkesi gereğince;
            veritabanı varlıkları (Entity) doğrudan istemciye açılmaz ve istemciden alınmaz.
            Aşağıda <strong className="text-slate-900 font-semibold">UpdateBook</strong> ve{' '}
            <strong className="text-slate-900 font-semibold">GetById</strong> operasyonlarının
            özelleştirilmiş <strong className="text-indigo-600 font-semibold">Input (Model)</strong> ve{' '}
            <strong className="text-indigo-600 font-semibold">Output (ViewModel)</strong> yapıları
            eksiksiz olarak sunulmuştur.
          </p>
        </div>

        {/* Golden Rule Banner */}
        <div className="mt-8 p-4 sm:p-5 rounded-xl bg-slate-900 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-indigo-300">
                Temel Ödev Kuralı
              </div>
              <div className="text-sm sm:text-base font-medium text-slate-100">
                "Proje içerisinden Input/Output olarak entity kullanan bir yapının bulunmuyor olması gerekiyor."
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#interaktif-test"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <PlayCircle className="w-3.5 h-3.5 text-indigo-600" />
              Canlı Simülasyonu Dene
            </a>
            <a
              href="#kod-cozumu"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <FileCode className="w-3.5 h-3.5" />
              C# Kodlarına Git
            </a>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              01. UpdateBook Input
            </div>
            <div className="mt-1 font-mono text-sm font-semibold text-slate-900">
              UpdateBookModel
            </div>
            <p className="mt-1.5 text-xs text-slate-500 leading-normal">
              Sadece güncellenebilir alanlar: Title, GenreId, PageCount, PublishDate. Id ve audit kolonları kapalıdır.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              02. UpdateBook Output
            </div>
            <div className="mt-1 font-mono text-sm font-semibold text-slate-900">
              UpdateBookViewModel
            </div>
            <p className="mt-1.5 text-xs text-slate-500 leading-normal">
              İstemciye dönen temiz nesne: Güncellenmiş alanlar, Genre ismi, formatlanmış tarih ve durum mesajı.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              03. GetById Input
            </div>
            <div className="mt-1 font-mono text-sm font-semibold text-slate-900">
              GetBookDetailQuery (BookId)
            </div>
            <p className="mt-1.5 text-xs text-slate-500 leading-normal">
              Route parametresi olarak alınan int BookId; FluentValidation ile 0'dan büyük olma kuralıyla doğrulanır.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              04. GetById Output
            </div>
            <div className="mt-1 font-mono text-sm font-semibold text-slate-900">
              BookDetailViewModel
            </div>
            <p className="mt-1.5 text-xs text-slate-500 leading-normal">
              Veritabanı Entity'si yerine; GenreId int değeri yerine string kategori adı ve formatlı tarih döndürür.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
