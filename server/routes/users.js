import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { JWT_SECRET, AUTH_CONFIG } from '../config/auth.js';

const router = express.Router();

// Get users count
router.get('/count', authenticateToken, (req, res) => {
  db.get('SELECT COUNT(*) as count FROM users', [], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ count: row.count });
  });
});

async function addToPasswordHistory(userId, passwordHash) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO password_history (usuario_id, password_hash) VALUES (?, ?)',
      [userId, passwordHash],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

// Public routes - no authentication required
router.post('/register', async (req, res) => {
  const { username, password, email, role, firstName, lastName } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, AUTH_CONFIG.saltRounds);
    
    db.run(
      `INSERT INTO users (
        username, password, email, role, first_name, last_name, status
      ) VALUES (?, ?, ?, ?, ?, ?, 'active')`,
      [username, hashedPassword, email, role || 'student', firstName, lastName],
      function(err) {
        if (err) {
          console.error('Registration error:', err);
          res.status(400).json({ error: err.message });
          return;
        }
        res.json({ id: this.lastID });
      }
    );
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Error creating user' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Get user by email (using email as username)
    const user = await new Promise((resolve, reject) => {
      db.get(
        `SELECT u.*, r.nombre_rol as rol_nombre 
         FROM users u 
         JOIN roles r ON u.rol_id = r.id_rol 
         WHERE u.email = ? AND u.bloqueado = 0`,
        [username],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      // Update failed attempts
      await new Promise((resolve, reject) => {
        db.run(
          'UPDATE users SET intentos_fallidos = intentos_fallidos + 1 WHERE id_usuario = ?',
          [user.id_usuario],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });

      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Reset failed attempts and update last login
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET intentos_fallidos = 0, ultima_sesion = CURRENT_TIMESTAMP WHERE id_usuario = ?',
        [user.id_usuario],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    const token = jwt.sign(
      { 
        id: user.id_usuario,
        email: user.email,
        role: user.rol_nombre
      },
      JWT_SECRET,
      { expiresIn: AUTH_CONFIG.tokenExpiration }
    );

    res.json({
      token,
      user: {
        id: user.id_usuario,
        email: user.email,
        role: user.rol_nombre,
        firstName: user.nombre,
        lastName: user.apellidos
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Error en el servidor durante el login' });
  }
});

// Get all users (protected, admin only)
router.get('/', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  db.all(
    `SELECT u.id, u.first_name, u.last_name, u.email, u.medusa_code,
            r.name as role, u.created_at, u.phone,
            CASE WHEN u.locked = 0 THEN 'active' ELSE 'inactive' END as status,
            c.name as center_name, n.name as network_name
     FROM users u
     JOIN roles r ON u.role_id = r.id
     LEFT JOIN centers c ON u.center_id = c.id
     LEFT JOIN networks n ON u.network_id = n.id
     ORDER BY u.created_at DESC`,
    [],
    (err, rows) => {
      if (err) {
        console.error('Error fetching users:', err);
        res.status(400).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// Delete user (protected, admin only)
router.delete('/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  if (parseInt(req.params.id) === req.user.id) {
    return res.status(400).json({ error: 'Cannot delete your own account' });
  }

  db.run(
    'UPDATE users SET status = "inactive" WHERE id = ?',
    [req.params.id],
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json({ message: 'User deactivated successfully' });
    }
  );
});

// Update user (protected)
router.put('/:id', authenticateToken, (req, res) => {
  const { firstName, lastName, email, role } = req.body;
  const userId = parseInt(req.params.id);

  // Only admins can update other users or change roles
  if (userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  const updates = [];
  const params = [];

  if (firstName) {
    updates.push('first_name = ?');
    params.push(firstName);
  }
  if (lastName) {
    updates.push('last_name = ?');
    params.push(lastName);
  }
  if (email) {
    updates.push('email = ?');
    params.push(email);
  }
  if (role && req.user.role === 'admin') {
    updates.push('role = ?');
    params.push(role);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  params.push(userId);

  db.run(
    `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
    params,
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json({ message: 'User updated successfully' });
    }
  );
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get(
    `SELECT u.*, r.name as role
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE u.email = ? AND u.locked = 0`,
    [username],
    async (err, user) => {
      if (err) {
        console.error('Login error:', err);
        res.status(400).json({ error: err.message });
        return;
      }
      
      if (!user) {
        res.status(401).json({ error: 'User not found or inactive' });
        return;
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign(
        { 
          id: user.id,
          email: user.email, 
          role: user.role,
          firstName: user.first_name,
          lastName: user.last_name
        },
        JWT_SECRET,
        { expiresIn: AUTH_CONFIG.tokenExpiration }
      );

      res.json({
        token,
        user: {
          id: user.id, 
          email: user.email,
          role: user.role,
          firstName: user.first_name,
          lastName: user.last_name
        }
      });
    }
  );
});

router.get('/profile', authenticateToken, (req, res) => {
  db.get(
    `SELECT id, username, email, role, first_name, last_name, avatar_url, bio, status, created_at 
     FROM users WHERE id = ?`,
    [req.user.id],
    (err, user) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(user);
    }
  );
});

router.put('/profile', authenticateToken, (req, res) => {
  const { firstName, lastName, bio, email } = req.body;
  
  db.run(
    `UPDATE users 
     SET first_name = ?, last_name = ?, bio = ?, email = ?
     WHERE id = ?`,
    [firstName, lastName, bio, email, req.user.id],
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ message: 'Profile updated successfully' });
    }
  );
});

router.get('/permissions', authenticateToken, (req, res) => {
  db.all(
    `SELECT DISTINCT p.name, p.description
     FROM permissions p
     JOIN role_permissions rp ON p.id = rp.permission_id
     JOIN roles r ON rp.role_id = r.id
     WHERE r.name = ?`,
    [req.user.role],
    (err, permissions) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json(permissions);
    }
  );
});

export default router;