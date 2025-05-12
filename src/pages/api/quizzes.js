import { connectToDatabase } from './mongodb';

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  if (req.method === 'GET') {
    const { password } = req.query;

    if (!password) {
      return res.status(400).json({ message: 'Пароль не указан' });
    }

    try {
      const quiz = await db.collection('quizzes').findOne({ password });

      if (quiz) {
        return res.status(200).json(quiz);
      } else {
        return res.status(404).json({ message: 'Викторина не найдена' });
      }
    } catch (error) {
      console.error('Ошибка при поиске викторины:', error);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  if (req.method === 'POST') {
    const quiz = req.body;

    if (!quiz || !quiz.password || !quiz.subject || !Array.isArray(quiz.questions)) {
      return res.status(400).json({ message: 'Некорректные данные викторины' });
    }

    try {
      const result = await db.collection('quizzes').updateOne(
        { password: quiz.password },
        { $set: quiz },
        { upsert: true } // создаст, если не существует
      );

      return res.status(200).json({
        message: 'Викторина сохранена',
        upserted: result.upsertedCount > 0,
        modified: result.modifiedCount > 0,
      });
    } catch (error) {
      console.error('Ошибка при сохранении викторины:', error);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Метод ${req.method} не разрешён`);
}
