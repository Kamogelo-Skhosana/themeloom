/**
 * A DOM small enough to read in one sitting, and just big enough for the engine.
 *
 * The engine touches a handful of DOM APIs — one attribute write, one <style>,
 * some <link>s and localStorage. Pulling in jsdom to cover that would add a
 * heavier dependency than the library it tests.
 */

class Style {
  #props = new Map();
  setProperty(name, value) {
    this.#props.set(name, String(value));
  }
  removeProperty(name) {
    this.#props.delete(name);
  }
  getPropertyValue(name) {
    return this.#props.get(name) ?? '';
  }
  get size() {
    return this.#props.size;
  }
}

class El {
  constructor(tag) {
    this.tagName = tag.toUpperCase();
    this.childNodes = [];
    this.attributes = new Map();
    this.style = new Style();
    this.isConnected = false;
    this.parentNode = null;
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }
  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }
  removeAttribute(name) {
    this.attributes.delete(name);
  }
  hasAttribute(name) {
    return this.attributes.has(name);
  }

  get id() {
    return this.getAttribute('id') ?? '';
  }
  set id(value) {
    this.setAttribute('id', value);
  }
  get rel() {
    return this.getAttribute('rel') ?? '';
  }
  set rel(value) {
    this.setAttribute('rel', value);
  }
  get href() {
    return this.getAttribute('href') ?? '';
  }
  set href(value) {
    this.setAttribute('href', value);
  }
  set crossOrigin(value) {
    this.setAttribute('crossorigin', String(value));
  }

  appendChild(node) {
    this.childNodes.push(node);
    node.parentNode = this;
    node.isConnected = true;
    return node;
  }

  insertBefore(node, reference) {
    const index = reference ? this.childNodes.indexOf(reference) : 0;
    this.childNodes.splice(index < 0 ? 0 : index, 0, node);
    node.parentNode = this;
    node.isConnected = true;
    return node;
  }

  remove() {
    if (!this.parentNode) return;
    const index = this.parentNode.childNodes.indexOf(this);
    if (index >= 0) this.parentNode.childNodes.splice(index, 1);
    this.parentNode = null;
    this.isConnected = false;
  }

  get firstChild() {
    return this.childNodes[0] ?? null;
  }

  get textContent() {
    return this.childNodes.map((n) => n.textContent ?? n.nodeValue ?? '').join('');
  }

  /** Supports `tag#id` and `tag[attr="value"]` — all the engine asks for. */
  querySelector(selector) {
    const walk = (node) => {
      for (const child of node.childNodes ?? []) {
        if (child.tagName && matches(child, selector)) return child;
        const nested = walk(child);
        if (nested) return nested;
      }
      return null;
    };
    return walk(this);
  }
}

function matches(el, selector) {
  const withId = /^([a-z]+)#([\w-]+)$/i.exec(selector);
  if (withId) return el.tagName === withId[1].toUpperCase() && el.id === withId[2];

  const withAttr = /^([a-z]*)\[([\w-]+)="(.*)"\]$/i.exec(selector);
  if (withAttr) {
    const [, tag, attr, value] = withAttr;
    if (tag && el.tagName !== tag.toUpperCase()) return false;
    return el.getAttribute(attr) === value.replace(/\\(["\\])/g, '$1');
  }

  return el.tagName === selector.toUpperCase();
}

class TextNode {
  constructor(value) {
    this.nodeValue = String(value);
  }
  get textContent() {
    return this.nodeValue;
  }
}

function createStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => void map.set(k, String(v)),
    removeItem: (k) => void map.delete(k),
    clear: () => map.clear(),
    get length() {
      return map.size;
    },
  };
}

/** Installs the stub on globalThis and returns a handle plus a teardown. */
export function installDom({ reducedMotion = false } = {}) {
  const documentTarget = new EventTarget();
  const document = Object.assign(documentTarget, {
    documentElement: new El('html'),
    head: new El('head'),
    body: new El('body'),
    createElement: (tag) => new El(tag),
    createTextNode: (value) => new TextNode(value),
  });
  document.documentElement.isConnected = true;
  document.head.isConnected = true;
  document.body.isConnected = true;

  const motionListeners = new Set();
  const windowTarget = new EventTarget();
  const window = Object.assign(windowTarget, {
    document,
    localStorage: createStorage(),
    sessionStorage: createStorage(),
    matchMedia: (query) => ({
      media: query,
      matches: query.includes('reduced-motion') ? reducedMotion : false,
      addEventListener: (_type, fn) => void motionListeners.add(fn),
      removeEventListener: (_type, fn) => void motionListeners.delete(fn),
    }),
  });

  const previous = {
    document: globalThis.document,
    window: globalThis.window,
    localStorage: globalThis.localStorage,
  };

  globalThis.document = document;
  globalThis.window = window;
  globalThis.localStorage = window.localStorage;

  return {
    document,
    window,
    /** Simulates the same key changing in another tab. */
    fireStorage(key, newValue) {
      const event = new Event('storage');
      event.key = key;
      event.newValue = newValue;
      window.dispatchEvent(event);
    },
    /** All CSS text the engine has injected so far. */
    injectedCss() {
      return document.head.querySelector('style#themeloom-vars')?.textContent ?? '';
    },
    fontLinks() {
      return document.head.childNodes.filter((n) => n.tagName === 'LINK' && n.rel === 'stylesheet');
    },
    restore() {
      globalThis.document = previous.document;
      globalThis.window = previous.window;
      globalThis.localStorage = previous.localStorage;
    },
  };
}
