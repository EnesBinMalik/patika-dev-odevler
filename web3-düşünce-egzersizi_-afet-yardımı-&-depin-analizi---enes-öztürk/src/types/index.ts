export interface MetricCard {
  label: string;
  value: string;
  description: string;
  baselineWeb2: string;
}

export interface ComparisonItem {
  id: string;
  category: string;
  title: string;
  web2Approach: string;
  web2Limitation: string;
  web3Approach: string;
  web3Innovation: string;
  underlyingTech: string;
}

export interface SimulationStep {
  step: number;
  title: string;
  actor: string;
  description: string;
  smartContractEvent: string;
  technicalMechanism: string;
  zkProofStatus: string;
}

export interface SecondaryCase {
  id: string;
  title: string;
  tagline: string;
  problem: string;
  solution: string;
  coreTech: string[];
}
