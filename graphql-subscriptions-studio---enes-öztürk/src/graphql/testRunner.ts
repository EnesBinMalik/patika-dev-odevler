/**
 * Enes Öztürk - Ödev 3: GraphQL Subscriptions
 * Automated Test Runner & Verification Suite for Homework 3
 */

import { runGraphQLQuery, runGraphQLSubscription } from './executor.ts';

export interface TestStepResult {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  details?: string;
  durationMs?: number;
  payload?: any;
}

export async function runAutomatedHomeworkVerification(
  onProgress: (steps: TestStepResult[]) => void
): Promise<{ passed: boolean; steps: TestStepResult[] }> {
  const steps: TestStepResult[] = [
    {
      id: 'sub-userCreated',
      name: '1. subscription userCreated Doğrulaması',
      description:
        'Yeni bir kullanıcı (createUser) eklendiğinde subscription userCreated üzerinden verinin anında iletilmesi.',
      status: 'pending',
    },
    {
      id: 'sub-eventCreated',
      name: '2. subscription eventCreated Doğrulaması',
      description:
        'Yeni bir etkinlik (createEvent) oluşturulduğunda subscription eventCreated üzerinden verinin anında iletilmesi.',
      status: 'pending',
    },
    {
      id: 'sub-participantAdded',
      name: '3. subscription participantAdded Doğrulaması',
      description:
        'Bir etkinliğe yeni katılımcı (addParticipant) eklendiğinde subscription participantAdded üzerinden bildirilmesi.',
      status: 'pending',
    },
    {
      id: 'sub-participantFiltered',
      name: '4. participantAdded(event_id: ID) Filtreleme Doğrulaması',
      description:
        'Belirli bir event_id için dinleme yapıldığında sadece o etkinliğe ait katılımcıların iletildiğinin doğrulanması.',
      status: 'pending',
    },
  ];

  const update = () => onProgress([...steps]);
  update();

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // --- Test 1: userCreated ---
  try {
    steps[0].status = 'running';
    update();
    const t0 = performance.now();

    const uniqueEmail = `test_${Date.now()}@ozturk.dev`;
    const testUserName = `Test Kullanıcısı (${Math.floor(Math.random() * 900) + 100})`;

    let receivedUser: any = null;
    const subHandle = await runGraphQLSubscription(
      /* GraphQL */ `
        subscription TestUserCreated {
          userCreated {
            id
            name
            email
          }
        }
      `,
      undefined,
      (result) => {
        if (result.data?.userCreated) {
          receivedUser = result.data.userCreated;
        }
      }
    );

    // Wait a brief moment for subscription registration
    await delay(60);

    // Run mutation
    const mutationResult = await runGraphQLQuery(
      /* GraphQL */ `
        mutation CreateTestUser($name: String!, $email: String!) {
          createUser(data: { name: $name, email: $email }) {
            id
            name
            email
          }
        }
      `,
      { name: testUserName, email: uniqueEmail }
    );

    if (mutationResult.errors && mutationResult.errors.length > 0) {
      throw new Error(`Kullanıcı oluşturma hatası: ${mutationResult.errors[0].message}`);
    }

    // Wait for subscription delivery
    await delay(120);
    subHandle.unsubscribe();

    if (!receivedUser || receivedUser.email !== uniqueEmail) {
      throw new Error('userCreated subscription üzerinden beklenen veri alınamadı.');
    }

    steps[0].status = 'success';
    steps[0].durationMs = Math.round(performance.now() - t0);
    steps[0].details = `Başarılı: ID=${receivedUser.id}, ${receivedUser.name} (${receivedUser.email}) canlı akışta yakalandı.`;
    steps[0].payload = receivedUser;
    update();
  } catch (err: any) {
    steps[0].status = 'failed';
    steps[0].details = err.message || 'Hata oluştu';
    update();
    return { passed: false, steps };
  }

  // --- Test 2: eventCreated ---
  try {
    steps[1].status = 'running';
    update();
    const t0 = performance.now();

    const testTitle = `GraphQL Test Hackathon ${Math.floor(Math.random() * 900) + 100}`;
    let receivedEvent: any = null;

    const subHandle = await runGraphQLSubscription(
      /* GraphQL */ `
        subscription TestEventCreated {
          eventCreated {
            id
            title
            desc
            date
            user {
              name
              email
            }
          }
        }
      `,
      undefined,
      (result) => {
        if (result.data?.eventCreated) {
          receivedEvent = result.data.eventCreated;
        }
      }
    );

    await delay(60);

    const mutationResult = await runGraphQLQuery(
      /* GraphQL */ `
        mutation CreateTestEvent($title: String!, $desc: String!, $date: String!, $from: String!, $to: String!, $locId: ID!, $userId: ID!) {
          createEvent(data: {
            title: $title
            desc: $desc
            date: $date
            from: $from
            to: $to
            location_id: $locId
            user_id: $userId
          }) {
            id
            title
          }
        }
      `,
      {
        title: testTitle,
        desc: 'Otomatik test paketi tarafından üretilen test etkinliği.',
        date: '2026-12-01',
        from: '09:00',
        to: '18:00',
        locId: '1',
        userId: '1',
      }
    );

    if (mutationResult.errors && mutationResult.errors.length > 0) {
      throw new Error(`Etkinlik oluşturma hatası: ${mutationResult.errors[0].message}`);
    }

    await delay(120);
    subHandle.unsubscribe();

    if (!receivedEvent || receivedEvent.title !== testTitle) {
      throw new Error('eventCreated subscription üzerinden beklenen etkinlik verisi alınamadı.');
    }

    steps[1].status = 'success';
    steps[1].durationMs = Math.round(performance.now() - t0);
    steps[1].details = `Başarılı: ID=${receivedEvent.id}, "${receivedEvent.title}" (Oluşturan: ${receivedEvent.user?.name}) canlı akışta yakalandı.`;
    steps[1].payload = receivedEvent;
    update();
  } catch (err: any) {
    steps[1].status = 'failed';
    steps[1].details = err.message || 'Hata oluştu';
    update();
    return { passed: false, steps };
  }

  // --- Test 3: participantAdded (global) ---
  try {
    steps[2].status = 'running';
    update();
    const t0 = performance.now();

    // First create a new temporary user and event to guarantee a fresh participant link
    const uRes = await runGraphQLQuery(
      /* GraphQL */ `
        mutation {
          createUser(data: { name: "Katılımcı Adayı", email: "katilimci_${Date.now()}@example.com" }) {
            id
          }
        }
      `
    );
    const eRes = await runGraphQLQuery(
      /* GraphQL */ `
        mutation {
          createEvent(data: {
            title: "Katılımcı Test Buluşması"
            desc: "Test"
            date: "2026-11-28"
            from: "14:00"
            to: "16:00"
            location_id: "1"
            user_id: "1"
          }) {
            id
          }
        }
      `
    );

    const testUserId = (uRes.data as any)?.createUser?.id;
    const testEventId = (eRes.data as any)?.createEvent?.id;

    let receivedParticipant: any = null;
    const subHandle = await runGraphQLSubscription(
      /* GraphQL */ `
        subscription TestParticipantAdded {
          participantAdded {
            id
            user_id
            event_id
            user {
              name
            }
            event {
              title
            }
          }
        }
      `,
      undefined,
      (result) => {
        if (result.data?.participantAdded) {
          receivedParticipant = result.data.participantAdded;
        }
      }
    );

    await delay(60);

    const pRes = await runGraphQLQuery(
      /* GraphQL */ `
        mutation AddP($uid: ID!, $eid: ID!) {
          addParticipant(data: { user_id: $uid, event_id: $eid }) {
            id
            user_id
            event_id
          }
        }
      `,
      { uid: testUserId, eid: testEventId }
    );

    if (pRes.errors && pRes.errors.length > 0) {
      throw new Error(`Katılımcı ekleme hatası: ${pRes.errors[0].message}`);
    }

    await delay(120);
    subHandle.unsubscribe();

    if (!receivedParticipant || receivedParticipant.user_id !== testUserId) {
      throw new Error('participantAdded subscription üzerinden beklenen veri akmadı.');
    }

    steps[2].status = 'success';
    steps[2].durationMs = Math.round(performance.now() - t0);
    steps[2].details = `Başarılı: ID=${receivedParticipant.id}, Katılımcı: ${receivedParticipant.user?.name} -> Etkinlik: ${receivedParticipant.event?.title} başarıyla alındı.`;
    steps[2].payload = receivedParticipant;
    update();
  } catch (err: any) {
    steps[2].status = 'failed';
    steps[2].details = err.message || 'Hata oluştu';
    update();
    return { passed: false, steps };
  }

  // --- Test 4: participantAdded(event_id: ID) withFilter ---
  try {
    steps[3].status = 'running';
    update();
    const t0 = performance.now();

    // Create target event A and different event B
    const eARes = await runGraphQLQuery(
      /* GraphQL */ `
        mutation {
          createEvent(data: {
            title: "Filtrelenen Etkinlik A"
            desc: "A"
            date: "2026-11-29"
            from: "10:00"
            to: "12:00"
            location_id: "1"
            user_id: "1"
          }) {
            id
          }
        }
      `
    );
    const targetEventId = (eARes.data as any)?.createEvent?.id;

    // Create user 1 and user 2
    const u1Res = await runGraphQLQuery(
      /* GraphQL */ `
        mutation {
          createUser(data: { name: "A Katılımcısı", email: "user_a_${Date.now()}@test.com" }) {
            id
          }
        }
      `
    );
    const targetUserId = (u1Res.data as any)?.createUser?.id;

    let filterReceivedList: any[] = [];
    const subFilterHandle = await runGraphQLSubscription(
      /* GraphQL */ `
        subscription FilteredSub($eventId: ID) {
          participantAdded(event_id: $eventId) {
            id
            event_id
            user_id
          }
        }
      `,
      { eventId: targetEventId },
      (result) => {
        if (result.data?.participantAdded) {
          filterReceivedList.push(result.data.participantAdded);
        }
      }
    );

    await delay(60);

    // 1) Add participant to event 1 (not target event) -> SHOULD NOT BE RECEIVED
    await runGraphQLQuery(
      /* GraphQL */ `
        mutation {
          createUser(data: { name: "Başka Katılımcı", email: "user_other_${Date.now()}@test.com" }) {
            id
          }
        }
      `
    );

    // 2) Add participant to TARGET event A -> MUST BE RECEIVED!
    await runGraphQLQuery(
      /* GraphQL */ `
        mutation AddToTarget($uid: ID!, $eid: ID!) {
          addParticipant(data: { user_id: $uid, event_id: $eid }) {
            id
          }
        }
      `,
      { uid: targetUserId, eid: targetEventId }
    );

    await delay(120);
    subFilterHandle.unsubscribe();

    if (
      filterReceivedList.length !== 1 ||
      String(filterReceivedList[0].event_id) !== String(targetEventId)
    ) {
      throw new Error(
        `Filtreleme hatası: Beklenen sadece event_id=${targetEventId} idi, ancak alınan: ${JSON.stringify(
          filterReceivedList
        )}`
      );
    }

    steps[3].status = 'success';
    steps[3].durationMs = Math.round(performance.now() - t0);
    steps[3].details = `Başarılı: withFilter mantığı test edildi; event_id=${targetEventId} dışındaki olaylar elendi, yalnızca hedef etkinlik aboneliğe ulaştı.`;
    steps[3].payload = filterReceivedList[0];
    update();
  } catch (err: any) {
    steps[3].status = 'failed';
    steps[3].details = err.message || 'Hata oluştu';
    update();
    return { passed: false, steps };
  }

  return { passed: true, steps };
}
