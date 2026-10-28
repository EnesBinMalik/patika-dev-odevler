import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

export const TeamSection: React.FC = () => {
  const team = [
    {
      name: 'Enes Öztürk',
      role: 'Kurucu & Lead Full-Stack Architect',
      bio: 'Modern web mimarileri, React/Node ekosistemi ve bulut dağıtımları konusunda uzmanlaşmış kıdemli yazılım mühendisi.',
      avatarInitial: 'EÖ',
      skills: ['Full-Stack', 'Node.js', 'React', 'Cloud'],
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
    {
      name: 'Selin Akın',
      role: 'Kreatif Direktör & UI/UX Lideri',
      bio: 'Marka kimliği, tasarım sistemleri ve ödüllü dijital deneyimler tasarlayan çok disiplinli sanat yönetmeni.',
      avatarInitial: 'SA',
      skills: ['Figma', 'Design Systems', 'Brand Strategy'],
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
    {
      name: 'Can Demir',
      role: 'Kıdemli Backend & DevOps Mühendisi',
      bio: 'Ölçeklenebilir API servisleri, veritabanı optimizasyonu ve Heroku/Docker dağıtım hatları uzmanı.',
      avatarInitial: 'CD',
      skills: ['PostgreSQL', 'Express', 'Heroku', 'Docker'],
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
    {
      name: 'Elif Yılmaz',
      role: 'Kullanıcı Deneyimi & İçerik Stratejisti',
      bio: 'Dönüşüm odaklı kullanıcı araştırmaları, bilgi mimarisi ve dijital ürün stratejisi geliştiricisi.',
      avatarInitial: 'EY',
      skills: ['User Research', 'Information Architecture', 'SEO'],
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
  ];

  return (
    <section id="team" className="py-20 lg:py-28 border-b border-neutral-800 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-semibold text-amber-400 tracking-wider uppercase mb-2">
            04. Çekirdek Ekip
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Uzman Mühendislik & Yaratıcı Kadro
          </h2>
          <p className="mt-4 text-sm text-neutral-400 leading-relaxed">
            Farklı disiplinlerden gelen uzmanlığımızla, projelerinizi fikir aşamasından buluta taşıyan dinamik ekip.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div
              key={member.name}
              className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/80 hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 rounded-2xl bg-neutral-800 text-amber-400 font-bold text-lg flex items-center justify-center border border-neutral-700 mb-5">
                  {member.avatarInitial}
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                <p className="text-xs text-amber-400 font-medium mb-3">{member.role}</p>
                <p className="text-xs text-neutral-300 leading-relaxed mb-6">{member.bio}</p>
              </div>

              <div>
                <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <span>{member.skills[0]}</span>
                    <span>·</span>
                    <span>{member.skills[1]}</span>
                  </div>

                  <div className="flex items-center gap-2 text-neutral-400">
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                      aria-label="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-amber-400 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
