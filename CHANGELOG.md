# Changelog

All notable changes to the Avif Preview VS Code extension will be documented in this file.
<br>

## [1.0.1] - 2025-12-23

### Changed

* Switched to an implementation using a separate Webview panel opened via a command from the context menu (instead of a custom editor).
* Improved stability of AVIF image preview by avoiding conflicts with the built-in VS Code mechanism.
* Added automatic image refresh when the file changes (using FileSystemWatcher + cache-busting).
* Enhanced loading diagnostics (onload/onerror status indicators).

### Fixed

Resolved issues with displaying certain AVIF files that occurred in the previous custom editor-based implementation.


## [1.0.0] - 2025-12-22
### Added

* Initial release of the Avif Preview extension.
* Preview of AVIF images in a dedicated panel with support for zooming (mouse wheel and click) and panning.
* Adaptation to the VS Code theme (background and fonts).
* Secure rendering using Webview and Content-Security-Policy.
* Context menu entry in Explorer for *.avif files ("Open AVIF Preview").


