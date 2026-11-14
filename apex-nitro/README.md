# Apex Nitro 3D

A wholesome, kid-friendly 3D arcade street and canyon racing game built with Three.js WebGL and UnrealBloom post-processing.

Play live at **https://theshybulb.com/apex-nitro/**

## Features

- **3D Tuner Garage**: Preview custom builds on a rotating neon turntable across **6 sculpted supercars** (**Vortex GT-R**, **Diablo V12**, **Titan GT500**, **Phantom RS**, **Cyber Valkyrie**, and **Interceptor X**) with selectable metallic paint swatches, neon underglow colors, aero wing kits (**GT Pro Wing**, **Street Ducktail**, **Cyber Twin-Fin**, **Clean Stock**), and a toggleable **Bloom** FX switch.
- **3 Continuous 3D Circuits**:
  - **Tokyo Neon Underground** — Wet-reflection night asphalt, neon towers, and light tunnels.
  - **Pacific Sunset Canyon** — Coastal canyon curves, warm sunset fog, and rock tunnels.
  - **Alpine Horizon Speedway** — Crisp daylight high-speed chicanes, alpine slopes, and mountain vistas.
- **3 Race Modes**:
  - **Underground Circuit** — 3 laps against 5 AI rivals to claim P1.
  - **Drift Touge Showdown** — 2 laps focused on chaining drift style combos.
  - **Hot Pursuit Escape** — 2 laps escaping 3 AI **Interceptor X** units under a Heat 3 countdown.
- **NFS-Style HUD & Physics**: Arcade grip and handbrake drifting, slipstream & drift-charged **N2O** nitrous boost, wall-gliding barrier sparks, curved 6-speed RPM/MPH/N2O tachometer, track radar minimap, procedural Web Audio engine/turbo/tire/synthwave audio, and camera presets.
- **Desktop & Mobile Ready**: Full keyboard support and multi-touch steering, drift, gas, and N2O pedals for phones and tablets.

## Controls

| Action | Desktop | Mobile / Touch |
| --- | --- | --- |
| Accelerate / Brake & Reverse | `W` / `S` or `↑` / `↓` | `GAS` touch button |
| Steer Left / Right | `A` / `D` or `←` / `→` | `◀ LEFT` / `▶ RIGHT` |
| Handbrake Drift (builds N2O) | `Shift` or `B` | `DRIFT` |
| Fire N2O Nitrous Boost | `Space` | `N2O` |
| Cycle Camera / Garage / Mute | `C` / `G` / `M` | HUD action buttons |

## Running Locally

All scripts (`three.min.js` and `postprocessing.min.js`) are bundled locally with no external runtime CDN dependencies. Serve the directory with any static HTTP server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/index.html`.
