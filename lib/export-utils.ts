import * as htmlToImage from "html-to-image";
import GIF from "gif.js";
import { GameState } from "@/types/chess";
import { gameStateToFEN } from "./chess-utils";
import { createInitialGameState, executeMove } from "./chess-engine";

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
 * Exporte la partie en GIF animé en rejouant tous les coups
 */
export async function exportGameAsGif(
  gameState: GameState,
  elementId: string = "chess-board-export",
  onProgress?: (progress: number) => void,
  onPositionChange?: (state: GameState | null) => void,
  shouldAbort?: () => boolean,
  loopInfinitely: boolean = true
): Promise<Blob | null> {
  if (gameState.moveHistory.length === 0) {
    console.error("No moves to export");
    return null;
  }

  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found`);
    return null;
  }

  try {
    // ÉTAPE 1: Valider tous les coups et préparer toutes les positions
    if (onProgress) onProgress(2);

    const allMoves = [...gameState.moveHistory]; // Copie pour être sûr
    const totalMoves = allMoves.length;

    // Rejouer tous les coups pour valider qu'ils fonctionnent tous
    const allPositions: GameState[] = [];
    let testState = createInitialGameState();
    allPositions.push(testState); // Position initiale

    for (let i = 0; i < totalMoves; i++) {
      // Vérifier si on doit annuler
      if (shouldAbort && shouldAbort()) {
        if (onPositionChange) onPositionChange(null);
        return null;
      }

      const move = allMoves[i];

      testState = executeMove(
        testState,
        move.from,
        move.to,
        move.promotionPiece
      );

      if (!testState) {
        console.error(`Failed to execute move ${i + 1}:`, move);
        throw new Error(`Cannot execute move ${i + 1}`);
      }

      allPositions.push(testState);
    }

    if (onProgress) onProgress(10);

    // ÉTAPE 2: Créer le GIF et capturer toutes les positions

    const gifOptions = {
      workers: 2,
      quality: 10,
      width: element.offsetWidth,
      height: element.offsetHeight,
      workerScript: "/gif.worker.js",
      // repeat: 0 = boucle infinie, pas de repeat = joue une seule fois
      ...(loopInfinitely ? { repeat: 0 } : {}),
    };

    const gif = new GIF(gifOptions);

    // Capturer toutes les positions validées
    for (let i = 0; i < allPositions.length; i++) {
      // Vérifier si on doit annuler
      if (shouldAbort && shouldAbort()) {
        if (onPositionChange) onPositionChange(null);
        return null;
      }

      try {
        const position = allPositions[i];
        const isInitial = i === 0;

        // Mettre à jour l'affichage avec la position validée
        if (onPositionChange) onPositionChange(position);

        // Attendre que le DOM se mette à jour
        await new Promise((resolve) => setTimeout(resolve, 250));

        // Vérifier à nouveau après l'attente
        if (shouldAbort && shouldAbort()) {
          if (onPositionChange) onPositionChange(null);
          return null;
        }

        // Capturer la position
        const dataUrl = await htmlToImage.toPng(element, {
          cacheBust: true,
          pixelRatio: 1,
        });

        if (!dataUrl) {
          throw new Error(`Failed to capture position ${i + 1}`);
        }

        const canvas = await loadImageToCanvas(dataUrl);
        const frameDelay = isInitial ? 1000 : 800; // 1s pour initial, 0.8s pour les autres
        gif.addFrame(canvas, { delay: frameDelay });

        // Mettre à jour la progression (10% à 90%)
        if (onProgress) {
          const progress = 10 + ((i + 1) / allPositions.length) * 80;
          onProgress(Math.round(progress));
        }
      } catch (error) {
        console.error(`Error capturing position ${i + 1}:`, error);
        // Restaurer l'état avant de lancer l'erreur
        if (onPositionChange) onPositionChange(null);
        throw error;
      }
    }

    if (onProgress) onProgress(95);

    // ÉTAPE 3: Finaliser et encoder le GIF
    return new Promise((resolve, reject) => {
      gif.on("finished", (blob: Blob) => {
        if (onProgress) onProgress(100);
        resolve(blob);
      });

      gif.on("error", (error: Error) => {
        console.error("✗ GIF encoding error:", error);
        reject(error);
      });

      gif.on("progress", (p: number) => {
        const renderProgress = 90 + p * 5; // 90% à 95%
        if (onProgress) onProgress(Math.round(renderProgress));
      });

      gif.render();
    });
  } catch (error) {
    console.error("Error exporting game as GIF:", error);
    return null;
  }
}

/**
 * Charge une image data URL dans un canvas
 */
async function loadImageToCanvas(dataUrl: string): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
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
export function generateExportFilename(
  format: "pgn" | "png" | "gif" | "fen"
): string {
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
