import React, { useState } from 'react';
import {
  Account,
  Address,
  AddressManager,
  BusinessAddress,
  CarInsurance,
  HealthInsurance,
  HomeAddress,
  Insurance,
  ResidenceInsurance,
  TravelInsurance,
} from '../types/insurance';
import {
  Shield,
  Home,
  Briefcase,
  Plus,
  Trash2,
  HeartPulse,
  Car,
  Plane,
  Building2,
  Calendar,
  CheckCircle2,
  Info,
  Terminal,
  FileText,
} from 'lucide-react';

interface DashboardViewProps {
  account: Account;
  onUpdateAccount: () => void;
  onOpenTerminal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  account,
  onUpdateAccount,
  onOpenTerminal,
}) => {
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [addressType, setAddressType] = useState<'HOME' | 'BUSINESS'>('HOME');
  const [addressForm, setAddressForm] = useState({
    street: '',
    buildingNo: '',
    apartmentNo: '',
    district: 'Kadıköy',
    city: 'İstanbul',
    postalCode: '34710',
    companyName: '',
    floorAndOffice: '',
    taxNumber: '',
  });

  const [showAddInsuranceModal, setShowAddInsuranceModal] = useState(false);
  const [selectedInsuranceType, setSelectedInsuranceType] = useState<
    'HEALTH' | 'RESIDENCE' | 'TRAVEL' | 'CAR'
  >('HEALTH');

  // Insurance form states
  const [healthForm, setHealthForm] = useState({
    name: 'Tam Kapsamlı Özel Sağlık Poliçesi',
    hasChronicDisease: false,
    coveragePlan: 'STANDARD' as 'STANDARD' | 'VIP',
  });

  const [residenceForm, setResidenceForm] = useState({
    name: 'Genişletilmiş Konut ve Eşya Güvencesi',
    squareMeters: 120,
    buildingAge: 5,
    earthquakeRiskZone: 1 as 1 | 2 | 3,
  });

  const [travelForm, setTravelForm] = useState({
    name: 'Vize ve Seyahat Koruma Poliçesi',
    destination: 'EUROPE_SCHENGEN' as 'EUROPE_SCHENGEN' | 'WORLDWIDE' | 'DOMESTIC',
    durationDays: 14,
    travelerCount: 1,
  });

  const [carForm, setCarForm] = useState({
    name: 'Full Kasko ve Yol Yardım Poliçesi',
    vehicleValue: 750000,
    modelYear: 2022,
    hasPastAccident: false,
  });

  const [showUserInfoOutput, setShowUserInfoOutput] = useState(false);

  // Address add handler using AddressManager
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    let newAddress: Address;

    if (addressType === 'HOME') {
      newAddress = new HomeAddress(
        addressForm.street || 'Bağdat Cad.',
        addressForm.buildingNo || '10',
        addressForm.apartmentNo || '4',
        addressForm.district || 'Kadıköy',
        addressForm.city || 'İstanbul',
        addressForm.postalCode || '34710',
        account.user.getFullName()
      );
    } else {
      newAddress = new BusinessAddress(
        addressForm.companyName || 'Öztürk Teknoloji',
        addressForm.street || 'Büyükdere Cad. No:45',
        addressForm.floorAndOffice || 'Kat:7 Ofis:12',
        addressForm.district || 'Şişli',
        addressForm.city || 'İstanbul',
        addressForm.postalCode || '34394',
        addressForm.taxNumber || '1234567890'
      );
    }

    // Call account non-abstract method (which delegates to AddressManager static method)
    account.addAddress(newAddress);
    setShowAddAddressModal(false);
    onUpdateAccount();
  };

  const handleRemoveAddress = (addr: Address) => {
    account.removeAddress(addr);
    onUpdateAccount();
  };

  // Calculate preview price
  const calculatePreview = (): { base: number; final: number; marginRate: number } => {
    let dummyInsurance: Insurance;
    const now = new Date();
    const nextYear = new Date(now.getTime() + 365 * 24 * 3600 * 1000);

    if (selectedInsuranceType === 'HEALTH') {
      dummyInsurance = new HealthInsurance(
        healthForm.name,
        now,
        nextYear,
        account.user.age,
        healthForm.hasChronicDisease,
        healthForm.coveragePlan
      );
    } else if (selectedInsuranceType === 'RESIDENCE') {
      dummyInsurance = new ResidenceInsurance(
        residenceForm.name,
        now,
        nextYear,
        Number(residenceForm.squareMeters) || 100,
        Number(residenceForm.buildingAge) || 5,
        residenceForm.earthquakeRiskZone
      );
    } else if (selectedInsuranceType === 'TRAVEL') {
      const travelEnd = new Date(
        now.getTime() + Number(travelForm.durationDays) * 24 * 3600 * 1000
      );
      dummyInsurance = new TravelInsurance(
        travelForm.name,
        now,
        travelEnd,
        travelForm.destination,
        Number(travelForm.travelerCount) || 1
      );
    } else {
      dummyInsurance = new CarInsurance(
        carForm.name,
        now,
        nextYear,
        Number(carForm.vehicleValue) || 500000,
        Number(carForm.modelYear) || 2022,
        carForm.hasPastAccident
      );
    }

    const base = dummyInsurance.calculate();
    const marginRate = account.accountType === 'INDIVIDUAL' ? 0.20 : 0.08;
    const final = Math.round(base * (1 + marginRate));
    return { base, final, marginRate };
  };

  const handleCreateInsurance = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const nextYear = new Date(now.getTime() + 365 * 24 * 3600 * 1000);
    let newIns: Insurance;

    if (selectedInsuranceType === 'HEALTH') {
      newIns = new HealthInsurance(
        healthForm.name,
        now,
        nextYear,
        account.user.age,
        healthForm.hasChronicDisease,
        healthForm.coveragePlan
      );
    } else if (selectedInsuranceType === 'RESIDENCE') {
      newIns = new ResidenceInsurance(
        residenceForm.name,
        now,
        nextYear,
        Number(residenceForm.squareMeters) || 100,
        Number(residenceForm.buildingAge) || 5,
        residenceForm.earthquakeRiskZone
      );
    } else if (selectedInsuranceType === 'TRAVEL') {
      const travelEnd = new Date(
        now.getTime() + Number(travelForm.durationDays) * 24 * 3600 * 1000
      );
      newIns = new TravelInsurance(
        travelForm.name,
        now,
        travelEnd,
        travelForm.destination,
        Number(travelForm.travelerCount) || 1
      );
    } else {
      newIns = new CarInsurance(
        carForm.name,
        now,
        nextYear,
        Number(carForm.vehicleValue) || 500000,
        Number(carForm.modelYear) || 2022,
        carForm.hasPastAccident
      );
    }

    // Call abstract addInsurance overridden in Individual or Enterprise
    account.addInsurance(newIns);
    setShowAddInsuranceModal(false);
    onUpdateAccount();
  };

  const totalPortfolioValue = account.insuranceList.reduce((sum, item) => sum + item.price, 0);
  const preview = calculatePreview();

  return (
    <div className="space-y-6">
      {/* Top Banner / Account Overview */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
              {account.user.firstName.charAt(0)}
              {account.user.lastName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900">
                  {account.user.getFullName()}
                </h1>
                <span className={`text-xs px-2.5 py-0.5 rounded-md font-semibold ${
                  account.accountType === 'INDIVIDUAL'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {account.accountType === 'INDIVIDUAL'
                    ? 'Bireysel Hesap (Individual)'
                    : 'Kurumsal Hesap (Enterprise)'}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Giriş Durumu: {account.authenticationStatus}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 flex items-center gap-3 flex-wrap">
                <span>{account.user.email}</span>
                <span>·</span>
                <span>{account.user.occupation}</span>
                <span>·</span>
                <span>{account.user.age} Yaşında</span>
                <span>·</span>
                <span>
                  Son Giriş:{' '}
                  {account.user.lastLoginDate
                    ? account.user.lastLoginDate.toLocaleTimeString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'İlk Oturum'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            <button
              onClick={() => setShowUserInfoOutput(!showUserInfoOutput)}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-slate-600" />
              <span>showUserInfo() final Metodu</span>
            </button>
            <button
              onClick={onOpenTerminal}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              <Terminal className="w-4 h-4" />
              <span>Klavye / Scanner CLI</span>
            </button>
          </div>
        </div>

        {/* OOP Architecture Context Pill-Free Banner */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
          <div>
            <span className="font-semibold text-slate-900 block">Sınıf İlişkisi:</span>
            <span>Account ──◇ User (Aggregation İlişkisi)</span>
          </div>
          <div>
            <span className="font-semibold text-slate-900 block">Kar Marjı Modeli:</span>
            <span>
              {account.accountType === 'INDIVIDUAL'
                ? 'Bireysel Prim Marjı: %20 (1.20x)'
                : 'Kurumsal Grup Marjı: %8 (1.08x Toplu İndirim)'}
            </span>
          </div>
          <div>
            <span className="font-semibold text-slate-900 block">Veri Yapısı Uyumu:</span>
            <span>TreeSet & Comparable&lt;Account&gt; (Email Bazlı Sıralama)</span>
          </div>
        </div>

        {/* showUserInfo() Console Output Render */}
        {showUserInfoOutput && (
          <div className="mt-4 p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-lg overflow-x-auto border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 pb-2 mb-2 border-b border-slate-800 text-[11px]">
              <span>[Java final Method Console Output] account.showUserInfo()</span>
              <button
                onClick={() => setShowUserInfoOutput(false)}
                className="hover:text-white"
              >
                Kapat ×
              </button>
            </div>
            <pre className="whitespace-pre">
              {account.showUserInfo().join('\n')}
            </pre>
          </div>
        )}
      </div>

      {/* Main Grid: Adresler & Sigortalar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sol Kolon: Adres Yönetimi (AddressManager) - 5 Kolon */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Home className="w-4 h-4 text-indigo-600" />
                  Müşteri Adres Listesi
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  AddressManager static metotları ile yönetilir
                </p>
              </div>
              <button
                onClick={() => setShowAddAddressModal(true)}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adres Ekle</span>
              </button>
            </div>

            {account.user.addressList.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-slate-200 rounded-lg">
                <p className="text-xs text-slate-500">
                  Kayıtlı adres bulunamadı.
                </p>
                <button
                  onClick={() => setShowAddAddressModal(true)}
                  className="mt-2 text-xs font-semibold text-indigo-600 hover:underline"
                >
                  İlk adresi tanımla
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {account.user.addressList.map((addr, idx) => {
                  const isHome = addr.getAddressType() === 'HOME';
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50/50 relative group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <div
                            className={`p-2 rounded-md shrink-0 ${
                              isHome
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {isHome ? (
                              <Home className="w-4 h-4" />
                            ) : (
                              <Briefcase className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">
                                {isHome ? 'Ev Adresi (HomeAddress)' : 'İş Adresi (BusinessAddress)'}
                              </span>
                              <span className="text-[11px] text-slate-500 font-mono">
                                {addr.getCity()} / {addr.getDistrict()}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                              {addr.getDetail()}
                            </p>
                            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                              Posta Kodu: {addr.getPostalCode()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveAddress(addr)}
                          title="AddressManager.removeAddress(...) çalıştırır"
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* AddressManager OOP Reference Note */}
            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">AddressManager Sorumluluğu:</strong>
                <p className="mt-0.5">
                  Adres ekleme ve çıkarma işlemleri `AddressManager.addAddress(user, address)` ve `AddressManager.removeAddress(user, address)` statik fonksiyonları ile gerçekleştirilmektedir.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Kolon: Sigorta Poliçeleri (Insurance & Subclasses) - 7 Kolon */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  Kayıtlı Sigorta Poliçeleri ({account.insuranceList.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  calculate() soyut metodu ve hesap kar marjı ile fiyatlandırılmıştır
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Toplam Prim</span>
                  <span className="text-sm font-bold font-mono text-slate-900 tabular-nums">
                    {totalPortfolioValue.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
                <button
                  onClick={() => setShowAddInsuranceModal(true)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Yeni Poliçe</span>
                </button>
              </div>
            </div>

            {account.insuranceList.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-slate-200 rounded-lg">
                <Shield className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500">
                  Bu hesaba ait henüz aktif bir sigorta poliçesi bulunmuyor.
                </p>
                <button
                  onClick={() => setShowAddInsuranceModal(true)}
                  className="mt-2 text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Sağlık, Konut, Seyahat veya Kasko poliçesi ekle
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {account.insuranceList.map((ins, idx) => {
                  let Icon = Shield;
                  let badgeColor = 'bg-slate-100 text-slate-700';

                  if (ins.category === 'HEALTH') {
                    Icon = HeartPulse;
                    badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
                  } else if (ins.category === 'RESIDENCE') {
                    Icon = Building2;
                    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
                  } else if (ins.category === 'TRAVEL') {
                    Icon = Plane;
                    badgeColor = 'bg-sky-50 text-sky-700 border-sky-200';
                  } else if (ins.category === 'CAR') {
                    Icon = Car;
                    badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  }

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 shrink-0">
                          <Icon className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-900">
                              {ins.name}
                            </span>
                            <span
                              className={`text-[11px] px-2 py-0.5 rounded border font-medium ${badgeColor}`}
                            >
                              {ins.category === 'HEALTH'
                                ? 'Özel Sağlık'
                                : ins.category === 'RESIDENCE'
                                ? 'Konut'
                                : ins.category === 'TRAVEL'
                                ? 'Seyahat'
                                : 'Kasko / Araç'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 font-mono">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>
                              {ins.startDate.toLocaleDateString('tr-TR')} —{' '}
                              {ins.endDate.toLocaleDateString('tr-TR')}
                            </span>
                            <span>·</span>
                            <span>{ins.durationDays} Gün</span>
                          </div>
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                        <span className="text-xs text-slate-500 block">Hesaplanan Prim</span>
                        <div className="text-base font-bold font-mono text-slate-900 tabular-nums">
                          {ins.price.toLocaleString('tr-TR')} ₺
                        </div>
                        <span className="text-[10px] text-slate-500 block">
                          {account.accountType === 'INDIVIDUAL'
                            ? 'Bireysel %20 marj uygulandı'
                            : 'Kurumsal %8 marj uygulandı'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Margin comparison explanation */}
            <div className="mt-4 p-3 bg-indigo-50/70 border border-indigo-100 rounded-lg text-xs text-indigo-900">
              <span className="font-semibold block mb-0.5">
                OOP Çok Biçimlilik (Polymorphism) & Kar Marjı Notu:
              </span>
              <p className="text-[11px] text-indigo-800 leading-relaxed">
                `Account.addInsurance(Insurance insurance)` soyut metodudur. <strong>Individual</strong> sınıfında %20 bireysel prim marjı uygulanırken, <strong>Enterprise</strong> sınıfında kurumsal grup indirimli %8 marj uygulanmaktadır. Her poliçe tipi (Health, Residence, Travel, Car) `calculate()` soyut fonksiyonunu kendine göre işletir.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Yeni Adres Ekle */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Yeni Adres Tanımla (AddressManager)
              </h3>
              <button
                onClick={() => setShowAddAddressModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="mt-4 space-y-4">
              {/* Adres Tipi Seçimi */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Adres Sınıfı Seçimi (Address Interface Implementasyonu)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAddressType('HOME')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-colors ${
                      addressType === 'HOME'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Ev Adresi (HomeAddress)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddressType('BUSINESS')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-colors ${
                      addressType === 'BUSINESS'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    İş Adresi (BusinessAddress)
                  </button>
                </div>
              </div>

              {addressType === 'BUSINESS' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">Şirket / Firma Adı</label>
                    <input
                      type="text"
                      value={addressForm.companyName}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, companyName: e.target.value })
                      }
                      placeholder="Öztürk Holding A.Ş."
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">Vergi Numarası</label>
                    <input
                      type="text"
                      value={addressForm.taxNumber}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, taxNumber: e.target.value })
                      }
                      placeholder="1234567890"
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs text-slate-600 block mb-1">
                  Cadde / Sokak / Plaza
                </label>
                <input
                  type="text"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  placeholder="İstiklal Cad. No:24"
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Bina / Plaza No</label>
                  <input
                    type="text"
                    value={addressForm.buildingNo}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, buildingNo: e.target.value })
                    }
                    placeholder="12"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Daire / Kat & Ofis</label>
                  <input
                    type="text"
                    value={addressForm.apartmentNo}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, apartmentNo: e.target.value })
                    }
                    placeholder="Kat:4 Ofis:18"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-600 block mb-1">İl</label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    placeholder="İstanbul"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">İlçe</label>
                  <input
                    type="text"
                    value={addressForm.district}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, district: e.target.value })
                    }
                    placeholder="Kadıköy"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Posta Kodu</label>
                  <input
                    type="text"
                    value={addressForm.postalCode}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, postalCode: e.target.value })
                    }
                    placeholder="34710"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  AddressManager ile Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Yeni Sigorta Poliçesi Ekle */}
      {showAddInsuranceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-xl w-full p-6 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Yeni Sigorta Poliçesi Tanımla
                </h3>
                <p className="text-xs text-slate-500">
                  `Insurance` soyut sınıfından türeyen alt sınıflar ile hesaplanır
                </p>
              </div>
              <button
                onClick={() => setShowAddInsuranceModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateInsurance} className="mt-4 space-y-4">
              {/* Poliçe Türü Seçimi */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Poliçe Sınıfı (Insurance Alt Sınıfları)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedInsuranceType('HEALTH')}
                    className={`p-2.5 rounded-lg border text-center transition-colors ${
                      selectedInsuranceType === 'HEALTH'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <HeartPulse className="w-4 h-4 mx-auto mb-1 text-rose-500" />
                    <span className="text-xs font-semibold block">HealthInsurance</span>
                    <span className="text-[10px] text-slate-500">Özel Sağlık</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedInsuranceType('RESIDENCE')}
                    className={`p-2.5 rounded-lg border text-center transition-colors ${
                      selectedInsuranceType === 'RESIDENCE'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                    <span className="text-xs font-semibold block">ResidenceInsurance</span>
                    <span className="text-[10px] text-slate-500">Konut</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedInsuranceType('TRAVEL')}
                    className={`p-2.5 rounded-lg border text-center transition-colors ${
                      selectedInsuranceType === 'TRAVEL'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Plane className="w-4 h-4 mx-auto mb-1 text-sky-500" />
                    <span className="text-xs font-semibold block">TravelInsurance</span>
                    <span className="text-[10px] text-slate-500">Seyahat</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedInsuranceType('CAR')}
                    className={`p-2.5 rounded-lg border text-center transition-colors ${
                      selectedInsuranceType === 'CAR'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Car className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
                    <span className="text-xs font-semibold block">CarInsurance</span>
                    <span className="text-[10px] text-slate-500">Kasko / Araç</span>
                  </button>
                </div>
              </div>

              {/* Dinamik Alanlar */}
              {selectedInsuranceType === 'HEALTH' && (
                <div className="space-y-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">Poliçe Başlığı</label>
                    <input
                      type="text"
                      value={healthForm.name}
                      onChange={(e) =>
                        setHealthForm({ ...healthForm, name: e.target.value })
                      }
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-600 block mb-1">Müşteri Yaşı</label>
                      <input
                        type="number"
                        value={account.user.age}
                        disabled
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 block mb-1">Kapsam Paketi</label>
                      <select
                        value={healthForm.coveragePlan}
                        onChange={(e) =>
                          setHealthForm({
                            ...healthForm,
                            coveragePlan: e.target.value as 'STANDARD' | 'VIP',
                          })
                        }
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                      >
                        <option value="STANDARD">Standart Kapsam (1.0x)</option>
                        <option value="VIP">VIP Tam Kapsam (1.45x)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="chronic"
                      checked={healthForm.hasChronicDisease}
                      onChange={(e) =>
                        setHealthForm({
                          ...healthForm,
                          hasChronicDisease: e.target.checked,
                        })
                      }
                      className="rounded text-indigo-600 focus:ring-0"
                    />
                    <label htmlFor="chronic" className="text-xs text-slate-700">
                      Kronik Rahatsızlık Geçmişi Var (+%35 Risk Primi)
                    </label>
                  </div>
                </div>
              )}

              {selectedInsuranceType === 'RESIDENCE' && (
                <div className="space-y-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">Poliçe Başlığı</label>
                    <input
                      type="text"
                      value={residenceForm.name}
                      onChange={(e) =>
                        setResidenceForm({ ...residenceForm, name: e.target.value })
                      }
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-slate-600 block mb-1">Metrekare (m²)</label>
                      <input
                        type="number"
                        value={residenceForm.squareMeters}
                        onChange={(e) =>
                          setResidenceForm({
                            ...residenceForm,
                            squareMeters: Number(e.target.value),
                          })
                        }
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 block mb-1">Bina Yaşı</label>
                      <input
                        type="number"
                        value={residenceForm.buildingAge}
                        onChange={(e) =>
                          setResidenceForm({
                            ...residenceForm,
                            buildingAge: Number(e.target.value),
                          })
                        }
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 block mb-1">Deprem Risk Bölgesi</label>
                      <select
                        value={residenceForm.earthquakeRiskZone}
                        onChange={(e) =>
                          setResidenceForm({
                            ...residenceForm,
                            earthquakeRiskZone: Number(e.target.value) as 1 | 2 | 3,
                          })
                        }
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                      >
                        <option value="1">1. Derece (1.30x)</option>
                        <option value="2">2. Derece (1.15x)</option>
                        <option value="3">3. Derece (1.00x)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {selectedInsuranceType === 'TRAVEL' && (
                <div className="space-y-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">Poliçe Başlığı</label>
                    <input
                      type="text"
                      value={travelForm.name}
                      onChange={(e) =>
                        setTravelForm({ ...travelForm, name: e.target.value })
                      }
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-slate-600 block mb-1">Bölge Kapsamı</label>
                      <select
                        value={travelForm.destination}
                        onChange={(e) =>
                          setTravelForm({
                            ...travelForm,
                            destination: e.target.value as 'EUROPE_SCHENGEN' | 'WORLDWIDE' | 'DOMESTIC',
                          })
                        }
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                      >
                        <option value="EUROPE_SCHENGEN">Avrupa / Schengen</option>
                        <option value="WORLDWIDE">Tüm Dünya</option>
                        <option value="DOMESTIC">Yurtiçi</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 block mb-1">Seyahat Süresi (Gün)</label>
                      <input
                        type="number"
                        value={travelForm.durationDays}
                        onChange={(e) =>
                          setTravelForm({
                            ...travelForm,
                            durationDays: Number(e.target.value),
                          })
                        }
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                        min="1"
                        max="365"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 block mb-1">Kişi Sayısı</label>
                      <input
                        type="number"
                        value={travelForm.travelerCount}
                        onChange={(e) =>
                          setTravelForm({
                            ...travelForm,
                            travelerCount: Number(e.target.value),
                          })
                        }
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                        min="1"
                        max="10"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedInsuranceType === 'CAR' && (
                <div className="space-y-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">Poliçe Başlığı</label>
                    <input
                      type="text"
                      value={carForm.name}
                      onChange={(e) =>
                        setCarForm({ ...carForm, name: e.target.value })
                      }
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-600 block mb-1">Araç Kasko Değeri (TL)</label>
                      <input
                        type="number"
                        value={carForm.vehicleValue}
                        onChange={(e) =>
                          setCarForm({
                            ...carForm,
                            vehicleValue: Number(e.target.value),
                          })
                        }
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                        step="10000"
                        min="50000"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 block mb-1">Model Yılı</label>
                      <input
                        type="number"
                        value={carForm.modelYear}
                        onChange={(e) =>
                          setCarForm({
                            ...carForm,
                            modelYear: Number(e.target.value),
                          })
                        }
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                        min="1990"
                        max="2026"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="pastAccident"
                      checked={carForm.hasPastAccident}
                      onChange={(e) =>
                        setCarForm({
                          ...carForm,
                          hasPastAccident: e.target.checked,
                        })
                      }
                      className="rounded text-indigo-600 focus:ring-0"
                    />
                    <label htmlFor="pastAccident" className="text-xs text-slate-700">
                      Geçmişte Hasar Kaydı Var (+%30 Sürprim)
                    </label>
                  </div>
                </div>
              )}

              {/* Fiyat Hesaplama Önizleme Kutusu */}
              <div className="p-4 rounded-lg bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">
                    calculate() Taban Tutarı: {preview.base.toLocaleString('tr-TR')} ₺
                  </span>
                  <span className="text-xs text-emerald-400 block font-medium">
                    {account.accountType === 'INDIVIDUAL'
                      ? 'Bireysel Kar Marjı (%20): +' + Math.round(preview.base * 0.2).toLocaleString('tr-TR') + ' ₺'
                      : 'Kurumsal Grup Marjı (%8): +' + Math.round(preview.base * 0.08).toLocaleString('tr-TR') + ' ₺'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Nihai Poliçe Primi
                  </span>
                  <span className="text-xl font-bold font-mono text-white tabular-nums">
                    {preview.final.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddInsuranceModal(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  addInsurance() ile Hesaba Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
