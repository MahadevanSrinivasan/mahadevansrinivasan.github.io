// =============================================================================
// APEX NITRO 3D (v2) — Street & Canyon Arcade Racing Engine
// Three.js WebGL + PMREM PBR Clear-Coat + UnrealBloom + Weight-Transfer Drift
// + 6-Speed Manual/Auto Gearbox + Cockpit & Live Rear-View Mirror + 3D Speedshop
// =============================================================================
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

  const RIM_STYLES = [
    { id: 'chrome', label: 'Chrome', hex: 0xe2e8f0, metal: 0.92, rough: 0.14 },
    { id: 'gold', label: 'Solar Gold', hex: 0xfacc15, metal: 0.88, rough: 0.18 },
    { id: 'matte', label: 'Stealth Matte', hex: 0x1e293b, metal: 0.45, rough: 0.65 },
    { id: 'cyan', label: 'Electric Cyan', hex: 0x00f0ff, metal: 0.86, rough: 0.18 }
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
      desc: 'Wet puddles, falling rain, streetlights & light-tunnels',
      routeSub: 'Shibuya Crossing → Wangan Finale',
      sky: 0x03060f,
      fogColor: 0x030610,
      fogDensity: 0.00095,
      ambient: 0x2f4370,
      ambientInt: 0.30,
      sunColor: 0x6ea4f5,
      sunInt: 0.58,
      roadRoughness: 0.72,
      roadMetalness: 0.32,
      barrierTrim: 0x22d3ee,
      chevronColor: 0x22d3ee,
      exposure: 1.05,
      bloomStrength: 0.66,
      bloomRadius: 0.36,
      bloomThreshold: 0.74,
      envType: 'tokyo',
      landmarks: [
        { label: 'Shibuya Scramble Crossing', type: 'start', seg: 0, color: '#22d3ee' },
        { label: 'Shibuya Station', type: 'station', pos: [215, 6, 40], color: '#4ade80' },
        { label: 'Wangan Light Tunnel', type: 'mid', seg: 132, color: '#a855f7' },
        { label: 'Shibuya Stream · Apex Finale', type: 'finish', seg: 258, color: '#ef4444' }
      ],
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
      desc: 'Crimson-amber dusk cliffs, coastal bridge, palms & glowing portals',
      routeSub: 'Coastal Cliffs → Sunset Bridge',
      sky: 0x1a0e2a,
      fogColor: 0x2b152a,
      fogDensity: 0.00095,
      ambient: 0x705072,
      ambientInt: 0.68,
      sunColor: 0xff9e44,
      sunInt: 0.96,
      roadRoughness: 0.78,
      roadMetalness: 0.24,
      barrierTrim: 0xfb923c,
      chevronColor: 0xf59e0b,
      exposure: 1.02,
      bloomStrength: 0.52,
      bloomRadius: 0.34,
      bloomThreshold: 0.80,
      envType: 'canyon',
      landmarks: [
        { label: 'Pacific Coastal Pier', type: 'start', seg: 0, color: '#fb923c' },
        { label: 'Sunset Bay Bridge', type: 'mid', seg: 165, color: '#f59e0b' },
        { label: 'Red Rock Overlook', type: 'mid', seg: 390, color: '#a855f7' },
        { label: 'Canyon Apex Finale', type: 'finish', seg: 270, color: '#ef4444' }
      ],
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
        [-380, 0, 40],
        [-250, 0, 175],
        [-105, 0, 225],
        [0, 0, 165]
      ]
    },
    {
      id: 'alpine',
      name: '🏔️ Alpine Horizon Speedway',
      desc: 'Alpenglow mountain twilight, high-speed chicanes, pines & snow peaks',
      routeSub: 'Nordic Pass → Glacier Summit',
      sky: 0x0a182e,
      fogColor: 0x10233f,
      fogDensity: 0.00095,
      ambient: 0x54729c,
      ambientInt: 0.72,
      sunColor: 0xbae6fd,
      sunInt: 0.90,
      roadRoughness: 0.78,
      roadMetalness: 0.24,
      barrierTrim: 0x38bdf8,
      chevronColor: 0xfacc15,
      exposure: 1.00,
      bloomStrength: 0.52,
      bloomRadius: 0.34,
      bloomThreshold: 0.80,
      envType: 'alpine',
      landmarks: [
        { label: 'Stelvio Summit Gate', type: 'start', seg: 0, color: '#38bdf8' },
        { label: 'Nordic Ice Tunnel', type: 'mid', seg: 132, color: '#22d3ee' },
        { label: 'Timberline Viaduct', type: 'mid', seg: 395, color: '#4ade80' },
        { label: 'Glacier Peak Finish', type: 'finish', seg: 265, color: '#ef4444' }
      ],
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
        [-410, 2, 20],
        [-260, 0, 155],
        [-110, 0, 220],
        [0, 0, 165]
      ]
    }
  ];

  const MODE_SPECS = [
    { id: 'race', name: '🏁 Underground Circuit', desc: '3 Laps vs. 5 AI Rivals — Claim P1!', laps: 3 },
    { id: 'drift', name: '💨 Drift Touge Showdown', desc: '2 Laps — Weight-Transfer Drift Combos!', laps: 2 },
    { id: 'pursuit', name: '🚓 Hot Pursuit Escape', desc: '2 Laps — Outrun 3 AI Interceptors on Heat 3!', laps: 2 }
  ];

  const DIFF_SPECS = [
    {
      id: 'easy',
      name: '🟢 Easy — Arcade Assist',
      desc: 'Smart hairpin braking, full stability assist & approachable rivals',
      hudBtn: '🟢 Easy',
      mobileBtn: '🟢 Easy',
      headerBtn: '🟢 Mode: EASY',
      callout: 'Full Stability & Smart Hairpin Assist',
      cruiseTilt: 0.86, cruiseTouch: 0.88, minTilt: 0.58, minTouch: 0.60,
      kStart: 0.15, kSpan: 0.28, cornerDrop: 0.24, capNoNos: 0.92, capNos: 1.24,
      espMult: 1.00, edgeTilt: 7.0, edgeTouch: 7.6, cushMult: 1.00,
      aiTilt: 0.76, aiTouch: 0.80, aiDesktop: 0.94, aiCrn: 0.66, aiStr: 0.94, aiAcc: 0.72, rbLead: 0.88, rbBehind: 1.06
    },
    {
      id: 'medium',
      name: '🟡 Medium — Street Tuner',
      desc: '188+ MPH cruise, lighter corner assist & competitive street rivals',
      hudBtn: '🟡 Med',
      mobileBtn: '🟡 Med',
      headerBtn: '🟡 Mode: MED',
      callout: '188+ MPH Pace • Lighter Assist & Faster Rivals',
      cruiseTilt: 0.93, cruiseTouch: 0.95, minTilt: 0.68, minTouch: 0.70,
      kStart: 0.19, kSpan: 0.28, cornerDrop: 0.21, capNoNos: 0.98, capNos: 1.28,
      espMult: 0.72, edgeTilt: 8.4, edgeTouch: 8.8, cushMult: 0.62,
      aiTilt: 0.95, aiTouch: 0.97, aiDesktop: 1.00, aiCrn: 0.76, aiStr: 0.97, aiAcc: 0.86, rbLead: 0.93, rbBehind: 1.09
    },
    {
      id: 'hard',
      name: '🔴 Hard — Pro Touge',
      desc: '200+ MPH full throttle, minimal assist & aggressive pro AI pack',
      hudBtn: '🔴 Hard',
      mobileBtn: '🔴 Hard',
      headerBtn: '🔴 Mode: HARD',
      callout: '200+ MPH Pro Speed • Minimal Assist & Fierce AI',
      cruiseTilt: 0.99, cruiseTouch: 1.00, minTilt: 0.78, minTouch: 0.80,
      kStart: 0.24, kSpan: 0.28, cornerDrop: 0.17, capNoNos: 1.03, capNos: 1.34,
      espMult: 0.45, edgeTilt: 9.6, edgeTouch: 10.0, cushMult: 0.30,
      aiTilt: 1.00, aiTouch: 1.03, aiDesktop: 1.06, aiCrn: 0.82, aiStr: 1.00, aiAcc: 0.96, rbLead: 0.96, rbBehind: 1.12
    }
  ];

  // --- PROCEDURAL WEB AUDIO ENGINE (RPM ENGINE + TURBO + TIRE SQUEAL + N2O + BACKFIRE + SYNTH) ---
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
      this.noiseBuf = null;
      this.running = false;
      this.synthBeatTimer = 0;
      this.synthStep = 0;
    }

    init() {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        this.ctx = new AC();

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

        const bufSize = this.ctx.sampleRate * 2;
        this.noiseBuf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
        const data = this.noiseBuf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

        const screechSrc = this.ctx.createBufferSource();
        screechSrc.buffer = this.noiseBuf;
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
        nosSrc.buffer = this.noiseBuf;
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

      const baseFreq = 48 + rpmNorm * 145 + (nosActive ? 28 : 0);
      this.osc1.frequency.setTargetAtTime(baseFreq, now, 0.04);
      this.osc2.frequency.setTargetAtTime(baseFreq * 1.99, now, 0.04);
      this.engFilter.frequency.setTargetAtTime(220 + rpmNorm * 980 + (nosActive ? 450 : 0), now, 0.05);
      this.engGain.gain.setTargetAtTime(0.065 + rpmNorm * 0.045, now, 0.05);

      this.screechGain.gain.setTargetAtTime(drifting ? 0.055 : 0, now, 0.05);
      this.nosGain.gain.setTargetAtTime(nosActive ? 0.11 : 0, now, 0.05);

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

    playBackfire() {
      if (this.muted || !this.ctx || !this.noiseBuf) return;
      try {
        const now = this.ctx.currentTime;
        const src = this.ctx.createBufferSource();
        src.buffer = this.noiseBuf;
        const bp = this.ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.setValueAtTime(340, now);
        bp.Q.value = 1.4;
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0.16, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        src.connect(bp);
        bp.connect(g);
        g.connect(this.ctx.destination);
        src.start(now);
        src.stop(now + 0.1);
        this.tone(110, 0.07, 'sawtooth', 0.08, 42);
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
      ctx.fillStyle = isNight ? '#070b14' : '#121622';
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 4200; i++) {
        ctx.fillStyle = i % 2 ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.12)';
        ctx.fillRect(Math.random() * w, Math.random() * h, 2, 4);
      }

      for (let y = 0; y < h; y += 128) {
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(0, y, 20, 64);
        ctx.fillRect(w - 20, y, 20, 64);
        ctx.fillStyle = isNight ? '#cbd5e1' : '#94a3b8';
        ctx.fillRect(0, y + 64, 20, 64);
        ctx.fillRect(w - 20, y + 64, 20, 64);
      }

      ctx.fillStyle = isNight ? '#22d3ee' : '#f59e0b';
      ctx.fillRect(24, 0, 4, h);
      ctx.fillRect(w - 28, 0, 4, h);

      // 2 long natural highway dashes per tile (paired with uvScale = 0.032 -> ~15.6m spacing)
      ctx.fillStyle = isNight ? 'rgba(226, 232, 240, 0.68)' : 'rgba(226, 232, 240, 0.75)';
      for (let y = 24; y < h; y += 256) {
        ctx.fillRect(w * 0.25 - 3, y, 6, 118);
        ctx.fillRect(w * 0.75 - 3, y, 6, 118);
      }
      ctx.fillStyle = '#fbbf24';
      for (let y = 24; y < h; y += 256) {
        ctx.fillRect(w * 0.5 - 3, y, 6, 126);
      }
    });
  }

  function makeRoadRoughnessTexture(isNight) {
    return makeCanvasTex(512, 512, (ctx, w, h) => {
      ctx.fillStyle = isNight ? '#707070' : '#c0c0c0';
      ctx.fillRect(0, 0, w, h);

      const puddleCount = isNight ? 24 : 7;
      for (let i = 0; i < puddleCount; i++) {
        const px = 44 + Math.random() * (w - 88);
        const py = Math.random() * h;
        const rx = 20 + Math.random() * 44;
        const ry = 48 + Math.random() * 96;
        const grad = ctx.createRadialGradient(px, py, 4, px, py, Math.max(rx, ry));
        grad.addColorStop(0.0, isNight ? 'rgba(10,10,10,0.96)' : 'rgba(65,65,65,0.6)');
        grad.addColorStop(0.55, isNight ? 'rgba(28,28,28,0.82)' : 'rgba(110,110,110,0.35)');
        grad.addColorStop(1.0, 'rgba(112,112,112,0.0)');
        ctx.fillStyle = grad;
        ctx.save();
        ctx.translate(px, py);
        ctx.scale(rx / Math.max(rx, ry), ry / Math.max(rx, ry));
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(rx, ry), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });
  }

  function makeGarageFloorTexture() {
    return makeCanvasTex(512, 512, (ctx, w, h) => {
      ctx.fillStyle = '#070b14';
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 1800; i++) {
        ctx.fillStyle = i % 2 ? 'rgba(255,255,255,0.022)' : 'rgba(0,0,0,0.09)';
        ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
      }
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.14)';
      ctx.lineWidth = 2;
      for (let k = 0; k <= 512; k += 128) {
        ctx.beginPath(); ctx.moveTo(k, 0); ctx.lineTo(k, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, k); ctx.lineTo(w, k); ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.10)';
      ctx.lineWidth = 2;
      ctx.strokeRect(4, 4, w - 8, h - 8);
    }, 6, 6);
  }

  // Architectural dark obsidian curtain-wall skyscraper glass texture (512x512)
  function makeBuildingTexture(accentHexCss) {
    return makeCanvasTex(512, 512, (ctx, w, h) => {
      const baseGrad = ctx.createLinearGradient(0, 0, 0, h);
      baseGrad.addColorStop(0, '#060b14');
      baseGrad.addColorStop(1, '#0b1322');
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, w, h);

      const cols = 12;
      const rows = 28;
      const cw = w / cols;
      const ch = h / rows;

      for (let r = 0; r < rows; r++) {
        const floorLitBias = Math.random() < 0.28 ? 0.34 : 0.08;
        const bandHue = (r % 9 === 0) ? accentHexCss : (Math.random() < 0.55 ? '#fef3c7' : '#bae6fd');
        for (let c = 0; c < cols; c++) {
          const rng = Math.random();
          if (rng < floorLitBias) {
            ctx.fillStyle = rng < floorLitBias * 0.25 ? accentHexCss : bandHue;
            ctx.globalAlpha = 0.25 + Math.random() * 0.55;
            ctx.fillRect(c * cw + 4, r * ch + 3, cw - 8, ch - 6);
            ctx.globalAlpha = 1.0;
          } else {
            ctx.fillStyle = rng > 0.72 ? '#0f1b2e' : '#09111f';
            ctx.fillRect(c * cw + 4, r * ch + 3, cw - 8, ch - 6);
          }
        }
      }

      // Fine dark steel curtain-wall mullions
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.lineWidth = 3;
      for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        ctx.moveTo(c * cw, 0);
        ctx.lineTo(c * cw, h);
        ctx.stroke();
      }
      ctx.lineWidth = 2;
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * ch);
        ctx.lineTo(w, r * ch);
        ctx.stroke();
      }
    });
  }

  // Dark-mode Google-Maps-style cartographic city street ground for the 3D Aerial Transit Map
  function makeCartographicMapTexture(trackIdx) {
    return makeCanvasTex(1024, 1024, (ctx, w, h) => {
      const isCanyon = trackIdx === 1;
      const isAlpine = trackIdx === 2;
      ctx.fillStyle = isCanyon ? '#080912' : isAlpine ? '#050a14' : '#04070f';
      ctx.fillRect(0, 0, w, h);

      // Subtle dark charcoal land parcels
      ctx.fillStyle = isCanyon ? '#0e101c' : isAlpine ? '#091120' : '#090f1d';
      for (let y = 16; y < h; y += 64) {
        for (let x = 16; x < w; x += 64) {
          if (Math.random() > 0.22) {
            const bw = 38 + Math.random() * 18;
            const bh = 38 + Math.random() * 18;
            ctx.fillRect(x, y, bw, bh);
          }
        }
      }

      // Curved dark navy canal / waterway corridor
      ctx.strokeStyle = isCanyon ? '#05101c' : '#03060d';
      ctx.lineWidth = 44;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.72);
      ctx.bezierCurveTo(w * 0.34, h * 0.62, w * 0.62, h * 0.84, w, h * 0.56);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(30, 58, 95, 0.22)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Faint gray-slate minor street grid & diagonal avenues
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.065)';
      ctx.lineWidth = 1.5;
      for (let k = 0; k <= w; k += 64) {
        ctx.beginPath(); ctx.moveTo(k, 0); ctx.lineTo(k, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, k); ctx.lineTo(w, k); ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.10)';
      ctx.lineWidth = 3;
      for (let k = 128; k < w; k += 256) {
        ctx.beginPath(); ctx.moveTo(k, 0); ctx.lineTo(k, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, k); ctx.lineTo(w, k); ctx.stroke();
      }
    }, 1, 1);
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
      ctx.fillStyle = 'rgba(34, 211, 238, 0.9)';
      ctx.fillRect(0, 0, w, 10);
      ctx.fillRect(0, h - 10, w, 10);
    });
  }

  function makeRadialGlowTexture() {
    return makeCanvasTex(256, 256, (ctx, w, h) => {
      const cx = w / 2, cy = h / 2;
      const g = ctx.createRadialGradient(cx, cy, 4, cx, cy, w * 0.48);
      g.addColorStop(0.0, 'rgba(255, 255, 255, 0.90)');
      g.addColorStop(0.35, 'rgba(255, 255, 255, 0.45)');
      g.addColorStop(0.75, 'rgba(255, 255, 255, 0.10)');
      g.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    });
  }

  function makeHeadlightBeamTexture() {
    return makeCanvasTex(256, 256, (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      const grad = ctx.createLinearGradient(0, h, 0, 0);
      grad.addColorStop(0.0, 'rgba(224, 247, 255, 0.62)');
      grad.addColorStop(0.45, 'rgba(186, 230, 253, 0.24)');
      grad.addColorStop(1.0, 'rgba(186, 230, 253, 0.0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(w * 0.38, h);
      ctx.lineTo(w * 0.62, h);
      ctx.lineTo(w * 0.96, 0);
      ctx.lineTo(w * 0.04, 0);
      ctx.closePath();
      ctx.fill();
    }, 1, 1);
  }

  const TEXTURES = {
    roadNight: makeRoadTexture(true),
    roadDay: makeRoadTexture(false),
    roughNight: makeRoadRoughnessTexture(true),
    roughDay: makeRoadRoughnessTexture(false),
    garageFloor: makeGarageFloorTexture(),
    bldgCyan: makeBuildingTexture('#22d3ee'),
    bldgAmber: makeBuildingTexture('#f59e0b'),
    bldgViolet: makeBuildingTexture('#a855f7'),
    cartoMap: [makeCartographicMapTexture(0), makeCartographicMapTexture(1), makeCartographicMapTexture(2)],
    checkered: makeCheckeredTexture(),
    chevronCyan: makeChevronTexture('#22d3ee'),
    chevronOrange: makeChevronTexture('#f59e0b'),
    chevronGold: makeChevronTexture('#facc15'),
    radialGlow: makeRadialGlowTexture(),
    headlightBeam: makeHeadlightBeamTexture()
  };

  // --- THREE.JS SCENE, PROCEDURAL SKY DOME, ARCHITECTURAL PMREM & HDR COMPOSER ---
  const canvas = document.getElementById('gameCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(pixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  renderer.outputEncoding = THREE.sRGBEncoding;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x040814);
  scene.fog = new THREE.FogExp2(0x070d22, 0.00125);

  const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.35, 2400);
  camera.position.set(0, 4, 8);

  // Procedural GLSL Sky Dome (follows camera position, fog: false)
  const skyDomeMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uMode: { value: 0 },
      uTime: { value: 0 },
      uSunDir: { value: new THREE.Vector3(0.76, 0.14, -0.63).normalize() }
    },
    vertexShader: `
      varying vec3 vWorldDir;
      void main() {
        vWorldDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform int uMode;
      uniform float uTime;
      uniform vec3 uSunDir;
      varying vec3 vWorldDir;

      float hash21(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      void main() {
        vec3 dir = normalize(vWorldDir);
        float y = clamp(dir.y, -0.25, 1.0);
        float h = clamp(y, 0.0, 1.0);
        float az = atan(dir.z, dir.x);
        vec3 col = vec3(0.0);

        if (uMode == 0) {
          // Tokyo Midnight Obsidian -> Deep Navy-Indigo Urban Haze + Cyan/Amber Glow + Stars + Skyline
          vec3 zenith = vec3(0.008, 0.020, 0.051);
          vec3 mid = vec3(0.025, 0.052, 0.125);
          vec3 horizon = vec3(0.051, 0.098, 0.212);
          col = mix(horizon, mid, smoothstep(0.0, 0.28, h));
          col = mix(col, zenith, smoothstep(0.22, 0.85, h));

          float horizonBand = exp(-abs(y) * 9.5);
          float cityWarm = 0.5 + 0.5 * sin(az * 3.0 + 0.8);
          col += vec3(0.04, 0.18, 0.28) * horizonBand * (0.55 + 0.45 * (1.0 - cityWarm));
          col += vec3(0.26, 0.13, 0.03) * horizonBand * cityWarm * 0.48;

          // Procedural Crisp Starfield
          if (y > 0.06) {
            vec2 starUv = vec2(az * 24.0, asin(clamp(dir.y, -1.0, 1.0)) * 36.0);
            vec2 gv = fract(starUv) - 0.5;
            vec2 id = floor(starUv);
            float n = hash21(id);
            if (n > 0.90) {
              float d = length(gv - (vec2(n, fract(n * 17.3)) - 0.5) * 0.55);
              float star = smoothstep(0.08, 0.01, d) * smoothstep(0.06, 0.26, y);
              float twinkle = 0.72 + 0.28 * sin(uTime * 2.2 + n * 40.0);
              col += vec3(0.75, 0.88, 1.0) * star * twinkle * 1.1;
            }
          }

          // Subtle Distant Dark Skyline Silhouette Band
          float bId = floor(az * 28.0);
          float bHeight = 0.014 + hash21(vec2(bId, 7.0)) * 0.052;
          if (y > -0.02 && y < bHeight) {
            col *= 0.22;
            float winHash = hash21(vec2(floor(az * 140.0), floor(y * 220.0)));
            if (winHash > 0.92 && y > 0.004) {
              col += mix(vec3(0.15, 0.75, 0.95), vec3(0.95, 0.65, 0.22), fract(winHash * 31.0)) * 0.35;
            }
          }
        } else if (uMode == 1) {
          // Pacific Sunset Canyon: Deep Twilight Violet -> Vibrant Coral-Amber Horizon + Solar Disc
          vec3 zenith = vec3(0.043, 0.035, 0.125);
          vec3 mid = vec3(0.22, 0.09, 0.24);
          vec3 horizon = vec3(0.92, 0.35, 0.06);
          col = mix(horizon, mid, smoothstep(0.0, 0.28, h));
          col = mix(col, zenith, smoothstep(0.20, 0.82, h));

          float sunDot = max(0.0, dot(dir, normalize(uSunDir)));
          float sunDisc = smoothstep(0.9968, 0.9985, sunDot);
          float sunHalo = pow(sunDot, 22.0) * 0.85 + pow(sunDot, 5.0) * 0.28;
          col += vec3(1.0, 0.58, 0.22) * sunHalo;
          col += vec3(1.5, 1.15, 0.72) * sunDisc;
        } else {
          // Alpine Horizon: Nordic Twilight Navy -> Arctic Ice-Cyan Horizon + Moon Glow
          vec3 zenith = vec3(0.027, 0.075, 0.161);
          vec3 mid = vec3(0.06, 0.17, 0.34);
          vec3 horizon = vec3(0.22, 0.74, 0.97);
          col = mix(horizon, mid, smoothstep(0.0, 0.26, h));
          col = mix(col, zenith, smoothstep(0.18, 0.80, h));

          vec3 moonDir = normalize(vec3(-0.55, 0.34, -0.76));
          float moonDot = max(0.0, dot(dir, moonDir));
          float moonDisc = smoothstep(0.9982, 0.9992, moonDot);
          float moonHalo = pow(moonDot, 36.0) * 0.65 + pow(moonDot, 8.0) * 0.18;
          col += vec3(0.45, 0.82, 1.0) * moonHalo + vec3(1.1, 1.25, 1.4) * moonDisc;

          if (y > 0.12) {
            vec2 starUv = vec2(az * 24.0, asin(clamp(dir.y, -1.0, 1.0)) * 36.0);
            vec2 id = floor(starUv);
            float n = hash21(id);
            if (n > 0.93) {
              float d = length(fract(starUv) - 0.5);
              col += vec3(0.7, 0.9, 1.0) * smoothstep(0.07, 0.01, d) * smoothstep(0.12, 0.35, y) * 0.75;
            }
          }
        }

        gl_FragColor = vec4(col, 1.0);
      }
    `
  });
  const skyDome = new THREE.Mesh(new THREE.SphereGeometry(1800, 32, 20), skyDomeMat);
  skyDome.frustumCulled = false;
  skyDome.renderOrder = -10;
  scene.add(skyDome);

  // Build architectural PMREM PBR environment cubemaps (vertical cyan/amber/white softbox strips)
  const ENV_MAPS = { night: null, canyon: null, alpine: null, garage: null };
  function buildEnvMaps() {
    try {
      if (!THREE.PMREMGenerator) return;
      const pmrem = new THREE.PMREMGenerator(renderer);
      pmrem.compileCubemapShader();

      function createEnv(skyHex, groundHex, strips) {
        const s = new THREE.Scene();
        s.background = new THREE.Color(skyHex);
        const hemi = new THREE.HemisphereLight(skyHex, groundHex, 1.35);
        s.add(hemi);
        const dome = new THREE.Mesh(
          new THREE.SphereGeometry(50, 20, 14),
          new THREE.MeshBasicMaterial({ color: skyHex, side: THREE.BackSide })
        );
        s.add(dome);
        const floor = new THREE.Mesh(
          new THREE.PlaneGeometry(90, 90),
          new THREE.MeshBasicMaterial({ color: groundHex, side: THREE.DoubleSide })
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -18;
        s.add(floor);
        strips.forEach(([x, y, z, w, h, d, col]) => {
          const panel = new THREE.Mesh(
            new THREE.BoxGeometry(w, h, d),
            new THREE.MeshBasicMaterial({ color: col })
          );
          panel.position.set(x, y, z);
          s.add(panel);
        });
        const rt = pmrem.fromScene(s, 0.025);
        return rt.texture;
      }

      ENV_MAPS.night = createEnv(0x071024, 0x04070e, [
        [-24, 14, -24, 2.2, 26, 2.2, 0x22d3ee],
        [24, 14, -24, 2.2, 26, 2.2, 0xf59e0b],
        [-28, 16, 12, 2.4, 24, 2.4, 0xf8fafc],
        [28, 16, 12, 2.4, 24, 2.4, 0x22d3ee],
        [0, 32, -8, 28, 2.0, 3.0, 0xe0f2fe],
        [0, 28, 24, 24, 2.0, 3.0, 0xa855f7]
      ]);
      ENV_MAPS.canyon = createEnv(0x200e2c, 0x12080d, [
        [28, 14, -26, 3.2, 22, 20, 0xfb923c],
        [-28, 16, -12, 2.4, 24, 2.4, 0xf59e0b],
        [24, 18, 18, 2.2, 20, 2.2, 0xfef3c7],
        [0, 30, 0, 26, 2.2, 26, 0x7dd3fc]
      ]);
      ENV_MAPS.alpine = createEnv(0x0c1e38, 0x061019, [
        [-24, 16, -20, 2.4, 24, 2.4, 0xbae6fd],
        [24, 16, -20, 2.4, 24, 2.4, 0x38bdf8],
        [0, 32, 0, 30, 2.0, 4.0, 0xf8fafc],
        [0, 22, 26, 22, 2.0, 2.5, 0xfbbf24]
      ]);
      ENV_MAPS.garage = createEnv(0x060b16, 0x04070d, [
        [-9, 28, 0, 2.6, 1.2, 42, 0xf8fafc],
        [9, 28, 0, 2.6, 1.2, 42, 0xf8fafc],
        [0, 28, -22, 28, 1.8, 2.4, 0x22d3ee],
        [-28, 11, -6, 2.0, 20, 2.4, 0x22d3ee],
        [28, 11, 6, 2.0, 20, 2.4, 0xf59e0b],
        [-28, 11, 14, 2.0, 20, 2.4, 0xf8fafc],
        [28, 11, -14, 2.0, 20, 2.4, 0xf8fafc]
      ]);
      pmrem.dispose();
    } catch (e) {
      // Safe fallback when software WebGL lacks float cube extensions
    }
  }
  buildEnvMaps();

  // Custom OutputFXAAShader: FXAA 3.11 edge AA + ACES Filmic + Linear->sRGB + Vignette + N2O Speed Aberration
  const OutputFXAAShader = {
    uniforms: {
      tDiffuse: { value: null },
      resolution: { value: new THREE.Vector2(1 / (window.innerWidth * pixelRatio), 1 / (window.innerHeight * pixelRatio)) },
      uExposure: { value: 1.06 },
      uNitroAmount: { value: 0.0 },
      uVignette: { value: 0.26 }
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
      uniform float uExposure;
      uniform float uNitroAmount;
      uniform float uVignette;
      varying vec2 vUv;

      float fxaaLuma(vec3 rgb) {
        vec3 mapped = rgb / (1.0 + max(rgb.r, max(rgb.g, rgb.b)));
        return dot(mapped, vec3(0.299, 0.587, 0.114));
      }

      vec3 acesFilmic(vec3 x) {
        float a = 2.51;
        float b = 0.03;
        float c = 2.43;
        float d = 0.59;
        float e = 0.14;
        return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
      }

      void main() {
        vec2 texel = resolution;
        vec3 rgbM  = texture2D(tDiffuse, vUv).rgb;
        vec3 rgbNW = texture2D(tDiffuse, vUv + vec2(-1.0, -1.0) * texel).rgb;
        vec3 rgbNE = texture2D(tDiffuse, vUv + vec2( 1.0, -1.0) * texel).rgb;
        vec3 rgbSW = texture2D(tDiffuse, vUv + vec2(-1.0,  1.0) * texel).rgb;
        vec3 rgbSE = texture2D(tDiffuse, vUv + vec2( 1.0,  1.0) * texel).rgb;

        float lumaM  = fxaaLuma(rgbM);
        float lumaNW = fxaaLuma(rgbNW);
        float lumaNE = fxaaLuma(rgbNE);
        float lumaSW = fxaaLuma(rgbSW);
        float lumaSE = fxaaLuma(rgbSE);

        float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
        float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));
        float contrast = lumaMax - lumaMin;

        vec3 col = rgbM;
        if (contrast > max(0.0312, lumaMax * 0.125)) {
          vec2 dir;
          dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
          dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));

          float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) * (0.25 * 0.125), 0.0078125);
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

          float lumaB = fxaaLuma(rgbB);
          col = (lumaB < lumaMin || lumaB > lumaMax) ? rgbA : rgbB;
        }

        // Subtle outer radial chromatic / cyan speed aberration during N2O boost
        vec2 toCenter = vUv - 0.5;
        float r2 = dot(toCenter, toCenter);
        if (uNitroAmount > 0.002) {
          vec2 shift = toCenter * (uNitroAmount * r2 * 0.016);
          float rCh = texture2D(tDiffuse, vUv + shift).r;
          float bCh = texture2D(tDiffuse, vUv - shift).b;
          col.r = mix(col.r, rCh, 0.72);
          col.b = mix(col.b, bCh, 0.85);
          col += vec3(0.02, 0.14, 0.22) * (uNitroAmount * smoothstep(0.14, 0.45, r2));
        }

        col *= uExposure;
        col = acesFilmic(col);

        float vig = 1.0 - smoothstep(0.42, 0.96, length(toCenter) * 1.18) * uVignette;
        col *= vig;

        // Linear to sRGB encoding
        col = pow(max(col, 0.0), vec3(1.0 / 2.2));
        gl_FragColor = vec4(col, 1.0);
      }
    `
  };

  let composer = null;
  let bloomPass = null;
  let outputFXAAPass = null;
  let bloomEnabled = true;

  function syncRendererColorPipeline() {
    if (composer && bloomEnabled) {
      renderer.toneMapping = THREE.NoToneMapping;
      renderer.outputEncoding = THREE.LinearEncoding;
    } else {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.outputEncoding = THREE.sRGBEncoding;
    }
  }

  try {
    if (THREE.EffectComposer && THREE.RenderPass && THREE.UnrealBloomPass && THREE.ShaderPass) {
      const hasHalfFloatFBO =
        (renderer.capabilities.isWebGL2 &&
          (renderer.extensions.has ? renderer.extensions.has('EXT_color_buffer_float') : renderer.extensions.get('EXT_color_buffer_float'))) ||
        (renderer.extensions.has ? renderer.extensions.has('EXT_color_buffer_half_float') : renderer.extensions.get('EXT_color_buffer_half_float'));
      const rtType = hasHalfFloatFBO ? THREE.HalfFloatType : THREE.UnsignedByteType;
      const composerRT = new THREE.WebGLRenderTarget(
        Math.max(1, Math.floor(window.innerWidth * pixelRatio)),
        Math.max(1, Math.floor(window.innerHeight * pixelRatio)),
        {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          format: THREE.RGBAFormat,
          type: rtType
        }
      );
      composer = new THREE.EffectComposer(renderer, composerRT);
      composer.setPixelRatio(pixelRatio);
      composer.setSize(window.innerWidth, window.innerHeight);
      const renderPass = new THREE.RenderPass(scene, camera);
      bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.68,
        0.36,
        0.78
      );
      outputFXAAPass = new THREE.ShaderPass(OutputFXAAShader);
      outputFXAAPass.renderToScreen = true;
      composer.addPass(renderPass);
      composer.addPass(bloomPass);
      composer.addPass(outputFXAAPass);
    }
  } catch (e) {
    composer = null;
    bloomPass = null;
    outputFXAAPass = null;
  }
  syncRendererColorPipeline();

  // --- LIVE 3D REAR-VIEW MIRROR RENDER TARGET & BLIT QUAD ---
  const mirrorRT = new THREE.WebGLRenderTarget(320, 80, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter
  });
  const mirrorCam = new THREE.PerspectiveCamera(68, 248 / 54, 0.35, 950);
  const mirrorOrthoCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const mirrorQuadScene = new THREE.Scene();
  const mirrorQuadMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshBasicMaterial({
      map: mirrorRT.texture,
      side: THREE.DoubleSide,
      toneMapped: false,
      depthTest: false,
      depthWrite: false
    })
  );
  mirrorQuadMesh.scale.x = -1;
  mirrorQuadScene.add(mirrorQuadMesh);
  let mirrorEnabled = true;

  // Scene Lights (Hemisphere + Ambient + PCFSoftShadowMap Sun)
  const ambientLight = new THREE.AmbientLight(0x64748b, 0.78);
  scene.add(ambientLight);

  const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x090d18, 0.65);
  scene.add(hemiLight);

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

  // --- SCULPTED AERODYNAMIC 3D SUPERCAR BUILDER (WITH ROTORS, BACKFIRE & COCKPIT) ---
  function buildSupercarMesh(carSpec, customOpts = {}) {
    const paintColor = customOpts.paintHex !== undefined ? customOpts.paintHex : carSpec.defaultPaint;
    const glowColor = customOpts.glowHex !== undefined ? customOpts.glowHex : carSpec.defaultGlow;
    const wingStyle = customOpts.wingStyle || carSpec.defaultWing || 'gt';
    const rimSpec = RIM_STYLES.find(r => r.id === (customOpts.rimId || 'chrome')) || RIM_STYLES[0];
    const isPursuit = !!customOpts.isPursuit;

    const root = new THREE.Group();
    const chassisGroup = new THREE.Group();
    root.add(chassisGroup);

    const halfL = carSpec.len * 0.5;
    const width = carSpec.wid;
    const nH = carSpec.noseH;
    const rH = carSpec.roofH;
    const pX = carSpec.roofPeakX;

    // 1. Extruded Aerodynamic Body Silhouette (Side profile extruded & rotated so +Z = Forward!)
    const bodyShape = new THREE.Shape();
    bodyShape.moveTo(-halfL, 0.28);
    bodyShape.lineTo(halfL - 0.1, 0.25);
    bodyShape.lineTo(halfL + 0.14, nH);
    bodyShape.lineTo(halfL - 0.55, nH + 0.34);
    bodyShape.lineTo(0.82, nH + 0.44);
    bodyShape.lineTo(pX + 0.28, rH);
    bodyShape.lineTo(pX - 0.48, rH - 0.02);
    bodyShape.lineTo(-halfL + 0.38, nH + 0.56);
    bodyShape.lineTo(-halfL - 0.08, nH + 0.48);
    bodyShape.lineTo(-halfL, 0.28);

    const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
      depth: width - 0.28,
      bevelEnabled: true,
      bevelThickness: 0.15,
      bevelSize: 0.11,
      bevelSegments: 3
    });
    bodyGeo.translate(0, 0, -(width - 0.28) / 2);
    bodyGeo.rotateY(-Math.PI / 2);

    const paintMat = new THREE.MeshPhysicalMaterial({
      color: paintColor,
      metalness: 0.72,
      roughness: 0.16,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.45
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, paintMat);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    chassisGroup.add(bodyMesh);

    // 2. Sculpted Tinted Cockpit Canopy Glass
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

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x050a14,
      emissive: 0x030712,
      metalness: 0.90,
      roughness: 0.06,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      envMapIntensity: 1.65
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    chassisGroup.add(glassMesh);

    // 3. Carbon Fiber Front Splitter, Rear Diffuser, Side Skirts, Fender Flares & Side Intakes
    const carbonMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.42, metalness: 0.42 });
    const splitter = new THREE.Mesh(new THREE.BoxGeometry(width + 0.08, 0.09, 0.58), carbonMat);
    splitter.position.set(0, 0.24, halfL - 0.02);
    chassisGroup.add(splitter);

    const diffuser = new THREE.Mesh(new THREE.BoxGeometry(width - 0.08, 0.18, 0.46), carbonMat);
    diffuser.position.set(0, 0.28, -halfL + 0.08);
    chassisGroup.add(diffuser);

    const wheelZ = halfL * 0.62;
    const wheelX = width * 0.48;
    const wR = 0.42;

    [-1, 1].forEach(sideSign => {
      const skirt = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.16, carSpec.len * 0.56), carbonMat);
      skirt.position.set(sideSign * (width / 2 + 0.02), 0.28, 0);
      chassisGroup.add(skirt);

      // Sculpted Aerodynamic Side-Intake Channels behind doors
      const intakeBlade = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.32, 0.72), carbonMat);
      intakeBlade.position.set(sideSign * (width * 0.485), nH + 0.26, -0.35);
      intakeBlade.rotation.y = sideSign * 0.10;
      const intakeLip = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.35, 0.14), paintMat);
      intakeLip.position.set(sideSign * (width * 0.51), nH + 0.26, -0.68);
      chassisGroup.add(intakeBlade, intakeLip);

      // Flush Widebody Fender-Arch Blisters tucked cleanly at wheel height (zero protrusion above hood!)
      [wheelZ, -wheelZ].forEach(wz => {
        const arch = new THREE.Mesh(
          new THREE.BoxGeometry(0.14, 0.22, wR * 2.05),
          paintMat
        );
        arch.position.set(sideSign * (width * 0.475), wR + 0.02, wz);
        chassisGroup.add(arch);
      });
    });

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

    // 4. Sleek Recessed LED DRL Headlights, Ground-Projected Headlight Cones & Full-Width OLED Tail-Light Bar
    const hlMat = new THREE.MeshBasicMaterial({ color: 0xe0f7ff });
    const drlMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xe0f2fe,
      map: TEXTURES.headlightBeam,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const headlightCones = new THREE.Group();
    [-width * 0.34, width * 0.34].forEach(hx => {
      const hlHousing = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.09, 0.12), carbonMat);
      hlHousing.position.set(hx, nH + 0.16, halfL + 0.11);
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.055, 0.06), hlMat);
      hl.position.set(hx, nH + 0.165, halfL + 0.145);
      const drl = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.024, 0.06), drlMat);
      drl.position.set(hx, nH + 0.12, halfL + 0.15);
      chassisGroup.add(hlHousing, hl, drl);

      const beamQuad = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 22.0), beamMat);
      beamQuad.rotation.x = -Math.PI / 2;
      beamQuad.position.set(hx * 1.15, 0.08, halfL + 11.2);
      headlightCones.add(beamQuad);
    });
    headlightCones.visible = !customOpts.inGarage;
    chassisGroup.add(headlightCones);

    const tailMat = new THREE.MeshBasicMaterial({ color: 0xff2244 });
    const tailBar = new THREE.Mesh(new THREE.BoxGeometry(width - 0.22, 0.11, 0.12), tailMat);
    tailBar.position.set(0, nH + 0.46, -halfL - 0.16);
    const tailHalo = new THREE.Mesh(
      new THREE.PlaneGeometry(width + 0.12, 0.34),
      new THREE.MeshBasicMaterial({
        color: 0xff1e42,
        map: TEXTURES.radialGlow,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    tailHalo.position.set(0, nH + 0.46, -halfL - 0.23);
    tailHalo.rotation.y = Math.PI;
    chassisGroup.add(tailBar, tailHalo);

    // Chrome Dual Exhaust Tips, N2O Blue Jet Cones & Orange Shift Backfire Cones
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.92, roughness: 0.14, envMapIntensity: 1.4 });
    const nosGroup = new THREE.Group();
    const nosMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.88, blending: THREE.AdditiveBlending, depthWrite: false });
    const nosCoreMat = new THREE.MeshBasicMaterial({ color: 0xf0fdff });
    const backfireGroup = new THREE.Group();
    const bfOuterMat = new THREE.MeshBasicMaterial({ color: 0xff6b00, transparent: true, opacity: 0.92, blending: THREE.AdditiveBlending, depthWrite: false });
    const bfInnerMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

    [-0.58, 0.58].forEach(ex => {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.28, 10), chromeMat);
      pipe.rotation.x = Math.PI / 2;
      pipe.position.set(ex, 0.3, -halfL - 0.14);
      chassisGroup.add(pipe);

      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.20, 2.2, 10), nosMat);
      cone.rotation.x = -Math.PI / 2;
      cone.position.set(ex, 0.3, -halfL - 1.25);
      const core = new THREE.Mesh(new THREE.ConeGeometry(0.09, 1.15, 8), nosCoreMat);
      core.rotation.x = -Math.PI / 2;
      core.position.set(ex, 0.3, -halfL - 0.78);
      nosGroup.add(cone, core);

      const bfOut = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.78, 8), bfOuterMat);
      bfOut.rotation.x = -Math.PI / 2;
      bfOut.position.set(ex, 0.3, -halfL - 0.56);
      const bfIn = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.44, 8), bfInnerMat);
      bfIn.rotation.x = -Math.PI / 2;
      bfIn.position.set(ex, 0.3, -halfL - 0.38);
      backfireGroup.add(bfOut, bfIn);
    });
    nosGroup.visible = false;
    backfireGroup.visible = false;
    chassisGroup.add(nosGroup, backfireGroup);

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
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.07, 0.28), new THREE.MeshBasicMaterial({ color: glowColor || 0x22d3ee }));
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
      pursuitBarRed.position.set(-0.32, rH + 0.18, pX - 0.1);
      pursuitBarBlue = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.16, 0.28), bMat);
      pursuitBarBlue.position.set(0.32, rH + 0.18, pX - 0.1);
      chassisGroup.add(pursuitBarRed, pursuitBarBlue);
    }

    // 7. Additive Radial Ground Underglow Mesh (No expensive per-car dynamic PointLight!)
    let underglowPad = null;
    if (glowColor && glowColor !== 0x000000) {
      underglowPad = new THREE.Mesh(
        new THREE.PlaneGeometry(width + 1.5, carSpec.len + 1.4),
        new THREE.MeshBasicMaterial({
          color: glowColor,
          map: TEXTURES.radialGlow,
          transparent: true,
          opacity: 0.44,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide
        })
      );
      underglowPad.rotation.x = -Math.PI / 2;
      underglowPad.position.set(0, 0.06, 0);
      root.add(underglowPad);
    }

    // 8. 4 Multi-Spoke Wheels with Custom Rim Finish, Calipers & Glowing Brake Rotors
    const wheels = [];
    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x0b0e14,
      roughness: 0.90,
      metalness: 0.04,
      envMapIntensity: 0.16
    });
    const rimMat = new THREE.MeshStandardMaterial({
      color: rimSpec.hex,
      metalness: rimSpec.metal,
      roughness: rimSpec.rough,
      envMapIntensity: 1.35
    });
    const rotorMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      emissive: 0xff4500,
      emissiveIntensity: 0,
      metalness: 0.85,
      roughness: 0.3
    });
    const caliperMat = new THREE.MeshBasicMaterial({ color: glowColor || 0xff2a85 });

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
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(wR * 0.64, wR * 0.64, 0.36, 14), rimMat);
      rim.rotation.z = Math.PI / 2;
      const rotor = new THREE.Mesh(new THREE.CylinderGeometry(wR * 0.56, wR * 0.56, 0.1, 14), rotorMat);
      rotor.rotation.z = Math.PI / 2;
      rotor.position.x = wp.x > 0 ? -0.08 : 0.08;
      for (let s = 0; s < 5; s++) {
        const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.37, wR * 1.15, 0.05), rimMat);
        spoke.rotation.x = (s / 5) * Math.PI;
        spinGroup.add(spoke);
      }
      spinGroup.add(tire, rim);
      const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 0.22), caliperMat);
      caliper.position.set(wp.x > 0 ? -0.1 : 0.1, 0.08, 0.12);
      steerPivot.add(spinGroup, rotor, caliper);
      root.add(steerPivot);
      wheels.push({ steerPivot, spinGroup, front: wp.front });
    });

    // 9. Optional 3D Interior Cockpit (Visible when cameraMode === 1: Cockpit!)
    let cockpitGroup = null;
    let steeringWheelPivot = null;
    if (customOpts.withCockpit) {
      cockpitGroup = new THREE.Group();
      const dashMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.90, metalness: 0.05 });
      const camZ = (pX || 0) - 0.20;

      const firewall = new THREE.Mesh(new THREE.BoxGeometry(width - 0.24, 0.48, 1.35), dashMat);
      firewall.position.set(0, nH + 0.14, Math.max(0.95, camZ + 1.10));

      const dashDeck = new THREE.Mesh(new THREE.BoxGeometry(width - 0.56, 0.26, 0.64), dashMat);
      dashDeck.position.set(0, rH - 0.54, camZ + 0.72);

      const binnacle = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.12, 0.22), dashMat);
      binnacle.position.set(0, rH - 0.38, camZ + 0.68);

      const dashStrip = new THREE.Mesh(
        new THREE.BoxGeometry(0.50, 0.028, 0.03),
        new THREE.MeshBasicMaterial({ color: glowColor || 0x22d3ee })
      );
      dashStrip.position.set(0, rH - 0.37, camZ + 0.565);

      [-1, 1].forEach(side => {
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.72, 0.08), dashMat);
        pillar.position.set(side * (width * 0.43), rH - 0.22, camZ + 0.54);
        pillar.rotation.x = 0.78;
        pillar.rotation.z = side * 0.16;
        cockpitGroup.add(pillar);
      });

      steeringWheelPivot = new THREE.Group();
      steeringWheelPivot.position.set(0, rH - 0.42, camZ + 0.50);
      steeringWheelPivot.rotation.x = -0.18;
      const wheelRim = new THREE.Mesh(new THREE.TorusGeometry(0.145, 0.019, 10, 28), dashMat);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.035, 14), carbonMat);
      hub.rotation.x = Math.PI / 2;
      const spokeL = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.026, 0.018), rimMat);
      const spokeB = new THREE.Mesh(new THREE.BoxGeometry(0.030, 0.13, 0.018), rimMat);
      spokeB.position.y = -0.075;
      const topMarker = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.040, 0.042), new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
      topMarker.position.y = 0.145;
      steeringWheelPivot.add(wheelRim, hub, spokeL, spokeB, topMarker);

      cockpitGroup.add(firewall, dashDeck, binnacle, dashStrip, steeringWheelPivot);
      cockpitGroup.visible = false;
      chassisGroup.add(cockpitGroup);
    }

    // Optional Player Hero Headlight SpotLight
    let headSpot = null;
    if (customOpts.withHeadlight) {
      headSpot = new THREE.SpotLight(0xe0f2fe, 2.9, 105, Math.PI / 4.4, 0.52, 1.1);
      headSpot.position.set(0, 0.8, halfL);
      headSpot.target.position.set(0, 0, halfL + 36);
      chassisGroup.add(headSpot, headSpot.target);
    }

    return {
      root,
      chassisGroup,
      bodyMesh,
      glassMesh,
      cockpitGroup,
      steeringWheelPivot,
      wheels,
      rotorMat,
      nosGroup,
      backfireGroup,
      tailMat,
      headlightCones,
      pursuitBarRed,
      pursuitBarBlue,
      headSpot
    };
  }

  // --- SIGNATURE HDR FX: TAIL-LIGHT RIBBONS (WITH TAIL FADE), SKIDMARKS & TOKYO RAIN ---
  class TailRibbon {
    constructor(parentGroup, maxPts = 28, width = 0.16, colorHex = 0xff2244) {
      this.maxPts = maxPts;
      this.width = width;
      this.pts = [];
      this.posArr = new Float32Array((maxPts - 1) * 6 * 3);
      this.colArr = new Float32Array((maxPts - 1) * 6 * 3);
      this.geo = new THREE.BufferGeometry();
      this.geo.setAttribute('position', new THREE.BufferAttribute(this.posArr, 3));
      this.geo.setAttribute('color', new THREE.BufferAttribute(this.colArr, 3));
      this.mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        vertexColors: true,
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      this.colorObj = new THREE.Color(colorHex);
      this.mesh = new THREE.Mesh(this.geo, this.mat);
      this.mesh.frustumCulled = false;
      this.mesh.visible = false;
      parentGroup.add(this.mesh);
    }

    reset() {
      this.pts.length = 0;
      this.mesh.visible = false;
    }

    pushPoint(x, y, z, rx, rz, active, colorHex) {
      if (!active) {
        if (this.pts.length > 0) this.pts.pop();
      } else {
        this.pts.unshift({ x, y, z, rx, rz });
        if (this.pts.length > this.maxPts) this.pts.pop();
      }
      if (this.pts.length < 2) {
        this.mesh.visible = false;
        return;
      }
      this.mesh.visible = true;
      this.colorObj.setHex(colorHex);
      const cr = this.colorObj.r;
      const cg = this.colorObj.g;
      const cb = this.colorObj.b;
      let k = 0;
      let ck = 0;
      const n = this.pts.length;
      for (let i = 0; i < this.maxPts - 1; i++) {
        if (i < n - 1) {
          const p0 = this.pts[i];
          const p1 = this.pts[i + 1];
          const f0 = 1 - i / n;
          const f1 = 1 - (i + 1) / n;
          const w0 = this.width * (0.25 + 0.75 * f0);
          const w1 = this.width * (0.25 + 0.75 * f1);
          const b0 = f0 * f0 * 1.15;
          const b1 = f1 * f1 * 1.15;

          const ax = p0.x - p0.rx * w0, az = p0.z - p0.rz * w0;
          const bx = p0.x + p0.rx * w0, bz = p0.z + p0.rz * w0;
          const cx = p1.x - p1.rx * w1, cz = p1.z - p1.rz * w1;
          const dx = p1.x + p1.rx * w1, dz = p1.z + p1.rz * w1;

          this.posArr[k++] = ax; this.posArr[k++] = p0.y; this.posArr[k++] = az;
          this.posArr[k++] = bx; this.posArr[k++] = p0.y; this.posArr[k++] = bz;
          this.posArr[k++] = cx; this.posArr[k++] = p1.y; this.posArr[k++] = cz;

          this.posArr[k++] = bx; this.posArr[k++] = p0.y; this.posArr[k++] = bz;
          this.posArr[k++] = dx; this.posArr[k++] = p1.y; this.posArr[k++] = dz;
          this.posArr[k++] = cx; this.posArr[k++] = p1.y; this.posArr[k++] = cz;

          this.colArr[ck++] = cr * b0; this.colArr[ck++] = cg * b0; this.colArr[ck++] = cb * b0;
          this.colArr[ck++] = cr * b0; this.colArr[ck++] = cg * b0; this.colArr[ck++] = cb * b0;
          this.colArr[ck++] = cr * b1; this.colArr[ck++] = cg * b1; this.colArr[ck++] = cb * b1;

          this.colArr[ck++] = cr * b0; this.colArr[ck++] = cg * b0; this.colArr[ck++] = cb * b0;
          this.colArr[ck++] = cr * b1; this.colArr[ck++] = cg * b1; this.colArr[ck++] = cb * b1;
          this.colArr[ck++] = cr * b1; this.colArr[ck++] = cg * b1; this.colArr[ck++] = cb * b1;
        } else {
          for (let j = 0; j < 18; j++) {
            this.posArr[k++] = 0;
            this.colArr[ck++] = 0;
          }
        }
      }
      this.geo.attributes.position.needsUpdate = true;
      this.geo.attributes.color.needsUpdate = true;
    }
  }

  class SkidmarkManager {
    constructor(maxQuads = 360) {
      this.maxQuads = maxQuads;
      this.cursor = 0;
      this.count = 0;
      this.posArr = new Float32Array(maxQuads * 6 * 3);
      this.geo = new THREE.BufferGeometry();
      this.geo.setAttribute('position', new THREE.BufferAttribute(this.posArr, 3));
      this.mat = new THREE.MeshBasicMaterial({
        color: 0x05070c,
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      this.mesh = new THREE.Mesh(this.geo, this.mat);
      this.mesh.frustumCulled = false;
    }

    reset(parentGroup) {
      this.cursor = 0;
      this.count = 0;
      this.posArr.fill(0);
      this.geo.attributes.position.needsUpdate = true;
      this.geo.setDrawRange(0, 0);
      parentGroup.add(this.mesh);
    }

    addMark(x0, y0, z0, x1, y1, z1, rx, rz, halfW = 0.22) {
      const idx = this.cursor * 18;
      const ax = x0 - rx * halfW, az = z0 - rz * halfW;
      const bx = x0 + rx * halfW, bz = z0 + rz * halfW;
      const cx = x1 - rx * halfW, cz = z1 - rz * halfW;
      const dx = x1 + rx * halfW, dz = z1 + rz * halfW;
      let k = idx;
      this.posArr[k++] = ax; this.posArr[k++] = y0; this.posArr[k++] = az;
      this.posArr[k++] = bx; this.posArr[k++] = y0; this.posArr[k++] = bz;
      this.posArr[k++] = cx; this.posArr[k++] = y1; this.posArr[k++] = cz;

      this.posArr[k++] = bx; this.posArr[k++] = y0; this.posArr[k++] = bz;
      this.posArr[k++] = dx; this.posArr[k++] = y1; this.posArr[k++] = dz;
      this.posArr[k++] = cx; this.posArr[k++] = y1; this.posArr[k++] = cz;

      this.cursor = (this.cursor + 1) % this.maxQuads;
      if (this.count < this.maxQuads) this.count++;
      this.geo.setDrawRange(0, this.count * 6);
      this.geo.attributes.position.needsUpdate = true;
    }
  }
  const skidManager = new SkidmarkManager(360);

  // Night Rain Particle System (Attached to Scene, active on Tokyo & Title)
  const RAIN_COUNT = 220;
  const rainDrops = [];
  const rainPosArr = new Float32Array(RAIN_COUNT * 6);
  const rainGeo = new THREE.BufferGeometry();
  rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPosArr, 3));
  const rainMat = new THREE.LineBasicMaterial({
    color: 0x94a3b8,
    transparent: true,
    opacity: 0.20
  });
  const rainLines = new THREE.LineSegments(rainGeo, rainMat);
  rainLines.frustumCulled = false;
  rainLines.visible = false;
  scene.add(rainLines);

  for (let i = 0; i < RAIN_COUNT; i++) {
    rainDrops.push({
      ox: (Math.random() - 0.5) * 60,
      oy: Math.random() * 24,
      oz: (Math.random() - 0.5) * 60,
      len: 0.95 + Math.random() * 1.0,
      spd: 30 + Math.random() * 14
    });
  }

  function updateRain(dt, active, carSpeed, carHeading) {
    rainLines.visible = active;
    if (!active) return;
    const vx = Math.sin(carHeading) * carSpeed * 0.22;
    const vz = Math.cos(carHeading) * carSpeed * 0.22;
    const cx = camera.position.x + Math.sin(carHeading) * 18;
    const cy = camera.position.y - 4;
    const cz = camera.position.z + Math.cos(carHeading) * 18;

    let k = 0;
    for (let i = 0; i < RAIN_COUNT; i++) {
      const d = rainDrops[i];
      d.oy -= d.spd * dt;
      if (d.oy < -2) {
        d.oy = 20 + Math.random() * 6;
        d.ox = (Math.random() - 0.5) * 60;
        d.oz = (Math.random() - 0.5) * 60;
      }
      const x = cx + d.ox;
      const y = cy + d.oy;
      const z = cz + d.oz;
      rainPosArr[k++] = x;
      rainPosArr[k++] = y;
      rainPosArr[k++] = z;
      rainPosArr[k++] = x - vx * 0.045;
      rainPosArr[k++] = y + d.len;
      rainPosArr[k++] = z - vz * 0.045;
    }
    rainGeo.attributes.position.needsUpdate = true;
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
  let streetBuildingsGroup = null;
  let aerialMapGroup = null;
  let aerialAnimState = null;
  let trackAnimState = null;

  function buildAerialCityOverlay(trackIdx, pts, tangents, rights, farFromTrack) {
    const spec = TRACK_SPECS[trackIdx];
    const group = new THREE.Group();

    // Compute circuit bounds & center
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (let i = 0; i < FRAMES_COUNT; i++) {
      if (pts[i].x < minX) minX = pts[i].x;
      if (pts[i].x > maxX) maxX = pts[i].x;
      if (pts[i].z < minZ) minZ = pts[i].z;
      if (pts[i].z > maxZ) maxZ = pts[i].z;
    }
    const cx = (minX + maxX) * 0.5;
    const cz = (minZ + maxZ) * 0.5;

    // 1. Dark Cartographic Ground (y = -2.0)
    const mapPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(2800, 2800),
      new THREE.MeshBasicMaterial({ map: TEXTURES.cartoMap[trackIdx] || TEXTURES.cartoMap[0] })
    );
    mapPlane.rotation.x = -Math.PI / 2;
    mapPlane.position.set(cx, -2.0, cz);
    group.add(mapPlane);

    // 2. 280+ Extruded Matte Dark-Slate City Blocks (InstancedMesh) + Subtle Rooftop Rims
    const BLOCK_COUNT = 280;
    const blockGeo = new THREE.BoxGeometry(1, 1, 1);
    const blockMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.92,
      metalness: 0.08,
      envMapIntensity: 0.22
    });
    const blockInst = new THREE.InstancedMesh(blockGeo, blockMat, BLOCK_COUNT);
    const rimMat = new THREE.MeshBasicMaterial({
      color: trackIdx === 1 ? 0x261829 : trackIdx === 2 ? 0x152b47 : 0x111d33,
      transparent: true,
      opacity: 0.36
    });
    const rimInst = new THREE.InstancedMesh(blockGeo, rimMat, BLOCK_COUNT);

    const dummy = new THREE.Object3D();
    const cTmp = new THREE.Color();
    const blockColors = [0x050811, 0x070c17, 0x09101f, 0x0b1324, 0x060a14];
    let placed = 0;
    let seed = 1337 + trackIdx * 97;
    function rand() {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    }

    let attempts = 0;
    while (placed < BLOCK_COUNT && attempts < 2600) {
      attempts++;
      const bx = cx + (rand() - 0.5) * 1950;
      const bz = cz + (rand() - 0.5) * 1950;
      if (!farFromTrack(bx, bz, ROAD_HALF_W + 16)) continue;

      const bw = 16 + rand() * 28;
      const bd = 16 + rand() * 28;
      const bh = 8 + Math.pow(rand(), 1.6) * 32;
      const yaw = Math.floor(rand() * 4) * (Math.PI * 0.5) + (rand() - 0.5) * 0.08;

      dummy.position.set(bx, bh * 0.5 - 2.0, bz);
      dummy.rotation.set(0, yaw, 0);
      dummy.scale.set(bw, bh, bd);
      dummy.updateMatrix();
      blockInst.setMatrixAt(placed, dummy.matrix);
      cTmp.setHex(blockColors[placed % blockColors.length]);
      blockInst.setColorAt(placed, cTmp);

      dummy.position.set(bx, bh - 1.9, bz);
      dummy.scale.set(bw + 0.6, 0.45, bd + 0.6);
      dummy.updateMatrix();
      rimInst.setMatrixAt(placed, dummy.matrix);
      placed++;
    }
    blockInst.count = placed;
    rimInst.count = placed;
    blockInst.instanceMatrix.needsUpdate = true;
    if (blockInst.instanceColor) blockInst.instanceColor.needsUpdate = true;
    rimInst.instanceMatrix.needsUpdate = true;
    group.add(blockInst, rimInst);

    // Helper: create flat glowing ribbon along any CatmullRomCurve3
    function buildTransitRibbon(curvePts, width, colorHex, opacity, yOffset = 0, closed = false) {
      const curve = new THREE.CatmullRomCurve3(curvePts, closed, 'catmullrom', 0.5);
      const segs = closed ? FRAMES_COUNT : 180;
      const positions = [];
      const indices = [];
      const up = new THREE.Vector3(0, 1, 0);
      for (let i = 0; i <= segs; i++) {
        const u = (i % segs) / segs;
        const p = curve.getPointAt(closed ? u : Math.min(1, i / segs));
        const t = curve.getTangentAt(closed ? u : Math.min(1, i / segs)).normalize();
        const r = new THREE.Vector3().crossVectors(up, t).normalize();
        const L = p.clone().addScaledVector(r, -width * 0.5);
        const R = p.clone().addScaledVector(r, width * 0.5);
        positions.push(L.x, L.y + yOffset, L.z, R.x, R.y + yOffset, R.z);
        if (i < segs) {
          const b = i * 2;
          indices.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
        }
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setIndex(indices);
      const mat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);
      return curve;
    }

    // 3. Primary Circuit Route Ribbon (Wide Glow Aura + Crisp Bright Core)
    const primaryAuraCol = trackIdx === 1 ? 0xfb923c : trackIdx === 2 ? 0x38bdf8 : 0x22d3ee;
    const primaryCoreCol = trackIdx === 1 ? 0xfed7aa : trackIdx === 2 ? 0xe0f2fe : 0xe0faff;
    const circuitCurve = buildTransitRibbon(pts, 18.5, primaryAuraCol, 0.36, 0.85, true);
    buildTransitRibbon(pts, 6.2, primaryCoreCol, 0.94, 0.95, true);

    // 4. Emerald-Green Yamanote Rail Lines + Animated Express Trains
    const yamaCurveA = buildTransitRibbon([
      new THREE.Vector3(cx + 90, 2.2, cz - 1020),
      new THREE.Vector3(cx + 120, 2.2, cz - 460),
      new THREE.Vector3(cx + 150, 2.2, cz + 40),
      new THREE.Vector3(cx + 215, 2.2, cz + 460),
      new THREE.Vector3(cx + 310, 2.2, cz + 1020)
    ], 11.0, 0x22c55e, 0.32, 0.4, false);
    buildTransitRibbon([
      new THREE.Vector3(cx + 90, 2.2, cz - 1020),
      new THREE.Vector3(cx + 120, 2.2, cz - 460),
      new THREE.Vector3(cx + 150, 2.2, cz + 40),
      new THREE.Vector3(cx + 215, 2.2, cz + 460),
      new THREE.Vector3(cx + 310, 2.2, cz + 1020)
    ], 3.2, 0x4ade80, 0.92, 0.5, false);

    const yamaCurveB = buildTransitRibbon([
      new THREE.Vector3(cx + 114, 2.2, cz - 1020),
      new THREE.Vector3(cx + 144, 2.2, cz - 460),
      new THREE.Vector3(cx + 174, 2.2, cz + 40),
      new THREE.Vector3(cx + 239, 2.2, cz + 460),
      new THREE.Vector3(cx + 334, 2.2, cz + 1020)
    ], 9.5, 0x22c55e, 0.28, 0.4, false);
    buildTransitRibbon([
      new THREE.Vector3(cx + 114, 2.2, cz - 1020),
      new THREE.Vector3(cx + 144, 2.2, cz - 460),
      new THREE.Vector3(cx + 174, 2.2, cz + 40),
      new THREE.Vector3(cx + 239, 2.2, cz + 460),
      new THREE.Vector3(cx + 334, 2.2, cz + 1020)
    ], 2.8, 0x86efac, 0.88, 0.5, false);

    // 5. Electric Violet Metro Arteries
    const violetCurveA = buildTransitRibbon([
      new THREE.Vector3(cx - 1050, 1.5, cz + 290),
      new THREE.Vector3(cx - 460, 1.5, cz + 120),
      new THREE.Vector3(cx + 80, 1.5, cz - 140),
      new THREE.Vector3(cx + 580, 1.5, cz - 390),
      new THREE.Vector3(cx + 1050, 1.5, cz - 510)
    ], 10.0, 0xa855f7, 0.30, 0.2, false);
    buildTransitRibbon([
      new THREE.Vector3(cx - 1050, 1.5, cz + 290),
      new THREE.Vector3(cx - 460, 1.5, cz + 120),
      new THREE.Vector3(cx + 80, 1.5, cz - 140),
      new THREE.Vector3(cx + 580, 1.5, cz - 390),
      new THREE.Vector3(cx + 1050, 1.5, cz - 510)
    ], 2.8, 0xc084fc, 0.88, 0.3, false);

    const violetCurveB = buildTransitRibbon([
      new THREE.Vector3(cx - 880, 1.5, cz - 540),
      new THREE.Vector3(cx - 320, 1.5, cz - 240),
      new THREE.Vector3(cx + 240, 1.5, cz - 80),
      new THREE.Vector3(cx + 980, 1.5, cz + 160)
    ], 9.0, 0xa855f7, 0.24, 0.2, false);
    buildTransitRibbon([
      new THREE.Vector3(cx - 880, 1.5, cz - 540),
      new THREE.Vector3(cx - 320, 1.5, cz - 240),
      new THREE.Vector3(cx + 240, 1.5, cz - 80),
      new THREE.Vector3(cx + 980, 1.5, cz + 160)
    ], 2.4, 0xd8b4fe, 0.82, 0.3, false);

    // 6. Golden-Amber Elevated Expressway
    const amberCurve = buildTransitRibbon([
      new THREE.Vector3(cx - 1080, 3.0, cz + 560),
      new THREE.Vector3(cx - 360, 3.0, cz + 380),
      new THREE.Vector3(cx + 220, 3.0, cz + 260),
      new THREE.Vector3(cx + 980, 3.0, cz + 230)
    ], 14.0, 0xf59e0b, 0.32, 0.6, false);
    buildTransitRibbon([
      new THREE.Vector3(cx - 1080, 3.0, cz + 560),
      new THREE.Vector3(cx - 360, 3.0, cz + 380),
      new THREE.Vector3(cx + 220, 3.0, cz + 260),
      new THREE.Vector3(cx + 980, 3.0, cz + 230)
    ], 3.8, 0xfbbf24, 0.94, 0.7, false);

    // 7. Animated Emerald Express Trains & 96 Streaming Traffic Comet Streaks
    const trains = [];
    const trainBodyGeo = new THREE.BoxGeometry(5.5, 1.6, 56);
    const trainCoreGeo = new THREE.BoxGeometry(2.6, 1.2, 48);
    const trainGlowMat = new THREE.MeshBasicMaterial({ color: 0x4ade80, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false });
    const trainCoreMat = new THREE.MeshBasicMaterial({ color: 0xecfdf5 });
    for (let ti = 0; ti < 6; ti++) {
      const tg = new THREE.Group();
      tg.add(new THREE.Mesh(trainBodyGeo, trainGlowMat), new THREE.Mesh(trainCoreGeo, trainCoreMat));
      group.add(tg);
      trains.push({
        group: tg,
        curve: ti % 2 === 0 ? yamaCurveA : yamaCurveB,
        u: (ti / 6 + 0.12) % 1,
        dir: ti % 2 === 0 ? 1 : -1,
        speed: 0.055 + (ti % 3) * 0.015
      });
    }

    const cometCount = 96;
    const cometCurves = [circuitCurve, yamaCurveA, violetCurveA, violetCurveB, amberCurve];
    const cometGeo = new THREE.PlaneGeometry(3.2, 34);
    cometGeo.rotateX(-Math.PI / 2);
    const cometColors = [0xfbbf24, 0x22d3ee, 0xc084fc, 0x4ade80];
    const cometMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const cometInst = new THREE.InstancedMesh(cometGeo, cometMat, cometCount);
    const comets = [];
    for (let ci = 0; ci < cometCount; ci++) {
      const cCol = new THREE.Color(cometColors[ci % cometColors.length]);
      cometInst.setColorAt(ci, cCol);
      comets.push({
        curve: cometCurves[ci % cometCurves.length],
        u: rand(),
        dir: ci % 2 === 0 ? 1 : -1,
        speed: 0.04 + rand() * 0.085,
        lat: (rand() - 0.5) * 9.0,
        lenScale: 0.65 + rand() * 1.15
      });
    }
    if (cometInst.instanceColor) cometInst.instanceColor.needsUpdate = true;
    group.add(cometInst);

    // 8. Pulsing Holographic Waypoint Radar Rings (Start Crossing & Finale)
    const radarRings = [];
    function createWaypointRadar(worldPos, primaryCol, secondaryCol) {
      const rg = new THREE.Group();
      rg.position.set(worldPos.x, worldPos.y + 1.4, worldPos.z);

      const coreDot = new THREE.Mesh(
        new THREE.CircleGeometry(6.5, 24),
        new THREE.MeshBasicMaterial({ color: secondaryCol, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      coreDot.rotation.x = -Math.PI / 2;
      rg.add(coreDot);

      for (let r = 0; r < 3; r++) {
        const ringMat = new THREE.MeshBasicMaterial({
          color: r % 2 === 0 ? primaryCol : secondaryCol,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(new THREE.RingGeometry(12, 16, 48), ringMat);
        ring.rotation.x = -Math.PI / 2;
        rg.add(ring);
        radarRings.push({ mesh: ring, mat: ringMat, phase: r * 0.333 });
      }

      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(4.5, 11.0, 72, 16, 1, true),
        new THREE.MeshBasicMaterial({
          color: primaryCol,
          transparent: true,
          opacity: 0.14,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide
        })
      );
      beam.position.y = 36;
      rg.add(beam);
      group.add(rg);
    }

    const startPt = pts[0];
    const finishLm = (spec.landmarks && spec.landmarks.find(l => l.type === 'finish')) || { seg: 258 };
    const finishPt = pts[finishLm.seg % FRAMES_COUNT];
    createWaypointRadar(startPt, 0x22d3ee, 0xf59e0b);
    createWaypointRadar(finishPt, 0xef4444, 0x38bdf8);

    // 9. Landmark 3D World Anchors for #mapLabelsLayer
    const landmarks = (spec.landmarks || []).map(lm => {
      let worldPos;
      if (lm.pos) {
        worldPos = new THREE.Vector3(lm.pos[0], lm.pos[1], lm.pos[2]);
      } else {
        const p = pts[(lm.seg || 0) % FRAMES_COUNT];
        worldPos = new THREE.Vector3(p.x, p.y + 4, p.z);
      }
      return { label: lm.label, color: lm.color, worldPos };
    });

    aerialAnimState = {
      center: new THREE.Vector3(cx, 0, cz),
      trains,
      comets,
      cometInst,
      radarRings,
      landmarks
    };

    return group;
  }

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
    const worldUp = new THREE.Vector3(0, 1, 0);

    for (let i = 0; i < FRAMES_COUNT; i++) {
      const u = i / FRAMES_COUNT;
      const p = curve.getPointAt(u);
      const t = curve.getTangentAt(u).normalize();
      const r = new THREE.Vector3().crossVectors(worldUp, t).normalize();
      const up = new THREE.Vector3().crossVectors(t, r).normalize();
      pts.push(p);
      tangents.push(t);
      rights.push(r);
      ups.push(up);
    }

    for (let i = 0; i < FRAMES_COUNT; i++) {
      const prevT = tangents[(i - 2 + FRAMES_COUNT) % FRAMES_COUNT];
      const nextT = tangents[(i + 2) % FRAMES_COUNT];
      const dT = new THREE.Vector3().subVectors(nextT, prevT);
      curvatures.push(dT.dot(rights[i]));
    }

    function createContinuousRibbon(getLeftRightFn, mat, uvScale = 0.12) {
      const positions = [];
      const uvs = [];
      const indices = [];
      let accumDist = 0;
      for (let i = 0; i <= FRAMES_COUNT; i++) {
        const idx = i % FRAMES_COUNT;
        if (i > 0) {
          const prevIdx = (i - 1) % FRAMES_COUNT;
          accumDist += pts[idx].distanceTo(pts[prevIdx]);
        }
        const { L, R } = getLeftRightFn(idx);
        positions.push(L.x, L.y, L.z, R.x, R.y, R.z);
        const vCoord = accumDist * uvScale;
        uvs.push(0, vCoord, 1, vCoord);
        if (i < FRAMES_COUNT) {
          const base = i * 2;
          indices.push(base, base + 1, base + 2);
          indices.push(base + 1, base + 3, base + 2);
        }
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geo.setIndex(indices);
      geo.computeVertexNormals();
      const mesh = new THREE.Mesh(geo, mat);
      mesh.receiveShadow = true;
      return mesh;
    }

    // 1. Continuous Road Ribbon + Wet-Asphalt Neon Reflection Shader on Tokyo!
    const isNight = spec.envType === 'tokyo';
    const roadTex = isNight ? TEXTURES.roadNight : TEXTURES.roadDay;
    const roadRoughMap = isNight ? TEXTURES.roughNight : TEXTURES.roughDay;
    const roadMat = new THREE.MeshStandardMaterial({
      map: roadTex,
      roughnessMap: roadRoughMap,
      roughness: spec.roadRoughness,
      metalness: spec.roadMetalness,
      envMapIntensity: isNight ? 1.45 : 0.55,
      side: THREE.DoubleSide
    });

    const roadTimeUniform = { value: 0 };
    if (isNight) {
      roadMat.onBeforeCompile = shader => {
        shader.uniforms.uRoadTime = roadTimeUniform;
        shader.vertexShader = shader.vertexShader
          .replace('#include <common>', '#include <common>\nvarying vec2 vWetUv;\nvarying vec3 vWetWorld;')
          .replace('#include <begin_vertex>', '#include <begin_vertex>\nvWetUv = uv;\nvWetWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;');
        shader.fragmentShader = shader.fragmentShader
          .replace('#include <common>', '#include <common>\nuniform float uRoadTime;\nvarying vec2 vWetUv;\nvarying vec3 vWetWorld;')
          .replace(
            '#include <roughnessmap_fragment>',
            `#include <roughnessmap_fragment>
            float w1 = sin(vWetWorld.x * 0.042 + vWetWorld.z * 0.029);
            float w2 = cos(vWetWorld.x * 0.021 - vWetWorld.z * 0.048 + 1.4);
            float wetPatch = smoothstep(0.05, 0.65, (w1 * 0.5 + w2 * 0.5) * 0.5 + 0.5);
            roughnessFactor *= mix(1.0, 0.10, wetPatch);`
          )
          .replace(
            '#include <emissivemap_fragment>',
            `#include <emissivemap_fragment>
            float laneMask = smoothstep(0.04, 0.10, vWetUv.x) * (1.0 - smoothstep(0.90, 0.96, vWetUv.x));
            float p1 = pow(max(0.0, 1.0 - abs(vWetUv.x - 0.12) * 11.5), 3.0);
            float p2 = pow(max(0.0, 1.0 - abs(vWetUv.x - 0.34) * 12.5), 3.0);
            float p3 = pow(max(0.0, 1.0 - abs(vWetUv.x - 0.66) * 12.5), 3.0);
            float p4 = pow(max(0.0, 1.0 - abs(vWetUv.x - 0.88) * 11.5), 3.0);
            float pw1 = sin(vWetWorld.x * 0.042 + vWetWorld.z * 0.029);
            float pw2 = cos(vWetWorld.x * 0.021 - vWetWorld.z * 0.048 + 1.4);
            float wetSheen = smoothstep(0.05, 0.65, (pw1 * 0.5 + pw2 * 0.5) * 0.5 + 0.5);
            float blockMod = 0.58 + 0.42 * sin(vWetWorld.x * 0.028 + vWetWorld.z * 0.024 + uRoadTime * 0.35);
            vec3 neonPillars =
              vec3(0.05, 0.65, 0.90) * p1 +
              vec3(0.62, 0.20, 0.90) * p2 * blockMod +
              vec3(0.90, 0.52, 0.10) * p3 * (1.15 - 0.45 * blockMod) +
              vec3(0.08, 0.78, 0.44) * p4;
            totalEmissiveRadiance += neonPillars * laneMask * mix(0.12, 0.58, wetSheen);`
          );
      };
    }

    const roadMesh = createContinuousRibbon(idx => {
      const p = pts[idx];
      const r = rights[idx];
      return {
        L: new THREE.Vector3().copy(p).addScaledVector(r, -ROAD_HALF_W),
        R: new THREE.Vector3().copy(p).addScaledVector(r, ROAD_HALF_W)
      };
    }, roadMat, 0.032);
    raceWorldGroup.add(roadMesh);

    skidManager.reset(raceWorldGroup);

    // 2. Continuous Left & Right Jersey Barriers + Glowing Neon Edge Trim
    const barrierMat = new THREE.MeshStandardMaterial({ color: 0x0b1220, roughness: 0.65, metalness: 0.25, side: THREE.DoubleSide });
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

    // 3. Glowing Corner Chevron Walls on Sharp Bends
    const chevTex = isNight
      ? TEXTURES.chevronCyan
      : spec.envType === 'canyon'
        ? TEXTURES.chevronOrange
        : TEXTURES.chevronGold;
    const chevMat = new THREE.MeshBasicMaterial({ map: chevTex, side: THREE.DoubleSide });

    for (let i = 0; i < FRAMES_COUNT; i += 6) {
      const k = curvatures[i];
      if (Math.abs(k) > 0.11) {
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

    // 3b. Overhead Highway Streetlights along Barriers
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.78, roughness: 0.28 });
    const bulbMat = new THREE.MeshBasicMaterial({ color: isNight ? 0xe0f2fe : (spec.envType === 'canyon' ? 0xfbbf24 : 0xbae6fd) });
    const poolMat = new THREE.MeshBasicMaterial({
      color: isNight ? 0x22d3ee : (spec.envType === 'canyon' ? 0xf59e0b : 0x38bdf8),
      map: TEXTURES.radialGlow,
      transparent: true,
      opacity: isNight ? 0.26 : 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    for (let i = 6; i < FRAMES_COUNT; i += 18) {
      const side = ((i / 18) | 0) % 2 === 0 ? -1 : 1;
      const p = pts[i];
      const r = rights[i];
      const t = tangents[i];
      const lamp = new THREE.Group();
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 11.2, 8), poleMat);
      post.position.y = 5.6;
      const arm = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.18, 0.22), poleMat);
      arm.position.set(-side * 2.0, 11.1, 0);
      const fixture = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.18, 0.56), bulbMat);
      fixture.position.set(-side * 3.8, 10.95, 0);
      lamp.add(post, arm, fixture);

      const pool = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), poolMat);
      pool.rotation.x = -Math.PI / 2;
      pool.position.set(-side * 5.2, 0.06, 0);
      lamp.add(pool);

      lamp.position.copy(p).addScaledVector(r, side * (ROAD_HALF_W + 1.5));
      lamp.rotation.y = Math.atan2(t.x, t.z);
      raceWorldGroup.add(lamp);
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
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.72, roughness: 0.28 });
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

    // 5. Enclosed Illuminated Neon Light Tunnels & Bridge Pillars
    const tunnelRanges = [[110, 154], [375, 415]];
    const tunnelShellMat = new THREE.MeshStandardMaterial({
      color: 0x080d18,
      roughness: 0.45,
      metalness: 0.55,
      side: THREE.DoubleSide
    });
    const tunnelGlowColors = isNight
      ? [0x22d3ee, 0xa855f7, 0xf59e0b]
      : spec.envType === 'canyon'
        ? [0xfb923c, 0xf59e0b, 0x22d3ee]
        : [0x38bdf8, 0xbae6fd, 0x4ade80];
    const tunnelStripMats = tunnelGlowColors.map(c => new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide }));

    tunnelRanges.forEach(([sIdx, eIdx]) => {
      const radius = ROAD_HALF_W + 1.1;
      const archSteps = 10;
      const positions = [];
      const indices = [];
      for (let i = sIdx; i <= eIdx; i++) {
        const p = pts[i];
        const r = rights[i];
        const u = ups[i];
        for (let a = 0; a <= archSteps; a++) {
          const theta = (a / archSteps) * Math.PI;
          const rx = Math.cos(theta) * radius;
          const ry = Math.sin(theta) * radius * 0.72 + 0.4;
          const v = p.clone().addScaledVector(r, rx).addScaledVector(u, ry);
          positions.push(v.x, v.y, v.z);
        }
        if (i < eIdx) {
          const row0 = (i - sIdx) * (archSteps + 1);
          const row1 = (i - sIdx + 1) * (archSteps + 1);
          for (let a = 0; a < archSteps; a++) {
            indices.push(row0 + a, row0 + a + 1, row1 + a);
            indices.push(row0 + a + 1, row1 + a + 1, row1 + a);
          }
        }
      }
      const shellGeo = new THREE.BufferGeometry();
      shellGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      shellGeo.setIndex(indices);
      shellGeo.computeVertexNormals();
      raceWorldGroup.add(new THREE.Mesh(shellGeo, tunnelShellMat));

      // Recessed glowing ceiling & wall neon light strips inside the enclosed tunnel
      [0.18, 0.50, 0.82].forEach((frac, stripIdx) => {
        const theta = frac * Math.PI;
        const stripPos = [];
        const stripIdxArr = [];
        for (let i = sIdx; i <= eIdx; i++) {
          const p = pts[i];
          const r = rights[i];
          const u = ups[i];
          const tA = theta - 0.025;
          const tB = theta + 0.025;
          const rIn = radius - 0.25;
          const vA = p.clone().addScaledVector(r, Math.cos(tA) * rIn).addScaledVector(u, Math.sin(tA) * rIn * 0.72 + 0.4);
          const vB = p.clone().addScaledVector(r, Math.cos(tB) * rIn).addScaledVector(u, Math.sin(tB) * rIn * 0.72 + 0.4);
          stripPos.push(vA.x, vA.y, vA.z, vB.x, vB.y, vB.z);
          if (i < eIdx) {
            const b = (i - sIdx) * 2;
            stripIdxArr.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
          }
        }
        const sGeo = new THREE.BufferGeometry();
        sGeo.setAttribute('position', new THREE.Float32BufferAttribute(stripPos, 3));
        sGeo.setIndex(stripIdxArr);
        raceWorldGroup.add(new THREE.Mesh(sGeo, tunnelStripMats[stripIdx % tunnelStripMats.length]));
      });

      // Glowing inner rib frames + portal mouths
      for (let i = sIdx; i <= eIdx; i += 6) {
        const p = pts[i];
        const t = tangents[i];
        const isPortal = i === sIdx || i + 6 > eIdx;
        const ribMat = tunnelStripMats[(i / 6) % tunnelStripMats.length | 0];
        const rib = new THREE.Mesh(
          new THREE.TorusGeometry(radius - 0.35, isPortal ? 0.32 : 0.14, 8, 22, Math.PI),
          ribMat
        );
        rib.position.copy(p);
        rib.position.y += 0.4;
        rib.scale.set(1, 0.72, 1);
        rib.rotation.y = Math.atan2(t.x, t.z);
        raceWorldGroup.add(rib);
      }
    });

    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x293548, roughness: 0.72 });
    for (let i = 0; i < FRAMES_COUNT; i += 8) {
      const p = pts[i];
      if (p.y > 2.2) {
        const r = rights[i];
        [-ROAD_HALF_W * 0.6, ROAD_HALF_W * 0.6].forEach(px => {
          const pilH = Math.max(2, p.y + 3.4);
          const pil = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.8, pilH, 8), pillarMat);
          pil.position.copy(p).addScaledVector(r, px);
          pil.position.y = (p.y - 0.6) / 2 - 2;
          raceWorldGroup.add(pil);
        });
      }
    }

    // 6. Ground Plane & Trackside Environment Scenery
    const groundColor = isNight ? 0x050914 : spec.envType === 'canyon' ? 0x24110d : 0x081716;
    const groundMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3400, 3400),
      new THREE.MeshStandardMaterial({ color: groundColor, roughness: 0.92 })
    );
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -2.2;
    groundMesh.receiveShadow = true;
    raceWorldGroup.add(groundMesh);

    let oceanUniforms = null;
    if (spec.envType === 'canyon') {
      oceanUniforms = {
        uTime: { value: 0 },
        uSunDir: { value: new THREE.Vector3(0.76, 0.14, -0.63).normalize() }
      };
      const oceanMat = new THREE.ShaderMaterial({
        uniforms: oceanUniforms,
        vertexShader: `
          varying vec3 vWorldPos;
          void main() {
            vec4 wp = modelMatrix * vec4(position, 1.0);
            vWorldPos = wp.xyz;
            gl_Position = projectionMatrix * viewMatrix * wp;
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec3 uSunDir;
          varying vec3 vWorldPos;
          void main() {
            vec2 p = vWorldPos.xz * 0.045;
            float w1 = sin(p.x * 2.1 + uTime * 1.4) * cos(p.y * 1.7 - uTime * 1.1);
            float w2 = sin(p.x * 4.7 - uTime * 2.1 + p.y * 3.1) * 0.5;
            vec3 normal = normalize(vec3((w1 + w2) * 0.08, 1.0, (w1 - w2) * 0.08));
            vec3 viewDir = normalize(cameraPosition - vWorldPos);
            vec3 halfVec = normalize(normalize(uSunDir) + viewDir);
            float specPath = pow(max(dot(normal, halfVec), 0.0), 48.0);
            float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);

            vec3 deepWater = vec3(0.025, 0.12, 0.22);
            vec3 horizonTint = vec3(0.32, 0.16, 0.28);
            vec3 col = mix(deepWater, horizonTint, fresnel * 0.65);
            col += vec3(1.4, 0.62, 0.18) * specPath * 1.35;
            col += vec3(0.95, 0.42, 0.12) * pow(max(dot(normal, halfVec), 0.0), 8.0) * 0.28;
            gl_FragColor = vec4(col, 1.0);
          }
        `
      });
      const ocean = new THREE.Mesh(new THREE.PlaneGeometry(3400, 1600), oceanMat);
      ocean.rotation.x = -Math.PI / 2;
      ocean.position.set(1220, -1.8, 0);
      ocean.rotation.z = Math.PI / 2;
      raceWorldGroup.add(ocean);
    }

    function farFromTrack(cx, cz, minDist) {
      const minD2 = minDist * minDist;
      for (let i = 0; i < FRAMES_COUNT; i += 3) {
        const dx = cx - pts[i].x;
        const dz = cz - pts[i].z;
        if (dx * dx + dz * dz < minD2) return false;
      }
      return true;
    }

    // Street-level buildings / cliffs / pines container (hidden in aerial map view, shown on swoop & race!)
    streetBuildingsGroup = new THREE.Group();
    raceWorldGroup.add(streetBuildingsGroup);

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const palmMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.72 });
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x5c2415, roughness: 0.9, flatShading: true });
    const rockDarkMat = new THREE.MeshStandardMaterial({ color: 0x3b170e, roughness: 0.92, flatShading: true });
    const snowMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.72, flatShading: true });
    const mtnMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.88, flatShading: true });

    const towerTextures = [TEXTURES.bldgCyan, TEXTURES.bldgAmber, TEXTURES.bldgViolet];
    const towerMats = towerTextures.map(tex => new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.24,
      metalness: 0.65,
      envMapIntensity: 1.4
    }));
    const podiumMat = new THREE.MeshStandardMaterial({ color: 0x050912, roughness: 0.45, metalness: 0.55 });
    const accentColors = [0x22d3ee, 0xf59e0b, 0xa855f7];
    const accentMats = accentColors.map(c => new THREE.MeshBasicMaterial({ color: c }));

    for (let i = 0; i < FRAMES_COUNT; i += 4) {
      const p = pts[i];
      const r = rights[i];
      const t = tangents[i];
      const roadYaw = Math.atan2(t.x, t.z);
      [-1, 1].forEach(side => {
        const distOut = ROAD_HALF_W + 17 + (i % 5) * 9;
        const sx = p.x + r.x * side * distOut;
        const sz = p.z + r.z * side * distOut;
        if (!farFromTrack(sx, sz, ROAD_HALF_W + 10)) return;

        if (isNight) {
          const bw = 20 + (i % 4) * 6;
          const bh = 52 + ((i * 17) % 105);
          const styleIdx = (i + (side > 0 ? 1 : 0)) % 3;
          const tower = new THREE.Group();
          tower.position.set(sx, -2.2, sz);
          tower.rotation.y = roadYaw;

          // Architectural Podium Base with glass mullions, glowing cornice & storefront bay
          const podH = 12 + (i % 3) * 4;
          const podW = bw * 1.16;
          const pod = new THREE.Mesh(new THREE.BoxGeometry(podW, podH, podW), towerMats[(styleIdx + 2) % 3]);
          pod.position.y = podH * 0.5;
          const podCornice = new THREE.Mesh(new THREE.BoxGeometry(podW + 0.5, 0.34, podW + 0.5), accentMats[styleIdx]);
          podCornice.position.y = podH + 0.12;
          const podStorefront = new THREE.Mesh(
            new THREE.BoxGeometry(0.32, 3.2, podW * 0.74),
            accentMats[(styleIdx + 1) % 3]
          );
          podStorefront.position.set(-side * (podW * 0.5 + 0.08), 3.6, 0);
          tower.add(pod, podCornice, podStorefront);

          // Main glass shaft
          const shaft = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bw), towerMats[styleIdx]);
          shaft.position.y = bh * 0.5;
          tower.add(shaft);

          // Stepped setback upper tier
          const topH = 16 + (i % 4) * 7;
          const topTier = new THREE.Mesh(new THREE.BoxGeometry(bw * 0.68, topH, bw * 0.68), towerMats[(styleIdx + 1) % 3]);
          topTier.position.y = bh + topH * 0.5;
          tower.add(topTier);

          // Mechanical crown + aviation spire
          const crown = new THREE.Mesh(new THREE.BoxGeometry(bw * 0.42, 3.2, bw * 0.42), podiumMat);
          crown.position.y = bh + topH + 1.6;
          const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.32, 16, 6), podiumMat);
          spire.position.y = bh + topH + 11;
          const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 8), accentMats[styleIdx]);
          beacon.position.y = bh + topH + 19;
          tower.add(crown, spire, beacon);

          // Thin vertical architectural edge accent tubes
          const edgeStrip = new THREE.Mesh(new THREE.BoxGeometry(0.36, bh + topH * 0.7, 0.36), accentMats[styleIdx]);
          edgeStrip.position.set(-side * (bw * 0.5 + 0.12), (bh + topH * 0.7) * 0.5, bw * 0.5 + 0.12);
          tower.add(edgeStrip);

          // Sleek vertical neon blade signage strip on select towers
          if (i % 12 === 0) {
            const bladeSign = new THREE.Mesh(new THREE.BoxGeometry(0.45, 22, 2.2), accentMats[(styleIdx + 1) % 3]);
            bladeSign.position.set(-side * (bw * 0.5 + 0.8), 26, 0);
            tower.add(bladeSign);
          }

          streetBuildingsGroup.add(tower);
        } else if (spec.envType === 'canyon') {
          if (i % 8 === 0) {
            const mh = 30 + (i % 6) * 14;
            const ridge = new THREE.Group();
            const m1 = new THREE.Mesh(new THREE.CylinderGeometry(9, 20, mh, 7), rockMat);
            m1.position.y = mh * 0.5 - 2.2;
            const m2 = new THREE.Mesh(new THREE.CylinderGeometry(5, 13, mh * 0.65, 6), rockDarkMat);
            m2.position.set(side * 12, mh * 0.32 - 2.2, 8);
            ridge.add(m1, m2);
            ridge.position.set(sx, 0, sz);
            streetBuildingsGroup.add(ridge);
          } else {
            const palm = new THREE.Group();
            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.65, 12, 7), trunkMat);
            trunk.position.y = 6;
            trunk.rotation.z = side * 0.08;
            palm.add(trunk);
            for (let f = 0; f < 6; f++) {
              const frond = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.18, 5.2), palmMat);
              const fa = (f / 6) * Math.PI * 2;
              frond.position.set(Math.sin(fa) * 2.2, 12, Math.cos(fa) * 2.2);
              frond.rotation.y = fa;
              frond.rotation.x = 0.34;
              palm.add(frond);
            }
            palm.position.set(sx, -2.2, sz);
            streetBuildingsGroup.add(palm);
          }
        } else {
          if (i % 12 === 0) {
            const mh = 65 + (i % 5) * 26;
            const mtn = new THREE.Group();
            const base = new THREE.Mesh(new THREE.ConeGeometry(34, mh, 7), mtnMat);
            base.position.y = mh * 0.5 - 2.2;
            const cap = new THREE.Mesh(new THREE.ConeGeometry(15, mh * 0.45, 7), snowMat);
            cap.position.y = mh * 0.78 - 2.2;
            mtn.add(base, cap);
            mtn.position.set(sx + r.x * side * 26, 0, sz + r.z * side * 26);
            streetBuildingsGroup.add(mtn);
          } else {
            const pine = new THREE.Group();
            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.75, 5.5, 6), trunkMat);
            trunk.position.y = 2.75;
            const c1 = new THREE.Mesh(new THREE.ConeGeometry(3.8, 7.2, 7), palmMat);
            c1.position.y = 6.8;
            const c2 = new THREE.Mesh(new THREE.ConeGeometry(2.9, 6.0, 7), palmMat);
            c2.position.y = 10.2;
            const c3 = new THREE.Mesh(new THREE.ConeGeometry(1.9, 4.5, 7), snowMat);
            c3.position.y = 12.8;
            pine.add(trunk, c1, c2, c3);
            pine.position.set(sx, -2.2, sz);
            streetBuildingsGroup.add(pine);
          }
        }
      });
    }

    // 6b. Elevated Steel Yamanote Rail Viaducts + Animated Emerald Express Trains (Tokyo)
    const viaductTrains = [];
    if (isNight) {
      const viaductSteel = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.75, roughness: 0.35 });
      const railTrimMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
      const expressTrainMat = new THREE.MeshBasicMaterial({ color: 0x4ade80 });
      const expressWinMat = new THREE.MeshBasicMaterial({ color: 0xecfdf5 });

      [24, 480].forEach((vSeg, vIdx) => {
        const vp = pts[vSeg];
        const vt = tangents[vSeg];
        const vYaw = Math.atan2(vt.x, vt.z) + Math.PI / 2;
        const viaduct = new THREE.Group();
        viaduct.position.set(vp.x, vp.y + 15.8, vp.z);
        viaduct.rotation.y = vYaw;

        const deck = new THREE.Mesh(new THREE.BoxGeometry(10.5, 1.8, 170), viaductSteel);
        viaduct.add(deck);
        [-5.3, 5.3].forEach(rx => {
          const trim = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.35, 170), railTrimMat);
          trim.position.set(rx, 0.4, 0);
          viaduct.add(trim);
        });
        [-32, 32].forEach(pz => {
          const pier = new THREE.Mesh(new THREE.BoxGeometry(4.0, 18.0, 4.0), viaductSteel);
          pier.position.set(0, -9.8, pz);
          viaduct.add(pier);
        });

        const trainGrp = new THREE.Group();
        const body = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.8, 44), viaductSteel);
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(3.35, 0.45, 44), expressTrainMat);
        stripe.position.y = -0.35;
        const winStrip = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.75, 40), expressWinMat);
        winStrip.position.y = 0.55;
        trainGrp.add(body, stripe, winStrip);
        trainGrp.position.y = 2.4;
        viaduct.add(trainGrp);

        streetBuildingsGroup.add(viaduct);
        viaductTrains.push({ mesh: trainGrp, phase: vIdx * 1.9, dir: vIdx % 2 === 0 ? 1 : -1 });
      });
    }

    // 6c. Canyon Coastal Suspension Bridge (Twin Pylons + Warm Steel-Bronze Catenary & Suspender Cables)
    if (spec.envType === 'canyon') {
      const bridgeSteel = new THREE.MeshStandardMaterial({ color: 0x8c3012, metalness: 0.65, roughness: 0.38 });
      const cableMat = new THREE.MeshStandardMaterial({ color: 0xc27848, metalness: 0.72, roughness: 0.35 });
      const bStart = 60;
      const bEnd = 104;
      [74, 96].forEach(pSeg => {
        const bp = pts[pSeg];
        const br = rights[pSeg];
        const bt = tangents[pSeg];
        const tower = new THREE.Group();
        [-ROAD_HALF_W - 0.9, ROAD_HALF_W + 0.9].forEach(sx => {
          const leg = new THREE.Mesh(new THREE.BoxGeometry(1.6, 36, 1.8), bridgeSteel);
          leg.position.set(sx, 16, 0);
          tower.add(leg);
        });
        const crossTop = new THREE.Mesh(new THREE.BoxGeometry(ROAD_HALF_W * 2 + 3.4, 1.8, 1.6), bridgeSteel);
        crossTop.position.set(0, 32, 0);
        tower.add(crossTop);
        tower.position.copy(bp);
        tower.rotation.y = Math.atan2(bt.x, bt.z);
        streetBuildingsGroup.add(tower);
      });
      [-1, 1].forEach(sideSign => {
        const catPts = [];
        for (let i = bStart; i <= bEnd; i += 2) {
          const bp = pts[i];
          const br = rights[i];
          const tSpan = (i - bStart) / (bEnd - bStart);
          const sag = Math.sin(tSpan * Math.PI) * -12 + 30;
          const cablePt = bp.clone().addScaledVector(br, sideSign * (ROAD_HALF_W + 0.9)).add(new THREE.Vector3(0, sag, 0));
          catPts.push(cablePt);
          if (i % 4 === 0 && i > bStart && i < bEnd) {
            const hanger = new THREE.Mesh(new THREE.BoxGeometry(0.12, sag, 0.12), cableMat);
            hanger.position.copy(bp).addScaledVector(br, sideSign * (ROAD_HALF_W + 0.9)).add(new THREE.Vector3(0, sag * 0.5, 0));
            streetBuildingsGroup.add(hanger);
          }
        }
        const catGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(catPts), 40, 0.18, 6, false);
        streetBuildingsGroup.add(new THREE.Mesh(catGeo, cableMat));
      });
    }

    trackAnimState = { roadTimeUniform, oceanUniforms, viaductTrains };

    // 7. Build 3D Aerial Neon Transit Map Overlay
    aerialMapGroup = buildAerialCityOverlay(trackIdx, pts, tangents, rights, farFromTrack);
    raceWorldGroup.add(aerialMapGroup);

    // Apply Track Sky Dome, Fog, Lighting & PBR Reflection Map
    skyDomeMat.uniforms.uMode.value = trackIdx;
    scene.background.setHex(spec.sky);
    scene.fog.color.setHex(spec.fogColor);
    scene.fog.density = spec.fogDensity;
    ambientLight.color.setHex(spec.ambient);
    ambientLight.intensity = spec.ambientInt;
    hemiLight.color.setHex(isNight ? 0x1e3a5f : spec.envType === 'canyon' ? 0xfb923c : 0xbae6fd);
    hemiLight.groundColor.setHex(isNight ? 0x03060e : spec.envType === 'canyon' ? 0x2a120c : 0x091624);
    hemiLight.intensity = isNight ? 0.20 : 0.62;
    sunLight.color.setHex(spec.sunColor);
    sunLight.intensity = spec.sunInt;
    scene.environment = isNight ? ENV_MAPS.night : spec.envType === 'canyon' ? ENV_MAPS.canyon : ENV_MAPS.alpine;

    const exp = spec.exposure !== undefined ? spec.exposure : 1.06;
    renderer.toneMappingExposure = exp;
    if (outputFXAAPass) outputFXAAPass.uniforms.uExposure.value = exp;
    if (bloomPass) {
      bloomPass.strength = spec.bloomStrength !== undefined ? spec.bloomStrength : 0.68;
      bloomPass.radius = spec.bloomRadius !== undefined ? spec.bloomRadius : 0.36;
      bloomPass.threshold = spec.bloomThreshold !== undefined ? spec.bloomThreshold : 0.78;
    }

    trackData = { spec, curve, pts, tangents, rights, ups, curvatures };
  }

  // --- PROJECT WORLD (X, Z) ONTO CLOSEST SPLINE SEGMENT ---
  function projectOntoTrack(x, z, hintIdx = -1) {
    const pts = trackData.pts;
    let bestSeg = 0;
    let bestS = 0;
    let bestDist2 = Infinity;

    if (hintIdx >= 0) {
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

  // --- 3D UNDERGROUND SPEEDSHOP STAGE & INTERACTIVE 360° ORBIT ---
  const turntableGroup = new THREE.Group();
  showroomGroup.add(turntableGroup);
  let garageOrbitYaw = 0.56;
  let garageDragging = false;
  let garageLastX = 0;

  let showroomRings = [];

  function buildShowroomStage() {
    showroomRings = [];
    const stageBase = new THREE.Mesh(
      new THREE.CylinderGeometry(5.6, 6.0, 0.34, 48),
      new THREE.MeshStandardMaterial({ color: 0x0a101d, metalness: 0.80, roughness: 0.20, envMapIntensity: 1.3 })
    );
    stageBase.position.y = -0.18;
    stageBase.receiveShadow = true;

    const innerDisk = new THREE.Mesh(
      new THREE.CylinderGeometry(5.05, 5.05, 0.36, 48),
      new THREE.MeshStandardMaterial({ color: 0x060a12, metalness: 0.86, roughness: 0.14, envMapIntensity: 1.5 })
    );
    innerDisk.position.y = -0.175;

    const glowRing = new THREE.Mesh(
      new THREE.TorusGeometry(5.65, 0.065, 12, 64),
      new THREE.MeshBasicMaterial({ color: 0x22d3ee })
    );
    glowRing.rotation.x = Math.PI / 2;
    glowRing.position.y = 0.02;

    const outerAccentRing = new THREE.Mesh(
      new THREE.TorusGeometry(6.35, 0.035, 8, 64),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b })
    );
    outerAccentRing.rotation.x = Math.PI / 2;
    outerAccentRing.position.y = -0.02;

    // Animated concentric holographic cyan/amber radar rings under turntable
    for (let r = 0; r < 3; r++) {
      const rMat = new THREE.MeshBasicMaterial({
        color: r % 2 === 0 ? 0x22d3ee : 0xf59e0b,
        transparent: true,
        opacity: 0.48,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      const rMesh = new THREE.Mesh(new THREE.RingGeometry(4.8, 4.96, 64), rMat);
      rMesh.rotation.x = -Math.PI / 2;
      rMesh.position.y = -0.32;
      showroomGroup.add(rMesh);
      showroomRings.push({ mesh: rMesh, mat: rMat, phase: r * 0.333 });
    }

    const floorMirror = new THREE.Mesh(
      new THREE.PlaneGeometry(44, 44),
      new THREE.MeshStandardMaterial({
        map: TEXTURES.garageFloor,
        color: 0x7c8aa3,
        metalness: 0.56,
        roughness: 0.28,
        envMapIntensity: 0.62
      })
    );
    floorMirror.rotation.x = -Math.PI / 2;
    floorMirror.position.y = -0.36;

    // Architectural Obsidian Concrete Studio Columns, Light Strips & Overhead Softboxes
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x0e1524, roughness: 0.72, metalness: 0.28 });
    const trussMat = new THREE.MeshStandardMaterial({ color: 0x080c14, roughness: 0.55, metalness: 0.65 });
    const cyanNeon = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
    const amberNeon = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const softboxMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe });

    [-7.5, 0, 7.5].forEach((pz, idx) => {
      [-9.5, 9.5].forEach(px => {
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.95, 7.2, 0.95), pillarMat);
        col.position.set(px, 3.2, pz);
        const tube = new THREE.Mesh(new THREE.BoxGeometry(0.10, 5.6, 0.10), (idx + (px > 0 ? 1 : 0)) % 2 === 0 ? cyanNeon : amberNeon);
        tube.position.set(px + (px > 0 ? -0.52 : 0.52), 3.1, pz);
        showroomGroup.add(col, tube);
      });
      const beam = new THREE.Mesh(new THREE.BoxGeometry(20, 0.32, 0.42), trussMat);
      beam.position.set(0, 6.4, pz);
      const softbox = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.10, 0.85), softboxMat);
      softbox.position.set(0, 5.95, pz);
      showroomGroup.add(beam, softbox);
    });

    const archBack = new THREE.Mesh(
      new THREE.TorusGeometry(6.8, 0.09, 10, 48, Math.PI),
      cyanNeon
    );
    archBack.position.set(0, -0.2, -10.5);
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(26, 10),
      new THREE.MeshStandardMaterial({ color: 0x04070e, roughness: 0.88 })
    );
    backWall.position.set(0, 4.1, -12.0);

    const spot1 = new THREE.SpotLight(0x22d3ee, 1.35, 34, Math.PI / 4, 0.85);
    spot1.position.set(8, 7.5, 6);
    const spot2 = new THREE.SpotLight(0x38bdf8, 1.15, 34, Math.PI / 4, 0.85);
    spot2.position.set(-8, 6.5, -7);

    turntableGroup.add(stageBase, innerDisk, glowRing, outerAccentRing);
    showroomGroup.add(floorMirror, archBack, backWall, spot1, spot2);
  }
  buildShowroomStage();

  canvas.addEventListener('pointerdown', e => {
    if (appState !== 'garage') return;
    garageDragging = true;
    garageLastX = e.clientX;
  });
  window.addEventListener('pointermove', e => {
    if (!garageDragging || appState !== 'garage') return;
    const dx = e.clientX - garageLastX;
    garageLastX = e.clientX;
    garageOrbitYaw += dx * 0.01;
  });
  window.addEventListener('pointerup', () => { garageDragging = false; });

  // --- GARAGE CUSTOMIZATION & GEARBOX STATE ---
  let selectedCarIdx = 0;
  let selectedPaintHex = CAR_SPECS[0].defaultPaint;
  let selectedGlowHex = CAR_SPECS[0].defaultGlow;
  let selectedRimId = 'chrome';
  let selectedWing = CAR_SPECS[0].defaultWing;
  let selectedTrackIdx = 0;
  let selectedModeIdx = 0;
  let selectedDiffIdx = 0;
  (() => {
    const initParams = new URLSearchParams(window.location.search);
    const diffParam = initParams.get('diff');
    let savedDiff = null;
    try { savedDiff = localStorage.getItem('apex_difficulty'); } catch (_) {}
    const chosenId = diffParam || savedDiff;
    const di = DIFF_SPECS.findIndex(d => d.id === chosenId);
    if (di >= 0) selectedDiffIdx = di;
  })();
  let manualTransmission = false;

  let showroomCar = null;
  function refreshShowroomCar() {
    if (showroomCar) turntableGroup.remove(showroomCar.root);
    const spec = CAR_SPECS[selectedCarIdx];
    showroomCar = buildSupercarMesh(spec, {
      paintHex: selectedPaintHex,
      glowHex: selectedGlowHex,
      rimId: selectedRimId,
      wingStyle: selectedWing,
      inGarage: true
    });
    turntableGroup.add(showroomCar.root);

    document.getElementById('garageCarTitle').textContent = spec.name;
    document.getElementById('carClassTag').textContent = spec.cls;
    document.getElementById('carRatingTag').textContent = spec.rating;
    document.getElementById('statSpdLbl').textContent = spec.topSpeed;
    document.getElementById('statSpdBar').style.width = spec.topSpeed + '%';
    document.getElementById('statAccLbl').textContent = Math.round(spec.accel * 1.45);
    document.getElementById('statAccBar').style.width = Math.min(100, Math.round(spec.accel * 1.45)) + '%';
    document.getElementById('statHndLbl').textContent = spec.handling;
    document.getElementById('statHndBar').style.width = spec.handling + '%';
  }

  function updateEventSummary() {
    const tr = TRACK_SPECS[selectedTrackIdx];
    const md = MODE_SPECS[selectedModeIdx];
    const df = DIFF_SPECS[selectedDiffIdx] || DIFF_SPECS[0];
    document.getElementById('eventSummaryLbl').textContent = `${tr.name} • ${md.name} • ${df.hudBtn}`;
  }

  function syncTrackModeActiveCards() {
    document.querySelectorAll('#trackSelector .mode-card-btn').forEach((el, j) => el.classList.toggle('active', j === selectedTrackIdx));
    document.querySelectorAll('#modeSelector .mode-card-btn').forEach((el, j) => el.classList.toggle('active', j === selectedModeIdx));
    document.querySelectorAll('#diffSelector .mode-card-btn').forEach((el, j) => el.classList.toggle('active', j === selectedDiffIdx));
    updateEventSummary();
  }

  function initGarageUI() {
    // 3-Tab Left Drawer Switcher
    document.querySelectorAll('.garage-tabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sfx.init();
        const tab = btn.dataset.tab;
        document.querySelectorAll('.garage-tabs .tab-btn').forEach(b => b.classList.toggle('active', b === btn));
        document.getElementById('tabCars').classList.toggle('active', tab === 'cars');
        document.getElementById('tabStyle').classList.toggle('active', tab === 'style');
        document.getElementById('tabEvent').classList.toggle('active', tab === 'event');
      });
    });

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

    const rimWrap = document.getElementById('rimSelector');
    RIM_STYLES.forEach(r => {
      const pill = document.createElement('button');
      pill.className = 'opt-pill';
      pill.textContent = r.label;
      pill.dataset.rim = r.id;
      pill.addEventListener('click', () => {
        sfx.init();
        selectedRimId = r.id;
        syncCustomizationPills();
        refreshShowroomCar();
      });
      rimWrap.appendChild(pill);
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
        syncTrackModeActiveCards();
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
        syncTrackModeActiveCards();
      });
      modeWrap.appendChild(card);
    });

    const diffWrap = document.getElementById('diffSelector');
    DIFF_SPECS.forEach((df, idx) => {
      const card = document.createElement('button');
      card.className = 'mode-card-btn' + (idx === selectedDiffIdx ? ' active' : '');
      card.innerHTML = `<div class="mode-title">${df.name}</div><div class="mode-desc">${df.desc}</div>`;
      card.addEventListener('click', () => {
        sfx.init();
        setDifficulty(idx, true);
      });
      diffWrap.appendChild(card);
    });

    syncCustomizationPills();
    syncTrackModeActiveCards();
    refreshShowroomCar();
  }

  function syncCustomizationPills() {
    document.querySelectorAll('#paintSwatches .swatch-btn').forEach(el => {
      el.classList.toggle('active', parseInt(el.dataset.hex, 10) === selectedPaintHex);
    });
    document.querySelectorAll('#glowSwatches .swatch-btn').forEach(el => {
      el.classList.toggle('active', parseInt(el.dataset.hex, 10) === selectedGlowHex);
    });
    document.querySelectorAll('#rimSelector .opt-pill').forEach(el => {
      el.classList.toggle('active', el.dataset.rim === selectedRimId);
    });
    document.querySelectorAll('#wingSelector .opt-pill').forEach(el => {
      el.classList.toggle('active', el.dataset.wing === selectedWing);
    });
  }

  initGarageUI();

  // --- SOFT RADIAL SPRITE PARTICLE POOL (SMOKE & SPARKS) ---
  const particles = [];
  const sparkSpriteMat = new THREE.SpriteMaterial({
    map: TEXTURES.radialGlow,
    color: 0xffb703,
    transparent: true,
    opacity: 0.92,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const smokeSpriteMat = new THREE.SpriteMaterial({
    map: TEXTURES.radialGlow,
    color: 0xcbd5e1,
    transparent: true,
    opacity: 0.34,
    depthWrite: false
  });

  function spawnParticle(isSpark, x, y, z, vx, vy, vz) {
    if (particles.length > 140) return;
    const mat = (isSpark ? sparkSpriteMat : smokeSpriteMat).clone();
    const sprite = new THREE.Sprite(mat);
    sprite.position.set(x, y, z);
    const s = isSpark ? 0.55 : 1.35;
    sprite.scale.set(s, s, 1);
    raceWorldGroup.add(sprite);
    particles.push({ mesh: sprite, mat, isSpark, vx, vy, vz, life: isSpark ? 0.36 : 0.68, maxLife: isSpark ? 0.36 : 0.68 });
  }

  // --- GAME STATE, CAMERAS, SWOOP & TAIL RIBBONS ---
  let appState = 'title'; // 'title' | 'swoop' | 'garage' | 'countdown' | 'racing' | 'results'
  let playerCar = null;
  let aiRacers = [];
  let attractRacers = [];
  let attractTimer = 0;
  let aerialOrbitAngle = 0.52;
  let pointerParallaxX = 0;
  let pointerParallaxY = 0;
  let swoopTimer = 0;
  const SWOOP_DURATION = 1.35;
  let swoopStartPos = new THREE.Vector3();
  let swoopStartLook = new THREE.Vector3();
  let swoopEndPos = new THREE.Vector3();
  let swoopEndLook = new THREE.Vector3();
  let swoopStartFov = 42;
  let swoopEndFov = 64;
  let hudHintsTimer = 0;
  let shotForceNos = false;

  let playerRibbonL = null;
  let playerRibbonR = null;
  let prevRearTirePos = null;

  let raceElapsed = 0;
  let lapStartTime = 0;
  let bestLapTime = Infinity;
  let countdownTimer = 3.2;
  let lastCountdownBeep = 4;
  let cameraMode = 0;
  const CAM_LABELS = ['🎥 Chase', '🎥 Cockpit', '🎥 Hood', '🎥 Heli'];

  let totalStyleScore = 0;
  let activeDriftPts = 0;
  let activeDriftMult = 1;
  let activeDriftTimer = 0;
  let maxMphReached = 0;
  let nearMissCooldown = 0;
  let pursuitTimeLimit = 120;

  // 6-Speed Torque Gearbox Constants
  const GEAR_MAX_MPH = [0, 42, 76, 114, 152, 192, 275];

  function trackEvent(eventName, params) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params || {});
      }
    } catch (_) {}
  }

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

  function setBodyScreen(modeClass) {
    document.body.classList.remove('in-title', 'in-swoop', 'in-garage', 'in-race');
    document.body.classList.add(modeClass);
  }

  function applyCameraVisibility() {
    if (!playerCar || !playerCar.meshObj) return;
    const isCockpit = cameraMode === 1 && (appState === 'racing' || appState === 'countdown' || appState === 'swoop');
    if (playerCar.meshObj.glassMesh) playerCar.meshObj.glassMesh.visible = !isCockpit;
    if (playerCar.meshObj.cockpitGroup) playerCar.meshObj.cockpitGroup.visible = isCockpit;
    if (playerCar.meshObj.headlightCones) playerCar.meshObj.headlightCones.visible = !isCockpit;
    document.getElementById('btnCam').textContent = CAM_LABELS[cameraMode];
  }

  // Pointer parallax for 3D Aerial Transit Map
  window.addEventListener('pointermove', e => {
    if (appState !== 'title') return;
    pointerParallaxX = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2.0;
    pointerParallaxY = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2.0;
  });

  // 3D-Projected Landmark Pills (#mapLabelsLayer)
  let mapLabelEls = [];
  function rebuildMapLabelsDom() {
    const layer = document.getElementById('mapLabelsLayer');
    const svg = document.getElementById('mapLabelsSvg');
    if (!layer || !svg) return;
    layer.querySelectorAll('.map-pill').forEach(el => el.remove());
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    mapLabelEls = [];
    if (!aerialAnimState || !aerialAnimState.landmarks) return;

    aerialAnimState.landmarks.forEach(lm => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('stroke', lm.color);
      line.setAttribute('stroke-width', '1.25');
      line.setAttribute('stroke-opacity', '0.72');
      svg.appendChild(line);

      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('r', '3.5');
      dot.setAttribute('fill', lm.color);
      svg.appendChild(dot);

      const pill = document.createElement('div');
      pill.className = 'map-pill';
      pill.innerHTML = `<span class="map-pill-dot" style="background:${lm.color};box-shadow:0 0 8px ${lm.color};"></span><span class="map-pill-text">${lm.label}</span>`;
      layer.appendChild(pill);

      mapLabelEls.push({ lm, line, dot, pill });
    });
  }

  const _projVec = new THREE.Vector3();
  function projectMapLabels() {
    if (!mapLabelEls.length) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    mapLabelEls.forEach(item => {
      _projVec.copy(item.lm.worldPos).project(camera);
      if (_projVec.z > 1 || _projVec.z < -1) {
        item.pill.style.opacity = '0';
        item.line.setAttribute('opacity', '0');
        item.dot.setAttribute('opacity', '0');
        return;
      }
      const sx = (_projVec.x * 0.5 + 0.5) * w;
      const sy = (-_projVec.y * 0.5 + 0.5) * h;
      const ox = sx > w * 0.65 ? -18 : 22;
      const oy = sy < h * 0.28 ? 22 : -24;
      const px = Math.max(24, Math.min(w - 170, sx + ox));
      const py = Math.max(66, Math.min(h - 110, sy + oy));

      item.pill.style.opacity = '1';
      item.pill.style.left = `${px}px`;
      item.pill.style.top = `${py}px`;
      item.pill.style.transform = sx > w * 0.65 ? 'translate(-100%, -50%)' : 'translate(0, -50%)';

      item.line.setAttribute('opacity', '1');
      item.line.setAttribute('x1', sx);
      item.line.setAttribute('y1', sy);
      item.line.setAttribute('x2', px);
      item.line.setAttribute('y2', py);

      item.dot.setAttribute('opacity', '1');
      item.dot.setAttribute('cx', sx);
      item.dot.setAttribute('cy', sy);
    });
  }

  function syncTitlePillsUI() {
    const tr = TRACK_SPECS[selectedTrackIdx] || TRACK_SPECS[0];
    const subEl = document.getElementById('titleRouteSub');
    if (subEl) subEl.textContent = tr.routeSub;
    document.querySelectorAll('#titleCircuitTabs .pill-seg-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.track, 10) === selectedTrackIdx);
    });
    document.querySelectorAll('#titleModeTabs .pill-seg-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.mode, 10) === selectedModeIdx);
    });
  }

  function computeAerialCameraPose(angle, px = 0, py = 0) {
    const c = aerialAnimState ? aerialAnimState.center : new THREE.Vector3(80, 0, 10);
    const radius = 640;
    const height = 740;
    const effAngle = angle + px * 0.14;
    const camPos = new THREE.Vector3(
      c.x + Math.sin(effAngle) * radius,
      height + py * 40,
      c.z + Math.cos(effAngle) * radius
    );
    const lookPos = new THREE.Vector3(c.x + px * 25, 0, c.z - 20 + py * 20);
    return { camPos, lookPos };
  }

  // --- LIVE 3D AERIAL NEON TRANSIT MAP TITLE SCREEN ---
  function enterTitleScreen(trackOverride) {
    if (typeof trackOverride === 'number' && trackOverride >= 0 && trackOverride < TRACK_SPECS.length) {
      selectedTrackIdx = trackOverride;
    }
    appState = 'title';
    shotForceNos = false;
    setBodyScreen('in-title');
    document.getElementById('resultsOverlay').classList.remove('active');
    showroomGroup.visible = false;
    raceWorldGroup.visible = true;
    skyDome.visible = true;

    buildTrack(selectedTrackIdx);
    if (streetBuildingsGroup) streetBuildingsGroup.visible = false;
    if (aerialMapGroup) aerialMapGroup.visible = true;
    scene.fog.density = 0.00014; // Keep aerial transit map razor sharp from altitude
    ambientLight.intensity = 0.22;
    hemiLight.intensity = 0.14;
    sunLight.intensity = 0.42;

    attractRacers = [];
    attractTimer = 0;
    aerialOrbitAngle = 0.52;

    for (let i = 0; i < 6; i++) {
      const spec = CAR_SPECS[i % CAR_SPECS.length];
      const sw = PAINT_SWATCHES[(i * 2 + 1) % PAINT_SWATCHES.length];
      const gl = GLOW_SWATCHES[i % 5];
      const segIdx = (24 + i * 86) % FRAMES_COUNT;
      const p = trackData.pts[segIdx];
      const t = trackData.tangents[segIdx];
      const r = trackData.rights[segIdx];
      const lat = (i % 2 === 0 ? -4.5 : 4.5);
      const meshObj = buildSupercarMesh(spec, {
        paintHex: spec.id === 'interceptor' ? 0x0f172a : sw.hex,
        glowHex: spec.id === 'interceptor' ? 0x3b82f6 : gl.hex,
        rimId: i % 2 === 0 ? 'chrome' : 'gold',
        wingStyle: spec.defaultWing,
        isPursuit: spec.id === 'interceptor'
      });
      raceWorldGroup.add(meshObj.root);
      const ribL = new TailRibbon(raceWorldGroup, 26, 0.95, 0x22d3ee);
      const ribR = new TailRibbon(raceWorldGroup, 26, 0.95, 0x22d3ee);
      attractRacers.push({
        spec,
        meshObj,
        ribL,
        ribR,
        segIdx,
        lat,
        targetLat: lat,
        x: p.x + r.x * lat,
        y: p.y,
        z: p.z + r.z * lat,
        heading: Math.atan2(t.x, t.z),
        speed: spec.maxSpdPhys * 0.85,
        steerAngle: 0,
        driftAngle: 0,
        u: segIdx / FRAMES_COUNT,
        lap: 0
      });
    }

    camera.fov = 42;
    camera.updateProjectionMatrix();
    const pose = computeAerialCameraPose(aerialOrbitAngle, 0, 0);
    camera.position.copy(pose.camPos);
    camera.lookAt(pose.lookPos);
    skyDome.position.copy(camera.position);

    syncTitlePillsUI();
    syncTrackModeActiveCards();
    rebuildMapLabelsDom();
    projectMapLabels();
  }

  function enterGarage() {
    appState = 'garage';
    shotForceNos = false;
    setBodyScreen('in-garage');
    document.getElementById('resultsOverlay').classList.remove('active');
    showroomGroup.visible = true;
    raceWorldGroup.visible = false;
    skyDome.visible = false;

    scene.background.setHex(0x04070e);
    scene.fog.color.setHex(0x04070e);
    scene.fog.density = 0.018;
    ambientLight.color.setHex(0x4f6494);
    ambientLight.intensity = 0.46;
    hemiLight.color.setHex(0x22d3ee);
    hemiLight.groundColor.setHex(0x04070e);
    hemiLight.intensity = 0.24;
    sunLight.color.setHex(0xe0f2fe);
    sunLight.intensity = 0.72;
    sunLight.position.set(-40, 120, -60);
    sunLight.target.position.set(0, 0, 0);
    sunLight.target.updateMatrixWorld();
    scene.environment = ENV_MAPS.garage;
    renderer.toneMappingExposure = 1.06;
    if (outputFXAAPass) {
      outputFXAAPass.uniforms.uExposure.value = 1.06;
      outputFXAAPass.uniforms.uNitroAmount.value = 0.0;
    }
    if (bloomPass) {
      bloomPass.strength = 0.68;
      bloomPass.radius = 0.36;
      bloomPass.threshold = 0.78;
    }

    camera.fov = 50;
    camera.updateProjectionMatrix();
    syncTrackModeActiveCards();
  }

  function prepareRaceGrid(keepAerialOverlay) {
    sfx.init();
    if (mobileControlActive && mobileControlMode === 'tilt' && !tiltAttached) {
      enableTiltSensor(false);
    }
    document.getElementById('resultsOverlay').classList.remove('active');
    showroomGroup.visible = false;
    raceWorldGroup.visible = true;
    skyDome.visible = true;

    buildTrack(selectedTrackIdx);
    if (streetBuildingsGroup) streetBuildingsGroup.visible = true;
    if (aerialMapGroup) aerialMapGroup.visible = !!keepAerialOverlay;

    aiRacers = [];
    particles.length = 0;
    prevRearTirePos = null;
    hudHintsTimer = 0;
    document.body.classList.remove('hud-hints-faded');

    const totalLaps = MODE_SPECS[selectedModeIdx].laps;
    const isPursuit = MODE_SPECS[selectedModeIdx].id === 'pursuit';
    document.getElementById('pursuitBarCard').style.display = isPursuit ? 'block' : 'none';

    function spawnOnGrid(gridSlot, carSpec, customOpts) {
      const segIdx = (FRAMES_COUNT - 4 - gridSlot * 4 + FRAMES_COUNT) % FRAMES_COUNT;
      const p = trackData.pts[segIdx];
      const t = trackData.tangents[segIdx];
      const r = trackData.rights[segIdx];
      const laneLat = gridSlot % 2 === 0 ? -4.2 : 4.2;
      const meshObj = buildSupercarMesh(carSpec, customOpts);
      raceWorldGroup.add(meshObj.root);

      const hYaw = Math.atan2(t.x, t.z);
      const racer = {
        spec: carSpec,
        meshObj,
        isPursuit: !!customOpts.isPursuit,
        x: p.x + r.x * laneLat,
        y: p.y,
        z: p.z + r.z * laneLat,
        heading: hYaw,
        velHeading: hYaw,
        speed: 0,
        steerAngle: 0,
        smoothedSteer: 0,
        driftAngle: 0,
        loadPitch: 0,
        loadRoll: 0,
        brakeHeat: 0,
        backfireTimer: 0,
        shiftDelay: 0,
        wheelspinTimer: 0,
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

    const usedSpecs = CAR_SPECS.filter((_, idx) => idx !== selectedCarIdx);
    for (let i = 0; i < 5; i++) {
      const isCop = isPursuit && i < 3;
      const aiSpec = isCop ? CAR_SPECS[5] : usedSpecs[i % usedSpecs.length];
      const aiOpts = isCop
        ? { paintHex: 0x0f172a, glowHex: 0x3b82f6, rimId: 'matte', wingStyle: 'gt', isPursuit: true }
        : {
            paintHex: PAINT_SWATCHES[(i * 2 + 1) % PAINT_SWATCHES.length].hex,
            glowHex: GLOW_SWATCHES[i % 5].hex,
            rimId: RIM_STYLES[i % RIM_STYLES.length].id,
            wingStyle: WING_STYLES[i % 3].id
          };
      aiRacers.push(spawnOnGrid(i, aiSpec, aiOpts));
    }

    const playerSpec = CAR_SPECS[selectedCarIdx];
    playerCar = spawnOnGrid(5, playerSpec, {
      paintHex: selectedPaintHex,
      glowHex: selectedGlowHex,
      rimId: selectedRimId,
      wingStyle: selectedWing,
      withCockpit: true,
      withHeadlight: true
    });

    playerRibbonL = new TailRibbon(raceWorldGroup, 28, 0.16, 0xff1e42);
    playerRibbonR = new TailRibbon(raceWorldGroup, 28, 0.16, 0xff1e42);

    countdownTimer = 3.2;
    lastCountdownBeep = 4;

    raceElapsed = 0;
    lapStartTime = 0;
    bestLapTime = Infinity;
    totalStyleScore = 0;
    activeDriftPts = 0;
    activeDriftMult = 1;
    activeDriftTimer = 0;
    maxMphReached = 0;
    pursuitTimeLimit = 120;

    document.getElementById('posTotal').textContent = '/ 6';
    document.getElementById('lapVal').textContent = `LAP 1 / ${totalLaps}`;
    document.getElementById('bestLapVal').textContent = 'BEST --:--.--';
    document.getElementById('styleScoreVal').textContent = 'STYLE: 0 PTS';
    document.getElementById('draftHud').classList.remove('active');
    document.getElementById('comboHud').classList.remove('active');
    const popEl = document.getElementById('hudSettingsPopover');
    if (popEl) popEl.classList.remove('open');

    trackEvent('race_start', {
      track_id: TRACK_SPECS[selectedTrackIdx].id,
      game_mode: MODE_SPECS[selectedModeIdx].id,
      difficulty: (DIFF_SPECS[selectedDiffIdx] || DIFF_SPECS[0]).id,
      car_id: CAR_SPECS[selectedCarIdx].id,
      control_mode: mobileControlActive ? mobileControlMode : 'desktop'
    });
  }

  function startDiveSwoop() {
    if (appState === 'swoop') return;
    swoopStartPos.copy(camera.position);
    const pose = computeAerialCameraPose(aerialOrbitAngle, pointerParallaxX, pointerParallaxY);
    swoopStartLook.copy(pose.lookPos);
    swoopStartFov = camera.fov;

    prepareRaceGrid(true);
    appState = 'swoop';
    setBodyScreen('in-swoop');
    swoopTimer = 0;
    scene.fog.density = 0.00016;
    if (streetBuildingsGroup) streetBuildingsGroup.scale.y = 0.08;

    const ang = 0.35 + countdownTimer * 0.4;
    if (cameraMode === 1) {
      const sinH = Math.sin(playerCar.heading);
      const cosH = Math.cos(playerCar.heading);
      const camZLocal = (playerCar.spec.roofPeakX || 0) - 0.20;
      const camYLocal = playerCar.spec.roofH - 0.08;
      swoopEndPos.set(playerCar.x + sinH * camZLocal, playerCar.y + camYLocal, playerCar.z + cosH * camZLocal);
      swoopEndLook.set(playerCar.x + sinH * 20, playerCar.y + playerCar.spec.roofH - 0.45, playerCar.z + cosH * 20);
      swoopEndFov = 68;
    } else {
      swoopEndPos.set(playerCar.x + Math.sin(ang) * 9.5, playerCar.y + 3.4, playerCar.z + Math.cos(ang) * 9.5);
      swoopEndLook.set(playerCar.x, playerCar.y + 0.9, playerCar.z);
      swoopEndFov = 64;
    }
    applyCameraVisibility();
  }

  function launchRace() {
    shotForceNos = false;
    prepareRaceGrid(false);
    setBodyScreen('in-race');
    syncMobileUiState();
    appState = 'countdown';

    applyCameraVisibility();
    camera.fov = cameraMode === 1 ? 68 : 64;
    camera.updateProjectionMatrix();
    if (cameraMode === 1) {
      positionCockpitCamera(playerCar.spec, 0);
    } else {
      camera.position.set(
        playerCar.x - Math.sin(playerCar.heading) * 10,
        playerCar.y + 3.4,
        playerCar.z - Math.cos(playerCar.heading) * 10
      );
      camera.lookAt(playerCar.x, playerCar.y + 1.2, playerCar.z);
    }
  }

  function finishRace(place) {
    appState = 'results';
    sfx.playFanfare();

    if (activeDriftPts > 0) {
      totalStyleScore += Math.round(activeDriftPts * activeDriftMult);
      activeDriftPts = 0;
    }

    const modeSpec = MODE_SPECS[selectedModeIdx];
    const diffSpec = DIFF_SPECS[selectedDiffIdx] || DIFF_SPECS[0];
    document.getElementById('resModeTag').textContent = `${TRACK_SPECS[selectedTrackIdx].name} • ${modeSpec.name} • ${diffSpec.hudBtn}`;
    document.getElementById('resPlace').textContent = place === 1 ? '🏆 1ST PLACE!' : `${ordinal(place)} PLACE!`;
    document.getElementById('resTime').textContent = formatRaceTime(raceElapsed);
    document.getElementById('resBestLap').textContent = formatRaceTime(bestLapTime);
    document.getElementById('resScore').textContent = totalStyleScore.toLocaleString() + ' PTS';
    document.getElementById('resTopSpeed').textContent = `${Math.round(maxMphReached)} MPH`;
    document.getElementById('resultsOverlay').classList.add('active');

    trackEvent('race_finish', {
      track_id: TRACK_SPECS[selectedTrackIdx].id,
      game_mode: MODE_SPECS[selectedModeIdx].id,
      difficulty: diffSpec.id,
      place,
      style_score: totalStyleScore,
      top_mph: Math.round(maxMphReached),
      control_mode: mobileControlActive ? mobileControlMode : 'desktop'
    });
  }

  // --- INPUT LISTENERS (DESKTOP + MANUAL SHIFTING + MOBILE MULTI-TOUCH) ---
  const keys = {};
  function shiftManualGear(delta) {
    if (!playerCar || !manualTransmission || appState !== 'racing') return;
    const nextGear = Math.max(1, Math.min(6, (typeof playerCar.gear === 'number' ? playerCar.gear : 1) + delta));
    if (nextGear !== playerCar.gear) {
      playerCar.gear = nextGear;
      playerCar.shiftDelay = 0.1;
      sfx.playShift();
      if (playerCar.rpm > 6200 || delta < 0) {
        playerCar.backfireTimer = 0.09;
        sfx.playBackfire();
      }
    }
  }

  window.addEventListener('keydown', e => {
    const wasDown = !!keys[e.code];
    keys[e.code] = true;

    if (appState === 'title' && (e.code === 'Enter' || e.code === 'Space')) {
      e.preventDefault();
      onRaceLaunchTriggeredByUser();
      startDiveSwoop();
      return;
    }
    if (appState === 'garage' && (e.code === 'Enter' || e.code === 'Space')) {
      e.preventDefault();
      onRaceLaunchTriggeredByUser();
      launchRace();
      return;
    }
    if (!wasDown) {
      if (e.code === 'KeyE') shiftManualGear(1);
      if (e.code === 'KeyQ') shiftManualGear(-1);
      if (e.code === 'KeyT') toggleTransmission();
      if (e.code === 'KeyV') toggleMirror();
      if (e.code === 'KeyC' && appState !== 'garage' && appState !== 'title' && appState !== 'swoop') cycleCamera();
      if (e.code === 'KeyG' && appState !== 'garage') enterGarage();
      if (e.code === 'KeyM') toggleAudioMute();
    }
  });
  window.addEventListener('keyup', e => {
    keys[e.code] = false;
  });

  // ===========================================================================
  // 3-WAY NATIVE MOBILE CONTROLS (TOUCH, TILT, PEDALS) + URL OVERRIDES
  // ===========================================================================
  let mobileControlActive = false;
  let mobileControlMode = 'touch'; // 'touch' | 'tilt' | 'pedals'
  let tiltSteerInput = 0;
  let latestRawTiltDeg = 0;
  let filteredTiltDeg = 0;
  let tiltHasSample = false;
  let touchAnalogSteer = 0;
  let primaryPointerId = null;
  let touchAnchorX = 0;
  let touchAnchorY = 0;
  let touchSwipeBrakeActive = false;
  let touchSwipeN2oUntil = 0;
  let quickN2oHeld = false;
  const secondaryDriftPointers = new Set();
  const tiltLeftPointers = new Set();
  const tiltRightPointers = new Set();
  let tiltAttached = false;
  let tiltEnabled = false;

  const TILT_SENS_PRESETS = [
    { id: 'std', btnLabel: '📱 Tilt', callout: 'BALANCED + ASSIST (20° LOCK)', deadzone: 2.2, maxRange: 20.0, exp: 1.15, espRate: 3.1 },
    { id: 'calm', btnLabel: '📱 Tilt-', callout: 'CALM / HIGH ASSIST (25° LOCK)', deadzone: 2.8, maxRange: 25.0, exp: 1.25, espRate: 3.9 },
    { id: 'high', btnLabel: '📱 Tilt+', callout: 'SPORT / AGILE (15° LOCK)', deadzone: 1.8, maxRange: 15.0, exp: 1.00, espRate: 2.4 }
  ];
  let tiltSensIdx = 0;
  try {
    const savedSens = parseInt(localStorage.getItem('apex_tilt_sens_v2'), 10);
    if (savedSens >= 0 && savedSens < TILT_SENS_PRESETS.length) tiltSensIdx = savedSens;
  } catch (_) {}

  const earlyUrlParams = new URLSearchParams(window.location.search);
  const mobileParam = earlyUrlParams.get('mobile');
  const hasCoarsePointer = ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

  if (mobileParam === 'touch' || mobileParam === 'tilt' || mobileParam === 'pedals') {
    mobileControlActive = true;
    mobileControlMode = mobileParam;
  } else if (mobileParam === 'off' || mobileParam === '0' || mobileParam === 'false') {
    mobileControlActive = false;
  } else if (hasCoarsePointer) {
    mobileControlActive = true;
    let savedMode = null;
    try {
      savedMode = localStorage.getItem('apex_mobile_mode');
    } catch (_) {}
    if (savedMode === 'touch' || savedMode === 'tilt' || savedMode === 'pedals') {
      mobileControlMode = savedMode;
    } else {
      mobileControlMode = 'touch';
    }
  } else {
    mobileControlActive = false;
  }

  function clearMobileHeldStates() {
    primaryPointerId = null;
    touchAnalogSteer = 0;
    touchSwipeBrakeActive = false;
    touchSwipeN2oUntil = 0;
    secondaryDriftPointers.clear();
    tiltLeftPointers.clear();
    tiltRightPointers.clear();
    quickN2oHeld = false;
    tiltSteerInput = 0;
    latestRawTiltDeg = 0;
    filteredTiltDeg = 0;
    tiltHasSample = false;

    const stickBase = document.getElementById('touchStickBase');
    if (stickBase) stickBase.style.display = 'none';
    const zLeft = document.getElementById('tiltZoneLeft');
    if (zLeft) zLeft.classList.remove('active');
    const zRight = document.getElementById('tiltZoneRight');
    if (zRight) zRight.classList.remove('active');
    const btnQuickN2o = document.getElementById('touchQuickN2oBtn');
    if (btnQuickN2o) btnQuickN2o.classList.remove('pressed');
  }

  function computeTiltSteerFromDeg(degVal) {
    const preset = TILT_SENS_PRESETS[tiltSensIdx] || TILT_SENS_PRESETS[0];
    if (Math.abs(degVal) < preset.deadzone) return 0;
    const sign = degVal > 0 ? 1 : -1;
    const mag = Math.min(1, (Math.abs(degVal) - preset.deadzone) / (preset.maxRange - preset.deadzone));
    return -sign * Math.pow(mag, preset.exp);
  }

  function onDeviceOrientation(e) {
    if (!tiltEnabled || !mobileControlActive || mobileControlMode !== 'tilt') return;
    const angle = (screen.orientation && typeof screen.orientation.angle === 'number')
      ? screen.orientation.angle
      : (typeof window.orientation === 'number' ? window.orientation : 0);

    const betaRad = ((e.beta || 0) * Math.PI) / 180;
    const gammaRad = ((e.gamma || 0) * Math.PI) / 180;
    let gScreenRight;
    if (angle === 90) {
      gScreenRight = Math.sin(betaRad);
    } else if (angle === -90 || angle === 270) {
      gScreenRight = -Math.sin(betaRad);
    } else if (angle === 180) {
      gScreenRight = -Math.cos(betaRad) * Math.sin(gammaRad);
    } else {
      gScreenRight = Math.cos(betaRad) * Math.sin(gammaRad);
    }

    const trueRollDeg = Math.asin(Math.max(-1, Math.min(1, gScreenRight))) * (180 / Math.PI);
    latestRawTiltDeg = trueRollDeg;
    if (!tiltHasSample) {
      filteredTiltDeg = trueRollDeg;
      tiltHasSample = true;
    } else {
      filteredTiltDeg = filteredTiltDeg * 0.72 + trueRollDeg * 0.28;
    }
    tiltSteerInput = computeTiltSteerFromDeg(filteredTiltDeg);
  }

  async function enableTiltSensor(fromUserGesture) {
    tiltEnabled = true;
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      if (fromUserGesture) {
        try {
          const res = await DeviceOrientationEvent.requestPermission();
          if (res !== 'granted') {
            showCallout('TILT BLOCKED', 'Switched to Touch Steer');
            setMobileMode('touch', false);
            return;
          }
        } catch (_) {
          showCallout('TILT BLOCKED', 'Switched to Touch Steer');
          setMobileMode('touch', false);
          return;
        }
      }
    }

    if (!tiltAttached) {
      window.addEventListener('deviceorientation', onDeviceOrientation, true);
      tiltAttached = true;
    }
  }

  function disableTiltSensor() {
    tiltEnabled = false;
    tiltSteerInput = 0;
    latestRawTiltDeg = 0;
    filteredTiltDeg = 0;
    tiltHasSample = false;
    if (tiltAttached) {
      window.removeEventListener('deviceorientation', onDeviceOrientation, true);
      tiltAttached = false;
    }
  }

  function setMobileMode(mode, fromUserGesture = false) {
    if (mode !== 'touch' && mode !== 'tilt' && mode !== 'pedals') {
      mode = 'touch';
    }
    mobileControlMode = mode;
    clearMobileHeldStates();

    if (mobileControlActive) {
      document.body.classList.add('mobile-active');
      document.body.classList.remove('mobile-mode-touch', 'mobile-mode-tilt', 'mobile-mode-pedals');
      document.body.classList.add(`mobile-mode-${mode}`);
    } else {
      document.body.classList.remove('mobile-active', 'mobile-mode-touch', 'mobile-mode-tilt', 'mobile-mode-pedals');
    }

    const btnTouch = document.getElementById('btnModeTouch');
    const btnTilt = document.getElementById('btnModeTilt');
    const btnPedals = document.getElementById('btnModePedals');
    if (btnTouch) btnTouch.classList.toggle('active', mode === 'touch');
    if (btnTilt) {
      btnTilt.classList.toggle('active', mode === 'tilt');
      btnTilt.textContent = mode === 'tilt' ? (TILT_SENS_PRESETS[tiltSensIdx] || TILT_SENS_PRESETS[0]).btnLabel : '📱 Tilt';
    }
    if (btnPedals) btnPedals.classList.toggle('active', mode === 'pedals');

    const hintEl = document.getElementById('mobileHintText');
    if (hintEl) {
      if (mode === 'touch') {
        hintEl.textContent = 'Smart Auto-Gas • Slide L/R Steer • Swipe ↑ N2O • Swipe ↓ Brake • 2nd Finger Drift';
      } else if (mode === 'tilt') {
        hintEl.textContent = 'Smart Auto-Gas • Tilt to Steer (Tap 📱 Tilt for Sens) • Left Drift • Right N2O';
      } else if (mode === 'pedals') {
        hintEl.textContent = 'Classic Multi-Touch Pedals • ◀ ▶ Steer • GAS • BRAKE • DRIFT • N2O';
      }
    }

    if (mobileControlActive) {
      try {
        localStorage.setItem('apex_mobile_mode', mode);
      } catch (_) {}
    }

    if (mode === 'tilt' && mobileControlActive) {
      enableTiltSensor(fromUserGesture);
    } else {
      disableTiltSensor();
    }

    if (fromUserGesture) {
      trackEvent('control_mode_select', {
        control_mode: mode,
        tilt_preset: mode === 'tilt' ? (TILT_SENS_PRESETS[tiltSensIdx] || TILT_SENS_PRESETS[0]).id : 'none'
      });
    }
  }

  function syncMobileUiState() {
    setMobileMode(mobileControlMode, false);
  }

  // Bind mode toggle buttons
  const btnModeTouch = document.getElementById('btnModeTouch');
  const btnModeTilt = document.getElementById('btnModeTilt');
  const btnModePedals = document.getElementById('btnModePedals');

  function bindMobileModeBtn(btn, mode) {
    if (!btn) return;
    const onActivate = e => {
      e.stopPropagation();
      e.preventDefault();
      sfx.init();
      if (mode === 'tilt' && mobileControlActive && mobileControlMode === 'tilt') {
        tiltSensIdx = (tiltSensIdx + 1) % TILT_SENS_PRESETS.length;
        const preset = TILT_SENS_PRESETS[tiltSensIdx];
        try {
          localStorage.setItem('apex_tilt_sens_v2', String(tiltSensIdx));
        } catch (_) {}
        btn.textContent = preset.btnLabel;
        showCallout('📱 TILT SENSITIVITY', preset.callout);
        enableTiltSensor(true);
        trackEvent('control_mode_select', {
          control_mode: mode,
          tilt_preset: mode === 'tilt' ? (TILT_SENS_PRESETS[tiltSensIdx] || TILT_SENS_PRESETS[0]).id : 'none'
        });
        return;
      }
      setMobileMode(mode, true);
    };
    btn.addEventListener('pointerdown', e => e.stopPropagation());
    btn.addEventListener('click', onActivate);
  }
  bindMobileModeBtn(btnModeTouch, 'touch');
  bindMobileModeBtn(btnModeTilt, 'tilt');
  bindMobileModeBtn(btnModePedals, 'pedals');

  // Gesture layer pointer event handlers
  const gestureLayer = document.getElementById('mobileGestureLayer');

  function onGesturePointerDown(e) {
    e.preventDefault();
    sfx.init();
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (mobileControlMode === 'touch') {
      if (primaryPointerId === null) {
        primaryPointerId = e.pointerId;
        touchAnchorX = clientX;
        touchAnchorY = clientY;
        touchAnalogSteer = 0;
        touchSwipeBrakeActive = false;
        const stickBase = document.getElementById('touchStickBase');
        const stickKnob = document.getElementById('touchStickKnob');
        if (stickBase && stickKnob) {
          stickBase.style.left = `${clientX}px`;
          stickBase.style.top = `${clientY}px`;
          stickBase.style.display = 'block';
          stickKnob.style.transform = 'translate(0px, 0px)';
        }
        try {
          if (gestureLayer && gestureLayer.setPointerCapture) {
            gestureLayer.setPointerCapture(e.pointerId);
          }
        } catch (_) {}
      } else {
        // Second finger down during touch mode holds Drift/Brake
        secondaryDriftPointers.add(e.pointerId);
      }
    } else if (mobileControlMode === 'tilt') {
      const isLeft = clientX < window.innerWidth * 0.5;
      if (isLeft) {
        tiltLeftPointers.add(e.pointerId);
        const zLeft = document.getElementById('tiltZoneLeft');
        if (zLeft) zLeft.classList.add('active');
      } else {
        tiltRightPointers.add(e.pointerId);
        const zRight = document.getElementById('tiltZoneRight');
        if (zRight) zRight.classList.add('active');
      }
    }
  }

  function onGesturePointerMove(e) {
    if (mobileControlMode === 'touch' && e.pointerId === primaryPointerId) {
      e.preventDefault();
      const clientX = e.clientX;
      const clientY = e.clientY;
      let dx = clientX - touchAnchorX;
      const dy = clientY - touchAnchorY;
      const maxRadius = Math.max(68, Math.min(108, window.innerWidth * 0.17));

      // Floating-leash follow
      const leashLimit = maxRadius * 1.35;
      if (Math.abs(dx) > leashLimit) {
        const excess = dx > 0 ? dx - leashLimit : dx + leashLimit;
        touchAnchorX += excess;
        dx = clientX - touchAnchorX;
        const stickBase = document.getElementById('touchStickBase');
        if (stickBase) stickBase.style.left = `${touchAnchorX}px`;
      }

      // 6px deadzone with progressive curve
      const deadzone = 6;
      if (Math.abs(dx) <= deadzone) {
        touchAnalogSteer = 0;
      } else {
        const effDx = dx > 0 ? dx - deadzone : dx + deadzone;
        const mag = Math.min(1, Math.abs(effDx) / (maxRadius - deadzone));
        // Drag right (dx > 0) -> turn right -> steerInput < 0
        touchAnalogSteer = -(effDx > 0 ? 1 : -1) * Math.pow(mag, 1.38);
      }

      // Vertical swipe detection
      if (dy < -42) {
        // Swipe Up: 950ms nitro boost
        touchSwipeN2oUntil = performance.now() + 950;
        touchAnchorY = clientY;
      }
      if (dy > 30) {
        touchSwipeBrakeActive = true;
      } else if (dy < 12) {
        touchSwipeBrakeActive = false;
      }

      const stickKnob = document.getElementById('touchStickKnob');
      if (stickKnob) {
        const clampedX = Math.max(-maxRadius, Math.min(maxRadius, dx));
        const clampedY = Math.max(-maxRadius, Math.min(maxRadius, dy));
        stickKnob.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
      }
    }
  }

  function onGesturePointerEnd(e) {
    if (mobileControlMode === 'touch') {
      if (e.pointerId === primaryPointerId) {
        primaryPointerId = null;
        touchAnalogSteer = 0;
        touchSwipeBrakeActive = false;
        const stickBase = document.getElementById('touchStickBase');
        if (stickBase) stickBase.style.display = 'none';
      }
      secondaryDriftPointers.delete(e.pointerId);
    } else if (mobileControlMode === 'tilt') {
      tiltLeftPointers.delete(e.pointerId);
      tiltRightPointers.delete(e.pointerId);
      if (tiltLeftPointers.size === 0) {
        const zLeft = document.getElementById('tiltZoneLeft');
        if (zLeft) zLeft.classList.remove('active');
      }
      if (tiltRightPointers.size === 0) {
        const zRight = document.getElementById('tiltZoneRight');
        if (zRight) zRight.classList.remove('active');
      }
    }
  }

  if (gestureLayer) {
    gestureLayer.addEventListener('pointerdown', onGesturePointerDown, { passive: false });
    gestureLayer.addEventListener('pointermove', onGesturePointerMove, { passive: false });
    gestureLayer.addEventListener('pointerup', onGesturePointerEnd, { passive: false });
    gestureLayer.addEventListener('pointercancel', onGesturePointerEnd, { passive: false });
  }
  window.addEventListener('pointerup', onGesturePointerEnd);
  window.addEventListener('pointercancel', onGesturePointerEnd);
  window.addEventListener('blur', clearMobileHeldStates);

  // Quick N2O button (Touch mode)
  const btnQuickN2o = document.getElementById('touchQuickN2oBtn');
  if (btnQuickN2o) {
    const pressQuickN2o = e => {
      e.stopPropagation();
      e.preventDefault();
      sfx.init();
      quickN2oHeld = true;
      btnQuickN2o.classList.add('pressed');
    };
    const releaseQuickN2o = e => {
      quickN2oHeld = false;
      btnQuickN2o.classList.remove('pressed');
    };
    btnQuickN2o.addEventListener('pointerdown', pressQuickN2o);
    btnQuickN2o.addEventListener('pointerup', releaseQuickN2o);
    btnQuickN2o.addEventListener('pointercancel', releaseQuickN2o);
    btnQuickN2o.addEventListener('pointerleave', releaseQuickN2o);
  }

  // Initial mobile mode synchronization
  setMobileMode(mobileControlMode, false);

  document.querySelectorAll('#touchControls .t-btn[data-key]').forEach(btn => {
    const code = btn.getAttribute('data-key');
    const press = e => {
      e.preventDefault();
      sfx.init();
      if (!keys[code]) {
        if (code === 'KeyE') shiftManualGear(1);
        if (code === 'KeyQ') shiftManualGear(-1);
      }
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
    btn.addEventListener('pointerdown', press);
    btn.addEventListener('pointerup', release);
    btn.addEventListener('pointercancel', release);
    btn.addEventListener('pointerleave', release);
  });

  function toggleBloom() {
    bloomEnabled = !bloomEnabled;
    syncRendererColorPipeline();
    document.getElementById('btnBloom').textContent = bloomEnabled ? '✨ Bloom' : '✨ Off';
    document.getElementById('btnBloom').classList.toggle('on', bloomEnabled);
    document.getElementById('btnGarageBloom').textContent = `✨ Bloom: ${bloomEnabled ? 'ON' : 'OFF'}`;
    document.getElementById('btnGarageBloom').classList.toggle('on', bloomEnabled);
    document.getElementById('btnTitleBloom').textContent = `✨ Bloom: ${bloomEnabled ? 'ON' : 'OFF'}`;
    document.getElementById('btnTitleBloom').classList.toggle('on', bloomEnabled);
  }

  function cycleCamera() {
    cameraMode = (cameraMode + 1) % CAM_LABELS.length;
    applyCameraVisibility();
    const targetFov = cameraMode === 1 ? 68 : 64;
    camera.fov = targetFov;
    camera.updateProjectionMatrix();
  }

  function toggleMirror() {
    mirrorEnabled = !mirrorEnabled;
    document.body.classList.toggle('mirror-off', !mirrorEnabled);
    document.getElementById('btnMirror').classList.toggle('on', mirrorEnabled);
    document.getElementById('btnMirror').textContent = mirrorEnabled ? '🪞 Mirror' : '🪞 Off';
  }

  function toggleTransmission() {
    manualTransmission = !manualTransmission;
    document.body.classList.toggle('manual-trans', manualTransmission);
    document.getElementById('btnTransMode').textContent = manualTransmission ? '⚙️ Gear: MANUAL' : '⚙️ Gear: AUTO';
    document.getElementById('btnTransMode').classList.toggle('on', manualTransmission);
    document.getElementById('btnTransHud').textContent = manualTransmission ? '⚙️ MAN' : '⚙️ AUTO';
    document.getElementById('btnTransHud').classList.toggle('on', manualTransmission);
  }

  function toggleAudioMute() {
    sfx.init();
    sfx.muted = !sfx.muted;
    document.getElementById('btnMute').textContent = sfx.muted ? '🔇 Mute' : '🔊 Audio';
    document.getElementById('btnMute').classList.toggle('on', !sfx.muted);
    document.getElementById('btnGarageAudio').textContent = `🔊 Sound: ${sfx.muted ? 'OFF' : 'ON'}`;
    document.getElementById('btnGarageAudio').classList.toggle('on', !sfx.muted);
    document.getElementById('btnTitleAudio').textContent = `🔊 Sound: ${sfx.muted ? 'OFF' : 'ON'}`;
    document.getElementById('btnTitleAudio').classList.toggle('on', !sfx.muted);
  }

  function onRaceLaunchTriggeredByUser() {
    if (mobileControlActive && mobileControlMode === 'tilt') {
      enableTiltSensor(true);
    }
  }

  function setDifficulty(idx, fromUserGesture = false) {
    const safeIdx = Math.max(0, Math.min(DIFF_SPECS.length - 1, idx | 0));
    selectedDiffIdx = safeIdx;
    const df = DIFF_SPECS[selectedDiffIdx];
    const tierClass = `diff-tier-${df.id}`;

    const btnTitleDiff = document.getElementById('btnTitleDiff');
    const btnGarageDiff = document.getElementById('btnGarageDiff');
    const btnHudDiff = document.getElementById('btnHudDiff');
    const btnMobileDiff = document.getElementById('btnMobileDiff');

    [btnTitleDiff, btnGarageDiff, btnHudDiff, btnMobileDiff].forEach(btn => {
      if (!btn) return;
      btn.classList.remove('diff-tier-easy', 'diff-tier-medium', 'diff-tier-hard');
      btn.classList.add(tierClass);
    });

    if (btnTitleDiff) btnTitleDiff.textContent = df.headerBtn;
    if (btnGarageDiff) btnGarageDiff.textContent = df.headerBtn;
    if (btnHudDiff) btnHudDiff.textContent = df.hudBtn;
    if (btnMobileDiff) btnMobileDiff.textContent = df.mobileBtn;

    syncTrackModeActiveCards();

    try {
      localStorage.setItem('apex_difficulty', df.id);
    } catch (_) {}

    if (fromUserGesture) {
      if (appState === 'racing' || appState === 'countdown') {
        showCallout(df.name.toUpperCase(), df.callout);
      }
      trackEvent('difficulty_select', { difficulty: df.id });
    }
  }

  function cycleDifficulty() {
    setDifficulty((selectedDiffIdx + 1) % DIFF_SPECS.length, true);
  }

  // Title, Garage & HUD Button Bindings
  document.querySelectorAll('#titleCircuitTabs .pill-seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.init();
      const idx = parseInt(btn.dataset.track, 10);
      if (!isNaN(idx)) enterTitleScreen(idx);
    });
  });
  document.querySelectorAll('#titleModeTabs .pill-seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.init();
      const idx = parseInt(btn.dataset.mode, 10);
      if (!isNaN(idx)) {
        selectedModeIdx = idx;
        syncTitlePillsUI();
        syncTrackModeActiveCards();
      }
    });
  });
  document.getElementById('btnTitlePlay').addEventListener('click', () => {
    onRaceLaunchTriggeredByUser();
    startDiveSwoop();
  });
  document.getElementById('btnTitleGarage').addEventListener('click', () => {
    sfx.init();
    enterGarage();
  });
  document.getElementById('btnTitleBloom').addEventListener('click', toggleBloom);
  document.getElementById('btnTitleAudio').addEventListener('click', toggleAudioMute);
  document.getElementById('btnTitleDiff').addEventListener('click', () => { sfx.init(); cycleDifficulty(); });
  document.getElementById('btnGarageDiff').addEventListener('click', () => { sfx.init(); cycleDifficulty(); });
  document.getElementById('btnHudDiff').addEventListener('click', () => { sfx.init(); cycleDifficulty(); });
  const btnHudSettings = document.getElementById('btnHudSettings');
  const hudSettingsPopover = document.getElementById('hudSettingsPopover');
  if (btnHudSettings && hudSettingsPopover) {
    btnHudSettings.addEventListener('click', e => {
      e.stopPropagation();
      hudSettingsPopover.classList.toggle('open');
    });
  }
  const btnMobileDiff = document.getElementById('btnMobileDiff');
  if (btnMobileDiff) {
    btnMobileDiff.addEventListener('pointerdown', e => e.stopPropagation());
    btnMobileDiff.addEventListener('click', e => {
      e.stopPropagation();
      e.preventDefault();
      sfx.init();
      cycleDifficulty();
    });
  }
  setDifficulty(selectedDiffIdx, false);
  document.getElementById('btnBackTitle').addEventListener('click', () => enterTitleScreen(selectedTrackIdx));

  document.getElementById('launchRaceBtn').addEventListener('click', () => {
    onRaceLaunchTriggeredByUser();
    launchRace();
  });
  document.getElementById('raceAgainBtn').addEventListener('click', () => {
    onRaceLaunchTriggeredByUser();
    launchRace();
  });
  document.getElementById('backGarageBtn').addEventListener('click', enterGarage);
  document.getElementById('btnGarage').addEventListener('click', enterGarage);
  document.getElementById('btnCam').addEventListener('click', cycleCamera);
  document.getElementById('btnMirror').addEventListener('click', toggleMirror);
  document.getElementById('btnTransHud').addEventListener('click', toggleTransmission);
  document.getElementById('btnTransMode').addEventListener('click', toggleTransmission);
  document.getElementById('btnBloom').addEventListener('click', toggleBloom);
  document.getElementById('btnMute').addEventListener('click', toggleAudioMute);
  document.getElementById('btnGarageBloom').addEventListener('click', toggleBloom);
  document.getElementById('btnGarageAudio').addEventListener('click', toggleAudioMute);

  // --- OPEN-ARC DIGITAL TELEMETRY CLUSTER (NO OPAQUE CIRCULAR DISC!) ---
  const tachCtx = document.getElementById('tachCanvas').getContext('2d');
  const minimapCtx = document.getElementById('minimapCanvas').getContext('2d');

  function drawTachometer(mph, rpm, gear, n2o, nosFiring) {
    const ctx = tachCtx;
    const w = 244, h = 220, cx = 128, cy = 114, rad = 82;
    ctx.clearRect(0, 0, w, h);

    const startA = Math.PI * 0.78;
    const endA = Math.PI * 2.08;
    const spanA = endA - startA;
    const rpmNorm = Math.max(0, Math.min(1, rpm / 9000));

    // Subtle open translucent arc rail
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx, cy, rad - 8, startA, endA);
    ctx.stroke();

    // Countdown Green Launch Zone (5,500 - 7,300 RPM)
    if (appState === 'countdown') {
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.85)';
      ctx.lineWidth = 11;
      ctx.beginPath();
      ctx.arc(cx, cy, rad - 8, startA + spanA * (5500 / 9000), startA + spanA * (7300 / 9000));
      ctx.stroke();
      ctx.lineWidth = 9;
    }

    // Redline Zone (7.5k - 9k)
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
    ctx.beginPath();
    ctx.arc(cx, cy, rad - 8, startA + spanA * 0.82, endA);
    ctx.stroke();

    // Active Glowing RPM Arc
    const grad = ctx.createLinearGradient(cx - rad, cy, cx + rad, cy);
    grad.addColorStop(0, '#22d3ee');
    grad.addColorStop(0.68, '#fbbf24');
    grad.addColorStop(1, '#ef4444');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.arc(cx, cy, rad - 8, startA, startA + spanA * rpmNorm);
    ctx.stroke();

    // Minimalist Tick Marks & Numbers
    ctx.font = '700 9.5px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 9; i++) {
      const a = startA + (i / 9) * spanA;
      ctx.strokeStyle = i >= 8 ? 'rgba(248, 113, 113, 0.7)' : 'rgba(148, 163, 184, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * (rad - 17), cy + Math.sin(a) * (rad - 17));
      ctx.lineTo(cx + Math.cos(a) * (rad - 13), cy + Math.sin(a) * (rad - 13));
      ctx.stroke();

      ctx.fillStyle = i >= 8 ? '#f87171' : 'rgba(203, 213, 225, 0.75)';
      ctx.fillText(String(i), cx + Math.cos(a) * (rad - 27), cy + Math.sin(a) * (rad - 27));
    }

    // Glowing Gear & Transmission Badge
    ctx.fillStyle = nosFiring ? '#22d3ee' : '#fbbf24';
    ctx.font = '800 13px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(`G${gear} · ${manualTransmission ? 'MAN' : 'AUTO'}`, cx, cy - 22);

    // Big Crisp Monospace MPH Readout
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 40px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(String(Math.round(mph)), cx, cy + 10);
    ctx.fillStyle = '#22d3ee';
    ctx.font = '800 10.5px "Inter", "Segoe UI", sans-serif';
    ctx.fillText('MPH', cx, cy + 36);

    // Curved Cyan-Amber N2O Nitrous Bar
    const nStart = Math.PI * 0.25;
    const nEnd = Math.PI * 0.68;
    const nNorm = Math.max(0, Math.min(1, n2o / 100));
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(cx, cy, rad + 3, nStart, nEnd);
    ctx.stroke();

    const nGrad = ctx.createLinearGradient(cx, cy + rad, cx + rad, cy);
    nGrad.addColorStop(0, '#22d3ee');
    nGrad.addColorStop(1, nosFiring ? '#f0fdff' : '#f59e0b');
    ctx.strokeStyle = nGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, rad + 3, nStart, nStart + (nEnd - nStart) * nNorm);
    ctx.stroke();

    ctx.fillStyle = nosFiring ? '#ffffff' : '#67e8f9';
    ctx.font = '800 9.5px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText('N2O', cx + 30, cy + 62);
  }

  // --- DARK-MODE NEON TACTICAL MINIMAP RENDERER ---
  function drawMinimap() {
    const ctx = minimapCtx;
    const w = 166, h = 166;
    ctx.clearRect(0, 0, w, h);
    if (!trackData || !playerCar) return;

    // Midnight navy cartographic background + subtle street grid
    ctx.fillStyle = '#060b16';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
    ctx.lineWidth = 1;
    for (let g = 24; g < w; g += 24) {
      ctx.beginPath(); ctx.moveTo(g, 0); ctx.lineTo(g, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, g); ctx.lineTo(w, g); ctx.stroke();
    }

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

    // Subtle emerald cross-rail lines matching the Neon Scramble transit aesthetic
    if (trackData.spec.envType === 'tokyo') {
      const cxMap = ((minX + maxX) * 0.5) * scale + ox;
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.42)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(cxMap + 10, 6);
      ctx.quadraticCurveTo(cxMap + 18, h * 0.5, cxMap + 28, h - 6);
      ctx.stroke();
    }

    // Dark road casing
    ctx.strokeStyle = '#18243d';
    ctx.lineWidth = 7.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let i = 0; i < FRAMES_COUNT; i += 4) {
      const mx = pts[i].x * scale + ox;
      const mz = pts[i].z * scale + oz;
      if (i === 0) ctx.moveTo(mx, mz);
      else ctx.lineTo(mx, mz);
    }
    ctx.closePath();
    ctx.stroke();

    // Glowing cyan route ribbon
    ctx.strokeStyle = trackData.spec.envType === 'canyon' ? '#fb923c' : '#22d3ee';
    ctx.lineWidth = 2.6;
    ctx.stroke();

    // Start line marker
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(pts[0].x * scale + ox - 3, pts[0].z * scale + oz - 3, 6, 6);

    // Glowing rival dots
    aiRacers.forEach(ai => {
      ctx.fillStyle = ai.isPursuit ? '#ec4899' : '#fbbf24';
      ctx.beginPath();
      ctx.arc(ai.x * scale + ox, ai.z * scale + oz, 3.6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Directional player chevron
    const px = playerCar.x * scale + ox;
    const pz = playerCar.z * scale + oz;
    const hAngle = Math.atan2(Math.sin(playerCar.heading), Math.cos(playerCar.heading));
    ctx.save();
    ctx.translate(px, pz);
    ctx.rotate(-hAngle + Math.PI);
    ctx.fillStyle = '#4ade80';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(5.2, 5.5);
    ctx.lineTo(0, 2.5);
    ctx.lineTo(-5.2, 5.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
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

      const tYaw = Math.atan2(proj.T.x, proj.T.z);
      let dYaw = tYaw - racer.heading;
      while (dYaw > Math.PI) dYaw -= Math.PI * 2;
      while (dYaw < -Math.PI) dYaw += Math.PI * 2;
      racer.heading += dYaw * 0.28;
      if (racer.velHeading !== undefined) racer.velHeading = racer.heading;
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

    // Hill Slope Pitch + Dynamic Weight-Transfer Pitch & Lateral Roll
    const fwdDot = Math.sin(racer.heading) * proj.T.x + Math.cos(racer.heading) * proj.T.z;
    const hillPitch = -Math.asin(Math.max(-0.45, Math.min(0.45, proj.T.y))) * fwdDot;
    const bodyPitch = hillPitch + (racer.loadPitch || 0);
    racer.meshObj.root.position.set(racer.x, racer.y, racer.z);
    racer.meshObj.root.rotation.y = racer.heading + (isPlayer ? racer.driftAngle * 0.35 : racer.driftAngle * 0.6);
    racer.meshObj.chassisGroup.rotation.x += (bodyPitch - racer.meshObj.chassisGroup.rotation.x) * Math.min(1, dt * 12);

    racer.meshObj.wheels.forEach(w => {
      w.spinGroup.rotation.x += racer.speed * dt * 2.2;
      if (w.front) w.steerPivot.rotation.y = racer.steerAngle * 0.45;
    });
  }

  // --- ANIMATE AERIAL MAP TRAINS / COMETS / RADARS & STREET VIADUCTS ---
  const _cometDummy = new THREE.Object3D();
  function updateWorldAnimations(dt, tNow) {
    skyDomeMat.uniforms.uTime.value = tNow;
    if (trackAnimState) {
      if (trackAnimState.roadTimeUniform) trackAnimState.roadTimeUniform.value = tNow;
      if (trackAnimState.oceanUniforms) trackAnimState.oceanUniforms.uTime.value = tNow;
      if (trackAnimState.viaductTrains) {
        trackAnimState.viaductTrains.forEach(vt => {
          const cycle = ((tNow * 0.42 * vt.dir + vt.phase) % 2 + 2) % 2;
          vt.mesh.position.z = (cycle - 1) * 65;
        });
      }
    }
    if (aerialAnimState && aerialMapGroup && aerialMapGroup.visible) {
      aerialAnimState.trains.forEach(tr => {
        tr.u = (tr.u + tr.dir * tr.speed * dt + 1) % 1;
        const p = tr.curve.getPointAt(tr.u);
        const t = tr.curve.getTangentAt(tr.u).normalize();
        tr.group.position.set(p.x, p.y + 1.2, p.z);
        tr.group.rotation.y = Math.atan2(t.x, t.z);
      });
      const upVec = new THREE.Vector3(0, 1, 0);
      const rightTmp = new THREE.Vector3();
      aerialAnimState.comets.forEach((cm, idx) => {
        cm.u = (cm.u + cm.dir * cm.speed * dt + 1) % 1;
        const p = cm.curve.getPointAt(cm.u);
        const t = cm.curve.getTangentAt(cm.u).normalize();
        rightTmp.crossVectors(upVec, t).normalize();
        _cometDummy.position.set(p.x + rightTmp.x * cm.lat, p.y + 1.5, p.z + rightTmp.z * cm.lat);
        _cometDummy.rotation.set(0, Math.atan2(t.x, t.z), 0);
        _cometDummy.scale.set(1, 1, cm.lenScale);
        _cometDummy.updateMatrix();
        aerialAnimState.cometInst.setMatrixAt(idx, _cometDummy.matrix);
      });
      aerialAnimState.cometInst.instanceMatrix.needsUpdate = true;

      aerialAnimState.radarRings.forEach(rr => {
        const ph = (tNow * 0.52 + rr.phase) % 1;
        const sc = 0.75 + ph * 2.15;
        rr.mesh.scale.set(sc, sc, 1);
        rr.mat.opacity = (1 - ph) * 0.85;
      });
    }
  }

  // --- UPDATE 3D AERIAL NEON TRANSIT MAP TITLE SCREEN ---
  function updateTitleAttract(dt, lockOrbit = false) {
    if (!attractRacers.length) return;
    attractTimer = Math.max(0, attractTimer + dt);
    if (!lockOrbit) aerialOrbitAngle += dt * 0.055;

    attractRacers.forEach((ar, idx) => {
      const aimSeg = (ar.segIdx + 8) % FRAMES_COUNT;
      const aimP = trackData.pts[aimSeg];
      const aimR = trackData.rights[aimSeg];
      if (Math.random() < dt * 0.4) ar.targetLat = (Math.random() - 0.5) * 12;
      ar.lat += (ar.targetLat - ar.lat) * dt * 1.4;

      const aimX = aimP.x + aimR.x * ar.targetLat;
      const aimZ = aimP.z + aimR.z * ar.targetLat;
      const desiredYaw = Math.atan2(aimX - ar.x, aimZ - ar.z);
      let dy = desiredYaw - ar.heading;
      while (dy > Math.PI) dy -= Math.PI * 2;
      while (dy < -Math.PI) dy += Math.PI * 2;
      ar.heading += dy * Math.min(1, dt * 5.2);
      ar.steerAngle = Math.max(-1, Math.min(1, dy * 2.4));

      const curveAhead = Math.abs(trackData.curvatures[(ar.segIdx + 12) % FRAMES_COUNT]);
      const tgtSpd = ar.spec.maxSpdPhys * (curveAhead > 0.14 ? 0.72 : 0.96);
      ar.speed += (tgtSpd - ar.speed) * Math.min(1, dt * 2.5);

      ar.x += Math.sin(ar.heading) * ar.speed * dt;
      ar.z += Math.cos(ar.heading) * ar.speed * dt;
      updateRacerSplineTransform(ar, dt, false);

      const nosPulse = ((Math.floor(attractTimer + idx) % 5) === 0);
      ar.meshObj.nosGroup.visible = nosPulse;
      if (ar.meshObj.pursuitBarRed && ar.meshObj.pursuitBarBlue) {
        const st = Math.floor(attractTimer * 10) % 2 === 0;
        ar.meshObj.pursuitBarRed.visible = st;
        ar.meshObj.pursuitBarBlue.visible = !st;
      }

      const rearOff = ar.spec.len * 0.5 + 0.18;
      const wSide = ar.spec.wid * 0.42;
      const fx = Math.sin(ar.heading), fz = Math.cos(ar.heading);
      const rx = Math.cos(ar.heading), rz = -Math.sin(ar.heading);
      const bx = ar.x - fx * rearOff, bz = ar.z - fz * rearOff, by = ar.y + ar.spec.noseH + 0.55;
      const col = nosPulse ? 0x22d3ee : (idx % 2 === 0 ? 0xfbbf24 : 0xe0f2fe);
      ar.ribL.pushPoint(bx - rx * wSide, by, bz - rz * wSide, rx, rz, true, col);
      ar.ribR.pushPoint(bx + rx * wSide, by, bz + rz * wSide, rx, rz, true, col);
    });

    const pose = computeAerialCameraPose(aerialOrbitAngle, pointerParallaxX, pointerParallaxY);
    camera.position.lerp(pose.camPos, lockOrbit ? 1 : Math.min(1, dt * 4));
    camera.lookAt(pose.lookPos);
    skyDome.position.copy(camera.position);

    updateWorldAnimations(dt, attractTimer);
    projectMapLabels();
    updateRain(dt, false, 0, 0);
    sfx.updateDrive(dt, false, 0, false, false);
  }

  // --- SHARED COCKPIT CAMERA HELPER ---
  function positionCockpitCamera(spec, shake = 0) {
    const sinH = Math.sin(playerCar.heading);
    const cosH = Math.cos(playerCar.heading);
    const camZLocal = (spec.roofPeakX || 0) - 0.20;
    const camYLocal = spec.roofH - 0.08;

    camera.position.set(
      playerCar.x + sinH * camZLocal + shake * 0.4,
      playerCar.y + camYLocal + shake * 0.3,
      playerCar.z + cosH * camZLocal + shake * 0.4
    );
    camera.lookAt(
      playerCar.x + sinH * 20,
      playerCar.y + spec.roofH - 0.45,
      playerCar.z + cosH * 20
    );
  }

  function pollGamepad() {
    if (!navigator.getGamepads) return null;
    const pads = navigator.getGamepads();
    for (let i = 0; i < pads.length; i++) {
      const gp = pads[i];
      if (!gp || !gp.connected) continue;
      const ax = Math.abs(gp.axes[0] || 0) > 0.14 ? -(gp.axes[0] || 0) : 0;
      const gas = (gp.buttons[7] && gp.buttons[7].pressed) || (gp.buttons[0] && gp.buttons[0].pressed);
      const brk = (gp.buttons[6] && gp.buttons[6].pressed) || (gp.buttons[1] && gp.buttons[1].pressed);
      const drift = (gp.buttons[2] && gp.buttons[2].pressed) || (gp.buttons[4] && gp.buttons[4].pressed);
      const nos = (gp.buttons[3] && gp.buttons[3].pressed) || (gp.buttons[5] && gp.buttons[5].pressed);
      return { steer: ax, gas, brk, drift, nos };
    }
    return null;
  }

  // --- MAIN FRAME UPDATE ---
  let lastTime = performance.now();
  let worldAnimClock = 0;
  let shotFrozen = false;

  function update(dt) {
    worldAnimClock += dt;
    if (outputFXAAPass && appState !== 'racing') {
      outputFXAAPass.uniforms.uNitroAmount.value = 0.0;
    }

    if (shotFrozen) {
      updateWorldAnimations(dt, worldAnimClock);
      if (appState === 'title') projectMapLabels();
      skyDome.position.copy(camera.position);
      if (appState === 'racing' && playerCar) {
        const mphShot = Math.abs(playerCar.speed) * 1.95;
        if (outputFXAAPass) outputFXAAPass.uniforms.uNitroAmount.value = shotForceNos ? 0.85 : 0.0;
        updateRain(dt, trackData && trackData.spec.envType === 'tokyo', playerCar.speed, playerCar.heading);
        drawTachometer(mphShot, playerCar.rpm, playerCar.gear, playerCar.n2o, shotForceNos);
        drawMinimap();
      }
      return;
    }

    if (appState === 'title') {
      updateTitleAttract(dt, false);
      return;
    }

    if (appState === 'swoop') {
      swoopTimer += dt;
      const t = Math.min(1, swoopTimer / SWOOP_DURATION);
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      camera.position.lerpVectors(swoopStartPos, swoopEndPos, ease);
      // Slight graceful swoop arc
      camera.position.y += Math.sin(t * Math.PI) * 32 * (1 - ease);
      const lookNow = new THREE.Vector3().lerpVectors(swoopStartLook, swoopEndLook, ease);
      camera.lookAt(lookNow);

      camera.fov = swoopStartFov + (swoopEndFov - swoopStartFov) * ease;
      camera.updateProjectionMatrix();
      skyDome.position.copy(camera.position);

      const targetFog = trackData ? trackData.spec.fogDensity : 0.00125;
      scene.fog.density = 0.00016 + (targetFog - 0.00016) * ease;

      if (streetBuildingsGroup) {
        const bScale = 0.08 + 0.92 * Math.min(1, ease * 1.25);
        streetBuildingsGroup.scale.y = bScale;
      }
      if (aerialMapGroup && t > 0.72) {
        aerialMapGroup.visible = false;
      }

      updateWorldAnimations(dt, worldAnimClock);
      updateRain(dt, trackData && trackData.spec.envType === 'tokyo' && t > 0.5, 0, playerCar ? playerCar.heading : 0);

      if (t >= 1) {
        if (aerialMapGroup) aerialMapGroup.visible = false;
        if (streetBuildingsGroup) streetBuildingsGroup.scale.y = 1;
        scene.fog.density = targetFog;
        appState = 'countdown';
        setBodyScreen('in-race');
        syncMobileUiState();
        applyCameraVisibility();
      }
      return;
    }

    if (appState === 'garage') {
      updateRain(dt, false, 0, 0);
      if (!garageDragging) turntableGroup.rotation.y += dt * 0.38;
      const totalYaw = garageOrbitYaw;
      camera.position.set(
        Math.sin(totalYaw) * 6.5 - 0.55,
        1.48,
        Math.cos(totalYaw) * 6.5
      );
      camera.lookAt(-0.78, 0.72, 0);
      showroomRings.forEach(rr => {
        const ph = (worldAnimClock * 0.48 + rr.phase) % 1;
        const sc = 0.85 + ph * 0.72;
        rr.mesh.scale.set(sc, sc, 1);
        rr.mat.opacity = (1 - ph) * 0.52;
      });
      sfx.updateDrive(dt, false, 0, false, false);
      return;
    }

    const isNightRain = trackData && trackData.spec.envType === 'tokyo';
    const diffSpec = DIFF_SPECS[selectedDiffIdx] || DIFF_SPECS[0];

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

      const gp = pollGamepad();
      let gas;
      if (mobileControlActive && (mobileControlMode === 'touch' || mobileControlMode === 'tilt')) {
        const mobileBrakeOrDrift = touchSwipeBrakeActive || secondaryDriftPointers.size > 0 || tiltLeftPointers.size > 0 || keys['KeyS'] || keys['ArrowDown'];
        gas = !mobileBrakeOrDrift;
      } else {
        gas = !!(keys['KeyW'] || keys['ArrowUp'] || (gp && gp.gas));
      }
      const isAutoGasCountdown = mobileControlActive && (mobileControlMode === 'touch' || mobileControlMode === 'tilt');
      const targetCountdownRpm = gas ? (isAutoGasCountdown ? 6800 : 8800) : 1200;
      playerCar.rpm += (targetCountdownRpm - playerCar.rpm) * Math.min(1, dt * (gas ? 2.6 : 4.2));

      if (mobileControlActive && mobileControlMode === 'tilt' && tiltHasSample) {
        filteredTiltDeg += (latestRawTiltDeg - filteredTiltDeg) * Math.min(1, dt * 14);
        tiltSteerInput = computeTiltSteerFromDeg(filteredTiltDeg);
      }
      const curSteer = mobileControlMode === 'tilt' ? tiltSteerInput : (mobileControlMode === 'touch' ? touchAnalogSteer : 0);
      const steerGaugeDot = document.getElementById('steerGaugeDot');
      if (steerGaugeDot && mobileControlActive) {
        steerGaugeDot.style.left = `${50 - curSteer * 44}%`;
      }

      drawTachometer(0, playerCar.rpm, 1, 100, false);
      drawMinimap();

      if (countdownTimer <= 0) {
        appState = 'racing';
        if (playerCar.rpm >= 5300 && playerCar.rpm <= 7500) {
          playerCar.speed = 38;
          playerCar.n2o = 100;
          totalStyleScore += 500;
          playerCar.backfireTimer = 0.14;
          document.getElementById('styleScoreVal').textContent = `STYLE: ${totalStyleScore.toLocaleString()} PTS`;
          banner.textContent = '⚡ PERFECT LAUNCH!';
          showCallout('⚡ PERFECT LAUNCH!', '+500 STYLE • TURBO BOOST!');
          sfx.playBackfire();
        } else if (playerCar.rpm > 7700) {
          playerCar.speed = 16;
          playerCar.wheelspinTimer = 0.65;
          banner.textContent = '🔥 WHEELSPIN!';
        } else {
          banner.textContent = 'GO!!';
        }
        sfx.playCountdown(true);
        setTimeout(() => banner.classList.remove('active'), 950);
      }

      const ang = 0.35 + countdownTimer * 0.4;
      if (cameraMode === 1) {
        positionCockpitCamera(playerCar.spec, 0);
      } else {
        camera.position.set(playerCar.x + Math.sin(ang) * 9.5, playerCar.y + 3.4, playerCar.z + Math.cos(ang) * 9.5);
        camera.lookAt(playerCar.x, playerCar.y + 0.9, playerCar.z);
      }
      skyDome.position.copy(camera.position);
      updateWorldAnimations(dt, worldAnimClock);
      updateRain(dt, isNightRain, 0, playerCar.heading);
      sfx.updateDrive(dt, true, playerCar.rpm / 9000, false, false);
      window.__apexState = {
        appState,
        difficulty: diffSpec.id,
        mobileControlActive,
        mobileControlMode,
        steerInput: curSteer,
        smoothedSteer: playerCar ? playerCar.smoothedSteer : 0,
        tiltSteerInput,
        touchAnalogSteer,
        throttle: gas ? 1 : 0,
        braking: 0,
        handbrake: false,
        nosPressed: false,
        cameraMode,
        speed: playerCar ? playerCar.speed : 0
      };
      return;
    }

    if (appState !== 'racing') {
      updateRain(dt, false, 0, 0);
      sfx.updateDrive(dt, false, 0, false, false);
      window.__apexState = {
        appState,
        difficulty: diffSpec.id,
        mobileControlActive,
        mobileControlMode,
        steerInput: 0,
        smoothedSteer: playerCar ? playerCar.smoothedSteer : 0,
        tiltSteerInput,
        touchAnalogSteer,
        throttle: 0,
        braking: 0,
        handbrake: false,
        nosPressed: false,
        cameraMode,
        speed: playerCar ? playerCar.speed : 0
      };
      return;
    }

    // --- ACTIVE RACING PHYSICS (WEIGHT-TRANSFER DRIFT + GEARBOX + SLIPSTREAM) ---
    raceElapsed += dt;
    hudHintsTimer += dt;
    if (hudHintsTimer > 6.0) {
      document.body.classList.add('hud-hints-faded');
    }
    document.getElementById('raceTimeVal').textContent = `TIME ${formatRaceTime(raceElapsed)}`;

    const gp = pollGamepad();
    const isAutoGasMobile = mobileControlActive && (mobileControlMode === 'touch' || mobileControlMode === 'tilt');
    const isTiltMobile = mobileControlActive && mobileControlMode === 'tilt';
    if (isTiltMobile && tiltHasSample) {
      filteredTiltDeg += (latestRawTiltDeg - filteredTiltDeg) * Math.min(1, dt * 14);
      tiltSteerInput = computeTiltSteerFromDeg(filteredTiltDeg);
    }
    let throttle, braking, steerInput, handbrake, nosPressed;

    if (isAutoGasMobile) {
      const kbSteer = (keys['KeyA'] || keys['ArrowLeft'] ? 1 : 0) - (keys['KeyD'] || keys['ArrowRight'] ? 1 : 0);
      const mobileSteer = mobileControlMode === 'tilt' ? tiltSteerInput : touchAnalogSteer;
      steerInput = Math.max(-1, Math.min(1, kbSteer !== 0 ? kbSteer : (gp && gp.steer !== 0 ? gp.steer : mobileSteer)));

      const explicitBrake = !!(keys['KeyS'] || keys['ArrowDown'] || touchSwipeBrakeActive || (gp && gp.brk));
      const driftTrigger = !!(keys['ShiftLeft'] || keys['ShiftRight'] || keys['KeyB'] || secondaryDriftPointers.size > 0 || tiltLeftPointers.size > 0 || (gp && gp.drift));

      if (explicitBrake) {
        handbrake = false;
        braking = 1;
        throttle = 0;
      } else if (driftTrigger) {
        if (playerCar.speed > 26 && Math.abs(steerInput) > 0.20) {
          handbrake = true;
          throttle = 0.35;
          braking = 0.45;
        } else {
          handbrake = false;
          braking = 1;
          throttle = 0;
        }
      } else {
        throttle = 1;
        braking = 0;
        handbrake = false;
      }

      nosPressed = !!keys['Space'] || quickN2oHeld || tiltRightPointers.size > 0 || (performance.now() < touchSwipeN2oUntil) || !!(gp && gp.nos);
    } else {
      const kbSteer = (keys['KeyA'] || keys['ArrowLeft'] ? 1 : 0) - (keys['KeyD'] || keys['ArrowRight'] ? 1 : 0);
      throttle = (keys['KeyW'] || keys['ArrowUp'] || (gp && gp.gas)) ? 1 : 0;
      braking = (keys['KeyS'] || keys['ArrowDown'] || (gp && gp.brk)) ? 1 : 0;
      steerInput = kbSteer !== 0 ? kbSteer : (gp ? gp.steer : 0);
      handbrake = !!(keys['ShiftLeft'] || keys['ShiftRight'] || keys['KeyB'] || (gp && gp.drift));
      nosPressed = !!(keys['Space'] || (gp && gp.nos));
    }

    const steerGaugeDot = document.getElementById('steerGaugeDot');
    if (steerGaugeDot && mobileControlActive) {
      steerGaugeDot.style.left = `${50 - steerInput * 44}%`;
    }

    const spec = playerCar.spec;
    const isDriftMode = MODE_SPECS[selectedModeIdx].id === 'drift';
    const isPursuitMode = MODE_SPECS[selectedModeIdx].id === 'pursuit';

    if (playerCar.backfireTimer > 0) playerCar.backfireTimer = Math.max(0, playerCar.backfireTimer - dt);
    if (playerCar.shiftDelay > 0) playerCar.shiftDelay = Math.max(0, playerCar.shiftDelay - dt);
    if (playerCar.wheelspinTimer > 0) playerCar.wheelspinTimer = Math.max(0, playerCar.wheelspinTimer - dt);
    playerCar.meshObj.backfireGroup.visible = playerCar.backfireTimer > 0;

    // Aerodynamic Slipstream Draft Check against AI ahead
    let inDraft = false;
    if (Math.abs(playerCar.speed) * 1.95 > 78) {
      for (let i = 0; i < aiRacers.length; i++) {
        const ai = aiRacers[i];
        const dx = ai.x - playerCar.x;
        const dz = ai.z - playerCar.z;
        const d = Math.hypot(dx, dz);
        if (d > 6 && d < 44) {
          const fwdDot = (dx * Math.sin(playerCar.heading) + dz * Math.cos(playerCar.heading)) / d;
          if (fwdDot > 0.96 && Math.abs(ai.lat - playerCar.lat) < 3.9) {
            inDraft = true;
            if (Math.random() < dt * 16) {
              spawnParticle(false, ai.x + (Math.random() - 0.5) * 1.6, ai.y + 0.9, ai.z + (Math.random() - 0.5) * 1.6, 0, 0.4, 0);
            }
            break;
          }
        }
      }
    }
    const draftEl = document.getElementById('draftHud');
    draftEl.classList.toggle('active', inDraft);
    if (inDraft) {
      playerCar.n2o = Math.min(100, playerCar.n2o + 9.0 * dt);
    }

    // N2O Nitrous Boost
    const nosFiring = (nosPressed && playerCar.n2o > 2 && throttle > 0) || shotForceNos;
    if (nosFiring && !shotForceNos) {
      playerCar.n2o = Math.max(0, playerCar.n2o - 25 * dt);
    } else if (!shotForceNos) {
      playerCar.n2o = Math.min(100, playerCar.n2o + 4.5 * dt);
    }
    playerCar.meshObj.nosGroup.visible = nosFiring;

    if (outputFXAAPass) {
      const targetAb = nosFiring ? 0.85 : 0.0;
      outputFXAAPass.uniforms.uNitroAmount.value += (targetAb - outputFXAAPass.uniforms.uNitroAmount.value) * Math.min(1, dt * 10);
    }

    // 6-Speed Gearbox & Engine Torque Curve
    const mphNow = Math.abs(playerCar.speed) * 1.95;
    let curGear = playerCar.speed < -1 ? 'R' : (typeof playerCar.gear === 'number' ? playerCar.gear : 1);
    if (curGear !== 'R') {
      if (!manualTransmission) {
        let g = curGear;
        if (mphNow > GEAR_MAX_MPH[g] * 0.95 && g < 6) {
          g++;
          playerCar.shiftDelay = 0.08;
          sfx.playShift();
          if (nosFiring || throttle > 0) {
            playerCar.backfireTimer = 0.085;
            sfx.playBackfire();
          }
        } else if (g > 1 && mphNow < GEAR_MAX_MPH[g - 1] * 0.68) {
          g--;
        }
        curGear = g;
      }
    } else if (throttle > 0 && playerCar.speed >= -1) {
      curGear = 1;
    }
    playerCar.gear = curGear;

    const gearIdx = typeof curGear === 'number' ? curGear : 1;
    const gearMin = GEAR_MAX_MPH[gearIdx - 1];
    const gearMax = GEAR_MAX_MPH[gearIdx] * (nosFiring ? 1.18 : 1.0);
    const inGearFrac = curGear === 'R' ? 0.55 : Math.max(0, Math.min(1.06, (mphNow - gearMin) / Math.max(15, gearMax - gearMin)));

    let targetRpm = mphNow < 2
      ? (throttle > 0 ? 5600 : 1100)
      : 2200 + inGearFrac * 6650 + (nosFiring ? 350 : 0);

    if (manualTransmission && curGear !== 'R' && curGear < 6 && mphNow > gearMax * 0.99 && throttle > 0) {
      targetRpm = 8850 - Math.random() * 480;
      if (Math.random() < dt * 7) {
        playerCar.backfireTimer = 0.07;
        sfx.playBackfire();
      }
    }
    playerCar.rpm += (targetRpm - playerCar.rpm) * Math.min(1, dt * 13);

    const powerBandMult = manualTransmission
      ? (playerCar.rpm > 8550 ? 0.45 : playerCar.rpm > 4200 ? 1.12 : 0.86)
      : 1.0;
    const maxSpd = isAutoGasMobile
      ? spec.maxSpdPhys * (nosFiring ? diffSpec.capNos : diffSpec.capNoNos) * (inDraft ? 1.10 : 1.0)
      : spec.maxSpdPhys * (nosFiring ? 1.32 : 1.0) * (inDraft ? 1.14 : 1.0);
    const acc = spec.accel * (nosFiring ? 1.75 : 1.0) * (inDraft ? 1.12 : 1.0) * powerBandMult * (playerCar.shiftDelay > 0 ? 0.3 : 1.0);

    let autoApexBraking = false;
    if (isAutoGasMobile) {
      const s0 = playerCar.segIdx;
      const curveLook = Math.max(
        Math.abs(trackData.curvatures[s0]),
        Math.abs(trackData.curvatures[(s0 + 5) % FRAMES_COUNT]) * 0.95,
        Math.abs(trackData.curvatures[(s0 + 10) % FRAMES_COUNT]) * 0.88,
        Math.abs(trackData.curvatures[(s0 + 15) % FRAMES_COUNT]) * 0.75
      );
      const cornerSeverity = Math.max(0, Math.min(1, (curveLook - diffSpec.kStart) / diffSpec.kSpan));
      const baseCruise = isTiltMobile ? diffSpec.cruiseTilt : diffSpec.cruiseTouch;
      const minCruise = isTiltMobile ? diffSpec.minTilt : diffSpec.minTouch;
      const autoCruiseRatio = Math.max(minCruise, baseCruise - cornerSeverity * diffSpec.cornerDrop - Math.abs(steerInput) * 0.05);
      const autoTargetSpd = spec.maxSpdPhys * autoCruiseRatio * (inDraft ? 1.08 : 1.0);

      if (nosFiring) {
        playerCar.speed += acc * 0.95 * dt;
      } else if (braking > 0 && !handbrake) {
        playerCar.speed -= (playerCar.speed > 2 ? 84 : 34) * dt;
      } else if (handbrake) {
        if (playerCar.speed > autoTargetSpd * 0.92) playerCar.speed -= 30 * dt;
        else playerCar.speed += acc * 0.55 * dt;
      } else if (throttle > 0) {
        if (playerCar.speed < autoTargetSpd) {
          playerCar.speed += acc * 0.88 * dt;
        } else {
          const overSpd = playerCar.speed - autoTargetSpd;
          playerCar.speed -= Math.min(48, 8 + overSpd * 2.0) * dt;
          if (overSpd > 9) autoApexBraking = true;
        }
      }
    } else {
      if (throttle > 0) {
        playerCar.speed += acc * dt;
      } else if (braking > 0) {
        playerCar.speed -= (playerCar.speed > 2 ? 78 : 34) * dt;
      } else {
        playerCar.speed *= Math.pow(0.45, dt);
      }
    }
    if (manualTransmission && curGear !== 'R' && curGear < 6) {
      const capPhys = (gearMax * 1.03) / 1.95;
      if (playerCar.speed > capPhys) playerCar.speed += (capPhys - playerCar.speed) * Math.min(1, dt * 5);
    }
    playerCar.speed = Math.max(-32, Math.min(maxSpd, playerCar.speed));

    const spdAbs = Math.abs(playerCar.speed);
    playerCar.smoothedSteer += (steerInput - playerCar.smoothedSteer) * Math.min(1, dt * (isTiltMobile ? 10 : 11));

    const mobileTurnMult = isAutoGasMobile ? (isTiltMobile ? 1.15 : 1.24) : 1.0;
    const turnRate = (1.52 + (spec.handling / 100) * 1.18) * mobileTurnMult * (handbrake ? 1.34 : 1.0) * (spdAbs > 3 ? Math.sign(playerCar.speed) : 0);
    playerCar.heading += playerCar.smoothedSteer * turnRate * dt;

    if (isAutoGasMobile) {
      const curT = trackData.tangents[playerCar.segIdx];
      const curR = trackData.rights[playerCar.segIdx];
      const tYaw = Math.atan2(curT.x, curT.z);
      let dYaw = tYaw - playerCar.heading;
      while (dYaw > Math.PI) dYaw -= Math.PI * 2;
      while (dYaw < -Math.PI) dYaw += Math.PI * 2;

      if (isTiltMobile) {
        const preset = TILT_SENS_PRESETS[tiltSensIdx] || TILT_SENS_PRESETS[0];
        const activeEsp = (handbrake
          ? preset.espRate * 0.42
          : preset.espRate * (1 - 0.30 * Math.abs(playerCar.smoothedSteer))) * diffSpec.espMult;
        playerCar.heading += dYaw * Math.min(1, dt * activeEsp);
      } else if (Math.abs(steerInput) < 0.05 && !handbrake && Math.abs(dYaw) < 0.45) {
        playerCar.heading += dYaw * Math.min(1, dt * 1.5);
      }

      const edgeStart = isTiltMobile ? diffSpec.edgeTilt : diffSpec.edgeTouch;
      const latDot = Math.sin(playerCar.heading) * curR.x + Math.cos(playerCar.heading) * curR.z;
      if (Math.abs(playerCar.lat) > edgeStart && playerCar.lat * latDot > -0.04) {
        const wallProx = Math.min(1, (Math.abs(playerCar.lat) - edgeStart) / (MAX_LAT - edgeStart));
        const inwardYaw = tYaw - Math.sign(playerCar.lat) * (0.07 + wallProx * 0.30);
        let inDiff = inwardYaw - playerCar.heading;
        while (inDiff > Math.PI) inDiff -= Math.PI * 2;
        while (inDiff < -Math.PI) inDiff += Math.PI * 2;
        playerCar.heading += inDiff * Math.min(1, dt * (2.5 + wallProx * 8.0) * diffSpec.cushMult);

        let inVelDiff = inwardYaw - playerCar.velHeading;
        while (inVelDiff > Math.PI) inVelDiff -= Math.PI * 2;
        while (inVelDiff < -Math.PI) inVelDiff += Math.PI * 2;
        playerCar.velHeading += inVelDiff * Math.min(1, dt * (2.2 + wallProx * 7.0) * diffSpec.cushMult);
      }
    }

    playerCar.steerAngle = playerCar.smoothedSteer;

    const driftRequested = handbrake || (Math.abs(steerInput) > 0 && spdAbs > 42 && (braking > 0 || throttle === 0));
    const latGripRate = isTiltMobile ? (driftRequested ? 4.8 : (isDriftMode ? 8.5 : 12.5)) : isAutoGasMobile ? (driftRequested ? 4.4 : (isDriftMode ? 7.8 : 10.5)) : (driftRequested ? 2.6 : (isDriftMode ? 6.5 : 8.2));
    let slipDiff = playerCar.heading - playerCar.velHeading;
    while (slipDiff > Math.PI) slipDiff -= Math.PI * 2;
    while (slipDiff < -Math.PI) slipDiff += Math.PI * 2;
    playerCar.velHeading += slipDiff * Math.min(1, dt * latGripRate);

    let clampedSlip = playerCar.heading - playerCar.velHeading;
    while (clampedSlip > Math.PI) clampedSlip -= Math.PI * 2;
    while (clampedSlip < -Math.PI) clampedSlip += Math.PI * 2;
    const maxSlip = isTiltMobile ? (driftRequested ? 0.42 : 0.14) : isAutoGasMobile ? (driftRequested ? 0.46 : 0.18) : (driftRequested ? 0.62 : 0.28);
    if (Math.abs(clampedSlip) > maxSlip) {
      clampedSlip = Math.sign(clampedSlip) * maxSlip;
      playerCar.velHeading = playerCar.heading - clampedSlip;
    }
    playerCar.driftAngle = clampedSlip;
    const isDrifting = spdAbs > 22 && (Math.abs(clampedSlip) > 0.14 || (handbrake && Math.abs(steerInput) > 0));

    const targetLoadPitch = braking > 0 && playerCar.speed > 4 ? 0.048 : nosFiring ? -0.04 : throttle > 0 ? -0.018 : 0;
    const targetLoadRoll = playerCar.smoothedSteer * Math.min(0.085, spdAbs / 720);
    playerCar.loadPitch += (targetLoadPitch - playerCar.loadPitch) * Math.min(1, dt * 10);
    playerCar.loadRoll += (targetLoadRoll - playerCar.loadRoll) * Math.min(1, dt * 10);
    playerCar.meshObj.chassisGroup.rotation.z = playerCar.loadRoll;
    playerCar.meshObj.tailMat.color.setHex(braking || handbrake || autoApexBraking ? 0xff7788 : 0xff2244);

    if (braking > 0 && spdAbs > 28) playerCar.brakeHeat = Math.min(1, playerCar.brakeHeat + dt * 2.4);
    else playerCar.brakeHeat = Math.max(0, playerCar.brakeHeat - dt * 1.1);
    playerCar.meshObj.rotorMat.emissiveIntensity = playerCar.brakeHeat * 2.4;

    if (playerCar.meshObj.steeringWheelPivot) {
      playerCar.meshObj.steeringWheelPivot.rotation.z = -playerCar.smoothedSteer * 1.15;
    }

    playerCar.x += Math.sin(playerCar.velHeading) * playerCar.speed * dt;
    playerCar.z += Math.cos(playerCar.velHeading) * playerCar.speed * dt;
    updateRacerSplineTransform(playerCar, dt, true);

    const fx = Math.sin(playerCar.heading), fz = Math.cos(playerCar.heading);
    const rx = Math.cos(playerCar.heading), rz = -Math.sin(playerCar.heading);
    const halfL = spec.len * 0.5;
    const wX = spec.wid * 0.45;
    const rearCenterX = playerCar.x - fx * (halfL * 0.62);
    const rearCenterZ = playerCar.z - fz * (halfL * 0.62);
    const lx = rearCenterX - rx * wX, lz = rearCenterZ - rz * wX;
    const rxp = rearCenterX + rx * wX, rzp = rearCenterZ + rz * wX;
    const markY = playerCar.y + 0.05;

    const layingSkids = isDrifting || (braking > 0 && spdAbs > 36) || playerCar.wheelspinTimer > 0;
    if (layingSkids && prevRearTirePos) {
      if (Math.hypot(lx - prevRearTirePos.lx, lz - prevRearTirePos.lz) > 0.35) {
        skidManager.addMark(prevRearTirePos.lx, prevRearTirePos.y, prevRearTirePos.lz, lx, markY, lz, rx, rz, 0.2);
        skidManager.addMark(prevRearTirePos.rx, prevRearTirePos.y, prevRearTirePos.rz, rxp, markY, rzp, rx, rz, 0.2);
        prevRearTirePos = { lx, lz, rx: rxp, rz: rzp, y: markY };
      }
    } else if (layingSkids) {
      prevRearTirePos = { lx, lz, rx: rxp, rz: rzp, y: markY };
    } else {
      prevRearTirePos = null;
    }

    const tailCol = nosFiring ? 0x22d3ee : 0xff1e42;
    const tailY = playerCar.y + spec.noseH + 0.46;
    const tailCenterX = playerCar.x - fx * (halfL + 0.16);
    const tailCenterZ = playerCar.z - fz * (halfL + 0.16);
    const ribW = spec.wid * 0.42;
    const ribbonActive = mphNow > 72 || nosFiring;
    playerRibbonL.pushPoint(tailCenterX - rx * ribW, tailY, tailCenterZ - rz * ribW, rx, rz, ribbonActive, tailCol);
    playerRibbonR.pushPoint(tailCenterX + rx * ribW, tailY, tailCenterZ + rz * ribW, rx, rz, ribbonActive, tailCol);

    if (isDrifting || playerCar.wheelspinTimer > 0) {
      if (isDrifting) {
        activeDriftTimer = 1.35;
        const ptsGain = spdAbs * 9.5 * (isDriftMode ? 1.8 : 1.0) * dt;
        activeDriftPts += ptsGain;
        activeDriftMult = activeDriftPts > 2500 ? 4 : activeDriftPts > 1200 ? 3 : activeDriftPts > 400 ? 2 : 1;
        playerCar.n2o = Math.min(100, playerCar.n2o + 18 * dt);
      }
      const smokeX = rearCenterX + (Math.random() - 0.5) * 1.4;
      const smokeZ = rearCenterZ + (Math.random() - 0.5) * 1.4;
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

    const mph = spdAbs * 1.95;
    if (mph > maxMphReached) maxMphReached = mph;

    // --- AI RIVALS & PURSUIT INTERCEPTORS ---
    if (nearMissCooldown > 0) nearMissCooldown -= dt;
    aiRacers.forEach(ai => {
      const lookSeg = (ai.segIdx + 12) % FRAMES_COUNT;
      const aimSeg = (ai.segIdx + 6) % FRAMES_COUNT;
      const aimP = trackData.pts[aimSeg];
      const aimR = trackData.rights[aimSeg];

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

      const curveAhead = Math.abs(trackData.curvatures[lookSeg]);
      const gapToPlayer = ai.totalProgress - playerCar.totalProgress;
      const rbFactor = gapToPlayer > 0.14 ? diffSpec.rbLead : gapToPlayer < -0.14 ? diffSpec.rbBehind : 1.0;
      const aiCurveFactor = curveAhead > 0.14 ? diffSpec.aiCrn : diffSpec.aiStr;
      const aiMobileScale = isTiltMobile ? diffSpec.aiTilt : (isAutoGasMobile ? diffSpec.aiTouch : diffSpec.aiDesktop);
      const aiMaxSpd = ai.spec.maxSpdPhys * ai.aiSkill * rbFactor * aiCurveFactor * aiMobileScale;

      if (ai.speed < aiMaxSpd) ai.speed += ai.spec.accel * diffSpec.aiAcc * dt;
      else ai.speed *= Math.pow(0.55, dt);

      ai.x += Math.sin(ai.heading) * ai.speed * dt;
      ai.z += Math.cos(ai.heading) * ai.speed * dt;
      updateRacerSplineTransform(ai, dt, false);

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

    const reqLaps = MODE_SPECS[selectedModeIdx].laps;
    if (playerCar.lap >= reqLaps) {
      finishRace(playerPlace);
      return;
    }

    // Update soft radial Sprite Smoke & Sparks
    for (let i = particles.length - 1; i >= 0; i--) {
      const pt = particles[i];
      pt.life -= dt;
      pt.mesh.position.x += pt.vx * dt;
      pt.mesh.position.y += pt.vy * dt;
      pt.mesh.position.z += pt.vz * dt;
      const frac = Math.max(0, pt.life / pt.maxLife);
      if (pt.isSpark) {
        pt.vy -= 22 * dt;
        pt.mat.opacity = frac * 0.92;
      } else {
        pt.mesh.scale.multiplyScalar(1 + dt * 2.1);
        pt.mat.opacity = frac * 0.34;
      }
      if (pt.life <= 0) {
        raceWorldGroup.remove(pt.mesh);
        if (pt.mat) pt.mat.dispose();
        particles.splice(i, 1);
      }
    }

    // Update Sun Shadow Target to track player
    sunLight.position.set(playerCar.x + 120, 220, playerCar.z + 100);
    sunLight.target.position.set(playerCar.x, playerCar.y, playerCar.z);
    sunLight.target.updateMatrixWorld();

    // Dynamic 4-View NFS Camera (Chase / Cockpit / Hood / Heli)
    const shake = nosFiring ? (Math.random() - 0.5) * 0.14 : 0;
    if (cameraMode === 1) {
      positionCockpitCamera(spec, shake);
    } else {
      const camCfg = [
        { dist: 9.2, height: 3.3, ahead: 9.0 },
        null,
        { dist: -0.45, height: 1.55, ahead: 16.0 },
        { dist: 19.0, height: 11.5, ahead: 10.0 }
      ][cameraMode];
      const camTargetX = playerCar.x - Math.sin(playerCar.heading) * camCfg.dist + shake;
      const camTargetZ = playerCar.z - Math.cos(playerCar.heading) * camCfg.dist + shake;
      const camTargetY = playerCar.y + camCfg.height + shake * 0.5;
      const camLerp = cameraMode === 2 ? 1.0 : Math.min(1, dt * 11.0);
      camera.position.x += (camTargetX - camera.position.x) * camLerp;
      camera.position.z += (camTargetZ - camera.position.z) * camLerp;
      camera.position.y += (camTargetY - camera.position.y) * camLerp;
      camera.lookAt(
        playerCar.x + Math.sin(playerCar.heading) * camCfg.ahead,
        playerCar.y + 1.15,
        playerCar.z + Math.cos(playerCar.heading) * camCfg.ahead
      );
    }
    skyDome.position.copy(camera.position);

    const baseFov = cameraMode === 1 ? 68 : 64;
    const targetFov = nosFiring ? baseFov + 14 : baseFov + Math.min(9, mph * 0.042) + (inDraft ? 4 : 0);
    if (Math.abs(camera.fov - targetFov) > 0.15) {
      camera.fov += (targetFov - camera.fov) * Math.min(1, dt * 7);
      camera.updateProjectionMatrix();
    }

    updateWorldAnimations(dt, worldAnimClock);
    updateRain(dt, isNightRain, playerCar.speed, playerCar.heading);
    sfx.updateDrive(dt, true, playerCar.rpm / 9000, isDrifting, nosFiring);
    drawTachometer(mph, playerCar.rpm, playerCar.gear, playerCar.n2o, nosFiring);
    drawMinimap();

    window.__apexState = {
      appState,
      difficulty: diffSpec.id,
      mobileControlActive,
      mobileControlMode,
      steerInput,
      smoothedSteer: playerCar ? playerCar.smoothedSteer : 0,
      tiltSteerInput,
      touchAnalogSteer,
      throttle,
      braking,
      handbrake,
      nosPressed,
      cameraMode,
      speed: playerCar ? playerCar.speed : 0
    };
  }

  // --- HANDLE WINDOW RESIZE ---
  window.addEventListener('resize', () => {
    const pr = Math.min(window.devicePixelRatio || 1, 2);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(pr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (composer) {
      composer.setPixelRatio(pr);
      composer.setSize(window.innerWidth, window.innerHeight);
    }
    if (bloomPass) bloomPass.setSize(window.innerWidth, window.innerHeight);
    if (outputFXAAPass) {
      outputFXAAPass.uniforms.resolution.value.set(
        1 / Math.max(1, window.innerWidth * pr),
        1 / Math.max(1, window.innerHeight * pr)
      );
    }
    if (appState === 'title') projectMapLabels();
  });

  // --- DETERMINISTIC ?shot= PRESETS & URL PARAMETERS ---
  function placeRacerAtSegment(racer, segIdx, lat) {
    const idx = ((segIdx % FRAMES_COUNT) + FRAMES_COUNT) % FRAMES_COUNT;
    const p = trackData.pts[idx];
    const t = trackData.tangents[idx];
    const r = trackData.rights[idx];
    racer.segIdx = idx;
    racer.u = idx / FRAMES_COUNT;
    racer.lat = lat;
    racer.targetLat = lat;
    racer.x = p.x + r.x * lat;
    racer.y = p.y;
    racer.z = p.z + r.z * lat;
    racer.heading = Math.atan2(t.x, t.z);
    racer.velHeading = racer.heading;
    racer.totalProgress = Math.max(0, racer.u);
    racer.lap = 0;
    racer.meshObj.root.position.set(racer.x, racer.y, racer.z);
    racer.meshObj.root.rotation.y = racer.heading;
  }

  function populateShotRibbons(racer, ribL, ribR, startSeg, lat, colHex) {
    const spec = racer.spec;
    const halfL = spec.len * 0.5 + 0.16;
    const ribW = spec.wid * 0.42;
    for (let back = 26; back >= 0; back--) {
      const fIdx = ((startSeg - back * 0.32) % FRAMES_COUNT + FRAMES_COUNT) % FRAMES_COUNT;
      const i0 = Math.floor(fIdx);
      const i1 = (i0 + 1) % FRAMES_COUNT;
      const frac = fIdx - i0;
      const p = new THREE.Vector3().lerpVectors(trackData.pts[i0], trackData.pts[i1], frac);
      const t = new THREE.Vector3().lerpVectors(trackData.tangents[i0], trackData.tangents[i1], frac).normalize();
      const r = new THREE.Vector3().lerpVectors(trackData.rights[i0], trackData.rights[i1], frac).normalize();
      const cx = p.x + r.x * lat - t.x * halfL;
      const cy = p.y + spec.noseH + 0.46;
      const cz = p.z + r.z * lat - t.z * halfL;
      ribL.pushPoint(cx - r.x * ribW, cy, cz - r.z * ribW, r.x, r.z, true, colHex);
      ribR.pushPoint(cx + r.x * ribW, cy, cz + r.z * ribW, r.x, r.z, true, colHex);
    }
  }

  function applyShotPreset(shotName) {
    if (shotName === 'aerial') {
      enterTitleScreen(0);
      for (let i = 0; i < 42; i++) {
        updateTitleAttract(0.05, true);
      }
      shotFrozen = true;
      return true;
    }

    if (shotName === 'race') {
      selectedTrackIdx = 0;
      selectedModeIdx = 0;
      cameraMode = 0;
      shotForceNos = true;
      launchRace();
      appState = 'racing';
      applyCameraVisibility();
      document.getElementById('countdownBanner').classList.remove('active');
      document.body.classList.add('hud-hints-faded');

      placeRacerAtSegment(playerCar, 12, -2.8);
      playerCar.speed = 188 / 1.95;
      playerCar.gear = 5;
      playerCar.rpm = 7650;
      playerCar.n2o = 76;
      playerCar.meshObj.nosGroup.visible = true;

      if (aiRacers[0]) { placeRacerAtSegment(aiRacers[0], 17, 4.0); aiRacers[0].speed = 82; }
      if (aiRacers[1]) { placeRacerAtSegment(aiRacers[1], 21, -4.6); aiRacers[1].speed = 84; }
      if (aiRacers[2]) { placeRacerAtSegment(aiRacers[2], 26, 2.2); aiRacers[2].speed = 86; }
      if (aiRacers[3]) { placeRacerAtSegment(aiRacers[3], 6, 4.2); aiRacers[3].speed = 80; }
      if (aiRacers[4]) { placeRacerAtSegment(aiRacers[4], 4, -5.0); aiRacers[4].speed = 78; }

      populateShotRibbons(playerCar, playerRibbonL, playerRibbonR, 12, -2.8, 0x22d3ee);

      camera.fov = 74;
      camera.updateProjectionMatrix();
      camera.position.set(
        playerCar.x - Math.sin(playerCar.heading) * 9.0,
        playerCar.y + 3.2,
        playerCar.z - Math.cos(playerCar.heading) * 9.0
      );
      camera.lookAt(
        playerCar.x + Math.sin(playerCar.heading) * 14.0,
        playerCar.y + 1.3,
        playerCar.z + Math.cos(playerCar.heading) * 14.0
      );
      skyDome.position.copy(camera.position);
      worldAnimClock = 1.4;
      updateWorldAnimations(0.016, worldAnimClock);
      drawTachometer(188, playerCar.rpm, playerCar.gear, playerCar.n2o, true);
      drawMinimap();
      document.getElementById('posVal').textContent = '4TH';
      document.getElementById('raceTimeVal').textContent = 'TIME 00:24.68';
      document.getElementById('bestLapVal').textContent = 'BEST 00:31.42';
      shotFrozen = true;
      return true;
    }

    if (shotName === 'canyon') {
      selectedTrackIdx = 1;
      selectedModeIdx = 0;
      cameraMode = 0;
      shotForceNos = false;
      launchRace();
      appState = 'racing';
      applyCameraVisibility();
      document.getElementById('countdownBanner').classList.remove('active');
      document.body.classList.add('hud-hints-faded');

      placeRacerAtSegment(playerCar, 66, -2.5);
      playerCar.speed = 164 / 1.95;
      playerCar.gear = 5;
      playerCar.rpm = 7100;
      playerCar.n2o = 92;

      if (aiRacers[0]) { placeRacerAtSegment(aiRacers[0], 72, 3.8); aiRacers[0].speed = 78; }
      if (aiRacers[1]) { placeRacerAtSegment(aiRacers[1], 77, -4.2); aiRacers[1].speed = 80; }
      if (aiRacers[2]) { placeRacerAtSegment(aiRacers[2], 60, 4.0); aiRacers[2].speed = 75; }

      populateShotRibbons(playerCar, playerRibbonL, playerRibbonR, 66, -2.5, 0xff1e42);

      camera.fov = 66;
      camera.updateProjectionMatrix();
      camera.position.set(
        playerCar.x - Math.sin(playerCar.heading) * 9.2,
        playerCar.y + 3.4,
        playerCar.z - Math.cos(playerCar.heading) * 9.2
      );
      camera.lookAt(
        playerCar.x + Math.sin(playerCar.heading) * 14.0,
        playerCar.y + 1.3,
        playerCar.z + Math.cos(playerCar.heading) * 14.0
      );
      skyDome.position.copy(camera.position);
      worldAnimClock = 2.0;
      updateWorldAnimations(0.016, worldAnimClock);
      drawTachometer(164, playerCar.rpm, playerCar.gear, playerCar.n2o, false);
      drawMinimap();
      document.getElementById('posVal').textContent = '3RD';
      document.getElementById('raceTimeVal').textContent = 'TIME 00:38.12';
      shotFrozen = true;
      return true;
    }

    if (shotName === 'garage') {
      selectedCarIdx = 0;
      selectedPaintHex = 0x00d4ff;
      selectedGlowHex = 0x22d3ee;
      enterGarage();
      refreshShowroomCar();
      syncCustomizationPills();
      garageOrbitYaw = 0.62;
      turntableGroup.rotation.y = 0.18;
      worldAnimClock = 0.6;
      update(0.016);
      shotFrozen = true;
      return true;
    }

    if (shotName === 'cockpit') {
      selectedTrackIdx = 0;
      selectedModeIdx = 0;
      cameraMode = 1;
      shotForceNos = false;
      launchRace();
      appState = 'racing';
      applyCameraVisibility();
      document.getElementById('countdownBanner').classList.remove('active');
      document.body.classList.add('hud-hints-faded');

      placeRacerAtSegment(playerCar, 10, -1.8);
      playerCar.speed = 158 / 1.95;
      playerCar.gear = 4;
      playerCar.rpm = 6900;
      playerCar.n2o = 86;
      playerCar.smoothedSteer = 0.24;
      if (playerCar.meshObj.steeringWheelPivot) {
        playerCar.meshObj.steeringWheelPivot.rotation.z = -0.28;
      }

      if (aiRacers[0]) { placeRacerAtSegment(aiRacers[0], 15, 3.4); aiRacers[0].speed = 76; }
      if (aiRacers[1]) { placeRacerAtSegment(aiRacers[1], 20, -4.0); aiRacers[1].speed = 78; }
      if (aiRacers[2]) { placeRacerAtSegment(aiRacers[2], 6, -1.2); aiRacers[2].speed = 77; }

      camera.fov = 68;
      camera.updateProjectionMatrix();
      positionCockpitCamera(playerCar.spec, 0);
      skyDome.position.copy(camera.position);
      worldAnimClock = 1.2;
      updateWorldAnimations(0.016, worldAnimClock);
      drawTachometer(158, playerCar.rpm, playerCar.gear, playerCar.n2o, false);
      drawMinimap();
      document.getElementById('posVal').textContent = '3RD';
      document.getElementById('raceTimeVal').textContent = 'TIME 00:19.45';
      shotFrozen = true;
      return true;
    }
    return false;
  }

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('track')) {
    const ti = parseInt(urlParams.get('track'), 10);
    if (ti >= 0 && ti < TRACK_SPECS.length) selectedTrackIdx = ti;
  }
  if (urlParams.get('mode')) {
    const mi = MODE_SPECS.findIndex(m => m.id === urlParams.get('mode'));
    if (mi >= 0) selectedModeIdx = mi;
  }
  if (urlParams.get('cam')) {
    const ci = parseInt(urlParams.get('cam'), 10);
    if (ci >= 0 && ci < CAM_LABELS.length) cameraMode = ci;
  }

  const shotParam = urlParams.get('shot');
  if (!shotParam || !applyShotPreset(shotParam)) {
    if (urlParams.get('autostart') === '1') {
      launchRace();
      countdownTimer = 0.05;
    } else if (urlParams.get('screen') === 'garage') {
      enterGarage();
    } else {
      enterTitleScreen();
    }
  }

  // --- MAIN RENDER LOOP (HDR BLOOM + OUTPUT FXAA + LIVE 3D REAR-VIEW MIRROR) ---
  function renderFrame() {
    const showMirror = (appState === 'racing' || appState === 'countdown') &&
      mirrorEnabled && window.innerWidth > 720 && playerCar && playerCar.meshObj;

    if (showMirror) {
      mirrorCam.position.set(playerCar.x, playerCar.y + 1.48, playerCar.z);
      mirrorCam.lookAt(
        playerCar.x - Math.sin(playerCar.heading) * 42,
        playerCar.y + 1.15,
        playerCar.z - Math.cos(playerCar.heading) * 42
      );
      const prevVis = playerCar.meshObj.root.visible;
      playerCar.meshObj.root.visible = false;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.setRenderTarget(mirrorRT);
      renderer.clear();
      renderer.render(scene, mirrorCam);
      renderer.setRenderTarget(null);
      syncRendererColorPipeline();
      playerCar.meshObj.root.visible = prevVis;
    }

    if (composer && bloomEnabled) {
      composer.render();
    } else {
      renderer.render(scene, camera);
    }

    if (showMirror) {
      const frame = document.getElementById('rearMirrorFrame');
      const rect = frame.getBoundingClientRect();
      if (rect.width > 10 && rect.height > 10) {
        const vx = Math.round(rect.left + 2);
        const vy = Math.round(window.innerHeight - rect.bottom + 2);
        const vw = Math.round(rect.width - 4);
        const vh = Math.round(rect.height - 4);
        renderer.autoClear = false;
        renderer.clearDepth();
        renderer.setScissorTest(true);
        renderer.setViewport(vx, vy, vw, vh);
        renderer.setScissor(vx, vy, vw, vh);
        renderer.render(mirrorQuadScene, mirrorOrthoCam);
        renderer.setScissorTest(false);
        renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        renderer.autoClear = true;
      }
    }
  }

  function animate(now) {
    requestAnimationFrame(animate);
    const dt = Math.max(0.001, Math.min(0.05, (now - lastTime) / 1000));
    lastTime = now;
    update(dt);
    renderFrame();
  }
  requestAnimationFrame(animate);
})();
