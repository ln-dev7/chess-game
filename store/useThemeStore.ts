import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ThemeState {
  themeId: string;
  pieceStyleId: string;

  setThemeId: (id: string) => void;
  setPieceStyleId: (id: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeId: "wood",
      pieceStyleId: "colorful",

      setThemeId: (id) => set({ themeId: id }),
      setPieceStyleId: (id) => set({ pieceStyleId: id }),
    }),
    {
      name: "chess-theme",
    }
  )
);
