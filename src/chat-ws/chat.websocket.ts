import { Router, Request } from "express";
import { wsCheckToken } from "../middlewares/check-token.js";
import { ensureCurrentUser } from "../utils/require-current-user.js";
import type { WebSocket } from "ws";
import { handleWsMessage } from "./handle-websocket-message.js";
import { SocketMessage } from "./socket.types.js";

const wsRouter = Router();

const userSockets = new Map<number, WebSocket>();

const chatHandler = (ws: WebSocket, req: Request) => {
  const authRequest = ensureCurrentUser(req);
  console.log("User connected:", authRequest.currentUser.username);
  userSockets.set(authRequest.currentUser.id, ws);

  ws.on("message", (msg: string) => {
    try {
      ensureCurrentUser(req);
    } catch (e) {
      userSockets.delete(authRequest.currentUser.id);
      ws.close(1008, "Unauthorized");
    }

    const socketMessage = JSON.parse(msg) as SocketMessage;

    handleWsMessage(socketMessage);
  });

  ws.on("close", () => {
    userSockets.delete(authRequest.currentUser.id);
    console.log(`${authRequest.currentUser.username} disconnected`);
  });
};

wsRouter.ws("/chat", wsCheckToken, chatHandler);

export default wsRouter;
