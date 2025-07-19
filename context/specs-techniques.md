# Spécifications Techniques – Application Tarjan SPA

## 🧱 Stack technique

- **Bun** – Runtime JavaScript/TypeScript moderne, rapide
- **Vite** – Dev server et bundler ultra rapide
- **React (latest)** – Framework UI déclaratif
- **TailwindCSS v4** – Styling utilitaire
- **TypeScript** – Typage strict pour fiabilité
- **Zustand** – Gestion d’état locale, simple et efficace
- **Graph rendering** :
  - Recommandé : [`react-flow`](https://reactflow.dev) ou `cytoscape.js` via wrapper React
- **Animations** :
  - `framer-motion` pour transitions
- **Markdown + Docs** :
  - Optionnel : `react-markdown` pour l’explication théorique
- **Test** :
  - Unitaires : `vitest`
  - End-to-end (optionnel) : `playwright`

## 🧩 Structure des composants React

```
/src
├── App.tsx
├── components/
│   ├── GraphCanvas.tsx            # Affiche et anime le graphe
│   ├── GraphEditorToolbar.tsx     # Ajouter/supprimer/modifier sommet ou arête
│   ├── ControlPanel.tsx           # Boutons (démarrer, step, debug, lecture auto)
│   ├── AlgorithmConsole.tsx       # Affichage pile / index / lowlink / SCC
│   ├── ExplanationBox.tsx         # Texte pédagogique par étape
│   ├── DebugCallTree.tsx          # Arborescence récursive (DFS)
│   └── TheorySlide.tsx            # Slide avec pseudocode et infos
├── store/
│   ├── graphStore.ts              # Structure du graphe (nœuds, arêtes)
│   ├── algoState.ts               # Pile, index, lowlink, étapes, SCC
│   └── history.ts                 # Pour le bouton “Étape précédente”
├── utils/
│   ├── tarjan.ts                  # Implémentation pas-à-pas de l’algo
│   └── graphHelpers.ts            # Fonctions utiles (générer graphe, valider, etc.)
```

## 🧠 Gestion d’état (Zustand)

### `graphStore.ts`
- `nodes: GraphNode[]`  
- `edges: GraphEdge[]`  
- `editable: boolean`  
- `resetGraph()`, `addNode()`, `addEdge()`, etc.

### `algoState.ts`
- `indexMap: Map<NodeId, number>`
- `lowLinkMap: Map<NodeId, number>`
- `onStackMap: Map<NodeId, boolean>`
- `stack: NodeId[]`
- `currentIndex: number`
- `currentStep: number`
- `sccs: NodeId[][]`
- `status: "idle" | "running" | "done"`
- `startAlgo()`, `stepForward()`, `stepBack()`, `resetAlgo()`

### `history.ts`
- Liste des états successifs pour permettre `undo`
- Implémentation d’un système d’instantané (deep clone)

## 🔁 Fonctionnement de l’algorithme étape par étape

### Dans `/utils/tarjan.ts`
- Implémentation par générateur ou state machine :
```ts
function* tarjanStepByStep(graph: Graph): Generator<TarjanStateUpdate>
```
Chaque appel de `next()` donne :
- état courant
- action effectuée
- mise à jour des données (pile, index, lowlink…)

## 📁 Données Typescript

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

## 📈 Performance et sécurité

- App légère : tout client-side, aucun backend
- Fichier `.env` inutile
- Graphe limité à ~30 nœuds pour garder lisibilité
- Pas de dépendances critiques externes
- Aucun accès réseau requis
