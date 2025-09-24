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

  const insertConversation = db.prepare(`
    INSERT INTO conversations (is_group, created_at)
    VALUES (@is_group, @created_at)
  `);

  const insertMember = db.prepare(`
    INSERT INTO conversation_has_users (conversation_id, user_id)
    VALUES (@conversation_id, @user_id)
  `);

  const createTx = db.transaction((ids: number[]) => {
    // 1. Créer la conversation
    const result = insertConversation.run({
      is_group: isGroup,
      created_at: createdAt,
    });
    const conversationId = result.lastInsertRowid as number;

    // 2. Ajouter les membres
    for (const userId of ids) {
      insertMember.run({ conversation_id: conversationId, user_id: userId });
    }

    // 3. Retourner la conversation créée
    return {
      id: conversationId,
      isGroup,
      createdAt,
    } as Conversation;
  });

  return createTx(userIds);
}
