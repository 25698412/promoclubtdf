/**
 * Extract latitude and longitude from various Google Maps URL formats
 * 
 * Supported formats:
 * - https://maps.google.com/?q=-54.8019,-68.3030
 * - https://www.google.com/maps?q=-54.8019,-68.3030
 * - https://www.google.com/maps/@-54.8019,-68.3030,15z
 * - https://www.google.com/maps/place/.../@-54.8019,-68.3030,15z
 * - https://goo.gl/maps/xxxxx (redirects, can't parse directly)
 * - https://maps.app.goo.gl/xxxxx (redirects, can't parse directly)
 */
export function extractCoordsFromGoogleMapsUrl(url: string): { lat: number; lng: number } | null {
  if (!url) return null;

  try {
    // Format 1: ?q=LAT,LNG or ?q=LAT,LNG,zoom
    const qMatch = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (qMatch) {
      return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
    }

    // Format 2: /@LAT,LNG,zoom
    const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (atMatch) {
      return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
    }

    // Format 3: !3dLAT!4dLLNG (embedded in place URLs)
    const embedMatch = url.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
    if (embedMatch) {
      return { lat: parseFloat(embedMatch[1]), lng: parseFloat(embedMatch[2]) };
    }

    // Format 4: /maps/search/LAT,LNG
    const searchMatch = url.match(/\/maps\/search\/(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (searchMatch) {
      return { lat: parseFloat(searchMatch[1]), lng: parseFloat(searchMatch[2]) };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Generate a Google Maps link from coordinates
 */
export function generateGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}
