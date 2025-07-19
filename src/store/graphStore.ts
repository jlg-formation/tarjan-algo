import { create } from "zustand";

type EditMode = "none" | "addNode" | "addEdgeStep1" | "addEdgeStep2";

interface GraphStore {
  editMode: EditMode;
  nodeCount: number;
  selectedNodeForEdge: string | null; // <-- ajouté

  setEditMode: (mode: EditMode) => void;
  getNextNodeId: () => string;
  resetGraphState: () => void;
  setSelectedNodeForEdge: (id: string | null) => void; // <-- ajouté
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
}));
