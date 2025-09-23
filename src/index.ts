import express, { Request, Response } from "express";
import dotenv from "dotenv";
import authRouter from "./controllers/auth.controller.js";

const app = express();
const PORT = 3000;
dotenv.config();

// Middleware
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Offline Chat Server is running!");
});

app.use("/auth", authRouter);

app.get("/");
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
