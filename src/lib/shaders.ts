// Client-only helpers for the optional WebGPU effects (https://shaders.com).
// Everything degrades to the plain markup: no WebGPU, no effect.
import type { PresetConfig, ShaderInstance } from 'shaders/js';

export const hasWebGPU = () => typeof navigator !== 'undefined' && 'gpu' in navigator;

/** Resolved value of a CSS custom property on <html>, for the current theme. */
export const token = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/** Runs `fn` whenever the light/dark theme flips. */
export const onThemeChange = (fn: () => void) =>
  new MutationObserver(fn).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

/** Mounts a preset on `canvas`; resolves to null if the GPU path isn't available. */
export async function mount(canvas: HTMLCanvasElement, preset: PresetConfig, onReady?: () => void): Promise<ShaderInstance | null> {
  if (!hasWebGPU()) return null;
  try {
    const { createShader } = await import('shaders/js');
    const shader = await createShader(canvas, preset, {
      disableTelemetry: true, // the site has no analytics; keep it that way
      onReady,
      onError: () => canvas.remove(),
    });
    return shader.getFailureReason() ? null : shader;
  } catch {
    canvas.remove();
    return null;
  }
}
