import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const directory = path.dirname(fileURLToPath(import.meta.url));
const read = filename => readFile(path.join(directory, filename), 'utf8');
const [client, solar, css, sceneTemplate, sceneCss, officialMark] = await Promise.all([
  read('src/client.js'), read('../sky-clock/solar.js'), read('src/ui.css'),
  read('src/scene.html'), read('src/scene.css'), read('src/deepseek-mark.svg')
]);
const officialPath = officialMark.match(/<path\b[^>]*\/>/)?.[0];
const pathData = officialPath?.match(/\sd="([^"]+)"/)?.[1];
const fillRule = officialPath?.match(/\sfill-rule="(nonzero|evenodd)"/)?.[1];
if (!pathData || !fillRule || !officialMark.includes('viewBox="0 0 50 50"')) {
  throw new Error('The local official DeepSeek mark must contain its complete 50×50 compound path and fill rule.');
}
// Preserve every subpath, including the original cutouts. Scene CSS gives this
// small cloud easter egg its fill/opacity instead of the source's black fill.
if (!sceneTemplate.includes('__DEEPSEEK_CLOUD_PATH__')) throw new Error('The scene has no DeepSeek cloud path seat.');
const scene = sceneTemplate.replace('__DEEPSEEK_CLOUD_PATH__', `<path class="sky-whale" d="${pathData}" fill-rule="${fillRule}"/>`);
const output = client
  .replace('/*__SOLAR_SOURCE__*/', solar)
  .replace('__UI_CSS__', JSON.stringify(css))
  .replace('__SCENE_HTML__', JSON.stringify(scene))
  .replace('__SCENE_CSS__', JSON.stringify(sceneCss));
new vm.Script(output, { filename: 'dsh-sky-window/lib/client.js' });
await mkdir(path.join(directory, 'lib'), { recursive: true });
await writeFile(path.join(directory, 'lib/client.js'), output, 'utf8');
console.log(`Built dsh-sky-window/lib/client.js (${Buffer.byteLength(output)} bytes, no network dependencies)`);
