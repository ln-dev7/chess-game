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
      selectedTimeControl: TIME_CONTROLS[0], // "Sans limite" par défaut

      setTimeControl: (timeControl) => set({ selectedTimeControl: timeControl }),
    }),
    {
      name: "chess-time-control",
    }
  )
);
