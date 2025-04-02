# Guía de Experiencia de Usuario y Diseño de Interfaz para Solar Fluidity

## Principios de Diseño

### 1. Simplicidad
- Interfaces limpias y minimalistas para facilitar la gestión de facturas y proyectos
- Información fiscal y técnica presentada de manera clara y concisa
- Eliminación de elementos innecesarios para mejorar la eficiencia operativa

### 2. Consistencia
- Patrones de diseño uniformes entre los módulos de facturación, gestión de proyectos y automatizaciones
- Comportamiento predecible de elementos interactivos en todas las secciones
- Terminología fiscal y técnica consistente en toda la plataforma

### 3. Retroalimentación
- Respuestas visuales claras sobre el estado de facturas electrónicas y proyectos
- Mensajes de estado y confirmación para acciones críticas (emisión de facturas, cambios en proyectos)
- Indicadores de progreso para operaciones largas como generación de documentos XML/PDF

## Componentes UI

### Navegación
- Barra de navegación fija en la parte superior con acceso rápido a facturación y proyectos
- Menú lateral colapsable organizado por módulos: Facturación Electrónica, Proyectos Solares/Electromecánicos, Automatizaciones
- Breadcrumbs para navegación jerárquica en estructura de proyectos y documentos fiscales

### Formularios
- Campos fiscales obligatorios claramente marcados según normativa de Costa Rica
- Validación en tiempo real de datos tributarios y técnicos
- Mensajes de error específicos con referencia a la normativa aplicable
- Autocompletado de datos fiscales y técnicos frecuentes, clientes y componentes de proyectos

### Tablas y Listas
- Ordenamiento y filtrado avanzado para facturas y proyectos
- Paginación optimizada para catálogos extensos de productos/servicios
- Acciones en línea para documentos fiscales y tareas de proyectos
- Indicadores visuales del estado de facturas (borrador, emitida, aceptada, rechazada)

### Modales y Diálogos
- Uso para acciones importantes o destructivas
- Foco en la tarea principal
- Opciones claras de confirmación/cancelación

## Patrones de Interacción

### Gestos y Acciones
- Arrastrar y soltar para reordenar tareas en proyectos y flujos de Agentes IA / Python
- Swipe para acciones rápidas de aprobación/rechazo de facturas en móvil
- Doble clic para edición rápida de líneas de factura y detalles de proyecto
- Gestos intuitivos para el diseño de flujos de automatización

### Estados y Transiciones
- Animaciones suaves y significativas
- Estados de hover y focus claros
- Skeletos de carga para contenido dinámico

## Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Adaptaciones
- Menú hamburguesa en mobile
- Layouts flexibles
- Imágenes y contenido adaptativo

## Accesibilidad

### Estándares
- WCAG 2.1 nivel AA
- Contraste de color adecuado
- Soporte para lectores de pantalla

### Navegación por Teclado
- Focus visible
- Atajos de teclado
- Orden de tabulación lógico

## Microcopy

### Tono y Voz
- Profesional pero amigable, adaptado al contexto fiscal y técnico
- Directo y claro, especialmente en temas tributarios y de cumplimiento
- Enfocado en la acción, con terminología acorde al sector solar/electromecánico

### Mensajes del Sistema
- Errores fiscales: Específicos con referencia a la normativa y con solución clara
- Éxito: Confirmación clara con información relevante (número de documento, clave numérica)
- Loading: Información detallada del progreso en generación XML/PDF y ejecución de flujos Agentes IA / Python

## Testing y Validación

### Pruebas de Usabilidad
- Sesiones con contadores y técnicos de proyectos solares/electromecánicos
- Tests A/B para nuevas funciones de facturación y gestión de proyectos
- Feedback de usuarios beta en diversos sectores (energía solar, construcción, servicios)

### Métricas
- Tiempo en emisión de facturas y gestión de tareas de proyecto
- Tasa de error en datos fiscales y planificación de proyectos
- Satisfacción del usuario por módulo (facturación, proyectos, automatizaciones)
- Eficiencia en flujos de trabajo automatizados
