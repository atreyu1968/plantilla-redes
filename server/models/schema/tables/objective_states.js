import { db } from '../../../config/database.js';

export async function createObjectiveStatesTable() {
  return db.run(`
    CREATE TABLE IF NOT EXISTS estados_objetivos (
      id_estado INTEGER PRIMARY KEY AUTOINCREMENT,
      objetivo_id INTEGER NOT NULL,
      curso_id INTEGER NOT NULL,
      centro_id INTEGER,
      activo BOOLEAN NOT NULL DEFAULT 1,
      fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (objetivo_id) REFERENCES objetivos(id_objetivo),
      FOREIGN KEY (curso_id) REFERENCES cursos(id_curso),
      FOREIGN KEY (centro_id) REFERENCES centros(id_centro)
    )
  `);
}