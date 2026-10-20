import { readFile, writeFile } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';

const SOURCE = 'assets/icon.svg';
const SIZES = [16, 32, 48, 96, 128];

const svg = await readFile(SOURCE);

for (const size of SIZES) {
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
  const out = `public/icon/${size}.png`;
  await writeFile(out, png);
  console.log(`${out} (${size}×${size})`);
}
