"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useGameVariantStore, GameVariant } from "@/store/useGameVariantStore";
import { Puzzle, Shuffle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface GameVariantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  disabled?: boolean;
}

export default function GameVariantDialog({
  isOpen,
  onClose,
  disabled = false,
}: GameVariantDialogProps) {
  const t = useTranslations("gameVariant");
  const tDialog = useTranslations("dialog");
  const { gameVariant, setGameVariant } = useGameVariantStore();
  const [selectedVariant, setSelectedVariant] =
    useState<GameVariant>(gameVariant);

  // Synchroniser la sélection locale avec le store quand la modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setSelectedVariant(gameVariant);
    }
  }, [isOpen, gameVariant]);

  const variants: Array<{
    id: GameVariant;
    label: string;
    icon: React.ReactNode;
    description: string;
  }> = [
    {
      id: "standard",
      label: t("standard"),
      icon: <Puzzle className="w-6 h-6" />,
      description: t("standardDescription"),
    },
    {
      id: "chess960",
      label: t("chess960"),
      icon: <Shuffle className="w-6 h-6" />,
      description: t("chess960Description"),
    },
  ];

  const handleSelectVariant = (variant: GameVariant) => {
    if (!disabled) {
      setSelectedVariant(variant);
    }
  };

  const handleConfirm = () => {
    if (!disabled) {
      setGameVariant(selectedVariant);
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedVariant(gameVariant); // Réinitialiser à la valeur actuelle
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("subtitle")}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 py-4">
          {variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => handleSelectVariant(variant.id)}
              disabled={disabled}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200
                ${
                  selectedVariant === variant.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`
                    ${
                      selectedVariant === variant.id
                        ? "text-blue-600"
                        : "text-gray-600"
                    }
                  `}
                >
                  {variant.icon}
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm text-gray-900">
                    {variant.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {variant.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {selectedVariant === "chess960" && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 leading-relaxed">
              {t("chess960Info")}
            </p>
          </div>
        )}

        {disabled && (
          <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
            {t("cannotChangeDuringGame")}
          </p>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={disabled}
          >
            {tDialog("cancel")}
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={disabled}>
            {tDialog("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
