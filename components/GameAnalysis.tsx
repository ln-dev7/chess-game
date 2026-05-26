"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Sparkles,
  AlertTriangle,
  AlertCircle,
  Info,
  Check,
  Star,
  Trophy,
} from "lucide-react";
import { GameState, GameVariant } from "@/types/chess";
import {
  analyzeGame,
  GameAnalysisResult,
  MoveAnalysis,
  MoveClassification,
} from "@/lib/game-analysis";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

export type AnalysisSelectionVariant = "played" | "best";

export interface AnalysisSelection {
  ply: number;
  variant: AnalysisSelectionVariant;
}

interface GameAnalysisProps {
  finalState: GameState;
  gameVariant: GameVariant;
  chess960Position: number | null;
  result: GameAnalysisResult | null;
  selection: AnalysisSelection | null;
  onResult: (result: GameAnalysisResult) => void;
  onSelectionChange: (selection: AnalysisSelection | null) => void;
}

interface ClassificationStyle {
  label: string;
  iconClass: string;
  bgClass: string;
  ringClass: string;
  Icon: typeof Sparkles;
}

function getClassificationStyles(
  t: (k: string) => string
): Record<MoveClassification, ClassificationStyle> {
  return {
    best: {
      label: t("classifications.best"),
      iconClass: "text-cyan-500",
      bgClass: "bg-cyan-50",
      ringClass: "ring-cyan-200",
      Icon: Trophy,
    },
    excellent: {
      label: t("classifications.excellent"),
      iconClass: "text-emerald-500",
      bgClass: "bg-emerald-50",
      ringClass: "ring-emerald-200",
      Icon: Star,
    },
    good: {
      label: t("classifications.good"),
      iconClass: "text-green-500",
      bgClass: "bg-green-50",
      ringClass: "ring-green-200",
      Icon: Check,
    },
    inaccuracy: {
      label: t("classifications.inaccuracy"),
      iconClass: "text-yellow-500",
      bgClass: "bg-yellow-50",
      ringClass: "ring-yellow-200",
      Icon: Info,
    },
    mistake: {
      label: t("classifications.mistake"),
      iconClass: "text-orange-500",
      bgClass: "bg-orange-50",
      ringClass: "ring-orange-200",
      Icon: AlertCircle,
    },
    blunder: {
      label: t("classifications.blunder"),
      iconClass: "text-red-500",
      bgClass: "bg-red-50",
      ringClass: "ring-red-200",
      Icon: AlertTriangle,
    },
  };
}

export default function GameAnalysis({
  finalState,
  gameVariant,
  chess960Position,
  result,
  selection,
  onResult,
  onSelectionChange,
}: GameAnalysisProps) {
  const t = useTranslations("analysis");
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    setAnalyzing(true);
    setError(null);
    setProgress(0);
    onSelectionChange(null);
    try {
      const res = await analyzeGame({
        gameVariant,
        chess960Position: chess960Position ?? undefined,
        finalState,
        onProgress: (current, total) => {
          setProgress(total > 0 ? Math.round((current / total) * 100) : 0);
        },
      });
      onResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setAnalyzing(false);
    }
  }

  function toggleSelection(next: AnalysisSelection) {
    if (
      selection &&
      selection.ply === next.ply &&
      selection.variant === next.variant
    ) {
      onSelectionChange(null);
    } else {
      onSelectionChange(next);
    }
  }

  if (result) {
    return (
      <ResultCard
        result={result}
        selection={selection}
        onToggleSelection={toggleSelection}
      />
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

function ResultCard({
  result,
  selection,
  onToggleSelection,
}: {
  result: GameAnalysisResult;
  selection: AnalysisSelection | null;
  onToggleSelection: (s: AnalysisSelection) => void;
}) {
  const t = useTranslations("analysis");
  const styles = useMemo(() => getClassificationStyles(t), [t]);

  const pairs = useMemo(() => {
    const out: { number: number; white?: MoveAnalysis; black?: MoveAnalysis }[] = [];
    for (const m of result.moves) {
      const idx = Math.floor(m.ply / 2);
      if (!out[idx]) out[idx] = { number: idx + 1 };
      if (m.color === "white") out[idx].white = m;
      else out[idx].black = m;
    }
    return out;
  }, [result.moves]);

  const selectedMove =
    selection !== null ? result.moves[selection.ply] ?? null : null;

  return (
    <Card className="p-5 bg-gradient-to-br from-white to-gray-50">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-bold text-gray-900">{t("title")}</h3>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm mb-5">
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

        {(
          [
            ["best", Trophy, "text-cyan-500"],
            ["excellent", Star, "text-emerald-500"],
            ["good", Check, "text-green-500"],
            ["inaccuracy", Info, "text-yellow-500"],
            ["mistake", AlertCircle, "text-orange-500"],
            ["blunder", AlertTriangle, "text-red-500"],
          ] as const
        ).map(([key, Icon, iconClass]) => (
          <ClassificationRow
            key={key}
            label={t(`classifications.${key}`)}
            Icon={Icon}
            iconClass={iconClass}
            white={result.white[key as keyof typeof result.white] as number}
            black={result.black[key as keyof typeof result.black] as number}
          />
        ))}
      </div>

      {selectedMove && (
        <div className="mb-4 p-3 rounded-lg border border-gray-200 bg-white">
          <SelectedMoveDetails
            move={selectedMove}
            selection={selection!}
            styles={styles}
            onSelectVariant={(variant) =>
              onToggleSelection({ ply: selectedMove.ply, variant })
            }
            t={t}
          />
        </div>
      )}

      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">
          {t("movesList")}
        </p>
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          {pairs.length === 0 ? (
            <p className="p-3 text-sm text-gray-500">{t("noMoves")}</p>
          ) : (
            <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
              {pairs.map((pair) => (
                <div
                  key={pair.number}
                  className="grid grid-cols-[2.5rem_1fr_1fr] items-center"
                >
                  <div className="px-2 py-1.5 text-xs text-gray-500 font-mono bg-gray-50">
                    {pair.number}.
                  </div>
                  <MoveCell
                    move={pair.white}
                    isSelected={
                      pair.white?.ply === selection?.ply &&
                      selection?.variant === "played"
                    }
                    onClick={() =>
                      pair.white &&
                      onToggleSelection({
                        ply: pair.white.ply,
                        variant: "played",
                      })
                    }
                    styles={styles}
                  />
                  <MoveCell
                    move={pair.black}
                    isSelected={
                      pair.black?.ply === selection?.ply &&
                      selection?.variant === "played"
                    }
                    onClick={() =>
                      pair.black &&
                      onToggleSelection({
                        ply: pair.black.ply,
                        variant: "played",
                      })
                    }
                    styles={styles}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function ClassificationRow({
  label,
  Icon,
  iconClass,
  white,
  black,
}: {
  label: string;
  Icon: typeof Sparkles;
  iconClass: string;
  white: number;
  black: number;
}) {
  return (
    <>
      <div className="flex items-center gap-1.5 text-gray-700 font-medium">
        <Icon className={`w-4 h-4 ${iconClass}`} />
        {label}
      </div>
      <div className="text-center font-semibold text-gray-900">{white}</div>
      <div className="text-center font-semibold text-gray-900">{black}</div>
    </>
  );
}

function MoveCell({
  move,
  isSelected,
  onClick,
  styles,
}: {
  move: MoveAnalysis | undefined;
  isSelected: boolean;
  onClick: () => void;
  styles: Record<MoveClassification, ClassificationStyle>;
}) {
  if (!move) return <div className="px-2 py-1.5" />;
  const style = styles[move.classification];
  const { Icon } = style;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between px-2 py-1.5 text-sm hover:bg-gray-50 transition-colors ${
        isSelected ? `${style.bgClass} ring-1 ${style.ringClass}` : ""
      }`}
      title={style.label}
    >
      <span className="font-mono font-medium text-gray-900">{move.san}</span>
      <Icon className={`w-4 h-4 ${style.iconClass}`} />
    </button>
  );
}

function SelectedMoveDetails({
  move,
  selection,
  styles,
  onSelectVariant,
  t,
}: {
  move: MoveAnalysis;
  selection: AnalysisSelection;
  styles: Record<MoveClassification, ClassificationStyle>;
  onSelectVariant: (variant: AnalysisSelectionVariant) => void;
  t: (k: string) => string;
}) {
  const style = styles[move.classification];
  const { Icon } = style;
  const showBestVariant =
    move.bestMoveSan && move.classification !== "best";

  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md ${style.bgClass}`}
        >
          <Icon className={`w-4 h-4 ${style.iconClass}`} />
          <span className="font-semibold text-gray-800">{style.label}</span>
        </span>
        <button
          type="button"
          onClick={() => onSelectVariant("played")}
          className={`font-mono font-bold transition-colors ${
            selection.variant === "played"
              ? "text-blue-600 underline"
              : "text-gray-900 hover:text-blue-600"
          }`}
          title={t("showOnBoard")}
        >
          {move.san}
        </button>
        <span className="text-xs text-gray-500">
          ({move.color === "white" ? t("white") : t("black")})
        </span>
      </div>
      {showBestVariant && (
        <div className="flex items-center gap-2 text-gray-700 flex-wrap">
          <Trophy className="w-4 h-4 text-cyan-500" />
          <span>{t("bestWas")}</span>
          <button
            type="button"
            onClick={() => onSelectVariant("best")}
            className={`font-mono font-bold transition-colors ${
              selection.variant === "best"
                ? "text-cyan-700 underline"
                : "text-cyan-600 hover:text-cyan-800"
            }`}
            title={t("showOnBoard")}
          >
            {move.bestMoveSan}
          </button>
        </div>
      )}
      {move.cpLoss > 0 && (
        <div className="text-xs text-gray-500">
          {t("cpLoss")}: <span className="font-mono">−{move.cpLoss}</span> ·{" "}
          {t("winLoss")}:{" "}
          <span className="font-mono">−{move.winPctLoss.toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
}
