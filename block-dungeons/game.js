/**
 * Block Dungeons Arcade — WebGL 3D Voxel Dungeon Crawler
 * Built with Three.js & Postprocessing
 */

(function() {
  'use strict';

  // =========================================================================
  // 1. CONSTANTS & CARD DATABASE (20 Collectible Arcade Cards)
  // =========================================================================
  const STORAGE_KEY = 'blockDungeonsSave_v1';

  const CARD_DATABASE = [
    // --- SLOT 1: MELEE SPARK TOOLS (4) ---
    {
      id: 'emerald_pickaxe',
      slot: 1,
      name: 'Emerald Pickaxe',
      category: 'melee',
      rarity: 1,
      damage: 22,
      cooldown: 0.28,
      range: 2.2,
      icon: 'pickaxe',
      desc: 'Sharp crystalline pickaxe. Grants +50% bonus emerald drops on hits and crate smashes.'
    },
    {
      id: 'whirlwind_hammer',
      slot: 1,
      name: 'Whirlwind Hammer',
      category: 'melee',
      rarity: 2,
      damage: 28,
      cooldown: 0.55,
      range: 3.4,
      icon: 'hammer',
      desc: 'Heavy war hammer with 360° spin shockwave that sends surrounding monsters flying.'
    },
    {
      id: 'sunburst_gauntlets',
      slot: 1,
      name: 'Sunburst Gauntlets',
      category: 'melee',
      rarity: 3,
      damage: 14,
      cooldown: 0.16,
      range: 1.8,
      icon: 'gauntlet',
      desc: 'Rapid-fire solar fists. Delivers a blinding 3-hit flurry of blazing punch sparks.'
    },
    {
      id: 'frost_scythe',
      slot: 1,
      name: 'Frost Scythe',
      category: 'melee',
      rarity: 3,
      damage: 25,
      cooldown: 0.45,
      range: 3.0,
      icon: 'scythe',
      desc: 'Glacial crescent blade. Chills enemies in a wide arc, reducing movement & attack speed by 50%.'
    },

    // --- SLOT 2: RANGED LAUNCHERS (4) ---
    {
      id: 'firework_crossbow',
      slot: 2,
      name: 'Firework Crossbow',
      category: 'ranged',
      rarity: 1,
      damage: 26,
      cooldown: 0.45,
      speed: 18,
      icon: 'firework_bow',
      desc: 'Fires sparkling rockets that burst into festive starburst AoE explosions on impact.'
    },
    {
      id: 'multi_bubble_bow',
      slot: 2,
      name: 'Multi-Bubble Bow',
      category: 'ranged',
      rarity: 2,
      damage: 15,
      cooldown: 0.38,
      speed: 16,
      icon: 'bubble_bow',
      desc: 'Enchanted reef bow firing a spread of 3 buoyant hydro bubbles across the room.'
    },
    {
      id: 'snowball_blaster',
      slot: 2,
      name: 'Snowball Blaster',
      category: 'ranged',
      rarity: 2,
      damage: 11,
      cooldown: 0.18,
      speed: 22,
      icon: 'snow_blaster',
      desc: 'Rapid-action snowball launcher that freezes and staggers advancing dungeon monsters.'
    },
    {
      id: 'prism_chakram',
      slot: 2,
      name: 'Prism Chakram',
      category: 'ranged',
      rarity: 3,
      damage: 20,
      cooldown: 0.50,
      speed: 15,
      icon: 'chakram',
      desc: 'Spinning neon ring blade that ricochets up to 4 times between dungeon walls and monsters.'
    },

    // --- SLOT 3: HERO ARMOR (4) ---
    {
      id: 'adventurer_tunic',
      slot: 3,
      name: 'Adventurer Tunic',
      category: 'armor',
      rarity: 1,
      speedBonus: 1.25,
      icon: 'tunic',
      desc: 'Lightweight forest tunic with leather buckles. Grants +25% sprint speed and base guard.'
    },
    {
      id: 'fox_hoodie',
      slot: 3,
      name: 'Fox Hoodie',
      category: 'armor',
      rarity: 2,
      magnetRange: 7.0,
      icon: 'fox_hood',
      desc: 'Cozy fox cowl with pointed ears. Creates an emerald & apple magnetic aura around the hero.'
    },
    {
      id: 'diamond_knight_plate',
      slot: 3,
      name: 'Diamond Knight Plate',
      category: 'armor',
      rarity: 3,
      extraHearts: 2,
      damageReduction: 0.30,
      icon: 'knight_plate',
      desc: 'Reinforced cyan diamond armor. Adds 2 extra Max Hearts and absorbs 30% incoming damage.'
    },
    {
      id: 'glow_squid_robe',
      slot: 3,
      name: 'Glow-Squid Robe',
      category: 'armor',
      rarity: 3,
      superRechargeBonus: 2.0,
      icon: 'squid_robe',
      desc: 'Bioluminescent deep ocean robe. Super Artifact gauge recharges 100% faster from attacks.'
    },

    // --- SLOT 4: PET COMPANION (4) ---
    {
      id: 'baby_wolf',
      slot: 4,
      name: 'Baby Wolf Pup',
      category: 'pet',
      rarity: 1,
      petType: 'wolf',
      icon: 'wolf_pup',
      desc: 'Loyal voxel puppy trotting beside you. Leaps forward to bite and stagger attacking slimes.'
    },
    {
      id: 'arctic_fox',
      slot: 4,
      name: 'Arctic Fox',
      category: 'pet',
      rarity: 2,
      petType: 'fox',
      icon: 'arctic_fox',
      desc: 'Nimble snow fox with a fluffy tail. Swiftly dashes to collect distant emeralds and food.'
    },
    {
      id: 'mini_iron_golem',
      slot: 4,
      name: 'Mini Iron Golem',
      category: 'pet',
      rarity: 3,
      petType: 'golem',
      icon: 'iron_golem',
      desc: 'Sturdy mini golem holding a red flower. Slams the ground with shockwaves when foes crowd you.'
    },
    {
      id: 'golden_axolotl',
      slot: 4,
      name: 'Golden Axolotl',
      category: 'pet',
      rarity: 3,
      petType: 'axolotl',
      icon: 'axolotl',
      desc: 'Floating cute axolotl surrounded by bubbles. Periodically regenerates hearts for the party.'
    },

    // --- SLOT 5: SUPER ARTIFACT (4) ---
    {
      id: 'rainbow_beacon',
      slot: 5,
      name: 'Rainbow Beacon',
      category: 'super',
      rarity: 3,
      duration: 4.5,
      icon: 'beacon',
      desc: 'Focuses a sweeping neon rainbow prism beam that obliterates every monster in its path.'
    },
    {
      id: 'rocket_spin_boots',
      slot: 5,
      name: 'Rocket Spin Boots',
      category: 'super',
      rarity: 2,
      duration: 3.2,
      icon: 'rocket_boots',
      desc: 'Ignites twin turbo rockets for a whirlwind spin across the room, leaving flame explosions.'
    },
    {
      id: 'totem_of_healing',
      slot: 5,
      name: 'Totem of Healing',
      category: 'super',
      rarity: 2,
      duration: 6.0,
      icon: 'healing_totem',
      desc: 'Summons a radiant golden totem that pulses healing light, restoring all lost hearts.'
    },
    {
      id: 'buzzy_bee_hive',
      slot: 5,
      name: 'Buzzy Bee Hive',
      category: 'super',
      rarity: 3,
      duration: 5.5,
      icon: 'bee_hive',
      desc: 'Releases 3 furious voxel bumblebees that swarm, sting, and poison all nearby dungeon bosses.'
    }
  ];

  // =========================================================================
  // 2. SAVE SYSTEM & STATE
  // =========================================================================
  let gameState = {
    unlockedCards: {
      'emerald_pickaxe': { stars: 1 },
      'firework_crossbow': { stars: 1 },
      'adventurer_tunic': { stars: 1 },
      'baby_wolf': { stars: 1 },
      'rainbow_beacon': { stars: 1 }
    },
    deck: [
      'emerald_pickaxe',
      'firework_crossbow',
      'adventurer_tunic',
      'baby_wolf',
      'rainbow_beacon'
    ],
    emeralds: 0,
    totalRescued: 0,
    currentStage: 1,
    coopBuddyEnabled: true,
    coopBuddyIsAI: true,
    bloomEnabled: true,
    audioEnabled: true
  };

  function loadSavedData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.unlockedCards && parsed.deck) {
          gameState.unlockedCards = parsed.unlockedCards;
          gameState.deck = parsed.deck;
          gameState.emeralds = parsed.emeralds || 0;
          gameState.totalRescued = parsed.totalRescued || 0;
        }
      }
    } catch (e) {
      console.warn('Could not load localStorage save:', e);
    }
  }

  function saveGameData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        unlockedCards: gameState.unlockedCards,
        deck: gameState.deck,
        emeralds: gameState.emeralds,
        totalRescued: gameState.totalRescued
      }));
    } catch (e) {
      console.warn('Could not write localStorage save:', e);
    }
  }

  // Pre-unlock showcase deck when requested
  function unlockShowcaseDeck() {
    CARD_DATABASE.forEach((c) => {
      gameState.unlockedCards[c.id] = { stars: c.rarity };
    });
    gameState.deck = [
      'whirlwind_hammer',
      'firework_crossbow',
      'fox_hoodie',
      'baby_wolf',
      'rainbow_beacon'
    ];
  }

  // =========================================================================
  // 3. PROCEDURAL 16x16 PIXEL-ART TEXTURE GENERATOR
  // =========================================================================
  const proceduralTextures = {};

  function createPixelTexture(drawFn) {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    drawFn(ctx);

    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    return tex;
  }

  function initProceduralTextures() {
    // 1. Cobblestone Floor
    proceduralTextures.cobble = createPixelTexture((ctx) => {
      ctx.fillStyle = '#525e6e';
      ctx.fillRect(0, 0, 16, 16);
      const stones = [
        { x: 0, y: 0, w: 7, h: 7, c: '#788496' },
        { x: 8, y: 0, w: 8, h: 6, c: '#64748b' },
        { x: 0, y: 8, w: 9, h: 8, c: '#717d8e' },
        { x: 10, y: 7, w: 6, h: 9, c: '#788496' }
      ];
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      stones.forEach(s => {
        ctx.fillStyle = s.c;
        ctx.fillRect(s.x, s.y, s.w, s.h);
        ctx.strokeRect(s.x + 0.5, s.y + 0.5, s.w - 1, s.h - 1);
      });
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(2, 2, 2, 2);
      ctx.fillRect(11, 9, 2, 2);
    });

    // 2. Mossy Cobble (Stage 1)
    proceduralTextures.mossy_cobble = createPixelTexture((ctx) => {
      ctx.drawImage(proceduralTextures.cobble.image, 0, 0);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(3, 4, 3, 2);
      ctx.fillRect(2, 5, 4, 2);
      ctx.fillRect(11, 2, 3, 3);
      ctx.fillStyle = '#15803d';
      ctx.fillRect(4, 5, 2, 2);
      ctx.fillRect(12, 3, 2, 1);
    });

    // 3. Stone Brick Walls
    proceduralTextures.stone_brick = createPixelTexture((ctx) => {
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 0, 16, 16);
      // Row 1
      ctx.fillStyle = '#64748b';
      ctx.fillRect(0, 0, 7, 7);
      ctx.fillRect(8, 0, 8, 7);
      // Row 2
      ctx.fillRect(0, 8, 15, 7);
      // Mortar highlights & cracks
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(1, 1, 2, 1);
      ctx.fillRect(9, 1, 3, 1);
      ctx.fillRect(3, 9, 4, 1);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 7, 16, 1);
      ctx.fillRect(7, 0, 1, 7);
    });

    // 4. Grass Top & Side
    proceduralTextures.grass_top = createPixelTexture((ctx) => {
      ctx.fillStyle = '#15803d';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#22c55e';
      for (let i = 0; i < 16; i += 3) {
        for (let j = 0; j < 16; j += 3) {
          if ((i + j) % 2 === 0) ctx.fillRect(i, j, 2, 2);
        }
      }
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(4, 4, 3, 3);
      ctx.fillRect(10, 8, 3, 3);
    });

    // 5. Wood Crate (Destructible)
    proceduralTextures.wood_crate = createPixelTexture((ctx) => {
      ctx.fillStyle = '#b45309';
      ctx.fillRect(0, 0, 16, 16);
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, 15, 15);
      // Diagonal cross brace
      ctx.beginPath();
      ctx.moveTo(1, 1); ctx.lineTo(15, 15);
      ctx.moveTo(15, 1); ctx.lineTo(1, 15);
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Iron studs on 4 corners
      ctx.fillStyle = '#475569';
      ctx.fillRect(1, 1, 2, 2);
      ctx.fillRect(13, 1, 2, 2);
      ctx.fillRect(1, 13, 2, 2);
      ctx.fillRect(13, 13, 2, 2);
    });

    // 6. Pumpkin Side & Face (Stage 2)
    proceduralTextures.pumpkin_side = createPixelTexture((ctx) => {
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#c2410c';
      ctx.fillRect(3, 0, 2, 16);
      ctx.fillRect(8, 0, 2, 16);
      ctx.fillRect(13, 0, 2, 16);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(1, 0, 1, 16);
      ctx.fillRect(6, 0, 1, 16);
      ctx.fillRect(11, 0, 1, 16);
    });

    proceduralTextures.pumpkin_face = createPixelTexture((ctx) => {
      ctx.drawImage(proceduralTextures.pumpkin_side.image, 0, 0);
      ctx.fillStyle = '#fef08a'; // Glowing yellow eyes & mouth
      ctx.fillRect(3, 4, 3, 3);
      ctx.fillRect(10, 4, 3, 3);
      ctx.fillRect(7, 7, 2, 2); // nose
      ctx.fillRect(4, 11, 8, 3); // mouth
      ctx.fillStyle = '#78350f'; // tooth notch
      ctx.fillRect(6, 11, 2, 1);
      ctx.fillRect(9, 13, 2, 1);
    });

    // 7. Hay Bales
    proceduralTextures.hay_side = createPixelTexture((ctx) => {
      ctx.fillStyle = '#d97706';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#f59e0b';
      for (let i = 0; i < 16; i += 2) ctx.fillRect(i, 0, 1, 16);
      // Red twine ties
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(0, 4, 16, 2);
      ctx.fillRect(0, 10, 16, 2);
    });

    // 8. Redstone Crystal & Ore (Stage 3)
    proceduralTextures.redstone_ore = createPixelTexture((ctx) => {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(3, 3, 3, 3);
      ctx.fillRect(10, 4, 4, 3);
      ctx.fillRect(4, 10, 3, 4);
      ctx.fillRect(11, 11, 3, 3);
      ctx.fillStyle = '#f87171';
      ctx.fillRect(4, 4, 1, 1);
      ctx.fillRect(11, 5, 2, 1);
      ctx.fillRect(5, 11, 1, 2);
    });

    // 9. Cyan Crystal
    proceduralTextures.cyan_crystal = createPixelTexture((ctx) => {
      ctx.fillStyle = '#0891b2';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(2, 2, 12, 12);
      ctx.fillStyle = '#67e8f9';
      ctx.fillRect(4, 4, 8, 8);
      ctx.fillStyle = '#cffafe';
      ctx.fillRect(6, 6, 4, 4);
    });

    // 10. Obsidian Royal Citadel with Gold Trim (Stage 4)
    proceduralTextures.obsidian_citadel = createPixelTexture((ctx) => {
      ctx.fillStyle = '#150d2a';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#26164a';
      ctx.fillRect(2, 2, 12, 12);
      // Polished Gold Border
      ctx.fillStyle = '#f59e0b';
      ctx.strokeRect(0.5, 0.5, 15, 15);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(1, 1, 2, 2);
      ctx.fillRect(13, 1, 2, 2);
      ctx.fillRect(1, 13, 2, 2);
      ctx.fillRect(13, 13, 2, 2);
      // Purple crystal center
      ctx.fillStyle = '#8b5cf6';
      ctx.fillRect(6, 6, 4, 4);
    });

    // 11. Water & Lava
    proceduralTextures.water = createPixelTexture((ctx) => {
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(0, 3, 8, 2);
      ctx.fillRect(8, 9, 8, 2);
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(2, 4, 3, 1);
      ctx.fillRect(10, 10, 3, 1);
    });

    proceduralTextures.lava = createPixelTexture((ctx) => {
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(2, 2, 12, 12);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(4, 4, 8, 8);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(6, 6, 4, 4);
    });

    // 12. Golden Loot Chest
    proceduralTextures.gold_chest = createPixelTexture((ctx) => {
      ctx.fillStyle = '#d97706';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(2, 2, 12, 12);
      ctx.fillStyle = '#334155'; // Iron bands
      ctx.fillRect(0, 6, 16, 2);
      ctx.fillRect(7, 5, 2, 4); // Lock
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(7, 6, 2, 2);
    });
  }

  // =========================================================================
  // 4. CARD ART CANVAS ICON GENERATOR
  // =========================================================================
  function renderCardArt(canvas, iconType) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.imageSmoothingEnabled = false;

    const s = w / 16; // Scale factor

    if (iconType === 'pickaxe') {
      // Emerald Pickaxe
      ctx.fillStyle = '#78350f'; // Handle
      for (let i = 2; i <= 12; i++) {
        ctx.fillRect((14 - i) * s, i * s, s, s);
      }
      ctx.fillStyle = '#10b981'; // Emerald head
      ctx.fillRect(2 * s, 2 * s, 6 * s, 2 * s);
      ctx.fillRect(2 * s, 4 * s, 2 * s, 3 * s);
      ctx.fillStyle = '#6ee7b7'; // Tip highlight
      ctx.fillRect(2 * s, 2 * s, 2 * s, 2 * s);
    } else if (iconType === 'hammer') {
      // Whirlwind Hammer
      ctx.fillStyle = '#64748b';
      ctx.fillRect(3 * s, 2 * s, 10 * s, 6 * s);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(4 * s, 3 * s, 8 * s, 4 * s);
      ctx.fillStyle = '#78350f'; // Handle
      ctx.fillRect(7 * s, 8 * s, 2 * s, 7 * s);
    } else if (iconType === 'gauntlet') {
      // Sunburst Gauntlet
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(4 * s, 5 * s, 8 * s, 8 * s);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(5 * s, 3 * s, 2 * s, 2 * s);
      ctx.fillRect(7 * s, 2 * s, 2 * s, 3 * s);
      ctx.fillRect(9 * s, 3 * s, 2 * s, 2 * s);
      ctx.fillStyle = '#ef4444'; // Gem
      ctx.fillRect(7 * s, 8 * s, 2 * s, 2 * s);
    } else if (iconType === 'scythe') {
      // Frost Scythe
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(3 * s, 2 * s, 10 * s, 2 * s);
      ctx.fillRect(11 * s, 4 * s, 3 * s, 3 * s);
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(4 * s, 2 * s, 4 * s, 1 * s);
      ctx.fillStyle = '#475569';
      ctx.fillRect(3 * s, 4 * s, 2 * s, 11 * s);
    } else if (iconType === 'firework_bow') {
      // Firework Crossbow
      ctx.fillStyle = '#b45309';
      ctx.fillRect(2 * s, 4 * s, 12 * s, 2 * s);
      ctx.fillRect(7 * s, 6 * s, 2 * s, 8 * s);
      ctx.fillStyle = '#ef4444'; // Rocket
      ctx.fillRect(6 * s, 2 * s, 4 * s, 5 * s);
      ctx.fillStyle = '#fbbf24'; // Sparks
      ctx.fillRect(5 * s, 1 * s, 2 * s, 2 * s);
      ctx.fillRect(9 * s, 1 * s, 2 * s, 2 * s);
    } else if (iconType === 'bubble_bow') {
      // Multi-Bubble Bow
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(3 * s, 3 * s, 3 * s, 10 * s);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(8 * s, 4 * s, 4 * s, 4 * s);
      ctx.fillRect(11 * s, 8 * s, 3 * s, 3 * s);
      ctx.fillRect(8 * s, 11 * s, 3 * s, 3 * s);
    } else if (iconType === 'snow_blaster') {
      // Snowball Blaster
      ctx.fillStyle = '#64748b';
      ctx.fillRect(3 * s, 6 * s, 10 * s, 4 * s);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(10 * s, 5 * s, 4 * s, 6 * s);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(4 * s, 7 * s, 4 * s, 2 * s);
    } else if (iconType === 'chakram') {
      // Prism Chakram
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2 * s;
      ctx.beginPath();
      ctx.arc(8 * s, 8 * s, 5 * s, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(7 * s, 2 * s, 2 * s, 2 * s);
      ctx.fillRect(7 * s, 12 * s, 2 * s, 2 * s);
    } else if (iconType === 'tunic') {
      // Adventurer Tunic
      ctx.fillStyle = '#15803d';
      ctx.fillRect(4 * s, 3 * s, 8 * s, 10 * s);
      ctx.fillStyle = '#78350f'; // Belt
      ctx.fillRect(4 * s, 8 * s, 8 * s, 2 * s);
      ctx.fillStyle = '#fbbf24'; // Buckle
      ctx.fillRect(7 * s, 8 * s, 2 * s, 2 * s);
    } else if (iconType === 'fox_hood') {
      // Fox Hood
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(3 * s, 4 * s, 10 * s, 9 * s);
      // Ears
      ctx.fillRect(3 * s, 1 * s, 3 * s, 3 * s);
      ctx.fillRect(10 * s, 1 * s, 3 * s, 3 * s);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(5 * s, 8 * s, 6 * s, 5 * s);
      ctx.fillStyle = '#1e293b'; // Nose
      ctx.fillRect(7 * s, 10 * s, 2 * s, 2 * s);
    } else if (iconType === 'knight_plate') {
      // Diamond Knight Plate
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(4 * s, 3 * s, 8 * s, 10 * s);
      ctx.fillStyle = '#cffafe';
      ctx.fillRect(6 * s, 5 * s, 4 * s, 6 * s);
      ctx.fillStyle = '#0e7490';
      ctx.fillRect(2 * s, 3 * s, 3 * s, 4 * s);
      ctx.fillRect(11 * s, 3 * s, 3 * s, 4 * s);
    } else if (iconType === 'squid_robe') {
      // Glow-Squid Robe
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(4 * s, 3 * s, 8 * s, 10 * s);
      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(5 * s, 5 * s, 2 * s, 2 * s);
      ctx.fillRect(9 * s, 5 * s, 2 * s, 2 * s);
      ctx.fillRect(6 * s, 9 * s, 4 * s, 2 * s);
    } else if (iconType === 'wolf_pup') {
      // Baby Wolf Pup
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(4 * s, 4 * s, 8 * s, 8 * s);
      // Ears
      ctx.fillStyle = '#64748b';
      ctx.fillRect(3 * s, 2 * s, 3 * s, 3 * s);
      ctx.fillRect(10 * s, 2 * s, 3 * s, 3 * s);
      ctx.fillStyle = '#1e293b'; // Eyes & nose
      ctx.fillRect(5 * s, 6 * s, 2 * s, 2 * s);
      ctx.fillRect(9 * s, 6 * s, 2 * s, 2 * s);
      ctx.fillRect(7 * s, 9 * s, 2 * s, 2 * s);
    } else if (iconType === 'arctic_fox') {
      // Arctic Fox
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(4 * s, 4 * s, 8 * s, 8 * s);
      ctx.fillStyle = '#38bdf8'; // Blue eyes
      ctx.fillRect(5 * s, 6 * s, 2 * s, 2 * s);
      ctx.fillRect(9 * s, 6 * s, 2 * s, 2 * s);
      ctx.fillStyle = '#1e293b'; // Nose
      ctx.fillRect(7 * s, 9 * s, 2 * s, 2 * s);
    } else if (iconType === 'iron_golem') {
      // Mini Iron Golem
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(4 * s, 3 * s, 8 * s, 9 * s);
      ctx.fillStyle = '#dc2626'; // Red eyes
      ctx.fillRect(5 * s, 6 * s, 2 * s, 2 * s);
      ctx.fillRect(9 * s, 6 * s, 2 * s, 2 * s);
      ctx.fillStyle = '#64748b'; // Big nose
      ctx.fillRect(7 * s, 7 * s, 2 * s, 3 * s);
      ctx.fillStyle = '#16a34a'; // Vine sprig
      ctx.fillRect(3 * s, 4 * s, 2 * s, 2 * s);
    } else if (iconType === 'axolotl') {
      // Golden Axolotl
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(4 * s, 5 * s, 8 * s, 7 * s);
      ctx.fillStyle = '#f472b6'; // Gills
      ctx.fillRect(2 * s, 4 * s, 2 * s, 4 * s);
      ctx.fillRect(12 * s, 4 * s, 2 * s, 4 * s);
      ctx.fillStyle = '#1e293b'; // Eyes
      ctx.fillRect(6 * s, 7 * s, 1 * s, 2 * s);
      ctx.fillRect(9 * s, 7 * s, 1 * s, 2 * s);
    } else if (iconType === 'beacon') {
      // Rainbow Beacon
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(4 * s, 10 * s, 8 * s, 4 * s);
      // Beam
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, '#ef4444');
      grad.addColorStop(0.3, '#f59e0b');
      grad.addColorStop(0.6, '#10b981');
      grad.addColorStop(1, '#8b5cf6');
      ctx.fillStyle = grad;
      ctx.fillRect(6 * s, 1 * s, 4 * s, 9 * s);
    } else if (iconType === 'rocket_boots') {
      // Rocket Spin Boots
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(4 * s, 4 * s, 6 * s, 7 * s);
      ctx.fillStyle = '#f59e0b'; // Wing
      ctx.fillRect(2 * s, 3 * s, 3 * s, 3 * s);
      // Exhaust fire
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(5 * s, 11 * s, 4 * s, 4 * s);
    } else if (iconType === 'healing_totem') {
      // Totem of Healing
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(5 * s, 3 * s, 6 * s, 10 * s);
      ctx.fillStyle = '#22c55e'; // Glowing heart
      ctx.fillRect(6 * s, 6 * s, 4 * s, 4 * s);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(3 * s, 4 * s, 2 * s, 3 * s);
      ctx.fillRect(11 * s, 4 * s, 2 * s, 3 * s);
    } else if (iconType === 'bee_hive') {
      // Buzzy Bee Hive
      ctx.fillStyle = '#d97706';
      ctx.fillRect(4 * s, 4 * s, 8 * s, 8 * s);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(5 * s, 6 * s, 6 * s, 2 * s);
      ctx.fillStyle = '#1e293b'; // Hole
      ctx.fillRect(7 * s, 9 * s, 2 * s, 2 * s);
    }
  }

  // =========================================================================
  // 5. PROCEDURAL WEBAUDIO API SYNTHESIZER
  // =========================================================================
  let audioCtx = null;
  let bgmOsc = null;
  let bgmGain = null;
  let bgmStep = 0;
  let bgmTimer = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, duration, type = 'sine', vol = 0.15) {
    if (!gameState.audioEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(vol, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // audio error safely suppressed
    }
  }

  function sfxBop() {
    playTone(180, 0.12, 'triangle', 0.25);
    playTone(90, 0.15, 'sawtooth', 0.2);
  }

  function sfxBow() {
    playTone(480, 0.08, 'sine', 0.18);
    playTone(320, 0.14, 'triangle', 0.15);
  }

  function sfxFirework() {
    playTone(600, 0.15, 'sine', 0.2);
    setTimeout(() => {
      playTone(120, 0.25, 'sawtooth', 0.3);
      playTone(80, 0.35, 'square', 0.25);
    }, 120);
  }

  function sfxDash() {
    playTone(300, 0.18, 'sine', 0.2);
  }

  function sfxSuper() {
    playTone(392, 0.15, 'square', 0.2);
    setTimeout(() => playTone(523.25, 0.15, 'square', 0.25), 100);
    setTimeout(() => playTone(659.25, 0.25, 'square', 0.3), 200);
    setTimeout(() => playTone(783.99, 0.45, 'sawtooth', 0.35), 300);
  }

  function sfxEmerald() {
    playTone(880, 0.08, 'sine', 0.2);
    setTimeout(() => playTone(1320, 0.12, 'sine', 0.25), 60);
  }

  function sfxCrateBreak() {
    playTone(140, 0.18, 'sawtooth', 0.25);
    playTone(70, 0.25, 'square', 0.2);
  }

  function sfxCageFree() {
    playTone(523.25, 0.1, 'triangle', 0.25);
    setTimeout(() => playTone(659.25, 0.1, 'triangle', 0.25), 90);
    setTimeout(() => playTone(783.99, 0.15, 'triangle', 0.3), 180);
    setTimeout(() => playTone(1046.5, 0.25, 'sine', 0.35), 270);
  }

  function sfxFanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playTone(freq, 0.35, 'triangle', 0.3);
      }, idx * 110);
    });
  }

  // Pentatonic Adventure BGM Arpeggiator
  function startBgm() {
    if (bgmTimer) clearInterval(bgmTimer);
    const chords = [
      [261.63, 329.63, 392.00, 523.25], // C
      [220.00, 261.63, 329.63, 440.00], // Am
      [174.61, 220.00, 261.63, 349.23], // F
      [196.00, 246.94, 293.66, 392.00]  // G
    ];
    let chordIdx = 0;
    bgmTimer = setInterval(() => {
      if (!gameState.audioEnabled || !audioCtx) return;
      const currentChord = chords[chordIdx];
      const freq = currentChord[bgmStep % 4];
      playTone(freq, 0.18, 'sine', 0.05);
      bgmStep++;
      if (bgmStep % 8 === 0) {
        chordIdx = (chordIdx + 1) % chords.length;
      }
    }, 240);
  }

  // =========================================================================
  // 6. THREE.JS SCENE, CAMERAS, SHADOWS & POSTPROCESSING
  // =========================================================================
  let scene, camera, renderer, composer, bloomPass;
  let ambientLight, dirLight, rimLight;
  const canvas = document.getElementById('gameCanvas');

  let stageGroup = null;
  let dynamicEntities = [];
  let projectiles = [];
  let particles = [];
  let floatingTexts = [];

  let player = null;
  let buddy = null;
  let pet = null;
  let activeBoss = null;
  let goldenChest = null;

  let dungeonBounds = { minX: -24, maxX: 24, minZ: -24, maxZ: 24 };

  function initThree() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x102028);
    scene.fog = new THREE.FogExp2(0x102028, 0.016);

    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 150);
    camera.position.set(16, 22, 16);
    camera.lookAt(0, 1, 0);

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting (Warm & Vibrant Minecraft Dungeons style)
    ambientLight = new THREE.AmbientLight(0xffffff, 0.88);
    scene.add(ambientLight);

    dirLight = new THREE.DirectionalLight(0xffffff, 1.05);
    dirLight.position.set(20, 35, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 80;
    dirLight.shadow.camera.left = -25;
    dirLight.shadow.camera.right = 25;
    dirLight.shadow.camera.top = 25;
    dirLight.shadow.camera.bottom = -25;
    scene.add(dirLight);

    // Subtle colored rim light
    rimLight = new THREE.DirectionalLight(0x38bdf8, 0.35);
    rimLight.position.set(-20, 15, -20);
    scene.add(rimLight);

    // Postprocessing Composer + UnrealBloomPass
    if (THREE.EffectComposer && THREE.RenderPass && THREE.UnrealBloomPass) {
      try {
        composer = new THREE.EffectComposer(renderer);
        const renderPass = new THREE.RenderPass(scene, camera);
        composer.addPass(renderPass);

        bloomPass = new THREE.UnrealBloomPass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          0.42, // strength
          0.35, // radius
          0.90  // threshold
        );
        composer.addPass(bloomPass);
      } catch (e) {
        console.warn('EffectComposer initialization failed, falling back to basic renderer:', e);
        composer = null;
      }
    }

    window.addEventListener('resize', onWindowResize);
  }

  function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (composer) {
      composer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  // =========================================================================
  // 7. INSTANCED VOXEL DUNGEON BUILDER (STAGES 1-4)
  // =========================================================================
  const STAGE_CONFIGS = [
    {
      id: 1,
      name: 'Mossy Creeper Woods',
      bossName: 'Giant Mossy Slime King',
      floorTex: 'mossy_cobble',
      wallTex: 'stone_brick',
      decorTex: 'grass_top',
      hazardTex: 'water',
      bgColor: 0x102028,
      ambientIntensity: 0.88,
      dirIntensity: 1.05,
      lightColor: 0x34d399
    },
    {
      id: 2,
      name: 'Pumpkin Pastures',
      bossName: 'Clockwork Scarecrow Golem',
      floorTex: 'cobble',
      wallTex: 'pumpkin_side',
      decorTex: 'hay_side',
      hazardTex: 'water',
      bgColor: 0x181008,
      ambientIntensity: 0.70,
      dirIntensity: 0.85,
      lightColor: 0xf59e0b
    },
    {
      id: 3,
      name: 'Redstone Crystal Mines',
      bossName: 'Redstone Toy Titan',
      floorTex: 'cobble',
      wallTex: 'redstone_ore',
      decorTex: 'cyan_crystal',
      hazardTex: 'lava',
      bgColor: 0x140b0d,
      ambientIntensity: 0.70,
      dirIntensity: 0.85,
      lightColor: 0xef4444
    },
    {
      id: 4,
      name: 'Obsidian Royal Citadel',
      bossName: 'Arch-Block Jester Mech',
      floorTex: 'obsidian_citadel',
      wallTex: 'stone_brick',
      decorTex: 'obsidian_citadel',
      hazardTex: 'lava',
      bgColor: 0x0d0918,
      ambientIntensity: 0.70,
      dirIntensity: 0.85,
      lightColor: 0x8b5cf6
    }
  ];

  let portcullisGate = null;
  let pressureSwitch = null;

  function buildStage(stageIndex) {
    if (stageGroup) {
      scene.remove(stageGroup);
    }
    stageGroup = new THREE.Group();
    scene.add(stageGroup);

    dynamicEntities = [];
    projectiles = [];
    particles = [];
    floatingTexts = [];
    activeBoss = null;
    goldenChest = null;
    portcullisGate = null;
    pressureSwitch = null;

    const cfg = STAGE_CONFIGS[stageIndex - 1] || STAGE_CONFIGS[0];
    scene.background.setHex(cfg.bgColor);
    scene.fog.color.setHex(cfg.bgColor);
    if (ambientLight) ambientLight.intensity = cfg.ambientIntensity !== undefined ? cfg.ambientIntensity : 0.88;
    if (dirLight) dirLight.intensity = cfg.dirIntensity !== undefined ? cfg.dirIntensity : 1.05;

    const boxGeo = new THREE.BoxGeometry(1, 1, 1);

    const floorMat = new THREE.MeshStandardMaterial({
      map: proceduralTextures[cfg.floorTex],
      roughness: 0.8,
      metalness: 0.1
    });
    const grassMat = new THREE.MeshStandardMaterial({
      map: proceduralTextures.grass_top,
      roughness: 0.8,
      metalness: 0.05
    });
    const wallMat = new THREE.MeshStandardMaterial({
      map: proceduralTextures[cfg.wallTex],
      roughness: 0.7,
      metalness: 0.2
    });
    const decorMat = new THREE.MeshStandardMaterial({
      map: proceduralTextures[cfg.decorTex],
      roughness: 0.6,
      metalness: 0.2
    });
    const hazardMat = new THREE.MeshStandardMaterial({
      map: proceduralTextures[cfg.hazardTex],
      roughness: 0.2,
      metalness: 0.8,
      emissive: cfg.hazardTex === 'lava' ? 0xff3300 : 0x004488,
      emissiveIntensity: 0.5
    });

    // 4 Connected Chambers Layout:
    // Room 1 (Courtyard): (X: -16..-4, Z: -6..6)
    // Bridge 1: (X: -4..0, Z: -2..2) over Hazard canal (Z: -12..12)
    // Room 2 (Puzzle Chamber with Switch): (X: 0..10, Z: -8..8)
    // Gate / Corridor: (X: 10..14, Z: -2..2)
    // Room 3 (Boss Arena): (X: 14..30, Z: -12..12)

    const floorTiles = [];
    const meadowTiles = [];
    const wallTiles = [];
    const hazardTiles = [];
    const decorTiles = [];

    // Helper to add floor
    function addFloor(x, z, y = 0) {
      floorTiles.push({ x, y, z });
    }
    function addWall(x, z, h = 2) {
      for (let y = 1; y <= h; y++) {
        wallTiles.push({ x, y, z });
      }
    }

    // 1. Courtyard
    for (let x = -18; x <= -4; x++) {
      for (let z = -8; z <= 8; z++) {
        if (x === -18 || z === -8 || z === 8) {
          addWall(x, z, 2);
        } else {
          // In Stage 1: main path (|z| <= 2) and center plaza (x: -15..-9, z: -3..3) are mossy_cobble
          // Outer courtyard meadow (|z| >= 3 except plaza) is lush grass_top
          const isPlazaOrPath = (Math.abs(z) <= 2) || (x >= -15 && x <= -9 && Math.abs(z) <= 3);
          const isMeadow = (cfg.id === 1) && !isPlazaOrPath;
          if (isMeadow) {
            meadowTiles.push({ x, y: 0, z });
          } else {
            addFloor(x, z);
          }
        }
      }
    }

    // 2. Hazard Canal & Bridge
    for (let x = -4; x <= 0; x++) {
      for (let z = -10; z <= 10; z++) {
        if (Math.abs(z) <= 2) {
          addFloor(x, z); // Stone Bridge
        } else {
          hazardTiles.push({ x, y: -0.2, z });
        }
      }
    }

    // 3. Puzzle & Switch Chamber
    for (let x = 0; x <= 12; x++) {
      for (let z = -9; z <= 9; z++) {
        if ((x === 0 && Math.abs(z) > 2) || z === -9 || z === 9 || (x === 12 && Math.abs(z) > 2)) {
          addWall(x, z, 2);
        } else {
          addFloor(x, z);
        }
      }
    }

    // Pillars in Puzzle Chamber
    decorTiles.push({ x: 4, y: 1, z: 4 });
    decorTiles.push({ x: 4, y: 2, z: 4 });
    decorTiles.push({ x: 4, y: 1, z: -4 });
    decorTiles.push({ x: 4, y: 2, z: -4 });
    decorTiles.push({ x: 8, y: 1, z: 4 });
    decorTiles.push({ x: 8, y: 2, z: 4 });
    decorTiles.push({ x: 8, y: 1, z: -4 });
    decorTiles.push({ x: 8, y: 2, z: -4 });

    // 4. Boss Arena
    for (let x = 12; x <= 28; x++) {
      for (let z = -12; z <= 12; z++) {
        if (x === 28 || z === -12 || z === 12 || (x === 12 && Math.abs(z) > 2)) {
          addWall(x, z, 3);
        } else {
          addFloor(x, z);
        }
      }
    }

    // Arena Corner Torches / Decors
    decorTiles.push({ x: 16, y: 1, z: 8 }, { x: 16, y: 2, z: 8 });
    decorTiles.push({ x: 16, y: 1, z: -8 }, { x: 16, y: 2, z: -8 });
    decorTiles.push({ x: 24, y: 1, z: 8 }, { x: 24, y: 2, z: 8 });
    decorTiles.push({ x: 24, y: 1, z: -8 }, { x: 24, y: 2, z: -8 });

    // Build Instanced Meshes
    function createInstanced(geo, mat, list, receiveShadow = true, castShadow = true) {
      if (list.length === 0) return null;
      const mesh = new THREE.InstancedMesh(geo, mat, list.length);
      mesh.receiveShadow = receiveShadow;
      mesh.castShadow = castShadow;
      const dummy = new THREE.Object3D();
      list.forEach((t, i) => {
        dummy.position.set(t.x, t.y, t.z);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      stageGroup.add(mesh);
      return mesh;
    }

    createInstanced(boxGeo, floorMat, floorTiles, true, false);
    createInstanced(boxGeo, grassMat, meadowTiles, true, false);
    createInstanced(boxGeo, wallMat, wallTiles, true, true);
    createInstanced(boxGeo, hazardMat, hazardTiles, false, false);
    createInstanced(boxGeo, decorMat, decorTiles, true, true);

    // Warm Minecraft-style Torches
    function createTorch(x, z, y = 0) {
      const torchGroup = new THREE.Group();
      const postMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
      const post = new THREE.Mesh(boxGeo, postMat);
      post.scale.set(0.12, 0.65, 0.12);
      post.position.set(0, 0.325, 0);
      post.castShadow = true;
      torchGroup.add(post);

      const flameMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xff8800,
        emissiveIntensity: 0.8,
        roughness: 0.2
      });
      const flame = new THREE.Mesh(boxGeo, flameMat);
      flame.scale.set(0.18, 0.2, 0.18);
      flame.position.set(0, 0.68, 0);
      torchGroup.add(flame);

      const pLight = new THREE.PointLight(0xffaa22, 0.85, 7.5, 2.0);
      pLight.position.set(0, 0.85, 0);
      torchGroup.add(pLight);

      torchGroup.position.set(x, y, z);
      stageGroup.add(torchGroup);
      return torchGroup;
    }

    // Bridge & Chamber Torches (Illuminates Bridge, Title Attract, & Rooms)
    createTorch(-4.0, -2.5);
    createTorch(-4.0, 2.5);
    createTorch(0.0, -2.5);
    createTorch(0.0, 2.5);
    createTorch(1.5, -3.2);
    createTorch(1.5, 3.2);
    createTorch(12.0, -2.5);
    createTorch(12.0, 2.5);
    createTorch(16.0, -9.5);
    createTorch(16.0, 9.5);
    createTorch(26.0, -9.5);
    createTorch(26.0, 9.5);

    // Portcullis Iron Gate (at X: 12, Z: -2..2)
    const gateGroup = new THREE.Group();
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
    for (let gz = -2; gz <= 2; gz++) {
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3, 6), ironMat);
      bar.position.set(12, 1.5, gz);
      bar.castShadow = true;
      gateGroup.add(bar);
    }
    stageGroup.add(gateGroup);
    portcullisGate = {
      group: gateGroup,
      isOpen: false,
      currentY: 0,
      targetY: 0
    };

    // Pressure Plate Switch (in Room 2 at X: 6, Z: 0)
    const plateGeo = new THREE.BoxGeometry(1.6, 0.15, 1.6);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.5,
      roughness: 0.4,
      emissive: 0xd97706,
      emissiveIntensity: 0.3
    });
    const plateMesh = new THREE.Mesh(plateGeo, plateMat);
    plateMesh.position.set(6, 0.1, 0);
    plateMesh.receiveShadow = true;
    stageGroup.add(plateMesh);

    pressureSwitch = {
      mesh: plateMesh,
      x: 6,
      z: 0,
      isPressed: false
    };

    // Spawn Destructible Crates
    const crateLocs = [
      { x: -14, z: -4 }, { x: -14, z: 4 }, { x: -10, z: -5 },
      { x: 3, z: 6 }, { x: 9, z: -6 }, { x: 7, z: 6 },
      { x: 18, z: 10 }, { x: 18, z: -10 }
    ];
    crateLocs.forEach(loc => spawnCrate(loc.x, loc.z));

    // Spawn Cages with Villager & Pet
    spawnCage(-12, 0, 'pig'); // Caged Animal in Room 1
    spawnCage(6, -6, 'villager'); // Caged Villager in Room 2

    // Spawn Normal Monsters (Slimes & Skeletons)
    const enemyLocs = [
      { x: -12, z: 4, type: 'slime' },
      { x: -10, z: -3, type: 'slime' },
      { x: 3, z: -3, type: 'skeleton' },
      { x: 8, z: 3, type: 'slime' },
      { x: 10, z: -4, type: 'skeleton' }
    ];
    enemyLocs.forEach(e => spawnEnemy(e.x, e.z, e.type));

    // Spawn Stage Boss (in Arena at X: 22, Z: 0)
    spawnBoss(22, 0, stageIndex);
  }

  // =========================================================================
  // 8. VOXEL CHARACTERS & CREATURE BUILDERS
  // =========================================================================
  const charBoxGeo = new THREE.BoxGeometry(1, 1, 1);

  function createVoxelKnight(colorHex, hatColorHex) {
    const group = new THREE.Group();

    // Body / Chest
    const bodyMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.4 });
    const body = new THREE.Mesh(charBoxGeo, bodyMat);
    body.scale.set(0.7, 0.8, 0.45);
    body.position.y = 0.9;
    body.castShadow = true;
    group.add(body);

    // Head
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.6 });
    const head = new THREE.Mesh(charBoxGeo, headMat);
    head.scale.set(0.5, 0.5, 0.5);
    head.position.y = 1.6;
    head.castShadow = true;
    group.add(head);

    // Helmet / Hair
    const helmMat = new THREE.MeshStandardMaterial({ color: hatColorHex, roughness: 0.3 });
    const helm = new THREE.Mesh(charBoxGeo, helmMat);
    helm.scale.set(0.56, 0.3, 0.56);
    helm.position.y = 1.85;
    helm.castShadow = true;
    group.add(helm);

    // Eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111827 });
    const leftEye = new THREE.Mesh(charBoxGeo, eyeMat);
    leftEye.scale.set(0.08, 0.08, 0.08);
    leftEye.position.set(-0.12, 1.62, 0.26);
    group.add(leftEye);

    const rightEye = new THREE.Mesh(charBoxGeo, eyeMat);
    rightEye.scale.set(0.08, 0.08, 0.08);
    rightEye.position.set(0.12, 1.62, 0.26);
    group.add(rightEye);

    // Limbs
    const limbMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.5 });

    const leftArm = new THREE.Mesh(charBoxGeo, limbMat);
    leftArm.scale.set(0.22, 0.65, 0.22);
    leftArm.position.set(-0.48, 0.85, 0);
    leftArm.castShadow = true;
    group.add(leftArm);

    const rightArm = new THREE.Mesh(charBoxGeo, limbMat);
    rightArm.scale.set(0.22, 0.65, 0.22);
    rightArm.position.set(0.48, 0.85, 0);
    rightArm.castShadow = true;
    group.add(rightArm);

    const leftLeg = new THREE.Mesh(charBoxGeo, limbMat);
    leftLeg.scale.set(0.26, 0.65, 0.26);
    leftLeg.position.set(-0.2, 0.32, 0);
    leftLeg.castShadow = true;
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(charBoxGeo, limbMat);
    rightLeg.scale.set(0.26, 0.65, 0.26);
    rightLeg.position.set(0.2, 0.32, 0);
    rightLeg.castShadow = true;
    group.add(rightLeg);

    // Equipped Weapon Mesh on Right Arm
    const weaponMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3, metalness: 0.5 });
    const weapon = new THREE.Mesh(charBoxGeo, weaponMat);
    weapon.scale.set(0.15, 0.85, 0.15);
    weapon.position.set(0.48, 0.7, 0.3);
    weapon.castShadow = true;
    group.add(weapon);

    // Soft Shadow Disc
    const shadowGeo = new THREE.CircleGeometry(0.55, 16);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    group.add(shadow);

    return {
      group,
      head,
      body,
      leftArm,
      rightArm,
      leftLeg,
      rightLeg,
      weapon,
      weaponMat
    };
  }

  function createVoxelPet(petType) {
    const group = new THREE.Group();

    if (petType === 'wolf') {
      // Baby Wolf Pup
      const furMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.6 });
      const body = new THREE.Mesh(charBoxGeo, furMat);
      body.scale.set(0.4, 0.35, 0.55);
      body.position.y = 0.35;
      group.add(body);

      const head = new THREE.Mesh(charBoxGeo, furMat);
      head.scale.set(0.35, 0.35, 0.35);
      head.position.set(0, 0.55, 0.32);
      group.add(head);

      const earMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
      const earL = new THREE.Mesh(charBoxGeo, earMat);
      earL.scale.set(0.1, 0.15, 0.1);
      earL.position.set(-0.12, 0.76, 0.32);
      group.add(earL);

      const earR = new THREE.Mesh(charBoxGeo, earMat);
      earR.scale.set(0.1, 0.15, 0.1);
      earR.position.set(0.12, 0.76, 0.32);
      group.add(earR);

      const nose = new THREE.Mesh(charBoxGeo, new THREE.MeshBasicMaterial({ color: 0x0f172a }));
      nose.scale.set(0.12, 0.08, 0.12);
      nose.position.set(0, 0.52, 0.52);
      group.add(nose);
    } else if (petType === 'fox') {
      // Arctic Fox
      const furMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
      const body = new THREE.Mesh(charBoxGeo, furMat);
      body.scale.set(0.35, 0.3, 0.5);
      body.position.y = 0.3;
      group.add(body);

      const head = new THREE.Mesh(charBoxGeo, furMat);
      head.scale.set(0.3, 0.3, 0.3);
      head.position.set(0, 0.5, 0.3);
      group.add(head);

      // Big bushy tail
      const tail = new THREE.Mesh(charBoxGeo, furMat);
      tail.scale.set(0.2, 0.22, 0.4);
      tail.position.set(0, 0.4, -0.4);
      tail.rotation.x = -0.3;
      group.add(tail);
    } else if (petType === 'golem') {
      // Mini Iron Golem
      const golemMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.7, metalness: 0.3 });
      const body = new THREE.Mesh(charBoxGeo, golemMat);
      body.scale.set(0.5, 0.55, 0.4);
      body.position.y = 0.45;
      group.add(body);

      const head = new THREE.Mesh(charBoxGeo, golemMat);
      head.scale.set(0.35, 0.35, 0.35);
      head.position.set(0, 0.85, 0.1);
      group.add(head);

      const eyes = new THREE.Mesh(charBoxGeo, new THREE.MeshBasicMaterial({ color: 0xdc2626 }));
      eyes.scale.set(0.2, 0.06, 0.05);
      eyes.position.set(0, 0.86, 0.28);
      group.add(eyes);
    } else {
      // Golden Axolotl
      const axoMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.3 });
      const body = new THREE.Mesh(charBoxGeo, axoMat);
      body.scale.set(0.35, 0.25, 0.6);
      body.position.y = 0.45;
      group.add(body);

      const gillsMat = new THREE.MeshStandardMaterial({ color: 0xf472b6 });
      const gillL = new THREE.Mesh(charBoxGeo, gillsMat);
      gillL.scale.set(0.12, 0.25, 0.08);
      gillL.position.set(-0.25, 0.5, 0.15);
      group.add(gillL);

      const gillR = new THREE.Mesh(charBoxGeo, gillsMat);
      gillR.scale.set(0.12, 0.25, 0.08);
      gillR.position.set(0.25, 0.5, 0.15);
      group.add(gillR);
    }

    return group;
  }

  // =========================================================================
  // 9. ENTITIES: CRATES, CAGES, ENEMIES, BOSSES
  // =========================================================================
  function spawnCrate(x, z) {
    const mesh = new THREE.Mesh(
      charBoxGeo,
      new THREE.MeshStandardMaterial({
        map: proceduralTextures.wood_crate,
        roughness: 0.7
      })
    );
    mesh.position.set(x, 0.5, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    stageGroup.add(mesh);

    dynamicEntities.push({
      type: 'crate',
      mesh,
      x,
      z,
      hp: 1,
      alive: true
    });
  }

  function spawnCage(x, z, inmateType) {
    const cageGroup = new THREE.Group();

    // Crisp Square Voxel Iron-Bar Cage
    const ironMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.8,
      roughness: 0.3
    });

    // 4 Square Corner Posts
    const postOffsets = [
      [-0.6, -0.6], [0.6, -0.6],
      [-0.6, 0.6], [0.6, 0.6]
    ];
    postOffsets.forEach(([px, pz]) => {
      const post = new THREE.Mesh(charBoxGeo, ironMat);
      post.scale.set(0.09, 1.4, 0.09);
      post.position.set(px, 0.7, pz);
      post.castShadow = true;
      cageGroup.add(post);
    });

    // Mid-wall Vertical Bars
    const midOffsets = [
      [0, -0.6], [0, 0.6],
      [-0.6, 0], [0.6, 0]
    ];
    midOffsets.forEach(([mx, mz]) => {
      const bar = new THREE.Mesh(charBoxGeo, ironMat);
      bar.scale.set(0.06, 1.4, 0.06);
      bar.position.set(mx, 0.7, mz);
      bar.castShadow = true;
      cageGroup.add(bar);
    });

    // Bottom & Top Square Perimeter Frames
    [0.05, 1.37].forEach(yPos => {
      [-0.6, 0.6].forEach(rz => {
        const rail = new THREE.Mesh(charBoxGeo, ironMat);
        rail.scale.set(1.29, 0.07, 0.07);
        rail.position.set(0, yPos, rz);
        cageGroup.add(rail);
      });
      [-0.6, 0.6].forEach(rx => {
        const rail = new THREE.Mesh(charBoxGeo, ironMat);
        rail.scale.set(0.07, 0.07, 1.29);
        rail.position.set(rx, yPos, 0);
        cageGroup.add(rail);
      });
    });

    // 2 Crossed Top Bars leaving top open (4 clear quadrangles into cage!)
    const topBarX = new THREE.Mesh(charBoxGeo, ironMat);
    topBarX.scale.set(1.25, 0.08, 0.08);
    topBarX.position.set(0, 1.41, 0);
    topBarX.castShadow = true;
    cageGroup.add(topBarX);

    const topBarZ = new THREE.Mesh(charBoxGeo, ironMat);
    topBarZ.scale.set(0.08, 0.08, 1.25);
    topBarZ.position.set(0, 1.41, 0);
    topBarZ.castShadow = true;
    cageGroup.add(topBarZ);

    // Glowing Golden Lock
    const lockMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xfbbf24,
      emissiveIntensity: 0.6,
      metalness: 0.5,
      roughness: 0.3
    });
    const lock = new THREE.Mesh(charBoxGeo, lockMat);
    lock.scale.set(0.24, 0.24, 0.16);
    lock.position.set(0, 0.72, 0.64);
    cageGroup.add(lock);

    // Cute Inmate inside (Pig with snout/ears or Villager)
    const inmateGroup = new THREE.Group();

    if (inmateType === 'pig') {
      const pigPinkMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.45 });
      const pigDarkMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.45 });
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });

      // Body
      const body = new THREE.Mesh(charBoxGeo, pigPinkMat);
      body.scale.set(0.55, 0.45, 0.75);
      body.position.set(0, 0.38, -0.05);
      body.castShadow = true;
      inmateGroup.add(body);

      // Head
      const head = new THREE.Mesh(charBoxGeo, pigPinkMat);
      head.scale.set(0.44, 0.42, 0.42);
      head.position.set(0, 0.55, 0.38);
      head.castShadow = true;
      inmateGroup.add(head);

      // Cute Snout
      const snout = new THREE.Mesh(charBoxGeo, pigDarkMat);
      snout.scale.set(0.24, 0.15, 0.12);
      snout.position.set(0, 0.48, 0.62);
      snout.castShadow = true;
      inmateGroup.add(snout);

      // Nostrils
      const nostrilMat = new THREE.MeshBasicMaterial({ color: 0x831843 });
      [-0.05, 0.05].forEach(nx => {
        const n = new THREE.Mesh(charBoxGeo, nostrilMat);
        n.scale.set(0.04, 0.04, 0.02);
        n.position.set(nx, 0.48, 0.685);
        inmateGroup.add(n);
      });

      // Ears (2 cute pink voxel ear flaps)
      [-0.18, 0.18].forEach(ex => {
        const ear = new THREE.Mesh(charBoxGeo, pigDarkMat);
        ear.scale.set(0.12, 0.14, 0.08);
        ear.position.set(ex, 0.75, 0.38);
        inmateGroup.add(ear);
      });

      // Eyes
      [-0.14, 0.14].forEach(eyex => {
        const eye = new THREE.Mesh(charBoxGeo, eyeMat);
        eye.scale.set(0.06, 0.08, 0.04);
        eye.position.set(eyex, 0.58, 0.59);
        inmateGroup.add(eye);
      });

      // 4 Stubby Legs
      [[-0.18, 0.2], [0.18, 0.2], [-0.18, -0.3], [0.18, -0.3]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(charBoxGeo, pigPinkMat);
        leg.scale.set(0.14, 0.22, 0.14);
        leg.position.set(lx, 0.11, lz);
        leg.castShadow = true;
        inmateGroup.add(leg);
      });
    } else {
      // Brown Villager
      const robeMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });
      const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.5 });
      const noseMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 });
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });

      // Robe Body
      const robe = new THREE.Mesh(charBoxGeo, robeMat);
      robe.scale.set(0.48, 0.65, 0.42);
      robe.position.set(0, 0.35, 0);
      robe.castShadow = true;
      inmateGroup.add(robe);

      // Crossed Arms
      const arms = new THREE.Mesh(charBoxGeo, new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.6 }));
      arms.scale.set(0.52, 0.2, 0.22);
      arms.position.set(0, 0.42, 0.15);
      arms.castShadow = true;
      inmateGroup.add(arms);

      // Head
      const vhead = new THREE.Mesh(charBoxGeo, skinMat);
      vhead.scale.set(0.38, 0.42, 0.38);
      vhead.position.set(0, 0.82, 0);
      vhead.castShadow = true;
      inmateGroup.add(vhead);

      // Iconic Long Villager Nose
      const vnose = new THREE.Mesh(charBoxGeo, noseMat);
      vnose.scale.set(0.1, 0.2, 0.14);
      vnose.position.set(0, 0.77, 0.23);
      vnose.castShadow = true;
      inmateGroup.add(vnose);

      // Villager Eyes & Uni-brow
      const brow = new THREE.Mesh(charBoxGeo, eyeMat);
      brow.scale.set(0.26, 0.05, 0.04);
      brow.position.set(0, 0.92, 0.2);
      inmateGroup.add(brow);

      [-0.09, 0.09].forEach(ex => {
        const eye = new THREE.Mesh(charBoxGeo, eyeMat);
        eye.scale.set(0.06, 0.08, 0.04);
        eye.position.set(ex, 0.85, 0.2);
        inmateGroup.add(eye);
      });
    }

    cageGroup.add(inmateGroup);
    cageGroup.position.set(x, 0, z);
    stageGroup.add(cageGroup);

    dynamicEntities.push({
      type: 'cage',
      mesh: cageGroup,
      x,
      z,
      inmateMesh: inmateGroup,
      hp: 1,
      alive: true
    });
  }

  function spawnEnemy(x, z, type) {
    const group = new THREE.Group();
    let mesh;

    if (type === 'slime') {
      mesh = new THREE.Mesh(
        charBoxGeo,
        new THREE.MeshStandardMaterial({
          color: 0x10b981,
          transparent: true,
          opacity: 0.85,
          roughness: 0.2
        })
      );
      mesh.scale.set(0.8, 0.8, 0.8);
      mesh.position.y = 0.4;
      mesh.castShadow = true;
      group.add(mesh);

      // Cute slime eyes
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0x064e3b });
      const eyeL = new THREE.Mesh(charBoxGeo, eyeMat);
      eyeL.scale.set(0.12, 0.15, 0.1);
      eyeL.position.set(-0.2, 0.45, 0.4);
      group.add(eyeL);

      const eyeR = new THREE.Mesh(charBoxGeo, eyeMat);
      eyeR.scale.set(0.12, 0.15, 0.1);
      eyeR.position.set(0.2, 0.45, 0.4);
      group.add(eyeR);
    } else {
      // Skeleton / Guard
      mesh = new THREE.Mesh(
        charBoxGeo,
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.6 })
      );
      mesh.scale.set(0.6, 1.2, 0.4);
      mesh.position.y = 0.7;
      mesh.castShadow = true;
      group.add(mesh);
    }

    group.position.set(x, 0, z);
    stageGroup.add(group);

    dynamicEntities.push({
      type: 'enemy',
      enemyType: type,
      mesh: group,
      x,
      z,
      hp: type === 'slime' ? 30 : 45,
      maxHp: type === 'slime' ? 30 : 45,
      alive: true,
      attackCooldown: 0
    });
  }

  function spawnBoss(x, z, stageIndex) {
    const group = new THREE.Group();
    const cfg = STAGE_CONFIGS[stageIndex - 1] || STAGE_CONFIGS[0];

    let bossMesh;
    if (stageIndex === 1) {
      // Giant Mossy Slime King
      bossMesh = new THREE.Mesh(
        charBoxGeo,
        new THREE.MeshStandardMaterial({
          color: 0x059669,
          transparent: true,
          opacity: 0.88,
          roughness: 0.2
        })
      );
      bossMesh.scale.set(2.4, 2.2, 2.4);
      bossMesh.position.y = 1.1;
      bossMesh.castShadow = true;
      group.add(bossMesh);

      // Golden Voxel Crown on Top!
      const crownMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xfbbf24,
        emissiveIntensity: 0.4,
        metalness: 0.8
      });
      const crown = new THREE.Mesh(charBoxGeo, crownMat);
      crown.scale.set(1.2, 0.6, 1.2);
      crown.position.y = 2.4;
      crown.castShadow = true;
      group.add(crown);
    } else if (stageIndex === 2) {
      // Clockwork Scarecrow Golem
      bossMesh = new THREE.Mesh(
        charBoxGeo,
        new THREE.MeshStandardMaterial({
          map: proceduralTextures.pumpkin_face,
          roughness: 0.6
        })
      );
      bossMesh.scale.set(1.6, 1.6, 1.6);
      bossMesh.position.y = 2.0;
      bossMesh.castShadow = true;
      group.add(bossMesh);

      // Hay Body
      const body = new THREE.Mesh(
        charBoxGeo,
        new THREE.MeshStandardMaterial({ map: proceduralTextures.hay_side })
      );
      body.scale.set(1.4, 1.8, 1.0);
      body.position.y = 0.9;
      group.add(body);
    } else if (stageIndex === 3) {
      // Redstone Toy Titan
      bossMesh = new THREE.Mesh(
        charBoxGeo,
        new THREE.MeshStandardMaterial({
          map: proceduralTextures.redstone_ore,
          roughness: 0.4,
          emissive: 0xef4444,
          emissiveIntensity: 0.5
        })
      );
      bossMesh.scale.set(2.2, 2.8, 1.8);
      bossMesh.position.y = 1.4;
      bossMesh.castShadow = true;
      group.add(bossMesh);
    } else {
      // Arch-Block Jester Mech
      bossMesh = new THREE.Mesh(
        charBoxGeo,
        new THREE.MeshStandardMaterial({
          map: proceduralTextures.obsidian_citadel,
          roughness: 0.3,
          metalness: 0.6
        })
      );
      bossMesh.scale.set(1.8, 2.6, 1.6);
      bossMesh.position.y = 1.3;
      bossMesh.castShadow = true;
      group.add(bossMesh);
    }

    group.position.set(x, 0, z);
    stageGroup.add(group);

    activeBoss = {
      name: cfg.bossName,
      mesh: group,
      x,
      z,
      hp: 300,
      maxHp: 300,
      alive: true,
      attackCooldown: 1.5,
      slamAnim: 0
    };
  }

  function spawnGoldenChest(x, z) {
    const group = new THREE.Group();

    // Base Box
    const baseMat = new THREE.MeshStandardMaterial({
      map: proceduralTextures.gold_chest,
      metalness: 0.8,
      roughness: 0.25,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.3
    });
    const base = new THREE.Mesh(charBoxGeo, baseMat);
    base.scale.set(1.6, 0.8, 1.1);
    base.position.y = 0.4;
    base.castShadow = true;
    group.add(base);

    // Lid
    const lid = new THREE.Mesh(charBoxGeo, baseMat);
    lid.scale.set(1.65, 0.4, 1.15);
    lid.position.set(0, 0.9, 0);
    lid.castShadow = true;
    group.add(lid);

    group.position.set(x, 0, z);
    stageGroup.add(group);

    goldenChest = {
      mesh: group,
      lid,
      x,
      z,
      isOpen: false,
      openAnim: 0
    };
  }

  // =========================================================================
  // 10. GAMEPLAY LOGIC & COMBAT SYSTEM
  // =========================================================================
  const keysDown = {};
  let gamepadState = { x: 0, y: 0, bop: false, bow: false, dash: false, super: false };
  let touchJoystick = { active: false, dx: 0, dy: 0 };

  let cooldownMelee = 0;
  let cooldownBow = 0;
  let cooldownDash = 0;
  let superCharge = 0; // 0 to 100
  let isSuperActive = false;
  let superDurationTimer = 0;

  let playerStats = {
    x: -16,
    z: 0,
    vx: 0,
    vz: 0,
    facingAngle: 0,
    hp: 4,
    maxHp: 4,
    speed: 6.5,
    isRolling: false,
    rollTimer: 0,
    emeralds: 0,
    rescuedCount: 0,
    killsCount: 0
  };

  let buddyStats = {
    x: -16,
    z: -1.5,
    vx: 0,
    vz: 0,
    facingAngle: 0,
    hp: 4,
    maxHp: 4,
    speed: 6.0
  };

  function initPlayerAndBuddy() {
    const pMesh = createVoxelKnight(0x10b981, 0x059669);
    player = {
      ...pMesh,
      x: -16,
      z: 0
    };
    scene.add(player.group);

    const bMesh = createVoxelKnight(0x0284c7, 0x38bdf8);
    buddy = {
      ...bMesh,
      x: -16,
      z: -1.5
    };
    scene.add(buddy.group);
    buddy.group.visible = gameState.coopBuddyEnabled;

    // Pet Companion
    const activePetCard = CARD_DATABASE.find(c => c.id === gameState.deck[3]) || CARD_DATABASE[12];
    pet = {
      group: createVoxelPet(activePetCard.petType || 'wolf'),
      x: -17,
      z: 0.8
    };
    scene.add(pet.group);

    // Apply Armor bonuses from Slot 3
    applyArmorCard();
  }

  function applyArmorCard() {
    const armorCard = CARD_DATABASE.find(c => c.id === gameState.deck[2]);
    playerStats.maxHp = 4 + (armorCard && armorCard.extraHearts ? armorCard.extraHearts : 0);
    playerStats.hp = playerStats.maxHp;
    playerStats.speed = 6.5 * (armorCard && armorCard.speedBonus ? armorCard.speedBonus : 1.0);
  }

  function triggerMeleeAttack(attacker, isPlayer = true) {
    if (isPlayer && cooldownMelee > 0) return;
    const meleeCard = CARD_DATABASE.find(c => c.id === gameState.deck[0]) || CARD_DATABASE[0];

    if (isPlayer) {
      cooldownMelee = meleeCard.cooldown || 0.3;
      sfxBop();
    }

    const hitRange = meleeCard.range || 2.2;
    const hitDamage = meleeCard.damage || 20;

    // Attack swing visual
    attacker.rightArm.rotation.x = -Math.PI / 1.5;

    // Hit check against dynamic entities
    dynamicEntities.forEach(ent => {
      if (!ent.alive) return;
      const dist = Math.hypot(ent.x - attacker.x, ent.z - attacker.z);
      if (dist <= hitRange) {
        if (ent.type === 'crate') {
          breakCrate(ent);
        } else if (ent.type === 'cage') {
          freeCage(ent);
        } else if (ent.type === 'enemy') {
          damageEnemy(ent, hitDamage);
        }
      }
    });

    // Hit check against Boss
    if (activeBoss && activeBoss.alive) {
      const bDist = Math.hypot(activeBoss.x - attacker.x, activeBoss.z - attacker.z);
      if (bDist <= hitRange + 1.2) {
        damageBoss(hitDamage);
      }
    }

    // Special: Whirlwind Hammer shockwave ring
    if (isPlayer && meleeCard.id === 'whirlwind_hammer') {
      spawnShockwave(attacker.x, attacker.z, 3.5, 0xf59e0b);
    }
  }

  function triggerRangedAttack(attacker, isPlayer = true) {
    if (isPlayer && cooldownBow > 0) return;
    const rangedCard = CARD_DATABASE.find(c => c.id === gameState.deck[1]) || CARD_DATABASE[4];

    if (isPlayer) {
      cooldownBow = rangedCard.cooldown || 0.4;
      if (rangedCard.id === 'firework_crossbow') {
        sfxFirework();
      } else {
        sfxBow();
      }
    }

    const angle = attacker.facingAngle;
    const speed = rangedCard.speed || 18;

    if (rangedCard.id === 'multi_bubble_bow') {
      // Triple spread
      [-0.26, 0, 0.26].forEach(offset => {
        spawnProjectile(attacker.x, attacker.z, angle + offset, speed, rangedCard);
      });
    } else {
      spawnProjectile(attacker.x, attacker.z, angle, speed, rangedCard);
    }
  }

  function triggerDash() {
    if (cooldownDash > 0 || playerStats.isRolling) return;
    cooldownDash = 0.8;
    playerStats.isRolling = true;
    playerStats.rollTimer = 0.25;
    sfxDash();

    // Spawn puff particles
    for (let i = 0; i < 6; i++) {
      spawnParticle(player.x, 0.2, player.z, 0xffffff, 0.4);
    }
  }

  function triggerSuperArtifact() {
    if (superCharge < 100 || isSuperActive) return;
    const superCard = CARD_DATABASE.find(c => c.id === gameState.deck[4]) || CARD_DATABASE[16];

    isSuperActive = true;
    superCharge = 0;
    superDurationTimer = superCard.duration || 4.5;
    sfxSuper();

    // Giant rainbow shockwave
    spawnShockwave(player.x, player.z, 6.0, 0x8b5cf6);
  }

  function spawnProjectile(x, z, angle, speed, card) {
    const geo = new THREE.SphereGeometry(card.id === 'firework_crossbow' ? 0.25 : 0.18, 8, 8);
    const colorHex = card.id === 'firework_crossbow' ? 0xef4444 :
                     card.id === 'multi_bubble_bow' ? 0x38bdf8 :
                     card.id === 'snowball_blaster' ? 0xf8fafc : 0x06b6d4;
    const mat = new THREE.MeshBasicMaterial({ color: colorHex });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, 0.8, z);
    scene.add(mesh);

    projectiles.push({
      mesh,
      x,
      z,
      vx: Math.sin(angle) * speed,
      vz: Math.cos(angle) * speed,
      card,
      life: 2.0
    });
  }

  function spawnShockwave(x, z, maxRadius, colorHex) {
    const ringGeo = new THREE.RingGeometry(0.2, 0.5, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const mesh = new THREE.Mesh(ringGeo, ringMat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, 0.1, z);
    scene.add(mesh);

    particles.push({
      mesh,
      type: 'shockwave',
      radius: 0.5,
      maxRadius,
      opacity: 0.8
    });
  }

  function breakCrate(crate) {
    crate.alive = false;
    scene.remove(crate.mesh);
    sfxCrateBreak();

    // Wood splinters
    for (let i = 0; i < 8; i++) {
      spawnParticle(crate.x, 0.5, crate.z, 0xb45309, 0.5);
    }

    // Drop Emeralds (+1..+3)
    const count = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      spawnPickup(crate.x + (Math.random() - 0.5), crate.z + (Math.random() - 0.5), 'emerald');
    }
  }

  function freeCage(cage) {
    cage.alive = false;
    if (cage.mesh && cage.mesh.parent) {
      cage.mesh.parent.remove(cage.mesh);
    } else {
      scene.remove(cage.mesh);
    }
    sfxCageFree();

    // Flying iron bars
    for (let i = 0; i < 8; i++) {
      spawnParticle(cage.x, 0.6, cage.z, 0x475569, 0.6);
    }

    playerStats.rescuedCount++;
    gameState.totalRescued++;

    // Large Emerald shower (+15)
    for (let i = 0; i < 5; i++) {
      spawnPickup(cage.x + (Math.random() - 0.5) * 1.5, cage.z + (Math.random() - 0.5) * 1.5, 'emerald');
    }
  }

  function damageEnemy(enemy, amount) {
    enemy.hp -= amount;
    chargeSuper(amount * 1.5);

    // Floating damage text
    spawnFloatingText(enemy.x, 1.2, enemy.z, `-${amount}`, 0xffffff);

    // Blood / Spark voxel particles
    for (let i = 0; i < 4; i++) {
      spawnParticle(enemy.x, 0.5, enemy.z, 0x10b981, 0.35);
    }

    if (enemy.hp <= 0) {
      enemy.alive = false;
      scene.remove(enemy.mesh);
      playerStats.killsCount++;
      spawnPickup(enemy.x, enemy.z, 'emerald');
    }
  }

  function damageBoss(amount) {
    if (!activeBoss || !activeBoss.alive) return;
    activeBoss.hp -= amount;
    chargeSuper(amount * 1.2);

    spawnFloatingText(activeBoss.x, 2.4, activeBoss.z, `-${amount}`, 0xfbbf24);

    for (let i = 0; i < 6; i++) {
      spawnParticle(activeBoss.x, 1.2, activeBoss.z, 0xf59e0b, 0.4);
    }

    if (activeBoss.hp <= 0) {
      activeBoss.alive = false;
      scene.remove(activeBoss.mesh);
      sfxFanfare();

      // Huge gold explosion
      for (let i = 0; i < 20; i++) {
        spawnParticle(activeBoss.x, 1.0, activeBoss.z, 0xfbbf24, 0.8);
      }

      // Spawn Golden Loot Chest in Arena center!
      spawnGoldenChest(activeBoss.x, activeBoss.z);
    }
  }

  function chargeSuper(points) {
    const armorCard = CARD_DATABASE.find(c => c.id === gameState.deck[2]);
    const mult = (armorCard && armorCard.superRechargeBonus) ? armorCard.superRechargeBonus : 1.0;
    superCharge = Math.min(100, superCharge + points * mult);
  }

  function spawnPickup(x, z, type) {
    const geo = new THREE.OctahedronGeometry(type === 'emerald' ? 0.22 : 0.25);
    const mat = new THREE.MeshStandardMaterial({
      color: type === 'emerald' ? 0x10b981 : 0xef4444,
      emissive: type === 'emerald' ? 0x34d399 : 0xf87171,
      emissiveIntensity: 0.6
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, 0.3, z);
    scene.add(mesh);

    dynamicEntities.push({
      type: 'pickup',
      pickupType: type,
      mesh,
      x,
      z,
      alive: true
    });
  }

  function spawnParticle(x, y, z, colorHex, size = 0.3) {
    const geo = new THREE.BoxGeometry(size, size, size);
    const mat = new THREE.MeshBasicMaterial({ color: colorHex });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    scene.add(mesh);

    particles.push({
      mesh,
      type: 'debris',
      vx: (Math.random() - 0.5) * 5,
      vy: 2 + Math.random() * 4,
      vz: (Math.random() - 0.5) * 5,
      life: 0.6
    });
  }

  function spawnFloatingText(x, y, z, text, colorHex) {
    // Light particle indicator representing impact text
    spawnParticle(x, y, z, colorHex, 0.25);
  }

  // =========================================================================
  // 11. HUD, BINDER & CARD DISPENSER OVERLAYS
  // =========================================================================
  const domTitleOverlay = document.getElementById('titleOverlay');
  const domHudOverlay = document.getElementById('hudOverlay');
  const domBinderOverlay = document.getElementById('binderOverlay');
  const domDispenserOverlay = document.getElementById('dispenserOverlay');

  const hudHeartsP1 = document.getElementById('hudHeartsP1');
  const hudHeartsP2 = document.getElementById('hudHeartsP2');
  const hudBuddyRow = document.getElementById('hudBuddyRow');
  const hudEmeraldCount = document.getElementById('hudEmeraldCount');
  const hudRescuedCount = document.getElementById('hudRescuedCount');
  const hudStageBanner = document.getElementById('hudStageBanner');
  const hudBossWrap = document.getElementById('hudBossWrap');
  const hudBossName = document.getElementById('hudBossName');
  const hudBossHpPct = document.getElementById('hudBossHpPct');
  const hudBossBarFill = document.getElementById('hudBossBarFill');
  const superGaugeFill = document.getElementById('superGaugeFill');
  const superGaugeLbl = document.getElementById('superGaugeLbl');
  const minimapCanvas = document.getElementById('minimapCanvas');
  const minimapCtx = minimapCanvas.getContext('2d');

  function updateHUD() {
    if (!domHudOverlay || domHudOverlay.style.display === 'none') return;

    // Hearts P1
    let heartsHtml = '';
    for (let i = 0; i < playerStats.maxHp; i++) {
      heartsHtml += `<span style="color:${i < playerStats.hp ? '#ef4444' : '#475569'}; font-size:16px;">❤</span>`;
    }
    hudHeartsP1.innerHTML = heartsHtml;

    // Hearts P2 (Co-op)
    if (gameState.coopBuddyEnabled) {
      hudBuddyRow.style.display = 'flex';
      let bHeartsHtml = '';
      for (let i = 0; i < buddyStats.maxHp; i++) {
        bHeartsHtml += `<span style="color:${i < buddyStats.hp ? '#38bdf8' : '#475569'}; font-size:12px;">❤</span>`;
      }
      hudHeartsP2.innerHTML = bHeartsHtml;
    } else {
      hudBuddyRow.style.display = 'none';
    }

    // Counters
    hudEmeraldCount.textContent = playerStats.emeralds;
    hudRescuedCount.textContent = `${playerStats.rescuedCount}/2`;

    // Boss Bar
    if (activeBoss && activeBoss.alive) {
      hudBossWrap.style.display = 'block';
      hudBossName.textContent = activeBoss.name;
      const pct = Math.max(0, Math.min(100, Math.round((activeBoss.hp / activeBoss.maxHp) * 100)));
      hudBossHpPct.textContent = `${pct}%`;
      hudBossBarFill.style.width = `${pct}%`;
    } else {
      hudBossWrap.style.display = 'none';
    }

    // Super Artifact Gauge
    superGaugeFill.style.width = `${superCharge}%`;
    if (isSuperActive) {
      superGaugeLbl.textContent = `SUPER ACTIVE! (${superDurationTimer.toFixed(1)}s)`;
      superGaugeLbl.style.color = '#f472b6';
    } else if (superCharge >= 100) {
      superGaugeLbl.textContent = 'SUPER ARTIFACT READY! PRESS [U]';
      superGaugeLbl.style.color = '#34d399';
    } else {
      superGaugeLbl.textContent = `SUPER ARTIFACT CHARGE: ${Math.round(superCharge)}%`;
      superGaugeLbl.style.color = '#d8b4fe';
    }

    // 5-Card Arcade Dock cooldowns & art
    for (let slot = 1; slot <= 5; slot++) {
      const cardId = gameState.deck[slot - 1];
      const card = CARD_DATABASE.find(c => c.id === cardId);
      if (card) {
        document.getElementById(`dockName${slot}`).textContent = card.name;
        const artBox = document.getElementById(`dockArt${slot}`);
        if (!artBox.hasChildNodes()) {
          const cvs = document.createElement('canvas');
          cvs.width = 16;
          cvs.height = 16;
          renderCardArt(cvs, card.icon);
          artBox.appendChild(cvs);
        }
      }
    }

    // Cooldown overlays
    const cdMeleeMax = 0.35;
    const cdMeleePct = Math.max(0, Math.min(100, (cooldownMelee / cdMeleeMax) * 100));
    document.getElementById('dockCd1').style.height = `${cdMeleePct}%`;

    const cdBowMax = 0.45;
    const cdBowPct = Math.max(0, Math.min(100, (cooldownBow / cdBowMax) * 100));
    document.getElementById('dockCd2').style.height = `${cdBowPct}%`;

    const superSlot = document.getElementById('dockSlot5');
    if (superCharge >= 100) {
      superSlot.classList.add('ready');
    } else {
      superSlot.classList.remove('ready');
    }

    // Radar Minimap
    drawRadarMinimap();
  }

  function drawRadarMinimap() {
    minimapCtx.clearRect(0, 0, 120, 120);
    minimapCtx.fillStyle = '#090d14';
    minimapCtx.fillRect(0, 0, 120, 120);

    // Map world coords (-20..30 X, -15..15 Z) to 120x120
    function mapX(wx) { return ((wx + 20) / 50) * 120; }
    function mapZ(wz) { return ((wz + 15) / 30) * 120; }

    // Draw Crates & Cages
    dynamicEntities.forEach(ent => {
      if (!ent.alive) return;
      if (ent.type === 'crate') {
        minimapCtx.fillStyle = '#b45309';
        minimapCtx.fillRect(mapX(ent.x) - 1.5, mapZ(ent.z) - 1.5, 3, 3);
      } else if (ent.type === 'cage') {
        minimapCtx.fillStyle = '#fbbf24';
        minimapCtx.fillRect(mapX(ent.x) - 2, mapZ(ent.z) - 2, 4, 4);
      } else if (ent.type === 'enemy') {
        minimapCtx.fillStyle = '#ef4444';
        minimapCtx.beginPath();
        minimapCtx.arc(mapX(ent.x), mapZ(ent.z), 2, 0, Math.PI * 2);
        minimapCtx.fill();
      }
    });

    // Boss dot
    if (activeBoss && activeBoss.alive) {
      minimapCtx.fillStyle = '#f59e0b';
      minimapCtx.beginPath();
      minimapCtx.arc(mapX(activeBoss.x), mapZ(activeBoss.z), 4, 0, Math.PI * 2);
      minimapCtx.fill();
    }

    // Player Dot
    minimapCtx.fillStyle = '#10b981';
    minimapCtx.beginPath();
    minimapCtx.arc(mapX(playerStats.x), mapZ(playerStats.z), 3, 0, Math.PI * 2);
    minimapCtx.fill();

    // Buddy Dot
    if (gameState.coopBuddyEnabled) {
      minimapCtx.fillStyle = '#38bdf8';
      minimapCtx.beginPath();
      minimapCtx.arc(mapX(buddyStats.x), mapZ(buddyStats.z), 2.5, 0, Math.PI * 2);
      minimapCtx.fill();
    }
  }

  // --- BINDER CONTROLLER ---
  let binderCurrentCat = 'all';

  function renderBinderGrid() {
    const grid = document.getElementById('binderCardsGrid');
    grid.innerHTML = '';

    const filtered = CARD_DATABASE.filter(c => {
      if (binderCurrentCat === 'all') return true;
      return c.category === binderCurrentCat;
    });

    filtered.forEach(card => {
      const isUnlocked = !!gameState.unlockedCards[card.id];
      const isEquipped = gameState.deck[card.slot - 1] === card.id;

      const cardEl = document.createElement('div');
      cardEl.className = `binder-card ${isEquipped ? 'equipped' : ''} ${!isUnlocked ? 'locked' : ''}`;

      const stars = '★'.repeat(card.rarity);

      cardEl.innerHTML = `
        <div class="foil-shine"></div>
        <div class="bcard-top">
          <span>SLOT ${card.slot} • ${card.category.toUpperCase()}</span>
          <span class="bcard-stars">${stars}</span>
        </div>
        <div class="bcard-art-box">
          <canvas id="bcvs_${card.id}" width="56" height="56"></canvas>
        </div>
        <div class="bcard-name">${card.name}</div>
        <div class="bcard-desc">${card.desc}</div>
        <button class="arcade-btn bcard-action-btn ${isEquipped ? 'btn-green' : 'btn-blue'}">
          ${isEquipped ? 'EQUIPPED' : isUnlocked ? 'EQUIP' : 'LOCKED'}
        </button>
      `;

      grid.appendChild(cardEl);

      const cvs = document.getElementById(`bcvs_${card.id}`);
      if (cvs) renderCardArt(cvs, card.icon);

      const btn = cardEl.querySelector('.bcard-action-btn');
      if (isUnlocked && !isEquipped) {
        btn.addEventListener('click', () => {
          gameState.deck[card.slot - 1] = card.id;
          saveGameData();
          applyArmorCard();
          // Clear dock art cache to redraw
          for (let s = 1; s <= 5; s++) {
            const el = document.getElementById(`dockArt${s}`);
            if (el) el.innerHTML = '';
          }
          renderBinderGrid();
        });
      }
    });
  }

  function openBinder() {
    domBinderOverlay.style.display = 'flex';
    renderBinderGrid();
  }

  function closeBinder() {
    domBinderOverlay.style.display = 'none';
  }

  // --- DISPENSER OVERLAY CONTROLLER ---
  function showCardDispenserOverlay(unlockedCard) {
    domDispenserOverlay.style.display = 'flex';

    const card = unlockedCard || CARD_DATABASE[1]; // default Whirlwind Hammer
    document.getElementById('dispenserCardSlot').textContent = `SLOT ${card.slot} — ${card.category.toUpperCase()}`;
    document.getElementById('dispenserCardStars').textContent = '★'.repeat(card.rarity || 2);
    document.getElementById('dispenserCardTitle').textContent = card.name.toUpperCase();
    document.getElementById('dispenserCardDesc').textContent = card.desc;

    const cvs = document.getElementById('dispenserArtCanvas');
    if (cvs) renderCardArt(cvs, card.icon);

    document.getElementById('vstatStage').textContent = `STAGE ${gameState.currentStage}`;
    document.getElementById('vstatKills').textContent = playerStats.killsCount;
    document.getElementById('vstatRescued').textContent = `${playerStats.rescuedCount}/2`;
    document.getElementById('vstatEmeralds').textContent = `+${playerStats.emeralds}`;

    sfxFanfare();
  }

  // =========================================================================
  // 12. CONTROLS & INPUT DISPATCHER
  // =========================================================================
  function initInput() {
    window.addEventListener('keydown', (e) => {
      keysDown[e.code] = true;
      initAudio();

      if (e.code === 'KeyJ' || e.code === 'Space') {
        if (goldenChest && !goldenChest.isOpen) {
          const d = Math.hypot(playerStats.x - goldenChest.x, playerStats.z - goldenChest.z);
          if (d < 3.0) {
            goldenChest.isOpen = true;
            showCardDispenserOverlay(CARD_DATABASE[1]);
            return;
          }
        }
        triggerMeleeAttack(playerStats, true);
      } else if (e.code === 'KeyK') {
        triggerRangedAttack(playerStats, true);
      } else if (e.code === 'KeyL' || e.code === 'ShiftLeft') {
        triggerDash();
      } else if (e.code === 'KeyU' || e.code === 'KeyE') {
        triggerSuperArtifact();
      } else if (e.code === 'KeyP') {
        // Toggle Co-op Buddy
        gameState.coopBuddyEnabled = !gameState.coopBuddyEnabled;
        if (buddy) buddy.group.visible = gameState.coopBuddyEnabled;
        updateOptionsUI();
      } else if (e.code === 'KeyG') {
        if (domBinderOverlay.style.display === 'flex') {
          closeBinder();
        } else {
          openBinder();
        }
      } else if (e.code === 'KeyB') {
        gameState.bloomEnabled = !gameState.bloomEnabled;
        updateOptionsUI();
      } else if (e.code === 'KeyM') {
        gameState.audioEnabled = !gameState.audioEnabled;
        updateOptionsUI();
      } else if (e.code === 'Escape') {
        if (domBinderOverlay.style.display === 'flex') closeBinder();
      }
    });

    window.addEventListener('keyup', (e) => {
      keysDown[e.code] = false;
    });

    // Touch controls
    const touchDpad = document.getElementById('touchDpad');
    const touchThumb = document.getElementById('touchThumb');

    if (touchDpad) {
      touchDpad.addEventListener('touchstart', onTouchMove, { passive: false });
      touchDpad.addEventListener('touchmove', onTouchMove, { passive: false });
      touchDpad.addEventListener('touchend', () => {
        touchJoystick.active = false;
        touchJoystick.dx = 0;
        touchJoystick.dy = 0;
        touchThumb.style.transform = 'translate(0px, 0px)';
      });
    }

    function onTouchMove(e) {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = touchDpad.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      let dx = (touch.clientX - centerX) / (rect.width / 2);
      let dy = (touch.clientY - centerY) / (rect.height / 2);
      const len = Math.hypot(dx, dy);
      if (len > 1) { dx /= len; dy /= len; }
      touchJoystick.active = true;
      touchJoystick.dx = dx;
      touchJoystick.dy = dy;
      touchThumb.style.transform = `translate(${dx * 35}px, ${dy * 35}px)`;
    }

    const tbtnBop = document.getElementById('touchBtnBop');
    const tbtnBow = document.getElementById('touchBtnBow');
    const tbtnDash = document.getElementById('touchBtnDash');
    const tbtnSuper = document.getElementById('touchBtnSuper');

    if (tbtnBop) tbtnBop.addEventListener('touchstart', () => triggerMeleeAttack(playerStats, true));
    if (tbtnBow) tbtnBow.addEventListener('touchstart', () => triggerRangedAttack(playerStats, true));
    if (tbtnDash) tbtnDash.addEventListener('touchstart', () => triggerDash());
    if (tbtnSuper) tbtnSuper.addEventListener('touchstart', () => triggerSuperArtifact());
  }

  function pollGamepads() {
    if (!navigator.getGamepads) return;
    const gps = navigator.getGamepads();
    if (gps && gps[0]) {
      const gp = gps[0];
      let stickX = gp.axes[0] || 0;
      let stickY = gp.axes[1] || 0;
      if (Math.abs(stickX) < 0.15) stickX = 0;
      if (Math.abs(stickY) < 0.15) stickY = 0;

      // D-Pad buttons
      if (gp.buttons[14] && gp.buttons[14].pressed) stickX = -1;
      if (gp.buttons[15] && gp.buttons[15].pressed) stickX = 1;
      if (gp.buttons[12] && gp.buttons[12].pressed) stickY = -1;
      if (gp.buttons[13] && gp.buttons[13].pressed) stickY = 1;

      gamepadState.x = stickX;
      gamepadState.y = stickY;

      if (gp.buttons[0] && gp.buttons[0].pressed && !gamepadState.bop) {
        triggerMeleeAttack(playerStats, true);
      }
      if (gp.buttons[1] && gp.buttons[1].pressed && !gamepadState.bow) {
        triggerRangedAttack(playerStats, true);
      }
      if (gp.buttons[2] && gp.buttons[2].pressed && !gamepadState.dash) {
        triggerDash();
      }
      if (gp.buttons[3] && gp.buttons[3].pressed && !gamepadState.super) {
        triggerSuperArtifact();
      }

      gamepadState.bop = !!(gp.buttons[0] && gp.buttons[0].pressed);
      gamepadState.bow = !!(gp.buttons[1] && gp.buttons[1].pressed);
      gamepadState.dash = !!(gp.buttons[2] && gp.buttons[2].pressed);
      gamepadState.super = !!(gp.buttons[3] && gp.buttons[3].pressed);
    }
  }

  function updateOptionsUI() {
    const lblCoop = document.getElementById('lblCoopState');
    const lblBloom = document.getElementById('lblBloomState');
    const lblAudio = document.getElementById('lblAudioState');

    if (lblCoop) lblCoop.textContent = gameState.coopBuddyEnabled ? 'ON (AI)' : 'OFF';
    if (lblBloom) lblBloom.textContent = gameState.bloomEnabled ? 'ON' : 'OFF';
    if (lblAudio) lblAudio.textContent = gameState.audioEnabled ? 'ON' : 'OFF';

    if (bloomPass) {
      bloomPass.enabled = gameState.bloomEnabled;
    }
  }

  function setupUIEventHandlers() {
    // Stage Selector chips on Title Screen
    const chips = document.querySelectorAll('.stage-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        gameState.currentStage = parseInt(chip.getAttribute('data-stage'), 10) || 1;
        buildStage(gameState.currentStage);
      });
    });

    document.getElementById('btnPlayAdventure').addEventListener('click', () => {
      domTitleOverlay.style.display = 'none';
      domHudOverlay.style.display = 'flex';
      initAudio();
      startBgm();
      buildStage(gameState.currentStage);
    });

    document.getElementById('btnOpenBinder').addEventListener('click', () => {
      openBinder();
    });

    document.getElementById('btnCloseBinder').addEventListener('click', () => {
      closeBinder();
    });

    document.getElementById('btnToggleCoop').addEventListener('click', () => {
      gameState.coopBuddyEnabled = !gameState.coopBuddyEnabled;
      if (buddy) buddy.group.visible = gameState.coopBuddyEnabled;
      updateOptionsUI();
    });

    document.getElementById('btnToggleBloom').addEventListener('click', () => {
      gameState.bloomEnabled = !gameState.bloomEnabled;
      updateOptionsUI();
    });

    document.getElementById('btnToggleAudio').addEventListener('click', () => {
      gameState.audioEnabled = !gameState.audioEnabled;
      initAudio();
      updateOptionsUI();
    });

    // Binder Category Tabs
    const btabs = document.querySelectorAll('.binder-tab');
    btabs.forEach(tab => {
      tab.addEventListener('click', () => {
        btabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        binderCurrentCat = tab.getAttribute('data-cat');
        renderBinderGrid();
      });
    });

    // Dispenser Buttons
    document.getElementById('btnNextStage').addEventListener('click', () => {
      domDispenserOverlay.style.display = 'none';
      gameState.currentStage = (gameState.currentStage % 4) + 1;
      buildStage(gameState.currentStage);
    });

    document.getElementById('btnDispenserBinder').addEventListener('click', () => {
      domDispenserOverlay.style.display = 'none';
      openBinder();
    });

    document.getElementById('btnReplayStage').addEventListener('click', () => {
      domDispenserOverlay.style.display = 'none';
      buildStage(gameState.currentStage);
    });

    // HUD Mini Quick Buttons
    document.getElementById('hudBtnBinder').addEventListener('click', () => openBinder());
    document.getElementById('hudBtnStage').addEventListener('click', () => {
      gameState.currentStage = (gameState.currentStage % 4) + 1;
      buildStage(gameState.currentStage);
    });
    document.getElementById('hudBtnCoop').addEventListener('click', () => {
      gameState.coopBuddyEnabled = !gameState.coopBuddyEnabled;
      if (buddy) buddy.group.visible = gameState.coopBuddyEnabled;
      updateOptionsUI();
    });
    document.getElementById('hudBtnBloom').addEventListener('click', () => {
      gameState.bloomEnabled = !gameState.bloomEnabled;
      updateOptionsUI();
    });
    document.getElementById('hudBtnAudio').addEventListener('click', () => {
      gameState.audioEnabled = !gameState.audioEnabled;
      updateOptionsUI();
    });
  }

  // =========================================================================
  // 13. MAIN ANIMATE LOOP
  // =========================================================================
  let lastTime = performance.now();

  function animate() {
    requestAnimationFrame(animate);

    const now = performance.now();
    // Clamped delta-time requirement
    const dt = Math.max(0.001, Math.min(0.05, (now - lastTime) / 1000));
    lastTime = now;

    pollGamepads();

    // Cooldown clocks
    if (cooldownMelee > 0) cooldownMelee -= dt;
    if (cooldownBow > 0) cooldownBow -= dt;
    if (cooldownDash > 0) cooldownDash -= dt;

    if (isSuperActive) {
      superDurationTimer -= dt;
      if (superDurationTimer <= 0) {
        isSuperActive = false;
      }
    }

    // --- PLAYER MOVEMENT & PHYSICS ---
    let moveX = 0;
    let moveZ = 0;

    if (keysDown['KeyW'] || keysDown['ArrowUp']) { moveX += 1; moveZ -= 1; }
    if (keysDown['KeyS'] || keysDown['ArrowDown']) { moveX -= 1; moveZ += 1; }
    if (keysDown['KeyA'] || keysDown['ArrowLeft']) { moveX -= 1; moveZ -= 1; }
    if (keysDown['KeyD'] || keysDown['ArrowRight']) { moveX += 1; moveZ += 1; }

    // Gamepad & Touch inputs
    if (gamepadState.x !== 0 || gamepadState.y !== 0) {
      moveX += gamepadState.x - gamepadState.y;
      moveZ += gamepadState.x + gamepadState.y;
    }
    if (touchJoystick.active) {
      moveX += touchJoystick.dx - touchJoystick.dy;
      moveZ += touchJoystick.dx + touchJoystick.dy;
    }

    const inputLen = Math.hypot(moveX, moveZ);
    if (inputLen > 0.001) {
      moveX /= inputLen;
      moveZ /= inputLen;
      playerStats.facingAngle = Math.atan2(moveX, moveZ);
    }

    // Roll Dash mechanics
    if (playerStats.isRolling) {
      playerStats.rollTimer -= dt;
      moveX = Math.sin(playerStats.facingAngle);
      moveZ = Math.cos(playerStats.facingAngle);
      const dashSpeed = playerStats.speed * 2.2;
      playerStats.x += moveX * dashSpeed * dt;
      playerStats.z += moveZ * dashSpeed * dt;
      if (player.group) {
        player.group.rotation.x += dt * 18;
      }
      if (playerStats.rollTimer <= 0) {
        playerStats.isRolling = false;
        if (player.group) player.group.rotation.x = 0;
      }
    } else {
      const curSpeed = playerStats.speed * (isSuperActive ? 1.4 : 1.0);
      playerStats.x += moveX * curSpeed * dt;
      playerStats.z += moveZ * curSpeed * dt;
    }

    // Clamp player within stage boundaries
    playerStats.x = Math.max(-17, Math.min(27, playerStats.x));
    playerStats.z = Math.max(-11, Math.min(11, playerStats.z));

    // Update Player Voxel Model
    if (player && player.group) {
      player.group.position.set(playerStats.x, 0, playerStats.z);
      if (!playerStats.isRolling) {
        player.group.rotation.y = playerStats.facingAngle;
        // Walking bob animation
        const isMoving = inputLen > 0.05;
        const bob = isMoving ? Math.sin(now * 0.012) : 0;
        player.leftLeg.rotation.x = bob * 0.6;
        player.rightLeg.rotation.x = -bob * 0.6;
        player.leftArm.rotation.x = -bob * 0.5;
        if (cooldownMelee <= 0) {
          player.rightArm.rotation.x = bob * 0.5;
        }
      }
    }

    // --- CO-OP BUDDY HERO (AI Follow / 2P) ---
    if (buddy && buddy.group && gameState.coopBuddyEnabled) {
      const distToP1 = Math.hypot(playerStats.x - buddyStats.x, playerStats.z - buddyStats.z);
      if (distToP1 > 2.5) {
        const bAngle = Math.atan2(playerStats.x - buddyStats.x, playerStats.z - buddyStats.z);
        buddyStats.facingAngle = bAngle;
        buddyStats.x += Math.sin(bAngle) * buddyStats.speed * dt;
        buddyStats.z += Math.cos(bAngle) * buddyStats.speed * dt;
      }
      buddy.group.position.set(buddyStats.x, 0, buddyStats.z);
      buddy.group.rotation.y = buddyStats.facingAngle;

      // Buddy auto-bop nearby enemies
      dynamicEntities.forEach(ent => {
        if (ent.alive && ent.type === 'enemy') {
          const d = Math.hypot(ent.x - buddyStats.x, ent.z - buddyStats.z);
          if (d < 2.0 && Math.random() < 0.04) {
            triggerMeleeAttack(buddyStats, false);
          }
        }
      });
    }

    // --- PET COMPANION FOLLOW ---
    if (pet && pet.group) {
      const petTargetX = playerStats.x - Math.sin(playerStats.facingAngle) * 1.4;
      const petTargetZ = playerStats.z - Math.cos(playerStats.facingAngle) * 1.4;
      pet.x += (petTargetX - pet.x) * dt * 4.5;
      pet.z += (petTargetZ - pet.z) * dt * 4.5;
      pet.group.position.set(pet.x, 0, pet.z);
      pet.group.rotation.y = playerStats.facingAngle;
      // Bouncy idle bob
      pet.group.position.y = Math.abs(Math.sin(now * 0.008)) * 0.15;
    }

    // --- PRESSURE SWITCH & GATE TRIGGER ---
    if (pressureSwitch) {
      const distToSwitch = Math.hypot(playerStats.x - pressureSwitch.x, playerStats.z - pressureSwitch.z);
      if (distToSwitch < 1.2 && !pressureSwitch.isPressed) {
        pressureSwitch.isPressed = true;
        pressureSwitch.mesh.position.y = 0.02;
        pressureSwitch.mesh.material.emissive.setHex(0x10b981);
        if (portcullisGate) {
          portcullisGate.isOpen = true;
        }
        sfxEmerald();
      }
    }
    if (portcullisGate && portcullisGate.isOpen) {
      portcullisGate.currentY = THREE.MathUtils.lerp(portcullisGate.currentY, 4.0, dt * 3.0);
      portcullisGate.group.position.y = portcullisGate.currentY;
    }

    // --- PROJECTILES UPDATE ---
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i];
      p.x += p.vx * dt;
      p.z += p.vz * dt;
      p.mesh.position.set(p.x, 0.8, p.z);
      p.life -= dt;

      // Collision with enemies
      let hit = false;
      dynamicEntities.forEach(ent => {
        if (!ent.alive) return;
        const d = Math.hypot(ent.x - p.x, ent.z - p.z);
        if (d < 1.2) {
          hit = true;
          if (ent.type === 'crate') breakCrate(ent);
          else if (ent.type === 'cage') freeCage(ent);
          else if (ent.type === 'enemy') damageEnemy(ent, p.card.damage || 20);
        }
      });

      if (!hit && activeBoss && activeBoss.alive) {
        const bd = Math.hypot(activeBoss.x - p.x, activeBoss.z - p.z);
        if (bd < 2.0) {
          hit = true;
          damageBoss(p.card.damage || 20);
        }
      }

      if (hit || p.life <= 0) {
        scene.remove(p.mesh);
        projectiles.splice(i, 1);
      }
    }

    // --- PICKUPS MAGNET & COLLECTION ---
    const armorCard = CARD_DATABASE.find(c => c.id === gameState.deck[2]);
    const magnetRange = (armorCard && armorCard.magnetRange) ? armorCard.magnetRange : 2.5;

    dynamicEntities.forEach(ent => {
      if (!ent.alive || ent.type !== 'pickup') return;
      const d = Math.hypot(playerStats.x - ent.x, playerStats.z - ent.z);
      if (d <= magnetRange) {
        // Fly towards player
        ent.x += (playerStats.x - ent.x) * dt * 6;
        ent.z += (playerStats.z - ent.z) * dt * 6;
        ent.mesh.position.set(ent.x, 0.4, ent.z);
      }
      if (d < 0.8) {
        ent.alive = false;
        scene.remove(ent.mesh);
        if (ent.pickupType === 'emerald') {
          playerStats.emeralds += 5;
          sfxEmerald();
        }
      }
    });

    // --- PARTICLES UPDATE ---
    for (let i = particles.length - 1; i >= 0; i--) {
      const pt = particles[i];
      if (pt.type === 'shockwave') {
        pt.radius += dt * 8;
        pt.mesh.scale.set(pt.radius, pt.radius, 1);
        pt.opacity -= dt * 1.5;
        pt.mesh.material.opacity = Math.max(0, pt.opacity);
        if (pt.opacity <= 0 || pt.radius >= pt.maxRadius) {
          scene.remove(pt.mesh);
          particles.splice(i, 1);
        }
      } else {
        pt.vy -= 9.8 * dt;
        pt.mesh.position.x += pt.vx * dt;
        pt.mesh.position.y += pt.vy * dt;
        pt.mesh.position.z += pt.vz * dt;
        pt.life -= dt;
        if (pt.life <= 0 || pt.mesh.position.y < 0) {
          scene.remove(pt.mesh);
          particles.splice(i, 1);
        }
      }
    }

    // --- BOSS & SLIME ANIMATIONS ---
    if (activeBoss && activeBoss.alive) {
      activeBoss.mesh.position.y = Math.abs(Math.sin(now * 0.005)) * 0.4;
    }
    dynamicEntities.forEach(ent => {
      if (ent.alive && ent.type === 'enemy' && ent.enemyType === 'slime' && ent.mesh) {
        ent.mesh.position.y = Math.abs(Math.sin(now * 0.006 + ent.x * 2)) * 0.25;
      }
    });

    // --- SMOOTH ISOMETRIC CHASE CAMERA ---
    const targetCamX = playerStats.x + 14;
    const targetCamY = 18;
    const targetCamZ = playerStats.z + 14;

    camera.position.x += (targetCamX - camera.position.x) * dt * 5.0;
    camera.position.y += (targetCamY - camera.position.y) * dt * 5.0;
    camera.position.z += (targetCamZ - camera.position.z) * dt * 5.0;
    camera.lookAt(playerStats.x, 0.8, playerStats.z);

    // Update HUD & Minimap
    updateHUD();

    // Render Scene (EffectComposer or Standard Renderer)
    if (composer && gameState.bloomEnabled) {
      composer.render();
    } else {
      renderer.render(scene, camera);
    }
  }

  // =========================================================================
  // 14. INITIALIZATION & QUERY PARAMETER DISPATCHER (?shot=...)
  // =========================================================================
  function initGame() {
    loadSavedData();
    initProceduralTextures();
    initThree();
    initPlayerAndBuddy();
    buildStage(gameState.currentStage);
    initInput();
    setupUIEventHandlers();
    updateOptionsUI();

    // Check ?shot= URL parameters
    const params = new URLSearchParams(window.location.search);
    const shot = params.get('shot');

    if (shot === 'title') {
      domTitleOverlay.style.display = 'flex';
      domHudOverlay.style.display = 'none';
      domBinderOverlay.style.display = 'none';
      domDispenserOverlay.style.display = 'none';

      // Title Attract 3D Hero + Buddy + Pet + 4 Slimes centered near bridge (x = -2..2)
      // brightly illuminated by warm torches behind hero menu
      playerStats.x = -0.8;
      playerStats.z = 0.0;
      playerStats.facingAngle = Math.PI * 0.35;
      if (player && player.group) {
        player.group.position.set(-0.8, 0, 0.0);
        player.group.rotation.y = Math.PI * 0.35;
      }

      buddyStats.x = -1.8;
      buddyStats.z = -1.0;
      buddyStats.facingAngle = Math.PI * 0.35;
      if (buddy && buddy.group) {
        buddy.group.position.set(-1.8, 0, -1.0);
        buddy.group.rotation.y = Math.PI * 0.35;
      }

      // Pet companion trotting alongside hero
      if (pet && pet.group) {
        pet.x = -1.6;
        pet.z = 0.85;
        pet.group.position.set(-1.6, 0, 0.85);
        pet.group.rotation.y = Math.PI * 0.35;
      }

      // Ensure 4 lively slimes are placed near the bridge/room 2 entrance (x = 0.5..2.2)
      const titleSlimes = [
        { x: 0.6, z: -0.7 },
        { x: 0.9, z: 0.85 },
        { x: 1.8, z: -0.3 },
        { x: 2.2, z: 0.7 }
      ];
      let sCount = 0;
      dynamicEntities.forEach(ent => {
        if (ent.type === 'enemy' && ent.enemyType === 'slime') {
          if (sCount < titleSlimes.length) {
            ent.x = titleSlimes[sCount].x;
            ent.z = titleSlimes[sCount].z;
            ent.mesh.position.set(ent.x, 0, ent.z);
            sCount++;
          }
        }
      });
      while (sCount < titleSlimes.length) {
        spawnEnemy(titleSlimes[sCount].x, titleSlimes[sCount].z, 'slime');
        sCount++;
      }

      // Snap camera directly to hero & bridge so framing is immediate from frame 0
      camera.position.set(playerStats.x + 14, 18, playerStats.z + 14);
      camera.lookAt(playerStats.x, 0.8, playerStats.z);

    } else if (shot === 'deck') {
      unlockShowcaseDeck();
      domTitleOverlay.style.display = 'none';
      domHudOverlay.style.display = 'flex';
      openBinder();

    } else if (shot === 'gameplay') {
      domTitleOverlay.style.display = 'none';
      domHudOverlay.style.display = 'flex';
      domBinderOverlay.style.display = 'none';
      domDispenserOverlay.style.display = 'none';
      playerStats.hp = 4;
      playerStats.emeralds = 45;
      playerStats.rescuedCount = 1;
      superCharge = 65;

      // Position hero in courtyard facing the square iron cage with cute piglet
      playerStats.x = -14.2;
      playerStats.z = 0.0;
      playerStats.facingAngle = Math.PI * 0.5;
      if (player && player.group) {
        player.group.position.set(-14.2, 0, 0);
        player.group.rotation.y = Math.PI * 0.5;
      }
      if (pet && pet.group) {
        pet.x = -15.4;
        pet.z = 0.75;
        pet.group.position.set(-15.4, 0, 0.75);
        pet.group.rotation.y = Math.PI * 0.5;
      }
      camera.position.set(-14.2 + 14, 18, 0 + 14);
      camera.lookAt(-14.2, 0.8, 0);

    } else if (shot === 'dispenser') {
      unlockShowcaseDeck();
      domTitleOverlay.style.display = 'none';
      domHudOverlay.style.display = 'none';
      domBinderOverlay.style.display = 'none';

      // Populate realistic victory stats
      playerStats.killsCount = 14;     // slimesBapped = 14
      playerStats.rescuedCount = 2;    // cagesFreed = 2/2
      playerStats.emeralds = 185;      // emeraldsEarned = 185

      // Position hero and opened golden chest in Boss Arena
      playerStats.x = 20.0;
      playerStats.z = 0.0;
      if (player && player.group) {
        player.group.position.set(20.0, 0, 0);
      }
      if (pet && pet.group) {
        pet.x = 18.8;
        pet.z = 0.8;
        pet.group.position.set(18.8, 0, 0.8);
      }
      if (goldenChest) {
        goldenChest.isOpen = true;
        if (goldenChest.lid) goldenChest.lid.rotation.x = -Math.PI / 2.5;
      }
      camera.position.set(20.0 + 14, 18, 0 + 14);
      camera.lookAt(20.0, 0.8, 0);

      showCardDispenserOverlay(CARD_DATABASE[1]); // Whirlwind Hammer
    } else {
      // Default initial view: Title attract screen
      domTitleOverlay.style.display = 'flex';
      playerStats.x = -1.0;
      playerStats.z = 0.0;
      camera.position.set(playerStats.x + 14, 18, playerStats.z + 14);
      camera.lookAt(playerStats.x, 0.8, playerStats.z);
    }

    animate();
  }

  window.addEventListener('DOMContentLoaded', initGame);

})();
