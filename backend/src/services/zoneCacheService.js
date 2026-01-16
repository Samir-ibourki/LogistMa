/**
 * Zone Cache Service - Redis caching for zones
 */
import { redisCache } from '../config/redis.js';
import { Zone } from '../models/index.js';
const ZONES_CACHE_KEY = 'zones:all';
const ZONES_CACHE_TTL = 3600; // 1 hour in seconds
/**
 * Get all zones - from cache if available, otherwise from database
 */
export async function getAllZones() {
    try {
        // Try to get from cache
        const cached = await redisCache.get(ZONES_CACHE_KEY);
        if (cached) {
            console.log('📦 Zones loaded from cache');
            return JSON.parse(cached);
        }
        // Cache miss - fetch from database
        const zones = await Zone.findAll({
            attributes: ['id', 'name', 'centerLat', 'centerLng', 'radius'],
            order: [['name', 'ASC']],
        });
        const zonesData = zones.map((z) => ({
            id: z.id,
            name: z.name,
            centerLat: Number(z.centerLat),
            centerLng: Number(z.centerLng),
            radius: Number(z.radius),
        }));
        // Store in cache
        await redisCache.setex(ZONES_CACHE_KEY, ZONES_CACHE_TTL, JSON.stringify(zonesData));
        console.log('💾 Zones cached in Redis');
        return zonesData;
    }
    catch (error) {
        console.error('Zone cache error, falling back to database:', error);
        // Fallback to database on Redis error
        const zones = await Zone.findAll({
            attributes: ['id', 'name', 'centerLat', 'centerLng', 'radius'],
            order: [['name', 'ASC']],
        });
        return zones.map((z) => ({
            id: z.id,
            name: z.name,
            centerLat: Number(z.centerLat),
            centerLng: Number(z.centerLng),
            radius: Number(z.radius),
        }));
    }
}
/**
 * Invalidate zones cache - call when zones are created/updated/deleted
 */
export async function invalidateZonesCache() {
    try {
        await redisCache.del(ZONES_CACHE_KEY);
        console.log('🗑️ Zones cache invalidated');
    }
    catch (error) {
        console.error('Failed to invalidate zones cache:', error);
    }
}
/**
 * Get a single zone by ID - checks cache first
 */
export async function getZoneById(zoneId) {
    const zones = await getAllZones();
    return zones.find((z) => z.id === zoneId) || null;
}
export default {
    getAllZones,
    invalidateZonesCache,
    getZoneById,
};
