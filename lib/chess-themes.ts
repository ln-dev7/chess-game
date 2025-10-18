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
    id: "charcoal",
    name: "Charbon",
    lightSquare: "#b8b8b8",
    darkSquare: "#5a5a5a",
    selectedLight: "#d0d0d0",
    selectedDark: "#707070",
    lastMoveLight: "#c0c0c0",
    lastMoveDark: "#656565",
  },
  {
    id: "olive",
    name: "Olive",
    lightSquare: "#e3e6cb",
    darkSquare: "#8b9474",
    selectedLight: "#f0f3d8",
    selectedDark: "#9da586",
    lastMoveLight: "#dce0c0",
    lastMoveDark: "#7d8664",
  },
  {
    id: "terracotta",
    name: "Terre Cuite",
    lightSquare: "#f4d7c8",
    darkSquare: "#c17b5c",
    selectedLight: "#fce5d8",
    selectedDark: "#d18b6c",
    lastMoveLight: "#ecd0b8",
    lastMoveDark: "#b16b4c",
  },
  {
    id: "lavender",
    name: "Lavande",
    lightSquare: "#e8e3f0",
    darkSquare: "#b4a7c7",
    selectedLight: "#f0ecf5",
    selectedDark: "#c4b7d7",
    lastMoveLight: "#ddd8e5",
    lastMoveDark: "#a497b7",
  },
  {
    id: "slate",
    name: "Ardoise",
    lightSquare: "#cfd8dc",
    darkSquare: "#607d8b",
    selectedLight: "#e0e7eb",
    selectedDark: "#708d9b",
    lastMoveLight: "#bfc8cc",
    lastMoveDark: "#506d7b",
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
  {
    id: "emerald",
    name: "Émeraude",
    lightSquare: "#d0e9da",
    darkSquare: "#4a9d6f",
    selectedLight: "#e0f3e7",
    selectedDark: "#5aad7f",
    lastMoveLight: "#c0dcc8",
    lastMoveDark: "#3a8d5f",
  },
  {
    id: "amber",
    name: "Ambre",
    lightSquare: "#ffe4b5",
    darkSquare: "#d4a05e",
    selectedLight: "#fff0c8",
    selectedDark: "#e4b06e",
    lastMoveLight: "#f5d8a0",
    lastMoveDark: "#c4904e",
  },
  {
    id: "crimson",
    name: "Cramoisi",
    lightSquare: "#f5d8dc",
    darkSquare: "#b94a5a",
    selectedLight: "#fce8eb",
    selectedDark: "#c95a6a",
    lastMoveLight: "#e8c8cc",
    lastMoveDark: "#a93a4a",
  },
  {
    id: "navy",
    name: "Marine Profonde",
    lightSquare: "#c8d8e4",
    darkSquare: "#4a5f7a",
    selectedLight: "#d8e8f4",
    selectedDark: "#5a6f8a",
    lastMoveLight: "#b8c8d4",
    lastMoveDark: "#3a4f6a",
  },
  {
    id: "peach",
    name: "Pêche",
    lightSquare: "#ffe8d8",
    darkSquare: "#e8b8a0",
    selectedLight: "#fff5e8",
    selectedDark: "#f8c8b0",
    lastMoveLight: "#f5d8c8",
    lastMoveDark: "#d8a890",
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
