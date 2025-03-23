import React, { lazy, Suspense, useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LazySectionProps {
  children: ReactNode;
  threshold?: number; // Porcentaje de visibilidad para activar
  className?: string;
  showSpinner?: boolean;
  delay?: number; // Retraso opcional para animaciones escalonadas
}

/**
 * Componente que carga el contenido de forma diferida cuando se acerca al viewport
 * Mejora el rendimiento inicial evitando renderizar elementos fuera de la vista
 */
const LazySection = ({ 
  children, 
  threshold = 0.1, 
  className = '',
  showSpinner = false,
  delay = 0
}: LazySectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const [sectionRef, setSectionRef] = useState<HTMLDivElement | null>(null);
  
  useEffect(() => {
    if (!sectionRef) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasBeenVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin: '100px', // Cargar un poco antes de ser visible
      }
    );
    
    observer.observe(sectionRef);
    
    return () => {
      if (sectionRef) observer.unobserve(sectionRef);
    };
  }, [sectionRef, threshold]);
  
  const renderContent = () => {
    if (!hasBeenVisible && showSpinner) {
      return (
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={hasBeenVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ 
          duration: 0.5, 
          delay, 
          ease: "easeOut" 
        }}
      >
        {children}
      </motion.div>
    );
  };
  
  return (
    <div ref={setSectionRef} className={className}>
      {renderContent()}
    </div>
  );
};

export default LazySection;
