"use client";

import { GameState } from "@/types/chess";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GameInfoProps {
  gameState: GameState;
}

export default function GameInfo({ gameState }: GameInfoProps) {
  const {
    currentPlayer,
    isCheck,
    isCheckmate,
    isStalemate,
    isDraw,
    moveHistory,
  } = gameState;

  const getStatusText = () => {
    if (isCheckmate) {
      const winner = currentPlayer === "white" ? "Noirs" : "Blancs";
      return `Échec et mat ! Les ${winner} gagnent !`;
    }
    if (isStalemate) {
      return "Pat ! Partie nulle.";
    }
    if (isDraw) {
      return "Partie nulle !";
    }
    if (isCheck) {
      return "Échec !";
    }
    return "";
  };

  const statusText = getStatusText();
  const playerText = currentPlayer === "white" ? "Blancs" : "Noirs";
  const moveCount = Math.floor(moveHistory.length / 2) + 1;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Information de la partie</span>
          <Badge variant="outline">Coup n°{moveCount}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Joueur actuel :</span>
          <Badge variant={currentPlayer === "white" ? "default" : "secondary"}>
            {playerText}
          </Badge>
        </div>

        {statusText && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm font-semibold text-yellow-800">
              {statusText}
            </p>
          </div>
        )}

        {gameState.halfMoveClock >= 80 && !isCheckmate && !isStalemate && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              Règle des 50 coups :{" "}
              {50 - Math.floor((100 - gameState.halfMoveClock) / 2)} coups
              restants
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
