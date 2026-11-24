// Render the pack's real component construction without inheriting the active
// page's flourish. Stylesheets are cached and shared by all preview roots.
function renderThemePreview(host, theme) {
  const root = host.attachShadow({ mode: 'open' });
  for (const href of [
    '/packages/core/preset.css',
    '/packages/themes-pack-classic/styles/flourishes.css',
    '/packages/themes-pack-seasonal/styles/flourishes.css',
  ]) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    root.append(link);
  }
  const style = document.createElement('style');
  style.textContent = `
    :host { display: block; contain: layout paint; pointer-events: none; }
    .scene { min-height: 350px; padding: 24px; overflow: hidden;
      background: var(--pt-color-bg); color: var(--pt-color-text);
      font: 14px/1.5 var(--pt-type-body);
      --pt-space: .7rem;
      --pt-transition: var(--pt-motion-duration) var(--pt-motion-ease); }
    .scene::before, .scene::after { position: absolute; }
    .pt-nav { margin-bottom: 24px; font-size: 10px; }
    .preview-title { font-size: 28px; margin-bottom: 12px; }
    .preview-body { font-size: 12px; margin-bottom: 18px; }
    .pt-card { min-width: 0; }
    .pt-card h3 { font-size: 18px; }
    .pt-card p { font-size: 12px; color: var(--pt-color-text-dim); }
    .pt-btn { display: inline-block; font-size: 11px; }
    .sample-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .sample-grid > :only-child { grid-column: 1 / -1; }
  `;
  root.append(style);
  const scene = document.createElement('div');
  scene.className = 'scene';
  scene.dataset.flourish = theme.flourish || '';
  scene.setAttribute('data-pt-construct', '');
  scene.style.colorScheme = Themeloom.inferMode(theme);
  Object.entries(Themeloom.tokensToCssVars(theme)).forEach(([key, value]) => scene.style.setProperty(key, value));
  scene.innerHTML = `<div class="pt-nav"><span class="pt-brand">STUDIO / 026</span><span>Explore ↗</span></div>
    <h2 class="preview-title"></h2><p class="preview-body"></p>
    <div class="sample-grid"><div class="pt-card"><h3>Make it yours.</h3><p>A space for your next idea.</p><span class="pt-btn">Discover ↗</span></div></div>`;
  scene.querySelector('.preview-title').textContent = theme.name;
  scene.querySelector('.preview-body').textContent = theme.description;
  if (theme.id === 'bento') {
    const tile = document.createElement('div');
    tile.className = 'pt-card';
    tile.innerHTML = '<h3>02</h3><p>Built to fit.</p>';
    scene.querySelector('.sample-grid').append(tile);
  }
  root.append(scene);
}
