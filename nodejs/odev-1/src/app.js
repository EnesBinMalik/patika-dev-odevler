/**
 * ==============================================================
 * Patika.dev - Node.js Eğitimi / Ödev 1
 * Geliştirici: Enes Öztürk
 * İletişim / İmza: Enes Öztürk
 * Açıklama: JSONPlaceholder API'sinden kullanıcı ve post verilerini
 *           çeken getData fonksiyonunu import edip çalıştıran ana dosya.
 * ==============================================================
 */

import getData from "./lib/service.js";

// getData fonksiyonunu User ID = 1 için çalıştırıp sonucu konsola yazdırıyoruz
(async () => {
  try {
    console.log("==================================================");
    console.log("🚀 Patika.dev Node.js Ödev 1 - Enes Öztürk");
    console.log("📥 User ID: 1 için veriler çekiliyor...");
    console.log("==================================================");

    const result = await getData(1);

    console.log("\n✅ Başarıyla Alınan Birleşik Veri:\n");
    console.dir(result, { depth: null, colors: true });
    console.log("\n==================================================");
    console.log("✨ Ödev tamamlandı - Enes Öztürk");
    console.log("==================================================");
  } catch (error) {
    console.error("❌ Veri çekilirken hata meydana geldi:", error.message);
  }
})();
