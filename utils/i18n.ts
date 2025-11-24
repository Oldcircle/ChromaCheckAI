import { Language, ColorItem } from '../types';

interface Translation {
  appTitle: string;
  tagline: string;
  poweredBy: string;
  heroTitle: string;
  heroSubtitle: string;
  placeholder: string;
  generate: string;
  currentPalette: string;
  colorsGenerated: string;
  failedToGenerate: string;
  copied: string;
  selectColor: string;
  colorCodes: string;
  tintsAndShades: string;
  clickToCopy: string;
  copyHex: string;
  sampleColors: ColorItem[];
  colorCount: string;
  // Settings
  settings: string;
  configureAI: string;
  provider: string;
  apiKey: string;
  modelName: string;
  baseUrl: string;
  save: string;
  cancel: string;
  apiKeyPlaceholder: string;
  baseUrlPlaceholder: string;
  useEnvDefault: string;
  // Profiles
  profiles: string;
  newProfile: string;
  deleteProfile: string;
  profileName: string;
  defaultProfileName: string;
  confirmDelete: string;
}

export const translations: Record<Language, Translation> = {
  en: {
    appTitle: 'ChromaCheck',
    tagline: 'AI',
    poweredBy: 'Powered by AI',
    heroTitle: 'Design better with AI colors',
    heroSubtitle: 'Describe a mood, object, or theme (e.g., "Sunset in Tokyo", "Cyberpunk Neon", "Forest Rain")',
    placeholder: 'Describe your color theme...',
    generate: 'Generate',
    currentPalette: 'Current Palette',
    colorsGenerated: 'colors generated',
    failedToGenerate: 'Failed to generate palette. Please check your API Key or settings.',
    copied: 'Copied',
    selectColor: 'Select a color from the palette to inspect its codes and generate shades.',
    colorCodes: 'Color Codes',
    tintsAndShades: 'Tints & Shades',
    clickToCopy: 'Click any shade to copy Hex',
    copyHex: 'Copy HEX',
    colorCount: 'Number of colors',
    sampleColors: [
      { name: 'Deep Ocean', hex: '#0F4C75', description: 'A calm, deep blue representing depth and stability.' },
      { name: 'Coral Reef', hex: '#FF7E67', description: 'Vibrant warm accent for energetic highlights.' },
      { name: 'Sand Dollar', hex: '#F4F1EA', description: 'Soft, neutral background color for readability.' },
      { name: 'Seafoam', hex: '#A8D8EA', description: 'Light, airy blue for secondary backgrounds.' },
      { name: 'Driftwood', hex: '#594F4F', description: 'Solid dark neutral for text and borders.' },
      { name: 'Algae Green', hex: '#3282B8', description: 'A bridge color between the deep blue and light cyan.' }
    ],
    settings: 'Settings',
    configureAI: 'Configure AI Provider',
    provider: 'Provider',
    apiKey: 'API Key',
    modelName: 'Model Name',
    baseUrl: 'Base URL',
    save: 'Save & Close',
    cancel: 'Cancel',
    apiKeyPlaceholder: 'Enter your API Key',
    baseUrlPlaceholder: 'https://api.example.com/v1',
    useEnvDefault: 'Leave empty to use default env var (if configured)',
    profiles: 'Profiles',
    newProfile: 'New Profile',
    deleteProfile: 'Delete Profile',
    profileName: 'Profile Name',
    defaultProfileName: 'Default (Gemini)',
    confirmDelete: 'Are you sure you want to delete this profile?'
  },
  zh: {
    appTitle: 'ChromaCheck',
    tagline: 'AI',
    poweredBy: '由 AI 驱动',
    heroTitle: '用 AI 色彩点亮设计',
    heroSubtitle: '描述一种心情、物体或主题（例如：“东京日落”、“赛博朋克霓虹”、“雨后森林”）',
    placeholder: '描述你的配色主题...',
    generate: '生成调色板',
    currentPalette: '当前调色板',
    colorsGenerated: '个颜色已生成',
    failedToGenerate: '生成调色板失败，请检查 API Key 或网络设置。',
    copied: '已复制',
    selectColor: '从调色板中选择一种颜色以查看代码并生成色调。',
    colorCodes: '颜色代码',
    tintsAndShades: '色调与阴影',
    clickToCopy: '点击任意色块复制 Hex',
    copyHex: '复制 HEX',
    colorCount: '颜色数量',
    sampleColors: [
      { name: '深海蓝', hex: '#0F4C75', description: '一种平静、深邃的蓝色，代表深度和稳定性。' },
      { name: '珊瑚红', hex: '#FF7E67', description: '充满活力的暖色调，用于高光点缀。' },
      { name: '沙币白', hex: '#F4F1EA', description: '柔和的中性背景色，便于阅读。' },
      { name: '海沫绿', hex: '#A8D8EA', description: '轻盈通透的蓝色，适合次要背景。' },
      { name: '浮木灰', hex: '#594F4F', description: '稳重的深中性色，用于文本和边框。' },
      { name: '藻类蓝', hex: '#3282B8', description: '连接深蓝与浅青的过渡色。' }
    ],
    settings: '设置',
    configureAI: '配置 AI 模型',
    provider: '服务商',
    apiKey: 'API 密钥',
    modelName: '模型名称',
    baseUrl: 'API 地址 (Base URL)',
    save: '保存并关闭',
    cancel: '取消',
    apiKeyPlaceholder: '输入你的 API Key',
    baseUrlPlaceholder: 'https://api.example.com/v1',
    useEnvDefault: '留空以使用默认环境变量 (若已配置)',
    profiles: '配置列表',
    newProfile: '新建配置',
    deleteProfile: '删除配置',
    profileName: '配置名称',
    defaultProfileName: '默认 (Gemini)',
    confirmDelete: '确定要删除此配置吗？'
  }
};