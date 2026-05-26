"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Shuffle, ChevronRight } from "lucide-react";
import { Card } from "./ui/card";
import { useGameVariantStore } from "@/store/useGameVariantStore";
import GameVariantDialog from "./GameVariantDialog";

interface GameVariantSelectorProps {
  disabled?: boolean;
}

export default function GameVariantSelector({
  disabled = false,
}: GameVariantSelectorProps) {
  const tVariant = useTranslations("gameVariant");
  const { gameVariant } = useGameVariantStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="p-4 bg-white">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(true)}
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
              {gameVariant === "chess960"
                ? tVariant("chess960")
                : tVariant("standard")}
            </div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </button>

      <GameVariantDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        disabled={disabled}
      />
    </Card>
  );
}
