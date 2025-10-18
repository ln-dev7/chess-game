import { Position, Piece } from "@/types/chess";
import { ChessTheme } from "@/lib/chess-themes";
import ChessPiece from "./ChessPiece";

interface AnimatingMove {
  from: Position;
  to: Position;
}

interface ChessSquareProps {
  position: Position;
  piece: Piece | null;
  isLight: boolean;
  isSelected: boolean;
  isValidMove: boolean;
  isLastMove: boolean;
  isCheck: boolean;
  onClick: () => void;
  theme: ChessTheme;
  isAnimatingFrom?: boolean;
  animatingMove?: AnimatingMove | null;
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
  theme,
  isAnimatingFrom,
}: ChessSquareProps) {
  // Déterminer la couleur de fond selon l'état
  let backgroundColor: string;

  if (isCheck) {
    backgroundColor = "#ef4444"; // Rouge pour l'échec
  } else if (isSelected) {
    backgroundColor = isLight ? theme.selectedLight : theme.selectedDark;
  } else if (isLastMove) {
    backgroundColor = isLight ? theme.lastMoveLight : theme.lastMoveDark;
  } else {
    backgroundColor = isLight ? theme.lightSquare : theme.darkSquare;
  }

  const files = "abcdefgh";
  const fileLabel = files[position.col];
  const rankLabel = 8 - position.row;

  // Déterminer la couleur du texte (coordonnées) pour assurer la lisibilité
  const textColor = isLight ? "text-gray-700" : "text-gray-100";

  return (
    <div
      className="relative aspect-square cursor-pointer hover:opacity-80 transition-opacity"
      style={{ backgroundColor }}
      onClick={onClick}
    >
      {/* Coordonnées */}
      {position.col === 0 && (
        <div
          className={`absolute top-0.5 left-0.5 text-xs font-semibold ${textColor} opacity-70`}
        >
          {rankLabel}
        </div>
      )}
      {position.row === 7 && (
        <div
          className={`absolute bottom-0.5 right-0.5 text-xs font-semibold ${textColor} opacity-70`}
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

      {/* Pièce - masquée si elle est en cours d'animation */}
      {piece && !isAnimatingFrom && <ChessPiece piece={piece} />}
    </div>
  );
}
