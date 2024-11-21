import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export async function strict_output(
  prompt: string,
  format: object
): Promise<object> {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            text: `
              ${prompt}
              ${JSON.stringify(format)}
            `,
          },
        ],
      },
    ],
  });

  try {
    const result = await chatSession.sendMessage(prompt + format);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("Failed to generate course content:", error);
    throw new Error("Failed to generate course content");
  }
}
