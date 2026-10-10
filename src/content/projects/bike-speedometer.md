---
title: Bike Speedometer
status: prototype
summary: An animated round-dial speedometer for a bike, on a GC9A01 display with a 6-axis motion sensor.
order: 10
---

A round 240×240 GC9A01 display mounted on the handlebars, drawing an animated dial with `TFT_eSPI`, fed by an MPU-92/65 motion sensor.

## Building blocks

- `TFT_eSPI`'s [Animated_dial sprite example](https://github.com/Bodmer/TFT_eSPI/tree/master/examples/Sprite/Animated_dial) for the gauge
- DroneBot Workshop's guide to [GC9A01 round LCD modules](https://dronebotworkshop.com/gc9a01/)
- Kris Winer's [MPU9250 AHRS sketch](https://github.com/kriswiner/MPU9250/blob/master/MPU9250BasicAHRS.ino) for the sensor

## Wiring

| Display | ESP32 |
| ------- | ----- |
| RST | 25 |
| CS | 26 |
| DC | 27 |
| SDA | 14 |
| SCL | 12 |

The sensor sits on the I²C bus (SCL 22).
