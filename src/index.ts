import express, { Request, Response } from "express";
import dotenv from "dotenv";
import authRouter from "./controllers/auth.controller.js";
import { checkToken } from "./middlewares/check-token.js";
import cors from "cors";
import expressWs from "express-ws";

dotenv.config();

const app = express();
expressWs(app);

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONT_URL,
    credentials: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Offline Chat Server is running!");
});

app.use("/auth", authRouter);

app.get("/protected-route", checkToken, (req: Request, res: Response) => {
  res.send("You accessed a protected route");
});

app.ws("/chat");

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
