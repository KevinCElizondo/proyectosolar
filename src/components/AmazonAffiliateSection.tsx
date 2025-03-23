import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Battery, Book, Plug, Sun, Zap } from 'lucide-react';
import { OptimizedImage } from './ui/optimized-image';
import LazySection from './lazy-section';

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
        
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="flex-1">
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              En Solar Fluidity hemos evaluado cuidadosamente una selección de productos disponibles en Amazon que cumplen con nuestros estándares de calidad, eficiencia y sostenibilidad.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              Cada recomendación ha sido analizada por nuestro equipo técnico para asegurar que complementen perfectamente tu instalación solar o proyecto de eficiencia energética.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Al realizar tu compra a través de nuestros enlaces, apoyas el desarrollo continuo de recursos educativos gratuitos y herramientas para la comunidad de energía renovable en Costa Rica.
            </p>
          </div>
          
          <div className="flex-1 flex justify-center">
            <OptimizedImage 
              src="/docs/Afiliados/amazon_associates.png"
              alt="Productos Solares Recomendados"
              className="rounded-lg shadow-xl hover:-translate-y-2 transition-transform duration-300"
              width={400}
              height={300}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <CategoryCard 
            icon={<Sun className="w-12 h-12" />}
            title="Paneles Solares y Accesorios"
            description="Soluciones compactas para proyectos residenciales y portátiles"
            link={createAffiliateLink('/s?k=portable+solar+panels')}
          />
          
          <CategoryCard 
            icon={<Battery className="w-12 h-12" />}
            title="Almacenamiento de Energía"
            description="Baterías y sistemas de respaldo para maximizar tu autonomía"
            link={createAffiliateLink('/s?k=solar+battery+storage')}
          />
          
          <CategoryCard 
            icon={<Plug className="w-12 h-12" />}
            title="Gadgets Solares"
            description="Dispositivos innovadores alimentados por energía solar"
            link={createAffiliateLink('/s?k=solar+gadgets')}
          />
          
          <CategoryCard 
            icon={<Book className="w-12 h-12" />}
            title="Guías y Recursos"
            description="Literatura especializada para profundizar tu conocimiento"
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
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

const CategoryCard = ({ icon, title, description, link }: CategoryCardProps) => (
  <Card className="p-6 bg-white dark:bg-dark border-gray-200 dark:border-gray-800 hover:-translate-y-2 transition-all duration-300 hover:shadow-lg flex flex-col">
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
);

export default AmazonAffiliateSection;
