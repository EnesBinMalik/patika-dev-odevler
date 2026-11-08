"""Enes Öztürk · Patika.dev arşivi — imza kapak üreteci.

Kullanım:
    python tools_cover.py            # eksik kapakları üretir
    python tools_cover.py --force    # hepsini yeniden üretir

Her proje için: <proje>/docs/cover.svg  (1280x640)
Depo kapağı:    docs/social-preview.png (1280x640, GitHub > Settings > Social preview)
"""

from __future__ import annotations

import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent
FONT_STACK = "'Segoe UI',Inter,system-ui,-apple-system,'Helvetica Neue',Arial,sans-serif"
MONO_STACK = "'JetBrains Mono','Cascadia Code',Consolas,'SF Mono',monospace"

# ——— palet ———
INK = "#E9F0FB"
DIM = "#8FA0BD"
FAINT = "#5A6B88"
CYAN = "#22D3EE"
VIOLET = "#A78BFA"
AMBER = "#FBBF24"
GREEN = "#4ADE80"
PANEL = "#0B1420"
PANEL2 = "#0E1A2A"
EDGE = "#1E3050"

# ——— proje kataloğu ———
# (klasör, başlık, alt başlık, etiket, vurgu, bölüm, dosya izi, üst veri, satırlar)
CATALOG = [
    # 1 — Node.js temelleri & CLI
    ("nodejs/odev-1", "Node.js Ödev 1", "Axios ile asenkron veri birleştirme",
     "NODE.JS · CLI", CYAN, "Node.js temelleri & CLI", "nodejs/odev-1", "Node.js · Axios · Vite",
     ["$ node src/app.js", "→ GET jsonplaceholder/users/1", "→ GET jsonplaceholder/posts?userId=1", "✓ tek nesnede birleşti  ·  async/await"]),
    ("ödev-3_-daire-modülü---enes-öztürk", "Ödev 3 — Daire Modülü", "CommonJS module.exports & destructuring",
     "NODE.JS · CLI", CYAN, "Node.js temelleri & CLI", "ödev-3_-daire-modülü---enes-öztürk", "Node.js · CommonJS",
     ["const { circleArea, circleCircumference } = require('./circle');", "circleArea(5)              → 78.5398", "circleCircumference(5)     → 31.4159", "✓ module.exports · require · destructuring"]),
    ("node.js-fs-modülü---ödev-4-_-enes-öztürk", "Node.js FS Modülü", "Dosya sistemiyle CRUD simülatörü",
     "NODE.JS · CLI", CYAN, "Node.js temelleri & CLI", "node.js-fs-modülü---ödev-4-_-enes-öztürk", "Node.js · fs · Vite",
     ["fs.writeFile('employees.json', data, cb)", "fs.readFile('employees.json', 'utf8', cb)", "fs.appendFile / fs.unlink", "✓ oluştur · oku · güncelle · sil"]),
    ("node.js-web-sunucusu-(ödev-5)---enes-öztürk", "Node.js Web Sunucusu", "http.createServer ile ilk sunucu",
     "NODE.JS · CLI", CYAN, "Node.js temelleri & CLI", "node.js-web-sunucusu-(ödev-5)---enes-öztürk", "Node.js · http",
     ["http.createServer((req, res) => {", "  res.writeHead(200, {'Content-Type':'text/html'})", "  res.end('<h1>Hoş geldiniz</h1>')", "}).listen(5000)   // → localhost:5000"]),
    ("node.js-komut-satırı---dairenin-alanı-_-enes-öztürk", "Komut Satırı — Dairenin Alanı", "process.argv ile parametre okuma",
     "NODE.JS · CLI", CYAN, "Node.js temelleri & CLI", "node.js-komut-satırı---dairenin-alanı-_-enes-öztürk", "Node.js · process.argv",
     ["$ node daireAlani.js 5", "Yarıçap: 5  ·  Alan: 78.54", "$ node daireAlani.js 12.5", "Yarıçap: 12.5  ·  Alan: 490.87"]),
    ("koa.js-web-sunucusu---ödev-6", "Koa.js Web Sunucusu", "Router ile çok sayfalı sunucu",
     "NODE.JS · CLI", CYAN, "Node.js temelleri & CLI", "koa.js-web-sunucusu---ödev-6", "Koa.js · @koa/router",
     ["router.get('/', ctx => ctx.body = 'Ana Sayfa')", "router.get('/hakkimda', ...)", "router.get('/iletisim', ...)", "✓ / · /hakkimda · /iletisim  →  :3000"]),

    # 2 — GraphQL & gerçek zamanlı
    ("graphql-sunucusu---ödev-1-(enes-öztürk)", "GraphQL Sunucusu", "İlişkisel şema · Playground · şema gezgini",
     "GRAPHQL · REALTIME", VIOLET, "GraphQL & gerçek zamanlı", "graphql-sunucusu---ödev-1-(enes-öztürk)", "GraphQL · Express · Vite",
     ["type User { id: ID!  name: String  events: [Event] }", "type Event { id: ID!  title: String  location: Location }", "type Query { users: [User]  events: [Event] }", "→ /graphql  ·  interaktif playground"]),
    ("graphql-event-manager---ödev-2-(enes-öztürk)", "GraphQL Event Manager", "Mutation ödevi · tekli ve toplu silme",
     "GRAPHQL · REALTIME", VIOLET, "GraphQL & gerçek zamanlı", "graphql-event-manager---ödev-2-(enes-öztürk)", "GraphQL · Apollo · Vite",
     ["mutation { createUser(name: \"Enes\") { id } }", "mutation { updateEvent(id: 1, title: \"Yeni\") { id } }", "mutation { deleteParticipants(ids: [1,2,3]) }", "✓ user · event · location · participant"]),
    ("graphql-subscriptions-studio---enes-öztürk", "GraphQL Subscriptions Studio", "Gerçek zamanlı veri akışı laboratuvarı",
     "GRAPHQL · REALTIME", VIOLET, "GraphQL & gerçek zamanlı", "graphql-subscriptions-studio---enes-öztürk", "GraphQL · WS · Vite",
     ["subscription { userCreated { id name } }", "subscription { eventCreated { id title } }", "subscription { participantAdded { id } }", "↯ canlı yayın  ·  interaktif test paneli"]),
    ("countries-graphql-api---enes-öztürk", "Countries GraphQL API", "Kıta · ülke · dil ilişkileri",
     "GRAPHQL · REALTIME", VIOLET, "GraphQL & gerçek zamanlı", "countries-graphql-api---enes-öztürk", "GraphQL · Express",
     ["query { continent(code: \"EU\") { name  countries { name } } }", "query { country(code: \"TR\") { name  languages { name } } }", "→ playground + şema gezgini", "✓ 7 kıta · 250 ülke · 200+ dil"]),
    ("eventhub---apollo-client-&-graphql-etkinlik-portalı", "EventHub", "Apollo Client & GraphQL etkinlik portalı",
     "GRAPHQL · REALTIME", VIOLET, "GraphQL & gerçek zamanlı", "eventhub---apollo-client-&-graphql-etkinlik-portalı", "React · Apollo · GraphQL",
     ["useQuery(GET_EVENTS)     → etkinlik listesi", "useMutation(JOIN_EVENT)   → katılım", "cache-first  ·  optimistic UI", "✓ Apollo cache · loading & error durumları"]),
    ("rick-ve-morty-karakter-portalı---enes-öztürk", "Rick & Morty Portalı", "GraphQL ile arama, sayfalama, filtre",
     "GRAPHQL · REALTIME", VIOLET, "GraphQL & gerçek zamanlı", "rick-ve-morty-karakter-portalı---enes-öztürk", "React · GraphQL · Vite",
     ["query { characters(page: 2, filter: {name: \"Rick\"}) {", "  results { name  status  species } } }", "← önceki     1 / 42     sonraki →", "✓ durum · tür · cinsiyet filtreleri"]),
    ("realtime-voting-app", "Realtime Voting App", "GraphQL subscription ile canlı oylama",
     "GRAPHQL · REALTIME", VIOLET, "GraphQL & gerçek zamanlı", "realtime-voting-app", "GraphQL · WS · React",
     ["subscription { voteAdded { pollId option } }", "React  ██████████████░░░░  58%", "Vue    ███████░░░░░░░░░░░  27%", "↯ oylar gerçek zamanlı yayınlanır"]),
    ("anonymous-chat---graphql-&-redis-pubsub", "Anonymous Chat", "GraphQL & Redis PubSub ile anonim sohbet",
     "GRAPHQL · REALTIME", VIOLET, "GraphQL & gerçek zamanlı", "anonymous-chat---graphql-&-redis-pubsub", "GraphQL · Redis · React",
     ["publish('MESSAGE_ADDED', { room, text })", "subscribe('MESSAGE_ADDED', handler)", "oda: #genel  ·  kullanıcı: misafir-42", "↯ Redis PubSub üzerinden anlık iletim"]),
    ("gerçek-zamanlı-etkinlik-ve-katılımcı-takip-sistemi", "Etkinlik & Katılımcı Takibi", "Anlık listeleme ve katılım sayacı",
     "GRAPHQL · REALTIME", VIOLET, "GraphQL & gerçek zamanlı", "gerçek-zamanlı-etkinlik-ve-katılımcı-takip-sistemi", "React · Context · Express",
     ["etkinlikler  ·  3 açık", "React Summit      128 katılımcı  ↑", "GraphQL Workshop   64 katılımcı  ↑", "✓ anlık güncellenen katılım sayacı"]),

    # 3 — Clean Blog serisi
    ("clean-blog---ödev-7", "Clean Blog — Ödev 7", "Express sunucusu & ilk yapılandırma",
     "EXPRESS · MONGODB", GREEN, "Clean Blog — Express & MongoDB", "clean-blog---ödev-7", "Node.js · Express · EJS",
     ["const express = require('express');", "app.set('view engine', 'ejs');", "app.use(express.static('public'));", "app.listen(3000)  // ✓ ilk sunucu"]),
    ("clean-blog---enes-öztürk-(ödev-9)", "Clean Blog — Ödev 9", "Mongoose bağlantısı · Post modeli · req.body",
     "EXPRESS · MONGODB", GREEN, "Clean Blog — Express & MongoDB", "clean-blog---enes-öztürk-(ödev-9)", "Node.js · Mongoose · EJS",
     ["mongoose.connect('mongodb://localhost/cleanblog-test-db')", "const Post = mongoose.model('Post', postSchema)", "app.post('/posts', (req, res) => {", "  Post.create(req.body)  →  ✓ kayıt"]),
    ("clean-blog---ödev-10-(enes-öztürk)", "Clean Blog — Ödev 10", "Tekil post sayfası /posts/:id",
     "EXPRESS · MONGODB", GREEN, "Clean Blog — Express & MongoDB", "clean-blog---ödev-10-(enes-öztürk)", "Node.js · Mongoose · EJS",
     ["app.get('/posts/:id', async (req, res) => {", "  const post = await Post.findById(req.params.id);", "  res.render('post', { post });", "})   // index.ejs  →  post.ejs"]),
    ("clean-blog---ödev-11-(mvc,-update-&-delete)", "Clean Blog — Ödev 11", "MVC mimarisi · güncelle & sil",
     "EXPRESS · MONGODB", GREEN, "Clean Blog — Express & MongoDB", "clean-blog---ödev-11-(mvc,-update-&-delete)", "Node.js · Express · MVC",
     ["controllers/postController.js", "PUT     /posts/:id   →  findByIdAndUpdate", "DELETE  /posts/:id   →  findByIdAndRemove", "✓ controllers · models · routes ayrımı"]),
    ("clean-blog---ödev-12-(bölüm-6)", "Clean Blog — Ödev 12", "MongoDB Atlas & Heroku dağıtımı",
     "EXPRESS · MONGODB", GREEN, "Clean Blog — Express & MongoDB", "clean-blog---ödev-12-(bölüm-6)", "Node.js · Atlas · Heroku",
     ["MONGO_URI=mongodb+srv://…/cleanblog-prod", "heroku config:set MONGO_URI=…", "git push heroku main", "✓ bulutta canlı veritabanı  ·  dağıtım"]),
    ("post-sıralama-ve-post-ekleme---enes-öztürk", "Post Sıralama & Ekleme", "Asenkron blog akışı",
     "EXPRESS · MONGODB", GREEN, "Clean Blog — Express & MongoDB", "post-sıralama-ve-post-ekleme---enes-öztürk", "JavaScript · Async",
     ["getPosts() → sortPosts() → addPost() → listPosts()", "Promise zinciri  ·  sıralı çıktı", "1. En yeni başlık", "✓ güncel liste konsolda"]),

    # 4 — Java
    ("java-multithreading-ödevi---enes-öztürk", "Java Multithreading", "4 thread · tek & çift listeler",
     "JAVA · OOP", AMBER, "Java", "java-multithreading-ödevi---enes-öztürk", "Java · Thread · OOP",
     ["Thread-1  →  1…2500", "Thread-2  →  2501…5000", "tek[]: 5000  ·  çift[]: 5000", "✓ 1…10000 dört iş parçacığıyla ayrıldı"]),
    ("java-mylist-generic-sınıfı---enes-öztürk", "MyList&lt;T&gt; Generic Sınıfı", "Dinamik dizi · sıfırdan koleksiyon",
     "JAVA · OOP", AMBER, "Java", "java-mylist-generic-sınıfı---enes-öztürk", "Java · Generics",
     ["class MyList<T> { T[] items; int size; }", "add(T)  ·  get(i)  ·  remove(i)  ·  size()", "capacity 10 → 20 → 40   (x2 büyüme)", "✓ ArrayList taklidi  ·  bellek görselleştirici"]),
    ("java-stream-kitap-listesi---enes-öztürk", "Java Stream — Kitap Listesi", "Stream API & lambda ifadeleri",
     "JAVA · OOP", AMBER, "Java", "java-stream-kitap-listesi---enes-öztürk", "Java · Stream API",
     ["books.stream()", "     .filter(b -> b.getPages() > 100)", "     .map(Book::getTitle)", "     .collect(Collectors.toList())"]),
    ("kitap-sıralayıcı", "Kitap Sıralayıcı", "Comparable & Comparator · TreeSet",
     "JAVA · OOP", AMBER, "Java", "kitap-sıralayıcı", "Java · Comparable",
     ["TreeSet<Book> set = new TreeSet<>();", "compareTo(Book o)  →  ada göre", "Comparator.comparing(Book::getPages)", "✓ isim  ·  sayfa sayısı sıralaması"]),
    ("macera-oyunu---enes-öztürk", "Macera Oyunu", "Java 102 · bölgeler, savaş, ganimet",
     "JAVA · OOP", AMBER, "Java", "macera-oyunu---enes-öztürk", "Java · OOP · Console",
     ["Güvenli Ev  ·  Mağara  ·  Orman  ·  Nehir  ·  Maden", "ilk vuruş şansı %50  ·  dinamik ganimet", "can 100  ·  para 10  ·  hasar 5", "✓ bölge & düşman yönetimi"]),
    ("enes-öztürk---bilimsel-hesap-makinesi", "Bilimsel Hesap Makinesi", "Hazır sınıf yok · sıfırdan matematik",
     "JAVA · OOP", AMBER, "Java", "enes-öztürk---bilimsel-hesap-makinesi", "Java · OOP · Math",
     ["√ · x² · sin · cos · tan · log", "türev     f(x) = 3x²  →  f'(x) = 6x", "integral  ∫₀² x² dx = 2.667", "✓ tüm matematik elle kodlandı"]),

    # 5 — Rust
    ("rust-bankacılık-sistemi-(traits-&-structs)---enes-öztürk", "Rust Bankacılık — Traits", "trait Hesap · struct BankAccount",
     "RUST · SOLANA", "#F97316", "Rust & Solana", "rust-bankacılık-sistemi-(traits-&-structs)---enes-öztürk", "Rust · Traits",
     ["trait Hesap { fn yatir(&mut self, m: f64); }", "struct BankAccount { bakiye: f64 }", "impl Hesap for BankAccount { … }", "✓ yatır · çek · bakiye sorgula"]),
    ("rust-bankacılık-sistemi-&-hata-yönetimi", "Rust Bankacılık — Hata Yönetimi", "Result&lt;(), String&gt; & match",
     "RUST · SOLANA", "#F97316", "Rust & Solana", "rust-bankacılık-sistemi-&-hata-yönetimi", "Rust · Result",
     ["fn cek(&mut self, m: f64) -> Result<(), String> {", "  if m > self.bakiye { Err(\"Yetersiz bakiye\") }", "  else { Ok(()) } }", "match sonuc { Ok(_) => …, Err(e) => … }"]),
    ("rust-enum-&-desen-eşleştirme-hesap-makinesi", "Rust Enum Hesap Makinesi", "enum & pattern matching",
     "RUST · SOLANA", "#F97316", "Rust & Solana", "rust-enum-&-desen-eşleştirme-hesap-makinesi", "Rust · Enum",
     ["enum Islem { Topla, Cikar, Carp, Bol }", "match islem {", "  Islem::Topla => a + b,", "  Islem::Bol   => a / b }"]),
    ("rust-sahiplik-ve-referanslar-laboratuvarı", "Rust Sahiplik Laboratuvarı", "ownership · borrowing · slices",
     "RUST · SOLANA", "#F97316", "Rust & Solana", "rust-sahiplik-ve-referanslar-laboratuvarı", "Rust · Ownership",
     ["let s1 = String::from(\"Enes\");", "let s2 = &s1;        // ödünç alma", "let dilim = &s2[0..2]; // string dilimi", "✓ tek sahip · çoklu okuma referansı"]),
    ("rust-özel-filtreleme-laboratuvarı---enes-öztürk", "Rust Özel Filtreleme", "Closure yok · struct + impl",
     "RUST · SOLANA", "#F97316", "Rust & Solana", "rust-özel-filtreleme-laboratuvarı---enes-öztürk", "Rust · impl",
     ["struct Filtre { esik: i32 }", "impl Filtre { fn uygula(&self, v: &[i32]) -> Vec<i32> {", "  v.iter().filter(|x| **x > self.esik).cloned().collect() } }", "✓ kapanış kullanılmadı"]),
    ("paslı-mağaza---envanter-yönetim-sistemi", "Paslı Mağaza", "Rust envanter, satış & kâr analizi",
     "RUST · SOLANA", "#F97316", "Rust & Solana", "paslı-mağaza---envanter-yönetim-sistemi", "Rust · Envanter",
     ["stok   ·   satın alma   ·   satış", "kâr = satış − maliyet   →  %23.4", "rapor: günlük / ürün / kategori", "✓ perakende yönetim çekirdeği"]),
    ("solana-sayaç-programı---enes-öztürk", "Solana Sayaç Programı", "u32 Increment & Decrement",
     "RUST · SOLANA", "#F97316", "Rust & Solana", "solana-sayaç-programı---enes-öztürk", "Solana · Rust",
     ["pub fn increment(ctx: Context<Sayac>, veri: u32)", "pub fn decrement(ctx: Context<Sayac>, veri: u32)", "underflow koruması: checked_sub", "✓ u32 sınır güvenliği"]),
    ("solana-token-transfer---enes-öztürk-ödevi", "Solana Token Transfer", "Kullanıcı girdili transfer",
     "RUST · SOLANA", "#F97316", "Rust & Solana", "solana-token-transfer---enes-öztürk-ödevi", "Solana · Rust",
     ["transfer(ctx, miktar: u64)", "kaynak bakiyesi yerine kullanıcı girdisi", "cargo test  →  ✓ 4/4 geçti", "✓ SPL token transferi"]),
    ("solana-restaurant-review-dapp-&-smart-contract", "Solana Restaurant Review", "dApp & akıllı sözleşme",
     "RUST · SOLANA", "#F97316", "Rust & Solana", "solana-restaurant-review-dapp-&-smart-contract", "Solana · Anchor · React",
     ["#[account] pub struct Review { puan: u8, konum: String }", "PDA: seeds = [restaurant, yorumcu]", "Borsh serileştirme  ·  cüzdan bağlantısı", "✓ konum parametreli yorum sözleşmesi"]),

    # 6 — Algoritma & arayüz
    ("3-ile-bölünebilme-hesaplayıcı", "3 ile Bölünebilme", "Kalan, ilk kat ve Türkçe bağlaç",
     "ALGORİTMA · UI", "#38BDF8", "Algoritma & arayüz", "3-ile-bölünebilme-hesaplayıcı", "React · TypeScript · Vite",
     ["sayı 4   →   kalan 1   →   ilk kat 6", "((4 % 3) + 3) % 3 = 1", "6'dır  ·  12'dir  ·  100'dür", "✓ ünlü uyumlu bağlaç motoru"]),
    ("döngülerle-üçgen-çizme---enes-öztürk", "Döngülerle Üçgen Çizme", "for & while ile parametrik desen",
     "ALGORİTMA · UI", "#38BDF8", "Algoritma & arayüz", "döngülerle-üçgen-çizme---enes-öztürk", "JavaScript · Döngüler",
     ["for (let i = 1; i <= n; i++) {", "  console.log(' '.repeat(n - i) + '*'.repeat(2 * i - 1))", "}", "n = 5   →   ▲ 9 satır desen"]),
    ("geometrik-şekiller-oop-ödevi---enes-öztürk", "Geometrik Şekiller OOP", "Sekil · Dikdortgen · Kare · Ucgen",
     "ALGORİTMA · UI", "#38BDF8", "Algoritma & arayüz", "geometrik-şekiller-oop-ödevi---enes-öztürk", "OOP · TypeScript",
     ["class Sekil { alan(); cevre(); }", "class Dikdortgen extends Sekil", "class Kare extends Dikdortgen", "✓ kalıtım · kapsülleme · çok biçimlilik"]),
    ("enes-öztürk---bilimsel-hesap-makinesi", "", "", "", "", "", "", "", []),
    ("paragraf-oluşturucu---enes-öztürk", "Paragraf Oluşturucu", "Özelleştirilebilir metin & HTML çıktısı",
     "ALGORİTMA · UI", "#38BDF8", "Algoritma & arayüz", "paragraf-oluşturucu---enes-öztürk", "React · TypeScript",
     ["cümle sayısı   ·   paragraf sayısı", "çıktı biçimi:  düz metin  |  HTML", "kopyala  ·  sıfırla  ·  yeniden üret", "✓ anında ön izleme"]),
    ("klavye-hız-testi---enes-öztürk", "Klavye Hız Testi", "60 saniye · WPM · doğruluk",
     "ALGORİTMA · UI", "#38BDF8", "Algoritma & arayüz", "klavye-hız-testi---enes-öztürk", "React · TypeScript",
     ["süre  00:60      WPM  72", "doğruluk  %98.4   vuruş  348", "hatalı kelime  3   ·   seri  12", "✓ gerçek zamanlı ölçüm"]),
    ("markdown-previewer-pro-—-enes-öztürk-signature", "Markdown Previewer Pro", "Anlık ön izleme & araç seti",
     "ALGORİTMA · UI", "#38BDF8", "Algoritma & arayüz", "markdown-previewer-pro-—-enes-öztürk-signature", "React · Markdown",
     ["# Başlık        →  <h1>Başlık</h1>", "**kalın**       →  <strong>kalın</strong>", "`kod`           →  <code>kod</code>", "✓ sol editör  ·  sağ ön izleme"]),
    ("react-emoji-search---test-paketi-&-canlı-koşucu", "React Emoji Search", "React Testing Library test paketi",
     "ALGORİTMA · UI", "#38BDF8", "Algoritma & arayüz", "react-emoji-search---test-paketi-&-canlı-koşucu", "React · RTL · Vitest",
     ["✓ Header başlığı render ediyor", "✓ liste filtreleme çalışıyor", "✓ kopyalama panoya yazıyor", "4/4 test geçti  ·  canlı koşucu"]),
    ("enes-öztürk-button-component", "Button Component", "NPM paketi · 5 varyant",
     "ALGORİTMA · UI", "#38BDF8", "Algoritma & arayüz", "enes-öztürk-button-component", "React · NPM · TS",
     ["<Button type=\"primary\">Kaydet</Button>", "primary · default · dashed · text · link", "packages/enes-ozturk-button", "✓ yayınlanabilir bileşen paketi"]),
    ("notesapp---enes-öztürk", "NotesApp", "Renkli ve filtrelenebilir notlar",
     "ALGORİTMA · UI", "#38BDF8", "Algoritma & arayüz", "notesapp---enes-öztürk", "React · TypeScript",
     ["not ekle  ·  renk seç  ·  sabitle", "filtre: tümü | sabitlenen | renk", "yerel kalıcılık", "✓ arama & hızlı düzenleme"]),
    ("algoritmik-veri-görselleştirici-&-algoritma-labirenti", "Algoritma Görselleştirici", "Dizi · yığıt · kuyruk · sıralama · labirent",
     "ALGORİTMA · UI", "#38BDF8", "Algoritma & arayüz", "algoritmik-veri-görselleştirici-&-algoritma-labirenti", "React · Algoritma",
     ["Stack  push/pop   ·   Queue  enqueue/dequeue", "Sorting  bubble · merge · quick", "Maze  BFS  ·  DFS  ·  A*", "✓ adım adım animasyon"]),
    ("git-&-cli-ui---git-simülatörü-ve-versiyon-takip-paneli", "Git & CLI UI", "Versiyon kontrol simülatörü",
     "ALGORİTMA · UI", "#38BDF8", "Algoritma & arayüz", "git-&-cli-ui---git-simülatörü-ve-versiyon-takip-paneli", "React · Git",
     ["$ git init   ·   $ git add .", "$ git commit -m \"ilk\"", "main  ●──●──●  HEAD", "✓ komut simülasyonu & dal grafiği"]),
    ("world-happiness-report---enes-öztürk-analizi", "World Happiness Report", "155 ülke · 6 faktör analizi",
     "ALGORİTMA · UI", "#38BDF8", "Algoritma & arayüz", "world-happiness-report---enes-öztürk-analizi", "React · Veri Analizi",
     ["GSYH · sosyal destek · sağlık · özgürlük", "cömertlik · yolsuzluk algısı", "2015 → 2017 değişim  ±", "✓ en çok yükselen & gerileyen ülkeler"]),

    # 7 — Yönetim panelleri & CRUD
    ("patika-klonu---eğitim-ve-öğrenim-yönetim-platformu", "Patika Klonu", "Eğitim ve öğrenim yönetim platformu",
     "CRUD · YÖNETİM", "#F472B6", "Yönetim panelleri & CRUD", "patika-klonu---eğitim-ve-öğrenim-yönetim-platformu", "React · Context · LMS",
     ["öğrenci  ·  eğitmen  ·  operatör panelleri", "patikalar  ·  ders içerikleri  ·  YouTube", "yorumlar  ·  quiz  ·  ilerleme", "✓ rol bazlı yetkilendirme"]),
    ("patikastore---ürün-yönetim-sistemi", "PatikaStore", "Ürün ve marka yönetimi",
     "CRUD · YÖNETİM", "#F472B6", "Yönetim panelleri & CRUD", "patikastore---ürün-yönetim-sistemi", "React · TypeScript",
     ["markalar  ·  ürünler  ·  kategoriler", "ekle  ·  düzenle  ·  sil  ·  filtrele", "fiyat & stok tablosu", "✓ mağaza yönetim çekirdeği"]),
    ("paslı-mağaza---envanter-yönetim-sistemi", "", "", "", "", "", "", "", []),
    ("sigorta-yönetim-sistemi", "Sigorta Yönetim Sistemi", "Bireysel & kurumsal müşteri profilleri",
     "CRUD · YÖNETİM", "#F472B6", "Yönetim panelleri & CRUD", "sigorta-yönetim-sistemi", "Java OOP · React",
     ["müşteri  ·  poliçe  ·  hasar  ·  ödeme", "bireysel ↔ kurumsal profil ayrımı", "poliçe yenileme takvimi", "✓ OOP mimarisi"]),
    ("patika-turizm-acente-sistemi", "Patika Turizm Acente", "Otel · dönem · oda · rezervasyon",
     "CRUD · YÖNETİM", "#F472B6", "Yönetim panelleri & CRUD", "patika-turizm-acente-sistemi", "React · Rezervasyon",
     ["otel  ·  dönem  ·  oda  ·  fiyatlandırma", "tarih aralığına göre arama", "rezervasyon & doluluk", "✓ sezon bazlı fiyat tablosu"]),
    ("java-araç-kiralama-portalı-&-veritabanı-sistemi-—-enes-öztürk", "Araç Kiralama Portalı", "Şehir filtresi · tarih çakışma kontrolü",
     "CRUD · YÖNETİM", "#F472B6", "Yönetim panelleri & CRUD", "java-araç-kiralama-portalı-&-veritabanı-sistemi-—-enes-öztürk", "Java · Veritabanı",
     ["firma  ·  araç  ·  şehir  ·  ek hizmet", "rezervasyon tarih çakışması  ✗ engellendi", "24 saat kuralı  ·  fiyat hesabı", "✓ ilişkisel veri modeli"]),
    ("java-swing-depo-&-stok-yönetim-sistemi", "Swing Depo & Stok", "Katmanlı mimari · tedarik zinciri",
     "CRUD · YÖNETİM", "#F472B6", "Yönetim panelleri & CRUD", "java-swing-depo-&-stok-yönetim-sistemi", "Java Swing · OOP",
     ["ürün  ·  depo  ·  stok hareketi  ·  tedarikçi", "giriş / çıkış fişi  ·  kritik stok uyarısı", "katmanlı mimari: ui · service · model", "✓ masaüstü otomasyon"]),
    ("fikstür-mobilya-&-i̇ç-mimarlık---enes-öztürk", "Fikstür Mobilya", "Katalog · rezervasyon · admin paneli",
     "CRUD · YÖNETİM", "#F472B6", "Yönetim panelleri & CRUD", "fikstür-mobilya-&-i̇ç-mimarlık---enes-öztürk", "React · Katalog",
     ["koleksiyon  ·  ürün detayı  ·  galeri", "randevu & rezervasyon formu", "admin: içerik ve stok yönetimi", "✓ iç mimarlık vitrini"]),
    ("öztürk-bank---online-bankacılık-sistemi", "Öztürk Bank", "Transfer · kredi · kart ekstresi",
     "CRUD · YÖNETİM", "#F472B6", "Yönetim panelleri & CRUD", "öztürk-bank---online-bankacılık-sistemi", "Java OOP · JSON",
     ["hesap  ·  transfer  ·  kredi  ·  ekstre", "kullanıcılar arası havale", "JSON tabanlı kalıcılık", "✓ bankacılık çekirdek akışları"]),

    # 8 — Oyun, API vitrini & kişisel projeler
    ("hafıza-oyunu---enes-öztürk", "Hafıza Oyunu", "Redux · 3 ızgara modu · joker kart",
     "OYUN · VİTRİN", CYAN, "Oyun, API vitrini & kişisel projeler", "hafıza-oyunu---enes-öztürk", "React · Redux · Vite",
     ["4x4  ·  6x4  ·  5x5 (+joker)", "eşleşme +50   ·   hata −10", "en iyi skor  localStorage", "✓ Fisher–Yates karıştırma"]),
    ("spend-bill-gates'-money", "Spend Bill Gates' Money", "$100 milyar harcama simülatörü",
     "OYUN · VİTRİN", CYAN, "Oyun, API vitrini & kişisel projeler", "spend-bill-gates'-money", "React · TypeScript",
     ["bakiye  $100,000,000,000", "satın al  ·  geri sat  ·  makbuz", "canlı bakiye takibi", "✓ sepet & işlem geçmişi"]),
    ("enes-öztürk-meteoroloji-_-türkiye-7-günlük-hava-durumu", "Meteoroloji · Türkiye", "81 il · 7 günlük tahmin",
     "OYUN · VİTRİN", CYAN, "Oyun, API vitrini & kişisel projeler", "enes-öztürk-meteoroloji-_-türkiye-7-günlük-hava-durumu", "React · Context API",
     ["81 il  ·  anlık  ·  saatlik  ·  7 gün", "Context API ile global durum", "sıcaklık · nem · rüzgâr · yağış", "✓ gerçek zamanlı hava verisi"]),
    ("türkiye-hava-durumu-·-enes-öztürk", "Türkiye Hava Durumu", "81 il · 7 günlük meteoroloji",
     "OYUN · VİTRİN", CYAN, "Oyun, API vitrini & kişisel projeler", "türkiye-hava-durumu-·-enes-öztürk", "React · Hava Durumu",
     ["il seç  →  anlık durum", "7 günlük tahmin kartları", "sıcaklık grafiği  ·  yağış olasılığı", "✓ el emeği arayüz tasarımı"]),
    ("covid-19-tracker---enes-öztürk", "COVID-19 Tracker", "Ülke bazlı canlı takip paneli",
     "OYUN · VİTRİN", CYAN, "Oyun, API vitrini & kişisel projeler", "covid-19-tracker---enes-öztürk", "React · Grafik",
     ["enfekte  ·  iyileşen  ·  vefat  ·  aktif", "dünya ve ülke kırılımı", "zaman serisi grafikleri", "✓ canlı veri paneli"]),
    ("rick-ve-morty-karakter-portalı---enes-öztürk", "", "", "", "", "", "", "", []),
    ("cord-19-research-mining-portal", "CORD-19 Portal", "Araştırma metni madenciliği",
     "OYUN · VİTRİN", CYAN, "Oyun, API vitrini & kişisel projeler", "cord-19-research-mining-portal", "React · Veri Madenciliği",
     ["makale  ·  yazar  ·  anahtar kelime", "metin arama & filtreleme", "konu kümeleri  ·  eş-oluşum", "✓ CORD-19 açık veri seti"]),
    ("elma-yaprak-hastalıkları-tespiti---enes-öztürk", "Elma Yaprak Hastalıkları", "Derin öğrenme · bilgisayarlı görü",
     "OYUN · VİTRİN", CYAN, "Oyun, API vitrini & kişisel projeler", "elma-yaprak-hastalıkları-tespiti---enes-öztürk", "Plant Pathology · CV",
     ["sınıf: scab · rust · blotch · sağlıklı", "model karşılaştırma tablosu", "doğruluk · F1 · karışıklık matrisi", "✓ Kaggle Plant Pathology 2020"]),
    ("1.6m-uk-trafik-kazaları-analiz-&-tahmin-platformu", "1.6M UK Trafik Kazaları", "Analiz & tahmin platformu",
     "OYUN · VİTRİN", CYAN, "Oyun, API vitrini & kişisel projeler", "1.6m-uk-trafik-kazaları-analiz-&-tahmin-platformu", "Veri Analizi · ML",
     ["1.6M kaza  ·  2000–2016", "trafik akışı · risk · kırsal-kentsel", "zaman serisi tahmini", "✓ dört sütunlu analiz paneli"]),
    ("saatlik-enerji-talebi,-üretimi-ve-hava-durumu-ml-platformu", "Enerji Talebi ML", "Saatlik talep & fiyat tahmini",
     "OYUN · VİTRİN", CYAN, "Oyun, API vitrini & kişisel projeler", "saatlik-enerji-talebi,-üretimi-ve-hava-durumu-ml-platformu", "Veri Analizi · ML",
     ["İspanya  ·  4 yıl  ·  saatlik veri", "tüketim · üretim · fiyat · hava", "outlier analizi  ·  zaman serisi", "✓ dinamik tarife karar desteği"]),
    ("web3-düşünce-egzersizi_-afet-yardımı-&-depin-analizi---enes-öztürk", "Web3 & DePIN Analizi", "Afet yardımı · ZKP · şeffaflık",
     "OYUN · VİTRİN", CYAN, "Oyun, API vitrini & kişisel projeler", "web3-düşünce-egzersizi_-afet-yardımı-&-depin-analizi---enes-öztürk", "Web3 · Araştırma",
     ["afet lojistiği  ·  şeffaf yardım", "DePIN  ·  sıfır bilgi ispatı (ZKP)", "teknik + akademik değerlendirme", "✓ kullanım senaryoları"]),
    ("projeler/ajans-portfolyo", "Enes Öztürk Ajans", "Portföy & web yönetim platformu",
     "OYUN · VİTRİN", CYAN, "Oyun, API vitrini & kişisel projeler", "projeler/ajans-portfolyo", "React · Ajans",
     ["hizmetler  ·  işler  ·  referanslar", "çok sayfalı vitrin  ·  iletişim", "yönetim paneli", "✓ kurumsal ajans kimliği"]),
    ("projeler/freelancer-portfolyo", "Freelancer Portföy", "Grafik · web · full stack",
     "OYUN · VİTRİN", CYAN, "Oyun, API vitrini & kişisel projeler", "projeler/freelancer-portfolyo", "React · Portföy",
     ["projeler  ·  yetenekler  ·  iletişim", "e-ticaret · Pcat · SmartEdu vitrini", "tek sayfa akıcı deneyim", "✓ kişisel marka"]),
    ("projeler/misfit-fitness", "MISFIT Fitness", "Antrenman yönetimi",
     "OYUN · VİTRİN", CYAN, "Oyun, API vitrini & kişisel projeler", "projeler/misfit-fitness", "React · Fitness",
     ["antrenörler  ·  programlar  ·  galeri", "üyelik & seans planı", "topluluk bölümü", "✓ spor salonu vitrini"]),
    ("projeler/turk-damasi", "Türk Daması", "Ceviz & şimşir dokulu iki kişilik oyun",
     "OYUN · VİTRİN", CYAN, "Oyun, API vitrini & kişisel projeler", "projeler/turk-damasi", "React · Oyun",
     ["aynı cihazda iki kişilik", "hamle geçmişi  ·  sıra göstergesi", "ahşap doku  ·  taş animasyonu", "✓ özel tasarım arayüz"]),
    ("kariyerportalı---i̇ş-bulma-&-i̇lan-sistemi", "KariyerPortalı", "İş bulma & ilan sistemi · kurumsal mimari",
     "CRUD · YÖNETİM", "#F472B6", "Yönetim panelleri & CRUD", "kariyerportalı---iş-bulma-&-ilan-sistemi", "Katmanlı mimari · OOP · SOLID",
     ["aday & şirket portalı  ·  ilan & başvuru", "Repository · Factory · Builder · Strategy", "UML / EER diyagramları  ·  audit log", "✓ rol bazlı yetkilendirme"]),
    ("i̇nsan-kaynakları-yönetim-sistemi-(hrms)---enes-öztürk", "HRMS — İnsan Kaynakları", "Spring Boot katmanlı mimari · Admin/User rolleri",
     "CRUD · YÖNETİM", "#F472B6", "Yönetim panelleri & CRUD", "i̇nsan-kaynakları-yönetim-sistemi-(hrms)---enes-öztürk", "Katmanlı mimari · SOLID · I/O",
     ["personel · izin · maaş · denetim kaydı", "Admin / User rol ayrımı", "veritabanı + dosya I/O kalıcılığı", "✓ UML & EER diyagramları"]),
    ("öztürk-bank-atm-&-çekirdek-bankacılık-sistemi", "Öztürk Bank ATM", "Çekirdek bankacılık · çift arayüz",
     "CRUD · YÖNETİM", "#F472B6", "Yönetim panelleri & CRUD", "öztürk-bank-atm-&-çekirdek-bankacılık-sistemi", "Katmanlı mimari · OOP · SOLID",
     ["fiziksel ATM terminali  ·  yönetim portalı", "Optional · Stream · Strategy · Factory", "rol bazlı yetkilendirme  ·  dosya I/O", "✓ EER / UML diyagramları"]),
    ("projeler/meteoroloji", "Meteoroloji", "81 il · anlık, saatlik, 7 günlük",
     "OYUN · VİTRİN", CYAN, "Oyun, API vitrini & kişisel projeler", "projeler/meteoroloji", "React · Hava Durumu",
     ["il & ilçe seçimi", "saatlik tahmin grafiği", "7 günlük kart görünümü", "✓ hızlı arama"]),
    ("etkinlik-portalı---ödev-6", "Etkinlik Portalı", "Ekleme, doğrulama & dinamik filtre",
     "CRUD · YÖNETİM", "#F472B6", "Yönetim panelleri & CRUD", "etkinlik-portalı---ödev-6", "React · TypeScript",
     ["etkinlik ekle  →  form doğrulama", "asenkron yükleme animasyonu", "kategoriye göre anlık filtre", "✓ gerçek zamanlı liste"]),
    ("java-console-chat---enes-öztürk", "Java Console Chat", "Socket & Thread · LAN sohbet odaları",
     "JAVA · OOP", AMBER, "Java", "java-console-chat---enes-öztürk", "Java · Socket · Thread",
     ["ServerSocket  →  5000 dinleniyor", "Thread-1  ·  istemci bağlandı", "oda: #genel   mesaj: \"selam\"", "✓ yerel ağ üzerinden sohbet"]),
    ("php-dizi-filtreleyici-ve-rastgele-seçici", "PHP Dizi Filtreleyici", "array_filter · array_rand · array_map",
     "PHP · ALGORİTMA", VIOLET, "Algoritma & arayüz", "php-dizi-filtreleyici-ve-rastgele-seçici", "PHP · Diziler",
     ["$temiz = array_filter($dizi, fn($v) => !empty($v));", "$rastgele = array_rand($temiz, 3);", "$sonuc = array_map('strtoupper', $rastgele);", "✓ boş değerler temizlendi"]),
    ("react/odev-2", "React Ödev 2 — Todo", "İki görünüm modlu yapılacaklar",
     "OYUN · VİTRİN", CYAN, "Oyun, API vitrini & kişisel projeler", "react/odev-2", "React · Bootcamp",
     ["görev ekle  ·  tamamla  ·  sil", "liste ↔ kart görünümü", "tamamlananları temizle", "✓ React bootcamp ödevi"]),
    ("nodejs/odev-1", "Node.js Ödev 1 — Axios", "API'den veri çekip tek nesnede birleştirme",
     "NODE.JS · CLI", CYAN, "Node.js temelleri & CLI", "nodejs/odev-1", "Node.js · Axios",
     ["$ node src/app.js", "→ kullanıcı + gönderileri getir", "→ tek nesnede birleştir", "✓ asenkron veri akışı"]),
    ("öztürk-bank---online-bankacılık-sistemi", "", "", "", "", "", "", "", []),
]


def esc(s: str) -> str:
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


def fit(text: str, limit: int) -> str:
    return text if len(text) <= limit else text[: limit - 1].rstrip() + "…"


def project_cover(slug: str, title: str, subtitle: str, tag: str, accent: str, section: str,
                  path_label: str, stack: str, lines: list[str]) -> str:
    title = fit(title, 30)
    subtitle = fit(subtitle, 46)
    stack = fit(stack, 46)
    path_label = fit(path_label, 48)
    tag = fit(tag, 30)
    section = fit(section, 46)

    L = []
    a = L.append
    a('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 640" width="1280" height="640" '
      'role="img" aria-label="' + esc(title) + ' — Enes Öztürk imza kapağı">')
    a('<title>' + esc(title) + ' · Enes Öztürk</title>')
    a('<defs>')
    a('<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">'
      '<stop offset="0" stop-color="#060B14"/><stop offset="55%" stop-color="#0A121F"/>'
      '<stop offset="100%" stop-color="#101A2C"/></linearGradient>')
    a(f'<linearGradient id="acc" x1="0" y1="0" x2="1" y2="0">'
      f'<stop offset="0" stop-color="{accent}"/><stop offset="100%" stop-color="{accent}" stop-opacity="0.15"/></linearGradient>')
    a(f'<radialGradient id="glow1" cx="50%" cy="50%" r="50%">'
      f'<stop offset="0" stop-color="{accent}" stop-opacity="0.28"/><stop offset="100%" stop-color="{accent}" stop-opacity="0"/></radialGradient>')
    a('<radialGradient id="glow2" cx="50%" cy="50%" r="50%">'
      '<stop offset="0" stop-color="#8B5CF6" stop-opacity="0.20"/><stop offset="100%" stop-color="#8B5CF6" stop-opacity="0"/></radialGradient>')
    a(f'<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">'
      f'<stop offset="0" stop-color="#FFFFFF" stop-opacity="0.10"/><stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.02"/></linearGradient>')
    a(f'<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">'
      f'<path d="M40 0H0V40" fill="none" stroke="#FFFFFF" stroke-opacity="0.035" stroke-width="1"/></pattern>')
    a(f'<pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">'
      f'<circle cx="1.5" cy="1.5" r="1.5" fill="{accent}" fill-opacity="0.12"/></pattern>')
    a('<filter id="soft" x="-30%" y="-30%" width="160%" height="160%">'
      '<feGaussianBlur stdDeviation="26"/></filter>')
    a(f'<style>.t{{font-family:{FONT_STACK};}}'
      f'.m{{font-family:{MONO_STACK};}}'
      f'.ttl{{font-family:{FONT_STACK};font-weight:700;letter-spacing:-1.4px}}'
      f'.cap{{font-family:{FONT_STACK};font-weight:600;letter-spacing:3.2px}}</style>')
    a('</defs>')

    # zemin
    a('<rect width="1280" height="640" fill="url(#bg)"/>')
    a('<rect width="1280" height="640" fill="url(#grid)"/>')
    a(f'<ellipse cx="240" cy="110" rx="420" ry="260" fill="url(#glow1)"/>')
    a(f'<ellipse cx="1140" cy="560" rx="420" ry="280" fill="url(#glow2)"/>')
    a(f'<rect x="0" y="0" width="6" height="640" fill="url(#acc)"/>')

    # üst şerit
    a(f'<g class="m" font-size="12" fill="{FAINT}" letter-spacing="1.6">'
      f'<text x="56" y="46">ENES ÖZTÜRK</text>'
      f'<text x="168" y="46" fill="{EDGE}">/</text>'
      f'<text x="184" y="46">PATİKA.DEV ARŞİVİ</text>'
      f'<text x="1224" y="46" text-anchor="end" fill="{accent}" fill-opacity="0.85">{esc(tag)}</text></g>')
    a(f'<line x1="56" y1="62" x2="1224" y2="62" stroke="#FFFFFF" stroke-opacity="0.06"/>')

    # sol: künye
    a(f'<g class="m" font-size="12" fill="{FAINT}"><text x="56" y="112">{esc(section)}</text></g>')
    a(f'<rect x="56" y="126" width="52" height="3" rx="1.5" fill="{accent}"/>')
    a(f'<text x="56" y="200" class="ttl" font-size="52" fill="{INK}">{esc(title)}</text>')
    a(f'<text x="56" y="238" class="t" font-size="19" fill="{DIM}">{esc(subtitle)}</text>')
    a(f'<text x="56" y="272" class="m" font-size="13.5" fill="{accent}" fill-opacity="0.9">{esc(stack)}</text>')
    a(f'<text x="56" y="296" class="m" font-size="12" fill="{FAINT}">{esc(path_label)}</text>')

    # sol: terminal / konsol paneli
    px, py, pw, ph = 56, 330, 520, 196
    a(f'<rect x="{px}" y="{py}" width="{pw}" height="{ph}" rx="14" fill="{PANEL}" fill-opacity="0.92" stroke="{EDGE}"/>')
    a(f'<rect x="{px}" y="{py}" width="{pw}" height="34" rx="14" fill="{PANEL2}"/>')
    a(f'<rect x="{px}" y="{py+20}" width="{pw}" height="14" fill="{PANEL2}"/>')
    a(f'<line x1="{px}" y1="{py+34}" x2="{px+pw}" y2="{py+34}" stroke="{EDGE}"/>')
    for i, c in enumerate(["#F87171", "#FBBF24", "#4ADE80"]):
        a(f'<circle cx="{px+20+i*18}" cy="{py+17}" r="5" fill="{c}" fill-opacity="0.85"/>')
    a(f'<text x="{px+84}" y="{py+22}" class="m" font-size="11.5" fill="{FAINT}">~/patika · {esc(slug.split("/")[-1][:26])}</text>')
    for i, ln in enumerate(lines[:4]):
        y = py + 62 + i * 32
        color = INK if i == 0 else (accent if ln.startswith(("✓", "→", "↯")) else DIM)
        if i == 0:
            a(f'<text x="{px+22}" y="{y}" class="m" font-size="13.5" fill="{accent}">▸</text>')
            a(f'<text x="{px+42}" y="{y}" class="m" font-size="13" fill="{color}">{esc(fit(ln, 62))}</text>')
        else:
            a(f'<text x="{px+22}" y="{y}" class="m" font-size="13" fill="{color}">{esc(fit(ln, 64))}</text>')

    # sağ: kart
    cx, cy, cw, ch = 620, 112, 604, 414
    a(f'<rect x="{cx}" y="{cy}" width="{cw}" height="{ch}" rx="18" fill="{PANEL}" fill-opacity="0.85" stroke="{EDGE}"/>')
    a(f'<rect x="{cx}" y="{cy}" width="{cw}" height="44" rx="18" fill="{PANEL2}"/>')
    a(f'<rect x="{cx}" y="{cy+26}" width="{cw}" height="18" fill="{PANEL2}"/>')
    a(f'<line x1="{cx}" y1="{cy+44}" x2="{cx+cw}" y2="{cy+44}" stroke="{EDGE}"/>')
    a(f'<text x="{cx+22}" y="{cy+28}" class="m" font-size="11.5" fill="{FAINT}">PROJE KÜNYESİ</text>')
    a(f'<text x="{cx+cw-22}" y="{cy+28}" class="m" font-size="11.5" fill="{accent}" text-anchor="end" fill-opacity="0.9">v1.0</text>')

    # üst veri satırları
    rows = [("BAŞLIK", title), ("HAT", section), ("YIĞIN", stack), ("KLASÖR", path_label)]
    for i, (k, v) in enumerate(rows):
        y = cy + 84 + i * 44
        a(f'<text x="{cx+24}" y="{y}" class="cap" font-size="10.5" fill="{FAINT}">{k}</text>')
        a(f'<text x="{cx+24}" y="{y+20}" class="t" font-size="15.5" fill="{INK}">{esc(fit(v, 54))}</text>')
        a(f'<line x1="{cx+24}" y1="{y+32}" x2="{cx+cw-24}" y2="{y+32}" stroke="#FFFFFF" stroke-opacity="0.05"/>')

    # imza bloğu
    sy = cy + ch - 96
    a(f'<rect x="{cx+24}" y="{sy}" width="{cw-48}" height="68" rx="12" fill="{accent}" fill-opacity="0.07" stroke="{accent}" stroke-opacity="0.35"/>')
    a(f'<circle cx="{cx+56}" cy="{sy+34}" r="17" fill="none" stroke="{accent}" stroke-width="1.6"/>')
    a(f'<text x="{cx+56}" y="{sy+40}" class="t" font-size="14" font-weight="700" fill="{accent}" text-anchor="middle">EÖ</text>')
    a(f'<text x="{cx+86}" y="{sy+28}" class="t" font-size="14.5" font-weight="600" fill="{INK}">Enes Öztürk</text>')
    a(f'<text x="{cx+86}" y="{sy+48}" class="m" font-size="11.5" fill="{DIM}">github.com/EnesBinMalik</text>')

    # alt şerit
    a(f'<line x1="56" y1="572" x2="1224" y2="572" stroke="#FFFFFF" stroke-opacity="0.06"/>')
    a(f'<text x="56" y="604" class="m" font-size="12" fill="{FAINT}">TASARIM &amp; GELİŞTİRME · ENES ÖZTÜRK</text>')
    a(f'<text x="1224" y="604" class="m" font-size="12" fill="{accent}" text-anchor="end" fill-opacity="0.85">İMZALI KAPAK</text>')
    a('</svg>')
    return "\n".join(L) + "\n"


def repo_cover(project_count: int) -> str:
    L = []
    def _L(x): L.append(x)
    _L('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 640" width="1280" height="640" role="img" '
      'aria-label="Patika.dev Ödevleri & Proje Arşivi — Enes Öztürk">')
    _L('<defs>')
    _L('<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">'
      '<stop offset="0" stop-color="#05090F"/><stop offset="50%" stop-color="#0A1220"/><stop offset="100%" stop-color="#111C30"/></linearGradient>')
    _L('<linearGradient id="acc" x1="0" y1="0" x2="1" y2="0">'
      '<stop offset="0" stop-color="#22D3EE"/><stop offset="55%" stop-color="#8B5CF6"/><stop offset="100%" stop-color="#8B5CF6" stop-opacity="0.1"/></linearGradient>')
    _L('<radialGradient id="g1" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#22D3EE" stop-opacity="0.26"/>'
      '<stop offset="100%" stop-color="#22D3EE" stop-opacity="0"/></radialGradient>')
    _L('<radialGradient id="g2" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#8B5CF6" stop-opacity="0.24"/>'
      '<stop offset="100%" stop-color="#8B5CF6" stop-opacity="0"/></radialGradient>')
    _L('<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">'
      '<path d="M40 0H0V40" fill="none" stroke="#FFFFFF" stroke-opacity="0.035"/></pattern>')
    _L(f'<style>.t{{font-family:{FONT_STACK}}}.m{{font-family:{MONO_STACK}}}'
      f'.ttl{{font-family:{FONT_STACK};font-weight:700;letter-spacing:-2px}}</style>')
    _L('</defs>')
    _L('<rect width="1280" height="640" fill="url(#bg)"/><rect width="1280" height="640" fill="url(#grid)"/>')
    _L('<ellipse cx="200" cy="90" rx="440" ry="260" fill="url(#g1)"/><ellipse cx="1150" cy="600" rx="440" ry="280" fill="url(#g2)"/>')
    _L('<rect x="0" y="0" width="6" height="640" fill="url(#acc)"/>')
    _L('<g class="m" font-size="12" fill="#5A6B88" letter-spacing="1.6"><text x="56" y="48">PATİKA.DEV</text>'
      '<text x="160" y="48" fill="#1E3050">/</text><text x="176" y="48">AÇIK KAYNAK ÖDEV ARŞİVİ</text>'
      '<text x="1224" y="48" text-anchor="end" fill="#22D3EE" fill-opacity="0.85">ENES ÖZTÜRK</text></g>')
    _L('<line x1="56" y1="64" x2="1224" y2="64" stroke="#FFFFFF" stroke-opacity="0.06"/>')
    _L('<text x="56" y="176" class="ttl" font-size="64" fill="#E9F0FB">Patika.dev Ödevleri</text>')
    _L('<text x="56" y="246" class="ttl" font-size="64" fill="#8B5CF6">&amp; Proje Arşivi</text>')
    _L('<text x="56" y="292" class="t" font-size="19" fill="#8FA0BD">Node.js · GraphQL · Express · MongoDB · Java · Rust · Solana · React</text>')
    _L('<rect x="56" y="320" width="56" height="3" rx="1.5" fill="#22D3EE"/>')
    stats = [("63", "proje klasörü", "#22D3EE"), ("9", "teknoloji hattı", "#A78BFA"), ("63", "imzalı kapak", "#FBBF24")]
    for i, (n, lab, col) in enumerate(stats):
        x = 56 + i * 176
        _L(f'<rect x="{x}" y="356" width="160" height="96" rx="14" fill="#0B1420" fill-opacity="0.9" stroke="#1E3050"/>')
        _L(f'<rect x="{x}" y="356" width="4" height="96" rx="2" fill="{col}"/>')
        _L(f'<text x="{x+22}" y="404" class="t" font-size="34" font-weight="700" fill="{col}">{n}</text>')
        _L(f'<text x="{x+22}" y="430" class="m" font-size="11.5" fill="#8FA0BD">{lab}</text>')
    _L('<text x="56" y="530" class="t" font-size="20" font-weight="600" fill="#E9F0FB">Enes Öztürk</text>')
    _L('<text x="56" y="556" class="m" font-size="13" fill="#5A6B88">github.com/EnesBinMalik/patika-dev-odevler</text>')
    # sağ terminal
    tx, ty, tw, th = 700, 130, 524, 380
    _L(f'<rect x="{tx}" y="{ty}" width="{tw}" height="{th}" rx="16" fill="#0B1420" fill-opacity="0.94" stroke="#1E3050"/>')
    _L(f'<rect x="{tx}" y="{ty}" width="{tw}" height="38" rx="16" fill="#0E1A2A"/><rect x="{tx}" y="{ty+24}" width="{tw}" height="14" fill="#0E1A2A"/>')
    _L(f'<line x1="{tx}" y1="{ty+38}" x2="{tx+tw}" y2="{ty+38}" stroke="#1E3050"/>')
    for i, c in enumerate(["#F87171", "#FBBF24", "#4ADE80"]):
        _L(f'<circle cx="{tx+22+i*18}" cy="{ty+19}" r="5" fill="{c}" fill-opacity="0.85"/>')
    _L(f'<text x="{tx+92}" y="{ty+24}" class="m" font-size="11.5" fill="#5A6B88">arsiv.sh</text>')
    term = [("$ ls -d */ | wc -l", "#E9F0FB"), (str(project_count), "#22D3EE"), ("", ""),
            ("$ cat hatlar.txt", "#E9F0FB"), ("nodejs   graphql   cleanblog", "#A78BFA"),
            ("java     rust      solana", "#A78BFA"), ("react    oyun      projeler", "#A78BFA"), ("", ""),
            ("$ grep -L 'cover.svg' */README.md | wc -l", "#E9F0FB"), ("0   ✓ her klasörde imzalı kapak", "#4ADE80")]
    for i, (line, col) in enumerate(term):
        if not line:
            continue
        _L(f'<text x="{tx+24}" y="{ty+76+i*30}" class="m" font-size="13" fill="{col}">{esc(line)}</text>')
    _L('<text x="1224" y="604" class="m" font-size="12" fill="#22D3EE" text-anchor="end" fill-opacity="0.85">İMZALI KAPAK</text>')
    _L('</svg>')
    return "\n".join(L) + "\n"


def main() -> None:
    force = "--force" in sys.argv
    seen = set()
    written, skipped = [], []
    for entry in CATALOG:
        slug, title, subtitle, tag, accent, section, path_label, stack, lines = entry
        if not title or slug in seen:
            continue
        seen.add(slug)
        target_dir = ROOT / slug
        if not target_dir.is_dir():
            print(f"!  klasör yok: {slug}")
            continue
        out = target_dir / "docs" / "cover.svg"
        if out.exists() and not force:
            skipped.append(slug)
            continue
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(project_cover(slug, title, subtitle, tag, accent, section, path_label, stack, lines),
                       encoding="utf-8")
        written.append(slug)

    # depo kapağı: PNG (GitHub social preview) + SVG kaynak
    docs = ROOT / "docs"
    docs.mkdir(exist_ok=True)
    svg = repo_cover(len(seen))
    (docs / "social-preview.svg").write_text(svg, encoding="utf-8")
    print(f"✓ docs/social-preview.svg  ({len(seen)} proje)")
    try:
        import cairosvg  # type: ignore
        cairosvg.svg2png(bytestring=svg.encode(), write_to=str(docs / "social-preview.png"),
                         output_width=1280, output_height=640)
        print("✓ docs/social-preview.png")
    except Exception as exc:  # noqa: BLE001
        print(f"·  PNG atlandı ({exc.__class__.__name__}); SVG kaynak yazıldı")

    print(f"\nüretilen: {len(written)} · zaten var: {len(skipped)}")


if __name__ == "__main__":
    main()
