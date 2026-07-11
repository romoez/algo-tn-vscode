# algotn.py — exécuter les fichiers `.algo`

Un transpileur qui traduit le pseudocode de l'extension en **Python**, puis
l'exécute dans le terminal. Aucune dépendance : il suffit de Python 3.10+.

```console
python tools/algotn.py exemple.algo            # transpile + exécute
python tools/algotn.py exemple.algo --show     # affiche le Python généré
python tools/algotn.py exemple.algo --out f.py # sauvegarde le Python généré
python tools/algotn.py exemple.algo --no-run   # transpile sans exécuter
```

## Ce qui est supporté

- `écrire`, `écrire_nl`, `lire` (alias `afficher`, `saisir`) — la lecture est
  **typée selon les tableaux de déclaration** : `n : entier` ⇒ `lire(n)` fait
  `int(input())` avec contrôle de saisie ; `caractère` = exactement 1 caractère ;
- **les tableaux de déclaration dessinés** (TDO / TDOG / TDOL, snippets
  `tdo-1`, `tdo-3`…) sont lus, où qu'ils soient dans le fichier ; un type
  non défini y est signalé comme erreur ;
- **`fonction` et `procédure`** définies par l'utilisateur, avec `retourner` ;
  le passage par variable `@x` d'une procédure est émulé (la variable passée
  est bien modifiée après l'appel) ; les paramètres typés dans l'en-tête
  n'ont pas besoin d'être répétés dans le TDOL ;
- `x ← expr` (ou `x <- expr`) ;
- `si / sinon si / sinon / fin_si`, `pour … de … à … [pas …] faire`
  (la borne finale est **atteinte**, contrairement au `range` de Python),
  `tant que … faire`, `répéter … jusqu'à`, `selon … autres … fin_selon` ;
- `t : tableau de 10 entier` et TDNT `tab = tableau de 20 entier` —
  tableaux indexés de 1 à n comme en cours ;
- opérateurs `= ≠ ≤ ≥ ∈ et ou non ouex div mod`, constantes `vrai`/`faux` ;
- fonctions prédéfinies : `abs`, `ent`, `arrondi`, `racine_carrée`, `aléa`,
  `chr`, `ord`, `majus`, `convch`, `valeur`, `estnum`, `long`, `pos`,
  `sous_chaîne`, `effacer` (chaînes indexées à partir de 1) ;
- commentaires `//` et `/* … */` ;
- les deux graphies : `écrire`/`Ecrire`, `fin_si`/`FinSi`, `à`/`A`, etc.

Pas encore supporté : `enregistrement` (TDNT), fichiers texte et fichiers typés.

Voir [`exemple.algo`](exemple.algo), [`exemple2.algo`](exemple2.algo) et
[`exemple3.algo`](exemple3.algo) (fonctions, procédure avec `@`, TDOG/TDOL).

Développement suivi sur [MajdLHB/algo-tn-compiler](https://github.com/MajdLHB/algo-tn-compiler).
