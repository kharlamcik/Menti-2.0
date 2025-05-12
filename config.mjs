export const WEBSOCKET_PUBLIC_URL = "http://localhost:5505/"
export const WEBSOCKET_SERVER_PORT = 5505

const QUIZZ_CONFIG = {
  password: "PASSWORD",
  subject: "Adobe",
  questions: [
    {
      question: "Кто основатели Adobe?",
      answers: [
        "Стив Джобс и Чарльз Гешке",
        "Джон Уорнок и Чарльз Гешке",
        "Джон Джонс и Чарльз Гески",
        "Билл Гейтс",
      ],
      solution: 1,
      cooldown: 5,
      time: 15,
    },
    {
      question: "Какое самое известное программное обеспечение Adobe?",
      answers: ["Encore", "AfterEffect", "Creative Cloud", "Photoshop"],
      image:
        "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=500&auto=webp",
      solution: 3,
      cooldown: 5,
      time: 15,
    },
    {
      question: "Когда была основана Adobe?",
      answers: ["2000", "1982", "2003", "1987"],
      solution: 1,
      cooldown: 5,
      time: 15,
    },
    {
      question: "Где находится штаб-квартира Adobe?",
      answers: [
        "Сан-Хосе, Калифорния",
        "Букворм, Каскуи",
        "Даунтаун, Техас",
        "Токио, Япония",
      ],
      solution: 0,
      cooldown: 5,
      time: 15,
    },
    {
      question: "Сколько сотрудников работает в Adobe?",
      answers: [
        "15 423 сотрудника",
        "30 803 сотрудника",
        "25 988 сотрудников",
        "5 073 сотрудника",
      ],
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=500&auto=webp",
      solution: 2,
      cooldown: 5,
      time: 15,
    },
    {
      question: "Кто текущий генеральный директор Adobe?",
      answers: [
        "Джон Уорнок",
        "Виктор Ньювэй",
        "Марк Ява",
        "Шантану Нарайен",
      ],
      image:
        "https://images.unsplash.com/photo-1435348773030-a1d74f568bc2?q=80&w=500&auto=webp",
      solution: 3,
      cooldown: 5,
      time: 15,
    },
    {
      question: "На чём сосредоточен основной бизнес Adobe?",
      answers: [
        "Креативное ПО",
        "Видеоигры",
        "Логистическое ПО",
        "Другое",
      ],
      image:
        "https://images.unsplash.com/photo-1582736317407-371893d9e146?q=80&w=500&auto=webp",
      solution: 0,
      cooldown: 5,
      time: 15,
    },
  ],
}


// DONT CHANGE
export const GAME_STATE_INIT = {
  started: false,
  players: [],
  playersAnswer: [],
  manager: null,
  room: null,
  currentQuestion: 0,
  roundStartTime: 0,
  ...QUIZZ_CONFIG,
}
