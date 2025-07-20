# Personas – Application "Visualisation de l'algorithme de Tarjan"

## Persona 1 : Léa – Étudiante en informatique (Licence 2)

### Profil

- **Âge** : 20 ans
- **Niveau** : Étudiante L2 Informatique
- **Objectif** : Comprendre l’algorithme de Tarjan pour réussir ses examens
- **Connaissances** : A lu le cours, comprend les graphes, mais ne visualise pas la pile ni le concept de lowlink
- **Contexte** : Elle préfère apprendre par la pratique visuelle et interactive

### Experience Map

| Phase             | Actions                                  | Pains (freins)                                | Gains attendus                               |
| ----------------- | ---------------------------------------- | --------------------------------------------- | -------------------------------------------- |
| Découverte        | Arrive sur le site, voit un graphe animé | Trop de texte théorique, visuel peu clair     | Une démo qui montre tout de suite un exemple |
| Exploration       | Clique étape par étape, observe la pile  | Ne comprend pas lowlink, confuse entre arêtes | Comprendre enfin comment les SCC émergent    |
| Approfondissement | Active le mode debug, lit l’explication  | Sature si trop d'infos à la fois              | Compréhension claire des appels récursifs    |
| Appropriation     | Modifie un graphe simple, relance l'algo | A peur de casser le graphe                    | Confiance dans sa compréhension de l’algo    |

---

## Persona 2 : Alex – Développeur autodidacte

### Profil

- **Âge** : 32 ans
- **Niveau** : Développeur web JS, curieux d’algorithmique
- **Objectif** : Comprendre comment fonctionne un algo avancé comme Tarjan
- **Connaissances** : Maitrise JavaScript, connaît les graphes, mais pas les algos de type DFS récursifs
- **Contexte** : Veut apprendre pour progresser en algorithmie, hors cursus académique

### Experience Map

| Phase             | Actions                                      | Pains (freins)                                       | Gains attendus                                |
| ----------------- | -------------------------------------------- | ---------------------------------------------------- | --------------------------------------------- |
| Découverte        | Navigue vers la SPA, voit un graphe prêt     | Ne comprend pas où commence l’algo                   | Un bouton “démarrer” explicite                |
| Exploration       | Joue avec l’étape suivante / précédente      | Ne sait pas ce qu’est un lowlink                     | Découvrir visuellement les mécanismes         |
| Approfondissement | Active le mode debug, regarde les appels DFS | Perdu si trop de récursivité d’un coup               | Avoir une vision claire de l’ordre des appels |
| Appropriation     | Crée un graphe avec un cycle, teste l’algo   | Ne comprend pas pourquoi certains nœuds sont groupés | Réalise l'intérêt des SCC dans un vrai graphe |

---
