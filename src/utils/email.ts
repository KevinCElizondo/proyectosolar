import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY no está configurada, no se enviará el correo a', to);
    return null;
  }

  try {
    const data = await resend.emails.send({
      from: 'Solar Fluidity <onboarding@resend.dev>', // Usando el dominio de pruebas de Resend por defecto hasta verificar un dominio propio
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
