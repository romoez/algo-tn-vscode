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

- `écrire`, `écrire_nl`, `lire` — la lecture est **typée selon le TDO** :
  `n : entier` ⇒ `lire(n)` fait `int(input())` avec contrôle de saisie ;
- `x ← expr` (ou `x <- expr`) ;
- `si / sinon si / sinon / fin_si`, `pour … de … à … [pas …] faire`,
  `tant que … faire`, `répéter … jusqu'à`, `selon … autres … fin_selon` ;
- `t : tableau de 10 entier` — tableaux indexés de 1 à n comme en cours ;
- opérateurs `= ≠ ≤ ≥ ∈ et ou non ouex div mod`, constantes `vrai`/`faux` ;
- fonctions prédéfinies : `abs`, `ent`, `arrondi`, `racine_carrée`, `aléa`,
  `chr`, `ord`, `majus`, `convch`, `valeur`, `estnum`, `long`, `pos`,
  `sous_chaîne`, `effacer` (chaînes indexées à partir de 1) ;
- commentaires `//` et `/* … */` ;
- les deux graphies : `écrire`/`Ecrire`, `fin_si`/`FinSi`, `à`/`A`, etc.

Pas encore supporté : `fonction`/`procédure` définies par l'utilisateur,
`enregistrement` (TDNT), fichiers texte et fichiers typés.

Voir [`exemple.algo`](exemple.algo) et [`exemple2.algo`](exemple2.algo).

Développement suivi sur [MajdLHB/algo-tn-compiler](https://github.com/MajdLHB/algo-tn-compiler).
