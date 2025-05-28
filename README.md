<p align="center">
  <img width="734" height="414" align="center" src="https://i.pinimg.com/736x/c9/3c/9c/c93c9c83f2ccc4f9bf5543057af087ad.jpg">
  <br>
  <img align="center" src="https://api.visitorbadge.io/api/visitors?path=kharlamcik/Menti-2.0&countColor=%2337d67a">
</p>

## ⚙️ Prerequisites

- Node.js version 20 or higher

## 📖 Getting Started

1.  #### Clone the GitHub repository of your project.
    ```bash
    cd ./Menti-2.0
    ```
2.  #### Install the dependencies using your preferred package manager

    ```bash
    npm install
    ```

    <br>
    <hr>

## 📦 Running the Application in Production Mode:

1. #### Check websocket connfiguration in [config.mjs](config.mjs)

   Если вы хотите, чтобы клиент подключался напрямую к серверу веб-сокета, отредактируйте файл [config.mjs](config.mjs) и измените localhost на свой публичный IP-адрес. И изменить IP в [manager.jsx](src\pages\manager.jsx)
  ```js
   const inviteLink = state.status?.data?.inviteCode
    ? `http://192.168.0.190:3000/`
    : ""

   ```
   ```js
   export const WEBSOCKET_PUBLIC_URL = "http://1.2.3.4:3100/"
   export const WEBSOCKET_SERVER_PORT = 3100

   // Rest of the config ...
   ```

2. #### Start the application

   ```bash
   npm run all
   ```

## ⚙️ Running the Application in Development Mode:

```bash
npm run all-dev
```

## 🔧 Configuration

Configuration can be found in [config.mjs](config.mjs)

```js
const QUIZZ_CONFIG = {
  password: "PASSWORD", // Manager password
  subject: "Adobe", // Subject of the quiz
  questions: [
    { // Example question
      question: "What is good answer ?", // Question
      answers: [ // Possible answers
        "No",
        "Yes",
        "No",
        "No",
      ],
      image:
        "https://images.unsplash.com/....", // Image URL (optional)
      solution: 1, // Index of the correct answer (index starts at 0)
      cooldown: 5, // Show question cooldown in seconds
      time: 15, // Time to answer in seconds
    },
    ...
  ],
}
```

## 🤔 How to use

- Go to [https://localhost:3000/manager](https://localhost:3000/manager) enter manager password.

- Share link [https://localhost:3000/](https://localhost:3000/) and code on manager screen with your friends and get ready to play.

- Go to [http://localhost:3000/create-quiz](http://localhost:3000/create-quiz) create quiz.

- Once everyone is ready, start the game with button on the top left of the screen of manager.

```js
use rahooQuizDB

db.quizzes.insertOne({
  password: "PASSWORD",
  subject: "Adobe",
  questions: [
    {
      question: "Кто основатели Adobe?",
      answers: [
        "Стив Джобс и Чарльз Гешке",
        "Джон Уорнок и Чарльз Гешке",
        "Джон Джонс и Чарльз Гески",
        "Билл Гейтс"
      ],
      solution: 1,
      cooldown: 5,
      time: 15
    },
    {
      question: "Какое самое известное программное обеспечение Adobe?",
      answers: ["Encore", "AfterEffect", "Creative Cloud", "Photoshop"],
      image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=500&auto=webp",
      solution: 3,
      cooldown: 5,
      time: 15
    },
    {
      question: "Когда была основана Adobe?",
      answers: ["2000", "1982", "2003", "1987"],
      solution: 1,
      cooldown: 5,
      time: 15
    },
    {
      question: "Где находится штаб-квартира Adobe?",
      answers: [
        "Сан-Хосе, Калифорния",
        "Букворм, Каскуи",
        "Даунтаун, Техас",
        "Токио, Япония"
      ],
      solution: 0,
      cooldown: 5,
      time: 15
    },
    {
      question: "Сколько сотрудников работает в Adobe?",
      answers: [
        "15 423 сотрудника",
        "30 803 сотрудника",
        "25 988 сотрудников",
        "5 073 сотрудника"
      ],
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=500&auto=webp",
      solution: 2,
      cooldown: 5,
      time: 15
    },
    {
      question: "Кто текущий генеральный директор Adobe?",
      answers: [
        "Джон Уорнок",
        "Виктор Ньювэй",
        "Марк Ява",
        "Шантану Нарайен"
      ],
      image: "https://images.unsplash.com/photo-1435348773030-a1d74f568bc2?q=80&w=500&auto=webp",
      solution: 3,
      cooldown: 5,
      time: 15
    },
    {
      question: "На чём сосредоточен основной бизнес Adobe?",
      answers: [
        "Креативное ПО",
        "Видеоигры",
        "Логистическое ПО",
        "Другое"
      ],
      image: "https://images.unsplash.com/photo-1582736317407-371893d9e146?q=80&w=500&auto=webp",
      solution: 0,
      cooldown: 5,
      time: 15
    }
  ]
})

```

