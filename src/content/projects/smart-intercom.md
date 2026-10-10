---
title: Smart Intercom
status: prototype
summary: Reverse-engineering an old building intercom so an ESP32 can hear the buzzer and open the door.
order: 12
---

Old intercoms talk over a simple two-wire bus. The plan is to listen to it with an ESP32, decode the call and door-open signals, and drive them from software.

## Approach

- Sniff the bus with an [ESP32 logic analyzer](https://github.com/davidedellagiustina/esp32-logic-analyzer)
- Follow Aaron Christophel's [2-wire intercom hacking video](https://www.youtube.com/watch?v=xFLoauqj9yA)
- Learn from how the Nuki Opener integrates with unknown intercom systems
- Power the board from the intercom's 12 V line through a step-down converter
