import { Position, Piece } from "@/types/chess";
import ChessPiece from "./ChessPiece";

interface ChessSquareProps {
  position: Position;
  piece: Piece | null;
  isLight: boolean;
  isSelected: boolean;
  isValidMove: boolean;
  isLastMove: boolean;
  isCheck: boolean;
  onClick: () => void;
}

export default function ChessSquare({
  position,
  piece,
  isLight,
  isSelected,
  isValidMove,
  isLastMove,
  isCheck,
  onClick,
}: ChessSquareProps) {
  const bgColor = isLight ? "bg-[#ebecd0]" : "bg-[#739552]";
  const selectedColor = isLight ? "bg-[#f6f669]" : "bg-[#baca44]";
  const lastMoveColor = isLight ? "bg-[#cdd26a]" : "bg-[#aaa23a]";
  const checkColor = "bg-red-400";

  let finalBgColor = bgColor;
  if (isCheck) {
    finalBgColor = checkColor;
  } else if (isSelected) {
    finalBgColor = selectedColor;
  } else if (isLastMove) {
    finalBgColor = lastMoveColor;
  }

  const files = "abcdefgh";
  const fileLabel = files[position.col];
  const rankLabel = 8 - position.row;

  return (
    <div
      className={`relative aspect-square ${finalBgColor} cursor-pointer hover:opacity-80 transition-opacity`}
      onClick={onClick}
    >
      {/* Coordonnées */}
      {position.col === 0 && (
        <div
          className={`absolute top-0.5 left-0.5 text-xs font-semibold ${
            isLight ? "text-[#739552]" : "text-[#ebecd0]"
          }`}
        >
          {rankLabel}
        </div>
      )}
      {position.row === 7 && (
        <div
          className={`absolute bottom-0.5 right-0.5 text-xs font-semibold ${
            isLight ? "text-[#739552]" : "text-[#ebecd0]"
          }`}
        >
          {fileLabel}
        </div>
      )}

      {/* Indicateur de mouvement valide */}
      {isValidMove && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {piece ? (
            <div className="w-full h-full border-4 border-gray-800 opacity-30 rounded-full" />
          ) : (
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-800 opacity-30 rounded-full" />
          )}
        </div>
      )}

      {/* Pièce */}
      {piece && <ChessPiece piece={piece} />}
    </div>
  );
}
