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

| Action | Desktop | Mobile (`👆 Touch`) | Mobile (`📱 Tilt`) | Mobile (`🎮 Pedals`) |
| --- | --- | --- | --- | --- |
| **Accelerate / Auto-Gas** | `W` or `↑` | Auto-Gas (always accelerating) | Auto-Gas (always accelerating) | `GAS` button |
| **Steer Left / Right** | `A` / `D` or `←` / `→` | Analog thumb drag (floating stick) | Gyroscope device tilt (left/right) | `◀ LEFT` / `▶ RIGHT` |
| **Brake / Reverse** | `S` or `↓` | Swipe down & hold thumb | Tap / hold left half of screen | `BRAKE` button |
| **Weight-Transfer Drift (`+N2O`)** | `Shift` or `B` | Second finger tap OR drag steer + swipe down | Tap left half while steering | `DRIFT` button |
| **Fire N2O Nitrous Boost** | `Space` | Swipe up flick OR `🔥 N2O` quick button | Tap right half of screen | `🔥 N2O` button |
| **Manual Downshift / Upshift** | `Q` / `E` (`T` toggles Auto/Manual) | `DN` / `UP` (when Manual is active) | `DN` / `UP` (when Manual is active) | `DN` / `UP` (when Manual is active) |
| **Cycle Camera (incl. Cockpit)** | `C` | `Cam` HUD button | `Cam` HUD button | `Cam` HUD button |
| **Toggle Rear-View Mirror** | `V` | `Mirror` HUD button | `Mirror` HUD button | `Mirror` HUD button |
| **Tuner Speedshop / Mute Audio** | `G` / `M` | `Shop` / `Audio` HUD buttons | `Shop` / `Audio` HUD buttons | `Shop` / `Audio` HUD buttons |

### 3-Way Native Mobile Control Modes

Apex Nitro 3D auto-detects touchscreen devices and includes an instant 3-way mode pill bar docked in the in-race HUD:
- **`👆 Touch` (Default)**: Clean auto-gas arcade drive. Touch anywhere to spawn an analog floating thumbstick with floating-leash follow. Flick thumb **UP** for instant N2O boost, pull **DOWN** to brake/reverse, tap a **second finger** or turn sharply while pulling down for weight-transfer drift, or tap the dedicated **`🔥 N2O`** button.
- **`📱 Tilt`**: Motion-sensor steering using the device's hardware gyroscope/accelerometer (`deviceorientation` with iOS 13+ permission support, 2.5° deadzone, and 26° full-lock). The screen acts as dual split-screen pedals: tap the **left half** for Drift / Brake and the **right half** for Nitro boost.
- **`🎮 Pedals`**: Classic multi-touch on-screen arcade buttons with dedicated `◀ LEFT`, `▶ RIGHT`, `GAS`, `BRAKE`, `DRIFT`, and `🔥 N2O` pedals.

> **Testing & URL Override**: Append `?mobile=touch`, `?mobile=tilt`, or `?mobile=pedals` to force mobile controls and HUD overlays on desktop browsers for mouse testing (`?mobile=off` disables mobile detection). Mode preferences persist across sessions via `localStorage`.

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
  - Full 3D continuous spline racing circuits (**Tokyo Neon Underground**, **Pacific Sunset Canyon**, **Alpine Horizon Speedway**)
  - 6 sculpted coupe/hypercar models (**Vortex GT-R**, **Diablo V12**, **Titan GT500**, **Phantom RS**, **Cyber Valkyrie**, **Interceptor X**)
  - 360° interactive **3D Tuner Speedshop (Garage)** with custom pearlescent paint, custom rims, neon underglow, and aero wings
  - Weight-transfer drift physics, counter-steering, and active N2O boost recharge
  - Switchable **6-Speed Automatic / Manual Transmission** with gear-ratio acceleration curves and redline RPM management
  - 4 camera angles (**Chase**, **First-Person Cockpit View** with animated 3D steering wheel and working dashboard gauges, **Hood / Bumper**, **High Heli**)
  - Real-time scissor-clipped **3D Rear-View Mirror** rendering
  - Live dynamic race rank tracking (1st to 6th) and official **Finish Results Screen**
  - Procedural SDL2 multi-channel synthesizer soundtrack and dynamic rev-matched engine audio

### Compilation & RetroPie Ports Setup

On the Raspberry Pi (using Broadcom VideoCore IV GLES2/EGL libraries):

```bash
# Compile native ARM binary
gcc -O3 -Wall -Wextra $(sdl2-config --cflags) \
  -mcpu=arm1176jzf-s -mfpu=vfp -mfloat-abi=hard \
  -DRPI_BUILD -I/opt/vc/include -I/opt/vc/include/interface/vcos/pthreads -I/opt/vc/include/interface/vmcs_host/linux \
  apex_nitro.c -o /opt/retropie/ports/apexnitro/apex_nitro \
  $(sdl2-config --libs) -L/opt/vc/lib -lbrcmGLESv2 -lbrcmEGL -lbcm_host -lm

# RetroPie Ports Launcher (~/RetroPie/roms/ports/Apex Nitro 3D.sh)
cat << 'EOF' > "/home/pi/RetroPie/roms/ports/Apex Nitro 3D.sh"
#!/bin/bash
"/opt/retropie/supplementary/runcommand/runcommand.sh" 0 _PORT_ "apexnitro" ""
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
| **Steer Left / Right** | `A` / `D` or `←` / `→` | D-Pad / Left Analog Stick |
| **Accelerate / Gas** | `W` or `↑` or `X` (*revs engine on starting grid!*) | Button A / Trigger (Btn 0 / 1) |
| **Brake / Reverse** | `S` or `↓` | Button B / Trigger (Btn 2) |
| **Drift / Handbrake** | `Z` or `Left Shift` or `B` | Shoulder Buttons (Btn 3 / 4) |
| **Nitro (N2O Boost)** | `Space` or `Left Ctrl` | Button X / Trigger (Btn 5) |
| **Menu Highlight & Adjust** | `↑` / `↓` (Row), `←` / `→` (Cycle) | D-Pad Up / Down / Left / Right |
| **Confirm / Launch Race** | `Enter`, `Space`, or `X` | Start / Buttons 0 / 1 / 7 / 9 |
| **Cycle Camera (4 Modes)** | `C` (Chase, Cockpit, Hood, Heli) | Shoulder Button |
| **Toggle Rear-View Mirror** | `V` | - |
| **Toggle Auto / Manual Gearbox** | `T` (or Speedshop row 6) | - |
| **Manual Downshift / Upshift** | `Q` / `E` | L1 / R1 (Buttons 4 / 5) |
| **Mute / Unmute Audio** | `M` | - |
| **Tuner Speedshop / Garage** | `G` (or row 2 on Title) | - |
| **Title Quick Select** | `1` (Circuit), `2` (Garage), `3` (Pursuit), `4` (Drift) | - |
| **Garage Customization** | `1` (Car), `2` (Paint), `3` (Rims), `4` (Glow), `5` (Wing), `6` (Gearbox), `7` (Track), `8` (Mode) | - |
| **Race Results Actions** | `Enter` / `Space` (Restart), `G` (Speedshop), `Esc` (Title) | Buttons 0 / 7 / 9 (Restart), Btn 1 (Title) |
| **Quit to EmulationStation** | `Escape` or `Right Shift` + `Enter` | `Select` + `Start` (Buttons 6+7 or 8+9) |
