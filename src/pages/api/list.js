import { connectToDatabase } from "./mongodb"

export default async function handler(req, res) {
  const { db } = await connectToDatabase()

  if (req.method === "GET") {
    try {
      const quizzes = await db
        .collection("quizzes")
        .find({}, { projection: { password: 1, subject: 1, questions: 1 } }) // <-- добавили questions
        .toArray()

      return res.status(200).json(quizzes)
    } catch (error) {
      console.error("Ошибка при получении списка викторин:", error)
      return res.status(500).json({ message: "Ошибка сервера" })
    }
  }

  res.setHeader("Allow", ["GET"])
  return res.status(405).end(`Метод ${req.method} не разрешён`)
}
