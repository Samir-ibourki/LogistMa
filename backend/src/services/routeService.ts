/**
 * Route Service - Calculates delivery routes and estimated times
 */

interface RouteResult {
  distance: number; // in km
  estimatedTime: number; // in minutes
  waypoints: Array<{
    lat: number;
    lng: number;
    type: 'pickup' | 'delivery';
  }>;
}

/**
 * Calculate distance between two points using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculate estimated delivery time based on distance
 * Average speed: 25 km/h in Casablanca traffic
 */
export function calculateEstimatedTime(distanceKm: number): number {
  const averageSpeedKmH = 25;
  return Math.ceil((distanceKm / averageSpeedKmH) * 60); // in minutes
}

/**
 * Calculate full route information
 */
export function calculateRoute(
  pickupLat: number,
  pickupLng: number,
  deliveryLat: number,
  deliveryLng: number
): RouteResult {
  const distance = calculateDistance(pickupLat, pickupLng, deliveryLat, deliveryLng);
  const estimatedTime = calculateEstimatedTime(distance);

  return {
    distance: Math.round(distance * 100) / 100, // Round to 2 decimals
    estimatedTime,
    waypoints: [
      { lat: pickupLat, lng: pickupLng, type: 'pickup' },
      { lat: deliveryLat, lng: deliveryLng, type: 'delivery' },
    ],
  };
}

export default {
  calculateDistance,
  calculateEstimatedTime,
  calculateRoute,
};
