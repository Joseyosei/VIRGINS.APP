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
/**
 * Generate AI-powered icebreaker conversation starters
 */
export const generateIcebreaker = async (userA: any, userB: any): Promise<string[]> => {
  try {
    const prompt = `
      Generate 3 unique conversation starter suggestions for two people on VIRGINS (a faith-based dating app for people saving sex for marriage).
      
      Person A: ${userA.name}, ${userA.age}, ${userA.faith} - Values: ${(userA.values || []).join(', ')} - Bio: ${userA.bio || 'N/A'}
      Person B: ${userB.name}, ${userB.age}, ${userB.faith} - Values: ${(userB.values || []).join(', ')} - Bio: ${userB.bio || 'N/A'}
      
      Requirements: Wholesome, faith-respectful, marriage-minded. Avoid generic openers. Reference shared interests or complementary traits.
      Return exactly 3 icebreakers, short and conversational.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            icebreakers: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['icebreakers']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{"icebreakers":[]}');
    return parsed.icebreakers.slice(0, 3);
  } catch (error) {
    console.error('Icebreaker Gen Error:', error);
    return [
      "What aspect of your faith journey are you most grateful for right now?",
      "If you could go on one perfect date, what would it look like?",
      "What values matter most to you in a future spouse?"
    ];
  }
};

/**
 * Deep compatibility analysis between two users
 */
export const getMatchInsights = async (userA: any, userB: any): Promise<{
  headline: string;
  score: number;
  strengths: string[];
  watchouts: string[];
}> => {
  try {
    const prompt = `
      Analyze compatibility between two people on a faith-based dating app called VIRGINS.
      
      Person A: ${userA.name}, ${userA.age}, ${userA.faith} (${userA.faithLevel || 'Practicing'}), 
        Intention: ${userA.intention || 'Dating to Marry'}, Lifestyle: ${userA.lifestyle || 'Traditional'},
        Values: ${(userA.values || []).join(', ')}, Denomination: ${userA.denomination || 'Christian'}
      
      Person B: ${userB.name}, ${userB.age}, ${userB.faith} (${userB.faithLevel || 'Practicing'}),
        Intention: ${userB.intention || 'Dating to Marry'}, Lifestyle: ${userB.lifestyle || 'Traditional'},
        Values: ${(userB.values || []).join(', ')}, Denomination: ${userB.denomination || 'Christian'}
      
      Provide a covenant compatibility analysis. Be encouraging but honest. Score 0-100.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            score: { type: Type.NUMBER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            watchouts: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['headline', 'score', 'strengths', 'watchouts']
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error('Match Insights Error:', error);
    throw new Error('Failed to generate match insights');
  }
};

/**
 * Analyze a profile photo and provide improvement feedback
 */
export const getPhotoFeedback = async (photoBase64: string): Promise<{
  score: number;
  positives: string[];
  improvements: string[];
}> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: photoBase64.replace(/^data:image\/[a-z]+;base64,/, ''),
              mimeType: 'image/jpeg'
            }
          },
          {
            text: `Analyze this dating profile photo for VIRGINS — a faith-based, wholesome dating app. 
            Evaluate: lighting, background, expression, attire (modest standards), composition, and authenticity.
            Score out of 10. Be constructive and respectful. Focus on presentation, not personal appearance judgment.`
          }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            positives: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['score', 'positives', 'improvements']
        }
      }
    });

    return JSON.parse(response.text || '{"score":7,"positives":[],"improvements":[]}');
  } catch (error) {
    console.error('Photo Feedback Error:', error);
    throw new Error('Failed to analyze photo');
  }
};
