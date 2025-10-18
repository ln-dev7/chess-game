"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TIME_CONTROLS, TimeControl, TimeControlType } from "@/lib/time-controls";
import { useTimeControlStore } from "@/store/useTimeControlStore";

export default function TimeControlSelector() {
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
    none: "Sans limite",
    bullet: "Bullet (1-2 min)",
    blitz: "Blitz (3-5 min)",
    rapid: "Rapid (10-30 min)",
    classical: "Classique (60+ min)",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Clock className="w-4 h-4 mr-2" />
          Type de partie
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Clock className="w-6 h-6" />
            Type de partie
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            Actuellement : <span className="font-semibold">{selectedTimeControl.name}</span>
          </p>
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
                        selectedTimeControl.initialTime === control.initialTime &&
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
                                {control.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {control.description}
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
