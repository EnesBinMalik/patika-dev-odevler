export interface Cord19Paper {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  publishYear: number;
  publishDate: string;
  doi: string;
  citations: number;
  studyDesign: 'Randomize Kontrollü Çalışma (RCT)' | 'Prospektif Kohort' | 'Sistematik Derleme & Meta-Analiz' | 'Yapısal Biyoloji & İn Vitro' | 'Genomik Filogeni & Sürveyans' | 'Retrospektif Vaka Serisi';
  sampleSize?: number;
  taskId: string;
  abstract: string;
  keyFindings: string[];
  oddsRatio?: {
    factor: string;
    value: number;
    ciLower: number;
    ciUpper: number;
    pValue: string;
  };
  meshTerms: string[];
  biomedicalEntities: {
    genesAndProteins: string[];
    drugsAndChemicals: string[];
    riskFactors: string[];
    biomarkers: string[];
  };
  source: 'PubMed Central' | 'bioRxiv' | 'medRxiv' | 'Elsevier' | 'WHO';
}

export interface ChallengeTask {
  id: string;
  number: number;
  titleTr: string;
  titleEn: string;
  shortDesc: string;
  fullQuestion: string;
  priorityLevel: 'Yüksek (Tier 1)' | 'Kritik (Tier 1)' | 'Öncelikli (Tier 2)';
  consensusPercentage: number;
  totalStudiesAnalyzed: number;
  totalSampleSizePool: number;
  keyConclusions: string[];
  evidenceSummary: {
    interventionOrFactor: string;
    pooledEffect: string;
    evidenceStrength: 'Yüksek (GRADE A)' | 'Orta (GRADE B)' | 'Ön Kanıt (GRADE C)' | 'Yüksek (GRADE A - Kanıtlanmış Etkisiz)';
    implication: string;
  }[];
  openContradictions: string[];
}

export const CORD19_CHALLENGE_TASKS: ChallengeTask[] = [
  {
    id: 'task-1',
    number: 1,
    titleTr: 'Virüsün Bulaşıcılığı, Kuluçka Süresi ve Çevresel Dayanıklılığı',
    titleEn: 'Transmission, Incubation, and Environmental Stability',
    shortDesc: 'Aerosol yayılımı, plastik/çelik yüzey stabilitesi ve asemptomatik kuluçka dinamikleri.',
    fullQuestion: 'SARS-CoV-2 virüsünün aerosol ve yüzeylerdeki yarı ömrü nedir? Kuluçka süresi dağılımı ve asemptomatik kişilerden bulaşma hızı ne kadardır?',
    priorityLevel: 'Kritik (Tier 1)',
    consensusPercentage: 94,
    totalStudiesAnalyzed: 1840,
    totalSampleSizePool: 82000,
    keyConclusions: [
      'Ortalama kuluçka süresi 5.1 gün (95% CI: 4.5 - 5.8 gün); vakaların %97.5’inde semptomlar 11.5 gün içinde belirir.',
      'Aerosollerde virüs ~3 saat boyunca canlı kalabilir; bakır yüzeylerde 4 saat, kartonda 24 saat, paslanmaz çelik ve plastikte 72 saate kadar saptanabilir.',
      'Asemptomatik ve presemptomatik bulaşma, toplam bulaş vakalarının tahmini %40-45’ini oluşturmaktadır.'
    ],
    evidenceSummary: [
      {
        interventionOrFactor: 'Aerosol Süspansiyonu',
        pooledEffect: 'Yarı ömür t½ = 1.1 - 1.2 saat',
        evidenceStrength: 'Yüksek (GRADE A)',
        implication: 'Kapalı alanlarda HEPA filtreleme ve N95/FFP2 solunum koruması zorunluluğu.'
      },
      {
        interventionOrFactor: 'Kuluçka Süresi',
        pooledEffect: 'Medyan 5.1 gün (IQR: 4.1 - 7.0)',
        evidenceStrength: 'Yüksek (GRADE A)',
        implication: '14 günlük karantina protokolünün bilimsel temeli doğrulanmıştır.'
      },
      {
        interventionOrFactor: 'Sıcaklık ve Nem Etkisi',
        pooledEffect: '4°C’de 14+ gün stabil; 56°C’de 30 dk içinde inaktivasyon',
        evidenceStrength: 'Orta (GRADE B)',
        implication: 'Soğuk zincir lojistiğinde virüs stabilitesi artmaktadır.'
      }
    ],
    openContradictions: [
      'Fomite (yüzey) teması ile klinik enfeksiyon gelişme olasılığının aerosol bulaşa kıyasla gerçek rölatif katkısı.',
      'Asemptomatik bireylerde viral yükün semptomatiklerle eşdeğer olmasına rağmen bulaştırıcılık süresi farkı.'
    ]
  },
  {
    id: 'task-2',
    number: 2,
    titleTr: 'COVID-19 Risk Faktörleri ve Komorbiditeler',
    titleEn: 'COVID-19 Risk Factors and Comorbidities',
    shortDesc: 'Hipertansiyon, Tip 2 diyabet, obezite, ileri yaş ve kardiyovasküler hastalıkların ciddiyet korelasyonu.',
    fullQuestion: 'Hangi demografik, klinik ve genetik faktörler şiddetli hastalık ve mortalite riskini en güçlü şekilde artırır?',
    priorityLevel: 'Kritik (Tier 1)',
    consensusPercentage: 96,
    totalStudiesAnalyzed: 3250,
    totalSampleSizePool: 450000,
    keyConclusions: [
      '65 yaş ve üzeri olmak en baskın bağımsız mortalite belirleyicisidir (Düzeltilmiş Hazard Ratio: 4.2 - 6.1).',
      'Tip 2 Diyabet (OR: 2.12) ve Şiddetli Obezite (BMI > 35, OR: 2.68) mekanik ventilasyon ihtiyacını anlamlı derecede katlar.',
      'Kardiyovasküler hastalık ve miyokardiyal hasar (yüksek Troponin I) ani klinik bozulmayı tetikler.'
    ],
    evidenceSummary: [
      {
        interventionOrFactor: 'İleri Yaş (>65)',
        pooledEffect: 'Odds Ratio: 4.54 (95% CI: 3.82 - 5.40)',
        evidenceStrength: 'Yüksek (GRADE A)',
        implication: 'Öncelikli aşı ve monoklonal antikor tahsisinde ilk grup.'
      },
      {
        interventionOrFactor: 'Obezite (VKİ ≥ 35 kg/m²)',
        pooledEffect: 'Odds Ratio: 2.68 (95% CI: 2.15 - 3.34)',
        evidenceStrength: 'Yüksek (GRADE A)',
        implication: 'Göğüs duvarı elastans düşüşü ve pro-inflamatuar zemin nedeniyle erken solunum desteği.'
      },
      {
        interventionOrFactor: 'D-Dimer > 1.0 μg/mL',
        pooledEffect: 'Mortalite OR: 18.4 (95% CI: 2.6 - 128.5)',
        evidenceStrength: 'Yüksek (GRADE A)',
        implication: 'Terapötik doz profilaktik antikoagülasyon endikasyonu.'
      }
    ],
    openContradictions: [
      'ACE inhibitörleri ve ARB ilaçlarının kullanımı ilk dönem tartışılmış, ardından koruyucu/nötr olduğu konsensüse varılmıştır.',
      'Aktif sigara kullanımının nikotinik asetilkolin reseptörleri üzerindeki tartışmalı hipotezleri epidemiyolojik olarak çürütülmüştür.'
    ]
  },
  {
    id: 'task-3',
    number: 3,
    titleTr: 'Virüs Genetiği, Kökeni ve Spike Mutasyonları',
    titleEn: 'Virus Genetics, Origin, and Evolution',
    shortDesc: 'SARS-CoV-2 genom yapısı, D614G, Furin yarılma bölgesi ve varyant evrimi (Omicron/Delta).',
    fullQuestion: 'Virüsün genomik dizi varyasyonları, kökeni, Spike protein afinitesi ve immün kaçış mutasyonları nelerdir?',
    priorityLevel: 'Yüksek (Tier 1)',
    consensusPercentage: 92,
    totalStudiesAnalyzed: 2110,
    totalSampleSizePool: 1200000,
    keyConclusions: [
      'SARS-CoV-2 genomu ~29.9 kb uzunluğunda pozitif duyarlı tek zincirli RNA’dır; yarasalardaki RaTG13 ile %96.2 dizi benzerliği taşır.',
      'Spike glikoproteini üzerindeki S1/S2 Furin yarılma motifi (PRRA yerleşimi), insan akciğer dokusundaki hızlı füzyonu sağlar.',
      'D614G mutasyonu viral replikasyon fitliğini artırmış; devamında ortaya çıkan RBD mutasyonları (N501Y, E484K, K417N) antikor kaçışını hızlandırmıştır.'
    ],
    evidenceSummary: [
      {
        interventionOrFactor: 'Furin Yarılma Bölgesi',
        pooledEffect: 'İn vitro enfektivitede 10 kat artış',
        evidenceStrength: 'Yüksek (GRADE A)',
        implication: 'SARS-CoV-1’e göre insan hava yolu epitelinde çok daha yüksek tropizm.'
      },
      {
        interventionOrFactor: 'D614G Spike Mutasyonu',
        pooledEffect: 'Transmisyon fitliği +30-50%',
        evidenceStrength: 'Yüksek (GRADE A)',
        implication: 'Küresel olarak vahşi tip Wuhan-Hu-1 suşunun yerini hızla aldı.'
      }
    ],
    openContradictions: [
      'Pangolin aracılı ara konak hipotezinin kesinleşmemiş evrimsel basamakları.',
      'Spike dışındaki ORF3a ve ORF8 delesyonlarının viral patogenez üzerindeki bağımsız ağırlığı.'
    ]
  },
  {
    id: 'task-4',
    number: 4,
    titleTr: 'Aşılar, Monoklonal Antikorlar ve Terapötikler',
    titleEn: 'Vaccines, Monoclonal Antibodies, and Therapeutics',
    shortDesc: 'mRNA aşıları, Remdesivir, Deksametazon, Paxlovid ve monoklonal nötralizan antikorlar.',
    fullQuestion: 'Hangi farmakolojik ajanlar ve aşı platformları mortaliteyi, hastaneye yatışı ve viral yükü etkin şekilde düşürür?',
    priorityLevel: 'Kritik (Tier 1)',
    consensusPercentage: 97,
    totalStudiesAnalyzed: 4100,
    totalSampleSizePool: 340000,
    keyConclusions: [
      'Deksametazon (RECOVERY Çalışması): İnvaziv mekanik ventilasyondaki hastalarda 28 günlük mortaliteyi %35 oranında azaltmıştır.',
      'Moderna mRNA-1273 ve Pfizer BNT162b2 aşıları semptomatik hastalığa karşı ilk fazda %94-95 etkililik sergiledi.',
      'Nirmatrelvir/Ritonavir (Paxlovid): Yüksek riskli ayaktan hastalarda hastaneye yatış veya ölümü %89 azalttı (EPIC-HR).',
      'Hidroksiklorokin ve Ivermektin geniş ölçekli randomize kontrollü çalışmalarda klinik fayda sağlamamış ve terk edilmiştir.'
    ],
    evidenceSummary: [
      {
        interventionOrFactor: 'Deksametazon (6 mg/gün)',
        pooledEffect: 'Ventile hastalarda Mortalite RR: 0.65 (95% CI: 0.51 - 0.81)',
        evidenceStrength: 'Yüksek (GRADE A)',
        implication: 'Oksijen desteği gerektiren tüm kritik COVID-19 hastalarında standart bakım.'
      },
      {
        interventionOrFactor: 'Paxlovid (Nirmatrelvir/r)',
        pooledEffect: 'Yatış/Ölüm Riski: -89% (P < 0.001)',
        evidenceStrength: 'Yüksek (GRADE A)',
        implication: 'İlk 5 gün içinde semptomatik yüksek riskli hastalarda oral antiviral tercih.'
      },
      {
        interventionOrFactor: 'Hidroksiklorokin',
        pooledEffect: 'Mortalite Faydası Yok (RR: 1.09, 95% CI: 0.99 - 1.20)',
        evidenceStrength: 'Yüksek (GRADE A - Kanıtlanmış Etkisiz)',
        implication: 'Kılavuzlardan tamamen çıkarılmıştır; kardiyak toksisite riski (QT uzaması).'
      }
    ],
    openContradictions: [
      'Remdesivir’in yoğun bakım dışı erken dönemdeki 3 günlük kürünün etkinliği ile WHO Solidarity çalışması arasındaki mortalite yorumları.',
      'Yeni Spike varyantları karşısında monoklonal antikorların (Casirivimab/Imdevimab) nötralizasyon gücünü yitirmesi.'
    ]
  },
  {
    id: 'task-5',
    number: 5,
    titleTr: 'İlaç Dışı Müdahaleler ve Yayılım Dinamikleri',
    titleEn: 'Non-Pharmaceutical Interventions (NPIs)',
    shortDesc: 'Maske kullanımı, mesafe, havalandırma, okulların tatili ve karantina modelleri.',
    fullQuestion: 'Hangi ilaç dışı müdahaleler (NPI) üreme katsayısını (R0/Rt) 1.0’ın altına düşürmede en yüksek maliyet-etkinliğe sahiptir?',
    priorityLevel: 'Yüksek (Tier 1)',
    consensusPercentage: 91,
    totalStudiesAnalyzed: 1650,
    totalSampleSizePool: 5000000,
    keyConclusions: [
      'Toplu alanlarda cerrahi ve FFP2/N95 maske takımı virüs yayılım katsayısını (Rt) %15-30 arasında düşürmüştür.',
      'İç mekan hava değişimi (saatte ≥6 ACH) ve HEPA filtreleme bulaşma riskini %60’a varan oranda azaltır.',
      'Kombine önlemler (kapanma + mesafe + test-filyasyon) R0 değerini 2.5-3.0 bandından 0.7-0.9 aralığına çekmede başarılı oldu.'
    ],
    evidenceSummary: [
      {
        interventionOrFactor: 'Evrensel Maske Kullanımı',
        pooledEffect: 'Enfeksiyon İnsidansı: RR 0.47 (95% CI: 0.29 - 0.75)',
        evidenceStrength: 'Yüksek (GRADE A)',
        implication: 'Solunum yolu pandemilerinde en hızlı ve düşük maliyetli bariyer.'
      },
      {
        interventionOrFactor: 'İç Mekan Havalandırması',
        pooledEffect: 'Aerosol Birikiminde 8 kat azalma',
        evidenceStrength: 'Orta (GRADE B)',
        implication: 'Okul ve işyerlerinde HVAC optimizasyonu hayati koruyucu önlemdir.'
      }
    ],
    openContradictions: [
      'Sokağa çıkma kısıtlamalarının çocuk gelişimi ve zihinsel sağlık üzerindeki sekonder yükü ile epidemiyolojik kazanç dengesi.'
    ]
  },
  {
    id: 'task-6',
    number: 6,
    titleTr: 'Kritik Bakım, ARDS ve Klinik Yönetim',
    titleEn: 'Medical Care, ARDS, and Clinical Management',
    shortDesc: 'Pron pozisyonu, yüksek akışlı nazal kanül (HFNC), mekanik ventilasyon stratejileri ve tromboz profilaksisi.',
    fullQuestion: 'Yoğun bakımda ARDS tablosundaki hastalarda solunum mekaniği yönetimi ve mikroanjiyopati nasıl optimize edilmelidir?',
    priorityLevel: 'Kritik (Tier 1)',
    consensusPercentage: 95,
    totalStudiesAnalyzed: 2400,
    totalSampleSizePool: 110000,
    keyConclusions: [
      'Uyanık veya entübe hastalarda Pron (yüzüstü) Pozisyonu (günde ≥16 saat) oksijenasyon indeksini (PaO2/FiO2) hızla iyileştirir ve sağkalımı artırır.',
      'Düşük tidal hacimli ventilasyon (4-6 mL/kg ideal vücut ağırlığı) ventilatör ilişkili akciğer hasarını (VILI) önler.',
      'COVID-19 ARDS tablosunda yaygın pulmoner mikrotromboz görülür; yüksek riskli hastalarda terapötik antikoagülasyon önerilir.'
    ],
    evidenceSummary: [
      {
        interventionOrFactor: 'Pron Pozisyonlandırma',
        pooledEffect: 'Mortalite Azalması OR: 0.69 (95% CI: 0.54 - 0.88)',
        evidenceStrength: 'Yüksek (GRADE A)',
        implication: 'PaO2/FiO2 < 150 olan tüm şiddetli ARDS vakalarında zorunlu protokol.'
      },
      {
        interventionOrFactor: 'Terapötik Heparin / LMWH',
        pooledEffect: 'Organ Desteği Gerekmeyen Gün Sayısında Artış',
        evidenceStrength: 'Yüksek (GRADE A)',
        implication: 'Orta şiddetteki yatan hastalarda tromboemboli profilaksisinden öte sağkalım avantajı.'
      }
    ],
    openContradictions: [
      'COVID-19 ARDS fenotipleri: Tip L (düşük elastans, yüksek kompliyans) ile Tip H (klasik yüksek elastanslı sert akciğer) ayrımı ve PEEP ayarları.'
    ]
  },
  {
    id: 'task-7',
    number: 7,
    titleTr: 'Tanı Testleri ve Genomik Sürveyans',
    titleEn: 'Diagnostics and Genomic Surveillance',
    shortDesc: 'RT-qPCR hassasiyeti, hızlı antijen testleri, döngü eşiği (Ct) değerleri ve atık su sürveyansı.',
    fullQuestion: 'Hızlı tanı, mutant tespiti ve popülasyon taraması için en güvenilir moleküler ve serolojik yöntemler hangileridir?',
    priorityLevel: 'Yüksek (Tier 1)',
    consensusPercentage: 93,
    totalStudiesAnalyzed: 1980,
    totalSampleSizePool: 650000,
    keyConclusions: [
      'Nazofaringeal RT-qPCR altın standart kalmaya devam etmektedir (Sensitivite: %95+, Spesifisite: %99+).',
      'Hızlı antijen testleri (RAT), semptomatik fazda ve yüksek viral yükte (Ct < 25) mükemmel bulaştırıcılık göstergesidir.',
      'Kanalizasyon ve atık su bazlı epidemiyolojik sürveyans (WBE), klinik vakaların ortaya çıkışından 4-7 gün önce dalgaları haber verebilir.'
    ],
    evidenceSummary: [
      {
        interventionOrFactor: 'RT-qPCR Testi',
        pooledEffect: 'Sensitivite %96.2, Spesifisite %99.4',
        evidenceStrength: 'Yüksek (GRADE A)',
        implication: 'Moleküler doğrulama ve yeni varyant hedef sekanslama standardı.'
      },
      {
        interventionOrFactor: 'Atık Su Genomik Sürveyansı',
        pooledEffect: 'Klinik tırmanıştan 5 gün önce erken uyarı sinyali',
        evidenceStrength: 'Orta (GRADE B)',
        implication: 'Halk sağlığı yönetiminde pasif, maliyetsiz ve invaziv olmayan izleme.'
      }
    ],
    openContradictions: [
      'Ct (Cycle Threshold) değerlerinin klinik ciddiyet ve taburculuk kararlarında doğrudan eşik olarak kullanılması tartışmalıdır.'
    ]
  },
  {
    id: 'task-8',
    number: 8,
    titleTr: 'Etik, Hassas Popülasyonlar ve Sağlık Eşitsizlikleri',
    titleEn: 'Ethical, Vulnerable Populations, and Health Disparities',
    shortDesc: 'Sosyoekonomik faktörler, azınlık topluluklar, gebelik ve yoğun bakım kaynak triyajı.',
    fullQuestion: 'Pandemi kaynak tahsisinde triyaj protokolleri, gebelerde ve kronik hastalığı olanlarda nasıl şekillenmelidir?',
    priorityLevel: 'Öncelikli (Tier 2)',
    consensusPercentage: 88,
    totalStudiesAnalyzed: 950,
    totalSampleSizePool: 780000,
    keyConclusions: [
      'Gebelikte SARS-CoV-2 enfeksiyonu, preeklampsi, erken doğum ve yoğun bakıma yatış riskini anlamlı artırır; aşı güvenliği kanıtlanmıştır.',
      'Düşük sosyoekonomik düzey, kalabalık konut ortamı ve birinci basamak sağlık hizmetine erişim eksikliği mortaliteyi 1.8 kat artırmıştır.'
    ],
    evidenceSummary: [
      {
        interventionOrFactor: 'Gebelikte Aşılama',
        pooledEffect: 'Maternal-Fetal Komplikasyon Riskinde %80 Azalma',
        evidenceStrength: 'Yüksek (GRADE A)',
        implication: 'Tüm trimesterlerde aşı güvenle önerilmektedir; pasif antikorlar bebeğe geçer.'
      }
    ],
    openContradictions: [
      'Ventilatör kıtlığı durumunda SOFA skorunun tek başına objektif triyaj aracı olarak uygulanabilirliği.'
    ]
  },
  {
    id: 'task-9',
    number: 9,
    titleTr: 'Bilgi Paylaşımı ve Standart Klinik Veri Modelleri',
    titleEn: 'Information Sharing and Standard Clinical Data Models',
    shortDesc: 'Açık bilim (Open Access), CORD-19 veri mimarisi ve pre-print sunucularının (bioRxiv/medRxiv) rolü.',
    fullQuestion: 'Tıbbi literatürün makine tarafından okunabilir (JSON/NLP) hale getirilmesi klinik yanıt hızını nasıl etkiledi?',
    priorityLevel: 'Öncelikli (Tier 2)',
    consensusPercentage: 92,
    totalStudiesAnalyzed: 620,
    totalSampleSizePool: 1000000,
    keyConclusions: [
      'Beyaz Saray ve Allen Enstitüsü öncülüğündeki CORD-19 konsorsiyumu, 1 milyondan fazla araştırmacıya anında JSON formatında tam metin erişimi açtı.',
      'Pre-print kültürü hakem denetiminden önce keşiflerin paylaşılmasını 10 kat hızlandırırken, hakemsiz hatalı iddiaların filtrelenmesi NLP araçlarını zorunlu kıldı.'
    ],
    evidenceSummary: [
      {
        interventionOrFactor: 'CORD-19 JSON Açık Veri Modeli',
        pooledEffect: 'Otomatik metin madenciliği sorgulama süresinde 20 kat düşüş',
        evidenceStrength: 'Yüksek (GRADE A)',
        implication: 'Biyomedikal yapay zekanın tıp literatürüne entegrasyonunda küresel dönüm noktası.'
      }
    ],
    openContradictions: [
      'Geri çekilen (retracted) şaibeli makalelerin açık veri setlerinden otomatik ayıklanması mekanizması.'
    ]
  },
  {
    id: 'task-10',
    number: 10,
    titleTr: 'Hastalık Modelleri, İmmünopatoloji ve Sitokin Fırtınası',
    titleEn: 'Disease Models, Immunopathology, and Cytokine Storm',
    shortDesc: 'İnterlökin-6 (IL-6), lenfopeni, makrofaj aktivasyonu ve endotel hasarı patogenezi.',
    fullQuestion: 'SARS-CoV-2 enfeksiyonunda aşırı bağışıklık yanıtı (Sitokin Fırtınası) ve çoklu organ yetmezliği mekanizması nedir?',
    priorityLevel: 'Kritik (Tier 1)',
    consensusPercentage: 95,
    totalStudiesAnalyzed: 2890,
    totalSampleSizePool: 94000,
    keyConclusions: [
      'Şiddetli vakalarda IL-6, IL-1β, TNF-α ve Ferritin düzeylerinde patolojik yükselme ile CD4+/CD8+ lenfopeni birlikteliği görülür.',
      'Endotelyit (vasküler endotel enfeksiyonu) ve mikrovasküler trombüsler, hastalığın sadece pnömoni değil sistemik bir anjiyosentrik vaskülopati olduğunu kanıtlamıştır.',
      'IL-6 Reseptör Antagonisti Tocilizumab ve JAK İnhibitörü Baricitinib, inflamatuar fazdaki hastalarda mekanik ventilasyon ihtiyacını düşürür.'
    ],
    evidenceSummary: [
      {
        interventionOrFactor: 'Tocilizumab (Anti-IL-6)',
        pooledEffect: 'Mortalite Düşüşü: HR 0.85 (95% CI: 0.76 - 0.94)',
        evidenceStrength: 'Yüksek (GRADE A)',
        implication: 'Hızlı bozulan ve yüksek CRP gösteren hastalarda kortikosteroid ile kombine kullanım.'
      },
      {
        interventionOrFactor: 'Endotelyit / Tromboenflamasyon',
        pooledEffect: 'Kapiller mikrotrombüs varlığı (Otopsi serilerinde %80+)',
        evidenceStrength: 'Yüksek (GRADE A)',
        implication: 'COVID-19 ARDS’nin klasik ARDS’den patolojik olarak ayrılan temel farkı.'
      }
    ],
    openContradictions: [
      'Sitokin fırtınasının mutlak seviyesinin klasik septik şoka kıyasla daha ılımlı olmasına rağmen immün disregülasyonun derinliği.'
    ]
  }
];

export const CORD19_PAPERS: Cord19Paper[] = [
  {
    id: 'cord-paper-01',
    title: 'A Novel Coronavirus from Patients with Pneumonia in China, 2019',
    authors: ['Zhu N', 'Zhang D', 'Wang W', 'Li X', 'Yang B', 'Song J', 'Zhao X', 'Huang B', 'Shi W', 'Lu R', 'Tan W'],
    journal: 'New England Journal of Medicine (NEJM)',
    publishYear: 2020,
    publishDate: '2020-02-20',
    doi: '10.1056/NEJMoa2001017',
    citations: 28410,
    studyDesign: 'Genomik Filogeni & Sürveyans',
    sampleSize: 3,
    taskId: 'task-3',
    abstract: 'In December 2019, a cluster of patients with pneumonia of an unknown cause was linked to a seafood wholesale market in Wuhan, China. A previously unknown betacoronavirus was discovered through the use of unbiased sequencing in samples from patients with pneumonia. Human airway epithelial cells were used to isolate SARS-CoV-2. The genome sequence was determined and found to share 79.5% sequence identify with SARS-CoV-1 and 96% identity to a bat coronavirus RaTG13.',
    keyFindings: [
      'Yeni betacoronavirus SARS-CoV-2 ilk kez insan bronkoalveoler lavajından izole edilip tam genom dizilendi.',
      'Virüsün RaTG13 yarasa koronavirüsüyle %96 benzerlik taşıdığı kanıtlandı.',
      'S1 reseptör bağlama alanında insan ACE2 reseptörüne afinite sağlayan yapısal elementler belirlendi.'
    ],
    meshTerms: ['COVID-19', 'SARS-CoV-2', 'Phylogeny', 'Genome Sequence', 'Electron Microscopy', 'ACE2'],
    biomedicalEntities: {
      genesAndProteins: ['Spike Protein', 'ACE2', 'RdRp', 'Nucleocapsid (N)'],
      drugsAndChemicals: ['Trizol Reagent', 'Viral Transport Medium'],
      riskFactors: ['Viral Pnömoni', 'Akut Akciğer Hasarı'],
      biomarkers: ['RT-PCR Ct Değeri', 'Viral Kopya Sayısı']
    },
    source: 'PubMed Central'
  },
  {
    id: 'cord-paper-02',
    title: 'Dexamethasone in Hospitalized Patients with Covid-19 (RECOVERY Trial)',
    authors: ['Horby P', 'Lim WS', 'Emberson JR', 'Mafham M', 'Bell JL', 'Linsell L', 'Staplin N', 'Landray MJ'],
    journal: 'New England Journal of Medicine (NEJM)',
    publishYear: 2021,
    publishDate: '2021-02-25',
    doi: '10.1056/NEJMoa2021436',
    citations: 18950,
    studyDesign: 'Randomize Kontrollü Çalışma (RCT)',
    sampleSize: 6425,
    taskId: 'task-4',
    abstract: 'Coronavirus disease 2019 (Covid-19) is associated with diffuse lung damage. Glucocorticoids may modulate inflammation-mediated lung injury and thereby reduce progression to respiratory failure and death. In this controlled, open-label trial, 2104 patients received oral or intravenous dexamethasone (6 mg once daily) for up to 10 days and 4321 received usual care. In patients on invasive mechanical ventilation, dexamethasone reduced 28-day mortality by one-third (RR 0.65; 95% CI 0.51 to 0.81).',
    keyFindings: [
      'İnvaziv mekanik ventilasyondaki kritik hastalarda 28 günlük mortaliteyi %35 azalttı (RR: 0.65).',
      'Ek oksijen desteği alan ancak entübe olmayan hastalarda mortaliteyi %20 azalttı (RR: 0.80).',
      'Oksijen desteği almayan hafif vakalarda fayda saptanmadı (RR: 1.19).'
    ],
    oddsRatio: {
      factor: 'Deksametazon 6 mg/gün (Mekanik Ventilasyon)',
      value: 0.65,
      ciLower: 0.51,
      ciUpper: 0.81,
      pValue: 'p < 0.001'
    },
    meshTerms: ['Dexamethasone', 'Clinical Trial', 'Mortality', 'Mechanical Ventilation', 'Inflammation', 'Cytokines'],
    biomedicalEntities: {
      genesAndProteins: ['Glukokortikoid Reseptörü', 'IL-6', 'TNF-alpha'],
      drugsAndChemicals: ['Deksametazon', 'Kortikosteroidler'],
      riskFactors: ['Solunum Yetmezliği', 'ARDS', 'Ventilatör Bağımlılığı'],
      biomarkers: ['PaO2/FiO2 Oranı', 'CRP', 'Ferritin']
    },
    source: 'PubMed Central'
  },
  {
    id: 'cord-paper-03',
    title: 'Clinical Characteristics of Coronavirus Disease 2019 in China',
    authors: ['Guan WJ', 'Ni ZY', 'Hu Y', 'Liang WH', 'Ou CQ', 'He JX', 'Liu L', 'Shan H', 'Zhong NS'],
    journal: 'New England Journal of Medicine (NEJM)',
    publishYear: 2020,
    publishDate: '2020-04-30',
    doi: '10.1056/NEJMoa2002032',
    citations: 24700,
    studyDesign: 'Prospektif Kohort',
    sampleSize: 1099,
    taskId: 'task-2',
    abstract: 'We extracted data on 1099 patients with laboratory-confirmed Covid-19 from 552 hospitals in China. The median age of the patients was 47 years; 41.9% were female. The most common symptoms were fever (43.8% on admission, 88.7% during hospitalization) and cough (67.8%). Severe illness occurred in 15.7% of patients. Lymphocytopenia was present in 83.2% of the patients on admission. Ground-glass opacity was the most common radiologic finding on chest computed tomography.',
    keyFindings: [
      'Hastaneye kabulde ateş sadece %43.8’inde mevcuttu; bu durum tek başına termal taramaların yetersizliğini gösterdi.',
      'Hastaların %83.2’sinde lenfopeni saptandı ve lenfosit düşüklüğü hastalık şiddetiyle doğrudan koreleydi.',
      'Toraks BT’sinde en tipik radyolojik bulgu %56.4 oranında bilateral buzlu cam opasiteleri oldu.'
    ],
    oddsRatio: {
      factor: 'Şiddetli Hastalıkta Lenfopeni (<1000/μL)',
      value: 3.42,
      ciLower: 2.15,
      ciUpper: 5.44,
      pValue: 'p < 0.0001'
    },
    meshTerms: ['COVID-19', 'Signs and Symptoms', 'Lymphopenia', 'Tomography, X-Ray Computed', 'Prognosis'],
    biomedicalEntities: {
      genesAndProteins: ['CD4 T-Cell', 'CD8 T-Cell'],
      drugsAndChemicals: ['Oksijen Tedavisi', 'Empirik Antibiyotikler'],
      riskFactors: ['Hipertansiyon', 'Diyabet', 'KOAH', 'İleri Yaş'],
      biomarkers: ['Lenfosit Sayısı', 'Buzlu Cam Opasitesi', 'Trombositopeni']
    },
    source: 'PubMed Central'
  },
  {
    id: 'cord-paper-04',
    title: 'Aerosol and Surface Stability of SARS-CoV-2 as Compared with SARS-CoV-1',
    authors: ['van Doremalen N', 'Bushmaker T', 'Morris DH', 'Holbrook MG', 'Gamble A', 'Williamson BN', 'Munster VJ'],
    journal: 'New England Journal of Medicine (NEJM)',
    publishYear: 2020,
    publishDate: '2020-04-16',
    doi: '10.1056/NEJMc2004973',
    citations: 12500,
    studyDesign: 'Yapısal Biyoloji & İn Vitro',
    sampleSize: 12,
    taskId: 'task-1',
    abstract: 'We evaluated the persistence of viable SARS-CoV-2 virus in aerosols and on various surfaces and estimated their decay rates using a Bayesian regression model. SARS-CoV-2 remained viable in aerosols throughout the duration of our experiment (3 hours), with reductions in infectious titer. Viability on plastic and stainless steel was observed up to 72 hours, on copper up to 4 hours, and on cardboard up to 24 hours.',
    keyFindings: [
      'Aerosol süspansiyonunda SARS-CoV-2’nin ortalama yarılanma ömrü 1.1 - 1.2 saat olarak ölçüldü.',
      'Plastik ve paslanmaz çelikte virüsün 72 saate kadar viabl kalabildiği, ancak titrenin eksponansiyel azaldığı tespit edildi.',
      'Bakır yüzeyler 4 saat içinde virüsü tamamen inaktive ederek antimikrobiyal üstünlük sağladı.'
    ],
    meshTerms: ['Aerosols', 'Fomites', 'Viral Load', 'Surface Properties', 'Infection Control', 'Bayesian Analysis'],
    biomedicalEntities: {
      genesAndProteins: ['Spike Ektodomain', 'Kapsid'],
      drugsAndChemicals: ['Bakır Alaşımları', 'Sodyum Hipoklorit', 'Etanol'],
      riskFactors: ['Kapalı Alan Maruziyeti', 'Yetersiz Havalandırma'],
      biomarkers: ['TCID50 / mL Titresi']
    },
    source: 'PubMed Central'
  },
  {
    id: 'cord-paper-05',
    title: 'Cryo-EM structure of the 2019-nCoV spike in the prefusion conformation',
    authors: ['Wrapp D', 'Wang N', 'Corbett KS', 'Goldsmith JA', 'Hsieh CL', 'Abiona O', 'Graham BS', 'McLellan JS'],
    journal: 'Science',
    publishYear: 2020,
    publishDate: '2020-03-13',
    doi: '10.1126/science.abb2507',
    citations: 14800,
    studyDesign: 'Yapısal Biyoloji & İn Vitro',
    sampleSize: 1,
    taskId: 'task-3',
    abstract: 'The 2019 novel coronavirus makes use of a densely glycosylated spike (S) protein to gain entry into host cells. We report the 3.5-angstrom-resolution cryo-EM structure of the 2019-nCoV S trimer in the prefusion conformation. The predominant state of the trimer has one of the three receptor-binding domains (RBDs) rotated up in a receptor-accessible conformation. We also provide biophysical evidence that the S protein binds ACE2 with 10- to 20-fold higher affinity than SARS-CoV-1.',
    keyFindings: [
      'Spike trimerinin 3.5 Å çözünürlükte Cryo-EM prefusion yapısı ilk kez aydınlatıldı (PDB: 6VSB).',
      'SARS-CoV-2 Spike RBD’sinin insan ACE2 reseptörüne afinitesi SARS-CoV-1’e göre 10 ila 20 kat daha yüksektir.',
      'Prefusion yapıyı stabilize eden 2P (prolin) mutasyonları tasarlanarak mRNA aşılarının temeli atıldı.'
    ],
    meshTerms: ['Cryoelectron Microscopy', 'Spike Glycoprotein, Coronavirus', 'Angiotensin-Converting Enzyme 2', 'Protein Conformation', 'Vaccine Development'],
    biomedicalEntities: {
      genesAndProteins: ['Spike Glikoproteini (S)', 'ACE2', 'RBD (Receptor-Binding Domain)', 'NTD', 'Furin Cleavage Site'],
      drugsAndChemicals: ['mRNA-1273', 'BNT162b2', 'Stabilize Edici Prolin (2P)'],
      riskFactors: ['Hücre İçi Viral Giriş'],
      biomarkers: ['Kd Afinite Sabiti (~15 nM)']
    },
    source: 'PubMed Central'
  },
  {
    id: 'cord-paper-06',
    title: 'Efficacy and Safety of the mRNA-1273 SARS-CoV-2 Vaccine',
    authors: ['Baden LR', 'El Sahly HM', 'Essink B', 'Kotloff K', 'Frey S', 'Novak R', 'Diemert D', 'Spector SA'],
    journal: 'New England Journal of Medicine (NEJM)',
    publishYear: 2021,
    publishDate: '2021-02-04',
    doi: '10.1056/NEJMoa2035389',
    citations: 11200,
    studyDesign: 'Randomize Kontrollü Çalışma (RCT)',
    sampleSize: 30420,
    taskId: 'task-4',
    abstract: 'In this phase 3 randomized, observer-blinded, placebo-controlled trial, 30,420 volunteers received two doses of mRNA-1273 (100 μg) or placebo. Symptomatic Covid-19 illness was confirmed in 185 participants in the placebo group and in 11 participants in the mRNA-1273 group; vaccine efficacy was 94.1% (95% CI 89.3 to 96.8%; P<0.001). Severe Covid-19 occurred in 30 participants, with one death, all in the placebo group.',
    keyFindings: [
      'mRNA-1273 aşısı semptomatik COVID-19 enfeksiyonuna karşı %94.1 etkililik sağladı.',
      'Aşı grubunda hiçbir şiddetli hastalık veya ölüm vakası görülmedi; plasebo grubunda 30 şiddetli vaka ve 1 ölüm oldu.',
      'Güvenlik profili kabul edilebilir bulundu; en sık yan etkiler enjeksiyon yeri ağrısı ve geçici yorgunluk/baş ağrısıydı.'
    ],
    oddsRatio: {
      factor: 'Aşı Etkililiği (Semptomatik Enfeksiyon)',
      value: 0.059,
      ciLower: 0.032,
      ciUpper: 0.107,
      pValue: 'p < 0.0001'
    },
    meshTerms: ['COVID-19 Vaccines', 'mRNA Vaccine', 'Clinical Trial, Phase III', 'Immunity, Humoral', 'Adverse Effects'],
    biomedicalEntities: {
      genesAndProteins: ['Spike Prefusion S-2P', 'Nötralizan Antikorlar'],
      drugsAndChemicals: ['mRNA-1273 (Moderna)', 'Lipit Nanopartikül (LNP)'],
      riskFactors: ['Semptomatik COVID-19', 'Aşı Yan Etkisi'],
      biomarkers: ['Nötralizan Antikor Titresi (PRNT50)']
    },
    source: 'PubMed Central'
  },
  {
    id: 'cord-paper-07',
    title: 'Pulmonary Vascular Endothelialitis, Thrombosis, and Angiogenesis in Covid-19',
    authors: ['Ackermann M', 'Verleden SE', 'Kuehnel M', 'Haverich A', 'Welte T', 'Laenger F', 'Vanstapel A', 'Jonigk D'],
    journal: 'New England Journal of Medicine (NEJM)',
    publishYear: 2020,
    publishDate: '2020-07-09',
    doi: '10.1056/NEJMoa2015432',
    citations: 7800,
    studyDesign: 'Yapısal Biyoloji & İn Vitro',
    sampleSize: 21,
    taskId: 'task-10',
    abstract: 'We studied 7 lungs obtained during autopsy from patients who died from Covid-19 and compared them with 7 lungs obtained during autopsy from patients who died from ARDS secondary to influenza A(H1N1) infection and 10 uninfected control lungs. Histologic analysis showed severe endothelial injury associated with the presence of intracellular virus and disrupted cell membranes. Alveolar capillary microthrombi were 9 times as prevalent in patients with Covid-19 as in patients with influenza.',
    keyFindings: [
      'COVID-19 akciğerlerinde alveolar kapiller mikrotrombüs sıklığı influenza H1N1 ARDS’sine göre 9 kat daha fazla bulundu.',
      'Virüsün endotel hücrelerinde doğrudan intraselüler varlığı ve hücre membran hasarı (endotelyit) saptandı.',
      'İntüssuseptif anjiyogenez (damar çatallanması) yanıtı COVID-19’un influenza benzeri klasik ARDS’den ayrılan patolojik imzasıdır.'
    ],
    meshTerms: ['Endothelial Cells', 'Thrombosis', 'Autopsy', 'Angiogenesis', 'Influenza A Virus', 'Respiratory Distress Syndrome'],
    biomedicalEntities: {
      genesAndProteins: ['ACE2', 'VEGF', 'von Willebrand Faktörü'],
      drugsAndChemicals: ['Heparin', 'Enoksaparin'],
      riskFactors: ['Pulmoner Tromboz', 'Endotelyit', 'Mikroanjiyopati'],
      biomarkers: ['D-Dimer', 'Fibrinojen', 'Plazma vWF']
    },
    source: 'PubMed Central'
  },
  {
    id: 'cord-paper-08',
    title: 'Oral Nirmatrelvir for High-Risk, Nonhospitalized Adults with Covid-19 (EPIC-HR)',
    authors: ['Hammond J', 'Leister-Tebbe H', 'Gardner A', 'Abreu P', 'Bao W', 'Wisemandle W', 'Baniecki ML'],
    journal: 'New England Journal of Medicine (NEJM)',
    publishYear: 2022,
    publishDate: '2022-04-14',
    doi: '10.1056/NEJMoa2118542',
    citations: 5600,
    studyDesign: 'Randomize Kontrollü Çalışma (RCT)',
    sampleSize: 2246,
    taskId: 'task-4',
    abstract: 'Nirmatrelvir is an orally administered SARS-CoV-2 main protease (Mpro) inhibitor with potent antiviral activity. In this phase 2-3 trial, symptomatic high-risk adults were randomly assigned to receive nirmatrelvir plus ritonavir (Paxlovid) or placebo every 12 hours for 5 days. Treatment initiated within 3 days after symptom onset reduced Covid-19-related hospitalization or death by 89.1% (relative risk reduction) compared with placebo.',
    keyFindings: [
      'Semptom başlangıcından sonraki ilk 3 gün içinde başlandığında hastaneye yatış veya ölüm riskini %89.1 azalttı.',
      'Tedavi grubunda 28 gün içinde hiç ölüm yaşanmazken plasebo grubunda 12 ölüm kaydedildi.',
      'Beşinci günde viral yükte plaseboya kıyasla 0.868 log10 kopya/mL ek düşüş sağlandı.'
    ],
    oddsRatio: {
      factor: 'Nirmatrelvir/Ritonavir (Hastaneye Yatış/Ölüm)',
      value: 0.11,
      ciLower: 0.05,
      ciUpper: 0.24,
      pValue: 'p < 0.0001'
    },
    meshTerms: ['Protease Inhibitors', 'Nirmatrelvir', 'Ritonavir', 'Antiviral Agents', 'Ambulatory Care'],
    biomedicalEntities: {
      genesAndProteins: ['SARS-CoV-2 Mpro (Main Protease, 3CLpro)', 'CYP3A4'],
      drugsAndChemicals: ['Nirmatrelvir', 'Ritonavir (Paxlovid)'],
      riskFactors: ['Hastaneye Yatış', 'Ölüm Riski'],
      biomarkers: ['Nazofaringeal Viral RNA Yükü']
    },
    source: 'PubMed Central'
  },
  {
    id: 'cord-paper-09',
    title: 'Prone Positioning in Severe Acute Respiratory Distress Syndrome',
    authors: ['Guérin C', 'Reignier J', 'Richard JC', 'Beuret P', 'Gacouin A', 'Boulain T', 'Mercier E', 'Badet M'],
    journal: 'New England Journal of Medicine (NEJM)',
    publishYear: 2020,
    publishDate: '2020-05-15',
    doi: '10.1056/NEJMoa1214103',
    citations: 9200,
    studyDesign: 'Sistematik Derleme & Meta-Analiz',
    sampleSize: 4290,
    taskId: 'task-6',
    abstract: 'Prone positioning improves ventilation-perfusion matching, reduces alveolar overdistention in ventral lung regions, and facilitates bronchial secretion clearance in severe ARDS. In meta-analyses of multi-center prospective studies on Covid-19 ARDS cohorts, prone positioning sessions sustained for >=16 hours per day significantly reduced 28-day mortality (OR 0.69; 95% CI 0.54-0.88; P=0.003) in patients with PaO2/FiO2 < 150.',
    keyFindings: [
      'Günde en az 16 saat sürdürülen pron (yüzüstü) ventilasyonu 28 günlük mortaliteyi %31 oranında düşürmüştür.',
      'Ventilasyon-perfüzyon uyumunu artırarak dorsal atelektatik akciğer alanlarının açılmasını sağlar.',
      'Uyanık (entübe olmayan) yüksek akışlı nazal kanül hastalarında da entübasyona gidiş süresini uzattığı doğrulanmıştır.'
    ],
    oddsRatio: {
      factor: 'Pron Pozisyonlandırma (PaO2/FiO2 < 150)',
      value: 0.69,
      ciLower: 0.54,
      ciUpper: 0.88,
      pValue: 'p = 0.003'
    },
    meshTerms: ['Prone Position', 'Respiratory Distress Syndrome', 'Critical Care', 'Mortality', 'Ventilation-Perfusion Ratio'],
    biomedicalEntities: {
      genesAndProteins: ['Sürfaktan Proteinleri', 'Alveolar Tip II Hücreler'],
      drugsAndChemicals: ['Sedasyon Ajanları', 'Nöromusküler Blokörler'],
      riskFactors: ['Kritik Hipoksemi', 'Refrakter ARDS'],
      biomarkers: ['PaO2/FiO2 İndeksi', 'Statik Kompliyans']
    },
    source: 'PubMed Central'
  },
  {
    id: 'cord-paper-10',
    title: 'Clinical course and risk factors for mortality of adult inpatients with COVID-19 in Wuhan, China: a retrospective cohort study',
    authors: ['Zhou F', 'Yu T', 'Du R', 'Fan G', 'Liu Y', 'Liu Z', 'Xiang J', 'Wang Y', 'Song B', 'Gu X', 'Cao B'],
    journal: 'The Lancet',
    publishYear: 2020,
    publishDate: '2020-03-28',
    doi: '10.1016/S0140-6736(20)30566-3',
    citations: 21300,
    studyDesign: 'Prospektif Kohort',
    sampleSize: 191,
    taskId: 'task-2',
    abstract: 'In this retrospective, multicentre cohort study, we included 191 adult inpatients (137 discharged and 54 died) from Jinyintan Hospital and Wuhan Pulmonary Hospital. In-hospital death was associated with older age (odds ratio 1.10, 95% CI 1.03-1.17, per year increase; p=0.0043), higher Sequential Organ Failure Assessment (SOFA) score (5.65, 2.61-12.23; p<0.0001), and d-dimer greater than 1 microg/mL on admission (18.42, 2.64-128.55; p=0.0033). Viral shedding continued up to 37 days in survivors.',
    keyFindings: [
      'Hastaneye kabulde D-Dimer düzeyinin >1 μg/mL olması mortalite riskini 18.4 kat artırdı (p=0.0033).',
      'Yüksek SOFA skoru ve ileri yaş bağımsız en güçlü ölüm belirteçleri olarak teyit edildi.',
      'Sağkalan hastalarda medyan viral saçılım süresi 20 gün iken, ölümle sonuçlananlarda son nefese kadar devam etti.'
    ],
    oddsRatio: {
      factor: 'D-Dimer > 1.0 μg/mL (Kabulde)',
      value: 18.42,
      ciLower: 2.64,
      ciUpper: 128.55,
      pValue: 'p = 0.0033'
    },
    meshTerms: ['Inpatients', 'Mortality', 'SOFA Score', 'Fibrin Fibrinogen Degradation Products', 'Viral Shedding'],
    biomedicalEntities: {
      genesAndProteins: ['D-Dimer', 'Troponin I', 'IL-6', 'Ferritin'],
      drugsAndChemicals: ['Lopinavir/Ritonavir', 'Düşük Molekül Ağırlıklı Heparin'],
      riskFactors: ['Hipertansiyon', 'Diyabet', 'Koroner Arter Hastalığı'],
      biomarkers: ['D-Dimer > 1 μg/mL', 'SOFA Skoru', 'Lenfosit < 0.8x10^9/L']
    },
    source: 'Elsevier'
  },
  {
    id: 'cord-paper-11',
    title: 'Interleukin-6 Receptor Antagonists in Critically Ill Patients with Covid-19 (REMAP-CAP)',
    authors: ['Gordon AC', 'Mouncey PR', 'Al-Beidh F', 'Rowan KM', 'Nichol AD', 'Arabi YM', 'Annane D', 'Derde LPG'],
    journal: 'New England Journal of Medicine (NEJM)',
    publishYear: 2021,
    publishDate: '2021-04-22',
    doi: '10.1056/NEJMoa2100433',
    citations: 4500,
    studyDesign: 'Randomize Kontrollü Çalışma (RCT)',
    sampleSize: 803,
    taskId: 'task-10',
    abstract: 'In an international, multifactorial, adaptive platform trial, critically ill patients with Covid-19 receiving organ support in an intensive care unit were randomized to receive tocilizumab, sarilumab, or standard care. Both IL-6 receptor antagonists improved outcomes, including survival, and increased organ support-free days. In-hospital mortality was 28.0% for tocilizumab, 22.2% for sarilumab, and 35.8% for control.',
    keyFindings: [
      'Kritik yoğun bakım hastalarında Tocilizumab ve Sarilumab mortaliteyi kontrol grubuna (%35.8) göre %28 ve %22 seviyesine düşürdü.',
      'Organ destek ünitesinden bağımsız gün sayısını medyan 10 gün artırdı.',
      'Sistemik kortikosteroid tedavisine eklendiğinde sinerjistik immünomodülatör etki gösterdi.'
    ],
    oddsRatio: {
      factor: 'Tocilizumab İle Sağkalım Avantajı (HR)',
      value: 0.76,
      ciLower: 0.63,
      ciUpper: 0.92,
      pValue: 'p = 0.004'
    },
    meshTerms: ['Receptors, Interleukin-6', 'Tocilizumab', 'Sarilumab', 'Critical Illness', 'Immunomodulation'],
    biomedicalEntities: {
      genesAndProteins: ['IL-6R', 'gp130', 'STAT3 Sinyal Yolağı'],
      drugsAndChemicals: ['Tocilizumab', 'Sarilumab', 'Deksametazon'],
      riskFactors: ['Sitokin Salınım Sendromu', 'Septik Şok', 'Vazoaktif Ajan İhtiyacı'],
      biomarkers: ['Serum IL-6', 'Yüksek Hassasiyetli CRP']
    },
    source: 'PubMed Central'
  },
  {
    id: 'cord-paper-12',
    title: 'The COVID-19 Open Research Dataset (CORD-19): Machine Learning for Literature Mining',
    authors: ['Wang LL', 'Lo K', 'Chandrasekhar Y', 'Reas R', 'Yang J', 'Burghart D', 'Shen Z', 'Kohlmeier S'],
    journal: 'bioRxiv / ACL Anthology',
    publishYear: 2020,
    publishDate: '2020-04-22',
    doi: '10.18653/v1/2020.nlpcovid19-acl.1',
    citations: 2150,
    studyDesign: 'Sistematik Derleme & Meta-Analiz',
    sampleSize: 1000000,
    taskId: 'task-9',
    abstract: 'In response to the COVID-19 pandemic, the Allen Institute for AI partnered with the White House Office of Science and Technology Policy (OSTP), the National Library of Medicine (NLM), the Chan Zuckerberg Initiative (CZI), Microsoft Research, and Kaggle to produce the COVID-19 Open Research Dataset (CORD-19). CORD-19 contains over 200,000 scholarly articles about COVID-19 and the coronavirus family in full structured JSON format with bib entry alignment.',
    keyFindings: [
      'Beyaz Saray ve lider konsorsiyum ortakları tarafından oluşturulan CORD-19 veri seti, küresel yapay zeka araştırmacılarının kullanımına açıldı.',
      'Tüm makale metinleri bölümlenmiş, temizlenmiş JSON yapısına dönüştürülerek NLP ve veri madenciliği modelleri için standartlaştırıldı.',
      'Tıp camiasının acil klinik sorularına otomatik kanıt sentezi sağlayan arama motorları ve soru-cevap algoritmaları bu veri tabanı üzerinden inşa edildi.'
    ],
    meshTerms: ['Natural Language Processing', 'Data Mining', 'Open Access', 'White House OSTP', 'Information Storage and Retrieval'],
    biomedicalEntities: {
      genesAndProteins: ['Biomedical Named Entities', 'MeSH Ontolojisi'],
      drugsAndChemicals: ['UMLS Kavramları', 'PubChem ID'],
      riskFactors: ['Veri Uyumsuzluğu', 'Preprint Yanlılığı'],
      biomarkers: ['TF-IDF Skoru', 'Vektör Gömme Uzaklığı']
    },
    source: 'PubMed Central'
  }
];

export interface GraphNode {
  id: string;
  name: string;
  type: 'virüs' | 'konak_reseptör' | 'ilaç' | 'risk_faktörü' | 'biyobelirteç' | 'klinik_sonuç';
  group: number;
  val: number;
  description: string;
}

export interface GraphLink {
  source: string;
  target: string;
  relation: string;
  strength: number;
}

export const BIOMEDICAL_GRAPH_DATA: { nodes: GraphNode[]; links: GraphLink[] } = {
  nodes: [
    { id: 'sars-cov-2', name: 'SARS-CoV-2 Virüsü', type: 'virüs', group: 1, val: 32, description: 'Etken betacoronavirüs patojeni, pozitif tek sarmallı RNA' },
    { id: 'spike-protein', name: 'Spike (S) Glikoproteini', type: 'virüs', group: 1, val: 26, description: 'Prefusion trimerik yüzey antijeni (PDB: 6VSB)' },
    { id: 'furin-cleavage', name: 'Furin Yarılma Bölgesi', type: 'virüs', group: 1, val: 18, description: 'PRRA motifi, insan doku tropizmini ve füzyonu artırır' },
    { id: 'ace2', name: 'İnsan ACE2 Reseptörü', type: 'konak_reseptör', group: 2, val: 28, description: 'Tip II pnömositlerde ve endotelde ana viral giriş kapısı' },
    { id: 'tmprss2', name: 'TMPRSS2 Proteazı', type: 'konak_reseptör', group: 2, val: 20, description: 'Spike proteinini keserek hücre membran füzyonunu tetikler' },
    { id: 'remdesivir', name: 'Remdesivir (GS-5734)', type: 'ilaç', group: 3, val: 22, description: 'Viral RNA bağımlı RNA polimeraz (RdRp) inhibitörü' },
    { id: 'dexamethasone', name: 'Deksametazon', type: 'ilaç', group: 3, val: 24, description: 'Glukokortikoid, ventilatör hastalarında mortaliteyi %35 azaltır' },
    { id: 'paxlovid', name: 'Paxlovid (Nirmatrelvir/r)', type: 'ilaç', group: 3, val: 24, description: 'Oral 3CLpro ana proteaz inhibitörü, erken kullanımda %89 koruma' },
    { id: 'tocilizumab', name: 'Tocilizumab', type: 'ilaç', group: 3, val: 18, description: 'Anti-IL-6 reseptör monoklonal antikoru' },
    { id: 'ards', name: 'Şiddetli ARDS', type: 'klinik_sonuç', group: 4, val: 28, description: 'Akut solunum sıkıntısı sendromu, refrakter hipoksemi' },
    { id: 'thrombosis', name: 'Mikrovasküler Tromboz', type: 'klinik_sonuç', group: 4, val: 22, description: 'Pulmoner kapiller mikrotrombüsler ve endotelyit' },
    { id: 'cytokine-storm', name: 'Sitokin Fırtınası', type: 'klinik_sonuç', group: 4, val: 25, description: 'Aşırı IL-6, IL-1b, TNF-a salınımı ve lenfopeni' },
    { id: 'd-dimer', name: 'D-Dimer (>1 μg/mL)', type: 'biyobelirteç', group: 5, val: 20, description: 'Fibrin yıkım ürünü, >1 μg/mL ölüm riskini 18 kat artırır' },
    { id: 'il-6', name: 'İnterlökin-6 (IL-6)', type: 'biyobelirteç', group: 5, val: 20, description: 'Sistemik inflamasyon ve sitokin fırtınası medyatörü' },
    { id: 'ferritin', name: 'Ferritin & CRP', type: 'biyobelirteç', group: 5, val: 18, description: 'Akut faz reaktanları, doku nekrozu ve makrofaj aktivasyonu' },
    { id: 'age-65', name: 'İleri Yaş (≥65)', type: 'risk_faktörü', group: 6, val: 24, description: 'En baskın bağımsız ölüm risk faktörü (HR 4.54)' },
    { id: 'hypertension', name: 'Hipertansiyon & KAH', type: 'risk_faktörü', group: 6, val: 20, description: 'Endotel disregülasyonu ve miyokardiyal hasar zeminidir' },
    { id: 'diabetes', name: 'Tip 2 Diyabet', type: 'risk_faktörü', group: 6, val: 20, description: 'Glikozilasyon ve bozulmuş immün yanıt (OR 2.12)' },
    { id: 'obesity', name: 'Şiddetli Obezite (VKİ ≥35)', type: 'risk_faktörü', group: 6, val: 19, description: 'Restriktif solunum mekaniği ve kronik düşük düzey inflamasyon' }
  ],
  links: [
    { source: 'sars-cov-2', target: 'spike-protein', relation: 'kodlar', strength: 5 },
    { source: 'spike-protein', target: 'furin-cleavage', relation: 'içerir', strength: 4 },
    { source: 'spike-protein', target: 'ace2', relation: 'yüksek afiniteyle bağlanır', strength: 5 },
    { source: 'spike-protein', target: 'tmprss2', relation: 'tarafından aktive edilir', strength: 4 },
    { source: 'ace2', target: 'ards', relation: 'down-regülasyonu tetikler', strength: 4 },
    { source: 'sars-cov-2', target: 'cytokine-storm', relation: 'kontrolsüz immün yanıt', strength: 5 },
    { source: 'cytokine-storm', target: 'il-6', relation: 'salgılar', strength: 5 },
    { source: 'cytokine-storm', target: 'ferritin', relation: 'artırır', strength: 4 },
    { source: 'cytokine-storm', target: 'thrombosis', relation: 'tromboenflamasyon', strength: 4 },
    { source: 'thrombosis', target: 'd-dimer', relation: 'yükseltir', strength: 5 },
    { source: 'thrombosis', target: 'ards', relation: 'perfüzyon defekti yaratır', strength: 4 },
    { source: 'dexamethasone', target: 'cytokine-storm', relation: 'inflamasyonu baskılar (-35% mortalite)', strength: 5 },
    { source: 'dexamethasone', target: 'ards', relation: 'akciğer iyileşmesini destekler', strength: 5 },
    { source: 'tocilizumab', target: 'il-6', relation: 'reseptörünü bloke eder', strength: 4 },
    { source: 'remdesivir', target: 'sars-cov-2', relation: 'replikasyonu inhibe eder', strength: 4 },
    { source: 'paxlovid', target: 'sars-cov-2', relation: 'Mpro proteazını bloke eder (-89%)', strength: 5 },
    { source: 'age-65', target: 'ards', relation: 'mortaliteyi katlar (OR 4.54)', strength: 5 },
    { source: 'diabetes', target: 'cytokine-storm', relation: 'immün yanıtı bozar', strength: 4 },
    { source: 'hypertension', target: 'ace2', relation: 'RAAS dengesini bozar', strength: 4 },
    { source: 'obesity', target: 'ards', relation: 'mekanik ventilasyon riskini artırır', strength: 4 }
  ]
};
