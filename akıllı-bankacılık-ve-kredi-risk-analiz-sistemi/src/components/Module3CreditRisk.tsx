import React, { useState } from 'react';
import { BankingEngine } from '../services/bankingEngine';
import { CreditCalculationInput, CreditEvaluationResult } from '../types/banking';
import { Calculator, CheckCircle2, XCircle, AlertTriangle, FileText, ChevronRight, Sliders, ShieldAlert } from 'lucide-react';

interface Module3CreditRiskProps {
  engine: BankingEngine;
  onRefresh: () => void;
}

export const Module3CreditRisk: React.FC<Module3CreditRiskProps> = ({ engine, onRefresh }) => {
  const customers = engine.getCustomers();
  const [selectedCustId, setSelectedCustId] = useState<string>(customers[0].id);

  // Form states initialized with customer 0
  const selectedCust = engine.getCustomerById(selectedCustId) || customers[0];
  const [income, setIncome] = useState<number>(selectedCust.monthlyIncome);
  const [debts, setDebts] = useState<number>(selectedCust.existingDebts);
  const [findexScore, setFindexScore] = useState<number>(selectedCust.findexScore);
  const [amount, setAmount] = useState<number>(100000);
  const [months, setMonths] = useState<number>(24);
  const [loanType, setLoanType] = useState<'İhtiyaç' | 'Konut' | 'Taşıt' | 'Ticari'>('İhtiyaç');

  const handleCustomerChange = (id: string) => {
    setSelectedCustId(id);
    const c = engine.getCustomerById(id);
    if (c) {
      setIncome(c.monthlyIncome);
      setDebts(c.existingDebts);
      setFindexScore(c.findexScore);
    }
  };

  // Live evaluation calculation
  const inputData: CreditCalculationInput = {
    customerId: selectedCust.id,
    loanType,
    requestedAmount: amount,
    maturityMonths: months,
    monthlyIncome: income,
    existingMonthlyDebt: debts,
    findexScore,
  };

  const result: CreditEvaluationResult = engine.evaluateCredit(inputData);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
          <span>MODÜL 3</span>
          <span>·</span>
          <span>C# ALGORİTMALARI</span>
          <span>·</span>
          <span>BDDK DTI & DİNAMİK FAİZ MOTORU</span>
        </div>
        <h2 className="text-xl font-bold text-white mt-1">Kredi Faiz Hesaplama ve Risk Analiz Motoru</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Kullanıcının aylık net gelirine, mevcut borç yüküne (DTI &le; %50 BDDK kuralı) ve Findeks kredi notuna göre
          dinamik faiz oranı belirleyen, risk skorlaması yaparak kredinin onaylanıp onaylanmadığını analiz eden karar motoru.
        </p>
      </div>

      {/* Main Grid: Form on Left, Risk Scorecard on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUT PARAMETERS FORM (5 COLS) */}
        <div className="lg:col-span-5 p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white font-mono">Kredi Başvuru Parametreleri</h3>
            </div>
            <select
              value={selectedCustId}
              onChange={(e) => handleCustomerChange(e.target.value)}
              className="text-xs bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} ({c.findexScore} Puan)
                </option>
              ))}
            </select>
          </div>

          {/* Kredi Türü Seçimi */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">Kredi Türü</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['İhtiyaç', 'Konut', 'Taşıt', 'Ticari'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setLoanType(t)}
                  className={`py-1.5 text-xs font-mono rounded-lg border text-center transition-colors ${
                    loanType === t
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Talep Edilen Kredi Tutarı */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Talep Edilen Tutar</span>
              <span className="text-purple-300 font-bold tabular-nums">
                {amount.toLocaleString('tr-TR')} TL
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="1000000"
              step="10000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
              <span>10.000 TL</span>
              <span>1.000.000 TL</span>
            </div>
          </div>

          {/* Vade Seçimi */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">Vade (Ay Sayısı)</label>
            <div className="grid grid-cols-6 gap-1">
              {[3, 6, 12, 24, 36, 48].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMonths(m)}
                  className={`py-1.5 text-xs font-mono rounded border transition-colors ${
                    months === m
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {m} Ay
                </button>
              ))}
            </div>
          </div>

          {/* Aylık Net Gelir */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Aylık Net Gelir</span>
              <span className="text-slate-200 font-bold tabular-nums">
                {income.toLocaleString('tr-TR')} TL
              </span>
            </div>
            <input
              type="range"
              min="15000"
              max="250000"
              step="5000"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Mevcut Aylık Borçlar */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Mevcut Kredi/Kart Borçları</span>
              <span className="text-amber-300 font-bold tabular-nums">
                {debts.toLocaleString('tr-TR')} TL
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100000"
              step="2000"
              value={debts}
              onChange={(e) => setDebts(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Findeks Kredi Notu */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Findeks Kredi Notu</span>
              <span className="text-cyan-300 font-bold tabular-nums">
                {findexScore} / 1900
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="1900"
              step="10"
              value={findexScore}
              onChange={(e) => setFindexScore(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
              <span>0 (Kritik)</span>
              <span>950 (Eşik)</span>
              <span>1900 (Mükemmel)</span>
            </div>
          </div>
        </div>

        {/* RISK EVALUATION & SCORECARD (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Decision Banner */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              result.approvalStatus === 'ONAYLANDI'
                ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-100'
                : result.approvalStatus === 'ŞARTLI ONAY'
                ? 'bg-amber-950/20 border-amber-500/40 text-slate-100'
                : 'bg-rose-950/20 border-rose-500/40 text-slate-100'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono text-slate-400 block">KREDİ RİSK DEĞERLENDİRME KARARI</span>
                <div className="flex items-center gap-2 mt-1">
                  {result.approvalStatus === 'ONAYLANDI' ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  ) : result.approvalStatus === 'ŞARTLI ONAY' ? (
                    <AlertTriangle className="w-6 h-6 text-amber-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-400" />
                  )}
                  <h3 className="text-2xl font-bold font-mono tracking-tight">
                    {result.approvalStatus}
                  </h3>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono text-slate-400 block">RİSK DERECESİ</span>
                <span
                  className={`text-lg font-bold font-mono px-3 py-1 rounded-lg inline-block mt-1 ${
                    result.riskRating === 'AAA' || result.riskRating === 'AA'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : result.riskRating === 'A' || result.riskRating === 'BBB'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {result.riskRating}
                </span>
              </div>
            </div>

            {/* Reasons Bullets */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1 text-xs">
              {result.reasons.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-300 font-mono">
                  <span className="text-purple-400">&bull;</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Financial Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
              <span className="text-slate-400 block text-[11px]">Aylık Taksit</span>
              <span className="text-white text-base font-bold tabular-nums block mt-1">
                {result.monthlyPayment.toLocaleString('tr-TR')} TL
              </span>
              <span className="text-[10px] text-slate-500">Vergiler dahil</span>
            </div>

            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
              <span className="text-slate-400 block text-[11px]">Dinamik Faiz Oranı</span>
              <span className="text-purple-300 text-base font-bold tabular-nums block mt-1">
                %{result.appliedMonthlyRate.toFixed(2)} / ay
              </span>
              <span className="text-[10px] text-slate-500">Yıllık: %{result.appliedAnnualRate.toFixed(2)}</span>
            </div>

            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
              <span className="text-slate-400 block text-[11px]">Borç/Gelir (DTI)</span>
              <span
                className={`text-base font-bold tabular-nums block mt-1 ${
                  result.debtToIncomeRatio <= 50 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                %{result.debtToIncomeRatio.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-500">BDDK Üst Sınır: %50</span>
            </div>

            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
              <span className="text-slate-400 block text-[11px]">Toplam Geri Ödeme</span>
              <span className="text-white text-base font-bold tabular-nums block mt-1">
                {result.totalRepayment.toLocaleString('tr-TR')} TL
              </span>
              <span className="text-[10px] text-slate-500">Faiz: {result.totalInterest.toLocaleString('tr-TR')} TL</span>
            </div>
          </div>

          {/* Amortization Schedule Table Preview */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white font-mono">
                Örnek İtfa Planı (İlk {result.amortizationPlan.length} Ay)
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">Annuity Formülü</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="py-1.5 px-2">Ay</th>
                    <th className="py-1.5 px-2 text-right">Taksit</th>
                    <th className="py-1.5 px-2 text-right">Anapara</th>
                    <th className="py-1.5 px-2 text-right">Faiz</th>
                    <th className="py-1.5 px-2 text-right">KKDF+BSMV</th>
                    <th className="py-1.5 px-2 text-right">Kalan Borç</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {result.amortizationPlan.slice(0, 6).map((row) => (
                    <tr key={row.month} className="hover:bg-slate-800/40 text-slate-300">
                      <td className="py-1.5 px-2 text-slate-400">#{row.month}</td>
                      <td className="py-1.5 px-2 text-right font-bold text-white tabular-nums">
                        {row.payment.toLocaleString('tr-TR')} TL
                      </td>
                      <td className="py-1.5 px-2 text-right text-emerald-400 tabular-nums">
                        {row.principal.toLocaleString('tr-TR')} TL
                      </td>
                      <td className="py-1.5 px-2 text-right text-purple-300 tabular-nums">
                        {row.interest.toLocaleString('tr-TR')} TL
                      </td>
                      <td className="py-1.5 px-2 text-right text-amber-300 tabular-nums">
                        {row.tax.toLocaleString('tr-TR')} TL
                      </td>
                      <td className="py-1.5 px-2 text-right text-slate-400 tabular-nums">
                        {row.remainingBalance.toLocaleString('tr-TR')} TL
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
