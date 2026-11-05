import React, { useState } from 'react';
import { BookEntity, UpdateBookInputModel, BookDetailViewModel, UpdateBookOutputModel } from '../types/models';
import { INITIAL_BOOKS, GENRES } from '../data/mockData';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Database,
  ArrowRight,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Send,
  Eye,
  RefreshCw,
  Sliders,
  Sparkles,
} from 'lucide-react';

export const InteractivePlayground: React.FC = () => {
  const [books, setBooks] = useState<BookEntity[]>(INITIAL_BOOKS);
  const [activeTab, setActiveTab] = useState<'get' | 'update' | 'security'>('get');

  // GetById State
  const [selectedGetId, setSelectedGetId] = useState<number>(2);
  const [getOutput, setGetOutput] = useState<BookDetailViewModel | null>(null);
  const [getRawEntity, setGetRawEntity] = useState<BookEntity | null>(null);
  const [getError, setGetError] = useState<string | null>(null);

  // UpdateBook State
  const [updateBookId, setUpdateBookId] = useState<number>(1);
  const [updateForm, setUpdateForm] = useState<UpdateBookInputModel>({
    title: 'Lean Startup (Genişletilmiş 2. Baskı)',
    genreId: 1,
    pageCount: 352,
    publishDate: '2011-09-13',
  });
  const [updateOutput, setUpdateOutput] = useState<UpdateBookOutputModel | null>(null);
  const [updateErrors, setUpdateErrors] = useState<{ [key: string]: string }>({});
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState<string | null>(null);

  // Security Over-Posting Test State
  const [hackAttempted, setHackAttempted] = useState<boolean>(false);

  // Format Helper
  const formatDateToTR = (isoDate: string) => {
    try {
      const d = new Date(isoDate);
      if (isNaN(d.getTime())) return isoDate;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return isoDate;
    }
  };

  // Run GetById
  const handleRunGetById = (idToFetch: number = selectedGetId) => {
    setGetError(null);
    if (!idToFetch || idToFetch <= 0) {
      setGetError('FluentValidation Hatası: BookId 0\'dan büyük bir tamsayı olmalıdır!');
      setGetOutput(null);
      setGetRawEntity(null);
      return;
    }

    const found = books.find((b) => b.id === idToFetch && !b.isDeleted);
    if (!found) {
      setGetError(`Kitap bulunamadı! (Id: ${idToFetch})`);
      setGetOutput(null);
      setGetRawEntity(null);
      return;
    }

    setGetRawEntity(found);
    const genreObj = GENRES.find((g) => g.id === found.genreId);

    // AutoMapper simulation: Entity -> BookDetailViewModel
    const viewModel: BookDetailViewModel = {
      id: found.id,
      title: found.title,
      genre: genreObj ? genreObj.name : 'Belirtilmemiş',
      pageCount: found.pageCount,
      publishDate: formatDateToTR(found.publishDate),
    };
    setGetOutput(viewModel);
  };

  // Run UpdateBook
  const handleRunUpdateBook = (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateErrors({});
    setUpdateSuccessMsg(null);

    // FluentValidation simulation
    const errors: { [key: string]: string } = {};
    if (!updateForm.title || updateForm.title.trim().length < 2) {
      errors.title = 'Kitap başlığı en az 2 karakter olmalıdır!';
    }
    if (!updateForm.genreId || updateForm.genreId <= 0) {
      errors.genreId = 'Lütfen geçerli bir kategori seçiniz!';
    }
    if (!updateForm.pageCount || updateForm.pageCount <= 0) {
      errors.pageCount = 'Sayfa sayısı 0\'dan büyük olmalıdır!';
    }
    const pubDate = new Date(updateForm.publishDate);
    const today = new Date();
    if (isNaN(pubDate.getTime()) || pubDate > today) {
      errors.publishDate = 'Yayınlanma tarihi bugünden ileri bir tarih olamaz!';
    }

    if (Object.keys(errors).length > 0) {
      setUpdateErrors(errors);
      return;
    }

    // Execute update in DB safely through Model
    const bookIndex = books.findIndex((b) => b.id === updateBookId);
    if (bookIndex === -1) {
      setUpdateErrors({ general: 'Güncellenecek kitap bulunamadı!' });
      return;
    }

    const existingBook = books[bookIndex];
    const nowIso = new Date().toISOString();

    // Safely apply model updates (Id, createdDate, isDeleted remain untouched!)
    const updatedBook: BookEntity = {
      ...existingBook,
      title: updateForm.title.trim(),
      genreId: updateForm.genreId,
      pageCount: Number(updateForm.pageCount),
      publishDate: updateForm.publishDate,
      modifiedDate: nowIso,
    };

    const newBooks = [...books];
    newBooks[bookIndex] = updatedBook;
    setBooks(newBooks);

    const genreObj = GENRES.find((g) => g.id === updatedBook.genreId);
    const output: UpdateBookOutputModel = {
      id: updatedBook.id,
      title: updatedBook.title,
      genre: genreObj ? genreObj.name : 'Bilinmiyor',
      pageCount: updatedBook.pageCount,
      publishDate: formatDateToTR(updatedBook.publishDate),
      updatedAt: new Date().toLocaleTimeString('tr-TR'),
      message: 'Kitap bilgileri UpdateBookModel üzerinden güvenle güncellendi.',
    };

    setUpdateOutput(output);
    setUpdateSuccessMsg('Güncelleme başarılı! Output olarak UpdateBookViewModel döndürüldü.');
  };

  // Preset selector for update
  const handleSelectBookForUpdate = (id: number) => {
    setUpdateBookId(id);
    const target = books.find((b) => b.id === id);
    if (target) {
      setUpdateForm({
        title: target.title,
        genreId: target.genreId,
        pageCount: target.pageCount,
        publishDate: target.publishDate.split('T')[0],
      });
      setUpdateOutput(null);
      setUpdateErrors({});
      setUpdateSuccessMsg(null);
    }
  };

  // Reset database state
  const handleResetData = () => {
    setBooks(INITIAL_BOOKS);
    setGetOutput(null);
    setGetRawEntity(null);
    setUpdateOutput(null);
    setUpdateErrors({});
    setUpdateSuccessMsg(null);
    setHackAttempted(false);
  };

  return (
    <section id="interaktif-test" className="py-14 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
              Çalışır Durumda Canlı Simülatör
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Model Mimarisi Canlı Test Alanı
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              GetById ve UpdateBook metotlarını gerçek C# mantığı ve AutoMapper dönüşümleriyle
              çalıştırın; Entity'nin veritabanında nasıl korunduğunu canlı olarak gözlemleyin.
            </p>
          </div>

          <button
            onClick={handleResetData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors self-start md:self-auto"
            title="Örnek veritabanını sıfırla"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Örnek DB'yi Sıfırla
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 gap-2 mb-8">
          <button
            onClick={() => {
              setActiveTab('get');
              if (!getOutput) handleRunGetById(selectedGetId);
            }}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'get'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Eye className="w-4 h-4" />
            01. GetById Metodu Testi
          </button>

          <button
            onClick={() => setActiveTab('update')}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'update'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            02. UpdateBook Metodu Testi
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'security'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            03. Over-Posting Güvenlik Simülasyonu
          </button>
        </div>

        {/* TAB 1: GetById Simulation */}
        {activeTab === 'get' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Control Column */}
            <div className="lg:col-span-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                GetById Sorgu Parametresi
              </div>
              <p className="text-xs text-slate-600 mb-4">
                Sorgulanacak kitabın kimliğini (Id) seçin veya girin. Controller'a <code className="font-mono text-indigo-700">GetBookDetailQuery</code> olarak iletilir.
              </p>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  Kitap Seçimi (ID):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {books.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setSelectedGetId(b.id);
                        handleRunGetById(b.id);
                      }}
                      className={`p-2.5 text-left text-xs rounded-lg border transition-all ${
                        selectedGetId === b.id
                          ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-900'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="text-[10px] text-slate-400 font-mono">ID: {b.id}</div>
                      <div className="truncate">{b.title}</div>
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Özel ID Testi (Sınır Değer Doğrulaması):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={selectedGetId}
                      onChange={(e) => setSelectedGetId(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 bg-white focus:outline-indigo-600"
                      placeholder="Örn: 1, 99 veya -1"
                    />
                    <button
                      onClick={() => handleRunGetById(selectedGetId)}
                      className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shrink-0"
                    >
                      Sorgula
                    </button>
                  </div>
                </div>
              </div>

              {getError && (
                <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{getError}</span>
                </div>
              )}
            </div>

            {/* Right Display: Entity in DB vs ViewModel Output */}
            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Internal DB Entity (QUARANTINED) */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-900 text-white flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                        <Database className="w-4 h-4 text-amber-400" />
                        Veritabanı Katmanı (Entity)
                      </div>
                      <span className="text-[10px] font-mono text-amber-300 bg-amber-950/70 px-2 py-0.5 rounded border border-amber-800">
                        DB İçi (Korumalı)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3">
                      Veritabanında saklanan ham <code className="text-amber-400">Book.cs</code> nesnesi.
                      Hassas ve teknik alanlar içerir.
                    </p>

                    {getRawEntity ? (
                      <div className="font-mono text-xs bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1 text-slate-300">
                        <div>id: <span className="text-amber-400">{getRawEntity.id}</span></div>
                        <div>title: <span className="text-emerald-400">"{getRawEntity.title}"</span></div>
                        <div>genreId: <span className="text-amber-400">{getRawEntity.genreId}</span> <span className="text-slate-500">// Ham int ID</span></div>
                        <div>pageCount: <span className="text-amber-400">{getRawEntity.pageCount}</span></div>
                        <div>publishDate: <span className="text-sky-400">"{getRawEntity.publishDate}"</span></div>
                        <div className="pt-2 border-t border-slate-800 text-[11px] text-rose-400">
                          <span className="text-slate-500">// GİZLENMESİ GEREKEN ALANLAR:</span>
                          <div>createdDate: "{getRawEntity.createdDate}"</div>
                          <div>rowVersion: "{getRawEntity.rowVersion}"</div>
                          <div>internalBarcode: "{getRawEntity.internalBarcode}"</div>
                          <div>isDeleted: {String(getRawEntity.isDeleted)}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 italic p-4 text-center">
                        Sorgu sonucu bekleniyor...
                      </div>
                    )}
                  </div>

                  <div className="mt-3 text-[11px] text-amber-400 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Bu entity nesnesi istemciye ASLA gönderilmez!</span>
                  </div>
                </div>

                {/* Returned ViewModel (SAFE) */}
                <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-emerald-200 mb-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        İstemciye Dönen Çıktı (ViewModel)
                      </div>
                      <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                        HTTP 200 OK
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-800 mb-3">
                      AutoMapper ile filtrelenmiş ve formatlanmış <code className="text-emerald-950 font-bold">BookDetailViewModel</code>.
                    </p>

                    {getOutput ? (
                      <div className="font-mono text-xs bg-white p-3 rounded-lg border border-emerald-200 space-y-1 text-slate-800 shadow-xs">
                        <div>"id": <span className="text-indigo-600 font-bold">{getOutput.id}</span>,</div>
                        <div>"title": <span className="text-slate-900 font-bold">"{getOutput.title}"</span>,</div>
                        <div className="bg-emerald-100/60 -mx-1 px-1 rounded">
                          "genre": <span className="text-emerald-700 font-bold">"{getOutput.genre}"</span>,
                          <span className="text-[10px] text-emerald-700 ml-1 font-sans">← string isim!</span>
                        </div>
                        <div>"pageCount": <span className="text-indigo-600">{getOutput.pageCount}</span>,</div>
                        <div className="bg-emerald-100/60 -mx-1 px-1 rounded">
                          "publishDate": <span className="text-emerald-700 font-bold">"{getOutput.publishDate}"</span>
                          <span className="text-[10px] text-emerald-700 ml-1 font-sans">← dd/MM/yyyy!</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 italic p-4 text-center">
                        Sorgu sonucu bekleniyor...
                      </div>
                    )}
                  </div>

                  <div className="mt-3 text-[11px] text-emerald-800 flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Entity'den arındırılmış temiz ViewModel çıktısı.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: UpdateBook Simulation */}
        {activeTab === 'update' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form: UpdateBookModel Input */}
            <form onSubmit={handleRunUpdateBook} className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  PUT /api/books/{'{id}'} Formu
                </div>
                <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  UpdateBookModel
                </span>
              </div>

              {/* Select which book to edit */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Güncellenecek Kitap:
                </label>
                <select
                  value={updateBookId}
                  onChange={(e) => handleSelectBookForUpdate(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-indigo-600"
                >
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      ID: {b.id} - {b.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Input: Title */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kitap Başlığı (Title):
                </label>
                <input
                  type="text"
                  value={updateForm.title}
                  onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}
                  className={`w-full px-3 py-2 text-xs rounded-lg border bg-white focus:outline-indigo-600 ${
                    updateErrors.title ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  }`}
                  placeholder="Kitap adını giriniz..."
                />
                {updateErrors.title && (
                  <p className="mt-1 text-[11px] text-rose-600">{updateErrors.title}</p>
                )}
              </div>

              {/* Input: GenreId */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori Seçimi (GenreId):
                </label>
                <select
                  value={updateForm.genreId}
                  onChange={(e) => setUpdateForm({ ...updateForm, genreId: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-indigo-600"
                >
                  {GENRES.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} (ID: {g.id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Input: PageCount */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sayfa Sayısı (PageCount):
                </label>
                <input
                  type="number"
                  value={updateForm.pageCount}
                  onChange={(e) => setUpdateForm({ ...updateForm, pageCount: Number(e.target.value) })}
                  className={`w-full px-3 py-2 text-xs rounded-lg border bg-white focus:outline-indigo-600 ${
                    updateErrors.pageCount ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  }`}
                />
                {updateErrors.pageCount && (
                  <p className="mt-1 text-[11px] text-rose-600">{updateErrors.pageCount}</p>
                )}
              </div>

              {/* Input: PublishDate */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Yayınlanma Tarihi (PublishDate):
                </label>
                <input
                  type="date"
                  value={updateForm.publishDate}
                  onChange={(e) => setUpdateForm({ ...updateForm, publishDate: e.target.value })}
                  className={`w-full px-3 py-2 text-xs rounded-lg border bg-white focus:outline-indigo-600 ${
                    updateErrors.publishDate ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  }`}
                />
                {updateErrors.publishDate && (
                  <p className="mt-1 text-[11px] text-rose-600">{updateErrors.publishDate}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                UpdateBookCommand.Handle() Çalıştır
              </button>

              {updateSuccessMsg && (
                <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{updateSuccessMsg}</span>
                </div>
              )}
            </form>

            {/* Right Display: Input Payload vs Database State vs Output Model */}
            <div className="lg:col-span-7 space-y-4">
              {/* Step 1: Request Payload sent by client */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <span className="text-xs font-bold text-slate-900 uppercase">
                    1. Gelen HTTP Request Body (UpdateBookModel)
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">JSON Payload</span>
                </div>
                <pre className="font-mono text-xs bg-slate-50 p-3 rounded-lg text-slate-800 border border-slate-200 overflow-x-auto">
{JSON.stringify(
  {
    title: updateForm.title,
    genreId: updateForm.genreId,
    pageCount: Number(updateForm.pageCount),
    publishDate: updateForm.publishDate,
  },
  null,
  2
)}
                </pre>
                <p className="mt-2 text-[11px] text-slate-500">
                  Notice: Model içinde <code className="text-slate-700 font-semibold">Id</code> veya veritabanı audit alanları yer almaz.
                </p>
              </div>

              {/* Step 2: Output ViewModel returned */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-100 mb-2">
                  <span className="text-xs font-bold text-emerald-950 uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    2. İstemciye Dönen Yanıt (UpdateBookViewModel)
                  </span>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    HTTP 200 OK
                  </span>
                </div>

                {updateOutput ? (
                  <pre className="font-mono text-xs bg-white p-3 rounded-lg text-slate-800 border border-emerald-200 overflow-x-auto">
{JSON.stringify(updateOutput, null, 2)}
                  </pre>
                ) : (
                  <div className="text-xs text-slate-500 italic p-3 bg-white rounded-lg border border-slate-200 text-center">
                    Güncelleme butonuna bastığınızda üretilen UpdateBookViewModel burada görünecektir.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Security Over-Posting Test */}
        {activeTab === 'security' && (
          <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200">
            <div className="max-w-3xl mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 mb-2">
                <ShieldAlert className="w-3.5 h-3.5" />
                Güvenlik Açığı Deneyi (Mass Assignment / Over-Posting)
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Neden Entity ile Güncelleme Yapmak Güvenlik Felaketidir?
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Kötü niyetli bir kullanıcı API'ye fazladan alanlar (<code className="font-mono text-rose-700">"id": 9999</code>,{' '}
                <code className="font-mono text-rose-700">"isDeleted": true</code>, <code className="font-mono text-rose-700">"createdDate": "1990-01-01"</code>)
                enjekte etmeye çalışırsa ne olur?
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Malicious Payload Box */}
              <div className="p-4 rounded-xl border border-rose-300 bg-white">
                <div className="flex items-center justify-between pb-2 border-b border-rose-100 mb-2">
                  <span className="text-xs font-bold text-rose-900 uppercase">
                    Zararlı Payload (Hacker Request)
                  </span>
                  <span className="text-[10px] font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                    Injected JSON
                  </span>
                </div>
                <pre className="font-mono text-xs bg-rose-50/50 p-3 rounded-lg text-slate-800 border border-rose-200 overflow-x-auto">
{`{
  "title": "Hacked Title",
  "genreId": 2,
  "pageCount": 500,
  "publishDate": "2020-01-01",
  // HACKERIN EKLEDİĞİ YASAKLI ALANLAR:
  "id": 9999,
  "isDeleted": true,
  "rowVersion": "0xHACKED_BY_ATTACKER",
  "createdDate": "1970-01-01T00:00:00Z"
}`}
                </pre>
                <button
                  type="button"
                  onClick={() => setHackAttempted(true)}
                  className="mt-3 w-full py-2 px-3 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5" />
                  Saldırıyı Simüle Et
                </button>
              </div>

              {/* Defense Result */}
              <div className="p-4 rounded-xl border border-emerald-300 bg-white">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-100 mb-2">
                  <span className="text-xs font-bold text-emerald-950 uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Enes Öztürk Model Savunması
                  </span>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Model Binder Filtresi
                  </span>
                </div>

                {hackAttempted ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                      <div className="font-bold">🛡️ Saldırı Başarıyla Bertaraf Edildi!</div>
                      <p className="text-[11px] text-emerald-800 leading-normal">
                        Controller metodu <code className="font-mono text-emerald-950 font-bold">UpdateBookModel</code> beklediği için;
                        C# ASP.NET Core Model Binder sadece modelde tanımlı olan 4 alanı bağladı:
                      </p>
                      <ul className="list-disc list-inside text-[11px] text-emerald-800 font-mono mt-1 space-y-0.5">
                        <li>Title: "Hacked Title" (İzinli)</li>
                        <li>GenreId: 2 (İzinli)</li>
                        <li>PageCount: 500 (İzinli)</li>
                        <li>PublishDate: 2020-01-01 (İzinli)</li>
                      </ul>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900 text-white font-mono text-xs">
                      <div className="text-[11px] text-slate-400 mb-1">// Veritabanı Entity Durumu:</div>
                      <div>isDeleted: <span className="text-emerald-400">false</span> <span className="text-slate-500">(Ezilmedi!)</span></div>
                      <div>id: <span className="text-emerald-400">1</span> <span className="text-slate-500">(Ezilmedi!)</span></div>
                      <div>rowVersion: <span className="text-emerald-400">0x000000000001A4B2</span> <span className="text-slate-500">(Güvende)</span></div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500 italic">
                    "Saldırıyı Simüle Et" butonuna tıklayarak Model sınıfının Entity bütünlüğünü nasıl koruduğunu test edin.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
