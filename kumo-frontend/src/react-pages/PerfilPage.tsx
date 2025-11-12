import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { User, Mail, Lock, Trash2, Save, AlertCircle } from 'lucide-react';
import { perfilService } from '@/services/auth.service';
import type { ActualizarPerfilRequest } from '@/types/api';
import { formatDate } from '@/lib/utils';

export default function PerfilPage() {
  const { user, refreshUser, logout } = useAuth();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setNombre(user.nombre);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = async () => {
    setError('');
    setSuccess('');

    // Validaciones
    if (password && password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password && password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsSaving(true);

    try {
      const data: ActualizarPerfilRequest = {
        nombre,
        email,
      };

      if (password) {
        data.password = password;
      }

      await perfilService.actualizarPerfil(data);
      await refreshUser();
      
      setSuccess('Perfil actualizado correctamente');
      setIsEditing(false);
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await perfilService.eliminarCuenta();
      // El servicio ya hace logout y redirige
    } catch (error) {
      console.error('Error al eliminar cuenta:', error);
    }
  };

  const handleCancel = () => {
    if (user) {
      setNombre(user.nombre);
      setEmail(user.email);
      setPassword('');
      setConfirmPassword('');
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPath="/perfil" />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPath="/perfil" />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <User className="h-8 w-8 text-primary-600" />
            Mi Perfil
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona tu información personal y preferencias
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-start gap-2">
            <Save className="h-5 w-5 text-green-600 mt-0.5" />
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {/* Profile Info */}
        <Card variant="elevated" className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                  Actualiza tu nombre, correo y contraseña
                </CardDescription>
              </div>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)}>
                  Editar Perfil
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-10 h-5 w-5 text-gray-400" />
                <Input
                  label="Nombre Completo"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-10 h-5 w-5 text-gray-400" />
                <Input
                  label="Correo Electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>

              {isEditing && (
                <>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-4">
                      Cambiar Contraseña (opcional)
                    </p>
                    
                    <div className="space-y-4">
                      <div className="relative">
                        <Lock className="absolute left-3 top-10 h-5 w-5 text-gray-400" />
                        <Input
                          label="Nueva Contraseña"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Dejar en blanco para no cambiar"
                          className="pl-10"
                        />
                      </div>

                      {password && (
                        <div className="relative">
                          <Lock className="absolute left-3 top-10 h-5 w-5 text-gray-400" />
                          <Input
                            label="Confirmar Nueva Contraseña"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirma tu nueva contraseña"
                            className="pl-10"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSave} isLoading={isSaving} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </Button>
                  <Button variant="outline" onClick={handleCancel} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Información de la Cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Fecha de Registro:</span>
                <span className="font-medium text-gray-900">
                  {user.fechaRegistro ? formatDate(user.fechaRegistro) : 'No disponible'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Zona Horaria:</span>
                <span className="font-medium text-gray-900">{user.zonaHoraria || 'No configurada'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Formato de Fecha:</span>
                <span className="font-medium text-gray-900">{user.formatoFecha || 'No configurado'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-900">Zona de Peligro</CardTitle>
            <CardDescription className="text-red-700">
              Acciones irreversibles con tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-red-900">Eliminar Cuenta</h4>
                <p className="text-sm text-red-700 mt-1">
                  Esta acción eliminará permanentemente tu cuenta y todos tus datos.
                  No se puede deshacer.
                </p>
              </div>
              <Button
                variant="danger"
                onClick={() => setIsDeleteModalOpen(true)}
                className="ml-4"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Eliminar Cuenta"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount}>
              Sí, Eliminar Mi Cuenta
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 font-medium mb-2">
              ⚠️ Esta acción es permanente e irreversible
            </p>
            <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
              <li>Se eliminarán todos tus hábitos</li>
              <li>Se perderán todos tus registros y métricas</li>
              <li>No podrás recuperar tu cuenta</li>
            </ul>
          </div>
          <p className="text-gray-700">
            ¿Estás completamente seguro de que deseas eliminar tu cuenta?
          </p>
        </div>
      </Modal>
    </div>
  );
}
