export type ModelType = 'entity' | 'dto' | 'viewmodel';

export interface ConceptDetail {
  id: ModelType;
  title: string;
  badge: string;
  tagline: string;
  layer: string;
  purpose: string;
  keyResponsibilities: string[];
  mustInclude: string[];
  mustNeverInclude: string[];
  commonMistakes: string[];
  codeSnippet: string;
  colorScheme: {
    border: string;
    bg: string;
    text: string;
    accent: string;
  };
}

export interface ComparisonRow {
  feature: string;
  entity: string;
  dto: string;
  viewModel: string;
}

export interface PipelineStep {
  stepNumber: number;
  name: string;
  role: string;
  layer: string;
  type: 'ui' | 'viewmodel' | 'dto' | 'entity';
  dataPayload: Record<string, any>;
  description: string;
  codeExplanation: string;
}

export interface CodeTemplate {
  language: 'csharp' | 'typescript' | 'java';
  title: string;
  files: {
    fileName: string;
    modelType: ModelType | 'controller' | 'mapping';
    description: string;
    code: string;
  }[];
}

export interface QuizQuestion {
  id: number;
  scenario: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}
