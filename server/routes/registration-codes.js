import express from 'express';
import { db } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { generateRegistrationCode } from '../utils/code-generator.js';

const router = express.Router();

// Get all registration codes
router.get('/', authenticateToken, (req, res) => {
  db.all(`
    SELECT c.*, r.name as role_name, ct.name as center_name, n.name as network_name
    FROM registration_codes c
    LEFT JOIN roles r ON c.role_id = r.id
    LEFT JOIN centers ct ON c.center_id = ct.id
    LEFT JOIN networks n ON c.network_id = n.id
    ORDER BY c.created_at DESC
  `, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create new registration code
router.post('/', authenticateToken, (req, res) => {
  const { role_id, center_id, network_id, uses_allowed, expiration_date, active } = req.body;

  if (!role_id || !uses_allowed || !expiration_date) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const code = generateRegistrationCode();

  db.run(
    `INSERT INTO registration_codes (
      code, role_id, center_id, network_id, uses_allowed, current_uses,
      expiration_date, active
    ) VALUES (?, ?, ?, ?, ?, 0, ?, ?)`,
    [code, role_id, center_id || null, network_id || null, uses_allowed, expiration_date, active ? 1 : 0],
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        id: this.lastID,
        code,
        message: 'Registration code created successfully'
      });
    }
  );
});

// Delete registration code
router.delete('/:id', authenticateToken, (req, res) => {
  db.run(
    'DELETE FROM registration_codes WHERE id = ?',
    [req.params.id],
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Registration code not found' });
        return;
      }
      res.json({ message: 'Registration code deleted successfully' });
    }
  );
});

export default router;