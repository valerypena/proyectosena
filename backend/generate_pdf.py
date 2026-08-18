# -*- coding: utf-8 -*-
from fpdf import FPDF
import sys

class PDF(FPDF):
    def header(self):
        # We don't want headers on the cover page (page 1)
        if self.page_no() > 1:
            self.set_font("helvetica", "I", 8)
            self.set_text_color(128, 128, 128)
            self.cell(0, 10, "Plan de Validación de Hardware - UNIMARKET", align="L")
            self.ln(10)
            self.set_draw_color(200, 200, 200)
            self.line(10, 18, 200, 18)
            
    def footer(self):
        if self.page_no() > 1:
            self.set_y(-15)
            self.set_font("helvetica", "I", 8)
            self.set_text_color(128, 128, 128)
            # Page number
            self.cell(0, 10, f"Página {self.page_no()}", align="R")

def create_pdf():
    pdf = PDF(orientation="P", unit="mm", format="A4")
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # ----------------------------------------------------
    # PAGE 1: PORTADA
    # ----------------------------------------------------
    pdf.add_page()
    
    # Title / Title Page Layout
    pdf.set_font("helvetica", "B", 16)
    pdf.ln(25)
    pdf.multi_cell(0, 10, "PLAN DE VALIDACIÓN DE CARACTERÍSTICAS MÍNIMAS\nDE HARDWARE PARA EL SOFTWARE\n(UNIMARKET)", align="C")
    
    pdf.ln(40)
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 7, "PRESENTADO POR:", align="C")
    pdf.ln(7)
    pdf.set_font("helvetica", "", 12)
    pdf.cell(0, 7, "VALERY GISEL PEÑA PINTO", align="C")
    
    pdf.ln(25)
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 7, "INSTRUCTOR(A):", align="C")
    pdf.ln(7)
    pdf.set_font("helvetica", "", 12)
    pdf.cell(0, 7, "EQUIPO EVALUADOR DE ANÁLISIS Y DESARROLLO DE SOFTWARE", align="C")
    
    pdf.ln(35)
    pdf.set_font("helvetica", "B", 10)
    pdf.cell(0, 6, "SERVICIO NACIONAL DE APRENDIZAJE (SENA)", align="C")
    pdf.ln(6)
    pdf.cell(0, 6, "CENTRO NACIONAL DE HOTELERIA, TURISMO Y ALIMENTOS", align="C")
    pdf.ln(6)
    pdf.cell(0, 6, "ANÁLISIS Y DESARROLLO DE SOFTWARE (#2977475)", align="C")
    pdf.ln(6)
    pdf.cell(0, 6, "BOGOTA DC", align="C")
    pdf.ln(6)
    pdf.cell(0, 6, "2026", align="C")
    
    # ----------------------------------------------------
    # PAGE 2: INTRODUCCIÓN
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118) # Elegant dark blue
    pdf.cell(0, 10, "1. Introducción", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "", 11)
    intro_text = (
        "El éxito del despliegue y operatividad de cualquier aplicación de software comercial o "
        "empresarial reside no solo en el correcto desarrollo de su código base, sino también en "
        "garantizar que el entorno físico o virtual donde se hospeda cumpla con las especificaciones "
        "técnicas adecuadas. Para la plataforma UNIMARKET, un sistema robusto de comercio "
        "electrónico multitienda (Marketplace) inspirado en líderes de la industria como Mercado Libre, "
        "es imperativo establecer con precisión los límites de hardware requeridos para su correcta ejecución.\n\n"
        "Este documento detalla el Plan de Validación de Características Mínimas de Hardware para "
        "UNIMARKET. A través de este plan, se evalúan y miden los recursos críticos del sistema como la "
        "capacidad de procesamiento (CPU), el consumo de memoria volátil (RAM), la velocidad y espacio "
        "de almacenamiento en disco, y la latencia de red. El objetivo final es proveer un marco técnico "
        "claro que certifique el rendimiento de la aplicación en entornos de desarrollo y producción bajo "
        "los estándares institucionales requeridos."
    )
    pdf.multi_cell(0, 6, intro_text)
    
    # ----------------------------------------------------
    # PAGE 3: OBJETIVOS
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "2. Objetivos", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "Objetivo General", ln=True)
    pdf.set_font("helvetica", "", 11)
    obj_gen = (
        "Elaborar y ejecutar un plan formal para validar, certificar y documentar los requerimientos "
        "mínimos y recomendados de hardware para el correcto funcionamiento del software UNIMARKET, "
        "asegurando un rendimiento estable, seguro y escalable."
    )
    pdf.multi_cell(0, 6, obj_gen)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "Objetivos Específicos", ln=True)
    pdf.set_font("helvetica", "", 11)
    
    obj_esp1 = "* Identificar la arquitectura técnica de UNIMARKET y el impacto en recursos de hardware de cada uno de sus componentes (Frontend, Backend, Bases de Datos, Caché y Orquestadores)."
    obj_esp2 = "* Definir los perfiles mínimos y recomendados de hardware necesarios para escenarios de desarrollo local y de despliegue en servidores de producción."
    obj_esp3 = "* Ejecutar pruebas reales de rendimiento (Benchmarks) en el sistema físico actual para recopilar evidencias métricas del consumo de CPU, RAM y velocidad de lectura/escritura en disco."
    obj_esp4 = "* Analizar los datos recopilados y proponer recomendaciones técnicas de optimización y escalabilidad del hardware para evitar cuellos de botella informáticos."
    
    pdf.multi_cell(0, 6, obj_esp1)
    pdf.ln(2)
    pdf.multi_cell(0, 6, obj_esp2)
    pdf.ln(2)
    pdf.multi_cell(0, 6, obj_esp3)
    pdf.ln(2)
    pdf.multi_cell(0, 6, obj_esp4)
    
    # ----------------------------------------------------
    # PAGE 4: DOCUMENTO / PLAN DE VALIDACIÓN
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "3. Plan de Validación de Hardware", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(3)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "3.1. Arquitectura y Componentes del Software", ln=True)
    pdf.set_font("helvetica", "", 11)
    arch_text = (
        "El sistema UNIMARKET está diseñado como una aplicación Full-Stack con la siguiente arquitectura tecnológica:\n"
        "- Frontend: Desarrollado sobre React y Vite, utilizando CSS Vanilla para una carga ultra rápida.\n"
        "- Backend: Lógica transaccional REST construida sobre FastAPI (Python 3.10+) y orquestada con Uvicorn.\n"
        "- Base de Datos Principal: MySQL 8.0, encargada de la persistencia de datos relacionales.\n"
        "- Caché y Sesiones: Redis 7 para acelerar la entrega de consultas y control de sesiones."
    )
    pdf.multi_cell(0, 6, arch_text)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "3.2. Definición de Requisitos de Hardware", ln=True)
    pdf.set_font("helvetica", "", 10)
    
    # Tables for hardware specs
    pdf.set_font("helvetica", "B", 10)
    pdf.cell(0, 6, "Requisitos para Entorno de Desarrollo Local:", ln=True)
    pdf.set_font("helvetica", "", 10)
    
    # Table header
    pdf.set_fill_color(230, 240, 250)
    pdf.cell(45, 7, "Componente", border=1, fill=True)
    pdf.cell(70, 7, "Mínimo", border=1, fill=True)
    pdf.cell(75, 7, "Recomendado", border=1, fill=True)
    pdf.ln()
    
    pdf.cell(45, 7, "Procesador (CPU)", border=1)
    pdf.cell(70, 7, "Intel Core i3 / AMD Ryzen 3 (4 cores)", border=1)
    pdf.cell(75, 7, "Intel Core i5/i7 / AMD Ryzen 5/7 (6-8 cores)", border=1)
    pdf.ln()
    pdf.cell(45, 7, "Memoria RAM", border=1)
    pdf.cell(70, 7, "8 GB DDR4", border=1)
    pdf.cell(75, 7, "16 GB DDR4 o superior", border=1)
    pdf.ln()
    pdf.cell(45, 7, "Almacenamiento", border=1)
    pdf.cell(70, 7, "10 GB libres (HDD)", border=1)
    pdf.cell(75, 7, "20 GB libres (SSD NVMe)", border=1)
    pdf.ln()
    pdf.cell(45, 7, "S.O.", border=1)
    pdf.cell(70, 7, "Windows 10, macOS, Linux (Ubuntu 20+)", border=1)
    pdf.cell(75, 7, "Windows 11 o Linux Ubuntu 22.04 LTS", border=1)
    pdf.ln()
    
    pdf.ln(5)
    pdf.set_font("helvetica", "B", 10)
    pdf.cell(0, 6, "Requisitos para Servidor de Producción (Base: 1,000 users):", ln=True)
    pdf.set_font("helvetica", "", 10)
    
    # Table 2
    pdf.cell(45, 7, "Componente", border=1, fill=True)
    pdf.cell(70, 7, "Mínimo", border=1, fill=True)
    pdf.cell(75, 7, "Recomendado", border=1, fill=True)
    pdf.ln()
    pdf.cell(45, 7, "Instancia/vCPU", border=1)
    pdf.cell(70, 7, "Cloud VPS - 2 vCPUs dedicadas", border=1)
    pdf.cell(75, 7, "Instancias Cloud con Balanceador (4 vCPUs+)", border=1)
    pdf.ln()
    pdf.cell(45, 7, "Memoria RAM", border=1)
    pdf.cell(70, 7, "4 GB dedicados para API y BD", border=1)
    pdf.cell(75, 7, "8 GB a 16 GB dedicados", border=1)
    pdf.ln()
    pdf.cell(45, 7, "Almacenamiento", border=1)
    pdf.cell(70, 7, "SSD SATA 40 GB (150 MB/s)", border=1)
    pdf.cell(75, 7, "SSD NVMe 80 GB+ (500+ MB/s)", border=1)
    pdf.ln()
    
    # ----------------------------------------------------
    # PAGE 5: PRUEBAS Y EVIDENCIAS
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "3.3. Metodología de Validación y Pruebas", ln=True)
    pdf.set_font("helvetica", "", 11)
    meto_text = (
        "Para validar que el equipo anfitrión es apto para ejecutar el ecosistema de UNIMARKET, "
        "se diseñó una metodología de pruebas automatizadas que mide la velocidad de cómputo y lectura/escritura "
        "de disco duro usando llamadas síncronas directas al kernel."
    )
    pdf.multi_cell(0, 6, meto_text)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "3.4. Resultados de Pruebas y Evidencias de Rendimiento (REN-LT-290)", ln=True)
    pdf.set_font("helvetica", "", 10)
    
    # Host Specs details
    pdf.set_fill_color(245, 245, 245)
    specs_box = (
        "ESPECIFICACIONES DETECTADAS EN EL EQUIPO ANFITRIÓN:\n"
        "- Host: REN-LT-290\n"
        "- Sistema Operativo: Microsoft Windows 10/11 Pro (10.0.26100)\n"
        "- Arquitectura: AMD64 (x64 multiprocessor)\n"
        "- Procesador: Intel64 Family 6 Model 126 Stepping 5 (GenuineIntel Intel Core i5/i7 10th Gen)\n"
        "- Núcleos CPU: 4 núcleos físicos / 8 lógicos\n"
        "- Memoria RAM Total: 15.79 GB\n"
        "- RAM Disponible: 2.02 GB (Carga de trabajo concurrente alta)\n"
        "- Almacenamiento Libre: 64.93 GB libres de 222.36 GB totales"
    )
    pdf.multi_cell(0, 5, specs_box, border=1, fill=True)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 11)
    pdf.cell(0, 6, "Métricas del Benchmarking Físico Ejecutado:", ln=True)
    pdf.set_font("helvetica", "", 11)
    
    bench_text = (
        "1. Rendimiento de Cómputo (CPU):\n"
        "   - Tarea: Cálculo y filtro matemático de números primos.\n"
        "   - Resultado: 1,754 números primos filtrados y verificados en 0.0135 segundos.\n"
        "   - Evaluación: Procesamiento rápido por hilo, ideal para microservicios del Backend.\n\n"
        "2. Rendimiento de Entrada/Salida (Disco SSD):\n"
        "   - Operación de Escritura Física (fsync): 220.06 MB/s\n"
        "   - Operación de Lectura Secuencial: 1,252.73 MB/s\n"
        "   - Evaluación: El almacenamiento de estado sólido (SSD NVMe) asegura lecturas e inserciones de base de datos MySQL con latencia mínima."
    )
    pdf.multi_cell(0, 6, bench_text)
    
    # ----------------------------------------------------
    # PAGE 6: CONCLUSIÓN Y FIRMA
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "4. Conclusiones", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "", 11)
    conclusions = (
        "1. Viabilidad del Hardware: El equipo evaluado excede con solvencia las características mínimas e incluso "
        "cumple con las recomendadas. La combinación de un procesador Intel Core de 10.ª generación y 16 GB de RAM "
        "garantiza el levantamiento de toda la infraestructura (FastAPI, React, MySQL, Redis) sin degradar la experiencia.\n\n"
        "2. Capacidad de Disco: La velocidad de lectura secuencial superior a 1,200 MB/s garantiza una carga del catálogo "
        "e inventario (700 productos de prueba) inmediata, minimizando cuellos de botella por acceso a almacenamiento.\n\n"
        "3. Recomendación de Control de Memoria: Debido a que al momento de la prueba la memoria física libre es de 2.02 GB, "
        "se recomienda cerrar procesos de fondo no indispensables al momento de compilar con Vite o correr scripts pesados de seed en la base de datos.\n\n"
        "4. Certificación Técnica: Este plan de validación demuestra y certifica que los requerimientos de hardware "
        "para el software UNIMARKET están completamente cubiertos en este entorno."
    )
    pdf.multi_cell(0, 6, conclusions)
    
    pdf.ln(35)
    pdf.set_font("helvetica", "B", 11)
    pdf.cell(0, 6, "Elaborado y Validado por:", ln=True)
    pdf.set_font("helvetica", "", 11)
    pdf.cell(0, 6, "Valery Gisel Peña Pinto", ln=True)
    pdf.cell(0, 6, "Aprendiz del programa Análisis y Desarrollo de Software - SENA", ln=True)
    pdf.cell(0, 6, "Fecha: 27 de Julio de 2026", ln=True)
    
    pdf.output("Plan_Validacion_Hardware.pdf")
    print("PDF creado con éxito: Plan_Validacion_Hardware.pdf")

if __name__ == "__main__":
    create_pdf()
