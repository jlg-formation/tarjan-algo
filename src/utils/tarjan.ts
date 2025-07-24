export type Graph = {
  nodes: { id: string; label?: string }[];
  edges: { from: string; to: string }[];
};

export interface TarjanStateUpdate {
  action:
    | "visit"
    | "push"
    | "set-lowlink"
    | "pop-scc"
    | "skip"
    | "enter"
    | "return";
  currentNode: string;
  stack: string[];
  callStack: string[];
  indexMap: Map<string, number>;
  lowLinkMap: Map<string, number>;
  onStackMap: Map<string, boolean>;
  sccs: string[][];
}

export function* tarjanStepByStep(graph: Graph): Generator<TarjanStateUpdate> {
  const indexMap = new Map<string, number>();
  const lowLinkMap = new Map<string, number>();
  const onStackMap = new Map<string, boolean>();
  const stack: string[] = [];
  const callStack: string[] = [];
  const sccs: string[][] = [];
  let index = 0;

  const sortedNodes = [...graph.nodes].sort((a, b) => {
    const la = a.label ?? a.id;
    const lb = b.label ?? b.id;
    return la.localeCompare(lb);
  });

  const idToLabel = new Map(sortedNodes.map((n) => [n.id, n.label ?? n.id]));

  const adjacency = new Map<string, string[]>();
  for (const node of sortedNodes) {
    adjacency.set(node.id, []);
  }
  for (const edge of graph.edges) {
    const list = adjacency.get(edge.from);
    if (list) list.push(edge.to);
  }
  for (const list of adjacency.values()) {
    list.sort((a, b) => {
      const la = idToLabel.get(a) ?? a;
      const lb = idToLabel.get(b) ?? b;
      return la.localeCompare(lb);
    });
  }

  function snapshot(
    action: TarjanStateUpdate["action"],
    currentNode: string,
  ): TarjanStateUpdate {
    return {
      action,
      currentNode,
      stack: [...stack],
      callStack: [...callStack],
      indexMap: new Map(indexMap),
      lowLinkMap: new Map(lowLinkMap),
      onStackMap: new Map(onStackMap),
      sccs: sccs.map((s) => [...s]),
    };
  }

  function* strongConnect(v: string): Generator<TarjanStateUpdate> {
    callStack.push(v);
    yield snapshot("enter", v);
    indexMap.set(v, index);
    lowLinkMap.set(v, index);
    index += 1;
    yield snapshot("visit", v);

    stack.push(v);
    onStackMap.set(v, true);
    yield snapshot("push", v);

    const neighbors = adjacency.get(v) ?? [];
    for (const w of neighbors) {
      if (!indexMap.has(w)) {
        yield* strongConnect(w);
        const newLow = Math.min(lowLinkMap.get(v)!, lowLinkMap.get(w)!);
        lowLinkMap.set(v, newLow);
        yield snapshot("set-lowlink", v);
      } else if (onStackMap.get(w)) {
        const newLow = Math.min(lowLinkMap.get(v)!, indexMap.get(w)!);
        lowLinkMap.set(v, newLow);
        yield snapshot("set-lowlink", v);
      } else {
        yield snapshot("skip", w);
      }
    }

    if (lowLinkMap.get(v) === indexMap.get(v)) {
      const component: string[] = [];
      let w: string;
      do {
        w = stack.pop()!;
        onStackMap.set(w, false);
        component.push(w);
      } while (w !== v);
      sccs.push(component);
      yield snapshot("pop-scc", v);
    }
    callStack.pop();
    yield snapshot("return", v);
  }

  for (const node of sortedNodes) {
    if (!indexMap.has(node.id)) {
      yield* strongConnect(node.id);
    }
  }
}
