import React, { useState } from 'react';
import { Send, CheckCircle2, Mail, Phone, MapPin, Inbox } from 'lucide-react';
import { ContactMessage } from '../types';

interface ContactSectionProps {
  onSendMessage: (msg: ContactMessage) => void;
  onOpenMessagesModal: () => void;
  messagesCount: number;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onSendMessage,
  onOpenMessagesModal,
  messagesCount,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Lütfen adınızı ve soyadınızı giriniz.';
    if (!email.trim() || !email.includes('@')) errs.email = 'Geçerli bir e-posta adresi giriniz.';
    if (!subject.trim()) errs.subject = 'Lütfen bir konu belirtiniz.';
    if (!message.trim() || message.length < 10)
      errs.message = 'Mesajınız en az 10 karakter olmalıdır.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || '+90 (Belirtilmedi)',
      subject: subject.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    onSendMessage(newMsg);
    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
    setErrors({});
  };

  return (
    <section id="contact" className="py-20 lg:py-28 border-b border-neutral-800 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Contact Info & SmartEdu message info */}
          <div className="lg:col-span-5 space-y-6">
            <p className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
              05. İletişim & Proje Talebi
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Birlikte Yeni Bir Başarı Hikayesi Yazalım
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed">
              SmartEdu projemizdeki dinamik form mekanizması ile hazırlanan bu alandan mesajınızı anında iletebilirsiniz. Ekibimiz en geç 24 saat içerisinde dönüş sağlayacaktır.
            </p>

            {/* Direct Contact Cards */}
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-neutral-800 text-amber-400 flex items-center justify-center shrink-0 border border-neutral-700">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400">Ajans Ofisimiz</p>
                  <p className="text-sm font-medium text-white">
                    Galata Kulesi Yanı, Beyoğlu / İstanbul
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-neutral-800 text-amber-400 flex items-center justify-center shrink-0 border border-neutral-700">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400">Doğrudan E-Posta</p>
                  <p className="text-sm font-medium text-white">iletisim@enesozturk.agency</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-neutral-800 text-amber-400 flex items-center justify-center shrink-0 border border-neutral-700">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400">Telefon / WhatsApp</p>
                  <p className="text-sm font-medium text-white">+90 (212) 555 01 24</p>
                </div>
              </div>
            </div>

            {/* SmartEdu Messages Inbox trigger */}
            <div className="pt-2">
              <button
                onClick={onOpenMessagesModal}
                className="w-full py-3 px-4 rounded-xl border border-neutral-800 hover:border-amber-400/40 bg-neutral-900/80 hover:bg-neutral-900 text-xs text-neutral-300 hover:text-white flex items-center justify-between transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold">SmartEdu Gelen Kutusu</span>
                </div>
                <span className="text-amber-400 font-bold tabular-nums">
                  {messagesCount} Mesaj Kayıtlı
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: Active Interactive Form (SmartEdu style) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-xl">
              {submitted ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in">
                  <div className="w-14 h-14 mx-auto rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center border border-amber-400/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Mesajınız Başarıyla İletildi!</h3>
                  <p className="text-sm text-neutral-300 max-w-md mx-auto">
                    Talebiniz SmartEdu mesajlaşma sistemine kaydedildi. Enes Öztürk Ajans ekibi olarak en kısa sürede sizinle iletişime geçeceğiz.
                  </p>
                  <div className="pt-4 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                    >
                      Yeni Mesaj Gönder
                    </button>
                    <button
                      onClick={onOpenMessagesModal}
                      className="px-4 py-2 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
                    >
                      Gelen Kutusunu İncele
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        Adınız & Soyadınız *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Örn: Mehmet Can"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                      />
                      {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        E-Posta Adresiniz *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="mehmet@sirket.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                      />
                      {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        Telefon Numaranız
                      </label>
                      <input
                        type="tel"
                        placeholder="+90 532 000 00 00"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        Proje Konusu *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Örn: Yeni E-Ticaret & Portföy Sitesi"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                      />
                      {errors.subject && (
                        <p className="text-xs text-red-400 mt-1">{errors.subject}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                      Mesajınız & Proje Detayları *
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Projenizin hedefleri, bütçe aralığınız ve zaman planınız hakkında bilgi verebilirsiniz..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 resize-y"
                    />
                    {errors.message && (
                      <p className="text-xs text-red-400 mt-1">{errors.message}</p>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <p className="text-[11px] text-neutral-400">
                      SmartEdu mimarisi doğrultusunda mesajınız kalıcı olarak kaydedilir.
                    </p>
                    <button
                      type="submit"
                      className="px-6 py-3 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-lg transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Mesajı Gönder</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
