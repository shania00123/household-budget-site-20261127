// KitchenTable Budget hand-in program (Node 22, standard library only).
// The site lives in app/ as plain static files; this program copies app/ and
// screenshots/ next to itself into the output directory and writes
// dossier.json with the vendored make.fun library, byte for byte as the
// scorer rebuilds it. Outside the grader, MAKEFUN_OUTPUT_DIR replaces /output.
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const root = fileURLToPath(new URL('.', import.meta.url));
const target = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(target, { recursive: true });
cpSync(join(root, 'app'), join(target, 'app'), { recursive: true });
mkdirSync(join(target, 'screenshots'), { recursive: true });
if (existsSync(join(root, 'screenshots'))) {
  cpSync(join(root, 'screenshots'), join(target, 'screenshots'), { recursive: true });
}

const dossier = buildDossier(target, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(target, 'dossier.json'), dossier);
