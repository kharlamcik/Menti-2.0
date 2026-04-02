import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "@/components/Button";

const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openQuizId, setOpenQuizId] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch("/api/list");
        if (!res.ok) throw new Error("Ошибка загрузки викторин");
        const data = await res.json();
        setQuizzes(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const toggleQuiz = (password) => {
    setOpenQuizId(openQuizId === password ? null : password);
  };

  const copyPassword = (password) => {
    navigator.clipboard.writeText(password).then(() => {
      toast.success(`Пароль "${password}" скопирован!`, {
        position: "top-center",
        autoClose: 2000,
      });
    });
  };

  if (loading) return <div className="text-center py-20 text-xl">Загрузка викторин...</div>;
  if (error) return <div className="text-center text-red-500 py-20">{error}</div>;
  if (quizzes.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl text-gray-500">У вас пока нет викторин</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-white">Мои викторины</h1>
        <Button 
          onClick={() => window.location.href = '/create-quiz'}
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-2xl transition-all active:scale-95"
        >
          + Создать новую викторину
        </Button>
      </div>

      <div className="space-y-6">
        {quizzes.map((quiz) => {
          const isOpen = openQuizId === quiz.password;

          return (
            <div
              key={quiz.password}
              className="group bg-white rounded-3xl shadow-md overflow-hidden border border-gray-100 hover:border-indigo-200 transition-all duration-300 relative"
            >
              {/* Анимированный градиентный перелив сверху */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>

              {/* Основная карточка */}
              <div
                onClick={() => toggleQuiz(quiz.password)}
                className="pt-6 pb-5 px-6 cursor-pointer flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <div className="flex-1 pr-4">
                  <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                    {quiz.subject}
                  </h2>
                  <p className="text-gray-500 mt-1.5">
                    {quiz.questions?.length ?? 0} вопросов • Пароль:{" "}
                    <span className="font-mono font-medium text-indigo-600">
                      {quiz.password}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); copyPassword(quiz.password); }}
                    className="px-4 py-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all"
                  >
                    📋 Копировать
                  </button>

                  <div className={`text-2xl text-gray-400 hover:text-gray-600 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                    ▼
                  </div>
                </div>
              </div>

              {/* Плавно анимируемый контент */}
              <div
                className={`grid transition-all duration-300 ease-out overflow-hidden ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-8 pt-2 bg-gray-50">
                    <h3 className="font-medium text-gray-700 mb-5 text-lg">Вопросы викторины:</h3>
                    
                    <div className="space-y-6">
                      {quiz.questions?.map((q, index) => (
                        <div
                          key={index}
                          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                        >
                          <div className="flex gap-4">
                            <span className="text-indigo-600 font-bold text-xl shrink-0 mt-0.5">
                              {index + 1}.
                            </span>
                            <p className="text-gray-800 text-[17px] leading-relaxed">
                              {q.question}
                            </p>
                          </div>

                          {q.answers && q.answers.length > 0 && (
                            <div className="mt-5 pl-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {q.answers.map((answer, i) => {
                                const isCorrect = i === q.solution;
                                return (
                                  <div
                                    key={i}
                                    className={`px-5 py-4 rounded-2xl text-base border transition-all break-words overflow-hidden ${
                                      isCorrect
                                        ? "bg-green-100 border-green-400 text-green-800 font-medium"
                                        : "bg-gray-50 border-gray-200 text-gray-700"
                                    }`}
                                  >
                                    {/^data:image|https?:\/\//.test(answer) ? (
  <img
    src={answer}
    alt={`answer-${i}`}
    className="max-h-32 object-contain mx-auto"
  />
) : (
  <span>{answer}</span>
)}
                                    {isCorrect && (
                                      <span className="ml-2 text-green-600 font-medium">✓ правильный</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {(q.time || q.cooldown) && (
                            <div className="mt-4 pl-10 text-sm text-gray-500 flex gap-5">
                              {q.time && <span>⏱ {q.time} сек на ответ</span>}
                              {q.cooldown && <span>⏳ Кулдаун: {q.cooldown} сек</span>}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4 mt-10">
                      <Button
                        onClick={() => copyPassword(quiz.password)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white border-0 py-3 transition-all active:scale-[0.98]"
                      >
                        📋 Скопировать пароль
                      </Button>
                      <Button
                        onClick={() => window.location.href = `/manager?quiz=${quiz.password}`}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 transition-all active:scale-[0.98]"
                      >
                        🚀 Запустить викторину
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default QuizListPage;