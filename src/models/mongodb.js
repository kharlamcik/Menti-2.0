// src/models/mongodb.js
import mongoose from "mongoose"

const MONGODB_URI = "mongodb://localhost:27017/rahooQuizDB"

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return

  try {
    await mongoose.connect(MONGODB_URI)
    console.log("🟢 MongoDB connected to rahooQuizDB")
  } catch (error) {
    console.error("🔴 MongoDB connection error:", error)
  }
}
