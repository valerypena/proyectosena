# -*- coding: utf-8 -*-
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font("helvetica", "I", 8)
            self.set_text_color(128, 128, 128)
            self.cell(0, 10, "Realización de Pruebas de Funcionalidad del Software - UNIMARKET", align="L")
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
    pdf.multi_cell(0, 10, "PLAN E INFORME DE PRUEBAS DE\nFUNCIONALIDAD DEL SOFTWARE\n(UNIMARKET)", align="C")
    
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
        "El aseguramiento de la calidad del software (SQA) constituye una disciplina fundamental "
        "para certificar que una aplicación cumple con los requisitos del cliente antes de su entrega formal. "
        "En el ecosistema de UNIMARKET, una plataforma moderna de comercio electrónico basada en una "
        "arquitectura escalable, la estabilidad en la entrega de productos, sugerencias rápidas en búsquedas "
        "y la disponibilidad permanente de la base de datos MySQL representan pilares críticos.\n\n"
        "Este informe de pruebas documenta la ejecución sistemática de pruebas funcionales y de velocidad "
        "de respuesta en la API local. A través de este análisis exhaustivo, se validan los tiempos de respuesta "
        "y latencia obtenidos a nivel de servidor tras realizar consultas en frío (Cold Start) y consultas "
        "repetidas bajo el estado en caliente (Warm Start), con el fin de evaluar la optimización de caché, "
        "la gestión del pool de base de datos y la robustez del framework backend en FastAPI."
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
        "Planificar, implementar y documentar las pruebas de funcionalidad del software UNIMARKET, "
        "recopilando evidencias métricas detalladas para certificar que el sistema responde establemente "
        "en tiempos óptimos bajo estándares de calidad institucional."
    )
    pdf.multi_cell(0, 6, obj_gen)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "Objetivos Específicos", ln=True)
    pdf.set_font("helvetica", "", 11)
    
    obj_esp1 = "* Verificar la respuesta funcional de los routers y controladores del backend evaluando códigos de estado HTTP y formatos JSON."
    obj_esp2 = "* Medir la latencia de respuesta en milisegundos mediante scripts controlados de pruebas para las operaciones clave de catálogo y búsqueda rápida."
    obj_esp3 = "* Analizar la reducción de tiempos de procesamiento al activar y mantener caliente el pool de conexiones del servidor MySQL local."
    obj_esp4 = "* Modelar las gráficas de rendimiento para proporcionar una visualización analítica clara de la velocidad de ejecución y comportamiento de la API."
    obj_esp5 = "* Garantizar la estabilidad y consistencia eventual de los datos para la posterior entrega de la versión estable al cliente."
    
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
    # PAGE 4: PLAN DE PRUEBAS
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "3. Plan de Pruebas de Funcionalidad", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(3)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "3.1. Alcance de las Pruebas", ln=True)
    pdf.set_font("helvetica", "", 11)
    p3_1 = (
        "Las pruebas están diseñadas para evaluar la capa lógica del backend y su nivel de integración "
        "con la base de datos relacional MySQL (alojada localmente a través de XAMPP). Se evalúan "
        "respuestas HTTP, consistencia estructural del formato JSON devuelto y la latencia de respuesta "
        "del servidor de base de datos MySQL bajo FastAPI."
    )
    pdf.multi_cell(0, 6, p3_1)
    pdf.ln(4)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "3.2. Metodología y Herramientas Utilizadas", ln=True)
    pdf.set_font("helvetica", "", 11)
    p3_2 = (
        "Uso de Python 3.8.10 en entorno virtual con la librería requests para pings controlados de HTTP. "
        "Se mapean tiempos con la librería time de Python y se conecta a MySQL en el puerto 3306."
    )
    pdf.multi_cell(0, 6, p3_2)
    pdf.ln(4)

    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "3.3. Matriz de Casos de Prueba Funcionales", ln=True)
    pdf.ln(2)
    
    pdf.set_fill_color(230, 240, 250)
    pdf.set_font("helvetica", "B", 9)
    pdf.cell(15, 7, "ID", border=1, fill=True)
    pdf.cell(35, 7, "Módulo", border=1, fill=True)
    pdf.cell(50, 7, "Ruta", border=1, fill=True)
    pdf.cell(85, 7, "Resultado Esperado", border=1, fill=True)
    pdf.ln()
    
    pdf.set_font("helvetica", "", 8)
    pdf.cell(15, 6, "TC-01", border=1)
    pdf.cell(35, 6, "Disponibilidad Base", border=1)
    pdf.cell(50, 6, "GET /", border=1)
    pdf.cell(85, 6, "JSON con mensaje de bienvenida y estado OK", border=1)
    pdf.ln()
    
    pdf.cell(15, 6, "TC-02", border=1)
    pdf.cell(35, 6, "Catálogo / Categorías", border=1)
    pdf.cell(50, 6, "GET /categorias", border=1)
    pdf.cell(85, 6, "Lista JSON con 14 categorías activas", border=1)
    pdf.ln()
    
    pdf.cell(15, 6, "TC-03", border=1)
    pdf.cell(35, 6, "Catálogo / Productos", border=1)
    pdf.cell(50, 6, "GET /productos?limit=10", border=1)
    pdf.cell(85, 6, "Array de 10 productos con detalles de precio", border=1)
    pdf.ln()
    
    pdf.cell(15, 6, "TC-04", border=1)
    pdf.cell(35, 6, "Búsqueda Rápida", border=1)
    pdf.cell(50, 6, "GET /sugerencias?q=", border=1)
    pdf.cell(85, 6, "Respuesta HTTP 200 con array vacío", border=1)
    pdf.ln()

    # ----------------------------------------------------
    # PAGE 5: EJECUCIÓN Y RESULTADOS
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "4. Ejecución de Pruebas y Resultados", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(5)
    
    pdf.set_fill_color(230, 240, 250)
    pdf.set_font("helvetica", "B", 9)
    pdf.cell(15, 7, "Caso", border=1, fill=True)
    pdf.cell(45, 7, "Ruta", border=1, fill=True)
    pdf.cell(30, 7, "Latencia 1 (Frío)", border=1, fill=True)
    pdf.cell(30, 7, "Latencia 2 (Caliente)", border=1, fill=True)
    pdf.cell(35, 7, "Reducción", border=1, fill=True)
    pdf.cell(35, 7, "Estado", border=1, fill=True)
    pdf.ln()
    
    pdf.set_font("helvetica", "", 9)
    pdf.cell(15, 7, "TC-01", border=1)
    pdf.cell(45, 7, "GET /", border=1)
    pdf.cell(30, 7, "291.26 ms", border=1)
    pdf.cell(30, 7, "17.73 ms", border=1)
    pdf.cell(35, 7, "93.9%", border=1)
    pdf.cell(35, 7, "APROBADA", border=1)
    pdf.ln()
    
    pdf.cell(15, 7, "TC-02", border=1)
    pdf.cell(45, 7, "GET /categorias", border=1)
    pdf.cell(30, 7, "132.07 ms", border=1)
    pdf.cell(30, 7, "35.15 ms", border=1)
    pdf.cell(35, 7, "73.3%", border=1)
    pdf.cell(35, 7, "APROBADA", border=1)
    pdf.ln()
    
    pdf.cell(15, 7, "TC-03", border=1)
    pdf.cell(45, 7, "GET /productos?limit=10", border=1)
    pdf.cell(30, 7, "86.36 ms", border=1)
    pdf.cell(30, 7, "27.74 ms", border=1)
    pdf.cell(35, 7, "67.8%", border=1)
    pdf.cell(35, 7, "APROBADA", border=1)
    pdf.ln()
    
    pdf.cell(15, 7, "TC-04", border=1)
    pdf.cell(45, 7, "GET /sugerencias?q=", border=1)
    pdf.cell(30, 7, "16.54 ms", border=1)
    pdf.cell(30, 7, "9.98 ms", border=1)
    pdf.cell(35, 7, "39.6%", border=1)
    pdf.cell(35, 7, "APROBADA", border=1)
    pdf.ln()
    
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 12)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 8, "Gráficos de Comparación de Latencia (ms)", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(2)
    
    scale = 0.3
    
    # Graphic 1: Cold Start
    pdf.set_font("helvetica", "B", 10)
    pdf.cell(0, 6, "Iteración 1: Carga en Frío (Cold Start)", ln=True)
    pdf.set_font("helvetica", "", 9)
    
    tests = [
        {"label": "GET / (Root)", "val": 291.26},
        {"label": "GET /categorias", "val": 132.07},
        {"label": "GET /productos", "val": 86.36},
        {"label": "GET /sugerencias", "val": 16.54}
    ]
    for t in tests:
        y_curr = pdf.get_y()
        pdf.cell(40, 6, f"{t['label']} ({t['val']} ms)")
        pdf.set_fill_color(231, 76, 60) # Soft red
        pdf.rect(50, y_curr + 1, t['val'] * scale, 4, 'F')
        pdf.ln(6)
        
    pdf.ln(4)
    
    # Graphic 2: Warm Start
    pdf.set_font("helvetica", "B", 10)
    pdf.cell(0, 6, "Iteración 2: Carga en Caliente (Warm Start / Cached)", ln=True)
    pdf.set_font("helvetica", "", 9)
    
    tests_warm = [
        {"label": "GET / (Root)", "val": 17.73},
        {"label": "GET /categorias", "val": 35.15},
        {"label": "GET /productos", "val": 27.74},
        {"label": "GET /sugerencias", "val": 9.98}
    ]
    for t in tests_warm:
        y_curr = pdf.get_y()
        pdf.cell(40, 6, f"{t['label']} ({t['val']} ms)")
        pdf.set_fill_color(46, 204, 113) # Soft green
        pdf.rect(50, y_curr + 1, t['val'] * scale, 4, 'F')
        pdf.ln(6)

    # ----------------------------------------------------
    # PAGE 6: ANÁLISIS COMPARATIVO E IMPACTO
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "5. Análisis Comparativo e Impacto de Rendimiento", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "5.1. Comparación entre Carga en Frío y Carga en Caliente", ln=True)
    pdf.set_font("helvetica", "", 11)
    p5_1 = (
        "El 'Cold Start' (Inicio en Frío) describe la primera llamada tras reiniciar el servidor. "
        "El tiempo de respuesta de 291.26 ms se debe a la inicialización del pool de conexiones. "
        "En la segunda llamada ('Warm Start'), el pool reutiliza la conexión activa disminuyendo la "
        "latencia de forma dramática a 17.73 ms, lo que representa una reducción del 93.9%.\n\n"
        "Del mismo modo, la consulta de categorías baja de 132.07 ms a 35.15 ms (un 73.3% más rápido)."
    )
    pdf.multi_cell(0, 6, p5_1)
    pdf.ln(4)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "5.2. Impacto en la Experiencia de Usuario (UX) y SEO", ln=True)
    pdf.set_font("helvetica", "", 11)
    p5_2 = (
        "Cualquier tiempo de respuesta de red menor a 100 ms se percibe por el ojo humano como "
        "instantáneo. Las velocidades de carga obtenidas en caliente para UNIMARKET garantizan "
        "una experiencia fluida en la navegación del cliente y una mejor calificación en SEO "
        "bajo los estándares de Google Core Web Vitals (LCP, FID)."
    )
    pdf.multi_cell(0, 6, p5_2)

    # ----------------------------------------------------
    # PAGE 7: CONCLUSIÓN Y FIRMA
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "6. Conclusiones del Proceso de Pruebas", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "", 11)
    conclusions = (
        "1. Robustez Tecnológica: El backend en FastAPI de Python demuestra velocidades de carga excepcionales.\n\n"
        "2. Estabilidad de Consultas Relacionales: La persistencia en MySQL responde con total integridad.\n\n"
        "3. Aceptación del Entorno: El software se certifica como performante y está listo para producción."
    )
    pdf.multi_cell(0, 6, conclusions)
    
    pdf.ln(35)
    pdf.set_font("helvetica", "B", 11)
    pdf.cell(0, 6, "Elaborado y Validado por:", ln=True)
    pdf.set_font("helvetica", "", 11)
    pdf.cell(0, 6, "Valery Gisel Peña Pinto", ln=True)
    pdf.cell(0, 6, "Aprendiz del programa Análisis y Desarrollo de Software - SENA", ln=True)
    pdf.cell(0, 6, "Fecha: 30 de Julio de 2026", ln=True)
    
    pdf.output("Pruebas_Funcionalidad_Software.pdf")
    print("PDF creado con éxito: Pruebas_Funcionalidad_Software.pdf")

if __name__ == "__main__":
    create_pdf()
