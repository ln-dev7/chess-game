"use client";

import { forwardRef, useState, useEffect } from "react";
import { X } from "lucide-react";
import ChessBoard from "./ChessBoard";
import CheckmateAnimation from "./CheckmateAnimation";
import CapturedPieces from "./CapturedPieces";
import { GameState, Position, Piece } from "@/types/chess";
import { ChessTheme } from "@/lib/chess-themes";

interface AnimatingMove {
  from: Position;
  to: Position;
  piece: Piece;
}

interface BoardContainerProps {
  gameState: GameState;
  onSquareClick: (position: Position) => void;
  theme: ChessTheme;
  animatingMove: AnimatingMove | null;
  onAnimationComplete: () => void;
  pieceStyle: string;
  showCoordinates: boolean;
  isRotated: boolean;
  animationDuration: number;
  showCheckmateAnimation: boolean;
  onCheckmateAnimationComplete: () => void;
}

const BoardContainer = forwardRef<HTMLDivElement, BoardContainerProps>(
  (
    {
      gameState,
      onSquareClick,
      theme,
      animatingMove,
      onAnimationComplete,
      pieceStyle,
      showCoordinates,
      isRotated,
      animationDuration,
      showCheckmateAnimation,
      onCheckmateAnimationComplete,
    },
    ref
  ) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };

      document.addEventListener("fullscreenchange", handleFullscreenChange);
      return () => {
        document.removeEventListener(
          "fullscreenchange",
          handleFullscreenChange
        );
      };
    }, []);

    const handleExitFullscreen = () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };

    return (
      <div
        ref={ref}
        className="flex justify-center items-start relative"
        style={{
          backgroundColor: isFullscreen ? "#1a1a1a" : "transparent",
          minHeight: isFullscreen ? "100vh" : "auto",
        }}
      >
        <div className="w-full flex flex-col items-center justify-start gap-3">
          <div className="w-full max-w-[600px] h-8 md:h-10 px-2 flex items-start gap-2 md:gap-4">
            <div className="flex-1">
              <CapturedPieces
                moveHistory={gameState.moveHistory}
                color="white"
                pieceStyle={pieceStyle}
              />
            </div>
            <div className="flex-1">
              <CapturedPieces
                moveHistory={gameState.moveHistory}
                color="black"
                pieceStyle={pieceStyle}
              />
            </div>
          </div>

          <div
            id="chess-board"
            className={`w-full flex justify-center ${
              isFullscreen ? "items-center" : ""
            }`}
            style={{
              maxWidth: isFullscreen ? "min(100vh, 100vw)" : "100%",
              aspectRatio: "1",
              padding: isFullscreen ? "1rem" : "0",
            }}
          >
            <ChessBoard
              gameState={gameState}
              onSquareClick={onSquareClick}
              theme={theme}
              animatingMove={animatingMove}
              onAnimationComplete={onAnimationComplete}
              pieceStyle={pieceStyle}
              showCoordinates={showCoordinates}
              isRotated={isRotated}
              animationDuration={animationDuration}
            />
          </div>
        </div>

        {/* Bouton pour quitter le plein écran */}
        {isFullscreen && (
          <button
            onClick={handleExitFullscreen}
            className="absolute top-4 right-4 p-3 bg-white/95 hover:bg-white border border-gray-300 rounded-lg transition-colors shadow-lg z-50"
            title="Quitter le plein écran (Échap)"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        )}

        {/* Animation d'échec et mat en plein écran */}
        {isFullscreen && showCheckmateAnimation && (
          <CheckmateAnimation
            loserColor={gameState.currentPlayer === "white" ? "black" : "white"}
            pieceStyle={pieceStyle}
            onComplete={onCheckmateAnimationComplete}
            endReason={gameState.gameEndReason || "checkmate"}
          />
        )}
      </div>
    );
  }
);

BoardContainer.displayName = "BoardContainer";

export default BoardContainer;
