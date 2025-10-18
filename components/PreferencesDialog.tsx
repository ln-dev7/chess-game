"use client";

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
import { usePreferencesStore, AnimationSpeed } from "@/store/usePreferencesStore";

interface PreferencesDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PreferencesDialog({
  isOpen,
  onClose,
}: PreferencesDialogProps) {
  const {
    boardRotation,
    showCoordinates,
    animationSpeed,
    soundEnabled,
    soundVolume,
    setBoardRotation,
    setShowCoordinates,
    setAnimationSpeed,
    setSoundEnabled,
    setSoundVolume,
  } = usePreferencesStore();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Paramètres</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6 py-4">
            {/* Section Apparence */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Apparence
              </h3>

              {/* Rotation de l'échiquier */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="board-rotation" className="text-sm font-medium">
                    Rotation de l&apos;échiquier
                  </Label>
                  <p className="text-xs text-gray-600 mt-1">
                    {boardRotation ? "Noirs en bas" : "Blancs en bas"}
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
                  <Label htmlFor="show-coordinates" className="text-sm font-medium">
                    Afficher les coordonnées
                  </Label>
                  <p className="text-xs text-gray-600 mt-1">
                    Lettres et chiffres sur l&apos;échiquier
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
                <Label htmlFor="animation-speed" className="text-sm font-medium">
                  Vitesse des animations
                </Label>
                <Select
                  value={animationSpeed}
                  onValueChange={(value) => setAnimationSpeed(value as AnimationSpeed)}
                >
                  <SelectTrigger id="animation-speed">
                    <SelectValue placeholder="Sélectionner la vitesse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Lente</SelectItem>
                    <SelectItem value="normal">Normale</SelectItem>
                    <SelectItem value="fast">Rapide</SelectItem>
                    <SelectItem value="instant">Instantanée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Section Son */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Son
              </h3>

              {/* Activation/Désactivation du son */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="sound-enabled" className="text-sm font-medium">
                    Effets sonores
                  </Label>
                  <p className="text-xs text-gray-600 mt-1">
                    Sons de déplacement, capture, échec, etc.
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
                      Volume
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
                    onChange={(e) =>
                      setSoundVolume(parseFloat(e.target.value))
                    }
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

        <div className="flex justify-end gap-2 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fermer
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
