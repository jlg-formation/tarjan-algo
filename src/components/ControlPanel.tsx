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
  const forwardDisabled = status !== "running";
  const backDisabled = status === "idle" || currentStep === 0;
  const autoRunDisabled = status !== "running";
  const debugDisabled = status === "idle";
  const theoryDisabled = false;

  return (
    <div className="space-y-4">
      <button
        className="w-full cursor-pointer rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50"
        onClick={handleStartClick}
      >
        {startLabel}
      </button>
      <button
        className="w-full cursor-pointer rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
        onClick={handleStepForward}
        disabled={forwardDisabled}
      >
        Étape suivante
      </button>
      <button
        className="w-full cursor-pointer rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
        onClick={handleStepBack}
        disabled={backDisabled}
      >
        Étape précédente
      </button>
      <button
        className="w-full cursor-pointer rounded px-4 py-2 text-white disabled:opacity-50"
        style={{ backgroundColor: autoRunning ? "#DC2626" : "#6B7280" }}
        onClick={handleToggleAutoRun}
        disabled={autoRunDisabled}
      >
        {autoRunning ? "Stop lecture automatique" : "Lecture automatique"}
      </button>
      {!autoRunDisabled && (
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
        className="w-full cursor-pointer rounded bg-yellow-500 px-4 py-2 text-white disabled:opacity-50"
        onClick={handleToggleDebug}
        disabled={debugDisabled}
      >
        {debugMode ? "Quitter debug" : "Mode debug"}
      </button>
      <button
        className="w-full cursor-pointer rounded bg-purple-500 px-4 py-2 text-white disabled:opacity-50"
        onClick={handleToggleTheory}
        disabled={theoryDisabled}
      >
        {showTheory ? "Masquer théorie" : "Voir théorie"}
      </button>
      {debugMode && <DebugCallTree />}
      {showTheory && <TheorySlide onClose={handleToggleTheory} />}
      <div></div>
    </div>
  );
}
