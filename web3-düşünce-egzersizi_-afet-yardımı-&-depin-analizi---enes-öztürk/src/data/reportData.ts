import { MetricCard, ComparisonItem, SimulationStep, SecondaryCase } from '../types';

export const AUTHOR_NAME = "Enes Öztürk";
export const REPORT_DATE = "Kasım 2026";
export const REPORT_TITLE = "Afet Yönetimi ve İnsani Yardım Zincirlerinde Merkeziyetsiz Fiziksel Altyapı (DePIN) ve Sıfır Bilgi İspatları (ZKP) Analizi";
export const REPORT_SUBTITLE = "Güvensiz Ortamlarda Güven İnşası: Web2 Veri Silolarından Doğrulanabilir ve Mahrem Web3 Protokollerine";

export const METRICS: MetricCard[] = [
  {
    label: "Fon Takip Şeffaflığı",
    value: "%100",
    description: "Bağışlanan her 1 doların on-chain olarak akıllı sözleşme ve oracles ile hedefe varışının ispatlanması.",
    baselineWeb2: "Web2 Ortalaması: %35 - %50 (Kapalı ERP defterleri)"
  },
  {
    label: "Yardım Ulaştırma Hızı",
    value: "< 6 Saat",
    description: "Merkezi banka takasları ve bürokratik onay kuyrukları olmadan otomatik kilit açma (escrow release).",
    baselineWeb2: "Web2 Ortalaması: 48 - 72 Saat"
  },
  {
    label: "İdari Maliyet & Fon Sızıntısı",
    value: "< %0.8",
    description: "Aracı komisyonları, kâğıt işleri ve mutabakat maliyetlerinin akıllı sözleşmeler ile sıfırlanması.",
    baselineWeb2: "Web2 Ortalaması: %12 - %25 arası kayıp"
  },
  {
    label: "Afetzede Kimlik Mahremiyeti",
    value: "0 İhlal",
    description: "zk-SNARKs ile açık isim veya T.C. kimlik numarası ifşa edilmeden 'Doğrulanmış İhtiyaç Sahibi' kanıtı.",
    baselineWeb2: "Web2: Kimlik fotokopisi ve açık veri sızıntıları"
  }
];

export const COMPARISONS: ComparisonItem[] = [
  {
    id: "accountability",
    category: "Hesap Verebilirlik & Güven",
    title: "Bağış Fonlarının Yönetimi ve Dağıtımı",
    web2Approach: "Bağışlar tek bir yardım kuruluşunun veya kamu kurumunun ticari banka hesabında toplanır. İç muhasebe SQL/ERP sistemlerine kaydedilir.",
    web2Limitation: "Halk sadece beyan edilen basın bültenlerini okuyabilir. Veriler manipülasyona açıktır, geriye dönük değiştirilebilir ve bağımsız doğrulamadan yoksundur.",
    web3Approach: "Bağışlar çoklu imzalı (Multi-sig) ve aşamalı emanet (Milestone Escrow) akıllı sözleşmelerinde kilitlenir. Harcama önceden belirlenen şartlar sağlandığında gerçekleşir.",
    web3Innovation: "Her transfer blokzincir üzerinde kriptografik olarak değişmezdir. Dünyanın herhangi bir yerindeki bağışçı, fonunun akıbetini blok bazında denetler.",
    underlyingTech: "Ethereum / L2 Rollup, Solidity Akıllı Sözleşmeleri, ERC-20 / Çoklu İmzalı Kasalar (Safe)"
  },
  {
    id: "infrastructure",
    category: "Altyapı Dayanıklılığı",
    title: "İletişim ve Sunucu Kesintileri",
    web2Approach: "Bulut sağlayıcıları (AWS, Google Cloud) veya yerel veri merkezlerindeki merkezi sunuculara bağımlıdır. Fiber ve baz istasyonlarına muhtaçtır.",
    web2Limitation: "Deprem veya fırtına anında baz istasyonları çöktüğünde veya veri merkezleri elektrik kaybettiğinde sistem tamamen felç olur (Tek Hata Noktası).",
    web3Approach: "DePIN (Decentralized Physical Infrastructure) nodları ve LoRaWAN pilli radyo frekanslı mesh ağları üzerinden eşler arası (P2P) yerel mutabakat.",
    web3Innovation: "İnternet olmasa dahi cihazlar birbirleriyle kriptografik işlem paketleri paylaşır; ağa ilk uydu veya telsiz bağlantısı geldiğinde blokzincir senkronize olur.",
    underlyingTech: "DePIN Donanımları, LoRaWAN / Meshtastic P2P Protokolleri, Starlink Uydu Düğümleri"
  },
  {
    id: "privacy",
    category: "Kişisel Veri ve Onur",
    title: "Afetzede Hak Sahipliği Doğrulaması",
    web2Approach: "Afetzededen kimlik fotokopisi, T.C. kimlik numarası, ikametgâh belgesi veya parmak izi istenir. Listeler Excel veya kâğıtlarda saklanır.",
    web2Limitation: "Kişisel veriler çalınma, yağmacıların eline geçme veya fişlenme riski taşır. Mükerrer kayıtları engellemek için tüm STK'ların veritabanını birleştirmesi KVKK engeline takılır.",
    web3Approach: "Sıfır Bilgi İspatı (Zero-Knowledge Proofs - zk-SNARKs) tabanlı Soulbound Token (ZK-SBT). Afetzede 'Ben X bölgesinde afetten etkilenen ve henüz bu yardımı almayan kişiyim' ispatı üretir.",
    web3Innovation: "Afetzedenin adı, soyadı, kimlik numarası veya adresi asla açığa çıkmaz. Matematiksel ispat ile mükerrer yardım talep etmesi (çifte harcama) imkansız kılınır.",
    underlyingTech: "zk-SNARKs (Circom/SnarkJS), EIP-4337 Hesap Soyutlama, ZK Ruh Bağlı Tokenlar (SBT)"
  },
  {
    id: "supply-chain",
    category: "Lojistik & Soğuk Zincir",
    title: "Yardım Malzemelerinin Doğrulanması",
    web2Approach: "Kamyon şoförlerinin imzaladığı kâğıt irsaliyeler veya merkezi barkod okuyucular. Veriler lojistik firmasının sunucusunda tutulur.",
    web2Limitation: "İrsaliyeler kaybolabilir, tırlar hedefe varmadan yük boşaltabilir veya insülin/aşı gibi soğuk zincir ilaçlar bozulmasına rağmen depoya kabul edilebilir.",
    web3Approach: "Kriptografik güvenli IoT mühürleri ve sıcaklık sensörleri, malzeme verilerini doğrudan oracle ağlarına (Chainlink / Witnet) imzalı olarak gönderir.",
    web3Innovation: "İlaç ısısı 8°C üzerine çıkarsa akıllı sözleşme teslimatı otomatik iptal eder ve tedarikçiye ödemeyi bloke eder. İrsaliye fotoğrafları IPFS'e değişmez biçimde kaydedilir.",
    underlyingTech: "IPFS / Arweave Merkeziyetsiz Depolama, Chainlink IoT Oracles, Kriptografik NFC Mühürleri"
  }
];

export const SIMULATION_STEPS: SimulationStep[] = [
  {
    step: 1,
    title: "Şartlı Bağış ve Fon Kilitleme",
    actor: "Küresel Bağışçı & Diaspora Topluluğu",
    description: "Bağışçı, fonunu körü körüne bir hesaba göndermek yerine 'OpenRelief Milestone Escrow' akıllı sözleşmesine yatırır. Fon, yalnızca sahadan geçerli kriptografik teslimat kanıtı geldiğinde serbest kalacaktır.",
    smartContractEvent: "emit DonationEscrowed(donor, 50000 USDC, milestoneId: #4092)",
    technicalMechanism: "Multi-Sig Kasa & EIP-712 İmzalı Şartlı Emanet Sözleşmesi",
    zkProofStatus: "Hazır: Fonlar doğrulanabilir rezervde kilitli"
  },
  {
    step: 2,
    title: "IoT Mühürlü Tedarik ve Sevkiyat",
    actor: "Medikal Tedarikçi & Lojistik Ağı",
    description: "10.000 doz tetanoz aşısı ve acil travma kiti, kriptografik IoT sıcaklık takip modülüyle mühürlenir. Malzemenin orijinallik sertifikası ve seri numaraları IPFS'e içerik adresi (CID) olarak yüklenir.",
    smartContractEvent: "emit CargoDispatched(cargoHash: 0x89f...b21, ipfsCID: QmXy...89)",
    technicalMechanism: "IPFS Değişmez Veri Depolama + Donanım Güvenlik Modülü (HSM)",
    zkProofStatus: "Doğrulandı: Malzeme orijinalliği kriptografik olarak onaylı"
  },
  {
    step: 3,
    title: "DePIN LoRaWAN Mesh Dağıtımı",
    actor: "Saha Koordinasyon Düğümleri (Nodes)",
    description: "Afet bölgesinde fiber ve baz istasyonları çökmüştür. Güneş enerjili LoRaWAN DePIN cihazları 15 km çapında acil durum P2P mesh ağı kurar. Tır sahaya girdiğinde konum ve sıcaklık verisi telsiz frekansıyla doğrulanır.",
    smartContractEvent: "emit OracleCheckpointVerified(checkpoint: Camp_Delta, temp: 4.2C)",
    technicalMechanism: "LoRaWAN RF / Telsiz Mesh Ağı + Chainlink Decentralized Oracle",
    zkProofStatus: "Sensör telemetrisi Oracle konsensüsü ile onaylandı"
  },
  {
    step: 4,
    title: "ZKP ile Mahrem & Mükerrersiz Teslimat",
    actor: "Afetzede & Dağıtım Görevlisi",
    description: "Depremzede kimliğini (ad, T.C., aile bilgisi) görevliye göstermez. Akıllı telefonundaki veya NFC afet kartındaki ZK-Proof uygulamasını taratır. Protokol, kişinin afet bölgesinde yaşadığını ve bugün başka noktadan yardım almadığını sıfır bilgiyle kanıtlar.",
    smartContractEvent: "emit AidDistributed(nullifierHash: 0x3ac...99f, batchId: 4092)",
    technicalMechanism: "zk-SNARKs (Nullifier Hash Mekanizması ile Çifte Harcama Engeli)",
    zkProofStatus: "Kusursuz İspat: Kimlik gizli tutularak hak sahipliği onaylandı"
  },
  {
    step: 5,
    title: "Otomatik Takas ve Genel Denetim",
    actor: "Akıllı Sözleşme Otonom Yürütmesi",
    description: "Tüm koşullar tamamlandığında sözleşme tedarikçi ve nakliyecinin ödemesini anında serbest bırakır. Tüm akış blokzincir explorer üzerinden şeffaf şekilde kamuya açık raporlanır. Aracı komisyonu kesilmez.",
    smartContractEvent: "emit EscrowReleased(supplierAddress, 50000 USDC, fee: 0)",
    technicalMechanism: "EVM Otonom Durum Geçişi (State Transition)",
    zkProofStatus: "Tamamlandı: %100 Doğrulanabilir ve Denetlenebilir Zincir"
  }
];

export const SECONDARY_CASES: SecondaryCase[] = [
  {
    id: "desci",
    title: "DeSci: Merkeziyetsiz Klinik Araştırma ve Biyo-Veri DAO'su",
    tagline: "Tekelci İlaç Şirketleri Yerine Hasta Ortaklı Açık Bilim",
    problem: "Nadir hastalık verileri dev ilaç tekellerinin özel sunucularında kilitlidir; hastalar kendi genetik verilerinin parasallaşmasından pay alamaz ve klinik araştırmalar negatif sonuçları gizler.",
    solution: "Hastaların ZK-Proof ile verilerini anonim paylaştığı, araştırma fonlarının IP-NFT'ler ile toplulukça yönetildiği ve hakem denetimlerinin on-chain yapıldığı merkeziyetsiz araştırma protokolü.",
    coreTech: ["IP-NFT (Molecule Protokolü)", "Zero-Knowledge Data Sharing", "Research DAO Governance"]
  },
  {
    id: "depin-energy",
    title: "DeGrid: Eşler Arası (P2P) Mikro Güneş Enerjisi Şebekesi",
    tagline: "Merkezi Dağıtım Şirketleri Olmadan Mahalle İçi Enerji Ticareti",
    problem: "Çatısında güneş paneli olan bireyler elektriği merkezi dağıtıcıya çok ucuza satmak zorundadır; komşusu ise yüksek tarifeden elektrik alır. Verimsiz merkezi hat kayıpları yüksektir.",
    solution: "Akıllı çift yönlü elektrik sayaçlarının IoT oracle'lar ile blokzincire bağlandığı, komşuların doğrudan birbirleriyle saniyeler içinde mikro-ödeme (Layer 2) ile elektrik alıp sattığı otonom enerji şebekesi.",
    coreTech: ["IoT Smart Meters", "State Channels / L2 Lightning", "Automated Market Maker (AMM) for Kilowatt-Hours"]
  }
];
