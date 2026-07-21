import { Resend } from 'resend';

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

let resendClient: Resend | null = null;
function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!resendClient) resendClient = new Resend(key);
  return resendClient;
}

export async function sendEmail({ to, subject, html }: EmailParams) {
  const client = getResend();
  if (!client) {
    console.warn('RESEND_API_KEY no configurada; se omite envío a', to);
    return null;
  }
  try {
    const data = await client.emails.send({
      from: 'Solar Fluidity <onboarding@resend.dev>',
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error al enviar correo:', error);
    return { success: false, error };
  }
}
