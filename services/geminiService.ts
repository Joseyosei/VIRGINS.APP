import { GoogleGenAI, Type } from "@google/genai";
import { BioRequest, GeminiResponse } from '../types';

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProfileBio = async (data: BioRequest): Promise<GeminiResponse> => {
  try {
    const prompt = `
      Create a dating profile bio for a user named ${data.name}.
      
      User Details:
      - Hobbies: ${data.hobbies}
      - Core Values: ${data.values}
      - Looking for: ${data.lookingFor}
      
      Context: This is for an app called "Virgins", exclusively for people with traditional values who are saving sex for marriage.
      
      Requirements:
      1. The tone should be respectful, wholesome, marriage-minded, and elegant.
      2. Emphasize their commitment to waiting for marriage in a confident but humble way.
      3. Avoid slang or casual hookup culture language.
      4. Provide a short piece of dating advice for them as well.
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
        systemInstruction: "You are a professional relationship coach specializing in traditional courtship and marriage-minded dating. You help people articulate their values clearly and respectfully.",
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