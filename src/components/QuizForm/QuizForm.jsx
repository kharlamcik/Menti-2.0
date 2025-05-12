import React, { useState } from "react"
import styles from "./QuizForm.module.css"
import Button from "@/components/Button"

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
          setIsQuizExist(true) // Устанавливаем флаг, что викторина существует
          setMessage("Викторина загружена, добавьте новые вопросы.")
        }
      } else {
        setMessage("Викторина не найдена, создаем новую.")
        setIsQuizExist(false) // Устанавливаем флаг, что викторина не найдена
      }
    } catch (error) {
      console.error("Ошибка подключения:", error)
      setMessage("Произошла ошибка при подключении.")
    } finally {
      setLoading(false)
    }
  }

  // Функция для добавления нового вопроса в состояние
  const handleAddQuestion = () => {
    if (editIndex === null) {
      // Добавляем новый вопрос
      setQuiz({
        ...quiz,
        questions: [...quiz.questions, currentQuestion],
      })
    } else {
      // Обновляем редактируемый вопрос
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
        alert("Викторина успешно сохранена!")
      } else {
        alert("Ошибка при сохранении викторины.")
      }
    } catch (error) {
      alert("Произошла ошибка при отправке данных.")
    }
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="mx-auto max-w-3xl rounded bg-white p-8 shadow-md"
    >
      <h2 className="mb-6 text-center text-2xl font-bold">
        Создание викторины
      </h2>

      <div className="mb-4">
        <Button
          type="button"
          onClick={handleConnect}
          className="mb-4 w-full rounded bg-blue-500 px-4 py-2 text-white"
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
          className="mt-1 w-full rounded border px-4 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Тема:</label>
        <input
          type="text"
          value={quiz.subject}
          onChange={(e) => setQuiz({ ...quiz, subject: e.target.value })}
          required
          className="mt-1 w-full rounded border px-4 py-2"
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
          className="mt-1 w-full rounded border px-4 py-2"
        />
      </div>

      {currentQuestion.answers.map((answer, index) => (
        <div className="mb-4" key={index}>
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
            className="mt-1 w-full rounded border px-4 py-2"
          />
        </div>
      ))}

      <div className="mb-4">
        <label className="mb-2 block text-gray-700">Правильный ответ:</label>
        <div className="flex flex-col space-y-2">
          {currentQuestion.answers.map((answer, index) => (
            <label
              key={index}
              className={`mb-2 flex items-center ${
                currentQuestion.solution === index
                  ? "border-green-500 bg-green-100"
                  : "border-red-500 bg-red-100"
              } rounded p-2`} // Добавлен класс для подсветки
            >
              <input
                type="radio"
                name="correctAnswer"
                value={index}
                checked={currentQuestion.solution === index}
                onChange={() =>
                  setCurrentQuestion({ ...currentQuestion, solution: index })
                }
                className="mr-2 w-5"
              />
              <span>{answer || `Ответ ${index + 1}`}</span>
            </label>
          ))}
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
          className="mt-1 w-full rounded border px-4 py-2"
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
          className="mt-1 w-full rounded border px-4 py-2"
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
          className="mt-1 w-full rounded border px-4 py-2"
        />
      </div>

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
        <h3>Добавленные вопросы:</h3>
        {quiz.questions.length === 0 && <p>Пока нет ни одного вопроса.</p>}
        {quiz.questions.map((q, index) => (
          <div key={index} className={styles.questionCard}>
            <h4>Вопрос {index + 1}:</h4>
            <p>{q.question}</p>
            <ul>
              {q.answers.map((ans, i) => (
                <li key={i}>
                  {i + 1}. {ans}
                </li>
              ))}
            </ul>
            <p>Правильный ответ: {q.answers[q.solution]}</p>
            {q.image && (
              <div>
                <p>Изображение:</p>
                <img
                  src={q.image}
                  alt="Image"
                  className="h-32 w-64 object-cover"
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
    </form>
  )
}

export default QuizForm
