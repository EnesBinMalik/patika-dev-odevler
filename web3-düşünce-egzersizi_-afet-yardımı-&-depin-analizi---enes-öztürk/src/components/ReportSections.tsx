import React, { useState } from 'react';
import { AUTHOR_NAME, REPORT_DATE } from '../data/reportData';
import { ShieldCheck, Eye, Lock, Zap, ServerCrash, Cpu, Network, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export const ReportSections: React.FC = () => {
  const [cargoImgError, setCargoImgError] = useState(false);
  const [ledgerImgError, setLedgerImgError] = useState(false);

  return (
    <div className="space-y-24 py-12">

      {/* ========================================================================= */}
      {/* 01. GİRİŞ (INTRODUCTION) */}
      {/* ========================================================================= */}
      <article id="giris" className="scroll-mt-24">
        <header className="mb-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-800 font-mono mb-2">
            <span>Bölüm 01</span>
            <span aria-hidden="true">·</span>
            <span>Kavramsal Çerçeve & Motivasyon</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            Giriş: Kullanım Vakası, Çalışma Mekanizması ve Temel Amaç
          </h2>
        </header>

        <div className="space-y-6 text-stone-700 leading-relaxed text-[16px]">
          <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-stone-900 leading-relaxed">
            Bu düşünce egzersizinde analiz edilen Web3 kullanım vakası; büyük ölçekli doğal afetler ve insani krizler sonrasında ortaya çıkan bağış yönetimi, acil malzeme tedarik zinciri ve afetzede yardım dağıtımını uçtan uca dönüştüren <strong>OpenRelief Protokolü</strong>’dür. Bu protokol; merkeziyetsiz fiziksel altyapı ağları (DePIN), programlanabilir akıllı sözleşmeler ve sıfır bilgi ispatları (Zero-Knowledge Proofs - ZKP) üzerine inşa edilmiş, aracı kurumlara duyulan zorunlu güveni matematiksel doğrulamayla ikame eden yeni nesil bir afet koordinasyon ve yardım mimarisidir.
          </p>

          <h3 className="text-xl font-serif font-semibold text-stone-900 pt-4">
            Protokol Ne İşe Yarar ve Nasıl Çalışır?
          </h3>
          <p>
            Geleneksel insani yardım mekanizmaları, bağışçıların bir banka hesabına para aktarması ve ardından yardım kuruluşlarının bu parayı kapalı devre faturalandırma ve lojistik süreçleriyle sahaya ulaştırması esasına dayanır. OpenRelief protokolünde ise süreç şu mekanizmayla işler:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
            <div className="p-5 rounded-lg border border-stone-200 bg-white/80">
              <span className="font-mono text-xs text-amber-800 block mb-1">Aşama I · Şartlı Emanet</span>
              <h4 className="font-serif font-bold text-stone-900 text-base mb-2">Programlanabilir Fonlama</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Bağışlar genel havuzlar yerine koşullu akıllı sözleşmelerde (Milestone Escrow) kilitlenir. Fonlar ancak sahadan doğrulanmış lojistik kanıtı geldiğinde otomatik serbest kalır.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-stone-200 bg-white/80">
              <span className="font-mono text-xs text-amber-800 block mb-1">Aşama II · DePIN & IoT</span>
              <h4 className="font-serif font-bold text-stone-900 text-base mb-2">Doğrulanabilir Lojistik</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Tıbbi kitler, çadırlar ve gıda kolileri kriptografik mühürler ve sıcaklık sensörleriyle donatılır. Veriler LoRaWAN telsiz mesh ağı üzerinden blokzincir oracle'larına aktarılır.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-stone-200 bg-white/80">
              <span className="font-mono text-xs text-amber-800 block mb-1">Aşama III · ZKP ile Teslimat</span>
              <h4 className="font-serif font-bold text-stone-900 text-base mb-2">Mahrem Hak Sahipliği</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Afetzede kimlik fotokopisi vermez; akıllı telefon veya NFC kartındaki sıfır bilgi ispatıyla (zk-SNARKs) ihtiyaç sahibi olduğunu ispatlar, çifte yardım suiistimali sıfırlanır.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-serif font-semibold text-stone-900 pt-2">
            Vakanın Seçilme Motivasyonu ve Asıl Amaç
          </h3>
          <p>
            Bu kullanım örneğini tasarlama ve analiz etme motivasyonum; özellikle 6 Şubat 2023 Kahramanmaraş depremlerinde ve dünya genelindeki benzer krizlerde bizzat tanıklık ettiğimiz yapısal tıkanıklıklardır. Afetin ilk kritik 72 saatinde merkezi sunucuların çökmesi, operatör baz istasyonlarının devre dışı kalması nedeniyle tırların nereye gideceğini bilememesi, farklı sivil toplum kuruluşları arasındaki veri paylaşımı eksikliği yüzünden bir köye beş kez çadır giderken komşu köye günlerce ulaşılamaması ve toplanan yüz milyonlarca dolarlık bağışın akıbetine dair kamuoyunda oluşan derin güvensizlik dalgası, mevcut Web2 sistemlerinin çaresizliğini gözler önüne sermiştir.
          </p>

          {/* Editorial Wide Pull Quote (§4.1) */}
          <div className="py-6 my-4 border-y border-stone-200 text-center">
            <blockquote className="font-serif italic text-xl sm:text-2xl text-stone-800 max-w-2xl mx-auto leading-relaxed">
              "İnsani yardımın en zayıf halkası kaynak yetersizliği değil; kriz anlarında güveni tesis edecek bağımsız, kesintisiz ve şeffaf bir mutabakat altyapısının yokluğudur."
            </blockquote>
            <span className="block mt-2 text-xs font-mono text-stone-500 uppercase tracking-widest">
              — {AUTHOR_NAME}, Web3 Düşünce Egzersizi Notları
            </span>
          </div>

          <p>
            Bu vakanın asıl amacı; afet yönetimini tek bir hükümet kurumunun, tek bir vakfın veya merkezi bir bulut sunucusunun inisiyatifinden çıkarıp; <em>güven gerektirmeyen (trustless)</em>, sansüre dayanıklı, afetzedenin onurunu ve kişisel verilerini koruyan, bağışçının 1 kuruşunun dahi hesabını blok bazında matematiksel kesinlikle veren açık bir kamu altyapısına dönüştürmektir.
          </p>
        </div>
      </article>

      {/* ========================================================================= */}
      {/* 02. PROBLEM VEYA FIRSAT (PROBLEM & LIMITATIONS OF WEB2) */}
      {/* ========================================================================= */}
      <article id="problem" className="scroll-mt-24 pt-12 border-t border-stone-200">
        <header className="mb-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-800 font-mono mb-2">
            <span>Bölüm 02</span>
            <span aria-hidden="true">·</span>
            <span>Mevcut Durum & Yapısal Eksiklikler</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            Problem veya Fırsat: Web2 Mimarilerinin Çöküş Noktaları
          </h2>
        </header>

        <div className="space-y-6 text-stone-700 leading-relaxed text-[16px]">
          <p>
            Birleşmiş Milletler (BM) İnsani İşler Eşgüdüm Ofisi (OCHA) ve bağımsız denetim raporlarına göre, dünya genelinde toplanan insani yardım fonlarının %12 ila %25’i; bürokratik aracı maliyetleri, lojistik sızıntılar, mükerrer tedarikler ve muhasebe usulsüzlükleri nedeniyle hedefine ulaşamadan erimektedir. Bu devasa kayıp yalnızca mali bir sorun değil, afet anında doğrudan can kaybına yol açan sistemsel bir felakettir.
          </p>

          {/* Embedded Documentary Photo (§3.B) */}
          <div className="my-8 rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
            {!cargoImgError ? (
              <img 
                src="/src/assets/images/iot_logistics_relief_cargo_1793550669829.jpg" 
                alt="İnsani yardım kolilerinde kriptografik sensör ve barkod denetimi"
                referrerPolicy="no-referrer"
                onError={() => setCargoImgError(true)}
                className="w-full h-[320px] sm:h-[400px] object-cover"
              />
            ) : (
              <div className="p-8 text-center bg-stone-200 text-stone-700">
                <span className="font-serif font-bold">Lojistik Takip Katmanı</span>
              </div>
            )}
            <div className="p-3 bg-white border-t border-stone-200 text-xs text-stone-500 font-serif italic flex justify-between">
              <span>Şekil 2.1 — Geleneksel kâğıt irsaliye yerine kriptografik donanım mührüyle korunan yardım kargoları.</span>
              <span className="not-italic font-mono text-[11px] text-stone-400">Veri Güvenliği: ISO/IEC + Hash Integrity</span>
            </div>
          </div>

          <h3 className="text-xl font-serif font-semibold text-stone-900 pt-2">
            Mevcut Web2 Çözümleri ve Yapısal Sınırlamaları
          </h3>
          <p>
            Günümüzde afet yardım süreçlerinde kullanılan Web2 teknolojileri; merkezi ERP yazılımları (SAP, Oracle NetSuite), ilişkisel veri tabanları (PostgreSQL, MySQL), ticari banka havale sistemleri (SWIFT, FAST) ve kriz koordinasyon portallarıdır (web formları, Google E-Tablolar, kâğıt tutanaklar). Bu sistemler normal şartlar altında çalışsa da, afet anında şu 4 kritik sınırlamayla çökmektedir:
          </p>

          <div className="space-y-4 my-6">
            <div className="p-5 rounded-lg border border-stone-200 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <ServerCrash className="w-5 h-5 text-amber-900" />
                <h4 className="font-serif font-bold text-stone-900 text-base">
                  1. Tek Hata Noktası (Single Point of Failure)
                </h4>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">
                Web2 sistemleri merkezi sunuculara ve kesintisiz internet erişimine muhtaçtır. Deprem anında veri merkezlerinin elektrik kaybetmesi, fiber hatların kopması veya baz istasyonlarının devrilmesi durumunda merkezi veritabanları tamamen ulaşılamaz hale gelir. Saha ekipleri veri kaydedemez, sistem kilitlenir.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-stone-200 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-amber-900" />
                <h4 className="font-serif font-bold text-stone-900 text-base">
                  2. Veri Siloları ve Kurumlar Arası Rekabet / Güvensizlik
                </h4>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">
                Her yardım kuruluşu ve kamu kurumu kendi kapalı SQL veritabanını çalıştırır. Kuruluşlar, KVKK/GDPR riskleri ve kurumsal rekabet nedeniyle bağışçı ve afetzede listelerini birbiriyle paylaşmaz. Sonuç: Aynı çadır kente 4 farklı dernek yardım yağdırırken, 10 kilometre uzaktaki köylere kimse ulaşamaz; mükerrer yardımlar kaynak israfına sebep olur.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-stone-200 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-amber-900" />
                <h4 className="font-serif font-bold text-stone-900 text-base">
                  3. Şeffaflık İllüzyonu ve Değiştirilebilir (Mutable) Kayıtlar
                </h4>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">
                Web2 veritabanlarında yöneticiler (admin) veriyi geriye dönük değiştirebilir, silebilir veya düzeltebilir. Bağışçılar paralarının nereye gittiğini yalnızca kuruluşun seçtiği halkla ilişkiler bültenlerinden öğrenir. Bağımsız bir vatandaşın veya gazetecinin fon akışını doğrudan ve şüpheye yer bırakmayacak biçimde denetlemesi teknik olarak imkânsızdır.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-stone-200 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-amber-900" />
                <h4 className="font-serif font-bold text-stone-900 text-base">
                  4. Afetzede Mahremiyetinin İhlali ve İtibar Zedelenmesi
                </h4>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">
                Mevcut sistemlerde bir afetzedenin bir koli yardım veya çocuk maması alabilmesi için kimlik fotokopisi, T.C. kimlik numarası, aile nüfus tablosu ve açık adres vermesi zorunlu tutulmaktadır. Afet bölgelerinde çalınan veya açıkta bırakılan bu kâğıtlar ve Excel dosyaları, depremzedeleri dolandırıcıların ve kötü niyetli odakların açık hedefi haline getirmektedir.
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* ========================================================================= */}
      {/* 03. ÇÖZÜM VEYA YENİLİK (THE WEB3 SOLUTION & ARCHITECTURE) */}
      {/* ========================================================================= */}
      <article id="cozum" className="scroll-mt-24 pt-12 border-t border-stone-200">
        <header className="mb-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-800 font-mono mb-2">
            <span>Bölüm 03</span>
            <span aria-hidden="true">·</span>
            <span>Mimari Yenilik & Teknoloji Yığını</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            Çözüm veya Yenilik: Merkeziyetsiz Teknolojiler ve Güven Mimarisi
          </h2>
        </header>

        <div className="space-y-6 text-stone-700 leading-relaxed text-[16px]">
          <p>
            OpenRelief protokolü, merkezi otoriteleri ortadan kaldırarak güveni kod tabanına ve kriptografik ispatlara devreder. Web3’ün temel taşları olan <strong>dağıtık defter teknolojisi (DLT)</strong>, <strong>akıllı sözleşmeler</strong>, <strong>sıfır bilgi ispatları</strong> ve <strong>DePIN donanımları</strong>; bu sorunu kökten çözen bütünleşik bir mimari meydana getirir.
          </p>

          {/* Embedded Cryptographic Concept Visual (§3.B) */}
          <div className="my-8 rounded-xl overflow-hidden border border-stone-200 bg-stone-950">
            {!ledgerImgError ? (
              <img 
                src="/src/assets/images/web3_cryptographic_ledger_concept_1793550668956.jpg" 
                alt="Merkeziyetsiz blokzincir ve sıfır bilgi doğrulama mimarisi"
                referrerPolicy="no-referrer"
                onError={() => setLedgerImgError(true)}
                className="w-full h-[320px] sm:h-[420px] object-cover"
              />
            ) : (
              <div className="p-8 text-center bg-stone-900 text-stone-300">
                <span className="font-serif font-bold">Kriptografik Konsensüs & ZKP Katmanı</span>
              </div>
            )}
            <div className="p-3 bg-stone-900 border-t border-stone-800 text-xs text-stone-400 font-serif italic flex justify-between">
              <span>Şekil 3.1 — Akıllı sözleşme doğrulaması, ZK-Rollup ve değişmez blok yapısı.</span>
              <span className="not-italic font-mono text-[11px] text-stone-400">Layer 2 + Circom zk-SNARKs</span>
            </div>
          </div>

          <h3 className="text-xl font-serif font-semibold text-stone-900 pt-2">
            Merkeziyetsizliğin 4 Temel Sütunu
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="p-5 rounded-lg border border-stone-200 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-5 h-5 text-amber-900" />
                <h4 className="font-serif font-bold text-stone-900 text-base">
                  1. Programlanabilir Şartlı Emanet (Smart Escrow)
                </h4>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">
                Bağışlar bir dernek başkanının veya bürokratın keyfi kararıyla harcanamaz. Akıllı sözleşme mantığı şöyledir: <em>"Eğer A noktasına 500 adet çadır teslim edildiği IoT sensörü ve ZK-saha onayıyla ispatlanırsa, tedarikçiye kilitli 25.000 USDC otomatik aktarılsın."</em> Şart gerçekleşmezse fon bağışçıya iade edilir veya acil rezerv havuzuna aktarılır.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-stone-200 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Network className="w-5 h-5 text-amber-900" />
                <h4 className="font-serif font-bold text-stone-900 text-base">
                  2. DePIN & LoRaWAN Kesintisiz İletişim Ağı
                </h4>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">
                Merkeziyetsiz Fiziksel Altyapı Ağı (DePIN); sahadaki gönüllülerin güneş enerjili LoRaWAN cihazları taşımasıyla kurulur. Bu cihazlar hücresel şebekeye gerek duymadan 10-15 km mesafeden radyo dalgalarıyla konuşur. Yerel işlemler kriptografik olarak imzalanır; bölgeye giren bir uydu terminali (Starlink) ilk teması sağladığında tüm işlemler L2 blokzincirine blok blok kaydedilir.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-stone-200 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-amber-900" />
                <h4 className="font-serif font-bold text-stone-900 text-base">
                  3. Sıfır Bilgi İspatları (zk-SNARKs) ile Mahrem Hak Sahipliği
                </h4>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">
                Afetzede kimliğini açık etmeden bir <strong>Nullifier Hash</strong> üretir. Matematiksel olarak ispatlanan şey şudur: "Bu kanıtı sunan kişi, afet bölgesinde ikamet kaydı bulunan geçerli bir afetzededir VE bu yardım paketini bugün henüz almamıştır." Görevli afetzedenin kim olduğunu göremez, ancak protokol çifte hak talebini (double-claim) kesin olarak engeller.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-stone-200 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-amber-900" />
                <h4 className="font-serif font-bold text-stone-900 text-base">
                  4. IPFS & Arweave ile Değişmez Belgeleme
                </h4>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">
                Tedarik irsaliyeleri, saha hasar tespit uydu fotoğrafları ve teslimat tutanakları merkezi bir sunucu yerine IPFS (InterPlanetary File System) ve kalıcı Arweave blokzincirine yüklenir. Dosyanın içerik karması (CID - Content Identifier) akıllı sözleşmeye mühürlenir. Belgeler asla silinemez veya sansürlenemez.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-serif font-semibold text-stone-900 pt-2">
            Kullanılan Temel Teknolojiler ve Platformlar
          </h3>
          <p>
            OpenRelief protokolü deneysel teorik bir hayal değil, bugün üretim seviyesinde çalışan Web3 standartlarının modüler bir entegrasyonudur:
          </p>

          <div className="overflow-x-auto my-4">
            <table className="w-full text-left text-sm border-collapse border border-stone-200 bg-white">
              <thead>
                <tr className="bg-stone-100 text-stone-800 font-serif">
                  <th className="p-3 border border-stone-200">Teknoloji Katmanı</th>
                  <th className="p-3 border border-stone-200">Kullanılan Protokol / Standart</th>
                  <th className="p-3 border border-stone-200">Protokoldeki İşlevi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-stone-600 font-sans">
                <tr>
                  <td className="p-3 font-semibold text-stone-900 border border-stone-200">Konsensüs & Yürütme</td>
                  <td className="p-3 font-mono text-xs border border-stone-200">Ethereum L2 (Arbitrum / zkSync Era)</td>
                  <td className="p-3 border border-stone-200">Düşük işlem ücreti (&lt;0.01$), saniyeler içinde kesinlik (finality) ve güvenli durum geçişleri.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-stone-900 border border-stone-200">Akıllı Sözleşmeler</td>
                  <td className="p-3 font-mono text-xs border border-stone-200">Solidity / EIP-2535 Diamond Pattern</td>
                  <td className="p-3 border border-stone-200">Aşamalı fon emaneti, modüler yükseltilebilirlik ve çok paydaşlı onay mantığı.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-stone-900 border border-stone-200">Gizlilik & Kimlik</td>
                  <td className="p-3 font-mono text-xs border border-stone-200">Circom + SnarkJS (zk-SNARKs) / ERC-4337</td>
                  <td className="p-3 border border-stone-200">Kişisel kimlik verisini ifşa etmeden hak sahipliği ispatı ve hesap soyutlama ile kolay kullanıcı deneyimi.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-stone-900 border border-stone-200">Fiziksel Veri Bağlantısı</td>
                  <td className="p-3 font-mono text-xs border border-stone-200">Chainlink Decentralized Oracle Network</td>
                  <td className="p-3 border border-stone-200">IoT soğuk zincir sıcaklık sensörleri ve GPS lojistik konum verilerinin on-chain doğrulanması.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-stone-900 border border-stone-200">Kalıcı Depolama</td>
                  <td className="p-3 font-mono text-xs border border-stone-200">IPFS / Filecoin & Arweave</td>
                  <td className="p-3 border border-stone-200">Uydu görüntüleri, faturalar ve hasar ekspertiz raporlarının manipülasyonsuz arşivlenmesi.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </article>

      {/* ========================================================================= */}
      {/* 04. ETKİ VEYA DEĞER, METRİKLER VE RİSKLER (IMPACT, KPIS & RISKS) */}
      {/* ========================================================================= */}
      <article id="etki-deger" className="scroll-mt-24 pt-12 border-t border-stone-200">
        <header className="mb-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-800 font-mono mb-2">
            <span>Bölüm 04</span>
            <span aria-hidden="true">·</span>
            <span>Değer Önerisi, Başarı Metrikleri & Risk Analizi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            Etki veya Değer: Paydaşlar, Ölçüm Kriterleri ve Karşılaşılan Riskler
          </h2>
        </header>

        <div className="space-y-6 text-stone-700 leading-relaxed text-[16px]">
          <h3 className="text-xl font-serif font-semibold text-stone-900">
            Paydaşlara Sağlanan Değer
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
            <div className="p-5 rounded-lg border border-stone-200 bg-white">
              <span className="font-mono text-xs text-stone-500 uppercase block mb-1">Paydaş I</span>
              <h4 className="font-serif font-bold text-stone-900 text-base mb-2">Küresel Bağışçılar</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Bağışçı, fonunun genel bir havuzda buharlaşmadığını; tam olarak hangi tırın deposuna, hangi çadır kente gittiğini explorer üzerinden gerçek zamanlı takip eder. Güven krizi aşılır, mikro bağış hacmi katlanarak büyür.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-stone-200 bg-white">
              <span className="font-mono text-xs text-stone-500 uppercase block mb-1">Paydaş II</span>
              <h4 className="font-serif font-bold text-stone-900 text-base mb-2">Afetzede Topluluklar</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Afetzedeler en zor günlerinde kimlik belgeleriyle sıraya girip mahremiyetlerini ve onurlarını zedelemez. ZKP kartlarıyla saniyeler içinde adil, mükerrersiz ve eşitlikçi bir yardım dağıtımına erişirler.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-stone-200 bg-white">
              <span className="font-mono text-xs text-stone-500 uppercase block mb-1">Paydaş III</span>
              <h4 className="font-serif font-bold text-stone-900 text-base mb-2">STK'lar ve Sahadakiler</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Farklı sivil toplum örgütleri ortak bir kriptografik defter üzerinden koordinasyon sağlar. Kurumlar birbirinin özel verisini görmeden mükerrer yardımı engeller; lojistik kaynak israfı sıfıra iner.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-serif font-semibold text-stone-900 pt-4">
            Başarıyı Ölçüm Kriterleri ve Metrikler (KPI'lar)
          </h3>
          <p>
            Protokolün sahadaki etkinliği ve başarısı spekülatif anlatılarla değil, matematiksel ve operasyonel verilerle ölçülür:
          </p>

          <ul className="space-y-3 pl-4 border-l-2 border-stone-200">
            <li>
              <strong>1. Doğrulanabilir Dağıtım Oranı (On-Chain Auditability Score):</strong> Dağıtılan toplam fon ve malzemenin kaçta kaçının donör cüzdanından afetzede teslimat kanıtına kadar kesintisiz kriptografik iz bıraktığı (Hedef: %100).
            </li>
            <li>
              <strong>2. Tedarik & Lojistik Reaksiyon Süresi (Fulfillment Latency):</strong> Afet çağrısının yapılmasından malzemenin ilk teslimat onayının alınmasına kadar geçen süre (Web2'deki 48-72 saatten &lt;6 saate indirilmesi).
            </li>
            <li>
              <strong>3. İdari Sürtünme ve Sızıntı Oranı (Overhead & Leakage Rate):</strong> Fon transferinde aracı banka ve operasyonel komisyonların toplam fona oranı (Web2'de ortalama %15-20 iken Web3'te &lt;%1 hedefi).
            </li>
            <li>
              <strong>4. Sıfır Veri İhlali (Zero PII Leakage):</strong> Dağıtım sürecinde kamuya açık hale gelen veya üçüncü taraflarca ele geçirilen kişisel kimlik verisi adedi (Hedef: Tam 0).
            </li>
          </ul>

          <h3 className="text-xl font-serif font-semibold text-stone-900 pt-6">
            Karşılaşılan Zorluklar, Riskler ve Çözüm Yaklaşımları
          </h3>
          <p>
            Web3’ün gerçek dünya sorunlarını çözmesindeki en büyük engel kodun kendisi değil, fiziksel dünya ile blokzincir arasındaki arayüzdür. OpenRelief protokolünün karşılaşacağı 4 temel risk ve bunlara getirilen mühendislik çözümleri şunlardır:
          </p>

          <div className="space-y-4 my-4">
            <div className="p-4 rounded-lg border border-stone-200 bg-stone-50">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <h4 className="font-serif font-bold text-stone-900 text-sm">
                  Risk 1: Oracle Problemi ve Fiziksel Sahtecilik
                </h4>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                <strong>Zorluk:</strong> Blokzincir üzerindeki akıllı sözleşme kusursuz çalışsa da, fiziksel dünyadaki bir tır şoförü kutuların içini boşaltıp sensörü tek başına taşıyabilir mi?
                <br />
                <strong>Çözüm:</strong> Çoklu veri oracles doğrulaması. Tek bir sensöre güvenilmez; GPS konumu, ağırlık sensörü, termal mühür ve teslimat noktasında bağımsız 3 farklı afetzede ve görevlinin çoklu imzası (multi-party computation) şart koşulur.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-stone-200 bg-stone-50">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <h4 className="font-serif font-bold text-stone-900 text-sm">
                  Risk 2: Kullanıcı Deneyimi (UX) ve Seed Phrase Bariyeri
                </h4>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                <strong>Zorluk:</strong> Evi yıkılmış bir depremzedeye "12 kelimelik kurtarma parolanı sakla" veya "özel anahtarını imzala" demek gerçek dışıdır.
                <br />
                <strong>Çözüm:</strong> ERC-4337 Hesap Soyutlama (Account Abstraction). Afetzede geleneksel kripto cüzdanı kurmaz; dağıtılan tek kullanımlık NFC afet bilekliği veya yerel SMS kodu arka planda otomatik akıllı hesap (Smart Account) açar. İşlem ücretleri (gas) sponsor sözleşmelerince (Paymaster) sıfır maliyetle karşılanır.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-stone-200 bg-stone-50">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <h4 className="font-serif font-bold text-stone-900 text-sm">
                  Risk 3: Mevzuat, Hükümet Direnci ve Kripto Yasakları
                </h4>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                <strong>Zorluk:</strong> Bazı devletler afet anında tüm bağışların tek bir devlet hesabında toplanmasını zorunlu kılar; bağımsız blokzincir cüzdanlarını engelleyebilir.
                <br />
                <strong>Çözüm:</strong> Hibrit izinli/izinsiz L2 mimarisi. Kamu kurumlarına (AFAD, Kızılay, Valilikler) protokol üzerinde bağımsız denetçi (auditor) düğüm statüsü verilir. Sistem yasal para birimleriyle (stablecoin veya regüle banka API entegrasyonu) uyumlu şeffaf bir 'mutabakat katmanı' olarak konumlandırılır.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* İMZA VE AKADEMİK KÜNYE (SIGNATURE & COLOPHON) */}
        {/* ========================================================================= */}
        <div className="mt-16 pt-10 border-t-2 border-stone-300">
          <div className="p-8 rounded-xl bg-white border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-stone-400 font-mono block mb-1">
                Düşünce Egzersizi Tamamlanma & Onay Beyanı
              </span>
              <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">
                Analiz Raporu Hazırlayıcısı
              </h3>
              <p className="text-sm text-stone-600 max-w-xl leading-relaxed">
                Bu analiz; Web3 teknolojilerinin afaki spekülasyonların ötesinde, insan hayatını doğrudan ilgilendiren kriz anlarında nasıl şeffaf, dirençli ve mahremiyet odaklı bir kamu altyapısına dönüşebileceğini kanıtlamak üzere hazırlanmıştır.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-stone-50 border border-stone-200 shrink-0 text-center min-w-[220px]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-2">
                Resmi İmzacı
              </span>
              <div className="font-serif italic text-2xl font-bold text-stone-900 border-b border-stone-300 pb-2 mb-2">
                {AUTHOR_NAME}
              </div>
              <span className="text-xs text-stone-500 font-mono block">
                Tarih: {REPORT_DATE}
              </span>
              <span className="text-[10px] text-stone-400 font-mono block mt-1">
                Durum: Nihai Değerlendirme Teslimi
              </span>
            </div>
          </div>
        </div>

      </article>

    </div>
  );
};
