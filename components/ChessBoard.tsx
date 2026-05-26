"use client";

import { useEffect, useState } from "react";
import { GameState, PieceColor, Position, Piece } from "@/types/chess";
import { ChessTheme } from "@/lib/chess-themes";
import { positionsEqual, findKingPosition } from "@/lib/chess-utils";
import ChessSquare, { EndGameRole } from "./ChessSquare";
import AnimatedPiece from "./AnimatedPiece";
import CheckmateAnimation from "./CheckmateAnimation";

const END_GAME_REVEAL_DELAY_MS = 400;

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
  isAnimating?: boolean;
  onAnimationComplete?: () => void;
  pieceStyle?: string;
  showCoordinates?: boolean;
  isRotated?: boolean;
  animationDuration?: number;
  showEndGameOverlay?: boolean;
}

export default function ChessBoard({
  gameState,
  onSquareClick,
  theme,
  animatingMove,
  isAnimating = !!animatingMove,
  onAnimationComplete,
  pieceStyle = "classic",
  showCoordinates = true,
  isRotated = false,
  animationDuration = 300,
  showEndGameOverlay = false,
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

  // Rôle de chaque roi en fin de partie (pour colorer la case)
  const isGameOver =
    gameState.isCheckmate || gameState.isStalemate || gameState.isDraw;

  // Délai partagé entre la couleur de case et l'apparition des couronnes,
  // pour qu'on voie d'abord le coup final se terminer.
  const [endGameRevealed, setEndGameRevealed] = useState(false);
  useEffect(() => {
    if (!isGameOver) {
      setEndGameRevealed(false);
      return;
    }
    const t = setTimeout(
      () => setEndGameRevealed(true),
      END_GAME_REVEAL_DELAY_MS
    );
    return () => clearTimeout(t);
  }, [isGameOver]);
  const isDraw =
    gameState.isStalemate ||
    gameState.isDraw ||
    gameState.gameEndReason === "draw";
  const winnerColor: PieceColor | null =
    !isGameOver || isDraw
      ? null
      : currentPlayer === "white"
        ? "black"
        : "white";
  const whiteKingPos = isGameOver ? findKingPosition(board, "white") : null;
  const blackKingPos = isGameOver ? findKingPosition(board, "black") : null;

  function getEndGameRole(position: Position): EndGameRole | null {
    if (!isGameOver) return null;
    const isWhiteKingSq =
      whiteKingPos !== null && positionsEqual(position, whiteKingPos);
    const isBlackKingSq =
      blackKingPos !== null && positionsEqual(position, blackKingPos);
    if (!isWhiteKingSq && !isBlackKingSq) return null;
    if (isDraw) return "draw";
    const kingColor: PieceColor = isWhiteKingSq ? "white" : "black";
    return kingColor === winnerColor ? "winner" : "loser";
  }

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
            // Le masquage cesse dès que isAnimating passe à false, pour que la
            // pièce d'arrivée se monte AVANT que l'AnimatedPiece ne se démonte.
            const isAnimatingFrom =
              animatingMove && isAnimating
                ? positionsEqual(position, animatingMove.from)
                : false;
            const isAnimatingTo =
              animatingMove && isAnimating
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
                endGameRole={
                  showEndGameOverlay && endGameRevealed
                    ? getEndGameRole(position)
                    : null
                }
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

        {/* Couronnes vainqueur / perdant / nulle à la fin de la partie */}
        {showEndGameOverlay && endGameRevealed && (
          <CheckmateAnimation gameState={gameState} isRotated={isRotated} />
        )}
      </div>
    </div>
  );
}
