// ============================================================================
// SUPER LEO CITY 3D — CUSTOM ZIP CODE OPENSTREETMAP, TERRAIN & STUNT SANDBOX
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
    playBoost() { this.tone(140, 0.25, 'sawtooth', 0.14, 420); }
    playSplash() { this.tone(320, 0.09, 'sine', 0.08, 120); }
    playJump() { this.tone(240, 0.3, 'triangle', 0.15, 620); }
    playRoar() { this.tone(95, 0.45, 'sawtooth', 0.22, 48); }
    playHorn() {
      this.tone(440, 0.15, 'square', 0.1, 440);
      setTimeout(() => this.tone(554, 0.22, 'square', 0.1, 554), 90);
    }
    playFanfare() {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((n, i) => setTimeout(() => this.tone(n, 0.22, 'triangle', 0.18), i * 95));
    }
    playSmash() { this.tone(190, 0.09, 'square', 0.08, 70); }
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

  // Dynamic 3D Signboard Texture Builder (for Welcome Arch & Real OSM Street Signs)
  function makeSignTexture(text, subText = '', bgColor = '#065f46', borderColor = '#ffffff', textColor = '#ffffff') {
    return makeCanvasTexture(512, 160, (ctx, w, h) => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 10;
      ctx.strokeRect(8, 8, w - 16, h - 16);

      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 38px "Segoe UI", system-ui, sans-serif';
      ctx.fillText(text.slice(0, 26), w / 2, subText ? h * 0.38 : h * 0.5);

      if (subText) {
        ctx.fillStyle = '#fde047';
        ctx.font = '800 24px "Segoe UI", system-ui, sans-serif';
        ctx.fillText(subText.slice(0, 36), w / 2, h * 0.74);
      }
    }, 1, 1);
  }

  const TEXTURES = {
    roadN: makeCanvasTexture(512, 512, (ctx, w, h) => {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, w, h);
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
      ctx.fillStyle = '#facc15';
      ctx.fillRect(w / 2 - 16, 0, 11, h);
      ctx.fillRect(w / 2 + 5, 0, 11, h);
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
          ctx.fillStyle = lit ? (Math.random() > 0.25 ? '#bae6fd' : '#fef08a') : '#1e293b';
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

    desertSand: makeCanvasTexture(256, 256, (ctx, w, h) => {
      ctx.fillStyle = '#e09f5a';
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 1800; i++) {
        ctx.fillStyle = i % 2 ? '#d97706' : '#fcd34d';
        ctx.fillRect(Math.random() * w, Math.random() * h, 3, 3);
      }
    }, 30, 30),

    snowGround: makeCanvasTexture(256, 256, (ctx, w, h) => {
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 1500; i++) {
        ctx.fillStyle = i % 2 ? '#e2e8f0' : '#bae6fd';
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
  scene.background = new THREE.Color(0x38bdf8);
  scene.fog = new THREE.FogExp2(0x7dd3fc, 0.0013);

  const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.5, 1300);
  camera.position.set(0, 12, -25);

  // --- LIGHTING (DAY / SUNSET / NEON NIGHT) ---
  const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 0.82);
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

  let timeMode = 0;
  const TIME_PRESETS = [
    { name: '☀️ Day (T)', bg: 0x38bdf8, fog: 0x7dd3fc, hemi: 0.82, sun: 1.35, sunCol: 0xfffbeb, exposure: 1.1 },
    { name: '🌅 Sunset (T)', bg: 0xf97316, fog: 0xfb923c, hemi: 0.65, sun: 1.15, sunCol: 0xfde047, exposure: 1.05 },
    { name: '🌙 Night (T)', bg: 0x090d16, fog: 0x0f172a, hemi: 0.34, sun: 0.28, sunCol: 0x60a5fa, exposure: 0.95 }
  ];

  // --- WORLD STATE & DYNAMIC HOMETOWN GROUPS ---
  const buildingColliders = [];
  const baseBuildingColliders = [];
  const ramps = [];
  const physicsProps = [];
  const clouds = [];
  const waterDrops = [];
  const projectiles = [];
  const weatherParticles = [];
  let weatherType = 'clear'; // 'clear' | 'snow' | 'rain'
  let ferrisWheelGroup = null;
  let terrainGeo = null;
  let terrainMesh = null;
  let welcomeSignMeshN = null;
  let welcomeSignMeshS = null;

  // Dynamic group that holds OpenStreetMap streets, OSM buildings, 3D street signs, biome flora & horizon peaks
  const hometownDynamicGroup = new THREE.Group();
  scene.add(hometownDynamicGroup);

  const roadXCoords = [-220, -110, 0, 110, 220];
  const roadZCoords = [-260, -140, -20, 100, 200];

  // Current Hometown State
  const hometown = {
    zip: '94040',
    city: 'Mountain View',
    state: 'California',
    stateAbbr: 'CA',
    lat: 37.3855,
    lon: -122.088,
    biome: 'coastal', // 'coastal' | 'alpine' | 'desert' | 'metro'
    biomeLabel: 'Coastal Bay',
    elevMin: 24,
    elevMax: 68,
    tempF: 68,
    weatherDesc: '☀️ Sunny',
    streets: ['Castro St', 'El Camino Real', 'Miramonte Ave', 'Shoreline Blvd', 'California St', 'Dana St'],
    landmarks: ['Cuesta Park', 'Pioneer Park', 'Civic Center Plaza', 'Eagle Park', 'Rengstorff Park']
  };

  // --- COMPUTE TERRAIN HEIGHT AT (X, Z) ---
  let currentElevationGrid = null; // 7x7 array of normalized heights
  let terrainReliefScale = 14;

  function getTerrainHeightAt(x, z) {
    // Keep main avenues, downtown core, soccer pitch, and beach boardwalk smoothly flat for high-speed driving
    for (let i = 0; i < roadXCoords.length; i++) {
      if (Math.abs(x - roadXCoords[i]) < 18) return 0;
    }
    for (let i = 0; i < roadZCoords.length; i++) {
      if (Math.abs(z - roadZCoords[i]) < 18) return 0;
    }
    if (x > 5 && x < 105 && z > 0 && z < 85) return 0; // Soccer stadium
    if (z > 185) return 0; // Beach & Marina

    // Compute smooth distance from nearest road to blend hills naturally in parks/blocks & outer perimeter
    let minRoadDist = 999;
    roadXCoords.forEach(rx => { minRoadDist = Math.min(minRoadDist, Math.abs(x - rx) - 16); });
    roadZCoords.forEach(rz => { minRoadDist = Math.min(minRoadDist, Math.abs(z - rz) - 16); });
    const blend = Math.max(0, Math.min(1, minRoadDist / 38));

    // Outer perimeter rises into real topographic hills!
    const radialOut = Math.max(0, (Math.hypot(x, z + 40) - 235) / 110);
    const wave =
      Math.sin(x * 0.022 + hometown.lat) * Math.cos(z * 0.022 + hometown.lon) * 0.5 +
      Math.sin(x * 0.05 - z * 0.04) * 0.25 + 0.5;

    let gridH = wave;
    if (currentElevationGrid && currentElevationGrid.length === 49) {
      const gx = Math.max(0, Math.min(6, Math.floor(((x + 360) / 720) * 6)));
      const gz = Math.max(0, Math.min(6, Math.floor(((z + 360) / 720) * 6)));
      gridH = currentElevationGrid[gz * 7 + gx] * 0.7 + wave * 0.3;
    }

    return (blend * 0.35 + radialOut * 1.45) * gridH * terrainReliefScale;
  }

  function rebuildTerrainVertices() {
    if (!terrainGeo) return;
    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vz = -pos.getY(i); // PlaneGeometry is rotated -PI/2 around X
      const h = getTerrainHeightAt(vx, vz);
      pos.setZ(i, h);
    }
    pos.needsUpdate = true;
    terrainGeo.computeVertexNormals();
  }

  function buildBaseWorld() {
    // 1. Ocean Bay Plane
    const oceanGeo = new THREE.PlaneGeometry(2600, 2600);
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

    // Subdivided 3D Elevation Terrain Mesh (56x56 grid)
    terrainGeo = new THREE.PlaneGeometry(720, 620, 56, 56);
    const terrainMat = new THREE.MeshStandardMaterial({ map: TEXTURES.grass, roughness: 0.85 });
    terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.rotation.x = -Math.PI / 2;
    terrainMesh.position.set(0, -0.02, -45);
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);
    rebuildTerrainVertices();

    // Sandy Beach Strip along South Bay (Z = 200..265)
    const beach = new THREE.Mesh(
      new THREE.BoxGeometry(720, 2.6, 75),
      new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.9 })
    );
    beach.position.set(0, -1.55, 235);
    beach.receiveShadow = true;
    scene.add(beach);

    // Marina Wooden Pier
    const pier = new THREE.Mesh(
      new THREE.BoxGeometry(36, 2.5, 110),
      new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.8 })
    );
    pier.position.set(120, 0.4, 305);
    pier.castShadow = true;
    pier.receiveShadow = true;
    scene.add(pier);

    // 2. Main Road Network Grid
    roadXCoords.forEach(rx => {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(26, 560),
        new THREE.MeshStandardMaterial({ map: TEXTURES.roadN, roughness: 0.7 })
      );
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(rx, 0.06, -50);
      mesh.receiveShadow = true;
      scene.add(mesh);
    });

    roadZCoords.forEach(rz => {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(680, 26),
        new THREE.MeshStandardMaterial({ map: TEXTURES.roadE, roughness: 0.7 })
      );
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(0, 0.04, rz);
      mesh.receiveShadow = true;
      scene.add(mesh);
    });

    // Boulevard Welcome Overhead Gantry Archways (Dynamic City & ZIP Signboards!)
    [-85, 22].forEach((az, idx) => {
      const archGroup = new THREE.Group();
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5, roughness: 0.3 });
      [-14.5, 14.5].forEach(ax => {
        const p = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 18.5, 12), pillarMat);
        p.position.set(ax, 9.2, az);
        p.castShadow = true;
        archGroup.add(p);
      });
      const signTex = makeSignTexture(
        idx === 0 ? 'DOWNTOWN ' + hometown.city.toUpperCase() : 'WELCOME TO ' + hometown.city.toUpperCase(),
        `ZIP ${hometown.zip} • ${hometown.state.toUpperCase()}`
      );
      const banner = new THREE.Mesh(
        new THREE.BoxGeometry(31, 4.8, 1.4),
        new THREE.MeshBasicMaterial({ map: signTex })
      );
      banner.position.set(0, 17.5, az);
      if (idx === 0) welcomeSignMeshN = banner;
      else welcomeSignMeshS = banner;
      archGroup.add(banner);
      scene.add(archGroup);
    });

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
      [26, 48].forEach(by => {
        const beam = new THREE.Mesh(new THREE.BoxGeometry(26, 2.6, 2.6), towerMat);
        beam.position.set(-110, by, tz);
        beam.castShadow = true;
        scene.add(beam);
      });
    });

    // 4. Core Downtown Skyscrapers & Hero HQ
    const blockPlots = [
      { x: -165, z: -200, w: 42, d: 42, h: 78, tint: 0x38bdf8, helipad: true },
      { x: -165, z: -80,  w: 38, d: 44, h: 62, tint: 0x818cf8 },
      { x: -55,  z: -200, w: 44, d: 40, h: 92, tint: 0x60a5fa, helipad: true },
      { x: -55,  z: -80,  w: 36, d: 36, h: 52, tint: 0xf472b6 },
      { x: 55,   z: -200, w: 42, d: 40, h: 70, tint: 0x34d399 },
      { x: 55,   z: -80,  w: 38, d: 38, h: 48, tint: 0xfbbf24 },
      { x: 165,  z: -200, w: 44, d: 42, h: 64, tint: 0xa78bfa },
      { x: 165,  z: -80,  w: 36, d: 36, h: 42, tint: 0xf87171 },
      { x: -165, z: 40,   w: 44, d: 36, h: 42, tint: 0xef4444 },
      { x: -165, z: 150,  w: 38, d: 34, h: 36, tint: 0x3b82f6 },
      { x: -45,  z: 40,   w: 36, d: 36, h: 54, tint: 0x38bdf8 },
      { x: -45,  z: 150,  w: 38, d: 34, h: 44, tint: 0xa855f7 },
      { x: 55,   z: 150,  w: 40, d: 34, h: 48, tint: 0x22c55e },
      { x: 165,  z: 40,   w: 40, d: 38, h: 46, tint: 0xf59e0b },
      { x: 165,  z: 150,  w: 38, d: 36, h: 40, tint: 0xf43f5e },
      { x: 0,    z: -305, w: 52, d: 44, h: 118, tint: 0x38bdf8 },
      { x: -110, z: -305, w: 46, d: 42, h: 96,  tint: 0xfacc15 },
      { x: 110,  z: -305, w: 46, d: 42, h: 102, tint: 0xf472b6 }
    ];

    blockPlots.forEach((b, idx) => {
      const tex = idx % 2 === 0 ? TEXTURES.buildingGlass : TEXTURES.buildingWarm;
      const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.35, metalness: 0.25 });
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), mat);
      mesh.position.set(b.x, b.h / 2, b.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);

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

      const col = {
        minX: b.x - b.w / 2 - 1.5,
        maxX: b.x + b.w / 2 + 1.5,
        minZ: b.z - b.d / 2 - 1.5,
        maxZ: b.z + b.d / 2 + 1.5,
        height: b.h + 2
      };
      baseBuildingColliders.push(col);
      buildingColliders.push(col);
    });

    // 5. 3D Car-Soccer Stadium (X = 55, Z = 42)
    const pitchMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(76, 56),
      new THREE.MeshStandardMaterial({ map: TEXTURES.soccerPitch, roughness: 0.8 })
    );
    pitchMesh.rotation.x = -Math.PI / 2;
    pitchMesh.rotation.z = Math.PI / 2;
    pitchMesh.position.set(55, 0.08, 42);
    pitchMesh.receiveShadow = true;
    scene.add(pitchMesh);

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

    // 6. Rotating 3D Ferris Wheel on Beach Boardwalk
    const standMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.4, roughness: 0.3 });
    [-5, 5].forEach(oz => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 1.2, 34, 10), standMat);
      leg.position.set(120, 16, 235 + oz);
      leg.rotation.x = oz > 0 ? -0.18 : 0.18;
      scene.add(leg);
    });
    ferrisWheelGroup = new THREE.Group();
    ferrisWheelGroup.position.set(120, 31, 235);
    ferrisWheelGroup.add(new THREE.Mesh(new THREE.TorusGeometry(22, 0.8, 12, 36), new THREE.MeshBasicMaterial({ color: 0xf472b6 })));
    const gondolaColors = [0xef4444, 0xf59e0b, 0xeab308, 0x22c55e, 0x06b6d4, 0x3b82f6, 0xa855f7, 0xec4899];
    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2;
      const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 44, 6), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
      spoke.rotation.z = ang;
      ferrisWheelGroup.add(spoke);
      const cab = new THREE.Mesh(new THREE.SphereGeometry(2.2, 12, 12), new THREE.MeshStandardMaterial({ color: gondolaColors[i % gondolaColors.length], roughness: 0.3 }));
      cab.position.set(Math.cos(ang) * 22, Math.sin(ang) * 22, 0);
      ferrisWheelGroup.add(cab);
    }
    scene.add(ferrisWheelGroup);

    // 7. 12 Mega Stunt Ramps + Sky Rings
    const rampLocations = [
      { x: 0,    z: -75,  w: 12, l: 24, h: 6.5, dir: 'N' },
      { x: 0,    z: 35,   w: 12, l: 24, h: 6.0, dir: 'N' },
      { x: -110, z: -60,  w: 12, l: 22, h: 7.0, dir: 'N' },
      { x: -110, z: 185,  w: 14, l: 24, h: 7.5, dir: 'S' },
      { x: 110,  z: -60,  w: 12, l: 22, h: 7.0, dir: 'N' },
      { x: 110,  z: 170,  w: 14, l: 24, h: 8.0, dir: 'S' },
      { x: -55,  z: -20,  w: 12, l: 20, h: 6.5, dir: 'E' },
      { x: 55,   z: -20,  w: 12, l: 20, h: 6.5, dir: 'W' },
      { x: -55,  z: -140, w: 12, l: 22, h: 7.0, dir: 'E' },
      { x: 55,   z: -140, w: 12, l: 22, h: 7.0, dir: 'W' },
      { x: 220,  z: 30,   w: 16, l: 28, h: 9.5, dir: 'N' },
      { x: -220, z: 30,   w: 16, l: 28, h: 9.5, dir: 'S' }
    ];

    rampLocations.forEach(r => {
      const shape = new THREE.Shape();
      shape.moveTo(-r.l / 2, 0);
      shape.lineTo(r.l / 2, 0);
      shape.lineTo(r.l / 2, r.h);
      shape.closePath();

      const extrudeGeo = new THREE.ExtrudeGeometry(shape, { depth: r.w, bevelEnabled: false });
      extrudeGeo.center();
      const rampMesh = new THREE.Mesh(extrudeGeo, new THREE.MeshStandardMaterial({ map: TEXTURES.rampTex, roughness: 0.5 }));
      rampMesh.position.set(r.x, r.h / 2, r.z);
      if (r.dir === 'N') rampMesh.rotation.y = Math.PI / 2;
      else if (r.dir === 'S') rampMesh.rotation.y = -Math.PI / 2;
      else if (r.dir === 'W') rampMesh.rotation.y = Math.PI;
      rampMesh.castShadow = true;
      rampMesh.receiveShadow = true;
      scene.add(rampMesh);

      const skyRing = new THREE.Mesh(new THREE.TorusGeometry(6.5, 0.55, 12, 28), new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
      const offsetZ = r.dir === 'N' ? -18 : r.dir === 'S' ? 18 : 0;
      const offsetX = r.dir === 'E' ? 18 : r.dir === 'W' ? -18 : 0;
      skyRing.position.set(r.x + offsetX, r.h + 8, r.z + offsetZ);
      if (r.dir === 'E' || r.dir === 'W') skyRing.rotation.y = Math.PI / 2;
      scene.add(skyRing);
      ramps.push(r);
    });

    // 8. Knockable 3D Physics Props (Cones & Crates)
    const coneGeo = new THREE.ConeGeometry(0.85, 2.2, 10);
    const coneMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 });
    const crateGeo = new THREE.BoxGeometry(1.8, 1.8, 1.8);
    const crateMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });

    for (let i = 0; i < 80; i++) {
      const isCone = i % 3 !== 0;
      const mesh = new THREE.Mesh(isCone ? coneGeo : crateGeo, isCone ? coneMat : crateMat);
      const rx = roadXCoords[i % roadXCoords.length] + (i % 2 === 0 ? 10 : -10);
      const rz = -220 + (i * 5.6) % 420;
      mesh.position.set(rx, isCone ? 1.1 : 0.9, rz);
      mesh.castShadow = true;
      scene.add(mesh);
      physicsProps.push({ mesh, vx: 0, vy: 0, vz: 0, hitCooldown: 0, baseY: isCone ? 1.1 : 0.9 });
    }

    // 9. Fluffy 3D Sky Clouds
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 });
    for (let i = 0; i < 24; i++) {
      const cg = new THREE.Group();
      for (let j = 0; j < 4; j++) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(8 + Math.random() * 6, 10, 10), cloudMat);
        puff.position.set(j * 7 - 10, Math.random() * 3, (Math.random() - 0.5) * 6);
        puff.scale.y = 0.55;
        cg.add(puff);
      }
      cg.position.set((Math.random() - 0.5) * 900, 110 + Math.random() * 45, (Math.random() - 0.5) * 900);
      scene.add(cg);
      clouds.push(cg);
    }

    // 10. 3D Weather Particle Pool (Snowflakes / Raindrops)
    const flakeGeo = new THREE.BoxGeometry(0.45, 0.45, 0.45);
    const flakeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let i = 0; i < 220; i++) {
      const p = new THREE.Mesh(flakeGeo, flakeMat);
      p.position.set((Math.random() - 0.5) * 180, Math.random() * 75, (Math.random() - 0.5) * 180);
      p.visible = false;
      scene.add(p);
      weatherParticles.push(p);
    }
  }

  // --- REBUILD DYNAMIC HOMETOWN LAYER (OSM STREETS, BUILDINGS, SIGNS, FLORA & HORIZON) ---
  function rebuildHometownScenery(osmData = null) {
    // Clear previous dynamic children
    while (hometownDynamicGroup.children.length > 0) {
      const child = hometownDynamicGroup.children[0];
      hometownDynamicGroup.remove(child);
    }
    buildingColliders.length = 0;
    baseBuildingColliders.forEach(c => buildingColliders.push(c));

    // 1. Update Welcome Arch Signboards with Current City, State & ZIP
    if (welcomeSignMeshN) {
      welcomeSignMeshN.material.map = makeSignTexture(
        'DOWNTOWN ' + hometown.city.toUpperCase(),
        `ZIP ${hometown.zip} • ${hometown.biomeLabel.toUpperCase()}`,
        '#065f46'
      );
      welcomeSignMeshN.material.needsUpdate = true;
    }
    if (welcomeSignMeshS) {
      welcomeSignMeshS.material.map = makeSignTexture(
        'WELCOME TO ' + hometown.city.toUpperCase(),
        `${hometown.state.toUpperCase()} (${hometown.zip}) • ELEV ${hometown.elevMin}m-${hometown.elevMax}m`,
        '#065f46'
      );
      welcomeSignMeshS.material.needsUpdate = true;
    }

    // 2. Update Ground Terrain Material & Vertex Heights for Biome
    if (terrainMesh) {
      if (hometown.biome === 'desert') {
        terrainMesh.material.map = TEXTURES.desertSand;
        terrainReliefScale = 22;
      } else if (hometown.biome === 'alpine') {
        terrainMesh.material.map = TEXTURES.snowGround;
        terrainReliefScale = 34;
      } else {
        terrainMesh.material.map = TEXTURES.grass;
        terrainReliefScale = hometown.biome === 'coastal' ? 12 : 18;
      }
      terrainMesh.material.needsUpdate = true;
      rebuildTerrainVertices();
    }

    // 3. Place 3D Green Street Name Signs at Major Intersections Using Real OSM Street Names!
    const streetSignCoords = [
      { x: 15,   z: 58,   streetIdx: 0 },
      { x: -15,  z: -5,   streetIdx: 1 },
      { x: 15,   z: -115, streetIdx: 2 },
      { x: -95,  z: 58,   streetIdx: 3 },
      { x: 95,   z: 58,   streetIdx: 4 },
      { x: -95,  z: -115, streetIdx: 5 }
    ];
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.6 });
    streetSignCoords.forEach((sc, idx) => {
      const sName = (hometown.streets[idx % hometown.streets.length] || 'MAIN ST').toUpperCase();
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 7.5, 8), poleMat);
      post.position.set(sc.x, 3.75, sc.z);
      hometownDynamicGroup.add(post);

      const board = new THREE.Mesh(
        new THREE.BoxGeometry(8.5, 2.2, 0.35),
        new THREE.MeshBasicMaterial({ map: makeSignTexture(sName, `📍 ${hometown.city}`, '#047857') })
      );
      board.position.set(sc.x, 7.6, sc.z);
      hometownDynamicGroup.add(board);
    });

    // 4. Extrude Real OpenStreetMap Streets & Buildings if OSM JSON was returned!
    if (osmData && Array.isArray(osmData.elements)) {
      const nodes = new Map();
      osmData.elements.forEach(el => {
        if (el.type === 'node') nodes.set(el.id, el);
      });

      const metersPerDegLat = 111132;
      const metersPerDegLon = 111132 * Math.cos((hometown.lat * Math.PI) / 180);
      const osmRoadMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
      const osmBldgMat = new THREE.MeshStandardMaterial({
        map: TEXTURES.buildingWarm,
        roughness: 0.45,
        metalness: 0.2
      });

      let osmBuildingsAdded = 0;
      let osmStreetsAdded = 0;

      osmData.elements.forEach(el => {
        if (el.type !== 'way' || !Array.isArray(el.nodes) || !el.tags) return;
        const pts = [];
        el.nodes.forEach(nid => {
          const n = nodes.get(nid);
          if (n) {
            const x = (n.lon - hometown.lon) * metersPerDegLon * 1.35;
            const z = -(n.lat - hometown.lat) * metersPerDegLat * 1.35;
            pts.push({ x, z });
          }
        });
        if (pts.length < 2) return;

        // Real OpenStreetMap Building Footprints!
        if (el.tags.building && osmBuildingsAdded < 52) {
          let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
          pts.forEach(p => {
            if (p.x < minX) minX = p.x;
            if (p.x > maxX) maxX = p.x;
            if (p.z < minZ) minZ = p.z;
            if (p.z > maxZ) maxZ = p.z;
          });
          const cx = (minX + maxX) / 2;
          const cz = (minZ + maxZ) / 2;
          const bw = Math.max(8, Math.min(34, (maxX - minX) * 1.15));
          const bd = Math.max(8, Math.min(34, (maxZ - minZ) * 1.15));

          // Avoid blocking the main stunt boulevards or soccer pitch
          if (roadXCoords.some(rx => Math.abs(cx - rx) < 22)) return;
          if (roadZCoords.some(rz => Math.abs(cz - rz) < 22)) return;
          if (cx > 5 && cx < 105 && cz > 0 && cz < 85) return;
          if (Math.abs(cx) > 310 || Math.abs(cz) > 290) return;

          const levels = parseInt(el.tags['building:levels'], 10) || (2 + (osmBuildingsAdded % 6));
          const bh = Math.min(75, Math.max(12, levels * 5.5));
          const baseY = getTerrainHeightAt(cx, cz);

          const bMesh = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), osmBldgMat);
          bMesh.position.set(cx, baseY + bh / 2, cz);
          bMesh.castShadow = true;
          bMesh.receiveShadow = true;
          hometownDynamicGroup.add(bMesh);
          osmBuildingsAdded++;
        } else if (el.tags.highway && osmStreetsAdded < 40) {
          // Real OpenStreetMap Local Connector Streets!
          for (let i = 0; i < pts.length - 1; i++) {
            const p1 = pts[i], p2 = pts[i + 1];
            const segLen = Math.hypot(p2.x - p1.x, p2.z - p1.z);
            if (segLen < 4 || segLen > 180) continue;
            const mx = (p1.x + p2.x) / 2;
            const mz = (p1.z + p2.z) / 2;
            if (Math.abs(mx) > 310 || Math.abs(mz) > 280) continue;
            const seg = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.16, segLen), osmRoadMat);
            const h = getTerrainHeightAt(mx, mz);
            seg.position.set(mx, Math.max(0.02, h), mz);
            seg.rotation.y = Math.atan2(p2.x - p1.x, p2.z - p1.z);
            hometownDynamicGroup.add(seg);
          }
          osmStreetsAdded++;
        }
      });
    }

    // 5. Regional Horizon Mountains / Red Rock Canyon Mesas
    const isDesert = hometown.biome === 'desert';
    const isAlpine = hometown.biome === 'alpine';
    const mtnMat = new THREE.MeshStandardMaterial({
      color: isDesert ? 0xc2410c : isAlpine ? 0x475569 : 0x334155,
      roughness: 0.88
    });
    const capMat = new THREE.MeshStandardMaterial({
      color: isDesert ? 0xf59e0b : 0xf8fafc,
      roughness: 0.55
    });

    for (let i = 0; i < 26; i++) {
      const ang = (i / 26) * Math.PI * 2;
      const dist = 540 + (i % 3) * 55;
      const h = (isAlpine ? 145 : isDesert ? 95 : 105) + (i % 4) * 38;
      const mtn = new THREE.Group();

      if (isDesert) {
        // Flat-topped Red Rock Sedona Mesas / Buttes!
        const mesa = new THREE.Mesh(new THREE.CylinderGeometry(36, 78, h, 8), mtnMat);
        mesa.position.y = h / 2 - 2;
        const topLayer = new THREE.Mesh(new THREE.CylinderGeometry(30, 36, h * 0.22, 8), capMat);
        topLayer.position.y = h * 0.9 - 2;
        mtn.add(mesa, topLayer);
      } else {
        // Snow-Capped Mountain Peaks!
        const base = new THREE.Mesh(new THREE.ConeGeometry(85, h, 7), mtnMat);
        base.position.y = h / 2 - 2;
        const cap = new THREE.Mesh(new THREE.ConeGeometry(38, h * 0.44, 7), capMat);
        cap.position.y = h * 0.78 - 2;
        mtn.add(base, cap);
      }
      mtn.position.set(Math.cos(ang) * dist, 0, Math.sin(ang) * dist - 40);
      hometownDynamicGroup.add(mtn);
    }

    // 6. Regional Flora (Palm Trees for Coastal, Saguaro Cacti for Desert, Snow Pines for Alpine)
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const leafMat = new THREE.MeshStandardMaterial({
      color: isAlpine ? 0x065f46 : 0x16a34a,
      roughness: 0.7
    });
    const cactusMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.75 });
    const snowMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });

    for (let i = 0; i < 90; i++) {
      const tx = (Math.random() - 0.5) * 600;
      const tz = (Math.random() - 0.5) * 480;
      if (roadXCoords.some(rx => Math.abs(tx - rx) < 18)) continue;
      if (roadZCoords.some(rz => Math.abs(tz - rz) < 18)) continue;
      if (buildingColliders.some(b => tx > b.minX - 4 && tx < b.maxX + 4 && tz > b.minZ - 4 && tz < b.maxZ + 4)) continue;
      if (tx > 5 && tx < 105 && tz > 0 && tz < 85) continue;

      const ty = getTerrainHeightAt(tx, tz);
      const flora = new THREE.Group();

      if (isDesert) {
        // 3D Saguaro Cactus with Side Arms!
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.75, 8.5, 8), cactusMat);
        stem.position.y = 4.25;
        const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 3.2, 8), cactusMat);
        armL.position.set(-1.1, 5.2, 0);
        const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 2.8, 8), cactusMat);
        armR.position.set(1.1, 4.4, 0);
        flora.add(stem, armL, armR);
      } else if (hometown.biome === 'coastal') {
        // 3D Palm Tree with Curved Fronds!
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.75, 10.5, 8), trunkMat);
        trunk.position.y = 5.2;
        flora.add(trunk);
        for (let f = 0; f < 6; f++) {
          const frond = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.25, 4.8), leafMat);
          const fang = (f / 6) * Math.PI * 2;
          frond.position.set(Math.sin(fang) * 2.1, 10.4, Math.cos(fang) * 2.1);
          frond.rotation.y = fang;
          frond.rotation.x = 0.35;
          flora.add(frond);
        }
      } else {
        // Evergreen Pine Tree (Snow-Tipped in Alpine Biome!)
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.9, 6, 7), trunkMat);
        trunk.position.y = 3;
        const crown1 = new THREE.Mesh(new THREE.ConeGeometry(4.2, 8, 8), leafMat);
        crown1.position.y = 8;
        const crown2 = new THREE.Mesh(new THREE.ConeGeometry(3.1, 6.5, 8), isAlpine ? snowMat : leafMat);
        crown2.position.y = 11.5;
        flora.add(trunk, crown1, crown2);
      }

      flora.position.set(tx, ty, tz);
      hometownDynamicGroup.add(flora);
    }
  }

  // --- LIVE ZIP CODE GEOCODER + OPENSTREETMAP + ELEVATION TERRAIN FETCHER ---
  const FALLBACK_ZIPS = {
    '94040': { city: 'Mountain View', state: 'California', stateAbbr: 'CA', lat: 37.3855, lon: -122.088 },
    '10036': { city: 'New York', state: 'New York', stateAbbr: 'NY', lat: 40.759, lon: -73.989 },
    '81611': { city: 'Aspen', state: 'Colorado', stateAbbr: 'CO', lat: 39.1911, lon: -106.8175 },
    '86336': { city: 'Sedona', state: 'Arizona', stateAbbr: 'AZ', lat: 34.8697, lon: -111.761 },
    '33139': { city: 'Miami Beach', state: 'Florida', stateAbbr: 'FL', lat: 25.7907, lon: -80.13 },
    '90210': { city: 'Beverly Hills', state: 'California', stateAbbr: 'CA', lat: 34.0901, lon: -118.4065 },
    '98101': { city: 'Seattle', state: 'Washington', stateAbbr: 'WA', lat: 47.6101, lon: -122.3344 }
  };

  function classifyBiome(stateAbbr, elevMax, tempF) {
    if (['AZ', 'NM', 'NV'].includes(stateAbbr)) {
      return { biome: 'desert', label: 'Red Rock Desert' };
    }
    if (['CO', 'UT', 'WY', 'MT', 'ID', 'VT', 'NH', 'AK'].includes(stateAbbr) || elevMax > 1100 || tempF <= 34) {
      return { biome: 'alpine', label: 'Alpine Snow Peaks' };
    }
    if (['CA', 'FL', 'HI', 'SC', 'LA'].includes(stateAbbr)) {
      return { biome: 'coastal', label: 'Coastal Palm Bay' };
    }
    return { biome: 'metro', label: 'Highland Metro' };
  }

  async function loadZipCode(rawZip) {
    const cleanZip = String(rawZip || '').trim().slice(0, 5);
    const statusEl = document.getElementById('zipLoadStatus');
    if (!/^\d{5}$/.test(cleanZip)) {
      statusEl.textContent = '⚠️ Please enter a valid 5-digit US ZIP code (e.g. 94040 or 81611).';
      return;
    }

    statusEl.textContent = `⏳ Fetching OpenStreetMap streets, real elevation terrain & weather for ${cleanZip}...`;

    try {
      // 1. Resolve ZIP -> City, State, Lat, Lon via Zippopotam.us + Nominatim Town Center
      let place = FALLBACK_ZIPS[cleanZip] || null;
      try {
        const zRes = await fetch(`https://api.zippopotam.us/us/${cleanZip}`);
        if (zRes.ok) {
          const zJson = await zRes.json();
          if (zJson.places && zJson.places[0]) {
            const p = zJson.places[0];
            place = {
              city: p['place name'],
              state: p['state'],
              stateAbbr: p['state abbreviation'],
              lat: FALLBACK_ZIPS[cleanZip] ? FALLBACK_ZIPS[cleanZip].lat : parseFloat(p['latitude']),
              lon: FALLBACK_ZIPS[cleanZip] ? FALLBACK_ZIPS[cleanZip].lon : parseFloat(p['longitude'])
            };
            // Refine rural postal centroids to actual town center via Nominatim if not in preset cache
            if (!FALLBACK_ZIPS[cleanZip]) {
              try {
                const nomRes = await fetch(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(place.city)}&state=${encodeURIComponent(place.state)}&country=US&format=json&limit=1`);
                if (nomRes.ok) {
                  const nomJson = await nomRes.json();
                  if (nomJson && nomJson[0]) {
                    place.lat = parseFloat(nomJson[0].lat);
                    place.lon = parseFloat(nomJson[0].lon);
                  }
                }
              } catch (e) {}
            }
          }
        }
      } catch (e) {}

      if (!place) {
        statusEl.textContent = `⚠️ Could not find ZIP ${cleanZip}. Try 94040, 10036, 81611, 86336, or 33139!`;
        return;
      }

      hometown.zip = cleanZip;
      hometown.city = place.city;
      hometown.state = place.state;
      hometown.stateAbbr = place.stateAbbr;
      hometown.lat = place.lat;
      hometown.lon = place.lon;

      // 2. Build 7x7 Lat/Lon Grid for Real Open-Meteo Elevation Heightmap!
      const lats = [];
      const lons = [];
      for (let gz = -3; gz <= 3; gz++) {
        for (let gx = -3; gx <= 3; gx++) {
          lats.push((place.lat + gz * 0.004).toFixed(4));
          lons.push((place.lon + gx * 0.004).toFixed(4));
        }
      }

      const elevUrl = `https://api.open-meteo.com/v1/elevation?latitude=${lats.join(',')}&longitude=${lons.join(',')}`;
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${place.lat}&longitude=${place.lon}&current=temperature_2m,weather_code,is_day&temperature_unit=fahrenheit`;
      const osmBbox = `${(place.lon - 0.0015).toFixed(4)},${(place.lat - 0.0015).toFixed(4)},${(place.lon + 0.0015).toFixed(4)},${(place.lat + 0.0015).toFixed(4)}`;
      const osmUrl = `https://api.openstreetmap.org/api/0.6/map.json?bbox=${osmBbox}`;

      const [elevRes, weatherRes, osmRes] = await Promise.allSettled([
        fetch(elevUrl).then(r => r.ok ? r.json() : null),
        fetch(weatherUrl).then(r => r.ok ? r.json() : null),
        fetch(osmUrl).then(r => r.ok ? r.json() : null)
      ]);

      // Parse Real Elevation Grid
      if (elevRes.status === 'fulfilled' && elevRes.value && Array.isArray(elevRes.value.elevation)) {
        const arr = elevRes.value.elevation;
        const minE = Math.round(Math.min(...arr));
        const maxE = Math.round(Math.max(...arr));
        hometown.elevMin = minE;
        hometown.elevMax = maxE;
        const span = Math.max(8, maxE - minE);
        currentElevationGrid = arr.map(v => (v - minE) / span);
      }

      // Parse Live Weather
      weatherType = 'clear';
      if (weatherRes.status === 'fulfilled' && weatherRes.value && weatherRes.value.current) {
        const cur = weatherRes.value.current;
        hometown.tempF = Math.round(cur.temperature_2m);
        const wc = cur.weather_code;
        if (wc >= 71 && wc <= 86) {
          weatherType = 'snow';
          hometown.weatherDesc = '❄️ Snowing';
        } else if (wc >= 51 && wc <= 67) {
          weatherType = 'rain';
          hometown.weatherDesc = '🌧️ Raining';
        } else if (wc >= 1 && wc <= 3) {
          hometown.weatherDesc = '⛅ Partly Cloudy';
        } else {
          hometown.weatherDesc = '☀️ Clear Sky';
        }
      }

      const bInfo = classifyBiome(hometown.stateAbbr, hometown.elevMax, hometown.tempF);
      hometown.biome = bInfo.biome;
      hometown.biomeLabel = bInfo.label;
      if (hometown.biome === 'alpine' && weatherType === 'clear' && hometown.tempF < 45) {
        weatherType = 'snow';
        hometown.weatherDesc = '❄️ Alpine Snow';
      }

      // Parse Real OpenStreetMap Streets, Buildings & Named Landmarks
      let osmJson = null;
      if (osmRes.status === 'fulfilled' && osmRes.value && Array.isArray(osmRes.value.elements)) {
        osmJson = osmRes.value;
        const foundStreets = new Set();
        const foundLandmarks = new Set();

        osmJson.elements.forEach(el => {
          if (!el.tags || !el.tags.name) return;
          const name = el.tags.name.trim();
          if (el.tags.highway && name.length >= 3 && name.length <= 26) {
            foundStreets.add(name);
          } else if (
            (el.tags.leisure || el.tags.amenity || el.tags.shop || el.tags.tourism || el.tags.building) &&
            name.length >= 3 && name.length <= 28
          ) {
            foundLandmarks.add(name);
          }
        });

        if (foundStreets.size > 0) {
          hometown.streets = Array.from(foundStreets).slice(0, 10);
        } else {
          hometown.streets = [`${hometown.city} Blvd`, 'Main St', 'Oak Ave', 'Park Way', '1st Ave', 'Maple Dr'];
        }
        if (foundLandmarks.size > 0) {
          hometown.landmarks = Array.from(foundLandmarks).slice(0, 8);
        } else {
          hometown.landmarks = [`${hometown.city} Central Park`, `${hometown.city} Elementary`, `${hometown.city} Library`, `${hometown.city} Plaza`];
        }
      }

      // Rebuild 3D Terrain, OSM Buildings, Street Signs, Biome Trees & Missions!
      rebuildHometownScenery(osmJson);
      rebuildHometownMissions();

      // Update HUD & Modal Badges
      document.getElementById('hudZipCity').textContent = `📍 ${hometown.city}, ${hometown.stateAbbr} (${hometown.zip})`;
      document.getElementById('hudZipMeta').textContent = `⛰️ Elev: ${hometown.elevMin}m–${hometown.elevMax}m • ${hometown.weatherDesc} ${hometown.tempF}°F • ${hometown.biomeLabel}`;
      document.getElementById('zipBiomeBadge').textContent = `${hometown.biomeLabel} • ${hometown.tempF}°F`;
      statusEl.textContent = `✅ Built 3D ${hometown.city}, ${hometown.stateAbbr} (${hometown.zip})! Streets: ${hometown.streets.slice(0, 4).join(', ')}`;

      sfx.playFanfare();
      showStuntBanner(`📍 ${hometown.city.toUpperCase()}, ${hometown.stateAbbr}`, `3D OPENSTREETMAP & ${hometown.biomeLabel.toUpperCase()} LOADED!`);
    } catch (err) {
      statusEl.textContent = `✅ Loaded ${hometown.city}, ${hometown.stateAbbr} (${hometown.zip})!`;
    }
  }

  // --- 3D ARTICULATED VEHICLE BUILDER ---
  function createVehicleMesh(spec) {
    const root = new THREE.Group();
    const bodyGroup = new THREE.Group();
    root.add(bodyGroup);

    const wheels = [];
    let rotorMain = null;
    let rotorTail = null;
    const dinoLegs = [];

    const mainMat = new THREE.MeshStandardMaterial({ color: spec.color, roughness: 0.25, metalness: 0.45 });
    const accentMat = new THREE.MeshStandardMaterial({ color: spec.accent, roughness: 0.3, metalness: 0.3 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.85 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.7, roughness: 0.2 });

    if (spec.isDino) {
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

      [-1.42, 1.42].forEach(ex => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
        eye.position.set(ex, 7.2, 3.6);
        bodyGroup.add(eye);
      });

      const tail = new THREE.Mesh(new THREE.ConeGeometry(1.4, 6.5, 8), mainMat);
      tail.rotation.x = -Math.PI / 2.2;
      tail.position.set(0, 4.0, -5.2);
      bodyGroup.add(tail);

      [-1.4, 1.4].forEach(lx => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(1.2, 3.6, 1.8), mainMat);
        leg.position.set(lx, 1.8, 0);
        leg.castShadow = true;
        bodyGroup.add(leg);
        dinoLegs.push(leg);
      });
    } else if (spec.isFlying) {
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

      [-1.8, 1.8].forEach(sx => {
        const skid = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 7.5, 8), rimMat);
        skid.rotation.x = Math.PI / 2;
        skid.position.set(sx, 0.5, 0.5);
        bodyGroup.add(skid);
      });

      rotorMain = new THREE.Group();
      rotorMain.position.set(0, 4.8, 0);
      rotorMain.add(
        new THREE.Mesh(new THREE.BoxGeometry(13.5, 0.12, 0.7), wheelMat),
        new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.12, 13.5), wheelMat)
      );
      bodyGroup.add(rotorMain);

      rotorTail = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.8, 0.4), accentMat);
      rotorTail.position.set(0.65, 3.3, -9.2);
      bodyGroup.add(rotorTail);
    } else if (spec.isBoat) {
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

      const stripe = new THREE.Mesh(new THREE.BoxGeometry(chassisW + 0.1, 0.45, chassisL * 0.88), accentMat);
      stripe.position.set(0, liftY + chassisH * 0.45, 0);
      bodyGroup.add(stripe);

      const cabL = isTruck ? chassisL * 0.72 : chassisL * 0.52;
      const cabH = isTruck ? 1.8 : 1.25;
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(chassisW * 0.86, cabH, cabL), glassMat);
      cabin.position.set(0, liftY + chassisH + cabH / 2 - 0.1, isTruck ? 0.4 : -0.3);
      cabin.castShadow = true;
      bodyGroup.add(cabin);

      const roof = new THREE.Mesh(new THREE.BoxGeometry(chassisW * 0.82, 0.25, cabL * 0.88), mainMat);
      roof.position.set(0, liftY + chassisH + cabH, isTruck ? 0.4 : -0.3);
      bodyGroup.add(roof);

      if (spec.id === 'supercar') {
        const wing = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.22, 1.1), accentMat);
        wing.position.set(0, liftY + chassisH + 0.85, -chassisL / 2 + 0.5);
        bodyGroup.add(wing);
      } else if (spec.id === 'police' || spec.id === 'firetruck') {
        const barRed = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.45, 0.6), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
        barRed.position.set(-0.75, liftY + chassisH + cabH + 0.3, 0.4);
        const barBlue = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.45, 0.6), new THREE.MeshBasicMaterial({ color: 0x3b82f6 }));
        barBlue.position.set(0.75, liftY + chassisH + cabH + 0.3, 0.4);
        bodyGroup.add(barRed, barBlue);
        if (spec.id === 'firetruck') {
          const ladder = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 7.6), new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.4 }));
          ladder.position.set(0, liftY + chassisH + cabH + 0.55, -0.5);
          bodyGroup.add(ladder);
        }
      } else if (spec.id === 'icecream') {
        const cone = new THREE.Mesh(new THREE.ConeGeometry(0.95, 2.4, 12), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
        cone.rotation.x = Math.PI * 0.78;
        cone.position.set(0, liftY + chassisH + cabH + 1.1, 0.2);
        const scoop = new THREE.Mesh(new THREE.SphereGeometry(1.05, 14, 14), new THREE.MeshStandardMaterial({ color: 0xf472b6 }));
        scoop.position.set(0, liftY + chassisH + cabH + 2.1, 0.8);
        bodyGroup.add(cone, scoop);
      } else if (spec.id === 'pizza') {
        const pie = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, 0.35, 18), new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
        pie.position.set(0, liftY + chassisH + cabH + 0.35, -0.3);
        bodyGroup.add(pie);
      }

      const hlMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
      const tlMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      [-1.25, 1.25].forEach(lx => {
        const hl = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.45, 0.2), hlMat);
        hl.position.set(lx, liftY + 0.7, chassisL / 2 + 0.05);
        const tl = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.4, 0.2), tlMat);
        tl.position.set(lx, liftY + 0.75, -chassisL / 2 - 0.05);
        bodyGroup.add(hl, tl);
      });

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

  // --- INITIALIZE BASE WORLD, HOMETOWN SCENERY & VEHICLES ---
  buildBaseWorld();
  rebuildHometownScenery(null);

  const worldVehicles = [];
  const spawnPositions = [
    { x: 0,    z: 75,   h: Math.PI },
    { x: -110, z: 120,  h: Math.PI },
    { x: -110, z: 20,   h: 0 },
    { x: 220,  z: -15,  h: 0 },
    { x: 0,    z: 115,  h: Math.PI / 2 },
    { x: 110,  z: 20,   h: -Math.PI / 2 },
    { x: -55,  z: -200, h: 0, y: 94.5 },
    { x: 120,  z: 345,  h: 0 },
    { x: 110,  z: -120, h: Math.PI }
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

  // Giant 3D Bouncy Soccer Ball
  const soccerBallMesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.8, 2),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
  );
  soccerBallMesh.add(new THREE.Mesh(new THREE.IcosahedronGeometry(2.83, 1), new THREE.MeshBasicMaterial({ color: 0x111827, wireframe: true })));
  soccerBallMesh.castShadow = true;
  scene.add(soccerBallMesh);
  const soccerBall = { mesh: soccerBallMesh, x: 55, y: 2.8, z: 42, vx: 0, vy: 0, vz: 0 };

  // AI Traffic Cars
  const aiCars = [];
  const aiColors = [0x38bdf8, 0xa855f7, 0x22c55e, 0xfacc15, 0xf43f5e, 0xf97316];
  for (let i = 0; i < 14; i++) {
    const g = new THREE.Group();
    const b = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.5, 6.4), new THREE.MeshStandardMaterial({ color: aiColors[i % aiColors.length], roughness: 0.35 }));
    b.position.y = 1.3;
    b.castShadow = true;
    const t = new THREE.Mesh(new THREE.BoxGeometry(2.9, 1.1, 3.4), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2 }));
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

  // --- DYNAMIC HOMETOWN HERO MISSIONS ---
  let MISSIONS = [];
  let missionIdx = 0;

  const beaconGroup = new THREE.Group();
  const beaconCylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(7, 7, 65, 24, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.28, side: THREE.DoubleSide })
  );
  beaconCylinder.position.y = 32.5;
  const beaconRing = new THREE.Mesh(new THREE.TorusGeometry(7.2, 0.5, 12, 32), new THREE.MeshBasicMaterial({ color: 0xfde047 }));
  beaconRing.rotation.x = Math.PI / 2;
  beaconRing.position.y = 0.6;

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

  function rebuildHometownMissions() {
    const st0 = hometown.streets[0] || 'Main St';
    const st1 = hometown.streets[1] || 'Central Ave';
    const lm0 = hometown.landmarks[0] || `${hometown.city} Park`;
    const lm1 = hometown.landmarks[1] || `${hometown.city} School`;

    MISSIONS = [
      {
        title: `🔥 Fire Rescue on ${st0}!`,
        desc: `Drive to ${st0} in ${hometown.city} or spray the blaze with Fire Engine [3] Water Cannon [Z]!`,
        x: -110,
        z: -20,
        type: 'fire'
      },
      {
        title: `🍕 Hot Pizza Rush to ${lm0}!`,
        desc: `Deliver fresh pizzas to ${lm0} (press [6] for Rocket Pizza Buggy or race to the Marina)!`,
        x: 120,
        z: 270,
        type: 'delivery'
      },
      {
        title: `🚁 Sky-High Rooftop Rescue at ${hometown.city} Tower!`,
        desc: `Press [7] for the Sky-Hawk Helicopter to land on the ${hometown.city} Skyscraper Helipad!`,
        x: -55,
        z: -200,
        y: 94,
        type: 'rooftop'
      },
      {
        title: `🍦 Ice Cream Party at ${lm1}!`,
        desc: `Serve rainbow cones along ${st1} near ${lm1} (press [5] for Ice Cream Van)!`,
        x: 0,
        z: 42,
        type: 'icecream'
      },
      {
        title: `🌉 ${hometown.city} Bridge Stunt Sprint!`,
        desc: `Blast across the Golden Suspension Bridge in ${hometown.city} (${hometown.zip}) at full turbo!`,
        x: -110,
        z: 330,
        type: 'bridge'
      }
    ];
    missionIdx = missionIdx % MISSIONS.length;
    syncMissionUI();
  }

  function syncMissionUI() {
    const m = MISSIONS[missionIdx];
    document.getElementById('missionTag').textContent = `🌟 ${hometown.city.toUpperCase()} (${hometown.zip}) HERO MISSION`;
    document.getElementById('missionTitle').textContent = m.title;
    document.getElementById('missionDesc').textContent = m.desc;
    beaconGroup.position.set(m.x, m.y || 0, m.z);
    fireGroup.visible = m.type === 'fire';
  }
  rebuildHometownMissions();

  // --- PLAYER STATE & CONTROLS ---
  const leo = createLeoCharacter();
  let activeVehicle = worldVehicles[0];
  let gameStarted = false;
  let score = 0;
  let stars = 0;
  let nitro = 100;
  let cameraMode = 0;
  const CAM_NAMES = ['🎥 Cam: Chase (C)', '🎥 Cam: Close (C)', '🎥 Cam: Aerial (C)'];

  const keys = {};
  const zipInputEl = document.getElementById('zipInput');

  window.addEventListener('keydown', e => {
    // Do not intercept driving keys while typing a ZIP code in the input field!
    if (document.activeElement === zipInputEl) {
      if (e.code === 'Enter') {
        loadZipCode(zipInputEl.value);
      }
      return;
    }

    keys[e.code] = true;
    if (!gameStarted && (e.code === 'Enter' || e.code === 'Space')) {
      startGame();
      return;
    }
    if (e.code === 'KeyP') openZipCustomizer();
    if (e.code === 'KeyC') cycleCamera();
    if (e.code === 'KeyT') cycleTimeOfDay();
    if (e.code === 'KeyM') toggleMute();
    if (e.code === 'KeyE' || e.code === 'Enter') toggleEnterExitVehicle();
    if (e.code === 'KeyZ' || e.code === 'KeyF') triggerVehicleGadget();

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

  // --- MOBILE & TABLET MULTI-TOUCH CONTROLS ---
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.classList.add('touch-enabled');
  }

  document.querySelectorAll('#touchControls .t-btn[data-key]').forEach(btn => {
    const code = btn.getAttribute('data-key');
    const press = e => {
      e.preventDefault();
      sfx.init();
      keys[code] = true;
      btn.classList.add('pressed');
      if (code === 'KeyZ') triggerVehicleGadget();
    };
    const release = e => {
      e.preventDefault();
      keys[code] = false;
      btn.classList.remove('pressed');
    };
    btn.addEventListener('touchstart', press, { passive: false });
    btn.addEventListener('touchend', release, { passive: false });
    btn.addEventListener('touchcancel', release, { passive: false });
    btn.addEventListener('mousedown', press);
    btn.addEventListener('mouseup', release);
    btn.addEventListener('mouseleave', release);
  });

  const touchExitBtn = document.getElementById('touchExitBtn');
  if (touchExitBtn) {
    const onHop = e => {
      e.preventDefault();
      sfx.init();
      toggleEnterExitVehicle();
    };
    touchExitBtn.addEventListener('touchstart', onHop, { passive: false });
    touchExitBtn.addEventListener('click', onHop);
  }

  // Wire up ZIP Code UI Buttons & Preset Chips
  document.getElementById('loadZipBtn').addEventListener('click', () => {
    sfx.init();
    loadZipCode(zipInputEl.value);
  });
  document.querySelectorAll('.preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      sfx.init();
      const z = chip.getAttribute('data-zip');
      zipInputEl.value = z;
      loadZipCode(z);
    });
  });

  function openZipCustomizer() {
    document.getElementById('titleOverlay').style.display = 'flex';
    zipInputEl.focus();
    zipInputEl.select();
  }
  document.getElementById('btnZip').addEventListener('click', openZipCustomizer);
  document.getElementById('zipHudCard').addEventListener('click', openZipCustomizer);

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
    bannerTimeout = setTimeout(() => banner.classList.remove('active'), 2200);
  }

  function addScore(pts) {
    score += pts;
    document.getElementById('scoreVal').textContent = score.toLocaleString() + ' PTS';
  }

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
      sfx.playSplash();
      for (let i = 0; i < 14; i++) {
        const drop = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 8), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
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
      if (activeVehicle.y <= getTerrainHeightAt(activeVehicle.x, activeVehicle.z) + 1.0) {
        activeVehicle.vy = 26;
        sfx.playJump();
        showStuntBanner('🛻 HYDRAULIC MEGA-HOP!', '+150 STUNT PTS');
        addScore(150);
      }
    } else if (id === 'trex') {
      sfx.playRoar();
      showStuntBanner('🦖 T-REX MEGA ROAR!!', '+200 DINO POWER');
      addScore(200);
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
      projectiles.push({ mesh: proj, vx: fwdX * 55, vy: 10, vz: fwdZ * 55, life: 1.4 });
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

  // Support URL parameters ?zip=81611&autostart=1
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('zip')) {
    const qZip = urlParams.get('zip');
    zipInputEl.value = qZip;
    loadZipCode(qZip);
  } else {
    loadZipCode('94040');
  }
  if (urlParams.get('autostart') === '1') {
    startGame();
  }

  const confettiList = [];
  function spawnConfetti(x, y, z) {
    const colors = [0xfacc15, 0x38bdf8, 0xf43f5e, 0x4ade80, 0xa855f7];
    for (let i = 0; i < 36; i++) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), new THREE.MeshBasicMaterial({ color: colors[i % colors.length] }));
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
    if (ferrisWheelGroup) ferrisWheelGroup.rotation.z += dt * 0.35;
    clouds.forEach(c => {
      c.position.x += dt * 4.5;
      if (c.position.x > 480) c.position.x = -480;
    });
    beaconRing.scale.setScalar(1 + Math.sin(performance.now() * 0.006) * 0.14);

    const playerObj = activeVehicle || leo;

    // Animate 3D Weather Particles (Snow / Rain) around camera/player
    weatherParticles.forEach(wp => {
      if (weatherType === 'clear') {
        wp.visible = false;
        return;
      }
      wp.visible = true;
      const isSnow = weatherType === 'snow';
      wp.scale.set(1, isSnow ? 1 : 4.5, 1);
      wp.position.y -= (isSnow ? 14 : 52) * dt;
      if (isSnow) wp.position.x += Math.sin(performance.now() * 0.002 + wp.position.z) * 3 * dt;
      if (wp.position.y < 0) {
        wp.position.set(
          playerObj.x + (Math.random() - 0.5) * 160,
          55 + Math.random() * 35,
          playerObj.z + (Math.random() - 0.5) * 160
        );
      }
    });

    if (!gameStarted || document.getElementById('titleOverlay').style.display !== 'none') {
      if (!gameStarted) {
        titleOrbitAngle += dt * 0.22;
        camera.position.set(
          Math.sin(titleOrbitAngle) * 145,
          58 + Math.sin(titleOrbitAngle * 2) * 12,
          Math.cos(titleOrbitAngle) * 145 - 40
        );
        camera.lookAt(0, 18, -40);
      }
      return;
    }

    const throttle = (keys['KeyW'] || keys['ArrowUp'] ? 1 : 0) - (keys['KeyS'] || keys['ArrowDown'] ? 1 : 0);
    const steer = (keys['KeyA'] || keys['ArrowLeft'] ? 1 : 0) - (keys['KeyD'] || keys['ArrowRight'] ? 1 : 0);
    const boostPressed = keys['Space'] || keys['ShiftLeft'] || keys['ShiftRight'];

    if (activeVehicle) {
      const v = activeVehicle;
      const spec = v.spec;

      if (spec.id === 'firetruck' && (keys['KeyZ'] || keys['KeyF']) && Math.random() < 0.45) {
        triggerVehicleGadget();
      }

      if (spec.isFlying) {
        v.heading += steer * spec.turnRate * dt;
        const targetSpeed = throttle * spec.maxSpeed;
        v.speed += (targetSpeed - v.speed) * 3.5 * dt;
        if (boostPressed) v.y = Math.min(155, v.y + 32 * dt);
        else if (keys['KeyZ'] || keys['KeyF']) v.y = Math.max(getTerrainHeightAt(v.x, v.z), v.y - 32 * dt);

        v.x += Math.sin(v.heading) * v.speed * dt;
        v.z += Math.cos(v.heading) * v.speed * dt;

        v.bodyGroup.rotation.x = (v.speed / spec.maxSpeed) * 0.26;
        v.bodyGroup.rotation.z = -steer * 0.28;
        if (v.rotorMain) v.rotorMain.rotation.y += dt * 28;
        if (v.rotorTail) v.rotorTail.rotation.x += dt * 32;
      } else {
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
          v.speed *= Math.pow(0.22, dt);
        }
        v.speed = Math.max(-maxSpd * 0.45, Math.min(maxSpd, v.speed));

        const turnFactor = Math.abs(v.speed) > 2 ? Math.sign(v.speed) : 1;
        v.steerAngle = steer * 0.45;
        if (Math.abs(v.speed) > 0.8) {
          v.heading += steer * spec.turnRate * turnFactor * dt;
        }

        const nextX = v.x + Math.sin(v.heading) * v.speed * dt;
        const nextZ = v.z + Math.cos(v.heading) * v.speed * dt;

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
          v.x = Math.max(-340, Math.min(340, nextX));
          v.z = Math.max(-340, Math.min(430, nextZ));
        }

        // Ground Elevation from Real 3D Terrain + Rooftops + Stunt Ramps
        let groundHeight = getTerrainHeightAt(v.x, v.z);
        for (let i = 0; i < buildingColliders.length; i++) {
          const b = buildingColliders[i];
          if (v.x > b.minX && v.x < b.maxX && v.z > b.minZ && v.z < b.maxZ && v.y >= b.height - 3) {
            groundHeight = Math.max(groundHeight, b.height);
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

            if (t > 0.78 && Math.abs(v.speed) > 32 && v.vy <= 2) {
              const jumpMult = spec.id === 'monster' ? 1.45 : 1.0;
              v.vy = Math.abs(v.speed) * 0.44 * jumpMult;
              sfx.playJump();
            }
          }
        }

        if (v.y > groundHeight + 0.15 || v.vy > 0) {
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

        const targetRoll = steer * Math.min(1, Math.abs(v.speed) / 40) * 0.14;
        const targetPitch = v.y > groundHeight + 0.5 ? -v.vy * 0.018 : -throttle * 0.05;
        v.bodyGroup.rotation.z += (targetRoll - v.bodyGroup.rotation.z) * 10 * dt;
        v.bodyGroup.rotation.x += (targetPitch - v.bodyGroup.rotation.x) * 10 * dt;

        v.wheels.forEach(w => {
          w.tire.rotation.x += v.speed * dt * 0.8;
          if (w.front) w.group.rotation.y = v.steerAngle;
        });

        if (spec.isDino && v.dinoLegs.length === 2) {
          const walkCycle = Math.sin(performance.now() * 0.015) * Math.min(1, Math.abs(v.speed) / 20);
          v.dinoLegs[0].rotation.x = walkCycle * 0.6;
          v.dinoLegs[1].rotation.x = -walkCycle * 0.6;
        }
      }

      v.root.position.set(v.x, v.y, v.z);
      v.root.rotation.y = v.heading;
      sfx.updateSpecialAudio(dt, spec.id, v.speed);

      const mph = Math.round(Math.abs(v.speed) * 1.6);
      document.getElementById('speedVal').textContent = mph;
      document.getElementById('nitroFill').style.width = nitro + '%';
      document.getElementById('interactPrompt').style.display = 'none';
    } else {
      leo.heading += steer * 3.2 * dt;
      leo.speed = throttle * 24;
      leo.x += Math.sin(leo.heading) * leo.speed * dt;
      leo.z += Math.cos(leo.heading) * leo.speed * dt;
      const gH = getTerrainHeightAt(leo.x, leo.z);
      if (leo.y > gH || leo.vy > 0) {
        leo.y += leo.vy * dt;
        leo.vy -= 42 * dt;
        if (leo.y < gH) {
          leo.y = gH;
          leo.vy = 0;
        }
      } else {
        leo.y = gH;
      }
      const swing = Math.sin(performance.now() * 0.018) * (Math.abs(leo.speed) > 1 ? 0.6 : 0);
      leo.legL.rotation.x = swing;
      leo.legR.rotation.x = -swing;
      leo.group.position.set(leo.x, leo.y, leo.z);
      leo.group.rotation.y = leo.heading;

      document.getElementById('speedVal').textContent = Math.round(Math.abs(leo.speed));

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

    if (Math.abs(soccerBall.z - 42) < 9 && (Math.abs(soccerBall.x - 17) < 4.5 || Math.abs(soccerBall.x - 93) < 4.5)) {
      addScore(1000);
      stars += 1;
      document.getElementById('starsVal').textContent = `⭐ ${stars} HERO BADGES`;
      showStuntBanner('⚽ GOOOOOOAL!!', `+1,000 ${hometown.city.toUpperCase()} STADIUM BONUS!`);
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

    // --- WATER CANNON DROPS, PROJECTILES & CONFETTI ---
    for (let i = waterDrops.length - 1; i >= 0; i--) {
      const w = waterDrops[i];
      w.life -= dt;
      w.mesh.position.x += w.vx * dt;
      w.mesh.position.y += w.vy * dt;
      w.mesh.position.z += w.vz * dt;
      w.vy -= 30 * dt;

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

    aiCars.forEach(ai => {
      ai.z += ai.dir * ai.speed * dt;
      if (ai.z > 220) ai.z = -260;
      if (ai.z < -260) ai.z = 220;
      ai.group.position.z = ai.z;
    });

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

    drawMinimap(playerObj, curM);
  }

  function completeCurrentMission() {
    addScore(1500);
    stars += 1;
    document.getElementById('starsVal').textContent = `⭐ ${stars} HERO BADGES`;
    const m = MISSIONS[missionIdx];
    showStuntBanner(`🌟 ${hometown.city.toUpperCase()} HERO!`, '+1,500 PTS & HERO BADGE!');
    sfx.playFanfare();
    spawnConfetti(m.x, m.y || 2, m.z);
    missionIdx = (missionIdx + 1) % MISSIONS.length;
    syncMissionUI();
  }

  function drawMinimap(playerObj, mission) {
    const ctx = minimapCtx;
    const w = 172, h = 172, cx = w / 2, cy = h / 2;
    ctx.clearRect(0, 0, w, h);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(playerObj.heading - Math.PI);
    const scale = 0.25;

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.lineWidth = 4;
    roadXCoords.forEach(rx => {
      const x = (rx - playerObj.x) * scale;
      ctx.beginPath();
      ctx.moveTo(x, (-300 - playerObj.z) * scale);
      ctx.lineTo(x, (350 - playerObj.z) * scale);
      ctx.stroke();
    });
    roadZCoords.forEach(rz => {
      const z = (rz - playerObj.z) * scale;
      ctx.beginPath();
      ctx.moveTo((-300 - playerObj.x) * scale, z);
      ctx.lineTo((300 - playerObj.x) * scale, z);
      ctx.stroke();
    });

    worldVehicles.forEach(v => {
      if (v === activeVehicle) return;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc((v.x - playerObj.x) * scale, (v.z - playerObj.z) * scale, 3.2, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc((mission.x - playerObj.x) * scale, (mission.z - playerObj.z) * scale, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

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
