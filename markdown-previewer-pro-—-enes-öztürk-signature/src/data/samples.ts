export interface MarkdownSample {
  id: string;
  title: string;
  description: string;
  badge: string;
  content: string;
}

export const SAMPLES: MarkdownSample[] = [
  {
    id: 'comprehensive',
    title: 'Kapsamlı Markdown Tanıtımı',
    badge: 'Tavsiye Edilen',
    description: 'Başlıklar, kod blokları, tablolar, alıntılar, checklist ve biçimlendirmeler.',
    content: `# Markdown Ön İzleyici — Enes Öztürk Signature 🚀

Markdown metinlerinizi sol tarafa yazın, sağ tarafta **anında ve canlı** olarak ön izleyin! Bu profesyonel araç, modern web standartlarına uygun GitHub tarzı markdown desteği sunar.

---

## 📌 Hızlı Başlangıç & Metin Biçimlendirme

Metinlerinizi zenginleştirmek için standart markdown sözdizimini kullanabilirsiniz:

- **Kalın Yazı** için metni \`**kalın**\` yapın.
- *İtalik Yazı* için \`*italik*\` yapın.
- ~~Üstü Çizili~~ için \`~~üstü çizili~~\` kullanın.
- ***Hem Kalın Hem İtalik*** için \`***üç yıldız***\` kullanabilirsiniz.
- Klavye tuşları: <kbd>Ctrl</kbd> + <kbd>S</kbd> veya <kbd>Cmd</kbd> + <kbd>P</kbd>.

> **Önemli Not:**
> Bu uygulama *Enes Öztürk* imzası ile geliştirilmiş profesyonel bir açık kaynak aracıdır.
> Senkronize kaydırma, kod sözdizimi renklendirme ve anında dışa aktarma özelliklerini içerir.

---

## 💻 Sözdizimi Vurgulama (Code Highlighting)

Uygulama, **JavaScript**, **TypeScript**, **Python**, **CSS**, **HTML**, **SQL** ve onlarca dili otomatik olarak tanır ve renklendirir.

\`\`\`typescript
// Enes Öztürk — Markdown Parser Engine
interface DocumentStats {
  words: number;
  characters: number;
  readingTimeMinutes: number;
}

export function calculateStats(markdown: string): DocumentStats {
  const cleanText = markdown.trim();
  const words = cleanText ? cleanText.split(/\\s+/).length : 0;
  const characters = cleanText.length;
  const readingTimeMinutes = Math.ceil(words / 200);

  return { words, characters, readingTimeMinutes };
}

console.log("Markdown Previewer Başarıyla Yüklendi!");
\`\`\`

\`\`\`python
# Python Veri Analizi Örneği
def fibonacci_sequence(n: int) -> list[int]:
    """İlk n Fibonacci sayısını hesaplar."""
    if n <= 0:
        return []
    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])
    return sequence[:n]

print(fibonacci_sequence(8)) # [0, 1, 1, 2, 3, 5, 8, 13]
\`\`\`

---

## 📊 Tablo Desteği (GFM Tables)

Verilerinizi okunabilir, düzenli tablolara dönüştürün:

| Özellik | Açıklama | Durum |
| :--- | :--- | :---: |
| **Canlı Ön İzleme** | Yazdıkça anlık HTML çıktısı | ✅ Aktif |
| **Sözdizimi Vurgulama** | highlight.js ile çoklu dil desteği | ✅ Aktif |
| **Örnek Kılavuz (?)** | Sağ üstteki soru işareti ile tam rehber | ✅ Aktif |
| **Dışa Aktarma** | Markdown (.md), HTML ve PDF formatları | ✅ Aktif |
| **İmza & Tasarım** | Enes Öztürk Özel Tasarımı | 🌟 Özel |

---

## ✅ Görev Listesi (Interactive Task List)

- [x] Sol panelde markdown metin girdisi hazırlama
- [x] Sağ panelde canlı ön izleme render motoru
- [x] Sağ üst soru işareti (?) butonuna tıklandığında örnek ve kılavuz modalı
- [x] Kod bloklarında tek tıkla kopyalama butonu
- [x] Enes Öztürk imzalı profesyonel ve modern arayüz
- [ ] Yeni markdown şablonları ekle

---

## 🔗 Bağlantılar ve Görseller

Google arama motoruna gitmek için [buraya tıklayın](https://www.google.com).

Doğa temalı örnek görsel:
![Modern Mimari](https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80)

---

### 📝 Sıralı ve Sırasız Listeler

1. Birinci adım: Markdown metninizi yazın veya yapıştırın.
2. İkinci adım: Sağ tarafta anında biçimlendirilmiş halini görün.
3. Üçüncü adım: Dilerseniz HTML veya MD olarak indirin.
   - Alt madde A: Renk temasını zevkinize göre ayarlayın.
   - Alt madde B: Sağ üstteki **?** butonuna basarak örnekleri inceleyin.
`
  },
  {
    id: 'readme',
    title: 'Profesyonel GitHub README',
    badge: 'Geliştirici Şablonu',
    description: 'Açık kaynak projeleriniz için hazır README.md şablonu.',
    content: `# 🚀 Proje Adı: Markdown Engine Pro

> Enes Öztürk tarafından geliştirilmiş modern, hızlı ve duyarlı Markdown ön izleme motoru.

[![Lisans: MIT](https://img.shields.io/badge/Lisans-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-61dafb)](https://react.dev)

## ✨ Özellikler

- ⚡ **Sıfır Gecikme:** Yazdığınız anda 60 FPS hızında canlı ön izleme.
- 🎨 **Çoklu Tema:** Koyu (Dark), Açık (Light) ve Kitap (Sepia) okuma modları.
- 📐 **Akıllı Araç Çubuğu:** Başlıklar, tablolar, linkler ve kodlar için hızlı kısayollar.
- ❓ **Entegre Kılavuz:** Sağ üstteki soru işareti butonuyla erişilebilen kapsamlı rehber.

## 📦 Kurulum

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki komutları uygulayın:

\`\`\`bash
# Depoyu klonlayın
git clone https://github.com/enesozturk/markdown-previewer.git

# Proje dizinine geçin
cd markdown-previewer

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
\`\`\`

## 🛠️ Mimari & Teknolojiler

| Katman | Teknoloji | Amaç |
| :--- | :--- | :--- |
| **Ön Yüz** | React 19 + TypeScript | Reaktif bileşen mimarisi |
| **Stil** | Tailwind CSS | Modern, estetik arayüz |
| **Parser** | Marked + DOMPurify | Hızlı ve güvenli markdown işleme |
| **Sözdizimi** | Highlight.js | Kod bloklarını renklendirme |

---

## 👨‍💻 Geliştirici

**Enes Öztürk**  
- Web: [Portfolio](https://github.com)
- E-posta: enesbino38@gmail.com
`
  },
  {
    id: 'article',
    title: 'Teknik Blog Yazısı',
    badge: 'Yazar Şablonu',
    description: 'Yazarlar ve blog üreticileri için makale şablonu.',
    content: `# Modern Web Geliştirmede Markdown'ın Yeri ve Gücü

*Yazar: Enes Öztürk · Yayın Tarihi: 27 Ekim 2026 · Okuma Süresi: ~4 Dakika*

---

Markdown, 2004 yılında John Gruber ve Aaron Swartz tarafından sade bir amaçla yaratıldı: **İnsanların kolayca okuyup yazabileceği, aynı zamanda yapısal olarak geçerli XHTML veya HTML'e dönüştürülebilen bir biçimlendirme dili.**

Bugün GitHub, Notion, Obsidian, Slack ve Discord gibi dünyanın en büyük platformlarının temel taşı haline gelmiştir.

## Neden Markdown Tercih Edilmeli?

1. **Taşınabilirlik (Portability):** Herhangi bir metin editöründe açılabilir, platform bağımsızdır.
2. **Dikkat Dağıtmayan Yazım (Distraction-Free):** Menüler ve biçim butonları arasında kaybolmadan sadece içeriğe odaklanırsınız.
3. **Versiyon Kontrolü:** Git gibi sistemlerle satır satır değişiklikleri takip edebilirsiniz.

### Örnek Bir Karşılaştırma

\`\`\`html
<!-- Klasik HTML ile Başlık ve Paragraf -->
<article class="post">
  <h1>Yazılımda Temiz Kod</h1>
  <p>Okunabilirlik her şeyden önce gelir.</p>
</article>
\`\`\`

Aynı yapının Markdown karşılığı:

\`\`\`markdown
# Yazılımda Temiz Kod
Okunabilirlik her şeyden önce gelir.
\`\`\`

> "Yazılımcılar zamanlarının çoğunu kod yazarak değil, yazılmış kodu okuyarak geçirirler."  
> — *Robert C. Martin (Clean Code)*

---

### Sonuç

Bir web geliştiricisi olarak Markdown ile üretkenliğinizi ikiye katlayabilirsiniz. Enes Öztürk imzalı bu ön izleyici ile içeriklerinizi güvenle hazırlayın!
`
  }
];

export interface CheatSheetItem {
  category: string;
  name: string;
  syntax: string;
  preview: string;
  explanation: string;
}

export const CHEAT_SHEET: CheatSheetItem[] = [
  {
    category: 'Başlıklar',
    name: 'Başlık 1 (H1)',
    syntax: '# Başlık Metni',
    preview: '<h1 style="font-size: 1.4rem; font-weight: bold; margin: 0;">Başlık Metni</h1>',
    explanation: 'Sayfa veya dokümanın en büyük ana başlığı.'
  },
  {
    category: 'Başlıklar',
    name: 'Başlık 2 (H2)',
    syntax: '## Bölüm Başlığı',
    preview: '<h2 style="font-size: 1.2rem; font-weight: bold; margin: 0;">Bölüm Başlığı</h2>',
    explanation: 'Bölümler ve ana konular için ikincil başlık.'
  },
  {
    category: 'Başlıklar',
    name: 'Başlık 3 (H3)',
    syntax: '### Alt Başlık',
    preview: '<h3 style="font-size: 1.05rem; font-weight: 600; margin: 0;">Alt Başlık</h3>',
    explanation: 'Detay maddeleri ve alt başlıklar.'
  },
  {
    category: 'Biçimlendirme',
    name: 'Kalın (Bold)',
    syntax: '**Kalın Metin**',
    preview: '<strong>Kalın Metin</strong>',
    explanation: 'Vurgulamak istediğiniz sözcükleri çift yıldız arasına alın.'
  },
  {
    category: 'Biçimlendirme',
    name: 'İtalik (Italic)',
    syntax: '*İtalik Metin*',
    preview: '<em>İtalik Metin</em>',
    explanation: 'Tek yıldız veya alt tire ile eğik yazı oluşturun.'
  },
  {
    category: 'Biçimlendirme',
    name: 'Üstü Çizili',
    syntax: '~~Üstü Çizili~~',
    preview: '<del>Üstü Çizili</del>',
    explanation: 'Tamamlanmış veya geçersiz metinler için çift tilde kullanın.'
  },
  {
    category: 'Alıntı & Kod',
    name: 'Blok Alıntı',
    syntax: '> Bu bir alıntıdır.',
    preview: '<blockquote style="border-left: 3px solid #38bdf8; padding-left: 8px; font-style: italic; margin: 0;">Bu bir alıntıdır.</blockquote>',
    explanation: 'Önemli notlar, uyarılar veya alıntılanan sözler için.'
  },
  {
    category: 'Alıntı & Kod',
    name: 'Satır İçi Kod',
    syntax: '`const app = true;`',
    preview: '<code style="background: rgba(148,163,184,0.2); padding: 2px 6px; border-radius: 4px; color: #f43f5e;">const app = true;</code>',
    explanation: 'Cümle içinde fonksiyon, dosya adı veya değişken adı belirtirken.'
  },
  {
    category: 'Alıntı & Kod',
    name: 'Kod Bloğu',
    syntax: '```javascript\nconsole.log("Merhaba Dünya");\n```',
    preview: '<pre style="background: #0f172a; padding: 6px 10px; border-radius: 4px; margin: 0; font-size: 0.85rem;"><code style="color: #38bdf8;">console.log("Merhaba");</code></pre>',
    explanation: 'Üç ters tırnak ve dil ismiyle çok satırlı kod renklendirme.'
  },
  {
    category: 'Listeler',
    name: 'Sırasız Liste',
    syntax: '- Madde 1\n- Madde 2',
    preview: '<ul style="list-style-type: disc; padding-left: 18px; margin: 0;"><li>Madde 1</li><li>Madde 2</li></ul>',
    explanation: 'Tire (-) veya yıldız (*) ile madde işaretli liste.'
  },
  {
    category: 'Listeler',
    name: 'Görev Listesi',
    syntax: '- [x] Tamamlandı\n- [ ] Yapılacak',
    preview: '<div style="font-size: 0.9rem;"><span style="color: #38bdf8;">☑</span> Tamamlandı<br/><span style="color: #94a3b8;">☐</span> Yapılacak</div>',
    explanation: 'Yapılacaklar listesi ve kontrol kutucukları.'
  },
  {
    category: 'Tablolar',
    name: 'Tablo',
    syntax: '| Başlık 1 | Başlık 2 |\n| :--- | :--- |\n| Veri A | Veri B |',
    preview: '<table style="border: 1px solid rgba(148,163,184,0.3); font-size: 0.85rem;"><tr><th style="border: 1px solid rgba(148,163,184,0.3); padding: 2px 6px;">Başlık</th></tr><tr><td style="border: 1px solid rgba(148,163,184,0.3); padding: 2px 6px;">Veri</td></tr></table>',
    explanation: 'Sütunları dikey çizgi (|) ile ayırın.'
  },
  {
    category: 'Bağlantı & Medya',
    name: 'Köprü Bağlantı (Link)',
    syntax: '[Enes Öztürk](https://google.com)',
    preview: '<a href="#" style="color: #38bdf8; text-decoration: underline;">Enes Öztürk</a>',
    explanation: 'Köşeli paranteze link metnini, normal paranteze URL adresini yazın.'
  },
  {
    category: 'Bağlantı & Medya',
    name: 'Görsel (Image)',
    syntax: '![Açıklama](gorsel-url.jpg)',
    preview: '<span style="font-size: 0.85rem; color: #94a3b8;">🖼️ [Resim Önizleme]</span>',
    explanation: 'Bağlantı formatının başına ünlem (!) işareti ekleyin.'
  }
];
