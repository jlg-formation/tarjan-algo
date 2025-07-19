# Spécifications Fonctionnelles – Application Tarjan SPA

## 🎯 Objectif principal

Permettre à un utilisateur (étudiant, développeur autodidacte, curieux) de **comprendre visuellement, étape par étape**, le fonctionnement de l’algorithme de Tarjan pour détecter les composantes fortement connexes dans un graphe orienté.

---

## 🧑‍🏫 Cas d’usage principal

L'utilisateur arrive sur la page :

- Il voit un petit graphe orienté préchargé (modifiable)
- Il peut cliquer sur un bouton **“Démarrer l’algorithme”**
- À partir de là, il peut explorer l’algorithme de Tarjan étape par étape ou en lecture automatique
- Il peut revenir en arrière, interrompre l’algorithme, modifier le graphe, ou activer un mode debug

---

## 🧩 Comportement de l’interface

### État initial

- Affichage d’un **graphe orienté** simple
- **Graphe éditable** :
  - Ajouter / supprimer sommets
  - Ajouter / supprimer arêtes (drag and drop)
  - Déplacement libre des nœuds
- Boutons visibles :
  - ✅ `Démarrer l’algorithme`
  - ✏️ `Modifier le graphe` (actif par défaut)

---

### Démarrage de l’algorithme

- Dès le clic sur **Démarrer l’algorithme** :
  - Le graphe devient **non éditable**
  - Initialisation :
    - `index = 0`
    - Pile vide
    - `lowlink` et `onStack` pour chaque sommet
  - Nouveaux boutons affichés :
    - ⏩ `Étape suivante`
    - ⏪ `Étape précédente`
    - ▶️ `Lecture automatique`
    - 🐞 `Mode debug`
    - 📖 `Explication théorique`
    - ✏️ `Modifier le graphe` (avec alerte : réinitialise l’algorithme)

---

### Étape suivante

- Effectue une action de l’algorithme (DFS, push sur pile, calcul lowlink, extraction SCC)
- Met à jour dynamiquement :
  - Graphe (couleurs d’arêtes / nœuds)
  - Pile
  - Valeurs `index` et `lowlink`
  - Affichage d’une **phrase explicative**
  - Si une SCC est trouvée : l’affiche de façon groupée

---

### Étape précédente

- Revenir à l’état précédent (via historique interne)

---

### Lecture automatique

- Avance toutes les 1 à 3 secondes (configurable)
- Peut être mise en pause
- Ne dépasse pas la fin

---

### Modifier le graphe

- Stoppe l’algorithme
- Réinitialise tous les états
- Rend à nouveau le graphe modifiable

---

### Mode debug

- Affiche une arborescence des appels récursifs DFS
- Indentation + coloration des entrées / retours

---

### Explication théorique

- Slide latéral ou modale avec :
  - Pseudocode de Tarjan
  - Définition des termes (DFS, lowlink, SCC…)
  - Complexité : `O(V + E)`
  - Lien externe vers article d’origine ou Wikipédia

---

## 🧪 Règles et contraintes

- Pas d’exécution partielle d’étapes illogiques (ex : impossible de passer à l’étape suivante si l’algo n’est pas démarré)
- La modification du graphe **réinitialise** l’algorithme
- Un graphe valide est requis pour le lancement (pas de sommet orphelin sans arête si non voulu)
- Si le graphe est vide ou non connexe, l’algo doit le gérer sans erreur

---

## 📐 Résolution cible

- Application responsive (desktop priorité, tablette secondaire)
- Navigation fluide et transitions animées (mais non perturbantes)
- Accessibilité minimale : contrastes, texte lisible, clavier

---

Souhaites-tu que je poursuive avec `specs-techniques.md` ?  
(Il contiendra : structure des composants React, logique d’état, stack technique exacte, etc.)
