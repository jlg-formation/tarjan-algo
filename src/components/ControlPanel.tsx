import React, { useEffect, useState } from "react";
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
  const setEditable = useGraphStore((s) => s.setEditable);

  const [autoRun, setAutoRun] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [showTheory, setShowTheory] = useState(false);

  useEffect(() => {
    if (!autoRun) return;
    const id = window.setInterval(() => {
      if (useAlgoStore.getState().status === "running") {
        useAlgoStore.getState().stepForward();
      } else {
        setAutoRun(false);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [autoRun]);

  const handleStart = () => {
    startAlgo();
    setEditable(false);
  };

  const handleStepForward = () => stepForward();
  const handleStepBack = () => stepBack();
  const handleToggleAutoRun = () => setAutoRun((v) => !v);
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
        style={{ backgroundColor: autoRun ? "#DC2626" : "#6B7280" }}
        onClick={handleToggleAutoRun}
        disabled={autoRunHidden}
      >
        {autoRun ? "Stop lecture automatique" : "Lecture automatique"}
      </button>
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
