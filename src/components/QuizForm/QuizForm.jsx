import React, { useRef, useState } from "react"
import Button from "@/components/Button"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import CustomButton from "./components/CustomButton"

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY

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
    time: 30,
    cooldown: 5,
    image: "",
  })

  const [editIndex, setEditIndex] = useState(null)
  const [openQuestionIndex, setOpenQuestionIndex] = useState(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [imageError, setImageError] = useState(false)
  const [answerImageErrors, setAnswerImageErrors] = useState([
    false,
    false,
    false,
    false,
  ])
  const [uploading, setUploading] = useState(false)

  const formRef = useRef(null)
  const questionRefs = useRef([])
  const fileInputRef = useRef(null)

  // ====================== ЗАГРУЗКА НА IMGBB ======================
  const uploadToImgBB = async (file) => {
    if (!IMGBB_API_KEY) {
      toast.error("ImgBB API ключ не настроен в .env.local")
      return null
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("image", file)

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        },
      )

      const data = await res.json()
      if (data.success) {
        toast.success("Изображение успешно загружено!")
        return data.data.url
      } else {
        toast.error("Ошибка загрузки на ImgBB")
        return null
      }
    } catch (err) {
      toast.error("Ошибка соединения с ImgBB")
      return null
    } finally {
      setUploading(false)
    }
  }

  // Загрузка файла с компьютера
  const handleImageUpload = async (
    e,
    isQuestionImage = true,
    answerIndex = null,
  ) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Пожалуйста, выберите изображение")
      return
    }

    const imageUrl = await uploadToImgBB(file)
    if (!imageUrl) return

    if (isQuestionImage) {
      updateCurrentQuestion({ ...currentQuestion, image: imageUrl })
      setImageError(false)
    } else if (answerIndex !== null) {
      const newAnswers = [...currentQuestion.answers]
      newAnswers[answerIndex] = imageUrl
      updateCurrentQuestion({ ...currentQuestion, answers: newAnswers })
      const newErrors = [...answerImageErrors]
      newErrors[answerIndex] = false
      setAnswerImageErrors(newErrors)
    }
  }

  // Проверка ссылки (оставил как было)
  const checkImageUrl = (url, isQuestionImage = true, answerIndex = null) => {
    if (!url) {
      if (isQuestionImage) setImageError(false)
      else if (answerIndex !== null) {
        const newErrors = [...answerImageErrors]
        newErrors[answerIndex] = false
        setAnswerImageErrors(newErrors)
      }
      return
    }

    const img = new Image()
    img.onload = () => {
      if (isQuestionImage) setImageError(false)
      else if (answerIndex !== null) {
        const newErrors = [...answerImageErrors]
        newErrors[answerIndex] = false
        setAnswerImageErrors(newErrors)
      }
    }
    img.onerror = () => {
      if (isQuestionImage) setImageError(true)
      else if (answerIndex !== null) {
        const newErrors = [...answerImageErrors]
        newErrors[answerIndex] = true
        setAnswerImageErrors(newErrors)
      }
    }
    img.src = url
  }

  const checkUnsavedChanges = (callback) => {
    if (hasUnsavedChanges && editIndex !== null) {
      if (
        window.confirm(
          "Есть несохранённые изменения. Сохранить перед переходом?",
        )
      ) {
        handleAddQuestion()
      } else return
    }
    callback()
  }

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const scrollToQuestion = (index) => {
    setTimeout(() => {
      questionRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }, 400)
  }

  const handleConnect = async () => {
    if (!quiz.password.trim()) return toast.error("Введите пароль викторины")
    try {
      const res = await fetch(`/api/quizzes?password=${quiz.password}`)
      const data = await res.json()
      if (res.ok && data.questions) {
        setQuiz({
          password: quiz.password,
          subject: data.subject || quiz.subject,
          questions: data.questions,
        })
        toast.success("Викторина загружена!")
      } else {
        toast.info("Создаём новую викторину")
      }
    } catch (e) {
      toast.error("Ошибка подключения")
    }
  }

  const handleAddQuestion = () => {
    if (!currentQuestion.question.trim())
      return toast.error("Введите текст вопроса")

    if (editIndex === null) {
      setQuiz({
        ...quiz,
        questions: [...quiz.questions, { ...currentQuestion }],
      })
      toast.success("Вопрос добавлен!")
    } else {
      const updated = [...quiz.questions]
      updated[editIndex] = { ...currentQuestion }
      setQuiz({ ...quiz, questions: updated })
      toast.success(`Вопрос №${editIndex + 1} обновлён`)
    }

    setCurrentQuestion({
      question: "",
      answers: ["", "", "", ""],
      solution: 0,
      time: 90,
      cooldown: 5,
      image: "",
    })
    setEditIndex(null)
    setHasUnsavedChanges(false)
    setImageError(false)
    setAnswerImageErrors([false, false, false, false])

    scrollToQuestion(editIndex !== null ? editIndex : quiz.questions.length)
  }

  const handleEditQuestion = (index) => {
    checkUnsavedChanges(() => {
      setCurrentQuestion(quiz.questions[index])
      setEditIndex(index)
      setOpenQuestionIndex(index)
      setHasUnsavedChanges(false)
      setImageError(false)
      setAnswerImageErrors([false, false, false, false])
      setTimeout(scrollToForm, 100)
    })
  }

  const handleDeleteQuestion = (index) => {
    checkUnsavedChanges(() => {
      const updated = quiz.questions.filter((_, i) => i !== index)
      setQuiz({ ...quiz, questions: updated })
      toast.warn(`Вопрос №${index + 1} удалён`)
      if (openQuestionIndex === index) setOpenQuestionIndex(null)
      if (editIndex === index) setEditIndex(null)
    })
  }

  const toggleQuestion = (index) => {
    checkUnsavedChanges(() => {
      setOpenQuestionIndex(openQuestionIndex === index ? null : index)
    })
  }

  const updateCurrentQuestion = (newData) => {
    setCurrentQuestion(newData)
    setHasUnsavedChanges(true)
  }

  const saveQuiz = async () => {
    if (!quiz.password || !quiz.subject)
      return toast.error("Заполните пароль и тему")
    if (quiz.questions.length === 0)
      return toast.error("Добавьте хотя бы один вопрос")

    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quiz),
      })
      if (res.ok) toast.success("Викторина успешно сохранена!")
      else toast.error("Ошибка при сохранении")
    } catch (err) {
      toast.error("Ошибка соединения")
    }
  }

  // ====================== Блок с вопросами ======================
  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-10 text-center text-4xl font-bold text-white">
        Создание викторины
      </h1>

      {/* Пароль */}
      <div className="mb-10 rounded-3xl bg-white p-8 shadow-md">
        <h2 className="mb-5 text-2xl font-semibold">Пароль викторины</h2>
        <div className="flex flex-col gap-4 md:flex-row">
          <input
            type="text"
            value={quiz.password}
            onChange={(e) =>
              setQuiz({ ...quiz, password: e.target.value.toUpperCase() })
            }
            placeholder="Например: ABC123"
            className="flex-1 rounded-2xl border border-gray-300 px-6 py-4 font-mono text-lg focus:border-indigo-500 focus:outline-none"
          />
          <CustomButton
            onClick={handleConnect}
            color="bg-gradient-to-r from-indigo-600 to-violet-600"
            hoverColor="from-indigo-700 to-fuchsia-700"
            size="lg"
            className="whitespace-nowrap px-10"
          >
            Подключиться
          </CustomButton>
        </div>
      </div>

      {/* Тема */}
      <div className="mb-10 rounded-3xl bg-white p-8 shadow-md">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Тема викторины
        </label>
        <input
          type="text"
          value={quiz.subject}
          onChange={(e) => setQuiz({ ...quiz, subject: e.target.value })}
          className="w-full rounded-2xl border border-gray-300 px-6 py-4 text-lg focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {/* Форма */}
      <div ref={formRef} className="mb-12 rounded-3xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-2xl font-semibold">
          {editIndex !== null
            ? `Редактирование вопроса №${editIndex + 1}`
            : "Новый вопрос"}
        </h2>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Текст вопроса
            </label>
            <input
              type="text"
              value={currentQuestion.question}
              onChange={(e) =>
                updateCurrentQuestion({
                  ...currentQuestion,
                  question: e.target.value,
                })
              }
              className="w-full rounded-2xl border border-gray-300 px-6 py-4 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Изображение вопроса */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Изображение вопроса
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={currentQuestion.image}
                onChange={(e) => {
                  updateCurrentQuestion({
                    ...currentQuestion,
                    image: e.target.value,
                  })
                  checkImageUrl(e.target.value, true)
                }}
                placeholder="https://... или загрузите файл"
                className="flex-1 rounded-2xl border border-gray-300 px-6 py-4 focus:border-indigo-500 focus:outline-none"
              />
              <CustomButton
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current.click()}
                color="bg-gradient-to-r from-indigo-600 to-purple-600"
                hoverColor="from-emerald-700 to-teal-600"
                size="md"
                className="px-6"
              >
                {uploading ? "Загрузка..." : "📤 Загрузить"}
              </CustomButton>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, true)}
            />

            {currentQuestion.image && (
              <div className="mt-4 rounded-2xl bg-gray-50 p-3">
                {imageError ? (
                  <p className="text-red-500">Изображение не обнаружено</p>
                ) : (
                  <img
                    src={currentQuestion.image}
                    alt="preview"
                    className="mx-auto max-h-72 rounded-xl object-contain shadow-md"
                    onError={() => setImageError(true)}
                  />
                )}
              </div>
            )}
          </div>

          {/* Варианты ответов */}
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Варианты ответов
            </label>
            {currentQuestion.answers.map((answer, i) => (
              <div key={i} className="mb-6">
                <label className="mb-1 block text-xs text-gray-500">
                  Ответ {i + 1}
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => {
                      const newAnswers = [...currentQuestion.answers]
                      newAnswers[i] = e.target.value
                      updateCurrentQuestion({
                        ...currentQuestion,
                        answers: newAnswers,
                      })
                      checkImageUrl(e.target.value, false, i)
                    }}
                    className="flex-1 rounded-2xl border border-gray-300 px-6 py-4 focus:border-indigo-500 focus:outline-none"
                    placeholder={`Вариант ответа ${i + 1}`}
                  />
                  <CustomButton
                    type="button"
                    disabled={uploading}
                    onClick={() => {
                      const input = document.createElement("input")
                      input.type = "file"
                      input.accept = "image/*"
                      input.onchange = (e) => handleImageUpload(e, false, i)
                      input.click()
                    }}
                    color="bg-gradient-to-r from-indigo-600 to-purple-600"
                    hoverColor="from-emerald-700 to-teal-600"
                    size="md"
                    className="aspect-square px-5" // делаем кнопку квадратной, чтобы эмодзи выглядел хорошо
                  >
                    📤
                  </CustomButton>
                </div>

                {answer && (
                  <div className="mt-3 rounded-2xl bg-gray-50 p-3">
                    {answerImageErrors[i] ? (
                      <p className="text-red-500"> </p>
                    ) : (
                      <img
                        src={answer}
                        alt={`answer-${i}`}
                        className="mx-auto max-h-48 rounded-xl object-contain shadow-md"
                        onError={() => {
                          const newErrors = [...answerImageErrors]
                          newErrors[i] = true
                          setAnswerImageErrors(newErrors)
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Правильный ответ */}
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Правильный ответ
            </label>
            <div className="grid grid-cols-2 gap-3">
              {currentQuestion.answers.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() =>
                    updateCurrentQuestion({ ...currentQuestion, solution: i })
                  }
                  className={`rounded-2xl border-2 px-5 py-4 transition-all ${
                    currentQuestion.solution === i
                      ? "border-green-500 bg-green-50 font-medium text-green-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  Ответ {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Время и Кулдаун */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                ⏱ Время на ответ (секунды)
              </label>
              <input
                type="number"
                value={currentQuestion.time}
                onChange={(e) =>
                  updateCurrentQuestion({
                    ...currentQuestion,
                    time: parseInt(e.target.value) || 90,
                  })
                }
                className="w-full rounded-2xl border border-gray-300 px-6 py-4 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                ⏳ Кулдаун после ответа (секунды)
              </label>
              <input
                type="number"
                value={currentQuestion.cooldown}
                onChange={(e) =>
                  updateCurrentQuestion({
                    ...currentQuestion,
                    cooldown: parseInt(e.target.value) || 5,
                  })
                }
                className="w-full rounded-2xl border border-gray-300 px-6 py-4 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <CustomButton
            onClick={handleAddQuestion}
            disabled={uploading}
            color="bg-gradient-to-r from-emerald-600 to-teal-600"
            hoverColor="from-emerald-700 to-teal-700"
            size="lg"
            className="mt-8 w-full font-medium"
          >
            {editIndex === null ? "Добавить вопрос" : "💾 Сохранить изменения"}
          </CustomButton>
        </div>
      </div>

      {/* Список вопросов (оставил как в твоём последнем варианте) */}
      <h2 className="mb-6 text-2xl font-semibold text-white">
        Добавленные вопросы ({quiz.questions.length})
      </h2>

      <div className="space-y-6">
        {quiz.questions.map((q, index) => {
          const isOpen = openQuestionIndex === index
          const hasAnswerImages = q.answers.some(
            (a) => a && /https?:\/\/|data:image/.test(a),
          )

          return (
            <div
              key={index}
              ref={(el) => (questionRefs.current[index] = el)}
              className="group relative mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-2xl"
            >
              {/* Анимированная полоска сакуры */}
              <div className="absolute left-0 right-0 top-0 h-2 overflow-hidden bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500">
                {/* Имитация падающих лепестков сакуры */}
                <div className="absolute inset-0 animate-[sakura_12s_linear_infinite] bg-[radial-gradient(#fff_0.8px,transparent_1px)] opacity-30 [background-size:40px_40px]" />
                <div className="absolute inset-0 animate-[sakura_18s_linear_infinite_reverse] bg-[radial-gradient(#fff_0.6px,transparent_1px)] opacity-20 [background-size:60px_60px]" />
              </div>

              {/* Основная часть карточки */}
              <div
                onClick={() => toggleQuestion(index)}
                className="flex cursor-pointer items-center justify-between p-7 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-violet-50 group-hover:to-fuchsia-50"
              >
                <div className="flex items-center gap-5">
                  {/* Номер вопроса — идеально по центру вертикали */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-bold text-white shadow-lg transition-transform group-hover:scale-110">
                    {index + 1}
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 transition-colors group-hover:text-violet-700">
                      Вопрос {index + 1}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-[17px] leading-relaxed text-gray-700">
                      {q.question}
                    </p>
                  </div>
                </div>

                {/* Анимированная стрелка */}
                <div
                  className={`ml-6 text-4xl text-gray-300 transition-all duration-300 group-hover:text-violet-400 ${
                    isOpen ? "rotate-180 scale-110 text-violet-500" : ""
                  }`}
                >
                  ▼
                </div>
              </div>

              {/* Контент (остальной код без изменений, только чуть подправил отступы) */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-out ${
                  isOpen ? "max-h-[2200px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="bg-gradient-to-b from-gray-50 to-white px-7 pb-10 pt-3">
                  {/* ... весь остальной контент (вопрос, изображение, ответы, время и кнопки) остаётся как в предыдущей версии ... */}

                  <div className="mb-8 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-gray-100">
                    <p className="text-[17.5px] leading-relaxed text-gray-800">
                      {q.question}
                    </p>
                  </div>

                  {q.image && (
                    <div className="mb-8">
                      <p className="mb-3 text-sm font-medium text-gray-500">
                        Изображение вопроса
                      </p>
                      <div className="overflow-hidden rounded-3xl shadow-lg">
                        <img
                          src={q.image}
                          alt="question"
                          className="mx-auto max-h-80 w-full bg-white object-contain p-6"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mb-9">
                    <p className="mb-4 text-sm font-medium text-gray-500">
                      Варианты ответов:
                    </p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {q.answers.map((ans, i) => (
                        <div
                          key={i}
                          className={`rounded-3xl border p-6 transition-all duration-200 ${
                            i === q.solution
                              ? "border-emerald-400 bg-emerald-50 shadow-sm"
                              : "border-gray-200 bg-white hover:border-violet-200 hover:shadow"
                          }`}
                        >
                          {/^data:image|https?:\/\//.test(ans) ? (
                            <img
                              src={ans}
                              alt={`answer-${i}`}
                              className="mx-auto max-h-36 object-contain"
                            />
                          ) : (
                            <span className="text-[16px]">{ans}</span>
                          )}
                          {i === q.solution && (
                            <div className="mt-4 inline-flex items-center gap-2 text-emerald-600">
                              <span className="text-xl">✓</span>
                              <span className="font-medium">
                                Правильный ответ
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
                    <span className="flex items-center gap-2">
                      ⏱{" "}
                      <strong className="font-semibold text-gray-900">
                        {q.time} сек
                      </strong>{" "}
                      на ответ
                    </span>
                    <span className="flex items-center gap-2">
                      ⏳ Кулдаун:{" "}
                      <strong className="font-semibold text-gray-900">
                        {q.cooldown} сек
                      </strong>
                    </span>
                  </div>

                  <div className="mt-10 flex gap-4">
                    <CustomButton
                      onClick={() => handleEditQuestion(index)}
                      color="bg-gradient-to-r from-amber-500 to-orange-500"
                      hoverColor="from-amber-600 to-orange-600"
                      size="md"
                      className="flex-1 font-medium"
                    >
                      ✏️ Редактировать
                    </CustomButton>

                    <CustomButton
                      onClick={() => handleDeleteQuestion(index)}
                      color="bg-gradient-to-r from-red-500 to-rose-600"
                      hoverColor="from-red-600 to-rose-700"
                      size="md"
                      className="flex-1 font-medium"
                    >
                      🗑 Удалить
                    </CustomButton>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {quiz.questions.length === 0 && (
          <div className="rounded-3xl bg-white p-12 text-center text-gray-500">
            Пока нет добавленных вопросов
          </div>
        )}
      </div>

      <CustomButton
        onClick={saveQuiz}
        color="bg-gradient-to-r from-indigo-600 to-violet-600"
        hoverColor="from-indigo-700 to-violet-700"
        size="lg"
        className="mt-12 w-full font-semibold"
      >
        💾 Сохранить викторину в базу данных
      </CustomButton>
    </div>
  )
}

export default QuizForm
