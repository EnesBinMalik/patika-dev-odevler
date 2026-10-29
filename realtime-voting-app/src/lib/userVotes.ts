/**
 * Helper to persist user's cast votes in localStorage
 * Developer: Enes Öztürk
 */

const STORAGE_KEY = 'realtime_voting_user_votes_v1';

export function getStoredVotes(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getUserVote(questionId: string): string | null {
  const votes = getStoredVotes();
  return votes[questionId] || null;
}

export function saveUserVote(questionId: string, optionId: string): void {
  try {
    const votes = getStoredVotes();
    votes[questionId] = optionId;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
  } catch (err) {
    console.error('Failed to save vote to localStorage', err);
  }
}

export function removeUserVote(questionId: string): void {
  try {
    const votes = getStoredVotes();
    delete votes[questionId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
  } catch (err) {
    console.error('Failed to remove vote from localStorage', err);
  }
}
