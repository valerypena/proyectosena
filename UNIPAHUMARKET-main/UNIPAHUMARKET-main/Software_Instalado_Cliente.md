# INFORME DE SOFTWARE INSTALADO EN LA PLATAFORMA DEL CLIENTE - UNIMARKET

---

<div align="center">

# INFORME DE SOFTWARE INSTALADO EN LA PLATAFORMA DEL CLIENTE PARA EL SISTEMA (UNIMARKET)

<br><br><br>

**PRESENTADO POR:**
### VALERY GISEL PEÑA PINTO

<br><br><br>

**INSTRUCTOR(A):**
### EQUIPO EVALUADOR DE ANÁLISIS Y DESARROLLO DE SOFTWARE

<br><br><br><br>

**SERVICIO NACIONAL DE APRENDIZAJE (SENA)**
**CENTRO NACIONAL DE HOTELERIA, TURISMO Y ALIMENTOS**
**ANÁLISIS Y DESARROLLO DE SOFTWARE (#2977475)**
**BOGOTA DC**
**2026**

</div>

---

<div style="page-break-after: always;"></div>

## Tabla de Contenido
1. [Introducción](#introducción)
2. [Objetivos](#objetivos)
   - [Objetivo General](#objetivo-general)
   - [Objetivos Específicos](#objetivos-específicos)
3. [Software Instalado en la Plataforma del Cliente](#software-instalado-en-la-plataforma-del-cliente)
   - [3.1. Estado General del Software y Runtimes](#31-estado-general-del-software-y-runtimes)
   - [3.2. Tabla de Inventario de Software Base](#32-tabla-de-inventario-de-software-base)
   - [3.3. Análisis de Compatibilidad con UNIMARKET](#33-análisis-de-compatibilidad-con-unimarket)
4. [Conclusiones](#conclusiones)

---

<div style="page-break-after: always;"></div>

## 1. Introducción

Para que la plataforma **UNIMARKET** se ejecute de manera correcta en el entorno del cliente, es necesario contar con un conjunto de herramientas de software base (runtimes, compiladores, gestores de dependencias y sistemas operativos compatibles). Este informe técnico recopila y valida de manera rigurosa las aplicaciones instaladas en la plataforma del cliente, certificando las versiones del entorno de ejecución y los gestores activos.

La recolección de estos datos se realiza mediante comandos directos de consola sobre el sistema anfitrión. Con este inventario de software, se asegura la compatibilidad para el levantamiento del frontend, del backend y la integración con las bases de datos de UNIMARKET.

---

<div style="page-break-after: always;"></div>

## 2. Objetivos

### Objetivo General
Inventariar y validar formalmente el ecosistema de software instalado en la máquina del cliente con el fin de certificar la disponibilidad y compatibilidad de las herramientas necesarias para el despliegue del proyecto UNIMARKET.

### Objetivos Específicos
* **Comprobar las versiones** del entorno de ejecución de Node.js y Python en el equipo local.
* **Verificar el funcionamiento** de los gestores de paquetes asociados (NPM y Pip).
* **Evaluar la presencia** de utilidades de sistema como bases de datos MySQL/MariaDB y dependencias requeridas en el archivo requirements.txt.
* **Documentar la configuración** y el estado del entorno de software del cliente para facilitar futuras fases de mantenimiento y control de calidad.

---

<div style="page-break-after: always;"></div>

## 3. Software Instalado en la Plataforma del Cliente

### 3.1. Estado General del Software y Runtimes
Mediante la ejecución de consultas por terminal en el sistema anfitrión, se ha determinado el siguiente estado del software para soporte de desarrollo del proyecto UNIMARKET:

* **Node.js:** Se encuentra instalado de manera global en una versión apta para compilar aplicaciones modernas basadas en React y empaquetadores rápidos como Vite.
* **NPM:** El manejador de paquetes se encuentra operativo y actualizado.
* **Python:** Instalado y configurado en la variable de entorno PATH, lo que permite correr scripts locales y el servidor backend FastAPI.
* **Pip:** El gestor de paquetes de Python está disponible para descargar las librerías necesarias.

---

### 3.2. Tabla de Inventario de Software Base

| Herramienta | Versión Instalada | Comando de Verificación | Rol en UNIMARKET |
| :--- | :--- | :--- | :--- |
| **S.O. (Windows)** | Windows 10/11 Pro (26100) | `systeminfo` / `Get-ComputerInfo` | Plataforma anfitriona y kernel base |
| **Node.js runtime** | v26.5.0 | `node --version` | Entorno de ejecución del Frontend (Vite) |
| **NPM Manager** | 11.17.0 | `npm -v` | Instalador de módulos de React y Vite |
| **Python Compiler** | v3.8.10 | `python --version` | Ejecutor del Backend y scripts de réplica |
| **Pip (Python Packager)** | 21.1.1 | `pip --version` | Instalador de FastAPI, SQLAlchemy y dependencias |
| **MySQL Database** | 8.0 / MariaDB (XAMPP)* | `netstat` / Panel de XAMPP | Motor transaccional principal de la app |

*\*Nota: XAMPP se encuentra configurado en la plataforma del cliente para proveer el servicio de base de datos MySQL en el puerto por defecto 3306.*

---

### 3.3. Análisis de Compatibilidad con UNIMARKET
* **Frontend:** La versión de Node.js (26.5.0) y NPM (11.17.0) superan con creces el requerimiento mínimo sugerido en el `README.md` (Node 18+). Esto garantiza que la instalación de dependencias y el inicio del servidor de desarrollo con `npm run dev` se realicen sin fallos de compilación de sintaxis moderna de JavaScript.
* **Backend:** La instalación de Python (3.8.10) y Pip (21.1.1) cumple perfectamente con el soporte para FastAPI, Uvicorn y SQLAlchemy. Esto asegura que el servidor backend de la API pueda servirse de forma local usando `uvicorn main:app --reload`.
* **Persistencia:** La presencia y uso del puerto 3306 de MySQL gestionado a través de módulos locales como XAMPP es idóneo para que el script `setup_full_db.py` autogenere las tablas e inserte los 700 productos iniciales de prueba de UNIMARKET.

---

<div style="page-break-after: always;"></div>

## 4. Conclusiones

1. **Compatibilidad de Herramientas:** La plataforma del cliente posee las herramientas principales (Node.js y Python) en versiones adecuadas para soportar el flujo de compilación y ejecución de la aplicación.
2. **Soporte de Paquetes:** Los administradores de dependencias NPM (v11.17.0) y Pip (v21.1.1) están disponibles de manera nativa, lo que permite resolver los requerimientos del frontend y backend sin contratiempos.
3. **Entorno de Base de Datos:** La existencia de XAMPP / MySQL en el puerto 3306 cumple con la pre-condición del script de bases de datos para la migración y poblamiento inicial.
4. **Certificación de Preparación:** El equipo se encuentra configurado a nivel de software con las dependencias base, concluyéndose que la plataforma del cliente está lista para iniciar los procesos de integración y pruebas del software UNIMARKET.

---
**Elaborado y Validado por:**  
*Valery Gisel Peña Pinto*  
*Aprendiz del programa Análisis y Desarrollo de Software - SENA*  
*Fecha: 27 de Julio de 2026*
