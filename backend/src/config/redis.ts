import Redis from 'ioredis';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = Number(process.env.REDIS_PORT) || 6379;

const RedisClient = (Redis as any).default || Redis;

export const redisConnection = new RedisClient({
    host: redisHost,
    port: redisPort,
    maxRetriesPerRequest: null,
});

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