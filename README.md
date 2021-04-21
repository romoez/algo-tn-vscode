# Algorithme en Pseudocode

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/moez-romdhane.algorithme-tn)](https://marketplace.visualstudio.com/items?itemName=moez-romdhane.algorithme-tn)

_Extension that provides syntax highlighting and snippets for pseudocode in French as it is written at high school in Tunisia :tunisia:._

Une extension qui fournit la coloration syntaxique et des extraits de code (snippets) pour le pseudocode utilisé aux lycées en Tunisie :tunisia:.
![algorithme-tn](https://github.com/romoez/algo-tn-vscode/raw/main/images/algorithme-tn.gif)

- [Algorithme en Pseudocode](#algorithme-en-pseudocode)
  - [Coloration Syntaxique](#coloration-syntaxique)
    - [Commentaires](#commentaires)
    - [Mots clés](#mots-clés)
    - [Fonctions & Procédures prédéfinies](#fonctions--procédures-prédéfinies)
    - [Types](#types)
    - [Mots clés de déclaration](#mots-clés-de-déclaration)
    - [Opérateurs de comparaison](#opérateurs-de-comparaison)
    - [Opérateurs logiques](#opérateurs-logiques)
    - [Constantes](#constantes)
  - [Autocomplétion](#autocomplétion)
  - [Extraits de code](#extraits-de-code)
    - [TDO : Tableau de Déclaration des Objets](#tdo--tableau-de-déclaration-des-objets)
    - [TDNT : Tableau de Déclaration des Nouveaux Types](#tdnt--tableau-de-déclaration-des-nouveaux-types)
    - [x-snippets](#x-snippets)
  - [Notes de version](#notes-de-version)
    - [0.0.3](#003)
    - [0.0.2](#002)
    - [0.0.1](#001)

## Coloration Syntaxique

### Commentaires

```javascript
//double slash

/* block */
```

### Mots clés

|             |          |                |            |
| ----------- | -------- | -------------- | ---------- |
| `à`         | `alors`  | `autres`       | `de`       |
| `début`     | `faire`  | `fin`          | `fin_pour` |
| `fin_selon` | `fin_si` | `fin_tant_que` | `jusqu'à`  |
| `pas`       | `pour`   | `retourner`    | `répéter`  |
| `selon`     | `si`     | `sinon`        | `tant que` |

### Fonctions & Procédures prédéfinies

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

### Types

|                  |             |           |
| ---------------- | ----------- | --------- |
| `booléen`        | `caractère` | `chaîne`  |
| `enregistrement` | `entier`    | `fichier` |
| `réel`           | `tableau`   | `texte`   |

### Mots clés de déclaration

|              |
| ------------ |
| `algorithme` |
| `fonction`   |
| `procédure`  |

### Opérateurs de comparaison

|     |     |
| --- | --- |
| `<` | `≤` |
| `>` | `≥` |
| `=` | `≠` |

### Opérateurs logiques

|        |       |
| ------ | ----- |
| `et`   | `ou`  |
| `ouex` | `non` |

### Constantes

|        |        |
| ------ | ------ |
| `vrai` | `faux` |

## Autocomplétion

- Autocomplétion des mots réservés et des fonctions/procédures prdéfinies.
- Autocomplétion de toutes les structures de contrôle.
- Autocomplétion des opérateurs de comparaison:

| Déclencheur | Opérateur |
| ----------- | --------- |
| `>=`        | `≤`       |
| `<=`        | `≥`       |
| `!=`        | `≠`       |

## Extraits de code

### TDO : Tableau de Déclaration des Objets

> `tdo-1` (une ligne)  
> `tdo-3` (3 lignes)

```
┌─────────────────────────┬───────────────────┐
│          Objet          │   Nature / Type   │
├─────────────────────────┼───────────────────┤
│ x                       │ entier            │
└─────────────────────────┴───────────────────┘
```

### TDNT : Tableau de Déclaration des Nouveaux Types

> `tdnt-1` (type tableau)  
> `tdnt-2` (2 lignes/types: enregistrement & tableau)

```
┌─────────────────────────────────────────────┐
│               Nouveaux Types                │
├─────────────────────────────────────────────┤
│ eleve = enregistrement                      │
│     nom : chaîne                            │
│     age : entier                            │
│ fin                                         │
├─────────────────────────────────────────────┤
│ eleves = tableau de 20 entier               │
└─────────────────────────────────────────────┘
```

### x-snippets

| Déclencheur         | extrait de code                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| `x-saisir-n`        | Procédure qui permet la saisie controlée d'un nombre                                                    |
| `x-remp-tab`        | Procédure qui remplit un tableau à une dimension                                                        |
| `x-aff-tab`         | Procédure qui affiche le contenu d'un tableau                                                           |
| `x-remp-mat-carrée` | Procédure qui remplit une matrice carrée                                                                |
| `x-remp-mat`        | Procédure qui remplit une matrice                                                                       |
| `x-tri-bul-1`       | Procédure qui met en ordre les éléments d'un tableau en utilisant la méthode de tri à bulles (v.1)      |
| `x-tri-bul-2`       | Procédure qui met en ordre les éléments d'un tableau en utilisant la méthode de tri à bulles (v.2)      |
| `x-tri-sél-1`       | Procédure qui met en ordre les éléments d'un tableau en utilisant la méthode de tri par sélection (v.1) |
| `x-tri-sél-2`       | Procédure qui met en ordre les éléments d'un tableau en utilisant la méthode de tri par sélection (v.2) |
| `x-tri-ins-1`       | Procédure qui met en ordre les éléments d'un tableau en utilisant la méthode de tri par insertion (v.1) |
| `x-alpha-1`         | Fonction qui vérifie si une chaîne est composée uniquement par des lettres alphabétiques (v.1)          |
| `x-alpha-2`         | Fonction qui vérifie si une chaîne est composée uniquement par des lettres alphabétiques (v.2)          |
| `x-num`             | Fonction qui vérifie si une chaîne est composée uniquement par des chiffres                             |

![x-snippets](https://github.com/romoez/algo-tn-vscode/raw/main/images/x-snippets.gif)

## Notes de version

### 0.0.3

- x-snippet `x-tri-bul-2`: tri à bulles (v.2)
- x-snippet `x-tri-sél-2`: tri par sélection (v.2)
- x-snippet `x-alpha-1`: vérification si une chaîne est alphabétique (v.1).
- x-snippet `x-alpha-2`: vérification si une chaîne est alphabétique (v.2).
- x-snippet `x-num`: vérification si une chaîne est numérique.
- x-snippet `x-aff-tab`: affichage d'un tableau.
- améléoration du dessin des tableaux (tdo et tdnt)
- nouveau logo de l'extension

### 0.0.2

- x-snippet `x-saisir-n`: saisie contrôlée d'un nombre
- x-snippet `x-remp-tab`: remplissage contrôlé d'un tableau à une dimension
- x-snippet `x-remp-mat-carrée`: remplissage contrôlé d'une matrice carrée
- x-snippet `x-remp-mat`: remplissage contrôlé d'une matrice
- x-snippet `x-tri-bul-1`: tri à bulles (v.1)
- x-snippet `x-tri-sél-1`: tri par sélection (v.1)
- x-snippet `x-tri-ins-1`: tri par insertion (v.1)

### 0.0.1

- Version initiale avec coloration et snippets de la syntaxe du pseudocode utilisé pour écrire les algorithmes.
