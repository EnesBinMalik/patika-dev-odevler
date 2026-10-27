# enes-ozturk-button 🚀

> Ant Design esintili, modern ve erişilebilir React Button bileşeni.  
> Geliştirici: **Enes Öztürk**

Bir React projesinde ihtiyaç duyabileceğiniz tüm temel buton stillerini (`primary`, `default`, `dashed`, `text`, `link`) içeren, TypeScript uyumlu ve hafif bir UI buton paketidir.

---

## 📦 Kurulum (Installation)

NPM ile yüklemek için:

```bash
npm install enes-ozturk-button
```

Yarn veya pnpm ile:

```bash
yarn add enes-ozturk-button
# veya
pnpm add enes-ozturk-button
```

---

## 💡 Temel Kullanım (Basic Usage)

```tsx
import React from 'react';
import { Button } from 'enes-ozturk-button';

export default function App() {
  return (
    <div style={{ display: 'flex', gap: '12px', padding: '24px' }}>
      {/* 5 Temel Tip */}
      <Button type="primary">Primary Button</Button>
      <Button type="default">Default Button</Button>
      <Button type="dashed">Dashed Button</Button>
      <Button type="text">Text Button</Button>
      <Button type="link">Link Button</Button>
    </div>
  );
}
```

---

## 🌟 Buton Tipleri (Button Types)

Bileşene geçilen `type` prop'u ile butonun görünümü değişir:

| Tip (`type`) | Açıklama |
| :--- | :--- |
| `primary` | Ana eylem butonu. Vurgulu mavi arka plan, beyaz metin ve hafif gölge. |
| `default` | Standart ikincil buton. Beyaz zemin, açık gri kenarlık, hover durumunda mavi vurgu. |
| `dashed` | Kesikli kenarlıklı buton. Dosya yükleme veya yeni öğe ekleme senaryolarında tercih edilir. |
| `text` | Kenarlıksız ve arka plansız metin buton. Minimalist alanlar için idealdir. |
| `link` | Köprü stilinde buton. Tıklandığında bağlantı hissi verir. |

---

## 🔥 Gelişmiş Özellikler (Advanced Features)

### 1. Boyutlar (Sizes)
```tsx
<Button type="primary" size="small">Small (Küçük)</Button>
<Button type="primary" size="middle">Middle (Standart)</Button>
<Button type="primary" size="large">Large (Büyük)</Button>
```

### 2. Tehlikeli Eylemler (Danger Variant)
Silme veya kritik işlemler için `danger` prop'u verilebilir:
```tsx
<Button type="primary" danger>Sil / Delete</Button>
<Button type="default" danger>Vazgeç</Button>
<Button type="dashed" danger>Kaldır</Button>
```

### 3. Yükleniyor Durumu (Loading State)
```tsx
<Button type="primary" loading>Kaydediliyor...</Button>
```

### 4. Şekil Seçenekleri (Shapes)
```tsx
<Button type="primary" shape="round">Yuvarlak Buton</Button>
<Button type="default" shape="circle" icon={<span>🔍</span>} />
```

### 5. Blok (Full Width)
```tsx
<Button type="primary" block>Tüm Genişliği Kapla</Button>
```

---

## 📋 Props Tablosu (API Reference)

| Prop | Tip | Varsayılan | Açıklama |
| :--- | :--- | :--- | :--- |
| `type` | `'primary' \| 'default' \| 'dashed' \| 'text' \| 'link'` | `'default'` | Butonun görsel tipi |
| `size` | `'small' \| 'middle' \| 'large'` | `'middle'` | Buton yüksekliği ve dolgusu |
| `shape` | `'default' \| 'circle' \| 'round'` | `'default'` | Köşe yuvarlaklığı / daire formatı |
| `loading` | `boolean` | `false` | Dönen animasyonlu spinner gösterir |
| `danger` | `boolean` | `false` | Kırmızı tehlike temasını aktif eder |
| `ghost` | `boolean` | `false` | Arka planı şeffaf yapar (koyu zeminler için) |
| `disabled` | `boolean` | `false` | Butonu pasif hale getirir |
| `block` | `boolean` | `false` | %100 genişlik verir (`w-full`) |
| `icon` | `ReactNode` | - | Buton içine yerleştirilecek ikon |
| `iconPosition` | `'start' \| 'end'` | `'start'` | İkonun metne göre konumu |
| `htmlType` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML buton tipi |
| `onClick` | `(event) => void` | - | Tıklama olayı dinleyicisi |

---

## 👨‍💻 Yazar & Lisans

- **Geliştirici:** Enes Öztürk  
- **E-posta:** enesbino38@gmail.com  
- **Lisans:** MIT License  
