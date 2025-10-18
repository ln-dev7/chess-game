"use client";

import Image from "next/image";
import { Move, Piece, PieceColor } from "@/types/chess";

interface CapturedPiecesProps {
  moveHistory: Move[];
  color: PieceColor;
  pieceStyle: string;
}

// Valeurs matérielles des pièces
const PIECE_VALUES: Record<string, number> = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 9,
  king: 0, // Le roi n'a pas de valeur matérielle
};

export default function CapturedPieces({
  moveHistory,
  color,
  pieceStyle,
}: CapturedPiecesProps) {
  // Extraire les pièces capturées par chaque camp
  const capturedByWhite: Piece[] = [];
  const capturedByBlack: Piece[] = [];

  moveHistory.forEach((move) => {
    if (move.capturedPiece) {
      if (move.piece.color === "white") {
        // Les blancs ont capturé une pièce noire
        capturedByWhite.push(move.capturedPiece);
      } else {
        // Les noirs ont capturé une pièce blanche
        capturedByBlack.push(move.capturedPiece);
      }
    }
  });

  // Calculer la valeur matérielle totale
  const whiteMaterialValue = capturedByWhite.reduce(
    (total, piece) => total + PIECE_VALUES[piece.type],
    0
  );
  const blackMaterialValue = capturedByBlack.reduce(
    (total, piece) => total + PIECE_VALUES[piece.type],
    0
  );

  // Déterminer l'avantage matériel
  const materialAdvantage =
    color === "white"
      ? whiteMaterialValue - blackMaterialValue
      : blackMaterialValue - whiteMaterialValue;

  const capturedPieces = color === "white" ? capturedByWhite : capturedByBlack;

  // Trier les pièces capturées par valeur (du plus faible au plus fort)
  const sortedCapturedPieces = [...capturedPieces].sort(
    (a, b) => PIECE_VALUES[a.type] - PIECE_VALUES[b.type]
  );

  return (
    <div className="flex items-center gap-1.5 md:gap-2 min-h-[24px] md:min-h-[32px]">
      <div className="flex items-center gap-0.5 md:gap-1 flex-wrap">
        {sortedCapturedPieces.map((piece, index) => (
          <div
            key={index}
            className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center opacity-70 relative"
          >
            <Image
              src={`/pieces/${pieceStyle}/${piece.color}/${piece.type}.svg`}
              alt={`${piece.color} ${piece.type}`}
              fill
              className="object-contain"
            />
          </div>
        ))}
      </div>
      {materialAdvantage > 0 && (
        <span className="text-xs md:text-sm font-semibold text-green-600">
          +{materialAdvantage}
        </span>
      )}
    </div>
  );
}
