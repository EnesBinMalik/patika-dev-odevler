import React from 'react';
import { Feather, FileCheck, CheckCircle2, ShieldCheck, Award } from 'lucide-react';
import { RESEARCH_NOTE } from '../data/happinessData';

export const AnalystSignatureNote: React.FC = () => {
  return (
    <section className="py-14 bg-[#FBF9F5] border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Kicker */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 border border-stone-300 rounded-full text-xs font-semibold text-stone-700 font-mono uppercase tracking-wider">
            <Feather className="w-3.5 h-3.5 text-amber-900" />
            <span>Resmi Analist Raporu & İmzalı Mütalaa</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
            Daha Mutlu Bir Dünya İçin Sosyal Bilim ve Politika Manifestosu
          </h2>
          <p className="text-xs text-stone-500 font-mono">
            Hazırlayan: <span className="font-bold text-stone-900">{RESEARCH_NOTE.author}</span> · {RESEARCH_NOTE.title}
          </p>
        </div>

        {/* Editorial Body Card */}
        <div className="bg-white border border-stone-300 rounded-2xl p-6 sm:p-10 shadow-xs space-y-8">
          <div className="prose prose-stone max-w-none text-stone-700 text-sm sm:text-base leading-relaxed space-y-4 font-serif">
            <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-stone-950">
              Bu analitik çalışma, ilk kez 2012 yılında Birleşmiş Milletler Sürdürülebilir Kalkınma Çözümleri Ağı (SDSN) 
              öncülüğünde yayınlanmaya başlanan Dünya Mutluluk Raporu verilerini temel alarak hazırlanmıştır. 
              Geleneksel iktisadın gayri safi yurtiçi hasılaya (GSYİH) sıkışan dar bakış açısı, insanoğlunun gerçek 
              esenliğini açıklamakta yetersiz kalmaktadır.
            </p>

            <p>
              Mutluluk bir tesadüf veya yalnızca bireysel bir duygu hali değildir; aksine toplumların inşa ettiği 
              hukuk, sosyal destek ağları, sağlık güvencesi, şeffaf kamu idaresi ve sivil cömertliğin ortaklaşa ürettiği 
              somut bir dengedir. 2015, 2016 ve 2017 yıllarını kapsayan 155 ülkelik bu inceleme, 
              üç hayati soruya ampirik yanıtlar sunmuştur:
            </p>
          </div>

          {/* Three Questions Formulated by Enes Öztürk */}
          <div className="space-y-4 border-y border-stone-200 py-6">
            {RESEARCH_NOTE.threeQuestionsAnswerSummary.map((item, idx) => (
              <div key={idx} className="p-4 bg-stone-50 border border-stone-200 rounded-lg">
                <div className="text-xs font-serif font-bold text-stone-950 mb-1.5 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <span>{item.question}</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed pl-7">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Policy Recommendations for Happier Societies */}
          <div className="space-y-3">
            <h4 className="text-sm font-serif font-bold text-stone-900">
              Toplumları Daha Mutlu Kılmak İçin 4 Stratejik İlke:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700">
              <div className="p-3 bg-[#FBF9F5] border border-stone-200 rounded">
                <strong className="text-stone-900 block mb-0.5">1. Sosyal Destek Ağı İnşası:</strong>
                Yalnızlık ve izolasyonu kıran mahalle dayanışması, güçlü aile politikaları ve sivil inisiyatifler en ucuz ve en etkili antidepresandır.
              </div>
              <div className="p-3 bg-[#FBF9F5] border border-stone-200 rounded">
                <strong className="text-stone-900 block mb-0.5">2. Kurumsal Güven ve Sıfır Rüşvet:</strong>
                Halkın devlet kurumlarına ve adalete güven duyduğu ülkeler ekonomik dalgalanmaları dahi mutluluk kaybetmeden aşabilmektedir.
              </div>
              <div className="p-3 bg-[#FBF9F5] border border-stone-200 rounded">
                <strong className="text-stone-900 block mb-0.5">3. Bireysel Seçim Özgürlüğü:</strong>
                İnsanların kendi hayat rotalarını belirleyebildikleri, fikirlerini özgürce ifade ettikleri toplumlarda yaşam sevinci katlanmaktadır.
              </div>
              <div className="p-3 bg-[#FBF9F5] border border-stone-200 rounded">
                <strong className="text-stone-900 block mb-0.5">4. Cömertlik ve Dayanışma Ruhu:</strong>
                Başkalarına yardım etmek, veren tarafın ruhsal doyumunu doğrudan artırır. Gönüllülük kültürü kamu refahını çoğaltır.
              </div>
            </div>
          </div>

          {/* Formal Analyst Signature Block */}
          <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="text-xs text-stone-500 uppercase tracking-widest font-mono">
                Rapor Metodolojisi & Veri Doğrulama
              </div>
              <div className="text-xs text-stone-700">
                World Happiness Report 2012–2017 Gallup World Poll & SDSN Veri Tabanı
              </div>
              <div className="text-[11px] text-stone-400">
                Tüm faktörler Cantril Merdiveni (0-10 ölçeği) uyarınca modellenmiştir.
              </div>
            </div>

            {/* Stylized Signature Container */}
            <div className="p-4 bg-[#F4EFE6] border border-stone-300 rounded-xl min-w-[240px] text-center">
              <div className="text-[10px] text-stone-500 uppercase tracking-wider font-mono">
                Veri Analisti & Yazar İmzası
              </div>
              {/* Monogram / Signature Presentation */}
              <div className="font-serif italic text-2xl font-bold text-stone-950 py-1.5 tracking-tight border-b border-stone-400">
                Enes Öztürk
              </div>
              <div className="text-xs font-semibold text-stone-800 mt-1">
                Enes Öztürk
              </div>
              <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                Sosyal Refah ve Veri Analitiği
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
