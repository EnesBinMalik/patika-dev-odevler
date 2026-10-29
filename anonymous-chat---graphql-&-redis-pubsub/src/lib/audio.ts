// Synthesized subtle sound effects using Web Audio API (no external file dependencies)
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (typeof window === 'undefined') return null;
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtx = new AudioCtx();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export function playReceiveSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    
    // Pleasant high pop (800Hz to 1200Hz)
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5
    
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  } catch {
    // Ignore audio errors
  }
}

export function playSendSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.07);
    
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  } catch {
    // Ignore audio errors
  }
}

export function playLikeSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(659.25, now); // E5
    osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.1); // B5
    
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  } catch {
    // Ignore audio errors
  }
}
