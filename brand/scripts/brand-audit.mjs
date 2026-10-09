#!/usr/bin/env node
// brand-audit.mjs : inventaire et audit de conformité au système de marque
// Zéro dépendance. Node >= 18.
//
// Usage :
//   node brand-audit.mjs --inventory [dossier]          état des lieux avant /brand-init
//   node brand-audit.mjs [dossier] [--tokens brand/tokens.json] [--json] [--strict]
//
// --inventory : stack détectée, couleurs et polices les plus utilisées, variables CSS existantes
// sinon      : liste les écarts au système (couleurs en dur, polices hors tokens,
//              palette Tailwind par défaut, valeurs arbitraires), avec le token le plus proche

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const opt = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
const positional = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--tokens");
const rootDir = path.resolve(positional[0] || ".");
const inventory = flag("--inventory");
const asJson = flag("--json");

const IGNORE_DIRS = new Set(["node_modules", ".git", "dist", "build", ".next", ".nuxt", ".output", ".svelte-kit", ".astro", "out", "coverage", "vendor", ".turbo", ".vercel", ".cache", "public/build"]);
const EXT = new Set([".css", ".scss", ".sass", ".less", ".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs", ".vue", ".svelte", ".astro", ".html", ".mdx"]);
const TEXT_EXT = new Set([".md", ".mdx", ".html", ".jsx", ".tsx", ".vue", ".svelte", ".astro", ".json"]);

function* walk(dir) {
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    const rel = path.relative(rootDir, p);
    if (e.isDirectory()) {
      if (IGNORE_DIRS.has(e.name) || e.name.startsWith(".") || rel === path.join("brand", "build") || rel === path.join("brand", "scripts")) continue;
      yield* walk(p);
    } else if (e.isFile()) {
      if (rel === path.join("brand", "preview.html")) continue;
      yield p;
    }
  }
}

// ---------- Couleurs ----------
function parseColor(s) {
  s = s.trim().toLowerCase();
  let m = s.match(/^#([0-9a-f]{3,8})$/);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = h.split("").map((c) => c + c).join("");
    if (h.length !== 6 && h.length !== 8) return null;
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
  }
  m = s.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/);
  if (m) return { r: +m[1], g: +m[2], b: +m[3] };
  m = s.match(/^hsla?\(\s*([\d.]+)(?:deg)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%/);
  if (m) {
    const h = +m[1] / 360, sat = +m[2] / 100, l = +m[3] / 100;
    const f = (n) => { const k = (n + h * 12) % 12; const a = sat * Math.min(l, 1 - l); return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))); };
    return { r: f(0), g: f(8), b: f(4) };
  }
  return null;
}
const hex = ({ r, g, b }) => "#" + [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, "0")).join("");
const dist = (a, b) => Math.sqrt(2 * (a.r - b.r) ** 2 + 4 * (a.g - b.g) ** 2 + 3 * (a.b - b.b) ** 2) / 3;

const RE = {
  hex: /(?<![\w&/])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g,
  fn: /\b(?:rgba?|hsla?)\(\s*[\d.]+(?:deg)?[\s,]+[\d.]+%?[\s,]+[\d.]+%?[^)]*\)/g,
  fontFamily: /font-family\s*:\s*([^;}{\n]+)|fontFamily\s*:\s*(?:(['"`])(.*?)\2|(\[[^\]]+\]))/g,
  twPalette: /\b(?:bg|text|border|ring|fill|stroke|from|via|to|outline|divide|placeholder|decoration|shadow|accent|caret)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|[1-9]00|950)\b/g,
  twArbitrary: /\b-?(?:p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|gap-x|gap-y|space-x|space-y|w|h|min-w|max-w|min-h|top|left|right|bottom|inset|rounded|text|leading|tracking)-\[[\d.]+(?:px|rem|em)\]/g,
  cssVarDecl: /(--[\w-]+)\s*:\s*([^;}{]+);/g,
};

// ---------- Stack ----------
function detectStack() {
  const s = { packageManager: null, frameworks: [], styling: [], typescript: false, tailwind: null, files: [] };
  const pj = path.join(rootDir, "package.json");
  if (fs.existsSync(pj)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pj, "utf8"));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      const has = (d) => Object.prototype.hasOwnProperty.call(deps, d);
      [["next", "Next.js"], ["react", "React"], ["nuxt", "Nuxt"], ["vue", "Vue"], ["@sveltejs/kit", "SvelteKit"], ["svelte", "Svelte"], ["astro", "Astro"], ["solid-js", "Solid"], ["@angular/core", "Angular"], ["react-native", "React Native"], ["expo", "Expo"]].forEach(([d, n]) => has(d) && s.frameworks.push(n));
      if (has("tailwindcss")) s.tailwind = String(deps.tailwindcss).replace(/[^\d.]/g, "").split(".")[0] || "?";
      [["styled-components", "styled-components"], ["@emotion/react", "Emotion"], ["sass", "Sass"], ["@vanilla-extract/css", "vanilla-extract"], ["@radix-ui/themes", "Radix Themes"], ["@mui/material", "MUI"], ["@chakra-ui/react", "Chakra"], ["class-variance-authority", "cva"]].forEach(([d, n]) => has(d) && s.styling.push(n));
      if (Object.keys(deps).some((d) => d.startsWith("@radix-ui/react-"))) s.styling.push("Radix primitives");
      s.typescript = has("typescript");
    } catch {}
  }
  for (const f of ["pnpm-lock.yaml", "yarn.lock", "bun.lockb", "bun.lock", "package-lock.json"]) if (fs.existsSync(path.join(rootDir, f))) { s.packageManager = f.split(/[-.]/)[0].replace("package", "npm"); break; }
  for (const f of ["tailwind.config.js", "tailwind.config.ts", "tailwind.config.cjs", "tailwind.config.mjs", "components.json", "CLAUDE.md", "README.md", "brand/tokens.json", "brand/BRAND.md"]) if (fs.existsSync(path.join(rootDir, f))) s.files.push(f);
  if (fs.existsSync(path.join(rootDir, "components.json"))) s.styling.push("shadcn/ui");
  if (!s.frameworks.length && !fs.existsSync(pj)) s.frameworks.push("aucun package.json (HTML statique ou autre langage)");
  return s;
}

// ---------- Tokens ----------
function loadTokens() {
  const tp = path.resolve(rootDir, opt("--tokens") || "brand/tokens.json");
  const rp = path.join(path.dirname(tp), "build", "tokens.resolved.json");
  if (!fs.existsSync(rp)) return null;
  const res = JSON.parse(fs.readFileSync(rp, "utf8"));
  const prefix = res.meta?.prefix || "brand";
  const colors = [], fonts = [];
  const DROP = new Set(["palette", "semantic", "family"]);
  const flat = (o, trail = []) => Object.entries(o).forEach(([k, val]) => (val && typeof val === "object" ? flat(val, [...trail, k]) : (() => {
    const p = [...trail, k];
    const name = `--${prefix}-` + p.filter((s, i) => !(i > 0 && DROP.has(s))).join("-");
    if (p[0] === "color") { const c = typeof val === "string" && parseColor(val); if (c) colors.push({ name, value: val, rgb: c, role: p[1] === "semantic" }); }
    if (p[0] === "font" && p[1] === "family") fonts.push({ name, value: String(val) });
  })()));
  flat(res.light || {});
  return { prefix, colors, fonts, path: tp };
}

const tokens = inventory ? null : loadTokens();
if (!inventory && !tokens) {
  console.error("✗ brand/build/tokens.resolved.json introuvable. Lancer d'abord : node brand/scripts/brand-build.mjs");
  process.exit(2);
}
const nearest = (rgb) => {
  let best = null;
  for (const t of tokens.colors) { const d = dist(rgb, t.rgb); if (!best || d < best.d || (d === best.d && t.role && !best.t.role)) best = { t, d }; }
  return best;
};

// ---------- Scan ----------
const findings = [];
const inv = { colors: new Map(), fonts: new Map(), vars: new Map(), twPalette: new Map(), files: 0 };
const brandFontNames = () => (tokens ? tokens.fonts.map((f) => f.value.split(",")[0].replace(/['"]/g, "").trim().toLowerCase()) : []);
const GENERIC_FONTS = new Set(["inherit", "initial", "unset", "sans-serif", "serif", "monospace", "system-ui", "ui-sans-serif", "ui-serif", "ui-monospace", "-apple-system", "blinkmacsystemfont", "cursive"]);

for (const file of walk(rootDir)) {
  const ext = path.extname(file).toLowerCase();
  if (!EXT.has(ext)) continue;
  let text;
  try { text = fs.readFileSync(file, "utf8"); } catch { continue; }
  if (text.length > 1_500_000) continue;
  inv.files++;
  const rel = path.relative(rootDir, file);
  const lines = text.split("\n");
  const isTokenSource = /(^|\/)(tokens?|theme|variables|globals?)\.(css|scss)$/.test(rel) || rel.startsWith("brand" + path.sep);

  lines.forEach((line, i) => {
    const where = `${rel}:${i + 1}`;
    if (/^\s*(\/\/|\*|\/\*)/.test(line) && !/:\s*#/.test(line)) return;
    const colorHits = [...(line.match(RE.hex) || []), ...(line.match(RE.fn) || [])];
    for (const raw of colorHits) {
      const c = parseColor(raw);
      if (!c) continue;
      const h = hex(c);
      if (inventory) { const e = inv.colors.get(h) || { count: 0, files: new Set() }; e.count++; e.files.add(rel); inv.colors.set(h, e); continue; }
      if (/var\(--/.test(line) && line.indexOf("var(--") < line.indexOf(raw)) continue; // fallback de var()
      const n = nearest(c);
      findings.push({ type: "couleur", where, value: raw, suggestion: n ? (n.d === 0 ? `var(${n.t.name})` : n.d <= 14 ? `var(${n.t.name}) (proche, écart ${n.d.toFixed(0)})` : `hors système (le plus proche : ${n.t.name}, écart ${n.d.toFixed(0)})`) : null, severity: n && n.d === 0 ? "facile" : n && n.d <= 14 ? "à confirmer" : "à arbitrer", line: line.trim().slice(0, 160) });
    }
    for (const m of line.matchAll(RE.fontFamily)) {
      const val = (m[1] || m[3] || m[4] || "").trim();
      if (/var\(--/.test(val)) continue;
      const first = val.replace(/^[\['"`\s]+/, "").split(/[,'"`]/)[0].trim().toLowerCase();
      if (inventory) { const e = inv.fonts.get(first) || { count: 0, full: val }; e.count++; inv.fonts.set(first, e); continue; }
      if (GENERIC_FONTS.has(first) || isTokenSource) continue;
      const known = brandFontNames().includes(first);
      findings.push({ type: "police", where, value: val, suggestion: known ? "utiliser la variable de police du système" : "police hors système", severity: known ? "facile" : "à arbitrer", line: line.trim().slice(0, 160) });
    }
    for (const m of line.matchAll(RE.twPalette)) {
      if (inventory) { inv.twPalette.set(m[0], (inv.twPalette.get(m[0]) || 0) + 1); continue; }
      findings.push({ type: "palette Tailwind par défaut", where, value: m[0], suggestion: "remplacer par une couleur de rôle (bg, surface, text, accent…)", severity: "à confirmer", line: line.trim().slice(0, 160) });
    }
    if (!inventory) for (const m of line.matchAll(RE.twArbitrary)) findings.push({ type: "valeur arbitraire", where, value: m[0], suggestion: "utiliser l'échelle d'espacement, de rayon ou de texte", severity: "à confirmer", line: line.trim().slice(0, 160) });
    if (inventory && /\.(css|scss|less)$/.test(ext)) for (const m of line.matchAll(RE.cssVarDecl)) inv.vars.set(m[1], m[2].trim());
  });
}

// ---------- Sortie ----------
if (inventory) {
  const stack = detectStack();
  const colors = [...inv.colors.entries()].sort((a, b) => b[1].count - a[1].count);
  const fonts = [...inv.fonts.entries()].sort((a, b) => b[1].count - a[1].count);
  const tw = [...inv.twPalette.entries()].sort((a, b) => b[1] - a[1]);
  if (asJson) {
    console.log(JSON.stringify({ stack, filesScanned: inv.files, colors: colors.map(([h, e]) => ({ hex: h, count: e.count, files: [...e.files].slice(0, 5) })), fonts: fonts.map(([f, e]) => ({ font: f, count: e.count, declaration: e.full })), cssVariables: Object.fromEntries(inv.vars), tailwindPalette: Object.fromEntries(tw) }, null, 2));
  } else {
    console.log(`# Inventaire de marque : ${path.basename(rootDir)}\n`);
    console.log(`## Stack\n- Frameworks : ${stack.frameworks.join(", ") || "non détecté"}\n- Tailwind : ${stack.tailwind ? "v" + stack.tailwind : "non"}\n- Styles : ${stack.styling.join(", ") || "CSS simple"}\n- TypeScript : ${stack.typescript ? "oui" : "non"}\n- Gestionnaire : ${stack.packageManager || "?"}\n- Fichiers repères : ${stack.files.join(", ") || "aucun"}\n`);
    console.log(`## Couleurs utilisées (${colors.length} distinctes, ${inv.files} fichiers)`);
    colors.slice(0, 30).forEach(([h, e]) => console.log(`- ${h} × ${e.count}  (${[...e.files].slice(0, 3).join(", ")}${e.files.size > 3 ? "…" : ""})`));
    console.log(`\n## Polices déclarées`);
    fonts.slice(0, 15).forEach(([f, e]) => console.log(`- ${f} × ${e.count}  → ${e.full.slice(0, 90)}`));
    if (inv.vars.size) { console.log(`\n## Variables CSS existantes (${inv.vars.size})`); [...inv.vars.entries()].slice(0, 60).forEach(([k, val]) => console.log(`- ${k}: ${val.slice(0, 80)}`)); }
    if (tw.length) { console.log(`\n## Palette Tailwind par défaut utilisée`); tw.slice(0, 20).forEach(([k, n]) => console.log(`- ${k} × ${n}`)); }
  }
  process.exit(0);
}

const byType = findings.reduce((a, f) => ((a[f.type] = (a[f.type] || 0) + 1), a), {});
if (asJson) console.log(JSON.stringify({ filesScanned: inv.files, summary: byType, findings }, null, 2));
else {
  console.log(`# Audit de conformité : ${findings.length} écart(s) sur ${inv.files} fichiers\n`);
  Object.entries(byType).forEach(([k, n]) => console.log(`- ${k} : ${n}`));
  const groups = ["facile", "à confirmer", "à arbitrer"];
  for (const g of groups) {
    const list = findings.filter((f) => f.severity === g);
    if (!list.length) continue;
    console.log(`\n## ${g === "facile" ? "Remplacements directs" : g === "à confirmer" ? "À confirmer" : "À arbitrer (hors système)"} (${list.length})`);
    list.slice(0, 200).forEach((f) => console.log(`- ${f.where}  [${f.type}] ${f.value}  → ${f.suggestion}`));
    if (list.length > 200) console.log(`  … ${list.length - 200} de plus (utiliser --json)`);
  }
}
process.exit(flag("--strict") && findings.length ? 1 : 0);
