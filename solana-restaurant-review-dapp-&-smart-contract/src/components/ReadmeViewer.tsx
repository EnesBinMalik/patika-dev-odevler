import React, { useState } from 'react';
import { BookOpen, Check, Copy } from 'lucide-react';

export const ReadmeViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Copy the markdown source
    fetch('/README.md')
      .then((res) => res.text())
      .then((text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-400/10 rounded-lg border border-amber-400/20">
            <BookOpen className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Proje Dokümantasyonu (README.md)
            </h2>
            <p className="text-xs text-slate-400">
              Mezuniyet projesi için hazırlanan kapsamlı teknik sözleşme ve dApp raporu
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer border border-slate-700/60"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kopyalandı</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Markdown Kopyala</span>
            </>
          )}
        </button>
      </div>

      {/* Styled Documentation Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-8 space-y-8 text-slate-200">
        
        {/* Title & Author Sign-off */}
        <div className="pb-6 border-b border-slate-800">
          <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-1">
            Solana Developer Graduation Project
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Solana Restaurant Review Smart Contract & Web3 dApp
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="text-white font-medium">Geliştirici: <span className="text-amber-400">Enes Öztürk 🔥</span></span>
            <span aria-hidden="true">·</span>
            <span>E-posta: enesbino38@gmail.com</span>
            <span aria-hidden="true">·</span>
            <span>Açık Kaynak (Open-Source Web3)</span>
          </div>
        </div>

        {/* Section 1: Overview */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            1. Proje Genel Bakış ve Amaç
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Bu proje, Solana blokzinciri üzerinde çalışan merkeziyetsiz bir restoran inceleme ve derecelendirme akıllı sözleşmesidir.
            Orijinal Movie Review sözleşmesinde durum (account state) yalnızca başlık, puan ve açıklama tutmaktaydı.
            Bu nihai projede, restoranların konumuna göre de listelenmesi ve filtrelenebilmesi için <strong>`location` (konum)</strong> alanı tüm sözleşme ve ön yüz mimarisine eklenmiştir.
          </p>
        </section>

        {/* Section 2: Step-by-Step Breakdown */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-white">
            2. Adım Adım Yapılan Değişiklikler
          </h2>
          
          <div className="space-y-3 text-sm">
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
              <span className="font-semibold text-amber-400 block">
                Adım 1: AccountState'e `location` Eklenmesi (`state.rs`)
              </span>
              <p className="text-xs text-slate-300">
                Solana PDA hesabı içinde saklanacak veriyi tutan <code className="text-amber-300">AccountState</code> yapısına <code className="text-amber-300">pub location: String</code> eklendi.
                Kira muafiyeti ve hesap boyutu hesaplayan <code className="text-amber-300">get_account_size</code> fonksiyonu 4 baytlık uzunluk öneki + konum karakter boyutu eklenecek biçimde güncellendi.
              </p>
            </div>

            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
              <span className="font-semibold text-blue-400 block">
                Adım 2: ReviewInstruction ve ReviewPayload'a `location` Eklenmesi (`instruction.rs`)
              </span>
              <p className="text-xs text-slate-300">
                İstemciden gönderilen <code className="text-blue-300">ReviewPayload</code> yapısına ve program içi talimatları temsil eden <code className="text-blue-300">ReviewInstruction::AddReview</code> ve <code className="text-blue-300">ReviewInstruction::UpdateReview</code> varyantlarına <code className="text-blue-300">location: String</code> eklendi.
              </p>
            </div>

            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
              <span className="font-semibold text-purple-400 block">
                3. Adım: `unpack` Fonksiyonunda `location` Değerinin Açılması (`instruction.rs`)
              </span>
              <p className="text-xs text-slate-300">
                Gelen bayt akışından Borsh ile çözümlenen <code className="text-purple-300">ReviewPayload</code> nesnesinin <code className="text-purple-300">payload.location</code> verisi, hem ekleme (0) hem güncelleme (1) durumunda talimat nesnesine aktarıldı.
              </p>
            </div>

            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
              <span className="font-semibold text-emerald-400 block">
                4. Adım: `add_restaurant_review` ve `update_restaurant_review` İçinde Saklanması (`processor.rs`)
              </span>
              <p className="text-xs text-slate-300">
                PDA hesabı oluşturulurken ve güncellenirken, <code className="text-emerald-300">AccountState</code> içerisindeki <code className="text-emerald-300">account_state.location = location;</code> ataması yapıldı ve Borsh serileştirmesi ile <code className="text-emerald-300">account_data</code> içerisine yazıldı.
              </p>
            </div>

            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
              <span className="font-semibold text-amber-300 block">
                Bonus: Ön Yüzün Konum Sorguları ve Ekleme ile Genişletilmesi
              </span>
              <p className="text-xs text-slate-300">
                React dApp ön yüzünde konuma göre arama, şehir filtreleri (İstanbul, İzmir, Ankara, Antalya, Muğla vb.), inceleme ekleme/güncelleme modalleri, canlı Borsh hex bayt analizörü ve gerçek PDA türetim hesaplayıcısı entegre edildi.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Build & Deploy CLI */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            3. Derleme ve Dağıtım Rehberi (CLI Commands)
          </h2>
          <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs text-slate-300 space-y-2 border border-slate-800">
            <div><span className="text-slate-500"># 1. Rust sözleşmesini derle</span></div>
            <div className="text-amber-400">cd program && cargo build-sbf</div>
            <div className="pt-2"><span className="text-slate-500"># 2. Solana Devnet ağına bağlan</span></div>
            <div className="text-amber-400">solana config set --url https://api.devnet.solana.com</div>
            <div className="pt-2"><span className="text-slate-500"># 3. Test için musluktan SOL airdrop et</span></div>
            <div className="text-amber-400">solana airdrop 2</div>
            <div className="pt-2"><span className="text-slate-500"># 4. Programı Solana Devnet'e yükle (Deploy)</span></div>
            <div className="text-amber-400">solana program deploy target/deploy/solana_restaurant_review.so</div>
          </div>
        </section>

        {/* Section 4: PDA and Serialization */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            4. Solana PDA & Tohum Mimarisi
          </h2>
          <p className="text-sm text-slate-300">
            Her restoran incelemesi, Solana üzerinde tekil bir <strong>Program Derived Address (PDA)</strong> hesabı olarak saklanır. Tohumlar (seeds):
          </p>
          <div className="p-3 bg-slate-950 rounded-lg font-mono text-xs text-amber-300 border border-slate-800">
            seeds = [ initializer_pubkey.as_ref(), title.as_bytes() ]
          </div>
          <p className="text-xs text-slate-400">
            Bu sayede bir kullanıcı aynı restoran için sadece bir inceleme oluşturabilir; daha sonra puanını, açıklamasını veya konumunu güncellemek istediğinde aynı PDA hesabı üzerinde güncelleme işlemi yürütülür.
          </p>
        </section>

        {/* Signature Box */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-semibold">Enes Öztürk 🔥</span>
            <span>· Web3 Developer & Smart Contract Engineer</span>
          </div>
          <div>
            <span>Mezuniyet Bitirme Projesi Başarıyla Tamamlandı</span>
          </div>
        </div>

      </div>
    </div>
  );
};
