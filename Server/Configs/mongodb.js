import mongoose from "mongoose";

// connect to mongodb database

const connectDb = async () => {
  mongoose.connection.on("connected", () => console.log("database connected"));
  mongoose.connection.on("error", (err) =>
    console.error("MongoDB connection error:", err)
  );
  await mongoose.connect(`${process.env.MONGODB_URI}/LMS`);
};

export default connectDb;
