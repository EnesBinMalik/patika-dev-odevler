/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proje: Öztürk Bank ATM & Çekirdek Bankacılık Sistemi
 * Geliştirici: Enes Öztürk
 *
 * İnteraktif UML Sınıf Diyagramı (Class Diagram)
 * OOP: Interface, Abstract Class, Inheritance, Polymorphism, Design Patterns
 */

import React, { useState } from 'react';
import { X, Layers, GitBranch, Shield, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

interface UmlDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UmlDiagramModal: React.FC<UmlDiagramModalProps> = ({ isOpen, onClose }) => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'OOP' | 'PATTERNS' | 'SERVICES'>('ALL');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                UML Sınıf Diyagramı & OOP Mimarisi
                <span className="text-xs font-normal text-amber-400/90 px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/20">
                  Enes Öztürk İmzalı
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Interface, Abstract Class, Inheritance, Polimorfizm, Stream API & Tasarım Desenleri
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Segmented Control */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button
              onClick={() => setSelectedFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedFilter === 'ALL' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tüm Katmanlar
            </button>
            <button
              onClick={() => setSelectedFilter('OOP')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedFilter === 'OOP' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              OOP & Kalıtım Hiyerarşisi
            </button>
            <button
              onClick={() => setSelectedFilter('PATTERNS')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedFilter === 'PATTERNS' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tasarım Desenleri (Factory, Strategy, Optional)
            </button>
            <button
              onClick={() => setSelectedFilter('SERVICES')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedFilter === 'SERVICES' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Servis & Repository Katmanı
            </button>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 inline-block"></span> Interface
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-violet-500 inline-block"></span> Abstract Class
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span> Concrete Class
            </span>
          </div>
        </div>

        {/* Diagram Canvas Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Section 1: OOP & Inheritance */}
          {(selectedFilter === 'ALL' || selectedFilter === 'OOP') && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <GitBranch className="w-4 h-4 text-amber-400" />
                1. Hesap & Kullanıcı Hiyerarşisi (OOP: Interface, Abstract Class & Kalıtım)
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Interface: IAccountOperations */}
                <div className="bg-slate-950/70 border-2 border-sky-500/40 rounded-xl p-4 relative font-mono text-xs">
                  <div className="text-sky-400 font-bold mb-1">&lt;&lt;interface&gt;&gt;</div>
                  <div className="text-slate-100 font-bold text-sm mb-3">IAccountOperations</div>
                  <div className="border-t border-slate-800 pt-2 space-y-1 text-slate-300">
                    <div>+ deposit(amount: number): number</div>
                    <div>+ withdraw(amount: number): number</div>
                    <div>+ getBalance(): number</div>
                    <div>+ canWithdraw(amount: number): boolean</div>
                    <div>+ calculateInterest?(): number</div>
                  </div>
                </div>

                {/* Abstract: AbstractAccount */}
                <div className="bg-slate-950/70 border-2 border-violet-500/40 rounded-xl p-4 relative font-mono text-xs md:col-span-2">
                  <div className="text-violet-400 font-bold mb-1">&lt;&lt;abstract class&gt;&gt;</div>
                  <div className="text-slate-100 font-bold text-sm mb-1">
                    AbstractAccount <span className="text-xs text-sky-400 font-normal">implements IAccountOperations</span>
                  </div>
                  <div className="border-t border-slate-800 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                    <div>
                      <div className="text-slate-500 text-[10px] uppercase font-bold mb-1">Fields</div>
                      <div># id: string</div>
                      <div># accountNumber: string</div>
                      <div># iban: string</div>
                      <div># balance: number</div>
                      <div># dailyLimit: number</div>
                      <div># todayWithdrawn: number</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px] uppercase font-bold mb-1">Methods</div>
                      <div>+ getBalance(): number</div>
                      <div>+ deposit(amount: number): number</div>
                      <div>+ withdraw(amount: number): number</div>
                      <div className="text-violet-300 font-semibold">+ abstract canWithdraw(amount): boolean</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subclasses extending AbstractAccount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-dashed border-violet-500/30">
                <div className="bg-slate-950/70 border border-emerald-500/40 rounded-xl p-4 font-mono text-xs">
                  <div className="text-emerald-400 font-bold mb-1">&lt;&lt;class&gt;&gt; extends AbstractAccount</div>
                  <div className="text-slate-100 font-bold text-sm mb-2">CheckingAccount (Vadesiz Hesap)</div>
                  <div className="border-t border-slate-800 pt-2 text-slate-300 space-y-1">
                    <div>+ accountType = AccountType.CHECKING</div>
                    <div className="text-emerald-300 font-semibold">
                      + canWithdraw(amount): boolean &#123; bakiye &gt;= amount &amp;&amp; günlük limit &#125;
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-emerald-500/40 rounded-xl p-4 font-mono text-xs">
                  <div className="text-emerald-400 font-bold mb-1">&lt;&lt;class&gt;&gt; extends AbstractAccount</div>
                  <div className="text-slate-100 font-bold text-sm mb-2">SavingsAccount (Vadeli / Birikim)</div>
                  <div className="border-t border-slate-800 pt-2 text-slate-300 space-y-1">
                    <div>+ interestRate = 0.45 (%45 Yıllık Getiri)</div>
                    <div>+ calculateInterest(): number (Aylık Bileşik Faiz)</div>
                    <div className="text-emerald-300 font-semibold">+ canWithdraw(amount): boolean</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Design Patterns */}
          {(selectedFilter === 'ALL' || selectedFilter === 'PATTERNS') && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Zap className="w-4 h-4 text-amber-400" />
                2. Tasarım Desenleri & Fonksiyonel Yapılar (Design Patterns & Stream API)
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Pattern 1: Strategy */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2">
                  <div className="text-amber-400 font-bold uppercase tracking-wider text-[11px]">Strategy Pattern</div>
                  <div className="text-slate-100 font-bold text-sm">WithdrawalValidationStrategy</div>
                  <div className="text-slate-400 text-[11px]">
                    S.O.L.I.D Açık/Kapalı Prensibi (OCP): Çekim kuralları izole strateji sınıflarında doğrulanır.
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-300 space-y-1">
                    <div>• Bakiye yetersizse hata fırlatır</div>
                    <div>• 10 TL katı kuralı denetler</div>
                    <div>• Günlük limit kontrolü yapar</div>
                  </div>
                </div>

                {/* Pattern 2: Factory & Builder */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2">
                  <div className="text-amber-400 font-bold uppercase tracking-wider text-[11px]">Factory & Builder</div>
                  <div className="text-slate-100 font-bold text-sm">TransactionFactory</div>
                  <div className="text-slate-400 text-[11px]">
                    Dekont ve işlem nesneleri doğrudan new yerine fabrika ve builder ile güvenle üretilir.
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-300 space-y-1">
                    <div>+ createDeposit(...)</div>
                    <div>+ createWithdrawal(...)</div>
                    <div>+ createTransferOut(...)</div>
                    <div>+ createTransferIn(...)</div>
                  </div>
                </div>

                {/* Pattern 3: Optional & Stream */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2">
                  <div className="text-amber-400 font-bold uppercase tracking-wider text-[11px]">Java Stream & Optional</div>
                  <div className="text-slate-100 font-bold text-sm">Optional&lt;T&gt; &amp; Stream&lt;T&gt;</div>
                  <div className="text-slate-400 text-[11px]">
                    NullPointer riskini sıfıra indiren Optional ve bildirimsel koleksiyon akışı.
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-300 space-y-1">
                    <div>• Optional.ofNullable().orElseThrow()</div>
                    <div>• Stream.of(list).filter().map()</div>
                    <div>• .findFirst() &amp; .reduce()</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Layered Spring Boot Architecture */}
          {(selectedFilter === 'ALL' || selectedFilter === 'SERVICES') && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Shield className="w-4 h-4 text-amber-400" />
                3. Spring Boot Katmanlı Mimari (Controller → Service → Repository → DB / I/O)
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                  <div className="text-amber-400 font-bold mb-1">Presentation Layer</div>
                  <div className="text-slate-200 font-semibold mb-2">React UI &amp; ATM Screen</div>
                  <p className="text-slate-400 text-[11px]">
                    Kullanıcı ve Yönetici etkileşimleri, fiziksel tuş takımı, nakit yuvası simülasyonu.
                  </p>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                  <div className="text-sky-400 font-bold mb-1">Service Layer</div>
                  <div className="text-slate-200 font-semibold mb-2">Auth, Account &amp; Admin</div>
                  <p className="text-slate-400 text-[11px]">
                    3 deneme hakkı güvenliği, bakiye doğrulama, havale orkestrasyonu, audit kaydı.
                  </p>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                  <div className="text-emerald-400 font-bold mb-1">Repository Layer</div>
                  <div className="text-slate-200 font-semibold mb-2">LocalStorageBankRepository</div>
                  <p className="text-slate-400 text-[11px]">
                    JPA benzeri sorgular, SQL INNER JOIN projeksiyonu, sayfalama (Paging).
                  </p>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                  <div className="text-violet-400 font-bold mb-1">Storage &amp; File I/O</div>
                  <div className="text-slate-200 font-semibold mb-2">FileIoService &amp; DB State</div>
                  <p className="text-slate-400 text-[11px]">
                    Kalıcı LocalStorage + CSV, JSON dışa aktarma ve Enes Öztürk imzalı resmi dekont indirme.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Enes Öztürk Signature Box */}
          <div className="p-4 bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-slate-200">
                  Mimari &amp; Yazılım Tasarım Onayı
                </div>
                <div className="text-xs text-slate-400">
                  S.O.L.I.D prensiplerine tam uyum, katmanlı ayrım ve nesne yönelimli programlama standartları
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-amber-400">ENES ÖZTÜRK</div>
              <div className="text-[11px] text-slate-400">Sistem Yöneticisi &amp; Baş Yazılım Mimarı</div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>UML 2.5 Standardına Uygun Modellenmiştir</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-medium"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
