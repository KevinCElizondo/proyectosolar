// Script para prueba final de la integración con PayPal para Solar Fluidity
const axios = require('axios');
const { URLSearchParams } = require('url');

// Usar directamente las credenciales que sabemos que funcionan
const CLIENT_ID = "AYUGpLGI9bpQThQSC1dcog8VDvjPq4651fmQNqOqOSyQ74b5FSYYXD_WH9L4d6-RBihZU9avI5Y40ciC";
const CLIENT_SECRET = "ECycMWodVUsKFMCJT5acAbk3wunlL6jTpgfvX1LdWMWGY0iqDnDr7if2pkMhGknDizdiFW0nchrwyJOe";
const SANDBOX_URL = 'https://api-m.sandbox.paypal.com';

// Mostrar información de la configuración
console.log('===== VERIFICACIÓN FINAL DE PAYPAL PARA SOLAR FLUIDITY =====');
console.log(`Servicio: Facturación Electrónica Offline`);
console.log(`Entorno: Sandbox`);
console.log('==========================================================\n');

// Paso 1: Obtener token de acceso
async function getAccessToken() {
  try {
    console.log('Obteniendo token de acceso...');
    
    // Codificar credenciales
    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    
    // Configurar parámetros
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    
    // Realizar solicitud
    const response = await axios({
      method: 'post',
      url: `${SANDBOX_URL}/v1/oauth2/token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`
      },
      data: params.toString()
    });
    
    console.log('✅ Token obtenido correctamente');
    return response.data.access_token;
  } catch (error) {
    console.error('❌ Error al obtener token:');
    if (error.response) {
      console.error(`Código: ${error.response.status}`);
      console.error(`Mensaje: ${JSON.stringify(error.response.data)}`);
    } else {
      console.error(error.message);
    }
    throw error;
  }
}

// Paso 2: Crear una orden simulando una factura electrónica
async function createInvoiceOrder(token) {
  try {
    console.log('\nCreando orden para factura electrónica...');
    
    // Datos de ejemplo para una factura electrónica de Solar Fluidity
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: '50.00'
        },
        description: 'Facturación Electrónica Offline - Solar Fluidity'
      }],
      application_context: {
        brand_name: 'Solar Fluidity',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: 'https://example.com/return',
        cancel_url: 'https://example.com/cancel'
      }
    };
    
    // Realizar solicitud
    const response = await axios({
      method: 'post',
      url: `${SANDBOX_URL}/v2/checkout/orders`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: orderData
    });
    
    console.log(`✅ Orden creada exitosamente: ${response.data.id}`);
    console.log(`✅ Estado: ${response.data.status}`);
    
    // Obtener URL para aprobar el pago
    const approveUrl = response.data.links.find(link => link.rel === 'approve')?.href;
    if (approveUrl) {
      console.log(`✅ URL para completar el pago: ${approveUrl}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear orden:');
    if (error.response) {
      console.error(`Código: ${error.response.status}`);
      console.error(`Mensaje: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(error.message);
    }
    throw error;
  }
}

// Función principal para ejecutar la prueba
async function runTest() {
  try {
    // Obtener token
    const token = await getAccessToken();
    
    // Crear orden para factura electrónica
    const order = await createInvoiceOrder(token);
    
    console.log('\n✅ VERIFICACIÓN COMPLETA EXITOSA');
    console.log('La integración con PayPal está lista para ser utilizada en Solar Fluidity');
    
    // Instrucciones para implementación en el código
    console.log('\n📋 INSTRUCCIONES PARA INTEGRACIÓN EN EL CÓDIGO:');
    console.log('1. El servicio PayPalService ya está configurado para usar estas credenciales');
    console.log('2. Para procesar pagos de facturas electrónicas:');
    console.log('   - Usa PayPalService.createOrder() para iniciar el proceso de pago');
    console.log('   - Redirige al cliente a la URL de aprobación');
    console.log('   - Una vez aprobado, usa PayPalService.captureOrder() para completar el pago');
    console.log('3. Siempre usa USD como moneda ya que PayPal no soporta CRC directamente');
    console.log('4. Mantén estas credenciales en el archivo .env:');
    console.log('   VITE_PAYPAL_CLIENT_ID=...tu-client-id...');
    console.log('   VITE_PAYPAL_SECRET=...tu-secret...');
    
    // URL para probar el pago
    const testPaymentUrl = order.links.find(link => link.rel === 'approve')?.href;
    if (testPaymentUrl) {
      console.log('\n🔗 PRUEBA DE PAGO:');
      console.log('Para probar el flujo completo de pago, accede a:');
      console.log(testPaymentUrl);
      console.log('\nCredenciales Sandbox:');
      console.log('- Email: sb-hocnh38905425@business.example.com');
      console.log('- Password: dPQ$<eR3');
    }
  } catch (error) {
    console.error('\n❌ ERROR EN LA PRUEBA');
    console.error('Verifica la configuración e intenta nuevamente');
  }
}

// Ejecutar prueba
runTest().catch(console.error);
