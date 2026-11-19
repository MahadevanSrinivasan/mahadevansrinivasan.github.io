# 🏎️ Road Fighter (Classic 1985 NES 8-Bit Edition)

An authentic **`320x240` pixel-art 8-bit arcade highway racer** inspired by the 1985 NES classic, featuring scanline-rendered vertical courses, a classic right-hand NES black HUD sidebar, 2-gear manual transmission physics, counter-steer skid recovery, and WebAudio 2A03 square/triangle/noise synthesis.

## Play Online
- **Live Web Version**: [https://theshybulb.com/road-fighter/](https://theshybulb.com/road-fighter/)

## All 4 Iconic Courses
1. **Course 1 — GRASSLAND (`9,500` units)**: Lush green meadows, oak trees, bushes, wildflower shoulders, and wide sweeping curves (`70px` half-width).
2. **Course 2 — OCEAN BRIDGE (`10,500` units)**: Deep blue animated ocean whitecaps, riveted steel bridge girders, yellow/black curbstones, and narrowing bridge bottlenecks (`50px` half-width).
3. **Course 3 — SEASHORE (`11,200` units)**: Golden sandy beaches with palm trees on the left, foamy surf and ocean waves on the right, and coastal S-curves (`60px` half-width).
4. **Course 4 — MOUNTAIN PASS (`12,000` units)**: Winding rocky cliff pass (`54px` half-width), dark pine trees, and darkened stone tunnel sections with arched masonry portals.

## Gameplay & Features
- **2-Gear Physics (`LOW` / `HIGH`)**: Shift up smoothly from `LOW` (`0–196 km/h`) into `HIGH` (`up to 400 km/h`) for maximum speed and twin exhaust flames at `300+ km/h`.
- **Counter-Steer Skid Recovery**: Grazing traffic or hitting an Oil Slick triggers a `SKID` (`STEER <` / `STEER >`). Counter-steer into the slide to recover with **`NICE SAVE +200!`** instead of spinning out.
- **Traffic & Hazards**: Dodge Yellow Cruisers, amber-signaling Blue Switchers, aggressive Pink Turbo Rivals, 18-Wheeler Semi-Trucks, Water Puddles (splash slowdown), Oil Slicks, and Construction Barriers.
- **Rainbow Fuel Cars**: Collect shimmering Rainbow Fuel Cars (`+15 FUEL`, `+1000 PTS`), tracked as cyan ticks on the vertical HUD mini-map.
- **Sky-Hero Easter Egg**: Maintain `300+ km/h` cleanly for `6.5s` to summon the caped Sky-Hero up the left verge for **`+2000 PTS`**.
- **2 Difficulty Levels**: `LEVEL 1 (ARCADE)` and `LEVEL 2 (PRO)`.

## Controls
| Action | Keyboard | Mobile / Touch | Gamepad / RetroPie |
| :--- | :--- | :--- | :--- |
| **Steer Left / Right** | `←` / `→` or `A` / `D` | `◀` / `▶` | D-Pad / Left Stick |
| **Low Gear (`0–196 km/h`)** | `Z` / `Shift` | `B (LOW)` | `B` / `X` |
| **High Gear (`150–400 km/h`)** | `X` / `Space` / `↑` / `W` | `A (HIGH)` | `A` / `Y` |
| **Brake** | `↓` / `S` | — | D-Pad Down |
| **Start / Confirm** | `Enter` / `Space` | Tap Screen | `Start` |
| **Mute Audio / Title** | `M` / `Esc` | Topbar `🔊 SFX` | — |

## RetroPie / Raspberry Pi Setup
- **Web / Kiosk Mode**: Serve the `road_fighter/` folder over HTTP (or open `index.html` in Chromium kiosk mode on Raspberry Pi). Plug-and-play USB/Bluetooth gamepads are supported automatically via the HTML5 Gamepad API.
- **Native Port (`road_fighter.c`)**: If building the companion SDL2 native port in this folder for RetroPie Ports:
  ```bash
  gcc road_fighter.c -o road_fighter -lSDL2 -lGLESv2 -lm -O2
  ```
  Launch from `/home/pi/RetroPie/roms/ports/RoadFighter.sh` and map your controller D-Pad and `A`/`B` buttons in EmulationStation.
