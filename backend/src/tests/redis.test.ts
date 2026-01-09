import { redis } from "../config/redis.js";

describe("Redis test", () => {
    afterAll(async () => {
        try {
            await redis.quit();
        } catch (error) { }
    });

    it("should set and get value", async () => {
        await redis.set("hello", "world");
        await redis.set("test", "ok");
        console.log(await redis.get("test"));
        const value = await redis.get("hello");
        expect(value).toBe("world");
    });
});
