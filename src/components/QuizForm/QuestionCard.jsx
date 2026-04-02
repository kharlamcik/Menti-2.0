// QuestionCard.jsx
import React from "react";
import Button from "@/components/Button";

const QuestionCard = React.forwardRef(({ 
  question, 
  index, 
  isOpen, 
  onToggle, 
  onEdit, 
  onDelete 
}, ref) => {

  const hasAnswerImages = question.answers.some((a) =>
    /https?:\/\/.*\.(jpeg|jpg|png|gif|webp)$/i.test(a)
  );

  return (
    <div ref={ref} className="mx-auto w-full max-w-3xl bg-white rounded-3xl shadow-md overflow-hidden border border-gray-100 hover:border-indigo-200 transition-all duration-300 min-h-[190px] flex flex-col relative">
      
      {/* Перелив */}
      <div className="absolute top-0 left-0 right-0 h-[6px] bg-gradient-to-r from-indigo-500 via-purple-500 via-violet-500 to-pink-500 overflow-hidden">
        <div className="h-full w-[60%] bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
      </div>

      {/* Заголовок */}
      <div
        onClick={onToggle}
        className="p-6 cursor-pointer flex justify-between items-center hover:bg-gray-50 flex-1"
      >
        <div className="flex-1 pr-4">
          <h3 className="font-semibold text-xl">Вопрос {index + 1}</h3>
          <p className="text-gray-600 mt-1 line-clamp-2">{question.question}</p>
        </div>
        <div className={`text-3xl text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </div>
      </div>

      {/* Плавное открытие */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[1400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-8 bg-gray-50">
          <p className="text-lg font-medium mb-6">{question.question}</p>

          {question.image && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Изображение вопроса:</p>
              <img src={question.image} alt="question" className="max-h-80 rounded-2xl shadow-md object-contain mx-auto" />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {question.answers.map((ans, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl border text-base break-words ${
                  i === question.solution
                    ? "bg-green-100 border-green-400 text-green-800 font-medium"
                    : "bg-white border-gray-200"
                }`}
              >
                {ans}
                {i === question.solution && <span className="ml-2">✓ правильный</span>}
              </div>
            ))}
          </div>

          {hasAnswerImages && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-3">Изображения в ответах:</p>
              <div className="flex flex-wrap gap-4">
                {question.answers.map((ans, i) =>
                  /https?:\/\/.*\.(jpeg|jpg|png|gif|webp)$/i.test(ans) ? (
                    <div key={i} className="text-center">
                      <img src={ans} alt={`ans-${i}`} className="max-h-40 rounded-2xl shadow-md object-contain" />
                      <p className="text-xs mt-2">Ответ {i + 1}</p>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}

          <div className="flex gap-6 text-sm text-gray-600 mb-6">
            <span>⏱ Время: <strong>{question.time} сек</strong></span>
            <span>⏳ Кулдаун: <strong>{question.cooldown} сек</strong></span>
          </div>

          <div className="flex gap-4">
            <Button onClick={onEdit} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white">
              ✏️ Редактировать
            </Button>
            <Button onClick={onDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
              🗑 Удалить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

QuestionCard.displayName = "QuestionCard";

export default QuestionCard;