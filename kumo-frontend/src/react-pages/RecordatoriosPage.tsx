import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { Bell, Plus, Trash2, Edit2, Clock } from 'lucide-react';
import { habitosService } from '@/services/habitos.service';
import { recordatoriosService } from '@/services/recordatorios.service';
import type { HabitoResponse, RecordatorioResponse, RecordatorioRequest } from '@/types/api';

type DiaSemanaKey = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO';

const DIAS_SEMANA: Array<{ key: DiaSemanaKey; nombre: string; abrev: string }> = [
  { key: 'LUNES', nombre: 'Lunes', abrev: 'L' },
  { key: 'MARTES', nombre: 'Martes', abrev: 'M' },
  { key: 'MIERCOLES', nombre: 'Miércoles', abrev: 'X' },
  { key: 'JUEVES', nombre: 'Jueves', abrev: 'J' },
  { key: 'VIERNES', nombre: 'Viernes', abrev: 'V' },
  { key: 'SABADO', nombre: 'Sábado', abrev: 'S' },
  { key: 'DOMINGO', nombre: 'Domingo', abrev: 'D' },
];

interface HabitoConRecordatorios {
  habito: HabitoResponse;
  recordatorios: RecordatorioResponse[];
}

export default function RecordatoriosPage() {
  const [habitosConRecordatorios, setHabitosConRecordatorios] = useState<HabitoConRecordatorios[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habitoSeleccionado, setHabitoSeleccionado] = useState<number | null>(null);
  const [horaRecordatorio, setHoraRecordatorio] = useState('09:00');
  const [diasSeleccionados, setDiasSeleccionados] = useState<DiaSemanaKey[]>(['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES']); // Lun-Vie por defecto
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setIsLoading(true);
      const habitos = await habitosService.obtenerHabitos();
      const habitosActivos = habitos.filter(h => !h.estaArchivado);
      
      const data: HabitoConRecordatorios[] = await Promise.all(
        habitosActivos.map(async (habito) => {
          try {
            const recordatorios = await recordatoriosService.obtenerRecordatoriosPorHabito(habito.id);
            return { habito, recordatorios };
          } catch (error) {
            return { habito, recordatorios: [] };
          }
        })
      );
      
      setHabitosConRecordatorios(data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los recordatorios');
    } finally {
      setIsLoading(false);
    }
  };

  const abrirModalNuevo = (habitoId: number) => {
    setHabitoSeleccionado(habitoId);
    setHoraRecordatorio('09:00');
    setDiasSeleccionados(['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES']);
    setError('');
    setIsModalOpen(true);
  };

  const toggleDia = (dia: DiaSemanaKey) => {
    setDiasSeleccionados(prev =>
      prev.includes(dia)
        ? prev.filter(d => d !== dia)
        : [...prev, dia]
    );
  };

  const handleGuardar = async () => {
    setError('');

    if (!habitoSeleccionado) {
      setError('Debe seleccionar un hábito');
      return;
    }

    if (diasSeleccionados.length === 0) {
      setError('Debe seleccionar al menos un día');
      return;
    }

    setIsSaving(true);

    try {
      const data: RecordatorioRequest = {
        habitoId: habitoSeleccionado,
        horaRecordatorio: horaRecordatorio + ':00',
        dias: diasSeleccionados,
        estaActivo: true,
      };

      await recordatoriosService.crearRecordatorio(data);
      await cargarDatos();
      setIsModalOpen(false);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al crear el recordatorio');
    } finally {
      setIsSaving(false);
    }
  };

  const eliminarRecordatorio = async (recordatorioId: number) => {
    if (!confirm('¿Estás seguro de eliminar este recordatorio?')) return;

    try {
      await recordatoriosService.eliminarRecordatorio(recordatorioId);
      await cargarDatos();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al eliminar el recordatorio');
    }
  };

  const toggleRecordatorio = async (recordatorio: RecordatorioResponse) => {
    try {
      await recordatoriosService.actualizarRecordatorio(recordatorio.id, {
        estaActivo: !recordatorio.estaActivo,
      });
      await cargarDatos();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al actualizar el recordatorio');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPath="/recordatorios" />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPath="/recordatorios" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Bell className="h-8 w-8 text-primary-600" />
                Recordatorios
              </h1>
              <p className="text-gray-600 mt-2">
                Configura notificaciones para tus hábitos y nunca olvides completarlos
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-nocumplido-50 border-l-4 border-nocumplido-500 text-nocumplido-800 rounded-r-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-nocumplido-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {habitosConRecordatorios.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Bell className="h-20 w-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No tienes hábitos activos
              </h3>
              <p className="text-gray-600 mb-6">
                Crea algunos hábitos primero para poder configurar recordatorios
              </p>
              <Button onClick={() => window.location.href = '/habitos'}>
                <Plus className="w-4 h-4 mr-2" />
                Ir a Hábitos
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {habitosConRecordatorios.map(({ habito, recordatorios }) => (
              <Card key={habito.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-primary-50 to-transparent border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 text-xl mb-3">
                        <Bell className="w-6 h-6 text-primary-600" />
                        {habito.nombre}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2">
                        {habito.categorias.map((cat) => (
                          <Badge key={cat.id} customColor={cat.colorHex}>
                            {cat.nombre}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      onClick={() => abrirModalNuevo(habito.id)}
                      size="sm"
                      className="shadow-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  {recordatorios.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                      <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 font-medium">
                        No hay recordatorios configurados
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Haz clic en "Agregar" para crear uno
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {recordatorios.map((rec) => (
                        <div
                          key={rec.id}
                          className={`group relative flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                            rec.estaActivo
                              ? 'bg-gradient-to-r from-cumplido-50 to-cumplido-25 border-cumplido-200 shadow-sm hover:shadow-md'
                              : 'bg-gray-50 border-gray-200 opacity-70 hover:opacity-90'
                          }`}
                        >
                          {/* Indicador de estado */}
                          <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
                            rec.estaActivo ? 'bg-cumplido-500' : 'bg-gray-400'
                          }`} />
                          
                          <div className="flex items-center gap-5 flex-1 ml-3">
                            <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${
                              rec.estaActivo ? 'bg-primary-100' : 'bg-gray-200'
                            }`}>
                              <Clock className={`w-6 h-6 ${
                                rec.estaActivo ? 'text-primary-600' : 'text-gray-500'
                              }`} />
                            </div>
                            
                            <div className="flex-1">
                              <p className="text-lg font-bold text-gray-900 mb-2">
                                {rec.horaRecordatorio.substring(0, 5)}
                              </p>
                              <div className="flex gap-1.5">
                                {DIAS_SEMANA.map((dia) => {
                                  const isActive = rec.dias?.includes(dia.key);
                                  return (
                                    <span
                                      key={dia.key}
                                      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                                        isActive
                                          ? 'bg-primary-500 text-white shadow-sm scale-110'
                                          : 'bg-gray-200 text-gray-400'
                                      }`}
                                      title={dia.nombre}
                                    >
                                      {dia.abrev}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => toggleRecordatorio(rec)}
                              variant={rec.estaActivo ? 'primary' : 'outline'}
                              size="sm"
                              className="min-w-[90px]"
                            >
                              {rec.estaActivo ? '✓ Activo' : 'Inactivo'}
                            </Button>
                            <Button
                              onClick={() => eliminarRecordatorio(rec.id)}
                              variant="ghost"
                              size="sm"
                              className="hover:bg-nocumplido-50 hover:text-nocumplido-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Modal Nuevo Recordatorio */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nuevo Recordatorio"
      >
        <div className="space-y-6">
          {/* Hora */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Hora del recordatorio
            </label>
            <Input
              type="time"
              value={horaRecordatorio}
              onChange={(e) => setHoraRecordatorio(e.target.value)}
              className="text-lg font-semibold"
            />
          </div>

          {/* Días de la semana */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Días de la semana
            </label>
            <div className="grid grid-cols-7 gap-2">
              {DIAS_SEMANA.map((dia) => {
                const isSelected = diasSeleccionados.includes(dia.key);
                return (
                  <button
                    key={dia.key}
                    type="button"
                    onClick={() => toggleDia(dia.key)}
                    className={`flex flex-col items-center p-3 rounded-xl border-2 font-medium transition-all ${
                      isSelected
                        ? 'bg-primary-500 text-white border-primary-500 shadow-lg scale-105'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary-300 hover:bg-primary-50'
                    }`}
                    title={dia.nombre}
                  >
                    <span className="text-xs mb-1">{dia.abrev}</span>
                    <span className="text-[10px] opacity-75">{dia.nombre.substring(0, 3)}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {diasSeleccionados.length === 0 
                ? 'Selecciona al menos un día' 
                : `${diasSeleccionados.length} día${diasSeleccionados.length > 1 ? 's' : ''} seleccionado${diasSeleccionados.length > 1 ? 's' : ''}`
              }
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-nocumplido-50 border-l-4 border-nocumplido-500 rounded-r-lg">
              <p className="text-sm text-nocumplido-800 font-medium">
                {error}
              </p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleGuardar}
              variant="primary"
              className="flex-1"
              disabled={isSaving || diasSeleccionados.length === 0}
            >
              {isSaving ? 'Guardando...' : 'Crear Recordatorio'}
            </Button>
            <Button
              onClick={() => setIsModalOpen(false)}
              variant="outline"
              disabled={isSaving}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}