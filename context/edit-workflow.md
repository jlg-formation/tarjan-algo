# Workflow d'Édition du Graphe – Application Trajan Algo

---

## 🧭 Mode Édition

L’édition du graphe se fait **exclusivement dans un mode dédié** déclenché par l’utilisateur.

### 🎮 Activation de l’édition

L’utilisateur peut entrer en mode édition de deux façons :
- ✅ En cliquant sur le bouton **"Éditer le graphe"**
- ❌ En cliquant sur **"Effacer le graphe"**, qui demande une **confirmation** avant de réinitialiser complètement le graphe

⚠️ Entrer en mode édition **réinitialise l’algorithme** (pile, index, lowlink, SCCs)

---

## ➕ Ajout de nœuds

### Étapes :
1. L’utilisateur clique sur le bouton **"Ajouter un nœud"**
2. L’interface entre dans un **mode d’attente de clic**
3. L’utilisateur clique **dans la zone de dessin du graphe**
4. Un nouveau nœud est ajouté à cet emplacement avec un identifiant unique (`N1`, `N2`, etc.) provenant d’une **séquence auto-incrémentée**

🎯 Comportement :
- Le nœud est affiché immédiatement
- Il est placé à la position du clic
- Il est draggable uniquement en mode édition

---

## ➕ Ajout d’arêtes

### Étapes :
1. L’utilisateur clique sur le bouton **"Ajouter une arête"**
2. L’interface affiche une instruction :  
   > "Cliquez sur le nœud source"
3. L’utilisateur clique sur un **premier nœud**
4. L’interface affiche une nouvelle instruction :  
   > "Cliquez sur le nœud cible"
5. L’utilisateur clique sur un **second nœud**
6. L’arête est dessinée automatiquement de la source vers la cible

🎯 Comportement :
- Si l’utilisateur clique deux fois sur le même nœud, l’arête **A → A** est autorisée uniquement si l’option est activée
- L’arête n’est pas créée si une arête équivalente existe déjà
- Chaque arête est orientée (flèche affichée)

---

## 🗑️ Suppression

- Supprimer un **nœud** :
  - Option : cliquer sur le nœud + bouton `🗑 Supprimer`
  - Toutes les arêtes liées sont supprimées aussi

- Supprimer une **arête** :
  - Clic sur une arête pour la sélectionner
  - Bouton `🗑 Supprimer`

---

## 🧱 Contraintes UX

- Le graphe n’est **modifiable** que si l’état `editable = true`
- Aucun ajout ou suppression ne peut être fait en mode exécution
- L’utilisateur **voit visuellement** dans l’interface quand un mode est actif (ex: “Ajout d’arête : en attente du 1er clic”)

---

## ✅ Fin de l’édition

- L’utilisateur clique sur **"Démarrer l’algorithme"**
  - Cela fige le graphe
  - Réinitialise les états internes (pile, index, SCCs)
  - Passe en mode "exécution"

---

