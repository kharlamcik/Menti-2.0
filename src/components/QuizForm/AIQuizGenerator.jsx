"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

const AIQuizGenerator = () => {
  const [topic, setTopic] = useState("");
  const [password, setPassword] = useState("");
  const [numQuestions, setNumQuestions] = useState(10);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [debugInfo, setDebugInfo] = useState("");

  const generateQuiz = async () => {
    if (!topic.trim()) {
      toast.error("Введите тему викторины");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setDebugInfo("");
    setQuiz(null);

    try {
      const response = await fetch("/api/ai/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), numQuestions }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || "Ошибка генерации");
        if (data.debug) setDebugInfo(data.debug);
        return;
      }

      if (!data.quiz || !Array.isArray(data.quiz.questions)) {
        setErrorMsg("AI вернул некорректную викторину");
        setDebugInfo(JSON.stringify(data.quiz, null, 2));
        return;
      }

      const normalizedQuiz = {
        subject: data.quiz.subject || "Без названия",
        questions: data.quiz.questions.map((q) => ({
          question: q.question || "Без текста",
          answers: Array.isArray(q.answers) ? q.answers : [],
          solution: typeof q.solution === "number" ? q.solution : 0,
          time: q.time || 20,
          cooldown: q.cooldown || 5,
        })),
      };

      setQuiz(normalizedQuiz);
      toast.success("Викторина сгенерирована ✨");

    } catch (err) {
      console.error(err);
      toast.error("Ошибка генерации");
    } finally {
      setLoading(false);
    }
  };

  const saveQuiz = async () => {
    if (!quiz) return;

    if (!password.trim()) {
      toast.error("Введите пароль викторины");
      return;
    }

    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: password.trim(),
          subject: quiz.subject,
          questions: quiz.questions
        }),
      });

      if (res.ok) {
        toast.success("Викторина сохранена в базу ✅");
      } else {
        const text = await res.text();
        console.log(text);
        toast.error("Ошибка сохранения");
      }

    } catch (e) {
      console.error(e);
      toast.error("Не удалось сохранить");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">

      <div className="text-center mb-10">
        <div className="text-6xl mb-4">🤖</div>
        <h2 className="text-4xl font-bold text-white mb-3">
          AI Генератор викторин
        </h2>
        <p className="text-gray-300">
          Опишите тему — AI создаст вопросы
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8">

        <div className="space-y-6">

          {/* тема */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Тема
            </label>

            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Например: История Рима"
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white"
            />
          </div>

          {/* пароль */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Пароль викторины
            </label>

            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Например: QUIZ123"
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white"
            />
          </div>

          {/* количество вопросов */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Количество вопросов: {numQuestions}
            </label>

            <input
              type="range"
              min="5"
              max="20"
              value={numQuestions}
              onChange={(e) => setNumQuestions(+e.target.value)}
              className="w-full"
            />
          </div>

          <button
            onClick={generateQuiz}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500"
          >
            {loading ? "Генерация..." : "✨ Сгенерировать викторину"}
          </button>

        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-5 bg-red-900/30 rounded-2xl text-red-300">
          {errorMsg}
          {debugInfo && (
            <pre className="text-xs mt-3">{debugInfo}</pre>
          )}
        </div>
      )}

      {quiz && (
        <div className="space-y-6">

          <div className="flex justify-between items-center">
            <h3 className="text-2xl text-white">
              {quiz.subject}
            </h3>

            <button
              onClick={saveQuiz}
              className="px-6 py-3 bg-emerald-600 rounded-2xl"
            >
              💾 Сохранить
            </button>
          </div>

          <pre className="bg-zinc-950 p-6 rounded-3xl text-gray-300 overflow-auto max-h-[600px]">
            {JSON.stringify(quiz, null, 2)}
          </pre>

        </div>
      )}

    </div>
  );
};

export default AIQuizGenerator;