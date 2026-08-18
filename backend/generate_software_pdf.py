# -*- coding: utf-8 -*-
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font("helvetica", "I", 8)
            self.set_text_color(128, 128, 128)
            self.cell(0, 10, "Software Instalado en la Plataforma del Cliente - UNIMARKET", align="L")
            self.ln(10)
            self.set_draw_color(200, 200, 200)
            self.line(10, 18, 200, 18)
            
    def footer(self):
        if self.page_no() > 1:
            self.set_y(-15)
            self.set_font("helvetica", "I", 8)
            self.set_text_color(128, 128, 128)
            self.cell(0, 10, f"Página {self.page_no()}", align="R")

def create_pdf():
    pdf = PDF(orientation="P", unit="mm", format="A4")
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # ----------------------------------------------------
    # PAGE 1: PORTADA
    # ----------------------------------------------------
    pdf.add_page()
    pdf.set_font("helvetica", "B", 16)
    pdf.ln(25)
    pdf.multi_cell(0, 10, "INFORME DE SOFTWARE INSTALADO EN LA\nPLATAFORMA DEL CLIENTE PARA EL SISTEMA\n(UNIMARKET)", align="C")
    
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
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "1. Introducción", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "", 11)
    intro_text = (
        "Para que la plataforma UNIMARKET se ejecute de manera correcta en el entorno del cliente, "
        "es necesario contar con un conjunto de herramientas de software base (runtimes, compiladores, "
        "gestores de dependencias y sistemas operativos compatibles). Este informe técnico recopila y "
        "valida de manera rigurosa las aplicaciones instaladas en la plataforma del cliente, certificando "
        "las versiones del entorno de ejecución y los gestores activos.\n\n"
        "La recolección de estos datos se realiza mediante comandos directos de consola sobre el sistema anfitrión. "
        "Con este inventario de software, se asegura la compatibilidad para el levantamiento del frontend, "
        "del backend y la integración con las bases de datos de UNIMARKET."
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
        "Inventariar y validar formalmente el ecosistema de software instalado en la máquina del cliente "
        "con el fin de certificar la disponibilidad y compatibilidad de las herramientas necesarias "
        "para el despliegue del proyecto UNIMARKET."
    )
    pdf.multi_cell(0, 6, obj_gen)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "Objetivos Específicos", ln=True)
    pdf.set_font("helvetica", "", 11)
    
    obj_esp1 = "* Comprobar las versiones del entorno de ejecución de Node.js y Python en el equipo local."
    obj_esp2 = "* Verificar el funcionamiento de los gestores de paquetes asociados (NPM y Pip)."
    obj_esp3 = "* Evaluar la presencia de utilidades de sistema como bases de datos MySQL/MariaDB y dependencias requeridas en el archivo requirements.txt."
    obj_esp4 = "* Documentar la configuración y el estado del entorno de software del cliente para facilitar futuras fases de mantenimiento y control de calidad."
    
    pdf.multi_cell(0, 6, obj_esp1)
    pdf.ln(2)
    pdf.multi_cell(0, 6, obj_esp2)
    pdf.ln(2)
    pdf.multi_cell(0, 6, obj_esp3)
    pdf.ln(2)
    pdf.multi_cell(0, 6, obj_esp4)
    
    # ----------------------------------------------------
    # PAGE 4: DESARROLLO / SOFTWARE INSTALADO
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "3. Software Instalado en la Plataforma del Cliente", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(3)
    
    pdf.set_font("helvetica", "", 11)
    p4_intro = (
        "Mediante la ejecución de consultas por terminal en el sistema anfitrión, se ha determinado "
        "el siguiente estado del software para soporte de desarrollo del proyecto UNIMARKET:"
    )
    pdf.multi_cell(0, 6, p4_intro)
    pdf.ln(5)
    
    # Table of installed software
    pdf.set_fill_color(230, 240, 250)
    pdf.set_font("helvetica", "B", 10)
    pdf.cell(40, 7, "Herramienta", border=1, fill=True)
    pdf.cell(30, 7, "Versión Instalada", border=1, fill=True)
    pdf.cell(45, 7, "Comando de Verificación", border=1, fill=True)
    pdf.cell(75, 7, "Rol en UNIMARKET", border=1, fill=True)
    pdf.ln()
    
    pdf.set_font("helvetica", "", 9)
    pdf.cell(40, 7, "S.O. (Windows)", border=1)
    pdf.cell(30, 7, "10/11 Pro (26100)", border=1)
    pdf.cell(45, 7, "systeminfo / Get-ComputerInfo", border=1)
    pdf.cell(75, 7, "Plataforma anfitriona y kernel base", border=1)
    pdf.ln()
    
    pdf.cell(40, 7, "Node.js runtime", border=1)
    pdf.cell(30, 7, "v26.5.0", border=1)
    pdf.cell(45, 7, "node --version", border=1)
    pdf.cell(75, 7, "Entorno de ejecución del Frontend (Vite)", border=1)
    pdf.ln()
    
    pdf.cell(40, 7, "NPM Manager", border=1)
    pdf.cell(30, 7, "11.17.0", border=1)
    pdf.cell(45, 7, "npm -v", border=1)
    pdf.cell(75, 7, "Instalador de módulos de React y Vite", border=1)
    pdf.ln()
    
    pdf.cell(40, 7, "Python Compiler", border=1)
    pdf.cell(30, 7, "v3.8.10", border=1)
    pdf.cell(45, 7, "python --version", border=1)
    pdf.cell(75, 7, "Ejecutor del Backend y scripts de réplica", border=1)
    pdf.ln()
    
    pdf.cell(40, 7, "Pip (Python Packager)", border=1)
    pdf.cell(30, 7, "21.1.1", border=1)
    pdf.cell(45, 7, "pip --version", border=1)
    pdf.cell(75, 7, "Instalador de FastAPI, SQLAlchemy y FastAPI deps", border=1)
    pdf.ln()
    
    pdf.cell(40, 7, "MySQL Database", border=1)
    pdf.cell(30, 7, "8.0 / MariaDB*", border=1)
    pdf.cell(45, 7, "netstat / XAMPP Panel", border=1)
    pdf.cell(75, 7, "Motor transaccional principal de la app", border=1)
    pdf.ln()
    
    pdf.ln(5)
    pdf.set_font("helvetica", "I", 9)
    pdf.cell(0, 5, "*Nota: XAMPP se encuentra configurado para proveer el servicio de base de datos MySQL en el puerto 3306.", ln=True)
    
    # ----------------------------------------------------
    # PAGE 5: CONCLUSIÓN Y FIRMA
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "4. Conclusión", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "", 11)
    conclusions = (
        "1. Compatibilidad de Herramientas: La plataforma del cliente posee las herramientas principales (Node.js "
        "y Python) actualizadas en versiones compatibles para soportar el flujo de compilación y ejecución de la aplicación.\n\n"
        "2. Soporte de Paquetes: Los administradores de dependencias NPM (v11.17.0) y Pip (v21.1.1) están disponibles de "
        "manera nativa, lo que permite resolver sin problemas los requerimientos del frontend y backend.\n\n"
        "3. Entorno de Base de Datos: La existencia de XAMPP / MySQL en el puerto 3306 cumple con la pre-condición del script "
        "de bases de datos `setup_full_db.py` para la migración y poblamiento con 700 productos de prueba.\n\n"
        "4. Certificación de Preparación: El equipo se encuentra configurado a nivel de software con las dependencias base, "
        "concluyéndose que la plataforma del cliente está lista para iniciar los procesos de integración y pruebas del software UNIMARKET."
    )
    pdf.multi_cell(0, 6, conclusions)
    
    pdf.ln(35)
    pdf.set_font("helvetica", "B", 11)
    pdf.cell(0, 6, "Elaborado y Validado por:", ln=True)
    pdf.set_font("helvetica", "", 11)
    pdf.cell(0, 6, "Valery Gisel Peña Pinto", ln=True)
    pdf.cell(0, 6, "Aprendiz del programa Análisis y Desarrollo de Software - SENA", ln=True)
    pdf.cell(0, 6, "Fecha: 27 de Julio de 2026", ln=True)
    
    pdf.output("Software_Instalado_Cliente.pdf")
    print("PDF creado con éxito: Software_Instalado_Cliente.pdf")

if __name__ == "__main__":
    create_pdf()
