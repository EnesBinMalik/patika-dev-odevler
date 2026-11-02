import React, { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import { Navbar, ActiveTab } from './components/Navbar';
import { InventoryView } from './components/InventoryView';
import { SalesView } from './components/SalesView';
import { PurchasesView } from './components/PurchasesView';
import { ReportsView } from './components/ReportsView';
import { TerminalView } from './components/TerminalView';
import { RustCodeView } from './components/RustCodeView';
import { ErrorAlert } from './components/ErrorAlert';
import { Footer } from './components/Footer';

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('inventory');
  const [targetProductId, setTargetProductId] = useState<number | null>(null);

  const handleQuickSale = (productId: number) => {
    setTargetProductId(productId);
    setActiveTab('sales');
  };

  const handleQuickPurchase = (productId: number) => {
    setTargetProductId(productId);
    setActiveTab('purchases');
  };

  const handleClearTargetProduct = () => {
    setTargetProductId(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200">
      
      {/* Üst Navigasyon Çubuğu */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewSale={() => {
          setTargetProductId(null);
          setActiveTab('sales');
        }}
      />

      {/* Rust Hata Bildirimi Paneli */}
      <ErrorAlert />

      {/* Ana İçerik Alanı */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'inventory' && (
          <InventoryView
            onQuickSale={handleQuickSale}
            onQuickPurchase={handleQuickPurchase}
          />
        )}

        {activeTab === 'sales' && (
          <SalesView
            initialProductId={targetProductId}
            onClearInitialProduct={handleClearTargetProduct}
          />
        )}

        {activeTab === 'purchases' && (
          <PurchasesView
            initialProductId={targetProductId}
            onClearInitialProduct={handleClearTargetProduct}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView />
        )}

        {activeTab === 'terminal' && (
          <TerminalView />
        )}

        {activeTab === 'code' && (
          <RustCodeView />
        )}
      </main>

      {/* Alt Bilgi */}
      <Footer />

    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
