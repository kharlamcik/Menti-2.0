import React, { useState } from "react";
import QuizForm from "../components/QuizForm/QuizForm";
import QuizListPage from "../components/QuizForm/Qizicki";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import background from "@/assets/e285661a023fb83c8d7f975980422c22.gif";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateQuizPage = () => {
  const [activeTab, setActiveTab] = useState("create");

  const tabs = [
    { id: "create", label: "Создать викторину", icon: "✨" },
    { id: "history", label: "Мои викторины", icon: "📋" },
    { id: "settings", label: "Настройки", icon: "⚙️" },
  ];

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
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              M
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Menti</h1>
              <p className="text-xs text-gray-300 -mt-1">Live Quizzes</p>
            </div>
          </div>

          <Link
            href="/manager"
            className="px-6 py-2.5 text-sm font-medium text-white hover:bg-white/10 rounded-2xl transition-all active:scale-95 border border-white/10"
          >
            🚀 Запустить игру
          </Link>
        </div>
      </header>

      {/* Основной контент */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-12 pb-20">
        {/* Заголовок со стеклом */}
        <div className="text-center mb-12">
          <div className="inline-block bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl px-10 py-6 mb-8">
            <h2 className="text-5xl font-bold text-white mb-3 tracking-tighter">
              Добро пожаловать в Menti
            </h2>
            <p className="text-xl text-gray-300 max-w-md mx-auto">
              Создавай крутые викторины и запускай их в реальном времени
            </p>
          </div>
        </div>

        {/* Табы со стеклом и анимацией активной вкладки */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white/5 backdrop-blur-2xl rounded-3xl p-1.5 border border-white/10 shadow-2xl relative">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative px-8 py-3.5 rounded-2xl font-medium flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white rounded-2xl"
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
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 min-h-[650px] shadow-2xl relative overflow-hidden">
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

            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center h-[500px] text-center"
              >
                <div className="text-6xl mb-6">⚙️</div>
                <h3 className="text-3xl font-semibold text-white mb-4">Настройки</h3>
                <p className="text-gray-400 text-lg max-w-md">
                  Здесь скоро появятся настройки аккаунта, темы и другие параметры
                </p>
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
          top: "100px",           // отступ ниже хедера со стеклом
        }}
        toastClassName="glass-toast"           // главный класс для стиля
        bodyClassName="text-base font-medium"
        progressClassName="h-1 bg-white/30"    // полоса прогресса в стиле стекла
      />
      {/* Футер */}
      <footer className="relative z-10 text-center py-8 text-gray-500 text-sm">
        Made with ❤️ for fun quizzes
      </footer>
      
      

    </section>
  );
};

export default CreateQuizPage;