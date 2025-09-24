import express, { Request, Response } from "express";
import { Message } from "../models/message.model.js";
import { findAllById, createMessage } from "../managers/messages.manager.js";
import { checkToken } from "../middlewares/check-token.js";
import { findAllUserConversations } from "../managers/conversations.manager.js";

const router = express.Router();

// POST /messages - créer un message
router.post("/message", checkToken, (req: Request, res: Response) => {
  const { authorId, conversationId, content } = req.body;
  const authUser = req.currentUser;

  const allConversion = findAllUserConversations(authUser?.id ?? -1);
  const isMember = allConversion?.some(
    (conversation) => conversation.id === conversationId
  );

  if (!isMember)
    return res.status(400).json({ error: "Pas un membre de la conversation" });

  if (!authorId || !conversationId || !content) {
    return res.status(400).json({ error: "Champs requis manquants" });
  }
  const createdAt = new Date().toISOString();
  const message: Message = {
    id: 0,
    authorId,
    conversationId,
    content,
    createdAt,
  };

  const savedMessage = createMessage(message);
  res.status(201).json(savedMessage);
});

// GET /messages/conversation/:id - tous les messages d’une conversation
router.get("/conversation/:id", (req: Request, res: Response) => {
  const conversationId = parseInt(req.params.id);
  const messages = findAllById(conversationId);
  res.json(messages);
});

export default router;
