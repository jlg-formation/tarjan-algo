import { useState } from "react";
import { useAlgoStore } from "../store/algoState";
import { useGraphStore } from "../store/graphStore";
import DebugCallTree from "./DebugCallTree";
import TheorySlide from "./TheorySlide";

export default function ControlPanel() {
  const status = useAlgoStore((s) => s.status);
  const currentStep = useAlgoStore((s) => s.currentStep);
  const startAlgo = useAlgoStore((s) => s.startAlgo);
  const stepForward = useAlgoStore((s) => s.stepForward);
  const stepBack = useAlgoStore((s) => s.stepBack);
  const autoRunning = useAlgoStore((s) => s.autoRunning);
  const startAutoRun = useAlgoStore((s) => s.startAutoRun);
  const stopAutoRun = useAlgoStore((s) => s.stopAutoRun);
  const delay = useAlgoStore((s) => s.delay);
  const setDelay = useAlgoStore((s) => s.setDelay);
  const setEditable = useGraphStore((s) => s.setEditable);

  const [debugMode, setDebugMode] = useState(false);
  const [showTheory, setShowTheory] = useState(false);

  const handleStart = () => {
    startAlgo();
    setEditable(false);
  };

  const handleStepForward = () => stepForward();
  const handleStepBack = () => stepBack();
  const handleToggleAutoRun = () => {
    if (autoRunning) {
      stopAutoRun();
    } else {
      startAutoRun();
    }
  };
  const handleToggleDebug = () => setDebugMode((v) => !v);
  const handleToggleTheory = () => setShowTheory((v) => !v);

  const startHidden = status !== "idle";
  const forwardHidden = status !== "running";
  const backHidden = status === "idle" || currentStep === 0;
  const autoRunHidden = status !== "running";
  const debugHidden = status === "idle";
  const theoryHidden = false;

  return (
    <div className="space-y-4">
      <button
        className={`w-full bg-green-600 text-white px-4 py-2 rounded ${
          startHidden ? "invisible" : ""
        }`}
        onClick={handleStart}
        disabled={startHidden}
      >
        Démarrer l’algorithme
      </button>
      <button
        className={`w-full bg-blue-500 text-white px-4 py-2 rounded ${
          forwardHidden ? "invisible" : ""
        }`}
        onClick={handleStepForward}
        disabled={forwardHidden}
      >
        Étape suivante
      </button>
      <button
        className={`w-full bg-blue-500 text-white px-4 py-2 rounded ${
          backHidden ? "invisible" : ""
        }`}
        onClick={handleStepBack}
        disabled={backHidden}
      >
        Étape précédente
      </button>
      <button
        className={`w-full px-4 py-2 rounded text-white ${
          autoRunHidden ? "invisible" : ""
        }`}
        style={{ backgroundColor: autoRunning ? "#DC2626" : "#6B7280" }}
        onClick={handleToggleAutoRun}
        disabled={autoRunHidden}
      >
        {autoRunning ? "Stop lecture automatique" : "Lecture automatique"}
      </button>
      {!autoRunHidden && (
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="500"
            max="3000"
            step="100"
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            className="flex-grow"
          />
          <span className="text-sm">{delay} ms</span>
        </div>
      )}
      <button
        className={`w-full bg-yellow-500 text-white px-4 py-2 rounded ${
          debugHidden ? "invisible" : ""
        }`}
        onClick={handleToggleDebug}
        disabled={debugHidden}
      >
        {debugMode ? "Quitter debug" : "Mode debug"}
      </button>
      <button
        className={`w-full bg-purple-500 text-white px-4 py-2 rounded ${
          theoryHidden ? "invisible" : ""
        }`}
        onClick={handleToggleTheory}
        disabled={theoryHidden}
      >
        {showTheory ? "Masquer théorie" : "Voir théorie"}
      </button>
      {debugMode && <DebugCallTree />}
      {showTheory && <TheorySlide onClose={handleToggleTheory} />}
    </div>
  );
}
