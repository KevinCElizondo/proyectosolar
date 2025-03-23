import React, { lazy, Suspense, ComponentType, FC } from 'react';

/**
 * HOC que implementa carga diferida (lazy loading) para componentes completos
 * Mejora el rendimiento inicial dividiendo el bundle en chunks más pequeños
 * @param importComponent - Función que importa dinámicamente el componente
 * @param fallback - Componente a mostrar mientras se carga (opcional)
 */
function withLazyLoading<P extends object>(
  importComponent: () => Promise<{ default: ComponentType<P> }>,
  fallback: React.ReactNode = null
) {
  const LazyComponent = lazy(importComponent);
  
  // Definimos explícitamente el tipo FC para corregir el error de tipado
  const WithLazyLoading: FC<P> = (props) => (
    <Suspense fallback={fallback || <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
    </div>}>
      <LazyComponent {...props} />
    </Suspense>
  );
  
  // Establecer displayName para facilitar la depuración
  const componentName = importComponent.toString().match(/\/([^/]+)'/)?.[1] || 'LazyComponent';
  WithLazyLoading.displayName = `withLazyLoading(${componentName})`;
  
  return WithLazyLoading;
}

export default withLazyLoading;
