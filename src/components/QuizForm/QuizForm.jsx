import React, { useState } from 'react';
import styles from './QuizForm.module.css';
import Button from "@/components/Button"

const QuizForm = () => {
  const [quiz, setQuiz] = useState({
    password: '',
    subject: '',
    questions: [],
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    answers: ['', '', '', ''],
    solution: 0,
    cooldown: 5,
    time: 15,
    image: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isQuizExist, setIsQuizExist] = useState(false); // Флаг для проверки, существует ли викторина
  const [editIndex, setEditIndex] = useState(null); // Индекс редактируемого вопроса

  // Функция для подключения и поиска викторины по паролю
  const handleConnect = async () => {
  setLoading(true);
  setMessage('');

  try {
    // Запрашиваем викторину по паролю
    const response = await fetch(`/api/quizzes?password=${quiz.password}`);
    const data = await response.json();

    if (response.ok) {
      if (data.questions) {
        // Если викторина найдена, загружаем вопросы и тему
        setQuiz({
          ...quiz,
          questions: data.questions,
          subject: data.subject, // Устанавливаем тему из базы данных
        });
        setIsQuizExist(true); // Устанавливаем флаг, что викторина существует
        setMessage('Викторина загружена, добавьте новые вопросы.');
      }
    } else {
      setMessage('Викторина не найдена, создаем новую.');
      setIsQuizExist(false); // Устанавливаем флаг, что викторина не найдена
    }
  } catch (error) {
    console.error('Ошибка подключения:', error);
    setMessage('Произошла ошибка при подключении.');
  } finally {
    setLoading(false);
  }
};


  // Функция для добавления нового вопроса в состояние
  const handleAddQuestion = () => {
    if (editIndex === null) {
      // Добавляем новый вопрос
      setQuiz({
        ...quiz,
        questions: [
          ...quiz.questions,
          currentQuestion,
        ],
      });
    } else {
      // Обновляем редактируемый вопрос
      const updatedQuestions = [...quiz.questions];
      updatedQuestions[editIndex] = currentQuestion; // Обновляем редактируемый вопрос
      setQuiz({
        ...quiz,
        questions: updatedQuestions,
      });
    }
    // После добавления вопроса очищаем форму и сбрасываем индекс редактирования
    setCurrentQuestion({
      question: '',
      answers: ['', '', '', ''],
      solution: 0,
      cooldown: 5,
      time: 15,
      image: '', // Очищаем поле для изображения
    });
    setEditIndex(null); // Сбрасываем индекс редактируемого вопроса
  };

  // Функция для редактирования вопроса
  const handleEditQuestion = (index) => {
    setCurrentQuestion(quiz.questions[index]); // Загружаем вопрос для редактирования
    setEditIndex(index); // Устанавливаем индекс редактируемого вопроса
  };

  // Функция для удаления вопроса
  const handleDeleteQuestion = (index) => {
    const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz({
      ...quiz,
      questions: updatedQuestions,
    });
  };

  // Функция для сохранения викторины в БД
  const handleSaveQuizToDatabase = async () => {
    try {
      const response = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quiz),
      });

      if (response.ok) {
        alert('Викторина успешно сохранена!');
      } else {
        alert('Ошибка при сохранении викторины.');
      }
    } catch (error) {
      alert('Произошла ошибка при отправке данных.');
    }
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="max-w-3xl mx-auto bg-white p-8 rounded shadow-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Создание викторины</h2>

      <div className="mb-4">
        <Button
          type="button"
          onClick={handleConnect}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded mb-4"
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
          className="w-full px-4 py-2 border rounded mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Тема:</label>
        <input
          type="text"
          value={quiz.subject}
          onChange={(e) => setQuiz({ ...quiz, subject: e.target.value })}
          required
          className="w-full px-4 py-2 border rounded mt-1"
        />
      </div>

      <h3 className="text-xl font-semibold mb-4">Добавить вопрос</h3>
      <Button
        type="button"
        onClick={handleAddQuestion}
        className="w-full bg-green-500 text-white py-2 px-4 rounded mb-4"
      >
        {editIndex === null ? 'Добавить вопрос' : 'Сохранить изменения'}
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
          className="w-full px-4 py-2 border rounded mt-1"
        />
      </div>

      {currentQuestion.answers.map((answer, index) => (
        <div className="mb-4" key={index}>
          <label className="block text-gray-700">Ответ {index + 1}:</label>
          <input
            type="text"
            value={answer}
            onChange={(e) => {
              const newAnswers = [...currentQuestion.answers];
              newAnswers[index] = e.target.value;
              setCurrentQuestion({ ...currentQuestion, answers: newAnswers });
            }}
            required
            className="w-full px-4 py-2 border rounded mt-1"
          />
        </div>
      ))}

      <div className="mb-4">
        <label className="block text-gray-700">Правильный ответ (0-3):</label>
        <input
          type="number"
          min="0"
          max="3"
          value={currentQuestion.solution}
          onChange={(e) =>
            setCurrentQuestion({ ...currentQuestion, solution: parseInt(e.target.value) })
          }
          required
          className="w-full px-4 py-2 border rounded mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Время на ответ (сек):</label>
        <input
          type="number"
          value={currentQuestion.time}
          onChange={(e) =>
            setCurrentQuestion({ ...currentQuestion, time: parseInt(e.target.value) })
          }
          required
          className="w-full px-4 py-2 border rounded mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Время ожидания (сек):</label>
        <input
          type="number"
          value={currentQuestion.cooldown}
          onChange={(e) =>
            setCurrentQuestion({ ...currentQuestion, cooldown: parseInt(e.target.value) })
          }
          required
          className="w-full px-4 py-2 border rounded mt-1"
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
          className="w-full px-4 py-2 border rounded mt-1"
        />
      </div>

      {message && <p>{message}</p>}

      {/* Сохранить или создать викторину */}
      <Button
        type="button"
        onClick={handleSaveQuizToDatabase}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded mt-4"
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
                <img src={q.image} alt="Image" className="w-64 h-32 object-cover" />
              </div>
            )}
            <Button
              type="button"
              onClick={() => handleEditQuestion(index)}
              className="mt-2 bg-yellow-500 text-white py-1 px-4 rounded"
            >
              Редактировать
            </Button>
            <Button
              type="button"
              onClick={() => handleDeleteQuestion(index)}
              className="m-2 bg-red-500 text-white py-1 px-4 rounded"
            >
              Удалить вопрос
            </Button>
          </div>
        ))}
      </div>
    </form>
  );
};

export default QuizForm;
