import React, { memo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  effect?: 'blur' | 'opacity' | 'black-and-white';
  threshold?: number;
  placeholderSrc?: string;
}

/**
 * Componente para cargar imágenes de forma optimizada con carga diferida
 * Mejora el rendimiento de la página al cargar imágenes solo cuando son visibles
 */
const OptimizedImage = memo(({
  src,
  alt,
  className = '',
  width,
  height,
  effect = 'blur',
  threshold = 100,
  placeholderSrc
}: OptimizedImageProps) => {
  return (
    <LazyLoadImage
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      effect={effect}
      threshold={threshold}
      placeholderSrc={placeholderSrc}
    />
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export { OptimizedImage };
