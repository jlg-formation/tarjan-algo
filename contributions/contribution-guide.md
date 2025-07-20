# Git

---

## Toujours développer sur une branche autre que la principale

```bash
# Cree une branche dev-1234 (à partir de la branche actuelle)
git checkout master
git checkout -b "dev-1234"

# Resynchroniser la branche sur laquelle on est (faire cela dès que qqn d'autre a livré entre temps)
git fetch master
git rebase master

# Pusher la branche sur le remote pour ensuite demander au chef de projet de l'intégrer au projet
git push origin dev-1234
```

# Accepter ou refuser un livraison

```
# Ramener la branche chez soi et la tester
git fetch origin dev-1234
git checkout dev-1234

# Faire les tests, examiner le code...
# npm test ou autre...

# Accepter, Refuser, ou demander à faire évoluer la livraison

# Accepter :
git checkout dev-1234
git rebase master

# Là en principe cela fait un Fast-Forward
git checkout master
git rebase dev-1234

# Refuser :
git branch -D dev-1234
git push origin --delete dev-1234

# Demander au développeur de continuer à travailler
# Rien à faire...
```
