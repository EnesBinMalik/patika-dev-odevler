import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Share2, Copy, Check, Sparkles, Download, Maximize2, X, Terminal, Shield, Layers, GitBranch, Cpu } from 'lucide-react';

interface LinkedInShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LinkedInShareModal: React.FC<LinkedInShareModalProps> = ({ isOpen, onClose }) => {
  const [selectedModule, setSelectedModule] = useState<'mod1' | 'mod2' | 'mod3' | 'mod4' | 'arch'>('mod1');
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const moduleData = {
    mod1: {
      title: 'Modül 1: Müşteri ve Hesap Yönetimi (OOP & Encapsulation)',
      badge: 'OOP & POLYMORPHISM',
      csharpCode: `// Account.cs - Kapsülleme ve Polimorfizm
public abstract class Account {
    // Encapsulation: Bakiye dışarıya private korumalıdır
    private decimal _balance;
    public decimal Balance => _balance;

    public virtual void Deposit(decimal amount) {
        if (amount <= 0) throw new InvalidAmountException();
        _balance += amount;
    }

    public abstract bool Withdraw(decimal amount, string note);
}

// CheckingAccount.cs - KMH Limiti Desteği
public class CheckingAccount : Account {
    public decimal OverdraftLimit { get; private set; } = 15000m;
    public override bool Withdraw(decimal amount, string note) {
        if (amount > Balance + OverdraftLimit) return false;
        // Güvenli çekim mantığı...
        return true;
    }
}`,
      terminalOutput: `C:\\BankingSystem> accounts
+-----------------+-----------------------+----------+--------------------+
| HESAP NO        | MÜŞTERİ               | TÜR      | BAKİYE             |
+-----------------+-----------------------+----------+--------------------+
| TR-1001-CHK     | Enes Öztürk           | Vadesiz  | 145.000,00 TRY     |
| TR-1002-SAV     | Enes Öztürk           | Vadeli   | 350.000,00 TRY     |
+-----------------+-----------------------+----------+--------------------+
[✓] Encapsulation Korundu: Doğrudan _balance erişimi engellendi.`,
      highlights: [
        'Soyut (Abstract) Account sınıfı ile güçlü polimorfik altyapı',
        'Private bakiye alanı ile kapsülleme (Encapsulation) güvencesi',
        'CheckingAccount (KMH/Overdraft) ve SavingsAccount (Mevduat Getirisi)',
      ],
      linkedInPost: `🚀 C# ve .NET Core ile "Akıllı Bankacılık ve Kredi Risk Analiz Sistemi" geliştirdim! 🏦

Geliştirdiğim bu projenin 1. Modülünde Nesne Yönelimli Programlama (OOP) ve Kapsülleme (Encapsulation) ilkelerini gerçek hayattaki finansal senaryolarla buluşturdum:

🔹 Temel Mimari:
• Soyut (abstract) 'Account' temel sınıfı üzerinden vadesiz ('CheckingAccount') ve vadeli ('SavingsAccount') hesapların polimorfik olarak yönetilmesi.
• Kapsülleme (Encapsulation): '_balance' alanı private tutularak doğrudan bakiye manipülasyonu derleme seviyesinde engellendi. Tüm işlemler iş kuralları denetimli 'Deposit()' ve 'Withdraw()' metotlarıyla çalışıyor.
• KMH (Kredili Mevduat Hesabı) ile eksi bakiye toleransı ve vadeli mevduatta dinamik faiz tahakkuk mekanizması.

Mimari: Clean Architecture (.NET 9)
Geliştirici: Enes Öztürk

Projenin diğer modüllerini (Stack/Queue bellek yönetimi, Kredi Risk Analiz Algoritması ve Git/File Loglama) sonraki gönderilerde paylaşacağım. Görüş ve önerilerinizi bekliyorum! 👇

#csharp #dotnet #cleanarchitecture #oop #softwareengineering #fintech #yazılımgeliştirme #developer`,
    },

    mod2: {
      title: 'Modül 2: İşlem Geçmişi ve Bellek Yönetimi (Stack & Queue Veri Yapıları)',
      badge: 'DATA STRUCTURES (LIFO & FIFO)',
      csharpCode: `// TransactionStack.cs - LIFO Geri Al (Undo) Motoru
public class TransactionStack {
    private readonly Stack<BankTransaction> _undoHistory = new();

    public void RecordTransaction(BankTransaction tx) => _undoHistory.Push(tx);

    public BankTransaction UndoLastTransaction(Dictionary<string, Account> registry) {
        if (_undoHistory.Count == 0) throw new InvalidOperationException();
        var lastTx = _undoHistory.Pop();
        // İşlemi tersine çevir (Rollback)
        lastTx.Reverse(registry);
        return lastTx;
    }
}

// BranchTellerQueue.cs - FIFO Şube Vezne Sırası
public class BranchTellerQueue {
    private readonly Queue<QueueTicket> _queue = new();
    public void EnqueueTicket(QueueTicket ticket) => _queue.Enqueue(ticket);
    public QueueTicket? CallNextCustomer() => _queue.Dequeue();
}`,
      terminalOutput: `C:\\BankingSystem> undo
[GERİ ALINDI / LIFO ROLLBACK]
İptal Edilen İşlem: TX-903 (TransferOut - 10.000,00 TL)
Açıklama: TR-1001-CHK -> TR-2001-CHK transferi başarıyla geri alındı.
Yığıt Derinliği: 2 | Bellek Modeli: Stack<BankTransaction>

C:\\BankingSystem> queue-call 1
[KUYRUK - DEQUEUE / FIFO] VIP-101 numaralı Enes Öztürk Vezne #1 masasına davet edildi.`,
      highlights: [
        'Finansal transferleri LIFO (Last-In-First-Out) mantığıyla saklayan Stack yapısı',
        'Tek tıkla atomik işlem iptali (Undo / Rollback) mekanizması',
        'FIFO (First-In-First-Out) kuyruk ile VIP öncelikli vezne gişe yönetimi',
      ],
      linkedInPost: `⚡ Veri Yapılarını (Stack & Queue) Gerçek Hayat Finans Senaryosunda Nasıl Kullandım? 🧠

Akıllı Bankacılık projemin 2. Modülünde temel bilgisayar bilimleri veri yapılarını .NET ekosisteminde modelledim:

🥞 1. Yığıt (Stack - LIFO) & Geri Al (Undo / Rollback):
Müşterinin yaptığı para yatırma, çekme ve virman işlemleri 'Stack<BankTransaction>' yapısında tutulur. Hatalı bir işlem olduğunda 'Pop()' metoduyla son işlem çağrılır ve hesap bakiyeleri otomatik olarak önceki durumuna geri döndürülür.

🎟️ 2. Kuyruk (Queue - FIFO) & Şube Vezne Yönetimi:
Şubeye gelen müşteriler 'Queue<QueueTicket>' yapısıyla sıraya alınır ('Enqueue'). Vezne boşaldığında ilk gelen müşteri ilk işleme alınır ('Dequeue'). VIP müşteriler için çift kuyruklu öncelik algoritması devrededir.

Geliştirici: Enes Öztürk
Teknolojiler: C#, .NET 9, Data Structures

Siz finans veya e-ticaret projelerinizde Undo mimarisini nasıl kurguluyorsunuz?

#datastructures #csharp #dotnet #algorithm #stack #queue #cleanarchitecture #softwareengineering`,
    },

    mod3: {
      title: 'Modül 3: Kredi Faiz Hesaplama ve Risk Analiz Motoru (C# Algoritmaları)',
      badge: 'FINANCIAL ALGORITHMS & DTI',
      csharpCode: `// CreditRiskEngine.cs - Dinamik Faiz & BDDK DTI Karar Motoru
public class CreditRiskEngine {
    private const decimal MaxAllowableDti = 0.50m; // Maksimum %50 Borç/Gelir (BDDK)

    public CreditEvaluationResult EvaluateLoanApplication(CreditCalculationInput input) {
        decimal projectedDti = (input.ExistingDebt + monthlyPayment) / input.MonthlyIncome;

        // Findeks Skor Kategorizasyonu & Dinamik Risk Primi
        decimal riskPremium = input.FindexScore switch {
            >= 1500 => -0.40m, // AAA - İndirimli
            >= 1300 => 0.00m,  // AA
            >= 1100 => 0.20m,  // A
            >= 950  => 0.65m,  // BBB
            _       => 2.00m   // Otomatik Red
        };

        bool isApproved = projectedDti <= MaxAllowableDti && input.FindexScore >= 950;
        return new CreditEvaluationResult { IsApproved = isApproved, Rating = "AAA" };
    }
}`,
      terminalOutput: `C:\\BankingSystem> risk 150000 24
=== KREDİ FAİZ HESAPLAMA VE RİSK ANALİZ MOTORU ===
Müşteri: Enes Öztürk | Findeks Notu: 1780 (Mükemmel AAA)
Talep Tutarı: 150.000,00 TL | Vade: 24 Ay
Aylık Faiz Oranı: %3.29 (Baz %3.69 - Risk İndirimi %0.40)
Aylık Taksit: 9.840,00 TL (KKDF + BSMV Vergileri Dahil)
Borç/Gelir Oranı (DTI): %19.3 (BDDK Sınırı: %50)
SONUÇ: [ONAYLANDI] -> Findeks skoru ve DTI oranı mevzuata uygundur.`,
      highlights: [
        'BDDK standartlarında %50 Borç/Gelir (DTI) yasal sınır denetimi',
        'Findeks skoruna (1-1900) göre dinamik risk marjı ve faiz hesaplama',
        'Annuity formülü + KKDF (%15) ve BSMV (%5) vergi simülasyonu',
      ],
      linkedInPost: `📊 Bankacılıkta Kredi Onay Algoritmaları Nasıl Çalışır? C# ile Kredi Risk Analiz Motoru 💳

.NET Core Akıllı Bankacılık projeme eklediğim 3. Modül: Kredi Faiz Hesaplama ve Risk Analiz Motoru!

Geliştirdiğim finansal algoritmanın çalışma prensibi:
1️⃣ BDDK Mevzuatı & DTI (Debt-to-Income / Borç-Gelir Oranı):
Müşterinin talep ettiği kredi taksiti ve mevcut borçlarının toplamı aylık net gelirinin %50'sini aşarsa başvuru otomatik olarak engellenir veya şartlı onaya yönlendirilir.

2️⃣ Findeks Skorlaması & Dinamik Faiz:
Statik faiz oranları yerine müşterinin risk puanına (AAA'dan C'ye) göre dinamik faiz katsayısı uygulanır. Yüksek skora sahip müşteriler faiz indirimi alırken, riskli müşteriler risk primiyle fiyatlandırılır.

3️⃣ Amortisman & Vergi Formülasyonu:
Aylık taksit tutarı finansal annuity formülüyle hesaplanır ve KKDF (%15) ile BSMV (%5) yasal vergileri dahil edilir.

Geliştirici: Enes Öztürk | .NET 9 Clean Architecture

#csharp #dotnet #fintech #riskmanagement #algorithms #banking #softwarearchitecture`,
    },

    mod4: {
      title: 'Modül 4: Dosyalama, Loglama ve GIT Versiyon Takip Sistemi',
      badge: 'FILE I/O & GIT VERSIONING',
      csharpCode: `// FileAuditLogger.cs - TXT & JSON Stream Logging
public class FileAuditLogger {
    private readonly string _txtPath = "C:\\\\BankingSystem\\\\Logs\\\\bank_audit_log.txt";
    private readonly string _jsonPath = "C:\\\\BankingSystem\\\\Logs\\\\transactions_export.json";

    public async Task LogAuditAsync(string level, string module, string message) {
        string logLine = $"[{DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}] [{level}] [{module}] {message}";
        await File.AppendAllTextAsync(_txtPath, logLine + Environment.NewLine);

        // JSON formatında yapısal audit kaydı
        var entry = new { Timestamp = DateTime.UtcNow, Level = level, Message = message, Author = "Enes Öztürk" };
        // Flush to JSON file...
    }
}`,
      terminalOutput: `C:\\BankingSystem> git-log
* 7f9a2b1 (main) feat(domain): implement encapsulation and polymorphic accounts
  Author: Enes Öztürk <enes.ozturk@bank.dev> | 2025-05-09
* c4e81d0 (main) feat(stack): implement LIFO transaction stack with rollback
  Author: Enes Öztürk <enes.ozturk@bank.dev> | 2025-05-09
* 8a3d5e2 (main) feat(queue): add FIFO branch teller ticket manager
  Author: Enes Öztürk <enes.ozturk@bank.dev> | 2025-05-10
* e2b904f (main) feat(risk-engine): build dynamic interest rate algorithm
  Author: Enes Öztürk <enes.ozturk@bank.dev> | 2025-05-10

[✓] Dosyalama: bank_audit_log.txt ve transactions_export.json başarıyla güncellendi.`,
      highlights: [
        'Eşzamanlı .txt ve yapısal .json formatlarında güvenli audit loglama',
        'Kurumsal Git versiyon takip ağacı ve commit geçmişi',
        'Her işlemde geliştirici imzası ve UTC zaman damgası takibi',
      ],
      linkedInPost: `📁 Finansal Sistemlerde Denetim İzi (Audit Logging) ve Git Versiyonlama 🛡️

C# .NET 9 Akıllı Bankacılık projemin 4. Modülü: Dosyalama ve Loglama Altyapısı!

Finansal uygulamalarda gerçekleştirilen her hareketin silinemez ve geriye dönük izlenebilir olması esastır. Bu modülde:

✔️ Eşzamanlı Dosyalama (File Operations):
Her mevduat, çekim ve kredi başvurusu 'bank_audit_log.txt' dosyasına timestamp'li olarak loglanır. Aynı zamanda 'transactions_export.json' dosyasına yapısal şema ile serialize edilir.

✔️ Git Entegrasyonu & Versiyon Takibi:
Katmanlı mimarinin evrimi her aşamada anlamlı Git commit mesajları ile versiyonlanmıştır (Clean Commit History).

Geliştirici İmzası: Enes Öztürk | Software Engineer & .NET Developer

#csharp #dotnet #logging #git #cleanarchitecture #softwaredevelopment #security #fintech`,
    },

    arch: {
      title: 'Tüm Katmanlı Mimari Şeması (Clean Architecture & .NET 9)',
      badge: 'CLEAN ARCHITECTURE OVERVIEW',
      csharpCode: `// Çözüm Mimarisi Bağımlılık Ağacı:
//
// [ SmartBanking.ConsoleUI ]  (Spectre.Console CLI Presentation)
//          │
//          ▼
// [ SmartBanking.Application ] (Use Cases, CreditRiskEngine, DTOs)
//          │
//          ▼
// [ SmartBanking.Domain ]      (Entities, Account, Stack, Queue)
//          ▲
//          │
// [ SmartBanking.Infrastructure ] (FileAuditLogger, JSON Stream)
//
// Kural: Domain hiçbir dış katmana bağımlı değildir (Pure C# Business Rules)`,
      terminalOutput: `C:\\BankingSystem> dotnet run
Building solution 'SmartBanking.sln'...
SmartBanking.Domain -> bin\\Debug\\net9.0\\SmartBanking.Domain.dll
SmartBanking.Application -> bin\\Debug\\net9.0\\SmartBanking.Application.dll
SmartBanking.Infrastructure -> bin\\Debug\\net9.0\\SmartBanking.Infrastructure.dll
SmartBanking.ConsoleUI -> bin\\Debug\\net9.0\\SmartBanking.ConsoleUI.dll

Build succeeded. 0 Warning(s), 0 Error(s).
Mimar: Enes Öztürk | .NET 9 Core Clean Architecture`,
      highlights: [
        'Dört ayrık katman: Domain, Application, Infrastructure ve ConsoleUI',
        'Dependency Inversion prensibi ile dışa bağımsız saf iş kuralları',
        '.NET 9 ve modern C# 12 sözdizimi ile kurumsal ölçeklenebilirlik',
      ],
      linkedInPost: `🏛️ .NET 9 ile Temiz Mimari (Clean Architecture) ve Konsol Otomasyonu! 🚀

Bir süredir üzerinde çalıştığım devasa "Akıllı Bankacılık ve Kredi Risk Analiz Sistemi" projemin mimari tasarımını paylaşmaktan mutluluk duyuyorum!

Katman Yapısı:
1️⃣ SmartBanking.Domain: Temel varlıklar (Customer, Account), soyut sınıflar, kapsülleme ve saf veri yapıları (Stack & Queue). Sıfır dış kütüphane bağımlılığı!
2️⃣ SmartBanking.Application: Kredi risk skorlama algoritmaları, BDDK DTI kontrolleri ve servis kontratları.
3️⃣ SmartBanking.Infrastructure: Disk dosya operasyonları (.txt / .json) ve Git audit loglama.
4️⃣ SmartBanking.ConsoleUI: Spectre.Console tarzı etkileşimli terminal arayüzü ve IoC container.

Geliştirici: Enes Öztürk
Stack: C# 12, .NET 9 Core, OOP, Data Structures

Detaylı geri bildirimlerinizi yorumlarda paylaşabilirsiniz! 👇

#csharp #dotnet #cleanarchitecture #solid #softwarearchitecture #backend #softwareengineer`,
    },
  };

  const currentMod = moduleData[selectedModule];

  const handleCopyPost = () => {
    navigator.clipboard.writeText(currentMod.linkedInPost);
    setCopiedText(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div
        className={`bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all flex flex-col ${
          isFullscreenPreview ? 'w-full h-full max-w-none rounded-none' : 'max-w-5xl w-full max-h-[92vh]'
        }`}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white font-mono">
              LinkedIn Paylaşım & Ekran Görüntüsü Modu
            </h3>
            <span className="text-xs text-slate-400 hidden sm:inline font-mono">
              (Geliştirici: Enes Öztürk)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreenPreview(!isFullscreenPreview)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Tam ekran önizleme modunu aç/kapat"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors text-lg font-bold"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Module Selector Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedModule('mod1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-colors ${
                selectedModule === 'mod1'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Modül 1: OOP & Encapsulation
            </button>
            <button
              onClick={() => setSelectedModule('mod2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-colors ${
                selectedModule === 'mod2'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Modül 2: Stack & Queue
            </button>
            <button
              onClick={() => setSelectedModule('mod3')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-colors ${
                selectedModule === 'mod3'
                  ? 'bg-purple-500 text-white font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Modül 3: Kredi Risk Motoru
            </button>
            <button
              onClick={() => setSelectedModule('mod4')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-colors ${
                selectedModule === 'mod4'
                  ? 'bg-yellow-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Modül 4: Dosyalama & Git
            </button>
            <button
              onClick={() => setSelectedModule('arch')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-colors ${
                selectedModule === 'arch'
                  ? 'bg-blue-500 text-white font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Tüm Katmanlı Mimari
            </button>
          </div>

          {/* SCREENSHOT FRAME (THIS IS THE HERO COMPONENT TO SCREENSHOT) */}
          <div
            ref={cardRef}
            className="rounded-2xl border-2 border-slate-700 bg-gradient-to-br from-slate-950 via-[#0a0f18] to-slate-900 p-6 shadow-2xl relative space-y-5"
          >
            {/* Screenshot Header with Developer Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-slate-950 font-bold font-mono text-lg shadow-lg">
                  EÖ
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">Enes Öztürk</span>
                    <span className="text-xs font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                      .NET Developer
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Akıllı Bankacılık ve Kredi Risk Analiz Sistemi · Clean Architecture (.NET 9)
                  </p>
                </div>
              </div>

              {/* Window Controls Visual */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                <div className="w-3 h-3 rounded-full bg-rose-500/90" />
                <div className="w-3 h-3 rounded-full bg-amber-500/90" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/90" />
              </div>
            </div>

            {/* Module Title Banner */}
            <div className="space-y-1">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                {currentMod.badge}
              </span>
              <h2 className="text-xl font-extrabold text-white tracking-tight">{currentMod.title}</h2>
            </div>

            {/* Code Snippet & Live Terminal Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Code Snippet */}
              <div className="rounded-xl border border-slate-800 bg-[#0d1117] overflow-hidden">
                <div className="px-3.5 py-2 bg-[#161b22] border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>C# 12 Source Code</span>
                  <span className="text-emerald-400">Enes Öztürk</span>
                </div>
                <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[280px] leading-relaxed">
                  <code>{currentMod.csharpCode}</code>
                </pre>
              </div>

              {/* Terminal Execution Output */}
              <div className="rounded-xl border border-slate-800 bg-[#0a0d13] overflow-hidden">
                <div className="px-3.5 py-2 bg-[#121620] border-b border-slate-800 text-[11px] font-mono text-cyan-400 flex items-center justify-between">
                  <span>Canlı Konsol Çıktısı (Spectre.Console)</span>
                  <span className="text-slate-400">net9.0</span>
                </div>
                <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-[280px] leading-relaxed">
                  <code>{currentMod.terminalOutput}</code>
                </pre>
              </div>
            </div>

            {/* Architectural Highlights */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-xs font-mono text-slate-400 block mb-2 font-bold">
                Öne Çıkan Mimari Yetenekler:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {currentMod.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-300 font-sans">
                    <span className="text-emerald-400 font-bold font-mono">✓</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Signature Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-mono text-slate-500">
              <span>SmartBanking.Core · Enes Öztürk İmzalı</span>
              <span>#csharp #dotnet #cleanarchitecture #oop #datastructures</span>
            </div>
          </div>

          {/* LinkedIn Post Copy Area */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h4 className="text-xs font-bold text-white font-mono">
                  LinkedIn İçin Hazır Gönderi Metni
                </h4>
              </div>

              <button
                onClick={handleCopyPost}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg font-mono transition-colors shadow-sm"
              >
                {copiedText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedText ? 'Metin Kopyalandı!' : 'LinkedIn Metnini Kopyala'}</span>
              </button>
            </div>

            <textarea
              readOnly
              rows={6}
              value={currentMod.linkedInPost}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-sans text-slate-300 leading-relaxed outline-none resize-none focus:border-blue-500"
            />
            <p className="text-[11px] text-slate-500">
              💡 İpucu: Yukarıdaki görsel kartın ekran görüntüsünü almak için Windows'ta <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-300">Win + Shift + S</kbd> veya Mac'te <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-300">Cmd + Shift + 4</kbd> tuşlarını kullanabilirsiniz. Ardından "LinkedIn Metnini Kopyala" ile doğrudan LinkedIn'e yapıştırabilirsiniz!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
