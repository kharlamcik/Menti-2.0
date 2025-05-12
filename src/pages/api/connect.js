import { connectToDatabase } from './mongodb';

export default async function handler(req, res) {
  try {
    const { password, subject } = req.body;
    const { db } = await connectToDatabase();

    const existing = await db.collection('quizzes').findOne({ password, subject });

    if (existing) {
      res.status(200).json({ found: true, quiz: existing });
    } else {
      const newQuiz = { password, subject, questions: [] };
      await db.collection('quizzes').insertOne(newQuiz);
      res.status(200).json({ found: false, quiz: newQuiz });
    }
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при подключении к базе данных', error: error.message });
  }
}
