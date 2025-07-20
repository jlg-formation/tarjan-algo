import { describe, it, expect } from "bun:test";
import { tarjanStepByStep, Graph } from "./tarjan";

const simpleGraph: Graph = {
  nodes: [{ id: "a" }, { id: "b" }],
  edges: [
    { from: "a", to: "b" },
    { from: "b", to: "a" },
  ],
};

describe("tarjanStepByStep", () => {
  it("yields visit action first", () => {
    const gen = tarjanStepByStep(simpleGraph);
    const step = gen.next().value;
    expect(step.action).toBe("visit");
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
