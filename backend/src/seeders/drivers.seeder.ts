import { v4 as uuidv4 } from 'uuid';
import Driver from '../models/Driver.js';
import Zone from '../models/Zone.js';

export async function seedDrivers(): Promise<void> {
  console.log('Seeding drivers...');
  
  // Get all zones
  const zones = await Zone.findAll();
  
  if (zones.length < 8) {
    console.log('⚠️ Not enough zones found. Please seed at least 8 zones first.');
    return;
  }

  const driversData = [
    {
      id: uuidv4(),
      name: 'Ahmed Bennani',
      phone: '+212661234567',
      latitude: 33.5350,
      longitude: -7.6680,
      capacity: 5,
      status: 'available' as const,
      zoneId: zones[0]!.id, // Sidi Maarouf
    },
    {
      id: uuidv4(),
      name: 'Youssef El Amrani',
      phone: '+212662345678',
      latitude: 33.5900,
      longitude: -7.6360,
      capacity: 4,
      status: 'available' as const,
      zoneId: zones[1]!.id, // Anfa
    },
    {
      id: uuidv4(),
      name: 'Karim Tazi',
      phone: '+212663456789',
      latitude: 33.5880,
      longitude: -7.6240,
      capacity: 6,
      status: 'available' as const,
      zoneId: zones[2]!.id, // Gauthier
    },
    {
      id: uuidv4(),
      name: 'Omar Fassi',
      phone: '+212664567890',
      latitude: 33.5760,
      longitude: -7.6330,
      capacity: 5,
      status: 'busy' as const,
      zoneId: zones[3]!.id, // Maarif
    },
    {
      id: uuidv4(),
      name: 'Hassan Alaoui',
      phone: '+212665678901',
      latitude: 33.5940,
      longitude: -7.6710,
      capacity: 4,
      status: 'available' as const,
      zoneId: zones[4]!.id, // Ain Diab
    },
    {
      id: uuidv4(),
      name: 'Said Benjelloun',
      phone: '+212666789012',
      latitude: 33.5460,
      longitude: -7.6800,
      capacity: 5,
      status: 'offline' as const,
      zoneId: zones[5]!.id, // Hay Hassani
    },
    {
      id: uuidv4(),
      name: 'Mehdi Berrada',
      phone: '+212667890123',
      latitude: 33.5735,
      longitude: -7.6090,
      capacity: 6,
      status: 'available' as const,
      zoneId: zones[6]!.id, // Derb Sultan
    },
    {
      id: uuidv4(),
      name: 'Rachid Ziani',
      phone: '+212668901234',
      latitude: 33.6110,
      longitude: -7.5510,
      capacity: 5,
      status: 'available' as const,
      zoneId: zones[7]!.id, // Ain Sebaa
    },
  ];

  for (const driver of driversData) {
    await Driver.findOrCreate({
      where: { phone: driver.phone },
      defaults: driver,
    });
  }
  
  console.log(`✅ ${driversData.length} drivers seeded`);
}
