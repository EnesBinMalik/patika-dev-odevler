/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Component: CandidatePortal (User Screen)
 * Implements:
 * 1. "Bana Uygun İş Var Mı?" intelligent compatibility matching & job search filtering
 * 2. Profile editor (Name, Surname, Phone, Military Status, Experience, Skills, Education)
 * 3. Application tracking & submission
 */

import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Search,
  Briefcase,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Send,
  User,
  GraduationCap,
  Plus,
  Trash2,
  Download,
  AlertCircle,
  Check,
  SlidersHorizontal,
} from 'lucide-react';
import { User as UserEntity } from '../core/entities/UserEntity.ts';
import { CandidateProfile } from '../core/entities/CandidateProfileEntity.ts';
import { JobPosting } from '../core/entities/JobPostingEntity.ts';
import { DatabaseService } from '../core/services/DatabaseService.ts';
import { JobService, IMatchingJobResult } from '../core/services/JobService.ts';
import { CandidateService } from '../core/services/CandidateService.ts';
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

interface CandidatePortalProps {
  currentUser: UserEntity | null;
  onOpenAuth: () => void;
}

export const CandidatePortal: React.FC<CandidatePortalProps> = ({ currentUser, onOpenAuth }) => {
  const [activeSubTab, setActiveSubTab] = useState<'matching-jobs' | 'my-applications' | 'profile'>('matching-jobs');

  // Filter state for jobs
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedWorkType, setSelectedWorkType] = useState<WorkType | 'ALL'>('ALL');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [onlyEligible, setOnlyEligible] = useState(false);

  // Pagination for Jobs
  const [jobPage, setJobPage] = useState(1);
  const [jobPageSize, setJobPageSize] = useState(5);

  // Application Modal state
  const [selectedJobToApply, setSelectedJobToApply] = useState<JobPosting | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applyError, setApplyError] = useState<string | null>(null);

  // Profile Edit State
  const db = DatabaseService.getInstance();
  const jobService = JobService.getInstance();
  const candidateService = CandidateService.getInstance();
  const appService = ApplicationService.getInstance();
  const fileIOService = FileIOService.getInstance();

  const profile = currentUser?.getCandidateProfileId()
    ? db.candidates.findById(currentUser.getCandidateProfileId()!).orElse(undefined as any)
    : currentUser
    ? db.candidates.findByUserId(currentUser.getId()).orElse(undefined as any)
    : null;

  // Profile Form state
  const [profFirstName, setProfFirstName] = useState(profile?.getFirstName() || '');
  const [profLastName, setProfLastName] = useState(profile?.getLastName() || '');
  const [profPhone, setProfPhone] = useState(profile?.getPhone() || '');
  const [profCity, setProfCity] = useState(profile?.getCity() || 'İstanbul');
  const [profMilitaryStatus, setProfMilitaryStatus] = useState<MilitaryStatus>(profile?.getMilitaryStatus() || MilitaryStatus.DONE);
  const [profMilitaryExemptReason, setProfMilitaryExemptReason] = useState(profile?.getMilitaryExemptReason() || '');
  const [profExpYears, setProfExpYears] = useState(profile?.getExperienceYears() ?? 3);
  const [profTitle, setProfTitle] = useState(profile?.getCurrentTitle() || '');
  const [profBio, setProfBio] = useState(profile?.getBio() || '');
  const [profSkills, setProfSkills] = useState(profile ? profile.getSkills().join(', ') : '');

  // Add work exp form
  const [isAddingExp, setIsAddingExp] = useState(false);
  const [newExpCompany, setNewExpCompany] = useState('');
  const [newExpTitle, setNewExpTitle] = useState('');
  const [newExpStart, setNewExpStart] = useState('2022-01');
  const [newExpEnd, setNewExpEnd] = useState('');
  const [newExpCurrent, setNewExpCurrent] = useState(false);
  const [newExpDesc, setNewExpDesc] = useState('');

  // Add education form
  const [isAddingEdu, setIsAddingEdu] = useState(false);
  const [newEduInst, setNewEduInst] = useState('');
  const [newEduDegree, setNewEduDegree] = useState('Lisans');
  const [newEduDept, setNewEduDept] = useState('Bilgisayar Mühendisliği');
  const [newEduYear, setNewEduYear] = useState(2022);

  // Sync state if profile changes
  React.useEffect(() => {
    if (profile) {
      setProfFirstName(profile.getFirstName());
      setProfLastName(profile.getLastName());
      setProfPhone(profile.getPhone());
      setProfCity(profile.getCity());
      setProfMilitaryStatus(profile.getMilitaryStatus());
      setProfMilitaryExemptReason(profile.getMilitaryExemptReason() || '');
      setProfExpYears(profile.getExperienceYears());
      setProfTitle(profile.getCurrentTitle());
      setProfBio(profile.getBio());
      setProfSkills(profile.getSkills().join(', '));
    }
  }, [profile]);

  // "Bana Uygun İş Var Mı?" matching engine calculation
  const matchingResults = useMemo(() => {
    if (!currentUser) {
      // If guest, show all jobs with dummy match
      return jobService.getAllActiveJobs().map(job => ({
        job,
        matchScore: 70,
        isEligible: true,
        militaryMatch: true,
        experienceMatch: true,
        matchedSkills: job.getSkillsRequired(),
        missingSkills: [],
      }));
    }
    return jobService.findMatchingJobsForCandidate(currentUser.getId());
  }, [currentUser]);

  // Filter matching results based on user inputs
  const filteredMatches = useMemo(() => {
    return matchingResults.filter(item => {
      const job = item.job;

      if (onlyEligible && !item.isEligible) return false;

      if (selectedWorkType !== 'ALL' && job.getWorkType() !== selectedWorkType) return false;

      if (selectedCity !== 'ALL' && !job.getCity().toLowerCase().includes(selectedCity.toLowerCase())) return false;

      if (searchKeyword.trim() !== '') {
        const q = searchKeyword.toLowerCase().trim();
        const matchesQuery =
          job.getTitle().toLowerCase().includes(q) ||
          job.getCompanyName().toLowerCase().includes(q) ||
          job.getDepartment().toLowerCase().includes(q) ||
          job.getSkillsRequired().some(s => s.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [matchingResults, onlyEligible, selectedWorkType, selectedCity, searchKeyword]);

  const paginatedMatches = useMemo(() => {
    const start = (jobPage - 1) * jobPageSize;
    return filteredMatches.slice(start, start + jobPageSize);
  }, [filteredMatches, jobPage, jobPageSize]);

  // My applications
  const myApplications = useMemo(() => {
    if (!currentUser) return [];
    return appService.getApplicationsByCandidate(currentUser.getId());
  }, [currentUser]);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!selectedJobToApply) return;

    setApplyError(null);
    const result = appService.submitApplication(currentUser.getId(), selectedJobToApply.getId(), coverLetter);

    if (result.success) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // Safe fallback
      }
      setSelectedJobToApply(null);
      setCoverLetter('');
      setActiveSubTab('my-applications');
    } else {
      setApplyError(result.errorMessage || 'Başvuru yapılamadı.');
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const skillsArr = profSkills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    candidateService.updateProfile(currentUser.getId(), {
      firstName: profFirstName,
      lastName: profLastName,
      phone: profPhone,
      city: profCity,
      militaryStatus: profMilitaryStatus,
      militaryExemptReason: profMilitaryExemptReason,
      experienceYears: Number(profExpYears),
      currentTitle: profTitle,
      bio: profBio,
      skills: skillsArr,
    });

    alert('Profil bilgileriniz ve askerlik/deneyim durumunuz başarıyla güncellendi!');
  };

  const handleAddExperienceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    candidateService.addExperience(currentUser.getId(), {
      companyName: newExpCompany,
      title: newExpTitle,
      startDate: newExpStart,
      endDate: newExpCurrent ? undefined : newExpEnd,
      isCurrent: newExpCurrent,
      description: newExpDesc,
    });

    setIsAddingExp(false);
    setNewExpCompany('');
    setNewExpTitle('');
    setNewExpDesc('');
  };

  const handleAddEducationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    candidateService.addEducation(currentUser.getId(), {
      institution: newEduInst,
      degree: newEduDegree,
      department: newEduDept,
      graduationYear: Number(newEduYear),
    });

    setIsAddingEdu(false);
    setNewEduInst('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Candidate Overview */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xl">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {currentUser ? currentUser.getFullName() : 'Aday İş Arama & Kariyer Portalı'}
                </h1>
                <span className="text-xs px-2 py-0.5 rounded font-mono bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold">
                  ROLE: USER
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {profile ? (
                  <>
                    <span>{profile.getCurrentTitle()}</span>
                    <span className="mx-2" aria-hidden="true">·</span>
                    <span>{profile.getCity()}</span>
                    <span className="mx-2" aria-hidden="true">·</span>
                    <span className="font-mono">{profile.getExperienceYears()} Yıl Deneyim</span>
                    <span className="mx-2" aria-hidden="true">·</span>
                    <span>Askerlik: {MilitaryStatusLabels[profile.getMilitaryStatus()]}</span>
                  </>
                ) : (
                  'Bana uygun iş var mı? Yapay zeka ve kural tabanlı akıllı eşleştirme ile ilanları keşfedin.'
                )}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {profile && (
              <button
                onClick={() => fileIOService.exportCandidateCV(profile, currentUser || undefined)}
                className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
                title="CV'nizi Metin Belgesi Olarak İndirin"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>Özgeçmişimi İndir</span>
              </button>
            )}

            {!currentUser && (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                Giriş Yaparak Eşleşmeleri Gör
              </button>
            )}
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex items-center gap-2 mt-6 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('matching-jobs')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'matching-jobs'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>"Bana Uygun İş Var Mı?" & İlanlar ({filteredMatches.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('my-applications')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'my-applications'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Başvurularım ({myApplications.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('profile')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'profile'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profilim & Özgeçmiş Bilgilerim</span>
          </button>
        </div>
      </div>

      {/* SUB TAB 1: SMART MATCHING JOBS ("BANA UYGUN İŞ VAR MI?") */}
      {activeSubTab === 'matching-jobs' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                  <span>İş Arama ve Uygunluk Filtresi</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Askerlik şartı, tecrübe yılı ve teknolojik yeteneklerinize göre sıralanmış iş fırsatları.
                </p>
              </div>

              {/* Only eligible toggle */}
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyEligible}
                  onChange={e => {
                    setOnlyEligible(e.target.checked);
                    setJobPage(1);
                  }}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Sadece Şartlarını Birebir Sağladığım İlanlar</span>
              </label>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Pozisyon veya Anahtar Kelime
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={e => {
                      setSearchKeyword(e.target.value);
                      setJobPage(1);
                    }}
                    placeholder="Java, React, DevOps, Maslak..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Çalışma Şekli
                </label>
                <select
                  value={selectedWorkType}
                  onChange={e => {
                    setSelectedWorkType(e.target.value as any);
                    setJobPage(1);
                  }}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                >
                  <option value="ALL">Tüm Çalışma Şekilleri</option>
                  <option value={WorkType.REMOTE}>Uzaktan (Remote)</option>
                  <option value={WorkType.HYBRID}>Hibrit</option>
                  <option value={WorkType.ONSITE}>Ofis (Yerinde)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Şehir
                </label>
                <select
                  value={selectedCity}
                  onChange={e => {
                    setSelectedCity(e.target.value);
                    setJobPage(1);
                  }}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
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

          {/* Job Postings List */}
          <div className="space-y-3">
            {paginatedMatches.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
                <Briefcase className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Aranan Kriterlere Uygun İlan Bulunamadı
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Filtreleri esneterek veya arama kelimesini değiştirerek tekrar deneyebilirsiniz.
                </p>
              </div>
            ) : (
              paginatedMatches.map(item => {
                const job = item.job;
                const hasAppliedAlready = currentUser
                  ? appService.hasCandidateApplied(currentUser.getId(), job.getId())
                  : false;

                return (
                  <div
                    key={job.getId()}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            {job.getTitle()}
                          </h3>

                          {/* Match Score Badge */}
                          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            <Sparkles className="w-3 h-3 text-indigo-600" />
                            <span>%{item.matchScore} Uyum</span>
                          </div>

                          {item.isEligible ? (
                            <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>Şartları Sağlıyorsunuz</span>
                            </span>
                          ) : (
                            <span className="text-[10px] bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              <span>Kısmi Uyuşmazlık</span>
                            </span>
                          )}
                        </div>

                        {/* Company & Location Metadata */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {job.getCompanyName()}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{job.getCity()}</span>
                          <span aria-hidden="true">·</span>
                          <span>{WorkTypeLabels[job.getWorkType()]}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono">{ExperienceLevelLabels[job.getExperienceLevel()]} (Min {job.getMinExperienceYears()} Yıl)</span>
                          <span aria-hidden="true">·</span>
                          <span>
                            Askerlik Şartı:{' '}
                            <strong className={item.militaryMatch ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-rose-600'}>
                              {job.getMilitaryRequirement() === 'ANY' ? 'Şart Yok' : MilitaryStatusLabels[job.getMilitaryRequirement() as MilitaryStatus]}
                            </strong>
                          </span>
                        </div>

                        {/* Description snippet */}
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                          {job.getDescription()}
                        </p>

                        {/* Matched & Required Skills */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {job.getSkillsRequired().map(skill => {
                            const isMatched = item.matchedSkills.includes(skill);
                            return (
                              <span
                                key={skill}
                                className={`text-[11px] px-2 py-0.5 rounded font-mono ${
                                  isMatched
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}
                              >
                                {isMatched && '✓ '}
                                {skill}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Salary & Apply CTA */}
                      <div className="flex flex-col items-end gap-2 shrink-0 self-stretch sm:self-center justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0">
                        {job.getSalaryMin() && job.getSalaryMax() && (
                          <span className="text-xs font-mono font-semibold text-slate-900 dark:text-white">
                            {job.getSalaryMin()?.toLocaleString('tr-TR')} - {job.getSalaryMax()?.toLocaleString('tr-TR')} {job.getCurrency()}
                          </span>
                        )}

                        {hasAppliedAlready ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Başvuruldu</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              if (!currentUser) {
                                onOpenAuth();
                              } else {
                                setSelectedJobToApply(job);
                              }
                            }}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Hemen Başvur</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {filteredMatches.length > 0 && (
              <Pagination
                currentPage={jobPage}
                totalItems={filteredMatches.length}
                pageSize={jobPageSize}
                onPageChange={setJobPage}
                onPageSizeChange={setJobPageSize}
              />
            )}
          </div>
        </div>
      )}

      {/* SUB TAB 2: MY APPLICATIONS */}
      {activeSubTab === 'my-applications' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Yaptığım İş Başvuruları ({myApplications.length})
            </h2>
            <p className="text-xs text-slate-500">
              Başvuru sürecinizin güncel aşamasını ve şirket yetkilisinin bıraktığı inceleme notlarını takip edin.
            </p>
          </div>

          {myApplications.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              Henüz bir ilana başvuruda bulunmadınız.{' '}
              <button
                onClick={() => setActiveSubTab('matching-jobs')}
                className="text-indigo-600 font-semibold hover:underline"
              >
                İlanları inceleyin ➔
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {myApplications.map(app => (
                <div key={app.getId()} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {app.getJobTitle()}
                      </h3>
                      <span aria-hidden="true" className="text-slate-400">·</span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {app.getCompanyName()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                      <span>Başvuru Tarihi: {new Date(app.getAppliedAt()).toLocaleDateString('tr-TR')}</span>
                      {app.getReviewedAt() && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>İncelenme: {new Date(app.getReviewedAt()!).toLocaleDateString('tr-TR')}</span>
                        </>
                      )}
                    </div>

                    {app.getNotes() && (
                      <div className="mt-2 p-2.5 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 rounded-lg text-xs text-indigo-900 dark:text-indigo-200">
                        <strong className="block font-semibold">Şirket Değerlendirme Notu:</strong>
                        <span>{app.getNotes()}</span>
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        app.getStatus() === ApplicationStatus.ACCEPTED
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                          : app.getStatus() === ApplicationStatus.INTERVIEW
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300'
                          : app.getStatus() === ApplicationStatus.REVIEWING
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                          : app.getStatus() === ApplicationStatus.REJECTED
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {ApplicationStatusLabels[app.getStatus()]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB TAB 3: CANDIDATE PROFILE & RESUME */}
      {activeSubTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Basic Information Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Kişisel ve Mesleki Bilgiler
                </h2>
                <p className="text-xs text-slate-500">
                  Ad, soyad, telefon, askerlik durumu ve deneyim yılı şirketlerin filtreleme ekranında görünür.
                </p>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Ad
                    </label>
                    <input
                      type="text"
                      required
                      value={profFirstName}
                      onChange={e => setProfFirstName(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Soyad
                    </label>
                    <input
                      type="text"
                      required
                      value={profLastName}
                      onChange={e => setProfLastName(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Telefon Numarası
                    </label>
                    <input
                      type="tel"
                      required
                      value={profPhone}
                      onChange={e => setProfPhone(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      İkamet Şehri
                    </label>
                    <input
                      type="text"
                      required
                      value={profCity}
                      onChange={e => setProfCity(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                    />
                  </div>
                </div>

                {/* Military Status (Crucial requirement) */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-750">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Askerlik Durumu (Zorunlu Alan)
                    </label>
                    <select
                      value={profMilitaryStatus}
                      onChange={e => setProfMilitaryStatus(e.target.value as MilitaryStatus)}
                      className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                    >
                      {Object.values(MilitaryStatus).map(st => (
                        <option key={st} value={st}>
                          {MilitaryStatusLabels[st]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Muafiyet / Tecil Detayı (Opsiyonel)
                    </label>
                    <input
                      type="text"
                      value={profMilitaryExemptReason}
                      onChange={e => setProfMilitaryExemptReason(e.target.value)}
                      placeholder="Örn: 2028 yılına kadar tecilli"
                      className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Mevcut Unvan / Pozisyon
                    </label>
                    <input
                      type="text"
                      required
                      value={profTitle}
                      onChange={e => setProfTitle(e.target.value)}
                      placeholder="Senior Java Developer"
                      className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Toplam İş Deneyimi Yılı
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={40}
                      required
                      value={profExpYears}
                      onChange={e => setProfExpYears(Number(e.target.value))}
                      className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Biyografi / Ön Yazı
                  </label>
                  <textarea
                    rows={3}
                    value={profBio}
                    onChange={e => setProfBio(e.target.value)}
                    placeholder="Deneyimleriniz ve çalışma prensipleriniz hakkında kısa özet..."
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Teknolojik Yetenekler (Virgülle ayırın)
                  </label>
                  <input
                    type="text"
                    value={profSkills}
                    onChange={e => setProfSkills(e.target.value)}
                    placeholder="Java, Spring Boot, React, PostgreSQL, Docker"
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs"
                  >
                    Profil Bilgilerini Kaydet
                  </button>
                </div>
              </form>
            </div>

            {/* Work Experiences Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Çalışma ve İş Deneyimleri
                  </h3>
                  <p className="text-xs text-slate-500">
                    Geçmiş şirketleriniz ve çalıştığınız pozisyonlar.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingExp(!isAddingExp)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Deneyim Ekle</span>
                </button>
              </div>

              {/* Add Exp Form */}
              {isAddingExp && (
                <form onSubmit={handleAddExperienceSubmit} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-3 text-xs border border-slate-200 dark:border-slate-750">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Şirket Adı</label>
                      <input
                        type="text"
                        required
                        value={newExpCompany}
                        onChange={e => setNewExpCompany(e.target.value)}
                        placeholder="Örn: Fintek Çözümleri A.Ş."
                        className="w-full px-3 py-1.5 border rounded-lg bg-white dark:bg-slate-850"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Pozisyon / Unvan</label>
                      <input
                        type="text"
                        required
                        value={newExpTitle}
                        onChange={e => setNewExpTitle(e.target.value)}
                        placeholder="Senior Java Geliştirici"
                        className="w-full px-3 py-1.5 border rounded-lg bg-white dark:bg-slate-850"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Başlangıç</label>
                      <input
                        type="text"
                        value={newExpStart}
                        onChange={e => setNewExpStart(e.target.value)}
                        placeholder="2022-01"
                        className="w-full px-3 py-1.5 border rounded-lg bg-white dark:bg-slate-850"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Bitiş</label>
                      <input
                        type="text"
                        disabled={newExpCurrent}
                        value={newExpEnd}
                        onChange={e => setNewExpEnd(e.target.value)}
                        placeholder="2024-05"
                        className="w-full px-3 py-1.5 border rounded-lg bg-white dark:bg-slate-850 disabled:opacity-40"
                      />
                    </div>
                    <div className="flex items-center pt-5">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newExpCurrent}
                          onChange={e => setNewExpCurrent(e.target.checked)}
                          className="rounded text-indigo-600"
                        />
                        <span>Halen Çalışıyorum</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Açıklama / Görevler</label>
                    <textarea
                      rows={2}
                      value={newExpDesc}
                      onChange={e => setNewExpDesc(e.target.value)}
                      placeholder="Spring Boot mikroservis mimarisi ve Kafka entegrasyonu..."
                      className="w-full px-3 py-1.5 border rounded-lg bg-white dark:bg-slate-850"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingExp(false)}
                      className="px-3 py-1.5 border rounded-lg hover:bg-slate-100"
                    >
                      Vazgeç
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-semibold"
                    >
                      Kaydet
                    </button>
                  </div>
                </form>
              )}

              {/* List Experiences */}
              <div className="space-y-2">
                {profile?.getWorkExperiences().length === 0 ? (
                  <p className="text-xs text-slate-400">Henüz iş deneyimi eklenmemiş.</p>
                ) : (
                  profile?.getWorkExperiences().map(exp => (
                    <div key={exp.id} className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl text-xs flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                          <span>{exp.title}</span>
                          <span aria-hidden="true" className="text-slate-400">·</span>
                          <span className="font-normal text-indigo-600 dark:text-indigo-400">{exp.companyName}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {exp.startDate} - {exp.isCurrent ? 'Halen Devam Ediyor' : exp.endDate}
                        </span>
                        {exp.description && (
                          <p className="text-slate-600 dark:text-slate-400 mt-1">{exp.description}</p>
                        )}
                      </div>
                      {currentUser && (
                        <button
                          onClick={() => candidateService.removeExperience(currentUser.getId(), exp.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Educations Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Eğitim Bilgileri
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mezun olduğunuz okul, fakülte ve derece.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingEdu(!isAddingEdu)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Eğitim Ekle</span>
                </button>
              </div>

              {isAddingEdu && (
                <form onSubmit={handleAddEducationSubmit} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-3 text-xs border border-slate-200 dark:border-slate-750">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Üniversite / Kurum</label>
                      <input
                        type="text"
                        required
                        value={newEduInst}
                        onChange={e => setNewEduInst(e.target.value)}
                        placeholder="İstanbul Teknik Üniversitesi"
                        className="w-full px-3 py-1.5 border rounded-lg bg-white dark:bg-slate-850"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Bölüm</label>
                      <input
                        type="text"
                        required
                        value={newEduDept}
                        onChange={e => setNewEduDept(e.target.value)}
                        placeholder="Bilgisayar Mühendisliği"
                        className="w-full px-3 py-1.5 border rounded-lg bg-white dark:bg-slate-850"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Derece</label>
                      <select
                        value={newEduDegree}
                        onChange={e => setNewEduDegree(e.target.value)}
                        className="w-full px-2.5 py-1.5 border rounded-lg bg-white dark:bg-slate-850"
                      >
                        <option value="Lisans">Lisans</option>
                        <option value="Yüksek Lisans">Yüksek Lisans (Master)</option>
                        <option value="Doktora">Doktora (PhD)</option>
                        <option value="Ön Lisans">Ön Lisans</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Mezuniyet Yılı</label>
                      <input
                        type="number"
                        min={1970}
                        max={2030}
                        value={newEduYear}
                        onChange={e => setNewEduYear(Number(e.target.value))}
                        className="w-full px-3 py-1.5 border rounded-lg bg-white dark:bg-slate-850 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingEdu(false)}
                      className="px-3 py-1.5 border rounded-lg hover:bg-slate-100"
                    >
                      Vazgeç
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-semibold"
                    >
                      Kaydet
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {profile?.getEducations().map(edu => (
                  <div key={edu.id} className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{edu.institution}</span>
                      <span className="text-slate-500 text-[11px]">{edu.degree} · {edu.department}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-400">{edu.graduationYear}</span>
                      {currentUser && (
                        <button
                          onClick={() => candidateService.removeEducation(currentUser.getId(), edu.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Profile Summary & Completeness Card */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Profil Doluluk Durumu
              </h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Tamamlanma Oranı:</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">
                    %{profile ? profile.calculateCompleteness() : 0}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all"
                    style={{ width: `${profile ? profile.calculateCompleteness() : 0}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Kişisel Bilgiler & İletişim</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Askerlik Durumu Beyanı</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Teknoloji & Yetenek Listesi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>İş ve Deneyim Geçmişi</span>
                </div>
              </div>

              {profile && (
                <div className="pt-2">
                  <button
                    onClick={() => fileIOService.exportCandidateCV(profile, currentUser || undefined)}
                    className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>CV Belgesi Oluştur & İndir</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* APPLY MODAL */}
      {selectedJobToApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  İş Başvurusu Yap
                </h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  {selectedJobToApply.getTitle()} · {selectedJobToApply.getCompanyName()}
                </p>
              </div>
              <button
                onClick={() => setSelectedJobToApply(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {applyError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                {applyError}
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                <span className="block font-semibold text-slate-800 dark:text-slate-200">
                  Başvuru Bilgileriniz Şirkete İletilecek:
                </span>
                <p>
                  Aday: <strong>{profile?.getFullName()}</strong> ({profile?.getPhone()})
                </p>
                <p>
                  Askerlik Durumu:{' '}
                  <strong>{profile ? MilitaryStatusLabels[profile.getMilitaryStatus()] : '-'}</strong>
                </p>
                <p>Toplam Deneyim: <strong>{profile?.getExperienceYears()} Yıl</strong></p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ön Yazı / Başvuru Notu (İsteğe Bağlı)
                </label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  placeholder="Şirkete iletmek istediğiniz ön yazı, tecrübeleriniz ve bu pozisyona ilginiz..."
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedJobToApply(null)}
                  className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Başvuruyu Gönder</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
