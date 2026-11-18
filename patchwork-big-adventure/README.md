# Patchwork Big Adventure

A warm, sunlit, handcrafted 3D platformer built with **Three.js (r128)** and `UnrealBloomPass` post-processing, inspired by *Sackboy: A Big Adventure*.

## Features

- **Tactile Procedural PBR Craft Materials (`512×512` `CanvasTexture`)**:
  - Diagonal knitted yarn & burlap weave with tactile bump maps for hero **Patch** and co-op buddy **Stitch**.
  - Stitched felt turf (Emerald Meadow, Lavender Velvet, Terracotta Paper, Ocean Sponge, Snow Knit) with white dashed running-stitch seams.
  - Corrugated cardboard with cream masking-tape X-patches, wood thread spools, glossy 4-hole candy buttons, and translucent turquoise cellophane ocean waves illuminated by a `PMREMGenerator` procedural sky environment map.
- **5 Seamless Core Biomes (`~480m × 480m` Continent)**:
  1. **Soaring Stitching Meadows (`0, 0`)** — Rolling felt hills, interactive **Musical Rainbow Piano Bridge**, rotating thread-spool bridge, **ZomZom's Costume Caravan**, and **Hot-Air Yarn Balloon** fast-travel pad.
  2. **Cardboard Castle Peaks (`0, -130`)** — Multi-tier corrugated cardboard ramparts, sponge bounce towers, spinning pencil windmills, and Goof-Bots.
  3. **Button Bay & Sponge Reef (`+130, 0`)** — Translucent turquoise cellophane ocean waves, button islands, and bubble geyser updrafts.
  4. **Velvet Cloudworks & Clockwork Loft (`-130, 0`)** — Indigo quilted platforms, rotating brass gear decks, overhead **Grapple Swing Rings**, and lantern balloons.
  5. **Origami Canyon & Confetti Peak (`0, +130`)** — Folded-paper mesas, paper-fan updrafts, glowing **Yarn Zip-Rails**, and confetti peak.
- **Infinite Procedural Frontier Islands (`WorldStreamer`)**:
  - Streams a `3×3` neighborhood of `90m × 90m` craft sky-islands outside the core continent (`|cx| > 1 || |cz| > 1`) with deterministic seeded biome themes, pink Sponge Bounce Pads, overhead Grapple Rings, inter-island button stepping stones, breakable Gift Boxes, Cardboard Goof-Bots, Pom-Pom Hoppers, Dreamer Orbs, and **Island Discovery Flagpoles** saved to `localStorage` (`patchworkAdventureSave_v1`).
- **ZomZom's Wardrobe (`G`)**:
  - Mix and match **8 Yarn Colors**, **8 3D Hats**, and **6 Outfits** on a live rotating 3D showroom turntable.
- **World Map & Balloon Fast-Travel (`M`)**:
  - Interactive map plotting all 5 Core Biomes and discovered Frontier Islands with 1-click fast-travel and `"Sail Balloon to New Frontier Island!"`.
- **2P Drop-In Co-Op (`P` / `B`)**:
  - Toggle helpful AI co-op buddy **Stitch** (`P`) and bubble-teleport Stitch to Patch (`B`).

## Controls

| Action | Input |
| :--- | :--- |
| Move (360° camera-relative) | `WASD` / Arrow Keys / Gamepad Left Stick / Touch Stick |
| Camera Orbit | Mouse Drag / `,` & `.` / Gamepad Right Stick |
| Jump & Mid-Air Flutter-Hover | `Space` (hold in air to flutter-hover) |
| Cartwheel Roll-Dash | `Shift` / `L` |
| Spin-Slap | `J` / Left Click |
| Ground-Pound | `E` / `C` (while airborne) |
| Grab, Carry & Toss | `F` / Right Click |
| Cycle / Use Craft Gadget | `1` / `2` / `3` or `Q` to cycle, `K` to activate |
| ZomZom's Wardrobe | `G` |
| World Map & Balloon Travel | `M` |
| Toggle Co-Op Buddy / Bubble-Call | `P` / `B` |

## Running Locally

Serve the folder with any static HTTP server (e.g. `python3 -m http.server 8791`) and open `http://127.0.0.1:8791/` in a WebGL-capable browser.
