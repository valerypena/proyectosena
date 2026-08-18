# Documentación de Arquitectura y Diagramas UML - UNIMARKET

Este documento contiene la especificación de la arquitectura de **UNIMARKET** (Plataforma e-commerce para emprendimientos universitarios / SENA) mediante **9 diagramas UML distintos**, expresados en sintaxis nativa de **Mermaid**.

---

## Índice de Diagramas UML

1. [Diagrama de Casos de Uso (Use Case Diagram)](#1-diagrama-de-casos-de-uso)
2. [Diagrama de Clases del Dominio (Class Diagram)](#2-diagrama-de-clases-del-dominio)
3. [Diagrama Entidad-Relación (ER Diagram / Modelo de Datos)](#3-diagrama-entidad-relación)
4. [Diagrama de Secuencia: Procesamiento de Compra y Checkout](#4-diagrama-de-secuencia-procesamiento-de-compra-y-checkout)
5. [Diagrama de Secuencia: Autenticación y Autorización JWT](#5-diagrama-de-secuencia-autenticación-y-autorización-jwt)
6. [Diagrama de Componentes del Sistema (Component Diagram)](#6-diagrama-de-componentes-del-sistema)
7. [Diagrama de Despliegue de Infraestructura (Deployment Diagram)](#7-diagrama-de-despliegue-de-infraestructura)
8. [Diagrama de Máquina de Estados: Ciclo de Vida de una Orden](#8-diagrama-de-máquina-de-estados-ciclo-de-vida-de-una-orden)
9. [Diagrama de Actividades: Gestión de Productos por Vendedor](#9-diagrama-de-actividades-gestión-de-productos-por-vendedor)

---

## 1. Diagrama de Casos de Uso

Muestra las interacciones clave entre los actores del sistema (**Comprador**, **Vendedor**, **Administrador** y **Sistema de Notificaciones**) y las funcionalidades principales ofrecidas por UNIMARKET.

```mermaid
graph TD
    %% Actores
    Comprador((":bust_in_silhouette: Comprador"))
    Vendedor((":briefcase: Vendedor"))
    Admin((":shield: Administrador"))
    NotifSys((":bell: Sistema Notificaciones"))

    subgraph UNIMARKET ["Plataforma UNIMARKET"]
        UC1["Registrarse / Iniciar Sesión"]
        UC2["Explorar / Buscar Productos"]
        UC3["Gestionar Carrito de Compras"]
        UC4["Realizar Checkout y Pago"]
        UC5["Dejar Calificación y Reseña"]

        UC6["Registrar Emprendimiento"]
        UC7["Gestionar Catálogo de Productos (CRUD)"]
        UC8["Visualizar Pedidos Recibidos"]

        UC9["Gestionar Categorías"]
        UC10["Administrar Usuarios y Emprendimientos"]
        UC11["Enviar Notificación de Pedido"]
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

    %% Relaciones Administrador
    Admin --> UC1
    Admin --> UC9
    Admin --> UC10

    %% Includes & Extends
    UC4 ..> UC11 : <<include>>
    UC11 --> NotifSys
```

### Descripción Técnica
- **Comprador**: Puede explorar productos, agregar al carrito, finalizar la orden y dejar reseñas tras la compra.
- **Vendedor**: Extiende las capacidades del usuario registrando su marca/emprendimiento y administrando su inventario.
- **Administrador**: Supervisa categorías globales, emprendimientos registrados y permisos en la plataforma.

---

## 2. Diagrama de Clases del Dominio

Modela la estructura orientada a objetos del núcleo de UNIMARKET, sus atributos, métodos principales y las relaciones entre entidades (asociaciones, multiplicidades y composiciones).

```mermaid
classDiagram
    class Usuario {
        +int id
        +string nombreCompleto
        +string email
        +string contrasenaHash
        +RolEnum rol
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
        +string nombreMarca
        +string descripcion
        +string urlLogo
        +DateTime creadoEn
        +actualizarDatos()
    }

    class Categoria {
        +int id
        +string nombre
        +string descripcion
        +crear()
    }

    class Producto {
        +int id
        +int emprendimientoId
        +int categoriaId
        +string nombre
        +string descripcion
        +decimal precio
        +int cantidadStock
        +string urlImagen
        +DateTime creadoEn
        +actualizarStock(int cantidad)
    }

    class ItemCarrito {
        +int id
        +int usuarioId
        +int productoId
        +int cantidad
        +DateTime agregadoEn
        +modificarCantidad(int nuevaCantidad)
    }

    class Compra {
        +int id
        +int usuarioId
        +decimal montoTotal
        +EstadoCompraEnum estado
        +DateTime creadoEn
        +cambiarEstado(EstadoCompraEnum nuevoEstado)
    }

    class EstadoCompraEnum {
        <<enumeration>>
        PENDIENTE
        PAGADO
        ENVIADO
        ENTREGADO
    }

    class ItemCompra {
        +int id
        +int compraId
        +int productoId
        +int cantidad
        +decimal precioAlComprar
        +calcularSubtotal() decimal
    }

    class Resena {
        +int id
        +int usuarioId
        +int productoId
        +int calificacion
        +string comentario
        +DateTime creadoEn
    }

    %% Relaciones
    Usuario "1" -- "0..1" Emprendimiento : posee >
    Usuario "1" -- "0..*" ItemCarrito : gestiona >
    Usuario "1" -- "0..*" Compra : realiza >
    Usuario "1" -- "0..*" Resena : escribe >
    Usuario --> RolEnum

    Emprendimiento "1" -- "0..*" Producto : publica >
    Categoria "1" -- "0..*" Producto : clasifica >

    Producto "1" -- "0..*" ItemCarrito : agregado en >
    Producto "1" -- "0..*" ItemCompra : incluido en >
    Producto "1" -- "0..*" Resena : recibe >

    Compra "1" *-- "1..*" ItemCompra : contiene >
    Compra --> EstadoCompraEnum
```

---

## 3. Diagrama Entidad-Relación

Representa el modelo físico de la base de datos relacional MySQL configurado en `docs/schema.sql`, con sus claves primarias (`PK`), claves foráneas (`FK`), tipos de datos y cardinalidades.

```mermaid
erDiagram
    usuarios ||--o| emprendimientos : "registra (1:1/1:N)"
    usuarios ||--o{ items_carrito : "posee"
    usuarios ||--o{ compras : "realiza"
    usuarios ||--o{ resenas : "escribe"

    emprendimientos ||--o{ productos : "publica"
    categorias ||--o{ productos : "clasifica"

    productos ||--o{ items_carrito : "está en"
    productos ||--o{ items_compra : "forma parte de"
    productos ||--o{ resenas : "tiene"

    compras ||--|{ items_compra : "contiene"

    usuarios {
        INT id PK
        VARCHAR nombre_completo
        VARCHAR email UK
        VARCHAR contrasena_hash
        ENUM rol
        TIMESTAMP creado_en
    }

    emprendimientos {
        INT id PK
        INT usuario_id FK
        VARCHAR nombre_marca
        TEXT descripcion
        VARCHAR url_logo
        TIMESTAMP creado_en
    }

    categorias {
        INT id PK
        VARCHAR nombre UK
        TEXT descripcion
    }

    productos {
        INT id PK
        INT emprendimiento_id FK
        INT categoria_id FK
        VARCHAR nombre
        TEXT descripcion
        DECIMAL precio
        INT cantidad_stock
        VARCHAR url_imagen
        TIMESTAMP creado_en
    }

    items_carrito {
        INT id PK
        INT usuario_id FK
        INT producto_id FK
        INT cantidad
        TIMESTAMP agregado_en
    }

    compras {
        INT id PK
        INT usuario_id FK
        DECIMAL monto_total
        ENUM estado
        TIMESTAMP creado_en
    }

    items_compra {
        INT id PK
        INT compra_id FK
        INT producto_id FK
        INT cantidad
        DECIMAL precio_al_comprar
    }

    resenas {
        INT id PK
        INT usuario_id FK
        INT producto_id FK
        INT calificacion
        TEXT comentario
        TIMESTAMP creado_en
    }
```

---

## 4. Diagrama de Secuencia: Procesamiento de Compra y Checkout

Muestra el flujo sincrónico y asincrónico entre el cliente, el API Gateway, los microservicios de Carrito, Pedidos, Productos, la Base de Datos y la cola de eventos RabbitMQ al finalizar una compra.

```mermaid
sequenceDiagram
    autonumber
    actor Cliente as Comprador (React App)
    participant Gateway as API Gateway
    participant CartSvc as Cart Service
    participant OrderSvc as Order Service
    participant ProductSvc as Product Service
    participant DB as MySQL Database
    participant MQ as RabbitMQ Broker
    participant NotifSvc as Notification Service

    Cliente->>Gateway: POST /api/checkout (Bearer JWT)
    Gateway->>Gateway: Validar Token JWT
    Gateway->>OrderSvc: Crear Orden (usuario_id)

    OrderSvc->>CartSvc: GET /cart/items (usuario_id)
    CartSvc-->>OrderSvc: Retorna Items del Carrito

    loop Por cada producto en el carrito
        OrderSvc->>ProductSvc: Validar y Reservar Stock (producto_id, cantidad)
        ProductSvc->>DB: UPDATE productos SET stock = stock - N
        DB-->>ProductSvc: Stock Actualizado
        ProductSvc-->>OrderSvc: Confirmación Stock OK
    end

    OrderSvc->>DB: INSERT INTO compras, items_compra
    DB-->>OrderSvc: ID Compra Creada (Estado: PENDIENTE/PAGADO)

    OrderSvc->>CartSvc: DELETE /cart/clear (usuario_id)
    CartSvc->>DB: DELETE FROM items_carrito WHERE usuario_id
    DB-->>CartSvc: Carrito Vacío

    OrderSvc->>MQ: Publish Event: "order.created" (OrderDetails)
    OrderSvc-->>Gateway: 201 Created (Order Response)
    Gateway-->>Cliente: 201 Orden Confirmada

    MQ-->>NotifSvc: Consume Event: "order.created"
    NotifSvc->>NotifSvc: Enviar Email de Confirmación al Comprador/Vendedor
```

---

## 5. Diagrama de Secuencia: Autenticación y Autorización JWT

Describe el procedimiento de inicio de sesión de usuarios, la interacción con la memoria caché en **Redis** para revocación/sesiones y la verificación de permisos en las peticiones entrantes.

```mermaid
sequenceDiagram
    autonumber
    actor Usuario as Cliente Web
    participant Gateway as API Gateway
    participant AuthSvc as Auth Service / Backend Python
    participant Redis as Redis Cache
    participant DB as MySQL DB

    Usuario->>Gateway: POST /api/auth/login (email, contrasena)
    Gateway->>AuthSvc: Forward /auth/login
    AuthSvc->>DB: SELECT * FROM usuarios WHERE email = ?
    DB-->>AuthSvc: Registro Usuario (Hash Contraseña)
    
    AuthSvc->>AuthSvc: Verificar Hash bcrypt / Argon2
    alt Credenciales Válidas
        AuthSvc->>AuthSvc: Generar Access Token JWT (payload: id, email, rol)
        AuthSvc->>Redis: SET session:user_id JWT_Token (TTL)
        Redis-->>AuthSvc: OK
        AuthSvc-->>Gateway: 200 OK { token, usuario }
        Gateway-->>Usuario: 200 OK (Guarda Token en LocalStorage/Cookie)
    else Credenciales Inválidas
        AuthSvc-->>Gateway: 401 Unauthorized
        Gateway-->>Usuario: 401 Error de Autenticación
    end

    note over Usuario, Gateway: Solicitud Posterior a Recurso Protegido
    Usuario->>Gateway: GET /api/vendedoras/mis-productos (Header: Authorization Bearer JWT)
    Gateway->>Gateway: Decodificar y Validar Firma de JWT
    Gateway->>Redis: EXISTS session:blacklisted:JWT
    Redis-->>Gateway: No (Token Válido)
    Gateway->>Gateway: Verificar Rol ('VENDEDOR')
    Gateway->>AuthSvc: Forward Request con Contexto de Usuario
    AuthSvc-->>Gateway: 200 Datos del Catálogo
    Gateway-->>Usuario: 200 Respuesta con Datos
```

---

## 6. Diagrama de Componentes del Sistema

Visualiza la arquitectura lógica del sistema, organizada en **Frontend**, **API Gateway**, **Servicios Backend / Microservicios**, **Capa de Persistencia** y **Mensajería Event-Driven**.

```mermaid
componentDiagram
    package "Capa de Presentación" {
        [React + Vite Frontend] as FE
    }

    package "Capa de Entrada / Enrutamiento" {
        [API Gateway (Node/Express/Proxy)] as GW
    }

    package "Capa de Lógica de Negocio (Monolito FastAPI / Microservicios)" {
        [Auth Service / Monolito FastAPI] as AuthSvc
        [Product Service] as ProdSvc
        [Order Service] as OrderSvc
        [Cart Service] as CartSvc
        [User Service] as UserSvc
        [Notification Service] as NotifSvc
        [Sync Service] as SyncSvc
        [Shared Core Library (@unimarket/shared)] as SharedLib
    }

    package "Capa de Mensajería y Eventos" {
        [RabbitMQ Event Broker] as MQ
    }

    package "Capa de Persistencia y Caché" {
        database "MySQL Database" as MySQL
        database "Redis Cache" as Redis
        database "MongoDB (Microservicios)" as Mongo
    }

    %% Conexiones Frontend y Gateway
    FE --> GW : HTTP/REST / WebSockets

    %% Conexiones Gateway a Servicios
    GW --> AuthSvc : /api/auth
    GW --> ProdSvc : /api/products
    GW --> OrderSvc : /api/orders
    GW --> CartSvc : /api/cart
    GW --> UserSvc : /api/users

    %% Shared Library Dependency
    AuthSvc ..> SharedLib
    ProdSvc ..> SharedLib
    OrderSvc ..> SharedLib
    CartSvc ..> SharedLib

    %% Conexiones a Bases de Datos
    AuthSvc --> MySQL
    ProdSvc --> MySQL
    OrderSvc --> MySQL
    CartSvc --> Redis
    UserSvc --> Mongo

    AuthSvc --> Redis : Caché de Sesiones

    %% Conexiones Asincrónicas (Mensajería)
    OrderSvc --> MQ : Publica "order.created"
    SyncSvc --> MQ : Publica "sync.updated"
    MQ --> NotifSvc : Consume Eventos
    MQ --> SyncSvc : Consume Eventos
```

---

## 7. Diagrama de Despliegue de Infraestructura

Ilustra la distribución física/contenedorizada de los nodos de hardware, contenedores Docker, redes internas y puertos asignados para producción/desarrollo.

```mermaid
graph TB
    subgraph ClientDevice [" Dispositivo del Usuario "]
        Browser[" Web Browser (Chrome/Firefox/Safari)\nReact Single Page Application"]
    end

    subgraph CloudInfra [" Servidor / Infraestructura Cloud (Docker Host) "]
        subgraph PublicNet [" Red Pública (DMZ / Nginx Ingress) "]
            Proxy[" Nginx / Ingress Proxy\nPuerto 80 / 443 (SSL/TLS) "]
        end

        subgraph AppNet [" Red Interna Docker (unimarket-net) "]
            APIGW[" Contenedor: API Gateway\n(Node.js / Express - Port 8000) "]
            FastAPI[" Contenedor: Backend Core FastAPI\n(Python 3.11 - Port 8001) "]
            SvcProd[" Contenedor: Product Microservice\n(Node.js - Port 8002) "]
            SvcOrder[" Contenedor: Order Microservice\n(Node.js - Port 8003) "]
            SvcCart[" Contenedor: Cart Microservice\n(Node.js - Port 8004) "]
            SvcNotif[" Contenedor: Notification Microservice\n(Node.js - Port 8005) "]
        end

        subgraph EventLayer [" Capa de Eventos "]
            RabbitMQ[" Contenedor: RabbitMQ Broker\nAMQP Port 5672 / Mgmt 15672 "]
        end

        subgraph DataLayer [" Capa de Datos Persistente "]
            MySQLNode[" Contenedor: MySQL 8.0\nPuerto 3306 (Volumen Persistente) "]
            RedisNode[" Contenedor: Redis 7.0\nPuerto 6379 (In-Memory Cache) "]
            MongoNode[" Contenedor: MongoDB 6.0\nPuerto 27017 (Document Store) "]
        end
    end

    %% Flujo de Conexiones
    Browser -->|HTTPS / Port 443| Proxy
    Proxy -->|HTTP / Internal| APIGW

    APIGW --> FastAPI
    APIGW --> SvcProd
    APIGW --> SvcOrder
    APIGW --> SvcCart

    FastAPI --> MySQLNode
    FastAPI --> RedisNode

    SvcProd --> MySQLNode
    SvcOrder --> MySQLNode
    SvcOrder --> RabbitMQ
    SvcCart --> RedisNode
    
    RabbitMQ --> SvcNotif
    SvcNotif --> MongoNode
```

---

## 8. Diagrama de Máquina de Estados: Ciclo de Vida de una Orden

Modela las transiciones del estado del registro `compras` (`PENDIENTE`, `PAGADO`, `ENVIADO`, `ENTREGADO`) y la condición de cancelación o reembolso.

```mermaid
stateDiagram-v2
    [*] --> PENDIENTE : Usuario inicia checkout

    PENDIENTE --> PAGADO : Pago confirmado exitosamente
    PENDIENTE --> CANCELADO : Expiración de tiempo / Rechazo de pago

    PAGADO --> ENVIADO : Vendedor despacha el paquete y agrega guía
    PAGADO --> CANCELADO : Cancelación por falta de stock / Solicitud comprador

    ENVIADO --> ENTREGADO : Comprador / Pasarela confirma recepción del producto

    CANCELADO --> REEMBOLSADO : Procesamiento de devolución de dinero

    ENTREGADO --> [*]
    REEMBOLSADO --> [*]

    note right of PENDIENTE
        Se valida stock preliminar
        y se genera el registro de compra.
    end note

    note right of PAGADO
        Se notifica al vendedor
        para empaque y despacho.
    end note

    note right of ENTREGADO
        Se habilita la opción de
        dejar Reseña y Calificación.
    end note
```

---

## 9. Diagrama de Actividades: Gestión de Productos por Vendedor

Detalla el flujo condicional de actividades cuando un **Vendedor** desea autenticarse, verificar su perfil de emprendimiento y publicar o actualizar un producto en el catálogo.

```mermaid
flowchart TD
    Start([Inicio: Vendedor accede al Panel]) --> Login{¿Sesión Iniciada?}
    
    Login -- No --> FormLogin[Ingresar Credenciales]
    FormLogin --> AuthVal{¿Credenciales Correctas?}
    AuthVal -- No --> ErrAuth[Mostrar Mensaje de Error] --> FormLogin
    AuthVal -- Sí --> SetToken[Guardar Token JWT y Redirigir] --> CheckEmp

    Login -- Sí --> CheckEmp{¿Posee Emprendimiento Registrado?}

    CheckEmp -- No --> RegEmp[Completar Formulario de Emprendimiento: Nombre Marca, Logo, Descripción]
    RegEmp --> SaveEmp[Guardar en BD 'emprendimientos'] --> CheckEmp

    CheckEmp -- Sí --> Menu[Mostrar Panel del Vendedor]
    Menu --> Action{¿Acción Deseada?}

    Action -- Crear Producto --> FormProd[Llenar Datos: Nombre, Categoría, Precio, Stock, Imagen]
    FormProd --> ValProd{¿Datos Válidos?}
    ValProd -- No --> ErrProd[Mostrar Error de Validación] --> FormProd
    ValProd -- Sí --> UploadImg[Subir / Guardar URL de Imagen]
    UploadImg --> SaveProd[Insertar en BD 'productos']
    SaveProd --> CleanCache[Invalidar Caché Redis de Productos]
    CleanCache --> OkMsg[Mostrar Confirmación] --> Menu

    Action -- Editar Producto --> SelectProd[Seleccionar Producto del Listado]
    SelectProd --> EditForm[Modificar Precio / Stock / Descripción]
    EditForm --> UpdateProd[UPDATE productos en BD]
    UpdateProd --> CleanCache --> OkMsg

    Action -- Salir --> End([Fin de Sesión])
```

---

## Mantenimiento y Extensión

Para modificar o agregar nuevos diagramas a esta documentación:
1. Utilice el formato de bloque de código ` ```mermaid ` en markdown.
2. Compruebe la sintaxis en cualquier visualizador compatible (VS Code Mermaid Preview, GitHub o [Mermaid Live Editor](https://mermaid.live)).
3. Asegúrese de mantener coherencia entre el nombre de las tablas (`docs/schema.sql`) y los atributos representados en los diagramas.
