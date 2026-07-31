# -*- coding: utf-8 -*-
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font("helvetica", "I", 8)
            self.set_text_color(128, 128, 128)
            self.cell(0, 10, "Conceptos y Principios de Configuración de Servicios - UNIMARKET", align="L")
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
    pdf.multi_cell(0, 10, "DOCUMENTO DE CONCEPTOS Y PRINCIPIOS\nACERCA DE CONFIGURACIÓN DE SERVICIOS\nY MICROSERVICIOS (UNIMARKET)", align="C")
    
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
        "En el desarrollo de software moderno, la transición desde arquitecturas monolíticas hacia "
        "sistemas basados en microservicios ha introducido la necesidad de establecer metodologías "
        "claras para la configuración y el despliegue de múltiples servicios independientes. La "
        "configuración adecuada de los servicios garantiza la portabilidad de la aplicación, permitiendo "
        "que el mismo código se ejecute en entornos locales de desarrollo, entornos de prueba y servidores "
        "en la nube sin necesidad de modificar el código fuente.\n\n"
        "Este documento expone los conceptos y principios teóricos y prácticos que rigen la configuración "
        "de servicios, y detalla su aplicación práctica dentro de la arquitectura de microservicios de "
        "UNIMARKET, justificando la integración de tecnologías híbridas como bases de datos SQL y NoSQL "
        "estructuradas en un ecosistema de alta disponibilidad."
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
        "Definir y fundamentar los conceptos y principios teóricos sobre la configuración de servicios, "
        "aplicándolos directamente al diseño e infraestructura de microservicios del sistema UNIMARKET."
    )
    pdf.multi_cell(0, 6, obj_gen)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "Objetivos Específicos", ln=True)
    pdf.set_font("helvetica", "", 11)
    
    obj_esp1 = "* Explicar los principios clave de configuración de software, haciendo especial énfasis en las variables de entorno y en la separación de código y configuración."
    obj_esp2 = "* Analizar los conceptos de la arquitectura orientada a eventos (EDA), el patrón Outbox y la consistencia eventual."
    obj_esp3 = "* Detallar la estructura de configuración del stack de UNIMARKET (API Gateway, colas de mensajería, bases de datos y caché en memoria)."
    obj_esp4 = "* Demostrar el uso práctico de herramientas de infraestructura como Docker Compose y Render Blueprints para automatizar el levantamiento de entornos aislados."
    
    pdf.multi_cell(0, 6, obj_esp1)
    pdf.ln(2)
    pdf.multi_cell(0, 6, obj_esp2)
    pdf.ln(2)
    pdf.multi_cell(0, 6, obj_esp3)
    pdf.ln(2)
    pdf.multi_cell(0, 6, obj_esp4)

    # ----------------------------------------------------
    # PAGE 4: CONCEPTOS FUNDAMENTALES Y PRINCIPIOS
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "3. Conceptos y Principios Teóricos", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(3)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "3.1. Separación de Código y Configuración", ln=True)
    pdf.set_font("helvetica", "", 11)
    p3_1 = (
        "Según el estándar de 'Twelve-Factor App', toda la configuración que varíe entre despliegues "
        "(credenciales, hosts, puertos) debe mantenerse separada del código fuente mediante variables de "
        "entorno (.env). Esto garantiza la portabilidad y la seguridad del sistema."
    )
    pdf.multi_cell(0, 6, p3_1)
    pdf.ln(4)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "3.2. Tolerancia a Fallos", ln=True)
    pdf.set_font("helvetica", "", 11)
    p3_2 = (
        "Se implementan patrones como Circuit Breaker (disyuntor) para frenar peticiones en cascada "
        "cuando un servicio falla, y Retry Pattern con retraso exponencial para reintentar transacciones temporales."
    )
    pdf.multi_cell(0, 6, p3_2)
    pdf.ln(4)

    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "3.3. Arquitectura Event-Driven y Consistencia Eventual", ln=True)
    pdf.set_font("helvetica", "", 11)
    p3_3 = (
        "En lugar de transacciones distribuidas complejas, los microservicios publican eventos a través "
        "de RabbitMQ. El Sync Service escucha y sincroniza MySQL y MongoDB de forma asíncrona, logrando "
        "consistencia eventual de la información."
    )
    pdf.multi_cell(0, 6, p3_3)

    # ----------------------------------------------------
    # PAGE 5: CONFIGURACIÓN EN UNIMARKET
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "4. Configuración de Servicios en UNIMARKET", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(3)
    
    pdf.set_font("helvetica", "", 11)
    p4_text = (
        "UNIMARKET utiliza Docker Compose para levantar todos los servicios de infraestructura de red:\n"
        "- API Gateway (Puerto 8000): Enrutamiento único hacia los microservicios.\n"
        "- Auth & User Services (MySQL): Persistencia transaccional relacional en el puerto 3306.\n"
        "- Cart & Notification Services (MongoDB): Colecciones JSON documentales en el puerto 27017.\n"
        "- RabbitMQ (Puerto 5672): Bus de mensajería para sincronización asíncrona.\n"
        "- Redis (Puerto 6379): Caché en memoria de alto rendimiento."
    )
    pdf.multi_cell(0, 6, p4_text)
    
    pdf.ln(35)
    pdf.set_font("helvetica", "B", 11)
    pdf.cell(0, 6, "Elaborado y Validado por:", ln=True)
    pdf.set_font("helvetica", "", 11)
    pdf.cell(0, 6, "Valery Gisel Peña Pinto", ln=True)
    pdf.cell(0, 6, "Aprendiz del programa Análisis y Desarrollo de Software - SENA", ln=True)
    pdf.cell(0, 6, "Fecha: 30 de Julio de 2026", ln=True)
    
    pdf.output("Conceptos_Configuracion_Servicios.pdf")
    print("PDF creado con éxito: Conceptos_Configuracion_Servicios.pdf")

if __name__ == "__main__":
    create_pdf()
