import React, { useEffect, useState } from "react"
import styles from "./QuizForm.module.css"
import Button from "@/components/Button"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { toast } from "react-toastify"

const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Загрузка викторин с сервера
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

  if (loading) return <p>Загрузка викторин...</p>
  if (error) return <p style={{ color: "red" }}>{error}</p>
  if (quizzes.length === 0) return <p>Викторины не найдены.</p>

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text- mb-6 text-3xl font-bold">Все викторины</h1>
      <div className={styles.questionCard}>
        {quizzes.map((quiz) => (
          <div
            key={quiz.password}
            className="mt-2 cursor-pointer rounded border p-4 shadow transition hover:shadow-lg"
            onClick={() => {
              navigator.clipboard
                .writeText(quiz.password)
                .then(() => {
                  toast.success(`Пароль "${quiz.password}" скопирован в буфер`)
                })
                .catch(() => {
                  toast.error("Не удалось скопировать пароль")
                })
            }}
          >
            <h2 className="text-xl font-semibold">{quiz.subject}</h2>
            <p>Вопросов: {quiz.questions?.length ?? 0}</p>
            <p className="text-sm text-gray-500">Пароль: {quiz.password}</p>
          </div>
        ))}
      </div>

      {/* ВАЖНО: это для отображения уведомлений */}
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  )
}

export default QuizListPage
