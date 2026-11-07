import React, { useState } from 'react';
import { Company, Vehicle, VehicleType, PriceRule, AdditionalService, Reservation } from '../types/rental';
import { dbService } from '../services/storage';
import { CITIES } from '../data/initialData';
import { Plus, Building2, Car, Calendar, DollarSign, Layers, PlusCircle, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface CompanyDashboardProps {
  companies: Company[];
  activeCompanyId: string;
  setActiveCompanyId: (id: string) => void;
  onRefreshData: () => void;
}

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({
  companies,
  activeCompanyId,
  setActiveCompanyId,
  onRefreshData,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'vehicles' | 'new_vehicle' | 'reservations' | 'new_company'>('vehicles');
  const currentCompany = companies.find((c) => c.id === activeCompanyId) || companies[0];

  // Vehicles for this company
  const companyVehicles = dbService.getVehiclesByCompany(currentCompany?.id || '');
  const companyReservations = dbService.getReservationsByCompany(currentCompany?.id || '');

  // New Company Form State
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyCity, setNewCompanyCity] = useState(CITIES[0]);
  const [newCompanyAddress, setNewCompanyAddress] = useState('');
  const [newCompanyPhone, setNewCompanyPhone] = useState('');
  const [newCompanyEmail, setNewCompanyEmail] = useState('');
  const [newCompanyTaxNo, setNewCompanyTaxNo] = useState('');

  // New Vehicle Form State
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(2025);
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('Binek');
  const [transmission, setTransmission] = useState<'Otomatik' | 'Manuel'>('Otomatik');
  const [fuelType, setFuelType] = useState<'Benzin' | 'Dizel' | 'Hibrit' | 'Elektrik'>('Dizel');
  const [seats, setSeats] = useState(5);
  const [baseDailyPrice, setBaseDailyPrice] = useState(1500);
  const [availableFrom, setAvailableFrom] = useState('2026-01-01');
  const [availableTo, setAvailableTo] = useState('2026-12-31');
  const [description, setDescription] = useState('');

  // Dynamic Price Rules
  const [priceRules, setPriceRules] = useState<Omit<PriceRule, 'id' | 'vehicleId'>[]>([]);
  const [ruleStart, setRuleStart] = useState('2026-06-01');
  const [ruleEnd, setRuleEnd] = useState('2026-08-31');
  const [rulePrice, setRulePrice] = useState(2200);
  const [ruleLabel, setRuleLabel] = useState('Yaz Sezonu');

  // Additional Services
  const [extraServices, setExtraServices] = useState<Omit<AdditionalService, 'id'>[]>([
    { name: 'Bebek Oto Koltuğu', description: 'Güvenli çocuk koltuğu', pricePerDay: 150, isAvailable: true },
    { name: 'Tam Kapsamlı Kasko', description: 'Muafiyetsiz koruma teminatı', pricePerDay: 350, isAvailable: true },
  ]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState(200);
  const [newServiceDesc, setNewServiceDesc] = useState('');

  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Add Company Handler
  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName || !newCompanyCity || !newCompanyTaxNo) {
      setFeedbackMessage({ text: 'Lütfen firma adı, şehir ve vergi numarasını doldurunuz.', type: 'error' });
      return;
    }
    const created = dbService.addCompany({
      name: newCompanyName,
      city: newCompanyCity,
      address: newCompanyAddress || `${newCompanyCity} Merkez`,
      phone: newCompanyPhone || '+90 212 000 0000',
      email: newCompanyEmail || `${newCompanyName.toLowerCase().replace(/\s+/g, '')}@firma.com`,
      taxNumber: newCompanyTaxNo,
    });
    setFeedbackMessage({ text: `"${created.name}" firması ${created.city} iliyle sisteme kaydedildi.`, type: 'success' });
    onRefreshData();
    setActiveCompanyId(created.id);
    setActiveSubTab('vehicles');
    setNewCompanyName('');
    setNewCompanyTaxNo('');
  };

  // Add Price Rule to Draft
  const handleAddPriceRule = () => {
    if (!ruleStart || !ruleEnd || rulePrice <= 0) return;
    setPriceRules((prev) => [
      ...prev,
      {
        startDate: ruleStart,
        endDate: ruleEnd,
        dailyPrice: Number(rulePrice),
        label: ruleLabel || 'Özel Fiyat Aralığı',
      },
    ]);
    setRuleLabel('');
  };

  const handleRemovePriceRule = (idx: number) => {
    setPriceRules((prev) => prev.filter((_, i) => i !== idx));
  };

  // Add Extra Service to Draft
  const handleAddService = () => {
    if (!newServiceName || newServicePrice <= 0) return;
    setExtraServices((prev) => [
      ...prev,
      {
        name: newServiceName,
        description: newServiceDesc || 'Hizmet tanımı',
        pricePerDay: Number(newServicePrice),
        isAvailable: true,
      },
    ]);
    setNewServiceName('');
    setNewServiceDesc('');
  };

  const handleRemoveService = (idx: number) => {
    setExtraServices((prev) => prev.filter((_, i) => i !== idx));
  };

  // Add Vehicle Handler
  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !model || !plateNumber) {
      setFeedbackMessage({ text: 'Lütfen marka, model ve plaka alanlarını doldurunuz.', type: 'error' });
      return;
    }

    // Default image matching type
    let chosenImg = '/src/assets/images/car_sedan_modern_1794037969198.jpg';
    if (vehicleType === 'Arazi') chosenImg = '/src/assets/images/car_suv_arazi_1794037969794.jpg';
    if (vehicleType === 'Ticari') chosenImg = '/src/assets/images/car_van_commercial_1794037969371.jpg';
    if (vehicleType === 'Lüks') chosenImg = '/src/assets/images/car_luxury_sport_1794037969826.jpg';

    const vehicleId = `veh_${Date.now()}`;

    const formattedRules: PriceRule[] = priceRules.map((r, i) => ({
      ...r,
      id: `pr_${Date.now()}_${i}`,
      vehicleId,
    }));

    const formattedServices: AdditionalService[] = extraServices.map((s, i) => ({
      ...s,
      id: `srv_${Date.now()}_${i}`,
    }));

    dbService.addVehicle({
      companyId: currentCompany.id,
      brand,
      model,
      year: Number(year),
      plateNumber,
      type: vehicleType,
      transmission,
      fuelType,
      seats: Number(seats),
      image: chosenImg,
      description: description || `${currentCompany.name} bünyesinde bakımlı ${vehicleType} araç.`,
      availableFrom,
      availableTo,
      baseDailyPrice: Number(baseDailyPrice),
      priceRules: formattedRules,
      additionalServices: formattedServices,
    });

    setFeedbackMessage({ text: `${brand} ${model} (${plateNumber}) başarıyla sisteme eklendi.`, type: 'success' });
    onRefreshData();
    setActiveSubTab('vehicles');

    // Reset vehicle form
    setBrand('');
    setModel('');
    setPlateNumber('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Company Context Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold flex items-center justify-center text-lg shrink-0">
              {currentCompany.logoText || 'FK'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {currentCompany.name}
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
                  {currentCompany.city} Şubesi
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Vergi No: {currentCompany.taxNumber} · İletişim: {currentCompany.phone} · {currentCompany.email}
              </p>
            </div>
          </div>

          {/* Company Switcher & Add Company Action */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <select
              value={activeCompanyId}
              onChange={(e) => setActiveCompanyId(e.target.value)}
              className="h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.city})
                </option>
              ))}
            </select>

            <button
              onClick={() => setActiveSubTab('new_company')}
              className="h-10 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yeni Firma Kaydı</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('vehicles')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              activeSubTab === 'vehicles'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Firma Araçları ({companyVehicles.length})
          </button>

          <button
            onClick={() => setActiveSubTab('new_vehicle')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'new_vehicle'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yeni Araç & Fiyat Tanımla</span>
          </button>

          <button
            onClick={() => setActiveSubTab('reservations')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'reservations'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>Gelen Rezervasyonlar</span>
            <span className="font-mono tabular-nums">({companyReservations.length})</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMessage && (
        <div
          className={`mb-6 p-4 rounded-xl border flex items-center justify-between text-xs font-medium ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{feedbackMessage.text}</span>
          </div>
          <button onClick={() => setFeedbackMessage(null)} className="text-slate-500 hover:text-slate-900">
            Kapat
          </button>
        </div>
      )}

      {/* SUB-TAB 1: VEHICLE LIST */}
      {activeSubTab === 'vehicles' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {currentCompany.name} Filosundaki Araçlar
              </h3>
              <p className="text-xs text-slate-500">
                Bulunduğu Şehir: <strong>{currentCompany.city}</strong> · Araç sayısı: {companyVehicles.length}
              </p>
            </div>
            <button
              onClick={() => setActiveSubTab('new_vehicle')}
              className="px-3.5 py-1.5 text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-md hover:opacity-90 transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Araç Ekle</span>
            </button>
          </div>

          {companyVehicles.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800">
              <Car className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Bu firmanın henüz tanımlı aracı yok</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Yukarıdaki "Yeni Araç & Fiyat Tanımla" butonuna basarak binek, arazi veya ticari araçlarınızı ekleyebilirsiniz.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companyVehicles.map((veh) => (
                <div
                  key={veh.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-16/9 bg-slate-100 dark:bg-slate-800">
                      <img
                        src={veh.image}
                        alt={`${veh.brand} ${veh.model}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-slate-900/80 text-white text-[11px] font-medium px-2 py-0.5 rounded">
                        {veh.type}
                      </span>
                      <span className="absolute top-2.5 right-2.5 bg-white/90 text-slate-900 text-[11px] font-mono px-2 py-0.5 rounded">
                        {veh.plateNumber}
                      </span>
                    </div>

                    <div className="p-4">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {veh.brand} {veh.model} ({veh.year})
                      </h4>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        <span>{veh.transmission}</span>
                        <span>·</span>
                        <span>{veh.fuelType}</span>
                        <span>·</span>
                        <span>{veh.seats} Koltuk</span>
                      </div>

                      {/* Müsaitlik Tarih Aralığı */}
                      <div className="mt-3 p-2 bg-slate-50 dark:bg-slate-800/60 rounded text-[11px] text-slate-600 dark:text-slate-300">
                        <div className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Müsaitlik Takvimi:</span>
                        </div>
                        <div className="font-mono mt-0.5">
                          {veh.availableFrom} — {veh.availableTo}
                        </div>
                      </div>

                      {/* Fiyat Kuralları (Dönemsel Fiyatlar) */}
                      {veh.priceRules && veh.priceRules.length > 0 && (
                        <div className="mt-2.5 text-[11px]">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Dönemsel Fiyatlar:</span>
                          <div className="mt-1 space-y-1">
                            {veh.priceRules.map((pr) => (
                              <div key={pr.id} className="flex justify-between text-slate-500 font-mono">
                                <span>{pr.label} ({pr.startDate.substring(5)} — {pr.endDate.substring(5)}):</span>
                                <strong className="text-slate-900 dark:text-white">{pr.dailyPrice} ₺</strong>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Ek Hizmetler */}
                      {veh.additionalServices && veh.additionalServices.length > 0 && (
                        <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Tanımlı Ek Hizmetler:</span>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {veh.additionalServices.map((s) => (
                              <span key={s.id} className="text-[10px] text-slate-600 dark:text-slate-400">
                                {s.name} ({s.pricePerDay} ₺)
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-slate-500">Taban Günlük</div>
                      <div className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                        {veh.baseDailyPrice.toLocaleString('tr-TR')} ₺/gün
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`${veh.brand} ${veh.model} aracını silmek istiyor musunuz?`)) {
                          dbService.deleteVehicle(veh.id);
                          onRefreshData();
                        }
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition"
                      title="Aracı Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: NEW VEHICLE & PRICING RULES FORM */}
      {activeSubTab === 'new_vehicle' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Yeni Araç Ekle & Sezonluk Fiyat ve Ek Hizmet Tanımla
            </h3>
            <p className="text-xs text-slate-500">
              Bu araç doğrudan <strong>{currentCompany.name}</strong> ({currentCompany.city}) firmasına kaydedilecektir.
            </p>
          </div>

          <form onSubmit={handleCreateVehicle} className="space-y-6">
            {/* Step 1: Vehicle Main Specs */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                1. Temel Araç Bilgileri ve Tipi
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Marka
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Renault, Toyota, Ford"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Megane, Corolla, Transit"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Plaka
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: 34 ABC 789"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                    className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Araç Tipi (Zorunlu İstek)
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                    className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="Binek">Binek (Sedan / Hatchback)</option>
                    <option value="Arazi">Arazi (SUV / 4x4)</option>
                    <option value="Ticari">Ticari Araç (Van / Kamyonet)</option>
                    <option value="Lüks">Lüks / VIP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Vites Türü
                  </label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value as 'Otomatik' | 'Manuel')}
                    className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="Otomatik">Otomatik</option>
                    <option value="Manuel">Manuel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Yakıt Türü
                  </label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as 'Benzin' | 'Dizel' | 'Hibrit' | 'Elektrik')}
                    className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="Dizel">Dizel</option>
                    <option value="Benzin">Benzin</option>
                    <option value="Hibrit">Hibrit</option>
                    <option value="Elektrik">Elektrik</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Availability & Base Daily Price */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                2. Müsaitlik Tarihleri ve Taban Günlük Fiyat
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Müsait Olduğu Başlangıç Tarihi
                  </label>
                  <input
                    type="date"
                    required
                    value={availableFrom}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Müsait Olduğu Bitiş Tarihi
                  </label>
                  <input
                    type="date"
                    required
                    value={availableTo}
                    onChange={(e) => setAvailableTo(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Taban Günlük Fiyat (TL)
                  </label>
                  <input
                    type="number"
                    required
                    min={200}
                    value={baseDailyPrice}
                    onChange={(e) => setBaseDailyPrice(Number(e.target.value))}
                    className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Specific Seasonal Date Price Rules */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    3. Dönemsel / Sezonluk Fiyat Aralıkları Tanımlama
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Örneğin yaz ayları, bayram tatilleri veya kış sezonu için farklı günlük fiyatlar belirleyin.
                  </p>
                </div>
              </div>

              {/* Add Rule Input Row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Sezon Adı (Örn: Yaz Sezonu)"
                  value={ruleLabel}
                  onChange={(e) => setRuleLabel(e.target.value)}
                  className="h-9 px-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                />
                <input
                  type="date"
                  value={ruleStart}
                  onChange={(e) => setRuleStart(e.target.value)}
                  className="h-9 px-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                />
                <input
                  type="date"
                  value={ruleEnd}
                  onChange={(e) => setRuleEnd(e.target.value)}
                  className="h-9 px-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Günlük TL"
                    value={rulePrice}
                    onChange={(e) => setRulePrice(Number(e.target.value))}
                    className="w-full h-9 px-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddPriceRule}
                    className="px-3 h-9 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded text-xs font-semibold shrink-0"
                  >
                    Kural Ekle
                  </button>
                </div>
              </div>

              {/* Defined Price Rules List */}
              {priceRules.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                  {priceRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800"
                    >
                      <span>
                        <strong>{rule.label}:</strong> {rule.startDate} — {rule.endDate}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {rule.dailyPrice} ₺ / gün
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemovePriceRule(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Step 4: Additional Services Definition */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-1">
                4. Ek Hizmetler ve Fiyat Tanımları
              </h4>
              <p className="text-[11px] text-slate-500 mb-3">
                Kullanıcıların kiralama esnasında seçebileceği opsiyonel hizmetleri (bebek koltuğu, ek sürücü, tam kasko vs.) tanımlayın.
              </p>

              {/* Add Service Row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Hizmet Adı (Örn: Bebek Koltuğu)"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="h-9 px-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Kısa Açıklama"
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  className="sm:col-span-2 h-9 px-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Günlük ₺"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(Number(e.target.value))}
                    className="w-full h-9 px-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddService}
                    className="px-3 h-9 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded text-xs font-semibold shrink-0"
                  >
                    Ekle
                  </button>
                </div>
              </div>

              {/* Services List */}
              {extraServices.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                  {extraServices.map((srv, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800"
                    >
                      <div>
                        <strong>{srv.name}</strong>: <span className="text-slate-500">{srv.description}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          +{srv.pricePerDay} ₺/gün
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveService(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Action */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveSubTab('vehicles')}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 rounded-lg shadow-xs"
              >
                Aracı ve Fiyat Kurallarını Sisteme Kaydet
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-TAB 3: COMPANY RESERVATIONS */}
      {activeSubTab === 'reservations' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {currentCompany.name} Rezervasyon Listesi
            </h3>
            <p className="text-xs text-slate-500">
              Firmanıza ait araçlara yapılan tüm aktif ve geçmiş rezervasyonlar listelenir.
            </p>
          </div>

          {companyReservations.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Bu firmaya ait henüz herhangi bir rezervasyon kaydı bulunmuyor.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold uppercase">
                    <th className="py-3 px-3">PNR Kodu</th>
                    <th className="py-3 px-3">Müşteri</th>
                    <th className="py-3 px-3">Tarih Aralığı</th>
                    <th className="py-3 px-3">Süre</th>
                    <th className="py-3 px-3">Toplam Tutar</th>
                    <th className="py-3 px-3">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {companyReservations.map((rez) => (
                    <tr key={rez.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                        {rez.reservationCode}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900 dark:text-white">{rez.userFullName}</div>
                        <div className="text-[11px] text-slate-500">{rez.userPhone}</div>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        {rez.startDate} — {rez.endDate}
                        <div className="text-[11px] text-slate-500">
                          {rez.pickupCity} → {rez.returnCity}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono">{rez.days} Gün</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                        {rez.totalCost.toLocaleString('tr-TR')} ₺
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            rez.status === 'ONAYLANDI'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                          }`}
                        >
                          {rez.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: NEW COMPANY FORM */}
      {activeSubTab === 'new_company' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 max-w-2xl">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Sisteme Yeni Kiralama Firması Ekle
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Firmalar bulundukları şehri ve iletişim bilgilerini sisteme girmelidir.
          </p>

          <form onSubmit={handleCreateCompany} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Firma Ticari Unvanı
              </label>
              <input
                type="text"
                required
                placeholder="Örn: Boğaziçi Filo Kiralama A.Ş."
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Bulunduğu Şehir (Zorunlu)
                </label>
                <select
                  value={newCompanyCity}
                  onChange={(e) => setNewCompanyCity(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Vergi Numarası
                </label>
                <input
                  type="text"
                  required
                  placeholder="10 Haneli Vergi No"
                  value={newCompanyTaxNo}
                  onChange={(e) => setNewCompanyTaxNo(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Telefon
                </label>
                <input
                  type="text"
                  placeholder="+90 212 555 0000"
                  value={newCompanyPhone}
                  onChange={(e) => setNewCompanyPhone(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  E-Posta
                </label>
                <input
                  type="email"
                  placeholder="info@firma.com"
                  value={newCompanyEmail}
                  onChange={(e) => setNewCompanyEmail(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Adres
              </label>
              <textarea
                rows={2}
                placeholder="Firma açık adres bilgisi..."
                value={newCompanyAddress}
                onChange={(e) => setNewCompanyAddress(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setActiveSubTab('vehicles')}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 rounded-lg"
              >
                Firmayı Kaydet
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
