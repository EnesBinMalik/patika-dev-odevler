export interface JavaFileItem {
  filename: string;
  category: 'Model' | 'Database' | 'Service' | 'GUI' | 'SQL';
  description: string;
  code: string;
}

export const JAVA_PROJECT_FILES: JavaFileItem[] = [
  {
    filename: 'schema.sql',
    category: 'SQL',
    description: 'İlişkisel Veritabanı Tablo Yapıları & DDL Scripti (Enes Öztürk)',
    code: `-- ====================================================================
-- JAVA ARAÇ KİRALAMA PORTALI İLİŞKİSEL VERİTABANI ŞEMASI (SQL DDL)
-- Geliştirici & Sistem Mimarı: Enes Öztürk
-- Desteklenen Veritabanları: SQLite, PostgreSQL, MySQL
-- ====================================================================

PRAGMA foreign_keys = ON;

-- 1. FİRMALAR TABLOSU
CREATE TABLE IF NOT EXISTS firmalar (
    firma_id INTEGER PRIMARY KEY AUTOINCREMENT,
    firma_adi VARCHAR(150) NOT NULL,
    sehir VARCHAR(80) NOT NULL,
    adres TEXT,
    telefon VARCHAR(30) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    vergi_no VARCHAR(20) UNIQUE NOT NULL,
    kayit_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. KULLANICILAR (MÜŞTERİLER) TABLOSU
CREATE TABLE IF NOT EXISTS kullanicilar (
    kullanici_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ad_soyad VARCHAR(120) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    telefon VARCHAR(30) NOT NULL,
    tc_kimlik VARCHAR(11) UNIQUE NOT NULL,
    ehliyet_no VARCHAR(20) NOT NULL,
    ehliyet_yili INTEGER NOT NULL,
    sehir VARCHAR(80) NOT NULL,
    kayit_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. ARAÇLAR TABLOSU
-- Araç tipi: BINEK, ARAZI, TICARI, LUKS
CREATE TABLE IF NOT EXISTS araclar (
    arac_id INTEGER PRIMARY KEY AUTOINCREMENT,
    firma_id INTEGER NOT NULL,
    marka VARCHAR(60) NOT NULL,
    model VARCHAR(80) NOT NULL,
    model_yili INTEGER NOT NULL,
    plaka VARCHAR(20) UNIQUE NOT NULL,
    arac_tipi VARCHAR(30) CHECK(arac_tipi IN ('BINEK', 'ARAZI', 'TICARI', 'LUKS')),
    vites_turu VARCHAR(20) CHECK(vites_turu IN ('Otomatik', 'Manuel')),
    yakit_turu VARCHAR(20) CHECK(yakit_turu IN ('Benzin', 'Dizel', 'Hibrit', 'Elektrik')),
    koltuk_sayisi INTEGER DEFAULT 5,
    taban_gunluk_fiyat DECIMAL(10,2) NOT NULL,
    musaitlik_baslangic DATE NOT NULL,
    musaitlik_bitis DATE NOT NULL,
    FOREIGN KEY (firma_id) REFERENCES firmalar(firma_id) ON DELETE CASCADE
);

-- 4. FİYAT ARALIKLARI VE DÖNEMSEL FİYATLANDIRMA
CREATE TABLE IF NOT EXISTS fiyat_araliklari (
    fiyat_id INTEGER PRIMARY KEY AUTOINCREMENT,
    arac_id INTEGER NOT NULL,
    baslangic_tarihi DATE NOT NULL,
    bitis_tarihi DATE NOT NULL,
    gunluk_fiyat DECIMAL(10,2) NOT NULL,
    donem_adi VARCHAR(100),
    FOREIGN KEY (arac_id) REFERENCES araclar(arac_id) ON DELETE CASCADE
);

-- 5. EK HİZMETLER VE FİYATLANDIRMA
CREATE TABLE IF NOT EXISTS ek_hizmetler (
    hizmet_id INTEGER PRIMARY KEY AUTOINCREMENT,
    firma_id INTEGER NOT NULL,
    hizmet_adi VARCHAR(100) NOT NULL,
    gunluk_fiyat DECIMAL(10,2) NOT NULL,
    aciklama TEXT,
    aktif BOOLEAN DEFAULT 1,
    FOREIGN KEY (firma_id) REFERENCES firmalar(firma_id) ON DELETE CASCADE
);

-- 6. REZERVASYONLAR TABLOSU
-- Kural: Rezervasyonlar en erken 1 gün öncesinden iptal edilebilir
CREATE TABLE IF NOT EXISTS rezervasyonlar (
    rezervasyon_id INTEGER PRIMARY KEY AUTOINCREMENT,
    pnr_kodu VARCHAR(20) UNIQUE NOT NULL,
    arac_id INTEGER NOT NULL,
    firma_id INTEGER NOT NULL,
    kullanici_id INTEGER NOT NULL,
    alis_sehri VARCHAR(80) NOT NULL,
    donus_sehri VARCHAR(80) NOT NULL,
    baslangic_tarihi DATE NOT NULL,
    baslangic_saati VARCHAR(5) DEFAULT '10:00',
    bitis_tarihi DATE NOT NULL,
    bitis_saati VARCHAR(5) DEFAULT '10:00',
    gun_sayisi INTEGER NOT NULL,
    arac_ucreti DECIMAL(10,2) NOT NULL,
    ek_hizmetler_ucreti DECIMAL(10,2) DEFAULT 0.00,
    toplam_ucret DECIMAL(10,2) NOT NULL,
    durum VARCHAR(20) DEFAULT 'ONAYLANDI' CHECK(durum IN ('ONAYLANDI', 'İPTAL EDİLDİ', 'TAMAMLANDI')),
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (arac_id) REFERENCES araclar(arac_id),
    FOREIGN KEY (firma_id) REFERENCES firmalar(firma_id),
    FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(kullanici_id)
);

-- 7. REZERVASYON EK HİZMETLER İLİŞKİ TABLOSU
CREATE TABLE IF NOT EXISTS rezervasyon_ek_hizmetler (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rezervasyon_id INTEGER NOT NULL,
    hizmet_id INTEGER NOT NULL,
    hizmet_adi VARCHAR(100) NOT NULL,
    gunluk_fiyat DECIMAL(10,2) NOT NULL,
    toplam_fiyat DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (rezervasyon_id) REFERENCES rezervasyonlar(rezervasyon_id) ON DELETE CASCADE,
    FOREIGN KEY (hizmet_id) REFERENCES ek_hizmetler(hizmet_id)
);

-- İNDEKSLEME (Hızlı Arama ve Çakışma Önleme)
CREATE INDEX IF NOT EXISTS idx_arac_sehir ON firmalar(sehir);
CREATE INDEX IF NOT EXISTS idx_rezervasyon_tarihler ON rezervasyonlar(arac_id, baslangic_tarihi, bitis_tarihi, durum);
`
  },
  {
    filename: 'DatabaseHelper.java',
    category: 'Database',
    description: 'JDBC Bağlantı Yöneticisi, Veritabanı Başlatma ve SQL İşlemleri (Enes Öztürk)',
    code: `package com.enesozturk.carrental.database;

import java.sql.*;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

/**
 * Java Araç Kiralama Portalı Veritabanı Yöneticisi (JDBC / SQLite)
 * @author Enes Öztürk
 */
public class DatabaseHelper {
    private static final String DB_URL = "jdbc:sqlite:arac_kiralama.db";
    private static DatabaseHelper instance;

    private DatabaseHelper() {
        initDatabase();
    }

    public static synchronized DatabaseHelper getInstance() {
        if (instance == null) {
            instance = new DatabaseHelper();
        }
        return instance;
    }

    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL);
    }

    private void initDatabase() {
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement()) {
            stmt.execute("PRAGMA foreign_keys = ON;");
            // Tablo oluşturma sorguları
            stmt.execute("CREATE TABLE IF NOT EXISTS firmalar (" +
                    "firma_id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    "firma_adi TEXT NOT NULL, " +
                    "sehir TEXT NOT NULL, " +
                    "telefon TEXT NOT NULL, " +
                    "email TEXT UNIQUE NOT NULL);");

            stmt.execute("CREATE TABLE IF NOT EXISTS araclar (" +
                    "arac_id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    "firma_id INTEGER NOT NULL, " +
                    "marka TEXT NOT NULL, " +
                    "model TEXT NOT NULL, " +
                    "arac_tipi TEXT NOT NULL, " +
                    "taban_gunluk_fiyat REAL NOT NULL, " +
                    "musaitlik_baslangic TEXT NOT NULL, " +
                    "musaitlik_bitis TEXT NOT NULL, " +
                    "FOREIGN KEY (firma_id) REFERENCES firmalar(firma_id));");

            stmt.execute("CREATE TABLE IF NOT EXISTS rezervasyonlar (" +
                    "rezervasyon_id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    "pnr_kodu TEXT UNIQUE NOT NULL, " +
                    "arac_id INTEGER NOT NULL, " +
                    "firma_id INTEGER NOT NULL, " +
                    "kullanici_id INTEGER NOT NULL, " +
                    "baslangic_tarihi TEXT NOT NULL, " +
                    "bitis_tarihi TEXT NOT NULL, " +
                    "toplam_ucret REAL NOT NULL, " +
                    "durum TEXT DEFAULT 'ONAYLANDI', " +
                    "FOREIGN KEY (arac_id) REFERENCES araclar(arac_id));");

            System.out.println("[DatabaseHelper] Veritabanı başarıyla başlatıldı. Geliştirici: Enes Öztürk");
        } catch (SQLException e) {
            System.err.println("[HATA] Veritabanı başlatılamadı: " + e.getMessage());
        }
    }

    /**
     * ÇAKIŞMA KONTROLÜ: Aracın belirtilen tarihlerde başka bir kiralaması var mı?
     * Kural: (yeniBaslangic < mevcutBitis) VE (yeniBitis > mevcutBaslangic)
     */
    public boolean aracMusaitMi(int aracId, String baslangicTarihi, String bitisTarihi) {
        String sql = "SELECT COUNT(*) AS cakisma_sayisi FROM rezervasyonlar " +
                     "WHERE arac_id = ? AND durum = 'ONAYLANDI' " +
                     "AND (baslangic_tarihi < ? AND bitis_tarihi > ?)";

        try (Connection conn = getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, aracId);
            pstmt.setString(2, bitisTarihi);
            pstmt.setString(3, baslangicTarihi);

            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return rs.getInt("cakisma_sayisi") == 0;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
}
`
  },
  {
    filename: 'Arac.java',
    category: 'Model',
    description: 'Araç Varlık Sınıfı (OOP Mimarisi)',
    code: `package com.enesozturk.carrental.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Araç Varlık Sınıfı (Binek, Arazi, Ticari, Lüks)
 * @author Enes Öztürk
 */
public class Arac {
    private int aracId;
    private int firmaId;
    private String marka;
    private String model;
    private int modelYili;
    private String plaka;
    private AracTipi aracTipi; // BINEK, ARAZI, TICARI, LUKS
    private String vitesTuru;
    private String yakitTuru;
    private double tabanGunlukFiyat;
    private LocalDate musaitlikBaslangic;
    private LocalDate musaitlikBitis;
    private List<FiyatAraligi> fiyatAraliklari;
    private List<EkHizmet> ekHizmetler;

    public enum AracTipi {
        BINEK("Binek Otomobil"),
        ARAZI("Arazi / SUV"),
        TICARI("Ticari Araç"),
        LUKS("Lüks / Spor");

        private final String aciklama;
        AracTipi(String aciklama) { this.aciklama = aciklama; }
        public String getAciklama() { return aciklama; }
    }

    public Arac(int aracId, int firmaId, String marka, String model, int modelYili, 
                String plaka, AracTipi aracTipi, double tabanGunlukFiyat, 
                LocalDate musaitlikBaslangic, LocalDate musaitlikBitis) {
        this.aracId = aracId;
        this.firmaId = firmaId;
        this.marka = marka;
        this.model = model;
        this.modelYili = modelYili;
        this.plaka = plaka;
        this.aracTipi = aracTipi;
        this.tabanGunlukFiyat = tabanGunlukFiyat;
        this.musaitlikBaslangic = musaitlikBaslangic;
        this.musaitlikBitis = musaitlikBitis;
        this.fiyatAraliklari = new ArrayList<>();
        this.ekHizmetler = new ArrayList<>();
    }

    /**
     * Tarihe göre dinamik günlük fiyatı getirir (dönem/sezon kuralı varsa uygular)
     */
    public double getGunlukFiyat(LocalDate tarih) {
        for (FiyatAraligi kural : fiyatAraliklari) {
            if (!tarih.isBefore(kural.getBaslangic()) && !tarih.isAfter(kural.getBitis())) {
                return kural.getGunlukFiyat();
            }
        }
        return tabanGunlukFiyat;
    }

    // Getters and Setters
    public int getAracId() { return aracId; }
    public int getFirmaId() { return firmaId; }
    public String getMarka() { return marka; }
    public String getModel() { return model; }
    public AracTipi getAracTipi() { return aracTipi; }
    public double getTabanGunlukFiyat() { return tabanGunlukFiyat; }
    public LocalDate getMusaitlikBaslangic() { return musaitlikBaslangic; }
    public LocalDate getMusaitlikBitis() { return musaitlikBitis; }
    public List<FiyatAraligi> getFiyatAraliklari() { return fiyatAraliklari; }
    public List<EkHizmet> getEkHizmetler() { return ekHizmetler; }
}
`
  },
  {
    filename: 'RezervasyonServisi.java',
    category: 'Service',
    description: 'İş Mantığı: Tarih Çakışma Kontrolü & 24 Saat İptal Kuralı (Enes Öztürk)',
    code: `package com.enesozturk.carrental.service;

import com.enesozturk.carrental.database.DatabaseHelper;
import com.enesozturk.carrental.model.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

/**
 * Rezervasyon ve İptal Kuralları Yönetim Servisi
 * @author Enes Öztürk
 */
public class RezervasyonServisi {
    private final DatabaseHelper dbHelper = DatabaseHelper.getInstance();

    /**
     * Rezervasyon Oluşturma & Çakışma Doğrulaması
     */
    public boolean rezervasyonYap(Arac arac, Kullanici kullanici, LocalDate baslangic, LocalDate bitis) {
        // 1. Firmanın aracının müsaitlik tarih aralığında mı?
        if (baslangic.isBefore(arac.getMusaitlikBaslangic()) || bitis.isAfter(arac.getMusaitlikBitis())) {
            System.out.println("Hata: Araç belirtilen tarihlerde firmanın müsaitlik takviminde yer almıyor.");
            return false;
        }

        // 2. Başka kiralama ile çakışma kontrolü
        boolean musait = dbHelper.aracMusaitMi(arac.getAracId(), baslangic.toString(), bitis.toString());
        if (!musait) {
            System.out.println("Hata: Seçilen tarihlerde araç başka bir müşteri tarafından rezerve edilmiştir!");
            return false;
        }

        System.out.println("Başarılı: Araç müsait, rezervasyon oluşturuluyor. Geliştirici: Enes Öztürk");
        return true;
    }

    /**
     * İPTAL KURALI: "Rezervasyonlar en erken 1 gün öncesinden iptal edilebilir."
     */
    public boolean iptalEdilebilirMi(LocalDate rezervasyonBaslangicTarihi, String baslangicSaati) {
        LocalDateTime alisZamani = LocalDateTime.parse(rezervasyonBaslangicTarihi.toString() + "T" + baslangicSaati + ":00");
        LocalDateTime suAn = LocalDateTime.now();

        long saatFarki = ChronoUnit.HOURS.between(suAn, alisZamani);

        // Kural: En az 24 saat (1 gün) önce olmalıdır.
        if (saatFarki >= 24) {
            System.out.println("İptal onaylandı: Alışa " + saatFarki + " saat var. (>= 24 saat kuralı geçerli)");
            return true;
        } else {
            System.out.println("İptal reddedildi: Alışa 24 saatten az süre kaldığı için sistem iptale izin vermez.");
            return false;
        }
    }
}
`
  },
  {
    filename: 'AracKiralamaGUI.java',
    category: 'GUI',
    description: 'Java Swing Kullanıcı Arayüzü (Enes Öztürk İmzalı)',
    code: `package com.enesozturk.carrental.gui;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.time.LocalDate;

/**
 * Java Swing GUI - Araç Kiralama Portalı
 * Tasarım ve Geliştirme: Enes Öztürk
 */
public class AracKiralamaGUI extends JFrame {

    public AracKiralamaGUI() {
        setTitle("Java Araç Kiralama Portalı — Geliştirici: Enes Öztürk");
        setSize(1100, 720);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        initUI();
    }

    private void initUI() {
        JPanel mainPanel = new JPanel(new BorderLayout());

        // 1. ÜST BAŞLIK & İMZA ÇUBUĞU
        JPanel headerPanel = new JPanel(new BorderLayout());
        headerPanel.setBackground(new Color(15, 23, 42)); // Slate-900
        headerPanel.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));

        JLabel titleLabel = new JLabel("ARAÇ KİRALAMA PORTALI VE VERİTABANI YÖNETİMİ");
        titleLabel.setForeground(Color.WHITE);
        titleLabel.setFont(new Font("SansSerif", Font.BOLD, 18));

        JLabel authorLabel = new JLabel("Sistem Mimarı: Enes Öztürk | Veritabanı: SQLite JDBC");
        authorLabel.setForeground(new Color(56, 189, 248)); // Sky Blue
        authorLabel.setFont(new Font("SansSerif", Font.PLAIN, 13));

        headerPanel.add(titleLabel, BorderLayout.WEST);
        headerPanel.add(authorLabel, BorderLayout.EAST);
        mainPanel.add(headerPanel, BorderLayout.NORTH);

        // 2. SEKMELİ YÖNETİM PANELİ (TABBED PANE)
        JTabbedPane tabbedPane = new JTabbedPane();
        tabbedPane.setFont(new Font("SansSerif", Font.BOLD, 13));

        tabbedPane.addTab("🚗 Araç Arama & Rezervasyon", createSearchPanel());
        tabbedPane.addTab("🏢 Firma & Araç Yönetimi", createCompanyPanel());
        tabbedPane.addTab("📋 Rezervasyonlarım & İptal (1 Gün Kuralı)", createReservationsPanel());
        tabbedPane.addTab("🗄️ Veritabanı Şeması & SQL", createDatabasePanel());

        mainPanel.add(tabbedPane, BorderLayout.CENTER);

        // 3. ALT BİLGİ (FOOTER)
        JPanel footerPanel = new JPanel(new FlowLayout(FlowLayout.CENTER));
        footerPanel.setBackground(new Color(241, 245, 249));
        footerPanel.setBorder(BorderFactory.createEmptyBorder(8, 10, 8, 10));
        JLabel footerLabel = new JLabel("© 2026 Java Araç Kiralama Sistemi · Tüm Hakları Saklıdır · Enes Öztürk");
        footerLabel.setFont(new Font("SansSerif", Font.PLAIN, 12));
        footerLabel.setForeground(new Color(71, 85, 105));
        footerPanel.add(footerLabel);
        mainPanel.add(footerPanel, BorderLayout.SOUTH);

        add(mainPanel);
    }

    private JPanel createSearchPanel() {
        JPanel panel = new JPanel(new BorderLayout(15, 15));
        panel.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));

        // Arama Filtreleri Çubuğu
        JPanel filterBar = new JPanel(new FlowLayout(FlowLayout.LEFT, 12, 10));
        filterBar.setBorder(BorderFactory.createTitledBorder("Arama Kriterleri"));

        JComboBox<String> sehirBox = new JComboBox<>(new String[]{"İstanbul", "Ankara", "İzmir", "Antalya", "Bursa"});
        JComboBox<String> tipBox = new JComboBox<>(new String[]{"Tümü", "Binek", "Arazi (SUV)", "Ticari", "Lüks"});
        JTextField baslangicTarih = new JTextField("2026-11-20", 9);
        JTextField bitisTarih = new JTextField("2026-11-25", 9);
        JButton araBtn = new JButton("Uygun Araçları Listele");
        araBtn.setBackground(new Color(15, 23, 42));
        araBtn.setForeground(Color.WHITE);

        filterBar.add(new JLabel("Şehir:"));
        filterBar.add(sehirBox);
        filterBar.add(new JLabel("Araç Tipi:"));
        filterBar.add(tipBox);
        filterBar.add(new JLabel("Alış Tarihi:"));
        filterBar.add(baslangicTarih);
        filterBar.add(new JLabel("İade Tarihi:"));
        filterBar.add(bitisTarih);
        filterBar.add(araBtn);

        panel.add(filterBar, BorderLayout.NORTH);

        // Araçlar Tablosu
        String[] columns = {"ID", "Firma", "Şehir", "Marka/Model", "Tip", "Günlük Fiyat (TL)", "Müsaitlik Durumu"};
        DefaultTableModel model = new DefaultTableModel(columns, 0);
        model.addRow(new Object[]{"1", "Öztürk Filo", "İstanbul", "Hyundai Sonata Prime", "Binek", "1.650 ₺", "Müsait (Çakışma Yok)"});
        model.addRow(new Object[]{"2", "Öztürk Filo", "İstanbul", "Toyota Land Cruiser", "Arazi", "3.400 ₺", "Müsait (Çakışma Yok)"});
        model.addRow(new Object[]{"3", "Anadolu Rent", "Ankara", "Ford Transit Van", "Ticari", "2.100 ₺", "Müsait (Çakışma Yok)"});

        JTable table = new JTable(model);
        panel.add(new JScrollPane(table), BorderLayout.CENTER);

        JButton rezerveEtBtn = new JButton("Seçili Aracı Rezerve Et (Ek Hizmetler ile)");
        rezerveEtBtn.setFont(new Font("SansSerif", Font.BOLD, 13));
        panel.add(rezerveEtBtn, BorderLayout.SOUTH);

        return panel;
    }

    private JPanel createCompanyPanel() {
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        panel.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));
        JLabel label = new JLabel("Firmalar: Şehir seçimi, yeni araç ekleme, sezonluk fiyat aralıkları ve ek hizmet tanımlama ekranı.");
        panel.add(label, BorderLayout.NORTH);
        return panel;
    }

    private JPanel createReservationsPanel() {
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        panel.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));
        JLabel ruleNotice = new JLabel("<html><b>İptal Politikası:</b> Rezervasyonlar en erken 1 gün (24 saat) öncesinden iptal edilebilir.</html>");
        ruleNotice.setForeground(new Color(185, 28, 28));
        panel.add(ruleNotice, BorderLayout.NORTH);
        return panel;
    }

    private JPanel createDatabasePanel() {
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        panel.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));
        JTextArea sqlArea = new JTextArea("SELECT * FROM araclar WHERE arac_id NOT IN (" +
                "SELECT arac_id FROM rezervasyonlar WHERE durum = 'ONAYLANDI');");
        sqlArea.setFont(new Font("Monospaced", Font.PLAIN, 12));
        panel.add(new JScrollPane(sqlArea), BorderLayout.CENTER);
        return panel;
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            new AracKiralamaGUI().setVisible(true);
        });
    }
}
`
  }
];
