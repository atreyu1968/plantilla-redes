import { db } from '../../config/database.js';
import { createRolesTable } from './tables/roles.js';
import { createUsersTable } from './tables/users.js';
import { createFamiliesTable } from './tables/families.js';
import { createDepartmentsTable } from './tables/departments.js';
import { createRegistrationCodesTable } from './tables/registration_codes.js';
import { createObjectivesTable } from './tables/objectives.js';
import { createCoursesTable } from './tables/courses.js';
import { createPeriodsTable } from './tables/periods.js';
import { createCentersTable } from './tables/centers.js';
import { createNetworksTable } from './tables/networks.js';
import { createObjectiveStatesTable } from './tables/objective_states.js';
import { createODSTable } from './tables/ods.js';
import { createCategoriesTable } from './tables/categories.js';
import { createPasswordHistoryTable } from './tables/password_history.js'; 

export async function createTables() {
  console.log('Creating database tables...');
  
  try {
    // First create tables without foreign key dependencies
    await createRolesTable();
    await createCentersTable();
    await createFamiliesTable();
    
    // Then create tables with foreign key dependencies
    await createDepartmentsTable();
    await createNetworksTable();
    await createUsersTable();
    await createPasswordHistoryTable();
    await createCoursesTable();
    await createPeriodsTable();
    await createRegistrationCodesTable();
    await createObjectivesTable();
    await createObjectiveStatesTable();
    await createODSTable();
    await createCategoriesTable();

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error;
  }
}