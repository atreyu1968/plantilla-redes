import express from 'express';
import { db } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all courses
router.get('/', authenticateToken, (req, res) => {
  db.all('SELECT * FROM courses ORDER BY start_date DESC', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create new course
router.post('/', authenticateToken, (req, res) => {
  const { name, start_date, end_date, active, periods } = req.body;

  if (!name || !start_date || !end_date) {
    res.status(400).json({ error: 'Todos los campos son requeridos' });
    return;
  }
  
  db.run(
    'INSERT INTO courses (name, start_date, end_date, active) VALUES (?, ?, ?, ?)',
    [name, start_date, end_date, active ? 1 : 0],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          res.status(400).json({ error: 'Ya existe un curso con ese nombre' });
        } else {
          res.status(400).json({ error: err.message });
        }
        return;
      }
      
      const courseId = this.lastID;
      
      // Insert periods if provided
      if (periods && periods.length > 0) {
        const insertPeriod = db.prepare(
          'INSERT INTO periods (course_id, name, start_date, end_date) VALUES (?, ?, ?, ?)'
        );
        
        try {
          periods.forEach(period => {
            insertPeriod.run([
              courseId,
              period.name,
              period.start_date,
              period.end_date
            ]);
          });
          insertPeriod.finalize();
        } catch (periodErr) {
          res.status(400).json({ error: 'Error al crear los períodos' });
          return;
        }
      }
      
      res.json({
        id: this.lastID,
        message: 'Curso creado exitosamente'
      });
    }
  );
});

// Update course
router.put('/:id', authenticateToken, (req, res) => {
  const { name, start_date, end_date, active } = req.body;
  
  if (!name || !start_date || !end_date) {
    res.status(400).json({ error: 'Todos los campos son requeridos' });
    return;
  }

  db.run(
    `UPDATE courses 
     SET name = ?, start_date = ?, end_date = ?, active = ?
     WHERE id = ?`,
    [name, start_date, end_date, active ? 1 : 0, req.params.id],
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Course not found' });
        return;
      }
      res.json({ message: 'Curso actualizado exitosamente' });
    }
  );
});

// Delete course
router.delete('/:id', authenticateToken, (req, res) => {
  db.run(
    'DELETE FROM courses WHERE id = ?',
    [req.params.id],
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Course not found' });
        return;
      }
      res.json({ message: 'Curso eliminado exitosamente' });
    }
  );
});

// Get periods for a course
router.get('/:id/periods', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM periods WHERE course_id = ? ORDER BY start_date',
    [req.params.id],
    (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// Add period to course
router.post('/:id/periods', authenticateToken, (req, res) => {
  const { name, start_date, end_date } = req.body;
  
  if (!name || !start_date || !end_date) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }
  
  db.run(
    'INSERT INTO periods (course_id, name, start_date, end_date) VALUES (?, ?, ?, ?)',
    [req.params.id, name, start_date, end_date],
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Period added successfully' });
    }
  );
});

export default router;