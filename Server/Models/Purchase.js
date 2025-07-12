import mongoose, { Schema } from "mongoose";

const PurchaseSchema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    userId: {
      type: String, // Clerk ID (string)
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Purchase =
  mongoose.models.Purchase || mongoose.model("Purchase", PurchaseSchema);
