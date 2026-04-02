"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

const AIQuizGenerator = () => {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(10);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [debugInfo, setDebugInfo] = useState(""); // для отладки

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
        setErrorMsg(data.error || "Неизвестная ошибка");
        if (data.debug) setDebugInfo(data.debug);
        throw new Error(data.error);
      }

      setQuiz(data.quiz);
      toast.success("Викторина успешно сгенерирована! ✨");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Не удалось сгенерировать");
    } finally {
      setLoading(false);
    }
  };

  const saveQuiz = async () => {
    if (!quiz) return;

    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quiz),
      });

      if (res.ok) {
        toast.success("Викторина сохранена в базу! ✅");
      } else {
        toast.error("Ошибка сохранения в БД");
      }
    } catch (e) {
      toast.error("Не удалось сохранить");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">🤖</div>
        <h2 className="text-4xl font-bold text-white mb-3">AI Генератор викторин</h2>
        <p className="text-gray-300">Опишите тему — ИИ создаст готовый опрос</p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Тема</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Например: Столицы мира, Основы Python, История Древнего Египта"
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Количество вопросов: <span className="text-white font-medium">{numQuestions}</span>
            </label>
            <input
              type="range"
              min="5"
              max="20"
              value={numQuestions}
              onChange={(e) => setNumQuestions(+e.target.value)}
              className="w-full accent-indigo-500"
            />
          </div>

          <button
            onClick={generateQuiz}
            disabled={loading || !topic.trim()}
            className="w-full py-4 rounded-2xl font-semibold text-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-60 transition"
          >
            {loading ? "🤖 Генерируем..." : "✨ Сгенерировать викторину"}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-5 bg-red-900/30 border border-red-500/50 rounded-2xl text-red-300">
          {errorMsg}
          {debugInfo && (
            <details className="mt-3 text-xs">
              <summary>Отладочная информация</summary>
              <pre className="mt-2 overflow-auto">{debugInfo}</pre>
            </details>
          )}
        </div>
      )}

      {quiz && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-white">Готовая викторина: {quiz.subject}</h3>
            <button
              onClick={saveQuiz}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-medium transition"
            >
              💾 Сохранить в базу
            </button>
          </div>

          <pre className="bg-zinc-950 border border-white/10 rounded-3xl p-6 text-sm text-gray-300 overflow-auto max-h-[600px]">
            {JSON.stringify(quiz, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AIQuizGenerator;