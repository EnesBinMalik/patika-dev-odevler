/**
 * UmlDiagramView - İnteraktif UML Sınıf Diyagramı (Class Diagram)
 * Kurallar: OOP (Interface, Abstract Class, Inheritance), Stream API, Optional, Enum, Tasarım Desenleri
 * Mimar: Enes Öztürk
 */

import React, { useState } from 'react';
import { GitBranch, Layers, Box, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

export const UmlDiagramView: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string>('User');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Başlık & Mimari Künyesi */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
            <span className="text-xs uppercase tracking-wider text-blue-400 font-mono font-bold">
              Yazılım Mimarisi & UML Sınıf Şeması
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            Öztürk Bank Nesne Yönelimli (OOP) Sistem Tasarımı
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            S.O.L.I.D Prensipleri, Tasarım Desenleri, Kalıtım & Soyutlama Hiyerarşisi | Mimar: Enes Öztürk
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-lg font-mono">
            Interface Segregation
          </span>
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-lg font-mono">
            Dependency Inversion
          </span>
          <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-lg font-mono">
            5 Design Patterns
          </span>
        </div>
      </div>

      {/* UML Diyagramı Görsel Çizim Alanı */}
      <div className="bg-slate-950 rounded-2xl p-6 border-2 border-slate-800 shadow-2xl overflow-x-auto space-y-8">
        
        {/* Katman 1: Interfaces & Abstractions */}
        <div>
          <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>1. Soyutlama Katmanı (Interfaces & Abstract Classes)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* BaseEntity */}
            <div className="bg-slate-900 border-2 border-amber-500/40 rounded-xl overflow-hidden shadow-lg">
              <div className="bg-amber-600/20 border-b border-amber-500/30 px-4 py-2 font-mono text-center">
                <span className="text-[10px] text-amber-300 block">&lt;&lt;abstract class&gt;&gt;</span>
                <span className="font-bold text-sm text-white">BaseEntity</span>
              </div>
              <div className="p-3 text-[11px] font-mono text-slate-300 space-y-1 border-b border-slate-800 bg-slate-950/40">
                <div>+ id: String</div>
                <div>+ createdAt: DateTime</div>
                <div>+ updatedAt: DateTime</div>
              </div>
              <div className="p-3 text-[11px] font-mono text-slate-400 space-y-1">
                <div>+ touch(): void</div>
                <div># generateUuid(): String</div>
              </div>
            </div>

            {/* IRepository<T> */}
            <div className="bg-slate-900 border-2 border-blue-500/40 rounded-xl overflow-hidden shadow-lg">
              <div className="bg-blue-600/20 border-b border-blue-500/30 px-4 py-2 font-mono text-center">
                <span className="text-[10px] text-blue-300 block">&lt;&lt;interface&gt;&gt;</span>
                <span className="font-bold text-sm text-white">IRepository&lt;T extends BaseEntity&gt;</span>
              </div>
              <div className="p-3 text-[11px] font-mono text-slate-300 space-y-1">
                <div>+ save(entity: T): T</div>
                <div>+ findById(id: String): Optional&lt;T&gt;</div>
                <div>+ findAll(): List&lt;T&gt;</div>
                <div>+ findAllPaged(pageable: IPageable): IPage&lt;T&gt;</div>
                <div>+ deleteById(id: String): boolean</div>
                <div>+ count(): number</div>
              </div>
            </div>

            {/* AbstractRepository<T> */}
            <div className="bg-slate-900 border-2 border-purple-500/40 rounded-xl overflow-hidden shadow-lg">
              <div className="bg-purple-600/20 border-b border-purple-500/30 px-4 py-2 font-mono text-center">
                <span className="text-[10px] text-purple-300 block">&lt;&lt;abstract class&gt;&gt;</span>
                <span className="font-bold text-sm text-white">AbstractRepository&lt;T&gt;</span>
              </div>
              <div className="p-3 text-[11px] font-mono text-slate-300 space-y-1 border-b border-slate-800 bg-slate-950/40">
                <div># storageKey: String</div>
                <div># items: Map&lt;String, T&gt;</div>
              </div>
              <div className="p-3 text-[11px] font-mono text-slate-400 space-y-1">
                <div>+ stream(): Stream&lt;T&gt;</div>
                <div>+ findAllPaged(pageable): IPage&lt;T&gt;</div>
                <div># abstract deserialize(raw): T</div>
              </div>
            </div>
          </div>
        </div>

        {/* Katman 2: Model Hiyerarşisi (Kalıtım / Inheritance) */}
        <div>
          <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>2. Varlık & Kalıtım Modeli (Inheritance: User & Account)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* User */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow">
              <div className="bg-slate-800 px-4 py-2 font-mono text-center border-b border-slate-700">
                <span className="text-[10px] text-slate-400 block">&lt;&lt;entity extends BaseEntity&gt;&gt;</span>
                <span className="font-bold text-sm text-white">User</span>
              </div>
              <div className="p-3 text-[11px] font-mono text-slate-300 space-y-0.5 border-b border-slate-800">
                <div>+ tcNo: String</div>
                <div>+ fullName: String</div>
                <div>+ email: String</div>
                <div>+ passwordHash: String (Maskeli)</div>
                <div>+ role: UserRole</div>
                <div>+ isBlocked: boolean</div>
                <div>+ failedLoginAttempts: number</div>
                <div>+ adminId?: String (FK 1:N)</div>
              </div>
              <div className="p-3 text-[11px] font-mono text-emerald-400 space-y-0.5">
                <div>+ incrementFailedAttempts(): int</div>
                <div>+ resetFailedAttempts(): void</div>
                <div>+ unblock(): void</div>
              </div>
            </div>

            {/* CustomerUser & AdminUser */}
            <div className="space-y-4">
              <div className="bg-slate-900 border border-emerald-500/30 rounded-xl overflow-hidden shadow">
                <div className="bg-emerald-950/40 px-3 py-1.5 font-mono text-center border-b border-emerald-500/20">
                  <span className="text-[9px] text-emerald-300 block">&lt;&lt;extends User&gt;&gt;</span>
                  <span className="font-bold text-xs text-white">CustomerUser</span>
                </div>
                <div className="p-2.5 text-[10px] font-mono text-slate-300">
                  <div>+ preferredBranch: String</div>
                </div>
              </div>

              <div className="bg-slate-900 border border-amber-500/30 rounded-xl overflow-hidden shadow">
                <div className="bg-amber-950/40 px-3 py-1.5 font-mono text-center border-b border-amber-500/20">
                  <span className="text-[9px] text-amber-300 block">&lt;&lt;extends User&gt;&gt;</span>
                  <span className="font-bold text-xs text-white">AdminUser</span>
                </div>
                <div className="p-2.5 text-[10px] font-mono text-slate-300">
                  <div>+ staffCode: String</div>
                  <div>+ department: String</div>
                </div>
              </div>
            </div>

            {/* Account */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow">
              <div className="bg-slate-800 px-4 py-2 font-mono text-center border-b border-slate-700">
                <span className="text-[10px] text-slate-400 block">&lt;&lt;entity extends BaseEntity&gt;&gt;</span>
                <span className="font-bold text-sm text-white">Account</span>
              </div>
              <div className="p-3 text-[11px] font-mono text-slate-300 space-y-0.5 border-b border-slate-800">
                <div>+ userId: String (FK)</div>
                <div>+ accountNumber: String</div>
                <div>+ iban: String</div>
                <div>+ balance: double</div>
                <div>+ accountType: AccountType</div>
                <div>+ cardNumber: String</div>
                <div>+ cardPinHash: String</div>
                <div>+ dailyWithdrawLimit: double</div>
              </div>
              <div className="p-3 text-[11px] font-mono text-amber-300 space-y-0.5">
                <div>+ canWithdraw(amt): Validation</div>
                <div>+ deposit(amt): void</div>
                <div>+ withdraw(amt): void</div>
                <div>+ maskCardNumber(): String</div>
              </div>
            </div>

            {/* Transaction & AuditLog */}
            <div className="space-y-4">
              <div className="bg-slate-900 border border-sky-500/30 rounded-xl overflow-hidden shadow">
                <div className="bg-sky-950/40 px-3 py-1.5 font-mono text-center border-b border-sky-500/20">
                  <span className="text-[9px] text-sky-300 block">&lt;&lt;entity&gt;&gt;</span>
                  <span className="font-bold text-xs text-white">Transaction</span>
                </div>
                <div className="p-2.5 text-[10px] font-mono text-slate-300 space-y-0.5">
                  <div>+ transactionNumber: String</div>
                  <div>+ amount: double</div>
                  <div>+ transactionType: Enum</div>
                  <div>+ balanceAfter: double</div>
                  <div>+ targetIban?: String</div>
                </div>
              </div>

              <div className="bg-slate-900 border border-purple-500/30 rounded-xl overflow-hidden shadow">
                <div className="bg-purple-950/40 px-3 py-1.5 font-mono text-center border-b border-purple-500/20">
                  <span className="text-[9px] text-purple-300 block">&lt;&lt;entity&gt;&gt;</span>
                  <span className="font-bold text-xs text-white">AuditLog & LoginSession</span>
                </div>
                <div className="p-2.5 text-[10px] font-mono text-slate-300 space-y-0.5">
                  <div>+ action: LogAction</div>
                  <div>+ level: LogLevel</div>
                  <div>+ ipAddress: String</div>
                  <div>+ details: String</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Katman 3: Tasarım Desenleri (Design Patterns) */}
        <div>
          <h3 className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span>3. Kullanılan Tasarım Desenleri (GoF Design Patterns)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-amber-400 font-mono">1. FACTORY PATTERN</div>
              <h4 className="font-semibold text-white text-sm">TransactionFactory</h4>
              <p className="text-xs text-slate-400">
                Deposit, Withdraw ve Transfer işlemlerini standart parametrelerle ve masraf stratejisiyle tek noktadan üretir.
              </p>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-emerald-400 font-mono">2. STRATEGY PATTERN</div>
              <h4 className="font-semibold text-white text-sm">IFeeStrategy</h4>
              <p className="text-xs text-slate-400">
                Standart, FAST Transfer ve VIP tarife stratejilerini çalışma zamanında (runtime) polimorfik olarak hesaplar.
              </p>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-sky-400 font-mono">3. OBSERVER PATTERN</div>
              <h4 className="font-semibold text-white text-sm">BankEventSubject</h4>
              <p className="text-xs text-slate-400">
                Her işlem, bloke ve giriş olayında audit logger, ATM ekranı ve bildirim sistemlerini anlık haberdar eder.
              </p>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-purple-400 font-mono">4. SINGLETON & REPO</div>
              <h4 className="font-semibold text-white text-sm">DatabaseManager</h4>
              <p className="text-xs text-slate-400">
                Tüm veritabanı tablolarını tekil (Singleton) koordinatör altında toplar; Generic Repository deseni uygular.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
