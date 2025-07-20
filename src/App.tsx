import "./index.css";
import GraphCanvas from "./components/GraphCanvas";
import GraphEditorToolbar from "./components/GraphEditorToolbar";
import ControlPanel from "./components/ControlPanel";
import AlgorithmConsole from "./components/AlgorithmConsole";

export default function App() {
  console.log("render app");

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
          <GraphEditorToolbar />
        </aside>

        {/* Center Panel - Graph */}
        <section className="flex-grow p-4 bg-gray-100">
          <GraphCanvas />
        </section>

        {/* Right Panel - Algorithm Control */}
        <aside className="w-[20em] border-l border-gray-300 p-4 space-y-4 bg-white">
          <h2 className="font-semibold text-lg">Contrôle de l’algorithme</h2>
          <ControlPanel />
          <AlgorithmConsole />
        </aside>
      </main>

      {/* Footer */}
      <footer className="bg-white text-center text-sm text-gray-500 py-2 shadow-inner">
        JLG Formation ©2025
      </footer>
    </div>
  );
}
