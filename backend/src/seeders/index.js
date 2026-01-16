import sequelize from '../config/database.js';
import { seedZones } from './zones.seeder.js';
import { seedDrivers } from './drivers.seeder.js';
import { seedParcels } from './parcels.seeder.js';
async function runSeeders() {
    try {
        console.log('🚀 Starting database seeding...\n');
        await sequelize.authenticate();
        console.log('✅ Database connected\n');
        await seedZones();
        await seedDrivers();
        await seedParcels();
        console.log('All seeders completed successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}
runSeeders();
