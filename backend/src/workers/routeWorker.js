import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis.js';
import { Delivery } from '../models/index.js';
import { calculateRoute } from '../services/routeService.js';
export const routeWorker = new Worker('route-calculation', async (job) => {
    const { deliveryId, pickupLat, pickupLng, deliveryLat, deliveryLng } = job.data;
    console.log(`📍 [RouteWorker] Processing route for delivery ${deliveryId}`);
    try {
        const route = calculateRoute(pickupLat, pickupLng, deliveryLat, deliveryLng);
        await Delivery.update({ estimatedRoute: JSON.stringify(route) }, { where: { id: deliveryId } });
        console.log(`✅ [RouteWorker] Route calculated: ${route.distance}km, ${route.estimatedTime}min`);
        return {
            success: true,
            deliveryId,
            distance: route.distance,
            estimatedTime: route.estimatedTime,
        };
    }
    catch (error) {
        console.error(`❌ [RouteWorker] Failed to calculate route:`, error);
        throw error;
    }
}, {
    connection: redisConnection,
    concurrency: 5,
});
routeWorker.on('completed', (job) => {
    console.log(`✅ [RouteWorker] Job ${job.id} completed`);
});
routeWorker.on('failed', (job, err) => {
    console.error(`❌ [RouteWorker] Job ${job?.id} failed:`, err.message);
});
export default routeWorker;
