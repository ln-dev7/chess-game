"use client";

import { useTranslations } from "next-intl";
import { Move } from "@/types/chess";
import { positionToAlgebraic } from "@/lib/chess-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MoveHistoryProps {
  moves: Move[];
}

/**
 * Notation FIDE standard (lettre anglaise)
 */
const PIECE_SYMBOLS_FIDE: Record<string, string> = {
  king: "K",
  queen: "Q",
  rook: "R",
  bishop: "B",
  knight: "N",
  pawn: "",
};

/**
 * Notation française (optionnel, pour usage futur)
 * Décommenter pour utiliser la notation française au lieu de la FIDE
 */
// const PIECE_SYMBOLS_FR: Record<string, string> = {
//   king: "R",
//   queen: "D",
//   rook: "T",
//   bishop: "F",
//   knight: "C",
//   pawn: "",
// };

// Utiliser la notation FIDE par défaut
const PIECE_SYMBOLS = PIECE_SYMBOLS_FIDE;

function formatMove(move: Move): string {
  // Roque
  if (move.isCastling) {
    return move.to.col === 6 ? "O-O" : "O-O-O";
  }

  const pieceSymbol = PIECE_SYMBOLS[move.piece.type];
  const from = positionToAlgebraic(move.from);
  const to = positionToAlgebraic(move.to);
  let notation = "";

  // Lettre de la pièce (sauf pour les pions)
  if (move.piece.type !== "pawn") {
    notation += pieceSymbol;
    // Note : La désambiguïsation complète nécessiterait l'état du jeu
    // Pour l'instant, on affiche juste le coup de base
  } else if (move.capturedPiece || move.isEnPassant) {
    // Pour les pions qui capturent, on ajoute la colonne de départ
    notation += from[0];
  }

  // Symbole de capture
  if (move.capturedPiece || move.isEnPassant) {
    notation += "x";
  }

  // Case de destination
  notation += to;

  // Promotion
  if (move.isPromotion && move.promotionPiece) {
    notation += "=" + PIECE_SYMBOLS[move.promotionPiece];
  }

  // Prise en passant (ajout optionnel)
  if (move.isEnPassant) {
    notation += " e.p.";
  }

  return notation;
}

export default function MoveHistory({ moves }: MoveHistoryProps) {
  const t = useTranslations("history");

  // Grouper les coups par paire (blanc, noir)
  const movePairs: {
    number: number;
    white: Move | null;
    black: Move | null;
  }[] = [];

  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i] || null,
      black: moves[i + 1] || null,
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 w-full rounded-md border p-4">
          {movePairs.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              {t("noMoves")}
            </p>
          ) : (
            <div className="space-y-1">
              {movePairs.map((pair) => (
                <div
                  key={pair.number}
                  className="grid grid-cols-12 gap-2 text-sm hover:bg-gray-50 p-1 rounded"
                >
                  <div className="col-span-2 font-semibold text-gray-600">
                    {pair.number}.
                  </div>
                  <div className="col-span-5 font-mono">
                    {pair.white ? formatMove(pair.white) : ""}
                  </div>
                  <div className="col-span-5 font-mono">
                    {pair.black ? formatMove(pair.black) : ""}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
