import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini AI client with API key from environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generate a marriage-minded profile bio
 */
export const generateProfileBio = async (data: any) => {
  try {
    const prompt = `
      Create a dating profile bio for a user named ${data.name}, age ${data.age}.
      User Details:
      - Faith/Denomination: ${data.faith}
      - Hobbies: ${data.hobbies}
      - Core Values: ${data.values}
      - Looking for: ${data.lookingFor}
      
      Context: This is for an app called "Virgins", exclusively for people with traditional values who are saving sex for marriage.
      Requirements: Respectful, wholesome, marriage-minded tone.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bio: { type: Type.STRING },
            advice: { type: Type.STRING }
          },
          required: ["bio", "advice"],
        },
        systemInstruction: "You are a professional relationship coach specializing in traditional courtship.",
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Bio Gen Error:", error);
    throw new Error("Failed to generate bio");
  }
};

/**
 * Edit User Images using Gemini 2.5 Flash Image
 */
export const editUserImage = async (imageBase64: string, prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: 'image/png',
            },
          },
          { text: prompt },
        ],
      },
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
       if (part.inlineData) {
         return `data:image/png;base64,${part.inlineData.data}`;
       }
    }
    return null;
  } catch (error) {
    console.error("AI Image Edit Error:", error);
    throw new Error("Failed to edit image");
  }
};

/**
 * Get Grounded Location Data using Maps Tool
 */
export const getDateIdeas = async (city: string, userInterests: string) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Suggest 3 wholesome, public date spots in ${city} suitable for a first date involving: ${userInterests}.`,
            config: {
                tools: [{ googleMaps: {} }],
            },
        });
        
        // Return raw text which will contain grounded links
        return {
            text: response.text,
            chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
        };
    } catch (error) {
        console.error("Maps Grounding Error:", error);
        throw new Error("Failed to get date ideas");
    }
};