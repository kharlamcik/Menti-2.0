import { connectDB } from "@/lib/mongodb"
import Quiz from "@/models/Quiz"

export default async function handler(req, res) {
  await connectDB()

  const { subject } = req.query
  const quiz = await Quiz.findOne({ subject })

  if (!quiz) return res.status(404).json({ error: "Quiz not found" })

  res.status(200).json(quiz)
}
