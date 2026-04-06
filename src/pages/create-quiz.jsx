import React, { useState } from "react"
import QuizForm from "../components/QuizForm/QuizForm"
import QuizListPage from "../components/QuizForm/Qizicki"
import AIQuizGenerator from "../components/QuizForm/AIQuizGenerator"
import CloudinaryLibrary from "../components/QuizForm/CloudinaryLibrary" // ← новый импорт
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import background from "@/assets/e285661a023fb83c8d7f975980422c22.gif"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const CreateQuizPage = () => {
  const [activeTab, setActiveTab] = useState("create")

  const tabs = [
    { id: "create", label: "Создать вручную", icon: "✨" }, // ← новая
    { id: "history", label: "Мои викторины", icon: "📋" },
    { id: "ai", label: "AI Генератор", icon: "🤖" },
    { id: "settings", label: "Настройки", icon: "⚙️" },
  ]

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Полноэкранный фон */}
      <div className="fixed inset-0 -z-10">
        <Image
          src={background}
          alt="background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      </div>

      {/* Хедер со стеклом */}
      <header className="relative z-20 border-b border-white/10 bg-white/5 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-bold text-white shadow-lg">
              M
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Menti
              </h1>
              <p className="-mt-1 text-xs text-gray-300">Live Quizzes</p>
            </div>
          </div>

          <Link
            href="/manager"
            className="rounded-2xl border border-white/10 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/10 active:scale-95"
          >
            🚀 Запустить игру
          </Link>
        </div>
      </header>

      {/* Основной контент */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-20 pt-12">
        {/* Заголовок со стеклом */}
        <div className="mb-12 text-center">
          <div className="mb-8 inline-block rounded-3xl border border-white/10 bg-white/5 px-10 py-6 backdrop-blur-2xl">
            <h2 className="mb-3 text-5xl font-bold tracking-tighter text-white">
              Добро пожаловать в Menti
            </h2>
            <p className="mx-auto max-w-md text-xl text-gray-300">
              Создавай крутые викторины и запускай их в реальном времени
            </p>
          </div>
        </div>

        {/* Табы со стеклом и анимацией активной вкладки */}
        <div className="mb-12 flex justify-center">
          <div className="relative inline-flex rounded-3xl border border-white/10 bg-white/5 p-1.5 shadow-2xl backdrop-blur-2xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex items-center gap-2 rounded-2xl px-8 py-3.5 text-sm font-medium text-gray-300 transition hover:text-white"
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-2xl bg-white"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 text-lg">{tab.icon}</span>
                <span
                  className={`relative z-10 ${
                    activeTab === tab.id ? "text-black" : ""
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Контент с общим стеклянным контейнером */}
        <div className="relative min-h-[650px] overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl">
          <AnimatePresence mode="wait">
            {activeTab === "create" && (
              <motion.div
                key="create"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.35 }}
              >
                <QuizForm />
              </motion.div>
            )}

            {activeTab === "history" && (
              <motion.div
                key="history"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.35 }}
              >
                <QuizListPage />
              </motion.div>
            )}
            {activeTab === "ai" && ( // ← новый блок
              <motion.div
                key="ai"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.35 }}
              >
                <AIQuizGenerator />
              </motion.div>
            )}
            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="min-h-[650px]"
              >
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-white">
                      Библиотека изображений
                    </h2>
                    <p className="mt-1 text-gray-400">
                      Управление всеми загруженными фото в Cloudinary
                    </p>
                  </div>
                </div>

                <CloudinaryLibrary />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={2200}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={3}
        theme="dark"
        style={{
          zIndex: 99999,
          top: "100px", // отступ ниже хедера со стеклом
        }}
        toastClassName="glass-toast" // главный класс для стиля
        bodyClassName="text-base font-medium"
        progressClassName="h-1 bg-white/30" // полоса прогресса в стиле стекла
      />
      {/* Футер */}
      <footer className="relative z-10 py-8 text-center text-sm text-gray-500">
        Made with ❤️ for fun quizzes ·{" "}
        <a
          href="https://github.com/kharlamcik/Menti-2.0"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 underline hover:text-indigo-300"
        >
          GitHub 🐙
        </a>
      </footer>
    </section>
  )
}

export default CreateQuizPage
