#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
traduire — traduit un fichier .algo en Python SANS l'exécuter.

C'est le compagnon de algotn.py (qui, lui, traduit puis exécute) :
même transpileur, mais la sortie est un fichier .py que vous pouvez
lire, modifier ou lancer vous-même avec `python fichier.py`.

Usage :
    python traduire.py fichier.algo             # crée fichier.py à côté
    python traduire.py fichier.algo sortie.py   # nom de sortie choisi
    python traduire.py fichier.algo --show      # affiche aussi le code généré
"""

import os
import sys

from algotn import Transpiler, TranspileError


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

    args = [a for a in sys.argv[1:] if a != "--show"]
    show = "--show" in sys.argv
    if not args or args[0] in ("-h", "--help"):
        print(__doc__)
        sys.exit(0)

    path = args[0]
    out_file = args[1] if len(args) > 1 else os.path.splitext(path)[0] + ".py"

    try:
        with open(path, encoding="utf-8-sig") as f:
            source = f.read()
    except FileNotFoundError:
        print(f"Erreur : fichier introuvable : {path}")
        sys.exit(1)

    try:
        py = Transpiler().transpile(source)
    except TranspileError as e:
        print(f"Erreur de transpilation — {e}")
        sys.exit(1)

    # validation de la syntaxe du Python généré, sans l'exécuter
    try:
        compile(py, out_file, "exec")
    except SyntaxError as e:
        print("Erreur de syntaxe — cette ligne n'a pas été comprise :")
        print(f"    {(e.text or '').strip()}")
        print("Vérifiez l'orthographe des mots-clés (algorithme, si, pour, "
              "fonction, procédure...) et la structure de la ligne.")
        sys.exit(1)

    with open(out_file, "w", encoding="utf-8") as f:
        f.write(py)
    if show:
        print("─" * 50)
        print(py)
        print("─" * 50)
    print(f"Traduction réussie → {out_file}")
    print(f"Pour l'exécuter : python \"{out_file}\"")


if __name__ == "__main__":
    main()
