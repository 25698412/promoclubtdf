// Coupon Validation Edge Function
// Business scans QR → validates token → marks redeemed → awards points
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
    const { token } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the authenticated business owner
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const authToken = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(authToken);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Find the coupon by token
    const { data: coupon, error: couponError } = await supabase
      .from('coupons')
      .select('*, promotions(*), businesses(*)')
      .eq('token', token)
      .single();

    if (couponError || !coupon) {
      return new Response(JSON.stringify({ error: 'Coupon not found', valid: false }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify the business owner owns this business
    if (coupon.businesses?.owner_id !== user.id) {
      return new Response(JSON.stringify({ error: 'This coupon does not belong to your business', valid: false }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if coupon is already redeemed or expired
    if (coupon.status === 'redeemed') {
      return new Response(JSON.stringify({
        error: 'Coupon already redeemed',
        valid: false,
        coupon,
        redeemed_at: coupon.redeemed_at,
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (coupon.status === 'expired' || new Date(coupon.expires_at) < new Date()) {
      // Mark as expired
      await supabase
        .from('coupons')
        .update({ status: 'expired' })
        .eq('id', coupon.id);

      return new Response(JSON.stringify({
        error: 'Coupon has expired',
        valid: false,
        coupon,
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Mark coupon as redeemed
    const now = new Date().toISOString();
    const { error: redeemError } = await supabase
      .from('coupons')
      .update({
        status: 'redeemed',
        redeemed_at: now,
        redeemed_by: user.id,
      })
      .eq('id', coupon.id);

    if (redeemError) {
      return new Response(JSON.stringify({ error: redeemError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Award points to the user
    const userId = coupon.user_id;
    const discountPercentage = coupon.promotions?.discount_percentage || 0;
    const priceARS = parseFloat(coupon.promotions?.price_ARS) || 0;

    // Calculate points based on configurable rules
    const { data: rules } = await supabase
      .from('points_rules')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single();

    const pointsPerAmount = rules?.points_per_amount || 1;   // ej: 1 punto...
    const amountThreshold = rules?.amount_threshold || 100;   // ...cada $100 ARS

    let totalPoints = 0;
    if (priceARS > 0 && amountThreshold > 0) {
      // Calculate the actual price after discount
      const actualPrice = discountPercentage > 0
        ? priceARS * (1 - discountPercentage / 100)
        : priceARS;
      // Points = (actual_price / threshold) * points_per_amount
      totalPoints = Math.floor((actualPrice / amountThreshold) * pointsPerAmount);
      // Minimum 1 point per redemption
      totalPoints = Math.max(totalPoints, 1);
    } else {
      // Fallback: flat 10 points per redemption when no price is set
      totalPoints = 10;
    }

    // Fetch configurable level thresholds from platform_settings
    const { data: levelSettings } = await supabase
      .from('platform_settings')
      .select('value')
      .eq('key', 'level_thresholds')
      .single();

    const silverThreshold = levelSettings?.value?.silver ?? 1000;
    const goldThreshold = levelSettings?.value?.gold ?? 5000;

    // Add points to user profile
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('points, level')
      .eq('id', userId)
      .single();

    if (userProfile) {
      const newPoints = (userProfile.points || 0) + totalPoints;

      // Determine new level using configurable thresholds
      let newLevel = userProfile.level;
      if (newPoints >= goldThreshold) newLevel = 'gold';
      else if (newPoints >= silverThreshold) newLevel = 'silver';

      await supabase
        .from('user_profiles')
        .update({ points: newPoints, level: newLevel, updated_at: now })
        .eq('id', userId);

      // Record points history
      await supabase.from('points_history').insert({
        user_id: userId,
        points_change: totalPoints,
        reason: `Cupón canjeado: ${coupon.promotions?.title || 'Promoción'}`,
        reference_type: 'promotion',
        reference_id: coupon.promotion_id,
      });
    }

    // Track analytics
    await supabase.from('analytics_events').insert({
      event_type: 'redeem_coupon',
      entity_type: 'promotion',
      entity_id: coupon.promotion_id,
      user_id: userId,
      metadata: JSON.stringify({
        coupon_id: coupon.id,
        business_id: coupon.business_id,
        points_awarded: totalPoints,
      }),
    });

    return new Response(JSON.stringify({
      valid: true,
      coupon: {
        ...coupon,
        status: 'redeemed',
        redeemed_at: now,
      },
      points_awarded: totalPoints,
      message: `Cupón validado. ${totalPoints} puntos otorgados al usuario.`,
    }), {
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
