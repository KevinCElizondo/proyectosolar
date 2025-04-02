# Estrategia de Afiliados Amazon: "Solar Setup Advisor & Recommended Gear"

## 1. Visión General

Esta estrategia busca integrar una sección de valor añadido dentro de Solar Fluidity (o en un recurso vinculado) que funcione como un asesor para los usuarios interesados en optimizar su configuración solar o mejorar la eficiencia energética de su hogar/negocio. En lugar de solo mostrar productos, se enfoca en proveer guías, herramientas simples y recomendaciones contextualizadas, utilizando enlaces de afiliados de Amazon para productos complementarios.

El objetivo es atraer y retener usuarios ofreciendo contenido útil, mientras se genera un flujo de ingresos adicional con bajo mantenimiento, centrándose en accesorios y productos de soporte en lugar de componentes solares principales.

## 2. Componentes de la Estrategia

### 2.1. Sección "Advisor" en la Plataforma/Web

- **Ubicación:** Idealmente integrada como una sección dentro de la aplicación Solar Fluidity o en una página de recursos/blog claramente vinculada desde la aplicación.
- **Componente React:** Se ha creado una base para esto en `src/components/AffiliateAdvisorSection.tsx`. Este componente debe ser integrado en la estructura de la interfaz de usuario.
- **Contenido Principal:**
    - **Guías y Checklists:** Artículos cortos y prácticos sobre temas relevantes (mantenimiento básico, eficiencia, monitoreo, accesorios de respaldo). Estos pueden ser archivos Markdown almacenados en `docs/Afiliados/Guias/` y potencialmente cargados dinámicamente en el componente.
    - **Recomendaciones de Productos:** Selección curada de productos *complementarios* disponibles en Amazon (kits de limpieza, monitores de energía, bombillos LED eficientes, estaciones de energía portátiles, herramientas básicas, etc.). Cada producto debe tener una breve descripción y un enlace de afiliado generado dinámicamente.
    - **(Futuro) Calculadoras/Estimadores:** Herramientas interactivas simples (ej. estimador de ahorro, recomendador de tamaño de batería básico) que pueden ofrecer recomendaciones de productos relevantes al final. Podrían usar los agentes IA locales (Ollama) para cálculos simples.

### 2.2. Enfoque en Productos Complementarios

- **Minimizar Mantenimiento:** Al evitar recomendar paneles solares o inversores específicos (que cambian rápidamente y conllevan responsabilidad), nos centramos en categorías más estables:
    - Mantenimiento y Limpieza
    - Monitoreo y Control (Smart Home)
    - Eficiencia Energética (Iluminación, Termostatos)
    - Accesorios de Respaldo y Seguridad Eléctrica
    - Herramientas básicas para DIY
- **Relevancia:** Los productos deben ser genuinamente útiles para alguien con una instalación solar o interesado en la eficiencia.

### 2.3. Generación de Enlaces de Afiliado

- **Tag de Afiliado:** Utilizar consistentemente tu ID de asociado de Amazon (ej. `your_affiliate_id-20`). Este ID debe ser configurable, idealmente a través de una variable de entorno (`VITE_AMAZON_AFFILIATE_TAG`).
- **Función Auxiliar:** Usar una función (como la incluida en `AffiliateAdvisorSection.tsx`) para añadir el tag a las URLs base de Amazon de forma segura.
- **Transparencia:** Incluir siempre una nota clara indicando que los enlaces son de afiliado y que se recibe una comisión sin costo adicional para el usuario, como se sugiere en el componente y en las políticas de Amazon. Usar `rel="noopener noreferrer sponsored"` en los enlaces.

### 2.4. Integración Opcional con IA (Ollama)

- **Calculadoras Inteligentes:** Los agentes locales de Ollama podrían procesar entradas del usuario (ej. "Mi factura es X, ¿cuánto ahorraría?") para dar estimaciones y sugerir productos (ej. monitores de energía).
- **Generación Dinámica de Contenido:** Un agente podría responder a preguntas como "¿Qué necesito para limpiar mis paneles?" y generar una respuesta que incluya enlaces de afiliados a kits de limpieza.

## 3. Implementación Técnica (Resumen)

1.  **Integrar Componente:** Añadir `<AffiliateAdvisorSection />` en la parte apropiada de la aplicación React.
2.  **Configurar Tag:** Definir `VITE_AMAZON_AFFILIATE_TAG` en el archivo `.env` (o `.env.local`). **Recuerda reemplazar `'your_affiliate_id-20'` en el código y la configuración.**
3.  **Poblar Contenido:**
    *   Crear los archivos Markdown iniciales para las guías en `docs/Afiliados/Guias/`.
    *   Actualizar la lista `recommendedProducts` en `AffiliateAdvisorSection.tsx` con ASINs y URLs reales de Amazon.com (asegúrate de que envíen a Costa Rica o usa Amazon Global).
4.  **(Opcional) Desarrollar Calculadoras/IA:** Implementar la lógica para las calculadoras o la interacción con agentes IA si se decide incluir.
5.  **Estilo y UX:** Asegurar que la sección se integre visualmente con el resto de la plataforma y sea fácil de navegar.

## 4. Estrategia de Atracción y Mantenimiento

- **Valor Añadido:** Posicionar la sección como un recurso útil y gratuito para usuarios y potenciales clientes.
- **Promoción Cruzada:** Enlazar a guías relevantes desde otras secciones de la app o blog.
- **Mantenimiento Bajo:**
    - Revisar enlaces rotos semestralmente.
    - Añadir nuevo contenido (guías/productos) gradualmente según el interés y la disponibilidad.
    - Actualizar productos solo si un modelo recomendado se vuelve obsoleto o deja de estar disponible.

Esta estrategia busca un equilibrio entre generar ingresos por afiliados y ofrecer valor real al usuario, fomentando la confianza y el uso continuado de Solar Fluidity.
