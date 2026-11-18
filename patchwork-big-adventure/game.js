(() => {
  'use strict';

  // ============================================================================
  // 1. CONSTANTS, PALETTES, NOISE & SAVE DATA
  // ============================================================================
  const SAVE_KEY = 'patchworkAdventureSave_v1';
  const CHUNK_SIZE = 90;
  const WORLD_GRAVITY = -28;

  const YARN_PALETTE = [
    { id: 'terracotta', name: 'Terracotta Wool', hex: '#d97248', stitch: '#f7c59f' },
    { id: 'mint',       name: 'Meadow Mint',     hex: '#36c795', stitch: '#c8ffea' },
    { id: 'berry',      name: 'Berry Pink',      hex: '#eb527a', stitch: '#ffd0de' },
    { id: 'sky',        name: 'Sky Cyan',        hex: '#38aee6', stitch: '#ccf1ff' },
    { id: 'honey',      name: 'Honey Gold',      hex: '#f2b129', stitch: '#fff0b8' },
    { id: 'lavender',   name: 'Lavender Haze',   hex: '#7c58e6', stitch: '#e2d8ff' },
    { id: 'cocoa',      name: 'Cocoa Brown',     hex: '#7d5238', stitch: '#d9b59a' },
    { id: 'cream',      name: 'Snow Cream',      hex: '#f5ebd6', stitch: '#ffffff' }
  ];

  const HAT_CATALOG = [
    { id: 'none',      name: 'No Hat',                color: '#e5d4b8' },
    { id: 'bunny',     name: 'Floppy Bunny Ears',     color: '#ffb7c5' },
    { id: 'knight',    name: 'Cardboard Knight Helm', color: '#c99763' },
    { id: 'dino',      name: 'Dino Hood',             color: '#46c77c' },
    { id: 'astro',     name: 'Astronaut Bubble',      color: '#9ee8ff' },
    { id: 'crown',     name: 'Royal Paper Crown',     color: '#ffd43b' },
    { id: 'fox',       name: 'Fox Ears',              color: '#f27830' },
    { id: 'propeller', name: 'Propeller Beanie',      color: '#ff4d6d' },
    { id: 'wizard',    name: 'Wizard Felt Cone',      color: '#6b4de6' }
  ].slice(1); // Exact 8 3D Hats

  const OUTFIT_CATALOG = [
    { id: 'vest',    name: 'Zipper Vest',       color: '#3498db' },
    { id: 'cape',    name: 'Superhero Cape',    color: '#e63946' },
    { id: 'pack',    name: 'Explorer Pack',     color: '#8c6239' },
    { id: 'scarf',   name: 'Rainbow Scarf',     color: '#ff9f1c' },
    { id: 'bee',     name: 'Bumblebee Stripes', color: '#ffd124' },
    { id: 'dragon',  name: 'Dragon Wings',      color: '#38b000' }
  ];

  const CORE_BIOMES = [
    { id: 'meadows',   name: 'Soaring Stitching Meadows',          x: 0,    z: 0,    color: '#289446', spawn: [0, 3, 12] },
    { id: 'cardboard', name: 'Cardboard Castle Peaks',             x: 0,    z: -130, color: '#bf8549', spawn: [0, 4, -108] },
    { id: 'bay',       name: 'Button Bay & Sponge Reef',           x: 130,  z: 0,    color: '#2dc2cc', spawn: [108, 4, 0] },
    { id: 'clockwork', name: 'Velvet Cloudworks & Clockwork Loft', x: -130, z: 0,    color: '#5e40b8', spawn: [-108, 4, 0] },
    { id: 'origami',   name: 'Origami Canyon & Confetti Peak',     x: 0,    z: 130,  color: '#de6c35', spawn: [0, 4, 108] }
  ];

  const FRONTIER_THEMES = [
    { name: 'Felt Clover',      top: '#2b9e4b', side: '#5b402b', stitch: '#ffffff', accent: '#ffcf48', hasGrass: true,  grassA: 0x38b856, grassB: 0xbde044 },
    { name: 'Lavender Velvet',  top: '#6e4bc9', side: '#48346d', stitch: '#f7ecff', accent: '#6ef3ff', hasGrass: true,  grassA: 0x7b5ee0, grassB: 0x52e0d4 },
    { name: 'Terracotta Paper', top: '#d66b3e', side: '#7e472d', stitch: '#fff0db', accent: '#4de3c1', hasGrass: true,  grassA: 0xd98a36, grassB: 0xf0be4d },
    { name: 'Ocean Sponge',     top: '#24b5b2', side: '#2b5e6b', stitch: '#e4ffff', accent: '#ff7096', hasGrass: true,  grassA: 0x2ec7a8, grassB: 0x8ef2d2 },
    { name: 'Snow Knit',        top: '#8ac2f5', side: '#4b688a', stitch: '#ffffff', accent: '#ff5d8f', hasGrass: false, grassA: 0x9fd3ff, grassB: 0xffffff }
  ];

  const PIANO_NOTES = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77, 1046.5];
  const PIANO_COLORS = ['#f0414b', '#f27c2e', '#f5b718', '#6cb81b', '#22b07d', '#1676bd', '#654296', '#eb4d8d'];

  // Deterministic PRNG & FBM Noise
  function mulberry32(a) {
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hash2D(ix, iz) {
    let n = Math.imul(ix, 374761393) + Math.imul(iz, 668265263);
    n = (n ^ (n >>> 13)) >>> 0;
    n = Math.imul(n, 1274126177) >>> 0;
    return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
  }

  function hash3D(ix, iy, iz) {
    let n = Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + Math.imul(iz, 2147483647);
    n = (n ^ (n >>> 13)) >>> 0;
    n = Math.imul(n, 1274126177) >>> 0;
    return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
  }

  function smoothstep(t) {
    return t * t * (3 - 2 * t);
  }

  function noise2D(x, z) {
    const ix = Math.floor(x);
    const iz = Math.floor(z);
    const fx = smoothstep(x - ix);
    const fz = smoothstep(z - iz);
    const a = hash2D(ix, iz);
    const b = hash2D(ix + 1, iz);
    const c = hash2D(ix, iz + 1);
    const d = hash2D(ix + 1, iz + 1);
    return (a + (b - a) * fx + (c - a) * fz + (a - b - c + d) * fx * fz) * 2 - 1;
  }

  function fbm2D(x, z, octaves = 3) {
    let val = 0;
    let amp = 0.5;
    let freq = 1;
    let norm = 0;
    for (let i = 0; i < octaves; i++) {
      val += amp * noise2D(x * freq, z * freq);
      norm += amp;
      amp *= 0.5;
      freq *= 2.03;
    }
    return val / (norm || 1);
  }

  function noise3D(x, y, z) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const iz = Math.floor(z);
    const fx = smoothstep(x - ix);
    const fy = smoothstep(y - iy);
    const fz = smoothstep(z - iz);

    const c000 = hash3D(ix, iy, iz);
    const c100 = hash3D(ix + 1, iy, iz);
    const c010 = hash3D(ix, iy + 1, iz);
    const c110 = hash3D(ix + 1, iy + 1, iz);
    const c001 = hash3D(ix, iy, iz + 1);
    const c101 = hash3D(ix + 1, iy, iz + 1);
    const c011 = hash3D(ix, iy + 1, iz + 1);
    const c111 = hash3D(ix + 1, iy + 1, iz + 1);

    const x00 = c000 + (c100 - c000) * fx;
    const x10 = c010 + (c110 - c010) * fx;
    const x01 = c001 + (c101 - c001) * fx;
    const x11 = c011 + (c111 - c011) * fx;
    const y0 = x00 + (x10 - x00) * fy;
    const y1 = x01 + (x11 - x01) * fy;
    return (y0 + (y1 - y0) * fz) * 2 - 1;
  }

  function hashChunk(cx, cz) {
    return ((cx * 73856093) ^ (cz * 19349663) ^ 0x9e3779b9) >>> 0;
  }

  function frontierIndexToChunk(index) {
    let idx = 0;
    for (let ring = 2; ring < 80; ring++) {
      for (let z = -ring; z <= ring; z++) {
        for (let x = -ring; x <= ring; x++) {
          if (Math.max(Math.abs(x), Math.abs(z)) !== ring) continue;
          idx++;
          if (idx === index) return { cx: x, cz: z };
        }
      }
    }
    return { cx: 2, cz: 0 };
  }

  function chunkToFrontierIndex(cx, cz) {
    const ring = Math.max(Math.abs(cx), Math.abs(cz));
    if (ring <= 1) return 0;
    let idx = 0;
    for (let r = 2; r < ring; r++) idx += 8 * r;
    for (let z = -ring; z <= ring; z++) {
      for (let x = -ring; x <= ring; x++) {
        if (Math.max(Math.abs(x), Math.abs(z)) !== ring) continue;
        idx++;
        if (x === cx && z === cz) return idx;
      }
    }
    return 1;
  }

  function chunkWorldCenter(cx, cz) {
    let wx = cx * CHUNK_SIZE;
    let wz = cz * CHUNK_SIZE;
    if (Math.abs(cx) === 2 && cz === 0) wx += Math.sign(cx) * 24;
    if (Math.abs(cz) === 2 && cx === 0) wz += Math.sign(cz) * 24;
    return { x: wx, z: wz };
  }

  // ============================================================================
  // 2. PROCEDURAL AUDIO ENGINE
  // ============================================================================
  class CraftAudio {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.bgmTimer = 0;
      this.bgmStep = 0;
      this.melody = [523.25, 659.25, 783.99, 659.25, 880, 783.99, 659.25, 587.33];
    }

    unlock() {
      if (!this.enabled) return;
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        try {
          this.ctx = new AC();
        } catch (_) {
          this.ctx = null;
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }

    tone(freq, dur = 0.14, type = 'triangle', vol = 0.09, slideTo = null) {
      if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), now + dur);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + dur + 0.02);
      } catch (_) {}
    }

    playPiano(noteIdx) {
      const f = PIANO_NOTES[noteIdx % PIANO_NOTES.length];
      this.tone(f, 0.34, 'triangle', 0.14);
      this.tone(f * 2, 0.2, 'sine', 0.05);
    }

    sfx(kind) {
      switch (kind) {
        case 'jump':      this.tone(330, 0.16, 'sine', 0.11, 560); break;
        case 'flutter':   this.tone(420, 0.07, 'triangle', 0.06, 510); break;
        case 'slap':      this.tone(240, 0.11, 'sawtooth', 0.07, 130); break;
        case 'pound':     this.tone(150, 0.22, 'triangle', 0.14, 55); break;
        case 'bell':      this.tone(880, 0.14, 'sine', 0.1, 1320); break;
        case 'orb':
          this.tone(523.25, 0.28, 'triangle', 0.12);
          setTimeout(() => this.tone(659.25, 0.28, 'triangle', 0.12), 70);
          setTimeout(() => this.tone(783.99, 0.38, 'sine', 0.13), 140);
          break;
        case 'bounce':    this.tone(220, 0.24, 'sine', 0.13, 680); break;
        case 'grapple':   this.tone(580, 0.1, 'square', 0.06, 760); break;
        case 'boomerang': this.tone(390, 0.18, 'triangle', 0.08, 620); break;
        case 'jet':       this.tone(260, 0.18, 'sawtooth', 0.06, 480); break;
        case 'box':       this.tone(190, 0.14, 'square', 0.09, 95); break;
        case 'flag':
          [523.25, 659.25, 783.99, 1046.5].forEach((n, i) => {
            setTimeout(() => this.tone(n, 0.25, 'triangle', 0.12), i * 85);
          });
          break;
        case 'bubble':    this.tone(320, 0.22, 'sine', 0.09, 640); break;
        case 'critter':   this.tone(720, 0.16, 'sine', 0.11, 980); break;
      }
    }

    update(dt) {
      if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
      this.bgmTimer += dt;
      if (this.bgmTimer >= 0.72) {
        this.bgmTimer = 0;
        const n = this.melody[this.bgmStep % this.melody.length];
        this.bgmStep++;
        this.tone(n * 0.5, 0.35, 'sine', 0.028);
      }
    }
  }

  // ============================================================================
  // 3. SCULPTED CRAFT GEOMETRY KIT (ZERO RAW BOXES OR CONE TREES!)
  // ============================================================================
  function createRoundedBoxGeometry(w, h, d, segs = 3, radius = 0.14) {
    const r = Math.max(0.001, Math.min(radius, w * 0.44, h * 0.44, d * 0.44));
    const n = Math.max(4, segs * 2 + 2);
    const geo = new THREE.BoxGeometry(1, 1, 1, n, n, n);
    const pos = geo.attributes.position;
    const norm = geo.attributes.normal;

    const hx = w * 0.5;
    const hy = h * 0.5;
    const hz = d * 0.5;
    const ix = hx - r;
    const iy = hy - r;
    const iz = hz - r;
    const k = segs / n;

    const remap = (u, half, inner) => {
      const au = Math.abs(u);
      const su = u < 0 ? -1 : 1;
      if (au <= 0.5 - k + 1e-6) {
        return (u / Math.max(1e-5, 0.5 - k)) * inner;
      }
      const frac = Math.min(1, (au - (0.5 - k)) / Math.max(1e-5, k));
      return su * (inner + frac * r);
    };

    for (let i = 0; i < pos.count; i++) {
      const rx = remap(pos.getX(i), hx, ix);
      const ry = remap(pos.getY(i), hy, iy);
      const rz = remap(pos.getZ(i), hz, iz);

      const cx = Math.max(-ix, Math.min(ix, rx));
      const cy = Math.max(-iy, Math.min(iy, ry));
      const cz = Math.max(-iz, Math.min(iz, rz));

      let dx = rx - cx;
      let dy = ry - cy;
      let dz = rz - cz;
      const len = Math.hypot(dx, dy, dz);
      if (len > 1e-6) {
        dx /= len;
        dy /= len;
        dz /= len;
        pos.setXYZ(i, cx + dx * r, cy + dy * r, cz + dz * r);
        norm.setXYZ(i, dx, dy, dz);
      } else {
        pos.setXYZ(i, rx, ry, rz);
      }
    }
    pos.needsUpdate = true;
    norm.needsUpdate = true;
    return geo;
  }

  function islandRadiusAt(angle, baseRadius, seed = 0) {
    const wave = 1.0
      + 0.065 * Math.sin(angle * 3 + seed * 1.7)
      + 0.042 * Math.cos(angle * 5 - seed * 2.3)
      + 0.028 * fbm2D(Math.cos(angle) * 2.1 + seed, Math.sin(angle) * 2.1 - seed, 2);
    return baseRadius * wave;
  }

  function islandSurfaceOffset(dx, dz, baseRadius, seed = 0, contourAmp = 0.35) {
    if (contourAmp <= 0.001) return 0;
    const ang = Math.atan2(dz, dx);
    const maxR = islandRadiusAt(ang, baseRadius, seed);
    const t = Math.min(1, Math.hypot(dx, dz) / Math.max(0.1, maxR));
    const edgeFade = 1 - Math.pow(Math.max(0, (t - 0.12) / 0.88), 2.1);
    const n = 0.55 * Math.sin(dx * 0.13 + seed) * Math.cos(dz * 0.13 - seed * 0.6)
      + 0.45 * fbm2D(dx * 0.075 + seed * 2.1, dz * 0.075 - seed * 1.4, 2);
    return n * contourAmp * Math.max(0, edgeFade);
  }

  // Sculpted felt-turf island cap with contoured top, pillowy bevel rim & skirt
  function createIslandTopGeo(baseRadius, rimHeight = 1.55, seed = 0, contourAmp = 0.35) {
    const radSegs = 40;
    const rings = [0, 0.22, 0.45, 0.68, 0.86, 0.96, 1.0, 1.015, 0.995];
    const ringCount = rings.length;
    const positions = [];
    const uvs = [];
    const colors = [];
    const indices = [];

    for (let rIdx = 0; rIdx < ringCount; rIdx++) {
      const t = rings[rIdx];
      for (let s = 0; s <= radSegs; s++) {
        const u = s / radSegs;
        const ang = u * Math.PI * 2;
        const edgeR = islandRadiusAt(ang, baseRadius, seed);
        const rr = edgeR * t;
        const px = Math.cos(ang) * rr;
        const pz = Math.sin(ang) * rr;

        let py = 0;
        let ao = 1.0;
        if (rIdx <= 5) {
          py = islandSurfaceOffset(px, pz, baseRadius, seed, contourAmp);
          ao = rIdx === 5 ? 0.95 : 1.0;
        } else if (rIdx === 6) {
          py = -0.22;
          ao = 0.88;
        } else if (rIdx === 7) {
          py = -rimHeight * 0.55;
          ao = 0.76;
        } else {
          py = -rimHeight;
          ao = 0.62;
        }

        positions.push(px, py, pz);
        uvs.push(0.5 + (px / (baseRadius * 2.2)), 0.5 + (pz / (baseRadius * 2.2)));
        colors.push(ao, ao * 0.99, ao * 0.96);
      }
    }

    const stride = radSegs + 1;
    for (let rIdx = 0; rIdx < ringCount - 1; rIdx++) {
      for (let s = 0; s < radSegs; s++) {
        const a = rIdx * stride + s;
        const b = a + stride;
        const c = a + 1;
        const d = b + 1;
        indices.push(a, c, b);
        indices.push(c, d, b);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }

  // Sculpted tapered rocky/quilted craft underbelly with vertex-baked AO darkening toward tip
  function createIslandUnderbellyGeo(baseRadius, depth = 7.5, seed = 0, rimStartY = -1.35) {
    const radSegs = 36;
    const vRings = 11;
    const positions = [];
    const uvs = [];
    const colors = [];
    const indices = [];

    for (let v = 0; v <= vRings; v++) {
      const vt = v / vRings; // 0 = rim, 1 = bottom tip
      const taper = Math.pow(1 - vt, 0.78);
      const yBase = rimStartY - Math.pow(vt, 1.08) * depth;

      for (let s = 0; s <= radSegs; s++) {
        const u = s / radSegs;
        const ang = u * Math.PI * 2;
        const edgeR = islandRadiusAt(ang, baseRadius, seed) * 0.985;

        // Faceted rock & patchwork folds on mid/lower rings
        const nVal = fbm2D(Math.cos(ang) * 2.4 + vt * 3.1 + seed, Math.sin(ang) * 2.4 - vt * 2.7 - seed, 3);
        const fold = Math.round(nVal * 5.0) / 5.0; // terraced craft-carved look
        const radialMod = vt < 0.08 ? 1.0 : (1.0 + fold * 0.24 * Math.sin(vt * Math.PI));
        const r = Math.max(0.08, edgeR * taper * radialMod);

        const px = Math.cos(ang) * r;
        const pz = Math.sin(ang) * r;
        const py = yBase + (vt > 0.08 && vt < 0.96 ? fold * 0.55 : 0);

        // Vertex-baked AO: darker toward bottom tip + crevices
        const ao = Math.max(0.24, 0.92 - vt * 0.62 + fold * 0.12);
        positions.push(px, py, pz);
        uvs.push(u * 3, vt * 2);
        colors.push(ao, ao * 0.95, ao * 0.90);
      }
    }

    const stride = radSegs + 1;
    for (let v = 0; v < vRings; v++) {
      for (let s = 0; s < radSegs; s++) {
        const a = v * stride + s;
        const b = a + stride;
        const c = a + 1;
        const d = b + 1;
        indices.push(a, b, c);
        indices.push(c, b, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }

  // Curved tapered 3-segment grass blade geometry (root at y=0, tip at y=0.50)
  function createGrassBladeGeometry() {
    const segs = 3;
    const positions = [];
    const normals = [];
    const uvs = [];
    const colors = [];
    const indices = [];

    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const halfW = 0.042 * (1 - t * 0.90);
      const y = t * 0.50;
      const zCurve = t * t * 0.11;
      const shade = 0.42 + 0.58 * t;

      if (i === segs) {
        positions.push(0, y, zCurve);
        normals.push(0, 0.76, 0.65);
        uvs.push(0.5, 1.0);
        colors.push(shade, shade * 1.02, shade * 0.92);
      } else {
        positions.push(-halfW, y, zCurve);
        positions.push(halfW, y, zCurve);
        normals.push(-0.15, 0.72, 0.68);
        normals.push(0.15, 0.72, 0.68);
        uvs.push(0, t);
        uvs.push(1, t);
        colors.push(shade, shade * 1.02, shade * 0.92);
        colors.push(shade, shade * 1.02, shade * 0.92);
      }
    }
    indices.push(0, 1, 2, 1, 3, 2);
    indices.push(2, 3, 4, 3, 5, 4);
    indices.push(4, 5, 6);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.setIndex(indices);
    return geo;
  }

  // Noise-sculpted puffy felt foliage lobe (for organic craft trees & shrubs)
  function createNoiseCanopyGeo(radius = 1.0, seed = 0) {
    const geo = new THREE.IcosahedronGeometry(radius, 2);
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);
      const len = Math.max(1e-5, Math.hypot(vx, vy, vz));
      const nx = vx / len;
      const ny = vy / len;
      const nz = vz / len;
      const disp = 1.0 + 0.18 * noise3D(nx * 2.2 + seed, ny * 2.2 - seed, nz * 2.2 + seed * 0.5);
      pos.setXYZ(i, vx * disp, vy * disp * 0.88, vz * disp);
      // Soft underside AO
      const ao = Math.max(0.58, Math.min(1.06, 0.82 + ny * 0.26));
      colors[i * 3] = ao;
      colors[i * 3 + 1] = ao * 0.99;
      colors[i * 3 + 2] = ao * 0.95;
    }
    pos.needsUpdate = true;
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }

  // Sculpted LatheGeometry hot-air yarn balloon envelope
  function createBalloonEnvelopeGeo() {
    const pts = [];
    const steps = 16;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps; // 0 = throat, 1 = crown
      const ang = t * Math.PI * 0.92;
      const r = 0.62 + Math.sin(ang) * 2.25 * Math.pow(t, 0.35);
      const y = -2.4 + t * 5.2;
      pts.push(new THREE.Vector2(Math.max(0.01, r), y));
    }
    pts.push(new THREE.Vector2(0.001, 2.88));
    const geo = new THREE.LatheGeometry(pts, 24);
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const goreColors = [
      [1.0, 0.42, 0.46],
      [1.0, 0.85, 0.30],
      [0.24, 0.72, 0.94],
      [1.0, 0.96, 0.86]
    ];
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const gore = Math.floor(((Math.atan2(z, x) + Math.PI) / (Math.PI * 2)) * 12) % 4;
      const gc = goreColors[gore];
      colors[i * 3] = gc[0];
      colors[i * 3 + 1] = gc[1];
      colors[i * 3 + 2] = gc[2];
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }

  // Sculpted LatheGeometry Collectabell
  function createBellGeometry() {
    const pts = [
      new THREE.Vector2(0.01, 0.34),
      new THREE.Vector2(0.14, 0.32),
      new THREE.Vector2(0.22, 0.22),
      new THREE.Vector2(0.25, 0.04),
      new THREE.Vector2(0.32, -0.14),
      new THREE.Vector2(0.36, -0.22),
      new THREE.Vector2(0.26, -0.24)
    ];
    return new THREE.LatheGeometry(pts, 16);
  }

  // ============================================================================
  // 4. 4-CHANNEL 512x512 PBR TEXTURES, STUDIO IBL & GLSL SHADERS
  // ============================================================================
  const OutputFXAAShader = {
    uniforms: {
      tDiffuse: { value: null },
      resolution: { value: new THREE.Vector2(1 / 1280, 1 / 720) },
      exposure: { value: 1.0 },
      vignetteStrength: { value: 0.20 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform vec2 resolution;
      uniform float exposure;
      uniform float vignetteStrength;
      varying vec2 vUv;

      vec3 RRTAndODTFit(vec3 v) {
        vec3 a = v * (v + 0.0245786) - 0.000090537;
        vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
        return a / b;
      }

      vec3 ACESFilmic(vec3 color) {
        mat3 ACESInputMat = mat3(
          vec3(0.59719, 0.07600, 0.02840),
          vec3(0.35458, 0.90834, 0.13383),
          vec3(0.04823, 0.01566, 0.83777)
        );
        mat3 ACESOutputMat = mat3(
          vec3(1.60475, -0.10208, -0.00327),
          vec3(-0.53108, 1.10813, -0.07276),
          vec3(-0.07367, -0.00605, 1.07602)
        );
        color = ACESInputMat * color;
        color = RRTAndODTFit(color);
        color = ACESOutputMat * color;
        return clamp(color, 0.0, 1.0);
      }

      float luma(vec3 c) {
        return dot(c, vec3(0.299, 0.587, 0.114));
      }

      void main() {
        vec2 texel = resolution;
        vec3 rgbNW = texture2D(tDiffuse, vUv + vec2(-1.0, -1.0) * texel).rgb;
        vec3 rgbNE = texture2D(tDiffuse, vUv + vec2( 1.0, -1.0) * texel).rgb;
        vec3 rgbSW = texture2D(tDiffuse, vUv + vec2(-1.0,  1.0) * texel).rgb;
        vec3 rgbSE = texture2D(tDiffuse, vUv + vec2( 1.0,  1.0) * texel).rgb;
        vec3 rgbM  = texture2D(tDiffuse, vUv).rgb;

        float lumaNW = luma(rgbNW);
        float lumaNE = luma(rgbNE);
        float lumaSW = luma(rgbSW);
        float lumaSE = luma(rgbSE);
        float lumaM  = luma(rgbM);

        float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
        float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));

        vec2 dir;
        dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
        dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));

        float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) * 0.03125, 0.0078125);
        float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);
        dir = clamp(dir * rcpDirMin, vec2(-8.0), vec2(8.0)) * texel;

        vec3 rgbA = 0.5 * (
          texture2D(tDiffuse, vUv + dir * (1.0 / 3.0 - 0.5)).rgb +
          texture2D(tDiffuse, vUv + dir * (2.0 / 3.0 - 0.5)).rgb
        );
        vec3 rgbB = rgbA * 0.5 + 0.25 * (
          texture2D(tDiffuse, vUv + dir * -0.5).rgb +
          texture2D(tDiffuse, vUv + dir *  0.5).rgb
        );
        float lumaB = luma(rgbB);
        vec3 aaColor = (lumaB < lumaMin || lumaB > lumaMax) ? rgbA : rgbB;

        // Warm subtle diorama vignette
        vec2 centered = (vUv - 0.5) * vec2(1.0, 0.88);
        float vig = smoothstep(0.36, 0.92, length(centered));
        aaColor *= mix(vec3(1.0), vec3(0.94, 0.87, 0.80), vig * vignetteStrength);

        // ACESFilmic HDR ToneMapping + Linear-to-sRGB gamma
        vec3 mapped = ACESFilmic(aaColor * exposure);
        vec3 srgb = mix(
          mapped * 12.92,
          1.055 * pow(max(mapped, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055,
          step(vec3(0.0031308), mapped)
        );
        gl_FragColor = vec4(clamp(srgb, 0.0, 1.0), 1.0);
      }
    `
  };

  function createStylizedWaterMaterial(options = {}) {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: options.depthWrite !== undefined ? options.depthWrite : false,
      uniforms: {
        uTime: { value: 0 },
        uSunDir: { value: new THREE.Vector3(0.45, 0.78, 0.42).normalize() },
        uShallowColor: { value: new THREE.Color(options.shallowColor || 0x35e6de) },
        uDeepColor: { value: new THREE.Color(options.deepColor || 0x1068a8) },
        uFoamColor: { value: new THREE.Color(options.foamColor || 0xfaffff) },
        uFogColor: { value: new THREE.Color(0x95dcff) },
        uFogNear: { value: options.fogNear || 155.0 },
        uFogFar: { value: options.fogFar || 440.0 },
        uCenterXZ: { value: new THREE.Vector2(options.centerX || 0, options.centerZ || 0) },
        uEdgeFadeRadius: { value: options.edgeFadeRadius || 0.0 },
        uOpacity: { value: options.opacity !== undefined ? options.opacity : 0.90 },
        uIsland0: { value: options.island0 || new THREE.Vector4(0, 0, 0, 0) },
        uIsland1: { value: options.island1 || new THREE.Vector4(0, 0, 0, 0) },
        uIsland2: { value: options.island2 || new THREE.Vector4(0, 0, 0, 0) },
        uIsland3: { value: options.island3 || new THREE.Vector4(0, 0, 0, 0) }
      },
      vertexShader: `
        uniform float uTime;
        varying vec3 vWorldPos;
        varying float vViewDist;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          float ripple = sin(wp.x * 0.28 + uTime * 1.6) * cos(wp.z * 0.25 - uTime * 1.3) * 0.14;
          wp.y += ripple;
          vWorldPos = wp.xyz;
          vec4 mv = viewMatrix * wp;
          vViewDist = -mv.z;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uSunDir;
        uniform vec3 uShallowColor;
        uniform vec3 uDeepColor;
        uniform vec3 uFoamColor;
        uniform vec3 uFogColor;
        uniform float uFogNear;
        uniform float uFogFar;
        uniform vec2 uCenterXZ;
        uniform float uEdgeFadeRadius;
        uniform float uOpacity;
        uniform vec4 uIsland0;
        uniform vec4 uIsland1;
        uniform vec4 uIsland2;
        uniform vec4 uIsland3;

        varying vec3 vWorldPos;
        varying float vViewDist;

        float shoreDist(vec2 p, vec4 isl) {
          if (isl.w < 0.5) return 999.0;
          return length(p - isl.xy) - isl.z;
        }

        void main() {
          vec2 p = vWorldPos.xz;

          // Dual scrolling sine ripples
          float w1 = sin(p.x * 0.42 + uTime * 1.45) * cos(p.y * 0.36 - uTime * 1.15);
          float w2 = sin((p.x + p.y) * 0.31 - uTime * 1.85) * 0.65;
          float waveH = w1 + w2;

          vec3 nrm = normalize(vec3(
            -0.22 * cos(p.x * 0.42 + uTime * 1.45) - 0.14 * cos((p.x + p.y) * 0.31 - uTime * 1.85),
            1.0,
            0.20 * sin(p.y * 0.36 - uTime * 1.15) - 0.14 * cos((p.x + p.y) * 0.31 - uTime * 1.85)
          ));

          vec3 viewDir = normalize(cameraPosition - vWorldPos);
          float fresnel = pow(1.0 - max(dot(nrm, viewDir), 0.0), 2.6);

          float d0 = shoreDist(p, uIsland0);
          float d1 = shoreDist(p, uIsland1);
          float d2 = shoreDist(p, uIsland2);
          float d3 = shoreDist(p, uIsland3);
          float minShore = min(min(d0, d1), min(d2, d3));

          float shallowBand = 1.0 - smoothstep(0.0, 14.0, minShore);
          vec3 waterCol = mix(uDeepColor, uShallowColor, clamp(shallowBand * 0.78 + (1.0 - fresnel) * 0.25 + waveH * 0.06, 0.0, 1.0));
          waterCol = mix(waterCol, vec3(0.68, 0.94, 1.0), fresnel * 0.35);

          // Sun specular glints
          vec3 halfVec = normalize(uSunDir + viewDir);
          float spec = pow(max(dot(nrm, halfVec), 0.0), 72.0);
          waterCol += vec3(1.0, 0.96, 0.85) * spec * 1.15;

          // Animated shoreline foam rings
          float foamPhase = sin(minShore * 2.2 - uTime * 3.1 + waveH * 1.5);
          float shoreMask = 1.0 - smoothstep(0.2, 5.2, minShore);
          float foamRing = smoothstep(0.25, 0.78, foamPhase) * shoreMask;
          float innerRim = 1.0 - smoothstep(0.0, 1.15, abs(minShore));
          float sparkleCrest = smoothstep(1.18, 1.55, waveH) * 0.38;
          float foam = clamp(foamRing * 0.85 + innerRim * 0.9 + sparkleCrest, 0.0, 1.0);
          waterCol = mix(waterCol, uFoamColor, foam);

          // Atmospheric fog blend
          float fogFactor = smoothstep(uFogNear, uFogFar, vViewDist);
          waterCol = mix(waterCol, uFogColor, fogFactor);

          float alpha = uOpacity;
          if (uEdgeFadeRadius > 0.5) {
            float edgeD = length(p - uCenterXZ);
            alpha *= 1.0 - smoothstep(uEdgeFadeRadius * 0.72, uEdgeFadeRadius, edgeD);
          }

          gl_FragColor = vec4(waterCol, alpha);
        }
      `
    });
  }

  class CraftMaterials {
    constructor(renderer) {
      this.renderer = renderer;
      this.maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy() || 4);
      this.cache = new Map();
      this.sharedUniforms = { uTime: { value: 0 } };
      this.envMap = this.createRoomEnvironmentMap();
      this.initSharedTextures();
    }

    // Multi-panel Studio RoomEnvironment baked via PMREMGenerator
    createRoomEnvironmentMap() {
      const pmrem = new THREE.PMREMGenerator(this.renderer);
      pmrem.compileEquirectangularShader();

      const envScene = new THREE.Scene();
      const skyGeo = new THREE.SphereGeometry(24, 28, 18);
      const skyMat = new THREE.MeshBasicMaterial({ side: THREE.BackSide, color: 0x9bd7ff });
      envScene.add(new THREE.Mesh(skyGeo, skyMat));

      const panels = [
        { pos: [0, 15, 0],   rot: [Math.PI / 2, 0, 0],  size: [18, 18], color: 0xfff8e6 }, // Overhead softbox
        { pos: [14, 9, 10],  rot: [0.4, -0.8, 0],       size: [11, 9],  color: 0xffefd2 }, // Warm key studio panel
        { pos: [-15, 7, -8], rot: [0.3, 1.1, 0],        size: [12, 8],  color: 0xbce6ff }, // Cool sky fill panel
        { pos: [0, -10, 0],  rot: [-Math.PI / 2, 0, 0], size: [26, 26], color: 0x90b96e }  // Warm meadow ground bounce
      ];
      const panelDisposables = [];
      for (const pn of panels) {
        const g = new THREE.PlaneGeometry(pn.size[0], pn.size[1]);
        const m = new THREE.MeshBasicMaterial({ color: pn.color, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(g, m);
        mesh.position.set(...pn.pos);
        mesh.rotation.set(...pn.rot);
        envScene.add(mesh);
        panelDisposables.push(g, m);
      }

      const rt = pmrem.fromScene(envScene, 0.04);
      skyGeo.dispose();
      skyMat.dispose();
      for (const d of panelDisposables) d.dispose();
      pmrem.dispose();
      return rt.texture;
    }

    makeCanvas(size = 512) {
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      return { canvas: c, ctx: c.getContext('2d') };
    }

    toTexture(canvas, repeatX = 1, repeatY = 1, isColor = true) {
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(repeatX, repeatY);
      tex.encoding = isColor ? THREE.sRGBEncoding : THREE.LinearEncoding;
      tex.anisotropy = this.maxAniso;
      tex.needsUpdate = true;
      return tex;
    }

    initSharedTextures() {
      // 1. High-Frequency Knit Bump + Roughness Maps (512x512, repeat = 5.5)
      {
        const { canvas: bCan, ctx: bCtx } = this.makeCanvas(512);
        const { canvas: rCan, ctx: rCtx } = this.makeCanvas(512);
        bCtx.fillStyle = '#686868';
        bCtx.fillRect(0, 0, 512, 512);
        rCtx.fillStyle = '#e8e8e8';
        rCtx.fillRect(0, 0, 512, 512);

        const step = 16;
        for (let y = 0; y < 512; y += step) {
          const offset = ((y / step) % 2) * (step * 0.5);
          for (let x = -step; x < 512 + step; x += step) {
            bCtx.strokeStyle = '#e5e5e5';
            bCtx.lineWidth = 4.5;
            bCtx.lineCap = 'round';
            bCtx.beginPath();
            bCtx.moveTo(x + offset + 2, y + 2);
            bCtx.lineTo(x + offset + step * 0.45, y + step - 2);
            bCtx.stroke();

            bCtx.strokeStyle = '#c8c8c8';
            bCtx.beginPath();
            bCtx.moveTo(x + offset + step - 2, y + 2);
            bCtx.lineTo(x + offset + step * 0.55, y + step - 2);
            bCtx.stroke();

            // Crevice roughness variation
            rCtx.strokeStyle = '#ffffff';
            rCtx.lineWidth = 3.2;
            rCtx.beginPath();
            rCtx.moveTo(x + offset + 2, y + 2);
            rCtx.lineTo(x + offset + step * 0.45, y + step - 2);
            rCtx.stroke();
          }
        }
        this.knitBump = this.toTexture(bCan, 5.5, 5.5, false);
        this.knitRough = this.toTexture(rCan, 5.5, 5.5, false);
      }

      // 2. Felt Fiber Bump + Roughness Maps (512x512)
      {
        const { canvas: bCan, ctx: bCtx } = this.makeCanvas(512);
        const { canvas: rCan, ctx: rCtx } = this.makeCanvas(512);
        bCtx.fillStyle = '#808080';
        bCtx.fillRect(0, 0, 512, 512);
        rCtx.fillStyle = '#e6e6e6';
        rCtx.fillRect(0, 0, 512, 512);
        const rng = mulberry32(4411);
        for (let i = 0; i < 6800; i++) {
          const x = rng() * 512;
          const y = rng() * 512;
          const len = 4 + rng() * 11;
          const ang = rng() * Math.PI * 2;
          const shade = Math.floor(92 + rng() * 118);
          bCtx.strokeStyle = `rgb(${shade},${shade},${shade})`;
          bCtx.lineWidth = 1.3;
          bCtx.beginPath();
          bCtx.moveTo(x, y);
          bCtx.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len);
          bCtx.stroke();

          if (i % 3 === 0) {
            const rs = Math.floor(200 + rng() * 55);
            rCtx.fillStyle = `rgb(${rs},${rs},${rs})`;
            rCtx.fillRect(x, y, 3, 3);
          }
        }
        this.feltBump = this.toTexture(bCan, 2, 2, false);
        this.feltRough = this.toTexture(rCan, 2, 2, false);
      }

      // 3. Corrugated Kraft Cardboard 4-Channel PBR (512x512)
      {
        const { canvas, ctx } = this.makeCanvas(512);
        const { canvas: bCan, ctx: bCtx } = this.makeCanvas(512);
        const { canvas: rCan, ctx: rCtx } = this.makeCanvas(512);
        const { canvas: eCan, ctx: eCtx } = this.makeCanvas(512);

        ctx.fillStyle = '#b97e44';
        ctx.fillRect(0, 0, 512, 512);
        bCtx.fillStyle = '#808080';
        bCtx.fillRect(0, 0, 512, 512);
        rCtx.fillStyle = '#dedede';
        rCtx.fillRect(0, 0, 512, 512);
        eCtx.fillStyle = '#000000';
        eCtx.fillRect(0, 0, 512, 512);

        for (let x = 0; x < 512; x += 12) {
          const g = ctx.createLinearGradient(x, 0, x + 12, 0);
          g.addColorStop(0, 'rgba(72,42,16,0.22)');
          g.addColorStop(0.5, 'rgba(255,224,182,0.16)');
          g.addColorStop(1, 'rgba(72,42,16,0.22)');
          ctx.fillStyle = g;
          ctx.fillRect(x, 0, 12, 512);

          bCtx.fillStyle = (x / 12) % 2 === 0 ? '#adadad' : '#5e5e5e';
          bCtx.fillRect(x, 0, 6, 512);
        }

        // Subtle contact AO near bottom edge
        const aoGrad = ctx.createLinearGradient(0, 440, 0, 512);
        aoGrad.addColorStop(0, 'rgba(0,0,0,0)');
        aoGrad.addColorStop(1, 'rgba(42,24,10,0.24)');
        ctx.fillStyle = aoGrad;
        ctx.fillRect(0, 440, 512, 72);

        const drawTapeX = (cx, cy, size, angle) => {
          for (const targetCtx of [ctx, rCtx]) {
            targetCtx.save();
            targetCtx.translate(cx, cy);
            targetCtx.rotate(angle);
            targetCtx.fillStyle = targetCtx === ctx ? 'rgba(246, 232, 193, 0.92)' : '#a8a8a8';
            targetCtx.fillRect(-size, -12, size * 2, 24);
            targetCtx.rotate(Math.PI / 2);
            targetCtx.fillRect(-size, -12, size * 2, 24);
            targetCtx.restore();
          }
        };
        drawTapeX(118, 130, 48, 0.2);
        drawTapeX(392, 370, 52, -0.35);

        this.cardboardMat = new THREE.MeshStandardMaterial({
          map: this.toTexture(canvas, 1, 1, true),
          bumpMap: this.toTexture(bCan, 1, 1, false),
          roughnessMap: this.toTexture(rCan, 1, 1, false),
          emissiveMap: this.toTexture(eCan, 1, 1, true),
          bumpScale: 0.08,
          roughness: 0.88,
          metalness: 0.02,
          envMapIntensity: 0.26
        });
      }

      // 4. Wood Grain PBR (512x512)
      {
        const { canvas, ctx } = this.makeCanvas(512);
        const { canvas: bCan, ctx: bCtx } = this.makeCanvas(512);
        const { canvas: rCan, ctx: rCtx } = this.makeCanvas(512);
        ctx.fillStyle = '#cf9455';
        ctx.fillRect(0, 0, 512, 512);
        bCtx.fillStyle = '#808080';
        bCtx.fillRect(0, 0, 512, 512);
        rCtx.fillStyle = '#9a9a9a';
        rCtx.fillRect(0, 0, 512, 512);

        for (let y = 0; y < 512; y += 6) {
          const w = 3 + Math.sin(y * 0.08) * 1.5;
          ctx.fillStyle = (y / 6) % 2 === 0 ? 'rgba(122,68,24,0.18)' : 'rgba(255,232,194,0.14)';
          ctx.fillRect(0, y, 512, w);
          bCtx.fillStyle = (y / 6) % 2 === 0 ? '#6e6e6e' : '#969696';
          bCtx.fillRect(0, y, 512, w);
          rCtx.fillStyle = (y / 6) % 2 === 0 ? '#b2b2b2' : '#858585';
          rCtx.fillRect(0, y, 512, w);
        }
        this.woodMat = new THREE.MeshStandardMaterial({
          map: this.toTexture(canvas, 1, 1, true),
          bumpMap: this.toTexture(bCan, 1, 1, false),
          roughnessMap: this.toTexture(rCan, 1, 1, false),
          bumpScale: 0.04,
          roughness: 0.56,
          metalness: 0.04,
          envMapIntensity: 0.32
        });
      }

      // 5. Cobbled Stone / Carved Rock Underbelly PBR (512x512)
      {
        const { canvas, ctx } = this.makeCanvas(512);
        const { canvas: bCan, ctx: bCtx } = this.makeCanvas(512);
        const { canvas: rCan, ctx: rCtx } = this.makeCanvas(512);
        ctx.fillStyle = '#7e614b';
        ctx.fillRect(0, 0, 512, 512);
        bCtx.fillStyle = '#747474';
        bCtx.fillRect(0, 0, 512, 512);
        rCtx.fillStyle = '#dcdcdc';
        rCtx.fillRect(0, 0, 512, 512);

        const rng = mulberry32(717);
        for (let i = 0; i < 160; i++) {
          const sx = rng() * 512;
          const sy = rng() * 512;
          const rw = 26 + rng() * 44;
          const rh = 18 + rng() * 32;
          const shade = Math.floor(rng() * 36) - 18;
          ctx.fillStyle = `rgb(${128 + shade}, ${96 + shade}, ${74 + shade})`;
          ctx.strokeStyle = 'rgba(42,26,18,0.45)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(sx, sy, rw * 0.5, rh * 0.5, rng() * Math.PI, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          bCtx.fillStyle = `rgb(${150 + shade}, ${150 + shade}, ${150 + shade})`;
          bCtx.beginPath();
          bCtx.ellipse(sx, sy, rw * 0.45, rh * 0.45, 0, 0, Math.PI * 2);
          bCtx.fill();
        }
        this.rockUnderMat = new THREE.MeshStandardMaterial({
          map: this.toTexture(canvas, 1, 1, true),
          bumpMap: this.toTexture(bCan, 1, 1, false),
          roughnessMap: this.toTexture(rCan, 1, 1, false),
          bumpScale: 0.10,
          roughness: 0.90,
          metalness: 0.02,
          vertexColors: true,
          envMapIntensity: 0.22
        });
      }

      // 6. Brushed Brass Gears PBR (512x512)
      {
        const { canvas, ctx } = this.makeCanvas(512);
        const { canvas: bCan, ctx: bCtx } = this.makeCanvas(512);
        const { canvas: rCan, ctx: rCtx } = this.makeCanvas(512);
        const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 256);
        grad.addColorStop(0, '#ffe484');
        grad.addColorStop(0.55, '#f2bc38');
        grad.addColorStop(1, '#c48d1e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);
        bCtx.fillStyle = '#808080';
        bCtx.fillRect(0, 0, 512, 512);
        rCtx.fillStyle = '#484848';
        rCtx.fillRect(0, 0, 512, 512);

        for (let r = 40; r <= 230; r += 36) {
          ctx.strokeStyle = 'rgba(110,70,12,0.28)';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(256, 256, r, 0, Math.PI * 2);
          ctx.stroke();
          bCtx.strokeStyle = '#606060';
          bCtx.lineWidth = 4;
          bCtx.beginPath();
          bCtx.arc(256, 256, r, 0, Math.PI * 2);
          bCtx.stroke();
        }
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * Math.PI * 2;
          const rx = 256 + Math.cos(a) * 200;
          const ry = 256 + Math.sin(a) * 200;
          ctx.fillStyle = '#ffeeb0';
          ctx.beginPath();
          ctx.arc(rx, ry, 10, 0, Math.PI * 2);
          ctx.fill();
          bCtx.fillStyle = '#dcdcdc';
          bCtx.beginPath();
          bCtx.arc(rx, ry, 10, 0, Math.PI * 2);
          bCtx.fill();
        }
        this.brassMat = new THREE.MeshStandardMaterial({
          map: this.toTexture(canvas, 1, 1, true),
          bumpMap: this.toTexture(bCan, 1, 1, false),
          roughnessMap: this.toTexture(rCan, 1, 1, false),
          bumpScale: 0.04,
          roughness: 0.28,
          metalness: 0.82,
          envMapIntensity: 1.35
        });
      }

      // 7. Checkered Flag Felt Material (512x512)
      {
        const { canvas, ctx } = this.makeCanvas(512);
        const sq = 64;
        for (let y = 0; y < 512; y += sq) {
          for (let x = 0; x < 512; x += sq) {
            ctx.fillStyle = ((x / sq + y / sq) % 2 === 0) ? '#fff6e0' : '#ff4d6d';
            ctx.fillRect(x, y, sq, sq);
          }
        }
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.setLineDash([12, 10]);
        ctx.strokeRect(10, 10, 492, 492);
        this.flagMat = new THREE.MeshStandardMaterial({
          map: this.toTexture(canvas, 1, 1, true),
          bumpMap: this.feltBump,
          roughnessMap: this.feltRough,
          bumpScale: 0.04,
          roughness: 0.88,
          envMapIntensity: 0.25,
          side: THREE.DoubleSide
        });
      }

      // 8. Pink Porous Sponge Bounce Pad PBR (512x512)
      {
        const { canvas, ctx } = this.makeCanvas(512);
        const { canvas: bCan, ctx: bCtx } = this.makeCanvas(512);
        const { canvas: rCan, ctx: rCtx } = this.makeCanvas(512);
        ctx.fillStyle = '#ea4a8b';
        ctx.fillRect(0, 0, 512, 512);
        bCtx.fillStyle = '#909090';
        bCtx.fillRect(0, 0, 512, 512);
        rCtx.fillStyle = '#dcdcdc';
        rCtx.fillRect(0, 0, 512, 512);
        const rng = mulberry32(991);
        for (let i = 0; i < 420; i++) {
          const px = rng() * 512;
          const py = rng() * 512;
          const pr = 4 + rng() * 10;
          ctx.fillStyle = 'rgba(130, 18, 65, 0.26)';
          ctx.beginPath();
          ctx.arc(px, py, pr, 0, Math.PI * 2);
          ctx.fill();
          bCtx.fillStyle = '#383838';
          bCtx.beginPath();
          bCtx.arc(px, py, pr, 0, Math.PI * 2);
          bCtx.fill();
        }
        this.spongeMat = new THREE.MeshStandardMaterial({
          map: this.toTexture(canvas, 1, 1, true),
          bumpMap: this.toTexture(bCan, 1, 1, false),
          roughnessMap: this.toTexture(rCan, 1, 1, false),
          bumpScale: 0.08,
          roughness: 0.86,
          metalness: 0.02,
          envMapIntensity: 0.25
        });
      }

      // 9. Rope Material
      this.ropeMat = this.getFeltMaterial('#e6c994', '#b89458', false, 2);

      // 10. Soft Radial Contact Shadow Decal Texture
      {
        const { canvas, ctx } = this.makeCanvas(128);
        const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 62);
        g.addColorStop(0, 'rgba(28, 16, 8, 0.72)');
        g.addColorStop(0.55, 'rgba(28, 16, 8, 0.34)');
        g.addColorStop(1, 'rgba(28, 16, 8, 0.0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 128, 128);
        this.contactShadowTex = new THREE.CanvasTexture(canvas);
        this.contactShadowTex.encoding = THREE.sRGBEncoding;
        this.contactShadowTex.needsUpdate = true;
      }
    }

    // Knit Yarn Material with high-frequency weave (repeat = 5.5) + Velvet Rim-Fuzz Shader
    getKnitMaterial(hexColor, stitchHex = '#fff3dc') {
      const key = `knit_v2_${hexColor}_${stitchHex}`;
      if (this.cache.has(key)) return this.cache.get(key);
      const { canvas, ctx } = this.makeCanvas(512);
      ctx.fillStyle = hexColor;
      ctx.fillRect(0, 0, 512, 512);
      const step = 16;
      for (let y = 0; y < 512; y += step) {
        const offset = ((y / step) % 2) * (step * 0.5);
        for (let x = -step; x < 512 + step; x += step) {
          ctx.strokeStyle = 'rgba(0,0,0,0.16)';
          ctx.lineWidth = 4;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(x + offset + 2, y + 3);
          ctx.lineTo(x + offset + step * 0.45, y + step - 1);
          ctx.stroke();

          ctx.strokeStyle = stitchHex;
          ctx.globalAlpha = 0.32;
          ctx.lineWidth = 2.6;
          ctx.beginPath();
          ctx.moveTo(x + offset + step - 2, y + 2);
          ctx.lineTo(x + offset + step * 0.55, y + step - 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
      const mat = new THREE.MeshStandardMaterial({
        map: this.toTexture(canvas, 5.5, 5.5, true),
        bumpMap: this.knitBump,
        roughnessMap: this.knitRough,
        bumpScale: 0.09,
        roughness: 0.88,
        metalness: 0.02,
        envMapIntensity: 0.28
      });

      // Grazing-angle Fresnel velvet fuzz sheen (WebGL1 GLSL 1.00)
      mat.onBeforeCompile = (shader) => {
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <lights_fragment_end>',
          `#include <lights_fragment_end>
           {
             vec3 vDir = normalize(vViewPosition);
             float fuzzRim = pow(1.0 - max(dot(normalize(vNormal), vDir), 0.0), 2.4);
             reflectedLight.indirectDiffuse += (diffuseColor.rgb * 0.65 + vec3(0.20, 0.16, 0.12)) * fuzzRim;
           }`
        );
      };
      mat.customProgramCacheKey = () => 'knit_velvet_fuzz_v2';

      this.cache.set(key, mat);
      return mat;
    }

    getFeltMaterial(baseHex, stitchHex = '#ffffff', stitchedEdges = true, repeat = 1, useVertexColors = false) {
      const key = `felt_v2_${baseHex}_${stitchHex}_${stitchedEdges}_${repeat}_${useVertexColors}`;
      if (this.cache.has(key)) return this.cache.get(key);
      const { canvas, ctx } = this.makeCanvas(512);
      ctx.fillStyle = baseHex;
      ctx.fillRect(0, 0, 512, 512);
      const rng = mulberry32(baseHex.split('').reduce((a, c) => a + c.charCodeAt(0), 0));
      for (let i = 0; i < 3600; i++) {
        ctx.fillStyle = rng() > 0.5 ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
        ctx.fillRect(rng() * 512, rng() * 512, 3, 3);
      }
      if (stitchedEdges) {
        ctx.strokeStyle = stitchHex;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.setLineDash([18, 14]);
        ctx.strokeRect(18, 18, 476, 476);
        ctx.setLineDash([]);
      }
      const mat = new THREE.MeshStandardMaterial({
        map: this.toTexture(canvas, repeat, repeat, true),
        bumpMap: this.feltBump,
        roughnessMap: this.feltRough,
        bumpScale: 0.06,
        roughness: 0.90,
        metalness: 0.02,
        vertexColors: useVertexColors,
        envMapIntensity: 0.25
      });
      this.cache.set(key, mat);
      return mat;
    }

    getButtonMaterial(hexColor) {
      const key = `btn_v2_${hexColor}`;
      if (this.cache.has(key)) return this.cache.get(key);
      const { canvas, ctx } = this.makeCanvas(512);
      ctx.fillStyle = hexColor;
      ctx.fillRect(0, 0, 512, 512);
      const g = ctx.createRadialGradient(185, 165, 16, 256, 256, 240);
      g.addColorStop(0, 'rgba(255,255,255,0.62)');
      g.addColorStop(0.28, 'rgba(255,255,255,0.14)');
      g.addColorStop(1, 'rgba(0,0,0,0.10)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 512);

      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.lineWidth = 22;
      ctx.beginPath();
      ctx.arc(256, 256, 215, 0, Math.PI * 2);
      ctx.stroke();

      const holes = [[206, 206], [306, 206], [206, 306], [306, 306]];
      for (const [hx, hy] of holes) {
        ctx.fillStyle = '#241812';
        ctx.beginPath();
        ctx.arc(hx, hy, 22, 0, Math.PI * 2);
        ctx.fill();
      }
      const mat = new THREE.MeshPhysicalMaterial({
        map: this.toTexture(canvas, 1, 1, true),
        roughness: 0.16,
        metalness: 0.08,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        envMapIntensity: 1.45
      });
      this.cache.set(key, mat);
      return mat;
    }
  }

  // ============================================================================
  // 5. MULTI-JOINTED SCULPTED PLUSH RIG (PATCH & STITCH)
  // ============================================================================
  function createPearTorsoGeometry() {
    const pts = [
      new THREE.Vector2(0.01, -0.44),
      new THREE.Vector2(0.38, -0.42),
      new THREE.Vector2(0.57, -0.18),
      new THREE.Vector2(0.55,  0.08),
      new THREE.Vector2(0.45,  0.32),
      new THREE.Vector2(0.32,  0.47),
      new THREE.Vector2(0.01,  0.50)
    ];
    return new THREE.LatheGeometry(pts, 24);
  }

  function createTaperedLimbGeometry(rTop, rBot, len) {
    const pts = [
      new THREE.Vector2(0.01, 0),
      new THREE.Vector2(rTop, -0.02),
      new THREE.Vector2(rTop * 0.92 + rBot * 0.08, -len * 0.45),
      new THREE.Vector2(rBot, -len * 0.92),
      new THREE.Vector2(0.01, -len)
    ];
    return new THREE.LatheGeometry(pts, 14);
  }

  function createPlushRig(materials, yarnIdx = 0, hatIdx = 0, outfitIdx = 0) {
    const root = new THREE.Group();
    const scaleGroup = new THREE.Group();
    root.add(scaleGroup);

    const bodyPivot = new THREE.Group();
    scaleGroup.add(bodyPivot);

    const yarn = YARN_PALETTE[yarnIdx % YARN_PALETTE.length];
    const knitMat = materials.getKnitMaterial(yarn.hex, yarn.stitch);
    const buttonMat = materials.getButtonMaterial('#231814');
    const silverMat = new THREE.MeshStandardMaterial({ color: 0xdfe6ee, roughness: 0.22, metalness: 0.85 });
    const bootSoleMat = materials.getFeltMaterial('#4a2e1d', '#f5deb3', true, 1);
    const knitMeshes = [];

    // LatheGeometry Pear-Shaped Torso
    const torso = new THREE.Mesh(createPearTorsoGeometry(), knitMat);
    torso.scale.set(1.0, 1.08, 0.90);
    torso.position.y = 0.86;
    torso.castShadow = true;
    torso.receiveShadow = true;
    bodyPivot.add(torso);
    knitMeshes.push(torso);

    // Stitched Collar Seam
    const collarSeam = new THREE.Mesh(
      new THREE.TorusGeometry(0.32, 0.045, 8, 22),
      materials.getFeltMaterial('#fff5df', '#fff', false)
    );
    collarSeam.rotation.x = Math.PI / 2;
    collarSeam.position.set(0, 1.32, 0.01);
    bodyPivot.add(collarSeam);

    // Metallic Zipper Track + Brass Pull Ring
    const zipTrack = new THREE.Mesh(
      createRoundedBoxGeometry(0.07, 0.56, 0.08, 2, 0.02),
      silverMat
    );
    zipTrack.position.set(0, 0.90, 0.45);
    zipTrack.rotation.x = -0.14;
    bodyPivot.add(zipTrack);

    const zipPullGroup = new THREE.Group();
    zipPullGroup.position.set(0, 1.12, 0.50);
    const pullRing = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.016, 8, 14), materials.brassMat);
    pullRing.position.y = -0.04;
    const pullTab = new THREE.Mesh(createRoundedBoxGeometry(0.07, 0.11, 0.03, 2, 0.01), materials.brassMat);
    pullTab.position.y = -0.11;
    pullTab.rotation.x = -0.22;
    zipPullGroup.add(pullRing, pullTab);
    bodyPivot.add(zipPullGroup);

    // Sculpted Expressive Head
    const headGroup = new THREE.Group();
    headGroup.position.y = 1.66;
    bodyPivot.add(headGroup);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.56, 24, 20), knitMat);
    head.scale.set(1.08, 0.95, 0.98);
    head.castShadow = true;
    head.receiveShadow = true;
    headGroup.add(head);
    knitMeshes.push(head);

    // Plump cheeks
    for (const sx of [-0.28, 0.28]) {
      const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.20, 14, 12), knitMat);
      cheek.position.set(sx, -0.09, 0.41);
      cheek.scale.set(1.05, 0.85, 0.72);
      headGroup.add(cheek);
      knitMeshes.push(cheek);
    }

    // Real Beveled 3D 4-Hole Button Eyes (Rim + Recessed Core + X-Stitched Threads + Catchlight)
    const buildButtonEye = (sideX) => {
      const eyePivot = new THREE.Group();
      eyePivot.position.set(sideX, 0.08, 0.51);
      eyePivot.rotation.y = sideX < 0 ? -0.24 : 0.24;

      // Recessed dark socket behind button
      const socket = new THREE.Mesh(
        new THREE.CylinderGeometry(0.13, 0.14, 0.03, 18),
        new THREE.MeshBasicMaterial({ color: 0x24160e })
      );
      socket.rotation.x = Math.PI / 2;
      socket.position.z = -0.015;
      eyePivot.add(socket);

      // Machined rim ring
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.022, 8, 20), buttonMat);
      rim.position.z = 0.012;
      eyePivot.add(rim);

      // Recessed glossy core
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.025, 18), buttonMat);
      core.rotation.x = Math.PI / 2;
      eyePivot.add(core);

      // X-stitched cream threads
      const threadMat = new THREE.MeshStandardMaterial({ color: 0xfff5de, roughness: 0.7 });
      for (const rotZ of [0.78, -0.78]) {
        const th = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.09, 6), threadMat);
        th.rotation.z = rotZ;
        th.position.z = 0.02;
        eyePivot.add(th);
      }

      // Tiny glossy catchlight dot
      const glint = new THREE.Mesh(
        new THREE.SphereGeometry(0.02, 8, 6),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      glint.position.set(-0.038, 0.042, 0.025);
      eyePivot.add(glint);

      headGroup.add(eyePivot);
      return eyePivot;
    };
    const eyeL = buildButtonEye(-0.205);
    const eyeR = buildButtonEye(0.205);

    // 3D Curved Stitched Smile
    const smileCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.15, -0.04, 0.49),
      new THREE.Vector3(-0.07, -0.12, 0.54),
      new THREE.Vector3( 0.00, -0.14, 0.55),
      new THREE.Vector3( 0.07, -0.12, 0.54),
      new THREE.Vector3( 0.15, -0.04, 0.49)
    ]);
    const smile = new THREE.Mesh(
      new THREE.TubeGeometry(smileCurve, 14, 0.022, 8, false),
      new THREE.MeshStandardMaterial({ color: 0x2a1810, roughness: 0.85 })
    );
    headGroup.add(smile);

    // Multi-Jointed Articulated Arms (Shoulder Puff -> Upper Arm -> Elbow -> Forearm -> Mitten Hand + Thumb)
    const upperArmGeo = createTaperedLimbGeometry(0.125, 0.10, 0.24);
    const forearmGeo = createTaperedLimbGeometry(0.10, 0.125, 0.24);
    const buildArm = (sideX) => {
      const armPivot = new THREE.Group();
      armPivot.position.set(sideX * 0.46, 1.18, 0);
      armPivot.rotation.z = sideX * 0.22;

      const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 12), knitMat);
      shoulder.castShadow = true;
      armPivot.add(shoulder);
      knitMeshes.push(shoulder);

      const upper = new THREE.Mesh(upperArmGeo, knitMat);
      upper.castShadow = true;
      armPivot.add(upper);
      knitMeshes.push(upper);

      const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.10, 12, 10), knitMat);
      elbow.position.y = -0.24;
      armPivot.add(elbow);
      knitMeshes.push(elbow);

      const forearmGroup = new THREE.Group();
      forearmGroup.position.y = -0.24;
      forearmGroup.rotation.x = -0.24;
      armPivot.add(forearmGroup);

      const forearm = new THREE.Mesh(forearmGeo, knitMat);
      forearm.castShadow = true;
      forearmGroup.add(forearm);
      knitMeshes.push(forearm);

      // Rounded Mitten Hand + Thumb
      const mitten = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 12), knitMat);
      mitten.scale.set(0.95, 1.12, 0.88);
      mitten.position.y = -0.28;
      mitten.castShadow = true;
      forearmGroup.add(mitten);
      knitMeshes.push(mitten);

      const thumb = new THREE.Mesh(new THREE.SphereGeometry(0.064, 10, 8), knitMat);
      thumb.position.set(-sideX * 0.08, -0.24, 0.09);
      thumb.scale.set(0.9, 1.25, 0.9);
      forearmGroup.add(thumb);
      knitMeshes.push(thumb);

      bodyPivot.add(armPivot);
      return armPivot;
    };
    const armL = buildArm(-1);
    const armR = buildArm(1);

    // Multi-Jointed Articulated Legs (Hip -> Tapered Leg -> Rounded Plush Boot with Stitched Sole)
    const thighGeo = createTaperedLimbGeometry(0.16, 0.13, 0.30);
    const buildLeg = (sideX) => {
      const legPivot = new THREE.Group();
      legPivot.position.set(sideX * 0.24, 0.44, 0);

      const hip = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), knitMat);
      legPivot.add(hip);
      knitMeshes.push(hip);

      const legUpper = new THREE.Mesh(thighGeo, knitMat);
      legUpper.castShadow = true;
      legPivot.add(legUpper);
      knitMeshes.push(legUpper);

      // Rounded Plush Boot + Stitched Sole
      const bootGroup = new THREE.Group();
      bootGroup.position.set(0, -0.34, 0.05);
      const bootBody = new THREE.Mesh(createRoundedBoxGeometry(0.26, 0.16, 0.36, 3, 0.075), knitMat);
      bootBody.castShadow = true;
      bootGroup.add(bootBody);
      knitMeshes.push(bootBody);

      const sole = new THREE.Mesh(createRoundedBoxGeometry(0.28, 0.055, 0.38, 2, 0.025), bootSoleMat);
      sole.position.y = -0.075;
      bootGroup.add(sole);

      legPivot.add(bootGroup);
      bodyPivot.add(legPivot);
      return legPivot;
    };
    const legL = buildLeg(-1);
    const legR = buildLeg(1);

    const hatMount = new THREE.Group();
    hatMount.position.set(0, 0.46, 0);
    headGroup.add(hatMount);

    const outfitMount = new THREE.Group();
    outfitMount.position.set(0, 0.88, 0);
    bodyPivot.add(outfitMount);

    const rig = {
      root,
      scaleGroup,
      bodyPivot,
      headGroup,
      torso,
      head,
      eyeL,
      eyeR,
      armL,
      armR,
      legL,
      legR,
      knitMeshes,
      hatMount,
      outfitMount,
      propeller: null,
      capeMesh: null,
      capeRestPos: null,
      silverMat,
      blinkTimer: 2.5
    };

    applyPlushCosmetics(rig, materials, yarnIdx, hatIdx, outfitIdx);
    return rig;
  }

  function clearGroupChildren(grp) {
    while (grp.children.length > 0) {
      grp.remove(grp.children[0]);
    }
  }

  function applyPlushCosmetics(rig, materials, yarnIdx, hatIdx, outfitIdx) {
    const yarn = YARN_PALETTE[yarnIdx % YARN_PALETTE.length];
    const knitMat = materials.getKnitMaterial(yarn.hex, yarn.stitch);
    for (const m of rig.knitMeshes) m.material = knitMat;

    // Hats (Sculpted 3D Hats)
    clearGroupChildren(rig.hatMount);
    rig.propeller = null;
    const hat = HAT_CATALOG[hatIdx % HAT_CATALOG.length];
    const hatFelt = materials.getFeltMaterial(hat.color, '#ffffff', false);

    if (hat.id === 'bunny') {
      const innerPink = materials.getFeltMaterial('#ff8fa3', '#fff', false);
      for (const sx of [-0.22, 0.22]) {
        const earCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(sx * 0.25, 0.34, -0.02),
          new THREE.Vector3(sx * 0.55, 0.62, -0.14)
        ]);
        const ear = new THREE.Mesh(new THREE.TubeGeometry(earCurve, 12, 0.10, 10, false), hatFelt);
        ear.position.set(sx, 0.02, -0.04);
        ear.castShadow = true;
        const tip = new THREE.Mesh(new THREE.SphereGeometry(0.10, 10, 8), innerPink);
        tip.position.set(sx * 1.55, 0.64, -0.18);
        rig.hatMount.add(ear, tip);
      }
    } else if (hat.id === 'knight') {
      const helm = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.61, 0.54, 18), materials.cardboardMat);
      helm.position.y = -0.04;
      helm.castShadow = true;
      const visor = new THREE.Mesh(createRoundedBoxGeometry(0.76, 0.20, 0.32, 2, 0.06), materials.brassMat);
      visor.position.set(0, 0.04, 0.44);
      const plumeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.22, 0.22),
        new THREE.Vector3(0, 0.52, -0.04),
        new THREE.Vector3(0, 0.38, -0.45)
      ]);
      const plume = new THREE.Mesh(new THREE.TubeGeometry(plumeCurve, 12, 0.11, 10, false), materials.getFeltMaterial('#eb4d70'));
      rig.hatMount.add(helm, visor, plume);
    } else if (hat.id === 'dino') {
      const hood = new THREE.Mesh(new THREE.SphereGeometry(0.60, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.58), hatFelt);
      hood.position.y = -0.28;
      rig.hatMount.add(hood);
      const crestMat = materials.getFeltMaterial('#ffd43b');
      for (let i = 0; i < 4; i++) {
        const spike = new THREE.Mesh(createRoundedBoxGeometry(0.16, 0.28, 0.18, 2, 0.06), crestMat);
        spike.position.set(0, 0.32 - i * 0.15, -0.06 - i * 0.22);
        spike.rotation.x = -0.5 - i * 0.32;
        rig.hatMount.add(spike);
      }
    } else if (hat.id === 'astro') {
      const glass = new THREE.Mesh(
        new THREE.SphereGeometry(0.72, 24, 18),
        new THREE.MeshPhysicalMaterial({
          color: 0xdff8ff, roughness: 0.06, metalness: 0.05, clearcoat: 1.0, transparent: true, opacity: 0.36
        })
      );
      glass.position.y = -0.44;
      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.075, 10, 24), materials.brassMat);
      collar.rotation.x = Math.PI / 2;
      collar.position.y = -0.82;
      rig.hatMount.add(glass, collar);
    } else if (hat.id === 'crown') {
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.38, 0.24, 18), materials.brassMat);
      band.position.y = 0.08;
      const cushion = new THREE.Mesh(new THREE.SphereGeometry(0.36, 16, 12), materials.getFeltMaterial('#eb4d70'));
      cushion.scale.y = 0.55;
      cushion.position.y = 0.15;
      rig.hatMount.add(band, cushion);
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        const jewel = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), materials.getButtonMaterial(PIANO_COLORS[i]));
        jewel.position.set(Math.cos(a) * 0.38, 0.26, Math.sin(a) * 0.38);
        rig.hatMount.add(jewel);
      }
    } else if (hat.id === 'fox') {
      for (const sx of [-0.28, 0.28]) {
        const ear = new THREE.Mesh(createRoundedBoxGeometry(0.24, 0.34, 0.14, 2, 0.05), hatFelt);
        ear.position.set(sx, 0.14, 0);
        ear.rotation.z = sx < 0 ? 0.32 : -0.32;
        const inner = new THREE.Mesh(createRoundedBoxGeometry(0.14, 0.22, 0.08, 2, 0.03), materials.getFeltMaterial('#fff5e6'));
        inner.position.set(0, -0.02, 0.05);
        ear.add(inner);
        rig.hatMount.add(ear);
      }
    } else if (hat.id === 'propeller') {
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.54, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.5), hatFelt);
      cap.position.y = -0.14;
      rig.hatMount.add(cap);
      const spinner = new THREE.Group();
      spinner.position.y = 0.42;
      const hub = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), materials.brassMat);
      const b1 = new THREE.Mesh(createRoundedBoxGeometry(0.84, 0.045, 0.14, 2, 0.02), materials.getFeltMaterial('#ffd43b'));
      const b2 = new THREE.Mesh(createRoundedBoxGeometry(0.14, 0.045, 0.84, 2, 0.02), materials.getFeltMaterial('#38aee6'));
      spinner.add(hub, b1, b2);
      rig.hatMount.add(spinner);
      rig.propeller = spinner;
    } else if (hat.id === 'wizard') {
      const brim = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.12, 10, 24), hatFelt);
      brim.rotation.x = Math.PI / 2;
      brim.position.y = 0.03;
      const wizardPts = [
        new THREE.Vector2(0.46, 0),
        new THREE.Vector2(0.32, 0.35),
        new THREE.Vector2(0.14, 0.72),
        new THREE.Vector2(0.01, 0.94)
      ];
      const cone = new THREE.Mesh(new THREE.LatheGeometry(wizardPts, 18), hatFelt);
      cone.rotation.z = 0.14;
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.05, 8, 20), materials.brassMat);
      band.rotation.x = Math.PI / 2;
      band.position.y = 0.10;
      rig.hatMount.add(brim, cone, band);
    }

    // Outfits (Subdivided Vertex-Wave Cape & Rounded Craft Gear)
    clearGroupChildren(rig.outfitMount);
    rig.capeMesh = null;
    rig.capeRestPos = null;
    const outfit = OUTFIT_CATALOG[outfitIdx % OUTFIT_CATALOG.length];
    const outFelt = materials.getFeltMaterial(outfit.color, '#ffffff', true);

    if (outfit.id === 'vest') {
      const vest = new THREE.Mesh(new THREE.CylinderGeometry(0.57, 0.60, 0.56, 20, 1, true, 0.45, Math.PI * 1.72), outFelt);
      vest.rotation.y = Math.PI * 0.64;
      vest.material.side = THREE.DoubleSide;
      rig.outfitMount.add(vest);
    } else if (outfit.id === 'cape') {
      const capeGeo = new THREE.PlaneGeometry(0.92, 1.04, 8, 10);
      capeGeo.translate(0, -0.52, 0);
      const capeMat = outFelt.clone();
      capeMat.side = THREE.DoubleSide;
      const cape = new THREE.Mesh(capeGeo, capeMat);
      cape.position.set(0, 0.38, -0.34);
      cape.rotation.x = 0.24;
      cape.castShadow = true;
      rig.outfitMount.add(cape);
      rig.capeMesh = cape;
      rig.capeRestPos = new Float32Array(capeGeo.attributes.position.array);
    } else if (outfit.id === 'pack') {
      const pack = new THREE.Mesh(createRoundedBoxGeometry(0.68, 0.64, 0.40, 3, 0.12), outFelt);
      pack.position.set(0, 0.02, -0.54);
      pack.castShadow = true;
      const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.72, 14), materials.getFeltMaterial('#f4b43a'));
      roll.rotation.z = Math.PI / 2;
      roll.position.set(0, 0.40, -0.54);
      const buckle = new THREE.Mesh(createRoundedBoxGeometry(0.16, 0.12, 0.08, 2, 0.03), materials.brassMat);
      buckle.position.set(0, 0.04, -0.74);
      rig.outfitMount.add(pack, roll, buckle);
    } else if (outfit.id === 'scarf') {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.11, 10, 22), outFelt);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.42;
      const tail = new THREE.Mesh(createRoundedBoxGeometry(0.24, 0.60, 0.09, 2, 0.035), materials.getFeltMaterial('#ff595e'));
      tail.position.set(0.32, 0.14, -0.42);
      tail.rotation.z = -0.25;
      tail.rotation.x = 0.18;
      rig.outfitMount.add(ring, tail);
    } else if (outfit.id === 'bee') {
      for (const sy of [-0.15, 0.10]) {
        const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.075, 10, 24), materials.getFeltMaterial(sy > 0 ? '#ffd124' : '#2a221d'));
        stripe.rotation.x = Math.PI / 2;
        stripe.position.y = sy;
        rig.outfitMount.add(stripe);
      }
      const wingMat = new THREE.MeshPhysicalMaterial({ color: 0xe4f9ff, roughness: 0.15, clearcoat: 0.8, transparent: true, opacity: 0.72 });
      for (const sx of [-0.26, 0.26]) {
        const wing = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 10), wingMat);
        wing.scale.set(1.25, 0.68, 0.22);
        wing.position.set(sx, 0.18, -0.52);
        wing.rotation.y = sx < 0 ? 0.45 : -0.45;
        rig.outfitMount.add(wing);
      }
    } else if (outfit.id === 'dragon') {
      for (const sx of [-0.38, 0.38]) {
        const wing = new THREE.Mesh(createRoundedBoxGeometry(0.56, 0.72, 0.09, 2, 0.04), outFelt);
        wing.position.set(sx, 0.16, -0.54);
        wing.rotation.z = sx < 0 ? 0.55 : -0.55;
        wing.rotation.y = sx < 0 ? 0.45 : -0.45;
        rig.outfitMount.add(wing);
      }
    }
  }

  // ============================================================================
  // 6. PROCEDURAL VFX ATLAS (360-INSTANCE POOL) & CONTACT SHADOW DECALS
  // ============================================================================
  function createVFXAtlasTexture() {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 256, 256);

    // Quadrant (0, 0) Top-Left in canvas (UV y=[0.5,1.0], x=[0,0.5]): Radial Bokeh
    {
      const g = ctx.createRadialGradient(64, 64, 2, 64, 64, 58);
      g.addColorStop(0, 'rgba(255,255,255,1.0)');
      g.addColorStop(0.35, 'rgba(255,255,255,0.65)');
      g.addColorStop(1, 'rgba(255,255,255,0.0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
    }

    // Quadrant (1, 0) Top-Right in canvas (UV y=[0.5,1.0], x=[0.5,1.0]): Starburst
    {
      const cx = 192, cy = 64;
      const g = ctx.createRadialGradient(cx, cy, 2, cx, cy, 46);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.5, 'rgba(255,255,255,0.35)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(128, 0, 128, 128);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath();
        ctx.ellipse(0, 0, 52, 6, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Quadrant (0, 1) Bottom-Left in canvas (UV y=[0,0.5], x=[0,0.5]): Slash Crescent
    {
      const cx = 64, cy = 192;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = 'rgba(255,255,255,0.95)';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, 8, 46, -Math.PI * 0.85, -Math.PI * 0.15);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.lineWidth = 24;
      ctx.beginPath();
      ctx.arc(0, 8, 46, -Math.PI * 0.82, -Math.PI * 0.18);
      ctx.stroke();
      ctx.restore();
    }

    // Quadrant (1, 1) Bottom-Right in canvas (UV y=[0,0.5], x=[0.5,1.0]): Shockwave Ring
    {
      const cx = 192, cy = 192;
      const g = ctx.createRadialGradient(cx, cy, 26, cx, cy, 58);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(0.45, 'rgba(255,255,255,0.95)');
      g.addColorStop(0.75, 'rgba(255,255,255,0.35)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(128, 128, 128, 128);
    }

    const tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    tex.needsUpdate = true;
    return tex;
  }

  const VFX_RECTS = {
    radial:    [0.0, 0.5, 0.5, 0.5],
    starburst: [0.5, 0.5, 0.5, 0.5],
    slash:     [0.0, 0.0, 0.5, 0.5],
    shockwave: [0.5, 0.0, 0.5, 0.5]
  };

  class VFXSystem {
    constructor(scene) {
      this.scene = scene;
      this.maxCount = 360;
      this.slots = [];
      this.cursor = 0;

      const geo = new THREE.PlaneGeometry(1, 1);
      this.atlasRects = new Float32Array(this.maxCount * 4);
      this.atlasAttr = new THREE.InstancedBufferAttribute(this.atlasRects, 4);
      this.atlasAttr.setUsage(THREE.DynamicDrawUsage);
      geo.setAttribute('aAtlasRect', this.atlasAttr);

      const mat = new THREE.MeshBasicMaterial({
        map: createVFXAtlasTexture(),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        toneMapped: false
      });

      mat.onBeforeCompile = (shader) => {
        shader.vertexShader = shader.vertexShader
          .replace('#include <uv_pars_vertex>', '#include <uv_pars_vertex>\nattribute vec4 aAtlasRect;')
          .replace('#include <uv_vertex>', '#include <uv_vertex>\n#ifdef USE_UV\n\tvUv = uv * aAtlasRect.zw + aAtlasRect.xy;\n#endif');
      };
      mat.customProgramCacheKey = () => 'vfx_atlas_instanced_v2';

      this.mesh = new THREE.InstancedMesh(geo, mat, this.maxCount);
      this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      this.mesh.frustumCulled = false;

      const zeroMat = new THREE.Matrix4().makeScale(0, 0, 0);
      const white = new THREE.Color(1, 1, 1);
      for (let i = 0; i < this.maxCount; i++) {
        this.slots.push({
          active: false,
          kind: 'burst',
          rect: VFX_RECTS.radial,
          x: 0, y: 0, z: 0,
          vx: 0, vy: 0, vz: 0,
          gravity: 0,
          age: 0, maxAge: 1,
          sizeStart: 0.4, sizeEnd: 0.1,
          stretchVel: false,
          flatGround: false,
          spin: 0,
          color: new THREE.Color(1, 1, 1)
        });
        this.mesh.setMatrixAt(i, zeroMat);
        this.mesh.setColorAt(i, white);
        this.atlasRects.set(VFX_RECTS.radial, i * 4);
      }
      this.mesh.instanceMatrix.needsUpdate = true;
      if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
      this.scene.add(this.mesh);

      // Seed 90 drifting warm sunlit pollen motes in slots 0..89
      this.moteCount = 90;
      const rng = mulberry32(2028);
      for (let i = 0; i < this.moteCount; i++) {
        const s = this.slots[i];
        s.active = true;
        s.kind = 'mote';
        s.rect = i % 4 === 0 ? VFX_RECTS.starburst : VFX_RECTS.radial;
        s.x = (rng() - 0.5) * 32;
        s.y = 0.6 + rng() * 9;
        s.z = (rng() - 0.5) * 32;
        s.vx = (rng() - 0.5) * 0.5;
        s.vy = 0.12 + rng() * 0.25;
        s.vz = (rng() - 0.5) * 0.5;
        s.age = rng() * 10;
        s.maxAge = 9999;
        s.sizeStart = 0.14 + rng() * 0.14;
        s.sizeEnd = s.sizeStart;
        s.color.setHex(i % 3 === 0 ? 0xffe89e : 0xfff8dc);
        this.atlasRects.set(s.rect, i * 4);
      }
      this.cursor = this.moteCount;

      this._mat4 = new THREE.Matrix4();
      this._pos = new THREE.Vector3();
      this._quat = new THREE.Quaternion();
      this._scale = new THREE.Vector3();
      this._euler = new THREE.Euler();
      this._tmpCol = new THREE.Color();
    }

    allocSlot() {
      for (let k = 0; k < this.maxCount - this.moteCount; k++) {
        const idx = this.moteCount + ((this.cursor - this.moteCount + k) % (this.maxCount - this.moteCount));
        if (!this.slots[idx].active) {
          this.cursor = idx + 1;
          return this.slots[idx];
        }
      }
      const idx = this.moteCount + (this.cursor % (this.maxCount - this.moteCount));
      this.cursor++;
      return this.slots[idx];
    }

    spawnBurst(x, y, z, colorHex = 0xffcf48, count = 12, kind = 'starburst') {
      const rect = VFX_RECTS[kind] || VFX_RECTS.starburst;
      for (let i = 0; i < count; i++) {
        const s = this.allocSlot();
        s.active = true;
        s.kind = 'burst';
        s.rect = rect;
        s.x = x;
        s.y = y;
        s.z = z;
        const a = Math.random() * Math.PI * 2;
        const sp = 2.5 + Math.random() * 6.5;
        s.vx = Math.cos(a) * sp;
        s.vy = 3.5 + Math.random() * 6.0;
        s.vz = Math.sin(a) * sp;
        s.gravity = 14;
        s.age = 0;
        s.maxAge = 0.55 + Math.random() * 0.35;
        s.sizeStart = 0.42 + Math.random() * 0.25;
        s.sizeEnd = 0.05;
        s.stretchVel = true;
        s.flatGround = false;
        s.spin = (Math.random() - 0.5) * 6;
        s.color.setHex(colorHex);
      }
    }

    spawnSlash(x, y, z, yaw = 0, colorHex = 0xfff099) {
      const s = this.allocSlot();
      s.active = true;
      s.kind = 'slash';
      s.rect = VFX_RECTS.slash;
      s.x = x;
      s.y = y;
      s.z = z;
      s.vx = 0;
      s.vy = 0.5;
      s.vz = 0;
      s.gravity = 0;
      s.age = 0;
      s.maxAge = 0.28;
      s.sizeStart = 2.2;
      s.sizeEnd = 3.4;
      s.stretchVel = false;
      s.flatGround = true;
      s.spin = yaw;
      s.color.setHex(colorHex);
    }

    spawnShockwave(x, y, z, colorHex = 0xffe088, maxRadius = 4.6) {
      const s = this.allocSlot();
      s.active = true;
      s.kind = 'shockwave';
      s.rect = VFX_RECTS.shockwave;
      s.x = x;
      s.y = y + 0.08;
      s.z = z;
      s.vx = 0;
      s.vy = 0;
      s.vz = 0;
      s.gravity = 0;
      s.age = 0;
      s.maxAge = 0.42;
      s.sizeStart = 0.8;
      s.sizeEnd = maxRadius;
      s.stretchVel = false;
      s.flatGround = true;
      s.spin = 0;
      s.color.setHex(colorHex);
    }

    spawnWisp(x, y, z, colorHex = 0xffe46b) {
      const s = this.allocSlot();
      s.active = true;
      s.kind = 'wisp';
      s.rect = VFX_RECTS.radial;
      s.x = x + (Math.random() - 0.5) * 1.1;
      s.y = y + (Math.random() - 0.5) * 0.6;
      s.z = z + (Math.random() - 0.5) * 1.1;
      s.vx = (Math.random() - 0.5) * 0.6;
      s.vy = 1.0 + Math.random() * 0.8;
      s.vz = (Math.random() - 0.5) * 0.6;
      s.gravity = -0.3;
      s.age = 0;
      s.maxAge = 0.9;
      s.sizeStart = 0.28;
      s.sizeEnd = 0.04;
      s.stretchVel = false;
      s.flatGround = false;
      s.spin = 0;
      s.color.setHex(colorHex);
    }

    update(dt, elapsed, camera, playerPos) {
      const camQuat = camera.quaternion;
      for (let i = 0; i < this.maxCount; i++) {
        const s = this.slots[i];
        if (!s.active) {
          this._scale.set(0, 0, 0);
          this._mat4.compose(this._pos.set(0, -500, 0), this._quat.identity(), this._scale);
          this.mesh.setMatrixAt(i, this._mat4);
          continue;
        }

        if (s.kind === 'mote') {
          s.age += dt;
          s.x += (s.vx + Math.sin(elapsed * 0.7 + i) * 0.25) * dt;
          s.y += (s.vy + Math.cos(elapsed * 0.9 + i * 0.5) * 0.12) * dt;
          s.z += (s.vz + Math.cos(elapsed * 0.6 + i) * 0.25) * dt;
          // Wrap around player so sunlit motes stay near camera
          if (s.x - playerPos.x > 18) s.x -= 36;
          if (s.x - playerPos.x < -18) s.x += 36;
          if (s.z - playerPos.z > 18) s.z -= 36;
          if (s.z - playerPos.z < -18) s.z += 36;
          if (s.y > playerPos.y + 11) s.y = playerPos.y + 0.4;
          if (s.y < playerPos.y - 1) s.y = playerPos.y + 9;

          const pulse = 0.55 + 0.45 * Math.sin(elapsed * 2.2 + i * 1.3);
          this._pos.set(s.x, s.y, s.z);
          this._scale.set(s.sizeStart, s.sizeStart, s.sizeStart);
          this._mat4.compose(this._pos, camQuat, this._scale);
          this.mesh.setMatrixAt(i, this._mat4);
          this._tmpCol.copy(s.color).multiplyScalar(pulse * 0.85);
          this.mesh.setColorAt(i, this._tmpCol);
          continue;
        }

        s.age += dt;
        if (s.age >= s.maxAge) {
          s.active = false;
          this._scale.set(0, 0, 0);
          this._mat4.compose(this._pos.set(0, -500, 0), this._quat.identity(), this._scale);
          this.mesh.setMatrixAt(i, this._mat4);
          continue;
        }

        const t = s.age / s.maxAge;
        s.vy -= s.gravity * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.z += s.vz * dt;

        const sz = s.sizeStart + (s.sizeEnd - s.sizeStart) * t;
        this._pos.set(s.x, s.y, s.z);
        if (s.flatGround) {
          this._euler.set(-Math.PI / 2, 0, s.spin + (s.kind === 'slash' ? t * 4.5 : 0));
          this._quat.setFromEuler(this._euler);
          this._scale.set(sz, sz, 1);
        } else {
          this._quat.copy(camQuat);
          const stretch = s.stretchVel ? Math.min(2.2, 1.0 + Math.hypot(s.vx, s.vy, s.vz) * 0.08) : 1.0;
          this._scale.set(sz, sz * stretch, 1);
        }
        this._mat4.compose(this._pos, this._quat, this._scale);
        this.mesh.setMatrixAt(i, this._mat4);
        this._tmpCol.copy(s.color).multiplyScalar(1.0 - t * t);
        this.mesh.setColorAt(i, this._tmpCol);
        this.atlasRects.set(s.rect, i * 4);
      }

      this.mesh.instanceMatrix.needsUpdate = true;
      if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
      this.atlasAttr.needsUpdate = true;
    }
  }

  // ============================================================================
  // 7. WORLD BUILDER, GPU GRASS & INFINITE PROCEDURAL WORLDSTREAMER
  // ============================================================================
  class CraftWorld {
    constructor(scene, materials, state, audio, vfx, onToast) {
      this.scene = scene;
      this.materials = materials;
      this.state = state;
      this.audio = audio;
      this.vfx = vfx;
      this.onToast = onToast;

      this.coreGroup = new THREE.Group();
      this.scene.add(this.coreGroup);

      this.coreEntities = this.makeBucket();
      this.chunks = new Map();
      this.boomerangs = [];
      this.waterMaterials = [];
      this.grassMaterials = [];
      this.lanternSources = [];
      this.contactShadowPool = [];

      // Shared Grass Geometry
      this.grassBladeGeo = createGrassBladeGeometry();
      this.bellGeo = createBellGeometry();
      this.balloonEnvelopeGeo = createBalloonEnvelopeGeo();

      // Pre-create Contact Shadow Decal Pool (28 soft decals)
      this.contactShadowGeo = new THREE.PlaneGeometry(1, 1);
      this.contactShadowGeo.rotateX(-Math.PI / 2);
      for (let i = 0; i < 28; i++) {
        const m = new THREE.Mesh(
          this.contactShadowGeo,
          new THREE.MeshBasicMaterial({
            map: this.materials.contactShadowTex,
            transparent: true,
            depthWrite: false,
            opacity: 0.48,
            polygonOffset: true,
            polygonOffsetFactor: -1
          })
        );
        m.visible = false;
        this.scene.add(m);
        this.contactShadowPool.push(m);
      }

      // Build Distant Shimmering Sea/Cloud Expanse at y = -18
      const distantWaterMat = createStylizedWaterMaterial({
        shallowColor: 0x3ec8e8,
        deepColor: 0x1e78be,
        foamColor: 0xffffff,
        fogNear: 180,
        fogFar: 520,
        opacity: 0.88
      });
      this.waterMaterials.push(distantWaterMat);
      this.distantOcean = new THREE.Mesh(new THREE.CircleGeometry(680, 64), distantWaterMat);
      this.distantOcean.rotation.x = -Math.PI / 2;
      this.distantOcean.position.set(0, -18, 0);
      this.scene.add(this.distantOcean);

      this.buildCoreContinent();
    }

    makeBucket() {
      return {
        colliders: [],
        movers: [],
        pianoKeys: [],
        bouncePads: [],
        grappleRings: [],
        zipRails: [],
        updrafts: [],
        orbs: [],
        bells: [],
        giftBoxes: [],
        enemies: [],
        critters: [],
        carryProps: [],
        flagpoles: [],
        windmills: [],
        interactables: []
      };
    }

    allBuckets() {
      const list = [this.coreEntities];
      for (const ch of this.chunks.values()) list.push(ch.entities);
      return list;
    }

    // ---- Shared Sculpted Builders ----
    addSculptedIsland(bucket, group, x, y, z, radius, depth, topMat, underMat, seed = 0, contourAmp = 0.32, tag = 'solid') {
      const topGeo = createIslandTopGeo(radius, 1.55, seed, contourAmp);
      const topMesh = new THREE.Mesh(topGeo, topMat);
      topMesh.position.set(x, y, z);
      topMesh.castShadow = true;
      topMesh.receiveShadow = true;
      group.add(topMesh);

      const underGeo = createIslandUnderbellyGeo(radius, depth, seed, -1.32);
      const underMesh = new THREE.Mesh(underGeo, underMat);
      underMesh.position.set(x, y, z);
      underMesh.castShadow = true;
      underMesh.receiveShadow = true;
      group.add(underMesh);

      // Decorative stitched felt rim cord
      const rimPts = [];
      for (let i = 0; i <= 32; i++) {
        const a = (i / 32) * Math.PI * 2;
        const rr = islandRadiusAt(a, radius, seed) * 0.99;
        rimPts.push(new THREE.Vector3(Math.cos(a) * rr, -0.18, Math.sin(a) * rr));
      }
      const rimCurve = new THREE.CatmullRomCurve3(rimPts, true);
      const rimCord = new THREE.Mesh(
        new THREE.TubeGeometry(rimCurve, 44, 0.08, 6, true),
        this.materials.getFeltMaterial('#fff7e2', '#fff', false)
      );
      rimCord.position.set(x, y, z);
      group.add(rimCord);

      // Hanging yarn tendrils & charm buttons under island rim
      const rng = mulberry32(Math.floor(Math.abs(seed * 1000) + Math.abs(x * 7) + Math.abs(z * 13)) + 17);
      const tendrilCount = Math.min(6, Math.max(3, Math.floor(radius / 5)));
      for (let i = 0; i < tendrilCount; i++) {
        const a = (i / tendrilCount) * Math.PI * 2 + rng() * 0.5;
        const rr = islandRadiusAt(a, radius, seed) * (0.65 + rng() * 0.25);
        const sx = x + Math.cos(a) * rr;
        const sz = z + Math.sin(a) * rr;
        const drop = 1.6 + rng() * 2.4;
        const tCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(sx, y - 1.35, sz),
          new THREE.Vector3(sx + Math.cos(a) * 0.45, y - 1.35 - drop * 0.5, sz + Math.sin(a) * 0.45),
          new THREE.Vector3(sx + Math.cos(a) * 0.25, y - 1.35 - drop, sz + Math.sin(a) * 0.25)
        ]);
        const tendril = new THREE.Mesh(
          new THREE.TubeGeometry(tCurve, 8, 0.065, 5, false),
          this.materials.getFeltMaterial(PIANO_COLORS[(i + Math.floor(seed)) % 8], '#fff', false)
        );
        group.add(tendril);

        const knot = new THREE.Mesh(
          new THREE.CylinderGeometry(0.24, 0.24, 0.08, 12),
          this.materials.getButtonMaterial(PIANO_COLORS[(i + 3) % 8])
        );
        knot.rotation.x = Math.PI / 2;
        knot.position.set(sx + Math.cos(a) * 0.25, y - 1.35 - drop, sz + Math.sin(a) * 0.25);
        group.add(knot);
      }

      const col = { kind: 'island', x, z, baseY: y, topY: y, radius, seed, contourAmp, tag, mesh: topMesh };
      bucket.colliders.push(col);
      return { topMesh, underMesh, col };
    }

    addCylinderPlatform(bucket, group, x, y, z, radius, height, topMat, sideMat, tag = 'solid') {
      const geo = new THREE.CylinderGeometry(radius, radius * 1.02, height, 28);
      const mats = [sideMat, topMat, sideMat];
      const mesh = new THREE.Mesh(geo, mats);
      mesh.position.set(x, y - height * 0.5, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);

      const seam = new THREE.Mesh(
        new THREE.TorusGeometry(radius * 0.96, 0.065, 8, 32),
        this.materials.getFeltMaterial('#ffffff', '#ffffff', false)
      );
      seam.rotation.x = Math.PI / 2;
      seam.position.set(x, y + 0.01, z);
      group.add(seam);

      const col = { kind: 'cylinder', x, z, radius, minY: y - height, topY: y, tag, mesh, dx: 0, dz: 0, dy: 0 };
      bucket.colliders.push(col);
      return { mesh, col };
    }

    addBoxPlatform(bucket, group, x, y, z, w, h, d, mat, tag = 'solid', bevelRadius = 0.22) {
      const geo = createRoundedBoxGeometry(w, h, d, 3, bevelRadius);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y - h * 0.5, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      const col = {
        kind: 'box',
        minX: x - w * 0.5, maxX: x + w * 0.5,
        minY: y - h, maxY: y,
        minZ: z - d * 0.5, maxZ: z + d * 0.5,
        topY: y,
        tag, mesh, dx: 0, dy: 0, dz: 0
      };
      bucket.colliders.push(col);
      return { mesh, col };
    }

    addDomeHill(bucket, group, x, y, z, radius, peakHeight, mat) {
      const geo = new THREE.SphereGeometry(radius, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.scale.set(1, peakHeight / radius, 1);
      mesh.position.set(x, y, z);
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      group.add(mesh);
      bucket.colliders.push({ kind: 'dome', x, z, radius, baseY: y, peakHeight, topY: y + peakHeight });
    }

    addButtonSteppingStone(bucket, group, x, y, z, radius, hexColor) {
      const mat = this.materials.getButtonMaterial(hexColor);
      const grp = new THREE.Group();
      grp.position.set(x, y, z);
      const base = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 0.96, 0.52, 28), mat);
      base.position.y = -0.26;
      base.castShadow = true;
      base.receiveShadow = true;
      const rim = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.93, 0.11, 8, 28), mat);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = -0.02;
      grp.add(base, rim);
      group.add(grp);
      bucket.colliders.push({ kind: 'cylinder', x, z, radius, minY: y - 0.55, topY: y, tag: 'button' });
    }

    addRopeBridge(bucket, group, pStart, pEnd, plankCount = 7) {
      const dist = pStart.distanceTo(pEnd);
      const dir = new THREE.Vector3().subVectors(pEnd, pStart).normalize();
      const side = new THREE.Vector3(-dir.z, 0, dir.x);
      const yaw = Math.atan2(dir.x, dir.z);

      for (let i = 0; i < plankCount; i++) {
        const t = (i + 0.5) / plankCount;
        const pos = new THREE.Vector3().lerpVectors(pStart, pEnd, t);
        pos.y -= Math.sin(t * Math.PI) * 0.35; // gentle catenary sag
        const plank = new THREE.Mesh(
          createRoundedBoxGeometry(3.4, 0.28, Math.max(0.85, (dist / plankCount) * 0.78), 2, 0.08),
          this.materials.woodMat
        );
        plank.position.copy(pos).setY(pos.y - 0.14);
        plank.rotation.y = yaw;
        plank.castShadow = true;
        plank.receiveShadow = true;
        group.add(plank);
      }

      // Walkable deck collider spanning bridge
      const mid = new THREE.Vector3().lerpVectors(pStart, pEnd, 0.5);
      const angle = Math.atan2(dir.x, dir.z);
      const steps = 4;
      for (let s = 0; s < steps; s++) {
        const t = (s + 0.5) / steps;
        const sp = new THREE.Vector3().lerpVectors(pStart, pEnd, t);
        sp.y -= Math.sin(t * Math.PI) * 0.28;
        bucket.colliders.push({
          kind: 'cylinder',
          x: sp.x, z: sp.z,
          radius: Math.max(2.0, dist / (steps * 1.4)),
          minY: sp.y - 0.6, topY: sp.y,
          tag: 'bridge'
        });
      }

      // Upright wooden spool posts + curved TubeGeometry ropes on both sides
      for (const sgn of [-1, 1]) {
        const ropePts = [];
        for (let k = 0; k <= 6; k++) {
          const t = k / 6;
          const pt = new THREE.Vector3().lerpVectors(pStart, pEnd, t);
          pt.addScaledVector(side, sgn * 1.75);
          pt.y += 1.05 - Math.sin(t * Math.PI) * 0.55;
          ropePts.push(pt);
        }
        const ropeGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ropePts), 16, 0.075, 6, false);
        const rope = new THREE.Mesh(ropeGeo, this.materials.ropeMat);
        rope.castShadow = true;
        group.add(rope);

        for (const endPt of [pStart, mid, pEnd]) {
          const post = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.20, 1.5, 10), this.materials.woodMat);
          post.position.copy(endPt).addScaledVector(side, sgn * 1.75);
          post.position.y += 0.55;
          post.castShadow = true;
          const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.14, 12), this.materials.woodMat);
          cap.position.y = 0.72;
          post.add(cap);
          group.add(post);
        }
      }
      void angle;
    }

    addBouncePad(bucket, group, x, y, z, power = 17.5) {
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.9, 0.65, 24), this.materials.spongeMat);
      pad.position.set(x, y + 0.32, z);
      pad.castShadow = true;
      pad.receiveShadow = true;
      group.add(pad);

      const springRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.32, 0.11, 10, 24),
        this.materials.getFeltMaterial('#fff5a8', '#fff', false)
      );
      springRing.rotation.x = Math.PI / 2;
      springRing.position.set(x, y + 0.66, z);
      group.add(springRing);

      bucket.bouncePads.push({ x, y: y + 0.65, z, radius: 1.85, power, mesh: pad, timer: 0 });
    }

    addGrappleRing(bucket, group, x, y, z) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.15, 12, 24), this.materials.brassMat);
      ring.position.set(x, y, z);
      ring.castShadow = true;
      group.add(ring);

      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 12, 10),
        new THREE.MeshBasicMaterial({ color: 0xffe875 })
      );
      ring.add(core);
      bucket.grappleRings.push({ x, y, z, mesh: ring });
    }

    addZipRail(bucket, group, pStart, pEnd, colorHex = 0x48f5ff) {
      const mid = pStart.clone().lerp(pEnd, 0.5);
      mid.y -= 1.2;
      const curve = new THREE.QuadraticBezierCurve3(pStart, mid, pEnd);
      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 24, 0.16, 8, false),
        new THREE.MeshStandardMaterial({
          color: colorHex, emissive: colorHex, emissiveIntensity: 0.95, roughness: 0.3
        })
      );
      group.add(tube);
      for (const p of [pStart, pEnd]) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 2.4, 12), this.materials.woodMat);
        post.position.set(p.x, p.y - 1.1, p.z);
        post.castShadow = true;
        group.add(post);
      }
      bucket.zipRails.push({ curve, start: pStart, end: pEnd, mesh: tube });
    }

    addDreamerOrb(bucket, group, x, y, z, id) {
      if (this.state.collectedOrbIds.has(id)) return;
      const grp = new THREE.Group();
      grp.position.set(x, y, z);

      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.75, 22, 18),
        new THREE.MeshStandardMaterial({
          color: 0xffe46b,
          emissive: 0xffaa22,
          emissiveIntensity: 1.55,
          roughness: 0.15,
          metalness: 0.25
        })
      );
      grp.add(sphere);

      const halo = new THREE.Mesh(
        new THREE.TorusGeometry(1.12, 0.085, 10, 28),
        new THREE.MeshStandardMaterial({
          color: 0x48f0ff,
          emissive: 0x22d3ee,
          emissiveIntensity: 1.5
        })
      );
      grp.add(halo);
      group.add(grp);
      bucket.orbs.push({ id, x, y, z, baseY: y, mesh: grp, halo, collected: false, wispTimer: 0 });
    }

    addBell(bucket, group, x, y, z) {
      const grp = new THREE.Group();
      grp.position.set(x, y, z);
      const bellMat = new THREE.MeshStandardMaterial({
        color: 0xffd43b, emissive: 0xf59e0b, emissiveIntensity: 0.65, metalness: 0.62, roughness: 0.22
      });
      const bellBody = new THREE.Mesh(this.bellGeo, bellMat);
      const clapper = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), this.materials.brassMat);
      clapper.position.y = -0.22;
      grp.add(bellBody, clapper);
      group.add(grp);
      bucket.bells.push({ x, y, z, baseY: y, mesh: grp, collected: false });
    }

    addGiftBox(bucket, group, x, y, z) {
      const grp = new THREE.Group();
      grp.position.set(x, y + 0.72, z);
      const box = new THREE.Mesh(createRoundedBoxGeometry(1.42, 1.42, 1.42, 3, 0.16), this.materials.cardboardMat);
      box.castShadow = true;
      box.receiveShadow = true;
      grp.add(box);
      const ribbonMat = this.materials.getFeltMaterial('#eb4d70', '#fff', false);
      const r1 = new THREE.Mesh(createRoundedBoxGeometry(1.48, 1.48, 0.26, 2, 0.06), ribbonMat);
      const r2 = new THREE.Mesh(createRoundedBoxGeometry(0.26, 1.48, 1.48, 2, 0.06), ribbonMat);
      grp.add(r1, r2);
      for (const sx of [-0.18, 0.18]) {
        const bow = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.05, 8, 14), ribbonMat);
        bow.position.set(sx, 0.80, 0);
        bow.rotation.y = sx < 0 ? 0.45 : -0.45;
        grp.add(bow);
      }
      group.add(grp);
      bucket.giftBoxes.push({ x, y: y + 0.72, z, mesh: grp, broken: false });
    }

    addEnemy(bucket, group, x, y, z, kind = 'goofbot', patrolRadius = 3.2) {
      const grp = new THREE.Group();
      grp.position.set(x, y, z);
      if (kind === 'goofbot') {
        const body = new THREE.Mesh(createRoundedBoxGeometry(1.12, 1.12, 1.0, 3, 0.16), this.materials.cardboardMat);
        body.position.y = 0.76;
        body.castShadow = true;
        grp.add(body);
        const visor = new THREE.Mesh(createRoundedBoxGeometry(0.86, 0.34, 0.16, 2, 0.06), new THREE.MeshStandardMaterial({ color: 0x261d18, roughness: 0.3 }));
        visor.position.set(0, 0.90, 0.48);
        grp.add(visor);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff3b3b });
        const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), eyeMat);
        e1.position.set(-0.20, 0.90, 0.54);
        const e2 = e1.clone();
        e2.position.x = 0.20;
        grp.add(e1, e2);
        const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.44, 8), this.materials.brassMat);
        ant.position.y = 1.48;
        const tip = new THREE.Mesh(new THREE.SphereGeometry(0.10, 8, 8), eyeMat);
        tip.position.y = 1.70;
        grp.add(ant, tip);
        for (const fx of [-0.30, 0.30]) {
          const foot = new THREE.Mesh(createRoundedBoxGeometry(0.28, 0.18, 0.36, 2, 0.06), this.materials.woodMat);
          foot.position.set(fx, 0.10, 0.05);
          grp.add(foot);
        }
      } else {
        const puff = new THREE.Mesh(
          new THREE.SphereGeometry(0.70, 18, 16),
          this.materials.getKnitMaterial('#ff5e99', '#ffd4e6')
        );
        puff.position.y = 0.72;
        puff.castShadow = true;
        grp.add(puff);
        const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), new THREE.MeshBasicMaterial({ color: 0x1a120c }));
        e1.position.set(-0.20, 0.84, 0.63);
        const e2 = e1.clone();
        e2.position.x = 0.20;
        grp.add(e1, e2);
        for (const sx of [-0.28, 0.28]) {
          const ear = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8), this.materials.getFeltMaterial('#ffd4e6'));
          ear.position.set(sx, 1.32, 0);
          grp.add(ear);
        }
      }
      group.add(grp);
      bucket.enemies.push({
        kind, homeX: x, homeZ: z, x, y, z, baseY: y,
        patrolRadius, phase: Math.random() * Math.PI * 2,
        mesh: grp, alive: true
      });
    }

    addButtonCritter(bucket, group, x, y, z, id) {
      if (this.state.rescuedCritterIds.has(id)) return;
      const grp = new THREE.Group();
      grp.position.set(x, y, z);
      const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 16, 14),
        this.materials.getKnitMaterial('#ff96b8', '#fff')
      );
      body.position.y = 0.45;
      body.castShadow = true;
      grp.add(body);
      const face = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.32, 0.08, 18),
        this.materials.getButtonMaterial('#ffe066')
      );
      face.rotation.x = Math.PI / 2;
      face.position.set(0, 0.52, 0.41);
      grp.add(face);
      for (const sx of [-0.20, 0.20]) {
        const ear = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), this.materials.getFeltMaterial('#ff7096'));
        ear.position.set(sx, 0.88, 0);
        grp.add(ear);
      }
      group.add(grp);
      bucket.critters.push({
        id, x, y, z, baseY: y, vx: 0, vy: 0, vz: 0,
        mesh: grp, carried: false, rescued: false, phase: Math.random() * 6
      });
    }

    addCarryProp(bucket, group, x, y, z, kind = 'yarnball') {
      let mesh;
      if (kind === 'yarnball') {
        mesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.56, 18, 16),
          this.materials.getKnitMaterial('#ff5e7e', '#fff')
        );
      } else {
        mesh = new THREE.Mesh(
          createRoundedBoxGeometry(0.96, 0.96, 0.96, 3, 0.18),
          this.materials.spongeMat
        );
      }
      mesh.position.set(x, y + 0.55, z);
      mesh.castShadow = true;
      group.add(mesh);
      bucket.carryProps.push({
        kind, x, y: y + 0.55, z, vx: 0, vy: 0, vz: 0, mesh, carried: false
      });
    }

    // Lush Organic Craft Tree (Curved TubeGeometry Trunk + Flared Roots + 5-7 Puffy Noise Canopy Lobes)
    addCraftTree(group, x, y, z, scale = 1, crownColor = '#4ad178', seed = 1) {
      const treeGrp = new THREE.Group();
      treeGrp.position.set(x, y, z);
      const rng = mulberry32(Math.floor(Math.abs(x * 37 + z * 91 + seed * 17)) + 5);

      const leanX = (rng() - 0.5) * 0.45 * scale;
      const leanZ = (rng() - 0.5) * 0.45 * scale;
      const trunkCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.08, 0),
        new THREE.Vector3(leanX * 0.45, 1.35 * scale, leanZ * 0.45),
        new THREE.Vector3(leanX, 2.75 * scale, leanZ)
      ]);
      const trunk = new THREE.Mesh(
        new THREE.TubeGeometry(trunkCurve, 10, 0.30 * scale, 9, false),
        this.materials.woodMat
      );
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      treeGrp.add(trunk);

      // Flared root buttresses
      for (let r = 0; r < 3; r++) {
        const ra = (r / 3) * Math.PI * 2 + rng() * 0.7;
        const rCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(Math.cos(ra) * 0.14 * scale, 0.42 * scale, Math.sin(ra) * 0.14 * scale),
          new THREE.Vector3(Math.cos(ra) * 0.58 * scale, 0.08 * scale, Math.sin(ra) * 0.58 * scale)
        ]);
        const rootMesh = new THREE.Mesh(
          new THREE.TubeGeometry(rCurve, 5, 0.14 * scale, 6, false),
          this.materials.woodMat
        );
        rootMesh.castShadow = true;
        treeGrp.add(rootMesh);
      }

      // 6 Noise-Sculpted Icosahedron Puffy Felt Canopy Lobes
      const foliageMat = this.materials.getFeltMaterial(crownColor, '#e8ffe8', false, 1, true);
      const lobeCount = 6;
      for (let i = 0; i < lobeCount; i++) {
        const isTop = i === 0;
        const a = (i / (lobeCount - 1)) * Math.PI * 2 + rng() * 0.4;
        const rad = (isTop ? 1.25 : 0.95 + rng() * 0.25) * scale;
        const lobeGeo = createNoiseCanopyGeo(rad, seed + i * 3.1);
        const lobe = new THREE.Mesh(lobeGeo, foliageMat);
        const lx = leanX + (isTop ? 0 : Math.cos(a) * 0.95 * scale);
        const ly = (isTop ? 3.85 : 2.95 + rng() * 0.55) * scale;
        const lz = leanZ + (isTop ? 0 : Math.sin(a) * 0.95 * scale);
        lobe.position.set(lx, ly, lz);
        lobe.castShadow = true;
        lobe.receiveShadow = true;
        treeGrp.add(lobe);
      }

      group.add(treeGrp);
    }

    addFeltShrub(group, x, y, z, scale = 1, colorHex = '#3bc96f', seed = 2) {
      const shrubGrp = new THREE.Group();
      shrubGrp.position.set(x, y, z);
      const mat = this.materials.getFeltMaterial(colorHex, '#e8ffe8', false, 1, true);
      for (let i = 0; i < 3; i++) {
        const puff = new THREE.Mesh(createNoiseCanopyGeo((0.55 + (i === 0 ? 0.15 : 0)) * scale, seed + i * 2.1), mat);
        puff.position.set((i - 1) * 0.42 * scale, (i === 0 ? 0.42 : 0.30) * scale, ((i % 2) - 0.5) * 0.25 * scale);
        puff.castShadow = true;
        shrubGrp.add(puff);
      }
      group.add(shrubGrp);
    }

    // Layered Rounded Petal Flower + Button Core
    addPaperFlower(group, x, y, z, petalColor = '#ff6b9d') {
      const grp = new THREE.Group();
      grp.position.set(x, y, z);
      const stemCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.06, 0.42, 0.04),
        new THREE.Vector3(0, 0.84, 0)
      ]);
      const stem = new THREE.Mesh(
        new THREE.TubeGeometry(stemCurve, 6, 0.055, 6, false),
        this.materials.getFeltMaterial('#36b562', '#fff', false)
      );
      grp.add(stem);

      const petalMat = this.materials.getFeltMaterial(petalColor, '#fff', false);
      const head = new THREE.Group();
      head.position.y = 0.86;
      head.rotation.x = 0.2;
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const petal = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), petalMat);
        petal.scale.set(1.0, 0.35, 1.35);
        petal.position.set(Math.cos(a) * 0.28, 0, Math.sin(a) * 0.28);
        petal.rotation.y = -a + Math.PI / 2;
        head.add(petal);
      }
      const centerBtn = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 0.09, 14),
        this.materials.getButtonMaterial('#ffd43b')
      );
      centerBtn.position.y = 0.04;
      head.add(centerBtn);
      grp.add(head);
      group.add(grp);
    }

    // GPU-Instanced 3D Swaying Grass Patch
    buildInstancedGrass(group, count, sampleFn, colorA = 0x1b8a3b, colorB = 0x68c938, seed = 101) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.92,
        metalness: 0.0,
        vertexColors: true,
        envMapIntensity: 0.18,
        side: THREE.DoubleSide
      });

      const uTimeRef = this.materials.sharedUniforms.uTime;
      mat.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = uTimeRef;
        shader.vertexShader = shader.vertexShader
          .replace('#include <common>', '#include <common>\nuniform float uTime;')
          .replace(
            '#include <begin_vertex>',
            `#include <begin_vertex>
             #ifdef USE_INSTANCING
               vec2 instXZ = instanceMatrix[3].xz;
               float wave = sin(instXZ.x * 0.18 + uTime * 2.2) * cos(instXZ.y * 0.16 + uTime * 1.7);
               float swayMask = uv.y * uv.y;
               transformed.x += wave * 0.26 * swayMask;
               transformed.z += sin(instXZ.y * 0.21 - uTime * 1.9) * 0.16 * swayMask;
             #endif`
          );
      };
      mat.customProgramCacheKey = () => 'grass_wind_v2';
      this.grassMaterials.push(mat);

      const instMesh = new THREE.InstancedMesh(this.grassBladeGeo, mat, count);
      instMesh.receiveShadow = true;

      const rng = mulberry32(seed);
      const dummy = new THREE.Object3D();
      const colA = new THREE.Color(colorA);
      const colB = new THREE.Color(colorB);
      const tmpCol = new THREE.Color();

      let placed = 0;
      let attempts = 0;
      while (placed < count && attempts < count * 4) {
        attempts++;
        const pt = sampleFn(rng);
        if (!pt) continue;
        dummy.position.set(pt.x, pt.y - 0.02, pt.z);
        dummy.rotation.set((rng() - 0.5) * 0.22, rng() * Math.PI * 2, (rng() - 0.5) * 0.22);
        const hScale = 0.75 + rng() * 0.65;
        dummy.scale.set(0.85 + rng() * 0.45, hScale, 1.0);
        dummy.updateMatrix();
        instMesh.setMatrixAt(placed, dummy.matrix);

        tmpCol.copy(colA).lerp(colB, rng());
        instMesh.setColorAt(placed, tmpCol);
        placed++;
      }
      instMesh.count = placed;
      instMesh.instanceMatrix.needsUpdate = true;
      if (instMesh.instanceColor) instMesh.instanceColor.needsUpdate = true;
      group.add(instMesh);
      return instMesh;
    }

    // ---- Build 5 Seamless Core Biomes ----
    buildCoreContinent() {
      const b = this.coreEntities;
      const g = this.coreGroup;

      const meadowTop = this.materials.getFeltMaterial('#2ca34f', '#ffffff', true, 3, true);
      const meadowHillMat = this.materials.getFeltMaterial('#2ca34f', '#ffffff', true, 2, false);
      const velvetTop = this.materials.getFeltMaterial('#5e40b8', '#f8e6ff', true, 2, true);
      const origamiTop = this.materials.getFeltMaterial('#de6c35', '#fff2db', true, 2, true);
      const corkTop = this.materials.getFeltMaterial('#cc9f68', '#ffffff', true, 2, true);

      // 1. SOARING STITCHING MEADOWS (0, 0) - Sculpted Floating Island
      const meadowSeed = 11.3;
      const meadowContour = 0.30;
      const meadowSurfY = (x, z) => {
        let y = islandSurfaceOffset(x, z, 34, meadowSeed, meadowContour);
        for (const [hx, hz, hr, hp] of [[-18, 10, 8.5, 3.2], [19, 12, 7.5, 2.8], [-12, -21, 6.5, 2.4]]) {
          const d = Math.hypot(x - hx, z - hz);
          if (d < hr) {
            const dy = hp * Math.sqrt(Math.max(0, 1 - (d / hr) * (d / hr)));
            if (dy > y) y = dy;
          }
        }
        return y;
      };

      this.addSculptedIsland(b, g, 0, 0, 0, 34, 11.5, meadowTop, this.materials.rockUnderMat, meadowSeed, meadowContour);
      this.addDomeHill(b, g, -18, 0, 10, 8.5, 3.2, meadowHillMat);
      this.addDomeHill(b, g, 19, 0, 12, 7.5, 2.8, meadowHillMat);
      this.addDomeHill(b, g, -12, 0, -21, 6.5, 2.4, meadowHillMat);

      // 9,600 GPU-instanced swaying 3D grass blades across Stitching Meadows
      this.buildInstancedGrass(g, 9600, (rng) => {
        const ang = rng() * Math.PI * 2;
        const maxR = islandRadiusAt(ang, 34, meadowSeed) * 0.93;
        const rad = Math.sqrt(rng()) * maxR;
        const gx = Math.cos(ang) * rad;
        const gz = Math.sin(ang) * rad;
        // Clear around Caravan, Balloon Pad, Bounce Pad, and Piano Bridge Approach
        if (Math.hypot(gx + 14, gz + 10) < 5.6) return null;
        if (Math.hypot(gx - 15, gz + 11) < 4.8) return null;
        if (Math.hypot(gx - 9, gz - 12) < 2.6) return null;
        if (Math.abs(gx) < 3.6 && gz < -18) return null;
        return { x: gx, y: meadowSurfY(gx, gz), z: gz };
      }, 0x1b8a3b, 0x72cf3c, 8801);

      // Organic Craft Trees, Shrubs & Layered Flowers
      [[-24, -4, 1.2], [-20, 18, 1.0], [23, 18, 1.15], [25, -4, 1.0], [-8, 24, 1.2]].forEach(([tx, tz, sc], idx) => {
        const ty = islandSurfaceOffset(tx, tz, 34, meadowSeed, meadowContour);
        this.addCraftTree(g, tx, ty, tz, sc, '#2fb85c', 20 + idx * 7);
        this.addFeltShrub(g, tx + 2.2, ty, tz + 1.4, sc * 0.7, '#3cd46d', 40 + idx);
      });
      for (let i = 0; i < 18; i++) {
        const ang = (i / 18) * Math.PI * 2;
        const r = 13 + (i % 3) * 6;
        const fx = Math.cos(ang) * r;
        const fz = Math.sin(ang) * r;
        if (Math.hypot(fx + 14, fz + 10) < 5.5 || Math.hypot(fx - 15, fz + 11) < 4.6) continue;
        this.addPaperFlower(g, fx, meadowSurfY(fx, fz), fz, PIANO_COLORS[i % PIANO_COLORS.length]);
      }

      // Upgraded ZomZom's Costume Caravan at (-14, y, -10)
      this.buildZomZomCaravan(b, g, -14, islandSurfaceOffset(-14, -10, 34, meadowSeed, meadowContour), -10);

      // Upgraded Hot-Air Yarn Balloon Fast-Travel Pad at (15, y, -11)
      this.buildBalloonPad(b, g, 15, islandSurfaceOffset(15, -11, 34, meadowSeed, meadowContour), -11);

      // Musical Rainbow Piano Bridge heading North from Meadows (z = -26 to -50)
      for (let i = 0; i < 8; i++) {
        const kz = -26 - i * 3.4;
        const kx = Math.sin(i * 0.35) * 1.4;
        const ky = 0.55 + i * 0.25;
        const mat = this.materials.getFeltMaterial(PIANO_COLORS[i], '#ffffff', false);
        const keyMat = mat.clone();
        const { mesh, col } = this.addBoxPlatform(b, g, kx, ky, kz, 5.2, 0.85, 2.7, keyMat, 'piano', 0.16);
        b.pianoKeys.push({
          noteIdx: i, mesh, col, baseColor: new THREE.Color(PIANO_COLORS[i]), glow: 0
        });
      }

      // Rotating Thread-Spool Bridge continuing North (-59 to -83)
      for (let i = 0; i < 3; i++) {
        const sz = -59 - i * 12;
        const { mesh, col } = this.addCylinderPlatform(
          b, g, 0, 2.5 + i * 0.4, sz, 4.4, 2.4,
          this.materials.woodMat, this.materials.getKnitMaterial(PIANO_COLORS[(i + 2) % 8]), 'spool'
        );
        b.movers.push({ kind: 'spin', mesh, col, speed: (i % 2 === 0 ? 1 : -1) * 0.7 });
      }

      // Glossy Button Stepping Stones + Rope Bridges to East, West & South
      for (let i = 0; i < 5; i++) {
        this.addButtonSteppingStone(b, g, 40 + i * 11, 0.3 + (i % 2) * 0.5, (i % 2 === 0 ? 2 : -2), 3.7, PIANO_COLORS[i]);
        this.addButtonSteppingStone(b, g, -40 - i * 11, 0.6 + i * 0.35, (i % 2 === 0 ? -2 : 2), 3.7, PIANO_COLORS[(i + 4) % 8]);
        this.addButtonSteppingStone(b, g, (i % 2 === 0 ? 2.5 : -2.5), 0.3 + i * 0.35, 40 + i * 11, 3.8, PIANO_COLORS[(i + 2) % 8]);
      }
      // Wooden Plank Rope Bridges linking East & West Stepping Stones to Biomes
      this.addRopeBridge(b, g, new THREE.Vector3(88, 0.6, 2), new THREE.Vector3(106, 1.5, 0), 7);
      this.addRopeBridge(b, g, new THREE.Vector3(-88, 2.0, 2), new THREE.Vector3(-106, 2.5, 0), 7);

      // Meadows Gameplay Props, Critters & Orbs
      this.addBouncePad(b, g, 9, meadowSurfY(9, 12), 12, 17);
      this.addDreamerOrb(b, g, 0, 2.2, -16, 'core_meadow_1');
      this.addDreamerOrb(b, g, 9, 8.5, 12, 'core_meadow_2');
      this.addButtonCritter(b, g, -6, meadowSurfY(-6, 8), 8, 'crit_meadow_1');
      this.addButtonCritter(b, g, 8, meadowSurfY(8, 4), 4, 'crit_meadow_2');
      this.addCarryProp(b, g, -8.5, meadowSurfY(-8.5, 13.5), 13.5, 'yarnball');
      this.addCarryProp(b, g, 6, meadowSurfY(6, 15), 15, 'springcube');
      this.addGiftBox(b, g, -10, meadowSurfY(-10, 4), 4);
      this.addGiftBox(b, g, 11, meadowSurfY(11, 6), 6);
      for (let i = 0; i < 8; i++) {
        const bx = Math.cos(i * 0.78) * 10;
        const bz = Math.sin(i * 0.78) * 10;
        this.addBell(b, g, bx, meadowSurfY(bx, bz) + 1.1, bz);
      }

      // 2. CARDBOARD CASTLE PEAKS (North: 0, -130)
      this.addBoxPlatform(b, g, 0, 3.2, -130, 56, 9, 54, this.materials.cardboardMat, 'solid', 0.45);
      this.addBoxPlatform(b, g, 0, 7.2, -142, 34, 4.5, 18, this.materials.cardboardMat, 'solid', 0.35);
      this.addBoxPlatform(b, g, 0, 12.2, -148, 16, 5.2, 12, this.materials.cardboardMat, 'solid', 0.32);

      // Recessed Arched Doorway on Keep Front
      const archFrame = new THREE.Mesh(
        new THREE.TorusGeometry(2.6, 0.55, 10, 20, Math.PI),
        this.materials.woodMat
      );
      archFrame.position.set(0, 7.2, -133.0);
      g.add(archFrame);
      const archVoid = new THREE.Mesh(
        new THREE.CylinderGeometry(2.3, 2.3, 0.4, 16),
        new THREE.MeshStandardMaterial({ color: 0x2c1b12, roughness: 0.95 })
      );
      archVoid.rotation.x = Math.PI / 2;
      archVoid.position.set(0, 7.2, -133.1);
      g.add(archVoid);

      // Castle Corner Turrets with Flag Pennants + Masking-Tape Patches + Battlement Merlons
      for (const tx of [-20, 20]) {
        this.addBoxPlatform(b, g, tx, 9.5, -118, 9, 6.5, 9, this.materials.cardboardMat, 'solid', 0.30);
        // Rounded turret cap & pennant
        const turret = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.5, 4.2, 16), this.materials.cardboardMat);
        turret.position.set(tx, 11.6, -121.5);
        turret.castShadow = true;
        g.add(turret);
        const pennantPole = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.12, 3.2, 8), this.materials.brassMat);
        pennantPole.position.set(tx, 15.0, -121.5);
        const pennant = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.0, 3, 2), this.materials.flagMat);
        pennant.position.set(tx + 0.9, 16.0, -121.5);
        g.add(pennantPole, pennant);

        // Detailed Pencil-and-Erasertip Windmills
        const mill = this.buildPencilWindmill(g, tx, 9.5, -113);
        b.windmills.push(mill);
      }
      // Battlement merlons along castle rim
      for (let mx = -14; mx <= 14; mx += 4.6) {
        if (Math.abs(mx) < 3.0) continue;
        const merlon = new THREE.Mesh(createRoundedBoxGeometry(2.2, 1.4, 1.4, 2, 0.14), this.materials.cardboardMat);
        merlon.position.set(mx, 7.9, -133.2);
        merlon.castShadow = true;
        g.add(merlon);
      }
      // 3D Masking-tape patches on main keep
      const tapeMat = this.materials.getFeltMaterial('#f5e6bf', '#d5bf8e', false);
      for (const [tx, ty, tz, rot] of [[-12, 1.2, -103, 0.25], [14, 1.6, -103, -0.3], [-5, 10.2, -142, 0.18]]) {
        const tape = new THREE.Mesh(createRoundedBoxGeometry(3.6, 0.8, 0.12, 2, 0.04), tapeMat);
        tape.position.set(tx, ty, tz);
        tape.rotation.z = rot;
        g.add(tape);
      }

      this.addBouncePad(b, g, -12, 3.2, -118, 19);
      this.addBouncePad(b, g, 12, 7.2, -136, 18);
      this.addDreamerOrb(b, g, 0, 14.5, -148, 'core_castle_1');
      this.addDreamerOrb(b, g, -20, 11.6, -118, 'core_castle_2');
      this.addEnemy(b, g, -9, 3.2, -124, 'goofbot', 4);
      this.addEnemy(b, g, 9, 3.2, -124, 'goofbot', 4);
      this.addGiftBox(b, g, 0, 7.2, -135);
      this.addButtonCritter(b, g, 18, 3.2, -128, 'crit_castle_1');

      // 3. BUTTON BAY & SPONGE REEF (East: +130, 0) - Stylized GLSL Water & Foam
      const bayWaterMat = createStylizedWaterMaterial({
        shallowColor: 0x35ebe0,
        deepColor: 0x0e6fb3,
        foamColor: 0xffffff,
        centerX: 130,
        centerZ: 0,
        edgeFadeRadius: 76,
        opacity: 0.92,
        island0: new THREE.Vector4(130, 0, 24, 1),
        island1: new THREE.Vector4(146, -16, 6.5, 1),
        island2: new THREE.Vector4(152, 10, 6.5, 1),
        island3: new THREE.Vector4(122, 22, 6.0, 1)
      });
      this.waterMaterials.push(bayWaterMat);
      const ocean = new THREE.Mesh(new THREE.CircleGeometry(76, 64), bayWaterMat);
      ocean.rotation.x = -Math.PI / 2;
      ocean.position.set(130, -3.4, 0);
      g.add(ocean);

      this.addSculptedIsland(b, g, 130, 1.5, 0, 24, 9.0, corkTop, this.materials.rockUnderMat, 33.7, 0.25);
      this.addButtonSteppingStone(b, g, 146, 3.2, -16, 6.5, '#ff595e');
      this.addButtonSteppingStone(b, g, 152, 4.8, 10, 6.5, '#ffca3a');
      this.addButtonSteppingStone(b, g, 122, 3.0, 22, 6.0, '#1982c4');
      for (const [gx, gz] of [[138, -8], [136, 14]]) {
        const geyserRing = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.22, 10, 24), this.materials.getFeltMaterial('#7ef9ff', '#fff', false));
        geyserRing.rotation.x = Math.PI / 2;
        geyserRing.position.set(gx, 1.65, gz);
        g.add(geyserRing);
        b.updrafts.push({ x: gx, y: 1.5, z: gz, radius: 2.6, height: 14, power: 24 });
      }
      this.addDreamerOrb(b, g, 146, 5.4, -16, 'core_bay_1');
      this.addDreamerOrb(b, g, 152, 7.0, 10, 'core_bay_2');
      this.addGiftBox(b, g, 122, 3.0, 22);
      this.addGiftBox(b, g, 130, 1.5, -10);
      this.addEnemy(b, g, 132, 1.5, 8, 'pompom', 3.5);
      this.addButtonCritter(b, g, 124, 1.5, -6, 'crit_bay_1');

      // 4. VELVET CLOUDWORKS & CLOCKWORK LOFT (West: -130, 0)
      this.addSculptedIsland(b, g, -130, 2.5, 0, 25, 10.0, velvetTop, this.materials.rockUnderMat, 55.1, 0.26);
      const velvetSide = this.materials.getFeltMaterial('#382278', '#dfd1ff', false, 2);
      for (let i = 0; i < 2; i++) {
        const gx = -146;
        const gz = i === 0 ? -18 : 18;
        const { mesh, col } = this.addCylinderPlatform(b, g, gx, 4.2, gz, 7.5, 1.6, this.materials.brassMat, velvetSide, 'gear');
        b.movers.push({ kind: 'spin', mesh, col, speed: i === 0 ? 0.55 : -0.55 });
      }
      this.addGrappleRing(b, g, -136, 10.5, -9);
      this.addGrappleRing(b, g, -136, 10.5, 9);
      this.addGrappleRing(b, g, -118, 9.5, 0);
      for (const [lx, ly, lz] of [[-144, 11, -6], [-144, 12, 6], [-122, 10, -18]]) {
        const lan = new THREE.Mesh(
          new THREE.SphereGeometry(1.4, 16, 12),
          new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xff9f1c, emissiveIntensity: 0.9 })
        );
        lan.position.set(lx, ly, lz);
        g.add(lan);
        this.lanternSources.push({ x: lx, y: ly, z: lz, color: 0xffb347, intensity: 1.5, distance: 18 });
      }
      this.addBouncePad(b, g, -124, 2.5, -10, 18);
      this.addDreamerOrb(b, g, -146, 6.4, -18, 'core_clock_1');
      this.addDreamerOrb(b, g, -146, 6.4, 18, 'core_clock_2');
      this.addEnemy(b, g, -130, 2.5, 10, 'goofbot', 4);
      this.addButtonCritter(b, g, -126, 2.5, -4, 'crit_clock_1');

      // 5. ORIGAMI CANYON & CONFETTI PEAK (South: 0, +130)
      this.addSculptedIsland(b, g, 0, 2.2, 130, 27, 10.5, origamiTop, this.materials.rockUnderMat, 77.4, 0.28);
      this.addBoxPlatform(b, g, -14, 5.5, 142, 13, 3.5, 12, origamiTop, 'solid', 0.30);
      this.addBoxPlatform(b, g, 14, 8.2, 144, 13, 6.2, 12, origamiTop, 'solid', 0.30);
      this.addZipRail(b, g, new THREE.Vector3(-12, 4.2, 118), new THREE.Vector3(12, 10.2, 142), 0x48f5ff);
      this.addZipRail(b, g, new THREE.Vector3(0, 2.4, 86), new THREE.Vector3(0, 3.8, 112), 0xff70a6);
      b.updrafts.push({ x: -14, y: 5.5, z: 142, radius: 3.2, height: 12, power: 22 });
      this.addBouncePad(b, g, 2, 2.2, 136, 18.5);
      this.addDreamerOrb(b, g, 14, 10.4, 144, 'core_origami_1');
      this.addDreamerOrb(b, g, -14, 7.8, 142, 'core_origami_2');
      this.addEnemy(b, g, 4, 2.2, 124, 'pompom', 4.5);
      this.addGiftBox(b, g, -6, 2.2, 128);
      this.addButtonCritter(b, g, 8, 2.2, 132, 'crit_origami_1');

      // Scenic Corner Sky-Islands
      const corners = [
        [105, -105, '#6e4bc9'], [-105, -105, '#36ad57'],
        [105, 105, '#24b5b2'], [-105, 105, '#9bc9f2']
      ];
      for (let i = 0; i < corners.length; i++) {
        const [cx, cz, colHex] = corners[i];
        this.addSculptedIsland(
          b, g, cx, 3.5, cz, 14, 7.5,
          this.materials.getFeltMaterial(colHex, '#fff', true, 2, true),
          this.materials.rockUnderMat,
          90 + i * 11, 0.24
        );
        this.addCraftTree(g, cx - 4, 3.5, cz - 3, 1.1, colHex, 120 + i);
        this.addDreamerOrb(b, g, cx + 3, 5.8, cz + 2, `core_corner_${i}`);
        this.addBouncePad(b, g, cx, 3.5, cz + 6, 18);
      }
    }

    // Upgraded ZomZom's Costume Caravan
    buildZomZomCaravan(bucket, group, x, y, z) {
      const grp = new THREE.Group();
      grp.position.set(x, y, z);
      grp.rotation.y = 0.45;

      // Rounded coach body
      const body = new THREE.Mesh(
        createRoundedBoxGeometry(5.8, 3.4, 3.8, 3, 0.24),
        this.materials.getFeltMaterial('#ff6b8b', '#fff5d6', true)
      );
      body.position.y = 2.3;
      body.castShadow = true;
      body.receiveShadow = true;
      grp.add(body);

      // Wood trim chassis
      const chassis = new THREE.Mesh(createRoundedBoxGeometry(6.2, 0.42, 4.1, 2, 0.12), this.materials.woodMat);
      chassis.position.y = 0.82;
      chassis.castShadow = true;
      grp.add(chassis);

      // Curved barrel-vaulted stitched cloth roof
      const roof = new THREE.Mesh(
        new THREE.CylinderGeometry(2.08, 2.15, 6.2, 20, 1, false, 0, Math.PI),
        this.materials.getFeltMaterial('#ffd43b', '#ffffff', true)
      );
      roof.rotation.z = Math.PI / 2;
      roof.rotation.y = Math.PI / 2;
      roof.position.y = 3.95;
      roof.castShadow = true;
      grp.add(roof);

      // Striped cloth awning over side window
      const awning = new THREE.Mesh(
        createRoundedBoxGeometry(3.8, 0.16, 1.6, 2, 0.06),
        this.materials.flagMat
      );
      awning.position.set(0, 3.35, 2.45);
      awning.rotation.x = 0.28;
      awning.castShadow = true;
      grp.add(awning);

      // Warm glowing string lanterns along awning
      const lanternMat = new THREE.MeshStandardMaterial({
        color: 0xffe484, emissive: 0xffa62b, emissiveIntensity: 1.6, roughness: 0.2
      });
      for (let i = -2; i <= 2; i++) {
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8), lanternMat);
        bulb.position.set(i * 0.85, 3.12 - Math.abs(i) * 0.04, 3.15);
        grp.add(bulb);
      }
      this.lanternSources.push({ x, y: y + 3.1, z: z + 2.5, color: 0xffb347, intensity: 1.3, distance: 15 });

      // 4 Spoked Cartwheels
      for (const wx of [-2.05, 2.05]) {
        for (const wz of [-2.05, 2.05]) {
          const wheelGrp = new THREE.Group();
          wheelGrp.position.set(wx, 0.90, wz);
          const rim = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.14, 10, 20), this.materials.woodMat);
          const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.34, 12), this.materials.brassMat);
          hub.rotation.x = Math.PI / 2;
          wheelGrp.add(rim, hub);
          for (let sp = 0; sp < 3; sp++) {
            const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.56, 6), this.materials.woodMat);
            spoke.rotation.z = (sp / 3) * Math.PI;
            wheelGrp.add(spoke);
          }
          grp.add(wheelGrp);
        }
      }

      group.add(grp);
      bucket.interactables.push({ kind: 'wardrobe', x, y, z, radius: 4.5, label: "ZomZom's Wardrobe [G]" });
    }

    // Upgraded Hot-Air Yarn Balloon (LatheGeometry Multi-Gore Envelope + Wicker Basket + 4 Ropes)
    buildBalloonPad(bucket, group, x, y, z) {
      const pad = new THREE.Mesh(
        new THREE.CylinderGeometry(3.4, 3.7, 0.45, 28),
        this.materials.getFeltMaterial('#34a8eb', '#ffffff', true)
      );
      pad.position.set(x, y + 0.22, z);
      pad.receiveShadow = true;
      group.add(pad);

      const assembly = new THREE.Group();
      assembly.position.set(x, y, z);

      // Woven wicker basket
      const basket = new THREE.Mesh(createRoundedBoxGeometry(1.9, 1.3, 1.9, 3, 0.16), this.materials.cardboardMat);
      basket.position.set(0, 1.15, 0);
      basket.castShadow = true;
      const basketRim = new THREE.Mesh(createRoundedBoxGeometry(2.08, 0.22, 2.08, 2, 0.08), this.materials.woodMat);
      basketRim.position.set(0, 1.82, 0);
      assembly.add(basket, basketRim);

      // Balloon + Burner + 4 Suspension Ropes
      const floatGroup = new THREE.Group();
      floatGroup.position.y = 6.2;

      const envelopeMat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        bumpMap: this.materials.knitBump,
        roughnessMap: this.materials.knitRough,
        bumpScale: 0.07,
        roughness: 0.85,
        envMapIntensity: 0.25
      });
      const balloon = new THREE.Mesh(this.balloonEnvelopeGeo, envelopeMat);
      balloon.castShadow = true;
      floatGroup.add(balloon);

      const burner = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 12, 10),
        new THREE.MeshBasicMaterial({ color: 0xffc857 })
      );
      burner.position.y = -2.45;
      floatGroup.add(burner);

      // 4 Ropes connecting basket corners to balloon throat
      for (const sx of [-0.78, 0.78]) {
        for (const sz of [-0.78, 0.78]) {
          const rCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(sx, -4.4, sz),
            new THREE.Vector3(sx * 0.68, -2.5, sz * 0.68)
          ]);
          const rope = new THREE.Mesh(new THREE.TubeGeometry(rCurve, 6, 0.045, 5, false), this.materials.ropeMat);
          floatGroup.add(rope);
        }
      }

      assembly.add(floatGroup);
      group.add(assembly);
      this.lanternSources.push({ x, y: y + 3.6, z, color: 0xffb347, intensity: 1.2, distance: 14 });
      bucket.interactables.push({ kind: 'map', x, y, z, radius: 4.2, label: 'Hot-Air Balloon Map [M]', balloon: floatGroup });
    }

    // Detailed Pencil-and-Erasertip Windmills
    buildPencilWindmill(group, x, y, z) {
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.2, 4.8, 6), this.materials.getFeltMaterial('#f2b632', '#fff', false));
      tower.position.set(x, y + 2.4, z);
      tower.castShadow = true;
      const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.5, 14), this.materials.brassMat);
      ferrule.position.set(x, y + 4.95, z);
      const eraser = new THREE.Mesh(new THREE.SphereGeometry(0.90, 14, 10), this.materials.getFeltMaterial('#ff758f', '#fff', false));
      eraser.scale.y = 0.65;
      eraser.position.set(x, y + 5.25, z);
      group.add(tower, ferrule, eraser);

      const hub = new THREE.Group();
      hub.position.set(x, y + 4.3, z + 1.05);
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 10), this.materials.brassMat);
      hub.add(cap);
      const bladeMat = this.materials.getFeltMaterial('#ffd43b', '#ff6b6b', false);
      for (let i = 0; i < 4; i++) {
        const arm = new THREE.Group();
        arm.rotation.z = (i * Math.PI) / 2;
        const spar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.3, 8), this.materials.woodMat);
        spar.position.y = 1.65;
        const sail = new THREE.Mesh(createRoundedBoxGeometry(0.68, 2.5, 0.12, 2, 0.04), bladeMat);
        sail.position.set(0.26, 1.9, 0);
        sail.castShadow = true;
        arm.add(spar, sail);
        hub.add(arm);
      }
      group.add(hub);
      return hub;
    }

    // ---- Infinite Procedural Frontier Islands (WorldStreamer) ----
    updateStreaming(px, pz) {
      const pcx = Math.round(px / CHUNK_SIZE);
      const pcz = Math.round(pz / CHUNK_SIZE);

      const wanted = new Set();
      for (let dz = -1; dz <= 1; dz++) {
        for (let dx = -1; dx <= 1; dx++) {
          const cx = pcx + dx;
          const cz = pcz + dz;
          if (Math.abs(cx) > 1 || Math.abs(cz) > 1) {
            wanted.add(`${cx},${cz}`);
          }
        }
      }

      for (const [key, ch] of this.chunks.entries()) {
        if (!wanted.has(key)) {
          this.disposeChunk(ch);
          this.chunks.delete(key);
        }
      }

      for (const key of wanted) {
        if (!this.chunks.has(key)) {
          const [cx, cz] = key.split(',').map(Number);
          const ch = this.buildFrontierChunk(cx, cz);
          this.chunks.set(key, ch);
        }
      }
    }

    disposeChunk(ch) {
      this.scene.remove(ch.group);
      ch.group.traverse((obj) => {
        if (obj.geometry && obj.geometry !== this.grassBladeGeo && obj.geometry !== this.bellGeo && obj.geometry !== this.balloonEnvelopeGeo) {
          obj.geometry.dispose();
        }
      });
    }

    buildFrontierChunk(cx, cz) {
      const fIdx = chunkToFrontierIndex(cx, cz);
      const rng = mulberry32(hashChunk(cx, cz));
      const theme = FRONTIER_THEMES[(fIdx + Math.floor(rng() * 5)) % FRONTIER_THEMES.length];
      const center = chunkWorldCenter(cx, cz);
      const ox = center.x + (rng() - 0.5) * 10;
      const oz = center.z + (rng() - 0.5) * 10;
      const baseY = 2 + (rng() - 0.5) * 3.5;
      const radius = 14.5 + rng() * 4.5;
      const seed = fIdx * 3.71;
      const contourAmp = 0.34;

      const group = new THREE.Group();
      const bucket = this.makeBucket();
      this.scene.add(group);

      const topMat = this.materials.getFeltMaterial(theme.top, theme.stitch, true, 2, true);
      const mainSurfY = (wx, wz) => baseY + islandSurfaceOffset(wx - ox, wz - oz, radius, seed, contourAmp);

      // Sculpted Main Frontier Island + Underbelly
      this.addSculptedIsland(bucket, group, ox, baseY, oz, radius, 9.5, topMat, this.materials.rockUnderMat, seed, contourAmp);

      // ~900 GPU-instanced grass blades on grass-themed frontier islands
      if (theme.hasGrass) {
        this.buildInstancedGrass(group, 900, (grng) => {
          const a = grng() * Math.PI * 2;
          const maxR = islandRadiusAt(a, radius, seed) * 0.90;
          const r = Math.sqrt(grng()) * maxR;
          const gx = ox + Math.cos(a) * r;
          const gz = oz + Math.sin(a) * r;
          if (Math.hypot(gx - (ox + 4.5), gz - (oz + 3.5)) < 2.3) return null;
          if (Math.hypot(gx - (ox + 0.5), gz - (oz + 5.5)) < 1.6) return null;
          return { x: gx, y: mainSurfY(gx, gz), z: gz };
        }, theme.grassA, theme.grassB, fIdx * 97 + 13);
      }

      // Multi-height sculpted satellite islands
      const subCount = 2 + Math.floor(rng() * 2);
      let highX = ox, highY = baseY, highZ = oz;
      for (let i = 0; i < subCount; i++) {
        const ang = (i / subCount) * Math.PI * 2 + rng() * 0.8;
        const dist = radius + 6 + rng() * 4;
        const sx = ox + Math.cos(ang) * dist;
        const sz = oz + Math.sin(ang) * dist;
        const sy = baseY + 2.2 + i * 2.1;
        this.addSculptedIsland(bucket, group, sx, sy, sz, 6.5 + rng() * 2, 5.5, topMat, this.materials.rockUnderMat, seed + i * 5.3, 0.16);
        if (i === subCount - 1) {
          highX = sx; highY = sy; highZ = sz;
        }
      }

      // Inter-island stepping buttons
      const dirX = -Math.sign(cx);
      const dirZ = -Math.sign(cz);
      for (let s = 1; s <= 3; s++) {
        this.addButtonSteppingStone(
          bucket, group,
          ox + dirX * (radius + s * 7.5),
          baseY + s * 0.3,
          oz + dirZ * (radius + s * 7.5),
          3.1,
          PIANO_COLORS[(fIdx + s) % PIANO_COLORS.length]
        );
      }

      this.addBouncePad(bucket, group, ox + 4.5, mainSurfY(ox + 4.5, oz + 3.5), oz + 3.5, 18.5);
      this.addGrappleRing(bucket, group, (ox + highX) * 0.5, Math.max(baseY, highY) + 6.5, (oz + highZ) * 0.5);
      this.addZipRail(
        bucket, group,
        new THREE.Vector3(ox - 5, mainSurfY(ox - 5, oz - 4) + 1.5, oz - 4),
        new THREE.Vector3(highX, highY + 1.4, highZ),
        0x48f5ff
      );

      // Organic Craft trees, flowers & shrubs
      this.addCraftTree(group, ox - 6, mainSurfY(ox - 6, oz + 4), oz + 4, 1.15, theme.accent, fIdx + 1);
      this.addCraftTree(group, ox + 6, mainSurfY(ox + 6, oz - 6), oz - 6, 0.95, theme.top, fIdx + 5);
      this.addPaperFlower(group, ox - 2.5, mainSurfY(ox - 2.5, oz + 6), oz + 6, theme.accent);
      this.addPaperFlower(group, ox + 3.2, mainSurfY(ox + 3.2, oz - 2.5), oz - 2.5, '#ff70a6');

      this.addGiftBox(bucket, group, ox - 3.5, mainSurfY(ox - 3.5, oz - 5.5), oz - 5.5);
      this.addEnemy(bucket, group, ox + 2, mainSurfY(ox + 2, oz - 2), oz - 2, 'goofbot', 3.2);
      this.addEnemy(bucket, group, highX, highY, highZ, 'pompom', 2.4);
      this.addButtonCritter(bucket, group, ox - 5, mainSurfY(ox - 5, oz + 1), oz + 1, `crit_f_${fIdx}`);
      this.addDreamerOrb(bucket, group, highX, highY + 2.4, highZ, `orb_f_${fIdx}`);
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * Math.PI * 2;
        const bx = ox + Math.cos(a) * 6.5;
        const bz = oz + Math.sin(a) * 6.5;
        this.addBell(bucket, group, bx, mainSurfY(bx, bz) + 1.0, bz);
      }

      // Island Discovery Flagpole
      const flagX = ox + 0.5;
      const flagZ = oz + 5.5;
      const flagBaseY = mainSurfY(flagX, flagZ);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 6.2, 12), this.materials.brassMat);
      pole.position.set(flagX, flagBaseY + 3.1, flagZ);
      pole.castShadow = true;
      const finial = new THREE.Mesh(new THREE.SphereGeometry(0.26, 10, 8), this.materials.brassMat);
      finial.position.set(flagX, flagBaseY + 6.25, flagZ);
      group.add(pole, finial);

      const alreadyDiscovered = this.state.discoveredIslands.some((d) => d.index === fIdx);
      const flagMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.55, 4, 2), this.materials.flagMat);
      flagMesh.position.set(flagX + 1.25, flagBaseY + (alreadyDiscovered ? 5.2 : 1.5), flagZ);
      group.add(flagMesh);

      bucket.flagpoles.push({
        index: fIdx,
        name: `Frontier Island #${fIdx} (${theme.name})`,
        x: flagX, y: flagBaseY, z: flagZ,
        islandX: ox, islandY: baseY, islandZ: oz,
        flagMesh,
        targetY: flagBaseY + 5.2,
        raised: alreadyDiscovered
      });

      return { cx, cz, frontierIndex: fIdx, themeName: theme.name, ox, oy: baseY, oz, group, entities: bucket };
    }

    spawnBurst(x, y, z, colorHex = 0xffcf48, count = 12) {
      this.vfx.spawnBurst(x, y, z, colorHex, count, 'starburst');
    }

    spawnBoomerang(x, y, z, dirX, dirZ) {
      const star = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.55, 0),
        new THREE.MeshStandardMaterial({ color: 0x38e5ff, emissive: 0x06b6d4, emissiveIntensity: 0.9 })
      );
      star.scale.set(1.2, 0.25, 1.2);
      star.position.set(x, y + 1.0, z);
      this.scene.add(star);
      this.boomerangs.push({
        mesh: star, x, y: y + 1.0, z,
        vx: dirX * 26, vz: dirZ * 26,
        age: 0, maxAge: 1.05
      });
    }

    // ---- Query Floor Height Under Point (Matches Sculpted Geometry Accurately!) ----
    sampleFloor(x, y, z, radius = 0.42) {
      let bestY = -999;
      let bestCol = null;

      for (const bucket of this.allBuckets()) {
        for (const c of bucket.colliders) {
          if (c.kind === 'island') {
            const dx = x - c.x;
            const dz = z - c.z;
            const ang = Math.atan2(dz, dx);
            const maxR = islandRadiusAt(ang, c.radius, c.seed);
            if (Math.hypot(dx, dz) <= maxR + radius * 0.45) {
              const sy = c.baseY + islandSurfaceOffset(dx, dz, c.radius, c.seed, c.contourAmp);
              if (y >= sy - 1.6 && sy > bestY) {
                bestY = sy;
                bestCol = c;
              }
            }
          } else if (c.kind === 'cylinder') {
            const d = Math.hypot(x - c.x, z - c.z);
            if (d <= c.radius + radius * 0.5 && y >= c.topY - 1.5 && c.topY > bestY) {
              bestY = c.topY;
              bestCol = c;
            }
          } else if (c.kind === 'box') {
            if (x >= c.minX - radius * 0.5 && x <= c.maxX + radius * 0.5 &&
                z >= c.minZ - radius * 0.5 && z <= c.maxZ + radius * 0.5 &&
                y >= c.topY - 1.5 && c.topY > bestY) {
              bestY = c.topY;
              bestCol = c;
            }
          } else if (c.kind === 'dome') {
            const d = Math.hypot(x - c.x, z - c.z);
            if (d <= c.radius) {
              const t = 1 - (d / c.radius) * (d / c.radius);
              const dy = c.baseY + c.peakHeight * Math.sqrt(Math.max(0, t));
              if (y >= dy - 1.5 && dy > bestY) {
                bestY = dy;
                bestCol = c;
              }
            }
          }
        }
      }
      return { y: bestY, col: bestCol };
    }

    // ---- Update World, Water Uniforms, Contact Shadows & Local PointLights ----
    update(dt, elapsed, playerPos, buddyPos, coopEnabled, localLights) {
      this.materials.sharedUniforms.uTime.value = elapsed;
      for (const wm of this.waterMaterials) {
        wm.uniforms.uTime.value = elapsed;
      }
      this.distantOcean.position.set(playerPos.x, -18, playerPos.z);

      const lightCandidates = [];
      const shadowTargets = [
        { x: playerPos.x, y: playerPos.y, z: playerPos.z, baseScale: 1.55 }
      ];
      if (coopEnabled && buddyPos) {
        shadowTargets.push({ x: buddyPos.x, y: buddyPos.y, z: buddyPos.z, baseScale: 1.45 });
      }

      for (const lt of this.lanternSources) {
        lightCandidates.push({
          x: lt.x, y: lt.y, z: lt.z, color: lt.color, intensity: lt.intensity, distance: lt.distance,
          distSq: (lt.x - playerPos.x) ** 2 + (lt.z - playerPos.z) ** 2
        });
      }

      for (const bucket of this.allBuckets()) {
        for (const m of bucket.movers) {
          if (m.kind === 'spin') {
            m.mesh.rotation.y += m.speed * dt;
            m.col.spinSpeed = m.speed;
          }
        }
        for (const wm of bucket.windmills) {
          wm.rotation.z += 1.4 * dt;
        }
        for (const pk of bucket.pianoKeys) {
          if (pk.glow > 0) {
            pk.glow = Math.max(0, pk.glow - dt * 2.4);
            pk.mesh.material.emissive.copy(pk.baseColor);
            pk.mesh.material.emissiveIntensity = pk.glow * 1.1;
            pk.mesh.position.y = pk.col.topY - 0.425 - pk.glow * 0.18;
            lightCandidates.push({
              x: pk.mesh.position.x, y: pk.col.topY + 0.8, z: pk.mesh.position.z,
              color: pk.baseColor.getHex(), intensity: pk.glow * 1.8, distance: 10,
              distSq: (pk.mesh.position.x - playerPos.x) ** 2 + (pk.mesh.position.z - playerPos.z) ** 2
            });
          }
        }
        for (const bp of bucket.bouncePads) {
          if (bp.timer > 0) {
            bp.timer = Math.max(0, bp.timer - dt * 4);
            const s = 1 + Math.sin(bp.timer * Math.PI) * 0.25;
            bp.mesh.scale.set(s, 1 / s, s);
          } else {
            bp.mesh.scale.set(1, 1, 1);
          }
        }
        for (const o of bucket.orbs) {
          if (o.collected) continue;
          o.mesh.position.y = o.baseY + Math.sin(elapsed * 2.5 + o.x) * 0.35;
          o.mesh.rotation.y += dt * 1.6;
          o.halo.rotation.x += dt * 2.1;
          o.wispTimer -= dt;
          if (o.wispTimer <= 0 && Math.hypot(o.x - playerPos.x, o.z - playerPos.z) < 42) {
            o.wispTimer = 0.28 + Math.random() * 0.25;
            this.vfx.spawnWisp(o.x, o.mesh.position.y, o.z, 0xffe46b);
          }
          lightCandidates.push({
            x: o.x, y: o.mesh.position.y, z: o.z,
            color: 0xffc857, intensity: 1.6, distance: 14,
            distSq: (o.x - playerPos.x) ** 2 + (o.z - playerPos.z) ** 2
          });
        }
        for (const bl of bucket.bells) {
          if (bl.collected) continue;
          bl.mesh.position.y = bl.baseY + Math.sin(elapsed * 3 + bl.z) * 0.18;
          bl.mesh.rotation.y += dt * 2.2;
        }
        for (const gb of bucket.giftBoxes) {
          if (!gb.broken && Math.hypot(gb.x - playerPos.x, gb.z - playerPos.z) < 45) {
            shadowTargets.push({ x: gb.x, y: gb.y, z: gb.z, baseScale: 2.05 });
          }
        }
        for (const en of bucket.enemies) {
          if (!en.alive) continue;
          en.phase += dt * (en.kind === 'pompom' ? 2.8 : 1.5);
          en.x = en.homeX + Math.cos(en.phase) * en.patrolRadius;
          en.z = en.homeZ + Math.sin(en.phase) * en.patrolRadius;
          const surf = this.sampleFloor(en.x, en.baseY + 2.0, en.z);
          const groundY = surf.y > -900 ? surf.y : en.baseY;
          const hop = en.kind === 'pompom' ? Math.abs(Math.sin(en.phase * 2.4)) * 0.75 : 0;
          en.mesh.position.set(en.x, groundY + hop, en.z);
          en.mesh.rotation.y = -en.phase;
          if (Math.hypot(en.x - playerPos.x, en.z - playerPos.z) < 45) {
            shadowTargets.push({ x: en.x, y: groundY + hop, z: en.z, baseScale: 1.55 });
          }
        }
        for (const cr of bucket.critters) {
          if (cr.rescued || cr.carried) continue;
          cr.phase += dt * 3.2;
          const hop = Math.abs(Math.sin(cr.phase)) * 0.28;
          cr.mesh.position.set(cr.x, cr.y + hop, cr.z);
          cr.mesh.rotation.y = Math.sin(cr.phase * 0.4) * 0.7;
          if (Math.hypot(cr.x - playerPos.x, cr.z - playerPos.z) < 45) {
            shadowTargets.push({ x: cr.x, y: cr.y + hop, z: cr.z, baseScale: 1.15 });
          }
        }
        for (const fp of bucket.flagpoles) {
          if (fp.raised && fp.flagMesh.position.y < fp.targetY) {
            fp.flagMesh.position.y = Math.min(fp.targetY, fp.flagMesh.position.y + dt * 5.2);
          }
        }
        for (const it of bucket.interactables) {
          if (it.balloon) {
            it.balloon.position.y = 6.2 + Math.sin(elapsed * 1.4) * 0.35;
          }
        }
      }

      // Assign 6 pooled local PointLights to nearest glowing sources
      if (localLights && localLights.length > 0) {
        lightCandidates.sort((a, b) => a.distSq - b.distSq);
        for (let i = 0; i < localLights.length; i++) {
          const pl = localLights[i];
          const src = lightCandidates[i];
          if (src && src.distSq < 60 * 60) {
            pl.position.set(src.x, src.y, src.z);
            pl.color.setHex(src.color);
            pl.intensity = src.intensity;
            pl.distance = src.distance;
          } else {
            pl.intensity = 0;
          }
        }
      }

      // Pin soft radial Contact-Shadow Decals to ground surface
      for (let i = 0; i < this.contactShadowPool.length; i++) {
        const decal = this.contactShadowPool[i];
        const tgt = shadowTargets[i];
        if (!tgt) {
          decal.visible = false;
          continue;
        }
        const fl = this.sampleFloor(tgt.x, tgt.y + 1.2, tgt.z, 0.25);
        if (fl.y > -900) {
          const h = Math.max(0, tgt.y - fl.y);
          const fade = Math.max(0.08, 1 - h / 7.0);
          decal.visible = true;
          decal.position.set(tgt.x, fl.y + 0.035, tgt.z);
          const sc = tgt.baseScale * (0.75 + 0.25 * fade);
          decal.scale.set(sc, 1, sc);
          decal.material.opacity = 0.46 * fade;
        } else {
          decal.visible = false;
        }
      }

      // Boomerangs
      for (let i = this.boomerangs.length - 1; i >= 0; i--) {
        const bm = this.boomerangs[i];
        bm.age += dt;
        const returning = bm.age > bm.maxAge * 0.45;
        if (returning) {
          const dx = playerPos.x - bm.x;
          const dz = playerPos.z - bm.z;
          const len = Math.max(0.1, Math.hypot(dx, dz));
          bm.vx = (dx / len) * 28;
          bm.vz = (dz / len) * 28;
        }
        bm.x += bm.vx * dt;
        bm.z += bm.vz * dt;
        bm.mesh.position.set(bm.x, bm.y, bm.z);
        bm.mesh.rotation.y += dt * 16;

        for (const bucket of this.allBuckets()) {
          for (const bl of bucket.bells) {
            if (!bl.collected && Math.hypot(bm.x - bl.x, bm.z - bl.z) < 2.2) {
              bl.collected = true;
              bl.mesh.visible = false;
              this.state.bells++;
              this.audio.sfx('bell');
              this.spawnBurst(bl.x, bl.y, bl.z, 0xffd43b, 6);
            }
          }
          for (const en of bucket.enemies) {
            if (en.alive && Math.hypot(bm.x - en.x, bm.z - en.z) < 1.8) {
              en.alive = false;
              en.mesh.visible = false;
              this.state.bells += 3;
              this.audio.sfx('box');
              this.spawnBurst(en.x, en.baseY + 0.8, en.z, 0xff70a6, 12);
            }
          }
          for (const gb of bucket.giftBoxes) {
            if (!gb.broken && Math.hypot(bm.x - gb.x, bm.z - gb.z) < 1.8) {
              gb.broken = true;
              gb.mesh.visible = false;
              this.state.bells += 5;
              this.audio.sfx('box');
              this.spawnBurst(gb.x, gb.y, gb.z, 0xf6b928, 16);
            }
          }
        }

        if (bm.age >= bm.maxAge) {
          this.scene.remove(bm.mesh);
          bm.mesh.geometry.dispose();
          bm.mesh.material.dispose();
          this.boomerangs.splice(i, 1);
        }
      }
    }
  }

  // ============================================================================
  // 8. MAIN GAME ENGINE, 5-LIGHT RIG, POSTPROCESSING & UI
  // ============================================================================
  class PatchworkGame {
    constructor() {
      this.canvas = document.getElementById('gameCanvas');
      this.shotMode = new URLSearchParams(window.location.search).get('shot');

      this.state = {
        mode: 'title',
        orbs: 0,
        bells: 0,
        critters: 0,
        yarnIdx: 0,
        hatIdx: 4,
        outfitIdx: 1,
        gadgetIdx: 0,
        coopEnabled: true,
        bloomEnabled: true,
        collectedOrbIds: new Set(),
        rescuedCritterIds: new Set(),
        discoveredIslands: []
      };

      this.loadSave();
      this.audio = new CraftAudio();
      this.initRenderer();
      this.materials = new CraftMaterials(this.renderer);
      this.vfx = new VFXSystem(this.scene);
      this.world = new CraftWorld(this.scene, this.materials, this.state, this.audio, this.vfx, (msg) => this.showToast(msg));

      this.setupSkyAndLights();
      this.setupPlayers();
      this.setupInputs();
      this.setupUI();

      this.lastTime = performance.now();
      this.elapsed = 0;
      this.toastTimer = 0;

      if (this.shotMode) {
        this.applyShotMode(this.shotMode);
      } else {
        this.world.updateStreaming(this.player.pos.x, this.player.pos.z);
      }

      this.loop = this.loop.bind(this);
      requestAnimationFrame(this.loop);
    }

    loadSave() {
      if (this.shotMode) return;
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        if (typeof data.yarnIdx === 'number') this.state.yarnIdx = data.yarnIdx;
        if (typeof data.hatIdx === 'number') this.state.hatIdx = data.hatIdx;
        if (typeof data.outfitIdx === 'number') this.state.outfitIdx = data.outfitIdx;
        if (typeof data.orbs === 'number') this.state.orbs = data.orbs;
        if (typeof data.bells === 'number') this.state.bells = data.bells;
        if (typeof data.critters === 'number') this.state.critters = data.critters;
        if (Array.isArray(data.collectedOrbIds)) this.state.collectedOrbIds = new Set(data.collectedOrbIds);
        if (Array.isArray(data.rescuedCritterIds)) this.state.rescuedCritterIds = new Set(data.rescuedCritterIds);
        if (Array.isArray(data.discoveredIslands)) this.state.discoveredIslands = data.discoveredIslands;
      } catch (_) {}
    }

    saveProgress() {
      if (this.shotMode) return;
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify({
          yarnIdx: this.state.yarnIdx,
          hatIdx: this.state.hatIdx,
          outfitIdx: this.state.outfitIdx,
          orbs: this.state.orbs,
          bells: this.state.bells,
          critters: this.state.critters,
          collectedOrbIds: [...this.state.collectedOrbIds],
          rescuedCritterIds: [...this.state.rescuedCritterIds],
          discoveredIslands: this.state.discoveredIslands
        }));
      } catch (_) {}
    }

    initRenderer() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, powerPreference: 'high-performance' });
      this.renderer.setSize(w, h);
      const pr = Math.min(window.devicePixelRatio || 1, 2);
      this.renderer.setPixelRatio(pr);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.outputEncoding = THREE.sRGBEncoding;
      this.renderer.toneMapping = THREE.NoToneMapping;
      this.renderer.toneMappingExposure = 1.0;

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x8ed4ff);
      this.scene.fog = new THREE.Fog(0x95dcff, 155, 440);

      // 38° Diorama Lens
      this.camera = new THREE.PerspectiveCamera(38, w / h, 0.25, 920);
      this.cameraYaw = 0;
      this.cameraPitch = 0.36;
      this.cameraDist = 14.8;

      // HalfFloatType ONLY when WebGL2 or OES_texture_half_float + linear is supported
      const supportsHalfFloat = !!(
        this.renderer.capabilities.isWebGL2 ||
        (this.renderer.extensions.get('OES_texture_half_float') && this.renderer.extensions.get('OES_texture_half_float_linear'))
      );
      const rtType = supportsHalfFloat ? THREE.HalfFloatType : THREE.UnsignedByteType;
      const rt = new THREE.WebGLRenderTarget(w * pr, h * pr, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: rtType
      });

      this.composer = new THREE.EffectComposer(this.renderer, rt);
      this.renderPass = new THREE.RenderPass(this.scene, this.camera);
      this.composer.addPass(this.renderPass);

      this.bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(w, h), 0.36, 0.35, 0.88);
      this.composer.addPass(this.bloomPass);

      this.outputPass = new THREE.ShaderPass(OutputFXAAShader);
      this.outputPass.uniforms.resolution.value.set(1 / (w * pr), 1 / (h * pr));
      this.outputPass.uniforms.exposure.value = 1.0;
      this.composer.addPass(this.outputPass);

      window.addEventListener('resize', () => {
        const nw = window.innerWidth;
        const nh = window.innerHeight;
        const npr = Math.min(window.devicePixelRatio || 1, 2);
        this.camera.aspect = nw / nh;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(nw, nh);
        this.composer.setSize(nw, nh);
        this.outputPass.uniforms.resolution.value.set(1 / (nw * npr), 1 / (nh * npr));
      });
    }

    setupSkyAndLights() {
      this.scene.environment = this.materials.envMap;

      // Bright warm daylight gradient sky dome (WebGL1 GLSL 1.00)
      const skyMat = new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          topColor: { value: new THREE.Color(0x3ba8f5) },
          midColor: { value: new THREE.Color(0x8fd6ff) },
          botColor: { value: new THREE.Color(0xd2edff) }
        },
        vertexShader: `
          varying vec3 vWorldPos;
          void main() {
            vec4 wp = modelMatrix * vec4(position, 1.0);
            vWorldPos = wp.xyz;
            gl_Position = projectionMatrix * viewMatrix * wp;
          }
        `,
        fragmentShader: `
          uniform vec3 topColor;
          uniform vec3 midColor;
          uniform vec3 botColor;
          varying vec3 vWorldPos;
          void main() {
            float h = normalize(vWorldPos).y;
            vec3 col = h > 0.0
              ? mix(midColor, topColor, pow(h, 0.65))
              : mix(midColor, botColor, clamp(-h * 2.5, 0.0, 1.0));
            gl_FragColor = vec4(col, 1.0);
          }
        `
      });
      this.skyDome = new THREE.Mesh(new THREE.SphereGeometry(720, 28, 18), skyMat);
      this.scene.add(this.skyDome);

      // Puffy Cotton Clouds in the sky
      const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.94, envMapIntensity: 0.35 });
      const rng = mulberry32(2026);
      for (let i = 0; i < 28; i++) {
        const cl = new THREE.Group();
        const a = (i / 28) * Math.PI * 2;
        const r = 110 + rng() * 240;
        cl.position.set(Math.cos(a) * r, 36 + rng() * 34, Math.sin(a) * r);
        for (let k = 0; k < 3; k++) {
          const p = new THREE.Mesh(new THREE.SphereGeometry(4 + rng() * 3, 12, 10), cloudMat);
          p.position.set((k - 1) * 4.2, rng() * 1.4, rng() * 1.5);
          p.scale.y = 0.65;
          cl.add(p);
        }
        this.scene.add(cl);
      }

      // 5-Light Rig:
      // 1. Hemisphere bounce light
      const hemi = new THREE.HemisphereLight(0xc2e9ff, 0xc98b54, 0.56);
      this.scene.add(hemi);

      // 2. Warm Key Sun DirectionalLight (2048x2048 shadow camera tightly fitted to +-24m around Patch)
      this.sunLight = new THREE.DirectionalLight(0xfff3d4, 1.15);
      this.sunLight.position.set(32, 56, 28);
      this.sunLight.castShadow = true;
      this.sunLight.shadow.mapSize.set(2048, 2048);
      this.sunLight.shadow.camera.near = 4;
      this.sunLight.shadow.camera.far = 160;
      const d = 24;
      this.sunLight.shadow.camera.left = -d;
      this.sunLight.shadow.camera.right = d;
      this.sunLight.shadow.camera.top = d;
      this.sunLight.shadow.camera.bottom = -d;
      this.sunLight.shadow.bias = -0.0005;
      this.sunLight.shadow.normalBias = 0.025;
      this.scene.add(this.sunLight);
      this.scene.add(this.sunLight.target);

      // 3. Cool Opposing Rim DirectionalLight
      this.rimLight = new THREE.DirectionalLight(0x88c8ff, 0.52);
      this.rimLight.position.set(-34, 24, -30);
      this.scene.add(this.rimLight);
      this.scene.add(this.rimLight.target);

      // 4. Warm Hero PointLight following Patch
      this.heroLight = new THREE.PointLight(0xffdfb0, 0.65, 11, 1.5);
      this.scene.add(this.heroLight);

      // 5. 6 Pooled Local PointLights dynamically attached to nearest Orbs, Lanterns & Piano Keys
      this.localLights = [];
      for (let i = 0; i < 6; i++) {
        const pl = new THREE.PointLight(0xffd27a, 0, 14, 1.6);
        this.scene.add(pl);
        this.localLights.push(pl);
      }
    }

    setupPlayers() {
      this.patchRig = createPlushRig(this.materials, this.state.yarnIdx, this.state.hatIdx, this.state.outfitIdx);
      this.scene.add(this.patchRig.root);

      this.player = {
        pos: new THREE.Vector3(0, 0.5, 10),
        vel: new THREE.Vector3(0, 0, 0),
        yaw: Math.PI,
        grounded: true,
        safePos: new THREE.Vector3(0, 1.0, 10),
        flutterTimer: 0,
        rollTimer: 0,
        slapTimer: 0,
        poundActive: false,
        jetTimer: 0,
        bubbleTimer: 0,
        grappleTarget: null,
        zipState: null,
        carriedItem: null,
        squash: 1
      };

      this.safetyBubble = new THREE.Mesh(
        new THREE.SphereGeometry(1.35, 20, 16),
        new THREE.MeshPhysicalMaterial({
          color: 0xb8f3ff, roughness: 0.08, clearcoat: 1, transparent: true, opacity: 0.45
        })
      );
      this.safetyBubble.visible = false;
      this.patchRig.root.add(this.safetyBubble);
      this.safetyBubble.position.y = 1.0;

      const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, 1, 0)]);
      this.grappleLine = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xffd43b }));
      this.grappleLine.visible = false;
      this.scene.add(this.grappleLine);

      // Co-Op Buddy Stitch
      this.stitchRig = createPlushRig(this.materials, 3, 6, 3);
      this.scene.add(this.stitchRig.root);
      this.buddy = {
        pos: new THREE.Vector3(2.4, 0.5, 11.2),
        vel: new THREE.Vector3(0, 0, 0),
        yaw: Math.PI
      };

      // Sculpted Turntable Pedestal for Wardrobe Showroom
      this.turntable = new THREE.Mesh(
        new THREE.CylinderGeometry(2.2, 2.4, 0.45, 32),
        this.materials.woodMat
      );
      this.turntable.receiveShadow = true;
      this.turntable.visible = false;
      this.scene.add(this.turntable);
    }

    setupInputs() {
      this.keys = new Set();
      this.touchMove = { x: 0, y: 0 };

      window.addEventListener('keydown', (e) => {
        const code = e.code;
        this.keys.add(code);
        this.audio.unlock();

        if (code === 'KeyG') {
          if (this.state.mode === 'wardrobe') this.setMode('play');
          else if (this.state.mode === 'play') this.setMode('wardrobe');
        } else if (code === 'KeyM') {
          if (this.state.mode === 'map') this.setMode('play');
          else if (this.state.mode === 'play') this.setMode('map');
        } else if (code === 'KeyP') {
          this.toggleCoop();
        } else if (code === 'KeyB' && this.state.mode === 'play') {
          this.teleportBuddyToPlayer();
        } else if (code === 'Digit1') this.selectGadget(0);
        else if (code === 'Digit2') this.selectGadget(1);
        else if (code === 'Digit3') this.selectGadget(2);
        else if (code === 'KeyQ') this.selectGadget((this.state.gadgetIdx + 1) % 3);

        if (this.state.mode === 'play') {
          if (code === 'Space') { e.preventDefault(); this.tryJump(); }
          if (code === 'ShiftLeft' || code === 'ShiftRight' || code === 'KeyL') this.tryRoll();
          if (code === 'KeyJ') this.trySlap();
          if (code === 'KeyE' || code === 'KeyC') this.tryGroundPound();
          if (code === 'KeyF') this.tryGrabOrToss();
          if (code === 'KeyK') this.activateGadget();
        }
      });

      window.addEventListener('keyup', (e) => {
        this.keys.delete(e.code);
      });

      let dragging = false;
      let dragMoved = 0;
      let lastX = 0, lastY = 0;

      this.canvas.addEventListener('pointerdown', (e) => {
        this.audio.unlock();
        if (this.state.mode !== 'play') return;
        dragging = true;
        dragMoved = 0;
        lastX = e.clientX;
        lastY = e.clientY;
        if (e.button === 2) this.tryGrabOrToss();
      });

      window.addEventListener('pointermove', (e) => {
        if (!dragging || this.state.mode !== 'play') return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        dragMoved += Math.abs(dx) + Math.abs(dy);
        lastX = e.clientX;
        lastY = e.clientY;
        this.cameraYaw -= dx * 0.0065;
        this.cameraPitch = Math.max(0.08, Math.min(1.05, this.cameraPitch + dy * 0.0045));
      });

      window.addEventListener('pointerup', (e) => {
        if (!dragging) return;
        dragging = false;
        if (this.state.mode === 'play' && e.button === 0 && dragMoved < 8) {
          this.trySlap();
        }
      });

      this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

      const stickBase = document.getElementById('touchStickBase');
      const stickKnob = document.getElementById('touchStickKnob');
      let stickTouchId = null;
      stickBase.addEventListener('pointerdown', (e) => {
        stickTouchId = e.pointerId;
        stickBase.setPointerCapture(e.pointerId);
      });
      stickBase.addEventListener('pointermove', (e) => {
        if (stickTouchId !== e.pointerId) return;
        const rect = stickBase.getBoundingClientRect();
        const cx = rect.left + rect.width * 0.5;
        const cy = rect.top + rect.height * 0.5;
        const maxR = 40;
        let dx = e.clientX - cx;
        let dy = e.clientY - cy;
        const len = Math.hypot(dx, dy);
        if (len > maxR) { dx = (dx / len) * maxR; dy = (dy / len) * maxR; }
        stickKnob.style.transform = `translate(${dx}px, ${dy}px)`;
        this.touchMove.x = dx / maxR;
        this.touchMove.y = dy / maxR;
      });
      const resetStick = () => {
        stickTouchId = null;
        stickKnob.style.transform = 'translate(0, 0)';
        this.touchMove.x = 0;
        this.touchMove.y = 0;
      };
      stickBase.addEventListener('pointerup', resetStick);
      stickBase.addEventListener('pointercancel', resetStick);

      document.getElementById('touchJump').addEventListener('pointerdown', () => this.tryJump());
      document.getElementById('touchSlap').addEventListener('pointerdown', () => this.trySlap());
      document.getElementById('touchGadget').addEventListener('pointerdown', () => this.activateGadget());
      document.getElementById('touchRoll').addEventListener('pointerdown', () => this.tryRoll());
    }

    setupUI() {
      document.getElementById('playBtn').addEventListener('click', () => {
        this.audio.unlock();
        this.setMode('play');
      });
      document.getElementById('openWardrobeTitleBtn').addEventListener('click', () => {
        this.audio.unlock();
        this.setMode('wardrobe');
      });
      document.getElementById('openMapTitleBtn').addEventListener('click', () => {
        this.audio.unlock();
        this.setMode('map');
      });

      document.getElementById('hudWardrobeBtn').addEventListener('click', () => this.setMode('wardrobe'));
      document.getElementById('hudMapBtn').addEventListener('click', () => this.setMode('map'));
      document.getElementById('closeWardrobeBtn').addEventListener('click', () => this.setMode('play'));
      document.getElementById('closeMapBtn').addEventListener('click', () => this.setMode('play'));

      document.getElementById('hudCoopBtn').addEventListener('click', () => this.toggleCoop());
      document.getElementById('coopTitleBtn').addEventListener('click', () => this.toggleCoop());

      document.getElementById('hudBloomBtn').addEventListener('click', () => this.toggleBloom());
      document.getElementById('bloomTitleBtn').addEventListener('click', () => this.toggleBloom());

      document.getElementById('hudMuteBtn').addEventListener('click', () => this.toggleAudio());
      document.getElementById('audioTitleBtn').addEventListener('click', () => this.toggleAudio());

      document.getElementById('sailNewFrontierBtn').addEventListener('click', () => this.sailToNewFrontierIsland());

      document.querySelectorAll('.gadget-slot').forEach((btn) => {
        btn.addEventListener('click', () => this.selectGadget(Number(btn.dataset.gadget)));
      });

      this.wardrobeCat = 'yarn';
      document.querySelectorAll('.cat-tab').forEach((tab) => {
        tab.addEventListener('click', () => {
          this.wardrobeCat = tab.dataset.cat;
          document.querySelectorAll('.cat-tab').forEach((t) => t.classList.toggle('active', t === tab));
          this.renderWardrobeGrid();
        });
      });

      document.getElementById('worldMapCanvas').addEventListener('click', (e) => {
        this.handleMapCanvasClick(e);
      });

      this.renderWardrobeGrid();
      this.syncHUD();
    }

    setMode(nextMode) {
      this.state.mode = nextMode;
      document.getElementById('titleOverlay').classList.toggle('hidden', nextMode !== 'title');
      document.getElementById('hudOverlay').classList.toggle('hidden', nextMode !== 'play');
      document.getElementById('wardrobeOverlay').classList.toggle('hidden', nextMode !== 'wardrobe');
      document.getElementById('mapOverlay').classList.toggle('hidden', nextMode !== 'map');
      document.getElementById('touchControls').classList.toggle('active', nextMode === 'play');

      this.turntable.visible = (nextMode === 'wardrobe');
      this.stitchRig.root.visible = (nextMode !== 'wardrobe') && this.state.coopEnabled;
      if (nextMode === 'wardrobe') {
        this.turntable.position.set(this.player.pos.x, this.player.pos.y - 0.22, this.player.pos.z);
        this.renderWardrobeGrid();
      } else if (nextMode === 'map') {
        this.renderWorldMap();
      }
    }

    toggleCoop() {
      this.state.coopEnabled = !this.state.coopEnabled;
      this.stitchRig.root.visible = this.state.coopEnabled;
      document.getElementById('hudCoopBtn').classList.toggle('active', this.state.coopEnabled);
      const tBtn = document.getElementById('coopTitleBtn');
      tBtn.classList.toggle('active', this.state.coopEnabled);
      tBtn.textContent = `CO-OP BUDDY: ${this.state.coopEnabled ? 'ON' : 'OFF'}`;
    }

    toggleBloom() {
      this.state.bloomEnabled = !this.state.bloomEnabled;
      document.getElementById('hudBloomBtn').classList.toggle('active', this.state.bloomEnabled);
      const tBtn = document.getElementById('bloomTitleBtn');
      tBtn.classList.toggle('active', this.state.bloomEnabled);
      tBtn.textContent = `BLOOM: ${this.state.bloomEnabled ? 'ON' : 'OFF'}`;
    }

    toggleAudio() {
      this.audio.enabled = !this.audio.enabled;
      if (this.audio.enabled) this.audio.unlock();
      document.getElementById('hudMuteBtn').textContent = this.audio.enabled ? 'Audio' : 'Muted';
      const tBtn = document.getElementById('audioTitleBtn');
      tBtn.classList.toggle('active', this.audio.enabled);
      tBtn.textContent = `AUDIO: ${this.audio.enabled ? 'ON' : 'MUTED'}`;
    }

    selectGadget(idx) {
      this.state.gadgetIdx = idx;
      document.querySelectorAll('.gadget-slot').forEach((s, i) => s.classList.toggle('active', i === idx));
    }

    teleportBuddyToPlayer() {
      this.buddy.pos.set(this.player.pos.x + 1.8, this.player.pos.y + 0.8, this.player.pos.z + 1.5);
      this.buddy.vel.set(0, 0, 0);
      this.audio.sfx('bubble');
      this.world.spawnBurst(this.buddy.pos.x, this.buddy.pos.y + 1, this.buddy.pos.z, 0x38aee6, 10);
    }

    showToast(msg) {
      const el = document.getElementById('toastBanner');
      el.textContent = msg;
      el.classList.remove('hidden');
      this.toastTimer = 2.8;
    }

    // ---- Moveset Actions ----
    tryJump() {
      const p = this.player;
      if (p.zipState) {
        p.zipState = null;
        p.vel.y = 11.5;
        this.audio.sfx('jump');
        return;
      }
      if (p.grappleTarget) {
        p.grappleTarget = null;
        this.grappleLine.visible = false;
        p.vel.y = 12;
        this.audio.sfx('jump');
        return;
      }
      if (p.grounded) {
        p.vel.y = 12.6;
        p.grounded = false;
        p.squash = 1.28;
        this.audio.sfx('jump');
      }
    }

    tryRoll() {
      const p = this.player;
      if (p.rollTimer > 0) return;
      p.rollTimer = 0.42;
      const fx = Math.sin(p.yaw);
      const fz = Math.cos(p.yaw);
      p.vel.x = fx * 19;
      p.vel.z = fz * 19;
      this.audio.sfx('slap');
    }

    trySlap() {
      const p = this.player;
      p.slapTimer = 0.32;
      this.audio.sfx('slap');
      this.vfx.spawnSlash(p.pos.x, p.pos.y + 1.05, p.pos.z, p.yaw, 0xfff099);
      this.world.spawnBurst(p.pos.x, p.pos.y + 1.0, p.pos.z, 0xfff099, 6);
      this.hitArea(p.pos.x, p.pos.y + 1.0, p.pos.z, 3.0);
    }

    tryGroundPound() {
      const p = this.player;
      if (!p.grounded && !p.poundActive) {
        p.poundActive = true;
        p.vel.x *= 0.2;
        p.vel.z *= 0.2;
        p.vel.y = -26;
      }
    }

    tryGrabOrToss() {
      const p = this.player;
      if (p.carriedItem) {
        const item = p.carriedItem;
        item.carried = false;
        const fx = Math.sin(p.yaw);
        const fz = Math.cos(p.yaw);
        item.vx = fx * 14;
        item.vy = 8.5;
        item.vz = fz * 14;
        p.carriedItem = null;
        this.audio.sfx('jump');
        return;
      }
      let best = null;
      let bestD = 3.4;
      for (const bucket of this.world.allBuckets()) {
        for (const cr of bucket.critters) {
          if (cr.rescued) continue;
          const d = Math.hypot(cr.x - p.pos.x, cr.z - p.pos.z);
          if (d < bestD && Math.abs(cr.y - p.pos.y) < 2.6) {
            bestD = d;
            best = { kind: 'critter', obj: cr };
          }
        }
        for (const cp of bucket.carryProps) {
          const d = Math.hypot(cp.x - p.pos.x, cp.z - p.pos.z);
          if (d < bestD && Math.abs(cp.y - p.pos.y) < 2.6) {
            bestD = d;
            best = { kind: 'prop', obj: cp };
          }
        }
      }
      if (best) {
        best.obj.carried = true;
        p.carriedItem = best.obj;
        this.audio.sfx('critter');
        if (best.kind === 'critter' && !best.obj.rescued) {
          best.obj.rescued = true;
          this.state.rescuedCritterIds.add(best.obj.id);
          this.state.critters++;
          this.showToast('BUTTON CRITTER RESCUED!');
          this.world.spawnBurst(best.obj.x, best.obj.y + 0.8, best.obj.z, 0xff70a6, 14);
          this.saveProgress();
        }
      }
    }

    activateGadget() {
      const p = this.player;
      const g = this.state.gadgetIdx;
      if (g === 0) {
        let nearest = null;
        let bestD = 19;
        for (const bucket of this.world.allBuckets()) {
          for (const gr of bucket.grappleRings) {
            const d = Math.hypot(gr.x - p.pos.x, gr.y - p.pos.y, gr.z - p.pos.z);
            if (d < bestD) { bestD = d; nearest = gr; }
          }
        }
        if (nearest) {
          p.grappleTarget = nearest;
          p.grounded = false;
          p.vel.y = Math.max(p.vel.y, 6);
          this.audio.sfx('grapple');
        }
      } else if (g === 1) {
        this.world.spawnBoomerang(p.pos.x, p.pos.y, p.pos.z, Math.sin(p.yaw), Math.cos(p.yaw));
        this.audio.sfx('boomerang');
      } else if (g === 2) {
        p.jetTimer = 0.65;
        p.grounded = false;
        p.vel.y = Math.max(p.vel.y, 5.2);
        this.audio.sfx('jet');
      }
    }

    hitArea(x, y, z, radius) {
      for (const bucket of this.world.allBuckets()) {
        for (const gb of bucket.giftBoxes) {
          if (!gb.broken && Math.hypot(gb.x - x, gb.z - z) < radius && Math.abs(gb.y - y) < 2.8) {
            gb.broken = true;
            gb.mesh.visible = false;
            this.state.bells += 5;
            this.audio.sfx('box');
            this.world.spawnBurst(gb.x, gb.y, gb.z, 0xf6b928, 16);
            this.saveProgress();
          }
        }
        for (const en of bucket.enemies) {
          if (en.alive && Math.hypot(en.x - x, en.z - z) < radius && Math.abs(en.baseY - y) < 2.8) {
            en.alive = false;
            en.mesh.visible = false;
            this.state.bells += 3;
            this.audio.sfx('box');
            this.world.spawnBurst(en.x, en.baseY + 0.8, en.z, 0xff70a6, 14);
            this.saveProgress();
          }
        }
      }
    }

    // ---- Wardrobe & Map UI ----
    renderWardrobeGrid() {
      const grid = document.getElementById('wardrobeGrid');
      grid.innerHTML = '';
      if (this.wardrobeCat === 'yarn') {
        YARN_PALETTE.forEach((item, idx) => {
          const btn = document.createElement('button');
          btn.className = `item-card ${this.state.yarnIdx === idx ? 'selected' : ''}`;
          btn.innerHTML = `<span class="swatch" style="background:${item.hex}"></span><span>${item.name}</span>`;
          btn.onclick = () => {
            this.state.yarnIdx = idx;
            applyPlushCosmetics(this.patchRig, this.materials, this.state.yarnIdx, this.state.hatIdx, this.state.outfitIdx);
            this.renderWardrobeGrid();
            this.saveProgress();
          };
          grid.appendChild(btn);
        });
      } else if (this.wardrobeCat === 'hat') {
        HAT_CATALOG.forEach((item, idx) => {
          const btn = document.createElement('button');
          btn.className = `item-card ${this.state.hatIdx === idx ? 'selected' : ''}`;
          btn.innerHTML = `<span class="swatch" style="background:${item.color}"></span><span>${item.name}</span>`;
          btn.onclick = () => {
            this.state.hatIdx = idx;
            applyPlushCosmetics(this.patchRig, this.materials, this.state.yarnIdx, this.state.hatIdx, this.state.outfitIdx);
            this.renderWardrobeGrid();
            this.saveProgress();
          };
          grid.appendChild(btn);
        });
      } else {
        OUTFIT_CATALOG.forEach((item, idx) => {
          const btn = document.createElement('button');
          btn.className = `item-card ${this.state.outfitIdx === idx ? 'selected' : ''}`;
          btn.innerHTML = `<span class="swatch" style="background:${item.color}"></span><span>${item.name}</span>`;
          btn.onclick = () => {
            this.state.outfitIdx = idx;
            applyPlushCosmetics(this.patchRig, this.materials, this.state.yarnIdx, this.state.hatIdx, this.state.outfitIdx);
            this.renderWardrobeGrid();
            this.saveProgress();
          };
          grid.appendChild(btn);
        });
      }
    }

    fastTravelTo(x, y, z, label) {
      this.player.pos.set(x, y, z);
      this.player.vel.set(0, 0, 0);
      this.player.safePos.set(x, y, z);
      this.buddy.pos.set(x + 2.0, y, z + 1.5);
      this.world.updateStreaming(x, z);
      this.setMode('play');
      this.audio.sfx('orb');
      this.showToast(`BALLOON LANDED: ${label.toUpperCase()}`);
    }

    sailToNewFrontierIsland() {
      const discoveredSet = new Set(this.state.discoveredIslands.map((d) => d.index));
      let nextIdx = 1;
      while (discoveredSet.has(nextIdx)) nextIdx++;
      this.warpToFrontierIsland(nextIdx);
    }

    warpToFrontierIsland(fIdx) {
      const { cx, cz } = frontierIndexToChunk(fIdx);
      const center = chunkWorldCenter(cx, cz);
      this.world.updateStreaming(center.x, center.z);
      const ch = this.world.chunks.get(`${cx},${cz}`);
      const tx = ch ? ch.ox : center.x;
      const ty = ch ? ch.oy + 1.2 : 4;
      const tz = ch ? ch.oz + 2 : center.z;

      if (!this.state.discoveredIslands.some((d) => d.index === fIdx)) {
        this.state.discoveredIslands.push({
          index: fIdx,
          name: `Frontier Island #${fIdx}`,
          x: Math.round(tx),
          y: Math.round(ty),
          z: Math.round(tz)
        });
        this.saveProgress();
      }
      this.fastTravelTo(tx, ty, tz, `Frontier Island #${fIdx}`);
    }

    renderWorldMap() {
      const c = document.getElementById('worldMapCanvas');
      const ctx = c.getContext('2d');
      const W = c.width, H = c.height;
      ctx.clearRect(0, 0, W, H);

      const bg = ctx.createRadialGradient(W * 0.5, H * 0.5, 40, W * 0.5, H * 0.5, 320);
      bg.addColorStop(0, '#e6f7ff');
      bg.addColorStop(1, '#b7e2ff');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = 'rgba(130, 88, 50, 0.28)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.strokeRect(12, 12, W - 24, H - 24);
      ctx.setLineDash([]);

      const scale = 0.62;
      const toMap = (wx, wz) => [W * 0.5 + wx * scale, H * 0.5 + wz * scale];

      ctx.strokeStyle = 'rgba(235, 77, 112, 0.45)';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 6]);
      for (const bm of CORE_BIOMES.slice(1)) {
        const [x0, y0] = toMap(0, 0);
        const [x1, y1] = toMap(bm.x, bm.z);
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      this.mapHotspots = [];

      for (const bm of CORE_BIOMES) {
        const [mx, my] = toMap(bm.x, bm.z);
        ctx.fillStyle = bm.color;
        ctx.beginPath();
        ctx.arc(mx, my, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#3e281b';
        ctx.stroke();

        ctx.fillStyle = '#3e281b';
        ctx.font = 'bold 11px Trebuchet MS';
        ctx.textAlign = 'center';
        ctx.fillText(bm.name.split(' ')[0], mx, my + 33);
        this.mapHotspots.push({ mx, my, r: 22, action: () => this.fastTravelTo(...bm.spawn, bm.name) });
      }

      for (const fi of this.state.discoveredIslands) {
        const [mx, my] = toMap(fi.x, fi.z);
        const clampedX = Math.max(28, Math.min(W - 28, mx));
        const clampedY = Math.max(28, Math.min(H - 28, my));
        ctx.fillStyle = '#ffd43b';
        ctx.beginPath();
        ctx.arc(clampedX, clampedY, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#3e281b';
        ctx.stroke();
        ctx.fillStyle = '#3e281b';
        ctx.font = 'bold 10px Trebuchet MS';
        ctx.textAlign = 'center';
        ctx.fillText(`#${fi.index}`, clampedX, clampedY + 3.5);
        this.mapHotspots.push({ mx: clampedX, my: clampedY, r: 15, action: () => this.warpToFrontierIsland(fi.index) });
      }

      const [px, py] = toMap(this.player.pos.x, this.player.pos.z);
      ctx.fillStyle = '#ff3b6b';
      ctx.beginPath();
      ctx.arc(Math.max(20, Math.min(W - 20, px)), Math.max(20, Math.min(H - 20, py)), 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      const list = document.getElementById('travelList');
      list.innerHTML = '';
      for (const bm of CORE_BIOMES) {
        const btn = document.createElement('button');
        btn.className = 'travel-btn';
        btn.innerHTML = `<span>${bm.name}</span><span class="travel-tag">Core Biome</span>`;
        btn.onclick = () => this.fastTravelTo(...bm.spawn, bm.name);
        list.appendChild(btn);
      }
      for (const fi of this.state.discoveredIslands) {
        const btn = document.createElement('button');
        btn.className = 'travel-btn';
        btn.innerHTML = `<span>${fi.name}</span><span class="travel-tag" style="background:#fff0b3;">Frontier #${fi.index}</span>`;
        btn.onclick = () => this.warpToFrontierIsland(fi.index);
        list.appendChild(btn);
      }
    }

    handleMapCanvasClick(e) {
      const c = document.getElementById('worldMapCanvas');
      const rect = c.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * c.width;
      const y = ((e.clientY - rect.top) / rect.height) * c.height;
      for (const hs of (this.mapHotspots || [])) {
        if (Math.hypot(x - hs.mx, y - hs.my) <= hs.r) {
          hs.action();
          return;
        }
      }
    }

    // ---- Query Shot Modes (?shot=...) ----
    applyShotMode(mode) {
      if (mode === 'title') {
        this.player.pos.set(0, 0.2, 8);
        this.player.yaw = 0.2;
        this.buddy.pos.set(2.4, 0.2, 8.8);
        this.buddy.yaw = Math.PI - 0.15;
        this.world.updateStreaming(0, 0);
        this.setMode('title');
      } else if (mode === 'explore') {
        this.player.pos.set(0.8, 0.2, 6.5);
        this.player.yaw = Math.PI + 0.12;
        this.buddy.pos.set(-1.25, 0.2, 5.2);
        this.buddy.yaw = Math.PI - 0.12;
        this.cameraYaw = 0.22;
        this.cameraPitch = 0.34;
        this.cameraDist = 14.8;
        this.world.updateStreaming(0, 0);
        this.setMode('play');
      } else if (mode === 'wardrobe') {
        this.state.yarnIdx = 2;
        this.state.hatIdx = 6;
        this.state.outfitIdx = 1;
        applyPlushCosmetics(this.patchRig, this.materials, this.state.yarnIdx, this.state.hatIdx, this.state.outfitIdx);
        this.player.pos.set(-5, 0.45, 11);
        this.player.yaw = 0.35;
        this.stitchRig.root.visible = false;
        this.world.updateStreaming(0, 0);
        this.setMode('wardrobe');
      } else if (mode === 'map') {
        for (const fIdx of [1, 2, 3, 4, 5, 42]) {
          const { cx, cz } = frontierIndexToChunk(fIdx);
          const ctr = chunkWorldCenter(cx, cz);
          this.state.discoveredIslands.push({
            index: fIdx,
            name: `Frontier Island #${fIdx}`,
            x: Math.round(ctr.x),
            y: 3,
            z: Math.round(ctr.z)
          });
        }
        this.world.updateStreaming(0, 0);
        this.setMode('map');
      } else if (mode === 'frontier') {
        this.warpToFrontierIsland(42);
        const { cx, cz } = frontierIndexToChunk(42);
        const ch = this.world.chunks.get(`${cx},${cz}`);
        if (ch) {
          const pfl = this.world.sampleFloor(ch.ox - 3.2, ch.oy + 4, ch.oz + 6.8);
          const bfl = this.world.sampleFloor(ch.ox - 1.2, ch.oy + 4, ch.oz + 7.6);
          this.player.pos.set(ch.ox - 3.2, pfl.y > -900 ? pfl.y : ch.oy + 0.3, ch.oz + 6.8);
          this.player.yaw = Math.PI * 0.85;
          this.buddy.pos.set(ch.ox - 1.2, bfl.y > -900 ? bfl.y : ch.oy + 0.3, ch.oz + 7.6);
          this.buddy.yaw = Math.PI * 0.9;
        }
        this.cameraYaw = 0.42;
        this.cameraPitch = 0.34;
        this.cameraDist = 18.8;
      }
      this.patchRig.root.position.copy(this.player.pos);
      this.patchRig.root.rotation.y = this.player.yaw;
      this.stitchRig.root.position.copy(this.buddy.pos);
      this.stitchRig.root.rotation.y = this.buddy.yaw;
      this.updateCamera(10);
    }

    // ---- Main Physics & Animation Update ----
    updatePlayer(dt) {
      const p = this.player;
      if (this.state.mode !== 'play') {
        this.patchRig.root.position.copy(p.pos);
        if (this.state.mode === 'wardrobe') {
          this.patchRig.root.rotation.y += dt * 0.75;
        } else {
          this.patchRig.root.rotation.y = p.yaw;
          this.patchRig.armR.rotation.z = 2.2 + Math.sin(this.elapsed * 5.2) * 0.35;
        }
        if (this.patchRig.propeller) this.patchRig.propeller.rotation.y += dt * 10;
        this.animateClothCape(0.6);
        return;
      }

      if (this.keys.has('Comma')) this.cameraYaw += dt * 1.9;
      if (this.keys.has('Period')) this.cameraYaw -= dt * 1.9;

      if (p.bubbleTimer > 0) {
        p.bubbleTimer -= dt;
        this.safetyBubble.visible = true;
        p.pos.lerp(p.safePos, Math.min(1, dt * 4.5));
        p.pos.y += Math.sin(this.elapsed * 8) * 0.03;
        if (p.bubbleTimer <= 0) {
          this.safetyBubble.visible = false;
          p.vel.set(0, 0, 0);
        }
        this.patchRig.root.position.copy(p.pos);
        return;
      }

      if (p.zipState) {
        p.zipState.t += dt * 0.95;
        if (p.zipState.t >= 1) {
          p.pos.copy(p.zipState.rail.end);
          p.zipState = null;
          p.vel.y = 4;
        } else {
          const pt = p.zipState.rail.curve.getPoint(p.zipState.t);
          p.pos.set(pt.x, pt.y - 1.4, pt.z);
          this.patchRig.root.position.copy(p.pos);
          return;
        }
      }

      let inX = 0, inZ = 0;
      if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) inX -= 1;
      if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) inX += 1;
      if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) inZ -= 1;
      if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) inZ += 1;
      inX += this.touchMove.x;
      inZ += this.touchMove.y;

      if (navigator.getGamepads) {
        const gp = navigator.getGamepads()[0];
        if (gp) {
          if (Math.abs(gp.axes[0]) > 0.18) inX += gp.axes[0];
          if (Math.abs(gp.axes[1]) > 0.18) inZ += gp.axes[1];
          if (Math.abs(gp.axes[2]) > 0.2) this.cameraYaw -= gp.axes[2] * dt * 2.2;
        }
      }

      const len = Math.hypot(inX, inZ);
      if (len > 1) { inX /= len; inZ /= len; }

      const sinY = Math.sin(this.cameraYaw);
      const cosY = Math.cos(this.cameraYaw);
      const moveX = inX * cosY + inZ * sinY;
      const moveZ = -inX * sinY + inZ * cosY;

      if (p.rollTimer > 0) {
        p.rollTimer -= dt;
      } else if (p.jetTimer > 0) {
        p.jetTimer -= dt;
        p.vel.x = Math.sin(p.yaw) * 18;
        p.vel.z = Math.cos(p.yaw) * 18;
        p.vel.y = Math.max(p.vel.y, 1.8);
        this.world.spawnBurst(p.pos.x, p.pos.y + 0.3, p.pos.z, parseInt(PIANO_COLORS[Math.floor(this.elapsed * 12) % 8].slice(1), 16), 2);
      } else {
        const speed = 10.6;
        const targetVx = moveX * speed;
        const targetVz = moveZ * speed;
        const accel = p.grounded ? 14 : 7.5;
        p.vel.x += (targetVx - p.vel.x) * Math.min(1, accel * dt);
        p.vel.z += (targetVz - p.vel.z) * Math.min(1, accel * dt);
        if (len > 0.12) {
          const targetYaw = Math.atan2(moveX, moveZ);
          let diff = targetYaw - p.yaw;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          p.yaw += diff * Math.min(1, 12 * dt);
        }
      }

      if (p.grappleTarget) {
        const gt = p.grappleTarget;
        const dx = p.pos.x - gt.x;
        const dy = p.pos.y - gt.y;
        const dz = p.pos.z - gt.z;
        const dist = Math.max(0.1, Math.hypot(dx, dy, dz));
        if (dist > 7.5) {
          const pull = (dist - 7.5) * 14;
          p.vel.x -= (dx / dist) * pull * dt;
          p.vel.y -= (dy / dist) * pull * dt;
          p.vel.z -= (dz / dist) * pull * dt;
        }
        this.grappleLine.visible = true;
        this.grappleLine.geometry.setFromPoints([
          new THREE.Vector3(p.pos.x, p.pos.y + 1.2, p.pos.z),
          new THREE.Vector3(gt.x, gt.y, gt.z)
        ]);
      } else {
        this.grappleLine.visible = false;
      }

      const holdingJump = this.keys.has('Space');
      if (!p.grounded && holdingJump && p.vel.y < 0 && !p.poundActive) {
        p.vel.y = Math.max(p.vel.y + 16 * dt, -2.1);
        p.flutterTimer += dt * 22;
      } else {
        p.vel.y += WORLD_GRAVITY * dt;
      }

      for (const bucket of this.world.allBuckets()) {
        for (const ud of bucket.updrafts) {
          if (Math.hypot(p.pos.x - ud.x, p.pos.z - ud.z) < ud.radius &&
              p.pos.y >= ud.y - 0.5 && p.pos.y <= ud.y + ud.height) {
            p.vel.y = Math.min(14, p.vel.y + ud.power * dt);
            p.grounded = false;
          }
        }
      }

      p.pos.x += p.vel.x * dt;
      p.pos.y += p.vel.y * dt;
      p.pos.z += p.vel.z * dt;

      const floor = this.world.sampleFloor(p.pos.x, p.pos.y, p.pos.z);
      if (floor.y > -900 && p.pos.y <= floor.y && p.vel.y <= 0.5) {
        if (!p.grounded) {
          p.squash = 0.76;
          if (p.poundActive) {
            p.poundActive = false;
            this.audio.sfx('pound');
            this.vfx.spawnShockwave(p.pos.x, floor.y, p.pos.z, 0xffe088, 5.2);
            this.world.spawnBurst(p.pos.x, floor.y + 0.3, p.pos.z, 0xffffff, 12);
            this.hitArea(p.pos.x, floor.y + 0.5, p.pos.z, 4.2);
          }
        }
        p.pos.y = floor.y;
        p.vel.y = 0;
        p.grounded = true;
        p.grappleTarget = null;
        p.safePos.set(p.pos.x, floor.y + 0.8, p.pos.z);

        if (floor.col && floor.col.spinSpeed) {
          const dx = p.pos.x - floor.col.x;
          const dz = p.pos.z - floor.col.z;
          const ang = floor.col.spinSpeed * dt;
          p.pos.x = floor.col.x + dx * Math.cos(ang) + dz * Math.sin(ang);
          p.pos.z = floor.col.z - dx * Math.sin(ang) + dz * Math.cos(ang);
        }

        if (floor.col && floor.col.tag === 'piano') {
          for (const pk of this.world.coreEntities.pianoKeys) {
            if (pk.col === floor.col) {
              if (pk.glow < 0.2) this.audio.playPiano(pk.noteIdx);
              pk.glow = 1.0;
            }
          }
        }
      } else {
        p.grounded = false;
      }

      if (p.pos.y < -18) {
        p.bubbleTimer = 1.05;
        p.grappleTarget = null;
        this.audio.sfx('bubble');
        return;
      }

      for (const bucket of this.world.allBuckets()) {
        for (const bp of bucket.bouncePads) {
          if (Math.hypot(p.pos.x - bp.x, p.pos.z - bp.z) < bp.radius && Math.abs(p.pos.y - bp.y) < 1.3) {
            p.vel.y = bp.power;
            p.grounded = false;
            bp.timer = 1.0;
            p.squash = 1.35;
            this.audio.sfx('bounce');
            this.world.spawnBurst(bp.x, bp.y + 0.3, bp.z, 0xff70a6, 10);
          }
        }
        for (const zr of bucket.zipRails) {
          if (!p.zipState && Math.hypot(p.pos.x - zr.start.x, p.pos.y + 1 - zr.start.y, p.pos.z - zr.start.z) < 2.2) {
            p.zipState = { rail: zr, t: 0.02 };
            this.audio.sfx('grapple');
          }
        }
        for (const o of bucket.orbs) {
          if (!o.collected && Math.hypot(p.pos.x - o.x, p.pos.y + 0.9 - o.y, p.pos.z - o.z) < 2.0) {
            o.collected = true;
            o.mesh.visible = false;
            this.state.collectedOrbIds.add(o.id);
            this.state.orbs++;
            this.audio.sfx('orb');
            this.world.spawnBurst(o.x, o.y, o.z, 0xffe066, 20);
            this.showToast('DREAMER ORB COLLECTED!');
            this.saveProgress();
          }
        }
        for (const bl of bucket.bells) {
          if (!bl.collected && Math.hypot(p.pos.x - bl.x, p.pos.y + 0.8 - bl.y, p.pos.z - bl.z) < 1.6) {
            bl.collected = true;
            bl.mesh.visible = false;
            this.state.bells++;
            this.audio.sfx('bell');
            this.world.spawnBurst(bl.x, bl.y, bl.z, 0xffd43b, 6);
          }
        }
        for (const fp of bucket.flagpoles) {
          if (!fp.raised && Math.hypot(p.pos.x - fp.x, p.pos.z - fp.z) < 2.8 && Math.abs(p.pos.y - fp.y) < 3.5) {
            fp.raised = true;
            this.audio.sfx('flag');
            this.world.spawnBurst(fp.x, fp.y + 4, fp.z, 0xff595e, 26);
            this.showToast('NEW ISLAND DISCOVERED!');
            if (!this.state.discoveredIslands.some((d) => d.index === fp.index)) {
              this.state.discoveredIslands.push({
                index: fp.index, name: fp.name,
                x: Math.round(fp.islandX), y: Math.round(fp.islandY), z: Math.round(fp.islandZ)
              });
              this.saveProgress();
            }
          }
        }
      }

      if (p.carriedItem) {
        p.carriedItem.x = p.pos.x;
        p.carriedItem.y = p.pos.y + 2.55;
        p.carriedItem.z = p.pos.z;
        p.carriedItem.mesh.position.set(p.carriedItem.x, p.carriedItem.y, p.carriedItem.z);
      }

      // Visual Rig Animation
      p.squash += (1 - p.squash) * Math.min(1, dt * 10);
      this.patchRig.scaleGroup.scale.set(1 / Math.sqrt(p.squash), p.squash, 1 / Math.sqrt(p.squash));
      this.patchRig.root.position.copy(p.pos);
      this.patchRig.root.rotation.y = p.yaw;

      const horizSpeed = Math.hypot(p.vel.x, p.vel.z);
      const walkSwing = p.grounded ? Math.sin(this.elapsed * 12) * Math.min(1, horizSpeed / 9) * 0.75 : Math.sin(p.flutterTimer) * 0.6;
      this.patchRig.legL.rotation.x = walkSwing;
      this.patchRig.legR.rotation.x = -walkSwing;
      this.patchRig.armL.rotation.x = -walkSwing * 0.85;
      this.patchRig.armR.rotation.x = walkSwing * 0.85;

      if (p.rollTimer > 0) {
        this.patchRig.bodyPivot.rotation.x += dt * 16;
      } else {
        this.patchRig.bodyPivot.rotation.x = 0;
      }

      if (p.slapTimer > 0) {
        p.slapTimer -= dt;
        this.patchRig.bodyPivot.rotation.y = p.slapTimer * 24;
        this.patchRig.armL.rotation.z = -1.4;
        this.patchRig.armR.rotation.z = 1.4;
      } else {
        this.patchRig.bodyPivot.rotation.y = 0;
        this.patchRig.armL.rotation.z = -0.22;
        this.patchRig.armR.rotation.z = 0.22;
      }

      if (this.patchRig.propeller) this.patchRig.propeller.rotation.y += dt * (p.grounded ? 5 : 18);
      this.animateClothCape(horizSpeed);

      this.patchRig.blinkTimer -= dt;
      if (this.patchRig.blinkTimer <= 0) {
        const close = this.patchRig.blinkTimer > -0.11;
        this.patchRig.eyeL.scale.y = close ? 0.15 : 1;
        this.patchRig.eyeR.scale.y = close ? 0.15 : 1;
        if (this.patchRig.blinkTimer <= -0.12) this.patchRig.blinkTimer = 2.6 + Math.random() * 2.2;
      }

      if (this.state.coopEnabled) {
        const freezeShotBuddy = (this.shotMode === 'explore' || this.shotMode === 'frontier') && this.keys.size === 0;
        let dist = 0;
        if (!freezeShotBuddy) {
          const targetX = p.pos.x - Math.sin(p.yaw) * 2.3 + Math.cos(p.yaw) * 1.4;
          const targetZ = p.pos.z - Math.cos(p.yaw) * 2.3 - Math.sin(p.yaw) * 1.4;
          const dx = targetX - this.buddy.pos.x;
          const dz = targetZ - this.buddy.pos.z;
          dist = Math.hypot(dx, dz);
          if (dist > 24) {
            this.teleportBuddyToPlayer();
          } else if (dist > 0.6) {
            this.buddy.pos.x += dx * Math.min(1, dt * 3.8);
            this.buddy.pos.z += dz * Math.min(1, dt * 3.8);
            this.buddy.yaw = Math.atan2(dx, dz);
          }
          const bf = this.world.sampleFloor(this.buddy.pos.x, this.buddy.pos.y + 1.5, this.buddy.pos.z);
          const targetY = bf.y > -900 ? bf.y : p.pos.y;
          this.buddy.pos.y += (targetY - this.buddy.pos.y) * Math.min(1, dt * 6);
        }
        this.stitchRig.root.position.copy(this.buddy.pos);
        this.stitchRig.root.rotation.y = this.buddy.yaw;
        const bSwing = dist > 0.8 ? Math.sin(this.elapsed * 11) * 0.55 : 0;
        this.stitchRig.legL.rotation.x = bSwing;
        this.stitchRig.legR.rotation.x = -bSwing;
        if (this.stitchRig.propeller) this.stitchRig.propeller.rotation.y += dt * 11;
      }

      this.world.updateStreaming(p.pos.x, p.pos.z);
    }

    animateClothCape(horizSpeed) {
      const cape = this.patchRig.capeMesh;
      const rest = this.patchRig.capeRestPos;
      if (!cape || !rest) return;
      cape.rotation.x = 0.24 + Math.min(0.65, horizSpeed * 0.055);
      const posAttr = cape.geometry.attributes.position;
      const amp = 0.045 + Math.min(0.14, horizSpeed * 0.012);
      for (let i = 0; i < posAttr.count; i++) {
        const rx = rest[i * 3];
        const ry = rest[i * 3 + 1];
        const rz = rest[i * 3 + 2];
        const dropFactor = Math.min(1, Math.max(0, -ry / 1.04));
        const wave = Math.sin(this.elapsed * 6.5 - dropFactor * 4.5 + rx * 3.2) * amp * dropFactor;
        posAttr.setXYZ(i, rx, ry, rz - wave);
      }
      posAttr.needsUpdate = true;
      cape.geometry.computeVertexNormals();
    }

    updateCamera(dt) {
      const p = this.player;
      if (this.state.mode === 'wardrobe') {
        const lookAt = new THREE.Vector3(p.pos.x + 1.35, p.pos.y + 1.25, p.pos.z);
        const camPos = new THREE.Vector3(p.pos.x + 1.45, p.pos.y + 2.05, p.pos.z + 7.2);
        this.camera.position.lerp(camPos, Math.min(1, dt * 8));
        this.camera.lookAt(lookAt);
      } else if (this.state.mode === 'title') {
        const sway = Math.sin((this.elapsed || 0) * 0.35) * 1.4;
        const camPos = new THREE.Vector3(p.pos.x - 3.2 + sway, p.pos.y + 3.9, p.pos.z + 10.6);
        this.camera.position.lerp(camPos, Math.min(1, dt * 5));
        this.camera.lookAt(p.pos.x - 1.4, p.pos.y + 1.4, p.pos.z - 6);
      } else {
        const lookTarget = this.shotMode === 'frontier'
          ? new THREE.Vector3(p.pos.x + 2.4, p.pos.y + 3.8, p.pos.z - 4.0)
          : new THREE.Vector3(p.pos.x, p.pos.y + 1.55, p.pos.z);
        const horiz = Math.cos(this.cameraPitch) * this.cameraDist;
        const vert = Math.sin(this.cameraPitch) * this.cameraDist;
        const desiredPos = new THREE.Vector3(
          lookTarget.x + Math.sin(this.cameraYaw) * horiz,
          lookTarget.y + vert,
          lookTarget.z + Math.cos(this.cameraYaw) * horiz
        );
        this.camera.position.lerp(desiredPos, Math.min(1, dt * 9));
        this.camera.lookAt(lookTarget);
      }

      // Keep Sky Dome, Tight +-24m Tracking Sun Shadows, Rim Light & Hero Light synced around Patch
      this.skyDome.position.copy(p.pos);
      this.sunLight.position.set(p.pos.x + 32, p.pos.y + 56, p.pos.z + 28);
      this.sunLight.target.position.copy(p.pos);
      this.sunLight.target.updateMatrixWorld();

      this.rimLight.position.set(p.pos.x - 34, p.pos.y + 24, p.pos.z - 30);
      this.rimLight.target.position.copy(p.pos);
      this.rimLight.target.updateMatrixWorld();

      this.heroLight.position.set(p.pos.x + 0.6, p.pos.y + 2.6, p.pos.z + 1.6);
    }

    getCurrentRegionLabel() {
      const { x, z } = this.player.pos;
      const cx = Math.round(x / CHUNK_SIZE);
      const cz = Math.round(z / CHUNK_SIZE);
      if (Math.abs(cx) > 1 || Math.abs(cz) > 1) {
        const ch = this.world.chunks.get(`${cx},${cz}`);
        const idx = chunkToFrontierIndex(cx, cz);
        return ch ? `Frontier Island #${idx} — ${ch.themeName}` : `Frontier Sky-Island #${idx}`;
      }
      let closest = CORE_BIOMES[0];
      let bestD = Infinity;
      for (const bm of CORE_BIOMES) {
        const d = Math.hypot(x - bm.x, z - bm.z);
        if (d < bestD) { bestD = d; closest = bm; }
      }
      return closest.name;
    }

    syncHUD() {
      document.getElementById('orbCount').textContent = this.state.orbs;
      document.getElementById('bellCount').textContent = this.state.bells;
      document.getElementById('critterCount').textContent = this.state.critters;
      document.getElementById('biomeBadge').textContent = this.getCurrentRegionLabel();

      const rc = document.getElementById('radarCanvas');
      const ctx = rc.getContext('2d');
      const W = rc.width, H = rc.height;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#fff9eb';
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, W / 2 - 2, 0, Math.PI * 2);
      ctx.fill();

      const scale = 0.22;
      for (const bm of CORE_BIOMES) {
        const dx = (bm.x - this.player.pos.x) * scale;
        const dz = (bm.z - this.player.pos.z) * scale;
        const dist = Math.hypot(dx, dz);
        const maxR = W * 0.4;
        const k = dist > maxR ? maxR / dist : 1;
        ctx.fillStyle = bm.color;
        ctx.beginPath();
        ctx.arc(W / 2 + dx * k, H / 2 + dz * k, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#eb4d70';
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }

    loop(now) {
      requestAnimationFrame(this.loop);
      const dt = Math.max(0.001, Math.min(0.05, (now - this.lastTime) / 1000));
      this.lastTime = now;
      this.elapsed += dt;

      if (this.toastTimer > 0) {
        this.toastTimer -= dt;
        if (this.toastTimer <= 0) document.getElementById('toastBanner').classList.add('hidden');
      }

      this.updatePlayer(dt);
      this.world.update(dt, this.elapsed, this.player.pos, this.buddy.pos, this.state.coopEnabled, this.localLights);
      this.updateCamera(dt);
      this.vfx.update(dt, this.elapsed, this.camera, this.player.pos);
      this.audio.update(dt);
      this.syncHUD();

      if (this.state.bloomEnabled) {
        this.renderer.toneMapping = THREE.NoToneMapping;
        this.composer.render();
      } else {
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.render(this.scene, this.camera);
      }
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    window.__PATCHWORK_GAME__ = new PatchworkGame();
  });
})();
