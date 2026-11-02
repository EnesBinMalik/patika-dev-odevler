export type UserRole = 'Admin' | 'Manager' | 'Cashier';

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: UserRole;
  email: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  category: string;
  costPrice: number;    // Alış Fiyatı (Birim Maliyet)
  sellingPrice: number; // Satış Fiyatı
  quantity: number;     // Mevcut Stok Miktarı
  minStock: number;     // Kritik Stok Eşiği
  unit: string;         // 'Adet', 'Kg', 'Metre', 'Paket', 'Set'
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: number;
  receiptNo: string;
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
  unitCostPrice: number;
  unitSellingPrice: number;
  totalAmount: number; // quantity * unitSellingPrice
  profit: number;      // totalAmount - (quantity * unitCostPrice)
  cashierName: string;
  note?: string;
  timestamp: string;
}

export interface Purchase {
  id: number;
  invoiceNo: string;
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
  unitPurchasePrice: number;
  totalCost: number;   // quantity * unitPurchasePrice
  supplier: string;
  managerName: string;
  note?: string;
  timestamp: string;
}

export type StoreErrorCode = 
  | 'ProductNotFound'
  | 'InsufficientStock'
  | 'InvalidPrice'
  | 'InvalidQuantity'
  | 'UnauthorizedAccess'
  | 'DuplicateSku'
  | 'EmptyField';

export interface StoreError {
  code: StoreErrorCode;
  message: string;
  details?: Record<string, any>;
}

export interface FinancialSummary {
  totalInventoryCost: number;
  totalRetailPotential: number;
  totalProductsCount: number;
  totalStockQuantity: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalRevenue: number;
  totalCostOfGoodsSold: number;
  grossProfit: number;
  profitMarginPercent: number;
  totalPurchasesCost: number;
}
