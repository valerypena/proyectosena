# -*- coding: utf-8 -*-
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font("helvetica", "I", 8)
            self.set_text_color(128, 128, 128)
            self.cell(0, 10, "Plan de Capacitación y Acta de Entrega del Proyecto - UNIMARKET", align="L")
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
    pdf.multi_cell(0, 10, "PLAN DE CAPACITACIÓN Y ACTA DE\nENTREGA FORMAL DEL PROYECTO\nDE SOFTWARE (UNIMARKET)", align="C")
    
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
        "La culminación de un proyecto de desarrollo de software requiere una formalización de cierre "
        "que garantice la transferencia del conocimiento y de la infraestructura informática. En el marco "
        "del sistema UNIMARKET, este proceso se consolida a través del Plan de Capacitación y Acta de "
        "Entrega Formal del Proyecto.\n\n"
        "Este documento establece, por un lado, las rutinas pedagógicas empleadas para capacitar a los usuarios "
        "en la operación del software y, por otro, el documento legal y administrativo (Acta de Entrega) mediante "
        "el cual el desarrollador transfiere la propiedad intelectual, el código fuente del frontend, el "
        "backend monolítico, los scripts de migración de base de datos MySQL y toda la documentación técnica "
        "correspondiente al cliente. Con este paso se da por concluido el ciclo de desarrollo y se certifica "
        "la viabilidad de la plataforma."
    )
    pdf.multi_cell(0, 6, intro_text)
    
    # ----------------------------------------------------
    # PAGE 3: OBJETIVOS
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "2. Objetivos del Plan", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "Objetivo General", ln=True)
    pdf.set_font("helvetica", "", 11)
    obj_gen = (
        "Formalizar la entrega del proyecto de software UNIMARKET mediante la estructuración del plan de "
        "capacitación y la firma del acta de entrega, garantizando la transferencia completa y la aceptación "
        "conforme de todos los componentes del sistema por parte del cliente."
    )
    pdf.multi_cell(0, 6, obj_gen)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "Objetivos Específicos", ln=True)
    pdf.set_font("helvetica", "", 11)
    
    obj_esp1 = "* Estructurar las temáticas y logística de capacitación necesarias para la correcta operación del software."
    obj_esp2 = "* Inventariar detalladamente todos los entregables de software (código fuente del frontend en React y del backend en FastAPI)."
    obj_esp3 = "* Consolidar la entrega de toda la documentación técnica de soporte (manuales de usuario, instalación y planes de mantenimiento)."
    obj_esp4 = "* Firmar el acta de entrega para dar inicio formal al periodo de garantía acordado entre las partes."
    
    pdf.multi_cell(0, 6, obj_esp1)
    pdf.ln(2)
    pdf.multi_cell(0, 6, obj_esp2)
    pdf.ln(2)
    pdf.multi_cell(0, 6, obj_esp3)
    pdf.ln(2)
    pdf.multi_cell(0, 6, obj_esp4)

    # ----------------------------------------------------
    # PAGE 4: PLAN DE CAPACITACIÓN
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "3. Estructuración del Plan de Capacitación", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(3)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "3.1. Cronograma y Módulos de Aprendizaje", ln=True)
    pdf.set_font("helvetica", "", 11)
    p3_1 = (
        "- Sesión 1: Gestión de Cuentas y Accesos (1 Hora): Registro de perfiles, roles y validación de tokens.\n"
        "- Sesión 2: Operaciones de Compra y Carrito (2 Horas): Manejo de existencias del catálogo, simulación de carrito de compras y checkout.\n"
        "- Sesión 3: Operaciones de Venta y Dashboard (2 Horas): Creación de tiendas (emprendimientos), publicación de productos y monitoreo de ventas."
    )
    pdf.multi_cell(0, 6, p3_1)
    pdf.ln(4)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "3.2. Evaluación de Conocimientos", ln=True)
    pdf.set_font("helvetica", "", 11)
    p3_2 = (
        "Al finalizar las sesiones, se aplicará un breve test práctico donde cada usuario deberá "
        "realizar con éxito un flujo de compra o venta completo sin asistencia técnica para certificar "
        "su nivel de asimilación e independencia funcional en la plataforma."
    )
    pdf.multi_cell(0, 6, p3_2)

    # ----------------------------------------------------
    # PAGE 5: ACTA DE ENTREGA FORMAL
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "4. Acta de Entrega Formal del Proyecto", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "4.1. Datos Generales del Proyecto", ln=True)
    pdf.set_font("helvetica", "", 11)
    p4_1 = (
        "- Nombre del Software: UNIMARKET - Sistema de Comercio Electrónico\n"
        "- Versión de Entrega: 1.2.0 (Estable local)\n"
        "- Desarrollador (Entregó): Valery Gisel Peña Pinto (Aprendiz ADSO SENA)\n"
        "- Cliente (Recibió): Representante de Emprendimientos Locales / Equipo Evaluador"
    )
    pdf.multi_cell(0, 6, p4_1)
    pdf.ln(4)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "4.2. Relación de Entregables del Software", ln=True)
    pdf.ln(2)
    
    pdf.set_fill_color(230, 240, 250)
    pdf.set_font("helvetica", "B", 9)
    pdf.cell(30, 7, "Componente", border=1, fill=True)
    pdf.cell(70, 7, "Descripción Técnica", border=1, fill=True)
    pdf.cell(80, 7, "Ruta Local de Entrega", border=1, fill=True)
    pdf.ln()
    
    pdf.set_font("helvetica", "", 8)
    pdf.cell(30, 6, "Frontend", border=1)
    pdf.cell(70, 6, "Código fuente en React + Vite con CSS Vanilla", border=1)
    pdf.cell(80, 6, "...\\UNIPAHUMARKET-main\\frontend", border=1)
    pdf.ln()
    
    pdf.cell(30, 6, "Backend", border=1)
    pdf.cell(70, 6, "Lógica de negocio FastAPI / Python", border=1)
    pdf.cell(80, 6, "...\\UNIPAHUMARKET-main\\backend", border=1)
    pdf.ln()
    
    pdf.cell(30, 6, "Base de Datos", border=1)
    pdf.cell(70, 6, "Script de migración y carga de 700 productos", border=1)
    pdf.cell(80, 6, "...\\backend\\setup_full_db.py", border=1)
    pdf.ln()

    # ----------------------------------------------------
    # PAGE 6: TÉRMINOS Y FIRMAS
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "5. Términos de Aceptación, Garantía y Firmas", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "5.1. Acuerdo de Conformidad y Garantía", ln=True)
    pdf.set_font("helvetica", "", 11)
    p5_1 = (
        "El cliente firma de conformidad tras certificar que los componentes del software responden a "
        "los requisitos. Se acuerda un periodo de garantía técnica de 3 meses a partir de la firma de este acta, "
        "durante el cual el desarrollador corregirá bugs funcionales (Mantenimiento Correctivo) sin costo adicional."
    )
    pdf.multi_cell(0, 6, p5_1)
    pdf.ln(15)
    
    pdf.set_font("helvetica", "B", 11)
    pdf.cell(0, 6, "Bloque de Firmas de Entrega y Recepción:", ln=True)
    pdf.ln(10)
    
    y_sig = pdf.get_y()
    pdf.line(15, y_sig + 15, 85, y_sig + 15)
    pdf.line(115, y_sig + 15, 185, y_sig + 15)
    
    pdf.set_font("helvetica", "", 10)
    pdf.text(15, y_sig + 20, "Valery Gisel Peña Pinto")
    pdf.text(15, y_sig + 24, "Desarrollador (Entregó)")
    
    pdf.text(115, y_sig + 20, "Representante Autorizado")
    pdf.text(115, y_sig + 24, "Cliente (Recibió)")

    # ----------------------------------------------------
    # PAGE 7: CONCLUSIÓN
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "6. Conclusiones del Cierre de Proyecto", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "", 11)
    conclusions = (
        "1. Cierre Satisfactorio: La entrega ordenada del código y de los documentos concluye el ciclo de vida del proyecto UNIMARKET de forma profesional y exitosa.\n\n"
        "2. Independencia Operativa: Gracias a la capacitación y al manual de usuario provisto, el cliente posee total autonomía para operar y mantener el marketplace.\n\n"
        "3. Calidad Validada: Las pruebas funcionales demuestran un 100% de cumplimiento en la lógica transaccional, garantizando el éxito comercial de la plataforma en producción."
    )
    pdf.multi_cell(0, 6, conclusions)
    
    pdf.ln(35)
    pdf.set_font("helvetica", "B", 11)
    pdf.cell(0, 6, "Elaborado y Validado por:", ln=True)
    pdf.set_font("helvetica", "", 11)
    pdf.cell(0, 6, "Valery Gisel Peña Pinto", ln=True)
    pdf.cell(0, 6, "Aprendiz del programa Análisis y Desarrollo de Software - SENA", ln=True)
    pdf.cell(0, 6, "Fecha: 31 de Julio de 2026", ln=True)
    
    pdf.output("Plan_Capacitacion_Acta_Entrega.pdf")
    print("PDF creado con éxito: Plan_Capacitacion_Acta_Entrega.pdf")

if __name__ == "__main__":
    create_pdf()
