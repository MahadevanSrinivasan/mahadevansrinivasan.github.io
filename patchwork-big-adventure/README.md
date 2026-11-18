# Patchwork Big Adventure

A warm, sunlit, handcrafted 3D platformer built with **Three.js (r128)**, `EffectComposer` + `UnrealBloomPass` + custom `OutputFXAAShader` post-processing, inspired by *Sackboy: A Big Adventure*.

## v2 Visual Overhaul Architecture

- **Sculpted Craft Geometry Kit**:
  - `createRoundedBoxGeometry`: Filleted smooth-edge boxes with analytic corner normals and clean UVs across castle keeps, battlements, piano keys, gift boxes, and ZomZom's Caravan.
  - `createIslandTopGeo` & `createIslandUnderbellyGeo`: FBM-sculpted floating islands with contoured playable felt turf, stitched cord rims, faceted rocky/quilted underbellies with vertex-baked AO, and hanging yarn tendrils + button charms, accurately matched by `sampleFloor`.
  - Organic craft trees (`CatmullRomCurve3` + `TubeGeometry` trunks, flared roots, and noise-sculpted `IcosahedronGeometry` felt canopy lobes), layered petal flowers, wooden rope bridges, spoked Caravan cartwheels + string lanterns, multi-gore `LatheGeometry` Hot-Air Balloon, and pencil-and-erasertip castle windmills.
- **GPU-Instanced Grass & Stylized GLSL Water**:
  - `InstancedMesh` swaying 3D grass blades (`~9,600` across Stitching Meadows + `~900` per grass frontier island) with per-instance color variation and `onBeforeCompile` world-space wind animation.
  - Custom WebGL1 `ShaderMaterial` ocean water & distant horizon sea (`y = -18`) with dual scrolling sine ripples, Fresnel highlights, sun specular glints, and animated shoreline foam rings.
- **Multi-Jointed Plush Rig & Velvet Fuzz**:
  - `LatheGeometry` pear-shaped torso with metallic zipper track + brass pull ring, articulated shoulder/elbow/mitten/boot limbs, recessed eye sockets with beveled 3D 4-hole button eyes, 3D stitched smile, sculpted 3D hats, and vertex-wave animated cloth cape.
  - High-frequency (`repeat = 5.5`) micro-weave knit bump/roughness + grazing-angle Fresnel velvet rim-fuzz shader (`onBeforeCompile`).
- **4-Channel `512×512` PBR, Studio IBL, 5-Light Rig & Post-Processing**:
  - Synchronized `map`, `bumpMap`, `roughnessMap`, and `emissiveMap` channels baked into procedural `CanvasTexture`s with `PMREMGenerator` multi-panel `RoomEnvironment` IBL.
  - `38°` diorama lens, `HemisphereLight`, `2048×2048` `±24m` tracking sun shadows, cool opposing `rimLight`, warm Hero `PointLight`, `6` pooled dynamic local `PointLight`s, and ground-pinned radial contact-shadow decals.
  - `HalfFloatType` (with `UnsignedByteType` fallback) HDR composer -> `UnrealBloomPass(threshold = 0.88, strength = 0.36, radius = 0.35)` -> `OutputFXAAShader` (directional FXAA + warm diorama vignette + ACESFilmic tone mapping + Linear-to-sRGB).
- **Procedural `2×2` VFX Atlas (`360`-Instance Pool)**:
  - Single-draw-call `InstancedMesh` particles (`radial`, `starburst`, `slash`, `shockwave`) driving ambient sunlit pollen motes, velocity-stretched bounce sparkles, Dreamer Orb wisps, spin-slap slash arcs, and ground-pound shockwaves.

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
