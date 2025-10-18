"use client";

import { useState, RefObject } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RotateCcw, Flag, Settings } from "lucide-react";
import { GameState } from "@/types/chess";
import ExportPGNDialog from "./ExportPGNDialog";
import ThemeSelector from "./ThemeSelector";
import PieceStyleSelector from "./PieceStyleSelector";
import PreferencesDialog from "./PreferencesDialog";
import FullscreenButton from "./FullscreenButton";
import { useThemeStore } from "@/store/useThemeStore";
import { CHESS_THEMES } from "@/lib/chess-themes";
import { PIECE_STYLES } from "@/lib/piece-styles";

interface GameControlsProps {
  onNewGame: () => void;
  onResign: () => void;
  onOfferDraw: () => void;
  currentPlayer: "white" | "black";
  isGameOver: boolean;
  gameState: GameState;
  boardRef?: RefObject<HTMLDivElement | null>;
}

export default function GameControls({
  onNewGame,
  onResign,
  onOfferDraw,
  currentPlayer,
  isGameOver,
  gameState,
  boardRef,
}: GameControlsProps) {
  const t = useTranslations("common");
  const tDialog = useTranslations("dialog");
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const { themeId, pieceStyleId, setThemeId, setPieceStyleId } =
    useThemeStore();

  const currentTheme =
    CHESS_THEMES.find((t) => t.id === themeId) || CHESS_THEMES[0];
  const currentPieceStyle =
    PIECE_STYLES.find((s) => s.id === pieceStyleId) || PIECE_STYLES[0];

  // Une partie est considérée comme démarrée si au moins un coup a été joué
  const gameStarted = gameState.moveHistory.length > 0;

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-wrap gap-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              {t("newGame")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{tDialog("newGame.title")}</AlertDialogTitle>
              <AlertDialogDescription>
                {tDialog("newGame.description")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{tDialog("cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={onNewGame}>
                {tDialog("confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {!isGameOver && gameStarted && (
          <>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex-1">
                  <Flag className="w-4 h-4 mr-2" />
                  {t("resign")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{tDialog("resign.title")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {currentPlayer === "white"
                      ? tDialog("resign.descriptionWhite")
                      : tDialog("resign.descriptionBlack")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{tDialog("cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={onResign}>
                    {tDialog("confirm")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="secondary" className="flex-1">
                  {t("offerDraw")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{tDialog("draw.title")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {tDialog("draw.description")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{tDialog("decline")}</AlertDialogCancel>
                  <AlertDialogAction onClick={onOfferDraw}>
                    {tDialog("accept")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>

      {/* Export PGN - toujours disponible si des coups ont été joués */}
      {gameStarted && <ExportPGNDialog gameState={gameState} />}

      {/* Theme and Piece Style Selectors */}
      <ThemeSelector
        currentTheme={currentTheme}
        onThemeChange={(theme) => setThemeId(theme.id)}
      />
      <PieceStyleSelector
        currentStyle={currentPieceStyle}
        onStyleChange={(style) => setPieceStyleId(style.id)}
      />

      {/* Settings and Fullscreen Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setIsPreferencesOpen(true)}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
        >
          <Settings className="w-5 h-5" />
          {tDialog("settings")}
        </button>

        <FullscreenButton boardRef={boardRef} />
      </div>

      <PreferencesDialog
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
      />
    </div>
  );
}
