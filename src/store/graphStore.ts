import { create } from "zustand";

export type EditMode = "none" | "addNode" | "addEdgeStep1" | "addEdgeStep2";

export interface AlgoState {
  index: number;
  stack: string[];
  callStack: string[];
  onStack: Set<string>;
  indexMap: Record<string, number>;
  lowlinkMap: Record<string, number>;
  visited: Set<string>;
  currentNode: string | null;
  sccs: string[][];
  autoRun: boolean;
  intervalId: number | null;
}

interface GraphStore {
  editMode: EditMode;
  nodeCount: number;
  selectedNodeForEdge: string | null;
  algoState: AlgoState | null;

  setEditMode: (mode: EditMode) => void;
  getNextNodeId: () => string;
  setSelectedNodeForEdge: (id: string | null) => void;
  resetGraphState: () => void;

  initAlgoState: () => void;
  nextStep: () => void;
  startAutoRun: () => void;
  stopAutoRun: () => void;
}

export const useGraphStore = create<GraphStore>((set, get) => ({
  editMode: "none",
  nodeCount: 0,
  selectedNodeForEdge: null,
  algoState: null,

  setEditMode: (mode) => set({ editMode: mode }),

  getNextNodeId: () => {
    const count = get().nodeCount + 1;
    set({ nodeCount: count });
    return `node-${count}`;
  },

  setSelectedNodeForEdge: (id) => set({ selectedNodeForEdge: id }),

  resetGraphState: () => {
    set({ nodeCount: 0, selectedNodeForEdge: null, algoState: null });
  },

  initAlgoState: () => {
    set({
      algoState: {
        index: 0,
        stack: [],
        callStack: [],
        onStack: new Set(),
        indexMap: {},
        lowlinkMap: {},
        visited: new Set(),
        currentNode: null,
        sccs: [],
        autoRun: false,
        intervalId: null,
      },
    });
  },

  nextStep: () => {
    const state = get().algoState;
    if (!state) return;
    // à compléter plus tard
    console.log("Étape suivante (à implémenter)");
  },

  startAutoRun: () => {
    const { algoState, nextStep } = get();

    // Si non initialisé, initialiser
    if (!algoState) {
      const newState: AlgoState = {
        index: 0,
        stack: [],
        callStack: [],
        onStack: new Set(),
        indexMap: {},
        lowlinkMap: {},
        visited: new Set(),
        currentNode: null,
        sccs: [],
        autoRun: true,
        intervalId: null,
      };
      const intervalId = window.setInterval(() => get().nextStep(), 1000);
      newState.intervalId = intervalId;
      set({ algoState: newState });
      return;
    }

    // Sinon on met à jour
    const intervalId = window.setInterval(() => nextStep(), 1000);
    set((s) => ({
      algoState: {
        ...s.algoState!,
        autoRun: true,
        intervalId,
      },
    }));
  },

  stopAutoRun: () => {
    const { algoState } = get();
    if (!algoState) return;

    if (algoState.intervalId !== null) {
      clearInterval(algoState.intervalId);
    }

    set({
      algoState: {
        ...algoState,
        autoRun: false,
        intervalId: null,
      },
    });
  },
}));
