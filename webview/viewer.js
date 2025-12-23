const vscode = acquireVsCodeApi();

const img = document.getElementById('image');
const meta = document.getElementById('meta');
const loader = document.getElementById('loader');
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

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
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
  if (isDragging) {
    container.style.cursor = 'grabbing';
  } else {
    container.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
  }
}

function render() {
  limitPan();
  img.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;

  meta.textContent = `Scale: ${scale.toFixed(2)}x • ${img.naturalWidth}×${img.naturalHeight} • ${formatSize(
    window.__AVIF_DATA__.fileSize
  )}`;

  updateCursor();
}

img.onload = () => {
  loader.style.display = 'none';
  render();
};

/* === Zoom with mouse wheel (cursor-centered) === */
container.addEventListener(
  'wheel',
  e => {
    e.preventDefault();

    const rect = container.getBoundingClientRect();
    const cx = e.clientX - rect.left - rect.width / 2;
    const cy = e.clientY - rect.top - rect.height / 2;

    const prevScale = scale;
    const factor = e.deltaY > 0 ? 0.9 : 1.1;

    scale = clamp(scale * factor, MIN_SCALE, MAX_SCALE);

    x -= (cx / prevScale) * (scale - prevScale);
    y -= (cy / prevScale) * (scale - prevScale);

    render();
  },
  { passive: false }
);

/* === Drag to pan === */
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

/* === Toolbar actions === */
toolbar.addEventListener('click', e => {
  const action = e.target.dataset.action;
  if (!action) return;

  if (action === 'zoomIn') scale *= 1.2;
  if (action === 'zoomOut') scale /= 1.2;

  if (action === 'reset') {
    scale = 1;
    x = 0;
    y = 0;
  }

  if (action === 'fit') {
    scale = Math.min(
      container.clientWidth / img.naturalWidth,
      container.clientHeight / img.naturalHeight
    );
    x = 0;
    y = 0;
  }

  if (action === 'close') {
    vscode.postMessage({ command: 'close' });
    return;
  }

  scale = clamp(scale, MIN_SCALE, MAX_SCALE);
  render();
});

/* === Refresh image === */
window.addEventListener('message', e => {
  if (e.data.command === 'refresh') {
    img.src = img.src.split('?')[0] + '?t=' + Date.now();
    loader.style.display = 'block';
  }
});

function formatSize(bytes) {
  return bytes < 1024 * 1024
    ? (bytes / 1024).toFixed(1) + ' KB'
    : (bytes / 1024 / 1024).toFixed(1) + ' MB';
}
