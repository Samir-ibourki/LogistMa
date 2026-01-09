/**
 * Dispatch Service - Smart parcel-to-driver assignment
 */

import { Driver, Parcel, Delivery } from '../models/index.js';
import { routeCalculationQueue, receiptGenerationQueue } from '../queues/index.js';
import { calculateRoute } from './routeService.js';

interface DispatchResult {
  success: boolean;
  delivery?: Delivery;
  driver?: Driver;
  message: string;
}

/**
 * Find the best available driver for a parcel
 * Criteria: same zone, available status, highest capacity
 */
export async function findBestDriver(parcel: Parcel): Promise<Driver | null> {
  const drivers = await Driver.findAll({
    where: {
      zoneId: parcel.zoneId,
      status: 'available',
    },
    order: [['capacity', 'DESC']], // Prefer drivers with higher capacity
  });

  return drivers[0] || null;
}

/**
 * Dispatch a parcel to the best available driver
 */
export async function dispatchParcel(parcelId: string): Promise<DispatchResult> {
  // 1. Find the parcel
  const parcel = await Parcel.findByPk(parcelId);
  
  if (!parcel) {
    return { success: false, message: 'Parcel not found' };
  }
  
  if (parcel.status !== 'pending') {
    return { success: false, message: `Parcel already ${parcel.status}` };
  }

  // 2. Find best available driver
  const driver = await findBestDriver(parcel);
  
  if (!driver) {
    return { success: false, message: 'No available driver in this zone' };
  }

  // 3. Calculate route (sync for immediate response)
  const route = calculateRoute(
    Number(parcel.pickupLat),
    Number(parcel.pickupLng),
    Number(parcel.deliveryLat),
    Number(parcel.deliveryLng)
  );

  // 4. Create delivery record
  const delivery = await Delivery.create({
    parcelId: parcel.id,
    driverId: driver.id,
    status: 'assigned',
    estimatedRoute: JSON.stringify(route),
    receiptGenerated: false,
    startedAt: new Date(),
    completedAt: new Date(), // Will be updated when completed
  });

  // 5. Update parcel and driver status
  await parcel.update({ 
    driverId: driver.id, 
    status: 'assigned' 
  });
  
  await driver.update({ status: 'busy' });

  // 6. Queue background job for detailed route calculation (optional enhancement)
  await routeCalculationQueue.add('calculate-route', {
    deliveryId: delivery.id,
    pickupLat: Number(parcel.pickupLat),
    pickupLng: Number(parcel.pickupLng),
    deliveryLat: Number(parcel.deliveryLat),
    deliveryLng: Number(parcel.deliveryLng),
  });

  return {
    success: true,
    delivery,
    driver,
    message: `Parcel assigned to ${driver.name}`,
  };
}

/**
 * Mark a parcel as picked up by driver
 */
export async function markAsPickedUp(deliveryId: string): Promise<DispatchResult> {
  const delivery = await Delivery.findByPk(deliveryId);
  
  if (!delivery) {
    return { success: false, message: 'Delivery not found' };
  }
  
  if (delivery.status !== 'assigned') {
    return { success: false, message: `Cannot pick up - status is ${delivery.status}` };
  }

  await delivery.update({ status: 'picked_up' });
  
  await Parcel.update(
    { status: 'picked_up' },
    { where: { id: delivery.parcelId } }
  );

  return { success: true, message: 'Parcel picked up' };
}

/**
 * Mark a delivery as completed
 */
export async function markAsDelivered(deliveryId: string): Promise<DispatchResult> {
  const delivery = await Delivery.findByPk(deliveryId);
  
  if (!delivery) {
    return { success: false, message: 'Delivery not found' };
  }
  
  if (delivery.status === 'delivered') {
    return { success: false, message: 'Already delivered' };
  }

  // 1. Update delivery status
  await delivery.update({ 
    status: 'delivered',
    completedAt: new Date(),
  });

  // 2. Update parcel status
  await Parcel.update(
    { status: 'delivered' },
    { where: { id: delivery.parcelId } }
  );

  // 3. Free the driver
  await Driver.update(
    { status: 'available' },
    { where: { id: delivery.driverId } }
  );

  // 4. Queue receipt generation
  await receiptGenerationQueue.add('generate-receipt', {
    deliveryId: delivery.id,
  });

  return { success: true, message: 'Delivery completed successfully' };
}

/**
 * Mark a delivery as failed
 */
export async function markAsFailed(deliveryId: string, reason: string): Promise<DispatchResult> {
  const delivery = await Delivery.findByPk(deliveryId);
  
  if (!delivery) {
    return { success: false, message: 'Delivery not found' };
  }

  // 1. Update delivery status
  await delivery.update({ status: 'failed' });

  // 2. Update parcel status back to pending for re-dispatch
  await Parcel.update(
    { status: 'pending', driverId: null },
    { where: { id: delivery.parcelId } }
  );

  // 3. Free the driver
  await Driver.update(
    { status: 'available' },
    { where: { id: delivery.driverId } }
  );

  return { success: true, message: `Delivery failed: ${reason}` };
}

export default {
  findBestDriver,
  dispatchParcel,
  markAsPickedUp,
  markAsDelivered,
  markAsFailed,
};
