import express from 'express';
import { db } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  db.all('SELECT * FROM projects', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

router.post('/', authenticateToken, (req, res) => {
  const { title, description, status } = req.body;
  db.run(
    'INSERT INTO projects (title, description, status, owner_id) VALUES (?, ?, ?, ?)',
    [title, description, status, req.user.id],
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

export default router;