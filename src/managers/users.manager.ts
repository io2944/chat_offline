/**
 * user.manager.ts handle the table users
 */

import db from "../database.js";
import { PublicUser, User } from "../models/user.model.js";

export function selectAll(): User[] {
  return db
    .prepare(
      `
      SELECT * FROM users
    `
    )
    .all() as User[];
}

export function findUserByUsername(username: string): User | undefined {
  return db
    .prepare(
      `
      SELECT * FROM users
      WHERE username = ?
    `
    )
    .get(username) as User | undefined;
}

export function findUserById(id: number): User | undefined {
  return db
    .prepare(
      `
      SELECT * FROM users
      WHERE id = ? 
    `
    )
    .get(id) as User | undefined;
}

/**
 * create a user
 * @param param0 user with hashed password
 */
export function createUser({
  username,
  password,
}: Omit<User, "id">): PublicUser | undefined {
  const result = db
    .prepare(
      `
      INSERT INTO users (username, password) VALUES (?, ?)
    `
    )
    .run(username, password);
  const userId = result.lastInsertRowid as number;
  return findUserById(userId);
}

export function updateUser(user: User): void {
  const { id, username, password } = user;
  db.prepare(
    `
      UPDATE users
      SET username= @username, password = @password
      WHERE id = @id
    `
  ).run(user);
}

export function deleteUser(id: number): void {
  db.prepare(
    `
    DELETE FROM users
    WHERE id = ?
  `
  ).run(id);
}
export function getUncontactedUsersOf(
  currentUserId: number,
  withPassword: true
): User[];
export function getUncontactedUsersOf(
  currentUserId: number,
  withPassword?: false
): PublicUser[];
export function getUncontactedUsersOf(
  currentUserId: number,
  withPassword: boolean = false
): User[] | PublicUser[] {
  const returnedColumns = withPassword ? "*" : "id, username";

  const stmt = db.prepare(`
    SELECT ${returnedColumns}
    FROM users u
    WHERE u.id != @currentUserId
      AND u.id NOT IN (
        SELECT cu.user_id
        FROM conversation_has_users cu
        JOIN conversations c ON cu.conversation_id = c.id
        WHERE c.is_group = 0
          AND cu.conversation_id IN (
            SELECT conversation_id
            FROM conversation_has_users
            WHERE user_id = @currentUserId
          )
      )
  `);

  return stmt.all({ currentUserId: currentUserId }) as User[] | PublicUser[];
}
