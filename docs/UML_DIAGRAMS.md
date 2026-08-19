# Documentación de Arquitectura y Diagramas UML - SENAMARKET

Este documento especifica el diseño de software y la arquitectura del sistema **SenaMarket** (Plataforma E-Commerce para Emprendimientos del SENA) mediante **9 diagramas UML estándar**, expresados en sintaxis nativa de **Mermaid**.

---

## Índice de Diagramas UML

1. [Diagrama de Casos de Uso (Use Case Diagram)](#1-diagrama-de-casos-de-uso)
2. [Diagrama de Clases del Dominio (Class Diagram)](#2-diagrama-de-clases-del-dominio)
3. [Diagrama Entidad-Relación (ER Diagram / Modelo MySQL)](#3-diagrama-entidad-relación)
4. [Diagrama de Secuencia: Checkout y Procesamiento Atómico de Compra](#4-diagrama-de-secuencia-checkout-y-procesamiento-atómico-de-compra)
5. [Diagrama de Secuencia: Autenticación, JWT y Control de Roles](#5-diagrama-de-secuencia-autenticación-jwt-y-control-de-roles)
6. [Diagrama de Componentes del Sistema (Component Diagram)](#6-diagrama-de-componentes-del-sistema)
7. [Diagrama de Despliegue de Infraestructura (Deployment Diagram)](#7-diagrama-de-despliegue-de-infraestructura)
8. [Diagrama de Máquina de Estados: Ciclo de Vida de una Orden](#8-diagrama-de-máquina-de-estados-ciclo-de-vida-de-una-orden)
9. [Diagrama de Actividades: Publicación y Gestión de Catálogo por Vendedor](#9-diagrama-de-actividades-publicación-y-gestión-de-catálogo-por-vendedor)

---

## 1. Diagrama de Casos de Uso

Muestra las interacciones clave entre los actores del sistema (**Comprador**, **Vendedor**, **Administrador** y **Servicio de Notificaciones**) y los módulos funcionales de SenaMarket.

```mermaid
graph TD
    %% Actores
    Comprador((":bust_in_silhouette: Comprador"))
    Vendedor((":briefcase: Vendedor"))
    Admin((":shield: Administrador"))
    NotifSys((":bell: Sistema Notificaciones"))

    subgraph SENAMARKET ["Plataforma SenaMarket"]
        UC1["Registrarse / Iniciar Sesión"]
        UC2["Explorar Catálogo con Filtros y Categorías"]
        UC3["Gestionar Carrito Reactivo"]
        UC4["Realizar Checkout Atómico y Pago"]
        UC5["Hacer Pregunta / Dejar Calificación"]

        UC6["Registrar Emprendimiento SENA"]
        UC7["Gestionar Catálogo de Productos (CRUD)"]
        UC8["Visualizar y Despachar Pedidos"]
        UC9["Responder Preguntas de Compradores"]

        UC10["Gestionar Categorías y Conteos"]
        UC11["Supervisión de Usuarios y Roles"]
        UC12["Enviar Notificación de Pedido"]
    end

    %% Relaciones Comprador
    Comprador --> UC1
    Comprador --> UC2
    Comprador --> UC3
    Comprador --> UC4
    Comprador --> UC5

    %% Relaciones Vendedor
    Vendedor --> UC1
    Vendedor --> UC6
    Vendedor --> UC7
    Vendedor --> UC8
    Vendedor --> UC9

    %% Relaciones Administrador
    Admin --> UC1
    Admin --> UC10
    Admin --> UC11

    %% Includes & Extends
    UC4 ..> UC12 : <<include>>
    UC12 --> NotifSys
```

---

## 2. Diagrama de Clases del Dominio

Modela la estructura del backend de SenaMarket, sus atributos tipados, métodos y relaciones entre entidades del dominio.

```mermaid
classDiagram
    class Usuario {
        +int id
        +string nombreCompleto
        +string email
        +string contrasenaHash
        +RolEnum rol
        +string telefono
        +DateTime creadoEn
        +registrar()
        +autenticar()
        +actualizarPerfil()
    }

    class RolEnum {
        <<enumeration>>
        COMPRADOR
        VENDEDOR
        ADMINISTRADOR
    }

    class Emprendimiento {
        +int id
        +int usuarioId
        +string nombre
        +string descripcion
        +string contacto
        +string redSocial
        +DateTime creadoEn
    }

    class Categoria {
        +int id
        +string nombre
        +string descripcion
        +int cantidadProductos
    }

    class Producto {
        +int id
        +int emprendimientoId
        +int categoriaId
        +string nombre
        +string descripcion
        +float precio
        +int stock
        +string urlImagen
        +DateTime creadoEn
        +actualizarStock(int cantidad)
    }

    class Orden {
        +int id
        +int usuarioId
        +float total
        +EstadoOrdenEnum estado
        +string direccionEnvio
        +string metodoPago
        +DateTime creadoEn
        +procesarPago()
        +actualizarEstado(EstadoOrdenEnum nuevoEstado)
    }

    class EstadoOrdenEnum {
        <<enumeration>>
        PENDIENTE
        PAGADO
        ENVIADO
        ENTREGADO
        CANCELADO
    }

    class ItemOrden {
        +int id
        +int ordenId
        +int productoId
        +int cantidad
        +float precioUnitario
    }

    class Resena {
        +int id
        +int usuarioId
        +int productoId
        +int calificacion
        +string comentario
        +DateTime creadoEn
    }

    class Pregunta {
        +int id
        +int usuarioId
        +int productoId
        +string textoPregunta
        +string textoRespuesta
        +DateTime creadoEn
    }

    %% Relaciones
    Usuario "1" --> "1" RolEnum : tiene
    Usuario "1" --> "0..1" Emprendimiento : lidera
    Usuario "1" --> "0..*" Orden : realiza
    Usuario "1" --> "0..*" Resena : publica
    Usuario "1" --> "0..*" Pregunta : formula
    
    Emprendimiento "1" --> "0..*" Producto : ofrece
    Categoria "1" --> "0..*" Producto : agrupa
    
    Orden "1" *-- "1..*" ItemOrden : contiene
    Orden "1" --> "1" EstadoOrdenEnum : posee
    Producto "1" <-- "0..*" ItemOrden : referencia
    Producto "1" <-- "0..*" Resena : recibe
    Producto "1" <-- "0..*" Pregunta : tiene
```

---

## 3. Diagrama Entidad-Relación

Esquema físico relacional implementado en MySQL 8.0.

```mermaid
erDiagram
    USUARIOS ||--o| EMPRENDIMIENTOS : "posee (1:1)"
    USUARIOS ||--o{ ORDENES : "realiza (1:N)"
    USUARIOS ||--o{ RESENAS : "escribe (1:N)"
    USUARIOS ||--o{ PREGUNTAS : "pregunta (1:N)"
    USUARIOS ||--o{ DIRECCIONES : "guarda (1:N)"
    USUARIOS ||--o{ TARJETAS : "registra (1:N)"
    
    EMPRENDIMIENTOS ||--o{ PRODUCTOS : "publica (1:N)"
    CATEGORIAS ||--o{ PRODUCTOS : "clasifica (1:N)"
    
    PRODUCTOS ||--o{ ITEMS_ORDEN : "incluido_en (1:N)"
    PRODUCTOS ||--o{ RESENAS : "calificado_en (1:N)"
    PRODUCTOS ||--o{ PREGUNTAS : "consultado_en (1:N)"
    
    ORDENES ||--|{ ITEMS_ORDEN : "contiene (1:N)"

    USUARIOS {
        int id PK
        string nombre_completo
        string email UK
        string contrasena_hash
        string rol "COMPRADOR | VENDEDOR | ADMINISTRADOR"
        string telefono
        datetime creado_en
    }

    EMPRENDIMIENTOS {
        int id PK
        int usuario_id FK, UK
        string nombre
        text descripcion
        string contacto
        string red_social
        datetime creado_en
    }

    CATEGORIAS {
        int id PK
        string nombre UK
        string descripcion
    }

    PRODUCTOS {
        int id PK
        int emprendimiento_id FK
        int categoria_id FK
        string nombre
        text descripcion
        decimal precio
        int stock
        string url_imagen
        datetime creado_en
    }

    ORDENES {
        int id PK
        int usuario_id FK
        decimal total
        string estado "PENDIENTE | PAGADO | ENVIADO | ENTREGADO | CANCELADO"
        string direccion_envio
        string metodo_pago
        datetime creado_en
    }

    ITEMS_ORDEN {
        int id PK
        int orden_id FK
        int producto_id FK
        int cantidad
        decimal precio_unitario
    }

    RESENAS {
        int id PK
        int usuario_id FK
        int producto_id FK
        int calificacion
        text comentario
        datetime creado_en
    }

    PREGUNTAS {
        int id PK
        int usuario_id FK
        int producto_id FK
        text texto_pregunta
        text texto_respuesta
        datetime creado_en
    }
```

---

## 4. Diagrama de Secuencia: Checkout y Procesamiento Atómico de Compra

Representa la verificación de stock, débito atómico con rollback ante fallos, creación de la orden e invalidación de caché.

```mermaid
sequenceDiagram
    autonumber
    actor Cliente as Comprador (React UI)
    participant API as Backend FastAPI (/compras/checkout)
    participant Auth as Validador JWT
    participant DB as MySQL DB
    participant Cache as Redis Cache

    Cliente->>API: POST /compras/checkout (items, direccion, metodo_pago) + Bearer JWT
    API->>Auth: Validar Token JWT
    Auth-->>API: Usuario autenticado (id, rol)
    
    API->>DB: Iniciar Transacción (BEGIN)
    
    loop Por cada producto en el carrito
        API->>DB: SELECT stock, precio FROM productos WHERE id = ? FOR UPDATE
        alt Stock insuficiente
            DB-->>API: Stock < cantidad solicitada
            API->>DB: ROLLBACK
            API-->>Cliente: HTTP 400 Bad Request ("Stock insuficiente para el producto X")
        else Stock disponible
            API->>DB: UPDATE productos SET stock = stock - cantidad WHERE id = ?
        end
    end

    API->>DB: INSERT INTO ordenes (usuario_id, total, estado, ...)
    API->>DB: INSERT INTO items_orden (orden_id, producto_id, cantidad, precio)
    API->>DB: COMMIT Transacción

    API->>Cache: Invalidate Cache: productos:* y categorias:*
    Cache-->>API: Claves invalidadas OK

    API-->>Cliente: HTTP 200 OK (orden_id, estado: "PAGADO", total)
```

---

## 5. Diagrama de Secuencia: Autenticación, JWT y Control de Roles

Detalla el inicio de sesión, validación criptográfica de contraseñas y asignación del token de acceso con verificación de roles.

```mermaid
sequenceDiagram
    autonumber
    actor Usuario as Cliente Web
    participant AuthRouter as FastAPI /auth/token
    participant Crypt as Passlib (bcrypt)
    participant DB as MySQL Database
    participant JWT as JWT Engine (HS256)

    Usuario->>AuthRouter: POST /auth/token (username=email, password)
    AuthRouter->>DB: SELECT * FROM usuarios WHERE email = ?
    
    alt Usuario no encontrado
        DB-->>AuthRouter: null
        AuthRouter-->>Usuario: HTTP 401 Unauthorized ("Credenciales inválidas")
    else Usuario encontrado
        DB-->>AuthRouter: Registro Usuario (hash_guardado, rol)
        AuthRouter->>Crypt: verify(password_plana, hash_guardado)
        
        alt Contraseña incorrecta
            Crypt-->>AuthRouter: False
            AuthRouter-->>Usuario: HTTP 401 Unauthorized ("Credenciales inválidas")
        else Contraseña correcta
            Crypt-->>AuthRouter: True
            AuthRouter->>JWT: encode({sub: email, user_id, rol, exp})
            JWT-->>AuthRouter: access_token
            AuthRouter-->>Usuario: HTTP 200 OK { access_token, token_type: "bearer", rol }
        end
    end
```

---

## 6. Diagrama de Componentes del Sistema

Ilustra la arquitectura por capas, la separación de responsabilidades y la integración entre el cliente web, la API REST y las capas de persistencia.

```mermaid
graph TB
    subgraph Frontend ["Capa Frontend (React 18 + Vite)"]
        UI_Nav["Navbar & Logo SenaMarket"]
        UI_Tabs["OfferTabs (Pestañas Ofertas)"]
        UI_Sidebar["SidebarFilters (Filtros & Categorías BD)"]
        UI_Grid["ProductCard Grid (3 Columnas)"]
        UI_Context["ToastContext & CartContext"]
        UI_API["apiFetch Client"]
    end

    subgraph Backend ["Capa Backend (FastAPI Core)"]
        Router_Pub["Public Router (/productos, /categorias)"]
        Router_Auth["Auth Router (/auth/token, /auth/me)"]
        Router_Orders["Orders Router (/compras/checkout)"]
        Router_Vendor["Vendor Router (/vendedor/*)"]
        Middleware_CORS["CORSMiddleware"]
        Service_Cache["Redis Cache Manager"]
        ORM_SQLA["SQLAlchemy ORM"]
    end

    subgraph Persistencia ["Capa de Persistencia & Infraestructura"]
        DB_MySQL[("MySQL 8.0\n(Relational Database)")]
        DB_Redis[("Redis 7.0\n(Cache & Session Store)")]
    end

    %% Conexiones Frontend -> Backend
    UI_API -->|HTTP REST / JSON| Middleware_CORS
    Middleware_CORS --> Router_Pub
    Middleware_CORS --> Router_Auth
    Middleware_CORS --> Router_Orders
    Middleware_CORS --> Router_Vendor

    %% Conexiones Backend -> Persistencia
    Router_Pub --> Service_Cache
    Router_Pub --> ORM_SQLA
    Router_Orders --> ORM_SQLA
    Router_Orders --> Service_Cache
    Router_Vendor --> ORM_SQLA
    Router_Vendor --> Service_Cache
    Router_Auth --> ORM_SQLA

    Service_Cache --> DB_Redis
    ORM_SQLA --> DB_MySQL
```

---

## 7. Diagrama de Despliegue de Infraestructura

Topología física de servidores, puertos y protocolos de comunicación del entorno de producción y desarrollo.

```mermaid
graph TB
    ClientBrowser["💻 Navegador Web del Usuario\n(Chrome, Edge, Safari, Firefox)"]

    subgraph HostServer ["Servidor de Aplicación (Host / VPS / Cloud)"]
        subgraph WebLayer ["Capa Web & Proxy Inverso"]
            Nginx["Nginx / Reverse Proxy\n(Puertos 80 / 443 HTTPS)"]
        end

        subgraph ClientApp ["Frontend Static Host"]
            ViteDist["Vite Static Build (/dist)\n(Puerto 5173 en Dev)"]
        end

        subgraph APILayer ["Backend Application Runtime"]
            FastAPIApp["Uvicorn ASGI Server\n(FastAPI Core - Puerto 8000)"]
        end

        subgraph DataLayer ["Capa de Persistencia de Datos"]
            MySQLService["MySQL Server 8.0\n(Puerto 3306)"]
            RedisService["Redis Cache Server\n(Puerto 6379)"]
        end
    end

    %% Enlaces
    ClientBrowser -->|HTTPS :443 / HTTP :5173| Nginx
    Nginx -->|Sirve Estáticos| ViteDist
    Nginx -->|Proxy Pass /api /docs| FastAPIApp
    FastAPIApp -->|TCP / PyMySQL| MySQLService
    FastAPIApp -->|TCP / Redis Protocol| RedisService
```

---

## 8. Diagrama de Máquina de Estados: Ciclo de Vida de una Orden

Modela las transiciones de estado de un pedido desde su creación hasta la entrega o cancelación.

```mermaid
stateDiagram-v2
    [*] --> PENDIENTE : Usuario inicia checkout
    
    PENDIENTE --> PAGADO : Pago validado y stock debitado
    PENDIENTE --> CANCELADO : Fondos insuficientes / Error en pago
    
    PAGADO --> ENVIADO : Vendedor despacha con número de guía
    PAGADO --> CANCELADO : Solicitud de reembolso aprobada (Reintegro de stock)
    
    ENVIADO --> ENTREGADO : Pedido recibido por el comprador
    ENVIADO --> CANCELADO : Novedad logística / Devolución
    
    ENTREGADO --> [*] : Proceso completado
    CANCELADO --> [*] : Orden cerrada
```

---

## 9. Diagrama de Actividades: Publicación y Gestión de Catálogo por Vendedor

Flujo que describe el proceso de publicación de un nuevo producto, validación de campos, guardado en base de datos e invalidación de caché.

```mermaid
flowchart TD
    Start(["Inicio: Vendedor desea publicar producto"]) --> CheckRole{"¿Usuario tiene rol VENDEDOR?"}
    
    CheckRole -- No --> PromoteRole["Registrar datos de Emprendimiento SENA"]
    PromoteRole --> SaveEmp["Guardar Emprendimiento y Asignar Rol VENDEDOR"]
    SaveEmp --> InputData
    
    CheckRole -- Sí --> InputData["Ingresar: Nombre, Descripción, Precio, Stock, Categoría, URL Imagen"]
    
    InputData --> Validate{"¿Datos válidos?\n(Precio > 0, Stock >= 0, Categoria existe)"}
    
    Validate -- No --> ShowError["Mostrar error de validación en pantalla"]
    ShowError --> InputData
    
    Validate -- Sí --> SaveDB["Guardar producto en tabla 'productos' (MySQL)"]
    SaveDB --> ClearCache["Invalidar caché Redis (productos:* y categorias:*)"]
    ClearCache --> NotifyToast["Mostrar notificación Toast: '¡Producto publicado con éxito!'"]
    NotifyToast --> End(["Fin: Producto visible en el catálogo general"])
```
