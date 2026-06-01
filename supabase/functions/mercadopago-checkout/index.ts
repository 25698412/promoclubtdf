// MercadoPago Checkout Edge Function
// Creates a payment preference and returns the checkout URL
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
    const { plan_id, business_id } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const mpAccessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
    if (!mpAccessToken) {
      return new Response(JSON.stringify({ error: 'MercadoPago not configured. Set MERCADOPAGO_ACCESS_TOKEN in Supabase secrets.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify the business belongs to this user
    const { data: business } = await supabase
      .from('businesses')
      .select('id, name, email, owner_id')
      .eq('id', business_id)
      .eq('owner_id', user.id)
      .single();

    if (!business) {
      return new Response(JSON.stringify({ error: 'Business not found or not owned by you' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get the plan
    const { data: plan } = await supabase
      .from('membership_plans')
      .select('*')
      .eq('id', plan_id)
      .eq('is_active', true)
      .single();

    if (!plan) {
      return new Response(JSON.stringify({ error: 'Plan not found or inactive' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create MercadoPago preference
    const mpBody = {
      items: [{
        id: plan.id,
        title: `Membresía ${plan.name} - Promo Club TDF`,
        description: plan.description || `Plan ${plan.name} (${plan.duration_months} mes(es))`,
        quantity: 1,
        unit_price: plan.price_ARS,
        currency_id: 'ARS',
      }],
      payer: {
        email: business.email || user.email,
      },
      external_reference: JSON.stringify({
        business_id: business.id,
        plan_id: plan.id,
      }),
      back_urls: {
        success: `${Deno.env.get('SITE_URL') || 'https://promoclubtdf.com'}/business/panel?membership=success`,
        failure: `${Deno.env.get('SITE_URL') || 'https://promoclubtdf.com'}/business/panel?membership=failed`,
        pending: `${Deno.env.get('SITE_URL') || 'https://promoclubtdf.com'}/business/panel?membership=pending`,
      },
      auto_return: 'approved',
      statement_descriptor: 'PROMO CLUB TDF',
    };

    const mpResponse = await fetch('https://api.mercadopago.com/v1/payment_preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mpAccessToken}`,
      },
      body: JSON.stringify(mpBody),
    });

    const mpData = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error('MercadoPago error:', mpData);
      return new Response(JSON.stringify({ error: 'MercadoPago error', details: mpData }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Record the payment as pending
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + plan.duration_months);

    await supabase.from('membership_payments').insert({
      business_id: business.id,
      plan_id: plan.id,
      amount_ARS: plan.price_ARS,
      status: 'pending',
      mercadopago_preference_id: mpData.id,
      expires_at: expiresAt.toISOString(),
    });

    return new Response(JSON.stringify({
      checkout_url: mpData.init_point,
      sandbox_url: mpData.sandbox_init_point,
      preference_id: mpData.id,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
