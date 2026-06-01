// Geofence Check Edge Function
// Checks user location against nearby businesses and triggers notifications
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Haversine formula to calculate distance between two coordinates
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { latitude, longitude, radius_km = 5 } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all active businesses with coordinates
    const { data: businesses } = await supabase
      .from('businesses')
      .select('id, name, latitude, longitude, category, is_founder')
      .eq('is_active', true)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);

    if (!businesses) {
      return new Response(JSON.stringify({ nearby: [] }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Filter nearby businesses
    const nearby = businesses
      .filter((b) => {
        const dist = getDistance(latitude, longitude, b.latitude, b.longitude);
        return dist <= radius_km;
      })
      .map((b) => ({
        ...b,
        distance_km: parseFloat(getDistance(latitude, longitude, b.latitude, b.longitude).toFixed(2)),
      }))
      .sort((a, b) => a.distance_km - b.distance_km);

    // For each nearby business, get active promotions
    const nearbyWithPromos = await Promise.all(
      nearby.map(async (business) => {
        const { data: promos } = await supabase
          .from('promotions')
          .select('id, title, discount_percentage, discount_text, is_flash, flash_duration_minutes')
          .eq('business_id', business.id)
          .eq('is_active', true)
          .eq('moderation_status', 'approved');

        return {
          ...business,
          active_promotions: promos || [],
          promotion_count: promos?.length || 0,
        };
      })
    );

    return new Response(JSON.stringify({ nearby: nearbyWithPromos }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
