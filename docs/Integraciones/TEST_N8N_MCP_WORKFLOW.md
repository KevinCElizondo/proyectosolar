# Prueba de integración de n8n con MCP para Solar Fluidity

Este documento detalla un flujo de trabajo de prueba para verificar la correcta integración entre n8n y el servidor MCP de Solar Fluidity.

## Flujo de trabajo de prueba

1. **Verificar conexión al servidor MCP**
   
   Crear un workflow en n8n con los siguientes nodos:

   - **Nodo Trigger**: HTTP Request
   - **Nodo MCP Client**: Configurado con
     - Command: `python`
     - Arguments: `src/integrations/mcp/solar_fluidity_mcp_server.py`
     - Environments: 
       ```
       SUPABASE_URL=https://rlqvkqaownzqelvxnhzd.supabase.co
       SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscXZrcWFvd256cWVsdnhuaHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5MDc2OTYsImV4cCI6MjA1NDQ4MzY5Nn0.VbIVp5gROoFjCO4k1263nIqZfcAYY9WFkhTJr_VXvm0
       ```
   - **Nodo MCP Read Resource**: Configurado para leer `invoices://list`
   - **Nodo Respond to Webhook**: Retornar el resultado

2. **Crear factura de prueba**

   Crear un segundo workflow con:

   - **Nodo Trigger**: HTTP Request
   - **Nodo MCP Client**: Misma configuración que el anterior
   - **Nodo MCP Call Tool**: Configurado para llamar a la herramienta `create_invoice` con los siguientes argumentos:
     ```json
     {
       "cliente_nombre": "Empresa de Prueba, S.A.",
       "cliente_cedula": "3101123456",
       "lineas": [
         {
           "descripcion": "Instalación de panel solar 500W",
           "cantidad": 2,
           "precio_unitario": 350000
         },
         {
           "descripcion": "Servicio de instalación",
           "cantidad": 1,
           "precio_unitario": 75000
         }
       ]
     }
     ```
   - **Nodo Respond to Webhook**: Retornar el resultado

3. **Crear proyecto de prueba**

   Crear un tercer workflow con:

   - **Nodo Trigger**: HTTP Request
   - **Nodo MCP Client**: Misma configuración que los anteriores
   - **Nodo MCP Call Tool**: Configurado para llamar a la herramienta `create_project` con los siguientes argumentos:
     ```json
     {
       "nombre": "Instalación Residencial Valle del Sol",
       "cliente_nombre": "Juan Pérez Rodríguez",
       "cliente_cedula": "108760432",
       "tipo": "Solar",
       "descripcion": "Instalación de sistema solar fotovoltaico para residencia de 150m2",
       "fecha_inicio": "2025-04-15"
     }
     ```
   - **Nodo Respond to Webhook**: Retornar el resultado

## Resultados esperados

- El primer workflow debería devolver una lista de facturas (que podría estar vacía si no hay facturas creadas).
- El segundo workflow debería crear una nueva factura y devolver su ID.
- El tercer workflow debería crear un nuevo proyecto y devolver su ID.

Si todos estos workflows funcionan correctamente, significa que la integración entre n8n y el servidor MCP está configurada correctamente y que Supabase está almacenando los datos correctamente.

## Pasos para ejecutar las pruebas

1. Importar cada uno de los workflows en n8n.
2. Ejecutar cada workflow y verificar que los resultados sean los esperados.
3. Si hay errores, verificar los logs para identificar el problema.

## Solución de problemas comunes

- **Error de conexión a Supabase**: Verificar que las credenciales de Supabase sean correctas.
- **Error al ejecutar el servidor MCP**: Verificar que el servidor MCP esté correctamente instalado y que las dependencias estén instaladas.
- **Error en la estructura de datos**: Verificar que las tablas en Supabase tengan la estructura correcta.
