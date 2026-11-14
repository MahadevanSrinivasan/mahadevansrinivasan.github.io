# Apex Nitro 3D

A wholesome, kid-friendly 3D arcade street and canyon racing game built with Three.js WebGL, PBR clear-coat reflections (`PMREMGenerator`), and `UnrealBloomPass` post-processing.

Play live at **https://theshybulb.com/apex-nitro/**

## Features

- **Live 3D Cinematic Title Screen**: Opens straight into a live 6-car **Tokyo Neon Underground** street race with sweeping cinema cameras, falling rain streaks, and direct shortcuts to **Quick Race**, **Tuner Speedshop**, **Hot Pursuit**, and **Drift Touge**.
- **3D Underground Speedshop Garage**: Orbit 360° around **6 sculpted supercars** (**Vortex GT-R**, **Diablo V12**, **Titan GT500**, **Phantom RS**, **Cyber Valkyrie**, and **Interceptor X**) inside an illuminated concrete & steel tuning bay. Customize metallic clear-coat paint, radial neon underglow, **4 rim finishes** (**Chrome**, **Solar Gold**, **Stealth Matte**, **Electric Cyan**), and **4 aero wing kits** (**GT Pro Wing**, **Street Ducktail**, **Cyber Twin-Fin**, **Clean Stock**).
- **Signature Visual Realism**:
  - Procedural `PMREMGenerator` environment cubemaps per track & garage bay
  - Dual **tail-light ribbon trails** at high speed & **N2O** boost
  - Specular **wet road puddles**, falling night rain, and overhanging highway streetlights
  - Persistent dual **tire skidmarks**, glowing **orange brake rotors**, and exhaust **shift backfires**
- **Physics, Gearbox & Cockpit View**:
  - **Weight-transfer & counter-steer drift** physics with brake dive & throttle squat
  - **6-speed torque gearbox** switchable between **Auto** and **Manual** (`Q` / `E` paddles) with rev-limiter bounce
  - **Countdown Perfect Launch** (hold the **Green RPM Zone** on `GO!!`) and **Slipstream Drafting** behind rivals
  - **4 camera angles** (**Chase**, **Cockpit** with animated 3D steering wheel & dashboard, **Hood**, **Heli**) + live top-center **3D Rear-View Mirror**
- **3 Continuous 3D Circuits & 3 Modes**:
  - **Tokyo Neon Underground**, **Pacific Sunset Canyon**, and **Alpine Horizon Speedway**
  - **Underground Circuit**, **Drift Touge Showdown**, and **Hot Pursuit Escape**

## Controls

| Action | Desktop | Mobile / Touch |
| --- | --- | --- |
| Accelerate / Brake & Reverse | `W` / `S` or `↑` / `↓` | `GAS` / `BRAKE` buttons |
| Steer Left / Right | `A` / `D` or `←` / `→` | `◀ LEFT` / `▶ RIGHT` |
| Weight-Transfer Drift (`+N2O`) | `Shift` or `B` | `DRIFT` |
| Fire N2O Nitrous Boost | `Space` | `N2O` |
| Manual Downshift / Upshift | `Q` / `E` (`T` toggles Auto/Manual) | `DN` / `UP` (when Manual is active) |
| Cycle Camera (incl. Cockpit) | `C` | `Cam` HUD button |
| Toggle Rear-View Mirror | `V` | `Mirror` HUD button |
| Tuner Speedshop / Mute Audio | `G` / `M` | `Shop` / `Audio` HUD buttons |

## Running Locally

All dependencies (`three.min.js` and `postprocessing.min.js`) are bundled locally. Serve the directory with any static HTTP server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/index.html`.
