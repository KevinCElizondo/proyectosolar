import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Inicializar Resend (requiere variable de entorno RESEND_API_KEY)
const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, address, product, width } = body;

    if (!name || !email || !phone || !address) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'tucorreo@solarfluidity.com'; // Cambiar por tu correo real

    // Construir el correo
    const emailHtml = `
      <h2>Nuevo Pedido de Hardware: ${product === 'grill' ? 'Cama de Cultivo Pro' : product}</h2>
      <p><strong>Tamaño Configurado:</strong> ${width}m</p>
      <hr />
      <h3>Datos del Cliente</h3>
      <ul>
        <li><strong>Nombre:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Teléfono / WhatsApp:</strong> ${phone}</li>
      </ul>
      <h3>Dirección de Entrega</h3>
      <p>${address}</p>
      <br/>
      <p><em>Recuerda contactar al cliente para cobrar el 50% de anticipo ($599.50) antes de iniciar la fabricación.</em></p>
    `;

    // Enviar correo a ti mismo para notificarte del pedido
    const data = await resend.emails.send({
      from: 'SolarFluidity Orders <onboarding@resend.dev>', // Usar dominio verificado en prod
      to: [adminEmail],
      subject: `🔥 Nuevo Pedido - ${name}`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error enviando email:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
