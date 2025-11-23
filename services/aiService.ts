import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ColorItem, Language } from "../types";

// Configuration from environment variables
const CONFIG = {
  // 'gemini' | 'openai' | 'deepseek' | 'custom'
  provider: process.env.API_PROVIDER || 'gemini', 
  apiKey: process.env.API_KEY || '',
  // Specific model name (e.g., 'gpt-4o', 'deepseek-chat', 'gemini-2.5-flash')
  model: process.env.API_MODEL, 
  // Base URL for OpenAI-compatible endpoints (required for DeepSeek or custom proxies)
  baseUrl: process.env.API_BASE_URL,
};

// --- Gemini Implementation ---
const geminiSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "A creative name for the color" },
      hex: { type: Type.STRING, description: "The 6-digit hex code including #" },
      description: { type: Type.STRING, description: "A short usage tip or mood description" },
    },
    required: ["name", "hex", "description"],
  },
};

const generateGemini = async (prompt: string, langInstruction: string, count: number): Promise<ColorItem[]> => {
  const genAI = new GoogleGenAI({ apiKey: CONFIG.apiKey });
  const modelName = CONFIG.model || "gemini-2.5-flash";

  const response = await genAI.models.generateContent({
    model: modelName,
    contents: `Generate a cohesive color palette of exactly ${count} colors based on the following theme or description: "${prompt}". 
      Ensure the colors work well together for a UI or graphic design project. 
      ${langInstruction}
      Return strictly JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: geminiSchema,
      temperature: 0.7,
    },
  });

  const jsonText = response.text;
  if (!jsonText) throw new Error("Empty response from Gemini");
  return JSON.parse(jsonText) as ColorItem[];
};

// --- OpenAI / DeepSeek / Generic Implementation ---
const generateOpenAICompatible = async (prompt: string, langInstruction: string, count: number): Promise<ColorItem[]> => {
  const baseUrl = CONFIG.baseUrl || (CONFIG.provider === 'deepseek' ? 'https://api.deepseek.com' : 'https://api.openai.com/v1');
  const model = CONFIG.model || (CONFIG.provider === 'deepseek' ? 'deepseek-chat' : 'gpt-4o');
  
  const systemPrompt = `You are a professional color palette generator.
  You must output a valid JSON array containing exactly ${count} objects.
  Each object must have these fields:
  - "name": A creative name for the color.
  - "hex": The 6-digit hex code (e.g., "#FF0000").
  - "description": A short usage tip.
  ${langInstruction}
  
  Example output format:
  [{"name":"Red","hex":"#FF0000","description":"Bright red"}]
  
  Do not include markdown formatting (like \`\`\`json). Return raw JSON only.`;

  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate a palette of ${count} colors for: "${prompt}"` }
      ],
      temperature: 0.7,
      // Some providers support response_format, but not all. We rely on system prompt for JSON.
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API Error (${response.status}): ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  
  if (!content) throw new Error("Empty response from AI provider");

  // Cleanup potential markdown code blocks if the model ignores the "raw JSON" instruction
  const cleanJson = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  
  try {
    return JSON.parse(cleanJson) as ColorItem[];
  } catch (e) {
    console.error("Failed to parse JSON:", content);
    throw new Error("AI returned invalid JSON format");
  }
};

// --- Main Export ---
export const generatePalette = async (prompt: string, language: Language = 'en', count: number = 6): Promise<ColorItem[]> => {
  try {
    const langInstruction = language === 'zh' 
      ? 'Ensure all names and descriptions are in Simplified Chinese (简体中文).' 
      : 'Ensure all names and descriptions are in English.';

    if (CONFIG.provider === 'gemini') {
      return await generateGemini(prompt, langInstruction, count);
    } else {
      return await generateOpenAICompatible(prompt, langInstruction, count);
    }
  } catch (error) {
    console.error(`Error generating palette with ${CONFIG.provider}:`, error);
    throw error;
  }
};