import Redis from 'ioredis';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = Number(process.env.REDIS_PORT) || 6379;
const redisEnabled = process.env.REDIS_ENABLED !== 'false';
const RedisClient = Redis.default || Redis;
let redisConnection = null;
let redisCache = null;
let isRedisConnected = false;
// Create a mock Redis client for when Redis is disabled or unavailable
const createMockRedisClient = () => ({
    on: () => { },
    get: async () => null,
    set: async () => 'OK',
    del: async () => 0,
    hget: async () => null,
    hset: async () => 0,
    hgetall: async () => ({}),
    expire: async () => 0,
    quit: async () => { },
    disconnect: () => { },
    duplicate: () => createMockRedisClient(),
});
if (redisEnabled) {
    try {
        redisConnection = new RedisClient({
            host: redisHost,
            port: redisPort,
            maxRetriesPerRequest: null,
            retryStrategy: (times) => {
                if (times > 3) {
                    console.warn('⚠️  Redis not available - running without Redis cache');
                    return null; // Stop retrying
                }
                return Math.min(times * 100, 1000);
            },
            lazyConnect: true,
        });
        redisCache = new RedisClient({
            host: redisHost,
            port: redisPort,
            retryStrategy: (times) => {
                if (times > 3) {
                    return null;
                }
                return Math.min(times * 100, 1000);
            },
            lazyConnect: true,
        });
        redisConnection.on('error', (err) => {
            if (!isRedisConnected) {
                console.warn('⚠️  Redis not available - running without Redis cache');
            }
        });
        redisConnection.on('connect', () => {
            isRedisConnected = true;
            console.log('✅ Redis connected');
        });
        // Try to connect but don't block startup
        redisConnection.connect().catch(() => {
            console.warn('⚠️  Redis connection failed - continuing without Redis');
        });
        redisCache.connect().catch(() => { });
    }
    catch (err) {
        console.warn('⚠️  Redis initialization failed - using mock client');
        redisConnection = createMockRedisClient();
        redisCache = createMockRedisClient();
    }
}
else {
    console.log('ℹ️  Redis disabled - using mock client');
    redisConnection = createMockRedisClient();
    redisCache = createMockRedisClient();
}
export { redisConnection, redisCache, isRedisConnected };
export default redisConnection;
