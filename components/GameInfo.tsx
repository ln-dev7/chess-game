"use client";

import { useTranslations } from "next-intl";
import { GameState } from "@/types/chess";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GameInfoProps {
  gameState: GameState;
}

export default function GameInfo({ gameState }: GameInfoProps) {
  const t = useTranslations("game");
  const tCommon = useTranslations("common");

  const {
    currentPlayer,
    isCheck,
    isCheckmate,
    isStalemate,
    isDraw,
    moveHistory,
    gameEndReason,
  } = gameState;

  const getStatusText = () => {
    if (isCheckmate) {
      const winner =
        currentPlayer === "white" ? t("blackWins") : t("whiteWins");
      const reason = gameEndReason
        ? t(`endReason.${gameEndReason}`)
        : t("endReason.checkmate");
      return `${winner} ${reason} !`;
    }
    if (isStalemate) {
      return t("stalemate");
    }
    if (isDraw) {
      return t("draw");
    }
    if (isCheck) {
      return t("check");
    }
    return "";
  };

  const statusText = getStatusText();
  const playerText =
    currentPlayer === "white" ? tCommon("white") : tCommon("black");
  const moveCount = Math.floor(moveHistory.length / 2) + 1;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t("info")}</span>
          <Badge variant="outline">Move #{moveCount}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t("currentPlayer")}:</span>
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
              50-move rule:{" "}
              {50 - Math.floor((100 - gameState.halfMoveClock) / 2)} moves
              remaining
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
