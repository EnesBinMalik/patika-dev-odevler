/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Component: SwaggerViewer
 * Implements interactive Spring Boot Swagger-UI (OpenAPI 3.0) documentation and live "Try it out" runner
 */

import React, { useState } from 'react';
import { FileCode2, Play, ChevronDown, ChevronRight, Check, Copy } from 'lucide-react';
import { DatabaseService } from '../core/services/DatabaseService.ts';
import { CandidateService } from '../core/services/CandidateService.ts';
import { JobService } from '../core/services/JobService.ts';
import { AuthService } from '../core/services/AuthService.ts';
import { MilitaryStatus } from '../core/types/enums.ts';

interface EndpointSpec {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  tag: 'Authentication' | 'Candidates' | 'Jobs' | 'Applications' | 'System';
  description: string;
  parameters?: { name: string; type: string; required: boolean; description: string; default?: string }[];
  requestBody?: string;
  defaultResponse: any;
  execute: (params: Record<string, any>, body: any) => any;
}

export const SwaggerViewer: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [expandedEndpoints, setExpandedEndpoints] = useState<Record<string, boolean>>({
    'GET_/api/v1/candidates': true,
    'GET_/api/v1/jobs/matching': true,
  });
  const [executionResponses, setExecutionResponses] = useState<Record<string, { status: number; duration: number; data: any }>>({});

  const db = DatabaseService.getInstance();
  const candService = CandidateService.getInstance();
  const jobService = JobService.getInstance();
  const authService = AuthService.getInstance();

  const endpoints: EndpointSpec[] = [
    {
      method: 'POST',
      path: '/api/v1/auth/login',
      summary: 'Kullanıcı Girişi ve 3 Hatalı Girişte Hesap Kilitleme',
      tag: 'Authentication',
      description: 'Spring Security doğrulaması. 3 ardışık hatalı şifrede hesabı otomatik bloke eder.',
      requestBody: JSON.stringify({ email: 'ahmet.yilmaz@gmail.com', password: '123456' }, null, 2),
      defaultResponse: { token: 'jwt.header.payload', expiresIn: 3600, role: 'USER' },
      execute: (_, body) => {
        try {
          const parsed = typeof body === 'string' ? JSON.parse(body) : body;
          const res = authService.login(parsed.email || '', parsed.password || '');
          return res;
        } catch (e: any) {
          return { error: e.message };
        }
      },
    },
    {
      method: 'GET',
      path: '/api/v1/candidates',
      summary: 'Aday Havuzu ve Şirket Kriterleri Filtreleme (Askerlik, 5+ Yıl vb.)',
      tag: 'Candidates',
      description: 'Database Specification/Strategy filtreleme: Askerliği yapmış, en az 5 yıl tecrübeli adaylar.',
      parameters: [
        { name: 'militaryStatus', type: 'string', required: false, description: 'DONE, EXEMPT, DEFERRED' },
        { name: 'minExperienceYears', type: 'number', required: false, description: 'Örn: 5', default: '5' },
        { name: 'skills', type: 'string', required: false, description: 'Örn: Java, React' },
      ],
      defaultResponse: [],
      execute: params => {
        const minYears = params.minExperienceYears ? Number(params.minExperienceYears) : undefined;
        const mil = params.militaryStatus ? [params.militaryStatus as MilitaryStatus] : undefined;
        const skills = params.skills ? params.skills.split(',') : undefined;
        const list = candService.filterCandidates({
          minExperienceYears: minYears,
          militaryStatuses: mil,
          skills,
        });
        return {
          totalCount: list.length,
          appliedFilter: { minYears, military: mil, skills },
          candidates: list.map(c => c.toJSON()),
        };
      },
    },
    {
      method: 'GET',
      path: '/api/v1/jobs/matching',
      summary: '"Bana Uygun İş Var Mı?" Eşleştirme Motoru',
      tag: 'Jobs',
      description: 'Adayın askerlik, tecrübe ve yetenek profiline göre iş ilanlarını uyum skoruna göre sıralar.',
      parameters: [
        { name: 'candidateUserId', type: 'string', required: true, description: 'Aday ID', default: 'usr_cand_1' },
      ],
      defaultResponse: [],
      execute: params => {
        const userId = params.candidateUserId || 'usr_cand_1';
        const matches = jobService.findMatchingJobsForCandidate(userId);
        return {
          candidateId: userId,
          matchedJobCount: matches.length,
          results: matches.map(m => ({
            jobTitle: m.job.getTitle(),
            company: m.job.getCompanyName(),
            matchScore: `${m.matchScore}%`,
            isEligible: m.isEligible,
            militaryRequirementMet: m.militaryMatch,
            experienceRequirementMet: m.experienceMatch,
            matchedSkills: m.matchedSkills,
            missingSkills: m.missingSkills,
          })),
        };
      },
    },
    {
      method: 'GET',
      path: '/api/v1/jobs',
      summary: 'Aktif İş İlanlarını Listeleme',
      tag: 'Jobs',
      description: 'Yayında olan tüm kurumsal iş ilanları.',
      defaultResponse: [],
      execute: () => {
        return {
          total: db.jobs.findActiveJobs().count(),
          jobs: db.jobs.findActiveJobs().map(j => j.toJSON()).toList(),
        };
      },
    },
    {
      method: 'GET',
      path: '/api/v1/applications',
      summary: 'Başvuru Kayıtları ve Aday Takip',
      tag: 'Applications',
      description: 'Tüm iş başvurularını ve durumlarını listeler.',
      defaultResponse: [],
      execute: () => {
        return {
          total: db.applications.count(),
          applications: db.applications.findAll().map(a => a.toJSON()).toList(),
        };
      },
    },
    {
      method: 'GET',
      path: '/api/v1/system/audit-logs',
      summary: 'Sistem ve Güvenlik Denetim Logları',
      tag: 'System',
      description: 'Spring Boot Logback denetim log kayıtları.',
      defaultResponse: [],
      execute: () => {
        return {
          totalLogs: db.logs.count(),
          recentLogs: db.logs.findRecent(10).map(l => l.toJSON()).toList(),
        };
      },
    },
  ];

  const filteredEndpoints = selectedTag === 'ALL' ? endpoints : endpoints.filter(e => e.tag === selectedTag);

  const toggleEndpoint = (key: string) => {
    setExpandedEndpoints(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const runEndpoint = (endpoint: EndpointSpec) => {
    const key = `${endpoint.method}_${endpoint.path}`;
    const start = performance.now();
    const result = endpoint.execute({ minExperienceYears: 5, candidateUserId: 'usr_cand_1' }, endpoint.requestBody);
    const duration = Math.round(performance.now() - start);

    setExecutionResponses(prev => ({
      ...prev,
      [key]: {
        status: 200,
        duration,
        data: result,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Swagger Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Spring Boot OpenAPI / Swagger-UI (v3.0)
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
              v1.0.0-PROD
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Geliştirici & Sistem Mimarı: <strong>Enes Öztürk</strong> · [Base URL: /api/v1]
          </p>
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {['ALL', 'Authentication', 'Candidates', 'Jobs', 'Applications', 'System'].map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedTag === tag
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Endpoints Accordion List */}
      <div className="space-y-3">
        {filteredEndpoints.map(endpoint => {
          const key = `${endpoint.method}_${endpoint.path}`;
          const isExpanded = !!expandedEndpoints[key];
          const execRes = executionResponses[key];

          const isGet = endpoint.method === 'GET';
          const isPost = endpoint.method === 'POST';

          return (
            <div
              key={key}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs"
            >
              {/* Endpoint Header Bar */}
              <div
                onClick={() => toggleEndpoint(key)}
                className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none transition-colors ${
                  isGet
                    ? 'hover:bg-blue-50/50 dark:hover:bg-blue-950/20'
                    : 'hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-bold font-mono tracking-wider ${
                      isGet
                        ? 'bg-blue-600 text-white'
                        : isPost
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {endpoint.method}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                    {endpoint.path}
                  </span>
                  <span className="text-xs text-slate-500 hidden sm:inline">
                    — {endpoint.summary}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                    {endpoint.tag}
                  </span>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {/* Endpoint Body */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 space-y-4 text-xs font-sans">
                  <p className="text-slate-600 dark:text-slate-400">{endpoint.description}</p>

                  {/* Parameters */}
                  {endpoint.parameters && endpoint.parameters.length > 0 && (
                    <div className="space-y-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px] uppercase tracking-wider">
                        Sorgu Parametreleri (Query Parameters)
                      </span>
                      <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-750 rounded-lg overflow-hidden bg-white dark:bg-slate-900 font-mono text-xs">
                        {endpoint.parameters.map(p => (
                          <div key={p.name} className="p-2.5 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white">{p.name}</span>
                              <span className="text-slate-400 text-[11px] ml-2 font-sans">{p.description}</span>
                            </div>
                            <span className="text-indigo-600 text-[11px]">
                              {p.type} {p.default ? `(Default: ${p.default})` : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Request Body if POST */}
                  {endpoint.requestBody && (
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px] uppercase tracking-wider mb-1">
                        Request Body (JSON)
                      </span>
                      <pre className="p-3 bg-slate-900 text-emerald-400 rounded-lg text-xs font-mono overflow-x-auto">
                        {endpoint.requestBody}
                      </pre>
                    </div>
                  )}

                  {/* Try it out Action */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => runEndpoint(endpoint)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Try it out (Servisi Çalıştır)</span>
                    </button>
                    <span className="text-xs text-slate-400">
                      Canlı servis katmanına gerçek sorgu gönderir.
                    </span>
                  </div>

                  {/* Execution Response */}
                  {execRes && (
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-500">
                          Yanıt Kodu:{' '}
                          <strong className="text-emerald-600 font-bold">{execRes.status} OK</strong>
                        </span>
                        <span className="text-slate-500">
                          Süre: <strong className="text-indigo-600 font-bold">{execRes.duration} ms</strong>
                        </span>
                      </div>
                      <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono max-h-64 overflow-y-auto">
                        {JSON.stringify(execRes.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
