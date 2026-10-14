import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { gsap } from "gsap";
import { tokens } from "@/brand/build/tokens.js";
import { TOTEM_PATHS, TOTEM_TRANSFORM, TOTEM_VIEWBOX } from "@/lib/totem";
import { SERIES, type Artwork } from "@/content/gallery";

/** La salle d'exposition : une pièce à plat, couleurs de la marque, le totem Rayas en terre au centre. */

const P = tokens.light.color.palette;
const EYE = 1.6;
const HANG = 1.65; // centre des tableaux
const WALL_H = 4.4;
const WIDTH = 14;
const SPACING = 3.4;
const RADIUS = 0.35; // le visiteur
const SPEED = 2.6;

export interface GalleryCallbacks {
  onHover: (i: number | null) => void;
  onSeen: (i: number) => void;
}

export interface GalleryHandle {
  setActive: (on: boolean) => void;
  look: (dx: number, dy: number, sensitivity?: number) => void;
  setStick: (x: number, y: number) => void;
  pick: (clientX?: number, clientY?: number) => number | null;
  focus: (i: number, instant?: boolean) => void;
  unfocus: () => void;
  dispose: () => void;
}

interface Slot {
  pos: THREE.Vector3;
  normal: THREE.Vector3;
}

interface Box {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

function layout(n: number) {
  const far = Math.min(3, n);
  const rest = n - far;
  const left = Math.ceil(rest / 2);
  const right = rest - left;
  const perSide = Math.max(3, left);
  const depth = perSide * SPACING + 4;
  const zStart = depth / 2 - 3.5;
  const slots: Slot[] = [];
  for (let k = 0; k < left; k++) {
    slots.push({ pos: new THREE.Vector3(-WIDTH / 2, HANG, zStart - k * SPACING), normal: new THREE.Vector3(1, 0, 0) });
  }
  const farX = far === 1 ? [0] : far === 2 ? [-2.6, 2.6] : [-4.2, 0, 4.2];
  farX.slice(0, far).forEach((x) => slots.push({ pos: new THREE.Vector3(x, HANG, -depth / 2), normal: new THREE.Vector3(0, 0, 1) }));
  for (let k = right - 1; k >= 0; k--) {
    slots.push({ pos: new THREE.Vector3(WIDTH / 2, HANG, zStart - k * SPACING), normal: new THREE.Vector3(-1, 0, 0) });
  }
  return { depth, slots };
}

function canvasTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  draw(ctx);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function cartelTexture(a: Artwork, i: number) {
  return canvasTexture(640, 400, (ctx) => {
    ctx.fillStyle = P.blanc;
    ctx.fillRect(0, 0, 640, 400);
    ctx.fillStyle = P.terre;
    ctx.fillRect(48, 52, 40, 4);
    ctx.fillStyle = P.encre;
    ctx.font = '500 22px "Archivo"';
    ctx.fillText(String(i + 1).padStart(2, "0"), 104, 62);
    ctx.font = '300 54px "Cormorant Garamond"';
    const lines = wrapText(ctx, a.title || "Sans titre", 544).slice(0, 2);
    lines.forEach((l, k) => ctx.fillText(l, 48, 150 + k * 58));
    ctx.font = '400 24px "Archivo"';
    ctx.fillStyle = P.cendre;
    const meta = [a.year, a.technique].filter(Boolean).join(" · ");
    wrapText(ctx, a.src ? meta : "Bientôt accrochée", 544)
      .slice(0, 2)
      .forEach((l, k) => ctx.fillText(l, 48, 150 + lines.length * 58 + 26 + k * 32));
    ctx.fillText("Rayane Benabdeljalil", 48, 352);
  });
}

function blankTexture() {
  return canvasTexture(400, 500, (ctx) => {
    ctx.fillStyle = P.papier;
    ctx.fillRect(0, 0, 400, 500);
    ctx.strokeStyle = P.sable;
    ctx.lineWidth = 2;
    ctx.strokeRect(28, 28, 344, 444);
  });
}

/** La couleur moyenne du bord de la photo : le bois du cadre, reporté sur ses tranches. */
function edgeColor(img: CanvasImageSource) {
  const c = document.createElement("canvas");
  c.width = c.height = 32;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, 32, 32);
  const d = ctx.getImageData(0, 0, 32, 32).data;
  let r = 0, g = 0, b = 0, n = 0;
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      if (x > 0 && x < 31 && y > 0 && y < 31) continue;
      const i = (y * 32 + x) * 4;
      r += d[i];
      g += d[i + 1];
      b += d[i + 2];
      n++;
    }
  }
  return new THREE.Color().setRGB(r / n / 255, g / n / 255, b / n / 255, THREE.SRGBColorSpace);
}

/** L'ombre douce que le cadre pose sur le mur : c'est elle qui le décolle. */
function shadowTexture() {
  return canvasTexture(256, 320, (ctx) => {
    ctx.filter = "blur(14px)";
    ctx.fillStyle = P.encre;
    ctx.globalAlpha = 0.4;
    ctx.fillRect(40, 40, 176, 240);
  });
}

/** La pancarte de l'entrée : ce que raconte la série, lisible depuis le seuil. */
function signTexture() {
  return canvasTexture(1000, 1330, (ctx) => {
    ctx.fillStyle = P.blanc;
    ctx.fillRect(0, 0, 1000, 1330);
    ctx.fillStyle = P.terre;
    ctx.fillRect(80, 104, 56, 5);
    ctx.fillStyle = P.encre;
    ctx.font = '500 28px "Archivo"';
    ctx.letterSpacing = "5px";
    ctx.fillText(SERIES.eyebrow.toUpperCase(), 156, 116);
    ctx.letterSpacing = "0px";
    ctx.font = '300 100px "Cormorant Garamond"';
    let y = 270;
    for (const l of wrapText(ctx, SERIES.title, 840)) {
      ctx.fillText(l, 80, y);
      y += 102;
    }
    ctx.fillRect(80, y - 20, 840, 2);
    y += 60;
    ctx.font = '400 39px "Archivo"';
    SERIES.body.forEach((para, k) => {
      ctx.fillStyle = k === SERIES.body.length - 1 ? P.cendre : P.encre;
      for (const l of wrapText(ctx, para, 840)) {
        ctx.fillText(l, 80, y);
        y += 56;
      }
      y += 34;
    });
    ctx.fillStyle = P.encre;
    ctx.font = '500 26px "Archivo"';
    ctx.fillText("Rayane Benabdeljalil", 80, 1250);
  });
}

function wallTitle() {
  return canvasTexture(1600, 260, (ctx) => {
    ctx.fillStyle = P.craie;
    ctx.fillRect(0, 0, 1600, 260);
    ctx.fillStyle = P.encre;
    ctx.textAlign = "center";
    ctx.font = '300 130px "Cormorant Garamond"';
    ctx.fillText("Galerie", 800, 150);
    ctx.font = '500 30px "Archivo"';
    ctx.fillText("R A Y A N E   B E N A B D E L J A L I L", 800, 226);
  });
}

function totem(material: THREE.Material) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${TOTEM_VIEWBOX}"><g transform="${TOTEM_TRANSFORM}">${TOTEM_PATHS.map((d) => `<path d="${d}"/>`).join("")}</g></svg>`;
  const data = new SVGLoader().parse(svg);
  const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
  const geo = new THREE.ExtrudeGeometry(shapes, { depth: 1400, bevelEnabled: false, curveSegments: 10 });
  geo.center();
  const mesh = new THREE.Mesh(geo, material);
  const s = 2.3 / 16000;
  mesh.scale.set(s, -s, s);
  return mesh;
}

export function createGallery(canvas: HTMLCanvasElement, artworks: Artwork[], cb: GalleryCallbacks): GalleryHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(P.craie);

  const camera = new THREE.PerspectiveCamera(window.innerWidth < 700 ? 72 : 62, 1, 0.05, 120);
  camera.rotation.order = "YXZ";

  const { depth, slots } = layout(artworks.length);
  const view = { x: 0, z: depth / 2 - 1.6, yaw: 0, pitch: -0.02 };

  // Lumière douce et sans ombre portée : la marque reste à plat.
  scene.add(new THREE.AmbientLight(0xffffff, 1.5));
  const sun = new THREE.DirectionalLight(0xffffff, 1.6);
  sun.position.set(3, 8, 6);
  scene.add(sun);

  const mat = (c: string) => new THREE.MeshLambertMaterial({ color: new THREE.Color(c) });
  const flat = (c: string) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c) });
  // Murs, sol et plafond en aplats : la profondeur vient des filets, comme un dessin au trait.
  const wall = flat(P.craie);
  const room = new THREE.Mesh(new THREE.BoxGeometry(WIDTH, WALL_H, depth), [wall, wall, wall, flat(P.papier), wall, wall]);
  room.material.forEach((m) => (m.side = THREE.BackSide));
  room.position.y = WALL_H / 2;
  scene.add(room);

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(WIDTH - 0.01, WALL_H - 0.01, depth - 0.01)),
    new THREE.LineBasicMaterial({ color: new THREE.Color(P.encre) }),
  );
  edges.position.y = WALL_H / 2;
  scene.add(edges);

  // Une plinthe d'encre au pied des murs, et deux lignes de lumière au plafond.
  const ink = flat(P.encre);
  const filet = (w: number, d: number, x: number, z: number) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, d), ink);
    m.position.set(x, 0.04, z);
    scene.add(m);
  };
  filet(0.012, depth, -WIDTH / 2 + 0.006, 0);
  filet(0.012, depth, WIDTH / 2 - 0.006, 0);
  filet(WIDTH, 0.012, 0, -depth / 2 + 0.006);
  filet(WIDTH, 0.012, 0, depth / 2 - 0.006);
  const light = flat(P.blanc);
  [-3, 3].forEach((x) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, depth - 3), light);
    m.position.set(x, WALL_H - 0.01, 0);
    scene.add(m);
  });

  const colliders: Box[] = [];

  // Le totem, en terre, sur un socle.
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.8, 0.7), mat(P.papier));
  plinth.position.set(0, 0.4, 0);
  scene.add(plinth);
  const t = totem(mat(P.terre));
  t.position.set(0, 0.8 + 1.15, 0);
  scene.add(t);
  colliders.push({ minX: -0.85, maxX: 0.85, minZ: -0.35, maxZ: 0.35 });

  // Deux bancs de part et d'autre du totem, face aux murs. L'allée centrale reste libre.
  [-3.2, 3.2].forEach((x) => {
    const bench = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 2.2), mat(P.encre));
    bench.position.set(x, 0.225, 0);
    scene.add(bench);
    colliders.push({ minX: x - 0.25, maxX: x + 0.25, minZ: -1.1, maxZ: 1.1 });
  });

  // La pancarte, sur pied, un peu à droite de l'entrée et tournée vers le visiteur qui arrive.
  const sign = new THREE.Group();
  sign.position.set(1.1, 0, view.z - 3.4);
  sign.lookAt(view.x, 0, view.z);
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.463, 0.04), [
    ...Array(4).fill(mat(P.blanc)),
    new THREE.MeshBasicMaterial({ map: signTexture() }),
    mat(P.blanc),
  ]);
  board.position.y = 1.44;
  sign.add(board);
  [-0.42, 0.42].forEach((x) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.72, 0.03), ink);
    leg.position.set(x, 0.36, -0.03);
    sign.add(leg);
  });
  scene.add(sign);
  colliders.push({ minX: sign.position.x - 0.55, maxX: sign.position.x + 0.55, minZ: sign.position.z - 0.25, maxZ: sign.position.z + 0.25 });

  const titleTex = wallTitle();
  const title = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 0.78), new THREE.MeshBasicMaterial({ map: titleTex }));
  title.position.set(0, 3.45, -depth / 2 + 0.01);
  scene.add(title);

  // Les œuvres.
  const targets: THREE.Object3D[] = [];
  const centers: { pos: THREE.Vector3; normal: THREE.Vector3; h: number }[] = [];
  const loader = new THREE.TextureLoader();
  // Chaque photo montre l'œuvre dans son cadre : on lui donne l'épaisseur du cadre,
  // décollée du mur, avec l'ombre douce qu'elle y pose.
  const DEPTH = 0.05; // épaisseur du cadre
  const GAP = 0.015; // jour entre le dos du cadre et le mur
  const shadowTex = shadowTexture();

  artworks.forEach((a, i) => {
    const { pos, normal } = slots[i];
    const group = new THREE.Group();
    group.position.copy(pos);
    group.lookAt(pos.clone().add(normal));
    scene.add(group);

    const size = a.size ?? 1.8;
    // Les tranches prennent la lumière (Lambert), la face garde les couleurs exactes de la photo.
    const sideMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(P.sable) });
    const faceMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const art = new THREE.Mesh(new THREE.BoxGeometry(1, 1, DEPTH), [sideMat, sideMat, sideMat, sideMat, faceMat, sideMat]);
    art.position.z = GAP + DEPTH / 2;
    art.userData.index = i;
    // Lumière venue d'en haut à droite : l'ombre tombe un peu en bas à gauche.
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }),
    );
    shadow.position.set(-0.025, -0.05, 0.002);
    group.add(shadow, art);
    targets.push(art);

    const cartel = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.3), new THREE.MeshBasicMaterial({ map: cartelTexture(a, i) }));
    cartel.userData.index = i;
    group.add(cartel);
    targets.push(cartel);

    const center = { pos: pos.clone(), normal: normal.clone(), h: size };
    centers.push(center);

    const fit = (aspect: number) => {
      const w = aspect >= 1 ? size : size * aspect;
      const h = aspect >= 1 ? size / aspect : size;
      art.scale.set(w, h, 1);
      // le flou du canevas déborde du rectangle : la texture est 256×320 pour un rectangle de 176×240
      shadow.scale.set((w * 256) / 176, (h * 320) / 240, 1);
      cartel.position.set(w / 2 + 0.45, 1.25 - HANG, 0.012);
      center.h = h;
    };

    if (a.src) {
      fit(4 / 5);
      loader.load(a.src, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        faceMat.map = tex;
        faceMat.needsUpdate = true;
        const img = tex.image as HTMLImageElement;
        sideMat.color.copy(edgeColor(img));
        fit(img.width / img.height);
      });
    } else {
      faceMat.map = blankTexture();
      fit(4 / 5);
    }
  });

  // Déplacements.
  const keys = new Set<string>();
  const stick = { x: 0, y: 0 };
  const vel = new THREE.Vector2();
  let active = false;
  let focused: number | null = null;
  let hovered: number | null = null;
  const seen = new Set<number>();
  const ray = new THREE.Raycaster();
  ray.far = 9;

  const onKey = (e: KeyboardEvent) => {
    if (!active || focused !== null) return;
    if (["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "ShiftLeft", "ShiftRight"].includes(e.code)) {
      if (e.type === "keydown") keys.add(e.code);
      else keys.delete(e.code);
      if (e.code.startsWith("Arrow")) e.preventDefault();
    }
  };
  const clearKeys = () => keys.clear();
  window.addEventListener("keydown", onKey);
  window.addEventListener("keyup", onKey);
  window.addEventListener("blur", clearKeys);

  const halfW = WIDTH / 2 - 0.6;
  const halfD = depth / 2 - 0.6;
  const collide = () => {
    view.x = THREE.MathUtils.clamp(view.x, -halfW, halfW);
    view.z = THREE.MathUtils.clamp(view.z, -halfD, halfD);
    for (const b of colliders) {
      const cx = THREE.MathUtils.clamp(view.x, b.minX, b.maxX);
      const cz = THREE.MathUtils.clamp(view.z, b.minZ, b.maxZ);
      const dx = view.x - cx;
      const dz = view.z - cz;
      const d = Math.hypot(dx, dz);
      if (d < RADIUS) {
        if (d === 0) view.z = b.maxZ + RADIUS;
        else {
          view.x = cx + (dx / d) * RADIUS;
          view.z = cz + (dz / d) * RADIUS;
        }
      }
    }
  };

  const size = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(size);
  ro.observe(canvas);
  size();

  const forward = new THREE.Vector3();
  const toArt = new THREE.Vector3();
  const center2 = new THREE.Vector2(0, 0);

  const pickAt = (ndc: THREE.Vector2) => {
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(targets, false)[0];
    return hit ? (hit.object.userData.index as number) : null;
  };

  let last = performance.now();
  let raf = 0;
  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (document.hidden) return;

    if (active && focused === null) {
      let mx = stick.x;
      let mz = stick.y;
      if (keys.has("KeyW") || keys.has("ArrowUp")) mz += 1;
      if (keys.has("KeyS") || keys.has("ArrowDown")) mz -= 1;
      if (keys.has("KeyA")) mx -= 1;
      if (keys.has("KeyD")) mx += 1;
      // les flèches gauche et droite tournent : la visite se fait aussi au clavier seul
      if (keys.has("ArrowLeft")) view.yaw += dt * 1.8;
      if (keys.has("ArrowRight")) view.yaw -= dt * 1.8;
      const len = Math.hypot(mx, mz);
      if (len > 1) {
        mx /= len;
        mz /= len;
      }
      const speed = keys.has("ShiftLeft") || keys.has("ShiftRight") ? SPEED * 1.8 : SPEED;
      const s = Math.sin(view.yaw);
      const c = Math.cos(view.yaw);
      const tx = (-s * mz + c * mx) * speed;
      const tz = (-c * mz - s * mx) * speed;
      vel.x += (tx - vel.x) * Math.min(1, dt * 10);
      vel.y += (tz - vel.y) * Math.min(1, dt * 10);
      view.x += vel.x * dt;
      view.z += vel.y * dt;
      collide();
    }

    camera.position.set(view.x, EYE, view.z);
    camera.rotation.set(view.pitch, view.yaw, 0);
    camera.updateMatrixWorld();

    if (active) {
      const h = focused === null ? pickAt(center2) : null;
      if (h !== hovered) {
        hovered = h;
        cb.onHover(h);
      }
      camera.getWorldDirection(forward);
      centers.forEach((c, i) => {
        if (seen.has(i)) return;
        toArt.set(c.pos.x - view.x, c.pos.y - EYE, c.pos.z - view.z);
        const d = toArt.length();
        if (d < 5.5 && toArt.normalize().dot(forward) > 0.88) {
          seen.add(i);
          cb.onSeen(i);
        }
      });
    }

    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(tick);

  const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

  return {
    setActive(on) {
      active = on;
      if (!on) {
        keys.clear();
        stick.x = stick.y = 0;
      }
    },
    look(dx, dy, k = 0.0022) {
      if (focused !== null) return;
      // certains navigateurs envoient un saut énorme au verrouillage de la souris : on l'ignore
      if (Math.abs(dx) > 250 || Math.abs(dy) > 250) return;
      view.yaw -= dx * k;
      view.pitch = THREE.MathUtils.clamp(view.pitch - dy * k, -1.1, 1.1);
    },
    setStick(x, y) {
      stick.x = x;
      stick.y = y;
    },
    pick(clientX, clientY) {
      if (clientX === undefined || clientY === undefined) return pickAt(center2);
      const r = canvas.getBoundingClientRect();
      return pickAt(new THREE.Vector2(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1));
    },
    focus(i, instant = false) {
      const c = centers[i];
      if (!c) return;
      focused = i;
      keys.clear();
      vel.set(0, 0);
      // Face à l'œuvre, assez loin pour voir le tableau et son cartel en entier.
      // Écran large : le tableau à droite, le panneau à gauche. Écran étroit : le tableau en haut, le panneau en bas.
      const wide = camera.aspect >= 1;
      const fovV = THREE.MathUtils.degToRad(camera.fov);
      const fit = (c.h + 0.5) / 2 / Math.tan(fovV / 2);
      const fitW = (c.h + 1.4) / 2 / Math.tan(fovV / 2) / camera.aspect;
      const dist = Math.max(2.2, wide ? fit * 1.15 : Math.max(fit, fitW) * 1.25);
      const side = wide ? -0.2 * dist : 0.35;
      const tx = c.pos.x + c.normal.x * dist + c.normal.z * side;
      const tz = c.pos.z + c.normal.z * dist - c.normal.x * side;
      const targetYaw = view.yaw + wrap(Math.atan2(c.normal.x, c.normal.z) - view.yaw);
      const targetPitch = wide ? 0.02 : -0.2;
      gsap.killTweensOf(view);
      const to = { x: tx, z: tz, yaw: targetYaw, pitch: targetPitch };
      if (instant) Object.assign(view, to);
      else gsap.to(view, { ...to, duration: 1, ease: "power2.inOut" });
      if (!seen.has(i)) {
        seen.add(i);
        cb.onSeen(i);
      }
    },
    unfocus() {
      focused = null;
    },
    dispose() {
      cancelAnimationFrame(raf);
      gsap.killTweensOf(view);
      ro.disconnect();
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
      window.removeEventListener("blur", clearKeys);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
        mats.forEach((mm) => {
          const map = (mm as THREE.MeshBasicMaterial).map;
          if (map) map.dispose();
          mm.dispose();
        });
      });
      renderer.dispose();
    },
  };
}
