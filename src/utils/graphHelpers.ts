export interface LabeledNode {
  label: string;
}

/**
 * Return a label "N<number>" filling gaps in existing nodes labels.
 * If numbers 1..n contain holes, the smallest missing number is used.
 * Otherwise returns N<nodes.length + 1>.
 */
export function getNextNodeLabel(nodes: LabeledNode[]): string {
  const used = new Set<number>();
  for (const n of nodes) {
    const match = /^N(\d+)$/.exec(n.label);
    if (match) {
      used.add(Number(match[1]));
    }
  }
  let i = 1;
  while (used.has(i)) {
    i++;
  }
  return `N${i}`;
}
