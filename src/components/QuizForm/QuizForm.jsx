import React, { useState } from "react"
import styles from "./QuizForm.module.css"
import Button from "@/components/Button"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { toast } from "react-toastify"

const QuizForm = () => {
  const [quiz, setQuiz] = useState({
    password: "",
    subject: "",
    questions: [],
  })
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    answers: ["", "", "", ""],
    solution: 0,
    cooldown: 5,
    time: 15,
    image: "",
  })
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [isQuizExist, setIsQuizExist] = useState(false) // Флаг для проверки, существует ли викторина
  const [editIndex, setEditIndex] = useState(null) // Индекс редактируемого вопроса

  // Функция для подключения и поиска викторины по паролю
  const handleConnect = async () => {
    setLoading(true)
    setMessage("")

    try {
      // Запрашиваем викторину по паролю
      const response = await fetch(`/api/quizzes?password=${quiz.password}`)
      const data = await response.json()

      if (response.ok) {
        if (data.questions) {
          // Если викторина найдена, загружаем вопросы и тему
          setQuiz({
            ...quiz,
            questions: data.questions,
            subject: data.subject, // Устанавливаем тему из базы данных
          })
          setIsQuizExist(true)
          toast.success("Викторина найдена. Добавьте новые вопросы.")
          // Устанавливаем флаг, что викторина существует
          setMessage("Викторина загружена, добавьте новые вопросы.")
        }
      } else {
        setMessage("Викторина не найдена, создаем новую.")
        setIsQuizExist(false)
        toast.info("Викторина не найдена. Будет создана новая.")
        // Устанавливаем флаг, что викторина не найдена
      }
    } catch (error) {
      console.error("Ошибка подключения:", error)
      toast.error("Ошибка при подключении к викторине")

      setMessage("Произошла ошибка при подключении.")
    } finally {
      setLoading(false)
    }
  }

  // Функция для добавления нового вопроса в состояние
  const handleAddQuestion = () => {
    if (editIndex === null) {
      toast.success("Вопрос добавлен!")
      setQuiz({
        ...quiz,
        questions: [...quiz.questions, currentQuestion],
      })
    } else {
      toast.info(`Вопрос №${editIndex + 1} обновлён`)
      const updatedQuestions = [...quiz.questions]
      updatedQuestions[editIndex] = currentQuestion // Обновляем редактируемый вопрос
      setQuiz({
        ...quiz,
        questions: updatedQuestions,
      })
    }
    // После добавления вопроса очищаем форму и сбрасываем индекс редактирования
    setCurrentQuestion({
      question: "",
      answers: ["", "", "", ""],
      solution: 0,
      cooldown: 5,
      time: 15,
      image: "", // Очищаем поле для изображения
    })
    setEditIndex(null) // Сбрасываем индекс редактируемого вопроса
  }

  // Функция для редактирования вопроса
  const handleEditQuestion = (index) => {
    setCurrentQuestion(quiz.questions[index]) // Загружаем вопрос для редактирования
    setEditIndex(index) // Устанавливаем индекс редактируемого вопроса
  }

  // Функция для удаления вопроса
  const handleDeleteQuestion = (index) => {
    toast.warn(`Вопрос №${index + 1} удалён`)
    const updatedQuestions = quiz.questions.filter((_, i) => i !== index)
    setQuiz({
      ...quiz,
      questions: updatedQuestions,
    })
  }

  // Функция для сохранения викторины в БД
  const handleSaveQuizToDatabase = async () => {
    try {
      const response = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quiz),
      })

      if (response.ok) {
        toast.success("Викторина успешно сохранена!")
      } else {
        toast.error("Ошибка при сохранении викторины.")
        alert("Ошибка при сохранении викторины.")
      }
    } catch (error) {
      toast.error("Произошла ошибка при отправке данных.")
      alert("Произошла ошибка при отправке данных.")
    }
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="mx-auto mt-6 max-w-3xl rounded bg-white p-8 shadow-md"
    >
      <h2 className="mb-6 text-center text-2xl font-bold">
        Создание викторины
      </h2>

      <div className="mb-4">
        <Button
          type="button"
          onClick={handleConnect}
          className="mb-4 w-full rounded bg-blue-500 px-4 py-2 text-white "
        >
          Подключиться к викторине
        </Button>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Пароль:</label>
        <input
          type="text"
          value={quiz.password}
          onChange={(e) => setQuiz({ ...quiz, password: e.target.value })}
          required
          className={styles.glowInput}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Тема:</label>
        <input
          type="text"
          value={quiz.subject}
          onChange={(e) => setQuiz({ ...quiz, subject: e.target.value })}
          required
          className={styles.glowInput}
        />
      </div>

      <h3 className="mb-4 text-xl font-semibold">Добавить вопрос</h3>
      <Button
        type="button"
        onClick={handleAddQuestion}
        className="mb-4 w-full rounded bg-green-500 px-4 py-2 text-white"
      >
        {editIndex === null ? "Добавить вопрос" : "Сохранить изменения"}
      </Button>

      <div className="mb-4">
        <label className="block text-gray-700">Вопрос:</label>
        <input
          type="text"
          value={currentQuestion.question}
          onChange={(e) =>
            setCurrentQuestion({ ...currentQuestion, question: e.target.value })
          }
          required
          className={styles.glowInput}
        />
      </div>

      {currentQuestion.answers.map((answer, index) => {
        const isImage = /https?:\/\/.*\.(jpeg|jpg|png|gif|webp)$/i.test(answer)
        return (
          <div className="mb-6" key={index}>
            <label className="block text-gray-700">Ответ {index + 1}:</label>
            <input
              type="text"
              value={answer}
              onChange={(e) => {
                const newAnswers = [...currentQuestion.answers]
                newAnswers[index] = e.target.value
                setCurrentQuestion({ ...currentQuestion, answers: newAnswers })
              }}
              required
              className={styles.glowInput}
            />
            {isImage && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Предпросмотр изображения:
                </p>
                <img
                  src={answer}
                  alt={`Ответ ${index + 1}`}
                  className="mt-1 max-h-40 rounded object-contain shadow-md"
                />
              </div>
            )}
          </div>
        )
      })}

      <div className="mb-4">
        <label className="mb-2 block text-gray-700">Правильный ответ:</label>
        <div className="flex flex-col space-y-2">
          {currentQuestion.answers.map((answer, index) => {
            const isImage = /https?:\/\/.*\.(jpeg|jpg|png|gif|webp)$/i.test(
              answer,
            )
            return (
              <label
                key={index}
                className={`mb-2 flex items-center gap-2 rounded p-2 transition-all duration-300 ${
                  currentQuestion.solution === index
                    ? styles.correctAnswerLabel
                    : styles.incorrectAnswerLabel
                }`}
              >
                <input
                  type="radio"
                  name="correctAnswer"
                  value={index}
                  checked={currentQuestion.solution === index}
                  onChange={() =>
                    setCurrentQuestion({ ...currentQuestion, solution: index })
                  }
                  className={`
      checked:after:animate-ripple relative h-5 w-5 appearance-none rounded-full border-2 border-white
      outline-none transition-all
      duration-300 before:absolute before:inset-0 before:m-auto before:h-2
      before:w-2 before:rounded-full
      before:bg-white before:transition-transform
      before:duration-300 after:absolute after:inset-0

      after:m-auto after:h-5 after:w-5 after:scale-0 after:rounded-full
      after:bg-green-400 after:opacity-50 checked:border-green-500
      checked:bg-green-500 checked:before:scale-100
    `}
                />
                <span className="text-base leading-tight">
                  {isImage
                    ? `Ответ ${index + 1}`
                    : answer || `Ответ ${index + 1}`}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Время на ответ (сек):</label>
        <input
          type="number"
          value={currentQuestion.time}
          onChange={(e) =>
            setCurrentQuestion({
              ...currentQuestion,
              time: parseInt(e.target.value),
            })
          }
          required
          className={styles.glowInput}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Время ожидания (сек):</label>
        <input
          type="number"
          value={currentQuestion.cooldown}
          onChange={(e) =>
            setCurrentQuestion({
              ...currentQuestion,
              cooldown: parseInt(e.target.value),
            })
          }
          required
          className={styles.glowInput}
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700">Ссылка на изображение:</label>
        <input
          type="text"
          value={currentQuestion.image}
          onChange={(e) =>
            setCurrentQuestion({ ...currentQuestion, image: e.target.value })
          }
          className={styles.glowInput}
        />
      </div>

      {currentQuestion.image && (
        <div className="mb-4">
          <p className="mb-2 text-gray-700">Предпросмотр изображения:</p>
          <img
            src={currentQuestion.image}
            alt="Предпросмотр"
            className="max-h-48 rounded object-contain shadow-md"
          />
        </div>
      )}

      {message && <p>{message}</p>}

      {/* Сохранить или создать викторину */}
      <Button
        type="button"
        onClick={handleSaveQuizToDatabase}
        className="mt-4 w-full rounded bg-blue-500 px-4 py-2 text-white"
      >
        Сохранить викторину в БД
      </Button>

      <div className={styles.addedQuestions}>
        <h3 className="mb-4 text-sm font-semibold ">ДОБАВЛЕННЫЕ ВОПРОСЫ:</h3>
        {quiz.questions.length === 0 && <p>Пока нет ни одного вопроса.</p>}
        {quiz.questions.map((q, index) => (
          <div key={index} className={styles.questionCard}>
            <h4>Вопрос {index + 1}:</h4>
            <p>{q.question}</p>
            <div>
              {/* Текстовые ответы (по вертикали) */}
              <ul className="mb-4 flex flex-col gap-2">
                {q.answers.map((ans, i) => {
                  const isImage =
                    /https?:\/\/.*\.(jpeg|jpg|png|gif|webp)$/i.test(ans)
                  if (!isImage) {
                    return (
                      <li key={i}>
                        <strong>{i + 1}.</strong> {ans}
                      </li>
                    )
                  }
                  return null
                })}
              </ul>

              {/* Картинки (по горизонтали) */}
              <div className="flex flex-wrap gap-4">
                {q.answers.map((ans, i) => {
                  const isImage =
                    /https?:\/\/.*\.(jpeg|jpg|png|gif|webp)$/i.test(ans)
                  if (isImage) {
                    return (
                      <div key={i} className="flex flex-col items-center">
                        <img
                          src={ans}
                          alt={`Ответ ${i + 1}`}
                          className="max-h-40 rounded-md object-contain shadow-md"
                        />
                        <span className="mt-2 text-sm font-semibold">
                          Ответ {i + 1}
                        </span>
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            </div>

            <p>
              Правильный ответ:{" "}
              {/https?:\/\/.*\.(jpeg|jpg|png|gif|webp)$/i.test(
                q.answers[q.solution],
              )
                ? `Ответ ${q.solution + 1}`
                : q.answers[q.solution]}
            </p>

            {q.image && (
              <div>
                <p>Изображение:</p>
                <img
                  src={q.image}
                  alt="Image"
                  className="h-32 w-64 rounded object-cover "
                />
              </div>
            )}
            <Button
              type="button"
              onClick={() => handleEditQuestion(index)}
              className="mt-2 rounded bg-yellow-500 px-4 py-1 text-white"
            >
              Редактировать
            </Button>
            <Button
              type="button"
              onClick={() => handleDeleteQuestion(index)}
              className="m-2 rounded bg-red-500 px-4 py-1 text-white"
            >
              Удалить вопрос
            </Button>
          </div>
        ))}
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </form>
  )
}

export default QuizForm
