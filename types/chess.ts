export type PieceType =
  | "pawn"
  | "knight"
  | "bishop"
  | "rook"
  | "queen"
  | "king";
export type PieceColor = "white" | "black";

export interface Position {
  row: number;
  col: number;
}

export interface Piece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
}

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  capturedPiece?: Piece;
  isEnPassant?: boolean;
  isCastling?: boolean;
  isPromotion?: boolean;
  promotionPiece?: PieceType;
}

export type GameEndReason = "checkmate" | "timeout" | "resignation" | "draw" | null;

export interface GameState {
  board: (Piece | null)[][];
  currentPlayer: PieceColor;
  selectedSquare: Position | null;
  validMoves: Position[];
  moveHistory: Move[];
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  gameEndReason: GameEndReason; // Raison de fin de partie
  enPassantTarget: Position | null;
  whiteKingMoved: boolean;
  blackKingMoved: boolean;
  whiteRookAMoved: boolean;
  whiteRookHMoved: boolean;
  blackRookAMoved: boolean;
  blackRookHMoved: boolean;
  halfMoveClock: number; // Pour la règle des 50 coups
  positionHistory: Map<string, number>; // Pour la répétition de position
}

export type GameStatus =
  | "playing"
  | "check"
  | "checkmate"
  | "stalemate"
  | "draw";
