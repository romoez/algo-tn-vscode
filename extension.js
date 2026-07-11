const vscode = require('vscode');
const path = require('path');
const { execFile } = require('child_process');

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
    // Exécuter le fichier .algo courant avec le transpileur tools/algotn.py
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
}

function deactivate() { }

module.exports = { activate, deactivate };
