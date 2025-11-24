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

export type AIProvider = 
  | 'gemini' 
  | 'openai' 
  | 'deepseek' 
  | 'moonshot' 
  | 'groq' 
  | 'ollama' 
  | 'openrouter' 
  | 'siliconflow'
  | 'custom';

export interface UserSettings {
  provider: AIProvider;
  apiKey: string;
  model: string;
  baseUrl?: string;
}

export interface SettingsProfile extends UserSettings {
  id: string;
  name: string;
}