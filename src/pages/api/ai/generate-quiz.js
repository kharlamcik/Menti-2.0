export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Только POST разрешён" });
  }

  const { topic, numQuestions = 10 } = req.body;

  if (!topic || topic.trim().length < 3) {
    return res.status(400).json({ error: "Тема должна быть не короче 3 символов" });
  }

  const prompt = `
Ты — профессиональный создатель викторин.

Создай викторину по теме "${topic}".
Количество вопросов: ${numQuestions}.

Верни ТОЛЬКО JSON.
Ответ должен начинаться с { и заканчиваться }.

Формат:
{
 "subject": "название темы",
 "questions": [
  {
   "question": "текст",
   "answers": ["a","b","c","d"],
   "solution": 0,
   "time": 20,
   "cooldown": 5
  }
 ]
}
`;

  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: "OPENROUTER_API_KEY не найден" });
    }

    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const completion = await client.chat.completions.create({
      model: "qwen/qwen3.6-plus:free",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    });

    let content = completion.choices?.[0]?.message?.content || "";

    // Очистка лишнего текста
    content = content.trim().replace(/```json|```/gi, "").trim();
    const jsonStart = content.indexOf("{");
    const jsonEnd = content.lastIndexOf("}") + 1;
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      content = content.slice(jsonStart, jsonEnd);
    }

    let quiz;
    try {
      quiz = JSON.parse(content);
    } catch (e) {
      return res.status(500).json({
        error: "Ошибка генерации (невалидный JSON)",
        debug: content,
      });
    }

    return res.status(200).json({ quiz });
  } catch (err) {
    console.error("AI генерация упала:", err);
    return res.status(500).json({ error: "Ошибка генерации", debug: err.message });
  }
}