import { connectToDatabase } from './mongodb';

export default async function handler(req, res) {
  const { password, subject, questions } = req.body;
  const { db } = await connectToDatabase();

  await db.collection('quizzes').updateOne(
    { password, subject },
    { $set: { questions } },
    { upsert: true }
  );

  res.status(200).json({ message: 'Quiz saved' });
}
