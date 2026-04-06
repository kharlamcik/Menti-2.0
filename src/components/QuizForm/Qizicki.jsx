import React, { useEffect, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Button from "@/components/Button"
import CustomButton from "./components/CustomButton"
import background from "@/assets/e285661a023fb83c8d7f975980422c22.gif"

const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openQuizId, setOpenQuizId] = useState(null)

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch("/api/list")
        if (!res.ok) throw new Error("Ошибка загрузки викторин")
        const data = await res.json()
        setQuizzes(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchQuizzes()
  }, [])

  const toggleQuiz = (password) => {
    setOpenQuizId(openQuizId === password ? null : password)
  }

  const copyPassword = (password) => {
    navigator.clipboard.writeText(password).then(() => {
      toast.success(`Пароль "${password}" скопирован!`, {
        position: "top-center",
        autoClose: 2000,
      })
    })
  }

  const getQuizStyle = (password) => {
    const hash = password
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const index = hash % 8 // меняй 8 на большее число, если добавишь больше вариантов

    const gradients = [
      "from-indigo-500 via-purple-500 to-violet-600",
      "from-pink-500 via-rose-500 to-orange-500",
      "from-emerald-500 via-teal-500 to-cyan-500",
      "from-amber-500 via-yellow-500 to-orange-500",
      "from-purple-500 via-fuchsia-500 to-pink-500",
      "from-blue-500 via-cyan-500 to-teal-500",
      "from-violet-500 via-purple-500 to-indigo-600",
      "from-rose-500 via-pink-500 to-purple-600",
    ]

    const emojis = ["🎯", "🚀", "🌟", "💡", "🔥", "🧠", "⚡", "🎲"]

    return {
      gradient: gradients[index],
      emoji: emojis[index],
    }
  }

  if (loading)
    return <div className="py-20 text-center text-xl">Загрузка викторин...</div>
  if (error)
    return <div className="py-20 text-center text-red-500">{error}</div>
  if (quizzes.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-2xl text-gray-500">У вас пока нет викторин</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-white">Мои викторины</h1>
        <CustomButton
          onClick={() => (window.location.href = "/create-quiz")}
          color="bg-gradient-to-r from-indigo-600 to-violet-600"
          hoverColor="from-purple-600 to-fuchsia-600"
          textColor="text-white"
          size="md"
        >
          + Создать новую викторину
        </CustomButton>
      </div>

      <div className="space-y-6">
        {quizzes.map((quiz) => {
          const isOpen = openQuizId === quiz.password
          const quizStyle = getQuizStyle(quiz.password)

          return (
            <div
              key={quiz.password}
              className="group relative mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-2xl"
            >
              {/* Анимированная полоска */}
              <div
                className={`absolute left-0 right-0 top-0 bg-gradient-to-r ${quizStyle.gradient} 
              overflow-hidden transition-all duration-500 ease-out
              ${isOpen ? "h-6" : "h-[6px]"}`}
              >
                <div className="animate-shimmer h-full w-[150%] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              </div>

              {/* Основная кликабельная часть */}
              <div
                onClick={() => toggleQuiz(quiz.password)}
                className="flex cursor-pointer items-center justify-between p-8 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-violet-50 group-hover:to-fuchsia-50"
              >
                <div className="flex items-center gap-6">
                  {/* Иконка/номер викторины */}
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${quizStyle.gradient} text-3xl shadow-lg transition-transform group-hover:scale-110`}
                  >
                    {quizStyle.emoji}
                  </div>

                  <div>
                    <h2 className="text-3xl font-semibold text-gray-900 transition-colors group-hover:text-violet-700">
                      {quiz.subject}
                    </h2>
                    <p className="mt-2 text-gray-600">
                      {quiz.questions?.length ?? 0} вопросов • Пароль:{" "}
                      <span className="font-mono font-medium text-indigo-600">
                        {quiz.password}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Анимированная стрелка */}
                <div
                  className={`text-4xl text-gray-300 transition-all duration-300 group-hover:text-violet-400 ${
                    isOpen ? "rotate-180 scale-110 text-violet-500" : ""
                  }`}
                >
                  ▼
                </div>
              </div>

              {/* Раскрывающийся контент */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-out ${
                  isOpen ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="bg-gradient-to-b from-gray-50 to-white px-8 pb-10 pt-2">
                  <h3 className="mb-6 text-xl font-medium text-gray-700">
                    Вопросы викторины:
                  </h3>

                  <div className="space-y-6">
                    {quiz.questions?.map((q, index) => (
                      <div
                        key={index}
                        className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm"
                      >
                        <div className="flex gap-4">
                          <span className="mt-1 shrink-0 text-2xl font-bold text-indigo-500">
                            {index + 1}.
                          </span>
                          <p className="text-[17px] leading-relaxed text-gray-800">
                            {q.question}
                          </p>
                        </div>

                        {q.answers && q.answers.length > 0 && (
                          <div className="mt-6 grid grid-cols-1 gap-4 pl-12 sm:grid-cols-2">
                            {q.answers.map((answer, i) => {
                              const isCorrect = i === q.solution
                              return (
                                <div
                                  key={i}
                                  className={`overflow-hidden break-words rounded-2xl border px-6 py-5 text-base transition-all ${
                                    isCorrect
                                      ? "border-emerald-400 bg-emerald-50 font-medium text-emerald-800"
                                      : "border-gray-200 bg-white hover:border-gray-300"
                                  }`}
                                >
                                  {/^data:image|https?:\/\//.test(answer) ? (
                                    <img
                                      src={answer}
                                      alt={`answer-${i}`}
                                      className="mx-auto max-h-32 object-contain"
                                    />
                                  ) : (
                                    <span>{answer}</span>
                                  )}
                                  
                                </div>
                              )
                            })}
                          </div>
                        )}

                        {(q.time || q.cooldown) && (
                          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 pl-12 text-sm text-gray-600">
                            {q.time && (
                              <span>
                                ⏱ <strong>{q.time}</strong> сек на ответ
                              </span>
                            )}
                            {q.cooldown && (
                              <span>
                                ⏳ Кулдаун: <strong>{q.cooldown}</strong> сек
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Кнопки внизу */}
                  <div className="mt-12 flex gap-4">
                    <CustomButton
                      onClick={() => copyPassword(quiz.password)}
                      color="bg-gradient-to-r from-violet-600 to-indigo-600"
                      hoverColor="from-emerald-600 to-teal-600"
                      size="md"
                      className="flex-1"
                    >
                      📋 Скопировать пароль
                    </CustomButton>

                    <CustomButton
    onClick={() => {
      window.location.href = `/manager?password=${encodeURIComponent(quiz.password)}`;
    }}
    color="bg-gradient-to-r from-indigo-600 to-violet-600"
    hoverColor="from-teal-600 to-emerald-700"
    size="md"
    className="flex-1"
  >
    🚀 Запустить викторину
  </CustomButton>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default QuizListPage
