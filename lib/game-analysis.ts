/**
 * Analyse post-partie : pour chaque coup joué, on évalue la position avant et
 * après avec Stockfish à pleine puissance. La perte de centièmes de pion
 * (CPL) et la perte de win% donnent une précision /100 à la Lichess, ainsi
 * qu'un classement par catégorie (blunder / mistake / inaccuracy).
 *
 * Formule de précision utilisée :
 *   win% = 50 + 50 * (2 / (1 + exp(-0.00368208 * cp)) - 1)   (Lichess)
 *   accuracy = 103.1668 * exp(-0.04354 * winPercentLoss) - 3.1669
 *
 * L'Elo de partie est estimé à partir de l'ACPL avec un mapping grossier
 * inspiré des tables couramment utilisées pour la force des moteurs.
 */

import { GameState, PieceColor } from "@/types/chess";
import { createInitialGameState, executeMove } from "./chess-engine";
import { gameStateToStockfishFEN } from "./fen-utils";
import { evaluatePosition, PositionEvaluation } from "./stockfish-engine";
import type { GameVariant } from "@/types/chess";

const ANALYSIS_MOVETIME_MS = 400;
/** Mate score plafonné pour éviter des écarts énormes dans la conversion. */
const MATE_CP_VALUE = 1000;

export interface PlayerAnalysis {
  color: PieceColor;
  accuracy: number;
  estimatedElo: number;
  averageCentipawnLoss: number;
  movesAnalyzed: number;
  blunders: number;
  mistakes: number;
  inaccuracies: number;
}

export interface GameAnalysisResult {
  white: PlayerAnalysis;
  black: PlayerAnalysis;
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

/** Mapping ACPL → Elo estimé (inspiré des tables de force moteur). */
function estimateEloFromAcpl(acpl: number): number {
  if (acpl < 10) return 2700;
  if (acpl < 20) return 2400;
  if (acpl < 35) return 2100;
  if (acpl < 55) return 1800;
  if (acpl < 80) return 1500;
  if (acpl < 120) return 1200;
  if (acpl < 200) return 900;
  return 600;
}

/** Classification du coup d'après la perte de win%. */
function classifyMove(winPctLoss: number): "blunder" | "mistake" | "inaccuracy" | "ok" {
  if (winPctLoss >= 20) return "blunder";
  if (winPctLoss >= 10) return "mistake";
  if (winPctLoss >= 5) return "inaccuracy";
  return "ok";
}

export interface AnalyzeGameOptions {
  gameVariant: GameVariant;
  chess960Position?: number;
  finalState: GameState;
  movetimeMs?: number;
  onProgress?: (current: number, total: number) => void;
}

export async function analyzeGame(
  options: AnalyzeGameOptions
): Promise<GameAnalysisResult> {
  const { gameVariant, chess960Position, finalState, onProgress } = options;
  const movetimeMs = options.movetimeMs ?? ANALYSIS_MOVETIME_MS;

  // Reconstruire toutes les positions à partir de l'état initial.
  let state = createInitialGameState(gameVariant, chess960Position);
  const positions: GameState[] = [state];
  for (const move of finalState.moveHistory) {
    state = executeMove(state, move.from, move.to, move.promotionPiece);
    positions.push(state);
  }

  const total = positions.length;
  onProgress?.(0, total);

  const evals: PositionEvaluation[] = [];
  for (let i = 0; i < total; i++) {
    const fen = gameStateToStockfishFEN(positions[i]);
    const ev = await evaluatePosition({
      fen,
      movetimeMs,
      chess960: positions[i].isChess960,
    });
    evals.push(ev);
    onProgress?.(i + 1, total);
  }

  const acc = {
    white: { sumAcc: 0, sumCpl: 0, moves: 0, blunders: 0, mistakes: 0, inaccuracies: 0 },
    black: { sumAcc: 0, sumCpl: 0, moves: 0, blunders: 0, mistakes: 0, inaccuracies: 0 },
  };

  for (let i = 0; i < positions.length - 1; i++) {
    const cpBeforeWhite = evalToWhiteCp(evals[i]);
    const cpAfterWhite = evalToWhiteCp(evals[i + 1]);
    const moverIsWhite = i % 2 === 0;

    // CPL et win% côté joueur ayant joué le coup.
    const cpMoverBefore = moverIsWhite ? cpBeforeWhite : -cpBeforeWhite;
    const cpMoverAfter = moverIsWhite ? cpAfterWhite : -cpAfterWhite;
    const cpl = Math.max(0, cpMoverBefore - cpMoverAfter);

    const winBefore = cpToWinPercent(cpMoverBefore);
    const winAfter = cpToWinPercent(cpMoverAfter);
    const winLoss = Math.max(0, winBefore - winAfter);

    const slot = moverIsWhite ? acc.white : acc.black;
    slot.moves += 1;
    slot.sumCpl += cpl;
    slot.sumAcc += moveAccuracy(winLoss);
    const kind = classifyMove(winLoss);
    if (kind === "blunder") slot.blunders += 1;
    else if (kind === "mistake") slot.mistakes += 1;
    else if (kind === "inaccuracy") slot.inaccuracies += 1;
  }

  function summarize(color: PieceColor): PlayerAnalysis {
    const s = color === "white" ? acc.white : acc.black;
    const movesAnalyzed = s.moves;
    const acpl = movesAnalyzed > 0 ? s.sumCpl / movesAnalyzed : 0;
    const accuracy = movesAnalyzed > 0 ? s.sumAcc / movesAnalyzed : 100;
    return {
      color,
      accuracy,
      estimatedElo: estimateEloFromAcpl(acpl),
      averageCentipawnLoss: acpl,
      movesAnalyzed,
      blunders: s.blunders,
      mistakes: s.mistakes,
      inaccuracies: s.inaccuracies,
    };
  }

  return { white: summarize("white"), black: summarize("black") };
}
