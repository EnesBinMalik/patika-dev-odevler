"""Enes Öztürk · Patika.dev arşivi — README üreteci.

AI Studio şablonundan kalan ya da zayıf kalmış README dosyalarını, projenin kendi
metadata.json künyesi + kapak görseli + gerçek çalıştırma komutlarıyla yeniden yazar.
`## Gelecek adımlar` bölümü önceki README'de varsa korunur.

Kullanım:
    python tools_readme.py --dry-run
    python tools_readme.py
"""

from __future__ import annotations

import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent

DETAILS = {
    "1.6m-uk-trafik-kazaları-analiz-&-tahmin-platformu": dict(
        hat="Veri analizi & görselleştirme", teknoloji="React · TypeScript · Vite",
        one="Bir buçuk milyon satırlık İngiltere trafik kaza kaydını dört analiz sütununa bölen yönetim paneli: trafik akışı, risk faktörleri, zaman serisi tahmini ve kırsal–kentsel ayrım.",
        features=["**Trafik akışı** — yıl, ay, saat ve yol tipine göre kaza yoğunluğu.",
                  "**Risk faktörleri** — hava durumu, yol yüzeyi, ışık koşulları ve hız limiti kırılımı.",
                  "**Zaman serisi tahmini** — geçmiş yıllardan hareketle dönemsel beklenti.",
                  "**Kırsal–kentsel karşılaştırma** — bölge tipine göre şiddet ve sıklık farkı.",
                  "Yönetici özeti raporu ve bölgesel harita bölümleri."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi"), ("npm run lint", "tsc --noEmit")],
    ),
    "algoritmik-veri-görselleştirici-&-algoritma-labirenti": dict(
        hat="Algoritma & veri yapıları", teknoloji="React · TypeScript · Vite",
        one="Dizi, yığıt, kuyruk, sıralama ve labirent keşfi algoritmalarını adım adım izleyerek öğreten interaktif simülatör.",
        features=["**Dizi görselleştirici** — ekleme, silme ve erişim adımları.",
                  "**Yığıt & kuyruk** — push/pop ve enqueue/dequeue animasyonları.",
                  "**Sıralama** — bubble, merge ve quick sort adım karşılaştırması.",
                  "**Labirent** — BFS, DFS ve A* ile yol bulma.",
                  "Modül başına bağımsız ekran ve kontrol paneli."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "cord-19-research-mining-portal": dict(
        hat="Veri madenciliği", teknoloji="React · TypeScript · Vite",
        one="COVID-19 açık araştırma veri setini (CORD-19) konu, yazar ve anahtar kelime üzerinden taramaya açan keşif portalı.",
        features=["Makale, yazar ve anahtar kelime araması.",
                  "Konu kümeleri ve terim eş-oluşum görünümü.",
                  "Filtre paneli ve sonuç kartları.",
                  "Araştırma özetini tek ekranda toplayan pano."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "elma-yaprak-hastalıkları-tespiti---enes-öztürk": dict(
        hat="Makine öğrenmesi · bilgisayarlı görü", teknoloji="React · TypeScript · Vite",
        one="Kaggle Plant Pathology 2020 (FGVC7) verisiyle elma yaprağı hastalıklarını sınıflandıran modelleri karşılaştıran teşhis ve benchmark platformu.",
        features=["Sınıflar: sağlıklı, scab, rust ve blotch.",
                  "Model karşılaştırma tablosu (doğruluk, F1, kayıp).",
                  "Karışıklık matrisi ve örnek tahmin kartları.",
                  "Veri seti künyesi ve değerlendirme protokolü."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "enes-öztürk---bilimsel-hesap-makinesi": dict(
        hat="Java · nesne yönelimli programlama", teknoloji="React · TypeScript · Vite",
        one="Java'nın hazır matematik sınıfları kullanılmadan, nesne yönelimli mimariyle sıfırdan yazılmış bilimsel hesap makinesi; türev ve integral adımlarını da gösterir.",
        features=["Dört işlem, kuvvet, kök, logaritma ve trigonometri.",
                  "Türev ve integral için adım adım çözüm gösterimi.",
                  "Her işlem için üretilen Java kaynak kodunun görüntülenmesi.",
                  "İşlem geçmişi ve hata durumları."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "git-&-cli-ui---git-simülatörü-ve-versiyon-takip-paneli": dict(
        hat="Versiyon kontrolü", teknoloji="React · TypeScript · Vite",
        one="Git komutlarının arka planda ne yaptığını ön yüzde görselleştiren simülatör: commit grafiği, dallar ve çalışma alanı durumu.",
        features=["`init`, `add`, `commit`, `branch`, `checkout`, `merge` komut simülasyonu.",
                  "Commit geçmişinin dal grafiği olarak çizimi.",
                  "Çalışma alanı / hazırlık alanı (staging) durumu.",
                  "Komut geçmişi ve adım adım açıklama."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "java-araç-kiralama-portalı-&-veritabanı-sistemi-—-enes-öztürk": dict(
        hat="Java · ilişkisel veritabanı", teknoloji="React · TypeScript · Vite",
        one="Firma ve müşterilerin şehir bazlı filtreleme, tarih çakışma kontrolü ve 24 saat kuralıyla araç kiralayabildiği portal.",
        features=["Araç, firma ve şehir bazlı arama.",
                  "Rezervasyonlarda tarih çakışması kontrolü.",
                  "Ek hizmet tanımlama ve fiyat hesabı.",
                  "İlişkisel veri modeli ve yönetici görünümü."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "java-console-chat---enes-öztürk": dict(
        hat="Java · soket programlama", teknoloji="React · TypeScript · Vite",
        one="Java soket ve iş parçacığı (Socket & Thread) mimarisiyle yazılmış, yerel ağda çalışan sohbet odalı konsol uygulaması ve simülatörü.",
        features=["Sunucu–istemci bağlantısı ve çoklu istemci desteği.",
                  "Sohbet odaları ve kullanıcı adı yönetimi.",
                  "Thread görselleştiricisi ile eşzamanlı akışın izlenmesi.",
                  "LAN kurulum rehberi ve kaynak kod gezgini."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "java-swing-depo-&-stok-yönetim-sistemi": dict(
        hat="Java Swing · katmanlı mimari", teknoloji="React · TypeScript · Vite",
        one="OOP ilkeleri ve Java Swing bileşenleriyle yazılmış, katmanlı mimariye sahip depo, stok ve tedarik zinciri otomasyonu.",
        features=["Ürün, depo, stok hareketi ve tedarikçi yönetimi.",
                  "Giriş/çıkış fişleri ve kritik stok uyarıları.",
                  "Arayüz · servis · model katman ayrımı.",
                  "Raporlama ekranı ve arama."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "saatlik-enerji-talebi,-üretimi-ve-hava-durumu-ml-platformu": dict(
        hat="Makine öğrenmesi · zaman serisi", teknoloji="React · TypeScript · Vite",
        one="İspanya'nın dört yıllık saatlik elektrik verisi ile beş büyük şehrin hava durumunu birleştirip talep ve fiyat tahmini yapan karar destek platformu.",
        features=["Saatlik tüketim, üretim, fiyat ve hava durumu serileri.",
                  "Aykırı değer (outlier) analizi ve temizleme adımları.",
                  "Zaman serisi modelleme ve tahmin görünümü.",
                  "Belediyeler için dinamik tarife simülatörü."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "world-happiness-report---enes-öztürk-analizi": dict(
        hat="Veri analizi", teknoloji="React · TypeScript · Vite",
        one="155 ülkenin altı temel faktör üzerinden mutluluk skorlarını, 2015–2017 değişimini ve en çok yükselen–gerileyen ülkeleri inceleyen analiz platformu.",
        features=["GSYH, sosyal destek, sağlıklı yaşam, özgürlük, cömertlik ve yolsuzluk algısı kırılımı.",
                  "Ülke karşılaştırma aracı ve mutluluk simülatörü.",
                  "2015–2017 değişim görünümü.",
                  "Vaka incelemeleri ve analist notu."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "öztürk-bank---online-bankacılık-sistemi": dict(
        hat="Java OOP · bankacılık", teknoloji="React · TypeScript · Vite",
        one="Java OOP mimarisiyle yazılmış, JSON tabanlı kalıcılık kullanan online bankacılık sistemi: hesaplar arası transfer, kredi ve kart ekstresi ödemesi.",
        features=["Müşteri, hesap ve hareket yönetimi.",
                  "Kullanıcılar arası para transferi.",
                  "Kredi başvurusu ve kart ekstresi ödemesi.",
                  "JSON dosyası üzerinden kalıcı veri."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "covid-19-tracker---enes-öztürk": dict(
        hat="Veri görselleştirme", teknoloji="React · TypeScript · Vite",
        one="Enfekte, iyileşen, vefat ve aktif hasta sayılarını dünya ve ülke bazında gösteren canlı takip paneli.",
        features=["Dünya özeti ve ülke seçici.",
                  "Zaman serisi grafikleri ve günlük değişim.",
                  "Ülke detay metrikleri.",
                  "Veri kaynağı ve yöntem notları."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "döngülerle-üçgen-çizme---enes-öztürk": dict(
        hat="Algoritma · döngüler", teknoloji="React · TypeScript · Vite",
        one="`for` ve `while` döngüleriyle parametrik üçgen çizen fonksiyonu, çıktıyı satır satır üreten interaktif konsol simülatörüyle birlikte sunan ödev uygulaması.",
        features=["Satır sayısı parametreli üçgen çizimi.",
                  "Her satır için döngü adımlarının gösterimi.",
                  "Konsol çıktısı ve üretilen JavaScript kodu.",
                  "Kenar boşluklu / yıldızlı desen seçenekleri."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "enes-öztürk-button-component": dict(
        hat="React bileşen kütüphanesi", teknoloji="React · TypeScript · Vite",
        one="`primary`, `default`, `dashed`, `text` ve `link` tiplerini destekleyen, paket olarak yayınlanabilir React Button bileşeni.",
        features=["Beş varyant ve boyut desteği.",
                  "Devre dışı, yükleniyor ve ikon durumları.",
                  "`packages/enes-ozturk-button` altında bağımsız paket.",
                  "Canlı örnek sayfası ve kullanım kılavuzu."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "enes-öztürk-meteoroloji-_-türkiye-7-günlük-hava-durumu": dict(
        hat="API entegrasyonu · Context API", teknoloji="React · TypeScript · Vite",
        one="Türkiye'nin 81 ili için anlık, saatlik ve 7 günlük hava durumunu Context API ile yöneten global durum üzerinden sunan meteoroloji uygulaması.",
        features=["81 il için anlık ve 7 günlük tahmin.",
                  "Sıcaklık, nem, rüzgâr ve yağış olasılığı.",
                  "Context API ile merkezî durum yönetimi.",
                  "İl arama ve hızlı geçiş."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "etkinlik-portalı---ödev-6": dict(
        hat="React · form yönetimi", teknoloji="React · TypeScript · Vite",
        one="Etkinlik ekleme, doğrulama ve dinamik filtreleme akışını uçtan uca gösteren gerçek zamanlı etkinlik portalı.",
        features=["Etkinlik ekleme formu ve alan doğrulaması.",
                  "Asenkron yükleme animasyonu.",
                  "Kategori ve arama ile dinamik filtreleme.",
                  "Etkinlik detay penceresi."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "eventhub---apollo-client-&-graphql-etkinlik-portalı": dict(
        hat="GraphQL · Apollo Client", teknoloji="React · TypeScript · Vite",
        one="Apollo Client üzerinden GraphQL sorgu ve mutation'larıyla çalışan etkinlik platformu: listeleme, katılım ve önbellek yönetimi.",
        features=["`useQuery` ile etkinlik listesi.",
                  "`useMutation` ile katılım ve kayıt akışı.",
                  "Apollo önbelleği ve iyimser (optimistic) güncelleme.",
                  "Yükleniyor ve hata durumlarının ele alınması."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "fikstür-mobilya-&-i̇ç-mimarlık---enes-öztürk": dict(
        hat="Kurumsal vitrin · katalog", teknoloji="React · TypeScript · Vite",
        one="Mobilya ve iç mimarlık markası için katalog, rezervasyon ve yönetim panelini tek React uygulamasında toplayan vitrin.",
        features=["Koleksiyon, ürün detayı ve galeri sayfaları.",
                  "Randevu ve rezervasyon formu.",
                  "Yönetim paneli: içerik ve stok.",
                  "Sayfa bazlı yönlendirme ve Context ile sepet durumu."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "geometrik-şekiller-oop-ödevi---enes-öztürk": dict(
        hat="Nesne yönelimli programlama", teknoloji="React · TypeScript · Vite",
        one="`Sekil`, `Dikdortgen`, `Kare` ve `Ucgen` sınıflarıyla kalıtım, kapsülleme ve çok biçimliliği uygulayan interaktif OOP ödevi.",
        features=["Dört şekil sınıfı ve alan/çevre hesapları.",
                  "Kalıtım zinciri ve metot ezme (override).",
                  "Girdi doğrulama ve hata mesajları.",
                  "Her hesap için üretilen sınıf kodunun gösterimi."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "gerçek-zamanlı-etkinlik-ve-katılımcı-takip-sistemi": dict(
        hat="React · Context API", teknoloji="React · TypeScript · Vite",
        one="Etkinlikleri listelerken katılımcı sayısını anlık güncelleyen takip sistemi.",
        features=["Etkinlik listesi ve durum göstergeleri.",
                  "Anlık katılımcı sayacı.",
                  "Context ile merkezî durum yönetimi.",
                  "Katılım ve iptal akışı."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "graphql-event-manager---ödev-2-(enes-öztürk)": dict(
        hat="GraphQL · mutation", teknoloji="React · TypeScript · Vite",
        one="User, Event, Location ve Participant nesneleri için ekleme, güncelleme, tekli ve toplu silme mutation'larını uygulayan ödev.",
        features=["Dört nesne için tam mutation seti.",
                  "Tekli ve toplu silme işlemleri.",
                  "Şema görünümü ve sorgu denemesi.",
                  "Değişiklik sonrası liste güncellemesi."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "graphql-subscriptions-studio---enes-öztürk": dict(
        hat="GraphQL · subscription", teknoloji="React · TypeScript · Vite",
        one="`userCreated`, `eventCreated` ve `participantAdded` abonelikleriyle gerçek zamanlı veri akışını test eden stüdyo.",
        features=["Üç subscription için canlı yayın paneli.",
                  "Olay tetikleme ve gelen veriyi izleme.",
                  "Abonelik yaşam döngüsü (bağlan / bırak).",
                  "İnteraktif test laboratuvarı."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "graphql-sunucusu---ödev-1-(enes-öztürk)": dict(
        hat="GraphQL · sunucu", teknoloji="React · TypeScript · Vite",
        one="Kullanıcı, etkinlik, konum ve katılımcı nesnelerini ilişkisel şemayla sunan GraphQL sunucusu ve playground.",
        features=["İlişkisel şema: User → Event → Location → Participant.",
                  "İnteraktif GraphQL Playground.",
                  "Şema gezgini ve örnek sorgular.",
                  "Veri seti yöneticisi."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "java-mylist-generic-sınıfı---enes-öztürk": dict(
        hat="Java · generics", teknoloji="React · TypeScript · Vite",
        one="Java'nın koleksiyon sınıfları kullanılmadan, dinamik dizi üzerine kurulu `MyList<T>` sınıfının sıfırdan yazımı.",
        features=["`add`, `get`, `remove`, `size` ve kapasite büyütme.",
                  "Bellek görselleştiricisi: dizi ve elemanların durumu.",
                  "Sınıfın kaynak kodunun adım adım gösterimi.",
                  "Sınır durumları ve hata yönetimi."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "java-stream-kitap-listesi---enes-öztürk": dict(
        hat="Java · Stream API", teknoloji="React · TypeScript · Vite",
        one="Java 102 kapsamında Stream API ve lambda ifadeleriyle kitap listesini dönüştürme, filtreleme ve gruplama ödevi.",
        features=["`stream().filter().map().collect()` zincirleri.",
                  "Map dönüştürme ve sayfa sayısına göre filtreleme.",
                  "Gruplama ve toplama işlemleri.",
                  "Her adımın çıktısının gösterimi."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "kitap-sıralayıcı": dict(
        hat="Java · Comparable & Comparator", teknoloji="React · TypeScript · Vite",
        one="`Comparable` ve `Comparator` arayüzleriyle `TreeSet` üzerinde kitap adı ve sayfa sayısına göre sıralama yapan görselleştirici.",
        features=["İsim ve sayfa sayısına göre iki sıralama ölçütü.",
                  "TreeSet'e ekleme sırasında oluşan ağaç yapısı.",
                  "Karşılaştırma adımlarının gösterimi.",
                  "Kaynak kod ve konsol çıktısı."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "klavye-hız-testi---enes-öztürk": dict(
        hat="React · zamanlayıcı", teknoloji="React · TypeScript · Vite",
        one="60 saniyelik testte kelime/dakika (WPM), doğruluk ve vuruş analizi ölçen yazma antrenmanı.",
        features=["Gerçek zamanlı WPM ve doğruluk hesabı.",
                  "Hatalı kelime ve seri takibi.",
                  "Süre sayacı ve test sonu özeti.",
                  "Yeniden başlatma ve metin havuzu."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "macera-oyunu---enes-öztürk": dict(
        hat="Java · oyun mantığı", teknoloji="React · TypeScript · Vite",
        one="Güvenli Ev, Mağara, Orman, Nehir ve Maden bölgelerinde geçen, savaş ve ganimet sistemli Java 102 macera oyunu.",
        features=["Beş bölge ve bölgeye özgü düşmanlar.",
                  "%50 ilk vuruş şansı ve hasar hesabı.",
                  "Dinamik ganimet ve mağaza.",
                  "Can, para ve envanter takibi."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "markdown-previewer-pro-—-enes-öztürk-signature": dict(
        hat="Metin işleme · editör", teknoloji="React · TypeScript · Vite",
        one="Soldan girilen Markdown'ı sağda anında ön izleyen, araç çubuğu ve kılavuz içeren editör.",
        features=["Anlık iki panelli ön izleme.",
                  "Başlık, kalın, liste ve kod ekleme araçları.",
                  "Markdown kılavuzu ve kısayollar.",
                  "Kopyalama ve temizleme."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "node.js-fs-modülü---ödev-4-_-enes-öztürk": dict(
        hat="Node.js · fs modülü", teknoloji="React · TypeScript · Vite",
        one="`fs` modülüyle dosya oluşturma, okuma, güncelleme ve silme adımlarını gösteren CRUD simülatörü.",
        features=["`writeFile`, `readFile`, `appendFile`, `unlink` akışları.",
                  "JSON dosyası üzerinde çalışan örnek veri.",
                  "Adım adım kod ve çıktı gösterimi.",
                  "Hata durumlarının ele alınması."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("node index.cjs", "konsol sürümü")],
    ),
    "node.js-komut-satırı---dairenin-alanı-_-enes-öztürk": dict(
        hat="Node.js · CLI", teknoloji="React · TypeScript · Vite",
        one="`process.argv` ile komut satırından yarıçap alıp dairenin alanını hesaplayan ödev; interaktif terminal ve geometrik görselleştirme eşliğinde.",
        features=["`process.argv` ile parametre okuma.",
                  "Girdi doğrulama ve Türkçe hata mesajları.",
                  "İnteraktif terminal simülasyonu.",
                  "Daire görselleştirmesi ve kaynak kod."],
        commands=[("node daireAlani.js 5", "alan hesabı"),
                  ("npm install", "bağımlılıklar"),
                  ("npm run dev", "http://localhost:3000")],
    ),
    "node.js-web-sunucusu-(ödev-5)---enes-öztürk": dict(
        hat="Node.js · http sunucusu", teknoloji="React · TypeScript · Vite",
        one="`http.createServer` ile 5000 portunda kalkan özel web sunucusu ödevi ve simülatörü.",
        features=["`createServer` ile istek/yanıt döngüsü.",
                  "HTML içerik ve başlık (header) yazımı.",
                  "Port 5000 üzerinde çalıştırma.",
                  "Kod rehberi ve konsol çıktısı."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "notesapp---enes-öztürk": dict(
        hat="React · durum yönetimi", teknoloji="React · TypeScript · Vite",
        one="Renkli, sabitlenebilir ve filtrelenebilir notlar için hızlı bir not alma uygulaması.",
        features=["Not ekleme, düzenleme ve silme.",
                  "Renk seçimi ve sabitleme.",
                  "Tümü / sabitlenen / renk filtreleri.",
                  "Arama ve yerel kalıcılık."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "paragraf-oluşturucu---enes-öztürk": dict(
        hat="Metin üretimi", teknoloji="React · TypeScript · Vite",
        one="Cümle ve paragraf sayısı seçilerek özelleştirilebilir metin ya da HTML çıktısı üreten araç.",
        features=["Cümle ve paragraf sayısı seçimi.",
                  "Düz metin veya HTML çıktısı.",
                  "Kopyala ve sıfırla.",
                  "Anında ön izleme."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "paslı-mağaza---envanter-yönetim-sistemi": dict(
        hat="Rust · envanter yönetimi", teknoloji="React · TypeScript · Vite",
        one="Rust mantığıyla kurgulanmış perakende envanteri: satış, satın alma, kâr analizi ve raporlama.",
        features=["Ürün ve stok kartları.",
                  "Satış ve satın alma kayıtları.",
                  "Kâr/maliyet analizi ve rapor görünümü.",
                  "Rust kaynak kodunun gösterimi."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "patika-turizm-acente-sistemi": dict(
        hat="Rezervasyon sistemi", teknoloji="React · TypeScript · Vite",
        one="Otel, dönem, oda ve fiyatlandırma üzerine kurulu arama ve rezervasyon yönetim platformu.",
        features=["Otel ve dönem bazlı oda listesi.",
                  "Tarih aralığına göre arama.",
                  "Sezon bazlı fiyatlandırma.",
                  "Rezervasyon ve doluluk görünümü."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "patikastore---ürün-yönetim-sistemi": dict(
        hat="CRUD · mağaza yönetimi", teknoloji="React · TypeScript · Vite",
        one="Elektronik mağazası için ürün, marka ve kategori yönetim sistemi.",
        features=["Ürün ekleme, düzenleme ve silme.",
                  "Marka ve kategori yönetimi.",
                  "Fiyat ve stok tablosu.",
                  "Arama ve filtreleme."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "php-dizi-filtreleyici-ve-rastgele-seçici": dict(
        hat="PHP · dizi fonksiyonları", teknoloji="React · TypeScript · Vite",
        one="`array_filter`, `array_rand` ve `array_map` ile boş değerleri temizleyip rastgele alt dizi üreten fonksiyon ve simülatörü.",
        features=["Boş değerlerin filtrelenmesi.",
                  "Rastgele eleman seçimi.",
                  "Dönüştürme ve yeniden indeksleme.",
                  "Adım adım çıktı gösterimi."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "post-sıralama-ve-post-ekleme---enes-öztürk": dict(
        hat="JavaScript · asenkron akış", teknoloji="React · TypeScript · Vite",
        one="Blog gönderilerini asenkron olarak sıralayan, yenisini ekleyen ve güncel listeyi yazdıran ödev.",
        features=["Promise zinciriyle sıralı işlem.",
                  "Gönderi ekleme ve listeleme.",
                  "Konsol çıktısının gösterimi.",
                  "Hata ve gecikme simülasyonu."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "react-emoji-search---test-paketi-&-canlı-koşucu": dict(
        hat="React · test", teknoloji="React · TypeScript · Vite",
        one="Emoji arama uygulaması ve React Testing Library ile yazılmış birim testleri; testler arayüzden canlı çalıştırılabilir.",
        features=["Başlık, liste ve filtreleme testleri.",
                  "Kopyalama davranışının testi.",
                  "Canlı test koşucusu ve sonuç paneli.",
                  "Test paketinin kaynak kodunun gösterimi."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "realtime-voting-app": dict(
        hat="GraphQL · gerçek zamanlı", teknoloji="React · TypeScript · Vite",
        one="GraphQL subscription'larıyla oyların anlık yayınlandığı oylama ve anket uygulaması.",
        features=["Anket oluşturma ve oy verme.",
                  "Sonuçların gerçek zamanlı güncellenmesi.",
                  "Yüzde çubukları ve toplam oy.",
                  "Sunucu tarafında GraphQL şeması."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "rick-ve-morty-karakter-portalı---enes-öztürk": dict(
        hat="GraphQL · API istemcisi", teknoloji="React · TypeScript · Vite",
        one="Rick and Morty GraphQL API'si üzerinden karakter arama, sayfalama ve filtreleme yapan portal.",
        features=["Ada göre arama.",
                  "Sayfa sayfa gezinme.",
                  "Durum, tür ve cinsiyet filtreleri.",
                  "Karakter detay görünümü."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "rust-bankacılık-sistemi-(traits-&-structs)---enes-öztürk": dict(
        hat="Rust · trait & struct", teknoloji="React · TypeScript · Vite",
        one="`trait` ve `struct` ile banka hesabı modelleyen; para yatırma, çekme ve bakiye sorgulama ödevi.",
        features=["`Hesap` trait'i ve `BankAccount` struct'ı.",
                  "Yatırma, çekme ve bakiye sorgulama.",
                  "Bakiye yetersizliği kontrolü.",
                  "Rust kaynak kodunun gösterimi."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "rust-enum-&-desen-eşleştirme-hesap-makinesi": dict(
        hat="Rust · enum & match", teknoloji="React · TypeScript · Vite",
        one="`enum` ve desen eşleştirme (`match`) ile çalışan interaktif hesap makinesi.",
        features=["`enum Islem` ile dört işlem.",
                  "`match` bloklarıyla dallanma.",
                  "Sıfıra bölme gibi hata durumları.",
                  "Adım adım kod gösterimi."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "rust-sahiplik-ve-referanslar-laboratuvarı": dict(
        hat="Rust · ownership", teknoloji="React · TypeScript · Vite",
        one="Sahiplik (ownership), ödünç alma (borrowing) ve string dilimlerini interaktif olarak deneyen eğitim ortamı.",
        features=["Sahiplik aktarımı ve ödünç alma senaryoları.",
                  "String dilimi (`&s[0..n]`) örnekleri.",
                  "Dize birleştirme ve bellek görselleştirmesi.",
                  "Hata mesajlarının açıklaması."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "rust-özel-filtreleme-laboratuvarı---enes-öztürk": dict(
        hat="Rust · impl metotları", teknoloji="React · TypeScript · Vite",
        one="Kapanış (closure) kullanmadan, `struct` ve `impl` metotlarıyla yazılmış özel filtreleme fonksiyonu ve simülatörü.",
        features=["Eşik değerine göre filtreleme.",
                  "`impl` bloğunda tanımlı metotlar.",
                  "Girdi/çıktı örnekleri.",
                  "Kaynak kodun adım adım gösterimi."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "sigorta-yönetim-sistemi": dict(
        hat="Java OOP · sigorta", teknoloji="React · TypeScript · Vite",
        one="Bireysel ve kurumsal müşteri profilleriyle çalışan, Java OOP mimarisine uygun sigorta yönetim sistemi.",
        features=["Müşteri, poliçe ve hasar kayıtları.",
                  "Bireysel / kurumsal profil ayrımı.",
                  "Prim ve ödeme takibi.",
                  "Raporlama görünümü."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "solana-sayaç-programı---enes-öztürk": dict(
        hat="Solana · Rust programı", teknoloji="React · TypeScript · Vite",
        one="u32 parametreli `Increment` ve `Decrement` talimatlarıyla sayaç tutan Solana programı ve simülatörü.",
        features=["Increment / Decrement talimatları.",
                  "u32 taşma (underflow) koruması.",
                  "Sözleşme çağrılarının simülasyonu.",
                  "Rust kaynak kodunun gösterimi."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "solana-token-transfer---enes-öztürk-ödevi": dict(
        hat="Solana · token transferi", teknoloji="React · TypeScript · Vite",
        one="Kaynak hesap bakiyesi yerine kullanıcı girdisiyle transfer yapan Solana/Rust token transferi ödevi.",
        features=["Miktar parametreli transfer talimatı.",
                  "Bakiye ve yetki kontrolleri.",
                  "`cargo test` senaryolarının gösterimi.",
                  "İşlem akışının simülasyonu."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "spend-bill-gates'-money": dict(
        hat="React · eğlence uygulaması", teknoloji="React · TypeScript · Vite",
        one="100 milyar dolarlık bütçeyle lüks ve absürt ürünler satın alma simülatörü.",
        features=["Canlı bakiye takibi.",
                  "Satın al / geri sat düğmeleri.",
                  "Sepet ve makbuz görünümü.",
                  "Sıfırlama ve baştan başlama."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "türkiye-hava-durumu-·-enes-öztürk": dict(
        hat="API entegrasyonu", teknoloji="React · TypeScript · Vite",
        one="81 il için 7 günlük hava durumu tahmini sunan, el emeği tasarımlı meteoroloji uygulaması.",
        features=["İl seçimi ve anlık durum.",
                  "7 günlük tahmin kartları.",
                  "Sıcaklık grafiği ve yağış olasılığı.",
                  "Mobil öncelikli yerleşim."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "web3-düşünce-egzersizi_-afet-yardımı-&-depin-analizi---enes-öztürk": dict(
        hat="Web3 · araştırma", teknoloji="React · TypeScript · Vite",
        one="Afet lojistiği ve şeffaf insani yardımda Web3, DePIN ve sıfır bilgi ispatlarının (ZKP) kullanımına dair teknik ve akademik analiz.",
        features=["Afet yardımı senaryoları ve aktör haritası.",
                  "DePIN altyapısı ve donanım gereksinimleri.",
                  "ZKP ile mahremiyet ve şeffaflık dengesi.",
                  "Riskler, maliyetler ve sonuç değerlendirmesi."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "ödev-3_-daire-modülü---enes-öztürk": dict(
        hat="Node.js · modül sistemi", teknoloji="React · TypeScript · Vite",
        one="`circleArea` ve `circleCircumference` fonksiyonlarını CommonJS ile dışa aktaran daire modülü ödevi.",
        features=["`module.exports` ile dışa aktarma.",
                  "`require` ve nesne ayrıştırma (destructuring).",
                  "Alan ve çevre hesabı örnekleri.",
                  "Modül yapısının anlatımı."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "kariyerportalı---i̇ş-bulma-&-i̇lan-sistemi": dict(
        hat="Kurumsal mimari · iş bulma platformu", teknoloji="React · TypeScript · Vite · katmanlı mimari",
        one="Aday ve şirket panellerini tek platformda toplayan kurumsal iş bulma sistemi: ilan, başvuru, filtreleme ve denetim kaydı; katmanlı mimari, OOP ve S.O.L.I.D ilkeleriyle kurgulanmış.",
        features=["**Aday portalı** — profil, ilan arama, filtreleme ve başvuru.",
                  "**Şirket portalı** — ilan yayınlama ve başvuru değerlendirme.",
                  "**Tasarım desenleri** — Repository, Factory, Builder ve Strategy (`src/core/patterns`).",
                  "**Katman ayrımı** — entities · repositories · services · security · types.",
                  "**Belge görünümleri** — UML/EER diyagramları, Swagger görünümü ve denetim kaydı."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi"), ("npm run lint", "tsc --noEmit")],
    ),
    "i̇nsan-kaynakları-yönetim-sistemi-(hrms)---enes-öztürk": dict(
        hat="Kurumsal mimari · insan kaynakları", teknoloji="React · TypeScript · Vite · katmanlı mimari",
        one="Spring Boot katmanlı mimarisi ve S.O.L.I.D ilkeleri örnek alınarak kurulmuş insan kaynakları portalı: personel, izin, maaş ve denetim kaydı tek panelde.",
        features=["**Admin / User rolleri** — yetkiye göre açılan ekranlar.",
                  "**Personel yönetimi** — kayıt, güncelleme, departman ve pozisyon.",
                  "**İzin ve maaş modülleri** — talep, onay ve dönem takibi.",
                  "**Veritabanı + dosya I/O** — kalıcılık iki katmanda (`src/core/database.ts`, `stream.ts`).",
                  "**Denetim kaydı** ve UML/EER diyagram görünümleri."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi"), ("npm run lint", "tsc --noEmit")],
    ),
    "öztürk-bank-atm-&-çekirdek-bankacılık-sistemi": dict(
        hat="Kurumsal mimari · bankacılık", teknoloji="React · TypeScript · Vite · katmanlı mimari",
        one="Çekirdek bankacılık mantığını iki arayüzde sunan sistem: fiziksel ATM terminali ve yönetim portalı; OOP, S.O.L.I.D ve katmanlı mimari üzerine kurulu.",
        features=["**ATM terminali** — kart girişi, bakiye, para yatırma/çekme ve transfer.",
                  "**Yönetim portalı** — müşteri, hesap ve işlem yönetimi.",
                  "**Çevrimiçi bankacılık** — rol bazlı yetkilendirme.",
                  "**Çekirdek katman** — `Optional`, `Stream`, Strategy, Factory ve özel istisnalar.",
                  "**EER / UML diyagramları** ve dosya I/O kalıcılığı."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi"), ("npm run lint", "tsc --noEmit")],
    ),
    "quick-sort-java---enes-öztürk": dict(
        hat="Java · algoritma analizi", teknoloji="React · TypeScript · Vite",
        one="Quick Sort (hızlı sıralama) algoritmasının Java uygulaması; diziyi adım adım sıralayan görselleştirici, karşılaştırma/takas sayaçları ve karmaşıklık analiziyle birlikte.",
        features=["**Adım adım görselleştirme** — pivot seçimi, bölümleme ve birleştirme.",
                  "**Sayaçlar** — karşılaştırma ve takas sayısı, geçen adım.",
                  "**Karmaşıklık analizi** — ortalama `O(n log n)`, en kötü `O(n²)`.",
                  "**Kod görüntüleyici** — Java kaynak kodunun vurgulanmış hâli.",
                  "Girdi havuzu ve rastgele dizi üretimi."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi"), ("npm run lint", "tsc --noEmit")],
    ),
    "movie-store-webapi---enes-öztürk": dict(
        hat="REST API · Clean Architecture", teknoloji="React · TypeScript · Vite + Node/TS API",
        one="Film mağazası için katmanlı RESTful WebAPI ve ona bağlı mağaza arayüzü: film listesi, sepet, sipariş, kimlik doğrulama ve entegre API test konsolu.",
        features=["**Katmanlar** — `server/controllers · services · di · dtos · mapping · validation`.",
                  "**DTO + AutoMapper** ile model dönüşümü, **FluentValidation** ile kural doğrulama.",
                  "**JWT kimlik doğrulama** ve rol bazlı yönetim paneli.",
                  "**Sipariş & satın alma** akışı ve stok kontrolü.",
                  "**API Explorer**, canlı log görüntüleyici ve birim test koşucusu."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000 — API + arayüz aynı portta"),
                  ("npm run build", "üretim derlemesi"), ("npm start", "tsx server.ts")],
    ),
    "öztürk-bank-atm-&-kurumsal-bankacılık-sistemi": dict(
        hat="Kurumsal mimari · bankacılık", teknoloji="React · TypeScript · Vite · katmanlı mimari",
        one="ATM arayüzü ile müşteri ve yönetici panellerini tek sistemde birleştiren kurumsal bankacılık uygulaması; katmanlı mimari, OOP ve tasarım desenleri üzerine kurulu.",
        features=["**ATM arayüzü** — giriş, para yatırma/çekme, havale ve makbuz.",
                  "**Admin & müşteri rolleri** — yetkiye göre açılan paneller.",
                  "**3 hatalı giriş koruması** — hesap kilitleme ve uyarı.",
                  "**Tasarım desenleri** ve `src/core` katman ayrımı.",
                  "**EER / UML diyagramları** ve Spring Boot mimari görünümü."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi"), ("npm run lint", "tsc --noEmit")],
    ),
    "e-ticaret-müşteri-segmentasyonu-ve-satış-tahminleme-motoru": dict(
        hat="Veri analitiği · satış tahminleme", teknoloji="React · TypeScript · Vite",
        one="E-ticaret verisini SQL'den başlayıp RFM segmentasyonuna ve satış tahminine taşıyan uçtan uca analitik motor; dört modül hâlinde adım adım işleyen bir çalışma tezgâhı.",
        features=["**Modül 1 — SQL temizleme** — ham veri, tekrarlar ve boş değerler.",
                  "**Modül 2 — EDA & istatistik** — dağılımlar, korelasyon ve özet metrikler.",
                  "**Modül 3 — RFM segmentasyonu & tahmin** — şampiyon, sadık, riskli, kayıp müşteri grupları.",
                  "**Modül 4 — hikâye anlatımı** — bulguların yönetici diline çevrilmesi.",
                  "AI analiz asistanı ve yönetici özeti raporu."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi"), ("npm run lint", "tsc --noEmit")],
    ),
    "online-cv-&-i̇k-yönetim-sistemi": dict(
        hat="Kurumsal mimari · İK & özgeçmiş", teknoloji="React · TypeScript · Vite · katmanlı mimari",
        one="Özgeçmiş oluşturma ile insan kaynakları yönetimini aynı portalda birleştiren sistem; S.O.L.I.D, OOP ve Clean Code ilkeleriyle katmanlı olarak kurgulanmış.",
        features=["**Aday paneli** — özgeçmiş oluşturma, düzenleme ve görüntüleme.",
                  "**HR paneli** — başvuru, pozisyon ve değerlendirme akışı.",
                  "**Katmanlar** — `core · repositories · patterns · services · database`.",
                  "**Stream API** benzeri koleksiyon işlemleri ve Repository deseni.",
                  "**Denetim kaydı** ve UML diyagram görünümü."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi"), ("npm run lint", "tsc --noEmit")],
    ),
    "akıllı-bankacılık-ve-kredi-risk-analiz-sistemi": dict(
        hat="Bankacılık · veri yapıları", teknoloji="React · TypeScript · Vite",
        one="Hesap işlemlerini Stack/Queue veri yapılarıyla yürüten, dinamik faiz ve risk skoru üreten akıllı bankacılık simülatörü.",
        features=["**Modül 1 — hesaplar** — açılış, bakiye ve hareketler.",
                  "**Modül 2 — veri yapıları** — işlem kuyruğu (Queue) ve geçmiş yığını (Stack).",
                  "**Modül 3 — kredi risk motoru** — dinamik faiz, limit ve risk skoru.",
                  "**Modül 4 — loglama** — Git destekli dosya kaydı ve terminal görünümü.",
                  "Mimari görünümü ve LinkedIn paylaşım kartı."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi"), ("npm run lint", "tsc --noEmit")],
    ),
    "site-ve-rezidans-yönetim-sistemi": dict(
        hat="Yönetim paneli · aidat & fatura", teknoloji="React · TypeScript · Vite",
        one="Daire, sakin, aylık aidat ve elektrik/su/doğalgaz faturalarını tek panelde toplayan site ve rezidans yönetim sistemi; borç-alacak mizanı ve kredi kartı ödeme akışıyla.",
        features=["**Yönetici paneli** — daire, sakin ve borç yönetimi.",
                  "**Sakin paneli** — aidat ve fatura görüntüleme, ödeme.",
                  "**Borç-alacak mizanı** — dönem bazlı özet.",
                  "**Kredi kartı ödeme servisi** ve makbuz görünümü.",
                  "Mimari görünüm ve veri modeli notları."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi"), ("npm run lint", "tsc --noEmit")],
    ),
    "nodejs/odev-1": dict(
        hat="Node.js · asenkron API", teknoloji="React · TypeScript · Vite",
        one="JSONPlaceholder API'sinden bir kullanıcıyı ve gönderilerini Axios ile asenkron çekip tek nesnede birleştiren ödev.",
        features=["Axios ile paralel iki istek.",
                  "`async/await` ve `Promise.all` kullanımı.",
                  "Gelen verilerin tek nesnede birleştirilmesi.",
                  "Hata yönetimi ve konsol çıktısı."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
    "react/odev-2": dict(
        hat="React · durum yönetimi", teknoloji="React · TypeScript · Vite",
        one="Görev ekleme, tamamlama ve silme akışını iki farklı görünüm modunda sunan Todo uygulaması.",
        features=["Görev ekleme, tamamlama ve silme.",
                  "Liste ve kart görünümü.",
                  "Tamamlananları toplu temizleme.",
                  "Kalan görev sayacı."],
        commands=[("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                  ("npm run build", "üretim derlemesi")],
    ),
}

DEFAULT_COMMANDS = [("npm install", "bağımlılıklar"), ("npm run dev", "http://localhost:3000"),
                    ("npm run build", "üretim derlemesi")]


def read_meta(folder: pathlib.Path) -> tuple[str, str]:
    meta = folder / "metadata.json"
    if meta.exists():
        data = json.loads(meta.read_text(encoding="utf-8"))
        return data.get("name") or folder.name, (data.get("description") or "").strip()
    pkg = folder / "package.json"
    return folder.name, ""


def old_future_block(path: pathlib.Path) -> str:
    if not path.exists():
        return ""
    text = path.read_text(encoding="utf-8", errors="ignore")
    marker = "## Gelecek adımlar"
    if marker in text:
        block = text.split(marker, 1)[1]
        block = block.split("\n## ", 1)[0]
        lines = [ln for ln in block.strip().splitlines() if ln.strip()]
        return "\n".join(lines)
    return ""


def build_readme(slug: str) -> str:
    folder = ROOT / slug
    name, desc = read_meta(folder)
    info = DETAILS.get(slug, {})
    hat = info.get("hat", "React uygulaması")
    teknoloji = info.get("teknoloji", "React · TypeScript · Vite")
    one = info.get("one", desc)
    features = info.get("features", [])
    commands = info.get("commands", DEFAULT_COMMANDS)
    future = old_future_block(folder / "README.md")
    src = folder / "src"

    out: list[str] = []
    a = out.append
    a(f"# {name}")
    a("")
    a(f"![{name} — kapak](docs/cover.svg)")
    a("")
    a(f"> **Patika.dev arşivi · {hat}** — tasarım ve geliştirme: **Enes Öztürk**")
    a("")
    a("---")
    a("")
    a(one)
    a("")
    a("## Öne çıkanlar")
    a("")
    for f in features:
        a(f"- {f}")
    a("")
    a("## Teknoloji")
    a("")
    a(f"{teknoloji}. Her klasör kendi `package.json`'ına sahip bağımsız bir projedir; "
      "kök dizinde kurulum yapılmaz.")
    a("")
    a("## Kurulum ve çalıştırma")
    a("")
    a("```bash")
    a(f"cd \"{slug}\"")
    for cmd, _ in commands[:2]:
        a(cmd)
    a("```")
    a("")
    a("| Komut | Not |")
    a("| --- | --- |")
    for cmd, note in commands:
        a(f"| `{cmd}` | {note} |")
    a("")
    if src.exists():
        dirs = sorted(p.name for p in src.iterdir() if p.is_dir())
        a("## Proje yapısı")
        a("")
        a("```")
        a(f"{slug.split('/')[-1]}/")
        a("├── index.html")
        a("├── package.json")
        a("├── docs/cover.svg            # imza kapak")
        a("└── src/")
        a("    ├── App.tsx               # ekranların birleştiği yer")
        a("    ├── main.tsx")
        if dirs:
            for i, d in enumerate(dirs[:6]):
                prefix = "    └── " if i == len(dirs[:6]) - 1 else "    ├── "
                a(f"{prefix}{d}/")
        a("```")
        a("")
    if future:
        a("## Gelecek adımlar")
        a("")
        a(future)
        a("")
    a("## Lisans")
    a("")
    a("Ödev ve portföy amaçlı çalışma; tüm hakları **Enes Öztürk**'e aittir.")
    a("")
    return "\n".join(out)


def main() -> None:
    dry = "--dry-run" in sys.argv
    targets = []
    for slug in DETAILS:
        folder = ROOT / slug
        if folder.is_dir():
            targets.append(slug)
    written = []
    for slug in targets:
        path = ROOT / slug / "README.md"
        text = build_readme(slug)
        if dry:
            print(f"· {slug}  ({len(text.split())} kelime)")
            continue
        path.write_text(text, encoding="utf-8")
        written.append(slug)
    if dry:
        print(f"\n{len(targets)} README üretilecek")
    else:
        print(f"✓ {len(written)} README yazıldı")


if __name__ == "__main__":
    main()
