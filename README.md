# 🛒 SENAMARKET - Plataforma E-Commerce para Emprendimientos SENA

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/Database-MySQL%208.0-4479A1?style=flat-square&logo=mysql)](https://www.mysql.com/)
[![Redis](https://img.shields.io/badge/Cache-Redis%207.0-DC382D?style=flat-square&logo=redis)](https://redis.io/)
[![NodeJS](https://img.shields.io/badge/Microservices-Node.js%20%2B%20TS-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![RabbitMQ](https://img.shields.io/badge/Broker-RabbitMQ-FF6600?style=flat-square&logo=rabbitmq)](https://www.rabbitmq.com/)

**SenaMarket** es un ecosistema tecnológico integral de comercio electrónico diseñado para impulsar, visibilizar y comercializar productos y servicios creados por emprendedores y aprendices del SENA.

Ofrece una experiencia de usuario de alto nivel inspirada en los estándares de los principales marketplaces de la industria, combinando un **Backend monolítico modular y transaccional en Python (FastAPI)** con una **Arquitectura distribuida de Microservicios (Node.js/TypeScript)** y un **Frontend reactivo de alta velocidad (React 18 + Vite)**.

---

## 📐 Documentación Técnica y Diagramas UML

Para consultar el diseño de software detallado y los patrones de arquitectura, revisa los documentos en la carpeta `docs/`:

- 👉 **[Documentación Completa con Diagramas UML (docs/UML_DIAGRAMS.md)](docs/UML_DIAGRAMS.md)**
- 👉 **[Esquema DDL de Base de Datos MySQL (docs/schema.sql)](docs/schema.sql)**

### Diagramas UML Incluidos (Sintaxis Mermaid):
1. **Diagrama de Casos de Uso**: Actores (*Comprador, Vendedor, Administrador, Notificador*) y flujos principales.
2. **Diagrama de Clases del Dominio**: Entidades `Usuario`, `Emprendimiento`, `Producto`, `Categoria`, `Orden`, `ItemOrden`, `Resena`, `Pregunta`.
3. **Diagrama Entidad-Relación (ER)**: Modelo relacional completo en MySQL.
4. **Diagrama de Secuencia - Checkout Transaccional**: Validación de stock, débito atómico, creación de orden e invalidación de caché.
5. **Diagrama de Secuencia - Autenticación JWT y Roles**: Flujo seguro con bcrypt y listas de acceso.
6. **Diagrama de Componentes**: Desacoplamiento entre UI, API Gateway, Backend FastAPI, Redis y MySQL.
7. **Diagrama de Despliegue de Infraestructura**: Topología de servidores, proxy, servicios y almacenamiento.
8. **Diagrama de Máquina de Estados**: Ciclo de vida de una compra (*PENDIENTE ➔ PAGADO ➔ ENVIADO ➔ ENTREGADO / CANCELADO*).
9. **Diagrama de Actividades**: Flujo de publicación y administración de catálogo por el vendedor.

---

## 🛠️ Stack Tecnológico

### **Frontend (Cliente Web)**
- **Framework**: React 18 + Vite
- **Lenguaje**: JavaScript moderno (ES6+) / JSX
- **Navegación**: React Router DOM v6
- **Componentes Clave**:
  - `Navbar`: Cabecera oficial de doble fila con paleta `#FFE600`, selector de ubicación, banner `meli+` y menú contextual.
  - `OfferTabs`: Pestañas horizontales de ofertas con iconos (*Todas las ofertas, Ofertas relámpago, Precios Imbatibles, Celulares, Notebooks, Liquidación*).
  - `SidebarFilters`: Menú lateral interactivo con categorías reales desde BD, switch `FULL`, tiempos de entrega y selector de precios.
  - `ProductCard`: Tarjetas de producto en cuadrícula de 3 columnas con badges (*MÁS VENDIDO / OFERTA DEL DÍA*), rating con estrellas, cuotas con 0% interés, cupones y entrega garantizada.
  - `ToastContext` & `CartContext`: Estado global reactivo para notificaciones flotantes y carrito sincronizado.
  - `SkeletonLoader` & `ImageWithFallback`: Carga progresiva y tolerancia a fallos en imágenes externas.

### **Backend Core (FastAPI)**
- **Framework**: Python 3.11+ / 3.12 + FastAPI
- **Servidor ASGI**: Uvicorn
- **ORM / BD**: SQLAlchemy 2.0 + PyMySQL
- **Validación y DTOs**: Pydantic v2
- **Seguridad**: JWT (HS256) + Passlib (bcrypt) + Control estricto de roles (*COMPRADOR, VENDEDOR, ADMINISTRADOR*)
- **Caché y Rendimiento**: Redis 7.0 con patrón fallback transparente e invalidación por patrones (`delete_pattern`)
- **Transaccionalidad**: Manejo atómico con `try...except` y `db.rollback()` en operaciones de compra.

### **Microservicios Complementarios (Node.js / TypeScript)**
- **Runtime**: Node.js v18+
- **Patrones**: API Gateway, Circuit Breaker (Opossum), Event-Driven Architecture (RabbitMQ).

---

## 📁 Estructura del Proyecto

```text
proyectosena/
 ├── backend/                   # Core API en Python FastAPI
 │    ├── config.py             # Configuración centralizada y orígenes CORS
 │    ├── database.py           # Conexión y sesión de base de datos MySQL
 │    ├── models.py             # Modelos relacionales SQLAlchemy
 │    ├── schemas.py            # Esquemas Pydantic para validación y serialización
 │    ├── auth.py               # Funciones de autenticación, hash y tokens JWT
 │    ├── redis_client.py       # Gestor de caché Redis con invalidación automática
 │    ├── routers/              # Enrutadores modulares por dominio
 │    │    ├── auth.py          # Registro, login y tokens
 │    │    ├── users.py         # Gestión de usuarios, perfiles y seguridad
 │    │    ├── public.py        # Catálogo público y categorías con conteos dinámicos
 │    │    ├── vendor.py        # Panel de control de vendedores y productos
 │    │    ├── orders.py        # Carrito, checkout atómico y pedidos
 │    │    ├── questions.py     # Preguntas y respuestas sobre productos
 │    │    ├── addresses.py     # Libreta de direcciones de envío
 │    │    └── cards.py         # Tarjetas y métodos de pago guardados
 │    └── main.py               # Servidor FastAPI, middleware CORS y routers
 │
 ├── frontend/                  # Aplicación Web React + Vite
 │    ├── public/               # Recursos estáticos y logo.svg oficial de SenaMarket
 │    ├── src/
 │    │    ├── components/      # Navbar, OfferTabs, SidebarFilters, ProductCard, Toasts, Skeletons
 │    │    ├── context/         # AuthContext, CartContext, ToastContext
 │    │    ├── pages/           # Home, SearchResults, ProductDetail, Cart, Checkout, etc.
 │    │    ├── utils/           # apiFetch unificado, formateador de moneda
 │    │    ├── App.jsx          # Enrutador principal y proveedores globales
 │    │    └── main.jsx         # Punto de entrada de React
 │    ├── package.json
 │    └── vite.config.js
 │
 ├── docs/                      # Documentación del sistema
 │    ├── UML_DIAGRAMS.md       # 9 Diagramas UML en sintaxis Mermaid
 │    └── schema.sql            # Definición DDL de base de datos MySQL
 └── services/                  # Microservicios complementarios (Node.js / TS)
```

---

## 🚀 Guía de Instalación y Ejecución

### Prerrequisitos
- **Python 3.11+**
- **Node.js 18+** y **npm**
- **MySQL Server 8.0+**
- **Redis Server** (Opcional, el backend opera con fallback tolerante)

---

### 1. Configuración del Backend

```bash
cd backend

# 1. Crear y activar entorno virtual
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 2. Instalar dependencias
pip install -r requirements.txt

# 3. Iniciar el servidor FastAPI
python main.py
```
> La API estará disponible en `http://127.0.0.1:8000` con documentación interactiva Swagger en `http://127.0.0.1:8000/docs`.

---

### 2. Configuración del Frontend

```bash
cd frontend

# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo Vite
npm run dev
```
> El cliente web estará disponible en `http://localhost:5173`.

---

## 🔒 Roles y Seguridad

| Rol | Permisos |
| :--- | :--- |
| **COMPRADOR** | Explorar catálogo, filtrar por categorías y precios, gestionar carrito, realizar checkout, gestionar direcciones/tarjetas y calificar productos. |
| **VENDEDOR** | Todas las funciones de comprador + registrar emprendimiento, crear/editar productos, gestionar stock, responder preguntas y actualizar estado de pedidos. |
| **ADMINISTRADOR** | Control global de categorías, supervisión de usuarios y métricas del sistema. |

---

## 📄 Licencia

Este proyecto ha sido desarrollado como plataforma de comercio electrónico para aprendices y emprendedores del **SENA**.
