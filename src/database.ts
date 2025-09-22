import Database from "better-sqlite3";

const db = new Database(process.env.dbPath);

// Create messages table if it doesn't exist
const initDatabase = () => {
  db.prepare(
    `
  CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
  )
`
  ).run();
};

initDatabase();
export default db;
