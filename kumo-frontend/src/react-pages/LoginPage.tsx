import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Cloud, Mail, Lock, AlertCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Intentando login con:', { email });
      await login({ email, password });
      console.log('Login exitoso, navegando a dashboard');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Error en login:', err);
      console.error('Response data:', err.response?.data);
      console.error('Response status:', err.response?.status);
      const errorMessage = err.response?.data?.message || err.message || 'Error al iniciar sesión. Verifica tus credenciales.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-600 p-3 rounded-2xl shadow-lg">
              <Cloud className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Bienvenido a Kumo</h1>
          <p className="text-gray-600 mt-2">Inicia sesión para continuar</p>
        </div>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
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
                />
              </div>

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Iniciar Sesión
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex-col gap-3">
            <div className="text-sm text-center text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
                Regístrate aquí
              </Link>
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
