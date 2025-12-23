const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

function activate(context) {
  const disposable = vscode.commands.registerCommand(
    'avifpreview.open',
    async uri => {
      if (!uri) {
        vscode.window.showErrorMessage('No resource selected');
        return;
      }

      let targetUri = uri;

      // Determine whether it is a file or a folder
      let stat;
      try {
        stat = await vscode.workspace.fs.stat(uri);
      } catch {
        vscode.window.showErrorMessage('Cannot access resource');
        return;
      }

      // If the folder is AVIF, we are looking for it.
      if (stat.type === vscode.FileType.Directory) {
        const files = await vscode.workspace.fs.readDirectory(uri);
        const avifs = files
          .filter(
            ([name, type]) =>
              type === vscode.FileType.File &&
              name.toLowerCase().endsWith('.avif')
          )
          .map(([name]) => vscode.Uri.joinPath(uri, name));

        if (!avifs.length) {
          vscode.window.showInformationMessage('No AVIF files found in folder');
          return;
        }

        if (avifs.length > 1) {
          const pick = await vscode.window.showQuickPick(
            avifs.map(u => ({
              label: path.basename(u.fsPath),
              uri: u,
            })),
            { placeHolder: 'Select AVIF image to preview' }
          );
          if (!pick) return;
          targetUri = pick.uri;
        } else {
          targetUri = avifs[0];
        }
      }

      // Creating a WebView
      const panel = vscode.window.createWebviewPanel(
        'avifpreview',
        `AVIF Preview — ${path.basename(targetUri.fsPath)}`,
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.file(context.extensionPath),
            vscode.Uri.file(path.dirname(targetUri.fsPath)),
          ],
        }
      );

      // File metadata
      const fileStat = await fs.promises.stat(targetUri.fsPath);
      const fileSize = fileStat.size;

      // HTML from index.html
      panel.webview.html = getWebviewHtml(
        context,
        panel.webview,
        targetUri,
        fileSize
      );

      // Message from WebView
      panel.webview.onDidReceiveMessage(message => {
        if (message.command === 'close') {
          panel.dispose();
        }
      });

      // Watcher for live refresh
      const folderUri = vscode.Uri.file(path.dirname(targetUri.fsPath));
      const watcher = vscode.workspace.createFileSystemWatcher(
        new vscode.RelativePattern(folderUri, path.basename(targetUri.fsPath))
      );

      watcher.onDidChange(() => {
        panel.webview.postMessage({ command: 'refresh' });
      });

      panel.onDidDispose(() => watcher.dispose());
    }
  );

  context.subscriptions.push(disposable);
}

/**
 * Loads index.html and inserts placeholders
 */
function getWebviewHtml(context, webview, imageUri, fileSize) {
  const nonce = getNonce();

  const templatePath = vscode.Uri.joinPath(
    context.extensionUri,
    'webview',
    'index.html'
  );

  let html = fs.readFileSync(templatePath.fsPath, 'utf8');

  const imgSrc = webview.asWebviewUri(imageUri);
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, 'webview', 'viewer.js')
  );
  const styleUri = webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, 'webview', 'style.css')
  );

  const replacements = {
    cspSource: webview.cspSource,
    nonce,
    imgSrc,
    scriptUri,
    styleUri,
    fileSize,
  };

  for (const [key, value] of Object.entries(replacements)) {
    html = html.replaceAll(`{{${key}}}`, String(value));
  }

  return html;
}

function getNonce() {
  let text = '';
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
