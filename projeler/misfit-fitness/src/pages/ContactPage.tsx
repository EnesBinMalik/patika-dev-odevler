import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { sendMessage, currentUser } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError('Lütfen adınızı ve soyadınızı belirtiniz.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }

    if (!subject.trim()) {
      setError('Lütfen mesajınız için bir konu başlığı seçiniz veya yazınız.');
      return;
    }

    if (message.trim().length < 10) {
      setError('Mesajınız en az 10 karakterden oluşmalıdır.');
      return;
    }

    sendMessage({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      subject: subject.trim(),
      message: message.trim()
    });

    setSubmitted(true);
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Bize Ulaşın</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-wide uppercase">
          İLETİŞİM VE <br />
          <span className="text-amber-400">ÜYELİK BİLGİ MERKEZİ</span>
        </h1>

        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
          Seans kayıtları, birebir antrenörlük ve stüdyomuzu ziyaret için bize mesaj gönderebilir ya da merkezimizi doğrudan arayabilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info (4 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6 shadow-xl">
            <h3 className="font-display text-2xl font-bold text-white uppercase tracking-wide">
              Misfit Kulüp Bilgileri
            </h3>
            
            <p className="text-xs text-neutral-400 leading-relaxed">
              Sorularınız, antrenman planlama veya kurumsal üyelikler için ekibimiz haftanın 7 günü hizmetinizdedir.
            </p>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold mb-0.5">Tesis Adresi:</strong>
                  <span className="text-neutral-400 leading-relaxed">
                    Levent Mah. Büyükdere Cad. No:142/A (Kanyon Yanı), Beşiktaş / İstanbul
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80">
                <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold mb-0.5">Telefon & WhatsApp:</strong>
                  <span className="text-neutral-400">+90 (212) 345 67 89</span>
                  <div className="text-[11px] text-neutral-500 mt-0.5">Hızlı destek için WhatsApp hattımız aktiftir.</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80">
                <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold mb-0.5">E-posta:</strong>
                  <span className="text-neutral-400">info@misfitproje.com / contact@misfit.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold mb-0.5">Çalışma Saatleri:</strong>
                  <div className="text-neutral-400 space-y-0.5">
                    <div>Hafta İçi: 06:30 – 23:00</div>
                    <div>Hafta Sonu: 08:00 – 21:00</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-10 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-6">
            <div>
              <h3 className="font-display text-2xl font-bold text-white uppercase tracking-wide">
                Bize Mesaj Gönderin
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                İlettiğiniz mesaj doğrudan yönetim panelimize (Admin Gelen Kutusu) aktarılacaktır.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Mesajınız Başarıyla İletildi!</span>
                </div>
                <p className="text-xs text-emerald-300 leading-relaxed">
                  Talebiniz kaydedildi. Eğitmenlerimiz ve yönetim ekibimiz mesajınızı inceleyerek en geç 2 saat içinde dönüş yapacaktır.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-neutral-950 text-xs font-bold rounded-lg transition-colors"
                >
                  Yeni Bir Mesaj Gönder
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Adınız Soyadınız *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Örn: Ahmet Yılmaz"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      E-posta Adresiniz *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ad@ornek.com"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Telefon Numaranız
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0532 000 00 00"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Konu Başlığı *
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Örn: CrossFit Seans Kaydı / PT Bilgisi"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Mesajınız *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Merak ettiğiniz tüm detayları buraya yazabilirsiniz..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Mesajı Gönder (Yönetici Paneline İlet)</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
