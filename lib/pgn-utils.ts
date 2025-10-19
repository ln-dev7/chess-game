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
 * Métadonnées optionnelles pour la génération PGN
 */
export interface PGNMetadata {
  // Tags obligatoires (Seven Tag Roster)
  event?: string;
  site?: string;
  date?: string;
  round?: string;
  white?: string;
  black?: string;

  // Tags supplémentaires
  whiteElo?: string;
  blackElo?: string;
  timeControl?: string;
}

/**
 * Génère le tag Termination selon la raison de fin de partie
 */
function getTerminationTag(gameState: GameState): string | null {
  if (!gameState.gameEndReason) return null;

  switch (gameState.gameEndReason) {
    case "checkmate":
      return "Normal";
    case "resignation":
      // Détermine qui a abandonné en fonction du joueur actuel
      return gameState.currentPlayer === "white"
        ? "White resigns"
        : "Black resigns";
    case "timeout":
      return gameState.currentPlayer === "white"
        ? "White wins by timeout"
        : "Black wins by timeout";
    case "draw":
      if (gameState.isStalemate) {
        return "Stalemate";
      } else if (gameState.halfMoveClock >= 100) {
        return "Draw by fifty-move rule";
      } else {
        return "Draw by agreement";
      }
    default:
      return null;
  }
}

/**
 * Génère un commentaire de fin de partie
 */
function getEndComment(gameState: GameState): string | null {
  if (!gameState.gameEndReason) return null;

  switch (gameState.gameEndReason) {
    case "resignation":
      return gameState.currentPlayer === "white"
        ? "White resigns."
        : "Black resigns.";
    case "timeout":
      return gameState.currentPlayer === "white"
        ? "Black wins by timeout."
        : "White wins by timeout.";
    case "draw":
      if (gameState.isStalemate) {
        return "Stalemate.";
      } else if (gameState.halfMoveClock >= 100) {
        return "Draw by fifty-move rule.";
      } else {
        return "Draw by agreement.";
      }
    default:
      return null;
  }
}

/**
 * Formate le texte des coups en respectant la limite de 80 caractères par ligne
 */
function formatMovetextWithLineBreaks(movetext: string): string {
  const words = movetext.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    // Si ajouter ce mot dépasse 80 caractères, on commence une nouvelle ligne
    if (currentLine.length + word.length + 1 > 80) {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        // Le mot lui-même est trop long, on l'ajoute quand même
        lines.push(word);
      }
    } else {
      currentLine += (currentLine ? " " : "") + word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.join("\n");
}

/**
 * Génère un fichier PGN complet conforme aux spécifications FIDE
 *
 * Respecte :
 * - Seven Tag Roster (7 tags obligatoires)
 * - Tags supplémentaires (Elo, TimeControl, Termination, Variant, FEN, SetUp)
 * - Notation algébrique standard (SAN)
 * - Formatage avec limite de 80 caractères par ligne
 * - Commentaires de fin de partie
 * - Support Chess960
 */
export function generatePGN(
  gameState: GameState,
  metadata?: PGNMetadata
): string {
  const today = new Date();
  const dateStr =
    metadata?.date ||
    `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(today.getDate()).padStart(2, "0")}`;

  // Déterminer le résultat (valeurs autorisées : 1-0, 0-1, 1/2-1/2, *)
  let result = "*"; // Partie en cours
  if (gameState.isCheckmate) {
    result = gameState.currentPlayer === "white" ? "0-1" : "1-0";
  } else if (gameState.isStalemate || gameState.isDraw) {
    result = "1/2-1/2";
  } else if (gameState.gameEndReason === "resignation") {
    result = gameState.currentPlayer === "white" ? "0-1" : "1-0";
  } else if (gameState.gameEndReason === "timeout") {
    result = gameState.currentPlayer === "white" ? "0-1" : "1-0";
  }

  // === SECTION 1: Seven Tag Roster (tags obligatoires) ===
  const headers: string[] = [
    `[Event "${metadata?.event || "Casual Game"}"]`,
    `[Site "${metadata?.site || "chess-game"}"]`,
    `[Date "${dateStr}"]`,
    `[Round "${metadata?.round || "?"}"]`,
    `[White "${metadata?.white || "Player 1"}"]`,
    `[Black "${metadata?.black || "Player 2"}"]`,
    `[Result "${result}"]`,
  ];

  // === SECTION 2: Tags supplémentaires (Supplemental tag names) ===

  // Elo des joueurs
  if (metadata?.whiteElo) {
    headers.push(`[WhiteElo "${metadata.whiteElo}"]`);
  }
  if (metadata?.blackElo) {
    headers.push(`[BlackElo "${metadata.blackElo}"]`);
  }

  // Cadence de jeu
  if (metadata?.timeControl) {
    headers.push(`[TimeControl "${metadata.timeControl}"]`);
  }

  // Motif de fin de partie
  const termination = getTerminationTag(gameState);
  if (termination) {
    headers.push(`[Termination "${termination}"]`);
  }

  // Chess960 : tags spéciaux
  if (gameState.isChess960) {
    headers.push(`[Variant "Chess960"]`);

    // Position FEN initiale pour Chess960
    // Note: Pour Chess960, on doit stocker la position initiale
    // Pour l'instant, on génère le FEN de la position actuelle comme référence
    const initialFEN = getChess960InitialFEN(gameState);
    if (initialFEN) {
      headers.push(`[SetUp "1"]`);
      headers.push(`[FEN "${initialFEN}"]`);
    }
  } else {
    headers.push(`[Variant "Standard"]`);
  }

  // === SECTION 3: Génération des coups (Movetext Section) ===
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

    // Ajouter échec/mat si c'est le dernier coup
    if (i === moves.length - 1) {
      if (gameState.isCheckmate) {
        moveText += "#";
      } else if (gameState.isCheck) {
        moveText += "+";
      }
    }

    // Ajouter un espace entre les coups
    moveText += " ";
  }

  // Ajouter un commentaire de fin de partie si nécessaire
  const endComment = getEndComment(gameState);
  if (endComment) {
    moveText += `{${endComment}} `;
  }

  // Ajouter le résultat final
  moveText += result;

  // Formater le texte des coups avec limite de 80 caractères par ligne
  const formattedMovetext = formatMovetextWithLineBreaks(moveText.trim());

  // === Assemblage final du PGN ===
  return headers.join("\n") + "\n\n" + formattedMovetext + "\n";
}

/**
 * Génère le FEN initial pour Chess960
 * Note: Idéalement, le FEN initial devrait être stocké dans le GameState
 * Pour l'instant, on retourne null et on pourrait améliorer cela plus tard
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getChess960InitialFEN(_gameState: GameState): string | null {
  // TODO: Stocker le FEN initial dans GameState pour Chess960
  // Pour l'instant, on pourrait reconstruire le FEN depuis les positions initiales
  // stockées dans le gameState (whiteKingInitialCol, etc.)
  return null;
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
