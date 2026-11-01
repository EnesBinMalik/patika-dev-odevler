import React, { useState, useRef, useEffect } from 'react';
import { Account, AccountManager, InvalidAuthenticationException, HomeAddress, BusinessAddress, HealthInsurance } from '../types/insurance';
import { Terminal as TerminalIcon, Play, RefreshCw, AlertTriangle, ShieldCheck, CornerDownLeft } from 'lucide-react';

interface TerminalSimulatorProps {
  accountManager: AccountManager;
  onLoginSuccess: (account: Account) => void;
  activeAccount: Account | null;
  onLogout: () => void;
}

interface LogEntry {
  type: 'system' | 'prompt' | 'input' | 'success' | 'error' | 'output';
  text: string;
}

export const TerminalSimulator: React.FC<TerminalSimulatorProps> = ({
  accountManager,
  onLoginSuccess,
  activeAccount,
  onLogout,
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      type: 'system',
      text: '═══════════════════════════════════════════════════════════════════════',
    },
    {
      type: 'system',
      text: ' [Java Console Runner] com.enesozturk.insurance.Main (Scanner CLI)',
    },
    {
      type: 'system',
      text: ' TreeSet<Account> veri yapısı ve AccountManager başlatıldı.',
    },
    {
      type: 'system',
      text: '═══════════════════════════════════════════════════════════════════════',
    },
    {
      type: 'prompt',
      text: 'Lütfen E-Posta Adresinizi Giriniz (örn: ahmet@gmail.com veya enes@ozturk.com):',
    },
  ]);

  // Terminal input state machine: 'EMAIL' | 'PASSWORD' | 'MENU'
  const [inputStep, setInputStep] = useState<'EMAIL' | 'PASSWORD' | 'MENU'>('EMAIL');
  const [tempEmail, setTempEmail] = useState('');
  const [inputValue, setInputValue] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (entry: LogEntry) => {
    setLogs((prev) => [...prev, entry]);
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = inputValue.trim();
    if (!input && inputStep === 'MENU') return;

    // Display user typed input
    addLog({
      type: 'input',
      text: `> ${inputStep === 'PASSWORD' ? '••••••••' : input}`,
    });

    setInputValue('');

    if (inputStep === 'EMAIL') {
      if (!input) {
        addLog({ type: 'error', text: 'E-posta boş bırakılamaz.' });
        addLog({ type: 'prompt', text: 'Lütfen E-Posta Adresinizi Giriniz:' });
        return;
      }
      setTempEmail(input);
      setInputStep('PASSWORD');
      addLog({ type: 'prompt', text: 'Lütfen Şifrenizi Giriniz:' });
    } else if (inputStep === 'PASSWORD') {
      const email = tempEmail;
      const pwd = input;

      addLog({
        type: 'system',
        text: `[AccountManager] login("${email}", "${pwd}") çağrılıyor...`,
      });

      try {
        const loggedIn = accountManager.login(email, pwd);
        if (loggedIn) {
          addLog({
            type: 'success',
            text: `>>> [GİRİŞ BAŞARILI] Hoş geldiniz, Sayın ${loggedIn.user.getFullName()}! (${loggedIn.accountType === 'INDIVIDUAL' ? 'Bireysel' : 'Kurumsal'})`,
          });
          onLoginSuccess(loggedIn);
          setInputStep('MENU');
          printMenu(loggedIn);
        }
      } catch (err: unknown) {
        if (err instanceof InvalidAuthenticationException) {
          addLog({
            type: 'error',
            text: `[Try-Catch Yakalandı] InvalidAuthenticationException: ${err.message}`,
          });
          addLog({
            type: 'system',
            text: 'AccountManager try-catch bloğu devreye girdi. Oturum açma reddedildi.',
          });
        } else {
          addLog({
            type: 'error',
            text: `Bilinmeyen hata: ${String(err)}`,
          });
        }
        setInputStep('EMAIL');
        setTempEmail('');
        addLog({
          type: 'prompt',
          text: 'Tekrar denemek için lütfen E-Posta Adresinizi Giriniz:',
        });
      }
    } else if (inputStep === 'MENU') {
      handleMenuCommand(input);
    }
  };

  const printMenu = (acc: Account) => {
    addLog({
      type: 'output',
      text: '-----------------------------------------------------------------------',
    });
    addLog({
      type: 'output',
      text: 'KOMUTLAR: [1] showUserInfo() | [2] Poliçe Ekle | [3] Adres Ekle | [4] TreeSet Listele | [5] Çıkış',
    });
    addLog({
      type: 'output',
      text: '-----------------------------------------------------------------------',
    });
    addLog({
      type: 'prompt',
      text: `[${acc.user.firstName}@Sigorta ~]$ Bir komut numarası girin:`,
    });
  };

  const handleMenuCommand = (cmd: string) => {
    if (!activeAccount) {
      setInputStep('EMAIL');
      addLog({ type: 'prompt', text: 'Lütfen E-Posta Adresinizi Giriniz:' });
      return;
    }

    const command = cmd.toLowerCase().trim();

    switch (command) {
      case '1':
      case 'show':
      case 'userinfo': {
        const info = activeAccount.showUserInfo();
        info.forEach((line) => addLog({ type: 'output', text: line }));
        printMenu(activeAccount);
        break;
      }

      case '2':
      case 'addinsurance':
      case 'insurance': {
        const now = new Date();
        const nextYear = new Date(now.getTime() + 365 * 24 * 3600 * 1000);
        const newPolicy = new HealthInsurance(
          'Konsol Üzerinden Eklenen Sağlık Poliçesi',
          now,
          nextYear,
          activeAccount.user.age,
          false,
          'VIP'
        );
        activeAccount.addInsurance(newPolicy);
        addLog({
          type: 'success',
          text: `[Poliçe Eklendi] ${newPolicy.name} başarıyla hesaba işlendi. Prim: ${newPolicy.price.toLocaleString('tr-TR')} ₺ (Kar marjı uygulandı).`,
        });
        printMenu(activeAccount);
        break;
      }

      case '3':
      case 'addaddress':
      case 'address': {
        const homeAddr = new HomeAddress(
          'Fevzi Çakmak Cad.',
          '58',
          '3',
          'Çankaya',
          'Ankara',
          '06420',
          activeAccount.user.getFullName()
        );
        activeAccount.addAddress(homeAddr);
        addLog({
          type: 'success',
          text: `[AddressManager.addAddress] ${homeAddr.getAddressInfo()} eklendi.`,
        });
        printMenu(activeAccount);
        break;
      }

      case '4':
      case 'treeset':
      case 'list': {
        const accounts = accountManager.getAccounts();
        addLog({
          type: 'system',
          text: `>>> TreeSet<Account> Sıralı Liste (${accounts.length} hesap, Comparable<Account> ile e-posta sıralı):`,
        });
        accounts.forEach((acc, i) => {
          addLog({
            type: 'output',
            text: `  ${i + 1}. [${acc.accountType}] ${acc.user.email} - ${acc.user.getFullName()} (${acc.insuranceList.length} poliçe, ${acc.user.addressList.length} adres)`,
          });
        });
        printMenu(activeAccount);
        break;
      }

      case '5':
      case 'exit':
      case 'logout': {
        activeAccount.logout();
        onLogout();
        setInputStep('EMAIL');
        setTempEmail('');
        addLog({
          type: 'system',
          text: 'Oturum kapatıldı. Scanner oturumu yeniden başlatılıyor...',
        });
        addLog({
          type: 'prompt',
          text: 'Lütfen E-Posta Adresinizi Giriniz:',
        });
        break;
      }

      case 'clear':
      case 'cls': {
        setLogs([
          {
            type: 'system',
            text: 'Konsol temizlendi.',
          },
        ]);
        if (activeAccount) {
          printMenu(activeAccount);
        } else {
          setInputStep('EMAIL');
          addLog({ type: 'prompt', text: 'Lütfen E-Posta Adresinizi Giriniz:' });
        }
        break;
      }

      default:
        addLog({
          type: 'error',
          text: `Geçersiz komut: "${cmd}". Kullanılabilir: 1, 2, 3, 4, 5, clear`,
        });
        printMenu(activeAccount);
        break;
    }
  };

  // Quick Preset Actions
  const triggerLoginScenario = (email: string, pwd: string) => {
    addLog({
      type: 'system',
      text: `>>> Hızlı Test Senaryosu Çalıştırılıyor: [${email}]`,
    });
    setTempEmail(email);

    try {
      const loggedIn = accountManager.login(email, pwd);
      if (loggedIn) {
        addLog({
          type: 'success',
          text: `>>> [GİRİŞ BAŞARILI] Hoş geldiniz, ${loggedIn.user.getFullName()}!`,
        });
        onLoginSuccess(loggedIn);
        setInputStep('MENU');
        printMenu(loggedIn);
      }
    } catch (err: unknown) {
      if (err instanceof InvalidAuthenticationException) {
        addLog({
          type: 'error',
          text: `[Hata Yakalandı] InvalidAuthenticationException: ${err.message}`,
        });
      }
      setInputStep('EMAIL');
      setTempEmail('');
      addLog({
        type: 'prompt',
        text: 'Lütfen E-Posta Adresinizi Giriniz:',
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Test Scenarios Quick Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-indigo-600" />
              Scanner & AccountManager Hızlı Test Senaryoları
            </h3>
            <p className="text-[11px] text-slate-500">
              Klavyeden yazabileceğiniz gibi aşağıdaki test butonlarıyla da `login()` ve Exception testlerini tetikleyebilirsiniz.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => triggerLoginScenario('ahmet@gmail.com', '12345')}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Bireysel: Ahmet Yılmaz</span>
            </button>

            <button
              onClick={() => triggerLoginScenario('enes@ozturk.com', 'enes2026')}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Kurumsal: Enes Öztürk</span>
            </button>

            <button
              onClick={() => triggerLoginScenario('ahmet@gmail.com', 'yanlisSifre999')}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Hatalı Şifre (Exception Testi)</span>
            </button>

            <button
              onClick={() => {
                setLogs([]);
                setInputStep('EMAIL');
                setTempEmail('');
                addLog({
                  type: 'system',
                  text: 'Konsol sıfırlandı. Lütfen E-Posta Adresinizi Giriniz:',
                });
              }}
              title="Konsolu Temizle"
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive CLI Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col h-[520px]">
        {/* Terminal Titlebar */}
        <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-slate-300 font-medium ml-2 flex items-center gap-1">
              <TerminalIcon className="w-3.5 h-3.5 text-indigo-400" />
              Java Main CLI - Scanner & AccountManager Simulator
            </span>
          </div>

          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Status: {inputStep} MODE
          </span>
        </div>

        {/* Terminal Body */}
        <div className="p-4 flex-1 overflow-y-auto font-mono text-xs space-y-1.5 select-text">
          {logs.map((log, index) => {
            let color = 'text-slate-300';
            if (log.type === 'system') color = 'text-slate-500';
            else if (log.type === 'prompt') color = 'text-amber-300 font-medium';
            else if (log.type === 'input') color = 'text-sky-300 font-bold';
            else if (log.type === 'success') color = 'text-emerald-400 font-semibold';
            else if (log.type === 'error') color = 'text-rose-400 font-semibold';
            else if (log.type === 'output') color = 'text-slate-200';

            return (
              <div key={index} className={`${color} whitespace-pre-wrap leading-relaxed`}>
                {log.text}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleCommandSubmit}
          className="bg-slate-900 border-t border-slate-800 p-3 flex items-center gap-2"
        >
          <span className="text-emerald-400 font-mono text-xs select-none">
            {inputStep === 'EMAIL'
              ? 'email >'
              : inputStep === 'PASSWORD'
              ? 'password >'
              : 'command >'}
          </span>
          <input
            ref={inputRef}
            type={inputStep === 'PASSWORD' ? 'password' : 'text'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              inputStep === 'EMAIL'
                ? 'E-posta adresinizi yazıp Enter\'a basın (örn: ahmet@gmail.com)'
                : inputStep === 'PASSWORD'
                ? 'Şifrenizi yazıp Enter\'a basın (örn: 12345)'
                : '1: Bilgileri Yazdır, 2: Poliçe Ekle, 3: Adres Ekle, 4: TreeSet Listele, 5: Çıkış'
            }
            className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-hidden placeholder:text-slate-600"
            autoFocus
          />
          <button
            type="submit"
            className="px-2.5 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-500 transition-colors flex items-center gap-1 font-mono"
          >
            <span>Gönder</span>
            <CornerDownLeft className="w-3 h-3" />
          </button>
        </form>
      </div>
    </div>
  );
};
