"use client"
import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import TypingText from "./components/TypingText"
import GenerateButton from "./components/GenerateButton"

const AIQuizGenerator = () => {
  const [topic, setTopic] = useState("")
  const [password, setPassword] = useState("")
  const [numQuestions, setNumQuestions] = useState(10)
  const [loading, setLoading] = useState(false)
  const [quiz, setQuiz] = useState(null)
  const [errorMsg, setErrorMsg] = useState("")
  const [debugInfo, setDebugInfo] = useState("")

  // Для undo
  const [lastDeleted, setLastDeleted] = useState(null) // {index, question}
  const [undoRemaining, setUndoRemaining] = useState(0) // секунды до авто-удаления

  // ====================== ОСНОВНЫЕ ФУНКЦИИ ======================
  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let randomPass = ""
    for (let i = 0; i < 8; i++) {
      randomPass += chars[Math.floor(Math.random() * chars.length)]
    }
    setPassword(randomPass)
    toast.info("Случайный пароль сгенерирован ✨")
  }

  const generateQuiz = async () => {
    if (!topic.trim()) {
      toast.error("Введите тему викторины")
      return
    }
    setLoading(true)
    setErrorMsg("")
    setDebugInfo("")
    setQuiz(null)

    try {
      const response = await fetch("/api/ai/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), numQuestions }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorMsg(data.error || "Ошибка генерации")
        if (data.debug) setDebugInfo(data.debug)
        return
      }

      if (!data.quiz || !Array.isArray(data.quiz.questions)) {
        setErrorMsg("AI вернул некорректную викторину")
        setDebugInfo(JSON.stringify(data.quiz, null, 2))
        return
      }

      const normalizedQuiz = {
        subject: data.quiz.subject || "Без названия",
        questions: data.quiz.questions.map((q) => ({
          question: q.question || "Без текста",
          answers: Array.isArray(q.answers) ? q.answers : ["", "", "", ""],
          solution: typeof q.solution === "number" ? q.solution : 0,
          time: q.time || 20,
          cooldown: q.cooldown || 5,
        })),
      }

      setQuiz(normalizedQuiz)
      toast.success("Викторина сгенерирована ✨")
    } catch (err) {
      console.error(err)
      toast.error("Ошибка генерации")
    } finally {
      setLoading(false)
    }
  }

  const saveQuiz = async () => {
    if (!quiz) return
    if (!password.trim()) {
      toast.error("Введите пароль викторины")
      return
    }

    const upperPassword = password.trim().toUpperCase()

    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: upperPassword,
          subject: quiz.subject,
          questions: quiz.questions,
        }),
      })

      if (res.ok) {
        toast.success("Викторина сохранена в базу ✅")
      } else {
        const errorData = await res.json().catch(() => ({}))
        let errorMessage = errorData.error || "Ошибка сохранения"
        if (
          errorMessage.toLowerCase().includes("уже существует") ||
          errorMessage.toLowerCase().includes("exists") ||
          res.status === 409
        ) {
          errorMessage =
            "Пароль уже используется! Выберите другой или сгенерируйте новый ✨"
        }
        toast.error(errorMessage)
      }
    } catch (e) {
      console.error(e)
      toast.error("Не удалось сохранить викторину")
    }
  }

  // ====================== РЕДАКТИРОВАНИЕ ======================
  const updateQuestion = (qIndex, field, value) => {
    setQuiz((prev) =>
      prev
        ? {
            ...prev,
            questions: prev.questions.map((q, i) =>
              i === qIndex ? { ...q, [field]: value } : q,
            ),
          }
        : prev,
    )
  }

  const updateAnswer = (qIndex, aIndex, value) => {
    setQuiz((prev) =>
      prev
        ? {
            ...prev,
            questions: prev.questions.map((q, i) => {
              if (i !== qIndex) return q
              const newAnswers = [...q.answers]
              newAnswers[aIndex] = value
              return { ...q, answers: newAnswers }
            }),
          }
        : prev,
    )
  }

  const setCorrectAnswer = (qIndex, solutionIndex) => {
    setQuiz((prev) =>
      prev
        ? {
            ...prev,
            questions: prev.questions.map((q, i) =>
              i === qIndex ? { ...q, solution: solutionIndex } : q,
            ),
          }
        : prev,
    )
  }

  const addNewQuestion = () => {
    setQuiz((prev) =>
      prev
        ? {
            ...prev,
            questions: [
              ...prev.questions,
              {
                question: "Новый вопрос",
                answers: ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
                solution: 0,
                time: 20,
                cooldown: 5,
              },
            ],
          }
        : prev,
    )
  }

  // ====================== УДАЛЕНИЕ + UNDO С ТАЙМЕРОМ ======================
  const deleteQuestion = (qIndex) => {
    if (!quiz || quiz.questions.length <= 1) {
      toast.error("Викторина должна содержать хотя бы 1 вопрос")
      return
    }

    const deletedQuestion = quiz.questions[qIndex]

    // Сохраняем удалённый вопрос
    setLastDeleted({
      index: qIndex,
      question: deletedQuestion,
    })

    // Запускаем таймер на 10 секунд
    setUndoRemaining(10)

    // Удаляем вопрос сразу
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== qIndex),
    }))

    toast.info(`❌ Вопрос ${qIndex + 1} удалён`, { autoClose: 4000 })
  }

  const undoDelete = () => {
    if (!lastDeleted || !quiz) return

    const { index, question } = lastDeleted

    setQuiz((prev) => {
      if (!prev) return prev
      const newQuestions = [...prev.questions]
      newQuestions.splice(index, 0, question)
      return { ...prev, questions: newQuestions }
    })

    // Сбрасываем таймер
    setUndoRemaining(0)
    setLastDeleted(null)

    toast.success("✅ Вопрос восстановлен ✨")
  }

  // ====================== ТАЙМЕР ОБРАТНОГО ОТСЧЁТА ======================
  useEffect(() => {
    if (undoRemaining <= 0) return

    const interval = setInterval(() => {
      setUndoRemaining((prev) => {
        if (prev <= 1) {
          setLastDeleted(null) // авто-очистка
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [undoRemaining])

  // ====================== RENDER ======================
  return (
    <div className="mx-auto max-w-4xl">
      {/* Шапка и форма генерации — без изменений */}
      <div className="mb-10 text-center">
        <div className="mb-4 text-6xl">🤖</div>
        <h2 className="mb-3 text-4xl font-bold text-white">
          AI Генератор викторин
        </h2>
        <TypingText
          text="Опишите тему — AI создаст вопросы"
          speed={45}
          className="text-2xl text-gray-300"
        />
      </div>

      <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm text-gray-400">Тема</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Например: История Рима"
              className="w-full rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-white placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">
              Пароль викторины
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value.toUpperCase())}
                placeholder="Например: QUIZ123"
                className="flex-1 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 font-mono tracking-widest text-white placeholder:text-gray-400"
                maxLength={12}
              />
              <button
                onClick={generateRandomPassword}
                className="rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-white transition-colors hover:bg-white/20"
                title="Сгенерировать случайный пароль"
              >
                🎲
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">
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

          <GenerateButton
            onClick={generateQuiz}
            loading={loading}
            text="Сгенерировать викторину"
            loadingText="Генерируем вопросы..."
            color="bg-gradient-to-r from-indigo-600 to-violet-600"
            hoverColor="from-purple-600 to-fuchsia-600"
          />
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-900/30 p-5 text-red-300">
          {errorMsg}
          {debugInfo && (
            <pre className="mt-4 overflow-auto rounded-xl bg-black/50 p-4 text-xs">
              {debugInfo}
            </pre>
          )}
        </div>
      )}

      {/* ====================== РЕДАКТИРУЕМАЯ ВИКТОРИНА ====================== */}
      {quiz && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={quiz.subject}
              onChange={(e) =>
                setQuiz((prev) =>
                  prev ? { ...prev, subject: e.target.value } : prev,
                )
              }
              className="w-2/3 border-b border-white/30 bg-transparent px-2 py-1 text-3xl font-bold text-white outline-none focus:border-white/60"
            />
            <button
              onClick={saveQuiz}
              className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 transition-colors hover:bg-emerald-500"
            >
              💾 Сохранить в базу
            </button>
          </div>

          {quiz.questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-indigo-600 font-bold text-white">
                    {qIndex + 1}
                  </span>
                </div>
                <button
                  onClick={() => deleteQuestion(qIndex)}
                  className="rounded-2xl px-4 py-2 text-red-400 transition-all hover:bg-red-500/10 hover:text-red-500 active:scale-95"
                >
                  🗑 Удалить
                </button>
              </div>

              <textarea
                value={q.question}
                onChange={(e) =>
                  updateQuestion(qIndex, "question", e.target.value)
                }
                className="mb-6 min-h-[100px] w-full resize-y rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-white"
                placeholder="Текст вопроса..."
              />

              <div className="mb-8 space-y-4">
                {q.answers.map((answer, aIndex) => {
                  const isCorrect = q.solution === aIndex
                  return (
                    <div
                      key={aIndex}
                      className={`flex items-center gap-4 rounded-2xl border p-5 transition-all ${
                        isCorrect
                          ? "border-emerald-400 bg-emerald-500/15 shadow-inner"
                          : "border-white/20 bg-white/10 hover:border-white/40"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl font-mono font-bold transition-colors ${
                          isCorrect
                            ? "bg-emerald-400 text-white"
                            : "bg-white/10 text-gray-400"
                        }`}
                      >
                        {String.fromCharCode(65 + aIndex)}
                      </div>

                      <input
                        type="text"
                        value={answer}
                        onChange={(e) =>
                          updateAnswer(qIndex, aIndex, e.target.value)
                        }
                        className={`flex-1 bg-transparent text-lg outline-none transition-colors ${
                          isCorrect ? "text-emerald-300" : "text-white"
                        }`}
                        placeholder={`Вариант ${String.fromCharCode(65 + aIndex)}`}
                      />

                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={isCorrect}
                        onChange={() => setCorrectAnswer(qIndex, aIndex)}
                        className="h-5 w-5 cursor-pointer accent-emerald-500"
                      />

                      {isCorrect && (
                        <span className="text-3xl leading-none text-emerald-400">
                          ✓
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-sm text-gray-400">
                    Время на ответ (сек)
                  </label>
                  <input
                    type="number"
                    value={q.time}
                    onChange={(e) =>
                      updateQuestion(
                        qIndex,
                        "time",
                        parseInt(e.target.value) || 20,
                      )
                    }
                    className="w-full rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-white"
                    min="5"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-gray-400">
                    Пауза после ответа (сек)
                  </label>
                  <input
                    type="number"
                    value={q.cooldown}
                    onChange={(e) =>
                      updateQuestion(
                        qIndex,
                        "cooldown",
                        parseInt(e.target.value) || 5,
                      )
                    }
                    className="w-full rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-white"
                    min="3"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addNewQuestion}
            className="flex w-full items-center justify-center gap-3 rounded-3xl border border-dashed border-white/30 py-5 font-medium text-white transition-colors hover:border-white/60"
          >
            ➕ Добавить ещё вопрос
          </button>
        </div>
      )}

      {/* ====================== УЛУЧШЕННЫЙ UNDO БАННЕР С ТАЙМЕРОМ ====================== */}
      {lastDeleted && undoRemaining > 0 && (
        <div className="animate-in slide-in-from-bottom-4 fixed bottom-8 right-8 z-50 flex max-w-md items-center gap-6 rounded-3xl border border-emerald-400/30 bg-zinc-900/95 px-6 py-5 text-white shadow-2xl backdrop-blur-2xl duration-300">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="text-2xl">❌</span>
              <div>
                <p className="text-lg font-semibold">
                  Вопрос {lastDeleted.index + 1} удалён
                </p>
                <p className="mt-0.5 line-clamp-2 text-sm text-gray-400">
                  {lastDeleted.question.question}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={undoDelete}
            className="flex flex-shrink-0 items-center gap-3 rounded-2xl bg-emerald-500 px-7 py-4 font-semibold text-white shadow-inner transition-all hover:bg-emerald-400 active:scale-95"
          >
            ↩️ Отменить
            <span className="rounded-xl bg-white/20 px-3 py-1 font-mono text-xl tabular-nums">
              {undoRemaining}
            </span>
          </button>
        </div>
      )}
    </div>
  )
}

export default AIQuizGenerator
