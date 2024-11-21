"use client";

import React, { useState } from "react";

// Import the GoogleGenerativeAI SDK
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
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

const TestOutputPage = () => {
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    setLoading(true);
    setResult(null);

    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [{ text: "Describe an object with name and age." }],
          },
          {
            role: "model",
            parts: [{ text: '```json\n{"name": "John", "age": 30}\n```' }],
          },
        ],
      });

      const response = await chatSession.sendMessage(userInput);
      setResult(response.response.text());
    } catch (error: any) {
      console.error("Error:", error);
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test Gemini Output</h1>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Input Prompt</label>
        <textarea
          className="w-full p-2 border rounded"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          rows={4}
        />
      </div>
      <button
        onClick={handleSendMessage}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Send Message"}
      </button>

      {result && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Result</h2>
          <pre className="p-4 bg-gray-100 border rounded overflow-x-auto">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestOutputPage;
