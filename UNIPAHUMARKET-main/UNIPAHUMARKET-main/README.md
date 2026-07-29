# 🛒 UNIMARKET - E-commerce Full Stack (Mercado Libre Clone)

UNIMARKET es una plataforma de comercio electrónico robusta inspirada en Mercado Libre, diseñada para conectar emprendimientos locales con compradores. Cuenta con un sistema de búsqueda optimizado, gestión de inventario y un proceso de compra completo.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React, Vite, CSS Vanilla.
- **Backend (Microservicios Híbridos):** Node.js, Express, TypeScript, Event-Driven Architecture.
- **Bases de Datos Híbridas:**
  - **MySQL 8.0:** Base de datos transaccional primaria (Usuarios, Productos, Pedidos, Categorías).
  - **MongoDB 7.0:** Base documental para Carrito de Compras, Notificaciones, Auditoría y Réplica Read-Optimized de alta disponibilidad.
- **Mensajería Event-Driven:** **RabbitMQ 3.12** (Topics, Outbox Pattern, Dead Letter Exchanges).
- **Caché y Sesiones:** **Redis 7** (Cache de productos, sesiones de carrito, rate limiting).
- **Orquestación e Infraestructura:** **Docker & Docker Compose**.

---

## 🚀 Despliegue con Docker Compose (Recomendado)

Inicia toda la infraestructura y microservicios con un solo comando:

```bash
docker-compose up -d --build
```

### Microservicios Incluidos:
- **API Gateway:** `http://localhost:8000`
- **Auth Service:** `http://localhost:3001`
- **User Service:** `http://localhost:3002`
- **Product Service:** `http://localhost:3003`
- **Order Service:** `http://localhost:3004`
- **Cart Service (MongoDB):** `http://localhost:3005`
- **Notification Service (MongoDB):** `http://localhost:3006`
- **Sync Service:** Outbox Worker & MongoDB Replica Sync.
- **Health Service:** `http://localhost:3007/health`
- **RabbitMQ Management Dashboard:** `http://localhost:15672` (User: `guest` / Pass: `guest`)

---

## 🚀 Guía de Instalación y Réplica Completa

Sigue estos pasos para tener el proyecto funcionando con **700 productos** de prueba en menos de 5 minutos.

### 1. Requisitos Previos

- **Python 3.10+**
- **Node.js 18+**
- **XAMPP** u otro servidor MySQL (con el módulo MySQL encendido en el puerto 3306).
- **Redis** (Opcional, pero recomendado).

### 2. Configuración de la Base de Datos

No necesitas crear la base de datos manualmente. El proyecto incluye un script inteligente que prepara todo por ti.

1. Abre una terminal en la carpeta raíz del proyecto.
2. Crea el entorno virtual (opcional pero recomendado):

   ```powershell
   python -m venv .venv
   .\.venv\Scripts\activate
   ```

3. Instala las dependencias del backend:

   ```powershell
   pip install -r backend/requirements.txt
   ```

4. **Ejecuta la réplica de la base de datos:**

   ```powershell
   python backend/setup_full_db.py
   ```

   *Este script creará la DB `unimarket`, las tablas, e insertará 14 categorías, 20 emprendimientos y **700 productos** reales (50 por categoría).*

### 3. Iniciar el Backend (API)

Con la terminal aún en la raíz y el entorno activado:

```powershell
uvicorn main:app --reload --app-dir ./backend
```

- API activa en: `http://127.0.0.1:8000`
- Documentación interactiva (Swagger): `http://127.0.0.1:8000/docs`

### 4. Iniciar el Frontend (Interfaz)

Abre una **nueva terminal** en la carpeta del proyecto:

1. Entra a la carpeta frontend:

   ```powershell
   cd frontend
   ```

2. Instala las dependencias:

   ```powershell
   npm install
   ```

3. Inicia la aplicación:

   ```powershell
   npm run dev
   ```

- Accede a la web en: `http://localhost:5173`

---

## 📦 Contenido de la Réplica

Al ejecutar `setup_full_db.py`, obtendrás:

- **Catálogo Completo:** 700+ productos (50 por cada categoría: Tecnología, Moda, Hogar, etc).
- **Tiendas Reales:** 20 emprendimientos con descripción y logos.
- **Usuarios de Prueba:**
  - **Vendedores:** `juan@tech.com`, `maria@moda.com` (Pass: `123456`)
  - **Compradores:** `andres@user.com`, `beatriz@user.com` (Pass: `123456`)
- **Historial:** Compras simuladas, reseñas y preguntas frecuentes.

---

## 📂 Estructura del Proyecto

- `/backend`: Lógica de servidor, modelos SQLAlchemy y rutas FastAPI.
- `/frontend`: Componentes React, gestión de estado y diseño UI.
- `setup_full_db.py`: Script de migración y seeding automático.
- `DOCUMENTACION.md`: Detalles técnicos profundos.

---

Desarrollado con ❤️ para impulsar el comercio digital.
