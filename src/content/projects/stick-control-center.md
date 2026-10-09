---
title: Stick Control Center
status: planning
summary: A pocket control surface for my self-hosted agent on an M5Stack StickC S3 — server health, heartbeats, tasks, and hold-to-talk voice notes.
order: 11
---

A thumb-sized remote for [OpenClaw](https://openclaw.ai/), the self-hosted agent that lives in my messaging apps: see that it's healthy, see what it's doing, and push a button to make it do something.

## First plan

- [M5Launcher](https://github.com/bmorcelli/Launcher) as a bootloader, for multiple apps and over-the-air installs
- MicroPython apps, for fast iteration
- A FastAPI endpoint on the agent's host: `GET /status` for health, heartbeats, tasks and alerts; `POST /action` to trigger things
- The device polls every 10–30 seconds over Wi-Fi

## Then audio changed everything

Voice capture for quick notes rules out MicroPython, which can't do real-time audio. The revised stack is a single C++ firmware:

| Layer | Choice |
| ----- | ------ |
| Build | PlatformIO + Arduino |
| Hardware abstraction | M5Unified |
| Display | LovyanGFX, double-buffered sprites |
| Audio | I²S PDM mic, 16-bit / 16 kHz |
| Transcription | Server-side Whisper |

Hold a button to record, release to POST the WAV to the server, which transcribes it and files a note or runs a command. The ESP32-S3's PSRAM holds 10–15 seconds of audio.
