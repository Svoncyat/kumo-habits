import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import RachaIndicator from '@/components/ui/RachaIndicator';
import { TrendingUp, Target, Award, Calendar, Flame } from 'lucide-react';
import { habitosService } from '@/services/habitos.service';
import { metricasService } from '@/services/metricas.service';
import type { HabitoResponse, MetricasResponse } from '@/types/api';

interface HabitoConMetricas {
  habito: HabitoResponse;
  metricas: MetricasResponse | null;
}

export default function MetricasPage() {
  const [habitosConMetricas, setHabitosConMetricas] = useState<HabitoConMetricas[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const habitos = await habitosService.obtenerHabitos();
      const habitosActivos = habitos.filter(h => !h.estaArchivado);
      
      const data: HabitoConMetricas[] = await Promise.all(
        habitosActivos.map(async (habito) => {
          try {
            const metricas = await metricasService.obtenerMetricasPorHabito(habito.id);
            return { habito, metricas };
          } catch (error) {
            return { habito, metricas: null };
          }
        })
      );
      
      setHabitosConMetricas(data);
    } catch (error) {
      console.error('Error al cargar métricas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular estadísticas generales
  const totalHabitos = habitosConMetricas.length;
  const totalDiasCumplidos = habitosConMetricas.reduce(
    (acc, item) => acc + (item.metricas?.totalDiasCumplidos || 0),
    0
  );
  const rachaMaxima = Math.max(
    ...habitosConMetricas.map(item => item.metricas?.rachaMasLarga || 0),
    0
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPath="/metricas" />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPath="/metricas" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary-600" />
            Métricas y Progreso
          </h1>
          <p className="text-gray-600 mt-2">
            Analiza tu desempeño y mantén el impulso
          </p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-5 w-5 text-primary-600" />
                Total de Hábitos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-gray-900">{totalHabitos}</p>
              <p className="text-sm text-gray-600 mt-1">Hábitos activos</p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-5 w-5 text-green-600" />
                Días Cumplidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-gray-900">{totalDiasCumplidos}</p>
              <p className="text-sm text-gray-600 mt-1">En todos tus hábitos</p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Flame className="h-5 w-5 text-orange-600" />
                Racha Máxima
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-gray-900">{rachaMaxima}</p>
              <p className="text-sm text-gray-600 mt-1">Días consecutivos</p>
            </CardContent>
          </Card>
        </div>

        {/* Individual Metrics */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Desempeño por Hábito
          </h2>
        </div>

        {habitosConMetricas.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No tienes hábitos activos
              </h3>
              <p className="text-gray-600">
                Crea hábitos para ver tus métricas y progreso
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {habitosConMetricas.map(({ habito, metricas }) => (
              <Card key={habito.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{habito.nombre}</CardTitle>
                      <CardDescription className="mt-1">
                        Meta diaria: {habito.metaDiaria} {habito.metaDiaria === 1 ? 'vez' : 'veces'}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {habito.categorias.map((cat) => (
                        <Badge key={cat.id} customColor={cat.colorHex}>
                          {cat.nombre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {metricas ? (
                    <div className="space-y-6">
                      {/* RF-RAC-CAL-005: Indicador de racha con icono de fuego */}
                      <div className="flex justify-center">
                        <RachaIndicator rachaActual={metricas.rachaMasLarga} size="lg" />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-cumplido-50 rounded-lg border-2 border-cumplido-200">
                          <Calendar className="h-6 w-6 text-cumplido-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-gray-900">
                            {metricas.totalDiasCumplidos}
                          </p>
                          <p className="text-sm text-gray-600">Días cumplidos</p>
                        </div>

                        <div className="text-center p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                          <Award className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-gray-900">
                            {metricas.totalValorAcumulado.toFixed(0)}
                          </p>
                          <p className="text-sm text-gray-600">Valor acumulado</p>
                        </div>

                        <div className="text-center p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                          <TrendingUp className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-gray-900">
                            {metricas.totalDiasCumplidos > 0
                              ? Math.round(
                                  (metricas.totalValorAcumulado /
                                    metricas.totalDiasCumplidos) *
                                    10
                                ) / 10
                              : 0}
                          </p>
                          <p className="text-sm text-gray-600">Promedio diario</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No hay datos de métricas disponibles</p>
                      <p className="text-sm mt-1">Comienza a registrar para ver tu progreso</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Motivational Section */}
        {totalDiasCumplidos > 0 && (
          <Card className="mt-8 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
            <CardContent className="text-center py-8">
              <Award className="h-16 w-16 text-primary-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Excelente trabajo! 🎉
              </h3>
              <p className="text-lg text-gray-700">
                Has completado <strong>{totalDiasCumplidos}</strong> días de hábitos.
                {rachaMaxima >= 7 && (
                  <> Tu racha más larga es de <strong>{rachaMaxima}</strong> días. ¡Sigue así!</>
                )}
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
