import express, { Request, Response } from "express";
import dotenv from "dotenv";
import authRouter from "./controllers/auth.controller.js";
import { checkToken, wsCheckToken } from "./middlewares/check-token.js";
import cors from "cors";
import expressWs from "express-ws";
import conversationRouter from "./controllers/conversation.controller.js";
import { chatHandler } from "./chat-ws/chat.websocket.js";
import { selectAll } from "./managers/users.manager.js";
import messageRouter from "./controllers/message.controller.js";

dotenv.config();

const app = express();
expressWs(app);

app.use(express.json());
app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Offline Chat Server is running!");
});

app.get("/print-users", (req: Request, res: Response) => {
  return res.json(selectAll());
});

app.use("/auth", authRouter);
app.use("/conversation", conversationRouter);
app.use("/message", messageRouter);

app.get("/protected-route", checkToken, (req: Request, res: Response) => {
  res.send("You accessed a protected route");
});

app.ws("/chat", wsCheckToken, chatHandler);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
