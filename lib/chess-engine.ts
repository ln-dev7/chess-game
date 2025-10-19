import {
  GameState,
  Position,
  Piece,
  Move,
  PieceColor,
  PieceType,
  GameVariant,
} from "@/types/chess";
import {
  cloneBoard,
  isValidPosition,
  positionsEqual,
  getOppositeColor,
  isSquareAttacked,
  isKingInCheck,
  hasInsufficientMaterial,
  getBoardHash,
} from "./chess-utils";
import {
  generateChess960Position,
  generateRandomChess960Position,
  findRookPositions,
  findKingPosition,
} from "./chess960-utils";

/**
 * Crée l'état initial du jeu
 */
export function createInitialGameState(
  variant: GameVariant = "standard",
  chess960PositionNumber?: number
): GameState {
  const isChess960 = variant === "chess960";
  const board = isChess960
    ? chess960PositionNumber !== undefined
      ? generateChess960Position(chess960PositionNumber)
      : generateRandomChess960Position()
    : createInitialBoard();

  // Pour Chess960, trouver les positions initiales des tours et du roi
  let whiteKingInitialCol: number | undefined;
  let blackKingInitialCol: number | undefined;
  let whiteQueenRookInitialCol: number | undefined;
  let whiteKingRookInitialCol: number | undefined;
  let blackQueenRookInitialCol: number | undefined;
  let blackKingRookInitialCol: number | undefined;

  if (isChess960) {
    whiteKingInitialCol = findKingPosition(board, "white");
    blackKingInitialCol = findKingPosition(board, "black");

    const whiteRooks = findRookPositions(board, "white");
    const blackRooks = findRookPositions(board, "black");

    whiteQueenRookInitialCol = whiteRooks.queenSideRook;
    whiteKingRookInitialCol = whiteRooks.kingSideRook;
    blackQueenRookInitialCol = blackRooks.queenSideRook;
    blackKingRookInitialCol = blackRooks.kingSideRook;
  }

  return {
    board,
    currentPlayer: "white",
    selectedSquare: null,
    validMoves: [],
    moveHistory: [],
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    isDraw: false,
    gameEndReason: null,
    enPassantTarget: null,
    whiteKingMoved: false,
    blackKingMoved: false,
    whiteRookAMoved: false,
    whiteRookHMoved: false,
    blackRookAMoved: false,
    blackRookHMoved: false,
    halfMoveClock: 0,
    positionHistory: new Map([[getBoardHash(board, "white"), 1]]),
    isChess960,
    whiteKingInitialCol,
    blackKingInitialCol,
    whiteQueenRookInitialCol,
    whiteKingRookInitialCol,
    blackQueenRookInitialCol,
    blackKingRookInitialCol,
  };
}

/**
 * Crée le plateau initial
 */
function createInitialBoard(): (Piece | null)[][] {
  const board: (Piece | null)[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));

  // Placement des pièces noires
  board[0] = [
    { type: "rook", color: "black", hasMoved: false },
    { type: "knight", color: "black", hasMoved: false },
    { type: "bishop", color: "black", hasMoved: false },
    { type: "queen", color: "black", hasMoved: false },
    { type: "king", color: "black", hasMoved: false },
    { type: "bishop", color: "black", hasMoved: false },
    { type: "knight", color: "black", hasMoved: false },
    { type: "rook", color: "black", hasMoved: false },
  ];

  board[1] = Array(8)
    .fill(null)
    .map(() => ({
      type: "pawn" as PieceType,
      color: "black" as PieceColor,
      hasMoved: false,
    }));

  // Placement des pièces blanches
  board[6] = Array(8)
    .fill(null)
    .map(() => ({
      type: "pawn" as PieceType,
      color: "white" as PieceColor,
      hasMoved: false,
    }));

  board[7] = [
    { type: "rook", color: "white", hasMoved: false },
    { type: "knight", color: "white", hasMoved: false },
    { type: "bishop", color: "white", hasMoved: false },
    { type: "queen", color: "white", hasMoved: false },
    { type: "king", color: "white", hasMoved: false },
    { type: "bishop", color: "white", hasMoved: false },
    { type: "knight", color: "white", hasMoved: false },
    { type: "rook", color: "white", hasMoved: false },
  ];

  return board;
}

/**
 * Obtient tous les mouvements possibles pour une pièce donnée
 */
export function getPossibleMoves(
  board: (Piece | null)[][],
  from: Position,
  gameState: GameState
): Position[] {
  const piece = board[from.row][from.col];
  if (!piece || piece.color !== gameState.currentPlayer) {
    return [];
  }

  let possibleMoves: Position[] = [];

  switch (piece.type) {
    case "pawn":
      possibleMoves = getPawnMoves(board, from, piece, gameState);
      break;
    case "knight":
      possibleMoves = getKnightMoves(board, from, piece);
      break;
    case "bishop":
      possibleMoves = getBishopMoves(board, from, piece);
      break;
    case "rook":
      possibleMoves = getRookMoves(board, from, piece);
      break;
    case "queen":
      possibleMoves = getQueenMoves(board, from, piece);
      break;
    case "king":
      possibleMoves = getKingMoves(board, from, piece, gameState);
      break;
  }

  // Filtrer les mouvements qui mettraient le roi en échec
  return possibleMoves.filter(
    (to) => !wouldMoveExposeKing(board, from, to, piece.color, gameState)
  );
}

/**
 * Vérifie si un mouvement exposerait le roi à un échec
 */
function wouldMoveExposeKing(
  board: (Piece | null)[][],
  from: Position,
  to: Position,
  color: PieceColor,
  gameState: GameState
): boolean {
  const testBoard = cloneBoard(board);
  const piece = testBoard[from.row][from.col];

  // Effectuer le mouvement temporairement
  testBoard[to.row][to.col] = piece;
  testBoard[from.row][from.col] = null;

  // Gérer la prise en passant
  if (
    piece &&
    piece.type === "pawn" &&
    gameState.enPassantTarget &&
    positionsEqual(to, gameState.enPassantTarget)
  ) {
    const captureRow = color === "white" ? to.row + 1 : to.row - 1;
    testBoard[captureRow][to.col] = null;
  }

  return isKingInCheck(testBoard, color);
}

/**
 * Mouvements du pion
 */
function getPawnMoves(
  board: (Piece | null)[][],
  from: Position,
  piece: Piece,
  gameState: GameState
): Position[] {
  const moves: Position[] = [];
  const direction = piece.color === "white" ? -1 : 1;
  const startRow = piece.color === "white" ? 6 : 1;

  // Mouvement d'une case vers l'avant
  const oneForward = { row: from.row + direction, col: from.col };
  if (
    isValidPosition(oneForward) &&
    board[oneForward.row][oneForward.col] === null
  ) {
    moves.push(oneForward);

    // Mouvement de deux cases depuis la position initiale
    if (from.row === startRow) {
      const twoForward = { row: from.row + 2 * direction, col: from.col };
      if (board[twoForward.row][twoForward.col] === null) {
        moves.push(twoForward);
      }
    }
  }

  // Captures diagonales
  const capturePositions = [
    { row: from.row + direction, col: from.col - 1 },
    { row: from.row + direction, col: from.col + 1 },
  ];

  for (const capturePos of capturePositions) {
    if (isValidPosition(capturePos)) {
      const targetPiece = board[capturePos.row][capturePos.col];
      if (targetPiece && targetPiece.color !== piece.color) {
        moves.push(capturePos);
      }

      // Prise en passant
      if (
        gameState.enPassantTarget &&
        positionsEqual(capturePos, gameState.enPassantTarget)
      ) {
        moves.push(capturePos);
      }
    }
  }

  return moves;
}

/**
 * Mouvements du cavalier
 */
function getKnightMoves(
  board: (Piece | null)[][],
  from: Position,
  piece: Piece
): Position[] {
  const moves: Position[] = [];
  const knightMoves = [
    { row: -2, col: -1 },
    { row: -2, col: 1 },
    { row: -1, col: -2 },
    { row: -1, col: 2 },
    { row: 1, col: -2 },
    { row: 1, col: 2 },
    { row: 2, col: -1 },
    { row: 2, col: 1 },
  ];

  for (const move of knightMoves) {
    const to = { row: from.row + move.row, col: from.col + move.col };
    if (isValidPosition(to)) {
      const targetPiece = board[to.row][to.col];
      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push(to);
      }
    }
  }

  return moves;
}

/**
 * Mouvements du fou
 */
function getBishopMoves(
  board: (Piece | null)[][],
  from: Position,
  piece: Piece
): Position[] {
  return getLinearMoves(board, from, piece, [
    { row: -1, col: -1 },
    { row: -1, col: 1 },
    { row: 1, col: -1 },
    { row: 1, col: 1 },
  ]);
}

/**
 * Mouvements de la tour
 */
function getRookMoves(
  board: (Piece | null)[][],
  from: Position,
  piece: Piece
): Position[] {
  return getLinearMoves(board, from, piece, [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
  ]);
}

/**
 * Mouvements de la dame
 */
function getQueenMoves(
  board: (Piece | null)[][],
  from: Position,
  piece: Piece
): Position[] {
  return getLinearMoves(board, from, piece, [
    { row: -1, col: -1 },
    { row: -1, col: 0 },
    { row: -1, col: 1 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
    { row: 1, col: -1 },
    { row: 1, col: 0 },
    { row: 1, col: 1 },
  ]);
}

/**
 * Mouvements linéaires (utilisé par fou, tour, dame)
 */
function getLinearMoves(
  board: (Piece | null)[][],
  from: Position,
  piece: Piece,
  directions: { row: number; col: number }[]
): Position[] {
  const moves: Position[] = [];

  for (const direction of directions) {
    let currentRow = from.row + direction.row;
    let currentCol = from.col + direction.col;

    while (isValidPosition({ row: currentRow, col: currentCol })) {
      const targetPiece = board[currentRow][currentCol];

      if (targetPiece === null) {
        moves.push({ row: currentRow, col: currentCol });
      } else {
        if (targetPiece.color !== piece.color) {
          moves.push({ row: currentRow, col: currentCol });
        }
        break;
      }

      currentRow += direction.row;
      currentCol += direction.col;
    }
  }

  return moves;
}

/**
 * Mouvements du roi (incluant le roque)
 */
function getKingMoves(
  board: (Piece | null)[][],
  from: Position,
  piece: Piece,
  gameState: GameState
): Position[] {
  const moves: Position[] = [];

  // Mouvements normaux d'une case
  for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
    for (let colOffset = -1; colOffset <= 1; colOffset++) {
      if (rowOffset === 0 && colOffset === 0) continue;

      const to = { row: from.row + rowOffset, col: from.col + colOffset };
      if (isValidPosition(to)) {
        const targetPiece = board[to.row][to.col];
        if (!targetPiece || targetPiece.color !== piece.color) {
          moves.push(to);
        }
      }
    }
  }

  // Roque
  const kingMoved =
    piece.color === "white"
      ? gameState.whiteKingMoved
      : gameState.blackKingMoved;

  if (!kingMoved && !isKingInCheck(board, piece.color)) {
    if (gameState.isChess960) {
      // Roque Chess960
      moves.push(...getChess960CastlingMoves(board, from, piece, gameState));
    } else {
      // Roque standard
      moves.push(...getStandardCastlingMoves(board, from, piece, gameState));
    }
  }

  return moves;
}

/**
 * Roque standard
 */
function getStandardCastlingMoves(
  board: (Piece | null)[][],
  from: Position,
  piece: Piece,
  gameState: GameState
): Position[] {
  const moves: Position[] = [];
  const row = piece.color === "white" ? 7 : 0;

  // Petit roque (côté roi)
  const kingRookMoved =
    piece.color === "white"
      ? gameState.whiteRookHMoved
      : gameState.blackRookHMoved;
  if (!kingRookMoved) {
    const kingRook = board[row][7];
    if (
      kingRook &&
      kingRook.type === "rook" &&
      kingRook.color === piece.color
    ) {
      if (board[row][5] === null && board[row][6] === null) {
        // Vérifier que les cases traversées ne sont pas attaquées
        const passThrough = { row, col: 5 };
        const destination = { row, col: 6 };
        if (
          !isSquareAttacked(
            board,
            passThrough,
            getOppositeColor(piece.color)
          ) &&
          !isSquareAttacked(board, destination, getOppositeColor(piece.color))
        ) {
          moves.push(destination);
        }
      }
    }
  }

  // Grand roque (côté dame)
  const queenRookMoved =
    piece.color === "white"
      ? gameState.whiteRookAMoved
      : gameState.blackRookAMoved;
  if (!queenRookMoved) {
    const queenRook = board[row][0];
    if (
      queenRook &&
      queenRook.type === "rook" &&
      queenRook.color === piece.color
    ) {
      if (
        board[row][1] === null &&
        board[row][2] === null &&
        board[row][3] === null
      ) {
        // Vérifier que les cases traversées ne sont pas attaquées
        const passThrough = { row, col: 3 };
        const destination = { row, col: 2 };
        if (
          !isSquareAttacked(
            board,
            passThrough,
            getOppositeColor(piece.color)
          ) &&
          !isSquareAttacked(board, destination, getOppositeColor(piece.color))
        ) {
          moves.push(destination);
        }
      }
    }
  }

  return moves;
}

/**
 * Roque Chess960 (Fischer Random)
 * Le roi et la tour finissent toujours sur les mêmes cases qu'en échecs standard :
 * - Petit roque (O-O): roi en g1/g8, tour en f1/f8
 * - Grand roque (O-O-O): roi en c1/c8, tour en d1/d8
 */
function getChess960CastlingMoves(
  board: (Piece | null)[][],
  from: Position,
  piece: Piece,
  gameState: GameState
): Position[] {
  const moves: Position[] = [];
  const row = piece.color === "white" ? 7 : 0;
  const kingInitialCol =
    piece.color === "white"
      ? gameState.whiteKingInitialCol
      : gameState.blackKingInitialCol;

  // Le roi doit être à sa position initiale pour pouvoir roquer
  if (from.col !== kingInitialCol) {
    return moves;
  }

  // Petit roque (côté roi)
  const kingRookMoved =
    piece.color === "white"
      ? gameState.whiteRookHMoved
      : gameState.blackRookHMoved;
  const kingSideRookCol =
    piece.color === "white"
      ? gameState.whiteKingRookInitialCol
      : gameState.blackKingRookInitialCol;

  if (
    !kingRookMoved &&
    kingSideRookCol !== undefined &&
    kingInitialCol !== undefined
  ) {
    const kingRook = board[row][kingSideRookCol];
    if (
      kingRook &&
      kingRook.type === "rook" &&
      kingRook.color === piece.color
    ) {
      // Destinations finales : roi en g (col 6), tour en f (col 5)
      const kingDest = 6;
      const rookDest = 5;

      // Vérifier que toutes les cases entre les positions initiales et finales sont vides
      // (sauf le roi et la tour eux-mêmes)
      const minCol = Math.min(
        kingInitialCol,
        kingSideRookCol,
        kingDest,
        rookDest
      );
      const maxCol = Math.max(
        kingInitialCol,
        kingSideRookCol,
        kingDest,
        rookDest
      );

      let pathClear = true;
      for (let col = minCol; col <= maxCol; col++) {
        if (col !== kingInitialCol && col !== kingSideRookCol) {
          if (board[row][col] !== null) {
            pathClear = false;
            break;
          }
        }
      }

      if (pathClear) {
        // Vérifier que le roi ne traverse pas une case attaquée
        // Le roi doit vérifier toutes les cases entre sa position initiale et finale
        const kingPath = [];
        const start = Math.min(kingInitialCol, kingDest);
        const end = Math.max(kingInitialCol, kingDest);
        for (let col = start; col <= end; col++) {
          kingPath.push({ row, col });
        }

        let canCastle = true;
        for (const pos of kingPath) {
          if (isSquareAttacked(board, pos, getOppositeColor(piece.color))) {
            canCastle = false;
            break;
          }
        }

        if (canCastle) {
          moves.push({ row, col: kingDest });
        }
      }
    }
  }

  // Grand roque (côté dame)
  const queenRookMoved =
    piece.color === "white"
      ? gameState.whiteRookAMoved
      : gameState.blackRookAMoved;
  const queenSideRookCol =
    piece.color === "white"
      ? gameState.whiteQueenRookInitialCol
      : gameState.blackQueenRookInitialCol;

  if (
    !queenRookMoved &&
    queenSideRookCol !== undefined &&
    kingInitialCol !== undefined
  ) {
    const queenRook = board[row][queenSideRookCol];
    if (
      queenRook &&
      queenRook.type === "rook" &&
      queenRook.color === piece.color
    ) {
      // Destinations finales : roi en c (col 2), tour en d (col 3)
      const kingDest = 2;
      const rookDest = 3;

      // Vérifier que toutes les cases entre les positions initiales et finales sont vides
      // (sauf le roi et la tour eux-mêmes)
      const minCol = Math.min(
        kingInitialCol,
        queenSideRookCol,
        kingDest,
        rookDest
      );
      const maxCol = Math.max(
        kingInitialCol,
        queenSideRookCol,
        kingDest,
        rookDest
      );

      let pathClear = true;
      for (let col = minCol; col <= maxCol; col++) {
        if (col !== kingInitialCol && col !== queenSideRookCol) {
          if (board[row][col] !== null) {
            pathClear = false;
            break;
          }
        }
      }

      if (pathClear) {
        // Vérifier que le roi ne traverse pas une case attaquée
        const kingPath = [];
        const start = Math.min(kingInitialCol, kingDest);
        const end = Math.max(kingInitialCol, kingDest);
        for (let col = start; col <= end; col++) {
          kingPath.push({ row, col });
        }

        let canCastle = true;
        for (const pos of kingPath) {
          if (isSquareAttacked(board, pos, getOppositeColor(piece.color))) {
            canCastle = false;
            break;
          }
        }

        if (canCastle) {
          moves.push({ row, col: kingDest });
        }
      }
    }
  }

  return moves;
}

/**
 * Exécute un mouvement et retourne le nouvel état du jeu
 */
export function executeMove(
  gameState: GameState,
  from: Position,
  to: Position,
  promotionPiece?: PieceType
): GameState {
  const newBoard = cloneBoard(gameState.board);
  const piece = newBoard[from.row][from.col];

  if (!piece) return gameState;

  const move: Move = {
    from,
    to,
    piece: { ...piece },
    capturedPiece: newBoard[to.row][to.col]
      ? { ...newBoard[to.row][to.col]! }
      : undefined,
  };

  // Vérifier la prise en passant
  if (
    piece.type === "pawn" &&
    gameState.enPassantTarget &&
    positionsEqual(to, gameState.enPassantTarget)
  ) {
    move.isEnPassant = true;
    const captureRow = piece.color === "white" ? to.row + 1 : to.row - 1;
    move.capturedPiece = newBoard[captureRow][to.col]
      ? { ...newBoard[captureRow][to.col]! }
      : undefined;
    newBoard[captureRow][to.col] = null;
  }

  // Vérifier le roque
  if (piece.type === "king") {
    const row = from.row;
    let isCastlingMove = false;

    if (gameState.isChess960) {
      // En Chess960, le roque est détecté par la case d'arrivée ET le roi doit être à sa position initiale
      const kingInitialCol =
        piece.color === "white"
          ? gameState.whiteKingInitialCol
          : gameState.blackKingInitialCol;
      isCastlingMove =
        from.col === kingInitialCol && (to.col === 6 || to.col === 2);
    } else {
      // En standard, on détecte par la distance
      isCastlingMove = Math.abs(to.col - from.col) === 2;
    }

    if (isCastlingMove) {
      move.isCastling = true;

      if (gameState.isChess960) {
        // Roque Chess960
        if (to.col === 6) {
          // Petit roque: trouver la tour côté roi et la déplacer
          const rookCol =
            piece.color === "white"
              ? gameState.whiteKingRookInitialCol
              : gameState.blackKingRookInitialCol;
          if (rookCol !== undefined) {
            const rook = newBoard[row][rookCol];
            // Déplacer la tour seulement si elle n'est pas déjà à sa position finale
            // et si elle n'est pas sur la même case que le roi
            if (rookCol !== 5 && rookCol !== to.col) {
              newBoard[row][5] = rook;
              newBoard[row][rookCol] = null;
            }
            if (rook) rook.hasMoved = true;
          }
        } else if (to.col === 2) {
          // Grand roque: trouver la tour côté dame et la déplacer
          const rookCol =
            piece.color === "white"
              ? gameState.whiteQueenRookInitialCol
              : gameState.blackQueenRookInitialCol;
          if (rookCol !== undefined) {
            const rook = newBoard[row][rookCol];
            // Déplacer la tour seulement si elle n'est pas déjà à sa position finale
            // et si elle n'est pas sur la même case que le roi
            if (rookCol !== 3 && rookCol !== to.col) {
              newBoard[row][3] = rook;
              newBoard[row][rookCol] = null;
            }
            if (rook) rook.hasMoved = true;
          }
        }
      } else {
        // Roque standard
        if (to.col === 6) {
          // Petit roque
          const rook = newBoard[row][7];
          newBoard[row][5] = rook;
          newBoard[row][7] = null;
          if (rook) rook.hasMoved = true;
        } else if (to.col === 2) {
          // Grand roque
          const rook = newBoard[row][0];
          newBoard[row][3] = rook;
          newBoard[row][0] = null;
          if (rook) rook.hasMoved = true;
        }
      }
    }
  }

  // Vérifier la promotion
  if (piece.type === "pawn" && (to.row === 0 || to.row === 7)) {
    move.isPromotion = true;
    move.promotionPiece = promotionPiece || "queen";
    piece.type = move.promotionPiece;
  }

  // Effectuer le mouvement
  newBoard[to.row][to.col] = piece;
  newBoard[from.row][from.col] = null;
  piece.hasMoved = true;

  // Mettre à jour l'état du jeu
  const newState: GameState = {
    ...gameState,
    board: newBoard,
    currentPlayer: getOppositeColor(gameState.currentPlayer),
    selectedSquare: null,
    validMoves: [],
    moveHistory: [...gameState.moveHistory, move],
    enPassantTarget: null,
    whiteKingMoved:
      gameState.whiteKingMoved ||
      (piece.type === "king" && piece.color === "white"),
    blackKingMoved:
      gameState.blackKingMoved ||
      (piece.type === "king" && piece.color === "black"),
    whiteRookAMoved:
      gameState.whiteRookAMoved ||
      (piece.type === "rook" &&
        piece.color === "white" &&
        (gameState.isChess960
          ? from.col === gameState.whiteQueenRookInitialCol
          : from.col === 0)),
    whiteRookHMoved:
      gameState.whiteRookHMoved ||
      (piece.type === "rook" &&
        piece.color === "white" &&
        (gameState.isChess960
          ? from.col === gameState.whiteKingRookInitialCol
          : from.col === 7)),
    blackRookAMoved:
      gameState.blackRookAMoved ||
      (piece.type === "rook" &&
        piece.color === "black" &&
        (gameState.isChess960
          ? from.col === gameState.blackQueenRookInitialCol
          : from.col === 0)),
    blackRookHMoved:
      gameState.blackRookHMoved ||
      (piece.type === "rook" &&
        piece.color === "black" &&
        (gameState.isChess960
          ? from.col === gameState.blackKingRookInitialCol
          : from.col === 7)),
    halfMoveClock:
      move.capturedPiece || piece.type === "pawn"
        ? 0
        : gameState.halfMoveClock + 1,
  };

  // Définir la cible de prise en passant si un pion avance de deux cases
  if (piece.type === "pawn" && Math.abs(to.row - from.row) === 2) {
    newState.enPassantTarget = {
      row: (from.row + to.row) / 2,
      col: from.col,
    };
  }

  // Vérifier l'échec, l'échec et mat, le pat
  const nextPlayer = newState.currentPlayer;
  newState.isCheck = isKingInCheck(newBoard, nextPlayer);

  // Vérifier si le joueur suivant a des mouvements légaux
  const hasLegalMoves = hasAnyLegalMove(newState);

  if (!hasLegalMoves) {
    if (newState.isCheck) {
      newState.isCheckmate = true;
      newState.gameEndReason = "checkmate";
    } else {
      newState.isStalemate = true;
      newState.gameEndReason = "draw";
    }
  }

  // Vérifier les conditions de nulle
  // Règle des 50 coups
  if (newState.halfMoveClock >= 100) {
    // 50 coups = 100 demi-coups
    newState.isDraw = true;
    newState.gameEndReason = "draw";
  }

  // Matériel insuffisant
  if (hasInsufficientMaterial(newBoard)) {
    newState.isDraw = true;
    newState.gameEndReason = "draw";
  }

  // Répétition de position
  const boardHash = getBoardHash(newBoard, nextPlayer);
  const newPositionHistory = new Map(gameState.positionHistory);
  const occurrences = (newPositionHistory.get(boardHash) || 0) + 1;
  newPositionHistory.set(boardHash, occurrences);
  newState.positionHistory = newPositionHistory;

  if (occurrences >= 3) {
    newState.isDraw = true;
    newState.gameEndReason = "draw";
  }

  return newState;
}

/**
 * Vérifie si le joueur actuel a au moins un mouvement légal
 */
function hasAnyLegalMove(gameState: GameState): boolean {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = gameState.board[row][col];
      if (piece && piece.color === gameState.currentPlayer) {
        const moves = getPossibleMoves(
          gameState.board,
          { row, col },
          gameState
        );
        if (moves.length > 0) {
          return true;
        }
      }
    }
  }
  return false;
}
