import React, { useState } from "react"
import QuizForm from "../components/QuizForm/QuizForm"
import QuizListPage from "../components/QuizForm/Qizicki" // проверь правильный путь!

import styles from "../components/QuizForm/QuizForm.module.css" // Подключаем модуль стилей
import Image from "next/image"
import background from "@/assets/e285661a023fb83c8d7f975980422c22.gif" // Подключаем изображение фона
import Link from "next/link" // Импортируем компонент Link

const CreateQuizPage = () => {
  const [activeTab, setActiveTab] = useState("create")

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-start ">
      {/* Фон и затемнение */}
      <div className="absolute left-0 top-0 -z-10 h-full w-full bg-black opacity-40" />
      <div
        className="absolute left-0 top-0 -z-20 h-full w-full bg-cover bg-fixed opacity-90"
        style={{ backgroundImage: `url(${background.src})` }}
      />

      <div className={styles.background} style={{ minWidth: "578px" }}>
        {/* Меню для переключения вкладок */}
        <div className="mb-6 mt-4 ">
          <ul className="flex justify-center space-x-6 ">
            <li
              className={`cursor-pointer ${activeTab === "create" ? "font-bold text-blue-500" : "text-white"}`}
              onClick={() => handleTabClick("create")}
            >
              Создание викторины
            </li>
            <li
              className={`cursor-pointer ${activeTab === "history" ? "font-bold text-blue-500" : "text-white"}`}
              onClick={() => handleTabClick("history")}
            >
              Все викторины
            </li>
            <li
              className={`cursor-pointer ${activeTab === "settings" ? "font-bold text-blue-500" : "text-white"}`}
              onClick={() => handleTabClick("settings")}
            >
              Настройки
            </li>
            {/* Кнопка для перехода */}
            <li
              className={`cursor-pointer ${activeTab === "settings" ? "font-bold text-blue-500" : "text-white"}`}
            >
              <Link href="/manager">Перейти к менеджеру</Link>
            </li>
          </ul>
        </div>

        {/* Контент в зависимости от выбранной вкладки */}
        <h1 className="mb-6 text-center text-2xl font-bold text-white">
          {activeTab === "settings" && "Настройки"}
          {activeTab === "men" && "s"}
        </h1>

        {/* Формы или компоненты для каждой вкладки */}
        {activeTab === "create" && <QuizForm />}
        {activeTab === "history" && <QuizListPage />}
        {activeTab === "settings" && <div>Настройки</div>}
      </div>
    </section>
  )
}

export default CreateQuizPage
