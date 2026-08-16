/**
 * Synthesizer & Audio Engine using HTML5 Web Audio API
 * Generates rich ambient melodies, warm polyphonic pads, lofi keys, and expressive SFX.
 * Zero external audio files required - 100% procedurally synthesized in real time.
 */

export type MusicTheme = 'campus' | 'hospital' | 'library' | 'tension' | 'reflection' | 'victory';

// Musical Note Frequency lookup table (A4 = 440Hz)
const N: Record<string, number> = {
  'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
  'C6': 1046.50, 'C#6': 1108.73, 'D6': 1174.66, 'D#6': 1244.51, 'E6': 1318.51, 'F6': 1396.91, 'F#6': 1479.98, 'G6': 1567.98, 'G#6': 1661.22, 'A6': 1760.00, 'B6': 1975.53
};

interface TrackDefinition {
  bpm: number;
  bars: {
    pad: string[];        // Swelling ambient chord
    melody: (string | null)[]; // Lead key/chime notes (16 steps per bar)
    bass: string[];       // Bass notes for beat quarters
    arpeggio?: string[];  // Cascading extra arpeggiated note layer
    percussion?: boolean; // Enable soft lofi rhythm
  }[];
}

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicVolume: number = 0.65;
  private sfxVolume: number = 0.55;

  private masterGain: GainNode | null = null;
  private musicBusGain: GainNode | null = null;
  private sfxBusGain: GainNode | null = null;
  private delayNodeL: DelayNode | null = null;
  private delayNodeR: DelayNode | null = null;
  private compressorNode: DynamicsCompressorNode | null = null;

  private currentTrack: MusicTheme | null = null;
  private isPlayingMusic: boolean = false;
  private schedulerTimerId: number | null = null;
  private currentStep: number = 0;
  private nextStepTime: number = 0;
  private fadeIntervalId: number | null = null;

  constructor() {
    // Lazy AudioContext initialization on first user interaction
  }

  private initContext(): AudioContext | null {
    try {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioContextClass();
      }

      if (this.ctx && !this.masterGain) {
        // Dynamics Compressor for clean, balanced output without clipping
        this.compressorNode = this.ctx.createDynamicsCompressor();
        this.compressorNode.threshold.setValueAtTime(-18, this.ctx.currentTime);
        this.compressorNode.knee.setValueAtTime(12, this.ctx.currentTime);
        this.compressorNode.ratio.setValueAtTime(3.5, this.ctx.currentTime);
        this.compressorNode.attack.setValueAtTime(0.005, this.ctx.currentTime);
        this.compressorNode.release.setValueAtTime(0.2, this.ctx.currentTime);

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);

        // Music & SFX buses
        this.musicBusGain = this.ctx.createGain();
        this.musicBusGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);

        this.sfxBusGain = this.ctx.createGain();
        this.sfxBusGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);

        // Stereo Ambient Delay / Echo effect for music warmth & depth
        this.delayNodeL = this.ctx.createDelay();
        this.delayNodeR = this.ctx.createDelay();
        this.delayNodeL.delayTime.setValueAtTime(0.24, this.ctx.currentTime);
        this.delayNodeR.delayTime.setValueAtTime(0.36, this.ctx.currentTime);

        const delayFeedbackL = this.ctx.createGain();
        const delayFeedbackR = this.ctx.createGain();
        delayFeedbackL.gain.setValueAtTime(0.26, this.ctx.currentTime);
        delayFeedbackR.gain.setValueAtTime(0.26, this.ctx.currentTime);

        const delayFilter = this.ctx.createBiquadFilter();
        delayFilter.type = 'lowpass';
        delayFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);

        // Connect delay feedback loop
        this.delayNodeL.connect(delayFilter);
        this.delayNodeR.connect(delayFilter);
        delayFilter.connect(delayFeedbackL);
        delayFilter.connect(delayFeedbackR);
        delayFeedbackL.connect(this.delayNodeL);
        delayFeedbackR.connect(this.delayNodeR);

        // Panning delay outputs
        const pannerL = this.createPanner(-0.5);
        const pannerR = this.createPanner(0.5);

        if (pannerL && pannerR) {
          this.delayNodeL.connect(pannerL);
          this.delayNodeR.connect(pannerR);
          pannerL.connect(this.musicBusGain);
          pannerR.connect(this.musicBusGain);
        } else {
          this.delayNodeL.connect(this.musicBusGain);
          this.delayNodeR.connect(this.musicBusGain);
        }

        // Connect buses to compressor to master gain to destination
        this.musicBusGain.connect(this.compressorNode);
        this.sfxBusGain.connect(this.compressorNode);
        this.compressorNode.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
      }

      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      return this.ctx;
    } catch (e) {
      console.warn('SoundEngine: AudioContext init fallback', e);
      return null;
    }
  }

  private createPanner(pan: number): StereoPannerNode | GainNode | null {
    if (!this.ctx) return null;
    if (this.ctx.createStereoPanner) {
      const panner = this.ctx.createStereoPanner();
      panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), this.ctx.currentTime);
      return panner;
    }
    return null;
  }

  public unlockAudio() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        if (this.currentTrack && !this.isPlayingMusic) {
          const trackToResume = this.currentTrack;
          this.currentTrack = null;
          this.playMusic(trackToResume);
        }
      }).catch(() => {});
    }

    try {
      const primer = ctx.createBufferSource();
      primer.buffer = ctx.createBuffer(1, 1, 22050);
      primer.connect(ctx.destination);
      primer.start(0);
    } catch {}
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    if (this.isMuted === muted) return;
    this.isMuted = muted;

    if (muted) {
      this.stopMusic(false);
    } else if (this.currentTrack) {
      const trackToResume = this.currentTrack;
      this.currentTrack = null;
      this.playMusic(trackToResume);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.musicBusGain && this.ctx) {
      this.musicBusGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    if (this.sfxBusGain && this.ctx) {
      this.sfxBusGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
  }

  public playGameStart() {
    this.playLevelUpFanfare();
  }

  // --- SOUND EFFECTS (SFX) ---

  public playDialogueBeep(pitch: number = 440) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxBusGain) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch + (Math.random() * 30 - 15), now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxBusGain);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  public playSelect() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxBusGain) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.07); // G5

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxBusGain);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  public playFootstep() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxBusGain) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(240, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(80 + Math.random() * 15, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxBusGain);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {}
  }

  public playInteract() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxBusGain) return;

    try {
      const now = ctx.currentTime;
      const notes = [N['A4'], N['C#5'], N['E5']];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.035);

        gain.gain.setValueAtTime(0.15, now + idx * 0.035);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.035 + 0.12);

        osc.connect(gain);
        gain.connect(this.sfxBusGain!);

        osc.start(now + idx * 0.035);
        osc.stop(now + idx * 0.035 + 0.12);
      });
    } catch {}
  }

  public playStatUp() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxBusGain) return;

    try {
      const now = ctx.currentTime;
      const notes = [N['C5'], N['E5'], N['G5'], N['C6']];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.045);

        gain.gain.setValueAtTime(0.18, now + idx * 0.045);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.045 + 0.18);

        osc.connect(gain);
        gain.connect(this.sfxBusGain!);

        osc.start(now + idx * 0.045);
        osc.stop(now + idx * 0.045 + 0.18);
      });
    } catch {}
  }

  public playXpGain() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxBusGain) return;

    try {
      const now = ctx.currentTime;
      const notes = [N['D5'], N['F#5'], N['A5']];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.035);

        gain.gain.setValueAtTime(0.16, now + idx * 0.035);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.035 + 0.14);

        osc.connect(gain);
        gain.connect(this.sfxBusGain!);

        osc.start(now + idx * 0.035);
        osc.stop(now + idx * 0.035 + 0.14);
      });
    } catch {}
  }

  public playAchievementUnlock() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxBusGain) return;

    try {
      const now = ctx.currentTime;
      const chords = [
        { freqs: [N['C5'], N['E5'], N['G5']], t: 0 },
        { freqs: [N['D5'], N['F#5'], N['A5']], t: 0.1 },
        { freqs: [N['E5'], N['G#5'], N['B5']], t: 0.2 },
        { freqs: [N['G5'], N['B5'], N['E6']], t: 0.32 }
      ];

      chords.forEach(({ freqs, t }) => {
        freqs.forEach(freq => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + t);

          gain.gain.setValueAtTime(0.14, now + t);
          gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.4);

          osc.connect(gain);
          gain.connect(this.sfxBusGain!);

          osc.start(now + t);
          osc.stop(now + t + 0.4);
        });
      });
    } catch {}
  }

  public playLevelUpFanfare() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxBusGain) return;

    try {
      const now = ctx.currentTime;
      const notes = [
        { f: N['C5'], t: 0, d: 0.1 },
        { f: N['C5'], t: 0.1, d: 0.1 },
        { f: N['C5'], t: 0.2, d: 0.1 },
        { f: N['E5'], t: 0.3, d: 0.2 },
        { f: N['G5'], t: 0.5, d: 0.18 },
        { f: N['E5'], t: 0.7, d: 0.14 },
        { f: N['C6'], t: 0.85, d: 0.55 }
      ];

      notes.forEach(m => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(m.f, now + m.t);

        gain.gain.setValueAtTime(0.22, now + m.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + m.t + m.d);

        osc.connect(gain);
        gain.connect(this.sfxBusGain!);

        osc.start(now + m.t);
        osc.stop(now + m.t + m.d);
      });
    } catch {}
  }

  public playQuizSuccess() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxBusGain) return;

    try {
      const now = ctx.currentTime;
      [N['E5'], N['A5'], N['C6']].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.2, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);

        osc.connect(gain);
        gain.connect(this.sfxBusGain!);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.25);
      });
    } catch {}
  }

  public playQuizError() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxBusGain) return;

    try {
      const now = ctx.currentTime;
      [N['D#4'], N['D4']].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.12, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.22);

        osc.connect(gain);
        gain.connect(this.sfxBusGain!);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.22);
      });
    } catch {}
  }

  // --- SYNTHESIZED INSTRUMENTS FOR MUSIC TRACKS ---

  /**
   * Warm ambient pad chord with soft ADSR envelope & detuned twin oscillators
   */
  private playPadChord(notes: string[], startTime: number, duration: number, pan: number = 0) {
    if (!this.ctx || !this.musicBusGain) return;

    notes.forEach(noteName => {
      const freq = N[noteName];
      if (!freq) return;

      const panner = this.createPanner(pan);
      const outputBus = panner || this.musicBusGain!;

      [-4, 4].forEach(detuneCents => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const filter = this.ctx!.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(750, startTime);
        filter.frequency.exponentialRampToValueAtTime(1100, startTime + duration * 0.5);
        filter.frequency.exponentialRampToValueAtTime(600, startTime + duration);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        osc.detune.setValueAtTime(detuneCents, startTime);

        // Soft pad envelope
        const peakGain = 0.045;
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(peakGain, startTime + Math.min(0.6, duration * 0.3));
        gain.gain.setValueAtTime(peakGain * 0.8, startTime + duration - 0.5);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(outputBus);
        if (panner) panner.connect(this.musicBusGain!);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);
      });
    });
  }

  /**
   * Warm electric piano / kalimba key melody note
   */
  private playKeyNote(noteName: string, startTime: number, duration: number, pan: number = 0, sendToDelay: boolean = true) {
    if (!this.ctx || !this.musicBusGain || !N[noteName]) return;
    const freq = N[noteName];

    const panner = this.createPanner(pan);
    const destination = panner || this.musicBusGain;

    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, startTime);
    filter.frequency.exponentialRampToValueAtTime(800, startTime + duration);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(freq, startTime);

    const peakGain = 0.07;
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    if (panner) panner.connect(this.musicBusGain);

    if (sendToDelay && this.delayNodeL && this.delayNodeR) {
      const delayGain = this.ctx.createGain();
      delayGain.gain.setValueAtTime(0.2, startTime);
      gain.connect(delayGain);
      delayGain.connect(this.delayNodeL);
      delayGain.connect(this.delayNodeR);
    }

    osc.start(startTime);
    subOsc.start(startTime);
    osc.stop(startTime + duration + 0.02);
    subOsc.stop(startTime + duration + 0.02);
  }

  /**
   * Deep warm bass note
   */
  private playBassNote(noteName: string, startTime: number, duration: number) {
    if (!this.ctx || !this.musicBusGain || !N[noteName]) return;
    const freq = N[noteName];

    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, startTime);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(freq / 2, startTime); // Sub octave

    const peakGain = 0.12;
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.03);
    gain.gain.setValueAtTime(peakGain * 0.85, startTime + duration - 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicBusGain);

    osc.start(startTime);
    subOsc.start(startTime);
    osc.stop(startTime + duration + 0.02);
    subOsc.stop(startTime + duration + 0.02);
  }

  /**
   * Soft lofi rhythm kick / brush percussion
   */
  private playLofiPercussion(startTime: number, type: 'kick' | 'brush' | 'woodblock') {
    if (!this.ctx || !this.musicBusGain) return;

    if (type === 'kick') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(100, startTime);
      osc.frequency.exponentialRampToValueAtTime(35, startTime + 0.08);

      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.09);

      osc.connect(gain);
      gain.connect(this.musicBusGain);

      osc.start(startTime);
      osc.stop(startTime + 0.09);
    } else if (type === 'brush') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2500, startTime);
      osc.type = 'square';
      osc.frequency.setValueAtTime(220, startTime);

      gain.gain.setValueAtTime(0.02, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicBusGain);

      osc.start(startTime);
      osc.stop(startTime + 0.04);
    } else if (type === 'woodblock') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(750, startTime);

      gain.gain.setValueAtTime(0.04, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.03);

      osc.connect(gain);
      gain.connect(this.musicBusGain);

      osc.start(startTime);
      osc.stop(startTime + 0.03);
    }
  }

  // --- MUSIC TRACK DEFINITIONS ---

  private getTrackDefinition(theme: MusicTheme): TrackDefinition {
    const tracks: Record<MusicTheme, TrackDefinition> = {
      campus: {
        bpm: 104,
        bars: [
          {
            pad: ['C4', 'E4', 'G4', 'B4'], // Cmaj7
            melody: ['E5', null, 'G5', null, 'B5', null, 'A5', null, 'G5', null, 'E5', null, 'D5', null, 'C5', null],
            bass: ['C3', 'C3', 'G2', 'B2'],
            arpeggio: ['C4', 'E4', 'G4', 'B4', 'C5', 'B4', 'G4', 'E4'],
            percussion: true
          },
          {
            pad: ['B3', 'D4', 'G4', 'B4'], // G/B
            melody: ['D5', null, 'F#5', null, 'A5', null, 'G5', null, 'F#5', null, 'D5', null, 'B4', null, 'D5', null],
            bass: ['B2', 'B2', 'D3', 'G2'],
            arpeggio: ['B3', 'D4', 'G4', 'B4', 'D5', 'B4', 'G4', 'D4'],
            percussion: true
          },
          {
            pad: ['A3', 'C4', 'E4', 'G4'], // Am7
            melody: ['C5', null, 'E5', null, 'G5', null, 'F5', null, 'E5', null, 'C5', null, 'A4', null, 'C5', null],
            bass: ['A2', 'A2', 'E2', 'G2'],
            arpeggio: ['A3', 'C4', 'E4', 'G4', 'C5', 'G4', 'E4', 'C4'],
            percussion: true
          },
          {
            pad: ['F3', 'A3', 'C4', 'E4'], // Fmaj7
            melody: ['A4', null, 'C5', null, 'E5', null, 'D5', null, 'C5', null, 'B4', null, 'A4', null, 'G4', null],
            bass: ['F2', 'F2', 'C3', 'E3'],
            arpeggio: ['F3', 'A3', 'C4', 'E4', 'A4', 'E4', 'C4', 'A3'],
            percussion: true
          }
        ]
      },
      hospital: {
        bpm: 78,
        bars: [
          {
            pad: ['E4', 'G#4', 'B4', 'D#5'], // Emaj9
            melody: ['B5', null, null, 'G#5', null, null, 'F#5', null, 'E5', null, null, 'D#5', null, null, 'E5', null],
            bass: ['E3', 'E3', 'B2', 'G#2'],
            arpeggio: ['E4', 'G#4', 'B4', 'D#5']
          },
          {
            pad: ['D#4', 'F#4', 'B4', 'D#5'], // B/D#
            melody: ['F#5', null, null, 'D#5', null, null, 'C#5', null, 'B4', null, null, 'A#4', null, null, 'B4', null],
            bass: ['D#3', 'D#3', 'B2', 'F#2'],
            arpeggio: ['D#4', 'F#4', 'B4', 'D#5']
          },
          {
            pad: ['C#4', 'E4', 'G#4', 'B4'], // C#m7
            melody: ['G#5', null, null, 'E5', null, null, 'D#5', null, 'C#5', null, null, 'B4', null, null, 'C#5', null],
            bass: ['C#3', 'C#3', 'G#2', 'E2'],
            arpeggio: ['C#4', 'E4', 'G#4', 'B4']
          },
          {
            pad: ['A3', 'C#4', 'E4', 'B4'], // Aadd9
            melody: ['E5', null, null, 'C#5', null, null, 'B4', null, 'A4', null, null, 'G#4', null, null, 'B4', null],
            bass: ['A2', 'A2', 'E3', 'C#3'],
            arpeggio: ['A3', 'C#4', 'E4', 'B4']
          }
        ]
      },
      library: {
        bpm: 84,
        bars: [
          {
            pad: ['F3', 'A3', 'C4', 'E4'], // Fmaj7
            melody: ['C5', null, 'E5', null, 'G5', null, null, 'E5', null, 'C5', null, 'A4', null, null, 'C5', null],
            bass: ['F2', 'F2', 'C3', 'F2'],
            arpeggio: ['F3', 'A3', 'C4', 'E4'],
            percussion: true
          },
          {
            pad: ['A3', 'C4', 'E4', 'G4'], // Am7
            melody: ['E5', null, 'G5', null, 'A5', null, null, 'G5', null, 'E5', null, 'C5', null, null, 'E5', null],
            bass: ['A2', 'A2', 'E3', 'A2'],
            arpeggio: ['A3', 'C4', 'E4', 'G4'],
            percussion: true
          },
          {
            pad: ['D3', 'F3', 'A3', 'C4'], // Dm7
            melody: ['F5', null, 'A5', null, 'C6', null, null, 'A5', null, 'F5', null, 'D5', null, null, 'F5', null],
            bass: ['D3', 'D3', 'A2', 'D3'],
            arpeggio: ['D3', 'F3', 'A3', 'C4'],
            percussion: true
          },
          {
            pad: ['A#3', 'D4', 'F4', 'A4'], // Bbmaj7
            melody: ['D5', null, 'F5', null, 'A5', null, null, 'F5', null, 'D5', null, 'A#4', null, null, 'D5', null],
            bass: ['A#2', 'A#2', 'F2', 'A#2'],
            arpeggio: ['A#3', 'D4', 'F4', 'A4'],
            percussion: true
          }
        ]
      },
      tension: {
        bpm: 112,
        bars: [
          {
            pad: ['C4', 'D#4', 'G4', 'A#4'], // Cm7
            melody: ['G5', null, 'D#5', null, 'C5', null, 'D#5', null, 'G5', null, 'F5', null, 'D#5', null, 'D5', null],
            bass: ['C2', 'C2', 'G2', 'C2'],
            arpeggio: ['C3', 'D#3', 'G3', 'C4'],
            percussion: true
          },
          {
            pad: ['G#3', 'C4', 'D#4', 'G4'], // Abmaj7
            melody: ['F5', null, 'C5', null, 'G#4', null, 'C5', null, 'F5', null, 'D#5', null, 'C5', null, 'A#4', null],
            bass: ['G#2', 'G#2', 'D#2', 'G#2'],
            arpeggio: ['G#2', 'C3', 'D#3', 'G#3'],
            percussion: true
          },
          {
            pad: ['F3', 'G#3', 'C4', 'D#4'], // Fm7
            melody: ['D#5', null, 'C5', null, 'G#4', null, 'C5', null, 'D#5', null, 'D5', null, 'C5', null, 'B4', null],
            bass: ['F2', 'F2', 'C3', 'F2'],
            arpeggio: ['F2', 'G#2', 'C3', 'F3'],
            percussion: true
          },
          {
            pad: ['G3', 'C4', 'D4', 'F4'], // G7sus4
            melody: ['D5', null, 'F5', null, 'G5', null, 'F5', null, 'D5', null, 'C5', null, 'B4', null, 'G4', null],
            bass: ['G2', 'G2', 'D3', 'G2'],
            arpeggio: ['G2', 'B2', 'D3', 'F3'],
            percussion: true
          }
        ]
      },
      reflection: {
        bpm: 72,
        bars: [
          {
            pad: ['G3', 'B3', 'D4', 'A4'], // Gadd9
            melody: ['B5', null, null, null, 'G5', null, null, null, 'D5', null, null, null, 'B4', null, null, null],
            bass: ['G2', 'G2', 'D3', 'B2'],
            arpeggio: ['G3', 'B3', 'D4', 'G4', 'B4', 'G4', 'D4', 'B3']
          },
          {
            pad: ['F#3', 'A3', 'D4', 'F#4'], // D/F#
            melody: ['A5', null, null, null, 'F#5', null, null, null, 'D5', null, null, null, 'A4', null, null, null],
            bass: ['F#2', 'F#2', 'D3', 'A2'],
            arpeggio: ['F#3', 'A3', 'D4', 'F#4', 'A4', 'F#4', 'D4', 'A3']
          },
          {
            pad: ['E3', 'G3', 'B3', 'F#4'], // Em9
            melody: ['G5', null, null, null, 'E5', null, null, null, 'B4', null, null, null, 'G4', null, null, null],
            bass: ['E2', 'E2', 'B2', 'G2'],
            arpeggio: ['E3', 'G3', 'B3', 'E4', 'G4', 'E4', 'B3', 'G3']
          },
          {
            pad: ['C3', 'E3', 'G3', 'D4'], // Cadd9
            melody: ['E5', null, null, null, 'D5', null, null, null, 'C5', null, null, null, 'G4', null, null, null],
            bass: ['C2', 'C2', 'G2', 'E2'],
            arpeggio: ['C3', 'E3', 'G3', 'C4', 'E4', 'C4', 'G3', 'E3']
          }
        ]
      },
      victory: {
        bpm: 120,
        bars: [
          {
            pad: ['D4', 'F#4', 'A4', 'C#5'], // Dmaj7
            melody: ['A5', null, 'F#5', null, 'D5', null, 'F#5', null, 'A5', null, 'B5', null, 'C#6', null, 'D6', null],
            bass: ['D3', 'D3', 'A2', 'D3'],
            arpeggio: ['D4', 'F#4', 'A4', 'D5'],
            percussion: true
          },
          {
            pad: ['C#4', 'E4', 'A4', 'C#5'], // Amaj
            melody: ['E5', null, 'C#5', null, 'A4', null, 'C#5', null, 'E5', null, 'F#5', null, 'G#5', null, 'A5', null],
            bass: ['A2', 'A2', 'E3', 'A2'],
            arpeggio: ['C#4', 'E4', 'A4', 'C#5'],
            percussion: true
          },
          {
            pad: ['B3', 'D4', 'F#4', 'A4'], // Bm7
            melody: ['F#5', null, 'D5', null, 'B4', null, 'D5', null, 'F#5', null, 'A5', null, 'B5', null, 'C#6', null],
            bass: ['B2', 'B2', 'F#2', 'B2'],
            arpeggio: ['B3', 'D4', 'F#4', 'B4'],
            percussion: true
          },
          {
            pad: ['G3', 'B3', 'D4', 'F#4'], // Gmaj7
            melody: ['D6', null, 'C#6', null, 'B5', null, 'A5', null, 'G5', null, 'F#5', null, 'E5', null, 'C#5', null],
            bass: ['G2', 'G2', 'D3', 'G2'],
            arpeggio: ['G3', 'B3', 'D4', 'G4'],
            percussion: true
          }
        ]
      }
    };

    return tracks[theme] || tracks.campus;
  }

  // --- AUDIO TIMELINE LOOK-AHEAD SCHEDULER ---

  private scheduleStep() {
    if (!this.isPlayingMusic || this.isMuted || !this.ctx || !this.currentTrack) return;

    const trackDef = this.getTrackDefinition(this.currentTrack);
    const stepDuration = (60 / trackDef.bpm) / 4; // 16th note step duration in seconds

    // Schedule any steps within the 100ms look-ahead window
    while (this.nextStepTime < this.ctx.currentTime + 0.1) {
      const totalStepsInBar = 16;
      const barIndex = Math.floor(this.currentStep / totalStepsInBar) % trackDef.bars.length;
      const stepInBar = this.currentStep % totalStepsInBar;
      const currentBarDef = trackDef.bars[barIndex];
      const now = this.nextStepTime;

      // 1. Play Pad Chord Swell at the start of each bar (step 0)
      if (stepInBar === 0 && currentBarDef.pad) {
        this.playPadChord(currentBarDef.pad, now, stepDuration * 15.5, 0);
      }

      // 2. Play Bass Note on Quarter Beats (steps 0, 4, 8, 12)
      if (stepInBar % 4 === 0 && currentBarDef.bass) {
        const bassNoteIndex = Math.floor(stepInBar / 4) % currentBarDef.bass.length;
        const bassNote = currentBarDef.bass[bassNoteIndex];
        this.playBassNote(bassNote, now, stepDuration * 3.6);
      }

      // 3. Play Lead Key Melody Note
      const melodyNote = currentBarDef.melody[stepInBar];
      if (melodyNote) {
        const pan = (stepInBar % 2 === 0 ? -0.25 : 0.25);
        this.playKeyNote(melodyNote, now, stepDuration * 2.2, pan, true);
      }

      // 4. Play Extra Arpeggio Layer (8th notes or 16th notes)
      if (currentBarDef.arpeggio && stepInBar % 2 === 0) {
        const arpIndex = Math.floor(stepInBar / 2) % currentBarDef.arpeggio.length;
        const arpNote = currentBarDef.arpeggio[arpIndex];
        if (arpNote) {
          const arpPan = (arpIndex % 2 === 0 ? 0.35 : -0.35);
          this.playKeyNote(arpNote, now, stepDuration * 1.5, arpPan, false);
        }
      }

      // 5. Play Lofi Percussion (Kick on 0, Brush/Woodblock on offbeats)
      if (currentBarDef.percussion) {
        if (stepInBar === 0 || stepInBar === 8) {
          this.playLofiPercussion(now, 'kick');
        } else if (stepInBar === 4 || stepInBar === 12) {
          this.playLofiPercussion(now, 'woodblock');
        } else if (stepInBar % 2 === 1) {
          this.playLofiPercussion(now, 'brush');
        }
      }

      // Advance scheduler step & time
      this.currentStep++;
      this.nextStepTime += stepDuration;
    }

    // Run scheduler check loop every 30ms
    this.schedulerTimerId = window.setTimeout(() => this.scheduleStep(), 30);
  }

  public playMusic(theme: MusicTheme) {
    if (this.currentTrack === theme && this.isPlayingMusic) return;

    this.stopMusic(false);
    this.currentTrack = theme;

    if (this.isMuted) {
      this.isPlayingMusic = false;
      return;
    }

    const ctx = this.initContext();
    if (!ctx) return;

    this.isPlayingMusic = true;
    this.currentStep = 0;
    this.nextStepTime = ctx.currentTime + 0.05;

    if (this.musicBusGain) {
      this.musicBusGain.gain.setValueAtTime(0.001, ctx.currentTime);
      this.musicBusGain.gain.linearRampToValueAtTime(this.musicVolume, ctx.currentTime + 0.4);
    }

    if (ctx.state === 'running') {
      this.scheduleStep();
    } else {
      ctx.resume().then(() => {
        if (this.currentTrack === theme && !this.isMuted) {
          this.nextStepTime = ctx.currentTime + 0.05;
          this.scheduleStep();
        }
      }).catch(err => {
        console.error('SoundEngine: AudioContext resume failed', err);
      });
    }
  }

  public stopMusic(clearTrack: boolean = true) {
    this.isPlayingMusic = false;

    if (this.schedulerTimerId !== null) {
      clearTimeout(this.schedulerTimerId);
      this.schedulerTimerId = null;
    }

    if (this.ctx && this.musicBusGain) {
      this.musicBusGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.musicBusGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);
    }

    if (clearTrack) {
      this.currentTrack = null;
    }
  }
}

export const soundEngine = new SoundEngine();

