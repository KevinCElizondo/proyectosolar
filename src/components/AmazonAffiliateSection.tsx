import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Battery, Book, ExternalLink, Plug, ShoppingBag, Sun, Zap } from 'lucide-react';
import { OptimizedImage } from './ui/optimized-image';
import LazySection from './lazy-section';
import { motion } from 'framer-motion';
import { ROUTES } from '@/config/constants';
import { Link } from 'react-router-dom';
import ShopPromotion from './amazon-affiliate/ShopPromotion';

/**
 * Componente para la sección de afiliados de Amazon
 * Implementa la sección descrita en la documentación para promover productos
 * relacionados con energía solar y sostenibilidad
 * 
 * Actualizado para dirigir a los usuarios a solarfluidity.shop
 */
const AmazonAffiliateSection = () => {
  // La tienda ahora está alojada en solarfluidity.shop
  const shopUrl = "https://www.solarfluidity.shop";

  // Enlaces ahora dirigen a solarfluidity.shop
  const createAffiliateLink = (path: string = '') => {
    return `${shopUrl}${path}`;
  };

  return (
    <LazySection className="py-20 bg-gray-50 dark:bg-dark-lighter relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-5 z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Nuestra Tienda de Productos Solares
          </h2>

          <div className="flex items-center justify-center my-5">
            <div className="h-0.5 flex-grow bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            <div className="mx-4 text-primary">
              <ShoppingBag size={24} />
            </div>
            <div className="h-0.5 flex-grow bg-gradient-to-r from-primary via-primary to-transparent"></div>
          </div>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Visita nuestra tienda especializada en <span className="font-semibold">solarfluidity.shop</span>
          </p>
        </div>
        
        {/* ShopPromotion Component */}
        <ShopPromotion />
        
        {/* Call to Action */}
        <div className="text-center mt-12 mb-10">
          <Link to={ROUTES.SHOP} className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
            Visitar Tienda Completa <ArrowRight size={18} />
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            O accede directamente: <a href="https://www.solarfluidity.shop" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline inline-flex items-center">solarfluidity.shop <ExternalLink size={14} className="ml-1" /></a>
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          <CategoryCard index={0}
            icon={<Sun className="w-12 h-12" />}
            title="Paneles Solares Premium"
            description="Equipos de alta eficiencia para proyectos residenciales y comerciales."
            link={shopUrl}
          />

          <CategoryCard index={1}
            icon={<Battery className="w-12 h-12" />}
            title="Almacenamiento y Baterías"
            description="Soluciones de almacenamiento para maximizar tu independencia energética."
            link={shopUrl}
          />
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6 border-l-4 border-amber-500 mb-12">
          <p className="text-gray-800 dark:text-gray-200 mb-3 font-medium">
            <strong>Sobre nuestra tienda:</strong> En Solar Fluidity Shop ofrecemos una cuidadosa selección de productos para instalaciones solares y electromecánicas, todos evaluados por nuestro equipo técnico para asegurar calidad y rendimiento óptimo en los proyectos de nuestros clientes.
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Visita <a href={shopUrl} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">www.solarfluidity.shop</a> para descubrir nuestra colección completa.
          </p>
        </div>
      </div>
    </LazySection>
  );
};

// Componente interno para las tarjetas de categoría
interface CategoryCardProps {
  index: number; // Added for staggered animation
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

const CategoryCard = ({ index, icon, title, description, link }: CategoryCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }} // Staggered delay
    viewport={{ once: true }}
    className="h-full" // Ensure motion div takes full height for flex layout
  >
    <Card className="p-6 bg-white dark:bg-dark border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:-translate-y-2 transition-all duration-300 hover:shadow-xl flex flex-col h-full">
    <div className="text-primary mb-4 flex justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white text-center">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6 text-center flex-grow">
      {description}
    </p>
    <Button
      className="rounded-full bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 w-full"
      asChild
    >
      <a href={link} target="_blank" rel="noopener noreferrer">
        Ver Productos
      </a>
    </Button>
  </Card>
  </motion.div>
);

export default AmazonAffiliateSection;
