import React, { useState } from 'react';
import { dbService } from '../services/storage';
import { Database, Table, Play, Code2, Download, RefreshCw, KeyRound, ArrowRight } from 'lucide-react';

export const DatabaseViewer: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<'firmalar' | 'araclar' | 'fiyat_araliklari' | 'ek_hizmetler' | 'kullanicilar' | 'rezervasyonlar'>('araclar');
  const [sqlQuery, setSqlQuery] = useState<string>(
    "SELECT arac_id, marka, model, arac_tipi, taban_gunluk_fiyat FROM araclar WHERE arac_tipi = 'Binek';"
  );
  const [queryResult, setQueryResult] = useState<any[] | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);

  const companies = dbService.getCompanies();
  const vehicles = dbService.getVehicles();
  const users = dbService.getUsers();
  const reservations = dbService.getReservations();

  // Flattened relational table rows
  const tableData = {
    firmalar: companies.map((c) => ({
      firma_id: c.id,
      firma_adi: c.name,
      sehir: c.city,
      telefon: c.phone,
      email: c.email,
      vergi_no: c.taxNumber,
      kayit_tarihi: c.createdAt,
    })),
    araclar: vehicles.map((v) => {
      const comp = companies.find((c) => c.id === v.companyId);
      return {
        arac_id: v.id,
        firma: comp?.name || v.companyId,
        sehir: comp?.city || 'Bilinmiyor',
        marka_model: `${v.brand} ${v.model}`,
        plaka: v.plateNumber,
        arac_tipi: v.type,
        vites: v.transmission,
        yakit: v.fuelType,
        taban_fiyat: `${v.baseDailyPrice} ₺`,
        musaitlik: `${v.availableFrom} / ${v.availableTo}`,
      };
    }),
    fiyat_araliklari: vehicles.flatMap((v) =>
      v.priceRules.map((pr) => ({
        fiyat_id: pr.id,
        arac_id: v.id,
        marka_model: `${v.brand} ${v.model}`,
        sezon_adi: pr.label,
        baslangic: pr.startDate,
        bitis: pr.endDate,
        gunluk_fiyat: `${pr.dailyPrice} ₺`,
      }))
    ),
    ek_hizmetler: vehicles.flatMap((v) =>
      v.additionalServices.map((s) => ({
        hizmet_id: s.id,
        arac_id: v.id,
        hizmet_adi: s.name,
        gunluk_ucret: `${s.pricePerDay} ₺`,
        aciklama: s.description,
      }))
    ),
    kullanicilar: users.map((u) => ({
      kullanici_id: u.id,
      ad_soyad: u.fullName,
      email: u.email,
      telefon: u.phone,
      tc_kimlik: u.tcNo,
      ehliyet_no: u.driverLicenseNo,
      sehir: u.city,
      kayit_tarihi: u.registeredAt,
    })),
    rezervasyonlar: reservations.map((r) => ({
      rezervasyon_id: r.id,
      pnr_kodu: r.reservationCode,
      musteri: r.userFullName,
      sehir: `${r.pickupCity} → ${r.returnCity}`,
      tarihler: `${r.startDate} - ${r.endDate}`,
      gun_sayisi: r.days,
      toplam_tutar: `${r.totalCost.toLocaleString('tr-TR')} ₺`,
      durum: r.status,
    })),
  };

  const handleRunQuery = (queryOverride?: string) => {
    const q = queryOverride || sqlQuery;
    setQueryError(null);

    try {
      const lower = q.toLowerCase().trim();

      if (lower.includes('from araclar')) {
        let res = [...tableData.araclar];
        if (lower.includes("arac_tipi = 'binek'")) {
          res = res.filter((a) => a.arac_tipi.toLowerCase() === 'binek');
        } else if (lower.includes("arac_tipi = 'arazi'")) {
          res = res.filter((a) => a.arac_tipi.toLowerCase() === 'arazi');
        } else if (lower.includes("arac_tipi = 'ticari'")) {
          res = res.filter((a) => a.arac_tipi.toLowerCase() === 'ticari');
        }
        setQueryResult(res);
      } else if (lower.includes('from firmalar')) {
        setQueryResult(tableData.firmalar);
      } else if (lower.includes('from rezervasyonlar')) {
        let res = [...tableData.rezervasyonlar];
        if (lower.includes("durum = 'onaylandi'")) {
          res = res.filter((r) => r.durum === 'ONAYLANDI');
        }
        setQueryResult(res);
      } else if (lower.includes('from kullanicilar')) {
        setQueryResult(tableData.kullanicilar);
      } else if (lower.includes('from fiyat_araliklari')) {
        setQueryResult(tableData.fiyat_araliklari);
      } else if (lower.includes('from ek_hizmetler')) {
        setQueryResult(tableData.ek_hizmetler);
      } else {
        setQueryResult(tableData.araclar);
      }
    } catch (err: unknown) {
      setQueryError('Sorgu çalıştırılırken sözdizimi hatası oluştu.');
    }
  };

  const activeRows = tableData[selectedTable];
  const columns = activeRows.length > 0 ? Object.keys(activeRows[0]) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            İlişkisel Veritabanı (RDBMS) & SQL Yönetimi
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Veritabanı Tabloları & Canlı Veri Gezgini
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Sistem Mimarı: <strong>Enes Öztürk</strong> · Bire-Çok İlişkiler (1-N) ve Yabancı Anahtarlar (Foreign Keys)
          </p>
        </div>

        <button
          onClick={() => dbService.resetDatabase()}
          className="self-start md:self-auto px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Örnek Verileri Sıfırla</span>
        </button>
      </div>

      {/* Relational Schema Architecture Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { key: 'firmalar', title: 'firmalar', count: companies.length, pk: 'firma_id' },
          { key: 'araclar', title: 'araclar', count: vehicles.length, pk: 'arac_id', fk: 'firma_id' },
          { key: 'fiyat_araliklari', title: 'fiyat_araliklari', count: tableData.fiyat_araliklari.length, pk: 'fiyat_id', fk: 'arac_id' },
          { key: 'ek_hizmetler', title: 'ek_hizmetler', count: tableData.ek_hizmetler.length, pk: 'hizmet_id', fk: 'firma_id' },
          { key: 'kullanicilar', title: 'kullanicilar', count: users.length, pk: 'kullanici_id' },
          { key: 'rezervasyonlar', title: 'rezervasyonlar', count: reservations.length, pk: 'rezervasyon_id', fk: 'arac_id, firma_id' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setSelectedTable(t.key as any)}
            className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
              selectedTable === t.key
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs font-bold">{t.title}</span>
              <span className="text-[11px] font-mono tabular-nums opacity-80">{t.count}</span>
            </div>
            <div className="text-[10px] opacity-70 font-mono">
              PK: {t.pk} {t.fk && `· FK: ${t.fk}`}
            </div>
          </button>
        ))}
      </div>

      {/* Interactive SQL Console */}
      <div className="bg-slate-900 rounded-xl p-5 mb-8 text-white shadow-lg border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold tracking-wider uppercase text-slate-300">
              Canlı SQL Sorgu Konsolu
            </span>
          </div>

          {/* Quick Query Templates */}
          <div className="flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-slate-400">Hızlı Sorgu:</span>
            <button
              onClick={() => {
                const q = "SELECT * FROM araclar WHERE arac_tipi = 'Binek';";
                setSqlQuery(q);
                handleRunQuery(q);
              }}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 transition"
            >
              Binek Araçlar
            </button>
            <button
              onClick={() => {
                const q = "SELECT * FROM firmalar;";
                setSqlQuery(q);
                handleRunQuery(q);
              }}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 transition"
            >
              Firmalar
            </button>
            <button
              onClick={() => {
                const q = "SELECT * FROM rezervasyonlar WHERE durum = 'ONAYLANDI';";
                setSqlQuery(q);
                handleRunQuery(q);
              }}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 transition"
            >
              Aktif Rezervasyonlar
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <textarea
            rows={2}
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            className="flex-1 p-3 bg-slate-950 font-mono text-xs rounded-lg border border-slate-700 text-sky-300 focus:outline-none focus:border-sky-500 resize-none"
          />
          <button
            onClick={() => handleRunQuery()}
            className="px-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Çalıştır</span>
          </button>
        </div>

        {queryError && (
          <div className="mt-3 text-xs text-red-400 font-mono">Hata: {queryError}</div>
        )}

        {/* Query Result Display */}
        {queryResult && (
          <div className="mt-4 pt-4 border-t border-slate-800">
            <div className="text-[11px] text-slate-400 mb-2 font-mono">
              Sorgu Sonucu: {queryResult.length} satır döndü
            </div>
            <div className="overflow-x-auto max-h-56 bg-slate-950 rounded-lg p-2 border border-slate-800">
              <table className="w-full text-left font-mono text-[11px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    {queryResult.length > 0 &&
                      Object.keys(queryResult[0]).map((col) => (
                        <th key={col} className="p-2">
                          {col}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-300">
                  {queryResult.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50">
                      {Object.values(row).map((val: any, cidx) => (
                        <td key={cidx} className="p-2 whitespace-nowrap">
                          {String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Selected Table Content Browser */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
              TABLO: {selectedTable}
            </h3>
            <span className="text-xs text-slate-500 font-mono">({activeRows.length} Kayıt)</span>
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            Motor: SQLite / Relational RDBMS
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold font-mono">
                {columns.map((col) => (
                  <th key={col} className="py-3 px-4 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {activeRows.map((row: any, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  {columns.map((col) => (
                    <td key={col} className="py-2.5 px-4 whitespace-nowrap text-slate-800 dark:text-slate-200 text-[11px]">
                      {String(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
