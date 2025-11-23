import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ColorItem, Language } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

const paletteSchema: Schema = {
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

export const generatePalette = async (prompt: string, language: Language = 'en'): Promise<ColorItem[]> => {
  try {
    const langInstruction = language === 'zh' 
      ? 'Ensure all names and descriptions are in Simplified Chinese (简体中文).' 
      : 'Ensure all names and descriptions are in English.';

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a cohesive color palette of 6 colors based on the following theme or description: "${prompt}". 
      Ensure the colors work well together for a UI or graphic design project. 
      ${langInstruction}
      Return strictly JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: paletteSchema,
        temperature: 0.7, 
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Empty response from Gemini");
    }

    return JSON.parse(jsonText) as ColorItem[];
  } catch (error) {
    console.error("Error generating palette:", error);
    throw error;
  }
};
