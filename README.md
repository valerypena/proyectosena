# 🛒 UNIMARKET - Plataforma E-Commerce para Emprendimientos SENA / Universitarios

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![NodeJS](https://img.shields.io/badge/Microservices-Node.js%20%2B%20TS-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?style=flat-square&logo=mysql)](https://www.mysql.com/)
[![Redis](https://img.shields.io/badge/Cache-Redis-DC382D?style=flat-square&logo=redis)](https://redis.io/)
[![RabbitMQ](https://img.shields.io/badge/Broker-RabbitMQ-FF6600?style=flat-square&logo=rabbitmq)](https://www.rabbitmq.com/)

**UNIMARKET** es un ecosistema tecnológico integral de comercio electrónico diseñado para impulsar, visibilizar y comercializar productos y servicios creados por emprendedores de la comunidad universitaria y aprendices SENA. 

Combina un **Monolito robusto en Python (FastAPI)** con una **Arquitectura distribuida de Microservicios (Node.js/TypeScript)**, proporcionando alta disponibilidad, escalabilidad horizontal, procesamiento asincrónico de eventos y una experiencia de usuario moderna y fluida.

---

## 📐 Documentación Técnica y Diagramas UML

Para consultar el diseño de software detallado y los patrones de arquitectura, revisa el documento especializado:

👉 **[Documentación Completa con Diagramas UML (docs/UML_DIAGRAMS.md)](docs/UML_DIAGRAMS.md)**

### Diagramas UML Incluidos:
1. **Diagrama de Casos de Uso** (*Use Case Diagram*)
2. **Diagrama de Clases del Dominio** (*Class Diagram*)
3. **Diagrama Entidad-Relación** (*ER Diagram / Modelo MySQL*)
4. **Diagrama de Secuencia: Checkout y Procesamiento de Orden** (*Sequence Diagram*)
5. **Diagrama de Secuencia: Autenticación JWT y Redis Session Store** (*Sequence Diagram*)
6. **Diagrama de Componentes del Sistema** (*Component Diagram*)
7. **Diagrama de Despliegue e Infraestructura** (*Deployment Diagram*)
8. **Diagrama de Máquina de Estados: Ciclo de Vida de una Compra** (*State Machine Diagram*)
9. **Diagrama de Actividades: Gestión de Productos por Vendedor** (*Activity Diagram*)

---

## 🛠️ Stack Tecnológico

### **Frontend**
- **Framework**: React 18 + Vite
- **Lenguaje**: JavaScript / TypeScript
- **Estilos**: Tailwind CSS, CSS Modules
- **Iconografía**: Lucide React
- **Peticiones HTTP**: Axios / Fetch API

### **Backend Core (Monolito FastAPI)**
- **Framework**: Python 3.11 + FastAPI
- **ORM / BD**: SQLAlchemy + MySQL Connector
- **Validación**: Pydantic v2
- **Seguridad**: JWT (JSON Web Tokens) + Passlib (bcrypt)
- **Generación de Reportes**: ReportLab (Generación dinámica de PDF)

### **Microservicios (Node.js / TypeScript)**
- **Runtime**: Node.js v18+
- **API Gateway**: Express HTTP Proxy / Gateway Pattern
- **Librería Compartida**: `@unimarket/shared` (Drivens, Types & Utils)
- **Patrones de Resiliencia**: Opossum (Circuit Breaker Pattern)

### **Infraestructura y Persistencia**
- **Base de Datos Relacional**: MySQL 8.0 (Catálogo, Usuarios, Compras, Reseñas)
- **Base de Datos NoSQL**: MongoDB 6.0 (Servicios analíticos / registros)
- **Caché In-Memory**: Redis 7.0 (Manejador de sesiones, listas blancas/negras JWT y Rate Limiting)
- **Broker de Mensajería**: RabbitMQ (Event-Driven Architecture)

---

## 📁 Estructura del Proyecto

```text
proyectosena/
 ├── backend/                   # Core API en Python FastAPI
 │    ├── routers/              # Endpoints (users, vendors, orders, products, etc.)
 │    ├── models.py             # Modelos SQLAlchemy
 │    ├── schemas.py            # Esquemas Pydantic
 │    ├── database.py           # Conexión MySQL
 │    ├── redis_client.py       # Conexión y cliente Redis
 │    ├── auth.py               # Generación y validación JWT
 │    ├── generate_*_pdf.py     # Módulos de generación de documentación PDF
 │    └── main.py               # Punto de entrada de la aplicación FastAPI
 │
 ├── frontend/                  # Aplicación Web React + Vite
 │    ├── src/                  # Componentes, vistas, hooks y estilos
 │    ├── package.json
 │    └── vite.config.js
 │
 ├── services/                  # Microservicios en Node.js / TypeScript
 │    ├── api-gateway/          # Puerta de entrada y proxy inverso
 │    ├── auth-service/         # Servicio dedicado de autenticación
 │    ├── cart-service/         # Servicio de gestión de carrito de compras
 │    ├── health-service/       # Servicio de monitoreo de salud del sistema
 │    ├── notification-service/ # Consumidor de eventos y envío de notificaciones
 │    ├── order-service/        # Servicio de gestión de órdenes de compra
 │    ├── product-service/      # Servicio de productos y catálogo
 │    ├── sync-service/         # Servicio de sincronización de datos
 │    └── user-service/         # Servicio de gestión de perfiles de usuario
 │
 ├── shared/                    # Paquete TypeScript compartido (@unimarket/shared)
 ├── docs/                      # Documentación del sistema
 │    ├── schema.sql            # Esquemas y tablas DDL para MySQL
 │    └── UML_DIAGRAMS.md       # Documentación de 9 diagramas UML (Mermaid)
 └── package.json               # Configuración Workspace/Shared Node.js
```

---

## 🚀 Guía de Instalación y Ejecución

### **1. Requisitos Previos**
Asegúrate de tener instalados las siguientes herramientas en tu entorno:
- [Node.js](https://nodejs.org/) (v18 o superior) y `npm`
- [Python](https://www.python.org/) (v3.10 o superior) y `pip`
- [MySQL Server](https://www.mysql.com/) (v8.0)
- [Redis Server](https://redis.io/)
- [RabbitMQ](https://www.rabbitmq.com/) *(opcional para ejecución distribuida)*

---

### **2. Configuración de la Base de Datos**
Crea la base de datos MySQL e importa la estructura definida en `docs/schema.sql`:

```bash
# Iniciar sesión en MySQL
mysql -u root -p

# Crear base de datos
CREATE DATABASE unimarket CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE unimarket;

# Importar esquema DDL
SOURCE docs/schema.sql;
```

---

### **3. Ejecución del Backend (FastAPI)**

1. Entra a la carpeta backend e instala dependencias:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. Configura las variables de entorno creando un archivo `.env` basado en `.env.example`:
   ```ini
   DATABASE_URL=mysql+pymysql://root:password@localhost:3306/unimarket
   REDIS_HOST=localhost
   REDIS_PORT=6379
   SECRET_KEY=tu_clave_secreta_jwt
   ```

3. Inicia el servidor de desarrollo Uvicorn:
   ```bash
   python main.py
   ```
   *La API estará disponible en `http://localhost:8000` (Documentación Swagger interactiva en `http://localhost:8000/docs`).*

---

### **4. Ejecución del Frontend (React)**

1. Navega a la carpeta del frontend:
   ```bash
   cd frontend
   npm install
   ```

2. Ejecuta el servidor de desarrollo de Vite:
   ```bash
   npm run dev
   ```
   *El frontend estará disponible en `http://localhost:5173`.*

---

### **5. Ejecución del Paquete Compartido y Microservicios**

1. Compila la librería `@unimarket/shared`:
   ```bash
   cd shared
   npm install
   npm run build
   ```

2. Inicia los microservicios deseados dentro de `services/`:
   ```bash
   cd services/api-gateway
   npm install
   npm run dev
   ```

---

## 📊 Roles y Permisos en UNIMARKET

| Rol | Permisos y Funcionalidades |
|---|---|
| 🛒 **Comprador** | Explorar catálogo, filtrar por categoría, agregar items al carrito, procesar órdenes de compra, visualizar historial de pedidos y calificar/reseñar productos. |
| 💼 **Vendedor** | Registrar marca/emprendimiento, publicar productos, gestionar stock e imágenes, editar catálogo y consultar pedidos recibidos. |
| 🛡️ **Administrador** | Crear y editar categorías globales, supervisar marcas registradas, gestionar roles de usuarios y auditar la plataforma. |

---

## 📝 Licencia y Créditos

Proyecto desarrollado como parte del programa de formación SENA / UNIMARKET. 
Todos los derechos reservados.
