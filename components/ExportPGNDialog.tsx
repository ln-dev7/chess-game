"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { GameState } from "@/types/chess";
import { generatePGN, downloadPGN } from "@/lib/pgn-utils";
import {
  exportBoardAsImage,
  exportFEN,
  copyToClipboard,
  downloadBlob,
  generateExportFilename,
} from "@/lib/export-utils";
import { useTimeControlStore } from "@/store/useTimeControlStore";
import { formatTimeControlForPGN } from "@/lib/time-controls";
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
  Code,
} from "lucide-react";

type ExportFormat = "pgn" | "fen" | "image";

interface ExportPGNDialogProps {
  gameState: GameState;
}

export default function ExportPGNDialog({ gameState }: ExportPGNDialogProps) {
  const t = useTranslations("export");
  const tDialog = useTranslations("dialog");
  const { selectedTimeControl } = useTimeControlStore();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ExportFormat>("pgn");
  const [metadata, setMetadata] = useState({
    event: "Casual Game",
    site: "Chess Game by lndev.me",
    round: "1",
    white: "Player 1",
    black: "Player 2",
    whiteElo: "",
    blackElo: "",
  });
  const [pgnPreview, setPgnPreview] = useState("");
  const [fenPreview, setFenPreview] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Générer les previews automatiquement
  useEffect(() => {
    if (open) {
      const today = new Date();
      const dateStr = `${today.getFullYear()}.${String(
        today.getMonth() + 1
      ).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

      // PGN Preview - inclut automatiquement le time control
      const timeControl = formatTimeControlForPGN(selectedTimeControl);
      const pgn = generatePGN(gameState, {
        ...metadata,
        site: "Chess Game by lndev.me",
        date: dateStr,
        timeControl,
      });
      setPgnPreview(pgn);

      // FEN Preview
      const fen = exportFEN(gameState);
      setFenPreview(fen);

      // Image Preview
      generateImagePreview();
    }
  }, [open, metadata, gameState, selectedTimeControl]);

  const generateImagePreview = async () => {
    const blob = await exportBoardAsImage("chess-board-export");
    if (blob) {
      const url = URL.createObjectURL(blob);
      setImagePreview(url);
    }
  };

  useEffect(() => {
    // Cleanup de l'URL de preview quand le composant se démonte
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

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

    try {
      switch (activeTab) {
        case "pgn": {
          const today = new Date();
          const dateStr = `${today.getFullYear()}.${String(
            today.getMonth() + 1
          ).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

          const timeControl = formatTimeControlForPGN(selectedTimeControl);
          const pgn = generatePGN(gameState, {
            ...metadata,
            site: "Chess Game by lndev.me",
            date: dateStr,
            timeControl,
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
    } finally {
      setIsExporting(false);
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
          <TabsList className="grid w-full grid-cols-3">
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
                  placeholder="Casual Game"
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
                  placeholder="Player 1"
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
                  placeholder="Player 2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whiteElo" className="text-sm">
                  {t("whiteEloLabel")}
                </Label>
                <Input
                  id="whiteElo"
                  value={metadata.whiteElo}
                  onChange={(e) =>
                    setMetadata({ ...metadata, whiteElo: e.target.value })
                  }
                  placeholder="1500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="blackElo" className="text-sm">
                  {t("blackEloLabel")}
                </Label>
                <Input
                  id="blackElo"
                  value={metadata.blackElo}
                  onChange={(e) =>
                    setMetadata({ ...metadata, blackElo: e.target.value })
                  }
                  placeholder="1500"
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>{t("timeControlLabel")}:</strong>{" "}
                {formatTimeControlForPGN(selectedTimeControl)}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {t("timeControlAutomatic")}
              </p>
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
