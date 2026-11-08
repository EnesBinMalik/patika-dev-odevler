import React, { useState } from 'react';
import { Kullanici, Daire, FaturaAidat, Odeme, Mesaj } from '../types';
import { StorageService } from '../services/storage';
import { CreditCardPaymentModal } from './CreditCardPaymentModal';
import {
  CreditCard, Home, Car, Phone, Mail, Clock, CheckCircle2,
  AlertCircle, MessageSquarePlus, Send, FileText, ArrowRight, ShieldCheck, Key
} from 'lucide-react';

interface ResidentPanelProps {
  kullanici: Kullanici;
  daireler: Daire[];
  faturalar: FaturaAidat[];
  odemeler: Odeme[];
  mesajlar: Mesaj[];
  onUpdateFaturalar: (list: FaturaAidat[]) => void;
  onUpdateOdemeler: (list: Odeme[]) => void;
  onUpdateMesajlar: (list: Mesaj[]) => void;
  onShowReceipt: (odeme: Odeme) => void;
}

export const ResidentPanel: React.FC<ResidentPanelProps> = ({
  kullanici,
  daireler,
  faturalar,
  odemeler,
  mesajlar,
  onUpdateFaturalar,
  onUpdateOdemeler,
  onUpdateMesajlar,
  onShowReceipt,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'borclar' | 'odemeler' | 'mesajlar'>('borclar');
  const [payingFatura, setPayingFatura] = useState<FaturaAidat | null>(null);

  // Mesaj Gönder Form State
  const [msgKategori, setMsgKategori] = useState<'Aidat/Fatura' | 'Arıza/Bakım' | 'Temizlik' | 'Otopark/Güvenlik' | 'Genel'>('Aidat/Fatura');
  const [msgAciliyet, setMsgAciliyet] = useState<'Düşük' | 'Normal' | 'Yüksek' | 'Acil'>('Normal');
  const [msgKonu, setMsgKonu] = useState('');
  const [msgIcerik, setMsgIcerik] = useState('');
  const [msgGonderildi, setMsgGonderildi] = useState(false);

  // Sakinin Dairesi
  const daire = daireler.find((d) => d.id === kullanici.daireId);

  // Sakine Ait Faturalar & Aidatlar
  const kullaniciFaturalari = faturalar.filter(
    (f) => f.kullaniciId === kullanici.id || (daire && f.daireId === daire.id)
  );
  const odenmemisFaturalar = kullaniciFaturalari.filter((f) => f.durum !== 'Ödendi');
  const odenmisFaturalar = kullaniciFaturalari.filter((f) => f.durum === 'Ödendi');

  const toplamOdenmemisBorc = odenmemisFaturalar.reduce((sum, f) => sum + f.tutar, 0);

  // Sakine Ait Ödemeler
  const kullaniciOdemeleri = odemeler.filter(
    (o) => o.kullaniciId === kullanici.id || (daire && o.daireId === daire.id)
  );

  // Sakine Ait Mesajlar
  const kullaniciMesajlari = mesajlar.filter((m) => m.kullaniciId === kullanici.id);

  // Kredi Kartı Ödemesi Tamamlandığında
  const handlePaymentSuccess = (yeniOdeme: Odeme) => {
    // 1. Ödemeyi listeye ekle
    const updatedOdemeler = [yeniOdeme, ...odemeler];
    onUpdateOdemeler(updatedOdemeler);
    StorageService.saveOdemeler(updatedOdemeler);

    // 2. Faturayı 'Ödendi' olarak işaretle
    const updatedFaturalar = faturalar.map((f) =>
      f.id === yeniOdeme.faturaId
        ? {
            ...f,
            durum: 'Ödendi' as const,
            odemeTarihi: yeniOdeme.odemeTarihi,
            odemeId: yeniOdeme.id,
          }
        : f
    );
    onUpdateFaturalar(updatedFaturalar);
    StorageService.saveFaturalar(updatedFaturalar);

    setPayingFatura(null);
    onShowReceipt(yeniOdeme);
  };

  // Mesaj Gönder
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgKonu.trim() || !msgIcerik.trim()) return;

    const now = new Date();
    const tarihStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const yeniMesaj: Mesaj = {
      id: `msg-${Date.now()}`,
      kullaniciId: kullanici.id,
      kullaniciAdi: kullanici.adSoyad,
      daireNo: daire ? daire.daireNo : '1',
      blok: daire ? daire.blok : 'A Blok',
      kategori: msgKategori,
      aciliyet: msgAciliyet,
      konu: msgKonu,
      icerik: msgIcerik,
      tarih: tarihStr,
      durum: 'Beklemede',
      yanitlar: [],
    };

    const updated = [yeniMesaj, ...mesajlar];
    onUpdateMesajlar(updated);
    StorageService.saveMesajlar(updated);

    setMsgKonu('');
    setMsgIcerik('');
    setMsgGonderildi(true);
    setTimeout(() => setMsgGonderildi(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Resident Welcome & Apartment Status Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                Sakin / Kat Maliki Portalı
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-mono">TC: {kullanici.tcNo}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Hoş Geldiniz, {kullanici.adSoyad}
            </h2>
            <p className="text-xs text-slate-500">
              Güneştepe Sitesi dairenize ait güncel aidat, ortak sayaç faturaları ve ödeme durumları.
            </p>
          </div>

          {/* Apartment Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-left min-w-[130px]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                Konut / Daire
              </span>
              <span className="text-sm font-bold text-slate-900 block mt-0.5">
                {daire ? `${daire.blok} No: ${daire.daireNo}` : 'Atanmamış'}
              </span>
              <span className="text-[11px] text-slate-500 block">
                {daire ? `${daire.kat} (${daire.tip})` : '-'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-left min-w-[120px]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                Mülkiyet
              </span>
              <span className="text-sm font-bold text-indigo-700 block mt-0.5">
                {daire ? daire.mulkTipi : 'Ev Sahibi'}
              </span>
              <span className="text-[11px] text-slate-500 block">
                {daire ? `${daire.alanM2} m²` : '-'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-left min-w-[130px]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                Kayıtlı Araç Plakası
              </span>
              <span className="text-sm font-mono font-bold text-slate-900 block mt-0.5">
                {kullanici.plakaNo || 'Kayıtsız'}
              </span>
              <span className="text-[11px] text-slate-500 block">Kapalı Otopark</span>
            </div>
          </div>
        </div>

        {/* Total Debt Banner */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-500 block font-medium">Toplam Bekleyen Ödeme</span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className={`text-3xl font-extrabold font-mono tracking-tight ${
                toplamOdenmemisBorc > 0 ? 'text-rose-600' : 'text-emerald-600'
              }`}>
                {toplamOdenmemisBorc.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
              </span>
              <span className="text-xs text-slate-500">
                ({odenmemisFaturalar.length} adet ödenmemiş fatura/aidat)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {odenmemisFaturalar.length > 0 ? (
              <button
                onClick={() => setPayingFatura(odenmemisFaturalar[0])}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <CreditCard className="w-4 h-4" />
                <span>İlk Faturayı Hemen Kartla Öde ({odenmemisFaturalar[0].tutar} ₺)</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Tüm aidat ve faturalarınız günceldir! Borcunuz yoktur.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
        <button
          onClick={() => setActiveSubTab('borclar')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-2 ${
            activeSubTab === 'borclar' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4 text-indigo-600" />
          <span>Ödenecek Faturalar ve Aidatlar ({odenmemisFaturalar.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('odemeler')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-2 ${
            activeSubTab === 'odemeler' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-indigo-600" />
          <span>Geçmiş Ödemelerim & Dekontlar ({kullaniciOdemeleri.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('mesajlar')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-2 ${
            activeSubTab === 'mesajlar' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquarePlus className="w-4 h-4 text-indigo-600" />
          <span>Yöneticiye Mesaj & Talepler ({kullaniciMesajlari.length})</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. ODENECEK FATURALAR VE AIDATLAR */}
      {/* ======================================================== */}
      {activeSubTab === 'borclar' && (
        <div className="space-y-4">
          {odenmemisFaturalar.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">Harika! Ödenmemiş Borcunuz Yok</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Dairenize tanımlı tüm aidat ve faturalar zamanında ödenmiştir. Geçmiş ödemelerinizi ve tahsilat makbuzlarınızı "Geçmiş Ödemelerim" sekmesinden inceleyebilirsiniz.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {odenmemisFaturalar.map((fatura) => (
                <div
                  key={fatura.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-indigo-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700">
                        {fatura.tur}
                      </span>
                      <span className="text-xs font-mono font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                        {fatura.durum}
                      </span>
                    </div>

                    <div className="mt-4">
                      <span className="text-xs text-slate-400 block font-medium">Dönem</span>
                      <h4 className="font-bold text-slate-900 text-sm mt-0.5">{fatura.donemAy}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {fatura.aciklama || `${fatura.donemAy} ${fatura.tur} bedeli tahakkuku`}
                      </p>
                    </div>

                    <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                          Son Ödeme Tarihi
                        </span>
                        <span className="text-xs font-mono font-semibold text-slate-800">
                          {fatura.sonOdemeTarihi}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                          Tutar
                        </span>
                        <span className="text-lg font-mono font-extrabold text-indigo-600">
                          {fatura.tutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setPayingFatura(fatura)}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Kredi Kartı ile Hemen Öde</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. GECMIS ODEMELER VE DEKONTLAR */}
      {/* ======================================================== */}
      {activeSubTab === 'odemeler' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Geçmiş Tahsilat Makbuzları & Dekontlarım</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kredi kartı ile başarıyla tamamlanan ödemelerinize ait resmi makbuzları görüntüleyin ve yazdırın.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Makbuz No</th>
                  <th className="px-4 py-3">Ödeme Tarihi</th>
                  <th className="px-4 py-3">Dönem & Hizmet</th>
                  <th className="px-4 py-3">Kart Sahibi</th>
                  <th className="px-4 py-3">Banka Referans</th>
                  <th className="px-4 py-3 text-right">Ödenen Tutar</th>
                  <th className="px-4 py-3 text-right">Makbuz</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {kullaniciOdemeleri.map((odeme) => (
                  <tr key={odeme.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-indigo-600">{odeme.makbuzNo}</td>
                    <td className="px-4 py-3 font-mono text-slate-600">{odeme.odemeTarihi}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {odeme.donemAy} {odeme.faturaTuru}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {odeme.kartSahibi} (**** {odeme.kartSon4})
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500">{odeme.bankaReferansNo}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600 text-sm">
                      {odeme.tutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onShowReceipt(odeme)}
                        className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                      >
                        Dekont Gör / Yazdır
                      </button>
                    </td>
                  </tr>
                ))}
                {kullaniciOdemeleri.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Henüz kayıtlı bir geçmiş ödemeniz bulunmamaktadır.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. YONETICIYE MESAJ GONDER & TALEPLER */}
      {/* ======================================================== */}
      {activeSubTab === 'mesajlar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* New Message Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
            <h3 className="font-bold text-sm text-slate-900 mb-1">Site Yöneticisine Mesaj / Talep İlet</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Ortak alan arızası, aidat itirazı, otopark veya temizlik taleplerinizi doğrudan site yöneticisi Enes Öztürk'e iletebilirsiniz.
            </p>

            {msgGonderildi && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Talebiniz başarıyla site yönetimine iletildi. En kısa sürede yanıtlanacaktır.</span>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={msgKategori}
                    onChange={(e) => setMsgKategori(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Aidat/Fatura">Aidat / Fatura</option>
                    <option value="Arıza/Bakım">Arıza / Bakım</option>
                    <option value="Temizlik">Temizlik</option>
                    <option value="Otopark/Güvenlik">Otopark / Güvenlik</option>
                    <option value="Genel">Genel Talep</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Aciliyet</label>
                  <select
                    value={msgAciliyet}
                    onChange={(e) => setMsgAciliyet(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Düşük">Düşük</option>
                    <option value="Normal">Normal</option>
                    <option value="Yüksek">Yüksek</option>
                    <option value="Acil">Acil Durum</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Konu Başlığı</label>
                <input
                  type="text"
                  required
                  value={msgKonu}
                  onChange={(e) => setMsgKonu(e.target.value)}
                  placeholder="Örn: 2. Kat koridor aydınlatması çalışmıyor"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mesaj Detayı</label>
                <textarea
                  rows={4}
                  required
                  value={msgIcerik}
                  onChange={(e) => setMsgIcerik(e.target.value)}
                  placeholder="Lütfen talebinizi detaylı olarak açıklayınız..."
                  className="w-full p-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>Mesajı Yöneticiye Gönder</span>
              </button>
            </form>
          </div>

          {/* Past Messages and Manager Responses */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Önceki Talepleriniz ve Yönetici Yanıtları</h3>

            <div className="space-y-3">
              {kullaniciMesajlari.map((msg) => (
                <div key={msg.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {msg.kategori}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1.5">{msg.konu}</h4>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                          msg.durum === 'Cevaplandı'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {msg.durum}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400 block mt-1">{msg.tarih}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {msg.icerik}
                  </p>

                  {/* Manager Responses */}
                  {msg.yanitlar.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Yönetici Cevapları:
                      </span>
                      {msg.yanitlar.map((yanit, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs ml-3"
                        >
                          <div className="flex items-center justify-between font-bold text-indigo-900 mb-1">
                            <span>{yanit.gonderenAdi}</span>
                            <span className="font-mono text-[10px] text-indigo-600 font-normal">{yanit.tarih}</span>
                          </div>
                          <p className="text-slate-700 leading-relaxed">{yanit.mesaj}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {kullaniciMesajlari.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
                  Henüz site yönetimine ilettiğiniz bir talep bulunmamaktadır.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Credit Card Payment Modal */}
      {payingFatura && (
        <CreditCardPaymentModal
          fatura={payingFatura}
          kullanici={kullanici}
          onSuccess={handlePaymentSuccess}
          onClose={() => setPayingFatura(null)}
        />
      )}
    </div>
  );
};
