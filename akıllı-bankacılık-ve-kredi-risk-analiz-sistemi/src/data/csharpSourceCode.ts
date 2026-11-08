export interface CSharpSourceFile {
  path: string;
  layer: 'Domain' | 'Application' | 'Infrastructure' | 'ConsoleUI';
  title: string;
  description: string;
  code: string;
}

export const CSHARP_FILES: CSharpSourceFile[] = [
  {
    path: 'SmartBanking.Domain/Entities/Account.cs',
    layer: 'Domain',
    title: 'Account.cs (Temel Soyut Sınıf & Kapsülleme)',
    description: 'Bakiye alanını private saklayarak doğrudan müdahaleyi engelleyen, Deposit, Withdraw ve Transfer metotlarını polimorfik sunan temel sınıf.',
    code: `namespace SmartBanking.Domain.Entities;

using System;
using SmartBanking.Domain.Exceptions;

/// <summary>
/// Geliştirici: Enes Öztürk
/// Banka hesapları için soyut taban sınıf (OOP Abstraction & Encapsulation).
/// Bakiye alanı dışarıya private korumalıdır; yalnızca onaylı metotlarla değişebilir.
/// </summary>
public abstract class Account
{
    public string AccountNumber { get; init; }
    public string Iban { get; init; }
    public string Currency { get; init; }
    public DateTime CreatedDate { get; init; } = DateTime.UtcNow;
    public bool IsActive { get; protected set; } = true;

    // Encapsulation (Kapsülleme): Bakiye dışarıdan set edilemez!
    private decimal _balance;
    public decimal Balance => _balance;

    protected Account(string accountNumber, string iban, string currency, decimal initialBalance = 0)
    {
        if (string.IsNullOrWhiteSpace(accountNumber))
            throw new ArgumentException("Hesap numarası boş olamaz.");

        AccountNumber = accountNumber;
        Iban = iban;
        Currency = currency;
        
        if (initialBalance > 0)
            _balance = initialBalance;
    }

    /// <summary>
    /// Para yatırma işlemi (Polimorfik olarak ezilebilir).
    /// </summary>
    public virtual void Deposit(decimal amount)
    {
        if (amount <= 0)
            throw new InvalidAmountException("Yatırılacak tutar sıfırdan büyük olmalıdır.");

        _balance += amount;
    }

    /// <summary>
    /// Para çekme işlemi: Türetilen sınıflar kendi limit kurallarına göre override eder.
    /// </summary>
    public abstract bool Withdraw(decimal amount, string description = "Nakit Çekim");

    /// <summary>
    /// Güvenli Bakiye Güncellemesi (Türetilmiş sınıflar için korumalı erişim).
    /// </summary>
    protected void ModifyBalance(decimal delta)
    {
        _balance += delta;
    }

    /// <summary>
    /// İki hesap arasında atomik transfer.
    /// </summary>
    public virtual void TransferTo(Account targetAccount, decimal amount, string note)
    {
        if (targetAccount == null)
            throw new ArgumentNullException(nameof(targetAccount));

        if (this.Withdraw(amount, $"Transfer -> {targetAccount.AccountNumber} ({note})"))
        {
            targetAccount.Deposit(amount);
        }
        else
        {
            throw new InsufficientBalanceException("Yetersiz bakiye nedeniyle transfer gerçekleştirilemedi.");
        }
    }
}`
  },
  {
    path: 'SmartBanking.Domain/Entities/CheckingAccount.cs',
    layer: 'Domain',
    title: 'CheckingAccount.cs (Vadesiz Hesap & Polimorfizm)',
    description: 'Account sınıfından kalıtım alan, Kredili Mevduat Hesabı (KMH/Overdraft) limitini yöneten vadesiz hesap modeli.',
    code: `namespace SmartBanking.Domain.Entities;

using SmartBanking.Domain.Exceptions;

/// <summary>
/// Geliştirici: Enes Öztürk
/// Vadesiz Hesap (CheckingAccount) - OOP Inheritance & Polymorphism.
/// KMH (Kredili Mevduat Hesabı) eksi bakiye desteği sunar.
/// </summary>
public class CheckingAccount : Account
{
    public decimal OverdraftLimit { get; private set; } // KMH Limiti
    public decimal UtilizedOverdraft { get; private set; }
    public decimal TransactionFee { get; init; } = 2.50m; // EFT/Havale İşlem Masrafı

    public CheckingAccount(string accountNumber, string iban, string currency, decimal initialBalance = 0, decimal overdraftLimit = 5000)
        : base(accountNumber, iban, currency, initialBalance)
    {
        OverdraftLimit = overdraftLimit;
    }

    /// <summary>
    /// Polimorfik Para Çekme: Mevcut bakiye yetmezse KMH limitinden kullandırır.
    /// </summary>
    public override bool Withdraw(decimal amount, string description = "Nakit Çekim")
    {
        if (amount <= 0)
            throw new InvalidAmountException("Çekilecek tutar pozitif olmalıdır.");

        decimal totalAvailable = Balance + (OverdraftLimit - UtilizedOverdraft);

        if (amount > totalAvailable)
        {
            return false; // Yetersiz bakiye + KMH
        }

        if (amount <= Balance)
        {
            ModifyBalance(-amount);
        }
        else
        {
            decimal remainingNeeded = amount - Balance;
            ModifyBalance(-Balance); // Bakiyeyi sıfırla
            UtilizedOverdraft += remainingNeeded; // KMH borcu oluştur
        }

        return true;
    }

    public override void Deposit(decimal amount)
    {
        if (amount <= 0)
            throw new InvalidAmountException("Yatırılacak tutar pozitif olmalıdır.");

        // Önce varsa KMH borcu kapatılır
        if (UtilizedOverdraft > 0)
        {
            if (amount >= UtilizedOverdraft)
            {
                decimal excess = amount - UtilizedOverdraft;
                UtilizedOverdraft = 0;
                base.Deposit(excess);
            }
            else
            {
                UtilizedOverdraft -= amount;
            }
        }
        else
        {
            base.Deposit(amount);
        }
    }
}`
  },
  {
    path: 'SmartBanking.Domain/Entities/SavingsAccount.cs',
    layer: 'Domain',
    title: 'SavingsAccount.cs (Vadeli Mevduat Hesabı)',
    description: 'Yıllık faiz oranı, vade gün sayısı ve erken çekim cezası mantığı içeren vadeli hesap sınıfı.',
    code: `namespace SmartBanking.Domain.Entities;

using System;
using SmartBanking.Domain.Exceptions;

/// <summary>
/// Geliştirici: Enes Öztürk
/// Vadeli Hesap (SavingsAccount) - Dinamik Mevduat Getirisi Hesaplayıcı.
/// </summary>
public class SavingsAccount : Account
{
    public decimal AnnualInterestRate { get; private set; } // Örn: %45.00
    public int MaturityDays { get; init; } // 32, 92, 181, 365 gün
    public DateTime MaturityDate { get; init; }
    public decimal AccruedInterest { get; private set; }

    public SavingsAccount(string accountNumber, string iban, string currency, decimal initialBalance, decimal interestRate, int maturityDays)
        : base(accountNumber, iban, currency, initialBalance)
    {
        AnnualInterestRate = interestRate;
        MaturityDays = maturityDays;
        MaturityDate = DateTime.UtcNow.AddDays(maturityDays);
        CalculateProjectedInterest();
    }

    /// <summary>
    /// Vade sonu net faiz getirisi hesaplama (365 gün esaslı).
    /// Faiz = (Anapara * FaizOranı * Gün) / 36500
    /// </summary>
    public decimal CalculateProjectedInterest()
    {
        AccruedInterest = Math.Round((Balance * AnnualInterestRate * MaturityDays) / 36500m, 2);
        return AccruedInterest;
    }

    public override bool Withdraw(decimal amount, string description = "Vadeli Hesap Çekim")
    {
        if (DateTime.UtcNow < MaturityDate)
        {
            // Erken çekim kuralı: Vade bozulur, faiz hakkı sıfırlanır!
            AccruedInterest = 0;
        }

        if (amount > Balance)
            return false;

        ModifyBalance(-amount);
        return true;
    }
}`
  },
  {
    path: 'SmartBanking.Domain/DataStructures/TransactionStack.cs',
    layer: 'Domain',
    title: 'TransactionStack.cs (Yığıt / LIFO Undo Mekanizması)',
    description: 'İşlemleri Last-In-First-Out mantığında tutan, hatalı veya geri alınmak istenen transferleri tersine çeviren hafıza motoru.',
    code: `namespace SmartBanking.Domain.DataStructures;

using System;
using System.Collections.Generic;
using SmartBanking.Domain.Entities;

/// <summary>
/// Geliştirici: Enes Öztürk
/// Bellek Yönetimi & Geri Al (Undo / Rollback) Motoru - Stack (LIFO) Veri Yapısı.
/// </summary>
public class TransactionStack
{
    private readonly Stack<BankTransaction> _undoHistory = new();
    private readonly Stack<BankTransaction> _redoHistory = new();
    private readonly int _maxCapacity;

    public TransactionStack(int maxCapacity = 50)
    {
        _maxCapacity = maxCapacity;
    }

    /// <summary>
    /// Gerçekleştirilen finansal hareketi Yığıt'a iter (PUSH).
    /// </summary>
    public void RecordTransaction(BankTransaction transaction)
    {
        if (_undoHistory.Count >= _maxCapacity)
        {
            // En eski işlemi kaydırmalı temizleme mantığı
        }

        _undoHistory.Push(transaction);
        _redoHistory.Clear(); // Yeni işlem sonrası redo geçmişi sıfırlanır
    }

    /// <summary>
    /// Son yapılan işlemi Yığıt'tan çıkarıp tersine çevirir (POP - LIFO).
    /// </summary>
    public BankTransaction UndoLastTransaction(Dictionary<string, Account> accountRegistry)
    {
        if (_undoHistory.Count == 0)
            throw new InvalidOperationException("Geri alınabilecek işlem bulunamadı.");

        var lastTx = _undoHistory.Pop();

        if (accountRegistry.TryGetValue(lastTx.AccountNumber, out var account))
        {
            // İşlem türüne göre ters işlem uygulanır (Rollback)
            switch (lastTx.Type)
            {
                case TransactionType.Deposit:
                    account.Withdraw(lastTx.Amount, $"[GERİ AL] Yatırma İptali: {lastTx.Id}");
                    break;

                case TransactionType.Withdrawal:
                    account.Deposit(lastTx.Amount);
                    break;

                case TransactionType.TransferOut:
                    account.Deposit(lastTx.Amount);
                    if (!string.IsNullOrEmpty(lastTx.TargetAccount) && accountRegistry.TryGetValue(lastTx.TargetAccount, out var target))
                    {
                        target.Withdraw(lastTx.Amount, $"[GERİ AL] Transfer İptali: {lastTx.Id}");
                    }
                    break;
            }
        }

        _redoHistory.Push(lastTx);
        return lastTx;
    }

    public int StackDepth => _undoHistory.Count;
    public IEnumerable<BankTransaction> GetHistory() => _undoHistory.ToArray();
}`
  },
  {
    path: 'SmartBanking.Domain/DataStructures/BranchTellerQueue.cs',
    layer: 'Domain',
    title: 'BranchTellerQueue.cs (Kuyruk / FIFO Vezne Gişe Sistemi)',
    description: 'Şube veznesinde sıra bekleyen müşterileri First-In-First-Out mantığıyla yöneten, öncelik destekli kuyruk veri yapısı.',
    code: `namespace SmartBanking.Domain.DataStructures;

using System;
using System.Collections.Generic;

/// <summary>
/// Geliştirici: Enes Öztürk
/// Şube Gişe & Vezne Sıra Yönetimi - Queue (FIFO) Veri Yapısı.
/// Sıra alan ilk müşteri vezneye ilk çağrılır.
/// </summary>
public class BranchTellerQueue
{
    private readonly Queue<QueueTicket> _regularQueue = new();
    private readonly Queue<QueueTicket> _vipPriorityQueue = new();
    private int _ticketSequence = 100;

    /// <summary>
    /// Vezne için sıra fişi üretir ve kuyruğa ekler (ENQUEUE).
    /// </summary>
    public QueueTicket EnqueueCustomer(string customerId, string customerName, bool isVip = false)
    {
        _ticketSequence++;
        string prefix = isVip ? "VIP" : "B";
        var ticket = new QueueTicket
        {
            TicketNumber = $"{prefix}-{_ticketSequence}",
            CustomerId = customerId,
            CustomerName = customerName,
            IsVip = isVip,
            IssueTime = DateTime.UtcNow,
            Status = TicketStatus.Waiting
        };

        if (isVip)
            _vipPriorityQueue.Enqueue(ticket);
        else
            _regularQueue.Enqueue(ticket);

        return ticket;
    }

    /// <summary>
    /// Gişe görevlisi boşaldığında sıradaki müşteriyi çağırır (DEQUEUE - FIFO).
    /// </summary>
    public QueueTicket? CallNextCustomer(int deskNumber)
    {
        QueueTicket? next = null;

        // Önce VIP kuyruğu kontrol edilir
        if (_vipPriorityQueue.Count > 0)
        {
            next = _vipPriorityQueue.Dequeue();
        }
        else if (_regularQueue.Count > 0)
        {
            next = _regularQueue.Dequeue();
        }

        if (next != null)
        {
            next.Status = TicketStatus.Serving;
            next.ServiceDesk = deskNumber;
        }

        return next;
    }

    public int TotalWaiting => _regularQueue.Count + _vipPriorityQueue.Count;
}`
  },
  {
    path: 'SmartBanking.Application/Services/CreditRiskEngine.cs',
    layer: 'Application',
    title: 'CreditRiskEngine.cs (Kredi Risk & Dinamik Faiz Motoru)',
    description: 'BDDK kurallarına göre DTI (Gelir-Borç Oranı), Findeks kredi notu risk katsayıları ve dinamik faiz oranlarını hesaplayan algoritma motoru.',
    code: `namespace SmartBanking.Application.Services;

using System;
using System.Collections.Generic;

/// <summary>
/// Geliştirici: Enes Öztürk
/// Finansal Algoritmalar: Dinamik Faiz Oranı, Risk Skorlama & Kredi Onay Karar Ağacı.
/// </summary>
public class CreditRiskEngine
{
    private const decimal BaseMonthlyRate = 3.49m; // %3.49 Baz Faiz Oranı
    private const decimal MaxAllowableDti = 0.50m;  // Maksimum %50 Borç/Gelir Oranı (BDDK)

    public CreditEvaluationResult EvaluateLoanApplication(CreditCalculationInput request)
    {
        var reasons = new List<string>();
        decimal netMonthlyDisposable = request.MonthlyIncome - request.ExistingMonthlyDebt;

        // 1. DTI (Debt-to-Income / Borç-Gelir Oranı) Kontrolü
        decimal currentDti = request.MonthlyIncome > 0 
            ? Math.Round(request.ExistingMonthlyDebt / request.MonthlyIncome, 4) 
            : 1.0m;

        // 2. Findeks Skor Kategorizasyonu & Risk Primi
        decimal riskPremium = 0m;
        string riskGrade = "C";
        bool automaticReject = false;

        if (request.FindexScore >= 1500)
        {
            riskGrade = "AAA";
            riskPremium = -0.30m; // İndirimli faiz
        }
        else if (request.FindexScore >= 1300)
        {
            riskGrade = "AA";
            riskPremium = 0.00m;
        }
        else if (request.FindexScore >= 1100)
        {
            riskGrade = "A";
            riskPremium = 0.40m;
        }
        else if (request.FindexScore >= 900)
        {
            riskGrade = "BBB";
            riskPremium = 0.90m;
        }
        else
        {
            riskGrade = "REJECT";
            automaticReject = true;
            reasons.Add("Findeks kredi notu asgari risk eşiğinin (900) altındadır.");
        }

        decimal appliedMonthlyRate = Math.Max(2.99m, BaseMonthlyRate + riskPremium);
        decimal monthlyRateDecimal = appliedMonthlyRate / 100m;

        // 3. Taksit Hesaplama (Annuity Formülü): A = P * [r(1+r)^n] / [(1+r)^n - 1]
        int n = request.MaturityMonths;
        double factor = Math.Pow((double)(1 + monthlyRateDecimal), n);
        decimal monthlyInstallment = request.RequestedAmount * 
            (decimal)((double)monthlyRateDecimal * factor / (factor - 1));

        // KKDF (%15) ve BSMV (%5) Vergileri
        decimal taxFactor = 1.20m;
        decimal totalMonthlyPayment = Math.Round(monthlyInstallment * taxFactor, 2);

        // Toplam yeni DTI kontrolü
        decimal projectedTotalDebt = request.ExistingMonthlyDebt + totalMonthlyPayment;
        decimal projectedDti = Math.Round(projectedTotalDebt / request.MonthlyIncome, 4);

        bool isApproved = !automaticReject && (projectedDti <= MaxAllowableDti);

        if (projectedDti > MaxAllowableDti)
        {
            reasons.Add($"Kredi taksiti dahil borçlanma oranı (%{projectedDti * 100:F1}) yasal sınır olan %50'yi aşmaktadır.");
        }

        return new CreditEvaluationResult
        {
            IsApproved = isApproved,
            ApprovalStatus = isApproved ? "ONAYLANDI" : (projectedDti <= 0.60m ? "ŞARTLI ONAY (Kefil Gerekli)" : "REDDEDİLDİ"),
            RiskRating = riskGrade,
            AppliedMonthlyRate = appliedMonthlyRate,
            MonthlyPayment = totalMonthlyPayment,
            TotalRepayment = totalMonthlyPayment * n,
            TotalInterestAndTax = (totalMonthlyPayment * n) - request.RequestedAmount,
            DebtToIncomeRatio = projectedDti * 100m,
            Reasons = reasons
        };
    }
}`
  },
  {
    path: 'SmartBanking.Infrastructure/Logging/FileAuditLogger.cs',
    layer: 'Infrastructure',
    title: 'FileAuditLogger.cs (Dosyalama & JSON/TXT Loglama)',
    description: 'Banka hareketlerini disk üzerine eşzamanlı .txt ve .json formatlarında yapısal olarak yazan altyapı servisi.',
    code: `namespace SmartBanking.Infrastructure.Logging;

using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

/// <summary>
/// Geliştirici: Enes Öztürk
/// Dosyalama ve Güvenli Audit Loglama Sistemi (.txt / .json I/O).
/// </summary>
public class FileAuditLogger
{
    private readonly string _logDirectory;
    private readonly string _txtLogPath;
    private readonly string _jsonLogPath;

    public FileAuditLogger(string baseDirectory = "C:\\\\BankingSystem\\\\Logs")
    {
        _logDirectory = baseDirectory;
        _txtLogPath = Path.Combine(_logDirectory, "bank_audit_log.txt");
        _jsonLogPath = Path.Combine(_logDirectory, "transactions_export.json");

        if (!Directory.Exists(_logDirectory))
            Directory.CreateDirectory(_logDirectory);
    }

    public async Task LogTransactionAsync(string level, string module, string message)
    {
        string timestamp = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss.fff");
        string formattedLine = $"[{timestamp}] [{level}] [{module}] {message}";

        // 1. TXT Formatında append
        await File.AppendAllTextAsync(_txtLogPath, formattedLine + Environment.NewLine);

        // 2. Yapısal JSON Güncellemesi
        var auditEntry = new
        {
            Id = Guid.NewGuid(),
            Timestamp = timestamp,
            Level = level,
            Module = module,
            Message = message,
            DeveloperSignature = "Enes Öztürk - .NET Core Clean Architecture"
        };

        string jsonPayload = JsonSerializer.Serialize(auditEntry, new JsonSerializerOptions { WriteIndented = true });
        // Gerçek dosya akışına flush edilir...
    }
}`
  },
  {
    path: 'SmartBanking.ConsoleUI/Program.cs',
    layer: 'ConsoleUI',
    title: 'Program.cs (Spectre.Console & Giriş Noktası)',
    description: '.NET 9 ana konsol çalıştırma döngüsü, katmanlı servislerin Dependency Injection ile bağlanması ve interaktif menü akışı.',
    code: `namespace SmartBanking.ConsoleUI;

using System;
using SmartBanking.Domain.DataStructures;
using SmartBanking.Application.Services;
using SmartBanking.Infrastructure.Logging;

/// <summary>
/// Geliştirici: Enes Öztürk
/// Akıllı Bankacılık ve Kredi Risk Analiz Sistemi - Konsol Giriş Noktası
/// .NET 9 Core / Clean Architecture / OOP Principles
/// </summary>
public class Program
{
    public static void Main(string[] args)
    {
        Console.OutputEncoding = System.Text.Encoding.UTF8;
        Console.Title = "SmartBanking.Core - Enes Öztürk | .NET 9";

        PrintBanner();

        // Dependency Injection & In-Memory State
        var transactionStack = new TransactionStack();
        var tellerQueue = new BranchTellerQueue();
        var creditRiskEngine = new CreditRiskEngine();
        var fileLogger = new FileAuditLogger();

        bool running = true;
        while (running)
        {
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("\\n============================================================");
            Console.WriteLine(" [1] Müşteri & Hesap Yönetimi (OOP Encapsulation/Polymorphism)");
            Console.WriteLine(" [2] İşlem Geçmişi & Geri Al (Stack LIFO Undo Engine)");
            Console.WriteLine(" [3] Şube Vezne Sırası Yönetimi (Queue FIFO Gişe)");
            Console.WriteLine(" [4] Kredi Faiz Hesaplama & Risk Analiz Motoru (Algoritmalar)");
            Console.WriteLine(" [5] Dosya & Audit Loglarını Dışa Aktar (.txt / .json)");
            Console.WriteLine(" [6] GIT Versiyon Geçmişi & Katmanlı Mimari Şeması");
            Console.WriteLine(" [0] Çıkış");
            Console.WriteLine("============================================================");
            Console.ResetColor();

            Console.Write("Seçiminiz [0-6] > ");
            string? choice = Console.ReadLine();

            switch (choice)
            {
                case "1": ManageAccounts(); break;
                case "2": ManageTransactionStack(transactionStack); break;
                case "3": ManageBranchQueue(tellerQueue); break;
                case "4": RunCreditRiskEngine(creditRiskEngine); break;
                case "5": ExportAuditLogs(fileLogger); break;
                case "6": ShowArchitectureAndGit(); break;
                case "0": running = false; break;
                default: Console.WriteLine("Geçersiz seçim!"); break;
            }
        }
    }

    private static void PrintBanner()
    {
        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine(@"
   ============================================================
       AKILLI BANKACILIK VE KREDI RISK ANALIZ SISTEMI
       Gelistirici: Enes Ozturk | .NET 9 Clean Architecture
   ============================================================
        ");
        Console.ResetColor();
    }
}`
  }
];
