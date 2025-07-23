import { FaLink, FaTrash, FaTrashAlt } from "react-icons/fa";
import { useAlgoStore } from "../store/algoState";
import { useGraphStore } from "../store/graphStore";

export default function GraphEditorToolbar() {
  const status = useAlgoStore((s) => s.status);
  const editMode = useGraphStore((s) => s.editMode);
  const setEditMode = useGraphStore((s) => s.setEditMode);
  const resetGraph = useGraphStore((s) => s.resetGraph);
  const editable = useGraphStore((s) => s.editable);
  const selectedNodes = useGraphStore((s) => s.selectedNodes);
  const removeSelectedNodes = useGraphStore((s) => s.removeSelectedNodes);

  const confirmAlgoReset = () =>
    status === "idle" ||
    confirm("L'algorithme en cours sera réinitialisé. Voulez-vous continuer ?");

  const handleResetGraph = () => {
    if (
      confirmAlgoReset() &&
      confirm("Voulez-vous vraiment effacer le graphe ?")
    ) {
      resetGraph();
    }
  };

  const instruction = (() => {
    switch (editMode) {
      case "addEdgeStep1":
        return "Cliquez sur le nœud source";
      case "addEdgeStep2":
        return "Cliquez sur le nœud cible";
      default:
        return null;
    }
  })();

  return (
    <div className="flex items-center gap-2">
      <button
        className="cursor-pointer rounded bg-gray-500 p-2 text-white disabled:opacity-50"
        onClick={() => {
          if (confirmAlgoReset()) setEditMode("addEdgeStep1");
        }}
        disabled={!editable}
        aria-label="Ajouter une arête"
      >
        <FaLink className="h-5 w-5" />
      </button>
      {selectedNodes.length > 0 && (
        <button
          className="cursor-pointer rounded bg-gray-500 p-2 text-white disabled:opacity-50"
          onClick={removeSelectedNodes}
          disabled={!editable}
          aria-label="Effacer le nœud"
        >
          <FaTrash className="h-5 w-5" />
        </button>
      )}
      <button
        className="cursor-pointer rounded bg-gray-500 p-2 text-white disabled:opacity-50"
        onClick={handleResetGraph}
        disabled={!editable}
        aria-label="Effacer graphe"
      >
        <FaTrashAlt className="h-5 w-5" />
      </button>
      {instruction && (
        <p className="ml-2 text-sm text-gray-600">{instruction}</p>
      )}
    </div>
  );
}
