/**
 * Thèmes de couleurs pour l'échiquier
 * Inspirés de chess.com, lichess et autres plateformes populaires
 */

export interface ChessTheme {
  id: string;
  name: string;
  lightSquare: string;
  darkSquare: string;
  selectedLight: string;
  selectedDark: string;
  lastMoveLight: string;
  lastMoveDark: string;
}

export const CHESS_THEMES: ChessTheme[] = [
  {
    id: "classic",
    name: "Classique",
    lightSquare: "#ebecd0",
    darkSquare: "#739552",
    selectedLight: "#f6f669",
    selectedDark: "#baca44",
    lastMoveLight: "#cdd26a",
    lastMoveDark: "#aaa23a",
  },
  {
    id: "brown",
    name: "Bois",
    lightSquare: "#f0d9b5",
    darkSquare: "#b58863",
    selectedLight: "#f6f669",
    selectedDark: "#baca44",
    lastMoveLight: "#cdd26a",
    lastMoveDark: "#aaa23a",
  },
  {
    id: "blue",
    name: "Océan",
    lightSquare: "#dee3e6",
    darkSquare: "#8ca2ad",
    selectedLight: "#aae7ff",
    selectedDark: "#6fb3d2",
    lastMoveLight: "#9cc9d4",
    lastMoveDark: "#6d97a8",
  },
  {
    id: "green",
    name: "Forêt",
    lightSquare: "#ffffdd",
    darkSquare: "#86a666",
    selectedLight: "#f6f669",
    selectedDark: "#9bb05c",
    lastMoveLight: "#d0e080",
    lastMoveDark: "#7a9350",
  },
  {
    id: "purple",
    name: "Améthyste",
    lightSquare: "#e8e7f2",
    darkSquare: "#9f90b0",
    selectedLight: "#d4c4e8",
    selectedDark: "#8c7b9c",
    lastMoveLight: "#c7b5db",
    lastMoveDark: "#7d6d8a",
  },
  {
    id: "grey",
    name: "Minimaliste",
    lightSquare: "#ffffff",
    darkSquare: "#b0b0b0",
    selectedLight: "#e8e8e8",
    selectedDark: "#999999",
    lastMoveLight: "#d0d0d0",
    lastMoveDark: "#909090",
  },
  {
    id: "dark",
    name: "Nuit",
    lightSquare: "#5a5a5a",
    darkSquare: "#2d2d2d",
    selectedLight: "#757575",
    selectedDark: "#454545",
    lastMoveLight: "#6a6a6a",
    lastMoveDark: "#3a3a3a",
  },
  {
    id: "coral",
    name: "Corail",
    lightSquare: "#ffd5ba",
    darkSquare: "#ea9d8c",
    selectedLight: "#ffebb8",
    selectedDark: "#dd9482",
    lastMoveLight: "#f5c9a8",
    lastMoveDark: "#d88979",
  },
  {
    id: "marine",
    name: "Marine",
    lightSquare: "#cbd4db",
    darkSquare: "#7698b3",
    selectedLight: "#b8d4e8",
    selectedDark: "#6888a0",
    lastMoveLight: "#a8c4d8",
    lastMoveDark: "#5d7a92",
  },
  {
    id: "wood-dark",
    name: "Acajou",
    lightSquare: "#deb887",
    darkSquare: "#8b4513",
    selectedLight: "#f4d7a8",
    selectedDark: "#a0542a",
    lastMoveLight: "#e5c898",
    lastMoveDark: "#904a1a",
  },
  {
    id: "pink",
    name: "Rose",
    lightSquare: "#ffe4e9",
    darkSquare: "#d4a5b0",
    selectedLight: "#ffd5e0",
    selectedDark: "#c4959f",
    lastMoveLight: "#f5d5de",
    lastMoveDark: "#b88a94",
  },
  {
    id: "mint",
    name: "Menthe",
    lightSquare: "#e8f5e9",
    darkSquare: "#8fc48f",
    selectedLight: "#d4f0d6",
    selectedDark: "#7eb47e",
    lastMoveLight: "#c5e8c7",
    lastMoveDark: "#6ea46e",
  },
  {
    id: "burgundy",
    name: "Bordeaux",
    lightSquare: "#f2e4d8",
    darkSquare: "#a64b5a",
    selectedLight: "#ead9c8",
    selectedDark: "#954248",
    lastMoveLight: "#dccfb8",
    lastMoveDark: "#853a40",
  },
  {
    id: "sand",
    name: "Sable",
    lightSquare: "#f5deb3",
    darkSquare: "#d2a679",
    selectedLight: "#ffe4c4",
    selectedDark: "#c99668",
    lastMoveLight: "#e8d4a4",
    lastMoveDark: "#ba8858",
  },
  {
    id: "tournament",
    name: "Tournoi",
    lightSquare: "#f3f3f3",
    darkSquare: "#4a90e2",
    selectedLight: "#e8e8e8",
    selectedDark: "#3a80d2",
    lastMoveLight: "#dadada",
    lastMoveDark: "#2f70c2",
  },
  {
    id: "marble",
    name: "Marbre",
    lightSquare: "#f5f5f0",
    darkSquare: "#7d8796",
    selectedLight: "#ebebd8",
    selectedDark: "#6d7786",
    lastMoveLight: "#dcdcc8",
    lastMoveDark: "#5d6776",
  },
];

/**
 * Récupère le thème sauvegardé dans localStorage
 */
export function getSavedTheme(): ChessTheme {
  if (typeof window === "undefined") {
    return CHESS_THEMES[0]; // SSR
  }

  const savedThemeId = localStorage.getItem("chess-theme");
  const theme = CHESS_THEMES.find((t) => t.id === savedThemeId);
  return theme || CHESS_THEMES[0];
}

/**
 * Sauvegarde le thème dans localStorage
 */
export function saveTheme(themeId: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("chess-theme", themeId);
  }
}
