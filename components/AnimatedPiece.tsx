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
 * Convertit une position logique en index de case affichée selon la rotation.
 * Les valeurs retournées sont en "cases" (0–7), utilisées pour translater la
 * pièce en pourcentage de sa propre taille (1 case = translate de 100%).
 */
function getDisplayPosition(
  position: Position,
  isRotated: boolean
): { x: number; y: number } {
  if (isRotated) {
    return { x: 7 - position.col, y: 7 - position.row };
  }
  return { x: position.col, y: position.row };
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
        left: 0,
        top: 0,
        willChange: "transform",
      }}
      initial={{ x: `${fromPos.x * 100}%`, y: `${fromPos.y * 100}%` }}
      animate={{ x: `${toPos.x * 100}%`, y: `${toPos.y * 100}%` }}
      transition={{
        duration: animationDuration / 1000,
        ease: [0.25, 0.1, 0.25, 1],
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
