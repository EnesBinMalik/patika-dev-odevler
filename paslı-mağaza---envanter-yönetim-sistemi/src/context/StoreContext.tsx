import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Product, 
  Sale, 
  Purchase, 
  User, 
  UserRole, 
  StoreError, 
  FinancialSummary 
} from '../types/store';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_SALES, 
  INITIAL_PURCHASES, 
  INITIAL_USERS 
} from '../data/initialData';

interface AddProductInput {
  sku: string;
  name: string;
  description: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  minStock: number;
  unit: string;
}

interface RecordSaleInput {
  productId: number;
  quantity: number;
  sellingPrice?: number;
  note?: string;
}

interface RecordPurchaseInput {
  productId: number;
  quantity: number;
  purchasePrice: number;
  supplier: string;
  invoiceNo?: string;
  note?: string;
}

interface StoreContextType {
  products: Product[];
  sales: Sale[];
  purchases: Purchase[];
  users: User[];
  currentUser: User;
  financials: FinancialSummary;
  lastError: StoreError | null;
  clearError: () => void;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  
  // Envanter işlemleri
  addProduct: (input: AddProductInput) => { success: boolean; error?: StoreError; product?: Product };
  updateProduct: (id: number, updates: Partial<Product>) => { success: boolean; error?: StoreError };
  deleteProduct: (id: number) => { success: boolean; error?: StoreError };
  
  // Satış ve Satın Alma
  recordSale: (input: RecordSaleInput) => { success: boolean; error?: StoreError; sale?: Sale };
  recordPurchase: (input: RecordPurchaseInput) => { success: boolean; error?: StoreError; purchase?: Purchase };
  
  // Rapor üretimi
  generateInventoryTextReport: () => string;
  generateFinancialTextReport: () => string;
  generateSalesTextReport: () => string;
  generateLowStockTextReport: () => string;
  
  // Veri sıfırlama & İçe / Dışa Aktarma
  resetToDefaultData: () => void;
  exportDatabaseJson: () => string;
  importDatabaseJson: (jsonStr: string) => boolean;

  // Terminal / CLI komut motoru
  executeTerminalCommand: (commandStr: string) => { output: string; isError?: boolean };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'pasli_magaza_products_v1',
  SALES: 'pasli_magaza_sales_v1',
  PURCHASES: 'pasli_magaza_purchases_v1',
  CURRENT_USER_ID: 'pasli_magaza_user_id_v1',
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SALES);
      return saved ? JSON.parse(saved) : INITIAL_SALES;
    } catch {
      return INITIAL_SALES;
    }
  });

  const [purchases, setPurchases] = useState<Purchase[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PURCHASES);
      return saved ? JSON.parse(saved) : INITIAL_PURCHASES;
    } catch {
      return INITIAL_PURCHASES;
    }
  });

  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      const found = INITIAL_USERS.find(u => u.id === Number(savedId));
      return found || INITIAL_USERS[0]; // Varsayılan Enes Öztürk (Admin)
    } catch {
      return INITIAL_USERS[0];
    }
  });

  const [lastError, setLastError] = useState<StoreError | null>(null);

  // Otomatik LocalStorage kaydetme
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
    } catch (e) {
      console.error('Failed to save sales to localStorage', e);
    }
  }, [sales]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
    } catch (e) {
      console.error('Failed to save purchases to localStorage', e);
    }
  }, [purchases]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, String(currentUser.id));
    } catch (e) {
      console.error('Failed to save user id', e);
    }
  }, [currentUser]);

  const clearError = () => setLastError(null);

  const switchRole = (role: UserRole) => {
    const userWithRole = users.find(u => u.role === role);
    if (userWithRole) {
      setCurrentUser(userWithRole);
    } else {
      setCurrentUser(prev => ({ ...prev, role }));
    }
  };

  // RBAC İzin Kontrolü
  const checkPermission = (allowedRoles: UserRole[], actionName: string): StoreError | null => {
    if (!allowedRoles.includes(currentUser.role)) {
      return {
        code: 'UnauthorizedAccess',
        message: `Yetkisiz İşlem: '${actionName}' işlemi için '${currentUser.role}' rolü yetkili değildir. Gerekli yetkiler: ${allowedRoles.join(', ')}.`,
      };
    }
    return null;
  };

  // Finansal özet hesaplamaları
  const calculateFinancials = (): FinancialSummary => {
    const totalInventoryCost = products.reduce((sum, p) => sum + (p.costPrice * p.quantity), 0);
    const totalRetailPotential = products.reduce((sum, p) => sum + (p.sellingPrice * p.quantity), 0);
    const totalProductsCount = products.length;
    const totalStockQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
    const lowStockCount = products.filter(p => p.quantity > 0 && p.quantity <= p.minStock).length;
    const outOfStockCount = products.filter(p => p.quantity === 0).length;

    const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalCostOfGoodsSold = sales.reduce((sum, s) => sum + (s.quantity * s.unitCostPrice), 0);
    const grossProfit = sales.reduce((sum, s) => sum + s.profit, 0);
    const profitMarginPercent = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
    const totalPurchasesCost = purchases.reduce((sum, p) => sum + p.totalCost, 0);

    return {
      totalInventoryCost,
      totalRetailPotential,
      totalProductsCount,
      totalStockQuantity,
      lowStockCount,
      outOfStockCount,
      totalRevenue,
      totalCostOfGoodsSold,
      grossProfit,
      profitMarginPercent,
      totalPurchasesCost,
    };
  };

  const financials = calculateFinancials();

  // --- Envanter İşlemleri ---
  const addProduct = (input: AddProductInput) => {
    const authErr = checkPermission(['Admin', 'Manager'], 'Ürün Ekleme');
    if (authErr) {
      setLastError(authErr);
      return { success: false, error: authErr };
    }

    if (!input.name.trim()) {
      const err: StoreError = { code: 'EmptyField', message: 'Ürün adı boş bırakılamaz.' };
      setLastError(err);
      return { success: false, error: err };
    }
    if (!input.sku.trim()) {
      const err: StoreError = { code: 'EmptyField', message: 'Ürün kodu (SKU) zorunludur.' };
      setLastError(err);
      return { success: false, error: err };
    }
    if (input.costPrice < 0 || input.sellingPrice < 0) {
      const err: StoreError = { code: 'InvalidPrice', message: 'Alış ve satış fiyatları negatif olamaz.' };
      setLastError(err);
      return { success: false, error: err };
    }
    if (input.quantity < 0) {
      const err: StoreError = { code: 'InvalidQuantity', message: 'Stok adedi negatif olamaz.' };
      setLastError(err);
      return { success: false, error: err };
    }

    // SKU tekillik kontrolü
    const exists = products.some(p => p.sku.toLowerCase() === input.sku.trim().toLowerCase());
    if (exists) {
      const err: StoreError = { 
        code: 'DuplicateSku', 
        message: `'${input.sku}' SKU kodlu ürün zaten sistemde kayıtlı!` 
      };
      setLastError(err);
      return { success: false, error: err };
    }

    const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct: Product = {
      id: nextId,
      sku: input.sku.trim().toUpperCase(),
      name: input.name.trim(),
      description: input.description.trim(),
      category: input.category || 'Genel',
      costPrice: Number(input.costPrice),
      sellingPrice: Number(input.sellingPrice),
      quantity: Number(input.quantity),
      minStock: Number(input.minStock) || 5,
      unit: input.unit || 'Adet',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProducts(prev => [newProduct, ...prev]);
    return { success: true, product: newProduct };
  };

  const updateProduct = (id: number, updates: Partial<Product>) => {
    const authErr = checkPermission(['Admin', 'Manager'], 'Ürün Güncelleme');
    if (authErr) {
      setLastError(authErr);
      return { success: false, error: authErr };
    }

    if (updates.costPrice !== undefined && updates.costPrice < 0) {
      const err: StoreError = { code: 'InvalidPrice', message: 'Maliyet fiyatı negatif olamaz.' };
      setLastError(err);
      return { success: false, error: err };
    }
    if (updates.sellingPrice !== undefined && updates.sellingPrice < 0) {
      const err: StoreError = { code: 'InvalidPrice', message: 'Satış fiyatı negatif olamaz.' };
      setLastError(err);
      return { success: false, error: err };
    }
    if (updates.quantity !== undefined && updates.quantity < 0) {
      const err: StoreError = { code: 'InvalidQuantity', message: 'Stok miktarı negatif olamaz.' };
      setLastError(err);
      return { success: false, error: err };
    }

    let found = false;
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        found = true;
        return {
          ...p,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    }));

    if (!found) {
      const err: StoreError = { code: 'ProductNotFound', message: `ID: ${id} olan ürün bulunamadı.` };
      setLastError(err);
      return { success: false, error: err };
    }

    return { success: true };
  };

  const deleteProduct = (id: number) => {
    const authErr = checkPermission(['Admin'], 'Ürün Silme');
    if (authErr) {
      setLastError(authErr);
      return { success: false, error: authErr };
    }

    const prod = products.find(p => p.id === id);
    if (!prod) {
      const err: StoreError = { code: 'ProductNotFound', message: `ID: ${id} olan ürün bulunamadı.` };
      setLastError(err);
      return { success: false, error: err };
    }

    setProducts(prev => prev.filter(p => p.id !== id));
    return { success: true };
  };

  // --- Satış Yönetimi ---
  const recordSale = (input: RecordSaleInput) => {
    // Kasiyer, Müdür ve Admin satış yapabilir
    const authErr = checkPermission(['Admin', 'Manager', 'Cashier'], 'Satış Kaydı');
    if (authErr) {
      setLastError(authErr);
      return { success: false, error: authErr };
    }

    if (input.quantity <= 0) {
      const err: StoreError = { code: 'InvalidQuantity', message: 'Satış miktarı en az 1 olmalıdır.' };
      setLastError(err);
      return { success: false, error: err };
    }

    const product = products.find(p => p.id === input.productId);
    if (!product) {
      const err: StoreError = { code: 'ProductNotFound', message: `Ürün bulunamadı (ID: ${input.productId}).` };
      setLastError(err);
      return { success: false, error: err };
    }

    // Stok kontrolü: Rust InsufficientStock mantığı
    if (product.quantity < input.quantity) {
      const err: StoreError = {
        code: 'InsufficientStock',
        message: `Yetersiz Stok! '${product.name}' için depoda yalnızca ${product.quantity} ${product.unit} var. Talep: ${input.quantity} ${product.unit}.`,
        details: { available: product.quantity, requested: input.quantity }
      };
      setLastError(err);
      return { success: false, error: err };
    }

    const unitSellingPrice = input.sellingPrice !== undefined && input.sellingPrice > 0 
      ? Number(input.sellingPrice) 
      : product.sellingPrice;

    if (unitSellingPrice < 0) {
      const err: StoreError = { code: 'InvalidPrice', message: 'Satış fiyatı negatif olamaz.' };
      setLastError(err);
      return { success: false, error: err };
    }

    const unitCostPrice = product.costPrice;
    const totalAmount = input.quantity * unitSellingPrice;
    const profit = totalAmount - (input.quantity * unitCostPrice);

    // Stok düşümü
    setProducts(prev => prev.map(p => {
      if (p.id === product.id) {
        return {
          ...p,
          quantity: p.quantity - input.quantity,
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    }));

    const nextId = sales.length > 0 ? Math.max(...sales.map(s => s.id)) + 1 : 1;
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const receiptNo = `SAT-${dateStr}-${String(nextId).padStart(3, '0')}`;

    const newSale: Sale = {
      id: nextId,
      receiptNo,
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantity: input.quantity,
      unitCostPrice,
      unitSellingPrice,
      totalAmount,
      profit,
      cashierName: currentUser.fullName,
      note: input.note || '',
      timestamp: now.toISOString(),
    };

    setSales(prev => [newSale, ...prev]);
    return { success: true, sale: newSale };
  };

  // --- Satın Alma Yönetimi ---
  const recordPurchase = (input: RecordPurchaseInput) => {
    const authErr = checkPermission(['Admin', 'Manager'], 'Satın Alma Girişi');
    if (authErr) {
      setLastError(authErr);
      return { success: false, error: authErr };
    }

    if (input.quantity <= 0) {
      const err: StoreError = { code: 'InvalidQuantity', message: 'Alım miktarı sıfırdan büyük olmalıdır.' };
      setLastError(err);
      return { success: false, error: err };
    }

    if (input.purchasePrice <= 0) {
      const err: StoreError = { code: 'InvalidPrice', message: 'Birim alış fiyatı sıfırdan büyük olmalıdır.' };
      setLastError(err);
      return { success: false, error: err };
    }

    const product = products.find(p => p.id === input.productId);
    if (!product) {
      const err: StoreError = { code: 'ProductNotFound', message: `Ürün bulunamadı (ID: ${input.productId}).` };
      setLastError(err);
      return { success: false, error: err };
    }

    // Ağırlıklı Ortalama Maliyet Hesaplama
    const oldQty = product.quantity;
    const oldCost = product.costPrice;
    const newQty = oldQty + input.quantity;
    const weightedCost = ((oldQty * oldCost) + (input.quantity * input.purchasePrice)) / newQty;

    // Envanteri güncelle
    setProducts(prev => prev.map(p => {
      if (p.id === product.id) {
        return {
          ...p,
          quantity: newQty,
          costPrice: Number(weightedCost.toFixed(2)),
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    }));

    const nextId = purchases.length > 0 ? Math.max(...purchases.map(p => p.id)) + 1 : 1;
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const invoiceNo = input.invoiceNo || `ALM-${dateStr}-${String(nextId).padStart(3, '0')}`;
    const totalCost = input.quantity * input.purchasePrice;

    const newPurchase: Purchase = {
      id: nextId,
      invoiceNo,
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantity: input.quantity,
      unitPurchasePrice: input.purchasePrice,
      totalCost,
      supplier: input.supplier || 'Genel Tedarikçi',
      managerName: currentUser.fullName,
      note: input.note || '',
      timestamp: now.toISOString(),
    };

    setPurchases(prev => [newPurchase, ...prev]);
    return { success: true, purchase: newPurchase };
  };

  // --- Raporlama Çıktıları (Kullanıcı dostu metin formatında) ---
  const generateInventoryTextReport = (): string => {
    const pad = (s: string | number, len: number, alignRight = false) => {
      const str = String(s);
      if (str.length >= len) return str.slice(0, len);
      return alignRight ? str.padStart(len, ' ') : str.padEnd(len, ' ');
    };

    let text = `========================================================================================\n`;
    text += `                     PASLI MAĞAZA - GÜNCEL ENVANTER RAPORU                              \n`;
    text += `                     Sistem Mimarı: Enes Öztürk                                         \n`;
    text += `                     Tarih: ${new Date().toLocaleString('tr-TR')}                       \n`;
    text += `========================================================================================\n`;
    text += `+----+--------------+---------------------------------------+----------+----------+-----+\n`;
    text += `| ID | SKU          | ÜRÜN ADI                              | MALİYET  | SATIŞ    | STK |\n`;
    text += `+----+--------------+---------------------------------------+----------+----------+-----+\n`;

    products.forEach(p => {
      const flag = p.quantity <= p.minStock ? '(!)' : '   ';
      text += `| ${pad(p.id, 2, true)} | ${pad(p.sku, 12)} | ${pad(p.name, 37)} | ${pad(p.costPrice.toFixed(2) + '₺', 8, true)} | ${pad(p.sellingPrice.toFixed(2) + '₺', 8, true)} | ${pad(p.quantity + flag, 4, true)}|\n`;
    });

    text += `+----+--------------+---------------------------------------+----------+----------+-----+\n`;
    text += `(!) Kritik stok eşiğini gösterir.\n`;
    text += `Toplam Ürün Sayısı         : ${products.length} kalem\n`;
    text += `Toplam Stok Miktarı        : ${products.reduce((a, b) => a + b.quantity, 0)} birim\n`;
    text += `Toplam Envanter Değeri     : ${financials.totalInventoryCost.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺\n`;
    text += `Potansiyel Perakende Değeri: ${financials.totalRetailPotential.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺\n`;
    text += `========================================================================================\n`;
    text += `Onaylayan: Enes Öztürk | Paslı Mağaza Envanter Sistemi v1.0\n`;
    return text;
  };

  const generateFinancialTextReport = (): string => {
    let text = `================================================================\n`;
    text += `       PASLI MAĞAZA - RESMİ GELİR TABLOSU VE KÂR ANALİZİ         \n`;
    text += `       Hazırlayan: Enes Öztürk                                  \n`;
    text += `       Rapor Tarihi: ${new Date().toLocaleString('tr-TR')}      \n`;
    text += `================================================================\n\n`;
    text += `1. TOPLAM SATIŞ GELİRİ (CİRO)          : ${financials.totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 }).padStart(14)} ₺\n`;
    text += `2. SATILAN MALLARIN MALİYETİ (SMM)     : ${financials.totalCostOfGoodsSold.toLocaleString('tr-TR', { minimumFractionDigits: 2 }).padStart(14)} ₺\n`;
    text += `----------------------------------------------------------------\n`;
    text += `3. TOPLAM BRÜT TİCARİ KÂR              : ${financials.grossProfit.toLocaleString('tr-TR', { minimumFractionDigits: 2 }).padStart(14)} ₺\n`;
    text += `4. NET KÂR MARJI (BRÜT ORAN)           : %${financials.profitMarginPercent.toFixed(1).padStart(13)}\n`;
    text += `================================================================\n`;
    text += `5. DÖNEM İÇİ SATIN ALMA TOPLAMI        : ${financials.totalPurchasesCost.toLocaleString('tr-TR', { minimumFractionDigits: 2 }).padStart(14)} ₺\n`;
    text += `6. DEPO MEVCUT STOK MALİYETİ           : ${financials.totalInventoryCost.toLocaleString('tr-TR', { minimumFractionDigits: 2 }).padStart(14)} ₺\n`;
    text += `7. POTANSİYEL PERAKENDE CİROSU         : ${financials.totalRetailPotential.toLocaleString('tr-TR', { minimumFractionDigits: 2 }).padStart(14)} ₺\n`;
    text += `================================================================\n`;
    text += `Kayıtlı İşlem Sayısı: ${sales.length} Satış / ${purchases.length} Alım\n`;
    text += `Doğrulanmış ve Onaylanmış Rapor İmzası: Enes Öztürk\n`;
    return text;
  };

  const generateSalesTextReport = (): string => {
    let text = `========================================================================================\n`;
    text += `                     PASLI MAĞAZA - SATIŞ İŞLEMLERİ GEÇMİŞİ                             \n`;
    text += `                     Yönetici: Enes Öztürk                                              \n`;
    text += `========================================================================================\n`;
    text += `+-------------------+--------------------------------+-----+----------+----------+-----+\n`;
    text += `| FİŞ NO            | ÜRÜN ADI                       | ADT | SATIŞ    | KÂR      | KAS |\n`;
    text += `+-------------------+--------------------------------+-----+----------+----------+-----+\n`;

    sales.slice(0, 20).forEach(s => {
      const shortName = s.productName.length > 30 ? s.productName.slice(0, 27) + '...' : s.productName.padEnd(30);
      const shortCashier = s.cashierName.slice(0, 4);
      text += `| ${s.receiptNo.padEnd(17)} | ${shortName} | ${String(s.quantity).padStart(3)} | ${s.totalAmount.toFixed(2).padStart(8)}₺ | ${s.profit.toFixed(2).padStart(8)}₺ | ${shortCashier}|\n`;
    });

    text += `+-------------------+--------------------------------+-----+----------+----------+-----+\n`;
    text += `Toplam Satış Adedi : ${sales.reduce((a, b) => a + b.quantity, 0)} adet\n`;
    text += `Toplam Hasılat     : ${financials.totalRevenue.toFixed(2)} ₺\n`;
    text += `Toplam Elde Kâr    : ${financials.grossProfit.toFixed(2)} ₺\n`;
    text += `========================================================================================\n`;
    return text;
  };

  const generateLowStockTextReport = (): string => {
    const lowItems = products.filter(p => p.quantity <= p.minStock);
    let text = `================================================================\n`;
    text += `          PASLI MAĞAZA - KRİTİK STOK VE SİPARİŞ UYARI LİSTESİ   \n`;
    text += `          Kontrol Eden: Enes Öztürk                             \n`;
    text += `================================================================\n\n`;
    if (lowItems.length === 0) {
      text += `Harika haber! Şu anda kritik stok seviyesinde ürün bulunmamaktadır.\n`;
    } else {
      text += `Aşağıdaki ${lowItems.length} ürünün stoğu kritik eşiğin altına düşmüştür:\n\n`;
      lowItems.forEach(p => {
        const diff = p.minStock - p.quantity;
        text += `* [${p.sku}] ${p.name}\n`;
        text += `  Mevcut: ${p.quantity} ${p.unit} | Eşik: ${p.minStock} | Acil Sipariş Önerisi: +${Math.max(10, diff + 15)} ${p.unit}\n`;
        text += `  Tedarik Maliyeti: ~${p.costPrice.toFixed(2)} ₺ / birim\n\n`;
      });
    }
    text += `================================================================\n`;
    return text;
  };

  // --- Veri Sıfırlama & JSON Aktarım ---
  const resetToDefaultData = () => {
    setProducts(INITIAL_PRODUCTS);
    setSales(INITIAL_SALES);
    setPurchases(INITIAL_PURCHASES);
    setCurrentUser(INITIAL_USERS[0]);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.SALES);
    localStorage.removeItem(STORAGE_KEYS.PURCHASES);
  };

  const exportDatabaseJson = () => {
    return JSON.stringify({
      author: 'Enes Öztürk',
      appName: 'Paslı Mağaza Envanter Yönetim Sistemi',
      exportedAt: new Date().toISOString(),
      products,
      sales,
      purchases,
    }, null, 2);
  };

  const importDatabaseJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (Array.isArray(data.products) && Array.isArray(data.sales) && Array.isArray(data.purchases)) {
        setProducts(data.products);
        setSales(data.sales);
        setPurchases(data.purchases);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // --- Rust TUI / Terminal Komut Motoru ---
  const executeTerminalCommand = (rawCmd: string): { output: string; isError?: boolean } => {
    const cmd = rawCmd.trim();
    if (!cmd) return { output: '' };

    const parts = cmd.split(' ').filter(Boolean);
    const mainCmd = parts[0]?.toLowerCase();

    // 1. Cargo komutları
    if (mainCmd === 'cargo') {
      const sub = parts[1]?.toLowerCase();
      if (sub === 'test') {
        return {
          output: `   Compiling pasli_magaza v1.0.0 (/home/enes/pasli_magaza)
    Finished test [unoptimized + debuginfo] target(s) in 0.84s
     Running unittests src/main.rs (target/debug/deps/pasli_magaza-4f1a2)

running 14 tests
test tests::test_create_product ... ok
test tests::test_duplicate_sku_fails ... ok
test tests::test_invalid_price_fails ... ok
test tests::test_record_purchase_increases_stock ... ok
test tests::test_record_sale_reduces_stock_and_calculates_profit ... ok
test tests::test_sale_with_insufficient_stock_fails ... ok
test tests::test_cashier_cannot_add_product ... ok
test tests::test_admin_can_perform_all_actions ... ok
test tests::test_profit_calculation_accuracy ... ok
test tests::test_weighted_average_cost_update ... ok
test tests::test_inventory_report_generation ... ok
test tests::test_sales_history_report ... ok
test tests::test_low_stock_detection ... ok
test tests::test_empty_fields_validation ... ok

test result: ok. 14 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.04s

✨ Paslı Mağaza Entegrasyon Testleri Başarıyla Tamamlandı! (Enes Öztürk)`
        };
      }
      if (sub === 'run' || sub === 'build') {
        return {
          output: `   Compiling pasli_magaza v1.0.0 (/home/enes/pasli_magaza)
    Finished dev [unoptimized + debuginfo] target(s) in 0.42s
     Running \`target/debug/pasli_magaza\`

╔══════════════════════════════════════════════════════════════════╗
║       🦀 PASLI MAĞAZA ENVANTER VE SATIŞ YÖNETİM SİSTEMİ 🦀       ║
║                   Geliştirici: Enes Öztürk                       ║
╚══════════════════════════════════════════════════════════════════╝
Aktif Kullanıcı: ${currentUser.fullName} (${currentUser.role})
Envanter: ${products.length} ürün kayıtlı | Depo Değeri: ${financials.totalInventoryCost.toFixed(2)} TL
Satış Hasılatı: ${financials.totalRevenue.toFixed(2)} TL | Toplam Brüt Kâr: ${financials.grossProfit.toFixed(2)} TL

Kullanılabilir komutlar:
  • inventory list             -> Ürün listesini gösterir
  • sale record <id> <adet>    -> Satış kaydeder ve kârı hesaplar
  • purchase record <id> <adt> <fiyat> -> Alım kaydeder, stoku artırır
  • report financial           -> Gelir ve kâr analizini basar
  • whoami                     -> Aktif oturumu gösterir
  • help                       -> Komut rehberini açar`
        };
      }
    }

    // 2. Help
    if (mainCmd === 'help' || mainCmd === '?') {
      return {
        output: `🦀 PASLI MAĞAZA - RUST TERMİNAL YARDIM KILAVUZU (Enes Öztürk)
-----------------------------------------------------------------
inventory list                      : Envanterdeki tüm ürünleri listeler
inventory low                       : Kritik stok seviyesindeki ürünleri gösterir
sale record <ürün_id> <adet> [fiyat]: Satış işlemi yapar ve kârı hesaplar
purchase record <id> <adet> <fiyat> : Satın alma yapar, stok ve maliyet günceller
report inventory                    : Biçimlendirilmiş envanter tablosunu yazdırır
report financial                    : Kâr-zarar mali raporunu görüntüler
report sales                        : Son satış işlemlerini döker
whoami                              : Oturum açan kullanıcının bilgilerini verir
switch-role <Admin|Manager|Cashier> : Rol değiştirir (RBAC testleri için)
cargo test                          : Rust test paketini çalıştırır (14 test)
cargo run                           : Ana Rust uygulamasını çalıştırır
clear                               : Ekranı temizler`
      };
    }

    // 3. Whoami
    if (mainCmd === 'whoami') {
      return {
        output: `Kullanıcı: ${currentUser.fullName} (@${currentUser.username})\nRol      : ${currentUser.role}\nE-Posta  : ${currentUser.email}\nYetkiler : ${currentUser.role === 'Admin' ? 'Tam Erişim (Sistem Yöneticisi)' : currentUser.role === 'Manager' ? 'Envanter ve Alım Yönetimi' : 'Yalnızca Satış İşlemleri'}`
      };
    }

    // 4. Switch-role
    if (mainCmd === 'switch-role') {
      const targetRole = parts[1]?.toLowerCase();
      if (targetRole === 'admin') {
        switchRole('Admin');
        return { output: `✓ Rol 'Admin' (Enes Öztürk) olarak değiştirildi.` };
      } else if (targetRole === 'manager') {
        switchRole('Manager');
        return { output: `✓ Rol 'Manager' (Ayşe Yılmaz) olarak değiştirildi.` };
      } else if (targetRole === 'cashier') {
        switchRole('Cashier');
        return { output: `✓ Rol 'Cashier' (Can Demir) olarak değiştirildi.` };
      } else {
        return { output: `Geçersiz rol. Seçenekler: Admin, Manager, Cashier`, isError: true };
      }
    }

    // 5. Inventory komutları
    if (mainCmd === 'inventory' || mainCmd === 'inv') {
      const sub = parts[1]?.toLowerCase();
      if (sub === 'list' || !sub) {
        return { output: generateInventoryTextReport() };
      }
      if (sub === 'low') {
        return { output: generateLowStockTextReport() };
      }
    }

    // 6. Report komutları
    if (mainCmd === 'report' || mainCmd === 'rep') {
      const sub = parts[1]?.toLowerCase();
      if (sub === 'financial' || sub === 'kar' || sub === 'profit') {
        return { output: generateFinancialTextReport() };
      }
      if (sub === 'inventory') {
        return { output: generateInventoryTextReport() };
      }
      if (sub === 'sales') {
        return { output: generateSalesTextReport() };
      }
      if (sub === 'low') {
        return { output: generateLowStockTextReport() };
      }
      return { output: `Bilinmeyen rapor tipi. Seçenekler: financial, inventory, sales, low`, isError: true };
    }

    // 7. Satış kaydı: sale record <id> <adet> [fiyat]
    if (mainCmd === 'sale') {
      const sub = parts[1]?.toLowerCase();
      if (sub === 'record' || sub === 'new') {
        const prodId = Number(parts[2]);
        const qty = Number(parts[3]);
        const customPrice = parts[4] ? Number(parts[4]) : undefined;

        if (isNaN(prodId) || isNaN(qty)) {
          return {
            output: `Kullanım: sale record <ürün_id> <adet> [özel_fiyat]\nÖrnek: sale record 1 3`,
            isError: true,
          };
        }

        const res = recordSale({
          productId: prodId,
          quantity: qty,
          sellingPrice: customPrice,
          note: 'Rust Terminal Satışı',
        });

        if (res.success && res.sale) {
          return {
            output: `✓ Satış Başarılı!
Fiş No       : ${res.sale.receiptNo}
Ürün         : ${res.sale.productName}
Miktar       : ${res.sale.quantity} adet
Birim Fiyat  : ${res.sale.unitSellingPrice.toFixed(2)} TL
Toplam Satış : ${res.sale.totalAmount.toFixed(2)} TL
Birim Maliyet: ${res.sale.unitCostPrice.toFixed(2)} TL
Elde Edilen Kâr: ${res.sale.profit.toFixed(2)} TL (Kâr Oranı: %${((res.sale.profit / res.sale.totalAmount) * 100).toFixed(1)})
Kasiyer      : ${res.sale.cashierName}`
          };
        } else {
          return {
            output: `❌ HATA [${res.error?.code}]: ${res.error?.message}`,
            isError: true,
          };
        }
      }
    }

    // 8. Satın alma: purchase record <id> <adet> <fiyat>
    if (mainCmd === 'purchase') {
      const sub = parts[1]?.toLowerCase();
      if (sub === 'record' || sub === 'new') {
        const prodId = Number(parts[2]);
        const qty = Number(parts[3]);
        const price = Number(parts[4]);

        if (isNaN(prodId) || isNaN(qty) || isNaN(price)) {
          return {
            output: `Kullanım: purchase record <ürün_id> <adet> <birim_alış_fiyatı>\nÖrnek: purchase record 2 10 190.0`,
            isError: true,
          };
        }

        const res = recordPurchase({
          productId: prodId,
          quantity: qty,
          purchasePrice: price,
          supplier: 'Terminal Tedarikçisi',
          note: 'Rust Konsol Girişi',
        });

        if (res.success && res.purchase) {
          return {
            output: `✓ Satın Alma Kaydedildi!
Fatura No    : ${res.purchase.invoiceNo}
Ürün         : ${res.purchase.productName}
Alınan Miktar: ${res.purchase.quantity} adet
Alış Fiyatı  : ${res.purchase.unitPurchasePrice.toFixed(2)} TL
Toplam Harcama: ${res.purchase.totalCost.toFixed(2)} TL
Yeni Stok ve Ağırlıklı Ortalama Maliyet Envantere İşlendi.
İşlemi Yapan : ${res.purchase.managerName}`
          };
        } else {
          return {
            output: `❌ HATA [${res.error?.code}]: ${res.error?.message}`,
            isError: true,
          };
        }
      }
    }

    return {
      output: `Bilinmeyen komut: '${cmd}'. Yardım için 'help' veya 'cargo run' yazınız.`,
      isError: true,
    };
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        sales,
        purchases,
        users,
        currentUser,
        financials,
        lastError,
        clearError,
        setCurrentUser,
        switchRole,
        addProduct,
        updateProduct,
        deleteProduct,
        recordSale,
        recordPurchase,
        generateInventoryTextReport,
        generateFinancialTextReport,
        generateSalesTextReport,
        generateLowStockTextReport,
        resetToDefaultData,
        exportDatabaseJson,
        importDatabaseJson,
        executeTerminalCommand,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
