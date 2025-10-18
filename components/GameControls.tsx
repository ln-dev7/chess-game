"use client";

import { useState, RefObject } from "react";
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
import TimeControlSelector from "./TimeControlSelector";
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
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const { themeId, pieceStyleId, setThemeId, setPieceStyleId } = useThemeStore();

  const currentTheme = CHESS_THEMES.find((t) => t.id === themeId) || CHESS_THEMES[0];
  const currentPieceStyle = PIECE_STYLES.find((s) => s.id === pieceStyleId) || PIECE_STYLES[0];

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-wrap gap-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Nouvelle partie
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Commencer une nouvelle partie ?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Cela réinitialisera la partie actuelle. Cette action ne peut pas
                être annulée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={onNewGame}>
                Confirmer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {!isGameOver && gameState.moveHistory.length > 0 && (
          <>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex-1">
                  <Flag className="w-4 h-4 mr-2" />
                  Abandonner
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Abandonner la partie ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Les {currentPlayer === "white" ? "Blancs" : "Noirs"}{" "}
                    abandonnent. Les{" "}
                    {currentPlayer === "white" ? "Noirs" : "Blancs"} gagnent la
                    partie.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={onResign}>
                    Confirmer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="secondary" className="flex-1">
                  Proposer nulle
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Proposer une partie nulle ?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Les deux joueurs acceptent-ils la nulle ?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Refuser</AlertDialogCancel>
                  <AlertDialogAction onClick={onOfferDraw}>
                    Accepter
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>

      {/* Export PGN - toujours disponible si des coups ont été joués */}
      {gameState.moveHistory.length > 0 && (
        <ExportPGNDialog gameState={gameState} />
      )}

      {/* Time Control Selector */}
      <TimeControlSelector />

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
          title="Paramètres"
        >
          <Settings className="w-5 h-5" />
          Paramètres
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
