import {
  getUsersInConversation,
  isUserInConversation,
} from "../managers/conversations.manager.js";
import { createMessage } from "../managers/messages.manager.js";
import { PublicUser } from "../models/user.model.js";
import { SocketMessage } from "./socket.types.js";
import type { WebSocket } from "ws";

export const handleWsMessage = (
  socketMessage: SocketMessage,
  currentUser: PublicUser,
  userSocket: Map<number, WebSocket>
) => {
  switch (socketMessage.type) {
    case "USER_MESSAGE":
      const payload = socketMessage.payload;
      if (!isUserInConversation(payload.conversationId, currentUser.id)) {
        return;
      }
      const message = createMessage({
        authorId: currentUser.id,
        conversationId: payload.conversationId,
        content: payload.message,
      });

      const recievers = getUsersInConversation(payload.conversationId);
      recievers.forEach((reciever) => {
        if (userSocket.has(reciever.id)) {
          userSocket.get(reciever.id)?.send(JSON.stringify(message));
        }
      });
      break;
    case "CONNEXION":
      break;
  }
};
