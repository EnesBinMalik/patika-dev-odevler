import { Brand, NotebookProduct, PhoneProduct, Product } from '../types';

export function formatTL(amount: number): string {
  return `${amount.toFixed(1)} TL`;
}

export function formatCurrencyPretty(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(amount);
}

export function calculateDiscountedPrice(price: number, discountRate: number): number {
  if (!discountRate || discountRate <= 0) return price;
  return price * (1 - discountRate / 100);
}

// Helper to pad string left/right
function padEnd(str: string, length: number): string {
  if (str.length >= length) return str.slice(0, length);
  return str + ' '.repeat(length - str.length);
}

function padStart(str: string, length: number): string {
  if (str.length >= length) return str.slice(0, length);
  return ' '.repeat(length - str.length) + str;
}

/**
 * Notebook ASCII Tablosu (System.out.format stili)
 */
export function generateAsciiNotebookTable(products: Product[], brands: Brand[]): string {
  const brandMap = new Map(brands.map((b) => [b.id, b.name]));
  const notebookItems = products.filter((p) => p.category === 'notebook') as NotebookProduct[];

  const divider = '-'.repeat(100);
  const header = `| ${padEnd('ID', 4)}| ${padEnd('Ürün Adı', 30)}| ${padEnd('Fiyat', 11)}| ${padEnd('Marka', 11)}| ${padEnd('Depolama', 11)}| ${padEnd('Ekran', 11)}| ${padEnd('RAM', 13)}|`;

  if (notebookItems.length === 0) {
    return `${divider}\n${header}\n${divider}\n| Henüz bu kategoride ürün bulunmamaktadır.\n${divider}`;
  }

  const rows = notebookItems.map((item) => {
    const brandName = brandMap.get(item.brandId) || 'Bilinmiyor';
    const idStr = String(item.id);
    const nameStr = item.name;
    const priceStr = `${item.price.toFixed(1)} TL`;
    const storageStr = item.storage.replace(/\s*SSD/i, '').trim();
    const screenStr = item.screenSize.replace(/[^0-9.]/g, '').trim();
    const ramStr = item.ram.replace(/[^0-9]/g, '').trim();

    return `| ${padEnd(idStr, 4)}| ${padEnd(nameStr, 30)}| ${padEnd(priceStr, 11)}| ${padEnd(brandName, 11)}| ${padEnd(storageStr, 11)}| ${padEnd(screenStr, 11)}| ${padEnd(ramStr, 13)}|`;
  });

  return `${divider}\n${header}\n${divider}\n${rows.join('\n')}\n${divider}`;
}

/**
 * Cep Telefonu ASCII Tablosu (System.out.format stili)
 */
export function generateAsciiPhoneTable(products: Product[], brands: Brand[]): string {
  const brandMap = new Map(brands.map((b) => [b.id, b.name]));
  const phoneItems = products.filter((p) => p.category === 'phone') as PhoneProduct[];

  const divider = '-'.repeat(134);
  const header = `| ${padEnd('ID', 4)}| ${padEnd('Ürün Adı', 30)}| ${padEnd('Fiyat', 11)}| ${padEnd('Marka', 11)}| ${padEnd('Depolama', 11)}| ${padEnd('Ekran', 11)}| ${padEnd('Kamera', 11)}| ${padEnd('Pil', 11)}| ${padEnd('RAM', 11)}| ${padEnd('Renk', 11)}|`;

  if (phoneItems.length === 0) {
    return `${divider}\n${header}\n${divider}\n| Henüz bu kategoride ürün bulunmamaktadır.\n${divider}`;
  }

  const rows = phoneItems.map((item) => {
    const brandName = brandMap.get(item.brandId) || 'Bilinmiyor';
    const idStr = String(item.id);
    const nameStr = item.name;
    const priceStr = `${item.price.toFixed(1)} TL`;
    const storageStr = item.storage.replace(/[^0-9]/g, '').trim();
    const screenStr = item.screenSize.replace(/[^0-9.]/g, '').trim();
    const cameraStr = item.camera.replace(/[^0-9]/g, '').trim();
    const batteryStr = `${Number(item.battery).toFixed(1)}`;
    const ramStr = item.ram.replace(/[^0-9]/g, '').trim();
    const colorStr = item.color || '-';

    return `| ${padEnd(idStr, 4)}| ${padEnd(nameStr, 30)}| ${padEnd(priceStr, 11)}| ${padEnd(brandName, 11)}| ${padEnd(storageStr, 11)}| ${padEnd(screenStr, 11)}| ${padEnd(cameraStr, 11)}| ${padEnd(batteryStr, 11)}| ${padEnd(ramStr, 11)}| ${padEnd(colorStr, 11)}|`;
  });

  return `${divider}\n${header}\n${divider}\n${rows.join('\n')}\n${divider}`;
}

/**
 * Marka Listesi ASCII Çıktısı (Alfabetik)
 */
export function generateAsciiBrandList(brands: Brand[]): string {
  const sorted = [...brands].sort((a, b) => a.name.localeCompare(b.name, 'tr'));
  const lines = ['Markalarımız', '--------------', ...sorted.map((b) => `- ${b.name}`)];
  return lines.join('\n');
}
