import {
  Product,
  Supplier,
  StockMovement,
  PurchaseOrder,
  StockAlertEvent,
} from '../types/warehouse';
import {
  INITIAL_PRODUCTS,
  INITIAL_SUPPLIERS,
  INITIAL_MOVEMENTS,
  INITIAL_PURCHASE_ORDERS,
} from '../data/initialData';

export type AlertCallback = (alert: StockAlertEvent) => void;

class WarehouseEngine {
  private products: Product[] = [];
  private suppliers: Supplier[] = [];
  private movements: StockMovement[] = [];
  private purchaseOrders: PurchaseOrder[] = [];
  private alertHistory: StockAlertEvent[] = [];
  private alertListeners: AlertCallback[] = [];

  constructor() {
    this.resetToDefaults();
  }

  public resetToDefaults() {
    this.products = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
    this.suppliers = JSON.parse(JSON.stringify(INITIAL_SUPPLIERS));
    this.movements = JSON.parse(JSON.stringify(INITIAL_MOVEMENTS));
    this.purchaseOrders = JSON.parse(JSON.stringify(INITIAL_PURCHASE_ORDERS));
    this.alertHistory = [
      {
        id: 'alt-1',
        timestamp: '2026-03-06T15:30:00Z',
        sku: 'KIM-SLV-301',
        productName: 'Endüstriyel Epoksi Reçine Çözücü (İzopropil)',
        eventType: 'DEPLETED',
        currentQuantity: 0,
        threshold: 10,
        message: 'STOK TÜKENDİ: Ürün miktarı 0 adede indi! Otomatik acil tedarik siparişi açıldı.',
        resolved: false,
      },
      {
        id: 'alt-2',
        timestamp: '2026-03-06T11:00:00Z',
        sku: 'MED-INS-108',
        productName: 'Liyofilize Enjektabl Biyolojik Solüsyon',
        eventType: 'CRITICAL_LEVEL',
        currentQuantity: 8,
        threshold: 20,
        message: 'KRİTİK STOK UYARISI: Mevcut stok (8 Kutu) kritik eşik olan 20 Kutu altına düştü.',
        resolved: false,
      },
    ];
  }

  public subscribeAlerts(callback: AlertCallback) {
    this.alertListeners.push(callback);
    return () => {
      this.alertListeners = this.alertListeners.filter((cb) => cb !== callback);
    };
  }

  private notifyAlert(alert: StockAlertEvent) {
    this.alertHistory.unshift(alert);
    this.alertListeners.forEach((listener) => {
      try {
        listener(alert);
      } catch (err) {
        console.error('Alert listener failed', err);
      }
    });
  }

  // --- Getters ---
  public getProducts(): Product[] {
    return [...this.products];
  }

  public getSuppliers(): Supplier[] {
    return [...this.suppliers];
  }

  public getMovements(): StockMovement[] {
    return [...this.movements];
  }

  public getPurchaseOrders(): PurchaseOrder[] {
    return [...this.purchaseOrders];
  }

  public getAlertHistory(): StockAlertEvent[] {
    return [...this.alertHistory];
  }

  public getProductBySku(sku: string): Product | undefined {
    return this.products.find((p) => p.sku === sku);
  }

  public getSupplierById(id: string): Supplier | undefined {
    return this.suppliers.find((s) => s.id === id);
  }

  // --- Polymorphic Calculation (Çok Biçimlilik) ---
  public calculateMonthlyStorageCost(product: Product): number {
    const baseValuation = product.stockQuantity * product.unitPrice;
    let factor = 0.02; // Standart %2 depo maliyeti

    switch (product.productType) {
      case 'PERISHABLE':
        // Negatif dereceli dondurucu odalar için ek soğutma maliyeti
        if (product.storageTempCelsius && product.storageTempCelsius < 0) {
          factor = 0.045; // %4.5
        } else {
          factor = 0.035; // %3.5
        }
        break;
      case 'HAZARDOUS':
        // Yangın söndürme, havalandırma, ADR sigorta primi
        factor = 0.055; // %5.5
        break;
      case 'ELECTRONIC':
        // ESD antistatik iklimlendirme, nem kontrolü
        factor = 0.03; // %3.0
        break;
      case 'STANDARD':
      default:
        factor = 0.02;
        break;
    }

    return baseValuation * factor;
  }

  // --- Encapsulated Stock Management & Business Validation ---
  public processStockIn(
    sku: string,
    quantity: number,
    reason: string,
    documentNo: string,
    operatorName: string,
    notes?: string
  ): { success: boolean; message: string; movement?: StockMovement } {
    if (quantity <= 0) {
      return { success: false, message: 'Giriş miktarı 0\'dan büyük bir tamsayı olmalıdır!' };
    }

    const product = this.products.find((p) => p.sku === sku);
    if (!product) {
      return { success: false, message: `Hata: ${sku} kodlu ürün bulunamadı.` };
    }

    const previousQuantity = product.stockQuantity;
    product.stockQuantity += quantity;
    product.updatedAt = new Date().toISOString();

    const movement: StockMovement = {
      id: `mov-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sku: product.sku,
      productName: product.name,
      movementType: 'STOCK_IN',
      quantity,
      previousQuantity,
      newQuantity: product.stockQuantity,
      reason: reason || 'Tedarikçi Giriş Kabulü',
      documentNo: documentNo || `İRS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      operatorName: operatorName || 'Enes Öztürk',
      timestamp: new Date().toISOString(),
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.movements.unshift(movement);

    // If item was previously critical/depleted and now above, log restoration
    if (previousQuantity <= product.reorderThreshold && product.stockQuantity > product.reorderThreshold) {
      this.notifyAlert({
        id: `alt-${Date.now()}`,
        timestamp: new Date().toISOString(),
        sku: product.sku,
        productName: product.name,
        eventType: 'RESTOCKED',
        currentQuantity: product.stockQuantity,
        threshold: product.reorderThreshold,
        message: `STOK YENİLENDİ: ${product.name} stoğu ${product.stockQuantity} ${product.unit} seviyesine yükseltildi. Kritik durum çözüldü.`,
        resolved: true,
      });
    }

    return {
      success: true,
      message: `${quantity} ${product.unit} stok başarıyla depoya kaydedildi. Yeni miktar: ${product.stockQuantity}`,
      movement,
    };
  }

  public processStockOut(
    sku: string,
    quantity: number,
    reason: string,
    documentNo: string,
    operatorName: string,
    notes?: string
  ): { success: boolean; message: string; movement?: StockMovement } {
    if (quantity <= 0) {
      return { success: false, message: 'Çıkış miktarı en az 1 olmalıdır!' };
    }

    const product = this.products.find((p) => p.sku === sku);
    if (!product) {
      return { success: false, message: `Hata: ${sku} kodlu ürün veritabanında bulunamadı.` };
    }

    // OOP Encapsulation Invariant Check (InsufficientStockException simulation)
    if (product.stockQuantity < quantity) {
      return {
        success: false,
        message: `YETERSİZ STOK HATASI (InsufficientStockException): İstenen ${quantity} ${product.unit}, mevcut stok ise yalnızca ${product.stockQuantity} ${product.unit}!`,
      };
    }

    // Polymorphic validation check (e.g., expiry check for Perishable)
    if (product.productType === 'PERISHABLE' && product.expiryDate) {
      const expDate = new Date(product.expiryDate);
      if (expDate < new Date()) {
        return {
          success: false,
          message: `SEVKİYAT ENGELLENDİ: ${product.name} son kullanma tarihi (${product.expiryDate}) geçmiştir! Kalite kontrol gereği sevk edilemez.`,
        };
      }
    }

    const previousQuantity = product.stockQuantity;
    product.stockQuantity -= quantity;
    product.updatedAt = new Date().toISOString();

    const movement: StockMovement = {
      id: `mov-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sku: product.sku,
      productName: product.name,
      movementType: 'STOCK_OUT',
      quantity,
      previousQuantity,
      newQuantity: product.stockQuantity,
      reason: reason || 'Müşteri Sevkiyatı / Üretim Çıkışı',
      documentNo: documentNo || `SEVK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      operatorName: operatorName || 'Enes Öztürk',
      timestamp: new Date().toISOString(),
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.movements.unshift(movement);

    // Event-Driven: Ürün tükendiğinde veya kritik seviyeye indiğinde otomatik uyarı mekanizması
    if (product.stockQuantity === 0) {
      const alert: StockAlertEvent = {
        id: `alt-${Date.now()}`,
        timestamp: new Date().toISOString(),
        sku: product.sku,
        productName: product.name,
        eventType: 'DEPLETED',
        currentQuantity: 0,
        threshold: product.reorderThreshold,
        message: `STOK TÜKENDİ! ${product.name} (${product.sku}) depo stoğu tamamen bitti!`,
        resolved: false,
      };
      this.notifyAlert(alert);
      this.triggerAutoReorder(product, product.reorderThreshold * 2);
    } else if (product.stockQuantity <= product.reorderThreshold) {
      const alert: StockAlertEvent = {
        id: `alt-${Date.now()}`,
        timestamp: new Date().toISOString(),
        sku: product.sku,
        productName: product.name,
        eventType: 'CRITICAL_LEVEL',
        currentQuantity: product.stockQuantity,
        threshold: product.reorderThreshold,
        message: `KRİTİK STOK UYARISI: ${product.name} stoğu (${product.stockQuantity} ${product.unit}), kritik eşiğin (${product.reorderThreshold}) altına indi!`,
        resolved: false,
      };
      this.notifyAlert(alert);
      this.triggerAutoReorder(product, product.reorderThreshold);
    }

    return {
      success: true,
      message: `${quantity} ${product.unit} stok çıkışı tamamlandı. Kalan stok: ${product.stockQuantity}`,
      movement,
    };
  }

  // --- Automated Supply Chain Purchase Order (Event Driven) ---
  public triggerAutoReorder(product: Product, orderQty: number): PurchaseOrder | null {
    const supplier = this.suppliers.find((s) => s.id === product.supplierId) || this.suppliers[0];
    const qty = Math.max(orderQty, product.reorderThreshold, 10);

    const existingPending = this.purchaseOrders.find(
      (po) => po.sku === product.sku && (po.status === 'PENDING' || po.status === 'ORDERED' || po.status === 'IN_TRANSIT')
    );

    if (existingPending) {
      // Sipariş zaten açık, tekrar mükerrer sipariş açma
      return existingPending;
    }

    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() + (supplier ? supplier.leadTimeDays : 3));

    const newOrder: PurchaseOrder = {
      id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderNumber: `TED-SIP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      supplierId: supplier ? supplier.id : 'sup-1',
      supplierName: supplier ? supplier.name : 'Genel Tedarikçi',
      sku: product.sku,
      productName: product.name,
      quantity: qty,
      unitPrice: product.unitPrice,
      totalAmount: qty * product.unitPrice,
      orderDate: new Date().toISOString(),
      expectedDate: expectedDate.toISOString(),
      status: 'ORDERED',
      isAutoGenerated: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.purchaseOrders.unshift(newOrder);
    return newOrder;
  }

  public updatePurchaseOrderStatus(orderId: string, newStatus: PurchaseOrder['status']) {
    const order = this.purchaseOrders.find((o) => o.id === orderId);
    if (!order) return false;

    const oldStatus = order.status;
    order.status = newStatus;
    order.updatedAt = new Date().toISOString();

    // If order transitioned to RECEIVED, automatically add items into stock!
    if (oldStatus !== 'RECEIVED' && newStatus === 'RECEIVED') {
      this.processStockIn(
        order.sku,
        order.quantity,
        `Tedarik Kabulü (${order.orderNumber})`,
        order.orderNumber,
        'Enes Öztürk (Otomatik Kabul)'
      );
    }

    return true;
  }

  // --- Product Management (CRUD) ---
  public addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const newProduct: Product = {
      ...product,
      id: `prd-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.products.unshift(newProduct);

    // Initial movement
    if (newProduct.stockQuantity > 0) {
      this.movements.unshift({
        id: `mov-${Date.now()}`,
        sku: newProduct.sku,
        productName: newProduct.name,
        movementType: 'STOCK_IN',
        quantity: newProduct.stockQuantity,
        previousQuantity: 0,
        newQuantity: newProduct.stockQuantity,
        reason: 'İlk Stok Tanımlama',
        documentNo: 'BAŞLANGIÇ-001',
        operatorName: 'Enes Öztürk',
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return newProduct;
  }

  public updateProduct(updated: Product) {
    const idx = this.products.findIndex((p) => p.id === updated.id);
    if (idx !== -1) {
      this.products[idx] = {
        ...updated,
        updatedAt: new Date().toISOString(),
      };
      return true;
    }
    return false;
  }

  public deleteProduct(id: string): boolean {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.products.splice(idx, 1);
      return true;
    }
    return false;
  }

  // --- Supplier Management ---
  public addSupplier(supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Supplier {
    const newSupplier: Supplier = {
      ...supplier,
      id: `sup-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.suppliers.push(newSupplier);
    return newSupplier;
  }

  // --- Aggregate Metrics & Statistics ---
  public getWarehouseMetrics() {
    const totalProducts = this.products.length;
    const totalUnits = this.products.reduce((acc, p) => acc + p.stockQuantity, 0);
    const totalValuation = this.products.reduce((acc, p) => acc + p.stockQuantity * p.unitPrice, 0);
    const criticalCount = this.products.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= p.reorderThreshold).length;
    const depletedCount = this.products.filter((p) => p.stockQuantity === 0).length;
    const totalMonthlyStorageCost = this.products.reduce((acc, p) => acc + this.calculateMonthlyStorageCost(p), 0);

    return {
      totalProducts,
      totalUnits,
      totalValuation,
      criticalCount,
      depletedCount,
      totalMonthlyStorageCost,
      totalSuppliers: this.suppliers.length,
      activeOrdersCount: this.purchaseOrders.filter((po) => po.status !== 'RECEIVED' && po.status !== 'CANCELLED').length,
    };
  }
}

export const warehouseEngine = new WarehouseEngine();
