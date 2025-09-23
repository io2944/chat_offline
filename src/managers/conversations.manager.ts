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
