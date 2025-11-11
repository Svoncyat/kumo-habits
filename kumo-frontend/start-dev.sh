#!/bin/bash

echo "🚀 Iniciando Kumo Habits Frontend..."
echo ""
echo "📝 Configuración:"
echo "   • Modo: Static (con rutas pre-renderizadas)"
echo "   • Puerto: 4321"
echo "   • Hot Reload: Activado"
echo ""
echo "✨ Rutas disponibles:"
echo "   • http://localhost:4321/login"
echo "   • http://localhost:4321/register"
echo "   • http://localhost:4321/dashboard"
echo "   • http://localhost:4321/habitos"
echo "   • http://localhost:4321/metricas"
echo "   • http://localhost:4321/perfil"
echo "   • http://localhost:4321/colores-demo"
echo ""
echo "💡 Ahora puedes:"
echo "   ✅ Acceder directamente a cualquier ruta"
echo "   ✅ Recargar la página sin problemas"
echo "   ✅ Usar el botón 'atrás' del navegador"
echo ""

cd /home/svonccy/workspaces/kumo-habits/kumo-frontend
npm run dev
