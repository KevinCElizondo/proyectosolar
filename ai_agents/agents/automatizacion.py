"""
Módulo de automatización basado en agentes IA para Solar Fluidity.
Reemplaza las funcionalidades previamente manejadas por n8n con un enfoque
basado en LangGraph y Pydantic.
"""

import os
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("logs/automatizacion.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("AutomatizacionAgent")

# Modelos Pydantic para estructurar datos
class LineaFactura(BaseModel):
    """Modelo para una línea de factura."""
    descripcion: str
    cantidad: int
    precio_unitario: float
    subtotal: float

class RecordatorioFactura(BaseModel):
    """Modelo para recordatorio de facturas pendientes."""
    factura_id: int
    cliente_nombre: str
    cliente_email: str
    monto_total: float
    dias_restantes: int
    detalle_lineas: List[LineaFactura]
    mensaje_personalizado: Optional[str] = None

class HitoProyecto(BaseModel):
    """Modelo para hitos de proyectos."""
    hito_id: int
    proyecto_id: int
    descripcion: str
    fecha_objetivo: datetime
    responsable: str
    completado: bool = False
    fecha_completado: Optional[datetime] = None
    dias_restantes: Optional[int] = None
    proyecto_nombre: Optional[str] = None
    cliente_nombre: Optional[str] = None

class ReporteProyecto(BaseModel):
    """Modelo para reportes de proyectos."""
    proyecto_id: int
    proyecto_nombre: str
    cliente_nombre: str
    fecha_reporte: datetime
    semana: int
    porcentaje_completado: float
    actividades_recientes: List[Dict[str, Any]]
    hitos_completados: List[HitoProyecto]
    proximos_hitos: List[HitoProyecto]
    comentarios: Optional[str] = None

class AutomatizacionAgent:
    """
    Agente principal de automatización que coordina los flujos automatizados
    reemplazando la funcionalidad previamente proporcionada por n8n.
    """
    
    def __init__(self, db_client=None, mcp_client=None):
        """Inicializa el agente de automatización."""
        self.db_client = db_client
        self.mcp_client = mcp_client
        logger.info("Agente de Automatización inicializado")
    
    async def procesar_recordatorios_facturas(self):
        """
        Procesa recordatorios de facturas pendientes de pago.
        Equivalente al flujo 'recordatorio_facturas.json' de n8n.
        """
        logger.info("Iniciando procesamiento de recordatorios de facturas")
        try:
            # 1. Consultar facturas pendientes
            logger.debug("Consulting pending invoices...")
            facturas = await self.db_client.consultar_facturas_pendientes()
            logger.info(f"Facturas pendientes encontradas: {len(facturas)}")
            logger.debug(f"Processing {len(facturas)} pending invoices.")
            
            for factura in facturas:
                # 2. Calcular días para vencimiento
                fecha_vencimiento = factura.get('fecha', datetime.now()) + timedelta(days=30)
                dias_restantes = (fecha_vencimiento - datetime.now()).days
                
                # 3. Filtrar facturas próximas a vencer (7 días o menos)
                if dias_restantes <= 7:
                    logger.info(f"Invoice {factura['id']} is due in {dias_restantes} days. Processing reminder.")
                    # 4. Obtener líneas de factura
                    logger.debug(f"Consulting invoice lines for factura_id: {factura['id']}")
                    lineas = await self.db_client.consultar_lineas_factura(factura['id'])
                    
                    # 5. Crear modelo estructurado con Pydantic
                    recordatorio = RecordatorioFactura(
                        factura_id=factura['id'],
                        cliente_nombre=factura['cliente_nombre'],
                        cliente_email=f"cliente_{factura['cliente_cedula']}@example.com",  # En producción, obtener el email real
                        monto_total=factura['monto_total'],
                        dias_restantes=dias_restantes,
                        detalle_lineas=[
                            LineaFactura(
                                descripcion=linea['descripcion'],
                                cantidad=linea['cantidad'],
                                precio_unitario=linea['precio_unitario'],
                                subtotal=linea['subtotal']
                            ) for linea in lineas
                        ]
                    )
                    
                    # 6. Generar mensaje personalizado
                    if dias_restantes <= 0:
                        asunto = f"IMPORTANTE: Factura #{factura['id']} vencida"
                        mensaje = self._generar_mensaje_vencido(recordatorio)
                    else:
                        asunto = f"Recordatorio: Factura #{factura['id']} próxima a vencer"
                        mensaje = self._generar_mensaje_por_vencer(recordatorio)
                    
                    # 7. Enviar correo mediante MCP
                        logger.debug(f"Sending reminder email for factura_id: {factura['id']} to {recordatorio.cliente_email}")
                    if self.mcp_client:
                        await self.mcp_client.ejecutar_accion(
                            "gmail",
                            "send_email",
                            {
                                "to": recordatorio.cliente_email,
                                "subject": asunto,
                                "body": mensaje
                            }
                        )
                        logger.info(f"Recordatorio enviado para factura {factura['id']}")
                    
                    # 8. Actualizar estado en la base de datos
                    logger.debug(f"Updating reminder status for factura_id: {factura['id']}")
                    await self.db_client.actualizar_estado_recordatorio(
                        factura['id'], 
                        {'recordatorio_enviado': True, 'fecha_recordatorio': datetime.now()}
                    )
            
            return {"status": "success", "message": f"Procesados {len(facturas)} recordatorios de facturas"}
        
        except Exception as e:
            logger.error(f"Error al procesar recordatorios: {str(e)}")
            logger.error(f"Error processing invoice reminders: {e}", exc_info=True)
            return {"status": "error", "message": str(e)}
    
    async def procesar_notificaciones_hitos(self):
        """
        Procesa notificaciones de hitos de proyectos.
        Equivalente al flujo 'notificacion_hitos.json' de n8n.
        """
        logger.info("Iniciando procesamiento de notificaciones de hitos")
        try:
            # 1. Consultar proyectos activos
            logger.debug("Consulting active projects...")
            proyectos = await self.db_client.consultar_proyectos_activos()
            
            logger.debug(f"Processing {len(proyectos)} active projects for milestone notifications.")
            for proyecto in proyectos:
                # 2. Obtener hitos pendientes
                logger.debug(f"Consulting pending milestones for project_id: {proyecto['id']}")
                hitos = await self.db_client.consultar_hitos_pendientes(proyecto['id'])
                
                for hito in hitos:
                    # 3. Calcular días restantes
                    dias_restantes = (hito['fecha_objetivo'] - datetime.now()).days
                    
                    # 4. Filtrar hitos próximos (7 días o menos)
                    if dias_restantes <= 7:
                        logger.info(f"Milestone {hito['id']} for project {proyecto['id']} is due in {dias_restantes} days. Processing notification.")
                        # 5. Crear modelo estructurado con Pydantic
                        notificacion = HitoProyecto(
                            hito_id=hito['id'],
                            proyecto_id=proyecto['id'],
                            descripcion=hito['descripcion'],
                            fecha_objetivo=hito['fecha_objetivo'],
                            responsable=hito['responsable'],
                            dias_restantes=dias_restantes,
                            proyecto_nombre=proyecto['nombre'],
                            cliente_nombre=proyecto['cliente_nombre']
                        )
                        
                        # 6. Generar asunto y mensaje
                        if dias_restantes < 0:
                            asunto = f"ALERTA: Hito '{hito['descripcion']}' del proyecto {proyecto['nombre']} vencido"
                            mensaje = self._generar_mensaje_hito_vencido(notificacion)
                        elif dias_restantes == 0:
                            asunto = f"HOY VENCE: Hito '{hito['descripcion']}' del proyecto {proyecto['nombre']}"
                            mensaje = self._generar_mensaje_hito_hoy(notificacion)
                        else:
                            asunto = f"Próximo hito: '{hito['descripcion']}' del proyecto {proyecto['nombre']}"
                            mensaje = self._generar_mensaje_hito_proximo(notificacion)
                        
                        # 7. Enviar notificaciones por múltiples canales
                        # Email
                        logger.debug(f"Sending milestone notification email for hito_id: {hito['id']}")
                        if self.mcp_client:
                            await self.mcp_client.ejecutar_accion(
                                "gmail",
                                "send_email",
                                {
                                    "to": f"responsable_{hito['responsable']}@example.com",  # En producción, obtener email real
                                    "subject": asunto,
                                    "body": mensaje
                                }
                            )
                            
                            # Opcional: Slack
                            logger.debug(f"Sending milestone notification Slack message for hito_id: {hito['id']}")
                            await self.mcp_client.ejecutar_accion(
                                "slack",
                                "send_message",
                                {
                                    "channel": "proyectos-hitos",
                                    "text": asunto
                                }
                            )
                        
                        # 8. Actualizar estado en la base de datos
                        logger.debug(f"Updating milestone notification status for hito_id: {hito['id']}")
                        await self.db_client.actualizar_estado_notificacion_hito(
                            hito['id'],
                            {'notificacion_enviada': True, 'fecha_notificacion': datetime.now()}
                        )
            
            return {"status": "success", "message": "Procesadas notificaciones de hitos"}
            
        except Exception as e:
            logger.error(f"Error al procesar notificaciones de hitos: {str(e)}")
            logger.error(f"Error processing milestone notifications: {e}", exc_info=True)
            return {"status": "error", "message": str(e)}
    
    async def generar_reporte_semanal(self):
        """
        Genera reportes semanales de proyectos.
        Equivalente al flujo 'reporte_semanal.json' de n8n.
        """
        logger.info("Iniciando generación de reportes semanales")
        try:
            # Verificar si es viernes (día de generación de reportes)
            if datetime.now().weekday() != 4:  # 4 = Viernes
                logger.info("No es viernes, omitiendo generación de reportes")
                return {"status": "skipped", "message": "No es viernes, reportes programados solo para viernes"}
            
            logger.debug("Consulting active projects for weekly report...")
            # 1. Consultar proyectos activos
            proyectos = await self.db_client.consultar_proyectos_activos()
            
            logger.debug(f"Processing {len(proyectos)} active projects for weekly report.")
            for proyecto in proyectos:
                # 2. Obtener actividades recientes (última semana)
                logger.debug(f"Consulting recent activities for project_id: {proyecto['id']}")
                actividades = await self.db_client.consultar_actividades_recientes(
                    proyecto['id'], 
                    datetime.now() - timedelta(days=7)
                )
                
                # 3. Obtener hitos recientes y próximos
                logger.debug(f"Consulting recently completed milestones for project_id: {proyecto['id']}")
                hitos_completados = await self.db_client.consultar_hitos_completados_recientes(
                    proyecto['id'], 
                    datetime.now() - timedelta(days=7)
                )
                
                logger.debug(f"Consulting upcoming milestones for project_id: {proyecto['id']}")
                proximos_hitos = await self.db_client.consultar_proximos_hitos(
                    proyecto['id'], 
                    datetime.now(), 
                    datetime.now() + timedelta(days=14)
                )
                
                # 4. Calcular porcentaje de completado
                porcentaje_completado = proyecto.get('porcentaje_completado', 0)
                if not porcentaje_completado and len(hitos_completados) > 0:
                    logger.debug(f"Counting total milestones for project_id: {proyecto['id']}")
                    total_hitos = await self.db_client.contar_hitos_proyecto(proyecto['id'])
                    if total_hitos > 0:
                        porcentaje_completado = (len(hitos_completados) / total_hitos) * 100
                
                # 5. Calcular semana del año
                fecha_actual = datetime.now()
                inicio_ano = datetime.now().replace(month=1, day=1)
                dias_desde_inicio = (fecha_actual - inicio_ano).days
                semana = (dias_desde_inicio // 7) + 1
                
                # 6. Crear modelo de reporte con Pydantic
                reporte = ReporteProyecto(
                    proyecto_id=proyecto['id'],
                    proyecto_nombre=proyecto['nombre'],
                    cliente_nombre=proyecto['cliente_nombre'],
                    fecha_reporte=datetime.now(),
                    semana=semana,
                    porcentaje_completado=porcentaje_completado,
                    actividades_recientes=actividades,
                    hitos_completados=[
                        HitoProyecto(
                            hito_id=h['id'],
                            proyecto_id=proyecto['id'],
                            descripcion=h['descripcion'],
                            fecha_objetivo=h['fecha_objetivo'],
                            responsable=h['responsable'],
                            completado=True,
                            fecha_completado=h.get('fecha_completado', datetime.now())
                        ) for h in hitos_completados
                    ],
                    proximos_hitos=[
                        HitoProyecto(
                            hito_id=h['id'],
                            proyecto_id=proyecto['id'],
                            descripcion=h['descripcion'],
                            fecha_objetivo=h['fecha_objetivo'],
                            responsable=h['responsable'],
                            dias_restantes=(h['fecha_objetivo'] - datetime.now()).days
                        ) for h in proximos_hitos
                    ]
                )
                
                # 7. Generar contenido HTML y texto plano
                logger.debug(f"Generating HTML report content for project_id: {proyecto['id']}")
                html_content = self._generar_html_reporte(reporte)
                logger.debug(f"Generating text report content for project_id: {proyecto['id']}")
                text_content = self._generar_texto_reporte(reporte)
                
                # 8. Enviar por email
                logger.debug(f"Sending weekly report email for project_id: {proyecto['id']}")
                if self.mcp_client:
                    await self.mcp_client.ejecutar_accion(
                        "gmail",
                        "send_email",
                        {
                            "to": [
                                f"gerente_{proyecto['id']}@example.com",
                                f"cliente_{proyecto['cliente_cedula']}@example.com"
                            ],
                            "subject": f"Reporte Semanal: {proyecto['nombre']} - Semana {semana}",
                            "body": text_content,
                            "html": html_content
                        }
                    )
                
                # 9. Guardar en la base de datos
                logger.debug(f"Saving weekly report to DB for project_id: {proyecto['id']}")
                await self.db_client.guardar_reporte(
                    proyecto['id'],
                    {
                        'fecha': datetime.now(),
                        'titulo': f"Reporte Semanal: {proyecto['nombre']} - Semana {semana}",
                        'contenido_html': html_content,
                        'semana': semana
                    }
                )
                
                # 10. Actualizar fecha de último reporte
                logger.debug(f"Updating last report date for project_id: {proyecto['id']}")
                await self.db_client.actualizar_fecha_reporte(
                    proyecto['id'],
                    {'ultimo_reporte_enviado': datetime.now()}
                )
            
            return {"status": "success", "message": f"Generados reportes para {len(proyectos)} proyectos"}
            
        except Exception as e:
            logger.error(f"Error al generar reportes semanales: {str(e)}")
            logger.error(f"Error generating weekly reports: {e}", exc_info=True)
            return {"status": "error", "message": str(e)}

    # Métodos auxiliares para generar mensajes
    def _generar_mensaje_vencido(self, recordatorio: RecordatorioFactura) -> str:
        logger.debug(f"Generating overdue invoice message for factura_id: {recordatorio.factura_id}")
        """Genera mensaje para facturas vencidas."""
        mensaje = f"Estimado(a) {recordatorio.cliente_nombre},\n\n"
        mensaje += f"Le recordamos que su factura #{recordatorio.factura_id} por un monto de ₡{recordatorio.monto_total} "
        mensaje += f"se encuentra vencida por {abs(recordatorio.dias_restantes)} días.\n\n"
        mensaje += "Agradecemos realizar el pago lo antes posible para evitar recargos adicionales.\n\n"
        
        # Añadir detalles de la factura
        mensaje += "Detalle de la factura:\n"
        for linea in recordatorio.detalle_lineas:
            mensaje += f"- {linea.descripcion}: {linea.cantidad} x ₡{linea.precio_unitario} = ₡{linea.subtotal}\n"
        
        mensaje += f"\nTotal: ₡{recordatorio.monto_total}\n\n"
        mensaje += "Para realizar su pago, puede utilizar cualquiera de las siguientes opciones:\n"
        mensaje += "1. Transferencia bancaria a la cuenta: CR12345678901234567890\n"
        mensaje += "2. SINPE Móvil al número: 8888-8888\n\n"
        mensaje += "Si ya realizó el pago, por favor haga caso omiso a este mensaje.\n\n"
        mensaje += "Atentamente,\nEquipo de Solar Fluidity"
        
        return mensaje
    
    def _generar_mensaje_por_vencer(self, recordatorio: RecordatorioFactura) -> str:
        logger.debug(f"Generating due soon invoice message for factura_id: {recordatorio.factura_id}")
        """Genera mensaje para facturas próximas a vencer."""
        mensaje = f"Estimado(a) {recordatorio.cliente_nombre},\n\n"
        mensaje += f"Le recordamos que su factura #{recordatorio.factura_id} por un monto de ₡{recordatorio.monto_total} "
        mensaje += f"vence en {recordatorio.dias_restantes} días.\n\n"
        mensaje += "Agradecemos su atención a este aviso.\n\n"
        
        # Añadir detalles de la factura
        mensaje += "Detalle de la factura:\n"
        for linea in recordatorio.detalle_lineas:
            mensaje += f"- {linea.descripcion}: {linea.cantidad} x ₡{linea.precio_unitario} = ₡{linea.subtotal}\n"
        
        mensaje += f"\nTotal: ₡{recordatorio.monto_total}\n\n"
        mensaje += "Para realizar su pago, puede utilizar cualquiera de las siguientes opciones:\n"
        mensaje += "1. Transferencia bancaria a la cuenta: CR12345678901234567890\n"
        mensaje += "2. SINPE Móvil al número: 8888-8888\n\n"
        mensaje += "Atentamente,\nEquipo de Solar Fluidity"
        
        return mensaje
    
    def _generar_mensaje_hito_vencido(self, hito: HitoProyecto) -> str:
        logger.debug(f"Generating overdue milestone message for hito_id: {hito.hito_id}")
        """Genera mensaje para hitos vencidos."""
        mensaje = f"El hito '{hito.descripcion}' del proyecto {hito.proyecto_nombre} "
        mensaje += f"está vencido por {abs(hito.dias_restantes)} días.\n\n"
        
        mensaje += "Detalles del proyecto:\n"
        mensaje += f"- Cliente: {hito.cliente_nombre}\n"
        mensaje += f"- Responsable: {hito.responsable}\n\n"
        
        mensaje += "Por favor, actualice el estado de este hito o reprograme la fecha objetivo.\n\n"
        mensaje += "Atentamente,\nSistema de Automatización de Solar Fluidity"
        
        return mensaje
    
    def _generar_mensaje_hito_hoy(self, hito: HitoProyecto) -> str:
        logger.debug(f"Generating due today milestone message for hito_id: {hito.hito_id}")
        """Genera mensaje para hitos que vencen hoy."""
        mensaje = f"El hito '{hito.descripcion}' del proyecto {hito.proyecto_nombre} vence hoy.\n\n"
        
        mensaje += "Detalles del proyecto:\n"
        mensaje += f"- Cliente: {hito.cliente_nombre}\n"
        mensaje += f"- Responsable: {hito.responsable}\n\n"
        
        mensaje += "Por favor, verifique si puede completar este hito hoy o reprograme la fecha objetivo.\n\n"
        mensaje += "Atentamente,\nSistema de Automatización de Solar Fluidity"
        
        return mensaje
    
    def _generar_mensaje_hito_proximo(self, hito: HitoProyecto) -> str:
        logger.debug(f"Generating upcoming milestone message for hito_id: {hito.hito_id}")
        """Genera mensaje para hitos próximos."""
        mensaje = f"El hito '{hito.descripcion}' del proyecto {hito.proyecto_nombre} "
        mensaje += f"vence en {hito.dias_restantes} días.\n\n"
        
        mensaje += "Detalles del proyecto:\n"
        mensaje += f"- Cliente: {hito.cliente_nombre}\n"
        mensaje += f"- Responsable: {hito.responsable}\n"
        mensaje += f"- Fecha objetivo: {hito.fecha_objetivo.strftime('%d/%m/%Y')}\n\n"
        
        mensaje += "Por favor, planifique adecuadamente para cumplir con este hito en la fecha establecida.\n\n"
        mensaje += "Atentamente,\nSistema de Automatización de Solar Fluidity"
        
        return mensaje
    
    def _generar_html_reporte(self, reporte: ReporteProyecto) -> str:
        logger.debug(f"Generating HTML report for project_id: {reporte.proyecto_id}")
        """Genera contenido HTML para reportes semanales."""
        # Esta es una versión simplificada del contenido HTML
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Reporte Semanal: {reporte.proyecto_nombre}</title>
            <style>
                body {{ font-family: Arial, sans-serif; }}
                .header {{ background-color: #4f46e5; color: white; padding: 20px; }}
                .content {{ padding: 20px; }}
                .section {{ margin-bottom: 20px; }}
                .progress-bar {{ background-color: #f0f0f0; height: 20px; width: 100%; }}
                .progress-fill {{ background-color: #4f46e5; height: 100%; width: {reporte.porcentaje_completado}%; }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Reporte Semanal: {reporte.proyecto_nombre} - Semana {reporte.semana}</h1>
                <p>Fecha: {reporte.fecha_reporte.strftime('%d/%m/%Y')}</p>
            </div>
            
            <div class="content">
                <div class="section">
                    <h2>Información General</h2>
                    <p><strong>Cliente:</strong> {reporte.cliente_nombre}</p>
                    <p><strong>Progreso:</strong> {reporte.porcentaje_completado}%</p>
                    <div class="progress-bar"><div class="progress-fill"></div></div>
                </div>
                
                <div class="section">
                    <h2>Actividades Recientes</h2>
        """
        
        if reporte.actividades_recientes:
            for actividad in reporte.actividades_recientes:
                html += f"""
                    <p><strong>{actividad.get('fecha', '').strftime('%d/%m/%Y')}:</strong> {actividad.get('descripcion', '')}</p>
                """
        else:
            html += "<p>No se registraron actividades esta semana.</p>"
        
        html += """
                </div>
                
                <div class="section">
                    <h2>Hitos Completados</h2>
        """
        
        if reporte.hitos_completados:
            for hito in reporte.hitos_completados:
                html += f"""
                    <p><strong>{hito.descripcion}</strong> - Completado: {hito.fecha_completado.strftime('%d/%m/%Y')}</p>
                """
        else:
            html += "<p>No se completaron hitos esta semana.</p>"
        
        html += """
                </div>
                
                <div class="section">
                    <h2>Próximos Hitos</h2>
        """
        
        if reporte.proximos_hitos:
            for hito in reporte.proximos_hitos:
                html += f"""
                    <p><strong>{hito.descripcion}</strong> - Fecha objetivo: {hito.fecha_objetivo.strftime('%d/%m/%Y')} (en {hito.dias_restantes} días)</p>
                """
        else:
            html += "<p>No hay hitos programados para las próximas semanas.</p>"
        
        html += """
                </div>
            </div>
        </body>
        </html>
        """
        
        return html
    
        logger.debug(f"Generating text report for project_id: {reporte.proyecto_id}")
    def _generar_texto_reporte(self, reporte: ReporteProyecto) -> str:
        """Genera contenido de texto plano para reportes semanales."""
        texto = f"REPORTE SEMANAL: {reporte.proyecto_nombre} - SEMANA {reporte.semana}\n"
        texto += f"Fecha: {reporte.fecha_reporte.strftime('%d/%m/%Y')}\n\n"
        
        texto += "INFORMACIÓN GENERAL\n"
        texto += "==================\n"
        texto += f"Cliente: {reporte.cliente_nombre}\n"
        texto += f"Progreso: {reporte.porcentaje_completado}%\n\n"
        
        texto += "ACTIVIDADES RECIENTES\n"
        texto += "====================\n"
        if reporte.actividades_recientes:
            for actividad in reporte.actividades_recientes:
                texto += f"- {actividad.get('fecha', '').strftime('%d/%m/%Y')}: {actividad.get('descripcion', '')}\n"
        else:
            texto += "No se registraron actividades esta semana.\n"
        
        texto += "\nHITOS COMPLETADOS\n"
        texto += "================\n"
        if reporte.hitos_completados:
            for hito in reporte.hitos_completados:
                texto += f"- {hito.descripcion} - Completado: {hito.fecha_completado.strftime('%d/%m/%Y')}\n"
        else:
            texto += "No se completaron hitos esta semana.\n"
        
        texto += "\nPRÓXIMOS HITOS\n"
        texto += "=============\n"
        if reporte.proximos_hitos:
            for hito in reporte.proximos_hitos:
                texto += f"- {hito.descripcion} - Fecha objetivo: {hito.fecha_objetivo.strftime('%d/%m/%Y')} (en {hito.dias_restantes} días)\n"
        else:
            texto += "No hay hitos programados para las próximas semanas.\n"
        
        return texto
