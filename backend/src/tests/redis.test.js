import redisConnection, { redisCache } from '../config/redis.js';
describe("Redis test", () => {
    afterAll(async () => {
        await redisConnection.quit();
        await redisCache.quit();
    });
    it("should set and get value", async () => {
        await redisConnection.set("hello", "world");
        const value = await redisConnection.get("hello");
        expect(value).toBe("world");
    });
});
