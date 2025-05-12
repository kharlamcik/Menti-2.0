import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  subject: String,
  password: String,
  questions: [
    {
      question: String,
      answers: [String],
      solution: Number,
      cooldown: Number,
      time: Number,
    },
  ],
});


const Test = mongoose.model("Test", testSchema);

export default Test;
