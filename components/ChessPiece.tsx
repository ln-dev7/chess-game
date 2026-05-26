import { Piece } from "@/types/chess";
import Image from "next/image";

interface ChessPieceProps {
  piece: Piece;
  style?: string;
}

/**
 * Retourne le chemin vers le SVG de la pièce selon le style choisi
 */
function getPiecePath(piece: Piece, style: string = "classic"): string {
  return `/pieces/${style}/${piece.color}/${piece.type}.svg`;
}

export default function ChessPiece({ piece, style = "classic" }: ChessPieceProps) {
  const piecePath = getPiecePath(piece, style);

  return (
    <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none p-2">
      <Image
        src={piecePath}
        alt={`${piece.color} ${piece.type}`}
        width={64}
        height={64}
        className="w-[90%] h-[90%] object-contain drop-shadow-md"
        style={{
          filter:
            piece.color === "white"
              ? "drop-shadow(0 1px 2px rgba(0,0,0,0.5))"
              : "none",
        }}
      />
    </div>
  );
}
