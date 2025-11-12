import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { Plus, Edit, Trash2, Archive, Target, Search } from 'lucide-react';
import { habitosService } from '@/services/habitos.service';
import { categoriasService } from '@/services/categorias.service';
import type { HabitoResponse, CrearHabitoRequest, CategoriaResponse } from '@/types/api';
import { formatDate } from '@/lib/utils';

export default function HabitosPage() {
  const [habitos, setHabitos] = useState<HabitoResponse[]>([]);
  const [categorias, setCategorias] = useState<CategoriaResponse[]>([]);
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
  const [metaDiaria, setMetaDiaria] = useState('');
  const [estaArchivado, setEstaArchivado] = useState(false);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<number[]>([]);
  
  // Validation & error states
  const [errors, setErrors] = useState<{
    nombre?: string;
    metaDiaria?: string;
    general?: string;
  }>({});

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    filtrarHabitos();
  }, [habitos, searchQuery, showArchived]);

  const cargarDatos = async () => {
    try {
      setIsLoading(true);
      const [habitosData, categoriasData] = await Promise.all([
        habitosService.obtenerHabitos(),
        categoriasService.obtenerCategorias(),
      ]);
      setHabitos(habitosData);
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
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

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    // Validar nombre (3-100 caracteres)
    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    } else if (nombre.trim().length > 100) {
      newErrors.nombre = 'El nombre no puede exceder 100 caracteres';
    }
    
    // Validar meta diaria (opcional, pero si existe debe ser > 0)
    if (metaDiaria && parseFloat(metaDiaria) <= 0) {
      newErrors.metaDiaria = 'La meta diaria debe ser mayor que 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setNombre('');
    setMetaDiaria('');
    setEstaArchivado(false);
    setCategoriasSeleccionadas([]);
    setErrors({});
  };

  const handleCreateHabito = async () => {
    if (!validateForm()) return;
    
    try {
      const data: CrearHabitoRequest = {
        nombre: nombre.trim(),
        metaDiaria: metaDiaria ? parseFloat(metaDiaria) : undefined,
        estaArchivado,
        categoriaIds: categoriasSeleccionadas.length > 0 ? categoriasSeleccionadas : undefined,
      };
      
      await habitosService.crearHabito(data);
      await cargarDatos();
      resetForm();
      setIsCreateModalOpen(false);
    } catch (error: any) {
      // Manejar error 409 CONFLICT (nombre duplicado)
      if (error.response?.status === 409) {
        setErrors({ general: 'Ya existe un hábito con ese nombre' });
      } else {
        setErrors({ general: error.response?.data?.message || 'Error al crear el hábito' });
      }
    }
  };

  const handleEditHabito = async () => {
    if (!selectedHabito || !validateForm()) return;
    
    try {
      await habitosService.actualizarHabito(selectedHabito.id, {
        nombre: nombre.trim(),
        metaDiaria: metaDiaria ? parseFloat(metaDiaria) : undefined,
        categoriaIds: categoriasSeleccionadas.length > 0 ? categoriasSeleccionadas : undefined,
      });
      
      await cargarDatos();
      resetForm();
      setIsEditModalOpen(false);
      setSelectedHabito(null);
    } catch (error: any) {
      if (error.response?.status === 409) {
        setErrors({ general: 'Ya existe un hábito con ese nombre' });
      } else {
        setErrors({ general: error.response?.data?.message || 'Error al actualizar el hábito' });
      }
    }
  };

  const handleDeleteHabito = async () => {
    if (!selectedHabito) return;
    
    try {
      await habitosService.eliminarHabito(selectedHabito.id);
      await cargarDatos();
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
      await cargarDatos();
    } catch (error) {
      console.error('Error al archivar/desarchivar hábito:', error);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const openEditModal = (habito: HabitoResponse) => {
    setSelectedHabito(habito);
    setNombre(habito.nombre);
    setMetaDiaria(habito.metaDiaria.toString());
    setCategoriasSeleccionadas(habito.categorias.map(c => c.id));
    setErrors({});
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (habito: HabitoResponse) => {
    setSelectedHabito(habito);
    setIsDeleteModalOpen(true);
  };

  const toggleCategoria = (categoriaId: number) => {
    setCategoriasSeleccionadas(prev =>
      prev.includes(categoriaId)
        ? prev.filter(id => id !== categoriaId)
        : [...prev, categoriaId]
    );
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
            <Button onClick={openCreateModal}>
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
                <Button onClick={openCreateModal}>
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
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Crear Nuevo Hábito"
        footer={
          <>
            <Button variant="outline" onClick={() => {
              setIsCreateModalOpen(false);
              resetForm();
            }}>
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
            label="Nombre del Hábito *"
            type="text"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              if (errors.nombre) setErrors({ ...errors, nombre: undefined });
            }}
            placeholder="Ej: Hacer ejercicio"
            error={errors.nombre}
            required
          />
          
          <Input
            label="Meta Diaria (opcional)"
            type="number"
            min="1"
            step="0.1"
            value={metaDiaria}
            onChange={(e) => {
              setMetaDiaria(e.target.value);
              if (errors.metaDiaria) setErrors({ ...errors, metaDiaria: undefined });
            }}
            placeholder="Ej: 1"
            helperText="Cuántas veces quieres realizar este hábito al día"
            error={errors.metaDiaria}
          />

          {/* Categorías */}
          {categorias.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categorías (opcional)
              </label>
              <div className="flex flex-wrap gap-2">
                {categorias.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategoria(cat.id)}
                    className={`px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition-colors ${
                      categoriasSeleccionadas.includes(cat.id)
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-primary-300'
                    }`}
                  >
                    {cat.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Checkbox Archivado */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="estaArchivado"
              checked={estaArchivado}
              onChange={(e) => setEstaArchivado(e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="estaArchivado" className="text-sm text-gray-700">
              Crear como archivado
            </label>
          </div>

          {/* Error general */}
          {errors.general && (
            <div className="p-3 bg-nocumplido-50 border border-nocumplido-200 rounded-lg">
              <p className="text-sm text-nocumplido-700">{errors.general}</p>
            </div>
          )}
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedHabito(null);
          resetForm();
        }}
        title="Editar Hábito"
        footer={
          <>
            <Button variant="outline" onClick={() => {
              setIsEditModalOpen(false);
              setSelectedHabito(null);
              resetForm();
            }}>
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
            label="Nombre del Hábito *"
            type="text"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              if (errors.nombre) setErrors({ ...errors, nombre: undefined });
            }}
            placeholder="Ej: Hacer ejercicio"
            error={errors.nombre}
            required
          />
          
          <Input
            label="Meta Diaria (opcional)"
            type="number"
            min="1"
            step="0.1"
            value={metaDiaria}
            onChange={(e) => {
              setMetaDiaria(e.target.value);
              if (errors.metaDiaria) setErrors({ ...errors, metaDiaria: undefined });
            }}
            placeholder="Ej: 1"
            error={errors.metaDiaria}
          />

          {/* Categorías */}
          {categorias.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categorías (opcional)
              </label>
              <div className="flex flex-wrap gap-2">
                {categorias.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategoria(cat.id)}
                    className={`px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition-colors ${
                      categoriasSeleccionadas.includes(cat.id)
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-primary-300'
                    }`}
                  >
                    {cat.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error general */}
          {errors.general && (
            <div className="p-3 bg-nocumplido-50 border border-nocumplido-200 rounded-lg">
              <p className="text-sm text-nocumplido-700">{errors.general}</p>
            </div>
          )}
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
