import { Marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';

// Setup marked instance
const markedInstance = new Marked({
  gfm: true,
  breaks: true,
});

export interface MarkdownStats {
  words: number;
  characters: number;
  lines: number;
  readingTimeMinutes: number;
}

export function parseMarkdown(markdown: string): string {
  if (!markdown) return '';

  try {
    const rawHtml = markedInstance.parse(markdown) as string;

    // Sanitize with DOMPurify while permitting checkboxes, links, target, class names
    const cleanHtml = DOMPurify.sanitize(rawHtml, {
      ADD_TAGS: ['iframe', 'input'],
      ADD_ATTR: ['target', 'type', 'checked', 'disabled', 'class', 'style'],
    });

    return cleanHtml;
  } catch (error) {
    console.error('Markdown parse error:', error);
    return `<div class="p-4 text-rose-400 bg-rose-950/20 rounded border border-rose-800/40">Markdown ayrıştırma hatası: ${String(error)}</div>`;
  }
}

export function calculateStats(markdown: string): MarkdownStats {
  const clean = markdown.trim();
  const lines = markdown.length > 0 ? markdown.split('\n').length : 0;
  const words = clean ? clean.split(/\s+/).filter(Boolean).length : 0;
  const characters = markdown.length;
  // Average reading speed: 200 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  return {
    words,
    characters,
    lines,
    readingTimeMinutes,
  };
}

export function highlightCodeInElement(container: HTMLElement | null) {
  if (!container) return;

  const codeBlocks = container.querySelectorAll('pre code');
  codeBlocks.forEach((block) => {
    try {
      // Highlight code
      hljs.highlightElement(block as HTMLElement);
    } catch {
      // ignore language fallback
    }

    // Add copy button and language badge if not already added
    const pre = block.parentElement;
    if (pre && !pre.querySelector('.code-header-bar')) {
      const languageMatch = block.className.match(/language-([a-zA-Z0-9_-]+)/);
      const language = languageMatch ? languageMatch[1] : 'metin';

      const headerBar = document.createElement('div');
      headerBar.className =
        'code-header-bar flex items-center justify-between px-3 py-1.5 bg-slate-950/80 border-b border-slate-800 text-xs text-slate-400 select-none';

      const langSpan = document.createElement('span');
      langSpan.className = 'font-mono text-[11px] font-medium tracking-wide uppercase text-sky-400';
      langSpan.textContent = language;

      const copyBtn = document.createElement('button');
      copyBtn.className =
        'copy-code-btn px-2 py-0.5 rounded text-[11px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer';
      copyBtn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        <span>Kopyala</span>
      `;

      copyBtn.onclick = (e) => {
        e.stopPropagation();
        const codeText = block.textContent || '';
        navigator.clipboard.writeText(codeText).then(() => {
          copyBtn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            <span class="text-sky-400">Kopyalandı!</span>
          `;
          setTimeout(() => {
            copyBtn.innerHTML = `
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              <span>Kopyala</span>
            `;
          }, 2000);
        });
      };

      headerBar.appendChild(langSpan);
      headerBar.appendChild(copyBtn);
      pre.insertBefore(headerBar, block);
    }
  });
}
