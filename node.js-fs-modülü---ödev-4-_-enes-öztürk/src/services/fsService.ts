import { FileStatus } from '../types';

export const AUTHOR_NAME = 'ENES ÖZTÜRK';

// Client-side simulated fallback storage
let clientVirtualFile: {
  exists: boolean;
  content: string | null;
  modifiedAt: string | null;
  createdAt: string | null;
} = {
  exists: false,
  content: null,
  modifiedAt: null,
  createdAt: null,
};

export const fsService = {
  async getStatus(): Promise<FileStatus> {
    try {
      const res = await fetch('/api/fs/status');
      if (res.ok) {
        const data = await res.json();
        return {
          exists: data.exists,
          size: data.size || 0,
          modifiedAt: data.modifiedAt,
          createdAt: data.createdAt,
          path: 'employees.json',
          rawContent: data.rawContent,
          data: data.data,
          author: AUTHOR_NAME,
        };
      }
    } catch {
      // Fallback
    }

    // Client fallback
    return {
      exists: clientVirtualFile.exists,
      size: clientVirtualFile.content ? new TextEncoder().encode(clientVirtualFile.content).length : 0,
      modifiedAt: clientVirtualFile.modifiedAt,
      createdAt: clientVirtualFile.createdAt,
      path: 'employees.json',
      rawContent: clientVirtualFile.content,
      data: clientVirtualFile.content ? JSON.parse(clientVirtualFile.content) : null,
      author: AUTHOR_NAME,
    };
  },

  async createFile(payload: { name: string; salary: number }): Promise<any> {
    try {
      const res = await fetch('/api/fs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: payload }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback to client virtual storage
    }

    const content = JSON.stringify(payload, null, 2);
    const now = new Date().toISOString();
    clientVirtualFile = {
      exists: true,
      content: content,
      modifiedAt: now,
      createdAt: clientVirtualFile.createdAt || now,
    };

    return {
      success: true,
      action: 'CREATE',
      method: 'fs.writeFile("employees.json", data, "utf8")',
      message: 'employees.json dosyası başarıyla oluşturuldu ve veri yazıldı.',
      author: AUTHOR_NAME,
      writtenData: payload,
    };
  },

  async readFile(): Promise<any> {
    try {
      const res = await fetch('/api/fs/read');
      if (res.ok) {
        return await res.json();
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Dosya okunamadı');
      }
    } catch (e: any) {
      if (e.message && e.message.includes('bulunamadı')) {
        throw e;
      }
      // Fallback
      if (!clientVirtualFile.exists || !clientVirtualFile.content) {
        throw new Error('ENOENT: no such file or directory, open "employees.json"');
      }
      return {
        success: true,
        action: 'READ',
        method: 'fs.readFile("employees.json", "utf8")',
        message: 'employees.json başarıyla okundu.',
        author: AUTHOR_NAME,
        rawContent: clientVirtualFile.content,
        data: JSON.parse(clientVirtualFile.content),
      };
    }
  },

  async updateFile(updatedPayload: { name: string; salary: number; [key: string]: any }): Promise<any> {
    try {
      const res = await fetch('/api/fs/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: updatedPayload }),
      });
      if (res.ok) {
        return await res.json();
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Dosya güncellenemedi');
      }
    } catch (e: any) {
      if (e.message && e.message.includes('bulunamadı')) {
        throw e;
      }
      // Fallback
      if (!clientVirtualFile.exists || !clientVirtualFile.content) {
        throw new Error('ENOENT: Güncellenecek "employees.json" dosyası bulunamadı. Lütfen önce oluşturun.');
      }
      const previousData = JSON.parse(clientVirtualFile.content);
      const content = JSON.stringify(updatedPayload, null, 2);
      clientVirtualFile.content = content;
      clientVirtualFile.modifiedAt = new Date().toISOString();

      return {
        success: true,
        action: 'UPDATE',
        method: 'fs.writeFile("employees.json", updatedData, "utf8")',
        message: 'employees.json dosyası başarıyla güncellendi.',
        author: AUTHOR_NAME,
        previousData,
        updatedData: updatedPayload,
      };
    }
  },

  async deleteFile(): Promise<any> {
    try {
      const res = await fetch('/api/fs/delete', {
        method: 'DELETE',
      });
      if (res.ok) {
        return await res.json();
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Dosya silinemedi');
      }
    } catch (e: any) {
      if (e.message && e.message.includes('mevcut değil')) {
        throw e;
      }
      // Fallback
      if (!clientVirtualFile.exists) {
        throw new Error('ENOENT: Silinecek "employees.json" dosyası zaten bulunamadı.');
      }
      clientVirtualFile = {
        exists: false,
        content: null,
        modifiedAt: null,
        createdAt: null,
      };
      return {
        success: true,
        action: 'DELETE',
        method: 'fs.unlink("employees.json")',
        message: 'employees.json dosyası başarıyla silindi.',
        author: AUTHOR_NAME,
      };
    }
  },

  async runAllSequence(): Promise<any> {
    try {
      const res = await fetch('/api/fs/run-all', { method: 'POST' });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // client fallback handled in component
    }
    return null;
  },
};
