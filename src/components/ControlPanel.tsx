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

  const resetAlgo = useAlgoStore((s) => s.resetAlgo);

  const handleStart = () => {
    startAlgo();
    setEditable(false);
  };

  const handleStop = () => {
    resetAlgo();
    setEditable(true);
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

  const startLabel =
    status === "idle" ? "Démarrer l’algorithme" : "Interrompre l’algorithme";
  const handleStartClick = status === "idle" ? handleStart : handleStop;
  const forwardHidden = status !== "running";
  const backHidden = status === "idle" || currentStep === 0;
  const autoRunHidden = status !== "running";
  const debugHidden = status === "idle";
  const theoryHidden = false;

  return (
    <div className="space-y-4">
      <button
        className="w-full rounded bg-green-600 px-4 py-2 text-white"
        onClick={handleStartClick}
      >
        {startLabel}
      </button>
      <button
        className={`w-full rounded bg-blue-500 px-4 py-2 text-white ${
          forwardHidden ? "invisible" : ""
        }`}
        onClick={handleStepForward}
        disabled={forwardHidden}
      >
        Étape suivante
      </button>
      <button
        className={`w-full rounded bg-blue-500 px-4 py-2 text-white ${
          backHidden ? "invisible" : ""
        }`}
        onClick={handleStepBack}
        disabled={backHidden}
      >
        Étape précédente
      </button>
      <button
        className={`w-full rounded px-4 py-2 text-white ${
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
        className={`w-full rounded bg-yellow-500 px-4 py-2 text-white ${
          debugHidden ? "invisible" : ""
        }`}
        onClick={handleToggleDebug}
        disabled={debugHidden}
      >
        {debugMode ? "Quitter debug" : "Mode debug"}
      </button>
      <button
        className={`w-full rounded bg-purple-500 px-4 py-2 text-white ${
          theoryHidden ? "invisible" : ""
        }`}
        onClick={handleToggleTheory}
        disabled={theoryHidden}
      >
        {showTheory ? "Masquer théorie" : "Voir théorie"}
      </button>
      {debugMode && <DebugCallTree />}
      {showTheory && <TheorySlide onClose={handleToggleTheory} />}
      <div></div>
    </div>
  );
}
