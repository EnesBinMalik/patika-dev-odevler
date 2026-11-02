import React, { useRef } from 'react';
import { Code2, Play, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';

export const CODE_PRESETS: { [key: string]: { label: string; description: string; code: string } } = {
  default: {
    label: 'Önerilen Çözüm (Enes Öztürk İmzalı)',
    description: 'Tüm adımları ve sahiplik kurallarını eksiksiz karşılayan ideal Rust çözümü.',
    code: `fn concatenate_strings(s1: &str, s2: &str) -> String {
    let mut result = String::new();
    result.push_str(s1);
    result.push_str(s2);
    result
}

fn main() {
    let string1 = String::from("Merhaba, ");
    let string2 = String::from("Rust Dünyası!");

    let concatenated_string = concatenate_strings(&string1, &string2);

    println!("{}", concatenated_string);
}`,
  },
  blank: {
    label: 'Boş Başlangıç Şablonu (Öğrenci Yazsın)',
    description: 'Adımları kendi ellerinizle yazıp öğrenmenizi pekiştirecek iskelet.',
    code: `// 1. &str dilimlerini alıp String döndüren concatenate_strings fonksiyonunu yazın
fn concatenate_strings(s1: &str, s2: &str) -> String {
    // 2. let mut result = String::new(); oluşturun
    // 3. push_str ile s1 ve s2'yi ekleyin
    // 4. result'ı döndürün
    todo!("Fonksiyonu doldurun")
}

fn main() {
    // 5. string1 ve string2'yi String::from(...) ile başlatın
    let string1 = String::from("Merhaba, ");
    let string2 = String::from("Rust!");

    // 6. &string1 ve &string2 referanslarıyla çağırın
    let concatenated_string = concatenate_strings(&string1, &string2);

    // 7. Konsola yazdırın
    println!("{}", concatenated_string);
}`,
  },
  moveError: {
    label: 'Hata Simülasyonu: Sahiplik Kaybı (Move Hatası)',
    description: '&str yerine String sahipliği alıp değişkeni tekrar kullanmaya çalışırsak ne olur?',
    code: `// DİKKAT: &str yerine String sahipliği alınırsa ne olur?
fn concatenate_strings(s1: String, s2: String) -> String {
    let mut result = String::new();
    result.push_str(&s1);
    result.push_str(&s2);
    result
}

fn main() {
    let string1 = String::from("Merhaba, ");
    let string2 = String::from("Rust!");

    // string1 ve string2'nin sahipliği fonksiyona devredildi (MOVE)!
    let concatenated_string = concatenate_strings(string1, string2);

    println!("{}", concatenated_string);

    // BORROW CHECKER HATASI:
    // string1 taşındığı için artık main içinde kullanılamaz!
    println!("string1 hala var mı? {}", string1);
}`,
  },
  custom: {
    label: 'Gelişmiş Deney: Deref Coercion & Kapasite',
    description: 'String dilimlerinin (&str) nasıl otomatik dönüştüğünü ve hafızayı inceleyin.',
    code: `fn concatenate_strings(s1: &str, s2: &str) -> String {
    // with_capacity kullanarak heap yeniden tahsisini (reallocation) önleyelim
    let mut result = String::with_capacity(s1.len() + s2.len());
    result.push_str(s1);
    result.push_str(s2);
    result
}

fn main() {
    let string1 = String::from("Enes Öztürk ile ");
    let string2 = String::from("Rust Bellek Yönetimi Harika!");

    let concatenated_string = concatenate_strings(&string1, &string2);

    println!("{}", concatenated_string);
    // string1 ve string2 yalnızca ödünç verildiği için hala tamamen geçerlidir:
    println!("string1 bayt uzunluğu: {}", string1.len());
    println!("string2 bayt uzunluğu: {}", string2.len());
}`,
  },
};

interface CodeEditorProps {
  code: string;
  onChange: (val: string) => void;
  onRun: () => void;
  isRunning: boolean;
  selectedPreset: string;
  onSelectPreset: (key: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  onRun,
  isRunning,
  selectedPreset,
  onSelectPreset,
}) => {
  const [copied, setCopied] = React.useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lines = code.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Run on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
    }
    // Handle tab indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = code.substring(0, start) + '    ' + code.substring(end);
      onChange(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div id="kod-editoru" className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-lg">
      {/* Editor Top Bar */}
      <div className="bg-slate-950/80 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300 font-medium">
            <Code2 className="w-3.5 h-3.5 text-amber-400" />
            <span>src/main.rs</span>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 hidden sm:inline">Şablon:</span>
          <select
            value={selectedPreset}
            onChange={(e) => onSelectPreset(e.target.value)}
            className="text-xs bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            {Object.entries(CODE_PRESETS).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 p-1.5 rounded-md hover:bg-slate-800 transition-colors"
            title="Kodu Kopyala"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative flex min-h-[340px] max-h-[480px] bg-slate-950 overflow-hidden font-mono text-xs">
        {/* Line Numbers */}
        <div className="select-none py-3 pl-3 pr-2 text-right text-slate-600 bg-slate-950/60 border-r border-slate-900 w-10 shrink-0 font-mono text-xs leading-5">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Code Input */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="flex-1 py-3 px-4 bg-transparent text-slate-100 resize-none focus:outline-none font-mono text-xs leading-5 whitespace-pre overflow-auto"
          placeholder="// Rust kodunuzu buraya yazın..."
        />
      </div>

      {/* Editor Bottom Bar */}
      <div className="bg-slate-950/90 px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="font-mono">Rust 2021 Edition</span>
          <span aria-hidden="true">·</span>
          <span>{lines.length} satır</span>
          <span aria-hidden="true">·</span>
          <span>{code.length} karakter</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-slate-500">
            Kısayol: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">Enter</kbd>
          </span>

          <button
            onClick={onRun}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-md transition-colors disabled:opacity-50"
          >
            <Play className={`w-3 h-3 fill-current ${isRunning ? 'animate-pulse' : ''}`} />
            {isRunning ? 'Derleniyor...' : 'Çalıştır (Cargo Run)'}
          </button>
        </div>
      </div>
    </div>
  );
};
