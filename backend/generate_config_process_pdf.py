# -*- coding: utf-8 -*-
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font("helvetica", "I", 8)
            self.set_text_color(128, 128, 128)
            self.cell(0, 10, "Configuración de Servicios, Bases de Datos y Software - UNIMARKET", align="L")
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
    pdf.ln(20)
    pdf.multi_cell(0, 10, "DOCUMENTO DE CONFIGURACIÓN DE SERVICIOS,\nBASES DE DATOS Y SOFTWARE EN EL EQUIPO\nDEL CLIENTE (UNIMARKET)", align="C")
    
    pdf.ln(35)
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 7, "PRESENTADO POR:", align="C")
    pdf.ln(7)
    pdf.set_font("helvetica", "", 12)
    pdf.cell(0, 7, "VALERY GISEL PEÑA PINTO", align="C")
    
    pdf.ln(20)
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 7, "INSTRUCTOR(A):", align="C")
    pdf.ln(7)
    pdf.set_font("helvetica", "", 12)
    pdf.cell(0, 7, "EQUIPO EVALUADOR DE ANÁLISIS Y DESARROLLO DE SOFTWARE", align="C")
    
    pdf.ln(30)
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
        "El presente documento técnico detalla las actividades, comandos y configuraciones "
        "realizadas para llevar a cabo la instalación, inicialización y despliegue del sistema "
        "UNIMARKET en la plataforma y equipo del cliente.\n\n"
        "El proceso abarca desde el aprovisionamiento de un entorno de ejecución de Python aislado, "
        "la instalación de dependencias requeridas mediante gestores de paquetes, la creación y "
        "población masiva de la base de datos relacional MySQL en el servidor local XAMPP (poblándola "
        "con 700 productos reales divididos en 14 categorías), hasta la puesta en marcha síncrona "
        "del backend y frontend de desarrollo. Toda la actividad queda documentada con las salidas "
        "y logs del sistema para certificar el éxito del aprovisionamiento."
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
        "Documentar y certificar la correcta configuración, instalación de software base, y "
        "despliegue operativo del backend, frontend y base de datos de la plataforma UNIMARKET "
        "en el equipo local del cliente."
    )
    pdf.multi_cell(0, 6, obj_gen)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "Objetivos Específicos", ln=True)
    pdf.set_font("helvetica", "", 11)
    
    obj_esp1 = "* Establecer un entorno de ejecución limpio y aislado mediante la creación de un entorno virtual de Python (my_venv)."
    obj_esp2 = "* Instalar todas las librerías necesarias del lado del servidor especificadas en el archivo de requerimientos de la aplicación."
    obj_esp3 = "* Inicializar el esquema relacional en MySQL y automatizar la inserción de datos de prueba estructurados (categorías, vendedores y productos)."
    obj_esp4 = "* Verificar mediante pruebas de carga y acceso que el frontend se comunique correctamente con la API local."
    
    pdf.multi_cell(0, 6, obj_esp1)
    pdf.ln(2)
    pdf.multi_cell(0, 6, obj_esp2)
    pdf.ln(2)
    pdf.multi_cell(0, 6, obj_esp3)
    pdf.ln(2)
    pdf.multi_cell(0, 6, obj_esp4)

    # ----------------------------------------------------
    # PAGE 4: PROCESO PASO A PASO
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "3. Proceso de Configuración e Instalación", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(3)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "3.1. Preparación del Entorno Virtual (Python)", ln=True)
    pdf.set_font("helvetica", "", 11)
    p3_1 = (
        "Se creó un entorno virtual aislado (my_venv) en la raíz del proyecto para evitar "
        "conflictos entre dependencias globales del sistema:\n"
        "Comando: python -m venv my_venv"
    )
    pdf.multi_cell(0, 6, p3_1)
    pdf.ln(4)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "3.2. Instalación de Dependencias", ln=True)
    pdf.set_font("helvetica", "", 11)
    p3_2 = (
        "Se instalaron las librerías necesarias del backend (FastAPI, Uvicorn, SQLAlchemy) usando pip:\n"
        "Comando: .\\my_venv\\Scripts\\python -m pip install -r backend/requirements.txt"
    )
    pdf.multi_cell(0, 6, p3_2)
    pdf.ln(4)

    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "3.3. Configuración y Poblado de MySQL", ln=True)
    pdf.set_font("helvetica", "", 11)
    p3_3 = (
        "Se activó MySQL en XAMPP (puerto 3306) y se corrió el script de poblado masivo:\n"
        "Comando: .\\my_venv\\Scripts\\python backend/setup_full_db.py\n"
        "Log: Recreada base de datos unimarket, insertadas 14 categorías, 20 vendedores y 700 productos de prueba."
    )
    pdf.multi_cell(0, 6, p3_3)

    # ----------------------------------------------------
    # PAGE 5: EJECUCIÓN Y CONCLUSIONES
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "4. Ejecución del Sistema y Conclusiones", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(3)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "4.1. Lanzamiento de Servicios", ln=True)
    pdf.set_font("helvetica", "", 11)
    p4_1 = (
        "- Backend (Uvicorn): .\\my_venv\\Scripts\\python -m uvicorn main:app --reload --app-dir ./backend\n"
        "- Frontend (Vite): npm run dev (dentro de la carpeta /frontend)"
    )
    pdf.multi_cell(0, 6, p4_1)
    pdf.ln(4)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "4.2. Conclusiones del Proceso", ln=True)
    pdf.set_font("helvetica", "", 11)
    conclusions = (
        "1. El aprovisionamiento mediante entorno virtual (my_venv) fue totalmente exitoso.\n"
        "2. El esquema de datos de MySQL se pobló de manera consistente con 700 productos reales.\n"
        "3. La comunicación local frontend-backend a través de los puertos asignados funciona sin errores."
    )
    pdf.multi_cell(0, 6, conclusions)
    
    pdf.ln(25)
    pdf.set_font("helvetica", "B", 11)
    pdf.cell(0, 6, "Elaborado y Validado por:", ln=True)
    pdf.set_font("helvetica", "", 11)
    pdf.cell(0, 6, "Valery Gisel Peña Pinto", ln=True)
    pdf.cell(0, 6, "Aprendiz del programa Análisis y Desarrollo de Software - SENA", ln=True)
    pdf.cell(0, 6, "Fecha: 30 de Julio de 2026", ln=True)
    
    pdf.output("Configuracion_Servicios_BasesDatos_Software.pdf")
    print("PDF creado con éxito: Configuracion_Servicios_BasesDatos_Software.pdf")

if __name__ == "__main__":
    create_pdf()
