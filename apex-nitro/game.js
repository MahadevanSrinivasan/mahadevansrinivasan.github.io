// ============================================================================
// APEX NITRO 3D — NEED FOR SPEED STYLE STREET & CANYON RACING (Three.js + Bloom)
// Features: Sculpted Extruded Supercars, UnrealBloomPass, Continuous 3D Spline
// Tracks, 3D Tuner Garage, Arcade Drift & N2O Physics, AI Rivals & Hot Pursuit
// ============================================================================

(() => {
  'use strict';

  // --- CAR, CUSTOMIZATION, TRACK & MODE CATALOGS ---
  const CAR_SPECS = [
    {
      id: 'vortex',
      name: 'Vortex GT-R',
      cls: 'JDM TWIN-TURBO',
      rating: 'S-890',
      topSpeed: 90,
      accel: 54,
      handling: 90,
      driftGrip: 0.92,
      maxSpdPhys: 102,
      len: 4.7,
      wid: 2.02,
      noseH: 0.34,
      roofH: 1.24,
      roofPeakX: -0.2,
      hoodScoop: false,
      midEngineVents: false,
      defaultPaint: 0x00d4ff,
      defaultGlow: 0x00f0ff,
      defaultWing: 'gt'
    },
    {
      id: 'diablo',
      name: 'Diablo V12',
      cls: 'ITALIAN HYPERCAR',
      rating: 'X-950',
      topSpeed: 98,
      accel: 58,
      handling: 84,
      driftGrip: 0.88,
      maxSpdPhys: 112,
      len: 4.85,
      wid: 2.12,
      noseH: 0.24,
      roofH: 1.12,
      roofPeakX: 0.15,
      hoodScoop: false,
      midEngineVents: true,
      defaultPaint: 0xff2a85,
      defaultGlow: 0xff2a85,
      defaultWing: 'gt'
    },
    {
      id: 'titan',
      name: 'Titan GT500',
      cls: 'WIDEBODY MUSCLE',
      rating: 'A-840',
      topSpeed: 88,
      accel: 64,
      handling: 78,
      driftGrip: 0.85,
      maxSpdPhys: 100,
      len: 4.9,
      wid: 2.1,
      noseH: 0.44,
      roofH: 1.32,
      roofPeakX: -0.35,
      hoodScoop: true,
      midEngineVents: false,
      defaultPaint: 0xff6b00,
      defaultGlow: 0xff8800,
      defaultWing: 'ducktail'
    },
    {
      id: 'phantom',
      name: 'Phantom RS',
      cls: 'EURO TRACK COUPE',
      rating: 'S-910',
      topSpeed: 91,
      accel: 56,
      handling: 96,
      driftGrip: 0.95,
      maxSpdPhys: 104,
      len: 4.6,
      wid: 1.98,
      noseH: 0.3,
      roofH: 1.22,
      roofPeakX: -0.1,
      hoodScoop: false,
      midEngineVents: true,
      defaultPaint: 0x4ade80,
      defaultGlow: 0x22c55e,
      defaultWing: 'gt'
    },
    {
      id: 'valkyrie',
      name: 'Cyber Valkyrie',
      cls: 'AERO PROTOTYPE',
      rating: 'X-980',
      topSpeed: 99,
      accel: 62,
      handling: 94,
      driftGrip: 0.93,
      maxSpdPhys: 114,
      len: 4.95,
      wid: 2.14,
      noseH: 0.22,
      roofH: 1.14,
      roofPeakX: 0.2,
      hoodScoop: false,
      midEngineVents: true,
      defaultPaint: 0xa855f7,
      defaultGlow: 0xa855f7,
      defaultWing: 'twin'
    },
    {
      id: 'interceptor',
      name: 'Interceptor X',
      cls: 'PURSUIT SPEC',
      rating: 'S-940',
      topSpeed: 95,
      accel: 60,
      handling: 89,
      driftGrip: 0.91,
      maxSpdPhys: 108,
      len: 4.8,
      wid: 2.08,
      noseH: 0.34,
      roofH: 1.25,
      roofPeakX: -0.15,
      hoodScoop: true,
      midEngineVents: false,
      defaultPaint: 0x111827,
      defaultGlow: 0x38bdf8,
      defaultWing: 'twin'
    }
  ];

  const PAINT_SWATCHES = [
    { name: 'Crimson Metallic', hex: 0xe11d48, css: '#e11d48' },
    { name: 'Electric Cyan', hex: 0x00d4ff, css: '#00d4ff' },
    { name: 'Hot Magenta', hex: 0xff2a85, css: '#ff2a85' },
    { name: 'Acid Lime', hex: 0x4ade80, css: '#4ade80' },
    { name: 'Solar Gold', hex: 0xfacc15, css: '#facc15' },
    { name: 'Midnight Violet', hex: 0x9333ea, css: '#9333ea' },
    { name: 'Sunset Orange', hex: 0xff6b00, css: '#ff6b00' },
    { name: 'Stealth Onyx', hex: 0x181c28, css: '#181c28' },
    { name: 'Pearl White', hex: 0xf1f5f9, css: '#f1f5f9' }
  ];

  const GLOW_SWATCHES = [
    { name: 'Cyan', hex: 0x00f0ff, css: '#00f0ff' },
    { name: 'Magenta', hex: 0xff2a85, css: '#ff2a85' },
    { name: 'Neon Green', hex: 0x22c55e, css: '#22c55e' },
    { name: 'Hot Orange', hex: 0xff7b00, css: '#ff7b00' },
    { name: 'Ultraviolet', hex: 0xa855f7, css: '#a855f7' },
    { name: 'Off', hex: 0x000000, css: '#1e293b' }
  ];

  const WING_STYLES = [
    { id: 'gt', label: 'GT Pro Wing' },
    { id: 'ducktail', label: 'Street Ducktail' },
    { id: 'twin', label: 'Cyber Twin-Fin' },
    { id: 'none', label: 'Clean Stock' }
  ];

  const TRACK_SPECS = [
    {
      id: 'tokyo',
      name: '🌃 Tokyo Neon Underground',
      desc: 'Wet-reflection asphalt, neon towers & light-tunnels',
      sky: 0x050918,
      fogColor: 0x070d22,
      fogDensity: 0.0014,
      ambient: 0x4b6399,
      ambientInt: 0.85,
      sunColor: 0x80b5ff,
      sunInt: 0.95,
      roadRoughness: 0.22,
      roadMetalness: 0.28,
      barrierTrim: 0x00f0ff,
      chevronColor: 0x00f0ff,
      envType: 'tokyo',
      waypoints: [
        [0, 0, 0],
        [0, 0, -240],
        [45, 2, -460],
        [200, 6, -610],
        [440, 12, -620],
        [660, 16, -500],
        [740, 10, -290],
        [620, 4, -120],
        [470, 0, -30],
        [460, 0, 140],
        [630, 8, 280],
        [670, 14, 490],
        [520, 10, 640],
        [280, 4, 640],
        [150, 0, 520],
        [70, 0, 390],
        [-50, 2, 390],
        [-210, 6, 470],
        [-410, 12, 450],
        [-560, 14, 260],
        [-530, 8, 40],
        [-360, 2, -90],
        [-220, 0, 50],
        [-90, 0, 195],
        [0, 0, 165]
      ]
    },
    {
      id: 'canyon',
      name: '🌅 Pacific Sunset Canyon',
      desc: 'Golden coastal cliffs, ocean bridge, palms & rock tunnels',
      sky: 0xfb7b50,
      fogColor: 0xf4845f,
      fogDensity: 0.00085,
      ambient: 0xffd4b8,
      ambientInt: 0.95,
      sunColor: 0xffd166,
      sunInt: 1.45,
      roadRoughness: 0.45,
      roadMetalness: 0.12,
      barrierTrim: 0xffaa00,
      chevronColor: 0xff4500,
      envType: 'canyon',
      waypoints: [
        [0, 0, 0],
        [0, 0, -250],
        [80, 8, -480],
        [280, 18, -590],
        [520, 24, -520],
        [690, 18, -320],
        [660, 8, -110],
        [510, 2, 40],
        [580, 0, 240],
        [610, 0, 460],
        [410, 4, 620],
        [170, 8, 560],
        [-30, 6, 420],
        [-220, 12, 510],
        [-450, 18, 490],
        [-610, 14, 310],
        [-560, 6, 100],
        [-360, 0, 20],
        [-240, 0, 140],
        [-80, 0, 210]
      ]
    },
    {
      id: 'alpine',
      name: '🏔️ Alpine Horizon Speedway',
      desc: 'Crisp daylight high-speed chicanes, pines & snow peaks',
      sky: 0x38bdf8,
      fogColor: 0x93c5fd,
      fogDensity: 0.00062,
      ambient: 0xdbeafe,
      ambientInt: 1.0,
      sunColor: 0xfffbeb,
      sunInt: 1.5,
      roadRoughness: 0.42,
      roadMetalness: 0.08,
      barrierTrim: 0x38bdf8,
      chevronColor: 0xfacc15,
      envType: 'alpine',
      waypoints: [
        [0, 0, 0],
        [0, 0, -270],
        [110, 6, -500],
        [340, 16, -610],
        [580, 26, -540],
        [760, 22, -320],
        [720, 12, -90],
        [500, 4, 20],
        [470, 0, 210],
        [620, 6, 400],
        [490, 10, 600],
        [240, 4, 600],
        [60, 0, 420],
        [-110, 0, 450],
        [-320, 8, 520],
        [-540, 14, 390],
        [-580, 10, 150],
        [-400, 2, -20],
        [-210, 0, 50],
        [-80, 0, 220]
      ]
    }
  ];

  const MODE_SPECS = [
    { id: 'race', name: '🏁 Underground Circuit', desc: '3 Laps vs. 5 AI Rivals — Claim P1!', laps: 3 },
    { id: 'drift', name: '💨 Drift Touge Showdown', desc: '2 Laps — Rack up massive Drift Combos!', laps: 2 },
    { id: 'pursuit', name: '🚓 Hot Pursuit Escape', desc: '2 Laps — Outrun 3 AI Interceptors on Heat 3!', laps: 2 }
  ];

  // --- PROCEDURAL WEB AUDIO ENGINE (RPM ENGINE + TURBO + DRIFT TIRE + N2O + SYNTH) ---
  class AudioEngine {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.osc1 = null;
      this.osc2 = null;
      this.engFilter = null;
      this.engGain = null;
      this.screechGain = null;
      this.screechFilter = null;
      this.nosGain = null;
      this.running = false;
      this.synthBeatTimer = 0;
      this.synthStep = 0;
    }

    init() {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        this.ctx = new AC();

        // Dual Engine Oscillators -> Warm Lowpass -> Master Gain
        this.engFilter = this.ctx.createBiquadFilter();
        this.engFilter.type = 'lowpass';
        this.engFilter.frequency.value = 320;
        this.engFilter.Q.value = 3.2;

        this.engGain = this.ctx.createGain();
        this.engGain.gain.value = 0.0;

        this.osc1 = this.ctx.createOscillator();
        this.osc1.type = 'sawtooth';
        this.osc1.frequency.value = 65;

        this.osc2 = this.ctx.createOscillator();
        this.osc2.type = 'triangle';
        this.osc2.frequency.value = 130;

        this.osc1.connect(this.engFilter);
        this.osc2.connect(this.engFilter);
        this.engFilter.connect(this.engGain);
        this.engGain.connect(this.ctx.destination);
        this.osc1.start();
        this.osc2.start();

        // White noise buffer for Drift Tire Squeal & N2O Jet Roar
        const bufSize = this.ctx.sampleRate * 2;
        const noiseBuf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
        const data = noiseBuf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

        const screechSrc = this.ctx.createBufferSource();
        screechSrc.buffer = noiseBuf;
        screechSrc.loop = true;
        this.screechFilter = this.ctx.createBiquadFilter();
        this.screechFilter.type = 'bandpass';
        this.screechFilter.frequency.value = 1350;
        this.screechFilter.Q.value = 7.5;
        this.screechGain = this.ctx.createGain();
        this.screechGain.gain.value = 0;
        screechSrc.connect(this.screechFilter);
        this.screechFilter.connect(this.screechGain);
        this.screechGain.connect(this.ctx.destination);
        screechSrc.start();

        const nosSrc = this.ctx.createBufferSource();
        nosSrc.buffer = noiseBuf;
        nosSrc.loop = true;
        const nosFilter = this.ctx.createBiquadFilter();
        nosFilter.type = 'lowpass';
        nosFilter.frequency.value = 540;
        this.nosGain = this.ctx.createGain();
        this.nosGain.gain.value = 0;
        nosSrc.connect(nosFilter);
        nosFilter.connect(this.nosGain);
        this.nosGain.connect(this.ctx.destination);
        nosSrc.start();
        this.running = true;
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    updateDrive(dt, active, rpmNorm, drifting, nosActive) {
      if (!this.running || !this.ctx) return;
      const now = this.ctx.currentTime;
      if (this.muted || !active) {
        this.engGain.gain.setTargetAtTime(0, now, 0.08);
        this.screechGain.gain.setTargetAtTime(0, now, 0.06);
        this.nosGain.gain.setTargetAtTime(0, now, 0.08);
        return;
      }

      const baseFreq = 48 + rpmNorm * 135 + (nosActive ? 28 : 0);
      this.osc1.frequency.setTargetAtTime(baseFreq, now, 0.04);
      this.osc2.frequency.setTargetAtTime(baseFreq * 1.99, now, 0.04);
      this.engFilter.frequency.setTargetAtTime(220 + rpmNorm * 950 + (nosActive ? 450 : 0), now, 0.05);
      this.engGain.gain.setTargetAtTime(0.065 + rpmNorm * 0.045, now, 0.05);

      this.screechGain.gain.setTargetAtTime(drifting ? 0.055 : 0, now, 0.05);
      this.nosGain.gain.setTargetAtTime(nosActive ? 0.11 : 0, now, 0.05);

      // Driving Synthwave Bass Pulse during active racing
      this.synthBeatTimer += dt;
      if (this.synthBeatTimer > 0.214) {
        this.synthBeatTimer = 0;
        const bassLine = [55, 55, 65.41, 73.42, 55, 55, 82.41, 73.42];
        const f = bassLine[this.synthStep % bassLine.length];
        this.synthStep++;
        this.tone(f, 0.15, 'sawtooth', 0.032, f * 0.96);
      }
    }

    tone(freq, dur = 0.12, type = 'triangle', vol = 0.1, slideTo = null) {
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

    playCountdown(isGo) {
      this.tone(isGo ? 880 : 440, isGo ? 0.38 : 0.18, 'triangle', 0.16);
    }
    playShift() {
      this.tone(620, 0.08, 'sine', 0.06, 280);
    }
    playScrape() {
      this.tone(160, 0.09, 'sawtooth', 0.07, 90);
    }
    playFanfare() {
      [523.25, 659.25, 783.99, 1046.5].forEach((n, i) => {
        setTimeout(() => this.tone(n, 0.24, 'triangle', 0.16), i * 95);
      });
    }
  }

  const sfx = new AudioEngine();

  // --- PROCEDURAL HIGH-RES TEXTURES ---
  function makeCanvasTex(w, h, drawFn, repX = 1, repY = 1) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    drawFn(ctx, w, h);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repX, repY);
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
  }

  function makeRoadTexture(isNight) {
    return makeCanvasTex(512, 512, (ctx, w, h) => {
      ctx.fillStyle = isNight ? '#151c2c' : '#242b38';
      ctx.fillRect(0, 0, w, h);

      // Asphalt surface variation
      for (let i = 0; i < 4200; i++) {
        ctx.fillStyle = i % 2 ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.08)';
        ctx.fillRect(Math.random() * w, Math.random() * h, 2, 3);
      }

      // Outer Red & White Racing Apex Curbs
      for (let y = 0; y < h; y += 64) {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(0, y, 24, 32);
        ctx.fillRect(w - 24, y, 24, 32);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, y + 32, 24, 32);
        ctx.fillRect(w - 24, y + 32, 24, 32);
      }

      // Clean Solid Shoulder Lines
      ctx.fillStyle = isNight ? '#00f0ff' : '#ffffff';
      ctx.fillRect(28, 0, 6, h);
      ctx.fillRect(w - 34, 0, 6, h);

      // 3-Lane High-Speed Dashed Dividers (25%, 50%, 75%)
      ctx.fillStyle = isNight ? '#e2e8f0' : '#f8fafc';
      for (let y = 24; y < h; y += 128) {
        ctx.fillRect(w * 0.25 - 4, y, 8, 68);
        ctx.fillRect(w * 0.75 - 4, y, 8, 68);
      }
      ctx.fillStyle = '#facc15';
      for (let y = 24; y < h; y += 128) {
        ctx.fillRect(w * 0.5 - 5, y, 10, 74);
      }
    });
  }

  function makeBuildingTexture(accentHexCss) {
    return makeCanvasTex(256, 512, (ctx, w, h) => {
      ctx.fillStyle = '#090e1c';
      ctx.fillRect(0, 0, w, h);
      const cols = 6, rows = 18;
      const cw = w / cols, ch = h / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const rng = Math.random();
          ctx.fillStyle = rng > 0.72 ? accentHexCss : rng > 0.35 ? '#38bdf8' : '#131d33';
          ctx.fillRect(c * cw + 6, r * ch + 5, cw - 12, ch - 10);
        }
      }
    });
  }

  function makeChevronTexture(colorCss) {
    return makeCanvasTex(256, 128, (ctx, w, h) => {
      ctx.fillStyle = '#070b14';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = colorCss;
      for (let x = 16; x < w; x += 64) {
        ctx.beginPath();
        ctx.moveTo(x, 16);
        ctx.lineTo(x + 28, h / 2);
        ctx.lineTo(x, h - 16);
        ctx.lineTo(x + 18, h - 16);
        ctx.lineTo(x + 46, h / 2);
        ctx.lineTo(x + 18, 16);
        ctx.closePath();
        ctx.fill();
      }
    });
  }

  function makeCheckeredTexture() {
    return makeCanvasTex(512, 128, (ctx, w, h) => {
      const sq = 32;
      for (let y = 0; y < h; y += sq) {
        for (let x = 0; x < w; x += sq) {
          ctx.fillStyle = ((x / sq + y / sq) | 0) % 2 === 0 ? '#ffffff' : '#0f172a';
          ctx.fillRect(x, y, sq, sq);
        }
      }
      ctx.fillStyle = 'rgba(0, 240, 255, 0.9)';
      ctx.fillRect(0, 0, w, 10);
      ctx.fillRect(0, h - 10, w, 10);
    });
  }

  function makeRadialGlowTexture() {
    return makeCanvasTex(256, 256, (ctx, w, h) => {
      const cx = w / 2, cy = h / 2;
      const g = ctx.createRadialGradient(cx, cy, 8, cx, cy, w * 0.48);
      g.addColorStop(0.0, 'rgba(255, 255, 255, 0.68)');
      g.addColorStop(0.45, 'rgba(255, 255, 255, 0.34)');
      g.addColorStop(0.78, 'rgba(255, 255, 255, 0.08)');
      g.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    });
  }

  const TEXTURES = {
    roadNight: makeRoadTexture(true),
    roadDay: makeRoadTexture(false),
    bldgCyan: makeBuildingTexture('#00f0ff'),
    bldgMagenta: makeBuildingTexture('#ff2a85'),
    checkered: makeCheckeredTexture(),
    chevronCyan: makeChevronTexture('#00f0ff'),
    chevronOrange: makeChevronTexture('#ff5500'),
    chevronGold: makeChevronTexture('#facc15'),
    radialGlow: makeRadialGlowTexture()
  };

  // --- THREE.JS SCENE, RENDERER & UNREAL BLOOM COMPOSER ---
  const canvas = document.getElementById('gameCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050918);
  scene.fog = new THREE.FogExp2(0x070d22, 0.0014);

  const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.5, 2200);
  camera.position.set(0, 4, 8);

  let composer = null;
  let bloomPass = null;
  let bloomEnabled = true;

  try {
    if (THREE.EffectComposer && THREE.RenderPass && THREE.UnrealBloomPass) {
      composer = new THREE.EffectComposer(renderer);
      const renderPass = new THREE.RenderPass(scene, camera);
      bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.75, // strength
        0.35, // radius
        0.72  // high threshold so only bright neon/tail-lights/NOS bloom!
      );
      composer.addPass(renderPass);
      composer.addPass(bloomPass);
    }
  } catch (e) {
    composer = null;
  }

  // Scene Lights
  const ambientLight = new THREE.AmbientLight(0x64748b, 0.9);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.35);
  sunLight.position.set(160, 260, 140);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 10;
  sunLight.shadow.camera.far = 900;
  const sd = 260;
  sunLight.shadow.camera.left = -sd;
  sunLight.shadow.camera.right = sd;
  sunLight.shadow.camera.top = sd;
  sunLight.shadow.camera.bottom = -sd;
  sunLight.shadow.bias = -0.0005;
  scene.add(sunLight);

  // --- SCULPTED AERODYNAMIC 3D SUPERCAR BUILDER (NO BOXY CARS!) ---
  function buildSupercarMesh(carSpec, customOpts = {}) {
    const paintColor = customOpts.paintHex !== undefined ? customOpts.paintHex : carSpec.defaultPaint;
    const glowColor = customOpts.glowHex !== undefined ? customOpts.glowHex : carSpec.defaultGlow;
    const wingStyle = customOpts.wingStyle || carSpec.defaultWing || 'gt';
    const isPursuit = !!customOpts.isPursuit;

    const root = new THREE.Group();
    const chassisGroup = new THREE.Group(); // Pitches/rolls dynamically with suspension & drift
    root.add(chassisGroup);

    const halfL = carSpec.len * 0.5;
    const width = carSpec.wid;
    const nH = carSpec.noseH;
    const rH = carSpec.roofH;
    const pX = carSpec.roofPeakX;

    // 1. Extruded Aerodynamic Body Silhouette (Side profile extruded & rotated so +Z = Forward!)
    const bodyShape = new THREE.Shape();
    bodyShape.moveTo(-halfL, 0.28);                     // Rear diffuser bottom
    bodyShape.lineTo(halfL - 0.1, 0.25);                // Underbody splitter edge
    bodyShape.lineTo(halfL + 0.14, nH);                 // Aggressive sharp nose tip
    bodyShape.lineTo(halfL - 0.55, nH + 0.34);          // Sculpted front hood rise
    bodyShape.lineTo(0.82, nH + 0.44);                  // Base of raked windshield
    bodyShape.lineTo(pX + 0.28, rH);                    // Fastback roof front
    bodyShape.lineTo(pX - 0.48, rH - 0.02);             // Roof apex
    bodyShape.lineTo(-halfL + 0.38, nH + 0.56);         // Sloping rear deck
    bodyShape.lineTo(-halfL - 0.08, nH + 0.48);         // Ducktail lip / rear fascia
    bodyShape.lineTo(-halfL, 0.28);

    const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
      depth: width - 0.28,
      bevelEnabled: true,
      bevelThickness: 0.15,
      bevelSize: 0.11,
      bevelSegments: 3
    });
    bodyGeo.translate(0, 0, -(width - 0.28) / 2);
    bodyGeo.rotateY(-Math.PI / 2); // Old +X (nose) maps cleanly to +Z!

    const paintMat = new THREE.MeshStandardMaterial({
      color: paintColor,
      metalness: 0.72,
      roughness: 0.18
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, paintMat);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    chassisGroup.add(bodyMesh);

    // 2. Sculpted Tinted Cockpit Canopy Glass (proud of roof/windshield bevel so canopy reads crisply)
    const glassShape = new THREE.Shape();
    glassShape.moveTo(-halfL + 0.58, nH + 0.58);
    glassShape.lineTo(0.86, nH + 0.45);
    glassShape.lineTo(pX + 0.28, rH + 0.06);
    glassShape.lineTo(pX - 0.50, rH + 0.04);
    glassShape.closePath();

    const glassGeo = new THREE.ExtrudeGeometry(glassShape, {
      depth: width - 0.34,
      bevelEnabled: true,
      bevelThickness: 0.12,
      bevelSize: 0.13,
      bevelSegments: 2
    });
    glassGeo.translate(0, 0, -(width - 0.34) / 2);
    glassGeo.rotateY(-Math.PI / 2);

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x050a14,
      emissive: 0x040914,
      metalness: 0.85,
      roughness: 0.08
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    chassisGroup.add(glassMesh);

    // 3. Carbon Fiber Front Splitter & Rear Diffuser
    const carbonMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.45, metalness: 0.35 });
    const splitter = new THREE.Mesh(new THREE.BoxGeometry(width + 0.08, 0.09, 0.55), carbonMat);
    splitter.position.set(0, 0.24, halfL - 0.02);
    chassisGroup.add(splitter);

    const diffuser = new THREE.Mesh(new THREE.BoxGeometry(width - 0.1, 0.18, 0.45), carbonMat);
    diffuser.position.set(0, 0.28, -halfL + 0.08);
    chassisGroup.add(diffuser);

    // Wide Side Skirts & Flared Wheel Fenders
    [-width / 2 - 0.02, width / 2 + 0.02].forEach(sx => {
      const skirt = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.16, carSpec.len * 0.56), carbonMat);
      skirt.position.set(sx, 0.28, 0);
      chassisGroup.add(skirt);
    });

    // Optional Muscle Hood Scoop or Mid-Engine Glass Vents
    if (carSpec.hoodScoop) {
      const scoop = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.18, 0.95), carbonMat);
      scoop.position.set(0, nH + 0.46, 1.3);
      chassisGroup.add(scoop);
    }
    if (carSpec.midEngineVents) {
      [-0.28, 0, 0.28].forEach(vx => {
        const vent = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.06, 0.72), carbonMat);
        vent.position.set(vx, nH + 0.62, -1.25);
        chassisGroup.add(vent);
      });
    }

    // 4. Emissive Projector Headlights & Full-Width LED Tail-Light Bar (Blooms nicely!)
    const hlMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe });
    [-width * 0.34, width * 0.34].forEach(hx => {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.12, 0.16), hlMat);
      hl.position.set(hx, nH + 0.22, halfL + 0.17);
      chassisGroup.add(hl);
    });

    const tailMat = new THREE.MeshBasicMaterial({ color: 0xff2244 });
    const tailBar = new THREE.Mesh(new THREE.BoxGeometry(width - 0.24, 0.13, 0.12), tailMat);
    tailBar.position.set(0, nH + 0.46, -halfL - 0.16);
    chassisGroup.add(tailBar);

    // Chrome Dual Exhaust Tips + Twin Blue/Cyan N2O Flame Cones
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.15 });
    const nosGroup = new THREE.Group();
    const nosMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.92 });
    const nosCoreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    [-0.58, 0.58].forEach(ex => {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.28, 10), chromeMat);
      pipe.rotation.x = Math.PI / 2;
      pipe.position.set(ex, 0.3, -halfL - 0.08);
      chassisGroup.add(pipe);

      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.85, 10), nosMat);
      cone.rotation.x = -Math.PI / 2;
      cone.position.set(ex, 0.3, -halfL - 1.05);
      const core = new THREE.Mesh(new THREE.ConeGeometry(0.09, 1.0, 8), nosCoreMat);
      core.rotation.x = -Math.PI / 2;
      core.position.set(ex, 0.3, -halfL - 0.65);
      nosGroup.add(cone, core);
    });
    nosGroup.visible = false;
    chassisGroup.add(nosGroup);

    // 5. Selectable 3D Aero Wing Kit
    const wingGroup = new THREE.Group();
    chassisGroup.add(wingGroup);
    if (wingStyle === 'gt') {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(width + 0.18, 0.08, 0.42), carbonMat);
      blade.position.set(0, nH + 0.92, -halfL + 0.14);
      [-0.56, 0.56].forEach(px => {
        const strut = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.42, 0.24), carbonMat);
        strut.position.set(px, nH + 0.72, -halfL + 0.18);
        strut.rotation.x = 0.22;
        wingGroup.add(strut);
      });
      // Wing endplates painted in body color
      [-(width + 0.18) / 2, (width + 0.18) / 2].forEach(epx => {
        const ep = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.26, 0.48), paintMat);
        ep.position.set(epx, nH + 0.9, -halfL + 0.14);
        wingGroup.add(ep);
      });
      wingGroup.add(blade);
    } else if (wingStyle === 'ducktail') {
      const lip = new THREE.Mesh(new THREE.BoxGeometry(width - 0.18, 0.24, 0.26), paintMat);
      lip.position.set(0, nH + 0.58, -halfL + 0.08);
      lip.rotation.x = -0.35;
      wingGroup.add(lip);
    } else if (wingStyle === 'twin') {
      [-0.65, 0.65].forEach(fx => {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.48, 0.62), paintMat);
        fin.position.set(fx, nH + 0.72, -halfL + 0.24);
        fin.rotation.x = 0.3;
        wingGroup.add(fin);
      });
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.07, 0.28), new THREE.MeshBasicMaterial({ color: glowColor || 0x00f0ff }));
      bridge.position.set(0, nH + 0.9, -halfL + 0.14);
      wingGroup.add(bridge);
    }

    // 6. Optional Hot Pursuit Police Interceptor Lightbar + Strobes
    let pursuitBarRed = null;
    let pursuitBarBlue = null;
    if (isPursuit) {
      const rMat = new THREE.MeshBasicMaterial({ color: 0xff1133 });
      const bMat = new THREE.MeshBasicMaterial({ color: 0x0088ff });
      pursuitBarRed = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.16, 0.28), rMat);
      pursuitBarRed.position.set(-0.32, rH + 0.12, pX - 0.1);
      pursuitBarBlue = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.16, 0.28), bMat);
      pursuitBarBlue.position.set(0.32, rH + 0.12, pX - 0.1);
      chassisGroup.add(pursuitBarRed, pursuitBarBlue);
    }

    // 7. Real Radial Neon Underglow Pool + PointLight
    let underglowLight = null;
    let underglowPad = null;
    if (glowColor && glowColor !== 0x000000) {
      underglowPad = new THREE.Mesh(
        new THREE.PlaneGeometry(width + 1.2, carSpec.len + 1.1),
        new THREE.MeshBasicMaterial({
          color: glowColor,
          map: TEXTURES.radialGlow,
          transparent: true,
          opacity: 0.36,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide
        })
      );
      underglowPad.rotation.x = -Math.PI / 2;
      underglowPad.position.set(0, 0.07, 0);
      root.add(underglowPad);

      underglowLight = new THREE.PointLight(glowColor, 1.5, 9.5);
      underglowLight.position.set(0, 0.4, 0);
      root.add(underglowLight);
    }

    // 8. 4 Multi-Spoke Wheels with Steering Knuckles & Brake Calipers
    const wheels = [];
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.18 });
    const caliperMat = new THREE.MeshBasicMaterial({ color: glowColor || 0xff2a85 });
    const wheelZ = halfL * 0.62;
    const wheelX = width * 0.48;
    const wR = 0.42;

    [
      { x: -wheelX, z: wheelZ, front: true },
      { x: wheelX, z: wheelZ, front: true },
      { x: -wheelX, z: -wheelZ, front: false },
      { x: wheelX, z: -wheelZ, front: false }
    ].forEach(wp => {
      const steerPivot = new THREE.Group();
      steerPivot.position.set(wp.x, wR, wp.z);
      const spinGroup = new THREE.Group();
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(wR, wR, 0.34, 20), tireMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(wR * 0.64, wR * 0.64, 0.36, 12), rimMat);
      rim.rotation.z = Math.PI / 2;
      // Visible spokes so wheel spin looks crisp
      for (let s = 0; s < 5; s++) {
        const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.37, wR * 1.15, 0.05), chromeMat);
        spoke.rotation.x = (s / 5) * Math.PI;
        spinGroup.add(spoke);
      }
      spinGroup.add(tire, rim);
      const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 0.22), caliperMat);
      caliper.position.set(wp.x > 0 ? -0.1 : 0.1, 0.08, 0.12);
      steerPivot.add(spinGroup, caliper);
      root.add(steerPivot);
      wheels.push({ steerPivot, spinGroup, front: wp.front });
    });

    // Optional Headlight SpotLight for player car on Night/Sunset tracks
    let headSpot = null;
    if (customOpts.withHeadlight) {
      headSpot = new THREE.SpotLight(0xe0f2fe, 2.8, 95, Math.PI / 4.5, 0.5, 1.1);
      headSpot.position.set(0, 0.8, halfL);
      headSpot.target.position.set(0, 0, halfL + 34);
      chassisGroup.add(headSpot, headSpot.target);
    }

    return {
      root,
      chassisGroup,
      wheels,
      nosGroup,
      tailMat,
      underglowLight,
      pursuitBarRed,
      pursuitBarBlue,
      headSpot
    };
  }

  // --- CONTINUOUS CLOSED-SPLINE 3D CIRCUIT GENERATOR ---
  const FRAMES_COUNT = 600;
  const ROAD_HALF_W = 14.0;
  const MAX_LAT = 12.2;

  const raceWorldGroup = new THREE.Group();
  scene.add(raceWorldGroup);

  const showroomGroup = new THREE.Group();
  scene.add(showroomGroup);

  let trackData = null;

  function buildTrack(trackIdx) {
    while (raceWorldGroup.children.length > 0) {
      raceWorldGroup.remove(raceWorldGroup.children[0]);
    }
    const spec = TRACK_SPECS[trackIdx];
    const pts3d = spec.waypoints.map(w => new THREE.Vector3(w[0], w[1], w[2]));
    const curve = new THREE.CatmullRomCurve3(pts3d, true, 'catmullrom', 0.5);

    const pts = [];
    const tangents = [];
    const rights = [];
    const ups = [];
    const curvatures = [];

    for (let i = 0; i < FRAMES_COUNT; i++) {
      const u = i / FRAMES_COUNT;
      const p = curve.getPointAt(u);
      const t = curve.getTangentAt(u).normalize();
      const r = new THREE.Vector3(-t.z, 0, t.x).normalize();
      const up = new THREE.Vector3().crossVectors(r, t).normalize();
      pts.push(p);
      tangents.push(t);
      rights.push(r);
      ups.push(up);
    }

    // Compute signed turn curvature at each frame for NFS Corner Chevrons
    for (let i = 0; i < FRAMES_COUNT; i++) {
      const tPrev = tangents[(i - 4 + FRAMES_COUNT) % FRAMES_COUNT];
      const tNext = tangents[(i + 4) % FRAMES_COUNT];
      // Signed Y component of cross(tPrev, tNext)
      const crossY = tPrev.z * tNext.x - tPrev.x * tNext.z;
      curvatures.push(crossY);
    }

    // Helper: create continuous ribbon quad mesh along N frames
    function createContinuousRibbon(getLeftRightFn, material, vStep = 0.25) {
      const positions = [];
      const uvs = [];
      const indices = [];
      const normals = [];

      for (let i = 0; i <= FRAMES_COUNT; i++) {
        const idx = i % FRAMES_COUNT;
        const pair = getLeftRightFn(idx, i);
        positions.push(pair.L.x, pair.L.y, pair.L.z, pair.R.x, pair.R.y, pair.R.z);
        uvs.push(0, i * vStep, 1, i * vStep);
        const n = pair.n || ups[idx];
        normals.push(n.x, n.y, n.z, n.x, n.y, n.z);

        if (i < FRAMES_COUNT) {
          const a = i * 2;
          const b = i * 2 + 1;
          const c = (i + 1) * 2;
          const d = (i + 1) * 2 + 1;
          indices.push(a, c, b, b, c, d);
        }
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geo.setIndex(indices);
      geo.computeVertexNormals();
      const mesh = new THREE.Mesh(geo, material);
      mesh.receiveShadow = true;
      return mesh;
    }

    // 1. Continuous Road Ribbon (Zero Seams!)
    const roadTex = spec.envType === 'tokyo' ? TEXTURES.roadNight : TEXTURES.roadDay;
    const roadMat = new THREE.MeshStandardMaterial({
      map: roadTex,
      roughness: spec.roadRoughness,
      metalness: spec.roadMetalness,
      side: THREE.DoubleSide
    });
    const roadMesh = createContinuousRibbon(idx => {
      const p = pts[idx];
      const r = rights[idx];
      return {
        L: new THREE.Vector3().copy(p).addScaledVector(r, -ROAD_HALF_W),
        R: new THREE.Vector3().copy(p).addScaledVector(r, ROAD_HALF_W)
      };
    }, roadMat, 0.25);
    raceWorldGroup.add(roadMesh);

    // 2. Continuous Left & Right Jersey Barriers + Glowing Neon Edge Trim
    const barrierMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.65, side: THREE.DoubleSide });
    const trimMat = new THREE.MeshBasicMaterial({ color: spec.barrierTrim, side: THREE.DoubleSide });

    [-1, 1].forEach(sideSign => {
      const offsetIn = sideSign * (ROAD_HALF_W + 0.1);
      const offsetOut = sideSign * (ROAD_HALF_W + 1.0);
      const barrierInnerFace = createContinuousRibbon(idx => {
        const p = pts[idx];
        const r = rights[idx];
        const base = new THREE.Vector3().copy(p).addScaledVector(r, offsetIn);
        const top = new THREE.Vector3().copy(base).add(new THREE.Vector3(0, 1.35, 0));
        return sideSign > 0 ? { L: top, R: base } : { L: base, R: top };
      }, barrierMat, 0.2);

      const barrierTop = createContinuousRibbon(idx => {
        const p = pts[idx];
        const r = rights[idx];
        const a = new THREE.Vector3().copy(p).addScaledVector(r, offsetIn).add(new THREE.Vector3(0, 1.35, 0));
        const b = new THREE.Vector3().copy(p).addScaledVector(r, offsetOut).add(new THREE.Vector3(0, 1.35, 0));
        return sideSign > 0 ? { L: a, R: b } : { L: b, R: a };
      }, barrierMat, 0.2);

      const neonStrip = createContinuousRibbon(idx => {
        const p = pts[idx];
        const r = rights[idx];
        const low = new THREE.Vector3().copy(p).addScaledVector(r, sideSign * (ROAD_HALF_W + 0.04)).add(new THREE.Vector3(0, 0.92, 0));
        const high = new THREE.Vector3().copy(p).addScaledVector(r, sideSign * (ROAD_HALF_W + 0.04)).add(new THREE.Vector3(0, 1.15, 0));
        return sideSign > 0 ? { L: high, R: low } : { L: low, R: high };
      }, trimMat, 0.2);

      raceWorldGroup.add(barrierInnerFace, barrierTop, neonStrip);
    });

    // 3. NFS Glowing Corner Chevron Walls on Sharp Bends
    const chevTex = spec.envType === 'tokyo'
      ? TEXTURES.chevronCyan
      : spec.envType === 'canyon'
        ? TEXTURES.chevronOrange
        : TEXTURES.chevronGold;
    const chevMat = new THREE.MeshBasicMaterial({ map: chevTex, side: THREE.DoubleSide });

    for (let i = 0; i < FRAMES_COUNT; i += 6) {
      const k = curvatures[i];
      if (Math.abs(k) > 0.11) {
        // Place warning chevron on outer side of the turn!
        const outerSide = k > 0 ? 1 : -1;
        const p = pts[i];
        const r = rights[i];
        const t = tangents[i];
        const chevBoard = new THREE.Mesh(new THREE.BoxGeometry(10, 2.8, 0.35), chevMat);
        chevBoard.position.copy(p).addScaledVector(r, outerSide * (ROAD_HALF_W + 1.4));
        chevBoard.position.y += 2.8;
        chevBoard.rotation.y = Math.atan2(t.x, t.z) + (outerSide > 0 ? -Math.PI / 2 : Math.PI / 2);
        raceWorldGroup.add(chevBoard);
      }
    }

    // 4. Start / Finish Checkered Road Strip & Overhead Racing Gantry at idx 0
    const gP = pts[0];
    const gT = tangents[0];
    const gAngle = Math.atan2(gT.x, gT.z);

    const finishStrip = new THREE.Mesh(
      new THREE.PlaneGeometry(ROAD_HALF_W * 2, 7.0),
      new THREE.MeshBasicMaterial({ map: TEXTURES.checkered })
    );
    finishStrip.position.copy(gP).add(new THREE.Vector3(0, 0.08, 0));
    finishStrip.rotation.order = 'YXZ';
    finishStrip.rotation.y = gAngle;
    finishStrip.rotation.x = -Math.PI / 2;
    raceWorldGroup.add(finishStrip);

    const gantry = new THREE.Group();
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7, roughness: 0.3 });
    [-ROAD_HALF_W - 0.8, ROAD_HALF_W + 0.8].forEach(gx => {
      const col = new THREE.Mesh(new THREE.BoxGeometry(1.4, 12.5, 1.4), steelMat);
      col.position.set(gx, 6.2, 0);
      gantry.add(col);
    });
    const beam = new THREE.Mesh(new THREE.BoxGeometry(ROAD_HALF_W * 2 + 3.2, 2.6, 1.6), steelMat);
    beam.position.set(0, 12.0, 0);
    const neonBanner = new THREE.Mesh(
      new THREE.BoxGeometry(ROAD_HALF_W * 2 + 1.5, 1.8, 1.8),
      new THREE.MeshBasicMaterial({ map: TEXTURES.checkered })
    );
    neonBanner.position.set(0, 12.0, 0);
    gantry.add(beam, neonBanner);
    gantry.position.copy(gP);
    gantry.rotation.y = gAngle;
    raceWorldGroup.add(gantry);

    // 5. Light-Portal Tunnels (Indices 110..155 & 380..425) + Bridge Support Pillars where Y > 2.5m
    const ringMat = new THREE.MeshBasicMaterial({ color: spec.barrierTrim });
    const archDarkMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, side: THREE.DoubleSide });
    const tunnelRanges = [[110, 154], [375, 415]];
    tunnelRanges.forEach(([sIdx, eIdx]) => {
      for (let i = sIdx; i <= eIdx; i += 6) {
        const p = pts[i];
        const t = tangents[i];
        const archGroup = new THREE.Group();
        const shell = new THREE.Mesh(new THREE.TorusGeometry(ROAD_HALF_W + 0.8, 0.7, 8, 22, Math.PI), archDarkMat);
        shell.position.y = 0.2;
        const glowRing = new THREE.Mesh(new THREE.TorusGeometry(ROAD_HALF_W + 0.25, 0.22, 8, 22, Math.PI), ringMat);
        glowRing.position.y = 0.2;
        archGroup.add(shell, glowRing);
        archGroup.position.copy(p);
        archGroup.rotation.y = Math.atan2(t.x, t.z);
        raceWorldGroup.add(archGroup);
      }
    });

    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.75 });
    for (let i = 0; i < FRAMES_COUNT; i += 8) {
      const p = pts[i];
      if (p.y > 2.2) {
        const r = rights[i];
        [-ROAD_HALF_W * 0.6, ROAD_HALF_W * 0.6].forEach(px => {
          const pil = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.8, p.y + 4, 8), pillarMat);
          pil.position.copy(p).addScaledVector(r, px);
          pil.position.y = p.y / 2 - 2;
          raceWorldGroup.add(pil);
        });
      }
    }

    // 6. Ground Plane & Trackside Environment Scenery (Outside Road Corridor!)
    const groundColor = spec.envType === 'tokyo' ? 0x060a14 : spec.envType === 'canyon' ? 0xb45309 : 0x166534;
    const groundMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3400, 3400),
      new THREE.MeshStandardMaterial({ color: groundColor, roughness: 0.9 })
    );
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -2.2;
    groundMesh.receiveShadow = true;
    raceWorldGroup.add(groundMesh);

    if (spec.envType === 'canyon') {
      // Sparkling Ocean Bay beside Pacific Sunset Canyon
      const ocean = new THREE.Mesh(
        new THREE.PlaneGeometry(3400, 1400),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.18, metalness: 0.55 })
      );
      ocean.rotation.x = -Math.PI / 2;
      ocean.position.set(1200, -1.5, 0);
      ocean.rotation.z = Math.PI / 2;
      raceWorldGroup.add(ocean);
    }

    // Check minimum XZ distance to track so scenery never blocks the road!
    function farFromTrack(cx, cz, minDist) {
      const minD2 = minDist * minDist;
      for (let i = 0; i < FRAMES_COUNT; i += 3) {
        const dx = cx - pts[i].x;
        const dz = cz - pts[i].z;
        if (dx * dx + dz * dz < minD2) return false;
      }
      return true;
    }

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const palmMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 });
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.88 });
    const snowMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });

    for (let i = 0; i < FRAMES_COUNT; i += 4) {
      const p = pts[i];
      const r = rights[i];
      [-1, 1].forEach(side => {
        const distOut = ROAD_HALF_W + 16 + (i % 5) * 9;
        const sx = p.x + r.x * side * distOut;
        const sz = p.z + r.z * side * distOut;
        if (!farFromTrack(sx, sz, ROAD_HALF_W + 9)) return;

        if (spec.envType === 'tokyo') {
          const bw = 20 + (i % 4) * 7;
          const bh = 42 + ((i * 13) % 95);
          const bMat = new THREE.MeshStandardMaterial({
            map: (i + (side > 0 ? 1 : 0)) % 2 === 0 ? TEXTURES.bldgCyan : TEXTURES.bldgMagenta,
            roughness: 0.35
          });
          const bldg = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bw), bMat);
          bldg.position.set(sx, bh / 2 - 2, sz);
          const crown = new THREE.Mesh(
            new THREE.BoxGeometry(bw + 1.4, 2.0, bw + 1.4),
            new THREE.MeshBasicMaterial({ color: (i + (side > 0 ? 1 : 0)) % 2 === 0 ? 0x00f0ff : 0xff2a85 })
          );
          crown.position.set(sx, bh - 1, sz);
          raceWorldGroup.add(bldg, crown);
        } else if (spec.envType === 'canyon') {
          if (i % 8 === 0) {
            // Red-Rock Canyon Mesa / Pillar
            const mh = 28 + (i % 6) * 14;
            const mesa = new THREE.Mesh(new THREE.CylinderGeometry(8, 18, mh, 7), rockMat);
            mesa.position.set(sx, mh / 2 - 2, sz);
            raceWorldGroup.add(mesa);
          } else {
            // Coastal Palm Tree
            const palm = new THREE.Group();
            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.7, 11, 7), trunkMat);
            trunk.position.y = 5.5;
            palm.add(trunk);
            for (let f = 0; f < 5; f++) {
              const frond = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 4.6), palmMat);
              const fa = (f / 5) * Math.PI * 2;
              frond.position.set(Math.sin(fa) * 2.0, 11, Math.cos(fa) * 2.0);
              frond.rotation.y = fa;
              frond.rotation.x = 0.32;
              palm.add(frond);
            }
            palm.position.set(sx, -2, sz);
            raceWorldGroup.add(palm);
          }
        } else {
          // Alpine Snow Mountains & Evergreen Pines
          if (i % 12 === 0) {
            const mh = 55 + (i % 5) * 24;
            const mtn = new THREE.Group();
            const base = new THREE.Mesh(new THREE.ConeGeometry(28, mh, 7), new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.85 }));
            base.position.y = mh / 2 - 2;
            const cap = new THREE.Mesh(new THREE.ConeGeometry(12, mh * 0.44, 7), snowMat);
            cap.position.y = mh * 0.78 - 2;
            mtn.add(base, cap);
            mtn.position.set(sx + r.x * side * 24, 0, sz + r.z * side * 24);
            raceWorldGroup.add(mtn);
          } else {
            const pine = new THREE.Group();
            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.8, 5, 6), trunkMat);
            trunk.position.y = 2.5;
            const c1 = new THREE.Mesh(new THREE.ConeGeometry(3.5, 7, 7), palmMat);
            c1.position.y = 7.0;
            const c2 = new THREE.Mesh(new THREE.ConeGeometry(2.5, 5.5, 7), snowMat);
            c2.position.y = 10.5;
            pine.add(trunk, c1, c2);
            pine.position.set(sx, -2, sz);
            raceWorldGroup.add(pine);
          }
        }
      });
    }

    // Apply Track Sky, Fog & Lighting
    scene.background.setHex(spec.sky);
    scene.fog.color.setHex(spec.fogColor);
    scene.fog.density = spec.fogDensity;
    ambientLight.color.setHex(spec.ambient);
    ambientLight.intensity = spec.ambientInt;
    sunLight.color.setHex(spec.sunColor);
    sunLight.intensity = spec.sunInt;

    trackData = { spec, curve, pts, tangents, rights, ups, curvatures };
  }

  // --- PROJECT WORLD (X, Z) ONTO CLOSEST SPLINE SEGMENT ---
  function projectOntoTrack(x, z, hintIdx = -1) {
    const pts = trackData.pts;
    let bestSeg = 0;
    let bestS = 0;
    let bestDist2 = Infinity;

    if (hintIdx >= 0) {
      // Fast local search around hintIdx
      for (let off = -32; off <= 32; off++) {
        const i = (hintIdx + off + FRAMES_COUNT) % FRAMES_COUNT;
        const p0 = pts[i];
        const p1 = pts[(i + 1) % FRAMES_COUNT];
        const dx = p1.x - p0.x;
        const dz = p1.z - p0.z;
        const len2 = dx * dx + dz * dz || 1;
        const s = Math.max(0, Math.min(1, ((x - p0.x) * dx + (z - p0.z) * dz) / len2));
        const qx = p0.x + dx * s;
        const qz = p0.z + dz * s;
        const d2 = (x - qx) * (x - qx) + (z - qz) * (z - qz);
        if (d2 < bestDist2) {
          bestDist2 = d2;
          bestSeg = i;
          bestS = s;
        }
      }
    }

    // Fallback global search if hint was unset or far
    if (bestDist2 > 2200) {
      for (let i = 0; i < FRAMES_COUNT; i++) {
        const p0 = pts[i];
        const p1 = pts[(i + 1) % FRAMES_COUNT];
        const dx = p1.x - p0.x;
        const dz = p1.z - p0.z;
        const len2 = dx * dx + dz * dz || 1;
        const s = Math.max(0, Math.min(1, ((x - p0.x) * dx + (z - p0.z) * dz) / len2));
        const qx = p0.x + dx * s;
        const qz = p0.z + dz * s;
        const d2 = (x - qx) * (x - qx) + (z - qz) * (z - qz);
        if (d2 < bestDist2) {
          bestDist2 = d2;
          bestSeg = i;
          bestS = s;
        }
      }
    }

    const p0 = pts[bestSeg];
    const p1 = pts[(bestSeg + 1) % FRAMES_COUNT];
    const t0 = trackData.tangents[bestSeg];
    const t1 = trackData.tangents[(bestSeg + 1) % FRAMES_COUNT];
    const r0 = trackData.rights[bestSeg];
    const r1 = trackData.rights[(bestSeg + 1) % FRAMES_COUNT];

    const qx = p0.x + (p1.x - p0.x) * bestS;
    const qy = p0.y + (p1.y - p0.y) * bestS;
    const qz = p0.z + (p1.z - p0.z) * bestS;

    const T = new THREE.Vector3().lerpVectors(t0, t1, bestS).normalize();
    const R = new THREE.Vector3().lerpVectors(r0, r1, bestS).normalize();
    const lat = (x - qx) * R.x + (z - qz) * R.z;
    const u = ((bestSeg + bestS) % FRAMES_COUNT) / FRAMES_COUNT;

    return { segIdx: bestSeg, s: bestS, u, qx, qy, qz, T, R, lat };
  }

  // --- 3D SHOWROOM GARAGE TURNTABLE SETUP ---
  const turntableGroup = new THREE.Group();
  showroomGroup.add(turntableGroup);

  function buildShowroomStage() {
    // Sleek circular showroom stage
    const stageBase = new THREE.Mesh(
      new THREE.CylinderGeometry(5.8, 6.2, 0.35, 48),
      new THREE.MeshStandardMaterial({ color: 0x0c1322, metalness: 0.75, roughness: 0.25 })
    );
    stageBase.position.y = -0.18;
    stageBase.receiveShadow = true;

    const glowRing = new THREE.Mesh(
      new THREE.TorusGeometry(5.85, 0.08, 12, 64),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff })
    );
    glowRing.rotation.x = Math.PI / 2;
    glowRing.position.y = 0.02;

    const floorMirror = new THREE.Mesh(
      new THREE.CircleGeometry(32, 48),
      new THREE.MeshStandardMaterial({ color: 0x070b14, metalness: 0.65, roughness: 0.22 })
    );
    floorMirror.rotation.x = -Math.PI / 2;
    floorMirror.position.y = -0.36;

    // Overhead Showroom Studio Light Bars (Looks like a real NFS Heat Garage!)
    [-4.5, 4.5].forEach(lx => {
      const strip = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.12, 12),
        new THREE.MeshBasicMaterial({ color: 0xe0f2fe })
      );
      strip.position.set(lx, 5.2, 0);
      showroomGroup.add(strip);
    });

    const spot1 = new THREE.SpotLight(0x00f0ff, 2.2, 30, Math.PI / 4, 0.5);
    spot1.position.set(6, 7, 6);
    const spot2 = new THREE.SpotLight(0xff2a85, 1.8, 30, Math.PI / 4, 0.5);
    spot2.position.set(-6, 6, -6);

    turntableGroup.add(stageBase, glowRing);
    showroomGroup.add(floorMirror, spot1, spot2);
  }
  buildShowroomStage();

  // --- GARAGE CUSTOMIZATION STATE ---
  let selectedCarIdx = 0;
  let selectedPaintHex = CAR_SPECS[0].defaultPaint;
  let selectedGlowHex = CAR_SPECS[0].defaultGlow;
  let selectedWing = CAR_SPECS[0].defaultWing;
  let selectedTrackIdx = 0;
  let selectedModeIdx = 0;

  let showroomCar = null;
  function refreshShowroomCar() {
    if (showroomCar) turntableGroup.remove(showroomCar.root);
    const spec = CAR_SPECS[selectedCarIdx];
    showroomCar = buildSupercarMesh(spec, {
      paintHex: selectedPaintHex,
      glowHex: selectedGlowHex,
      wingStyle: selectedWing
    });
    turntableGroup.add(showroomCar.root);

    document.getElementById('carClassTag').textContent = spec.cls;
    document.getElementById('statSpdLbl').textContent = spec.topSpeed;
    document.getElementById('statSpdBar').style.width = spec.topSpeed + '%';
    document.getElementById('statAccLbl').textContent = Math.round(spec.accel * 1.45);
    document.getElementById('statAccBar').style.width = Math.min(100, Math.round(spec.accel * 1.45)) + '%';
    document.getElementById('statHndLbl').textContent = spec.handling;
    document.getElementById('statHndBar').style.width = spec.handling + '%';
  }

  // --- POPULATE GARAGE UI WIDGETS ---
  function initGarageUI() {
    const carSel = document.getElementById('carSelector');
    CAR_SPECS.forEach((c, idx) => {
      const btn = document.createElement('button');
      btn.className = 'car-btn' + (idx === 0 ? ' active' : '');
      btn.innerHTML = `<div><div class="car-name">${c.name}</div><div class="car-tag">${c.cls}</div></div><span class="car-rating">${c.rating}</span>`;
      btn.addEventListener('click', () => {
        sfx.init();
        selectedCarIdx = idx;
        selectedPaintHex = c.defaultPaint;
        selectedGlowHex = c.defaultGlow;
        selectedWing = c.defaultWing;
        carSel.querySelectorAll('.car-btn').forEach((el, j) => el.classList.toggle('active', j === idx));
        syncCustomizationPills();
        refreshShowroomCar();
      });
      carSel.appendChild(btn);
    });

    const paintWrap = document.getElementById('paintSwatches');
    PAINT_SWATCHES.forEach(p => {
      const sw = document.createElement('button');
      sw.className = 'swatch-btn';
      sw.style.background = p.css;
      sw.title = p.name;
      sw.dataset.hex = p.hex;
      sw.addEventListener('click', () => {
        sfx.init();
        selectedPaintHex = p.hex;
        syncCustomizationPills();
        refreshShowroomCar();
      });
      paintWrap.appendChild(sw);
    });

    const glowWrap = document.getElementById('glowSwatches');
    GLOW_SWATCHES.forEach(g => {
      const sw = document.createElement('button');
      sw.className = 'swatch-btn';
      sw.style.background = g.css;
      sw.title = 'Underglow: ' + g.name;
      sw.dataset.hex = g.hex;
      sw.addEventListener('click', () => {
        sfx.init();
        selectedGlowHex = g.hex;
        syncCustomizationPills();
        refreshShowroomCar();
      });
      glowWrap.appendChild(sw);
    });

    const wingWrap = document.getElementById('wingSelector');
    WING_STYLES.forEach(w => {
      const pill = document.createElement('button');
      pill.className = 'opt-pill';
      pill.textContent = w.label;
      pill.dataset.wing = w.id;
      pill.addEventListener('click', () => {
        sfx.init();
        selectedWing = w.id;
        syncCustomizationPills();
        refreshShowroomCar();
      });
      wingWrap.appendChild(pill);
    });

    const trackWrap = document.getElementById('trackSelector');
    TRACK_SPECS.forEach((tr, idx) => {
      const card = document.createElement('button');
      card.className = 'mode-card-btn' + (idx === 0 ? ' active' : '');
      card.innerHTML = `<div class="mode-title">${tr.name}</div><div class="mode-desc">${tr.desc}</div>`;
      card.addEventListener('click', () => {
        sfx.init();
        selectedTrackIdx = idx;
        trackWrap.querySelectorAll('.mode-card-btn').forEach((el, j) => el.classList.toggle('active', j === idx));
      });
      trackWrap.appendChild(card);
    });

    const modeWrap = document.getElementById('modeSelector');
    MODE_SPECS.forEach((md, idx) => {
      const card = document.createElement('button');
      card.className = 'mode-card-btn' + (idx === 0 ? ' active' : '');
      card.innerHTML = `<div class="mode-title">${md.name}</div><div class="mode-desc">${md.desc}</div>`;
      card.addEventListener('click', () => {
        sfx.init();
        selectedModeIdx = idx;
        modeWrap.querySelectorAll('.mode-card-btn').forEach((el, j) => el.classList.toggle('active', j === idx));
      });
      modeWrap.appendChild(card);
    });

    syncCustomizationPills();
    refreshShowroomCar();
  }

  function syncCustomizationPills() {
    document.querySelectorAll('#paintSwatches .swatch-btn').forEach(el => {
      el.classList.toggle('active', parseInt(el.dataset.hex, 10) === selectedPaintHex);
    });
    document.querySelectorAll('#glowSwatches .swatch-btn').forEach(el => {
      el.classList.toggle('active', parseInt(el.dataset.hex, 10) === selectedGlowHex);
    });
    document.querySelectorAll('#wingSelector .opt-pill').forEach(el => {
      el.classList.toggle('active', el.dataset.wing === selectedWing);
    });
  }

  initGarageUI();

  // --- SPARKS & TIRE SMOKE PARTICLE POOL ---
  const particles = [];
  const sparkGeo = new THREE.BoxGeometry(0.18, 0.18, 0.45);
  const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
  const smokeGeo = new THREE.SphereGeometry(0.45, 7, 7);
  const smokeMat = new THREE.MeshBasicMaterial({ color: 0xcbd5e1, transparent: true, opacity: 0.45 });

  function spawnParticle(isSpark, x, y, z, vx, vy, vz) {
    if (particles.length > 140) return;
    const mesh = new THREE.Mesh(isSpark ? sparkGeo : smokeGeo, isSpark ? sparkMat : smokeMat);
    mesh.position.set(x, y, z);
    raceWorldGroup.add(mesh);
    particles.push({ mesh, isSpark, vx, vy, vz, life: isSpark ? 0.35 : 0.6 });
  }

  // --- RACE STATE & RACERS (PLAYER + 5 AI RIVALS / PURSUIT INTERCEPTORS) ---
  let appState = 'garage'; // 'garage' | 'countdown' | 'racing' | 'results'
  let playerCar = null;
  let aiRacers = [];
  let raceElapsed = 0;
  let lapStartTime = 0;
  let bestLapTime = Infinity;
  let countdownTimer = 3.2;
  let lastCountdownBeep = 4;
  let cameraMode = 0;
  const CAM_MODES = ['🎥 Cam: Chase (C)', '🎥 Cam: Hood (C)', '🎥 Cam: Heli (C)'];

  // Drift & Style Score State
  let totalStyleScore = 0;
  let activeDriftPts = 0;
  let activeDriftMult = 1;
  let activeDriftTimer = 0;
  let maxMphReached = 0;
  let nearMissCooldown = 0;
  let pursuitTimeLimit = 120;

  let calloutTimeout = null;
  function showCallout(main, sub) {
    const el = document.getElementById('calloutBanner');
    document.getElementById('calloutMain').textContent = main;
    document.getElementById('calloutSub').textContent = sub;
    el.classList.add('active');
    if (calloutTimeout) clearTimeout(calloutTimeout);
    calloutTimeout = setTimeout(() => el.classList.remove('active'), 1800);
  }

  function formatRaceTime(sec) {
    if (!isFinite(sec)) return '--:--.--';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const cs = Math.floor((sec * 100) % 100);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  }

  function ordinal(n) {
    return ['1ST', '2ND', '3RD', '4TH', '5TH', '6TH'][n - 1] || `${n}TH`;
  }

  function enterGarage() {
    appState = 'garage';
    document.body.classList.remove('in-race');
    document.getElementById('garageOverlay').style.display = 'flex';
    document.getElementById('resultsOverlay').classList.remove('active');
    showroomGroup.visible = true;
    raceWorldGroup.visible = false;

    scene.background.setHex(0x050814);
    scene.fog.color.setHex(0x050814);
    scene.fog.density = 0.015;
    ambientLight.color.setHex(0x8aa4d6);
    ambientLight.intensity = 1.05;
    sunLight.color.setHex(0xe0f2fe);
    sunLight.intensity = 1.3;
  }

  function launchRace() {
    sfx.init();
    document.getElementById('garageOverlay').style.display = 'none';
    document.getElementById('resultsOverlay').classList.remove('active');
    document.body.classList.add('in-race');
    showroomGroup.visible = false;
    raceWorldGroup.visible = true;

    buildTrack(selectedTrackIdx);
    aiRacers = [];
    particles.length = 0;

    const totalLaps = MODE_SPECS[selectedModeIdx].laps;
    const isPursuit = MODE_SPECS[selectedModeIdx].id === 'pursuit';
    document.getElementById('pursuitBarCard').style.display = isPursuit ? 'block' : 'none';

    // Helper to spawn a racer behind the start gantry (`lap = -1` until crossing u=0)
    function spawnOnGrid(gridSlot, carSpec, customOpts) {
      const segIdx = (FRAMES_COUNT - 4 - gridSlot * 4 + FRAMES_COUNT) % FRAMES_COUNT;
      const p = trackData.pts[segIdx];
      const t = trackData.tangents[segIdx];
      const r = trackData.rights[segIdx];
      const laneLat = gridSlot % 2 === 0 ? -4.2 : 4.2;
      const meshObj = buildSupercarMesh(carSpec, customOpts);
      raceWorldGroup.add(meshObj.root);

      const racer = {
        spec: carSpec,
        meshObj,
        isPursuit: !!customOpts.isPursuit,
        x: p.x + r.x * laneLat,
        y: p.y,
        z: p.z + r.z * laneLat,
        heading: Math.atan2(t.x, t.z),
        speed: 0,
        steerAngle: 0,
        driftAngle: 0,
        segIdx,
        u: segIdx / FRAMES_COUNT,
        lap: -1,
        totalProgress: segIdx / FRAMES_COUNT - 1,
        lat: laneLat,
        targetLat: laneLat,
        n2o: 100,
        gear: 1,
        rpm: 1200,
        aiSkill: 0.84 + Math.random() * 0.16,
        finished: false
      };
      racer.meshObj.root.position.set(racer.x, racer.y, racer.z);
      racer.meshObj.root.rotation.y = racer.heading;
      return racer;
    }

    // Spawn 5 AI Rivals ahead on the starting grid (Slots 0..4), Player starts P6 (Slot 5) for awesome overtakes!
    const usedSpecs = CAR_SPECS.filter((_, idx) => idx !== selectedCarIdx);
    for (let i = 0; i < 5; i++) {
      const isCop = isPursuit && i < 3;
      const aiSpec = isCop ? CAR_SPECS[5] : usedSpecs[i % usedSpecs.length];
      const aiOpts = isCop
        ? { paintHex: 0x0f172a, glowHex: 0x3b82f6, wingStyle: 'gt', isPursuit: true }
        : {
            paintHex: PAINT_SWATCHES[(i * 2 + 1) % PAINT_SWATCHES.length].hex,
            glowHex: GLOW_SWATCHES[i % 5].hex,
            wingStyle: WING_STYLES[i % 3].id
          };
      aiRacers.push(spawnOnGrid(i, aiSpec, aiOpts));
    }

    const playerSpec = CAR_SPECS[selectedCarIdx];
    playerCar = spawnOnGrid(5, playerSpec, {
      paintHex: selectedPaintHex,
      glowHex: selectedGlowHex,
      wingStyle: selectedWing,
      withHeadlight: TRACK_SPECS[selectedTrackIdx].envType !== 'alpine'
    });

    // Place chase camera immediately behind player car
    camera.position.set(
      playerCar.x - Math.sin(playerCar.heading) * 11,
      playerCar.y + 3.8,
      playerCar.z - Math.cos(playerCar.heading) * 11
    );
    camera.lookAt(playerCar.x, playerCar.y + 1.2, playerCar.z);

    raceElapsed = 0;
    lapStartTime = 0;
    bestLapTime = Infinity;
    totalStyleScore = 0;
    activeDriftPts = 0;
    activeDriftMult = 1;
    activeDriftTimer = 0;
    maxMphReached = 0;
    pursuitTimeLimit = 120;

    countdownTimer = 3.2;
    lastCountdownBeep = 4;
    appState = 'countdown';

    document.getElementById('posTotal').textContent = '/ 6';
    document.getElementById('lapVal').textContent = `LAP 1 / ${totalLaps}`;
    document.getElementById('bestLapVal').textContent = 'BEST --:--.--';
    document.getElementById('styleScoreVal').textContent = 'STYLE: 0 PTS';
  }

  function finishRace(place) {
    appState = 'results';
    sfx.playFanfare();

    // Bank any active drift score
    if (activeDriftPts > 0) {
      totalStyleScore += Math.round(activeDriftPts * activeDriftMult);
      activeDriftPts = 0;
    }

    const modeSpec = MODE_SPECS[selectedModeIdx];
    document.getElementById('resModeTag').textContent = `${TRACK_SPECS[selectedTrackIdx].name} • ${modeSpec.name}`;
    document.getElementById('resPlace').textContent = place === 1 ? '🏆 1ST PLACE!' : `${ordinal(place)} PLACE!`;
    document.getElementById('resTime').textContent = formatRaceTime(raceElapsed);
    document.getElementById('resBestLap').textContent = formatRaceTime(bestLapTime);
    document.getElementById('resScore').textContent = totalStyleScore.toLocaleString() + ' PTS';
    document.getElementById('resTopSpeed').textContent = `${Math.round(maxMphReached)} MPH`;
    document.getElementById('resultsOverlay').classList.add('active');
  }

  // --- INPUT LISTENERS (DESKTOP + MOBILE MULTI-TOUCH) ---
  const keys = {};
  window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (appState === 'garage' && (e.code === 'Enter' || e.code === 'Space')) {
      e.preventDefault();
      launchRace();
      return;
    }
    if (e.code === 'KeyC' && appState !== 'garage') cycleCamera();
    if (e.code === 'KeyG' && appState !== 'garage') enterGarage();
    if (e.code === 'KeyM') toggleAudioMute();
  });
  window.addEventListener('keyup', e => {
    keys[e.code] = false;
  });

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

  function toggleBloom() {
    bloomEnabled = !bloomEnabled;
    document.getElementById('btnBloom').textContent = bloomEnabled ? '✨ Bloom' : '✨ Off';
    document.getElementById('btnBloom').classList.toggle('on', bloomEnabled);
    document.getElementById('btnGarageBloom').textContent = `✨ Bloom: ${bloomEnabled ? 'ON' : 'OFF'}`;
  }
  function cycleCamera() {
    cameraMode = (cameraMode + 1) % CAM_MODES.length;
    document.getElementById('btnCam').textContent = CAM_MODES[cameraMode];
  }
  function toggleAudioMute() {
    sfx.init();
    sfx.muted = !sfx.muted;
    document.getElementById('btnMute').textContent = sfx.muted ? '🔇 Mute (M)' : '🔊 Audio (M)';
    document.getElementById('btnMute').classList.toggle('on', !sfx.muted);
    document.getElementById('btnGarageAudio').textContent = `🔊 Sound: ${sfx.muted ? 'OFF' : 'ON'}`;
  }

  document.getElementById('launchRaceBtn').addEventListener('click', launchRace);
  document.getElementById('raceAgainBtn').addEventListener('click', launchRace);
  document.getElementById('backGarageBtn').addEventListener('click', enterGarage);
  document.getElementById('btnGarage').addEventListener('click', enterGarage);
  document.getElementById('btnCam').addEventListener('click', cycleCamera);
  document.getElementById('btnBloom').addEventListener('click', toggleBloom);
  document.getElementById('btnMute').addEventListener('click', toggleAudioMute);
  document.getElementById('btnGarageBloom').addEventListener('click', toggleBloom);
  document.getElementById('btnGarageAudio').addEventListener('click', toggleAudioMute);

  // --- CURVED RPM TACHOMETER & N2O CANVAS RENDERER ---
  const tachCtx = document.getElementById('tachCanvas').getContext('2d');
  const minimapCtx = document.getElementById('minimapCanvas').getContext('2d');

  function drawTachometer(mph, rpm, gear, n2o, nosFiring) {
    const ctx = tachCtx;
    const w = 244, h = 220, cx = 122, cy = 110, rad = 82;
    ctx.clearRect(0, 0, w, h);

    // Outer dark frosted circle backing
    ctx.fillStyle = 'rgba(8, 12, 24, 0.84)';
    ctx.beginPath();
    ctx.arc(cx, cy, rad + 10, 0, Math.PI * 2);
    ctx.fill();

    // RPM Arc (135° to 45° clockwise = 0.75*PI to 2.05*PI)
    const startA = Math.PI * 0.78;
    const endA = Math.PI * 2.08;
    const spanA = endA - startA;
    const rpmNorm = Math.max(0, Math.min(1, rpm / 9000));

    // Base Track
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx, cy, rad - 8, startA, endA);
    ctx.stroke();

    // Redline Zone (7.5k - 9k)
    ctx.strokeStyle = 'rgba(255, 30, 66, 0.45)';
    ctx.beginPath();
    ctx.arc(cx, cy, rad - 8, startA + spanA * 0.82, endA);
    ctx.stroke();

    // Active Lit RPM Arc
    const grad = ctx.createLinearGradient(cx - rad, cy, cx + rad, cy);
    grad.addColorStop(0, '#00f0ff');
    grad.addColorStop(0.7, '#ffd166');
    grad.addColorStop(1, '#ff1e42');
    ctx.strokeStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, rad - 8, startA, startA + spanA * rpmNorm);
    ctx.stroke();

    // Tick numbers 0..9
    ctx.font = '800 10px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 9; i++) {
      const a = startA + (i / 9) * spanA;
      ctx.fillStyle = i >= 8 ? '#ff4d6d' : '#cbd5e1';
      ctx.fillText(String(i), cx + Math.cos(a) * (rad - 26), cy + Math.sin(a) * (rad - 26));
    }

    // Glowing Needle
    const na = startA + rpmNorm * spanA;
    ctx.strokeStyle = nosFiring ? '#00f0ff' : '#ff2a85';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(na) * (rad - 18), cy + Math.sin(na) * (rad - 18));
    ctx.stroke();

    // Center Gear Badge
    ctx.fillStyle = '#ff2a85';
    ctx.font = '900 18px "Segoe UI", sans-serif';
    ctx.fillText(`G${gear}`, cx, cy - 22);

    // Big Digital MPH Readout
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 36px "Segoe UI", sans-serif';
    ctx.fillText(String(Math.round(mph)), cx, cy + 12);
    ctx.fillStyle = '#00f0ff';
    ctx.font = '800 11px "Segoe UI", sans-serif';
    ctx.fillText('MPH', cx, cy + 36);

    // Curved Bottom-Right N2O Nitrous Bar
    const nStart = Math.PI * 0.25;
    const nEnd = Math.PI * 0.68;
    const nNorm = Math.max(0, Math.min(1, n2o / 100));
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.arc(cx, cy, rad + 2, nStart, nEnd);
    ctx.stroke();

    ctx.strokeStyle = nosFiring ? '#ffffff' : '#00f0ff';
    ctx.beginPath();
    ctx.arc(cx, cy, rad + 2, nStart, nStart + (nEnd - nStart) * nNorm);
    ctx.stroke();

    ctx.fillStyle = '#00f0ff';
    ctx.font = '900 10px "Segoe UI", sans-serif';
    ctx.fillText('N2O', cx + 26, cy + 60);
  }

  // --- TRACK RADAR MINIMAP RENDERER ---
  function drawMinimap() {
    const ctx = minimapCtx;
    const w = 170, h = 170;
    ctx.clearRect(0, 0, w, h);
    if (!trackData) return;

    const pts = trackData.pts;
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (let i = 0; i < FRAMES_COUNT; i += 6) {
      if (pts[i].x < minX) minX = pts[i].x;
      if (pts[i].x > maxX) maxX = pts[i].x;
      if (pts[i].z < minZ) minZ = pts[i].z;
      if (pts[i].z > maxZ) maxZ = pts[i].z;
    }
    const span = Math.max(maxX - minX, maxZ - minZ) || 1;
    const scale = (w - 30) / span;
    const ox = (w - (maxX - minX) * scale) / 2 - minX * scale;
    const oz = (h - (maxZ - minZ) * scale) / 2 - minZ * scale;

    // Draw Circuit Outline
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.65)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let i = 0; i < FRAMES_COUNT; i += 4) {
      const mx = pts[i].x * scale + ox;
      const mz = pts[i].z * scale + oz;
      if (i === 0) ctx.moveTo(mx, mz);
      else ctx.lineTo(mx, mz);
    }
    ctx.closePath();
    ctx.stroke();

    // Finish Line Marker
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(pts[0].x * scale + ox - 3, pts[0].z * scale + oz - 3, 6, 6);

    // Draw AI Rivals (Amber or Flashing Red/Blue Cops)
    aiRacers.forEach(ai => {
      ctx.fillStyle = ai.isPursuit ? '#ff2a85' : '#ffd166';
      ctx.beginPath();
      ctx.arc(ai.x * scale + ox, ai.z * scale + oz, 4.0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Player Arrow/Dot
    ctx.fillStyle = '#4ade80';
    ctx.beginPath();
    ctx.arc(playerCar.x * scale + ox, playerCar.z * scale + oz, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // --- UPDATE RACER SPLINE PROGRESS & HILL ORIENTATION ---
  function updateRacerSplineTransform(racer, dt, isPlayer) {
    const prevU = racer.u;
    const proj = projectOntoTrack(racer.x, racer.z, racer.segIdx);
    racer.segIdx = proj.segIdx;
    racer.u = proj.u;
    racer.lat = proj.lat;

    // Seamless Barrier Collision & Arcade Wall-Glide
    if (Math.abs(proj.lat) > MAX_LAT) {
      const sign = Math.sign(proj.lat);
      racer.x = proj.qx + proj.R.x * (sign * MAX_LAT);
      racer.z = proj.qz + proj.R.z * (sign * MAX_LAT);
      racer.lat = sign * MAX_LAT;

      // Project heading gently back toward track tangent so car glides cleanly along wall
      const tYaw = Math.atan2(proj.T.x, proj.T.z);
      let dYaw = tYaw - racer.heading;
      while (dYaw > Math.PI) dYaw -= Math.PI * 2;
      while (dYaw < -Math.PI) dYaw += Math.PI * 2;
      racer.heading += dYaw * 0.28;
      racer.speed *= 0.92;

      if (isPlayer && Math.abs(racer.speed) > 18) {
        sfx.playScrape();
        const sx = proj.qx + proj.R.x * (sign * (MAX_LAT + 0.8));
        const sz = proj.qz + proj.R.z * (sign * (MAX_LAT + 0.8));
        for (let k = 0; k < 4; k++) {
          spawnParticle(true, sx, proj.qy + 0.5, sz, (Math.random() - 0.5) * 14, 4 + Math.random() * 6, (Math.random() - 0.5) * 14);
        }
      }
    }

    // Lap Crossing Detection
    if (prevU > 0.82 && proj.u < 0.18) {
      racer.lap += 1;
      if (isPlayer) {
        const totalLaps = MODE_SPECS[selectedModeIdx].laps;
        if (racer.lap > 0 && racer.lap <= totalLaps) {
          const lapDur = raceElapsed - lapStartTime;
          lapStartTime = raceElapsed;
          if (lapDur > 3 && lapDur < bestLapTime) {
            bestLapTime = lapDur;
            document.getElementById('bestLapVal').textContent = `BEST ${formatRaceTime(bestLapTime)}`;
          }
        } else if (racer.lap === 0) {
          lapStartTime = raceElapsed;
        }
        const dispLap = Math.max(1, Math.min(totalLaps, racer.lap + 1));
        document.getElementById('lapVal').textContent = `LAP ${dispLap} / ${totalLaps}`;
        if (racer.lap === totalLaps - 1 && totalLaps > 1) {
          showCallout('🔥 FINAL LAP!', 'PUSH IT TO THE REDLINE!');
        }
      }
    } else if (prevU < 0.18 && proj.u > 0.82) {
      racer.lap -= 1;
    }

    racer.totalProgress = racer.lap + racer.u;
    racer.y = proj.qy;

    // Hill Slope Pitching + Lateral Suspension Roll
    const fwdDot = Math.sin(racer.heading) * proj.T.x + Math.cos(racer.heading) * proj.T.z;
    const hillPitch = -Math.asin(Math.max(-0.45, Math.min(0.45, proj.T.y))) * fwdDot;
    racer.meshObj.root.position.set(racer.x, racer.y, racer.z);
    racer.meshObj.root.rotation.y = racer.heading + racer.driftAngle * 0.65;
    racer.meshObj.chassisGroup.rotation.x += (hillPitch - racer.meshObj.chassisGroup.rotation.x) * Math.min(1, dt * 12);

    // Spin Wheels & Steer Front Axles
    racer.meshObj.wheels.forEach(w => {
      w.spinGroup.rotation.x += racer.speed * dt * 2.2;
      if (w.front) w.steerPivot.rotation.y = racer.steerAngle * 0.45;
    });
  }

  // --- MAIN FRAME UPDATE ---
  let lastTime = performance.now();

  function update(dt) {
    if (appState === 'garage') {
      turntableGroup.rotation.y += dt * 0.52;
      camera.position.set(5.4, 2.35, 6.2);
      camera.lookAt(0, 0.72, 0);
      sfx.updateDrive(dt, false, 0, false, false);
      return;
    }

    if (appState === 'countdown') {
      countdownTimer -= dt;
      const ceilSec = Math.ceil(countdownTimer);
      const banner = document.getElementById('countdownBanner');
      if (ceilSec > 0 && ceilSec !== lastCountdownBeep) {
        lastCountdownBeep = ceilSec;
        banner.textContent = String(ceilSec);
        banner.classList.add('active');
        sfx.playCountdown(false);
      }
      if (countdownTimer <= 0) {
        appState = 'racing';
        banner.textContent = 'GO!!';
        sfx.playCountdown(true);
        setTimeout(() => banner.classList.remove('active'), 850);
      }

      // Revving animation during countdown!
      const gas = keys['KeyW'] || keys['ArrowUp'];
      playerCar.rpm += ((gas ? 7200 : 1400) - playerCar.rpm) * dt * 8;
      drawTachometer(0, playerCar.rpm, 1, playerCar.n2o, false);
      drawMinimap();
      sfx.updateDrive(dt, true, playerCar.rpm / 9000, false, false);
      return;
    }

    if (appState === 'results') {
      // Slow victory orbit around player car
      const ang = performance.now() * 0.0006;
      camera.position.set(playerCar.x + Math.sin(ang) * 10, playerCar.y + 3.8, playerCar.z + Math.cos(ang) * 10);
      camera.lookAt(playerCar.x, playerCar.y + 0.9, playerCar.z);
      sfx.updateDrive(dt, false, 0, false, false);
      return;
    }

    // --- ACTIVE RACING PHYSICS ---
    raceElapsed += dt;
    document.getElementById('raceTimeVal').textContent = `TIME ${formatRaceTime(raceElapsed)}`;

    const throttle = (keys['KeyW'] || keys['ArrowUp'] ? 1 : 0);
    const braking = (keys['KeyS'] || keys['ArrowDown'] ? 1 : 0);
    const steerInput = (keys['KeyA'] || keys['ArrowLeft'] ? 1 : 0) - (keys['KeyD'] || keys['ArrowRight'] ? 1 : 0);
    const handbrake = keys['ShiftLeft'] || keys['ShiftRight'] || keys['KeyB'];
    const nosPressed = keys['Space'];

    const spec = playerCar.spec;
    const isDriftMode = MODE_SPECS[selectedModeIdx].id === 'drift';
    const isPursuitMode = MODE_SPECS[selectedModeIdx].id === 'pursuit';

    // N2O Nitrous Boost
    const nosFiring = nosPressed && playerCar.n2o > 2 && throttle > 0;
    if (nosFiring) {
      playerCar.n2o = Math.max(0, playerCar.n2o - 26 * dt);
      playerCar.meshObj.nosGroup.visible = true;
    } else {
      playerCar.n2o = Math.min(100, playerCar.n2o + 4.5 * dt);
      playerCar.meshObj.nosGroup.visible = false;
    }

    // Longitudinal Acceleration, Braking & Aerodynamic Drag
    const maxSpd = spec.maxSpdPhys * (nosFiring ? 1.32 : 1.0);
    const acc = spec.accel * (nosFiring ? 1.75 : 1.0);
    if (throttle > 0) {
      playerCar.speed += acc * dt;
    } else if (braking > 0) {
      playerCar.speed -= (playerCar.speed > 2 ? 78 : 34) * dt;
    } else {
      playerCar.speed *= Math.pow(0.45, dt);
    }
    playerCar.speed = Math.max(-32, Math.min(maxSpd, playerCar.speed));

    // Steering & Arcade Drift Slip Angle
    const spdAbs = Math.abs(playerCar.speed);
    const isDrifting = (handbrake || (Math.abs(steerInput) > 0 && spdAbs > 46 && braking > 0)) && spdAbs > 22 && Math.abs(steerInput) > 0;
    const turnRate = (1.55 + (spec.handling / 100) * 1.15) * (isDrifting ? 1.32 : 1.0) * (spdAbs > 3 ? Math.sign(playerCar.speed) : 0);

    playerCar.heading += steerInput * turnRate * dt;
    playerCar.steerAngle = steerInput;

    const targetDrift = isDrifting ? steerInput * 0.44 : steerInput * Math.min(0.16, spdAbs / 420);
    playerCar.driftAngle += (targetDrift - playerCar.driftAngle) * Math.min(1, dt * 8);

    // Body Roll & Dive Pitch
    playerCar.meshObj.chassisGroup.rotation.z += (steerInput * Math.min(0.08, spdAbs / 800) - playerCar.meshObj.chassisGroup.rotation.z) * Math.min(1, dt * 10);
    playerCar.meshObj.tailMat.color.setHex(braking || handbrake ? 0xff7788 : 0xff2244);

    // Move Player in XZ (forward velocity blended slightly by drift slip vector!)
    const travelHeading = playerCar.heading - playerCar.driftAngle * 0.25;
    playerCar.x += Math.sin(travelHeading) * playerCar.speed * dt;
    playerCar.z += Math.cos(travelHeading) * playerCar.speed * dt;

    updateRacerSplineTransform(playerCar, dt, true);

    // Tire Smoke & Drift Combo Scoring
    if (isDrifting) {
      activeDriftTimer = 1.35;
      const ptsGain = spdAbs * 9.5 * (isDriftMode ? 1.8 : 1.0) * dt;
      activeDriftPts += ptsGain;
      activeDriftMult = activeDriftPts > 2500 ? 4 : activeDriftPts > 1200 ? 3 : activeDriftPts > 400 ? 2 : 1;
      playerCar.n2o = Math.min(100, playerCar.n2o + 18 * dt);

      const smokeX = playerCar.x - Math.sin(playerCar.heading) * 1.8 + (Math.random() - 0.5) * 1.4;
      const smokeZ = playerCar.z - Math.cos(playerCar.heading) * 1.8 + (Math.random() - 0.5) * 1.4;
      spawnParticle(false, smokeX, playerCar.y + 0.3, smokeZ, (Math.random() - 0.5) * 2, 1.5, (Math.random() - 0.5) * 2);
    } else if (activeDriftTimer > 0) {
      activeDriftTimer -= dt;
      if (activeDriftTimer <= 0 && activeDriftPts > 60) {
        const banked = Math.round(activeDriftPts * activeDriftMult);
        totalStyleScore += banked;
        showCallout(`💨 DRIFT x${activeDriftMult} BANKED!`, `+${banked.toLocaleString()} STYLE PTS`);
        activeDriftPts = 0;
        activeDriftMult = 1;
        document.getElementById('styleScoreVal').textContent = `STYLE: ${totalStyleScore.toLocaleString()} PTS`;
      }
    }

    const comboEl = document.getElementById('comboHud');
    if (activeDriftPts > 30) {
      comboEl.classList.add('active');
      comboEl.textContent = `💨 DRIFT x${activeDriftMult} • +${Math.round(activeDriftPts).toLocaleString()} PTS`;
    } else {
      comboEl.classList.remove('active');
    }

    // 6-Speed Simulated Gearbox & RPM
    const mph = spdAbs * 1.95;
    if (mph > maxMphReached) maxMphReached = mph;
    const prevGear = playerCar.gear;
    const gear = playerCar.speed < -1 ? 'R' : Math.min(6, Math.max(1, Math.floor(mph / 35) + 1));
    if (gear !== prevGear && typeof gear === 'number' && typeof prevGear === 'number' && gear > prevGear) {
      sfx.playShift();
    }
    playerCar.gear = gear;
    const gearSpan = 35;
    const inGearFrac = gear === 'R' ? 0.55 : (mph % gearSpan) / gearSpan;
    const targetRpm = mph < 2 ? (throttle > 0 ? 5400 : 1100) : 2600 + inGearFrac * 6100 + (nosFiring ? 600 : 0);
    playerCar.rpm += (targetRpm - playerCar.rpm) * Math.min(1, dt * 12);

    // --- AI RIVALS & PURSUIT INTERCEPTORS ---
    if (nearMissCooldown > 0) nearMissCooldown -= dt;
    aiRacers.forEach((ai, idx) => {
      // Look ahead on spline
      const lookSeg = (ai.segIdx + 12) % FRAMES_COUNT;
      const aimSeg = (ai.segIdx + 6) % FRAMES_COUNT;
      const aimP = trackData.pts[aimSeg];
      const aimR = trackData.rights[aimSeg];

      // Overtaking / Pursuit logic
      if (ai.isPursuit && Math.abs(ai.totalProgress - playerCar.totalProgress) < 0.08) {
        ai.targetLat += (playerCar.lat - ai.targetLat) * dt * 2.2;
        if (ai.meshObj.pursuitBarRed && ai.meshObj.pursuitBarBlue) {
          const strobe = Math.floor(performance.now() * 0.01) % 2 === 0;
          ai.meshObj.pursuitBarRed.visible = strobe;
          ai.meshObj.pursuitBarBlue.visible = !strobe;
        }
      } else if (Math.random() < dt * 0.45) {
        ai.targetLat = (Math.random() - 0.5) * 16;
      }

      const aimX = aimP.x + aimR.x * ai.targetLat;
      const aimZ = aimP.z + aimR.z * ai.targetLat;
      const desiredYaw = Math.atan2(aimX - ai.x, aimZ - ai.z);
      let dy = desiredYaw - ai.heading;
      while (dy > Math.PI) dy -= Math.PI * 2;
      while (dy < -Math.PI) dy += Math.PI * 2;
      ai.heading += dy * Math.min(1, dt * 5.2);
      ai.steerAngle = Math.max(-1, Math.min(1, dy * 2.5));

      // Corner braking & gentle competitive rubber-banding
      const curveAhead = Math.abs(trackData.curvatures[lookSeg]);
      const gapToPlayer = ai.totalProgress - playerCar.totalProgress;
      const rbFactor = gapToPlayer > 0.14 ? 0.9 : gapToPlayer < -0.14 ? 1.1 : 1.0;
      const aiMaxSpd = ai.spec.maxSpdPhys * ai.aiSkill * rbFactor * (curveAhead > 0.15 ? 0.72 : 0.96);

      if (ai.speed < aiMaxSpd) ai.speed += ai.spec.accel * 0.72 * dt;
      else ai.speed *= Math.pow(0.55, dt);

      ai.x += Math.sin(ai.heading) * ai.speed * dt;
      ai.z += Math.cos(ai.heading) * ai.speed * dt;
      updateRacerSplineTransform(ai, dt, false);

      // Car-to-Car Collision & Near Miss Bonus
      const dx = playerCar.x - ai.x;
      const dz = playerCar.z - ai.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 3.9 && dist > 0.01) {
        const push = (3.9 - dist) * 0.5;
        const nx = dx / dist;
        const nz = dz / dist;
        playerCar.x += nx * push;
        playerCar.z += nz * push;
        ai.x -= nx * push;
        ai.z -= nz * push;
        playerCar.speed *= 0.94;
        sfx.playScrape();
        spawnParticle(true, (playerCar.x + ai.x) / 2, playerCar.y + 0.7, (playerCar.z + ai.z) / 2, (Math.random() - 0.5) * 12, 6, (Math.random() - 0.5) * 12);
      } else if (dist < 7.2 && spdAbs > 48 && nearMissCooldown <= 0) {
        nearMissCooldown = 2.0;
        totalStyleScore += 350;
        playerCar.n2o = Math.min(100, playerCar.n2o + 12);
        document.getElementById('styleScoreVal').textContent = `STYLE: ${totalStyleScore.toLocaleString()} PTS`;
        showCallout('⚡ NEAR MISS PASS!', '+350 PTS & +12% N2O');
      }
    });

    // Update Live Race Position (1st..6th)
    const standings = [playerCar, ...aiRacers].sort((a, b) => b.totalProgress - a.totalProgress);
    const playerPlace = standings.indexOf(playerCar) + 1;
    document.getElementById('posVal').textContent = ordinal(playerPlace);

    if (isPursuitMode) {
      pursuitTimeLimit = Math.max(0, pursuitTimeLimit - dt);
      document.getElementById('pursuitTimer').textContent = `EVASION WINDOW: ${formatRaceTime(pursuitTimeLimit)}`;
      if (pursuitTimeLimit <= 0) {
        finishRace(playerPlace);
        return;
      }
    }

    // Check Race Finish Condition
    const reqLaps = MODE_SPECS[selectedModeIdx].laps;
    if (playerCar.lap >= reqLaps) {
      finishRace(playerPlace);
      return;
    }

    // Update 3D Smoke/Sparks & Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const pt = particles[i];
      pt.life -= dt;
      pt.mesh.position.x += pt.vx * dt;
      pt.mesh.position.y += pt.vy * dt;
      pt.mesh.position.z += pt.vz * dt;
      if (pt.isSpark) pt.vy -= 22 * dt;
      else pt.mesh.scale.multiplyScalar(1 + dt * 1.8);
      if (pt.life <= 0) {
        raceWorldGroup.remove(pt.mesh);
        particles.splice(i, 1);
      }
    }

    // Update Sun Shadow Target to track player
    sunLight.position.set(playerCar.x + 120, 220, playerCar.z + 100);
    sunLight.target.position.set(playerCar.x, playerCar.y, playerCar.z);
    sunLight.target.updateMatrixWorld();

    // Dynamic NFS Chase Camera (3 Views: Chase / Hood / Heli)
    const camCfg = [
      { dist: 9.2, height: 3.3, ahead: 9.0 },
      { dist: 0.4, height: 1.7, ahead: 16.0 },
      { dist: 19.0, height: 11.5, ahead: 10.0 }
    ][cameraMode];

    const shake = nosFiring ? (Math.random() - 0.5) * 0.14 : 0;
    const camTargetX = playerCar.x - Math.sin(playerCar.heading) * camCfg.dist + shake;
    const camTargetZ = playerCar.z - Math.cos(playerCar.heading) * camCfg.dist + shake;
    const camTargetY = playerCar.y + camCfg.height + shake * 0.5;

    const camLerp = cameraMode === 1 ? 1.0 : Math.min(1, dt * 11.0);
    camera.position.x += (camTargetX - camera.position.x) * camLerp;
    camera.position.z += (camTargetZ - camera.position.z) * camLerp;
    camera.position.y += (camTargetY - camera.position.y) * camLerp;

    const targetFov = nosFiring ? 78 : 62 + Math.min(10, mph * 0.045);
    if (Math.abs(camera.fov - targetFov) > 0.15) {
      camera.fov += (targetFov - camera.fov) * Math.min(1, dt * 7);
      camera.updateProjectionMatrix();
    }

    camera.lookAt(
      playerCar.x + Math.sin(playerCar.heading) * camCfg.ahead,
      playerCar.y + 1.15,
      playerCar.z + Math.cos(playerCar.heading) * camCfg.ahead
    );

    // Update Audio & HUD Canvases
    sfx.updateDrive(dt, true, playerCar.rpm / 9000, isDrifting, nosFiring);
    drawTachometer(mph, playerCar.rpm, playerCar.gear, playerCar.n2o, nosFiring);
    drawMinimap();
  }

  // --- HANDLE WINDOW RESIZE ---
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (composer) composer.setSize(window.innerWidth, window.innerHeight);
    if (bloomPass) bloomPass.setSize(window.innerWidth, window.innerHeight);
  });

  // --- SUPPORT URL PARAMETERS FOR QUICK TESTING / SHARING ---
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('track')) {
    const ti = parseInt(urlParams.get('track'), 10);
    if (ti >= 0 && ti < TRACK_SPECS.length) selectedTrackIdx = ti;
  }
  if (urlParams.get('mode')) {
    const mi = MODE_SPECS.findIndex(m => m.id === urlParams.get('mode'));
    if (mi >= 0) selectedModeIdx = mi;
  }
  if (urlParams.get('autostart') === '1') {
    launchRace();
    countdownTimer = 0.05; // Skip countdown on autostart for immediate action!
  } else {
    enterGarage();
  }

  // --- MAIN RENDER LOOP (BLOOM OR FALLBACK) ---
  function animate(now) {
    requestAnimationFrame(animate);
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    update(dt);

    if (composer && bloomEnabled) {
      composer.render();
    } else {
      renderer.render(scene, camera);
    }
  }
  requestAnimationFrame(animate);
})();
