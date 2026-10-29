export interface CodeFile {
  name: string;
  filename: string;
  path: string;
  language: string;
  description: string;
  content: string;
  highlights: {
    lineRange: string;
    title: string;
    detail: string;
  }[];
}

export const CIRCLE_JS_CODE = `/**
 * Ödev 3: Daire Modüler Dosyası
 * Hazırlayan: Enes Öztürk
 * 
 * Fonksiyonlar:
 * - circleArea: Daire alanını hesaplar (π * r²) ve konsola yazdırır.
 * - circleCircumference: Daire çevresini hesaplar (2 * π * r) ve konsola yazdırır.
 */

// Daire alanı hesaplayan ve konsola yazdıran fonksiyon
function circleArea(r) {
  const area = Math.PI * Math.pow(r, 2);
  const formatted = Number(area.toFixed(2));
  console.log(\`Yarıçapı (\${r}) olan dairenin alanı: \${formatted}\`);
  return area;
}

// Daire çevresi hesaplayan ve konsola yazdıran fonksiyon
function circleCircumference(r) {
  const circumference = 2 * Math.PI * r;
  const formatted = Number(circumference.toFixed(2));
  console.log(\`Yarıçapı (\${r}) olan dairenin çevresi: \${formatted}\`);
  return circumference;
}

// module.exports yöntemi ile fonksiyonları dışa aktarma
module.exports = {
  circleArea,
  circleCircumference,
};
`;

export const INDEX_JS_CODE = `/**
 * Ödev 3: Daire Modülü Kullanımı
 * Hazırlayan: Enes Öztürk
 *
 * circle.js modülünden require ve object destructuring (nesne parçalama)
 * yöntemiyle fonksiyonlar içe aktarılır.
 * Yarıçap (r) = 5 için konsol çıktısı üretilir.
 */

// require ve object destructuring (nesne parçalama) kullanarak fonksiyonları içe aktarma
const { circleArea, circleCircumference } = require('./circle');

console.log('==================================================');
console.log('       NODE.JS ÖDEV 3: DAİRE MODÜLÜ PROJESİ       ');
console.log('           Geliştirici: Enes Öztürk               ');
console.log('==================================================\\n');

// Yarıçap (r) değeri 5 olarak belirleniyor
const r = 5;

console.log(\`> Belirlenen Yarıçap Değeri: r = \${r}\\n\`);

// Fonksiyonları çağırarak konsol çıktılarını alıyoruz
console.log('[1] circleArea(r) Çağrıldı:');
circleArea(r);

console.log('\\n[2] circleCircumference(r) Çağrıldı:');
circleCircumference(r);

console.log('\\n==================================================');
console.log('  İşlem başarıyla tamamlandı. — İmza: Enes Öztürk  ');
console.log('==================================================');
`;

export const PACKAGE_JSON_CODE = `{
  "name": "odev3-daire-modulu",
  "version": "1.0.0",
  "description": "Ödev 3: Daire Modüler Dosyası - Enes Öztürk",
  "main": "index.js",
  "type": "commonjs",
  "scripts": {
    "start": "node index.js"
  },
  "author": "Enes Öztürk",
  "license": "MIT"
}
`;

export const README_MD_CODE = `# Ödev 3: Daire Modüler Dosyası

**Geliştirici:** Enes Öztürk  
**Platform:** Node.js (CommonJS Modül Sistemi)

---

## 📌 Görev Tanımı
1. \`circleArea\` (daire alanı) ve \`circleCircumference\` (daire çevresi) fonksiyonlarını içeren ve sonuçları konsola yazdıran \`circle.js\` dosyası oluşturmak.
2. Fonksiyonları \`module.exports\` yöntemi ile dışa aktarmak.
3. \`index.js\` dosyasında \`require\` ve **object destructuring** kullanarak fonksiyonları çağırmak ve yarıçap **r = 5** için ekran çıktısı almak.
4. Çıktı ve kod **Enes Öztürk** imzalı olmalıdır.

---

## 🚀 Çalıştırma Talimatı

Terminalinizde proje dizinine giderek aşağıdaki komutu çalıştırabilirsiniz:

\`\`\`bash
node index.js
\`\`\`

veya \`npm start\` komutuyla:

\`\`\`bash
npm start
\`\`\`

---

## 📊 Örnek Konsol Çıktısı (r = 5)

\`\`\`text
==================================================
       NODE.JS ÖDEV 3: DAİRE MODÜLÜ PROJESİ       
           Geliştirici: Enes Öztürk               
==================================================

> Belirlenen Yarıçap Değeri: r = 5

[1] circleArea(r) Çağrıldı:
Yarıçapı (5) olan dairenin alanı: 78.54

[2] circleCircumference(r) Çağrıldı:
Yarıçapı (5) olan dairenin çevresi: 31.42

==================================================
  İşlem başarıyla tamamlandı. — İmza: Enes Öztürk  
==================================================
\`\`\`
`;

export const CODE_FILES: CodeFile[] = [
  {
    name: 'circle.js',
    filename: 'circle.js',
    path: './circle.js',
    language: 'javascript',
    description: 'Daire alan ve çevre hesaplama fonksiyonları ile module.exports dışa aktarımı.',
    content: CIRCLE_JS_CODE,
    highlights: [
      {
        lineRange: '10-15',
        title: 'circleArea(r) Fonksiyonu',
        detail: 'Math.PI * r² formülüyle alanı hesaplar ve konsola yazdırır.',
      },
      {
        lineRange: '17-22',
        title: 'circleCircumference(r) Fonksiyonu',
        detail: '2 * Math.PI * r formülüyle çevreyi hesaplar ve konsola yazdırır.',
      },
      {
        lineRange: '24-28',
        title: 'module.exports Dışa Aktarımı',
        detail: 'Fonksiyonları nesne olarak dışarı aktararak diğer modüllerin kullanımına açar.',
      },
    ],
  },
  {
    name: 'index.js',
    filename: 'index.js',
    path: './index.js',
    language: 'javascript',
    description: 'require ve object destructuring ile modülü içeri aktarır ve r=5 için çalıştırır.',
    content: INDEX_JS_CODE,
    highlights: [
      {
        lineRange: '10',
        title: 'require & Object Destructuring',
        detail: "const { circleArea, circleCircumference } = require('./circle');",
      },
      {
        lineRange: '18',
        title: 'Yarıçap r = 5',
        detail: 'Ödev gereksinimi olan r = 5 değeri tanımlanmıştır.',
      },
      {
        lineRange: '21-26',
        title: 'Fonksiyon Çağrıları & Çıktılar',
        detail: 'Alan ve çevre fonksiyonları çağrılarak konsola sonuçlar dökülür.',
      },
      {
        lineRange: '28-31',
        title: 'Enes Öztürk İmzası',
        detail: 'Başlıkta ve sonuç kapanışında Enes Öztürk imzası yer alır.',
      },
    ],
  },
  {
    name: 'package.json',
    filename: 'package.json',
    path: './package.json',
    language: 'json',
    description: 'CommonJS modül yapılandırması ve npm script tanımları.',
    content: PACKAGE_JSON_CODE,
    highlights: [
      {
        lineRange: '5',
        title: '"type": "commonjs"',
        detail: 'Node.js varsayılan require() ve module.exports yapısını doğrular.',
      },
    ],
  },
  {
    name: 'README.md',
    filename: 'README.md',
    path: './README.md',
    language: 'markdown',
    description: 'Ödev dokümantasyonu ve çalıştırma rehberi.',
    content: README_MD_CODE,
    highlights: [],
  },
];
