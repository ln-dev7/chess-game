import * as htmlToImage from "html-to-image";
import { GameState } from "@/types/chess";
import { gameStateToFEN } from "./chess-utils";

/**
 * Exporte l'échiquier en tant qu'image PNG
 */
export async function exportBoardAsImage(
  elementId: string = "chess-board-export"
): Promise<Blob | null> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found`);
    return null;
  }

  try {
    const blob = await htmlToImage.toBlob(element, {
      cacheBust: true,
      pixelRatio: 2, // Haute qualité
    });

    return blob || null;
  } catch (error) {
    console.error("Error exporting board as image:", error);
    return null;
  }
}

/**
 * Télécharge un blob en tant que fichier
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copie du texte dans le presse-papiers
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Error copying to clipboard:", err);
    // Fallback pour les navigateurs plus anciens
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    } catch (e) {
      console.error("Fallback copy failed:", e);
      document.body.removeChild(textArea);
      return false;
    }
  }
}

/**
 * Génère un nom de fichier basé sur la date et le format
 */
export function generateExportFilename(format: "pgn" | "png" | "fen"): string {
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const time = now.toTimeString().split(" ")[0].replace(/:/g, "-");
  return `chess_${date}_${time}.${format}`;
}

/**
 * Exporte la position actuelle en FEN
 */
export function exportFEN(gameState: GameState): string {
  return gameStateToFEN(gameState);
}
