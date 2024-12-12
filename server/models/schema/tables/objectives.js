import { db } from '../../../config/database.js';

export async function createObjectivesTable() {
  return db.run(`
    CREATE TABLE IF NOT EXISTS objetivos (
      id_objetivo INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo VARCHAR(50) UNIQUE NOT NULL,
      nombre VARCHAR(100) NOT NULL,
      descripcion TEXT,
      tipo TEXT CHECK(tipo IN ('ODS', 'Red', 'Centro')) NOT NULL,
      prioridad TEXT CHECK(prioridad IN ('Baja', 'Media', 'Alta')) NOT NULL,
      fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}