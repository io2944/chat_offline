/**
 * messages.manager.ts handle the table messages
 */

import db from "../database.js";
import { Message } from "../models/message.model.js";
import { PublicUser } from "../models/user.model.js";

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

export interface MessageWithAuthor {
  id: number;
  content: string;
  created_at: string;
  author: PublicUser;
}

export function findAllByIdWithAuthor(
  conversationId: number
): MessageWithAuthor[] {
  const stmt = db.prepare(`
      SELECT
        m.id AS message_id,
        m.content,
        m.created_at,
        json_object(
          'id', u.id,
          'username', u.username
          ) AS author
      FROM messages m
      JOIN users u ON m.user_id = u.id
      WHERE m.conversation_id = @conversation_id
      ORDER BY m.created_at ASC;
      `);
  return stmt.all({ conversation_id: conversationId }) as MessageWithAuthor[];
}
