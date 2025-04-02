# Guía Completa de Integración con MCP y APIs Externas

Esta guía detalla el proceso para integrar Solar Fluidity con servicios externos mediante Model Context Protocol (MCP) y APIs REST, permitiendo ampliar las funcionalidades de la plataforma.

## Índice

1. [Introducción a MCP](#introducción-a-mcp)
2. [Configuración del Entorno MCP](#configuración-del-entorno-mcp)
3. [Integraciones MCP Disponibles](#integraciones-mcp-disponibles)
   - [Gmail MCP](#gmail-mcp)
   - [Google Calendar MCP](#google-calendar-mcp)
   - [Airtable MCP](#airtable-mcp)
   - [GitHub MCP](#github-mcp)
   - [Browser Tools MCP](#browser-tools-mcp)
4. [Creación de Integraciones Personalizadas](#creación-de-integraciones-personalizadas)
5. [Integración con APIs REST](#integración-con-apis-rest)
6. [Solución de Problemas Comunes](#solución-de-problemas-comunes)

## Introducción a MCP

Model Context Protocol (MCP) es un protocolo estándar para integrar aplicaciones y servicios con modelos de lenguaje. Solar Fluidity utiliza MCP para habilitar funcionalidades avanzadas como:

- Envío automatizado de facturas por correo electrónico
- Programación de actividades en Google Calendar
- Gestión de datos en Airtable
- Seguimiento de proyectos con GitHub
- Automatización de navegación web

### Ventajas de MCP

- **Interfaz unificada**: Una forma estándar de comunicarse con múltiples servicios
- **Automatización avanzada**: Posibilidad de crear flujos de trabajo complejos
- **Extensibilidad**: Facilidad para añadir nuevos servicios y funcionalidades
- **Seguridad**: Control granular de permisos y accesos

## Configuración del Entorno MCP

### Prerrequisitos

- Node.js (v16+)
- Docker Desktop
- Credenciales para los servicios a integrar (Google, Airtable, GitHub, etc.)
- Cuenta en MCP Hub (opcional pero recomendado)

### Instalación del MCP Hub

1. Clone el repositorio del MCP Hub:
   ```bash
   git clone https://github.com/usuario/mcp-hub.git
   cd mcp-hub
   ```

2. Configure el archivo `.env` con las credenciales necesarias:
   ```bash
   cp .env.example .env
   # Edite el archivo .env con sus credenciales
   ```

3. Inicie el MCP Hub:
   ```bash
   ./scripts/start.sh
   ```

4. Verifique que los servidores MCP estén funcionando:
   ```bash
   cd docker
   docker-compose ps
   ```

### Configuración en Solar Fluidity

1. Cree un archivo de configuración MCP en Solar Fluidity:
   ```bash
   mkdir -p ~/Documents/GitHub/proyectosolar/config/mcp
   touch ~/Documents/GitHub/proyectosolar/config/mcp/config.js
   ```

2. Edite el archivo de configuración:
   ```javascript
   // config/mcp/config.js
   module.exports = {
     // Configuración de los servidores MCP
     mcpServers: {
       gmail: {
         url: "http://localhost:3104", // Puerto del Gmail MCP
       },
       googleCalendar: {
         url: "http://localhost:3105", // Puerto del Google Calendar MCP
       },
       airtable: {
         url: "http://localhost:3106", // Puerto del Airtable MCP
       },
       github: {
         url: "http://localhost:3102", // Puerto del GitHub MCP
       },
       browserTools: {
         url: "http://localhost:3103", // Puerto del Browser Tools MCP
       }
     }
   };
   ```

## Integraciones MCP Disponibles

### Gmail MCP

El MCP de Gmail permite enviar correos electrónicos, acceder a la bandeja de entrada y gestionar etiquetas desde Solar Fluidity.

#### Configuración

1. Obtenga credenciales OAuth2 de Google Cloud Platform:
   - Acceda a [Google Cloud Console](https://console.cloud.google.com/)
   - Cree un proyecto nuevo
   - Habilite la API de Gmail
   - Cree credenciales OAuth2
   - Descargue el archivo JSON de credenciales

2. Configure el MCP de Gmail:
   ```bash
   mkdir -p ~/.gmail-mcp
   mv /ruta/del/archivo/credentials.json ~/.gmail-mcp/
   ```

3. Ejecute el proceso de autenticación:
   ```bash
   npx @gongrzhe/server-gmail-autoauth-mcp auth
   ```

#### Ejemplo de Uso

```javascript
// Enviar un correo con una factura
async function enviarFacturaPorEmail(factura, emailCliente) {
  const mcpClient = new MCPClient('http://localhost:3104');
  
  const respuesta = await mcpClient.invokeOperation('sendEmail', {
    to: emailCliente,
    subject: `Factura Electrónica #${factura.numero}`,
    body: `Estimado cliente,\n\nAdjunto encontrará su factura electrónica #${factura.numero}.\n\nAtentamente,\nSolar Fluidity`,
    attachments: [
      {
        filename: `factura_${factura.numero}.pdf`,
        path: factura.rutaPDF
      },
      {
        filename: `factura_${factura.numero}.xml`,
        path: factura.rutaXML
      }
    ]
  });
  
  return respuesta;
}
```

### Google Calendar MCP

Permite programar eventos, gestionar calendarios y configurar recordatorios desde Solar Fluidity.

#### Configuración

1. Obtenga credenciales OAuth2 de Google Cloud Platform:
   - Habilite la API de Google Calendar
   - Use las mismas credenciales creadas para Gmail

2. Configure el MCP de Google Calendar:
   ```bash
   npx @takumi0706/mcp-google-calendar auth
   ```

#### Ejemplo de Uso

```javascript
// Programar una visita de instalación
async function programarInstalacion(proyecto, fecha) {
  const mcpClient = new MCPClient('http://localhost:3105');
  
  const respuesta = await mcpClient.invokeOperation('createEvent', {
    calendarId: 'primary',
    summary: `Instalación Solar - ${proyecto.cliente}`,
    location: proyecto.direccion,
    description: `Instalación de sistema solar fotovoltaico.\nDetalles: ${proyecto.descripcion}`,
    start: {
      dateTime: fecha.toISOString(),
      timeZone: 'America/Costa_Rica',
    },
    end: {
      dateTime: new Date(fecha.getTime() + 3 * 60 * 60 * 1000).toISOString(), // 3 horas después
      timeZone: 'America/Costa_Rica',
    },
    attendees: [
      { email: proyecto.emailCliente },
      { email: 'tecnico@solarfluidity.com' }
    ],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 }, // 1 día antes
        { method: 'popup', minutes: 60 } // 1 hora antes
      ]
    }
  });
  
  return respuesta;
}
```

### Airtable MCP

Permite gestionar bases de datos en Airtable para almacenar información de clientes, proyectos, equipos y más.

#### Configuración

1. Obtenga una API Key de Airtable:
   - Acceda a [Airtable Account](https://airtable.com/account)
   - Genere una API Key
   - Copie la API Key

2. Configure el MCP de Airtable:
   ```bash
   export AIRTABLE_API_KEY=su_api_key
   npx @felores/airtable-mcp-server
   ```

#### Ejemplo de Uso

```javascript
// Registrar un nuevo cliente en Airtable
async function registrarCliente(cliente) {
  const mcpClient = new MCPClient('http://localhost:3106');
  
  const respuesta = await mcpClient.invokeOperation('createRecord', {
    baseId: 'appXXXXXXXXXXXXXX',
    tableId: 'tblClientes',
    record: {
      "Nombre": cliente.nombre,
      "Cédula": cliente.cedula,
      "Email": cliente.email,
      "Teléfono": cliente.telefono,
      "Dirección": cliente.direccion,
      "Tipo": cliente.tipo // Residencial, Comercial, etc.
    }
  });
  
  return respuesta;
}
```

### GitHub MCP

Permite gestionar repositorios, issues y pull requests en GitHub para el seguimiento de proyectos.

#### Configuración

1. Genere un token de acceso personal (PAT) en GitHub:
   - Acceda a [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
   - Genere un token con los permisos necesarios (repo, user, etc.)
   - Copie el token generado

2. Configure el MCP de GitHub:
   ```bash
   export GITHUB_PERSONAL_ACCESS_TOKEN=su_token
   npx @modelcontextprotocol/server-github
   ```

#### Ejemplo de Uso

```javascript
// Crear un issue para un nuevo proyecto
async function crearIssueProyecto(proyecto) {
  const mcpClient = new MCPClient('http://localhost:3102');
  
  const respuesta = await mcpClient.invokeOperation('createIssue', {
    owner: 'KevinCElizondo',
    repo: 'proyectosolar',
    title: `Nuevo Proyecto: ${proyecto.nombre}`,
    body: `
## Detalles del Proyecto
- **Cliente**: ${proyecto.cliente}
- **Tipo**: ${proyecto.tipo}
- **Ubicación**: ${proyecto.ubicacion}
- **Capacidad**: ${proyecto.capacidadKW} kW
- **Fecha Inicio**: ${proyecto.fechaInicio}

## Tareas
- [ ] Diseño inicial
- [ ] Aprobación del cliente
- [ ] Solicitud de permisos
- [ ] Pedido de equipos
- [ ] Instalación
- [ ] Pruebas
- [ ] Entrega
    `,
    labels: ['nuevo-proyecto', proyecto.tipo.toLowerCase()]
  });
  
  return respuesta;
}
```

### Browser Tools MCP

Permite automatizar tareas en navegadores web, como llenar formularios, extraer datos o interactuar con aplicaciones web.

#### Configuración

1. Configure el MCP de Browser Tools:
   ```bash
   npx @agentdeskai/browser-tools-mcp
   ```

#### Ejemplo de Uso

```javascript
// Verificar estado de una factura en el portal de Hacienda
async function verificarEstadoFactura(clave) {
  const mcpClient = new MCPClient('http://localhost:3103');
  
  const respuesta = await mcpClient.invokeOperation('browseWebsite', {
    url: 'https://www.hacienda.go.cr/ATV/ComprobanteElectronico/frmConsultaComprobante.aspx',
    actions: [
      { type: 'fill', selector: '#txtClave', value: clave },
      { type: 'click', selector: '#btnConsultar' },
      { type: 'wait', ms: 3000 },
      { type: 'extract', selector: '#lblEstado', property: 'textContent' }
    ]
  });
  
  return respuesta.extracted;
}
```

## Creación de Integraciones Personalizadas

Puede crear sus propios servidores MCP personalizados para integraciones específicas.

### Ejemplo: Servidor MCP para Facturación Electrónica

1. Cree un directorio para su servidor MCP:
   ```bash
   mkdir -p mcp-facturacion
   cd mcp-facturacion
   npm init -y
   ```

2. Instale las dependencias necesarias:
   ```bash
   npm install express cors mcp-server-sdk axios
   ```

3. Cree el archivo principal `index.js`:
   ```javascript
   const express = require('express');
   const cors = require('cors');
   const { MCPServer } = require('mcp-server-sdk');
   const axios = require('axios');

   // Crear servidor Express
   const app = express();
   app.use(cors());
   app.use(express.json());

   // Crear servidor MCP
   const mcpServer = new MCPServer({
     name: "Facturación Electrónica MCP",
     description: "Servidor MCP para integración con sistemas de facturación electrónica"
   });

   // Definir una operación para generar XML
   mcpServer.defineOperation('generarXML', async (params) => {
     // Implementación de lógica para generar XML de factura
     // ...
     return { success: true, xml: "<?xml version='1.0'?>..." };
   });

   // Definir una operación para verificar estado
   mcpServer.defineOperation('verificarEstado', async (params) => {
     const { clave } = params;
     // Consultar API externa para verificar estado
     // ...
     return { success: true, estado: "Aceptado" };
   });

   // Configurar rutas Express para el servidor MCP
   app.use('/mcp', mcpServer.expressRouter());

   // Iniciar servidor
   const PORT = process.env.PORT || 3200;
   app.listen(PORT, () => {
     console.log(`Servidor MCP de Facturación funcionando en puerto ${PORT}`);
   });
   ```

4. Inicie su servidor MCP:
   ```bash
   node index.js
   ```

5. Integre su servidor MCP con Solar Fluidity añadiéndolo a la configuración MCP.

## Integración con APIs REST

Además de MCP, Solar Fluidity puede integrarse directamente con APIs REST.

### Estructura Recomendada

```javascript
// src/services/api/facturacionService.js
import axios from 'axios';

const API_URL = process.env.FACTURACION_API_URL || 'https://api.facturacion.example.com';

export const facturacionService = {
  /**
   * Genera una factura electrónica
   * @param {Object} datosFactura - Datos para la factura
   * @returns {Promise<Object>} - Respuesta con la factura generada
   */
  async generarFactura(datosFactura) {
    try {
      const response = await axios.post(`${API_URL}/facturas`, datosFactura, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('api_token')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al generar factura:', error);
      throw error;
    }
  },
  
  /**
   * Consulta el estado de una factura
   * @param {string} claveFactura - Clave de la factura
   * @returns {Promise<Object>} - Respuesta con el estado
   */
  async consultarEstado(claveFactura) {
    try {
      const response = await axios.get(`${API_URL}/facturas/${claveFactura}/estado`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('api_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al consultar estado:', error);
      throw error;
    }
  }
};
```

### Uso en Componentes

```javascript
// src/components/FacturaForm.jsx
import React, { useState } from 'react';
import { facturacionService } from '../services/api/facturacionService';

const FacturaForm = () => {
  const [factura, setFactura] = useState({
    cliente: '',
    items: [],
    subtotal: 0,
    impuesto: 0,
    total: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resultado, setResultado] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await facturacionService.generarFactura(factura);
      setResultado(response);
    } catch (err) {
      setError(err.message || 'Error al generar factura');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Campos del formulario */}
        <button type="submit" disabled={loading}>
          {loading ? 'Generando...' : 'Generar Factura'}
        </button>
      </form>
      
      {error && <div className="error">{error}</div>}
      
      {resultado && (
        <div className="resultado">
          <h3>Factura Generada</h3>
          <p>Clave: {resultado.clave}</p>
          <p>Estado: {resultado.estado}</p>
          <a href={resultado.pdfUrl} target="_blank" rel="noopener noreferrer">
            Ver PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default FacturaForm;
```

## Solución de Problemas Comunes

### MCP Hub no inicia correctamente

1. Verifique que Docker Desktop esté en ejecución
2. Compruebe los logs de Docker:
   ```bash
   cd ~/Documents/GitHub/mcp-hub/docker
   docker-compose logs
   ```
3. Verifique que los puertos necesarios estén disponibles
4. Asegúrese de que las variables de entorno estén configuradas correctamente

### Error de autenticación en MCPs de Google

1. Verifique que las credenciales OAuth2 sean válidas
2. Asegúrese de haber completado el flujo de autenticación
3. Revise los permisos solicitados durante la autenticación
4. Compruebe que las APIs necesarias estén habilitadas en la consola de Google Cloud

### Problemas con la integración de Airtable

1. Verifique que la API Key sea válida
2. Compruebe los permisos de la API Key
3. Asegúrese de usar los ID de base y tabla correctos
4. Revise la estructura de los datos enviados

### Error al crear servidores MCP personalizados

1. Verifique que las dependencias estén instaladas correctamente
2. Compruebe la estructura del código
3. Revise los puertos utilizados para evitar conflictos
4. Añada logs detallados para identificar el problema

### Recomendaciones Generales

- Utilice herramientas como Postman para probar las APIs antes de integrarlas
- Implemente un sistema de logging detallado para detectar problemas
- Cree tests automatizados para validar la integración
- Mantenga un control de versiones de las integraciones
- Documente cualquier cambio en las integraciones

---

Para obtener ayuda adicional, consulte la [documentación oficial de MCP](https://modelcontextprotocol.ai/docs) o contacte al equipo de soporte de Solar Fluidity.
