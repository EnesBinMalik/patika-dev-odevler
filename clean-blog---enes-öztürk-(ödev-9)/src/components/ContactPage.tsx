import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, Phone } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSent(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Info Column */}
        <div className="md:col-span-5 bg-stone-900 text-stone-100 p-8 rounded-2xl border border-stone-800 space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-teal-400">
              İletişime Geçin
            </span>
            <h2 className="font-serif text-3xl font-bold text-white mt-1">
              Enes Öztürk
            </h2>
            <p className="text-xs text-stone-400 mt-2 leading-relaxed">
              Clean Blog projesi, Node.js veya yazılım geliştirme üzerine herhangi bir sorunuz ya da geri bildiriminiz olursa çekinmeden yazabilirsiniz.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-stone-800 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-teal-400 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-stone-400 block">E-Posta</span>
                <a
                  href="mailto:enesbino38@gmail.com"
                  className="font-medium text-stone-200 hover:text-teal-300 transition"
                >
                  enesbino38@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-teal-400 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-stone-400 block">Konum</span>
                <span className="font-medium text-stone-200">Türkiye</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-stone-800/80 rounded-xl border border-stone-700 text-xs text-stone-300 space-y-1">
            <strong className="text-teal-400 font-mono block">Ödev 9 İmzası</strong>
            <p>Bu proje Enes Öztürk tarafından hazırlanmış ve doğrulanmıştır.</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 bg-white p-8 rounded-2xl border border-stone-200 shadow-xs">
          <h3 className="font-serif text-2xl font-bold text-stone-900 mb-1">
            Mesaj Gönderin
          </h3>
          <p className="text-xs text-stone-500 mb-6">
            Aşağıdaki form üzerinden doğrudan iletişime geçebilirsiniz.
          </p>

          {sent ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-serif text-lg font-bold text-emerald-950">
                Mesajınız Alındı!
              </h4>
              <p className="text-xs text-emerald-800">
                Teşekkürler, mesajınız Enes Öztürk'e başarıyla iletildi.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-3 px-4 py-1.5 text-xs font-semibold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition"
              >
                Yeni Mesaj Gönder
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Adınız Soyadınız
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Adınız Soyadınız"
                  className="w-full px-4 py-2.5 text-stone-900 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  E-Posta Adresiniz
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@mail.com"
                  className="w-full px-4 py-2.5 text-stone-900 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Mesajınız
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mesajınızı buraya yazınız..."
                  className="w-full px-4 py-2.5 text-stone-900 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-xs transition"
              >
                <Send className="w-4 h-4" />
                <span>Mesajı İlet</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
