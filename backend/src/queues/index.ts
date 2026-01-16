import { Queue } from 'bullmq';
import { redisConnection, isRedisConnected } from '../config/redis.js';

// Check if Redis is enabled via environment variable
const redisEnabled = process.env.REDIS_ENABLED !== 'false';

// Mock queue that silently accepts jobs when Redis is disabled
const createMockQueue = (name: string) => ({
  add: async (jobName: string, data: any) => {
    console.log(`ℹ️  [MockQueue:${name}] Job "${jobName}" skipped (Redis disabled)`);
    return { id: 'mock-job-id', name: jobName, data };
  },
  close: async () => {},
  getJobs: async () => [],
  getJobCounts: async () => ({ waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 }),
});

// Dispatch Queue - For parcel assignment jobs
export const dispatchQueue = redisEnabled 
  ? new Queue('dispatch', {
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
    })
  : createMockQueue('dispatch');

// Route Calculation Queue - For calculating optimal delivery routes
export const routeCalculationQueue = redisEnabled
  ? new Queue('route-calculation', {
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
    })
  : createMockQueue('route-calculation');

// Receipt Generation Queue - For generating delivery receipts
export const receiptGenerationQueue = redisEnabled
  ? new Queue('receipt-generation', {
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
    })
  : createMockQueue('receipt-generation');

export default {
  dispatchQueue,
  routeCalculationQueue,
  receiptGenerationQueue,
};