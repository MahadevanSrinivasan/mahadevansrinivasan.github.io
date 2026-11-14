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

## Native RetroPie / Raspberry Pi Edition (OpenGL ES 2.0 + SDL2)

A dedicated, lightweight bare-metal C99 + SDL2 port (`apex_nitro.c`) built specifically for classic low-power hardware with zero external image or audio asset dependencies.

- **Hardware Target**: Raspberry Pi Model B Rev 2 (ARMv6 700MHz, 512MB RAM, Broadcom VideoCore IV GPU) running RetroPie directly via SDL2 + native OpenGL ES 2.0 with **zero X11 overhead**.
- **Complete Feature Parity**:
  - Full 3D continuous spline racing circuits (**Neon Metropolis**, **Canyon Pass**, **Midnight Highway**)
  - 6 sculpted coupe/hypercar models (**Tuner R34**, **Exotic GT**, **Muscle 69**, **Hyper S**, **Euro Drift**, **Roadster**)
  - 360° interactive **3D Tuner Speedshop (Garage)** with custom pearlescent paint, custom rims, neon underglow, and aero wings
  - Weight-transfer drift physics, counter-steering, and active N2O boost recharge
  - Switchable **6-Speed Automatic / Manual Transmission** with gear-ratio acceleration curves and redline RPM management
  - 4 camera angles including **First-Person Cockpit View** with animated 3D steering wheel and working dashboard gauges
  - Real-time scissor-clipped **3D Rear-View Mirror** rendering
  - Procedural SDL2 multi-channel synthesizer soundtrack and dynamic rev-matched engine audio

### Compilation & RetroPie Ports Setup

On the Raspberry Pi (using Broadcom VideoCore IV GLES2/EGL libraries):

```bash
# Compile native ARM binary
gcc -O3 -Wall -Wextra $(sdl2-config --cflags) \
  -DRPI_BUILD -I/opt/vc/include -I/opt/vc/include/interface/vcos/pthreads -I/opt/vc/include/interface/vmcs_host/linux \
  apex_nitro.c -o /home/pi/RetroPie/roms/ports/apex_nitro \
  $(sdl2-config --libs) -L/opt/vc/lib -lbrcmGLESv2 -lbrcmEGL -lbcm_host -lm

# RetroPie Ports Launcher (~/RetroPie/roms/ports/Apex Nitro 3D.sh)
cat << 'EOF' > "/home/pi/RetroPie/roms/ports/Apex Nitro 3D.sh"
#!/bin/bash
/home/pi/RetroPie/roms/ports/apex_nitro
EOF
chmod +x "/home/pi/RetroPie/roms/ports/Apex Nitro 3D.sh"
```

On Desktop Linux (Standard Mesa GLES2/EGL):
```bash
gcc -O3 -Wall -Wextra $(sdl2-config --cflags) \
  apex_nitro.c -o apex_nitro \
  $(sdl2-config --libs) -lGLESv2 -lEGL -lm
```

### RetroPie Controls

| Action | Keyboard | USB Gamepad |
| :--- | :--- | :--- |
| **Steer Left / Right** | `A` / `D` or `←` / `→` | D-Pad / Analog Stick |
| **Accelerate / Gas** | `W` or `↑` or `X` (*revs engine on starting grid!*) | Button A / Trigger |
| **Brake / Reverse** | `S` or `↓` | Button B / Trigger |
| **Drift / Handbrake** | `Z` or `Left Shift` or `Space` | Shoulder Button / Trigger |
| **Nitro (N2O Boost)** | `Space` or `Left Ctrl` | Button X / Turbo |
| **Cycle Camera (incl. Cockpit)** | `C` | Shoulder Button |
| **Toggle Rear-View Mirror** | `V` | - |
| **Toggle Auto / Manual Gearbox** | `T` | - |
| **Manual Downshift / Upshift** | `Q` / `E` | L1 / R1 |
| **Mute / Unmute Audio** | `M` | - |
| **Tuner Speedshop / Garage** | `G` (or `2` on Title screen) | - |
| **Title Quick Select** | `1` (Circuit), `2` (Garage), `3` (Drift), `4` (Time Attack) | - |
| **Garage Customization** | `1` (Car), `2` (Paint), `3` (Rims), `4` (Glow), `5` (Wing), `7` (Track), `8` (Mode) | - |
| **Launch Race / Confirm** | `Enter`, `Space`, or `X` | Start / Button A |
| **Quit to EmulationStation** | `Escape` or `Right Shift` + `Enter` | `Select` + `Start` |
