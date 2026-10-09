#!/usr/bin/env node
// brand-build.mjs : génère le système de marque à partir de brand/tokens.json
// Zéro dépendance. Node >= 18.
//
// Usage :
//   node brand-build.mjs [chemin/vers/tokens.json] [--strict] [--check]
//
// Sorties (dans le dossier de tokens.json) :
//   build/tokens.css            variables CSS (clair + sombre)
//   build/brand.css             composants de base, 100 % tokens
//   build/tailwind.preset.cjs   preset Tailwind v3
//   build/theme.css             bloc @theme pour Tailwind v4
//   build/tokens.js             objet JS des valeurs résolues (ESM)
//   build/tokens.resolved.json  valeurs résolues, par mode
//   preview.html                planche de marque autonome
//
// --check  : ne génère rien, vérifie seulement (structure + contrastes)
// --strict : code de sortie 1 si un contraste ou un token requis manque

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const strict = args.includes("--strict");
const checkOnly = args.includes("--check");
const tokensPath = path.resolve(args.find((a) => !a.startsWith("--")) || "brand/tokens.json");

if (!fs.existsSync(tokensPath)) {
  console.error(`✗ Fichier introuvable : ${tokensPath}`);
  process.exit(2);
}

const root = JSON.parse(fs.readFileSync(tokensPath, "utf8"));
const brandDir = path.dirname(tokensPath);
const buildDir = path.join(brandDir, "build");
const meta = root.$meta || {};
const P = (meta.prefix || "brand").replace(/[^a-z0-9-]/gi, "");
const problems = [];
const warnings = [];

// ---------- 1. Aplatir les tokens ----------
const DROP = new Set(["palette", "semantic", "family"]);
const isLeaf = (v) => v === null || typeof v !== "object" || Object.prototype.hasOwnProperty.call(v, "$value");
const leafValue = (v) => (v && typeof v === "object" ? v.$value : v);

const tokens = new Map(); // path -> { path, name, raw, group }
function walk(node, trail) {
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$")) continue;
    const t = [...trail, k];
    if (isLeaf(v)) {
      const name = t.filter((s, i) => !(i > 0 && DROP.has(s))).join("-").replace(/[^a-z0-9-]/gi, "-");
      tokens.set(t.join("."), { path: t.join("."), name, raw: leafValue(v), group: t[0], desc: v && v.$description });
    } else walk(v, t);
  }
}
walk(root, []);

const byName = new Map();
for (const t of tokens.values()) {
  if (byName.has(t.name)) problems.push(`Collision de nom : ${t.path} et ${byName.get(t.name).path} donnent --${P}-${t.name}`);
  byName.set(t.name, t);
}

// ---------- 2. Résolution des références ----------
const REF = /^\{([^}]+)\}$/;
const REF_G = /\{([^}]+)\}/g;
const cssVar = (p) => {
  const t = tokens.get(p);
  if (!t) { problems.push(`Référence inconnue : {${p}}`); return "inherit"; }
  return `var(--${P}-${t.name})`;
};

function resolveValue(raw, overrides = {}, seen = new Set()) {
  if (typeof raw !== "string") return raw;
  return raw.replace(REF_G, (_, p) => {
    if (seen.has(p)) { problems.push(`Référence circulaire : ${p}`); return ""; }
    const src = overrides[p] !== undefined ? overrides[p] : tokens.get(p)?.raw;
    if (src === undefined) { problems.push(`Référence inconnue : {${p}}`); return ""; }
    return String(resolveValue(src, overrides, new Set([...seen, p])));
  });
}
const toCss = (raw) => (typeof raw === "string" ? raw.replace(REF_G, (_, p) => cssVar(p)) : String(raw));

const modes = { light: {} };
for (const [m, o] of Object.entries(root.$modes || {})) {
  const flat = {};
  for (const [k, v] of Object.entries(o)) {
    if (!tokens.has(k)) warnings.push(`Mode ${m} : ${k} n'existe pas dans les tokens de base`);
    flat[k] = leafValue(v);
  }
  modes[m] = flat;
}

const resolved = {};
for (const m of Object.keys(modes)) {
  resolved[m] = {};
  for (const t of tokens.values()) {
    const raw = modes[m][t.path] !== undefined ? modes[m][t.path] : t.raw;
    resolved[m][t.path] = resolveValue(raw, modes[m]);
  }
}

// ---------- 3. Tokens requis ----------
const REQUIRED = [
  "color.semantic.bg", "color.semantic.surface", "color.semantic.text", "color.semantic.text-muted",
  "color.semantic.border", "color.semantic.accent", "color.semantic.accent-contrast", "color.semantic.focus",
  "color.semantic.success", "color.semantic.warning", "color.semantic.danger",
  "font.family.display", "font.family.body",
];
for (const r of REQUIRED) if (!tokens.has(r)) problems.push(`Token requis manquant : ${r}`);
for (const g of ["text", "space", "radius", "shadow", "motion"]) {
  if (![...tokens.values()].some((t) => t.group === g)) warnings.push(`Groupe absent : ${g}`);
}

// ---------- 4. Contrastes (WCAG 2.x) ----------
function parseColor(s) {
  if (typeof s !== "string") return null;
  s = s.trim().toLowerCase();
  let m = s.match(/^#([0-9a-f]{3,8})$/);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = h.split("").map((c) => c + c).join("");
    if (h.length !== 6 && h.length !== 8) return null;
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1 };
  }
  m = s.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)$/);
  if (m) {
    let a = m[4] === undefined ? 1 : m[4].endsWith("%") ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
    return { r: +m[1], g: +m[2], b: +m[3], a };
  }
  return null;
}
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = ({ r, g, b }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const over = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
function ratio(fgS, bgS) {
  const bg = parseColor(bgS), fg0 = parseColor(fgS);
  if (!bg || !fg0) return null;
  const fg = fg0.a < 1 ? over(fg0, bg) : fg0;
  const [l1, l2] = [lum(fg), lum(bg)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}

const DEFAULT_PAIRS = [
  { fg: "color.semantic.text", bg: "color.semantic.bg", min: 4.5, label: "Texte sur fond" },
  { fg: "color.semantic.text", bg: "color.semantic.surface", min: 4.5, label: "Texte sur surface" },
  { fg: "color.semantic.text-muted", bg: "color.semantic.bg", min: 4.5, label: "Texte secondaire sur fond" },
  { fg: "color.semantic.text-muted", bg: "color.semantic.surface", min: 4.5, label: "Texte secondaire sur surface" },
  { fg: "color.semantic.accent-contrast", bg: "color.semantic.accent", min: 4.5, label: "Texte du bouton principal" },
  { fg: "color.semantic.accent", bg: "color.semantic.bg", min: 3, label: "Accent sur fond (éléments d'interface)" },
  { fg: "color.semantic.focus", bg: "color.semantic.bg", min: 3, label: "Anneau de focus" },
  { fg: "color.semantic.danger", bg: "color.semantic.bg", min: 3, label: "Erreur sur fond" },
];
const pairs = (meta.contrast || DEFAULT_PAIRS).filter((p) => tokens.has(p.fg) && tokens.has(p.bg));
const contrast = [];
for (const m of Object.keys(modes)) {
  for (const p of pairs) {
    const r = ratio(resolved[m][p.fg], resolved[m][p.bg]);
    const row = { mode: m, ...p, fgValue: resolved[m][p.fg], bgValue: resolved[m][p.bg], ratio: r ? Math.round(r * 100) / 100 : null };
    row.ok = r !== null && r >= p.min;
    contrast.push(row);
    if (r === null) warnings.push(`Contraste non calculable (${m}) : ${p.fg} / ${p.bg}`);
    else if (!row.ok) problems.push(`Contraste insuffisant (${m}) : ${p.label || p.fg + " / " + p.bg} = ${row.ratio}:1, minimum ${p.min}:1`);
  }
}

// ---------- 5. Rapport ----------
function report() {
  console.log(`\n${meta.name || "Marque"} · v${meta.version || "0.0.0"} · ${tokens.size} tokens · modes : ${Object.keys(modes).join(", ")}`);
  console.log("\nContrastes :");
  for (const c of contrast) console.log(`  ${c.ok ? "✓" : "✗"} [${c.mode}] ${(c.label || c.fg + " / " + c.bg).padEnd(42)} ${c.ratio ?? "?"}:1 (min ${c.min})`);
  if (warnings.length) { console.log("\nAvertissements :"); warnings.forEach((w) => console.log("  ! " + w)); }
  if (problems.length) { console.log("\nProblèmes :"); problems.forEach((p) => console.log("  ✗ " + p)); }
  else console.log("\n✓ Aucun problème bloquant.");
}

if (checkOnly) { report(); process.exit(strict && problems.length ? 1 : 0); }

// ---------- 6. Génération ----------
fs.mkdirSync(buildDir, { recursive: true });
const HEADER = `/* Généré par brand-build depuis tokens.json (${meta.name || ""} v${meta.version || ""}). Ne pas modifier : modifier tokens.json puis relancer le build. */\n`;
const v = (t) => `--${P}-${t.name}`;

// tokens.css
let css = HEADER + `:root {\n`;
for (const t of tokens.values()) css += `  ${v(t)}: ${toCss(t.raw)};\n`;
css += `}\n`;
for (const [m, o] of Object.entries(modes)) {
  if (m === "light" || !Object.keys(o).length) continue;
  const body = Object.entries(o).filter(([k]) => tokens.has(k)).map(([k, raw]) => `  ${v(tokens.get(k))}: ${toCss(raw)};`).join("\n");
  if (m === "dark") {
    css += `\n@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) {\n${body.replace(/^/gm, "  ")}\n    color-scheme: dark;\n  }\n}\n`;
  }
  css += `\n[data-theme="${m}"] {\n${body}\n${m === "dark" ? "  color-scheme: dark;\n" : ""}}\n`;
}

// Tailwind
const TW = { color: "colors", "font.family": "fontFamily", "font.weight": "fontWeight", text: "fontSize", leading: "lineHeight", tracking: "letterSpacing", space: "spacing", radius: "borderRadius", shadow: "boxShadow", "motion.duration": "transitionDuration", "motion.easing": "transitionTimingFunction" };
const TW4 = { color: "color", "font.family": "font", "font.weight": "font-weight", text: "text", leading: "leading", tracking: "tracking", space: "spacing", radius: "radius", shadow: "shadow", "motion.easing": "ease" };
const twKey = (t, g = t.group) => t.path.slice(g.length + 1).split(".").filter((s) => !DROP.has(s)).join("-");
const twGroup = (t, map) => Object.keys(map).find((g) => t.path === g || t.path.startsWith(g + "."));
const preset = { theme: { extend: {} } };
let theme4 = HEADER + `@theme inline {\n`;
for (const t of tokens.values()) {
  const g3 = twGroup(t, TW);
  if (g3) { const k = TW[g3]; (preset.theme.extend[k] ||= {})[twKey(t, g3)] = `var(${v(t)})`; }
  const g4 = twGroup(t, TW4);
  if (g4) theme4 += `  --${TW4[g4]}-${twKey(t, g4)}: var(${v(t)});\n`;
}
const bps = [...tokens.values()].filter((t) => t.group === "breakpoint");
if (bps.length) {
  preset.theme.screens = Object.fromEntries(bps.map((t) => [twKey(t), resolved.light[t.path]]));
  bps.forEach((t) => (theme4 += `  --breakpoint-${twKey(t)}: ${resolved.light[t.path]};\n`));
}
theme4 += `}\n`;

// brand.css : composants de base
const c = (n, fb) => `var(--${P}-${n}${fb ? ", " + fb : ""})`;
const col = (n) => c(`color-${n}`);
const S = (n, fb) => c(`space-${n}`, fb);
const cls = `.${P}`;
const brandCss = HEADER + `
/* Base */
${cls}-root { background: ${col("bg")}; color: ${col("text")}; font-family: ${c("font-body")}; line-height: ${c("leading-normal", "1.5")}; -webkit-font-smoothing: antialiased; }
${cls}-root :focus-visible { outline: 2px solid ${col("focus")}; outline-offset: 2px; }
${cls}-display { font-family: ${c("font-display")}; font-size: ${c("text-5xl", "3rem")}; line-height: ${c("leading-tight", "1.1")}; letter-spacing: ${c("tracking-tight", "-0.01em")}; font-weight: ${c("component-heading-weight", c("font-weight-regular", "400"))}; }
${cls}-h1 { font-family: ${c("font-display")}; font-size: ${c("text-4xl", "2.25rem")}; line-height: ${c("leading-tight", "1.15")}; font-weight: ${c("component-heading-weight", "600")}; }
${cls}-h2 { font-family: ${c("font-display")}; font-size: ${c("text-3xl", "1.875rem")}; line-height: ${c("leading-tight", "1.2")}; font-weight: ${c("component-heading-weight", "600")}; }
${cls}-h3 { font-family: ${c("font-display")}; font-size: ${c("text-xl", "1.25rem")}; line-height: ${c("leading-snug", "1.3")}; font-weight: ${c("component-heading-weight", "600")}; }
${cls}-body { font-size: ${c("text-base", "1rem")}; }
${cls}-small { font-size: ${c("text-sm", "0.875rem")}; color: ${col("text-muted")}; }
${cls}-eyebrow { font-size: ${c("text-xs", "0.75rem")}; letter-spacing: ${c("tracking-wide", "0.08em")}; text-transform: uppercase; color: ${col("text-muted")}; }
${cls}-link { color: ${col("accent")}; text-decoration: underline; text-underline-offset: 0.2em; transition: opacity ${c("motion-duration-fast", "120ms")}; }
${cls}-link:hover { opacity: 0.8; }

/* Bouton */
${cls}-btn { box-sizing: border-box; display: inline-flex; align-items: center; justify-content: center; gap: ${S("2", "0.5rem")};
  font-family: ${c("component-button-font", c("font-body"))}; font-weight: ${c("component-button-weight", "600")};
  text-transform: ${c("component-button-transform", "none")}; letter-spacing: ${c("component-button-tracking", "0")};
  font-size: ${c("text-sm", "0.875rem")}; line-height: 1; height: ${c("component-button-height-md", "2.5rem")};
  padding: 0 ${c("component-button-padding-x", S("4", "1rem"))}; border-radius: ${c("component-button-radius", c("radius-md", "6px"))};
  border: ${c("border-width-default", "1px")} solid transparent; cursor: pointer; text-decoration: none; white-space: nowrap;
  transition: background-color ${c("motion-duration-fast", "120ms")} ${c("motion-easing-standard", "ease")}, color ${c("motion-duration-fast", "120ms")}, border-color ${c("motion-duration-fast", "120ms")}, transform ${c("motion-duration-fast", "120ms")}; }
${cls}-btn:active:not(:disabled) { transform: translateY(1px); }
${cls}-btn:focus-visible { outline: 2px solid ${col("focus")}; outline-offset: 2px; }
${cls}-btn--primary { background: ${col("accent")}; color: ${col("accent-contrast")}; }
${cls}-btn--primary:hover:not(:disabled) { background: ${c("color-accent-hover", `color-mix(in srgb, ${col("accent")} 88%, ${col("text")})`)}; }
${cls}-btn--secondary { background: ${col("surface")}; color: ${col("text")}; border-color: ${col("border")}; }
${cls}-btn--secondary:hover:not(:disabled) { border-color: ${col("text")}; }
${cls}-btn--ghost { background: transparent; color: ${col("text")}; }
${cls}-btn--ghost:hover:not(:disabled) { background: color-mix(in srgb, ${col("text")} 7%, transparent); }
${cls}-btn--danger { background: ${col("danger")}; color: ${c("color-danger-contrast", "#fff")}; }
${cls}-btn--sm { height: ${c("component-button-height-sm", "2rem")}; padding: 0 ${S("3", "0.75rem")}; font-size: ${c("text-xs", "0.75rem")}; }
${cls}-btn--lg { height: ${c("component-button-height-lg", "3rem")}; padding: 0 ${S("6", "1.5rem")}; font-size: ${c("text-base", "1rem")}; }
${cls}-btn:disabled, ${cls}-btn[aria-disabled="true"] { opacity: 0.45; cursor: not-allowed; }
${cls}-btn[aria-busy="true"] { cursor: progress; }
${cls}-btn[aria-busy="true"]::before { content: ""; width: 1em; height: 1em; border-radius: 50%; border: 2px solid currentColor; border-right-color: transparent; animation: ${P}-spin 0.7s linear infinite; }
@keyframes ${P}-spin { to { transform: rotate(360deg); } }

/* Champ */
${cls}-field { display: grid; gap: ${S("1", "0.25rem")}; }
${cls}-label { font-size: ${c("text-sm", "0.875rem")}; font-weight: ${c("font-weight-medium", "500")}; color: ${col("text")}; }
${cls}-hint { font-size: ${c("text-xs", "0.75rem")}; color: ${col("text-muted")}; }
${cls}-input { box-sizing: border-box; width: 100%; font: inherit; font-size: ${c("text-sm", "0.875rem")}; color: ${col("text")}; background: ${col("surface")};
  height: ${c("component-input-height", "2.5rem")}; padding: 0 ${S("3", "0.75rem")}; border: ${c("border-width-default", "1px")} solid ${col("border")};
  border-radius: ${c("component-input-radius", c("radius-md", "6px"))}; transition: border-color ${c("motion-duration-fast", "120ms")}, box-shadow ${c("motion-duration-fast", "120ms")}; }
textarea${cls}-input { height: auto; min-height: 6rem; padding: ${S("2", "0.5rem")} ${S("3", "0.75rem")}; }
${cls}-input::placeholder { color: ${col("text-muted")}; opacity: 0.8; }
${cls}-input:hover:not(:disabled) { border-color: color-mix(in srgb, ${col("border")} 50%, ${col("text")}); }
${cls}-input:focus { outline: none; border-color: ${col("focus")}; box-shadow: 0 0 0 3px color-mix(in srgb, ${col("focus")} 25%, transparent); }
${cls}-input[aria-invalid="true"] { border-color: ${col("danger")}; }
${cls}-input[aria-invalid="true"] ~ ${cls}-hint { color: ${col("danger")}; }
${cls}-input:disabled { opacity: 0.5; cursor: not-allowed; }

/* Carte */
${cls}-card { box-sizing: border-box; background: ${col("surface")}; color: ${col("text")}; border: ${c("component-card-border", `${c("border-width-default", "1px")} solid ${col("border")}`)};
  border-radius: ${c("component-card-radius", c("radius-lg", "10px"))}; padding: ${c("component-card-padding", S("6", "1.5rem"))}; box-shadow: ${c("component-card-shadow", "none")}; }
${cls}-card--interactive { transition: transform ${c("motion-duration-base", "200ms")} ${c("motion-easing-standard", "ease")}, box-shadow ${c("motion-duration-base", "200ms")}; cursor: pointer; }
${cls}-card--interactive:hover { transform: translateY(-2px); box-shadow: ${c("shadow-md", "0 6px 20px rgb(0 0 0 / .08)")}; }

/* Badge */
${cls}-badge { display: inline-flex; align-items: center; gap: ${S("1", "0.25rem")}; font-size: ${c("text-xs", "0.75rem")}; font-weight: ${c("font-weight-medium", "500")};
  padding: 0.2em 0.6em; border-radius: ${c("component-badge-radius", c("radius-full", "999px"))}; background: color-mix(in srgb, ${col("text")} 8%, transparent); color: ${col("text")}; }
${cls}-badge--accent { background: color-mix(in srgb, ${col("accent")} 16%, transparent); color: ${col("text")}; }
${cls}-badge--success { background: color-mix(in srgb, ${col("success")} 18%, transparent); }
${cls}-badge--warning { background: color-mix(in srgb, ${col("warning")} 22%, transparent); }
${cls}-badge--danger { background: color-mix(in srgb, ${col("danger")} 18%, transparent); }

@media (prefers-reduced-motion: reduce) { ${cls}-root *, ${cls}-btn, ${cls}-card--interactive { transition: none !important; animation: none !important; } }
`;

// tokens.js / resolved json
const nested = (m) => { const o = {}; for (const [p, val] of Object.entries(resolved[m])) { const segs = p.split("."); let cur = o; segs.slice(0, -1).forEach((s) => (cur = cur[s] ||= {})); cur[segs.at(-1)] = val; } return o; };
const allResolved = Object.fromEntries(Object.keys(modes).map((m) => [m, nested(m)]));

fs.writeFileSync(path.join(buildDir, "tokens.css"), css);
fs.writeFileSync(path.join(buildDir, "brand.css"), brandCss);
fs.writeFileSync(path.join(buildDir, "tailwind.preset.cjs"), HEADER.replace("/*", "//").replace(" */", "") + `module.exports = ${JSON.stringify(preset, null, 2)};\n`);
fs.writeFileSync(path.join(buildDir, "theme.css"), theme4);
fs.writeFileSync(path.join(buildDir, "tokens.js"), HEADER + `export const meta = ${JSON.stringify({ name: meta.name, version: meta.version, prefix: P })};\nexport const tokens = ${JSON.stringify(allResolved, null, 2)};\nexport default tokens;\n`);
fs.writeFileSync(path.join(buildDir, "tokens.resolved.json"), JSON.stringify({ meta: { name: meta.name, version: meta.version, prefix: P }, ...allResolved, contrast }, null, 2));

// ---------- 7. preview.html ----------
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
const overridesPath = path.join(brandDir, "components", "overrides.css");
const overrides = fs.existsSync(overridesPath) ? fs.readFileSync(overridesPath, "utf8") : "";
const list = (g) => [...tokens.values()].filter((t) => t.path.startsWith(g + "."));
const palette = list("color.palette"), semantic = list("color.semantic");
const swatch = (t) => `<div class="pv-sw"><div class="pv-chip" style="background:var(${v(t)})"></div><div class="pv-meta"><strong>${esc(t.path.split(".").at(-1))}</strong><code>--${P}-${t.name}</code><span>${esc(resolved.light[t.path])}${modes.dark && modes.dark[t.path] ? " · sombre " + esc(resolved.dark[t.path]) : ""}</span>${t.desc ? `<em>${esc(t.desc)}</em>` : ""}</div></div>`;
const scaleRow = (t, style, sample) => `<div class="pv-row"><code>--${P}-${t.name}</code><span class="pv-val">${esc(resolved.light[t.path])}</span><div style="${style}">${sample}</div></div>`;
const families = list("font.family");
const texts = list("text");
const spaces = list("space"), radii = list("radius"), shadows = list("shadow");
const contrastRows = contrast.map((r) => `<tr><td>${esc(r.mode)}</td><td>${esc(r.label || r.fg + " / " + r.bg)}</td><td><span class="pv-pair" style="background:${esc(r.bgValue)};color:${esc(r.fgValue)}">Aa</span></td><td>${r.ratio ?? "?"}:1</td><td>${r.min}:1</td><td>${r.ok ? "✓" : "✗"}</td></tr>`).join("");

const preview = `<!doctype html>
<html lang="${esc(meta.language || "fr")}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(meta.name || "Marque")} · système de marque</title>
${meta.fontsUrl ? `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="${esc(meta.fontsUrl)}">` : ""}
<style>
${css}
${brandCss}
${overrides}
/* Mise en page de la planche */
body { margin: 0; }
.pv { max-width: 1120px; margin: 0 auto; padding: ${S("12", "3rem")} 16px ${S("24", "6rem")}; }
.pv header { display: flex; justify-content: space-between; align-items: flex-end; gap: 1rem; flex-wrap: wrap; border-bottom: 1px solid ${col("border")}; padding-bottom: ${S("8", "2rem")}; margin-bottom: ${S("12", "3rem")}; }
.pv section { margin-bottom: ${S("16", "4rem")}; }
.pv section > h2 { margin: 0 0 ${S("6", "1.5rem")}; }
.pv-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: ${S("4", "1rem")}; }
.pv-sw { border: 1px solid ${col("border")}; background: ${col("surface")}; }
.pv-chip { height: 88px; border-bottom: 1px solid ${col("border")}; }
.pv-meta { padding: ${S("3", ".75rem")}; display: grid; gap: 2px; font-size: ${c("text-xs", ".75rem")}; }
.pv-meta strong { font-size: ${c("text-sm", ".875rem")}; }
.pv-meta em { color: ${col("text-muted")}; }
.pv code { font-family: ${c("font-mono", "ui-monospace, monospace")}; font-size: 0.85em; color: ${col("text-muted")}; }
.pv-row { display: grid; grid-template-columns: 200px 110px 1fr; align-items: center; gap: ${S("4", "1rem")}; padding: ${S("3", ".75rem")} 0; border-bottom: 1px solid ${col("border")}; overflow: hidden; }
.pv-row > div { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pv-val { font-size: ${c("text-xs", ".75rem")}; color: ${col("text-muted")}; }
.pv-demo { display: flex; flex-wrap: wrap; gap: ${S("3", ".75rem")}; align-items: center; margin-bottom: ${S("6", "1.5rem")}; }
.pv-family { padding: ${S("6", "1.5rem")} 0; border-bottom: 1px solid ${col("border")}; }
.pv-family .big { font-size: ${c("text-4xl", "2.25rem")}; line-height: 1.1; margin: ${S("2", ".5rem")} 0; }
.pv table { width: 100%; border-collapse: collapse; font-size: ${c("text-sm", ".875rem")}; }
.pv td, .pv th { text-align: left; padding: ${S("2", ".5rem")}; border-bottom: 1px solid ${col("border")}; }
.pv-pair { display: inline-block; padding: 2px 10px; font-weight: 600; border: 1px solid ${col("border")}; }
.pv-toggle { font: inherit; }
.pv-grid > *, .pv-row > * { min-width: 0; }
@media (max-width: 640px) { .pv-row { grid-template-columns: 1fr; gap: 4px; } .pv-row > div { white-space: normal; } .pv-grid { grid-template-columns: 1fr 1fr; } .pv td, .pv th { padding: 4px; } }
</style>
</head>
<body class="${P}-root">
<main class="pv">
<header>
  <div>
    <div class="${P}-eyebrow">Système de marque · v${esc(meta.version || "0.0.0")}</div>
    <h1 class="${P}-display" style="margin:.25em 0 0">${esc(meta.name || "Marque")}</h1>
    ${meta.tagline ? `<p class="${P}-body" style="max-width:52ch;color:${col("text-muted")}">${esc(meta.tagline)}</p>` : ""}
  </div>
  ${modes.dark ? `<button class="${P}-btn ${P}-btn--secondary ${P}-btn--sm pv-toggle" onclick="var r=document.documentElement;var d=r.dataset.theme==='dark'||(!r.dataset.theme&&matchMedia('(prefers-color-scheme: dark)').matches);r.dataset.theme=d?'light':'dark'">Clair / sombre</button>` : ""}
</header>
${meta.description ? `<section><p class="${P}-body" style="max-width:68ch;font-size:${c("text-lg", "1.125rem")}">${esc(meta.description)}</p></section>` : ""}

<section><h2 class="${P}-h2">Couleurs</h2>
  ${semantic.length ? `<h3 class="${P}-h3">Rôles</h3><div class="pv-grid">${semantic.map(swatch).join("")}</div>` : ""}
  ${palette.length ? `<h3 class="${P}-h3" style="margin-top:2rem">Palette</h3><div class="pv-grid">${palette.map(swatch).join("")}</div>` : ""}
</section>

<section><h2 class="${P}-h2">Contrastes</h2>
  <div style="overflow-x:auto"><table><thead><tr><th>Mode</th><th>Paire</th><th>Aperçu</th><th>Ratio</th><th>Minimum</th><th></th></tr></thead><tbody>${contrastRows}</tbody></table></div>
</section>

<section><h2 class="${P}-h2">Typographie</h2>
  ${families.map((t) => `<div class="pv-family"><div class="${P}-eyebrow">${esc(t.path.split(".").at(-1))} · <code>--${P}-${t.name}</code></div><div class="big" style="font-family:var(${v(t)})">${esc(meta.name || "Aa")} ${t.path.endsWith("mono") ? "0123456789" : "Aa Bb Gg 0123"}</div><code>${esc(resolved.light[t.path])}</code></div>`).join("")}
  <h3 class="${P}-h3" style="margin-top:2rem">Échelle</h3>
  ${texts.map((t) => scaleRow(t, `font-size:var(${v(t)});line-height:1.2`, esc(meta.pangram || "Une marque tient dans ses détails"))).join("")}
</section>

<section><h2 class="${P}-h2">Espacements</h2>
  ${spaces.map((t) => scaleRow(t, "", `<div style="height:12px;width:var(${v(t)});background:${col("accent")}"></div>`)).join("")}
</section>

<section><h2 class="${P}-h2">Rayons et ombres</h2>
  <div class="pv-grid">
  ${radii.map((t) => `<div class="pv-sw" style="padding:1rem"><div style="height:72px;background:${col("surface")};border:1px solid ${col("border")};border-radius:var(${v(t)})"></div><div class="pv-meta" style="padding:.5rem 0 0"><code>--${P}-${t.name}</code><span>${esc(resolved.light[t.path])}</span></div></div>`).join("")}
  ${shadows.map((t) => `<div class="pv-sw" style="padding:1rem"><div style="height:72px;background:${col("surface")};box-shadow:var(${v(t)})"></div><div class="pv-meta" style="padding:.5rem 0 0"><code>--${P}-${t.name}</code></div></div>`).join("")}
  </div>
</section>

<section><h2 class="${P}-h2">Composants</h2>
  <h3 class="${P}-h3">Boutons</h3>
  <div class="pv-demo">
    <button class="${P}-btn ${P}-btn--primary">Principal</button>
    <button class="${P}-btn ${P}-btn--secondary">Secondaire</button>
    <button class="${P}-btn ${P}-btn--ghost">Discret</button>
    <button class="${P}-btn ${P}-btn--danger">Supprimer</button>
    <button class="${P}-btn ${P}-btn--primary" disabled>Désactivé</button>
    <button class="${P}-btn ${P}-btn--primary" aria-busy="true">Chargement</button>
  </div>
  <div class="pv-demo">
    <button class="${P}-btn ${P}-btn--primary ${P}-btn--sm">Petit</button>
    <button class="${P}-btn ${P}-btn--primary">Moyen</button>
    <button class="${P}-btn ${P}-btn--primary ${P}-btn--lg">Grand</button>
  </div>
  <h3 class="${P}-h3">Champs</h3>
  <div class="pv-grid" style="margin-bottom:1.5rem">
    <div class="${P}-field"><label class="${P}-label" for="pv-a">Nom</label><input id="pv-a" class="${P}-input" placeholder="Votre nom"><span class="${P}-hint">Texte d'aide</span></div>
    <div class="${P}-field"><label class="${P}-label" for="pv-b">Email</label><input id="pv-b" class="${P}-input" value="adresse@invalide" aria-invalid="true"><span class="${P}-hint">Adresse invalide</span></div>
    <div class="${P}-field"><label class="${P}-label" for="pv-c">Désactivé</label><input id="pv-c" class="${P}-input" disabled value="Non modifiable"></div>
  </div>
  <h3 class="${P}-h3">Cartes et badges</h3>
  <div class="pv-grid">
    <div class="${P}-card"><div class="${P}-eyebrow">Carte</div><h4 class="${P}-h3" style="margin:.5rem 0">Titre de carte</h4><p class="${P}-small">Un court paragraphe pour juger le rythme du texte dans une surface.</p><div class="pv-demo" style="margin:1rem 0 0"><span class="${P}-badge">Neutre</span><span class="${P}-badge ${P}-badge--accent">Accent</span><span class="${P}-badge ${P}-badge--success">Validé</span><span class="${P}-badge ${P}-badge--warning">Attention</span><span class="${P}-badge ${P}-badge--danger">Erreur</span></div></div>
    <div class="${P}-card ${P}-card--interactive"><div class="${P}-eyebrow">Carte interactive</div><h4 class="${P}-h3" style="margin:.5rem 0">Survolez-moi</h4><p class="${P}-small">Élévation au survol, désactivée si l'utilisateur réduit les animations.</p><a class="${P}-link" href="#">Lien de marque</a></div>
  </div>
</section>
<footer class="${P}-small">Planche générée depuis tokens.json par brand-build. Source de vérité : brand/tokens.json et brand/BRAND.md.</footer>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(brandDir, "preview.html"), preview);

report();
console.log(`\nFichiers écrits dans ${path.relative(process.cwd(), brandDir) || "."}/ : build/tokens.css, build/brand.css, build/tailwind.preset.cjs, build/theme.css, build/tokens.js, build/tokens.resolved.json, preview.html`);
process.exit(strict && problems.length ? 1 : 0);
