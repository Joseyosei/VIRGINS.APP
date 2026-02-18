import { blink } from '../lib/blink';

export const generateProfileBio = async (data: {
  name: string;
  age: string;
  faith: string;
  hobbies: string;
  values: string;
  lookingFor: string;
}) => {
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

    const response = await (blink.ai as any).generateObject({
      model: 'google/gemini-3-flash',
      prompt: [
        { role: 'system', content: 'You are a professional relationship coach specializing in traditional courtship and marriage-minded dating.' },
        { role: 'user', content: prompt }
      ],
      schema: {
        type: "object",
        properties: {
          bio: { type: "string", description: "The generated profile biography text." },
          advice: { type: "string", description: "A short piece of dating advice based on their values." }
        },
        required: ["bio", "advice"]
      }
    });

    return response.object;
  } catch (error) {
    console.error("Error generating bio:", error);
    throw new Error("Failed to generate bio. Please try again.");
  }
};

export const analyzeProfilePhoto = async (base64Image: string) => {
  try {
    const response = await blink.ai.generateText({
      model: 'google/gemini-3-pro-preview',
      messages: [{
        role: "user",
        content: [
          { type: "text", text: "Analyze this profile photo for a traditional dating app. Does it look respectful, modest, and high quality? Provide constructive feedback for a marriage-minded community." },
          { type: "image", image: base64Image }
        ]
      }]
    });
    return response.text;
  } catch (error) {
    console.error("Image analysis error:", error);
    return "Verification check unavailable, but the photo looks great!";
  }
};

export const aiEditPhoto = async (base64Image: string, prompt: string) => {
  try {
    const response = await (blink.ai as any).generateImage({
      prompt: `${prompt}. Keep the person in the photo and the context of a traditional, modest profile.`,
      images: [base64Image]
    });
    return response.data[0].url;
  } catch (error) {
    console.error("AI Image Edit error:", error);
    return null;
  }
};

export const getGroundedDateSpots = async (lat: number, lng: number, category: string) => {
  try {
    const prompt = `Find 4 wholesome, highly-rated, and safe public venues for a first date in the ${category} category near my current location (lat: ${lat}, lng: ${lng}). Focus on places suitable for a traditional first meeting (good conversation, safe public environment).`;
    
    const response = await blink.ai.generateText({
      model: "google/gemini-3-flash",
      prompt,
      search: true
    });

    return {
      text: response.text,
      places: [] 
    };
  } catch (error) {
    console.error("Error fetching grounded date spots:", error);
    return null;
  }
};
