import { create } from "zustand";
import type { TarjanStateUpdate } from "../utils/tarjan";

interface HistoryStore {
  stack: TarjanStateUpdate[];
  push: (update: TarjanStateUpdate) => void;
  pop: () => TarjanStateUpdate | undefined;
  last: () => TarjanStateUpdate | undefined;
  reset: () => void;
}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  stack: [],
  push: (update) => set((s) => ({ stack: [...s.stack, update] })),
  pop: () => {
    let popped: TarjanStateUpdate | undefined;
    set((s) => {
      const copy = [...s.stack];
      popped = copy.pop();
      return { stack: copy };
    });
    return popped;
  },
  last: () => {
    const { stack } = get();
    return stack[stack.length - 1];
  },
  reset: () => set({ stack: [] }),
}));
