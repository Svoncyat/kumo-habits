# ☁️ Kumo - Aplicación de Seguimiento de Hábitos

Kumo es una aplicación web full-stack diseñada para ayudar a los usuarios a construir, rastrear y analizar sus hábitos personales. El propósito central es apoyar la constancia y ofrecer información clara para la toma de decisiones individuales sobre rutinas y metas.

Este proyecto ha sido desarrollado como parte del curso **Lenguaje de Programación III**  en la **Universidad Nacional de San Martín (UNSM)**.

## ✨ Características Principales

El alcance del proyecto se centra en un **Producto Mínimo Viable (MVP)** robusto con las siguientes funcionalidades:

* **Autenticación y Usuarios:** Registro de cuenta , inicio de sesión , y recuperación de contraseña6.
* **Gestión de Perfil:** Edición de nombre, cambio de correo y preferencias de usuario como **zona horaria** y **formato de fecha**.
* **Gestión de Hábitos (CRUD):** Creación, edición, archivado y eliminación de hábitos.
* **Seguimiento Diario:** Registro de cumplimiento diario por hábito con control de unicidad por día.
* **Métricas y Rachas:** Cálculo de rachas (días consecutivos) y la racha más larga.
* **Reportes:** Visualización de progreso y reportes con filtros y exportación a CSV.
* **Metas:** Definición de metas mensuales por hábito.
* **Portabilidad y Privacidad:** Exportación completa de datos del usuario y eliminación permanente de la cuenta.

## 🛠️ Stack Tecnológico

Este proyecto utiliza un stack moderno separando el frontend y el backend:

* **Backend:** **Java 17+** con **Spring Boot** (Spring Web, Spring Security, Spring Data JPA).
* **Frontend:** **React** con **TypeScript** (iniciado con Vite + SWC).
* **Base de Datos:** **PostgreSQL**.

## 🏗️ Arquitectura y Diseño de Base de Datos

El backend sigue una arquitectura modular y limpia, aplicando principios **SOLID** como el Principio de Responsabilidad Única (SRP) para separar la lógica de negocio en 5 dominios claros:

1.  **Gestión de Cuentas:** Identidad, seguridad y perfiles.
2.  **Gestión de Hábitos:** Definición y organización de hábitos.
3.  **Registros y Cumplimiento:** Tracking diario.
4.  **Análisis y Métricas:** Cálculo de rachas y metas.
5.  **Notificaciones:** Gestión de recordatorios.

El diseño de la base de datos (PostgreSQL) está normalizado y consta de **18 tablas** y **4 ENUMs** para garantizar la integridad de los datos, soportar auditorías de cambios y permitir la escalabilidad futura.

## 🚀 Cómo Empezar

Sigue estos pasos para levantar el entorno de desarrollo local.

### Prerrequisitos

* Java JDK 17 o superior
* Maven 4.0.0+ o Gradle
* Node.js 18+
* Un servidor PostgreSQL en ejecución

### 1. Base de Datos

1.  Crea una base de datos en PostgreSQL (ej. `kumo_db`).
2.  Ejecuta los scripts SQL (ubicados en `backend/src/main/resources/db/migration` o similar) para crear todas las tablas, ENUMs y relaciones.

### 2. Backend (Spring Boot)

1.  Navega a la carpeta del backend: `cd kumo-backend`
2.  Configura tus credenciales de base de datos en `src/main/resources/application.properties`.
3.  Ejecuta la aplicación:
    ```bash
    mvn spring-boot:run
    ```
4.  El backend estará corriendo en `http://localhost:8080`.

### 3. Frontend (React)

1.  Navega a la carpeta del frontend: `cd kumo-frontend`
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Ejecuta el servidor de desarrollo de Vite:
    ```bash
    npm run dev
    ```
4.  La aplicación estará disponible en `http://localhost:5173`.

## 📈 Estado del Proyecto

Actualmente, el proyecto se encuentra **en desarrollo**, implementando el MVP definido en la Especificación de Requisitos de Software.

---

## Autor

* **Estudiante:** Correa Torres, Joy Steven

### Asesor

* Ing. Cristian Werner García Estrella

**Universidad Nacional de San Martín** 
Facultad de Ingeniería de Sistemas e Informática 
Tarapoto - Perú