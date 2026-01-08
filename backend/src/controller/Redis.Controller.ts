import { redis } from "../config/redis.js";

await redis.set("test", "hello");
