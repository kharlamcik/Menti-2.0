import { connectToDatabase } from './mongodb';

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const { password } = req.query;

  if (req.method === 'GET') {
    // Если запрос GET, ищем викторину по паролю
    try {
      const quiz = await db.collection('quizzes').findOne({ password });

      if (quiz) {
        // Если викторина найдена, возвращаем её
        res.status(200).json(quiz);
      } else {
        // Если викторина не найдена, возвращаем ошибку
        res.status(404).json({ message: 'Викторина не найдена' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка при поиске викторины' });
    }
  } else if (req.method === 'POST') {
    // Если запрос POST, создаем или обновляем викторину
    try {
      const quiz = req.body;

      // Проверяем, существует ли викторина с таким паролем
      const existingQuiz = await db.collection('quizzes').findOne({ password });

      if (existingQuiz) {
        // Если викторина с таким паролем уже существует, обновляем её
        const result = await db.collection('quizzes').updateOne(
          { password },
          { $set: quiz }
        );
        res.status(200).json(result);
      } else {
        // Если викторина не найдена, просто добавляем новую
        const result = await db.collection('quizzes').insertOne(quiz);
        res.status(201).json(result);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка при создании или обновлении викторины' });
    }
  } else {
    res.status(405).end(); // Метод не разрешен
  }
}
