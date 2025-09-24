/**
 * conversations.manager.ts handle the table conversations
 */

import db from "../database.js";
import { Conversation } from "../models/conversation.model.js";
import { PublicUser } from "../models/user.model.js";

export function findAllUserConversations(userId: number): Conversation[] {
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
    .all({ userId }) as Conversation[];
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
    const result = insertConversation.run({
      is_group: isGroup,
      created_at: createdAt,
    });
    const conversationId = result.lastInsertRowid as number;

    for (const userId of ids) {
      insertMember.run({ conversation_id: conversationId, user_id: userId });
    }

    return {
      id: conversationId,
      isGroup,
      createdAt,
    } as Conversation;
  });

  return createTx(userIds);
}

export function isUserInConversation(
  conversationId: number,
  userId: number
): boolean {
  const stmt = db.prepare(`
    SELECT 1
    FROM conversation_has_users
    WHERE conversation_id = @conversationId
      AND user_id = @userId
    LIMIT 1
  `);

  const result = stmt.get({ conversationId, userId });
  return !!result;
}

export function getUsersInConversation(conversationId: number): PublicUser[] {
  const stmt = db.prepare(`
    SELECT u.id, u.username
    FROM users u
    JOIN conversation_has_users cu ON u.id = cu.user_id
    WHERE cu.conversation_id = @conversationId
  `);

  return stmt.all({ conversationId }) as PublicUser[];
}
