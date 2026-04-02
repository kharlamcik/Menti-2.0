// pages/api/ai/generate-quiz.js
import OpenAI from "openai";

const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Только POST разрешён" });
  }

  try {
    const { topic, numQuestions = 10 } = req.body;

    if (!topic || topic.trim().length < 3) {
      return res.status(400).json({ error: "Тема должна быть не короче 3 символов" });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: "OPENROUTER_API_KEY не найден в .env.local" });
    }

    const prompt = `Ты — профессиональный создатель викторин на русском языке.

Создай викторину по теме "${topic.trim()}". Количество вопросов: ${numQuestions}.

Ответь **только чистым JSON** без markdown, без \`\`\`json, без объяснений.

{
  "subject": "Короткое название темы",
  "questions": [
    {
      "question": "Текст вопроса?",
      "answers": ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4"],
      "solution": 2,
      "time": 20,
      "cooldown": 5
    }
  ]
}`;

    const completion = await openrouter.chat.completions.create({
      model: "google/gemini-2.0-flash-thinking-exp:free",   // бесплатная мощная модель
      // model: "meta-llama/llama-3.3-70b-instruct:free",   // альтернативная бесплатная
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 4000,
    });

    let content = completion.choices[0].message.content.trim();
    content = content.replace(/```json|```/gi, "").trim();

    const quiz = JSON.parse(content);

    return res.status(200).json({ quiz });

  } catch (error) {
    console.error("OpenRouter Error:", error);
    return res.status(500).json({
      error: "Ошибка OpenRouter: " + (error.message || "Неизвестная ошибка")
    });
  }
}