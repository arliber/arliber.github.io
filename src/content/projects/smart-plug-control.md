---
title: Smart Plug Control
status: planning
summary: Driving Switcher smart plugs directly from an ESP32 over the local network — no cloud, no app.
order: 16
---

The [aioswitcher](https://github.com/TomerFi/aioswitcher) library already speaks the Switcher local protocol from Python and powers Home Assistant's [Switcher integration](https://www.home-assistant.io/integrations/switcher_kis/). Querying a plug returns its type, state, current draw and power use; turning it on is one command with the device ID and key.

The next step is porting that handshake to the ESP32 so a physical button can control the plugs.
