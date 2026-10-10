---
title: E-Ink Dashboard
status: prototype
summary: A tiny e-ink screen, maybe a keychain, that shows my board and calendar — rendered on a server, displayed by a dumb ESP32.
order: 13
---

The trick, borrowed from [TRMNL's bring-your-own-server](https://usetrmnl.com/blog/introducing-byos) idea: generate an image on the server and let the ESP32 do nothing but render it. No layout logic on the device, so it can sleep almost all the time.
