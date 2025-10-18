"use client";

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
import { RotateCcw, Flag } from "lucide-react";
import { GameState } from "@/types/chess";
import ExportPGNDialog from "./ExportPGNDialog";

interface GameControlsProps {
  onNewGame: () => void;
  onResign: () => void;
  onOfferDraw: () => void;
  currentPlayer: "white" | "black";
  isGameOver: boolean;
  gameState: GameState;
}

export default function GameControls({
  onNewGame,
  onResign,
  onOfferDraw,
  currentPlayer,
  isGameOver,
  gameState,
}: GameControlsProps) {
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
    </div>
  );
}
