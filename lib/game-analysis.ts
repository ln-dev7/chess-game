/**
 * Analyse post-partie. Pour chaque position de la partie on demande à
 * Stockfish (pleine puissance) un score (centipawn ou mate). De la
 * différence entre deux positions successives on déduit :
 *   - le centipawn loss (CPL) plafonné, pour ne pas exploser dans les
 *     positions très gagnantes / très perdantes ;
 *   - la perte de win% (Lichess) pour la précision /100 ;
 *   - une classification "best / excellent / good / inaccuracy / mistake /
 *     blunder" pour chaque coup ;
 *   - le meilleur coup recommandé par Stockfish quand le joueur s'écarte.
 *
 * L'Elo estimé est mappé depuis la précision moyenne plutôt que depuis
 * l'ACPL brute : un joueur qui gagne très largement et "rend" quelques
 * centaines de cp sans jamais quitter une position gagnante doit garder
 * un Elo cohérent avec sa précision.
 */

import { GameState, PieceColor, GameVariant, Move } from "@/types/chess";
import { createInitialGameState, executeMove } from "./chess-engine";
import { gameStateToStockfishFEN, parseUCIMove } from "./fen-utils";
import {
  evaluatePosition,
  prepareAnalysisSession,
  PositionEvaluation,
} from "./stockfish-engine";
import { moveToAlgebraic } from "./pgn-utils";

/** Temps de réflexion par position (en ms) pour l'analyse. */
const ANALYSIS_MOVETIME_MS = 800;
/** Profondeur plafond : Stockfish s'arrête au premier des deux atteints. */
const ANALYSIS_DEPTH = 18;
/** Plafond du centipawn loss par coup, pour ne pas qu'une position très
 *  gagnante (+800 cp → +300 cp) fasse exploser l'ACPL artificiellement. */
const CPL_CAP = 300;
/** Mate score plafonné en cp pour la conversion en win%. */
const MATE_CP_VALUE = 1000;

export type MoveClassification =
  | "best"
  | "excellent"
  | "good"
  | "inaccuracy"
  | "mistake"
  | "blunder";

export interface MoveAnalysis {
  ply: number;
  color: PieceColor;
  san: string;
  uci: string;
  classification: MoveClassification;
  cpLoss: number;
  winPctLoss: number;
  evalBeforeCp: number | null;
  evalAfterCp: number | null;
  bestMoveUci: string | null;
  bestMoveSan: string | null;
}

export interface PlayerAnalysis {
  color: PieceColor;
  accuracy: number;
  estimatedElo: number;
  averageCentipawnLoss: number;
  movesAnalyzed: number;
  /** Comptes par catégorie, indexés par le même nom que MoveClassification. */
  best: number;
  excellent: number;
  good: number;
  inaccuracy: number;
  mistake: number;
  blunder: number;
}

export interface GameAnalysisResult {
  white: PlayerAnalysis;
  black: PlayerAnalysis;
  moves: MoveAnalysis[];
}

export interface AnalyzeGameOptions {
  gameVariant: GameVariant;
  chess960Position?: number;
  finalState: GameState;
  movetimeMs?: number;
  onProgress?: (current: number, total: number) => void;
}

function evalToWhiteCp(ev: PositionEvaluation): number {
  if (ev.mate !== null) {
    return ev.mate > 0 ? MATE_CP_VALUE : -MATE_CP_VALUE;
  }
  return ev.cp ?? 0;
}

function cpToWinPercent(cp: number): number {
  return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);
}

function moveAccuracy(winPctLoss: number): number {
  const accuracy = 103.1668 * Math.exp(-0.04354 * winPctLoss) - 3.1669;
  return Math.max(0, Math.min(100, accuracy));
}

/** Mapping précision moyenne → Elo estimé. Calibré pour qu'une partie
 *  jouée proprement (~80% précision) donne ~1900–2000 Elo, et qu'une
 *  partie quasi-parfaite atteigne ~2700. */
function estimateEloFromAccuracy(accuracy: number, movesAnalyzed: number): number {
  if (movesAnalyzed < 5) return 1000;
  if (accuracy >= 95) return 2700;
  if (accuracy >= 92) return 2500;
  if (accuracy >= 89) return 2300;
  if (accuracy >= 85) return 2100;
  if (accuracy >= 81) return 1900;
  if (accuracy >= 77) return 1700;
  if (accuracy >= 72) return 1500;
  if (accuracy >= 67) return 1300;
  if (accuracy >= 62) return 1100;
  if (accuracy >= 57) return 900;
  if (accuracy >= 52) return 700;
  return 500;
}

function classifyMove(winPctLoss: number): MoveClassification {
  if (winPctLoss >= 20) return "blunder";
  if (winPctLoss >= 10) return "mistake";
  if (winPctLoss >= 5) return "inaccuracy";
  if (winPctLoss >= 2) return "good";
  if (winPctLoss >= 0.5) return "excellent";
  return "best";
}

/** Convertit le bestmove UCI de Stockfish en SAN, en appliquant le coup sur
 *  `beforeState` pour récupérer un Move complet (avec piece, capturedPiece,
 *  isCastling, etc.) que `moveToAlgebraic` saura formater. Gère le roque
 *  Chess960 en notation Shredder ("roi prend tour"). */
function uciBestMoveToSan(
  uci: string,
  beforeState: GameState
): { uci: string; san: string } | null {
  const parsed = parseUCIMove(uci);
  if (!parsed) return null;

  let { to } = parsed;
  const { from, promotionPiece } = parsed;
  const fromPiece = beforeState.board[from.row][from.col];
  const toPiece = beforeState.board[to.row][to.col];

  // Roque Chess960 : Stockfish émet "roi prend sa tour"
  if (
    beforeState.isChess960 &&
    fromPiece &&
    fromPiece.type === "king" &&
    toPiece &&
    toPiece.type === "rook" &&
    toPiece.color === fromPiece.color
  ) {
    const color = fromPiece.color;
    const kingsideRookCol =
      color === "white"
        ? beforeState.whiteKingRookInitialCol
        : beforeState.blackKingRookInitialCol;
    const isKingside = to.col === kingsideRookCol;
    to = { row: to.row, col: isKingside ? 6 : 2 };
  }

  try {
    const newState = executeMove(beforeState, from, to, promotionPiece);
    const move: Move | undefined =
      newState.moveHistory[newState.moveHistory.length - 1];
    if (!move) return null;
    const san = moveToAlgebraic(move, beforeState);
    return { uci, san };
  } catch {
    return null;
  }
}

function moveToUci(move: Move): string {
  const files = "abcdefgh";
  const from = `${files[move.from.col]}${8 - move.from.row}`;
  const to = `${files[move.to.col]}${8 - move.to.row}`;
  const promo = move.isPromotion && move.promotionPiece
    ? (move.promotionPiece === "knight"
        ? "n"
        : move.promotionPiece[0])
    : "";
  return `${from}${to}${promo}`;
}

export async function analyzeGame(
  options: AnalyzeGameOptions
): Promise<GameAnalysisResult> {
  const { gameVariant, chess960Position, finalState, onProgress } = options;
  const movetimeMs = options.movetimeMs ?? ANALYSIS_MOVETIME_MS;

  // Reconstruit toutes les positions successives.
  let state = createInitialGameState(gameVariant, chess960Position);
  const positions: GameState[] = [state];
  for (const move of finalState.moveHistory) {
    state = executeMove(state, move.from, move.to, move.promotionPiece);
    positions.push(state);
  }

  const total = positions.length;
  onProgress?.(0, total);

  // Une seule configuration + ucinewgame pour toute la session :
  // Stockfish réutilisera sa table de hash entre positions successives.
  await prepareAnalysisSession({ chess960: positions[0].isChess960 });

  const evals: PositionEvaluation[] = [];
  for (let i = 0; i < total; i++) {
    const fen = gameStateToStockfishFEN(positions[i]);
    const ev = await evaluatePosition({
      fen,
      movetimeMs,
      depth: ANALYSIS_DEPTH,
      chess960: positions[i].isChess960,
      skipSetup: true,
    });
    evals.push(ev);
    onProgress?.(i + 1, total);
  }

  const acc = {
    white: {
      sumAcc: 0,
      sumCpl: 0,
      moves: 0,
      best: 0,
      excellent: 0,
      good: 0,
      inaccuracy: 0,
      mistake: 0,
      blunder: 0,
    },
    black: {
      sumAcc: 0,
      sumCpl: 0,
      moves: 0,
      best: 0,
      excellent: 0,
      good: 0,
      inaccuracy: 0,
      mistake: 0,
      blunder: 0,
    },
  };

  const moveDetails: MoveAnalysis[] = [];

  for (let i = 0; i < positions.length - 1; i++) {
    const cpBeforeWhite = evalToWhiteCp(evals[i]);
    const cpAfterWhite = evalToWhiteCp(evals[i + 1]);
    const moverIsWhite = i % 2 === 0;
    const color: PieceColor = moverIsWhite ? "white" : "black";

    const cpMoverBefore = moverIsWhite ? cpBeforeWhite : -cpBeforeWhite;
    const cpMoverAfter = moverIsWhite ? cpAfterWhite : -cpAfterWhite;
    const rawCpl = Math.max(0, cpMoverBefore - cpMoverAfter);
    const cpl = Math.min(CPL_CAP, rawCpl);

    const winBefore = cpToWinPercent(cpMoverBefore);
    const winAfter = cpToWinPercent(cpMoverAfter);
    const winLoss = Math.max(0, winBefore - winAfter);

    const classification = classifyMove(winLoss);

    const slot = moverIsWhite ? acc.white : acc.black;
    slot.moves += 1;
    slot.sumCpl += cpl;
    slot.sumAcc += moveAccuracy(winLoss);
    slot[classification] += 1;

    const playedMove = finalState.moveHistory[i];
    const playedSan = moveToAlgebraic(playedMove, positions[i]);
    const playedUci = moveToUci(playedMove);

    let bestMoveUci: string | null = null;
    let bestMoveSan: string | null = null;
    if (
      evals[i].bestMove &&
      classification !== "best" &&
      evals[i].bestMove !== playedUci
    ) {
      const conv = uciBestMoveToSan(evals[i].bestMove as string, positions[i]);
      if (conv) {
        bestMoveUci = conv.uci;
        bestMoveSan = conv.san;
      }
    }

    moveDetails.push({
      ply: i,
      color,
      san: playedSan,
      uci: playedUci,
      classification,
      cpLoss: cpl,
      winPctLoss: winLoss,
      evalBeforeCp: evals[i].cp,
      evalAfterCp: evals[i + 1].cp,
      bestMoveUci,
      bestMoveSan,
    });
  }

  function summarize(color: PieceColor): PlayerAnalysis {
    const s = color === "white" ? acc.white : acc.black;
    const movesAnalyzed = s.moves;
    const acpl = movesAnalyzed > 0 ? s.sumCpl / movesAnalyzed : 0;
    const accuracy = movesAnalyzed > 0 ? s.sumAcc / movesAnalyzed : 100;
    return {
      color,
      accuracy,
      estimatedElo: estimateEloFromAccuracy(accuracy, movesAnalyzed),
      averageCentipawnLoss: acpl,
      movesAnalyzed,
      best: s.best,
      excellent: s.excellent,
      good: s.good,
      inaccuracy: s.inaccuracy,
      mistake: s.mistake,
      blunder: s.blunder,
    };
  }

  return {
    white: summarize("white"),
    black: summarize("black"),
    moves: moveDetails,
  };
}
