"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Brain,
  Zap,
  TrendingUp,
  Award,
  Crown,
  Trophy,
  ChevronRight,
} from "lucide-react";
import { useGameModeStore } from "@/store/useGameModeStore";
import { AILevel, getAILevelInfo } from "@/lib/chess-ai";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

interface LevelStyle {
  level: AILevel;
  icon: React.ReactNode;
  gradient: string;
  shadowColor: string;
  textColor: string;
}

const LEVELS: LevelStyle[] = [
  {
    level: 400,
    icon: <Brain className="w-6 h-6" />,
    gradient: "from-green-400 to-emerald-500",
    shadowColor: "shadow-green-200",
    textColor: "text-green-600",
  },
  {
    level: 800,
    icon: <Zap className="w-6 h-6" />,
    gradient: "from-blue-400 to-blue-600",
    shadowColor: "shadow-blue-200",
    textColor: "text-blue-600",
  },
  {
    level: 1200,
    icon: <TrendingUp className="w-6 h-6" />,
    gradient: "from-orange-400 to-orange-600",
    shadowColor: "shadow-orange-200",
    textColor: "text-orange-600",
  },
  {
    level: 1600,
    icon: <Award className="w-6 h-6" />,
    gradient: "from-red-500 to-rose-600",
    shadowColor: "shadow-red-200",
    textColor: "text-red-600",
  },
  {
    level: 2000,
    icon: <Crown className="w-6 h-6" />,
    gradient: "from-purple-500 to-indigo-600",
    shadowColor: "shadow-purple-200",
    textColor: "text-purple-600",
  },
  {
    level: 2500,
    icon: <Trophy className="w-6 h-6" />,
    gradient: "from-amber-400 to-yellow-500",
    shadowColor: "shadow-amber-200",
    textColor: "text-amber-600",
  },
];

interface AIDifficultySelectorProps {
  disabled?: boolean;
}

export default function AIDifficultySelector({
  disabled = false,
}: AIDifficultySelectorProps) {
  const t = useTranslations("aiDifficulty");
  const { gameMode, aiLevel, setAILevel } = useGameModeStore();
  const [isOpen, setIsOpen] = useState(false);

  if (gameMode !== "ai") {
    return null;
  }

  const currentStyle =
    LEVELS.find((l) => l.level === aiLevel) ?? LEVELS[LEVELS.length - 1];
  const currentInfo = getAILevelInfo(currentStyle.level);
  const currentName = t(`levels.${currentStyle.level}`);

  function handleSelect(level: AILevel) {
    if (disabled) return;
    setAILevel(level);
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className="w-full p-4 rounded-xl border bg-white hover:border-gray-300 hover:shadow-sm transition-all duration-200 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${currentStyle.textColor} bg-gray-50`}>
            {currentStyle.icon}
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-gray-900">{t("title")}</div>
            <div className="text-xs text-gray-500">
              <span className="font-semibold">{currentName}</span>
              <span className="mx-1">·</span>
              <span>{currentInfo.displayLabel ?? `${currentInfo.elo} Elo`}</span>
            </div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </button>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (disabled && open) return;
          setIsOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{t("title")}</DialogTitle>
            <DialogDescription>{t("subtitle")}</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
            {LEVELS.map((levelData) => {
              const info = getAILevelInfo(levelData.level);
              const isSelected = aiLevel === levelData.level;

              return (
                <button
                  key={levelData.level}
                  onClick={() => handleSelect(levelData.level)}
                  disabled={disabled}
                  className={`
                    group relative p-4 rounded-xl transition-all duration-300 transform
                    ${
                      isSelected
                        ? `bg-gradient-to-br ${levelData.gradient} shadow-lg ${levelData.shadowColor} border-2 border-white`
                        : "bg-white hover:shadow-md border-2 border-gray-200 hover:border-gray-300 hover:scale-102"
                    }
                    ${
                      disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                  `}
                >
                  <div
                    className={`
                      absolute -top-2 -right-2 px-2.5 py-1 rounded-full text-xs font-bold shadow-md
                      ${
                        isSelected
                          ? "bg-white text-gray-900"
                          : `bg-gradient-to-r ${levelData.gradient} text-white`
                      }
                    `}
                  >
                    {info.displayLabel ?? info.elo}
                  </div>

                  <div className="flex flex-col items-center gap-2.5">
                    <div
                      className={`
                        p-3 rounded-xl transition-all duration-300
                        ${
                          isSelected
                            ? "bg-white/20 backdrop-blur-sm text-white"
                            : `${levelData.textColor} bg-gray-50 group-hover:scale-110`
                        }
                      `}
                    >
                      {levelData.icon}
                    </div>
                    <div className="text-center">
                      <div
                        className={`
                          font-bold text-sm leading-tight
                          ${isSelected ? "text-white" : "text-gray-900"}
                        `}
                      >
                        {t(`levels.${levelData.level}`).split(" ")[0]}
                      </div>
                      <div
                        className={`
                          font-semibold text-xs
                          ${isSelected ? "text-white/90" : "text-gray-600"}
                        `}
                      >
                        {t(`levels.${levelData.level}`).split(" ")[1]}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {disabled && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3 mt-3">
              {t("cannotChangeDuringGame")}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
