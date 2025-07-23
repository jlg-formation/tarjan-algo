import { create } from "zustand";
import { useGraphStore } from "./graphStore";
import type { NodeId } from "./graphStore";
import type { TarjanStateUpdate, Graph } from "../utils/tarjan";
import { tarjanStepByStep } from "../utils/tarjan";
import { useHistoryStore } from "./history";

export type AlgoStatus = "idle" | "running" | "done";

export interface AlgoState {
  indexMap: Map<NodeId, number>;
  lowLinkMap: Map<NodeId, number>;
  onStackMap: Map<NodeId, boolean>;
  stack: NodeId[];
  callStack: NodeId[];
  sccs: NodeId[][];
  currentIndex: number;
  currentStep: number;
  status: AlgoStatus;
  generator: Generator<TarjanStateUpdate> | null;
  lastUpdate: TarjanStateUpdate | null;
  autoRunning: boolean;
  intervalId: number | null;
  delay: number;
}

interface AlgoStore extends AlgoState {
  startAlgo: () => void;
  stepForward: () => void;
  stepBack: () => void;
  resetAlgo: () => void;
  startAutoRun: () => void;
  stopAutoRun: () => void;
  setDelay: (ms: number) => void;
}

const initialState: AlgoState = {
  indexMap: new Map(),
  lowLinkMap: new Map(),
  onStackMap: new Map(),
  stack: [],
  callStack: [],
  sccs: [],
  currentIndex: 0,
  currentStep: 0,
  status: "idle",
  generator: null,
  lastUpdate: null,
  autoRunning: false,
  intervalId: null,
  delay: 1000,
};

export const useAlgoStore = create<AlgoStore>((set, get) => ({
  ...initialState,

  startAlgo: () =>
    set(() => {
      const { intervalId } = get();
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
      const { nodes, edges } = useGraphStore.getState();
      const graph: Graph = { nodes, edges };
      const generator = tarjanStepByStep(graph);
      useHistoryStore.getState().reset();
      return {
        ...initialState,
        delay: get().delay,
        status: "running",
        generator,
        lastUpdate: null,
      };
    }),

  stepForward: () => {
    set((state) => {
      if (state.status !== "running" || !state.generator) {
        return state;
      }

      const next = state.generator.next();
      if (next.done) {
        return { ...state, status: "done" };
      }

      const update = next.value;
      useHistoryStore.getState().push(update);
      return {
        ...state,
        indexMap: update.indexMap,
        lowLinkMap: update.lowLinkMap,
        onStackMap: update.onStackMap,
        stack: update.stack,
        callStack: update.callStack,
        sccs: update.sccs,
        currentIndex: update.indexMap.size,
        currentStep: state.currentStep + 1,
        lastUpdate: update,
      };
    });
    if (get().status === "done") {
      get().stopAutoRun();
    }
  },

  stepBack: () =>
    set((state) => {
      if (state.currentStep === 0) {
        return state;
      }

      const { pop, last } = useHistoryStore.getState();
      const removed = pop();
      if (!removed) {
        return state;
      }

      const previous = last();
      if (!previous) {
        return {
          ...state,
          ...initialState,
          generator: state.generator,
          status: "running",
          currentStep: 0,
          lastUpdate: null,
        };
      }

      return {
        ...state,
        indexMap: previous.indexMap,
        lowLinkMap: previous.lowLinkMap,
        onStackMap: previous.onStackMap,
        stack: previous.stack,
        callStack: previous.callStack,
        sccs: previous.sccs,
        currentIndex: previous.indexMap.size,
        currentStep: state.currentStep - 1,
        lastUpdate: previous,
        status: state.status === "done" ? "running" : state.status,
      };
    }),

  startAutoRun: () => {
    const { intervalId, delay, stepForward, status } = get();
    if (status !== "running") return;
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
    const id = window.setInterval(() => {
      const { status: st } = get();
      if (st !== "running") {
        get().stopAutoRun();
        return;
      }
      stepForward();
    }, delay);
    set({ autoRunning: true, intervalId: id });
  },

  stopAutoRun: () => {
    const { intervalId } = get();
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
    set({ autoRunning: false, intervalId: null });
  },

  setDelay: (ms: number) => set({ delay: ms }),

  resetAlgo: () => {
    const { intervalId } = get();
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
    set(initialState);
  },
}));
