const vscode = require('vscode');
const path = require('path');

function activate(context) {
  const openDisposable = vscode.commands.registerCommand(
    'avifpreview.open',
    async uri => {
      if (!uri) {
        vscode.window.showErrorMessage('No file selected');
        return;
      }

      const panel = vscode.window.createWebviewPanel(
        'avifpreview',
        `AVIF Preview: ${path.basename(uri.fsPath)}`,
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          localResourceRoots: [vscode.Uri.file(path.dirname(uri.fsPath))],
        }
      );

      let imgSrc = panel.webview.asWebviewUri(uri);
      const nonce = getNonce();

      panel.webview.html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy"
      content="default-src 'none'; img-src ${panel.webview.cspSource} blob: data:; style-src ${panel.webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AVIF Preview</title>
<style>
html, body {
    margin:0; padding:0;
    width:100%; height:100%;
    display:flex; justify-content:center; align-items:center;
    background: var(--vscode-editor-background);
    overflow:hidden;
    font-family: var(--vscode-font-family);
}
#avifImage {
    max-width:100%; max-height:100%;
    object-fit: contain;
    cursor: zoom-in;
    transition: transform 0.2s ease;
}
#status {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    padding: 6px 12px;
    border-radius: 4px;
    background: rgba(0,0,0,0.3);
    color: white;
    font-size: 14px;
    font-weight: bold;
}
</style>
</head>
<body>
<img id="avifImage" src="${imgSrc}" alt="AVIF preview">
<div id="status">Waiting for image to load...</div>
<script nonce="${nonce}">
const vscodeApi = acquireVsCodeApi();
const img = document.getElementById('avifImage');
const status = document.getElementById('status');

let scale = 1;
let isPanning = false;
let startX = 0, startY = 0;
let translateX = 0, translateY = 0;

function updateTransform(){
    img.style.transform = \`translate(\${translateX}px,\${translateY}px) scale(\${scale})\`;
}

// Image load status
img.onload = () => {
    status.textContent = 'Image loaded ✅';
    status.style.background = 'rgba(0,128,0,0.5)';
};
img.onerror = (e) => {
    status.textContent = 'Load error ❌';
    status.style.background = 'rgba(255,0,0,0.5)';
    console.error('Image load error:', e);
};

// Zoom
img.addEventListener('wheel', e => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    scale = Math.min(Math.max(scale * delta, 0.5), 10);
    updateTransform();
});

// Pan
img.addEventListener('mousedown', e => {
    if(scale <= 1) return;
    isPanning = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    img.style.cursor = 'grabbing';
});
document.addEventListener('mousemove', e => {
    if(!isPanning) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateTransform();
});
document.addEventListener('mouseup', () => {
    isPanning = false;
    img.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
});

// Click to zoom
img.addEventListener('click', () => {
    if(scale === 1){
        scale = 2;
    } else {
        scale = 1;
        translateX = translateY = 0;
    }
    updateTransform();
});

// Listen to messages from extension
window.addEventListener('message', event => {
    const message = event.data;
    if(message.command === 'refresh'){
        // Update image src with cache-busting query param
        img.src = '${imgSrc}?t=' + new Date().getTime();
    }
});
</script>
</body>
</html>
`;

      // Watch file changes
      const watcher = vscode.workspace.createFileSystemWatcher(uri.fsPath);
      watcher.onDidChange(() => {
        panel.webview.postMessage({ command: 'refresh' });
      });

      panel.onDidDispose(() => {
        watcher.dispose();
      });
    }
  );

  context.subscriptions.push(openDisposable);
}

function getNonce() {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

function deactivate() {}

module.exports = { activate, deactivate };
