import { db } from '../../../config/database.js';
import { runQuery } from '../../../utils/db-helpers.js';

export async function createRegistrationCodesTable() {
  return runQuery(db, `
    CREATE TABLE IF NOT EXISTS registration_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code VARCHAR(50) UNIQUE NOT NULL,
      role_id INTEGER NOT NULL,
      center_id INTEGER,
      network_id INTEGER,
      uses_allowed INTEGER NOT NULL DEFAULT 1,
      current_uses INTEGER NOT NULL DEFAULT 0,
      expiration_date DATETIME NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (role_id) REFERENCES roles(id),
      FOREIGN KEY (center_id) REFERENCES centers(id),
      FOREIGN KEY (network_id) REFERENCES networks(id)
    )
  `);
}