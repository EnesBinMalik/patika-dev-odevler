import React, { useState, useEffect } from 'react';
import { Banka } from './models/Banka';
import { Kullanici } from './models/Kullanici';
import { Hesap } from './models/Hesap';
import { KrediKarti } from './models/KrediKarti';
import { Kredi } from './models/Kredi';
import { Islem } from './models/Islem';
import { BankStorageService } from './services/BankStorageService';
import { Header } from './components/Header';
import { AuthScreen } from './components/AuthScreen';
import { CustomerDashboard } from './components/CustomerDashboard';
import { TransferModal } from './components/TransferModal';
import { CardPaymentModal } from './components/CardPaymentModal';
import { LoanPaymentModal } from './components/LoanPaymentModal';
import { LoanApplicationModal } from './components/LoanApplicationModal';
import { OpenAccountModal } from './components/OpenAccountModal';
import { AtmModal } from './components/AtmModal';
import { SpendSimulatorModal } from './components/SpendSimulatorModal';
import { ReceiptModal } from './components/ReceiptModal';
import { JsonDatabaseModal } from './components/JsonDatabaseModal';
import { AdminPanelModal } from './components/AdminPanelModal';

export default function App() {
  const [banka, setBanka] = useState<Banka>(() => BankStorageService.loadBank());
  // Varsayılan olarak test kolaylığı için hazır müşteri ile başla (Ahmet Yılmaz)
  const [aktifKullanici, setAktifKullanici] = useState<Kullanici | null>(() => {
    return banka.getMusteri('12345678901') || banka.getMusteriler()[0] || null;
  });

  const [aktifTab, setAktifTab] = useState<string>('hesaplar');
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Modallar
  const [isTransferModalAcik, setIsTransferModalAcik] = useState(false);
  const [isKartOdemeModalAcik, setIsKartOdemeModalAcik] = useState(false);
  const [seciliKart, setSeciliKart] = useState<KrediKarti | undefined>();

  const [isKrediOdemeModalAcik, setIsKrediOdemeModalAcik] = useState(false);
  const [seciliKredi, setSeciliKredi] = useState<Kredi | undefined>();

  const [isKrediBasvuruModalAcik, setIsKrediBasvuruModalAcik] = useState(false);
  const [isHesapAcilisiModalAcik, setIsHesapAcilisiModalAcik] = useState(false);

  const [isAtmModalAcik, setIsAtmModalAcik] = useState(false);
  const [atmHesap, setAtmHesap] = useState<Hesap | undefined>();
  const [atmTur, setAtmTur] = useState<'yatir' | 'cek'>('yatir');

  const [isKartHarcamaModalAcik, setIsKartHarcamaModalAcik] = useState(false);
  const [harcamaKart, setHarcamaKart] = useState<KrediKarti | undefined>();

  const [seciliDekont, setSeciliDekont] = useState<Islem | null>(null);
  const [isJsonMasasiAcik, setIsJsonMasasiAcik] = useState(false);
  const [isYonetimPaneliAcik, setIsYonetimPaneliAcik] = useState(false);
  const [isAuthModalAcik, setIsAuthModalAcik] = useState(false);

  // Tema Senkronizasyonu
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Banka verisi değiştiğinde JSON'a kaydet ve render yenile
  const handleBankaDegisimi = (yeniBanka?: Banka) => {
    const hedefBanka = yeniBanka || banka;
    BankStorageService.saveBank(hedefBanka);

    // Aktif kullanıcıyı güncelle
    if (aktifKullanici) {
      const guncelMusteri = hedefBanka.getMusteri(aktifKullanici.getTcNo());
      setAktifKullanici(guncelMusteri || null);
    }

    if (yeniBanka) {
      setBanka(yeniBanka);
    } else {
      // Force re-render
      setBanka(new Banka(hedefBanka.toJSON()));
    }
  };

  const handleGirisBasarili = (kullanici: Kullanici) => {
    setAktifKullanici(kullanici);
    setIsAuthModalAcik(false);
    setAktifTab('hesaplar');
  };

  const handleCikisYap = () => {
    setAktifKullanici(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-600 selection:text-white font-sans antialiased">
      {/* Üst Navigasyon Menüsü */}
      <Header
        banka={banka}
        aktifKullanici={aktifKullanici}
        onCikisYap={handleCikisYap}
        onGirisAc={() => setIsAuthModalAcik(true)}
        onJsonMasasiAc={() => setIsJsonMasasiAcik(true)}
        onYonetimPaneliAc={() => setIsYonetimPaneliAcik(true)}
        aktifTab={aktifTab}
        onTabDegistir={setAktifTab}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(!darkMode)}
      />

      {/* Ana İçerik */}
      <main className="flex-1">
        {aktifKullanici ? (
          <CustomerDashboard
            banka={banka}
            aktifKullanici={aktifKullanici}
            aktifTab={aktifTab}
            onTabDegistir={setAktifTab}
            onTransferAc={() => setIsTransferModalAcik(true)}
            onKartOdemeAc={(kart) => {
              setSeciliKart(kart);
              setIsKartOdemeModalAcik(true);
            }}
            onKrediOdemeAc={(kredi) => {
              setSeciliKredi(kredi);
              setIsKrediOdemeModalAcik(true);
            }}
            onKrediBasvuruAc={() => setIsKrediBasvuruModalAcik(true)}
            onHesapAcilisiAc={() => setIsHesapAcilisiModalAcik(true)}
            onAtmIslemiAc={(hesap, tur) => {
              setAtmHesap(hesap);
              setAtmTur(tur);
              setIsAtmModalAcik(true);
            }}
            onKartHarcamaAc={(kart) => {
              setHarcamaKart(kart);
              setIsKartHarcamaModalAcik(true);
            }}
            onDekontAc={(islem) => setSeciliDekont(islem)}
            onBankaGuncellendi={() => handleBankaDegisimi()}
          />
        ) : (
          <AuthScreen banka={banka} onGirisBasarili={handleGirisBasarili} />
        )}
      </main>

      {/* Modal: Para Transferi (Havale / FAST) */}
      {isTransferModalAcik && aktifKullanici && (
        <TransferModal
          banka={banka}
          aktifKullanici={aktifKullanici}
          onKapat={() => setIsTransferModalAcik(false)}
          onTransferBasarili={(islem) => {
            setIsTransferModalAcik(false);
            handleBankaDegisimi();
            setSeciliDekont(islem);
          }}
        />
      )}

      {/* Modal: Bankaya Kredi Kartı Ekstresi / Borç Ödeme */}
      {isKartOdemeModalAcik && aktifKullanici && (
        <CardPaymentModal
          banka={banka}
          aktifKullanici={aktifKullanici}
          seciliKart={seciliKart}
          onKapat={() => setIsKartOdemeModalAcik(false)}
          onOdemeBasarili={(islem) => {
            setIsKartOdemeModalAcik(false);
            handleBankaDegisimi();
            setSeciliDekont(islem);
          }}
        />
      )}

      {/* Modal: Bankaya Kredi Taksiti Ödeme */}
      {isKrediOdemeModalAcik && aktifKullanici && (
        <LoanPaymentModal
          banka={banka}
          aktifKullanici={aktifKullanici}
          seciliKredi={seciliKredi}
          onKapat={() => setIsKrediOdemeModalAcik(false)}
          onOdemeBasarili={(islem) => {
            setIsKrediOdemeModalAcik(false);
            handleBankaDegisimi();
            setSeciliDekont(islem);
          }}
        />
      )}

      {/* Modal: Anında Kredi Başvurusu */}
      {isKrediBasvuruModalAcik && aktifKullanici && (
        <LoanApplicationModal
          banka={banka}
          aktifKullanici={aktifKullanici}
          onKapat={() => setIsKrediBasvuruModalAcik(false)}
          onBasvuruBasarili={() => {
            setIsKrediBasvuruModalAcik(false);
            handleBankaDegisimi();
            setAktifTab('krediler');
          }}
        />
      )}

      {/* Modal: Yeni Banka Hesabı Açılışı */}
      {isHesapAcilisiModalAcik && aktifKullanici && (
        <OpenAccountModal
          banka={banka}
          aktifKullanici={aktifKullanici}
          onKapat={() => setIsHesapAcilisiModalAcik(false)}
          onHesapAcildi={() => {
            setIsHesapAcilisiModalAcik(false);
            handleBankaDegisimi();
            setAktifTab('hesaplar');
          }}
        />
      )}

      {/* Modal: ATM Para Yatırma / Çekme */}
      {isAtmModalAcik && aktifKullanici && (
        <AtmModal
          banka={banka}
          aktifKullanici={aktifKullanici}
          seciliHesap={atmHesap}
          islemTuru={atmTur}
          onKapat={() => setIsAtmModalAcik(false)}
          onBasarili={(islem) => {
            setIsAtmModalAcik(false);
            handleBankaDegisimi();
            setSeciliDekont(islem);
          }}
        />
      )}

      {/* Modal: Kredi Kartı Harcama Simülasyonu */}
      {isKartHarcamaModalAcik && aktifKullanici && harcamaKart && (
        <SpendSimulatorModal
          banka={banka}
          aktifKullanici={aktifKullanici}
          seciliKart={harcamaKart}
          onKapat={() => setIsKartHarcamaModalAcik(false)}
          onHarcamaBasarili={(islem) => {
            setIsKartHarcamaModalAcik(false);
            handleBankaDegisimi();
            setSeciliDekont(islem);
          }}
        />
      )}

      {/* Modal: Resmi Dijital Dekont Görüntüleyici */}
      {seciliDekont && (
        <ReceiptModal islem={seciliDekont} onKapat={() => setSeciliDekont(null)} />
      )}

      {/* Modal: JSON Veri Masası (Veritabanı yerine JSON işleme kanıtı) */}
      {isJsonMasasiAcik && (
        <JsonDatabaseModal
          banka={banka}
          onKapat={() => setIsJsonMasasiAcik(false)}
          onBankaGuncellendi={(yeniBanka) => {
            handleBankaDegisimi(yeniBanka);
          }}
        />
      )}

      {/* Modal: Banka Yönetim ve Kasa Hazine Paneli */}
      {isYonetimPaneliAcik && (
        <AdminPanelModal banka={banka} onKapat={() => setIsYonetimPaneliAcik(false)} />
      )}

      {/* Modal: Hızlı Giriş / Kayıt (Header'dan tetiklenirse) */}
      {isAuthModalAcik && !aktifKullanici && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setIsAuthModalAcik(false)}
              className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <AuthScreen banka={banka} onGirisBasarili={handleGirisBasarili} />
          </div>
        </div>
      )}
    </div>
  );
}
