import * as XLSX from 'xlsx';

// Template definitions
const templates = {
  networks: [
    ['Código', 'Nombre', 'Descripción', 'ID Centro Sede'],
    ['RED001', 'Red de Ejemplo', 'Descripción de ejemplo', '1']
  ],
  centers: [
    ['Código', 'Nombre', 'Ubicación'],
    ['CEN001', 'Centro de Ejemplo', 'Dirección de ejemplo']
  ],
  families: [
    ['Código', 'Nombre', 'Descripción'],
    ['FAM001', 'Familia Profesional de Ejemplo', 'Descripción de ejemplo']
  ],
  departments: [
    ['Código', 'Nombre', 'Descripción', 'ID Familia'],
    ['DEP001', 'Departamento de Ejemplo', 'Descripción de ejemplo', '1']
  ],
  networkObjectives: [
    ['Código', 'Nombre', 'Descripción', 'Prioridad', 'ID Red'],
    ['OBJ001', 'Objetivo de Red de Ejemplo', 'Descripción de ejemplo', 'Media', '1']
  ],
  centerObjectives: [
    ['Código', 'Nombre', 'Descripción', 'Prioridad', 'ID Centro'],
    ['OBJ001', 'Objetivo de Centro de Ejemplo', 'Descripción de ejemplo', 'Media', '1']
  ],
  ods: [
    ['Código', 'Nombre', 'Descripción'],
    ['ODS001', 'ODS de Ejemplo', 'Descripción de ejemplo']
  ]
};

// Function to generate template files
export function generateTemplate(type: keyof typeof templates): string {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(templates[type]);
  XLSX.utils.book_append_sheet(wb, ws, 'Template');
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
  return `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${wbout}`;
}