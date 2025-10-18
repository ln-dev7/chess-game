"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Clock, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  TIME_CONTROLS,
  TimeControl,
  TimeControlType,
} from "@/lib/time-controls";
import { useTimeControlStore } from "@/store/useTimeControlStore";

interface TimeControlSelectorProps {
  gameStarted?: boolean;
}

export default function TimeControlSelector({
  gameStarted = false,
}: TimeControlSelectorProps) {
  const t = useTranslations("timeControl");
  const [open, setOpen] = useState(false);
  const { selectedTimeControl, setTimeControl } = useTimeControlStore();

  const handleSelectTimeControl = (timeControl: TimeControl) => {
    setTimeControl(timeControl);
    setOpen(false);
  };

  // Grouper les contrôles par type
  const groupedControls: Record<TimeControlType, TimeControl[]> = {
    none: [],
    bullet: [],
    blitz: [],
    rapid: [],
    classical: [],
  };

  TIME_CONTROLS.forEach((control) => {
    groupedControls[control.type].push(control);
  });

  const typeLabels: Record<TimeControlType, string> = {
    none: t("noTime"),
    bullet: t("bullet"),
    blitz: t("blitz"),
    rapid: t("rapid"),
    classical: t("classical"),
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (gameStarted && isOpen) {
          // Ne pas ouvrir si une partie est en cours
          return;
        }
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full"
          disabled={gameStarted}
          title={gameStarted ? t("cannotChange") : ""}
        >
          <Clock className="w-4 h-4 mr-2" />
          {t("title")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Clock className="w-6 h-6" />
            {t("title")}
          </DialogTitle>
          {gameStarted ? (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md mt-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <p className="text-sm text-amber-800">{t("cannotChange")}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-600 mt-2">
              {t("currently")}:{" "}
              <span className="font-semibold">
                {selectedTimeControl.id
                  ? t(`controls.${selectedTimeControl.id}.name`)
                  : selectedTimeControl.name}
              </span>
            </p>
          )}
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6 py-4">
            {(Object.keys(groupedControls) as TimeControlType[]).map((type) => {
              const controls = groupedControls[type];
              if (controls.length === 0) return null;

              return (
                <div key={type} className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    {typeLabels[type]}
                  </h3>
                  <div className="grid gap-2">
                    {controls.map((control, index) => {
                      const isSelected =
                        selectedTimeControl.name === control.name &&
                        selectedTimeControl.initialTime ===
                          control.initialTime &&
                        selectedTimeControl.increment === control.increment;

                      return (
                        <button
                          key={`${control.type}-${index}`}
                          onClick={() => handleSelectTimeControl(control)}
                          className={`text-left p-4 rounded-lg border-2 transition-all hover:border-blue-400 ${
                            isSelected
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-gray-900">
                                {control.id
                                  ? t(`controls.${control.id}.name`)
                                  : control.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {control.id
                                  ? t(`controls.${control.id}.description`)
                                  : control.description}
                              </div>
                            </div>
                            {isSelected && (
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600">
                                <svg
                                  className="w-4 h-4 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
