"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChessTheme, CHESS_THEMES } from "@/lib/chess-themes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ThemeSelectorProps {
  currentTheme: ChessTheme;
  onThemeChange: (theme: ChessTheme) => void;
}

export default function ThemeSelector({
  currentTheme,
  onThemeChange,
}: ThemeSelectorProps) {
  const t = useTranslations("theme");
  const [open, setOpen] = useState(false);

  const handleThemeSelect = (theme: ChessTheme) => {
    onThemeChange(theme);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Palette className="w-4 h-4 mr-2" />
          {t("buttonLabel")} : {currentTheme.name}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] w-full pr-4">
          <div className="grid grid-cols-2 gap-4 py-4">
            {CHESS_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme)}
                className={`relative p-4 rounded-lg border-2 transition-all ${
                  currentTheme.id === theme.id
                    ? "border-primary"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Nom du thème */}
                <div className="text-sm font-medium mb-3 text-center">
                  {theme.name}
                </div>

                {/* Mini échiquier de prévisualisation */}
                <div className="grid grid-cols-4 gap-0.5 aspect-square mb-2">
                  {Array.from({ length: 16 }).map((_, index) => {
                    const row = Math.floor(index / 4);
                    const col = index % 4;
                    const isLight = (row + col) % 2 === 0;
                    return (
                      <div
                        key={index}
                        className="aspect-square rounded-sm"
                        style={{
                          backgroundColor: isLight
                            ? theme.lightSquare
                            : theme.darkSquare,
                        }}
                      />
                    );
                  })}
                </div>

                {/* Couleurs de sélection et dernier coup */}
                <div className="flex gap-2 justify-center">
                  <div className="flex flex-col gap-1">
                    <div
                      className="w-8 h-4 rounded border border-gray-300"
                      style={{ backgroundColor: theme.selectedLight }}
                      title="Sélection (claire)"
                    />
                    <div
                      className="w-8 h-4 rounded border border-gray-300"
                      style={{ backgroundColor: theme.selectedDark }}
                      title="Sélection (foncée)"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div
                      className="w-8 h-4 rounded border border-gray-300"
                      style={{ backgroundColor: theme.lastMoveLight }}
                      title="Dernier coup (claire)"
                    />
                    <div
                      className="w-8 h-4 rounded border border-gray-300"
                      style={{ backgroundColor: theme.lastMoveDark }}
                      title="Dernier coup (foncée)"
                    />
                  </div>
                </div>

                {/* Indicateur de sélection */}
                {currentTheme.id === theme.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-primary-foreground"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
