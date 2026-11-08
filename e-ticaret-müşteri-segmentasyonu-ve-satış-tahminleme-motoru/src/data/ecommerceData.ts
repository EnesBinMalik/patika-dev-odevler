import { Customer, Product, Order, OrderItem } from '../types';

export const RAW_PRODUCTS: Product[] = [
  { product_id: 101, product_name: 'Kablosuz ANC Kulaklık Pro', category: 'Elektronik', base_price: 3499, cost: 1800, stock_quantity: 140 },
  { product_id: 102, product_name: 'Akıllı Saat V5 Ultra', category: 'Elektronik', base_price: 5299, cost: 2900, stock_quantity: 85 },
  { product_id: 103, product_name: 'Mekanik RGB Klavye', category: 'Elektronik', base_price: 1899, cost: 950, stock_quantity: 210 },
  { product_id: 104, product_name: 'Ultra HD 4K Monitör 27"', category: 'Elektronik', base_price: 9499, cost: 5800, stock_quantity: 45 },
  { product_id: 105, product_name: 'Hızlı Şarj Güç Bankası 20000mAh', category: 'Elektronik', base_price: 899, cost: 420, stock_quantity: 350 },
  { product_id: 201, product_name: 'Saf Yün Oversize Triko Kazak', category: 'Moda & Giyim', base_price: 1299, cost: 480, stock_quantity: 180 },
  { product_id: 202, product_name: 'Slim Fit İtalyan Kumaş Pantolon', category: 'Moda & Giyim', base_price: 1599, cost: 620, stock_quantity: 130 },
  { product_id: 203, product_name: 'Hakiki Deri Unisex Sneaker', category: 'Moda & Giyim', base_price: 2899, cost: 1250, stock_quantity: 90 },
  { product_id: 204, product_name: 'Su Geçirmez Rüzgarlık Mont', category: 'Moda & Giyim', base_price: 2199, cost: 890, stock_quantity: 110 },
  { product_id: 301, product_name: 'Filtre Kahve Makinesi & Termos', category: 'Ev & Yaşam', base_price: 2499, cost: 1150, stock_quantity: 75 },
  { product_id: 302, product_name: 'Robot Süpürge ve Paspas Pro', category: 'Ev & Yaşam', base_price: 11999, cost: 7200, stock_quantity: 35 },
  { product_id: 303, product_name: 'Ortopedik Visco Yastık İkili Set', category: 'Ev & Yaşam', base_price: 1199, cost: 410, stock_quantity: 240 },
  { product_id: 304, product_name: 'Döküm Demir Tencere 28cm', category: 'Ev & Yaşam', base_price: 2799, cost: 1300, stock_quantity: 60 },
  { product_id: 401, product_name: 'Hyaluronik Asit Canlandırıcı Serum', category: 'Kozmetik & Bakım', base_price: 649, cost: 180, stock_quantity: 420 },
  { product_id: 402, product_name: 'Güneş Koruyucu Krem SPF 50+', category: 'Kozmetik & Bakım', base_price: 489, cost: 130, stock_quantity: 580 },
  { product_id: 403, product_name: 'Keratin Onarıcı Saç Bakım Maskesi', category: 'Kozmetik & Bakım', base_price: 549, cost: 160, stock_quantity: 310 },
  { product_id: 501, product_name: 'Kaymaz Yoga Matı & Taşıma İpi', category: 'Spor & Outdoor', base_price: 799, cost: 260, stock_quantity: 260 },
  { product_id: 502, product_name: 'Ayarlanabilir Dambıl Çifti 20kg', category: 'Spor & Outdoor', base_price: 3899, cost: 1950, stock_quantity: 65 },
  { product_id: 503, product_name: 'Vakumlu Çelik Termos 1 Litre', category: 'Spor & Outdoor', base_price: 949, cost: 360, stock_quantity: 290 },
];

const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Eskişehir', 'Kocaeli', 'Adana', 'Gaziantep', 'Trabzon', 'Konya', 'Samsun'];
const CHANNELS: Customer['acquisition_channel'][] = ['Organik Arama', 'Sosyal Medya', 'Google Ads', 'E-Posta', 'Doğrudan'];
const DEVICES: Customer['device_type'][] = ['Mobil', 'Masaüstü', 'Tablet'];

const FIRST_NAMES = [
  'Ahmet', 'Mehmet', 'Can', 'Burak', 'Emre', 'Murat', 'Ali', 'Mustafa', 'Onur', 'Deniz',
  'Kerem', 'Oğuz', 'Serkan', 'Tolga', 'Barış', 'Eren', 'Kaan', 'Volkan', 'Cem', 'Berk',
  'Zeynep', 'Elif', 'Ayşe', 'Fatma', 'Merve', 'Büşra', 'Selin', 'Ece', 'Gamze', 'İrem',
  'Gizem', 'Derya', 'Seda', 'Melis', 'Pelin', 'Yağmur', 'Aslı', 'Tuğba', 'Cansu', 'Ezgi'
];

const LAST_NAMES = [
  'Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Yıldırım', 'Öztürk', 'Aydın', 'Özdemir',
  'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Kara', 'Koç', 'Kurt', 'Özkan', 'Şimşek'
];

// Seed Customers (220 customers)
export const RAW_CUSTOMERS: Customer[] = Array.from({ length: 220 }, (_, i) => {
  const id = 1001 + i;
  const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
  const lastName = LAST_NAMES[(i * 3 + 7) % LAST_NAMES.length];
  const isMissingCity = i === 12 || i === 47 || i === 89 || i === 134; // Artificial missing values for data cleaning module
  const city = isMissingCity ? ('' as any) : CITIES[(i * 5 + 2) % CITIES.length];
  const channel = CHANNELS[(i * 7 + 1) % CHANNELS.length];
  const device = DEVICES[(i * 11 + 3) % DEVICES.length];

  // Registration dates spread across 2024 to mid-2026
  const regMonth = (i % 24) + 1;
  const year = regMonth <= 12 ? 2025 : 2026;
  const month = (regMonth % 12) + 1;
  const day = (i % 27) + 1;
  const regDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return {
    customer_id: id,
    full_name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${id}@ornekmail.com`,
    city,
    registration_date: regDate,
    acquisition_channel: channel,
    device_type: device,
    is_active: i % 18 !== 0,
  };
});

// Seed Orders & Items (1,150 realistic orders with known seasonal trends and RFM clusters)
export interface GeneratedData {
  customers: Customer[];
  orders: Order[];
  order_items: OrderItem[];
  products: Product[];
}

export function generateECommerceDataset(): GeneratedData {
  const orders: Order[] = [];
  const orderItems: OrderItem[] = [];
  let currentItemId = 1;

  // Analysis reference snapshot date: 2026-11-01
  const baseYear = 2026;
  const daysInYear = 300;

  // Assign distinct behavioral archetypes to customers to create organic, realistic RFM clusters
  RAW_CUSTOMERS.forEach((customer, custIdx) => {
    let orderCount = 1;
    let recencyBias = 30; // days ago
    let spendingTier = 1; // 1: low, 2: mid, 3: high, 4: VIP

    // Archetype distribution
    if (custIdx < 35) {
      // Archetype: Champions (high frequency, high monetary, very recent)
      orderCount = 6 + (custIdx % 6);
      recencyBias = 2 + (custIdx % 14); // 2-15 days ago
      spendingTier = 4;
    } else if (custIdx < 75) {
      // Archetype: Loyal Customers (moderate-high frequency, good monetary, recent)
      orderCount = 4 + (custIdx % 4);
      recencyBias = 10 + (custIdx % 28); // 10-37 days ago
      spendingTier = 3;
    } else if (custIdx < 115) {
      // Archetype: Potential Loyalists / New Promising (1-2 recent orders with high value)
      orderCount = 2 + (custIdx % 2);
      recencyBias = 5 + (custIdx % 22);
      spendingTier = 3;
    } else if (custIdx < 155) {
      // Archetype: At Risk / Can't Lose Them (high past frequency/monetary, but high recency: inactive for 90-220 days)
      orderCount = 5 + (custIdx % 4);
      recencyBias = 90 + (custIdx % 120);
      spendingTier = 3;
    } else if (custIdx < 190) {
      // Archetype: About to Sleep / Need Attention
      orderCount = 2 + (custIdx % 2);
      recencyBias = 60 + (custIdx % 60);
      spendingTier = 2;
    } else {
      // Archetype: Lost / Hibernating (1-2 orders, 180-290 days ago)
      orderCount = 1 + (custIdx % 2);
      recencyBias = 180 + (custIdx % 110);
      spendingTier = 1;
    }

    // Generate orders for this customer
    for (let o = 0; o < orderCount; o++) {
      const orderId = 20000 + orders.length + 1;
      // Stagger order dates backward from snapshot date
      const daysAgo = recencyBias + o * Math.floor(18 + (custIdx % 15));
      const orderDateObj = new Date(baseYear, 10, 1); // 2026-11-01
      orderDateObj.setDate(orderDateObj.getDate() - daysAgo);

      const yyyy = orderDateObj.getFullYear();
      const mm = String(orderDateObj.getMonth() + 1).padStart(2, '0');
      const dd = String(orderDateObj.getDate()).padStart(2, '0');
      const orderDate = `${yyyy}-${mm}-${dd}`;

      // Order status
      const isCancelled = o === 0 && custIdx % 31 === 0;
      const isRefunded = o === 0 && custIdx % 43 === 0;
      const orderStatus: Order['order_status'] = isCancelled ? 'CANCELLED' : isRefunded ? 'REFUNDED' : 'COMPLETED';

      // Pick items based on spending tier
      const itemCount = spendingTier === 4 ? 2 + (o % 3) : spendingTier === 3 ? 1 + (o % 2) : 1;
      let orderTotal = 0;

      for (let it = 0; it < itemCount; it++) {
        // Product selection
        const prodIndex = (custIdx * 2 + o + it * 3) % RAW_PRODUCTS.length;
        const prod = RAW_PRODUCTS[prodIndex];
        const qty = spendingTier === 4 && it === 0 ? 2 : 1;
        const discount = spendingTier >= 3 && it === 1 ? 0.1 : 0.0;
        const lineTotal = prod.base_price * qty * (1 - discount);
        orderTotal += lineTotal;

        orderItems.push({
          item_id: currentItemId++,
          order_id: orderId,
          product_id: prod.product_id,
          quantity: qty,
          unit_price: prod.base_price,
          discount,
        });
      }

      // Add a couple of synthetic outlier anomalies to demonstrate Module 1 cleaning!
      if (orders.length === 24) {
        // Extreme high outlier: bulk B2B order
        orderTotal = 185000;
      }
      if (orders.length === 88) {
        // High outlier
        orderTotal = 142000;
      }

      const paymentMethods: Order['payment_method'][] = ['Kredi Kartı', 'Havale/EFT', 'Dijital Cüzdan'];
      orders.push({
        order_id: orderId,
        customer_id: customer.customer_id,
        order_date: orderDate,
        order_status: orderStatus,
        payment_method: paymentMethods[(custIdx + o) % paymentMethods.length],
        total_amount: Math.round(orderTotal * 100) / 100,
        shipping_city: customer.city || 'İstanbul',
      });
    }
  });

  return {
    customers: RAW_CUSTOMERS,
    orders,
    order_items: orderItems,
    products: RAW_PRODUCTS,
  };
}

// Pre-seeded instance
export const ECOMMERCE_DATA = generateECommerceDataset();

// Curated SQL Queries for Module 1
export const SQL_QUERY_TEMPLATES = [
  {
    id: 'rfm_extraction',
    title: '01. RFM Ana Veri Seti Çekimi (JOIN + GROUP BY + HAVING)',
    description: 'İlişkisel veritabanından tamamlanan siparişleri müşteri bazında gruplayarak Recency, Frequency ve Monetary metriklerini hesaplar.',
    sql: `SELECT 
  c.customer_id,
  c.full_name,
  c.city,
  c.acquisition_channel,
  COUNT(DISTINCT o.order_id) AS total_orders,
  ROUND(SUM(o.total_amount), 2) AS total_monetary,
  MAX(o.order_date) AS last_order_date,
  DATEDIFF('day', MAX(o.order_date), '2026-11-01') AS recency_days
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_status = 'COMPLETED'
GROUP BY c.customer_id, c.full_name, c.city, c.acquisition_channel
HAVING COUNT(DISTINCT o.order_id) >= 1 AND SUM(o.total_amount) > 100
ORDER BY total_monetary DESC`,
  },
  {
    id: 'category_revenue',
    title: '02. Kategori Bazlı Satış & Kar Marjı (Multi-Table JOIN)',
    description: 'Ürün kategorilerinin brüt ciro, satılan adet ve maliyet üzerinden kar marjını analiz eder.',
    sql: `SELECT 
  p.category,
  COUNT(DISTINCT o.order_id) AS order_count,
  SUM(oi.quantity) AS total_items_sold,
  ROUND(SUM(oi.quantity * oi.unit_price * (1 - oi.discount)), 2) AS gross_revenue,
  ROUND(SUM(oi.quantity * (oi.unit_price * (1 - oi.discount) - p.cost)), 2) AS net_profit,
  ROUND((SUM(oi.quantity * (oi.unit_price * (1 - oi.discount) - p.cost)) / SUM(oi.quantity * oi.unit_price * (1 - oi.discount))) * 100, 1) AS margin_percentage
FROM order_items oi
INNER JOIN products p ON oi.product_id = p.product_id
INNER JOIN orders o ON oi.order_id = o.order_id
WHERE o.order_status = 'COMPLETED'
GROUP BY p.category
ORDER BY gross_revenue DESC`,
  },
  {
    id: 'daily_sales_series',
    title: '03. Günlük Satış Zaman Serisi (Zaman Tahminleme Hazırlığı)',
    description: 'Satış tahminleme (forecasting) modelleri için günlük bazda sipariş adedi ve ciro toplamını çıkarır.',
    sql: `SELECT 
  o.order_date,
  COUNT(o.order_id) AS daily_order_count,
  ROUND(SUM(o.total_amount), 2) AS daily_revenue,
  ROUND(AVG(o.total_amount), 2) AS avg_basket_value
FROM orders o
WHERE o.order_status = 'COMPLETED'
GROUP BY o.order_date
HAVING SUM(o.total_amount) > 0
ORDER BY o.order_date ASC`,
  },
  {
    id: 'anomalies_check',
    title: '04. Veri Kalitesi & Aykırı Değer Teşhisi (Diagnostic Query)',
    description: 'Eksik şehir bilgileri, olağandışı sepet büyüklükleri ve iptal/iade durumlarını listeler.',
    sql: `SELECT 
  o.order_id,
  c.full_name,
  c.city,
  o.order_date,
  o.total_amount,
  o.order_status
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id
WHERE (c.city IS NULL OR c.city = '')
   OR o.total_amount > 50000
   OR o.order_status IN ('CANCELLED', 'REFUNDED')
ORDER BY o.total_amount DESC`,
  },
];
