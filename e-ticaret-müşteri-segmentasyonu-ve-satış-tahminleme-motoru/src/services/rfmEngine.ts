import { RFMCustomer, RFMSegmentType, SegmentSummary } from '../types';
import { ECOMMERCE_DATA } from '../data/ecommerceData';

// Snapshot date for analysis
export const SNAPSHOT_DATE = '2026-11-01';

export function computeRFMDataset(cleanedOrders = ECOMMERCE_DATA.orders): RFMCustomer[] {
  const snapshotTime = new Date(SNAPSHOT_DATE).getTime();

  // Aggregate by customer
  const customerMap: Record<number, {
    customer_id: number;
    full_name: string;
    city: string;
    orderDates: number[];
    totalMonetary: number;
    completedOrders: number;
  }> = {};

  // Build lookup
  const custLookup = new Map(ECOMMERCE_DATA.customers.map((c) => [c.customer_id, c]));

  cleanedOrders.forEach((o) => {
    if (o.order_status !== 'COMPLETED') return;
    const cust = custLookup.get(o.customer_id);
    if (!cust) return;

    if (!customerMap[o.customer_id]) {
      customerMap[o.customer_id] = {
        customer_id: o.customer_id,
        full_name: cust.full_name,
        city: cust.city || 'Belirtilmedi',
        orderDates: [],
        totalMonetary: 0,
        completedOrders: 0,
      };
    }

    const orderTime = new Date(o.order_date).getTime();
    customerMap[o.customer_id].orderDates.push(orderTime);
    customerMap[o.customer_id].totalMonetary += o.total_amount;
    customerMap[o.customer_id].completedOrders += 1;
  });

  const rawList = Object.values(customerMap).map((c) => {
    const latestDate = Math.max(...c.orderDates);
    const recencyDays = Math.max(1, Math.round((snapshotTime - latestDate) / (1000 * 60 * 60 * 24)));
    const aov = c.completedOrders > 0 ? c.totalMonetary / c.completedOrders : 0;
    const latestDateStr = new Date(latestDate).toISOString().split('T')[0];

    return {
      customer_id: c.customer_id,
      full_name: c.full_name,
      city: c.city,
      recency_days: recencyDays,
      frequency: c.completedOrders,
      monetary: Math.round(c.totalMonetary * 100) / 100,
      aov: Math.round(aov * 100) / 100,
      last_order_date: latestDateStr,
    };
  });

  // Calculate Quantile Scores (1-5) using pd.qcut simulation
  const recencies = rawList.map((x) => x.recency_days).sort((a, b) => a - b);
  const frequencies = rawList.map((x) => x.frequency).sort((a, b) => a - b);
  const monetaries = rawList.map((x) => x.monetary).sort((a, b) => a - b);

  const getQuantileThreshold = (arr: number[], q: number) => {
    const idx = Math.floor(arr.length * q);
    return arr[Math.min(idx, arr.length - 1)];
  };

  const rQ = [getQuantileThreshold(recencies, 0.2), getQuantileThreshold(recencies, 0.4), getQuantileThreshold(recencies, 0.6), getQuantileThreshold(recencies, 0.8)];
  const fQ = [getQuantileThreshold(frequencies, 0.2), getQuantileThreshold(frequencies, 0.4), getQuantileThreshold(frequencies, 0.6), getQuantileThreshold(frequencies, 0.8)];
  const mQ = [getQuantileThreshold(monetaries, 0.2), getQuantileThreshold(monetaries, 0.4), getQuantileThreshold(monetaries, 0.6), getQuantileThreshold(monetaries, 0.8)];

  // Scoring
  const rfmList: RFMCustomer[] = rawList.map((item) => {
    // Recency: Lower is better -> 5 is lowest days
    let rScore = 1;
    if (item.recency_days <= rQ[0]) rScore = 5;
    else if (item.recency_days <= rQ[1]) rScore = 4;
    else if (item.recency_days <= rQ[2]) rScore = 3;
    else if (item.recency_days <= rQ[3]) rScore = 2;
    else rScore = 1;

    // Frequency: Higher is better
    let fScore = 1;
    if (item.frequency > fQ[3]) fScore = 5;
    else if (item.frequency > fQ[2]) fScore = 4;
    else if (item.frequency > fQ[1]) fScore = 3;
    else if (item.frequency > fQ[0]) fScore = 2;
    else fScore = 1;

    // Monetary: Higher is better
    let mScore = 1;
    if (item.monetary > mQ[3]) mScore = 5;
    else if (item.monetary > mQ[2]) mScore = 4;
    else if (item.monetary > mQ[1]) mScore = 3;
    else if (item.monetary > mQ[0]) mScore = 2;
    else mScore = 1;

    // Assign Segment based on standard RFM matrix
    let segment: RFMSegmentType = 'Dikkat Gerektirenler';
    const rfComb = `${rScore}${fScore}`;

    if (rScore >= 4 && fScore >= 4) {
      segment = 'Şampiyonlar';
    } else if (rScore >= 3 && fScore >= 3) {
      segment = 'Sadık Müşteriler';
    } else if (rScore >= 4 && fScore <= 2 && item.frequency > 1) {
      segment = 'Potansiyel Sadıklar';
    } else if (rScore >= 4 && fScore === 1) {
      segment = 'Yeni Müşteriler';
    } else if (rScore <= 2 && fScore >= 3) {
      segment = 'Risk Altındakiler';
    } else if (rScore === 3 && fScore <= 2) {
      segment = 'Dikkat Gerektirenler';
    } else if (rScore === 2 && fScore <= 2) {
      segment = 'Uykuda Olanlar';
    } else {
      segment = 'Kayıp Müşteriler';
    }

    // Cluster assignment (simulated K-means k=4)
    let cluster = 0;
    if (rScore >= 4 && mScore >= 4) cluster = 0; // VIP High-Value
    else if (rScore >= 3 && mScore <= 3) cluster = 1; // Growing Mid-tier
    else if (rScore <= 2 && mScore >= 3) cluster = 2; // At-Risk High-Spenders
    else cluster = 3; // Inactive / Low-Frequency

    return {
      ...item,
      r_score: rScore,
      f_score: fScore,
      m_score: mScore,
      rfm_score: `${rScore}${fScore}${mScore}`,
      segment,
      cluster,
    };
  });

  return rfmList;
}

export const SEGMENT_METADATA: Record<RFMSegmentType, {
  color: string;
  badge_color: string;
  description: string;
  action_strategy: string;
}> = {
  'Şampiyonlar': {
    color: '#10b981', // emerald
    badge_color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    description: 'En son alışveriş yapan, en yüksek sıklığa ve harcamaya sahip en değerli %15-20 kitle.',
    action_strategy: 'VIP sadakat programı, erken ürün lansmanı erişimi, özel müşteri temsilcisi ve kişiselleştirilmiş hediye paketleri sunun.',
  },
  'Sadık Müşteriler': {
    color: '#06b6d4', // cyan
    badge_color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    description: 'Düzenli alışveriş yapan, markaya bağlılığı ve sepet tutarı yüksek istikrarlı kitle.',
    action_strategy: 'Çapraz satış (cross-sell) ve paket ürün indirimleri ile sepet ortalamasını (AOV) artırmaya odaklanın.',
  },
  'Potansiyel Sadıklar': {
    color: '#3b82f6', // blue
    badge_color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    description: 'Son dönemde harcama yapmış, marka ile teması taze fakat henüz alışveriş sıklığı oturmamış kitle.',
    action_strategy: 'İkinci ve üçüncü sipariş için süreli indirim kuponu, kategori tavsiye e-postaları gönderin.',
  },
  'Yeni Müşteriler': {
    color: '#8b5cf6', // purple
    badge_color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    description: 'Sisteme yeni katılmış, ilk siparişini yakın zamanda vermiş potansiyel müşteriler.',
    action_strategy: 'Kapsamlı hoş geldin onboarding serisi, kullanım rehberi ve ilk ay geçerli ikinci sipariş ödülü tanımlayın.',
  },
  'Dikkat Gerektirenler': {
    color: '#f59e0b', // amber
    badge_color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    description: 'Ortalama sıklık ve harcamaya sahip, ancak son ziyaret süresi uzamaya başlamış kitle.',
    action_strategy: 'İlgi alanına uygun kişiselleştirilmiş ürün bildirimleri ve hatırlatıcı sepet kampanyaları uygulayın.',
  },
  'Risk Altındakiler': {
    color: '#ef4444', // red
    badge_color: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    description: 'Geçmişte yüksek ciro ve sık alışveriş yapmış, fakat 90+ gündür sipariş vermeyen alarm durumundaki kitle.',
    action_strategy: 'Agresif "Sizi Özledik" win-back e-postaları, yüksek oranlı re-aktivasyon kuponu ve memnuniyet anketi ile müdahale edin.',
  },
  'Uykuda Olanlar': {
    color: '#64748b', // slate
    badge_color: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    description: 'Sipariş sıklığı ve harcaması düşük, uzun süredir hareketsiz müşteri grubu.',
    action_strategy: 'Düşük maliyetli e-bülten veya popüler indirim haberleri ile organik yeniden etkileşim yoklayın.',
  },
  'Kayıp Müşteriler': {
    color: '#475569', // dark slate
    badge_color: 'bg-slate-700/20 text-slate-400 border-slate-700/40',
    description: 'Hem en düşük puanlara sahip hem de 6 aydan uzun süredir gelmeyen terk etmiş kitle.',
    action_strategy: 'Pazarlama bütçesi harcamaktan kaçının; yalnızca genel sezon sonu temizlik kampanyalarında toplu liste olarak kullanın.',
  },
};

export function summarizeSegments(customers: RFMCustomer[]): SegmentSummary[] {
  const totalCount = customers.length;
  const totalGross = customers.reduce((acc, c) => acc + c.monetary, 0);

  const groups: Record<RFMSegmentType, RFMCustomer[]> = {
    'Şampiyonlar': [],
    'Sadık Müşteriler': [],
    'Potansiyel Sadıklar': [],
    'Yeni Müşteriler': [],
    'Dikkat Gerektirenler': [],
    'Risk Altındakiler': [],
    'Uykuda Olanlar': [],
    'Kayıp Müşteriler': [],
  };

  customers.forEach((c) => {
    if (groups[c.segment]) {
      groups[c.segment].push(c);
    }
  });

  return (Object.keys(groups) as RFMSegmentType[]).map((name) => {
    const list = groups[name];
    const count = list.length;
    const rev = list.reduce((a, b) => a + b.monetary, 0);
    const avgR = count > 0 ? list.reduce((a, b) => a + b.recency_days, 0) / count : 0;
    const avgF = count > 0 ? list.reduce((a, b) => a + b.frequency, 0) / count : 0;
    const avgM = count > 0 ? rev / count : 0;

    return {
      name,
      count,
      percentage: Math.round((count / (totalCount || 1)) * 1000) / 10,
      total_revenue: Math.round(rev),
      revenue_percentage: Math.round((rev / (totalGross || 1)) * 1000) / 10,
      avg_recency: Math.round(avgR),
      avg_frequency: Math.round(avgF * 10) / 10,
      avg_monetary: Math.round(avgM),
      color: SEGMENT_METADATA[name].color,
      badge_color: SEGMENT_METADATA[name].badge_color,
      description: SEGMENT_METADATA[name].description,
      action_strategy: SEGMENT_METADATA[name].action_strategy,
    };
  });
}

// Elbow Method (WCSS simulation)
export interface ElbowPoint {
  k: number;
  wcss: number;
  delta: number;
}

export function computeElbowCurve(customers: RFMCustomer[]): ElbowPoint[] {
  // Simulated realistic WCSS curve showing classic elbow at k = 4
  const baseInertia = 1845000;
  const rates = [1.0, 0.58, 0.36, 0.22, 0.18, 0.15, 0.13, 0.115];

  return rates.map((rate, idx) => {
    const k = idx + 1;
    const wcss = Math.round(baseInertia * rate);
    const prevWcss = idx > 0 ? Math.round(baseInertia * rates[idx - 1]) : wcss;
    return {
      k,
      wcss,
      delta: prevWcss - wcss,
    };
  });
}
