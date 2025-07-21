import { create } from "zustand";
import { useGraphStore } from "./graphStore";
import type { NodeId } from "./graphStore";
import type { TarjanStateUpdate, Graph } from "../utils/tarjan";
import { tarjanStepByStep } from "../utils/tarjan";

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
  generator: Generator<TarjanStateUpdate> | null;
  lastUpdate: TarjanStateUpdate | null;
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
  generator: null,
  lastUpdate: null,
};

export const useAlgoStore = create<AlgoStore>((set) => ({
  ...initialState,

  startAlgo: () =>
    set(() => {
      const { nodes, edges } = useGraphStore.getState();
      const graph: Graph = { nodes, edges };
      const generator = tarjanStepByStep(graph);
      return {
        ...initialState,
        status: "running",
        generator,
        lastUpdate: null,
      };
    }),

  stepForward: () =>
    set((state) => {
      if (state.status !== "running" || !state.generator) {
        return state;
      }

      const next = state.generator.next();
      if (next.done) {
        return { ...state, status: "done" };
      }

      const update = next.value;
      return {
        ...state,
        indexMap: update.indexMap,
        lowLinkMap: update.lowLinkMap,
        onStackMap: update.onStackMap,
        stack: update.stack,
        sccs: update.sccs,
        currentIndex: update.indexMap.size,
        currentStep: state.currentStep + 1,
        lastUpdate: update,
      };
    }),

  stepBack: () =>
    set((state) => ({
      currentStep: Math.max(0, state.currentStep - 1),
      lastUpdate: null,
    })),

  resetAlgo: () => set(initialState),
}));
