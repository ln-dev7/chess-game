/**
 * Styles de pièces d'échecs disponibles
 */

export interface PieceStyle {
  id: string;
  name: string;
  description: string;
}

export const PIECE_STYLES: PieceStyle[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional chess piece style",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary and minimalist geometric design",
  },
  {
    id: "colorful",
    name: "Colorful",
    description: "Vibrant and colorful piece design",
  },
  // You can add more styles here
  // {
  //   id: "medieval",
  //   name: "Medieval",
  //   description: "Middle Ages inspired style",
  // },
];

/**
 * Récupère le style de pièce sauvegardé dans localStorage
 */
export function getSavedPieceStyle(): PieceStyle {
  if (typeof window === "undefined") {
    return PIECE_STYLES[0]; // SSR
  }

  const savedStyleId = localStorage.getItem("piece-style");
  const style = PIECE_STYLES.find((s) => s.id === savedStyleId);
  return style || PIECE_STYLES[0];
}

/**
 * Sauvegarde le style de pièce dans localStorage
 */
export function savePieceStyle(styleId: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("piece-style", styleId);
  }
}
