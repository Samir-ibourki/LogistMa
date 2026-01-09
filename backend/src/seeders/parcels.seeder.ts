import { v4 as uuidv4 } from "uuid";
import Parcel from "../models/Parcel.js";
import Zone from "../models/Zone.js";

export async function seedParcels(): Promise<void> {
  console.log("📦 Seeding parcels...");

  const zones = await Zone.findAll();

  if (zones.length < 7) {
    console.log("⚠️ Not enough zones found. Please seed at least 7 zones first.");
    return;
  }

  const parcelsData = [
    {
      id: uuidv4(),
      trackingCode: "LM-2024-001",
      status: "pending" as const,
      pickupAddress: "123 Boulevard Zerktouni, Maarif",
      pickupLat: 33.578,
      pickupLng: -7.635,
      deliveryAddress: "45 Rue Ibnou Sina, Gauthier",
      deliveryLat: 33.589,
      deliveryLng: -7.622,
      weight: 2.5,
      zoneId: zones[3]!.id, // Maarif
      driverId: null,
    },
    {
      id: uuidv4(),
      trackingCode: "LM-2024-002",
      status: "pending" as const,
      pickupAddress: "78 Avenue Hassan II, Anfa",
      pickupLat: 33.5895,
      pickupLng: -7.636,
      deliveryAddress: "22 Rue de Foucauld, Ain Diab",
      deliveryLat: 33.594,
      deliveryLng: -7.67,
      weight: 1.2,
      zoneId: zones[1]!.id, // Anfa
      driverId: null,
    },
    {
      id: uuidv4(),
      trackingCode: "LM-2024-003",
      status: "pending" as const,
      pickupAddress: "15 Technopark, Sidi Maarouf",
      pickupLat: 33.534,
      pickupLng: -7.667,
      deliveryAddress: "90 Boulevard Moulay Rachid, Hay Hassani",
      deliveryLat: 33.546,
      deliveryLng: -7.679,
      weight: 5.0,
      zoneId: zones[0]!.id, // Sidi Maarouf
      driverId: null,
    },
    {
      id: uuidv4(),
      trackingCode: "LM-2024-004",
      status: "pending" as const,
      pickupAddress: "33 Derb Omar, Derb Sultan",
      pickupLat: 33.573,
      pickupLng: -7.6085,
      deliveryAddress: "67 Zone Industrielle, Ain Sebaa",
      deliveryLat: 33.61,
      deliveryLng: -7.55,
      weight: 8.5,
      zoneId: zones[6]!.id, // Derb Sultan
      driverId: null,
    },
    {
      id: uuidv4(),
      trackingCode: "LM-2024-005",
      status: "pending" as const,
      pickupAddress: "12 Corniche, Ain Diab",
      pickupLat: 33.5935,
      pickupLng: -7.6695,
      deliveryAddress: "88 Twin Center, Maarif",
      deliveryLat: 33.577,
      deliveryLng: -7.634,
      weight: 0.8,
      zoneId: zones[4]!.id, // Ain Diab
      driverId: null,
    },
  ];

  for (const parcel of parcelsData) {
    await Parcel.findOrCreate({
      where: { trackingCode: parcel.trackingCode },
      defaults: parcel as any,
    });
  }

  console.log(`✅ ${parcelsData.length} parcels seeded`);
}
