# Spécification UI – Application Tarjan SPA

---

## 🧩 En-tête

Le site affiche un en-tête fixe avec le nom de l’application :

```
<h1 class="text-2xl font-bold text-center py-4 bg-white shadow">Trajan Algo</h1>
```

---

## 🧱 Structure de la page

La page est divisée verticalement en trois sections principales :

```
<header>         <-- En-tête "Trajan Algo"
<main>           <-- Corps principal divisé en 3 colonnes
<footer>         <-- Pied de page
```

### 📐 Corps (`<main>`) : 3 colonnes en `flex`

#### 🧭 1. Zone gauche (largeur fixe : `w-[20em]`)

- Composant d’édition du graphe
  - Ajouter / supprimer sommets
  - Ajouter / supprimer arêtes
  - Activation via bouton “Modifier le graphe”
- Le graphe ne peut être édité que si l’algorithme n’est pas en cours

#### 🔷 2. Zone centrale (flex-grow)

- Affichage dynamique du **graphe orienté**
- Utilise **React Flow**
- Nœuds colorés selon leur état :
  - Gris = non visité
  - Jaune = en cours de visite
  - Bleu = dans la pile
  - Couleur unique par SCC

#### ⚙️ 3. Zone droite (largeur fixe : `w-[20em]`)

- **Boutons de contrôle** :
  - Démarrer / Aller en avant / Retour / Lecture auto / Mode debug
  - Inactifs = `invisible` (place conservée)
- **Visualisation de l’état de l’algo** :
  - Tableau ou liste montrant pour chaque sommet :
    - `index` (entier ou `—`)
    - `lowlink` (entier ou `—`)
  - Affichage **vertical de la pile**, nœud par nœud

---

## 🎨 Footer

Fixe en bas de la page :

```
<footer class="text-center py-2 text-sm text-gray-500">
  JLG Formation ©2025
</footer>
```

---

## 🧪 Résumé des comportements UI

- Graphe non éditable pendant l’algorithme
- Affichage par état :
  - Non visité, Visite en cours, Dans la pile, SCC trouvée
- Une couleur différente par SCC détectée
- Layout **non responsive**, prévu pour écran desktop ≥ 1280px
- Utilisation de Tailwind pour les espacements, flex layout et invisibilité conditionnelle

## Règles UI

- tailwindcss: tous les boutons doivent avoir cursor-pointer
- utiliser une librairie d'icone (react-icons with fa)

---

## 🔮 Pistes ultérieures

- Animation des transitions pile / graphe
- Affichage de la composante détectée sous forme de "notification"
- Export SVG ou PNG du graphe final
