# -*- coding: utf-8 -*-
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font("helvetica", "I", 8)
            self.set_text_color(128, 128, 128)
            self.cell(0, 10, "Plan de Capacitación y Pruebas de Aceptación del Cliente - UNIMARKET", align="L")
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
    pdf.multi_cell(0, 10, "PLAN DE CAPACITACIÓN Y REALIZACIÓN\nDE PRUEBAS DE ACEPTACIÓN\nDEL CLIENTE (UNIMARKET)", align="C")
    
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
        "La entrega formal de un producto de software no se limita a la escritura del código ni a las "
        "pruebas internas de los desarrolladores; requiere asegurar que los usuarios finales sepan operar "
        "el sistema de manera eficiente y que el cliente valide formalmente que el software cumple con los "
        "requerimientos pactados. Para el sistema UNIMARKET, se ha diseñado el presente Plan de Capacitación "
        "y Realización de Pruebas de Aceptación del Cliente.\n\n"
        "Este plan establece una estrategia didáctica ordenada para adiestrar a los tres perfiles clave de "
        "usuarios (compradores, vendedores y soporte administrativo) en el uso de los microservicios e "
        "interfaces comerciales. Asimismo, define el protocolo técnico de Pruebas de Aceptación de Usuario (UAT), "
        "mediante el cual el cliente evalúa y certifica la conformidad del software bajo criterios de usabilidad, "
        "seguridad y tiempos de respuesta antes del despliegue final en producción."
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
        "Diseñar y estructurar el plan de capacitación técnica de usuarios y el protocolo de pruebas de "
        "aceptación (UAT) para garantizar que los usuarios comprendan el funcionamiento de la plataforma "
        "UNIMARKET y que el cliente valide formalmente la entrega del software."
    )
    pdf.multi_cell(0, 6, obj_gen)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "Objetivos Específicos", ln=True)
    pdf.set_font("helvetica", "", 11)
    
    obj_esp1 = "* Estructurar los módulos de capacitación orientados a compradores, vendedores y administradores técnicos."
    obj_esp2 = "* Establecer la metodología de enseñanza didáctica incluyendo guías visuales y simulaciones prácticas."
    obj_esp3 = "* Definir los criterios de aceptación funcionales y no funcionales para guiar las pruebas UAT por parte del cliente."
    obj_esp4 = "* Crear el instrumento de evaluación formal (lista de chequeo y acta de aceptación) para documentar el cierre."
    
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
    pdf.cell(0, 10, "3. Plan de Capacitación de Usuarios", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(3)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "3.1. Población Objetivo (Perfiles a Capacitar)", ln=True)
    pdf.set_font("helvetica", "", 11)
    p3_1 = (
        "1. Compradores Finales: Foco en registro, carrito y pago.\n"
        "2. Vendedores (Emprendedores): Foco en marcas, catálogo y control de ventas.\n"
        "3. Mesa de Soporte: Foco en base de datos, APIs y reinicio de microservicios."
    )
    pdf.multi_cell(0, 6, p3_1)
    pdf.ln(4)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "3.2. Contenido Temático e Instrumentos", ln=True)
    pdf.set_font("helvetica", "", 11)
    p3_2 = (
        "- Módulo Acceso y Autenticación (1h)\n"
        "- Módulo Operación de Compra (2h)\n"
        "- Módulo Administración de Tienda (3h)\n"
        "Metodología interactiva práctica directa sobre localhost:5173/ y manuales visuales."
    )
    pdf.multi_cell(0, 6, p3_2)

    # ----------------------------------------------------
    # PAGE 5: PRUEBAS DE ACEPTACIÓN (UAT)
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "4. Pruebas de Aceptación del Cliente (UAT)", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "4.1. Alcance UAT", ln=True)
    pdf.set_font("helvetica", "", 11)
    p4_1 = (
        "Ejecución de flujos de negocio completos por parte del cliente sobre la interfaz web, "
        "validando que los requisitos sean satisfactorios antes de desplegar en producción."
    )
    pdf.multi_cell(0, 6, p4_1)
    pdf.ln(4)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "4.2. Criterios de Aceptación", ln=True)
    pdf.ln(2)
    
    pdf.set_fill_color(230, 240, 250)
    pdf.set_font("helvetica", "B", 9)
    pdf.cell(40, 7, "Criterio", border=1, fill=True)
    pdf.cell(90, 7, "Criterio de Aceptación", border=1, fill=True)
    pdf.cell(50, 7, "Mínimo Aprobación", border=1, fill=True)
    pdf.ln()
    
    pdf.set_font("helvetica", "", 9)
    pdf.cell(40, 7, "Funcional", border=1)
    pdf.cell(90, 7, "Proceso de checkout y facturación sin errores", border=1)
    pdf.cell(50, 7, "100% de éxito", border=1)
    pdf.ln()
    
    pdf.cell(40, 7, "Rendimiento", border=1)
    pdf.cell(90, 7, "Latencia en caliente del catálogo de productos", border=1)
    pdf.cell(50, 7, "Menor a 100 ms", border=1)
    pdf.ln()
    
    pdf.cell(40, 7, "Seguridad", border=1)
    pdf.cell(90, 7, "Cifrado completo de credenciales en base de datos", border=1)
    pdf.cell(50, 7, "100% cifrado con bcrypt", border=1)
    pdf.ln()

    # ----------------------------------------------------
    # PAGE 6: EVALUACIÓN UAT
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "5. Protocolo e Instrumento de Evaluación UAT", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "5.1. Formulario de Evaluación del Cliente (1 al 5)", ln=True)
    pdf.set_font("helvetica", "", 11)
    p5_1 = (
        "1. Usabilidad: La interfaz es intuitiva y fácil de usar. [   ]\n"
        "2. Rendimiento: La carga de productos y velocidad es adecuada. [   ]\n"
        "3. Funcionalidad: Se completan las compras sin errores. [   ]\n"
        "4. Panel de Vendedores: Es cómodo registrarse y añadir inventario. [   ]"
    )
    pdf.multi_cell(0, 6, p5_1)
    pdf.ln(4)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "5.2. Acta de Aceptación Final", ln=True)
    pdf.set_font("helvetica", "", 11)
    p5_2 = (
        "Por medio de la firma de este documento, el cliente aprueba los entregables y "
        "certifica la viabilidad técnica para proceder con el despliegue a producción de UNIMARKET."
    )
    pdf.multi_cell(0, 6, p5_2)

    # ----------------------------------------------------
    # PAGE 7: CONCLUSIÓN Y FIRMA
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "6. Conclusiones del Plan", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "", 11)
    conclusions = (
        "1. Adopción Rápida: Los perfiles segmentados reducen la curva de aprendizaje para vendedores y compradores.\n\n"
        "2. Reducción de Riesgos: Las pruebas UAT formalizan la aceptación del cliente bajo parámetros medibles de calidad.\n\n"
        "3. Estado de Listo para Producción: La API responde en promedio en 25 ms garantizando solidez para el hosting final."
    )
    pdf.multi_cell(0, 6, conclusions)
    
    pdf.ln(35)
    pdf.set_font("helvetica", "B", 11)
    pdf.cell(0, 6, "Elaborado y Validado por:", ln=True)
    pdf.set_font("helvetica", "", 11)
    pdf.cell(0, 6, "Valery Gisel Peña Pinto", ln=True)
    pdf.cell(0, 6, "Aprendiz del programa Análisis y Desarrollo de Software - SENA", ln=True)
    pdf.cell(0, 6, "Fecha: 31 de Julio de 2026", ln=True)
    
    pdf.output("Plan_Capacitacion_Pruebas_Aceptacion.pdf")
    print("PDF creado con éxito: Plan_Capacitacion_Pruebas_Aceptacion.pdf")

if __name__ == "__main__":
    create_pdf()
