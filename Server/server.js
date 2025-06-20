import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDb from "./Configs/mongodb.js";
import { clerkWebHooks } from "./Controllers/webHooks.js";

//Intialize Express

const app = express();

// connect to db
await connectDb();

//middleware
app.use(cors());

//route

app.get("/", (req, res) => res.send("api working"));
app.post("/clerk", express.json(), clerkWebHooks);

//port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is runing on port ${PORT}`);
});
