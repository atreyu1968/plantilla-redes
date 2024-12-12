import express from 'express';
import { db } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Generic import handler
const handleImport = (table, requiredFields) => async (req, res) => {
  const { data } = req.body;
  
  if (!Array.isArray(data)) {
    return res.status(400).json({ error: 'Invalid data format' });
  }

  try {
    // Begin transaction
    await new Promise((resolve, reject) => {
      db.run('BEGIN TRANSACTION', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    for (const row of data) {
      // Validate required fields
      const missingFields = requiredFields.filter(field => !row[field]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Insert row
      const fields = Object.keys(row);
      const values = fields.map(field => row[field]);
      const sql = `INSERT INTO ${table} (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`;
      
      await new Promise((resolve, reject) => {
        db.run(sql, values, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    // Commit transaction
    await new Promise((resolve, reject) => {
      db.run('COMMIT', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({ message: 'Import successful' });
  } catch (err) {
    // Rollback on error
    await new Promise((resolve) => {
      db.run('ROLLBACK', resolve);
    });
    
    res.status(400).json({ error: err.message });
  }
};

// Import routes for each entity
router.post('/networks/import', authenticateToken, handleImport('redes', ['codigo', 'nombre']));
router.post('/centers/import', authenticateToken, handleImport('centros', ['codigo', 'nombre']));
router.post('/families/import', authenticateToken, handleImport('familias_profesionales', ['codigo', 'nombre']));
router.post('/departments/import', authenticateToken, handleImport('departamentos', ['codigo', 'nombre']));
router.post('/objectives/import', authenticateToken, handleImport('objetivos', ['codigo', 'nombre', 'tipo']));
router.post('/ods/import', authenticateToken, handleImport('ods', ['codigo', 'nombre']));

export default router;