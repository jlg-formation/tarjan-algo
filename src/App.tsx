import { createRoot } from "react-dom/client";
import "./index.css";
import GraphCanvas from "./components/GraphCanvas";
import { useGraphStore } from "./store/graphStore";

export default function App() {
  const setEditMode = useGraphStore((s) => s.setEditMode);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow p-4 text-center text-2xl font-bold">
        Trajan Algo
      </header>

      {/* Main layout */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left Panel - Edition */}
        <aside className="w-[20em] border-r border-gray-300 p-4 space-y-4 bg-white">
          <h2 className="font-semibold text-lg">Édition du graphe</h2>
          <button
            className="w-full bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => setEditMode("addNode")}
          >
            Ajouter un nœud
          </button>
          <button
            className="w-full bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => setEditMode("addEdgeStep1")}
          >
            Ajouter une arête
          </button>
          <button className="w-full bg-red-600 text-white px-4 py-2 rounded">
            Effacer graphe
          </button>
          <p className="text-sm text-gray-600 mt-6">
            Cliquez sur le canvas pour placer un nœud après avoir cliqué sur
            "Ajouter un nœud".
          </p>
        </aside>

        {/* Center Panel - Graph */}
        <section className="flex-grow p-4 bg-gray-100">
          <GraphCanvas />
        </section>

        {/* Right Panel - Algorithm Control */}
        <aside className="w-[20em] border-l border-gray-300 p-4 space-y-4 bg-white">
          <h2 className="font-semibold text-lg">Contrôle de l’algorithme</h2>
          <button className="w-full bg-green-600 text-white px-4 py-2 rounded">
            Démarrer
          </button>
          <button className="w-full bg-blue-500 text-white px-4 py-2 rounded">
            Étape suivante
          </button>
          <button className="w-full bg-blue-500 text-white px-4 py-2 rounded">
            Étape précédente
          </button>
          <button className="w-full bg-gray-500 text-white px-4 py-2 rounded">
            Lecture automatique
          </button>
          <button className="w-full bg-yellow-500 text-white px-4 py-2 rounded">
            Mode debug
          </button>

          <div className="mt-6">
            <h3 className="text-md font-semibold">État de l’algo</h3>
            <p className="text-sm text-gray-600 mt-2">Index / Lowlink :</p>
            <ul className="text-sm list-disc list-inside">
              <li>N1 : index = 0, lowlink = 0</li>
              <li>N2 : index = 1, lowlink = 0</li>
            </ul>
            <p className="text-sm text-gray-600 mt-4">Pile :</p>
            <div className="bg-gray-200 p-2 rounded">
              <div className="bg-blue-200 p-1 my-1 rounded text-center">N2</div>
              <div className="bg-blue-200 p-1 my-1 rounded text-center">N1</div>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="bg-white text-center text-sm text-gray-500 py-2 shadow-inner">
        JLG Formation ©2025
      </footer>
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
