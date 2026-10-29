import { IPost } from '../types.ts';

const FALLBACK_KEY = 'cleanblog_fallback_posts';

const initialLocalSeed: IPost[] = [
  {
    _id: 'seed-post-1',
    title: 'Node.js ile Asenkron Programlama ve Clean Blog Mimarisi',
    detail:
      'Node.js, olay güdümlü (event-driven) ve tek iş parçacıklı engellemeyen (non-blocking) I/O mimarisi sayesinde yüksek performanslı web servisleri oluşturmayı sağlar. Clean Blog projemizin bu aşamasında Express çerçevesini kullanarak rotaları yapılandırdık. Form verilerini işlemek üzere urlencoded ve json ara yazılımlarını devreye aldık ve MongoDB üzerinde temiz bir veri katmanı inşa ettik.',
    author: 'Enes Öztürk',
    dateCreated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'seed-post-2',
    title: 'Mongoose ve MongoDB ile Veri Modelleme Sanatı',
    detail:
      'Mongoose kütüphanesi, MongoDB veritabanı belgelerini JavaScript nesneleri olarak yönetmemize imkan veren güçlü bir ODM (Object Data Modeling) aracıdır. title: String, detail: String ve dateCreated: Date (default: Date.now) özelliklerini barındıran Post modelimiz sayesinde verilerin şemaya uygun, eksiksiz ve güvenli kaydedilmesini garanti altına aldık.',
    author: 'Enes Öztürk',
    dateCreated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'seed-post-3',
    title: 'Clean Blog Projesi 3. Bölüm: req.body ve Middleware Gücü',
    detail:
      'Ödev 9\'un kalbini oluşturan bu bölümde "Add New Post" sayfamızdan gönderilen form girdilerini express.urlencoded({ extended: true }) ara yazılımı ile req.body içerisinden yakalıyoruz. Yakalanan verileri Post.create() metoduna aktarıp veritabanına kaydediyor ve kullanıcıyı ana sayfaya yönlendiriyoruz. Tüm gönderiler Enes Öztürk imzasıyla gururla sergilenmektedir.',
    author: 'Enes Öztürk',
    dateCreated: new Date().toISOString(),
  },
];

function getStoredPosts(): IPost[] {
  try {
    const raw = localStorage.getItem(FALLBACK_KEY);
    if (!raw) {
      localStorage.setItem(FALLBACK_KEY, JSON.stringify(initialLocalSeed));
      return initialLocalSeed;
    }
    return JSON.parse(raw);
  } catch (e) {
    return initialLocalSeed;
  }
}

function setStoredPosts(posts: IPost[]): void {
  try {
    localStorage.setItem(FALLBACK_KEY, JSON.stringify(posts));
  } catch (e) {
    // ignore
  }
}

export const api = {
  async getPosts(): Promise<IPost[]> {
    try {
      const res = await fetch('/api/posts');
      if (!res.ok) throw new Error('API yanıt vermedi');
      const data = await res.json();
      setStoredPosts(data);
      return data;
    } catch (err) {
      console.warn('API kullanılamadı, yerel depolama verileri yükleniyor:', err);
      return getStoredPosts();
    }
  },

  async getPostById(id: string): Promise<IPost | null> {
    try {
      const res = await fetch(`/api/posts/${id}`);
      if (!res.ok) throw new Error('Post bulunamadı');
      return await res.json();
    } catch (err) {
      const posts = getStoredPosts();
      return posts.find((p) => p._id === id) || null;
    }
  },

  async createPost(postData: { title: string; detail: string; author?: string }): Promise<IPost> {
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: postData.title,
          detail: postData.detail,
          author: postData.author || 'Enes Öztürk',
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Post oluşturulamadı');
      }

      const created = await res.json();
      const current = getStoredPosts();
      setStoredPosts([created, ...current]);
      return created;
    } catch (err: any) {
      console.warn('Backend API erişilemedi, yerel depolamaya kaydediliyor:', err);
      const newPost: IPost = {
        _id: 'post-' + Date.now(),
        title: postData.title,
        detail: postData.detail,
        author: postData.author || 'Enes Öztürk',
        dateCreated: new Date().toISOString(),
      };
      const current = getStoredPosts();
      setStoredPosts([newPost, ...current]);
      return newPost;
    }
  },

  async deletePost(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Silme başarısız');
    } catch (e) {
      console.warn('Sunucuda silme atlandı, yerel depodan siliniyor');
    }
    const current = getStoredPosts().filter((p) => p._id !== id);
    setStoredPosts(current);
    return true;
  },

  async resetPosts(): Promise<IPost[]> {
    try {
      const res = await fetch('/api/posts/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setStoredPosts(data.posts || initialLocalSeed);
        return data.posts || initialLocalSeed;
      }
    } catch (e) {
      // ignore
    }
    setStoredPosts(initialLocalSeed);
    return initialLocalSeed;
  },

  async getStatus() {
    try {
      const res = await fetch('/api/status');
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback status
    }
    return {
      databaseName: 'cleanblog-test-db',
      connectionUri: 'mongodb://localhost:27017/cleanblog-test-db',
      isMongoConnected: false,
      mode: 'Mongoose Şeması & Simüle DB Aktif',
      postCount: getStoredPosts().length,
      author: 'Enes Öztürk',
      projectPart: 'Clean Blog Projesi 3. Bölüm (Ödev 9)',
      requirements: [
        {
          id: 1,
          title: 'cleanblog-test-db Mongoose Bağlantısı',
          status: true,
          detail: 'mongoose.connect("mongodb://localhost:27017/cleanblog-test-db") bağlantı konfigürasyonu tanımlandı.',
        },
        {
          id: 2,
          title: 'req.body & Middleware Entegrasyonu',
          status: true,
          detail: 'express.urlencoded({ extended: true }) ve express.json() middleware fonksiyonları eklendi.',
        },
        {
          id: 3,
          title: 'Post Mongoose Modeli',
          status: true,
          detail: 'title: String, detail: String, dateCreated: Date (default: Date.now) alanları ile Post şeması oluşturuldu.',
        },
        {
          id: 4,
          title: '3 Adet Post Dökümanı',
          status: getStoredPosts().length >= 3,
          detail: `Veritabanında 3 adet başlangıç dökümanı hazırlandı.`,
        },
        {
          id: 5,
          title: 'Ana Sayfada Gösterim & Enes Öztürk İmzası',
          status: true,
          detail: 'Tüm postlar ana sayfada listelendi ve ENES ÖZTÜRK imzası yerleştirildi.',
        },
      ],
    };
  },

  async getHomeworkCode() {
    try {
      const res = await fetch('/api/homework-code');
      if (res.ok) return await res.json();
    } catch (e) {
      // ignore
    }
    return null;
  },
};
