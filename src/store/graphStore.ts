import { create } from "zustand";
import { useAlgoStore } from "./algoState";

export type NodeId = string;

export interface NodeStatus {
  visited: boolean;
  onStack: boolean;
  sccIndex: number | null;
}

export interface GraphNode {
  id: NodeId;
  label: string;
  position: { x: number; y: number };
  status: NodeStatus;
}

export interface GraphEdge {
  id: string;
  from: NodeId;
  to: NodeId;
}

export type EditMode = "none" | "addEdgeStep1" | "addEdgeStep2";

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
  selectedNodes: NodeId[];
  algoState: AlgoState | null;
  nodes: GraphNode[];
  edges: GraphEdge[];
  editable: boolean;

  setEditMode: (mode: EditMode) => void;
  getNextNodeId: () => string;
  setSelectedNodeForEdge: (id: NodeId | null) => void;
  toggleNodeSelection: (id: NodeId) => void;
  clearSelection: () => void;
  removeSelectedNodes: () => void;
  addNode: (node: Omit<GraphNode, "status">) => void;
  addEdge: (edge: GraphEdge) => void;
  removeNode: (id: NodeId) => void;
  removeEdge: (id: string) => void;
  setNodes: (nodes: Omit<GraphNode, "status">[]) => void;
  setEdges: (edges: GraphEdge[]) => void;
  setEditable: (value: boolean) => void;
  resetGraph: () => void;
  /** @deprecated use resetGraph */
  resetGraphState?: () => void;

  updateNodeStatuses: (params: {
    indexMap: Map<NodeId, number>;
    onStackMap: Map<NodeId, boolean>;
    sccs: NodeId[][];
  }) => void;

  initAlgoState: () => void;
  nextStep: () => void;
  startAutoRun: () => void;
  stopAutoRun: () => void;
}

export const useGraphStore = create<GraphStore>((set, get) => ({
  editMode: "none",
  nodeCount: 0,
  selectedNodeForEdge: null,
  selectedNodes: [],
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

  toggleNodeSelection: (id) =>
    set((s) => ({
      selectedNodes: s.selectedNodes.includes(id)
        ? s.selectedNodes.filter((n) => n !== id)
        : [...s.selectedNodes, id],
    })),

  clearSelection: () => set({ selectedNodes: [] }),

  removeSelectedNodes: () =>
    set((s) => ({
      nodes: s.nodes.filter((n) => !s.selectedNodes.includes(n.id)),
      edges: s.edges.filter(
        (e) =>
          !s.selectedNodes.includes(e.from) && !s.selectedNodes.includes(e.to),
      ),
      selectedNodes: [],
    })),

  addNode: (node) => {
    useAlgoStore.getState().resetAlgo();
    const withStatus: GraphNode = {
      ...node,
      status: { visited: false, onStack: false, sccIndex: null },
    };
    set((s) => ({ nodes: [...s.nodes, withStatus] }));
  },

  addEdge: (edge) => {
    useAlgoStore.getState().resetAlgo();
    set((s) => ({ edges: [...s.edges, edge] }));
  },

  removeNode: (id) => {
    useAlgoStore.getState().resetAlgo();
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== id),
      edges: s.edges.filter((e) => e.from !== id && e.to !== id),
    }));
  },

  removeEdge: (id) => {
    useAlgoStore.getState().resetAlgo();
    set((s) => ({ edges: s.edges.filter((e) => e.id !== id) }));
  },

  setNodes: (nodes) => {
    useAlgoStore.getState().resetAlgo();
    set({
      nodes: nodes.map((n) => ({
        ...n,
        status: { visited: false, onStack: false, sccIndex: null },
      })),
    });
  },

  setEdges: (edges) => {
    useAlgoStore.getState().resetAlgo();
    set({ edges });
  },

  setEditable: (value) => set({ editable: value }),

  resetGraph: () => {
    useAlgoStore.getState().resetAlgo();
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

  updateNodeStatuses: ({ indexMap, onStackMap, sccs }) => {
    set((state) => ({
      nodes: state.nodes.map((n) => {
        const visited = indexMap.has(n.id);
        const onStack = onStackMap.get(n.id) ?? false;
        const idx = sccs.findIndex((s) => s.includes(n.id));
        return {
          ...n,
          status: {
            visited,
            onStack,
            sccIndex: idx === -1 ? null : idx,
          },
        };
      }),
    }));
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
