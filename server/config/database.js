import sqlite3 from 'sqlite3';
import { join } from 'path';
import { ensureDirectoryExists, removeFileIfExists } from '../utils/db-helpers.js';

const DB_PATH = join(process.cwd(), 'database.sqlite');

export let db = null;

async function cleanupDatabaseFiles() {
  await removeFileIfExists(DB_PATH);
  return true;
}

async function createDatabaseConnection() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(
      DB_PATH,
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Connected to SQLite database');
          resolve(db);
        }
      }
    );
  });
}

async function enableForeignKeys() {
  return new Promise((resolve, reject) => {
    db.run('PRAGMA foreign_keys = ON', (err) => {
      if (err) {
        reject(err);
      } else {
        console.log('Foreign keys enabled');
        resolve();
      }
    });
  });
}

export async function initializeDatabase() {
  console.log('Initializing database...');
  
  try {
    // Ensure database directory exists
    await ensureDirectoryExists(DB_PATH);
    
    // Clean up existing database files
    await cleanupDatabaseFiles();
    console.log('Database cleanup completed');
    
    // Create new database connection
    await createDatabaseConnection();
    console.log('Database connection established');
    
    // Enable foreign keys
    await enableForeignKeys();
    console.log('Database initialization completed successfully');

    return db;
  } catch (err) {
    console.error('Database initialization failed:', err);
    throw err;
  }
}