"use client";

import { GameState, Position } from "@/types/chess";
import { ChessTheme } from "@/lib/chess-themes";
import { positionsEqual, findKingPosition } from "@/lib/chess-utils";
import ChessSquare from "./ChessSquare";

interface ChessBoardProps {
  gameState: GameState;
  onSquareClick: (position: Position) => void;
  theme: ChessTheme;
}

export default function ChessBoard({
  gameState,
  onSquareClick,
  theme,
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

  return (
    <div className="w-full max-w-2xl aspect-square">
      <div className="grid grid-cols-8 w-full h-full border-4 border-gray-800 shadow-2xl">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const position = { row: rowIndex, col: colIndex };
            const isLight = (rowIndex + colIndex) % 2 === 0;
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

            return (
              <ChessSquare
                key={`${rowIndex}-${colIndex}`}
                position={position}
                piece={piece}
                isLight={isLight}
                isSelected={isSelected}
                isValidMove={isValidMove}
                isLastMove={isLastMove}
                isCheck={isCheckSquare}
                onClick={() => onSquareClick(position)}
                theme={theme}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
