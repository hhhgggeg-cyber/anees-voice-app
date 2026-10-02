/**
 * Qibla direction calculation using the Great Circle method.
 * Kaaba coordinates: 21.4225°N, 39.8262°E
 */

export const KAABA_LAT = 21.4225;
export const KAABA_LNG = 39.8262;

export interface GeoPosition {
  latitude: number;
  longitude: number;
}

/**
 * Calculate Qibla bearing (direction from North, clockwise) in degrees.
 */
export function calculateQibla(lat: number, lng: number): number {
  const phiK = (KAABA_LAT * Math.PI) / 180;
  const lambdaK = (KAABA_LNG * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;
  const lambda = (lng * Math.PI) / 180;

  const deltaY = Math.sin(lambdaK - lambda);
  const deltaX =
    Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);

  const theta = Math.atan2(deltaY, deltaX);
  const qibla = ((theta * 180) / Math.PI + 360) % 360;
  return qibla;
}

/**
 * Calculate distance between two geo points in km (Haversine).
 */
export function calculateDistance(lat: number, lng: number): number {
  const R = 6371; // Earth radius km
  const dLat = ((KAABA_LAT - lat) * Math.PI) / 180;
  const dLng = ((KAABA_LNG - lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat * Math.PI) / 180) *
      Math.cos((KAABA_LAT * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Get device orientation compass heading (degrees from North).
 * Handles both iOS (webkitCompassHeading) and Android (alpha with webkitCompassHeading fallback).
 */
export function getCompassHeading(event: DeviceOrientationEvent): number | null {
  // @ts-expect-error - webkitCompassHeading is iOS-specific
  const webkitHeading = event.webkitCompassHeading;
  if (typeof webkitHeading === 'number') {
    return webkitHeading;
  }
  if (typeof event.alpha === 'number' && event.alpha !== null) {
    return 360 - event.alpha;
  }
  return null;
}
