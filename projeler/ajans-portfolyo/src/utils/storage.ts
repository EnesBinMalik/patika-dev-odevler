import { PortfolioItem, ContactMessage } from '../types';
import { INITIAL_PORTFOLIO_ITEMS, INITIAL_MESSAGES } from '../data/initialData';

const PORTFOLIO_STORAGE_KEY = 'enes_ozturk_agency_portfolio_v1';
const MESSAGES_STORAGE_KEY = 'enes_ozturk_agency_messages_v1';

export function getStoredPortfolio(): PortfolioItem[] {
  try {
    const data = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(INITIAL_PORTFOLIO_ITEMS));
      return INITIAL_PORTFOLIO_ITEMS;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PORTFOLIO_ITEMS;
  } catch (err) {
    console.error('Failed to read portfolio from localStorage', err);
    return INITIAL_PORTFOLIO_ITEMS;
  }
}

export function saveStoredPortfolio(items: PortfolioItem[]): void {
  try {
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save portfolio to localStorage', err);
  }
}

export function resetStoredPortfolio(): PortfolioItem[] {
  try {
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(INITIAL_PORTFOLIO_ITEMS));
    return INITIAL_PORTFOLIO_ITEMS;
  } catch (err) {
    console.error('Failed to reset portfolio in localStorage', err);
    return INITIAL_PORTFOLIO_ITEMS;
  }
}

export function getStoredMessages(): ContactMessage[] {
  try {
    const data = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(INITIAL_MESSAGES));
      return INITIAL_MESSAGES;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : INITIAL_MESSAGES;
  } catch (err) {
    console.error('Failed to read messages from localStorage', err);
    return INITIAL_MESSAGES;
  }
}

export function saveStoredMessages(messages: ContactMessage[]): void {
  try {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  } catch (err) {
    console.error('Failed to save messages to localStorage', err);
  }
}
