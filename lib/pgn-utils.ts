import { GameState, Move, PieceType } from "@/types/chess";
import { positionToAlgebraic } from "./chess-utils";
import { getPossibleMoves } from "./chess-engine";

/**
 * Symboles de notation algébrique pour les pièces
 */
const PIECE_NOTATION: Record<PieceType, string> = {
  king: "K",
  queen: "Q",
  rook: "R",
  bishop: "B",
  knight: "N",
  pawn: "",
};

/**
 * Convertit un coup en notation algébrique standard FIDE
 */
export function moveToAlgebraic(move: Move, gameState: GameState): string {
  // Roque
  if (move.isCastling) {
    return move.to.col === 6 ? "O-O" : "O-O-O";
  }

  const piece = move.piece;
  const from = positionToAlgebraic(move.from);
  const to = positionToAlgebraic(move.to);
  let notation = "";

  // Lettre de la pièce (sauf pour les pions)
  if (piece.type !== "pawn") {
    notation += PIECE_NOTATION[piece.type];

    // Désambiguïsation si nécessaire
    const disambiguation = getDisambiguation(move, gameState);
    notation += disambiguation;
  } else if (move.capturedPiece) {
    // Pour les pions qui capturent, on ajoute la colonne de départ
    notation += from[0];
  }

  // Symbole de capture
  if (move.capturedPiece || move.isEnPassant) {
    notation += "x";
  }

  // Case de destination
  notation += to;

  // Promotion
  if (move.isPromotion && move.promotionPiece) {
    notation += "=" + PIECE_NOTATION[move.promotionPiece];
  }

  // Prise en passant (optionnel mais informatif)
  if (move.isEnPassant) {
    notation += " e.p.";
  }

  // Échec ou échec et mat
  // On doit recalculer l'état après le coup pour savoir
  // (Cette information devrait être dans le gameState suivant)

  return notation;
}

/**
 * Détermine la désambiguïsation nécessaire (fichier, rangée, ou les deux)
 */
function getDisambiguation(move: Move, gameState: GameState): string {
  // Reconstruire l'état du jeu au moment du coup
  const boardAtMove = getBoardAtMove(gameState);

  if (!boardAtMove) return "";

  const piece = move.piece;
  const toPos = move.to;
  const fromPos = move.from;

  // Trouver toutes les pièces du même type et même couleur
  const samePieces: { row: number; col: number }[] = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const p = boardAtMove[row][col];
      if (
        p &&
        p.type === piece.type &&
        p.color === piece.color &&
        (row !== fromPos.row || col !== fromPos.col)
      ) {
        // Vérifier si cette pièce peut aussi aller à la case de destination
        const tempGameState = {
          ...gameState,
          board: boardAtMove,
          currentPlayer: piece.color,
        };
        const possibleMoves = getPossibleMoves(
          boardAtMove,
          { row, col },
          tempGameState
        );

        if (
          possibleMoves.some((m) => m.row === toPos.row && m.col === toPos.col)
        ) {
          samePieces.push({ row, col });
        }
      }
    }
  }

  // Si aucune autre pièce ne peut aller à cette case, pas besoin de désambiguïsation
  if (samePieces.length === 0) {
    return "";
  }

  // Vérifier si la colonne suffit
  const sameFile = samePieces.filter((p) => p.col === fromPos.col);
  if (sameFile.length === 0) {
    return positionToAlgebraic(fromPos)[0]; // Juste la colonne
  }

  // Vérifier si la rangée suffit
  const sameRank = samePieces.filter((p) => p.row === fromPos.row);
  if (sameRank.length === 0) {
    return positionToAlgebraic(fromPos)[1]; // Juste la rangée
  }

  // Sinon, on doit mettre colonne + rangée
  return positionToAlgebraic(fromPos);
}

/**
 * Reconstruit le plateau à un moment donné de l'historique
 */
function getBoardAtMove(gameState: GameState) {
  // Cette fonction devrait idéalement reconstruire le plateau
  // Pour l'instant, on retourne le plateau actuel
  // Une amélioration serait de stocker l'état du plateau avant chaque coup
  return gameState.board;
}

/**
 * Génère un fichier PGN complet
 */
export function generatePGN(
  gameState: GameState,
  metadata?: {
    event?: string;
    site?: string;
    date?: string;
    round?: string;
    white?: string;
    black?: string;
  }
): string {
  const today = new Date();
  const dateStr =
    metadata?.date ||
    `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(today.getDate()).padStart(2, "0")}`;

  // Déterminer le résultat
  let result = "*"; // Partie en cours
  if (gameState.isCheckmate) {
    result = gameState.currentPlayer === "white" ? "0-1" : "1-0";
  } else if (gameState.isStalemate || gameState.isDraw) {
    result = "1/2-1/2";
  }

  // En-têtes obligatoires
  const headers = [
    `[Event "${metadata?.event || "Partie locale"}"]`,
    `[Site "${metadata?.site || "chess-game"}"]`,
    `[Date "${dateStr}"]`,
    `[Round "${metadata?.round || "?"}"]`,
    `[White "${metadata?.white || "Joueur 1"}"]`,
    `[Black "${metadata?.black || "Joueur 2"}"]`,
    `[Result "${result}"]`,
  ];

  // Générer la liste des coups
  const moves = gameState.moveHistory;
  let moveText = "";

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    const moveNumber = Math.floor(i / 2) + 1;

    // Ajouter le numéro de coup pour les blancs
    if (i % 2 === 0) {
      moveText += `${moveNumber}. `;
    }

    // Ajouter le coup en notation algébrique
    const algebraic = moveToAlgebraic(move, gameState);
    moveText += algebraic;

    // Ajouter échec/mat si nécessaire
    const nextMoveIndex = i + 1;
    if (nextMoveIndex < gameState.moveHistory.length) {
      // Vérifier l'état après le coup
      // Pour simplifier, on regarde le gameState actuel si c'est le dernier coup
      if (i === moves.length - 1) {
        if (gameState.isCheckmate) {
          moveText += "#";
        } else if (gameState.isCheck) {
          moveText += "+";
        }
      }
    } else if (i === moves.length - 1) {
      // Dernier coup
      if (gameState.isCheckmate) {
        moveText += "#";
      } else if (gameState.isCheck) {
        moveText += "+";
      }
    }

    // Ajouter un espace entre les coups
    moveText += " ";

    // Retour à la ligne tous les 8 coups complets (16 demi-coups)
    if ((i + 1) % 16 === 0) {
      moveText += "\n";
    }
  }

  // Ajouter le résultat final
  moveText += result;

  // Assembler le PGN complet
  return headers.join("\n") + "\n\n" + moveText + "\n";
}

/**
 * Télécharge le PGN en tant que fichier
 */
export function downloadPGN(pgn: string, filename: string = "partie.pgn") {
  const blob = new Blob([pgn], { type: "text/plain;charset=utf-8" });
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
 * Génère un nom de fichier basé sur la date
 */
export function generatePGNFilename(): string {
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const time = now.toTimeString().split(" ")[0].replace(/:/g, "-");
  return `chess_${date}_${time}.pgn`;
}
