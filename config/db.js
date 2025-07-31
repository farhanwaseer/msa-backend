import mongoose from "mongoose";
import color from "colors";

// Connect to MongoDB
const connectDB = async () => {
  const dbURI = process.env.MONGODB_URI;
  try {
    const conn = await mongoose.connect(dbURI);
    console.log(
      `  MongoDB Connected Successfully! ${conn.connection.host}`.magenta.bold);
  } catch (error) {
    console.log(
      `Error connecting to MongoDB: ${error}`.bgRed.white.bold,
      error
    );
  }
};

export default connectDB;