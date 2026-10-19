'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// A deliberately small DOM: real IDs, hierarchy, attributes and labels come
// from index.html. Unsupported selectors and HTML parsing fail explicitly.
function boot(now = '2026-10-17T04:00:00Z', preferences = null) {
  const ids = new Map();
  const missing = [];
  let document;
  class Node {
    constructor(tag, text = '') {
      this.tagName = tag.toUpperCase(); this.children = []; this.parentNode = null;
      this.attributes = {}; this.dataset = {}; this.listeners = new Map(); this._text = text;
      this.className = ''; this.value = ''; this.hidden = false; this.inert = false;
      this.disabled = false; this.checked = false; this.open = false;
      this.scrollHeight = 80; this.scrollTop = 0;
      this.style = { setProperty(key, value) { this[key] = String(value); }, getPropertyValue(key) { return this[key] || ''; } };
      this.classList = {
        contains: name => this.className.split(/\s+/).includes(name),
        add: (...names) => { this.className = [...new Set([...this.className.split(/\s+/).filter(Boolean), ...names])].join(' '); },
        remove: (...names) => { this.className = this.className.split(/\s+/).filter(name => !names.includes(name)).join(' '); },
        toggle: (name, force) => {
          const enabled = force === undefined ? !this.classList.contains(name) : force;
          this.classList[enabled ? 'add' : 'remove'](name); return enabled;
        }
      };
    }
    get textContent() { return this._text + this.children.map(child => child.textContent).join(''); }
    set textContent(value) { this._text = String(value); this.children = []; }
    set innerHTML(_) { throw new Error('Unexpected innerHTML: user input must stay text'); }
    get isConnected() { return true; }
    append(...nodes) { nodes.forEach(node => { node.parentNode = this; this.children.push(node); }); }
    replaceChildren(...nodes) { this.children = []; this._text = ''; this.append(...nodes); }
    setAttribute(name, value) {
      this.attributes[name] = String(value);
      if (name === 'id') { this.id = value; ids.set(value, this); }
      if (name === 'class') this.className = value;
      if (name === 'value') this.value = value;
      if (['hidden', 'disabled', 'checked', 'inert'].includes(name)) this[name] = true;
      if (name.startsWith('data-')) this.dataset[name.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = value;
    }
    getAttribute(name) { return this.attributes[name] ?? null; }
    addEventListener(type, listener) {
      if (!this.listeners.has(type)) this.listeners.set(type, []);
      this.listeners.get(type).push(listener);
    }
    emit(type, properties = {}) {
      const event = { type, target: this, preventDefault() { this.defaultPrevented = true; }, ...properties };
      for (const listener of this.listeners.get(type) || []) listener(event);
      return event;
    }
    matches(selector) {
      if (/^\.[\w-]+$/.test(selector)) return this.classList.contains(selector.slice(1));
      if (/^[a-z]+$/.test(selector)) return this.tagName === selector.toUpperCase();
      const attribute = selector.match(/^\[([\w-]+)(?:="([^"]*)")?\]$/);
      if (attribute) return attribute[2] === undefined ? Object.hasOwn(this.attributes, attribute[1]) : this.attributes[attribute[1]] === attribute[2];
      throw new Error(`Unsupported test selector: ${selector}`);
    }
    querySelectorAll(selector) {
      const found = [];
      for (const child of this.children) {
        if (child.matches(selector)) found.push(child);
        found.push(...child.querySelectorAll(selector));
      }
      return found;
    }
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
    focus() { document.activeElement = this; }
    showModal() { this.open = true; }
    close() { this.open = false; }
    getBoundingClientRect() { return { left: 0, right: 500, top: 0, bottom: 700 }; }
  }
  document = new Node('document'); document.hidden = false;
  document.createElement = tag => new Node(tag);
  document.createTextNode = text => new Node('#text', String(text));
  document.getElementById = id => {
    if (!ids.has(id)) { missing.push(id); throw new Error(`Missing real index.html ID: ${id}`); }
    return ids.get(id);
  };
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const voidTags = new Set(['meta', 'link', 'input', 'br', 'hr', 'img', 'source', 'area', 'base', 'embed', 'param', 'wbr']);
  const stack = [document];
  for (const token of html.matchAll(/<\/?([a-zA-Z][\w:-]*)\b([^>]*?)\/?>|([^<]+)/g)) {
    if (!token[1]) {
      if (token[3].trim()) stack.at(-1).append(document.createTextNode(token[3]));
      continue;
    }
    const tag = token[1].toLowerCase();
    if (token[0].startsWith('</')) {
      const index = stack.findLastIndex(node => node.tagName === tag.toUpperCase());
      if (index > 0) stack.length = index;
      continue;
    }
    const node = new Node(tag);
    for (const attribute of token[2].matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s]+)))?/g)) {
      node.setAttribute(attribute[1], attribute[2] ?? attribute[3] ?? attribute[4] ?? '');
    }
    stack.at(-1).append(node);
    if (!voidTags.has(tag) && !token[0].endsWith('/>')) stack.push(node);
  }
  document.documentElement = document.querySelector('html');
  const storage = new Map(preferences ? [['sky-window.preferences.v2', JSON.stringify(preferences)]] : []);
  let frameId = 0; let elapsed = 0;
  const frames = new Map();
  const fixedTime = new Date(now).getTime();
  class FixedDate extends Date {
    constructor(...args) { super(...(args.length ? args : [fixedTime])); }
    static now() { return fixedTime; }
  }
  const context = vm.createContext({
    document, Date: FixedDate, Intl, console, navigator: {},
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, String(value)) },
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    performance: { now: () => elapsed },
    requestAnimationFrame: callback => { frames.set(++frameId, callback); return frameId; },
    cancelAnimationFrame: id => frames.delete(id),
    setTimeout: () => 1, clearTimeout() {}, setInterval: () => 1
  });
  for (const filename of ['solar.js', 'app.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, filename), 'utf8'), context, { filename });
  return {
    document, context, missing, frames, $: id => document.getElementById(id),
    click: id => document.getElementById(id).emit('click'),
    input(id, value, type = 'input') { const node = document.getElementById(id); node.value = value; node.emit(type); },
    preset(name) { document.querySelectorAll('[data-moment]').find(node => node.dataset.moment === name).emit('click'); },
    frame(time) { elapsed = time; const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback(time)); }
  };
}

test('real index IDs and solar integration load; each city shows its local date/time', () => {
  const app = boot();
  assert.deepEqual(app.missing, []);
  assert.equal(app.$('headerCity').textContent, '上海');
  assert.equal(app.$('headerTime').textContent, '12:00');
  assert.equal(app.$('previewDate').value, '2026-10-17');
  assert.equal(app.$('previewBanner').hidden, true);
  app.input('citySelect', 'newyork', 'change');
  assert.equal(app.$('headerCity').textContent, '纽约');
  assert.equal(app.$('headerTime').textContent, '00:00');
  app.input('citySelect', 'sydney', 'change');
  assert.equal(app.$('headerTime').textContent, '15:00');
  const acrossDate = boot('2026-10-17T20:00:00Z');
  assert.equal(acrossDate.$('previewDate').value, '2026-10-18');
  acrossDate.input('citySelect', 'newyork', 'change');
  assert.equal(acrossDate.$('previewDate').value, '2026-10-17');
  assert.equal(acrossDate.$('headerTime').textContent, '16:00');
});

test('sunrise, sunset and night previews change the scene; live restores local now', () => {
  const app = boot();
  for (const [preset, card, phase] of [['sunrise', 'sunriseCard', '晨光'], ['sunset', 'sunsetCard', '晚霞']]) {
    app.preset(preset);
    assert.equal(app.$('headerTime').textContent, app.$(card).textContent);
    assert.match(app.$('phaseLabel').textContent, new RegExp(phase));
    assert.equal(app.$('previewBanner').hidden, false);
  }
  app.preset('night');
  assert.equal(app.$('headerTime').textContent, '22:00');
  assert.equal(app.document.documentElement.style['--moon-visibility'], '1.0000');
  assert.equal(app.$('moonPosition').getAttribute('tabindex'), '0');
  app.click('restoreLive');
  assert.equal(app.$('headerTime').textContent, '12:00');
  assert.equal(app.$('previewBanner').hidden, true);
  assert.equal(app.document.documentElement.classList.contains('is-previewing'), false);
});

test('sample conversation works and arbitrary HTML input is retained as text', () => {
  const app = boot();
  app.click('sampleConversation');
  assert.equal(app.$('thread').children.length, 2);
  assert.match(app.$('thread').textContent, /晨间/);
  app.click('sampleCode');
  assert.equal(app.$('thread').children.length, 4);
  assert.equal(app.$('thread').querySelectorAll('code').length, 1);
  const literal = '<img src=x onerror="globalThis.pwned=true"><script>globalThis.pwned=true</script>';
  app.input('messageInput', literal);
  assert.equal(app.$('sendButton').disabled, false);
  app.$('chatForm').emit('submit');
  const userMessage = app.$('thread').children[4];
  assert.equal(userMessage.querySelector('.message-content').textContent, literal);
  assert.equal(userMessage.querySelectorAll('img').length, 0);
  assert.equal(userMessage.querySelectorAll('script').length, 0);
  assert.equal(app.context.pwned, undefined);
  assert.equal(app.$('messageInput').value, '');
  assert.equal(app.$('sendButton').disabled, true);
});

test('look-up mode makes the workspace inert, then restores work and focus', () => {
  const app = boot();
  const workspace = app.document.querySelector('.workspace');
  app.click('lookUpButton');
  assert.equal(workspace.inert, true);
  assert.equal(app.$('lookUpUi').inert, false);
  assert.equal(app.document.activeElement, app.$('returnToWork'));
  app.click('returnToWork');
  assert.equal(workspace.inert, false);
  assert.equal(app.$('lookUpUi').inert, true);
  assert.equal(app.document.activeElement, app.$('lookUpButton'));
});

test('day playback pauses consistently from the banner, settings and celestial exit', () => {
  const app = boot();
  let elapsed = 0;
  for (const exit of ['pausePlayback', 'openSettings', 'sunPosition']) {
    app.click('playDay');
    assert.equal(app.document.documentElement.classList.contains('is-playing'), true);
    assert.equal(app.$('pausePlayback').hidden, false);
    app.frame(elapsed += 6000);
    assert.notEqual(app.$('headerTime').textContent, '00:00');
    app.click(exit);
    assert.equal(app.frames.size, 0, `${exit}: no future playback frame`);
    assert.equal(app.document.documentElement.classList.contains('is-playing'), false);
    assert.equal(app.$('pausePlayback').hidden, true);
    assert.match(app.$('previewText').textContent, /^时间预览/);
    assert.equal(app.$('playDay').querySelector('span').textContent, '看一天');
    if (app.$('settingsDialog').open) app.click('closeSettings');
    app.click('returnToWork');
  }
  app.click('playDay');
  app.frame(elapsed + 24000);
  assert.equal(app.frames.size, 0);
  assert.equal(app.$('headerTime').textContent, '23:59');
  assert.equal(app.$('pausePlayback').hidden, true);
});

test('New York missing DST time is normalized everywhere to 03:30', () => {
  const app = boot();
  app.input('citySelect', 'newyork', 'change');
  app.input('previewDate', '2026-03-08', 'change');
  app.input('timeSlider', '150');
  assert.equal(app.$('headerTime').textContent, '03:30');
  assert.equal(app.$('previewTimeValue').textContent, '03:30');
  assert.equal(Number(app.$('timeSlider').value), 210);
  assert.match(app.$('previewText').textContent, /03:30/);
  assert.equal(app.$('previewDate').value, '2026-03-08');
});

test('24-hour working surfaces and sidebar keep text contrast at least 4.5', () => {
  const app = boot();
  const parse = value => value.match(/[\d.]+/g).slice(0, 3).map(Number);
  const luminance = color => color.map(value => { const x = value / 255; return x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4; })
    .reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
  const contrast = (a, b) => { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  for (let minute = 0; minute < 1440; minute += 10) {
    app.input('timeSlider', String(minute));
    const style = app.document.documentElement.style;
    for (const ink of ['--ink', '--secondary', '--muted']) {
      for (const surface of ['--panel-solid', '--sidebar']) {
        const ratio = contrast(parse(style[ink]), parse(style[surface]));
        assert.ok(ratio >= 4.5, `${minute}m ${ink} on ${surface}: ${ratio.toFixed(3)}`);
      }
    }
  }
});

test('Beijing 06:14 dawn keeps warm ivory work surfaces; full night stays navy', () => {
  const app = boot('2026-10-16T22:14:00Z');
  app.input('citySelect', 'beijing', 'change');
  assert.equal(app.$('headerTime').textContent, '06:14');
  assert.equal(app.$('sunriseCard').textContent, '06:26');
  const parse = value => value.match(/[\d.]+/g).slice(0, 3).map(Number);
  const style = app.document.documentElement.style;
  const panel = parse(style['--panel-solid']);
  const sidebar = parse(style['--sidebar']);
  assert.ok(panel[0] >= 245 && panel[1] >= 240 && panel[2] >= 230, 'dawn panel is ivory');
  assert.ok(sidebar.every(channel => channel >= 220), 'dawn sidebar is light');
  assert.equal(style.colorScheme, 'light');
  app.preset('night');
  assert.equal(style.colorScheme, 'dark');
  const darkPanel = parse(style['--panel-solid']);
  assert.ok(darkPanel[2] > darkPanel[0] && darkPanel.every(channel => channel < 80), 'night panel is deep navy');
});
