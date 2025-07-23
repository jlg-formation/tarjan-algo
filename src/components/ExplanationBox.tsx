import { useMemo } from "react";
import type { TarjanStateUpdate } from "../utils/tarjan";

interface ExplanationBoxProps {
  update: TarjanStateUpdate | null;
}

export default function ExplanationBox({ update }: ExplanationBoxProps) {
  const message = useMemo(() => {
    if (!update) return null;
    const { action, currentNode } = update;
    switch (action) {
      case "visit":
        return `Visite de ${currentNode} : index et lowlink assignés.`;
      case "push":
        return `Empile ${currentNode} sur la pile.`;
      case "set-lowlink":
        return `Mise à jour du lowlink de ${currentNode}.`;
      case "pop-scc":
        return `Détection d\u2019une composante depuis ${currentNode}.`;
      case "skip":
        return `Ar\u00eate vers ${currentNode} ignor\u00e9e.`;
      case "enter":
        return `Appel de strongConnect(${currentNode}).`;
      case "return":
        return `Retour de strongConnect(${currentNode}).`;
      default:
        return null;
    }
  }, [update]);

  if (!message) {
    return (
      <div className="p-4 bg-white rounded shadow">
        <p className="italic text-gray-500">Aucune action pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <p>{message}</p>
    </div>
  );
}
