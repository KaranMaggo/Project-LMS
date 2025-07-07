import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    Completed: { type: Boolean, default: false },
    lectureCompleted: [],
  },
  { minimise: false }
);

export const courseProgress = mongoose.model(
  "CourseProgress",
  courseProgressSchema
);
