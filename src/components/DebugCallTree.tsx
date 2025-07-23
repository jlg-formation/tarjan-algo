import { useAlgoStore } from "../store/algoState";

export default function DebugCallTree() {
  const callStack = useAlgoStore((s) => s.callStack);

  if (callStack.length === 0) {
    return (
      <div className="p-2 bg-white rounded shadow">
        <p className="italic text-gray-500">Aucun appel en cours.</p>
      </div>
    );
  }

  return (
    <div className="p-2 bg-white rounded shadow font-mono text-sm">
      <ul>
        {callStack.map((id, idx) => (
          <li key={idx} style={{ paddingLeft: `${idx * 1.5}rem` }}>
            {id}
          </li>
        ))}
      </ul>
    </div>
  );
}
