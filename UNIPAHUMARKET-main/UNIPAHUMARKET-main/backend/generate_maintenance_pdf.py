# -*- coding: utf-8 -*-
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font("helvetica", "I", 8)
            self.set_text_color(128, 128, 128)
            self.cell(0, 10, "Diseño de Plan de Mantenimiento y Soporte del Software - UNIMARKET", align="L")
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
    pdf.multi_cell(0, 10, "DISEÑO DEL PLAN DE MANTENIMIENTO\nY SOPORTE DEL SOFTWARE\n(UNIMARKET)", align="C")
    
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
        "El ciclo de vida del desarrollo de software no finaliza con el despliegue del sistema en "
        "producción. Para asegurar que la plataforma UNIMARKET siga operando de manera eficiente, estable "
        "y segura a lo largo del tiempo, es indispensable contar con un marco normativo y metodológico "
        "que defina las actividades de sostenimiento.\n\n"
        "Este Plan de Mantenimiento y Soporte del Software establece los procesos requeridos para la corrección "
        "de errores, la adaptación técnica a nuevos entornos informáticos, la optimización de los tiempos de "
        "respuesta y la prevención de fallos críticos. La arquitectura híbrida y distribuida de UNIMARKET "
        "(que combina microservicios NodeJS, colas RabbitMQ, caché en Redis, y bases de datos MySQL y MongoDB) "
        "exige políticas rigurosas de respaldo y soporte técnico para garantizar una alta disponibilidad de "
        "los servicios comerciales expuestos a los usuarios finales."
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
        "Diseñar y estructurar un plan estratégico de mantenimiento y soporte de software para la plataforma "
        "UNIMARKET que maximice la disponibilidad del sistema, garantice la seguridad de las transacciones "
        "y minimice los tiempos de inactividad técnica."
    )
    pdf.multi_cell(0, 6, obj_gen)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "Objetivos Específicos", ln=True)
    pdf.set_font("helvetica", "", 11)
    
    obj_esp1 = "* Definir los tipos de mantenimiento (correctivo, preventivo, adaptativo y perfectivo) con actividades técnicas concretas aplicadas a UNIMARKET."
    obj_esp2 = "* Asignar roles y responsabilidades técnicos claros dentro del equipo de desarrollo y soporte."
    obj_esp3 = "* Establecer Acuerdos de Niveles de Servicio (SLA) para clasificar incidentes y fijar tiempos límite de resolución de errores."
    obj_esp4 = "* Definir las políticas de copia de seguridad periódica para resguardar la información de las bases de datos SQL y NoSQL."
    obj_esp5 = "* Garantizar la resiliencia del software mediante protocolos ordenados de recuperación ante fallos de conectividad o colapso de servidores."
    
    pdf.multi_cell(0, 6, obj_esp1)
    pdf.ln(2)
    pdf.multi_cell(0, 6, obj_esp2)
    pdf.ln(2)
    pdf.multi_cell(0, 6, obj_esp3)
    pdf.ln(2)
    pdf.multi_cell(0, 6, obj_esp4)
    pdf.ln(2)
    pdf.multi_cell(0, 6, obj_esp5)

    # ----------------------------------------------------
    # PAGE 4: TIPOS DE MANTENIMIENTO
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "3. Tipos de Mantenimiento Aplicados", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(3)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "3.1. Mantenimiento Correctivo", ln=True)
    pdf.set_font("helvetica", "", 11)
    p3_1 = (
        "Consiste en la identificación, reporte y resolución de bugs o errores en caliente. "
        "En UNIMARKET, esto abarca la corrección de errores en endpoints de la API, fallos visuales "
        "en el Frontend de React, y enrutamientos incorrectos en el API Gateway."
    )
    pdf.multi_cell(0, 6, p3_1)
    pdf.ln(4)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "3.2. Mantenimiento Preventivo", ln=True)
    pdf.set_font("helvetica", "", 11)
    p3_2 = (
        "Orientado a evitar fallos potenciales. Incluye la optimización periódica de índices en la base de datos "
        "MySQL, la limpieza automática de sesiones expiradas en Redis y del log en MongoDB, y el monitoreo "
        "del espacio en disco de almacenamiento."
    )
    pdf.multi_cell(0, 6, p3_2)
    pdf.ln(4)

    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "3.3. Mantenimientos Adaptativo y Perfectivo", ln=True)
    pdf.set_font("helvetica", "", 11)
    p3_3 = (
        "Garantiza que la aplicación se adapte a cambios externos (como parches de seguridad de dependencias) "
        "e implementa optimizaciones para mejorar el rendimiento del catálogo de productos y refactorizar "
        "el código base bajo principios SOLID."
    )
    pdf.multi_cell(0, 6, p3_3)

    # ----------------------------------------------------
    # PAGE 5: ROLES Y CANALES DE SOPORTE
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "4. Roles, Responsabilidades y Canales de Soporte", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "4.1. Estructura de Roles del Equipo Técnico", ln=True)
    pdf.set_font("helvetica", "", 11)
    p4_1 = (
        "- Administrador de Bases de Datos (DBA): Asegura el rendimiento de MySQL/MongoDB y la integridad de copias de seguridad.\n"
        "- Desarrollador Backend: Encargado de mantener y corregir la lógica de la API.\n"
        "- Desarrollador Frontend: Encargado del mantenimiento de la interfaz del usuario en React.\n"
        "- Ingeniero de DevOps/Soporte: Responsable del monitoreo de logs de red y despliegue continuo."
    )
    pdf.multi_cell(0, 6, p4_1)
    pdf.ln(4)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "4.2. Canales de Reporte y Niveles de Escalado", ln=True)
    pdf.set_font("helvetica", "", 11)
    p4_2 = (
        "- Nivel 1 (Soporte Básico): Registro inicial del ticket de soporte.\n"
        "- Nivel 2 (Soporte de Desarrollo): Ingenieros frontend/backend solucionando bugs de lógica de negocio.\n"
        "- Nivel 3 (Soporte de Infraestructura / DBA): Caídas críticas de bases de datos o servidores."
    )
    pdf.multi_cell(0, 6, p4_2)

    # ----------------------------------------------------
    # PAGE 6: ACUERDOS DE SERVICIO (SLA)
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "5. Acuerdos de Niveles de Servicio (SLA)", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "", 11)
    p5_intro = (
        "Los fallos reportados en la plataforma UNIMARKET se clasificarán según su severidad de negocio. "
        "A continuación se presenta la matriz de tiempos límites de respuesta y resolución programada:"
    )
    pdf.multi_cell(0, 6, p5_intro)
    pdf.ln(5)
    
    pdf.set_fill_color(230, 240, 250)
    pdf.set_font("helvetica", "B", 9)
    pdf.cell(40, 7, "Clasificación de Incidente", border=1, fill=True)
    pdf.cell(60, 7, "Tiempo Límite Respuesta", border=1, fill=True)
    pdf.cell(80, 7, "Tiempo Máximo de Solución", border=1, fill=True)
    pdf.ln()
    
    pdf.set_font("helvetica", "", 9)
    pdf.cell(40, 7, "Severidad 1 (Crítica)", border=1)
    pdf.cell(60, 7, "Menos de 30 minutos", border=1)
    pdf.cell(80, 7, "Máximo 4 horas", border=1)
    pdf.ln()
    
    pdf.cell(40, 7, "Severidad 2 (Alta)", border=1)
    pdf.cell(60, 7, "Menos de 2 horas", border=1)
    pdf.cell(80, 7, "Máximo 24 horas", border=1)
    pdf.ln()
    
    pdf.cell(40, 7, "Severidad 3 (Media)", border=1)
    pdf.cell(60, 7, "Menos de 8 horas", border=1)
    pdf.cell(80, 7, "Máximo 72 horas", border=1)
    pdf.ln()
    
    pdf.cell(40, 7, "Severidad 4 (Baja)", border=1)
    pdf.cell(60, 7, "Menos de 24 horas", border=1)
    pdf.cell(80, 7, "Siguiente release programado", border=1)
    pdf.ln()

    # ----------------------------------------------------
    # PAGE 7: COPIAS DE SEGURIDAD Y CONCLUSIONES
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "6. Copias de Seguridad y Conclusiones", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "6.1. Plan de Backups", ln=True)
    pdf.set_font("helvetica", "", 11)
    p6_1 = (
        "- MySQL: Tarea diaria programada a las 02:00 AM para exportar la base de datos y guardarla cifrada.\n"
        "- MongoDB: Respaldos incrementales semanales los domingos para el historial de transacciones."
    )
    pdf.multi_cell(0, 6, p6_1)
    pdf.ln(4)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "7. Conclusiones del Plan", ln=True)
    pdf.set_font("helvetica", "", 11)
    conclusions = (
        "1. Garantía de Sostenibilidad: Asegura la operatividad sin degradación a mediano y largo plazo.\n\n"
        "2. Mitigación de Riesgos: Los backups protegen al 100% la información ante cualquier caída física del servidor.\n\n"
        "3. Satisfacción de Cliente: El acatamiento a los SLAs asegura soporte rápido a fallos críticos."
    )
    pdf.multi_cell(0, 6, conclusions)
    
    pdf.ln(25)
    pdf.set_font("helvetica", "B", 11)
    pdf.cell(0, 6, "Elaborado y Validado por:", ln=True)
    pdf.set_font("helvetica", "", 11)
    pdf.cell(0, 6, "Valery Gisel Peña Pinto", ln=True)
    pdf.cell(0, 6, "Aprendiz del programa Análisis y Desarrollo de Software - SENA", ln=True)
    pdf.cell(0, 6, "Fecha: 30 de Julio de 2026", ln=True)
    
    pdf.output("Plan_Mantenimiento_Soporte.pdf")
    print("PDF creado con éxito: Plan_Mantenimiento_Soporte.pdf")

if __name__ == "__main__":
    create_pdf()
