// scripts/verify-paypal.mjs
import { config } from 'dotenv';
import paypal from '@paypal/paypal-server-sdk';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Configurar dotenv para cargar variables desde .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, '../.env') });

// Configurar el entorno de PayPal (Sandbox para pruebas)
function environment() {
  const clientId = process.env.VITE_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.VITE_PAYPAL_SECRET;
  
  console.log('Verificando conexión PayPal con:');
  console.log(`- Entorno: ${process.env.NODE_ENV || 'development'} (usando Sandbox)`);
  console.log(`- Client ID: ${clientId ? clientId.substring(0, 10) + '...' : 'no configurado'}`);
  console.log(`- Secret: ${clientSecret ? '********' : 'no configurado'}`);
  
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

// Crear y verificar una orden simple
async function verifyConnection() {
  try {
    const client = new paypal.core.PayPalHttpClient(environment());
    
    // Crear una orden mínima para validar credenciales
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'CRC',
          value: '1.00'
        },
        description: 'Verificación de conexión - Solar Fluidity'
      }],
      application_context: {
        brand_name: 'Solar Fluidity',
        shipping_preference: 'NO_SHIPPING',
      }
    });
    
    // Ejecutar la solicitud
    console.log('\nEnviando solicitud de prueba a PayPal...');
    const response = await client.execute(request);
    
    console.log('\n✅ CONEXIÓN EXITOSA CON PAYPAL');
    console.log(`✅ Orden de prueba creada con ID: ${response.result.id}`);
    console.log('✅ Las credenciales de PayPal son correctas');
    console.log('\nDetalles de la respuesta:');
    console.log(`- Estado: ${response.result.status}`);
    console.log(`- URL para confirmar pago: ${response.result.links.find(link => link.rel === 'approve').href}`);
    
    return true;
  } catch (error) {
    console.error('\n❌ ERROR AL CONECTAR CON PAYPAL');
    console.error('Detalles del error:');
    if (error.response) {
      console.error(`- Código: ${error.response.statusCode}`);
      console.error(`- Mensaje: ${JSON.stringify(error.response.message || error.message)}`);
    } else {
      console.error(`- Error: ${error.message || 'Desconocido'}`);
    }
    console.error('\nVerifique que:');
    console.error('1. Las credenciales en el archivo .env sean correctas');
    console.error('2. Tenga conexión a internet');
    console.error('3. Su cuenta PayPal esté activa y configurada para aceptar pagos');
    
    return false;
  }
}

// Ejecutar la verificación
verifyConnection()
  .then(() => console.log('\nVerificación de PayPal completada.'))
  .catch(err => console.error('Error durante la verificación:', err));
