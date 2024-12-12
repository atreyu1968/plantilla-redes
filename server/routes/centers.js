import express from 'express';
import { db } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all centers
router.get('/', authenticateToken, (req, res) => {
  db.all('SELECT * FROM centers WHERE status = "active" ORDER BY name', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create new center
router.post('/', authenticateToken, (req, res) => {
  const { code, name, description } = req.body;

  if (!code || !name) {
    res.status(400).json({ error: 'Code and name are required' });
    return;
  }

  db.run(
    'INSERT INTO centers (code, name, description) VALUES (?, ?, ?)',
    [code, name, description],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          res.status(400).json({ error: 'Center code already exists' });
        } else {
          res.status(400).json({ error: err.message });
        }
        return;
      }
      res.json({
        id: this.lastID,
        message: 'Center created successfully'
      });
    }
  );
});

// Update center
router.put('/:id', authenticateToken, (req, res) => {
  const { code, name, description } = req.body;
  
  if (!code || !name) {
    res.status(400).json({ error: 'Code and name are required' });
    return;
  }

  db.run(
    `UPDATE centers 
     SET code = ?, name = ?, description = ?
     WHERE id = ? AND status = "active"`,
    [code, name, description, req.params.id],
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Center not found' });
        return;
      }
      res.json({ message: 'Center updated successfully' });
    }
  );
});

// Delete center (soft delete)
router.delete('/:id', authenticateToken, (req, res) => {
  db.run(
    'UPDATE centers SET status = "inactive" WHERE id = ?',
    [req.params.id],
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Center not found' });
        return;
      }
      res.json({ message: 'Center deleted successfully' });
    }
  );
});

export default router;