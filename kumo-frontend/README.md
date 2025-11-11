# Kumo Frontend

Frontend de la aplicación Kumo, construido con **Astro**, **React**, **TypeScript** y **Tailwind CSS**.

## 🚀 Características

- ⚡️ **Astro** - Framework moderno y rápido
- ⚛️ **React 19** - Componentes interactivos
- 🎨 **Tailwind CSS** - Estilos modernos y responsivos
- 🔐 **JWT Authentication** - Autenticación segura
- 📱 **Responsive Design** - Diseño adaptable a todos los dispositivos
- 🎯 **TypeScript** - Tipado estático para mayor seguridad

## 📦 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Design System (Button, Input, Card, etc.)
│   └── Navbar.tsx      # Navegación principal
├── contexts/           # React Context (Auth, etc.)
├── pages/              # Páginas de la aplicación
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── HabitosPage.tsx
│   ├── MetricasPage.tsx
│   └── PerfilPage.tsx
├── services/           # Servicios API
│   ├── auth.service.ts
│   ├── habitos.service.ts
│   ├── seguimiento.service.ts
│   ├── metricas.service.ts
│   └── recordatorios.service.ts
├── types/              # Tipos TypeScript
├── lib/                # Utilidades
│   ├── api-client.ts   # Cliente Axios configurado
│   └── utils.ts        # Funciones helper
├── styles/             # Estilos globales
└── App.tsx             # Router principal
```

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con la URL de tu API
```

## 🏃‍♂️ Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:4321
```

## 🏗️ Build

```bash
# Compilar para producción
npm run build

# Preview de producción
npm run preview
```

## 🎨 Design System

El proyecto incluye un design system completo con componentes reutilizables:

- **Button** - Botones con variantes (primary, secondary, outline, ghost, danger)
- **Input** - Inputs con labels, errores y helper text
- **Card** - Tarjetas con variantes (default, outlined, elevated)
- **Modal** - Modales responsivos
- **Badge** - Etiquetas de estado
- **Navbar** - Navegación responsiva

## 🔌 API Integration

El frontend se comunica con el backend a través de servicios organizados por módulo:

- **authService** - Login, registro, perfil
- **habitosService** - CRUD de hábitos
- **seguimientoService** - Registro diario
- **metricasService** - Estadísticas y rachas
- **recordatoriosService** - Gestión de recordatorios

## 🎯 Rutas

- `/login` - Inicio de sesión
- `/register` - Registro de usuario
- `/dashboard` - Dashboard principal
- `/habitos` - Gestión de hábitos
- `/metricas` - Métricas y progreso
- `/perfil` - Perfil de usuario

## 📝 Variables de Entorno

```env
PUBLIC_API_URL=http://localhost:8080/api
```

## 🎨 Colores del Theme

El proyecto usa una paleta de colores personalizada:

- **Primary**: Azul (#0ea5e9)
- **Secondary**: Morado (#a855f7)
- **Success**: Verde
- **Warning**: Amarillo
- **Danger**: Rojo

## 🔒 Autenticación

El sistema de autenticación usa:

- JWT tokens almacenados en localStorage
- AuthContext para estado global
- Interceptores de Axios para agregar tokens automáticamente
- Rutas protegidas con ProtectedRoute component

## 👨‍💻 Tecnologías

- [Astro](https://astro.build) - Framework principal
- [React](https://react.dev) - Librería de UI
- [TypeScript](https://www.typescriptlang.org) - Lenguaje tipado
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS
- [React Router](https://reactrouter.com) - Enrutamiento
- [Axios](https://axios-http.com) - Cliente HTTP
- [Lucide React](https://lucide.dev) - Iconos

## 📄 Licencia

Universidad Nacional de San Martín - Proyecto académico
