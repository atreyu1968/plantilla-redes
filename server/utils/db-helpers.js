import fs from 'fs';
import { dirname } from 'path';

export async function ensureDirectoryExists(path) {
  const dir = dirname(path);
  if (!fs.existsSync(dir)) {
    await fs.promises.mkdir(dir, { recursive: true });
    console.log('Directory created:', dir);
  }
}

export async function removeFileIfExists(path) {
  try {
    if (fs.existsSync(path)) {
      await fs.promises.unlink(path);
      console.log('File removed:', path);
    }
  } catch (err) {
    console.error(`Error removing file ${path}:`, err);
    throw err;
  }
}

export function runQuery(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      console.log('Executing SQL:', sql);
      if (err) {
        console.error('Error executing query:', sql);
        console.error('Error details:', err);
        reject(err);
      } else {
        console.log('Query executed successfully');
        resolve(this);
      }
    });
  });
}