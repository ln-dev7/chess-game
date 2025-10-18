"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  usePreferencesStore,
  AnimationSpeed,
} from "@/store/usePreferencesStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useGameModeStore } from "@/store/useGameModeStore";
import { useTimeControlStore } from "@/store/useTimeControlStore";
import { TIME_CONTROLS } from "@/lib/time-controls";

interface PreferencesDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PreferencesDialog({
  isOpen,
  onClose,
}: PreferencesDialogProps) {
  const t = useTranslations("preferences");
  const tCommon = useTranslations("common");

  const {
    boardRotation,
    showCoordinates,
    animationSpeed,
    checkmateAnimationEnabled,
    soundEnabled,
    soundVolume,
    setBoardRotation,
    setShowCoordinates,
    setAnimationSpeed,
    setCheckmateAnimationEnabled,
    setSoundEnabled,
    setSoundVolume,
  } = usePreferencesStore();

  const { setThemeId, setPieceStyleId } = useThemeStore();
  const { setGameMode, setAILevel, setAIColor } = useGameModeStore();
  const { setTimeControl } = useTimeControlStore();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t("title")}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6 py-4">
            {/* Section Apparence */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Appearance
              </h3>

              {/* Rotation de l'échiquier */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Label
                    htmlFor="board-rotation"
                    className="text-sm font-medium"
                  >
                    {t("boardRotation")}
                  </Label>
                  <p className="text-xs text-gray-600 mt-1">
                    {boardRotation
                      ? `${tCommon("black")} at bottom`
                      : `${tCommon("white")} at bottom`}
                  </p>
                </div>
                <button
                  id="board-rotation"
                  onClick={() => setBoardRotation(!boardRotation)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    boardRotation ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      boardRotation ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Affichage des coordonnées */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Label
                    htmlFor="show-coordinates"
                    className="text-sm font-medium"
                  >
                    {t("coordinates")}
                  </Label>
                  <p className="text-xs text-gray-600 mt-1">
                    Letters and numbers on the board
                  </p>
                </div>
                <button
                  id="show-coordinates"
                  onClick={() => setShowCoordinates(!showCoordinates)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    showCoordinates ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showCoordinates ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Section Animation */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Animation
              </h3>

              <div className="space-y-2">
                <Label
                  htmlFor="animation-speed"
                  className="text-sm font-medium"
                >
                  {t("animationSpeed")}
                </Label>
                <Select
                  value={animationSpeed}
                  onValueChange={(value) =>
                    setAnimationSpeed(value as AnimationSpeed)
                  }
                >
                  <SelectTrigger id="animation-speed">
                    <SelectValue placeholder="Select speed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">{t("slow")}</SelectItem>
                    <SelectItem value="normal">{t("normal")}</SelectItem>
                    <SelectItem value="fast">{t("fast")}</SelectItem>
                    <SelectItem value="instant">{t("instant")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Animation d'échec et mat */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Label
                    htmlFor="checkmate-animation"
                    className="text-sm font-medium"
                  >
                    {t("checkmateAnimation")}
                  </Label>
                  <p className="text-xs text-gray-600 mt-1">
                    Show celebration animation on checkmate
                  </p>
                </div>
                <button
                  id="checkmate-animation"
                  onClick={() =>
                    setCheckmateAnimationEnabled(!checkmateAnimationEnabled)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    checkmateAnimationEnabled ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      checkmateAnimationEnabled
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Section Son */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                {t("sound")}
              </h3>

              {/* Activation/Désactivation du son */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Label
                    htmlFor="sound-enabled"
                    className="text-sm font-medium"
                  >
                    {t("sound")}
                  </Label>
                  <p className="text-xs text-gray-600 mt-1">
                    Move, capture, check sounds, etc.
                  </p>
                </div>
                <button
                  id="sound-enabled"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    soundEnabled ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      soundEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Volume */}
              {soundEnabled && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="volume" className="text-sm font-medium">
                      {t("volume")}
                    </Label>
                    <span className="text-sm text-gray-500">
                      {Math.round(soundVolume * 100)}%
                    </span>
                  </div>
                  <input
                    id="volume"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={soundVolume}
                    onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${
                        soundVolume * 100
                      }%, #e5e7eb ${soundVolume * 100}%, #e5e7eb 100%)`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-between gap-2 pt-4 border-t">
          <button
            onClick={() => {
              if (confirm(t("resetConfirm"))) {
                // Réinitialiser TOUTES les préférences
                setBoardRotation(false);
                setShowCoordinates(true);
                setAnimationSpeed("normal");
                setCheckmateAnimationEnabled(true);
                setSoundEnabled(true);
                setSoundVolume(0.3);

                // Réinitialiser les thèmes
                setThemeId("wood");
                setPieceStyleId("colorful");

                // Réinitialiser le mode de jeu
                setGameMode("pvp");
                setAILevel(1200);
                setAIColor("black");

                // Réinitialiser le type de partie
                setTimeControl(TIME_CONTROLS[8]); // Rapid 10+0
              }
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {t("reset")}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t("close")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
