import { db } from '../config/database.js';
import bcrypt from 'bcryptjs';

export const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123',
  email: 'admin@example.com',
  role: 'admin',
  firstName: 'Admin',
  lastName: 'User'
};

export async function initializeDatabase() {
  console.log('Initializing database...');
  
  return new Promise(async (resolve, reject) => {
    db.serialize(async () => {
      try {
        // Drop existing tables if they exist
        const tables = ['users', 'centers', 'networks', 'network_centers'];
        for (const table of tables) {
          try {
            await runQuery(`DROP TABLE IF EXISTS ${table}`);
          } catch (err) {
            console.warn(`Warning: Could not drop table ${table}:`, err);
          }
        }

        // Users table
        await runQuery(`CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          first_name TEXT,
          last_name TEXT,
          username TEXT UNIQUE NOT NULL,
          medusa_code TEXT,
          phone TEXT,
          password TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          role TEXT NOT NULL,
          avatar_url TEXT,
          bio TEXT,
          status TEXT DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          center TEXT
        )`);

        // Create default admin user if it doesn't exist
        const adminPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
        await runQuery(`INSERT OR IGNORE INTO users (
          username,
          password,
          email,
          role,
          first_name,
          last_name,
          status,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [
          DEFAULT_ADMIN.username,
          adminPassword,
          DEFAULT_ADMIN.email,
          DEFAULT_ADMIN.role,
          DEFAULT_ADMIN.firstName,
          DEFAULT_ADMIN.lastName,
          'active'
        ]);

        // Centers table
        await runQuery(`CREATE TABLE IF NOT EXISTS centers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          status TEXT DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Networks table
        await runQuery(`CREATE TABLE IF NOT EXISTS networks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          center_sede_id INTEGER,
          status TEXT DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (center_sede_id) REFERENCES centers(id)
        )`);

        // Network Centers (junction table for associated centers)
        await runQuery(`CREATE TABLE IF NOT EXISTS network_centers (
          network_id INTEGER,
          center_id INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (network_id, center_id),
          FOREIGN KEY (network_id) REFERENCES networks(id),
          FOREIGN KEY (center_id) REFERENCES centers(id)
        )`);

        console.log('Database initialization completed');
        console.log('Default admin user created/updated:');
        console.log(`Username: ${DEFAULT_ADMIN.username}`);
        console.log(`Password: ${DEFAULT_ADMIN.password}`);
        
        resolve();
      } catch (error) {
        console.error('Error during database initialization:', error);
        console.error('Stack trace:', error.stack);
        reject(error);
      }
    });
  });
}

function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        console.error('Error executing query:', sql);
        console.error('Error details:', err);
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}