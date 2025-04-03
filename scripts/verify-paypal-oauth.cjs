// Este script verifica la conexión con PayPal usando OAuth (flujo recomendado)
// Usando la extensión .cjs para asegurar compatibilidad con CommonJS en un proyecto ESM
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const { URLSearchParams } = require('url');

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Use Production credentials
const PAYPAL_CLIENT_ID = process.env.PAYPAL_LIVE_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_LIVE_SECRET;

// Determinar ambiente (sandbox o producción)
// Use Production URL
const PAYPAL_API_BASE = 'https://api-m.paypal.com';

// Información básica sobre la configuración
console.log('Verificando conexión con PayPal usando OAuth:');
console.log(`- Ambiente: Producción`); // Updated log message
console.log(`- Client ID: ${PAYPAL_CLIENT_ID ? PAYPAL_CLIENT_ID.substring(0, 10) + '...' : 'no configurado'}`);
console.log(`- Secret: ${PAYPAL_SECRET ? '********' : 'no configurado'}`);

// Función para obtener token de acceso
async function getAccessToken() {
  try {
    console.log('\nObteniendo token de acceso...');
    
    // Crear credenciales en formato Base64
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
    
    // Usar URLSearchParams en lugar de querystring (recomendado)
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    
    // Configurar solicitud para obtener token
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
      console.error(`- Mensaje: ${JSON.stringify(error.response.data)}`);
    } else {
      console.error(`- Error: ${error.message}`);
    }
    throw error;
  }
}

// Función para verificar el token con una llamada a la API de PayPal
async function verifyApiAccess(accessToken) {
  try {
    console.log('\nVerificando acceso a la API con el token...');
    
    // Llamar a un endpoint de PayPal para verificar el token
    const response = await axios({
      method: 'get',
      url: `${PAYPAL_API_BASE}/v1/identity/oauth2/userinfo?schema=paypalv1.1`,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    console.log('✅ Verificación exitosa del token');
    console.log(`- Respuesta: ${JSON.stringify(response.data, null, 2)}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error al verificar el token:');
    if (error.response) {
      console.error(`- Código HTTP: ${error.response.status}`);
      console.error(`- Mensaje: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(`- Error: ${error.message}`);
    }
    return false;
  }
}

// Función principal para verificar la conexión completa
async function verifyPayPalConnection() {
  try {
    // Paso 1: Obtener token de acceso
    const accessToken = await getAccessToken();
    
    // Paso 2: Verificar el token con una llamada a la API
    const isValid = await verifyApiAccess(accessToken);
    
    if (isValid) {
      console.log('\n✅ CONEXIÓN EXITOSA CON PAYPAL');
      console.log('✅ Las credenciales de PayPal son correctas y funcionan');
      console.log('✅ La integración con PayPal está lista para ser utilizada');
      
      // Sugerencia de uso en el código de la aplicación
      console.log('\nPara usar estas credenciales en su aplicación:');
      console.log('1. Asegúrese de que las variables están correctamente configuradas en environment.ts');
      console.log('2. Use el servicio PayPalService implementado para crear y capturar órdenes');
    } else {
      console.error('\n❌ ERROR: El token fue obtenido pero no se pudo validar');
      console.error('Verifique que su cuenta PayPal tenga los permisos necesarios');
    }
  } catch (error) {
    console.error('\n❌ ERROR EN LA VERIFICACIÓN DE PAYPAL');
    console.error('Por favor, verifique que:');
    console.error('1. Las credenciales en el archivo .env sean correctas');
    console.error('2. Tenga una conexión a internet activa');
    console.error('3. Su cuenta PayPal esté activa');
    console.error('4. Las credenciales pertenezcan al mismo ambiente (Sandbox o Producción)');
  }
}

// Ejecutar la verificación
verifyPayPalConnection();
