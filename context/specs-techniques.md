# Spécifications Techniques – Application Tarjan SPA

## 🧱 Stack technique

- **Bun** – Runtime JavaScript/TypeScript moderne, rapide
- **Vite** – Dev server et bundler rapide
- **React (latest)** – Framework UI déclaratif
- **TailwindCSS v4** – Styling utilitaire
- **TypeScript** – Typage strict
- **Zustand** – Gestion d’état légère et réactive
- **D3** – Rendu graphique du graphe orienté
- **Framer Motion** – Transitions animées
- **React Markdown** – Rendu d’explication théorique en markdown
- **Vitest** – Tests unitaires
- **Playwright** (optionnel) – Tests end-to-end

---

## 🧩 Structure des composants React

```
/src
├── App.tsx
├── components/
│   ├── GraphCanvas.tsx            # Affiche le graphe avec D3
│   ├── GraphEditorToolbar.tsx     # Actions pour modifier le graphe (édition)
│   ├── ControlPanel.tsx           # Boutons : démarrer, étape suivante/précédente, debug
│   ├── AlgorithmConsole.tsx       # Pile, index, lowlink, SCC en temps réel
│   ├── ExplanationBox.tsx         # Explication pédagogique étape par étape
│   ├── DebugCallTree.tsx          # Affichage récursif (DFS) de l’appel de fonctions
│   └── TheorySlide.tsx            # Rendu markdown (React Markdown)
├── store/
│   ├── graphStore.ts              # État du graphe et édition
│   ├── algoState.ts               # État algorithmique (pile, index, SCC)
│   └── history.ts                 # Historique pour bouton retour
├── utils/
│   ├── tarjan.ts                  # Implémentation pas-à-pas (générateur)
│   └── graphHelpers.ts            # Génération, validation, nettoyage du graphe
```

---

## ⚙️ Gestion d’état (Zustand)

### `graphStore.ts`

- `nodes: GraphNode[]`
- `edges: GraphEdge[]`
- `editable: boolean`
- Fonctions : `addNode`, `addEdge`, `removeNode`, `setEditable`, `resetGraph`

### `algoState.ts`

- `indexMap: Map<NodeId, number>`
- `lowLinkMap: Map<NodeId, number>`
- `onStackMap: Map<NodeId, boolean>`
- `stack: NodeId[]`
- `sccs: NodeId[][]`
- `currentIndex: number`
- `currentStep: number`
- `status: "idle" | "running" | "done"`
- Fonctions : `startAlgo`, `stepForward`, `stepBack`, `resetAlgo`

---

## 🔁 Algo Tarjan pas-à-pas

Utilisation d’un générateur pour décomposer l’algorithme :

```ts
function* tarjanStepByStep(graph: Graph): Generator<TarjanStateUpdate>
```

Chaque `next()` donne :

- état du graphe
- action (visit, push, set-lowlink, pop-scc…)
- mise à jour : index, lowlink, pile, SCC

---

## 📐 Types TypeScript

```ts
type NodeId = string;

interface GraphNode {
  id: NodeId;
  label: string;
  position: { x: number; y: number };
}

interface GraphEdge {
  id: string;
  from: NodeId;
  to: NodeId;
}

interface TarjanStateUpdate {
  action: "visit" | "push" | "set-lowlink" | "pop-scc" | "skip";
  currentNode: NodeId;
  stack: NodeId[];
  indexMap: Map<NodeId, number>;
  lowLinkMap: Map<NodeId, number>;
  onStackMap: Map<NodeId, boolean>;
  sccs: NodeId[][];
}
```

---

## 🎨 UI / UX

- D3 permet :
  - Drag & drop de nœuds
  - Ajout d’arêtes
  - Rendu clair du graphe dirigé
- Utilisateur peut :
  - Modifier graphe (mode édition)
  - Lancer l’algo (mode lecture)
  - Explorer avec pas-à-pas ou lecture automatique
  - Activer un panneau Markdown (React Markdown) pour la théorie
  - Activer un mode Debug récursif

---

## 📈 Sécurité et performances

- Application totalement client-side
- Aucun appel réseau, pas de backend
- Pas de stockage persistant
- Graphe limité en taille (~30 nœuds)
- Animations non bloquantes
- Aucune dépendance critique instable

---
