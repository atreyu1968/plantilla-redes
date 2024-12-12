import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './config/database.js';
import { createTables } from './models/schema/index.js';
import { seedInitialData } from './models/schema/seeds/initial_data.js';
import { setupRoutes } from './routes/index.js';
import { setupMiddleware } from './middleware/index.js';

const app = express();
const port = 3000;

async function startServer() {
  try {
    // Initialize database
    console.log('Starting database initialization...');
    await initializeDatabase();
    console.log('Database initialized successfully');

    // Create tables and seed data
    console.log('Creating database schema...');
    await createTables();
    console.log('Database schema created');
    
    console.log('Seeding initial data...');
    await seedInitialData();
    console.log('Initial data seeded successfully');

    // Setup middleware
    setupMiddleware(app);

    // Setup routes
    setupRoutes(app);

    // Start server
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
      console.log('Server ready for connections');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();