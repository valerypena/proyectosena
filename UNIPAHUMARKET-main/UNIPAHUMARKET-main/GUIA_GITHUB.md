# 🐙 Guía para Subir el Proyecto a GitHub

Parece que **Git** no está instalado o configurado en tu terminal actual. No te preocupes, aquí tienes los pasos exactos para subir tu proyecto `UNIMARKET` a GitHub.

## Paso 1: Instalar Git (Si no lo tienes)

1. Descarga Git desde [git-scm.com](https://git-scm.com/downloads).
2. Instálalo (siguiente, siguiente, siguiente...).
3. Abre una **nueva** terminal para confirmar que funciona escribiendo: `git --version`.

## Paso 2: Crear el Repositorio en GitHub

1. Ve a [GitHub.com](https://github.com) e inicia sesión.
2. Haz clic en el botón **"New"** (Nuevo repositorio).
3. Nombre del repositorio: `unimarket-ecommerce`.
4. **NO** marques las casillas de "Add README", "Add .gitignore" (ya los tenemos).
5. Haz clic en **Create repository**.

## Paso 3: Subir tu Código (Comandos)

Copia y pega estos comandos uno por uno en tu terminal (dentro de la carpeta `mercadolibre`):

```bash
# 1. Inicializar Git
git init

# 2. Conectar con tu repositorio (¡Reemplaza TU_USUARIO!)
git remote add origin https://github.com/TU_USUARIO/unimarket-ecommerce.git

# 3. Preparar los archivos
git add .

# 4. Guardar los cambios
git commit -m "Version 1.0: Full Stack con 700 Productos de Demo"

# 5. Subir a la nube
git branch -M main
git push -u origin main
```

¡Y listo! Tu proyecto estará publicado.

---

## 💡 Alternativa: GitHub Desktop

Si prefieres no usar comandos:
1. Descarga [GitHub Desktop](https://desktop.github.com/).
2. Arrastra la carpeta `mercadolibre` dentro de la aplicación.
3. Haz clic en "Publish repository".
