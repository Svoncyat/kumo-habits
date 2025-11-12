import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import RachaIndicator from '@/components/ui/RachaIndicator';
import CalendarioDia from '@/components/ui/CalendarioDia';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

/**
 * Página de demostración del sistema de colores
 * Muestra todos los componentes con colores alineados al SRS
 */
export default function ColoresDemo() {
  // Colores de categorías del backend
  const categorias = [
    { id: 1, nombre: 'Mindfulness', color: '#8BC34A' },
    { id: 2, nombre: 'Salud', color: '#FF7043' },
    { id: 3, nombre: 'Productividad', color: '#42A5F5' },
    { id: 4, nombre: 'Aprendizaje', color: '#AB47BC' },
    { id: 5, nombre: 'Bienestar', color: '#FDD835' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sistema de Colores - Kumo Habits
          </h1>
          <p className="text-gray-600">
            Alineado con el SRS y colores dinámicos del backend
          </p>
        </div>

        {/* 1. Colores de Categorías */}
        <Card>
          <CardHeader>
            <CardTitle>1. Colores de Categorías (Dinámicos del Backend)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Los colores provienen de la base de datos y se aplican dinámicamente
            </p>
            <div className="flex flex-wrap gap-3">
              {categorias.map((cat) => (
                <Badge key={cat.id} customColor={cat.color}>
                  {cat.nombre}
                </Badge>
              ))}
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <code className="text-xs">
                {`<Badge customColor={categoria.colorHex}>{categoria.nombre}</Badge>`}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* 2. Estados de Calendario */}
        <Card>
          <CardHeader>
            <CardTitle>2. Estados de Calendario (RF-RAC-RES-004)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Cada día se colorea según su estado: cumplido, no cumplido, sin registro
            </p>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Cumplido</p>
                <CalendarioDia dia={15} estado="cumplido" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">No Cumplido</p>
                <CalendarioDia dia={16} estado="noCumplido" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Sin Registro</p>
                <CalendarioDia dia={17} estado="sinRegistro" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Día Futuro</p>
                <CalendarioDia dia={18} estado="futuro" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="cumplido">Cumplido</Badge>
              <Badge variant="nocumplido">No Cumplido</Badge>
              <Badge variant="sinregistro">Sin Registro</Badge>
            </div>
          </CardContent>
        </Card>

        {/* 3. Indicador de Racha */}
        <Card>
          <CardHeader>
            <CardTitle>3. Indicador de Racha (RF-RAC-CAL-005)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Diseño visual distintivo con icono de fuego en color naranja
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Pequeño</p>
                <RachaIndicator rachaActual={3} size="sm" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Mediano</p>
                <RachaIndicator rachaActual={7} size="md" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Grande</p>
                <RachaIndicator rachaActual={15} size="lg" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. Validación de Formularios */}
        <Card>
          <CardHeader>
            <CardTitle>4. Validación de Formularios (RF-AUT-REG-005)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Campos inválidos con borde rojo distintivo
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email Válido"
                type="email"
                value="usuario@ejemplo.com"
                readOnly
              />
              <Input
                label="Email Inválido"
                type="email"
                error="El formato del email no es válido"
                value="email-invalido"
                readOnly
              />
            </div>
          </CardContent>
        </Card>

        {/* 5. Colores para Gráficos */}
        <Card>
          <CardHeader>
            <CardTitle>5. Colores para Reportes (RF-REP-VIS-001, RF-REP-VIS-003)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Gráfico de Barras - Cumplidos vs No Cumplidos
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-cumplido-100 border-2 border-cumplido-300">
                    <div className="h-20 bg-cumplido-500 rounded mb-2"></div>
                    <p className="text-sm text-center text-cumplido-900 font-medium">
                      Cumplidos (#22c55e)
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-nocumplido-100 border-2 border-nocumplido-300">
                    <div className="h-20 bg-nocumplido-500 rounded mb-2"></div>
                    <p className="text-sm text-center text-nocumplido-900 font-medium">
                      No Cumplidos (#ef4444)
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Gráfico Comparativo - Cada Hábito con Color de Categoría
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {categorias.map((cat) => (
                    <div key={cat.id} className="text-center">
                      <div
                        className="h-16 rounded mb-2"
                        style={{ backgroundColor: cat.color }}
                      ></div>
                      <p className="text-xs text-gray-600">{cat.nombre}</p>
                      <p className="text-xs font-mono text-gray-500">{cat.color}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 6. Paleta Completa */}
        <Card>
          <CardHeader>
            <CardTitle>6. Paleta de Colores Semánticos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Cumplido */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Cumplido (Verde)</p>
                <div className="flex gap-1">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                    <div
                      key={shade}
                      className={`h-12 flex-1 rounded bg-cumplido-${shade}`}
                      title={`cumplido-${shade}`}
                    />
                  ))}
                </div>
              </div>

              {/* No Cumplido */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">No Cumplido (Rojo)</p>
                <div className="flex gap-1">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                    <div
                      key={shade}
                      className={`h-12 flex-1 rounded bg-nocumplido-${shade}`}
                      title={`nocumplido-${shade}`}
                    />
                  ))}
                </div>
              </div>

              {/* Sin Registro */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Sin Registro (Gris)</p>
                <div className="flex gap-1">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                    <div
                      key={shade}
                      className={`h-12 flex-1 rounded bg-sinregistro-${shade}`}
                      title={`sinregistro-${shade}`}
                    />
                  ))}
                </div>
              </div>

              {/* Racha */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Racha (Naranja)</p>
                <div className="flex gap-1">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                    <div
                      key={shade}
                      className={`h-12 flex-1 rounded bg-racha-${shade}`}
                      title={`racha-${shade}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer con info */}
        <div className="text-center text-sm text-gray-600 pb-8">
          <p>
            ✨ Sistema de colores implementado según SRS
          </p>
          <p className="mt-1">
            Colores dinámicos desde el backend • Estados visuales semánticos • Accesibilidad
          </p>
        </div>
      </div>
    </div>
  );
}
