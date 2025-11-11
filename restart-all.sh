#!/bin/bash

echo "🔄 Reiniciando aplicación Kumo Habits..."

# Detener procesos anteriores
echo "⏹️  Deteniendo procesos anteriores..."
pkill -f "kumo-backend" 2>/dev/null || true
pkill -f "astro" 2>/dev/null || true
sleep 2

# Ir al directorio backend
cd /home/svonccy/workspaces/kumo-habits/kumo-backend

# Iniciar backend en background
echo "🚀 Iniciando backend en puerto 8080..."
nohup java -jar target/www-0.0.1-SNAPSHOT.jar > backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Esperar a que el backend esté listo
echo "⏳ Esperando que el backend inicie..."
sleep 10

# Verificar que el backend esté respondiendo
if curl -s http://localhost:8080/actuator/health > /dev/null; then
    echo "✅ Backend está activo"
else
    echo "❌ Error: Backend no responde"
    exit 1
fi

# Ir al directorio frontend
cd /home/svonccy/workspaces/kumo-habits/kumo-frontend

# Iniciar frontend
echo "🚀 Iniciando frontend en puerto 4321..."
nohup npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

sleep 5

echo ""
echo "✨ Aplicación iniciada:"
echo "   🔧 Backend:  http://localhost:8080/api"
echo "   🎨 Frontend: http://localhost:4321"
echo "   🧪 Test:     http://localhost:4321/test-api.html"
echo ""
echo "📋 Para ver logs:"
echo "   Backend:  tail -f /home/svonccy/workspaces/kumo-habits/kumo-backend/backend.log"
echo "   Frontend: tail -f /home/svonccy/workspaces/kumo-habits/kumo-frontend/frontend.log"
echo ""
echo "⏹️  Para detener:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
