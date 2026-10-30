import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSent(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setIsSent(false), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 font-sans">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
          İletişime Geçin
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Clean Blog projesi, Heroku dağıtımı veya MongoDB Atlas mimarisi hakkında her türlü soru, öneri veya geri bildiriminiz için mesaj gönderebilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Side */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            <h3 className="font-bold text-slate-900 text-base mb-4">Geliştirici İletişim</h3>
            
            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-slate-800">E-posta</div>
                  <a href="mailto:enesbino38@gmail.com" className="text-cyan-800 hover:underline break-all text-xs">
                    enesbino38@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-slate-800">Konum</div>
                  <div className="text-xs text-slate-500">Türkiye · Uzaktan / Remote</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-slate-800">Proje</div>
                  <div className="text-xs text-slate-500">Ödev 12 · Clean Blog 6. Bölüm</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs leading-relaxed">
            <span className="font-semibold text-white block mb-1">Enes Öztürk İmzalı</span>
            Heroku ve MongoDB Atlas ücretsiz servisleri üzerinden canlıya alınmıştır.
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-5">
            {isSent && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2.5 text-sm text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Mesajınız başarıyla iletildi. En kısa sürede dönüş yapılacaktır.</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Adınız Soyadınız *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Örn: Ahmet Yılmaz"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  E-posta Adresiniz *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ahmet@example.com"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Telefon Numaranız
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="05xx xxx xx xx"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Mesajınız *
              </label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Mesajınızı buraya yazabilirsiniz..."
                className="w-full px-3.5 py-2.5 text-sm leading-relaxed border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Mesajı Gönder</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
