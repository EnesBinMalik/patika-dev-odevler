import React, { useState } from 'react';
import { JAVA_SOURCE_FILES, JavaCodeFile } from '../../data/javaSourceCodes';
import { SwingTheme } from '../../types/warehouse';
import {
  Code2,
  Layers,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  ArrowDown,
  Activity,
  Boxes,
  Database,
  Terminal,
  FileCode,
} from 'lucide-react';

interface ArchitectureViewProps {
  theme: SwingTheme;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<'UML' | 'OOP_PRINCIPLES' | 'JAVA_CODE'>('UML');
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const isDark = theme === 'darcula';
  const selectedFile = JAVA_SOURCE_FILES[selectedFileIndex] || JAVA_SOURCE_FILES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#2b2b2b] text-slate-100 overflow-hidden">
      {/* Top Tab Bar for Architecture Section */}
      <div
        className={`flex items-center justify-between px-4 py-2 border-b text-xs select-none ${
          isDark ? 'bg-[#3c3f41] border-[#313335]' : 'bg-[#e7eaf0] border-[#b0b8c5] text-slate-900'
        }`}
      >
        <div className="flex items-center gap-1 font-sans">
          <button
            onClick={() => setActiveTab('UML')}
            className={`px-3 py-1.5 rounded-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'UML'
                ? isDark
                  ? 'bg-[#2f65ca] text-white shadow-xs'
                  : 'bg-[#2f5597] text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>UML Sınıf & Kalıtım Şeması</span>
          </button>

          <button
            onClick={() => setActiveTab('OOP_PRINCIPLES')}
            className={`px-3 py-1.5 rounded-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'OOP_PRINCIPLES'
                ? isDark
                  ? 'bg-[#2f65ca] text-white shadow-xs'
                  : 'bg-[#2f5597] text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>OOP İlkeleri (Kalıtım, Çok Biçimlilik, Kapsülleme, Event)</span>
          </button>

          <button
            onClick={() => setActiveTab('JAVA_CODE')}
            className={`px-3 py-1.5 rounded-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'JAVA_CODE'
                ? isDark
                  ? 'bg-[#2f65ca] text-white shadow-xs'
                  : 'bg-[#2f5597] text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Canlı Java Kaynak Kodları (Java 101)</span>
          </button>
        </div>

        <div className="text-[11px] font-mono opacity-70">
          Mimari İmzası: <strong className="text-amber-400">Enes Öztürk</strong>
        </div>
      </div>

      {/* TAB 1: UML Sınıf Şeması */}
      {activeTab === 'UML' && (
        <div className="flex-1 overflow-auto p-6 space-y-6">
          <div className="max-w-5xl mx-auto">
            {/* Header intro */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Boxes className="w-5 h-5 text-blue-400" />
                <span>Katmanlı Mimari & UML Sınıf Hiyerarşisi</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Nesne Yönelimli Programlama (OOP) ve Katmanlı Mimari (Presentation Layer, Business Service Layer, Domain Model Layer, Event-Driven Notification Layer) yapısı.
              </p>
            </div>

            {/* Architecture Tiers */}
            <div className="space-y-4">
              {/* 1. Presentation Tier */}
              <div className="p-4 rounded-xs border border-blue-500/40 bg-blue-950/20 text-xs">
                <div className="font-bold text-blue-300 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-200 text-[10px]">KATMAN 1</span>
                    SUNUM & ARAYÜZ KATMANI (Java Swing GUI)
                  </span>
                  <span className="text-[11px] text-slate-400">javax.swing & java.awt</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px]">
                  <div className="p-2.5 rounded bg-[#1f2329] border border-slate-700">
                    <div className="text-amber-400 font-bold">WarehouseFrame extends JFrame</div>
                    <div className="text-slate-400 text-[10px] mt-1">implements StockEventListener</div>
                    <div className="text-slate-500 text-[10px] mt-1">JMenuBar, JToolBar, JTable, JSplitPane</div>
                  </div>
                  <div className="p-2.5 rounded bg-[#1f2329] border border-slate-700">
                    <div className="text-amber-400 font-bold">JOptionPane Alert System</div>
                    <div className="text-slate-400 text-[10px] mt-1">Modal Dialog Popups</div>
                    <div className="text-slate-500 text-[10px] mt-1">Kritik stokta otomatik uyarı penceresi</div>
                  </div>
                  <div className="p-2.5 rounded bg-[#1f2329] border border-slate-700">
                    <div className="text-amber-400 font-bold">StockMovementDialog</div>
                    <div className="text-slate-400 text-[10px] mt-1">extends JDialog</div>
                    <div className="text-slate-500 text-[10px] mt-1">Giriş/Çıkış formu & validasyon</div>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center text-slate-500">
                <ArrowDown className="w-5 h-5 animate-bounce" />
              </div>

              {/* 2. Business Service Tier */}
              <div className="p-4 rounded-xs border border-emerald-500/40 bg-emerald-950/20 text-xs">
                <div className="font-bold text-emerald-300 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-200 text-[10px]">KATMAN 2</span>
                    İŞ MANTIĞI & SERVİS KATMANI (Business Logic)
                  </span>
                  <span className="text-[11px] text-slate-400">com.enesozturk.depostok.service</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[11px]">
                  <div className="p-2.5 rounded bg-[#1f2329] border border-slate-700">
                    <div className="text-emerald-400 font-bold">StockService</div>
                    <div className="text-slate-300 text-[10px] mt-1">+ processStockIn(sku, qty, docNo)</div>
                    <div className="text-slate-300 text-[10px]">+ processStockOut(sku, qty, reason) throws InsufficientStockException</div>
                    <div className="text-slate-400 text-[10px] mt-1">+ generateAutoPurchaseOrder(product)</div>
                  </div>
                  <div className="p-2.5 rounded bg-[#1f2329] border border-slate-700">
                    <div className="text-emerald-400 font-bold">StockEventManager (Subject / Singleton)</div>
                    <div className="text-slate-300 text-[10px] mt-1">+ addListener(StockEventListener l)</div>
                    <div className="text-slate-300 text-[10px]">+ notifyStockChanged(event)</div>
                    <div className="text-slate-400 text-[10px] mt-1">Olay Güdümlü (Event-Driven) Observer yapısı</div>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center text-slate-500">
                <ArrowDown className="w-5 h-5 animate-bounce" />
              </div>

              {/* 3. Domain Model Tier (Inheritance & Polymorphism) */}
              <div className="p-4 rounded-xs border border-amber-500/40 bg-amber-950/20 text-xs">
                <div className="font-bold text-amber-300 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-200 text-[10px]">KATMAN 3</span>
                    DOMAIN & OOP MODEL KATMANI (Inheritance & Polymorphism)
                  </span>
                  <span className="text-[11px] text-slate-400">com.enesozturk.depostok.model</span>
                </div>

                {/* Abstract Class & Interface */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[11px] mb-3">
                  <div className="p-3 rounded bg-[#1f2329] border-2 border-amber-500/60">
                    <div className="text-slate-400 text-[10px]">&lt;&lt;interface&gt;&gt;</div>
                    <div className="text-amber-300 font-bold">IStockCalculable</div>
                    <div className="text-slate-400 text-[10px] mt-1">+ calculateMonthlyStorageCost(): double</div>
                    <div className="text-slate-400 text-[10px]">+ validateDispatch(int qty): boolean</div>
                  </div>
                  <div className="p-3 rounded bg-[#1f2329] border-2 border-amber-500/60">
                    <div className="text-slate-400 text-[10px]">&lt;&lt;abstract class&gt;&gt;</div>
                    <div className="text-amber-300 font-bold">Product implements IStockCalculable</div>
                    <div className="text-slate-300 text-[10px] mt-1">- sku, - name, - stockQuantity, - unitPrice, - reorderThreshold</div>
                    <div className="text-emerald-400 text-[10px] mt-1">+ decreaseStock(qty) / + increaseStock(qty)</div>
                  </div>
                </div>

                {/* 4 Concrete Subclasses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 font-mono text-[10px]">
                  <div className="p-2.5 rounded bg-[#181a1f] border border-cyan-500/40">
                    <div className="text-cyan-400 font-bold">PerishableProduct</div>
                    <div className="text-slate-400 mt-1">extends Product</div>
                    <div className="text-slate-300 mt-1">- expiryDate: LocalDate</div>
                    <div className="text-slate-300">- storageTemp: double</div>
                    <div className="text-amber-300 mt-1">@Override calculateMonthlyStorageCost() (Soğutma katsayısı)</div>
                  </div>

                  <div className="p-2.5 rounded bg-[#181a1f] border border-amber-500/40">
                    <div className="text-amber-400 font-bold">HazardousProduct</div>
                    <div className="text-slate-400 mt-1">extends Product</div>
                    <div className="text-slate-300 mt-1">- hazardClass: String</div>
                    <div className="text-slate-300">- unCode: String</div>
                    <div className="text-amber-300 mt-1">@Override validateDispatch() (ADR Güvenlik doğrulaması)</div>
                  </div>

                  <div className="p-2.5 rounded bg-[#181a1f] border border-blue-500/40">
                    <div className="text-blue-400 font-bold">ElectronicProduct</div>
                    <div className="text-slate-400 mt-1">extends Product</div>
                    <div className="text-slate-300 mt-1">- serialNumber: String</div>
                    <div className="text-slate-300">- warrantyMonths: int</div>
                    <div className="text-amber-300 mt-1">@Override getStorageRequirement() (ESD Koruması)</div>
                  </div>

                  <div className="p-2.5 rounded bg-[#181a1f] border border-slate-500/40">
                    <div className="text-slate-300 font-bold">StandardProduct</div>
                    <div className="text-slate-400 mt-1">extends Product</div>
                    <div className="text-slate-400 mt-1">Standart endüstriyel sarf ve yedek parça kalemi</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OOP İlkeleri Derinlemesine İnceleme */}
      {activeTab === 'OOP_PRINCIPLES' && (
        <div className="flex-1 overflow-auto p-6 space-y-6">
          <div className="max-w-4xl mx-auto space-y-6 text-xs">
            {/* 1. Kalıtım (Inheritance) */}
            <div className="p-5 rounded-xs border border-blue-500/30 bg-[#23272e] space-y-2">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm font-sans">
                <Layers className="w-4 h-4" /> 1. Kalıtım (Inheritance) Prensibi
              </div>
              <p className="text-slate-300 leading-relaxed font-sans">
                Tüm ürün tipleri (<code className="text-amber-300 font-mono">PerishableProduct</code>, <code className="text-amber-300 font-mono">HazardousProduct</code>, vb.), ortak depo değişkenlerini (SKU, stok adedi, birim fiyat, raf konumu) ve davranışlarını (<code className="text-emerald-300 font-mono">decreaseStock</code>, <code className="text-emerald-300 font-mono">isCritical</code>) soyut <code className="text-blue-300 font-mono">Product</code> temel sınıfından devralır. Bu sayede kod tekrarı (DRY) sıfıra indirilmiştir.
              </p>
              <div className="p-2 rounded bg-black/40 border border-slate-700 font-mono text-[11px] text-cyan-300">
                public class PerishableProduct extends Product &#123; ... &#125;
              </div>
            </div>

            {/* 2. Çok Biçimlilik (Polymorphism) */}
            <div className="p-5 rounded-xs border border-emerald-500/30 bg-[#23272e] space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm font-sans">
                <Sparkles className="w-4 h-4" /> 2. Çok Biçimlilik (Polymorphism) Prensibi
              </div>
              <p className="text-slate-300 leading-relaxed font-sans">
                Her ürünün depo maliyeti ve sevk kuralı aynı değildir. Örneğin soğuk hava deposunda saklanan bir aşı dondurucu elektrik harcaması nedeniyle ek depolama maliyeti üretirken, kimyasal çözücü havalandırma sigorta primi gerektirir. Sistemde <code className="text-emerald-300 font-mono">calculateMonthlyStorageCost()</code> metodu çağrıldığında Java Sanal Makinesi (JVM), nesnenin gerçek çalışma zamanı türüne (Runtime Type) göre ilgili metodun ezilmiş (<code className="text-amber-300 font-mono">@Override</code>) versiyonunu dinamik olarak yürütür (Dynamic Dispatch).
              </p>
              <div className="p-2 rounded bg-black/40 border border-slate-700 font-mono text-[11px] text-emerald-300">
                for (Product p : productList) &#123; totalCost += p.calculateMonthlyStorageCost(); // Çok biçimli çağrı &#125;
              </div>
            </div>

            {/* 3. Kapsülleme (Encapsulation) */}
            <div className="p-5 rounded-xs border border-amber-500/30 bg-[#23272e] space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm font-sans">
                <ShieldCheck className="w-4 h-4" /> 3. Kapsülleme (Encapsulation) Prensibi
              </div>
              <p className="text-slate-300 leading-relaxed font-sans">
                Ürünlerin <code className="text-amber-300 font-mono">stockQuantity</code> veya <code className="text-amber-300 font-mono">unitPrice</code> gibi kritik değişkenleri <code className="text-red-400 font-mono">private</code> olarak gizlenmiştir. Dış dünyadan doğrudan değiştirilemez. Stok çıkışı yapılırken <code className="text-emerald-300 font-mono">decreaseStock(amount)</code> metodu devreye girer; miktar mevcut stoktan fazlaysa işlem engellenir ve <code className="text-red-300 font-mono">InsufficientStockException</code> fırlatılır.
              </p>
              <div className="p-2 rounded bg-black/40 border border-slate-700 font-mono text-[11px] text-amber-300">
                private int stockQuantity; // Sadece doğrulanmış setter/decrease metodu üzerinden güncellenebilir!
              </div>
            </div>

            {/* 4. Event-Driven Mimari */}
            <div className="p-5 rounded-xs border border-purple-500/30 bg-[#23272e] space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm font-sans">
                <Activity className="w-4 h-4" /> 4. Olay Güdümlü (Event-Driven) Otomatik Uyarı Mekanizması
              </div>
              <p className="text-slate-300 leading-relaxed font-sans">
                Bir ürün tükendiğinde veya stoğu kritik eşik seviyesine (<code className="text-amber-300 font-mono">reorderThreshold</code>) indiğinde, iş katmanı doğrudan GUI'ye bağımlı olmadan bir <code className="text-purple-300 font-mono">StockAlertEvent</code> olayı üretir. Bu olayı dinleyen <code className="text-blue-300 font-mono">StockEventListener</code> arayüzünü uygulayan Swing pencereleri kullanıcıya <code className="text-red-300 font-mono">JOptionPane.showMessageDialog</code> açar ve tedarikçiye otomatik satın alma emri iletir.
              </p>
              <div className="p-2 rounded bg-black/40 border border-slate-700 font-mono text-[11px] text-purple-300">
                StockEventManager.getInstance().notifyCriticalStock(event); // Observer Pattern
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Canlı Java Kaynak Kodları (Java 101) */}
      {activeTab === 'JAVA_CODE' && (
        <div className="flex-1 flex min-h-0 overflow-hidden font-mono text-xs">
          {/* File Explorer Sidebar */}
          <div className="w-64 border-r border-[#3a3d40] bg-[#21252b] flex flex-col shrink-0 select-none">
            <div className="px-3 py-2 text-[11px] font-semibold border-b border-[#31353d] text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-amber-400" /> Java 101 Kaynak Dosyaları
              </span>
              <span className="text-[10px] text-slate-500">{JAVA_SOURCE_FILES.length} Dosya</span>
            </div>

            <div className="p-1 space-y-0.5 overflow-y-auto flex-1">
              {JAVA_SOURCE_FILES.map((f, idx) => {
                const isSelected = selectedFileIndex === idx;
                return (
                  <button
                    key={f.name}
                    onClick={() => setSelectedFileIndex(idx)}
                    className={`w-full flex flex-col items-start px-3 py-2 rounded-xs text-left transition-colors ${
                      isSelected
                        ? 'bg-[#2c313a] border-l-2 border-blue-500 text-white'
                        : 'text-slate-400 hover:bg-[#282c34] hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                      <span className="text-[11px]">☕</span>
                      <span>{f.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate w-full mt-0.5 font-sans">
                      {f.oopPrinciple}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col min-h-0 bg-[#282c34] overflow-hidden">
            {/* File info bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#21252b] bg-[#21252b] text-slate-300 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">{selectedFile.name}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400 font-sans">{selectedFile.description}</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#3a3f4b] hover:bg-[#4b5263] text-slate-200 text-xs transition-colors"
                title="Java Kodunu Kopyala"
              >
                {copied ? (
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

            {/* Code Body with Line Numbers */}
            <div className="flex-1 overflow-auto p-4 font-mono text-[12px] leading-relaxed select-text">
              <pre className="text-slate-200">
                <code>{selectedFile.code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
