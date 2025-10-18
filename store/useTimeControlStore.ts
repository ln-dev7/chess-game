import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TimeControl, TIME_CONTROLS } from "@/lib/time-controls";

interface TimeControlState {
  selectedTimeControl: TimeControl;
  setTimeControl: (timeControl: TimeControl) => void;
}

export const useTimeControlStore = create<TimeControlState>()(
  persist(
    (set) => ({
      selectedTimeControl: TIME_CONTROLS[8], // "Rapid 10+0" par défaut

      setTimeControl: (timeControl) =>
        set({ selectedTimeControl: timeControl }),
    }),
    {
      name: "chess-time-control",
      version: 1,
      migrate: (persistedState: any, version: number) => {
        // Migration pour ajouter le champ 'id' aux anciens TimeControl
        if (version === 0) {
          const state = persistedState as TimeControlState;

          // Si l'ancien TimeControl n'a pas d'id, on cherche le bon dans TIME_CONTROLS
          if (!state.selectedTimeControl.id) {
            const matchingControl = TIME_CONTROLS.find(
              (control) =>
                control.initialTime === state.selectedTimeControl.initialTime &&
                control.increment === state.selectedTimeControl.increment
            );

            // Si on trouve une correspondance, on l'utilise, sinon on prend le défaut
            state.selectedTimeControl = matchingControl || TIME_CONTROLS[8];
          }
        }

        return persistedState as TimeControlState;
      },
    }
  )
);
