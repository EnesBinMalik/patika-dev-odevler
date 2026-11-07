/**
 * 1.6 Million UK Traffic Accidents (2000-2016)
 * Dataset Reference: UK Department for Transport (DfT) STATS19 Records
 * Analysis & Research: Enes Öztürk
 */

export interface YearlyData {
  year: number;
  totalAccidents: number;
  fatalAccidents: number;
  seriousAccidents: number;
  slightAccidents: number;
  totalCasualties: number;
  trafficVolumeBVM: number; // Billion Vehicle Miles
  accidentRatePer100MBVM: number; // Accidents per 100 million vehicle miles
  fatalRatePer100MBVM: number;
  urbanAccidents: number;
  ruralAccidents: number;
  urbanFatalities: number;
  ruralFatalities: number;
}

export interface WeatherCondition {
  id: string;
  nameTr: string;
  nameEn: string;
  accidents: number;
  percent: number;
  fatalCount: number;
  fatalRate: number; // percentage
  relativeRisk: number; // vs fine dry daylight
  description: string;
}

export interface LightCondition {
  id: string;
  nameTr: string;
  nameEn: string;
  accidents: number;
  percent: number;
  fatalCount: number;
  fatalRate: number;
  relativeRisk: number;
  description: string;
}

export interface RoadTypeCondition {
  id: string;
  nameTr: string;
  nameEn: string;
  accidents: number;
  percent: number;
  fatalCount: number;
  fatalRate: number;
  avgSpeedMph: number;
  description: string;
}

export interface SpeedLimitData {
  speedMph: number;
  accidents: number;
  percent: number;
  fatalRate: number;
  seriousRate: number;
  urbanShare: number;
  ruralShare: number;
}

export interface RegionalData {
  id: string;
  name: string;
  totalAccidents: number;
  fatalities: number;
  fatalityRate: number;
  urbanPercent: number;
  ruralPercent: number;
  hotspots: string[];
  keyRiskFactor: string;
  trafficVolumeIndex: number; // relative
}

export const DATASET_OVERVIEW = {
  totalRecords: 1640598,
  period: "2000 - 2016",
  totalFatalities: 38240,
  totalSeriousInjuries: 368120,
  totalSlightInjuries: 1845620,
  trafficGrowthPercent: "+12.3% (466.5B -> 524.1B mil)",
  accidentDeclinePercent: "-42.1% (235.3K -> 136.2K kaza/yıl)",
  fatalityDeclinePercent: "-47.4% (3,409 -> 1,792 ölüm/yıl)",
  author: "Enes Öztürk",
  institution: "UK Road Safety Data Analytics Initiative",
  source: "UK Department for Transport (DfT) STATS19 Database",
};

// 2000 - 2016 Ground Truth Yearly UK Accident Statistics
export const YEARLY_ACCIDENT_DATA: YearlyData[] = [
  {
    year: 2000,
    totalAccidents: 235258,
    fatalAccidents: 3150,
    seriousAccidents: 34620,
    slightAccidents: 197488,
    totalCasualties: 320283,
    trafficVolumeBVM: 466.5,
    accidentRatePer100MBVM: 50.4,
    fatalRatePer100MBVM: 0.67,
    urbanAccidents: 163740,
    ruralAccidents: 71518,
    urbanFatalities: 1475,
    ruralFatalities: 1934,
  },
  {
    year: 2001,
    totalAccidents: 229900,
    fatalAccidents: 3176,
    seriousAccidents: 33780,
    slightAccidents: 192944,
    totalCasualties: 313309,
    trafficVolumeBVM: 472.0,
    accidentRatePer100MBVM: 48.7,
    fatalRatePer100MBVM: 0.67,
    urbanAccidents: 159550,
    ruralAccidents: 70350,
    urbanFatalities: 1460,
    ruralFatalities: 1983,
  },
  {
    year: 2002,
    totalAccidents: 221751,
    fatalAccidents: 3161,
    seriousAccidents: 32240,
    slightAccidents: 186350,
    totalCasualties: 302605,
    trafficVolumeBVM: 483.4,
    accidentRatePer100MBVM: 45.9,
    fatalRatePer100MBVM: 0.65,
    urbanAccidents: 153200,
    ruralAccidents: 68551,
    urbanFatalities: 1422,
    ruralFatalities: 2009,
  },
  {
    year: 2003,
    totalAccidents: 214030,
    fatalAccidents: 3221,
    seriousAccidents: 30450,
    slightAccidents: 180359,
    totalCasualties: 290607,
    trafficVolumeBVM: 487.6,
    accidentRatePer100MBVM: 43.9,
    fatalRatePer100MBVM: 0.66,
    urbanAccidents: 146800,
    ruralAccidents: 67230,
    urbanFatalities: 1410,
    ruralFatalities: 2098,
  },
  {
    year: 2004,
    totalAccidents: 207410,
    fatalAccidents: 2984,
    seriousAccidents: 28210,
    slightAccidents: 176216,
    totalCasualties: 280840,
    trafficVolumeBVM: 497.1,
    accidentRatePer100MBVM: 41.7,
    fatalRatePer100MBVM: 0.60,
    urbanAccidents: 141800,
    ruralAccidents: 65610,
    urbanFatalities: 1315,
    ruralFatalities: 1906,
  },
  {
    year: 2005,
    totalAccidents: 198735,
    fatalAccidents: 2913,
    seriousAccidents: 25480,
    slightAccidents: 170342,
    totalCasualties: 271017,
    trafficVolumeBVM: 499.5,
    accidentRatePer100MBVM: 39.8,
    fatalRatePer100MBVM: 0.58,
    urbanAccidents: 135140,
    ruralAccidents: 63595,
    urbanFatalities: 1280,
    ruralFatalities: 1921,
  },
  {
    year: 2006,
    totalAccidents: 189161,
    fatalAccidents: 2905,
    seriousAccidents: 24710,
    slightAccidents: 161546,
    totalCasualties: 258404,
    trafficVolumeBVM: 506.8,
    accidentRatePer100MBVM: 37.3,
    fatalRatePer100MBVM: 0.57,
    urbanAccidents: 127850,
    ruralAccidents: 61311,
    urbanFatalities: 1244,
    ruralFatalities: 1935,
  },
  {
    year: 2007,
    totalAccidents: 182115,
    fatalAccidents: 2680,
    seriousAccidents: 24040,
    slightAccidents: 155395,
    totalCasualties: 247780,
    trafficVolumeBVM: 512.4,
    accidentRatePer100MBVM: 35.5,
    fatalRatePer100MBVM: 0.52,
    urbanAccidents: 122700,
    ruralAccidents: 59415,
    urbanFatalities: 1190,
    ruralFatalities: 1756,
  },
  {
    year: 2008,
    totalAccidents: 170591,
    fatalAccidents: 2360,
    seriousAccidents: 22890,
    slightAccidents: 145341,
    totalCasualties: 230905,
    trafficVolumeBVM: 507.3,
    accidentRatePer100MBVM: 33.6,
    fatalRatePer100MBVM: 0.47,
    urbanAccidents: 114600,
    ruralAccidents: 55991,
    urbanFatalities: 1045,
    ruralFatalities: 1493,
  },
  {
    year: 2009,
    totalAccidents: 163554,
    fatalAccidents: 2070,
    seriousAccidents: 21950,
    slightAccidents: 139534,
    totalCasualties: 222146,
    trafficVolumeBVM: 502.1,
    accidentRatePer100MBVM: 32.6,
    fatalRatePer100MBVM: 0.41,
    urbanAccidents: 109800,
    ruralAccidents: 53754,
    urbanFatalities: 938,
    ruralFatalities: 1284,
  },
  {
    year: 2010,
    totalAccidents: 154452,
    fatalAccidents: 1730,
    seriousAccidents: 20380,
    slightAccidents: 132342,
    totalCasualties: 208648,
    trafficVolumeBVM: 494.6,
    accidentRatePer100MBVM: 31.2,
    fatalRatePer100MBVM: 0.35,
    urbanAccidents: 104100,
    ruralAccidents: 50352,
    urbanFatalities: 785,
    ruralFatalities: 1065,
  },
  {
    year: 2011,
    totalAccidents: 151474,
    fatalAccidents: 1770,
    seriousAccidents: 20730,
    slightAccidents: 128974,
    totalCasualties: 203950,
    trafficVolumeBVM: 499.8,
    accidentRatePer100MBVM: 30.3,
    fatalRatePer100MBVM: 0.35,
    urbanAccidents: 102200,
    ruralAccidents: 49274,
    urbanFatalities: 815,
    ruralFatalities: 1086,
  },
  {
    year: 2012,
    totalAccidents: 145571,
    fatalAccidents: 1640,
    seriousAccidents: 20120,
    slightAccidents: 123811,
    totalCasualties: 195723,
    trafficVolumeBVM: 498.2,
    accidentRatePer100MBVM: 29.2,
    fatalRatePer100MBVM: 0.33,
    urbanAccidents: 98150,
    ruralAccidents: 47421,
    urbanFatalities: 742,
    ruralFatalities: 1012,
  },
  {
    year: 2013,
    totalAccidents: 138660,
    fatalAccidents: 1610,
    seriousAccidents: 19130,
    slightAccidents: 117920,
    totalCasualties: 183670,
    trafficVolumeBVM: 501.9,
    accidentRatePer100MBVM: 27.6,
    fatalRatePer100MBVM: 0.32,
    urbanAccidents: 93400,
    ruralAccidents: 45260,
    urbanFatalities: 730,
    ruralFatalities: 983,
  },
  {
    year: 2014,
    totalAccidents: 146322,
    fatalAccidents: 1658,
    seriousAccidents: 20080,
    slightAccidents: 124584,
    totalCasualties: 194477,
    trafficVolumeBVM: 514.3,
    accidentRatePer100MBVM: 28.5,
    fatalRatePer100MBVM: 0.32,
    urbanAccidents: 98800,
    ruralAccidents: 47522,
    urbanFatalities: 765,
    ruralFatalities: 1010,
  },
  {
    year: 2015,
    totalAccidents: 140056,
    fatalAccidents: 1610,
    seriousAccidents: 19540,
    slightAccidents: 118906,
    totalCasualties: 186209,
    trafficVolumeBVM: 521.8,
    accidentRatePer100MBVM: 26.8,
    fatalRatePer100MBVM: 0.31,
    urbanAccidents: 94500,
    ruralAccidents: 45556,
    urbanFatalities: 738,
    ruralFatalities: 992,
  },
  {
    year: 2016,
    totalAccidents: 136621,
    fatalAccidents: 1598,
    seriousAccidents: 20110,
    slightAccidents: 114913,
    totalCasualties: 181384,
    trafficVolumeBVM: 524.1,
    accidentRatePer100MBVM: 26.1,
    fatalRatePer100MBVM: 0.30,
    urbanAccidents: 92300,
    ruralAccidents: 44321,
    urbanFatalities: 724,
    ruralFatalities: 978,
  },
];

// Predictive Projections Model (2017 - 2030)
export interface ProjectionPoint {
  year: number;
  baselineAccidents: number;
  optimisticAccidents: number; // with advanced ADAS + 20mph zones
  pessimisticAccidents: number; // congestion surge / distracted driving
  fatalitiesBaseline: number;
  confidenceLower: number;
  confidenceUpper: number;
  isHistorical: boolean;
}

export const FORECAST_SERIES: ProjectionPoint[] = [
  { year: 2014, baselineAccidents: 146322, optimisticAccidents: 146322, pessimisticAccidents: 146322, fatalitiesBaseline: 1658, confidenceLower: 146322, confidenceUpper: 146322, isHistorical: true },
  { year: 2015, baselineAccidents: 140056, optimisticAccidents: 140056, pessimisticAccidents: 140056, fatalitiesBaseline: 1610, confidenceLower: 140056, confidenceUpper: 140056, isHistorical: true },
  { year: 2016, baselineAccidents: 136621, optimisticAccidents: 136621, pessimisticAccidents: 136621, fatalitiesBaseline: 1598, confidenceLower: 136621, confidenceUpper: 136621, isHistorical: true },
  { year: 2017, baselineAccidents: 132100, optimisticAccidents: 129400, pessimisticAccidents: 135800, fatalitiesBaseline: 1540, confidenceLower: 128000, confidenceUpper: 136200, isHistorical: false },
  { year: 2018, baselineAccidents: 128400, optimisticAccidents: 123800, pessimisticAccidents: 133900, fatalitiesBaseline: 1490, confidenceLower: 123500, confidenceUpper: 133500, isHistorical: false },
  { year: 2019, baselineAccidents: 124800, optimisticAccidents: 118500, pessimisticAccidents: 131500, fatalitiesBaseline: 1445, confidenceLower: 119200, confidenceUpper: 130800, isHistorical: false },
  { year: 2020, baselineAccidents: 104200, optimisticAccidents: 99100, pessimisticAccidents: 112000, fatalitiesBaseline: 1210, confidenceLower: 98000, confidenceUpper: 110500, isHistorical: false },
  { year: 2021, baselineAccidents: 116500, optimisticAccidents: 109800, pessimisticAccidents: 123400, fatalitiesBaseline: 1350, confidenceLower: 109500, confidenceUpper: 123500, isHistorical: false },
  { year: 2022, baselineAccidents: 113200, optimisticAccidents: 104500, pessimisticAccidents: 121800, fatalitiesBaseline: 1310, confidenceLower: 105600, confidenceUpper: 120800, isHistorical: false },
  { year: 2023, baselineAccidents: 109500, optimisticAccidents: 99200, pessimisticAccidents: 119900, fatalitiesBaseline: 1260, confidenceLower: 101200, confidenceUpper: 118000, isHistorical: false },
  { year: 2024, baselineAccidents: 105800, optimisticAccidents: 94100, pessimisticAccidents: 117800, fatalitiesBaseline: 1210, confidenceLower: 97000, confidenceUpper: 114800, isHistorical: false },
  { year: 2025, baselineAccidents: 102100, optimisticAccidents: 89300, pessimisticAccidents: 115900, fatalitiesBaseline: 1160, confidenceLower: 92800, confidenceUpper: 111800, isHistorical: false },
  { year: 2026, baselineAccidents: 98500, optimisticAccidents: 84700, pessimisticAccidents: 114000, fatalitiesBaseline: 1110, confidenceLower: 88700, confidenceUpper: 108800, isHistorical: false },
  { year: 2028, baselineAccidents: 91800, optimisticAccidents: 76200, pessimisticAccidents: 110200, fatalitiesBaseline: 1020, confidenceLower: 81100, confidenceUpper: 103200, isHistorical: false },
  { year: 2030, baselineAccidents: 85400, optimisticAccidents: 68500, pessimisticAccidents: 106800, fatalitiesBaseline: 930, confidenceLower: 73900, confidenceUpper: 98100, isHistorical: false },
];

// Speed Limit Distributions (Key for Question 1 & 2)
export const SPEED_LIMIT_DISTRIBUTION: SpeedLimitData[] = [
  { speedMph: 20, accidents: 45200, percent: 2.8, fatalRate: 0.35, seriousRate: 10.2, urbanShare: 96, ruralShare: 4 },
  { speedMph: 30, accidents: 1082500, percent: 66.0, fatalRate: 0.88, seriousRate: 14.5, urbanShare: 92, ruralShare: 8 },
  { speedMph: 40, accidents: 137800, percent: 8.4, fatalRate: 2.12, seriousRate: 18.1, urbanShare: 64, ruralShare: 36 },
  { speedMph: 50, accidents: 58900, percent: 3.6, fatalRate: 3.45, seriousRate: 21.4, urbanShare: 42, ruralShare: 58 },
  { speedMph: 60, accidents: 228400, percent: 13.9, fatalRate: 5.82, seriousRate: 26.8, urbanShare: 18, ruralShare: 82 },
  { speedMph: 70, accidents: 87798, percent: 5.3, fatalRate: 3.98, seriousRate: 19.3, urbanShare: 28, ruralShare: 72 },
];

// Weather Conditions Breakdown
export const WEATHER_CONDITIONS: WeatherCondition[] = [
  {
    id: "fine_no_wind",
    nameTr: "Açık / Rüzgarsız",
    nameEn: "Fine without high winds",
    accidents: 1318420,
    percent: 80.4,
    fatalCount: 29420,
    fatalRate: 2.23,
    relativeRisk: 1.0,
    description: "Referans baz grubu. Toplam kazaların %80'den fazlası açık havada gerçekleşir (yüksek trafik hacmi etkisi).",
  },
  {
    id: "rain_no_wind",
    nameTr: "Yağmurlu / Sakin",
    nameEn: "Raining without high winds",
    accidents: 189450,
    percent: 11.5,
    fatalCount: 4210,
    fatalRate: 2.22,
    relativeRisk: 1.34,
    description: "Fren mesafesi x2 artar; kayma ve arkadan çarpma frekansı belirgin yükselir.",
  },
  {
    id: "rain_high_wind",
    nameTr: "Şiddetli Yağmur ve Fırtına",
    nameEn: "Raining with high winds",
    accidents: 24650,
    percent: 1.5,
    fatalCount: 790,
    fatalRate: 3.20,
    relativeRisk: 2.15,
    description: "Görüş mesafesi daralması ve yanal rüzgarlar yüksek araçları savurarak çoklu kaza riskini 2 kattan fazla artırır.",
  },
  {
    id: "snow_no_wind",
    nameTr: "Kar Yağışlı",
    nameEn: "Snowing without high winds",
    accidents: 11840,
    percent: 0.7,
    fatalCount: 210,
    fatalRate: 1.77,
    relativeRisk: 1.82,
    description: "Sürücüler hızlarını düşürdüğü için ölüm oranı düşer; ancak hafif/maddi hasarlı kaza sıklığı tırmanır.",
  },
  {
    id: "fog_mist",
    nameTr: "Sis ve Pus",
    nameEn: "Fog or mist",
    accidents: 8920,
    percent: 0.5,
    fatalCount: 395,
    fatalRate: 4.43,
    relativeRisk: 3.12,
    description: "Kritik ölümcül risk faktörü! Otoyollarda zincirleme çarpışmalar nedeniyle ölüm riski normalin 3.1 katıdır.",
  },
  {
    id: "snow_high_wind",
    nameTr: "Tipi / Fırtınalı Kar",
    nameEn: "Snowing with high winds",
    accidents: 2180,
    percent: 0.1,
    fatalCount: 82,
    fatalRate: 3.76,
    relativeRisk: 2.85,
    description: "Ani yol kapanmaları ve zincirleme savrulmaların en tehlikeli kış senaryosu.",
  },
];

// Light Conditions Breakdown
export const LIGHT_CONDITIONS: LightCondition[] = [
  {
    id: "daylight",
    nameTr: "Gündüz / Doğal Işık",
    nameEn: "Daylight",
    accidents: 1198500,
    percent: 73.1,
    fatalCount: 22650,
    fatalRate: 1.89,
    relativeRisk: 1.0,
    description: "Referans aydınlatma. En yüksek kaza sayısı gündüz görülürken ölüm oranı düşüktür.",
  },
  {
    id: "dark_lit",
    nameTr: "Karanlık: Sokak Lambaları Açık",
    nameEn: "Darkness - lights lit",
    accidents: 324100,
    percent: 19.8,
    fatalCount: 7620,
    fatalRate: 2.35,
    relativeRisk: 1.48,
    description: "Gece kentsel kazaları. Yaya fark edilme süresinin gecikmesi ciddi yaralanmaları artırır.",
  },
  {
    id: "dark_no_lights",
    nameTr: "Karanlık: Aydınlatma Yok (Zifiri)",
    nameEn: "Darkness - no lighting",
    accidents: 98400,
    percent: 6.0,
    fatalCount: 7120,
    fatalRate: 7.24,
    relativeRisk: 4.86,
    description: "En ölümcül senaryo! Kırsal yollarda aydınlatma olmaması ölüm oranını %7.2'ye fırlatır (3.8 kat artış).",
  },
  {
    id: "dark_unlit",
    nameTr: "Karanlık: Sokak Lambaları Sönük/Arızalı",
    nameEn: "Darkness - lights unlit",
    accidents: 11200,
    percent: 0.7,
    fatalCount: 520,
    fatalRate: 4.64,
    relativeRisk: 2.95,
    description: "Beklenmedik aydınlatma kesintileri sürücü adaptasyonunu bozarak kaza şiddetini ikiye katlar.",
  },
];

// Road Types Breakdown
export const ROAD_TYPES: RoadTypeCondition[] = [
  {
    id: "single_carriageway",
    nameTr: "Tek Şeritli İki Yönlü Yol",
    nameEn: "Single carriageway",
    accidents: 1215400,
    percent: 74.1,
    fatalCount: 28940,
    fatalRate: 2.38,
    avgSpeedMph: 41,
    description: "Tüm ölümlerin %75'i burada yaşanır. Hatalı sollama sonucu kafa kafaya (head-on) çarpışmalar baş sebeptir.",
  },
  {
    id: "dual_carriageway",
    nameTr: "Bölünmüş Duble Yol",
    nameEn: "Dual carriageway",
    accidents: 236800,
    percent: 14.4,
    fatalCount: 5740,
    fatalRate: 2.42,
    avgSpeedMph: 58,
    description: "Refüj kafa kafaya çarpışmaları önler ancak yüksek hız kavşak katılım çarpışmalarını şiddetlendirir.",
  },
  {
    id: "roundabout",
    nameTr: "Dönel Kavşak (Roundabout)",
    nameEn: "Roundabout",
    accidents: 109200,
    percent: 6.7,
    fatalCount: 520,
    fatalRate: 0.48,
    avgSpeedMph: 24,
    description: "İngiliz kavşak mühendisliği başarısı: Çok sayıda temas kaza yaşansa da ölüm oranı neredeyse sıfıra yakındır (%0.48).",
  },
  {
    id: "one_way",
    nameTr: "Tek Yönlü Cadde",
    nameEn: "One way street",
    accidents: 34100,
    percent: 2.1,
    fatalCount: 310,
    fatalRate: 0.91,
    avgSpeedMph: 26,
    description: "Şehir içi düşük hız ve yaya etkileşimi; hafif hasarlı kazalar ağırlıktadır.",
  },
  {
    id: "slip_road",
    nameTr: "Bağlantı / Katılım Yolu (Slip Road)",
    nameEn: "Slip road",
    accidents: 21900,
    percent: 1.3,
    fatalCount: 380,
    fatalRate: 1.74,
    avgSpeedMph: 48,
    description: "Hızlanma/yavaşlama şeritlerindeki hız uyumsuzlukları ve kör nokta geçişleri.",
  },
];

// Time of Day & Hourly Accident Flow Pattern
export interface HourlyTrafficPattern {
  hour: number;
  label: string;
  accidentPercent: number;
  fatalSharePercent: number;
  congestionIndex: number; // 0 - 100
  severityRatio: number; // Fatal + Serious / Total %
}

export const HOURLY_TRAFFIC_PATTERNS: HourlyTrafficPattern[] = [
  { hour: 0, label: "00:00", accidentPercent: 1.8, fatalSharePercent: 3.4, congestionIndex: 12, severityRatio: 26.4 },
  { hour: 1, label: "01:00", accidentPercent: 1.3, fatalSharePercent: 3.1, congestionIndex: 8, severityRatio: 28.2 },
  { hour: 2, label: "02:00", accidentPercent: 1.0, fatalSharePercent: 2.8, congestionIndex: 6, severityRatio: 30.1 },
  { hour: 3, label: "03:00", accidentPercent: 0.8, fatalSharePercent: 2.4, congestionIndex: 5, severityRatio: 31.8 },
  { hour: 4, label: "04:00", accidentPercent: 0.7, fatalSharePercent: 2.1, congestionIndex: 9, severityRatio: 29.5 },
  { hour: 5, label: "05:00", accidentPercent: 1.1, fatalSharePercent: 2.2, congestionIndex: 22, severityRatio: 24.3 },
  { hour: 6, label: "06:00", accidentPercent: 2.3, fatalSharePercent: 2.9, congestionIndex: 48, severityRatio: 18.2 },
  { hour: 7, label: "07:00", accidentPercent: 4.8, fatalSharePercent: 3.8, congestionIndex: 78, severityRatio: 14.1 },
  { hour: 8, label: "08:00", accidentPercent: 8.2, fatalSharePercent: 4.6, congestionIndex: 96, severityRatio: 12.4 }, // Morning rush peak
  { hour: 9, label: "09:00", accidentPercent: 5.1, fatalSharePercent: 3.9, congestionIndex: 68, severityRatio: 13.5 },
  { hour: 10, label: "10:00", accidentPercent: 4.2, fatalSharePercent: 3.6, congestionIndex: 55, severityRatio: 14.2 },
  { hour: 11, label: "11:00", accidentPercent: 4.6, fatalSharePercent: 3.8, congestionIndex: 58, severityRatio: 14.8 },
  { hour: 12, label: "12:00", accidentPercent: 5.4, fatalSharePercent: 4.2, congestionIndex: 64, severityRatio: 14.9 },
  { hour: 13, label: "13:00", accidentPercent: 5.6, fatalSharePercent: 4.4, congestionIndex: 66, severityRatio: 15.2 },
  { hour: 14, label: "14:00", accidentPercent: 5.9, fatalSharePercent: 4.7, congestionIndex: 70, severityRatio: 15.6 },
  { hour: 15, label: "15:00", accidentPercent: 7.8, fatalSharePercent: 5.8, congestionIndex: 88, severityRatio: 15.1 }, // School run
  { hour: 16, label: "16:00", accidentPercent: 8.4, fatalSharePercent: 6.4, congestionIndex: 94, severityRatio: 15.4 },
  { hour: 17, label: "17:00", accidentPercent: 9.3, fatalSharePercent: 7.1, congestionIndex: 100, severityRatio: 15.8 }, // Evening rush peak
  { hour: 18, label: "18:00", accidentPercent: 7.7, fatalSharePercent: 6.5, congestionIndex: 85, severityRatio: 16.7 },
  { hour: 19, label: "19:00", accidentPercent: 5.4, fatalSharePercent: 5.5, congestionIndex: 60, severityRatio: 17.9 },
  { hour: 20, label: "20:00", accidentPercent: 4.1, fatalSharePercent: 4.8, congestionIndex: 44, severityRatio: 19.3 },
  { hour: 21, label: "21:00", accidentPercent: 3.4, fatalSharePercent: 4.3, congestionIndex: 32, severityRatio: 20.8 },
  { hour: 22, label: "22:00", accidentPercent: 3.1, fatalSharePercent: 4.1, congestionIndex: 24, severityRatio: 22.4 },
  { hour: 23, label: "23:00", accidentPercent: 2.6, fatalSharePercent: 3.7, congestionIndex: 18, severityRatio: 24.5 },
];

// 11 UK Regions
export const REGIONAL_STATISTICS: RegionalData[] = [
  {
    id: "london",
    name: "Greater London",
    totalAccidents: 445200,
    fatalities: 2980,
    fatalityRate: 0.67,
    urbanPercent: 98.8,
    ruralPercent: 1.2,
    hotspots: ["A10 Tottenham High Rd", "A40 Westway", "A205 South Circular", "Elephant & Castle Junction"],
    keyRiskFactor: "Yoğun yaya ve bisikletli etkileşimi, 20-30 mph hızlarda yüksek kaza sıklığı fakat düşük ölüm oranı.",
    trafficVolumeIndex: 95,
  },
  {
    id: "south_east",
    name: "South East",
    totalAccidents: 275400,
    fatalities: 6840,
    fatalityRate: 2.48,
    urbanPercent: 62.1,
    ruralPercent: 37.9,
    hotspots: ["M25 J10-12 Wisley", "A27 Worthing/Brighton Corridor", "A31 Hog's Back", "M3 / M27 Junctions"],
    keyRiskFactor: "Otoyol ve kırsal A-yolları karması; hafta sonu yüksek hızlı kırsal viraj kazaları.",
    trafficVolumeIndex: 90,
  },
  {
    id: "north_west",
    name: "North West (Manchester / Liverpool)",
    totalAccidents: 198200,
    fatalities: 4320,
    fatalityRate: 2.18,
    urbanPercent: 78.4,
    ruralPercent: 21.6,
    hotspots: ["M60 Manchester Ring", "M6 Thelwall Viaduct", "A537 Cat and Fiddle (Peak District)", "A580 East Lancs Rd"],
    keyRiskFactor: "Yağışlı iklim faktörü ve Peak District dağlık kırsal yol savrulmaları.",
    trafficVolumeIndex: 82,
  },
  {
    id: "west_midlands",
    name: "West Midlands (Birmingham)",
    totalAccidents: 148900,
    fatalities: 3120,
    fatalityRate: 2.10,
    urbanPercent: 81.2,
    ruralPercent: 18.8,
    hotspots: ["Spaghetti Junction (M6 J6)", "A38(M) Aston Expressway", "A45 Coventry Rd", "M5 / M6 interchange"],
    keyRiskFactor: "Otoyol kesişim noktaları ve karmaşık katılım şeritleri.",
    trafficVolumeIndex: 78,
  },
  {
    id: "yorkshire",
    name: "Yorkshire & The Humber",
    totalAccidents: 142100,
    fatalities: 3890,
    fatalityRate: 2.74,
    urbanPercent: 65.4,
    ruralPercent: 34.6,
    hotspots: ["A57 Snake Pass", "M62 Windy Hill Summit", "A64 York to Scarborough", "M1 Sheffield Tinsley"],
    keyRiskFactor: "Pennine tepelerindeki sis, buzlanma ve virajlı kırsal A-yolları.",
    trafficVolumeIndex: 72,
  },
  {
    id: "east_england",
    name: "East of England",
    totalAccidents: 141200,
    fatalities: 4420,
    fatalityRate: 3.13,
    urbanPercent: 54.2,
    ruralPercent: 45.8,
    hotspots: ["A12 Chelmsford to Colchester", "A14 Cambridge/Ipswich", "A47 Peterborough corridor"],
    keyRiskFactor: "Uzun mesafeli tek şeritli kırsal bağlantı yolları ve tarım araçları sollamaları.",
    trafficVolumeIndex: 68,
  },
  {
    id: "south_west",
    name: "South West",
    totalAccidents: 122800,
    fatalities: 3950,
    fatalityRate: 3.22,
    urbanPercent: 48.7,
    ruralPercent: 51.3,
    hotspots: ["A303 Stonehenge Corridor", "A30 Devon/Cornwall Trunk", "A38 Haldon Hill", "A361 North Devon Link"],
    keyRiskFactor: "Yaz turizm trafiği yoğunluğu ve aydınlatmasız dar virajlı kırsal yollar.",
    trafficVolumeIndex: 65,
  },
  {
    id: "east_midlands",
    name: "East Midlands",
    totalAccidents: 114500,
    fatalities: 3480,
    fatalityRate: 3.04,
    urbanPercent: 58.0,
    ruralPercent: 42.0,
    hotspots: ["A1 Lincolnshire section", "A46 Lincoln to Newark", "M1 Leicester Forest J21", "A52 Nottingham Corridor"],
    keyRiskFactor: "Ağır vasıta (HGV) nakliye koridorları ve 60 mph kırsal tek şeritler.",
    trafficVolumeIndex: 64,
  },
  {
    id: "scotland",
    name: "Scotland",
    totalAccidents: 98600,
    fatalities: 3240,
    fatalityRate: 3.29,
    urbanPercent: 44.5,
    ruralPercent: 55.5,
    hotspots: ["A9 Perth to Inverness", "A82 Loch Lomond & Glencoe", "M8 Glasgow to Edinburgh", "A96 Aberdeen Corridor"],
    keyRiskFactor: "Aşırı hava koşulları (kar/buz), zifiri karanlık kış günleri ve yüksek hızlı tek şeritli A9 güzergahı.",
    trafficVolumeIndex: 58,
  },
  {
    id: "wales",
    name: "Wales (Cymru)",
    totalAccidents: 69400,
    fatalities: 2410,
    fatalityRate: 3.47,
    urbanPercent: 42.3,
    ruralPercent: 57.7,
    hotspots: ["A470 Cambrian Way", "A40 Brecon Beacons", "M4 Brynglas Tunnels", "A55 North Wales Expressway"],
    keyRiskFactor: "En yüksek bölgesel ölüm oranı (%3.47). Dağlık topoğrafya, yağış ve kırsal virajlar.",
    trafficVolumeIndex: 52,
  },
  {
    id: "north_east",
    name: "North East (Newcastle)",
    totalAccidents: 61800,
    fatalities: 1390,
    fatalityRate: 2.25,
    urbanPercent: 74.0,
    ruralPercent: 26.0,
    hotspots: ["A1 Western Bypass", "A19 Tyne Tunnel approaches", "A69 Newcastle to Carlisle", "A66 Bowes Cross"],
    keyRiskFactor: "Kış don olayları ve Tyne nehri geçiş noktalarındaki ani trafik yığılmaları.",
    trafficVolumeIndex: 50,
  },
];

// Urban vs Rural Core Comparison Metrics
export const URBAN_VS_RURAL_INSIGHTS = {
  totalAccidentSplit: {
    urban: 68.2, // %
    rural: 31.8, // %
  },
  fatalitiesSplit: {
    urban: 41.8, // %
    rural: 58.2, // %
  },
  fatalityRate: {
    urban: 1.05, // % of accidents that result in fatality
    rural: 3.48, // 3.3x higher fatality rate per accident!
  },
  averageImpactSpeedMph: {
    urban: 24.2,
    rural: 51.6,
  },
  emergencyResponseTimeMinutes: {
    urban: 7.4,
    rural: 18.9,
  },
  pedestrianCasualtiesPercent: {
    urban: 22.4,
    rural: 3.1,
  },
  headOnCollisionShare: {
    urban: 3.8,
    rural: 19.4, // 5x higher in rural due to overtaking on single carriageways
  },
  fixedObjectCollisionsPercent: {
    urban: 7.2,
    rural: 28.5, // Trees, stone walls, ditches
  },
  unlitRoadsPercent: {
    urban: 2.4,
    rural: 64.2,
  },
};
