import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Cloud, Mail, Lock, User as UserIcon, AlertCircle, CheckCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';

export default function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      await register({ nombre, email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear la cuenta. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 6) return 'Débil';
    if (password.length < 10) return 'Media';
    return 'Fuerte';
  };

  const strengthColor = () => {
    const strength = passwordStrength();
    if (strength === 'Débil') return 'text-red-600';
    if (strength === 'Media') return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-50 via-white to-primary-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-secondary-600 p-3 rounded-2xl shadow-lg">
              <Cloud className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Únete a Kumo</h1>
          <p className="text-gray-600 mt-2">Comienza a construir mejores hábitos hoy</p>
        </div>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Crear Cuenta</CardTitle>
            <CardDescription>Completa tus datos para registrarte</CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <UserIcon className="absolute left-3 top-10 h-5 w-5 text-gray-400" />
                <Input
                  label="Nombre Completo"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Juan Pérez"
                  required
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
                  placeholder="tu@email.com"
                  required
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-10 h-5 w-5 text-gray-400" />
                <Input
                  label="Contraseña"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-10"
                  helperText={
                    passwordStrength() ? (
                      <span className={strengthColor()}>
                        Seguridad: {passwordStrength()}
                      </span>
                    ) : (
                      'Mínimo 6 caracteres'
                    )
                  }
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-10 h-5 w-5 text-gray-400" />
                <Input
                  label="Confirmar Contraseña"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-10"
                />
                {confirmPassword && password === confirmPassword && (
                  <CheckCircle className="absolute right-3 top-10 h-5 w-5 text-green-600" />
                )}
              </div>

              <Button type="submit" variant="secondary" className="w-full" isLoading={isLoading}>
                Crear Cuenta
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex-col gap-3">
            <div className="text-sm text-center text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <a href="/login" className="font-medium text-secondary-600 hover:text-secondary-700">
                Inicia sesión
              </a>
            </div>
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-8">
          © 2024 Kumo - UNSM · Tu compañero de hábitos
        </p>
      </div>
    </div>
  );
}
