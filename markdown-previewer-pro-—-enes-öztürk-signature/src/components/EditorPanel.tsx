import React, { useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Heading1, 
  Heading2, 
  Heading3, 
  Quote, 
  Code, 
  FileCode, 
  List, 
  ListOrdered, 
  CheckSquare, 
  Table as TableIcon, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Minus,
  RotateCcw,
  RotateCw,
  Copy,
  Check,
  Upload,
  Info
} from 'lucide-react';
import { MarkdownStats } from '../utils/markdownParser';

interface EditorPanelProps {
  value: string;
  onChange: (value: string) => void;
  stats: MarkdownStats;
  onScroll?: (percentage: number) => void;
  scrollRef?: React.RefObject<HTMLTextAreaElement | null>;
  theme: 'dark' | 'light' | 'sepia';
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  value,
  onChange,
  stats,
  onScroll,
  scrollRef,
  theme,
}) => {
  const localTextareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = scrollRef || localTextareaRef;
  const [copied, setCopied] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronized scroll listener
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (!onScroll) return;
    const target = e.currentTarget;
    const maxScroll = target.scrollHeight - target.clientHeight;
    if (maxScroll <= 0) {
      onScroll(0);
      return;
    }
    const percentage = target.scrollTop / maxScroll;
    onScroll(percentage);
  };

  // Helper to insert or wrap formatting around current text selection
  const insertFormatting = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;

    const replacement = `${prefix}${selectedText}${suffix}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 10);
  };

  // Insert line prefix (e.g., #, >, -, 1.)
  const insertLinePrefix = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const newValue = value.substring(0, lineStart) + prefix + value.substring(lineStart);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 10);
  };

  // Insert Table template
  const insertTable = () => {
    const tableTemplate = `\n| Başlık 1 | Başlık 2 | Başlık 3 |\n| :--- | :---: | ---: |\n| Hücre 1 | Hücre 2 | Hücre 3 |\n| Değer A | Değer B | Değer C |\n`;
    insertFormatting(tableTemplate, '');
  };

  // Handle Tab key for clean 2-space indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      insertFormatting('  ', '');
    }
  };

  // Handle File Upload (.md / .txt)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (typeof content === 'string') {
        onChange(content);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950/80 border-r border-slate-800/80 overflow-hidden">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".md,.markdown,.txt"
        className="hidden"
      />

      {/* Panel Sub-Header & Toolbar */}
      <div className="px-3 py-2 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-2 overflow-x-auto select-none shrink-0">
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400 mr-2 flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            Girdi
          </span>

          <div className="h-4 w-[1px] bg-slate-800 mx-1"></div>

          {/* Text Style buttons */}
          <button
            onClick={() => insertFormatting('**', '**', 'kalın metin')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Kalın (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertFormatting('*', '*', 'italik metin')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="İtalik (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertFormatting('~~', '~~', 'üstü çizili')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Üstü Çizili"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-1"></div>

          {/* Heading buttons */}
          <button
            onClick={() => insertLinePrefix('# ')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Başlık 1 (H1)"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertLinePrefix('## ')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Başlık 2 (H2)"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertLinePrefix('### ')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Başlık 3 (H3)"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-1"></div>

          {/* Quotes & Code */}
          <button
            onClick={() => insertLinePrefix('> ')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Blok Alıntı"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertFormatting('`', '`', 'kod')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Satır İçi Kod"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertFormatting('\n```javascript\n', '\n```\n', '// kodunuz buraya')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Kod Bloğu"
          >
            <FileCode className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-1"></div>

          {/* Lists & Tables */}
          <button
            onClick={() => insertLinePrefix('- ')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Madde İşaretli Liste"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertLinePrefix('1. ')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Numaralı Liste"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertLinePrefix('- [ ] ')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Görev Listesi (Checklist)"
          >
            <CheckSquare className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={insertTable}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Tablo Ekle"
          >
            <TableIcon className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-1"></div>

          {/* Links & Images */}
          <button
            onClick={() => insertFormatting('[', '](https://)', 'bağlantı metni')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Köprü Bağlantı (Link)"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertFormatting('![', '](https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800)', 'Görsel Açıklaması')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Görsel (Image)"
          >
            <ImageIcon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertFormatting('\n---\n', '')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Yatay Çizgi"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right side quick actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Dosya Aç (.md / .txt)"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleCopyRaw}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Ham Markdown'ı Kopyala"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 relative flex overflow-hidden">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          placeholder="# Markdown metninizi buraya yazmaya başlayın...&#10;&#10;Sağ üst köşedeki '?' butonuna tıklayarak örnek dokümanı ve tüm biçimlendirme kurallarını inceleyebilirsiniz."
          spellCheck={false}
          className={`flex-1 w-full h-full p-5 font-mono text-[13.5px] leading-relaxed resize-none focus:outline-none focus:ring-0 select-text overflow-y-auto ${
            theme === 'light'
              ? 'bg-white text-slate-900 placeholder:text-slate-400'
              : theme === 'sepia'
              ? 'bg-[#fcf7ed] text-[#3e3427] placeholder:text-[#a89984]'
              : 'bg-slate-950 text-slate-200 placeholder:text-slate-600'
          }`}
        />
      </div>

      {/* Editor Status Bar */}
      <div className="h-7 px-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-[11px] text-slate-400 select-none shrink-0 tabular-nums">
        <div className="flex items-center gap-3">
          <span>{stats.words} kelime</span>
          <span>·</span>
          <span>{stats.characters} karakter</span>
          <span>·</span>
          <span>{stats.lines} satır</span>
        </div>

        <div className="flex items-center gap-2">
          <span>~{stats.readingTimeMinutes} dk okuma</span>
          <span>·</span>
          <span className="text-sky-400">UTF-8</span>
        </div>
      </div>
    </div>
  );
};
