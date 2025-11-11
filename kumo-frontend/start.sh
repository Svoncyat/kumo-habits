#!/bin/bash

# Script para iniciar Kumo Frontend

echo "🚀 Iniciando Kumo Frontend..."
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Debes ejecutar este script desde la carpeta kumo-frontend"
    exit 1
fi

# Verificar que node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Verificar que el archivo .env existe
if [ ! -f ".env" ]; then
    echo "⚙️  Creando archivo .env..."
    cp .env.example .env
fi

echo "✅ Todo listo!"
echo ""
echo "🌐 Iniciando servidor de desarrollo..."
echo "   La aplicación estará disponible en: http://localhost:4321"
echo ""
echo "   Presiona Ctrl+C para detener el servidor"
echo ""

# Iniciar el servidor
npm run dev
