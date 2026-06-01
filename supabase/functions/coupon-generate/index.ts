// Coupon Generation Edge Function
// Generates a dynamic QR coupon with a 60-second rotating token
// LIMIT: 1 coupon per user per promotion per day
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { promotion_id, business_id } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate the promotion exists and is active
    const { data: promotion, error: promoError } = await supabase
      .from('promotions')
      .select('*')
      .eq('id', promotion_id)
      .eq('is_active', true)
      .single();

    if (promoError || !promotion) {
      return new Response(JSON.stringify({ error: 'Promotion not found or inactive' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // CHECK: Has the user already used this promotion? (1 time per user per promotion - EVER)
    const { data: existingCoupons } = await supabase
      .from('coupons')
      .select('id, status, redeemed_at')
      .eq('user_id', user.id)
      .eq('promotion_id', promotion_id);

    if (existingCoupons && existingCoupons.length > 0) {
      // Check if any coupon was already redeemed
      const redeemed = existingCoupons.find((c) => c.status === 'redeemed');
      if (redeemed) {
        return new Response(JSON.stringify({
          error: 'already_used',
          message: 'Ya canjeaste esta promoción. Cada promoción solo puede canjearse una vez.',
          redeemed_at: redeemed.redeemed_at,
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check if there's an active (not yet expired) coupon
      const activeCoupon = existingCoupons.find((c) => c.status === 'active' && new Date(c.expires_at) > new Date());
      if (activeCoupon) {
        // Return the existing active coupon
        return new Response(JSON.stringify({
          coupon: activeCoupon,
          reused: true,
          message: 'Ya tenés un cupón activo para esta promoción.',
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Generate a unique token for the QR code
    const couponToken = crypto.randomUUID().replace(/-/g, '').substring(0, 16).toUpperCase();

    // Set expiry to 60 seconds from now
    const expiresAt = new Date(Date.now() + 60 * 1000).toISOString();

    // Create the coupon
    const { data: coupon, error: couponError } = await supabase
      .from('coupons')
      .insert({
        user_id: user.id,
        promotion_id: promotion_id,
        business_id: business_id || promotion.business_id,
        token: couponToken,
        expires_at: expiresAt,
        status: 'active',
      })
      .select()
      .single();

    if (couponError) {
      return new Response(JSON.stringify({ error: couponError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Track analytics event
    await supabase.from('analytics_events').insert({
      event_type: 'coupon_created',
      entity_type: 'promotion',
      entity_id: promotion_id,
      user_id: user.id,
      metadata: JSON.stringify({ coupon_id: coupon.id }),
    });

    return new Response(JSON.stringify({ coupon, reused: false }), {
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
