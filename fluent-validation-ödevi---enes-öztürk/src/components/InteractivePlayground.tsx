import React, { useState, useMemo } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldAlert, 
  ShieldCheck, 
  Copy, 
  Check, 
  Zap, 
  Terminal,
  FileCode,
  SlidersHorizontal
} from 'lucide-react';
import { 
  validateUpdateProductDto, 
  validateDeleteProductRequest, 
  validateGetProductByIdRequest,
  UpdateProductInput,
  DeleteProductInput,
  GetByIdInput,
  ValidationExecutionResult
} from '../utils/fluentValidationEngine';

export const InteractivePlayground: React.FC = () => {
  const [activeMethod, setActiveMethod] = useState<'update' | 'delete' | 'getById'>('update');
  const [copiedResponse, setCopiedResponse] = useState(false);

  // Form states for Update
  const [updateForm, setUpdateForm] = useState<UpdateProductInput>({
    id: 104,
    name: 'Endüstriyel Akıllı Sensör',
    price: 850.50,
    stock: 25,
    categoryId: 2,
    description: 'RS-485 Modbus destekli sıcaklık ve basınç sensör modülü.'
  });

  // Form states for Delete
  const [deleteForm, setDeleteForm] = useState<DeleteProductInput>({
    id: 104,
    reason: 'Ürün serisi üretimden kaldırıldı ve stoklar tükendi.',
    deletedBy: 'enes.ozturk@sirket.com',
    confirmPermanentDelete: true
  });

  // Form states for GetById
  const [getByIdForm, setGetByIdForm] = useState<GetByIdInput>({
    id: 104
  });

  // Execution result
  const [executionResult, setExecutionResult] = useState<ValidationExecutionResult<any> | null>(() => {
    return validateUpdateProductDto({
      id: 104,
      name: 'Endüstriyel Akıllı Sensör',
      price: 850.50,
      stock: 25,
      categoryId: 2,
      description: 'RS-485 Modbus destekli sıcaklık ve basınç sensör modülü.'
    });
  });

  // Real-time instant preview validation (so user sees errors as they type too)
  const livePreview = useMemo(() => {
    if (activeMethod === 'update') return validateUpdateProductDto(updateForm);
    if (activeMethod === 'delete') return validateDeleteProductRequest(deleteForm);
    return validateGetProductByIdRequest(getByIdForm);
  }, [activeMethod, updateForm, deleteForm, getByIdForm]);

  // Execute request (simulates pressing the endpoint)
  const handleExecute = () => {
    if (activeMethod === 'update') {
      setExecutionResult(validateUpdateProductDto(updateForm));
    } else if (activeMethod === 'delete') {
      setExecutionResult(validateDeleteProductRequest(deleteForm));
    } else {
      setExecutionResult(validateGetProductByIdRequest(getByIdForm));
    }
  };

  // Preset loaders
  const loadPreset = (type: 'valid' | 'invalid' | 'edge') => {
    if (activeMethod === 'update') {
      if (type === 'valid') {
        const val: UpdateProductInput = {
          id: 104,
          name: 'Yüksek Performanslı Lazer Mesafe Ölçer',
          price: 1450.75,
          stock: 120,
          categoryId: 4,
          description: 'IP67 su geçirmez gövde, hassas optik ölçüm ünitesi.'
        };
        setUpdateForm(val);
        setExecutionResult(validateUpdateProductDto(val));
      } else if (type === 'invalid') {
        const val: UpdateProductInput = {
          id: 0, // Invalid Id
          name: 'AB', // Less than 3 chars
          price: -50, // Negative price
          stock: -5, // Negative stock
          categoryId: 0, // Category 0
          description: 'a'.repeat(550) // More than 500 chars
        };
        setUpdateForm(val);
        setExecutionResult(validateUpdateProductDto(val));
      } else {
        const val: UpdateProductInput = {
          id: 104,
          name: 'Sensör <script>alert(1)</script>', // Forbidden keyword
          price: 99.999, // 3 decimal places
          stock: 150000, // Exceeds 100k
          categoryId: 1,
          description: ''
        };
        setUpdateForm(val);
        setExecutionResult(validateUpdateProductDto(val));
      }
    } else if (activeMethod === 'delete') {
      if (type === 'valid') {
        const val: DeleteProductInput = {
          id: 42,
          reason: 'Müşteri iadesi ve yetersiz parti kalitesi sebebiyle imha edildi.',
          deletedBy: 'enes.ozturk@kurumsal.com',
          confirmPermanentDelete: true
        };
        setDeleteForm(val);
        setExecutionResult(validateDeleteProductRequest(val));
      } else if (type === 'invalid') {
        const val: DeleteProductInput = {
          id: -1, // Negative Id
          reason: 'Yok', // Less than 5 chars
          deletedBy: 'gecersiz-eposta', // Not an email
          confirmPermanentDelete: false // Not confirmed
        };
        setDeleteForm(val);
        setExecutionResult(validateDeleteProductRequest(val));
      } else {
        const val: DeleteProductInput = {
          id: 9999,
          reason: '', // Empty reason
          deletedBy: 'admin',
          confirmPermanentDelete: false
        };
        setDeleteForm(val);
        setExecutionResult(validateDeleteProductRequest(val));
      }
    } else {
      if (type === 'valid') {
        const val: GetByIdInput = { id: 104 };
        setGetByIdForm(val);
        setExecutionResult(validateGetProductByIdRequest(val));
      } else if (type === 'invalid') {
        const val: GetByIdInput = { id: 0 }; // 0 is invalid
        setGetByIdForm(val);
        setExecutionResult(validateGetProductByIdRequest(val));
      } else {
        const val: GetByIdInput = { id: -25 }; // Negative
        setGetByIdForm(val);
        setExecutionResult(validateGetProductByIdRequest(val));
      }
    }
  };

  const copyJson = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  return (
    <section id="playground" className="py-12 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              İnteraktif Test Ortamı
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Canlı Validasyon ve Controller Simülatörü
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              İstek parametrelerini değiştirin, "Controller Çağrısını Çalıştır" butonuna basarak validasyonun servis metot çağrısından <strong>önce</strong> nasıl devreye girdiğini ve hata durumunda servisi nasıl bloke ettiğini canlı izleyin.
            </p>
          </div>

          {/* Method Switcher Tabs */}
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 self-start md:self-auto">
            <button
              onClick={() => {
                setActiveMethod('update');
                setExecutionResult(validateUpdateProductDto(updateForm));
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeMethod === 'update'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="font-mono text-[10px] font-bold px-1 py-0.2 bg-black/20 rounded">PUT</span>
              <span>Update Metodu</span>
            </button>

            <button
              onClick={() => {
                setActiveMethod('delete');
                setExecutionResult(validateDeleteProductRequest(deleteForm));
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeMethod === 'delete'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="font-mono text-[10px] font-bold px-1 py-0.2 bg-black/20 rounded">DELETE</span>
              <span>Delete Metodu</span>
            </button>

            <button
              onClick={() => {
                setActiveMethod('getById');
                setExecutionResult(validateGetProductByIdRequest(getByIdForm));
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeMethod === 'getById'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="font-mono text-[10px] font-bold px-1 py-0.2 bg-black/20 rounded">GET</span>
              <span>GetById Metodu</span>
            </button>
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
            <span className="font-medium">Hazır Test Senaryoları:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => loadPreset('valid')}
              className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors font-medium flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Geçerli İstek (200 OK)</span>
            </button>
            <button
              onClick={() => loadPreset('invalid')}
              className="px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition-colors font-medium flex items-center gap-1"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Hatalı İstek (400 Bad Request)</span>
            </button>
            <button
              onClick={() => loadPreset('edge')}
              className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors font-medium flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Uç Durum / Güvenlik Kontrolü</span>
            </button>
          </div>
        </div>

        {/* 2-Zone Stage Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Zone (Col 5): Form & Parameter Controls */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {activeMethod === 'update' && 'UpdateProductDto Parametreleri'}
                    {activeMethod === 'delete' && 'DeleteProductRequest Parametreleri'}
                    {activeMethod === 'getById' && 'GetProductByIdRequest Parametresi'}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                    {activeMethod === 'update' && 'PUT /api/products/{id}'}
                    {activeMethod === 'delete' && 'DELETE /api/products/{id}'}
                    {activeMethod === 'getById' && 'GET /api/products/{id}'}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  {livePreview.isValid ? (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <ShieldCheck className="w-4 h-4" />
                      Kurallar Uygun
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                      <ShieldAlert className="w-4 h-4" />
                      {livePreview.errors.length} Hata
                    </span>
                  )}
                </div>
              </div>

              {/* Dynamic Forms */}
              {activeMethod === 'update' && (
                <div className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Ürün ID (int - GreaterThan 0)
                    </label>
                    <input
                      type="number"
                      value={updateForm.id}
                      onChange={(e) => setUpdateForm({ ...updateForm, id: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Kural: Id &gt; 0 olmalıdır.</div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Ürün Adı (string - 3 ile 100 karakter)
                    </label>
                    <input
                      type="text"
                      value={updateForm.name}
                      onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Kural: NotEmpty, Length(3, 100), yasaklı kelime içermez.</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Fiyat (decimal &gt; 0)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={updateForm.price}
                        onChange={(e) => setUpdateForm({ ...updateForm, price: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Kural: &gt; 0, max 2 ondalık</div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Stok (int 0 - 100k)
                      </label>
                      <input
                        type="number"
                        value={updateForm.stock}
                        onChange={(e) => setUpdateForm({ ...updateForm, stock: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Kural: &gt;= 0 ve &lt;= 100.000</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Kategori ID (int &gt; 0)
                    </label>
                    <input
                      type="number"
                      value={updateForm.categoryId}
                      onChange={(e) => setUpdateForm({ ...updateForm, categoryId: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Açıklama (opsiyonel, max 500 karakter)
                    </label>
                    <textarea
                      rows={2}
                      value={updateForm.description}
                      onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex justify-between">
                      <span>Kural: Doluysa max 500 karakter</span>
                      <span>{updateForm.description.length}/500</span>
                    </div>
                  </div>
                </div>
              )}

              {activeMethod === 'delete' && (
                <div className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Silinecek Ürün ID (int &gt; 0)
                    </label>
                    <input
                      type="number"
                      value={deleteForm.id}
                      onChange={(e) => setDeleteForm({ ...deleteForm, id: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Kural: Id 0'dan büyük pozitif tamsayı olmalıdır.</div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Silme Gerekçesi (Reason - min 5, max 250 karakter)
                    </label>
                    <textarea
                      rows={3}
                      value={deleteForm.reason}
                      onChange={(e) => setDeleteForm({ ...deleteForm, reason: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex justify-between">
                      <span>Kural: Boş olamaz, en az 5 karakter</span>
                      <span>{deleteForm.reason.length}/250</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      İşlemi Yapan Yetkili E-Postası (DeletedBy)
                    </label>
                    <input
                      type="email"
                      value={deleteForm.deletedBy}
                      onChange={(e) => setDeleteForm({ ...deleteForm, deletedBy: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Kural: Boş olamaz, geçerli e-posta formatı.</div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={deleteForm.confirmPermanentDelete}
                        onChange={(e) => setDeleteForm({ ...deleteForm, confirmPermanentDelete: e.target.checked })}
                        className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                      />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Kalıcı Silme Onayı (ConfirmPermanentDelete = true zorunlu)
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {activeMethod === 'getById' && (
                <div className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Sorgulanacak Ürün Kimlik No (Id)
                    </label>
                    <input
                      type="number"
                      value={getByIdForm.id}
                      onChange={(e) => setGetByIdForm({ id: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Kural: Id pozitif tamsayı (&gt; 0) ve azami int limitini aşamaz.
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong>GetById Mimari Notu:</strong> Route üzerinden gelen <code className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{`{id}`}</code> parametresi, Controller action metoduna girer girmez <code className="font-mono text-indigo-600 dark:text-indigo-400">GetProductByIdRequest</code> modeline bind edilir ve <code className="font-mono text-indigo-600 dark:text-indigo-400">_getByIdValidator.ValidateAsync()</code> ile denetlenir. Hatalı ID için veritabanına sorgu atılmadan 400 Bad Request dönülür.
                  </div>
                </div>
              )}

              {/* Action Button: Execute Request */}
              <button
                onClick={handleExecute}
                className="w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Controller Çağrısını Çalıştır (Execute Request)</span>
              </button>

            </div>
          </div>

          {/* Right Zone (Col 7): Execution Lifecycle & HTTP Response */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Step-by-Step Controller Execution Flow */}
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Controller Metot Öncesi Yürütme Adımları
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {executionResult?.statusCode === 200 ? (
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      HTTP 200 OK
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                      HTTP 400 Bad Request
                    </span>
                  )}
                </div>
              </div>

              {/* Step Sequence */}
              <div className="space-y-3">
                {executionResult?.executionSteps.map((step) => {
                  const isFail = step.status === 'failed';
                  const isSuccess = step.status === 'success';

                  return (
                    <div 
                      key={step.step}
                      className={`p-3.5 rounded-lg border text-xs transition-all ${
                        isFail 
                          ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/80 text-rose-900 dark:text-rose-200' 
                          : isSuccess 
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isFail 
                              ? 'bg-rose-600 text-white' 
                              : isSuccess 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                          }`}>
                            {step.step}
                          </span>
                          <span>{step.title}</span>
                        </div>
                        <span className="text-[10px] font-mono opacity-60">{step.timestamp}</span>
                      </div>
                      <p className="text-[12px] opacity-90 pl-7 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Service Method Call Status Notice */}
              <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                executionResult?.serviceMethodCalled
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
              }`}>
                <div className="flex items-center gap-2">
                  {executionResult?.serviceMethodCalled ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  )}
                  <span>
                    <strong>Servis Katmanı Durumu:</strong> {executionResult?.serviceMethodCalled ? 'Validasyon geçti, IProductService metodu başarıyla çağrıldı.' : 'Validasyon başarısız! IProductService metodu ÇAĞRILMADI (Engellendi).'}
                  </span>
                </div>
                <span className="font-mono text-[11px] font-semibold">
                  {executionResult?.serviceMethodCalled ? 'SERVICE: INVOKED' : 'SERVICE: BLOCKED'}
                </span>
              </div>

            </div>

            {/* HTTP Response JSON Inspector */}
            <div className="rounded-xl bg-slate-950 border border-slate-800 shadow-md overflow-hidden text-slate-200 font-mono text-xs">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold text-slate-200 text-xs">
                    HTTP Response Payload (JSON)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">
                    Status: <strong className={executionResult?.statusCode === 200 ? 'text-emerald-400' : 'text-rose-400'}>{executionResult?.statusCode}</strong>
                  </span>
                  <button
                    onClick={() => copyJson(JSON.stringify(executionResult?.responsePayload, null, 2))}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="JSON Kopyala"
                  >
                    {copiedResponse ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-4 overflow-x-auto max-h-72">
                <pre className="text-slate-300 leading-relaxed text-[12px]">
                  {JSON.stringify(executionResult?.responsePayload, null, 2)}
                </pre>
              </div>

              {/* Author footer */}
              <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>FluentValidation Result Model</span>
                <span className="font-sans text-indigo-400 font-medium">Enes Öztürk İmzalı</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
