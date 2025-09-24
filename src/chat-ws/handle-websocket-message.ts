import { isUserInConversation } from "../managers/conversations.manager.js";
import { createMessage } from "../managers/messages.manager.js";
import { PublicUser } from "../models/user.model.js";
import { SocketMessage } from "./socket.types.js";
import type { WebSocket } from "ws";

export const handleWsMessage = (
  socketMessage: SocketMessage,
  currentUser: PublicUser,
  userSocket: Map<number, WebSocket>
) => {
  switch (socketMessage.header) {
    case "USER_MESSAGE":
      const payload = socketMessage.payload;
      if (!isUserInConversation(payload.conversationId, currentUser.id)) {
        return;
      }

      // createMessage({
      //   authorId: currentUser.id,
      //   conversationId
      // });
      break;
    case "CONNEXION":
      break;
  }
};
