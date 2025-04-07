import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "@config";

const genAI = new GoogleGenerativeAI(config.API_KEY);
const model = genAI.getGenerativeModel({ model: config.MODEL });

export const generateContent = (prompt: string, systemInstruction?: string) =>
  systemInstruction
    ? model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        systemInstruction: systemInstruction,
      })
    : model.generateContent(prompt);
