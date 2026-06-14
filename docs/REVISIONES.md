# Changelog y Revisiones (Solar Fluidity v5)

Este documento mantiene un registro cronológico de los cambios estructurales, actualizaciones de diseño e integraciones técnicas aplicadas al proyecto.

## [v5.1.1] - 2026-06-14

### Añadido
- **Arquitectura Base**: Migración completa de Vite/React a **Next.js 14 (App Router)**.
- **Renderizado 3D**: Implementación de escena 3D básica con `@react-three/fiber` y un cubo paramétrico que rompe la inercia del desarrollo.
- **Soporte de Pagos**: Inserción del tipado global `Window.paypal` en `global.d.ts` para habilitar el SDK de PayPal con estricto soporte TypeScript.
- **Estética (UI/UX)**: Diseño SaaS "Premium" (Dark Mode) con `framer-motion` (micro-animaciones) y `lucide-react` (iconografía). Incorporación de esquema de color *Naranja Solar*.
- **Tracking Docs**: Creación de `REVISIONES.md` y `CHECKLIST_IMPLEMENTACION.md`.

### Eliminado
- **Vite & Legacy React**: Se borró toda la configuración anterior de Vite, `src/App.tsx`, `index.html` y dependencias inactivas para erradicar deuda técnica.

---

*Formato basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).*
