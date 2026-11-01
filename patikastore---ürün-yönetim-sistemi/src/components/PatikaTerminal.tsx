import React, { useState, useEffect, useRef } from 'react';
import { Brand, Category, Product, NotebookProduct, PhoneProduct } from '../types';
import {
  generateAsciiBrandList,
  generateAsciiNotebookTable,
  generateAsciiPhoneTable,
} from '../utils/formatters';
import { Terminal, Send, RotateCcw, Copy, Check, Sparkles } from 'lucide-react';

interface PatikaTerminalProps {
  products: Product[];
  brands: Brand[];
  categories: Category[];
  onAddProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  onDeleteProduct: (id: number) => boolean;
}

type MenuState =
  | 'MAIN_MENU'
  | 'NOTEBOOK_MENU'
  | 'PHONE_MENU'
  | 'ADD_NOTEBOOK_STEP'
  | 'ADD_PHONE_STEP'
  | 'DELETE_NOTEBOOK'
  | 'DELETE_PHONE'
  | 'FILTER_NOTEBOOK'
  | 'FILTER_PHONE';

interface LogLine {
  id: string;
  type: 'output' | 'input' | 'system' | 'header';
  text: string;
}

export const PatikaTerminal: React.FC<PatikaTerminalProps> = ({
  products,
  brands,
  onAddProduct,
  onDeleteProduct,
}) => {
  const [menuState, setMenuState] = useState<MenuState>('MAIN_MENU');
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [copied, setCopied] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Partial product draft for multi-step terminal adding
  const [draftProduct, setDraftProduct] = useState<Partial<any>>({});
  const [addStep, setAddStep] = useState(0);

  const getSortedBrandList = () => {
    return [...brands].sort((a, b) => a.name.localeCompare(b.name, 'tr'));
  };

  const printWelcome = () => {
    const sortedBrands = getSortedBrandList();
    const brandNames = sortedBrands.map((b) => b.name).join(', ');

    const initialText = [
      `========================================================================`,
      `  PATIKASTORE ÜRÜN YÖNETİM SİSTEMİ (Java Konsol Simülatörü)`,
      `  Geliştirici & İmza: Enes Öztürk`,
      `  Kayıtlı Markalar (${brands.length} Adet - Alfabetik): ${brandNames}`,
      `========================================================================`,
      ``,
      `PatikaStore Ürün Yönetim Paneli !`,
      `1 - Notebook İşlemleri`,
      `2 - Cep Telefonu İşlemleri`,
      `3 - Marka Listele`,
      `0 - Çıkış Yap`,
      `Tercihiniz : `,
    ].join('\n');

    setLogs([
      {
        id: 'init-1',
        type: 'header',
        text: initialText,
      },
    ]);
    setMenuState('MAIN_MENU');
  };

  useEffect(() => {
    printWelcome();
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (text: string, type: 'output' | 'input' | 'system' | 'header' = 'output') => {
    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        type,
        text,
      },
    ]);
  };

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    addLog(`> ${cmd}`, 'input');

    if (menuState === 'MAIN_MENU') {
      if (trimmed === '1') {
        setMenuState('NOTEBOOK_MENU');
        addLog(
          `\n--- Notebook İşlemleri ---\n1 - Ürünleri Listele\n2 - Ürün Ekle\n3 - Ürün Sil (ID ile)\n4 - ID veya Markaya Göre Filtrele\n0 - Ana Menüye Dön\nTercihiniz : `
        );
      } else if (trimmed === '2') {
        setMenuState('PHONE_MENU');
        addLog(
          `\n--- Cep Telefonu İşlemleri ---\n1 - Ürünleri Listele\n2 - Ürün Ekle\n3 - Ürün Sil (ID ile)\n4 - ID veya Markaya Göre Filtrele\n0 - Ana Menüye Dön\nTercihiniz : `
        );
      } else if (trimmed === '3') {
        const ascii = generateAsciiBrandList(brands);
        addLog(`\n${ascii}\n\nTercihiniz : `);
      } else if (trimmed === '0') {
        addLog(
          `\n[Sistem]: Program sonlandırıldı. PatikaStore'u tercih ettiğiniz için teşekkür ederiz!\nGeliştirici: Enes Öztürk\n\n(Yeniden başlatmak için 'reset' yazabilirsiniz veya Yenile butonuna tıklayınız)`
        );
      } else if (trimmed.toLowerCase() === 'reset' || trimmed.toLowerCase() === 'clear') {
        printWelcome();
      } else {
        addLog(`Geçersiz tercih! Lütfen 0, 1, 2 veya 3 giriniz.\nTercihiniz : `);
      }
      return;
    }

    if (menuState === 'NOTEBOOK_MENU') {
      if (trimmed === '1') {
        const table = generateAsciiNotebookTable(products, brands);
        addLog(`\nNotebook Listesi\n\n${table}\n\nTercihiniz : `);
      } else if (trimmed === '2') {
        setMenuState('ADD_NOTEBOOK_STEP');
        setAddStep(1);
        setDraftProduct({ category: 'notebook' });
        addLog(`\n[Yeni Notebook Ekleme]\nÜrün Adı giriniz : `);
      } else if (trimmed === '3') {
        setMenuState('DELETE_NOTEBOOK');
        addLog(`\nSilmek istediğiniz Notebook ürününün benzersiz numarasını (ID) giriniz : `);
      } else if (trimmed === '4') {
        setMenuState('FILTER_NOTEBOOK');
        addLog(`\nFiltrelemek için Ürün ID veya Marka Adı (örn: Huawei, Asus, 1) giriniz : `);
      } else if (trimmed === '0') {
        setMenuState('MAIN_MENU');
        addLog(
          `\nPatikaStore Ürün Yönetim Paneli !\n1 - Notebook İşlemleri\n2 - Cep Telefonu İşlemleri\n3 - Marka Listele\n0 - Çıkış Yap\nTercihiniz : `
        );
      } else {
        addLog(`Geçersiz tercih! Lütfen 0, 1, 2, 3 veya 4 seçiniz.\nTercihiniz : `);
      }
      return;
    }

    if (menuState === 'PHONE_MENU') {
      if (trimmed === '1') {
        const table = generateAsciiPhoneTable(products, brands);
        addLog(`\nCep Telefonu Listesi\n\n${table}\n\nTercihiniz : `);
      } else if (trimmed === '2') {
        setMenuState('ADD_PHONE_STEP');
        setAddStep(1);
        setDraftProduct({ category: 'phone' });
        addLog(`\n[Yeni Cep Telefonu Ekleme]\nÜrün Adı giriniz : `);
      } else if (trimmed === '3') {
        setMenuState('DELETE_PHONE');
        addLog(`\nSilmek istediğiniz Cep Telefonu ürününün benzersiz numarasını (ID) giriniz : `);
      } else if (trimmed === '4') {
        setMenuState('FILTER_PHONE');
        addLog(`\nFiltrelemek için Ürün ID veya Marka Adı (örn: Apple, Samsung, 101) giriniz : `);
      } else if (trimmed === '0') {
        setMenuState('MAIN_MENU');
        addLog(
          `\nPatikaStore Ürün Yönetim Paneli !\n1 - Notebook İşlemleri\n2 - Cep Telefonu İşlemleri\n3 - Marka Listele\n0 - Çıkış Yap\nTercihiniz : `
        );
      } else {
        addLog(`Geçersiz tercih! Lütfen 0, 1, 2, 3 veya 4 seçiniz.\nTercihiniz : `);
      }
      return;
    }

    // Deletion states
    if (menuState === 'DELETE_NOTEBOOK' || menuState === 'DELETE_PHONE') {
      const idNum = parseInt(trimmed, 10);
      if (isNaN(idNum)) {
        addLog(`Hata: Lütfen geçerli bir sayısal ID giriniz!\nTercihiniz (Menüye dönmek için 0) : `);
        return;
      }
      if (idNum === 0) {
        setMenuState(menuState === 'DELETE_NOTEBOOK' ? 'NOTEBOOK_MENU' : 'PHONE_MENU');
        addLog(`İptal edildi. Menüye dönüldü.\nTercihiniz : `);
        return;
      }
      const success = onDeleteProduct(idNum);
      if (success) {
        addLog(`[BAŞARILI]: ID: ${idNum} olan ürün başarıyla silindi.`);
      } else {
        addLog(`[HATA]: ID: ${idNum} olan ürün sistemde bulunamadı.`);
      }
      setMenuState(menuState === 'DELETE_NOTEBOOK' ? 'NOTEBOOK_MENU' : 'PHONE_MENU');
      addLog(`\nTercihiniz : `);
      return;
    }

    // Filter states
    if (menuState === 'FILTER_NOTEBOOK' || menuState === 'FILTER_PHONE') {
      const isNotebook = menuState === 'FILTER_NOTEBOOK';
      const catKey = isNotebook ? 'notebook' : 'phone';
      const categoryProducts = products.filter((p) => p.category === catKey);

      let filtered: Product[] = [];
      const asNum = parseInt(trimmed, 10);

      if (!isNaN(asNum)) {
        filtered = categoryProducts.filter((p) => p.id === asNum);
      } else {
        const query = trimmed.toLowerCase();
        const brandMatch = brands.filter((b) => b.name.toLowerCase().includes(query));
        const brandIds = new Set(brandMatch.map((b) => b.id));
        filtered = categoryProducts.filter(
          (p) => brandIds.has(p.brandId) || p.name.toLowerCase().includes(query)
        );
      }

      if (filtered.length === 0) {
        addLog(`[BİLGİ]: '${trimmed}' kriterine uygun ürün bulunamadı.`);
      } else {
        const ascii = isNotebook
          ? generateAsciiNotebookTable(filtered, brands)
          : generateAsciiPhoneTable(filtered, brands);
        addLog(`\nFiltreleme Sonucu (${filtered.length} ürün):\n\n${ascii}`);
      }

      setMenuState(isNotebook ? 'NOTEBOOK_MENU' : 'PHONE_MENU');
      addLog(`\nTercihiniz : `);
      return;
    }

    // Multi-step product adding for Notebook
    if (menuState === 'ADD_NOTEBOOK_STEP') {
      handleNotebookAddStep(trimmed);
      return;
    }

    // Multi-step product adding for Phone
    if (menuState === 'ADD_PHONE_STEP') {
      handlePhoneAddStep(trimmed);
      return;
    }
  };

  const handleNotebookAddStep = (val: string) => {
    const updated = { ...draftProduct };
    const sortedBrands = getSortedBrandList();

    if (addStep === 1) {
      if (!val) {
        addLog('Ürün Adı boş bırakılamaz! Ürün Adı : ');
        return;
      }
      updated.name = val;
      setDraftProduct(updated);
      setAddStep(2);
      addLog(`Birim Fiyatı giriniz (örn: 9500.0) : `);
    } else if (addStep === 2) {
      const price = parseFloat(val);
      if (isNaN(price) || price <= 0) {
        addLog('Geçersiz fiyat! Lütfen pozitif bir sayı giriniz : ');
        return;
      }
      updated.price = price;
      setDraftProduct(updated);
      setAddStep(3);
      addLog(`İndirim Oranı % giriniz (örn: 10) : `);
    } else if (addStep === 3) {
      const disc = parseFloat(val) || 0;
      updated.discountRate = disc;
      setDraftProduct(updated);
      setAddStep(4);
      addLog(`Stok Miktarı giriniz (örn: 20) : `);
    } else if (addStep === 4) {
      const stock = parseInt(val, 10) || 0;
      updated.stock = stock;
      setDraftProduct(updated);
      setAddStep(5);
      const brandListText = sortedBrands.map((b) => `${b.id} - ${b.name}`).join('\n');
      addLog(`\nMarka Seçiniz (Numarasını giriniz):\n${brandListText}\nSeçiminiz : `);
    } else if (addStep === 5) {
      const brandId = parseInt(val, 10);
      const brandFound = brands.find((b) => b.id === brandId);
      if (!brandFound) {
        addLog('Geçersiz marka numarası! Lütfen listedeki bir ID giriniz : ');
        return;
      }
      updated.brandId = brandId;
      setDraftProduct(updated);
      setAddStep(6);
      addLog(`RAM bilgisi giriniz (örn: 16 GB) : `);
    } else if (addStep === 6) {
      updated.ram = val.toUpperCase().includes('GB') ? val : `${val} GB`;
      setDraftProduct(updated);
      setAddStep(7);
      addLog(`Depolama bilgisi giriniz (örn: 512 SSD) : `);
    } else if (addStep === 7) {
      updated.storage = val.toUpperCase().includes('SSD') ? val : `${val} SSD`;
      setDraftProduct(updated);
      setAddStep(8);
      addLog(`Ekran Boyutu giriniz (örn: 14.0 inç) : `);
    } else if (addStep === 8) {
      updated.screenSize = val.includes('inç') ? val : `${val} inç`;

      // Save product
      const finalProduct: Omit<NotebookProduct, 'id' | 'createdAt'> = {
        name: updated.name,
        price: updated.price,
        discountRate: updated.discountRate || 0,
        stock: updated.stock || 0,
        brandId: updated.brandId,
        category: 'notebook',
        ram: updated.ram || '8 GB',
        storage: updated.storage || '512 SSD',
        screenSize: updated.screenSize || '14.0 inç',
      };

      onAddProduct(finalProduct as any);
      addLog(
        `\n[BAŞARILI]: '${updated.name}' isimli notebook sisteme eklendi!\n\nNotebook İşlemleri Menüsü\n1 - Ürünleri Listele\n2 - Ürün Ekle\n3 - Ürün Sil (ID ile)\n4 - ID veya Markaya Göre Filtrele\n0 - Ana Menüye Dön\nTercihiniz : `
      );
      setMenuState('NOTEBOOK_MENU');
      setDraftProduct({});
      setAddStep(0);
    }
  };

  const handlePhoneAddStep = (val: string) => {
    const updated = { ...draftProduct };
    const sortedBrands = getSortedBrandList();

    if (addStep === 1) {
      if (!val) {
        addLog('Ürün Adı boş bırakılamaz! Ürün Adı : ');
        return;
      }
      updated.name = val;
      setDraftProduct(updated);
      setAddStep(2);
      addLog(`Birim Fiyatı giriniz (örn: 4500.0) : `);
    } else if (addStep === 2) {
      const price = parseFloat(val);
      if (isNaN(price) || price <= 0) {
        addLog('Geçersiz fiyat! Lütfen pozitif bir sayı giriniz : ');
        return;
      }
      updated.price = price;
      setDraftProduct(updated);
      setAddStep(3);
      addLog(`İndirim Oranı % giriniz (örn: 10) : `);
    } else if (addStep === 3) {
      const disc = parseFloat(val) || 0;
      updated.discountRate = disc;
      setDraftProduct(updated);
      setAddStep(4);
      addLog(`Stok Miktarı giriniz (örn: 30) : `);
    } else if (addStep === 4) {
      const stock = parseInt(val, 10) || 0;
      updated.stock = stock;
      setDraftProduct(updated);
      setAddStep(5);
      const brandListText = sortedBrands.map((b) => `${b.id} - ${b.name}`).join('\n');
      addLog(`\nMarka Seçiniz (Numarasını giriniz):\n${brandListText}\nSeçiminiz : `);
    } else if (addStep === 5) {
      const brandId = parseInt(val, 10);
      const brandFound = brands.find((b) => b.id === brandId);
      if (!brandFound) {
        addLog('Geçersiz marka numarası! Lütfen listedeki bir ID giriniz : ');
        return;
      }
      updated.brandId = brandId;
      setDraftProduct(updated);
      setAddStep(6);
      addLog(`Hafıza bilgisi giriniz (örn: 128 GB) : `);
    } else if (addStep === 6) {
      updated.storage = val.toUpperCase().includes('GB') ? val : `${val} GB`;
      setDraftProduct(updated);
      setAddStep(7);
      addLog(`Ekran Boyutu giriniz (örn: 6.5 inç) : `);
    } else if (addStep === 7) {
      updated.screenSize = val.includes('inç') ? val : `${val} inç`;
      setDraftProduct(updated);
      setAddStep(8);
      addLog(`Kamera Çözünürlüğü giriniz (örn: 32 MP) : `);
    } else if (addStep === 8) {
      updated.camera = val.toUpperCase().includes('MP') ? val : `${val} MP`;
      setDraftProduct(updated);
      setAddStep(9);
      addLog(`Pil Gücü (mAh) giriniz (örn: 4000) : `);
    } else if (addStep === 9) {
      const battery = parseInt(val, 10) || 4000;
      updated.battery = battery;
      setDraftProduct(updated);
      setAddStep(10);
      addLog(`RAM bilgisi giriniz (örn: 6 GB) : `);
    } else if (addStep === 10) {
      updated.ram = val.toUpperCase().includes('GB') ? val : `${val} GB`;
      setDraftProduct(updated);
      setAddStep(11);
      addLog(`Renk giriniz (Siyah, Kırmızı, Mavi, Beyaz vb.) : `);
    } else if (addStep === 11) {
      updated.color = val || 'Siyah';

      // Save phone
      const finalProduct: Omit<PhoneProduct, 'id' | 'createdAt'> = {
        name: updated.name,
        price: updated.price,
        discountRate: updated.discountRate || 0,
        stock: updated.stock || 0,
        brandId: updated.brandId,
        category: 'phone',
        storage: updated.storage || '128 GB',
        screenSize: updated.screenSize || '6.5 inç',
        camera: updated.camera || '32 MP',
        battery: updated.battery || 4000,
        ram: updated.ram || '6 GB',
        color: updated.color || 'Siyah',
      };

      onAddProduct(finalProduct as any);
      addLog(
        `\n[BAŞARILI]: '${updated.name}' cep telefonu sisteme eklendi!\n\nCep Telefonu İşlemleri Menüsü\n1 - Ürünleri Listele\n2 - Ürün Ekle\n3 - Ürün Sil (ID ile)\n4 - ID veya Markaya Göre Filtrele\n0 - Ana Menüye Dön\nTercihiniz : `
      );
      setMenuState('PHONE_MENU');
      setDraftProduct({});
      setAddStep(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;
    const val = inputValue;
    setInputValue('');
    handleCommand(val);
  };

  const handleCopy = () => {
    const fullText = logs.map((l) => l.text).join('\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Quick Action Buttons for fast testing
  const quickActions = [
    { label: '1 - Notebook İşlemleri', cmd: '1' },
    { label: '2 - Cep Telefonu İşlemleri', cmd: '2' },
    { label: '3 - Marka Listele', cmd: '3' },
    { label: 'Notebook Tablosu Listele', cmd: '1\n1' },
    { label: 'Cep Telefonu Tablosu Listele', cmd: '2\n1' },
    { label: '0 - Ana Menü / Çıkış', cmd: '0' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[700px] text-slate-100 font-mono text-xs sm:text-sm">
      {/* Terminal Title Bar */}
      <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-slate-400 font-sans text-xs ml-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-orange-400" />
            <span>PatikaStore Java Console (System.out.format)</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
            title="Konsol Çıktısını Kopyala"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Kopyalandı' : 'Kopyala'}</span>
          </button>
          <button
            onClick={printWelcome}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
            title="Konsolu Sıfırla"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sıfırla</span>
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-950/70 select-text font-mono leading-relaxed">
        {logs.map((log) => (
          <div
            key={log.id}
            className={`whitespace-pre-wrap ${
              log.type === 'input'
                ? 'text-orange-400 font-semibold'
                : log.type === 'header'
                ? 'text-cyan-300'
                : 'text-slate-200'
            }`}
          >
            {log.text}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Quick Click Assist Bar */}
      <div className="bg-slate-900/90 px-3 py-2 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="text-slate-400 whitespace-nowrap text-[11px] font-sans mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-orange-400" /> Hızlı Tercih:
        </span>
        {quickActions.map((qa, idx) => (
          <button
            key={idx}
            onClick={() => {
              const lines = qa.cmd.split('\n');
              lines.forEach((l) => handleCommand(l));
            }}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded whitespace-nowrap text-xs transition-colors shrink-0"
          >
            {qa.label}
          </button>
        ))}
      </div>

      {/* Input Prompt */}
      <form onSubmit={handleSubmit} className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex items-center gap-3">
        <span className="text-orange-500 font-bold select-none text-sm">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Komut veya sayısal tercih giriniz (örn: 1, 2, 3, 0)..."
          className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-600 focus:outline-none text-sm font-mono"
          autoFocus
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="p-1.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:hover:bg-orange-600 text-white rounded transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
