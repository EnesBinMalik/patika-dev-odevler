/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Enes Öztürk - Ödev 3: GraphQL Subscriptions
 * Full-Featured Realtime Subscription Studio & Testing Lab
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Play,
  RotateCcw,
  CheckCircle,
  Sparkles,
  Zap,
  ShieldCheck,
  Send,
  Plus,
} from 'lucide-react';
import { Header } from './components/Header.tsx';
import { SubscriptionCard } from './components/SubscriptionCard.tsx';
import { LiveStreamFeed } from './components/LiveStreamFeed.tsx';
import { MutationModal, ModalType } from './components/MutationModal.tsx';
import { GraphqlPlayground } from './components/GraphqlPlayground.tsx';
import { DatabaseExplorer } from './components/DatabaseExplorer.tsx';
import { VerificationModal } from './components/VerificationModal.tsx';
import { SchemaAndDocs } from './components/SchemaAndDocs.tsx';
import { db } from './graphql/database.ts';
import { pubsub, BroadcastLogItem } from './graphql/pubsub.ts';
import { runGraphQLSubscription, SubscriptionHandle, runGraphQLQuery } from './graphql/executor.ts';
import {
  runAutomatedHomeworkVerification,
  TestStepResult,
} from './graphql/testRunner.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'playground' | 'database' | 'schema'>('subscriptions');

  // Reactive DB State
  const [users, setUsers] = useState(db.getUsers());
  const [events, setEvents] = useState(db.getEvents());
  const [locations, setLocations] = useState(db.getLocations());
  const [participants, setParticipants] = useState(db.getParticipants());

  // PubSub Broadcast History Logs
  const [logs, setLogs] = useState<BroadcastLogItem[]>([...pubsub.history]);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [modalType, setModalType] = useState<ModalType>(null);

  // Verification Test Suite State
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [testSteps, setTestSteps] = useState<TestStepResult[]>([]);

  // 1. userCreated Subscription state
  const [userCreatedActive, setUserCreatedActive] = useState(true);
  const [userCreatedCount, setUserCreatedCount] = useState(0);
  const [userCreatedLast, setUserCreatedLast] = useState<any>(null);
  const [userCreatedTime, setUserCreatedTime] = useState<number | undefined>(undefined);
  const [userCreatedPulse, setUserCreatedPulse] = useState(false);
  const userSubRef = useRef<SubscriptionHandle | null>(null);

  // 2. eventCreated Subscription state
  const [eventCreatedActive, setEventCreatedActive] = useState(true);
  const [eventCreatedCount, setEventCreatedCount] = useState(0);
  const [eventCreatedLast, setEventCreatedLast] = useState<any>(null);
  const [eventCreatedTime, setEventCreatedTime] = useState<number | undefined>(undefined);
  const [eventCreatedPulse, setEventCreatedPulse] = useState(false);
  const eventSubRef = useRef<SubscriptionHandle | null>(null);

  // 3. participantAdded Subscription state
  const [partAddedActive, setPartAddedActive] = useState(true);
  const [partAddedCount, setPartAddedCount] = useState(0);
  const [partAddedLast, setPartAddedLast] = useState<any>(null);
  const [partAddedTime, setPartAddedTime] = useState<number | undefined>(undefined);
  const [partAddedPulse, setPartAddedPulse] = useState(false);
  const [partAddedEventFilter, setPartAddedEventFilter] = useState<string>('');
  const partSubRef = useRef<SubscriptionHandle | null>(null);

  // Sync with DB store updates
  useEffect(() => {
    const unsub = db.subscribe(() => {
      setUsers(db.getUsers());
      setEvents(db.getEvents());
      setLocations(db.getLocations());
      setParticipants(db.getParticipants());
    });
    return unsub;
  }, []);

  // Sync with PubSub broadcast history
  useEffect(() => {
    const unsub = pubsub.onHistory((newLog) => {
      setLogs((prev) => [newLog, ...prev.slice(0, 99)]);
    });
    return unsub;
  }, []);

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  // Wire 1: userCreated Subscription
  useEffect(() => {
    if (!userCreatedActive) {
      if (userSubRef.current) {
        userSubRef.current.unsubscribe();
        userSubRef.current = null;
      }
      return;
    }

    const doc = /* GraphQL */ `
      subscription OnUserCreated {
        userCreated {
          id
          name
          email
        }
      }
    `;

    runGraphQLSubscription(doc, undefined, (result) => {
      if (result.data?.userCreated) {
        setUserCreatedLast(result.data.userCreated);
        setUserCreatedCount((prev) => prev + 1);
        setUserCreatedTime(Date.now());
        setUserCreatedPulse(true);
        setTimeout(() => setUserCreatedPulse(false), 800);
      }
    }).then((handle) => {
      userSubRef.current = handle;
    });

    return () => {
      if (userSubRef.current) {
        userSubRef.current.unsubscribe();
      }
    };
  }, [userCreatedActive]);

  // Wire 2: eventCreated Subscription
  useEffect(() => {
    if (!eventCreatedActive) {
      if (eventSubRef.current) {
        eventSubRef.current.unsubscribe();
        eventSubRef.current = null;
      }
      return;
    }

    const doc = /* GraphQL */ `
      subscription OnEventCreated {
        eventCreated {
          id
          title
          desc
          date
          from
          to
          user {
            name
            email
          }
          location {
            name
          }
        }
      }
    `;

    runGraphQLSubscription(doc, undefined, (result) => {
      if (result.data?.eventCreated) {
        setUserCreatedPulse(false);
        setEventCreatedLast(result.data.eventCreated);
        setEventCreatedCount((prev) => prev + 1);
        setEventCreatedTime(Date.now());
        setEventCreatedPulse(true);
        setTimeout(() => setEventCreatedPulse(false), 800);
      }
    }).then((handle) => {
      eventSubRef.current = handle;
    });

    return () => {
      if (eventSubRef.current) {
        eventSubRef.current.unsubscribe();
      }
    };
  }, [eventCreatedActive]);

  // Wire 3: participantAdded Subscription (with optional event filter)
  useEffect(() => {
    if (!partAddedActive) {
      if (partSubRef.current) {
        partSubRef.current.unsubscribe();
        partSubRef.current = null;
      }
      return;
    }

    const doc = /* GraphQL */ `
      subscription OnParticipantAdded($eventId: ID) {
        participantAdded(event_id: $eventId) {
          id
          user_id
          event_id
          user {
            name
            email
          }
          event {
            id
            title
            date
          }
        }
      }
    `;

    const vars = partAddedEventFilter ? { eventId: partAddedEventFilter } : undefined;

    runGraphQLSubscription(doc, vars, (result) => {
      if (result.data?.participantAdded) {
        setPartAddedLast(result.data.participantAdded);
        setPartAddedCount((prev) => prev + 1);
        setPartAddedTime(Date.now());
        setPartAddedPulse(true);
        setTimeout(() => setPartAddedPulse(false), 800);
      }
    }).then((handle) => {
      partSubRef.current = handle;
    });

    return () => {
      if (partSubRef.current) {
        partSubRef.current.unsubscribe();
      }
    };
  }, [partAddedActive, partAddedEventFilter]);

  // Quick Random User Creation
  const handleQuickUser = async () => {
    const id = Math.floor(Math.random() * 900) + 100;
    const names = ['Kaan Kurt', 'Gizem Eren', 'Kerem Arslan', 'Derya Yurt', 'Can Polat'];
    const selectedName = names[Math.floor(Math.random() * names.length)];
    const uniqueEmail = `${selectedName.toLowerCase().replace(/\s+/g, '.')}.${id}@example.com`;

    const query = /* GraphQL */ `
      mutation QuickUser($name: String!, $email: String!) {
        createUser(data: { name: $name, email: $email }) {
          id
          name
          email
        }
      }
    `;
    const res = await runGraphQLQuery(query, { name: selectedName, email: uniqueEmail });
    if (res.errors && res.errors.length > 0) {
      showToast(`Hata: ${res.errors[0].message}`);
    } else {
      showToast(`Kullanıcı "${selectedName}" oluşturuldu ve userCreated kanalına yayınlandı!`);
    }
  };

  // Quick Random Event Creation
  const handleQuickEvent = async () => {
    const id = Math.floor(Math.random() * 900) + 100;
    const titles = [
      'GraphQL & Apollo Client Atölyesi',
      'WebSocket & Microservices Konferansı',
      'Realtime Node.js Mimarisi Zirvesi',
      'TypeScript ile Async Event Handling',
    ];
    const chosenTitle = `${titles[Math.floor(Math.random() * titles.length)]} #${id}`;
    const user = users[Math.floor(Math.random() * users.length)] || users[0];
    const loc = locations[Math.floor(Math.random() * locations.length)] || locations[0];

    const query = /* GraphQL */ `
      mutation QuickEvent($title: String!, $userId: ID!, $locId: ID!) {
        createEvent(data: {
          title: $title
          desc: "Hızlı test tetikleyicisi ile otomatik oluşturulan etkinlik."
          date: "2026-11-28"
          from: "13:00"
          to: "16:00"
          location_id: $locId
          user_id: $userId
        }) {
          id
          title
        }
      }
    `;
    const res = await runGraphQLQuery(query, {
      title: chosenTitle,
      userId: user.id,
      locId: loc.id,
    });
    if (res.errors && res.errors.length > 0) {
      showToast(`Hata: ${res.errors[0].message}`);
    } else {
      showToast(`Etkinlik "${chosenTitle}" oluşturuldu ve eventCreated kanalına yayınlandı!`);
    }
  };

  // Quick Participant Addition
  const handleQuickParticipant = async () => {
    // Find a user and event combination not already paired
    let targetUser = users[0];
    let targetEvent = events[0];
    let found = false;

    for (const u of users) {
      for (const e of events) {
        const already = participants.some((p) => p.user_id === u.id && p.event_id === e.id);
        if (!already) {
          targetUser = u;
          targetEvent = e;
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!found) {
      // Create a new user first
      const id = Math.floor(Math.random() * 900) + 100;
      const newU = db.createUser({
        name: `Hızlı Katılımcı ${id}`,
        email: `hizli_${id}@example.com`,
      });
      targetUser = newU;
    }

    const query = /* GraphQL */ `
      mutation QuickPart($uid: ID!, $eid: ID!) {
        addParticipant(data: { user_id: $uid, event_id: $eid }) {
          id
          user {
            name
          }
          event {
            title
          }
        }
      }
    `;
    const res = await runGraphQLQuery(query, {
      uid: targetUser.id,
      eid: targetEvent.id,
    });

    if (res.errors && res.errors.length > 0) {
      showToast(`Hata: ${res.errors[0].message}`);
    } else {
      showToast(
        `${targetUser.name} etkinliğe (${targetEvent.title}) eklendi ve participantAdded kanalına yayınlandı!`
      );
    }
  };

  // Run Verification Test Suite
  const handleRunVerification = async () => {
    setIsVerificationModalOpen(true);
    setIsVerifying(true);
    await runAutomatedHomeworkVerification((steps) => {
      setTestSteps(steps);
    });
    setIsVerifying(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-indigo-500 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2"
          >
            ×
          </button>
        </div>
      )}

      {/* Top Bar Contract Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRunVerification={handleRunVerification}
        isVerifying={isVerifying}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subtitle / Homework Header Strip */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono mb-1.5">
              <span>Ödev 3</span>
              <span aria-hidden="true">·</span>
              <span>GraphQL Subscription & PubSub Mimarisi</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400">Enes Öztürk İmzalı</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Gerçek Zamanlı Veri Akış Laboratuvarı
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Kullanıcı (User), Etkinlik (Event) ve Katılımcı (Participant) eklendiğinde tetiklenen
              GraphQL Subscription yapısı ve interaktif doğrulama platformu.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalType('createUser')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>Yeni User</span>
            </button>
            <button
              onClick={() => setModalType('createEvent')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Yeni Event</span>
            </button>
            <button
              onClick={() => setModalType('addParticipant')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-purple-400" />
              <span>Katılımcı Ekle</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Subscriptions (Default & Primary Requirement View) */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-8">
            {/* 3 Core Subscription Cards Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-mono">
                    Ödev 3 Şartı: Aktif Subscription Kanalları
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  PubSub In-Memory Dispatcher · 3 Aktif Kanal
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. subscription userCreated */}
                <SubscriptionCard
                  id="userCreated"
                  title="subscription userCreated"
                  triggerName="USER_CREATED"
                  subscriptionDoc={`subscription {\n  userCreated {\n    id\n    name\n    email\n  }\n}`}
                  isActive={userCreatedActive}
                  onToggleActive={() => setUserCreatedActive(!userCreatedActive)}
                  messageCount={userCreatedCount}
                  lastPayload={userCreatedLast}
                  lastTimestamp={userCreatedTime}
                  onQuickTrigger={handleQuickUser}
                  quickTriggerLabel="+ Hızlı Kullanıcı Oluştur"
                  isPulsing={userCreatedPulse}
                />

                {/* 2. subscription eventCreated */}
                <SubscriptionCard
                  id="eventCreated"
                  title="subscription eventCreated"
                  triggerName="EVENT_CREATED"
                  subscriptionDoc={`subscription {\n  eventCreated {\n    id\n    title\n    date\n    user { name }\n  }\n}`}
                  isActive={eventCreatedActive}
                  onToggleActive={() => setEventCreatedActive(!eventCreatedActive)}
                  messageCount={eventCreatedCount}
                  lastPayload={eventCreatedLast}
                  lastTimestamp={eventCreatedTime}
                  onQuickTrigger={handleQuickEvent}
                  quickTriggerLabel="+ Hızlı Etkinlik Oluştur"
                  isPulsing={eventCreatedPulse}
                />

                {/* 3. subscription participantAdded */}
                <SubscriptionCard
                  id="participantAdded"
                  title="subscription participantAdded"
                  triggerName="PARTICIPANT_ADDED"
                  subscriptionDoc={`subscription($eventId: ID) {\n  participantAdded(event_id: $eventId) {\n    id\n    user { name }\n    event { title }\n  }\n}`}
                  isActive={partAddedActive}
                  onToggleActive={() => setPartAddedActive(!partAddedActive)}
                  messageCount={partAddedCount}
                  lastPayload={partAddedLast}
                  lastTimestamp={partAddedTime}
                  onQuickTrigger={handleQuickParticipant}
                  quickTriggerLabel="+ Hızlı Katılımcı Ekle"
                  isPulsing={partAddedPulse}
                  availableEvents={events}
                  selectedEventFilter={partAddedEventFilter}
                  onFilterChange={(val) => setPartAddedEventFilter(val)}
                />
              </div>
            </div>

            {/* Live WebSocket / PubSub Stream Log Feed */}
            <LiveStreamFeed logs={logs} onClearLogs={() => setLogs([])} />
          </div>
        )}

        {/* TAB 2: GraphQL Playground */}
        {activeTab === 'playground' && <GraphqlPlayground />}

        {/* TAB 3: Database & Relational Model */}
        {activeTab === 'database' && (
          <DatabaseExplorer
            users={users}
            events={events}
            locations={locations}
            participants={participants}
            onOpenModal={(t) => setModalType(t)}
            onShowMessage={showToast}
          />
        )}

        {/* TAB 4: Schema & Docs */}
        {activeTab === 'schema' && <SchemaAndDocs />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-6 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-semibold">Enes Öztürk</span>
            <span aria-hidden="true">·</span>
            <span>Ödev 3: GraphQL Subscriptions & Realtime PubSub</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>userCreated</span>
            <span aria-hidden="true">/</span>
            <span>eventCreated</span>
            <span aria-hidden="true">/</span>
            <span>participantAdded</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MutationModal
        type={modalType}
        onClose={() => setModalType(null)}
        users={users}
        events={events}
        locations={locations}
        onSuccess={showToast}
      />

      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        isRunning={isVerifying}
        steps={testSteps}
        onRerun={handleRunVerification}
      />
    </div>
  );
}
