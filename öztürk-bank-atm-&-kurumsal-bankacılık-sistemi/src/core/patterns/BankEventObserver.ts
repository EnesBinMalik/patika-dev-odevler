/**
 * Design Pattern: Observer Pattern
 * Bankacılık Olayları Yayınlama & Dinleme Mekanizması
 * Mimar: Enes Öztürk
 */

import { IBankEventListener } from '../oop/interfaces';

export interface BankEvent {
  type: 'TRANSACTION_CREATED' | 'LOGIN_ATTEMPT' | 'USER_BLOCKED' | 'USER_UNBLOCKED' | 'USER_REGISTERED' | 'LIMIT_REACHED';
  payload: unknown;
  timestamp: string;
}

export class BankEventSubject {
  private static instance: BankEventSubject;
  private listeners: Set<IBankEventListener> = new Set();

  private constructor() {}

  public static getInstance(): BankEventSubject {
    if (!BankEventSubject.instance) {
      BankEventSubject.instance = new BankEventSubject();
    }
    return BankEventSubject.instance;
  }

  public subscribe(listener: IBankEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public unsubscribe(listener: IBankEventListener): void {
    this.listeners.delete(listener);
  }

  public notify(event: BankEvent): void {
    this.listeners.forEach(listener => {
      try {
        listener.onBankEvent(event);
      } catch (err) {
        console.error('Observer notification error:', err);
      }
    });
  }
}
