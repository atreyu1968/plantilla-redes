import express from 'express';
import { db } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all networks
router.get('/', authenticateToken, (req, res) => {
  db.all(
    `SELECT n.*, c.name as center_sede_name 
     FROM networks n 
     LEFT JOIN centers c ON n.center_sede_id = c.id 
     WHERE n.status = "active" 
     ORDER BY n.name`,
    [],
    (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// Create new network
router.post('/', authenticateToken, (req, res) => {
  const { code, name, description, centerSedeId } = req.body;

  if (!code || !name) {
    res.status(400).json({ error: 'Code and name are required' });
    return;
  }

  db.run(
    'INSERT INTO networks (code, name, description, center_sede_id) VALUES (?, ?, ?, ?)',
    [code, name, description, centerSedeId],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          res.status(400).json({ error: 'Network code already exists' });
        } else {
          res.status(400).json({ error: err.message });
        }
        return;
      }
      res.json({
        id: this.lastID,
        message: 'Network created successfully'
      });
    }
  );
});

// Update network
router.put('/:id', authenticateToken, (req, res) => {
  const { code, name, description, centerSedeId } = req.body;
  
  if (!code || !name) {
    res.status(400).json({ error: 'Code and name are required' });
    return;
  }

  db.run(
    `UPDATE networks 
     SET code = ?, name = ?, description = ?, center_sede_id = ?
     WHERE id = ? AND status = "active"`,
    [code, name, description, centerSedeId, req.params.id],
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Network not found' });
        return;
      }
      res.json({ message: 'Network updated successfully' });
    }
  );
});

// Delete network (soft delete)
router.delete('/:id', authenticateToken, (req, res) => {
  db.run(
    'UPDATE networks SET status = "inactive" WHERE id = ?',
    [req.params.id],
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Network not found' });
        return;
      }
      res.json({ message: 'Network deleted successfully' });
    }
  );
});

// Add center to network
router.post('/:networkId/centers/:centerId', authenticateToken, (req, res) => {
  db.run(
    'INSERT INTO network_centers (network_id, center_id) VALUES (?, ?)',
    [req.params.networkId, req.params.centerId],
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ message: 'Center added to network successfully' });
    }
  );
});

// Remove center from network
router.delete('/:networkId/centers/:centerId', authenticateToken, (req, res) => {
  db.run(
    'DELETE FROM network_centers WHERE network_id = ? AND center_id = ?',
    [req.params.networkId, req.params.centerId],
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Association not found' });
        return;
      }
      res.json({ message: 'Center removed from network successfully' });
    }
  );
});

export default router;