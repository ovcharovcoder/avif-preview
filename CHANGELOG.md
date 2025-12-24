# Changelog

All notable changes to the Avif Preview VS Code extension will be documented in this file.
<br>

## [1.0.3] - 2025-12-24
### Changed
- Improved help documentation with clearer explanations.

## [1.0.2] - 2025-12-23
### Added

* Gallery support — preview multiple AVIF images from a folder and switch between them.
* Toolbar — quick controls for zoom in/out, reset, fit to screen, and close.
* Magnifying glass cursor — indicates zoom availability.
* Improved zooming — scales towards cursor position for precise inspection.
* Drag-to-pan support — move images freely within the preview when zoomed.
* Metadata panel — shows image dimensions, scale, and file size.
* Automatic image refresh — updates images when files change (FileSystemWatcher + cache-busting).
* Smooth transitions and animations for zooming and panning.
* Explorer integration — open preview via context menu or keyboard shortcut.
* Progress indicator — shows loading state of AVIF images.
* VS Code theme adaptation — background and metadata colors match editor theme.

### Changed

* Switched to using a dedicated Webview panel for AVIF previews with enhanced interactivity.
* Improved stability and performance for multiple-image previews.

### Fixed
* Resolved previous issues with image positioning and panning in multi-image previews.
* Corrected cursor behavior to reflect zoom availability.

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


