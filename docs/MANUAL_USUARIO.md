# Manual de Usuario - Solar Fluidity

## Índice

1. [Introducción](#introducción)
2. [Primeros Pasos](#primeros-pasos)
3. [Facturación Electrónica Offline](#facturación-electrónica-offline)
4. [Gestión de Proyectos Solares](#gestión-de-proyectos-solares)
5. [Automatizaciones Inteligentes](#automatizaciones-inteligentes)
6. [Soporte y Solución de Problemas](#soporte-y-solución-de-problemas)
7. [Glosario](#glosario)

## Introducción

Solar Fluidity es una plataforma SaaS diseñada específicamente para empresas del sector solar y electromecánico en Costa Rica, ofreciendo tres funcionalidades principales:

1. **Facturación Electrónica Offline**: Genera documentos electrónicos válidos (XML/PDF) sin necesidad de conexión directa con Hacienda.
2. **Gestión de Proyectos Solares y Electromecánicos**: Administra todo el ciclo de vida de proyectos, desde diseño hasta mantenimiento.
3. **Automatizaciones Inteligentes**: Configura flujos de trabajo automatizados con agentes IA para procesos recurrentes.

Este manual le guiará a través de todas las funcionalidades principales de la plataforma para maximizar su productividad y cumplimiento fiscal, incluso en entornos con conectividad limitada.

## Primeros Pasos

### Requisitos del Sistema

Solar Fluidity funciona como una PWA (Progressive Web App), lo que significa que puede utilizarse en:

| Dispositivo | Navegadores compatibles | Almacenamiento mínimo |
|-------------|-------------------------|----------------------|
| Computadoras | Chrome, Edge, Firefox, Safari | 500 MB |
| Tablets | Chrome, Safari | 1 GB |
| Smartphones | Chrome, Safari | 1 GB |

### Acceso al Sistema

1. Abra su navegador e ingrese a: `https://app.solarfluidity.com`
2. Ingrese sus credenciales (correo electrónico y contraseña)
3. Para primer ingreso, siga las instrucciones de configuración inicial
4. Para uso offline, asegúrese de activar la opción "Instalar aplicación" cuando se le solicite

### Configuración Inicial

Antes de comenzar a utilizar las funcionalidades principales, es importante configurar:

1. **Información de la Empresa**: Complete datos fiscales y de contacto
2. **Certificado Digital**: Configure su certificado de firma digital para facturación
3. **Preferencias de Usuario**: Personalice la interfaz y notificaciones
4. **Datos para Desconexión**: Configure el alcance de datos disponibles offline

![Panel de configuración inicial](img/configuracion_inicial.png)

## Facturación Electrónica Offline

### Configuración de Facturación Electrónica

#### Certificado Digital

1. Vaya a `Configuración > Facturación Electrónica > Certificados`
2. Seleccione "Agregar Certificado"
3. Cargue su archivo `.p12` y proporcione la contraseña
4. Verifique la fecha de vencimiento y active la opción "Permitir uso offline"

![Gestión de certificados](img/certificados_fiscales.png)

#### Numeración de Contingencia

1. Vaya a `Configuración > Facturación Electrónica > Numeración`
2. Configure la secuencia para modo de contingencia
3. Defina prefijos según normativa vigente
4. Establezca reglas de validación local

### Creación de Documentos Electrónicos

#### Facturas Electrónicas

1. Desde el menú principal, seleccione `Documentos > Nueva Factura`
2. Complete los datos del receptor (cliente)
   - Utilice el botón "Verificar" para validar contra el registro de Hacienda (requiere conexión)
   - O seleccione de su catálogo local previamente sincronizado
3. Agregue líneas de detalle:
   - Descripción del producto/servicio
   - Cantidad
   - Precio unitario
   - Impuestos aplicables
4. Revise el resumen de la factura
5. Haga clic en "Generar Factura"

> **Nota**: En modo offline, verá un indicador "Modo Contingencia" y el documento quedará en cola para sincronización posterior.

![Creación de factura en modo offline](img/factura_offline.png)

#### Notas de Crédito y Débito

1. Vaya a `Documentos > Nueva Nota de Crédito/Débito`
2. Seleccione la factura de referencia
   - En modo offline, solo podrá referenciar facturas generadas localmente
3. Indique el motivo de la nota
4. Complete los detalles según corresponda
5. Haga clic en "Generar Nota"

### Gestión de Documentos Pendientes

Cuando trabaje en modo offline, los documentos quedarán pendientes de sincronización:

1. Acceda a `Documentos > Pendientes de Sincronización`
2. Vea el estado y detalles de cada documento
3. Cuando recupere la conexión:
   - Los documentos se sincronizarán automáticamente
   - O puede iniciar manualmente el proceso con "Sincronizar Ahora"
4. Revise el "Registro de Sincronización" para confirmación

### Reportes Fiscales

Incluso sin conexión, puede generar reportes para su gestión:

1. Vaya a `Reportes > Fiscal`
2. Seleccione el tipo de reporte:
   - Ventas del período
   - Impuestos recaudados
   - Documentos por cliente
3. Aplique filtros por fecha, cliente o tipo de documento
4. Genere el reporte en PDF o Excel

> **Nota**: Los reportes generados offline incluirán una marca de "Preliminar" hasta sincronización completa.

## Gestión de Proyectos Solares

### Creación de Nuevo Proyecto

1. Desde el menú principal, seleccione `Proyectos > Nuevo Proyecto`
2. Complete la información general:
   - Nombre del proyecto
   - Cliente (nuevo o existente)
   - Ubicación (puede marcar en mapa offline)
   - Tipo de instalación (residencial, comercial, industrial)
   - Fecha estimada de inicio
3. Haga clic en "Crear Proyecto"

![Creación de nuevo proyecto](img/nuevo_proyecto.png)

### Diseño de Sistema Solar

#### Dimensionamiento

1. En el proyecto, vaya a la pestaña `Diseño`
2. Ingrese los parámetros básicos:
   - Consumo eléctrico (kWh/mes)
   - Área disponible (m²)
   - Orientación e inclinación del techo
   - Tipo de conexión (on-grid, off-grid, híbrido)
3. Utilice la calculadora incorporada para determinar:
   - Tamaño del sistema (kWp)
   - Número de paneles
   - Capacidad del inversor
   - Almacenamiento requerido (baterías)

> **Nota**: En modo offline, se utilizará un modelo de cálculo simplificado basado en datos precargados de radiación solar para Costa Rica.

![Calculadora de dimensionamiento](img/calculadora_solar.png)

#### Selección de Equipos

1. En la sección `Equipos`, agregue componentes del sistema:
   - Paneles solares (del catálogo)
   - Inversores
   - Sistemas de montaje
   - Baterías (si aplica)
   - Accesorios y protecciones
2. Verifique compatibilidad entre componentes
3. Ajuste cantidades según requerimientos
4. Revise presupuesto estimado

> **Nota**: El catálogo offline se sincroniza periódicamente cuando hay conexión. Verifique la fecha de última actualización.

### Gestión de Instalación

#### Programación

1. En el proyecto, vaya a la pestaña `Instalación`
2. Cree un cronograma de actividades:
   - Defina tareas principales
   - Asigne responsables
   - Establezca fechas y duración
   - Configure dependencias entre tareas
3. Visualice el cronograma en formato Gantt

#### Seguimiento en Campo

1. Durante la instalación, utilice la sección `Seguimiento`:
   - Actualice el estado de las tareas (pendiente, en proceso, completado)
   - Registre horas trabajadas por técnico
   - Documente incidencias o cambios
   - Capture fotografías del avance
2. Complete listas de verificación predefinidas
3. Obtenga firma digital del cliente para aprobaciones

![Seguimiento de instalación](img/seguimiento_instalacion.png)

### Monitoreo y Mantenimiento

1. Para proyectos completados, acceda a la sección `Monitoreo`
2. Configure parámetros de monitoreo:
   - Producción estimada vs. real
   - Alertas por bajo rendimiento
   - Calendario de mantenimientos preventivos
3. Registre intervenciones de mantenimiento:
   - Fecha y tipo de mantenimiento
   - Técnicos asignados
   - Actividades realizadas
   - Repuestos utilizados
4. Genere informes de rendimiento para el cliente

## Automatizaciones Inteligentes

Solar Fluidity incluye automatizaciones preconfiguradas mediante agentes IA, que puede personalizar según sus necesidades.

### Automatizaciones Disponibles

#### Facturación

- **Recordatorios de Pago**: Envío automático de recordatorios para facturas pendientes
- **Generación de Reportes**: Creación y envío programado de reportes fiscales
- **Alertas de Vencimiento**: Notificaciones sobre certificados o documentos próximos a vencer

#### Proyectos Solares

- **Seguimiento de Proyectos**: Notificaciones de hitos y actualizaciones automáticas
- **Mantenimientos Preventivos**: Calendarización y avisos de mantenimiento
- **Informes de Rendimiento**: Generación automática de informes para clientes

### Personalización de Flujos de Trabajo

Para personalizar una automatización existente:

1. Vaya a `Automatizaciones > Flujos de Trabajo`
2. Seleccione el flujo que desea modificar
3. Utilice el editor visual para ajustar:
   - Desencadenadores (triggers)
   - Condiciones
   - Acciones
   - Destinatarios
4. Guarde y active el flujo modificado

![Diagrama de Agentes IA](img/agentes_ia_diagrama.png) <!-- Asumiendo que existe una imagen representativa -->

### Creación de Nuevas Automatizaciones

Para usuarios avanzados, es posible crear nuevos flujos:

1. Seleccione `Automatizaciones > Nuevo Flujo`
2. Defina el desencadenador inicial:
   - Programado (cronograma)
   - Evento (nueva factura, actualización de proyecto, etc.)
   - Manual (botón)
3. Configure la secuencia de acciones
4. Establezca condiciones y ramificaciones
5. Pruebe el flujo antes de activarlo
6. Active para uso en producción

> **Nota**: Las automatizaciones configuradas pueden funcionar parcialmente en modo offline, almacenando las acciones pendientes para ejecución cuando se recupere la conexión.

## Soporte y Solución de Problemas

### Problemas Comunes y Soluciones

#### Sincronización de Datos

| Problema | Solución |
|----------|----------|
| Error al sincronizar documentos fiscales | Verifique numeración y clave consecutiva. Si persiste, contacte soporte |
| Conflictos de sincronización | Revise documento por documento en la sección "Conflictos" y seleccione versión correcta |
| Datos incompletos offline | Verifique configuración de almacenamiento offline y sincronice manualmente datos esenciales |

#### Facturación Electrónica

| Problema | Solución |
|----------|----------|
| Error de certificado | Verifique fecha de vencimiento y contraseña. Reinstale si es necesario |
| Rechazo de documento por Hacienda | Revise los detalles del error en "Documentos > Rechazados" y corrija según indicaciones |
| Numeración duplicada | Utilice la herramienta de reasignación de numeración en "Configuración > Reparación" |

#### Proyectos Solares

| Problema | Solución |
|----------|----------|
| Cálculos incorrectos | Actualice datos de radiación solar y verifique parámetros de entrada |
| Incompatibilidad de equipos | Revise matriz de compatibilidad en documentación técnica |
| Cronograma desactualizado | Sincronice y regenere cronograma con opción "Recalcular" |

### Contacto con Soporte

Si necesita asistencia adicional:

1. En la aplicación: `Ayuda > Soporte Técnico`
2. Email: soporte@solarfluidity.com
3. Teléfono: +506 2XXX-XXXX (horario: L-V 8am-5pm)
4. Chat en vivo: Disponible en horario extendido

Para soporte prioritario, tenga a mano:
- ID de empresa
- Usuario
- Registro de errores (exportable desde `Configuración > Diagnóstico`)
- Capturas de pantalla relevantes

## Glosario

| Término | Definición |
|---------|------------|
| ATV | Administración Tributaria Virtual (plataforma de Hacienda) |
| FE | Factura Electrónica |
| MR | Mensaje Receptor |
| NC | Nota de Crédito Electrónica |
| ND | Nota de Débito Electrónica |
| kWp | Kilovatio pico (potencia máxima de un sistema solar) |
| PWA | Progressive Web App (aplicación web progresiva) |
| SLA | Acuerdo de Nivel de Servicio |
| Modo Contingencia | Operación offline con numeración especial según normativa de Hacienda |
| Agentes IA | Sistema inteligente para automatizar tareas |
