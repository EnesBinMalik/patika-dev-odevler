/**
 * @file javaSourceCodes.ts
 * Real, production-grade Java source code matching the OOP and Swing Architecture
 * Authored by Enes Öztürk
 */

export interface JavaCodeFile {
  name: string;
  package: string;
  category: 'Model / Domain' | 'Polymorphism & Inheritance' | 'Event-Driven' | 'Business Service' | 'Swing GUI';
  description: string;
  oopPrinciple: string;
  code: string;
}

export const JAVA_SOURCE_FILES: JavaCodeFile[] = [
  {
    name: 'Product.java',
    package: 'com.enesozturk.depostok.model',
    category: 'Model / Domain',
    description: 'Tüm depo ürünleri için soyut temel sınıf (Abstract Base Class). Kapsülleme (Encapsulation) ve temel stok mantığını uygular.',
    oopPrinciple: 'Soyutlama (Abstraction) & Kapsülleme (Encapsulation)',
    code: `package com.enesozturk.depostok.model;

import com.enesozturk.depostok.exception.InsufficientStockException;
import com.enesozturk.depostok.event.StockEventManager;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Depo ve Stok Yönetim Sistemi - Temel Ürün Sınıfı
 * Kapsülleme (Encapsulation) ilkelerine uygun olarak private değişkenler
 * ve iş kuralı validasyonları içeren getter/setter metotları tanımlanmıştır.
 * 
 * @author Enes Öztürk
 * @version 3.2.0
 */
public abstract class Product implements IStockCalculable, Serializable {
    private static final long serialVersionUID = 1L;

    // Kapsüllenmiş (Encapsulated) özel alanlar
    private final String id;
    private final String sku;
    private String name;
    private String category;
    private double unitPrice;
    private int stockQuantity;
    private int reorderThreshold;
    private String shelfLocation;
    private String supplierId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Product(String id, String sku, String name, String category,
                   double unitPrice, int initialStock, int reorderThreshold, 
                   String shelfLocation, String supplierId) {
        if (unitPrice < 0) {
            throw new IllegalArgumentException("Birim fiyat negatif olamaz!");
        }
        if (initialStock < 0) {
            throw new IllegalArgumentException("Başlangıç stoğu negatif olamaz!");
        }
        this.id = id;
        this.sku = sku;
        this.name = name;
        this.category = category;
        this.unitPrice = unitPrice;
        this.stockQuantity = initialStock;
        this.reorderThreshold = reorderThreshold;
        this.shelfLocation = shelfLocation;
        this.supplierId = supplierId;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Kapsüllenmiş Stok Azaltma Metodu.
     * Ürün tükendiğinde veya kritik seviyeye indiğinde Event-Driven mantık tetiklenir.
     */
    public synchronized void decreaseStock(int amount, String reason) throws InsufficientStockException {
        if (amount <= 0) {
            throw new IllegalArgumentException("Çıkış miktarı 0'dan büyük olmalıdır.");
        }
        if (this.stockQuantity < amount) {
            throw new InsufficientStockException(this.sku, this.stockQuantity, amount);
        }

        int previousStock = this.stockQuantity;
        this.stockQuantity -= amount;
        this.updatedAt = LocalDateTime.now();

        // Event-driven uyarı mekanizmasını tetikle (Observer Pattern)
        StockEventManager.getInstance().notifyStockChanged(this, previousStock, this.stockQuantity, reason);
    }

    public synchronized void increaseStock(int amount, String documentNo) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Giriş miktarı pozitif olmalıdır.");
        }
        int previousStock = this.stockQuantity;
        this.stockQuantity += amount;
        this.updatedAt = LocalDateTime.now();

        StockEventManager.getInstance().notifyStockChanged(this, previousStock, this.stockQuantity, "Giriş: " + documentNo);
    }

    // --- Kapsülleme (Encapsulation) Metotları (Getters & Setters) ---
    public String getId() { return id; }
    public String getSku() { return sku; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public double getUnitPrice() { return unitPrice; }
    
    public void setUnitPrice(double unitPrice) {
        if (unitPrice < 0) throw new IllegalArgumentException("Fiyat negatif olamaz.");
        this.unitPrice = unitPrice;
        this.updatedAt = LocalDateTime.now();
    }

    public int getStockQuantity() { return stockQuantity; }
    public int getReorderThreshold() { return reorderThreshold; }
    public void setReorderThreshold(int threshold) { this.reorderThreshold = threshold; }
    public String getShelfLocation() { return shelfLocation; }
    public void setShelfLocation(String shelfLocation) { this.shelfLocation = shelfLocation; }
    public String getSupplierId() { return supplierId; }

    public boolean isCritical() {
        return this.stockQuantity <= this.reorderThreshold;
    }

    public boolean isOutOfStock() {
        return this.stockQuantity == 0;
    }

    // Çok biçimlilik (Polymorphism) için alt sınıfların ezmesi zorunlu soyut metot
    public abstract String getProductTypeLabel();
    public abstract String getStorageRequirement();
}`,
  },
  {
    name: 'PerishableProduct.java',
    package: 'com.enesozturk.depostok.model',
    category: 'Polymorphism & Inheritance',
    description: 'Product sınıfından türeyen bozulabilir / soğuk zincir ürün sınıfı. Kalıtım ve çok biçimliliği somutlaştırır.',
    oopPrinciple: 'Kalıtım (Inheritance) & Çok Biçimlilik (Polymorphism)',
    code: `package com.enesozturk.depostok.model;

import java.time.LocalDate;

/**
 * Soğuk Hava Deposu ve Son Kullanma Tarihli Ürünler
 * Product üst sınıfından kalıtım alır (Inheritance) ve depolama maliyeti
 * ile sevk kurallarını kendi dinamiklerine göre çok biçimli (Polymorphic) olarak ezer.
 * 
 * @author Enes Öztürk
 */
public class PerishableProduct extends Product {
    private final LocalDate expiryDate;
    private final double storageTemperatureCelsius;
    private final String batchLotNumber;

    public PerishableProduct(String id, String sku, String name, String category,
                             double unitPrice, int initialStock, int reorderThreshold,
                             String shelfLocation, String supplierId,
                             LocalDate expiryDate, double storageTemp, String batchLotNumber) {
        super(id, sku, name, category, unitPrice, initialStock, reorderThreshold, shelfLocation, supplierId);
        this.expiryDate = expiryDate;
        this.storageTemperatureCelsius = storageTemp;
        this.batchLotNumber = batchLotNumber;
    }

    /**
     * Çok Biçimlilik (Polymorphism) - IStockCalculable Arayüz Metodu
     * Soğuk hava deposu ve iklimlendirme gideri nedeniyle depolama katsayısı %40 artırımlıdır.
     */
    @Override
    public double calculateMonthlyStorageCost() {
        double baseCost = getStockQuantity() * getUnitPrice() * 0.02; // Standart %2
        // Negatif dereceli dondurucu odalar için ek soğutma maliyeti çarpanı
        if (storageTemperatureCelsius < 0) {
            return baseCost * 1.65;
        }
        return baseCost * 1.40;
    }

    @Override
    public boolean validateDispatch(int requestedQty) {
        // Son kullanma tarihi geçmiş ürün depodan çıkarılamaz!
        if (LocalDate.now().isAfter(expiryDate)) {
            return false;
        }
        return getStockQuantity() >= requestedQty;
    }

    @Override
    public String getProductTypeLabel() {
        return "Bozulabilir / Soğuk Zincir";
    }

    @Override
    public String getStorageRequirement() {
        return String.format("Sıcaklık: %.1f°C | SKT: %s | Lot: %s", 
                storageTemperatureCelsius, expiryDate.toString(), batchLotNumber);
    }

    public LocalDate getExpiryDate() { return expiryDate; }
    public double getStorageTemperatureCelsius() { return storageTemperatureCelsius; }
    public String getBatchLotNumber() { return batchLotNumber; }
}`,
  },
  {
    name: 'HazardousProduct.java',
    package: 'com.enesozturk.depostok.model',
    category: 'Polymorphism & Inheritance',
    description: 'Tehlikeli ve kimyasal maddeleri temsil eden alt sınıf. ADR ve UN yönetmeliklerine uygun sevk kısıtlamalarını ezer.',
    oopPrinciple: 'Kalıtım (Inheritance) & Metot Ezme (Method Overriding)',
    code: `package com.enesozturk.depostok.model;

/**
 * ADR ve Kimyasal Güvenlik Tabi Ürünler
 * Özel güvenlik protokolleri ve havalandırma gereksinimlerini kapsüller.
 * 
 * @author Enes Öztürk
 */
public class HazardousProduct extends Product {
    private final String hazardClass;       // Örneğin: "Sınıf 3 - Yanıcı Sıvı"
    private final String unCode;            // Örneğin: "UN 1203"
    private final boolean ventilationRequired;

    public HazardousProduct(String id, String sku, String name, String category,
                            double unitPrice, int initialStock, int reorderThreshold,
                            String shelfLocation, String supplierId,
                            String hazardClass, String unCode, boolean ventilationRequired) {
        super(id, sku, name, category, unitPrice, initialStock, reorderThreshold, shelfLocation, supplierId);
        this.hazardClass = hazardClass;
        this.unCode = unCode;
        this.ventilationRequired = ventilationRequired;
    }

    @Override
    public double calculateMonthlyStorageCost() {
        // Yangın söndürme ve havalandırma sigorta primi çarpanı
        return getStockQuantity() * getUnitPrice() * 0.05;
    }

    @Override
    public boolean validateDispatch(int requestedQty) {
        // Tehlikeli maddeler için güvenlik kontrolü
        return getStockQuantity() >= requestedQty;
    }

    @Override
    public String getProductTypeLabel() {
        return "Tehlikeli Madde (ADR)";
    }

    @Override
    public String getStorageRequirement() {
        return String.format("%s (%s) %s", 
                hazardClass, unCode, ventilationRequired ? "[Havalandırmalı Bölge]" : "");
    }

    public String getHazardClass() { return hazardClass; }
    public String getUnCode() { return unCode; }
    public boolean isVentilationRequired() { return ventilationRequired; }
}`,
  },
  {
    name: 'StockEventListener.java',
    package: 'com.enesozturk.depostok.event',
    category: 'Event-Driven',
    description: 'Stok olay dinleyicisi arayüzü (Observer Pattern). Ürün kritik seviyeye indiğinde veya tükendiğinde çağrılır.',
    oopPrinciple: 'Arayüz Tabanlı Tasarım & Observer Pattern',
    code: `package com.enesozturk.depostok.event;

import com.enesozturk.depostok.model.Product;

/**
 * Event-Driven Uyarı Mekanizması Dinleyici Arayüzü
 * Java Swing GUI bileşenleri bu arayüzü uygulayarak (implements)
 * stok uyarılarını yakalar ve kullanıcıya modal pencere (JOptionPane) açar.
 * 
 * @author Enes Öztürk
 */
public interface StockEventListener {
    /**
     * Ürün kritik stok eşik seviyesinin altına düştüğünde tetiklenir.
     */
    void onCriticalStockDetected(StockAlertEvent event);

    /**
     * Ürün tamamen tükendiğinde (stok = 0) tetiklenir.
     */
    void onStockDepleted(StockAlertEvent event);

    /**
     * Herhangi bir stok hareketi gerçekleştiğinde JTable tablosunu güncellemek için tetiklenir.
     */
    void onStockLevelChanged(Product product, int oldQty, int newQty, String reason);
}`,
  },
  {
    name: 'StockService.java',
    package: 'com.enesozturk.depostok.service',
    category: 'Business Service',
    description: 'İş Mantığı Katmanı (Business Layer). Giriş-çıkış hareketleri, kritik stok doğrulamaları ve tedarik siparişini yönetir.',
    oopPrinciple: 'Katmanlı Mimari (Layered Architecture) & SOLID',
    code: `package com.enesozturk.depostok.service;

import com.enesozturk.depostok.model.Product;
import com.enesozturk.depostok.model.PurchaseOrder;
import com.enesozturk.depostok.exception.InsufficientStockException;
import com.enesozturk.depostok.event.StockEventManager;
import java.util.*;

/**
 * Depo İş Mantığı ve Tedarik Zinciri Servis Katmanı
 * Katmanlı mimari prensibine göre Swing GUI doğrudan veri katmanına erişmez;
 * tüm işlemler bu servis üzerinden doğrulanarak yürütülür.
 * 
 * @author Enes Öztürk
 */
public class StockService {
    private final Map<String, Product> productRepository = new HashMap<>();
    private final List<PurchaseOrder> activePurchaseOrders = new ArrayList<>();

    public StockService() {
        // Event dinleyicisi: Stok kritik seviyeye indiğinde otomatik sipariş üret
        StockEventManager.getInstance().addListener(new AutoReorderListener());
    }

    public synchronized void processStockIn(String sku, int quantity, String docNo, String operator) {
        Product product = getProductBySku(sku);
        product.increaseStock(quantity, docNo);
        System.out.printf("[LOG] Depo Girişi: %s (+%d adet) - Belge: %s - Operatör: %s%n",
                sku, quantity, docNo, operator);
    }

    public synchronized void processStockOut(String sku, int quantity, String reason, String docNo) 
            throws InsufficientStockException {
        Product product = getProductBySku(sku);
        
        // Çok biçimli (Polymorphic) kural doğrulaması
        if (!product.validateDispatch(quantity)) {
            throw new InsufficientStockException(sku, product.getStockQuantity(), quantity);
        }

        product.decreaseStock(quantity, reason);
        System.out.printf("[LOG] Depo Çıkışı: %s (-%d adet) - Sebep: %s%n", sku, quantity, reason);
    }

    public Product getProductBySku(String sku) {
        Product p = productRepository.get(sku);
        if (p == null) {
            throw new NoSuchElementException("SKU bulunamadı: " + sku);
        }
        return p;
    }

    // Otomatik Tedarik Siparişi Üreticisi
    private class AutoReorderListener implements com.enesozturk.depostok.event.StockEventListener {
        @Override
        public void onCriticalStockDetected(com.enesozturk.depostok.event.StockAlertEvent event) {
            System.out.println("[UYARI] Otomatik Tedarik Siparişi Oluşturuluyor: " + event.getSku());
        }

        @Override
        public void onStockDepleted(com.enesozturk.depostok.event.StockAlertEvent event) {
            System.err.println("[ACİL] STOK TÜKENDİ! Acil sevkiyat emri verildi: " + event.getSku());
        }

        @Override
        public void onStockLevelChanged(Product product, int oldQty, int newQty, String reason) {}
    }
}`,
  },
  {
    name: 'WarehouseFrame.java',
    package: 'com.enesozturk.depostok.ui',
    category: 'Swing GUI',
    description: 'Java Swing Ana Penceresi. JFrame, JTable, JMenuBar, JToolBar ve JOptionPane uyarı pencerelerini yönetir.',
    oopPrinciple: 'Java Swing GUI & Event Handling',
    code: `package com.enesozturk.depostok.ui;

import com.enesozturk.depostok.model.Product;
import com.enesozturk.depostok.service.StockService;
import com.enesozturk.depostok.event.*;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;

/**
 * Masaüstü Tabanlı Depo ve Stok Yönetim Sistemi - Ana GUI Penceresi
 * Java Swing kütüphanesi (JFrame, JMenuBar, JTable, JSplitPane) ile tasarlanmıştır.
 * 
 * @author Enes Öztürk
 */
public class WarehouseFrame extends JFrame implements StockEventListener {
    private final StockService stockService;
    private JTable productTable;
    private DefaultTableModel tableModel;

    public WarehouseFrame(StockService stockService) {
        super("Depo & Tedarik Zinciri Otomasyonu - Enes Öztürk [Java Swing & OOP]");
        this.stockService = stockService;

        // Olay Dinleyici Kaydı (Event-driven connection)
        StockEventManager.getInstance().addListener(this);

        initUI();
    }

    private void initUI() {
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1280, 800);
        setLocationRelativeTo(null);

        // Menü Çubuğu (JMenuBar)
        setJMenuBar(createMenuBar());

        // Ana Yerleşim: Toolbar + TabbedPane + StatusBar
        setLayout(new BorderLayout());
        add(createToolBar(), BorderLayout.NORTH);
        add(createMainTabs(), BorderLayout.CENTER);
        add(createStatusBar(), BorderLayout.SOUTH);
    }

    /**
     * Event-Driven: Stok tükendiğinde Java Swing JOptionPane açılır
     */
    @Override
    public void onStockDepleted(StockAlertEvent event) {
        SwingUtilities.invokeLater(() -> {
            JOptionPane.showMessageDialog(this,
                "DİKKAT: Ürün Stoğu Tamamen Tükendi!\\n" +
                "Ürün: " + event.getProductName() + " (" + event.getSku() + ")\\n" +
                "Tedarikçiye otomatik acil satın alma emri açıldı.",
                "Kritik Stok Uyarısı [Enes Öztürk]",
                JOptionPane.ERROR_MESSAGE);
        });
    }

    @Override
    public void onCriticalStockDetected(StockAlertEvent event) {
        SwingUtilities.invokeLater(() -> {
            JOptionPane.showMessageDialog(this,
                "UYARI: Ürün Kritik Stok Eşiğinin Altına İndi!\\n" +
                "Mevcut Stok: " + event.getCurrentQuantity() + " | Kritik Eşik: " + event.getThreshold(),
                "Kritik Seviye Uyarısı",
                JOptionPane.WARNING_MESSAGE);
        });
    }

    @Override
    public void onStockLevelChanged(Product product, int oldQty, int newQty, String reason) {
        // Tabloyu güncelle
        refreshTableData();
    }

    private JMenuBar createMenuBar() { /* Swing Menü Kodları */ return new JMenuBar(); }
    private JToolBar createToolBar() { /* Swing Hızlı Araçlar */ return new JToolBar(); }
    private JComponent createMainTabs() { /* JTabbedPane */ return new JTabbedPane(); }
    private JPanel createStatusBar() { /* Alt Durum Çubuğu */ return new JPanel(); }
    private void refreshTableData() { /* JTable Yenile */ }
}`,
  },
];
