import { db } from '../../../config/database.js';

export async function createUsersTable() {
  return new Promise((resolve, reject) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        medusa_code TEXT,
        phone TEXT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role_id INTEGER NOT NULL,
        last_password_change TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        password_expires TIMESTAMP,
        failed_attempts INTEGER DEFAULT 0,
        locked BOOLEAN DEFAULT 0,
        lock_date TIMESTAMP,
        registration_code TEXT,
        center_id INTEGER,
        network_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id),
        FOREIGN KEY (center_id) REFERENCES centers(id),
        FOREIGN KEY (network_id) REFERENCES networks(id)
      )
    `, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}