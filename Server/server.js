import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDb from "./Configs/mongodb.js";
import { clerkWebHooks, stripeWebhooks } from "./Controllers/webHooks.js";
import { clerkMiddleware } from "@clerk/express";
import educatorRouter from "./Routes/educatorRoutes.js";
import connectCloudinary from "./Configs/Cloudinary.js";
import courseRouter from "./Routes/courseRoute.js";
import userRouter from "./Routes/userRouter.js";

//Intialize Express

const app = express();

// connect to db
await connectDb();
//connect to cloudinary
await connectCloudinary();

//middleware
import cors from "cors";

// Your frontend URL deployed on Vercel
const allowedOrigins = ["https://project-lms-frontend-xi.vercel.app"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(clerkMiddleware());

//route

app.get("/", (req, res) => res.send("api working"));
app.post("/clerk", express.json(), clerkWebHooks);
app.use("/api/educator", express.json(), educatorRouter);
app.use("/api/course", express.json(), courseRouter);
app.use("/api/user", express.json(), userRouter);
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

//port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is runing on port ${PORT}`);
});
