/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { TargetVariable, PreprocessingConfig } from './types/energy';
import { SPAIN_ENERGY_DATA, computeDatasetSummary } from './data/spainEnergyData';
import {
  imputeMissingValues,
  handleOutliers,
  trainAndEvaluateModels,
} from './utils/mlEngine';
import { Header } from './components/Header';
import { DataExplorationTab } from './components/DataExplorationTab';
import { PreprocessingTab } from './components/PreprocessingTab';
import { SplitAndMetricsTab } from './components/SplitAndMetricsTab';
import { ModelZooTab } from './components/ModelZooTab';
import { MunicipalitySimulatorTab } from './components/MunicipalitySimulatorTab';
import { CodeAndRepoTab } from './components/CodeAndRepoTab';
import { Trophy, CheckCircle, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('eda');
  const [target, setTarget] = useState<TargetVariable>('total_load_actual');

  const [config, setConfig] = useState<PreprocessingConfig>({
    imputationMethod: 'linear_interp',
    outlierMethod: 'iqr',
    outlierThreshold: 1.5,
    target: 'total_load_actual',
    addLagFeatures: true,
    addCyclicalFeatures: true,
    addDegreeDays: true,
    trainRatio: 70,
    valRatio: 15,
    testRatio: 15,
  });

  // Calculate dataset summary
  const summary = useMemo(() => {
    return computeDatasetSummary(SPAIN_ENERGY_DATA);
  }, []);

  // Preprocessing Pipeline: Step 1 Imputation
  const imputedResult = useMemo(() => {
    return imputeMissingValues(SPAIN_ENERGY_DATA, config.imputationMethod);
  }, [config.imputationMethod]);

  // Step 2: Outlier Handling
  const outlierResult = useMemo(() => {
    return handleOutliers(
      imputedResult.cleaned,
      target,
      config.outlierMethod,
      config.outlierThreshold
    );
  }, [imputedResult.cleaned, target, config.outlierMethod, config.outlierThreshold]);

  // Step 3: Model Training & Evaluation across algorithms
  const modelEvaluations = useMemo(() => {
    return trainAndEvaluateModels(outlierResult.cleaned, target, config);
  }, [outlierResult.cleaned, target, config]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        target={target}
        setTarget={setTarget}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'eda' && (
          <DataExplorationTab
            data={outlierResult.cleaned}
            summary={summary}
            target={target}
          />
        )}

        {activeTab === 'preprocessing' && (
          <PreprocessingTab
            rawData={SPAIN_ENERGY_DATA}
            cleanedData={outlierResult.cleaned}
            config={config}
            setConfig={setConfig}
            target={target}
            outlierLower={outlierResult.lowerBound}
            outlierUpper={outlierResult.upperBound}
            outlierCount={outlierResult.outlierCount}
          />
        )}

        {activeTab === 'split-metrics' && (
          <SplitAndMetricsTab
            config={config}
            setConfig={setConfig}
            target={target}
          />
        )}

        {activeTab === 'models' && (
          <ModelZooTab
            models={modelEvaluations}
            target={target}
          />
        )}

        {activeTab === 'municipality' && (
          <MunicipalitySimulatorTab />
        )}

        {activeTab === 'repo' && (
          <CodeAndRepoTab />
        )}
      </main>

      {/* Footer with Academic Attribution and Enes Öztürk Signature */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-1 rounded bg-blue-950 text-blue-400 border border-blue-900">
              <Trophy className="w-4 h-4" />
            </span>
            <div>
              <span className="text-slate-300 font-medium block">
                Saatlik Enerji Talebi, Üretimi ve Hava Durumu ML Projesi
              </span>
              <span className="text-slate-500 text-[11px]">
                İspanya 4 Yıllık REE & AEMET Kaggle Veri Seti Çözümü
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Geliştirici: <strong className="text-amber-300 font-semibold">Enes Öztürk</strong></span>
            </span>
            <a
              href="https://www.kaggle.com/nicholasjhana/energy-consumption-generation-prices-and-weather"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1 transition"
            >
              <span>Kaggle</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
