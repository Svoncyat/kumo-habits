# ☁️ Kumo - Aplicación de Seguimiento de Hábitos

Kumo es una aplicación web full-stack diseñada para ayudar a los usuarios a construir, rastrear y analizar sus hábitos personales. El propósito central es apoyar la constancia y ofrecer información clara para la toma de decisiones individuales sobre rutinas y metas.

Este proyecto ha sido desarrollado como parte del curso **Lenguaje de Programación III** en la **Universidad Nacional de San Martín (UNSM)**.

## ✨ Características Principales

El alcance del proyecto se centra en un **Producto Mínimo Viable (MVP)** robusto con las siguientes funcionalidades:

- **Autenticación y Usuarios:** Registro de cuenta, inicio de sesión, y recuperación de contraseña
- **Gestión de Perfil:** Edición de nombre, cambio de correo y preferencias de usuario como **zona horaria** y **formato de fecha**
- **Gestión de Hábitos (CRUD):** Creación, edición, archivado y eliminación de hábitos
- **Seguimiento Diario:** Registro de cumplimiento diario por hábito con control de unicidad por día
- **Métricas y Rachas:** Cálculo de rachas (días consecutivos) y la racha más larga
- **Reportes:** Visualización de progreso y reportes con filtros y exportación a CSV
- **Metas:** Definición de metas mensuales por hábito
- **Portabilidad y Privacidad:** Exportación completa de datos del usuario y eliminación permanente de la cuenta

## 🛠️ Stack Tecnológico

### Backend

- **Java 17+** con **Spring Boot**
- Spring Web, Spring Security, Spring Data JPA
- PostgreSQL
- Flyway para migraciones
- JWT para autenticación

### Frontend

- **Astro** - Framework moderno
- **React 19** - UI Components
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos modernos
- **React Router** - Navegación
- **Axios** - Cliente HTTP

## 🏗️ Arquitectura y Diseño de Base de Datos

El backend sigue una arquitectura modular y limpia, aplicando principios **SOLID** como el Principio de Responsabilidad Única (SRP) para separar la lógica de negocio en 5 dominios claros:

1. **Gestión de Cuentas:** Identidad, seguridad y perfiles
2. **Gestión de Hábitos:** Definición y organización de hábitos
3. **Registros y Cumplimiento:** Tracking diario
4. **Análisis y Métricas:** Cálculo de rachas y metas
5. **Notificaciones:** Gestión de recordatorios

El diseño de la base de datos (PostgreSQL) está normalizado y consta de **18 tablas** y **4 ENUMs** para garantizar la integridad de los datos, soportar auditorías de cambios y permitir la escalabilidad futura.

## 🚀 Cómo Empezar

### Prerrequisitos

- Java JDK 17 o superior
- Maven 4.0.0+
- Node.js 18+
- PostgreSQL 13+

### 1. Base de Datos

1. Crea una base de datos en PostgreSQL:

   ```sql
   CREATE DATABASE kumo_db;
   ```

2. Las migraciones se ejecutan automáticamente con Flyway al iniciar el backend

### 2. Backend (Spring Boot)

1. Navega a la carpeta del backend:

   ```bash
   cd kumo-backend
   ```

2. Configura las variables de entorno o edita `src/main/resources/application.properties`:

   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/kumo_db
   spring.datasource.username=postgres
   spring.datasource.password=tu_password
   ```

3. Ejecuta la aplicación:

   ```bash
   mvn spring-boot:run
   ```

4. El backend estará corriendo en `http://localhost:8080`

### 3. Frontend (Astro + React)

1. Navega a la carpeta del frontend:

   ```bash
   cd kumo-frontend
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura las variables de entorno:

   ```bash
   cp .env.example .env
   # El archivo .env ya contiene: PUBLIC_API_URL=http://localhost:8080/api
   ```

4. Ejecuta el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. La aplicación estará disponible en `http://localhost:4321`

## � Funcionalidades del Frontend

### ✅ Implementado

- **Autenticación**

  - Login con email y contraseña
  - Registro de nuevos usuarios
  - Cierre de sesión
  - Persistencia de sesión con JWT

- **Dashboard**

  - Estadísticas del día (hábitos cumplidos, porcentaje)
  - Lista de hábitos con marcado rápido
  - Accesos rápidos a secciones

- **Gestión de Hábitos**

  - CRUD completo (Crear, Leer, Actualizar, Eliminar)
  - Búsqueda y filtros
  - Archivar/Desarchivar
  - Asignación de metas diarias

- **Métricas y Progreso**

  - Estadísticas globales
  - Racha más larga
  - Días cumplidos
  - Valor acumulado
  - Promedio diario por hábito

- **Perfil de Usuario**
  - Visualización de información personal
  - Edición de nombre, email y contraseña
  - Eliminación de cuenta

### 🎨 Design System

El frontend incluye un design system completo con componentes reutilizables:

- **Button** - 5 variantes (primary, secondary, outline, ghost, danger)
- **Input** - Con validación y mensajes de error
- **Card** - Variantes elevated, outlined, default
- **Modal** - Responsivo con animaciones
- **Badge** - Para estados y categorías
- **Navbar** - Navegación responsiva

### 📱 Responsive Design

Todas las páginas están optimizadas para:

- 📱 Mobile (< 768px)
- 📱 Tablet (768px - 1023px)
- 💻 Desktop (1024px+)

## 📖 Documentación

### Frontend

- **[FRONTEND_README.md](kumo-frontend/README.md)** - Documentación técnica

### Backend

- **[endpoints.md](kumo-backend/src/main/resources/endpoints.md)** - Listado de endpoints
- Scripts SQL en `kumo-backend/src/main/resources/db/migration/`

## 📈 Estado del Proyecto

✅ **MVP Completo** - El proyecto cuenta con todas las funcionalidades principales implementadas:

- ✅ Autenticación y autorización con JWT
- ✅ CRUD de hábitos
- ✅ Seguimiento diario
- ✅ Métricas y rachas
- ✅ Frontend moderno y responsive
- ✅ Design system completo
- ✅ Integración frontend-backend

### 🚧 Mejoras Futuras

- 📅 Vista de calendario para registros
- 📊 Gráficos interactivos (Chart.js/Recharts)
- 🔔 Sistema de notificaciones push
- 📱 PWA (Progressive Web App)
- 🌙 Modo oscuro
- 🌍 Internacionalización (i18n)
- 📤 Exportación de datos a CSV/PDF
- 🧪 Tests unitarios y E2E

## 🎯 Flujo de Usuario

1. **Registro/Login** → Crear cuenta o iniciar sesión
2. **Dashboard** → Ver resumen diario de hábitos
3. **Crear Hábitos** → Definir nuevos hábitos con metas
4. **Seguimiento** → Marcar hábitos como completados cada día
5. **Métricas** → Analizar progreso, rachas y estadísticas
6. **Perfil** → Gestionar información personal

## 🔒 Seguridad

- ✅ Autenticación JWT con tokens seguros
- ✅ Contraseñas hasheadas con BCrypt
- ✅ Validación de datos en backend y frontend
- ✅ Protección CSRF
- ✅ CORS configurado
- ✅ Rutas protegidas en frontend

## 👨‍💻 Desarrollo

### Backend

```bash
cd kumo-backend
mvn spring-boot:run
```

### Frontend

```bash
cd kumo-frontend
npm run dev
```

### Base de Datos

Las migraciones de Flyway se ejecutan automáticamente al iniciar el backend.

## 📞 Contacto

**Estudiante:** Correa Torres, Joy Steven  
**Asesor:** Ing. Cristian Werner García Estrella  
**Universidad:** Universidad Nacional de San Martín  
**Facultad:** Ingeniería de Sistemas e Informática  
**Ubicación:** Tarapoto - Perú

---

## 📄 Licencia

Este es un proyecto académico desarrollado para la Universidad Nacional de San Martín.

---

**Construye mejores hábitos con Kumo ☁️**
