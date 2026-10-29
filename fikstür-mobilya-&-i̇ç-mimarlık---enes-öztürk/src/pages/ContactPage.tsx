import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

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

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError('Lütfen tüm zorunlu alanları (*) doldurunuz.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }

    sendMessage(name.trim(), email.trim(), phone.trim(), subject.trim(), message.trim());
    setSubmitted(true);
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Page Header */}
      <div className="max-w-2xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800">
          <span>İletişim & Randevu</span>
          <span aria-hidden="true">·</span>
          <span>Fikstür Atölye</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 font-display">
          Bizimle İletişime Geçin
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Özel ölçü siparişleriniz, mimari proje ortaklıkları veya showroom ziyareti için mesaj bırakabilirsiniz. Enes Öztürk ve atölye ekibimiz 24 saat içinde dönüş yapacaktır.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-stone-200 shadow-xs">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-stone-900 font-display">
                Mesajınız Başarıyla İletildi!
              </h2>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                Talebiniz Fikstür yönetim masasına ve Enes Öztürk'ün incelemesine sunuldu. E-posta veya telefon yoluyla sizinle irtibata geçeceğiz.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-5 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Yeni Bir Mesaj Gönder
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h2 className="text-lg font-bold text-stone-900 font-display mb-2">
                İletişim Formu
              </h2>

              {error && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block font-semibold text-stone-700 mb-1">
                    Adınız ve Soyadınız *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Örn: Selin Yılmaz"
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block font-semibold text-stone-700 mb-1">
                    E-Posta Adresiniz *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@alanadi.com"
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-phone" className="block font-semibold text-stone-700 mb-1">
                    Telefon Numaranız
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+90 (5XX) XXX XX XX"
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block font-semibold text-stone-700 mb-1">
                    Konu Başlığı *
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Örn: Butik Otel Mobilya Talebi"
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="block font-semibold text-stone-700 mb-1">
                  Mesajınız & Mimari Notlarınız *
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mobilya modeli, adet, mekan özellikleri veya randevu saati hakkında bilgi verebilirsiniz..."
                  className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Mesajı Gönder</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Studio Info & Location */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-100 p-6 rounded-2xl border border-stone-200 space-y-5">
            <h2 className="text-base font-bold text-stone-900 font-display">
              Showroom & Mimarlık Ofisi
            </h2>

            <div className="space-y-4 text-xs text-stone-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-stone-900 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-900">Atölye Adresi</p>
                  <p>Caferağa Mah. Şair Nefi Sok. No: 18/A</p>
                  <p>Moda, Kadıköy / İstanbul</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-stone-900 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-900">Doğrudan Hat</p>
                  <p>+90 (216) 418 20 40</p>
                  <p>+90 (532) 412 89 20 (WhatsApp Rezervasyon)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-stone-900 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-900">E-Posta</p>
                  <p>info@fikstur.com</p>
                  <p>enes.ozturk@fikstur.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-stone-900 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-900">Çalışma Saatleri</p>
                  <p>Pazartesi - Cuma: 09:30 - 18:30</p>
                  <p>Cumartesi: 10:00 - 17:00 (Randevulu Ziyaret)</p>
                  <p>Pazar: Kapalı</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Map / Location Preview */}
          <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-200 p-5 space-y-2 text-xs">
            <div className="flex items-center justify-between text-stone-700">
              <span className="font-bold font-display">Moda Showroom Lokasyonu</span>
              <span className="text-[11px] text-amber-800 font-medium">Kadıköy Sahil 300m</span>
            </div>
            <p className="text-stone-500 text-[11px] leading-relaxed">
              Tramvay Moda Caddesi durağından 2 dakika yürüme mesafesinde. Atölye girişinde otopark imkanı mevcuttur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
