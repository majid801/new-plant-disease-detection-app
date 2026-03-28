import { GoogleGenAI, Type } from "@google/genai";
import { DiseaseResult, Language, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function chatWithAI(message: string, history: ChatMessage[], language: Language): Promise<string> {
  const model = "gemini-3-flash-preview";
  
  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction: `You are an expert agricultural assistant. Answer the user's questions about farming, crops, soil, pests, and agricultural techniques in ${language}. Be concise, helpful, and professional. If the user asks something unrelated to agriculture, politely redirect them back to farming topics.`,
    },
  });

  // Convert history to format expected by sendMessage
  // Note: sendMessage doesn't take history directly in this SDK version, 
  // but we can simulate it or just send the message.
  // The SDK usually handles history if we keep the chat object, 
  // but for stateless calls we might need to include context in the prompt.
  
  const response = await chat.sendMessage({ message });
  return response.text || "I'm sorry, I couldn't process that request.";
}

export async function identifyDisease(base64Image: string, language: Language): Promise<DiseaseResult> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze this crop image and identify any diseases. 
    Provide the response in ${language} language.
    If no disease is found, state that the crop appears healthy.
    Return the data in the following JSON format:
    {
      "diseaseName": "Name of the disease",
      "confidence": 0.95,
      "description": "Brief description of the disease",
      "symptoms": ["symptom 1", "symptom 2"],
      "pesticideRecommendations": [
        {
          "name": "Pesticide Name",
          "dosage": "Recommended dosage",
          "instructions": "Application instructions"
        }
      ],
      "preventionTips": ["tip 1", "tip 2"]
    }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(",")[1],
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          diseaseName: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          description: { type: Type.STRING },
          symptoms: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          pesticideRecommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                dosage: { type: Type.STRING },
                instructions: { type: Type.STRING }
              },
              required: ["name", "dosage", "instructions"]
            }
          },
          preventionTips: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["diseaseName", "confidence", "description", "symptoms", "pesticideRecommendations", "preventionTips"]
      }
    },
  });

  return JSON.parse(response.text);
}
