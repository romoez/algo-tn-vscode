# Algorithme en Pseudocode

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/moez-romdhane.algorithme-tn)](https://marketplace.visualstudio.com/items?itemName=moez-romdhane.algorithme-tn)

_Extension that provides syntax highlighting and snippets for pseudocode in French as it is written at high school in Tunisia._

Une extension qui fournit la coloration syntaxique et des extraits de code (snippets) pour le pseudocode utilisé aux lycées en Tunisie.

![Snippets](https://github.com/romoez/algo-tn-vscode/raw/main/images/algorithme-tn.gif)

## Caractéristiques

### Coloration Syntaxique

#### Commentaires:

```javascript
//double slash

/* block */
```

#### Mots clés:

|             |          |                |            |
| ----------- | -------- | -------------- | ---------- |
| `à`         | `alors`  | `autres`       | `de`       |
| `début`     | `faire`  | `fin`          | `fin_pour` |
| `fin_selon` | `fin_si` | `fin_tant_que` | `jusqu'à`  |
| `pas`       | `pour`   | `retourner`    | `répéter`  |
| `selon`     | `si`     | `sinon`        | `tant que` |

#### Fonctions & Procédures:

|                 |               |                  |
| --------------- | ------------- | ---------------- |
| `aléa`          | `arrondi`     | `chr`            |
| `convch`        | `écrire`      | `effacer`        |
| `ent`           | `estnum`      | `fermer`         |
| `fin_fichier`   | `lire`        | `lire_ligne`     |
| `long`          | `majus`       | `ord`            |
| `ouvrir`        | `pointer`     | `pos`            |
| `racine_carrée` | `sous_chaîne` | `taille_fichier` |
| `valeur`        |               |                  |

#### Types:

|                  |             |           |
| ---------------- | ----------- | --------- |
| `booléen`        | `caractère` | `chaîne`  |
| `enregistrement` | `entier`    | `fichier` |
| `réel`           | `tableau`   | `texte`   |

#### Mots clés de déclaration:

|              |
| ------------ |
| `algorithme` |
| `fonction`   |
| `procédure`  |

#### Operateurs de comparaison:

|     |     |
| --- | --- |
| `<` | `≤` |
| `>` | `≥` |
| `=` | `≠` |

#### Operateurs logiques:

|        |       |
| ------ | ----- |
| `et`   | `ou`  |
| `ouex` | `non` |

#### Constante:

|        |        |
| ------ | ------ |
| `vrai` | `faux` |

### Snippets

- Autocomplétion des mots réservés et des fonctions/procédures prdéfinies.
- Autocomplétion de toutes les structures de contrôle.
- Autocomplétion des opérateurs de comparaison:

| Déclencheur | Opérateur |
| ----------- | --------- |
| `>=`        | `≤`       |
| `<=`        | `≥`       |
| `!=`        | `≠`       |

#### x-snippets:

![x-snippets](https://github.com/romoez/algo-tn-vscode/raw/main/images/x-snippets.gif)

## Notes de version

### 0.0.2

- x-snippet: x-saisir-N: Saisie contrôlée d'un nombre
- x-snippet: x-remp-tab: Remplissage contrôlé d'un tableau à une dimension
- x-snippet: x-remp-mat-carrée: Remplissage contrôlé d'une matrice carrée
- x-snippet: x-remp-mat: Remplissage contrôlé d'une matrice
- x-snippet: x-tri-bul: tri à bulles (v.1)
- x-snippet: x-tri-sél: tri par sélection (v.1)
- x-snippet: x-tri-ins: tri par insertion (v.1)

### 0.0.1

- Version initiale avec coloration et snippets de la syntaxe du pseudocode utilisé pour écrire les algorithmes.
