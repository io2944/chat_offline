import { PublicUser } from "../models/user.model.js";

export type SocketType = "CONNEXION" | "USER_MESSAGE";

export interface UserMessagePayload {
  conversationId: number;
  author: PublicUser;
  message: string;
}

interface BaseSocketMessage<T extends SocketType, P> {
  type: T;
  payload: P;
}

export type ConnexionNotif = BaseSocketMessage<"CONNEXION", PublicUser>;
export type UserMessage = BaseSocketMessage<"USER_MESSAGE", UserMessagePayload>;

// Union of all socket messages
export type SocketMessage = ConnexionNotif | UserMessage;
