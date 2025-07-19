import { create } from "zustand";

export type EditMode = "none" | "addNode" | "addEdgeStep1" | "addEdgeStep2";

interface NodeAlgoState {
  index: number | null;
  lowlink: number | null;
}

interface TarjanAlgoState {
  index: number;
  currentNode: string | null;
  stack: string[];
  indexMap: Record<string, number>;
  lowlinkMap: Record<string, number>;
  onStack: Set<string>;
  sccList: string[][];
  callStack: string[];
}

interface GraphStore {
  nodeCount: number;
  editMode: EditMode;
  selectedNodeForEdge: string | null;
  nodeAlgoState: Record<string, NodeAlgoState>;
  algoStack: string[];
  algoStep: number;
  algoState: TarjanAlgoState | null;

  setEditMode: (mode: EditMode) => void;
  incrementNodeCount: () => number;
  resetGraphState: () => void;

  setNodeAlgoState: (id: string, state: NodeAlgoState) => void;
  pushToStack: (id: string) => void;
  popFromStack: () => void;
  resetAlgoState: () => void;

  startAlgorithm: (graph: Record<string, string[]>) => void;
  nextStep: () => void;
}

export const useGraphStore = create<GraphStore>((set, get) => ({
  nodeCount: 0,
  editMode: "none",
  selectedNodeForEdge: null,
  nodeAlgoState: {},
  algoStack: [],
  algoStep: 0,
  algoState: null,

  setEditMode: (mode) => set({ editMode: mode }),

  incrementNodeCount: () => {
    const count = get().nodeCount + 1;
    set({ nodeCount: count });
    return count;
  },

  resetGraphState: () => {
    set({
      nodeCount: 0,
      editMode: "none",
      selectedNodeForEdge: null,
      nodeAlgoState: {},
      algoStack: [],
      algoStep: 0,
      algoState: null,
    });
  },

  setNodeAlgoState: (id, state) =>
    set((s) => ({
      nodeAlgoState: { ...s.nodeAlgoState, [id]: state },
    })),

  pushToStack: (id) =>
    set((s) => ({
      algoStack: [...s.algoStack, id],
    })),

  popFromStack: () =>
    set((s) => ({
      algoStack: s.algoStack.slice(0, -1),
    })),

  resetAlgoState: () =>
    set({
      nodeAlgoState: {},
      algoStack: [],
      algoStep: 0,
      algoState: null,
    }),

  startAlgorithm: (graph) => {
    const nodeIds = Object.keys(graph);
    if (nodeIds.length === 0) return;

    const initialNode = nodeIds[0];

    set({
      algoState: {
        index: 0,
        currentNode: initialNode,
        stack: [],
        indexMap: {},
        lowlinkMap: {},
        onStack: new Set(),
        sccList: [],
        callStack: [initialNode],
      },
      algoStep: 0,
    });
  },

  nextStep: () => {
    const state = get().algoState;
    if (!state) return;
    // Étapes à implémenter dans le futur
  },
}));
