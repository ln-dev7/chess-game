"use client";

import { motion } from "motion/react";
import { Piece, Position } from "@/types/chess";
import Image from "next/image";
import { ANIMATION_DURATION_MS } from "@/lib/constants";

interface AnimatedPieceProps {
  piece: Piece;
  from: Position;
  to: Position;
  onComplete: () => void;
  style?: string;
}

/**
 * Retourne le chemin vers le SVG de la pièce selon le style choisi
 */
function getPiecePath(piece: Piece, style: string = "classic"): string {
  return `/pieces/${style}/${piece.color}/${piece.type}.svg`;
}

export default function AnimatedPiece({
  piece,
  from,
  to,
  onComplete,
  style = "classic",
}: AnimatedPieceProps) {
  const piecePath = getPiecePath(piece, style);

  // Calculer les positions en pourcentage (chaque case = 12.5% de l'échiquier)
  const fromX = from.col * 12.5;
  const fromY = from.row * 12.5;
  const toX = to.col * 12.5;
  const toY = to.row * 12.5;

  return (
    <motion.div
      className="absolute flex items-center justify-center select-none pointer-events-none z-50 p-2"
      style={{
        width: "12.5%",
        height: "12.5%",
        left: `${fromX}%`,
        top: `${fromY}%`,
        willChange: "left, top",
      }}
      animate={{
        left: `${toX}%`,
        top: `${toY}%`,
      }}
      transition={{
        duration: ANIMATION_DURATION_MS / 1000, // Convertir ms en secondes pour motion
        ease: [0.4, 0, 0.2, 1], // Cubic bezier optimisé pour mobile
        type: "tween", // Plus performant que spring sur mobile
      }}
      onAnimationComplete={onComplete}
    >
      <Image
        src={piecePath}
        alt={`${piece.color} ${piece.type}`}
        width={64}
        height={64}
        priority
        className="w-[90%] h-[90%] object-contain drop-shadow-md"
        style={{
          filter:
            piece.color === "white"
              ? "drop-shadow(0 1px 2px rgba(0,0,0,0.5))"
              : "none",
        }}
      />
    </motion.div>
  );
}
