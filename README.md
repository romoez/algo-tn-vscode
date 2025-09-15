# Algorithme en Pseudocode

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/les-profs-d-info.algorithme-tn)](https://marketplace.visualstudio.com/items?itemName=les-profs-d-info.algorithme-tn)

_A VSCode extension offering syntax highlighting and snippets for French pseudocode, tailored for the Tunisian high school curriculum._

Une extension qui fournit la coloration syntaxique et des extraits de code (snippets) pour le pseudocode standard de l'enseignement secondaire tunisien :tunisia:.
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
    - [0.0.5](#005)
    - [0.0.4](#004)
    - [0.0.3](#003)
    - [0.0.2](#002)
    - [0.0.1](#001)

## Coloration Syntaxique

### Commentaires

```javascript
// commentaire jusqu'à la fin de la ligne

/* commentaire
sur plusieurs
lignes */
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

|             |               |                 |
| ----------- | ------------- | --------------- |
| `aléa`      | `estnum`      | `ord`           |
| `arrondi`   | `fermer`      | `ouvrir`        |
| `chr`       | `fin_fichier` | `pointer`       |
| `convch`    | `lire_ligne`  | `pos`           |
| `écrire_nl` | `lire`        | `racine_carrée` |
| `écrire`    | `long`        | `sous_chaîne`   |
| `effacer`   | `majus`       | `valeur`        |
| `ent`       |               |                 |

### Types

|                  |             |                     |
| ---------------- | ----------- | ------------------- |
| `booléen`        | `caractère` | `chaîne`            |
| `enregistrement` | `entier`    | `fichier de <type>` |
| `réel`           | `tableau`   | `fichier texte`     |

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
| `∈` | ``  |

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

| Déclencheur    | Opérateur |
| -------------- | --------- |
| `<=`           | `≤`       |
| `>=`           | `≥`       |
| `!=` ou `<>`   | `≠`       |
| `in` ou `dans` | `∈`       |

## Extraits de code

### TDO : Tableau de Déclaration des Objets

> `tdo-1` (une ligne)  
> `tdo-3` (3 lignes)

```
┌──────────────────────────────────┬────────────────────────┐
│               Objet              │      Nature / Type     │
├──────────────────────────────────┼────────────────────────┤
│ x                                │ entier                 │
└──────────────────────────────────┴────────────────────────┘
```

### TDNT : Tableau de Déclaration des Nouveaux Types

> `tdnt-1` (type tableau)  
> `tdnt-2` (2 lignes/types: enregistrement & tableau)

```
┌───────────────────────────────────────────────────────────┐
│                      Nouveaux Types                       │
├───────────────────────────────────────────────────────────┤
│ eleve = enregistrement                                    │
│     nom : chaîne                                          │
│     age : entier                                          │
│ fin                                                       │
├───────────────────────────────────────────────────────────┤
│ tab_eleves = tableau de 20 entier                         │
└───────────────────────────────────────────────────────────┘
```

### x-snippets

| Déclencheur         | extrait de code                                                                                |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| `x-saisir-n`        | Procédure qui permet la saisie controlée d'un nombre                                           |
| `x-remp-tab`        | Procédure qui remplit un tableau à une dimension                                               |
| `x-aff-tab`         | Procédure qui affiche le contenu d'un tableau                                                  |
| `x-remp-mat-carrée` | Procédure qui remplit une matrice carrée                                                       |
| `x-remp-mat`        | Procédure qui remplit une matrice                                                              |
| `x-tri-bul`         | Procédure de tri à bulles                                                                      |
| `x-tri-sél-1`       | Procédure de tri par sélection (v.1)                                                           |
| `x-tri-sél-2`       | Procédure de tri par sélection (v.2)                                                           |
| `x-tri-ins`         | Procédure de tri par insertion                                                                 |
| `x-tri-shell-1`     | Procédure de tri de Shell avec la séquence originale de gaps                                   |
| `x-tri-shell-2`     | Procédure de tri de Shell avec la séquence de gaps de Knuth                                    |
| `x-alpha-1`         | Fonction qui vérifie si une chaîne est composée uniquement par des lettres alphabétiques (v.1) |
| `x-alpha-2`         | Fonction qui vérifie si une chaîne est composée uniquement par des lettres alphabétiques (v.2) |
| `x-num`             | Fonction qui vérifie si une chaîne est composée uniquement par des chiffres                    |
| `x-code-source`     | Ajouter un fragment de code en _python_ ou en _javascript_                                     |

![x-snippets](https://github.com/romoez/algo-tn-vscode/raw/main/images/x-snippets.gif)

## Notes de version

### 0.0.5

- support de la structure `selon`
- support de l'opérateur `∈` (appartient)
- x-snippet `x-tri-shell-1`: tri de Shell avec la séquence d'écarts (gaps) originale
- x-snippet `x-tri-shell-2`: tri de Shell avec la séquence d'écarts (gaps) de Knuth

### 0.0.4

- possibilité d'ajout des fragments de code en _python_ ou en  _javascript_.
- x-snippet `x-code-source`: ajout d'un fragment de code en _python_ ou en _javascript_.

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
