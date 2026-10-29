import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE_PATH = path.resolve(__dirname, 'employees.json');
const AUTHOR_SIGNATURE = 'ENES ÖZTÜRK';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Helper function to get file status
  const getFileStats = async () => {
    try {
      const stats = await fs.promises.stat(DATA_FILE_PATH);
      const content = await fs.promises.readFile(DATA_FILE_PATH, 'utf8');
      let parsed = null;
      try {
        parsed = JSON.parse(content);
      } catch {
        parsed = null;
      }
      return {
        exists: true,
        size: stats.size,
        modifiedAt: stats.mtime.toISOString(),
        createdAt: stats.birthtime.toISOString(),
        path: 'employees.json',
        rawContent: content,
        data: parsed,
      };
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        return {
          exists: false,
          size: 0,
          modifiedAt: null,
          createdAt: null,
          path: 'employees.json',
          rawContent: null,
          data: null,
        };
      }
      throw err;
    }
  };

  // API: Get current file status
  app.get('/api/fs/status', async (req, res) => {
    try {
      const stats = await getFileStats();
      res.json({
        success: true,
        author: AUTHOR_SIGNATURE,
        ...stats,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API: CREATE (YARAT) - fs.writeFile
  app.post('/api/fs/create', async (req, res) => {
    const payload = req.body.data || {
      name: 'Employee 1 Name',
      salary: 2000,
    };
    const content = JSON.stringify(payload, null, 2);

    try {
      await fs.promises.writeFile(DATA_FILE_PATH, content, 'utf8');
      const stats = await getFileStats();
      res.json({
        success: true,
        action: 'CREATE',
        method: 'fs.writeFile("employees.json", data, "utf8")',
        message: 'employees.json dosyası başarıyla oluşturuldu ve veri yazıldı.',
        author: AUTHOR_SIGNATURE,
        writtenData: payload,
        fileStats: stats,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API: READ (OKU) - fs.readFile
  app.get('/api/fs/read', async (req, res) => {
    try {
      if (!fs.existsSync(DATA_FILE_PATH)) {
        return res.status(404).json({
          success: false,
          action: 'READ',
          error: 'ENOENT: no such file or directory, open "employees.json"',
          message: 'employees.json dosyası bulunamadı. Lütfen önce oluşturun.',
        });
      }

      const content = await fs.promises.readFile(DATA_FILE_PATH, 'utf8');
      const parsed = JSON.parse(content);

      res.json({
        success: true,
        action: 'READ',
        method: 'fs.readFile("employees.json", "utf8")',
        message: 'employees.json başarıyla okundu.',
        author: AUTHOR_SIGNATURE,
        rawContent: content,
        data: parsed,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API: UPDATE (GÜNCELLE) - fs.writeFile with updated content
  app.put('/api/fs/update', async (req, res) => {
    try {
      if (!fs.existsSync(DATA_FILE_PATH)) {
        return res.status(404).json({
          success: false,
          action: 'UPDATE',
          error: 'ENOENT: no such file or directory, open "employees.json"',
          message: 'Güncellenecek employees.json dosyası bulunamadı. Lütfen önce oluşturun.',
        });
      }

      // Read current content first
      const currentContent = await fs.promises.readFile(DATA_FILE_PATH, 'utf8');
      const currentData = JSON.parse(currentContent);

      // Apply update: if req.body has data, use it; otherwise default update according to homework
      const updatedData = req.body.data || {
        ...currentData,
        salary: req.body.salary || (currentData.salary ? currentData.salary + 500 : 2500),
        name: req.body.name || currentData.name || 'Employee 1 Name (Updated)',
        updatedAt: new Date().toLocaleTimeString('tr-TR'),
      };

      const newContent = JSON.stringify(updatedData, null, 2);
      await fs.promises.writeFile(DATA_FILE_PATH, newContent, 'utf8');

      const stats = await getFileStats();

      res.json({
        success: true,
        action: 'UPDATE',
        method: 'fs.writeFile("employees.json", updatedData, "utf8")',
        message: 'employees.json dosyası başarıyla güncellendi.',
        author: AUTHOR_SIGNATURE,
        previousData: currentData,
        updatedData: updatedData,
        fileStats: stats,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API: DELETE (SİL) - fs.unlink
  app.delete('/api/fs/delete', async (req, res) => {
    try {
      if (!fs.existsSync(DATA_FILE_PATH)) {
        return res.status(404).json({
          success: false,
          action: 'DELETE',
          error: 'ENOENT: no such file or directory, unlink "employees.json"',
          message: 'Silinecek employees.json dosyası zaten mevcut değil.',
        });
      }

      await fs.promises.unlink(DATA_FILE_PATH);

      res.json({
        success: true,
        action: 'DELETE',
        method: 'fs.unlink("employees.json")',
        message: 'employees.json dosyası başarıyla silindi.',
        author: AUTHOR_SIGNATURE,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API: RUN-ALL - Execute the entire sequence with detailed logs
  app.post('/api/fs/run-all', async (req, res) => {
    const logs: Array<{ step: string; action: string; method: string; detail: any; time: string }> = [];
    const timestamp = () => new Date().toLocaleTimeString('tr-TR');

    try {
      // Step 1: CREATE
      const initialData = { name: 'Employee 1 Name', salary: 2000 };
      await fs.promises.writeFile(DATA_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf8');
      logs.push({
        step: '1/4 (YARAT)',
        action: 'CREATE',
        method: 'fs.writeFile("employees.json", data, "utf8")',
        detail: initialData,
        time: timestamp(),
      });

      // Small pause to mimic real sequence
      await new Promise((r) => setTimeout(r, 200));

      // Step 2: READ
      const readRaw = await fs.promises.readFile(DATA_FILE_PATH, 'utf8');
      const readData = JSON.parse(readRaw);
      logs.push({
        step: '2/4 (OKU)',
        action: 'READ',
        method: 'fs.readFile("employees.json", "utf8")',
        detail: readData,
        time: timestamp(),
      });

      await new Promise((r) => setTimeout(r, 200));

      // Step 3: UPDATE
      const updatedData = { ...readData, salary: 2500, updatedBy: 'ENES ÖZTÜRK' };
      await fs.promises.writeFile(DATA_FILE_PATH, JSON.stringify(updatedData, null, 2), 'utf8');
      logs.push({
        step: '3/4 (GÜNCELLE)',
        action: 'UPDATE',
        method: 'fs.writeFile("employees.json", updatedData, "utf8")',
        detail: updatedData,
        time: timestamp(),
      });

      await new Promise((r) => setTimeout(r, 200));

      // Step 4: DELETE
      await fs.promises.unlink(DATA_FILE_PATH);
      logs.push({
        step: '4/4 (SİL)',
        action: 'DELETE',
        method: 'fs.unlink("employees.json")',
        detail: { status: 'Dosya silindi' },
        time: timestamp(),
      });

      res.json({
        success: true,
        author: AUTHOR_SIGNATURE,
        message: 'Tüm CRUD adımları (Yarat -> Oku -> Güncelle -> Sil) başarıyla tamamlandı.',
        logs,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message, logs });
    }
  });

  // Mount Vite or static dist
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(__dirname, 'dist'))) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Node.js FS Server] Running at http://0.0.0.0:${PORT}`);
    console.log(`[Ödev 4] FS Modülü Hazırlayan: ${AUTHOR_SIGNATURE}`);
  });
}

startServer();
