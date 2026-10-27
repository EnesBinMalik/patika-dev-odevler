/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Paragraf Oluşturucu API & Yerel Motoru - Enes Öztürk
 */

export type FormatType = 'text' | 'html';
export type TextTheme = 'bacon' | 'classic' | 'turkish' | 'tech';

export interface GenerateOptions {
  paras: number;
  format: FormatType;
  theme?: TextTheme;
  startWithLorem?: boolean;
  includeSignature?: boolean;
}

export interface GenerationResult {
  paragraphs: string[];
  rawText: string;
  source: 'api' | 'local';
  wordCount: number;
  charCount: number;
  readingTimeMinutes: number;
}

// Built-in dictionaries for resilient offline & theme-based generation
const BACON_WORDS = [
  'bacon', 'ipsum', 'dolor', 'amet', 'pork', 'belly', 'short', 'ribs', 'sirloin',
  'ground', 'round', 'shank', 'shankle', 'prosciutto', 'ham', 'hock', 'turducken',
  'meatloaf', 'tenderloin', 'pastrami', 'fatback', 'spare', 'ribs', 'bresaola',
  'flank', 'strip', 'steak', 'venison', 'salami', 'pancetta', 'kevin', 'capicola',
  'beef', 'ribs', 'tail', 'pork', 'chop', 'corned', 'beef', 'andouille', 'chislic',
  'picanha', 'landjaeger', 'filet', 'mignon', 'leberkas', 'drumstick', 'swine'
];

const CLASSIC_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
  'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'in',
  'voluptate', 'velit', 'esse', 'cillum', 'eu', 'fugiat', 'nulla', 'pariatur',
  'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'in',
  'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

const TURKISH_SENTENCES = [
  'Zamanın akışı içinde kelimeler, düşüncenin en duru yansıması olarak satırlara dökülür.',
  'Tasarımın inceliği, detaylarda gizlenen uyum ve sadelik ile kendini gösterir.',
  'Modern arayüzler kullanıcı deneyimini merkeze alarak dijital dünyada kalıcı bir iz bırakır.',
  'Geliştirilen her yazılım, geleceğin mimarisine eklenen sağlam bir yapı taşı niteliğindedir.',
  'Estetik ve fonksiyonellik bir araya geldiğinde ortaya çıkan sonuç her zaman hayranlık uyandırır.',
  'Yaratıcı fikirler, disiplinli bir çalışma ve tutkuyla birleştiğinde gerçeğe dönüşür.',
  'Teknolojinin sunduğu imkanlar, insan zihninin sınırlarını zorlayan projelere kapı aralamaktadır.',
  'Temiz kod prensipleri ve sürdürülebilir mimari, başarılı projelerin temel anahtarıdır.',
  'Her yeni gün, öğrenme arzusuyla dolu zihinler için keşfedilmeyi bekleyen bir başlangıçtır.',
  'Tipografi ve beyaz alan dengesi, dijital içeriklerin okunabilirliğini doğrudan artırır.',
  'Enes Öztürk tarafından hazırlanan bu çalışma, sadelik ile performansı aynı potada eritir.',
  'Göz alıcı renk paletleri ve dengeli hiyerarşi, kullanıcı etkileşimini en üst seviyeye taşır.'
];

const TECH_SENTENCES = [
  'Full-stack architecture optimizes microservices latency across high-throughput cloud clusters.',
  'React component lifecycles synchronize reactive states through memoized render trees seamlessly.',
  'TypeScript strict compiler boundaries guarantee robust type safety across decoupled API contracts.',
  'Distributed consensus algorithms maintain atomic consistency across horizontally partitioned nodes.',
  'Tailwind utility constraints enforce atomic token systems with zero runtime layout overhead.',
  'Continuous delivery pipelines streamline automated unit suites and progressive canary deployments.',
  'Serverless edge functions execute low-latency mutations close to globally distributed users.',
  'Asynchronous event-driven brokers orchestrate fault-tolerant message queues under heavy peak loads.',
  'Web performance metrics require optimal first contentful paint and cumulative layout shift scores.',
  'Modular design architectures enable rapid prototype iteration without compromising maintainability.'
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateSentenceFromWords(words: string[], minWords = 8, maxWords = 18): string {
  const wordCount = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  const sentenceWords: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    sentenceWords.push(getRandomElement(words));
  }
  const result = sentenceWords.join(' ');
  return result.charAt(0).toUpperCase() + result.slice(1) + '.';
}

function generateLocalParagraph(theme: TextTheme, isFirst: boolean, startWithLorem: boolean): string {
  if (theme === 'turkish') {
    const count = 4 + Math.floor(Math.random() * 3);
    const shuffled = [...TURKISH_SENTENCES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).join(' ');
  }

  if (theme === 'tech') {
    const count = 4 + Math.floor(Math.random() * 3);
    const shuffled = [...TECH_SENTENCES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).join(' ');
  }

  const words = theme === 'classic' ? CLASSIC_WORDS : BACON_WORDS;
  const sentenceCount = 4 + Math.floor(Math.random() * 3);
  const sentences: string[] = [];

  for (let i = 0; i < sentenceCount; i++) {
    if (isFirst && i === 0 && startWithLorem) {
      if (theme === 'classic') {
        sentences.push('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
      } else {
        sentences.push('Bacon ipsum dolor amet pork belly short ribs sirloin, ground round shank drumstick tenderloin pastrami.');
      }
    } else {
      sentences.push(generateSentenceFromWords(words));
    }
  }

  return sentences.join(' ');
}

export function generateLocalParagraphs(options: GenerateOptions): GenerationResult {
  const count = Math.max(1, options.paras);
  const theme = options.theme || 'bacon';
  const startWithLorem = options.startWithLorem !== false;
  const paragraphs: string[] = [];

  for (let i = 0; i < count; i++) {
    paragraphs.push(generateLocalParagraph(theme, i === 0, startWithLorem));
  }

  return formatResult(paragraphs, options.format, 'local', options.includeSignature);
}

function formatResult(
  paragraphs: string[],
  format: FormatType,
  source: 'api' | 'local',
  includeSignature = false
): GenerationResult {
  let rawText = '';

  if (format === 'html') {
    const htmlBlocks = paragraphs.map(p => `<p>${p}</p>`);
    if (includeSignature) {
      htmlBlocks.push('<!-- Hazırlayan: Enes Öztürk -->');
      htmlBlocks.push('<p class="signature"><small>Oluşturan: Enes Öztürk</small></p>');
    }
    rawText = htmlBlocks.join('\n');
  } else {
    rawText = paragraphs.join('\n\n');
    if (includeSignature) {
      rawText += '\n\n— Enes Öztürk';
    }
  }

  const totalText = paragraphs.join(' ');
  const words = totalText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const charCount = totalText.length;
  const readingTimeMinutes = Math.max(0.5, Math.round((wordCount / 200) * 10) / 10);

  return {
    paragraphs,
    rawText,
    source,
    wordCount,
    charCount,
    readingTimeMinutes,
  };
}

/**
 * Fetch paragraphs from Bacon Ipsum API with automated graceful local fallback
 */
export async function fetchParagraphs(options: GenerateOptions): Promise<GenerationResult> {
  const count = Math.max(1, options.paras);
  const format = options.format;
  const theme = options.theme || 'bacon';

  // If user explicitly picked Turkish, Tech, or Classic, use the rich local engine
  if (theme !== 'bacon') {
    return generateLocalParagraphs(options);
  }

  // Attempt fetch from Bacon Ipsum API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const apiUrl = `https://baconipsum.com/api/?type=all-meat&paras=${count}&format=${format}`;
    const response = await fetch(apiUrl, {
      signal: controller.signal,
      headers: {
        'Accept': format === 'html' ? 'text/html, text/plain' : 'text/plain, application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API response status: ${response.status}`);
    }

    const textData = await response.text();

    if (format === 'html') {
      // Parse HTML paragraphs from response: e.g. <p>...</p>
      const paragraphMatches = textData.match(/<p>([\s\S]*?)<\/p>/gi);
      let paragraphs: string[] = [];

      if (paragraphMatches && paragraphMatches.length > 0) {
        paragraphs = paragraphMatches.map(m => m.replace(/<\/?p>/gi, '').trim());
      } else {
        // Fallback split by lines if p tags weren't standard
        paragraphs = textData
          .split(/<\/p>\s*<p>/i)
          .map(s => s.replace(/<\/?p>/gi, '').trim())
          .filter(Boolean);
      }

      if (paragraphs.length === 0) {
        paragraphs = [textData.replace(/<[^>]+>/g, '').trim()];
      }

      return formatResult(paragraphs, 'html', 'api', options.includeSignature);
    } else {
      // Text response comes as paragraphs separated by newlines
      const paragraphs = textData
        .split(/\r?\n\r?\n/)
        .map(p => p.trim())
        .filter(Boolean);

      if (paragraphs.length === 0 && textData.trim()) {
        paragraphs.push(textData.trim());
      }

      return formatResult(paragraphs, 'text', 'api', options.includeSignature);
    }
  } catch {
    // Graceful and instant fallback to high-fidelity local generator
    return generateLocalParagraphs(options);
  }
}
