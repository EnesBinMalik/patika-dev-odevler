import alasql from 'alasql';
import { ECOMMERCE_DATA } from '../data/ecommerceData';

// Initialize in-memory database
let isInitialized = false;

export function initializeDatabase() {
  if (isInitialized) return;

  try {
    // Register custom DATEDIFF helper in AlaSQL for MySQL/PostgreSQL compatibility
    (alasql as any).fn.DATEDIFF = function (unit: string, date1: string, date2: string) {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    // Create tables
    alasql('CREATE TABLE IF NOT EXISTS customers');
    alasql('CREATE TABLE IF NOT EXISTS orders');
    alasql('CREATE TABLE IF NOT EXISTS order_items');
    alasql('CREATE TABLE IF NOT EXISTS products');

    // Populate tables
    alasql.tables.customers.data = [...ECOMMERCE_DATA.customers];
    alasql.tables.orders.data = [...ECOMMERCE_DATA.orders];
    alasql.tables.order_items.data = [...ECOMMERCE_DATA.order_items];
    alasql.tables.products.data = [...ECOMMERCE_DATA.products];

    isInitialized = true;
  } catch (err) {
    console.error('Error initializing AlaSQL database:', err);
  }
}

export interface SQLQueryResult {
  columns: string[];
  rows: Record<string, any>[];
  rowCount: number;
  executionTimeMs: number;
  error?: string;
}

export function executeSQL(query: string): SQLQueryResult {
  initializeDatabase();
  const startTime = performance.now();

  try {
    // AlaSQL supports standard ANSI SQL
    const sanitizedQuery = query.trim().replace(/;+$/, '');
    const result = alasql(sanitizedQuery);
    const endTime = performance.now();

    if (!Array.isArray(result)) {
      return {
        columns: ['Sonuç'],
        rows: [{ 'Sonuç': typeof result === 'object' ? JSON.stringify(result) : String(result) }],
        rowCount: 1,
        executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
      };
    }

    if (result.length === 0) {
      return {
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
      };
    }

    const columns = Object.keys(result[0]);

    return {
      columns,
      rows: result,
      rowCount: result.length,
      executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
    };
  } catch (err: any) {
    const endTime = performance.now();
    return {
      columns: [],
      rows: [],
      rowCount: 0,
      executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
      error: err?.message || 'Bilinmeyen SQL sözdizimi hatası oluştu.',
    };
  }
}
