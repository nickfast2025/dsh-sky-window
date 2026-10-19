'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const vm = require('node:vm');

const packageRoot = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
const packageFile = relative => path.resolve(packageRoot, relative);
const exportPath = entry => typeof entry === 'string' ? entry : entry?.default;

test('profile bundle inserts the installed sky-window plugin', () => {
  const patchPath = manifest.dsh?.bundle?.patch;
  assert.equal(typeof patchPath, 'string', 'the profile launcher requires dsh.bundle.patch');
  assert.ok(fs.statSync(packageFile(patchPath)).isFile(), 'the declared bundle patch must ship');
  const patch = fs.readFileSync(packageFile(patchPath), 'utf8');
  assert.match(patch, /^-\s+insert:\s*$/m);
  assert.match(patch, /^\s+-\s+id:\s*['"]?sky-window['"]?\s*$/m);
  assert.match(patch, /^\s+name:\s*['"]?dsh-sky-window['"]?\s*$/m);
});

test('manifest exposes a web client and the services it depends on', () => {
  assert.equal(manifest.name, 'dsh-sky-window');
  assert.equal(manifest.dsh?.client?.platform, 'web');
  assert.equal(manifest.dsh.client.immediately, true);
  for (const provider of [
    '@deepseek-ai/dsh-client-runtime',
    '@deepseek-ai/dsh-client-ui-theme',
    '@deepseek-ai/dsh-client-ui-layout',
    '@deepseek-ai/dsh-client-ui-settings'
  ]) {
    assert.ok(manifest.dsh.client.inject?.includes(provider), `missing client provider: ${provider}`);
  }
  const clientPath = exportPath(manifest.exports?.['./client']);
  assert.equal(typeof clientPath, 'string', 'the host discovers the bundle through exports["./client"]');
  assert.ok(fs.statSync(packageFile(clientPath)).isFile(), 'run npm run build before the installation gates');
});

test('host package entry imports without browser globals', async () => {
  const hostPath = exportPath(manifest.exports?.['.']);
  assert.equal(typeof hostPath, 'string');
  assert.equal(packageFile(manifest.main), packageFile(hostPath));
  const host = await import(pathToFileURL(packageFile(hostPath)).href);
  assert.equal(typeof host.apply, 'function');
});

test('built client materializes through the installed DSH module-loader contract', () => {
  const clientPath = packageFile(exportPath(manifest.exports['./client']));
  const source = fs.readFileSync(clientPath, 'utf8');
  assert.doesNotMatch(source, /__[A-Z][A-Z0-9_]*__/, 'an embedded build placeholder was not replaced');

  const registrations = [];
  const context = vm.createContext({
    window: { __ModuleLoader__: { load: registration => registrations.push(registration) } }
  });
  new vm.Script(source, { filename: clientPath }).runInContext(context, { timeout: 1000 });
  assert.equal(registrations.length, 1, 'a bundle must register exactly one lazy factory');
  const registration = registrations[0];
  assert.equal(registration.id, manifest.name);
  assert.equal(typeof registration.factory, 'function');

  const requested = [];
  const react = Object.freeze({
    createElement() { throw new Error('factory materialization must not render UI'); }
  });
  context.materialize = () => registration.factory(specifier => {
    requested.push(specifier);
    assert.equal(specifier, 'react', `unexpected runtime dependency: ${specifier}`);
    return react;
  });
  const client = vm.runInContext('materialize()', context, { timeout: 1000 });
  assert.ok(requested.includes('react'));
  assert.equal(typeof client.apply, 'function');
  assert.ok(Array.isArray(client.inject));
  for (const service of ['theme', 'slots']) {
    assert.ok(client.inject.includes(service), `missing client service: ${service}`);
  }
});

test('small DeepSeek cloud preserves the complete official contour and cutouts without raster assets', () => {
  const official = fs.readFileSync(packageFile('src/deepseek-mark.svg'), 'utf8');
  const output = fs.readFileSync(packageFile('lib/client.js'), 'utf8');
  const scene = JSON.parse(output.match(/const SCENE_HTML = (".*");/)[1]);
  const whale = scene.match(/<path\b[^>]*class="sky-whale"[^>]*\/>/)?.[0];
  assert.ok(whale, 'the cloud uses the official vector path');
  const officialPath = official.match(/<path\b[^>]*\/>/)[0];
  const expectedData = officialPath.match(/\sd="([^"]+)"/)[1];
  const actualData = whale.match(/\sd="([^"]+)"/)[1];
  assert.equal(actualData, expectedData, 'all original contour and cutout geometry stays intact');
  assert.ok((actualData.match(/M/gi) || []).length > 1, 'compound path retains the belly and face cutouts');
  assert.equal(whale.match(/\sfill-rule="([^"]+)"/)[1], officialPath.match(/\sfill-rule="([^"]+)"/)[1]);
  assert.doesNotMatch(whale, /\sfill=|\sstyle=/, 'cloud palette is controlled by scene CSS');
  assert.doesNotMatch(scene, /<img\b|data:image\/|whale-eye|whale-fin|__DEEPSEEK_CLOUD_PATH__/);
});
