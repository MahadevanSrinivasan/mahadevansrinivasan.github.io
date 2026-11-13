// ============================================================================
// SUPER LEO CITY 3D — OPEN-WORLD HERO & STUNT SANDBOX (WebGL / Three.js)
// Wholesome, non-violent 3D GTA / LEGO City Undercover style open-world game
// ============================================================================

(() => {
  'use strict';

  // --- AUDIO SYNTHESIZER (Web Audio API) ---
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.sirenTimer = 0;
      this.jingleStep = 0;
    }
    init() {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) this.ctx = new AC();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }
    tone(freq, dur = 0.12, type = 'triangle', vol = 0.12, slideTo = null) {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), now + dur);
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + dur);
      } catch (e) {}
    }
    playBoost() {
      this.tone(140, 0.25, 'sawtooth', 0.14, 420);
    }
    playSplash() {
      this.tone(320, 0.09, 'sine', 0.08, 120);
    }
    playJump() {
      this.tone(240, 0.3, 'triangle', 0.15, 620);
    }
    playRoar() {
      this.tone(95, 0.45, 'sawtooth', 0.22, 48);
    }
    playHorn() {
      this.tone(440, 0.15, 'square', 0.1, 440);
      setTimeout(() => this.tone(554, 0.22, 'square', 0.1, 554), 90);
    }
    playFanfare() {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((n, i) => setTimeout(() => this.tone(n, 0.22, 'triangle', 0.18), i * 95));
    }
    playSmash() {
      this.tone(190, 0.09, 'square', 0.08, 70);
    }
    updateSpecialAudio(dt, vehType, speed) {
      if (this.muted || !this.ctx) return;
      this.sirenTimer += dt;
      if ((vehType === 'police' || vehType === 'firetruck') && Math.abs(speed) > 8) {
        if (this.sirenTimer > 0.45) {
          this.sirenTimer = 0;
          this.jingleStep = (this.jingleStep + 1) % 2;
          this.tone(this.jingleStep ? 680 : 510, 0.35, 'sine', 0.05);
        }
      } else if (vehType === 'icecream' && Math.abs(speed) > 4) {
        if (this.sirenTimer > 0.28) {
          this.sirenTimer = 0;
          const melody = [523, 659, 784, 659, 880, 784, 659, 587];
          this.jingleStep = (this.jingleStep + 1) % melody.length;
          this.tone(melody[this.jingleStep], 0.2, 'triangle', 0.06);
        }
      }
    }
  }

  const sfx = new SoundEngine();

  // --- VEHICLE CATALOG (9 RIDES + LEO ON FOOT) ---
  const VEHICLE_CATALOG = [
    {
      id: 'supercar',
      key: '1',
      name: 'Comet GT Supercar',
      emoji: '🏎️',
      sub: 'SPACE: Twin-Turbo Nitro • Z: Sport Horn',
      color: 0xef233c,
      accent: 0xffd166,
      maxSpeed: 88,
      accel: 58,
      turnRate: 2.5,
      grip: 0.92,
      mass: 1.2
    },
    {
      id: 'police',
      key: '2',
      name: 'Hero Patrol Interceptor',
      emoji: '🚓',
      sub: 'SPACE: Pursuit Boost • Z: Siren Strobe',
      color: 0x1e293b,
      accent: 0x38bdf8,
      maxSpeed: 84,
      accel: 54,
      turnRate: 2.55,
      grip: 0.93,
      mass: 1.35
    },
    {
      id: 'firetruck',
      key: '3',
      name: 'Big Red Fire Engine',
      emoji: '🚒',
      sub: 'Z / F: High-Pressure 3D Water Cannon!',
      color: 0xd90429,
      accent: 0xfef08a,
      maxSpeed: 68,
      accel: 42,
      turnRate: 2.05,
      grip: 0.9,
      mass: 2.2
    },
    {
      id: 'monster',
      key: '4',
      name: 'Monster Crush 4x4',
      emoji: '🛻',
      sub: 'Z / F: Hydraulic Mega-Bounce • 2x Ramp Air!',
      color: 0x2563eb,
      accent: 0x4ade80,
      maxSpeed: 72,
      accel: 48,
      turnRate: 2.35,
      grip: 0.88,
      mass: 2.0
    },
    {
      id: 'icecream',
      key: '5',
      name: 'Melody Ice Cream Van',
      emoji: '🍦',
      sub: 'Z / F: Launch Rainbow Cones • Plays Jingle!',
      color: 0xf472b6,
      accent: 0x67e8f9,
      maxSpeed: 64,
      accel: 40,
      turnRate: 2.25,
      grip: 0.9,
      mass: 1.5
    },
    {
      id: 'pizza',
      key: '6',
      name: 'Rocket Pizza Buggy',
      emoji: '🍕',
      sub: 'Z / F: Launch Hot Pizzas • SPACE: Rocket Boost',
      color: 0xf59e0b,
      accent: 0xef4444,
      maxSpeed: 78,
      accel: 55,
      turnRate: 2.65,
      grip: 0.91,
      mass: 1.0
    },
    {
      id: 'helicopter',
      key: '7',
      name: 'Sky-Hawk Rescue Heli',
      emoji: '🚁',
      sub: 'SPACE: Climb Up • Z/F: Descend • Fly Anywhere!',
      color: 0x0284c7,
      accent: 0xfacc15,
      maxSpeed: 95,
      accel: 52,
      turnRate: 2.4,
      grip: 0.96,
      mass: 1.4,
      isFlying: true
    },
    {
      id: 'speedboat',
      key: '8',
      name: 'Aqua-Jet Speedboat',
      emoji: '🚤',
      sub: 'Carves Ocean Waves + Amphibious Hydro-Ski!',
      color: 0x06b6d4,
      accent: 0xffffff,
      maxSpeed: 86,
      accel: 54,
      turnRate: 2.4,
      grip: 0.86,
      mass: 1.3,
      isBoat: true
    },
    {
      id: 'trex',
      key: '9',
      name: 'Emerald Rex (3D Dino)',
      emoji: '🦖',
      sub: 'Z / F: Ground-Shaking Dino Roar • SPACE: Leap!',
      color: 0x16a34a,
      accent: 0x86efac,
      maxSpeed: 62,
      accel: 50,
      turnRate: 2.7,
      grip: 0.94,
      mass: 2.4,
      isDino: true
    }
  ];

  // --- PROCEDURAL HIGH-RES TEXTURE GENERATOR ---
  function makeCanvasTexture(w, h, drawFn, repeatX = 1, repeatY = 1) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    drawFn(ctx, w, h);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
  }

  const TEXTURES = {
    roadN: makeCanvasTexture(512, 512, (ctx, w, h) => {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, w, h);
      // Sidewalks & bold red/white racing curbs
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(0, 0, 44, h);
      ctx.fillRect(w - 44, 0, 44, h);
      for (let y = 0; y < h; y += 128) {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(28, y, 18, 64);
        ctx.fillRect(w - 46, y, 18, 64);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(28, y + 64, 18, 64);
        ctx.fillRect(w - 46, y + 64, 18, 64);
      }
      // Bold double yellow center line
      ctx.fillStyle = '#facc15';
      ctx.fillRect(w / 2 - 16, 0, 11, h);
      ctx.fillRect(w / 2 + 5, 0, 11, h);
      // Bold white dashed lane dividers
      ctx.fillStyle = '#ffffff';
      for (let y = 24; y < h; y += 128) {
        ctx.fillRect(w * 0.27, y, 12, 72);
        ctx.fillRect(w * 0.73 - 12, y, 12, 72);
      }
    }, 1, 18),

    roadE: makeCanvasTexture(512, 512, (ctx, w, h) => {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(0, 0, w, 44);
      ctx.fillRect(0, h - 44, w, 44);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(0, h / 2 - 16, w, 11);
      ctx.fillRect(0, h / 2 + 5, w, 11);
      ctx.fillStyle = '#ffffff';
      for (let x = 24; x < w; x += 128) {
        ctx.fillRect(x, h * 0.27, 72, 12);
        ctx.fillRect(x, h * 0.73 - 12, 72, 12);
      }
    }, 18, 1),

    buildingGlass: makeCanvasTexture(256, 512, (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#1e3a5f');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      const cols = 8, rows = 16;
      const padX = 6, padY = 6;
      const cw = w / cols, ch = h / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const lit = Math.random() > 0.32;
          if (lit) {
            ctx.fillStyle = Math.random() > 0.25 ? '#bae6fd' : '#fef08a';
          } else {
            ctx.fillStyle = '#1e293b';
          }
          ctx.fillRect(c * cw + padX, r * ch + padY, cw - padX * 2, ch - padY * 2);
        }
      }
    }),

    buildingWarm: makeCanvasTexture(256, 512, (ctx, w, h) => {
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 0, w, h);
      const cols = 6, rows = 14;
      const cw = w / cols, ch = h / rows;
      for (let r = 0; r < rows; r++) {
        ctx.fillStyle = 'rgba(0,0,0,0.22)';
        ctx.fillRect(0, r * ch, w, 3);
        for (let c = 0; c < cols; c++) {
          ctx.fillStyle = Math.random() > 0.3 ? '#fde68a' : '#475569';
          ctx.fillRect(c * cw + 8, r * ch + 8, cw - 16, ch - 16);
        }
      }
    }),

    rampTex: makeCanvasTexture(256, 256, (ctx, w, h) => {
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(20, h - 30);
      ctx.lineTo(w / 2, 40);
      ctx.lineTo(w - 20, h - 30);
      ctx.lineTo(w - 55, h - 30);
      ctx.lineTo(w / 2, 95);
      ctx.lineTo(55, h - 30);
      ctx.closePath();
      ctx.fill();
    }, 0.05, 0.05),

    grass: makeCanvasTexture(256, 256, (ctx, w, h) => {
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 1800; i++) {
        ctx.fillStyle = i % 2 ? '#16a34a' : '#4ade80';
        ctx.fillRect(Math.random() * w, Math.random() * h, 3, 3);
      }
    }, 30, 30),

    soccerPitch: makeCanvasTexture(512, 512, (ctx, w, h) => {
      for (let i = 0; i < 10; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#16a34a' : '#22c55e';
        ctx.fillRect(0, (i * h) / 10, w, h / 10);
      }
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 8;
      ctx.strokeRect(20, 20, w - 40, h - 40);
      ctx.beginPath();
      ctx.moveTo(20, h / 2);
      ctx.lineTo(w - 20, h / 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 62, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeRect(w * 0.25, 20, w * 0.5, 85);
      ctx.strokeRect(w * 0.25, h - 105, w * 0.5, 85);
    })
  };

  // --- THREE.JS SCENE, CAMERA & RENDERER ---
  const canvas = document.getElementById('gameCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x60a5fa);
  scene.fog = new THREE.FogExp2(0x7dd3fc, 0.0014);

  const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.5, 1200);
  camera.position.set(0, 12, -25);

  // --- LIGHTING (DAY / SUNSET / NEON NIGHT) ---
  const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 0.78);
  scene.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.35);
  sunLight.position.set(160, 240, 140);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 10;
  sunLight.shadow.camera.far = 650;
  const d = 240;
  sunLight.shadow.camera.left = -d;
  sunLight.shadow.camera.right = d;
  sunLight.shadow.camera.top = d;
  sunLight.shadow.camera.bottom = -d;
  sunLight.shadow.bias = -0.0005;
  scene.add(sunLight);

  let timeMode = 0; // 0 = Sunny Day, 1 = Golden Sunset, 2 = Neon Night
  const TIME_PRESETS = [
    { name: '☀️ Day (T)', bg: 0x38bdf8, fog: 0x7dd3fc, hemi: 0.82, sun: 1.35, sunCol: 0xfffbeb, exposure: 1.1 },
    { name: '🌅 Sunset (T)', bg: 0xf97316, fog: 0xfb923c, hemi: 0.65, sun: 1.15, sunCol: 0xfde047, exposure: 1.05 },
    { name: '🌙 Night (T)', bg: 0x090d16, fog: 0x0f172a, hemi: 0.34, sun: 0.28, sunCol: 0x60a5fa, exposure: 0.95 }
  ];

  // --- WORLD GEOMETRY & COLLIDERS ---
  const buildingColliders = []; // { minX, maxX, minZ, maxZ, height }
  const ramps = [];             // { x, z, w, l, h, dir }
  const physicsProps = [];      // Smashable cones, crates, beachballs
  const clouds = [];
  const waterDrops = [];        // 3D water cannon stream particles
  const projectiles = [];       // Launched pizzas / ice cream cones
  let ferrisWheelGroup = null;

  function buildWorld() {
    // 1. Massive Main Island Ground + Surrounding Ocean Bay
    const oceanGeo = new THREE.PlaneGeometry(2400, 2400);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.18,
      metalness: 0.35
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -1.2;
    ocean.receiveShadow = true;
    scene.add(ocean);

    // Main grassy island landmass (-340..340 X, -340..240 Z)
    const landGeo = new THREE.BoxGeometry(680, 3, 580);
    const landMat = new THREE.MeshStandardMaterial({ map: TEXTURES.grass, roughness: 0.85 });
    const land = new THREE.Mesh(landGeo, landMat);
    land.position.set(0, -1.5, -50);
    land.receiveShadow = true;
    scene.add(land);

    // Sandy Beach Strip along South Bay (Z = 200..265)
    const beachGeo = new THREE.BoxGeometry(680, 2.6, 75);
    const beachMat = new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.9 });
    const beach = new THREE.Mesh(beachGeo, beachMat);
    beach.position.set(0, -1.55, 235);
    beach.receiveShadow = true;
    scene.add(beach);

    //Marina Wooden Pier extending into South Ocean Bay
    const pierGeo = new THREE.BoxGeometry(36, 2.5, 110);
    const pierMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.8 });
    const pier = new THREE.Mesh(pierGeo, pierMat);
    pier.position.set(120, 0.4, 305);
    pier.castShadow = true;
    pier.receiveShadow = true;
    scene.add(pier);

    // 2. Road Network Grid (Avenues & Cross Streets)
    const roadXCoords = [-220, -110, 0, 110, 220];
    const roadZCoords = [-260, -140, -20, 100, 200];

    roadXCoords.forEach(rx => {
      const rGeo = new THREE.PlaneGeometry(26, 560);
      const rMat = new THREE.MeshStandardMaterial({ map: TEXTURES.roadN, roughness: 0.7 });
      const mesh = new THREE.Mesh(rGeo, rMat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(rx, 0.06, -50);
      mesh.receiveShadow = true;
      scene.add(mesh);
    });

    roadZCoords.forEach(rz => {
      const rGeo = new THREE.PlaneGeometry(660, 26);
      const rMat = new THREE.MeshStandardMaterial({ map: TEXTURES.roadE, roughness: 0.7 });
      const mesh = new THREE.Mesh(rGeo, rMat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(0, 0.04, rz);
      mesh.receiveShadow = true;
      scene.add(mesh);
    });

    // Boulevard Neon Welcome Archways & Streetlamps along Central Ave (X = 0)
    [-85, 25].forEach(az => {
      const archGroup = new THREE.Group();
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5, roughness: 0.3 });
      [-14, 14].forEach(ax => {
        const p = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 18, 12), pillarMat);
        p.position.set(ax, 9, az);
        p.castShadow = true;
        archGroup.add(p);
      });
      const banner = new THREE.Mesh(
        new THREE.BoxGeometry(30, 3.2, 1.8),
        new THREE.MeshBasicMaterial({ color: az < 0 ? 0x38bdf8 : 0xf59e0b })
      );
      banner.position.set(0, 17.5, az);
      archGroup.add(banner);
      scene.add(archGroup);
    });

    // Distant 3D Mountain Range Horizon around the Island
    const mtnMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
    const snowMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
    for (let i = 0; i < 24; i++) {
      const ang = (i / 24) * Math.PI * 2;
      const dist = 540 + (i % 3) * 60;
      const h = 95 + (i % 4) * 38;
      const mtn = new THREE.Group();
      const base = new THREE.Mesh(new THREE.ConeGeometry(85, h, 7), mtnMat);
      base.position.y = h / 2 - 2;
      const cap = new THREE.Mesh(new THREE.ConeGeometry(34, h * 0.4, 7), snowMat);
      cap.position.y = h * 0.8 - 2;
      mtn.add(base, cap);
      mtn.position.set(Math.cos(ang) * dist, 0, Math.sin(ang) * dist - 40);
      scene.add(mtn);
    }

    // 3. Golden Gate Style Suspension Bridge (X = -110, Z = 220..440)
    const bridgeDeck = new THREE.Mesh(
      new THREE.BoxGeometry(26, 1.5, 220),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 })
    );
    bridgeDeck.position.set(-110, 0.6, 330);
    bridgeDeck.receiveShadow = true;
    scene.add(bridgeDeck);

    const towerMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.45, metalness: 0.3 });
    [275, 385].forEach(tz => {
      [-122, -98].forEach(tx => {
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(3.2, 58, 3.2), towerMat);
        pillar.position.set(tx, 27, tz);
        pillar.castShadow = true;
        scene.add(pillar);
      });
      // Crossbeams
      [26, 48].forEach(by => {
        const beam = new THREE.Mesh(new THREE.BoxGeometry(26, 2.6, 2.6), towerMat);
        beam.position.set(-110, by, tz);
        beam.castShadow = true;
        scene.add(beam);
      });
    });

    // 4. Downtown Skyscrapers & City Blocks
    const blockPlots = [
      // Northwest Downtown High-Rises
      { x: -165, z: -200, w: 42, d: 42, h: 78, tint: 0x38bdf8, helipad: true },
      { x: -165, z: -80,  w: 38, d: 44, h: 62, tint: 0x818cf8 },
      { x: -55,  z: -200, w: 44, d: 40, h: 92, tint: 0x60a5fa, helipad: true, title: 'LEO TOWER' },
      { x: -55,  z: -80,  w: 36, d: 36, h: 52, tint: 0xf472b6 },
      { x: 55,   z: -200, w: 42, d: 40, h: 70, tint: 0x34d399 },
      { x: 55,   z: -80,  w: 38, d: 38, h: 48, tint: 0xfbbf24 },
      { x: 165,  z: -200, w: 44, d: 42, h: 64, tint: 0xa78bfa },
      { x: 165,  z: -80,  w: 36, d: 36, h: 42, tint: 0xf87171 },
      // Mid-City Storefronts & Hero HQ
      { x: -165, z: 40,   w: 44, d: 36, h: 42, tint: 0xef4444, title: 'FIRE HQ' },
      { x: -165, z: 150,  w: 38, d: 34, h: 36, tint: 0x3b82f6, title: 'POLICE HQ' },
      { x: -45,  z: 40,   w: 36, d: 36, h: 54, tint: 0x38bdf8 },
      { x: -45,  z: 150,  w: 38, d: 34, h: 44, tint: 0xa855f7 },
      { x: 55,   z: 150,  w: 40, d: 34, h: 48, tint: 0x22c55e },
      { x: 165,  z: 40,   w: 40, d: 38, h: 46, tint: 0xf59e0b, title: 'PIZZA CO' },
      { x: 165,  z: 150,  w: 38, d: 36, h: 40, tint: 0xf43f5e },
      // North Skyline Mega Towers
      { x: 0,    z: -305, w: 52, d: 44, h: 118, tint: 0x38bdf8 },
      { x: -110, z: -305, w: 46, d: 42, h: 96,  tint: 0xfacc15 },
      { x: 110,  z: -305, w: 46, d: 42, h: 102, tint: 0xf472b6 },
      // Outer West & East Towers
      { x: -275, z: -195, w: 40, d: 55, h: 58, tint: 0x2dd4bf },
      { x: -275, z: -80,  w: 40, d: 55, h: 46, tint: 0xfb7185 },
      { x: -275, z: 40,   w: 40, d: 50, h: 38, tint: 0x60a5fa },
      { x: 275,  z: -195, w: 42, d: 55, h: 66, tint: 0x818cf8 },
      { x: 275,  z: -80,  w: 42, d: 50, h: 44, tint: 0xfacc15 }
    ];

    blockPlots.forEach((b, idx) => {
      const tex = idx % 2 === 0 ? TEXTURES.buildingGlass : TEXTURES.buildingWarm;
      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.35,
        metalness: 0.25
      });
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), mat);
      mesh.position.set(b.x, b.h / 2, b.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);

      // Glowing Neon Roof Crown
      const crown = new THREE.Mesh(
        new THREE.BoxGeometry(b.w + 1.2, 1.8, b.d + 1.2),
        new THREE.MeshBasicMaterial({ color: b.tint })
      );
      crown.position.set(b.x, b.h + 0.9, b.z);
      scene.add(crown);

      if (b.helipad) {
        const pad = new THREE.Mesh(
          new THREE.CylinderGeometry(11, 11, 0.6, 24),
          new THREE.MeshStandardMaterial({ color: 0x1e293b })
        );
        pad.position.set(b.x, b.h + 1.9, b.z);
        scene.add(pad);
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(7.5, 9, 24),
          new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide })
        );
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(b.x, b.h + 2.25, b.z);
        scene.add(ring);
      }

      buildingColliders.push({
        minX: b.x - b.w / 2 - 1.5,
        maxX: b.x + b.w / 2 + 1.5,
        minZ: b.z - b.d / 2 - 1.5,
        maxZ: b.z + b.d / 2 + 1.5,
        height: b.h + 2
      });
    });

    // 5. 3D Car-Soccer Stadium (Center Plaza: X = -55..55, Z = 10..85)
    const pitchMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(76, 56),
      new THREE.MeshStandardMaterial({ map: TEXTURES.soccerPitch, roughness: 0.8 })
    );
    pitchMesh.rotation.x = -Math.PI / 2;
    pitchMesh.rotation.z = Math.PI / 2;
    pitchMesh.position.set(55, 0.08, 42);
    pitchMesh.receiveShadow = true;
    scene.add(pitchMesh);

    // Goal Nets at X = 17 and X = 93 (Z = 42)
    [17, 93].forEach((gx, gi) => {
      const goalColor = gi === 0 ? 0x38bdf8 : 0xf43f5e;
      const postMat = new THREE.MeshBasicMaterial({ color: goalColor });
      const crossbar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 18), postMat);
      crossbar.position.set(gx, 7.5, 42);
      scene.add(crossbar);
      [-8.5, 8.5].forEach(gz => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 7.5, 12), postMat);
        post.position.set(gx, 3.75, 42 + gz);
        scene.add(post);
      });
    });

    // 6. Rotating 3D Ferris Wheel on the Beach Boardwalk (X = 120, Z = 235)
    const standMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.4, roughness: 0.3 });
    [-5, 5].forEach(oz => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 1.2, 34, 10), standMat);
      leg.position.set(120, 16, 235 + oz);
      leg.rotation.x = oz > 0 ? -0.18 : 0.18;
      scene.add(leg);
    });
    ferrisWheelGroup = new THREE.Group();
    ferrisWheelGroup.position.set(120, 31, 235);
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(22, 0.8, 12, 36),
      new THREE.MeshBasicMaterial({ color: 0xf472b6 })
    );
    ferrisWheelGroup.add(rim);
    const gondolaColors = [0xef4444, 0xf59e0b, 0xeab308, 0x22c55e, 0x06b6d4, 0x3b82f6, 0xa855f7, 0xec4899];
    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2;
      const spoke = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 44, 6),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
      );
      spoke.rotation.z = ang;
      ferrisWheelGroup.add(spoke);

      const cab = new THREE.Mesh(
        new THREE.SphereGeometry(2.2, 12, 12),
        new THREE.MeshStandardMaterial({ color: gondolaColors[i % gondolaColors.length], roughness: 0.3 })
      );
      cab.position.set(Math.cos(ang) * 22, Math.sin(ang) * 22, 0);
      ferrisWheelGroup.add(cab);
    }
    scene.add(ferrisWheelGroup);

    // 7. 18 Mega Stunt Ramps + Sky Rings
    const rampLocations = [
      { x: 0,    z: -75,  w: 12, l: 24, h: 6.5, dir: 'N' },
      { x: 0,    z: 35,   w: 12, l: 24, h: 6.0, dir: 'N' }, // Right ahead of player start, sloping UP toward Downtown!
      { x: -110, z: -60,  w: 12, l: 22, h: 7.0, dir: 'N' },
      { x: -110, z: 185,  w: 14, l: 24, h: 7.5, dir: 'S' }, // Jump onto Golden Gate Bridge!
      { x: 110,  z: -60,  w: 12, l: 22, h: 7.0, dir: 'N' },
      { x: 110,  z: 170,  w: 14, l: 24, h: 8.0, dir: 'S' }, // Jump toward Ferris Wheel & Marina!
      { x: -55,  z: -20,  w: 12, l: 20, h: 6.5, dir: 'E' },
      { x: 55,   z: -20,  w: 12, l: 20, h: 6.5, dir: 'W' },
      { x: -55,  z: -140, w: 12, l: 22, h: 7.0, dir: 'E' },
      { x: 55,   z: -140, w: 12, l: 22, h: 7.0, dir: 'W' },
      { x: 220,  z: 30,   w: 16, l: 28, h: 9.5, dir: 'N' }, // Monster Truck Mega Ramp!
      { x: -220, z: 30,   w: 16, l: 28, h: 9.5, dir: 'S' }
    ];

    rampLocations.forEach(r => {
      // Build a true sloped wedge geometry so cars drive smoothly up the incline
      const shape = new THREE.Shape();
      shape.moveTo(-r.l / 2, 0);
      shape.lineTo(r.l / 2, 0);
      shape.lineTo(r.l / 2, r.h);
      shape.closePath();

      const extrudeGeo = new THREE.ExtrudeGeometry(shape, { depth: r.w, bevelEnabled: false });
      extrudeGeo.center();
      const rampMesh = new THREE.Mesh(
        extrudeGeo,
        new THREE.MeshStandardMaterial({ map: TEXTURES.rampTex, roughness: 0.5 })
      );
      rampMesh.position.set(r.x, r.h / 2, r.z);
      if (r.dir === 'N') rampMesh.rotation.y = Math.PI / 2;
      else if (r.dir === 'S') rampMesh.rotation.y = -Math.PI / 2;
      else if (r.dir === 'W') rampMesh.rotation.y = Math.PI;
      rampMesh.castShadow = true;
      rampMesh.receiveShadow = true;
      scene.add(rampMesh);

      // Glowing Gold Sky Ring above the ramp apex
      const skyRing = new THREE.Mesh(
        new THREE.TorusGeometry(6.5, 0.55, 12, 28),
        new THREE.MeshBasicMaterial({ color: 0xfacc15 })
      );
      const offsetZ = r.dir === 'N' ? -18 : r.dir === 'S' ? 18 : 0;
      const offsetX = r.dir === 'E' ? 18 : r.dir === 'W' ? -18 : 0;
      skyRing.position.set(r.x + offsetX, r.h + 8, r.z + offsetZ);
      if (r.dir === 'E' || r.dir === 'W') skyRing.rotation.y = Math.PI / 2;
      scene.add(skyRing);

      ramps.push(r);
    });

    // 8. Trees, Palm Trees & Streetlamps
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.7 });
    for (let i = 0; i < 95; i++) {
      const tx = (Math.random() - 0.5) * 600;
      const tz = (Math.random() - 0.5) * 480;
      // Avoid roads & buildings
      if (roadXCoords.some(rx => Math.abs(tx - rx) < 18)) continue;
      if (roadZCoords.some(rz => Math.abs(tz - rz) < 18)) continue;
      if (buildingColliders.some(b => tx > b.minX - 4 && tx < b.maxX + 4 && tz > b.minZ - 4 && tz < b.maxZ + 4)) continue;
      if (tx > 10 && tx < 100 && tz > 5 && tz < 80) continue; // Keep soccer pitch clear

      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.9, 6, 7), trunkMat);
      trunk.position.y = 3;
      trunk.castShadow = true;
      tree.add(trunk);

      const crown1 = new THREE.Mesh(new THREE.ConeGeometry(4.2, 8, 8), leafMat);
      crown1.position.y = 8;
      crown1.castShadow = true;
      tree.add(crown1);

      const crown2 = new THREE.Mesh(new THREE.ConeGeometry(3.1, 6.5, 8), leafMat);
      crown2.position.y = 11.5;
      crown2.castShadow = true;
      tree.add(crown2);

      tree.position.set(tx, 0, tz);
      scene.add(tree);
    }

    // 9. Knockable 3D Physics Props (Cones, Crates, Beachballs)
    const coneGeo = new THREE.ConeGeometry(0.85, 2.2, 10);
    const coneMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 });
    const crateGeo = new THREE.BoxGeometry(1.8, 1.8, 1.8);
    const crateMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });

    for (let i = 0; i < 90; i++) {
      const isCone = i % 3 !== 0;
      const mesh = new THREE.Mesh(isCone ? coneGeo : crateGeo, isCone ? coneMat : crateMat);
      const rx = roadXCoords[i % roadXCoords.length] + (i % 2 === 0 ? 10 : -10);
      const rz = -220 + (i * 5.2) % 420;
      mesh.position.set(rx, isCone ? 1.1 : 0.9, rz);
      mesh.castShadow = true;
      scene.add(mesh);
      physicsProps.push({
        mesh,
        vx: 0,
        vy: 0,
        vz: 0,
        hitCooldown: 0,
        baseY: isCone ? 1.1 : 0.9
      });
    }

    // 10. Fluffy 3D Sky Clouds
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 });
    for (let i = 0; i < 26; i++) {
      const cg = new THREE.Group();
      for (let j = 0; j < 4; j++) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(8 + Math.random() * 6, 10, 10), cloudMat);
        puff.position.set(j * 7 - 10, Math.random() * 3, (Math.random() - 0.5) * 6);
        puff.scale.y = 0.55;
        cg.add(puff);
      }
      cg.position.set((Math.random() - 0.5) * 900, 105 + Math.random() * 45, (Math.random() - 0.5) * 900);
      scene.add(cg);
      clouds.push(cg);
    }
  }

  // --- 3D ARTICULATED VEHICLE BUILDER ---
  function createVehicleMesh(spec) {
    const root = new THREE.Group();
    const bodyGroup = new THREE.Group(); // Tilts with suspension pitch & roll
    root.add(bodyGroup);

    const wheels = [];
    let rotorMain = null;
    let rotorTail = null;
    const dinoLegs = [];

    const mainMat = new THREE.MeshStandardMaterial({
      color: spec.color,
      roughness: 0.25,
      metalness: 0.45
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: spec.accent,
      roughness: 0.3,
      metalness: 0.3
    });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.85
    });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.7, roughness: 0.2 });

    if (spec.isDino) {
      // 3D Articulated Emerald T-Rex!
      const torso = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.6, 5.6), mainMat);
      torso.position.set(0, 4.2, 0);
      torso.castShadow = true;
      bodyGroup.add(torso);

      const head = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.6, 3.8), mainMat);
      head.position.set(0, 6.8, 2.8);
      head.castShadow = true;
      bodyGroup.add(head);

      const jaw = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 3.2), accentMat);
      jaw.position.set(0, 5.2, 2.9);
      bodyGroup.add(jaw);

      // Glowing Dino Eyes
      [-1.42, 1.42].forEach(ex => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
        eye.position.set(ex, 7.2, 3.6);
        bodyGroup.add(eye);
      });

      const tail = new THREE.Mesh(new THREE.ConeGeometry(1.4, 6.5, 8), mainMat);
      tail.rotation.x = -Math.PI / 2.2;
      tail.position.set(0, 4.0, -5.2);
      bodyGroup.add(tail);

      // Two stomping legs
      [-1.4, 1.4].forEach(lx => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(1.2, 3.6, 1.8), mainMat);
        leg.position.set(lx, 1.8, 0);
        leg.castShadow = true;
        bodyGroup.add(leg);
        dinoLegs.push(leg);
      });
    } else if (spec.isFlying) {
      // 3D Sky-Hawk Rescue Helicopter
      const fuselage = new THREE.Mesh(new THREE.BoxGeometry(3.8, 3.2, 7.5), mainMat);
      fuselage.position.set(0, 2.8, 0);
      fuselage.castShadow = true;
      bodyGroup.add(fuselage);

      const cockpit = new THREE.Mesh(new THREE.SphereGeometry(2.1, 16, 12), glassMat);
      cockpit.position.set(0, 2.9, 2.6);
      bodyGroup.add(cockpit);

      const tailBoom = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.2, 6.5), accentMat);
      tailBoom.position.set(0, 3.1, -6.2);
      bodyGroup.add(tailBoom);

      // Landing Skids
      [-1.8, 1.8].forEach(sx => {
        const skid = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 7.5, 8), rimMat);
        skid.rotation.x = Math.PI / 2;
        skid.position.set(sx, 0.5, 0.5);
        bodyGroup.add(skid);
      });

      // Spinning Main Rotor & Tail Rotor
      rotorMain = new THREE.Group();
      rotorMain.position.set(0, 4.8, 0);
      const blade1 = new THREE.Mesh(new THREE.BoxGeometry(13.5, 0.12, 0.7), wheelMat);
      const blade2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.12, 13.5), wheelMat);
      rotorMain.add(blade1, blade2);
      bodyGroup.add(rotorMain);

      rotorTail = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.8, 0.4), accentMat);
      rotorTail.position.set(0.65, 3.3, -9.2);
      bodyGroup.add(rotorTail);
    } else if (spec.isBoat) {
      // 3D Aqua-Jet Speedboat
      const hull = new THREE.Mesh(new THREE.BoxGeometry(4.0, 1.5, 8.6), mainMat);
      hull.position.set(0, 1.1, 0);
      hull.castShadow = true;
      bodyGroup.add(hull);

      const bow = new THREE.Mesh(new THREE.ConeGeometry(2.8, 4.2, 4), accentMat);
      bow.rotation.x = Math.PI / 2;
      bow.rotation.y = Math.PI / 4;
      bow.position.set(0, 1.2, 5.8);
      bodyGroup.add(bow);

      const windshield = new THREE.Mesh(new THREE.BoxGeometry(3.3, 1.1, 2.2), glassMat);
      windshield.position.set(0, 2.1, 1.2);
      bodyGroup.add(windshield);
    } else {
      // 3D Wheeled Cars / Trucks (Supercar, Police, Fire Engine, Monster Truck, Ice Cream, Pizza)
      const isTruck = spec.id === 'firetruck' || spec.id === 'icecream';
      const isMonster = spec.id === 'monster';
      const chassisH = isTruck ? 2.8 : 1.35;
      const chassisL = isTruck ? 9.2 : 7.2;
      const chassisW = isMonster ? 4.2 : 3.8;
      const liftY = isMonster ? 2.4 : 1.15;

      const chassis = new THREE.Mesh(new THREE.BoxGeometry(chassisW, chassisH, chassisL), mainMat);
      chassis.position.set(0, liftY + chassisH / 2, 0);
      chassis.castShadow = true;
      bodyGroup.add(chassis);

      // Side Accent Stripe
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(chassisW + 0.1, 0.45, chassisL * 0.88), accentMat);
      stripe.position.set(0, liftY + chassisH * 0.45, 0);
      bodyGroup.add(stripe);

      // Cabin & Tinted Windshield
      const cabL = isTruck ? chassisL * 0.72 : chassisL * 0.52;
      const cabH = isTruck ? 1.8 : 1.25;
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(chassisW * 0.86, cabH, cabL), glassMat);
      cabin.position.set(0, liftY + chassisH + cabH / 2 - 0.1, isTruck ? 0.4 : -0.3);
      cabin.castShadow = true;
      bodyGroup.add(cabin);

      // Roof Top matching paint
      const roof = new THREE.Mesh(new THREE.BoxGeometry(chassisW * 0.82, 0.25, cabL * 0.88), mainMat);
      roof.position.set(0, liftY + chassisH + cabH, isTruck ? 0.4 : -0.3);
      bodyGroup.add(roof);

      // Vehicle-specific 3D Details
      if (spec.id === 'supercar') {
        // Rear Aerodynamic Wing Spoiler
        const wing = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.22, 1.1), accentMat);
        wing.position.set(0, liftY + chassisH + 0.85, -chassisL / 2 + 0.5);
        bodyGroup.add(wing);
      } else if (spec.id === 'police' || spec.id === 'firetruck') {
        // Flashing Red & Blue 3D Roof Lightbar
        const barRed = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.45, 0.6), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
        barRed.position.set(-0.75, liftY + chassisH + cabH + 0.3, 0.4);
        const barBlue = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.45, 0.6), new THREE.MeshBasicMaterial({ color: 0x3b82f6 }));
        barBlue.position.set(0.75, liftY + chassisH + cabH + 0.3, 0.4);
        bodyGroup.add(barRed, barBlue);

        if (spec.id === 'firetruck') {
          // White Extending Turntable Fire Ladder on Roof
          const ladder = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 0.5, 7.6),
            new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.4 })
          );
          ladder.position.set(0, liftY + chassisH + cabH + 0.55, -0.5);
          bodyGroup.add(ladder);
        }
      } else if (spec.id === 'icecream') {
        // Giant 3D Ice Cream Cone on Roof!
        const cone = new THREE.Mesh(new THREE.ConeGeometry(0.95, 2.4, 12), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
        cone.rotation.x = Math.PI * 0.78;
        cone.position.set(0, liftY + chassisH + cabH + 1.1, 0.2);
        const scoop = new THREE.Mesh(new THREE.SphereGeometry(1.05, 14, 14), new THREE.MeshStandardMaterial({ color: 0xf472b6 }));
        scoop.position.set(0, liftY + chassisH + cabH + 2.1, 0.8);
        bodyGroup.add(cone, scoop);
      } else if (spec.id === 'pizza') {
        // Glowing Pizza Sign on Roof
        const pie = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, 0.35, 18), new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
        pie.position.set(0, liftY + chassisH + cabH + 0.35, -0.3);
        bodyGroup.add(pie);
      }

      // Glowing Headlights & Brake Lights
      const hlMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
      const tlMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      [-1.25, 1.25].forEach(lx => {
        const hl = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.45, 0.2), hlMat);
        hl.position.set(lx, liftY + 0.7, chassisL / 2 + 0.05);
        const tl = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.4, 0.2), tlMat);
        tl.position.set(lx, liftY + 0.75, -chassisL / 2 - 0.05);
        bodyGroup.add(hl, tl);
      });

      // 4 Independent 3D Wheels (Steer & Spin)
      const wheelRadius = isMonster ? 1.55 : 0.95;
      const wheelWidth = isMonster ? 1.15 : 0.65;
      const wheelX = chassisW / 2 + wheelWidth * 0.32;
      const wheelZ = chassisL * 0.33;

      [
        { x: -wheelX, z: wheelZ, front: true },
        { x: wheelX, z: wheelZ, front: true },
        { x: -wheelX, z: -wheelZ, front: false },
        { x: wheelX, z: -wheelZ, front: false }
      ].forEach(wp => {
        const wGroup = new THREE.Group();
        wGroup.position.set(wp.x, wheelRadius, wp.z);
        const tire = new THREE.Mesh(new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 18), wheelMat);
        tire.rotation.z = Math.PI / 2;
        tire.castShadow = true;
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(wheelRadius * 0.55, wheelRadius * 0.55, wheelWidth + 0.05, 12), rimMat);
        hub.rotation.z = Math.PI / 2;
        wGroup.add(tire, hub);
        root.add(wGroup);
        wheels.push({ group: wGroup, tire, front: wp.front });
      });
    }

    // 3D Nitro Flame Cones at Rear
    const flameMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const flameGroup = new THREE.Group();
    [-0.9, 0.9].forEach(fx => {
      const f = new THREE.Mesh(new THREE.ConeGeometry(0.45, 2.6, 10), flameMat);
      f.rotation.x = -Math.PI / 2;
      f.position.set(fx, 1.2, -4.6);
      flameGroup.add(f);
    });
    flameGroup.visible = false;
    bodyGroup.add(flameGroup);

    // Real Dynamic Headlight SpotLight for Sunset/Night
    const headSpot = new THREE.SpotLight(0xfffbeb, 0.0, 85, Math.PI / 5, 0.45, 1.2);
    headSpot.position.set(0, 2.4, 3.5);
    headSpot.target.position.set(0, 0, 28);
    bodyGroup.add(headSpot);
    bodyGroup.add(headSpot.target);

    scene.add(root);

    return {
      spec,
      root,
      bodyGroup,
      wheels,
      rotorMain,
      rotorTail,
      dinoLegs,
      flameGroup,
      headSpot,
      x: 0,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      heading: 0,
      speed: 0,
      steerAngle: 0,
      airTime: 0
    };
  }

  // --- CREATE JUNIOR MAYOR LEO (3D CHARACTER WHEN WALKING ON FOOT) ---
  function createLeoCharacter() {
    const group = new THREE.Group();
    const shirtMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.4 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfdba74, roughness: 0.5 });
    const capMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.5, 0.8), shirtMat);
    torso.position.y = 2.1;
    torso.castShadow = true;
    group.add(torso);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.65, 14, 14), skinMat);
    head.position.y = 3.45;
    head.castShadow = true;
    group.add(head);

    const cap = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.35, 1.35), capMat);
    cap.position.set(0, 3.95, 0.15);
    group.add(cap);

    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.48, 1.3, 0.52), pantsMat);
    legL.position.set(-0.32, 0.7, 0);
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.48, 1.3, 0.52), pantsMat);
    legR.position.set(0.32, 0.7, 0);
    group.add(legL, legR);

    group.visible = false;
    scene.add(group);
    return { group, legL, legR, x: 0, y: 0, z: 0, vy: 0, heading: 0, speed: 0 };
  }

  // --- BUILD WORLD & SPAWN ALL 9 VEHICLES + SOCCER BALL ---
  buildWorld();

  const worldVehicles = [];
  const spawnPositions = [
    { x: 0,    z: 75,   h: Math.PI },     // 1: Comet GT Supercar (Facing Downtown!)
    { x: -110, z: 120,  h: Math.PI },     // 2: Hero Patrol Interceptor
    { x: -110, z: 20,   h: 0 },           // 3: Big Red Fire Engine
    { x: 220,  z: -15,  h: 0 },           // 4: Monster Crush 4x4
    { x: 0,    z: 115,  h: Math.PI / 2 }, // 5: Melody Ice Cream Van
    { x: 110,  z: 20,   h: -Math.PI / 2 },// 6: Rocket Pizza Buggy
    { x: -55,  z: -200, h: 0, y: 94.5 },  // 7: Sky-Hawk Helicopter (Also summonable with [7]!)
    { x: 120,  z: 345,  h: 0 },           // 8: Aqua-Jet Speedboat at Marina Bay
    { x: 110,  z: -120, h: Math.PI }      // 9: Emerald Rex (3D T-Rex)
  ];

  VEHICLE_CATALOG.forEach((spec, i) => {
    const v = createVehicleMesh(spec);
    const sp = spawnPositions[i];
    v.x = sp.x;
    v.y = sp.y || 0;
    v.z = sp.z;
    v.heading = sp.h;
    v.root.position.set(v.x, v.y, v.z);
    v.root.rotation.y = v.heading;
    worldVehicles.push(v);
  });

  // Giant 3D Bouncy Soccer Ball in Stadium (X = 55, Z = 42)
  const soccerBallMesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.8, 2),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, wireframe: false })
  );
  // Add black pentagon wireframe overlay so it looks like a classic 3D soccer ball
  const soccerWire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.83, 1),
    new THREE.MeshBasicMaterial({ color: 0x111827, wireframe: true })
  );
  soccerBallMesh.add(soccerWire);
  soccerBallMesh.castShadow = true;
  scene.add(soccerBallMesh);
  const soccerBall = { mesh: soccerBallMesh, x: 55, y: 2.8, z: 42, vx: 0, vy: 0, vz: 0 };

  // AI Traffic Cars Cruising Avenues
  const aiCars = [];
  const aiColors = [0x38bdf8, 0xa855f7, 0x22c55e, 0xfacc15, 0xf43f5e, 0xf97316];
  for (let i = 0; i < 14; i++) {
    const g = new THREE.Group();
    const b = new THREE.Mesh(
      new THREE.BoxGeometry(3.4, 1.5, 6.4),
      new THREE.MeshStandardMaterial({ color: aiColors[i % aiColors.length], roughness: 0.35 })
    );
    b.position.y = 1.3;
    b.castShadow = true;
    const t = new THREE.Mesh(
      new THREE.BoxGeometry(2.9, 1.1, 3.4),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2 })
    );
    t.position.y = 2.4;
    g.add(b, t);
    const rx = [-220, -110, 110, 220][i % 4];
    const dir = i % 2 === 0 ? 1 : -1;
    const rz = -220 + (i * 32) % 380;
    g.position.set(rx + (dir > 0 ? 5.5 : -5.5), 0, rz);
    g.rotation.y = dir > 0 ? 0 : Math.PI;
    scene.add(g);
    aiCars.push({ group: g, x: rx + (dir > 0 ? 5.5 : -5.5), z: rz, dir, speed: 24 + (i % 4) * 5 });
  }

  // --- HERO MISSIONS & 3D OBJECTIVE BEACON ---
  const MISSIONS = [
    {
      title: '🔥 Fire Rescue at Central Avenue!',
      desc: 'Drive into the golden beacon or spray it with the Fire Engine [3] Water Cannon [Z]!',
      x: -110,
      z: -20,
      type: 'fire',
      prefVeh: 'firetruck'
    },
    {
      title: '🍕 Hot Pizza Rush to Marina Pier!',
      desc: 'Race to the Sunny Beach Marina Pier (press [6] for Rocket Pizza Buggy or drive there)!',
      x: 120,
      z: 270,
      type: 'delivery',
      prefVeh: 'pizza'
    },
    {
      title: '🚁 Sky-High Rooftop Helipad Rescue!',
      desc: 'Press [7] for the Sky-Hawk Helicopter (or hit a Mega Ramp) to reach Leo Tower Rooftop!',
      x: -55,
      z: -200,
      y: 94,
      type: 'rooftop',
      prefVeh: 'helicopter'
    },
    {
      title: '🍦 Ice Cream Party at Soccer Plaza!',
      desc: 'Bring sweet treats to the Central Stadium entrance (press [5] for Ice Cream Van)!',
      x: 0,
      z: 42,
      type: 'icecream',
      prefVeh: 'icecream'
    },
    {
      title: '🌉 Golden Gate Bridge Stunt Sprint!',
      desc: 'Blast across the red Golden Gate Suspension Bridge beacon at full turbo speed!',
      x: -110,
      z: 330,
      type: 'bridge',
      prefVeh: 'supercar'
    }
  ];

  let missionIdx = 0;
  const beaconGroup = new THREE.Group();
  const beaconCylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(7, 7, 65, 24, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.28, side: THREE.DoubleSide })
  );
  beaconCylinder.position.y = 32.5;
  const beaconRing = new THREE.Mesh(
    new THREE.TorusGeometry(7.2, 0.5, 12, 32),
    new THREE.MeshBasicMaterial({ color: 0xfde047 })
  );
  beaconRing.rotation.x = Math.PI / 2;
  beaconRing.position.y = 0.6;

  // 3D Fire visual inside beacon for Fire Missions
  const fireGroup = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const fCone = new THREE.Mesh(
      new THREE.ConeGeometry(1.8, 5.5, 8),
      new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xef4444 : 0xf97316 })
    );
    fCone.position.set((Math.random() - 0.5) * 4, 2.7, (Math.random() - 0.5) * 4);
    fireGroup.add(fCone);
  }
  beaconGroup.add(beaconCylinder, beaconRing, fireGroup);
  scene.add(beaconGroup);

  function syncMissionUI() {
    const m = MISSIONS[missionIdx];
    document.getElementById('missionTitle').textContent = m.title;
    document.getElementById('missionDesc').textContent = m.desc;
    beaconGroup.position.set(m.x, m.y || 0, m.z);
    fireGroup.visible = m.type === 'fire';
  }
  syncMissionUI();

  // --- PLAYER STATE & CONTROLS ---
  const leo = createLeoCharacter();
  let activeVehicle = worldVehicles[0]; // Start in Comet GT Supercar
  let gameStarted = false;
  let score = 0;
  let stars = 0;
  let nitro = 100;
  let cameraMode = 0; // 0 = Chase, 1 = Close Action, 2 = High Helicopter View
  const CAM_NAMES = ['🎥 Cam: Chase (C)', '🎥 Cam: Close (C)', '🎥 Cam: Aerial (C)'];

  const keys = {};
  window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (!gameStarted && (e.code === 'Enter' || e.code === 'Space')) {
      startGame();
      return;
    }
    if (e.code === 'KeyC') cycleCamera();
    if (e.code === 'KeyT') cycleTimeOfDay();
    if (e.code === 'KeyM') toggleMute();
    if (e.code === 'KeyE' || e.code === 'Enter') toggleEnterExitVehicle();
    if (e.code === 'KeyZ' || e.code === 'KeyF') triggerVehicleGadget();

    // Instant Vehicle Summon Keys 1..9
    if (e.code.startsWith('Digit')) {
      const num = parseInt(e.code.replace('Digit', ''), 10);
      if (num >= 1 && num <= VEHICLE_CATALOG.length) {
        summonAndBoardVehicle(num - 1);
      }
    }
  });
  window.addEventListener('keyup', e => {
    keys[e.code] = false;
  });

  // Build Bottom Vehicle Quick-Spawner Dock
  const dockEl = document.getElementById('vehicleDock');
  VEHICLE_CATALOG.forEach((spec, idx) => {
    const btn = document.createElement('div');
    btn.className = 'dock-item' + (idx === 0 ? ' active' : '');
    btn.innerHTML = `<span class="dock-key">[${spec.key}]</span><span class="dock-emoji">${spec.emoji}</span><span class="dock-label">${spec.name.split(' ')[0]}</span>`;
    btn.addEventListener('click', () => {
      sfx.init();
      summonAndBoardVehicle(idx);
    });
    dockEl.appendChild(btn);
  });

  function updateVehicleHUD() {
    const items = dockEl.querySelectorAll('.dock-item');
    items.forEach((el, idx) => {
      el.classList.toggle('active', activeVehicle === worldVehicles[idx]);
    });
    if (activeVehicle) {
      document.getElementById('vehIcon').textContent = activeVehicle.spec.emoji;
      document.getElementById('vehName').textContent = activeVehicle.spec.name;
      document.getElementById('vehSub').textContent = activeVehicle.spec.sub;
    } else {
      document.getElementById('vehIcon').textContent = '🏃';
      document.getElementById('vehName').textContent = 'Junior Mayor Leo (On Foot)';
      document.getElementById('vehSub').textContent = 'Press [E] near any ride or [1-9] to summon!';
    }
  }

  function summonAndBoardVehicle(index) {
    const targetVeh = worldVehicles[index];
    const refPos = activeVehicle ? activeVehicle : leo;
    // Bring summoned vehicle right to player's current location & heading!
    targetVeh.x = refPos.x;
    targetVeh.z = refPos.z;
    targetVeh.y = Math.max(0, refPos.y);
    targetVeh.heading = refPos.heading;
    targetVeh.speed = activeVehicle ? activeVehicle.speed * 0.7 : 0;
    targetVeh.root.position.set(targetVeh.x, targetVeh.y, targetVeh.z);
    targetVeh.root.rotation.y = targetVeh.heading;

    activeVehicle = targetVeh;
    leo.group.visible = false;
    sfx.playJump();
    showStuntBanner(targetVeh.spec.emoji + ' ' + targetVeh.spec.name.toUpperCase(), 'READY TO ROLL!');
    updateVehicleHUD();
  }

  function toggleEnterExitVehicle() {
    sfx.init();
    if (activeVehicle) {
      // Hop out as Leo right beside the door
      leo.x = activeVehicle.x - Math.cos(activeVehicle.heading) * 4.5;
      leo.z = activeVehicle.z + Math.sin(activeVehicle.heading) * 4.5;
      leo.y = Math.max(0, activeVehicle.y);
      leo.heading = activeVehicle.heading;
      leo.group.position.set(leo.x, leo.y, leo.z);
      leo.group.visible = true;
      activeVehicle = null;
      sfx.playJump();
      updateVehicleHUD();
    } else {
      // Find closest vehicle
      let best = null;
      let bestDist = 22;
      worldVehicles.forEach(v => {
        const d = Math.hypot(v.x - leo.x, v.z - leo.z);
        if (d < bestDist) {
          bestDist = d;
          best = v;
        }
      });
      if (best) {
        activeVehicle = best;
        leo.group.visible = false;
        sfx.playJump();
        showStuntBanner(best.spec.emoji + ' ' + best.spec.name.toUpperCase(), 'HOPPED IN!');
        updateVehicleHUD();
      }
    }
  }

  let bannerTimeout = null;
  function showStuntBanner(mainText, subText) {
    const banner = document.getElementById('stuntBanner');
    document.getElementById('stuntMain').textContent = mainText;
    document.getElementById('stuntSub').textContent = subText;
    banner.classList.add('active');
    if (bannerTimeout) clearTimeout(bannerTimeout);
    bannerTimeout = setTimeout(() => banner.classList.remove('active'), 2100);
  }

  function addScore(pts) {
    score += pts;
    document.getElementById('scoreVal').textContent = score.toLocaleString() + ' PTS';
  }

  // --- VEHICLE GADGETS (Z / F KEY) ---
  function triggerVehicleGadget() {
    sfx.init();
    if (!activeVehicle) {
      leo.vy = 16;
      sfx.playJump();
      return;
    }
    const id = activeVehicle.spec.id;
    const fwdX = Math.sin(activeVehicle.heading);
    const fwdZ = Math.cos(activeVehicle.heading);

    if (id === 'firetruck') {
      // Spray burst of 3D pressurized water droplets!
      sfx.playSplash();
      for (let i = 0; i < 14; i++) {
        const drop = new THREE.Mesh(
          new THREE.SphereGeometry(0.55, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
        );
        drop.position.set(activeVehicle.x + fwdX * 3, activeVehicle.y + 4.8, activeVehicle.z + fwdZ * 3);
        scene.add(drop);
        waterDrops.push({
          mesh: drop,
          vx: fwdX * (45 + Math.random() * 15) + (Math.random() - 0.5) * 8,
          vy: 12 + Math.random() * 6,
          vz: fwdZ * (45 + Math.random() * 15) + (Math.random() - 0.5) * 8,
          life: 1.1
        });
      }
    } else if (id === 'monster') {
      if (activeVehicle.y <= 0.5) {
        activeVehicle.vy = 26;
        sfx.playJump();
        showStuntBanner('🛻 HYDRAULIC MEGA-HOP!', '+150 STUNT PTS');
        addScore(150);
      }
    } else if (id === 'trex') {
      sfx.playRoar();
      showStuntBanner('🦖 T-REX MEGA ROAR!!', '+200 DINO POWER');
      addScore(200);
      // Launch nearby physics props into the air!
      physicsProps.forEach(p => {
        const d = Math.hypot(p.mesh.position.x - activeVehicle.x, p.mesh.position.z - activeVehicle.z);
        if (d < 32) {
          p.vy = 18 + Math.random() * 10;
          p.vx = (p.mesh.position.x - activeVehicle.x) * 1.8;
          p.vz = (p.mesh.position.z - activeVehicle.z) * 1.8;
        }
      });
    } else if (id === 'pizza' || id === 'icecream') {
      sfx.playJump();
      const isPizza = id === 'pizza';
      const proj = new THREE.Mesh(
        isPizza ? new THREE.CylinderGeometry(1.1, 1.1, 0.3, 12) : new THREE.SphereGeometry(0.9, 10, 10),
        new THREE.MeshBasicMaterial({ color: isPizza ? 0xfacc15 : 0xf472b6 })
      );
      proj.position.set(activeVehicle.x + fwdX * 4, activeVehicle.y + 3.2, activeVehicle.z + fwdZ * 4);
      scene.add(proj);
      projectiles.push({
        mesh: proj,
        vx: fwdX * 55,
        vy: 10,
        vz: fwdZ * 55,
        life: 1.4
      });
      addScore(50);
    } else {
      sfx.playHorn();
    }
  }

  function cycleCamera() {
    cameraMode = (cameraMode + 1) % CAM_NAMES.length;
    document.getElementById('btnCam').textContent = CAM_NAMES[cameraMode];
  }
  function cycleTimeOfDay() {
    timeMode = (timeMode + 1) % TIME_PRESETS.length;
    const p = TIME_PRESETS[timeMode];
    document.getElementById('btnTime').textContent = p.name;
    scene.background.setHex(p.bg);
    scene.fog.color.setHex(p.fog);
    hemiLight.intensity = p.hemi;
    sunLight.intensity = p.sun;
    sunLight.color.setHex(p.sunCol);
    renderer.toneMappingExposure = p.exposure;
    const spotInt = timeMode === 0 ? 0.0 : timeMode === 1 ? 1.5 : 3.5;
    worldVehicles.forEach(v => {
      if (v.headSpot) v.headSpot.intensity = spotInt;
    });
  }
  function toggleMute() {
    sfx.muted = !sfx.muted;
    document.getElementById('btnMute').textContent = sfx.muted ? '🔇 Muted' : '🔊 Audio';
  }

  document.getElementById('btnCam').addEventListener('click', cycleCamera);
  document.getElementById('btnTime').addEventListener('click', cycleTimeOfDay);
  document.getElementById('btnMute').addEventListener('click', toggleMute);
  document.getElementById('interactPrompt').addEventListener('click', toggleEnterExitVehicle);

  function startGame() {
    sfx.init();
    gameStarted = true;
    document.getElementById('titleOverlay').style.display = 'none';
    sfx.playFanfare();
  }
  document.getElementById('startBtn').addEventListener('click', startGame);
  if (window.location.search.includes('autostart=1')) startGame();

  // --- CELEBRATION CONFETTI BURST ---
  const confettiList = [];
  function spawnConfetti(x, y, z) {
    const colors = [0xfacc15, 0x38bdf8, 0xf43f5e, 0x4ade80, 0xa855f7];
    for (let i = 0; i < 36; i++) {
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.7, 0.7),
        new THREE.MeshBasicMaterial({ color: colors[i % colors.length] })
      );
      m.position.set(x, y + 3, z);
      scene.add(m);
      confettiList.push({
        mesh: m,
        vx: (Math.random() - 0.5) * 36,
        vy: 14 + Math.random() * 20,
        vz: (Math.random() - 0.5) * 36,
        life: 1.8
      });
    }
  }

  // --- MAIN PHYSICS & GAMEPLAY LOOP ---
  const minimapCtx = document.getElementById('minimapCanvas').getContext('2d');
  let lastTime = performance.now();
  let titleOrbitAngle = 0;

  function update(dt) {
    // Animate Ferris Wheel & Clouds
    if (ferrisWheelGroup) ferrisWheelGroup.rotation.z += dt * 0.35;
    clouds.forEach(c => {
      c.position.x += dt * 4.5;
      if (c.position.x > 480) c.position.x = -480;
    });
    beaconRing.scale.setScalar(1 + Math.sin(performance.now() * 0.006) * 0.14);

    // If Title Screen is still up, orbit camera smoothly around Downtown Leo City
    if (!gameStarted) {
      titleOrbitAngle += dt * 0.22;
      camera.position.set(
        Math.sin(titleOrbitAngle) * 145,
        58 + Math.sin(titleOrbitAngle * 2) * 12,
        Math.cos(titleOrbitAngle) * 145 - 40
      );
      camera.lookAt(0, 18, -40);
      return;
    }

    // Read Input Axes
    const throttle = (keys['KeyW'] || keys['ArrowUp'] ? 1 : 0) - (keys['KeyS'] || keys['ArrowDown'] ? 1 : 0);
    const steer = (keys['KeyA'] || keys['ArrowLeft'] ? 1 : 0) - (keys['KeyD'] || keys['ArrowRight'] ? 1 : 0);
    const boostPressed = keys['Space'] || keys['ShiftLeft'] || keys['ShiftRight'];

    if (activeVehicle) {
      const v = activeVehicle;
      const spec = v.spec;

      // Continuous Water Spray when driving Fire Engine & holding Z/F
      if (spec.id === 'firetruck' && (keys['KeyZ'] || keys['KeyF']) && Math.random() < 0.45) {
        triggerVehicleGadget();
      }

      if (spec.isFlying) {
        // 3D Helicopter Flight Controls
        v.heading += steer * spec.turnRate * dt;
        const targetSpeed = throttle * spec.maxSpeed;
        v.speed += (targetSpeed - v.speed) * 3.5 * dt;
        if (boostPressed) v.y = Math.min(145, v.y + 32 * dt);
        else if (keys['KeyZ'] || keys['KeyF']) v.y = Math.max(0, v.y - 32 * dt);

        v.x += Math.sin(v.heading) * v.speed * dt;
        v.z += Math.cos(v.heading) * v.speed * dt;

        // Helicopter pitch & bank tilt
        v.bodyGroup.rotation.x = (v.speed / spec.maxSpeed) * 0.26;
        v.bodyGroup.rotation.z = -steer * 0.28;
        if (v.rotorMain) v.rotorMain.rotation.y += dt * 28;
        if (v.rotorTail) v.rotorTail.rotation.x += dt * 32;
      } else {
        // Ground & Amphibious Vehicle Arcade Physics
        let maxSpd = spec.maxSpeed;
        let acc = spec.accel;
        if (boostPressed && nitro > 2) {
          maxSpd *= 1.38;
          acc *= 1.65;
          nitro = Math.max(0, nitro - 28 * dt);
          v.flameGroup.visible = true;
          if (Math.random() < 0.12) sfx.playBoost();
        } else {
          nitro = Math.min(100, nitro + 16 * dt);
          v.flameGroup.visible = false;
        }

        if (throttle !== 0) {
          v.speed += throttle * acc * dt;
        } else {
          // Natural coasting drag
          v.speed *= Math.pow(0.22, dt);
        }
        v.speed = Math.max(-maxSpd * 0.45, Math.min(maxSpd, v.speed));

        // Responsive steering
        const turnFactor = Math.abs(v.speed) > 2 ? Math.sign(v.speed) : 1;
        v.steerAngle = steer * 0.45;
        if (Math.abs(v.speed) > 0.8) {
          v.heading += steer * spec.turnRate * turnFactor * dt;
        }

        const nextX = v.x + Math.sin(v.heading) * v.speed * dt;
        const nextZ = v.z + Math.cos(v.heading) * v.speed * dt;

        // Building Collision Check (Allow rooftop landing if high enough!)
        let blocked = false;
        for (let i = 0; i < buildingColliders.length; i++) {
          const b = buildingColliders[i];
          if (nextX > b.minX && nextX < b.maxX && nextZ > b.minZ && nextZ < b.maxZ) {
            if (v.y < b.height - 2.5) {
              blocked = true;
              v.speed *= -0.35;
              break;
            }
          }
        }
        if (!blocked) {
          v.x = Math.max(-330, Math.min(330, nextX));
          v.z = Math.max(-330, Math.min(430, nextZ));
        }

        // Check Ramp Elevation & Stunt Launch!
        let groundHeight = 0;
        for (let i = 0; i < buildingColliders.length; i++) {
          const b = buildingColliders[i];
          if (v.x > b.minX && v.x < b.maxX && v.z > b.minZ && v.z < b.maxZ && v.y >= b.height - 3) {
            groundHeight = b.height;
          }
        }

        for (let i = 0; i < ramps.length; i++) {
          const r = ramps[i];
          if (Math.abs(v.x - r.x) < r.w / 2 + 1 && Math.abs(v.z - r.z) < r.l / 2 + 1) {
            let t = 0.5;
            if (r.dir === 'N') t = (r.z + r.l / 2 - v.z) / r.l;
            else if (r.dir === 'S') t = (v.z - (r.z - r.l / 2)) / r.l;
            else if (r.dir === 'E') t = (v.x - (r.x - r.l / 2)) / r.l;
            else if (r.dir === 'W') t = (r.x + r.l / 2 - v.x) / r.l;
            t = Math.max(0, Math.min(1, t));
            groundHeight = Math.max(groundHeight, t * r.h);

            // Launch into the sky when hitting the top of the ramp at speed!
            if (t > 0.78 && Math.abs(v.speed) > 32 && v.vy <= 2) {
              const jumpMult = spec.id === 'monster' ? 1.45 : 1.0;
              v.vy = Math.abs(v.speed) * 0.44 * jumpMult;
              sfx.playJump();
            }
          }
        }

        // Gravity & Air Time
        if (v.y > groundHeight || v.vy > 0) {
          v.y += v.vy * dt;
          v.vy -= 38 * dt;
          v.airTime += dt;
          if (v.y <= groundHeight) {
            v.y = groundHeight;
            v.vy = 0;
            if (v.airTime > 0.65) {
              const pts = Math.round(v.airTime * 350);
              addScore(pts);
              showStuntBanner('🚀 MEGA AIR STUNT!', `+${pts} STUNT BONUS`);
              sfx.playFanfare();
            }
            v.airTime = 0;
          }
        } else {
          v.y = groundHeight;
          v.airTime = 0;
        }

        // Active 3D Suspension Body Roll & Pitch
        const targetRoll = steer * Math.min(1, Math.abs(v.speed) / 40) * 0.14;
        const targetPitch = v.y > groundHeight + 0.5 ? -v.vy * 0.018 : -throttle * 0.05;
        v.bodyGroup.rotation.z += (targetRoll - v.bodyGroup.rotation.z) * 10 * dt;
        v.bodyGroup.rotation.x += (targetPitch - v.bodyGroup.rotation.x) * 10 * dt;

        // Spin & Steer 3D Wheels
        v.wheels.forEach(w => {
          w.tire.rotation.x += v.speed * dt * 0.8;
          if (w.front) w.group.rotation.y = v.steerAngle;
        });

        // Animate T-Rex Stomping Legs
        if (spec.isDino && v.dinoLegs.length === 2) {
          const walkCycle = Math.sin(performance.now() * 0.015) * Math.min(1, Math.abs(v.speed) / 20);
          v.dinoLegs[0].rotation.x = walkCycle * 0.6;
          v.dinoLegs[1].rotation.x = -walkCycle * 0.6;
        }
      }

      v.root.position.set(v.x, v.y, v.z);
      v.root.rotation.y = v.heading;
      sfx.updateSpecialAudio(dt, spec.id, v.speed);

      // Update Speedometer HUD
      const mph = Math.round(Math.abs(v.speed) * 1.6);
      document.getElementById('speedVal').textContent = mph;
      document.getElementById('nitroFill').style.width = nitro + '%';
      document.getElementById('interactPrompt').style.display = 'none';
    } else {
      // Walking on Foot as Junior Mayor Leo
      leo.heading += steer * 3.2 * dt;
      leo.speed = throttle * 24;
      leo.x += Math.sin(leo.heading) * leo.speed * dt;
      leo.z += Math.cos(leo.heading) * leo.speed * dt;
      if (leo.y > 0 || leo.vy > 0) {
        leo.y += leo.vy * dt;
        leo.vy -= 42 * dt;
        if (leo.y < 0) {
          leo.y = 0;
          leo.vy = 0;
        }
      }
      const swing = Math.sin(performance.now() * 0.018) * (Math.abs(leo.speed) > 1 ? 0.6 : 0);
      leo.legL.rotation.x = swing;
      leo.legR.rotation.x = -swing;
      leo.group.position.set(leo.x, leo.y, leo.z);
      leo.group.rotation.y = leo.heading;

      document.getElementById('speedVal').textContent = Math.round(Math.abs(leo.speed));

      // Show prompt when near any vehicle
      let nearVeh = null;
      worldVehicles.forEach(v => {
        if (Math.hypot(v.x - leo.x, v.z - leo.z) < 16) nearVeh = v;
      });
      const promptEl = document.getElementById('interactPrompt');
      if (nearVeh) {
        promptEl.style.display = 'block';
        promptEl.textContent = `Press [E] or Click to Drive ${nearVeh.spec.emoji} ${nearVeh.spec.name}!`;
      } else {
        promptEl.style.display = 'none';
      }
    }

    const playerObj = activeVehicle || leo;

    // --- 3D CHASE CAMERA FOLLOW ---
    const camPresets = [
      { dist: 21, height: 8.5, lookAhead: 12 },
      { dist: 14, height: 5.2, lookAhead: 16 },
      { dist: 38, height: 22.0, lookAhead: 8 }
    ];
    const cp = camPresets[cameraMode];
    const targetCamX = playerObj.x - Math.sin(playerObj.heading) * cp.dist;
    const targetCamZ = playerObj.z - Math.cos(playerObj.heading) * cp.dist;
    const targetCamY = playerObj.y + cp.height;

    camera.position.x += (targetCamX - camera.position.x) * Math.min(1, dt * 8.5);
    camera.position.z += (targetCamZ - camera.position.z) * Math.min(1, dt * 8.5);
    camera.position.y += (targetCamY - camera.position.y) * Math.min(1, dt * 7.5);

    // Dynamic FOV boost when firing Nitro!
    const targetFov = boostPressed && activeVehicle && Math.abs(activeVehicle.speed) > 40 ? 74 : 62;
    if (Math.abs(camera.fov - targetFov) > 0.2) {
      camera.fov += (targetFov - camera.fov) * dt * 6;
      camera.updateProjectionMatrix();
    }

    camera.lookAt(
      playerObj.x + Math.sin(playerObj.heading) * cp.lookAhead,
      playerObj.y + 3.2,
      playerObj.z + Math.cos(playerObj.heading) * cp.lookAhead
    );

    // --- SMASHABLE 3D PHYSICS PROPS ---
    physicsProps.forEach(p => {
      if (p.hitCooldown > 0) p.hitCooldown -= dt;
      const dx = p.mesh.position.x - playerObj.x;
      const dz = p.mesh.position.z - playerObj.z;
      if (dx * dx + dz * dz < 14 && p.hitCooldown <= 0 && Math.abs(playerObj.speed) > 6) {
        p.hitCooldown = 1.2;
        p.vx = Math.sin(playerObj.heading) * Math.abs(playerObj.speed) * 0.9 + (Math.random() - 0.5) * 14;
        p.vz = Math.cos(playerObj.heading) * Math.abs(playerObj.speed) * 0.9 + (Math.random() - 0.5) * 14;
        p.vy = 14 + Math.random() * 10;
        addScore(25);
        sfx.playSmash();
      }
      if (p.mesh.position.y > p.baseY || Math.abs(p.vx) > 0.2 || Math.abs(p.vz) > 0.2) {
        p.mesh.position.x += p.vx * dt;
        p.mesh.position.z += p.vz * dt;
        p.mesh.position.y += p.vy * dt;
        p.vy -= 36 * dt;
        p.mesh.rotation.x += p.vz * dt * 0.4;
        p.mesh.rotation.z += p.vx * dt * 0.4;
        if (p.mesh.position.y <= p.baseY) {
          p.mesh.position.y = p.baseY;
          p.vy *= -0.4;
          p.vx *= 0.65;
          p.vz *= 0.65;
        }
      }
    });

    // --- 3D CAR-SOCCER BALL PHYSICS & GOAL DETECTION ---
    const bdx = soccerBall.x - playerObj.x;
    const bdz = soccerBall.z - playerObj.z;
    const bDist = Math.hypot(bdx, bdz);
    if (bDist < 6.2) {
      const pushSpd = Math.max(28, Math.abs(playerObj.speed) * 1.35);
      soccerBall.vx = (bdx / (bDist || 1)) * pushSpd;
      soccerBall.vz = (bdz / (bDist || 1)) * pushSpd;
      soccerBall.vy = 14;
      sfx.playSmash();
    }
    soccerBall.x += soccerBall.vx * dt;
    soccerBall.z += soccerBall.vz * dt;
    soccerBall.y += soccerBall.vy * dt;
    if (soccerBall.y > 2.8) {
      soccerBall.vy -= 34 * dt;
    } else {
      soccerBall.y = 2.8;
      if (Math.abs(soccerBall.vy) > 3) soccerBall.vy *= -0.55;
      else soccerBall.vy = 0;
    }
    soccerBall.vx *= Math.pow(0.45, dt);
    soccerBall.vz *= Math.pow(0.45, dt);

    // Keep ball inside stadium bounds & check Goal Nets (X = 17 or X = 93, Z = 33..51)
    if (Math.abs(soccerBall.z - 42) < 9 && (Math.abs(soccerBall.x - 17) < 4.5 || Math.abs(soccerBall.x - 93) < 4.5)) {
      addScore(1000);
      stars += 1;
      document.getElementById('starsVal').textContent = `⭐ ${stars} HERO BADGES`;
      showStuntBanner('⚽ GOOOOOOAL!!', '+1,000 STADIUM BONUS!');
      sfx.playFanfare();
      spawnConfetti(soccerBall.x, 4, soccerBall.z);
      soccerBall.x = 55;
      soccerBall.z = 42;
      soccerBall.vx = 0;
      soccerBall.vz = 0;
    }
    soccerBall.mesh.position.set(soccerBall.x, soccerBall.y, soccerBall.z);
    soccerBall.mesh.rotation.x += soccerBall.vz * dt * 0.35;
    soccerBall.mesh.rotation.z -= soccerBall.vx * dt * 0.35;

    // --- UPDATE WATER CANNON DROPS, PROJECTILES & CONFETTI ---
    for (let i = waterDrops.length - 1; i >= 0; i--) {
      const w = waterDrops[i];
      w.life -= dt;
      w.mesh.position.x += w.vx * dt;
      w.mesh.position.y += w.vy * dt;
      w.mesh.position.z += w.vz * dt;
      w.vy -= 30 * dt;

      // Check if water hits Fire Mission beacon!
      const m = MISSIONS[missionIdx];
      if (m.type === 'fire' && Math.hypot(w.mesh.position.x - m.x, w.mesh.position.z - m.z) < 14) {
        completeCurrentMission();
      }
      if (w.life <= 0 || w.mesh.position.y < 0) {
        scene.remove(w.mesh);
        waterDrops.splice(i, 1);
      }
    }

    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i];
      p.life -= dt;
      p.mesh.position.x += p.vx * dt;
      p.mesh.position.y += p.vy * dt;
      p.mesh.position.z += p.vz * dt;
      p.vy -= 28 * dt;
      if (p.life <= 0 || p.mesh.position.y < 0) {
        scene.remove(p.mesh);
        projectiles.splice(i, 1);
      }
    }

    for (let i = confettiList.length - 1; i >= 0; i--) {
      const c = confettiList[i];
      c.life -= dt;
      c.mesh.position.x += c.vx * dt;
      c.mesh.position.y += c.vy * dt;
      c.mesh.position.z += c.vz * dt;
      c.vy -= 26 * dt;
      c.mesh.rotation.x += 5 * dt;
      c.mesh.rotation.y += 5 * dt;
      if (c.life <= 0) {
        scene.remove(c.mesh);
        confettiList.splice(i, 1);
      }
    }

    // --- AI TRAFFIC CARS ---
    aiCars.forEach(ai => {
      ai.z += ai.dir * ai.speed * dt;
      if (ai.z > 220) ai.z = -260;
      if (ai.z < -260) ai.z = 220;
      ai.group.position.z = ai.z;
    });

    // --- CHECK HERO MISSION COMPLETION & COMPASS ---
    const curM = MISSIONS[missionIdx];
    const distToMission = Math.hypot(curM.x - playerObj.x, curM.z - playerObj.z);
    const heightDiff = Math.abs((curM.y || 0) - playerObj.y);

    if (distToMission < 14 && heightDiff < 18) {
      completeCurrentMission();
    }

    const angleToTarget = Math.atan2(curM.x - playerObj.x, curM.z - playerObj.z) - playerObj.heading;
    const deg = -(angleToTarget * 180) / Math.PI;
    document.getElementById('compassArrow').style.transform = `rotate(${deg}deg)`;
    document.getElementById('compassDist').textContent = `${Math.round(distToMission)}m to Objective`;

    // --- RENDER TOP-RIGHT RADAR MINI-MAP ---
    drawMinimap(playerObj, curM);
  }

  function completeCurrentMission() {
    addScore(1500);
    stars += 1;
    document.getElementById('starsVal').textContent = `⭐ ${stars} HERO BADGES`;
    const m = MISSIONS[missionIdx];
    showStuntBanner('🌟 HERO MISSION COMPLETE!', '+1,500 PTS & HERO BADGE!');
    sfx.playFanfare();
    spawnConfetti(m.x, m.y || 2, m.z);
    missionIdx = (missionIdx + 1) % MISSIONS.length;
    syncMissionUI();
  }

  function drawMinimap(playerObj, mission) {
    const ctx = minimapCtx;
    const w = 176, h = 176, cx = w / 2, cy = h / 2;
    ctx.clearRect(0, 0, w, h);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(playerObj.heading - Math.PI);
    const scale = 0.25;

    // Draw avenues on radar
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.lineWidth = 4;
    [-220, -110, 0, 110, 220].forEach(rx => {
      const x = (rx - playerObj.x) * scale;
      ctx.beginPath();
      ctx.moveTo(x, (-300 - playerObj.z) * scale);
      ctx.lineTo(x, (350 - playerObj.z) * scale);
      ctx.stroke();
    });
    [-260, -140, -20, 100, 200].forEach(rz => {
      const z = (rz - playerObj.z) * scale;
      ctx.beginPath();
      ctx.moveTo((-300 - playerObj.x) * scale, z);
      ctx.lineTo((300 - playerObj.x) * scale, z);
      ctx.stroke();
    });

    // Draw parked vehicles
    worldVehicles.forEach(v => {
      if (v === activeVehicle) return;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc((v.x - playerObj.x) * scale, (v.z - playerObj.z) * scale, 3.2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Golden Mission Beacon
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc((mission.x - playerObj.x) * scale, (mission.z - playerObj.z) * scale, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Player Arrow in Center
    ctx.fillStyle = '#4ade80';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 7);
    ctx.lineTo(cx - 5, cy + 6);
    ctx.lineTo(cx + 5, cy + 6);
    ctx.closePath();
    ctx.fill();
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function animate(now) {
    requestAnimationFrame(animate);
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    update(dt);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
})();
