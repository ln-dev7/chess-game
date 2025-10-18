"use client";

import { useState, useEffect } from "react";
import { GameState } from "@/types/chess";
import { generatePGN, downloadPGN, generatePGNFilename } from "@/lib/pgn-utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download, Copy, Check } from "lucide-react";

interface ExportPGNDialogProps {
  gameState: GameState;
}

export default function ExportPGNDialog({ gameState }: ExportPGNDialogProps) {
  const [open, setOpen] = useState(false);
  const [metadata, setMetadata] = useState({
    event: "Partie locale",
    site: "chess-game",
    round: "1",
    white: "Joueur 1 (Blancs)",
    black: "Joueur 2 (Noirs)",
  });
  const [pgnPreview, setPgnPreview] = useState("");
  const [copied, setCopied] = useState(false);

  // Générer le PGN automatiquement quand la modale s'ouvre ou que les métadonnées changent
  useEffect(() => {
    if (open) {
      const today = new Date();
      const dateStr = `${today.getFullYear()}.${String(
        today.getMonth() + 1
      ).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

      const pgn = generatePGN(gameState, {
        ...metadata,
        date: dateStr,
      });
      setPgnPreview(pgn);
    }
  }, [open, metadata, gameState]);

  const handleCopy = async () => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}.${String(
      today.getMonth() + 1
    ).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

    const pgn = generatePGN(gameState, {
      ...metadata,
      date: dateStr,
    });

    try {
      await navigator.clipboard.writeText(pgn);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erreur lors de la copie:", err);
      // Fallback pour les navigateurs plus anciens
      const textArea = document.createElement("textarea");
      textArea.value = pgn;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        console.error("Impossible de copier:", e);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleExport = () => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}.${String(
      today.getMonth() + 1
    ).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

    const pgn = generatePGN(gameState, {
      ...metadata,
      date: dateStr,
    });

    downloadPGN(pgn, generatePGNFilename());
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Exporter PGN
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Exporter la partie au format PGN</DialogTitle>
          <DialogDescription>
            Format standard FIDE pour enregistrer et partager des parties
            d&apos;échecs
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="event" className="text-right">
              Événement
            </Label>
            <Input
              id="event"
              value={metadata.event}
              onChange={(e) =>
                setMetadata({ ...metadata, event: e.target.value })
              }
              className="col-span-3"
              placeholder="Nom du tournoi ou de l'événement"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="site" className="text-right">
              Lieu
            </Label>
            <Input
              id="site"
              value={metadata.site}
              onChange={(e) =>
                setMetadata({ ...metadata, site: e.target.value })
              }
              className="col-span-3"
              placeholder="Ville, pays ou plateforme"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="round" className="text-right">
              Ronde
            </Label>
            <Input
              id="round"
              value={metadata.round}
              onChange={(e) =>
                setMetadata({ ...metadata, round: e.target.value })
              }
              className="col-span-3"
              placeholder="Numéro de ronde"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="white" className="text-right">
              Blancs
            </Label>
            <Input
              id="white"
              value={metadata.white}
              onChange={(e) =>
                setMetadata({ ...metadata, white: e.target.value })
              }
              className="col-span-3"
              placeholder="Nom du joueur des Blancs"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="black" className="text-right">
              Noirs
            </Label>
            <Input
              id="black"
              value={metadata.black}
              onChange={(e) =>
                setMetadata({ ...metadata, black: e.target.value })
              }
              className="col-span-3"
              placeholder="Nom du joueur des Noirs"
            />
          </div>

          <div className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Aperçu du PGN</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copié
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copier
                  </>
                )}
              </Button>
            </div>

            <Textarea
              value={pgnPreview}
              readOnly
              className="font-mono text-xs h-48"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Télécharger
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
