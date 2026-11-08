/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 * İnsan Kaynakları (Admin) Yönetim Ekranı
 * Database Filtreleme, Spring Data Paging, CV İnceleme & Bloke Hesap Yönetimi
 */

import React, { useState, useEffect } from 'react';
import { AdminHRService } from '../services/AdminHRService';
import { FileStorageManager } from '../database/FileStorageManager';
import { CandidateCVEntity, FilterCriteria, Page, Pageable, UserEntity } from '../types/models';
import { MilitaryStatus, ApplicationStatus, Role } from '../types/enums';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Briefcase,
  Award,
  ShieldAlert,
  Download,
  Upload,
  RefreshCw,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ShieldCheck,
  UserCheck,
  Building,
  Calendar,
  Phone,
  Mail,
  MapPin,
  X,
  FileCheck,
  SlidersHorizontal,
} from 'lucide-react';

export const HRDashboard: React.FC = () => {
  const hrService = AdminHRService.getInstance();
  const fileStorage = FileStorageManager.getInstance();

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [militaryStatus, setMilitaryStatus] = useState<MilitaryStatus | 'ALL'>('ALL');
  const [minExperience, setMinExperience] = useState<number | ''>('');
  const [maxExperience, setMaxExperience] = useState<number | ''>('');
  const [city, setCity] = useState<string | 'ALL'>('ALL');
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus | 'ALL'>('ALL');
  const [skillKeyword, setSkillKeyword] = useState('');
  const [onlyActiveKvkk, setOnlyActiveKvkk] = useState(false);

  // Pagination State (Spring Data Pageable)
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Data State
  const [pageData, setPageData] = useState<Page<CandidateCVEntity>>({
    content: [],
    pageNumber: 1,
    pageSize: 6,
    totalElements: 0,
    totalPages: 1,
    isFirst: true,
    isLast: true,
    hasNext: false,
    hasPrevious: false,
  });

  const [stats, setStats] = useState({
    totalCandidates: 0,
    completedMilitary: 0,
    seniorCount: 0,
    pendingReviews: 0,
    blockedUsersCount: 0,
  });

  // Modals
  const [selectedCV, setSelectedCV] = useState<CandidateCVEntity | null>(null);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState<UserEntity[]>([]);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Fetch data
  const loadData = () => {
    const criteria: FilterCriteria = {
      searchTerm: searchTerm || undefined,
      militaryStatus: militaryStatus !== 'ALL' ? militaryStatus : undefined,
      minExperienceYears: minExperience !== '' ? Number(minExperience) : undefined,
      maxExperienceYears: maxExperience !== '' ? Number(maxExperience) : undefined,
      city: city !== 'ALL' ? city : undefined,
      applicationStatus: applicationStatus !== 'ALL' ? applicationStatus : undefined,
      skillKeyword: skillKeyword || undefined,
      onlyActiveKvkk: onlyActiveKvkk,
    };

    const pageable: Pageable = {
      page: pageNumber,
      size: pageSize,
    };

    const result = hrService.searchCandidates(criteria, pageable);
    setPageData(result);
    setStats(hrService.getHRDashboardStats());
    setBlockedUsers(hrService.getBlockedUsers());
  };

  useEffect(() => {
    loadData();
  }, [
    searchTerm,
    militaryStatus,
    minExperience,
    maxExperience,
    city,
    applicationStatus,
    skillKeyword,
    onlyActiveKvkk,
    pageNumber,
    pageSize,
  ]);

  // Quick Filter for Prompt Requirement: "askerliği yapmış , 5 yıllık deneyime sahip kişiler ara"
  const applyPresetMilitaryAnd5Years = () => {
    setMilitaryStatus(MilitaryStatus.DONE);
    setMinExperience(5);
    setMaxExperience('');
    setPageNumber(1);
    setActionSuccess('Hızlı Filtre Uygulandı: Askerliği Yapmış & 5+ Yıl Deneyimli Adaylar!');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setMilitaryStatus('ALL');
    setMinExperience('');
    setMaxExperience('');
    setCity('ALL');
    setApplicationStatus('ALL');
    setSkillKeyword('');
    setOnlyActiveKvkk(false);
    setPageNumber(1);
  };

  // Status update
  const handleStatusChange = (cvId: string, newStatus: ApplicationStatus) => {
    const updated = hrService.updateCandidateStatus(cvId, newStatus);
    loadData();
    if (selectedCV && selectedCV.id === cvId) {
      setSelectedCV(updated);
    }
    setActionSuccess('Aday başvuru durumu güncellendi!');
    setTimeout(() => setActionSuccess(null), 2500);
  };

  // Unblock user
  const handleUnblock = (userId: string) => {
    hrService.unblockUserAccount(userId);
    loadData();
    setActionSuccess('Kullanıcı hesabı blokesi kaldırıldı ve şifre denemeleri sıfırlandı.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // Import file
  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const res = await fileStorage.importDatabaseFromFile(file);
      if (res.success) {
        loadData();
        setActionSuccess(res.message);
      } else {
        alert(res.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Notification */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Building className="w-3.5 h-3.5" />
            İnsan Kaynakları Yönetim Paneli
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Aday CV Havuzu & Yetenek Arama Motoru
          </h2>
          <p className="text-sm text-slate-400">
            Spring Data @OneToMany ilişkisi ve Stream API filtreleme mekanizması (Geliştirici: <span className="text-indigo-300 font-semibold">Enes Öztürk</span>)
          </p>
        </div>

        {/* Database & IO Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => fileStorage.exportFullDatabaseToFile()}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Tüm veritabanını JSON dosyası olarak indirir"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>DB Yedekle (I/O)</span>
          </button>

          <label className="cursor-pointer px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>DB İçe Aktar</span>
            <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
          </label>

          {stats.blockedUsersCount > 0 && (
            <button
              onClick={() => setShowBlockedModal(true)}
              className="px-3 py-2 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-900/40 text-xs font-medium flex items-center gap-1.5 transition-colors animate-pulse"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>Bloke Hesaplar ({stats.blockedUsersCount})</span>
            </button>
          )}
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Toplam Kayıtlı Aday</span>
            <UserCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{stats.totalCandidates}</div>
          <div className="text-[11px] text-slate-500 mt-1">Sistemdeki aktif CV sayısı</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Askerliğini Yapmış</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400">{stats.completedMilitary}</div>
          <div className="text-[11px] text-slate-500 mt-1">Askerlik görevi tamamlanmış</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">5+ Yıl Kıdemli Deneyim</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-400">{stats.seniorCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Senior / Lead profil</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">İnceleme Bekleyenler</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-cyan-400">{stats.pendingReviews}</div>
          <div className="text-[11px] text-slate-500 mt-1">Yeni ve işlem bekleyen</div>
        </div>
      </div>

      {/* ADVANCED FILTERING PANEL */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Veritabanı Arama ve Dinamik Filtreleme (Stream API)
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* User prompt specific shortcut! */}
            <button
              onClick={applyPresetMilitaryAnd5Years}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5" />
              ⚡ "Askerliği Yapmış & 5+ Yıl Deneyim" Ara
            </button>

            <button
              onClick={resetFilters}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Filtreleri Sıfırla
            </button>
          </div>
        </div>

        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. General Search */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Aday / Ünvan / Şehir Ara
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPageNumber(1);
                }}
                placeholder="Örn: Burak, Spring Boot, İstanbul..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* 2. Askerlik Durumu (Prompt requirement) */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Askerlik Durumu
            </label>
            <select
              value={militaryStatus}
              onChange={(e) => {
                setMilitaryStatus(e.target.value as any);
                setPageNumber(1);
              }}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Tümü (Filtresiz)</option>
              <option value={MilitaryStatus.DONE}>✅ Askerlik Yapıldı</option>
              <option value={MilitaryStatus.POSTPONED}>⏳ Tecilli</option>
              <option value={MilitaryStatus.EXEMPT}>🛡️ Askerlikten Muaf</option>
              <option value={MilitaryStatus.NOT_APPLICABLE}>👩 Kadın Aday / Muaf</option>
            </select>
          </div>

          {/* 3. Min Experience Years (Prompt requirement) */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Minimum Deneyim (Yıl)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="40"
                value={minExperience}
                onChange={(e) => {
                  setMinExperience(e.target.value === '' ? '' : Number(e.target.value));
                  setPageNumber(1);
                }}
                placeholder="Örn: 5"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setMinExperience(3);
                    setPageNumber(1);
                  }}
                  className={`px-2 py-1.5 rounded text-[10px] font-mono border ${
                    minExperience === 3
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  3+
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMinExperience(5);
                    setPageNumber(1);
                  }}
                  className={`px-2 py-1.5 rounded text-[10px] font-mono border ${
                    minExperience === 5
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  5+
                </button>
              </div>
            </div>
          </div>

          {/* 4. Yetenek Arama */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Yetenek / Teknoloji (Skill)
            </label>
            <input
              type="text"
              value={skillKeyword}
              onChange={(e) => {
                setSkillKeyword(e.target.value);
                setPageNumber(1);
              }}
              placeholder="Örn: Java, React, Docker..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Secondary Filters row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Şehir:</span>
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setPageNumber(1);
                }}
                className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-white"
              >
                <option value="ALL">Tüm Şehirler</option>
                <option value="İstanbul">İstanbul</option>
                <option value="Ankara">Ankara</option>
                <option value="İzmir">İzmir</option>
                <option value="Bursa">Bursa</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Başvuru Durumu:</span>
              <select
                value={applicationStatus}
                onChange={(e) => {
                  setApplicationStatus(e.target.value as any);
                  setPageNumber(1);
                }}
                className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-white"
              >
                <option value="ALL">Tüm Durumlar</option>
                <option value={ApplicationStatus.NEW}>Yeni Başvuru</option>
                <option value={ApplicationStatus.UNDER_REVIEW}>İncelemede</option>
                <option value={ApplicationStatus.INTERVIEW_SCHEDULED}>Mülakat Aşamasında</option>
                <option value={ApplicationStatus.OFFERED}>Teklif Yapıldı</option>
                <option value={ApplicationStatus.REJECTED}>Olumsuz Değerlendirildi</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={onlyActiveKvkk}
                onChange={(e) => {
                  setOnlyActiveKvkk(e.target.checked);
                  setPageNumber(1);
                }}
                className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Yalnızca KVKK Saklama Süresi Aktif Olanlar</span>
            </label>
          </div>

          <div className="text-slate-400 font-mono text-[11px]">
            Bulunan Sonuç: <strong className="text-white">{pageData.totalElements}</strong> Aday
          </div>
        </div>
      </div>

      {/* CANDIDATES TABLE / LIST */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Aday Bilgisi</th>
                <th className="px-5 py-3.5">Ünvan & Şehir</th>
                <th className="px-5 py-3.5">Deneyim</th>
                <th className="px-5 py-3.5">Askerlik Durumu</th>
                <th className="px-5 py-3.5">KVKK Saklama</th>
                <th className="px-5 py-3.5">Başvuru Durumu</th>
                <th className="px-5 py-3.5 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {pageData.content.length > 0 ? (
                pageData.content.map((cv) => (
                  <tr key={cv.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Aday Bilgisi */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-sm shrink-0">
                          {cv.firstName[0]}
                          {cv.lastName[0]}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">
                            {cv.firstName} {cv.lastName}
                          </div>
                          <div className="text-slate-400 text-[11px] flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-500" />
                            {cv.email}
                          </div>
                          <div className="text-slate-400 text-[11px] flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-500" />
                            {cv.phone}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Ünvan & Şehir */}
                    <td className="px-5 py-4">
                      <div className="text-slate-200 font-medium">{cv.title || 'Belirtilmedi'}</div>
                      <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {cv.city}
                      </div>
                    </td>

                    {/* Deneyim Yılı */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          cv.totalExperienceYears >= 5
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {cv.totalExperienceYears} Yıl Deneyim
                      </span>
                    </td>

                    {/* Askerlik Durumu (Requirement badge) */}
                    <td className="px-5 py-4">
                      {cv.militaryStatus === MilitaryStatus.DONE && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Yapıldı
                        </span>
                      )}
                      {cv.militaryStatus === MilitaryStatus.POSTPONED && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Clock className="w-3 h-3" />
                          Tecilli
                        </span>
                      )}
                      {cv.militaryStatus === MilitaryStatus.EXEMPT && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          Muaf
                        </span>
                      )}
                      {cv.militaryStatus === MilitaryStatus.NOT_APPLICABLE && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          Kadın Aday / Muaf
                        </span>
                      )}
                    </td>

                    {/* KVKK Saklama Süresi */}
                    <td className="px-5 py-4">
                      <div className="text-[11px] font-mono text-slate-300 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {cv.kvkkExpiryDate}
                      </div>
                      <span className="text-[10px] text-emerald-400">KVKK Onaylı</span>
                    </td>

                    {/* Başvuru Durumu Dropdown */}
                    <td className="px-5 py-4">
                      <select
                        value={cv.applicationStatus}
                        onChange={(e) => handleStatusChange(cv.id, e.target.value as ApplicationStatus)}
                        className={`text-[11px] font-medium px-2 py-1 rounded-lg border focus:outline-none transition-colors ${
                          cv.applicationStatus === ApplicationStatus.NEW
                            ? 'bg-blue-950/40 border-blue-500/30 text-blue-300'
                            : cv.applicationStatus === ApplicationStatus.UNDER_REVIEW
                            ? 'bg-purple-950/40 border-purple-500/30 text-purple-300'
                            : cv.applicationStatus === ApplicationStatus.INTERVIEW_SCHEDULED
                            ? 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                            : cv.applicationStatus === ApplicationStatus.OFFERED
                            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                            : 'bg-red-950/40 border-red-500/30 text-red-300'
                        }`}
                      >
                        <option value={ApplicationStatus.NEW}>Yeni Başvuru</option>
                        <option value={ApplicationStatus.UNDER_REVIEW}>İncelemede</option>
                        <option value={ApplicationStatus.INTERVIEW_SCHEDULED}>Mülakat Aşamasında</option>
                        <option value={ApplicationStatus.OFFERED}>Teklif Yapıldı</option>
                        <option value={ApplicationStatus.REJECTED}>Olumsuz</option>
                      </select>
                    </td>

                    {/* İşlemler */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedCV(cv)}
                          className="p-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white transition-colors"
                          title="Detaylı CV Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => fileStorage.exportCVToFile(cv, 'JSON')}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="CV'yi JSON (I/O Dosya) Olarak İndir"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Belirtilen filtre kriterlerine uygun aday bulunamadı.
                    <div className="mt-2">
                      <button
                        onClick={resetFilters}
                        className="text-xs text-indigo-400 hover:underline"
                      >
                        Filtreleri Temizle
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* SPRING DATA PAGING CONTROLS */}
        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              Toplam <strong>{pageData.totalElements}</strong> kayıttan{' '}
              <strong>
                {pageData.totalElements > 0 ? (pageData.pageNumber - 1) * pageData.pageSize + 1 : 0}
              </strong>
              -
              <strong>
                {Math.min(pageData.pageNumber * pageData.pageSize, pageData.totalElements)}
              </strong>{' '}
              arası gösteriliyor
            </span>

            <div className="flex items-center gap-1.5">
              <span>Sayfa Başına:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPageNumber(1);
                }}
                className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white text-xs"
              >
                <option value={4}>4</option>
                <option value={6}>6</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          {/* Pagination Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPageNumber(1)}
              disabled={pageData.isFirst}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              title="İlk Sayfa"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              disabled={!pageData.hasPrevious}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              title="Önceki Sayfa"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-mono text-white text-xs bg-slate-900 rounded-lg border border-slate-800">
              Sayfa {pageData.pageNumber} / {pageData.totalPages}
            </span>

            <button
              onClick={() => setPageNumber((p) => Math.min(pageData.totalPages, p + 1))}
              disabled={!pageData.hasNext}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              title="Sonraki Sayfa"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPageNumber(pageData.totalPages)}
              disabled={pageData.isLast}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              title="Son Sayfa"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CANDIDATE DETAIL MODAL */}
      {selectedCV && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-slate-950/90 backdrop-blur border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  {selectedCV.firstName} {selectedCV.lastName} — Detaylı Özgeçmiş
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedCV.title || 'Aday'} | {selectedCV.city} | Toplam {selectedCV.totalExperienceYears} Yıl Deneyim
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileStorage.exportCVToFile(selectedCV, 'JSON')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  JSON İndir
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs text-white flex items-center gap-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  Yazdır / PDF
                </button>
                <button
                  onClick={() => setSelectedCV(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Info Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase">Askerlik Durumu</span>
                  <span className="font-bold text-white mt-1 block">{selectedCV.militaryStatus}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase">Deneyim Yılı</span>
                  <span className="font-bold text-amber-400 mt-1 block">{selectedCV.totalExperienceYears} Yıl</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase">KVKK Saklama Süresi</span>
                  <span className="font-bold text-purple-300 mt-1 block font-mono">{selectedCV.kvkkExpiryDate}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase">Başvuru Durumu</span>
                  <span className="font-bold text-emerald-400 mt-1 block">{selectedCV.applicationStatus}</span>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  📌 Profesyonel Özet
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed p-4 rounded-xl bg-slate-950 border border-slate-800">
                  {selectedCV.summary || 'Özet bilgi girilmemiş.'}
                </p>
              </div>

              {/* Work Experience */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                  İş ve Çalışma Deneyimleri
                </h4>
                <div className="space-y-3">
                  {selectedCV.experiences.length > 0 ? (
                    selectedCV.experiences.map((exp) => (
                      <div key={exp.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{exp.position}</span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {exp.startDate} - {exp.endDate} ({exp.years} Yıl)
                          </span>
                        </div>
                        <div className="text-indigo-300 text-xs font-medium mt-0.5">{exp.companyName}</div>
                        <p className="text-xs text-slate-400 mt-1.5">{exp.description}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500">Kayıtlı iş deneyimi bulunmamaktadır.</div>
                  )}
                </div>
              </div>

              {/* Education */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-cyan-400" />
                  Eğitim Bilgileri
                </h4>
                <div className="space-y-2">
                  {selectedCV.educations.map((edu) => (
                    <div key={edu.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{edu.schoolName}</div>
                        <div className="text-slate-400 text-[11px]">{edu.department} ({edu.degree})</div>
                      </div>
                      <span className="font-mono text-slate-400 text-[11px]">
                        {edu.startYear} - {edu.graduationYear || 'Devam Ediyor'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  🛠️ Yetenekler & Teknolojiler
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCV.skills.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* HR Notes */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  📝 İnsan Kaynakları Değerlendirme Notu
                </h4>
                <textarea
                  rows={3}
                  defaultValue={selectedCV.hrNotes || ''}
                  onBlur={(e) => {
                    hrService.updateCandidateStatus(selectedCV.id, selectedCV.applicationStatus, e.target.value);
                  }}
                  placeholder="Aday hakkında İK dahili notu ekleyiniz..."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BLOCKED USERS MANAGEMENT MODAL */}
      {showBlockedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <h3 className="text-base font-bold text-white">Bloke Edilmiş Hesaplar</h3>
              </div>
              <button onClick={() => setShowBlockedModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Aşağıdaki kullanıcılar 3 kez üst üste hatalı şifre girdiği için sistem tarafından otomatik olarak bloke edilmiştir.
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {blockedUsers.length > 0 ? (
                blockedUsers.map((u) => (
                  <div key={u.id} className="p-3 rounded-xl bg-slate-950 border border-red-500/20 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{u.username}</div>
                      <div className="text-slate-400 text-[11px]">{u.email}</div>
                      <div className="text-red-400 text-[10px] mt-0.5">
                        Hatalı Giriş Sayısı: {u.failedLoginAttempts} / 3
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnblock(u.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow transition-colors"
                    >
                      Blokeyi Kaldır
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500 text-xs">
                  Şu anda sistemde bloke edilmiş kullanıcı bulunmamaktadır.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
