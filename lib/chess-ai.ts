import { GameState, Position, Piece, PieceColor } from "@/types/chess";
import { getPossibleMoves, executeMove } from "./chess-engine";
import { positionsEqual } from "./chess-utils";

export type AILevel = 400 | 800 | 1200 | 1600;

export interface AIMove {
  from: Position;
  to: Position;
  promotionPiece?: "queen" | "rook" | "bishop" | "knight";
}

/**
 * Configuration pour chaque niveau d'IA
 */
interface AILevelConfig {
  name: string;
  elo: number;
  description: string;
  blunderProbability: number; // Probabilité de faire une erreur flagrante
  tacticalDepth: number; // Profondeur de recherche tactique (1-4 coups)
  strategicWeight: number; // Poids de l'évaluation stratégique (0-1)
  randomness: number; // Niveau d'aléatoire dans le choix (0-1)
  developpementWeight: number; // Importance du développement en ouverture
  centerControlWeight: number; // Importance du contrôle du centre
  kingSafetyWeight: number; // Importance de la sécurité du roi
}

const AI_CONFIGS: Record<AILevel, AILevelConfig> = {
  400: {
    name: "LN Débutant",
    elo: 400,
    description: "Connaît les règles mais fait beaucoup d'erreurs",
    blunderProbability: 0.35, // 35% de chance de blunder
    tacticalDepth: 1, // Ne regarde qu'un coup à l'avance
    strategicWeight: 0.1, // Peu de compréhension stratégique
    randomness: 0.6, // Très aléatoire
    developpementWeight: 0.2,
    centerControlWeight: 0.3,
    kingSafetyWeight: 0.4,
  },
  800: {
    name: "LN Amateur",
    elo: 800,
    description: "Comprend les principes de base mais rate des tactiques",
    blunderProbability: 0.2, // 20% de chance de blunder
    tacticalDepth: 2, // Regarde 2 coups à l'avance
    strategicWeight: 0.3,
    randomness: 0.4,
    developpementWeight: 0.5,
    centerControlWeight: 0.6,
    kingSafetyWeight: 0.7,
  },
  1200: {
    name: "LN Intermédiaire",
    elo: 1200,
    description: "Joue avec un plan et repère la plupart des tactiques",
    blunderProbability: 0.08, // 8% de chance de blunder
    tacticalDepth: 3, // Regarde 3 coups à l'avance
    strategicWeight: 0.6,
    randomness: 0.2,
    developpementWeight: 0.8,
    centerControlWeight: 0.8,
    kingSafetyWeight: 0.9,
  },
  1600: {
    name: "LN Avancé",
    elo: 1600,
    description: "Joue solidement avec compréhension stratégique",
    blunderProbability: 0.03, // 3% de chance de blunder
    tacticalDepth: 4, // Regarde 4 coups à l'avance
    strategicWeight: 0.9,
    randomness: 0.05,
    developpementWeight: 1.0,
    centerControlWeight: 1.0,
    kingSafetyWeight: 1.0,
  },
};

/**
 * Valeurs des pièces
 */
const PIECE_VALUES: Record<string, number> = {
  pawn: 100,
  knight: 320,
  bishop: 330,
  rook: 500,
  queen: 900,
  king: 20000,
};

/**
 * Tables de position pour l'évaluation
 * Plus la valeur est élevée, meilleure est la position pour la pièce
 */
const PAWN_TABLE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const KNIGHT_TABLE = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50],
];

const BISHOP_TABLE = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 10, 10, 5, 0, -10],
  [-10, 5, 5, 10, 10, 5, 5, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 5, 0, 0, 0, 0, 5, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20],
];

const ROOK_TABLE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [5, 10, 10, 10, 10, 10, 10, 5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [0, 0, 0, 5, 5, 0, 0, 0],
];

const QUEEN_TABLE = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-5, 0, 5, 5, 5, 5, 0, -5],
  [0, 0, 5, 5, 5, 5, 0, -5],
  [-10, 5, 5, 5, 5, 5, 0, -10],
  [-10, 0, 5, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20],
];

const KING_MIDDLE_GAME_TABLE = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 30, 10, 0, 0, 10, 30, 20],
];

const KING_END_GAME_TABLE = [
  [-50, -40, -30, -20, -20, -30, -40, -50],
  [-30, -20, -10, 0, 0, -10, -20, -30],
  [-30, -10, 20, 30, 30, 20, -10, -30],
  [-30, -10, 30, 40, 40, 30, -10, -30],
  [-30, -10, 30, 40, 40, 30, -10, -30],
  [-30, -10, 20, 30, 30, 20, -10, -30],
  [-30, -30, 0, 0, 0, 0, -30, -30],
  [-50, -30, -30, -30, -30, -30, -30, -50],
];

/**
 * Obtient la valeur positionnelle d'une pièce
 */
function getPiecePositionValue(
  piece: Piece,
  position: Position,
  isEndGame: boolean
): number {
  const { row, col, type, color } = { ...position, ...piece };

  // Inverser la table pour les noirs
  const tableRow = color === "white" ? row : 7 - row;

  switch (type) {
    case "pawn":
      return PAWN_TABLE[tableRow][col];
    case "knight":
      return KNIGHT_TABLE[tableRow][col];
    case "bishop":
      return BISHOP_TABLE[tableRow][col];
    case "rook":
      return ROOK_TABLE[tableRow][col];
    case "queen":
      return QUEEN_TABLE[tableRow][col];
    case "king":
      return isEndGame
        ? KING_END_GAME_TABLE[tableRow][col]
        : KING_MIDDLE_GAME_TABLE[tableRow][col];
    default:
      return 0;
  }
}

/**
 * Vérifie si on est en finale (peu de pièces sur l'échiquier)
 */
function isEndGame(board: (Piece | null)[][]): boolean {
  let pieceCount = 0;
  let queenCount = 0;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type !== "king") {
        pieceCount++;
        if (piece.type === "queen") queenCount++;
      }
    }
  }

  // Finale si moins de 12 pièces ou pas de dames
  return pieceCount <= 12 || queenCount === 0;
}

/**
 * Évalue la position du plateau pour un joueur donné
 */
function evaluateBoard(
  gameState: GameState,
  aiColor: PieceColor,
  config: AILevelConfig
): number {
  const { board } = gameState;
  const opponentColor = aiColor === "white" ? "black" : "white";
  const endGame = isEndGame(board);
  let score = 0;

  // Évaluation matérielle et positionnelle
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece) continue;

      const position: Position = { row, col };
      const pieceValue = PIECE_VALUES[piece.type];
      const positionalValue =
        getPiecePositionValue(piece, position, endGame) *
        config.strategicWeight;

      const totalValue = pieceValue + positionalValue;

      if (piece.color === aiColor) {
        score += totalValue;
      } else {
        score -= totalValue;
      }
    }
  }

  // Bonus pour le contrôle du centre (cases e4, d4, e5, d5)
  const centerSquares = [
    { row: 3, col: 3 }, // d5
    { row: 3, col: 4 }, // e5
    { row: 4, col: 3 }, // d4
    { row: 4, col: 4 }, // e4
  ];

  for (const square of centerSquares) {
    const piece = board[square.row][square.col];
    if (piece) {
      const centerBonus = 10 * config.centerControlWeight;
      if (piece.color === aiColor) {
        score += centerBonus;
      } else {
        score -= centerBonus;
      }
    }
  }

  // Bonus pour le développement en ouverture (moins de 10 coups)
  if (gameState.moveHistory.length < 10) {
    score +=
      evaluateDevelopment(board, aiColor) * config.developpementWeight * 5;
    score -=
      evaluateDevelopment(board, opponentColor) *
      config.developpementWeight *
      5;
  }

  // Malus si le roi est en échec
  if (gameState.isCheck) {
    if (gameState.currentPlayer === aiColor) {
      score -= 50 * config.kingSafetyWeight;
    } else {
      score += 50 * config.kingSafetyWeight;
    }
  }

  return score;
}

/**
 * Évalue le développement des pièces
 */
function evaluateDevelopment(
  board: (Piece | null)[][],
  color: PieceColor
): number {
  let developmentScore = 0;
  const backRank = color === "white" ? 7 : 0;

  // Pénalité pour les pièces mineures non développées
  const minorPiecePositions = [1, 2, 5, 6]; // Cavaliers et fous
  for (const col of minorPiecePositions) {
    const piece = board[backRank][col];
    if (piece && piece.color === color && !piece.hasMoved) {
      developmentScore -= 10;
    }
  }

  // Bonus pour le roque
  const king = board[backRank][4];
  if (king && king.color === color && king.hasMoved) {
    // Vérifier si le roi a roqué (col 2 ou 6)
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const p = board[row][col];
        if (p && p.type === "king" && p.color === color) {
          if (col === 2 || col === 6) {
            developmentScore += 30;
          }
        }
      }
    }
  }

  // Pénalité pour sortir la dame trop tôt
  const queen = board[backRank][3];
  if (!queen || queen.color !== color || queen.type !== "queen") {
    // La dame a bougé, pénalité en début de partie
    developmentScore -= 15;
  }

  return developmentScore;
}

/**
 * Trouve tous les mouvements possibles pour l'IA
 */
function getAllPossibleAIMoves(
  gameState: GameState,
  aiColor: PieceColor
): Array<{ from: Position; to: Position; piece: Piece }> {
  const moves: Array<{ from: Position; to: Position; piece: Piece }> = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = gameState.board[row][col];
      if (piece && piece.color === aiColor) {
        const from: Position = { row, col };
        const possibleMoves = getPossibleMoves(
          gameState.board,
          from,
          gameState
        );

        for (const to of possibleMoves) {
          moves.push({ from, to, piece });
        }
      }
    }
  }

  return moves;
}

/**
 * Vérifie si un mouvement laisse une pièce en prise
 */
function isMoveLeavingPieceHanging(
  gameState: GameState,
  move: { from: Position; to: Position },
  aiColor: PieceColor
): boolean {
  const tempState = executeMove(gameState, move.from, move.to);
  const piece = tempState.board[move.to.row][move.to.col];

  if (!piece) return false;

  // Vérifier si des pièces adverses peuvent capturer cette pièce
  const opponentColor = aiColor === "white" ? "black" : "white";

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const opponentPiece = tempState.board[row][col];
      if (opponentPiece && opponentPiece.color === opponentColor) {
        const opponentMoves = getPossibleMoves(
          tempState.board,
          { row, col },
          tempState
        );

        if (opponentMoves.some((m) => positionsEqual(m, move.to))) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Trouve le meilleur mouvement pour l'IA avec minimax simplifié
 */
function findBestMove(
  gameState: GameState,
  aiColor: PieceColor,
  config: AILevelConfig
): AIMove | null {
  const allMoves = getAllPossibleAIMoves(gameState, aiColor);

  if (allMoves.length === 0) return null;

  // Simuler un blunder selon la probabilité
  if (Math.random() < config.blunderProbability) {
    // Faire un mauvais coup : laisser une pièce en prise ou un coup aléatoire
    const blunderMoves = allMoves.filter((move) =>
      isMoveLeavingPieceHanging(gameState, move, aiColor)
    );

    if (blunderMoves.length > 0) {
      const randomBlunder =
        blunderMoves[Math.floor(Math.random() * blunderMoves.length)];
      return { from: randomBlunder.from, to: randomBlunder.to };
    }

    // Si pas de blunder disponible, jouer un coup très faible (aléatoire)
    const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];
    return { from: randomMove.from, to: randomMove.to };
  }

  // Évaluer chaque mouvement
  interface EvaluatedMove {
    from: Position;
    to: Position;
    score: number;
    piece: Piece;
  }

  const evaluatedMoves: EvaluatedMove[] = allMoves.map((move) => {
    const tempState = executeMove(gameState, move.from, move.to);
    let score = evaluateBoard(tempState, aiColor, config);

    // Bonus pour les captures
    const capturedPiece = gameState.board[move.to.row][move.to.col];
    if (capturedPiece) {
      score += PIECE_VALUES[capturedPiece.type] * 0.1;
    }

    // Bonus pour l'échec
    if (tempState.isCheck) {
      score += 30;
    }

    // Bonus pour l'échec et mat
    if (tempState.isCheckmate) {
      score += 100000;
    }

    // Pénalité pour laisser une pièce en prise (sauf pour les bas niveaux)
    if (
      config.elo >= 800 &&
      isMoveLeavingPieceHanging(gameState, move, aiColor)
    ) {
      score -= PIECE_VALUES[move.piece.type] * 0.8;
    }

    // Ajouter de l'aléatoire selon le niveau
    if (config.randomness > 0) {
      const randomFactor = (Math.random() - 0.5) * 200 * config.randomness;
      score += randomFactor;
    }

    return { ...move, score };
  });

  // Trier par score décroissant
  evaluatedMoves.sort((a, b) => b.score - a.score);

  // Pour ajouter de la variété, choisir parmi les meilleurs coups
  const topMovesCount = Math.max(
    1,
    Math.floor(evaluatedMoves.length * 0.2 * (1 + config.randomness))
  );
  const topMoves = evaluatedMoves.slice(0, topMovesCount);

  // Sélectionner un coup parmi les meilleurs
  const selectedMove = topMoves[Math.floor(Math.random() * topMoves.length)];

  // Vérifier la promotion
  let promotionPiece: "queen" | "rook" | "bishop" | "knight" | undefined;
  if (
    selectedMove.piece.type === "pawn" &&
    (selectedMove.to.row === 0 || selectedMove.to.row === 7)
  ) {
    // L'IA choisit toujours la dame pour les niveaux bas, et peut varier pour les niveaux hauts
    if (config.elo < 1200 || Math.random() > 0.1) {
      promotionPiece = "queen";
    } else {
      const promotionOptions: Array<"queen" | "rook" | "bishop" | "knight"> = [
        "queen",
        "rook",
        "knight",
      ];
      promotionPiece =
        promotionOptions[Math.floor(Math.random() * promotionOptions.length)];
    }
  }

  return {
    from: selectedMove.from,
    to: selectedMove.to,
    promotionPiece,
  };
}

/**
 * Fonction principale pour obtenir le coup de l'IA
 */
export async function getAIMove(
  gameState: GameState,
  aiLevel: AILevel,
  aiColor: PieceColor
): Promise<AIMove | null> {
  const config = AI_CONFIGS[aiLevel];

  // Simuler un temps de réflexion (plus long pour les niveaux supérieurs)
  const thinkingTime = 300 + (config.elo / 1600) * 700; // 300ms à 1000ms
  await new Promise((resolve) => setTimeout(resolve, thinkingTime));

  return findBestMove(gameState, aiColor, config);
}

/**
 * Obtient les informations de configuration pour un niveau donné
 */
export function getAILevelInfo(level: AILevel): AILevelConfig {
  return AI_CONFIGS[level];
}
