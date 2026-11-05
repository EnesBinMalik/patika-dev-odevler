import React from 'react';
import { 
  GitFork, 
  ArrowRight, 
  ShieldAlert, 
  ShieldCheck, 
  Layers, 
  Database, 
  Cpu, 
  Send,
  HelpCircle,
  CheckCircle2,
  XCircle,
  FileCode2
} from 'lucide-react';

export const ArchitectureFlow: React.FC = () => {
  return (
    <section id="architecture" className="py-12 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Yazılım Mimarisi & İstek Yaşam Döngüsü
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Controller İçi Pre-Execution Validasyon Akışı
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Ödev gereksinimi: "Controller içerisinde metot çağrımlarından önce validasyonları çalıştırınız." Bu prensibin arka plandaki çalışma mekanizması ve getirdiği sistem güvenceleri.
          </p>
        </div>

        {/* Visual Flow Diagram */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>İstek Yaşam Döngüsü Diyagramı (Request Lifecycle)</span>
            </h3>
            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Fail-Fast Prensibi
            </span>
          </div>

          {/* Interactive Flow Columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  <span>01. İSTEMCİ İSTEĞİ</span>
                  <Send className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  HTTP İstek Girişi
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  İstemci <code className="font-mono text-indigo-600 dark:text-indigo-400">PUT</code>, <code className="font-mono text-indigo-600 dark:text-indigo-400">DELETE</code> veya <code className="font-mono text-indigo-600 dark:text-indigo-400">GET</code> isteğini JSON gövdesiyle Controller'a gönderir.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/40 text-[11px] font-mono text-slate-500">
                ProductsController
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  <span>02. ÖN KONTROL</span>
                  <Cpu className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  ValidateAsync() Çalışır
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Controller, iş mantığı/servis metodunu çağırmadan <strong>ÖNCE</strong> ilgili FluentValidation sınıfını manuel olarak tetikler.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-indigo-200/60 dark:border-indigo-800/40 text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                _validator.ValidateAsync()
              </div>
            </div>

            {/* Step 3: Fork / Decision Gate */}
            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400 mb-2">
                  <span>03. KARAR KAPISI</span>
                  <GitFork className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  IsValid Kontrolü
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Doğrulama sonucu incelenir: Kurallar ihlal edilmiş mi, yoksa tüm alanlar geçerli mi?
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-200/60 dark:border-amber-800/40 text-[11px] font-mono text-amber-700 dark:text-amber-300 font-semibold">
                if (!result.IsValid)
              </div>
            </div>

            {/* Step 4: Outcome Branches */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                04. SONUÇ DURUMU
              </div>

              {/* Branch Fail */}
              <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-300">
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Geçersiz İse:</span>
                </div>
                <p className="text-[11px] text-rose-600 dark:text-rose-300 mt-0.5">
                  <strong>Servis çağrılmaz!</strong> Anında <code className="font-mono">400 Bad Request</code> hata listesi döndürülür.
                </p>
              </div>

              {/* Branch Success */}
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Geçerli İse:</span>
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-300 mt-0.5">
                  <code className="font-mono">_service.UpdateAsync()</code> çağrılır. Veritabanına yazılır. <code className="font-mono">200 OK</code> dönülür.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            FluentValidation Yaklaşımlarının Karşılaştırması
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Bu ödevde uygulanan "Controller İçi Manuel Validasyon" yaklaşımı ile diğer popüler .NET mimarileri arasındaki farklar:
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3.5">Yaklaşım Yöntemi</th>
                  <th className="p-3.5">Nerede Çalışır?</th>
                  <th className="p-3.5">Avantajları</th>
                  <th className="p-3.5">Bu Ödevdeki Yeri</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300">
                
                <tr className="bg-indigo-50/30 dark:bg-indigo-950/10">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white font-mono">
                    1. Controller İçi Pre-Execution Validasyon
                  </td>
                  <td className="p-3.5">
                    Controller Action metodu içinde, servis çağrısından hemen önce.
                  </td>
                  <td className="p-3.5">
                    Tam şeffaflık, özel hata biçimlendirme, servis metodunun hiçbir koşulda gereksiz çalıştırılmaması güvencesi.
                  </td>
                  <td className="p-3.5">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      ✅ Ödevin Temel Şartı (Uygulandı)
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white font-mono">
                    2. Auto-Validation Filter
                  </td>
                  <td className="p-3.5">
                    ASP.NET Core Model Binding ve Action Filter aşamasında.
                  </td>
                  <td className="p-3.5">
                    Controller kodunu temiz tutar; fakat karmaşık route parametreleri veya koşullu iş kuralları için esnekliği azdır.
                  </td>
                  <td className="p-3.5 text-slate-500">
                    Alternatif mimari yaklaşım.
                  </td>
                </tr>

                <tr>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white font-mono">
                    3. MediatR Pipeline Behavior
                  </td>
                  <td className="p-3.5">
                    CQRS mimarisinde Command/Query Handler'a girmeden önceki boru hattında.
                  </td>
                  <td className="p-3.5">
                    CQRS kullanan enterprise projeler için ideal; Controller ile validasyon tamamen ayrıştırılır.
                  </td>
                  <td className="p-3.5 text-slate-500">
                    İleri düzey enterprise model.
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

        {/* 3 Core Architecture Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Fail-Fast Prensibi
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Hatalı veriyle veritabanı bağlantısı açılmaz, CPU ve bellek kaynakları tüketilmez. Hata anında en hızlı şekilde geri dönülür.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Veri & Güvenlik Bütünlüğü
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Silme veya güncelleme gibi kritik işlemlerde XSS veya SQL injection şüphesi taşıyan ya da onaylanmamış istekler iş katmanına sızamaz.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Kolay Test Edilebilirlik
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Controller birim testlerinde (Unit Test) sahte validasyon sonuçları inject edilerek servisin çağrılıp çağrılmadığı (Verify) kesin olarak test edilir.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
