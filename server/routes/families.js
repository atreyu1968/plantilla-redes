import express from 'express';
import { db } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all families
router.get('/', authenticateToken, (req, res) => {
  db.all('SELECT * FROM familias_profesionales ORDER BY nombre', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create new family
router.post('/', authenticateToken, (req, res) => {
  const { code, name, description } = req.body;

  if (!code || !name) {
    res.status(400).json({ error: 'Código y nombre son requeridos' });
    return;
  }

  db.run(
    'INSERT INTO familias_profesionales (codigo, nombre, descripcion) VALUES (?, ?, ?)',
    [code, name, description],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          res.status(400).json({ error: 'El código ya existe' });
        } else {
          res.status(400).json({ error: err.message });
        }
        return;
      }
      res.json({
        id: this.lastID,
        message: 'Familia profesional creada exitosamente'
      });
    }
  );
});

// Update family
router.put('/:id', authenticateToken, (req, res) => {
  const { code, name, description } = req.body;
  
  if (!code || !name) {
    res.status(400).json({ error: 'Código y nombre son requeridos' });
    return;
  }

  db.run(
    `UPDATE familias_profesionales 
     SET codigo = ?, nombre = ?, descripcion = ?
     WHERE id = ?`,
    [code, name, description, req.params.id],
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Familia profesional no encontrada' });
        return;
      }
      res.json({ message: 'Familia profesional actualizada exitosamente' });
    }
  );
});

// Delete family
router.delete('/:id', authenticateToken, (req, res) => {
  db.run(
    'DELETE FROM familias_profesionales WHERE id = ?',
    [req.params.id],
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Familia profesional no encontrada' });
        return;
      }
      res.json({ message: 'Familia profesional eliminada exitosamente' });
    }
  );
});

export default router;