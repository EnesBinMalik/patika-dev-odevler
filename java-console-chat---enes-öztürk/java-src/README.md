# Java Çok İplikli Konsol Chat Uygulaması (LAN Destekli)
**Geliştirici:** Enes Öztürk  
**İletişim:** enesbino38@gmail.com  
**Teknolojiler:** Java (Standart Kütüphane), TCP/IP Soketler (`ServerSocket`, `Socket`), Çoklu İplikler (`Thread`, `Runnable`, `ConcurrentHashMap`)

---

## 📌 Proje Genel Bakış
Bu uygulama, Yerel Alan Ağında (LAN) veya aynı bilgisayarda birden fazla kullanıcının terminal üzerinden gerçek zamanlı iletişim kurmasını sağlayan konsol tabanlı bir sohbet sistemidir.

Sunucu (**Server**) ve İstemci (**Client**) olmak üzere iki bağımsız bileşenden oluşur.

### 🌟 Temel Özellikler
1. **Soket Mimarisi:** İstemciler ve sunucu arasında çift yönlü güvenilir TCP bağlantısı (`java.net.Socket`, `java.net.ServerSocket`).
2. **İplik (Multithreading) Mimarisi:**
   - **Sunucu tarafında:** Her bağlı istemci için arka planda bağımsız bir iş parçacığı (`ClientHandler` implements `Runnable`) tahsis edilir. Böylece onlarca kullanıcı birbirini engellemeden eşzamanlı işlem yapabilir.
   - **İstemci tarafında:** İki ayrı iplik çalışır: biri sunucudan gelen mesajları arka planda dinler (`ReadThread`), diğeri kullanıcının klavye girdisini sunucuya iletir (`Main Thread`). Bu sayede bir kullanıcı yazarken ekran donmaz ve gelen iletiler anında akar.
3. **Sohbet Odaları (Chat Rooms):**
   - Kullanıcılar `/olustur <oda>` ile yeni odalar kurabilir.
   - `/katil <oda>` ile odalar arasında geçiş yapabilir.
   - Mesajlar o an bulunulan odadaki kullanıcılara dağıtılır.
4. **Çevrimiçi Kullanıcı Bilgilendirmesi:**
   - Bağlantı kurulduğunda kullanıcı adı istenir (benzersizlik kontrol edilir).
   - Sunucu yeni kullanıcıya anlık tüm çevrimiçi kullanıcıların listesini gönderir.
   - Yeni biri katıldığında veya ayrıldığında odadaki/sunucudaki kullanıcılar bilgilendirilir.
5. **Özel Mesaj (Whisper / PM):**
   - `/pm <kullanici> <mesaj>` komutu ile birebir gizli mesajlaşma.
6. **Yerel Ağ (LAN) Desteği:**
   - Sunucu açıldığında bilgisayarınızın Wi-Fi veya Ethernet LAN IP adreslerini otomatik tespit edip ekrana listeler.

---

## 🚀 Derleme ve Çalıştırma

### 1. Adım: Kaynak Kodları Derleme (Compile)
Terminal veya Komut Satırını (CMD/PowerShell/Bash) proje dizininde açınız:

```bash
# Linux / macOS:
javac -encoding UTF-8 *.java

# Windows:
javac -encoding UTF-8 *.java
```
*(veya hazır `compile.bat` / `compile.sh` dosyalarını çalıştırabilirsiniz)*

---

### 2. Adım: Sunucuyu Başlatma (ChatServer)
Önce sunucu çalıştırılmalıdır:

```bash
# Varsayılan port (5000) ile başlatma:
java ChatServer

# Özel bir port belirterek başlatma (Örn: 8080):
java ChatServer 8080
```

Sunucu açıldığında konsolda yerel ağ IP adresinizi gösterecektir (Örn: `192.168.1.105`).

---

### 3. Adım: İstemcileri Başlatma (ChatClient)

#### Aynı Bilgisayarda Test Etmek İçin:
Farklı terminal pencereleri açarak:
```bash
java ChatClient localhost 5000
```

#### Aynı Wi-Fi / LAN Ağındaki Farklı Bilgisayarlardan Bağlanmak İçin:
Diğer bilgisayarın terminalinde:
```bash
# java ChatClient <SUNUCU_BILGISAYARININ_LAN_IPSI> 5000
java ChatClient 192.168.1.105 5000
```
*(Sunucu güvenlik duvarının 5000 numaralı porta izin verdiğinden emin olunuz)*

---

## ⌨️ Kullanılabilir Sohbet Komutları

| Komut | Açıklama | Örnek |
| :--- | :--- | :--- |
| `/yardim` | Tüm komutları listeler | `/yardim` |
| `/odalar` | Aktif sohbet odalarını ve kişi sayılarını gösterir | `/odalar` |
| `/olustur <oda>` | Yeni bir sohbet odası kurar ve odaya geçer | `/olustur #yazilim` |
| `/katil <oda>` | Mevcut bir odaya katılır | `/katil #genel` |
| `/kullanicilar` | Çevrimiçi tüm kullanıcıları ve oda üyelerini listeler | `/kullanicilar` |
| `/pm <kullanici> <mesaj>` | Belirli bir kullanıcıya özel (birebir) mesaj atar | `/pm enes Merhaba nasılsın?` |
| `/ayril` veya `/cikis` | Sohbetten ve sunucudan güvenle ayrılır | `/cikis` |

---

## 🛠️ Mimari Detaylar

```
              ┌──────────────────────────────────────┐
              │          ChatServer (Port 5000)      │
              │         ServerSocket.accept()        │
              └──────────────────┬───────────────────┘
                                 │
           ┌─────────────────────┼─────────────────────┐
           ▼                     ▼                     ▼
    ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
    │ClientHandler│       │ClientHandler│       │ClientHandler│
    │  [İplik 1]  │       │  [İplik 2]  │       │  [İplik 3]  │
    └──────┬──────┘       └──────┬──────┘       └──────┬──────┘
           ▲                     ▲                     ▲
           │ TCP Soket           │ TCP Soket           │ TCP Soket
           ▼                     ▼                     ▼
     [ChatClient 1]        [ChatClient 2]        [ChatClient 3]
     - ReadThread          - ReadThread          - ReadThread
     - WriteThread         - WriteThread         - WriteThread
```

---
*Geliştirici: Enes Öztürk | Tüm Hakları Saklıdır.*
