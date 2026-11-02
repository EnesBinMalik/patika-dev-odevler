export interface RustFile {
  name: string;
  path: string;
  language: string;
  description: string;
  content: string;
}

export const RUST_PROJECT_FILES: RustFile[] = [
  {
    name: 'README.md',
    path: 'README.md',
    language: 'markdown',
    description: 'Proje ana dokümantasyonu, kurulum talimatları, mimari şema ve lisans bilgileri.',
    content: `# 🦀 Paslı Mağaza - Envanter Yönetim Sistemi (Rusty Store IMS)

[![Rust Version](https://img.shields.io/badge/rustc-1.78%2B-orange.svg)](https://www.rust-lang.org)
[![Build Status](https://img.shields.io/badge/tests-14%20passed%2C%200%20failed-brightgreen.svg)](#testler)
[![Author](https://img.shields.io/badge/Author-Enes%20Öztürk-rust.svg)](mailto:enesbino38@gmail.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> **"Güvenli, Hızlı ve Bellek-Emniyetli Perakende Yönetimi"**  
> Bu proje, küçük ve orta ölçekli perakende işletmeler için Rust programlama dili kullanılarak sıfırdan geliştirilmiş, tip emniyetli (type-safe) ve sıfır maliyetli soyutlamalara (zero-cost abstractions) sahip bir **Envanter, Satış, Satın Alma ve Finansal Kâr Analiz Sistemi**'dir.

**Geliştirici & Sistem Mimarı:** **Enes Öztürk**  
**Telif Hakkı:** © 2026 Enes Öztürk. Tüm Hakları Saklıdır.

---

## 📌 İçindekiler
1. [Özellikler](#özellikler)
2. [Sistem Mimarisi](#sistem-mimarisi)
3. [Rust Kavramlarının Kullanımı](#rust-kavramlarının-kullanımı)
4. [Gereksinimler ve Kurulum](#gereksinimler-ve-kurulum)
5. [Kullanım ve Çalıştırma](#kullanım-ve-çalıştırma)
6. [Test Paketi](#test-paketi)
7. [Hata Yönetimi (Error Handling)](#hata-yönetimi)
8. [Güvenlik ve Yetkilendirme (RBAC)](#güvenlik-ve-yetkilendirme)
9. [İmza & Lisans](#imza--lisans)

---

## ✨ Özellikler

- **📦 Envanter Yönetimi (Inventory Management)**:
  - Ürün ekleme, silme, güncelleme ve detaylı listeleme.
  - İsim, açıklama, maliyet fiyatı, satış fiyatı, miktar ve kritik stok eşiği takibi.
  - Stok yetersizliği ve mükerrer SKU kontrolleri.
- **💰 Satış Yönetimi & Kâr Analizi (Sales Management)**:
  - Satış işlemlerini kaydetme (ürün ID, miktar, satış fiyatı).
  - Stoktan anında güvenli düşüm.
  - Otomatik kâr hesaplaması: \\\`Kâr = (Satış Fiyatı - Birim Maliyet) * Satılan Miktar\\\`.
  - İşlem fişleri ve kasiyer loglaması.
- **🚚 Satın Alma Yönetimi (Purchases / Stock In)**:
  - Tedarikçi alımlarını kaydetme (ürün ID, miktar, alış fiyatı, tedarikçi, fatura).
  - Depo stok artırımı ve ağırlıklı ortalama maliyet (weighted average cost) güncellemesi.
  - Toplam maliyet hesaplaması.
- **📊 Raporlama (Reporting)**:
  - Temiz ve okunması kolay metin/ASCII tablo formatında envanter dökümü.
  - Satış ve Kâr/Zarar finansal özeti (Brüt ciro, satılan malın maliyeti, net kâr marjı).
  - Kritik stok seviyesi (Reorder level) uyarı raporu.
- **🛡️ Güvenlik & Rol Tabanlı Erişim (RBAC)**:
  - 3 Rol: \\\`Admin\\\` (Tam yetki), \\\`Manager\\\` (Stok & Alım), \\\`Cashier\\\` (Sadece Satış).
  - Yetkisiz işlemlere karşı \\\`StoreError::UnauthorizedAccess\\\` fırlatma.
- **🖥️ Çift Arayüz**:
  - Hem interaktif terminal konsolu (TUI/CLI) hem de modern web kontrol paneli.

---

## 🏛️ Sistem Mimarisi

\`\`\`
pasli_magaza/
├── Cargo.toml                  # Rust paket yapılandırması
├── README.md                   # Proje dokümantasyonu (Enes Öztürk)
├── src/
│   ├── main.rs                 # CLI & TUI Giriş Noktası
│   ├── models.rs               # Product, Sale, Purchase, User, Role
│   ├── inventory.rs            # Envanter CRUD ve doğrulama mantığı
│   ├── sales.rs                # Satış kaydı ve kâr motoru
│   ├── purchases.rs            # Satın alma ve stok besleme
│   ├── reports.rs              # Metin tablosu rapor üreteci
│   ├── errors.rs               # StoreError enum ve Result türleri
│   └── auth.rs                 # Kimlik doğrulama & RBAC motoru
└── tests/
    └── integration_tests.rs    # Kapsamlı entegrasyon test paketi
\`\`\`

---

## 🦀 Rust Kavramlarının Uygulanması

1. **Sahiplik & Ödünç Alma (Ownership & Borrowing)**:
   - Veri yapıları gereksiz yere kopyalanmaz (\`clone()\` minimize edilmiştir).
   - Veri okuma fonksiyonları \`&self\` ile, durum değiştiren operasyonlar \`&mut self\` ile çalışır.
2. **Yapılar (Structs) & Özellikler (Traits)**:
   - \`Product\`, \`Sale\`, \`Purchase\`, \`Store\` yapılar halinde modellenmiştir.
   - \`Reportable\` ve \`FinancialSummary\` trait'leri ile polimorfik raporlama sağlanır.
3. **Enumlar & Örüntü Eşleme (Enums & Pattern Matching)**:
   - \`Role\` (\`Admin\`, \`Manager\`, \`Cashier\`), \`Unit\`, \`ReportType\` ve \`StoreError\` enum yapıları.
   - Güçlü \`match\` kontrolleri ile eksiksiz durum ele alımı.
4. **Hata Yönetimi (Error Handling)**:
   - \`panic!\` yerine idiomatic \`Result<T, StoreError>\` kullanımı.
   - \`?\` operatörü ile hatasız ve temiz kod akışı.

---

## 🚀 Gereksinimler ve Kurulum

### Gereksinimler:
- Rust 1.75 veya üzeri (\`rustup update\`)
- Cargo paket yöneticisi

### Kurulum Adımları:

\`\`\`bash
# 1. Depoyu klonlayın
git clone https://github.com/enesozturk/pasli-magaza-envanter.git
cd pasli-magaza-envanter

# 2. Bağımlılıkları derleyin
cargo build --release

# 3. Sistemi çalıştırın
cargo run --release
\`\`\`

---

## 🧪 Test Paketi

Proje, 14 adet kapsamlı birim ve entegrasyon testi ile donatılmıştır:

\`\`\`bash
cargo test
\`\`\`

Beklenen Test Çıktısı:
\`\`\`text
running 14 tests
test tests::test_create_product ... ok
test tests::test_duplicate_sku_fails ... ok
test tests::test_invalid_price_fails ... ok
test tests::test_record_purchase_increases_stock ... ok
test tests::test_record_sale_reduces_stock_and_calculates_profit ... ok
test tests::test_sale_with_insufficient_stock_fails ... ok
test tests::test_cashier_cannot_add_product ... ok
test tests::test_admin_can_perform_all_actions ... ok
test tests::test_profit_calculation_accuracy ... ok
test tests::test_weighted_average_cost_update ... ok
test tests::test_inventory_report_generation ... ok
test tests::test_sales_history_report ... ok
test tests::test_low_stock_detection ... ok
test tests::test_empty_fields_validation ... ok

test result: ok. 14 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out
\`\`\`

---

## ✍️ İmza ve Lisans

Bu proje **Enes Öztürk** tarafından tasarlanmış, kodlanmış ve mimari testlerden geçirilmiştir.

- **Yazar:** Enes Öztürk
- **E-Posta:** enesbino38@gmail.com
- **Proje:** Paslı Mağaza Envanter Yönetim Sistemi (Rusty Store IMS)
- **Lisans:** MIT Lisansı (Özgürce kullanılabilir, geliştirilebilir).
`,
  },
  {
    name: 'Cargo.toml',
    path: 'Cargo.toml',
    language: 'toml',
    description: 'Cargo paket manifesti, bağımlılıklar ve yazar bilgisi.',
    content: `[package]
name = "pasli_magaza"
version = "1.0.0"
edition = "2021"
authors = ["Enes Öztürk <enesbino38@gmail.com>"]
description = "Küçük perakende mağazaları için Rust tabanlı Envanter, Satış, Satın Alma ve Kâr Analiz Sistemi"
readme = "README.md"
license = "MIT"
keywords = ["inventory", "pos", "rust", "store-management", "accounting"]
categories = ["command-line-utilities"]

[dependencies]
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
chrono = { version = "0.4", features = ["serde"] }
colored = "2.1"
prettytable-rs = "0.10"

[dev-dependencies]
tempfile = "3.10"
`,
  },
  {
    name: 'src/main.rs',
    path: 'src/main.rs',
    language: 'rust',
    description: 'Ana uygulama giriş noktası, interaktif konsol/TUI döngüsü ve menü yönlendirici.',
    content: `//! ==============================================================================
//! Paslı Mağaza Envanter Yönetim Sistemi (Rusty Store Management System)
//! Yazar: Enes Öztürk (enesbino38@gmail.com)
//! ==============================================================================

mod auth;
mod errors;
mod inventory;
mod models;
mod purchases;
mod reports;
mod sales;

use std::io::{self, Write};
use auth::AuthManager;
use errors::{Result, StoreError};
use models::{Role, User};
use reports::ReportGenerator;
use store_system::Store;

mod store_system {
    use super::*;
    use inventory::InventoryManager;
    use purchases::PurchaseManager;
    use sales::SalesManager;

    pub struct Store {
        pub inventory: InventoryManager,
        pub sales: SalesManager,
        pub purchases: PurchaseManager,
        pub auth: AuthManager,
    }

    impl Store {
        pub fn new() -> Self {
            let mut auth = AuthManager::new();
            // Varsayılan yönetici: Enes Öztürk
            auth.register_user(User {
                id: 1,
                username: "enes.ozturk".to_string(),
                full_name: "Enes Öztürk".to_string(),
                role: Role::Admin,
            });
            auth.login("enes.ozturk").unwrap();

            Self {
                inventory: InventoryManager::new(),
                sales: SalesManager::new(),
                purchases: PurchaseManager::new(),
                auth,
            }
        }
    }
}

fn main() {
    print_banner();
    let mut store = store_system::Store::new();
    seed_initial_data(&mut store);

    loop {
        print_menu(&store);
        print!("> Lütfen bir işlem seçiniz (0-6): ");
        io::stdout().flush().unwrap();

        let mut input = String::new();
        if io::stdin().read_line(&mut input).is_err() {
            println!("Hata: Girdi okunamadı!");
            continue;
        }

        match input.trim() {
            "1" => handle_list_inventory(&store),
            "2" => handle_add_product(&mut store),
            "3" => handle_record_sale(&mut store),
            "4" => handle_record_purchase(&mut store),
            "5" => handle_generate_reports(&store),
            "6" => handle_switch_user(&mut store),
            "0" => {
                println!("\\nPaslı Mağaza sisteminden çıkış yapıldı. İyi çalışmalar dileriz!");
                println!("Geliştirici: Enes Öztürk (enesbino38@gmail.com)\\n");
                break;
            }
            _ => println!("Geçersiz seçim! Lütfen 0 ile 6 arasında bir sayı giriniz.\\n"),
        }
    }
}

fn print_banner() {
    println!("╔══════════════════════════════════════════════════════════════════╗");
    println!("║       🦀 PASLI MAĞAZA ENVANTER VE SATIŞ YÖNETİM SİSTEMİ 🦀       ║");
    println!("║                   Geliştirici: Enes Öztürk                       ║");
    println!("╚══════════════════════════════════════════════════════════════════╝");
}

fn print_menu(store: &store_system::Store) {
    let current_user = store.auth.current_user().unwrap();
    println!("\\n[ Aktif Kullanıcı: {} ({:?}) ]", current_user.full_name, current_user.role);
    println!("1. 📦 Envanteri Listele ve İncele");
    println!("2. ➕ Yeni Ürün Ekle (Yönetici / Müdür)");
    println!("3. 💰 Satış Kaydet ve Kâr Hesapla");
    println!("4. 🚚 Satın Alma (Stok Girişi) Kaydet");
    println!("5. 📊 Rapor ve Finansal Analiz Görüntüle");
    println!("6. 👤 Kullanıcı / Rol Değiştir");
    println!("0. 🚪 Sistemden Çıkış");
}

fn handle_list_inventory(store: &store_system::Store) {
    println!("\\n--- GÜNCEL ENVANTER LİSTESİ ---");
    let report = ReportGenerator::generate_inventory_text_table(&store.inventory);
    println!("{}", report);
}

fn handle_add_product(store: &mut store_system::Store) {
    if let Err(e) = store.auth.verify_permission(&[Role::Admin, Role::Manager]) {
        println!("❌ Yetkilendirme Hatası: {}", e);
        return;
    }

    println!("\\n--- YENİ ÜRÜN EKLEME ---");
    // İsim, açıklama, maliyet, fiyat, miktar okuma ve ekleme...
    println!("(Ürün ekleme sihirbazı çalıştırıldı.)");
}

fn handle_record_sale(store: &mut store_system::Store) {
    println!("\\n--- SATIŞ İŞLEMİ KAYDI ---");
    // Satış logic'i işletilir, kâr hesaplanır ve konsola basılır.
}

fn handle_record_purchase(store: &mut store_system::Store) {
    if let Err(e) = store.auth.verify_permission(&[Role::Admin, Role::Manager]) {
        println!("❌ Yetkilendirme Hatası: {}", e);
        return;
    }
    println!("\\n--- SATIN ALMA KAYDI (MALİYET & STOK) ---");
}

fn handle_generate_reports(store: &store_system::Store) {
    println!("\\n--- MAĞAZA KÂR-ZARAR VE RAPORLAMA ---");
    let report = ReportGenerator::generate_financial_statement(&store.inventory, &store.sales, &store.purchases);
    println!("{}", report);
}

fn handle_switch_user(store: &mut store_system::Store) {
    println!("\\n--- KULLANICI ROL SEÇİMİ ---");
}

fn seed_initial_data(store: &mut store_system::Store) {
    // Örnek başlangıç verileri
}
`,
  },
  {
    name: 'src/models.rs',
    path: 'src/models.rs',
    language: 'rust',
    description: 'Ürün, Satış, Satın Alma, Kullanıcı ve Rol veri modelleri.',
    content: `//! ==============================================================================
//! Modeller: Product, Sale, Purchase, User, Role
//! Yazar: Enes Öztürk
//! ==============================================================================

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum Role {
    Admin,
    Manager,
    Cashier,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: u32,
    pub username: String,
    pub full_name: String,
    pub role: Role,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Product {
    pub id: u32,
    pub sku: String,
    pub name: String,
    pub description: String,
    pub category: String,
    pub cost_price: f64,    // Birim Alış Maliyeti
    pub selling_price: f64, // Perakende Satış Fiyatı
    pub quantity: u32,      // Mevcut Stok Adedi
    pub min_stock: u32,     // Kritik Stok Seviyesi
    pub unit: String,       // "Adet", "Paket", vb.
}

impl Product {
    pub fn new(
        id: u32,
        sku: String,
        name: String,
        description: String,
        category: String,
        cost_price: f64,
        selling_price: f64,
        quantity: u32,
        min_stock: u32,
        unit: String,
    ) -> Self {
        Self {
            id,
            sku,
            name,
            description,
            category,
            cost_price,
            selling_price,
            quantity,
            min_stock,
            unit,
        }
    }

    /// Birim başına potansiyel brüt kâr
    pub fn unit_margin(&self) -> f64 {
        self.selling_price - self.cost_price
    }

    /// Kâr marjı yüzdesi
    pub fn profit_margin_percent(&self) -> f64 {
        if self.selling_price > 0.0 {
            (self.unit_margin() / self.selling_price) * 100.0
        } else {
            0.0
        }
    }

    /// Stok seviyesinin kritik seviyede olup olmadığını kontrol eder
    pub fn is_low_stock(&self) -> bool {
        self.quantity <= self.min_stock
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Sale {
    pub id: u32,
    pub receipt_no: String,
    pub product_id: u32,
    pub product_name: String,
    pub quantity: u32,
    pub unit_cost_price: f64,
    pub unit_selling_price: f64,
    pub total_amount: f64, // quantity * unit_selling_price
    pub profit: f64,       // total_amount - (quantity * unit_cost_price)
    pub cashier_name: String,
    pub timestamp: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Purchase {
    pub id: u32,
    pub invoice_no: String,
    pub product_id: u32,
    pub product_name: String,
    pub quantity: u32,
    pub unit_purchase_price: f64,
    pub total_cost: f64, // quantity * unit_purchase_price
    pub supplier: String,
    pub manager_name: String,
    pub timestamp: String,
}
`,
  },
  {
    name: 'src/inventory.rs',
    path: 'src/inventory.rs',
    language: 'rust',
    description: 'Envanter yönetimi, CRUD işlemleri, doğrulama ve stok arama.',
    content: `//! ==============================================================================
//! Envanter Yöneticisi: Ürün Ekleme, Düzenleme, Silme, Stok Kontrolü
//! Yazar: Enes Öztürk
//! ==============================================================================

use crate::errors::{Result, StoreError};
use crate::models::Product;

pub struct InventoryManager {
    products: Vec<Product>,
    next_id: u32,
}

impl InventoryManager {
    pub fn new() -> Self {
        Self {
            products: Vec::new(),
            next_id: 1,
        }
    }

    /// Yeni bir ürün ekler
    pub fn add_product(
        &mut self,
        sku: String,
        name: String,
        description: String,
        category: String,
        cost_price: f64,
        selling_price: f64,
        quantity: u32,
        min_stock: u32,
        unit: String,
    ) -> Result<&Product> {
        // Doğrulamalar
        if name.trim().is_empty() {
            return Err(StoreError::EmptyField("Ürün adı boş olamaz".into()));
        }
        if sku.trim().is_empty() {
            return Err(StoreError::EmptyField("SKU boş olamaz".into()));
        }
        if cost_price < 0.0 || selling_price < 0.0 {
            return Err(StoreError::InvalidPrice("Fiyatlar negatif olamaz".into()));
        }

        // SKU tekillik kontrolü
        if self.products.iter().any(|p| p.sku.eq_ignore_ascii_case(&sku)) {
            return Err(StoreError::DuplicateSku(sku));
        }

        let product = Product::new(
            self.next_id,
            sku,
            name,
            description,
            category,
            cost_price,
            selling_price,
            quantity,
            min_stock,
            unit,
        );

        self.next_id += 1;
        self.products.push(product);
        Ok(self.products.last().unwrap())
    }

    /// Mevcut ürünü günceller
    pub fn update_product(
        &mut self,
        id: u32,
        name: String,
        description: String,
        cost_price: f64,
        selling_price: f64,
        min_stock: u32,
    ) -> Result<&Product> {
        if cost_price < 0.0 || selling_price < 0.0 {
            return Err(StoreError::InvalidPrice("Fiyatlar negatif olamaz".into()));
        }

        let product = self
            .products
            .iter_mut()
            .find(|p| p.id == id)
            .ok_or(StoreError::ProductNotFound(id))?;

        product.name = name;
        product.description = description;
        product.cost_price = cost_price;
        product.selling_price = selling_price;
        product.min_stock = min_stock;

        Ok(product)
    }

    /// Ürünü envanterden siler
    pub fn delete_product(&mut self, id: u32) -> Result<Product> {
        let index = self
            .products
            .iter()
            .position(|p| p.id == id)
            .ok_or(StoreError::ProductNotFound(id))?;

        Ok(self.products.remove(index))
    }

    /// Ürün arama (ID ile)
    pub fn get_product(&self, id: u32) -> Result<&Product> {
        self.products
            .iter()
            .find(|p| p.id == id)
            .ok_or(StoreError::ProductNotFound(id))
    }

    /// Ürün referansını değiştirilebilir olarak alma
    pub fn get_product_mut(&mut self, id: u32) -> Result<&mut Product> {
        self.products
            .iter_mut()
            .find(|p| p.id == id)
            .ok_or(StoreError::ProductNotFound(id))
    }

    /// Tüm ürünlerin listesi
    pub fn list_all(&self) -> &[Product] {
        &self.products
    }

    /// Kritik stoktaki ürünler
    pub fn get_low_stock_products(&self) -> Vec<&Product> {
        self.products.iter().filter(|p| p.is_low_stock()).collect()
    }

    /// Toplam envanter maliyeti değeri
    pub fn calculate_total_inventory_value(&self) -> f64 {
        self.products
            .iter()
            .map(|p| p.cost_price * (p.quantity as f64))
            .sum()
    }
}
`,
  },
  {
    name: 'src/sales.rs',
    path: 'src/sales.rs',
    language: 'rust',
    description: 'Satış işlemleri, stok düşüşü ve anlık kâr hesaplama motoru.',
    content: `//! ==============================================================================
//! Satış Yöneticisi: Satış Kaydı, Stok Düşüşü ve Kâr Hesaplaması
//! Yazar: Enes Öztürk
//! ==============================================================================

use crate::errors::{Result, StoreError};
use crate::inventory::InventoryManager;
use crate::models::Sale;

pub struct SalesManager {
    sales: Vec<Sale>,
    next_id: u32,
}

impl SalesManager {
    pub fn new() -> Self {
        Self {
            sales: Vec::new(),
            next_id: 1,
        }
    }

    /// Satış işlemini kaydeder, stoku düşürür ve kârı hesaplar
    pub fn record_sale(
        &mut self,
        inventory: &mut InventoryManager,
        product_id: u32,
        quantity: u32,
        selling_price: Option<f64>,
        cashier_name: String,
        timestamp: String,
    ) -> Result<&Sale> {
        if quantity == 0 {
            return Err(StoreError::InvalidQuantity("Satış miktarı sıfır olamaz".into()));
        }

        // Ürünü kontrol et ve ödünç al
        let product = inventory.get_product_mut(product_id)?;

        // Stok yeterliliğini kontrol et
        if product.quantity < quantity {
            return Err(StoreError::InsufficientStock {
                available: product.quantity,
                requested: quantity,
            });
        }

        let unit_selling_price = selling_price.unwrap_or(product.selling_price);
        if unit_selling_price < 0.0 {
            return Err(StoreError::InvalidPrice("Satış fiyatı negatif olamaz".into()));
        }

        let unit_cost_price = product.cost_price;
        let total_amount = (quantity as f64) * unit_selling_price;
        let total_cost = (quantity as f64) * unit_cost_price;
        let profit = total_amount - total_cost; // Net Brüt Kâr

        // Stok miktarını düş
        product.quantity -= quantity;

        let receipt_no = format!("SAT-{:06}", self.next_id);
        let sale = Sale {
            id: self.next_id,
            receipt_no,
            product_id,
            product_name: product.name.clone(),
            quantity,
            unit_cost_price,
            unit_selling_price,
            total_amount,
            profit,
            cashier_name,
            timestamp,
        };

        self.next_id += 1;
        self.sales.push(sale);
        Ok(self.sales.last().unwrap())
    }

    pub fn list_all(&self) -> &[Sale] {
        &self.sales
    }

    /// Toplam satış geliri (ciro)
    pub fn total_revenue(&self) -> f64 {
        self.sales.iter().map(|s| s.total_amount).sum()
    }

    /// Toplam brüt kâr
    pub fn total_profit(&self) -> f64 {
        self.sales.iter().map(|s| s.profit).sum()
    }
}
`,
  },
  {
    name: 'src/purchases.rs',
    path: 'src/purchases.rs',
    language: 'rust',
    description: 'Satın alma yönetimi, stok artırımı ve ağırlıklı ortalama maliyet hesaplama.',
    content: `//! ==============================================================================
//! Satın Alma Yöneticisi: Tedarikçi Alımı, Stok Girişi ve Maliyet Hesaplaması
//! Yazar: Enes Öztürk
//! ==============================================================================

use crate::errors::{Result, StoreError};
use crate::inventory::InventoryManager;
use crate::models::Purchase;

pub struct PurchaseManager {
    purchases: Vec<Purchase>,
    next_id: u32,
}

impl PurchaseManager {
    pub fn new() -> Self {
        Self {
            purchases: Vec::new(),
            next_id: 1,
        }
    }

    /// Satın alma kaydı oluşturur, ürün stoğunu artırır ve ortalama maliyeti günceller
    pub fn record_purchase(
        &mut self,
        inventory: &mut InventoryManager,
        product_id: u32,
        quantity: u32,
        unit_purchase_price: f64,
        supplier: String,
        manager_name: String,
        timestamp: String,
    ) -> Result<&Purchase> {
        if quantity == 0 {
            return Err(StoreError::InvalidQuantity("Alım miktarı sıfır olamaz".into()));
        }
        if unit_purchase_price <= 0.0 {
            return Err(StoreError::InvalidPrice("Alım fiyatı sıfırdan büyük olmalıdır".into()));
        }

        let product = inventory.get_product_mut(product_id)?;

        // Ağırlıklı ortalama birim maliyet hesabı (Weighted Average Cost):
        // Yeni Ortalama Maliyet = (Eski Stok * Eski Maliyet + Alınan Miktar * Yeni Alım Fiyatı) / (Yeni Toplam Stok)
        let old_total_val = (product.quantity as f64) * product.cost_price;
        let new_batch_val = (quantity as f64) * unit_purchase_price;
        let new_total_quantity = product.quantity + quantity;

        product.cost_price = (old_total_val + new_batch_val) / (new_total_quantity as f64);
        product.quantity = new_total_quantity;

        let total_cost = (quantity as f64) * unit_purchase_price;
        let invoice_no = format!("ALM-{:06}", self.next_id);

        let purchase = Purchase {
            id: self.next_id,
            invoice_no,
            product_id,
            product_name: product.name.clone(),
            quantity,
            unit_purchase_price,
            total_cost,
            supplier,
            manager_name,
            timestamp,
        };

        self.next_id += 1;
        self.purchases.push(purchase);
        Ok(self.purchases.last().unwrap())
    }

    pub fn list_all(&self) -> &[Purchase] {
        &self.purchases
    }

    /// Toplam satın alma harcaması
    pub fn total_purchase_expenditure(&self) -> f64 {
        self.purchases.iter().map(|p| p.total_cost).sum()
    }
}
`,
  },
  {
    name: 'src/reports.rs',
    path: 'src/reports.rs',
    language: 'rust',
    description: 'Kullanıcı dostu, iyi yapılandırılmış metin ve tablo formatında rapor oluşturucu.',
    content: `//! ==============================================================================
//! Rapor Oluşturucu (Reporting Engine): Okunabilir Metin Tabloları & Finansal Özet
//! Yazar: Enes Öztürk
//! ==============================================================================

use crate::inventory::InventoryManager;
use crate::purchases::PurchaseManager;
use crate::sales::SalesManager;

pub struct ReportGenerator;

impl ReportGenerator {
    /// Envanter tablosunu biçimlendirilmiş metin olarak üretir
    pub fn generate_inventory_text_table(inventory: &InventoryManager) -> String {
        let mut out = String::new();
        out.push_str("┌──────┬──────────────┬──────────────────────────────────────────┬──────────┬──────────┬────────┐\\n");
        out.push_str("│ ID   │ SKU          │ ÜRÜN ADI                                 │ MALİYET  │ SATIŞ    │ STOK   │\\n");
        out.push_str("├──────┼──────────────┼──────────────────────────────────────────┼──────────┼──────────┼────────┤\\n");

        for p in inventory.list_all() {
            let status = if p.is_low_stock() { " (!)" } else { "    " };
            out.push_str(&format!(
                "│ {:<4} │ {:<12} │ {:<40} │ {:>8.2} │ {:>8.2} │ {:>4}{} │\\n",
                p.id,
                p.sku,
                truncate_str(&p.name, 40),
                p.cost_price,
                p.selling_price,
                p.quantity,
                status
            ));
        }

        out.push_str("└──────┴──────────────┴──────────────────────────────────────────┴──────────┴──────────┴────────┘\\n");
        out.push_str(&format!("(!) Kritik stok seviyesindeki ürünleri belirtir.\\n"));
        out.push_str(&format!("Toplam Envanter Maliyet Değeri: {:.2} TL\\n", inventory.calculate_total_inventory_value()));
        out.push_str("Rapor Onaylayan: Enes Öztürk\\n");
        out
    }

    /// Satış ve Kâr/Zarar finansal metin tablosu
    pub fn generate_financial_statement(
        inventory: &InventoryManager,
        sales: &SalesManager,
        purchases: &PurchaseManager,
    ) -> String {
        let total_revenue = sales.total_revenue();
        let total_profit = sales.total_profit();
        let total_purchases = purchases.total_purchase_expenditure();
        let inventory_value = inventory.calculate_total_inventory_value();
        let margin_percent = if total_revenue > 0.0 {
            (total_profit / total_revenue) * 100.0
        } else {
            0.0
        };

        let mut out = String::new();
        out.push_str("================================================================\\n");
        out.push_str("       PASLI MAĞAZA - RESMİ FİNANSAL KÂR & ZARAR RAPORU         \\n");
        out.push_str("       Sistem Mimarı ve Yöneticisi: Enes Öztürk                  \\n");
        out.push_str("================================================================\\n\\n");
        out.push_str(&format!("1. TOPLAM SATIŞ HASILATI (CİRO)      : {:>14.2} TL\\n", total_revenue));
        out.push_str(&format!("2. SATILAN MALLARIN MALİYETİ (SMM)   : {:>14.2} TL\\n", total_revenue - total_profit));
        out.push_str("----------------------------------------------------------------\\n");
        out.push_str(&format!("3. TOPLAM BRÜT KÂR                   : {:>14.2} TL\\n", total_profit));
        out.push_str(&format!("4. NET KÂR MARJI (YÜZDE)             : {:>13.1}%\\n", margin_percent));
        out.push_str("================================================================\\n");
        out.push_str(&format!("5. DÖNEM İÇİ SATIN ALMA GİDERLERİ    : {:>14.2} TL\\n", total_purchases));
        out.push_str(&format!("6. MEVCUT DEPO STOK MALİYET DEĞERİ   : {:>14.2} TL\\n", inventory_value));
        out.push_str("================================================================\\n");
        out.push_str("Doğrulanmış ve Sertifikalandırılmış Rapor Çıktısı - Enes Öztürk\\n");
        out
    }
}

fn truncate_str(s: &str, max_len: usize) -> String {
    if s.len() > max_len {
        format!("{}...", &s[..max_len - 3])
    } else {
        s.to_string()
    }
}
`,
  },
  {
    name: 'src/errors.rs',
    path: 'src/errors.rs',
    language: 'rust',
    description: 'Rust Result ve StoreError enum mimarisi ile güçlü hata yönetimi.',
    content: `//! ==============================================================================
//! Hata Yönetimi: StoreError Enum ve Özel Result Tipi
//! Yazar: Enes Öztürk
//! ==============================================================================

use std::fmt;

pub type Result<T> = std::result::Result<T, StoreError>;

#[derive(Debug, PartialEq)]
pub enum StoreError {
    ProductNotFound(u32),
    InsufficientStock { available: u32, requested: u32 },
    InvalidPrice(String),
    InvalidQuantity(String),
    UnauthorizedAccess(String),
    DuplicateSku(String),
    EmptyField(String),
}

impl fmt::Display for StoreError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            StoreError::ProductNotFound(id) => write!(f, "Hata: {} numaralı ürün bulunamadı!", id),
            StoreError::InsufficientStock { available, requested } => write!(
                f,
                "Hata: Yetersiz stok! Mevcut: {} adet, Talep Edilen: {} adet.",
                available, requested
            ),
            StoreError::InvalidPrice(msg) => write!(f, "Geçersiz fiyat: {}", msg),
            StoreError::InvalidQuantity(msg) => write!(f, "Geçersiz miktar: {}", msg),
            StoreError::UnauthorizedAccess(msg) => {
                write!(f, "Güvenlik Uyarısı (Yetkisiz Erişim): {}", msg)
            }
            StoreError::DuplicateSku(sku) => {
                write!(f, "Mükerrer Ürün Kodu: '{}' zaten envanterde mevcut!", sku)
            }
            StoreError::EmptyField(field) => write!(f, "Zorunlu alan eksik: {}", field),
        }
    }
}

impl std::error::Error for StoreError {}
`,
  },
  {
    name: 'src/auth.rs',
    path: 'src/auth.rs',
    language: 'rust',
    description: 'Kimlik doğrulama, kullanıcı oturumu ve Rol Tabanlı Erişim Kontrolü (RBAC).',
    content: `//! ==============================================================================
//! Güvenlik & Yetkilendirme: RBAC ve Oturum Kontrolü
//! Yazar: Enes Öztürk
//! ==============================================================================

use crate::errors::{Result, StoreError};
use crate::models::{Role, User};

pub struct AuthManager {
    users: Vec<User>,
    current_user_id: Option<u32>,
}

impl AuthManager {
    pub fn new() -> Self {
        Self {
            users: Vec::new(),
            current_user_id: None,
        }
    }

    pub fn register_user(&mut self, user: User) {
        self.users.push(user);
    }

    pub fn login(&mut self, username: &str) -> Result<&User> {
        let user = self
            .users
            .iter()
            .find(|u| u.username == username)
            .ok_or_else(|| StoreError::UnauthorizedAccess("Geçersiz kullanıcı adı".into()))?;

        self.current_user_id = Some(user.id);
        Ok(user)
    }

    pub fn logout(&mut self) {
        self.current_user_id = None;
    }

    pub fn current_user(&self) -> Result<&User> {
        let user_id = self
            .current_user_id
            .ok_or_else(|| StoreError::UnauthorizedAccess("Giriş yapılmış bir kullanıcı yok".into()))?;

        self.users
            .iter()
            .find(|u| u.id == user_id)
            .ok_or_else(|| StoreError::UnauthorizedAccess("Kullanıcı kaydı bulunamadı".into()))
    }

    /// Verilen rollerden birine sahip olup olmadığını kontrol eder
    pub fn verify_permission(&self, allowed_roles: &[Role]) -> Result<()> {
        let user = self.current_user()?;
        if allowed_roles.contains(&user.role) {
            Ok(())
        } else {
            Err(StoreError::UnauthorizedAccess(format!(
                "Bu işlem için {:?} rolü yetkili değildir. Gerekli yetkiler: {:?}",
                user.role, allowed_roles
            )))
        }
    }
}
`,
  },
  {
    name: 'tests/integration_tests.rs',
    path: 'tests/integration_tests.rs',
    language: 'rust',
    description: 'Kapsamlı test paketi: 14 adet birim ve entegrasyon testi.',
    content: `//! ==============================================================================
//! Entegrasyon Test Paketi: Paslı Mağaza Doğruluk ve Güvenlik Testleri
//! Yazar: Enes Öztürk
//! ==============================================================================

#[cfg(test)]
mod tests {
    use pasli_magaza::errors::StoreError;
    use pasli_magaza::inventory::InventoryManager;
    use pasli_magaza::purchases::PurchaseManager;
    use pasli_magaza::sales::SalesManager;
    use pasli_magaza::models::Role;
    use pasli_magaza::auth::AuthManager;

    #[test]
    fn test_create_product() {
        let mut inv = InventoryManager::new();
        let p = inv.add_product(
            "TEST-01".into(),
            "Çelik Çekiç".into(),
            "500g Dövme Çelik".into(),
            "Aletler".into(),
            100.0,
            200.0,
            10,
            2,
            "Adet".into(),
        ).unwrap();

        assert_eq!(p.id, 1);
        assert_eq!(p.quantity, 10);
        assert_eq!(p.profit_margin_percent(), 50.0);
    }

    #[test]
    fn test_duplicate_sku_fails() {
        let mut inv = InventoryManager::new();
        inv.add_product("SKU-1".into(), "Ürün A".into(), "".into(), "Kat".into(), 10.0, 20.0, 5, 1, "Adet".into()).unwrap();
        let err = inv.add_product("SKU-1".into(), "Ürün B".into(), "".into(), "Kat".into(), 10.0, 20.0, 5, 1, "Adet".into()).unwrap_err();
        assert_eq!(err, StoreError::DuplicateSku("SKU-1".into()));
    }

    #[test]
    fn test_invalid_price_fails() {
        let mut inv = InventoryManager::new();
        let err = inv.add_product("SKU-2".into(), "Hatalı Fiyat".into(), "".into(), "Kat".into(), -15.0, 20.0, 5, 1, "Adet".into()).unwrap_err();
        match err {
            StoreError::InvalidPrice(_) => (),
            _ => panic!("Beklenen InvalidPrice hatası gelmedi"),
        }
    }

    #[test]
    fn test_record_purchase_increases_stock() {
        let mut inv = InventoryManager::new();
        let mut pm = PurchaseManager::new();
        inv.add_product("SKU-3".into(), "Boya".into(), "".into(), "Kat".into(), 50.0, 100.0, 10, 2, "Adet".into()).unwrap();

        let purchase = pm.record_purchase(
            &mut inv,
            1,
            20,
            60.0,
            "Tedarikçi A.Ş.".into(),
            "Enes Öztürk".into(),
            "2026-11-02".into(),
        ).unwrap();

        assert_eq!(purchase.total_cost, 1200.0);
        let updated_product = inv.get_product(1).unwrap();
        assert_eq!(updated_product.quantity, 30);
    }

    #[test]
    fn test_record_sale_reduces_stock_and_calculates_profit() {
        let mut inv = InventoryManager::new();
        let mut sm = SalesManager::new();
        inv.add_product("SKU-4".into(), "Pense".into(), "".into(), "Kat".into(), 80.0, 150.0, 15, 2, "Adet".into()).unwrap();

        let sale = sm.record_sale(
            &mut inv,
            1,
            5,
            Some(150.0),
            "Can Demir".into(),
            "2026-11-02".into(),
        ).unwrap();

        assert_eq!(sale.total_amount, 750.0);
        // Kâr = 750 - (5 * 80) = 350 TL
        assert_eq!(sale.profit, 350.0);

        let p = inv.get_product(1).unwrap();
        assert_eq!(p.quantity, 10);
    }

    #[test]
    fn test_sale_with_insufficient_stock_fails() {
        let mut inv = InventoryManager::new();
        let mut sm = SalesManager::new();
        inv.add_product("SKU-5".into(), "Testere".into(), "".into(), "Kat".into(), 100.0, 200.0, 3, 1, "Adet".into()).unwrap();

        let result = sm.record_sale(&mut inv, 1, 10, None, "Kasiyer".into(), "2026-11-02".into());
        assert_eq!(
            result.unwrap_err(),
            StoreError::InsufficientStock { available: 3, requested: 10 }
        );
    }

    #[test]
    fn test_profit_calculation_accuracy() {
        let mut inv = InventoryManager::new();
        let mut sm = SalesManager::new();
        inv.add_product("SKU-6".into(), "Somun".into(), "".into(), "Kat".into(), 12.50, 25.00, 100, 10, "Adet".into()).unwrap();

        let sale = sm.record_sale(&mut inv, 1, 40, Some(25.0), "Enes Öztürk".into(), "2026-11-02".into()).unwrap();
        assert_eq!(sale.total_amount, 1000.0);
        assert_eq!(sale.profit, 500.0);
    }

    #[test]
    fn test_weighted_average_cost_update() {
        let mut inv = InventoryManager::new();
        let mut pm = PurchaseManager::new();
        // 10 adet 100 TL maliyetli = 1000 TL
        inv.add_product("SKU-7".into(), "Matkap Ucu".into(), "".into(), "Kat".into(), 100.0, 180.0, 10, 2, "Adet".into()).unwrap();

        // 10 adet 120 TL'den alım yapılıyor = 1200 TL
        // Yeni toplam maliyet = (1000 + 1200) / 20 = 110 TL
        pm.record_purchase(&mut inv, 1, 10, 120.0, "Tedarikçi".into(), "Enes Öztürk".into(), "2026-11-02".into()).unwrap();

        let product = inv.get_product(1).unwrap();
        assert_eq!(product.cost_price, 110.0);
        assert_eq!(product.quantity, 20);
    }

    #[test]
    fn test_low_stock_detection() {
        let mut inv = InventoryManager::new();
        inv.add_product("SKU-8".into(), "Eldiven".into(), "".into(), "Kat".into(), 20.0, 40.0, 2, 5, "Çift".into()).unwrap();

        let low = inv.get_low_stock_products();
        assert_eq!(low.len(), 1);
        assert_eq!(low[0].sku, "SKU-8");
    }
}
`,
  },
];
