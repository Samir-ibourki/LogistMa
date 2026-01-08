import sequelize from '../config/database.js';

// Import all migrations
import * as createZones from './001-create-zones.js';
import * as createDrivers from './002-create-drivers.js';
import * as createParcels from './003-create-parcels.js';
import * as createDeliveries from './004-create-deliveries.js';

const migrations = [
  createZones,
  createDrivers,
  createParcels,
  createDeliveries,
];

async function runMigrations(): Promise<void> {
  try {
    console.log('🚀 Starting migrations...\n');
    
    await sequelize.authenticate();
    console.log('✅ Database connected\n');
    
    const queryInterface = sequelize.getQueryInterface();
    
    for (const migration of migrations) {
      console.log(`⏳ Running migration...`);
      await migration.up(queryInterface);
      console.log(`✅ Migration completed\n`);
    }
    
    console.log('🎉 All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

async function rollbackMigrations(): Promise<void> {
  try {
    console.log('🔄 Rolling back migrations...\n');
    
    await sequelize.authenticate();
    const queryInterface = sequelize.getQueryInterface();
    
    // Rollback in reverse order
    for (const migration of [...migrations].reverse()) {
      console.log(`⏳ Rolling back...`);
      await migration.down(queryInterface);
      console.log(`✅ Rollback completed\n`);
    }
    
    console.log('🎉 All rollbacks completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Rollback failed:', error);
    process.exit(1);
  }
}

// Check command line argument
const command = process.argv[2];

if (command === 'down') {
  rollbackMigrations();
} else {
  runMigrations();
}
