import { redis } from "../config/redis.js";

describe("Redis test", () => {
    afterAll(async () => {
        try {
            await redis.quit();
        } catch (error) { }
    });

    it("should set and get value", async () => {
        await redis.set("hello", "world");
        const value = await redis.get("hello");
        expect(value).toBe("world");
    }, 10000);
});
