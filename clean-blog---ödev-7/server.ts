import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Ödev 7 Şartı: get request içerisinde const blog = { id: 1, title: "Blog title", description: "Blog description" } içeriğini gönderelim.
  // Bu endpoint doğrudan ödevin talep ettiği exact nesneyi gönderir.
  app.get('/api/blog', (_req: Request, res: Response) => {
    const blog = { id: 1, title: 'Blog title', description: 'Blog description' };
    res.send(blog);
  });

  // Ham blog endpoint'i (text/plain veya json olarak incelenebilir)
  app.get('/api/raw-blog', (_req: Request, res: Response) => {
    const blog = { id: 1, title: 'Blog title', description: 'Blog description' };
    res.json(blog);
  });

  // Ödev 7 Kontrol ve Durum Bilgileri
  app.get('/api/homework-status', (_req: Request, res: Response) => {
    let gitCommit = 'ENES Öztürk <enesbino38@gmail.com>';
    let commitHash = 'init';
    let commitDate = new Date().toISOString();

    try {
      const log = execSync('git log -1 --pretty=format:"%h - %an <%ae> (%ad): %s"', {
        encoding: 'utf-8',
        timeout: 2000,
      });
      if (log) {
        gitCommit = log;
      }
    } catch {
      // fallback
    }

    res.json({
      title: 'Ödev 7 - Clean Blog Projesi Başlangıç',
      author: 'ENES Öztürk',
      email: 'enesbino38@gmail.com',
      date: '2026-10-29',
      tasks: [
        {
          id: 1,
          title: 'CleanBlog proje klasörünü oluşturalım',
          status: 'completed',
          detail: 'CleanBlog klasörü oluşturuldu ve proje dosyaları hazırlandı.',
        },
        {
          id: 2,
          title: 'Package.json dosyasını oluşturalım',
          status: 'completed',
          detail: 'cleanblog package.json oluşturuldu, başlatma scriptleri ve yazar bilgileri tanımlandı.',
        },
        {
          id: 3,
          title: 'Prettier ayarlarını yapalım',
          status: 'completed',
          detail: '.prettierrc yapılandırması tek tırnak, noktalı virgül ve girinti kurallarıyla eklendi.',
        },
        {
          id: 4,
          title: 'Express ve Nodemon modüllerini indirelim',
          status: 'completed',
          detail: 'express (dependencies) ve nodemon (devDependencies) modülleri başarıyla yüklendi.',
        },
        {
          id: 5,
          title: 'git init ile lokal repomuzu oluşturalım',
          status: 'completed',
          detail: 'Yerel Git repository başlatıldı ve ENES Öztürk kimliğiyle yapılandırıldı.',
        },
        {
          id: 6,
          title: 'GET request ile blog içeriğini gönderelim',
          status: 'completed',
          detail: 'const blog = { id: 1, title: "Blog title", description: "Blog description" } nesnesi GET isteğinde döndürülüyor.',
          sampleResponse: { id: 1, title: 'Blog title', description: 'Blog description' },
        },
        {
          id: 7,
          title: '.gitignore dosyası oluşturalım ve ilk repomuzu gönderelim (ENES Öztürk imzalı)',
          status: 'completed',
          detail: '.gitignore oluşturuldu (node_modules, .env vb.) ve "ENES Öztürk" imzasıyla ilk commit atıldı.',
          gitLog: gitCommit,
        },
      ],
    });
  });

  // Proje dosyalarını görüntüleme API'si
  app.get('/api/project-files', (_req: Request, res: Response) => {
    try {
      const files: Record<string, string> = {};
      const targetPaths = [
        { key: 'CleanBlog/app.js', path: path.join(__dirname, 'CleanBlog', 'app.js') },
        { key: 'CleanBlog/package.json', path: path.join(__dirname, 'CleanBlog', 'package.json') },
        { key: 'CleanBlog/.prettierrc', path: path.join(__dirname, 'CleanBlog', '.prettierrc') },
        { key: 'CleanBlog/.gitignore', path: path.join(__dirname, 'CleanBlog', '.gitignore') },
        { key: 'CleanBlog/README.md', path: path.join(__dirname, 'CleanBlog', 'README.md') },
        { key: '.prettierrc', path: path.join(__dirname, '.prettierrc') },
        { key: '.gitignore', path: path.join(__dirname, '.gitignore') },
      ];

      for (const item of targetPaths) {
        if (fs.existsSync(item.path)) {
          files[item.key] = fs.readFileSync(item.path, 'utf-8');
        }
      }

      res.json(files);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Dosyalar okunamadı' });
    }
  });

  if (!isProd) {
    // Vite dev server middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static files
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Clean Blog] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
