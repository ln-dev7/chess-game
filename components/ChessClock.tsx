"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Clock, Crown } from "lucide-react";
import { PieceColor } from "@/types/chess";
import { formatTime, getTimeColor } from "@/lib/time-controls";
import { useTimeControlStore } from "@/store/useTimeControlStore";

interface ChessClockProps {
  whiteTime: number;
  blackTime: number;
  currentPlayer: PieceColor;
  isGameOver: boolean;
  initialTime: number;
}

export default function ChessClock({
  whiteTime,
  blackTime,
  currentPlayer,
  isGameOver,
  initialTime,
}: ChessClockProps) {
  const t = useTranslations("clock");
  const tCommon = useTranslations("common");
  const { selectedTimeControl } = useTimeControlStore();
  const [pulse, setPulse] = useState(false);

  // Effet de pulsation quand le temps devient critique
  useEffect(() => {
    const activeTime = currentPlayer === "white" ? whiteTime : blackTime;
    if (activeTime <= 10 && activeTime > 0 && !isGameOver) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 500);
      return () => clearTimeout(timer);
    }
  }, [whiteTime, blackTime, currentPlayer, isGameOver]);

  const whiteColorClass = getTimeColor(whiteTime, initialTime);
  const blackColorClass = getTimeColor(blackTime, initialTime);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-center gap-2 text-gray-700">
          <Clock className="w-5 h-5" />
          <span className="font-semibold">{t("title")}</span>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {/* Horloge des Noirs */}
        <div
          className={`p-4 transition-all ${
            currentPlayer === "black" && !isGameOver
              ? "bg-blue-50 border-l-4 border-blue-600"
              : "bg-white"
          } ${pulse && currentPlayer === "black" ? "animate-pulse" : ""}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium text-gray-700">
                {tCommon("black")}
              </span>
            </div>
            <div
              className={`text-3xl font-bold font-mono ${blackColorClass} ${
                blackTime <= 10 && blackTime > 0 ? "text-red-600" : ""
              }`}
            >
              {formatTime(blackTime)}
            </div>
          </div>
        </div>

        {/* Horloge des Blancs */}
        <div
          className={`p-4 transition-all ${
            currentPlayer === "white" && !isGameOver
              ? "bg-blue-50 border-l-4 border-blue-600"
              : "bg-white"
          } ${pulse && currentPlayer === "white" ? "animate-pulse" : ""}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-gray-400 flex items-center justify-center">
                <Crown className="w-6 h-6 text-gray-700" />
              </div>
              <span className="font-medium text-gray-700">
                {tCommon("white")}
              </span>
            </div>
            <div
              className={`text-3xl font-bold font-mono ${whiteColorClass} ${
                whiteTime <= 10 && whiteTime > 0 ? "text-red-600" : ""
              }`}
            >
              {formatTime(whiteTime)}
            </div>
          </div>
        </div>
      </div>

      {/* Type de partie */}
      <div className="p-3 bg-gray-50 border-t border-gray-200">
        <div className="text-center text-sm text-gray-600">
          <span className="font-medium">{t("timeControl")}:</span>{" "}
          <span className="font-semibold text-gray-900">
            {selectedTimeControl.name}
          </span>
        </div>
      </div>
    </div>
  );
}
