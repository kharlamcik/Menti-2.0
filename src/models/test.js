import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  title: String,
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: String,
    },
  ],
});

const Test = mongoose.model("Test", testSchema);

export default Test;
