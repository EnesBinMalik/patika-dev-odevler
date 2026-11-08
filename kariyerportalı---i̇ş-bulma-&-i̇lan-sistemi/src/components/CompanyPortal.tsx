/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Component: CompanyPortal (Admin Screen)
 * Implements:
 * 1. Candidate database exploration & complex filtering (e.g. Askerliği Yapmış & 5+ Yıl Deneyimli Adaylar)
 * 2. Job Posting lifecycle & Builder pattern creation
 * 3. Application tracking and candidate evaluation
 * 4. Pagination & CV Export
 */

import React, { useState, useMemo } from 'react';
import {
  Users,
  Briefcase,
  Search,
  Filter,
  CheckCircle,
  Clock,
  MapPin,
  Award,
  FileText,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Building2,
  SlidersHorizontal,
  Download,
  RotateCcw,
} from 'lucide-react';
import { User } from '../core/entities/UserEntity.ts';
import { CandidateProfile } from '../core/entities/CandidateProfileEntity.ts';
import { JobPosting } from '../core/entities/JobPostingEntity.ts';
import { Application } from '../core/entities/ApplicationEntity.ts';
import { DatabaseService } from '../core/services/DatabaseService.ts';
import { CandidateService } from '../core/services/CandidateService.ts';
import { JobService } from '../core/services/JobService.ts';
import { ApplicationService } from '../core/services/ApplicationService.ts';
import { FileIOService } from '../core/services/FileIOService.ts';
import {
  MilitaryStatus,
  MilitaryStatusLabels,
  WorkType,
  WorkTypeLabels,
  ExperienceLevel,
  ExperienceLevelLabels,
  ApplicationStatus,
  ApplicationStatusLabels,
} from '../core/types/enums.ts';
import { Pagination } from './Pagination.tsx';

interface CompanyPortalProps {
  currentUser: User | null;
  onOpenAuth: () => void;
}

export const CompanyPortal: React.FC<CompanyPortalProps> = ({ currentUser, onOpenAuth }) => {
  const [activeSubTab, setActiveSubTab] = useState<'candidates' | 'jobs' | 'applications'>('candidates');

  // Candidate Filter State
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedMilitaryStatuses, setSelectedMilitaryStatuses] = useState<MilitaryStatus[]>([]);
  const [minExpYears, setMinExpYears] = useState<number>(0);
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('');

  // Pagination for Candidates
  const [candidatePage, setCandidatePage] = useState(1);
  const [candidatePageSize, setCandidatePageSize] = useState(5);

  // Pagination for Applications
  const [appPage, setAppPage] = useState(1);
  const [appPageSize, setAppPageSize] = useState(5);

  // Selected Candidate Modal
  const [inspectCandidate, setInspectCandidate] = useState<CandidateProfile | null>(null);

  // New Job Modal
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDept, setNewJobDept] = useState('Yazılım ve Teknoloji');
  const [newJobCity, setNewJobCity] = useState('İstanbul');
  const [newJobWorkType, setNewJobWorkType] = useState<WorkType>(WorkType.REMOTE);
  const [newJobExpLevel, setNewJobExpLevel] = useState<ExperienceLevel>(ExperienceLevel.SENIOR);
  const [newJobMinExpYears, setNewJobMinExpYears] = useState(5);
  const [newJobMilReq, setNewJobMilReq] = useState<MilitaryStatus | 'ANY'>(MilitaryStatus.DONE);
  const [newJobSalaryMin, setNewJobSalaryMin] = useState(90000);
  const [newJobSalaryMax, setNewJobSalaryMax] = useState(135000);
  const [newJobSkills, setNewJobSkills] = useState('Java, Spring Boot, React, PostgreSQL');
  const [newJobDesc, setNewJobDesc] = useState('Kurumsal mikroservis mimarilerimizde görev alacak tecrübeli yazılım mühendisi.');

  const db = DatabaseService.getInstance();
  const candidateService = CandidateService.getInstance();
  const jobService = JobService.getInstance();
  const appService = ApplicationService.getInstance();
  const fileIOService = FileIOService.getInstance();

  const company = currentUser?.getCompanyId() ? db.companies.findById(currentUser.getCompanyId()!).orElse(undefined as any) : null;

  // Apply candidate filters using Strategy Pattern in CandidateService
  const filteredCandidates = useMemo(() => {
    return candidateService.filterCandidates({
      searchKeyword,
      militaryStatuses: selectedMilitaryStatuses.length > 0 ? selectedMilitaryStatuses : undefined,
      minExperienceYears: minExpYears > 0 ? minExpYears : undefined,
      city: selectedCity !== 'ALL' ? selectedCity : undefined,
      skills: selectedSkillFilter.trim() !== '' ? selectedSkillFilter.split(',').map(s => s.trim()) : undefined,
    });
  }, [searchKeyword, selectedMilitaryStatuses, minExpYears, selectedCity, selectedSkillFilter]);

  // Paginated candidates slice
  const paginatedCandidates = useMemo(() => {
    const start = (candidatePage - 1) * candidatePageSize;
    return filteredCandidates.slice(start, start + candidatePageSize);
  }, [filteredCandidates, candidatePage, candidatePageSize]);

  // Company jobs
  const companyJobs = useMemo(() => {
    if (!company) return db.jobs.findAll().toList();
    return jobService.getJobsByCompany(company.getId());
  }, [company]);

  // Company applications
  const companyApplications = useMemo(() => {
    if (!company) return db.applications.findAll().toList();
    return appService.getApplicationsByCompany(company.getId());
  }, [company]);

  const paginatedApplications = useMemo(() => {
    const start = (appPage - 1) * appPageSize;
    return companyApplications.slice(start, start + appPageSize);
  }, [companyApplications, appPage, appPageSize]);

  // One-click filter preset: "Askerliği Yapmış & 5+ Yıl Deneyimli Adaylar"
  const handleApplyPresetAskerlikVe5Yil = () => {
    setSelectedMilitaryStatuses([MilitaryStatus.DONE, MilitaryStatus.EXEMPT]);
    setMinExpYears(5);
    setSearchKeyword('');
    setSelectedSkillFilter('');
    setCandidatePage(1);
  };

  const handleResetFilters = () => {
    setSelectedMilitaryStatuses([]);
    setMinExpYears(0);
    setSelectedCity('ALL');
    setSelectedSkillFilter('');
    setSearchKeyword('');
    setCandidatePage(1);
  };

  const handleCreateJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    jobService.createJob(currentUser.getId(), {
      title: newJobTitle,
      department: newJobDept,
      city: newJobCity,
      workType: newJobWorkType,
      experienceLevel: newJobExpLevel,
      minExperienceYears: Number(newJobMinExpYears),
      militaryRequirement: newJobMilReq,
      salaryMin: Number(newJobSalaryMin),
      salaryMax: Number(newJobSalaryMax),
      skillsRequired: newJobSkills.split(',').map(s => s.trim()).filter(Boolean),
      description: newJobDesc,
      requirements: [
        `En az ${newJobMinExpYears} yıl ilgili alanda tecrübe`,
        newJobMilReq === MilitaryStatus.DONE ? 'Askerliğini yapmış veya muaf olmak' : 'Askerlik şartı aranmamaktadır',
        'Clean Code ve OOP prensiplerine bağlılık',
      ],
    });

    setIsNewJobModalOpen(false);
    setActiveSubTab('jobs');
  };

  const handleStatusChange = (appId: string, newStatus: ApplicationStatus, currentNote?: string) => {
    if (!currentUser) return;
    const note = prompt('Aday için inceleme notu ekleyin (İsteğe bağlı):', currentNote || '');
    appService.updateApplicationStatus(appId, newStatus, currentUser.getId(), note || undefined);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Company Overview */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xl">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {company ? company.getName() : 'Şirket İK & Yönetici Portalı'}
                </h1>
                <span className="text-xs px-2 py-0.5 rounded font-mono bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold">
                  ROLE: ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {company
                  ? `${company.getIndustry()} · ${company.getCity()} · Vergi No: ${company.getTaxNumber()}`
                  : 'Sistemdeki tüm adayları inceleyin, gelişmiş kriterlerle filtreleyin ve ilanları yönetin.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsNewJobModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Yeni İş İlanı Yayınla</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex items-center gap-2 mt-6 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('candidates')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'candidates'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Aday Havuzu & Veritabanı Filtreleme ({filteredCandidates.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('jobs')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'jobs'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Şirket İlanları ({companyJobs.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('applications')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'applications'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Gelen Başvurular ({companyApplications.length})</span>
          </button>
        </div>
      </div>

      {/* SUB TAB 1: CANDIDATES DATABASE & FILTERING */}
      {activeSubTab === 'candidates' && (
        <div className="space-y-4">
          {/* Filter Bar with Presets */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                  <span>İlişkisel Veritabanı Aday Filtreleme (Specification Strategy)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Spring Data sorgularını simüle eden OOP Strategy Pattern ile adayları filtreleyin.
                </p>
              </div>

              {/* Requirement Preset Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleApplyPresetAskerlikVe5Yil}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 rounded-lg text-xs font-semibold hover:bg-amber-100 transition-colors"
                  title="Gereksinimdeki örnek filtreleme kuralı"
                >
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>⭐ Preset: Askerliği Yapmış + 5 Yıl Deneyim</span>
                </button>

                {(selectedMilitaryStatuses.length > 0 || minExpYears > 0 || selectedCity !== 'ALL' || searchKeyword) && (
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Sıfırla</span>
                  </button>
                )}
              </div>
            </div>

            {/* Filter Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {/* Keyword */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Arama (Ad, Unvan, Yetenek)
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={e => {
                      setSearchKeyword(e.target.value);
                      setCandidatePage(1);
                    }}
                    placeholder="Örn: Java, Ahmet, React..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Min Experience Years */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Min. Deneyim Yılı: <strong className="font-mono text-indigo-600">{minExpYears} Yıl</strong>
                </label>
                <select
                  value={minExpYears}
                  onChange={e => {
                    setMinExpYears(Number(e.target.value));
                    setCandidatePage(1);
                  }}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100"
                >
                  <option value={0}>Tümü (Fark etmez)</option>
                  <option value={1}>En az 1 Yıl (Junior+)</option>
                  <option value={2}>En az 2 Yıl</option>
                  <option value={3}>En az 3 Yıl (Mid-Level+)</option>
                  <option value={5}>En az 5 Yıl (Senior+)</option>
                  <option value={7}>En az 7 Yıl (Lead+)</option>
                </select>
              </div>

              {/* Military Status Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Askerlik Durumu Şartı
                </label>
                <select
                  value={
                    selectedMilitaryStatuses.length === 0
                      ? 'ALL'
                      : selectedMilitaryStatuses.length === 2 && selectedMilitaryStatuses.includes(MilitaryStatus.DONE)
                      ? 'DONE_OR_EXEMPT'
                      : selectedMilitaryStatuses[0]
                  }
                  onChange={e => {
                    const val = e.target.value;
                    if (val === 'ALL') {
                      setSelectedMilitaryStatuses([]);
                    } else if (val === 'DONE_OR_EXEMPT') {
                      setSelectedMilitaryStatuses([MilitaryStatus.DONE, MilitaryStatus.EXEMPT]);
                    } else {
                      setSelectedMilitaryStatuses([val as MilitaryStatus]);
                    }
                    setCandidatePage(1);
                  }}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100"
                >
                  <option value="ALL">Tümü (Şart Yok)</option>
                  <option value="DONE_OR_EXEMPT">Yapıldı veya Muaf (İşveren Tercihi)</option>
                  <option value={MilitaryStatus.DONE}>Sadece Yapıldı</option>
                  <option value={MilitaryStatus.EXEMPT}>Sadece Muaf</option>
                  <option value={MilitaryStatus.DEFERRED}>Tecilli</option>
                  <option value={MilitaryStatus.NOT_DONE}>Yapılmadı</option>
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Lokasyon / Şehir
                </label>
                <select
                  value={selectedCity}
                  onChange={e => {
                    setSelectedCity(e.target.value);
                    setCandidatePage(1);
                  }}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100"
                >
                  <option value="ALL">Tüm Şehirler</option>
                  <option value="İstanbul">İstanbul</option>
                  <option value="Ankara">Ankara</option>
                  <option value="İzmir">İzmir</option>
                  <option value="Bursa">Bursa</option>
                </select>
              </div>
            </div>
          </div>

          {/* Candidates List / Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Filtreye Uyan Adaylar ({filteredCandidates.length} Kişi)
              </span>
              <span className="text-[11px] text-slate-500">
                Detaylı profil, askelik belgesi ve CV için incele butonuna tıklayın
              </span>
            </div>

            {filteredCandidates.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Filtreye Uyan Aday Bulunamadı
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Belirttiğiniz kriterlere (askerlik, deneyim yılı veya unvan) uygun aday kaydı bulunmuyor. Filtreleri esnetebilirsiniz.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors"
                >
                  Filtreleri Temizle
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedCandidates.map(candidate => {
                  const user = db.users.findById(candidate.getUserId()).orElse(undefined as any);
                  const isDoneMilitary =
                    candidate.getMilitaryStatus() === MilitaryStatus.DONE ||
                    candidate.getMilitaryStatus() === MilitaryStatus.EXEMPT;
                  const isSeniorExp = candidate.getExperienceYears() >= 5;

                  return (
                    <div
                      key={candidate.getId()}
                      className="p-5 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            {candidate.getFullName()}
                          </h3>

                          {/* Unboxed metadata according to design rules */}
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>{candidate.getCity()}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono">{candidate.getExperienceYears()} Yıl Deneyim</span>
                            <span aria-hidden="true">·</span>
                            <span className={isDoneMilitary ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-slate-600'}>
                              Askerlik: {MilitaryStatusLabels[candidate.getMilitaryStatus()]}
                            </span>
                          </div>

                          {/* Highlight match for the user's specific requirement */}
                          {isDoneMilitary && isSeniorExp && (
                            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded">
                              ✓ Askerlik Tamam & 5+ Yıl
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                          {candidate.getCurrentTitle()}
                        </p>

                        {candidate.getBio() && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 max-w-2xl">
                            {candidate.getBio()}
                          </p>
                        )}

                        {/* Skills */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {candidate.getSkills().map(skill => (
                            <span
                              key={skill}
                              className="text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-mono"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => fileIOService.exportCandidateCV(candidate, user)}
                          className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-750 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
                          title="Aday CV'sini Metin Belgesi Olarak İndir"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">CV İndir</span>
                        </button>

                        <button
                          onClick={() => setInspectCandidate(candidate)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                        >
                          <span>Profili İncele</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {filteredCandidates.length > 0 && (
              <Pagination
                currentPage={candidatePage}
                totalItems={filteredCandidates.length}
                pageSize={candidatePageSize}
                onPageChange={setCandidatePage}
                onPageSizeChange={setCandidatePageSize}
              />
            )}
          </div>
        </div>
      )}

      {/* SUB TAB 2: COMPANY JOBS */}
      {activeSubTab === 'jobs' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Şirket İş İlanları ({companyJobs.length})
              </h2>
              <p className="text-xs text-slate-500">
                Şirketinize ait aktif ve pasif iş ilanlarını yönetin.
              </p>
            </div>
            <button
              onClick={() => setIsNewJobModalOpen(true)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Yeni İlan</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {companyJobs.map(job => (
              <div
                key={job.getId()}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {job.getTitle()}
                    </h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        job.getIsActive()
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                      }`}
                    >
                      {job.getIsActive() ? 'AKTİF' : 'PASİF'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>{job.getDepartment()}</span>
                    <span aria-hidden="true">·</span>
                    <span>{job.getCity()} ({WorkTypeLabels[job.getWorkType()]})</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">Min {job.getMinExperienceYears()} Yıl Deneyim</span>
                    <span aria-hidden="true">·</span>
                    <span>Askerlik Şartı: {job.getMilitaryRequirement() === 'ANY' ? 'Fark etmez' : MilitaryStatusLabels[job.getMilitaryRequirement() as MilitaryStatus]}</span>
                  </div>

                  <div className="text-xs font-mono text-slate-700 dark:text-slate-300">
                    Maaş Aralığı: {job.getSalaryMin()?.toLocaleString('tr-TR')} - {job.getSalaryMax()?.toLocaleString('tr-TR')} {job.getCurrency()}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white block font-mono">
                      {job.getApplicationCount()} Başvuru
                    </span>
                    <button
                      onClick={() => {
                        setActiveSubTab('applications');
                      }}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Başvuruları Gör
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (currentUser) {
                        jobService.toggleJobStatus(job.getId(), currentUser.getId());
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      job.getIsActive()
                        ? 'border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        : 'border-emerald-500 text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    {job.getIsActive() ? 'Pasife Al' : 'Aktif Et'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 3: APPLICATIONS */}
      {activeSubTab === 'applications' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Gelen İş Başvuruları ({companyApplications.length})
            </h2>
            <p className="text-xs text-slate-500">
              İlanlarınıza başvuran adayların durumlarını (İncelemede, Mülakat, Kabul, Ret) güncelleyin.
            </p>
          </div>

          {companyApplications.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              Henüz gelen bir başvuru bulunmuyor.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedApplications.map(app => (
                <div key={app.getId()} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {app.getCandidateFullName()}
                      </span>
                      <span aria-hidden="true" className="text-slate-400">➔</span>
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {app.getJobTitle()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{app.getCandidateEmail()}</span>
                      <span aria-hidden="true">·</span>
                      <span>{app.getCandidatePhone()}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">Tarih: {new Date(app.getAppliedAt()).toLocaleDateString('tr-TR')}</span>
                    </div>

                    {app.getCoverLetter() && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg mt-1 max-w-xl">
                        "{app.getCoverLetter()}"
                      </p>
                    )}

                    {app.getNotes() && (
                      <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                        Değerlendirme Notu: {app.getNotes()}
                      </p>
                    )}
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-slate-500">Durum:</span>
                    <select
                      value={app.getStatus()}
                      onChange={e => handleStatusChange(app.getId(), e.target.value as ApplicationStatus, app.getNotes())}
                      className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100"
                    >
                      {Object.values(ApplicationStatus).map(st => (
                        <option key={st} value={st}>
                          {ApplicationStatusLabels[st]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}

          {companyApplications.length > 0 && (
            <Pagination
              currentPage={appPage}
              totalItems={companyApplications.length}
              pageSize={appPageSize}
              onPageChange={setAppPage}
              onPageSizeChange={setAppPageSize}
            />
          )}
        </div>
      )}

      {/* INSPECT CANDIDATE MODAL */}
      {inspectCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {inspectCandidate.getFullName()}
                </h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                  {inspectCandidate.getCurrentTitle()}
                </p>
              </div>
              <button
                onClick={() => setInspectCandidate(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                ✕
              </button>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Toplam Deneyim</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                  {inspectCandidate.getExperienceYears()} Yıl
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Askerlik Durumu</span>
                <span className="font-bold text-slate-900 dark:text-white text-xs">
                  {MilitaryStatusLabels[inspectCandidate.getMilitaryStatus()]}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Lokasyon</span>
                <span className="font-bold text-slate-900 dark:text-white text-xs">
                  {inspectCandidate.getCity()}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Profil Doluluk</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono text-sm">
                  %{inspectCandidate.calculateCompleteness()}
                </span>
              </div>
            </div>

            {/* Bio */}
            {inspectCandidate.getBio() && (
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Özet / Ön Bilgi
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                  {inspectCandidate.getBio()}
                </p>
              </div>
            )}

            {/* Work Experiences */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                İş ve Çalışma Geçmişi
              </h4>
              {inspectCandidate.getWorkExperiences().length === 0 ? (
                <p className="text-xs text-slate-400">Kayıtlı deneyim bilgisi bulunmuyor.</p>
              ) : (
                <div className="space-y-2">
                  {inspectCandidate.getWorkExperiences().map(exp => (
                    <div key={exp.id} className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
                      <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                        <span>{exp.title}</span>
                        <span className="text-slate-400 font-normal font-mono text-[11px]">
                          {exp.startDate} - {exp.isCurrent ? 'Devam Ediyor' : exp.endDate}
                        </span>
                      </div>
                      <span className="text-indigo-600 text-[11px] block">{exp.companyName}</span>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Educations */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                Eğitim Bilgileri
              </h4>
              <div className="space-y-2">
                {inspectCandidate.getEducations().map(edu => (
                  <div key={edu.id} className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white block">{edu.institution}</span>
                      <span className="text-slate-500 text-[11px]">{edu.degree} · {edu.department}</span>
                    </div>
                    <span className="font-mono text-slate-400 text-xs">{edu.graduationYear}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Telefon: <strong>{inspectCandidate.getPhone()}</strong>
              </span>
              <button
                onClick={() => {
                  fileIOService.exportCandidateCV(inspectCandidate);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Özgeçmiş Belgesini (CV) İndir</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW JOB POSTING MODAL (Builder Pattern) */}
      {isNewJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Yeni İş İlanı Oluştur (Builder Pattern)
                </h3>
                <p className="text-xs text-slate-500">
                  Şirketiniz adına yeni açık pozisyon yayınlayın.
                </p>
              </div>
              <button onClick={() => setIsNewJobModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateJobSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  İlan Başlığı / Pozisyon Adı
                </label>
                <input
                  type="text"
                  required
                  value={newJobTitle}
                  onChange={e => setNewJobTitle(e.target.value)}
                  placeholder="Örn: Senior Fullstack Java & React Developer"
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Departman
                  </label>
                  <input
                    type="text"
                    required
                    value={newJobDept}
                    onChange={e => setNewJobDept(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Şehir
                  </label>
                  <input
                    type="text"
                    required
                    value={newJobCity}
                    onChange={e => setNewJobCity(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Çalışma Şekli
                  </label>
                  <select
                    value={newJobWorkType}
                    onChange={e => setNewJobWorkType(e.target.value as WorkType)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                  >
                    {Object.values(WorkType).map(wt => (
                      <option key={wt} value={wt}>
                        {WorkTypeLabels[wt]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kıdem Seviyesi
                  </label>
                  <select
                    value={newJobExpLevel}
                    onChange={e => setNewJobExpLevel(e.target.value as ExperienceLevel)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                  >
                    {Object.values(ExperienceLevel).map(el => (
                      <option key={el} value={el}>
                        {ExperienceLevelLabels[el]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Min Deneyim Yılı
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={25}
                    required
                    value={newJobMinExpYears}
                    onChange={e => setNewJobMinExpYears(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Askerlik Şartı
                  </label>
                  <select
                    value={newJobMilReq}
                    onChange={e => setNewJobMilReq(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                  >
                    <option value="ANY">Fark Etmez (Şart Yok)</option>
                    <option value={MilitaryStatus.DONE}>Yapılmış Olmalı</option>
                    <option value={MilitaryStatus.EXEMPT}>Muaf Olmalı</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Maaş Aralığı (TL)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step={5000}
                      value={newJobSalaryMin}
                      onChange={e => setNewJobSalaryMin(Number(e.target.value))}
                      placeholder="Min"
                      className="w-1/2 px-2 py-1.5 border border-slate-200 dark:border-slate-750 rounded-lg font-mono"
                    />
                    <input
                      type="number"
                      step={5000}
                      value={newJobSalaryMax}
                      onChange={e => setNewJobSalaryMax(Number(e.target.value))}
                      placeholder="Max"
                      className="w-1/2 px-2 py-1.5 border border-slate-200 dark:border-slate-750 rounded-lg font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Aranan Yetenekler (Virgülle ayırın)
                </label>
                <input
                  type="text"
                  value={newJobSkills}
                  onChange={e => setNewJobSkills(e.target.value)}
                  placeholder="Java, Spring Boot, PostgreSQL, Docker"
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  İlan Açıklaması
                </label>
                <textarea
                  rows={3}
                  required
                  value={newJobDesc}
                  onChange={e => setNewJobDesc(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewJobModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-750 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  İlanı Yayınla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
