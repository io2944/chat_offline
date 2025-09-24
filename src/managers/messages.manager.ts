/**
 * messages.manager.ts handle the table messages
 */

import db from "../database.js";
import { Message } from "../models/message.model.js";

export function findAllById(conversationId: number) {
  return db
    .prepare(
      `
        SELECT id, author_id, conversation_id, content, created_at
        FROM messages
        WHERE conversation_id = @conversation_id
        ORDER BY createdAt ASC
        `
    )
    .all({ conversationId }) as Message[] | undefined;
}

export function createMessage({
  authorId,
  conversationId,
  content,
}: Omit<Message, "id" | "createdAt">): Message {
  const result = db
    .prepare(
      `
      INSERT INTO messages (author_id, conversation_id, content) VALUES (?, ?, ?)
    `
    )
    .run(authorId, conversationId, content);
  const messageId = result.lastInsertRowid as number;

  const createdMessage = db
    .prepare(`SELECT * FROM messages WHERE id = ?`)
    .get(messageId) as Message;

  return createdMessage;
}
