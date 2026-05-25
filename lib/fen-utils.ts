import { GameState, Piece, Position } from "@/types/chess";
import { positionToAlgebraic, algebraicToPosition } from "./chess-utils";

const PIECE_FEN_CHAR: Record<string, string> = {
  pawn: "p",
  knight: "n",
  bishop: "b",
  rook: "r",
  queen: "q",
  king: "k",
};

const PROMOTION_FROM_FEN: Record<string, "queen" | "rook" | "bishop" | "knight"> = {
  q: "queen",
  r: "rook",
  b: "bishop",
  n: "knight",
};

function pieceToFENChar(piece: Piece): string {
  const c = PIECE_FEN_CHAR[piece.type] ?? "p";
  return piece.color === "white" ? c.toUpperCase() : c;
}

function boardToFEN(board: (Piece | null)[][]): string {
  const ranks: string[] = [];
  for (let row = 0; row < 8; row++) {
    let rank = "";
    let empty = 0;
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece) {
        empty++;
      } else {
        if (empty > 0) {
          rank += empty;
          empty = 0;
        }
        rank += pieceToFENChar(piece);
      }
    }
    if (empty > 0) rank += empty;
    ranks.push(rank);
  }
  return ranks.join("/");
}

function fileLetter(col: number, color: "white" | "black"): string {
  const letter = "abcdefgh"[col];
  return color === "white" ? letter.toUpperCase() : letter;
}

function findRookAt(
  board: (Piece | null)[][],
  row: number,
  col: number | undefined,
  color: "white" | "black"
): boolean {
  if (col === undefined) return false;
  const piece = board[row][col];
  return !!piece && piece.type === "rook" && piece.color === color && !piece.hasMoved;
}

function buildCastlingField(state: GameState): string {
  const { board, isChess960 } = state;
  let castling = "";

  if (isChess960) {
    // Shredder-FEN: file letter of the rook still eligible for castling
    if (!state.whiteKingMoved) {
      if (findRookAt(board, 7, state.whiteKingRookInitialCol, "white")) {
        castling += fileLetter(state.whiteKingRookInitialCol!, "white");
      }
      if (findRookAt(board, 7, state.whiteQueenRookInitialCol, "white")) {
        castling += fileLetter(state.whiteQueenRookInitialCol!, "white");
      }
    }
    if (!state.blackKingMoved) {
      if (findRookAt(board, 0, state.blackKingRookInitialCol, "black")) {
        castling += fileLetter(state.blackKingRookInitialCol!, "black");
      }
      if (findRookAt(board, 0, state.blackQueenRookInitialCol, "black")) {
        castling += fileLetter(state.blackQueenRookInitialCol!, "black");
      }
    }
  } else {
    // Standard FEN: KQkq
    if (!state.whiteKingMoved && !state.whiteRookHMoved) castling += "K";
    if (!state.whiteKingMoved && !state.whiteRookAMoved) castling += "Q";
    if (!state.blackKingMoved && !state.blackRookHMoved) castling += "k";
    if (!state.blackKingMoved && !state.blackRookAMoved) castling += "q";
  }

  return castling || "-";
}

/**
 * Convert a GameState to a Stockfish-compatible FEN string.
 * Uses Shredder-FEN for Chess960 (rook file letters in the castling field).
 */
export function gameStateToStockfishFEN(state: GameState): string {
  const position = boardToFEN(state.board);
  const activeColor = state.currentPlayer === "white" ? "w" : "b";
  const castling = buildCastlingField(state);
  const enPassant = state.enPassantTarget
    ? positionToAlgebraic(state.enPassantTarget)
    : "-";
  const halfmove = state.halfMoveClock ?? 0;
  const fullmove = Math.floor(state.moveHistory.length / 2) + 1;
  return `${position} ${activeColor} ${castling} ${enPassant} ${halfmove} ${fullmove}`;
}

export interface ParsedUCIMove {
  from: Position;
  to: Position;
  promotionPiece?: "queen" | "rook" | "bishop" | "knight";
}

/**
 * Parse a UCI move string (e.g. "e2e4", "e7e8q") into board positions.
 * For Chess960 castling, Stockfish emits king-takes-own-rook (e.g. "e1h1");
 * the caller can detect this from the piece types on the squares.
 */
export function parseUCIMove(uci: string): ParsedUCIMove | null {
  if (uci.length < 4) return null;
  const from = algebraicToPosition(uci.slice(0, 2));
  const to = algebraicToPosition(uci.slice(2, 4));
  if (
    from.row < 0 ||
    from.row > 7 ||
    from.col < 0 ||
    from.col > 7 ||
    to.row < 0 ||
    to.row > 7 ||
    to.col < 0 ||
    to.col > 7
  ) {
    return null;
  }
  const promotion = uci.length >= 5 ? PROMOTION_FROM_FEN[uci[4]] : undefined;
  return { from, to, promotionPiece: promotion };
}
