import React from 'react';
import QuizForm from '../components/QuizForm/QuizForm';
import styles from '../components/QuizForm/QuizForm.module.css'; // Подключаем модуль стилей

const CreateQuizPage = () => {
  return (
    
    <div className={styles.background}>
      <h1 className={styles.title}>Панель менеджера: Создание викторины</h1>
      <QuizForm />
    </div>
    
    
  );
};

export default CreateQuizPage;
