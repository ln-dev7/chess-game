import { create } from "zustand";
import { persist } from "zustand/middleware";
import { soundManager } from "@/lib/chess-sounds";

export type AnimationSpeed = "slow" | "normal" | "fast" | "instant";

export interface PreferencesState {
  // Apparence
  boardRotation: boolean;
  showCoordinates: boolean;

  // Animation
  animationSpeed: AnimationSpeed;
  checkmateAnimationEnabled: boolean;

  // Son
  soundEnabled: boolean;
  soundVolume: number;

  // Actions
  setBoardRotation: (value: boolean) => void;
  setShowCoordinates: (value: boolean) => void;
  setAnimationSpeed: (value: AnimationSpeed) => void;
  setCheckmateAnimationEnabled: (value: boolean) => void;
  setSoundEnabled: (value: boolean) => void;
  setSoundVolume: (value: number) => void;
  resetPreferences: () => void;
}

const DEFAULT_PREFERENCES = {
  boardRotation: false,
  showCoordinates: true,
  animationSpeed: "normal" as AnimationSpeed,
  checkmateAnimationEnabled: true,
  soundEnabled: true,
  soundVolume: 0.3,
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...DEFAULT_PREFERENCES,

      setBoardRotation: (value) => set({ boardRotation: value }),

      setShowCoordinates: (value) => set({ showCoordinates: value }),

      setAnimationSpeed: (value) => set({ animationSpeed: value }),

      setCheckmateAnimationEnabled: (value) =>
        set({ checkmateAnimationEnabled: value }),

      setSoundEnabled: (value) => {
        set({ soundEnabled: value });
        if (soundManager.getIsMuted() === value) {
          soundManager.toggleMute();
        }
      },

      setSoundVolume: (value) => {
        set({ soundVolume: value });
        soundManager.setVolume(value);
      },

      resetPreferences: () => set(DEFAULT_PREFERENCES),
    }),
    {
      name: "chess-preferences",
    }
  )
);
