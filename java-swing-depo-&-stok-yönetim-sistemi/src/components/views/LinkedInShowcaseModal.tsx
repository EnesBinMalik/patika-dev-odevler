import React, { useState } from 'react';
import { SwingTheme } from '../../types/warehouse';
import {
  Share2,
  Copy,
  Check,
  X,
  Sparkles,
  ExternalLink,
  Award,
  Layers,
  Code2,
  Cpu,
  User,
  Terminal,
} from 'lucide-react';

interface LinkedInShowcaseModalProps {
  isOpen: boolean;
  theme: SwingTheme;
  onClose: () => void;
}

export const LinkedInShowcaseModal: React.FC<LinkedInShowcaseModalProps> = ({
  isOpen,
  theme,
  onClose,
}) => {
  const [copiedTR, setCopiedTR] = useState(false);
  const [copiedEN, setCopiedEN] = useState(false);

  if (!isOpen) return null;

  const isDark = theme === 'darcula';

  const linkedInPostTR = `🚀 Nesne yönelimli programlama prensiplerini ve Java Swing bileşenlerini kullanarak geliştirdiğim, katmanlı mimariye sahip kapsamlı depo ve stok yönetim otomasyonu!

Şirketlerin tedarik zinciri verimliliğini artırmak, kritik stok açıklarını önlemek ve depo giriş-çıkış operasyonlarını sıfır hata ile yönetebilmek adına uçtan uca masaüstü tabanlı bir kurumsal otomasyon sistemi geliştirdim.

🎯 Öne Çıkan Mimari & Teknik Başlıklar:
🔹 Nesne Yönelimli Programlama (OOP):
• Kalıtım (Inheritance): Soyut Product temel sınıfından türetilen PerishableProduct (Soğuk Hava Deposu), HazardousProduct (ADR Kimyasal) ve ElectronicProduct (ESD Korumalı) hiyerarşisi.
• Çok Biçimlilik (Polymorphism): Ürün tipine göre dinamik olarak hesaplanan depolama maliyeti katsayıları ve çalışma zamanında ezilen (Override) sevkiyat doğrulama kuralları.
• Kapsülleme (Encapsulation): Katı iş kuralı validasyonları, korumalı setter metotları ve yetersiz stok istisnası (InsufficientStockException).

🔹 Olay Güdümlü (Event-Driven) Uyarı Mekanizması:
• Observer Pattern kullanılarak geliştirilen StockAlertListener sistemi ile stoklar kritik eşik altına düştüğünde veya tükendiğinde Java Swing JOptionPane uyarı pencereleri anlık tetiklenir ve anlaşmalı tedarikçilere otomatik acil satın alma emri üretilir.

🔹 Masaüstü Arayüzü (Java Swing & AWT):
• JFrame, JMenuBar, JToolBar, JTable, JSplitPane ve JTree bileşenleri ile profesyonel masaüstü kullanıcı deneyimi.
• Darcula (IntelliJ Dark) ve Nimbus Look-and-Feel temaları.

Geliştirici: Enes Öztürk
#Java #JavaSwing #OOP #ObjectOrientedProgramming #CleanCode #SoftwareEngineering #Architecture #SupplyChain #WarehouseAutomation #JavaDeveloper`;

  const linkedInPostEN = `🚀 Comprehensive Warehouse, Inventory & Supply Chain Management System built with Java Swing & Advanced OOP Architecture!

"Nesne yönelimli programlama prensiplerini ve Java Swing bileşenlerini kullanarak geliştirdiğim, katmanlı mimariye sahip kapsamlı depo ve stok yönetim otomasyonu."

Key Technical Highlights:
• OOP Architecture: Full implementation of Inheritance, Polymorphism (dynamic dispatch storage calculation), and Encapsulation with business rule validations.
• Event-Driven Alert Engine: Observer Pattern for low-stock and out-of-stock events triggering automated supplier replenishment and Java Swing JOptionPane alerts.
• Layered Architecture: Clean separation of UI (Swing), Business Service, and Domain DAO tiers.

Authored by: Enes Öztürk
#Java #JavaSwing #OOP #SoftwareArchitecture #CleanCode #EnterpriseSoftware`;

  const handleCopyTR = () => {
    navigator.clipboard.writeText(linkedInPostTR);
    setCopiedTR(true);
    setTimeout(() => setCopiedTR(false), 2000);
  };

  const handleCopyEN = () => {
    navigator.clipboard.writeText(linkedInPostEN);
    setCopiedEN(true);
    setTimeout(() => setCopiedEN(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        role="dialog"
        className="w-full max-w-3xl max-h-[90vh] bg-[#22252a] text-slate-100 rounded-lg shadow-2xl border border-slate-700 overflow-hidden flex flex-col font-sans"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#1a1c20] border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold text-white">
              LinkedIn Proje Sunum Kartı & Enes Öztürk İmzası
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Developer Spotlight Card */}
          <div className="p-5 rounded-lg bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/30 flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-600/30 border-2 border-blue-400 flex items-center justify-center text-blue-300 font-bold text-xl shrink-0">
              EÖ
            </div>
            <div className="space-y-1 text-center md:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h3 className="text-base font-bold text-white">Enes Öztürk</h3>
                <span className="text-[11px] font-mono text-amber-300 px-2 py-0.5 rounded bg-amber-950/50 border border-amber-700/60">
                  Java & OOP Sistem Mimarı
                </span>
              </div>
              <blockquote className="text-xs text-slate-300 italic border-l-2 border-blue-500 pl-2.5 my-2">
                “Nesne yönelimli programlama prensiplerini ve Java Swing bileşenlerini kullanarak geliştirdiğim, katmanlı mimariye sahip kapsamlı depo ve stok yönetim otomasyonu.”
              </blockquote>
              <div className="text-[11px] text-slate-400 flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
                <span>Modüller: <strong>Java Swing, Sipariş Yönetim Sistemi, OOP, Java 101</strong></span>
                <span>·</span>
                <span>Mimari: <strong>3-Tier Layered Architecture & Observer Pattern</strong></span>
              </div>
            </div>
          </div>

          {/* Core Technical Highlights Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            <div className="p-3.5 rounded bg-[#1a1c20] border border-slate-800 space-y-1.5">
              <div className="font-bold text-blue-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> OOP Kalıtım & Çok Biçimlilik
              </div>
              <p className="text-slate-400 leading-relaxed">
                <code className="text-amber-300 font-mono">Product</code> soyut sınıfından türetilen <code className="text-cyan-300 font-mono">PerishableProduct</code> (SKT & Soğuk Hava Deposu) ve <code className="text-amber-300 font-mono">HazardousProduct</code> (ADR Kimyasal) sınıfları. Depolama maliyetleri çok biçimli (Polymorphic) metot ezme (<code className="text-emerald-300 font-mono">@Override</code>) ile dinamik işletilir.
              </p>
            </div>

            <div className="p-3.5 rounded bg-[#1a1c20] border border-slate-800 space-y-1.5">
              <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Event-Driven Otomatik Uyarı
              </div>
              <p className="text-slate-400 leading-relaxed">
                Stok miktarı kritik eşiğin altına düştüğünde veya tükendiğinde <code className="text-purple-300 font-mono">StockAlertListener</code> arayüzü ile Swing <code className="text-red-300 font-mono">JOptionPane</code> uyarı penceresi tetiklenir ve anlaşmalı tedarikçiye anında satın alma siparişi oluşturulur.
              </p>
            </div>
          </div>

          {/* LinkedIn Post Copyable Text Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span>Hazır LinkedIn Paylaşım Metni (Türkçe):</span>
              </label>
              <button
                onClick={handleCopyTR}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                {copiedTR ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>LinkedIn Gönderisini Kopyala</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              readOnly
              rows={8}
              value={linkedInPostTR}
              className="w-full p-3 rounded bg-[#16181b] border border-slate-700 text-slate-300 font-mono text-[11px] leading-relaxed outline-hidden focus:border-blue-500"
            />
          </div>

          {/* English Version Option */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>English Portfolio Presentation Draft:</span>
              </label>
              <button
                onClick={handleCopyEN}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs transition-colors"
              >
                {copiedEN ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy English Post</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              readOnly
              rows={5}
              value={linkedInPostEN}
              className="w-full p-3 rounded bg-[#16181b] border border-slate-700 text-slate-300 font-mono text-[11px] leading-relaxed outline-hidden"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#1a1c20] border-t border-slate-800 text-xs">
          <span className="text-slate-400">
            İmza: <strong className="text-slate-200">Enes Öztürk</strong> · Java Swing & OOP Mimarisi
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
