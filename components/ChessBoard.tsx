"use client";

import { GameState, Position, Piece } from "@/types/chess";
import { ChessTheme } from "@/lib/chess-themes";
import { positionsEqual, findKingPosition } from "@/lib/chess-utils";
import ChessSquare from "./ChessSquare";
import AnimatedPiece from "./AnimatedPiece";

interface AnimatingMove {
  from: Position;
  to: Position;
  piece: Piece;
}

interface ChessBoardProps {
  gameState: GameState;
  onSquareClick: (position: Position) => void;
  theme: ChessTheme;
  animatingMove?: AnimatingMove | null;
  onAnimationComplete?: () => void;
  pieceStyle?: string;
  showCoordinates?: boolean;
  isRotated?: boolean;
  animationDuration?: number;
}

export default function ChessBoard({
  gameState,
  onSquareClick,
  theme,
  animatingMove,
  onAnimationComplete,
  pieceStyle = "classic",
  showCoordinates = true,
  isRotated = false,
  animationDuration = 300,
}: ChessBoardProps) {
  const {
    board,
    selectedSquare,
    validMoves,
    moveHistory,
    isCheck,
    currentPlayer,
  } = gameState;

  const lastMove =
    moveHistory.length > 0 ? moveHistory[moveHistory.length - 1] : null;
  const kingInCheckPos = isCheck
    ? findKingPosition(board, currentPlayer)
    : null;

  // Créer une copie du plateau et potentiellement le retourner
  const displayBoard = isRotated
    ? [...board].reverse().map((row) => [...row].reverse())
    : board;

  return (
    <div className="w-full max-w-2xl">
      <div
        id="chess-board-export"
        className="grid grid-cols-8 aspect-square w-full border-0 border-gray-800 shadow-2xl relative"
        style={{ transform: "translateZ(0)" }}
      >
        {displayBoard.map((row, displayRowIndex) =>
          row.map((piece, displayColIndex) => {
            // Calculer la position réelle en tenant compte de la rotation
            const realRow = isRotated ? 7 - displayRowIndex : displayRowIndex;
            const realCol = isRotated ? 7 - displayColIndex : displayColIndex;
            const position = { row: realRow, col: realCol };
            const isLight = (realRow + realCol) % 2 === 0;
            const isSelected = selectedSquare
              ? positionsEqual(position, selectedSquare)
              : false;
            const isValidMove = validMoves.some((move) =>
              positionsEqual(move, position)
            );
            const isLastMove = lastMove
              ? positionsEqual(position, lastMove.from) ||
                positionsEqual(position, lastMove.to)
              : false;
            const isCheckSquare = kingInCheckPos
              ? positionsEqual(position, kingInCheckPos)
              : false;

            // Vérifier si cette case est la source ou la destination de l'animation
            const isAnimatingFrom = animatingMove
              ? positionsEqual(position, animatingMove.from)
              : false;
            const isAnimatingTo = animatingMove
              ? positionsEqual(position, animatingMove.to)
              : false;

            return (
              <ChessSquare
                key={`${realRow}-${realCol}`}
                position={position}
                piece={piece}
                isLight={isLight}
                isSelected={isSelected}
                isValidMove={isValidMove}
                isLastMove={isLastMove}
                isCheck={isCheckSquare}
                onClick={() => onSquareClick(position)}
                theme={theme}
                isAnimatingFrom={isAnimatingFrom}
                isAnimatingTo={isAnimatingTo}
                animatingMove={animatingMove}
                pieceStyle={pieceStyle}
                showCoordinates={showCoordinates}
                isRotated={isRotated}
              />
            );
          })
        )}

        {/* Pièce animée qui glisse au-dessus de l'échiquier */}
        {animatingMove && onAnimationComplete && (
          <AnimatedPiece
            piece={animatingMove.piece}
            from={animatingMove.from}
            to={animatingMove.to}
            onComplete={onAnimationComplete}
            style={pieceStyle}
            animationDuration={animationDuration}
            isRotated={isRotated}
          />
        )}
      </div>
    </div>
  );
}
