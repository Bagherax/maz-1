import { GoogleGenAI, Type } from "@google/genai";
import { SupportedLanguage } from "../types";
import { LANGUAGES } from "../data/languages";

/**
 * SIMULATED SECURE BACKEND PROXY
 * This function simulates a backend endpoint (e.g., /api/translate) that would securely handle the API key.
 * The client-side code calls this function, which now calls the real Google Gemini API.
 * This prevents the API_KEY from ever being exposed on the frontend.
 */
async function secureTranslateViaProxy(texts: string[], targetLang: SupportedLanguage): Promise<{ translatedTexts: string[] }> {
  console.log(`[PROXY SIM] Translating ${texts.length} texts to ${targetLang} using Gemini.`);
  
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set. Please configure it to enable translation.");
    // Fallback to pseudo-translation if API key is missing
    const fallbackTexts = texts.map(text => `[${targetLang}] ${text}`);
    return { translatedTexts: fallbackTexts };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  const languageName = LANGUAGES.find(l => l.code === targetLang)?.name || targetLang;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Translate the following JSON array of strings into ${languageName}. Return ONLY a valid JSON array of the translated strings, with the same number of elements and order as the input.
      Input: ${JSON.stringify(texts)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
    });

    const translatedJsonString = response.text;
    const translatedTexts = JSON.parse(translatedJsonString);

    if (Array.isArray(translatedTexts) && translatedTexts.length === texts.length) {
      return { translatedTexts };
    } else {
      console.error("Mismatched translation count or invalid format from Gemini. Falling back to original text.", { expected: texts.length, received: translatedTexts.length });
      return { translatedTexts: texts };
    }
  } catch (error) {
    console.error("Gemini translation API call failed:", error);
    // Fallback to original text on API error
    return { translatedTexts: texts };
  }
}

/**
 * Translates a batch of content by calling a secure backend proxy simulation.
 */
export const translateContent = async (texts: string[], targetLang: SupportedLanguage): Promise<string[]> => {
  if (texts.length === 0 || targetLang === 'en' || !targetLang) {
    return texts;
  }
  
  const nonEmptyTexts = texts.map(text => text || '');

  try {
      const result = await secureTranslateViaProxy(nonEmptyTexts, targetLang);
      return result.translatedTexts;
  } catch (error) {
      console.error("Translation batch failed:", error);
      return texts; // Fallback on failure
  }
};