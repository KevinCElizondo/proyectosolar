#!/bin/bash

# Script para limpiar el proyecto y prepararlo para despliegue en Vercel
echo "Iniciando limpieza del proyecto Solar Fluidity para despliegue en Vercel..."

# Directorios a eliminar (componentes de backend y herramientas)
DIRS_TO_REMOVE=(
  "ai_agents"
  "agents"
  "backend-api"
  "mcp-python-sdk"
  "support-dashboard"
  ".roo"
  ".venv"
  "node_modules" # Se eliminará, pero se reinstalará después
)

# Archivos a eliminar
FILES_TO_REMOVE=(
  "cloudbuild.yaml"
  "docker-compose.yml"
  "start_solar_fluidity.sh"
  "bun.lockb"
)

# Eliminar documentos innecesarios, manteniendo solo los relevantes para Vercel
DOCS_TO_KEEP=(
  "GUIA_DESPLIEGUE_VERCEL.md"
  "ESTRUCTURA_PROYECTO.md" # Mantener para referencia
)

# Crear un backup de .gitignore por si acaso
if [ -f ".gitignore" ]; then
  cp .gitignore .gitignore.bak
  echo "Backup de .gitignore creado."
fi

# Eliminar directorios innecesarios
for dir in "${DIRS_TO_REMOVE[@]}"; do
  if [ -d "$dir" ]; then
    echo "Eliminando directorio: $dir"
    rm -rf "$dir"
  fi
done

# Eliminar archivos innecesarios
for file in "${FILES_TO_REMOVE[@]}"; do
  if [ -f "$file" ]; then
    echo "Eliminando archivo: $file"
    rm -f "$file"
  fi
done

# Limpiar la carpeta docs manteniendo solo los archivos necesarios
if [ -d "docs" ]; then
  echo "Limpiando directorio docs..."
  # Crear un directorio temporal para los archivos a mantener
  mkdir -p docs_temp
  
  # Copiar solo los archivos necesarios
  for doc in "${DOCS_TO_KEEP[@]}"; do
    if [ -f "docs/$doc" ]; then
      echo "Manteniendo documento: $doc"
      cp "docs/$doc" "docs_temp/"
    fi
  done
  
  # Reemplazar el directorio docs original
  rm -rf docs
  mv docs_temp docs
fi

# Reinstalar dependencias para asegurar un proyecto limpio
echo "Reinstalando dependencias de Node.js..."
npm install

# Ejecutar build para verificar que todo funciona correctamente
echo "Construyendo el proyecto para verificar..."
npm run build

echo "Limpieza completada. El proyecto está listo para ser desplegado en Vercel."
echo "Recuerda configurar las variables de entorno en Vercel según .env.production"
