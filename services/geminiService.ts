import { GoogleGenAI } from "@google/genai";

export const generateEnquiryDraft = async (
  eventType: string,
  stylePreference: string,
  guestCount: string
): Promise<string> => {
  // Always initialize inside or right before the call to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const prompt = `
      Write a polite, professional, and enthusiastic enquiry email for a photographer.
      Context:
      - Event Type: ${eventType}
      - Style Preference: ${stylePreference}
      - Estimated Guests/Scale: ${guestCount}
      
      Keep it short, under 100 words. Do not include subject lines or placeholders. 
      The tone should be sophisticated and eager to collaborate.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Access .text property directly as per latest SDK guidelines
    return response.text || '';
  } catch (error) {
    console.error("Gemini AI Drafting Error:", error);
    // Graceful fallback for the user
    return `Hi, I am interested in booking a ${eventType} session. We are expecting around ${guestCount} guests and love your ${stylePreference} style. We've seen your portfolio and think your vision aligns perfectly with ours. Looking forward to discussing availability!`;
  }
};