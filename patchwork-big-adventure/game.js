(() => {
  'use strict';

  // ============================================================================
  // 1. CONSTANTS, PALETTES & SAVE DATA
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
    { id: 'none',      name: 'No Hat',               color: '#e5d4b8' },
    { id: 'bunny',     name: 'Floppy Bunny Ears',    color: '#ffb7c5' },
    { id: 'knight',    name: 'Cardboard Knight Helm',color: '#c99763' },
    { id: 'dino',      name: 'Dino Hood',            color: '#46c77c' },
    { id: 'astro',     name: 'Astronaut Bubble',     color: '#9ee8ff' },
    { id: 'crown',     name: 'Royal Paper Crown',    color: '#ffd43b' },
    { id: 'fox',       name: 'Fox Ears',             color: '#f27830' },
    { id: 'propeller', name: 'Propeller Beanie',     color: '#ff4d6d' },
    { id: 'wizard',    name: 'Wizard Felt Cone',     color: '#6b4de6' }
  ].slice(1); // Exact 8 3D Hats + ability to toggle off if clicked again? Keep exact 8!

  const OUTFIT_CATALOG = [
    { id: 'vest',    name: 'Zipper Vest',      color: '#3498db' },
    { id: 'cape',    name: 'Superhero Cape',   color: '#e63946' },
    { id: 'pack',    name: 'Explorer Pack',    color: '#8c6239' },
    { id: 'scarf',   name: 'Rainbow Scarf',    color: '#ff9f1c' },
    { id: 'bee',     name: 'Bumblebee Stripes',color: '#ffd124' },
    { id: 'dragon',  name: 'Dragon Wings',     color: '#38b000' }
  ];

  const CORE_BIOMES = [
    { id: 'meadows',   name: 'Soaring Stitching Meadows',          x: 0,    z: 0,    color: '#289446', spawn: [0, 3, 12] },
    { id: 'cardboard', name: 'Cardboard Castle Peaks',             x: 0,    z: -130, color: '#bf8549', spawn: [0, 4, -108] },
    { id: 'bay',       name: 'Button Bay & Sponge Reef',           x: 130,  z: 0,    color: '#2dc2cc', spawn: [108, 4, 0] },
    { id: 'clockwork', name: 'Velvet Cloudworks & Clockwork Loft', x: -130, z: 0,    color: '#5e40b8', spawn: [-108, 4, 0] },
    { id: 'origami',   name: 'Origami Canyon & Confetti Peak',     x: 0,    z: 130,  color: '#de6c35', spawn: [0, 4, 108] }
  ];

  const FRONTIER_THEMES = [
    { name: 'Felt Clover',     top: '#2b9e4b', side: '#195c2c', stitch: '#ffffff', accent: '#ffcf48' },
    { name: 'Lavender Velvet', top: '#6e4bc9', side: '#43298a', stitch: '#f7ecff', accent: '#6ef3ff' },
    { name: 'Terracotta Paper',top: '#d66b3e', side: '#9c4623', stitch: '#fff0db', accent: '#4de3c1' },
    { name: 'Ocean Sponge',    top: '#24b5b2', side: '#167480', stitch: '#e4ffff', accent: '#ff7096' },
    { name: 'Snow Knit',       top: '#8ac2f5', side: '#4c7fb8', stitch: '#ffffff', accent: '#ff5d8f' }
  ];

  const PIANO_NOTES = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77, 1046.5];
  const PIANO_COLORS = ['#f0414b', '#f27c2e', '#f5b718', '#6cb81b', '#22b07d', '#1676bd', '#654296', '#eb4d8d'];

  // Deterministic PRNG
  function mulberry32(a) {
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hashChunk(cx, cz) {
    return ((cx * 73856093) ^ (cz * 19349663) ^ 0x9e3779b9) >>> 0;
  }

  // Spiral enumerator mapping frontier index (1, 2, ...) <-> chunk (cx, cz) outside |cx|<=1 && |cz|<=1
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
    for (let r = 2; r < ring; r++) {
      idx += 8 * r;
    }
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
    // Ensure the inner cardinal ring at ±180 clears the ±130 core biomes cleanly
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
        case 'jump':     this.tone(330, 0.16, 'sine', 0.11, 560); break;
        case 'flutter':  this.tone(420, 0.07, 'triangle', 0.06, 510); break;
        case 'slap':     this.tone(240, 0.11, 'sawtooth', 0.07, 130); break;
        case 'pound':    this.tone(150, 0.22, 'triangle', 0.14, 55); break;
        case 'bell':     this.tone(880, 0.14, 'sine', 0.1, 1320); break;
        case 'orb':
          this.tone(523.25, 0.28, 'triangle', 0.12);
          setTimeout(() => this.tone(659.25, 0.28, 'triangle', 0.12), 70);
          setTimeout(() => this.tone(783.99, 0.38, 'sine', 0.13), 140);
          break;
        case 'bounce':   this.tone(220, 0.24, 'sine', 0.13, 680); break;
        case 'grapple':  this.tone(580, 0.1, 'square', 0.06, 760); break;
        case 'boomerang':this.tone(390, 0.18, 'triangle', 0.08, 620); break;
        case 'jet':      this.tone(260, 0.18, 'sawtooth', 0.06, 480); break;
        case 'box':      this.tone(190, 0.14, 'square', 0.09, 95); break;
        case 'flag':
          [523.25, 659.25, 783.99, 1046.5].forEach((n, i) => {
            setTimeout(() => this.tone(n, 0.25, 'triangle', 0.12), i * 85);
          });
          break;
        case 'bubble':   this.tone(320, 0.22, 'sine', 0.09, 640); break;
        case 'critter':  this.tone(720, 0.16, 'sine', 0.11, 980); break;
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
  // 3. TACTILE PBR CRAFT MATERIAL FACTORY (512x512 CanvasTextures + PMREM)
  // ============================================================================
  class CraftMaterials {
    constructor(renderer) {
      this.renderer = renderer;
      this.cache = new Map();
      this.envMap = this.createEnvMap();
      this.initSharedTextures();
    }

    createEnvMap() {
      const pmrem = new THREE.PMREMGenerator(this.renderer);
      pmrem.compileEquirectangularShader();
      const envScene = new THREE.Scene();
      const skyGeo = new THREE.SphereGeometry(20, 24, 16);
      const skyMat = new THREE.MeshBasicMaterial({
        side: THREE.BackSide,
        color: 0xaee4ff
      });
      envScene.add(new THREE.Mesh(skyGeo, skyMat));

      const sunBall = new THREE.Mesh(
        new THREE.SphereGeometry(2.5, 16, 12),
        new THREE.MeshBasicMaterial({ color: 0xfff7d6 })
      );
      sunBall.position.set(10, 12, 6);
      envScene.add(sunBall);

      const groundDisc = new THREE.Mesh(
        new THREE.CircleGeometry(18, 24),
        new THREE.MeshBasicMaterial({ color: 0x8ad97c, side: THREE.DoubleSide })
      );
      groundDisc.rotation.x = -Math.PI / 2;
      groundDisc.position.y = -6;
      envScene.add(groundDisc);

      const rt = pmrem.fromScene(envScene, 0.04);
      skyGeo.dispose();
      skyMat.dispose();
      sunBall.geometry.dispose();
      sunBall.material.dispose();
      groundDisc.geometry.dispose();
      groundDisc.material.dispose();
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
      tex.anisotropy = 4;
      tex.needsUpdate = true;
      return tex;
    }

    initSharedTextures() {
      // 1. Knit Bump Map (512x512 diagonal stitches)
      {
        const { canvas, ctx } = this.makeCanvas(512);
        ctx.fillStyle = '#707070';
        ctx.fillRect(0, 0, 512, 512);
        const step = 16;
        for (let y = 0; y < 512; y += step) {
          const offset = ((y / step) % 2) * (step * 0.5);
          for (let x = -step; x < 512 + step; x += step) {
            ctx.strokeStyle = '#dedede';
            ctx.lineWidth = 4.2;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(x + offset + 2, y + 2);
            ctx.lineTo(x + offset + step * 0.45, y + step - 2);
            ctx.stroke();

            ctx.strokeStyle = '#c8c8c8';
            ctx.beginPath();
            ctx.moveTo(x + offset + step - 2, y + 2);
            ctx.lineTo(x + offset + step * 0.55, y + step - 2);
            ctx.stroke();
          }
        }
        this.knitBump = this.toTexture(canvas, 3, 3, false);
      }

      // 2. Felt Fiber Bump Map (512x512)
      {
        const { canvas, ctx } = this.makeCanvas(512);
        ctx.fillStyle = '#808080';
        ctx.fillRect(0, 0, 512, 512);
        const rng = mulberry32(4411);
        for (let i = 0; i < 6500; i++) {
          const x = rng() * 512;
          const y = rng() * 512;
          const len = 4 + rng() * 10;
          const ang = rng() * Math.PI * 2;
          const shade = Math.floor(95 + rng() * 110);
          ctx.strokeStyle = `rgb(${shade},${shade},${shade})`;
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len);
          ctx.stroke();
        }
        this.feltBump = this.toTexture(canvas, 2, 2, false);
      }

      // 3. Corrugated Cardboard Diffuse + Bump (512x512 with masking tape X-patches)
      {
        const { canvas, ctx } = this.makeCanvas(512);
        const { canvas: bCan, ctx: bCtx } = this.makeCanvas(512);
        ctx.fillStyle = '#b57b42';
        ctx.fillRect(0, 0, 512, 512);
        bCtx.fillStyle = '#808080';
        bCtx.fillRect(0, 0, 512, 512);

        for (let x = 0; x < 512; x += 12) {
          const g = ctx.createLinearGradient(x, 0, x + 12, 0);
          g.addColorStop(0, 'rgba(72,42,16,0.22)');
          g.addColorStop(0.5, 'rgba(255,224,182,0.14)');
          g.addColorStop(1, 'rgba(72,42,16,0.22)');
          ctx.fillStyle = g;
          ctx.fillRect(x, 0, 12, 512);

          bCtx.fillStyle = (x / 12) % 2 === 0 ? '#a8a8a8' : '#646464';
          bCtx.fillRect(x, 0, 6, 512);
        }

        // Cream masking-tape X-patches
        const drawTapeX = (cx, cy, size, angle) => {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(angle);
          ctx.fillStyle = 'rgba(246, 232, 193, 0.9)';
          ctx.strokeStyle = 'rgba(170, 140, 95, 0.5)';
          ctx.lineWidth = 2;
          ctx.fillRect(-size, -12, size * 2, 24);
          ctx.strokeRect(-size, -12, size * 2, 24);
          ctx.rotate(Math.PI / 2);
          ctx.fillRect(-size, -12, size * 2, 24);
          ctx.strokeRect(-size, -12, size * 2, 24);
          ctx.restore();
        };
        drawTapeX(118, 130, 48, 0.2);
        drawTapeX(392, 370, 52, -0.35);

        this.cardboardMat = new THREE.MeshStandardMaterial({
          map: this.toTexture(canvas, 1, 1, true),
          bumpMap: this.toTexture(bCan, 1, 1, false),
          bumpScale: 0.08,
          roughness: 0.88,
          metalness: 0.02,
          envMapIntensity: 0.22
        });
      }

      // 4. Wood Spool Material (512x512)
      {
        const { canvas, ctx } = this.makeCanvas(512);
        ctx.fillStyle = '#cf9455';
        ctx.fillRect(0, 0, 512, 512);
        for (let y = 0; y < 512; y += 8) {
          ctx.fillStyle = (y / 8) % 2 === 0 ? 'rgba(130,76,28,0.18)' : 'rgba(255,230,190,0.12)';
          ctx.fillRect(0, y, 512, 4 + Math.sin(y * 0.08) * 2);
        }
        this.woodMat = new THREE.MeshStandardMaterial({
          map: this.toTexture(canvas, 1, 1, true),
          bumpMap: this.feltBump,
          bumpScale: 0.03,
          roughness: 0.58,
          metalness: 0.04,
          envMapIntensity: 0.25
        });
      }

      // 5. Checkered Flag Felt Material (512x512)
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
          bumpScale: 0.04,
          roughness: 0.88,
          envMapIntensity: 0.22,
          side: THREE.DoubleSide
        });
      }

      // 6. Translucent Turquoise Cellophane Water Material (512x512)
      {
        const { canvas, ctx } = this.makeCanvas(512);
        const g = ctx.createLinearGradient(0, 0, 512, 512);
        g.addColorStop(0, '#27d5e8');
        g.addColorStop(0.5, '#1ba8cc');
        g.addColorStop(1, '#36e3d4');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 512, 512);
        const rng = mulberry32(9012);
        ctx.strokeStyle = 'rgba(255,255,255,0.34)';
        ctx.lineWidth = 2.5;
        for (let i = 0; i < 65; i++) {
          const x = rng() * 512;
          const y = rng() * 512;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + (rng() - 0.5) * 140, y + (rng() - 0.5) * 90);
          ctx.stroke();
        }
        this.cellophaneMat = new THREE.MeshPhysicalMaterial({
          map: this.toTexture(canvas, 6, 6, true),
          bumpMap: this.feltBump,
          bumpScale: 0.06,
          roughness: 0.16,
          metalness: 0.05,
          clearcoat: 0.9,
          clearcoatRoughness: 0.12,
          transparent: true,
          opacity: 0.78,
          envMapIntensity: 1.3
        });
      }

      // 7. Glossy Brass / Gold Material
      this.brassMat = new THREE.MeshStandardMaterial({
        color: 0xf6c445,
        roughness: 0.25,
        metalness: 0.82,
        envMapIntensity: 1.4
      });

      // 8. Pink Sponge Bounce Pad Material
      this.spongeMat = this.getFeltMaterial('#ea4a8b', '#ffe3f0', false, 1);
    }

    getKnitMaterial(hexColor, stitchHex = '#fff3dc') {
      const key = `knit_${hexColor}_${stitchHex}`;
      if (this.cache.has(key)) return this.cache.get(key);
      const { canvas, ctx } = this.makeCanvas(512);
      ctx.fillStyle = hexColor;
      ctx.fillRect(0, 0, 512, 512);
      const step = 16;
      for (let y = 0; y < 512; y += step) {
        const offset = ((y / step) % 2) * (step * 0.5);
        for (let x = -step; x < 512 + step; x += step) {
          ctx.strokeStyle = 'rgba(0,0,0,0.14)';
          ctx.lineWidth = 4;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(x + offset + 2, y + 3);
          ctx.lineTo(x + offset + step * 0.45, y + step - 1);
          ctx.stroke();

          ctx.strokeStyle = stitchHex;
          ctx.globalAlpha = 0.28;
          ctx.lineWidth = 2.6;
          ctx.beginPath();
          ctx.moveTo(x + offset + step - 2, y + 2);
          ctx.lineTo(x + offset + step * 0.55, y + step - 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
      const mat = new THREE.MeshStandardMaterial({
        map: this.toTexture(canvas, 3, 3, true),
        bumpMap: this.knitBump,
        bumpScale: 0.08,
        roughness: 0.9,
        metalness: 0.02,
        envMapIntensity: 0.22
      });
      this.cache.set(key, mat);
      return mat;
    }

    getFeltMaterial(baseHex, stitchHex = '#ffffff', stitchedEdges = true, repeat = 1) {
      const key = `felt_${baseHex}_${stitchHex}_${stitchedEdges}_${repeat}`;
      if (this.cache.has(key)) return this.cache.get(key);
      const { canvas, ctx } = this.makeCanvas(512);
      ctx.fillStyle = baseHex;
      ctx.fillRect(0, 0, 512, 512);
      const rng = mulberry32(baseHex.split('').reduce((a, c) => a + c.charCodeAt(0), 0));
      for (let i = 0; i < 3200; i++) {
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
        bumpScale: 0.06,
        roughness: 0.92,
        metalness: 0.02,
        envMapIntensity: 0.22
      });
      this.cache.set(key, mat);
      return mat;
    }

    getButtonMaterial(hexColor) {
      const key = `btn_${hexColor}`;
      if (this.cache.has(key)) return this.cache.get(key);
      const { canvas, ctx } = this.makeCanvas(512);
      ctx.fillStyle = hexColor;
      ctx.fillRect(0, 0, 512, 512);
      const g = ctx.createRadialGradient(185, 165, 16, 256, 256, 240);
      g.addColorStop(0, 'rgba(255,255,255,0.62)');
      g.addColorStop(0.28, 'rgba(255,255,255,0.14)');
      g.addColorStop(1, 'rgba(0,0,0,0.08)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 512);

      // Glossy rim
      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.lineWidth = 22;
      ctx.beginPath();
      ctx.arc(256, 256, 215, 0, Math.PI * 2);
      ctx.stroke();

      // 4 thread holes
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
  // 4. ARTICULATED PLUSH RIG (HERO PATCH & BUDDY STITCH)
  // ============================================================================
  function createPlushRig(materials, yarnIdx = 0, hatIdx = 0, outfitIdx = 0) {
    const root = new THREE.Group();
    const scaleGroup = new THREE.Group();
    root.add(scaleGroup);

    const bodyPivot = new THREE.Group();
    scaleGroup.add(bodyPivot);

    const yarn = YARN_PALETTE[yarnIdx % YARN_PALETTE.length];
    const knitMat = materials.getKnitMaterial(yarn.hex, yarn.stitch);
    const buttonMat = materials.getButtonMaterial('#231814');
    const silverMat = new THREE.MeshStandardMaterial({ color: 0xdfe6ee, roughness: 0.2, metalness: 0.85 });

    // Torso
    const torso = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 16), knitMat);
    torso.scale.set(1.0, 1.15, 0.88);
    torso.position.y = 0.82;
    torso.castShadow = true;
    torso.receiveShadow = true;
    bodyPivot.add(torso);

    // Chest Zipper Seam + Pull Tab
    const zipSeam = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.56, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xb7bec7, metalness: 0.7, roughness: 0.3 })
    );
    zipSeam.position.set(0, 0.82, 0.46);
    bodyPivot.add(zipSeam);

    const zipPull = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.16, 0.05), materials.brassMat);
    zipPull.position.set(0, 0.96, 0.51);
    zipPull.rotation.x = -0.25;
    bodyPivot.add(zipPull);

    // Head Group
    const headGroup = new THREE.Group();
    headGroup.position.y = 1.62;
    bodyPivot.add(headGroup);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.56, 22, 18), knitMat);
    head.scale.set(1.06, 0.96, 0.98);
    head.castShadow = true;
    head.receiveShadow = true;
    headGroup.add(head);

    // Glossy 4-hole Button Eyes
    const eyeGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.05, 16);
    eyeGeo.rotateX(Math.PI / 2);
    const eyeL = new THREE.Mesh(eyeGeo, buttonMat);
    eyeL.position.set(-0.2, 0.08, 0.51);
    eyeL.rotation.y = -0.22;
    headGroup.add(eyeL);

    const eyeR = new THREE.Mesh(eyeGeo, buttonMat);
    eyeR.position.set(0.2, 0.08, 0.51);
    eyeR.rotation.y = 0.22;
    headGroup.add(eyeR);

    // Eye thread X-crosses
    const threadMat = new THREE.MeshBasicMaterial({ color: 0xfff5de });
    for (const ex of [-0.2, 0.2]) {
      const th = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.018, 0.02), threadMat);
      th.position.set(ex, 0.08, 0.535);
      th.rotation.z = 0.7;
      headGroup.add(th);
    }

    // Stitched Smile
    const smile = new THREE.Mesh(
      new THREE.TorusGeometry(0.14, 0.022, 8, 16, Math.PI),
      new THREE.MeshBasicMaterial({ color: 0x2a1810 })
    );
    smile.rotation.z = Math.PI;
    smile.position.set(0, -0.09, 0.52);
    headGroup.add(smile);

    // Arms & Legs
    const armGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.58, 12);
    armGeo.translate(0, -0.24, 0);
    const armL = new THREE.Group();
    armL.position.set(-0.56, 1.15, 0);
    const armLMesh = new THREE.Mesh(armGeo, knitMat);
    armLMesh.castShadow = true;
    armL.add(armLMesh);
    bodyPivot.add(armL);

    const armR = new THREE.Group();
    armR.position.set(0.56, 1.15, 0);
    const armRMesh = new THREE.Mesh(armGeo, knitMat);
    armRMesh.castShadow = true;
    armR.add(armRMesh);
    bodyPivot.add(armR);

    const legGeo = new THREE.CylinderGeometry(0.14, 0.17, 0.44, 12);
    legGeo.translate(0, -0.2, 0);
    const legL = new THREE.Group();
    legL.position.set(-0.24, 0.4, 0);
    const legLMesh = new THREE.Mesh(legGeo, knitMat);
    legLMesh.castShadow = true;
    legL.add(legLMesh);
    bodyPivot.add(legL);

    const legR = new THREE.Group();
    legR.position.set(0.24, 0.4, 0);
    const legRMesh = new THREE.Mesh(legGeo, knitMat);
    legRMesh.castShadow = true;
    legR.add(legRMesh);
    bodyPivot.add(legR);

    const hatMount = new THREE.Group();
    hatMount.position.set(0, 0.45, 0);
    headGroup.add(hatMount);

    const outfitMount = new THREE.Group();
    outfitMount.position.set(0, 0.85, 0);
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
      armLMesh,
      armRMesh,
      legL,
      legR,
      legLMesh,
      legRMesh,
      hatMount,
      outfitMount,
      propeller: null,
      capeMesh: null,
      silverMat,
      blinkTimer: 2.5
    };

    applyPlushCosmetics(rig, materials, yarnIdx, hatIdx, outfitIdx);
    return rig;
  }

  function clearGroupChildren(grp) {
    while (grp.children.length > 0) {
      const ch = grp.children[0];
      grp.remove(ch);
    }
  }

  function applyPlushCosmetics(rig, materials, yarnIdx, hatIdx, outfitIdx) {
    const yarn = YARN_PALETTE[yarnIdx % YARN_PALETTE.length];
    const knitMat = materials.getKnitMaterial(yarn.hex, yarn.stitch);
    rig.torso.material = knitMat;
    rig.head.material = knitMat;
    rig.armLMesh.material = knitMat;
    rig.armRMesh.material = knitMat;
    rig.legLMesh.material = knitMat;
    rig.legRMesh.material = knitMat;

    // Hats
    clearGroupChildren(rig.hatMount);
    rig.propeller = null;
    const hat = HAT_CATALOG[hatIdx % HAT_CATALOG.length];
    const hatFelt = materials.getFeltMaterial(hat.color, '#ffffff', false);

    if (hat.id === 'bunny') {
      for (const sx of [-0.22, 0.22]) {
        const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 0.68, 12), hatFelt);
        ear.position.set(sx, 0.32, -0.04);
        ear.rotation.z = sx < 0 ? 0.26 : -0.26;
        ear.rotation.x = -0.15;
        ear.castShadow = true;
        rig.hatMount.add(ear);
      }
    } else if (hat.id === 'knight') {
      const helm = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.6, 0.56, 12), materials.cardboardMat);
      helm.position.y = -0.05;
      helm.castShadow = true;
      rig.hatMount.add(helm);
      const plume = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.38, 0.62), materials.getFeltMaterial('#eb4d70'));
      plume.position.set(0, 0.36, -0.02);
      rig.hatMount.add(plume);
    } else if (hat.id === 'dino') {
      const hood = new THREE.Mesh(new THREE.SphereGeometry(0.58, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.58), hatFelt);
      hood.position.y = -0.28;
      rig.hatMount.add(hood);
      for (let i = 0; i < 3; i++) {
        const spike = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.28, 6), materials.getFeltMaterial('#ffd43b'));
        spike.position.set(0, 0.28 - i * 0.14, -0.1 - i * 0.24);
        spike.rotation.x = -0.55 - i * 0.35;
        rig.hatMount.add(spike);
      }
    } else if (hat.id === 'astro') {
      const glass = new THREE.Mesh(
        new THREE.SphereGeometry(0.7, 20, 16),
        new THREE.MeshPhysicalMaterial({
          color: 0xdff8ff, roughness: 0.08, metalness: 0.05, clearcoat: 1, transparent: true, opacity: 0.38
        })
      );
      glass.position.y = -0.44;
      rig.hatMount.add(glass);
      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.07, 8, 20), materials.brassMat);
      collar.rotation.x = Math.PI / 2;
      collar.position.y = -0.82;
      rig.hatMount.add(collar);
    } else if (hat.id === 'crown') {
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.36, 0.26, 8), materials.brassMat);
      band.position.y = 0.08;
      rig.hatMount.add(band);
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        const pt = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.24, 4), materials.brassMat);
        pt.position.set(Math.cos(a) * 0.34, 0.26, Math.sin(a) * 0.34);
        rig.hatMount.add(pt);
      }
    } else if (hat.id === 'fox') {
      for (const sx of [-0.28, 0.28]) {
        const ear = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.36, 4), hatFelt);
        ear.position.set(sx, 0.18, 0);
        ear.rotation.z = sx < 0 ? 0.32 : -0.32;
        rig.hatMount.add(ear);
      }
    } else if (hat.id === 'propeller') {
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.52, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), hatFelt);
      cap.position.y = -0.14;
      rig.hatMount.add(cap);
      const spinner = new THREE.Group();
      spinner.position.y = 0.40;
      const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.05, 0.13), materials.getFeltMaterial('#ffd43b'));
      const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.05, 0.82), materials.getFeltMaterial('#38aee6'));
      spinner.add(b1, b2);
      rig.hatMount.add(spinner);
      rig.propeller = spinner;
    } else if (hat.id === 'wizard') {
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.05, 18), hatFelt);
      brim.position.y = 0.02;
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.86, 14), hatFelt);
      cone.position.y = 0.44;
      cone.rotation.z = 0.12;
      rig.hatMount.add(brim, cone);
    }

    // Outfits
    clearGroupChildren(rig.outfitMount);
    rig.capeMesh = null;
    const outfit = OUTFIT_CATALOG[outfitIdx % OUTFIT_CATALOG.length];
    const outFelt = materials.getFeltMaterial(outfit.color, '#ffffff', true);

    if (outfit.id === 'vest') {
      const vest = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.56, 0.58, 16, 1, true, 0.5, Math.PI * 1.7), outFelt);
      vest.rotation.y = Math.PI * 0.65;
      rig.outfitMount.add(vest);
    } else if (outfit.id === 'cape') {
      const cape = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.96, 0.06), outFelt);
      cape.position.set(0, -0.1, -0.54);
      cape.rotation.x = 0.24;
      cape.castShadow = true;
      rig.outfitMount.add(cape);
      rig.capeMesh = cape;
    } else if (outfit.id === 'pack') {
      const pack = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.62, 0.38), outFelt);
      pack.position.set(0, 0.04, -0.54);
      pack.castShadow = true;
      const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.72, 12), materials.getFeltMaterial('#f4b43a'));
      roll.rotation.z = Math.PI / 2;
      roll.position.set(0, 0.4, -0.54);
      rig.outfitMount.add(pack, roll);
    } else if (outfit.id === 'scarf') {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.11, 10, 20), outFelt);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.44;
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.58, 0.07), materials.getFeltMaterial('#ff595e'));
      tail.position.set(0.32, 0.16, -0.44);
      tail.rotation.z = -0.25;
      rig.outfitMount.add(ring, tail);
    } else if (outfit.id === 'bee') {
      for (const sy of [-0.15, 0.1]) {
        const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.53, 0.07, 8, 20), materials.getFeltMaterial(sy > 0 ? '#ffd124' : '#2a221d'));
        stripe.rotation.x = Math.PI / 2;
        stripe.position.y = sy;
        rig.outfitMount.add(stripe);
      }
      for (const sx of [-0.26, 0.26]) {
        const wing = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.22, 0.04), materials.getFeltMaterial('#e0f7ff'));
        wing.position.set(sx, 0.2, -0.52);
        wing.rotation.y = sx < 0 ? 0.5 : -0.5;
        rig.outfitMount.add(wing);
      }
    } else if (outfit.id === 'dragon') {
      for (const sx of [-0.42, 0.42]) {
        const wing = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.78, 4), outFelt);
        wing.position.set(sx, 0.14, -0.56);
        wing.rotation.z = sx < 0 ? 1.15 : -1.15;
        wing.rotation.x = -0.35;
        rig.outfitMount.add(wing);
      }
    }
  }

  // ============================================================================
  // 5. WORLD BUILDER & INFINITE PROCEDURAL WORLDSTREAMER
  // ============================================================================
  class CraftWorld {
    constructor(scene, materials, state, audio, onToast) {
      this.scene = scene;
      this.materials = materials;
      this.state = state;
      this.audio = audio;
      this.onToast = onToast;

      this.coreGroup = new THREE.Group();
      this.scene.add(this.coreGroup);

      this.coreEntities = this.makeBucket();
      this.chunks = new Map(); // key "cx,cz" -> { cx, cz, group, entities, frontierIndex }
      this.particles = [];
      this.boomerangs = [];

      this.buildCoreContinent();
    }

    makeBucket() {
      return {
        colliders: [],     // { kind: 'cylinder'|'box'|'dome', ... }
        movers: [],        // moving/rotating platform visuals + collider refs
        pianoKeys: [],     // musical piano keys
        bouncePads: [],    // pink sponge pads
        grappleRings: [],  // overhead golden rings
        zipRails: [],      // glowing yarn zip-rails
        updrafts: [],      // bubble geysers / fan updrafts
        orbs: [],          // Dreamer Orbs
        bells: [],         // Collectabells
        giftBoxes: [],     // Breakable gift boxes
        enemies: [],       // Goof-Bots & Pom-Pom Hoppers
        critters: [],      // Lost Button Critters
        carryProps: [],    // Yarn balls & Spring cubes
        flagpoles: [],     // Frontier Discovery Flagpoles
        windmills: [],     // Rotating windmills / gears
        interactables: []  // Caravan / Balloon pads
      };
    }

    allBuckets() {
      const list = [this.coreEntities];
      for (const ch of this.chunks.values()) list.push(ch.entities);
      return list;
    }

    // ---- Shared Mesh Helpers ----
    addCylinderPlatform(bucket, group, x, y, z, radius, height, topMat, sideMat, tag = 'solid') {
      const geo = new THREE.CylinderGeometry(radius, radius * 1.03, height, 28);
      const mats = [sideMat, topMat, sideMat];
      const mesh = new THREE.Mesh(geo, mats);
      mesh.position.set(x, y - height * 0.5, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);

      // Decorative white stitched seam ring around rim
      const seam = new THREE.Mesh(
        new THREE.TorusGeometry(radius * 0.96, 0.06, 6, 32),
        this.materials.getFeltMaterial('#ffffff', '#ffffff', false)
      );
      seam.rotation.x = Math.PI / 2;
      seam.position.set(x, y + 0.01, z);
      group.add(seam);

      const col = { kind: 'cylinder', x, z, radius, minY: y - height, topY: y, tag, mesh, dx: 0, dz: 0, dy: 0 };
      bucket.colliders.push(col);
      return { mesh, col };
    }

    addBoxPlatform(bucket, group, x, y, z, w, h, d, mat, tag = 'solid') {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
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
      const geo = new THREE.SphereGeometry(radius, 24, 14, 0, Math.PI * 2, 0, Math.PI * 0.5);
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
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 0.96, 0.55, 24), mat);
      mesh.position.set(x, y - 0.275, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      bucket.colliders.push({ kind: 'cylinder', x, z, radius, minY: y - 0.55, topY: y, tag: 'button' });
    }

    addBouncePad(bucket, group, x, y, z, power = 17.5) {
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.9, 0.65, 20), this.materials.spongeMat);
      pad.position.set(x, y + 0.32, z);
      pad.castShadow = true;
      pad.receiveShadow = true;
      group.add(pad);

      const springRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.3, 0.1, 8, 20),
        this.materials.getFeltMaterial('#fff5a8', '#fff', false)
      );
      springRing.rotation.x = Math.PI / 2;
      springRing.position.set(x, y + 0.66, z);
      group.add(springRing);

      bucket.bouncePads.push({ x, y: y + 0.65, z, radius: 1.85, power, mesh: pad, timer: 0 });
    }

    addGrappleRing(bucket, group, x, y, z) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.14, 12, 24), this.materials.brassMat);
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
          color: colorHex, emissive: colorHex, emissiveIntensity: 0.9, roughness: 0.3
        })
      );
      group.add(tube);
      for (const p of [pStart, pEnd]) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 2.4, 10), this.materials.woodMat);
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
        new THREE.SphereGeometry(0.75, 20, 16),
        new THREE.MeshStandardMaterial({
          color: 0xffe46b,
          emissive: 0xffaa22,
          emissiveIntensity: 1.4,
          roughness: 0.15,
          metalness: 0.25
        })
      );
      grp.add(sphere);

      const halo = new THREE.Mesh(
        new THREE.TorusGeometry(1.12, 0.08, 8, 28),
        new THREE.MeshStandardMaterial({
          color: 0x48f0ff,
          emissive: 0x22d3ee,
          emissiveIntensity: 1.45
        })
      );
      grp.add(halo);
      group.add(grp);
      bucket.orbs.push({ id, x, y, z, baseY: y, mesh: grp, halo, collected: false });
    }

    addBell(bucket, group, x, y, z) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 12, 10),
        new THREE.MeshStandardMaterial({
          color: 0xffd43b, emissive: 0xf59e0b, emissiveIntensity: 0.65, metalness: 0.5, roughness: 0.2
        })
      );
      mesh.position.set(x, y, z);
      group.add(mesh);
      bucket.bells.push({ x, y, z, baseY: y, mesh, collected: false });
    }

    addGiftBox(bucket, group, x, y, z) {
      const grp = new THREE.Group();
      grp.position.set(x, y + 0.7, z);
      const box = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 1.4), this.materials.cardboardMat);
      box.castShadow = true;
      grp.add(box);
      const ribbonMat = this.materials.getFeltMaterial('#eb4d70', '#fff', false);
      const r1 = new THREE.Mesh(new THREE.BoxGeometry(1.46, 1.46, 0.26), ribbonMat);
      const r2 = new THREE.Mesh(new THREE.BoxGeometry(0.26, 1.46, 1.46), ribbonMat);
      grp.add(r1, r2);
      group.add(grp);
      bucket.giftBoxes.push({ x, y: y + 0.7, z, mesh: grp, broken: false });
    }

    addEnemy(bucket, group, x, y, z, kind = 'goofbot', patrolRadius = 3.2) {
      const grp = new THREE.Group();
      grp.position.set(x, y, z);
      if (kind === 'goofbot') {
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.15, 1.0), this.materials.cardboardMat);
        body.position.y = 0.72;
        body.castShadow = true;
        grp.add(body);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff3b3b });
        const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), eyeMat);
        e1.position.set(-0.22, 0.86, 0.52);
        const e2 = e1.clone();
        e2.position.x = 0.22;
        grp.add(e1, e2);
        const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.45, 8), this.materials.brassMat);
        ant.position.y = 1.48;
        grp.add(ant);
      } else {
        const puff = new THREE.Mesh(
          new THREE.SphereGeometry(0.7, 16, 14),
          this.materials.getKnitMaterial('#ff5e99', '#ffd4e6')
        );
        puff.position.y = 0.7;
        puff.castShadow = true;
        grp.add(puff);
        const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), new THREE.MeshBasicMaterial({ color: 0x1a120c }));
        e1.position.set(-0.2, 0.82, 0.63);
        const e2 = e1.clone();
        e2.position.x = 0.2;
        grp.add(e1, e2);
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
        new THREE.SphereGeometry(0.45, 14, 12),
        this.materials.getKnitMaterial('#ff96b8', '#fff')
      );
      body.position.y = 0.45;
      body.castShadow = true;
      grp.add(body);
      const face = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.32, 0.08, 16),
        this.materials.getButtonMaterial('#ffe066')
      );
      face.rotation.x = Math.PI / 2;
      face.position.set(0, 0.52, 0.41);
      grp.add(face);
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
          new THREE.SphereGeometry(0.56, 16, 14),
          this.materials.getKnitMaterial('#ff5e7e', '#fff')
        );
      } else {
        mesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.95, 0.95, 0.95),
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

    addCraftTree(group, x, y, z, scale = 1, crownColor = '#4ad178') {
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32 * scale, 0.45 * scale, 2.5 * scale, 10),
        this.materials.woodMat
      );
      trunk.position.set(x, y + 1.25 * scale, z);
      trunk.castShadow = true;
      group.add(trunk);

      const foliageMat = this.materials.getFeltMaterial(crownColor, '#e8ffe8', false);
      const puff1 = new THREE.Mesh(new THREE.ConeGeometry(1.7 * scale, 2.8 * scale, 10), foliageMat);
      puff1.position.set(x, y + 3.2 * scale, z);
      puff1.castShadow = true;
      group.add(puff1);
    }

    addPaperFlower(group, x, y, z, petalColor = '#ff6b9d') {
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.85, 6), this.materials.getFeltMaterial('#36b562', '#fff', false));
      stem.position.set(x, y + 0.42, z);
      group.add(stem);
      const blossom = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.25, 0.16, 7), this.materials.getButtonMaterial(petalColor));
      blossom.position.set(x, y + 0.88, z);
      group.add(blossom);
    }

    // ---- Build 5 Seamless Core Biomes (~480m x 480m Interconnected Continent) ----
    buildCoreContinent() {
      const b = this.coreEntities;
      const g = this.coreGroup;

      const meadowTop = this.materials.getFeltMaterial('#289446', '#ffffff', true, 3);
      const meadowSide = this.materials.getFeltMaterial('#195c2c', '#d7ffd9', false, 2);
      const velvetTop = this.materials.getFeltMaterial('#5e40b8', '#f8e6ff', true, 2);
      const velvetSide = this.materials.getFeltMaterial('#382278', '#dfd1ff', false, 2);
      const origamiTop = this.materials.getFeltMaterial('#de6c35', '#fff2db', true, 2);
      const origamiSide = this.materials.getFeltMaterial('#a6461c', '#ffd8bd', false, 2);
      const corkTop = this.materials.getFeltMaterial('#cc9f68', '#ffffff', true, 2);

      // 1. SOARING STITCHING MEADOWS (0, 0)
      this.addCylinderPlatform(b, g, 0, 0, 0, 34, 8, meadowTop, meadowSide);
      this.addDomeHill(b, g, -18, 0, 10, 8.5, 3.2, meadowTop);
      this.addDomeHill(b, g, 19, 0, 12, 7.5, 2.8, meadowTop);
      this.addDomeHill(b, g, -12, 0, -21, 6.5, 2.4, meadowTop);

      // Trees & Flowers in Meadows
      [[-24, -4, 1.2], [-20, 18, 1.0], [23, 18, 1.15], [25, -4, 1.0], [-8, 24, 1.2]].forEach(([tx, tz, sc]) => {
        this.addCraftTree(g, tx, 0, tz, sc, '#2fb85c');
      });
      for (let i = 0; i < 16; i++) {
        const ang = (i / 16) * Math.PI * 2;
        const r = 13 + (i % 3) * 6;
        this.addPaperFlower(g, Math.cos(ang) * r, 0, Math.sin(ang) * r, PIANO_COLORS[i % PIANO_COLORS.length]);
      }

      // ZomZom's Costume Caravan at (-14, 0, -10)
      this.buildZomZomCaravan(b, g, -14, 0, -10);

      // Hot-Air Yarn Balloon Fast-Travel Pad at (15, 0, -11)
      this.buildBalloonPad(b, g, 15, 0, -11);

      // Musical Rainbow Piano Bridge heading North from Meadows (z = -24 to -52)
      for (let i = 0; i < 8; i++) {
        const kz = -26 - i * 3.4;
        const kx = Math.sin(i * 0.35) * 1.4;
        const ky = 0.55 + i * 0.25;
        const mat = this.materials.getFeltMaterial(PIANO_COLORS[i], '#ffffff', false);
        const keyMat = mat.clone();
        const { mesh, col } = this.addBoxPlatform(b, g, kx, ky, kz, 5.2, 0.85, 2.7, keyMat, 'piano');
        b.pianoKeys.push({
          noteIdx: i, mesh, col, baseColor: new THREE.Color(PIANO_COLORS[i]), glow: 0
        });
      }

      // Rotating Thread-Spool Bridge continuing North (-56 to -92)
      for (let i = 0; i < 3; i++) {
        const sz = -59 - i * 12;
        const { mesh, col } = this.addCylinderPlatform(b, g, 0, 2.5 + i * 0.4, sz, 4.4, 2.4, this.materials.woodMat, this.materials.getKnitMaterial(PIANO_COLORS[(i + 2) % 8]), 'spool');
        b.movers.push({ kind: 'spin', mesh, col, speed: (i % 2 === 0 ? 1 : -1) * 0.7 });
      }

      // Glossy Button Stepping Stones to East, West & South
      for (let i = 0; i < 5; i++) {
        this.addButtonSteppingStone(b, g, 40 + i * 11, 0.3 + (i % 2) * 0.5, (i % 2 === 0 ? 2 : -2), 3.7, PIANO_COLORS[i]);
        this.addButtonSteppingStone(b, g, -40 - i * 11, 0.6 + i * 0.35, (i % 2 === 0 ? -2 : 2), 3.7, PIANO_COLORS[(i + 4) % 8]);
        this.addButtonSteppingStone(b, g, (i % 2 === 0 ? 2.5 : -2.5), 0.3 + i * 0.35, 40 + i * 11, 3.8, PIANO_COLORS[(i + 2) % 8]);
      }

      // Meadows Gameplay Props, Critters & Orbs
      this.addBouncePad(b, g, 9, 0, 12, 17);
      this.addDreamerOrb(b, g, 0, 2.2, -16, 'core_meadow_1');
      this.addDreamerOrb(b, g, 9, 8.5, 12, 'core_meadow_2');
      this.addButtonCritter(b, g, -6, 0, 8, 'crit_meadow_1');
      this.addButtonCritter(b, g, 8, 0, 4, 'crit_meadow_2');
      this.addCarryProp(b, g, -4, 0, 14, 'yarnball');
      this.addCarryProp(b, g, 6, 0, 15, 'springcube');
      this.addGiftBox(b, g, -10, 0, 4);
      this.addGiftBox(b, g, 11, 0, 6);
      for (let i = 0; i < 8; i++) {
        this.addBell(b, g, Math.cos(i * 0.78) * 10, 1.1, Math.sin(i * 0.78) * 10);
      }

      // 2. CARDBOARD CASTLE PEAKS (North: 0, -130)
      this.addBoxPlatform(b, g, 0, 3.2, -130, 56, 9, 54, this.materials.cardboardMat);
      // Multi-tier castle ramparts & battlements
      this.addBoxPlatform(b, g, 0, 7.2, -142, 34, 4.5, 18, this.materials.cardboardMat);
      this.addBoxPlatform(b, g, 0, 12.2, -148, 16, 5.2, 12, this.materials.cardboardMat);
      for (const tx of [-20, 20]) {
        this.addBoxPlatform(b, g, tx, 9.5, -118, 9, 6.5, 9, this.materials.cardboardMat);
        // Spinning Pencil Windmills
        const mill = this.buildPencilWindmill(g, tx, 9.5, -113);
        b.windmills.push(mill);
      }
      this.addBouncePad(b, g, -12, 3.2, -118, 19);
      this.addBouncePad(b, g, 12, 7.2, -136, 18);
      this.addDreamerOrb(b, g, 0, 14.5, -148, 'core_castle_1');
      this.addDreamerOrb(b, g, -20, 11.6, -118, 'core_castle_2');
      this.addEnemy(b, g, -9, 3.2, -124, 'goofbot', 4);
      this.addEnemy(b, g, 9, 3.2, -124, 'goofbot', 4);
      this.addGiftBox(b, g, 0, 7.2, -135);
      this.addButtonCritter(b, g, 18, 3.2, -128, 'crit_castle_1');

      // 3. BUTTON BAY & SPONGE REEF (East: +130, 0)
      // Translucent turquoise cellophane ocean below!
      const ocean = new THREE.Mesh(new THREE.CircleGeometry(72, 48), this.materials.cellophaneMat);
      ocean.rotation.x = -Math.PI / 2;
      ocean.position.set(130, -3.4, 0);
      g.add(ocean);

      this.addCylinderPlatform(b, g, 130, 1.5, 0, 24, 5, corkTop, meadowSide);
      this.addButtonSteppingStone(b, g, 146, 3.2, -16, 6.5, '#ff595e');
      this.addButtonSteppingStone(b, g, 152, 4.8, 10, 6.5, '#ffca3a');
      this.addButtonSteppingStone(b, g, 122, 3.0, 22, 6.0, '#1982c4');
      // Bubble Geysers
      for (const [gx, gz] of [[138, -8], [136, 14]]) {
        const geyserRing = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.2, 10, 24), this.materials.getFeltMaterial('#7ef9ff', '#fff', false));
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
      this.addCylinderPlatform(b, g, -130, 2.5, 0, 25, 6, velvetTop, velvetSide);
      // Rotating Brass Gear Decks
      for (let i = 0; i < 2; i++) {
        const gx = -146;
        const gz = i === 0 ? -18 : 18;
        const { mesh, col } = this.addCylinderPlatform(b, g, gx, 4.2, gz, 7.5, 1.6, this.materials.brassMat, velvetSide, 'gear');
        b.movers.push({ kind: 'spin', mesh, col, speed: i === 0 ? 0.55 : -0.55 });
      }
      // Overhead Grapple Swing Rings
      this.addGrappleRing(b, g, -136, 10.5, -9);
      this.addGrappleRing(b, g, -136, 10.5, 9);
      this.addGrappleRing(b, g, -118, 9.5, 0);
      // Floating Lantern Balloons
      for (const [lx, ly, lz] of [[-144, 11, -6], [-144, 12, 6], [-122, 10, -18]]) {
        const lan = new THREE.Mesh(
          new THREE.SphereGeometry(1.4, 14, 12),
          new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xff9f1c, emissiveIntensity: 0.75 })
        );
        lan.position.set(lx, ly, lz);
        g.add(lan);
      }
      this.addBouncePad(b, g, -124, 2.5, -10, 18);
      this.addDreamerOrb(b, g, -146, 6.4, -18, 'core_clock_1');
      this.addDreamerOrb(b, g, -146, 6.4, 18, 'core_clock_2');
      this.addEnemy(b, g, -130, 2.5, 10, 'goofbot', 4);
      this.addButtonCritter(b, g, -126, 2.5, -4, 'crit_clock_1');

      // 5. ORIGAMI CANYON & CONFETTI PEAK (South: 0, +130)
      this.addCylinderPlatform(b, g, 0, 2.2, 130, 27, 7, origamiTop, origamiSide);
      this.addBoxPlatform(b, g, -14, 5.5, 142, 13, 3.5, 12, origamiTop);
      this.addBoxPlatform(b, g, 14, 8.2, 144, 13, 6.2, 12, origamiTop);
      // Glowing Yarn Zip-Rail across Canyon
      this.addZipRail(b, g, new THREE.Vector3(-12, 4.2, 118), new THREE.Vector3(12, 10.2, 142), 0x48f5ff);
      this.addZipRail(b, g, new THREE.Vector3(0, 2.4, 86), new THREE.Vector3(0, 3.8, 112), 0xff70a6);
      // Updraft Paper Fan
      b.updrafts.push({ x: -14, y: 5.5, z: 142, radius: 3.2, height: 12, power: 22 });
      this.addBouncePad(b, g, 2, 2.2, 136, 18.5);
      this.addDreamerOrb(b, g, 14, 10.4, 144, 'core_origami_1');
      this.addDreamerOrb(b, g, -14, 7.8, 142, 'core_origami_2');
      this.addEnemy(b, g, 4, 2.2, 124, 'pompom', 4.5);
      this.addGiftBox(b, g, -6, 2.2, 128);
      this.addButtonCritter(b, g, 8, 2.2, 132, 'crit_origami_1');

      // Scenic Corner Sky-Islands completing the ~480m x 480m interconnected sky continent
      const corners = [
        [105, -105, '#6e4bc9'], [-105, -105, '#36ad57'],
        [105, 105, '#24b5b2'], [-105, 105, '#9bc9f2']
      ];
      for (let i = 0; i < corners.length; i++) {
        const [cx, cz, colHex] = corners[i];
        this.addCylinderPlatform(b, g, cx, 3.5, cz, 14, 5, this.materials.getFeltMaterial(colHex, '#fff', true), meadowSide);
        this.addCraftTree(g, cx - 4, 3.5, cz - 3, 1.1, colHex);
        this.addDreamerOrb(b, g, cx + 3, 5.8, cz + 2, `core_corner_${i}`);
        this.addBouncePad(b, g, cx, 3.5, cz + 6, 18);
      }
    }

    buildZomZomCaravan(bucket, group, x, y, z) {
      const grp = new THREE.Group();
      grp.position.set(x, y, z);
      grp.rotation.y = 0.45;
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(5.8, 3.6, 3.8),
        this.materials.getFeltMaterial('#ff6b8b', '#fff5d6', true)
      );
      body.position.y = 2.4;
      body.castShadow = true;
      grp.add(body);

      const roof = new THREE.Mesh(
        new THREE.CylinderGeometry(2.1, 2.2, 6.2, 14, 1, false, 0, Math.PI),
        this.materials.getFeltMaterial('#ffd43b', '#ffffff', true)
      );
      roof.rotation.z = Math.PI / 2;
      roof.rotation.y = Math.PI / 2;
      roof.position.y = 4.1;
      roof.castShadow = true;
      grp.add(roof);

      for (const wx of [-2.0, 2.0]) {
        for (const wz of [-2.0, 2.0]) {
          const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.45, 16), this.materials.woodMat);
          wheel.rotation.x = Math.PI / 2;
          wheel.position.set(wx, 0.85, wz);
          grp.add(wheel);
        }
      }
      group.add(grp);
      bucket.interactables.push({ kind: 'wardrobe', x, y, z, radius: 4.5, label: "ZomZom's Wardrobe [G]" });
    }

    buildBalloonPad(bucket, group, x, y, z) {
      const pad = new THREE.Mesh(
        new THREE.CylinderGeometry(3.4, 3.7, 0.45, 20),
        this.materials.getFeltMaterial('#34a8eb', '#ffffff', true)
      );
      pad.position.set(x, y + 0.22, z);
      group.add(pad);

      const basket = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.3, 1.8), this.materials.cardboardMat);
      basket.position.set(x, y + 1.1, z);
      basket.castShadow = true;
      group.add(basket);

      const balloon = new THREE.Mesh(
        new THREE.SphereGeometry(2.6, 20, 16),
        this.materials.getKnitMaterial('#ff6b6b', '#fff5d6')
      );
      balloon.scale.set(1, 1.25, 1);
      balloon.position.set(x, y + 5.8, z);
      balloon.castShadow = true;
      group.add(balloon);

      bucket.interactables.push({ kind: 'map', x, y, z, radius: 4.2, label: 'Hot-Air Balloon Map [M]', balloon });
    }

    buildPencilWindmill(group, x, y, z) {
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.2, 4.8, 12), this.materials.cardboardMat);
      tower.position.set(x, y + 2.4, z);
      tower.castShadow = true;
      group.add(tower);

      const hub = new THREE.Group();
      hub.position.set(x, y + 4.3, z + 1.0);
      const bladeMat = this.materials.getFeltMaterial('#ffd43b', '#ff6b6b', false);
      for (let i = 0; i < 4; i++) {
        const arm = new THREE.Group();
        arm.rotation.z = (i * Math.PI) / 2;
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.45, 3.2, 0.14), bladeMat);
        blade.position.y = 1.6;
        arm.add(blade);
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
          // Outside |cx|<=1 && |cz|<=1
          if (Math.abs(cx) > 1 || Math.abs(cz) > 1) {
            wanted.add(`${cx},${cz}`);
          }
        }
      }

      // Unload distant chunks smoothly
      for (const [key, ch] of this.chunks.entries()) {
        if (!wanted.has(key)) {
          this.disposeChunk(ch);
          this.chunks.delete(key);
        }
      }

      // Generate missing chunks
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
        if (obj.geometry) obj.geometry.dispose();
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
      const radius = 14 + rng() * 5;

      const group = new THREE.Group();
      const bucket = this.makeBucket();
      this.scene.add(group);

      const topMat = this.materials.getFeltMaterial(theme.top, theme.stitch, true, 2);
      const sideMat = this.materials.getFeltMaterial(theme.side, theme.stitch, false, 1);

      // Main Frontier Island
      this.addCylinderPlatform(bucket, group, ox, baseY, oz, radius, 6.5, topMat, sideMat);

      // Multi-height stitched satellite platforms
      const subCount = 2 + Math.floor(rng() * 2);
      let highX = ox, highY = baseY, highZ = oz;
      for (let i = 0; i < subCount; i++) {
        const ang = (i / subCount) * Math.PI * 2 + rng() * 0.8;
        const dist = radius + 6 + rng() * 4;
        const sx = ox + Math.cos(ang) * dist;
        const sz = oz + Math.sin(ang) * dist;
        const sy = baseY + 2.2 + i * 2.1;
        this.addCylinderPlatform(bucket, group, sx, sy, sz, 6.5 + rng() * 2, 3.6, topMat, sideMat);
        if (i === subCount - 1) {
          highX = sx; highY = sy; highZ = sz;
        }
      }

      // Inter-island stepping buttons pointing back toward origin/neighbors
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

      // Pink Sponge Bounce Pad
      this.addBouncePad(bucket, group, ox + 4.5, baseY, oz + 3.5, 18.5);

      // Overhead Grapple Ring
      this.addGrappleRing(bucket, group, (ox + highX) * 0.5, Math.max(baseY, highY) + 6.5, (oz + highZ) * 0.5);

      // Glowing Zip-Rail from main island up to satellite
      this.addZipRail(
        bucket, group,
        new THREE.Vector3(ox - 5, baseY + 1.5, oz - 4),
        new THREE.Vector3(highX, highY + 1.4, highZ),
        0x48f5ff
      );

      // Craft trees & decorations
      this.addCraftTree(group, ox - 6, baseY, oz + 4, 1.15, theme.accent);
      this.addCraftTree(group, ox + 6, baseY, oz - 6, 0.95, theme.top);

      // Gift boxes, Goof-Bot & Pom-Pom Hopper, Button Critter, Bells, Dreamer Orb
      this.addGiftBox(bucket, group, ox - 3.5, baseY, oz - 5.5);
      this.addEnemy(bucket, group, ox + 2, baseY, oz - 2, 'goofbot', 3.2);
      this.addEnemy(bucket, group, highX, highY, highZ, 'pompom', 2.4);
      this.addButtonCritter(bucket, group, ox - 5, baseY, oz + 1, `crit_f_${fIdx}`);
      this.addDreamerOrb(bucket, group, highX, highY + 2.4, highZ, `orb_f_${fIdx}`);
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * Math.PI * 2;
        this.addBell(bucket, group, ox + Math.cos(a) * 6.5, baseY + 1.0, oz + Math.sin(a) * 6.5);
      }

      // Island Discovery Flagpole
      const flagX = ox + 0.5;
      const flagZ = oz + 5.5;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 6.2, 10), this.materials.brassMat);
      pole.position.set(flagX, baseY + 3.1, flagZ);
      pole.castShadow = true;
      group.add(pole);

      const alreadyDiscovered = this.state.discoveredIslands.some((d) => d.index === fIdx);
      const flagMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.55, 4, 2), this.materials.flagMat);
      flagMesh.position.set(flagX + 1.25, baseY + (alreadyDiscovered ? 5.2 : 1.5), flagZ);
      group.add(flagMesh);

      bucket.flagpoles.push({
        index: fIdx,
        name: `Frontier Island #${fIdx} (${theme.name})`,
        x: flagX, y: baseY, z: flagZ,
        islandX: ox, islandY: baseY, islandZ: oz,
        flagMesh,
        targetY: baseY + 5.2,
        raised: alreadyDiscovered
      });

      return { cx, cz, frontierIndex: fIdx, themeName: theme.name, ox, oy: baseY, oz, group, entities: bucket };
    }

    // ---- Particles & Boomerang ----
    spawnBurst(x, y, z, colorHex = 0xffcf48, count = 12) {
      for (let i = 0; i < count; i++) {
        const p = new THREE.Mesh(
          new THREE.BoxGeometry(0.24, 0.24, 0.08),
          new THREE.MeshBasicMaterial({ color: colorHex })
        );
        p.position.set(x, y, z);
        this.scene.add(p);
        const a = Math.random() * Math.PI * 2;
        const sp = 3 + Math.random() * 6;
        this.particles.push({
          mesh: p,
          vx: Math.cos(a) * sp,
          vy: 4 + Math.random() * 6,
          vz: Math.sin(a) * sp,
          life: 0.7 + Math.random() * 0.4
        });
      }
    }

    spawnBoomerang(x, y, z, dirX, dirZ) {
      const star = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.55, 0),
        new THREE.MeshStandardMaterial({ color: 0x38e5ff, emissive: 0x06b6d4, emissiveIntensity: 0.8 })
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

    // ---- Query Floor Height Under Point ----
    sampleFloor(x, y, z, radius = 0.42) {
      let bestY = -999;
      let bestCol = null;

      for (const bucket of this.allBuckets()) {
        for (const c of bucket.colliders) {
          if (c.kind === 'cylinder') {
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

    // ---- World Tick ----
    update(dt, elapsed, playerPos) {
      for (const bucket of this.allBuckets()) {
        // Spin platforms
        for (const m of bucket.movers) {
          if (m.kind === 'spin') {
            m.mesh.rotation.y += m.speed * dt;
            m.col.spinSpeed = m.speed;
          }
        }
        // Windmills
        for (const wm of bucket.windmills) {
          wm.rotation.z += 1.4 * dt;
        }
        // Piano key glow decay
        for (const pk of bucket.pianoKeys) {
          if (pk.glow > 0) {
            pk.glow = Math.max(0, pk.glow - dt * 2.4);
            pk.mesh.material.emissive.copy(pk.baseColor);
            pk.mesh.material.emissiveIntensity = pk.glow * 0.95;
            pk.mesh.position.y = pk.col.topY - 0.425 - pk.glow * 0.18;
          }
        }
        // Bounce pads squash restore
        for (const bp of bucket.bouncePads) {
          if (bp.timer > 0) {
            bp.timer = Math.max(0, bp.timer - dt * 4);
            const s = 1 + Math.sin(bp.timer * Math.PI) * 0.25;
            bp.mesh.scale.set(s, 1 / s, s);
          } else {
            bp.mesh.scale.set(1, 1, 1);
          }
        }
        // Orbs float
        for (const o of bucket.orbs) {
          if (o.collected) continue;
          o.mesh.position.y = o.baseY + Math.sin(elapsed * 2.5 + o.x) * 0.35;
          o.mesh.rotation.y += dt * 1.6;
          o.halo.rotation.x += dt * 2.1;
        }
        // Bells spin
        for (const bl of bucket.bells) {
          if (bl.collected) continue;
          bl.mesh.position.y = bl.baseY + Math.sin(elapsed * 3 + bl.z) * 0.18;
          bl.mesh.rotation.y += dt * 2.2;
        }
        // Enemies patrol
        for (const en of bucket.enemies) {
          if (!en.alive) continue;
          en.phase += dt * (en.kind === 'pompom' ? 2.8 : 1.5);
          en.x = en.homeX + Math.cos(en.phase) * en.patrolRadius;
          en.z = en.homeZ + Math.sin(en.phase) * en.patrolRadius;
          const hop = en.kind === 'pompom' ? Math.abs(Math.sin(en.phase * 2.4)) * 0.75 : 0;
          en.mesh.position.set(en.x, en.baseY + hop, en.z);
          en.mesh.rotation.y = -en.phase;
        }
        // Critters hop gently when idle
        for (const cr of bucket.critters) {
          if (cr.rescued || cr.carried) continue;
          cr.phase += dt * 3.2;
          const hop = Math.abs(Math.sin(cr.phase)) * 0.28;
          cr.mesh.position.set(cr.x, cr.y + hop, cr.z);
          cr.mesh.rotation.y = Math.sin(cr.phase * 0.4) * 0.7;
        }
        // Flagpoles animate raise
        for (const fp of bucket.flagpoles) {
          if (fp.raised && fp.flagMesh.position.y < fp.targetY) {
            fp.flagMesh.position.y = Math.min(fp.targetY, fp.flagMesh.position.y + dt * 5.2);
          }
        }
        // Balloon gentle bob
        for (const it of bucket.interactables) {
          if (it.balloon) {
            it.balloon.position.y = 5.8 + Math.sin(elapsed * 1.4) * 0.35;
          }
        }
      }

      // Particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life -= dt;
        p.vy -= 18 * dt;
        p.mesh.position.x += p.vx * dt;
        p.mesh.position.y += p.vy * dt;
        p.mesh.position.z += p.vz * dt;
        p.mesh.rotation.x += dt * 8;
        p.mesh.rotation.y += dt * 6;
        if (p.life <= 0) {
          this.scene.remove(p.mesh);
          p.mesh.geometry.dispose();
          p.mesh.material.dispose();
          this.particles.splice(i, 1);
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

        // Scoop bells & bop enemies/boxes
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
  // 6. MAIN GAME ENGINE, INPUT, PHYSICS, CO-OP & UI
  // ============================================================================
  class PatchworkGame {
    constructor() {
      this.canvas = document.getElementById('gameCanvas');
      this.shotMode = new URLSearchParams(window.location.search).get('shot');

      this.state = {
        mode: 'title', // 'title' | 'play' | 'wardrobe' | 'map'
        orbs: 0,
        bells: 0,
        critters: 0,
        yarnIdx: 0,
        hatIdx: 4,     // Royal Paper Crown default highlight
        outfitIdx: 1,  // Superhero Cape
        gadgetIdx: 0,  // 0 Grapple, 1 Boomerang, 2 Jet Boots
        coopEnabled: true,
        bloomEnabled: true,
        collectedOrbIds: new Set(),
        rescuedCritterIds: new Set(),
        discoveredIslands: [] // [{ index, name, x, y, z }]
      };

      this.loadSave();
      this.audio = new CraftAudio();
      this.initRenderer();
      this.materials = new CraftMaterials(this.renderer);
      this.world = new CraftWorld(this.scene, this.materials, this.state, this.audio, (msg) => this.showToast(msg));

      this.setupSkyAndLights();
      this.setupPlayers();
      this.setupInputs();
      this.setupUI();

      this.lastTime = performance.now();
      this.elapsed = 0;
      this.toastTimer = 0;

      // Apply ?shot=... deterministic hooks if present
      if (this.shotMode) {
        this.applyShotMode(this.shotMode);
      } else {
        this.world.updateStreaming(this.player.pos.x, this.player.pos.z);
      }

      this.loop = this.loop.bind(this);
      requestAnimationFrame(this.loop);
    }

    loadSave() {
      if (this.shotMode) return; // Clean deterministic shots when testing
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
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.outputEncoding = THREE.sRGBEncoding;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 0.94;

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x8ed4ff);
      this.scene.fog = new THREE.Fog(0x95dcff, 155, 430);

      this.camera = new THREE.PerspectiveCamera(56, w / h, 0.25, 900);
      this.cameraYaw = 0;
      this.cameraPitch = 0.34;
      this.cameraDist = 11.5;

      // Postprocessing Composer + UnrealBloomPass (high threshold so daylight felt stays crisp)
      this.composer = new THREE.EffectComposer(this.renderer);
      this.renderPass = new THREE.RenderPass(this.scene, this.camera);
      this.composer.addPass(this.renderPass);
      this.bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(w, h), 0.42, 0.32, 0.90);
      this.composer.addPass(this.bloomPass);

      window.addEventListener('resize', () => {
        const nw = window.innerWidth;
        const nh = window.innerHeight;
        this.camera.aspect = nw / nh;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(nw, nh);
        this.composer.setSize(nw, nh);
      });
    }

    setupSkyAndLights() {
      this.scene.environment = this.materials.envMap;

      // Bright warm daylight gradient sky dome
      const skyMat = new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          topColor: { value: new THREE.Color(0x3ba8f5) },
          midColor: { value: new THREE.Color(0x8fd6ff) },
          botColor: { value: new THREE.Color(0xcbeaff) }
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
      const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 });
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

      // Hemisphere bounce light (dialed-down ambient fill for crisp tactile contrast)
      const hemi = new THREE.HemisphereLight(0xb8e4ff, 0xc88a55, 0.58);
      this.scene.add(hemi);

      // Warm Directional Sun with soft shadows
      this.sunLight = new THREE.DirectionalLight(0xfff4d6, 1.05);
      this.sunLight.position.set(45, 75, 40);
      this.sunLight.castShadow = true;
      this.sunLight.shadow.mapSize.set(2048, 2048);
      this.sunLight.shadow.camera.near = 5;
      this.sunLight.shadow.camera.far = 220;
      const d = 58;
      this.sunLight.shadow.camera.left = -d;
      this.sunLight.shadow.camera.right = d;
      this.sunLight.shadow.camera.top = d;
      this.sunLight.shadow.camera.bottom = -d;
      this.sunLight.shadow.bias = -0.0008;
      this.scene.add(this.sunLight);
      this.scene.add(this.sunLight.target);
    }

    setupPlayers() {
      // Hero Patch
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

      // Safety Recovery Soap Bubble
      this.safetyBubble = new THREE.Mesh(
        new THREE.SphereGeometry(1.35, 20, 16),
        new THREE.MeshPhysicalMaterial({
          color: 0xb8f3ff, roughness: 0.08, clearcoat: 1, transparent: true, opacity: 0.45
        })
      );
      this.safetyBubble.visible = false;
      this.patchRig.root.add(this.safetyBubble);
      this.safetyBubble.position.y = 1.0;

      // Grapple Yarn Tether Line
      const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, 1, 0)]);
      this.grappleLine = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xffd43b }));
      this.grappleLine.visible = false;
      this.scene.add(this.grappleLine);

      // Co-Op Buddy Stitch
      this.stitchRig = createPlushRig(this.materials, 3, 6, 3); // Sky cyan + Propeller Beanie + Rainbow Scarf
      this.scene.add(this.stitchRig.root);
      this.buddy = {
        pos: new THREE.Vector3(2.4, 0.5, 11.2),
        vel: new THREE.Vector3(0, 0, 0),
        yaw: Math.PI
      };

      // Turntable pedestal for Wardrobe showroom
      this.turntable = new THREE.Mesh(
        new THREE.CylinderGeometry(2.2, 2.4, 0.45, 28),
        this.materials.woodMat
      );
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

      // Mouse drag camera orbit + click slap / right-click grab
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
        if (e.button === 2) {
          this.tryGrabOrToss();
        }
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

      // Touch Virtual Thumbstick & Buttons
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
      // Look for nearby critter or carryProp
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
        // Grapple Claw
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
        // Whirltool Boomerang
        this.world.spawnBoomerang(p.pos.x, p.pos.y, p.pos.z, Math.sin(p.yaw), Math.cos(p.yaw));
        this.audio.sfx('boomerang');
      } else if (g === 2) {
        // Jet-Yarn Hover Boots
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

      // Sky-parchment map background + stitch border
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

      // Connecting yarn paths between Core Biomes
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

      // Plot Core Biomes
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

      // Plot Discovered Frontier Islands
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

      // Player Pin
      const [px, py] = toMap(this.player.pos.x, this.player.pos.z);
      ctx.fillStyle = '#ff3b6b';
      ctx.beginPath();
      ctx.arc(Math.max(20, Math.min(W - 20, px)), Math.max(20, Math.min(H - 20, py)), 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Sidebar list
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
        this.cameraPitch = 0.28;
        this.cameraDist = 10.5;
        this.world.updateStreaming(0, 0);
        this.setMode('play');
      } else if (mode === 'wardrobe') {
        this.state.yarnIdx = 2;    // Berry Pink
        this.state.hatIdx = 6;     // Propeller Beanie
        this.state.outfitIdx = 1;  // Superhero Cape
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
          this.player.pos.set(ch.ox - 3.2, ch.oy + 0.3, ch.oz + 6.8);
          this.player.yaw = Math.PI * 0.85;
          this.buddy.pos.set(ch.ox - 1.2, ch.oy + 0.3, ch.oz + 7.6);
          this.buddy.yaw = Math.PI * 0.9;
        }
        this.cameraYaw = 0.42;
        this.cameraPitch = Math.atan2(4.8, 15.5);
        this.cameraDist = Math.hypot(15.5, 4.8);
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
        // Attract / Wardrobe idle pose
        this.patchRig.root.position.copy(p.pos);
        if (this.state.mode === 'wardrobe') {
          this.patchRig.root.rotation.y += dt * 0.75;
        } else {
          this.patchRig.root.rotation.y = p.yaw;
          // Cheerful wave on title screen
          this.patchRig.armR.rotation.z = -2.2 + Math.sin(this.elapsed * 5.2) * 0.35;
        }
        if (this.patchRig.propeller) this.patchRig.propeller.rotation.y += dt * 10;
        return;
      }

      // Camera keyboard orbit (, / .)
      if (this.keys.has('Comma')) this.cameraYaw += dt * 1.9;
      if (this.keys.has('Period')) this.cameraYaw -= dt * 1.9;

      // Safety Bubble Recovery
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

      // Zip-Rail Ride
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

      // Movement Input Vector (360° camera-relative)
      let inX = 0, inZ = 0;
      if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) inX -= 1;
      if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) inX += 1;
      if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) inZ -= 1;
      if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) inZ += 1;
      inX += this.touchMove.x;
      inZ += this.touchMove.y;

      // Gamepad support
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
        this.world.spawnBurst(p.pos.x, p.pos.y + 0.3, p.pos.z, PIANO_COLORS[Math.floor(this.elapsed * 12) % 8], 2);
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

      // Grapple Pendulum Constraint
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

      // Mid-air Flutter-Hover while holding Space
      const holdingJump = this.keys.has('Space');
      if (!p.grounded && holdingJump && p.vel.y < 0 && !p.poundActive) {
        p.vel.y = Math.max(p.vel.y + 16 * dt, -2.1);
        p.flutterTimer += dt * 22;
      } else {
        p.vel.y += WORLD_GRAVITY * dt;
      }

      // Check Updrafts (Bubble Geysers / Paper Fans)
      for (const bucket of this.world.allBuckets()) {
        for (const ud of bucket.updrafts) {
          if (Math.hypot(p.pos.x - ud.x, p.pos.z - ud.z) < ud.radius &&
              p.pos.y >= ud.y - 0.5 && p.pos.y <= ud.y + ud.height) {
            p.vel.y = Math.min(14, p.vel.y + ud.power * dt);
            p.grounded = false;
          }
        }
      }

      // Integrate Position
      p.pos.x += p.vel.x * dt;
      p.pos.y += p.vel.y * dt;
      p.pos.z += p.vel.z * dt;

      // Floor Collision
      const floor = this.world.sampleFloor(p.pos.x, p.pos.y, p.pos.z);
      if (floor.y > -900 && p.pos.y <= floor.y && p.vel.y <= 0.5) {
        if (!p.grounded) {
          p.squash = 0.76;
          if (p.poundActive) {
            p.poundActive = false;
            this.audio.sfx('pound');
            this.world.spawnBurst(p.pos.x, floor.y + 0.3, p.pos.z, 0xffffff, 12);
            this.hitArea(p.pos.x, floor.y + 0.5, p.pos.z, 4.2);
          }
        }
        p.pos.y = floor.y;
        p.vel.y = 0;
        p.grounded = true;
        p.grappleTarget = null;
        p.safePos.set(p.pos.x, floor.y + 0.8, p.pos.z);

        // Moving spin platform carry
        if (floor.col && floor.col.spinSpeed) {
          const dx = p.pos.x - floor.col.x;
          const dz = p.pos.z - floor.col.z;
          const ang = floor.col.spinSpeed * dt;
          p.pos.x = floor.col.x + dx * Math.cos(ang) + dz * Math.sin(ang);
          p.pos.z = floor.col.z - dx * Math.sin(ang) + dz * Math.cos(ang);
        }

        // Musical Piano Bridge Key Trigger
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

      // Gentle Safety-Bubble Recovery if fallen into sky
      if (p.pos.y < -18) {
        p.bubbleTimer = 1.05;
        p.grappleTarget = null;
        this.audio.sfx('bubble');
        return;
      }

      // World Triggers (Bounce Pads, Zip-Rails, Orbs, Bells, Flagpoles, Caravan/Balloon)
      for (const bucket of this.world.allBuckets()) {
        for (const bp of bucket.bouncePads) {
          if (Math.hypot(p.pos.x - bp.x, p.pos.z - bp.z) < bp.radius && Math.abs(p.pos.y - bp.y) < 1.3) {
            p.vel.y = bp.power;
            p.grounded = false;
            bp.timer = 1.0;
            p.squash = 1.35;
            this.audio.sfx('bounce');
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

      // Carried Item Update
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
        this.patchRig.armL.rotation.z = 1.4;
        this.patchRig.armR.rotation.z = -1.4;
      } else {
        this.patchRig.bodyPivot.rotation.y = 0;
        this.patchRig.armL.rotation.z = 0.15;
        this.patchRig.armR.rotation.z = -0.15;
      }

      if (this.patchRig.propeller) this.patchRig.propeller.rotation.y += dt * (p.grounded ? 5 : 18);
      if (this.patchRig.capeMesh) this.patchRig.capeMesh.rotation.x = 0.25 + Math.min(0.65, horizSpeed * 0.05);

      // Blinking button eyes
      this.patchRig.blinkTimer -= dt;
      if (this.patchRig.blinkTimer <= 0) {
        const close = this.patchRig.blinkTimer > -0.11;
        this.patchRig.eyeL.scale.y = close ? 0.15 : 1;
        this.patchRig.eyeR.scale.y = close ? 0.15 : 1;
        if (this.patchRig.blinkTimer <= -0.12) this.patchRig.blinkTimer = 2.6 + Math.random() * 2.2;
      }

      // Co-Op Buddy Stitch AI Follow
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

      // Stream Frontier Chunks around player
      this.world.updateStreaming(p.pos.x, p.pos.z);
    }

    updateCamera(dt) {
      const p = this.player;
      if (this.state.mode === 'wardrobe') {
        const lookAt = new THREE.Vector3(p.pos.x + 1.15, p.pos.y + 1.15, p.pos.z);
        const camPos = new THREE.Vector3(p.pos.x + 1.25, p.pos.y + 1.65, p.pos.z + 4.9);
        this.camera.position.lerp(camPos, Math.min(1, dt * 8));
        this.camera.lookAt(lookAt);
        return;
      }
      if (this.state.mode === 'title') {
        const sway = Math.sin((this.elapsed || 0) * 0.35) * 1.4;
        const camPos = new THREE.Vector3(p.pos.x - 2.6 + sway, p.pos.y + 3.1, p.pos.z + 7.2);
        this.camera.position.lerp(camPos, Math.min(1, dt * 5));
        this.camera.lookAt(p.pos.x - 1.2, p.pos.y + 1.3, p.pos.z - 6);
        return;
      }

      const lookTarget = this.shotMode === 'frontier'
        ? new THREE.Vector3(p.pos.x + 2.4, p.pos.y + 4.2, p.pos.z - 4.0)
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

      // Keep sky dome & sun shadow centered around player
      this.skyDome.position.copy(p.pos);
      this.sunLight.position.set(p.pos.x + 42, p.pos.y + 72, p.pos.z + 36);
      this.sunLight.target.position.copy(p.pos);
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

      // Draw Compass Radar
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
      // CRITICAL: Clamp delta-time so headless Chromium rAF never starts with negative dt
      const dt = Math.max(0.001, Math.min(0.05, (now - this.lastTime) / 1000));
      this.lastTime = now;
      this.elapsed += dt;

      if (this.toastTimer > 0) {
        this.toastTimer -= dt;
        if (this.toastTimer <= 0) document.getElementById('toastBanner').classList.add('hidden');
      }

      this.updatePlayer(dt);
      this.world.update(dt, this.elapsed, this.player.pos);
      this.updateCamera(dt);
      this.audio.update(dt);
      this.syncHUD();

      if (this.state.bloomEnabled) {
        this.composer.render();
      } else {
        this.renderer.render(this.scene, this.camera);
      }
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    window.__patchworkGame = new PatchworkGame();
  });
})();
