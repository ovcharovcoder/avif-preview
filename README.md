# Avif Preview

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/ovcharovcoder.avif-preview?color=blue)](https://marketplace.visualstudio.com/items?itemName=ovcharovcoder.avif-preview)
[![GitHub Stars](https://img.shields.io/github/stars/ovcharovcoder/avif-preview?color=yellow)](https://github.com/ovcharovcoder/avif-preview)
[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/ovcharovcoder/avif-preview/blob/main/LICENSE.md)

![Avif Preview Banner](https://raw.githubusercontent.com/ovcharovcoder/avif-preview/main/images/avif-preview-banner.png)

> Avif Preview — Preview AVIF images in VS Code with gallery, zoom, and pan.

---

## ✨ Features

- 🖼 AVIF Preview — Open .avif files in a webview.
- 🖼 Gallery Support — View multiple images from a folder.
- 🔍 Zoom & Pan — Scroll to zoom, drag to pan.
- 🛠 Toolbar & Controls — Quick zoom, reset, fit, and close.
- 📊 Metadata — Shows scale, dimensions, and file size.
- 🛡️ Secure Rendering — Safe Webview with theme adaptation and CSP.

---

## 🛠 Installation

1. Open **VS Code → Extensions** (`Ctrl+Shift+X` / `Cmd+Shift+X`).
2. Search for **Avif Preview** and click Install.

---

## 🎨 Usage

To preview an AVIF file:

- Right-click an .avif file in the Explorer and select **Open AVIF Preview**.
- Select a single AVIF file, multiple files, or a folder — all selected images will be added to the gallery.
- Scroll with the mouse wheel to zoom in/out.
- Drag images to pan when zoomed.
- Use the toolbar buttons for quick actions:
  - Zoom In
  - Zoom Out
  - Reset Zoom
  - Fit Image(s) to Screen
  - Close Preview
- Metadata panel shows scale, dimensions, and file size.

- **Keyboard Shortcuts** — All toolbar actions can also be controlled via keyboard:
  - `Ctrl+Alt+V` (Windows) / `Cmd+Alt+V` (Mac) — Open .avif file.
    These shortcuts work when an AVIF file is selected in the Explorer.
  - `+` / `=` — Zoom In
  - `-` — Zoom Out
  - `0` — Reset Zoom
  - `f` — Fit Image(s) to Screen
  - `Escape` — Close Preview

---

## 🧩 Contributing

Found a bug or want to suggest an improvement?  
Open an issue or pull request on [GitHub](https://github.com/ovcharovcoder/avif-preview).

---

## 👤 Author

<img 
  src="https://raw.githubusercontent.com/ovcharovcoder/avif-preview/main/images/avatar.png"
  alt="Andriy Ovcharov"
  width="60"
/>

Andriy Ovcharov  
📧 ovcharovcoder@gmail.com

---

## ☕ Support

If you enjoy DevFoundry Umber, consider supporting the author:  
[Donate via PayPal](https://www.paypal.com/donate/?business=datoshcode@gmail.com)

---

## 🪪 License

Released under the [MIT License](https://raw.githubusercontent.com/ovcharovcoder/avif-preview/main/LICENSE.md)

---

## 🧑‍💻 Development & Build

**Requirements**

- Node.js 18+
- npm 9+
- VS Code 1.81+


**Install & Build**
`npm install -g @vscode/vsce` <br>
`vsce package`



