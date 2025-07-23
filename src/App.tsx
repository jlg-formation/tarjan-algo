import "./index.css";
import GraphCanvas from "./components/GraphCanvas";
import GraphEditorToolbar from "./components/GraphEditorToolbar";
import ControlPanel from "./components/ControlPanel";
import AlgorithmConsole from "./components/AlgorithmConsole";
import ExplanationBox from "./components/ExplanationBox";
import { useAlgoStore } from "./store/algoState";

export default function App() {
  console.log("render app");

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white p-4 text-center text-2xl font-bold shadow">
        Trajan Algo
      </header>

      {/* Main layout */}
      <main className="flex flex-1 overflow-hidden">
        <section className="flex-grow space-y-4 bg-gray-100 p-4">
          <GraphEditorToolbar />
          <GraphCanvas />
          <ExplanationBox update={useAlgoStore((s) => s.lastUpdate)} />
        </section>

        {/* Right Panel - Algorithm Control */}
        <aside className="w-[20em] space-y-4 border-l border-gray-300 bg-white p-4">
          <h2 className="text-lg font-semibold">Contrôle de l’algorithme</h2>
          <ControlPanel />
          <AlgorithmConsole />
        </aside>
      </main>

      {/* Footer */}
      <footer className="bg-white py-2 text-center text-sm text-gray-500 shadow-inner">
        JLG Formation ©2025
      </footer>
    </div>
  );
}
