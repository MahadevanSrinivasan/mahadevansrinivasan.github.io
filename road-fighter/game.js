/*
 * ROAD FIGHTER (Classic 1985 NES 8-Bit Edition)
 * Authentic 320x240 pixel-art vertical arcade racer:
 *  - 232x240 scanline-rendered scrolling highway + 88x240 classic NES black HUD
 *  - 4 iconic courses: Grassland, Ocean Bridge, Seashore, Mountain Pass (with stone tunnels)
 *  - 2-Gear transmission (LOW B / HIGH A), counter-steer skid recovery, 360° spin-out
 *  - Rainbow Fuel Cars, Oil Slicks, Water Puddles, Road Barriers, Semi-Trucks, Switchers & Pink Turbos
 *  - Caped Sky-Hero easter egg at 300+ km/h & 2A03 square/triangle/noise WebAudio synth
 */
(() => {
  'use strict';

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const W = 320;
  const H = 240;
  const PLAY_W = 232;
  const HUD_X = 232;
  const PLAYER_SCREEN_Y = 188;

  const urlParams = new URLSearchParams(window.location.search);
  const shotMode = urlParams.get('shot');
  if (shotMode) {
    document.body.classList.add('shot-mode');
  }

  // Authentic 1985 NES PPU Palette
  const PAL = {
    crimson: '#d82800',
    orange: '#fc9838',
    gold: '#f8b800',
    sand: '#f8d878',
    green: '#00a800',
    lightGreen: '#58d854',
    darkGreen: '#005800',
    blue: '#0058f8',
    cyan: '#3cbcfc',
    aqua: '#00e8d8',
    pink: '#f878f8',
    white: '#fcfcfc',
    lightGray: '#bcbcbc',
    gray: '#7c7c7c',
    darkGray: '#585858',
    asphalt: '#343434',
    asphaltDark: '#282828',
    tunnelRoad: '#1c1c1c',
    curbDark: '#181818',
    brown: '#885828',
    darkBrown: '#503000',
    black: '#000000'
  };

  function hexToU32(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0;
  }

  const U32 = {};
  Object.keys(PAL).forEach((k) => {
    U32[k] = hexToU32(PAL[k]);
  });

  const roadImgData = ctx.createImageData(PLAY_W, H);
  const roadBuf32 = new Uint32Array(roadImgData.data.buffer);

  // 5x7 Crisp NES Bitmap Font
  const FONT = {
    ' ': [0, 0, 0, 0, 0, 0, 0],
    '!': [4, 4, 4, 4, 4, 0, 4],
    '+': [0, 4, 4, 31, 4, 4, 0],
    '-': [0, 0, 0, 31, 0, 0, 0],
    '.': [0, 0, 0, 0, 0, 0, 4],
    '/': [1, 1, 2, 4, 8, 16, 16],
    ':': [0, 4, 4, 0, 4, 4, 0],
    '<': [2, 4, 8, 16, 8, 4, 2],
    '>': [8, 4, 2, 1, 2, 4, 8],
    '(': [2, 4, 8, 8, 8, 4, 2],
    ')': [8, 4, 2, 2, 2, 4, 8],
    '%': [25, 25, 2, 4, 8, 19, 19],
    '0': [14, 17, 19, 21, 25, 17, 14],
    '1': [4, 12, 4, 4, 4, 4, 14],
    '2': [14, 17, 1, 6, 8, 16, 31],
    '3': [31, 2, 4, 6, 1, 17, 14],
    '4': [2, 6, 10, 18, 31, 2, 2],
    '5': [31, 16, 30, 1, 1, 17, 14],
    '6': [6, 8, 16, 30, 17, 17, 14],
    '7': [31, 1, 2, 4, 8, 8, 8],
    '8': [14, 17, 17, 14, 17, 17, 14],
    '9': [14, 17, 17, 15, 1, 2, 12],
    'A': [14, 17, 17, 31, 17, 17, 17],
    'B': [30, 17, 17, 30, 17, 17, 30],
    'C': [14, 17, 16, 16, 16, 17, 14],
    'D': [28, 18, 17, 17, 17, 18, 28],
    'E': [31, 16, 16, 30, 16, 16, 31],
    'F': [31, 16, 16, 30, 16, 16, 16],
    'G': [14, 17, 16, 23, 17, 17, 15],
    'H': [17, 17, 17, 31, 17, 17, 17],
    'I': [14, 4, 4, 4, 4, 4, 14],
    'J': [7, 2, 2, 2, 2, 18, 12],
    'K': [17, 18, 20, 24, 20, 18, 17],
    'L': [16, 16, 16, 16, 16, 16, 31],
    'M': [17, 27, 21, 21, 17, 17, 17],
    'N': [17, 17, 25, 21, 19, 17, 17],
    'O': [14, 17, 17, 17, 17, 17, 14],
    'P': [30, 17, 17, 30, 16, 16, 16],
    'Q': [14, 17, 17, 17, 21, 18, 13],
    'R': [30, 17, 17, 30, 20, 18, 17],
    'S': [15, 16, 16, 14, 1, 1, 30],
    'T': [31, 4, 4, 4, 4, 4, 4],
    'U': [17, 17, 17, 17, 17, 17, 14],
    'V': [17, 17, 17, 17, 17, 10, 4],
    'W': [17, 17, 17, 21, 21, 21, 10],
    'X': [17, 17, 10, 4, 10, 17, 17],
    'Y': [17, 17, 17, 10, 4, 4, 4],
    'Z': [31, 1, 2, 4, 8, 16, 31]
  };

  function drawText(x, y, str, color = PAL.white, scale = 1) {
    ctx.fillStyle = color;
    let cx = Math.floor(x);
    const cy = Math.floor(y);
    const s = String(str).toUpperCase();
    for (let i = 0; i < s.length; i++) {
      const g = FONT[s[i]] || FONT[' '];
      for (let r = 0; r < 7; r++) {
        const row = g[r];
        if (!row) continue;
        for (let c = 0; c < 5; c++) {
          if (row & (1 << (4 - c))) {
            ctx.fillRect(cx + c * scale, cy + r * scale, scale, scale);
          }
        }
      }
      cx += 6 * scale;
    }
  }

  function drawShadowText(x, y, str, color = PAL.white, scale = 1, shadow = PAL.black) {
    drawText(x + scale, y + scale, str, shadow, scale);
    drawText(x, y, str, color, scale);
  }

  function textWidth(str, scale = 1) {
    return str.length * 6 * scale - scale;
  }

  // Pixel Sprite Baker (caches hand-crafted pixel grids to crisp offscreen canvases)
  function bakeSprite(rows, cmap) {
    const h = rows.length;
    const w = rows[0].length;
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const g = c.getContext('2d');
    g.imageSmoothingEnabled = false;
    for (let y = 0; y < h; y++) {
      const row = rows[y];
      for (let x = 0; x < w; x++) {
        const ch = row[x];
        if (ch !== '.' && cmap[ch]) {
          g.fillStyle = cmap[ch];
          g.fillRect(x, y, 1, 1);
        }
      }
    }
    return c;
  }

  // Hand-Crafted 14x22 Sports Car Pixel Template
  // Legend: R=body, D=dark/trim, S=racing stripe, W=windshield, G=glint, H=headlight, T=taillight, K=tire, J=tread
  function makeCarRows(treadPhase) {
    const tA = treadPhase ? 'K' : 'J';
    const tB = treadPhase ? 'J' : 'K';
    return [
      '....RRRRRR....',
      '...RHHSSSHR...',
      '..RRRRSSRRRR..',
      '..RRRRSSRRRR..',
      tA + 'KRRRRSSRRRRK' + tA,
      tB + 'KRRRRSSRRRRK' + tB,
      tA + 'KRRRRSSRRRRK' + tA,
      '..RRRRSSRRRR..',
      '..RRWWWWWRRR..',
      '..RWGWWWWWRR..',
      '..RWWWWWWWRR..',
      '..RRDDDDDDRR..',
      '..RRDRRRDRRR..',
      '..RRDDDDDDRR..',
      '..RRRRSSRRRR..',
      tA + 'KRRRRSSRRRRK' + tA,
      tB + 'KRRRRSSRRRRK' + tB,
      tA + 'KRRRRSSRRRRK' + tA,
      tB + 'KRRRRSSRRRRK' + tB,
      '.DDDDDDDDDDDD.',
      '..RRRRRRRRRR..',
      '...TT....TT...'
    ];
  }

  // Rainbow Fuel Car 14x22 Template with crisp 'F' in center
  function makeFuelCarRows() {
    return [
      '....AAAAAA....',
      '...AHHAAHHA...',
      '..AAAAAAAAAAAA'.slice(0, 14),
      '..BBBBBBBBBB..',
      'KKBBBBBBBBBBKK',
      'KKBBBBBBBBBBKK',
      'KKCCCCCCCCCCKK',
      '..CCCCCCCCCC..',
      '..CCWWWWWWCC..',
      '..CCWWWWWWCC..',
      '..DDDFFFFDDD..',
      '..DDDFDDDDDD..',
      '..DDDFFFDDDD..',
      '..EEEFEEEEEE..',
      '..EEEFEEEEEE..',
      'KKEEEEEEEEEEKK',
      'KKAAAAAAAAAAKK',
      'KKAAAAAAAAAAKK',
      'KKBBBBBBBBBBKK',
      '.DDDDDDDDDDDD.',
      '..CCCCCCCCCC..',
      '...TT....TT...'
    ];
  }

  // Heavy 18x36 18-Wheeler Semi-Truck Template
  const TRUCK_ROWS = [
    '....CCCCCCCCCC....',
    '...CHHCCCCCCCHH...',
    '..CCCCCCCCCCCCCC..',
    'KKCCCCCCCCCCCCCCKK',
    'KKCWWWWWWWWWWWWCKK',
    'KKCWGWWWWWWWWWWCKK',
    'KKCCCCCCCCCCCCCCKK',
    '..CCCDDDDDDDDCCC..',
    '..CCCCCCCCCCCCCC..',
    '...CCCCCCCCCCCC...',
    '.....BBBBBBBB.....',
    '.....KKKKKKKK.....',
    '..LLLLLLLLLLLLLL..',
    '..LGGGGGGGGGGGGL..',
    '..LLLLLLLLLLLLLL..',
    '..LLBBBBBBBBBBLL..',
    '..LLGGGGGGGGGGLL..',
    '..LLLLLLLLLLLLLL..',
    '..LLBBBBBBBBBBLL..',
    '..LLGGGGGGGGGGLL..',
    '..LLLLLLLLLLLLLL..',
    '..LLBBBBBBBBBBLL..',
    '..LLGGGGGGGGGGLL..',
    '..LLLLLLLLLLLLLL..',
    '.KLLBBBBBBBBBBLLK.',
    'KKLLGGGGGGGGGGLLKK',
    'KKLLLLLLLLLLLLLLKK',
    'KKLLBBBBBBBBBBLLKK',
    'KKLLGGGGGGGGGGLLKK',
    'KKLLLLLLLLLLLLLLKK',
    '.KLLLLLLLLLLLLLLK.',
    '..DDDDDDDDDDDDDD..',
    '..BBBBBBBBBBBBBB..',
    '...TT........TT...',
    '...MM........MM...',
    '...MM........MM...'
  ];

  // Caped Sky-Hero 14x22 Pixel Sprite (soaring upward)
  const SKY_HERO_ROWS = [
    '..BB......BB..',
    '..BB..SS..BB..',
    '..BB.SSSS.BB..',
    '...BBBBBBBB...',
    '...BBBBBBBB...',
    '..RBBBBBBBBR..',
    '.RRBBBBBBBBRR.',
    '.RRRBBBBBBBRRR',
    '.RRRRBBBBBRRRR',
    'RRRRGGGGGGGRRR',
    'RRRRRBBBBBRRRR',
    'RRRRRBBBBBRRRR',
    '.RRRRBBBBBRRRR',
    '.RRRRBB.BBRRRR',
    '.RRRRBB.BBRRRR',
    '..RRRGG.GGRRR.',
    '..RRRGG.GGRRR.',
    '...RRGG.GGRR..',
    '...RRGG.GGRR..',
    '....RGG.GGR...',
    '.....G...G....',
    '..............'
  ];

  // Scenery & Hazard Pixel Sprites
  const OAK_TREE_ROWS = [
    '.....GGGGGG.....',
    '...GGLLLLLLGG...',
    '..GLLLLLLLLLLG..',
    '.GLLLGGLLGGLLLG.',
    'GGLLGGGGGGGGLLGG',
    'GGGGGGGGGGGGGGGG',
    'GGDDGGGGGGGGDDGG',
    'GDDDDGGDDGGDDDDG',
    '.DDDDDDDDDDDDDD.',
    '..DDDDTTTTDDDD..',
    '...DDDTTTTDDD...',
    '......TTTT......',
    '......TTTT......',
    '......TBBT......',
    '......TBBT......',
    '.....BBBBBB.....',
    '....SSSSSSSS....',
    '................'
  ];

  const PINE_TREE_ROWS = [
    '......GG......',
    '.....GLLG.....',
    '....GLLLLG....',
    '....GGGGGG....',
    '...GGLLLLGG...',
    '..GGLGGGGLLG..',
    '..GGGGGGGGGG..',
    '.GGDDGGGGDDGG.',
    '.DDDDGGGGDDDD.',
    'GGDDDDGGDDDDGG',
    'GDDDDDDDDDDDDG',
    '.DDDDDDDDDDDD.',
    '.....TTTT.....',
    '.....TTTT.....',
    '.....TBBT.....',
    '....BBBBBB....',
    '...SSSSSSSS...',
    '..............'
  ];

  const PALM_TREE_ROWS = [
    '..GG........GG..',
    '.GLLGG....GGLLG.',
    'GGLLLLGGGGLLLLGG',
    '.GGGGLLGGLLGGGG.',
    '...GGOOOOOOGG...',
    '..G.GOOOOOOG.G..',
    '......TTTT......',
    '.....TTTT.......',
    '.....TTT........',
    '....TTT.........',
    '....TTT.........',
    '...TTT..........',
    '...TTT..........',
    '...TTT..........',
    '....TTT.........',
    '....TTT.........',
    '.....TTT........',
    '....TTTTT.......',
    '...SSSSSSS......',
    '................'
  ];

  const OIL_SLICK_ROWS = [
    '....KKKKKKKK....',
    '..KKPPPPKKKKKK..',
    '.KKKPPCCKKKKBKK.',
    'KKKKKKCCKKBBBBKK',
    'KKBKKKKKKKKKKPPK',
    'KKBBBKKKKKKCCPPK',
    '.KKBBKKKKKCCKKK.',
    '..KKKKKKKKKKKK..',
    '....KKKKKKKK....',
    '......KKKK......'
  ];

  const PUDDLE_ROWS = [
    '....BBBBBBBB....',
    '..BBCCCCCCCCBB..',
    '.BBCCWWCCCCCCBB.',
    'BBCCWWCCCCCCCCBB',
    'BBCBBBBBBBBCCCBB',
    'BBBBCCCCCCCCBBBB',
    '.BBCCCCCCWWCCBB.',
    '..BBCCCCCCCCBB..',
    '....BBBBBBBB....',
    '......BBBB......'
  ];

  const BARRIER_ROWS = [
    '..RR............RR..',
    '.ROOR..........ROOR.',
    'WWWWOOOOWWWWOOOOWWWW',
    'WWWOOOOWWWWOOOOWWWWW',
    'WWOOOOWWWWOOOOWWWWOO',
    'WOOOOWWWWOOOOWWWWOOO',
    'KKKKKKKKKKKKKKKKKKKK',
    '..GG............GG..',
    '..GG............GG..',
    '..KK............KK..'
  ];

  const SPR = {};
  function initSprites() {
    SPR.player = [
      bakeSprite(makeCarRows(0), {
        R: PAL.crimson, D: '#901800', S: PAL.orange, W: PAL.cyan, G: PAL.white,
        H: PAL.sand, T: PAL.gold, K: PAL.black, J: PAL.darkGray
      }),
      bakeSprite(makeCarRows(1), {
        R: PAL.crimson, D: '#901800', S: PAL.orange, W: PAL.cyan, G: PAL.white,
        H: PAL.sand, T: PAL.gold, K: PAL.black, J: PAL.darkGray
      })
    ];
    SPR.yellow = [0, 1].map((p) =>
      bakeSprite(makeCarRows(p), {
        R: PAL.gold, D: '#b07800', S: PAL.white, W: PAL.cyan, G: PAL.white,
        H: PAL.white, T: PAL.crimson, K: PAL.black, J: PAL.darkGray
      })
    );
    SPR.blue = [0, 1].map((p) =>
      bakeSprite(makeCarRows(p), {
        R: PAL.blue, D: '#003098', S: PAL.cyan, W: PAL.white, G: PAL.cyan,
        H: PAL.sand, T: PAL.crimson, K: PAL.black, J: PAL.darkGray
      })
    );
    SPR.pink = [0, 1].map((p) =>
      bakeSprite(makeCarRows(p), {
        R: PAL.pink, D: '#b030b0', S: PAL.crimson, W: PAL.white, G: PAL.cyan,
        H: PAL.white, T: PAL.gold, K: PAL.black, J: PAL.darkGray
      })
    );

    const fuelPalettes = [
      { A: PAL.crimson, B: PAL.sand, C: PAL.aqua, D: PAL.pink, E: PAL.lightGreen },
      { A: PAL.sand, B: PAL.aqua, C: PAL.pink, D: PAL.lightGreen, E: PAL.crimson },
      { A: PAL.aqua, B: PAL.pink, C: PAL.lightGreen, D: PAL.crimson, E: PAL.sand },
      { A: PAL.pink, B: PAL.lightGreen, C: PAL.crimson, D: PAL.sand, E: PAL.aqua }
    ];
    const fuelRows = makeFuelCarRows();
    SPR.fuel = fuelPalettes.map((fp) =>
      bakeSprite(fuelRows, {
        ...fp,
        W: PAL.blue, F: PAL.white, H: PAL.white, T: PAL.gold, K: PAL.black
      })
    );

    SPR.truck = bakeSprite(TRUCK_ROWS, {
      C: PAL.crimson, H: PAL.sand, W: PAL.cyan, G: PAL.white, D: PAL.darkGray,
      B: PAL.gray, K: PAL.black, L: PAL.lightGray, T: PAL.gold, M: PAL.curbDark
    });

    SPR.skyHero = bakeSprite(SKY_HERO_ROWS, {
      B: PAL.blue, S: PAL.sand, R: PAL.crimson, G: PAL.gold
    });

    SPR.oak = bakeSprite(OAK_TREE_ROWS, {
      G: PAL.green, L: PAL.lightGreen, D: PAL.darkGreen, T: PAL.brown, B: PAL.darkBrown, S: PAL.curbDark
    });
    SPR.pine = bakeSprite(PINE_TREE_ROWS, {
      G: PAL.green, L: PAL.lightGreen, D: PAL.darkGreen, T: PAL.brown, B: PAL.darkBrown, S: PAL.curbDark
    });
    SPR.palm = bakeSprite(PALM_TREE_ROWS, {
      G: PAL.green, L: PAL.lightGreen, O: PAL.darkBrown, T: PAL.brown, S: PAL.brown
    });
    SPR.oil = bakeSprite(OIL_SLICK_ROWS, {
      K: PAL.black, P: PAL.pink, C: PAL.aqua, B: PAL.darkBrown
    });
    SPR.water = bakeSprite(PUDDLE_ROWS, {
      B: PAL.blue, C: PAL.cyan, W: PAL.white
    });
    SPR.barrier = bakeSprite(BARRIER_ROWS, {
      R: PAL.crimson, O: PAL.orange, W: PAL.white, K: PAL.black, G: PAL.gray
    });
  }

  // 8-Bit NES 2A03 Audio Synthesizer (Square + Triangle + Noise)
  let audioCtx = null;
  let audioMuted = false;
  let engOsc = null;
  let engSubOsc = null;
  let engGain = null;
  let engSubGain = null;

  function initAudio() {
    if (audioCtx || shotMode) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AC();
      engOsc = audioCtx.createOscillator();
      engSubOsc = audioCtx.createOscillator();
      engGain = audioCtx.createGain();
      engSubGain = audioCtx.createGain();

      engOsc.type = 'square';
      engOsc.frequency.value = 60;
      engGain.gain.value = 0;

      engSubOsc.type = 'triangle';
      engSubOsc.frequency.value = 30;
      engSubGain.gain.value = 0;

      engOsc.connect(engGain);
      engGain.connect(audioCtx.destination);
      engSubOsc.connect(engSubGain);
      engSubGain.connect(audioCtx.destination);
      engOsc.start();
      engSubOsc.start();
    } catch (e) {}
  }

  function updateEngineAudio(speed, gear, active) {
    if (!audioCtx || !engGain || !engSubGain) return;
    if (audioMuted || !active || speed < 5) {
      engGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.03);
      engSubGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.03);
      return;
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const baseFreq = gear === 'HIGH' ? 68 + (speed / 400) * 145 : 52 + (speed / 200) * 95;
    engOsc.frequency.setTargetAtTime(baseFreq, audioCtx.currentTime, 0.025);
    engSubOsc.frequency.setTargetAtTime(baseFreq * 0.5, audioCtx.currentTime, 0.025);
    engGain.gain.setTargetAtTime(gear === 'HIGH' ? 0.042 : 0.03, audioCtx.currentTime, 0.03);
    engSubGain.gain.setTargetAtTime(0.055, audioCtx.currentTime, 0.03);
  }

  function playTone(freq, dur, type = 'square', vol = 0.08, delay = 0) {
    if (audioMuted || shotMode) return;
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const t = audioCtx.currentTime + delay;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start(t);
    o.stop(t + dur);
  }

  function playNoiseBurst(dur, vol = 0.11) {
    if (audioMuted || shotMode) return;
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const len = Math.floor(audioCtx.sampleRate * dur);
    const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    }
    const src = audioCtx.createBufferSource();
    const g = audioCtx.createGain();
    src.buffer = buf;
    g.gain.setValueAtTime(vol, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    src.connect(g);
    g.connect(audioCtx.destination);
    src.start();
  }

  function playJingle(notes, type = 'square', vol = 0.075) {
    if (audioMuted || shotMode) return;
    let offset = 0;
    for (let i = 0; i < notes.length; i++) {
      const [f, d] = notes[i];
      if (f > 0) playTone(f, d * 0.9, type, vol, offset);
      offset += d;
    }
  }

  function sfxStartFanfare() {
    // Classic 6-note NES Road Fighter grid fanfare
    playJingle([
      [392, 0.14], [392, 0.14], [392, 0.14],
      [523.25, 0.22], [392, 0.14], [659.25, 0.42]
    ]);
  }

  function sfxFuelPickup() {
    playJingle([[523.25, 0.06], [659.25, 0.06], [783.99, 0.06], [1046.5, 0.14]]);
  }

  function sfxSkyHero() {
    playJingle([
      [523.25, 0.08], [659.25, 0.08], [783.99, 0.08],
      [1046.5, 0.14], [783.99, 0.08], [1046.5, 0.26]
    ]);
  }

  function sfxSave() {
    playJingle([[587.33, 0.07], [880, 0.13]]);
  }

  function sfxSkid() {
    playTone(920, 0.08, 'sawtooth', 0.05);
    playTone(760, 0.09, 'sawtooth', 0.05, 0.07);
  }

  function sfxSplash() {
    playNoiseBurst(0.18, 0.09);
    playTone(320, 0.12, 'triangle', 0.06);
  }

  function sfxSpinout() {
    playNoiseBurst(0.32, 0.14);
    playTone(180, 0.28, 'sawtooth', 0.07);
  }

  function sfxGoalFanfare() {
    playJingle([
      [523.25, 0.1], [659.25, 0.1], [783.99, 0.1], [1046.5, 0.18],
      [783.99, 0.1], [1046.5, 0.36]
    ]);
  }

  // Courses Definition
  const COURSES = [
    { id: 1, name: 'GRASSLAND', short: 'GRASS', len: 9500, halfW: 70 },
    { id: 2, name: 'OCEAN BRIDGE', short: 'BRIDGE', len: 10500, halfW: 62 },
    { id: 3, name: 'SEASHORE', short: 'BEACH', len: 11200, halfW: 60 },
    { id: 4, name: 'MOUNTAIN PASS', short: 'MOUNT', len: 12000, halfW: 54 }
  ];

  // Stone Tunnel Intervals on Course 4
  const C4_TUNNELS = [
    [2800, 3650],
    [7400, 8300]
  ];

  function isInTunnel(worldY, courseId) {
    if (courseId !== 4) return false;
    for (let i = 0; i < C4_TUNNELS.length; i++) {
      if (worldY >= C4_TUNNELS[i][0] && worldY <= C4_TUNNELS[i][1]) return true;
    }
    return false;
  }

  // Smooth fade near START (0..260) and GOAL (len-300..len)
  function endStraightFactor(worldY, len) {
    let f = 1;
    if (worldY < 260) f = Math.min(f, Math.max(0, (worldY - 60) / 200));
    if (worldY > len - 300) f = Math.min(f, Math.max(0, (len - 60 - worldY) / 240));
    return f;
  }

  function roadCenterX(worldY, courseId) {
    const course = COURSES[courseId - 1];
    const blend = endStraightFactor(worldY, course.len);
    let offset = 0;
    if (courseId === 1) {
      offset = Math.sin(worldY * 0.0022) * 24 + Math.sin(worldY * 0.00095) * 10;
    } else if (courseId === 2) {
      offset = Math.sin(worldY * 0.0017) * 18 + Math.cos(worldY * 0.0008) * 8;
    } else if (courseId === 3) {
      offset = Math.sin(worldY * 0.0025) * 26 + Math.sin(worldY * 0.0012 + 1.1) * 10;
    } else {
      offset = Math.sin(worldY * 0.0031) * 28 + Math.cos(worldY * 0.0016) * 12;
    }
    return 116 + offset * blend;
  }

  function roadHalfWidth(worldY, courseId) {
    const course = COURSES[courseId - 1];
    if (courseId === 2) {
      const blend = endStraightFactor(worldY, course.len);
      // Bottleneck bridge spans narrow smoothly down to 50px
      const pinchA = Math.exp(-Math.pow((worldY - 3400) / 560, 2));
      const pinchB = Math.exp(-Math.pow((worldY - 6200) / 680, 2));
      const pinchC = Math.exp(-Math.pow((worldY - 8700) / 520, 2));
      const narrow = Math.max(pinchA, pinchB, pinchC) * 12 * blend;
      return Math.round(course.halfW - narrow);
    }
    return course.halfW;
  }

  // Deterministic Seeded PRNG
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // High Score Persistence
  let hiScore = 50000;
  try {
    const saved = parseInt(localStorage.getItem('roadFighterHiScore') || '50000', 10);
    if (!Number.isNaN(saved) && saved >= 50000) hiScore = saved;
  } catch (e) {}

  function saveHiScore() {
    try {
      localStorage.setItem('roadFighterHiScore', String(hiScore));
    } catch (e) {}
  }

  // Global Game State
  let state = 'title'; // 'title', 'grid', 'racing', 'clear', 'victory', 'gameover'
  let courseId = 1;
  let level = 1; // 1 = Arcade, 2 = Pro
  let tick = 0;
  let stateTimer = 0;
  let lowFuelBeepTimer = 0;

  const player = {
    x: 116,
    dist: 60,
    speed: 0, // 0..400 km/h
    gear: 'LOW',
    fuel: 100,
    score: 0,
    crashes: 0,
    skidTimer: 0,
    skidDir: 0, // -1 sliding left, +1 sliding right
    skidHoldOk: 0,
    spinTimer: 0,
    invulnTimer: 0,
    highSpeedTime: 0,
    skyHeroCooldown: 0
  };

  let entities = [];
  let scenery = [];
  let particles = [];
  let popups = [];
  let skyHero = { active: false, x: 16, y: H + 30 };

  function addPopup(x, y, text, color = PAL.white, dur = 1.2) {
    popups.push({ x, y, text, color, life: dur, maxLife: dur });
  }

  function addSparkles(x, y, colors, count = 12) {
    for (let i = 0; i < count; i++) {
      const ang = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const spd = 25 + Math.random() * 65;
      particles.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 15,
        color: colors[i % colors.length],
        life: 0.45 + Math.random() * 0.25,
        size: Math.random() > 0.5 ? 2 : 1
      });
    }
  }

  function buildCourseEntities(cid, lvl) {
    entities = [];
    scenery = [];
    const course = COURSES[cid - 1];
    const rng = mulberry32(cid * 4099 + lvl * 173);

    // 1. Place 5 generous Rainbow Fuel Cars evenly spaced
    const fuelFracs = [0.16, 0.34, 0.52, 0.70, 0.86];
    fuelFracs.forEach((f, idx) => {
      const d = Math.floor(course.len * f);
      const hw = roadHalfWidth(d, cid) - 16;
      const laneOff = (idx % 2 === 0 ? -1 : 1) * (12 + rng() * (hw - 16));
      entities.push({
        kind: 'fuel',
        dist: d,
        laneOff,
        speed: 180,
        w: 14,
        h: 22,
        collected: false
      });
    });

    // 2. Traffic & Hazards along the highway
    const gapBase = lvl === 1 ? 175 : 145;
    let d = 420;
    while (d < course.len - 280) {
      const hw = roadHalfWidth(d, cid) - 14;
      const lanes = [-hw * 0.65, -hw * 0.22, hw * 0.22, hw * 0.65];
      const laneIdx = Math.floor(rng() * lanes.length);
      const roll = rng();

      if (roll < 0.34) {
        entities.push({
          kind: 'yellow',
          dist: d,
          laneOff: lanes[laneIdx],
          speed: 175 + rng() * 35,
          w: 14,
          h: 22
        });
      } else if (roll < 0.58) {
        const targetLane = Math.max(0, Math.min(3, laneIdx + (laneIdx < 2 ? 1 : -1)));
        entities.push({
          kind: 'blue',
          dist: d,
          laneOff: lanes[laneIdx],
          targetOff: lanes[targetLane],
          speed: 185 + rng() * 30,
          w: 14,
          h: 22,
          switchState: 0, // 0=idle, 1=blinking, 2=switching, 3=done
          switchTimer: 0
        });
      } else if (roll < 0.72 && (cid >= 2 || lvl === 2)) {
        entities.push({
          kind: 'pink',
          dist: d,
          laneOff: lanes[laneIdx],
          speed: 220 + rng() * 35,
          w: 14,
          h: 22
        });
      } else if (roll < 0.83) {
        entities.push({
          kind: 'truck',
          dist: d,
          laneOff: lanes[laneIdx] * 0.85,
          speed: 145 + rng() * 15,
          w: 18,
          h: 36
        });
      } else if (roll < 0.90) {
        entities.push({
          kind: 'oil',
          dist: d,
          laneOff: lanes[laneIdx],
          speed: 0,
          w: 16,
          h: 10
        });
      } else if (roll < 0.96) {
        entities.push({
          kind: 'water',
          dist: d,
          laneOff: lanes[laneIdx],
          speed: 0,
          w: 18,
          h: 10
        });
      } else {
        entities.push({
          kind: 'barrier',
          dist: d,
          laneOff: lanes[laneIdx] * 0.8,
          speed: 0,
          w: 20,
          h: 10
        });
      }

      d += gapBase + rng() * (lvl === 1 ? 120 : 95);
    }

    // 3. Roadside Trees & Props
    if (cid !== 2) {
      for (let sd = 140; sd < course.len + 200; sd += 95) {
        if (cid === 4 && isInTunnel(sd, cid)) continue;
        const cx = roadCenterX(sd, cid);
        const hw = roadHalfWidth(sd, cid);
        // Left shoulder prop
        if (cx - hw - 18 > 4) {
          const lx = Math.max(8, cx - hw - 14 - rng() * Math.max(4, cx - hw - 24));
          scenery.push({
            dist: sd + rng() * 35,
            x: lx,
            type: cid === 1 ? 'oak' : cid === 3 ? 'palm' : 'pine'
          });
        }
        // Right shoulder prop (Courses 1 & 4; Course 3 has ocean on right)
        if (cid === 1 || cid === 4) {
          const rEdge = cx + hw + 14;
          if (rEdge < PLAY_W - 10) {
            const rx = Math.min(PLAY_W - 10, rEdge + rng() * Math.max(4, PLAY_W - rEdge - 14));
            scenery.push({
              dist: sd + 45 + rng() * 30,
              x: rx,
              type: cid === 1 ? 'oak' : 'pine'
            });
          }
        }
      }
    }
  }

  function startCourse(cid, keepScore = false) {
    courseId = cid;
    if (!keepScore) {
      player.score = 0;
    }
    player.dist = 60;
    player.x = roadCenterX(60, courseId);
    player.speed = 0;
    player.gear = 'LOW';
    player.fuel = 100;
    player.crashes = 0;
    player.skidTimer = 0;
    player.skidDir = 0;
    player.skidHoldOk = 0;
    player.spinTimer = 0;
    player.invulnTimer = 0;
    player.highSpeedTime = 0;
    player.skyHeroCooldown = 0;

    particles = [];
    popups = [];
    skyHero = { active: false, x: 16, y: H + 30 };

    buildCourseEntities(courseId, level);
    state = 'grid';
    stateTimer = 2.0;
    syncTopbar();
    sfxStartFanfare();
  }

  function setupTitleDemo() {
    state = 'title';
    courseId = 1;
    player.dist = 1200;
    player.x = roadCenterX(1200, 1);
    player.speed = 260;
    player.gear = 'HIGH';
    player.fuel = 100;
    player.skidTimer = 0;
    player.spinTimer = 0;
    particles = [];
    popups = [];
    skyHero.active = false;
    buildCourseEntities(1, level);
    syncTopbar();
  }

  // Deterministic ?shot= States for Headless Chromium Verification
  function applyShotPreset(name) {
    tick = 18;
    if (name === 'title') {
      courseId = 1;
      level = 1;
      hiScore = 50000;
      state = 'title';
      player.dist = 1280;
      player.x = roadCenterX(1280, 1) - 18;
      player.speed = 280;
      player.gear = 'HIGH';
      player.fuel = 100;
      player.score = 0;
      buildCourseEntities(1, 1);
      // Place clean visible demo cars on highway below banner
      entities = [
        { kind: 'yellow', dist: 1410, laneOff: 26, speed: 190, w: 14, h: 22 },
        { kind: 'blue', dist: 1355, laneOff: -30, speed: 200, w: 14, h: 22, switchState: 0 },
        { kind: 'fuel', dist: 1445, laneOff: -8, speed: 180, w: 14, h: 22, collected: false }
      ];
      return;
    }

    if (name === 'course1') {
      courseId = 1;
      level = 1;
      state = 'racing';
      hiScore = 50000;
      const d = Math.floor(COURSES[0].len * 0.34); // 3230
      player.dist = d;
      const cx = roadCenterX(d, 1);
      player.x = cx - 16;
      player.speed = 372;
      player.gear = 'HIGH';
      player.fuel = 84;
      player.score = 14850;
      player.skidTimer = 0;
      player.spinTimer = 0;
      buildCourseEntities(1, 1);
      entities = entities.filter((e) => Math.abs(e.dist - d) > 260);
      entities.push(
        { kind: 'yellow', dist: d + 48, laneOff: 24, speed: 190, w: 14, h: 22 },
        { kind: 'blue', dist: d + 86, laneOff: -28, targetOff: 0, speed: 200, w: 14, h: 22, switchState: 1, switchTimer: 0.2 },
        { kind: 'fuel', dist: d + 128, laneOff: 8, speed: 180, w: 14, h: 22, collected: false },
        { kind: 'oil', dist: d + 105, laneOff: -12, speed: 0, w: 16, h: 10 }
      );
      return;
    }

    if (name === 'course2') {
      courseId = 2;
      level = 1;
      state = 'racing';
      hiScore = 50000;
      const d = Math.floor(COURSES[1].len * 0.58); // 6090 (right in bridge bottleneck!)
      player.dist = d;
      const cx = roadCenterX(d, 2);
      player.x = cx + 10;
      player.speed = 396;
      player.gear = 'HIGH';
      player.fuel = 71;
      player.score = 32400;
      player.skidTimer = 0;
      player.spinTimer = 0;
      buildCourseEntities(2, 1);
      entities = entities.filter((e) => Math.abs(e.dist - d) > 260);
      entities.push(
        { kind: 'pink', dist: d + 84, laneOff: 16, speed: 235, w: 14, h: 22 },
        { kind: 'truck', dist: d + 136, laneOff: -18, speed: 150, w: 18, h: 36 }
      );
      skyHero = { active: true, x: 15, y: 122 };
      addPopup(6, 98, 'SKY HERO +2000!', PAL.gold, 1.5);
    }
  }

  // Input Handling (Keyboard + Touch + Gamepad)
  const keys = {};
  const prevKeys = {};
  const touchState = { left: false, right: false, low: false, high: false };
  let touchVisible = false;

  function justPressed(code) {
    return !!keys[code] && !prevKeys[code];
  }

  window.addEventListener('keydown', (e) => {
    initAudio();
    keys[e.code] = true;
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }
    if (e.code === 'KeyM') {
      toggleMute();
    }
    if (e.code === 'Escape' && state !== 'title') {
      setupTitleDemo();
    }
  });

  window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
  });

  // Topbar Buttons
  const btnCourses = [1, 2, 3, 4].map((i) => document.getElementById(`btn-c${i}`));
  const btnLvl = document.getElementById('btn-lvl');
  const btnMute = document.getElementById('btn-mute');
  const btnRestart = document.getElementById('btn-restart');
  const btnTouch = document.getElementById('btn-touch');
  const touchOverlay = document.getElementById('touch-overlay');

  function syncTopbar() {
    btnCourses.forEach((b, idx) => {
      if (b) b.classList.toggle('active', courseId === idx + 1);
    });
    if (btnLvl) {
      btnLvl.textContent = level === 1 ? 'LVL 1' : 'LVL 2';
      btnLvl.classList.toggle('lvl-pro', level === 2);
    }
    if (btnMute) {
      btnMute.textContent = audioMuted ? '🔇 MUTE' : '🔊 SFX';
      btnMute.classList.toggle('active', audioMuted);
    }
    if (btnTouch) {
      btnTouch.classList.toggle('active', touchVisible);
    }
  }

  function toggleMute() {
    audioMuted = !audioMuted;
    if (audioMuted) updateEngineAudio(0, 'LOW', false);
    syncTopbar();
  }

  btnCourses.forEach((b, idx) => {
    if (!b) return;
    b.addEventListener('click', () => {
      initAudio();
      startCourse(idx + 1, false);
      b.blur();
    });
  });

  if (btnLvl) {
    btnLvl.addEventListener('click', () => {
      initAudio();
      level = level === 1 ? 2 : 1;
      if (state === 'racing' || state === 'grid') {
        startCourse(courseId, false);
      } else {
        syncTopbar();
      }
      btnLvl.blur();
    });
  }

  if (btnMute) {
    btnMute.addEventListener('click', () => {
      initAudio();
      toggleMute();
      btnMute.blur();
    });
  }

  if (btnRestart) {
    btnRestart.addEventListener('click', () => {
      initAudio();
      startCourse(courseId, false);
      btnRestart.blur();
    });
  }

  if (btnTouch) {
    btnTouch.addEventListener('click', () => {
      touchVisible = !touchVisible;
      touchOverlay.classList.toggle('visible', touchVisible);
      syncTopbar();
      btnTouch.blur();
    });
  }

  // Auto-enable touch pad on touch devices unless ?shot=
  if (!shotMode && window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
    touchVisible = true;
    touchOverlay.classList.add('visible');
  }

  // Mobile Touch Overlay Bindings
  document.querySelectorAll('#touch-overlay .tbtn').forEach((el) => {
    const act = el.dataset.act;
    const setAct = (down) => {
      touchState[act] = down;
      el.classList.toggle('pressed', down);
    };
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      initAudio();
      if (state === 'title') startCourse(courseId, false);
      else if (state === 'gameover' || state === 'victory') startCourse(state === 'victory' ? 1 : courseId, false);
      setAct(true);
    });
    el.addEventListener('pointerup', (e) => {
      e.preventDefault();
      setAct(false);
    });
    el.addEventListener('pointercancel', () => setAct(false));
    el.addEventListener('pointerleave', () => setAct(false));
  });

  canvas.addEventListener('pointerdown', () => {
    initAudio();
    if (state === 'title') {
      startCourse(courseId, false);
    } else if (state === 'gameover') {
      startCourse(courseId, false);
    } else if (state === 'victory') {
      startCourse(1, false);
    }
  });

  function readInput() {
    let left = keys.ArrowLeft || keys.KeyA || touchState.left;
    let right = keys.ArrowRight || keys.KeyD || touchState.right;
    let low = keys.KeyZ || keys.ShiftLeft || keys.ShiftRight || touchState.low;
    let high = keys.KeyX || keys.Space || keys.ArrowUp || keys.KeyW || touchState.high;
    let brake = keys.ArrowDown || keys.KeyS;
    let start = justPressed('Enter') || justPressed('Space');

    if (navigator.getGamepads) {
      const pads = navigator.getGamepads();
      for (let i = 0; i < pads.length; i++) {
        const gp = pads[i];
        if (!gp) continue;
        if (gp.axes[0] < -0.35 || gp.buttons[14]?.pressed) left = true;
        if (gp.axes[0] > 0.35 || gp.buttons[15]?.pressed) right = true;
        if (gp.buttons[1]?.pressed || gp.buttons[2]?.pressed) low = true;  // B / X
        if (gp.buttons[0]?.pressed || gp.buttons[3]?.pressed) high = true; // A / Y
        if (gp.buttons[13]?.pressed) brake = true;
        if (gp.buttons[9]?.pressed) start = true;
      }
    }
    return { left, right, low, high, brake, start };
  }

  function awardScore(pts) {
    player.score += pts;
    if (player.score > hiScore) {
      hiScore = player.score;
      saveHiScore();
    }
  }

  function triggerSpinout() {
    if (player.spinTimer > 0 || player.invulnTimer > 0) return;
    player.spinTimer = 0.95;
    player.skidTimer = 0;
    player.skidDir = 0;
    player.highSpeedTime = 0;
    player.crashes++;
    const penalty = level === 1 ? 6 : 9;
    player.fuel = Math.max(0, player.fuel - penalty);
    player.speed = Math.min(player.speed, 130);
    addSparkles(player.x, PLAYER_SCREEN_Y, [PAL.gold, PAL.white, PAL.orange, PAL.crimson], 14);
    addPopup(Math.max(24, Math.min(165, player.x - 16)), PLAYER_SCREEN_Y - 22, `-${penalty} FUEL!`, PAL.crimson, 0.95);
    sfxSpinout();
  }

  function triggerSkid(dir) {
    if (player.spinTimer > 0 || player.skidTimer > 0 || player.invulnTimer > 0) return;
    player.skidDir = dir; // +1 = sliding right (must steer left <), -1 = sliding left (must steer right >)
    player.skidTimer = level === 1 ? 0.50 : 0.34;
    player.skidHoldOk = 0;
    player.highSpeedTime = 0;
    sfxSkid();
  }

  // Main Simulation Step
  function update(dt) {
    if (shotMode) return;
    tick++;
    const inp = readInput();

    // Update floating popups & particles
    for (let i = popups.length - 1; i >= 0; i--) {
      popups[i].y -= 18 * dt;
      popups[i].life -= dt;
      if (popups[i].life <= 0) popups.splice(i, 1);
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) particles.splice(i, 1);
    }

    if (state === 'title') {
      updateEngineAudio(0, 'LOW', false);
      if (justPressed('ArrowUp') || justPressed('KeyW')) {
        level = level === 1 ? 2 : 1;
        playTone(660, 0.06);
        syncTopbar();
      }
      if (justPressed('ArrowDown') || justPressed('KeyS')) {
        level = level === 1 ? 2 : 1;
        playTone(660, 0.06);
        syncTopbar();
      }
      if (justPressed('ArrowLeft') || justPressed('KeyA')) {
        courseId = courseId === 1 ? 4 : courseId - 1;
        buildCourseEntities(courseId, level);
        playTone(520, 0.06);
        syncTopbar();
      }
      if (justPressed('ArrowRight') || justPressed('KeyD')) {
        courseId = courseId === 4 ? 1 : courseId + 1;
        buildCourseEntities(courseId, level);
        playTone(520, 0.06);
        syncTopbar();
      }
      if (inp.start) {
        startCourse(courseId, false);
        return;
      }
      // Demo highway scroll
      player.dist += 150 * dt;
      if (player.dist > COURSES[courseId - 1].len - 600) player.dist = 400;
      player.x = roadCenterX(player.dist, courseId) + Math.sin(tick * 0.025) * 18;
      return;
    }

    if (state === 'grid') {
      updateEngineAudio(0, 'LOW', false);
      stateTimer -= dt;
      if (stateTimer <= 0) {
        state = 'racing';
        addPopup(94, 96, 'GO!', PAL.lightGreen, 0.75);
        playTone(880, 0.22);
      }
      return;
    }

    if (state === 'clear') {
      updateEngineAudio(0, 'LOW', false);
      stateTimer -= dt;
      if (stateTimer <= 0 || (stateTimer < 2.2 && inp.start)) {
        if (courseId < 4) {
          startCourse(courseId + 1, true);
        } else {
          state = 'victory';
          stateTimer = 0.5;
        }
      }
      return;
    }

    if (state === 'victory' || state === 'gameover') {
      updateEngineAudio(0, 'LOW', false);
      stateTimer -= dt;
      if (stateTimer <= 0 && inp.start) {
        startCourse(state === 'victory' ? 1 : courseId, false);
      }
      return;
    }

    // --- RACING STATE ---
    const course = COURSES[courseId - 1];

    // Sky-Hero upward flight
    if (skyHero.active) {
      skyHero.y -= 148 * dt;
      if (tick % 3 === 0) {
        particles.push({
          x: skyHero.x + 6 + (Math.random() * 4 - 2),
          y: skyHero.y + 18,
          vx: 0,
          vy: 28,
          color: tick % 6 === 0 ? PAL.gold : PAL.white,
          life: 0.35,
          size: 2
        });
      }
      if (skyHero.y < -30) skyHero.active = false;
    }

    if (player.invulnTimer > 0) player.invulnTimer = Math.max(0, player.invulnTimer - dt);
    if (player.skyHeroCooldown > 0) player.skyHeroCooldown = Math.max(0, player.skyHeroCooldown - dt);

    // Spin-out recovery
    if (player.spinTimer > 0) {
      player.spinTimer -= dt;
      player.speed = Math.max(40, player.speed - 140 * dt);
      player.dist += player.speed * 0.6 * dt;
      const targetCx = roadCenterX(player.dist, courseId);
      player.x += (targetCx - player.x) * Math.min(1, dt * 4.5);
      updateEngineAudio(player.speed, player.gear, false);
      if (player.spinTimer <= 0) {
        player.invulnTimer = 1.1;
        player.x = roadCenterX(player.dist, courseId);
        if (player.fuel <= 0) {
          state = 'gameover';
          stateTimer = 0.5;
          return;
        }
      }
    } else {
      // Gear & 2-Gear Acceleration Physics
      if (inp.low && !inp.high) {
        player.gear = 'LOW';
      } else if (inp.high) {
        player.gear = 'HIGH';
      }

      if (inp.brake) {
        player.speed = Math.max(0, player.speed - 260 * dt);
      } else if (inp.low && !inp.high) {
        if (player.speed < 196) {
          player.speed = Math.min(196, player.speed + 145 * dt);
        } else {
          player.speed = Math.max(196, player.speed - 65 * dt);
        }
      } else if (inp.high) {
        if (player.speed >= 150) {
          player.speed = Math.min(400, player.speed + 125 * dt);
        } else {
          const pull = level === 1 ? 65 : 42;
          player.speed = Math.min(400, player.speed + pull * dt);
        }
      } else {
        player.speed = Math.max(0, player.speed - 105 * dt);
      }

      // Steering & Counter-Steer Skid Logic
      const steerDir = (inp.right ? 1 : 0) - (inp.left ? 1 : 0);
      if (player.skidTimer > 0) {
        player.skidTimer -= dt;
        const expectedSteer = -player.skidDir;
        player.x += player.skidDir * 52 * dt + steerDir * 72 * dt;

        if (steerDir === expectedSteer) {
          player.skidTimer = 0;
          player.skidDir = 0;
          awardScore(200);
          addPopup(Math.max(24, Math.min(156, player.x - 24)), PLAYER_SCREEN_Y - 24, 'NICE SAVE +200!', PAL.lightGreen, 1.0);
          sfxSave();
        } else if (level === 1 && steerDir === 0) {
          player.skidHoldOk += dt;
          if (player.skidHoldOk >= 0.22) {
            player.skidTimer = 0;
            player.skidDir = 0;
            awardScore(200);
            addPopup(Math.max(24, Math.min(156, player.x - 24)), PLAYER_SCREEN_Y - 24, 'NICE SAVE +200!', PAL.lightGreen, 1.0);
            sfxSave();
          }
        } else if (player.skidTimer <= 0) {
          triggerSpinout();
        }
      } else {
        const steerRate = 68 + (player.speed / 400) * 62;
        player.x += steerDir * steerRate * dt;
      }

      // Advance forward & score
      const prevDist = player.dist;
      player.dist += player.speed * 0.6 * dt;
      const distGain = player.dist - prevDist;
      if (distGain > 0) {
        awardScore(Math.floor(distGain * 1.4));
      }

      // Fuel Consumption
      const drainRate = (level === 1 ? 1.65 : 2.15) * (0.35 + (player.speed / 400) * 0.85);
      player.fuel = Math.max(0, player.fuel - drainRate * dt);
      if (player.fuel <= 0) {
        player.speed = 0;
        state = 'gameover';
        stateTimer = 0.5;
        updateEngineAudio(0, player.gear, false);
        playTone(220, 0.35, 'sawtooth', 0.08);
        return;
      }

      if (player.fuel < 25) {
        lowFuelBeepTimer -= dt;
        if (lowFuelBeepTimer <= 0) {
          lowFuelBeepTimer = 0.65;
          playTone(980, 0.07, 'square', 0.05);
        }
      }

      // Sky-Hero 300+ km/h Trigger
      if (player.speed >= 300 && player.skidTimer <= 0 && player.skyHeroCooldown <= 0) {
        player.highSpeedTime += dt;
        if (player.highSpeedTime >= 6.5) {
          player.highSpeedTime = 0;
          player.skyHeroCooldown = 12.0;
          skyHero = { active: true, x: 15, y: H + 10 };
          awardScore(2000);
          addPopup(24, 130, 'SKY HERO +2000!', PAL.gold, 1.6);
          sfxSkyHero();
        }
      } else if (player.speed < 280) {
        player.highSpeedTime = Math.max(0, player.highSpeedTime - dt * 1.5);
      }

      // Guardrail Check
      const cx = roadCenterX(player.dist, courseId);
      const hw = roadHalfWidth(player.dist, courseId);
      if (Math.abs(player.x - cx) > hw - 4) {
        triggerSpinout();
      }

      updateEngineAudio(player.speed, player.gear, true);
    }

    // Update Traffic AI & Collisions
    for (let i = 0; i < entities.length; i++) {
      const e = entities[i];
      if (e.collected) continue;

      // Move moving vehicles
      if (e.speed > 0) {
        e.dist += e.speed * 0.6 * dt;
      }

      const relDist = e.dist - player.dist;
      if (relDist < -90 || relDist > 260) continue;

      // Blue Switcher AI: blink amber signals then smoothly shift 1 lane
      if (e.kind === 'blue') {
        if (e.switchState === 0 && relDist > 20 && relDist < 140) {
          e.switchState = 1;
          e.switchTimer = 0.42;
        } else if (e.switchState === 1) {
          e.switchTimer -= dt;
          if (e.switchTimer <= 0) {
            e.switchState = 2;
          }
        } else if (e.switchState === 2) {
          const diff = e.targetOff - e.laneOff;
          if (Math.abs(diff) < 1.5) {
            e.laneOff = e.targetOff;
            e.switchState = 3;
          } else {
            e.laneOff += Math.sign(diff) * 44 * dt;
          }
        }
      }

      // Pink Turbo Rival AI: tracks player's lane offset gradually
      if (e.kind === 'pink' && relDist > 15 && relDist < 200) {
        const pOff = player.x - roadCenterX(player.dist, courseId);
        const diff = pOff - e.laneOff;
        const maxTrack = roadHalfWidth(e.dist, courseId) - 12;
        const nextOff = e.laneOff + Math.sign(diff) * Math.min(Math.abs(diff), 26 * dt);
        e.laneOff = Math.max(-maxTrack, Math.min(maxTrack, nextOff));
      }

      // Collision Check with Player
      if (player.spinTimer <= 0) {
        const ex = roadCenterX(e.dist, courseId) + e.laneOff;
        const dx = Math.abs(player.x - ex);
        const dy = Math.abs(e.dist - player.dist);
        const hitW = (12 + e.w) * 0.5 - 1;
        const hitH = (18 + e.h) * 0.5 - 2;

        if (dx < hitW && dy < hitH) {
          if (e.kind === 'fuel') {
            e.collected = true;
            player.fuel = Math.min(100, player.fuel + 15);
            awardScore(1000);
            addSparkles(ex, PLAYER_SCREEN_Y - relDist, [PAL.white, PAL.aqua, PAL.gold, PAL.pink], 14);
            addPopup(Math.max(20, Math.min(154, ex - 22)), PLAYER_SCREEN_Y - relDist - 16, '+15 FUEL!', PAL.aqua, 1.15);
            sfxFuelPickup();
          } else if (e.kind === 'oil') {
            if (player.skidTimer <= 0 && player.invulnTimer <= 0) {
              triggerSkid(player.x >= ex ? 1 : -1);
            }
          } else if (e.kind === 'water') {
            if (!e.splashed) {
              e.splashed = true;
              player.speed = Math.max(60, player.speed - 80);
              addSparkles(player.x, PLAYER_SCREEN_Y, [PAL.white, PAL.cyan, PAL.blue], 10);
              addPopup(Math.max(20, Math.min(165, player.x - 18)), PLAYER_SCREEN_Y - 18, 'SPLASH!', PAL.cyan, 0.75);
              sfxSplash();
            }
          } else if (e.kind === 'barrier') {
            triggerSpinout();
          } else if (player.invulnTimer <= 0) {
            // Traffic / Truck: side-graze triggers recoverable skid, center slam triggers spin-out
            if (e.kind !== 'truck' && dx > hitW - 4.5 && dy < hitH - 3) {
              const pushDir = player.x >= ex ? 1 : -1;
              player.x += pushDir * 6;
              triggerSkid(pushDir);
            } else {
              triggerSpinout();
            }
          }
        }
      }
    }

    // Check GOAL Crossing
    if (player.dist >= course.len) {
      player.dist = course.len;
      state = 'clear';
      stateTimer = 3.2;
      const fuelBonus = Math.floor(player.fuel) * 100;
      const perfectBonus = player.crashes === 0 ? 3000 : 0;
      awardScore(fuelBonus + perfectBonus);
      updateEngineAudio(0, player.gear, false);
      sfxGoalFanfare();
    }
  }

  // Fast 2D integer hash for authentic non-repeating NES terrain speckles
  function hash2D(x, y) {
    let h = (x * 374761393 + y * 668265263) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return (h ^ (h >>> 16)) >>> 0;
  }

  // --- SCANLINE HIGHWAY RENDERER (232x240 1x1 Pixel Buffer) ---
  function renderRoadScanlines(camDist) {
    const isBridge = courseId === 2;
    const isBeach = courseId === 3;
    const isMount = courseId === 4;
    const waveScroll = Math.floor(tick * 1.4);

    for (let y = 0; y < H; y++) {
      const worldY = camDist + (H - 1 - y);
      const wy = Math.floor(worldY);
      const rowOff = y * PLAY_W;

      const cx = roadCenterX(worldY, courseId);
      const hw = roadHalfWidth(worldY, courseId);
      const rLeft = Math.floor(cx - hw);
      const rRight = Math.floor(cx + hw);
      const curbL = rLeft - 5;
      const curbR = rRight + 5;

      const inTunnel = isMount && isInTunnel(worldY, courseId);
      const curbPhase = ((wy >> 4) & 1) === 0;
      const dashOn = (wy % 32) < 16;
      const laneDashOn = (wy % 36) < 12;

      const curbCol = isBridge
        ? (curbPhase ? U32.gold : U32.curbDark)
        : inTunnel
        ? (curbPhase ? U32.lightGray : U32.darkGray)
        : (curbPhase ? U32.crimson : U32.white);

      const asphaltCol = inTunnel ? U32.tunnelRoad : U32.asphalt;

      // Bridge side girder beam every 160 world units
      const bridgeBeam = isBridge && ((wy % 160) < 10);
      const bridgeRail = isBridge && ((wy % 18) < 3);

      // Seashore animated surf edge
      const surfX = rRight + 10 + Math.floor(Math.sin(worldY * 0.045 + tick * 0.12) * 3);

      for (let x = 0; x < PLAY_W; x++) {
        let col;

        if (x >= rLeft && x <= rRight) {
          // Highway Asphalt & Lane Markings
          col = asphaltCol;
          const distFromCenter = Math.abs(x - cx);
          if (distFromCenter < 1.2 && dashOn) {
            col = U32.white;
          } else if (hw >= 56 && Math.abs(distFromCenter - hw * 0.5) < 0.8 && laneDashOn) {
            col = U32.lightGray;
          } else if (!inTunnel && ((hash2D(x, wy) & 127) === 0)) {
            col = U32.asphaltDark;
          }
        } else if ((x >= curbL && x < rLeft) || (x > rRight && x <= curbR)) {
          // 5px Curbstones
          col = curbCol;
        } else {
          // Course-Specific Outer Verge
          if (courseId === 1) {
            // Grassland with non-repeating pixel grass blades & wildflower dots
            const hsh = hash2D(x >> 1, wy >> 1) & 127;
            if (hsh < 3 && (x & 1) === 0) col = U32.lightGreen;
            else if (hsh === 17 && (x & 1) === 0 && (wy & 1) === 0) col = U32.gold;
            else if (hsh === 42 && (x & 1) === 0 && (wy & 1) === 0) col = U32.white;
            else if (hsh >= 90 && hsh <= 93) col = U32.darkGreen;
            else col = U32.green;
          } else if (isBridge) {
            // Bridge Steel Girder Shoulder + Deep Blue Ocean + Horizontal Wave Crests
            if (x >= curbL - 9 && x <= curbR + 9) {
              if (x === curbL - 9 || x === curbR + 9) {
                col = U32.darkGray;
              } else if (bridgeRail) {
                col = U32.lightGray;
              } else {
                col = ((x + wy) & 3) === 0 ? U32.lightGray : U32.gray;
              }
            } else if (bridgeBeam && ((wy % 160) < 6)) {
              col = U32.gray;
            } else {
              const wyWave = wy + waveScroll;
              const cellX = Math.floor(x / 6);
              const cellY = Math.floor(wyWave / 10);
              const wh = hash2D(cellX, cellY) & 15;
              const inWaveRow = (wyWave % 10) < 2;
              if (inWaveRow && wh === 0 && (x % 6) < 4) {
                col = U32.white;
              } else if (inWaveRow && (wh === 1 || wh === 2) && (x % 6) < 5) {
                col = U32.cyan;
              } else {
                col = U32.blue;
              }
            }
          } else if (isBeach) {
            // Seashore: Golden Sand on left, Foamy Surf & Ocean on right
            if (x < curbL) {
              const hsh = hash2D(x, wy) & 63;
              col = hsh === 3 ? U32.orange : hsh === 41 ? U32.white : U32.sand;
            } else if (x < surfX) {
              col = (hash2D(x, wy) & 31) === 0 ? U32.orange : U32.sand;
            } else if (x < surfX + 6) {
              col = ((x + wy + tick) & 3) === 0 ? U32.cyan : U32.white;
            } else {
              const wyWave = wy + waveScroll;
              const wh = hash2D(Math.floor(x / 6), Math.floor(wyWave / 10)) & 15;
              const inWaveRow = (wyWave % 10) < 2;
              col = (inWaveRow && wh === 0 && (x % 6) < 4) ? U32.white
                : (inWaveRow && wh <= 2 && (x % 6) < 5) ? U32.cyan : U32.blue;
            }
          } else {
            // Mountain Pass: Stone Tunnel Walls or Rocky Cliffs
            if (inTunnel) {
              const brickRow = (wy >> 3) & 1;
              const mortar = (wy & 7) === 0 || ((x + brickRow * 6) % 12 === 0);
              col = mortar ? U32.black : U32.darkGray;
            } else {
              const edgeDist = x < curbL ? curbL - x : x - curbR;
              if (edgeDist < 8) {
                col = (hash2D(x, wy) & 3) === 0 ? U32.gray : U32.brown;
              } else {
                const hsh = hash2D(x, wy) & 63;
                col = hsh < 3 ? U32.gray : hsh === 19 ? U32.darkBrown : U32.darkGreen;
              }
            }
          }
        }

        roadBuf32[rowOff + x] = col;
      }
    }

    ctx.putImageData(roadImgData, 0, 0);
  }

  function drawOverheadGantry(camDist, gantryDist, label) {
    const sy = Math.floor(H - 1 - (gantryDist - camDist));
    if (sy < -26 || sy > H + 26) return;

    const cx = roadCenterX(gantryDist, courseId);
    const hw = roadHalfWidth(gantryDist, courseId);
    const xL = Math.floor(cx - hw - 5);
    const xR = Math.floor(cx + hw + 1);

    // Steel Pillars
    ctx.fillStyle = PAL.gray;
    ctx.fillRect(xL, sy - 14, 5, 22);
    ctx.fillRect(xR, sy - 14, 5, 22);
    ctx.fillStyle = PAL.lightGray;
    ctx.fillRect(xL + 1, sy - 14, 2, 22);
    ctx.fillRect(xR + 1, sy - 14, 2, 22);

    // Checkered Overhead Banner
    const bw = xR - xL + 5;
    ctx.fillStyle = PAL.black;
    ctx.fillRect(xL, sy - 16, bw, 12);
    for (let bx = 0; bx < bw; bx += 4) {
      for (let by = 0; by < 12; by += 4) {
        if (((bx >> 2) + (by >> 2)) & 1) {
          ctx.fillStyle = PAL.white;
          ctx.fillRect(xL + bx, sy - 16 + by, Math.min(4, bw - bx), 4);
        }
      }
    }

    // Center Badge with START / GOAL text
    const tw = textWidth(label, 1);
    const boxW = tw + 10;
    const boxX = Math.floor(cx - boxW * 0.5);
    ctx.fillStyle = PAL.black;
    ctx.fillRect(boxX, sy - 15, boxW, 10);
    ctx.strokeStyle = label === 'GOAL' ? PAL.gold : PAL.crimson;
    ctx.lineWidth = 1;
    ctx.strokeRect(boxX + 0.5, sy - 14.5, boxW - 1, 9);
    drawText(boxX + 5, sy - 13, label, label === 'GOAL' ? PAL.gold : PAL.white, 1);
  }

  function drawTunnelPortals(camDist) {
    if (courseId !== 4) return;
    for (let i = 0; i < C4_TUNNELS.length; i++) {
      const [startD, endD] = C4_TUNNELS[i];
      [startD, endD].forEach((pd) => {
        const sy = Math.floor(H - 1 - (pd - camDist));
        if (sy < -20 || sy > H + 20) return;
        const cx = roadCenterX(pd, 4);
        const hw = roadHalfWidth(pd, 4);
        const xL = Math.floor(cx - hw - 6);
        const bw = hw * 2 + 12;
        ctx.fillStyle = PAL.gray;
        ctx.fillRect(xL, sy - 8, bw, 8);
        ctx.fillStyle = PAL.lightGray;
        ctx.fillRect(xL + 2, sy - 7, bw - 4, 2);
        ctx.fillStyle = PAL.darkGray;
        for (let bx = 6; bx < bw - 6; bx += 10) {
          ctx.fillRect(xL + bx, sy - 8, 2, 8);
        }
      });
    }
  }

  function drawPlayerCar() {
    const px = Math.floor(player.x);
    const py = PLAYER_SCREEN_Y;

    // Invulnerability blink after spin-out
    if (player.invulnTimer > 0 && ((tick >> 1) & 1)) return;

    // Spin-out 360° animation with star sparks
    if (player.spinTimer > 0) {
      const frame = Math.floor(player.spinTimer * 16) % 4;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate((frame * Math.PI) / 2);
      ctx.drawImage(SPR.player[tick & 1], -7, -11);
      ctx.restore();

      const starOff = (tick & 3) * 2;
      ctx.fillStyle = PAL.gold;
      ctx.fillRect(px - 10 + starOff, py - 12, 2, 2);
      ctx.fillStyle = PAL.white;
      ctx.fillRect(px + 8 - starOff, py + 9, 2, 2);
      return;
    }

    // Skid tilt + smoke puffs
    if (player.skidTimer > 0) {
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(player.skidDir * 0.24);
      ctx.drawImage(SPR.player[tick & 1], -7, -11);
      ctx.restore();

      ctx.fillStyle = (tick & 1) ? PAL.lightGray : PAL.white;
      ctx.fillRect(px - 7 - player.skidDir * 4, py + 9, 4, 3);
      ctx.fillRect(px + 3 - player.skidDir * 4, py + 10, 3, 3);
      return;
    }

    const treadPhase = player.speed > 10 ? ((tick >> 1) & 1) : 0;
    ctx.drawImage(SPR.player[treadPhase], px - 7, py - 11);

    // Twin flickering orange/yellow exhaust flames when speed >= 300 km/h
    if (player.speed >= 300) {
      const fLen = 3 + ((tick + 1) & 3);
      ctx.fillStyle = (tick & 1) ? PAL.orange : PAL.gold;
      ctx.fillRect(px - 3, py + 11, 2, fLen);
      ctx.fillRect(px + 1, py + 11, 2, fLen);
      ctx.fillStyle = PAL.white;
      ctx.fillRect(px - 3, py + 11, 1, 2);
      ctx.fillRect(px + 1, py + 11, 1, 2);
    }
  }

  // Right NES Black HUD Sidebar (x = 232..319, 88x240)
  function renderHUD() {
    ctx.fillStyle = PAL.black;
    ctx.fillRect(HUD_X, 0, W - HUD_X, H);

    // Crisp Vertical Divider Border at x = 232
    ctx.fillStyle = PAL.lightGray;
    ctx.fillRect(HUD_X, 0, 1, H);
    ctx.fillStyle = PAL.darkGray;
    ctx.fillRect(HUD_X + 1, 0, 1, H);

    // HI & 1UP Scores
    drawText(238, 7, 'HI', PAL.crimson, 1);
    drawText(278, 7, String(hiScore).padStart(6, '0'), PAL.white, 1);
    drawText(238, 22, '1UP', PAL.cyan, 1);
    drawText(278, 22, String(player.score).padStart(6, '0'), PAL.white, 1);

    // Divider line
    ctx.fillStyle = PAL.darkGray;
    ctx.fillRect(236, 46, 80, 1);

    // Vertical Course Progress Mini-Track (x = 238..254, y = 54..186)
    ctx.fillStyle = '#101010';
    ctx.fillRect(238, 54, 16, 132);
    ctx.strokeStyle = PAL.darkGray;
    ctx.lineWidth = 1;
    ctx.strokeRect(238.5, 54.5, 15, 131);

    // Checkered mini GOAL flag at top (y = 56..62)
    for (let fx = 0; fx < 12; fx += 2) {
      for (let fy = 0; fy < 6; fy += 2) {
        ctx.fillStyle = (((fx >> 1) + (fy >> 1)) & 1) ? PAL.white : PAL.crimson;
        ctx.fillRect(240 + fx, 56 + fy, 2, 2);
      }
    }

    // Track bar (y = 65..181)
    ctx.fillStyle = PAL.gray;
    ctx.fillRect(245, 65, 2, 116);

    const courseLen = COURSES[courseId - 1].len;
    // Tiny cyan ticks for Fuel Cars on mini-track
    for (let i = 0; i < entities.length; i++) {
      const e = entities[i];
      if (e.kind === 'fuel' && !e.collected) {
        const frac = Math.max(0, Math.min(1, e.dist / courseLen));
        const ty = Math.round(180 - frac * 112);
        ctx.fillStyle = PAL.aqua;
        ctx.fillRect(241, ty, 3, 2);
        ctx.fillRect(248, ty, 3, 2);
      }
    }

    // Mini Red Pixel Car Icon climbing bottom -> top
    const prog = Math.max(0, Math.min(1, player.dist / courseLen));
    const carY = Math.round(175 - prog * 110);
    ctx.fillStyle = PAL.black;
    ctx.fillRect(242, carY - 1, 8, 9);
    ctx.fillStyle = PAL.crimson;
    ctx.fillRect(243, carY, 6, 7);
    ctx.fillStyle = PAL.cyan;
    ctx.fillRect(244, carY + 2, 4, 2);
    ctx.fillStyle = PAL.white;
    ctx.fillRect(243, carY, 1, 1);
    ctx.fillRect(248, carY, 1, 1);

    // FUEL Panel (x = 259..315, y = 54..112)
    ctx.strokeStyle = PAL.darkGray;
    ctx.strokeRect(259.5, 54.5, 56, 57);
    drawText(275, 58, 'FUEL', PAL.gold, 1);

    const fuelInt = Math.max(0, Math.min(100, Math.ceil(player.fuel)));
    const fuelFlash = fuelInt < 25 && ((tick >> 3) & 1);
    const fuelColor = fuelFlash ? PAL.crimson : fuelInt < 25 ? PAL.orange : PAL.white;
    drawText(269, 70, String(fuelInt).padStart(3, '0'), fuelColor, 2);

    // Segmented pixel fuel bar (10 segments)
    ctx.fillStyle = '#181818';
    ctx.fillRect(263, 92, 48, 12);
    const fuelSegs = Math.ceil((fuelInt / 100) * 9);
    for (let s = 0; s < 9; s++) {
      if (s < fuelSegs) {
        ctx.fillStyle = s < 2 ? PAL.crimson : s < 5 ? PAL.gold : PAL.lightGreen;
      } else {
        ctx.fillStyle = '#282828';
      }
      ctx.fillRect(265 + s * 5, 94, 4, 8);
    }

    // SPEED & Gear Panel (x = 259..315, y = 118..186)
    ctx.strokeStyle = PAL.darkGray;
    ctx.strokeRect(259.5, 118.5, 56, 67);
    drawText(272, 122, 'SPEED', PAL.lightGray, 1);

    const spdInt = Math.max(0, Math.min(400, Math.round(player.speed)));
    drawText(269, 132, String(spdInt).padStart(3, '0'), PAL.white, 2);
    drawText(275, 148, 'KM/H', PAL.gray, 1);

    // Segmented speed bar (9 segments)
    ctx.fillStyle = '#181818';
    ctx.fillRect(263, 157, 48, 8);
    const spdSegs = Math.round((spdInt / 400) * 9);
    for (let s = 0; s < 9; s++) {
      if (s < spdSegs) {
        ctx.fillStyle = s >= 7 ? PAL.crimson : s >= 4 ? PAL.orange : PAL.aqua;
      } else {
        ctx.fillStyle = '#282828';
      }
      ctx.fillRect(265 + s * 5, 159, 4, 4);
    }

    // Bright LOW / HIGH Gear Badge
    const isHigh = player.gear === 'HIGH';
    ctx.fillStyle = isHigh ? PAL.orange : PAL.aqua;
    ctx.fillRect(265, 169, 44, 12);
    drawText(isHigh ? 275 : 278, 172, player.gear, PAL.black, 1);

    // COURSE & LVL Footer (x = 238..315, y = 194..234)
    ctx.strokeStyle = PAL.darkGray;
    ctx.strokeRect(238.5, 194.5, 77, 39);
    drawText(244, 199, `CRSE ${courseId}`, PAL.white, 1);
    drawText(244, 210, COURSES[courseId - 1].short, PAL.gold, 1);
    drawText(244, 222, `LVL ${level}`, level === 1 ? PAL.lightGreen : PAL.orange, 1);
  }

  function renderOverlays() {
    // Skid Counter-Steer Prompt
    if (state === 'racing' && player.skidTimer > 0) {
      const dirArrow = player.skidDir === 1 ? 'STEER <' : 'STEER >';
      const blink = ((tick >> 2) & 1) ? PAL.gold : PAL.white;
      ctx.fillStyle = PAL.black;
      ctx.fillRect(74, 42, 84, 16);
      ctx.strokeStyle = PAL.crimson;
      ctx.strokeRect(74.5, 42.5, 83, 15);
      drawText(94, 47, dirArrow, blink, 1);
    }

    // GRID Ready Banner
    if (state === 'grid') {
      ctx.fillStyle = PAL.black;
      ctx.fillRect(58, 72, 116, 30);
      ctx.strokeStyle = PAL.gold;
      ctx.strokeRect(58.5, 72.5, 115, 29);
      const txt = stateTimer > 0.7 ? 'READY...' : 'GET SET!';
      drawShadowText(116 - textWidth(txt, 1) * 0.5, 83, txt, stateTimer > 0.7 ? PAL.white : PAL.gold, 1);
    }

    // COURSE CLEAR Screen
    if (state === 'clear') {
      ctx.fillStyle = 'rgba(0,0,0,0.88)';
      ctx.fillRect(20, 48, 192, 132);
      ctx.strokeStyle = PAL.gold;
      ctx.lineWidth = 2;
      ctx.strokeRect(21, 49, 190, 130);
      ctx.lineWidth = 1;

      drawShadowText(44, 62, `COURSE ${courseId} CLEAR!`, PAL.gold, 1);
      drawText(42, 84, `FUEL BONUS: ${Math.floor(player.fuel) * 100}`, PAL.aqua, 1);
      if (player.crashes === 0) {
        drawText(42, 102, 'NO CRASH:  +3000', PAL.lightGreen, 1);
      } else {
        drawText(42, 102, `CRASHES:   ${player.crashes}`, PAL.orange, 1);
      }
      drawText(42, 122, `SCORE: ${String(player.score).padStart(6, '0')}`, PAL.white, 1);
      drawText(42, 150, courseId < 4 ? 'NEXT STAGE READY...' : 'FINAL VICTORY!', PAL.sand, 1);
    }

    // VICTORY & GAMEOVER Screens
    if (state === 'victory' || state === 'gameover') {
      ctx.fillStyle = 'rgba(0,0,0,0.9)';
      ctx.fillRect(20, 52, 192, 128);
      ctx.strokeStyle = state === 'victory' ? PAL.gold : PAL.crimson;
      ctx.lineWidth = 2;
      ctx.strokeRect(21, 53, 190, 126);
      ctx.lineWidth = 1;

      if (state === 'victory') {
        drawShadowText(38, 66, 'ALL COURSES CLEAR!', PAL.gold, 1);
        drawText(54, 84, 'ROAD CHAMPION!', PAL.lightGreen, 1);
      } else {
        drawShadowText(64, 66, 'OUT OF FUEL!', PAL.crimson, 1);
        drawText(76, 84, 'GAME OVER', PAL.white, 1);
      }
      drawText(48, 108, `FINAL: ${String(player.score).padStart(6, '0')}`, PAL.white, 1);
      drawText(48, 124, `HI:    ${String(hiScore).padStart(6, '0')}`, PAL.gold, 1);
      if (((tick >> 4) & 1) === 0) {
        drawText(40, 152, 'PRESS ENTER OR SPACE', PAL.aqua, 1);
      }
    }

    // TITLE SCREEN
    if (state === 'title') {
      // Dark semi-transparent backdrop panel over top half of scrolling highway
      ctx.fillStyle = 'rgba(0, 0, 0, 0.84)';
      ctx.fillRect(10, 14, 212, 152);
      ctx.strokeStyle = PAL.crimson;
      ctx.lineWidth = 2;
      ctx.strokeRect(11, 15, 210, 150);
      ctx.lineWidth = 1;

      // Pixelated 8-Bit Block Title Banner: ROAD FIGHTER
      ctx.fillStyle = PAL.crimson;
      ctx.fillRect(18, 22, 196, 36);
      ctx.fillStyle = PAL.orange;
      ctx.fillRect(18, 54, 196, 4);

      const titleX = Math.floor(116 - textWidth('ROAD FIGHTER', 2) * 0.5);
      drawShadowText(titleX, 30, 'ROAD FIGHTER', PAL.gold, 2, PAL.black);
      drawShadowText(titleX, 29, 'ROAD FIGHTER', PAL.white, 2, PAL.crimson);
      drawText(Math.floor(116 - textWidth('1985 8-BIT EDITION', 1) * 0.5), 64, '1985 8-BIT EDITION', PAL.sand, 1);

      const hiStr = `HI-SCORE  ${String(hiScore).padStart(6, '0')}`;
      drawText(Math.floor(116 - textWidth(hiStr, 1) * 0.5), 82, hiStr, PAL.gold, 1);

      // Level Selector
      drawText(42, 100, level === 1 ? '>' : ' ', PAL.crimson, 1);
      drawText(52, 100, 'LEVEL 1 (ARCADE)', level === 1 ? PAL.white : PAL.gray, 1);
      drawText(42, 113, level === 2 ? '>' : ' ', PAL.crimson, 1);
      drawText(52, 113, 'LEVEL 2 (PRO)', level === 2 ? PAL.orange : PAL.gray, 1);

      // Course Selector
      const cStr = `< COURSE ${courseId}: ${COURSES[courseId - 1].name} >`;
      drawText(Math.floor(116 - textWidth(cStr, 1) * 0.5), 131, cStr, PAL.aqua, 1);

      // Pulsing Start Prompt
      if (shotMode || ((tick >> 4) & 1) === 0) {
        const pStr = 'PRESS ENTER OR SPACE';
        drawText(Math.floor(116 - textWidth(pStr, 1) * 0.5), 149, pStr, PAL.lightGreen, 1);
      }
    }
  }

  // Main Render Function
  function render() {
    const camDist = player.dist - (H - 1 - PLAYER_SCREEN_Y);

    // 1. Scanline-rendered highway & terrain (x = 0..231)
    renderRoadScanlines(camDist);

    // 2. Scenery Trees
    for (let i = 0; i < scenery.length; i++) {
      const s = scenery[i];
      const sy = Math.floor(H - 1 - (s.dist - camDist));
      if (sy < -24 || sy > H + 24) continue;
      const spr = SPR[s.type];
      ctx.drawImage(spr, Math.floor(s.x - spr.width * 0.5), sy - spr.height + 4);
    }

    // 3. Road Ground Hazards (Oil Slicks & Water Puddles)
    for (let i = 0; i < entities.length; i++) {
      const e = entities[i];
      if (e.kind !== 'oil' && e.kind !== 'water') continue;
      const sy = Math.floor(H - 1 - (e.dist - camDist));
      if (sy < -20 || sy > H + 20) continue;
      const ex = Math.floor(roadCenterX(e.dist, courseId) + e.laneOff);
      const spr = SPR[e.kind];
      ctx.drawImage(spr, ex - (spr.width >> 1), sy - (spr.height >> 1));
    }

    // 4. START & GOAL Checkered Gantries
    drawOverheadGantry(camDist, 120, 'START');
    drawOverheadGantry(camDist, COURSES[courseId - 1].len, 'GOAL');

    // 5. Traffic Cars, Rainbow Fuel Cars, Semi-Trucks, Barriers (sorted far -> near)
    const visibleCars = [];
    for (let i = 0; i < entities.length; i++) {
      const e = entities[i];
      if (e.collected || e.kind === 'oil' || e.kind === 'water') continue;
      const sy = Math.floor(H - 1 - (e.dist - camDist));
      if (sy < -42 || sy > H + 42) continue;
      visibleCars.push({ e, sy });
    }
    visibleCars.sort((a, b) => a.sy - b.sy);

    const treadPhase = (tick >> 2) & 1;
    for (let i = 0; i < visibleCars.length; i++) {
      const { e, sy } = visibleCars[i];
      const ex = Math.floor(roadCenterX(e.dist, courseId) + e.laneOff);
      if (e.kind === 'fuel') {
        const frame = (tick >> 2) & 3;
        ctx.drawImage(SPR.fuel[frame], ex - 7, sy - 11);
      } else if (e.kind === 'truck') {
        ctx.drawImage(SPR.truck, ex - 9, sy - 18);
      } else if (e.kind === 'barrier') {
        ctx.drawImage(SPR.barrier, ex - 10, sy - 5);
      } else {
        ctx.drawImage(SPR[e.kind][treadPhase], ex - 7, sy - 11);
        // Blue Switcher amber turn-signal flash on left/right hood
        if (e.kind === 'blue' && (e.switchState === 1 || e.switchState === 2) && ((tick >> 2) & 1)) {
          const sigRight = e.targetOff > e.laneOff;
          ctx.fillStyle = PAL.gold;
          ctx.fillRect(ex + (sigRight ? 4 : -6), sy - 10, 2, 2);
        }
      }
    }

    // 6. Player Red Sports Car
    if (state !== 'title') {
      drawPlayerCar();
    } else {
      // Demo car scrolling in title backdrop
      ctx.drawImage(SPR.player[treadPhase], Math.floor(player.x) - 7, PLAYER_SCREEN_Y - 11);
    }

    // 7. Course 4 Stone Tunnel Arch Portals
    drawTunnelPortals(camDist);

    // 8. Caped Sky-Hero Easter Egg
    if (skyHero.active) {
      ctx.drawImage(SPR.skyHero, Math.floor(skyHero.x) - 7, Math.floor(skyHero.y) - 11);
    }

    // 9. Particles & Floating Popups (clipped to playfield x < 232)
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, PLAY_W, H);
    ctx.clip();

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
    }
    for (let i = 0; i < popups.length; i++) {
      const pop = popups[i];
      drawShadowText(pop.x, pop.y, pop.text, pop.color, 1);
    }
    renderOverlays();
    ctx.restore();

    // 10. Right NES Black HUD Sidebar
    renderHUD();
  }

  // Initialization & Fixed-Timestep Loop
  initSprites();
  if (shotMode) {
    applyShotPreset(shotMode);
    syncTopbar();
    render();
  } else {
    setupTitleDemo();
  }

  let lastTime = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
    lastTime = now;
    if (!shotMode) {
      update(dt);
    }
    render();
    Object.assign(prevKeys, keys);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
