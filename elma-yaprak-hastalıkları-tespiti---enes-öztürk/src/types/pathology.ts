export type DiseaseClass = 'healthy' | 'rust' | 'scab' | 'multiple_diseases';

export interface ClassInfo {
  id: DiseaseClass;
  name: string;
  scientificName: string;
  count: number;
  percent: number;
  color: string;
  description: string;
  typicalSymptoms: string[];
}

export interface ModelBenchmark {
  id: string;
  name: string;
  family: 'CNN' | 'Residual' | 'Dense' | 'Modern Conv' | 'Transformer' | 'Mobile' | 'Ensemble';
  params: string;
  rocAuc: number;
  f1Score: number;
  logLoss: number;
  accuracy: number;
  inferenceTimeMs: number;
  notes: string;
  isBest?: boolean;
}

export interface GradCamHotspot {
  x: number;
  y: number;
  radius: number;
  intensity: number;
  label: string;
}

export interface DiagnosisResult {
  primaryDiagnosis: DiseaseClass;
  turkishDiagnosis: string;
  pathogen: string;
  confidenceScores: {
    healthy: number;
    rust: number;
    scab: number;
    multiple_diseases: number;
  };
  visualFindings: string[];
  diseaseSeverityPercent: number;
  pathologyAnalysis: string;
  treatmentRecommendations: {
    chemical: string[];
    cultural: string[];
    timing: string;
  };
  gradCamHotspots: GradCamHotspot[];
}

export interface SampleLeafImage {
  id: string;
  name: string;
  diseaseType: DiseaseClass;
  tag: string;
  description: string;
  imageUrl: string;
  defaultHotspots: GradCamHotspot[];
}
