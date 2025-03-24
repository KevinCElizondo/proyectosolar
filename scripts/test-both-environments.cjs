// Script para probar la conexión con PayPal en ambos ambientes (Sandbox y Producción)
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const { URLSearchParams } = require('url');

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PAYPAL_CLIENT_ID = process.env.VITE_PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.VITE_PAYPAL_SECRET;

console.log('===== VERIFICACIÓN DE CREDENCIALES PAYPAL =====');
console.log(`Client ID: ${PAYPAL_CLIENT_ID ? PAYPAL_CLIENT_ID.substring(0, 12) + '...' : 'no configurado'}`);
console.log(`Secret: ${PAYPAL_SECRET ? '********' : 'no configurado'}`);
console.log('==============================================\n');

// Función para obtener token de acceso
async function getAccessToken(apiBase) {
  try {
    // Crear credenciales en formato Base64
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
    
    // Usar URLSearchParams
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    
    // Solicitud para obtener token
    const response = await axios({
      method: 'post',
      url: `${apiBase}/v1/oauth2/token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`
      },
      data: params.toString()
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data : error.message
    };
  }
}

// Función principal para verificar ambos ambientes
async function verifyBothEnvironments() {
  // Probar ambiente Sandbox
  console.log('🔍 Probando conexión con SANDBOX...');
  const sandboxResult = await getAccessToken('https://api-m.sandbox.paypal.com');
  
  if (sandboxResult.success) {
    console.log('✅ CONEXIÓN EXITOSA CON SANDBOX');
    console.log(`✅ Token: ${sandboxResult.data.access_token.substring(0, 15)}...`);
    console.log(`✅ Expira en: ${sandboxResult.data.expires_in} segundos`);
    console.log(`✅ App ID: ${sandboxResult.data.app_id}`);
  } else {
    console.log('❌ ERROR AL CONECTAR CON SANDBOX:');
    console.log(sandboxResult.error);
  }
  
  console.log('\n-----------------------------------------\n');
  
  // Probar ambiente Producción
  console.log('🔍 Probando conexión con PRODUCCIÓN...');
  const productionResult = await getAccessToken('https://api-m.paypal.com');
  
  if (productionResult.success) {
    console.log('✅ CONEXIÓN EXITOSA CON PRODUCCIÓN');
    console.log(`✅ Token: ${productionResult.data.access_token.substring(0, 15)}...`);
    console.log(`✅ Expira en: ${productionResult.data.expires_in} segundos`);
    console.log(`✅ App ID: ${productionResult.data.app_id}`);
  } else {
    console.log('❌ ERROR AL CONECTAR CON PRODUCCIÓN:');
    console.log(productionResult.error);
  }
  
  console.log('\n-----------------------------------------\n');
  
  // Conclusión
  if (sandboxResult.success) {
    console.log('✅ CONCLUSIÓN: Sus credenciales funcionan en el ambiente SANDBOX');
    console.log('🔧 Asegúrese de configurar su servicio de PayPal para usar la URL de Sandbox:');
    console.log('   https://api-m.sandbox.paypal.com');
    return true;
  } else if (productionResult.success) {
    console.log('✅ CONCLUSIÓN: Sus credenciales funcionan en el ambiente de PRODUCCIÓN');
    console.log('🔧 Asegúrese de configurar su servicio de PayPal para usar la URL de Producción:');
    console.log('   https://api-m.paypal.com');
    return true;
  } else {
    console.log('❌ CONCLUSIÓN: Sus credenciales no funcionan en ningún ambiente');
    console.log('Por favor, verifique que:');
    console.log('1. Las credenciales en el archivo .env sean correctas y actuales');
    console.log('2. Su cuenta PayPal esté activa');
    console.log('3. Las credenciales tengan permisos para usar la API de PayPal');
    console.log('\n📝 SUGERENCIA: Acceda al Dashboard de desarrollador de PayPal y genere nuevas credenciales:');
    console.log('   https://developer.paypal.com/dashboard/');
    return false;
  }
}

// Ejecutar verificación
verifyBothEnvironments()
  .then(() => console.log('\nVerificación completada.'))
  .catch(err => console.error('Error durante la verificación:', err));
