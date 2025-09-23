/**
 * conversations.manager.ts handle the table conversations
 */

import db from "../database.js";
import { Conversation } from "../models/conversation.model.js";

export function findAllUserConversations(
  userId: number
): Conversation[] | undefined {
  return db
    .prepare(
      `
    SELECT c.id, c.is_group, c.created_at
    FROM conversations c
    JOIN conversation_has_users cu ON c.id = cu.conversation_id
    WHERE cu.user_id = @currentUserId
    ORDER BY c.created_at DESC
  `
    )
    .all({ userId }) as Conversation[] | undefined;
}

export function createConversation(userIds: number[]): Conversation {
  const isGroup = userIds.length > 2;
  const createdAt = new Date().toISOString();

  // 1. Créer la conversation
  const insertConversation = db.prepare(`
    INSERT INTO conversations (is_group, created_at)
    VALUES (@is_group, @created_at)
  `);
  const result = insertConversation.run({ isGroup, createdAt });
  const conversationId = result.lastInsertRowid as number;

  // 2. Ajouter les membres
  const insertMember = db.prepare(`
    INSERT INTO conversation_has_users (conversation_id, user_id)
    VALUES (@conversation_id, @user_id)
  `);
  const insertMany = db.transaction((ids: number[]) => {
    for (const userId of ids) {
      insertMember.run({ conversationId, userId });
    }
  });
  insertMany(userIds);

  // 3. Retourner la conversation créée
  return {
    id: conversationId,
    isGroup,
    createdAt,
  };
}
