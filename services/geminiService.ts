
import { GoogleGenAI, Type } from "@google/genai";
import { BioRequest, GeminiResponse } from '../types';

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProfileBio = async (data: BioRequest): Promise<GeminiResponse> => {
  try {
    const prompt = `
      Create a dating profile bio for a user named ${data.name}, age ${data.age}.
      
      User Details:
      - Faith/Denomination: ${data.faith}
      - Hobbies: ${data.hobbies}
      - Core Values: ${data.values}
      - Looking for: ${data.lookingFor}
      
      Context: This is for an app called "Virgins", exclusively for people with traditional values who are saving sex for marriage.
      
      Requirements:
      1. The tone should be respectful, wholesome, marriage-minded, and elegant.
      2. Emphasize their commitment to traditional values and waiting for marriage.
      3. If a faith is provided, subtly weave it into the narrative of their life and dating approach.
      4. Avoid slang, casual hookup language, or superficiality.
      5. Provide a short, encouraging piece of relationship advice specific to their situation.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bio: {
              type: Type.STRING,
              description: "The generated profile biography text.",
            },
            advice: {
              type: Type.STRING,
              description: "A short piece of dating advice based on their values.",
            }
          },
          required: ["bio", "advice"],
        },
        systemInstruction: "You are a professional relationship coach specializing in traditional courtship and marriage-minded dating.",
      },
    });

    const jsonStr = response.text;
    if (!jsonStr) {
      throw new Error("Empty response from AI");
    }

    return JSON.parse(jsonStr) as GeminiResponse;

  } catch (error) {
    console.error("Error generating bio:", error);
    throw new Error("Failed to generate bio. Please try again.");
  }
};

/**
 * USES GEMINI 3 PRO PREVIEW
 * Analyzes an image for traditional values, modesty, and quality.
 */
export const analyzeProfilePhoto = async (base64Image: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image.split(',')[1] || base64Image
          }
        },
        {
          text: "Analyze this profile photo for a traditional dating app. Does it look respectful, modest, and high quality? Provide constructive feedback for a marriage-minded community."
        }
      ],
      config: {
        thinkingConfig: { thinkingBudget: 32768 } // Max reasoning for complex image understanding
      }
    });
    return response.text;
  } catch (error) {
    console.error("Image analysis error:", error);
    return "Verification check unavailable, but the photo looks great!";
  }
};

/**
 * USES GEMINI 2.5 FLASH IMAGE
 * Edits an image based on a text prompt.
 */
export const aiEditPhoto = async (base64Image: string, prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image.split(',')[1] || base64Image
          }
        },
        {
          text: prompt
        }
      ]
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/jpeg;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("AI Image Edit error:", error);
    return null;
  }
};

/**
 * Uses Maps Grounding to find real public venues for a date.
 */
export const getGroundedDateSpots = async (lat: number, lng: number, category: string) => {
  try {
    const prompt = `Find 4 wholesome, highly-rated, and safe public venues for a first date in the ${category} category near my current location. Focus on places suitable for a traditional first meeting (good conversation, safe public environment).`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      },
    });

    return {
      text: response.text,
      places: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Error fetching grounded date spots:", error);
    return null;
  }
};
