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
  graph: Record<string, string[]>;
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

  getNextNodeId: () => string;
  setSelectedNodeForEdge: (id: string | null) => void;
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

  getNextNodeId: () => {
    const count = get().nodeCount + 1;
    set({ nodeCount: count });
    return `node-${count}`;
  },

  setSelectedNodeForEdge: (id) => set({ selectedNodeForEdge: id }),

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
        graph,
      },
      algoStep: 0,
    });
  },

  nextStep: () => {
    const s = get();
    const state = s.algoState;
    if (!state) return;

    const { callStack, graph, indexMap, lowlinkMap, stack, onStack, index } =
      state;
    if (callStack.length === 0) return;

    const current = callStack[callStack.length - 1];

    if (indexMap[current] === undefined) {
      indexMap[current] = index;
      lowlinkMap[current] = index;
      state.index++;

      stack.push(current);
      onStack.add(current);

      s.setNodeAlgoState(current, {
        index: indexMap[current],
        lowlink: lowlinkMap[current],
      });

      s.pushToStack(current);

      // Empile les voisins pour explorations futures
      const neighbors = graph[current] || [];
      for (const neighbor of neighbors.reverse()) {
        if (indexMap[neighbor] === undefined) {
          callStack.push(neighbor);
          break; // On avance d’un seul pas
        } else if (onStack.has(neighbor)) {
          lowlinkMap[current] = Math.min(
            lowlinkMap[current],
            indexMap[neighbor]
          );
          s.setNodeAlgoState(current, {
            index: indexMap[current],
            lowlink: lowlinkMap[current],
          });
        }
      }
    } else {
      // Fin du nœud courant ? On le dépile si lowlink == index
      if (lowlinkMap[current] === indexMap[current]) {
        const scc: string[] = [];
        let w;
        do {
          w = stack.pop();
          if (w) {
            onStack.delete(w);
            scc.push(w);
            s.popFromStack();
          }
        } while (w && w !== current);
        state.sccList.push(scc);
      }

      callStack.pop();
    }

    set({ algoState: state, algoStep: s.algoStep + 1 });
  },
}));
