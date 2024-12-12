import userRoutes from './users.js';
import projectRoutes from './projects.js';
import centerRoutes from './centers.js';
import networkRoutes from './networks.js';
import familyRoutes from './families.js';
import departmentRoutes from './departments.js';
import resourceRoutes from './resources.js';
import courseRoutes from './courses.js';
import registrationCodesRoutes from './registration-codes.js';
import importRoutes from './imports.js';

export function setupRoutes(app) {
  // API routes
  app.use('/api/users', userRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/centers', centerRoutes);
  app.use('/api/networks', networkRoutes);
  app.use('/api/families', familyRoutes);
  app.use('/api/departments', departmentRoutes);
  app.use('/api/resources', resourceRoutes);
  app.use('/api/courses', courseRoutes);
  app.use('/api/registration-codes', registrationCodesRoutes);
  app.use('/api/imports', importRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Error handling for undefined routes
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
}