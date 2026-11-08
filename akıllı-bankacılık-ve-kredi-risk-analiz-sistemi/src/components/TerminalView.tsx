import React, { useState, useRef, useEffect } from 'react';
import { BankingEngine } from '../services/bankingEngine';
import { Terminal, Play, RotateCcw, Copy, Check, Sparkles } from 'lucide-react';

interface TerminalViewProps {
  engine: BankingEngine;
  onRefresh: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const TerminalView: React.FC<TerminalViewProps> = ({ engine, onRefresh, onNavigateTab }) => {
  const [history, setHistory] = useState<string[]>([
    'Microsoft (R) .NET Core SDK version 9.0.100 [x64]',
    'Copyright (C) Microsoft Corporation. All rights reserved.',
    '',
    'C:\\BankingSystem> cd src\\SmartBanking.ConsoleApp',
    'C:\\BankingSystem\\src\\SmartBanking.ConsoleApp> dotnet run',
    '',
    '\x1b[32m   ____                      _   ____              _    _             \x1b[0m',
    '\x1b[32m  / ___| _ __ ___   __ _ _ _| |_| __ )  __ _ _ __ | | _(_)_ __   __ _ \x1b[0m',
    '\x1b[32m  \\___ \\| \'_ ` _ \\ / _` | \'__| __|  _ \\ / _` | \'_ \\| |/ / | \'_ \\ / _` |\x1b[0m',
    '\x1b[32m   ___) | | | | | | (_| | |  | |_| |_) | (_| | | | |   <| | | | | (_| |\x1b[0m',
    '\x1b[32m  |____/|_| |_| |_|\\__,_|_|   \\__|____/ \\__,_|_| |_|_|\\_\\_|_| |_|\\__, |\x1b[0m',
    '\x1b[32m                                                                  |___/ \x1b[0m',
    '',
    '  ========================================================================',
    '   AKILLI BANKACILIK VE KREDİ RİSK ANALİZ SİSTEMİ - .NET 9 CORE',
    '   Geliştirici İmzası: Enes Öztürk | Software Engineer',
    '   Mimari: Clean Architecture (Domain, Application, Infrastructure, UI)',
    '  ========================================================================',
    '',
    '  [!] Komut listesini görmek için "help" yazın veya aşağıdaki butonlara tıklayın.',
    '  [✓] Veritabanı ve Hafıza Durumu: Hazır (In-Memory Stack/Queue yüklendi).',
    '',
  ]);

  const [inputVal, setInputVal] = useState('');
  const [copied, setCopied] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    const newHistory = [...history, `C:\\BankingSystem\\src\\SmartBanking.ConsoleApp> ${cmd}`];
    const parts = cmd.split(' ').filter(Boolean);
    const mainCmd = parts[0].toLowerCase();

    switch (mainCmd) {
      case 'help':
      case '?':
        newHistory.push(
          '',
          '  [KULLANILABİLİR .NET KONSOL KOMUTLARI]',
          '  ------------------------------------------------------------------------',
          '  accounts                   -> Tüm müşteri hesaplarını ve bakiyeleri listeler (OOP)',
          '  deposit <acc> <tutar>      -> Belirtilen hesaba para yatırır (Encapsulation)',
          '  withdraw <acc> <tutar>     -> Belirtilen hesaptan para çeker (KMH/Vadeli korumalı)',
          '  transfer <kaynak> <hedef> <tutar> -> Atomik virman / EFT gerçekleştirir',
          '  undo                       -> Son yapılan işlemi Yığıt (Stack LIFO)\'tan geri alır',
          '  stack                      -> Yığıt (Stack LIFO) bellek derinliğini gösterir',
          '  queue-ticket [vip|bireysel]-> Şube veznesine sıraya yeni fiş ekler (Queue FIFO)',
          '  queue-call <vezneNo>       -> Vezneye sıradaki müşteriyi çağırır (FIFO Dequeue)',
          '  risk <tutar> <vadeAy>      -> Kredi risk ve dinamik faiz algoritmasını çalıştırır',
          '  audit-export               -> Audit loglarını .txt formatında dışa aktarır',
          '  git-log                    -> GIT commit ağacını ve geliştirici imzasını gösterir',
          '  clear                      -> Konsol ekranını temizler',
          ''
        );
        break;

      case 'clear':
      case 'cls':
        setHistory([
          'C:\\BankingSystem\\src\\SmartBanking.ConsoleApp> (Konsol temizlendi. "help" yazabilirsiniz.)',
        ]);
        setInputVal('');
        return;

      case 'accounts': {
        const accounts = engine.getAllAccounts();
        newHistory.push(
          '',
          '  +-----------------+-----------------------+----------+--------------------+-------------+',
          '  | HESAP NO        | MÜŞTERİ               | TÜR      | BAKİYE             | DURUM       |',
          '  +-----------------+-----------------------+----------+--------------------+-------------+'
        );
        accounts.forEach((a) => {
          const typeLabel = a.account.type === 'Checking' ? 'Vadesiz (KMH)' : 'Vadeli (%46.5)';
          const balStr = `${a.account.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ${a.account.currency}`;
          newHistory.push(
            `  | ${a.account.accountNumber.padEnd(15)} | ${a.customerName.padEnd(21)} | ${typeLabel.padEnd(8)} | ${balStr.padEnd(18)} | [AKTİF]     |`
          );
        });
        newHistory.push(
          '  +-----------------+-----------------------+----------+--------------------+-------------+',
          `  Toplam ${accounts.length} hesap listelendi. Kapsülleme (Encapsulation) kuralları devrede.`,
          ''
        );
        break;
      }

      case 'deposit': {
        const accNum = parts[1];
        const amount = parseFloat(parts[2]);
        if (!accNum || isNaN(amount)) {
          newHistory.push('  [HATA] Kullanım: deposit <hesapNo> <tutar> (Örn: deposit TR-1001-CHK 5000)');
        } else {
          try {
            const tx = engine.deposit(accNum, amount, 'Konsol Para Yatırma');
            newHistory.push(
              `  [BAŞARILI] ${tx.id} | ${accNum} hesabına ${amount.toLocaleString('tr-TR')} TL yatırıldı.`,
              `  Yeni Bakiye: ${tx.balanceAfter.toLocaleString('tr-TR')} TL | Stack [PUSH] derinliği: ${engine.getStackDepth()}`,
              ''
            );
            onRefresh();
          } catch (err: unknown) {
            newHistory.push(`  [HATA]: ${(err as Error).message}`);
          }
        }
        break;
      }

      case 'withdraw': {
        const accNum = parts[1];
        const amount = parseFloat(parts[2]);
        if (!accNum || isNaN(amount)) {
          newHistory.push('  [HATA] Kullanım: withdraw <hesapNo> <tutar> (Örn: withdraw TR-1001-CHK 2000)');
        } else {
          try {
            const tx = engine.withdraw(accNum, amount, 'Konsol Nakit Çekim');
            newHistory.push(
              `  [BAŞARILI] ${tx.id} | ${accNum} hesabından -${amount.toLocaleString('tr-TR')} TL çekildi.`,
              `  Yeni Bakiye: ${tx.balanceAfter.toLocaleString('tr-TR')} TL | Stack [PUSH] derinliği: ${engine.getStackDepth()}`,
              ''
            );
            onRefresh();
          } catch (err: unknown) {
            newHistory.push(`  [HATA]: ${(err as Error).message}`);
          }
        }
        break;
      }

      case 'transfer': {
        const src = parts[1];
        const dst = parts[2];
        const amount = parseFloat(parts[3]);
        if (!src || !dst || isNaN(amount)) {
          newHistory.push('  [HATA] Kullanım: transfer <kaynak> <hedef> <tutar>');
        } else {
          try {
            const tx = engine.transfer(src, dst, amount, 'Konsol Transferi');
            newHistory.push(
              `  [BAŞARILI] ${tx.id} | ${src} -> ${dst} transfer edildi: ${amount.toLocaleString('tr-TR')} TL`,
              `  Stack [PUSH] derinliği: ${engine.getStackDepth()}`,
              ''
            );
            onRefresh();
          } catch (err: unknown) {
            newHistory.push(`  [HATA]: ${(err as Error).message}`);
          }
        }
        break;
      }

      case 'undo': {
        try {
          const res = engine.undoLastTransaction();
          newHistory.push(
            '  [GERİ ALINDI / LIFO ROLLBACK]',
            `  İptal Edilen İşlem: ${res.revertedTx.id} (${res.revertedTx.type} - ${res.revertedTx.amount.toLocaleString('tr-TR')} TL)`,
            `  Açıklama: ${res.description}`,
            `  Kalan Stack Derinliği: ${engine.getStackDepth()}`,
            ''
          );
          onRefresh();
        } catch (err: unknown) {
          newHistory.push(`  [STACK UYARISI]: ${(err as Error).message}`);
        }
        break;
      }

      case 'stack': {
        const stackItems = engine.getUndoStack();
        newHistory.push(
          '',
          `  === YIĞIT (STACK LIFO) BELLEK DURUMU [Derinlik: ${stackItems.length}] ===`
        );
        if (stackItems.length === 0) {
          newHistory.push('  [Stack Boş] Henüz geri alınabilecek işlem yapılmadı.');
        } else {
          stackItems.forEach((tx, idx) => {
            const isTop = idx === 0 ? ' [SP -> TEPE / TOP]' : '';
            newHistory.push(
              `  [${idx}] ${tx.id.padEnd(8)} | ${tx.type.padEnd(12)} | ${tx.amount.toLocaleString('tr-TR')} TL | ${tx.accountNumber}${isTop}`
            );
          });
        }
        newHistory.push('');
        break;
      }

      case 'queue-ticket': {
        const type = (parts[1] || 'bireysel').toLowerCase() === 'vip' ? 'VIP' : 'Bireysel';
        const ticket = engine.enqueueCustomer('CUST-001', type);
        newHistory.push(
          `  [KUYRUK - ENQUEUE] Fiş Üretildi: ${ticket.ticketNumber} (${ticket.customerName})`,
          `  Tür: ${ticket.ticketType} | Saat: ${ticket.issueTime} | Sırada Bekleyen: ${engine.getBranchQueue().length}`,
          ''
        );
        onRefresh();
        break;
      }

      case 'queue-call': {
        const deskId = parseInt(parts[1]) || 1;
        const ticket = engine.callNextCustomer(deskId);
        if (!ticket) {
          newHistory.push(`  [KUYRUK BOŞ] Vezne #${deskId} için sırada bekleyen müşteri yok.`);
        } else {
          newHistory.push(
            `  [KUYRUK - DEQUEUE / FIFO] ${ticket.ticketNumber} numaralı ${ticket.customerName}`,
            `  Vezne #${deskId} masasına davet edildi. (Kalan sıra: ${engine.getBranchQueue().length})`,
            ''
          );
        }
        onRefresh();
        break;
      }

      case 'risk': {
        const amount = parseFloat(parts[1]) || 100000;
        const months = parseInt(parts[2]) || 24;
        const cust = engine.getCustomerById('CUST-001')!;
        const evalRes = engine.evaluateCredit({
          customerId: cust.id,
          loanType: 'İhtiyaç',
          requestedAmount: amount,
          maturityMonths: months,
          monthlyIncome: cust.monthlyIncome,
          existingMonthlyDebt: cust.existingDebts,
          findexScore: cust.findexScore,
        });

        newHistory.push(
          '',
          '  === KREDİ FAİZ HESAPLAMA VE RİSK ANALİZ MOTORU ÇIKTISI ===',
          `  Müşteri: ${cust.fullName} | Findeks Skoru: ${evalRes.findexScore} (${evalRes.findexCategory})`,
          `  Talep Tutarı: ${amount.toLocaleString('tr-TR')} TL | Vade: ${months} Ay`,
          `  Aylık Faiz Oranı: %${evalRes.appliedMonthlyRate.toFixed(2)} (Yıllık: %${evalRes.appliedAnnualRate.toFixed(2)})`,
          `  Aylık Taksit: ${evalRes.monthlyPayment.toLocaleString('tr-TR')} TL (Vergiler dahil)`,
          `  Toplam Geri Ödeme: ${evalRes.totalRepayment.toLocaleString('tr-TR')} TL (Toplam Faiz: ${evalRes.totalInterest.toLocaleString('tr-TR')} TL)`,
          `  Borç/Gelir Oranı (DTI): %${evalRes.debtToIncomeRatio.toFixed(1)} (Yasal Üst Sınır: %50)`,
          `  SONUÇ: [${evalRes.approvalStatus}]`,
          ...evalRes.reasons.map((r) => `    -> ${r}`),
          ''
        );
        onRefresh();
        break;
      }

      case 'audit-export': {
        const txt = engine.generateAuditLogTxt();
        const firstLines = txt.split('\n').slice(0, 10);
        newHistory.push(
          '',
          '  [DOSYALAMA: bank_audit_log.txt ÖNİZLEME]',
          ...firstLines,
          '  ... (Tam logları Modül 4 sekmesinden indirebilirsiniz)',
          ''
        );
        break;
      }

      case 'git-log': {
        const commits = engine.getGitCommits();
        newHistory.push('', '  * commit tree (git log --graph --oneline --decorate):');
        commits.forEach((c) => {
          newHistory.push(
            `  * \x1b[33m${c.hash}\x1b[0m \x1b[36m(${c.branch})\x1b[0m ${c.message}`,
            `    Author: ${c.author} | ${c.date}`
          );
        });
        newHistory.push('');
        break;
      }

      case 'dotnet': {
        if (parts[1] === 'run') {
          newHistory.push(
            '  Building...',
            '  SmartBanking.Domain -> bin\\Debug\\net9.0\\SmartBanking.Domain.dll',
            '  SmartBanking.Application -> bin\\Debug\\net9.0\\SmartBanking.Application.dll',
            '  SmartBanking.Infrastructure -> bin\\Debug\\net9.0\\SmartBanking.Infrastructure.dll',
            '  SmartBanking.ConsoleUI -> bin\\Debug\\net9.0\\SmartBanking.ConsoleUI.dll',
            '  Build succeeded. 0 Warning(s), 0 Error(s).',
            '  Sistem başlatıldı. Geliştirici: Enes Öztürk'
          );
        } else if (parts[1] === 'test') {
          newHistory.push(
            '  Starting test execution...',
            '  [PASS] Domain.Tests.AccountTests.Encapsulation_PreventsNegativeBalance',
            '  [PASS] Domain.Tests.StackTests.Undo_RollbacksLastTransactionCorrectly',
            '  [PASS] Domain.Tests.QueueTests.Fifo_PreservesOrder_WithVipPriority',
            '  [PASS] Application.Tests.RiskEngineTests.DtiAbove50Percent_RejectsLoan',
            '  Passed! Total tests: 4. Failed: 0. Duration: 142 ms.'
          );
        } else {
          newHistory.push('  dotnet [run | test | --version]');
        }
        break;
      }

      default:
        newHistory.push(
          `  '${cmd}' komutu tanınamadı. Kullanılabilir komutları görmek için 'help' yazın.`
        );
        break;
    }

    setHistory(newHistory);
    setInputVal('');
  };

  const copyTerminalContent = () => {
    const rawText = history
      .map((line) => line.replace(/\x1b\[[0-9;]*m/g, ''))
      .join('\n');
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Interactive Quick Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-mono font-medium">Hızlı Komutlar:</span>
          <button
            onClick={() => handleCommand('accounts')}
            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md font-mono transition-colors"
          >
            accounts
          </button>
          <button
            onClick={() => handleCommand('deposit TR-1001-CHK 10000')}
            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded-md font-mono transition-colors"
          >
            deposit +10k
          </button>
          <button
            onClick={() => handleCommand('undo')}
            className="px-2.5 py-1 text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-md font-mono transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            undo (LIFO)
          </button>
          <button
            onClick={() => handleCommand('queue-ticket vip')}
            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 rounded-md font-mono transition-colors"
          >
            queue-ticket
          </button>
          <button
            onClick={() => handleCommand('risk 150000 24')}
            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-purple-400 border border-slate-700 rounded-md font-mono transition-colors"
          >
            risk 150k
          </button>
          <button
            onClick={() => handleCommand('git-log')}
            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-yellow-400 border border-slate-700 rounded-md font-mono transition-colors"
          >
            git-log
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyTerminalContent}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md border border-slate-700 transition-colors font-mono"
            title="Terminal içeriğini kopyala"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Kopyalandı' : 'Konsolu Kopyala'}</span>
          </button>
          <button
            onClick={() => handleCommand('clear')}
            className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 transition-colors font-mono"
          >
            Temizle
          </button>
        </div>
      </div>

      {/* Main Terminal Window */}
      <div className="rounded-xl border border-slate-800 bg-[#0d1117] shadow-2xl overflow-hidden font-mono text-sm leading-relaxed">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-slate-800 select-none">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-xs text-slate-400 font-medium">
              pwsh.exe - C:\BankingSystem\src\SmartBanking.ConsoleApp (net9.0)
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold">Enes Öztürk</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400">Clean Architecture</span>
          </div>
        </div>

        {/* Terminal Body */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="p-5 h-[480px] overflow-y-auto cursor-text text-slate-200 select-text scrollbar-thin"
        >
          {history.map((line, idx) => {
            const isCmd = line.startsWith('C:\\');
            const isErr = line.includes('[HATA]') || line.includes('REDDEDİLDİ');
            const isSuccess = line.includes('[BAŞARILI]') || line.includes('[ONAYLANDI]') || line.includes('Build succeeded');
            const isWarning = line.includes('[UYARI]') || line.includes('[GERİ ALINDI');

            let textColor = 'text-slate-300';
            if (isCmd) textColor = 'text-cyan-400 font-semibold';
            else if (isErr) textColor = 'text-rose-400';
            else if (isSuccess) textColor = 'text-emerald-400';
            else if (isWarning) textColor = 'text-amber-400';
            else if (line.startsWith('  * commit') || line.startsWith('  *')) textColor = 'text-yellow-300';

            return (
              <div key={idx} className={`whitespace-pre-wrap font-mono ${textColor}`}>
                {line}
              </div>
            );
          })}

          {/* Active Input Line */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-emerald-400 font-semibold shrink-0">
              C:\BankingSystem\src\SmartBanking.ConsoleApp&gt;
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCommand(inputVal);
                }
              }}
              placeholder="komut yazın (örn: help, accounts, undo, risk 100000 12)..."
              className="flex-1 bg-transparent text-slate-100 outline-none border-none focus:ring-0 p-0 font-mono text-sm placeholder:text-slate-600 caret-emerald-400"
              autoFocus
            />
          </div>
          <div ref={terminalEndRef} />
        </div>
      </div>

      {/* Module Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigateTab('module1')}
          className="p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-lg text-left transition-colors group"
        >
          <div className="text-xs font-semibold text-emerald-400 font-mono">Modül 1 &rarr;</div>
          <div className="text-sm font-semibold text-slate-200 mt-0.5">OOP & Hesap Yönetimi</div>
          <p className="text-xs text-slate-400 mt-1">Polimorfik vadesiz/vadeli ve kapsülleme.</p>
        </button>

        <button
          onClick={() => onNavigateTab('module2')}
          className="p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-lg text-left transition-colors group"
        >
          <div className="text-xs font-semibold text-cyan-400 font-mono">Modül 2 &rarr;</div>
          <div className="text-sm font-semibold text-slate-200 mt-0.5">Stack & Queue Motoru</div>
          <p className="text-xs text-slate-400 mt-1">LIFO Undo ve FIFO şube veznesi.</p>
        </button>

        <button
          onClick={() => onNavigateTab('module3')}
          className="p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-lg text-left transition-colors group"
        >
          <div className="text-xs font-semibold text-purple-400 font-mono">Modül 3 &rarr;</div>
          <div className="text-sm font-semibold text-slate-200 mt-0.5">Kredi Risk Analizi</div>
          <p className="text-xs text-slate-400 mt-1">Dinamik faiz ve BDDK DTI skorlama.</p>
        </button>

        <button
          onClick={() => onNavigateTab('module4')}
          className="p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-lg text-left transition-colors group"
        >
          <div className="text-xs font-semibold text-yellow-400 font-mono">Modül 4 &rarr;</div>
          <div className="text-sm font-semibold text-slate-200 mt-0.5">Dosyalama & Git Takibi</div>
          <p className="text-xs text-slate-400 mt-1">.txt / .json I/O ve Enes Öztürk Git logları.</p>
        </button>
      </div>
    </div>
  );
};
