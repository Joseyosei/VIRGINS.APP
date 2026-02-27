import { GoogleGenAI } from "@google/genai";

// Lazy-initialized — avoids crashing tests that import this module without API_KEY set.
let _ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!_ai) {
    if (!process.env.API_KEY) {
      throw new Error('Gemini API key (API_KEY env var) is not configured');
    }
    _ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return _ai;
}

/**
 * Generate a video intro from a profile photo using Veo
 */
export const generateVideoIntro = async (imageBase64: string, name: string) => {
  try {
    // 1. Start generation operation
    let operation = await getAI().models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `A cinematic, wholesome video portrait of ${name}, smiling warmly, looking at the camera, soft natural lighting, high quality.`,
      image: {
        imageBytes: imageBase64,
        mimeType: 'image/png',
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '9:16' // Portrait for mobile app
      }
    });

    // 2. Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
      operation = await getAI().operations.getVideosOperation({ operation: operation });
    }

    // 3. Get download link
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    
    if (!downloadLink) throw new Error("No video URI returned");

    // 4. Fetch the actual video bytes using the API Key (server-side fetch to keep key safe)
    // Note: In a real production app, you might upload this stream directly to S3/Cloud Storage
    // rather than returning raw bytes to the client.
    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const videoBuffer = await videoResponse.arrayBuffer();
    
    // Fix: Access Buffer via globalThis to resolve "Cannot find name 'Buffer'" error
    return (globalThis as any).Buffer.from(videoBuffer).toString('base64');
    
  } catch (error) {
    console.error("Veo Generation Error:", error);
    throw new Error("Failed to generate video");
  }
};