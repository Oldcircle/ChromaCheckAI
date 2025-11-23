import { ColorFormats } from '../types';

// Helper to ensure 2-digit hex
const padZero = (str: string, len: number = 2) => {
  const zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
};

export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  if (!hex) return null;
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return null;

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return { r, g, b };
};

export const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

export const rgbToCmyk = (r: number, g: number, b: number) => {
  let c = 0;
  let m = 0;
  let y = 0;
  let k = 0;

  r = r / 255;
  g = g / 255;
  b = b / 255;

  k = Math.min(1 - r, 1 - g, 1 - b);

  if (k !== 1) {
      c = (1 - r - k) / (1 - k);
      m = (1 - g - k) / (1 - k);
      y = (1 - b - k) / (1 - k);
  }

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  };
};

export const getAllFormats = (hex: string): ColorFormats => {
  const rgbObj = hexToRgb(hex);
  if (!rgbObj) {
    return { hex, rgb: '', hsl: '', cmyk: '' };
  }
  const { r, g, b } = rgbObj;
  const { h, s, l } = rgbToHsl(r, g, b);
  const { c, m, y, k } = rgbToCmyk(r, g, b);

  return {
    hex: hex.toUpperCase(),
    rgb: `${r}, ${g}, ${b}`,
    hsl: `${h}°, ${s}%, ${l}%`,
    cmyk: `${c}%, ${m}%, ${y}%, ${k}%`
  };
};

export const generateShades = (hex: string, steps: number = 10): string[] => {
  const rgb = hexToRgb(hex);
  if (!rgb) return [];

  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const shades: string[] = [];

  // Generate from very dark (l=5%) to very light (l=95%)
  for (let i = 0; i < steps; i++) {
    const newL = 5 + (90 / (steps - 1)) * i;
    shades.push(hslToHex(h, s, newL));
  }
  return shades;
};

const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export const isDarkColor = (hex: string): boolean => {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  // YIQ equation
  const yiq = ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
  return yiq < 128;
};