/**
 * Picker styles.
 *
 * These live inside the shadow root, so nothing here leaks out and — more
 * importantly for this component — nothing from the host page leaks in. The
 * picker sits on top of fifteen wildly different themes and has to stay
 * legible on all of them, which it can't do if a theme's `button {}` rule
 * reaches it.
 *
 * It still borrows the active theme's accent and font so it doesn't feel
 * bolted on; surfaces stay under our control.
 */
export const pickerStyles = /* css */ `
:host {
  --p-surface: #14161c;
  --p-surface-2: #1c1f27;
  --p-text: #f2f4f8;
  --p-text-dim: #a2a9b8;
  --p-border: rgba(255, 255, 255, 0.14);
  --p-accent: var(--pt-color-accent, #6d5efc);
  --p-accent-text: #ffffff;
  --p-shadow: 0 18px 48px rgba(0, 0, 0, 0.45);
  --p-radius: 12px;
  --p-font: var(--pt-type-body, system-ui, -apple-system, "Segoe UI", sans-serif);
  --p-font-display: var(--pt-type-display, var(--p-font));
  --p-z: 2147483000;

  position: fixed;
  z-index: var(--p-z);
  font-family: var(--p-font);
  color: var(--p-text);
  line-height: 1.45;
  -webkit-font-smoothing: antialiased;
}

:host([variant="light"]),
:host([variant="auto"][data-mode="light"]),
:host(:not([variant])[data-mode="light"]) {
  --p-surface: #ffffff;
  --p-surface-2: #f4f5f7;
  --p-text: #14161c;
  --p-text-dim: #5c6470;
  --p-border: rgba(0, 0, 0, 0.12);
  --p-shadow: 0 18px 48px rgba(15, 20, 35, 0.18);
}

:host([position="top-right"])    { top: 1rem; right: 1rem; }
:host([position="top-left"])     { top: 1rem; left: 1rem; }
:host([position="bottom-right"]) { bottom: 1rem; right: 1rem; }
:host([position="bottom-left"])  { bottom: 1rem; left: 1rem; }
:host([position="inline"])       { position: relative; inset: auto; }

:host([hidden]) { display: none; }

button {
  font: inherit;
  color: inherit;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
}

:where(button, input):focus-visible {
  outline: 2px solid var(--p-accent);
  outline-offset: 2px;
}

/* ------------------------------------------------------------------ trigger */

.trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 2.75rem;
  height: 2.75rem;
  background: var(--p-surface);
  border: 1px solid var(--p-border);
  border-radius: var(--p-radius);
  box-shadow: var(--p-shadow);
  transition: transform 160ms cubic-bezier(0.2, 0, 0, 1), background-color 160ms;
}
.trigger:hover { transform: translateY(-1px); }
.trigger:active { transform: translateY(0); }

.bars {
  display: block;
  width: 18px;
  height: 12px;
  position: relative;
}
.bars span {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  border-radius: 2px;
  background: currentColor;
  transition: transform 220ms cubic-bezier(0.2, 0, 0, 1), opacity 140ms;
}
.bars span:nth-child(1) { top: 0; }
.bars span:nth-child(2) { top: 5px; }
.bars span:nth-child(3) { top: 10px; }

:host([open]) .bars span:nth-child(1) { transform: translateY(5px) rotate(45deg); }
:host([open]) .bars span:nth-child(2) { opacity: 0; }
:host([open]) .bars span:nth-child(3) { transform: translateY(-5px) rotate(-45deg); }

.trigger-dot {
  position: absolute;
  right: -2px;
  top: -2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--p-surface);
  background: var(--p-accent);
}

.trigger-wrap { position: relative; }

/* -------------------------------------------------------------------- panel */

.panel {
  position: absolute;
  width: min(22rem, calc(100vw - 2rem));
  max-height: min(32rem, calc(100vh - 6rem));
  display: flex;
  flex-direction: column;
  background: var(--p-surface);
  border: 1px solid var(--p-border);
  border-radius: var(--p-radius);
  box-shadow: var(--p-shadow);
  overflow: hidden;
  opacity: 0;
  transform: scale(0.96) translateY(-4px);
  transform-origin: top right;
  transition: opacity 160ms ease, transform 200ms cubic-bezier(0.2, 0, 0, 1), visibility 0s 200ms;
  visibility: hidden;
}

:host([open]) .panel {
  opacity: 1;
  transform: none;
  visibility: visible;
  transition: opacity 160ms ease, transform 200ms cubic-bezier(0.2, 0, 0, 1), visibility 0s;
}

:host([position^="top"]) .panel    { top: calc(2.75rem + 0.5rem); }
:host([position^="bottom"]) .panel { bottom: calc(2.75rem + 0.5rem); transform-origin: bottom right; }
:host([position$="right"]) .panel  { right: 0; }
:host([position$="left"]) .panel   { left: 0; transform-origin: top left; }
:host([position="inline"]) .panel  { top: calc(2.75rem + 0.5rem); left: 0; }

.panel-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.875rem 1rem 0.625rem;
  border-bottom: 1px solid var(--p-border);
}
.panel-title {
  font-family: var(--p-font-display);
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  margin: 0;
}
.panel-count {
  font-size: 0.72rem;
  color: var(--p-text-dim);
  font-variant-numeric: tabular-nums;
}

.search-wrap { padding: 0.625rem 0.75rem; border-bottom: 1px solid var(--p-border); }
.search {
  width: 100%;
  font: inherit;
  font-size: 0.85rem;
  color: var(--p-text);
  background: var(--p-surface-2);
  border: 1px solid var(--p-border);
  border-radius: calc(var(--p-radius) - 4px);
  padding: 0.45rem 0.6rem;
}
.search::placeholder { color: var(--p-text-dim); }

.list {
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 0.375rem;
  scrollbar-width: thin;
}

/* ---------------------------------------------------------------- accordion */

.cat { border-radius: calc(var(--p-radius) - 4px); }

.cat-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.55rem 0.625rem;
  border-radius: calc(var(--p-radius) - 4px);
  text-align: left;
  font-family: var(--p-font-display);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--p-text-dim);
  transition: background-color 140ms, color 140ms;
}
.cat-toggle:hover { background: var(--p-surface-2); color: var(--p-text); }

.chevron {
  width: 8px;
  height: 8px;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: rotate(-45deg);
  transition: transform 200ms cubic-bezier(0.2, 0, 0, 1);
  flex: none;
}
.cat[data-expanded="true"] .chevron { transform: rotate(45deg); }

.cat-count {
  margin-left: auto;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0;
  opacity: 0.7;
  font-variant-numeric: tabular-nums;
}

.cat-body { display: none; padding: 0.125rem 0 0.375rem; }
.cat[data-expanded="true"] .cat-body { display: block; }

/* ------------------------------------------------------------------ themes */

.theme {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  padding: 0.5rem 0.625rem;
  border-radius: calc(var(--p-radius) - 4px);
  text-align: left;
  transition: background-color 140ms;
}
.theme:hover { background: var(--p-surface-2); }
.theme[aria-current="true"] { background: var(--p-surface-2); }

.swatch {
  width: 1.6rem;
  height: 1.6rem;
  flex: none;
  border-radius: 6px;
  border: 1px solid var(--p-border);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
}

.theme-text { min-width: 0; flex: 1; }
.theme-name {
  display: block;
  font-size: 0.85rem;
  font-weight: 550;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.theme-desc {
  display: block;
  font-size: 0.72rem;
  color: var(--p-text-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.check {
  flex: none;
  width: 1rem;
  height: 1rem;
  opacity: 0;
  color: var(--p-accent);
}
.theme[aria-current="true"] .check { opacity: 1; }

.empty {
  padding: 1.25rem 1rem;
  text-align: center;
  font-size: 0.82rem;
  color: var(--p-text-dim);
}

.panel-foot {
  display: flex;
  gap: 0.375rem;
  padding: 0.5rem 0.625rem;
  border-top: 1px solid var(--p-border);
}
.foot-btn {
  flex: 1;
  padding: 0.4rem 0.5rem;
  font-size: 0.75rem;
  color: var(--p-text-dim);
  background: var(--p-surface-2);
  border: 1px solid var(--p-border);
  border-radius: calc(var(--p-radius) - 5px);
  transition: color 140ms, background-color 140ms;
}
.foot-btn:hover { color: var(--p-text); }

.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
`;
