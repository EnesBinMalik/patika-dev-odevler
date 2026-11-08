/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proje: Öztürk Bank ATM & Çekirdek Bankacılık Sistemi
 * Geliştirici: Enes Öztürk
 *
 * S.O.L.I.D Prensipleri, Clean Code & Spring Boot Katmanlı Mimari Dokümantasyonu
 */

import React from 'react';
import { X, Award, CheckCircle, ShieldCheck, Terminal, Cpu } from 'lucide-react';

interface ArchitectureDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureDocsModal: React.FC<ArchitectureDocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                S.O.L.I.D &amp; Temiz Kod (Clean Code) Mimarisi
                <span className="text-xs font-normal text-amber-400 px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/20">
                  Enes Öztürk İmzalı
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Spring Boot Katmanlı Tasarımı, Stream API, Optional ve Kurumsal Güvenlik Standartları
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

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* S.O.L.I.D Principles */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              S.O.L.I.D Prensipleri Nasıl Uygulandı?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-amber-400 font-bold font-mono">S - Single Responsibility (SRP):</span>
                <p className="text-slate-400">
                  Her sınıf tek bir sorumluluğa sahiptir. <code>AuthService</code> yalnızca kimlik denetiminden, <code>AccountService</code> para işlemlerinden, <code>FileIoService</code> dosya/dekont üretiminden sorumludur.
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-amber-400 font-bold font-mono">O - Open/Closed (OCP):</span>
                <p className="text-slate-400">
                  <code>WithdrawalValidationStrategy</code> ve <code>TransferValidationStrategy</code> sınıfları Strategy Deseni ile kurulmuştur; yeni çekim kuralları mevcut kodu bozmadan eklenebilir.
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-amber-400 font-bold font-mono">L - Liskov Substitution (LSP):</span>
                <p className="text-slate-400">
                  <code>CheckingAccount</code> ve <code>SavingsAccount</code> sınıfları, taban sınıf <code>AbstractAccount</code> yerine geçebilir ve beklenen hesap davranışını kırılmadan sürdürür.
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-amber-400 font-bold font-mono">I - Interface Segregation (ISP):</span>
                <p className="text-slate-400">
                  <code>IAccountOperations</code>, <code>IValidationStrategy</code> gibi arayüzler şişirilmemiş, yalnızca ilgili metotları barındıracak şekilde ayrılmıştır.
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 md:col-span-2">
                <span className="text-amber-400 font-bold font-mono">D - Dependency Inversion (DIP):</span>
                <p className="text-slate-400">
                  Üst seviye modüller alt seviye modüllere doğrudan sıkı sıkıya bağlı değildir. Servisler repository sözleşmeleri ve soyutlamalar üzerinden haberleşir.
                </p>
              </div>
            </div>
          </div>

          {/* Clean Code & Functional Features */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-400" />
              Stream API &amp; Optional Kullanımı
            </h3>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs space-y-2 text-slate-300">
              <div className="text-sky-400 font-semibold">// Java 8 Stream API ve Optional Simülasyonu</div>
              <div>
                <code>
                  Stream.of(accounts).filter(a =&gt; a.balance &gt; 1000).sorted((a,b) =&gt; b.balance - a.balance).collect();
                </code>
              </div>
              <div>
                <code>
                  this.repository.findUserById(id).orElseThrow(() =&gt; new AccountNotFoundException(id));
                </code>
              </div>
              <p className="text-slate-400 text-[11px] pt-1 font-sans">
                Tüm veri sorgulamalarında NullPointerException tehlikesini engelleyen <code>Optional&lt;T&gt;</code> yapısı ve zincirleme filtreleme sağlayan <code>Stream&lt;T&gt;</code> motoru kullanılmıştır.
              </p>
            </div>
          </div>

          {/* Enes Öztürk Official Signature */}
          <div className="p-5 bg-gradient-to-br from-amber-500/15 via-slate-900 to-amber-500/5 border border-amber-500/30 rounded-xl flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                PROJE ONAYI &amp; MİMARİ MÜHENDİSLİK İMZASI
              </div>
              <div className="text-lg font-bold text-slate-100">ENES ÖZTÜRK</div>
              <div className="text-xs text-slate-400">
                Çekirdek Bankacılık Sistemleri &amp; ATM Terminali Baş Mühendisi
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-300 text-xs font-medium">
              <CheckCircle className="w-4 h-4 text-amber-400" />
              S.O.L.I.D &amp; Clean Code Doğrulandı
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors text-xs font-medium"
          >
            Anladım, Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
