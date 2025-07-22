# Algorithme de Tarjan

## Pseudocode

```text
function tarjan(G):
    index := 0
    stack := empty
    for v in G:
        if v not visited:
            strongConnect(v)

function strongConnect(v):
    indexMap[v] := index
    lowLinkMap[v] := index
    index := index + 1
    push v on stack
    for each w in successors(v):
        if w not visited:
            strongConnect(w)
            lowLinkMap[v] := min(lowLinkMap[v], lowLinkMap[w])
        else if w on stack:
            lowLinkMap[v] := min(lowLinkMap[v], indexMap[w])
    if lowLinkMap[v] = indexMap[v]:
        pop vertices from stack until v
        output the component
```

## Définitions

- **DFS** : parcours en profondeur du graphe.
- **Lowlink** : plus petit index atteignable depuis un sommet par un chemin DFS.
- **SCC (Strongly Connected Component)** : sous-ensemble de sommets tels que chaque sommet est accessible depuis les autres.

## Complexité

L'algorithme s'exécute en `O(V + E)` où `V` est le nombre de sommets et `E` le nombre d'arêtes.

## Pour aller plus loin

[Article Wikipédia sur l'algorithme de Tarjan](https://fr.wikipedia.org/wiki/Algorithme_de_Tarjan)
