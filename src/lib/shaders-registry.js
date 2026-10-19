// Stand-in for shaders' internal `core/shaderRegistry-*.js` chunk (swapped in by the
// plugin in astro.config.mjs). The stock chunk imports all ~200 effects (~700 KB
// gzipped); the renderer only needs the definitions our presets name.
// Add an import here before using another effect type in a preset.
import Ascii from 'shaders/core/Ascii';
import Dither from 'shaders/core/Dither';
import ImageTexture from 'shaders/core/ImageTexture';
import Paper from 'shaders/core/Paper';
import SimplexNoise from 'shaders/core/SimplexNoise';
import SolidColor from 'shaders/core/SolidColor';

const entries = [Ascii, Dither, ImageTexture, Paper, SimplexNoise, SolidColor].map((definition) => ({ name: definition.name, definition }));
const shaderRegistry = Object.fromEntries(entries.map((e) => [e.name, e]));
const getAllShaders = () => entries;
const getShaderByName = (name) => shaderRegistry[name];
const getShadersByCategory = () => [];
const getShaderCategories = () => [];

// Same (minified) export names as the chunk this replaces, shaders@4.0.4.
export { shaderRegistry as a, getShadersByCategory as i, getShaderByName as n, getShaderCategories as r, getAllShaders as t };
