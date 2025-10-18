import { Position, Piece, PieceColor } from "@/types/chess";

/**
 * Crée une copie profonde du plateau
 */
export function cloneBoard(board: (Piece | null)[][]): (Piece | null)[][] {
  return board.map((row) => row.map((piece) => (piece ? { ...piece } : null)));
}

/**
 * Vérifie si une position est dans les limites de l'échiquier
 */
export function isValidPosition(pos: Position): boolean {
  return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
}

/**
 * Vérifie si deux positions sont égales
 */
export function positionsEqual(
  pos1: Position | null,
  pos2: Position | null
): boolean {
  if (!pos1 || !pos2) return false;
  return pos1.row === pos2.row && pos1.col === pos2.col;
}

/**
 * Convertit une position en notation algébrique (ex: e4)
 */
export function positionToAlgebraic(pos: Position): string {
  const files = "abcdefgh";
  return `${files[pos.col]}${8 - pos.row}`;
}

/**
 * Convertit une notation algébrique en position
 */
export function algebraicToPosition(notation: string): Position {
  const files = "abcdefgh";
  const col = files.indexOf(notation[0]);
  const row = 8 - parseInt(notation[1]);
  return { row, col };
}

/**
 * Convertit un GameState en notation FEN (Forsyth-Edwards Notation)
 */
export function gameStateToFEN(gameState: {
  board: (Piece | null)[][];
  currentPlayer: PieceColor;
  castlingRights?: {
    white?: { kingSide?: boolean; queenSide?: boolean };
    black?: { kingSide?: boolean; queenSide?: boolean };
  };
  enPassantTarget?: Position | null;
  halfMoveClock?: number;
  fullMoveNumber?: number;
}): string {
  const {
    board,
    currentPlayer,
    castlingRights,
    enPassantTarget,
    halfMoveClock,
    fullMoveNumber,
  } = gameState;

  // 1. Position des pièces
  let fenPosition = "";
  for (let row = 0; row < 8; row++) {
    let emptyCount = 0;
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece) {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          fenPosition += emptyCount;
          emptyCount = 0;
        }

        const pieceChar = getPieceFENChar(piece);
        fenPosition += pieceChar;
      }
    }
    if (emptyCount > 0) {
      fenPosition += emptyCount;
    }
    if (row < 7) {
      fenPosition += "/";
    }
  }

  // 2. Joueur actif
  const activeColor = currentPlayer === "white" ? "w" : "b";

  // 3. Droits de roque
  let castling = "";
  if (castlingRights) {
    if (castlingRights.white?.kingSide) castling += "K";
    if (castlingRights.white?.queenSide) castling += "Q";
    if (castlingRights.black?.kingSide) castling += "k";
    if (castlingRights.black?.queenSide) castling += "q";
  }
  if (castling === "") castling = "-";

  // 4. Case en passant
  let enPassant = "-";
  if (enPassantTarget) {
    enPassant = positionToAlgebraic(enPassantTarget);
  }

  // 5. Compteur de demi-coups
  const halfMoves = halfMoveClock || 0;

  // 6. Numéro du coup complet
  const fullMoves = fullMoveNumber || 1;

  return `${fenPosition} ${activeColor} ${castling} ${enPassant} ${halfMoves} ${fullMoves}`;
}

/**
 * Obtient le caractère FEN pour une pièce
 */
function getPieceFENChar(piece: Piece): string {
  const pieceChars: Record<string, string> = {
    pawn: "p",
    knight: "n",
    bishop: "b",
    rook: "r",
    queen: "q",
    king: "k",
  };

  const char = pieceChars[piece.type] || "p";
  return piece.color === "white" ? char.toUpperCase() : char;
}

/**
 * Génère une clé unique pour une position du plateau (pour détecter les répétitions)
 */
export function getBoardHash(
  board: (Piece | null)[][],
  currentPlayer: PieceColor
): string {
  let hash = currentPlayer === "white" ? "w" : "b";

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        const colorChar = piece.color === "white" ? "W" : "B";
        const typeChar = piece.type[0].toUpperCase();
        hash += `${colorChar}${typeChar}${row}${col}`;
      }
    }
  }

  return hash;
}

/**
 * Obtient la couleur opposée
 */
export function getOppositeColor(color: PieceColor): PieceColor {
  return color === "white" ? "black" : "white";
}

/**
 * Trouve la position du roi d'une couleur donnée
 */
export function findKingPosition(
  board: (Piece | null)[][],
  color: PieceColor
): Position | null {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === "king" && piece.color === color) {
        return { row, col };
      }
    }
  }
  return null;
}

/**
 * Vérifie si une case est attaquée par l'adversaire
 */
export function isSquareAttacked(
  board: (Piece | null)[][],
  position: Position,
  byColor: PieceColor
): boolean {
  // Vérifie toutes les pièces de la couleur adverse
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === byColor) {
        const from = { row, col };
        if (canPieceAttackSquare(board, from, position, piece)) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Vérifie si une pièce peut attaquer une case donnée (sans vérifier les échecs)
 */
function canPieceAttackSquare(
  board: (Piece | null)[][],
  from: Position,
  to: Position,
  piece: Piece
): boolean {
  if (positionsEqual(from, to)) return false;

  const rowDiff = to.row - from.row;
  const colDiff = to.col - from.col;
  const absRowDiff = Math.abs(rowDiff);
  const absColDiff = Math.abs(colDiff);

  switch (piece.type) {
    case "pawn": {
      const direction = piece.color === "white" ? -1 : 1;
      // Les pions attaquent en diagonale
      return rowDiff === direction && absColDiff === 1;
    }

    case "knight": {
      return (
        (absRowDiff === 2 && absColDiff === 1) ||
        (absRowDiff === 1 && absColDiff === 2)
      );
    }

    case "bishop": {
      if (absRowDiff !== absColDiff) return false;
      return isPathClear(board, from, to);
    }

    case "rook": {
      if (rowDiff !== 0 && colDiff !== 0) return false;
      return isPathClear(board, from, to);
    }

    case "queen": {
      if (rowDiff !== 0 && colDiff !== 0 && absRowDiff !== absColDiff)
        return false;
      return isPathClear(board, from, to);
    }

    case "king": {
      return absRowDiff <= 1 && absColDiff <= 1;
    }

    default:
      return false;
  }
}

/**
 * Vérifie si le chemin entre deux positions est libre (pour les pièces qui ne sautent pas)
 */
export function isPathClear(
  board: (Piece | null)[][],
  from: Position,
  to: Position
): boolean {
  const rowDiff = to.row - from.row;
  const colDiff = to.col - from.col;

  const rowStep = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
  const colStep = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);

  let currentRow = from.row + rowStep;
  let currentCol = from.col + colStep;

  while (currentRow !== to.row || currentCol !== to.col) {
    if (board[currentRow][currentCol] !== null) {
      return false;
    }
    currentRow += rowStep;
    currentCol += colStep;
  }

  return true;
}

/**
 * Vérifie si le joueur actuel est en échec
 */
export function isKingInCheck(
  board: (Piece | null)[][],
  color: PieceColor
): boolean {
  const kingPos = findKingPosition(board, color);
  if (!kingPos) return false;

  return isSquareAttacked(board, kingPos, getOppositeColor(color));
}

/**
 * Vérifie s'il y a un matériel insuffisant pour mater
 */
export function hasInsufficientMaterial(board: (Piece | null)[][]): boolean {
  const pieces: Piece[] = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type !== "king") {
        pieces.push(piece);
      }
    }
  }

  // Roi contre roi
  if (pieces.length === 0) return true;

  // Roi + fou contre roi ou roi + cavalier contre roi
  if (pieces.length === 1) {
    const piece = pieces[0];
    return piece.type === "bishop" || piece.type === "knight";
  }

  // Roi + fou contre roi + fou (même couleur de cases)
  if (pieces.length === 2) {
    const [piece1, piece2] = pieces;
    if (piece1.type === "bishop" && piece2.type === "bishop") {
      // Trouver les positions des fous pour vérifier la couleur des cases
      let bishop1Pos: Position | null = null;
      let bishop2Pos: Position | null = null;

      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const piece = board[row][col];
          if (piece && piece.type === "bishop") {
            if (!bishop1Pos) {
              bishop1Pos = { row, col };
            } else {
              bishop2Pos = { row, col };
            }
          }
        }
      }

      if (bishop1Pos && bishop2Pos) {
        const color1 = (bishop1Pos.row + bishop1Pos.col) % 2;
        const color2 = (bishop2Pos.row + bishop2Pos.col) % 2;
        return color1 === color2;
      }
    }
  }

  return false;
}
