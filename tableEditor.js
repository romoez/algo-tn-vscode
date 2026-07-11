// Éditeur de tableaux de déclaration (TDO / TDOG / TDOL) dans un onglet VSCode.
const vscode = require('vscode');

const TYPES = ['entier', 'réel', 'booléen', 'caractère', 'chaîne',
    'fonction', 'procédure', 'fichier texte', 'tableau de 20 entier'];

const MOTS_CLES = new Set(['si', 'sinon', 'alors', 'pour', 'de', 'a', 'faire',
    'pas', 'tant', 'que', 'repeter', 'jusqu', 'selon', 'autres', 'debut',
    'fin', 'algorithme', 'fonction', 'procedure', 'retourner', 'et', 'ou',
    'non', 'ouex', 'div', 'mod', 'vrai', 'faux', 'var', 'lire', 'ecrire',
    'ecrire_nl', 'afficher', 'saisir', 'abs', 'ent', 'arrondi', 'alea',
    'racine_carree', 'chr', 'ord', 'majus', 'convch', 'valeur', 'estnum',
    'long', 'pos', 'sous_chaine', 'effacer', 'i']);

function sansAccents(s) {
    return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// ---------------------------------------------------------------------------
// Analyse du document
// ---------------------------------------------------------------------------
function trouverTables(lignes) {
    const tables = [];
    let i = 0;
    while (i < lignes.length) {
        if (lignes[i].trim().startsWith('┌')) {
            const debut = i;
            const rangs = [];
            let j = i + 1;
            while (j < lignes.length && !lignes[j].trim().startsWith('└')) {
                const m = lignes[j].trim().match(/^│([^│]*)│([^│]*)│$/);
                if (m) {
                    const objet = m[1].trim();
                    const type = m[2].trim();
                    if (!(/objet/i.test(objet) && /nature|type/i.test(type))) {
                        rangs.push({ objet, type });
                    }
                }
                j++;
            }
            if (j < lignes.length) {
                // contexte : ligne de code non vide au-dessus du tableau
                let ctx = 'Tableau';
                for (let k = debut - 1; k >= 0 && k >= debut - 8; k--) {
                    const t = lignes[k].trim();
                    if (/^(fin|fonction|procédure|procedure|algorithme)/i.test(t)) {
                        ctx = t.length > 46 ? t.slice(0, 45) + '…' : t;
                        break;
                    }
                }
                // les tableaux à 2 colonnes uniquement (pas les TDNT)
                if (rangs.length || !lignes.slice(debut, j).some(l => l.includes('='))) {
                    tables.push({ debut, fin: j, rangs, ctx });
                }
                i = j + 1;
                continue;
            }
        }
        i++;
    }
    return tables;
}

function objetsDeclares(lignes, tables) {
    const declares = new Set();
    for (const t of tables) {
        for (const r of t.rangs) {
            r.objet.split(',').forEach(n =>
                declares.add(sansAccents(n.replace(/@/g, '').trim()).toLowerCase()));
        }
    }
    for (const l of lignes) {
        // déclarations en clair : x, y : entier
        let m = l.match(/^\s*([\wÀ-ſ@, ]+?)\s*:\s*([\wÀ-ſ][\wÀ-ſ' ]*)\s*$/);
        if (m) {
            m[1].split(',').forEach(n =>
                declares.add(sansAccents(n.replace(/@/g, '').trim()).toLowerCase()));
        }
        // paramètres formels : fonction f(n : entier ; entier m)
        m = l.match(/^\s*(?:fonction|fn|procédure|procedure|proc)\s+[\wÀ-ſ]+\s*\((.*)\)/i);
        if (m) {
            for (const p of m[1].split(/[;,]/)) {
                const mots = p.replace(/@/g, '').replace(/:.*/, '').trim().split(/\s+/);
                const nom = mots[mots.length - 1];
                if (nom) {
                    declares.add(sansAccents(nom).toLowerCase());
                }
            }
        }
    }
    return declares;
}

function objetsNonDeclares(lignes, declares) {
    const trouves = new Map(); // nom -> nature proposée
    const ajouter = (nom, nature) => {
        nom = nom.trim().replace(/@/g, '');
        const cle = sansAccents(nom).toLowerCase();
        if (/^[A-Za-zÀ-ſ_][\wÀ-ſ]*$/.test(nom) && !MOTS_CLES.has(cle)
            && !declares.has(cle) && !trouves.has(cle)) {
            trouves.set(cle, { nom, nature });
        }
    };
    for (const l of lignes) {
        if (/^\s*[┌├└│]/.test(l) || /^\s*\/\//.test(l)) {
            continue;
        }
        let m = l.match(/^\s*([\wÀ-ſ@]+)\s*(?:\[[^\]]*\])?\s*(?:←|<-)/);
        if (m) {
            ajouter(m[1], 'entier');
        }
        m = l.match(/^\s*(?:fonction|fn)\s+([\wÀ-ſ]+)/i);
        if (m) {
            ajouter(m[1], 'fonction');
        }
        m = l.match(/^\s*(?:procédure|procedure|proc)\s+([\wÀ-ſ]+)/i);
        if (m) {
            ajouter(m[1], 'procédure');
        }
        m = l.match(/^\s*pour\s+([\wÀ-ſ]+)\s/i);
        if (m) {
            ajouter(m[1], 'entier');
        }
        const re = /(?:lire|saisir)\s*\(([^)]*)\)/gi;
        while ((m = re.exec(l))) {
            m[1].split(',').forEach(v => ajouter(v.split('[')[0], 'entier'));
        }
    }
    return [...trouves.values()];
}

// ---------------------------------------------------------------------------
// Redessin d'un tableau
// ---------------------------------------------------------------------------
function dessinerTable(rangs) {
    const w1 = Math.max(36, ...rangs.map(r => r.objet.length + 2));
    const w2 = Math.max(26, ...rangs.map(r => r.type.length + 2));
    const pad = (s, w) => ' ' + s + ' '.repeat(Math.max(1, w - s.length - 1));
    const centre = (s, w) => {
        const g = Math.floor((w - s.length) / 2);
        return ' '.repeat(g) + s + ' '.repeat(w - s.length - g);
    };
    const out = [
        '┌' + '─'.repeat(w1) + '┬' + '─'.repeat(w2) + '┐',
        '│' + centre('Objet', w1) + '│' + centre('Nature / Type', w2) + '│',
    ];
    for (const r of rangs) {
        out.push('├' + '─'.repeat(w1) + '┼' + '─'.repeat(w2) + '┤');
        out.push('│' + pad(r.objet, w1) + '│' + pad(r.type, w2) + '│');
    }
    out.push('└' + '─'.repeat(w1) + '┴' + '─'.repeat(w2) + '┘');
    return out.join('\n');
}

// ---------------------------------------------------------------------------
// Webview
// ---------------------------------------------------------------------------
function html(webview) {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy"
      content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
<style>
  body { font-family: var(--vscode-font-family); color: var(--vscode-foreground);
         padding: 0 16px 60px; }
  h2 { font-weight: 600; }
  h3 { margin: 18px 0 6px; font-weight: 600; opacity: .9; }
  table { border-collapse: collapse; width: 100%; max-width: 640px; }
  th, td { border: 1px solid var(--vscode-panel-border); padding: 4px 6px; text-align: left; }
  th { background: var(--vscode-editor-inactiveSelectionBackground); }
  input, select { width: 100%; box-sizing: border-box; background: var(--vscode-input-background);
         color: var(--vscode-input-foreground); border: 1px solid transparent; padding: 4px; }
  input:focus, select:focus { border-color: var(--vscode-focusBorder); outline: none; }
  button { background: var(--vscode-button-background); color: var(--vscode-button-foreground);
         border: none; padding: 5px 12px; margin: 6px 6px 6px 0; cursor: pointer; border-radius: 2px; }
  button.discret { background: var(--vscode-button-secondaryBackground);
         color: var(--vscode-button-secondaryForeground); }
  .sup { background: transparent; color: var(--vscode-errorForeground); font-size: 15px;
         padding: 0 6px; margin: 0; }
  .badge { display: inline-flex; align-items: center; gap: 6px; margin: 4px 8px 4px 0;
         padding: 4px 8px; border: 1px dashed var(--vscode-panel-border); border-radius: 4px; }
  .badge select { width: auto; }
  #barre { position: fixed; bottom: 0; left: 0; right: 0; padding: 10px 16px;
         background: var(--vscode-editor-background);
         border-top: 1px solid var(--vscode-panel-border); }
  .ctx { font-family: var(--vscode-editor-font-family); opacity: .7; font-weight: 400; }
</style>
</head>
<body>
<h2>Tableaux de déclaration</h2>
<p>Modifiez les objets ci-dessous puis cliquez sur <b>Appliquer</b> :
les tableaux du fichier <code>.algo</code> sont redessinés automatiquement.</p>
<div id="nondeclares"></div>
<div id="tables"></div>
<button id="nouveau" class="discret">＋ Nouveau tableau (fin du fichier)</button>
<div id="barre">
  <button id="appliquer">✔ Appliquer dans le fichier</button>
  <button id="recharger" class="discret">↺ Recharger depuis le fichier</button>
</div>
<datalist id="types">${TYPES.map(t => `<option value="${t}">`).join('')}</datalist>
<script>
const vscode = acquireVsCodeApi();
let donnees = { tables: [], nonDeclares: [] };

function rendre() {
  const zone = document.getElementById('tables');
  zone.innerHTML = '';
  donnees.tables.forEach((t, ti) => {
    const h = document.createElement('h3');
    h.innerHTML = 'Tableau ' + (ti + 1) +
      ' — <span class="ctx">' + (t.ctx || '') + '</span>';
    zone.appendChild(h);
    const tab = document.createElement('table');
    tab.innerHTML = '<tr><th>Objet</th><th>Nature / Type</th><th></th></tr>';
    t.rangs.forEach((r, ri) => {
      const tr = document.createElement('tr');
      const c1 = document.createElement('td');
      const i1 = document.createElement('input');
      i1.value = r.objet;
      i1.oninput = () => { r.objet = i1.value; };
      c1.appendChild(i1);
      const c2 = document.createElement('td');
      const i2 = document.createElement('input');
      i2.value = r.type;
      i2.setAttribute('list', 'types');
      i2.oninput = () => { r.type = i2.value; };
      c2.appendChild(i2);
      const c3 = document.createElement('td');
      const sup = document.createElement('button');
      sup.className = 'sup';
      sup.textContent = '✕';
      sup.title = 'Supprimer cette ligne';
      sup.onclick = () => { t.rangs.splice(ri, 1); rendre(); };
      c3.appendChild(sup);
      tr.append(c1, c2, c3);
      tab.appendChild(tr);
    });
    zone.appendChild(tab);
    const plus = document.createElement('button');
    plus.className = 'discret';
    plus.textContent = '＋ Ajouter un objet';
    plus.onclick = () => { t.rangs.push({ objet: '', type: 'entier' }); rendre(); };
    zone.appendChild(plus);
  });

  const nd = document.getElementById('nondeclares');
  nd.innerHTML = '';
  if (donnees.nonDeclares.length && donnees.tables.length) {
    const h = document.createElement('h3');
    h.textContent = 'Objets utilisés dans le code mais absents des tableaux :';
    nd.appendChild(h);
    donnees.nonDeclares.forEach((v, vi) => {
      const b = document.createElement('span');
      b.className = 'badge';
      const nom = document.createElement('b');
      nom.textContent = v.nom;
      const sel = document.createElement('select');
      ${JSON.stringify(TYPES)}.forEach(t => {
        const o = document.createElement('option');
        o.value = o.textContent = t;
        if (t === v.nature) { o.selected = true; }
        sel.appendChild(o);
      });
      const ou = document.createElement('select');
      donnees.tables.forEach((t, ti) => {
        const o = document.createElement('option');
        o.value = ti;
        o.textContent = 'Tableau ' + (ti + 1);
        ou.appendChild(o);
      });
      const add = document.createElement('button');
      add.textContent = '＋ Déclarer';
      add.onclick = () => {
        donnees.tables[+ou.value].rangs.push({ objet: v.nom, type: sel.value });
        donnees.nonDeclares.splice(vi, 1);
        rendre();
      };
      b.append(nom, sel, ou, add);
      nd.appendChild(b);
    });
  }
}

document.getElementById('appliquer').onclick = () =>
  vscode.postMessage({ type: 'appliquer', tables: donnees.tables });
document.getElementById('recharger').onclick = () =>
  vscode.postMessage({ type: 'recharger' });
document.getElementById('nouveau').onclick = () => {
  donnees.tables.push({ debut: -1, fin: -1, rangs: [{ objet: '', type: 'entier' }], ctx: 'nouveau' });
  rendre();
};

window.addEventListener('message', e => { donnees = e.data; rendre(); });
</script>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Commande : ouvrir l'éditeur de tableaux
// ---------------------------------------------------------------------------
function ouvrirEditeur(context) {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'algo') {
        vscode.window.showErrorMessage('Ouvrez un fichier .algo pour éditer ses tableaux.');
        return;
    }
    const doc = editor.document;
    const panel = vscode.window.createWebviewPanel(
        'algoTables',
        `Tableaux — ${doc.fileName.split(/[\\/]/).pop()}`,
        vscode.ViewColumn.Beside,
        { enableScripts: true });
    panel.webview.html = html(panel.webview);

    const envoyer = () => {
        const lignes = doc.getText().split(/\r?\n/);
        const tables = trouverTables(lignes);
        const declares = objetsDeclares(lignes, tables);
        panel.webview.postMessage({
            tables,
            nonDeclares: objetsNonDeclares(lignes, declares),
        });
    };

    panel.webview.onDidReceiveMessage(async msg => {
        if (msg.type === 'recharger') {
            envoyer();
            return;
        }
        if (msg.type === 'appliquer') {
            const edit = new vscode.WorkspaceEdit();
            const existants = msg.tables
                .filter(t => t.debut >= 0)
                .sort((a, b) => b.debut - a.debut); // de bas en haut
            for (const t of existants) {
                const rangs = t.rangs.filter(r => r.objet.trim() && r.type.trim());
                const plage = new vscode.Range(t.debut, 0,
                    t.fin, doc.lineAt(Math.min(t.fin, doc.lineCount - 1)).text.length);
                edit.replace(doc.uri, plage, dessinerTable(rangs));
            }
            for (const t of msg.tables.filter(t => t.debut < 0)) {
                const rangs = t.rangs.filter(r => r.objet.trim() && r.type.trim());
                if (rangs.length) {
                    const fin = new vscode.Position(doc.lineCount, 0);
                    edit.insert(doc.uri, fin, '\n' + dessinerTable(rangs) + '\n');
                }
            }
            await vscode.workspace.applyEdit(edit);
            await doc.save();
            envoyer();
        }
    }, undefined, context.subscriptions);

    envoyer();
}

module.exports = { ouvrirEditeur, trouverTables, dessinerTable, sansAccents };
