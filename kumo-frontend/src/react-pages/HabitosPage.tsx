import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { Plus, Edit, Trash2, Archive, Target, Search } from 'lucide-react';
import { habitosService } from '@/services/habitos.service';
import type { HabitoResponse, CrearHabitoRequest } from '@/types/api';
import { formatDate } from '@/lib/utils';

export default function HabitosPage() {
  const [habitos, setHabitos] = useState<HabitoResponse[]>([]);
  const [filteredHabitos, setFilteredHabitos] = useState<HabitoResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedHabito, setSelectedHabito] = useState<HabitoResponse | null>(null);
  
  // Form states
  const [nombre, setNombre] = useState('');
  const [metaDiaria, setMetaDiaria] = useState('1');

  useEffect(() => {
    cargarHabitos();
  }, []);

  useEffect(() => {
    filtrarHabitos();
  }, [habitos, searchQuery, showArchived]);

  const cargarHabitos = async () => {
    try {
      const data = await habitosService.obtenerHabitos();
      setHabitos(data);
    } catch (error) {
      console.error('Error al cargar hábitos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filtrarHabitos = () => {
    let filtered = habitos;
    
    // Filtrar por archivados
    if (!showArchived) {
      filtered = filtered.filter(h => !h.estaArchivado);
    }
    
    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(h =>
        h.nombre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredHabitos(filtered);
  };

  const handleCreateHabito = async () => {
    try {
      const data: CrearHabitoRequest = {
        nombre,
        metaDiaria: parseFloat(metaDiaria),
      };
      
      await habitosService.crearHabito(data);
      await cargarHabitos();
      
      // Reset form
      setNombre('');
      setMetaDiaria('1');
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error al crear hábito:', error);
    }
  };

  const handleEditHabito = async () => {
    if (!selectedHabito) return;
    
    try {
      await habitosService.actualizarHabito(selectedHabito.id, {
        nombre,
        metaDiaria: parseFloat(metaDiaria),
      });
      
      await cargarHabitos();
      setIsEditModalOpen(false);
      setSelectedHabito(null);
    } catch (error) {
      console.error('Error al actualizar hábito:', error);
    }
  };

  const handleDeleteHabito = async () => {
    if (!selectedHabito) return;
    
    try {
      await habitosService.eliminarHabito(selectedHabito.id);
      await cargarHabitos();
      setIsDeleteModalOpen(false);
      setSelectedHabito(null);
    } catch (error) {
      console.error('Error al eliminar hábito:', error);
    }
  };

  const handleArchiveHabito = async (habito: HabitoResponse) => {
    try {
      await habitosService.actualizarHabito(habito.id, {
        estaArchivado: !habito.estaArchivado,
      });
      await cargarHabitos();
    } catch (error) {
      console.error('Error al archivar/desarchivar hábito:', error);
    }
  };

  const openEditModal = (habito: HabitoResponse) => {
    setSelectedHabito(habito);
    setNombre(habito.nombre);
    setMetaDiaria(habito.metaDiaria.toString());
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (habito: HabitoResponse) => {
    setSelectedHabito(habito);
    setIsDeleteModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPath="/habitos" />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPath="/habitos" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Target className="h-8 w-8 text-primary-600" />
                Mis Hábitos
              </h1>
              <p className="text-gray-600 mt-2">
                Gestiona y organiza tus hábitos diarios
              </p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Hábito
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar hábitos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={showArchived ? 'primary' : 'outline'}
              onClick={() => setShowArchived(!showArchived)}
            >
              <Archive className="h-4 w-4 mr-2" />
              {showArchived ? 'Ocultar Archivados' : 'Ver Archivados'}
            </Button>
          </div>
        </div>

        {/* Hábitos List */}
        {filteredHabitos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No se encontraron hábitos' : 'No tienes hábitos'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Crea tu primer hábito para comenzar'}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Hábito
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHabitos.map((habito) => (
              <Card
                key={habito.id}
                className={`hover:shadow-lg transition-all ${
                  habito.estaArchivado ? 'opacity-60' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {habito.nombre}
                        {habito.estaArchivado && (
                          <Badge variant="default">Archivado</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Meta diaria: {habito.metaDiaria} {habito.metaDiaria === 1 ? 'vez' : 'veces'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {habito.categorias.map((cat) => (
                      <Badge key={cat.id} customColor={cat.colorHex}>
                        {cat.nombre}
                      </Badge>
                    ))}
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    Creado: {formatDate(habito.fechaCreacion)}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(habito)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleArchiveHabito(habito)}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => openDeleteModal(habito)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Crear Nuevo Hábito"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateHabito}>
              Crear Hábito
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nombre del Hábito"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Hacer ejercicio"
            required
          />
          <Input
            label="Meta Diaria"
            type="number"
            min="1"
            step="1"
            value={metaDiaria}
            onChange={(e) => setMetaDiaria(e.target.value)}
            helperText="Cuántas veces quieres realizar este hábito al día"
            required
          />
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedHabito(null);
        }}
        title="Editar Hábito"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditHabito}>
              Guardar Cambios
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nombre del Hábito"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Hacer ejercicio"
            required
          />
          <Input
            label="Meta Diaria"
            type="number"
            min="1"
            step="1"
            value={metaDiaria}
            onChange={(e) => setMetaDiaria(e.target.value)}
            required
          />
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedHabito(null);
        }}
        title="Eliminar Hábito"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteHabito}>
              Eliminar
            </Button>
          </>
        }
      >
        <p className="text-gray-700">
          ¿Estás seguro de que deseas eliminar el hábito{' '}
          <strong>{selectedHabito?.nombre}</strong>? Esta acción no se puede deshacer.
        </p>
      </Modal>
    </div>
  );
}
