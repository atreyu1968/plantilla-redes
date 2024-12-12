import express from 'express';
import { db } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all departments
router.get('/', authenticateToken, (req, res) => {
  db.all(`
    SELECT d.*, f.nombre as familia_nombre
    FROM departamentos d
    LEFT JOIN familias_profesionales f ON d.familia_id = f.id
    ORDER BY d.nombre
  `, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create new department
router.post('/', authenticateToken, (req, res) => {
  const { code, name, description, familyId } = req.body;

  if (!code || !name) {
    res.status(400).json({ error: 'Código y nombre son requeridos' });
    return;
  }

  db.run(
    'INSERT INTO departamentos (codigo, nombre, descripcion, familia_id) VALUES (?, ?, ?, ?)',
    [code, name, description, familyId],
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
        message: 'Departamento creado exitosamente'
      });
    }
  );
});

// Update department
router.put('/:id', authenticateToken, (req, res) => {
  const { code, name, description, familyId } = req.body;
  
  if (!code || !name) {
    res.status(400).json({ error: 'Código y nombre son requeridos' });
    return;
  }

  db.run(
    `UPDATE departamentos 
     SET codigo = ?, nombre = ?, descripcion = ?, familia_id = ?
     WHERE id = ?`,
    [code, name, description, familyId, req.params.id],
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Departamento no encontrado' });
        return;
      }
      res.json({ message: 'Departamento actualizado exitosamente' });
    }
  );
});

// Delete department
router.delete('/:id', authenticateToken, (req, res) => {
  db.run(
    'DELETE FROM departamentos WHERE id = ?',
    [req.params.id],
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Departamento no encontrado' });
        return;
      }
      res.json({ message: 'Departamento eliminado exitosamente' });
    }
  );
});

export default router;