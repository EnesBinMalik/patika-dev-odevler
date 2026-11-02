import { TaskStep } from '../types/banking';

export const RUST_SOURCE_CODE = `// =======================================================================
// PROJE: Rust Temel Bankacılık Sistemi & Hata Yönetimi (Error Handling)
// YAZAR & GELİŞTİRİCİ: Enes Öztürk
// AÇIKLAMA: Result<(), String>, Ok(()), Err(...) ve match deseniyle hata yönetimi
// =======================================================================

/// [Adım 1 & 2] Hesap Özelliği (Account Trait)
/// Para yatırma ve çekme yöntemleri artık () yerine Result<(), String> döndürür.
/// - Başarı: Ok(())
/// - Hata: Err(String)
pub trait Account {
    fn deposit(&mut self, amount: f64) -> Result<(), String>;
    fn withdraw(&mut self, amount: f64) -> Result<(), String>;
    fn balance(&self) -> f64;
}

/// Banka Hesabı Yapısı (BankAccount Struct)
#[derive(Debug, Clone)]
pub struct BankAccount {
    pub account_number: String,
    pub holder_name: String,
    balance: f64,
}

impl BankAccount {
    /// Yeni bir banka hesabı oluşturan yapıcı (constructor) metod
    pub fn new(account_number: &str, holder_name: &str, initial_balance: f64) -> Self {
        Self {
            account_number: account_number.to_string(),
            holder_name: holder_name.to_string(),
            balance: initial_balance,
        }
    }
}

/// [Adım 3 & 4] BankAccount için Account Özelliğinin Uygulanması (impl Account for BankAccount)
impl Account for BankAccount {
    /// [Adım 3] Para yatırma yöntemi (deposit)
    /// Başarıda Ok(()), geçersiz tutarda Err("Hata mesajı".to_string()) döner.
    fn deposit(&mut self, amount: f64) -> Result<(), String> {
        if amount <= 0.0 {
            Err("Yatırılacak tutar sıfırdan büyük (pozitif) olmalıdır!".to_string())
        } else {
            self.balance += amount;
            Ok(())
        }
    }

    /// [Adım 4] Para çekme yöntemi (withdraw)
    /// Başarıda Ok(()), yetersiz bakiye veya geçersiz tutarda Err("Hata mesajı".to_string()) döner.
    fn withdraw(&mut self, amount: f64) -> Result<(), String> {
        if amount <= 0.0 {
            Err("Çekilecek tutar sıfırdan büyük (pozitif) olmalıdır!".to_string())
        } else if amount > self.balance {
            Err(format!(
                "Yetersiz bakiye! Mevcut bakiye: {:.2} TL, Talep edilen: {:.2} TL",
                self.balance, amount
            ))
        } else {
            self.balance -= amount;
            Ok(())
        }
    }

    /// Hesap bakiyesini döner
    fn balance(&self) -> f64 {
        self.balance
    }
}

/// [Adım 5, 6, 7 & 8] Ana Fonksiyon (fn main)
fn main() {
    println!("============================================================");
    println!(" Rust Bankacılık Sistemi & Hata Yönetimi Demo");
    println!(" Geliştirici: Enes Öztürk");
    println!("============================================================\\n");

    // [Adım 5] Farklı hesap numaraları ve sahip isimleriyle iki BankAccount örneği oluşturun
    let mut account1 = BankAccount::new("TR34-0010-8801", "Enes Öztürk", 1500.00);
    let mut account2 = BankAccount::new("TR34-0020-9902", "Ahmet Yılmaz", 750.00);

    println!("--- Başlangıç Hesap Durumları ---");
    println!("Hesap 1: {} ({}) | Bakiye: {:.2} TL", account1.account_number, account1.holder_name, account1.balance());
    println!("Hesap 2: {} ({}) | Bakiye: {:.2} TL\\n", account2.account_number, account2.holder_name, account2.balance());

    // [Adım 6] Hesap 1'de depozito yöntemini çağırın ve dönen hatayı match ile yönetin
    let deposit_amount = 500.00;
    println!(" [İşlem 1] {} hesabına {:.2} TL yatırılıyor...", account1.holder_name, deposit_amount);
    match account1.deposit(deposit_amount) {
        Ok(()) => {
            println!(
                "✅ [BAŞARILI] {:.2} TL başarıyla yatırıldı! Güncel Bakiye: {:.2} TL",
                deposit_amount,
                account1.balance()
            );
        }
        Err(hata_mesaji) => {
            println!("❌ [HATA] Para yatırma başarısız: {}", hata_mesaji);
        }
    }

    println!();

    // [Adım 7] Diğer hesapta (Hesap 2) çekim yöntemini çağırın ve dönen hatayı match ile yönetin
    let withdraw_amount = 300.00;
    println!(" [İşlem 2] {} hesabından {:.2} TL çekiliyor...", account2.holder_name, withdraw_amount);
    match account2.withdraw(withdraw_amount) {
        Ok(()) => {
            println!(
                "✅ [BAŞARILI] {:.2} TL başarıyla çekildi! Güncel Bakiye: {:.2} TL",
                withdraw_amount,
                account2.balance()
            );
        }
        Err(hata_mesaji) => {
            println!("❌ [HATA] Para çekme başarısız: {}", hata_mesaji);
        }
    }

    println!();

    // [Adım 8] Her iki hesapta da balance yöntemini çağırın ve sonucu konsola yazdırın
    println!("============================================================");
    println!("                  NİHAİ HESAP BAKİYE RAPORU                 ");
    println!("============================================================");
    println!(
        "Hesap No: {:<16} | Sahip: {:<15} | Bakiye: {:.2} TL",
        account1.account_number,
        account1.holder_name,
        account1.balance()
    );
    println!(
        "Hesap No: {:<16} | Sahip: {:<15} | Bakiye: {:.2} TL",
        account2.account_number,
        account2.holder_name,
        account2.balance()
    );
    println!("============================================================");
    println!("İmza: Enes Öztürk | Program başarıyla tamamlandı.");
}
`;

export const TASK_STEPS: TaskStep[] = [
  {
    id: 1,
    title: "Account Trait'inde deposit dönüş türünü Result<(), String> yapma",
    description: "Hesap Özelliği'nin (Account trait) yatırma yöntemini () yerine Result<(), String> döndürecek şekilde güncellendi.",
    rustCodeSnippet: "fn deposit(&mut self, amount: f64) -> Result<(), String>;",
    lines: [12, 12],
    isCompleted: true,
  },
  {
    id: 2,
    title: "Account Trait'inde withdraw dönüş türünü Result<(), String> yapma",
    description: "Hesap Özelliği'nin (Account trait) çekim yöntemini () yerine Result<(), String> döndürecek şekilde güncellendi.",
    rustCodeSnippet: "fn withdraw(&mut self, amount: f64) -> Result<(), String>;",
    lines: [13, 13],
    isCompleted: true,
  },
  {
    id: 3,
    title: "BankAccount deposit uygulamasında Ok(()) ve Err(...) kullanımı",
    description: "Başarılı para yatırmada Ok(()) varyantı, geçersiz/negatif tutarlarda Err(\"Hata mesajı\".to_string()) varyantı dönüldü.",
    rustCodeSnippet: `if amount <= 0.0 {
    Err("Yatırılacak tutar sıfırdan büyük olmalıdır!".to_string())
} else {
    self.balance += amount;
    Ok(())
}`,
    lines: [38, 47],
    isCompleted: true,
  },
  {
    id: 4,
    title: "BankAccount withdraw uygulamasında Ok(()) ve Err(...) kullanımı",
    description: "Başarılı çekimde Ok(()), yetersiz bakiye ve sıfır/negatif tutarlarda Err(\"Hata mesajı\".to_string()) dönüldü.",
    rustCodeSnippet: `if amount > self.balance {
    Err(format!("Yetersiz bakiye! Mevcut bakiye: {:.2} TL", self.balance))
} else {
    self.balance -= amount;
    Ok(())
}`,
    lines: [49, 63],
    isCompleted: true,
  },
  {
    id: 5,
    title: "Ana fonksiyonda (main) 2 farklı BankAccount örneği oluşturma",
    description: "Farklı hesap numaraları ve sahip isimleriyle (örn: Enes Öztürk & Ahmet Yılmaz) iki banka hesabı örneklendi.",
    rustCodeSnippet: `let mut account1 = BankAccount::new("TR34-0010-8801", "Enes Öztürk", 1500.00);
let mut account2 = BankAccount::new("TR34-0020-9902", "Ahmet Yılmaz", 750.00);`,
    lines: [74, 76],
    isCompleted: true,
  },
  {
    id: 6,
    title: "Hesap 1'de deposit çağırma ve match ile hata yönetimi",
    description: "Para yatırma metodu çağrıldı; Ok(()) ve Err(e) kolları match deseni ile yakalanıp konsola uygun mesaj yazdırıldı.",
    rustCodeSnippet: `match account1.deposit(500.00) {
    Ok(()) => println!("✅ [BAŞARILI] Para yatırıldı. Bakiye: {:.2} TL", account1.balance()),
    Err(e) => println!("❌ [HATA] {}", e),
}`,
    lines: [84, 94],
    isCompleted: true,
  },
  {
    id: 7,
    title: "Hesap 2'de withdraw çağırma ve match ile hata yönetimi",
    description: "Diğer hesapta para çekme metodu çağrıldı; Ok(()) ve Err(e) kolları match deseni ile güvenli şekilde ele alındı.",
    rustCodeSnippet: `match account2.withdraw(300.00) {
    Ok(()) => println!("✅ [BAŞARILI] Para çekildi. Bakiye: {:.2} TL", account2.balance()),
    Err(e) => println!("❌ [HATA] {}", e),
}`,
    lines: [100, 110],
    isCompleted: true,
  },
  {
    id: 8,
    title: "Her iki hesapta da balance() çağırıp konsola yazdırma",
    description: "account1.balance() ve account2.balance() çağrılarak nihai hesap bakiye tablosu konsola yazdırıldı.",
    rustCodeSnippet: `println!("Hesap 1 Nihai Bakiye: {:.2} TL", account1.balance());
println!("Hesap 2 Nihai Bakiye: {:.2} TL", account2.balance());`,
    lines: [116, 131],
    isCompleted: true,
  },
];
