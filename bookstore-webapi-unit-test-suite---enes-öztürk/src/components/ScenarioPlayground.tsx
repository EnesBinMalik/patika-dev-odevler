/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Author: Enes Öztürk
 * Project: BookStore WebApi Unit Testing Suite (.NET Core)
 */

import React, { useState } from 'react';
import { Play, CheckCircle2, AlertTriangle, XCircle, Code2, Sparkles } from 'lucide-react';

interface SimulatedBook {
  id: number;
  title: string;
  genreId: number;
  authorId: number;
}

interface SimulatedGenre {
  id: number;
  name: string;
  isActive: boolean;
}

interface SimulatedAuthor {
  id: number;
  name: string;
  surname: string;
  birthYear: number;
  hasBooks: boolean;
}

export const ScenarioPlayground: React.FC = () => {
  // Mock DB State for interactive simulator
  const [books] = useState<SimulatedBook[]>([
    { id: 1, title: 'Lean Startup', genreId: 1, authorId: 1 },
    { id: 2, title: 'Dune', genreId: 2, authorId: 2 },
    { id: 3, title: 'Dune Mesihi', genreId: 2, authorId: 2 },
  ]);

  const [genres] = useState<SimulatedGenre[]>([
    { id: 1, name: 'Personal Growth', isActive: true },
    { id: 2, name: 'Science Fiction', isActive: true },
    { id: 3, name: 'Noval', isActive: true },
  ]);

  const [authors] = useState<SimulatedAuthor[]>([
    { id: 1, name: 'Eric', surname: 'Ries', birthYear: 1978, hasBooks: true },
    { id: 2, name: 'Frank', surname: 'Herbert', birthYear: 1920, hasBooks: true },
    { id: 3, name: 'Enes', surname: 'Öztürk', birthYear: 1998, hasBooks: false },
  ]);

  // Selected Service
  const [selectedService, setSelectedService] = useState<'DeleteBook' | 'UpdateBook' | 'CreateGenre' | 'DeleteGenre' | 'UpdateGenre' | 'CreateAuthor' | 'DeleteAuthor' | 'UpdateAuthor'>('DeleteAuthor');

  // Input states
  const [inputId, setInputId] = useState<number>(3); // Default to Enes Öztürk (author without books)
  const [inputTitle, setInputTitle] = useState('Yapay Zeka ve Testler');
  const [inputName, setInputName] = useState('Enes');
  const [inputSurname, setInputSurname] = useState('Öztürk');
  const [inputGenreId, setInputGenreId] = useState(2);
  const [inputBirthYear, setInputBirthYear] = useState(1998);

  // Result state
  const [validationErrors, setValidationErrors] = useState<string[] | null>(null);
  const [executionResult, setExecutionResult] = useState<{
    status: 'success' | 'exception';
    message: string;
    matchingTestCode: string;
  } | null>(null);

  // Execute Simulation
  const runSimulation = () => {
    const errors: string[] = [];
    let resultStatus: 'success' | 'exception' = 'success';
    let resultMsg = '';
    let testCode = '';

    if (selectedService === 'DeleteBook') {
      // Validator
      if (inputId <= 0) {
        errors.push("FluentValidation: 'BookId' 0'dan büyük olmalıdır.");
      }
      // Handler
      const exists = books.some(b => b.id === inputId);
      if (!exists) {
        resultStatus = 'exception';
        resultMsg = 'InvalidOperationException: "Silinecek kitap bulunamadı!"';
        testCode = `FluentActions.Invoking(() => command.Handle())\n    .Should().Throw<InvalidOperationException>()\n    .And.Message.Should().Be("Silinecek kitap bulunamadı!");`;
      } else {
        resultStatus = 'success';
        resultMsg = `Kitap (ID: ${inputId}) veritabanından başarıyla silindi.`;
        testCode = `FluentActions.Invoking(() => command.Handle()).Invoke();\n_context.Books.SingleOrDefault(b => b.Id == ${inputId}).Should().BeNull();`;
      }
    } else if (selectedService === 'UpdateBook') {
      if (inputId <= 0) errors.push("FluentValidation: 'BookId' 0'dan büyük olmalıdır.");
      if (!inputTitle || inputTitle.trim().length < 4) errors.push("FluentValidation: 'Title' en az 4 karakter olmalıdır.");
      if (inputGenreId <= 0) errors.push("FluentValidation: 'GenreId' 0'dan büyük olmalıdır.");

      const exists = books.some(b => b.id === inputId);
      if (!exists) {
        resultStatus = 'exception';
        resultMsg = 'InvalidOperationException: "Güncellenecek kitap bulunamadı!"';
        testCode = `FluentActions.Invoking(() => command.Handle())\n    .Should().Throw<InvalidOperationException>()\n    .And.Message.Should().Be("Güncellenecek kitap bulunamadı!");`;
      } else {
        resultStatus = 'success';
        resultMsg = `Kitap (ID: ${inputId}) güncellendi: "${inputTitle}" (GenreId: ${inputGenreId})`;
        testCode = `FluentActions.Invoking(() => command.Handle()).Invoke();\nupdatedBook.Title.Should().Be("${inputTitle}");`;
      }
    } else if (selectedService === 'CreateGenre') {
      if (!inputName || inputName.trim().length < 4) {
        errors.push("FluentValidation: 'Name' boş olamaz ve en az 4 karakter olmalıdır.");
      }

      const duplicate = genres.some(g => g.name.toLowerCase() === inputName.trim().toLowerCase());
      if (duplicate) {
        resultStatus = 'exception';
        resultMsg = 'InvalidOperationException: "Kitap türü zaten mevcut!"';
        testCode = `FluentActions.Invoking(() => command.Handle())\n    .Should().Throw<InvalidOperationException>()\n    .And.Message.Should().Be("Kitap türü zaten mevcut!");`;
      } else {
        resultStatus = 'success';
        resultMsg = `Yeni tür ("${inputName}") veritabanına eklendi (IsActive: true).`;
        testCode = `FluentActions.Invoking(() => command.Handle()).Invoke();\n_context.Genres.SingleOrDefault(g => g.Name == "${inputName}").Should().NotBeNull();`;
      }
    } else if (selectedService === 'DeleteGenre') {
      if (inputId <= 0) errors.push("FluentValidation: 'GenreId' 0'dan büyük olmalıdır.");

      const exists = genres.some(g => g.id === inputId);
      if (!exists) {
        resultStatus = 'exception';
        resultMsg = 'InvalidOperationException: "Kitap türü bulunamadı!"';
        testCode = `FluentActions.Invoking(() => command.Handle())\n    .Should().Throw<InvalidOperationException>()\n    .And.Message.Should().Be("Kitap türü bulunamadı!");`;
      } else {
        resultStatus = 'success';
        resultMsg = `Tür (ID: ${inputId}) veritabanından silindi.`;
        testCode = `FluentActions.Invoking(() => command.Handle()).Invoke();\n_context.Genres.SingleOrDefault(g => g.Id == ${inputId}).Should().BeNull();`;
      }
    } else if (selectedService === 'UpdateGenre') {
      if (inputId <= 0) errors.push("FluentValidation: 'GenreId' 0'dan büyük olmalıdır.");
      if (inputName && inputName.trim().length < 4) errors.push("FluentValidation: 'Name' 4 karakterden az olamaz.");

      const exists = genres.some(g => g.id === inputId);
      if (!exists) {
        resultStatus = 'exception';
        resultMsg = 'InvalidOperationException: "Güncellenecek kitap türü bulunamadı!"';
        testCode = `FluentActions.Invoking(() => command.Handle())\n    .Should().Throw<InvalidOperationException>()\n    .And.Message.Should().Be("Güncellenecek kitap türü bulunamadı!");`;
      } else {
        const duplicate = genres.some(g => g.id !== inputId && g.name.toLowerCase() === inputName.trim().toLowerCase());
        if (duplicate) {
          resultStatus = 'exception';
          resultMsg = 'InvalidOperationException: "Aynı isimli bir kitap türü zaten mevcut!"';
          testCode = `FluentActions.Invoking(() => command.Handle())\n    .Should().Throw<InvalidOperationException>()\n    .And.Message.Should().Be("Aynı isimli bir kitap türü zaten mevcut!");`;
        } else {
          resultStatus = 'success';
          resultMsg = `Tür (ID: ${inputId}) "${inputName}" olarak güncellendi.`;
          testCode = `FluentActions.Invoking(() => command.Handle()).Invoke();\nupdatedGenre.Name.Should().Be("${inputName}");`;
        }
      }
    } else if (selectedService === 'CreateAuthor') {
      if (!inputName || inputName.trim().length < 2) errors.push("FluentValidation: 'Name' en az 2 karakter olmalıdır.");
      if (!inputSurname || inputSurname.trim().length < 2) errors.push("FluentValidation: 'Surname' en az 2 karakter olmalıdır.");
      if (inputBirthYear > new Date().getFullYear()) errors.push("FluentValidation: 'DateOfBirth' bugünden küçük olmalıdır.");

      const duplicate = authors.some(a => a.name.toLowerCase() === inputName.toLowerCase() && a.surname.toLowerCase() === inputSurname.toLowerCase());
      if (duplicate) {
        resultStatus = 'exception';
        resultMsg = 'InvalidOperationException: "Yazar zaten mevcut!"';
        testCode = `FluentActions.Invoking(() => command.Handle())\n    .Should().Throw<InvalidOperationException>()\n    .And.Message.Should().Be("Yazar zaten mevcut!");`;
      } else if (inputBirthYear > new Date().getFullYear()) {
        resultStatus = 'exception';
        resultMsg = 'InvalidOperationException: "Yazarın doğum tarihi bugünden ileri bir tarih olamaz!"';
        testCode = `FluentActions.Invoking(() => command.Handle())\n    .Should().Throw<InvalidOperationException>()\n    .And.Message.Should().Be("Yazarın doğum tarihi bugünden ileri bir tarih olamaz!");`;
      } else {
        resultStatus = 'success';
        resultMsg = `Yeni yazar ("${inputName} ${inputSurname}") veritabanına kaydedildi.`;
        testCode = `FluentActions.Invoking(() => command.Handle()).Invoke();\n_context.Authors.SingleOrDefault(a => a.Name == "${inputName}").Should().NotBeNull();`;
      }
    } else if (selectedService === 'DeleteAuthor') {
      if (inputId <= 0) errors.push("FluentValidation: 'AuthorId' 0'dan büyük olmalıdır.");

      const author = authors.find(a => a.id === inputId);
      if (!author) {
        resultStatus = 'exception';
        resultMsg = 'InvalidOperationException: "Silinecek yazar bulunamadı!"';
        testCode = `FluentActions.Invoking(() => command.Handle())\n    .Should().Throw<InvalidOperationException>()\n    .And.Message.Should().Be("Silinecek yazar bulunamadı!");`;
      } else if (author.hasBooks) {
        // Critical business rule!
        resultStatus = 'exception';
        resultMsg = 'InvalidOperationException: "Yayında kitabı bulunan bir yazar silinemez! Önce yazarın kitaplarını siliniz."';
        testCode = `// Kritik İş Kuralı Testi - Enes Öztürk\nFluentActions.Invoking(() => command.Handle())\n    .Should().Throw<InvalidOperationException>()\n    .And.Message.Should().Be("Yayında kitabı bulunan bir yazar silinemez! Önce yazarın kitaplarını siliniz.");`;
      } else {
        resultStatus = 'success';
        resultMsg = `Yazar (${author.name} ${author.surname}, ID: ${inputId}) yayında kitabı olmadığı için başarıyla silindi.`;
        testCode = `FluentActions.Invoking(() => command.Handle()).Invoke();\n_context.Authors.SingleOrDefault(a => a.Id == ${inputId}).Should().BeNull();`;
      }
    } else if (selectedService === 'UpdateAuthor') {
      if (inputId <= 0) errors.push("FluentValidation: 'AuthorId' 0'dan büyük olmalıdır.");
      if (inputName && inputName.trim().length < 2) errors.push("FluentValidation: 'Name' 2 karakterden kısa olamaz.");

      const author = authors.find(a => a.id === inputId);
      if (!author) {
        resultStatus = 'exception';
        resultMsg = 'InvalidOperationException: "Güncellenecek yazar bulunamadı!"';
        testCode = `FluentActions.Invoking(() => command.Handle())\n    .Should().Throw<InvalidOperationException>()\n    .And.Message.Should().Be("Güncellenecek yazar bulunamadı!");`;
      } else {
        resultStatus = 'success';
        resultMsg = `Yazar güncellendi: ${inputName} ${inputSurname}`;
        testCode = `FluentActions.Invoking(() => command.Handle()).Invoke();\nupdatedAuthor.Name.Should().Be("${inputName}");`;
      }
    }

    setValidationErrors(errors);
    setExecutionResult({
      status: resultStatus,
      message: resultMsg,
      matchingTestCode: testCode,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>İnteraktif Senaryo Laboratuvarı</span>
              <span aria-hidden="true">·</span>
              <span className="text-indigo-400 font-medium">Geliştirici: Enes Öztürk</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Birim Test Senaryo Simülatörü
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Farklı parametre kombinasyonları (geçersiz ID, duplicate tür, yayında kitabı olan yazar) girerek hem FluentValidation hem de CQRS Handler davranışını test edebilir, bu senaryonun xUnit birim test karşılığını görebilirsiniz.
            </p>
          </div>

          <button
            onClick={runSimulation}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 transition-colors shadow-sm shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Senaryoyu Koş</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Test Edilecek Servis
            </label>
            <select
              value={selectedService}
              onChange={(e) => {
                setSelectedService(e.target.value as any);
                setValidationErrors(null);
                setExecutionResult(null);
              }}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              <optgroup label="1. Book Servisleri">
                <option value="DeleteBook">DeleteBookCommand & Validator</option>
                <option value="UpdateBook">UpdateBookCommand & Validator</option>
              </optgroup>
              <optgroup label="2. Genre Servisleri">
                <option value="CreateGenre">CreateGenreCommand & Validator</option>
                <option value="DeleteGenre">DeleteGenreCommand & Validator</option>
                <option value="UpdateGenre">UpdateGenreCommand & Validator</option>
              </optgroup>
              <optgroup label="3. Author Servisleri (Enes Öztürk İmzalı)">
                <option value="DeleteAuthor">DeleteAuthorCommand (Kitap Kontrol Kuralı)</option>
                <option value="CreateAuthor">CreateAuthorCommand & Validator</option>
                <option value="UpdateAuthor">UpdateAuthorCommand & Validator</option>
              </optgroup>
            </select>
          </div>

          {/* Preset Buttons for Quick Evaluation */}
          <div>
            <div className="text-[11px] font-medium text-slate-400 mb-1.5">Hızlı Test Senaryoları:</div>
            <div className="flex flex-wrap gap-1.5">
              {selectedService === 'DeleteAuthor' && (
                <>
                  <button
                    onClick={() => { setInputId(2); }}
                    className="text-[11px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded border border-slate-700"
                  >
                    Kitabı Olan Yazar (ID: 2 - Hata Almalı)
                  </button>
                  <button
                    onClick={() => { setInputId(3); }}
                    className="text-[11px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded border border-slate-700"
                  >
                    Kitabı Olmayan (Enes Öztürk, ID: 3 - Başarılı)
                  </button>
                  <button
                    onClick={() => { setInputId(0); }}
                    className="text-[11px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded border border-slate-700"
                  >
                    Geçersiz ID (0 - Validator Hatası)
                  </button>
                </>
              )}

              {selectedService === 'CreateGenre' && (
                <>
                  <button
                    onClick={() => { setInputName('Science Fiction'); }}
                    className="text-[11px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded border border-slate-700"
                  >
                    Zaten Var Olan Tür ("Science Fiction")
                  </button>
                  <button
                    onClick={() => { setInputName('Cyberpunk - Enes Öztürk'); }}
                    className="text-[11px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded border border-slate-700"
                  >
                    Geçerli Yeni Tür
                  </button>
                  <button
                    onClick={() => { setInputName('abc'); }}
                    className="text-[11px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded border border-slate-700"
                  >
                    Kısa İsim ('abc' - Validator Hatası)
                  </button>
                </>
              )}

              {selectedService === 'DeleteBook' && (
                <>
                  <button
                    onClick={() => { setInputId(1); }}
                    className="text-[11px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded border border-slate-700"
                  >
                    Var Olan Kitap (ID: 1)
                  </button>
                  <button
                    onClick={() => { setInputId(999); }}
                    className="text-[11px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded border border-slate-700"
                  >
                    Olmayan Kitap (ID: 999)
                  </button>
                  <button
                    onClick={() => { setInputId(-1); }}
                    className="text-[11px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded border border-slate-700"
                  >
                    Negatif ID (-1)
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Dynamic Inputs depending on service */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Hedef Kayıt ID (BookId / GenreId / AuthorId)
              </label>
              <input
                type="number"
                value={inputId}
                onChange={(e) => setInputId(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 font-mono tabular-nums focus:outline-none focus:border-indigo-500"
              />
            </div>

            {(selectedService === 'CreateGenre' || selectedService === 'UpdateGenre' || selectedService === 'CreateAuthor' || selectedService === 'UpdateAuthor') && (
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  {selectedService.includes('Genre') ? 'Tür Adı (Name)' : 'Yazar Adı (Name)'}
                </label>
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            {(selectedService === 'CreateAuthor' || selectedService === 'UpdateAuthor') && (
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Yazar Soyadı (Surname)
                </label>
                <input
                  type="text"
                  value={inputSurname}
                  onChange={(e) => setInputSurname(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            {selectedService === 'CreateAuthor' && (
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Doğum Yılı (DateOfBirth Yılı)
                </label>
                <input
                  type="number"
                  value={inputBirthYear}
                  onChange={(e) => setInputBirthYear(parseInt(e.target.value) || 2000)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 font-mono tabular-nums focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            {selectedService === 'UpdateBook' && (
              <>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Kitap Başlığı (Title)</label>
                  <input
                    type="text"
                    value={inputTitle}
                    onChange={(e) => setInputTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Tür ID (GenreId)</label>
                  <input
                    type="number"
                    value={inputGenreId}
                    onChange={(e) => setInputGenreId(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 font-mono tabular-nums focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Execution & Assertion Output */}
        <div className="lg:col-span-7 space-y-4">
          {/* Validator Output Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-300">
                1. FluentValidation Doğrulama Sonucu
              </span>
              {validationErrors === null ? (
                <span className="text-xs text-slate-500">Beklemede</span>
              ) : validationErrors.length === 0 ? (
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Geçerli (0 Hata)
                </span>
              ) : (
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" />
                  {validationErrors.length} Hata Bulundu
                </span>
              )}
            </div>

            <div className="pt-3">
              {validationErrors === null ? (
                <p className="text-xs text-slate-500">
                  "Senaryoyu Koş" butonuna tıklayarak validator çıktısını gözlemleyin.
                </p>
              ) : validationErrors.length === 0 ? (
                <div className="text-xs text-emerald-300 bg-emerald-950/40 p-2.5 rounded border border-emerald-900/40">
                  Tüm FluentValidation kurallarından başarıyla geçildi (Errors.Count == 0).
                </div>
              ) : (
                <div className="space-y-1">
                  {validationErrors.map((err, i) => (
                    <div key={i} className="text-xs text-rose-300 bg-rose-950/40 p-2 rounded border border-rose-900/40 font-mono">
                      {err}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Handler Execution Output Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-300">
                2. Command Handler / EF Core Çalışma Sonucu
              </span>
              {executionResult && (
                <span
                  className={`text-xs font-semibold flex items-center gap-1 ${
                    executionResult.status === 'success' ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {executionResult.status === 'success' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Başarılı İşlem
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" /> İstisna Fırlatıldı
                    </>
                  )}
                </span>
              )}
            </div>

            <div className="pt-3">
              {executionResult ? (
                <div
                  className={`text-xs p-3 rounded font-mono border ${
                    executionResult.status === 'success'
                      ? 'bg-emerald-950/40 text-emerald-300 border-emerald-900/40'
                      : 'bg-amber-950/40 text-amber-300 border-amber-900/40'
                  }`}
                >
                  {executionResult.message}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Handler sonucu burada görüntülenecektir.
                </p>
              )}
            </div>
          </div>

          {/* Unit Test Code Link */}
          {executionResult && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 pb-2">
                <Code2 className="w-4 h-4" />
                <span>Bu Senaryoyu Test Eden xUnit & FluentAssertions Kodu:</span>
              </div>
              <pre className="p-3 bg-slate-900 border border-slate-800 rounded font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre">
                <code>{executionResult.matchingTestCode}</code>
              </pre>
              <div className="mt-2 text-[11px] text-slate-500 text-right">
                Hazırlayan: Enes Öztürk
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
