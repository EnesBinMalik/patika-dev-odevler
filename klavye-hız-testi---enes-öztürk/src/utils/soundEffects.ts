import { SoundTheme } from '../types';

class SoundManager {
  private ctx: AudioContext | null = null;
  private theme: SoundTheme = 'mechanical';

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setTheme(theme: SoundTheme) {
    this.theme = theme;
  }

  public getTheme(): SoundTheme {
    return this.theme;
  }

  public playKeyClick() {
    if (this.theme === 'off') return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (this.theme === 'mechanical') {
        // High crisp snap followed by thock
        osc.type = 'triangle';
        const pitchVariation = 650 + Math.random() * 120;
        osc.frequency.setValueAtTime(pitchVariation, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.045);
      } else if (this.theme === 'typewriter') {
        // Metallic heavier clack
        osc.type = 'square';
        osc.frequency.setValueAtTime(800 + Math.random() * 150, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.05);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.055);
      } else {
        // Soft bubble pop
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440 + Math.random() * 50, now);
        osc.frequency.exponentialRampToValueAtTime(260, now + 0.03);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.035);
      }
    } catch {
      // Audio playback fails gracefully if blocked
    }
  }

  public playWordComplete(correct: boolean) {
    if (this.theme === 'off') return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (correct) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.06); // A5
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.09);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + (correct ? 0.08 : 0.11));
    } catch {
      // silent
    }
  }

  public playFinishChime() {
    if (this.theme === 'off') return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.09;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.09, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.36);
      });
    } catch {
      // silent
    }
  }
}

export const soundManager = new SoundManager();
