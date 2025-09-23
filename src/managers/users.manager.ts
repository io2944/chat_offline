/**
 * user.manager.ts handle the table users
 */

import db from "../database.js";
import { User } from "../models/user.model.js";

export function findUserByUsername(username: string): User | undefined {
  return db
    .prepare(
      `
      SELECT * FROM users
      WHERE username = ? COLLATE NOCASE
    `
    )
    .get(username) as User | undefined;
}

export function findUserById(id: number): User | void {
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
export function createUser({ username, password }: Omit<User, "id">): void {
  db.prepare(
    `
      INSERT INTO users (username, password) VALUES (?, ?)
    `
  ).run(username, password);
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
