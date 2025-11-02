# Algorithme en Pseudocode

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/les-profs-d-info.algorithme-tn)](https://marketplace.visualstudio.com/items?itemName=les-profs-d-info.algorithme-tn)

_A VSCode extension offering syntax highlighting and snippets for French pseudocode, tailored for the Tunisian high school curriculum._

Une extension qui fournit la coloration syntaxique et des extraits de code (snippets) pour le pseudocode standard de l'enseignement secondaire tunisien :tunisia:.
![algorithme-tn](https://github.com/romoez/algo-tn-vscode/raw/main/images/algorithme-tn.gif)

-   [Algorithme en Pseudocode](#algorithme-en-pseudocode)
    -   [Coloration Syntaxique](#coloration-syntaxique)
        -   [Commentaires](#commentaires)
        -   [Mots clés](#mots-clés)
        -   [Fonctions & Procédures prédéfinies](#fonctions--procédures-prédéfinies)
        -   [Types](#types)
        -   [Mots clés de déclaration](#mots-clés-de-déclaration)
        -   [Opérateurs de comparaison](#opérateurs-de-comparaison)
        -   [Opérateurs logiques](#opérateurs-logiques)
        -   [Constantes](#constantes)
    -   [Autocomplétion](#autocomplétion)
    -   [Documentation contextuelle complète](#documentation-contextuelle-complète)
    -   [Extraits de code](#extraits-de-code)
        -   [TDO : Tableau de Déclaration des Objets](#tdo--tableau-de-déclaration-des-objets)
        -   [TDNT : Tableau de Déclaration des Nouveaux Types](#tdnt--tableau-de-déclaration-des-nouveaux-types)
        -   [x-snippets](#x-snippets)
    -   [Notes de version](#notes-de-version)
        -   [0.0.6](#006)
        -   [0.0.5](#005)
        -   [0.0.4](#004)
        -   [0.0.3](#003)
        -   [0.0.2](#002)
        -   [0.0.1](#001)

## Coloration Syntaxique

### Commentaires

```javascript
// commentaire jusqu'à la fin de la ligne

/* commentaire
sur plusieurs
lignes */
```

### Mots clés

|            |                |             |
| ---------- | -------------- | ----------- |
| `à`        | `fin_selon`    | `répéter`   |
| `alors`    | `fin_si`       | `retourner` |
| `autres`   | `fin_tant_que` | `selon`     |
| `de`       | `fin`          | `si`        |
| `début`    | `jusqu'à`      | `sinon`     |
| `faire`    | `pas`          | `tant que`  |
| `fin_pour` | `pour`         |             |

### Fonctions & Procédures prédéfinies

|             |               |                 |
| ----------- | ------------- | --------------- |
| `abs`       | `ent`         | `majus`         |
| `aléa`      | `estnum`      | `ord`           |
| `arrondi`   | `fermer`      | `ouvrir`        |
| `chr`       | `fin_fichier` | `pos`           |
| `convch`    | `lire`        | `racine_carrée` |
| `écrire`    | `lire_ligne`  | `sous_chaîne`   |
| `écrire_nl` | `long`        | `valeur`        |
| `effacer`   |               |                 |

### Types

|             |                     |                 |
| ----------- | ------------------- | --------------- |
| `booléen`   | `enregistrement`    | `fichier texte` |
| `caractère` | `entier`            | `réel`          |
| `chaîne`    | `fichier de <type>` | `tableau`       |

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

-   Autocomplétion des mots réservés et des fonctions/procédures prédéfinies.
-   Autocomplétion de toutes les structures de contrôle.
-   Autocomplétion des opérateurs de comparaison:

| Déclencheur    | Opérateur |
| -------------- | --------- |
| `<=`           | `≤`       |
| `>=`           | `≥`       |
| `!=` ou `<>`   | `≠`       |
| `in` ou `dans` | `∈`       |

## Documentation contextuelle complète

L'extension fournit des **descriptions détaillées** pour tous les éléments du pseudocode :

![Démonstration des descriptions contextuelles](https://github.com/romoez/algo-tn-vscode/raw/main/images/syntaxe-description.gif)

**Éléments documentés :**

-   **Structures de contrôle** : `si`, `pour`, `tant que`, `selon`, `répéter`, etc.
-   **Fonctions et procédures prédéfinies** : `écrire`, `lire`, `aléa`, `racine_carrée`, `long`, `pos`, etc.
-   **Types de données** :
    -   Simples : `entier`, `réel`, `booléen`, `caractère`, `chaîne`
    -   Structurés : `enregistrement`, `fichier texte`, `fichier typé (binaire)`
-   **Opérateurs** :
    -   Logiques : `et`, `ou`, `non`
    -   De comparaison : `≥`, `>`, `≤`, `<`, `=`, `≠`, `∈`
    -   Arithmétiques entiers : `div`, `mod`
-   **x-snippets** : fonctions et procédures avancées : tri, recherche, factorielle, PGCD, palindrome, etc.

**Chaque description inclut :**

-   Syntaxe précise et paramètres
-   Contraintes, préconditions et cas particuliers
-   Exemples concrets d’utilisation

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

| Déclencheur                | Description du Snippet                                                                           |
| :------------------------- | :----------------------------------------------------------------------------------------------- |
| `x-saisir-n`               | Procédure de **saisie contrôlée** d'un nombre.                                                   |
| `x-remplir-tableau`        | Procédure pour **remplir un tableau** à une dimension.                                           |
| `x-afficher-tableau`       | Procédure pour **afficher le contenu** d'un tableau.                                             |
| `x-remplir-matrice-carrée` | Procédure pour **remplir une matrice carrée**.                                                   |
| `x-remplir-matrice`        | Procédure pour **remplir une matrice** (générique).                                              |
| `x-tri-à-bulles`           | Procédure de **tri à bulles**.                                                                   |
| `x-tri-sélection-1`        | Procédure de **tri par sélection** (version 1).                                                  |
| `x-tri-sélection-2`        | Procédure de **tri par sélection** (version 2).                                                  |
| `x-tri-insertion`          | Procédure de **tri par insertion**.                                                              |
| `x-tri-shell-1`            | Procédure de **tri de Shell** avec la **séquence d'écarts originale** proposée par Donald Shell. |
| `x-tri-shell-2`            | Procédure de **tri de Shell** avec la **séquence d'écarts** proposée par Donald Knuth.           |
| `x-recherche-séquentielle` | Fonction de **recherche séquentielle** : retourne vrai si trouvé, faux sinon.                    |
| `x-recherche-dichotomique` | Fonction de **recherche dichotomique** : retourne l'indice ou -1 si absent.                      |
| `x-alpha`                  | Fonction vérifiant si une chaîne est **alphabétique**.                                           |
| `x-numérique`              | Fonction vérifiant si une chaîne **contient uniquement des chiffres**.                           |
| `x-factorielle`            | Fonction de calcul de la **factorielle** d'un entier N (N!).                                     |
| `x-factorielle-rec`        | Fonction **récursive** qui calcule la **factorielle** d'un entier N (N!).                        |
| `x-puissance`              | Fonction qui calcule x^n, avec x réel et n entier.                                               |
| `x-puissance-rec`          | Fonction **récursive** qui calcule x^n, avec x réel et n entier.                                 |
| `x-premier-naif`           | Fonction qui vérifie si un entier n est **premier** (version naïve).                             |
| `x-premier-opt`            | Fonction qui vérifie si un entier n est **premier** (version optimisée).                         |
| `x-facteurs-premiers`      | Fonction qui décompose un entier en produit de facteurs premiers.                                |
| `x-pgcd-diff`              | Fonction qui calcule le **PGCD** par la **méthode des différences**.                             |
| `x-pgcd-euclide`           | Fonction qui calcule le **PGCD** par l'algorithme d'**Euclide**.                                 |
| `x-pgcd-diff-rec`          | Fonction **récursive** qui calcule le **PGCD** par la **méthode des différences**.               |
| `x-pgcd-euclide-rec`       | Fonction **récursive** qui calcule le **PGCD** par l'algorithme d'**Euclide**.                   |
| `x-ppcm`                   | Fonction qui calcule le **PPCM** de deux entiers a et b.                                         |
| `x-ppcm-naif`              | Fonction qui calcule le **PPCM** par la méthode des multiples (version naïve).                   |
| `x-palindrome`             | Fonction qui vérifie si une chaîne est un **palindrome**.                                        |
| `x-palindrome-rec`         | Fonction **récursive** qui vérifie si une chaîne est un **palindrome**.                          |
| `x-conversion-b10-base`    | Fonction qui convertit un nombre décimal (base 10) en base b (2 ≤ b ≤ 36).                       |
| `x-conversion-base-b10`    | Fonction qui convertit un nombre en base b (2 ≤ b ≤ 36) vers la base 10 (décimal).               |
| `x-transfert-t-vers-f`     | Procédure de transfert du contenu d'un tableau vers un fichier typé.                             |
| `x-transfert-f-vers-t`     | Procédure de transfert du contenu d'un fichier typé vers un tableau.                             |
| `x-code-source`            | Ajout d'un fragment de code en **Python** ou **JavaScript**.                                     |

![x-snippets](https://github.com/romoez/algo-tn-vscode/raw/main/images/x-snippets.gif)

## Notes de version

### 0.0.6

-   documentation détaillée avec exemples pour toutes les structures, types, opérateurs et fonctions prédéfinies.
-   nouveaux x-snippets :
    -   recherche : `x-recherche-séquentielle`, `x-recherche-dichotomique`
    -   arithmétique : `x-factorielle`, `x-factorielle-rec`, `x-puissance`, `x-puissance-rec`,
        `x-premier-naif`, `x-premier-opt`, `x-facteurs-premiers`,
        `x-pgcd-diff`, `x-pgcd-euclide`, `x-pgcd-diff-rec`, `x-pgcd-euclide-rec`,
        `x-ppcm`, `x-ppcm-naif`
    -   chaînes : `x-palindrome`, `x-palindrome-rec`
    -   conversion entre les bases de numération : `x-conversion-b10-base`, `x-conversion-base-b10`
    -   fichiers/tableaux : `x-transfert-t-vers-f`, `x-transfert-f-vers-t`

### 0.0.5

-   support de la structure `selon`
-   support de l'opérateur `∈` (appartient)
-   x-snippet `x-tri-shell-1`: tri de Shell avec la séquence d'écarts (gaps) originale
-   x-snippet `x-tri-shell-2`: tri de Shell avec la séquence d'écarts (gaps) de Knuth

### 0.0.4

-   possibilité d'ajout des fragments de code en _python_ ou en _javascript_.
-   x-snippet `x-code-source`: ajout d'un fragment de code en _python_ ou en _javascript_.

### 0.0.3

-   x-snippet `x-tri-bul-2`: tri à bulles (v.2)
-   x-snippet `x-tri-sél-2`: tri par sélection (v.2)
-   x-snippet `x-alpha-1`: vérification si une chaîne est alphabétique (v.1).
-   x-snippet `x-alpha-2`: vérification si une chaîne est alphabétique (v.2).
-   x-snippet `x-num`: vérification si une chaîne est numérique.
-   x-snippet `x-aff-tab`: affichage d'un tableau.
-   améléoration du dessin des tableaux (tdo et tdnt)
-   nouveau logo de l'extension

### 0.0.2

-   x-snippet `x-saisir-n`: saisie contrôlée d'un nombre
-   x-snippet `x-remp-tab`: remplissage contrôlé d'un tableau à une dimension
-   x-snippet `x-remp-mat-carrée`: remplissage contrôlé d'une matrice carrée
-   x-snippet `x-remp-mat`: remplissage contrôlé d'une matrice
-   x-snippet `x-tri-bul-1`: tri à bulles (v.1)
-   x-snippet `x-tri-sél-1`: tri par sélection (v.1)
-   x-snippet `x-tri-ins-1`: tri par insertion (v.1)

### 0.0.1

-   Version initiale avec coloration et snippets de la syntaxe du pseudocode utilisé pour écrire les algorithmes.
