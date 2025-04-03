import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Battery, Book, Plug, Sun, Zap } from 'lucide-react';
import { OptimizedImage } from './ui/optimized-image';
import LazySection from './lazy-section';
import { motion } from 'framer-motion';

/**
 * Componente para la sección de afiliados de Amazon
 * Implementa la sección descrita en la documentación para promover productos
 * relacionados con energía solar y sostenibilidad
 */
const AmazonAffiliateSection = () => {
  const affiliateId = "1405250224061-20";

  // Enlaces con el ID de afiliado incluido
  const createAffiliateLink = (path: string = '') => {
    return `https://www.amazon.com${path}?tag=${affiliateId}`;
  };

  return (
    <LazySection className="py-20 bg-gray-50 dark:bg-dark-lighter relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-5 z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Productos Solares Seleccionados
          </h2>

          <div className="flex items-center justify-center my-5">
            <div className="h-0.5 flex-grow bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            <div className="mx-4 text-primary">
              <Sun size={24} />
            </div>
            <div className="h-0.5 flex-grow bg-gradient-to-r from-primary via-primary to-transparent"></div>
          </div>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Equipos y accesorios que hemos evaluado y recomendamos para tu proyecto solar
          </p>
        </div>

        {/* Condensed Intro Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              Descubre nuestra selección experta de equipos y accesorios solares en Amazon. Productos de calidad <Sun className="inline-block w-5 h-5 mx-1 text-primary align-text-bottom" /> <Battery className="inline-block w-5 h-5 mx-1 text-primary align-text-bottom" /> <Plug className="inline-block w-5 h-5 mx-1 text-primary align-text-bottom" />, evaluados por nuestro equipo técnico para potenciar tu proyecto. Al comprar a través de nuestros enlaces, apoyas nuestro contenido educativo gratuito.
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <CategoryCard            index={0}

            icon={<Sun className="w-12 h-12" />}
            title="Paneles Solares y Accesorios"
            description="Encuentra paneles eficientes y accesorios clave para tu instalación."
            link={createAffiliateLink('/s?k=portable+solar+panels')}
          />

          <CategoryCard            index={1}

            icon={<Battery className="w-12 h-12" />}
            title="Almacenamiento de Energía"
            description="Maximiza tu independencia energética con baterías y sistemas de respaldo."
            link={createAffiliateLink('/s?k=solar+battery+storage')}
          />

          <CategoryCard            index={2}

            icon={<Plug className="w-12 h-12" />}
            title="Gadgets Solares"
            description="Explora dispositivos innovadores que aprovechan la energía del sol."
            link={createAffiliateLink('/s?k=solar+gadgets')}
          />

          <CategoryCard            index={3}

            icon={<Book className="w-12 h-12" />}
            title="Guías y Recursos"
            description="Amplía tus conocimientos con libros y recursos sobre energía solar."
            link={createAffiliateLink('/s?k=solar+energy+books')}
          />
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-l-4 border-primary">
          <p className="text-gray-800 dark:text-gray-200 mb-3 font-medium">
            <strong>Nota de transparencia:</strong> Solar Fluidity participa en el programa de Afiliados de Amazon. Si realizas una compra a través de nuestros enlaces, recibiremos una pequeña comisión sin costo adicional para ti. Esto nos ayuda a mantener nuestros servicios de calidad y seguir creando contenido educativo gratuito.
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Solar Fluidity participa en el programa de Afiliados de Amazon con el ID de asociado: {affiliateId}
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
