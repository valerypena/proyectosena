# 🚀 Guía Completa de Despliegue en Render - SENAMARKET

Esta guía detalla los pasos para desplegar **SenaMarket** (Backend FastAPI + Frontend React 18 / Vite + Base de Datos) en [Render.com](https://render.com).

---

## 📦 Paso 1: Subir tu Repositorio a GitHub

Para que Render pueda construir tu aplicación, el proyecto debe estar en tu cuenta de GitHub:

1. Ve a [GitHub](https://github.com/new) y crea un nuevo repositorio llamado `proyectosena` (público o privado).
2. Abre la terminal o PowerShell en la carpeta del proyecto y ejecuta:

```bash
# Vincular con tu repositorio remoto de GitHub (sustituye TU_USUARIO):
git remote add origin https://github.com/TU_USUARIO/proyectosena.git

# Subir los cambios a la rama principal:
git push -u origin main
```

*(Si es la primera vez que subes código desde este equipo, GitHub te solicitará iniciar sesión en la ventana emergente).*

---

## 📋 Paso 2: Despliegue en Render.com

### Opción 1: Despliegue 1-Click con Blueprint (`render.yaml`) ⭐ *Recomendado*

El archivo [`render.yaml`](../render.yaml) ya está configurado para aprovisionar todo de forma automática:
- **`senamarket-db`**: Base de datos PostgreSQL gratuita gestionada en Render.
- **`senamarket-api`**: Servicio Web FastAPI en Python 3.11 con conexión automática a la base de datos y creación/poblado de tablas en el arranque (`lifespan`).
- **`senamarket-web`**: Sitio Estático React 18 + Vite con redirecciones y conexión a la URL del backend.

**Pasos:**
1. Inicia sesión en [Render Dashboard](https://dashboard.render.com/).
2. Haz clic en el botón superior **New +** y selecciona **Blueprint**.
3. Conecta tu repositorio de GitHub `proyectosena`.
4. Render detectará automáticamente el archivo `render.yaml` y mostrará los recursos a crear (`senamarket-db`, `senamarket-api`, `senamarket-web`).
5. Haz clic en **Apply**.
6. Render construirá y desplegará automáticamente la base de datos, el backend y el frontend.

---

### Opción 2: Usar una Base de Datos MySQL Externa (TiDB, Aiven o Clever Cloud)

Si deseas utilizar MySQL en lugar de PostgreSQL:

1. Crea tu base de datos gratuita en:
   - **TiDB Cloud Serverless** ([tidbcloud.com](https://tidbcloud.com/)): 25 GB gratuitos, 100% compatible con MySQL 8.
   - **Aiven for MySQL** ([aiven.io](https://aiven.io/)): Instancia MySQL gestionada.
2. En Render Dashboard, ve a tu servicio **`senamarket-api`** ➔ **Environment**.
3. Edita la variable `DATABASE_URL`:
   ```env
   DATABASE_URL=mysql+pymysql://usuario:contrasena@host:puerto/unimarket?ssl_verify_cert=true
   ```
4. Guarda los cambios. Render reiniciará el servicio y ejecutará automáticamente la siembra del catálogo.

---

## ✅ Paso 3: Verificación del Despliegue

Una vez concluido el despliegue en Render:

1. **Backend & Documentación Swagger**:
   - Accede a `https://senamarket-api.onrender.com/docs`
   - Prueba el endpoint `GET /productos` para comprobar que la base de datos responde.
2. **Frontend en Producción**:
   - Abre `https://senamarket-web.onrender.com`
   - Navega por las categorías, filtros, buscador y ficha de producto en vivo.

