# AGENTS.md – Instructions pour les agents IA (Copilot, Codex, etc.)

Ce fichier fournit le **contexte et les règles** à respecter pour tous les
agents d’assistance au développement du projet **Trajan Algo**.

---

## 📁 Répertoire `./context`

Ce répertoire contient tous les fichiers utiles à la compréhension
fonctionnelle, technique et visuelle du projet.

### 🔖 Spécifications disponibles

- `personas.md`  
  → 2 profils types d'utilisateurs avec leurs expériences cibles

- `specs-fonctionnelles.md`  
  → Objectifs métier, scénarios utilisateur, navigation

- `specs-techniques-reactflow.md`  
  → Stack technique, structure de code, composants React + Zustand

- `specs-ui-maquette-v2.md`  
  → Structure de la page, disposition des zones, comportement visuel attendu

- `edit-workflow.md`  
  → Détails des actions possibles en mode édition de graphe

- `maquette-trajan-ui.html`  
  → Maquette HTML fonctionnelle avec Tailwind via CDN

- `maquette-trajan-ui.pdf`  
  → Maquette visuelle annotée au format PDF

---

## 🧪 Qualité de code

### ✅ Formatter

Lancer `bun run format`

### ✅ Linter

Lancer `bun run lint`

### ✅ Builder

Lancer `bun run build`

Si la commande de build échoue, corriger le code, étape par étape jusque quand
cela build avec succès.

---

## ✅ Convention de commit

Utiliser les **conventional commits** :

```
feat:     nouvelle fonctionnalité
fix:      correction de bug
style:    mise en forme (indentation, etc.)
refactor: modification sans changement fonctionnel
docs:     ajout ou mise à jour de documentation
test:     ajout ou correction de tests
chore:    maintenance ou dépendances
```

Ajouter dans le pied de page (footer) du message de commit:

```
Co-authored-by: OpenAI Codex for JLG <codex@openai.com>
```

---

## ⚙️ Suggestions supplémentaires

- Le graphe est manipulé via React Flow : tous les composants doivent être
  **compatibles avec son système de nœuds et d’arêtes**
- Tous les états doivent être centralisés dans Zustand, évitez `useState` pour
  des données partagées
- Le projet n’a **pas de backend**
- Le code doit rester modulaire : un composant = un rôle
- Préférer des fonctions pures dans `utils/`
- Ajouter une visualisation claire pour les SCC (colorisation des nœuds)
- La logique de Tarjan est implémentée **pas-à-pas via un générateur**

---

## 🧠 Utilisation des fichiers de contexte

Avant d’assister à la génération de code, **lisez les fichiers Markdown du
répertoire `./context`**. Ils contiennent toutes les contraintes nécessaires.
