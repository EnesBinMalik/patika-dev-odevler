export interface EnergyHourlyData {
  time: string; // ISO string e.g. "2018-01-15 14:00"
  timestamp: number;
  total_load_actual: number; // MW (Electricity Demand)
  price_actual: number; // EUR / MWh
  generation_wind: number; // MW
  generation_solar: number; // MW
  generation_hydro: number; // MW
  generation_nuclear: number; // MW
  generation_fossil_gas: number; // MW
  generation_coal: number; // MW
  // Weather in 5 key Spanish cities
  temp_madrid: number; // °C
  temp_barcelona: number; // °C
  temp_valencia: number; // °C
  temp_seville: number; // °C
  temp_bilbao: number; // °C
  avg_temp_spain: number; // Weighted average °C
  wind_speed_spain: number; // m/s
  humidity_spain: number; // %
  rain_1h_spain: number; // mm
  weather_main: 'Clear' | 'Clouds' | 'Rain' | 'Snow' | 'Thunderstorm' | 'Fog';
  is_missing_load?: boolean;
  is_missing_price?: boolean;
  is_outlier?: boolean;
}

export type TargetVariable = 'total_load_actual' | 'price_actual';

export type ImputationMethod = 'linear_interp' | 'forward_fill' | 'seasonal_lag24' | 'knn_impute';

export type OutlierMethod = 'none' | 'iqr' | 'zscore' | 'winsorize' | 'isolation_forest';

export interface PreprocessingConfig {
  imputationMethod: ImputationMethod;
  outlierMethod: OutlierMethod;
  outlierThreshold: number; // e.g., 1.5 for IQR, 3.0 for Z-Score, 0.02 for Winsorize
  target: TargetVariable;
  addLagFeatures: boolean;
  addCyclicalFeatures: boolean;
  addDegreeDays: boolean;
  trainRatio: number; // e.g. 70
  valRatio: number; // e.g. 15
  testRatio: number; // e.g. 15
}

export interface MetricResults {
  rmse: number;
  rmsle: number;
  mae: number;
  mape: number;
  r2: number;
}

export interface ModelEvaluation {
  id: string;
  name: string;
  family: 'Baseline' | 'Linear' | 'Tree-Ensemble' | 'Boosting' | 'Deep-Learning';
  description: string;
  trainMetrics: MetricResults;
  valMetrics: MetricResults;
  testMetrics: MetricResults;
  trainingTimeSec: number;
  hyperparameters: Record<string, string | number>;
  featureImportance: { feature: string; importance: number }[];
  isChampion?: boolean;
  predictions: {
    actual: number;
    predicted: number;
    time: string;
    residual: number;
  }[];
}

export interface MunicipalityScenario {
  scenarioName: string;
  season: 'winter' | 'summer' | 'spring' | 'autumn';
  targetDateStr: string;
  hour: number;
  isWeekend: boolean;
  tempMadrid: number;
  tempSeville: number;
  tempBarcelona: number;
  windSpeed: number;
  solarInsolation: number; // 0 to 1
  gasPricePerMWh: number; // wholesale cost factor
  subsidyRate: number; // 0 to 50% discount offered by municipality
  peakHourFeeWaiver: boolean;
  emergencyBudgetEuro: number;
}

export interface MunicipalityImpactResult {
  predictedDemandMW: number;
  baselineDemandMW: number;
  predictedWholesalePriceEUR: number;
  baselineWholesalePriceEUR: number;
  gridStressIndex: number; // 0 to 100
  gridStressLevel: 'DÜŞÜK' | 'ORTA' | 'YÜKSEK' | 'KRİTİK ALARM';
  suggestedAction: string;
  finalConsumerTariffEUR: number;
  totalSubsidyCostMunicipalEUR: number;
  vulnerableHouseholdsProtected: number;
  carbonEmissionTons: number;
}
