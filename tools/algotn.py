#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
algotn — Transpileur / exécuteur de pseudocode tunisien vers Python.

Syntaxe supportée : le pseudocode de l'enseignement secondaire tunisien,
tel que défini par l'extension VSCode "Algorithme en Pseudocode" (algorithme-tn)
https://marketplace.visualstudio.com/items?itemName=hamdi-bergaoui.algorithme-tn

Usage :
    python algotn.py fichier.algo            # transpile + exécute
    python algotn.py fichier.algo --show     # affiche aussi le code Python généré
    python algotn.py fichier.algo --out f.py # sauvegarde le Python généré
    python algotn.py fichier.algo --no-run   # transpile sans exécuter
"""

import re
import sys
import unicodedata

# ---------------------------------------------------------------------------
# Runtime : fonctions prédéfinies du pseudocode, injectées dans le programme
# généré. Les chaînes du pseudocode sont indexées à partir de 1.
# ---------------------------------------------------------------------------
RUNTIME = '''\
import math as _math
import random as _random
import sys as _sys
try:
    _sys.stdout.reconfigure(encoding="utf-8")
    _sys.stderr.reconfigure(encoding="utf-8")
    if not _sys.stdin.isatty():
        _sys.stdin.reconfigure(encoding="utf-8-sig")
except Exception:
    pass

def _input():
    return input().strip().lstrip("\\ufeff")

def _lire():
    # variable non déclarée : détection automatique du type
    s = _input()
    try:
        return int(s)
    except ValueError:
        pass
    try:
        return float(s.replace(",", "."))
    except ValueError:
        pass
    low = s.strip().lower()
    if low == "vrai":
        return True
    if low == "faux":
        return False
    return s

def _lire_entier():
    while True:
        try:
            return int(_input())
        except ValueError:
            print("Valeur invalide, un entier est attendu. Refaire : ", end="")

def _lire_reel():
    while True:
        try:
            return float(_input().replace(",", "."))
        except ValueError:
            print("Valeur invalide, un réel est attendu. Refaire : ", end="")

def _lire_chaine():
    return input()

def _lire_booleen():
    while True:
        s = _input().lower()
        if s in ("vrai", "true", "1"):
            return True
        if s in ("faux", "false", "0"):
            return False
        print("Valeur invalide, vrai ou faux attendu. Refaire : ", end="")

def _ecrire(*args):
    print(*args, sep="")

def _ecrire_nl(*args):
    print(*args, sep="")

def ent(x):
    return _math.floor(x)

def arrondi(x, n=0):
    r = round(x, int(n))
    return int(r) if n == 0 else r

def racine_carree(x):
    return _math.sqrt(x)

def alea(a, b):
    return _random.randint(a, b)

def majus(ch):
    return ch.upper()

def convch(x):
    if isinstance(x, bool):
        return "vrai" if x else "faux"
    return str(x)

def valeur(ch):
    try:
        return int(ch), 0
    except ValueError:
        pass
    try:
        return float(ch.replace(",", ".")), 0
    except ValueError:
        return 0, 1

def estnum(ch):
    return valeur(ch)[1] == 0

def long(ch):
    return len(ch)

def pos(ch1, ch2):
    return ch2.find(ch1) + 1

def sous_chaine(ch, d, f):
    return ch[d - 1:f]

def effacer(ch, p, n):
    return ch[:p - 1] + ch[p - 1 + n:]

def _tableau(n, defaut):
    return [defaut] * (n + 1)  # indice 0 inutilisé : indexation 1..n
'''

DEFAULTS = {
    "entier": "0", "reel": "0.0", "booleen": "False",
    "caractere": '""', "chaine": '""',
}


def strip_accents(s: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", s)
                   if unicodedata.category(c) != "Mn")


class TranspileError(Exception):
    pass


class Transpiler:
    def __init__(self):
        self.out = []
        self.indent = 0
        # pile des blocs ouverts : 'si', 'pour', 'tant_que', 'repeter', 'selon'
        self.stack = []
        self.strings = []
        # table des symboles issue du TDO : nom (minuscules) -> type déclaré
        self.types = {}

    # -- protection des chaînes littérales ----------------------------------
    def _shelve_strings(self, line: str) -> str:
        def repl(m):
            self.strings.append(m.group(0))
            return f"\x00{len(self.strings) - 1}\x00"
        return re.sub(r'"[^"]*"|\'[^\']*\'', repl, line)

    def _unshelve_strings(self, line: str) -> str:
        return re.sub(r"\x00(\d+)\x00",
                      lambda m: self.strings[int(m.group(1))], line)

    # -- traduction des expressions ------------------------------------------
    def expr(self, e: str, cond: bool = True) -> str:
        e = e.strip()
        # opérateurs symboliques
        e = e.replace("←", "=").replace("<-", "=")
        e = e.replace("≠", "!=").replace("≤", "<=").replace("≥", ">=")
        e = e.replace("∈", " in ")
        # =  →  ==  (l'affectation utilise ← ; un = restant est une comparaison)
        if cond:
            e = re.sub(r"(?<![<>!=])=(?!=)", "==", e)
        # mots-clés logiques / arithmétiques / constantes
        words = {
            "et": "and", "ou": "or", "non": "not", "ouex": "^",
            "div": "//", "mod": "%", "vrai": "True", "faux": "False",
            "dans": "in",
        }
        for w, py in words.items():
            e = re.sub(rf"(?i)(?<![\w\x00]){w}(?![\w\x00])", py, e)
        # fonctions prédéfinies (formes accentuées → runtime sans accents)
        funcs = {
            "racine_carree": "racine_carree", "alea": "alea",
            "sous_chaine": "sous_chaine", "ecrire_nl": "_ecrire_nl",
            "ecrire": "_ecrire",
        }
        def f_repl(m):
            name = strip_accents(m.group(0)).lower()
            return funcs.get(name, name)
        e = re.sub(r"(?i)[\wÀ-ſ_]+(?=\s*\()", f_repl, e)
        return e.strip()

    # -- émission -------------------------------------------------------------
    def emit(self, code: str):
        self.out.append("    " * self.indent + self._unshelve_strings(code))

    def close(self, kinds, mot: str, num: int):
        if not self.stack or self.stack[-1] not in kinds:
            raise TranspileError(f"ligne {num}: « {mot} » sans bloc ouvert correspondant")
        self.stack.pop()
        self.indent -= 1

    # -- transpilation ---------------------------------------------------------
    def transpile(self, source: str) -> str:
        # commentaires /* ... */ (multi-lignes)
        source = re.sub(r"/\*.*?\*/", "", source, flags=re.S)
        self.out = [RUNTIME]

        for num, raw in enumerate(source.splitlines(), 1):
            line = self._shelve_strings(raw)
            line = re.sub(r"//.*", "", line).strip()   # commentaires //
            if not line:
                continue
            norm = strip_accents(line).lower()

            # --- en-tête / structure ------------------------------------------
            if re.match(r"(algorithme|programme)\b", norm):
                self.emit("# " + line)
                continue
            if norm in ("debut", "début"):
                continue
            if re.match(r"fin\s*$", norm) or re.match(r"fin\s+\w+\s*$", norm) \
                    and not norm.startswith(("fin_", "fin si", "fin pour",
                                             "fin tant", "fin selon")):
                if self.stack:
                    raise TranspileError(
                        f"ligne {num}: « fin » atteint mais bloc « {self.stack[-1]} » non fermé")
                continue

            # --- déclarations (TDO) --------------------------------------------
            m = re.match(r"(?i)(?:var\s+)?([\wÀ-ſ, ]+?)\s*:\s*tableau\s+de\s+(\w+)\s+([\wÀ-ſ]+)",
                         line.strip())
            if m:
                names = [n.strip() for n in m.group(1).split(",")]
                size, typ = m.group(2), strip_accents(m.group(3)).lower()
                default = DEFAULTS.get(typ, "0")
                for n in names:
                    self.types[strip_accents(n).lower()] = typ
                    self.emit(f"{n} = _tableau({size}, {default})")
                continue
            m = re.match(r"(?i)(?:var\s+)?([\wÀ-ſ, ]+?)\s*:\s*([\wÀ-ſ]+)\s*$", line.strip())
            if m and strip_accents(m.group(2)).lower() in DEFAULTS:
                # déclaration simple (TDO) : mémoriser le type pour lire()
                typ = strip_accents(m.group(2)).lower()
                for n in m.group(1).split(","):
                    self.types[strip_accents(n).lower().strip()] = typ
                continue
            if norm in ("var", "objet", "objets", "constantes", "types"):
                continue

            # --- si / sinon si / sinon / fin_si --------------------------------
            m = re.match(r"si\s+(.*?)\s+alors\s*$", norm)
            if m:
                cond = self._cut(line, r"(?i)^si\s+", r"(?i)\s+alors\s*$")
                self.emit(f"if {self.expr(cond)}:")
                self.stack.append("si")
                self.indent += 1
                continue
            m = re.match(r"sinon\s+si\s+(.*?)\s+alors\s*$", norm)
            if m:
                cond = self._cut(line, r"(?i)^sinon\s+si\s+", r"(?i)\s+alors\s*$")
                self.indent -= 1
                self.emit(f"elif {self.expr(cond)}:")
                self.indent += 1
                continue
            if norm in ("sinon", "sinon:"):
                self.indent -= 1
                self.emit("else:")
                self.indent += 1
                continue
            if re.match(r"(fin_si|finsi|fin\s+si)\s*$", norm):
                self.close(("si",), "fin_si", num)
                continue

            # --- pour ... de ... à ... [pas ...] faire --------------------------
            m = re.match(
                r"pour\s+([\wÀ-ſ]+)\s+(?:de|allant\s+de)\s+(.+?)\s+(?:a|à|jusqu'a|jusqu'à)\s+(.+?)(?:\s+pas\s+(.+?))?\s*(?:faire)?\s*$",
                norm)
            if m:
                mo = re.match(
                    r"(?i)pour\s+([\wÀ-ſ]+)\s+(?:de|allant\s+de)\s+(.+?)\s+(?:a|à|jusqu'a|jusqu'à)\s+(.+?)(?:\s+pas\s+(.+?))?\s*(?:faire)?\s*$",
                    line.strip())
                var, start, stop, step = mo.group(1), mo.group(2), mo.group(3), mo.group(4)
                start, stop = self.expr(start, cond=False), self.expr(stop, cond=False)
                if step:
                    step = self.expr(step, cond=False)
                    limit = f"({stop}) + (1 if ({step}) > 0 else -1)"
                    self.emit(f"for {var} in range({start}, {limit}, {step}):")
                else:
                    self.emit(f"for {var} in range({start}, ({stop}) + 1):")
                self.stack.append("pour")
                self.indent += 1
                continue
            if re.match(r"(fin_pour|finpour|fin\s+pour)\s*$", norm):
                self.close(("pour",), "fin_pour", num)
                continue

            # --- tant que ... faire ---------------------------------------------
            m = re.match(r"tant\s*_?\s*que\s+(.*?)\s*(?:faire)?\s*$", norm)
            if m:
                cond = self._cut(line, r"(?i)^tant\s*_?\s*que\s+", r"(?i)\s+faire\s*$")
                self.emit(f"while {self.expr(cond)}:")
                self.stack.append("tant_que")
                self.indent += 1
                continue
            if re.match(r"(fin_tant_que|fintantque|fin\s+tant\s*_?\s*que)\s*$", norm):
                self.close(("tant_que",), "fin_tant_que", num)
                continue

            # --- répéter ... jusqu'à --------------------------------------------
            if re.match(r"(repeter|répéter)\s*$", norm):
                self.emit("while True:")
                self.stack.append("repeter")
                self.indent += 1
                continue
            m = re.match(r"jusqu'?\s*a\s+(.+)$", norm)
            if m:
                cond = self._cut(line, r"(?i)^jusqu'?\s*(a|à)\s+", r"$")
                self.emit(f"if {self.expr(cond)}:")
                self.emit(f"    break")
                self.close(("repeter",), "jusqu'à", num)
                continue

            # --- selon ... fin_selon ---------------------------------------------
            m = re.match(r"selon\s+(.+?)\s*(?:faire)?\s*$", norm)
            if m:
                sel = self._cut(line, r"(?i)^selon\s+", r"(?i)\s+faire\s*$")
                self.emit(f"match {self.expr(sel, cond=False)}:")
                self.stack.append("selon")
                self.indent += 1
                self._selon_open = False
                continue
            if re.match(r"(fin_selon|finselon|fin\s+selon)\s*$", norm):
                if getattr(self, "_selon_open", False):
                    self.indent -= 1
                    self._selon_open = False
                self.close(("selon",), "fin_selon", num)
                continue
            if self.stack and self.stack[-1] == "selon":
                m = re.match(r"(.+?)\s*:\s*(.*)$", line.strip())
                if m:
                    if getattr(self, "_selon_open", False):
                        self.indent -= 1
                    values, rest = m.group(1), m.group(2)
                    if strip_accents(values).lower().strip() in ("autres", "autre", "sinon"):
                        self.emit("case _:")
                    else:
                        alts = " | ".join(self.expr(v, cond=False)
                                          for v in values.split(","))
                        self.emit(f"case {alts}:")
                    self.indent += 1
                    self._selon_open = True
                    if rest.strip():
                        self._statement(rest, num)
                    continue

            # --- instruction simple -----------------------------------------------
            self._statement(line, num)

        if self.stack:
            raise TranspileError(f"fin de fichier : bloc « {self.stack[-1]} » non fermé")
        return "\n".join(self._unshelve_strings(l) if "\x00" in l else l
                         for l in self.out) + "\n"

    def _cut(self, line: str, prefix: str, suffix: str) -> str:
        s = line.strip()
        s = re.sub(prefix, "", s)
        s = re.sub(suffix, "", s)
        return s

    def _statement(self, line: str, num: int):
        norm = strip_accents(line).lower().strip()
        # lire(a, b, ...)
        m = re.match(r"lire\s*\((.+)\)\s*$", norm)
        if m:
            readers = {"entier": "_lire_entier", "reel": "_lire_reel",
                       "chaine": "_lire_chaine", "caractere": "_lire_chaine",
                       "booleen": "_lire_booleen"}
            inner = re.match(r"(?i)lire\s*\((.+)\)\s*$", line.strip()).group(1)
            for v in inner.split(","):
                # type déclaré dans le TDO → lecture typée (t[i] → type de t)
                base = strip_accents(v).lower().strip().split("[")[0].strip()
                fn = readers.get(self.types.get(base), "_lire")
                self.emit(f"{self.expr(v, cond=False)} = {fn}()")
            return
        # écrire(...) / écrire_nl(...)
        m = re.match(r"(ecrire_nl|ecrire)\s*\((.*)\)\s*$", norm)
        if m:
            fn = "_ecrire_nl" if m.group(1) == "ecrire_nl" else "_ecrire"
            inner = re.match(r"(?i)[\wÀ-ſ_]+\s*\((.*)\)\s*$", line.strip()).group(1)
            self.emit(f"{fn}({self.expr(inner, cond=False)})")
            return
        # affectation x ← expr  (ou instruction quelconque)
        if "←" in line or "<-" in line:
            lhs, rhs = re.split(r"←|<-", line, maxsplit=1)
            self.emit(f"{self.expr(lhs, cond=False)} = {self.expr(rhs, cond=False)}")
            return
        self.emit(self.expr(line, cond=False))


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass
    args = [a for a in sys.argv[1:]]
    if not args or args[0] in ("-h", "--help"):
        print(__doc__)
        sys.exit(0)
    path = args[0]
    show = "--show" in args
    run = "--no-run" not in args
    out_file = None
    if "--out" in args:
        out_file = args[args.index("--out") + 1]

    try:
        with open(path, encoding="utf-8") as f:
            source = f.read()
    except FileNotFoundError:
        print(f"Erreur : fichier introuvable : {path}")
        sys.exit(1)

    try:
        py = Transpiler().transpile(source)
    except TranspileError as e:
        print(f"Erreur de transpilation — {e}")
        sys.exit(1)

    if show:
        print("─" * 50)
        print(py)
        print("─" * 50)
    if out_file:
        with open(out_file, "w", encoding="utf-8") as f:
            f.write(py)
        print(f"Python généré → {out_file}")
    if run:
        exec(compile(py, path, "exec"), {"__name__": "__main__"})


if __name__ == "__main__":
    main()
