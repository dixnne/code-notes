# CodeNotes: Aplicación de Notas para Tesina

**Autor:** [Tu Nombre Completo]
**Institución:** Universidad Autónoma de Aguascalientes
**Carrera:** [Tu Carrera]
**Materia:** [Materia o Proyecto de Tesina]
**Profesor:** [Nombre del Profesor]

---

## 📜 Descripción General

**CodeNotes** es una aplicación web de toma de notas diseñada como parte de mi proyecto de tesina. La plataforma permite a los usuarios registrarse, iniciar sesión y gestionar sus notas personales de forma segura. Cada nota está asociada a la cuenta del usuario, garantizando que solo él pueda acceder a su información.

El proyecto está construido con una arquitectura de microservicios, utilizando tecnologías modernas para el desarrollo backend y frontend, y está completamente dockerizado para facilitar su despliegue y escalabilidad.

---

## 🚀 Tecnologías Utilizadas

Este proyecto utiliza una variedad de herramientas y tecnologías de vanguardia para ofrecer una experiencia de usuario robusta y moderna.

### **Backend**
- **Framework**: **NestJS** (v10.0) - Un framework progresivo de Node.js para construir aplicaciones eficientes y escalables.
- **Lenguaje**: **TypeScript** - Añade tipado estático a JavaScript para mejorar la robustez del código.
- **Base de Datos**: **PostgreSQL** (v15) - Un sistema de gestión de bases de datos relacional de código abierto y de alto rendimiento.
- **ORM**: **Prisma** (v5.17) - Un ORM de última generación para Node.js y TypeScript que facilita la interacción con la base de datos.
- **Autenticación**: **JWT (JSON Web Tokens)** y **Passport.js** - Para proteger las rutas y gestionar las sesiones de usuario de forma segura.
- **Validación**: `class-validator` y `class-transformer` para validar y transformar los datos de entrada.

### **Frontend**
- **Librería**: **React** (v18.3) - Una librería de JavaScript para construir interfaces de usuario interactivas.
- **Framework de UI**: **Tailwind CSS** - Un framework de CSS "utility-first" para un diseño rápido y personalizado.
- **Enrutamiento**: **React Router DOM** - Para gestionar la navegación y las rutas del lado del cliente.
- **Cliente HTTP**: **Axios** - Para realizar peticiones a la API del backend.
- **Herramientas de Desarrollo**: **Vite** - Un entorno de desarrollo local ultrarrápido para proyectos de JavaScript.

### **Despliegue y Arquitectura**
- **Contenerización**: **Docker** y **Docker Compose** - Para crear, gestionar y orquestar los contenedores de la aplicación.
- **Servidor Web/Reverse Proxy**: **Nginx** - Gestiona las peticiones entrantes y las redirige al servicio correspondiente (backend o frontend).

---

## 📁 Estructura del Proyecto

El repositorio está organizado en varios directorios clave, cada uno con una responsabilidad específica:

```
.
├── 🐳 backend/         # Contiene el código fuente de la API con NestJS
│   ├── src/
│   ├── Dockerfile
│   └── package.json
│
├── ⚛️ frontend/        # Contiene el código fuente de la aplicación con React
│   ├── src/
│   ├── Dockerfile
│   └── package.json
│
├── 🌐 nginx/            # Archivos de configuración para el reverse proxy Nginx
│   └── nginx.conf
│
├── 🐋 docker-compose.yml # Orquesta los servicios para producción
└── 🐋 docker-compose.dev.yml # Orquesta los servicios para desarrollo
```

---

## ⚙️ Cómo Empezar (Getting Started)

Sigue estos pasos para levantar el proyecto en tu entorno local.

### **Prerrequisitos**
- **Docker** y **Docker Compose** instalados en tu sistema.
- Un editor de código como **Visual Studio Code**.
- **Git** para clonar el repositorio.

### **Instalación y Configuración**

1. **Clona el repositorio:**
   ```bash
   git clone [URL-del-repositorio]
   cd [nombre-del-directorio]
   ```

2. **Crea el archivo de variables de entorno:**
   Crea un archivo llamado `.env` en la raíz del proyecto y añade las siguientes variables. Asegúrate de reemplazar los valores con tus propias credenciales seguras.

   ```env
   # Configuración de la Base de Datos
   DB_USER=myuser
   DB_PASSWORD=mypassword
   DB_NAME=codenotes_db
   DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}"

   # Clave secreta para JWT (puedes generar una con `openssl rand -hex 32`)
   JWT_SECRET=tu_super_secreto_para_jwt
   ```

3. **Levanta los contenedores con Docker Compose:**
   Para un entorno de desarrollo con "hot-reloading" (recarga en caliente):
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```
   Para un entorno de producción:
   ```bash
   docker-compose up --build -d
   ```

4. **Accede a la aplicación:**
   - El **frontend** estará disponible en `http://localhost:5173` (en modo desarrollo) o `http://localhost` (en producción).
   - El **backend** estará escuchando en `http://localhost:3000`.

---

## ✨ Funcionalidades Principales

- **Autenticación de Usuarios**:
  - ✅ Registro de nuevas cuentas.
  - ✅ Inicio de sesión seguro con JWT.
  - ✅ Rutas protegidas que solo usuarios autenticados pueden acceder.

- **Gestión de Notas**:
  - 📝 Crear nuevas notas con título y contenido.
  - ✏️ Editar notas existentes.
  - 🗑️ Eliminar notas.
  - 📖 Visualizar todas las notas asociadas a tu cuenta.

---

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Consulta el archivo `LICENSE` para más detalles.

---

Hecho con ❤️ por [Tu Nombre] para la Universidad Autónoma de Aguascalientes.