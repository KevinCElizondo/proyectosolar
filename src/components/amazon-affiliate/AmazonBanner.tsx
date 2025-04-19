import React from 'react';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface AmazonBannerProps {
  title?: string;
  description?: string;
  className?: string;
}

const AmazonBanner: React.FC<AmazonBannerProps> = ({
  title = "Descubre nuestros productos solares recomendados",
  description = "Visita nuestra tienda para equipos y accesorios de energía solar seleccionados por expertos",
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-lg overflow-hidden shadow-lg bg-gradient-to-r from-amber-50 to-yellow-100 ${className}`}
    >
      <a 
        href="https://www.solarfluidity.shop" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
      >
        <div className="relative">
          <LazyLoadImage
            src="/images/solar-products-banner.jpg"
            alt="Productos de energía solar recomendados"
            effect="blur"
            className="w-full h-48 object-cover"
            wrapperClassName="w-full h-48"
            placeholder={
              <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
            }
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="px-6 py-4 text-center">
              <div className="font-bold text-2xl mb-2 text-white">{title}</div>
              <p className="text-white text-base">{description}</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-amber-400 text-center">
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="inline-block px-5 py-2 bg-white rounded-full font-bold text-amber-600 shadow-md"
          >
            Visitar la tienda
          </motion.span>
          <p className="text-xs mt-2 text-amber-800">
            En colaboración con Amazon Associates
          </p>
        </div>
      </a>
    </motion.div>
  );
};

export default AmazonBanner;
