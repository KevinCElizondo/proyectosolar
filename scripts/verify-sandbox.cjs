// Script para verificar específicamente con el ambiente Sandbox de PayPal
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const { URLSearchParams } = require('url');

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Usar las credenciales proporcionadas directamente para asegurar la prueba correcta
const PAYPAL_CLIENT_ID = "AYUGpLGI9bpQThQSC1dcog8VDvjPq4651fmQNqOqOSyQ74b5FSYYXD_WH9L4d6-RBihZU9avI5Y40ciC";
const PAYPAL_SECRET = "ECycMWodVUsKFMCJT5acAbk3wunlL6jTpgfvX1LdWMWGY0iqDnDr7if2pkMhGknDizdiFW0nchrwyJOe";

// URL específica para Sandbox
const PAYPAL_API_BASE = 'https://api-m.sandbox.paypal.com';

console.log('===== VERIFICACIÓN DE CREDENCIALES PAYPAL SANDBOX =====');
console.log(`App Name: Solar Fluisity`);
console.log(`Client ID: ${PAYPAL_CLIENT_ID.substring(0, 12)}...`);
console.log(`Secret: ********`);
console.log(`Sandbox Account: sb-hocnh38905425@business.example.com`);
console.log('=======================================================\n');

// Función para obtener token de acceso
async function getAccessToken() {
  try {
    console.log('Obteniendo token de acceso...');
    
    // Crear credenciales en formato Base64
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
    
    // Usar URLSearchParams
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    
    // Solicitud para obtener token
    const response = await axios({
      method: 'post',
      url: `${PAYPAL_API_BASE}/v1/oauth2/token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`
      },
      data: params.toString()
    });
    
    // Extraer información del token
    const { access_token, expires_in, app_id } = response.data;
    
    console.log('✅ Token de acceso obtenido correctamente');
    console.log(`- Token: ${access_token.substring(0, 15)}...`);
    console.log(`- Expira en: ${expires_in} segundos`);
    console.log(`- App ID: ${app_id}`);
    
    return access_token;
  } catch (error) {
    console.error('❌ Error al obtener token de acceso:');
    if (error.response) {
      console.error(`- Código HTTP: ${error.response.status}`);
      console.error(`- Mensaje: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(`- Error: ${error.message}`);
    }
    throw error;
  }
}

// Función para crear una orden de prueba
async function createTestOrder(accessToken) {
  try {
    console.log('\nCreando orden de prueba...');
    
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD', // Usando USD porque PayPal no soporta CRC directamente
          value: '1.00'
        },
        description: 'Solar Fluisity - Prueba de conexión'
      }],
      application_context: {
        brand_name: 'Solar Fluisity',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: 'https://example.com/return',
        cancel_url: 'https://example.com/cancel'
      }
    };
    
    const response = await axios({
      method: 'post',
      url: `${PAYPAL_API_BASE}/v2/checkout/orders`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      data: orderData
    });
    
    console.log('✅ Orden creada exitosamente');
    console.log(`- Order ID: ${response.data.id}`);
    console.log(`- Estado: ${response.data.status}`);
    
    // Encontrar y mostrar URL para aprobar el pago
    const approveUrl = response.data.links.find(link => link.rel === 'approve')?.href;
    if (approveUrl) {
      console.log(`- URL para aprobar el pago: ${approveUrl}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear orden de prueba:');
    if (error.response) {
      console.error(`- Código HTTP: ${error.response.status}`);
      console.error(`- Mensaje: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(`- Error: ${error.message}`);
    }
    throw error;
  }
}

// Función principal para realizar toda la verificación
async function verifySandboxConnection() {
  try {
    // Paso 1: Obtener token de acceso
    const accessToken = await getAccessToken();
    
    // Paso 2: Crear una orden de prueba
    const orderData = await createTestOrder(accessToken);
    
    console.log('\n✅ VERIFICACIÓN COMPLETA EXITOSA');
    console.log('✅ Las credenciales de PayPal Sandbox son válidas');
    console.log('✅ La integración con PayPal está lista para ser utilizada');
    
    console.log('\n📝 INFORMACIÓN IMPORTANTE:');
    console.log('1. Estas credenciales son para el ambiente SANDBOX (pruebas)');
    console.log('2. Para procesar pagos reales, deberá cambiar a credenciales de PRODUCCIÓN');
    console.log('3. Para probar el flujo completo de pago, use la URL generada y la cuenta Sandbox:');
    console.log('   - Email: sb-hocnh38905425@business.example.com');
    console.log('   - Password: dPQ$<eR3');
    
    return true;
  } catch (error) {
    console.error('\n❌ ERROR EN LA VERIFICACIÓN DE PAYPAL SANDBOX');
    console.error('Por favor, intente las siguientes soluciones:');
    console.error('1. Verifique que las credenciales sean correctas');
    console.error('2. Asegúrese de tener conexión a internet activa');
    console.error('3. Verifique que la cuenta Sandbox esté activa en el Dashboard de PayPal');
    console.error('4. Intente generar nuevas credenciales desde el Dashboard de PayPal');
    
    return false;
  }
}

// Ejecutar la verificación
verifySandboxConnection()
  .then(() => console.log('\nPrueba de conexión finalizada.'))
  .catch(err => console.error('Error durante la verificación:', err));
