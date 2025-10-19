import { create } from "zustand";

export type GameVariant = "standard" | "chess960";

interface GameVariantState {
  gameVariant: GameVariant;
  chess960Position: number | null; // Position initiale Chess960 (0-959) ou null pour aléatoire
  setGameVariant: (variant: GameVariant) => void;
  setChess960Position: (position: number | null) => void;
  generateRandomChess960Position: () => number;
}

// Store sans persistance - toujours "standard" au refresh
export const useGameVariantStore = create<GameVariantState>()((set, get) => ({
  gameVariant: "standard", // Toujours standard par défaut
  chess960Position: null, // null = aléatoire à chaque nouvelle partie
  setGameVariant: (variant) => set({ gameVariant: variant }),
  setChess960Position: (position) => set({ chess960Position: position }),
  generateRandomChess960Position: () => {
    // Génère un nombre aléatoire entre 0 et 959
    const position = Math.floor(Math.random() * 960);
    return position;
  },
}));
