import React, { useState } from 'react';
import {
  X,
  Building2,
  TrendingUp,
  Users,
  ShieldCheck,
  Coins,
  History,
  CheckCircle2,
} from 'lucide-react';
import { Banka } from '../models/Banka';

interface AdminPanelModalProps {
  banka: Banka;
  onKapat: () => void;
  onFaizGuncellendi?: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ banka, onKapat }) => {
  const musteriler = banka.getMusteriler();
  const tumIslemler = banka.getTumIslemler();
  const faizler = banka.getGuncelFaizler();

  const toplamMusteriMevduat = musteriler.reduce((acc, m) => acc + m.getToplamVarlikTL(), 0);
  const toplamMusteriBorc = musteriler.reduce((acc, m) => acc + m.getToplamBorcTL(), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onKapat}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Banka Yönetim Başlığı */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-teal-500/20">
            <Building2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">Öztürk Bank A.Ş. Hazine & Yönetim</h2>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
                Genel Müdür: Enes Öztürk
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Banka kasası, toplam mevduat hacmi, müşteri portföyü ve sistem geneli işlemler
            </p>
          </div>
        </div>

        {/* Finansal KPI Kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs text-slate-400">Banka Kasa Rezervi</div>
            <div className="text-xl font-extrabold font-mono text-emerald-400 mt-1">
              {banka.getKasaRezervTL().toLocaleString('tr-TR')} ₺
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Nakit ve Likit Varlıklar</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs text-slate-400">Toplam Müşteri Mevduatı</div>
            <div className="text-xl font-extrabold font-mono text-teal-400 mt-1">
              {toplamMusteriMevduat.toLocaleString('tr-TR')} ₺
            </div>
            <div className="text-[10px] text-slate-500 mt-1">{musteriler.length} Müşteri Hesabı</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs text-slate-400">Toplam Kredi & Kart Alacağı</div>
            <div className="text-xl font-extrabold font-mono text-amber-400 mt-1">
              {toplamMusteriBorc.toLocaleString('tr-TR')} ₺
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Tahsil Edilecek Alacaklar</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs text-slate-400">Aktif Gösterge Faizleri</div>
            <div className="text-xs font-mono text-white mt-1 space-y-0.5">
              <div>Mevduat: %{faizler.mevduatFaiziYillik} (Yıllık)</div>
              <div>İhtiyaç Kredisi: %{faizler.ihtiyacKredisiAylik} (Aylık)</div>
            </div>
          </div>
        </div>

        {/* İki Kolonlu Liste: Müşteri Portföyü ve Banka İşlem Günlüğü */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Müşteri Listesi */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Banka Müşterileri Portföyü ({musteriler.length})</span>
              </div>
            </div>

            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {musteriler.map((m) => (
                <div
                  key={m.getTcNo()}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{m.getTamAd()}</span>
                      {m.getRol() === 'YONETICI' && (
                        <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded font-mono">
                          Yönetici
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      TC: {m.getTcNo()} · {m.getHesaplar().length} Hesap ·{' '}
                      {m.getKrediKartlari().length} Kart · {m.getKrediler().length} Kredi
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-xs font-bold text-emerald-400">
                      {m.getToplamVarlikTL().toLocaleString('tr-TR')} ₺
                    </div>
                    {m.getToplamBorcTL() > 0 && (
                      <div className="text-[10px] text-rose-400">
                        Borç: {m.getToplamBorcTL().toLocaleString('tr-TR')} ₺
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sistem Genel İşlem Günlüğü */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <div className="flex items-center gap-1.5">
                <History className="w-4 h-4 text-teal-400" />
                <span>Banka İşlem Defteri (Son {tumIslemler.length} İşlem)</span>
              </div>
            </div>

            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {tumIslemler.map((islem) => {
                const j = islem.toJSON();
                return (
                  <div
                    key={j.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span>{islem.getTurBasligi()}</span>
                        <span className="text-[10px] font-mono text-slate-500">{j.referansNo}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {j.gonderenAd} ➔ {j.aliciAd}
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-bold text-emerald-400">
                        {j.tutar.toLocaleString('tr-TR')} {j.paraBirimi}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(j.tarih).toLocaleTimeString('tr-TR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onKapat}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Pencereyi Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
