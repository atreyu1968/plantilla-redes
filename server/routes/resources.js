import express from 'express';
import { db } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  db.all('SELECT * FROM resources', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

router.post('/', authenticateToken, (req, res) => {
  const { title, content, category } = req.body;
  db.run(
    'INSERT INTO resources (title, content, category, author_id) VALUES (?, ?, ?, ?)',
    [title, content, category, req.user.id],
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