"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useGameModeStore, GameMode } from "@/store/useGameModeStore";
import { useGameVariantStore } from "@/store/useGameVariantStore";
import { Users, Cpu, Shuffle } from "lucide-react";
import { Card } from "./ui/card";
import GameVariantDialog from "./GameVariantDialog";

interface GameModeSelectorProps {
  disabled?: boolean;
  onStartGame?: () => void;
  showStartButton?: boolean;
}

export default function GameModeSelector({
  disabled = false,
  onStartGame,
  showStartButton = false,
}: GameModeSelectorProps) {
  const t = useTranslations("gameMode");
  const tVariant = useTranslations("gameVariant");
  const tCommon = useTranslations("common");
  const { gameMode, setGameMode, aiColor, setAIColor } = useGameModeStore();
  const { gameVariant } = useGameVariantStore();
  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false);

  const modes: Array<{
    id: GameMode;
    label: string;
    icon: React.ReactNode;
    description: string;
  }> = [
    {
      id: "pvp",
      label: t("pvp"),
      icon: <Users className="w-6 h-6" />,
      description: t("pvpDescription"),
    },
    {
      id: "ai",
      label: t("vsAI"),
      icon: <Cpu className="w-6 h-6" />,
      description: t("vsAIDescription"),
    },
  ];

  return (
    <Card className="p-4 bg-white">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {t("title")}
          </h3>
          <p className="text-sm text-gray-600">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => !disabled && setGameMode(mode.id)}
              disabled={disabled}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200
                ${
                  gameMode === mode.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`
                    ${gameMode === mode.id ? "text-blue-600" : "text-gray-600"}
                  `}
                >
                  {mode.icon}
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm text-gray-900">
                    {mode.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {mode.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Bouton Variante de jeu */}
        <div className="pt-3 border-t border-gray-200">
          <button
            onClick={() => setIsVariantDialogOpen(true)}
            disabled={disabled}
            className="w-full p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-2">
              <Shuffle className="w-5 h-5 text-gray-600" />
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">
                  {tVariant("title")}
                </div>
                <div className="text-xs text-gray-500">
                  {gameVariant === "chess960" ? tVariant("chess960") : tVariant("standard")}
                </div>
              </div>
            </div>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {gameMode === "ai" && (
          <div className="pt-3 border-t border-gray-200">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              {t("playerColor")}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => !disabled && setAIColor("black")}
                disabled={disabled}
                className={`
                  p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium
                  ${
                    aiColor === "black"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }
                  ${
                    disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }
                `}
              >
                {t("playAsWhite")}
              </button>
              <button
                onClick={() => !disabled && setAIColor("white")}
                disabled={disabled}
                className={`
                  p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium
                  ${
                    aiColor === "white"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }
                  ${
                    disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }
                `}
              >
                {t("playAsBlack")}
              </button>
            </div>

            {/* Bouton pour lancer la partie */}
            {showStartButton && onStartGame && (
              <button
                onClick={onStartGame}
                className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {tCommon("startGame")}
              </button>
            )}
          </div>
        )}

        {disabled && (
          <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
            {t("cannotChangeDuringGame")}
          </p>
        )}
      </div>

      <GameVariantDialog
        isOpen={isVariantDialogOpen}
        onClose={() => setIsVariantDialogOpen(false)}
        disabled={disabled}
      />
    </Card>
  );
}
