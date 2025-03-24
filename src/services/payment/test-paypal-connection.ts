// src/services/payment/test-paypal-connection.ts
import { PayPalService } from './paypal';

/**
 * Script para probar la conexión con PayPal y validar las credenciales
 * Este script se puede ejecutar con ts-node para verificar rápidamente la configuración
 */
async function testPayPalConnection() {
  console.log('Iniciando prueba de conexión con PayPal...');
  console.log('Modo:', process.env.NODE_ENV || 'development');
  
  try {
    const paypalService = PayPalService.getInstance();
    
    // Verificar la conexión creando una orden de prueba
    const isConnected = await paypalService.verifyConnection();
    
    if (isConnected) {
      console.log('✅ La conexión con PayPal se ha establecido correctamente.');
      console.log('✅ Las credenciales de PayPal son válidas.');
      console.log('La integración de PayPal está lista para ser utilizada en Solar Fluidity.');
    } else {
      console.error('❌ No se pudo establecer conexión con PayPal.');
      console.error('❌ Verifique sus credenciales en el archivo .env:');
      console.error('  - VITE_PAYPAL_CLIENT_ID');
      console.error('  - VITE_PAYPAL_SECRET');
    }
  } catch (error) {
    console.error('❌ Error al verificar la conexión con PayPal:');
    console.error(error);
    console.error('\nVerifique que las credenciales en el archivo .env sean correctas y que la conexión a internet funcione.');
  }
}

// Ejecutar la prueba
testPayPalConnection().catch(console.error);
