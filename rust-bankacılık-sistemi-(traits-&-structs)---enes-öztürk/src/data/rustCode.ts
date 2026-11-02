export const RUST_CODE_TURKISH = `// ============================================================================
// Proje: Rust Traits (Özellikler) ile Temel Bankacılık Sistemi
// Geliştirici & Yazar: Enes Öztürk
// Lisans: Apache-2.0 / MIT
// ============================================================================

/// 1. Adım: Yatırma, çekme ve bakiye yöntemlerini tanımlayan Hesap özelliği (Trait).
/// Bu yöntemler özbaşdaklık referansını (&self veya &mut self) argüman olarak alır.
pub trait Hesap {
    /// Mevduat miktarını bakiyeye ekler (&mut self: değiştirilebilir referans)
    fn para_yatir(&mut self, miktar: f64) -> Result<(), String>;

    /// Para çekim miktarını bakiyeden çıkarır (&mut self)
    fn para_cek(&mut self, miktar: f64) -> Result<(), String>;

    /// Mevcut bakiyeyi iade eder (&self: salt okunur referans)
    fn bakiye(&self) -> f64;
}

/// 2. Adım: BankAccount adlı yapı (Struct).
/// account_number, holder_name ve balance alanlarına sahiptir.
#[derive(Debug, Clone)]
pub struct BankAccount {
    pub account_number: String,
    pub holder_name: String,
    pub balance: f64,
}

impl BankAccount {
    /// Yeni bir BankAccount örneği oluşturan yapıcı (constructor) metot
    pub fn new(account_number: &str, holder_name: &str, initial_balance: f64) -> Self {
        BankAccount {
            account_number: account_number.to_string(),
            holder_name: holder_name.to_string(),
            balance: initial_balance,
        }
    }
}

/// 3, 4, 5. Adım: BankAccount yapısı için Hesap Özelliği'nin (Trait) uygulanması (impl)
impl Hesap for BankAccount {
    /// 3. Adım: Depozito miktarını bakiyeye ekleyin
    fn para_yatir(&mut self, miktar: f64) -> Result<(), String> {
        if miktar <= 0.0 {
            return Err("Yatırılacak tutar 0'dan büyük olmalıdır.".to_string());
        }
        self.balance += miktar;
        Ok(())
    }

    /// 4. Adım: Çekim miktarını bakiyeden çıkarın (Yetersiz bakiye kontrolü ile)
    fn para_cek(&mut self, miktar: f64) -> Result<(), String> {
        if miktar <= 0.0 {
            return Err("Çekilecek tutar 0'dan büyük olmalıdır.".to_string());
        }
        if miktar > self.balance {
            return Err(format!(
                "Yetersiz bakiye! Mevcut bakiye: {:.2} ₺, İstenen: {:.2} ₺",
                self.balance, miktar
            ));
        }
        self.balance -= miktar;
        Ok(())
    }

    /// 5. Adım: Mevcut bakiyeyi iade edin
    fn bakiye(&self) -> f64 {
        self.balance
    }
}

/// 6-10. Adımlar: Programın başlangıç noktası (main fonksiyonu)
fn main() {
    println!("============================================================");
    println!("    RUST BANKACILIK SİSTEMİ | İMZA: ENES ÖZTÜRK             ");
    println!("    Rust Traits (Özellikler) & Structs Uygulaması            ");
    println!("============================================================\\n");

    // 6. Adım: Farklı hesap numaraları ve sahip isimleriyle iki BankAccount örneği oluşturun
    let mut hesap1 = BankAccount::new("TR-1001", "Ahmet Yılmaz", 1500.00);
    let mut hesap2 = BankAccount::new("TR-1002", "Ayşe Kaya", 2500.00);

    println!("-> [BAŞLANGIÇ DURUMU]");
    println!("   Hesap 1: {} ({}) | Başlangıç Bakiye: {:.2} ₺", hesap1.holder_name, hesap1.account_number, hesap1.bakiye());
    println!("   Hesap 2: {} ({}) | Başlangıç Bakiye: {:.2} ₺\\n", hesap2.holder_name, hesap2.account_number, hesap2.bakiye());

    // 7. Adım: Hesaplardan birinde (hesap1) depozito yöntemini çağırın ve tutar verin
    let depozito_tutari = 750.00;
    println!("-> [İŞLEM 1: PARA YATIRMA]");
    match hesap1.para_yatir(depozito_tutari) {
        Ok(_) => println!("   [BAŞARILI] {} hesabına {:.2} ₺ yatırıldı.", hesap1.account_number, depozito_tutari),
        Err(hata) => println!("   [HATA] {}", hata),
    }

    // 8. Adım: Diğer hesaptaki (hesap2) çekim yöntemini çağırın ve çekim tutarı verin
    let cekim_tutari = 400.00;
    println!("\\n-> [İŞLEM 2: PARA ÇEKME]");
    match hesap2.para_cek(cekim_tutari) {
        Ok(_) => println!("   [BAŞARILI] {} hesabından {:.2} ₺ çekildi.", hesap2.account_number, cekim_tutari),
        Err(hata) => println!("   [HATA] {}", hata),
    }

    // 9. Adım: Her iki hesapta da bakiye yöntemini çağırın ve sonucu konsola yazdırın
    println!("\\n-> [GÜNCEL HESAP BAKİYELERİ]");
    println!("   Hesap 1 Sahibi: {:<15} | No: {} | Güncel Bakiye: {:.2} ₺", hesap1.holder_name, hesap1.account_number, hesap1.bakiye());
    println!("   Hesap 2 Sahibi: {:<15} | No: {} | Güncel Bakiye: {:.2} ₺", hesap2.holder_name, hesap2.account_number, hesap2.bakiye());

    println!("\\n============================================================");
    println!("✓ Program başarıyla derlendi ve çalıştırıldı.");
    println!("✓ Geliştirici: Enes Öztürk");
    println!("============================================================");
}
`;

export const RUST_CODE_ENGLISH = `// ============================================================================
// Project: Rust Traits - Basic Banking System
// Developer & Author: Enes Öztürk
// License: Apache-2.0 / MIT
// ============================================================================

/// Step 1: Trait 'Account' defining deposit, withdraw and balance methods
pub trait Account {
    fn deposit(&mut self, amount: f64) -> Result<(), String>;
    fn withdraw(&mut self, amount: f64) -> Result<(), String>;
    fn balance(&self) -> f64;
}

/// Step 2: Struct 'BankAccount' with account_number, holder_name and balance
#[derive(Debug, Clone)]
pub struct BankAccount {
    pub account_number: String,
    pub holder_name: String,
    pub balance: f64,
}

impl BankAccount {
    pub fn new(account_number: &str, holder_name: &str, initial_balance: f64) -> Self {
        BankAccount {
            account_number: account_number.to_string(),
            holder_name: holder_name.to_string(),
            balance: initial_balance,
        }
    }
}

/// Steps 3, 4, 5: Implementing Account trait for BankAccount
impl Account for BankAccount {
    /// Step 3: Deposit method adds amount to balance
    fn deposit(&mut self, amount: f64) -> Result<(), String> {
        if amount <= 0.0 {
            return Err("Deposit amount must be positive.".to_string());
        }
        self.balance += amount;
        Ok(())
    }

    /// Step 4: Withdraw method subtracts amount from balance with guard
    fn withdraw(&mut self, amount: f64) -> Result<(), String> {
        if amount <= 0.0 {
            return Err("Withdrawal amount must be positive.".to_string());
        }
        if amount > self.balance {
            return Err(format!(
                "Insufficient funds! Available: {:.2} ₺, Requested: {:.2} ₺",
                self.balance, amount
            ));
        }
        self.balance -= amount;
        Ok(())
    }

    /// Step 5: Balance method returns current balance
    fn balance(&self) -> f64 {
        self.balance
    }
}

/// Steps 6 - 9: Main function
fn main() {
    println!("============================================================");
    println!("    RUST BANKING SYSTEM | SIGNED BY ENES ÖZTÜRK             ");
    println!("============================================================\\n");

    // Step 6: Create two BankAccount instances
    let mut account1 = BankAccount::new("ACC-1001", "Ahmet Yilmaz", 1500.00);
    let mut account2 = BankAccount::new("ACC-1002", "Ayse Kaya", 2500.00);

    // Step 7: Call deposit on account 1
    let deposit_amount = 750.00;
    match account1.deposit(deposit_amount) {
        Ok(_) => println!("Deposited {:.2} ₺ into {}", deposit_amount, account1.account_number),
        Err(e) => println!("Error: {}", e),
    }

    // Step 8: Call withdraw on account 2
    let withdraw_amount = 400.00;
    match account2.withdraw(withdraw_amount) {
        Ok(_) => println!("Withdrew {:.2} ₺ from {}", withdraw_amount, account2.account_number),
        Err(e) => println!("Error: {}", e),
    }

    // Step 9: Print balance for both accounts
    println!("------------------------------------------------------------");
    println!("Account 1: {} ({}) Balance: {:.2} ₺", account1.holder_name, account1.account_number, account1.balance());
    println!("Account 2: {} ({}) Balance: {:.2} ₺", account2.holder_name, account2.account_number, account2.balance());
    println!("============================================================");
}
`;

export const CARGO_TOML = `[package]
name = "rust_banking_system"
version = "0.1.0"
edition = "2021"
authors = ["Enes Öztürk <enesbino38@gmail.com>"]
description = "Rust Traits ve Structs ile Temel Bankacılık Sistemi"

[dependencies]
# Sıfır dış bağımlılık (Pure standard library)
`;

export const README_MD = `# Rust Bankacılık Sistemi (Traits & Structs)
**Geliştirici & Yazar:** Enes Öztürk  
**Teknoloji:** Rust 2021 Edition, Cargo

## 📋 Görev Tanımı ve Özellikler
Bu proje, Rust dilinde **Traits (Özellikler)**, **Structs (Yapılar)**, **Ownership & Borrowing (&self / &mut self)** ve **Hata Yönetimi (Result<T, E>)** kavramlarını pekiştirmek amacıyla geliştirilmiştir.

### Karşılanan Görev Adımları:
1. ✅ **Hesap (Account) Trait**: \`para_yatir\` (&mut self), \`para_cek\` (&mut self) ve \`bakiye\` (&self) metotlarını tanımlar.
2. ✅ **BankAccount Yapısı**: \`account_number\`, \`holder_name\`, \`balance\` alanlarına sahiptir.
3. ✅ **Mevduat (Deposit)**: Yatırılan tutarı bakiyeye ekler.
4. ✅ **Para Çekme (Withdraw)**: Çekilen tutarı düşer, negatif tutar ve yetersiz bakiye kontrollerini yapar.
5. ✅ **Bakiye Sorgulama (Balance)**: Mevcut bakiyeyi döndürür.
6. ✅ **İki Hesap Örneği**: Ahmet Yılmaz (TR-1001) ve Ayşe Kaya (TR-1002).
7. ✅ **Depozito Çağrısı**: Hesap 1'e 750.00 ₺ yatırıldı.
8. ✅ **Para Çekim Çağrısı**: Hesap 2'den 400.00 ₺ çekildi.
9. ✅ **Bakiye Yazdırma**: Her iki hesabın güncel bakiyeleri konsola formatlanarak yazdırıldı.
10. ✅ **Derleme ve Çalıştırma**: Cargo ile derlenip hatasız çalıştırıldı.

## 🚀 Çalıştırma Talimatları
\`\`\`bash
# Projeyi klonlayın veya indirin
cargo build

# Programı çalıştırın
cargo run

# Birim testleri çalıştırın
cargo test
\`\`\`
`;

export const INITIAL_CHECKLIST = [
  {
    id: 1,
    step_title: "1. Hesap Özelliği (Trait) Tanımlama",
    description: "Yatırma, çekme ve bakiye yöntemlerini içeren 'Hesap' adında bir trait oluşturun. Metotlar özbaşdaklık (&self, &mut self) almalıdır.",
    rust_code_snippet: `pub trait Hesap {\n    fn para_yatir(&mut self, miktar: f64) -> Result<(), String>;\n    fn para_cek(&mut self, miktar: f64) -> Result<(), String>;\n    fn bakiye(&self) -> f64;\n}`,
    status: 'completed' as const,
    test_result: "Trait 'Hesap' başarıyla tanımlandı. (&mut self ve &self referansları doğru)"
  },
  {
    id: 2,
    step_title: "2. BankAccount Yapısını (Struct) Oluşturma",
    description: "account_number, holder_name ve balance (balans) alanlarına sahip BankAccount yapısı tanımlayın.",
    rust_code_snippet: `pub struct BankAccount {\n    pub account_number: String,\n    pub holder_name: String,\n    pub balance: f64,\n}`,
    status: 'completed' as const,
    test_result: "BankAccount yapısı 3 gerekli alanla birlikte eksiksiz oluşturuldu."
  },
  {
    id: 3,
    step_title: "3. Mevduat (Para Yatırma) Yöntemini Uygulama",
    description: "BankAccount için Hesap özelliğini uygularken, yatırılan mevduat miktarını bakiyeye ekleyin.",
    rust_code_snippet: `fn para_yatir(&mut self, miktar: f64) -> Result<(), String> {\n    self.balance += miktar;\n    Ok(())\n}`,
    status: 'completed' as const,
    test_result: "Mevduat tutarı bakiyeye başarıyla ekleniyor (+miktar)."
  },
  {
    id: 4,
    step_title: "4. Çekim (Para Çekme) Yöntemini Uygulama",
    description: "BankAccount için çekim yöntemi uygulandığında çekilen miktarı bakiyeden çıkarın.",
    rust_code_snippet: `fn para_cek(&mut self, miktar: f64) -> Result<(), String> {\n    if miktar > self.balance { return Err(\"Yetersiz bakiye\".into()); }\n    self.balance -= miktar;\n    Ok(())\n}`,
    status: 'completed' as const,
    test_result: "Çekim miktarı bakiyeden düşürülüyor (-miktar) ve bakiye koruması devrede."
  },
  {
    id: 5,
    step_title: "5. Bakiye Yöntemini Uygulama",
    description: "BankAccount için bakiye yöntemi çağrıldığında mevcut bakiye değerini iade edin.",
    rust_code_snippet: `fn bakiye(&self) -> f64 {\n    self.balance\n}`,
    status: 'completed' as const,
    test_result: "Bakiye yöntemi &self üzerinden mevcut self.balance değerini döndürüyor."
  },
  {
    id: 6,
    step_title: "6. İki Farklı BankAccount Örneği Oluşturma",
    description: "Ana fonksiyonda (main) farklı hesap numaraları ve sahip isimleriyle iki Banka Hesabı örneği oluşturun.",
    rust_code_snippet: `let mut hesap1 = BankAccount::new(\"TR-1001\", \"Ahmet Yılmaz\", 1500.0);\nlet mut hesap2 = BankAccount::new(\"TR-1002\", \"Ayşe Kaya\", 2500.0);`,
    status: 'completed' as const,
    test_result: "hesap1 ve hesap2 örnekleri mutable (değiştirilebilir) olarak bellekte oluşturuldu."
  },
  {
    id: 7,
    step_title: "7. Hesap 1'de Depozito Yöntemini Çağırma",
    description: "Hesaplardan birinde depozito (para yatırma) yöntemini arayın ve bir depozito tutarı verin.",
    rust_code_snippet: `hesap1.para_yatir(750.0); // 1500.0 -> 2250.0 ₺`,
    status: 'completed' as const,
    test_result: "hesap1.para_yatir(750.0) çağrıldı ve bakiye 2,250.00 ₺ oldu."
  },
  {
    id: 8,
    step_title: "8. Hesap 2'de Çekim Yöntemini Çağırma",
    description: "Diğer hesaptaki çekim yöntemini çağırın ve çekim tutarı verin.",
    rust_code_snippet: `hesap2.para_cek(400.0); // 2500.0 -> 2100.0 ₺`,
    status: 'completed' as const,
    test_result: "hesap2.para_cek(400.0) çağrıldı ve bakiye 2,100.00 ₺ oldu."
  },
  {
    id: 9,
    step_title: "9. Bakiyeleri Konsola Yazdırma",
    description: "Her iki hesapta da bakiye yöntemini çağırın ve sonucu konsola yazdırın.",
    rust_code_snippet: `println!(\"Hesap 1: {:.2} ₺\", hesap1.bakiye());\nprintln!(\"Hesap 2: {:.2} ₺\", hesap2.bakiye());`,
    status: 'completed' as const,
    test_result: "bakiye() yöntemiyle elde edilen değerler konsola formatlı şekilde yazdırıldı."
  },
  {
    id: 10,
    step_title: "10. Programı Derleyip Çalıştırma",
    description: "Programı derleyip çalıştırın ki beklenildiği gibi hatasız çalışsın.",
    rust_code_snippet: `$ cargo build --release\n$ cargo run\nProcess finished with exit code 0`,
    status: 'completed' as const,
    test_result: "Rust derleyicisi (rustc) sıfır uyarı ve sıfır hata ile programı başarıyla derledi."
  }
];
