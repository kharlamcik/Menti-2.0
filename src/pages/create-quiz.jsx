import React, { useState } from 'react';
import QuizForm from '../components/QuizForm/QuizForm';
import styles from '../components/QuizForm/QuizForm.module.css'; // Подключаем модуль стилей
import Image from 'next/image';
import background from '@/assets/e285661a023fb83c8d7f975980422c22.gif'; // Подключаем изображение фона
import Link from 'next/link'; // Импортируем компонент Link

const CreateQuizPage = () => {
  const [activeTab, setActiveTab] = useState('create');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center">
      {/* Фон и затемнение */}
      <div className="absolute left-0 top-0 -z-10 h-full w-full bg-black opacity-40" />
      <div className="absolute left-0 top-0 -z-20 h-full w-full bg-fixed bg-cover opacity-90" style={{ backgroundImage: `url(${background.src})` }} />
      
      <div className={styles.background} style={{ minWidth: '578px' }}>
        {/* Меню для переключения вкладок */}
        <div className="mb-6">
          <ul className="flex space-x-6 justify-center">
            <li
              className={`cursor-pointer ${activeTab === 'create' ? 'text-blue-500 font-bold' : 'text-white'}`}
              onClick={() => handleTabClick('create')}
            >
              Создание викторины
            </li>
            <li
              className={`cursor-pointer ${activeTab === 'history' ? 'text-blue-500 font-bold' : 'text-white'}`}
              onClick={() => handleTabClick('history')}
            >
              История
            </li>
            <li
              className={`cursor-pointer ${activeTab === 'settings' ? 'text-blue-500 font-bold' : 'text-white'}`}
              onClick={() => handleTabClick('settings')}
            >
              Настройки
            </li>
            {/* Кнопка для перехода */}
            <li className={`cursor-pointer ${activeTab === 'settings' ? 'text-blue-500 font-bold' : 'text-white'}`}>
              <Link href="/manager">Перейти к менеджеру</Link>
            </li>
          </ul>
        </div>

        {/* Контент в зависимости от выбранной вкладки */}
        <h1 className="mb-6 text-center text-2xl text-white font-bold">
          {activeTab === 'create' && 'Панель менеджера: Создание викторины'}
          {activeTab === 'history' && 'История викторин'}
          {activeTab === 'settings' && 'Настройки'}
          {activeTab === 'men' && 's'}
        </h1>

        {/* Формы или компоненты для каждой вкладки */}
        {activeTab === 'create' && <QuizForm />}
        {activeTab === 'history' && <div>История викторин</div>}
        {activeTab === 'settings' && <div>Настройки</div>}
      </div>
    </section>
  );
};

export default CreateQuizPage;
