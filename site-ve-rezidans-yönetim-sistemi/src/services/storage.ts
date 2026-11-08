import {
  INITIAL_DAIRELER,
  INITIAL_FATURALAR,
  INITIAL_KULLANICILAR,
  INITIAL_MESAJLAR,
  INITIAL_ODEMELER,
} from '../data/initialData';
import { Daire, FaturaAidat, Kullanici, Mesaj, Odeme } from '../types';

const STORAGE_KEYS = {
  DAIRELER: 'enes_site_daireler_v1',
  KULLANICILAR: 'enes_site_kullanicilar_v1',
  FATURALAR: 'enes_site_faturalar_v1',
  ODEMELER: 'enes_site_odemeler_v1',
  MESAJLAR: 'enes_site_mesajlar_v1',
};

export const StorageService = {
  // Daireler
  getDaireler(): Daire[] {
    const data = localStorage.getItem(STORAGE_KEYS.DAIRELER);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.DAIRELER, JSON.stringify(INITIAL_DAIRELER));
      return INITIAL_DAIRELER;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_DAIRELER;
    }
  },

  saveDaireler(daireler: Daire[]) {
    localStorage.setItem(STORAGE_KEYS.DAIRELER, JSON.stringify(daireler));
  },

  // Kullanıcılar (Sakinler)
  getKullanicilar(): Kullanici[] {
    const data = localStorage.getItem(STORAGE_KEYS.KULLANICILAR);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.KULLANICILAR, JSON.stringify(INITIAL_KULLANICILAR));
      return INITIAL_KULLANICILAR;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_KULLANICILAR;
    }
  },

  saveKullanicilar(kullanicilar: Kullanici[]) {
    localStorage.setItem(STORAGE_KEYS.KULLANICILAR, JSON.stringify(kullanicilar));
  },

  // Faturalar & Aidatlar
  getFaturalar(): FaturaAidat[] {
    const data = localStorage.getItem(STORAGE_KEYS.FATURALAR);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.FATURALAR, JSON.stringify(INITIAL_FATURALAR));
      return INITIAL_FATURALAR;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_FATURALAR;
    }
  },

  saveFaturalar(faturalar: FaturaAidat[]) {
    localStorage.setItem(STORAGE_KEYS.FATURALAR, JSON.stringify(faturalar));
  },

  // Ödemeler
  getOdemeler(): Odeme[] {
    const data = localStorage.getItem(STORAGE_KEYS.ODEMELER);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ODEMELER, JSON.stringify(INITIAL_ODEMELER));
      return INITIAL_ODEMELER;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_ODEMELER;
    }
  },

  saveOdemeler(odemeler: Odeme[]) {
    localStorage.setItem(STORAGE_KEYS.ODEMELER, JSON.stringify(odemeler));
  },

  // Mesajlar
  getMesajlar(): Mesaj[] {
    const data = localStorage.getItem(STORAGE_KEYS.MESAJLAR);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.MESAJLAR, JSON.stringify(INITIAL_MESAJLAR));
      return INITIAL_MESAJLAR;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_MESAJLAR;
    }
  },

  saveMesajlar(mesajlar: Mesaj[]) {
    localStorage.setItem(STORAGE_KEYS.MESAJLAR, JSON.stringify(mesajlar));
  },

  // Sıfırlama
  resetToDefault() {
    localStorage.setItem(STORAGE_KEYS.DAIRELER, JSON.stringify(INITIAL_DAIRELER));
    localStorage.setItem(STORAGE_KEYS.KULLANICILAR, JSON.stringify(INITIAL_KULLANICILAR));
    localStorage.setItem(STORAGE_KEYS.FATURALAR, JSON.stringify(INITIAL_FATURALAR));
    localStorage.setItem(STORAGE_KEYS.ODEMELER, JSON.stringify(INITIAL_ODEMELER));
    localStorage.setItem(STORAGE_KEYS.MESAJLAR, JSON.stringify(INITIAL_MESAJLAR));
  },

  // Otomatik Güçlü Şifre Üretici
  generateSecurePassword(namePrefix?: string): string {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const specials = ['#', '!', '*', '$', '&'];
    const prefix = namePrefix
      ? namePrefix.slice(0, 3).replace(/[^a-zA-Z]/g, '') || 'Skn'
      : letters[Math.floor(Math.random() * letters.length)] +
        letters[Math.floor(Math.random() * letters.length)].toLowerCase();
    const special = specials[Math.floor(Math.random() * specials.length)];
    const num = Math.floor(1000 + Math.random() * 9000);
    return `${prefix.charAt(0).toUpperCase() + prefix.slice(1).toLowerCase()}${special}${num}`;
  },
};
