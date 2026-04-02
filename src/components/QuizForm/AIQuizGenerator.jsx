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

  // Генерация случайного пароля (8 символов, верхний регистр + цифры)
  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomPass = "";
    for (let i = 0; i < 8; i++) {
      randomPass += chars[Math.floor(Math.random() * chars.length)];
    }
    setPassword(randomPass);
    toast.info("Случайный пароль сгенерирован ✨");
  };

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

    // Всегда сохраняем в UPPERCASE
    const upperPassword = password.trim().toUpperCase();

    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: upperPassword,
          subject: quiz.subject,
          questions: quiz.questions,
        }),
      });

      if (res.ok) {
        toast.success("Викторина сохранена в базу ✅");
        // Можно очистить пароль после успешного сохранения (по желанию)
        // setPassword("");
      } else {
        let errorMessage = "Ошибка сохранения";

        // Пытаемся получить красивую ошибку от бэкенда
        try {
          const errorData = await res.json();
          if (errorData.error) {
            errorMessage = errorData.error;
            // Специально обрабатываем конфликт пароля
            if (
              errorMessage.toLowerCase().includes("уже существует") ||
              errorMessage.toLowerCase().includes("exists") ||
              res.status === 409
            ) {
              errorMessage = "Пароль уже используется! Выберите другой или сгенерируйте новый ✨";
            }
          }
        } catch {
          // Если json не получился — просто текст
          const text = await res.text();
          if (text) errorMessage = text;
        }

        toast.error(errorMessage);
      }
    } catch (e) {
      console.error(e);
      toast.error("Не удалось сохранить викторину");
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
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder:text-gray-400"
            />
          </div>

          {/* пароль + кнопка рандома */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Пароль викторины
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value.toUpperCase())}
                placeholder="Например: QUIZ123"
                className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder:text-gray-400 font-mono tracking-widest"
                maxLength={12}
              />
              <button
                onClick={generateRandomPassword}
                className="px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-white transition-colors flex items-center justify-center gap-2"
                title="Сгенерировать случайный пароль"
              >
                🎲
              </button>
            </div>
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
              className="w-full accent-indigo-500"
            />
          </div>

          {/* кнопка генерации с красивой анимацией */}
          <button
            onClick={generateQuiz}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-500/70 flex items-center justify-center gap-3 text-lg font-semibold transition-all active:scale-[0.98]"
          >
            {loading ? (
              <>
                {/* Красивый Tailwind-спиннер */}
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Генерируем вопросы...</span>
                <span className="text-indigo-200 text-sm font-normal animate-pulse">AI думает ✨</span>
              </>
            ) : (
              <>
                ✨ Сгенерировать викторину ✨
              </>
            )}
          </button>

        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-5 bg-red-900/30 rounded-2xl text-red-300 border border-red-500/30">
          {errorMsg}
          {debugInfo && (
            <pre className="text-xs mt-4 bg-black/50 p-4 rounded-xl overflow-auto">{debugInfo}</pre>
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
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-2xl flex items-center gap-2 transition-colors"
            >
              💾 Сохранить в базу
            </button>
          </div>

          <pre className="bg-zinc-950 p-6 rounded-3xl text-gray-300 overflow-auto max-h-[600px] text-sm">
            {JSON.stringify(quiz, null, 2)}
          </pre>

        </div>
      )}

    </div>
  );
};

export default AIQuizGenerator;