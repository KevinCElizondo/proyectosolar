import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/utils/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const event = JSON.parse(body);

    console.log('PayPal Webhook received:', event.event_type);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Registrar evento
    await supabase.from('paypal_events').insert({
      event_type: event.event_type,
      raw_body: event
    });

    if (event.event_type === 'BILLING.SUBSCRIPTION.ACTIVATED') {
      const userId = event.resource.custom_id;
      const subscriptionId = event.resource.id;
      const planId = event.resource.plan_id;

      if (userId) {
        await supabase
          .from('profiles')
          .update({
            plan: 'pro',
            paypal_subscription_id: subscriptionId,
            paypal_plan_id: planId,
            subscription_status: planId.includes('EARLYBIRD') ? 'trialing' : 'active'
          })
          .eq('id', userId);

        // Obtener email para el correo de bienvenida
        const { data: profile } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', userId)
          .single();

        if (profile?.email) {
          await sendEmail({
            to: profile.email,
            subject: '¡Bienvenido a SolarFluidity Pro!',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
                <div style="background-color: #0B0F19; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                  <h1 style="color: #FF5A1F; margin: 0;">SolarFluidity</h1>
                </div>
                <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eeeeee;">
                  <h2 style="color: #333;">¡Suscripción Confirmada!</h2>
                  <p style="color: #555; line-height: 1.6;">Hola,</p>
                  <p style="color: #555; line-height: 1.6;">Queremos confirmarte que hemos recibido tu suscripción y tu cuenta ha sido actualizada al plan <strong>Pro SaaS</strong>.</p>
                  <p style="color: #555; line-height: 1.6;">Ahora tienes acceso ilimitado a widgets, configuraciones paramétricas avanzadas y marca blanca.</p>
                  <br>
                  <div style="text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_API_URL || 'https://solarfluidity.com'}/dashboard" style="background-color: #FF5A1F; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold; display: inline-block;">Ir a mi Dashboard</a>
                  </div>
                  <br>
                  <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">Si tienes alguna duda, responde a este correo y nuestro equipo técnico te ayudará.</p>
                </div>
              </div>
            `
          });
        }
      }
    }

    if (event.event_type === 'BILLING.SUBSCRIPTION.CANCELLED') {
      await supabase
        .from('profiles')
        .update({ plan: 'normal', subscription_status: 'cancelled' })
        .eq('paypal_subscription_id', event.resource.id);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }
}
