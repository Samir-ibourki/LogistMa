/**
 * Receipt Service - Generates delivery receipts
 */

import { Delivery, Parcel, Driver, Zone } from '../models/index.js';

interface ReceiptData {
  receiptNumber: string;
  deliveryId: string;
  trackingCode: string;
  driverName: string;
  driverPhone: string;
  zoneName: string;
  pickupAddress: string;
  deliveryAddress: string;
  weight: number;
  status: string;
  startedAt: Date;
  completedAt: Date;
  generatedAt: Date;
}

/**
 * Generate receipt data for a completed delivery
 */
export async function generateReceipt(deliveryId: string): Promise<ReceiptData> {
  const delivery = await Delivery.findByPk(deliveryId, {
    include: [
      { model: Parcel, include: [{ model: Zone }] },
      { model: Driver },
    ],
  });

  if (!delivery) {
    throw new Error(`Delivery not found: ${deliveryId}`);
  }

  const parcel = (delivery as any).Parcel;
  const driver = (delivery as any).Driver;
  const zone = parcel?.Zone;

  const receiptNumber = `REC-${Date.now().toString(36).toUpperCase()}-${deliveryId.slice(0, 4).toUpperCase()}`;

  return {
    receiptNumber,
    deliveryId: delivery.id,
    trackingCode: parcel?.trackingCode || 'N/A',
    driverName: driver?.name || 'N/A',
    driverPhone: driver?.phone || 'N/A',
    zoneName: zone?.name || 'N/A',
    pickupAddress: parcel?.pickupAddress || 'N/A',
    deliveryAddress: parcel?.deliveryAddress || 'N/A',
    weight: parcel?.weight || 0,
    status: delivery.status,
    startedAt: delivery.startedAt,
    completedAt: delivery.completedAt,
    generatedAt: new Date(),
  };
}

/**
 * Mark receipt as generated for a delivery
 */
export async function markReceiptGenerated(deliveryId: string): Promise<void> {
  await Delivery.update(
    { receiptGenerated: true },
    { where: { id: deliveryId } }
  );
}

export default {
  generateReceipt,
  markReceiptGenerated,
};
