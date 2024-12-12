import { db } from '../../../config/database.js';

export async function createPasswordHistoryTable() {
  return new Promise((resolve, reject) => {
    db.run(`
    CREATE TABLE IF NOT EXISTS password_history (
      id_historial INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE
    )`, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}