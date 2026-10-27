import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// API: Get package information and status
app.get('/api/package/info', async (req, res) => {
  try {
    const pkgPath = path.join(__dirname, 'packages/enes-ozturk-button/package.json');
    const readmePath = path.join(__dirname, 'packages/enes-ozturk-button/README.md');
    const tgzPath = path.join(__dirname, 'public/enes-ozturk-button-1.0.0.tgz');

    const pkgData = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    const readme = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, 'utf-8') : '';
    let tarballSize = 0;
    if (fs.existsSync(tgzPath)) {
      tarballSize = fs.statSync(tgzPath).size;
    }

    res.json({
      success: true,
      name: pkgData.name,
      version: pkgData.version,
      description: pkgData.description,
      author: pkgData.author,
      license: pkgData.license,
      keywords: pkgData.keywords,
      tarballSize,
      tarballUrl: '/enes-ozturk-button-1.0.0.tgz',
      files: pkgData.files,
      readme,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Download Tarball (.tgz)
app.get('/api/package/download', (req, res) => {
  const tgzPath = path.join(__dirname, 'public/enes-ozturk-button-1.0.0.tgz');
  if (fs.existsSync(tgzPath)) {
    res.download(tgzPath, 'enes-ozturk-button-1.0.0.tgz');
  } else {
    res.status(404).json({ error: 'Package tarball not found. Run build first.' });
  }
});

// API: Publish to NPM (supports user NPM token or dry-run validation)
app.post('/api/npm/publish', async (req, res) => {
  const { token, dryRun = false } = req.body;
  const pkgDir = path.join(__dirname, 'packages/enes-ozturk-button');

  try {
    // 1. Ensure package is freshly built and packed
    await execAsync(`node build.js && npm pack`, { cwd: pkgDir });
    
    // Copy new tarball to public
    const copySrc = path.join(pkgDir, 'enes-ozturk-button-1.0.0.tgz');
    const copyDest = path.join(__dirname, 'public/enes-ozturk-button-1.0.0.tgz');
    if (fs.existsSync(copySrc)) {
      fs.copyFileSync(copySrc, copyDest);
    }

    if (dryRun || !token) {
      // Execute dry-run to test package validity against registry
      const { stdout, stderr } = await execAsync(`npm publish --dry-run`, { cwd: pkgDir });
      return res.json({
        success: true,
        dryRun: true,
        message: 'NPM Paketi doğrulandı! Paket npmjs.com yayını için hazır.',
        output: stdout || stderr,
      });
    }

    // With user NPM token, write temporary .npmrc for publishing
    const npmrcPath = path.join(pkgDir, '.npmrc');
    const cleanToken = token.trim();
    fs.writeFileSync(npmrcPath, `//registry.npmjs.org/:_authToken=${cleanToken}\n`);

    try {
      const { stdout, stderr } = await execAsync(`npm publish --access public`, { cwd: pkgDir });
      // Remove temporary npmrc with token
      if (fs.existsSync(npmrcPath)) fs.unlinkSync(npmrcPath);

      return res.json({
        success: true,
        dryRun: false,
        message: 'Tebrikler! enes-ozturk-button paketi başarıyla npmjs.com üzerine yüklendi!',
        output: stdout || stderr,
      });
    } catch (publishErr: any) {
      if (fs.existsSync(npmrcPath)) fs.unlinkSync(npmrcPath);
      return res.status(400).json({
        success: false,
        error: publishErr.message || 'Yayınlama başarısız oldu.',
        output: publishErr.stderr || publishErr.stdout,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Build ve paketleme hatası oluştu.',
    });
  }
});

// Vite middleware in dev or static server in prod
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
