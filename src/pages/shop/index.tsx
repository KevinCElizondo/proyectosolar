import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AmazonBanner from '../../components/amazon-affiliate/AmazonBanner';

const ShopRedirectPage: React.FC = () => {
  useEffect(() => {
    // Registrar analítica del clic (en una implementación real)
    console.log('Shop redirect page visited');
    
    // Configurar redirección después de un breve retraso
    const redirectTimer = setTimeout(() => {
      window.location.href = 'https://www.solarfluidity.shop';
    }, 3000); // 3 segundos antes de redirigir
    
    return () => clearTimeout(redirectTimer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Tienda Solar Fluidity
          </h1>
          <p className="text-lg text-gray-600">
            Te estamos redirigiendo a nuestra tienda de productos solares recomendados...
          </p>
        </div>
        
        <AmazonBanner 
          className="mb-10"
          title="Productos Solares Seleccionados" 
          description="Equipos y accesorios de calidad para instalaciones solares residenciales y comerciales" 
        />
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-700 mb-4">
            Si no eres redirigido automáticamente, haz clic en el siguiente botón:
          </p>
          <a
            href="https://www.solarfluidity.shop"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors"
          >
            Ir a la tienda ahora
          </a>
        </div>
      </div>
    </div>
  );
};

export default ShopRedirectPage;
