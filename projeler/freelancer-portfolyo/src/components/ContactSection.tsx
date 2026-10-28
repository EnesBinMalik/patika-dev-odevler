import React, { useState } from 'react';
import { StarDivider } from './StarDivider';
import { ContactMessage } from '../types';
import { Send, CheckCircle2, Inbox, Mail, Phone, User, MessageSquare, AlertCircle } from 'lucide-react';

interface ContactSectionProps {
  onSendMessage: (message: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead'>) => void;
  onOpenInbox: () => void;
  unreadCount: number;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onSendMessage,
  onOpenInbox,
  unreadCount,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Lütfen zorunlu alanları (Ad Soyad, E-posta ve Mesaj) doldurunuz.');
      return;
    }

    // Basic email check
    if (!email.includes('@') || !email.includes('.')) {
      setError('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    // Simulate SmartEdu Nodemailer SMTP dispatch
    setTimeout(() => {
      onSendMessage({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || 'Belirtilmedi',
        subject: subject.trim() || 'Genel İletişim & Proje Teklifi',
        message: message.trim(),
      });

      setIsSubmitting(false);
      setSubmittedMessage(`Teşekkürler ${name.trim()}! Mesajınız başarıyla iletildi. SmartEdu Nodemailer e-posta gönderimi simüle edildi ve gelen kutunuza kaydedildi.`);

      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    }, 700);
  };

  return (
    <section id="contact" className="py-20 sm:py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#1abc9c] uppercase tracking-wider block mb-1">
            SmartEdu İletişim & Nodemailer Entegrasyonu
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-[#2c3e50] tracking-tight font-heading">
            İLETİŞİM (CONTACT ME)
          </h2>
          <StarDivider theme="dark" />
          <p className="text-slate-600 max-w-lg mx-auto text-sm sm:text-base mt-2">
            Yeni bir proje teklifi, freelance iş birliği veya PCAT/SmartEdu mimarisiyle ilgili görüşleriniz için formu doldurabilirsiniz.
          </p>
        </div>

        {/* Success Alert */}
        {submittedMessage && (
          <div className="mb-8 p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fadeIn">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#1abc9c] shrink-0" />
              <span>{submittedMessage}</span>
            </div>
            <button
              onClick={onOpenInbox}
              className="px-4 py-2 bg-[#2c3e50] hover:bg-[#1a252f] text-white text-xs font-bold uppercase rounded-lg flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <Inbox className="w-3.5 h-3.5 text-[#1abc9c]" />
              <span>Mesajı İncele</span>
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Contact Form Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#1abc9c]" />
                <span>Adınız ve Soyadınız *</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Ahmet Yılmaz"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#1abc9c] focus:ring-2 focus:ring-[#1abc9c]/20 outline-none text-sm text-slate-800 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-[#1abc9c]" />
                  <span>E-Posta Adresiniz *</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@alanadi.com"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#1abc9c] focus:ring-2 focus:ring-[#1abc9c]/20 outline-none text-sm text-slate-800 transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-[#1abc9c]" />
                  <span>Telefon Numarası</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+90 5XX XXX XX XX"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#1abc9c] focus:ring-2 focus:ring-[#1abc9c]/20 outline-none text-sm text-slate-800 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#1abc9c]" />
                <span>Mesaj Konusu</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Örn: Web Projesi Geliştirme Talebi"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#1abc9c] focus:ring-2 focus:ring-[#1abc9c]/20 outline-none text-sm text-slate-800 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Mesajınız *
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Projeniz veya mesajınız hakkında detayları buraya yazabilirsiniz..."
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#1abc9c] focus:ring-2 focus:ring-[#1abc9c]/20 outline-none text-sm text-slate-800 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Submit Button & Inbox quick link */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#1abc9c] hover:bg-[#16a085] disabled:bg-slate-400 text-white font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm active:scale-95 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{isSubmitting ? 'Gönderiliyor...' : 'Mesajı Gönder (SUBMIT)'}</span>
              </button>

              <button
                type="button"
                onClick={onOpenInbox}
                className="text-xs text-slate-500 hover:text-[#2c3e50] font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Inbox className="w-4 h-4 text-[#1abc9c]" />
                <span>Gelen Kutusu ({unreadCount} okunmamış)</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
