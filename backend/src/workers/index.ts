import { routeCalculationQueue } from '../queues/index.js';

async function testRouteWorkerNewJob() {
    const job = await routeCalculationQueue.add('calculate-route-new', {
        deliveryId: '456',
        pickupLat: 34.05,
        pickupLng: -6.75,
        deliveryLat: 34.12,
        deliveryLng: -6.80,
    });
    console.log('✅ New job added:', job.id);
}

testRouteWorkerNewJob();
