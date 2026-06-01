// Flash Offer Expiration Edge Function
// Should be invoked by a cron job every minute to deactivate expired flash offers
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const now = new Date().toISOString();

    // Find flash offers that have expired based on flash_duration_minutes
    const { data: expiredFlashes, error: fetchError } = await supabase
      .from('promotions')
      .select('id, title, business_id')
      .eq('is_flash', true)
      .eq('is_active', true)
      .not('scheduled_end', 'is', null)
      .lt('scheduled_end', now);

    if (fetchError) {
      throw fetchError;
    }

    if (!expiredFlashes || expiredFlashes.length === 0) {
      return new Response(JSON.stringify({ message: 'No expired flash offers', deactivated: 0 }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Deactivate expired flash offers
    const ids = expiredFlashes.map((f) => f.id);
    const { error: updateError } = await supabase
      .from('promotions')
      .update({ is_active: false })
      .in('id', ids);

    if (updateError) {
      throw updateError;
    }

    // Also check for flash offers based on created_at + flash_duration_minutes
    const { data: timedFlashes } = await supabase
      .from('promotions')
      .select('id, title, flash_duration_minutes, created_at')
      .eq('is_flash', true)
      .eq('is_active', true)
      .not('flash_duration_minutes', 'is', null);

    if (timedFlashes) {
      const timedExpired = timedFlashes.filter((flash) => {
        const createdAt = new Date(flash.created_at).getTime();
        const expiresAt = createdAt + (flash.flash_duration_minutes || 30) * 60 * 1000;
        return Date.now() > expiresAt;
      });

      if (timedExpired.length > 0) {
        await supabase
          .from('promotions')
          .update({ is_active: false })
          .in('id', timedExpired.map((f) => f.id));
      }
    }

    // Also handle scheduled promotions
    await supabase
      .from('promotions')
      .update({ is_active: false })
      .eq('is_active', true)
      .not('scheduled_end', 'is', null)
      .lt('scheduled_end', now);

    // Activate scheduled promotions that should now be active
    await supabase
      .from('promotions')
      .update({ is_active: true })
      .eq('is_active', false)
      .not('scheduled_start', 'is', null)
      .lte('scheduled_start', now)
      .not('scheduled_end', 'is', null)
      .gt('scheduled_end', now);

    return new Response(JSON.stringify({
      message: `Deactivated ${expiredFlashes.length} expired flash offers`,
      deactivated: expiredFlashes.length,
      offers: expiredFlashes.map((f) => f.title),
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
