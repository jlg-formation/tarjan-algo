import { describe, it, expect } from "bun:test";
import { tarjanStepByStep } from "./tarjan";
import type { Graph } from "./tarjan";

const simpleGraph: Graph = {
  nodes: [{ id: "a" }, { id: "b" }],
  edges: [
    { from: "a", to: "b" },
    { from: "b", to: "a" },
  ],
};

describe("tarjanStepByStep", () => {
  it("yields enter action first", () => {
    const gen = tarjanStepByStep(simpleGraph);
    const step = gen.next().value;
    expect(step.action).toBe("enter");
    expect(step.currentNode).toBe("a");
  });

  it("finds a single strongly connected component", () => {
    const gen = tarjanStepByStep(simpleGraph);
    let last;
    for (const s of gen) {
      last = s;
    }
    expect(last?.sccs.length).toBe(1);
    expect(new Set(last?.sccs[0])).toEqual(new Set(["a", "b"]));
  });
});
