import React, { useState, useEffect } from 'react';
import {
  Product,
  Supplier,
  StockMovement,
  PurchaseOrder,
  StockAlertEvent,
  SwingTheme,
  MovementType,
} from './types/warehouse';
import { warehouseEngine } from './services/warehouseEngine';
import { SwingWindowFrame } from './components/swing/SwingWindowFrame';
import { SwingMenuBar } from './components/swing/SwingMenuBar';
import { SwingToolBar } from './components/swing/SwingToolBar';
import { SwingStatusBar } from './components/swing/SwingStatusBar';
import { SwingOptionPane } from './components/swing/SwingOptionPane';
import { InventoryView } from './components/views/InventoryView';
import { TransactionsView } from './components/views/TransactionsView';
import { SuppliersView } from './components/views/SuppliersView';
import { ArchitectureView } from './components/views/ArchitectureView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { StockMovementModal } from './components/views/StockMovementModal';
import { NewProductModal } from './components/views/NewProductModal';
import { NewSupplierModal } from './components/views/NewSupplierModal';
import { CriticalSimulatorModal } from './components/views/CriticalSimulatorModal';
import { LinkedInShowcaseModal } from './components/views/LinkedInShowcaseModal';

export default function App() {
  const [theme, setTheme] = useState<SwingTheme>('darcula');
  const [activeTab, setActiveTab] = useState<
    'INVENTORY' | 'TRANSACTIONS' | 'SUPPLIERS' | 'ARCHITECTURE' | 'ANALYTICS'
  >('INVENTORY');

  // Core Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);

  // Modals & Dialogs
  const [isStockInOpen, setIsStockInOpen] = useState(false);
  const [isStockOutOpen, setIsStockOutOpen] = useState(false);
  const [selectedProductForAction, setSelectedProductForAction] = useState<Product | null>(null);

  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [isNewSupplierOpen, setIsNewSupplierOpen] = useState(false);
  const [isCriticalSimOpen, setIsCriticalSimOpen] = useState(false);
  const [isLinkedInOpen, setIsLinkedInOpen] = useState(false);

  // JOptionPane Alert State
  const [optionPane, setOptionPane] = useState<{
    isOpen: boolean;
    type: 'ERROR' | 'WARNING' | 'INFO' | 'QUESTION';
    title: string;
    message: string;
    detail?: string;
  }>({
    isOpen: false,
    type: 'INFO',
    title: 'Java Swing Bildirimi',
    message: '',
  });

  const refreshData = () => {
    setProducts(warehouseEngine.getProducts());
    setSuppliers(warehouseEngine.getSuppliers());
    setMovements(warehouseEngine.getMovements());
    setPurchaseOrders(warehouseEngine.getPurchaseOrders());
  };

  useEffect(() => {
    refreshData();

    // Event-Driven Listener Subscription (Observer Pattern)
    const unsubscribe = warehouseEngine.subscribeAlerts((alert: StockAlertEvent) => {
      refreshData();

      // Show real Swing JOptionPane popup on alert!
      if (alert.eventType === 'DEPLETED') {
        setOptionPane({
          isOpen: true,
          type: 'ERROR',
          title: 'Kritik Stok Tükenme Uyarısı (JOptionPane)',
          message: alert.message,
          detail: `Olay Tipi: ${alert.eventType}\nSKU: ${alert.sku}\nÜrün: ${alert.productName}\nMevcut Stok: 0 Adet\nİşlem: Tedarikçiye acil otomatik satın alma emri oluşturuldu.`,
        });
      } else if (alert.eventType === 'CRITICAL_LEVEL') {
        setOptionPane({
          isOpen: true,
          type: 'WARNING',
          title: 'Kritik Seviye Uyarısı (JOptionPane)',
          message: alert.message,
          detail: `Olay Tipi: ${alert.eventType}\nSKU: ${alert.sku}\nÜrün: ${alert.productName}\nMevcut Stok: ${alert.currentQuantity}\nKritik Eşik: ${alert.threshold}\nÖneri: Tedarik emri verilmesi tavsiye edilir.`,
        });
      } else if (alert.eventType === 'RESTOCKED') {
        setOptionPane({
          isOpen: true,
          type: 'INFO',
          title: 'Stok Yenilendi Bildirimi',
          message: alert.message,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Handlers for Stock In & Out
  const handleStockInSubmit = (data: {
    sku: string;
    quantity: number;
    reason: string;
    documentNo: string;
    operatorName: string;
    notes?: string;
  }) => {
    const result = warehouseEngine.processStockIn(
      data.sku,
      data.quantity,
      data.reason,
      data.documentNo,
      data.operatorName,
      data.notes
    );

    refreshData();

    if (result.success) {
      setOptionPane({
        isOpen: true,
        type: 'INFO',
        title: 'Depo Girişi Başarılı',
        message: result.message,
        detail: `Belge No: ${data.documentNo}\nOperatör: ${data.operatorName}`,
      });
    } else {
      setOptionPane({
        isOpen: true,
        type: 'ERROR',
        title: 'Depo Giriş Hatası',
        message: result.message,
      });
    }
  };

  const handleStockOutSubmit = (data: {
    sku: string;
    quantity: number;
    reason: string;
    documentNo: string;
    operatorName: string;
    notes?: string;
  }) => {
    const result = warehouseEngine.processStockOut(
      data.sku,
      data.quantity,
      data.reason,
      data.documentNo,
      data.operatorName,
      data.notes
    );

    refreshData();

    if (!result.success) {
      // Show Encapsulation violation exception alert
      setOptionPane({
        isOpen: true,
        type: 'ERROR',
        title: 'İşlem Başarısız (OOP Kural İhlali)',
        message: result.message,
        detail: `İstisna: com.enesozturk.depostok.exception.InsufficientStockException\nTalep Edilen SKU: ${data.sku}\nTalep Miktarı: ${data.quantity}\nDurum: İşlem geri alındı (Rollback).`,
      });
    } else {
      // Successful stock out (Event listener will show warning if it triggered critical level!)
      if (result.movement && result.movement.newQuantity > 0) {
        setOptionPane({
          isOpen: true,
          type: 'INFO',
          title: 'Depo Çıkışı Tamamlandı',
          message: result.message,
          detail: `Belge No: ${data.documentNo}\nKalan Stok: ${result.movement.newQuantity} Adet`,
        });
      }
    }
  };

  // Critical Simulator trigger
  const handleSimulateCritical = (sku: string, targetStock: number, reason: string) => {
    const product = products.find((p) => p.sku === sku);
    if (!product) return;

    if (product.stockQuantity > targetStock) {
      const diff = product.stockQuantity - targetStock;
      handleStockOutSubmit({
        sku: product.sku,
        quantity: diff,
        reason,
        documentNo: `TEST-SIM-${Date.now().toString().slice(-4)}`,
        operatorName: 'Enes Öztürk (Test Modu)',
      });
    }
  };

  // Auto Reorder All
  const handleAutoReorderAll = () => {
    const criticalList = products.filter((p) => p.stockQuantity <= p.reorderThreshold);
    if (criticalList.length === 0) {
      setOptionPane({
        isOpen: true,
        type: 'INFO',
        title: 'Otomatik Tedarik Denetimi',
        message: 'Kritik stok seviyesinde ürün bulunmuyor. Tüm ürünler güvenli seviyede.',
      });
      return;
    }

    let createdCount = 0;
    criticalList.forEach((p) => {
      const ord = warehouseEngine.triggerAutoReorder(p, p.reorderThreshold * 2);
      if (ord) createdCount++;
    });

    refreshData();
    setActiveTab('SUPPLIERS');

    setOptionPane({
      isOpen: true,
      type: 'INFO',
      title: 'Otomatik Satın Alma Emirleri Üretildi',
      message: `${criticalList.length} kritik ürün için anlaşmalı tedarikçi firmalara satın alma siparişleri başarıyla iletildi.`,
      detail: `Oluşturulan siparişler 'Tedarikçiler & Siparişler' sekmesinde listelendi.`,
    });
  };

  // Export JSON backup
  const handleExportJson = () => {
    const dataStr = JSON.stringify(
      {
        developer: 'Enes Öztürk',
        project: 'Java Swing & OOP Depo ve Tedarik Zinciri Otomasyonu',
        exportedAt: new Date().toISOString(),
        products,
        suppliers,
        movements,
        purchaseOrders,
      },
      null,
      2
    );

    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `depo-stok-yedek-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Reset to defaults
  const handleResetData = () => {
    warehouseEngine.resetToDefaults();
    refreshData();
    setOptionPane({
      isOpen: true,
      type: 'INFO',
      title: 'Veritabanı Sıfırlandı',
      message: 'Tüm depo kayıtları, ürünler ve tedarikçiler başlangıç verilerine başarıyla döndürüldü.',
    });
  };

  const metrics = warehouseEngine.getWarehouseMetrics();

  return (
    <>
      <SwingWindowFrame
        theme={theme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        criticalCount={metrics.criticalCount}
        depletedCount={metrics.depletedCount}
        menuBar={
          <SwingMenuBar
            theme={theme}
            setTheme={setTheme}
            onOpenStockIn={() => {
              setSelectedProductForAction(null);
              setIsStockInOpen(true);
            }}
            onOpenStockOut={() => {
              setSelectedProductForAction(null);
              setIsStockOutOpen(true);
            }}
            onOpenNewProduct={() => setIsNewProductOpen(true)}
            onOpenNewSupplier={() => setIsNewSupplierOpen(true)}
            onOpenLinkedIn={() => setIsLinkedInOpen(true)}
            onOpenArchitecture={() => setActiveTab('ARCHITECTURE')}
            onResetData={handleResetData}
            onExportJson={handleExportJson}
            onSimulateCritical={() => setIsCriticalSimOpen(true)}
          />
        }
        toolBar={
          <SwingToolBar
            theme={theme}
            onOpenStockIn={() => {
              setSelectedProductForAction(null);
              setIsStockInOpen(true);
            }}
            onOpenStockOut={() => {
              setSelectedProductForAction(null);
              setIsStockOutOpen(true);
            }}
            onOpenNewProduct={() => setIsNewProductOpen(true)}
            onOpenLinkedIn={() => setIsLinkedInOpen(true)}
            onOpenArchitecture={() => setActiveTab('ARCHITECTURE')}
            onSimulateCritical={() => setIsCriticalSimOpen(true)}
            onAutoReorder={handleAutoReorderAll}
            onRefresh={refreshData}
          />
        }
        statusBar={
          <SwingStatusBar
            theme={theme}
            totalProducts={metrics.totalProducts}
            criticalCount={metrics.criticalCount}
            depletedCount={metrics.depletedCount}
            totalValuation={metrics.totalValuation}
            activeOrdersCount={metrics.activeOrdersCount}
          />
        }
      >
        {activeTab === 'INVENTORY' && (
          <InventoryView
            products={products}
            theme={theme}
            onSelectProduct={(p) => setSelectedProductForAction(p)}
            onStockIn={(p) => {
              setSelectedProductForAction(p);
              setIsStockInOpen(true);
            }}
            onStockOut={(p) => {
              setSelectedProductForAction(p);
              setIsStockOutOpen(true);
            }}
            onSimulateCritical={(p) => {
              setSelectedProductForAction(p);
              setIsCriticalSimOpen(true);
            }}
            calculateStorageCost={(p) => warehouseEngine.calculateMonthlyStorageCost(p)}
          />
        )}

        {activeTab === 'TRANSACTIONS' && (
          <TransactionsView
            movements={movements}
            theme={theme}
            onOpenStockIn={() => {
              setSelectedProductForAction(null);
              setIsStockInOpen(true);
            }}
            onOpenStockOut={() => {
              setSelectedProductForAction(null);
              setIsStockOutOpen(true);
            }}
          />
        )}

        {activeTab === 'SUPPLIERS' && (
          <SuppliersView
            suppliers={suppliers}
            purchaseOrders={purchaseOrders}
            products={products}
            theme={theme}
            onOpenNewSupplier={() => setIsNewSupplierOpen(true)}
            onAutoReorderAll={handleAutoReorderAll}
            onUpdateOrderStatus={(orderId, status) => {
              warehouseEngine.updatePurchaseOrderStatus(orderId, status);
              refreshData();
            }}
          />
        )}

        {activeTab === 'ARCHITECTURE' && <ArchitectureView theme={theme} />}

        {activeTab === 'ANALYTICS' && (
          <AnalyticsView
            products={products}
            theme={theme}
            calculateStorageCost={(p) => warehouseEngine.calculateMonthlyStorageCost(p)}
          />
        )}
      </SwingWindowFrame>

      {/* JDialog Modal: Stock In */}
      <StockMovementModal
        isOpen={isStockInOpen}
        type="STOCK_IN"
        product={selectedProductForAction}
        allProducts={products}
        theme={theme}
        onClose={() => setIsStockInOpen(false)}
        onSubmit={handleStockInSubmit}
      />

      {/* JDialog Modal: Stock Out */}
      <StockMovementModal
        isOpen={isStockOutOpen}
        type="STOCK_OUT"
        product={selectedProductForAction}
        allProducts={products}
        theme={theme}
        onClose={() => setIsStockOutOpen(false)}
        onSubmit={handleStockOutSubmit}
      />

      {/* JDialog Modal: New Product */}
      <NewProductModal
        isOpen={isNewProductOpen}
        suppliers={suppliers}
        theme={theme}
        onClose={() => setIsNewProductOpen(false)}
        onSubmit={(newProd) => {
          warehouseEngine.addProduct(newProd);
          refreshData();
          setOptionPane({
            isOpen: true,
            type: 'INFO',
            title: 'Yeni Ürün Kaydedildi',
            message: `${newProd.name} (${newProd.sku}) başarıyla veritabanına ve depoya eklendi.`,
          });
        }}
      />

      {/* JDialog Modal: New Supplier */}
      <NewSupplierModal
        isOpen={isNewSupplierOpen}
        theme={theme}
        onClose={() => setIsNewSupplierOpen(false)}
        onSubmit={(newSup) => {
          warehouseEngine.addSupplier(newSup);
          refreshData();
          setOptionPane({
            isOpen: true,
            type: 'INFO',
            title: 'Yeni Tedarikçi Kaydedildi',
            message: `${newSup.name} tedarikçi portföyüne kaydedildi.`,
          });
        }}
      />

      {/* JDialog Modal: Critical Simulator */}
      <CriticalSimulatorModal
        isOpen={isCriticalSimOpen}
        products={products}
        theme={theme}
        onClose={() => setIsCriticalSimOpen(false)}
        onSimulate={handleSimulateCritical}
      />

      {/* JDialog Modal: LinkedIn Showcase */}
      <LinkedInShowcaseModal
        isOpen={isLinkedInOpen}
        theme={theme}
        onClose={() => setIsLinkedInOpen(false)}
      />

      {/* Java Swing JOptionPane Popup Dialog */}
      <SwingOptionPane
        isOpen={optionPane.isOpen}
        type={optionPane.type}
        title={optionPane.title}
        message={optionPane.message}
        detail={optionPane.detail}
        theme={theme}
        onConfirm={() => setOptionPane((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
}
