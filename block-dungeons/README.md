# Block Dungeons Arcade — 3D Voxel Dungeon Crawler

A wholesome, kid-friendly 3D isometric arcade voxel dungeon crawler built with Three.js WebGL, procedural 16×16 pixel-art textures (`THREE.NearestFilter`), `THREE.InstancedMesh` 60 FPS multi-room dungeons, and an animated **5-Card "Arcade Deck" Loadout & Holographic Foil Card Dispenser**.

Play live locally or deploy to any static HTTP server.

---

## Key Features

### 1. Crisp 3D Isometric Voxel Dungeon Aesthetic
- **Procedural 16×16 Pixel-Art CanvasTextures**:
  - Rendered with `THREE.NearestFilter` and mipmapping disabled for authentic retro voxel crispness.
  - Custom procedural patterns: mossy cobblestone, stone brick masonry, autumn pumpkins & haybales, glowing redstone ore, cyan diamond crystals, royal obsidian with gilded borders, wood crates, water, and lava.
- **60 FPS Instanced Voxel Engine**:
  - Dungeons utilize `THREE.InstancedMesh` for floors, walls, hazards, and decorative structures, rendering vast multi-chamber dungeons in only a handful of draw calls.
- **4 Isometric Voxel Stages & Unique Boss Arenas**:
  1. **Mossy Creeper Woods**: Lush mossy ruins, river bridges, trapped baby piglet & villager, ending with the bouncy **Giant Mossy Slime King** wearing a sparkling golden crown.
  2. **Pumpkin Pastures**: Autumn pastures, giant pumpkin stacks, haybales, and the whirlwind **Clockwork Scarecrow Golem**.
  3. **Redstone Crystal Mines**: Deep slate caverns, glowing redstone ore veins, cyan crystal pillars, lava pits with pressure plate bridges, and the **Redstone Toy Titan**.
  4. **Obsidian Royal Citadel**: Gilded purple volcanic glass walls, throne room battlements, royal gates, and the eccentric **Arch-Block Jester Mech**.
- **Interactive Dungeon Mechanics**:
  - Destructible **Wood Crates** dropping shiny Emerald Gems and Heart Apples.
  - Caged **Villagers & Baby Animals** freed by striking the golden lock.
  - Step-on **Pressure Switches** that smoothly raise iron portcullis gates.
  - Smooth 45° isometric chase camera with directional soft shadows and toggleable `EffectComposer` + `UnrealBloomPass`.

---

### 2. 5-Card "Arcade Deck" System (20 Collectible Cards)

A full collectible arcade deck binder system persisted in `localStorage` (`blockDungeonsSave_v1`):

| Slot | Category | Card Name | Star Tier | Description & Gameplay Effect |
| :---: | :---: | :--- | :---: | :--- |
| **1** | **Melee** | **Emerald Pickaxe** | ★ | High single-target damage, +50% bonus emerald drops on hits & crate smashes. |
| **1** | **Melee** | **Whirlwind Hammer** | ★★ | 360° spinning war hammer shockwave that hurls surrounding slimes backwards. |
| **1** | **Melee** | **Sunburst Gauntlets** | ★★★ | Rapid 3-hit combo flurry with blazing solar sparks. |
| **1** | **Melee** | **Frost Scythe** | ★★★ | Glacial crescent slash that chills and slows enemy movement and attacks by 50%. |
| **2** | **Ranged** | **Firework Crossbow** | ★ | Launches whistling fireworks that explode in colorful starburst AoE sparks. |
| **2** | **Ranged** | **Multi-Bubble Bow** | ★★ | Fires a 3-projectile spread of buoyant hydro bubbles. |
| **2** | **Ranged** | **Snowball Blaster** | ★★ | Rapid-fire snowball barrage that knocks back and staggers advancing foes. |
| **2** | **Ranged** | **Prism Chakram** | ★★★ | Spinning neon ring blade that ricochets up to 4 times between walls and monsters. |
| **3** | **Armor** | **Adventurer Tunic** | ★ | Lightweight forest tunic granting +25% sprint speed and base guard. |
| **3** | **Armor** | **Fox Hoodie** | ★★ | Pointed fox ear cowl creating an automatic emerald & apple magnetic suction aura. |
| **3** | **Armor** | **Diamond Knight Plate** | ★★★ | Heavy cyan plate armor granting +2 extra Max Hearts and 30% damage reduction. |
| **3** | **Armor** | **Glow-Squid Robe** | ★★★ | Deep bioluminescent robe recharging Super Artifact gauge 100% faster. |
| **4** | **Pet** | **Baby Wolf Pup** | ★ | Animated 3D voxel puppy trotting beside you; leaps to bop and stagger slimes. |
| **4** | **Pet** | **Arctic Fox** | ★★ | Agile snow fox that dashes across the room to fetch distant emeralds and food. |
| **4** | **Pet** | **Mini Iron Golem** | ★★★ | Clunky voxel golem with a flower that slams the ground with shockwaves. |
| **4** | **Pet** | **Golden Axolotl** | ★★★ | Floating golden axolotl that periodically heals lost hearts for the party. |
| **5** | **Super** | **Rainbow Beacon** | ★★★ | Sweeping multi-colored neon prism laser beam that disintegrates all foes. |
| **5** | **Super** | **Rocket Spin Boots** | ★★ | Ignites twin rockets for a blazing whirlwind spin dash across the dungeon. |
| **5** | **Super** | **Totem of Healing** | ★★ | Plants a radiant golden totem that pulses green healing light restoring hearts. |
| **5** | **Super** | **Buzzy Bee Hive** | ★★★ | Releases 3 angry voxel bumblebees that swarm, sting, and poison bosses. |

---

### 3. Golden Loot Chest & Foil Card Dispenser Finale
When a Stage Boss is defeated:
1. The boss dissolves into golden stars and bonus emerald drops.
2. A Giant **Golden Voxel Loot Chest** appears in the center of the arena.
3. Striking or pressing `J` / `Space` on the chest triggers the animated **Foil Arcade Card Dispenser Overlay**:
   - Triumphant 5-note brass fanfare plays via the WebAudio synthesizer.
   - An arcade-style card slot animates open.
   - A shimmering holographic card slides out with 3D perspective and dynamic foil sheen gradient animation (`NEW CARD UNLOCKED!` or `FOIL STAR UPGRADE!`).
   - Run summary statistics: Stage, Slimes Bapped, Cages Freed, Emeralds Looted.
   - Navigation actions: `PLAY NEXT STAGE`, `OPEN BINDER`, `REPLAY STAGE`.

---

## Controls

### WebGL Browser Controls

| Action | Desktop Keyboard | USB Gamepad | Mobile Touch |
| :--- | :--- | :--- | :--- |
| **Move Hero** | `WASD` or `Arrow Keys` | Left Stick / D-Pad | Virtual Left Touch D-Pad |
| **Btn 1: Melee Bop** | `J` / `Space` / Click | Button A (Btn 0) | `BOP` (Green Button) |
| **Btn 2: Ranged Bow** | `K` / Right-Click | Button B (Btn 1) | `BOW` (Blue Button) |
| **Btn 3: Dodge Roll Dash** | `L` / `Shift` / `C` | Button X (Btn 2) / `L1` | `DASH` (Yellow Button) |
| **Btn 4: Super Artifact** | `U` / `E` | Button Y (Btn 3) / `R1` | `SUPER` (Purple Button) |
| **Drop-In 2P Co-Op** | `P` (Toggles P2 AI/Human) | Gamepad 2 (`IJKL`) | Quick HUD `Co-Op` Button |
| **Arcade Card Binder** | `G` (or `Esc` to close) | - | Quick HUD `Binder` Button |
| **Toggle Postprocessing Bloom** | `B` | - | Quick HUD `Bloom` Button |
| **Toggle Synthesizer Audio** | `M` | - | Quick HUD `Audio` Button |

---

### Native RetroPie / Raspberry Pi Edition (`Ports`)

A bare-metal C99 + SDL2 + OpenGL ES 2.0 implementation (`block_dungeons.c`) tailored for classic Raspberry Pi hardware running RetroPie directly without desktop overhead:

- **Target Architecture**: Raspberry Pi Model B / Zero / 3 / 4 via native Broadcom VideoCore IV GLES2/EGL or standard Mesa GLES2.
- **Hardware Zero-Asset Pipeline**: Pure procedural 16×16 voxel textures and SDL2 multi-voice audio synthesis with zero runtime disk asset loading.
- **RetroPie Binary Location**: `/opt/retropie/ports/blockdungeons/block_dungeons`
- **RetroPie Launcher Script**: `/home/pi/RetroPie/roms/ports/Block Dungeons Arcade.sh`
- **RetroPie Config**: `/opt/retropie/configs/ports/blockdungeons/emulators.cfg`
- **RetroPie Ports Controls**:

| Action | Keyboard Mapping | RetroPie Arcade / Gamepad |
| :--- | :--- | :--- |
| **Hero Movement** | `W` `A` `S` `D` / `Arrows` | D-Pad / Analog Stick |
| **Button 1 (Melee Spark Bop / Confirm)** | `J`, `Space`, or `Z` | Arcade Btn 1 (Button A / 0) |
| **Button 2 (Firework Bow)** | `K` or `X` | Arcade Btn 2 (Button B / 1) |
| **Button 3 (Dodge Roll Dash)** | `L`, `Left Shift`, or `C` | Arcade Btn 3 (Button X / 2 / L1) |
| **Button 4 (Super Artifact)** | `U` or `E` | Arcade Btn 4 (Button Y / 3 / R1) |
| **Drop-In Co-Op Buddy** | `P` | 2P Start (Btn 8) |
| **Card Binder / Loadout** | `G` or `Tab` | Coin / Select (Btn 6) |
| **Mute Audio** | `M` | - |
| **Pause / Quit to EmulationStation**| `Escape` (or `Right Shift` + `Enter`) | `Select` + `Start` (Buttons 6+7 or 8+9) |

---

## Running Locally

All dependencies (`three.min.js` and `postprocessing.min.js`) are bundled locally within the directory. Serve using any static HTTP server:

```bash
cd /home/macsdev/raspberrypi/block_dungeons_arcade
python3 -m http.server 8080
```

Then navigate to `http://localhost:8080/index.html`.

### Automated Verification Screenshots (`?shot=...`)

The game includes deterministic screenshot modes via URL query parameters:
- `?shot=title`: Displays the live 3D animated Title Attract Screen with hero, pet, and bouncy slimes behind the arcade marquee.
- `?shot=deck`: Opens the 20-Card Arcade Binder modal showcasing unlocked cards and equipped loadout.
- `?shot=gameplay`: Starts Stage 1 (*Mossy Creeper Woods*) with full in-game HUD, HP hearts, radar minimap, crates, and monsters.
- `?shot=dispenser`: Displays the boss victory arena with the Golden Loot Chest and the animated Foil Card Dispenser overlay sliding out a holographic card.
