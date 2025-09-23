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

export function findUserById(id: number): User | void {}

/**
 * create a user
 * @param param0 user with hashed password
 */
export function createUser({
  username,
  password,
}: Omit<User, "id">): User | void {}

export function updateUser(user: Partial<User>): void {}
