// QuestionForm.jsx
import Button from "@/components/Button";

const QuestionForm = ({ 
  currentQuestion, 
  onChange, 
  onSubmit, 
  editIndex 
}) => {
  return (
    <div className="mb-12 rounded-3xl bg-white p-8 shadow-lg">
      <h2 className="mb-6 text-2xl font-semibold">
        {editIndex !== null ? `Редактирование вопроса №${editIndex + 1}` : "Новый вопрос"}
      </h2>

      <div className="space-y-6">
        {/* Текст вопроса */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Текст вопроса</label>
          <input
            type="text"
            value={currentQuestion.question}
            onChange={(e) => onChange({ ...currentQuestion, question: e.target.value })}
            className="w-full rounded-2xl border border-gray-300 px-6 py-4 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Изображение вопроса */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Изображение вопроса</label>
          <input
            type="text"
            value={currentQuestion.image}
            onChange={(e) => onChange({ ...currentQuestion, image: e.target.value })}
            placeholder="https://..."
            className="w-full rounded-2xl border border-gray-300 px-6 py-4 focus:border-indigo-500 focus:outline-none"
          />
          {currentQuestion.image && /https?:\/\/.*\.(jpeg|jpg|png|gif|webp)$/i.test(currentQuestion.image) && (
            <div className="mt-4 p-3 bg-gray-50 rounded-2xl">
              <img src={currentQuestion.image} alt="preview" className="max-h-72 rounded-xl shadow-md object-contain mx-auto" />
            </div>
          )}
        </div>

        {/* Варианты ответов */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Варианты ответов</label>
          {currentQuestion.answers.map((answer, i) => (
            <div key={i} className="mb-6">
              <label className="block text-xs text-gray-500 mb-1">Ответ {i + 1}</label>
              <input
                type="text"
                value={answer}
                onChange={(e) => {
                  const newAnswers = [...currentQuestion.answers];
                  newAnswers[i] = e.target.value;
                  onChange({ ...currentQuestion, answers: newAnswers });
                }}
                className="w-full rounded-2xl border border-gray-300 px-6 py-4 focus:border-indigo-500 focus:outline-none"
              />
              {answer && /https?:\/\/.*\.(jpeg|jpg|png|gif|webp)$/i.test(answer) && (
                <div className="mt-3 p-3 bg-gray-50 rounded-2xl">
                  <img src={answer} alt={`answer-${i}`} className="max-h-48 rounded-xl shadow-md object-contain mx-auto" />
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
                onClick={() => onChange({ ...currentQuestion, solution: i })}
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
              onChange={(e) => onChange({ ...currentQuestion, time: parseInt(e.target.value) || 90 })}
              className="w-full rounded-2xl border border-gray-300 px-6 py-4 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">⏳ Кулдаун после ответа (секунды)</label>
            <input
              type="number"
              value={currentQuestion.cooldown}
              onChange={(e) => onChange({ ...currentQuestion, cooldown: parseInt(e.target.value) || 5 })}
              className="w-full rounded-2xl border border-gray-300 px-6 py-4 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <Button
          onClick={onSubmit}
          className="mt-8 w-full bg-green-600 hover:bg-green-700 py-4 text-lg font-medium"
        >
          {editIndex === null ? "➕ Добавить вопрос" : "💾 Сохранить изменения"}
        </Button>
      </div>
    </div>
  );
};

export default QuestionForm;