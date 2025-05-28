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

```js
use rahooQuizDB

db.quizzes.insertOne({
  password: "12312",
  subject: "Шизофриния",
  questions: [
    {
      question: "Кто был первым Хокаге",
      answers: [
        "https://i.pinimg.com/736x/60/1b/d5/601bd58aed221dbe73e2f07b758437e4.jpg",
        "https://i.pinimg.com/736x/d8/7d/b2/d87db20eeb0ea266488b9954311ae6e4.jpg",
        "https://i.pinimg.com/736x/9b/95/73/9b95733748093d801b57fc15d2329ec0.jpg",
        "https://i.pinimg.com/736x/ef/27/ee/ef27ee1f4b6fedfdb9b1ca217876e225.jpg"
      ],
      solution: 0,
      cooldown: 5,
      time: 30,
      image: "https://i.pinimg.com/736x/7d/90/75/7d90754ad2dc243ef2036848ee92cff3.jpg"
    },
    {
      question: "Кто тут девочка без Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞",
      answers: [
        "https://shikimori.one/uploads/poster/characters/75640/main-280dedfc07b624ef117a710a96bbff0c.webp",
        "https://i.pinimg.com/736x/2f/e9/14/2fe91443f263c7e8c2bc458ab87df692.jpg",
        "https://shikimori.one/uploads/poster/characters/95225/main-955d07e592650a39d383003c170cd899.webp",
        "https://shikimori.one/uploads/poster/characters/65645/main-c4abeaf2d97abb78448525363255d8db.webp"
      ],
      solution: 3,
      cooldown: 5,
      time: 15,
      image: ""
    },
    {
      question: "Кто такой тралалело тралала",
      answers: [
        "https://i.pinimg.com/736x/f0/67/d2/f067d2a5a286b6444bac220e67c42c6e.jpg",
        "https://i.pinimg.com/736x/e6/ef/a9/e6efa9935e9788b596919cf40b8a18da.jpg",
        "https://i.pinimg.com/736x/c1/6f/39/c16f3991e3264b4c0652e1a725906b70.jpg",
        "https://i.pinimg.com/736x/17/62/5f/17625f4e41c83401f01a5c94ebf41d47.jpg"
      ],
      solution: 0,
      cooldown: 5,
      time: 30,
      image: ""
    },
    {
      question: "Кто бы завёл OnlyFans, но для духовных практик и проклятий?",
      answers: [
        "https://i.pinimg.com/736x/ef/27/ee/ef27ee1f4b6fedfdb9b1ca217876e225.jpg",
        "https://i.pinimg.com/736x/d3/52/f0/d352f0f5dfbdc4b2731be9273a660b80.jpg",
        "https://i.pinimg.com/736x/a6/21/95/a621952785c01c278abe103f18424b7f.jpg",
        "https://i.pinimg.com/736x/31/da/2f/31da2fc0e9b2c784d15fbe9956b92249.jpg"
      ],
      solution: 1,
      cooldown: 5,
      time: 15,
      image: ""
    },
    {
      question: "Кто из этих персонажей с наибольшей вероятностью завёл бы телеграм-канал \"Как выжить без цели в жизни\"?",
      answers: [
        "Лайт Ягами",
        "Шинджи Икари",
        "Кадзума Сато",
        "Йошикаге Кира"
      ],
      solution: 1,
      cooldown: 5,
      time: 30,
      image: ""
    },
    {
      question: "Сделайие правильный нравственный выбор",
      answers: [
        "Давать детям снюс вместо конфет",
        "Говорить детям что на дне колодца портал в роблокс",
        "Накормить ЧЕРНЫХ детей слабительным и заклеить им жопы",
        "Прийти в прияют и стебать детей что у тебя есть мама"
      ],
      solution: 2,
      cooldown: 5,
      time: 15,
      image: "https://i.pinimg.com/736x/b0/f8/a3/b0f8a330691d7a5ad90be34b35e44cf5.jpg"
    },
    {
      question: "Какой из этих поступков ближе всего к \"True Ending\" славянского аниме?",
      answers: [
        " Заключить пакт с духом Бабы Яги, чтобы сдать ЕГЭ",
        "Посвятить жизнь проклятию гаишников, что лишили тебя прав в Need for Speed",
        " Сброситься с крыши девятиэтажки, потому что \"мать сказала убраться в комнате\"",
        "Превратить ларёк с шавермой в храм древнего бога Хинкалиуса"
      ],
      solution: 0,
      cooldown: 5,
      time: 30,
      image: "https://i.pinimg.com/736x/5a/25/5b/5a255b8c8d2e08d790cf05bbe02e93d9.jpg"
    },
    {
      question: "Как начинается каждая арка в славянском аниме?",
      answers: [
        "Герой просыпается в общаге с закладкой под подушкой и криком «Где я?!»",
        "Бабка на лавке сообщает пророчество в формате сплетни",
        "Ты находишь древний артефакт — майку с надписью «Пивозвар»",
        " Загорается лампочка в подъезде — знак, что пора на рейд в ЖЭК"
      ],
      solution: 1,
      cooldown: 5,
      time: 15,
      image: "https://i.pinimg.com/736x/14/75/c7/1475c7b4db0163efcc40291752d8a2c7.jpg"
    },
    {
      question: "Как выглядит антагонист в славянском аниме-финале?",
      answers: [
        "Чиновник из районной администрации, но у него три глаза и аура коррупции",
        "Призрак электрика, отключающего свет в важный момент",
        "Мутировавший автомат с газировкой, обидевшийся на инфляцию",
        "Заколдованный батя, ушедший за молоком и ставший богом ЖКХ"
      ],
      solution: 3,
      cooldown: 5,
      time: 15,
      image: "https://i.pinimg.com/736x/85/81/8d/85818d64429e6b27b081c073af8d9b11.jpg"
    },
    {
      question: "Напоследок проверка IQ что вас расмешнило",
      answers: [
        "https://i.pinimg.com/736x/ea/f9/83/eaf983aec3e35a7a4c06b163a479e9f2.jpg",
        "https://i.pinimg.com/736x/dd/71/bd/dd71bd3c898d3bb63d6935e4196584a8.jpg",
        "https://i.pinimg.com/736x/cd/09/5b/cd095bce836327360b625808662d60eb.jpg",
        "https://i.pinimg.com/736x/51/31/22/5131225272f1489c0e895eaa2315aa3f.jpg"
      ],
      solution: 1,
      cooldown: 5,
      time: 30,
      image: ""
    }
  ]
});


```
