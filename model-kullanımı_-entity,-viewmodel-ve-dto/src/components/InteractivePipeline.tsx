import React, { useState, useId } from 'react';
import { Play, RotateCcw, CheckCircle, ArrowRight, ShieldCheck, Database, Layout, Send, Lock } from 'lucide-react';

export const InteractivePipeline: React.FC = () => {
  // Form State
  const [firstName, setFirstName] = useState('Ahmet');
  const [lastName, setLastName] = useState('Yılmaz');
  const [email, setEmail] = useState('ahmet.yilmaz@ornek.com');
  const [password, setPassword] = useState('GuvenliSifre*2026');
  const [confirmPassword, setConfirmPassword] = useState('GuvenliSifre*2026');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [department, setDepartment] = useState('Yazılım Geliştirme');

  // Simulator step (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState(false);

  // Derived Values
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isFormValid = firstName && lastName && email.includes('@') && passwordsMatch && termsAccepted;

  // Mock Generated IDs & Hash
  const mockUserId = 'e4b892a1-7c93-4e89-b912-3f8d7c2a5109';
  const mockHash = 'd7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592';
  const mockSalt = 'a9f24c81b072d';

  const runSimulation = () => {
    setIsSimulating(true);
    setCurrentStep(1);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 5) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setIsSimulating(false);
          return 5;
        }
      });
    }, 700);
  };

  const resetSimulation = () => {
    setCurrentStep(1);
    setIsSimulating(false);
  };

  // Pipeline Step Details
  const steps = [
    {
      num: 1,
      title: '1. UI Form (Ekran)',
      model: 'Raw Form Input',
      layer: 'Kullanıcı Ekranı',
      icon: Layout,
      color: 'text-slate-700 dark:text-slate-200',
    },
    {
      num: 2,
      title: '2. ViewModel',
      model: 'UserRegisterViewModel',
      layer: 'Presentation Layer',
      icon: Layout,
      color: 'text-amber-600 dark:text-amber-400',
    },
    {
      num: 3,
      title: '3. Request DTO',
      model: 'CreateUserRequestDto',
      layer: 'API / Network Layer',
      icon: Send,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      num: 4,
      title: '4. Entity (Domain)',
      model: 'User (Entity Framework)',
      layer: 'Domain & Database',
      icon: Database,
      color: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      num: 5,
      title: '5. Response DTO & View',
      model: 'UserResponseDto / UserProfileVM',
      layer: 'API Response ➔ UI',
      icon: ShieldCheck,
      color: 'text-indigo-600 dark:text-indigo-400',
    },
  ];

  return (
    <section id="pipeline" className="py-12 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-8">
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            03. Canlı İnteraktif Simülatör
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Veri Dönüşüm Hattı: Formdan Veritabanına ve Geriye
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-3xl">
            Aşağıdaki form verilerini değiştirerek veya doğrudan simülasyonu başlatarak verinin formdan ViewModel’e, oradan DTO’ya, ardından hashlenerek Entity’ye ve nihayet güvenli bir Response DTO olarak arayüze dönüşümünü adım adım canlı takip edin.
          </p>
        </div>

        {/* Stepper Navigation Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8">
          {steps.map((st) => {
            const Icon = st.icon;
            const isActive = currentStep === st.num;
            const isCompleted = currentStep > st.num;
            return (
              <button
                key={st.num}
                onClick={() => setCurrentStep(st.num)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 border-indigo-600 dark:border-indigo-500 shadow-sm ring-2 ring-indigo-500/20'
                    : isCompleted
                    ? 'bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Adım {st.num}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${st.color}`} />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {st.model}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {st.layer}
                </div>
              </button>
            );
          })}
        </div>

        {/* Two-Column Simulation Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Form & Controls */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700 mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Kullanıcı Kayıt Formu (Girdi)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Simüle edilecek ham form girdileri
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetSimulation}
                  disabled={isSimulating}
                  title="Sıfırla"
                  className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={runSimulation}
                  disabled={isSimulating || !isFormValid}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isSimulating ? 'Dönüştürülüyor...' : 'Akışı Simüle Et'}</span>
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Adınız
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Soyadınız
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  E-Posta Adresi
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Şifre
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Şifre Tekrarı (UI)
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 text-xs ${
                      passwordsMatch
                        ? 'border-emerald-500 focus:ring-emerald-500'
                        : 'border-rose-400 focus:ring-rose-500'
                    }`}
                  />
                </div>
              </div>

              {!passwordsMatch && (
                <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                  UYARI: Şifreler uyuşmuyor! ViewModel [Compare] kuralı hata verecektir.
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Departman Seçimi (UI Dropdown SelectList)
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                >
                  <option value="Yazılım Geliştirme">Yazılım Geliştirme</option>
                  <option value="Sistem & Bulut Mimarisi">Sistem & Bulut Mimarisi</option>
                  <option value="Veri Bilimi">Veri Bilimi</option>
                  <option value="Ürün Yönetimi">Ürün Yönetimi</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    Kullanıcı sözleşmesini okudum ve kabul ediyorum
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Live Model State & Transformation Inspector */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            {/* Step Details Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-700 mb-5">
              <div>
                <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                  Aktif Aşama: Adım {currentStep} / 5
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {currentStep === 1 && '1. Aşama: Kullanıcı Arayüzü Form Girdisi'}
                  {currentStep === 2 && '2. Aşama: UserRegisterViewModel (Sunum Katmanı)'}
                  {currentStep === 3 && '3. Aşama: CreateUserRequestDto (Ağ / API Yükü)'}
                  {currentStep === 4 && '4. Aşama: User Entity (Veritabanı & Domain)'}
                  {currentStep === 5 && '5. Aşama: UserResponseDto & UserProfileViewModel'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                  disabled={currentStep === 1}
                  className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-40 cursor-pointer"
                >
                  Önceki
                </button>
                <button
                  onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
                  disabled={currentStep === 5}
                  className="px-2.5 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-40 cursor-pointer"
                >
                  Sonraki Adım
                </button>
              </div>
            </div>

            {/* Dynamic Step Content Explanation */}
            <div className="mb-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {currentStep === 1 && (
                <div>
                  <strong className="text-slate-900 dark:text-white">Arayüzden Gelen Ham Veri:</strong> Henüz hiçbir validasyon çalışmadı. Kullanıcı formdaki metin kutularına veri yazdı.
                </div>
              )}
              {currentStep === 2 && (
                <div>
                  <strong className="text-amber-800 dark:text-amber-400">ViewModel Devrede:</strong> Arayüzün ihtiyaç duyduğu <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">ConfirmPassword</code>, <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">TermsAccepted</code> ve <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">DepartmentList</code> alanları burada toplanır. <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">[Compare("Password")]</code> validasyonu çalışarak şifre teyidi yapılır.
                </div>
              )}
              {currentStep === 3 && (
                <div>
                  <strong className="text-blue-800 dark:text-blue-400">DTO’ya Dönüştürüldü (Mapping):</strong> Sunucuya JSON olarak gönderilecek paket hazırlandı. Arayüze özel olan <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">ConfirmPassword</code> ve <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">DepartmentList</code> ağ trafiğinden çıkarıldı! Yalnızca backend’in ihtiyaç duyduğu asgari veri taşınıyor.
                </div>
              )}
              {currentStep === 4 && (
                <div>
                  <strong className="text-emerald-800 dark:text-emerald-400">Veritabanı Entity’si Oluşturuldu:</strong> Şifre asla düz metin olarak kaydedilmez. BCrypt/PBKDF2 algoritmasıyla <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">PasswordHash</code> ve <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">PasswordSalt</code> üretildi. <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">Id = Guid.NewGuid()</code>, <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">CreatedAt = UtcNow</code> ve güvenlik için <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">IsAdmin = false</code> atandı!
                </div>
              )}
              {currentStep === 5 && (
                <div>
                  <strong className="text-indigo-800 dark:text-indigo-400">Güvenli İstemci Yanıtı (Response):</strong> Veritabanından gelen Entity doğrudan dönülmedi! <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">PasswordHash</code> ve <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">PasswordSalt</code> gizlendi. Frontend için ad ve soyad birleştirilerek <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">FullName: "{firstName} {lastName}"</code> sunum modeline aktarıldı.
                </div>
              )}
            </div>

            {/* Live Model Inspector (Code Box) */}
            <div className="bg-slate-950 text-slate-100 rounded-xl p-4 font-mono text-xs overflow-x-auto border border-slate-800">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span>CANLI NESNE BELLEK GÖRÜNTÜSÜ (IN-MEMORY OBJECT DUMP)</span>
                <span className="text-indigo-400">
                  {currentStep === 2 && 'C# Strongly-Typed ViewModel'}
                  {currentStep === 3 && 'HTTP Request Body (JSON)'}
                  {currentStep === 4 && 'Database Row (EF Core Entity)'}
                  {currentStep === 5 && 'HTTP Response Body (JSON)'}
                  {currentStep === 1 && 'DOM Form Values'}
                </span>
              </div>

              <pre className="leading-relaxed">
                {currentStep === 1 &&
                  JSON.stringify(
                    {
                      DOM_Inputs: {
                        txtFirstName: firstName,
                        txtLastName: lastName,
                        txtEmail: email,
                        txtPassword: '●●●●●●●●',
                        txtConfirmPassword: '●●●●●●●●',
                        chkTerms: termsAccepted,
                        ddlDepartment: department,
                      },
                    },
                    null,
                    2
                  )}

                {currentStep === 2 &&
                  JSON.stringify(
                    {
                      __class: 'UserRegisterViewModel',
                      Email: email,
                      Password: '●●●●●●●●',
                      ConfirmPassword: '●●●●●●●●',
                      FirstName: firstName,
                      LastName: lastName,
                      TermsAccepted: termsAccepted,
                      AvailableDepartments: [
                        'Yazılım Geliştirme',
                        'Sistem & Bulut Mimarisi',
                        'Veri Bilimi',
                        'Ürün Yönetimi',
                      ],
                      SelectedDepartment: department,
                      __validationState: {
                        IsValid: isFormValid,
                        PasswordsMatch: passwordsMatch,
                      },
                    },
                    null,
                    2
                  )}

                {currentStep === 3 &&
                  JSON.stringify(
                    {
                      __class: 'CreateUserRequestDto',
                      email: email,
                      password: password,
                      firstName: firstName,
                      lastName: lastName,
                      department: department,
                      /* DİKKAT: ConfirmPassword ve Dropdown Listesi Ağ Yükünden Atıldı! */
                    },
                    null,
                    2
                  )}

                {currentStep === 4 &&
                  JSON.stringify(
                    {
                      __class: 'Homework.Domain.Entities.User',
                      Id: mockUserId,
                      Email: email,
                      FirstName: firstName,
                      LastName: lastName,
                      Department: department,
                      /* GÜVENLİK ALANLARI HASH'LENDİ: */
                      PasswordHash: mockHash,
                      PasswordSalt: mockSalt,
                      IsAdmin: false,
                      IsActive: true,
                      IsDeleted: false,
                      CreatedAt: '2026-11-05T17:38:00.000Z',
                      Orders: [],
                    },
                    null,
                    2
                  )}

                {currentStep === 5 &&
                  JSON.stringify(
                    {
                      __class: 'UserResponseDto',
                      id: mockUserId,
                      email: email,
                      fullName: `${firstName} ${lastName}`,
                      department: department,
                      isActive: true,
                      createdAtFormatted: '5 Kasım 2026',
                      /* GÜVENLİK KORUNDU: PasswordHash & Salt DIŞARIYA SIZMADI! */
                    },
                    null,
                    2
                  )}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
