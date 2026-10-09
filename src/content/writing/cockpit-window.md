---
title: "Cockpit window: streaming satellite tiles to an ESP32"
dek: How a joystick, a small M5Stack screen and a cloudless mosaic of Earth turned into the view from a space shuttle.
draft: true
date: 2026-10-09
tags: [hardware]
project: cockpit-window
---

I wanted a small screen that shows Earth from above, with a joystick to move around. It didn't need to be live — yesterday's imagery or last year's is fine. What mattered was the feeling of looking out of a window.

My first instinct was a whole-globe view. Then it clicked: this is the view from a space shuttle cockpit. Ground scrolling past the window, a little globe in the corner showing where you are.

## The idea

The device is an ESP32 driving an M5Stack-sized display. The joystick doesn't move a map; it moves the shuttle. The screen shows what's below.

::figure[The cockpit window running on the ESP32]{placeholder="PHOTO — DEVICE ON THE DESK"}

## Hardware

| Part         | Role                                             |
| ------------ | ------------------------------------------------ |
| M5Stack Core | The window — screen, ESP32 and Wi-Fi in one box  |
| Joystick     | Flies the shuttle over the ground                |
| [PART]       | [ROLE]                                           |

## Finding the tiles

Because freshness doesn't matter, a cloudless mosaic is the perfect source. I'm using [EOX's Sentinel-2 Cloudless](https://s2maps.eu) tiles: the whole planet, no clouds, served as standard map tiles.

```cpp
// Which slippy-map tile is under the shuttle?
int tileX(double lon, int z) {
  return floor((lon + 180.0) / 360.0 * (1 << z));
}
int tileY(double lat, int z) {
  double r = lat * M_PI / 180.0;
  return floor((1.0 - log(tan(r) + 1.0 / cos(r)) / M_PI) / 2.0 * (1 << z));
}
```

:::note
Single-width symbols — ▲ ░ └ → — line up in every monospace font. Emoji don't.
:::

## Steering the view

[Section in progress — the agent leaves a placeholder until I write it.]

## Handing it to an agent

I wrote the plan as a handover `.md` and gave the implementation to a Claude Code agent. The handover file turned out to be the most useful artifact of the whole project.
