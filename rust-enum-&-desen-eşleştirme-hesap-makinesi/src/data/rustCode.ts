export const RUST_CODE_TR = `// ==========================================
// Rust Enum & Desen Eşleştirme Hesap Makinesi
// Hazırlayan / Geliştirici: Enes Öztürk
// ==========================================

use std::io;

/// 1. Ekleme, Çıkarma, Çarpma ve Bölme varyantlarıyla Operasyon enum'ı.
/// Her varyant f64 tipinde iki değer taşır.
#[derive(Debug, Clone, Copy)]
enum Operasyon {
    Ekleme(f64, f64),
    Cikarma(f64, f64),
    Carpma(f64, f64),
    Bolme(f64, f64),
}

/// 2 & 3. Operasyon enum'ı argüman alıp f64 döndüren ve
/// desen eşleştirme (pattern matching) ile işlemi yapan fonksiyon.
fn hesaplama(op: Operasyon) -> f64 {
    match op {
        Operasyon::Ekleme(a, b) => a + b,
        Operasyon::Cikarma(a, b) => a - b,
        Operasyon::Carpma(a, b) => a * b,
        Operasyon::Bolme(a, b) => {
            if b == 0.0 {
                eprintln!("Uyarı: Sıfıra bölme işlemi yapıldı!");
            }
            a / b
        }
    }
}

fn main() {
    println!("=== Rust Hesap Makinesi ===");
    println!("Hazırlayan: Enes Öztürk\\n");

    // 4 & 5. Kullanıcıdan ilk sayıyı isteme ve f64 olarak ayrıştırma (parse)
    println!("İlk sayıyı giriniz:");
    let mut num1_str = String::new();
    io::stdin()
        .read_line(&mut num1_str)
        .expect("Girdi okunamadı!");
    let num1: f64 = match num1_str.trim().parse() {
        Ok(val) => val,
        Err(_) => {
            eprintln!("Hata: Geçerli bir sayı girilmedi!");
            return;
        }
    };

    // Kullanıcıdan yapılacak işlemi (+, -, *, /) isteme
    println!("Yapılacak işlemi giriniz (+, -, *, /):");
    let mut islem_str = String::new();
    io::stdin()
        .read_line(&mut islem_str)
        .expect("Girdi okunamadı!");
    let islem = islem_str.trim();

    // Kullanıcıdan ikinci sayıyı isteme ve ayrıştırma
    println!("İkinci sayıyı giriniz:");
    let mut num2_str = String::new();
    io::stdin()
        .read_line(&mut num2_str)
        .expect("Girdi okunamadı!");
    let num2: f64 = match num2_str.trim().parse() {
        Ok(val) => val,
        Err(_) => {
            eprintln!("Hata: Geçerli bir sayı girilmedi!");
            return;
        }
    };

    // 6. Çözümlenmiş giriş değerleriyle Operasyon enum örneği oluşturma
    let operasyon = match islem {
        "+" => Operasyon::Ekleme(num1, num2),
        "-" => Operasyon::Cikarma(num1, num2),
        "*" => Operasyon::Carpma(num1, num2),
        "/" => Operasyon::Bolme(num1, num2),
        _ => {
            eprintln!("Hata: Geçersiz işlem '{}'. Lütfen +, -, * veya / giriniz.", islem);
            return;
        }
    };

    // 7. Oluşturulan Operasyon enum örneğiyle hesaplama fonksiyonunu çağırma
    let sonuc = hesaplama(operasyon);

    // 8. Sonucu konsola yazdırma
    println!("--------------------------------");
    println!("Seçilen Operasyon : {:?}", operasyon);
    println!("Hesaplanan Sonuç  : {}", sonuc);
    println!("--------------------------------");
}
`;

export const RUST_CODE_EN = `// ==========================================
// Rust Enum & Pattern Matching Calculator
// Author / Developer: Enes Öztürk
// ==========================================

use std::io;

/// 1. Operation enum with Add, Subtract, Multiply, and Divide variants.
/// Each variant carries two f64 values.
#[derive(Debug, Clone, Copy)]
enum Operation {
    Add(f64, f64),
    Subtract(f64, f64),
    Multiply(f64, f64),
    Divide(f64, f64),
}

/// 2 & 3. Calculate function taking an Operation enum and returning f64
/// using exhaustive pattern matching.
fn calculate(op: Operation) -> f64 {
    match op {
        Operation::Add(a, b) => a + b,
        Operation::Subtract(a, b) => a - b,
        Operation::Multiply(a, b) => a * b,
        Operation::Divide(a, b) => {
            if b == 0.0 {
                eprintln!("Warning: Division by zero attempted!");
            }
            a / b
        }
    }
}

fn main() {
    println!("=== Rust Calculator ===");
    println!("Developed by: Enes Öztürk\\n");

    // 4 & 5. Prompting first number and parsing to f64
    println!("Enter first number:");
    let mut num1_str = String::new();
    io::stdin()
        .read_line(&mut num1_str)
        .expect("Failed to read line");
    let num1: f64 = match num1_str.trim().parse() {
        Ok(val) => val,
        Err(_) => {
            eprintln!("Error: Invalid number format!");
            return;
        }
    };

    // Prompting operation symbol (+, -, *, /)
    println!("Enter operation (+, -, *, /):");
    let mut op_str = String::new();
    io::stdin()
        .read_line(&mut op_str)
        .expect("Failed to read line");
    let op_symbol = op_str.trim();

    // Prompting second number and parsing to f64
    println!("Enter second number:");
    let mut num2_str = String::new();
    io::stdin()
        .read_line(&mut num2_str)
        .expect("Failed to read line");
    let num2: f64 = match num2_str.trim().parse() {
        Ok(val) => val,
        Err(_) => {
            eprintln!("Error: Invalid number format!");
            return;
        }
    };

    // 6. Instantiating Operation enum with parsed input
    let operation = match op_symbol {
        "+" => Operation::Add(num1, num2),
        "-" => Operation::Subtract(num1, num2),
        "*" => Operation::Multiply(num1, num2),
        "/" => Operation::Divide(num1, num2),
        _ => {
            eprintln!("Error: Invalid operation '{}'. Supported: +, -, *, /", op_symbol);
            return;
        }
    };

    // 7. Calling calculate function with the created enum
    let result = calculate(operation);

    // 8. Printing result to console
    println!("--------------------------------");
    println!("Operation : {:?}", operation);
    println!("Result    : {}", result);
    println!("--------------------------------");
}
`;

export const CHECKLIST_ITEMS = [
  {
    id: 1,
    title: 'Operasyon Enum Tanımlaması',
    instruction: 'Ekleme, Çıkarma, Çarpma ve Bölme varyantlarıyla Operasyon adlı bir enum oluşturun. Her varyant iki f64 değeri içermelidir.',
    rustSnippet: 'enum Operasyon {\n    Ekleme(f64, f64),\n    Cikarma(f64, f64),\n    Carpma(f64, f64),\n    Bolme(f64, f64),\n}',
    explanation: 'Rust enumları sadece C tarzı sabitler değil, veri taşıyabilen cebirsel veri tipleridir (algebraic data types). Her varyant tuple formatında iki f64 saklar.',
  },
  {
    id: 2,
    title: 'Hesaplama Fonksiyon İmzası',
    instruction: 'Hesaplama adlı bir fonksiyon oluşturun; bu fonksiyon bir Operasyon enum\'u argüman olarak alır ve f64 sonucunu döndürür.',
    rustSnippet: 'fn hesaplama(op: Operasyon) -> f64',
    explanation: 'Fonksiyonumuz sahiplik (ownership) veya kopyalama ile bir Operasyon enum alır ve hesaplanan sonucu 64-bit ondalıklı sayı (f64) olarak döner.',
  },
  {
    id: 3,
    title: 'Desen Eşleştirme (Pattern Matching) ile Hesaplama',
    instruction: 'Hesaplama fonksiyonunu, Operasyon enum\'un varyantına dayalı uygun aritmetik işlemi gerçekleştirmek için desen eşleştirme kullanarak uygulayın.',
    rustSnippet: 'match op {\n    Operasyon::Ekleme(a, b) => a + b,\n    Operasyon::Cikarma(a, b) => a - b,\n    Operasyon::Carpma(a, b) => a * b,\n    Operasyon::Bolme(a, b) => a / b,\n}',
    explanation: 'Rust derleyicisi match yapısının kapsamlı (exhaustive) olmasını zorunlu kılar. Hiçbir varyant gözden kaçırılamaz ve (a, b) değişkenleri desenden otomatik ayıklanır (destructuring).',
  },
  {
    id: 4,
    title: 'Kullanıcı Girdilerini İsteme',
    instruction: 'Ana işlevde (main), kullanıcıdan ilk sayıyı, yapılacak işlemi ve ikinci numarayı girmesini isteyin.',
    rustSnippet: 'println!("İlk sayıyı giriniz:");\nio::stdin().read_line(&mut num1_str)...',
    explanation: 'std::io modülü kullanılarak standart girdiden (stdin) satır satır okuma yapılır ve kullanıcı yönlendirilir.',
  },
  {
    id: 5,
    title: 'Girdileri f64 Türüne Ayrıştırma (Parse)',
    instruction: 'Kullanıcı girdisini uygun değişkenlere ayrıştırın.',
    rustSnippet: 'let num1: f64 = num1_str.trim().parse().expect("Geçersiz sayı!");',
    explanation: 'Kullanıcıdan gelen String girdisindeki yeni satır karakteri .trim() ile temizlenir ve .parse::<f64>() ile güvenli biçimde f64\'e dönüştürülür.',
  },
  {
    id: 6,
    title: 'Operasyon Enum Örneği Oluşturma',
    instruction: 'Çözümlenmiş giriş değerleriyle bir Operasyon enum örneği oluşturun.',
    rustSnippet: 'let operasyon = match islem {\n    "+" => Operasyon::Ekleme(num1, num2),\n    "-" => Operasyon::Cikarma(num1, num2),\n    "*" => Operasyon::Carpma(num1, num2),\n    "/" => Operasyon::Bolme(num1, num2),\n    _ => panic!("Geçersiz işlem"),\n};',
    explanation: 'Kullanıcının girdiği işlem sembolü kontrol edilerek (string pattern matching) uygun enum varyantı veriyle birlikte somutlaştırılır (instantiation).',
  },
  {
    id: 7,
    title: 'Hesaplama Fonksiyonunu Çağırma',
    instruction: 'Oluşturulan Operasyon enum örneğiyle hesaplama fonksiyonunu çağırın.',
    rustSnippet: 'let sonuc = hesaplama(operasyon);',
    explanation: 'Oluşturulan enum değişkeni argüman olarak iletilir ve derleyici tip güvenliğini %100 garanti altına alır.',
  },
  {
    id: 8,
    title: 'Sonucu Konsola Yazdırma ve Test Etme',
    instruction: 'Sonucu konsola yazdırın. Programı derleyip çalıştırın ki beklenildiği gibi çalışsın.',
    rustSnippet: 'println!("Sonuç: {}", sonuc);',
    explanation: 'println! makrosu ile biçimlendirilmiş sonuç konsola aktarılır ve program tüm işlem türlerinde hatasız tamamlanır.',
  },
];
