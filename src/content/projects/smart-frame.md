---
title: Futuristic Smart Frame
status: planning
summary: An e-ink display behind a functional cutout in a picture, inside a deep frame that hides an ESP32 and a battery.
image: /img/projects/smart-frame-sketch.jpg
order: 6
---

A picture frame where part of the picture is alive. An e-ink display sits behind a cutout in the canvas, framed by an outline that is part of the artwork itself.

::figure[The first sketch]{src="/img/projects/smart-frame-sketch.jpg" alt="Hand-drawn sketch of a picture frame with a cutout showing a clock, with notes on components"}

## Components

| Part | Role |
| ---- | ---- |
| ESP32 | Drives the display and fetches what to show |
| E-ink display | Sits behind the cutout |
| Battery | Hidden in the depth of the frame |
| A thick picture frame | Deep enough for the electronics, or two frames stacked |

The outline could also be a separate layer glued on top of the image and sprayed silver for a metal look, with black material beneath. Hacking an old Kindle for its e-paper panel is the prior art — see [Sam Khawase's write-up](https://samkhawase.com/blog/hacking-kindle/).
