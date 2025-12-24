const vscode = acquireVsCodeApi();

const img = document.getElementById('image');
const meta = document.getElementById('meta');
const container = document.getElementById('container');
const toolbar = document.getElementById('toolbar');

let scale = 1;
let x = 0;
let y = 0;

let isDragging = false;
let startX = 0;
let startY = 0;

const MIN_SCALE = 0.5;
const MAX_SCALE = 20;

/* =====================================================
   HELPERS
===================================================== */

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

function limitPan() {
  const cw = container.clientWidth;
  const ch = container.clientHeight;

  const iw = img.naturalWidth * scale;
  const ih = img.naturalHeight * scale;

  const maxX = Math.max(0, (iw - cw) / 2);
  const maxY = Math.max(0, (ih - ch) / 2);

  x = clamp(x, -maxX, maxX);
  y = clamp(y, -maxY, maxY);
}

function updateCursor() {
  container.style.cursor = isDragging
    ? 'grabbing'
    : scale > 1
    ? 'grab'
    : 'zoom-in';
}

function render() {
  limitPan();
  img.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;

  meta.textContent = `Scale: ${scale.toFixed(2)}x • ${img.naturalWidth}×${
    img.naturalHeight
  } • ${formatSize(window.__AVIF_DATA__.fileSize)}`;

  updateCursor();
}

/* =====================================================
   IMAGE LOAD
===================================================== */

img.onload = render;

/* =====================================================
   MOUSE WHEEL ZOOM
===================================================== */

container.addEventListener(
  'wheel',
  e => {
    e.preventDefault();

    const rect = container.getBoundingClientRect();
    const cx = e.clientX - rect.left - rect.width / 2;
    const cy = e.clientY - rect.top - rect.height / 2;

    const prev = scale;
    scale = clamp(scale * (e.deltaY > 0 ? 0.9 : 1.1), MIN_SCALE, MAX_SCALE);

    x -= (cx / prev) * (scale - prev);
    y -= (cy / prev) * (scale - prev);

    render();
  },
  { passive: false }
);

/* =====================================================
   DRAG PAN
===================================================== */

container.addEventListener('mousedown', e => {
  if (scale <= 1) return;

  isDragging = true;
  startX = e.clientX - x;
  startY = e.clientY - y;
  updateCursor();
});

window.addEventListener('mousemove', e => {
  if (!isDragging) return;
  x = e.clientX - startX;
  y = e.clientY - startY;
  render();
});

window.addEventListener('mouseup', () => {
  isDragging = false;
  updateCursor();
});

/* =====================================================
   TOOLBAR BUTTONS
===================================================== */

toolbar.addEventListener('click', e => {
  const a = e.target.dataset.action;
  if (!a) return;

  if (a === 'zoomIn') scale *= 1.2;
  if (a === 'zoomOut') scale /= 1.2;
  if (a === 'reset') {
    scale = 1;
    x = y = 0;
  }
  if (a === 'fit') {
    scale = Math.min(
      container.clientWidth / img.naturalWidth,
      container.clientHeight / img.naturalHeight
    );
    x = y = 0;
  }
  if (a === 'close') {
    vscode.postMessage({ command: 'close' });
    return;
  }

  scale = clamp(scale, MIN_SCALE, MAX_SCALE);
  render();
});

/* =====================================================
   KEYBOARD SHORTCUTS (WINDOW)
===================================================== */

window.addEventListener('keydown', e => {
  switch (e.key) {
    case '+':
    case '=':
      scale *= 1.1;
      break;
    case '-':
      scale /= 1.1;
      break;
    case '0':
      scale = 1;
      x = y = 0;
      break;
    case 'f':
    case 'F':
      scale = Math.min(
        container.clientWidth / img.naturalWidth,
        container.clientHeight / img.naturalHeight
      );
      x = y = 0;
      break;
    case 'Escape':
      vscode.postMessage({ command: 'close' });
      return;
    default:
      return;
  }

  scale = clamp(scale, MIN_SCALE, MAX_SCALE);
  render();
});

/* =====================================================
   UTILS
===================================================== */

function formatSize(bytes) {
  return bytes < 1024 * 1024
    ? (bytes / 1024).toFixed(1) + ' KB'
    : (bytes / 1024 / 1024).toFixed(1) + ' MB';
}
