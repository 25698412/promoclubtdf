import { createClient } from './client';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export async function invokeEdgeFunction<T = unknown>(
  functionName: string,
  body: Record<string, unknown>
): Promise<T> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const response = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || 'Edge function error');
  }

  return response.json();
}

// Coupon functions
export async function generateCoupon(promotionId: string, businessId?: string) {
  return invokeEdgeFunction<{
    coupon: {
      id: string;
      token: string;
      expires_at: string;
      status: string;
    };
    reused: boolean;
  }>('coupon-generate', {
    promotion_id: promotionId,
    business_id: businessId,
  });
}

export async function validateCoupon(token: string) {
  return invokeEdgeFunction<{
    valid: boolean;
    coupon: Record<string, unknown>;
    points_awarded?: number;
    message?: string;
    error?: string;
  }>('coupon-validate', { token });
}

// Geofence functions
export async function checkNearby(latitude: number, longitude: number, radiusKm = 5) {
  return invokeEdgeFunction<{
    nearby: Array<{
      id: string;
      name: string;
      latitude: number;
      longitude: number;
      distance_km: number;
      category: string;
      is_founder: boolean;
      active_promotions: Array<{
        id: string;
        title: string;
        discount_percentage: number;
        is_flash: boolean;
      }>;
      promotion_count: number;
    }>;
  }>('geofence-check', {
    latitude,
    longitude,
    radius_km: radiusKm,
  });
}

// Notification functions
export async function sendPushNotification(userId: string, title: string, body: string, data?: Record<string, unknown>) {
  return invokeEdgeFunction('send-notification', { user_id: userId, title, body, data });
}

export async function sendBatchNotification(userIds: string[], title: string, body: string, data?: Record<string, unknown>) {
  return invokeEdgeFunction('send-notification', { user_ids: userIds, title, body, data });
}
