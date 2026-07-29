# PLAN DE VALIDACIÓN DE CARACTERÍSTICAS MÍNIMAS DE HARDWARE - UNIMARKET

---

<div align="center">

# PLAN DE VALIDACIÓN DE CARACTERÍSTICAS MÍNIMAS DE HARDWARE PARA EL SOFTWARE (UNIMARKET)

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
3. [Plan de Validación de Hardware (Documento Principal)](#plan-de-validación-de-hardware-documento-principal)
   - [3.1. Arquitectura y Componentes del Software](#31-arquitectura-y-componentes-del-software)
   - [3.2. Definición de Requisitos de Hardware](#32-definición-de-requisitos-de-hardware)
   - [3.3. Metodología de Validación y Pruebas](#33-metodología-de-validación-y-pruebas)
   - [3.4. Resultados de Pruebas y Evidencias de Rendimiento](#34-resultados-de-pruebas-y-evidencias-de-rendimiento)
   - [3.5. Recomendaciones de Despliegue](#35-recomendaciones-de-despliegue)
4. [Conclusiones](#conclusiones)

---

<div style="page-break-after: always;"></div>

## 1. Introducción

El éxito del despliegue y operatividad de cualquier aplicación de software comercial o empresarial reside no solo en el correcto desarrollo de su código base, sino también en garantizar que el entorno físico o virtual donde se hospeda cumpla con las especificaciones técnicas adecuadas. Para la plataforma **UNIMARKET**, un sistema robusto de comercio electrónico multitienda (Marketplace) inspirado en líderes de la industria como Mercado Libre, es imperativo establecer con precisión los límites de hardware requeridos para su correcta ejecución.

Este documento detalla el **Plan de Validación de Características Mínimas de Hardware** para **UNIMARKET**. A través de este plan, se evalúan y miden los recursos críticos del sistema como la capacidad de procesamiento (CPU), el consumo de memoria volátil (RAM), la velocidad y espacio de almacenamiento en disco, y la latencia de red. El objetivo final es proveer un marco técnico claro que certifique el rendimiento de la aplicación en entornos de desarrollo y producción bajo los estándares institucionales requeridos.

---

<div style="page-break-after: always;"></div>

## 2. Objetivos

### Objetivo General
Elaborar y ejecutar un plan formal para validar, certificar y documentar los requerimientos mínimos y recomendados de hardware para el correcto funcionamiento del software **UNIMARKET**, asegurando un rendimiento estable, seguro y escalable.

### Objetivos Específicos
* **Identificar la arquitectura técnica** de UNIMARKET y el impacto en recursos de hardware de cada uno de sus componentes (Frontend, Backend, Bases de Datos, Caché y Orquestadores).
* **Definir los perfiles mínimos y recomendados de hardware** necesarios para escenarios de desarrollo local y de despliegue en servidores de producción.
* **Ejecutar pruebas reales de rendimiento (Benchmarks)** en el sistema físico actual para recopilar evidencias métricas del consumo de CPU, RAM y velocidad de lectura/escritura en disco.
* **Analizar los datos recopilados** y proponer recomendaciones técnicas de optimización y escalabilidad del hardware para evitar cuellos de botella informáticos.

---

<div style="page-break-after: always;"></div>

## 3. Plan de Validación de Hardware (Documento Principal)

### 3.1. Arquitectura y Componentes del Software
El sistema **UNIMARKET** está diseñado como una aplicación Full-Stack con la siguiente arquitectura tecnológica:
* **Frontend:** Desarrollado sobre React y Vite, utilizando CSS Vanilla para una carga ultra rápida y bajo consumo de recursos en cliente.
* **Backend:** Lógica transaccional REST construida sobre FastAPI (Python 3.10+) y orquestada con Uvicorn.
* **Base de Datos Principal:** MySQL 8.0, encargada de la persistencia de usuarios, catálogo de productos, compras, valoraciones y configuración de tiendas.
* **Caché y Sesiones:** Redis 7 para acelerar la entrega de productos populares y el control de sesiones de carrito en memoria.

Esta arquitectura requiere de validación de hardware tanto a nivel de cliente (para una navegación fluida) como a nivel de servidor (donde se hospeda la API y base de datos).

---

### 3.2. Definición de Requisitos de Hardware

A partir de los análisis de la base de código y la naturaleza de las bases de datos transaccionales, se estructuran las siguientes tablas de requisitos mínimos y recomendados:

#### A. Para el Entorno de Desarrollo o Servidor Local
| Componente | Requisito Mínimo | Requisito Recomendado |
| :--- | :--- | :--- |
| **Procesador (CPU)** | Intel Core i3 (4 núcleos) / AMD Ryzen 3 | Intel Core i5/i7 (6-8 núcleos) / AMD Ryzen 5/7 |
| **Memoria RAM** | 8 GB DDR4 | 16 GB DDR4 o superior |
| **Almacenamiento** | 10 GB de espacio libre (HDD) | 20 GB de espacio libre (SSD NVMe) |
| **Sistema Operativo** | Windows 10/11, macOS, Linux (Ubuntu 20.04+) | Windows 11 o Linux Ubuntu 22.04 LTS |
| **Conectividad** | Conexión de red de banda ancha básica | Conexión de fibra óptica (> 50 Mbps) |

#### B. Para Servidor de Producción (Escenario Base: 1,000 usuarios activos simultáneos)
| Componente | Requisito Mínimo | Requisito Recomendado |
| :--- | :--- | :--- |
| **Arquitectura de Servidor** | Cloud VPS o Instancia Dedicada (AWS EC2, Azure VM, DigitalOcean) | Instancias con balanceador de carga y auto-escalado |
| **Procesador (vCPU)** | 2 vCPUs dedicadas (2.0 GHz+) | 4 vCPUs dedicadas o superior |
| **Memoria RAM** | 4 GB dedicados para la API y BD | 8 GB o 16 GB dedicados |
| **Almacenamiento** | SSD SATA de 40 GB (150 MB/s de escritura) | SSD NVMe de 80 GB o superior (500+ MB/s) |
| **Bases de Datos** | MySQL y Redis en la misma instancia | Bases de Datos gestionadas independientes (AWS RDS, etc.) |

---

### 3.3. Metodología de Validación y Pruebas
Para validar que el equipo anfitrión es apto para ejecutar el ecosistema de UNIMARKET, se diseñó una metodología de pruebas automatizadas que mide tres pilares de hardware:
1. **Detección del Entorno:** Lectura y mapeo del procesador instalado, memoria física total, memoria RAM disponible y disco duro a través de scripts de auditoría del sistema operativo.
2. **Capacidad de Cómputo (CPU):** Ejecución de un algoritmo iterativo de alto estrés matemático (generación y filtrado de números primos) para evaluar la respuesta ante cargas lógicas intensas del backend.
3. **Desempeño de Entrada/Salida (Disk I/O):** Prueba de estrés de lectura y escritura síncrona de archivos temporales pesados de 50 MB con sincronización forzada al disco físico (`fsync`).

---

### 3.4. Resultados de Pruebas y Evidencias de Rendimiento

A continuación, se anexan los resultados en tiempo real y las métricas obtenidas directamente en el entorno físico de validación el día **27 de Julio de 2026**:

#### A. Especificaciones del Sistema bajo Prueba (Evidencia Técnica)
* **Nombre de Host:** REN-LT-290
* **Sistema Operativo Detectado:** Microsoft Windows 10/11 Pro (Compilación 10.0.26100)
* **Arquitectura de Hardware:** AMD64 (x64 multiprocesador libre)
* **Procesador Físico:** Intel64 Family 6 Model 126 Stepping 5, GenuineIntel (Intel Core de 10ª Generación con **4 núcleos físicos y 8 hilos de procesamiento lógicos**)
* **Memoria RAM Instalada:** 15.79 GB Totales (~16 GB)
* **Memoria RAM Disponible al Iniciar:** 2.02 GB Libres (Carga base alta en el sistema anfitrión)
* **Espacio en Disco Duro Principal:** 222.36 GB Totales (con **64.93 GB Libres** en partición principal)

#### B. Métricas del Benchmarking Ejecutado
Para comprobar la capacidad de respuesta física del procesador e infraestructura de almacenamiento, se corrió el script de estrés `hardware_validation_benchmark.py` con los siguientes hallazgos:

1. **Eficiencia de Procesamiento Lógico (CPU):**
   * **Tarea:** Cálculo matemático y filtrado de más de 1,700 números primos en rangos dinámicos.
   * **Tiempo transcurrido:** **0.0135 segundos** en promedio.
   * **Evaluación:** El procesador demuestra una excelente velocidad de ejecución por hilo para tareas de cómputo transaccional del backend FastAPI.

2. **Rendimiento del Sistema de Almacenamiento (Disk Read/Write):**
   * **Operación de Escritura (Escritura directa a disco con bloqueo fsync):** **220.06 MB/s**
   * **Operación de Lectura (Caché y lectura secuencial directa):** **1252.73 MB/s**
   * **Evaluación:** Las métricas de lectura superan 1 GB/s y las de escritura son de 220 MB/s, lo que confirma la presencia de una unidad de almacenamiento de estado sólido (SSD NVMe / SATA III). Esto garantiza un tiempo de respuesta óptimo para la carga de los 700 productos de prueba y el acceso a la base de datos MySQL de UNIMARKET.

---

### 3.5. Recomendaciones de Despliegue
* **Optimización de RAM:** Dado que la memoria RAM libre en el sistema de pruebas es de **2.02 GB**, se aconseja cerrar aplicaciones secundarias pesadas (como navegadores con múltiples pestañas abiertas) antes de iniciar los contenedores de Docker o los servicios del backend y frontend para evitar el swapping a disco.
* **Uso de Base de Datos Remota o Contenerizada:** Al desplegar en servidores locales, usar Docker-Compose permite aislar de manera eficiente los consumos de Redis y MySQL sin interferir con otros servicios locales de desarrollo (como XAMPP).

---

<div style="page-break-after: always;"></div>

## 4. Conclusiones

1. **Viabilidad del Hardware:** El hardware analizado y evaluado cumple satisfactoriamente con los requisitos mínimos e incluso con los recomendados de almacenamiento, CPU y memoria RAM. El procesador Intel de 10ª generación junto a los 16 GB de RAM instalados asegura que UNIMARKET pueda correr de manera local fluida y paralela con el backend FastAPI y el frontend de React.
2. **Capacidad de Almacenamiento Sólida:** La velocidad en disco de lectura superior a los 1,200 MB/s y escritura de 220 MB/s indica la idoneidad de la unidad SSD instalada. Esto permite operaciones de base de datos MySQL ágiles y tiempos de respuesta casi imperceptibles en la entrega de consultas estáticas.
3. **Mitigación de Cuellos de Botella:** La única métrica de atención es la memoria física disponible de 2.02 GB al momento de la prueba. Aunque es suficiente para la ejecución del servidor local en modo desarrollo, se requiere una gestión adecuada de recursos del sistema anfitrión si se planea levantar servicios adicionales o bases de datos a través de contenedores Docker.
4. **Certificación del Documento:** El presente plan valida técnicamente que el software UNIMARKET está listo para ser sometido a pruebas de calidad (QA) y despliegue final en la infraestructura del anfitrión.

---
**Elaborado y Validado por:**  
*Valery Gisel Peña Pinto*  
*Aprendiz del programa Análisis y Desarrollo de Software - SENA*  
*Fecha: 27 de Julio de 2026*
