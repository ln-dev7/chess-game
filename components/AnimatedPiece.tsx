"use client";

import { motion } from "motion/react";
import { Piece, Position } from "@/types/chess";
import Image from "next/image";

interface AnimatedPieceProps {
  piece: Piece;
  from: Position;
  to: Position;
  onComplete: () => void;
  style?: string;
  animationDuration?: number;
  isRotated?: boolean;
}

/**
 * Retourne le chemin vers le SVG de la pièce selon le style choisi
 */
function getPiecePath(piece: Piece, style: string = "classic"): string {
  return `/pieces/${style}/${piece.color}/${piece.type}.svg`;
}

/**
 * Convertit une position logique en position d'affichage selon la rotation
 */
function getDisplayPosition(
  position: Position,
  isRotated: boolean
): { x: number; y: number } {
  if (isRotated) {
    // Si l'échiquier est tourné, inverser les coordonnées
    return {
      x: (7 - position.col) * 12.5,
      y: (7 - position.row) * 12.5,
    };
  }
  // Position normale
  return {
    x: position.col * 12.5,
    y: position.row * 12.5,
  };
}

export default function AnimatedPiece({
  piece,
  from,
  to,
  onComplete,
  style = "classic",
  animationDuration = 300,
  isRotated = false,
}: AnimatedPieceProps) {
  const piecePath = getPiecePath(piece, style);

  // Calculer les positions en pourcentage selon la rotation
  const fromPos = getDisplayPosition(from, isRotated);
  const toPos = getDisplayPosition(to, isRotated);

  // Si l'animation est instantanée, appeler onComplete immédiatement
  if (animationDuration === 0) {
    setTimeout(onComplete, 0);
    return null;
  }

  return (
    <motion.div
      className="absolute flex items-center justify-center select-none pointer-events-none z-50 p-2"
      style={{
        width: "12.5%",
        height: "12.5%",
        left: `${fromPos.x}%`,
        top: `${fromPos.y}%`,
        transform: "translateZ(0)", // Force GPU acceleration sur mobile
        backfaceVisibility: "hidden", // Améliore le rendu sur mobile
      }}
      animate={{
        left: `${toPos.x}%`,
        top: `${toPos.y}%`,
      }}
      transition={{
        duration: animationDuration / 1000,
        ease: [0.25, 0.1, 0.25, 1], // Ease-in-out optimisé pour mobile
        type: "tween",
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
