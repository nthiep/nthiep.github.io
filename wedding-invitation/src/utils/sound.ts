// Web Audio API ambient wedding melody generator
// Synthesizes warm acoustic music box / harp / Guzheng arpeggios

export interface AudioTrack {
  id: string;
  name: string;
  nameZh: string;
  notes: number[];
  intervalMs: number;
}

const TRACKS: AudioTrack[] = [
  {
    id: 'canon',
    name: 'Canon in D · Classical Romance',
    nameZh: '卡农 · 经典浪漫婚礼曲',
    notes: [
      // D major harmony
      293.66, 369.99, 440.0, 587.33, 440.0, 369.99,
      277.18, 329.63, 440.0, 554.37, 440.0, 329.63,
      246.94, 293.66, 369.99, 493.88, 369.99, 293.66,
      220.00, 277.18, 369.99, 440.00, 369.99, 277.18,
      196.00, 246.94, 293.66, 392.00, 293.66, 246.94,
      220.00, 293.66, 369.99, 440.00, 369.99, 293.66,
      196.00, 246.94, 293.66, 392.00, 293.66, 246.94,
      220.00, 277.18, 329.63, 440.00, 329.63, 277.18,
    ],
    intervalMs: 380,
  },
  {
    id: 'oriental_joy',
    name: 'Auspicious Blossom · Chinese Pentatonic',
    nameZh: '喜结良缘 · 国风雅韵 (高山流水)',
    notes: [
      // Pentatonic scale Gong-Shang-Jiao-Zhi-Yu (C, D, E, G, A)
      261.63, 293.66, 329.63, 392.00, 440.00, 523.25,
      659.25, 587.33, 523.25, 440.00, 392.00, 329.63,
      293.66, 392.00, 440.00, 523.25, 659.25, 783.99,
      659.25, 523.25, 440.00, 392.00, 293.66, 261.63,
    ],
    intervalMs: 340,
  },
  {
    id: 'starlight_waltz',
    name: 'Starlight Romance · Dream Waltz',
    nameZh: '星空华尔兹 · 梦幻誓约',
    notes: [
      329.63, 392.00, 493.88, 587.33, 493.88, 392.00,
      349.23, 440.00, 523.25, 659.25, 523.25, 440.00,
      293.66, 349.23, 440.00, 587.33, 440.00, 349.23,
      261.63, 329.63, 392.00, 523.25, 392.00, 329.63,
    ],
    intervalMs: 440,
  },
];

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: number | null = null;
  private masterGain: GainNode | null = null;
  private trackIndex = 0;
  private currentNoteIndex = 0;
  private listeners: ((playing: boolean, track: AudioTrack) => void)[] = [];

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  public subscribe(cb: (playing: boolean, track: AudioTrack) => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    const currentTrack = TRACKS[this.trackIndex];
    this.listeners.forEach((l) => l(this.isPlaying, currentTrack));
  }

  public getCurrentTrack(): AudioTrack {
    return TRACKS[this.trackIndex];
  }

  public getTracks(): AudioTrack[] {
    return TRACKS;
  }

  public setTrack(id: string) {
    const idx = TRACKS.findIndex((t) => t.id === id);
    if (idx !== -1) {
      this.trackIndex = idx;
      this.currentNoteIndex = 0;
      this.notify();
    }
  }

  public nextTrack() {
    this.trackIndex = (this.trackIndex + 1) % TRACKS.length;
    this.currentNoteIndex = 0;
    this.notify();
  }

  public play() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isPlaying = true;
    this.notify();
    this.scheduleNextNote();
  }

  private playTone(freq: number) {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;

    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.07, now + 0.06);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 1.7);
  }

  private scheduleNextNote = () => {
    if (!this.isPlaying) return;
    const track = TRACKS[this.trackIndex];
    const freq = track.notes[this.currentNoteIndex];
    this.playTone(freq);

    this.currentNoteIndex = (this.currentNoteIndex + 1) % track.notes.length;
    this.timer = window.setTimeout(this.scheduleNextNote, track.intervalMs);
  };

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.notify();
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioEngine = new AmbientAudioEngine();

