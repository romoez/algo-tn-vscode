const vscode = require('vscode');
const path = require('path');
const { execFile } = require('child_process');
const { ouvrirEditeur, sansAccents } = require('./tableEditor');

// Vérifie qu'un interpréteur répond à --version (l'alias Microsoft Store
// de python.exe sous Windows échoue ici, ce qui est le comportement voulu).
function interpreteurValide(cmd) {
    return new Promise(resolve => {
        execFile(cmd, ['--version'], { timeout: 5000 }, err => resolve(!err));
    });
}

async function trouverPython() {
    const config = vscode.workspace.getConfiguration('algo').get('pythonPath', 'python');
    const candidats = [config, 'python', 'py', 'python3']
        .filter((c, i, a) => c && a.indexOf(c) === i);
    for (const c of candidats) {
        if (await interpreteurValide(c)) {
            return c;
        }
    }
    return null;
}

function activate(context) {
    // ------------------------------------------------------------------
    // ▶ Exécuter le fichier .algo courant (transpileur tools/algotn.py)
    // ------------------------------------------------------------------
    context.subscriptions.push(
        vscode.commands.registerCommand('algo.run', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor || editor.document.languageId !== 'algo') {
                vscode.window.showErrorMessage("Ouvrez un fichier .algo pour l'exécuter.");
                return;
            }
            await editor.document.save();

            const python = await trouverPython();
            if (!python) {
                const choix = await vscode.window.showErrorMessage(
                    "Python est introuvable : il est nécessaire pour exécuter les algorithmes. "
                    + "Installez-le (cochez « Add python.exe to PATH ») puis redémarrez VSCode, "
                    + "ou indiquez son chemin dans le réglage « algo.pythonPath ».",
                    'Télécharger Python', 'Ouvrir les réglages');
                if (choix === 'Télécharger Python') {
                    vscode.env.openExternal(vscode.Uri.parse('https://www.python.org/downloads/'));
                } else if (choix === 'Ouvrir les réglages') {
                    vscode.commands.executeCommand('workbench.action.openSettings', 'algo.pythonPath');
                }
                return;
            }

            const transpiler = context.asAbsolutePath(path.join('tools', 'algotn.py'));
            let term = vscode.window.terminals.find(t => t.name === 'Algorithme');
            if (!term) {
                term = vscode.window.createTerminal('Algorithme');
            }
            term.show();
            term.sendText(`${python} "${transpiler}" "${editor.document.fileName}"`);
        })
    );

    // ------------------------------------------------------------------
    // Traduire (seulement) le .algo en Python, sans l'exécuter
    // ------------------------------------------------------------------
    context.subscriptions.push(
        vscode.commands.registerCommand('algo.translate', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor || editor.document.languageId !== 'algo') {
                vscode.window.showErrorMessage('Ouvrez un fichier .algo pour le traduire.');
                return;
            }
            await editor.document.save();

            const python = await trouverPython();
            if (!python) {
                const choix = await vscode.window.showErrorMessage(
                    'Python est introuvable : il est nécessaire pour la traduction. '
                    + 'Installez-le, puis redémarrez VSCode.',
                    'Télécharger Python');
                if (choix === 'Télécharger Python') {
                    vscode.env.openExternal(vscode.Uri.parse('https://www.python.org/downloads/'));
                }
                return;
            }

            const traducteur = context.asAbsolutePath(path.join('tools', 'traduire.py'));
            const source = editor.document.fileName;
            const sortie = source.replace(/\.alg[o]?$/i, '') + '.py';
            execFile(python, [traducteur, source, sortie], { timeout: 15000 },
                async (err, stdout, stderr) => {
                    const message = ((stdout || '') + (stderr || '')).trim();
                    if (err) {
                        vscode.window.showErrorMessage(
                            'Échec de la traduction : ' + (message || err.message));
                        return;
                    }
                    // ouvrir le .py généré à côté de l'algorithme
                    const doc = await vscode.workspace.openTextDocument(sortie);
                    await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
                    vscode.window.showInformationMessage(
                        'Traduit en Python (non exécuté) : '
                        + sortie.split(/[\\/]/).pop());
                });
        })
    );

    // ------------------------------------------------------------------
    // Éditeur de tableaux de déclaration dans un onglet
    // ------------------------------------------------------------------
    context.subscriptions.push(
        vscode.commands.registerCommand('algo.editerTables',
            () => ouvrirEditeur(context))
    );

    // ------------------------------------------------------------------
    // Ajout rapide d'un objet au tableau le plus proche du curseur
    // ------------------------------------------------------------------
    const NATURES = ['entier', 'réel', 'booléen', 'caractère', 'chaîne',
        'fonction', 'procédure', 'fichier texte'];
    const COL1 = 36;
    const COL2 = 26;

    context.subscriptions.push(
        vscode.commands.registerCommand('algo.ajouterObjet', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor || editor.document.languageId !== 'algo') {
                return;
            }
            const nom = await vscode.window.showInputBox({
                prompt: "Nom de l'objet (ex : n, moyenne, t)",
                validateInput: v =>
                    /^[\wÀ-ſ@]+(\s*,\s*[\wÀ-ſ@]+)*$/.test(v.trim()) ? null : 'Nom invalide',
            });
            if (!nom) {
                return;
            }
            let type = await vscode.window.showQuickPick(
                [...NATURES, 'tableau de N type…'],
                { placeHolder: "Nature / type de l'objet" });
            if (!type) {
                return;
            }
            if (type.startsWith('tableau')) {
                type = await vscode.window.showInputBox({
                    prompt: 'Type tableau', value: 'tableau de 20 entier',
                });
                if (!type) {
                    return;
                }
            }

            const doc = editor.document;
            const cur = editor.selection.active.line;
            let bas = -1;
            for (let d = 0; d < doc.lineCount && bas < 0; d++) {
                for (const i of [cur + d, cur - d]) {
                    if (i >= 0 && i < doc.lineCount
                        && doc.lineAt(i).text.trim().startsWith('└')) {
                        bas = i;
                        break;
                    }
                }
            }

            const pad = (s, w) => ' ' + s + ' '.repeat(Math.max(1, w - s.length - 1));

            if (bas < 0) {
                const table = [
                    '┌' + '─'.repeat(COL1) + '┬' + '─'.repeat(COL2) + '┐',
                    '│' + pad('              Objet', COL1) + '│' + pad('     Nature / Type', COL2) + '│',
                    '├' + '─'.repeat(COL1) + '┼' + '─'.repeat(COL2) + '┤',
                    '│' + pad(nom, COL1) + '│' + pad(type, COL2) + '│',
                    '└' + '─'.repeat(COL1) + '┴' + '─'.repeat(COL2) + '┘',
                ].join('\n');
                await editor.edit(e =>
                    e.insert(new vscode.Position(cur, 0), table + '\n'));
                return;
            }

            const bordure = doc.lineAt(bas).text;
            const colonnes = bordure.trim().slice(1, -1).split('┴');
            const w1 = colonnes[0].length;
            const w2 = colonnes.length > 1 ? colonnes[1].length : COL2;
            const retrait = bordure.match(/^\s*/)[0];
            const sep = retrait + '├' + '─'.repeat(w1) + '┼' + '─'.repeat(w2) + '┤';
            const rang = retrait + '│' + pad(nom, w1) + '│' + pad(type, w2) + '│';
            await editor.edit(e =>
                e.insert(new vscode.Position(bas, 0), sep + '\n' + rang + '\n'));
        })
    );

    // ------------------------------------------------------------------
    // Diagnostics : types non définis dans les tableaux de déclaration
    // ------------------------------------------------------------------
    const diags = vscode.languages.createDiagnosticCollection('algo');
    context.subscriptions.push(diags);

    function verifier(doc) {
        if (doc.languageId !== 'algo') {
            return;
        }
        const lignes = doc.getText().split(/\r?\n/);
        const nouveauxTypes = new Set();
        for (const l of lignes) {
            const m = l.match(/([\wÀ-ſ]+)\s*=\s*(tableau\s+de|enregistrement)/i);
            if (m) {
                nouveauxTypes.add(sansAccents(m[1]).toLowerCase());
            }
        }
        const liste = [];
        lignes.forEach((l, i) => {
            const m = l.match(/^\s*│([^│]+)│([^│]+)│\s*$/);
            if (!m) {
                return;
            }
            const objet = m[1].trim();
            const type = m[2].trim();
            if (!objet || !type || (/objet/i.test(objet) && /nature|type/i.test(type))) {
                return;
            }
            const t = sansAccents(type).toLowerCase().replace(/\s+/g, ' ');
            const ok = ['entier', 'reel', 'booleen', 'caractere', 'chaine',
                'fonction', 'procedure'].includes(t)
                || /^tableau de \d+ (entier|reel|booleen|caractere|chaine)$/.test(t)
                || /^fichier/.test(t)
                || /^constante/.test(t)
                || nouveauxTypes.has(t);
            if (!ok) {
                const debut = l.indexOf('│', l.indexOf('│') + 1) + 1 + m[2].search(/\S/);
                liste.push(new vscode.Diagnostic(
                    new vscode.Range(i, debut, i, debut + type.length),
                    `Type non défini : « ${type} ». Types valides : entier, réel, `
                    + 'booléen, caractère, chaîne, fonction, procédure, '
                    + 'tableau de N type, fichier, ou un type déclaré dans le TDNT.',
                    vscode.DiagnosticSeverity.Error));
            }
        });
        diags.set(doc.uri, liste);
    }

    let minuterie;
    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(verifier),
        vscode.workspace.onDidChangeTextDocument(e => {
            clearTimeout(minuterie);
            minuterie = setTimeout(() => verifier(e.document), 300);
        }),
        vscode.workspace.onDidCloseTextDocument(doc => diags.delete(doc.uri))
    );
    vscode.workspace.textDocuments.forEach(verifier);
}

function deactivate() { }

module.exports = { activate, deactivate };
