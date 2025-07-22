import React from "react";
import { useAlgoStore } from "../store/algoState";
import { useGraphStore } from "../store/graphStore";

export default function GraphEditorToolbar() {
  const status = useAlgoStore((s) => s.status);
  const editMode = useGraphStore((s) => s.editMode);
  const setEditMode = useGraphStore((s) => s.setEditMode);
  const resetGraph = useGraphStore((s) => s.resetGraph);
  const editable = useGraphStore((s) => s.editable);

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
      case "addNode":
        return "Cliquez dans le graphe pour placer le nœud";
      case "addEdgeStep1":
        return "Cliquez sur le nœud source";
      case "addEdgeStep2":
        return "Cliquez sur le nœud cible";
      default:
        return null;
    }
  })();

  return (
    <div className="space-y-4">
      <button
        className="w-full bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={() => {
          if (confirmAlgoReset()) setEditMode("addNode");
        }}
        disabled={!editable}
      >
        Ajouter un nœud
      </button>
      <button
        className="w-full bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={() => {
          if (confirmAlgoReset()) setEditMode("addEdgeStep1");
        }}
        disabled={!editable}
      >
        Ajouter une arête
      </button>
      <button
        className="w-full bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleResetGraph}
        disabled={!editable}
      >
        Effacer graphe
      </button>
      {instruction && <p className="text-sm text-gray-600">{instruction}</p>}
    </div>
  );
}
