import { db } from '../../../config/database.js';
import bcrypt from 'bcryptjs';

const DEFAULT_ROLES = [
  { id: 1, name: 'Administrador', permissions: '{"all":true}' },
  { id: 2, name: 'Coordinador General', permissions: '{"manage_all":true,"manage_networks":true,"manage_centers":true}' },
  { id: 3, name: 'Visitante', permissions: '{"view_only":true}' },
  { id: 4, name: 'Coordinador de Red', permissions: '{"manage_network":true,"manage_objectives":true}' },
  { id: 5, name: 'Gestor', permissions: '{"manage_own":true,"view_all":true}' }
];

export async function seedInitialData() {
  try {
    // Insert default roles
    await new Promise((resolve, reject) => {
      const stmt = db.prepare('INSERT OR REPLACE INTO roles (id, name, permissions) VALUES (?, ?, ?)');
      
      DEFAULT_ROLES.forEach(role => {
        stmt.run(role.id, role.name, role.permissions, (err) => {
          if (err) reject(err);
        });
      });
      
      stmt.finalize((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT OR REPLACE INTO users (
          id, first_name, last_name, email, password, role_id, medusa_code,
          phone, password_expires, locked, failed_attempts
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '+90 days'), 0, 0)`,
        [1, 'Administrador', 'Por Defecto', 'admin@example.com', hashedPassword, 1, 'fgonrol', '649997677'],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    console.log('Initial data seeded successfully');
    console.log('Default admin credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error seeding initial data:', error);
    throw error;
  }
}