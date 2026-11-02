import { ChecklistItem, PresetCode, CargoFile } from '../types';

export const BEGINNER_CODE = `// ============================================================================
// Proje: Rust Özel Filtreleme Fonksiyonu (Kapanışsız / Without Closures)
// Hazırlayan / Geliştirici: Enes Öztürk
// Amaç: Yeni başlayanlar için struct, impl ve referans (&) ile filtreleme
// ============================================================================

// Adım 1 & 2: Filtreleme için istenen türde tek bir alan içeren FilterCondition yapısı
struct FilterCondition {
    desired_value: i32,
}

// Adım 3: FilterCondition yapısında is_match yöntemi
// Bu yöntem, öğeye referans (&i32) alır ve eşleşme durumuna göre bool döndürür.
impl FilterCondition {
    fn is_match(&self, item: &i32) -> bool {
        *item == self.desired_value
    }
}

// Adım 4: custom_filter fonksiyonu
// Koleksiyona (&Vec<i32>) ve FilterCondition nesnesine (&FilterCondition) referans alır.
// Koleksiyon üzerinde döngü kurar ve eşleşen elemanları yeni bir vektörde döndürür.
fn custom_filter(collection: &Vec<i32>, condition: &FilterCondition) -> Vec<i32> {
    let mut filtered_result = Vec::new();

    // Koleksiyondaki her bir öğe üzerinde yineleme yapıyoruz
    for item in collection {
        // is_match yöntemine öğenin referansını veriyoruz
        if condition.is_match(item) {
            filtered_result.push(*item);
        }
    }

    filtered_result
}

// Adım 5, 6, 7 & 8: Ana Fonksiyon (main)
fn main() {
    println!("------------------------------------------------------------");
    println!("Rust Özel Filtreleme Uygulaması - Enes Öztürk");
    println!("------------------------------------------------------------");

    // 1. Bazı sayılardan oluşan bir koleksiyon (Vektör) oluşturuyoruz
    let numbers: Vec<i32> = vec![10, 25, 42, 25, 88, 25, 100, 3];

    // 2. Filtrelemek istediğimiz hedef değerle FilterCondition nesnesini başlatıyoruz
    let condition = FilterCondition {
        desired_value: 25,
    };

    println!("Orijinal Liste : {:?}", numbers);
    println!("Aranan Koşul   : desired_value = {}", condition.desired_value);

    // 3. custom_filter fonksiyonunu çağırıp sonucu yeni değişkende saklıyoruz
    let filtered_numbers = custom_filter(&numbers, &condition);

    // 4. Filtrelenmiş sonucu konsola yazdırıyoruz
    println!("Filtrelenmiş Sonuç: {:?}", filtered_numbers);
    println!("Eşleşen Eleman Sayısı: {}", filtered_numbers.len());
    println!("------------------------------------------------------------");
    println!("Durum: Görev Başarıyla Tamamlandı! (İmza: Enes Öztürk)");
}
`;

export const GENERIC_CODE = `// ============================================================================
// İleri Seviye: Generic (<T: PartialEq + Clone>) Filtreleme
// Hazırlayan: Enes Öztürk
// Herhangi bir veri tipi (i32, String, f64 vb.) ile çalışır
// ============================================================================

struct FilterCondition<T> {
    desired_value: T,
}

impl<T: PartialEq> FilterCondition<T> {
    fn is_match(&self, item: &T) -> bool {
        item == &self.desired_value
    }
}

fn custom_filter<T: PartialEq + Clone>(
    collection: &Vec<T>,
    condition: &FilterCondition<T>,
) -> Vec<T> {
    let mut result = Vec::new();
    for item in collection {
        if condition.is_match(item) {
            result.push(item.clone());
        }
    }
    result
}

fn main() {
    println!("=== Generic Rust Filtreleme | Enes Öztürk ===");

    // String koleksiyonu ile test:
    let cities = vec![
        String::from("İstanbul"),
        String::from("Ankara"),
        String::from("İzmir"),
        String::from("Ankara"),
        String::from("Bursa"),
    ];
    let condition = FilterCondition {
        desired_value: String::from("Ankara"),
    };

    let filtered = custom_filter(&cities, &condition);
    println!("Şehirler : {:?}", cities);
    println!("Koşul    : {}", condition.desired_value);
    println!("Sonuç    : {:?}", filtered);
}
`;

export const STRING_CODE = `// ============================================================================
// Metin (String) Koleksiyonu Filtreleme
// Hazırlayan: Enes Öztürk
// ============================================================================

struct FilterCondition {
    desired_value: String,
}

impl FilterCondition {
    fn is_match(&self, item: &String) -> bool {
        item == &self.desired_value
    }
}

fn custom_filter(collection: &Vec<String>, condition: &FilterCondition) -> Vec<String> {
    let mut result = Vec::new();
    for item in collection {
        if condition.is_match(item) {
            result.push(item.clone());
        }
    }
    result
}

fn main() {
    println!("=== String Filtreleme Modülü | Enes Öztürk ===");

    let languages = vec![
        String::from("Rust"),
        String::from("Python"),
        String::from("Rust"),
        String::from("Go"),
        String::from("TypeScript"),
        String::from("Rust"),
    ];

    let condition = FilterCondition {
        desired_value: String::from("Rust"),
    };

    let matches = custom_filter(&languages, &condition);
    println!("Tüm Diller: {:?}", languages);
    println!("Hedef Dil : {}", condition.desired_value);
    println!("Sonuçlar  : {:?}", matches);
}
`;

export const CARGO_TOML_CONTENT = `[package]
name = "my_project"
version = "0.1.0"
edition = "2021"
authors = ["Enes Öztürk <enes@example.com>"]
description = "Kapanışsız Rust özel filtreleme fonksiyonu ödevi"

# Bu proje dış kütüphane bağımlılığı gerektirmez (Standart Rust kütüphanesi yeterlidir)
[dependencies]
`;

export const README_CONTENT = `# Rust Özel Filtreleme Fonksiyonu

**Geliştirici / İmza:** Enes Öztürk  
**Teknoloji:** Rust (2021 Edition) / Cargo  
**Yaklaşım:** Kapanış (Closure) kullanmadan Struct ve Referans tabanlı nesne yöntemi

---

## 🎯 Projenin Amacı
Rust öğrenmeye yeni başlayan öğrencilerin, karmaşık kapanış (closure - \`|x| x == target\`) sözdizimi ve \`Fn / FnMut / FnOnce\` trait sınırlarına takılmadan:
1. **Struct (Yapı)** tanımlamayı,
2. **Impl (Uygulama)** bloklarında metot yazmayı,
3. **Borrowing (&)** yani ödünç alma / referans mekanizmasını,
4. **Vektör döngülerini (for in &Vec)**

somut bir örnek üzerinde kavramasını sağlamaktır.

## 🚀 Terminalden Çalıştırma Adımları
\`\`\`bash
# 1. Projeyi oluşturun
cargo new my_project
cd my_project

# 2. main.rs dosyasını düzenleyin ve çalıştırın
cargo run

# 3. Testleri çalıştırmak isterseniz
cargo test
\`\`\`
`;

export const PRESET_OPTIONS: PresetCode[] = [
  {
    id: 'beginner_i32',
    title: 'Ödev Çözümü: Tam Sayılar (i32)',
    tag: 'Önerilen & Standart',
    description: 'Ödev gereksinimlerine birebir uyan, yeni başlayanlar için en yalın ve anlaşılır i32 çözümü.',
    code: BEGINNER_CODE,
    initialItems: [10, 25, 42, 25, 88, 25, 100, 3],
    initialCondition: 25,
  },
  {
    id: 'string_filter',
    title: 'Metin Filtreleme (String)',
    tag: 'String & Clone',
    description: 'Metin koleksiyonları üzerinde referans (&String) ve klonlama dinamiklerini gösterir.',
    code: STRING_CODE,
    initialItems: ['Rust', 'Python', 'Rust', 'Go', 'TypeScript', 'Rust'],
    initialCondition: 'Rust',
  },
  {
    id: 'generic_filter',
    title: 'İleri Seviye Generic (<T>) Çözüm',
    tag: 'Generic Trait Bounds',
    description: 'Tüm veri tipleriyle (i32, String, bool, float vb.) çalışabilen profesyonel Generic Rust yaklaşımı.',
    code: GENERIC_CODE,
    initialItems: ['İstanbul', 'Ankara', 'İzmir', 'Ankara', 'Bursa'],
    initialCondition: 'Ankara',
  },
];

export const INITIAL_CHECKLIST: ChecklistItem[] = [
  {
    id: 1,
    stepNumber: 1,
    title: 'Yeni bir Rust projesi oluşturun ve main.rs dosyasını açın',
    description: 'Terminalde "cargo new my_project" komutunu çalıştırıp my_project dizinindeki src/main.rs dosyasını editörde açma adımı.',
    codeSnippet: 'cargo new my_project\ncd my_project',
    lineHighlight: [1, 5],
    completed: true,
    explanation: 'Cargo projesi standart Rust paket yöneticisi ile yapılandırıldı. Cargo.toml ve src/main.rs hazır.',
  },
  {
    id: 2,
    stepNumber: 2,
    title: 'Filtreleme için istenen tiple FilterCondition yapısını tanımlayın',
    description: 'FilterCondition adında, filtrelenecek değer türünde (örneğin i32) tek bir alan içeren struct tanımlaması.',
    codeSnippet: 'struct FilterCondition {\n    desired_value: i32,\n}',
    lineHighlight: [7, 10],
    completed: true,
    explanation: 'FilterCondition struct\'ı oluşturuldu. desired_value alanı filtrelenmek istenen eşik değerini tutar.',
  },
  {
    id: 3,
    stepNumber: 3,
    title: 'FilterCondition yapısında is_match yöntemini uygulayın',
    description: 'FilterCondition için impl bloğu yazıp, &i32 referansı alan ve öğe koşula eşitse true döndüren is_match metodunu tanımlama.',
    codeSnippet: 'impl FilterCondition {\n    fn is_match(&self, item: &i32) -> bool {\n        *item == self.desired_value\n    }\n}',
    lineHighlight: [12, 18],
    completed: true,
    explanation: 'is_match metodu &self ile koşul nesnesine, item: &i32 ile koleksiyondaki elemana bakar ve dereferans (*item) ile karşılaştırır.',
  },
  {
    id: 4,
    stepNumber: 4,
    title: 'Koşullara göre elemanları filtreleyen custom_filter fonksiyonunu tanımlayın',
    description: '&Vec koleksiyonu ve &FilterCondition referansları alarak öğeleri gezen ve uyanları yeni bir vektöre ekleyen fonksiyon.',
    codeSnippet: 'fn custom_filter(collection: &Vec<i32>, condition: &FilterCondition) -> Vec<i32> {\n    let mut filtered_result = Vec::new();\n    for item in collection {\n        if condition.is_match(item) {\n            filtered_result.push(*item);\n        }\n    }\n    filtered_result\n}',
    lineHighlight: [20, 34],
    completed: true,
    explanation: 'custom_filter fonksiyonu closure yerine FilterCondition nesnesinin is_match metodunu çağırır.',
  },
  {
    id: 5,
    stepNumber: 5,
    title: 'Ana fonksiyonda bir koleksiyon ve bir FilterCondition nesnesi oluşturun',
    description: 'main() fonksiyonu içerisinde test için elemanlar içeren bir vektör ve aranacak değerle FilterCondition örneği yaratma.',
    codeSnippet: 'let numbers: Vec<i32> = vec![10, 25, 42, 25, 88, 25, 100, 3];\nlet condition = FilterCondition {\n    desired_value: 25,\n};',
    lineHighlight: [42, 48],
    completed: true,
    explanation: 'vec![10, 25, 42, 25, 88, 25, 100, 3] ve desired_value: 25 olarak başlatıldı.',
  },
  {
    id: 6,
    stepNumber: 6,
    title: 'custom_filter fonksiyonunu çağırın ve sonucu kaydedin',
    description: 'custom_filter(&numbers, &condition) çağrısı yaparak dönen filtrelenmiş vektörü yeni bir değişkene atama.',
    codeSnippet: 'let filtered_numbers = custom_filter(&numbers, &condition);',
    lineHighlight: [53, 54],
    completed: true,
    explanation: 'Referanslar (&numbers ve &condition) verilerek çağrıldı, sahiplik devredilmeden güvenli ödünç alma yapıldı.',
  },
  {
    id: 7,
    stepNumber: 7,
    title: 'Filtrelenmiş sonucu konsola yazdırın',
    description: 'println! makrosu ve {:?} debug formatlayıcısı ile filtrelenmiş vektörü ekrana basma.',
    codeSnippet: 'println!("Filtrelenmiş Sonuç: {:?}", filtered_numbers);',
    lineHighlight: [56, 61],
    completed: true,
    explanation: 'Debug formatı {:?} kullanılarak orijinal liste, filtre koşulu ve filtrelenmiş sonuç konsola yazdırıldı.',
  },
  {
    id: 8,
    stepNumber: 8,
    title: 'Programı derleyip çalıştırarak işlevselliğini test edin',
    description: 'Terminalde "cargo run" çalıştırılarak kodun derlenip hatasız çalıştığının doğrulanması.',
    codeSnippet: 'cargo run',
    lineHighlight: [36, 62],
    completed: true,
    explanation: 'Proje derlendi ve başarıyla çalıştırıldı. Sonuçlar beklenen değerle tam uyuştu.',
  },
];
