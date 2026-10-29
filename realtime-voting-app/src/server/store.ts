import fs from 'fs';
import path from 'path';

export interface Option {
  id: string;
  text: string;
  votes_count: number;
}

export interface Question {
  id: string;
  title: string;
  description?: string;
  category: string;
  creator: string;
  created_at: string;
  options: Option[];
}

export interface QuestionWithComputed extends Question {
  total_votes: number;
  options: (Option & { percentage: number })[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'polls.json');

const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q-react-2026',
    title: 'En çok hangi modern frontend framework veya kütüphanesini tercih ediyorsunuz?',
    description: 'Büyük ölçekli web uygulamaları geliştirirken geliştirici deneyimi, performans ve ekosistem açısından favoriniz hangisi?',
    category: 'Yazılım',
    creator: 'Enes Öztürk',
    created_at: '2026-10-28T14:30:00.000Z',
    options: [
      { id: 'opt-react', text: 'React 19 & Next.js', votes_count: 58 },
      { id: 'opt-vue', text: 'Vue 3 & Nuxt', votes_count: 24 },
      { id: 'opt-svelte', text: 'Svelte 5 (Runes)', votes_count: 19 },
      { id: 'opt-angular', text: 'Angular (Signals)', votes_count: 11 },
      { id: 'opt-solid', text: 'SolidJS', votes_count: 7 },
    ],
  },
  {
    id: 'q-ai-tools',
    title: 'Günlük yazılım ve kodlama sürecinizde en çok verim aldığınız yapay zeka aracı hangisi?',
    description: 'Kod tamamlama, refactoring, mimari tasarım ve hata ayıklama süreçlerinde birincil yardımcınız.',
    category: 'Yapay Zeka',
    creator: 'Enes Öztürk',
    created_at: '2026-10-27T09:15:00.000Z',
    options: [
      { id: 'opt-cursor', text: 'Cursor / Windsurf AI IDE', votes_count: 45 },
      { id: 'opt-gemini', text: 'Google Gemini & AI Studio', votes_count: 41 },
      { id: 'opt-claude', text: 'Claude Code & Artifacts', votes_count: 36 },
      { id: 'opt-copilot', text: 'GitHub Copilot', votes_count: 22 },
    ],
  },
  {
    id: 'q-graphql-vs-rest',
    title: 'Gerçek zamanlı ve veri yoğun uygulamalarda API protokolü tercihiniz?',
    description: 'Performans, veri çekme esnekliği ve anlık güncelleme gereksinimleri göz önüne alındığında.',
    category: 'Backend',
    creator: 'Enes Öztürk',
    created_at: '2026-10-26T18:00:00.000Z',
    options: [
      { id: 'opt-graphql', text: 'GraphQL (Subscriptions + Queries)', votes_count: 52 },
      { id: 'opt-rest', text: 'REST API + WebSockets', votes_count: 30 },
      { id: 'opt-trpc', text: 'tRPC + Server-Sent Events', votes_count: 26 },
      { id: 'opt-grpc', text: 'gRPC-Web', votes_count: 9 },
    ],
  },
  {
    id: 'q-remote-work',
    title: 'Yazılımcılar için ideal çalışma modeli sizce hangisi?',
    description: 'İş-yaşam dengesi, takım içi üretkenlik ve şirket kültürü açısından değerlendirildiğinde.',
    category: 'Kariyer',
    creator: 'Enes Öztürk',
    created_at: '2026-10-25T11:45:00.000Z',
    options: [
      { id: 'opt-full-remote', text: 'Tamamen Uzaktan (Full Remote)', votes_count: 84 },
      { id: 'opt-hybrid-flex', text: 'Esnek Hibrit (Haftada 1-2 gün)', votes_count: 41 },
      { id: 'opt-async-global', text: 'Asenkron / Zaman Dilimi Bağımsız', votes_count: 29 },
      { id: 'opt-office', text: 'Tamamen Ofis', votes_count: 4 },
    ],
  },
];

class PollStore {
  private questions: Question[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.questions = parsed;
          return;
        }
      }
    } catch (err) {
      console.warn('Could not read existing polls file, using initial data:', err);
    }

    this.questions = JSON.parse(JSON.stringify(INITIAL_QUESTIONS));
    this.save();
  }

  private save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.questions, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save polls data to disk:', err);
    }
  }

  public getAll(): QuestionWithComputed[] {
    return this.questions
      .slice()
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map((q) => this.computeStats(q));
  }

  public getById(id: string): QuestionWithComputed | null {
    const q = this.questions.find((item) => item.id === id);
    if (!q) return null;
    return this.computeStats(q);
  }

  public create(input: {
    title: string;
    description?: string;
    category?: string;
    creator?: string;
    options: { text: string }[];
  }): QuestionWithComputed {
    const newId = 'q-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
    const newQuestion: Question = {
      id: newId,
      title: input.title.trim(),
      description: input.description?.trim() || '',
      category: input.category?.trim() || 'Genel',
      creator: input.creator?.trim() || 'Enes Öztürk',
      created_at: new Date().toISOString(),
      options: input.options.map((opt, idx) => ({
        id: `opt-${newId}-${idx + 1}`,
        text: opt.text.trim(),
        votes_count: 0,
      })),
    };

    // Unshift so new questions are immediately at the top
    this.questions.unshift(newQuestion);
    this.save();
    return this.computeStats(newQuestion);
  }

  public vote(questionId: string, optionId: string): QuestionWithComputed {
    const q = this.questions.find((item) => item.id === questionId);
    if (!q) {
      throw new Error(`Soru bulunamadı: ID ${questionId}`);
    }
    const option = q.options.find((opt) => opt.id === optionId);
    if (!option) {
      throw new Error(`Seçenek bulunamadı: ID ${optionId}`);
    }

    option.votes_count += 1;
    this.save();
    return this.computeStats(q);
  }

  public delete(id: string): boolean {
    const idx = this.questions.findIndex((item) => item.id === id);
    if (idx === -1) return false;
    this.questions.splice(idx, 1);
    this.save();
    return true;
  }

  public reset(): boolean {
    this.questions = JSON.parse(JSON.stringify(INITIAL_QUESTIONS));
    this.save();
    return true;
  }

  public getStats() {
    const totalQuestions = this.questions.length;
    let totalVotes = 0;
    for (const q of this.questions) {
      for (const opt of q.options) {
        totalVotes += opt.votes_count;
      }
    }
    return {
      totalQuestions,
      totalVotes,
      activeUsers: Math.max(12, Math.floor(totalVotes * 0.45)),
    };
  }

  public computeStats(q: Question): QuestionWithComputed {
    const totalVotes = q.options.reduce((sum, opt) => sum + (opt.votes_count || 0), 0);
    const optionsWithPercentage = q.options.map((opt) => {
      const percentage = totalVotes > 0 ? (opt.votes_count / totalVotes) * 100 : 0;
      return {
        ...opt,
        percentage: Number(percentage.toFixed(1)),
      };
    });

    return {
      ...q,
      total_votes: totalVotes,
      options: optionsWithPercentage,
    };
  }
}

export const pollStore = new PollStore();
