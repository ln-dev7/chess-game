import { Piece } from "@/types/chess";

interface ChessPieceProps {
  piece: Piece;
}

/**
 * Symboles Unicode pour les pièces d'échecs
 */
const PIECE_SYMBOLS: Record<string, string> = {
  "white-king": "♔",
  "white-queen": "♕",
  "white-rook": "♖",
  "white-bishop": "♗",
  "white-knight": "♘",
  "white-pawn": "♙",
  "black-king": "♚",
  "black-queen": "♛",
  "black-rook": "♜",
  "black-bishop": "♝",
  "black-knight": "♞",
  "black-pawn": "♟",
};

export default function ChessPiece({ piece }: ChessPieceProps) {
  const symbol = PIECE_SYMBOLS[`${piece.color}-${piece.type}`];

  return (
    <div className="absolute inset-0 flex items-center justify-center text-5xl md:text-6xl select-none pointer-events-none">
      {symbol}
    </div>
  );
}
