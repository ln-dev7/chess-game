/**
 * Gestion des effets sonores pour le jeu d'échecs
 */

export type SoundType = "move" | "capture" | "check" | "checkmate" | "draw";

/**
 * Classe pour gérer les sons du jeu d'échecs
 */
class ChessSoundManager {
  private audioContext: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.3;

  constructor() {
    if (typeof window !== "undefined") {
      this.loadSettings();
    }
  }

  /**
   * Initialise l'AudioContext (nécessaire pour Safari et certains navigateurs)
   */
  private initAudioContext() {
    if (!this.audioContext && typeof window !== "undefined") {
      const AudioContextClass = window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioContext = new AudioContextClass();
      }
    }
  }

  /**
   * Charge les paramètres depuis le localStorage
   */
  private loadSettings() {
    const muted = localStorage.getItem("chess-sound-muted");
    const volume = localStorage.getItem("chess-sound-volume");

    if (muted !== null) {
      this.isMuted = muted === "true";
    }
    if (volume !== null) {
      this.volume = parseFloat(volume);
    }
  }

  /**
   * Sauvegarde les paramètres dans le localStorage
   */
  private saveSettings() {
    if (typeof window !== "undefined") {
      localStorage.setItem("chess-sound-muted", String(this.isMuted));
      localStorage.setItem("chess-sound-volume", String(this.volume));
    }
  }

  /**
   * Joue un son de déplacement de pièce
   */
  playMove() {
    if (this.isMuted) return;
    this.playTone(200, 0.1, "sine");
  }

  /**
   * Joue un son de capture
   */
  playCapture() {
    if (this.isMuted) return;
    this.playTone(150, 0.15, "square");
  }

  /**
   * Joue un son d'échec
   */
  playCheck() {
    if (this.isMuted) return;
    this.playSequence([
      { frequency: 400, duration: 0.1 },
      { frequency: 500, duration: 0.15 },
    ]);
  }

  /**
   * Joue un son d'échec et mat
   */
  playCheckmate() {
    if (this.isMuted) return;
    this.playSequence([
      { frequency: 300, duration: 0.15 },
      { frequency: 250, duration: 0.15 },
      { frequency: 200, duration: 0.3 },
    ]);
  }

  /**
   * Joue un son de match nul
   */
  playDraw() {
    if (this.isMuted) return;
    this.playTone(300, 0.2, "sine");
  }

  /**
   * Joue un ton simple
   */
  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = "sine"
  ) {
    this.initAudioContext();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  /**
   * Joue une séquence de tons
   */
  private playSequence(
    notes: Array<{ frequency: number; duration: number }>
  ) {
    this.initAudioContext();
    if (!this.audioContext) return;

    let startTime = this.audioContext.currentTime;

    notes.forEach((note) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.frequency.value = note.frequency;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(this.volume, startTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        startTime + note.duration
      );

      oscillator.start(startTime);
      oscillator.stop(startTime + note.duration);

      startTime += note.duration;
    });
  }

  /**
   * Active/désactive le son
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    this.saveSettings();
    return this.isMuted;
  }

  /**
   * Définit le volume (0 à 1)
   */
  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  /**
   * Obtient l'état muet
   */
  getIsMuted() {
    return this.isMuted;
  }

  /**
   * Obtient le volume actuel
   */
  getVolume() {
    return this.volume;
  }
}

// Instance singleton
export const soundManager = new ChessSoundManager();

/**
 * Joue un son selon le type
 */
export function playSound(type: SoundType) {
  switch (type) {
    case "move":
      soundManager.playMove();
      break;
    case "capture":
      soundManager.playCapture();
      break;
    case "check":
      soundManager.playCheck();
      break;
    case "checkmate":
      soundManager.playCheckmate();
      break;
    case "draw":
      soundManager.playDraw();
      break;
  }
}
