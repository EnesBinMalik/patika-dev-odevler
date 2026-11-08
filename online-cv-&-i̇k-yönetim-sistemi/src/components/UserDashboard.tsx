/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 * Aday (User) Özgeçmiş Yönetim Ekranı
 * Kişisel Bilgiler, Deneyimler, KVKK Saklama Süresi ve Canlı CV Önizleme
 */

import React, { useState, useEffect } from 'react';
import { UserEntity, CandidateCVEntity, IExperience, IEducation } from '../types/models';
import { MilitaryStatus, ApplicationStatus, EducationDegree } from '../types/enums';
import { CVService } from '../services/CVService';
import { CVBuilder } from '../patterns/CVBuilder';
import { FileStorageManager } from '../database/FileStorageManager';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Trash2,
  Download,
  Printer,
  Sparkles,
  Save,
  Clock,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface UserDashboardProps {
  currentUser: UserEntity;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ currentUser }) => {
  const cvService = CVService.getInstance();
  const fileStorage = FileStorageManager.getInstance();

  const [cv, setCv] = useState<CandidateCVEntity | null>(null);
  const [activeTab, setActiveTab] = useState<'EDIT' | 'PREVIEW'>('EDIT');
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('İstanbul');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [totalExperienceYears, setTotalExperienceYears] = useState(0);
  const [militaryStatus, setMilitaryStatus] = useState<MilitaryStatus>(MilitaryStatus.DONE);
  const [kvkkConsentGiven, setKvkkConsentGiven] = useState(true);
  const [kvkkExpiryDate, setKvkkExpiryDate] = useState('');

  // Experiences & Educations & Skills
  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [educations, setEducations] = useState<IEducation[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);

  // Load candidate CV
  useEffect(() => {
    const opt = cvService.getCVByUserId(currentUser.id);
    if (opt.isPresent()) {
      const data = opt.get();
      setCv(data);
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setEmail(data.email);
      setPhone(data.phone);
      setCity(data.city);
      setTitle(data.title || '');
      setSummary(data.summary || '');
      setTotalExperienceYears(data.totalExperienceYears);
      setMilitaryStatus(data.militaryStatus);
      setKvkkConsentGiven(data.kvkkConsentGiven);
      setKvkkExpiryDate(data.kvkkExpiryDate);
      setExperiences(data.experiences || []);
      setEducations(data.educations || []);
      setSkills(data.skills || []);
      setLanguages(data.languages || []);
    } else {
      // Varsayılan CV Taslağı
      const oneYearLater = new Date();
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
      const defaultDate = oneYearLater.toISOString().split('T')[0];

      setFirstName(currentUser.username.split('.')[0] || 'Aday');
      setLastName(currentUser.username.split('.')[1] || '');
      setEmail(currentUser.email);
      setPhone('+90 532 000 0000');
      setKvkkExpiryDate(defaultDate);
    }
  }, [currentUser.id]);

  // Recalculate experience years
  const addExperience = () => {
    const newExp: IExperience = {
      id: `exp_${Date.now()}`,
      companyName: 'Yeni Şirket A.Ş.',
      position: 'Yazılım Geliştirici',
      startDate: '2023-01',
      endDate: 'Devam Ediyor',
      years: 1,
      description: 'Projeler, kullanılan teknolojiler ve başarılar.',
    };
    const updated = [...experiences, newExp];
    setExperiences(updated);
    recalcYears(updated);
  };

  const removeExperience = (id: string) => {
    const updated = experiences.filter((e) => e.id !== id);
    setExperiences(updated);
    recalcYears(updated);
  };

  const recalcYears = (expList: IExperience[]) => {
    const sum = expList.reduce((acc, curr) => acc + (curr.years || 0), 0);
    setTotalExperienceYears(sum);
  };

  const addEducation = () => {
    const newEdu: IEducation = {
      id: `edu_${Date.now()}`,
      schoolName: 'Üniversite Adı',
      department: 'Bilgisayar Mühendisliği',
      degree: EducationDegree.BACHELOR,
      startYear: 2018,
      graduationYear: 2022,
    };
    setEducations([...educations, newEdu]);
  };

  const removeEducation = (id: string) => {
    setEducations(educations.filter((e) => e.id !== id));
  };

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // KVKK Hızlı Tarih Seçicileri
  const setKvkkMonths = (months: number) => {
    const target = new Date();
    target.setMonth(target.getMonth() + months);
    setKvkkExpiryDate(target.toISOString().split('T')[0]);
  };

  // Save CV
  const handleSaveCV = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const builder = new CVBuilder(currentUser.id)
        .setPersonalDetails(firstName, lastName, email, phone, city)
        .setProfessionalTitle(title, summary)
        .setExperienceYears(totalExperienceYears)
        .setMilitaryStatus(militaryStatus)
        .setKvkkConsent(kvkkConsentGiven, kvkkExpiryDate)
        .setExperiences(experiences)
        .setEducations(educations)
        .setSkills(skills)
        .setLanguages(languages.length > 0 ? languages : ['Türkçe (Anadil)', 'İngilizce']);

      if (cv?.id) {
        builder.setId(cv.id);
      }
      if (cv?.applicationStatus) {
        builder.setApplicationStatus(cv.applicationStatus);
      }

      const entity = builder.build();
      const saved = cvService.createOrUpdateCV(entity);
      setCv(saved);

      setSaveSuccess('Özgeçmiş bilgileriniz ve KVKK saklama süreniz başarıyla kaydedildi!');
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message || 'CV kaydedilirken hata oluştu.');
    }
  };

  // Remaining days calculation
  const kvkkStatus = cv ? cvService.validateKvkkValidity(cv) : { isValid: true, remainingDays: 365 };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <User className="w-3.5 h-3.5" />
            Aday Kontrol Paneli
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Özgeçmiş (CV) & Yetenek Profilim
          </h2>
          <p className="text-sm text-slate-400">
            Kişisel veriler, askerlik durumu ve KVKK saklama süresi yönetimi (Geliştirici: <span className="text-indigo-300 font-semibold">Enes Öztürk</span>)
          </p>
        </div>

        {/* View Switcher & Action buttons */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('EDIT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'EDIT'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              CV Düzenle
            </button>
            <button
              onClick={() => setActiveTab('PREVIEW')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'PREVIEW'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Önizleme & Yazdır
            </button>
          </div>

          {cv && (
            <button
              onClick={() => fileStorage.exportCVToFile(cv, 'JSON')}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="CV'nizi JSON dosyası olarak bilgisayarınıza indirin (I/O)"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">JSON İndir</span>
            </button>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* KVKK Status Bar */}
      <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0" />
          <div>
            <strong className="text-purple-300">KVKK Kapsamında CV Saklama Süresi:</strong>
            <span className="text-slate-300 ml-1">
              Özgeçmişiniz İnsan Kaynakları havuzunda <strong>{kvkkExpiryDate || 'Belirtilmedi'}</strong> tarihine kadar saklanabilir.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[11px] font-semibold">
            ⏳ Kalan Süre: {kvkkStatus.remainingDays} Gün
          </span>
        </div>
      </div>

      {/* EDIT MODE */}
      {activeTab === 'EDIT' && (
        <form onSubmit={handleSaveCV} className="space-y-6">
          {/* Section 1: Kişisel Bilgiler */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <User className="w-4 h-4 text-indigo-400" />
              1. Kişisel ve İletişim Bilgileri
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Adınız</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Soyadınız</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">E-Posta</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Telefon Numarası</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+90 5XX XXX XX XX"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Şehir</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="İstanbul, Ankara, İzmir..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Askerlik Durumu (Prompt requirement) */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Askerlik Durumu
                </label>
                <select
                  value={militaryStatus}
                  onChange={(e) => setMilitaryStatus(e.target.value as MilitaryStatus)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value={MilitaryStatus.DONE}>✅ Askerlik Yapıldı</option>
                  <option value={MilitaryStatus.POSTPONED}>⏳ Tecilli</option>
                  <option value={MilitaryStatus.EXEMPT}>🛡️ Askerlikten Muaf</option>
                  <option value={MilitaryStatus.NOT_APPLICABLE}>👩 Kadın Aday / Muaf</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Profesyonel Ünvan
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Örn: Kıdemli Full-Stack Java & React Geliştirici"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Toplam Deneyim Yılı
                </label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={totalExperienceYears}
                  onChange={(e) => setTotalExperienceYears(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Kısa Özet & Kariyer Hedefi
              </label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Kendinizi, yeteneklerinizi ve kariyer hedeflerinizi özetleyen bir metin yazınız..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Section 2: İş Deneyimleri */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-400" />
                2. İş ve Çalışma Deneyimleri
              </h3>
              <button
                type="button"
                onClick={addExperience}
                className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Deneyim Ekle
              </button>
            </div>

            <div className="space-y-3">
              {experiences.map((exp, idx) => (
                <div key={exp.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300">Deneyim #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeExperience(exp.id)}
                      className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-slate-400 mb-1">Şirket Adı</label>
                      <input
                        type="text"
                        value={exp.companyName}
                        onChange={(e) => {
                          const updated = [...experiences];
                          updated[idx].companyName = e.target.value;
                          setExperiences(updated);
                        }}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Pozisyon / Rol</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => {
                          const updated = [...experiences];
                          updated[idx].position = e.target.value;
                          setExperiences(updated);
                        }}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Süre (Yıl)</label>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={exp.years}
                        onChange={(e) => {
                          const updated = [...experiences];
                          updated[idx].years = Number(e.target.value);
                          setExperiences(updated);
                          recalcYears(updated);
                        }}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Başlangıç Tarihi</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => {
                          const updated = [...experiences];
                          updated[idx].startDate = e.target.value;
                          setExperiences(updated);
                        }}
                        placeholder="Örn: 2021-03"
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Bitiş Tarihi</label>
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) => {
                          const updated = [...experiences];
                          updated[idx].endDate = e.target.value;
                          setExperiences(updated);
                        }}
                        placeholder="Örn: Devam Ediyor veya 2023-12"
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">İş Tanımı ve Görevler</label>
                    <textarea
                      rows={2}
                      value={exp.description}
                      onChange={(e) => {
                        const updated = [...experiences];
                        updated[idx].description = e.target.value;
                        setExperiences(updated);
                      }}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Yetenekler & Teknolojiler */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              3. Yetenekler & Teknolojiler
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Yetenek yazıp Enter'a basınız (Örn: Spring Boot, Java, PostgreSQL, Docker...)"
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
              >
                Ekle
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/20 text-indigo-300 text-xs font-mono"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Section 4: KVKK ve CV Saklama Süresi (User Prompt Explicit Requirement) */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-purple-500/30 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  4. KVKK İzni ve CV Sistemde Saklama Süresi Sınırı
                </h3>
                <p className="text-[11px] text-slate-400">
                  Gereksinim: "CV ne zamana kadar sistemde saklanabilir (KVKK) v.b bilgiler olmalıdır."
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={kvkkConsentGiven}
                  onChange={(e) => setKvkkConsentGiven(e.target.checked)}
                  className="mt-1 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="text-xs text-slate-300">
                  <strong>6698 Sayılı KVKK Kapsamında Açık Rıza Onayı:</strong>
                  <p className="text-slate-400 mt-1 leading-relaxed text-[11px]">
                    Özgeçmişimde yer alan kimlik, iletişim, çalışma deneyimi, askerlik ve eğitim verilerimin istihdam süreçlerinin yürütülmesi amacıyla İnsan Kaynakları havuzunda güvenli bir şekilde saklanmasına ve değerlendirilmesine onay veriyorum.
                  </p>
                </div>
              </label>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  CV Saklama Bitiş Tarihi (Bu tarihten sonra sistemde arşivlenir)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="date"
                    required
                    value={kvkkExpiryDate}
                    onChange={(e) => setKvkkExpiryDate(e.target.value)}
                    className="w-full sm:w-64 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setKvkkMonths(6)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                    >
                      +6 Ay
                    </button>
                    <button
                      type="button"
                      onClick={() => setKvkkMonths(12)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                    >
                      +1 Yıl (Önerilen)
                    </button>
                    <button
                      type="button"
                      onClick={() => setKvkkMonths(24)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                    >
                      +2 Yıl
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              CV Bilgilerini Veritabanına Kaydet
            </button>
          </div>
        </form>
      )}

      {/* PREVIEW & PRINT MODE */}
      {activeTab === 'PREVIEW' && (
        <div className="space-y-6">
          <div className="flex justify-end gap-2 no-print">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow"
            >
              <Printer className="w-4 h-4" />
              Yazdır / PDF Olarak Kaydet
            </button>
            {cv && (
              <button
                onClick={() => fileStorage.exportCVToFile(cv, 'TEXT')}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                TXT Rapor İndir
              </button>
            )}
          </div>

          {/* Clean Printable CV Card */}
          <div className="cv-print-area p-8 rounded-2xl bg-white text-slate-900 shadow-2xl space-y-6 border border-slate-200">
            {/* CV Header */}
            <div className="border-b-2 border-indigo-600 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {firstName} {lastName}
                </h1>
                <p className="text-lg font-semibold text-indigo-600 mt-1">
                  {title || 'Yazılım Geliştirici'}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-indigo-600" />
                    {email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-indigo-600" />
                    {phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    {city}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end text-xs space-y-1">
                <span className="px-3 py-1 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                  {totalExperienceYears} Yıl Toplam Deneyim
                </span>
                <span className="text-slate-600">
                  Askerlik: <strong>{militaryStatus}</strong>
                </span>
                <span className="text-purple-700 text-[11px]">
                  KVKK Saklama: <strong>{kvkkExpiryDate}</strong>
                </span>
              </div>
            </div>

            {/* Summary */}
            {summary && (
              <div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 text-indigo-700 border-b pb-1">
                  Profesyonel Özet
                </h2>
                <p className="text-xs text-slate-700 leading-relaxed">{summary}</p>
              </div>
            )}

            {/* Experience */}
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 text-indigo-700 border-b pb-1">
                İş ve Çalışma Deneyimi
              </h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{exp.position} — <span className="text-indigo-600">{exp.companyName}</span></span>
                      <span className="font-mono text-slate-500">{exp.startDate} - {exp.endDate} ({exp.years} Yıl)</span>
                    </div>
                    <p className="text-slate-600 mt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            {educations.length > 0 && (
              <div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 text-indigo-700 border-b pb-1">
                  Eğitim Bilgisi
                </h2>
                <div className="space-y-2">
                  {educations.map((edu) => (
                    <div key={edu.id} className="text-xs flex items-center justify-between">
                      <div>
                        <strong className="text-slate-900">{edu.schoolName}</strong>
                        <span className="text-slate-600 ml-2">({edu.department} - {edu.degree})</span>
                      </div>
                      <span className="text-slate-500 font-mono">
                        {edu.startYear} - {edu.graduationYear || 'Devam Ediyor'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 text-indigo-700 border-b pb-1">
                  Teknik Yetenekler
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <span key={s} className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 text-xs font-mono border border-slate-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer stamp */}
            <div className="pt-6 border-t text-[11px] text-slate-400 flex items-center justify-between">
              <span>Bu CV, Online CV & İK Portalı üzerinden üretilmiştir.</span>
              <span>Geliştirici Mimarisi: Enes Öztürk (S.O.L.I.D & Clean Code)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
