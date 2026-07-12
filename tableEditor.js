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
  :root { --gap: 8px; }
  body { font-family: var(--vscode-font-family); color: var(--vscode-foreground);
         padding: 0 16px 72px; font-size: 13px; }
  h2 { font-weight: 600; margin: 14px 0 4px; }
  .intro { opacity: .8; margin: 0 0 12px; }
  .carte { border: 1px solid var(--vscode-panel-border); border-radius: 6px;
         margin: 14px 0; overflow: hidden; }
  .entete { display: flex; align-items: center; gap: var(--gap);
         padding: 8px 12px; background: var(--vscode-editor-inactiveSelectionBackground); }
  .entete .titre { font-weight: 600; }
  .entete .ctx { font-family: var(--vscode-editor-font-family); opacity: .65;
         font-weight: 400; font-size: 12px; }
  .entete .pousse { margin-left: auto; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border-top: 1px solid var(--vscode-panel-border); padding: 0; text-align: left; }
  th { padding: 5px 10px; font-weight: 600; opacity: .8;
       background: var(--vscode-editor-background); }
  th.actions, td.actions { width: 96px; text-align: center; white-space: nowrap; }
  td .cell { display: flex; }
  input, select { width: 100%; box-sizing: border-box; background: transparent;
         color: var(--vscode-input-foreground); border: 1px solid transparent;
         padding: 6px 10px; font-size: 13px; font-family: inherit; }
  input:hover, select:hover { background: var(--vscode-input-background); }
  input:focus, select:focus { background: var(--vscode-input-background);
         border-color: var(--vscode-focusBorder); outline: none; }
  tr.pending { background: color-mix(in srgb,
         var(--vscode-inputValidation-warningBackground, #6b5300) 22%, transparent); }
  tr.pending td:first-child::before { content: "détecté"; position: absolute;
         font-size: 9px; opacity: .6; margin: -2px 0 0 2px; }
  .ico { background: transparent; border: none; cursor: pointer; padding: 4px 6px;
         color: var(--vscode-foreground); opacity: .55; font-size: 13px; border-radius: 4px; }
  .ico:hover { opacity: 1; background: var(--vscode-toolbar-hoverBackground); }
  .ico.sup:hover { color: var(--vscode-errorForeground); }
  .pied { padding: 8px 12px; }
  button.bouton { background: var(--vscode-button-background);
         color: var(--vscode-button-foreground); border: none; padding: 6px 14px;
         margin: 0 6px 0 0; cursor: pointer; border-radius: 4px; font-size: 13px; }
  button.discret { background: var(--vscode-button-secondaryBackground);
         color: var(--vscode-button-secondaryForeground); }
  #barre { position: fixed; bottom: 0; left: 0; right: 0; padding: 10px 16px;
         background: var(--vscode-editor-background); display: flex; align-items: center;
         gap: 8px; border-top: 1px solid var(--vscode-panel-border); }
  #barre .info { margin-left: auto; opacity: .7; font-size: 12px; }
</style>
</head>
<body>
<h2>Éditeur de tableaux de déclaration</h2>
<p class="intro">Modifiez les objets comme dans un tableur. Les objets
<b>détectés</b> dans le code mais non déclarés sont ajoutés automatiquement
(lignes surlignées) — ajustez leur type puis <b>Appliquer</b>.</p>
<div id="tables"></div>
<button id="nouveau" class="bouton discret">＋ Nouveau tableau</button>
<div id="barre">
  <button id="appliquer" class="bouton">✔ Appliquer dans le fichier</button>
  <button id="recharger" class="bouton discret">↺ Recharger</button>
  <button id="detecter" class="bouton discret">🔎 Re-détecter les objets</button>
  <span class="info" id="compteur"></span>
</div>
<datalist id="types">${TYPES.map(t => `<option value="${t}">`).join('')}</datalist>
<script>
const vscode = acquireVsCodeApi();
const TYPES = ${JSON.stringify(TYPES)};
let donnees = { tables: [], nonDeclares: [] };

// Fusionne les objets détectés (non déclarés) comme lignes "pending"
// dans le premier tableau, pour qu'ils soient visibles et éditables.
function injecterDetectes() {
  if (!donnees.tables.length) { return; }
  const cible = donnees.tables[0];
  for (const v of donnees.nonDeclares || []) {
    const existe = donnees.tables.some(t =>
      t.rangs.some(r => r.objet.split(',').some(n =>
        n.trim().toLowerCase() === v.nom.toLowerCase())));
    if (!existe) {
      cible.rangs.push({ objet: v.nom, type: v.nature, pending: true });
    }
  }
  donnees.nonDeclares = [];
}

function icone(txt, titre, cls) {
  const b = document.createElement('button');
  b.className = 'ico' + (cls ? ' ' + cls : '');
  b.textContent = txt;
  b.title = titre;
  return b;
}

function champ(valeur, liste, onChange) {
  const i = document.createElement('input');
  i.value = valeur;
  if (liste) { i.setAttribute('list', liste); }
  i.oninput = () => onChange(i.value);
  return i;
}

function rendre() {
  const zone = document.getElementById('tables');
  zone.innerHTML = '';
  let nbPending = 0;

  donnees.tables.forEach((t, ti) => {
    const carte = document.createElement('div');
    carte.className = 'carte';

    const entete = document.createElement('div');
    entete.className = 'entete';
    const titre = document.createElement('span');
    titre.className = 'titre';
    titre.textContent = 'Tableau ' + (ti + 1);
    const ctx = document.createElement('span');
    ctx.className = 'ctx';
    ctx.textContent = t.ctx || '';
    const pousse = document.createElement('span');
    pousse.className = 'pousse';
    const suppr = icone('🗑 tableau', 'Supprimer ce tableau', 'sup');
    suppr.onclick = () => { donnees.tables.splice(ti, 1); rendre(); };
    pousse.appendChild(suppr);
    entete.append(titre, ctx, pousse);
    carte.appendChild(entete);

    const tab = document.createElement('table');
    const thead = document.createElement('tr');
    thead.innerHTML = '<th>Objet</th><th>Nature / Type</th>'
      + '<th class="actions">Actions</th>';
    tab.appendChild(thead);

    t.rangs.forEach((r, ri) => {
      if (r.pending) { nbPending++; }
      const tr = document.createElement('tr');
      if (r.pending) { tr.className = 'pending'; }

      const c1 = document.createElement('td');
      c1.style.position = 'relative';
      c1.appendChild(champ(r.objet, null, v => { r.objet = v; }));

      const c2 = document.createElement('td');
      c2.appendChild(champ(r.type, 'types', v => { r.type = v; }));

      const c3 = document.createElement('td');
      c3.className = 'actions';
      const haut = icone('↑', 'Monter');
      haut.onclick = () => { if (ri > 0) {
        [t.rangs[ri - 1], t.rangs[ri]] = [t.rangs[ri], t.rangs[ri - 1]]; rendre(); } };
      const bas = icone('↓', 'Descendre');
      bas.onclick = () => { if (ri < t.rangs.length - 1) {
        [t.rangs[ri + 1], t.rangs[ri]] = [t.rangs[ri], t.rangs[ri + 1]]; rendre(); } };
      const acc = icone('✓', 'Confirmer (garder cette ligne)');
      acc.style.visibility = r.pending ? 'visible' : 'hidden';
      acc.onclick = () => { delete r.pending; rendre(); };
      const sup = icone('✕', 'Supprimer la ligne', 'sup');
      sup.onclick = () => { t.rangs.splice(ri, 1); rendre(); };
      c3.append(haut, bas, acc, sup);

      tr.append(c1, c2, c3);
      tab.appendChild(tr);
    });
    carte.appendChild(tab);

    const pied = document.createElement('div');
    pied.className = 'pied';
    const plus = document.createElement('button');
    plus.className = 'bouton discret';
    plus.textContent = '＋ Ajouter un objet';
    plus.onclick = () => { t.rangs.push({ objet: '', type: 'entier' }); rendre(); };
    pied.appendChild(plus);
    carte.appendChild(pied);

    zone.appendChild(carte);
  });

  document.getElementById('compteur').textContent = nbPending
    ? nbPending + ' objet(s) détecté(s) à confirmer' : '';
}

document.getElementById('appliquer').onclick = () => {
  // on retire le marqueur pending : tout ce qui reste est déclaré
  donnees.tables.forEach(t => t.rangs.forEach(r => delete r.pending));
  vscode.postMessage({ type: 'appliquer', tables: donnees.tables });
};
document.getElementById('recharger').onclick = () =>
  vscode.postMessage({ type: 'recharger' });
document.getElementById('detecter').onclick = () =>
  vscode.postMessage({ type: 'recharger' });
document.getElementById('nouveau').onclick = () => {
  donnees.tables.push({ debut: -1, fin: -1,
    rangs: [{ objet: '', type: 'entier' }], ctx: 'nouveau' });
  rendre();
};

window.addEventListener('message', e => {
  donnees = e.data;
  injecterDetectes();
  rendre();
});
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
