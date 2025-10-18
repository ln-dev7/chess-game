"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PieceStyle, PIECE_STYLES } from "@/lib/piece-styles";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shapes } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

interface PieceStyleSelectorProps {
  currentStyle: PieceStyle;
  onStyleChange: (style: PieceStyle) => void;
}

export default function PieceStyleSelector({
  currentStyle,
  onStyleChange,
}: PieceStyleSelectorProps) {
  const t = useTranslations("pieceStyle");
  const [open, setOpen] = useState(false);

  const handleStyleSelect = (style: PieceStyle) => {
    onStyleChange(style);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Shapes className="w-4 h-4 mr-2" />
          {t("buttonLabel")} : {currentStyle.name}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] w-full pr-4">
          <div className="grid grid-cols-1 gap-4 py-4">
            {PIECE_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => handleStyleSelect(style)}
                className={`relative p-4 rounded-lg border-2 transition-all ${
                  currentStyle.id === style.id
                    ? "border-primary"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Prévisualisation des pièces */}
                  <div className="flex gap-2">
                    <div className="w-12 h-12 relative">
                      <Image
                        src={`/pieces/${style.id}/white/king.svg`}
                        alt="Roi blanc"
                        width={48}
                        height={48}
                        className="w-full h-full object-contain drop-shadow-md"
                        style={{
                          filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))",
                        }}
                      />
                    </div>
                    <div className="w-12 h-12 relative">
                      <Image
                        src={`/pieces/${style.id}/black/queen.svg`}
                        alt="Reine noire"
                        width={48}
                        height={48}
                        className="w-full h-full object-contain drop-shadow-md"
                      />
                    </div>
                    <div className="w-12 h-12 relative">
                      <Image
                        src={`/pieces/${style.id}/white/knight.svg`}
                        alt="Cavalier blanc"
                        width={48}
                        height={48}
                        className="w-full h-full object-contain drop-shadow-md"
                        style={{
                          filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))",
                        }}
                      />
                    </div>
                  </div>

                  {/* Informations du style */}
                  <div className="flex-1 text-left">
                    <div className="font-medium text-lg">{style.name}</div>
                    <div className="text-sm text-gray-600">{style.description}</div>
                  </div>
                </div>

                {/* Indicateur de sélection */}
                {currentStyle.id === style.id && (
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
