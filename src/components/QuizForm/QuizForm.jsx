import React, { useRef, useState } from "react";
import Button from "@/components/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const QuizForm = () => {
  const [quiz, setQuiz] = useState({
    password: "",
    subject: "",
    questions: [],
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    answers: ["", "", "", ""],
    solution: 0,
    time: 30,
    cooldown: 5,
    image: "",
  });

  const [editIndex, setEditIndex] = useState(null);
  const [openQuestionIndex, setOpenQuestionIndex] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [imageError, setImageError] = useState(false);
  const [answerImageErrors, setAnswerImageErrors] = useState([false, false, false, false]);
  const [uploading, setUploading] = useState(false);

  const formRef = useRef(null);
  const questionRefs = useRef([]);
  const fileInputRef = useRef(null);

  // ====================== ЗАГРУЗКА НА IMGBB ======================
  const uploadToImgBB = async (file) => {
    if (!IMGBB_API_KEY) {
      toast.error("ImgBB API ключ не настроен в .env.local");
      return null;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Изображение успешно загружено!");
        return data.data.url;
      } else {
        toast.error("Ошибка загрузки на ImgBB");
        return null;
      }
    } catch (err) {
      toast.error("Ошибка соединения с ImgBB");
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Загрузка файла с компьютера
  const handleImageUpload = async (e, isQuestionImage = true, answerIndex = null) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Пожалуйста, выберите изображение");
      return;
    }

    const imageUrl = await uploadToImgBB(file);
    if (!imageUrl) return;

    if (isQuestionImage) {
      updateCurrentQuestion({ ...currentQuestion, image: imageUrl });
      setImageError(false);
    } else if (answerIndex !== null) {
      const newAnswers = [...currentQuestion.answers];
      newAnswers[answerIndex] = imageUrl;
      updateCurrentQuestion({ ...currentQuestion, answers: newAnswers });
      const newErrors = [...answerImageErrors];
      newErrors[answerIndex] = false;
      setAnswerImageErrors(newErrors);
    }
  };

  // Проверка ссылки (оставил как было)
  const checkImageUrl = (url, isQuestionImage = true, answerIndex = null) => {
    if (!url) {
      if (isQuestionImage) setImageError(false);
      else if (answerIndex !== null) {
        const newErrors = [...answerImageErrors];
        newErrors[answerIndex] = false;
        setAnswerImageErrors(newErrors);
      }
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (isQuestionImage) setImageError(false);
      else if (answerIndex !== null) {
        const newErrors = [...answerImageErrors];
        newErrors[answerIndex] = false;
        setAnswerImageErrors(newErrors);
      }
    };
    img.onerror = () => {
      if (isQuestionImage) setImageError(true);
      else if (answerIndex !== null) {
        const newErrors = [...answerImageErrors];
        newErrors[answerIndex] = true;
        setAnswerImageErrors(newErrors);
      }
    };
    img.src = url;
  };

  // ====================== Остальной код без изменений ======================
  const checkUnsavedChanges = (callback) => {
    if (hasUnsavedChanges && editIndex !== null) {
      if (window.confirm("Есть несохранённые изменения. Сохранить перед переходом?")) {
        handleAddQuestion();
      } else return;
    }
    callback();
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToQuestion = (index) => {
    setTimeout(() => {
      questionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 400);
  };

  const handleConnect = async () => {
    if (!quiz.password.trim()) return toast.error("Введите пароль викторины");
    try {
      const res = await fetch(`/api/quizzes?password=${quiz.password}`);
      const data = await res.json();
      if (res.ok && data.questions) {
        setQuiz({ password: quiz.password, subject: data.subject || quiz.subject, questions: data.questions });
        toast.success("Викторина загружена!");
      } else {
        toast.info("Создаём новую викторину");
      }
    } catch (e) {
      toast.error("Ошибка подключения");
    }
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.question.trim()) return toast.error("Введите текст вопроса");

    if (editIndex === null) {
      setQuiz({ ...quiz, questions: [...quiz.questions, { ...currentQuestion }] });
      toast.success("Вопрос добавлен!");
    } else {
      const updated = [...quiz.questions];
      updated[editIndex] = { ...currentQuestion };
      setQuiz({ ...quiz, questions: updated });
      toast.success(`Вопрос №${editIndex + 1} обновлён`);
    }

    setCurrentQuestion({
      question: "",
      answers: ["", "", "", ""],
      solution: 0,
      time: 90,
      cooldown: 5,
      image: "",
    });
    setEditIndex(null);
    setHasUnsavedChanges(false);
    setImageError(false);
    setAnswerImageErrors([false, false, false, false]);

    scrollToQuestion(editIndex !== null ? editIndex : quiz.questions.length);
  };

  const handleEditQuestion = (index) => {
    checkUnsavedChanges(() => {
      setCurrentQuestion(quiz.questions[index]);
      setEditIndex(index);
      setOpenQuestionIndex(index);
      setHasUnsavedChanges(false);
      setImageError(false);
      setAnswerImageErrors([false, false, false, false]);
      setTimeout(scrollToForm, 100);
    });
  };

  const handleDeleteQuestion = (index) => {
    checkUnsavedChanges(() => {
      const updated = quiz.questions.filter((_, i) => i !== index);
      setQuiz({ ...quiz, questions: updated });
      toast.warn(`Вопрос №${index + 1} удалён`);
      if (openQuestionIndex === index) setOpenQuestionIndex(null);
      if (editIndex === index) setEditIndex(null);
    });
  };

  const toggleQuestion = (index) => {
    checkUnsavedChanges(() => {
      setOpenQuestionIndex(openQuestionIndex === index ? null : index);
    });
  };

  const updateCurrentQuestion = (newData) => {
    setCurrentQuestion(newData);
    setHasUnsavedChanges(true);
  };

  const saveQuiz = async () => {
    if (!quiz.password || !quiz.subject) return toast.error("Заполните пароль и тему");
    if (quiz.questions.length === 0) return toast.error("Добавьте хотя бы один вопрос");

    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quiz),
      });
      if (res.ok) toast.success("Викторина успешно сохранена!");
      else toast.error("Ошибка при сохранении");
    } catch (err) {
      toast.error("Ошибка соединения");
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-10 text-center text-4xl font-bold text-white">Создание викторины</h1>

      {/* Пароль */}
      <div className="mb-10 rounded-3xl bg-white p-8 shadow-md">
        <h2 className="mb-5 text-2xl font-semibold">Пароль викторины</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={quiz.password}
            onChange={(e) => setQuiz({ ...quiz, password: e.target.value.toUpperCase() })}
            placeholder="Например: ABC123"
            className="flex-1 rounded-2xl border border-gray-300 px-6 py-4 text-lg font-mono focus:border-indigo-500 focus:outline-none"
          />
          <Button onClick={handleConnect} className="bg-indigo-600 hover:bg-indigo-700 px-10 py-4 text-lg whitespace-nowrap">
            Подключиться
          </Button>
        </div>
      </div>

      {/* Тема */}
      <div className="mb-10 rounded-3xl bg-white p-8 shadow-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">Тема викторины</label>
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
          {editIndex !== null ? `Редактирование вопроса №${editIndex + 1}` : "Новый вопрос"}
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Текст вопроса</label>
            <input
              type="text"
              value={currentQuestion.question}
              onChange={(e) => updateCurrentQuestion({ ...currentQuestion, question: e.target.value })}
              className="w-full rounded-2xl border border-gray-300 px-6 py-4 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Изображение вопроса */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Изображение вопроса</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={currentQuestion.image}
                onChange={(e) => {
                  updateCurrentQuestion({ ...currentQuestion, image: e.target.value });
                  checkImageUrl(e.target.value, true);
                }}
                placeholder="https://... или загрузите файл"
                className="flex-1 rounded-2xl border border-gray-300 px-6 py-4 focus:border-indigo-500 focus:outline-none"
              />
              <Button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current.click()}
                className="bg-gray-700 hover:bg-gray-800 text-white px-6"
              >
                {uploading ? "Загрузка..." : "📤 Загрузить"}
              </Button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, true)}
            />

            {currentQuestion.image && (
              <div className="mt-4 p-3 bg-gray-50 rounded-2xl">
                {imageError ? (
                  <p className="text-red-500">Изображение не обнаружено</p>
                ) : (
                  <img
                    src={currentQuestion.image}
                    alt="preview"
                    className="max-h-72 rounded-xl shadow-md object-contain mx-auto"
                    onError={() => setImageError(true)}
                  />
                )}
              </div>
            )}
          </div>

          {/* Варианты ответов */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Варианты ответов</label>
            {currentQuestion.answers.map((answer, i) => (
              <div key={i} className="mb-6">
                <label className="block text-xs text-gray-500 mb-1">Ответ {i + 1}</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => {
                      const newAnswers = [...currentQuestion.answers];
                      newAnswers[i] = e.target.value;
                      updateCurrentQuestion({ ...currentQuestion, answers: newAnswers });
                      checkImageUrl(e.target.value, false, i);
                    }}
                    className="flex-1 rounded-2xl border border-gray-300 px-6 py-4 focus:border-indigo-500 focus:outline-none"
                    placeholder={`Вариант ответа ${i + 1}`}
                  />
                  <Button
                    type="button"
                    disabled={uploading}
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.onchange = (e) => handleImageUpload(e, false, i);
                      input.click();
                    }}
                    className="bg-gray-700 hover:bg-gray-800 text-white px-5"
                  >
                    📤
                  </Button>
                </div>

                {answer && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-2xl">
                    {answerImageErrors[i] ? (
                      <p className="text-red-500"> </p>
                    ) : (
                      <img
                        src={answer}
                        alt={`answer-${i}`}
                        className="max-h-48 rounded-xl shadow-md object-contain mx-auto"
                        onError={() => {
                          const newErrors = [...answerImageErrors];
                          newErrors[i] = true;
                          setAnswerImageErrors(newErrors);
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
            <label className="block text-sm font-medium text-gray-700 mb-3">Правильный ответ</label>
            <div className="grid grid-cols-2 gap-3">
              {currentQuestion.answers.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => updateCurrentQuestion({ ...currentQuestion, solution: i })}
                  className={`py-4 px-5 rounded-2xl border-2 transition-all ${
                    currentQuestion.solution === i
                      ? "border-green-500 bg-green-50 text-green-700 font-medium"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  Ответ {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Время и Кулдаун */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">⏱ Время на ответ (секунды)</label>
              <input
                type="number"
                value={currentQuestion.time}
                onChange={(e) => updateCurrentQuestion({ ...currentQuestion, time: parseInt(e.target.value) || 90 })}
                className="w-full rounded-2xl border border-gray-300 px-6 py-4 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">⏳ Кулдаун после ответа (секунды)</label>
              <input
                type="number"
                value={currentQuestion.cooldown}
                onChange={(e) => updateCurrentQuestion({ ...currentQuestion, cooldown: parseInt(e.target.value) || 5 })}
                className="w-full rounded-2xl border border-gray-300 px-6 py-4 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <Button
            onClick={handleAddQuestion}
            className="mt-8 w-full bg-green-600 hover:bg-green-700 py-4 text-lg font-medium"
            disabled={uploading}
          >
            {editIndex === null ? "➕ Добавить вопрос" : "💾 Сохранить изменения"}
          </Button>
        </div>
      </div>

      {/* Список вопросов (оставил как в твоём последнем варианте) */}
      <h2 className="mb-6 text-2xl font-semibold text-white">Добавленные вопросы ({quiz.questions.length})</h2>

      <div className="space-y-6">
        {quiz.questions.map((q, index) => {
          const isOpen = openQuestionIndex === index;
          const hasAnswerImages = q.answers.some((a) => a && /https?:\/\/|data:image/.test(a));

          return (
            <div
              key={index}
              ref={(el) => (questionRefs.current[index] = el)}
              className="mx-auto w-full max-w-3xl bg-white rounded-3xl shadow-md overflow-hidden border border-gray-100 hover:border-indigo-200 transition-all duration-300 min-h-[190px] flex flex-col relative"
            >
              <div className="absolute top-0 left-0 right-0 h-[6px] bg-gradient-to-r from-indigo-500 via-purple-500 via-violet-500 to-pink-500 overflow-hidden">
                <div className="h-full w-[60%] bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
              </div>

              <div
                onClick={() => toggleQuestion(index)}
                className="p-6 cursor-pointer flex justify-between items-center hover:bg-gray-50 flex-1"
              >
                <div className="flex-1 pr-4">
                  <h3 className="font-semibold text-xl">Вопрос {index + 1}</h3>
                  <p className="text-gray-600 mt-1 line-clamp-2">{q.question}</p>
                </div>
                <div className={`text-3xl text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                  ▼
                </div>
              </div>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isOpen ? "max-h-[1400px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-8 bg-gray-50">
                  <p className="text-lg font-medium mb-6">{q.question}</p>

                  {q.image && (
                    <div className="mb-6">
                      <p className="text-sm text-gray-500 mb-2">Изображение вопроса:</p>
                      <img src={q.image} alt="question" className="max-h-80 rounded-2xl shadow-md object-contain mx-auto" />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {q.answers.map((ans, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-2xl border text-base break-words ${
                          i === q.solution ? "bg-green-100 border-green-400 text-green-800 font-medium" : "bg-white border-gray-200"
                        }`}
                      >
                        {/^data:image|https?:\/\//.test(ans) ? (
  <img
    src={ans}
    alt={`answer-${i}`}
    className="max-h-32 object-contain mx-auto"
  />
) : (
  <span>{ans}</span>
)}
                        {i === q.solution && <span className="ml-2">✓ правильный</span>}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-6 text-sm text-gray-600">
                    <span>⏱ Время: <strong>{q.time} сек</strong></span>
                    <span>⏳ Кулдаун: <strong>{q.cooldown} сек</strong></span>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <Button onClick={() => handleEditQuestion(index)} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white">
                      ✏️ Редактировать
                    </Button>
                    <Button onClick={() => handleDeleteQuestion(index)} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
                      🗑 Удалить
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {quiz.questions.length === 0 && (
          <div className="rounded-3xl bg-white p-12 text-center text-gray-500">
            Пока нет добавленных вопросов
          </div>
        )}
      </div>

      <Button onClick={saveQuiz} className="mt-12 w-full bg-indigo-600 hover:bg-indigo-700 py-5 text-xl font-semibold">
        💾 Сохранить викторину в базу данных
      </Button>

      
    </div>
  );
};

export default QuizForm;