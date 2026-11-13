/*
 * SUPER LEO CITY: HERO PATROL & STUNT SANDBOX (HTML5 Canvas 60FPS Edition)
 * Wholesome, non-violent open-world driving & rescue sandbox for kids!
 *
 * Features:
 *  - Walk on foot as Junior Mayor Leo OR hop into 8 vehicles + 1 Rideable Dino (`E` / `Enter` / `X`)
 *  - Smart Kid-Friendly Driving: Works with BOTH directional steering (press the arrow direction you
 *    want to go!) AND classic Up=Gas / Left-Right=Steer!
 *  - 2.5D Extruded City Buildings, Sunny Beach Marina, Stunt Airport Helipad, Central Park Soccer Field,
 *    and Dino Safari Reserve!
 *  - 5 Rotating Hero Missions (Fire Rescue, Pizza Express, Ice Cream Party, Robo-Pup Tag, Stunt Show)
 *    + Giant Park Soccer Ball with Goal Nets!
 */

(function () {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const W = 1280;
  const H = 720;
  const WORLD_W = 3600;
  const WORLD_H = 3600;

  // Input State
  const keys = {};
  const prevKeys = {};
  window.addEventListener("keydown", (e) => {
    keys[e.code] = true;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", "Enter"].includes(e.code)) {
      e.preventDefault();
    }
    initAudio();
  });
  window.addEventListener("keyup", (e) => {
    keys[e.code] = false;
  });

  document.querySelectorAll(".tbtn").forEach((btn) => {
    const k = btn.getAttribute("data-key");
    btn.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      initAudio();
      keys[k] = true;
    });
    btn.addEventListener("pointerup", (e) => {
      e.preventDefault();
      keys[k] = false;
    });
    btn.addEventListener("pointerleave", () => {
      keys[k] = false;
    });
  });

  function justPressed(code) {
    return !!keys[code] && !prevKeys[code];
  }

  // Web Audio Synthesizer (Sirens, Ice Cream Jingle, Splash, Engine, Goal Horn!)
  let audioCtx = null;
  function initAudio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  function playTone(freq, endFreq, dur, type = "square", gainVal = 0.08) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      if (endFreq !== freq) {
        osc.frequency.linearRampToValueAtTime(endFreq, audioCtx.currentTime + dur);
      }
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + dur);
    } catch (_) {}
  }

  function sfxHopIn() {
    playTone(330, 660, 0.16, "triangle", 0.12);
    setTimeout(() => playTone(660, 880, 0.14, "triangle", 0.12), 90);
  }
  function sfxSplash() {
    playTone(520, 180, 0.12, "sine", 0.07);
  }
  function sfxThrow() {
    playTone(400, 780, 0.14, "triangle", 0.1);
  }
  function sfxCoin() {
    playTone(987.77, 1318.5, 0.18, "square", 0.08);
  }
  function sfxRamp() {
    playTone(260, 880, 0.35, "sawtooth", 0.09);
  }
  function sfxGoal() {
    [523.25, 659.25, 783.99, 1046.5].forEach((n, i) => {
      setTimeout(() => playTone(n, n, 0.22, "sawtooth", 0.11), i * 110);
    });
  }

  // Vehicle Catalog
  const VEH_TYPES = {
    SPORTS: {
      id: "SPORTS",
      name: "Comet GT Sports Car",
      w: 68, h: 36,
      maxSpeed: 10.5, accel: 0.42, turn: 0.075,
      color: "#ef4444", stripe: "#ffffff",
      actionName: "HONK & TURBO DRIFT",
      siren: false, canFly: false, canSwim: false
    },
    FIRE: {
      id: "FIRE",
      name: "Big Red Fire Engine",
      w: 88, h: 42,
      maxSpeed: 8.2, accel: 0.30, turn: 0.062,
      color: "#dc2626", stripe: "#facc15",
      actionName: "WATER CANNON [Z]",
      siren: true, canFly: false, canSwim: false
    },
    POLICE: {
      id: "POLICE",
      name: "Hero Patrol Cruiser",
      w: 70, h: 36,
      maxSpeed: 9.8, accel: 0.38, turn: 0.072,
      color: "#1d4ed8", stripe: "#f8fafc",
      actionName: "SIREN & RESCUE BEAM [Z]",
      siren: true, canFly: false, canSwim: false
    },
    ICECREAM: {
      id: "ICECREAM",
      name: "Melody Ice Cream Van",
      w: 74, h: 40,
      maxSpeed: 7.8, accel: 0.28, turn: 0.065,
      color: "#f472b6", stripe: "#38bdf8",
      actionName: "TOSS ICE CREAM [Z]",
      siren: false, jingle: true, canFly: false, canSwim: false
    },
    PIZZA: {
      id: "PIZZA",
      name: "Rocket Pizza Buggy",
      w: 62, h: 34,
      maxSpeed: 9.2, accel: 0.38, turn: 0.078,
      color: "#f97316", stripe: "#fde047",
      actionName: "LAUNCH HOT PIZZA [Z]",
      siren: false, canFly: false, canSwim: false
    },
    MONSTER: {
      id: "MONSTER",
      name: "Monster Bounce Truck",
      w: 82, h: 48,
      maxSpeed: 8.6, accel: 0.34, turn: 0.068,
      color: "#8b5cf6", stripe: "#4ade80",
      actionName: "MEGA BOUNCE JUMP [Z]",
      siren: false, canFly: false, canSwim: false, monster: true
    },
    BOAT: {
      id: "BOAT",
      name: "Aqua-Jet Speedboat",
      w: 78, h: 38,
      maxSpeed: 10.2, accel: 0.36, turn: 0.070,
      color: "#06b6d4", stripe: "#ffffff",
      actionName: "WATER FOUNTAIN [Z]",
      siren: false, canFly: false, canSwim: true
    },
    HELI: {
      id: "HELI",
      name: "Sky-Rescue Helicopter",
      w: 76, h: 44,
      maxSpeed: 11.0, accel: 0.40, turn: 0.080,
      color: "#f59e0b", stripe: "#ffffff",
      actionName: "WATER DROP [Z]",
      siren: false, canFly: true, canSwim: true
    },
    DINO: {
      id: "DINO",
      name: "Emerald Rex Dino",
      w: 66, h: 40,
      maxSpeed: 9.0, accel: 0.40, turn: 0.085,
      color: "#10b981", stripe: "#ef4444",
      actionName: "DINO ROAR & LEAP [Z]",
      siren: false, canFly: false, canSwim: true
    }
  };

  // City Buildings (2.5D Extruded Blocks)
  const buildings = [
    // Downtown Core
    { x: 420, y: 420, w: 320, h: 240, roof: "#3b82f6", wall: "#1d4ed8", label: "CITY HALL", height: 34 },
    { x: 1020, y: 420, w: 300, h: 240, roof: "#ef4444", wall: "#b91c1c", label: "FIRE & RESCUE HQ", height: 30 },
    { x: 1620, y: 420, w: 320, h: 240, roof: "#2563eb", wall: "#1e40af", label: "HERO POLICE HQ", height: 30 },
    { x: 420, y: 1020, w: 320, h: 260, roof: "#f97316", wall: "#c2410c", label: "ROCKET PIZZERIA", height: 26 },
    { x: 1620, y: 1020, w: 320, h: 260, roof: "#ec4899", wall: "#be185d", label: "ICE CREAM PALACE", height: 26 },
    { x: 420, y: 1620, w: 320, h: 260, roof: "#8b5cf6", wall: "#5b21b6", label: "TOY & ROBOT LAB", height: 32 },
    { x: 1020, y: 1620, w: 300, h: 260, roof: "#14b8a6", wall: "#0f766e", label: "MEGA ARCADE", height: 28 },
    { x: 1620, y: 1620, w: 320, h: 260, roof: "#eab308", wall: "#a16207", label: "MONSTER GARAGE", height: 28 },
    // Airport Terminal (Northwest of Airport)
    { x: 2260, y: 420, w: 340, h: 220, roof: "#0284c7", wall: "#0369a1", label: "STUNT AIRPORT", height: 28 },
    // Dino Visitor Center
    { x: 2260, y: 1620, w: 320, h: 220, roof: "#16a34a", wall: "#15803d", label: "DINO SAFARI PARK", height: 24 }
  ];

  // Stunt Ramps & Boost Pads
  const ramps = [
    { x: 860, y: 800, w: 90, h: 52, dir: 0, label: "JUMP" },
    { x: 1460, y: 800, w: 90, h: 52, dir: 0, label: "JUMP" },
    { x: 860, y: 1420, w: 90, h: 52, dir: 0, label: "JUMP" },
    { x: 2040, y: 900, w: 110, h: 60, dir: 0, label: "RIVER JUMP" },
    { x: 2040, y: 1500, w: 110, h: 60, dir: 0, label: "RIVER JUMP" },
    { x: 2780, y: 720, w: 70, h: 120, dir: -Math.PI / 2, label: "SKY RAMP" },
    { x: 2780, y: 1220, w: 70, h: 120, dir: -Math.PI / 2, label: "SKY RAMP" },
    { x: 1150, y: 2180, w: 110, h: 60, dir: 0, label: "BEACH JUMP" }
  ];

  // Game State
  let gameState = "title"; // "title" | "playing"
  let tick = 0;
  let coins = 0;
  let score = 0;
  let stuntsDone = 0;
  let missionsDone = 0;
  let bannerText = "WELCOME TO SUPER LEO CITY! PRESS E OR ENTER NEAR ANY VEHICLE TO DRIVE!";
  let bannerTimer = 320;

  const player = {
    x: 920,
    y: 780,
    vx: 0,
    vy: 0,
    angle: 0,
    z: 0,
    vz: 0,
    inVehicle: null,
    anim: 0,
    nitroTimer: 0
  };

  const camera = { x: 300, y: 300 };

  // Vehicles in the world
  const vehicles = [];
  function spawnVehicle(typeKey, x, y, angle = 0, aiPatrol = false) {
    const def = VEH_TYPES[typeKey];
    vehicles.push({
      type: def,
      x, y,
      vx: 0, vy: 0,
      speed: 0,
      angle,
      z: 0, vz: 0,
      rotorAngle: 0,
      sirenOn: def.siren,
      aiPatrol,
      aiTargetAngle: angle
    });
  }

  // Bouncy Props (Cones, Hydrants, Beach Balls) & Park Soccer Ball
  const props = [];
  const soccerBall = {
    x: 1170, y: 1150,
    vx: 0, vy: 0,
    r: 22
  };
  const soccerGoalLeft  = { x: 980,  y: 1090, w: 36, h: 120 };
  const soccerGoalRight = { x: 1324, y: 1090, w: 36, h: 120 };

  // Projectiles (Water droplets, Ice Cream cones, Pizzas) & Particles
  const projectiles = [];
  const particles = [];
  const tireMarks = [];

  // Active Hero Mission
  let mission = {
    index: 0,
    title: "",
    desc: "",
    targets: [],
    progress: 0,
    goal: 3
  };

  function addParticle(x, y, vx, vy, color, size, life, text = "") {
    particles.push({ x, y, vx, vy, color, size, life, maxLife: life, text });
  }

  function showBanner(msg, dur = 240) {
    bannerText = msg;
    bannerTimer = dur;
  }

  function setupCity() {
    vehicles.length = 0;
    props.length = 0;
    projectiles.length = 0;
    particles.length = 0;
    tireMarks.length = 0;

    // Parked Hero Vehicles at each Station + Right next to Leo at start!
    spawnVehicle("SPORTS",   960,  720, 0, false);          // Right beside Leo at Start!
    spawnVehicle("FIRE",     1160, 710, 0, false);          // Fire HQ
    spawnVehicle("POLICE",   1760, 710, Math.PI, false);    // Police HQ
    spawnVehicle("PIZZA",    580,  1340, 0, false);         // Rocket Pizzeria
    spawnVehicle("ICECREAM", 1760, 1340, Math.PI, false);   // Ice Cream Palace
    spawnVehicle("MONSTER",  1760, 1940, 0, false);         // Monster Garage
    spawnVehicle("HELI",     2960, 560, 0, false);          // Airport Helipad
    spawnVehicle("BOAT",     1420, 2720, 0, false);         // Sunny Beach Marina Dock
    spawnVehicle("DINO",     2520, 1940, 0, false);         // Dino Safari Park

    // Friendly AI City Traffic cruising the avenues
    spawnVehicle("SPORTS",   800,  1360, 0, true);
    spawnVehicle("ICECREAM", 1420, 900, Math.PI / 2, true);
    spawnVehicle("PIZZA",    840,  1960, 0, true);
    spawnVehicle("POLICE",   1980, 1360, -Math.PI / 2, true);

    // Fire Hydrants & Traffic Cones along avenues + Beach Balls on the beach
    for (let x = 460; x <= 2000; x += 260) {
      props.push({ type: "hydrant", x, y: 690, vx: 0, vy: 0, r: 12, geyserTimer: 0 });
      props.push({ type: "cone", x: x + 90, y: 1310, vx: 0, vy: 0, r: 10 });
    }
    for (let x = 600; x <= 1900; x += 220) {
      props.push({ type: "beachball", x, y: 2420 + (x % 3) * 40, vx: 0, vy: 0, r: 16 });
    }

    startMission(0);
  }

  function startMission(idx) {
    mission.index = idx % 5;
    mission.targets = [];
    mission.progress = 0;

    if (mission.index === 0) {
      mission.title = "MISSION 1: FIRE BRIGADE RESCUE!";
      mission.desc = "Spray water [Z] on 3 Overheated Popcorn Carts! (Fire Truck or Water Blaster)";
      mission.goal = 3;
      mission.targets = [
        { x: 760,  y: 960,  r: 36, hp: 25, maxHp: 25, type: "fire", done: false },
        { x: 1480, y: 740,  r: 36, hp: 25, maxHp: 25, type: "fire", done: false },
        { x: 1460, y: 1520, r: 36, hp: 25, maxHp: 25, type: "fire", done: false }
      ];
    } else if (mission.index === 1) {
      mission.title = "MISSION 2: ROCKET PIZZA EXPRESS!";
      mission.desc = "Drive or launch Pizzas [Z] into 3 Hungry Picnic Zones!";
      mission.goal = 3;
      mission.targets = [
        { x: 620,  y: 740,  r: 48, type: "pizza_zone", done: false },
        { x: 1180, y: 980,  r: 48, type: "pizza_zone", done: false },
        { x: 1840, y: 1540, r: 48, type: "pizza_zone", done: false }
      ];
    } else if (mission.index === 2) {
      mission.title = "MISSION 3: ICE CREAM PARK PARTY!";
      mission.desc = "Toss treats [Z] or drive up to 4 Cheering Kids around the City!";
      mission.goal = 4;
      mission.targets = [
        { x: 1040, y: 1020, r: 42, type: "kid", done: false },
        { x: 1320, y: 1240, r: 42, type: "kid", done: false },
        { x: 920,  y: 2340, r: 42, type: "kid", done: false },
        { x: 1540, y: 2340, r: 42, type: "kid", done: false }
      ];
    } else if (mission.index === 3) {
      mission.title = "MISSION 4: CATCH THE BOUNCY ROBO-PUP!";
      mission.desc = "Professor Gear's toy Robo-Pup is zooming around! Drive close to rescue it!";
      mission.goal = 3;
      mission.targets = [
        { x: 1380, y: 820,  vx: 3.4, vy: 0, r: 34, type: "robopup", done: false },
        { x: 840,  y: 1480, vx: 0, vy: 3.4, r: 34, type: "robopup", done: false },
        { x: 1960, y: 1180, vx: -3.2, vy: 2.2, r: 34, type: "robopup", done: false }
      ];
    } else {
      mission.title = "MISSION 5: SUPER STUNT SHOW!";
      mission.desc = "Launch off any 3 Yellow Stunt Ramps in the city!";
      mission.goal = 3;
      mission.targets = ramps.slice(0, 3).map((rm) => ({
        x: rm.x + rm.w / 2,
        y: rm.y + rm.h / 2,
        r: 55,
        type: "stunt_ring",
        done: false
      }));
    }
    showBanner(mission.title + " — " + mission.desc, 300);
  }

  function completeMissionTarget(t) {
    if (t.done) return;
    t.done = true;
    mission.progress++;
    coins += 10;
    score += 500;
    sfxCoin();
    addParticle(t.x, t.y - 20, 0, -2.5, "#fde047", 18, 55, "+500 HERO BONUS!");

    if (mission.progress >= mission.goal) {
      missionsDone++;
      score += 2000;
      coins += 25;
      sfxGoal();
      addParticle(player.x, player.y - 40, 0, -2.0, "#4ade80", 22, 80, "MISSION COMPLETE! +2000");
      setTimeout(() => startMission(mission.index + 1), 1600);
    }
  }

  function isWaterAt(x, y) {
    // Southern Ocean Bay (y > 2560) or East River Canal (x between 2090 and 2210, y < 2560)
    if (y > 2560) return true;
    if (x > 2090 && x < 2210 && y < 2560) {
      // Allow crossing over the 2 river bridges!
      if ((y > 840 && y < 980) || (y > 1440 && y < 1580)) return false;
      return true;
    }
    return false;
  }

  function collideBuildings(x, y, radius, isFlying, isMonster) {
    if (isFlying) return { x, y, hit: false };
    let hit = false;
    for (let i = 0; i < buildings.length; i++) {
      const b = buildings[i];
      const cx = Math.max(b.x, Math.min(x, b.x + b.w));
      const cy = Math.max(b.y, Math.min(y, b.y + b.h));
      const dx = x - cx;
      const dy = y - cy;
      const distSq = dx * dx + dy * dy;
      if (distSq < radius * radius) {
        const dist = Math.sqrt(distSq) || 1;
        const push = radius - dist;
        x += (dx / dist) * push;
        y += (dy / dist) * push;
        hit = true;
      }
    }
    return { x, y, hit };
  }

  function fireActionWeapon() {
    const v = player.inVehicle;
    const angle = v ? v.angle : player.angle;
    const px = player.x + Math.cos(angle) * 34;
    const py = player.y + Math.sin(angle) * 34;

    if (!v || v.type.id === "FIRE" || v.type.id === "BOAT" || v.type.id === "HELI") {
      // Spray stream of refreshing water droplets!
      sfxSplash();
      for (let i = 0; i < 3; i++) {
        const spread = (Math.random() - 0.5) * 0.28;
        const spd = 11 + Math.random() * 4;
        projectiles.push({
          kind: "water",
          x: px, y: py,
          vx: Math.cos(angle + spread) * spd,
          vy: Math.sin(angle + spread) * spd,
          r: 10,
          color: "#38bdf8",
          life: 34
        });
      }
    } else if (v.type.id === "ICECREAM") {
      sfxThrow();
      projectiles.push({
        kind: "icecream",
        x: px, y: py,
        vx: Math.cos(angle) * 11,
        vy: Math.sin(angle) * 11,
        r: 13,
        color: "#f472b6",
        life: 48
      });
    } else if (v.type.id === "PIZZA") {
      sfxThrow();
      projectiles.push({
        kind: "pizza",
        x: px, y: py,
        vx: Math.cos(angle) * 12,
        vy: Math.sin(angle) * 12,
        r: 14,
        color: "#facc15",
        life: 48
      });
    } else if (v.type.id === "MONSTER" || v.type.id === "DINO") {
      if (v.z <= 1) {
        v.vz = 11.5;
        sfxRamp();
        addParticle(v.x, v.y, 0, -2, "#4ade80", 16, 40, v.type.id === "DINO" ? "ROOOAR!!" : "BOING!!");
      }
    } else {
      // Honk Horn + Speed Boost!
      playTone(440, 587.33, 0.18, "sawtooth", 0.1);
      player.nitroTimer = 35;
      addParticle(v.x, v.y - 24, 0, -1.5, "#fde047", 14, 30, "BEEP BEEP!");
    }
  }

  function toggleVehicleHop() {
    if (player.inVehicle) {
      // Hop Out safely beside the vehicle
      const v = player.inVehicle;
      v.speed = 0;
      player.x = v.x - Math.sin(v.angle) * 48;
      player.y = v.y + Math.cos(v.angle) * 48;
      player.z = 0;
      player.vz = 0;
      player.inVehicle = null;
      sfxHopIn();
      showBanner("ON FOOT! WALK TO ANY CAR, BOAT, HELICOPTER OR DINO AND PRESS E / ENTER!", 180);
      return;
    }

    // Find closest vehicle within 95px
    let best = null;
    let bestDist = 95;
    for (const v of vehicles) {
      const d = Math.hypot(v.x - player.x, v.y - player.y);
      if (d < bestDist) {
        bestDist = d;
        best = v;
      }
    }
    if (best) {
      best.aiPatrol = false;
      player.inVehicle = best;
      player.x = best.x;
      player.y = best.y;
      sfxHopIn();
      showBanner("DRIVING " + best.type.name.toUpperCase() + "!  " + best.type.actionName + "  |  SPACE = NITRO!", 240);
    } else {
      showBanner("WALK CLOSER TO A VEHICLE AND PRESS E / ENTER TO HOP IN!", 140);
    }
  }

  function updateGame() {
    tick++;
    if (bannerTimer > 0) bannerTimer--;

    if (justPressed("KeyE") || justPressed("Enter") || justPressed("KeyX")) {
      toggleVehicleHop();
    }
    if (justPressed("KeyM")) {
      startMission(mission.index + 1);
    }

    // Directional Input Vector (Smart Kid-Friendly Steering!)
    let dx = 0;
    let dy = 0;
    if (keys["ArrowLeft"]  || keys["KeyA"]) dx -= 1;
    if (keys["ArrowRight"] || keys["KeyD"]) dx += 1;
    if (keys["ArrowUp"]    || keys["KeyW"]) dy -= 1;
    if (keys["ArrowDown"]  || keys["KeyS"]) dy += 1;

    const actPressed = keys["KeyZ"] || keys["ShiftLeft"] || keys["ShiftRight"];
    const nitroPressed = keys["Space"];
    if (player.nitroTimer > 0) player.nitroTimer--;

    if (actPressed && tick % 7 === 0) {
      fireActionWeapon();
    }

    if (player.inVehicle) {
      const v = player.inVehicle;
      const def = v.type;

      // Smart Kid Steering: simply hold the arrow keys in the direction you want to drive!
      if (dx !== 0 || dy !== 0) {
        const targetAngle = Math.atan2(dy, dx);
        let diff = targetAngle - v.angle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        v.angle += Math.max(-def.turn * 1.45, Math.min(def.turn * 1.45, diff * 0.28));

        const topSpd = def.maxSpeed * ((nitroPressed || player.nitroTimer > 0) ? 1.38 : 1.0);
        v.speed = Math.min(topSpd, v.speed + def.accel);

        // Leave drift tire marks when turning sharply at high speed
        if (Math.abs(diff) > 0.45 && v.z <= 1 && !def.canFly && !def.canSwim && tick % 2 === 0) {
          tireMarks.push({ x: v.x, y: v.y, life: 180 });
          if (tireMarks.length > 140) tireMarks.shift();
        }
      } else {
        v.speed *= 0.92;
        if (Math.abs(v.speed) < 0.08) v.speed = 0;
      }

      // Helicopter altitude control
      if (def.canFly) {
        const targetZ = (dx !== 0 || dy !== 0 || nitroPressed) ? 65 : 18;
        v.z += (targetZ - v.z) * 0.08;
        v.rotorAngle += 0.45;
      } else {
        // Gravity & Jump Physics
        if (v.z > 0 || v.vz !== 0) {
          v.z += v.vz;
          v.vz -= 0.52;
          if (v.z <= 0) {
            v.z = 0;
            v.vz = 0;
          }
        }
      }

      let nx = v.x + Math.cos(v.angle) * v.speed;
      let ny = v.y + Math.sin(v.angle) * v.speed;

      // Water check for non-amphibious vehicles
      if (!def.canFly && !def.canSwim && v.z <= 4 && isWaterAt(nx, ny)) {
        v.speed *= -0.4;
        nx = v.x;
        ny = v.y;
        showBanner("SPLASH! GRAB THE SPEEDBOAT AT THE MARINA OR HELICOPTER TO CROSS WATER!", 150);
      }

      const col = collideBuildings(nx, ny, 28, def.canFly || v.z > 28, def.monster);
      if (col.hit) v.speed *= 0.65;
      v.x = Math.max(40, Math.min(WORLD_W - 40, col.x));
      v.y = Math.max(40, Math.min(WORLD_H - 40, col.y));

      // Check Stunt Ramps
      if (!def.canFly && v.z <= 2 && v.speed > 4.5) {
        for (const rm of ramps) {
          if (v.x > rm.x && v.x < rm.x + rm.w && v.y > rm.y && v.y < rm.y + rm.h) {
            v.vz = def.monster ? 14.5 : 11.5;
            v.speed = Math.min(def.maxSpeed * 1.45, v.speed + 3.5);
            stuntsDone++;
            score += 300;
            coins += 5;
            sfxRamp();
            addParticle(v.x, v.y - 20, 0, -2.2, "#38bdf8", 18, 50, "MEGA STUNT JUMP! +300");
            if (mission.index === 4) {
              for (const mt of mission.targets) {
                if (!mt.done && Math.hypot(v.x - mt.x, v.y - mt.y) < 90) {
                  completeMissionTarget(mt);
                }
              }
            }
          }
        }
      }

      // Musical Ice Cream Jingle / Siren Audio
      if (def.jingle && v.speed > 1 && tick % 18 === 0) {
        const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 659.25];
        playTone(notes[(tick / 18) % notes.length | 0], notes[(tick / 18) % notes.length | 0], 0.12, "triangle", 0.05);
      }

      player.x = v.x;
      player.y = v.y;
      player.z = v.z;
      player.angle = v.angle;
    } else {
      // Walking on Foot as Leo
      if (dx !== 0 || dy !== 0) {
        const len = Math.hypot(dx, dy) || 1;
        const spd = nitroPressed ? 6.2 : 4.5;
        player.vx = (dx / len) * spd;
        player.vy = (dy / len) * spd;
        player.angle = Math.atan2(player.vy, player.vx);
        player.anim += 0.25;
      } else {
        player.vx *= 0.7;
        player.vy *= 0.7;
      }
      let nx = player.x + player.vx;
      let ny = player.y + player.vy;
      if (!isWaterAt(nx, ny)) {
        const col = collideBuildings(nx, ny, 16, false, false);
        player.x = Math.max(30, Math.min(WORLD_W - 30, col.x));
        player.y = Math.max(30, Math.min(WORLD_H - 30, col.y));
      }
    }

    // Update Friendly AI Patrol Vehicles
    for (const v of vehicles) {
      if (v === player.inVehicle) continue;
      if (v.type.id === "HELI") v.rotorAngle += 0.12;
      if (!v.aiPatrol) continue;

      v.speed = 3.2;
      let nx = v.x + Math.cos(v.angle) * v.speed;
      let ny = v.y + Math.sin(v.angle) * v.speed;
      const col = collideBuildings(nx, ny, 32, false, false);
      if (col.hit || nx < 220 || nx > 2020 || ny < 220 || ny > 2350 || isWaterAt(nx, ny)) {
        v.angle += Math.PI / 2;
      } else {
        v.x = nx;
        v.y = ny;
      }
    }

    // Update Bouncy City Props (Hydrants, Cones, Beach Balls)
    for (const pr of props) {
      if (pr.geyserTimer > 0) pr.geyserTimer--;
      const d = Math.hypot(player.x - pr.x, player.y - pr.y);
      if (d < pr.r + 28 && player.z < 20) {
        const ang = Math.atan2(pr.y - player.y, pr.x - player.x);
        pr.vx = Math.cos(ang) * 9.5;
        pr.vy = Math.sin(ang) * 9.5;
        if (pr.type === "hydrant" && pr.geyserTimer === 0) {
          pr.geyserTimer = 240;
          score += 50;
          coins += 1;
          sfxSplash();
          addParticle(pr.x, pr.y - 16, 0, -2, "#38bdf8", 14, 35, "FOUNTAIN! +50");
        } else {
          playTone(320, 520, 0.08, "sine", 0.06);
        }
      }
      pr.x += pr.vx;
      pr.y += pr.vy;
      pr.vx *= 0.88;
      pr.vy *= 0.88;
    }

    // Update Central Park Giant Soccer Ball & Goal Detection!
    {
      const d = Math.hypot(player.x - soccerBall.x, player.y - soccerBall.y);
      if (d < soccerBall.r + 30 && player.z < 25) {
        const ang = Math.atan2(soccerBall.y - player.y, soccerBall.x - player.x);
        const kickSpd = player.inVehicle ? Math.max(10, player.inVehicle.speed * 1.5) : 9;
        soccerBall.vx = Math.cos(ang) * kickSpd;
        soccerBall.vy = Math.sin(ang) * kickSpd;
        playTone(180, 90, 0.12, "triangle", 0.12);
      }
      soccerBall.x += soccerBall.vx;
      soccerBall.y += soccerBall.vy;
      soccerBall.vx *= 0.96;
      soccerBall.vy *= 0.96;

      // Keep ball inside Park pitch bounds (960..1380, 960..1320)
      if (soccerBall.x < 980)  { soccerBall.x = 980;  soccerBall.vx = Math.abs(soccerBall.vx); }
      if (soccerBall.x > 1360) { soccerBall.x = 1360; soccerBall.vx = -Math.abs(soccerBall.vx); }
      if (soccerBall.y < 960)  { soccerBall.y = 960;  soccerBall.vy = Math.abs(soccerBall.vy); }
      if (soccerBall.y > 1320) { soccerBall.y = 1320; soccerBall.vy = -Math.abs(soccerBall.vy); }

      // Check Left or Right Goal Net!
      const inLeftGoal = (soccerBall.x < soccerGoalLeft.x + soccerGoalLeft.w &&
                          soccerBall.y > soccerGoalLeft.y && soccerBall.y < soccerGoalLeft.y + soccerGoalLeft.h);
      const inRightGoal = (soccerBall.x > soccerGoalRight.x &&
                           soccerBall.y > soccerGoalRight.y && soccerBall.y < soccerGoalRight.y + soccerGoalRight.h);
      if (inLeftGoal || inRightGoal) {
        score += 1000;
        coins += 15;
        sfxGoal();
        addParticle(soccerBall.x, soccerBall.y - 20, 0, -2.5, "#fde047", 24, 75, "GOOOOOOAL!! +1000");
        for (let k = 0; k < 24; k++) {
          const a = (k / 24) * Math.PI * 2;
          addParticle(soccerBall.x, soccerBall.y, Math.cos(a) * 6, Math.sin(a) * 6,
                      ["#ef4444", "#38bdf8", "#facc15", "#4ade80"][k % 4], 7, 45);
        }
        soccerBall.x = 1170;
        soccerBall.y = 1150;
        soccerBall.vx = 0;
        soccerBall.vy = 0;
      }
    }

    // Update Projectiles
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      for (const mt of mission.targets) {
        if (mt.done) continue;
        if (Math.hypot(p.x - mt.x, p.y - mt.y) < mt.r + p.r) {
          if (mt.type === "fire" && p.kind === "water") {
            mt.hp -= 4;
            p.life = 0;
            addParticle(mt.x, mt.y, (Math.random() - 0.5) * 3, -2, "#bae6fd", 8, 20);
            if (mt.hp <= 0) completeMissionTarget(mt);
          } else if (mt.type === "pizza_zone" && p.kind === "pizza") {
            p.life = 0;
            completeMissionTarget(mt);
          } else if (mt.type === "kid" && p.kind === "icecream") {
            p.life = 0;
            completeMissionTarget(mt);
          }
        }
      }
      if (p.life <= 0) projectiles.splice(i, 1);
    }

    // Update Mission Targets (including direct drive-up delivery & Robo-Pup movement)
    for (const mt of mission.targets) {
      if (mt.done) continue;
      if (mt.type === "robopup") {
        mt.x += mt.vx;
        mt.y += mt.vy;
        if (mt.x < 350 || mt.x > 2000) mt.vx = -mt.vx;
        if (mt.y < 350 || mt.y > 2200) mt.vy = -mt.vy;
      }
      const dist = Math.hypot(player.x - mt.x, player.y - mt.y);
      if (dist < mt.r + 36) {
        if (mt.type === "pizza_zone" || mt.type === "kid" || mt.type === "robopup") {
          completeMissionTarget(mt);
        }
      }
    }

    // Update Particles & Tire Marks
    for (let i = particles.length - 1; i >= 0; i--) {
      const pt = particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.life--;
      if (pt.life <= 0) particles.splice(i, 1);
    }
    for (let i = tireMarks.length - 1; i >= 0; i--) {
      if (--tireMarks[i].life <= 0) tireMarks.splice(i, 1);
    }

    // Smooth Camera Follow with Velocity Lookahead
    const targetCamX = player.x - W / 2 + (player.inVehicle ? Math.cos(player.angle) * player.inVehicle.speed * 10 : 0);
    const targetCamY = player.y - H / 2 + (player.inVehicle ? Math.sin(player.angle) * player.inVehicle.speed * 10 : 0);
    camera.x += (Math.max(0, Math.min(WORLD_W - W, targetCamX)) - camera.x) * 0.14;
    camera.y += (Math.max(0, Math.min(WORLD_H - H, targetCamY)) - camera.y) * 0.14;
  }

  function drawVehicle(v) {
    const sx = v.x - camera.x;
    const sy = v.y - camera.y;
    if (sx < -120 || sx > W + 120 || sy < -120 || sy > H + 120) return;

    const def = v.type;
    // Shadow on ground
    ctx.save();
    ctx.translate(sx, sy + 6);
    ctx.rotate(v.angle);
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.beginPath();
    ctx.roundRect(-def.w / 2, -def.h / 2, def.w, def.h, 8);
    ctx.fill();
    ctx.restore();

    // Vehicle Body raised by altitude z
    const scale = 1 + v.z * 0.0045;
    ctx.save();
    ctx.translate(sx, sy - v.z);
    ctx.scale(scale, scale);
    ctx.rotate(v.angle);

    if (def.id === "DINO") {
      // Friendly Rideable Emerald Rex!
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.ellipse(0, 0, 28, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(-4, 0, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#34d399";
      ctx.beginPath();
      ctx.arc(24, 0, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(28, -5, 4, 0, Math.PI * 2);
      ctx.arc(28, 5, 4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Wheels (unless Boat or Heli)
      if (!def.canSwim && !def.canFly) {
        ctx.fillStyle = "#0f172a";
        const ww = def.monster ? 18 : 12;
        const wh = def.monster ? 10 : 6;
        ctx.fillRect(-def.w * 0.35, -def.h / 2 - wh + 2, ww, wh);
        ctx.fillRect(def.w * 0.20,  -def.h / 2 - wh + 2, ww, wh);
        ctx.fillRect(-def.w * 0.35, def.h / 2 - 2, ww, wh);
        ctx.fillRect(def.w * 0.20,  def.h / 2 - 2, ww, wh);
      }

      // Main Chassis
      ctx.fillStyle = def.color;
      ctx.beginPath();
      ctx.roundRect(-def.w / 2, -def.h / 2, def.w, def.h, def.id === "BOAT" ? 18 : 9);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#0f172a";
      ctx.stroke();

      // Racing Stripe / Trim
      ctx.fillStyle = def.stripe;
      ctx.fillRect(-def.w * 0.38, -5, def.w * 0.76, 10);

      // Windshield
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.roundRect(4, -def.h * 0.36, 16, def.h * 0.72, 4);
      ctx.fill();

      // Headlights
      ctx.fillStyle = "#fef08a";
      ctx.fillRect(def.w / 2 - 4, -def.h / 2 + 4, 4, 7);
      ctx.fillRect(def.w / 2 - 4, def.h / 2 - 11, 4, 7);

      // Flashing Siren Lightbar (Fire Engine & Police Cruiser)
      if (def.siren) {
        const flash = (tick >> 3) & 1;
        ctx.fillStyle = flash ? "#ef4444" : "#3b82f6";
        ctx.fillRect(-6, -def.h * 0.32, 8, def.h * 0.32);
        ctx.fillStyle = flash ? "#3b82f6" : "#ef4444";
        ctx.fillRect(-6, 0, 8, def.h * 0.32);
      }

      // Fire Engine Ladder
      if (def.id === "FIRE") {
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 3;
        ctx.strokeRect(-def.w * 0.42, -7, def.w * 0.48, 14);
      }

      // Ice Cream Cone Roof Topper
      if (def.id === "ICECREAM") {
        ctx.fillStyle = "#fde047";
        ctx.beginPath();
        ctx.arc(-6, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#f43f5e";
        ctx.beginPath();
        ctx.arc(-6, 0, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Helicopter Spinning Rotor Blades
      if (def.id === "HELI") {
        ctx.save();
        ctx.rotate(v.rotorAngle);
        ctx.fillStyle = "rgba(248, 250, 252, 0.85)";
        ctx.fillRect(-46, -3, 92, 6);
        ctx.fillRect(-3, -46, 6, 92);
        ctx.restore();
      }
    }
    ctx.restore();

    // Show "HOP IN [E]" prompt when Leo is on foot nearby
    if (!player.inVehicle && Math.hypot(player.x - v.x, player.y - v.y) < 95) {
      ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
      ctx.beginPath();
      ctx.roundRect(sx - 72, sy - 54, 144, 24, 6);
      ctx.fill();
      ctx.fillStyle = "#4ade80";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("PRESS E: " + def.name.split(" ")[0].toUpperCase(), sx, sy - 38);
    }
  }

  function renderGame() {
    ctx.clearRect(0, 0, W, H);

    // 1. Lush Green Park Grass Base
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    // 2. Sunny Beach Sand & Ocean Bay + East River Canal
    ctx.fillStyle = "#fde68a"; // Golden Beach Sand
    ctx.fillRect(0, 2300, WORLD_W, 300);

    ctx.fillStyle = "#0284c7"; // Deep Ocean & River Water
    ctx.fillRect(0, 2560, WORLD_W, WORLD_H - 2560);
    ctx.fillRect(2090, 0, 120, 2560);

    // Animated Water Waves
    ctx.fillStyle = "#38bdf8";
    for (let wy = 2600; wy < WORLD_H; wy += 90) {
      for (let wx = 100; wx < WORLD_W; wx += 160) {
        const shift = Math.sin(tick * 0.05 + wy) * 18;
        ctx.fillRect(wx + shift, wy, 48, 6);
      }
    }

    // Wooden Marina Dock
    ctx.fillStyle = "#92400e";
    ctx.fillRect(1360, 2500, 120, 240);

    // 3. Paved City Road Network & Stunt Airport Runway
    ctx.fillStyle = "#334155";
    const roadAvenuesX = [280, 820, 1400, 2020];
    const roadStreetsY = [280, 740, 1340, 1940, 2260];
    for (const rx of roadAvenuesX) ctx.fillRect(rx - 70, 200, 140, 2120);
    for (const ry of roadStreetsY) ctx.fillRect(200, ry - 65, 2650, 130);

    // River Bridges
    ctx.fillStyle = "#64748b";
    ctx.fillRect(2070, 840, 160, 140);
    ctx.fillRect(2070, 1440, 160, 140);

    // Stunt Airport Tarmac & Helipad (East of River)
    ctx.fillStyle = "#475569";
    ctx.fillRect(2680, 380, 460, 1400);
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 4;
    ctx.strokeRect(2880, 480, 160, 160);
    ctx.fillStyle = "#facc15";
    ctx.font = "bold 64px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("H", 2960, 582);

    // Dashed Yellow Road Center Lines
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 3;
    ctx.setLineDash([22, 22]);
    for (const rx of roadAvenuesX) {
      ctx.beginPath();
      ctx.moveTo(rx, 240);
      ctx.lineTo(rx, 2280);
      ctx.stroke();
    }
    for (const ry of roadStreetsY) {
      ctx.beginPath();
      ctx.moveTo(240, ry);
      ctx.lineTo(2640, ry);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // 4. Central Park Soccer Field (x: 960..1380, y: 960..1320)
    ctx.fillStyle = "#16a34a";
    ctx.fillRect(960, 960, 420, 360);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.strokeRect(980, 980, 380, 320);
    ctx.beginPath();
    ctx.arc(1170, 1140, 46, 0, Math.PI * 2);
    ctx.stroke();
    // Goal Nets
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.fillRect(soccerGoalLeft.x, soccerGoalLeft.y, soccerGoalLeft.w, soccerGoalLeft.h);
    ctx.fillRect(soccerGoalRight.x, soccerGoalRight.y, soccerGoalRight.w, soccerGoalRight.h);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("SOCCER PARK - KICK OR RAM BALL INTO GOAL!", 1170, 974);

    // 5. Drift Tire Marks
    ctx.fillStyle = "rgba(15, 23, 42, 0.35)";
    for (const tm of tireMarks) {
      ctx.beginPath();
      ctx.arc(tm.x, tm.y, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // 6. Yellow Stunt Ramps
    for (const rm of ramps) {
      ctx.fillStyle = "#facc15";
      ctx.fillRect(rm.x, rm.y, rm.w, rm.h);
      ctx.strokeStyle = "#ca8a04";
      ctx.lineWidth = 3;
      ctx.strokeRect(rm.x, rm.y, rm.w, rm.h);
      ctx.fillStyle = "#dc2626";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("▲ " + rm.label + " ▲", rm.x + rm.w / 2, rm.y + rm.h / 2 + 4);
    }

    // 7. Mission Targets
    for (const mt of mission.targets) {
      if (mt.done) continue;
      const pulse = 1 + Math.sin(tick * 0.12) * 0.12;
      ctx.save();
      ctx.translate(mt.x, mt.y);
      if (mt.type === "fire") {
        // Smoking Popcorn Cart!
        ctx.fillStyle = "#dc2626";
        ctx.fillRect(-20, -14, 40, 28);
        ctx.fillStyle = (tick & 4) ? "#f97316" : "#facc15";
        ctx.beginPath();
        ctx.arc(0, -18, 18 * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12px sans-serif";
        ctx.fillText("SPRAY WATER [Z]!", 0, -40);
      } else if (mt.type === "pizza_zone") {
        ctx.strokeStyle = "#4ade80";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(0, 0, mt.r * pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#fef08a";
        ctx.font = "bold 13px sans-serif";
        ctx.fillText("PIZZA DROP ZONE", 0, -mt.r - 10);
      } else if (mt.type === "kid") {
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#f472b6";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, mt.r * pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12px sans-serif";
        ctx.fillText("ICE CREAM PLEASE!", 0, -26);
      } else if (mt.type === "robopup") {
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.roundRect(-18, -14, 36, 28, 8);
        ctx.fill();
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 12px sans-serif";
        ctx.fillText("ROBO-PUP!", 0, -22);
      } else if (mt.type === "stunt_ring") {
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, 42 * pulse, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 8. Props & Giant Soccer Ball
    for (const pr of props) {
      if (pr.type === "hydrant") {
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, 9, 0, Math.PI * 2);
        ctx.fill();
        if (pr.geyserTimer > 0) {
          ctx.fillStyle = "rgba(56, 189, 248, 0.75)";
          ctx.beginPath();
          ctx.arc(pr.x, pr.y - 18, 16 + Math.sin(tick * 0.3) * 5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (pr.type === "cone") {
        ctx.fillStyle = "#f97316";
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, 8, 0, Math.PI * 2);
        ctx.fill();
      } else if (pr.type === "beachball") {
        ctx.fillStyle = "#f43f5e";
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fef08a";
        ctx.beginPath();
        ctx.arc(pr.x - 4, pr.y - 4, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Giant Park Soccer Ball
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(soccerBall.x, soccerBall.y, soccerBall.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#0f172a";
    ctx.stroke();
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(soccerBall.x, soccerBall.y, 8, 0, Math.PI * 2);
    ctx.fill();

    // 9. Vehicles
    for (const v of vehicles) {
      drawVehicle(v);
    }

    // 10. Hero Leo on Foot (when not inside a vehicle)
    if (!player.inVehicle) {
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.rotate(player.angle);
      // Red Hero Cape/Scarf
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(-16, -7, 12, 14);
      // Blue Overalls & Red Cap
      ctx.fillStyle = "#2563eb";
      ctx.beginPath();
      ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fde047";
      ctx.beginPath();
      ctx.arc(4, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(2, 0, 9, -1.2, 1.2);
      ctx.fill();
      ctx.restore();
    }

    // 11. 2.5D Extruded City Buildings
    for (const b of buildings) {
      // Drop shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
      ctx.fillRect(b.x + 14, b.y + 18, b.w, b.h);
      // Front 3D Facade Wall
      ctx.fillStyle = b.wall;
      ctx.fillRect(b.x, b.y, b.w, b.h);
      // Extruded Roof
      ctx.fillStyle = b.roof;
      ctx.fillRect(b.x, b.y - b.height, b.w, b.h - 14);
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 2;
      ctx.strokeRect(b.x, b.y - b.height, b.w, b.h - 14);

      // Building Label Sign
      ctx.fillStyle = "rgba(15, 23, 42, 0.78)";
      ctx.beginPath();
      ctx.roundRect(b.x + b.w / 2 - 95, b.y + b.h / 2 - 28, 190, 32, 8);
      ctx.fill();
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 15px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(b.label, b.x + b.w / 2, b.y + b.h / 2 - 7);
    }

    // 12. Projectiles & Floating Particles
    for (const p of projectiles) {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    for (const pt of particles) {
      if (pt.text) {
        ctx.fillStyle = pt.color;
        ctx.font = "bold 18px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(pt.text, pt.x, pt.y);
      } else {
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();

    // 13. Golden Mission Compass Arrow pointing to next active Mission Target!
    const nextTarget = mission.targets.find((t) => !t.done);
    if (nextTarget) {
      const ang = Math.atan2(nextTarget.y - player.y, nextTarget.x - player.x);
      const dist = Math.hypot(nextTarget.x - player.x, nextTarget.y - player.y);
      if (dist > 140) {
        const ax = W / 2 + Math.cos(ang) * 150;
        const ay = H / 2 + Math.sin(ang) * 120;
        ctx.save();
        ctx.translate(ax, ay);
        ctx.rotate(ang);
        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        ctx.moveTo(22, 0);
        ctx.lineTo(-12, -13);
        ctx.lineTo(-6, 0);
        ctx.lineTo(-12, 13);
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#0f172a";
        ctx.stroke();
        ctx.restore();
      }
    }

    // 14. Top HUD Bar & Mini-Map Radar
    ctx.fillStyle = "rgba(15, 23, 42, 0.86)";
    ctx.beginPath();
    ctx.roundRect(16, 12, W - 220, 56, 14);
    ctx.fill();

    ctx.fillStyle = "#fde047";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "left";
    const curRide = player.inVehicle ? player.inVehicle.type.name : "On Foot (Junior Mayor Leo)";
    ctx.fillText(`⭐ SCORE: ${score}   🪙 COINS: ${coins}   🚗 RIDE: ${curRide}`, 32, 36);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(`${mission.title} (${mission.progress}/${mission.goal}) — ${mission.desc}   [Press M: Next Mission]`, 32, 58);

    // Top-Right Mini-Map Radar (170x170)
    const mapX = W - 186;
    const mapY = 12;
    const mapS = 170;
    ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
    ctx.beginPath();
    ctx.roundRect(mapX, mapY, mapS, mapS, 12);
    ctx.fill();
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.stroke();

    const mScale = mapS / WORLD_W;
    // Mini buildings
    ctx.fillStyle = "#64748b";
    for (const b of buildings) {
      ctx.fillRect(mapX + b.x * mScale, mapY + b.y * mScale, b.w * mScale, b.h * mScale);
    }
    // Mini vehicles
    ctx.fillStyle = "#ffffff";
    for (const v of vehicles) {
      ctx.fillRect(mapX + v.x * mScale - 2, mapY + v.y * mScale - 2, 4, 4);
    }
    // Mini mission targets
    ctx.fillStyle = "#facc15";
    for (const mt of mission.targets) {
      if (!mt.done) {
        ctx.beginPath();
        ctx.arc(mapX + mt.x * mScale, mapY + mt.y * mScale, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // Player dot on Mini-Map
    ctx.fillStyle = "#4ade80";
    ctx.beginPath();
    ctx.arc(mapX + player.x * mScale, mapY + player.y * mScale, 5, 0, Math.PI * 2);
    ctx.fill();

    // Bottom Banner / Controls Guide
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.beginPath();
    ctx.roundRect(W / 2 - 430, H - 46, 860, 34, 10);
    ctx.fill();
    ctx.fillStyle = bannerTimer > 0 ? "#4ade80" : "#e2e8f0";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      bannerTimer > 0
        ? bannerText
        : "ARROWS/WASD: Drive Anywhere  |  E / ENTER: Hop In/Out of Vehicle  |  Z: Water Cannon / Treats  |  SPACE: Nitro",
      W / 2,
      H - 24
    );

    // Title Screen Overlay
    if (gameState === "title") {
      ctx.fillStyle = "rgba(9, 13, 22, 0.82)";
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.roundRect(W / 2 - 360, H / 2 - 210, 720, 420, 24);
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#facc15";
      ctx.stroke();

      ctx.fillStyle = "#fde047";
      ctx.font = "900 44px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("SUPER LEO CITY", W / 2, H / 2 - 140);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("HERO PATROL, 8 VEHICLES, RIDEABLE DINO & STUNT SANDBOX!", W / 2, H / 2 - 102);

      const lines = [
        "🏎️  Hop In & Out of Sports Cars, Fire Trucks, Police Cruisers & Monster Trucks!",
        "🚁  Fly the Rescue Helicopter at the Airport or drive the Speedboat in the Bay!",
        "🦖  Visit Dino Safari Park to ride Emerald Rex right down Main Street!",
        "🚒  Spray the Fire Engine Water Cannon, deliver Pizzas & score Soccer Goals!",
        "🎮  Controls: ARROWS/WASD = Drive  |  E / ENTER = Hop In/Out  |  Z = Action  |  SPACE = Nitro"
      ];
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 16px sans-serif";
      lines.forEach((ln, idx) => {
        ctx.fillText(ln, W / 2, H / 2 - 45 + idx * 34);
      });

      ctx.fillStyle = "#4ade80";
      ctx.font = "900 24px sans-serif";
      ctx.fillText("PRESS ENTER OR SPACE TO PLAY!", W / 2, H / 2 + 165);
    }
  }

  function loop() {
    if (gameState === "title") {
      tick++;
      if (justPressed("Enter") || justPressed("Space") || justPressed("KeyE")) {
        initAudio();
        gameState = "playing";
        sfxGoal();
      }
      renderGame();
    } else {
      updateGame();
      renderGame();
    }
    Object.assign(prevKeys, keys);
    requestAnimationFrame(loop);
  }

  setupCity();
  requestAnimationFrame(loop);
})();
