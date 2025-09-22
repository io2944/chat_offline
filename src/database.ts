import Database from "better-sqlite3";

const db = new Database(process.env.dbPath, {
  verbose: console.log,
});

// Create messages table if it doesn't exist
const initDatabase = () => {
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL
    );`
  ).run();
  db.prepare(
    `
    CREATE TABLE messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author_id INTEGER NOT NULL,
      conversation_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE);
    `
  ).run();
  db.prepare(
    `
    CREATE TABLE conversation_has_users (
      conversation_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      PRIMARY KEY (conversation_id, user_id),
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
    `
  ).run();
  db.prepare(
    `
    CREATE TABLE conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      is_group BOOLEAN NOT NULL DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`
  ).run();
};

initDatabase();
export default db;
