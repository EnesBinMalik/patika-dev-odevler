import React, { useState } from 'react';
import { Daire, Kullanici, FaturaAidat, Odeme, Mesaj, FaturaTuru } from '../types';
import { StorageService } from '../services/storage';
import {
  Building2, Users, Receipt, PieChart, CreditCard, MessageSquareQuote,
  Plus, Search, Edit3, Trash2, Key, CheckCircle2, Clock, AlertCircle,
  FileSpreadsheet, Filter, Check, Send, Download, Car, Phone, Mail, Home
} from 'lucide-react';

interface AdminPanelProps {
  daireler: Daire[];
  kullanicilar: Kullanici[];
  faturalar: FaturaAidat[];
  odemeler: Odeme[];
  mesajlar: Mesaj[];
  onUpdateDaireler: (list: Daire[]) => void;
  onUpdateKullanicilar: (list: Kullanici[]) => void;
  onUpdateFaturalar: (list: FaturaAidat[]) => void;
  onUpdateMesajlar: (list: Mesaj[]) => void;
  onShowReceipt: (odeme: Odeme) => void;
}

type AdminSubTab = 'daireler' | 'kullanicilar' | 'tahakkuk' | 'mizan' | 'odemeler' | 'mesajlar';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  daireler,
  kullanicilar,
  faturalar,
  odemeler,
  mesajlar,
  onUpdateDaireler,
  onUpdateKullanicilar,
  onUpdateFaturalar,
  onUpdateMesajlar,
  onShowReceipt,
}) => {
  const [activeTab, setActiveTab] = useState<AdminSubTab>('daireler');

  // Search & Filter States
  const [daireFilterBlok, setDaireFilterBlok] = useState<string>('ALL');
  const [daireFilterDurum, setDaireFilterDurum] = useState<string>('ALL');
  const [kullaniciSearch, setKullaniciSearch] = useState<string>('');
  const [mizanFilterAy, setMizanFilterAy] = useState<string>('2026-11');
  const [mizanOnlyBorclu, setMizanOnlyBorclu] = useState<boolean>(false);

  // Modals
  const [showDaireModal, setShowDaireModal] = useState(false);
  const [editingDaire, setEditingDaire] = useState<Daire | null>(null);

  const [showKullaniciModal, setShowKullaniciModal] = useState(false);
  const [editingKullanici, setEditingKullanici] = useState<Kullanici | null>(null);

  const [showTopluTahakkukModal, setShowTopluTahakkukModal] = useState(false);
  const [showTekilTahakkukModal, setShowTekilTahakkukModal] = useState(false);

  // Daire Form State
  const [formBlok, setFormBlok] = useState('A Blok');
  const [formDaireNo, setFormDaireNo] = useState('');
  const [formKat, setFormKat] = useState('1. Kat');
  const [formTip, setFormTip] = useState('2+1');
  const [formDurum, setFormDurum] = useState<'Dolu' | 'Boş'>('Boş');
  const [formMulkTipi, setFormMulkTipi] = useState<'Ev Sahibi' | 'Kiracı'>('Ev Sahibi');
  const [formAlanM2, setFormAlanM2] = useState('110');
  const [formAtananKullaniciId, setFormAtananKullaniciId] = useState<string>('');

  // Kullanıcı Form State
  const [formAdSoyad, setFormAdSoyad] = useState('');
  const [formTcNo, setFormTcNo] = useState('');
  const [formEposta, setFormEposta] = useState('');
  const [formTelefon, setFormTelefon] = useState('');
  const [formPlakaNo, setFormPlakaNo] = useState('');
  const [formSifre, setFormSifre] = useState('');
  const [formAtananDaireId, setFormAtananDaireId] = useState<string>('');

  // Toplu Tahakkuk Form State
  const [topluTur, setTopluTur] = useState<FaturaTuru>('Aidat');
  const [topluDonemAy, setTopluDonemAy] = useState('Kasım 2026');
  const [topluDonemKod, setTopluDonemKod] = useState('2026-11');
  const [topluTutar, setTopluTutar] = useState('1250');
  const [topluSonOdeme, setTopluSonOdeme] = useState('2026-11-25');
  const [topluHedef, setTopluHedef] = useState<'TUM_DOLULAR' | 'A_BLOK' | 'B_BLOK'>('TUM_DOLULAR');
  const [topluAciklama, setTopluAciklama] = useState('');

  // Tekil Tahakkuk Form State
  const [tekilDaireId, setTekilDaireId] = useState(daireler[0]?.id || '');
  const [tekilTur, setTekilTur] = useState<FaturaTuru>('Elektrik');
  const [tekilDonemAy, setTekilDonemAy] = useState('Kasım 2026');
  const [tekilDonemKod, setTekilDonemKod] = useState('2026-11');
  const [tekilTutar, setTekilTutar] = useState('350');
  const [tekilSonOdeme, setTekilSonOdeme] = useState('2026-11-25');
  const [tekilAciklama, setTekilAciklama] = useState('');

  // Mesaj Yanıt State
  const [selectedMesaj, setSelectedMesaj] = useState<Mesaj | null>(null);
  const [yanitMetni, setYanitMetni] = useState('');

  // --- KPI Hesaplamaları ---
  const toplamDaireSayisi = daireler.length;
  const doluDaireSayisi = daireler.filter((d) => d.durum === 'Dolu').length;
  const dolulukOrani = toplamDaireSayisi ? Math.round((doluDaireSayisi / toplamDaireSayisi) * 100) : 0;
  
  const kasimFaturalari = faturalar.filter((f) => f.donemKod === '2026-11');
  const toplamTahakkukKasim = kasimFaturalari.reduce((sum, f) => sum + f.tutar, 0);
  const toplamTahsilatKasim = kasimFaturalari.filter((f) => f.durum === 'Ödendi').reduce((sum, f) => sum + f.tutar, 0);
  const kalanAlacakKasim = toplamTahakkukKasim - toplamTahsilatKasim;
  const bekleyenMesajSayisi = mesajlar.filter((m) => m.durum === 'Beklemede' || m.durum === 'İnceleniyor').length;

  // --- Daire CRUD ---
  const handleOpenDaireModal = (daire?: Daire) => {
    if (daire) {
      setEditingDaire(daire);
      setFormBlok(daire.blok);
      setFormDaireNo(daire.daireNo);
      setFormKat(daire.kat);
      setFormTip(daire.tip);
      setFormDurum(daire.durum);
      setFormMulkTipi(daire.mulkTipi);
      setFormAlanM2(String(daire.alanM2));
      setFormAtananKullaniciId(daire.atananKullaniciId || '');
    } else {
      setEditingDaire(null);
      setFormBlok('A Blok');
      setFormDaireNo('');
      setFormKat('1. Kat');
      setFormTip('2+1');
      setFormDurum('Boş');
      setFormMulkTipi('Ev Sahibi');
      setFormAlanM2('115');
      setFormAtananKullaniciId('');
    }
    setShowDaireModal(true);
  };

  const handleSaveDaire = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDaireNo) return;

    if (editingDaire) {
      const updated = daireler.map((d) => {
        if (d.id === editingDaire.id) {
          return {
            ...d,
            blok: formBlok,
            daireNo: formDaireNo,
            kat: formKat,
            tip: formTip,
            durum: formAtananKullaniciId ? 'Dolu' : formDurum,
            mulkTipi: formMulkTipi,
            alanM2: parseFloat(formAlanM2) || 100,
            atananKullaniciId: formAtananKullaniciId || undefined,
          };
        }
        return d;
      });
      onUpdateDaireler(updated);
      StorageService.saveDaireler(updated);

      // Kullanıcının daireId'sini de güncelle
      if (formAtananKullaniciId) {
        const updatedUsers = kullanicilar.map((u) =>
          u.id === formAtananKullaniciId ? { ...u, daireId: editingDaire.id } : u
        );
        onUpdateKullanicilar(updatedUsers);
        StorageService.saveKullanicilar(updatedUsers);
      }
    } else {
      const newId = `d-${Date.now()}`;
      const newDaire: Daire = {
        id: newId,
        blok: formBlok,
        daireNo: formDaireNo,
        kat: formKat,
        tip: formTip,
        durum: formAtananKullaniciId ? 'Dolu' : formDurum,
        mulkTipi: formMulkTipi,
        alanM2: parseFloat(formAlanM2) || 100,
        atananKullaniciId: formAtananKullaniciId || undefined,
      };
      const updated = [...daireler, newDaire];
      onUpdateDaireler(updated);
      StorageService.saveDaireler(updated);

      if (formAtananKullaniciId) {
        const updatedUsers = kullanicilar.map((u) =>
          u.id === formAtananKullaniciId ? { ...u, daireId: newId } : u
        );
        onUpdateKullanicilar(updatedUsers);
        StorageService.saveKullanicilar(updatedUsers);
      }
    }
    setShowDaireModal(false);
  };

  const handleDeleteDaire = (id: string) => {
    if (confirm('Bu daireyi ve ilişkili kayıtları silmek istediğinize emin misiniz?')) {
      const updated = daireler.filter((d) => d.id !== id);
      onUpdateDaireler(updated);
      StorageService.saveDaireler(updated);
    }
  };

  // --- Sakin CRUD & Otomatik Şifre ---
  const handleOpenKullaniciModal = (kullanici?: Kullanici) => {
    if (kullanici) {
      setEditingKullanici(kullanici);
      setFormAdSoyad(kullanici.adSoyad);
      setFormTcNo(kullanici.tcNo);
      setFormEposta(kullanici.eposta);
      setFormTelefon(kullanici.telefon);
      setFormPlakaNo(kullanici.plakaNo || '');
      setFormSifre(kullanici.sifre);
      setFormAtananDaireId(kullanici.daireId || '');
    } else {
      setEditingKullanici(null);
      setFormAdSoyad('');
      setFormTcNo('');
      setFormEposta('');
      setFormTelefon('');
      setFormPlakaNo('');
      // Otomatik Şifre Oluşturucu
      setFormSifre(StorageService.generateSecurePassword());
      setFormAtananDaireId('');
    }
    setShowKullaniciModal(true);
  };

  const handleGeneratePassword = () => {
    setFormSifre(StorageService.generateSecurePassword(formAdSoyad));
  };

  const handleSaveKullanici = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAdSoyad || !formTcNo) return;

    if (editingKullanici) {
      const updated = kullanicilar.map((u) => {
        if (u.id === editingKullanici.id) {
          return {
            ...u,
            adSoyad: formAdSoyad,
            tcNo: formTcNo,
            eposta: formEposta,
            telefon: formTelefon,
            plakaNo: formPlakaNo || undefined,
            sifre: formSifre,
            daireId: formAtananDaireId || undefined,
          };
        }
        return u;
      });
      onUpdateKullanicilar(updated);
      StorageService.saveKullanicilar(updated);

      // Daire atamasını güncelle
      if (formAtananDaireId) {
        const updatedDaireler = daireler.map((d) =>
          d.id === formAtananDaireId
            ? { ...d, atananKullaniciId: editingKullanici.id, durum: 'Dolu' as const }
            : d.atananKullaniciId === editingKullanici.id
            ? { ...d, atananKullaniciId: undefined, durum: 'Boş' as const }
            : d
        );
        onUpdateDaireler(updatedDaireler);
        StorageService.saveDaireler(updatedDaireler);
      }
    } else {
      const newId = `u-${Date.now()}`;
      const newKullanici: Kullanici = {
        id: newId,
        adSoyad: formAdSoyad,
        tcNo: formTcNo,
        eposta: formEposta,
        telefon: formTelefon,
        plakaNo: formPlakaNo || undefined,
        sifre: formSifre || StorageService.generateSecurePassword(formAdSoyad),
        rol: 'Kullanici',
        daireId: formAtananDaireId || undefined,
        kayitTarihi: new Date().toISOString().split('T')[0],
      };
      const updated = [...kullanicilar, newKullanici];
      onUpdateKullanicilar(updated);
      StorageService.saveKullanicilar(updated);

      if (formAtananDaireId) {
        const updatedDaireler = daireler.map((d) =>
          d.id === formAtananDaireId
            ? { ...d, atananKullaniciId: newId, durum: 'Dolu' as const }
            : d
        );
        onUpdateDaireler(updatedDaireler);
        StorageService.saveDaireler(updatedDaireler);
      }
    }
    setShowKullaniciModal(false);
  };

  const handleDeleteKullanici = (id: string) => {
    if (confirm('Bu sakini silmek istediğinize emin misiniz?')) {
      const updatedUsers = kullanicilar.filter((u) => u.id !== id);
      onUpdateKullanicilar(updatedUsers);
      StorageService.saveKullanicilar(updatedUsers);

      const updatedDaireler = daireler.map((d) =>
        d.atananKullaniciId === id ? { ...d, atananKullaniciId: undefined, durum: 'Boş' as const } : d
      );
      onUpdateDaireler(updatedDaireler);
      StorageService.saveDaireler(updatedDaireler);
    }
  };

  // --- Toplu Tahakkuk ---
  const handleExecuteTopluTahakkuk = (e: React.FormEvent) => {
    e.preventDefault();
    const tutarNum = parseFloat(topluTutar);
    if (!tutarNum || tutarNum <= 0) return;

    // Hedef daireler
    let targetDaireler = daireler.filter((d) => d.durum === 'Dolu');
    if (topluHedef === 'A_BLOK') {
      targetDaireler = targetDaireler.filter((d) => d.blok === 'A Blok');
    } else if (topluHedef === 'B_BLOK') {
      targetDaireler = targetDaireler.filter((d) => d.blok === 'B Blok');
    }

    if (targetDaireler.length === 0) {
      alert('Seçilen kriterde dolu daire bulunamadı!');
      return;
    }

    const yeniFaturalar: FaturaAidat[] = targetDaireler.map((d, idx) => ({
      id: `f-${Date.now()}-${idx}`,
      daireId: d.id,
      kullaniciId: d.atananKullaniciId,
      tur: topluTur,
      donemAy: topluDonemAy,
      donemKod: topluDonemKod,
      tutar: tutarNum,
      sonOdemeTarihi: topluSonOdeme,
      durum: 'Ödenmedi',
      tahakkukTarihi: new Date().toISOString().split('T')[0],
      aciklama: topluAciklama || `${topluDonemAy} ${topluTur} Bedeli (Toplu Tahakkuk)`,
    }));

    const updated = [...faturalar, ...yeniFaturalar];
    onUpdateFaturalar(updated);
    StorageService.saveFaturalar(updated);
    setShowTopluTahakkukModal(false);
    alert(`${targetDaireler.length} adet daireye ${topluDonemAy} ${topluTur} tahakkuku başarıyla uygulandı.`);
  };

  // --- Tekil Daire Tahakkuku ---
  const handleExecuteTekilTahakkuk = (e: React.FormEvent) => {
    e.preventDefault();
    const tutarNum = parseFloat(tekilTutar);
    if (!tutarNum || tutarNum <= 0) return;

    const seciliDaire = daireler.find((d) => d.id === tekilDaireId);
    if (!seciliDaire) return;

    const yeniFatura: FaturaAidat = {
      id: `f-${Date.now()}`,
      daireId: seciliDaire.id,
      kullaniciId: seciliDaire.atananKullaniciId,
      tur: tekilTur,
      donemAy: tekilDonemAy,
      donemKod: tekilDonemKod,
      tutar: tutarNum,
      sonOdemeTarihi: tekilSonOdeme,
      durum: 'Ödenmedi',
      tahakkukTarihi: new Date().toISOString().split('T')[0],
      aciklama: tekilAciklama || `${tekilDonemAy} ${tekilTur} Bedeli`,
    };

    const updated = [...faturalar, yeniFatura];
    onUpdateFaturalar(updated);
    StorageService.saveFaturalar(updated);
    setShowTekilTahakkukModal(false);
    alert(`${seciliDaire.blok} No:${seciliDaire.daireNo} dairesine fatura tahakkuk ettirildi.`);
  };

  const handleDeleteFatura = (id: string) => {
    if (confirm('Bu tahakkuk kaydını silmek istediğinize emin misiniz?')) {
      const updated = faturalar.filter((f) => f.id !== id);
      onUpdateFaturalar(updated);
      StorageService.saveFaturalar(updated);
    }
  };

  // --- Mesaj Yanıtlama ---
  const handleSendYanit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMesaj || !yanitMetni.trim()) return;

    const now = new Date();
    const tarihStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const updatedMesajlar = mesajlar.map((m) => {
      if (m.id === selectedMesaj.id) {
        return {
          ...m,
          durum: 'Cevaplandı' as const,
          yanitlar: [
            ...m.yanitlar,
            {
              gonderen: 'Admin' as const,
              gonderenAdi: 'Enes Öztürk (Yönetici)',
              mesaj: yanitMetni,
              tarih: tarihStr,
            },
          ],
        };
      }
      return m;
    });

    onUpdateMesajlar(updatedMesajlar);
    StorageService.saveMesajlar(updatedMesajlar);
    setSelectedMesaj(updatedMesajlar.find((m) => m.id === selectedMesaj.id) || null);
    setYanitMetni('');
  };

  // --- Daire filtreleme ---
  const filteredDaireler = daireler.filter((d) => {
    if (daireFilterBlok !== 'ALL' && d.blok !== daireFilterBlok) return false;
    if (daireFilterDurum !== 'ALL' && d.durum !== daireFilterDurum) return false;
    return true;
  });

  // --- Sakin arama ---
  const filteredKullanicilar = kullanicilar
    .filter((u) => u.rol !== 'Admin')
    .filter((u) => {
      if (!kullaniciSearch) return true;
      const q = kullaniciSearch.toLowerCase();
      return (
        u.adSoyad.toLowerCase().includes(q) ||
        u.tcNo.includes(q) ||
        u.telefon.includes(q) ||
        (u.plakaNo && u.plakaNo.toLowerCase().includes(q))
      );
    });

  // --- Mizan Raporu Hesaplama ---
  const mizanRaporu = daireler.map((d) => {
    const sakin = kullanicilar.find((u) => u.id === d.atananKullaniciId);
    const daireFaturalari = faturalar.filter(
      (f) => f.daireId === d.id && (mizanFilterAy === 'ALL' || f.donemKod === mizanFilterAy)
    );
    const toplamTahakkuk = daireFaturalari.reduce((s, f) => s + f.tutar, 0);
    const toplamTahsilat = daireFaturalari
      .filter((f) => f.durum === 'Ödendi')
      .reduce((s, f) => s + f.tutar, 0);
    const kalanBorc = toplamTahakkuk - toplamTahsilat;

    return {
      daire: d,
      sakin,
      toplamTahakkuk,
      toplamTahsilat,
      kalanBorc,
      faturaSayisi: daireFaturalari.length,
    };
  }).filter((item) => {
    if (mizanOnlyBorclu && item.kalanBorc <= 0) return false;
    return true;
  });

  const mizanGenelTahakkuk = mizanRaporu.reduce((s, r) => s + r.toplamTahakkuk, 0);
  const mizanGenelTahsilat = mizanRaporu.reduce((s, r) => s + r.toplamTahsilat, 0);
  const mizanGenelKalan = mizanGenelTahakkuk - mizanGenelTahsilat;

  const handleExportMizanCsv = () => {
    const headers = 'Blok,Daire No,Kat,Tip,Durum,Sakin Adı,Telefon,Plaka,Toplam Tahakkuk,Toplam Tahsilat,Kalan Bakiye\n';
    const rows = mizanRaporu
      .map(
        (r) =>
          `"${r.daire.blok}","${r.daire.daireNo}","${r.daire.kat}","${r.daire.tip}","${r.daire.durum}","${
            r.sakin?.adSoyad || 'Boş'
          }","${r.sakin?.telefon || '-'}","${r.sakin?.plakaNo || '-'}","${r.toplamTahakkuk}","${
            r.toplamTahsilat
          }","${r.kalanBorc}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Mizan_Raporu_${mizanFilterAy}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs text-slate-500 block font-medium">Toplam Daire</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900">{toplamDaireSayisi}</span>
            <span className="text-xs text-slate-500 font-medium">%{dolulukOrani} Dolu</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs text-slate-500 block font-medium">Kayıtlı Sakin</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {kullanicilar.filter((u) => u.rol !== 'Admin').length}
            </span>
            <span className="text-xs text-indigo-600 font-medium">{doluDaireSayisi} Daire</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs text-slate-500 block font-medium">Kasım Tahakkuk</span>
          <div className="mt-1">
            <span className="text-xl font-bold font-mono text-slate-900">
              {toplamTahakkukKasim.toLocaleString('tr-TR')} ₺
            </span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs text-slate-500 block font-medium">Kasım Tahsilat</span>
          <div className="mt-1">
            <span className="text-xl font-bold font-mono text-emerald-600">
              {toplamTahsilatKasim.toLocaleString('tr-TR')} ₺
            </span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs text-slate-500 block font-medium">Kalan Alacak</span>
          <div className="mt-1">
            <span className="text-xl font-bold font-mono text-rose-600">
              {kalanAlacakKasim.toLocaleString('tr-TR')} ₺
            </span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs text-slate-500 block font-medium">Bekleyen Mesaj</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-amber-600">{bekleyenMesajSayisi}</span>
            <span className="text-xs text-slate-500 font-medium">Talep</span>
          </div>
        </div>
      </div>

      {/* Admin Module Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('daireler')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'daireler' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4 text-indigo-600" />
          <span>Daireler ({daireler.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('kullanicilar')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'kullanicilar' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-600" />
          <span>Sakinler ({kullanicilar.filter((u) => u.rol !== 'Admin').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tahakkuk')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'tahakkuk' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-4 h-4 text-indigo-600" />
          <span>Aidat & Fatura Tahakkuku</span>
        </button>

        <button
          onClick={() => setActiveTab('mizan')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'mizan' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <PieChart className="w-4 h-4 text-indigo-600" />
          <span>Borç-Alacak Mizanı</span>
        </button>

        <button
          onClick={() => setActiveTab('odemeler')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'odemeler' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4 text-indigo-600" />
          <span>Tahsilatlar & Kasa ({odemeler.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('mesajlar')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'mesajlar' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquareQuote className="w-4 h-4 text-indigo-600" />
          <span>Gelen Talepler ({bekleyenMesajSayisi > 0 ? `${bekleyenMesajSayisi} Yeni` : mesajlar.length})</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. DAIRE YONETIMI SEKMESTI */}
      {/* ======================================================== */}
      {activeTab === 'daireler' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-600">Blok:</span>
              <select
                value={daireFilterBlok}
                onChange={(e) => setDaireFilterBlok(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="ALL">Tüm Bloklar</option>
                <option value="A Blok">A Blok</option>
                <option value="B Blok">B Blok</option>
              </select>

              <span className="text-xs font-semibold text-slate-600 ml-2">Durum:</span>
              <select
                value={daireFilterDurum}
                onChange={(e) => setDaireFilterDurum(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="ALL">Tümü</option>
                <option value="Dolu">Dolu</option>
                <option value="Boş">Boş</option>
              </select>
            </div>

            <button
              onClick={() => handleOpenDaireModal()}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Daire Ekle</span>
            </button>
          </div>

          {/* Daireler Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Blok & Daire No</th>
                    <th className="px-4 py-3">Kat</th>
                    <th className="px-4 py-3">Tip / Alan</th>
                    <th className="px-4 py-3">Durum</th>
                    <th className="px-4 py-3">Mülk Tipi</th>
                    <th className="px-4 py-3">İkamet Eden Sakin</th>
                    <th className="px-4 py-3 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredDaireler.map((daire) => {
                    const sakin = kullanicilar.find((u) => u.id === daire.atananKullaniciId);
                    return (
                      <tr key={daire.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900 text-sm">
                            {daire.blok} No: {daire.daireNo}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{daire.kat}</td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-slate-800">{daire.tip}</span>
                          <span className="text-slate-400 text-[11px] block">{daire.alanM2} m²</span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              daire.durum === 'Dolu'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {daire.durum}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{daire.mulkTipi}</td>
                        <td className="px-4 py-3">
                          {sakin ? (
                            <div>
                              <span className="font-semibold text-indigo-700 block">{sakin.adSoyad}</span>
                              <span className="text-[11px] text-slate-400 font-mono">{sakin.telefon}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Atanmamış (Boş)</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right space-x-1">
                          <button
                            onClick={() => handleOpenDaireModal(daire)}
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Düzenle"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDaire(daire.id)}
                            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. SAKIN / KULLANICI YONETIMI SEKMESTI */}
      {/* ======================================================== */}
      {activeTab === 'kullanicilar' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={kullaniciSearch}
                onChange={(e) => setKullaniciSearch(e.target.value)}
                placeholder="İsim, TC No, Telefon veya Plaka ara..."
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <button
              onClick={() => handleOpenKullaniciModal()}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Sakin Ekle (Otomatik Şifreli)</span>
            </button>
          </div>

          {/* Sakinler Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredKullanicilar.map((kullanici) => {
              const daire = daireler.find((d) => d.id === kullanici.daireId);
              return (
                <div
                  key={kullanici.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{kullanici.adSoyad}</h4>
                        <span className="text-[11px] font-mono text-slate-500">TC: {kullanici.tcNo}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                        {daire ? `${daire.blok} No: ${daire.daireNo}` : 'Daire Atanmadı'}
                      </span>
                    </div>

                    <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">{kullanici.telefon}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{kullanici.eposta}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono font-medium text-slate-800">
                          {kullanici.plakaNo || 'Araç Kaydı Yok'}
                        </span>
                      </div>
                    </div>

                    {/* Auto Generated Password Info */}
                    <div className="mt-4 p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                          Sistem Giriş Şifresi
                        </span>
                        <span className="font-mono text-xs font-bold text-indigo-600">
                          {kullanici.sifre}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(kullanici.sifre);
                          alert(`${kullanici.adSoyad} kullanıcısının şifresi kopyalandı: ${kullanici.sifre}`);
                        }}
                        className="text-[11px] font-semibold text-slate-500 hover:text-indigo-600 px-2 py-1 bg-white border border-slate-200 rounded-md transition-colors"
                      >
                        Kopyala
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenKullaniciModal(kullanici)}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDeleteKullanici(kullanici.id)}
                      className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. AIDAT VE FATURA TAHAKKUKU SEKMESTI */}
      {/* ======================================================== */}
      {activeTab === 'tahakkuk' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Aylık Aidat ve Ortak Gider Fatura Tahakkuku</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Elektrik, su, doğalgaz ve aidat bedellerini tüm dairelere toplu olarak dağıtın veya tek tek atayın.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTekilTahakkukModal(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Tekil Daireye Tahakkuk</span>
              </button>
              <button
                onClick={() => setShowTopluTahakkukModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Toplu Tahakkuk Sihirbazı</span>
              </button>
            </div>
          </div>

          {/* Invoices List */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Daire</th>
                    <th className="px-4 py-3">Sakin</th>
                    <th className="px-4 py-3">Hizmet Türü</th>
                    <th className="px-4 py-3">Dönem</th>
                    <th className="px-4 py-3">Tutar</th>
                    <th className="px-4 py-3">Son Ödeme</th>
                    <th className="px-4 py-3">Durum</th>
                    <th className="px-4 py-3 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {faturalar.map((fatura) => {
                    const daire = daireler.find((d) => d.id === fatura.daireId);
                    const sakin = kullanicilar.find((u) => u.id === fatura.kullaniciId);
                    return (
                      <tr key={fatura.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">
                          {daire ? `${daire.blok} No: ${daire.daireNo}` : 'Bilinmeyen'}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {sakin?.adSoyad || <span className="text-slate-400 italic">Atanmamış</span>}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-slate-800">{fatura.tur}</span>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-600">{fatura.donemAy}</td>
                        <td className="px-4 py-3 font-mono font-bold text-slate-900">
                          {fatura.tutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-600">{fatura.sonOdemeTarihi}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              fatura.durum === 'Ödendi'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {fatura.durum}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDeleteFatura(fatura.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                            title="Tahakkuku Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. BORC - ALACAK MIZANI (RAPORLAMA) */}
      {/* ======================================================== */}
      {activeTab === 'mizan' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-600">Dönem / Ay:</span>
              <select
                value={mizanFilterAy}
                onChange={(e) => setMizanFilterAy(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="ALL">Tüm Zamanlar</option>
                <option value="2026-11">Kasım 2026</option>
                <option value="2026-10">Ekim 2026</option>
              </select>

              <label className="flex items-center gap-2 text-xs text-slate-700 font-medium ml-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mizanOnlyBorclu}
                  onChange={(e) => setMizanOnlyBorclu(e.target.checked)}
                  className="rounded-xs text-indigo-600 focus:ring-indigo-500"
                />
                <span>Yalnızca Borcu Kalanları Göster</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Mizanı Yazdır
              </button>
              <button
                onClick={handleExportMizanCsv}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>CSV / Excel İndir</span>
              </button>
            </div>
          </div>

          {/* Mizan Total Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100">
              <span className="text-xs text-indigo-700 font-semibold block">Toplam Tahakkuk Eden Borç</span>
              <span className="text-2xl font-extrabold font-mono text-indigo-900 mt-1 block">
                {mizanGenelTahakkuk.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
              </span>
            </div>
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <span className="text-xs text-emerald-700 font-semibold block">Toplam Yapılan Tahsilat</span>
              <span className="text-2xl font-extrabold font-mono text-emerald-900 mt-1 block">
                {mizanGenelTahsilat.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
              </span>
            </div>
            <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-100">
              <span className="text-xs text-rose-700 font-semibold block">Kalan Toplam Site Alacağı</span>
              <span className="text-2xl font-extrabold font-mono text-rose-900 mt-1 block">
                {mizanGenelKalan.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
              </span>
            </div>
          </div>

          {/* Mizan Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Daire</th>
                    <th className="px-4 py-3">Sakin / İletişim</th>
                    <th className="px-4 py-3">Araç Plaka</th>
                    <th className="px-4 py-3 text-right">Tahakkuk</th>
                    <th className="px-4 py-3 text-right">Ödenen</th>
                    <th className="px-4 py-3 text-right">Kalan Bakiye</th>
                    <th className="px-4 py-3 text-center">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {mizanRaporu.map(({ daire, sakin, toplamTahakkuk, toplamTahsilat, kalanBorc }) => (
                    <tr key={daire.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-900 block">
                          {daire.blok} No: {daire.daireNo}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {daire.kat} · {daire.tip} ({daire.mulkTipi})
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {sakin ? (
                          <div>
                            <span className="font-semibold text-slate-800 block">{sakin.adSoyad}</span>
                            <span className="text-[11px] font-mono text-slate-500">{sakin.telefon}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Boş Daire</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-600">
                        {sakin?.plakaNo || '-'}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-slate-800">
                        {toplamTahakkuk.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-600">
                        {toplamTahsilat.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-sm">
                        <span className={kalanBorc > 0 ? 'text-rose-600' : 'text-slate-600'}>
                          {kalanBorc.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {kalanBorc === 0 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Borcu Yok
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            Borçlu
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. GELEN ODEMELER & MAKBUZLAR */}
      {/* ======================================================== */}
      {activeTab === 'odemeler' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="font-bold text-sm text-slate-900">Kredi Kartı Tahsilat ve Kasa Girişleri</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              .NET WebAPI ve MongoDB kredi kartı servisi üzerinden anlık olarak onaylanan ödemelerin resmi dekont dökümü.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Makbuz No</th>
                    <th className="px-4 py-3">Tarih</th>
                    <th className="px-4 py-3">Ödeyen Sakin</th>
                    <th className="px-4 py-3">Daire</th>
                    <th className="px-4 py-3">Fatura Türü</th>
                    <th className="px-4 py-3">Kart Sahibi</th>
                    <th className="px-4 py-3 text-right">Tutar</th>
                    <th className="px-4 py-3 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {odemeler.map((odeme) => {
                    const daire = daireler.find((d) => d.id === odeme.daireId);
                    return (
                      <tr key={odeme.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-indigo-600">{odeme.makbuzNo}</td>
                        <td className="px-4 py-3 font-mono text-slate-600">{odeme.odemeTarihi}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{odeme.kullaniciAdi}</td>
                        <td className="px-4 py-3 text-slate-700">
                          {daire ? `${daire.blok} No: ${daire.daireNo}` : odeme.daireId}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-slate-800">{odeme.donemAy} {odeme.faturaTuru}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {odeme.kartSahibi} (**** {odeme.kartSon4})
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600 text-sm">
                          {odeme.tutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => onShowReceipt(odeme)}
                            className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                          >
                            Dekont Gör
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. GELEN MESAJLAR / TALEPLER */}
      {/* ======================================================== */}
      {activeTab === 'mesajlar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Sakinlerden Gelen Talepler ({mesajlar.length})</h3>
            <div className="space-y-2">
              {mesajlar.map((msg) => {
                const isSelected = selectedMesaj?.id === msg.id;
                return (
                  <button
                    key={msg.id}
                    onClick={() => setSelectedMesaj(msg)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-400 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{msg.kullaniciAdi}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          msg.durum === 'Cevaplandı'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {msg.durum}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                      <span>{msg.blok} No: {msg.daireNo}</span>
                      <span>·</span>
                      <span>{msg.kategori}</span>
                      <span>·</span>
                      <span className="font-mono">{msg.tarih}</span>
                    </div>

                    <h5 className="font-semibold text-xs text-slate-800 mt-2">{msg.konu}</h5>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                      {msg.icerik}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Side: Message Detail & Response Thread */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
            {selectedMesaj ? (
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md">
                      {selectedMesaj.kategori}
                    </span>
                    <span className="font-mono text-xs text-slate-400">{selectedMesaj.tarih}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-2">{selectedMesaj.konu}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="font-semibold text-slate-800">{selectedMesaj.kullaniciAdi}</span>
                    <span>·</span>
                    <span>{selectedMesaj.blok} No: {selectedMesaj.daireNo}</span>
                  </div>
                </div>

                {/* Sakinin İlk Mesajı */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 leading-relaxed">
                  {selectedMesaj.icerik}
                </div>

                {/* Yanıt Geçmişi */}
                {selectedMesaj.yanitlar.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h5 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Cevaplar & İletişim</h5>
                    {selectedMesaj.yanitlar.map((y, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl text-xs border ${
                          y.gonderen === 'Admin'
                            ? 'bg-indigo-50/50 border-indigo-200 ml-4'
                            : 'bg-white border-slate-200 mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900">{y.gonderenAdi}</span>
                          <span className="font-mono text-[11px] text-slate-400">{y.tarih}</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{y.mesaj}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Yönetici Yanıt Yazma Formu */}
                <form onSubmit={handleSendYanit} className="pt-3 border-t border-slate-100 space-y-3">
                  <label className="block text-xs font-semibold text-slate-800">
                    Site Yöneticisi Olarak Cevap Yaz:
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={yanitMetni}
                    onChange={(e) => setYanitMetni(e.target.value)}
                    placeholder="Sakinimize iletilecek yanıtınızı buraya yazınız..."
                    className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Cevabı Gönder ve Durumu Güncelle</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 text-xs">
                Detaylarını ve yanıt geçmişini görmek için soldan bir talep seçiniz.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DAIRE EKLE / DUZENLE */}
      {/* ======================================================== */}
      {showDaireModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-4">
              {editingDaire ? 'Daire Bilgilerini Düzenle' : 'Yeni Daire Kaydı'}
            </h3>
            <form onSubmit={handleSaveDaire} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Blok</label>
                  <select
                    value={formBlok}
                    onChange={(e) => setFormBlok(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="A Blok">A Blok</option>
                    <option value="B Blok">B Blok</option>
                    <option value="C Blok">C Blok</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Daire No</label>
                  <input
                    type="text"
                    required
                    value={formDaireNo}
                    onChange={(e) => setFormDaireNo(e.target.value)}
                    placeholder="Örn: 5"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bulunduğu Kat</label>
                  <input
                    type="text"
                    required
                    value={formKat}
                    onChange={(e) => setFormKat(e.target.value)}
                    placeholder="Örn: 2. Kat"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Daire Tipi</label>
                  <select
                    value={formTip}
                    onChange={(e) => setFormTip(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="1+1">1+1</option>
                    <option value="2+1">2+1</option>
                    <option value="3+1">3+1</option>
                    <option value="4+1 Dubleks">4+1 Dubleks</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Durumu</label>
                  <select
                    value={formDurum}
                    onChange={(e) => setFormDurum(e.target.value as 'Dolu' | 'Boş')}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="Dolu">Dolu</option>
                    <option value="Boş">Boş</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mülk Tipi</label>
                  <select
                    value={formMulkTipi}
                    onChange={(e) => setFormMulkTipi(e.target.value as 'Ev Sahibi' | 'Kiracı')}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="Ev Sahibi">Ev Sahibi</option>
                    <option value="Kiracı">Kiracı</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alan (m²)</label>
                <input
                  type="number"
                  value={formAlanM2}
                  onChange={(e) => setFormAlanM2(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">İkamet Eden Sakin Ata</label>
                <select
                  value={formAtananKullaniciId}
                  onChange={(e) => setFormAtananKullaniciId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                >
                  <option value="">-- Boş Bırak / Atanmadı --</option>
                  {kullanicilar
                    .filter((u) => u.rol !== 'Admin')
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.adSoyad} ({u.telefon})
                      </option>
                    ))}
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDaireModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: SAKIN EKLE / DUZENLE (OTOMATIK SIFRELI) */}
      {/* ======================================================== */}
      {showKullaniciModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-1">
              {editingKullanici ? 'Sakin Bilgilerini Düzenle' : 'Yeni Sakin / Kullanıcı Kaydı'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Sakin için sisteme giriş şifresi otomatik olarak oluşturulur.
            </p>

            <form onSubmit={handleSaveKullanici} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ad Soyad</label>
                <input
                  type="text"
                  required
                  value={formAdSoyad}
                  onChange={(e) => setFormAdSoyad(e.target.value)}
                  placeholder="Örn: Canan Yıldız"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">TC Kimlik No</label>
                  <input
                    type="text"
                    maxLength={11}
                    required
                    value={formTcNo}
                    onChange={(e) => setFormTcNo(e.target.value.replace(/\D/g, ''))}
                    placeholder="11 haneli TC"
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Telefon</label>
                  <input
                    type="text"
                    required
                    value={formTelefon}
                    onChange={(e) => setFormTelefon(e.target.value)}
                    placeholder="05xx xxx xx xx"
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">E-Posta</label>
                  <input
                    type="email"
                    required
                    value={formEposta}
                    onChange={(e) => setFormEposta(e.target.value)}
                    placeholder="ornek@mail.com"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Araç Plaka (Varsa)</label>
                  <input
                    type="text"
                    value={formPlakaNo}
                    onChange={(e) => setFormPlakaNo(e.target.value.toUpperCase())}
                    placeholder="34 ABC 123"
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Atanacak Daire</label>
                <select
                  value={formAtananDaireId}
                  onChange={(e) => setFormAtananDaireId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                >
                  <option value="">-- Daire Seçiniz --</option>
                  {daireler.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.blok} No: {d.daireNo} ({d.tip} - {d.durum})
                    </option>
                  ))}
                </select>
              </div>

              {/* Otomatik Şifre Alanı */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-indigo-600" />
                    Otomatik Oluşturulan Giriş Şifresi
                  </span>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Yeniden Üret
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={formSifre}
                  onChange={(e) => setFormSifre(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono font-bold text-indigo-700 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowKullaniciModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg"
                >
                  Sakini Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: TOPLU TAHAKKUK SIHIRBAZI */}
      {/* ======================================================== */}
      {showTopluTahakkukModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-1">Toplu Aidat / Fatura Dağıtım Sihirbazı</h3>
            <p className="text-xs text-slate-500 mb-4">
              Seçilen kriterdeki tüm dolu dairelere tek işlemle borçlandırma yapın.
            </p>

            <form onSubmit={handleExecuteTopluTahakkuk} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hizmet Türü</label>
                  <select
                    value={topluTur}
                    onChange={(e) => setTopluTur(e.target.value as FaturaTuru)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-semibold"
                  >
                    <option value="Aidat">Aidat</option>
                    <option value="Elektrik">Ortak Elektrik</option>
                    <option value="Su">Ortak Su</option>
                    <option value="Doğalgaz">Ortak Doğalgaz</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hedef Daireler</label>
                  <select
                    value={topluHedef}
                    onChange={(e) => setTopluHedef(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="TUM_DOLULAR">Tüm Dolu Daireler</option>
                    <option value="A_BLOK">Yalnızca A Blok Doluları</option>
                    <option value="B_BLOK">Yalnızca B Blok Doluları</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Dönem / Ay</label>
                  <input
                    type="text"
                    required
                    value={topluDonemAy}
                    onChange={(e) => setTopluDonemAy(e.target.value)}
                    placeholder="Kasım 2026"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Dönem Kodu</label>
                  <input
                    type="text"
                    required
                    value={topluDonemKod}
                    onChange={(e) => setTopluDonemKod(e.target.value)}
                    placeholder="2026-11"
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Daire Başı Tutar (₺)</label>
                  <input
                    type="number"
                    required
                    value={topluTutar}
                    onChange={(e) => setTopluTutar(e.target.value)}
                    placeholder="1250"
                    className="w-full px-3 py-2 text-xs font-mono font-bold text-slate-900 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Son Ödeme Tarihi</label>
                  <input
                    type="date"
                    required
                    value={topluSonOdeme}
                    onChange={(e) => setTopluSonOdeme(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Açıklama (Opsiyonel)</label>
                <input
                  type="text"
                  value={topluAciklama}
                  onChange={(e) => setTopluAciklama(e.target.value)}
                  placeholder="Örn: Kasım ayı asansör ve peyzaj ortak payı"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTopluTahakkukModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg"
                >
                  Toplu Dağıtımı Uygula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: TEKIL DAIRE TAHAKKUKU */}
      {/* ======================================================== */}
      {showTekilTahakkukModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-1">Tekil Daireye Özel Tahakkuk</h3>
            <p className="text-xs text-slate-500 mb-4">
              Yalnızca seçilen daireye özel fatura veya aidat girişi yapın.
            </p>

            <form onSubmit={handleExecuteTekilTahakkuk} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hedef Daire</label>
                <select
                  value={tekilDaireId}
                  onChange={(e) => setTekilDaireId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-semibold"
                >
                  {daireler.map((d) => {
                    const s = kullanicilar.find((u) => u.id === d.atananKullaniciId);
                    return (
                      <option key={d.id} value={d.id}>
                        {d.blok} No: {d.daireNo} - {s?.adSoyad || 'Boş Daire'}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hizmet Türü</label>
                  <select
                    value={tekilTur}
                    onChange={(e) => setTekilTur(e.target.value as FaturaTuru)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-semibold"
                  >
                    <option value="Aidat">Aidat</option>
                    <option value="Elektrik">Ortak Elektrik</option>
                    <option value="Su">Ortak Su</option>
                    <option value="Doğalgaz">Ortak Doğalgaz</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tutar (₺)</label>
                  <input
                    type="number"
                    required
                    value={tekilTutar}
                    onChange={(e) => setTekilTutar(e.target.value)}
                    placeholder="350"
                    className="w-full px-3 py-2 text-xs font-mono font-bold text-slate-900 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Dönem / Ay</label>
                  <input
                    type="text"
                    required
                    value={tekilDonemAy}
                    onChange={(e) => setTekilDonemAy(e.target.value)}
                    placeholder="Kasım 2026"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Son Ödeme Tarihi</label>
                  <input
                    type="date"
                    required
                    value={tekilSonOdeme}
                    onChange={(e) => setTekilSonOdeme(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Açıklama</label>
                <input
                  type="text"
                  value={tekilAciklama}
                  onChange={(e) => setTekilAciklama(e.target.value)}
                  placeholder="Örn: Ara sayaç su tüketim farkı"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTekilTahakkukModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg"
                >
                  Tahakkuku Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
