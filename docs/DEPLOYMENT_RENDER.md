# 🚀 Guía de Despliegue en Render - SENAMARKET

Esta guía detalla los pasos para desplegar **SenaMarket** (Backend FastAPI + Frontend React 18 / Vite) en [Render.com](https://render.com).

---

## 📋 Métodos de Despliegue

### Opción 1: Despliegue Automático con Blueprint (`render.yaml`) ⭐ *Recomendado*

1. Ingresa a tu cuenta en [Render Dashboard](https://dashboard.render.com/).
2. Haz clic en **New +** y selecciona **Blueprint**.
3. Conecta tu repositorio de GitHub `proyectosena`.
4. Render detectará automáticamente el archivo [`render.yaml`](../render.yaml) y creará los dos servicios:
   - **`senamarket-api`** (Web Service en Python / FastAPI).
   - **`senamarket-web`** (Static Site en React / Vite).
5. Ingresa el valor de tu variable de entorno `DATABASE_URL` (tu base de datos MySQL en la nube).
6. Haz clic en **Apply** y Render iniciará la compilación y despliegue automático de ambos servicios.

---

### Opción 2: Despliegue Manual Servicio por Servicio

Si prefieres configurar cada servicio manualmente en la interfaz de Render:

#### Paso 1: Desplegar el Backend (FastAPI Web Service)

1. En Render Dashboard, haz clic en **New +** ➔ **Web Service**.
2. Conecta tu repositorio de GitHub.
3. Configura los siguientes campos:
   - **Name**: `senamarket-api`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free
4. Agrega las siguientes **Environment Variables**:
   - `PYTHON_VERSION`: `3.11.9`
   - `DATABASE_URL`: `mysql+pymysql://<usuario>:<password>@<host>:<puerto>/<nombre_bd>`
   - `SECRET_KEY`: `(Generar una clave segura aleatoria)`
   - `CORS_ORIGINS`: `https://senamarket-web.onrender.com,http://localhost:5173`
5. Haz clic en **Create Web Service**. Copia la URL generada (ej. `https://senamarket-api.onrender.com`).

---

#### Paso 2: Desplegar el Frontend (React Static Site)

1. En Render Dashboard, haz clic en **New +** ➔ **Static Site**.
2. Conecta tu repositorio de GitHub.
3. Configura los siguientes campos:
   - **Name**: `senamarket-web`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. En la pestaña **Redirects / Rewrites**, agrega una regla:
   - **Type**: `Rewrite`
   - **Source Path**: `/*`
   - **Destination Path**: `/index.html`
   *(Nota: También está configurado automáticamente mediante el archivo `public/_redirects`)*.
5. En **Environment Variables**, agrega:
   - `VITE_API_URL`: `https://senamarket-api.onrender.com` *(La URL de tu backend del Paso 1)*.
6. Haz clic en **Create Static Site**.

---

## 🗄️ Opciones de Base de Datos MySQL en la Nube

Para conectar la variable `DATABASE_URL`, puedes usar cualquiera de estos proveedores gratuitos y compatibles:

1. **Aiven for MySQL** ([aiven.io](https://aiven.io/)): Plan gratuito con MySQL 8.0 gestionado.
2. **TiDB Cloud Serverless** ([pingcap.com/tidbcloud](https://tidbcloud.com/)): 100% compatible con protocolo MySQL 8.0, 25 GB gratis.
3. **Clever Cloud** ([clever-cloud.com](https://www.clever-cloud.com/)): Instancias MySQL gestionadas.

Formato de conexión:

```env
DATABASE_URL=mysql+pymysql://usuario:contrasena@host:3306/nombre_basedatos
```

---

## ✅ Verificación del Despliegue

1. **Backend**: Accede a `https://senamarket-api.onrender.com/docs` para ver la documentación Swagger interactiva.
2. **Frontend**: Abre `https://senamarket-web.onrender.com` para navegar en la plataforma con catálogo, filtros y carrito reactivo en vivo.
