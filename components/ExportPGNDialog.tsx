"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { GameState } from "@/types/chess";
import { generatePGN, downloadPGN } from "@/lib/pgn-utils";
import {
  exportBoardAsImage,
  exportGameAsGif,
  exportFEN,
  copyToClipboard,
  downloadBlob,
  generateExportFilename,
} from "@/lib/export-utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Download,
  Copy,
  Check,
  FileText,
  Image as ImageIcon,
  Film,
  Code,
} from "lucide-react";

type ExportFormat = "pgn" | "fen" | "image" | "gif";

interface ExportPGNDialogProps {
  gameState: GameState;
  onTempGameStateChange?: (state: GameState | null) => void;
}

export default function ExportPGNDialog({
  gameState,
  onTempGameStateChange,
}: ExportPGNDialogProps) {
  const t = useTranslations("export");
  const tDialog = useTranslations("dialog");
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ExportFormat>("pgn");
  const [metadata, setMetadata] = useState({
    event: "Partie locale",
    site: "Chess Game by lndev.me",
    round: "1",
    white: "Joueur 1 (Blancs)",
    black: "Joueur 2 (Noirs)",
  });
  const [pgnPreview, setPgnPreview] = useState("");
  const [fenPreview, setFenPreview] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [gifPreview, setGifPreview] = useState<string | null>(null);
  const [isGeneratingGifPreview, setIsGeneratingGifPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [imageGenerationKey, setImageGenerationKey] = useState(0);
  const [gifGenerationKey, setGifGenerationKey] = useState(0);
  const [abortGifGeneration, setAbortGifGeneration] = useState(false);

  // Générer les previews PGN et FEN automatiquement
  useEffect(() => {
    if (open) {
      const today = new Date();
      const dateStr = `${today.getFullYear()}.${String(
        today.getMonth() + 1
      ).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

      // PGN Preview
      const pgn = generatePGN(gameState, {
        ...metadata,
        site: "Chess Game by lndev.me",
        date: dateStr,
      });
      setPgnPreview(pgn);

      // FEN Preview
      const fen = exportFEN(gameState);
      setFenPreview(fen);
    }
  }, [open, metadata, gameState]);

  // Générer l'image preview quand l'onglet IMAGE est activé
  useEffect(() => {
    if (open && activeTab === "image" && imageGenerationKey > 0) {
      generateImagePreview();
    }
  }, [open, activeTab, imageGenerationKey]);

  // Générer le GIF preview quand l'onglet GIF est activé
  useEffect(() => {
    if (
      open &&
      activeTab === "gif" &&
      gifGenerationKey > 0 &&
      !isGeneratingGifPreview &&
      gameState.moveHistory.length > 0
    ) {
      generateGifPreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeTab, gifGenerationKey, isGeneratingGifPreview]);

  const generateImagePreview = async () => {
    const blob = await exportBoardAsImage("chess-board-export");
    if (blob) {
      const url = URL.createObjectURL(blob);
      setImagePreview(url);
    }
  };

  const generateGifPreview = async () => {
    if (gameState.moveHistory.length === 0) return;

    setAbortGifGeneration(false);
    setIsGeneratingGifPreview(true);
    setExportProgress(0);

    try {
      const blob = await exportGameAsGif(
        gameState,
        "chess-board-export",
        setExportProgress,
        onTempGameStateChange,
        () => abortGifGeneration, // Vérifier si on doit annuler
        false // Preview: jouer une seule fois (pas de boucle infinie)
      );

      // Ne rien faire si la génération a été annulée
      if (abortGifGeneration) {
        // Restaurer l'état immédiatement
        if (onTempGameStateChange) {
          onTempGameStateChange(null);
        }
        return;
      }

      if (blob) {
        const url = URL.createObjectURL(blob);
        setGifPreview(url);
      }

      // Restaurer l'état original après génération réussie
      if (onTempGameStateChange) {
        onTempGameStateChange(null);
      }
    } catch (error) {
      console.error("Error generating GIF preview:", error);
      // Restaurer l'état en cas d'erreur
      if (onTempGameStateChange) {
        onTempGameStateChange(null);
      }
    } finally {
      setIsGeneratingGifPreview(false);
      setExportProgress(0);
    }
  };

  useEffect(() => {
    // Cleanup de l'URL de preview quand le composant se démonte
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      if (gifPreview) {
        URL.revokeObjectURL(gifPreview);
      }
      // Restaurer l'état du jeu au démontage
      if (onTempGameStateChange) {
        onTempGameStateChange(null);
      }
    };
  }, [imagePreview, gifPreview, onTempGameStateChange]);

  // Réinitialiser les états quand le dialog se ferme/ouvre
  useEffect(() => {
    if (!open) {
      // Annuler toute génération en cours
      setAbortGifGeneration(true);

      // Restaurer IMMÉDIATEMENT l'état du jeu
      if (onTempGameStateChange) {
        onTempGameStateChange(null);
      }

      // Nettoyer toutes les previews
      setImagePreview(null);
      setGifPreview(null);
      setIsGeneratingGifPreview(false);
      setExportProgress(0);
      // Réinitialiser les clés de génération
      setImageGenerationKey(0);
      setGifGenerationKey(0);
    } else {
      // Toujours revenir à l'onglet PGN quand on ouvre le dialog
      setActiveTab("pgn");
      setAbortGifGeneration(false);
    }
  }, [open, onTempGameStateChange]);

  // Réinitialiser les previews quand on change d'onglet et générer de nouvelles clés
  useEffect(() => {
    // TOUJOURS restaurer l'état d'abord (au cas où on vient de l'onglet GIF)
    if (activeTab !== "gif" && onTempGameStateChange) {
      onTempGameStateChange(null);
    }

    // Incrémenter la clé et nettoyer l'image preview si on arrive sur l'onglet image
    if (activeTab === "image") {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(null);
      setImageGenerationKey((prev) => prev + 1);
    }

    // Incrémenter la clé et nettoyer le GIF preview si on arrive sur l'onglet gif
    if (activeTab === "gif") {
      if (gifPreview) {
        URL.revokeObjectURL(gifPreview);
      }
      setGifPreview(null);
      setIsGeneratingGifPreview(false);
      setExportProgress(0);
      setGifGenerationKey((prev) => prev + 1);
      setAbortGifGeneration(false); // Réinitialiser le flag d'annulation
    }

    // Nettoyer les previews si on quitte ces onglets
    if (activeTab !== "image" && imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }

    if (activeTab !== "gif") {
      // Annuler toute génération GIF en cours si on quitte l'onglet
      if (isGeneratingGifPreview) {
        setAbortGifGeneration(true);
      }

      if (gifPreview) {
        URL.revokeObjectURL(gifPreview);
        setGifPreview(null);
      }

      setIsGeneratingGifPreview(false);
      setExportProgress(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleCopy = async () => {
    let textToCopy = "";

    switch (activeTab) {
      case "pgn":
        textToCopy = pgnPreview;
        break;
      case "fen":
        textToCopy = fenPreview;
        break;
      default:
        return;
    }

    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      switch (activeTab) {
        case "pgn": {
          const today = new Date();
          const dateStr = `${today.getFullYear()}.${String(
            today.getMonth() + 1
          ).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

          const pgn = generatePGN(gameState, {
            ...metadata,
            site: "Chess Game by lndev.me",
            date: dateStr,
          });

          downloadPGN(pgn, generateExportFilename("pgn"));
          break;
        }

        case "image": {
          const blob = await exportBoardAsImage("chess-board-export");
          if (blob) {
            downloadBlob(blob, generateExportFilename("png"));
          }
          break;
        }

        case "gif": {
          const blob = await exportGameAsGif(
            gameState,
            "chess-board-export",
            setExportProgress,
            onTempGameStateChange,
            undefined, // Pas d'annulation pour le download
            true // Download: boucle infinie
          );
          if (blob) {
            downloadBlob(blob, generateExportFilename("gif"));
          }
          // Restaurer l'état original
          if (onTempGameStateChange) {
            onTempGameStateChange(null);
          }
          break;
        }

        case "fen": {
          const fen = exportFEN(gameState);
          const blob = new Blob([fen], { type: "text/plain;charset=utf-8" });
          downloadBlob(blob, generateExportFilename("fen"));
          break;
        }
      }

      setOpen(false);
    } catch (error) {
      console.error("Export error:", error);
      // Restaurer l'état en cas d'erreur
      if (onTempGameStateChange) {
        onTempGameStateChange(null);
      }
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Download className="w-4 h-4 mr-2" />
          {t("title")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as ExportFormat)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pgn" className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 hidden sm:block" />
              <span>{t("formats.pgn")}</span>
            </TabsTrigger>
            <TabsTrigger value="fen" className="flex items-center gap-1.5">
              <Code className="w-4 h-4 hidden sm:block" />
              <span>{t("formats.fen")}</span>
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 hidden sm:block" />
              <span>{t("formats.image")}</span>
            </TabsTrigger>
            <TabsTrigger value="gif" className="flex items-center gap-1.5">
              <Film className="w-4 h-4 hidden sm:block" />
              <span>{t("formats.gif")}</span>
            </TabsTrigger>
          </TabsList>

          {/* PGN Tab */}
          <TabsContent value="pgn" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              {t("formats.pgnDescription")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="event" className="text-sm">
                  {t("eventLabel")}
                </Label>
                <Input
                  id="event"
                  value={metadata.event}
                  onChange={(e) =>
                    setMetadata({ ...metadata, event: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="white" className="text-sm">
                  {t("whiteLabel")}
                </Label>
                <Input
                  id="white"
                  value={metadata.white}
                  onChange={(e) =>
                    setMetadata({ ...metadata, white: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="black" className="text-sm">
                  {t("blackLabel")}
                </Label>
                <Input
                  id="black"
                  value={metadata.black}
                  onChange={(e) =>
                    setMetadata({ ...metadata, black: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  {t("formats.preview")}
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      {t("copied")}
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      {t("copy")}
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
          </TabsContent>

          {/* FEN Tab */}
          <TabsContent value="fen" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              {t("formats.fenDescription")}
            </p>

            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <Label className="text-sm font-medium">
                  {t("formats.fenNotation")}
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      {t("copied")}
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      {t("copy")}
                    </>
                  )}
                </Button>
              </div>

              <Textarea
                value={fenPreview}
                readOnly
                className="font-mono text-xs sm:text-sm h-32 sm:h-24 break-all"
              />
            </div>

            <div className="p-3 sm:p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                {t("formats.fenInfo")}
              </p>
            </div>
          </TabsContent>

          {/* IMAGE Tab */}
          <TabsContent value="image" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              {t("formats.imageDescription")}
            </p>

            {imagePreview ? (
              <div className="border rounded-lg overflow-hidden bg-muted/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Board preview"
                  className="w-full h-auto"
                />
              </div>
            ) : (
              <div className="p-8 bg-muted/50 rounded-lg text-center">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">{t("formats.imageReady")}</p>
              </div>
            )}
          </TabsContent>

          {/* GIF Tab */}
          <TabsContent value="gif" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              {t("formats.gifDescription")}
            </p>

            {isGeneratingGifPreview && !gifPreview && (
              <div className="space-y-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${exportProgress}%` }}
                  />
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  {t("formats.gifProgress", {
                    progress: Math.round(exportProgress),
                  })}
                </p>
              </div>
            )}

            {gifPreview ? (
              <div className="border rounded-lg overflow-hidden bg-muted/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={gifPreview}
                  alt="Animated GIF preview"
                  className="w-full h-auto"
                />
                <div className="p-4 bg-background border-t">
                  <p className="text-sm text-muted-foreground">
                    {t("formats.gifInfo", {
                      moves: gameState.moveHistory.length,
                    })}
                  </p>
                </div>
              </div>
            ) : !isGeneratingGifPreview ? (
              <div className="p-8 bg-muted/50 rounded-lg text-center">
                <Film className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">{t("formats.gifReady")}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("formats.gifInfo", {
                    moves: gameState.moveHistory.length,
                  })}
                </p>
              </div>
            ) : null}
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isExporting}
            className="w-full sm:w-auto"
          >
            {tDialog("cancel")}
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full sm:w-auto"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                {t("exporting")}
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                {t("download")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
