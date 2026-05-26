"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Sparkles, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { GameState, GameVariant } from "@/types/chess";
import { analyzeGame, GameAnalysisResult } from "@/lib/game-analysis";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface GameAnalysisProps {
  finalState: GameState;
  gameVariant: GameVariant;
  chess960Position: number | null;
}

export default function GameAnalysis({
  finalState,
  gameVariant,
  chess960Position,
}: GameAnalysisProps) {
  const t = useTranslations("analysis");
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<GameAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    setAnalyzing(true);
    setError(null);
    setProgress(0);
    try {
      const res = await analyzeGame({
        gameVariant,
        chess960Position: chess960Position ?? undefined,
        finalState,
        onProgress: (current, total) => {
          setProgress(total > 0 ? Math.round((current / total) * 100) : 0);
        },
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setAnalyzing(false);
    }
  }

  if (result) {
    return (
      <Card className="p-5 bg-gradient-to-br from-white to-gray-50">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-gray-900">{t("title")}</h3>
        </div>

        <div className="grid grid-cols-3 gap-3 text-sm">
          <div></div>
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white border border-gray-200">
              <span className="w-3 h-3 rounded-full bg-white border border-gray-300" />
              <span className="font-semibold text-gray-800">{t("white")}</span>
            </div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white border border-gray-200">
              <span className="w-3 h-3 rounded-full bg-gray-900" />
              <span className="font-semibold text-gray-800">{t("black")}</span>
            </div>
          </div>

          {/* Précision */}
          <div className="flex items-center text-gray-700 font-medium">
            {t("accuracy")}
          </div>
          <div className="text-center">
            <div className="inline-block px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-lg font-bold text-emerald-700">
              {result.white.accuracy.toFixed(1)}
            </div>
          </div>
          <div className="text-center">
            <div className="inline-block px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-lg font-bold text-emerald-700">
              {result.black.accuracy.toFixed(1)}
            </div>
          </div>

          {/* Classement de la partie */}
          <div className="flex items-center text-gray-700 font-medium">
            {t("gameRating")}
          </div>
          <div className="text-center">
            <div className="inline-block px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-lg font-bold text-blue-700">
              {result.white.estimatedElo}
            </div>
          </div>
          <div className="text-center">
            <div className="inline-block px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-lg font-bold text-blue-700">
              {result.black.estimatedElo}
            </div>
          </div>

          {/* Blunders */}
          <div className="flex items-center gap-1.5 text-gray-700 font-medium">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            {t("blunders")}
          </div>
          <div className="text-center font-semibold text-gray-900">
            {result.white.blunders}
          </div>
          <div className="text-center font-semibold text-gray-900">
            {result.black.blunders}
          </div>

          {/* Mistakes */}
          <div className="flex items-center gap-1.5 text-gray-700 font-medium">
            <AlertCircle className="w-4 h-4 text-orange-500" />
            {t("mistakes")}
          </div>
          <div className="text-center font-semibold text-gray-900">
            {result.white.mistakes}
          </div>
          <div className="text-center font-semibold text-gray-900">
            {result.black.mistakes}
          </div>

          {/* Inaccuracies */}
          <div className="flex items-center gap-1.5 text-gray-700 font-medium">
            <Info className="w-4 h-4 text-yellow-500" />
            {t("inaccuracies")}
          </div>
          <div className="text-center font-semibold text-gray-900">
            {result.white.inaccuracies}
          </div>
          <div className="text-center font-semibold text-gray-900">
            {result.black.inaccuracies}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      {!analyzing ? (
        <Button
          onClick={handleAnalyze}
          variant="outline"
          className="w-full justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          {t("analyzeButton")}
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-700">
              {t("analyzing")}
            </span>
            <span className="ml-auto text-sm font-bold text-gray-900">
              {progress}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      {error && (
        <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
          {t("error")}: {error}
        </p>
      )}
    </Card>
  );
}
