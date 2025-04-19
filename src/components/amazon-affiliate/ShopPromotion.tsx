import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '../../config/constants';

const ShopPromotion: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="w-full bg-gradient-to-r from-amber-50 via-amber-100 to-yellow-100 rounded-xl shadow-lg overflow-hidden my-8"
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-2/3 p-6 md:p-8">
          <h3 className="text-2xl font-bold text-amber-800 mb-2">Equipamiento Solar Recomendado</h3>
          <p className="text-amber-700 mb-4">
            Descubre nuestra selección de los mejores productos para energía solar residencial y comercial.
            Equipamiento de calidad seleccionado por nuestros expertos.
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="bg-amber-200 px-3 py-1 rounded-full text-amber-800 text-sm font-medium">Paneles Solares</span>
            <span className="bg-amber-200 px-3 py-1 rounded-full text-amber-800 text-sm font-medium">Inversores</span>
            <span className="bg-amber-200 px-3 py-1 rounded-full text-amber-800 text-sm font-medium">Baterías</span>
            <span className="bg-amber-200 px-3 py-1 rounded-full text-amber-800 text-sm font-medium">Accesorios</span>
          </div>
          <Link to={ROUTES.SHOP}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-5 rounded-lg transition-colors shadow-md"
            >
              Visitar Tienda
            </motion.button>
          </Link>
          <p className="text-xs text-amber-600 mt-3">En colaboración con Amazon Associates</p>
        </div>
        <div className="md:w-1/3 bg-amber-400 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">Solar Fluidity Shop</div>
            <div className="text-lg text-amber-800 mb-3">www.solarfluidity.shop</div>
            <div className="inline-block bg-white text-amber-600 font-semibold px-4 py-2 rounded-lg shadow-inner">
              ¡Envío Gratis!
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ShopPromotion;
