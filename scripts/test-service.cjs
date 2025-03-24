// Script para probar el servicio de PayPal implementado
const dotenv = require('dotenv');
const axios = require('axios');
const { URLSearchParams } = require('url');
const path = require('path');

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Configuración del cliente de PayPal
const CLIENT_ID = process.env.VITE_PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.VITE_PAYPAL_SECRET;
const SANDBOX_URL = 'https://api-m.sandbox.paypal.com';

// Mostrar información de la configuración
console.log('===== PRUEBA DE INTEGRACIÓN PAYPAL PARA SOLAR FLUIDITY =====');
console.log(`Client ID: ${CLIENT_ID.substring(0, 10)}...`);
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
    console.error('❌ Error al obtener token:', error.message);
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
          value: '50.00',
          breakdown: {
            item_total: {
              currency_code: 'USD',
              value: '50.00'
            }
          }
        },
        items: [
          {
            name: 'Facturación Electrónica',
            description: 'Plan mensual - Solar Fluidity',
            quantity: '1',
            unit_amount: {
              currency_code: 'USD',
              value: '50.00'
            },
            category: 'DIGITAL_GOODS'
          }
        ],
        description: 'Servicio de Facturación Electrónica Offline - Solar Fluidity'
      }],
      application_context: {
        brand_name: 'Solar Fluidity',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: 'https://solarfluidity.com/payment/success',
        cancel_url: 'https://solarfluidity.com/payment/cancel'
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
      console.error(JSON.stringify(error.response.data, null, 2));
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
    
    console.log('\n✅ PRUEBA COMPLETA EXITOSA');
    console.log('La integración con PayPal está lista para ser utilizada en Solar Fluidity');
    console.log('\n📋 INFORMACIÓN PARA IMPLEMENTACIÓN:');
    console.log('1. Usa PayPalService para crear órdenes de pago desde tu aplicación');
    console.log('2. Utiliza USD como moneda ya que PayPal no soporta CRC directamente');
    console.log('3. Implementa las URLs de retorno para manejar pagos exitosos y cancelados');
    console.log('4. Captura la orden una vez que el usuario complete el pago');
    
    // URL para probar el pago
    const testPaymentUrl = order.links.find(link => link.rel === 'approve')?.href;
    if (testPaymentUrl) {
      console.log('\n🔗 PRUEBA DE PAGO:');
      console.log('Usa la siguiente URL para probar el flujo completo de pago:');
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
