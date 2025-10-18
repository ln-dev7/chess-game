"use client";

import { motion } from "motion/react";
import { Piece, Position } from "@/types/chess";

// Durée de l'animation en millisecondes
const ANIMATION_DURATION_MS = 300;

interface AnimatedPieceProps {
  piece: Piece;
  from: Position;
  to: Position;
  onComplete: () => void;
}

/**
 * Symboles Unicode pour les pièces d'échecs
 */
const PIECE_SYMBOLS: Record<string, string> = {
  "white-king": "♔",
  "white-queen": "♕",
  "white-rook": "♖",
  "white-bishop": "♗",
  "white-knight": "♘",
  "white-pawn": "♙",
  "black-king": "♚",
  "black-queen": "♛",
  "black-rook": "♜",
  "black-bishop": "♝",
  "black-knight": "♞",
  "black-pawn": "♟",
};

export default function AnimatedPiece({
  piece,
  from,
  to,
  onComplete,
}: AnimatedPieceProps) {
  const symbol = PIECE_SYMBOLS[`${piece.color}-${piece.type}`];

  // Calculer les positions en pourcentage (chaque case = 12.5% de l'échiquier)
  const fromX = from.col * 12.5;
  const fromY = from.row * 12.5;
  const toX = to.col * 12.5;
  const toY = to.row * 12.5;

  return (
    <motion.div
      className="absolute flex items-center justify-center text-5xl md:text-6xl select-none pointer-events-none z-50"
      style={{
        width: "12.5%",
        height: "12.5%",
        left: `${fromX}%`,
        top: `${fromY}%`,
      }}
      animate={{
        left: `${toX}%`,
        top: `${toY}%`,
      }}
      transition={{
        duration: ANIMATION_DURATION_MS / 1000, // Convertir ms en secondes pour motion
        ease: "easeInOut",
      }}
      onAnimationComplete={onComplete}
    >
      {symbol}
    </motion.div>
  );
}
