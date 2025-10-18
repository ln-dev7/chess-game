"use client";

import { useTranslations } from "next-intl";
import { PieceType, PieceColor } from "@/types/chess";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PromotionDialogProps {
  isOpen: boolean;
  color: PieceColor;
  onSelect: (pieceType: PieceType) => void;
  pieceStyle?: string;
}

/**
 * Retourne le chemin vers le SVG de la pièce selon le style choisi
 */
function getPiecePath(
  color: PieceColor,
  type: PieceType,
  style: string = "classic"
): string {
  return `/pieces/${style}/${color}/${type}.svg`;
}

export default function PromotionDialog({
  isOpen,
  color,
  onSelect,
  pieceStyle = "classic",
}: PromotionDialogProps) {
  const t = useTranslations("promotion");
  const pieces: PieceType[] = ["queen", "rook", "bishop", "knight"];

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("selectPiece")}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4">
          {pieces.map((pieceType) => (
            <button
              key={pieceType}
              onClick={() => onSelect(pieceType)}
              className="aspect-square flex items-center justify-center p-4 hover:bg-gray-100 rounded-lg transition-colors border-2 border-gray-300 hover:border-gray-500"
            >
              <Image
                src={getPiecePath(color, pieceType, pieceStyle)}
                alt={`${color} ${pieceType}`}
                width={80}
                height={80}
                className="w-full h-full object-contain"
                style={{
                  filter:
                    color === "white"
                      ? "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                      : "none",
                }}
              />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
