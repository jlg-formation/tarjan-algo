import { useAlgoStore } from "../store/algoState";
import { useGraphStore } from "../store/graphStore";
import { useShallow } from "zustand/react/shallow";

export default function AlgorithmConsole() {
  const { indexMap, lowLinkMap, stack } = useAlgoStore(
    useShallow((s) => ({
      indexMap: s.indexMap,
      lowLinkMap: s.lowLinkMap,
      stack: s.stack,
    })),
  );
  const nodes = useGraphStore((s) => s.nodes);

  const rows = nodes.map((n) => ({
    id: n.id,
    index: indexMap.get(n.id) ?? "—",
    lowlink: lowLinkMap.get(n.id) ?? "—",
  }));

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold">Index / Lowlink</h3>
        <table className="w-full text-left border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-2 py-1 border border-gray-300">Nœud</th>
              <th className="px-2 py-1 border border-gray-300">Index</th>
              <th className="px-2 py-1 border border-gray-300">Lowlink</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="odd:bg-white even:bg-gray-50">
                <td className="px-2 py-1 border border-gray-300">{r.id}</td>
                <td className="px-2 py-1 border border-gray-300">{r.index}</td>
                <td className="px-2 py-1 border border-gray-300">
                  {r.lowlink}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h3 className="font-semibold">Pile</h3>
        <ul className="border border-gray-300 bg-gray-50 divide-y divide-gray-300">
          {stack.map((id) => (
            <li key={id} className="px-2 py-1">
              {id}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
