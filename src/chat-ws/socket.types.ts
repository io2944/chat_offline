import { PublicUser } from "../models/user.model.js";

export type SocketHeader = "CONNEXION" | "USER_MESSAGE";

export interface UserMessagePayload {
  conversationId: number;
  author: PublicUser;
  message: string;
}

export interface SocketMessage {
  header: SocketHeader;
  payload: any;
}

export interface ConnexionNotif extends SocketMessage {
  header: "CONNEXION";
  payload: PublicUser;
}

export interface UserMessage extends SocketMessage {
  header: "USER_MESSAGE";
  payload: UserMessagePayload;
}
