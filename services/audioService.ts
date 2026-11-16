// Simple browser Web Audio API synth player for track previews
let currentAudioCtx: AudioContext | null = null;
let currentTimer: any = null;

export function playAudioPreview(trackTitle: string, onEnded?: () => void) {
  stopAudioPreview();

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    currentAudioCtx = ctx;

    // Resume context if suspended (common on modern browsers)
    if (ctx.state === 'suspended') {
      ctx.resume().catch((err) => console.warn('Audio resume error:', err));
    }

    // Pentatonic scale frequencies in Hz (C4, D4, E4, G4, A4, C5, D5, E5)
    const frequencies = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
    
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.15, ctx.currentTime);
    masterGain.connect(ctx.destination);

    let noteIndex = 0;
    const maxNotes = 28; // play ~6 seconds

    currentTimer = setInterval(() => {
      if (!currentAudioCtx || currentAudioCtx.state === 'closed') {
        stopAudioPreview();
        return;
      }

      try {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        const freq = frequencies[Math.floor(Math.random() * frequencies.length)];
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.type = noteIndex % 3 === 0 ? 'sine' : noteIndex % 3 === 1 ? 'triangle' : 'sawtooth';

        noteGain.gain.setValueAtTime(0.12, ctx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } catch (oscErr) {
        console.warn('Note play error:', oscErr);
      }

      noteIndex++;
      if (noteIndex >= maxNotes) {
        stopAudioPreview();
        if (onEnded) onEnded();
      }
    }, 200);

  } catch (err) {
    console.error('Audio Preview error:', err);
  }
}

export function stopAudioPreview() {
  if (currentTimer) {
    clearInterval(currentTimer);
    currentTimer = null;
  }
  if (currentAudioCtx) {
    try {
      if (currentAudioCtx.state !== 'closed') {
        currentAudioCtx.close().catch(() => {});
      }
    } catch (e) {}
    currentAudioCtx = null;
  }
}

