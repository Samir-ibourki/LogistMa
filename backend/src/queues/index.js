import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis.js';
// Dispatch Queue - For parcel assignment jobs
export const dispatchQueue = new Queue('dispatch', {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
    },
});
// Route Calculation Queue - For calculating optimal delivery routes
export const routeCalculationQueue = new Queue('route-calculation', {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 500,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
    },
});
// Receipt Generation Queue - For generating delivery receipts
export const receiptGenerationQueue = new Queue('receipt-generation', {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 500,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
    },
});
export default {
    dispatchQueue,
    routeCalculationQueue,
    receiptGenerationQueue,
};
