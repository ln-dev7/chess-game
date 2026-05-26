"use client";

import { motion } from "motion/react";
import { Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { GameState, Position, PieceColor } from "@/types/chess";
import { findKingPosition } from "@/lib/chess-utils";

interface CheckmateAnimationProps {
  gameState: GameState;
  isRotated: boolean;
}

const REVEAL_DELAY_MS = 400;

function getDisplayCoords(pos: Position, isRotated: boolean) {
  return isRotated
    ? { x: (7 - pos.col) * 12.5, y: (7 - pos.row) * 12.5 }
    : { x: pos.col * 12.5, y: pos.row * 12.5 };
}

/**
 * Overlay de fin de partie : pose une couronne sur chaque roi.
 * - Vert  : vainqueur
 * - Rouge : perdant
 * - Gris  : les deux rois en cas de nulle / pat
 * Rendu à l'intérieur de la grille du board, donc suit la rotation
 * et la taille de l'échiquier.
 */
export default function CheckmateAnimation({
  gameState,
  isRotated,
}: CheckmateAnimationProps) {
  const isGameOver =
    gameState.isCheckmate || gameState.isStalemate || gameState.isDraw;

  // Court délai avant d'afficher les couronnes pour laisser respirer le coup final.
  const [reveal, setReveal] = useState(false);
  useEffect(() => {
    if (!isGameOver) {
      setReveal(false);
      return;
    }
    const t = setTimeout(() => setReveal(true), REVEAL_DELAY_MS);
    return () => clearTimeout(t);
  }, [isGameOver]);

  if (!isGameOver || !reveal) return null;

  const whiteKing = findKingPosition(gameState.board, "white");
  const blackKing = findKingPosition(gameState.board, "black");

  const isDraw =
    gameState.isStalemate ||
    gameState.isDraw ||
    gameState.gameEndReason === "draw";
  const winnerColor: PieceColor | null = isDraw
    ? null
    : gameState.currentPlayer === "white"
      ? "black"
      : "white";

  function renderBadge(color: PieceColor, position: Position | null) {
    if (!position) return null;
    const { x, y } = getDisplayCoords(position, isRotated);
    const isWinner = winnerColor === color;
    const bgClass = isDraw
      ? "bg-gray-500"
      : isWinner
        ? "bg-emerald-500"
        : "bg-red-500";

    return (
      <motion.div
        key={color}
        className="absolute z-40 pointer-events-none"
        style={{
          width: "12.5%",
          height: "12.5%",
          left: `${x}%`,
          top: `${y}%`,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 18,
          delay: isWinner ? 0.1 : 0.25,
        }}
      >
        <div
          className={`absolute -top-1 -right-1 ${bgClass} rounded-full shadow-lg ring-2 ring-white flex items-center justify-center w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7`}
        >
          <Crown
            className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-white"
            strokeWidth={2.5}
            fill="currentColor"
          />
        </div>
      </motion.div>
    );
  }

  return (
    <>
      {renderBadge("white", whiteKing)}
      {renderBadge("black", blackKing)}
    </>
  );
}
