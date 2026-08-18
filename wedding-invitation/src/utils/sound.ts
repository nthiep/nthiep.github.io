export interface AudioTrack {
  id: string;
  name: string;
  nameVi: string;
  nameZh: string;
  src: string;
}

const musicUrl = (file: string) => `${import.meta.env.BASE_URL}music/${file}`;

const TRACKS: AudioTrack[] = [
  {
    id: 'vay-cuoi',
    name: 'Vay Cuoi',
    nameVi: 'Váy Cưới',
    nameZh: 'Váy Cưới',
    src: musicUrl('vay-cuoi.mp3'),
  },
  {
    id: 'perfect',
    name: 'Perfect',
    nameVi: 'Perfect',
    nameZh: 'Perfect',
    src: musicUrl('perfect.mp3'),
  },
  {
    id: 'beautiful-in-white',
    name: 'Beautiful in White',
    nameVi: 'Beautiful in White',
    nameZh: 'Beautiful in White',
    src: musicUrl('beautiful-in-white.mp3'),
  },
  {
    id: 'mot-doi',
    name: 'Mot Doi',
    nameVi: 'Một Đời',
    nameZh: 'Một Đời',
    src: musicUrl('mot-doi.mp3'),
  },
];

class AmbientAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private trackIndex = 0;
  private listeners: ((playing: boolean, track: AudioTrack) => void)[] = [];

  private ensureAudio() {
    if (this.audio) return this.audio;

    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = 0.55;
    audio.addEventListener('ended', () => {
      this.nextTrack(true);
    });
    this.audio = audio;
    this.applyTrackSrc();
    return audio;
  }

  private applyTrackSrc() {
    if (!this.audio) return;
    const nextSrc = TRACKS[this.trackIndex].src;
    const current = this.audio.getAttribute('data-track-id');
    const nextId = TRACKS[this.trackIndex].id;
    if (current === nextId && this.audio.src) return;
    this.audio.src = nextSrc;
    this.audio.setAttribute('data-track-id', nextId);
  }

  public init() {
    this.ensureAudio();
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
    if (idx === -1) return;
    if (idx === this.trackIndex) {
      if (!this.isPlaying) this.play();
      return;
    }

    const shouldPlay = this.isPlaying;
    this.trackIndex = idx;
    this.ensureAudio();
    this.applyTrackSrc();
    this.notify();
    if (shouldPlay) this.play();
  }

  public nextTrack(autoPlay = false) {
    this.trackIndex = (this.trackIndex + 1) % TRACKS.length;
    const shouldPlay = autoPlay || this.isPlaying;
    this.ensureAudio();
    this.applyTrackSrc();
    this.notify();
    if (shouldPlay) this.play();
  }

  public play() {
    const audio = this.ensureAudio();
    this.applyTrackSrc();
    this.isPlaying = true;
    this.notify();
    void audio.play().catch(() => {
      this.isPlaying = false;
      this.notify();
    });
  }

  public stop() {
    this.isPlaying = false;
    if (this.audio) {
      this.audio.pause();
    }
    this.notify();
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    }
    this.play();
    return true;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioEngine = new AmbientAudioEngine();
