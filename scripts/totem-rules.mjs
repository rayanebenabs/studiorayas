// Dessine les règles du totem (le texte qui défile sur le service Brand OS) en une image : public/totem-rules.png.
// Elles s'écrivent à l'encre dans les deux modes (en sombre, le totem est posé sur un ovale craie).
// Une image glisse sans effort dans le totem, là où des milliers de lettres faisaient saccader Safari.
//
// À relancer si le texte des règles change :
//   npm i --no-save playwright && node scripts/totem-rules.mjs
// (Python et Pillow compriment l'image en 16 niveaux d'opacité de l'encre : environ 15 Ko au lieu de 900.)
//
// Géométrie, en unités du viewBox du totem (9 000 de large) : 72 lignes de 250, police 190, 110 de marge
// en haut, une ligne sur deux décalée de 1 200 vers la gauche. Hauteur totale : 110 + 72 x 250 = 18 110.

import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { tokens } from "../brand/build/tokens.js";

const RULES =
  "couleur.fond = craie · accent = terre, un par écran · rayon = 0 · ombre = aucune · dégradé = aucun · titre = Cormorant 300 · texte = Archivo · adresse = vous · ";
// Les couleurs de la marque, en clair : une image ne lit pas les variables CSS.
const VERSIONS = [
  { file: "totem-rules.png", ink: tokens.light.color.palette.encre },
];
const BODY = tokens.light.font.family.body; // la police de texte de la marque
const WIDTH = 1080; // px : net jusqu'à un totem de 600 px de haut sur écran Retina
const U = WIDTH / 9000;
const LINES = 72;
const HEIGHT = Math.round((110 + LINES * 250) * U);

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const font = readFileSync(path.join(root, "node_modules/@fontsource/archivo/files/archivo-latin-400-normal.woff2")).toString("base64");
const html = `<!doctype html><meta charset="utf-8"><style>
html, body { margin: 0; background: transparent; }
#r { width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; padding-top: ${110 * U}px; box-sizing: border-box;
  font: 400 ${190 * U}px/${250 * U}px ${BODY}; white-space: nowrap; }
#r p { margin: 0; }
#r p:nth-child(even) { margin-left: ${-1200 * U}px; }
</style><div id="r">${Array.from({ length: LINES }, () => `<p>${RULES.repeat(2)}</p>`).join("")}</div>`;

const { chromium } = createRequire(path.join(process.cwd(), "/"))("playwright");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
await page.setContent(html);
// La police de texte, chargée depuis @fontsource avant de dessiner.
await page.evaluate(
  async ([name, data]) => {
    const face = new FontFace(name, `url(data:font/woff2;base64,${data})`);
    document.fonts.add(await face.load());
  },
  [BODY.split(",")[0].replace(/'/g, ""), font],
);
for (const v of VERSIONS) {
  const out = path.join(root, "public", v.file);
  await page.evaluate((ink) => (document.getElementById("r").style.color = ink), v.ink);
  await page.locator("#r").screenshot({ path: out, omitBackground: true });
  // Une seule couleur : seule l'opacité varie. 16 niveaux suffisent à l'œil.
  const squeeze = `
from PIL import Image
im = Image.open(${JSON.stringify(out)}); lv = 16
pal = Image.new("P", im.size); pal.putdata([round(v * (lv - 1) / 255) for v in im.getchannel("A").getdata()])
pal.putpalette(list(bytes.fromhex(${JSON.stringify(v.ink.slice(1))})) * lv)
pal.save(${JSON.stringify(out)}, optimize=True, transparency=bytes(round(i * 255 / (lv - 1)) for i in range(lv)))
`;
  const py = spawnSync("python3", ["-c", squeeze], { stdio: "inherit" });
  console.log(`public/${v.file} · ${WIDTH} x ${HEIGHT}${py.status === 0 ? " · compressée" : " · non compressée (Python et Pillow requis)"}`);
}
await browser.close();
