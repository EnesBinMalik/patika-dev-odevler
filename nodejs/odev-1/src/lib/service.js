/**
 * Patika.dev - Node.js Eğitimi / Ödev 1
 * Geliştirici: Enes Öztürk
 * Açıklama: JSONPlaceholder API'si üzerinden verilen kullanıcı ID'sine ait
 *           kullanıcı bilgilerini ve paylaşımlarını (posts) asenkron olarak çekip
 *           birleştirerek döndüren servis fonksiyonu.
 */

import axios from "axios";

/**
 * Belirtilen kullanıcı ID'sine ait kullanıcı bilgilerini ve postlarını getirir.
 * @param {Number} userId - Bilgileri çekilecek kullanıcının ID numarası
 * @returns {Promise<Object>} Kullanıcı bilgileri ve 'posts' dizisini içeren birleşik nesne
 */
const getData = async (userId) => {
  // Parametrenin sayısal değer kontrolü
  const id = Number(userId);
  if (isNaN(id) || id <= 0) {
    throw new Error("Geçersiz User ID! Lütfen pozitif bir sayı giriniz.");
  }

  try {
    // 1. Kullanıcı bilgilerini çekme isteği
    const { data: user } = await axios.get(
      `https://jsonplaceholder.typicode.com/users/${id}`
    );

    // 2. Kullanıcının gönderilerini (posts) çekme isteği
    const { data: posts } = await axios.get(
      `https://jsonplaceholder.typicode.com/posts?userId=${id}`
    );

    // 3. Kullanıcı bilgileri ve postları tek bir nesnede birleştirip döndürme
    const combinedData = {
      ...user,
      posts,
    };

    return combinedData;
  } catch (error) {
    console.error(`[Enes Öztürk - Servis Hatası]: User ID ${id} için veri çekilemedi.`, error.message);
    throw error;
  }
};

export default getData;
