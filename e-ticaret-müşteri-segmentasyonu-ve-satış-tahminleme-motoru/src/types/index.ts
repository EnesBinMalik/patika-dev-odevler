export interface Customer {
  customer_id: number;
  full_name: string;
  email: string;
  city: string;
  registration_date: string;
  acquisition_channel: 'Organik Arama' | 'Sosyal Medya' | 'Google Ads' | 'E-Posta' | 'Doğrudan';
  device_type: 'Mobil' | 'Masaüstü' | 'Tablet';
  is_active: boolean;
}

export interface Product {
  product_id: number;
  product_name: string;
  category: 'Elektronik' | 'Moda & Giyim' | 'Ev & Yaşam' | 'Kozmetik & Bakım' | 'Spor & Outdoor';
  base_price: number;
  cost: number;
  stock_quantity: number;
}

export interface OrderItem {
  item_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  discount: number; // e.g. 0.0 to 0.3
}

export interface Order {
  order_id: number;
  customer_id: number;
  order_date: string;
  order_status: 'COMPLETED' | 'SHIPPED' | 'CANCELLED' | 'REFUNDED';
  payment_method: 'Kredi Kartı' | 'Havale/EFT' | 'Dijital Cüzdan' | 'Kapıda Ödeme';
  total_amount: number;
  shipping_city: string;
}

export interface RFMCustomer {
  customer_id: number;
  full_name: string;
  city: string;
  recency_days: number;
  frequency: number;
  monetary: number;
  aov: number; // Average Order Value
  r_score: number;
  f_score: number;
  m_score: number;
  rfm_score: string; // e.g. "555"
  segment: RFMSegmentType;
  cluster: number; // K-means cluster
  last_order_date: string;
}

export type RFMSegmentType =
  | 'Şampiyonlar'
  | 'Sadık Müşteriler'
  | 'Potansiyel Sadıklar'
  | 'Yeni Müşteriler'
  | 'Dikkat Gerektirenler'
  | 'Risk Altındakiler'
  | 'Uykuda Olanlar'
  | 'Kayıp Müşteriler';

export interface SegmentSummary {
  name: RFMSegmentType;
  count: number;
  percentage: number;
  total_revenue: number;
  revenue_percentage: number;
  avg_recency: number;
  avg_frequency: number;
  avg_monetary: number;
  color: string;
  badge_color: string;
  description: string;
  action_strategy: string;
}

export interface DescriptiveStats {
  count: number;
  mean: number;
  median: number;
  mode: number;
  variance: number;
  stdDev: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
  iqr: number;
  skewness: number;
  kurtosis: number;
}

export interface ForecastPoint {
  date: string;
  actual?: number;
  forecast?: number;
  lower_bound?: number;
  upper_bound?: number;
  trend?: number;
}

export interface GitCommit {
  hash: string;
  shortHash: string;
  author: string;
  date: string;
  message: string;
  branch: string;
  filesChanged: number;
  insertions: number;
  deletions: number;
  diffSummary: { file: string; additions: number; deletions: number; status: 'modified' | 'added' }[];
}

export interface NotebookCell {
  id: string;
  type: 'code' | 'markdown';
  content: string;
  output?: string;
  outputType?: 'table' | 'chart' | 'text' | 'success';
  outputData?: any;
  executionCount?: number;
}
