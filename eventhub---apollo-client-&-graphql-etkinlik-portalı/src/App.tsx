import React, { useState } from 'react';
import { ApolloProvider, useQuery } from '@apollo/client/react';
import { apolloClient } from './graphql/client.ts';
import { GET_EVENTS } from './graphql/queries.ts';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { EventList } from './components/EventList.tsx';
import { EventDetailModal } from './components/EventDetailModal.tsx';
import { AddEventModal } from './components/AddEventModal.tsx';
import { GraphQLConsoleModal } from './components/GraphQLConsoleModal.tsx';
import { AboutHomeworkModal } from './components/AboutHomeworkModal.tsx';
import { Footer } from './components/Footer.tsx';

function MainApp() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'events' | 'about'>('events');

  // Query events to pass stats to HeroSection
  const { data } = useQuery<{ events: any[] }>(GET_EVENTS);

  const totalEvents = data?.events?.length || 5;
  const totalLocations = 4;
  const totalParticipants =
    data?.events?.reduce((acc: number, cur: any) => acc + (cur.participants?.length || 0), 0) || 15;

  const handleSelectEvent = (id: string) => {
    setSelectedEventId(id);
  };

  const handleCloseDetail = () => {
    setSelectedEventId(null);
  };

  const handleCreatedSuccess = (id: string) => {
    setSelectedEventId(id);
  };

  const scrollToEvents = () => {
    setActiveTab('events');
    const el = document.getElementById('events-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Bar Navigation */}
      <Navbar
        onOpenCreate={() => setIsCreateOpen(true)}
        onOpenConsole={() => setIsConsoleOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'events' ? (
          <>
            {/* Hero Section */}
            <HeroSection
              onExploreClick={scrollToEvents}
              onOpenCreate={() => setIsCreateOpen(true)}
              totalEvents={totalEvents}
              totalLocations={totalLocations}
              totalParticipants={totalParticipants}
            />

            {/* Event List Section (Ödev 4 Ana Gereksinimi) */}
            <EventList
              onSelectEvent={handleSelectEvent}
              onOpenCreate={() => setIsCreateOpen(true)}
            />
          </>
        ) : (
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
                <div>
                  <div className="text-xs font-semibold text-indigo-600 mb-1">
                    ÖDEV 4 TEKNİK DOKÜMANTASYONU
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    Apollo Client & React Entegrasyon Raporu
                  </h1>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">Hazırlayan</div>
                  <div className="text-sm font-bold text-slate-900">Enes Öztürk</div>
                </div>
              </div>

              <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
                <section>
                  <h3 className="text-base font-bold text-slate-900 mb-2">1. Amaç ve Kapsam</h3>
                  <p>
                    Bu çalışmada, Patika.dev & Kodluyoruz GraphQL eğitimi kapsamında daha önceki ödevlerde geliştirilen backend veri modeli temel alınarak Apollo Client ile modern bir React uygulaması inşa edilmiştir.
                  </p>
                </section>

                <section>
                  <h3 className="text-base font-bold text-slate-900 mb-2">2. Karşılanan Gereksinimler</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>React Uygulaması & Apollo Client Kurulumu:</strong> <code className="text-indigo-600 bg-slate-100 px-1 py-0.5 rounded font-mono text-xs">@apollo/client</code> ve <code className="text-indigo-600 bg-slate-100 px-1 py-0.5 rounded font-mono text-xs">graphql</code> kütüphaneleri entegre edilmiş, <code className="text-indigo-600 bg-slate-100 px-1 py-0.5 rounded font-mono text-xs">ApolloProvider</code> ve <code className="text-indigo-600 bg-slate-100 px-1 py-0.5 rounded font-mono text-xs">InMemoryCache</code> ile tüm state yönetimi merkezi önbelleğe bağlanmıştır.
                    </li>
                    <li>
                      <strong>Anasayfada Etkinliklerin Listelenmesi:</strong> Veri setindeki tüm etkinliklerin adı (<code className="font-mono text-xs">title</code>), açıklaması (<code className="font-mono text-xs">desc</code>) ve zamanı (<code className="font-mono text-xs">date</code>, <code className="font-mono text-xs">from</code>, <code className="font-mono text-xs">to</code>) <code className="text-indigo-600 bg-slate-100 px-1 py-0.5 rounded font-mono text-xs">useQuery(GET_EVENTS)</code> ile anasayfada görsel kartlar olarak listelenmektedir.
                    </li>
                    <li>
                      <strong>Etkinlik Detay Görünümü:</strong> Bir etkinlik seçildiğinde <code className="text-indigo-600 bg-slate-100 px-1 py-0.5 rounded font-mono text-xs">useQuery(GET_EVENT)</code> çalıştırılarak etkinlik sahibi (<code className="font-mono text-xs">user</code>), konumu (<code className="font-mono text-xs">location</code>: lat, lng, name, desc) ve katılımcılar (<code className="font-mono text-xs">participants</code>) ayrıntılı biçimde görüntülenmektedir.
                    </li>
                    <li>
                      <strong>İmza & Estetik Dokunuş:</strong> Enes Öztürk imzası, modern Tailwind CSS tipografisi, sıfır-hap (zero-pill) kuralına uygun arayüz, arama/filtreleme ve canlı GraphQL Konsolu ile zenginleştirilmiştir.
                    </li>
                  </ul>
                </section>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setActiveTab('events')}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                  >
                    Etkinlikler Sayfasına Dön
                  </button>
                  <button
                    onClick={() => setIsConsoleOpen(true)}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    GraphQL Konsolunu Aç
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Event Detail Modal (Ödev 4 Detay Gereksinimi) */}
      <EventDetailModal
        eventId={selectedEventId}
        onClose={handleCloseDetail}
      />

      {/* Add Event Modal */}
      <AddEventModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleCreatedSuccess}
      />

      {/* GraphQL Inspector & Apollo Cache Console */}
      <GraphQLConsoleModal
        isOpen={isConsoleOpen}
        onClose={() => setIsConsoleOpen(false)}
      />

      {/* About & Checklist Modal */}
      <AboutHomeworkModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Footer */}
      <Footer
        onOpenConsole={() => setIsConsoleOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <MainApp />
    </ApolloProvider>
  );
}
