import { PublicUser } from "../models/user.model.js";

export type SocketHeader = "CONNEXION" | "USER_MESSAGE";

export interface UserMessagePayload {
  conversationId: number;
  author: PublicUser;
  message: string;
}

interface BaseSocketMessage<H extends SocketHeader, P> {
  header: H;
  payload: P;
}

export type ConnexionNotif = BaseSocketMessage<"CONNEXION", PublicUser>;
export type UserMessage = BaseSocketMessage<"USER_MESSAGE", UserMessagePayload>;

// Union of all socket messages
export type SocketMessage = ConnexionNotif | UserMessage;
