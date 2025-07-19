import { create } from "zustand";

type EditMode = "none" | "addNode" | "addEdgeStep1" | "addEdgeStep2";

interface NodeAlgoState {
  index: number | null;
  lowlink: number | null;
}

interface GraphStore {
  editMode: EditMode;
  nodeCount: number;
  selectedNodeForEdge: string | null; // <-- ajouté

  setEditMode: (mode: EditMode) => void;
  getNextNodeId: () => string;
  resetGraphState: () => void;
  setSelectedNodeForEdge: (id: string | null) => void; // <-- ajouté

  nodeAlgoState: Record<string, NodeAlgoState>;
  algoStack: string[];

  setNodeAlgoState: (id: string, state: NodeAlgoState) => void;
  pushToStack: (id: string) => void;
  popFromStack: () => void;
  resetAlgoState: () => void;
}

export const useGraphStore = create<GraphStore>((set, get) => ({
  editMode: "none",
  nodeCount: 0,
  selectedNodeForEdge: null,

  setEditMode: (mode) => set({ editMode: mode }),

  getNextNodeId: () => {
    const count = get().nodeCount;
    const newId = `N${count + 1}`;
    set({ nodeCount: count + 1 });
    return newId;
  },

  resetGraphState: () => {
    set({ nodeCount: 0, editMode: "none", selectedNodeForEdge: null });
  },

  setSelectedNodeForEdge: (id) => set({ selectedNodeForEdge: id }),

  nodeAlgoState: {},
  algoStack: [],

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
    }),
}));
