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

   Если вы хотите, чтобы клиент подключался напрямую к серверу веб-сокета, отредактируйте файл [config.mjs](config.mjs) и измените localhost на свой публичный IP-адрес.

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


