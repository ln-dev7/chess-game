"use client";

import { PieceType, PieceColor } from "@/types/chess";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PromotionDialogProps {
  isOpen: boolean;
  color: PieceColor;
  onSelect: (pieceType: PieceType) => void;
}

const PIECE_SYMBOLS: Record<string, string> = {
  "white-queen": "♕",
  "white-rook": "♖",
  "white-bishop": "♗",
  "white-knight": "♘",
  "black-queen": "♛",
  "black-rook": "♜",
  "black-bishop": "♝",
  "black-knight": "♞",
};

export default function PromotionDialog({
  isOpen,
  color,
  onSelect,
}: PromotionDialogProps) {
  const pieces: PieceType[] = ["queen", "rook", "bishop", "knight"];

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choisir une pièce pour la promotion</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4">
          {pieces.map((pieceType) => (
            <button
              key={pieceType}
              onClick={() => onSelect(pieceType)}
              className="aspect-square flex items-center justify-center text-6xl hover:bg-gray-100 rounded-lg transition-colors border-2 border-gray-300 hover:border-gray-500"
            >
              {PIECE_SYMBOLS[`${color}-${pieceType}`]}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
