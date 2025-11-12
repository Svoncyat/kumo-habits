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

const DIAS_SEMANA = [
  { id: 1, nombre: 'Lunes', abrev: 'L' },
  { id: 2, nombre: 'Martes', abrev: 'M' },
  { id: 3, nombre: 'Miércoles', abrev: 'X' },
  { id: 4, nombre: 'Jueves', abrev: 'J' },
  { id: 5, nombre: 'Viernes', abrev: 'V' },
  { id: 6, nombre: 'Sábado', abrev: 'S' },
  { id: 7, nombre: 'Domingo', abrev: 'D' },
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
  const [diasSeleccionados, setDiasSeleccionados] = useState<number[]>([1, 2, 3, 4, 5]); // Lun-Vie por defecto
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
    setDiasSeleccionados([1, 2, 3, 4, 5]);
    setError('');
    setIsModalOpen(true);
  };

  const toggleDia = (diaId: number) => {
    setDiasSeleccionados(prev =>
      prev.includes(diaId)
        ? prev.filter(d => d !== diaId)
        : [...prev, diaId].sort()
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
        diasSemana: diasSeleccionados,
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
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Cargando recordatorios...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recordatorios</h1>
            <p className="text-gray-600 mt-1">
              Configura notificaciones para tus hábitos
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-nocumplido-50 border border-nocumplido-200 text-nocumplido-800 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {habitosConRecordatorios.map(({ habito, recordatorios }) => (
            <Card key={habito.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-primary-500" />
                      {habito.nombre}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      <div className="flex flex-wrap gap-2">
                        {habito.categorias.map((cat) => (
                          <Badge key={cat.id} customColor={cat.colorHex}>
                            {cat.nombre}
                          </Badge>
                        ))}
                      </div>
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => abrirModalNuevo(habito.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Nuevo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recordatorios.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">
                    No hay recordatorios configurados
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recordatorios.map((rec) => (
                      <div
                        key={rec.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          rec.estaActivo
                            ? 'bg-cumplido-50 border-cumplido-200'
                            : 'bg-gray-50 border-gray-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <Clock className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {rec.horaRecordatorio.substring(0, 5)}
                            </p>
                            <div className="flex gap-1 mt-1">
                              {DIAS_SEMANA.map((dia) => (
                                <span
                                  key={dia.id}
                                  className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                                    rec.diasSemana.includes(dia.id)
                                      ? 'bg-primary-500 text-white'
                                      : 'bg-gray-200 text-gray-400'
                                  }`}
                                >
                                  {dia.abrev}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => toggleRecordatorio(rec)}
                            variant={rec.estaActivo ? 'primary' : 'outline'}
                            size="sm"
                          >
                            {rec.estaActivo ? 'Activo' : 'Inactivo'}
                          </Button>
                          <Button
                            onClick={() => eliminarRecordatorio(rec.id)}
                            variant="ghost"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4 text-nocumplido-600" />
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

        {/* Modal Nuevo Recordatorio */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Nuevo Recordatorio"
        >
          <div className="space-y-4">
            <Input
              label="Hora del recordatorio"
              type="time"
              value={horaRecordatorio}
              onChange={(e) => setHoraRecordatorio(e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Días de la semana
              </label>
              <div className="flex gap-2 flex-wrap">
                {DIAS_SEMANA.map((dia) => (
                  <button
                    key={dia.id}
                    type="button"
                    onClick={() => toggleDia(dia.id)}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                      diasSeleccionados.includes(dia.id)
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary-300'
                    }`}
                  >
                    {dia.nombre}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-nocumplido-600 font-medium">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleGuardar}
                variant="primary"
                disabled={isSaving}
                className="flex-1"
              >
                {isSaving ? 'Guardando...' : 'Guardar Recordatorio'}
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
    </div>
  );
}
