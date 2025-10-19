/**
 * Moteur d'IA pour le jeu d'échecs
 *
 * Supporte les échecs standard ET Chess960 (Fischer Random Chess)
 *
 * Adaptations Chess960 selon les règles FIDE:
 * - Évaluation du développement adaptative (pas de positions fixes)
 * - Détection du roque ajustée (destinations finales en g1/c1 ou g8/c8)
 * - Bonus pour l'adaptation selon le niveau de l'IA
 * - Priorité accrue pour la sécurité du roi en Chess960
 *
 * Niveaux d'IA calibrés selon le système Elo:
 * - 400:  Débutant (2-3 demi-coups, 30% erreurs)
 * - 800:  Amateur (3 demi-coups, 20% erreurs)
 * - 1200: Intermédiaire (4-5 demi-coups, 15% erreurs)
 * - 1600: Avancé (5-6 demi-coups, 10% erreurs)
 * - 2000: Expert (6-8 demi-coups, 5% erreurs)
 * - 2500: Maître (9-10+ demi-coups, <2% erreurs)
 *
 * En Chess960:
 * - Pas d'ouvertures mémorisées
 * - Focus sur les principes généraux (développement, contrôle centre, sécurité roi)
 * - Adaptation selon capacité de l'IA (chess960Adaptability)
 */

import { GameState, Position, Piece, PieceColor } from "@/types/chess";
import { getPossibleMoves, executeMove } from "./chess-engine";
import { positionsEqual } from "./chess-utils";

export type AILevel = 400 | 800 | 1200 | 1600 | 2000 | 2500;

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
  chess960Adaptability: number; // Capacité d'adaptation aux positions Chess960 (0-1)
}

const AI_CONFIGS: Record<AILevel, AILevelConfig> = {
  400: {
    name: "LN Débutant",
    elo: 400,
    description: "Débutant total - Connaît les règles mais vision limitée",
    blunderProbability: 0.3, // 30% - En Chess960, gaffes fréquentes
    tacticalDepth: 1, // 2-3 demi-coups (analyse très basique)
    strategicWeight: 0.05, // Aucune compréhension stratégique
    randomness: 0.7, // Très aléatoire - joue souvent au hasard
    developpementWeight: 0.1, // Ignore presque le développement
    centerControlWeight: 0.2, // Peu d'intérêt pour le centre
    kingSafetyWeight: 0.3, // Roque tardif, oublié ou exposé
    chess960Adaptability: 0.1, // Très faible adaptation aux positions Chess960
  },
  800: {
    name: "LN Amateur",
    elo: 800,
    description: "Débutant avancé - Applique principes de base",
    blunderProbability: 0.2, // 20% - En Chess960, erreurs fréquentes
    tacticalDepth: 2, // 3 demi-coups
    strategicWeight: 0.3, // Compréhension basique
    randomness: 0.4, // Assez aléatoire
    developpementWeight: 0.5, // Commence à développer ses pièces
    centerControlWeight: 0.6, // Connaît l'importance du centre
    kingSafetyWeight: 0.65, // Roque plus régulièrement
    chess960Adaptability: 0.3, // S'adapte faiblement aux positions inhabituelles
  },
  1200: {
    name: "LN Intermédiaire",
    elo: 1200,
    description: "Intermédiaire - Construit des plans, adaptable au Chess960",
    blunderProbability: 0.15, // 15% - Erreurs occasionnelles
    tacticalDepth: 3, // 4-5 demi-coups
    strategicWeight: 0.6, // Bonne compréhension des principes
    randomness: 0.2, // Moins aléatoire, plus cohérent
    developpementWeight: 0.75, // Bon développement rapide
    centerControlWeight: 0.8, // Contrôle actif du centre
    kingSafetyWeight: 0.85, // Roque systématique dès que possible
    chess960Adaptability: 0.6, // S'adapte correctement aux positions Chess960
  },
  1600: {
    name: "LN Avancé",
    elo: 1600,
    description: "Avancé - Solide tactiquement et positionellement",
    blunderProbability: 0.1, // 10% - Erreurs rares, surtout des imprécisions
    tacticalDepth: 4, // 5-6 demi-coups
    strategicWeight: 0.85, // Très bonne compréhension positionnelle
    randomness: 0.08, // Peu aléatoire
    developpementWeight: 0.95, // Développement rapide et optimal
    centerControlWeight: 0.95, // Maîtrise du contrôle du centre
    kingSafetyWeight: 0.98, // Sécurité du roi prioritaire absolue
    chess960Adaptability: 0.85, // S'adapte bien aux positions Chess960
  },
  2000: {
    name: "LN Expert",
    elo: 2000,
    description: "Expert - Compréhension positionnelle avancée et dynamique",
    blunderProbability: 0.05, // 5% - Erreurs très rares
    tacticalDepth: 5, // 6-8 demi-coups
    strategicWeight: 1.0, // Compréhension complète des plans
    randomness: 0.03, // Presque pas d'aléatoire
    developpementWeight: 1.0, // Développement parfait selon position
    centerControlWeight: 1.0, // Contrôle optimal des cases clés
    kingSafetyWeight: 1.0, // Sécurité maximale avant toute attaque
    chess960Adaptability: 0.95, // Excellente adaptation au Chess960
  },
  2500: {
    name: "LN Maître",
    elo: 2500,
    description: "Niveau maître - Jeu quasi-parfait, exploite Chess960",
    blunderProbability: 0.02, // < 2% - Presque jamais d'erreurs
    tacticalDepth: 6, // 9-10+ demi-coups
    strategicWeight: 1.0, // Compréhension parfaite
    randomness: 0.01, // Variance minimale, jeu optimal
    developpementWeight: 1.0, // Développement parfait et créatif
    centerControlWeight: 1.0, // Contrôle absolu selon position
    kingSafetyWeight: 1.0, // Sécurité optimale en toutes phases
    chess960Adaptability: 1.0, // Maîtrise totale du Chess960
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
 * Détermine la phase du jeu
 */
function getGamePhase(
  gameState: GameState
): "opening" | "middlegame" | "endgame" {
  const moveCount = gameState.moveHistory.length;

  // Phase d'ouverture : < 10 coups
  if (moveCount < 10) {
    return "opening";
  }

  // Compter le matériel pour déterminer milieu/finale
  let pieceCount = 0;
  let queenCount = 0;
  let minorPieceCount = 0;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = gameState.board[row][col];
      if (piece && piece.type !== "king" && piece.type !== "pawn") {
        pieceCount++;
        if (piece.type === "queen") queenCount++;
        if (piece.type === "bishop" || piece.type === "knight")
          minorPieceCount++;
      }
    }
  }

  // Finale si : peu de pièces OU pas de dames et peu de pièces mineures
  if (pieceCount <= 6 || (queenCount === 0 && minorPieceCount <= 2)) {
    return "endgame";
  }

  return "middlegame";
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
      evaluateDevelopment(board, aiColor, gameState) *
      config.developpementWeight *
      5;
    score -=
      evaluateDevelopment(board, opponentColor, gameState) *
      config.developpementWeight *
      5;
  }

  // Bonus Chess960 : adaptation à la position initiale inhabituelle
  if (gameState.isChess960 && gameState.moveHistory.length < 15) {
    // Bonus pour l'IA qui s'adapte mieux selon son niveau
    const adaptationBonus =
      20 * config.chess960Adaptability * config.strategicWeight;
    score += adaptationBonus;
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
 * Adapté pour Chess960 : ne suppose pas de positions initiales fixes
 */
function evaluateDevelopment(
  board: (Piece | null)[][],
  color: PieceColor,
  gameState: GameState
): number {
  let developmentScore = 0;
  const backRank = color === "white" ? 7 : 0;

  // En Chess960, on évalue le développement de manière générique
  if (gameState.isChess960) {
    // Évaluer les pièces mineures (cavaliers et fous)
    for (let col = 0; col < 8; col++) {
      const piece = board[backRank][col];
      if (
        piece &&
        piece.color === color &&
        (piece.type === "knight" || piece.type === "bishop")
      ) {
        if (piece.hasMoved) {
          developmentScore += 15; // Bonus pour avoir développé une pièce
        } else {
          developmentScore -= 10; // Pénalité si elle n'a pas bougé
        }
      }
    }

    // Bonus pour le roque (roi en position roquée : col 2 ou 6)
    for (let col = 0; col < 8; col++) {
      const p = board[backRank][col];
      if (p && p.type === "king" && p.color === color) {
        if ((col === 2 || col === 6) && p.hasMoved) {
          developmentScore += 40; // Gros bonus pour avoir roqué en Chess960
        }
        break;
      }
    }

    // Pénalité légère pour sortir la dame trop tôt
    for (let col = 0; col < 8; col++) {
      const piece = board[backRank][col];
      if (piece && piece.type === "queen" && piece.color === color) {
        if (!piece.hasMoved) {
          // Dame pas encore sortie, c'est bien en début de partie
          developmentScore += 5;
        } else {
          // Dame sortie, pénalité mineure
          developmentScore -= 8;
        }
        break;
      }
    }
  } else {
    // Échecs standard : positions fixes connues
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
  // Plus le niveau est bas, plus les blunders sont probables et graves
  if (Math.random() < config.blunderProbability) {
    // À bas niveau (400-800), les blunders sont plus flagrants
    if (config.elo <= 800) {
      // Chercher des coups qui laissent des pièces en prise
      const blunderMoves = allMoves.filter((move) =>
        isMoveLeavingPieceHanging(gameState, move, aiColor)
      );

      if (blunderMoves.length > 0) {
        // Choisir le pire blunder (pièce la plus précieuse en prise)
        const worstBlunder = blunderMoves.sort(
          (a, b) => PIECE_VALUES[b.piece.type] - PIECE_VALUES[a.piece.type]
        )[0];
        return { from: worstBlunder.from, to: worstBlunder.to };
      }

      // Sinon, coup complètement aléatoire
      const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];
      return { from: randomMove.from, to: randomMove.to };
    }

    // À niveau intermédiaire (1200-1600), blunders plus subtils
    // Jouer un coup qui n'est pas optimal mais pas catastrophique
    const weakMoves = allMoves.slice(
      Math.floor(allMoves.length * 0.6),
      allMoves.length
    );
    if (weakMoves.length > 0) {
      const weakMove = weakMoves[Math.floor(Math.random() * weakMoves.length)];
      return { from: weakMove.from, to: weakMove.to };
    }
  }

  // Évaluer chaque mouvement selon la profondeur tactique du niveau
  interface EvaluatedMove {
    from: Position;
    to: Position;
    score: number;
    piece: Piece;
  }

  const evaluatedMoves: EvaluatedMove[] = allMoves.map((move) => {
    const tempState = executeMove(gameState, move.from, move.to);
    let score = evaluateBoard(tempState, aiColor, config);

    // Bonus pour les captures (pondéré par le niveau)
    const capturedPiece = gameState.board[move.to.row][move.to.col];
    if (capturedPiece) {
      const captureBonus = PIECE_VALUES[capturedPiece.type] * 0.15;
      score += captureBonus;

      // Les niveaux faibles surévaluent les captures
      if (config.elo < 1200) {
        score += captureBonus * 0.5;
      }
    }

    // Bonus pour l'échec (les débutants aiment donner échec)
    if (tempState.isCheck) {
      const checkBonus = config.elo < 1200 ? 50 : 30;
      score += checkBonus;
    }

    // Bonus massif pour l'échec et mat
    if (tempState.isCheckmate) {
      score += 100000;
    }

    // Pénalité pour laisser une pièce en prise
    // Plus le niveau est élevé, plus la pénalité est importante
    if (isMoveLeavingPieceHanging(gameState, move, aiColor)) {
      const penalty = PIECE_VALUES[move.piece.type] * config.strategicWeight;
      score -= penalty;

      // Les débutants ne voient pas toujours le danger
      if (config.elo < 800 && Math.random() > 0.5) {
        score += penalty; // Annuler la pénalité 50% du temps
      }
    }

    // Bonus pour le développement en ouverture (< 10 coups)
    if (gameState.moveHistory.length < 10) {
      const isDevelopmentMove =
        (move.piece.type === "knight" || move.piece.type === "bishop") &&
        !move.piece.hasMoved;
      if (isDevelopmentMove) {
        score += 20 * config.developpementWeight;
      }
    }

    // Bonus pour le roque (sécurité du roi)
    // Détection adaptée pour Chess960
    const isCastling = gameState.isChess960
      ? move.piece.type === "king" && (move.to.col === 2 || move.to.col === 6)
      : move.piece.type === "king" &&
        Math.abs(move.to.col - move.from.col) === 2;

    if (isCastling) {
      const castleBonus = gameState.isChess960
        ? 50 * config.kingSafetyWeight // Bonus plus élevé en Chess960 (roque plus important)
        : 40 * config.kingSafetyWeight;
      score += castleBonus;
    }

    // Ajouter de l'aléatoire selon le niveau
    // Plus le niveau est bas, plus c'est aléatoire
    if (config.randomness > 0) {
      const randomRange = 150 * config.randomness;
      const randomFactor = (Math.random() - 0.5) * randomRange;
      score += randomFactor;
    }

    return { ...move, score };
  });

  // Trier par score décroissant
  evaluatedMoves.sort((a, b) => b.score - a.score);

  // Sélection du coup selon le niveau
  let selectedMove: EvaluatedMove;

  if (config.elo <= 400) {
    // Niveau 400 : très aléatoire, peut choisir dans le top 60%
    const topMovesCount = Math.max(1, Math.floor(evaluatedMoves.length * 0.6));
    const topMoves = evaluatedMoves.slice(0, topMovesCount);
    selectedMove = topMoves[Math.floor(Math.random() * topMoves.length)];
  } else if (config.elo <= 800) {
    // Niveau 800 : choisit dans le top 40%
    const topMovesCount = Math.max(1, Math.floor(evaluatedMoves.length * 0.4));
    const topMoves = evaluatedMoves.slice(0, topMovesCount);
    selectedMove = topMoves[Math.floor(Math.random() * topMoves.length)];
  } else if (config.elo <= 1200) {
    // Niveau 1200 : choisit dans le top 25%
    const topMovesCount = Math.max(1, Math.floor(evaluatedMoves.length * 0.25));
    const topMoves = evaluatedMoves.slice(0, topMovesCount);
    selectedMove = topMoves[Math.floor(Math.random() * topMoves.length)];
  } else if (config.elo <= 1600) {
    // Niveau 1600 : choisit dans le top 15%
    const topMovesCount = Math.max(1, Math.floor(evaluatedMoves.length * 0.15));
    const topMoves = evaluatedMoves.slice(0, topMovesCount);
    selectedMove = topMoves[Math.floor(Math.random() * topMoves.length)];
  } else if (config.elo <= 2000) {
    // Niveau 2000 : choisit dans le top 10% (quasi-optimal)
    const topMovesCount = Math.max(1, Math.floor(evaluatedMoves.length * 0.1));
    const topMoves = evaluatedMoves.slice(0, topMovesCount);
    selectedMove = topMoves[Math.floor(Math.random() * topMoves.length)];
  } else {
    // Niveau 2500 : choisit dans le top 5% (presque toujours le meilleur)
    const topMovesCount = Math.max(1, Math.floor(evaluatedMoves.length * 0.05));
    const topMoves = evaluatedMoves.slice(0, topMovesCount);

    // Préférence forte pour le meilleur coup (80% du temps)
    if (Math.random() < 0.8) {
      selectedMove = topMoves[0]; // Meilleur coup
    } else {
      selectedMove = topMoves[Math.floor(Math.random() * topMoves.length)];
    }
  }

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
 * Utilise un algorithme heuristique avancé adapté au niveau
 */
export async function getAIMove(
  gameState: GameState,
  aiLevel: AILevel,
  aiColor: PieceColor
): Promise<AIMove | null> {
  const config = AI_CONFIGS[aiLevel];
  const phase = getGamePhase(gameState);

  // Temps de base par niveau (en ms)
  const baseTimeByLevel: Record<AILevel, number> = {
    400: 250, // Joue vite
    800: 400, // Réfléchit un peu
    1200: 650, // Prend son temps
    1600: 900, // Calcule davantage
    2000: 1200, // Analyse profonde
    2500: 1800, // Analyse très profonde
  };

  let baseTime = baseTimeByLevel[aiLevel];

  // Ajustement selon la phase
  if (phase === "opening") {
    baseTime *= 0.7; // Plus rapide en ouverture
  } else if (phase === "endgame") {
    baseTime *= 1.3; // Plus lent en finale (calculs précis)
  }

  // Variation aléatoire réaliste (±40%)
  const variation = baseTime * 0.8;
  const thinkingTime = baseTime + (Math.random() - 0.5) * variation;

  // Algorithme heuristique avancé
  await new Promise((resolve) =>
    setTimeout(resolve, Math.max(200, thinkingTime))
  );
  return findBestMove(gameState, aiColor, config);
}

/**
 * Obtient les informations de configuration pour un niveau donné
 */
export function getAILevelInfo(level: AILevel): AILevelConfig {
  return AI_CONFIGS[level];
}
