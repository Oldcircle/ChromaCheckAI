import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ColorItem, Language, UserSettings } from "../types";

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

const generateGemini = async (prompt: string, langInstruction: string, count: number, apiKey: string, model: string): Promise<ColorItem[]> => {
  // Fallback to env if no key provided
  const key = apiKey || process.env.API_KEY;
  if (!key) throw new Error("Gemini API Key is missing");

  const genAI = new GoogleGenAI({ apiKey: key });
  const modelName = model || "gemini-2.5-flash";

  const response = await genAI.models.generateContent({
    model: modelName,
    contents: `Generate a cohesive color palette of exactly ${count} colors based on the following theme or description: "${prompt}". 
      Ensure the colors work well together for a UI or graphic design project. 
      ${langInstruction}
      Return strictly JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: geminiSchema,
    },
  });

  const jsonText = response.text;
  if (!jsonText) throw new Error("Empty response from Gemini");
  return JSON.parse(jsonText) as ColorItem[];
};

// --- Generic OpenAI Compatible Implementation ---
// Supports: OpenAI, DeepSeek, Moonshot, Groq, Ollama, SiliconFlow, OpenRouter, etc.
const generateOpenAICompatible = async (prompt: string, langInstruction: string, count: number, settings: UserSettings): Promise<ColorItem[]> => {
  const key = settings.apiKey || process.env.API_KEY;
  
  // Ollama might not strictly require a key, but others do
  if (!key && settings.provider !== 'ollama') {
    throw new Error(`${settings.provider} API Key is missing`);
  }

  // Determine Base URL
  let baseUrl = settings.baseUrl;
  if (!baseUrl) {
    switch (settings.provider) {
      case 'deepseek': baseUrl = 'https://api.deepseek.com'; break;
      case 'moonshot': baseUrl = 'https://api.moonshot.cn/v1'; break;
      case 'openai': baseUrl = 'https://api.openai.com/v1'; break;
      case 'groq': baseUrl = 'https://api.groq.com/openai/v1'; break;
      case 'ollama': baseUrl = 'http://localhost:11434/v1'; break;
      case 'openrouter': baseUrl = 'https://openrouter.ai/api/v1'; break;
      case 'siliconflow': baseUrl = 'https://api.siliconflow.cn/v1'; break;
      default: baseUrl = process.env.API_BASE_URL; // Fallback for custom
    }
  }
  
  if (!baseUrl) throw new Error("Base URL is missing");

  // Ensure Base URL doesn't end with slash to avoid double slash
  baseUrl = baseUrl.replace(/\/$/, '');
  // Some users might forget /v1, add it if not present for standard OpenAI path, 
  // but some custom endpoints might not use it. We'll trust the user/default mostly,
  // but ensure we hit /chat/completions.
  // Standard practice: Base URL usually includes /v1.

  // Determine Model
  const model = settings.model || process.env.API_MODEL || 'gpt-3.5-turbo';

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

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (key) {
    headers['Authorization'] = `Bearer ${key}`;
  }
  
  // OpenRouter specific headers
  if (settings.provider === 'openrouter') {
    headers['HTTP-Referer'] = window.location.href;
    headers['X-Title'] = 'ChromaCheck AI';
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate a palette of ${count} colors for: "${prompt}"` }
      ],
      // Some providers support response_format: { type: "json_object" }, but not all.
      // We rely on prompt engineering for broader compatibility.
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API Error (${settings.provider} - ${response.status}): ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  
  if (!content) throw new Error("Empty response from AI provider");

  const cleanJson = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  
  try {
    return JSON.parse(cleanJson) as ColorItem[];
  } catch (e) {
    console.error("Failed to parse JSON:", content);
    throw new Error(`AI returned invalid JSON format. Raw output: ${content.substring(0, 50)}...`);
  }
};

// --- Main Export ---
export const generatePalette = async (
  prompt: string, 
  language: Language = 'en', 
  count: number = 6,
  settings: UserSettings
): Promise<ColorItem[]> => {
  try {
    const langInstruction = language === 'zh' 
      ? 'Ensure all names and descriptions are in Simplified Chinese (简体中文).' 
      : 'Ensure all names and descriptions are in English.';

    if (settings.provider === 'gemini') {
      return await generateGemini(prompt, langInstruction, count, settings.apiKey, settings.model);
    } else {
      return await generateOpenAICompatible(prompt, langInstruction, count, settings);
    }
  } catch (error) {
    console.error(`Error generating palette with ${settings.provider}:`, error);
    throw error;
  }
};
