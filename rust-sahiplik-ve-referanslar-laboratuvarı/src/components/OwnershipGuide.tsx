import React, { useState } from 'react';
import { BookOpen, Check, X, Shield, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';

export const OwnershipGuide: React.FC = () => {
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<{ [key: number]: number }>({});
  const [showExplanation, setShowExplanation] = useState<{ [key: number]: boolean }>({});

  const quizzes = [
    {
      id: 1,
      question: 'concatenate_strings fonksiyonuna neden String yerine &str parametresi veriyoruz?',
      options: [
        'Çünkü Rust String parametresi verilmesine kesinlikle izin vermez.',
        'String parametresi sahiplik transferine (move) yol açar; &str ise veriyi taşımadan ödünç almamızı sağlar ve string1/string2 main içinde geçerli kalır.',
        '&str parametresi heap belleğini otomatik olarak iki katına çıkarır.',
      ],
      correct: 1,
      explanation: 'Harika! `&str` dize dilimi referansıdır. Yalnızca okuma yetkisiyle ödünç alır. Eğer `String` kullansaydık, main içindeki `string1` ve `string2` sahipliklerini fonksiyona devredip geçersiz kalırdı (Move semantics).',
    },
    {
      id: 2,
      question: 'result.push_str(s1) çağrıldığında orijinal string1 verisi ne olur?',
      options: [
        'string1 içeriği silinir ve result değişkenine aktarılır.',
        'string1 içeriği okunur ve karakterlerin kopyası result için ayrılan heap alanına yazılır; string1 aynen korunur.',
        'string1 doğrudan result ile aynı heap adresini paylaşır ve tek bir değişken haline gelir.',
      ],
      correct: 1,
      explanation: 'Kesinlikle doğru! `push_str()` s1 diliminin baktığı baytları kopyalayıp result\'ın heap tamponuna ekler. string1\'in sahipliği veya özgün heap tamponu hiçbir şekilde bozulmaz.',
    },
    {
      id: 3,
      question: 'main() fonksiyonu tamamlandığında bellek nasıl temizlenir?',
      options: [
        'Arka plandaki JavaScript tarzı Garbage Collector (Çöp Toplayıcı) belleği tarayarak temizler.',
        'Programcı elle free(string1) veya delete çağırmak zorundadır.',
        'Rust derleyicisi kapsam sonunda (scope end) otomatik olarak RAII kuralıyla drop() çağırır; 0 çöp toplayıcı maliyetiyle bellek anında iade edilir.',
      ],
      correct: 2,
      explanation: 'Tebrikler! Rust çöp toplayıcı kullanmaz. Değişken kapsam dışına çıktığı an, derleyici tarafından yerleştirilen drop() fonksiyonu çalışır ve ayrılan tüm heap baytları deterministik şekilde işletim sistemine iade edilir.',
    },
  ];

  const handleSelectAnswer = (qIndex: number, optIndex: number) => {
    setSelectedQuizAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
    setShowExplanation((prev) => ({ ...prev, [qIndex]: true }));
  };

  return (
    <section id="sahiplik-rehberi" className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              Rust Sahiplik (Ownership) ve Ödünç Alma (Borrowing) Kılavuzu
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enes Öztürk ders notları: Bellek sızıntılarını ve çökmelerini önleyen 3 temel kural
          </p>
        </div>

        <div className="text-xs text-amber-400 font-mono bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
          Enes Öztürk Akademi Notları
        </div>
      </div>

      {/* 3 Core Rules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold font-mono text-xs">
            1
          </div>
          <h3 className="text-xs font-bold text-white">Her Değerin Tek Bir Sahibi Vardır</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Rust'ta her değişken, taşıdığı verinin tek ve mutlak sahibidir (Owner). Bir veri parçasının birden fazla sahibi olamaz.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-bold font-mono text-xs">
            2
          </div>
          <h3 className="text-xs font-bold text-white">Bir Anda Yalnızca Bir Sahip Olabilir</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Bir değişkeni başka bir fonksiyona değer olarak aktardığınızda sahiplik devredilir (Move). Eski değişken artık kullanılamaz.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono text-xs">
            3
          </div>
          <h3 className="text-xs font-bold text-white">Kapsam Bittiğinde Bellek İade Edilir</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Sahip olan değişken tanımlandığı süslü parantezden (<code className="text-amber-300">{'}'}</code>) çıktığında Rust otomatik olarak <code className="text-emerald-300 font-mono">drop()</code> çağırır.
          </p>
        </div>
      </div>

      {/* Comparison: String vs &str */}
      <div className="p-5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-400" />
          Kavram Karşılaştırması: String vs &amp;str (Dize Dilimi)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-mono font-bold text-amber-400 flex items-center justify-between">
              <span>String (Sahip - Owned)</span>
              <span className="text-[10px] text-slate-500">24 bayt Stack + Heap</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Heap belleğinde saklanan, dinamik olarak büyüyebilen, küçülebilen ve UTF-8 kodlanmış metin tamponudur. Yığın üzerinde 3 parça veri tutar: <strong>işaretçi (ptr)</strong>, <strong>uzunluk (len)</strong> ve <strong>kapasite (capacity)</strong>.
            </p>
            <div className="text-[11px] font-mono text-slate-400 bg-slate-950 p-2 rounded">
              let s = String::from("Merhaba");
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-mono font-bold text-sky-400 flex items-center justify-between">
              <span>&amp;str (Ödünç - String Slice)</span>
              <span className="text-[10px] text-slate-500">16 bayt Stack</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Herhangi bir dize verisine bakan değişmez bir dilim referansıdır. Yalnızca <strong>işaretçi (ptr)</strong> ve <strong>uzunluk (len)</strong> tutar. Asla heap verisini kopyalamaz; yalnızca ödünç alarak okur.
            </p>
            <div className="text-[11px] font-mono text-slate-400 bg-slate-950 p-2 rounded">
              fn oku(dilim: &amp;str) {'{ ... }'}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Quick Quiz */}
      <div className="pt-2 border-t border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Öğrenci Kavrama Testi (Anında Değerlendirme)
          </h3>
        </div>

        <div className="space-y-4">
          {quizzes.map((quiz, qIdx) => {
            const selected = selectedQuizAnswers[qIdx];
            const isAnswered = selected !== undefined;
            const isCorrect = selected === quiz.correct;

            return (
              <div key={quiz.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                <div className="text-xs font-semibold text-slate-200 flex items-start gap-2">
                  <span className="font-mono text-amber-400">Soru {qIdx + 1}:</span>
                  <span>{quiz.question}</span>
                </div>

                <div className="space-y-2">
                  {quiz.options.map((opt, optIdx) => {
                    const isThisSelected = selected === optIdx;
                    let optStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                    if (isAnswered) {
                      if (optIdx === quiz.correct) {
                        optStyle = 'bg-emerald-950/40 border-emerald-600 text-emerald-200 font-medium';
                      } else if (isThisSelected) {
                        optStyle = 'bg-rose-950/40 border-rose-600 text-rose-200';
                      } else {
                        optStyle = 'bg-slate-900/40 border-slate-800/40 text-slate-500';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isAnswered}
                        onClick={() => handleSelectAnswer(qIdx, optIdx)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between gap-2 ${optStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && optIdx === quiz.correct && (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {isAnswered && isThisSelected && optIdx !== quiz.correct && (
                          <X className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div
                    className={`p-3 rounded-lg text-xs leading-relaxed ${
                      isCorrect ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-800/40' : 'bg-rose-950/30 text-rose-300 border border-rose-800/40'
                    }`}
                  >
                    {quiz.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
