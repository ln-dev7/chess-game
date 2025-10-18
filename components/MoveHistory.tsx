"use client";

import { Move } from "@/types/chess";
import { positionToAlgebraic } from "@/lib/chess-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MoveHistoryProps {
  moves: Move[];
}

const PIECE_SYMBOLS: Record<string, string> = {
  king: "R",
  queen: "D",
  rook: "T",
  bishop: "F",
  knight: "C",
  pawn: "",
};

function formatMove(move: Move): string {
  const pieceSymbol = PIECE_SYMBOLS[move.piece.type];
  const from = positionToAlgebraic(move.from);
  const to = positionToAlgebraic(move.to);

  // Cas spéciaux
  if (move.isCastling) {
    return move.to.col === 6 ? "0-0" : "0-0-0"; // Petit ou grand roque
  }

  if (move.isEnPassant) {
    return `${from}x${to} e.p.`;
  }

  if (move.isPromotion) {
    const promotionSymbol = PIECE_SYMBOLS[move.promotionPiece || "queen"];
    return `${pieceSymbol}${from}-${to}=${promotionSymbol}`;
  }

  const capture = move.capturedPiece ? "x" : "-";

  // Pour les pions, on affiche juste la destination (ou la colonne de départ pour les captures)
  if (move.piece.type === "pawn") {
    if (move.capturedPiece) {
      return `${from[0]}x${to}`;
    }
    return to;
  }

  return `${pieceSymbol}${from}${capture}${to}`;
}

export default function MoveHistory({ moves }: MoveHistoryProps) {
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
        <CardTitle>Historique des coups</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 w-full rounded-md border p-4">
          {movePairs.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              Aucun coup joué
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
