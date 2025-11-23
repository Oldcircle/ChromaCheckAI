export interface ColorItem {
  name: string;
  hex: string;
  description: string;
}

export interface ColorFormats {
  hex: string;
  rgb: string;
  hsl: string;
  cmyk: string;
}

export interface Palette {
  name: string;
  colors: ColorItem[];
}

export type GenerateStatus = 'idle' | 'loading' | 'success' | 'error';

export type Language = 'en' | 'zh';
