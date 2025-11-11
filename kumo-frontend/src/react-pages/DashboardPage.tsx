import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Target, TrendingUp, Calendar, Plus, CheckCircle2, Circle } from 'lucide-react';
import { habitosService } from '@/services/habitos.service';
import { seguimientoService } from '@/services/seguimiento.service';
import type { HabitoResponse, RegistroResponse } from '@/types/api';
import { formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [habitos, setHabitos] = useState<HabitoResponse[]>([]);
  const [registrosHoy, setRegistrosHoy] = useState<RegistroResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const habitosData = await habitosService.obtenerHabitos();
      const habitosActivos = habitosData.filter(h => !h.estaArchivado);
      setHabitos(habitosActivos);

      // Cargar registros de hoy para cada hábito
      const hoy = new Date().toISOString().split('T')[0];
      const todosRegistros: RegistroResponse[] = [];
      
      for (const habito of habitosActivos) {
        const registros = await seguimientoService.obtenerRegistrosPorHabito(habito.id);
        const registroHoy = registros.find(r => r.fechaRegistro === hoy);
        if (registroHoy) {
          todosRegistros.push(registroHoy);
        }
      }
      
      setRegistrosHoy(todosRegistros);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const marcarHabito = async (habitoId: number) => {
    const hoy = new Date().toISOString().split('T')[0];
    const habito = habitos.find(h => h.id === habitoId);
    
    if (!habito) return;

    try {
      await seguimientoService.crearRegistro({
        habitoId,
        fechaRegistro: hoy,
        valorRegistrado: habito.metaDiaria,
        estaCumplido: true,
      });
      
      await cargarDatos();
    } catch (error) {
      console.error('Error al marcar hábito:', error);
    }
  };

  const habitosCumplidos = registrosHoy.filter(r => r.estaCumplido).length;
  const porcentajeCumplimiento = habitos.length > 0 
    ? Math.round((habitosCumplidos / habitos.length) * 100) 
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPath="/dashboard" />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPath="/dashboard" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Hola, {user?.nombre}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-5 w-5 text-primary-600" />
                Hábitos Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{habitos.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Completados Hoy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {habitosCumplidos} / {habitos.length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Cumplimiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{porcentajeCumplimiento}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${porcentajeCumplimiento}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hábitos de Hoy */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary-600" />
              Tus Hábitos de Hoy
            </h2>
            <Button onClick={() => navigate('/habitos')}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Hábito
            </Button>
          </div>

          {habitos.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No tienes hábitos activos
                </h3>
                <p className="text-gray-600 mb-6">
                  Comienza creando tu primer hábito para empezar a construir rutinas consistentes
                </p>
                <Button onClick={() => navigate('/habitos')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Mi Primer Hábito
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {habitos.map((habito) => {
                const registroHoy = registrosHoy.find(r => r.habitoId === habito.id);
                const estaCumplido = registroHoy?.estaCumplido || false;

                return (
                  <Card
                    key={habito.id}
                    className={`transition-all hover:shadow-lg ${
                      estaCumplido ? 'border-green-500 bg-green-50' : ''
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          {estaCumplido ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400" />
                          )}
                          {habito.nombre}
                        </span>
                      </CardTitle>
                      <CardDescription>
                        Meta: {habito.metaDiaria} {habito.metaDiaria === 1 ? 'vez' : 'veces'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {habito.categorias.map((cat) => (
                          <Badge key={cat.id} variant="info">
                            {cat.nombre}
                          </Badge>
                        ))}
                      </div>
                      
                      {!estaCumplido ? (
                        <Button
                          onClick={() => marcarHabito(habito.id)}
                          variant="primary"
                          size="sm"
                          className="w-full"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Marcar como Completado
                        </Button>
                      ) : (
                        <div className="flex items-center justify-center gap-2 text-green-700 font-medium">
                          <CheckCircle2 className="h-5 w-5" />
                          ¡Completado!
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/metricas')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Ver Métricas y Progreso
              </CardTitle>
              <CardDescription>
                Analiza tu desempeño y rachas
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/habitos')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary-600" />
                Gestionar Hábitos
              </CardTitle>
              <CardDescription>
                Crear, editar o archivar hábitos
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
}
