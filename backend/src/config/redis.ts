import Redis from 'ioredis';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = Number(process.env.REDIS_PORT) || 6379;

// Get the actual Redis constructor
const RedisClient = (Redis as any).default || Redis;

// Redis connection for BullMQ
export const redisConnection = new RedisClient({
  host: redisHost,
  port: redisPort,
  maxRetriesPerRequest: null, // Required by BullMQ
});

// Redis client for caching
export const redisCache = new RedisClient({
  host: redisHost,
  port: redisPort,
});

redisConnection.on('error', (err: Error) => {
  console.error('Redis Connection Error:', err);
});

redisConnection.on('connect', () => {
  console.log('✅ Redis connected');
});

export default redisConnection;
