# Changelog

All notable changes to the "algorithme-tn" extension will be documented in this file.

## [Unreleased]

## [0.0.6] - 2025-10-31

### Ajouté

- descriptions détaillées avec exemples pour :
  - structures simples
  - structures de contrôle  
  - fonctions et procédures prédéfinies
  - types simples (`entier`, `réel`, `booléen`, `caractère`, `chaîne`)
  - types structurés (`enregistrement`, `fichier texte`, `fichier typé/binaire`)
  - opérateurs logiques (`et`, `ou`, `non`)
  - opérateurs de comparaison (`≥`, `>`, `≤`, `<`, `=`, `≠`, `∈`)
  - opérateurs arithmétiques entiers (`div`, `mod`)
- nouveaux x-snippets :
  - recherche : `x-recherche-séquentielle`, `x-recherche-dichotomique`
  - arithmétique : `x-factorielle`, `x-factorielle-rec`, `x-puissance`, `x-puissance-rec`,
    `x-premier-naif`, `x-premier-opt`, `x-facteurs-premiers`,
    `x-pgcd-diff`, `x-pgcd-euclide`, `x-pgcd-diff-rec`, `x-pgcd-euclide-rec`,
    `x-ppcm`, `x-ppcm-naif`
  - chaînes : `x-palindrome`, `x-palindrome-rec`
  - conversion entre les bases de numération : `x-conversion-b10-base`, `x-conversion-base-b10`
  - fichiers/tableaux : `x-transfert-t-vers-f`, `x-transfert-f-vers-t`

### Modifié

- tri à bulles : ajustement de la boucle principale (`0` à `N-2` au lieu de `1` à `N-1`) pour une implémentation standard.
- x-snippet `est_alphabetique`: renommée en `alpha` pour plus de concision.
- restructuration interne : division des snippets en `base.json` (syntaxe de base) et `x-snippets.json` (snippets avancés).


### Corrigé

- erreur dans l'algorithme du tri par sélection.

### Supprimé

- x-snippet de la fonction `est_alphabetique` version 2.
- la fonction prédéfinie `pointer`.

## [0.0.5] - 2025-09-15

### Ajouté

- support de la structure de contrôle `selon` (choix multiple).
- support de l'opérateur d'appartenance `∈`.
- ajout de la procédure `écrire_nl` (affichage avec saut de ligne).
- x-snippet `x-tri-shell-1` : tri de Shell avec la séquence d'écarts originale.
- x-snippet `x-tri-shell-2` : tri de Shell avec la séquence d'écarts de Knuth.

### Modifié

- des modifications mineures dans les procédures de tri.

### Supprimé

- support de la fonction `taille_fichier`.
- tri à bulles v.2.

## [0.0.4] - 2021-04-24

### Ajouté

- possibilité d'ajout des fragments de code en _python_ ou en _javascript_.
- x-snippet `x-code-source`: ajout d'un fragment de code en _python_ ou en _javascript_.

### Modifié

- nouvelles images animées dans _readme.md_.
- republication avec le nouveau publisher _les-profs-d-info_.

## [0.0.3] - 2021-04-20

### Ajouté

- x-snippet `x-tri-bul-2`: tri à bulles (v.2).
- x-snippet `x-tri-sél-2`: tri par sélection (v.2).
- x-snippet `x-alpha-1`: vérification si une chaîne est alphabétique (v.1).
- x-snippet `x-alpha-2`: vérification si une chaîne est alphabétique (v.2).
- x-snippet `x-num`: vérification si une chaîne est numérique.
- x-snippet `x-aff-tab`: affichage d'un tableau.

### Corrigé

- auto-complétion des opérateurs `div` et `mod`.
- auto-indentation après `sinon`.
- des corrections mineures.

### Modifié

- améléoration du dessin des tableaux (tdo et tdnt).
- nouveau logo de l'extension.

## [0.0.2] - 2021-04-17

### Ajouté

- x-snippet `x-saisir-n`: saisie contrôlée d'un nombre.
- x-snippet `x-remp-tab`: remplissage contrôlé d'un tableau à une dimension.
- x-snippet `x-remp-mat-carrée`: remplissage contrôlé d'une matrice carrée.
- x-snippet `x-remp-mat`: remplissage contrôlé d'une matrice.
- x-snippet `x-tri-bul-1`: tri à bulles (v.1).
- x-snippet `x-tri-sél-1`: tri par sélection (v.1).
- x-snippet `x-tri-ins-1`: tri par insertion (v.1).

### Corrigé

- auto-complétion des opérateurs `<--`, `≤`, et `≥`.

### Supprimé

- suppression de la prise en charge des opérateurs `>=` et `<=`.

## [0.0.1] - 2021-04-11

- Première version.
