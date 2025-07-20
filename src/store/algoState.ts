import { create } from "zustand";
import type { NodeId } from "./graphStore";

export type AlgoStatus = "idle" | "running" | "done";

export interface AlgoState {
  indexMap: Map<NodeId, number>;
  lowLinkMap: Map<NodeId, number>;
  onStackMap: Map<NodeId, boolean>;
  stack: NodeId[];
  sccs: NodeId[][];
  currentIndex: number;
  currentStep: number;
  status: AlgoStatus;
}

interface AlgoStore extends AlgoState {
  startAlgo: () => void;
  stepForward: () => void;
  stepBack: () => void;
  resetAlgo: () => void;
}

const initialState: AlgoState = {
  indexMap: new Map(),
  lowLinkMap: new Map(),
  onStackMap: new Map(),
  stack: [],
  sccs: [],
  currentIndex: 0,
  currentStep: 0,
  status: "idle",
};

export const useAlgoStore = create<AlgoStore>((set) => ({
  ...initialState,

  startAlgo: () =>
    set({
      ...initialState,
      status: "running",
    }),

  stepForward: () =>
    set((state) => ({
      currentStep: state.currentStep + 1,
    })),

  stepBack: () =>
    set((state) => ({
      currentStep: Math.max(0, state.currentStep - 1),
    })),

  resetAlgo: () => set(initialState),
}));
