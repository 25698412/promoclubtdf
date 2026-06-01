// MercadoPago Webhook Handler
// Receives payment notifications and updates membership status
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

    const mpAccessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
    if (!mpAccessToken) {
      return new Response('ok', { status: 200 });
    }

    const body = await req.json();

    // MercadoPago sends different notification types
    if (body.type === 'payment') {
      const paymentId = body.data?.id;
      if (!paymentId) {
        return new Response('ok', { status: 200 });
      }

      // Fetch payment details from MercadoPago
      const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { 'Authorization': `Bearer ${mpAccessToken}` },
      });
      const payment = await mpResponse.json();

      if (!mpResponse.ok) {
        console.error('Failed to fetch payment:', payment);
        return new Response('ok', { status: 200 });
      }

      // Parse external_reference to get business_id and plan_id
      let externalRef: { business_id?: string; plan_id?: string } = {};
      try {
        externalRef = JSON.parse(payment.external_reference || '{}');
      } catch {
        console.error('Invalid external_reference');
        return new Response('ok', { status: 200 });
      }

      if (!externalRef.business_id || !externalRef.plan_id) {
        return new Response('ok', { status: 200 });
      }

      // Map MercadoPago status to our status
      let status: string;
      switch (payment.status) {
        case 'approved': status = 'approved'; break;
        case 'rejected': status = 'rejected'; break;
        case 'refunded': status = 'refunded'; break;
        default: status = 'pending';
      }

      // Update the payment record
      const { data: existingPayment } = await supabase
        .from('membership_payments')
        .select('id, plan_id, business_id')
        .eq('mercadopago_preference_id', payment.external_reference)
        .single();

      if (existingPayment) {
        await supabase.from('membership_payments').update({
          status,
          mercadopago_payment_id: String(paymentId),
          payment_method: payment.payment_method_id,
          paid_at: payment.status === 'approved' ? payment.date_approved : null,
        }).eq('id', existingPayment.id);

        // If approved, activate the membership on the business
        if (status === 'approved') {
          const { data: plan } = await supabase
            .from('membership_plans')
            .select('duration_months')
            .eq('id', existingPayment.plan_id)
            .single();

          if (plan) {
            const expiresAt = new Date();
            expiresAt.setMonth(expiresAt.getMonth() + plan.duration_months);

            await supabase.from('businesses').update({
              membership_plan_id: existingPayment.plan_id,
              membership_expires_at: expiresAt.toISOString(),
            }).eq('id', existingPayment.business_id);
          }
        }
      } else {
        // Fallback: try to find by mercadopago_preference_id in the payment record
        const { data: paymentByMpId } = await supabase
          .from('membership_payments')
          .select('id, plan_id, business_id')
          .eq('mercadopago_payment_id', String(paymentId))
          .single();

        if (paymentByMpId) {
          await supabase.from('membership_payments').update({
            status,
            payment_method: payment.payment_method_id,
            paid_at: payment.status === 'approved' ? payment.date_approved : null,
          }).eq('id', paymentByMpId.id);

          if (status === 'approved') {
            const { data: plan } = await supabase
              .from('membership_plans')
              .select('duration_months')
              .eq('id', paymentByMpId.plan_id)
              .single();

            if (plan) {
              const expiresAt = new Date();
              expiresAt.setMonth(expiresAt.getMonth() + plan.duration_months);
              await supabase.from('businesses').update({
                membership_plan_id: paymentByMpId.plan_id,
                membership_expires_at: expiresAt.toISOString(),
              }).eq('id', paymentByMpId.business_id);
            }
          }
        }
      }

      // Track analytics
      await supabase.from('analytics_events').insert({
        event_type: 'membership_payment',
        entity_type: 'membership',
        entity_id: externalRef.plan_id,
        metadata: JSON.stringify({
          business_id: externalRef.business_id,
          payment_id: paymentId,
          status,
          amount: payment.transaction_amount,
        }),
      });
    }

    return new Response('ok', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('ok', { status: 200 }); // Always return 200 to MercadoPago
  }
});
