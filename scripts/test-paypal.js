// Este script verifica la conexión con PayPal usando las credenciales configuradas
// Se usa JavaScript plano para evitar problemas con la configuración del proyecto

const paypal = require('@paypal/paypal-server-sdk');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Extraer las credenciales de PayPal
const PAYPAL_CLIENT_ID = process.env.VITE_PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.VITE_PAYPAL_SECRET;

// Mostrar información de las credenciales (ocultando parte del secreto por seguridad)
console.log('Verificando conexión con PayPal:');
console.log(`- Client ID: ${PAYPAL_CLIENT_ID ? PAYPAL_CLIENT_ID.substring(0, 10) + '...' : 'no configurado'}`);
console.log(`- Secret: ${PAYPAL_SECRET ? '********' : 'no configurado'}`);

// Crear el entorno de PayPal (sandbox para pruebas)
const environment = new paypal.core.SandboxEnvironment(
  PAYPAL_CLIENT_ID,
  PAYPAL_SECRET
);

// Crear el cliente de PayPal
const client = new paypal.core.PayPalHttpClient(environment);

// Función para verificar la conexión creando una orden de prueba
async function testConnection() {
  try {
    // Crear una orden de prueba mínima
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
      }]
    });
    
    // Ejecutar la solicitud a PayPal
    console.log('\nEnviando solicitud de prueba a PayPal...');
    const response = await client.execute(request);
    
    // Mostrar resultado exitoso
    console.log('\n✅ CONEXIÓN EXITOSA CON PAYPAL');
    console.log(`✅ Orden de prueba creada con ID: ${response.result.id}`);
    console.log('✅ Las credenciales de PayPal son correctas');
    console.log(`✅ Estado de la orden: ${response.result.status}`);
    
    // Mostrar el enlace para aprobar el pago (útil para pruebas manuales)
    const approveUrl = response.result.links.find(link => link.rel === 'approve')?.href;
    if (approveUrl) {
      console.log(`✅ URL para aprobar el pago: ${approveUrl}`);
    }
    
    return true;
  } catch (error) {
    // Mostrar información detallada del error
    console.error('\n❌ ERROR AL CONECTAR CON PAYPAL');
    console.error('Detalles del error:');
    
    if (error.response) {
      console.error(`- Código HTTP: ${error.response.statusCode}`);
      try {
        console.error(`- Mensaje: ${JSON.stringify(error.response.message || 'No disponible')}`);
      } catch (e) {
        console.error(`- Mensaje: ${error.message || 'Error desconocido'}`);
      }
    } else {
      console.error(`- Error: ${error.message || 'Error desconocido'}`);
    }
    
    console.error('\nVerifique que:');
    console.error('1. Las credenciales en el archivo .env sean correctas');
    console.error('2. Tenga conexión a internet activa');
    console.error('3. Su cuenta PayPal esté activa y configurada para aceptar pagos');
    console.error('4. Esté usando un Client ID y Secret del mismo entorno (Sandbox o Producción)');
    
    return false;
  }
}

// Ejecutar la prueba de conexión
testConnection()
  .then(() => {
    console.log('\nPrueba de conexión con PayPal finalizada.');
  })
  .catch(err => {
    console.error('Error inesperado durante la prueba:', err);
  });
