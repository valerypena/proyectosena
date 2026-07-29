# Guía de Replicación de la Base de Datos - UNIMARKET

Este proyecto utiliza **Python**, **SQLAlchemy** y **MySQL (XAMPP)**. Sigue estos pasos para replicar la base de datos completa con **700 productos (50 por categoría)** y datos de prueba.

## 1. Requisitos Previos

* Tener instalado **XAMPP** (u otro servidor MySQL).
* Tener **Python 3.10+** instalado.

## 2. Preparación de MySQL

1. Abre el **XAMPP Control Panel**.
2. Inicia el módulo **MySQL** (Puerto por defecto: 3306).
3. No es necesario crear la base de datos manualmente, el script lo hará por ti.

## 3. Configuración del Entorno Python

Si es la primera vez que configuras el proyecto, instala las dependencias necesarias:

```powershell
# Instalar dependencias
pip install -r backend/requirements.txt
```

Asegúrate de que el archivo `backend/.env` tenga la URL de conexión correcta:

```env
DATABASE_URL="mysql+pymysql://root:@localhost:3306/unimarket"
```

## 4. Ejecución del Script de Replicación

Ejecuta el siguiente comando desde la raíz del proyecto para borrar la BD actual (si existe), crear las tablas e insertar los **700 productos**:

```powershell
python backend/setup_full_db.py
```

## ¿Qué incluye la réplica?

* **14 Categorías** oficiales.
* **20 Tiendas (Emprendimientos)** con logos y descripciones.
* **700 Productos** (50 por categoría) reales con imágenes, stock y precios en COP coherentes.
* **10 Usuarios Compradores** con historial de actividad.
* **Historial Simulado:** Compras, reseñas de 5 estrellas y preguntas frecuentes.

---

*Nota: Si usas una contraseña de MySQL diferente de la vacía (root:), edita el archivo `.env` antes de ejecutar el script.*
