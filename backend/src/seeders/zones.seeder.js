import { v4 as uuidv4 } from 'uuid';
import Zone from '../models/Zone.js';
// Zones de Casablanca avec coordonnées réelles
const zonesData = [
    {
        id: uuidv4(),
        name: 'Sidi Maarouf',
        centerLat: 33.5331,
        centerLng: -7.6657,
        radius: 3.5,
    },
    {
        id: uuidv4(),
        name: 'Anfa',
        centerLat: 33.5892,
        centerLng: -7.6356,
        radius: 2.5,
    },
    {
        id: uuidv4(),
        name: 'Gauthier',
        centerLat: 33.5883,
        centerLng: -7.6231,
        radius: 1.5,
    },
    {
        id: uuidv4(),
        name: 'Maarif',
        centerLat: 33.5764,
        centerLng: -7.6322,
        radius: 2.0,
    },
    {
        id: uuidv4(),
        name: 'Ain Diab',
        centerLat: 33.5936,
        centerLng: -7.6700,
        radius: 2.0,
    },
    {
        id: uuidv4(),
        name: 'Hay Hassani',
        centerLat: 33.5456,
        centerLng: -7.6789,
        radius: 3.0,
    },
    {
        id: uuidv4(),
        name: 'Derb Sultan',
        centerLat: 33.5731,
        centerLng: -7.6089,
        radius: 2.0,
    },
    {
        id: uuidv4(),
        name: 'Ain Sebaa',
        centerLat: 33.6100,
        centerLng: -7.5500,
        radius: 4.0,
    },
];
export async function seedZones() {
    console.log('🌍 Seeding zones...');
    for (const zone of zonesData) {
        await Zone.findOrCreate({
            where: { name: zone.name },
            defaults: zone,
        });
    }
    console.log(`✅ ${zonesData.length} zones seeded`);
}
export { zonesData };
