import { GoogleGenAI, Type } from "@google/genai";
import { Category } from "../types";

export interface AISuggestions {
    description: string;
    category: string;
    condition: 'new' | 'used' | 'refurbished';
    specifications: {
        brand: string;
        model: string;
    };
    images: string[];
}

const getAIClient = () => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set. Please configure it to enable AI features.");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY as string });
};

/**
 * Generates structured ad details using Gemini based on a product title.
 */
export const generateAdDetails = async (title: string, categories: Category[]): Promise<Omit<AISuggestions, 'images'>> => {
    const ai = getAIClient();
    const categoryNames = categories.map(c => c.name).join(', ');

    const prompt = `You are an intelligent assistant for the MAZDADY marketplace. Analyze the following product title and generate structured data for it.
    Product Title: "${title}"

    Available Categories: [${categoryNames}]

    Based on the title, provide the following details in a valid JSON format.
    - description: A compelling, one-paragraph product description.
    - category: The most appropriate category from the available list.
    - condition: The likely condition ('new', 'used', 'refurbished'). If it's ambiguous, default to 'used'.
    - specifications: An object containing the 'brand' and 'model' of the product.

    Your response MUST be ONLY the JSON object.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    description: { type: Type.STRING },
                    category: { type: Type.STRING },
                    condition: { type: Type.STRING, enum: ['new', 'used', 'refurbished'] },
                    specifications: {
                        type: Type.OBJECT,
                        properties: {
                            brand: { type: Type.STRING },
                            model: { type: Type.STRING }
                        }
                    }
                }
            },
        },
    });

    const result = JSON.parse(response.text);
    return result as Omit<AISuggestions, 'images'>;
};

/**
 * Generates product images using Imagen based on a product title.
 */
export const generateAdImages = async (title: string): Promise<string[]> => {
    const ai = getAIClient();
    
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `A professional, clean product photograph of a ${title}, on a white background. Realistic style.`,
        config: {
            numberOfImages: 4,
            outputMimeType: 'image/jpeg',
            aspectRatio: '1:1',
        },
    });

    return response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
};