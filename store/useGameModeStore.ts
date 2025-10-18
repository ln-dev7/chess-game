import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AILevel } from "@/lib/chess-ai";
import { PieceColor } from "@/types/chess";

export type GameMode = "pvp" | "ai";

interface GameModeState {
  gameMode: GameMode;
  aiLevel: AILevel;
  aiColor: PieceColor;
  setGameMode: (mode: GameMode) => void;
  setAILevel: (level: AILevel) => void;
  setAIColor: (color: PieceColor) => void;
}

export const useGameModeStore = create<GameModeState>()(
  persist(
    (set) => ({
      gameMode: "pvp",
      aiLevel: 1200, // Niveau intermédiaire par défaut
      aiColor: "black",
      setGameMode: (mode) => set({ gameMode: mode }),
      setAILevel: (level) => set({ aiLevel: level }),
      setAIColor: (color) => set({ aiColor: color }),
    }),
    {
      name: "chess-game-mode-storage",
    }
  )
);
