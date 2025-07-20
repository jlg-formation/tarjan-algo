import { create } from "zustand";

export type NodeId = string;

export interface GraphNode {
  id: NodeId;
  label: string;
  position: { x: number; y: number };
}

export interface GraphEdge {
  id: string;
  from: NodeId;
  to: NodeId;
}

export type EditMode = "none" | "addNode" | "addEdgeStep1" | "addEdgeStep2";

export interface AlgoState {
  index: number;
  stack: NodeId[];
  callStack: NodeId[];
  onStack: Set<NodeId>;
  indexMap: Record<NodeId, number>;
  lowlinkMap: Record<NodeId, number>;
  visited: Set<NodeId>;
  currentNode: NodeId | null;
  sccs: NodeId[][];
  autoRun: boolean;
  intervalId: number | null;
}

interface GraphStore {
  editMode: EditMode;
  nodeCount: number;
  selectedNodeForEdge: NodeId | null;
  algoState: AlgoState | null;
  nodes: GraphNode[];
  edges: GraphEdge[];
  editable: boolean;

  setEditMode: (mode: EditMode) => void;
  getNextNodeId: () => string;
  setSelectedNodeForEdge: (id: NodeId | null) => void;
  addNode: (node: GraphNode) => void;
  addEdge: (edge: GraphEdge) => void;
  removeNode: (id: NodeId) => void;
  setEditable: (value: boolean) => void;
  resetGraph: () => void;
  /** @deprecated use resetGraph */
  resetGraphState?: () => void;

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
  nodes: [],
  edges: [],
  editable: true,

  setEditMode: (mode) => set({ editMode: mode }),

  getNextNodeId: () => {
    const count = get().nodeCount + 1;
    set({ nodeCount: count });
    return `node-${count}`;
  },

  setSelectedNodeForEdge: (id) => set({ selectedNodeForEdge: id }),

  addNode: (node) => set((s) => ({ nodes: [...s.nodes, node] })),

  addEdge: (edge) => set((s) => ({ edges: [...s.edges, edge] })),

  removeNode: (id) =>
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== id),
      edges: s.edges.filter((e) => e.from !== id && e.to !== id),
    })),

  setEditable: (value) => set({ editable: value }),

  resetGraph: () => {
    set({
      nodes: [],
      edges: [],
      nodeCount: 0,
      selectedNodeForEdge: null,
      algoState: null,
    });
  },

  // temporary alias for legacy code
  resetGraphState: () => {
    get().resetGraph();
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
