# -*- coding: utf-8 -*-
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font("helvetica", "I", 8)
            self.set_text_color(128, 128, 128)
            self.cell(0, 10, "Documentación de Plan de Migración y Respaldo de Datos - UNIMARKET", align="L")
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
    pdf.multi_cell(0, 10, "DISEÑO DEL PLAN DE MIGRACIÓN Y\nRESPALDO DE DATOS DEL SOFTWARE\n(UNIMARKET)", align="C")
    
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
        "La información transaccional, comercial y de usuario es el activo más valioso de cualquier "
        "plataforma digital. Para la plataforma UNIMARKET, que opera bajo un ecosistema híbrido compuesto "
        "por bases de datos relacionales (MySQL) y no relacionales (MongoDB), asegurar que la transición "
        "de los datos hacia servidores en la nube se realice sin pérdidas ni corrupción representa un requisito "
        "operativo de máxima prioridad.\n\n"
        "Este Plan de Migración y Respaldo de Datos establece los lineamientos, metodologías y protocolos "
        "de seguridad técnica requeridos para mover las bases de datos locales (desarrolladas sobre XAMPP) "
        "hacia servicios gestionados en la nube (como Supabase/Aiven para MySQL y MongoDB Atlas para MongoDB). "
        "Asimismo, define la estrategia preventiva de copias de seguridad de datos (Backups) para mitigar cualquier "
        "riesgo de pérdida accidental, corrupción o ciberataques en producción."
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
        "Diseñar y estructurar un plan metodológico de migración y políticas de respaldo para asegurar la "
        "transferencia íntegra, segura y oportuna de los datos del software UNIMARKET desde el entorno local "
        "del cliente hacia servidores de bases de datos en la nube."
    )
    pdf.multi_cell(0, 6, obj_gen)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "Objetivos Específicos", ln=True)
    pdf.set_font("helvetica", "", 11)
    
    obj_esp1 = "* Establecer la metodología de migración evaluando el alcance, mapeo de tablas SQL y colecciones documentales NoSQL de UNIMARKET."
    obj_esp2 = "* Seleccionar y documentar las herramientas idóneas de extracción y carga de información (mysqldump y scripts de carga masiva)."
    obj_esp3 = "* Fijar métricas operativas de respaldo como RPO (Recovery Point Objective) y RTO (Recovery Time Objective) adaptadas a la escala de UNIMARKET."
    obj_esp4 = "* Diseñar el plan de contingencia y restauración paso a paso para asegurar la continuidad de negocio ante incidentes catastróficos."
    obj_esp5 = "* Garantizar la protección de datos confidenciales mediante políticas de cifrado robusto durante la transferencia y el almacenamiento."
    
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
    # PAGE 4: PLAN Y ESTRATEGIA DE MIGRACIÓN
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "3. Plan y Estrategia de Migración de Datos", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(3)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "3.1. Evaluación y Mapeo de Esquemas", ln=True)
    pdf.set_font("helvetica", "", 11)
    p3_1 = (
        "Se realiza un mapeo exhaustivo para garantizar que los esquemas locales coincidan con las instancias "
        "remotas. En MySQL se verifica la integridad referencial de llaves foráneas y tipos de datos (usuarios, "
        "productos, categorias, pedidos). En MongoDB se validan colecciones flexibles de carritos e historiales."
    )
    pdf.multi_cell(0, 6, p3_1)
    pdf.ln(4)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "3.2. Estrategia de Migración en Frío", ln=True)
    pdf.set_font("helvetica", "", 11)
    p3_2 = (
        "Se ha seleccionado una estrategia de Migración en Frío (Cold Migration) desactivando de forma programada "
        "las rutas de entrada del servidor local. Esto elimina la posibilidad de inconsistencias o transacciones "
        "a mitad del proceso de importación."
    )
    pdf.multi_cell(0, 6, p3_2)

    # ----------------------------------------------------
    # PAGE 5: PROCESO DE EJECUCIÓN
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "4. Proceso de Ejecución de la Migración", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "4.1. Pasos de la Migración Paso a Paso", ln=True)
    pdf.set_font("helvetica", "", 11)
    p4_1 = (
        "1. Respaldo Final de Origen: Detener microservicios y generar volcado completo local mediante mysqldump.\n"
        "2. Aprovisionamiento en Nube: Inicializar instancias de base de datos vacías en la nube.\n"
        "3. Restauración de Esquema: Importar sentencias SQL y esquemas de relaciones en la base de datos remota.\n"
        "4. Importación NoSQL: Migrar datos semi-estructurados locales hacia MongoDB Atlas."
    )
    pdf.multi_cell(0, 6, p4_1)
    pdf.ln(4)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "4.2. Pruebas de Humo e Integridad Post-Migración", ln=True)
    pdf.set_font("helvetica", "", 11)
    p4_2 = (
        "Se realizan chequeos de suma de comprobación (checksums) y conteo de filas cruzadas sobre tablas de productos "
        "y usuarios para asegurar que no ocurriera pérdida parcial de información comercial."
    )
    pdf.multi_cell(0, 6, p4_2)

    # ----------------------------------------------------
    # PAGE 6: ESTRATEGIA DE RESPALDO (BACKUPS)
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "5. Estrategia de Respaldo de Datos (Backups)", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "5.1. Definición de RPO y RTO", ln=True)
    pdf.set_font("helvetica", "", 11)
    p5_1 = (
        "- Recovery Point Objective (RPO): Fijado en 24 horas. Máxima pérdida aceptable ante fallos.\n"
        "- Recovery Time Objective (RTO): Fijado en 4 horas. Tiempo máximo para restablecer la API y bases de datos."
    )
    pdf.multi_cell(0, 6, p5_1)
    pdf.ln(5)
    
    pdf.set_fill_color(230, 240, 250)
    pdf.set_font("helvetica", "B", 9)
    pdf.cell(40, 7, "Base de Datos", border=1, fill=True)
    pdf.cell(40, 7, "Frecuencia", border=1, fill=True)
    pdf.cell(50, 7, "Tipo de Respaldo", border=1, fill=True)
    pdf.cell(50, 7, "Destino Seguro", border=1, fill=True)
    pdf.ln()
    
    pdf.set_font("helvetica", "", 9)
    pdf.cell(40, 7, "MySQL Relacional", border=1)
    pdf.cell(40, 7, "Diario (02:00 AM)", border=1)
    pdf.cell(50, 7, "Completo (Lógico)", border=1)
    pdf.cell(50, 7, "AWS S3 (AES-256)", border=1)
    pdf.ln()
    
    pdf.cell(40, 7, "MongoDB NoSQL", border=1)
    pdf.cell(40, 7, "Semanal (Domingos)", border=1)
    pdf.cell(50, 7, "Incremental", border=1)
    pdf.cell(50, 7, "AWS S3 (AES-256)", border=1)
    pdf.ln()

    # ----------------------------------------------------
    # PAGE 7: RESTAURACIÓN Y CONCLUSIONES
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "6. Protocolo de Restauración y Conclusiones", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "6.1. Protocolo de Continuidad", ln=True)
    pdf.set_font("helvetica", "", 11)
    p7_1 = (
        "Ante desastres, se detiene el tráfico del API Gateway y se restaura el backup consistente desde AWS S3 "
        "sobre las instancias de producción, seguido de pruebas de humo para habilitar el servicio en producción."
    )
    pdf.multi_cell(0, 6, p7_1)
    pdf.ln(4)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "7. Conclusiones del Plan", ln=True)
    pdf.set_font("helvetica", "", 11)
    conclusions = (
        "1. La migración en frío garantiza la transferencia completa de datos relacionales sin inconsistencias.\n\n"
        "2. El plan de backups y cifrado AES-256 blinda la información contra pérdidas lógicas y accesos no autorizados.\n\n"
        "3. El protocolo RTO y RPO proporciona un esquema sólido de continuidad de negocio para UNIMARKET."
    )
    pdf.multi_cell(0, 6, conclusions)
    
    pdf.ln(25)
    pdf.set_font("helvetica", "B", 11)
    pdf.cell(0, 6, "Elaborado y Validado por:", ln=True)
    pdf.set_font("helvetica", "", 11)
    pdf.cell(0, 6, "Valery Gisel Peña Pinto", ln=True)
    pdf.cell(0, 6, "Aprendiz del programa Análisis y Desarrollo de Software - SENA", ln=True)
    pdf.cell(0, 6, "Fecha: 30 de Julio de 2026", ln=True)
    
    pdf.output("Plan_Migracion_Respaldo_Datos.pdf")
    print("PDF creado con éxito: Plan_Migracion_Respaldo_Datos.pdf")

if __name__ == "__main__":
    create_pdf()
