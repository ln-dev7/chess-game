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
    name: "Classique",
    description: "Style traditionnel des pièces d'échecs",
  },
  // Vous pouvez ajouter d'autres styles ici
  // {
  //   id: "modern",
  //   name: "Moderne",
  //   description: "Style contemporain et minimaliste",
  // },
  // {
  //   id: "medieval",
  //   name: "Médiéval",
  //   description: "Style inspiré du Moyen Âge",
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
