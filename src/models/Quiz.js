import mongoose from "mongoose"

const questionSchema = new mongoose.Schema({
  question: String,
  answers: [String],
  solution: Number,
  cooldown: Number,
  time: Number,
  image: String,
})

const quizSchema = new mongoose.Schema({
  password: String,
  subject: String,
  questions: [questionSchema],
})

export default mongoose.models.Quiz || mongoose.model("Quiz", quizSchema)
